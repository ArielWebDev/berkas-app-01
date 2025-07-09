<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pinjaman;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $role = $user->role;

        // Data berdasarkan role
        $data = [
            'auth' => [
                'user' => $user
            ],
            'statistics' => $this->getGlobalStatistics(),
            'recent_pinjaman' => $this->getRecentPinjaman($role),
            'workflow_overview' => $this->getWorkflowOverview(),
            'recent_activity' => $this->getRecentActivity()
        ];

        return Inertia::render('DashboardMidone', $data);
    }

    private function getGlobalStatistics()
    {
        $currentMonth = now()->month;
        $currentYear = now()->year;
        $previousMonth = $currentMonth == 1 ? 12 : $currentMonth - 1;
        $previousYear = $currentMonth == 1 ? $currentYear - 1 : $currentYear;

        $currentMonthPinjaman = Pinjaman::whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->count();

        $previousMonthPinjaman = Pinjaman::whereMonth('created_at', $previousMonth)
            ->whereYear('created_at', $previousYear)
            ->count();

        $monthlyGrowth = $previousMonthPinjaman > 0
            ? (($currentMonthPinjaman - $previousMonthPinjaman) / $previousMonthPinjaman) * 100
            : 0;

        return [
            'total_pinjaman' => Pinjaman::count(),
            'total_nasabah' => \App\Models\Nasabah::count(),
            'pinjaman_pending' => Pinjaman::whereIn('status', ['diajukan', 'diperiksa', 'dianalisis', 'siap_diputuskan'])->count(),
            'pinjaman_disetujui' => Pinjaman::where('status', 'disetujui')->count(),
            'total_nominal' => Pinjaman::where('status', 'disetujui')->sum('jumlah_pinjaman'),
            'monthly_growth' => round($monthlyGrowth, 1)
        ];
    }

    private function getRecentPinjaman($role)
    {
        $query = Pinjaman::with(['nasabah', 'stafInput', 'adminKredit', 'analis', 'pemutus']);

        // Filter berdasarkan role
        switch ($role) {
            case 'staf_input':
                $query->where('staf_input_id', Auth::id());
                break;
            case 'admin_kredit':
                $query->where(function ($q) {
                    $q->where('status', 'diajukan')
                        ->orWhere('admin_kredit_id', Auth::id());
                });
                break;
            case 'analis':
                $query->where(function ($q) {
                    $q->where('status', 'dianalisis')
                        ->orWhere('analis_id', Auth::id());
                });
                break;
            case 'pemutus':
                // Pemutus bisa melihat semua
                break;
        }

        return $query->latest()->limit(10)->get();
    }

    private function getRecentActivity()
    {
        // Ambil log pinjaman sebagai aktivitas terbaru
        return \App\Models\LogPinjaman::with(['user', 'pinjaman.nasabah'])
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'description' => $log->keterangan,
                    'user' => [
                        'name' => $log->user->name
                    ],
                    'created_at' => $log->created_at,
                    'type' => $log->status_lama . '_to_' . $log->status_baru
                ];
            });
    }

    private function getWorkflowOverview()
    {
        return [
            'all_status' => [
                'diajukan' => Pinjaman::where('status', 'diajukan')->count(),
                'diperiksa' => Pinjaman::where('status', 'diperiksa')->count(),
                'dikembalikan' => Pinjaman::where('status', 'dikembalikan')->count(),
                'dianalisis' => Pinjaman::where('status', 'dianalisis')->count(),
                'siap_diputuskan' => Pinjaman::where('status', 'siap_diputuskan')->count(),
                'disetujui' => Pinjaman::where('status', 'disetujui')->count(),
                'ditolak' => Pinjaman::where('status', 'ditolak')->count(),
            ],
            'staff_workload' => [
                'admin_kredit' => User::where('role', 'admin_kredit')->count(),
                'analis' => User::where('role', 'analis')->count(),
                'pemutus' => User::where('role', 'pemutus')->count(),
            ]
        ];
    }

    public function workflow()
    {
        $user = Auth::user();

        // Get statistics for workflow dashboard
        $stats = [
            'total_pinjaman' => Pinjaman::count(),
            'diajukan' => Pinjaman::where('status', 'diajukan')->count(),
            'diperiksa' => Pinjaman::where('status', 'diperiksa')->count(),
            'dikembalikan' => Pinjaman::where('status', 'dikembalikan')->count(),
            'dianalisis' => Pinjaman::where('status', 'dianalisis')->count(),
            'siap_diputuskan' => Pinjaman::where('status', 'siap_diputuskan')->count(),
            'disetujui' => Pinjaman::where('status', 'disetujui')->count(),
            'ditolak' => Pinjaman::where('status', 'ditolak')->count(),
        ];

        // Filter stats based on user role
        switch ($user->role) {
            case 'staf_input':
                $stats['total_pinjaman'] = Pinjaman::where('staf_input_id', $user->id)->count();
                $stats['dikembalikan'] = Pinjaman::where('staf_input_id', $user->id)->where('status', 'dikembalikan')->count();
                break;
            case 'admin_kredit':
                $stats['diajukan'] = Pinjaman::where('status', 'diajukan')->count();
                $stats['diperiksa'] = Pinjaman::where('admin_kredit_id', $user->id)->where('status', 'diperiksa')->count();
                break;
            case 'analis':
                $stats['dianalisis'] = Pinjaman::where('status', 'dianalisis')->count();
                break;
            case 'pemutus':
                $stats['siap_diputuskan'] = Pinjaman::where('status', 'siap_diputuskan')->count();
                $stats['disetujui'] = Pinjaman::where('pemutus_id', $user->id)->where('status', 'disetujui')->count();
                $stats['ditolak'] = Pinjaman::where('pemutus_id', $user->id)->where('status', 'ditolak')->count();
                break;
        }

        return Inertia::render('WorkflowDashboard', [
            'auth' => ['user' => $user],
            'stats' => $stats
        ]);
    }
}
