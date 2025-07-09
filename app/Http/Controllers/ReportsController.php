<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pinjaman;
use App\Models\Nasabah;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportsController extends Controller
{
    public function index()
    {
        // Statistik umum
        $statistics = [
            'total_pinjaman' => Pinjaman::count(),
            'total_nasabah' => Nasabah::count(),
            'total_nilai_pinjaman' => Pinjaman::sum('jumlah_pinjaman'),
            'pinjaman_disetujui' => Pinjaman::where('status', 'disetujui')->count(),
            'pinjaman_ditolak' => Pinjaman::where('status', 'ditolak')->count(),
            'pinjaman_pending' => Pinjaman::whereNotIn('status', ['disetujui', 'ditolak'])->count(),
        ];

        // Data bulanan untuk 6 bulan terakhir
        $monthly_data = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthName = $month->format('M Y');

            $monthlyPinjaman = Pinjaman::whereMonth('created_at', $month->month)
                ->whereYear('created_at', $month->year)
                ->get();

            $monthly_data[] = [
                'month' => $monthName,
                'pinjaman_count' => $monthlyPinjaman->count(),
                'total_nilai' => $monthlyPinjaman->sum('jumlah_pinjaman'),
            ];
        }

        // Breakdown status
        $statusCounts = Pinjaman::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();

        $totalPinjaman = $statusCounts->sum('count');

        $status_breakdown = $statusCounts->map(function ($item) use ($totalPinjaman) {
            return [
                'status' => $item->status,
                'count' => $item->count,
                'percentage' => $totalPinjaman > 0 ? round(($item->count / $totalPinjaman) * 100, 1) : 0,
            ];
        });

        // Recent activities (simulasi)
        $recent_activities = [
            [
                'date' => Carbon::today()->format('d M Y'),
                'activity' => 'Pinjaman Disetujui',
                'count' => Pinjaman::where('status', 'disetujui')->whereDate('updated_at', Carbon::today())->count(),
            ],
            [
                'date' => Carbon::yesterday()->format('d M Y'),
                'activity' => 'Pinjaman Baru',
                'count' => Pinjaman::where('status', 'diajukan')->whereDate('created_at', Carbon::yesterday())->count(),
            ],
            [
                'date' => Carbon::today()->subDays(2)->format('d M Y'),
                'activity' => 'Analisis Selesai',
                'count' => Pinjaman::where('status', 'siap_diputuskan')->whereDate('updated_at', Carbon::today()->subDays(2))->count(),
            ],
        ];

        return Inertia::render('Reports/Index', [
            'statistics' => $statistics,
            'monthly_data' => $monthly_data,
            'status_breakdown' => $status_breakdown,
            'recent_activities' => $recent_activities,
        ]);
    }

    public function export(Request $request)
    {
        // Implementasi export report
        $format = $request->get('format', 'pdf');

        // Simulasi export
        return response()->json([
            'message' => 'Report exported successfully',
            'format' => $format,
            'download_url' => '/reports/download/' . time() . '.' . $format
        ]);
    }
}
