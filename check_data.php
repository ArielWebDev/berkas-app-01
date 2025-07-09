<?php

require_once 'vendor/autoload.php';

use App\Models\User;
use App\Models\Nasabah;
use App\Models\Pinjaman;

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Checking sample data...\n";
echo "Users: " . User::count() . "\n";
echo "Nasabah: " . Nasabah::count() . "\n";
echo "Pinjaman: " . Pinjaman::count() . "\n\n";

echo "Pinjaman by status:\n";
$statusCounts = Pinjaman::selectRaw('status, count(*) as total')->groupBy('status')->get();
foreach ($statusCounts as $status) {
    echo $status->status . ': ' . $status->total . "\n";
}

echo "\nUsers by role:\n";
$roleCounts = User::selectRaw('role, count(*) as total')->groupBy('role')->get();
foreach ($roleCounts as $role) {
    echo $role->role . ': ' . $role->total . "\n";
}

echo "\nSample pinjaman with available status for each role:\n";

// Pinjaman tersedia untuk admin_kredit (status diajukan, admin_kredit_id null)
$availableForAdminKredit = Pinjaman::where('status', 'diajukan')->whereNull('admin_kredit_id')->count();
echo "Available for admin_kredit: " . $availableForAdminKredit . "\n";

// Pinjaman tersedia untuk analis (status dianalisis, analis_id null)
$availableForAnalis = Pinjaman::where('status', 'dianalisis')->whereNull('analis_id')->count();
echo "Available for analis: " . $availableForAnalis . "\n";

// Pinjaman tersedia untuk pemutus (status siap_diputuskan, pemutus_id null)
$availableForPemutus = Pinjaman::where('status', 'siap_diputuskan')->whereNull('pemutus_id')->count();
echo "Available for pemutus: " . $availableForPemutus . "\n";
