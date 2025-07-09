<?php

namespace App\Http\Controllers;

use App\Models\Pinjaman;
use App\Models\User;
use App\Services\WhatsAppService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class WorkflowController extends Controller
{
    protected $whatsAppService;

    public function __construct(WhatsAppService $whatsAppService)
    {
        $this->whatsAppService = $whatsAppService;
    }

    /**
     * Ambil pinjaman untuk dikerjakan (lock)
     */
    public function takePinjaman(Request $request, Pinjaman $pinjaman)
    {
        $user = Auth::user();

        // Validasi catatan opsional dari request
        $catatan = $request->input('catatan', 'Berkas diambil untuk diproses');

        // Debug information
        Log::info('Take Pinjaman Attempt', [
            'user_id' => $user->id,
            'user_role' => $user->role,
            'pinjaman_id' => $pinjaman->id,
            'pinjaman_status' => $pinjaman->status,
            'pinjaman_locked_by' => $pinjaman->locked_by,
            'pinjaman_locked_at' => $pinjaman->locked_at,
            'admin_kredit_id' => $pinjaman->admin_kredit_id,
            'analis_id' => $pinjaman->analis_id,
            'pemutus_id' => $pinjaman->pemutus_id
        ]);

        if (!$pinjaman->canBeTakenByUser($user)) {
            $errorMessage = $this->getCannotTakeReason($pinjaman, $user);

            Log::warning('Cannot take pinjaman', [
                'user_id' => $user->id,
                'pinjaman_id' => $pinjaman->id,
                'reason' => $errorMessage
            ]);

            return response()->json([
                'success' => false,
                'message' => $errorMessage
            ], 403);
        }

        if ($pinjaman->lockForUser($user, $catatan)) {
            // Send WhatsApp notification to nasabah
            $this->whatsAppService->sendNotificationToNasabah($pinjaman, 'taken', $user);

            Log::info('Pinjaman taken successfully', [
                'user_id' => $user->id,
                'pinjaman_id' => $pinjaman->id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Berkas berhasil diambil dan dikunci untuk Anda. Notifikasi WhatsApp telah dikirim ke nasabah.',
                'pinjaman' => $pinjaman->load(['nasabah', 'stafInput', 'adminKredit', 'analis', 'pemutus'])
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Gagal mengambil berkas. Silakan coba lagi.'
        ], 500);
    }

    /**
     * Lepas pinjaman (unlock)
     */
    public function releasePinjaman(Request $request, Pinjaman $pinjaman)
    {
        $user = Auth::user();

        // Catatan tidak wajib untuk release, tapi jika ada maka minimal 10 karakter
        $catatan = $request->input('catatan', 'Berkas dilepas oleh user');

        if ($catatan && strlen($catatan) < 10) {
            return response()->json([
                'success' => false,
                'message' => 'Jika mengisi catatan, minimal 10 karakter diperlukan.'
            ], 422);
        }

        if (!$pinjaman->isOwnedByUser($user)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak dapat melepas berkas ini. Berkas tidak dikunci oleh Anda.'
            ], 403);
        }

        if ($pinjaman->unlockFromUser($user, $catatan)) {
            // Send WhatsApp notification to nasabah
            $this->whatsAppService->sendNotificationToNasabah($pinjaman, 'released', $user);

            return response()->json([
                'success' => true,
                'message' => 'Berkas berhasil dilepas. Notifikasi WhatsApp telah dikirim ke nasabah.',
                'pinjaman' => $pinjaman->load(['nasabah', 'stafInput', 'adminKredit', 'analis', 'pemutus'])
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Gagal melepas berkas. Silakan coba lagi.'
        ], 500);
    }

    /**
     * Teruskan ke tahap berikutnya
     */
    public function advancePinjaman(Request $request, Pinjaman $pinjaman)
    {
        $user = Auth::user();

        // Validasi catatan wajib
        $request->validate([
            'catatan' => 'required|string|min:10|max:1000',
        ], [
            'catatan.required' => 'Catatan wajib diisi saat meneruskan berkas.',
            'catatan.min' => 'Catatan minimal 10 karakter.',
        ]);

        if ($pinjaman->advanceToNextStage($user, $request->only('catatan'))) {
            $nextStage = $this->getNextStageName($user->role);

            // Send WhatsApp notification to next admin
            $this->whatsAppService->sendNotificationToNextAdmin($pinjaman, $user, 'advance');

            // Send WhatsApp notification to nasabah
            $this->whatsAppService->sendNotificationToNasabah($pinjaman, 'advanced', $user);

            return response()->json([
                'success' => true,
                'message' => "Berkas berhasil diteruskan ke tahap {$nextStage}. Notifikasi WhatsApp telah dikirim ke admin berikutnya.",
                'pinjaman' => $pinjaman->load(['nasabah', 'stafInput', 'adminKredit', 'analis', 'pemutus'])
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Gagal meneruskan berkas. Pastikan Anda memiliki akses dan berkas sudah dikunci untuk Anda.'
        ], 400);
    }

    /**
     * Kembalikan ke tahap sebelumnya
     */
    public function returnPinjaman(Request $request, Pinjaman $pinjaman)
    {
        $user = Auth::user();

        $request->validate([
            'reason' => 'required|string|min:10|max:1000',
        ], [
            'reason.required' => 'Alasan pengembalian wajib diisi.',
            'reason.min' => 'Alasan minimal 10 karakter.',
        ]);

        if ($pinjaman->returnToPreviousStage($user, $request->reason)) {
            // Send WhatsApp notification to previous admin
            $this->whatsAppService->sendNotificationToNextAdmin($pinjaman, $user, 'return');

            // Send WhatsApp notification to nasabah
            $this->whatsAppService->sendNotificationToNasabah($pinjaman, 'returned', $user);

            return response()->json([
                'success' => true,
                'message' => 'Berkas berhasil dikembalikan. Notifikasi WhatsApp telah dikirim ke admin sebelumnya.',
                'pinjaman' => $pinjaman->load(['nasabah', 'stafInput', 'adminKredit', 'analis', 'pemutus'])
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Gagal mengembalikan berkas.'
        ], 400);
    }

    /**
     * Keputusan final (approve/reject)
     */
    public function finalDecision(Request $request, Pinjaman $pinjaman)
    {
        $user = Auth::user();

        if ($user->role !== 'pemutus' || !$pinjaman->isOwnedByUser($user)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk membuat keputusan akhir pada berkas ini.'
            ], 403);
        }

        $request->validate([
            'decision' => 'required|in:approve,reject',
            'catatan' => 'required|string|min:10|max:1000',
        ], [
            'decision.required' => 'Keputusan wajib dipilih.',
            'catatan.required' => 'Catatan keputusan wajib diisi.',
            'catatan.min' => 'Catatan minimal 10 karakter.',
        ]);

        $status = $request->decision === 'approve'
            ? Pinjaman::STATUS_DISETUJUI
            : Pinjaman::STATUS_DITOLAK;

        $pinjaman->update([
            'status' => $status,
            'catatan' => $request->catatan,
            'locked_at' => null, // Final decision unlocks the record
        ]);

        // Log activity
        $action = $request->decision === 'approve' ? 'approve_final' : 'reject_final';
        $description = $request->decision === 'approve'
            ? 'Pinjaman disetujui'
            : 'Pinjaman ditolak: ' . $request->catatan;

        $pinjaman->logActivity($action, $description, $user);

        // Send final notification to nasabah
        $action = $request->decision === 'approve' ? 'approved' : 'rejected';
        $this->whatsAppService->sendNotificationToNasabah($pinjaman, $action, $user);

        $message = $request->decision === 'approve'
            ? 'Pinjaman berhasil disetujui! Notifikasi WhatsApp telah dikirim ke nasabah.'
            : 'Pinjaman telah ditolak. Notifikasi WhatsApp telah dikirim ke nasabah.';

        return response()->json([
            'success' => true,
            'message' => $message,
            'pinjaman' => $pinjaman->load(['nasabah', 'stafInput', 'adminKredit', 'analis', 'pemutus'])
        ]);
    }

    /**
     * Dashboard workflow dengan statistik berdasarkan role
     */
    public function dashboard()
    {
        $user = Auth::user();
        $stats = [];

        switch ($user->role) {
            case 'admin_kredit':
                $stats = [
                    'available' => Pinjaman::where('status', Pinjaman::STATUS_DIAJUKAN)
                        ->whereNull('admin_kredit_id')
                        ->count(),
                    'my_tasks' => Pinjaman::where('admin_kredit_id', $user->id)
                        ->where('status', Pinjaman::STATUS_DIPERIKSA)
                        ->count(),
                    'completed_today' => Pinjaman::where('admin_kredit_id', $user->id)
                        ->where('status', Pinjaman::STATUS_DIANALISIS)
                        ->whereDate('updated_at', today())
                        ->count(),
                ];
                break;

            case 'analis':
                $stats = [
                    'available' => Pinjaman::where('status', Pinjaman::STATUS_DIANALISIS)
                        ->whereNull('analis_id')
                        ->count(),
                    'my_tasks' => Pinjaman::where('analis_id', $user->id)
                        ->where('status', Pinjaman::STATUS_DIANALISIS)
                        ->count(),
                    'completed_today' => Pinjaman::where('analis_id', $user->id)
                        ->where('status', Pinjaman::STATUS_SIAP_DIPUTUSKAN)
                        ->whereDate('updated_at', today())
                        ->count(),
                ];
                break;

            case 'pemutus':
                $stats = [
                    'available' => Pinjaman::where('status', Pinjaman::STATUS_SIAP_DIPUTUSKAN)
                        ->whereNull('pemutus_id')
                        ->count(),
                    'my_tasks' => Pinjaman::where('pemutus_id', $user->id)
                        ->where('status', Pinjaman::STATUS_SIAP_DIPUTUSKAN)
                        ->count(),
                    'approved_today' => Pinjaman::where('pemutus_id', $user->id)
                        ->where('status', Pinjaman::STATUS_DISETUJUI)
                        ->whereDate('updated_at', today())
                        ->count(),
                    'rejected_today' => Pinjaman::where('pemutus_id', $user->id)
                        ->where('status', Pinjaman::STATUS_DITOLAK)
                        ->whereDate('updated_at', today())
                        ->count(),
                ];
                break;

            case 'staf_input':
                $stats = [
                    'submitted_today' => Pinjaman::where('staf_input_id', $user->id)
                        ->whereDate('created_at', today())
                        ->count(),
                    'in_process' => Pinjaman::where('staf_input_id', $user->id)
                        ->whereIn('status', [
                            Pinjaman::STATUS_DIAJUKAN,
                            Pinjaman::STATUS_DIPERIKSA,
                            Pinjaman::STATUS_DIANALISIS,
                            Pinjaman::STATUS_SIAP_DIPUTUSKAN,
                        ])
                        ->count(),
                    'approved' => Pinjaman::where('staf_input_id', $user->id)
                        ->where('status', Pinjaman::STATUS_DISETUJUI)
                        ->count(),
                    'rejected' => Pinjaman::where('staf_input_id', $user->id)
                        ->where('status', Pinjaman::STATUS_DITOLAK)
                        ->count(),
                ];
                break;

            default:
                // Admin role gets overview of all
                $stats = [
                    'total_diajukan' => Pinjaman::where('status', Pinjaman::STATUS_DIAJUKAN)->count(),
                    'total_diperiksa' => Pinjaman::where('status', Pinjaman::STATUS_DIPERIKSA)->count(),
                    'total_dianalisis' => Pinjaman::where('status', Pinjaman::STATUS_DIANALISIS)->count(),
                    'total_siap_diputuskan' => Pinjaman::where('status', Pinjaman::STATUS_SIAP_DIPUTUSKAN)->count(),
                    'total_disetujui' => Pinjaman::where('status', Pinjaman::STATUS_DISETUJUI)->count(),
                    'total_ditolak' => Pinjaman::where('status', Pinjaman::STATUS_DITOLAK)->count(),
                ];
                break;
        }

        // Get recent activities
        $recentActivities = [];
        if ($user->role !== 'admin') {
            $recentActivities = $this->getRecentActivitiesForUser($user);
        }

        return Inertia::render('WorkflowDashboardNew', [
            'stats' => $stats,
            'recentActivities' => $recentActivities,
            'userRole' => $user->role,
        ]);
    }

    private function getNextStageName(string $role): string
    {
        $stages = [
            'admin_kredit' => 'Analisis',
            'analis' => 'Keputusan Akhir',
            'pemutus' => 'Selesai',
        ];

        return $stages[$role] ?? 'Unknown';
    }

    private function getRecentActivitiesForUser(User $user): array
    {
        // Get recent pinjaman that user is involved with
        $pinjamanQuery = Pinjaman::with(['nasabah', 'logPinjaman.user'])
            ->where(function ($query) use ($user) {
                switch ($user->role) {
                    case 'staf_input':
                        $query->where('staf_input_id', $user->id);
                        break;
                    case 'admin_kredit':
                        $query->where('admin_kredit_id', $user->id);
                        break;
                    case 'analis':
                        $query->where('analis_id', $user->id);
                        break;
                    case 'pemutus':
                        $query->where('pemutus_id', $user->id);
                        break;
                }
            })
            ->orderBy('updated_at', 'desc')
            ->limit(10)
            ->get();

        return $pinjamanQuery->map(function ($pinjaman) {
            $latestLog = $pinjaman->logPinjaman->first();
            return [
                'id' => $pinjaman->id,
                'nasabah_nama' => $pinjaman->nasabah->nama_lengkap,
                'status' => $pinjaman->status,
                'jumlah' => $pinjaman->jumlah_pinjaman,
                'last_activity' => $latestLog ? [
                    'action' => $latestLog->aksi,
                    'description' => $latestLog->deskripsi,
                    'created_at' => $latestLog->created_at,
                    'user' => $latestLog->user->name,
                ] : null,
            ];
        })->toArray();
    }

    private function sendFinalNotification(Pinjaman $pinjaman, string $decision): void
    {
        // Legacy method - now uses sendWhatsAppNotification
        $this->sendWhatsAppNotification($pinjaman, $decision, Auth::user());
    }

    /**
     * Send WhatsApp notification to nasabah
     */
    private function sendWhatsAppNotification(Pinjaman $pinjaman, string $action, User $user, string $additionalInfo = null): void
    {
        try {
            $nasabah = $pinjaman->nasabah;

            if (!$nasabah || !$nasabah->no_hp) {
                Log::warning("No phone number for nasabah ID {$nasabah->id}");
                return;
            }

            $message = $this->buildWhatsAppMessage($pinjaman, $action, $user, $additionalInfo);

            // TODO: Implement actual WhatsApp API call here
            // For now, log the message that would be sent
            Log::info("WhatsApp Notification", [
                'to' => $nasabah->no_hp,
                'pinjaman_id' => $pinjaman->id,
                'action' => $action,
                'user' => $user->name,
                'message' => $message
            ]);

            // Example WhatsApp API call (replace with actual API)
            // $this->sendWhatsAppMessage($nasabah->no_hp, $message);

        } catch (\Exception $e) {
            Log::error("Failed to send WhatsApp notification: " . $e->getMessage());
        }
    }

    /**
     * Build WhatsApp message based on action
     */
    private function buildWhatsAppMessage(Pinjaman $pinjaman, string $action, User $user, string $additionalInfo = null): string
    {
        $nasabah = $pinjaman->nasabah;
        $roleNames = [
            'admin_kredit' => 'Admin Kredit',
            'analis' => 'Analis',
            'pemutus' => 'Pemutus Kredit',
        ];

        $roleName = $roleNames[$user->role] ?? $user->role;

        $baseMessage = "Halo {$nasabah->nama_lengkap},\n\n";
        $baseMessage .= "Update status pengajuan pinjaman Anda:\n";
        $baseMessage .= "No. Referensi: {$pinjaman->id}\n";
        $baseMessage .= "Jumlah: Rp " . number_format($pinjaman->jumlah_pinjaman, 0, ',', '.') . "\n\n";

        switch ($action) {
            case 'taken':
                $message = $baseMessage;
                $message .= "✅ Berkas Anda sedang diproses oleh {$roleName}: {$user->name}\n";
                if ($additionalInfo) {
                    $message .= "Catatan: {$additionalInfo}\n";
                }
                break;

            case 'released':
                $message = $baseMessage;
                $message .= "⏸️ Berkas Anda telah dilepas oleh {$roleName}: {$user->name}\n";
                if ($additionalInfo) {
                    $message .= "Catatan: {$additionalInfo}\n";
                }
                break;

            case 'advanced':
                $message = $baseMessage;
                $message .= "⏭️ Berkas Anda telah diteruskan ke tahap: {$additionalInfo}\n";
                $message .= "Diproses oleh {$roleName}: {$user->name}\n";
                break;

            case 'returned':
                $message = $baseMessage;
                $message .= "⬅️ Berkas Anda dikembalikan ke tahap sebelumnya\n";
                $message .= "Oleh {$roleName}: {$user->name}\n";
                $message .= "Alasan: {$additionalInfo}\n";
                break;

            case 'approve':
                $message = $baseMessage;
                $message .= "🎉 SELAMAT! Pengajuan pinjaman Anda telah DISETUJUI!\n";
                $message .= "Disetujui oleh: {$user->name}\n";
                if ($additionalInfo) {
                    $message .= "Catatan: {$additionalInfo}\n";
                }
                $message .= "\nSilakan hubungi kantor untuk proses selanjutnya.";
                break;

            case 'reject':
                $message = $baseMessage;
                $message .= "❌ Mohon maaf, pengajuan pinjaman Anda DITOLAK.\n";
                $message .= "Ditolak oleh: {$user->name}\n";
                if ($additionalInfo) {
                    $message .= "Alasan: {$additionalInfo}\n";
                }
                $message .= "\nAnda dapat mengajukan ulang dengan melengkapi persyaratan.";
                break;

            default:
                $message = $baseMessage;
                $message .= "📄 Status berkas Anda telah diperbarui.\n";
                $message .= "Diperbarui oleh: {$user->name}\n";
                break;
        }

        $message .= "\n\n---\nTerima kasih,\nTeam BerkasApp";

        return $message;
    }

    /**
     * Get specific reason why user cannot take pinjaman
     */
    private function getCannotTakeReason(Pinjaman $pinjaman, User $user): string
    {
        // Check if pinjaman is already locked
        if ($pinjaman->isLocked()) {
            $lockedUser = User::find($pinjaman->locked_by);
            $lockedUserName = $lockedUser ? $lockedUser->name : 'Unknown';
            return "Berkas sedang dikerjakan oleh {$lockedUserName}. Silakan tunggu atau hubungi admin.";
        }

        // Check status-specific reasons
        switch ($pinjaman->status) {
            case 'diajukan':
                if ($user->role !== 'admin_kredit') {
                    return "Berkas dengan status 'diajukan' hanya dapat diambil oleh Admin Kredit.";
                }
                break;

            case 'diperiksa':
                if ($user->role !== 'admin_kredit') {
                    return "Berkas dengan status 'diperiksa' hanya dapat diambil oleh Admin Kredit.";
                }
                if ($pinjaman->admin_kredit_id !== $user->id) {
                    $assignedUser = User::find($pinjaman->admin_kredit_id);
                    $assignedUserName = $assignedUser ? $assignedUser->name : 'Unknown';
                    return "Berkas ini sudah di-assign ke {$assignedUserName}. Hanya mereka yang dapat mengambilnya.";
                }
                break;

            case 'dianalisis':
                if ($user->role !== 'analis') {
                    return "Berkas dengan status 'dianalisis' hanya dapat diambil oleh Analis.";
                }
                if ($pinjaman->analis_id !== null && $pinjaman->analis_id !== $user->id) {
                    $assignedUser = User::find($pinjaman->analis_id);
                    $assignedUserName = $assignedUser ? $assignedUser->name : 'Unknown';
                    return "Berkas ini sudah di-assign ke {$assignedUserName}. Hanya mereka yang dapat mengambilnya.";
                }
                break;

            case 'siap_diputuskan':
                if ($user->role !== 'pemutus') {
                    return "Berkas dengan status 'siap diputuskan' hanya dapat diambil oleh Pemutus.";
                }
                if ($pinjaman->pemutus_id !== null && $pinjaman->pemutus_id !== $user->id) {
                    $assignedUser = User::find($pinjaman->pemutus_id);
                    $assignedUserName = $assignedUser ? $assignedUser->name : 'Unknown';
                    return "Berkas ini sudah di-assign ke {$assignedUserName}. Hanya mereka yang dapat mengambilnya.";
                }
                break;

            case 'disetujui':
            case 'ditolak':
                return "Berkas sudah selesai diproses dan tidak dapat diambil lagi.";

            default:
                return "Status berkas tidak dikenali atau tidak valid.";
        }

        return "Anda tidak memiliki akses untuk mengambil berkas ini.";
    }
}