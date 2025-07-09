<?php

namespace App\Helpers;

class WorkflowHelper
{
    /**
     * Role hierarchy untuk menentukan level akses
     */
    public static function getRoleLevel($role)
    {
        $levels = [
            'staf_input' => 1,
            'admin_kredit' => 2,
            'analis' => 3,
            'pemutus' => 4, // Level tertinggi
        ];

        return $levels[$role] ?? 0;
    }

    /**
     * Cek apakah user bisa melihat pinjaman berdasarkan role level
     */
    public static function canViewPinjaman($userRole, $pinjaman)
    {
        $userLevel = self::getRoleLevel($userRole);

        // Pemutus (level 4) bisa melihat semua
        if ($userLevel >= 4) {
            return true;
        }

        return false; // Logic khusus per role sudah di Policy
    }

    /**
     * Get status workflow yang bisa diakses berdasarkan role
     */
    public static function getAccessibleStatuses($role)
    {
        switch ($role) {
            case 'staf_input':
                return ['diajukan', 'dikembalikan', 'diperiksa', 'dianalisis', 'siap_diputuskan', 'disetujui', 'ditolak'];
            case 'admin_kredit':
                return ['diajukan', 'diperiksa'];
            case 'analis':
                return ['dianalisis'];
            case 'pemutus':
                return ['diajukan', 'diperiksa', 'dikembalikan', 'dianalisis', 'siap_diputuskan', 'disetujui', 'ditolak'];
            default:
                return [];
        }
    }

    /**
     * Get status badge color
     */
    public static function getStatusBadgeColor($status)
    {
        $colors = [
            'diajukan' => 'blue',
            'diperiksa' => 'yellow',
            'dikembalikan' => 'red',
            'dianalisis' => 'purple',
            'siap_diputuskan' => 'indigo',
            'disetujui' => 'green',
            'ditolak' => 'red',
        ];

        return $colors[$status] ?? 'gray';
    }

    /**
     * Get next possible actions berdasarkan role dan status
     */
    public static function getNextActions($userRole, $pinjaman, $userId)
    {
        $actions = [];

        switch ($userRole) {
            case 'admin_kredit':
                if ($pinjaman->status === 'diajukan') {
                    $actions[] = 'lock_berkas';
                }
                if ($pinjaman->status === 'diperiksa' && $pinjaman->admin_kredit_id === $userId) {
                    $actions[] = 'upload_dokumen_ojk';
                    $actions[] = 'admin_decision';
                }
                break;

            case 'analis':
                if ($pinjaman->status === 'dianalisis' && is_null($pinjaman->analis_id)) {
                    $actions[] = 'assign_to_analis';
                }
                if ($pinjaman->status === 'dianalisis' && $pinjaman->analis_id === $userId) {
                    $actions[] = 'upload_dokumen_lapangan';
                    $actions[] = 'finish_analysis';
                }
                break;

            case 'pemutus':
                if ($pinjaman->status === 'siap_diputuskan') {
                    $actions[] = 'final_decision';
                }
                break;
        }

        return $actions;
    }

    /**
     * Get current handler info
     */
    public static function getCurrentHandler($pinjaman)
    {
        switch ($pinjaman->status) {
            case 'diajukan':
                return [
                    'stage' => 'Menunggu Admin Kredit',
                    'handler' => 'Admin Kredit mana saja',
                    'action_needed' => 'Lock berkas untuk pemeriksaan'
                ];
            case 'diperiksa':
                return [
                    'stage' => 'Sedang Diperiksa Admin Kredit',
                    'handler' => $pinjaman->adminKredit->name ?? 'Admin Kredit',
                    'action_needed' => 'Upload dokumen OJK dan keputusan'
                ];
            case 'dikembalikan':
                return [
                    'stage' => 'Dikembalikan ke Staf Input',
                    'handler' => $pinjaman->stafInput->name ?? 'Staf Input',
                    'action_needed' => 'Perbaiki berkas sesuai catatan'
                ];
            case 'dianalisis':
                if (is_null($pinjaman->analis_id)) {
                    return [
                        'stage' => 'Menunggu Analis',
                        'handler' => 'Analis mana saja',
                        'action_needed' => 'Ambil berkas untuk dianalisis'
                    ];
                } else {
                    return [
                        'stage' => 'Sedang Dianalisis',
                        'handler' => $pinjaman->analis->name ?? 'Analis',
                        'action_needed' => 'Analisis lapangan dan dokumentasi'
                    ];
                }
            case 'siap_diputuskan':
                return [
                    'stage' => 'Menunggu Keputusan Pemutus',
                    'handler' => 'Pemutus',
                    'action_needed' => 'Keputusan final: setuju/tolak'
                ];
            case 'disetujui':
                return [
                    'stage' => 'Pinjaman Disetujui',
                    'handler' => $pinjaman->pemutus->name ?? 'Pemutus',
                    'action_needed' => 'Proses selesai'
                ];
            case 'ditolak':
                return [
                    'stage' => 'Pinjaman Ditolak',
                    'handler' => $pinjaman->pemutus->name ?? 'Pemutus',
                    'action_needed' => 'Proses selesai'
                ];
            default:
                return [
                    'stage' => 'Status tidak dikenal',
                    'handler' => '-',
                    'action_needed' => '-'
                ];
        }
    }
}
