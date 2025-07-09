<?php

require_once 'vendor/autoload.php';

use App\Services\WhatsAppService;
use App\Models\User;
use App\Models\Pinjaman;

// Load Laravel environment
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== TEST GENERALIZED WHATSAPP SERVICE ===\n\n";

// Test 1: Cek jumlah user per role
echo "1. Testing getUserCountByRole():\n";
$whatsappService = new WhatsAppService();
$counts = $whatsappService->getUserCountByRole();
foreach ($counts as $role => $count) {
    echo "   - $role: $count user(s)\n";
}

// Test 2: Cek role mapping
echo "\n2. Testing getNextRole() mapping:\n";
$testRoles = ['admin_kredit', 'analis', 'pemutus'];
$reflection = new ReflectionClass($whatsappService);
$getNextRoleMethod = $reflection->getMethod('getNextRole');
$getNextRoleMethod->setAccessible(true);

foreach ($testRoles as $role) {
    $nextRole = $getNextRoleMethod->invoke($whatsappService, $role);
    echo "   - $role -> " . ($nextRole ?: 'null') . "\n";
}

// Test 3: Ambil sample pinjaman untuk test
echo "\n3. Testing dengan sample pinjaman:\n";
$pinjaman = Pinjaman::first();
if ($pinjaman) {
    echo "   - Pinjaman ID: {$pinjaman->id}\n";
    echo "   - Status: {$pinjaman->status}\n";
    echo "   - Nasabah: " . ($pinjaman->nasabah->nama_lengkap ?? 'Unknown') . "\n";

    // Test 4: Generate group notification message
    echo "\n4. Testing generateGroupNotificationMessage():\n";
    $currentUser = User::where('role', 'admin_kredit')->first();
    if ($currentUser) {
        $generateGroupMessageMethod = $reflection->getMethod('generateGroupNotificationMessage');
        $generateGroupMessageMethod->setAccessible(true);

        $message = $generateGroupMessageMethod->invoke($whatsappService, $pinjaman, $currentUser, 'analis');
        echo "   Sample message for analis:\n";
        echo "   " . str_replace("\n", "\n   ", $message) . "\n";
    }
} else {
    echo "   - No pinjaman found in database\n";
}

// Test 5: Cek users untuk setiap role
echo "\n5. Testing users availability:\n";
foreach ($testRoles as $role) {
    $users = User::where('role', $role)->whereNotNull('nomor_wa')->get();
    echo "   - $role: " . $users->count() . " user(s) with WhatsApp number\n";
    foreach ($users as $user) {
        echo "     * {$user->name} ({$user->nomor_wa})\n";
    }
}

echo "\n=== TEST COMPLETED ===\n";
