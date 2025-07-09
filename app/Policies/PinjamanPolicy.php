<?php

namespace App\Policies;

use App\Models\Pinjaman;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PinjamanPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['staf_input', 'admin_kredit', 'analis', 'pemutus']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Pinjaman $pinjaman): bool
    {
        switch ($user->role) {
            case 'staf_input':
                return $pinjaman->staf_input_id === $user->id;
            case 'admin_kredit':
                return $pinjaman->status === 'diajukan' || $pinjaman->admin_kredit_id === $user->id;
            case 'analis':
                return $pinjaman->status === 'dianalisis' || $pinjaman->analis_id === $user->id;
            case 'pemutus':
                return true; // Pemutus bisa lihat semua
            default:
                return false;
        }
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role === 'staf_input';
    }

    /**
     * Lock berkas by Admin Kredit
     */
    public function lockBerkas(User $user, Pinjaman $pinjaman): bool
    {
        return $user->role === 'admin_kredit' && $pinjaman->status === 'diajukan';
    }

    /**
     * Upload dokumen OJK by Admin Kredit
     * Allow upload if admin_kredit owns the pinjaman and status is diperiksa or dianalisis
     */
    public function uploadDokumenOjk(User $user, Pinjaman $pinjaman): bool
    {
        return $user->role === 'admin_kredit' &&
            $pinjaman->admin_kredit_id === $user->id &&
            in_array($pinjaman->status, ['diperiksa', 'dianalisis']);
    }

    /**
     * Admin Kredit decision
     */
    public function adminDecision(User $user, Pinjaman $pinjaman): bool
    {
        return $user->role === 'admin_kredit' &&
            $pinjaman->admin_kredit_id === $user->id &&
            $pinjaman->status === 'diperiksa';
    }

    /**
     * Assign to Analis
     */
    public function assignToAnalis(User $user, Pinjaman $pinjaman): bool
    {
        return $user->role === 'analis' &&
            $pinjaman->status === 'dianalisis' &&
            is_null($pinjaman->analis_id);
    }

    /**
     * Upload dokumen lapangan by Analis
     * Allow upload if analis owns the pinjaman and status is dianalisis or siap_diputuskan
     */
    public function uploadDokumenLapangan(User $user, Pinjaman $pinjaman): bool
    {
        return $user->role === 'analis' &&
            $pinjaman->analis_id === $user->id &&
            in_array($pinjaman->status, ['dianalisis', 'siap_diputuskan']);
    }

    /**
     * Finish analysis by Analis
     */
    public function finishAnalysis(User $user, Pinjaman $pinjaman): bool
    {
        return $user->role === 'analis' &&
            $pinjaman->analis_id === $user->id &&
            $pinjaman->status === 'dianalisis';
    }

    /**
     * Final decision by Pemutus
     */
    public function finalDecision(User $user, Pinjaman $pinjaman): bool
    {
        return $user->role === 'pemutus' &&
            $pinjaman->status === 'siap_diputuskan';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Pinjaman $pinjaman): bool
    {
        return false; // Update dibatasi melalui method khusus
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Pinjaman $pinjaman): bool
    {
        return $user->role === 'staf_input' &&
            $pinjaman->staf_input_id === $user->id &&
            $pinjaman->status === 'diajukan';
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Pinjaman $pinjaman): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Pinjaman $pinjaman): bool
    {
        return false;
    }
}
