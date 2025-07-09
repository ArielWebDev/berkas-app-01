<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pinjaman extends Model
{
    use HasFactory;

    protected $table = 'pinjaman';

    protected $fillable = [
        'nasabah_id',
        'staf_input_id',
        'admin_kredit_id',
        'analis_id',
        'pemutus_id',
        'jumlah_pinjaman',
        'tujuan_pinjaman',
        'jangka_waktu',
        'bunga',
        'status',
        'catatan',
        'locked_at',
        'locked_by',
    ];

    protected $casts = [
        'locked_at' => 'datetime',
        'jumlah_pinjaman' => 'decimal:2',
    ];

    // Relationships
    public function nasabah()
    {
        return $this->belongsTo(Nasabah::class);
    }

    public function stafInput()
    {
        return $this->belongsTo(User::class, 'staf_input_id');
    }

    public function adminKredit()
    {
        return $this->belongsTo(User::class, 'admin_kredit_id');
    }

    public function analis()
    {
        return $this->belongsTo(User::class, 'analis_id');
    }

    public function pemutus()
    {
        return $this->belongsTo(User::class, 'pemutus_id');
    }

    public function berkasPinjaman()
    {
        return $this->hasMany(BerkasPinjaman::class);
    }

    public function logPinjaman()
    {
        return $this->hasMany(LogPinjaman::class);
    }

    // Workflow Status Constants
    const STATUS_DIAJUKAN = 'diajukan';
    const STATUS_DIPERIKSA = 'diperiksa';
    const STATUS_DIKEMBALIKAN = 'dikembalikan';
    const STATUS_DIANALISIS = 'dianalisis';
    const STATUS_SIAP_DIPUTUSKAN = 'siap_diputuskan';
    const STATUS_DISETUJUI = 'disetujui';
    const STATUS_DITOLAK = 'ditolak';

    // Lock Methods
    public function isLocked(): bool
    {
        return $this->locked_at !== null;
    }

    public function canBeTakenByUser(User $user): bool
    {
        // Cek apakah user bisa mengambil berkas ini berdasarkan status dan role
        switch ($this->status) {
            case self::STATUS_DIAJUKAN:
                // Semua admin_kredit bisa mengambil pinjaman yang belum di-lock
                return $user->role === 'admin_kredit' && !$this->isLocked();
            case self::STATUS_DIPERIKSA:
                // Hanya admin_kredit yang assigned bisa mengambil berkas yang sudah diperiksa
                return $user->role === 'admin_kredit' && $this->admin_kredit_id === $user->id && !$this->isLocked();
            case self::STATUS_DIANALISIS:
                // Semua analis bisa mengambil berkas yang belum di-assign ATAU yang sudah di-assign ke mereka
                return $user->role === 'analis' &&
                    ($this->analis_id === null || $this->analis_id === $user->id) &&
                    !$this->isLocked();
            case self::STATUS_SIAP_DIPUTUSKAN:
                // Semua pemutus bisa mengambil berkas yang belum di-assign ATAU yang sudah di-assign ke mereka
                return $user->role === 'pemutus' &&
                    ($this->pemutus_id === null || $this->pemutus_id === $user->id) &&
                    !$this->isLocked();
            default:
                return false;
        }
    }

    public function canBeAnalyzedByUser(User $user): bool
    {
        // Fungsi terpisah untuk menganalisa - lebih fleksibel
        switch ($this->status) {
            case self::STATUS_DIPERIKSA:
                // Admin kredit yang sudah mengambil berkas bisa menganalisa
                return $user->role === 'admin_kredit' && $this->admin_kredit_id === $user->id;
            case self::STATUS_DIANALISIS:
                // Analis yang sudah mengambil berkas bisa menganalisa
                return $user->role === 'analis' && $this->analis_id === $user->id;
            case self::STATUS_SIAP_DIPUTUSKAN:
                // Pemutus yang sudah mengambil berkas bisa memutuskan
                return $user->role === 'pemutus' && $this->pemutus_id === $user->id;
            default:
                return false;
        }
    }

    public function isOwnedByUser(User $user): bool
    {
        switch ($user->role) {
            case 'staf_input':
                return $this->staf_input_id === $user->id;
            case 'admin_kredit':
                return $this->admin_kredit_id === $user->id;
            case 'analis':
                return $this->analis_id === $user->id;
            case 'pemutus':
                return $this->pemutus_id === $user->id;
            default:
                return false;
        }
    }

    public function lockForUser(User $user, ?string $catatan = null): bool
    {
        if (!$this->canBeTakenByUser($user)) {
            return false;
        }

        // Update status berdasarkan role yang mengambil
        $newStatus = null;
        switch ($user->role) {
            case 'admin_kredit':
                if ($this->status === self::STATUS_DIAJUKAN) {
                    $newStatus = self::STATUS_DIPERIKSA;
                }
                break;
            case 'analis':
                if ($this->status === self::STATUS_DIANALISIS) {
                    // Status tetap dianalisis, tapi sudah di-assign ke analis
                    $newStatus = self::STATUS_DIANALISIS;
                }
                break;
            case 'pemutus':
                if ($this->status === self::STATUS_SIAP_DIPUTUSKAN) {
                    // Status tetap siap_diputuskan, tapi sudah di-assign ke pemutus
                    $newStatus = self::STATUS_SIAP_DIPUTUSKAN;
                }
                break;
        }

        $updateData = [
            'locked_at' => now(),
            'locked_by' => $user->id,  // Tambahkan locked_by
        ];

        // Assign role_id berdasarkan role dan kondisi
        if ($user->role === 'analis' && $this->analis_id === null) {
            // Analis pertama yang ambil berkas akan di-assign
            $updateData['analis_id'] = $user->id;
        } elseif ($user->role === 'pemutus' && $this->pemutus_id === null) {
            // Pemutus pertama yang ambil berkas akan di-assign
            $updateData['pemutus_id'] = $user->id;
        } else {
            // Role lain tetap seperti biasa
            $updateData[$user->role . '_id'] = $user->id;
        }

        if ($newStatus) {
            $updateData['status'] = $newStatus;
        }

        $this->update($updateData);

        // Log activity with catatan
        $description = "Berkas diambil oleh {$user->name} ({$user->role})";
        if ($catatan) {
            $description .= " - Catatan: {$catatan}";
        }
        if ($newStatus && $newStatus !== $this->getOriginal('status')) {
            $description .= " - Status berubah menjadi: {$newStatus}";
        }
        $this->logActivity('lock', $description, $user);

        return true;
    }

    public function unlockFromUser(User $user, ?string $catatan = null): bool
    {
        if (!$this->isOwnedByUser($user)) {
            return false;
        }

        // Tentukan status yang harus dikembalikan
        $newStatus = null;
        switch ($user->role) {
            case 'admin_kredit':
                if ($this->status === self::STATUS_DIPERIKSA) {
                    $newStatus = self::STATUS_DIAJUKAN; // Kembali ke status awal
                }
                break;
            case 'analis':
                // Analis release, kembali ke status dianalisis tapi tidak di-assign
                $newStatus = self::STATUS_DIANALISIS;
                break;
            case 'pemutus':
                // Pemutus release, kembali ke status siap_diputuskan tapi tidak di-assign
                $newStatus = self::STATUS_SIAP_DIPUTUSKAN;
                break;
        }

        $updateData = [
            'locked_at' => null,
            'locked_by' => null,  // Reset locked_by juga
        ];

        // CATATAN: Assignment tetap ada, hanya unlock berkas
        // Tidak reset admin_kredit_id, analis_id, atau pemutus_id

        if ($newStatus) {
            $updateData['status'] = $newStatus;
        }

        $this->update($updateData);

        // Log activity with catatan
        $description = "Berkas dilepas oleh {$user->name} ({$user->role})";
        if ($catatan) {
            $description .= " - Catatan: {$catatan}";
        }
        if ($newStatus && $newStatus !== $this->getOriginal('status')) {
            $description .= " - Status dikembalikan ke: {$newStatus}";
        }
        $this->logActivity('unlock', $description, $user);

        return true;
    }

    // Workflow Methods
    public function advanceToNextStage(User $user, array $data = []): bool
    {
        if (!$this->isOwnedByUser($user)) {
            return false;
        }

        $nextStatus = $this->getNextStatus($user->role);
        if (!$nextStatus) {
            return false;
        }

        $updateData = [
            'status' => $nextStatus,
            'locked_at' => null, // Unlock setelah diteruskan
            'locked_by' => null, // Reset locked_by
        ];

        // TIDAK langsung assign untuk tahap berikutnya - biarkan terbuka untuk sistem rebutan
        // Assignment hanya dilakukan saat user mengambil berkas (lockForUser)
        if ($user->role === 'admin_kredit' && $nextStatus === self::STATUS_DIANALISIS) {
            // Berkas terbuka untuk semua analis - tidak di-assign
            $updateData['analis_id'] = null;
        } elseif ($user->role === 'analis' && $nextStatus === self::STATUS_SIAP_DIPUTUSKAN) {
            // Berkas terbuka untuk semua pemutus - tidak di-assign
            $updateData['pemutus_id'] = null;
        }

        if (isset($data['catatan'])) {
            $updateData['catatan'] = $data['catatan'];
        }

        $this->update($updateData);

        // Log activity
        $action = $this->getActionName($user->role, $nextStatus);
        $this->logActivity($action, $this->getActionDescription($user->role, $nextStatus), $user);

        // Send notifications
        $this->sendWorkflowNotifications($nextStatus);

        return true;
    }

    private function getNextStatus(string $role): ?string
    {
        $transitions = [
            'admin_kredit' => self::STATUS_DIANALISIS,
            'analis' => self::STATUS_SIAP_DIPUTUSKAN,
            'pemutus' => self::STATUS_DISETUJUI, // or STATUS_DITOLAK based on decision
        ];

        return $transitions[$role] ?? null;
    }

    private function getActionName(string $role, string $status): string
    {
        $actions = [
            'admin_kredit' => 'approve_admin',
            'analis' => 'approve_analis',
            'pemutus' => $status === self::STATUS_DISETUJUI ? 'approve_final' : 'reject_final',
        ];

        return $actions[$role] ?? 'unknown';
    }

    private function getActionDescription(string $role, string $status): string
    {
        $descriptions = [
            'admin_kredit' => 'Berkas telah diperiksa dan diteruskan ke analisis',
            'analis' => 'Analisis selesai, berkas diteruskan untuk keputusan akhir',
            'pemutus' => $status === self::STATUS_DISETUJUI
                ? 'Pinjaman disetujui'
                : 'Pinjaman ditolak',
        ];

        return $descriptions[$role] ?? 'Status berubah';
    }

    public function returnToPreviousStage(User $user, string $reason): bool
    {
        if (!$this->isOwnedByUser($user)) {
            return false;
        }

        $previousStatus = $this->getPreviousStatus();
        if (!$previousStatus) {
            return false;
        }

        $updateData = [
            'status' => $previousStatus,
            'catatan' => $reason,
            'locked_at' => null,
            'locked_by' => null,  // Reset locked_by juga
        ];

        // Reset assignment based on role
        switch ($user->role) {
            case 'admin_kredit':
                $updateData['admin_kredit_id'] = null;
                // Jika dikembalikan ke staf input, reset juga staf_input_id jika perlu
                // Tapi biasanya staf_input_id tetap sama
                break;
            case 'analis':
                $updateData['analis_id'] = null;
                // Berkas kembali ke admin_kredit, jadi admin_kredit_id tetap ada
                break;
            case 'pemutus':
                $updateData['pemutus_id'] = null;
                // Berkas kembali ke analis, jadi analis_id tetap ada
                break;
        }

        $this->update($updateData);

        // Log activity
        $this->logActivity('return', "Berkas dikembalikan: {$reason}", $user);

        return true;
    }

    private function getPreviousStatus(): ?string
    {
        $previous = [
            self::STATUS_DIPERIKSA => self::STATUS_DIAJUKAN,       // Admin kredit -> Staf input
            self::STATUS_DIANALISIS => self::STATUS_DIPERIKSA,     // Analis -> Admin kredit  
            self::STATUS_SIAP_DIPUTUSKAN => self::STATUS_DIANALISIS, // Pemutus -> Analis
        ];

        return $previous[$this->status] ?? null;
    }

    // Notification Methods
    private function sendWorkflowNotifications(string $status): void
    {
        // Implement WhatsApp notifications based on status
        // This would integrate with your WhatsApp API
    }

    private function sendReturnNotification(string $reason): void
    {
        // Send notification to nasabah about return
    }

    // Activity Logging
    public function logActivity(string $action, string $description, User $user): void
    {
        $this->logPinjaman()->create([
            'aksi' => $action,
            'deskripsi' => $description,
            'user_id' => $user->id,
        ]);
    }
}
