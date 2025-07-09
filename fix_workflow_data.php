<?php

require_once 'vendor/autoload.php';

use App\Models\Pinjaman;
use App\Models\User;
use Illuminate\Support\Facades\DB;

// Load Laravel environment
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Http\Kernel')->bootstrap();

echo "=== FIXING WORKFLOW DATA ===\n";

// Ambil semua pinjaman yang statusnya dianalisis tapi tidak punya analis_id
$pinjaman = Pinjaman::where('status', 'dianalisis')
    ->whereNull('analis_id')
    ->get();

echo "Found " . $pinjaman->count() . " pinjaman with status 'dianalisis' but no analis_id\n";

foreach ($pinjaman as $p) {
    // Cari analis yang tersedia
    $analis = User::where('role', 'analis')
        ->inRandomOrder()
        ->first();

    if ($analis) {
        $p->analis_id = $analis->id;
        $p->save();
        echo "Updated pinjaman #{$p->id} - assigned analis: {$analis->name}\n";
    } else {
        echo "No analis found for pinjaman #{$p->id}\n";
    }
}

// Ambil semua pinjaman yang statusnya diputus tapi tidak punya pemutus_id
$pinjaman = Pinjaman::where('status', 'diputus')
    ->whereNull('pemutus_id')
    ->get();

echo "\nFound " . $pinjaman->count() . " pinjaman with status 'diputus' but no pemutus_id\n";

foreach ($pinjaman as $p) {
    // Cari pemutus yang tersedia
    $pemutus = User::where('role', 'pemutus')
        ->inRandomOrder()
        ->first();

    if ($pemutus) {
        $p->pemutus_id = $pemutus->id;
        $p->save();
        echo "Updated pinjaman #{$p->id} - assigned pemutus: {$pemutus->name}\n";
    } else {
        echo "No pemutus found for pinjaman #{$p->id}\n";
    }
}

// Reset locked_by untuk semua pinjaman yang tidak sedang diproses
$resetCount = Pinjaman::whereNotNull('locked_by')
    ->whereIn('status', ['diajukan', 'dianalisis', 'diputus'])
    ->update(['locked_by' => null]);

echo "\nReset locked_by for {$resetCount} pinjaman\n";

echo "\n=== WORKFLOW DATA FIXED ===\n";

// Tampilkan summary
$summary = DB::select("
    SELECT 
        status,
        COUNT(*) as total,
        COUNT(admin_kredit_id) as has_admin_kredit,
        COUNT(analis_id) as has_analis,
        COUNT(pemutus_id) as has_pemutus,
        COUNT(locked_by) as currently_locked
    FROM pinjaman 
    GROUP BY status
");

echo "\nSUMMARY:\n";
foreach ($summary as $s) {
    echo "Status: {$s->status}\n";
    echo "  Total: {$s->total}\n";
    echo "  Has Admin Kredit: {$s->has_admin_kredit}\n";
    echo "  Has Analis: {$s->has_analis}\n";
    echo "  Has Pemutus: {$s->has_pemutus}\n";
    echo "  Currently Locked: {$s->currently_locked}\n\n";
}

echo "Done!\n";
