<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\DB;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Update pinjaman #2
try {
    DB::table('pinjaman')
        ->where('id', 2)
        ->update(['locked_by' => 4]);

    $pinjaman = DB::table('pinjaman')
        ->where('id', 2)
        ->select('id', 'status', 'locked_at', 'locked_by')
        ->first();

    echo "Pinjaman #2 updated successfully:\n";
    echo "ID: " . $pinjaman->id . "\n";
    echo "Status: " . $pinjaman->status . "\n";
    echo "Locked At: " . $pinjaman->locked_at . "\n";
    echo "Locked By: " . $pinjaman->locked_by . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
