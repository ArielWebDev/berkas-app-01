<?php

namespace App\Services;

use App\Models\Pinjaman;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Config;

class WhatsAppService
{
    private $apiUrl;
    private $token;
    private $sender;

    public function __construct()
    {
        $this->apiUrl = config('services.whatsapp.api_url', 'https://api.fonnte.com/send');
        $this->token = config('services.whatsapp.token', 'rdH9gzXK3nLAc3i6XsxW');
        $this->sender = config('services.whatsapp.sender', 'Berkas App');
    }

    /**
     * Kirim notifikasi WhatsApp ke admin tahap berikutnya
     */
    public function sendNotificationToNextAdmin(Pinjaman $pinjaman, User $currentUser, string $action)
    {
        // Untuk action advance, kirim ke SEMUA user role berikutnya (sistem rebutan)
        if ($action === 'advance') {
            return $this->sendNotificationToAllNextRoleUsers($pinjaman, $currentUser);
        }

        // Untuk action return, kirim ke user yang spesifik
        if ($action === 'return') {
            return $this->sendNotificationToSpecificUser($pinjaman, $currentUser, $action);
        }

        return false;
    }

    /**
     * Kirim notifikasi ke semua user pada role berikutnya (sistem rebutan)
     */
    private function sendNotificationToAllNextRoleUsers(Pinjaman $pinjaman, User $currentUser)
    {
        $nextRole = $this->getNextRole($currentUser->role);

        if (!$nextRole) {
            Log::warning('No next role found for current user', [
                'pinjaman_id' => $pinjaman->id,
                'current_user_role' => $currentUser->role
            ]);
            return false;
        }

        $allUsersInNextRole = User::where('role', $nextRole)
            ->whereNotNull('nomor_wa')
            ->get();

        if ($allUsersInNextRole->isEmpty()) {
            Log::warning('No users found in next role for notification', [
                'pinjaman_id' => $pinjaman->id,
                'next_role' => $nextRole
            ]);
            return false;
        }

        $phoneNumbers = [];
        foreach ($allUsersInNextRole as $user) {
            $phoneNumbers[] = $user->nomor_wa;
        }

        $message = $this->generateGroupNotificationMessage($pinjaman, $currentUser, $nextRole);

        // Kirim ke semua user role berikutnya dengan delay
        return $this->sendMultipleNotificationsWithDelay($phoneNumbers, $message, 2); // 2 detik delay
    }

    /**
     * Kirim notifikasi ke user spesifik (untuk action return)
     */
    private function sendNotificationToSpecificUser(Pinjaman $pinjaman, User $currentUser, string $action)
    {
        $targetUser = $this->getSpecificTargetUser($pinjaman, $currentUser, $action);

        if (!$targetUser) {
            Log::warning('No specific target user found for pinjaman', [
                'pinjaman_id' => $pinjaman->id,
                'current_user' => $currentUser->id,
                'action' => $action
            ]);
            return false;
        }

        $message = $this->generateNotificationMessage($pinjaman, $currentUser, $targetUser, $action);

        return $this->sendWhatsApp($targetUser->nomor_wa, $message);
    }

    /**
     * Tentukan role berikutnya berdasarkan role saat ini
     */
    private function getNextRole(string $currentRole): ?string
    {
        switch ($currentRole) {
            case 'admin_kredit':
                return 'analis';
            case 'analis':
                return 'pemutus';
            case 'pemutus':
                return null; // Tidak ada role berikutnya
            default:
                return null;
        }
    }

    /**
     * Tentukan user target spesifik untuk action return
     */
    private function getSpecificTargetUser(Pinjaman $pinjaman, User $currentUser, string $action): ?User
    {
        switch ($action) {
            case 'return':
                if ($currentUser->role === 'admin_kredit') {
                    // Kembalikan ke staf input
                    return User::find($pinjaman->staf_input_id);
                }
                if ($currentUser->role === 'analis') {
                    // Kembalikan ke admin kredit
                    return User::find($pinjaman->admin_kredit_id);
                }
                if ($currentUser->role === 'pemutus') {
                    // Kembalikan ke analis
                    return User::find($pinjaman->analis_id);
                }
                break;
        }

        return null;
    }

    /**
     * Generate pesan notifikasi grup untuk semua user pada role berikutnya
     */
    private function generateGroupNotificationMessage(Pinjaman $pinjaman, User $currentUser, string $nextRole): string
    {
        $appUrl = config('app.url');
        $link = "{$appUrl}/pinjaman/{$pinjaman->id}";
        $nasabahName = $pinjaman->nasabah->nama_lengkap ?? 'Unknown';

        // Tentukan nama role dalam bahasa Indonesia
        $roleNames = [
            'admin_kredit' => 'Admin Kredit',
            'analis' => 'Analis',
            'pemutus' => 'Pemutus'
        ];

        $nextRoleName = $roleNames[$nextRole] ?? ucfirst($nextRole);
        $currentRoleName = $roleNames[$currentUser->role] ?? ucfirst($currentUser->role);

        $message = "🔔 *BERKAS SIAP DIPROSES - UNTUK SEMUA {$nextRoleName}*\n\n";
        $message .= "Berkas pinjaman telah diteruskan dan siap diproses:\n\n";
        $message .= "📋 *Detail Pinjaman:*\n";
        $message .= "• ID: #{$pinjaman->id}\n";
        $message .= "• Nasabah: {$nasabahName}\n";
        $message .= "• Jumlah: " . number_format($pinjaman->jumlah_pinjaman, 0, ',', '.') . "\n";
        $message .= "• Status: " . ucfirst($pinjaman->status) . "\n";
        $message .= "• Dari {$currentRoleName}: {$currentUser->name}\n\n";

        $message .= "⚡ *SIAPA CEPAT DIA DAPAT:*\n";
        $message .= "• Berkas ini terbuka untuk SEMUA {$nextRoleName}\n";
        $message .= "• Yang mengambil duluan akan mendapat berkas\n";
        $message .= "• Klik link di bawah untuk mengambil berkas\n";
        $message .= "• Berkas akan terkunci otomatis setelah diambil\n\n";

        $message .= "🔗 *Klik untuk mengambil berkas:*\n";
        $message .= $link . "\n\n";
        $message .= "⏰ Waktu: " . now()->format('d/m/Y H:i') . "\n";
        $message .= "🏢 BerkasApp - Sistem Manajemen Pinjaman";

        return $message;
    }

    /**
     * Kirim notifikasi WhatsApp ke nasabah
     */
    public function sendNotificationToNasabah(Pinjaman $pinjaman, string $action, User $user)
    {
        $nasabah = $pinjaman->nasabah;
        if (!$nasabah || !$nasabah->nomor_wa) {
            return false;
        }

        $message = $this->generateNasabahMessage($pinjaman, $action, $user);

        return $this->sendWhatsApp($nasabah->nomor_wa, $message);
    }

    /**
     * Tentukan admin untuk tahap berikutnya (DEPRECATED - gunakan getSpecificTargetUser)
     */
    private function getNextAdminUser(Pinjaman $pinjaman, User $currentUser, string $action): ?User
    {
        // Method ini deprecated, gunakan getSpecificTargetUser untuk action return
        return $this->getSpecificTargetUser($pinjaman, $currentUser, $action);
    }

    /**
     * Generate pesan notifikasi untuk admin
     */
    private function generateNotificationMessage(Pinjaman $pinjaman, User $currentUser, User $nextAdmin, string $action): string
    {
        $appUrl = config('app.url');
        $link = "{$appUrl}/pinjaman/{$pinjaman->id}";

        $actionText = $action === 'advance' ? 'diteruskan' : 'dikembalikan';
        $nasabahName = $pinjaman->nasabah->nama_lengkap ?? 'Unknown';

        $message = "🔔 *NOTIFIKASI BERKAS PINJAMAN*\n\n";
        $message .= "Halo *{$nextAdmin->name}*,\n\n";
        $message .= "Berkas pinjaman telah {$actionText} kepada Anda:\n\n";
        $message .= "📋 *Detail Pinjaman:*\n";
        $message .= "• ID: #{$pinjaman->id}\n";
        $message .= "• Nasabah: {$nasabahName}\n";
        $message .= "• Jumlah: " . number_format($pinjaman->jumlah_pinjaman, 0, ',', '.') . "\n";
        $message .= "• Status: " . ucfirst($pinjaman->status) . "\n";
        $message .= "• Dari: {$currentUser->name} ({$currentUser->role})\n\n";

        if ($action === 'advance') {
            $message .= "⚡ *Tindakan Diperlukan:*\n";
            $message .= "• Klik link di bawah untuk mengambil berkas\n";
            $message .= "• Pastikan berkas diproses sesuai SOP\n";
            $message .= "• Berkas akan terkunci otomatis setelah diambil\n\n";
        } else {
            $message .= "🔄 *Berkas Dikembalikan:*\n";
            $message .= "• Silakan periksa kembali berkas\n";
            $message .= "• Lakukan perbaikan yang diperlukan\n";
            $message .= "• Teruskan kembali setelah selesai\n\n";
        }

        $message .= "🔗 *Klik link untuk mengambil berkas:*\n";
        $message .= $link . "\n\n";
        $message .= "⏰ Waktu: " . now()->format('d/m/Y H:i') . "\n";
        $message .= "🏢 BerkasApp - Sistem Manajemen Pinjaman";

        return $message;
    }

    /**
     * Generate pesan notifikasi untuk nasabah
     */
    private function generateNasabahMessage(Pinjaman $pinjaman, string $action, User $user): string
    {
        $nasabahName = $pinjaman->nasabah->nama_lengkap ?? 'Nasabah';

        $message = "🔔 *UPDATE PINJAMAN ANDA*\n\n";
        $message .= "Halo *{$nasabahName}*,\n\n";
        $message .= "Status pinjaman Anda telah diperbarui:\n\n";
        $message .= "📋 *Detail Pinjaman:*\n";
        $message .= "• ID: #{$pinjaman->id}\n";
        $message .= "• Jumlah: " . number_format($pinjaman->jumlah_pinjaman, 0, ',', '.') . "\n";
        $message .= "• Status: " . ucfirst($pinjaman->status) . "\n";
        $message .= "• Diproses oleh: {$user->name}\n\n";

        switch ($action) {
            case 'taken':
                $message .= "✅ Berkas sedang diproses oleh tim kami.\n";
                break;
            case 'advanced':
                $message .= "⏳ Berkas telah diteruskan ke tahap berikutnya.\n";
                break;
            case 'returned':
                $message .= "🔄 Berkas perlu perbaikan dan akan segera diproses kembali.\n";
                break;
            case 'approved':
                $message .= "🎉 Selamat! Pinjaman Anda telah DISETUJUI.\n";
                break;
            case 'rejected':
                $message .= "❌ Mohon maaf, pinjaman Anda tidak dapat disetujui.\n";
                break;
        }

        $message .= "\n📞 Hubungi kami jika ada pertanyaan.\n";
        $message .= "🏢 BerkasApp - Sistem Manajemen Pinjaman";

        return $message;
    }

    /**
     * Generate pesan khusus untuk semua pemutus (DEPRECATED - gunakan generateGroupNotificationMessage)
     */
    private function generatePemutusGroupMessage(Pinjaman $pinjaman, User $currentUser): string
    {
        // Method ini deprecated, gunakan generateGroupNotificationMessage
        return $this->generateGroupNotificationMessage($pinjaman, $currentUser, 'pemutus');
    }

    /**
     * Test method untuk mengirim WhatsApp (public untuk testing)
     */
    public function testSendWhatsApp(string $phone, string $message): bool
    {
        return $this->sendWhatsApp($phone, $message);
    }

    /**
     * Test method untuk mengirim notifikasi ke semua user dalam role tertentu
     */
    public function testSendNotificationToAllInRole(string $role, string $message): bool
    {
        $users = User::where('role', $role)
            ->whereNotNull('nomor_wa')
            ->get();

        if ($users->isEmpty()) {
            Log::warning('No users found in role for test notification', [
                'role' => $role
            ]);
            return false;
        }

        $phoneNumbers = [];
        foreach ($users as $user) {
            $phoneNumbers[] = $user->nomor_wa;
        }

        return $this->sendMultipleNotificationsWithDelay($phoneNumbers, $message, 2);
    }

    /**
     * Get count of users in each role for debugging
     */
    public function getUserCountByRole(): array
    {
        return [
            'admin_kredit' => User::where('role', 'admin_kredit')->whereNotNull('nomor_wa')->count(),
            'analis' => User::where('role', 'analis')->whereNotNull('nomor_wa')->count(),
            'pemutus' => User::where('role', 'pemutus')->whereNotNull('nomor_wa')->count(),
        ];
    }

    /**
     * Kirim ke multiple targets dengan delay untuk menghindari spam
     */
    public function sendMultipleNotificationsWithDelay(array $phoneNumbers, string $message, int $delaySeconds = 2): bool
    {
        $targets = [];

        foreach ($phoneNumbers as $phone) {
            // Bersihkan nomor telepon
            $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
            if (substr($cleanPhone, 0, 1) === '0') {
                $cleanPhone = '62' . substr($cleanPhone, 1);
            }
            $targets[] = $cleanPhone;
        }

        // Join dengan koma untuk multiple targets dan tambahkan delay
        $targetString = implode(',', $targets);

        return $this->sendWhatsAppWithDelay($targetString, $message, $delaySeconds);
    }

    /**
     * Kirim WhatsApp dengan delay
     */
    private function sendWhatsAppWithDelay(string $phone, string $message, int $delaySeconds): bool
    {
        try {
            // Gunakan format cURL sesuai dokumentasi Fonnte dengan delay
            $curl = curl_init();

            curl_setopt_array($curl, array(
                CURLOPT_URL => $this->apiUrl,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => array(
                    'target' => $phone,
                    'message' => $message,
                    'delay' => $delaySeconds,  // Tambahkan delay
                    'countryCode' => '62'
                ),
                CURLOPT_HTTPHEADER => array(
                    'Authorization: ' . $this->token
                ),
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false
            ));

            $response = curl_exec($curl);
            $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            $curlError = curl_error($curl);
            curl_close($curl);

            // Log detail untuk debugging
            Log::info('WhatsApp Group Notification with Delay', [
                'phone' => $phone,
                'delay' => $delaySeconds,
                'curl_error' => $curlError,
                'http_code' => $httpCode,
                'response' => $response
            ]);

            if ($curlError) {
                Log::error('WhatsApp CURL Error', [
                    'phone' => $phone,
                    'error' => $curlError
                ]);
                return false;
            }

            if ($httpCode == 200) {
                Log::info('WhatsApp group notification sent successfully', [
                    'phone' => $phone,
                    'delay' => $delaySeconds,
                    'response' => $response
                ]);
                return true;
            } else {
                Log::error('WhatsApp group notification failed', [
                    'phone' => $phone,
                    'http_code' => $httpCode,
                    'response' => $response
                ]);
                return false;
            }
        } catch (\Exception $e) {
            Log::error('WhatsApp group notification error', [
                'phone' => $phone,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Kirim WhatsApp via API
     */
    private function sendWhatsApp(string $phone, string $message): bool
    {
        try {
            // Jika bukan multiple targets, bersihkan nomor telepon
            if (!str_contains($phone, ',')) {
                $phone = preg_replace('/[^0-9]/', '', $phone);
                if (substr($phone, 0, 1) === '0') {
                    $phone = '62' . substr($phone, 1);
                }
            }

            // Gunakan format cURL sesuai dokumentasi Fonnte
            $curl = curl_init();

            curl_setopt_array($curl, array(
                CURLOPT_URL => $this->apiUrl,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => array(
                    'target' => $phone,
                    'message' => $message,
                    'countryCode' => '62'
                ),
                CURLOPT_HTTPHEADER => array(
                    'Authorization: ' . $this->token
                ),
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false
            ));

            $response = curl_exec($curl);
            $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            $curlError = curl_error($curl);
            curl_close($curl);

            // Log detail untuk debugging
            Log::info('WhatsApp API Request', [
                'phone' => $phone,
                'api_url' => $this->apiUrl,
                'token' => substr($this->token, 0, 10) . '...',
                'curl_error' => $curlError,
                'http_code' => $httpCode,
                'response' => $response
            ]);

            if ($curlError) {
                Log::error('WhatsApp CURL Error', [
                    'phone' => $phone,
                    'error' => $curlError
                ]);
                return false;
            }

            if ($httpCode == 200) {
                Log::info('WhatsApp notification sent successfully', [
                    'phone' => $phone,
                    'response' => $response
                ]);
                return true;
            } else {
                Log::error('WhatsApp notification failed', [
                    'phone' => $phone,
                    'http_code' => $httpCode,
                    'response' => $response
                ]);
                return false;
            }
        } catch (\Exception $e) {
            Log::error('WhatsApp notification error', [
                'phone' => $phone,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }
}
