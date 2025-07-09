<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pinjaman;
use App\Models\Nasabah;
use App\Models\BerkasPinjaman;
use App\Models\LogPinjaman;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class PinjamanController extends Controller
{
    use AuthorizesRequests;
    // Tahap 1: Pengajuan oleh Staf Input
    public function create()
    {
        // $this->authorize('create', Pinjaman::class); // Disabled for development

        $nasabah = Nasabah::all();
        return Inertia::render('Pinjaman/Create', compact('nasabah'));
    }

    public function createWizard()
    {
        // $this->authorize('create', Pinjaman::class); // Disabled for development

        $nasabah = Nasabah::all();
        return Inertia::render('Pinjaman/WizardCreate', compact('nasabah'));
    }

    public function createWizardNew()
    {
        // $this->authorize('create', Pinjaman::class); // Disabled for development

        $nasabah_list = Nasabah::with('pinjaman')->get()->map(function ($nasabah) {
            $nasabah->pinjaman_count = $nasabah->pinjaman->count();
            return $nasabah;
        });

        return Inertia::render('Pinjaman/WizardCreateNew', [
            'nasabah_list' => $nasabah_list
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Pinjaman::class);

        $request->validate([
            'nasabah_id' => 'required|exists:nasabah,id',
            'jumlah_pinjaman' => 'required|numeric|min:1',
            'berkas' => 'required|array|min:1',
            'berkas.*.nama_berkas' => 'required|string',
            'berkas.*.file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048'
        ]);

        DB::transaction(function () use ($request) {
            // 1. Buat data pinjaman
            $pinjaman = Pinjaman::create([
                'nasabah_id' => $request->nasabah_id,
                'staf_input_id' => Auth::id(),
                'jumlah_pinjaman' => $request->jumlah_pinjaman,
                'status' => 'diajukan'
            ]);

            // 2. Upload berkas awal
            foreach ($request->berkas as $berkas) {
                $fileName = time() . '_' . $berkas['file']->getClientOriginalName();
                $path = $berkas['file']->storeAs('berkas-pinjaman', $fileName, 'public');

                BerkasPinjaman::create([
                    'pinjaman_id' => $pinjaman->id,
                    'nama_berkas' => $berkas['nama_berkas'],
                    'path_file' => $path,
                    'diupload_oleh_role' => 'staf_input'
                ]);
            }

            // 3. Log aktivitas
            LogPinjaman::create([
                'pinjaman_id' => $pinjaman->id,
                'user_id' => Auth::id(),
                'aksi' => 'Pengajuan Dibuat',
                'deskripsi' => 'Pengajuan pinjaman sebesar Rp ' . number_format($request->jumlah_pinjaman) . ' telah dibuat'
            ]);

            // 4. TODO: Kirim notifikasi WA ke Admin Kredit
            $this->notifyAdminKredit($pinjaman);
        });

        return redirect()->route('dashboard')->with('success', 'Pengajuan pinjaman berhasil dibuat');
    }

    public function storeWizard(Request $request)
    {
        $this->authorize('create', Pinjaman::class);

        $request->validate([
            'nasabah_id' => 'required|exists:nasabah,id',
            'jumlah_pinjaman' => 'required|numeric|min:1',
            'tujuan_pinjaman' => 'required|string|max:1000',
            'jangka_waktu' => 'required|integer|min:1|max:60',
            'bunga' => 'required|numeric|min:0|max:100',
            'berkas' => 'required|array|min:1',
            'berkas.*' => 'file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240'
        ]);

        DB::transaction(function () use ($request) {
            // 1. Buat data pinjaman
            $pinjaman = Pinjaman::create([
                'nasabah_id' => $request->nasabah_id,
                'staf_input_id' => Auth::id(),
                'jumlah_pinjaman' => $request->jumlah_pinjaman,
                'tujuan_pinjaman' => $request->tujuan_pinjaman,
                'jangka_waktu' => $request->jangka_waktu,
                'bunga' => $request->bunga,
                'status' => 'diajukan'
            ]);

            // 2. Upload dan simpan berkas
            if ($request->hasFile('berkas')) {
                foreach ($request->file('berkas') as $index => $file) {
                    $filename = time() . '_' . $index . '_' . $file->getClientOriginalName();
                    $path = $file->storeAs('berkas_pinjaman', $filename, 'public');

                    BerkasPinjaman::create([
                        'pinjaman_id' => $pinjaman->id,
                        'nama_berkas' => $file->getClientOriginalName(),
                        'path_file' => $path,
                        'diupload_oleh_role' => 'staf_input'
                    ]);
                }
            }

            // 3. Log aktivitas
            LogPinjaman::create([
                'pinjaman_id' => $pinjaman->id,
                'user_id' => Auth::id(),
                'aksi' => 'Pengajuan pinjaman dibuat',
                'status_sebelum' => null,
                'status_sesudah' => 'diajukan',
                'catatan' => 'Pengajuan baru melalui wizard dengan ' . count($request->file('berkas')) . ' dokumen'
            ]);

            // 4. Kirim notifikasi ke Admin Kredit (simulasi)
            $adminKredit = User::where('role', 'admin_kredit')->get();
            foreach ($adminKredit as $admin) {
                // Implementasi notifikasi WA bisa ditambahkan di sini
                Log::info("Notifikasi WA dikirim ke admin kredit: {$admin->name} ({$admin->nomor_wa})");
            }
        });

        return redirect()->route('pinjaman.index')->with('success', 'Pengajuan pinjaman berhasil dibuat melalui wizard!');
    }

    // Tahap 2: Lock berkas oleh Admin Kredit
    public function lockBerkas(Pinjaman $pinjaman)
    {
        $this->authorize('lockBerkas', $pinjaman);

        if ($pinjaman->status !== 'diajukan') {
            return back()->with('error', 'Berkas sudah tidak bisa di-lock');
        }

        $pinjaman->update([
            'admin_kredit_id' => Auth::id(),
            'status' => 'diperiksa',
            'locked_at' => now()
        ]);

        LogPinjaman::create([
            'pinjaman_id' => $pinjaman->id,
            'user_id' => Auth::id(),
            'aksi' => 'Berkas Dikunci',
            'deskripsi' => 'Berkas dikunci oleh Admin Kredit untuk pemeriksaan'
        ]);

        return back()->with('success', 'Berkas berhasil dikunci untuk pemeriksaan');
    }

    // Admin Kredit upload dokumen OJK
    public function uploadDokumenOjk(Request $request, Pinjaman $pinjaman)
    {
        $this->authorize('uploadDokumenOjk', $pinjaman);

        $request->validate([
            'nama_berkas' => 'required|string',
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048'
        ]);

        $fileName = time() . '_' . $request->file->getClientOriginalName();
        $path = $request->file->storeAs('berkas-pinjaman', $fileName, 'public');

        BerkasPinjaman::create([
            'pinjaman_id' => $pinjaman->id,
            'nama_berkas' => $request->nama_berkas,
            'path_file' => $path,
            'diupload_oleh_role' => 'admin_kredit'
        ]);

        LogPinjaman::create([
            'pinjaman_id' => $pinjaman->id,
            'user_id' => Auth::id(),
            'aksi' => 'Dokumen Ditambahkan',
            'deskripsi' => 'Dokumen ' . $request->nama_berkas . ' ditambahkan oleh Admin Kredit'
        ]);

        return back()->with('success', 'Dokumen berhasil diupload');
    }

    // Admin Kredit kembalikan atau lanjutkan ke analis
    public function adminDecision(Request $request, Pinjaman $pinjaman)
    {
        $this->authorize('adminDecision', $pinjaman);

        $request->validate([
            'decision' => 'required|in:kembalikan,lanjutkan',
            'catatan' => 'required_if:decision,kembalikan|string'
        ]);

        if ($request->decision === 'kembalikan') {
            $pinjaman->update([
                'status' => 'dikembalikan',
                'catatan' => $request->catatan,
                'admin_kredit_id' => null,
                'locked_at' => null
            ]);

            LogPinjaman::create([
                'pinjaman_id' => $pinjaman->id,
                'user_id' => Auth::id(),
                'aksi' => 'Berkas Dikembalikan',
                'deskripsi' => 'Berkas dikembalikan ke Staf Input: ' . $request->catatan
            ]);

            // TODO: Notifikasi ke Staf Input

        } else {
            $pinjaman->update([
                'status' => 'dianalisis'
            ]);

            LogPinjaman::create([
                'pinjaman_id' => $pinjaman->id,
                'user_id' => Auth::id(),
                'aksi' => 'Diteruskan ke Analis',
                'deskripsi' => 'Berkas diteruskan ke Analis untuk dianalisis'
            ]);

            // TODO: Notifikasi ke Analis
            $this->notifyAnalis($pinjaman);
        }

        return back()->with('success', 'Keputusan berhasil disimpan');
    }

    // Tahap 3: Analis mengambil berkas
    public function assignToAnalis(Pinjaman $pinjaman)
    {
        $this->authorize('assignToAnalis', $pinjaman);

        if ($pinjaman->status !== 'dianalisis') {
            return back()->with('error', 'Berkas tidak bisa diambil');
        }

        $pinjaman->update([
            'analis_id' => Auth::id()
        ]);

        LogPinjaman::create([
            'pinjaman_id' => $pinjaman->id,
            'user_id' => Auth::id(),
            'aksi' => 'Berkas Diambil Analis',
            'deskripsi' => 'Berkas diambil oleh Analis untuk dianalisis'
        ]);

        return back()->with('success', 'Berkas berhasil diambil untuk analisis');
    }

    // Analis upload dokumen lapangan
    public function uploadDokumenLapangan(Request $request, Pinjaman $pinjaman)
    {
        $this->authorize('uploadDokumenLapangan', $pinjaman);

        $request->validate([
            'nama_berkas' => 'required|string',
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048'
        ]);

        $fileName = time() . '_' . $request->file->getClientOriginalName();
        $path = $request->file->storeAs('berkas-pinjaman', $fileName, 'public');

        BerkasPinjaman::create([
            'pinjaman_id' => $pinjaman->id,
            'nama_berkas' => $request->nama_berkas,
            'path_file' => $path,
            'diupload_oleh_role' => 'analis'
        ]);

        LogPinjaman::create([
            'pinjaman_id' => $pinjaman->id,
            'user_id' => Auth::id(),
            'aksi' => 'Dokumen Lapangan Ditambahkan',
            'deskripsi' => 'Dokumen ' . $request->nama_berkas . ' ditambahkan dari hasil analisis lapangan'
        ]);

        return back()->with('success', 'Dokumen lapangan berhasil diupload');
    }

    // Analis selesai analisis
    public function finishAnalysis(Request $request, Pinjaman $pinjaman)
    {
        $this->authorize('finishAnalysis', $pinjaman);

        $request->validate([
            'catatan' => 'nullable|string'
        ]);

        $pinjaman->update([
            'status' => 'siap_diputuskan',
            'catatan' => $request->catatan
        ]);

        LogPinjaman::create([
            'pinjaman_id' => $pinjaman->id,
            'user_id' => Auth::id(),
            'aksi' => 'Analisis Selesai',
            'deskripsi' => 'Analisis selesai, berkas siap untuk diputuskan. ' . ($request->catatan ?? '')
        ]);

        // TODO: Notifikasi ke Pemutus
        $this->notifyPemutus($pinjaman);

        return back()->with('success', 'Analisis selesai, berkas diteruskan ke Pemutus');
    }

    // Tahap 4: Keputusan akhir oleh Pemutus
    public function finalDecision(Request $request, Pinjaman $pinjaman)
    {
        $this->authorize('finalDecision', $pinjaman);

        $request->validate([
            'decision' => 'required|in:disetujui,ditolak',
            'catatan' => 'required|string'
        ]);

        $pinjaman->update([
            'pemutus_id' => Auth::id(),
            'status' => $request->decision,
            'catatan' => $request->catatan
        ]);

        LogPinjaman::create([
            'pinjaman_id' => $pinjaman->id,
            'user_id' => Auth::id(),
            'aksi' => 'Keputusan Final',
            'deskripsi' => 'Pinjaman ' . $request->decision . ': ' . $request->catatan
        ]);

        // TODO: Notifikasi ke Nasabah
        $this->notifyNasabah($pinjaman);

        return back()->with('success', 'Keputusan final berhasil disimpan');
    }

    // View detail pinjaman
    public function show(Pinjaman $pinjaman)
    {
        // Temporarily disable authorization for testing
        // $this->authorize('view', $pinjaman);

        $pinjaman->load([
            'nasabah',
            'stafInput',
            'adminKredit',
            'analis',
            'pemutus',
            'berkasPinjaman',
            'logPinjaman.user'
        ]);

        return Inertia::render('Pinjaman/ShowNew', compact('pinjaman'));
    }

    // Menampilkan daftar pinjaman sesuai role user
    public function index(Request $request)
    {
        $user = Auth::user();

        // Query berdasarkan role
        $query = Pinjaman::with(['nasabah', 'stafInput', 'adminKredit', 'analis', 'pemutus']);

        switch ($user->role) {
            case 'staf_input':
                // Staf input hanya lihat pinjaman yang dia buat
                $query->where('staf_input_id', $user->id);
                break;
            case 'admin_kredit':
                // Admin kredit bisa lihat:
                // 1. Semua pinjaman yang belum diambil admin lain (available)
                // 2. Pinjaman yang sedang dia kerjakan
                // 3. Pinjaman yang sudah dia selesaikan
                $query->where(function ($q) use ($user) {
                    $q->where('status', 'diajukan') // Belum diambil siapa pun
                        ->orWhere('admin_kredit_id', $user->id); // Yang dia ambil/kerjakan
                });
                break;
            case 'analis':
                // Analis bisa lihat:
                // 1. Semua pinjaman yang sudah di-advance admin_kredit dan belum diambil analis lain
                // 2. Pinjaman yang sedang dia kerjakan
                // 3. Pinjaman yang sudah dia selesaikan
                $query->where(function ($q) use ($user) {
                    $q->where('status', 'dianalisis') // Dari admin_kredit, belum diambil analis
                        ->orWhere('analis_id', $user->id); // Yang dia ambil/kerjakan
                });
                break;
            case 'pemutus':
                // Pemutus bisa lihat:
                // 1. Semua pinjaman yang sudah di-advance analis dan belum diambil pemutus lain
                // 2. Pinjaman yang sedang dia kerjakan
                // 3. Semua pinjaman final untuk overview
                $query->where(function ($q) use ($user) {
                    $q->where('status', 'siap_diputuskan') // Dari analis, belum diambil pemutus
                        ->orWhere('pemutus_id', $user->id) // Yang dia ambil/kerjakan
                        ->orWhereIn('status', ['disetujui', 'ditolak']); // Overview final
                });
                break;
            case 'admin':
                // Admin bisa lihat semua pinjaman
                break;
        }

        // Filter berdasarkan request
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Filter khusus untuk melihat pinjaman available (belum di-lock)
        if ($request->available === 'true') {
            switch ($user->role) {
                case 'admin_kredit':
                    $query->where('status', 'diajukan')
                        ->whereNull('admin_kredit_id');
                    break;
                case 'analis':
                    $query->where('status', 'dianalisis')
                        ->whereNull('analis_id');
                    break;
                case 'pemutus':
                    $query->where('status', 'siap_diputuskan')
                        ->whereNull('pemutus_id');
                    break;
            }
        }

        // Filter untuk melihat pinjaman yang sedang dikerjakan user
        if ($request->my_tasks === 'true') {
            switch ($user->role) {
                case 'admin_kredit':
                    $query->where('admin_kredit_id', $user->id)
                        ->where('status', 'diperiksa');
                    break;
                case 'analis':
                    $query->where('analis_id', $user->id)
                        ->where('status', 'dianalisis');
                    break;
                case 'pemutus':
                    $query->where('pemutus_id', $user->id)
                        ->where('status', 'siap_diputuskan');
                    break;
            }
        }

        if ($request->search) {
            $query->whereHas('nasabah', function ($q) use ($request) {
                $q->where('nama_lengkap', 'like', '%' . $request->search . '%')
                    ->orWhere('nik', 'like', '%' . $request->search . '%');
            });
        }

        $pinjaman = $query->orderBy('created_at', 'desc')->paginate(10);

        // Tambahkan metadata untuk UI
        $metadata = [
            'available_count' => $this->getAvailableCount($user),
            'my_tasks_count' => $this->getMyTasksCount($user),
            'can_take_tasks' => in_array($user->role, ['admin_kredit', 'analis', 'pemutus'])
        ];

        return Inertia::render('Pinjaman/TailIndexNew', [
            'pinjaman' => $pinjaman,
            'filters' => $request->only(['status', 'search', 'available', 'my_tasks']),
            'metadata' => $metadata
        ]);
    }

    // Method untuk edit pinjaman
    public function edit(Pinjaman $pinjaman)
    {
        // Temporary disable authorization for development
        // $this->authorize('update', $pinjaman);

        $nasabah_list = Nasabah::all();

        return Inertia::render('Pinjaman/Edit', [
            'pinjaman' => $pinjaman->load('nasabah'),
            'nasabah_list' => $nasabah_list
        ]);
    }

    // Method untuk update pinjaman
    public function update(Request $request, Pinjaman $pinjaman)
    {
        // Temporary disable authorization for development
        // $this->authorize('update', $pinjaman);

        $request->validate([
            'nasabah_id' => 'required|exists:nasabah,id',
            'jumlah_pinjaman' => 'required|numeric|min:1',
            'tujuan_pinjaman' => 'required|string|max:1000',
            'jangka_waktu' => 'required|integer|min:1',
            'bunga' => 'required|numeric|min:0',
        ]);

        $statusSebelum = $pinjaman->status;

        $pinjaman->update([
            'nasabah_id' => $request->nasabah_id,
            'jumlah_pinjaman' => $request->jumlah_pinjaman,
            'tujuan_pinjaman' => $request->tujuan_pinjaman,
            'jangka_waktu' => $request->jangka_waktu,
            'bunga' => $request->bunga,
        ]);

        // Log aktivitas
        LogPinjaman::create([
            'pinjaman_id' => $pinjaman->id,
            'user_id' => Auth::id(),
            'aksi' => 'Update Data',
            'status_sebelum' => $statusSebelum,
            'status_sesudah' => $pinjaman->status,
            'catatan' => 'Data pinjaman diperbarui'
        ]);

        return redirect()->route('pinjaman.index')->with('success', 'Pinjaman berhasil diperbarui');
    }

    // Method untuk delete pinjaman
    public function destroy(Pinjaman $pinjaman)
    {
        // Temporary disable authorization for development
        // $this->authorize('delete', $pinjaman);

        // Hanya bisa hapus jika status masih diajukan
        if ($pinjaman->status !== 'diajukan') {
            return back()->with('error', 'Pinjaman yang sudah diproses tidak bisa dihapus');
        }

        // Hapus berkas terkait
        foreach ($pinjaman->berkas as $berkas) {
            $filePath = storage_path('app/public/' . $berkas->path_file);
            if (file_exists($filePath)) {
                unlink($filePath);
            }
            $berkas->delete();
        }

        // Log aktivitas
        LogPinjaman::create([
            'pinjaman_id' => $pinjaman->id,
            'user_id' => Auth::id(),
            'aksi' => 'Hapus Pinjaman',
            'status_sebelum' => $pinjaman->status,
            'status_sesudah' => 'dihapus',
            'catatan' => 'Pinjaman dihapus beserta semua berkas'
        ]);

        $pinjaman->delete();

        return redirect()->route('pinjaman.index')->with('success', 'Pinjaman berhasil dihapus');
    }

    // Method untuk workflow action
    public function workflowAction(Request $request, Pinjaman $pinjaman)
    {
        $user = Auth::user();
        $action = $request->input('action');

        // Validasi action berdasarkan role dan status saat ini
        $validTransitions = [
            'admin_kredit' => [
                'approve_review' => ['diajukan' => 'diperiksa'],
                'return_to_staff' => ['diajukan' => 'dikembalikan']
            ],
            'analis' => [
                'analyze_complete' => ['diperiksa' => 'siap_diputuskan'],
                'return_to_admin' => ['diperiksa' => 'dikembalikan']
            ],
            'pemutus' => [
                'approve_final' => ['siap_diputuskan' => 'disetujui'],
                'reject_final' => ['siap_diputuskan' => 'ditolak']
            ]
        ];

        if (!isset($validTransitions[$user->role][$action])) {
            return back()->withErrors(['error' => 'Action tidak valid untuk role Anda.']);
        }

        $transition = $validTransitions[$user->role][$action];
        $requiredStatus = array_keys($transition)[0];
        $newStatus = $transition[$requiredStatus];

        if ($pinjaman->status !== $requiredStatus) {
            return back()->withErrors(['error' => 'Status pinjaman tidak sesuai untuk action ini.']);
        }

        // Update status dan assign user
        $updateData = ['status' => $newStatus];

        switch ($user->role) {
            case 'admin_kredit':
                $updateData['admin_kredit_id'] = $user->id;
                break;
            case 'analis':
                $updateData['analis_id'] = $user->id;
                break;
            case 'pemutus':
                $updateData['pemutus_id'] = $user->id;
                break;
        }

        $pinjaman->update($updateData);

        // Log the action
        LogPinjaman::create([
            'pinjaman_id' => $pinjaman->id,
            'user_id' => $user->id,
            'action' => $action,
            'status_before' => $requiredStatus,
            'status_after' => $newStatus,
            'notes' => "Action: {$action} by {$user->name}",
        ]);

        return back()->with('success', 'Action berhasil dijalankan.');
    }

    // Helper methods untuk notifikasi (implementasi WhatsApp)
    private function notifyAdminKredit($pinjaman)
    {
        // Kirim notifikasi ke semua admin kredit bahwa ada pinjaman baru
        $adminKredits = User::where('role', 'admin_kredit')->get();
        
        foreach ($adminKredits as $admin) {
            $message = $this->buildNotificationMessage($pinjaman, 'new_submission', $admin);
            $this->sendWhatsAppToUser($admin, $message);
        }
    }

    private function notifyAnalis($pinjaman)
    {
        // Kirim notifikasi ke semua analis bahwa ada pinjaman siap dianalisis
        $analis = User::where('role', 'analis')->get();
        
        foreach ($analis as $analiser) {
            $message = $this->buildNotificationMessage($pinjaman, 'ready_for_analysis', $analiser);
            $this->sendWhatsAppToUser($analiser, $message);
        }
    }

    private function notifyPemutus($pinjaman)
    {
        // Kirim notifikasi ke semua pemutus bahwa ada pinjaman siap diputuskan
        $pemutus = User::where('role', 'pemutus')->get();

        foreach ($pemutus as $decisionMaker) {
            $message = $this->buildNotificationMessage($pinjaman, 'ready_for_decision', $decisionMaker);
            $this->sendWhatsAppToUser($decisionMaker, $message);
        }
    }

    private function notifyNasabah($pinjaman)
    {
        // Kirim notifikasi final decision ke nasabah
        $nasabah = $pinjaman->nasabah;
        $message = $this->buildNotificationMessage($pinjaman, 'final_decision', null);
        
        if ($nasabah && $nasabah->no_hp) {
            $this->sendWhatsAppToNasabah($nasabah, $message);
        }
    }

    private function buildNotificationMessage($pinjaman, $type, $user = null)
    {
        $nasabah = $pinjaman->nasabah;
        $baseInfo = "Pinjaman {$nasabah->nama_lengkap} - Rp " . number_format($pinjaman->jumlah_pinjaman, 0, ',', '.');

        switch ($type) {
            case 'new_submission':
                return "🔔 Ada pengajuan pinjaman baru!\n\n{$baseInfo}\n\nSilakan cek aplikasi untuk mengambil berkas ini.";

            case 'ready_for_analysis':
                return "📋 Berkas siap dianalisis!\n\n{$baseInfo}\n\nBerkas telah diperiksa Admin Kredit dan siap untuk analisis lapangan.";

            case 'ready_for_decision':
                return "⚖️ Berkas siap diputuskan!\n\n{$baseInfo}\n\nAnalisis telah selesai dan menunggu keputusan akhir.";

            case 'final_decision':
                $status = $pinjaman->status === 'disetujui' ? 'DISETUJUI ✅' : 'DITOLAK ❌';
                return "📢 Keputusan Akhir: {$status}\n\n{$baseInfo}\n\nCatatan: {$pinjaman->catatan}";

            default:
                return "📬 Update status pinjaman: {$baseInfo}";
        }
    }

    private function sendWhatsAppToUser($user, $message)
    {
        // Log untuk development, ganti dengan WhatsApp API sebenarnya
        Log::info("WhatsApp to User", [
            'recipient' => $user->name,
            'phone' => $user->nomor_wa ?? 'No phone',
            'message' => $message
        ]);

        // TODO: Implementasi WhatsApp API
        // $this->whatsappService->sendMessage($user->nomor_wa, $message);
    }

    private function sendWhatsAppToNasabah($nasabah, $message)
    {
        // Log untuk development, ganti dengan WhatsApp API sebenarnya
        Log::info("WhatsApp to Nasabah", [
            'recipient' => $nasabah->nama_lengkap,
            'phone' => $nasabah->no_hp,
            'message' => $message
        ]);

        // TODO: Implementasi WhatsApp API
        // $this->whatsappService->sendMessage($nasabah->no_hp, $message);
    }

    // Helper methods for statistics
    private function getAvailableCount($user)
    {
        switch ($user->role) {
            case 'admin_kredit':
                return Pinjaman::where('status', 'diajukan')
                    ->whereNull('admin_kredit_id')
                    ->count();
            case 'analis':
                return Pinjaman::where('status', 'dianalisis')
                    ->whereNull('analis_id')
                    ->count();
            case 'pemutus':
                return Pinjaman::where('status', 'siap_diputuskan')
                    ->whereNull('pemutus_id')
                    ->count();
            default:
                return 0;
        }
    }

    private function getMyTasksCount($user)
    {
        switch ($user->role) {
            case 'admin_kredit':
                return Pinjaman::where('admin_kredit_id', $user->id)
                    ->where('status', 'diperiksa')
                    ->count();
            case 'analis':
                return Pinjaman::where('analis_id', $user->id)
                    ->where('status', 'dianalisis')
                    ->count();
            case 'pemutus':
                return Pinjaman::where('pemutus_id', $user->id)
                    ->where('status', 'siap_diputuskan')
                    ->count();
            case 'staf_input':
                return Pinjaman::where('staf_input_id', $user->id)
                    ->whereIn('status', ['diajukan', 'diperiksa', 'dianalisis', 'siap_diputuskan'])
                    ->count();
            default:
                return 0;
        }
    }

    // Method untuk download berkas
    public function downloadBerkas(BerkasPinjaman $berkas)
    {
        // Temporary disable authorization for development
        // $this->authorize('view', $berkas->pinjaman);

        $filePath = storage_path('app/public/' . $berkas->path_file);

        if (!file_exists($filePath)) {
            return back()->with('error', 'File tidak ditemukan');
        }

        return response()->download($filePath, $berkas->nama_berkas);
    }

    // Method untuk view berkas (untuk PDF/image)
    public function viewBerkas(BerkasPinjaman $berkas)
    {
        // Temporary disable authorization for development
        // $this->authorize('view', $berkas->pinjaman);

        $filePath = storage_path('app/public/' . $berkas->path_file);

        if (!file_exists($filePath)) {
            return back()->with('error', 'File tidak ditemukan');
        }

        $mimeType = mime_content_type($filePath);
        return response()->file($filePath, [
            'Content-Type' => $mimeType,
        ]);
    }

    // Method untuk delete berkas
    public function deleteBerkas(BerkasPinjaman $berkas)
    {
        // Temporary disable authorization for development
        // $this->authorize('update', $berkas->pinjaman);

        $filePath = storage_path('app/public/' . $berkas->path_file);

        if (file_exists($filePath)) {
            unlink($filePath);
        }

        $berkasName = $berkas->nama_berkas;
        $pinjamanId = $berkas->pinjaman_id;

        $berkas->delete();

        // Log aktivitas
        LogPinjaman::create([
            'pinjaman_id' => $pinjamanId,
            'user_id' => Auth::id(),
            'aksi' => 'Berkas Dihapus',
            'status_sebelum' => null,
            'status_sesudah' => null,
            'catatan' => 'Berkas "' . $berkasName . '" dihapus'
        ]);

        return back()->with('success', 'Berkas berhasil dihapus');
    }
}