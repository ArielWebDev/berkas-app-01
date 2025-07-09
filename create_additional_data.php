<?php

require_once 'vendor/autoload.php';

use App\Models\User;
use App\Models\Nasabah;
use App\Models\Pinjaman;
use App\Models\LogPinjaman;

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Creating additional sample data for complete workflow testing...\n";

// Buat beberapa pinjaman yang dikembalikan ke staf
$stafInput = User::where('role', 'staf_input')->first();
$nasabah = Nasabah::take(3)->get();

foreach ($nasabah as $index => $n) {
    $pinjaman = Pinjaman::create([
        'nasabah_id' => $n->id,
        'staf_input_id' => $stafInput->id,
        'jumlah_pinjaman' => 50000000 + ($index * 10000000),
        'tujuan_pinjaman' => 'Modal usaha ' . ($index + 1),
        'jangka_waktu' => 12 + ($index * 6),
        'bunga' => 12.5,
        'status' => 'dikembalikan',
    ]);

    // Log aktivitas
    LogPinjaman::create([
        'pinjaman_id' => $pinjaman->id,
        'user_id' => $stafInput->id,
        'aksi' => 'Pinjaman Dikembalikan',
        'status_sebelum' => 'diperiksa',
        'status_sesudah' => 'dikembalikan',
        'catatan' => 'Berkas dikembalikan dari Admin Kredit - perlu kelengkapan dokumen'
    ]);

    echo "Created returned pinjaman #{$pinjaman->id} for {$n->nama_lengkap}\n";
}

echo "\nFinal data summary:\n";
echo "Total Pinjaman: " . Pinjaman::count() . "\n";

$statusCounts = Pinjaman::selectRaw('status, count(*) as total')->groupBy('status')->get();
foreach ($statusCounts as $status) {
    echo $status->status . ': ' . $status->total . "\n";
}

echo "\nWorkflow testing ready!\n";
