<?php

require_once 'vendor/autoload.php';

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Creating test users for workflow testing...\n";

// Get atau create test admin_kredit
$adminKredit = User::where('email', 'admin.kredit@test.com')->first();
if (!$adminKredit) {
    $adminKredit = User::create([
        'name' => 'Admin Kredit Test',
        'email' => 'admin.kredit@test.com',
        'password' => Hash::make('password123'),
        'role' => 'admin_kredit',
        'nomor_wa' => '081234567890'
    ]);
    echo "Created Admin Kredit: {$adminKredit->email}\n";
} else {
    echo "Admin Kredit exists: {$adminKredit->email}\n";
}

// Get atau create test analis
$analis = User::where('email', 'analis@test.com')->first();
if (!$analis) {
    $analis = User::create([
        'name' => 'Analis Test',
        'email' => 'analis@test.com',
        'password' => Hash::make('password123'),
        'role' => 'analis',
        'nomor_wa' => '081234567891'
    ]);
    echo "Created Analis: {$analis->email}\n";
} else {
    echo "Analis exists: {$analis->email}\n";
}

// Get atau create test pemutus
$pemutus = User::where('email', 'pemutus@test.com')->first();
if (!$pemutus) {
    $pemutus = User::create([
        'name' => 'Pemutus Test',
        'email' => 'pemutus@test.com',
        'password' => Hash::make('password123'),
        'role' => 'pemutus',
        'nomor_wa' => '081234567892'
    ]);
    echo "Created Pemutus: {$pemutus->email}\n";
} else {
    echo "Pemutus exists: {$pemutus->email}\n";
}

// Get atau create test staf input
$stafInput = User::where('email', 'staf@test.com')->first();
if (!$stafInput) {
    $stafInput = User::create([
        'name' => 'Staf Input Test',
        'email' => 'staf@test.com',
        'password' => Hash::make('password123'),
        'role' => 'staf_input',
        'nomor_wa' => '081234567893'
    ]);
    echo "Created Staf Input: {$stafInput->email}\n";
} else {
    echo "Staf Input exists: {$stafInput->email}\n";
}

echo "\nTest credentials:\n";
echo "Admin Kredit: admin.kredit@test.com / password123\n";
echo "Analis: analis@test.com / password123\n";
echo "Pemutus: pemutus@test.com / password123\n";
echo "Staf Input: staf@test.com / password123\n\n";

echo "Ready for workflow testing!\n";
