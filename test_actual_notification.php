<?php

require_once 'vendor/autoload.php';

use App\Services\WhatsAppService;
use App\Models\User;
use App\Models\Pinjaman;

// Load Laravel environment
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== TEST ACTUAL NOTIFICATION SYSTEM ===\n\n";

// Ambil pinjaman yang sedang dianalisis
$pinjaman = Pinjaman::where('status', 'dianalisis')->first();
if (!$pinjaman) {
    echo "No pinjaman with status 'dianalisis' found. Creating test scenario...\n";

    // Ambil pinjaman pertama dan set statusnya
    $pinjaman = Pinjaman::first();
    if ($pinjaman) {
        $pinjaman->status = 'dianalisis';
        $pinjaman->analis_id = null; // Clear assignment untuk test rebutan
        $pinjaman->locked_by = null;
        $pinjaman->locked_at = null;
        $pinjaman->save();
        echo "Set pinjaman #{$pinjaman->id} status to 'dianalisis' for testing\n";
    }
}

if (!$pinjaman) {
    echo "No pinjaman available for testing\n";
    exit;
}

echo "Testing with pinjaman #{$pinjaman->id}:\n";
echo "- Status: {$pinjaman->status}\n";
echo "- Nasabah: " . ($pinjaman->nasabah->nama_lengkap ?? 'Unknown') . "\n";
echo "- Analis ID: " . ($pinjaman->analis_id ?: 'null') . "\n";
echo "- Locked by: " . ($pinjaman->locked_by ?: 'null') . "\n\n";

// Test 1: Simulasi analis advance ke pemutus
echo "1. Testing analis advance to pemutus (sistem rebutan):\n";
$analis = User::where('role', 'analis')->first();
if ($analis) {
    echo "   - Current user: {$analis->name} (analis)\n";

    // Test generateGroupNotificationMessage untuk pemutus
    $whatsappService = new WhatsAppService();
    $reflection = new ReflectionClass($whatsappService);
    $generateGroupMessageMethod = $reflection->getMethod('generateGroupNotificationMessage');
    $generateGroupMessageMethod->setAccessible(true);

    $message = $generateGroupMessageMethod->invoke($whatsappService, $pinjaman, $analis, 'pemutus');
    echo "   - Message generated for all pemutus:\n";
    echo "   " . str_replace("\n", "\n   ", $message) . "\n\n";

    // Test sendNotificationToAllNextRoleUsers
    echo "   - Testing sendNotificationToAllNextRoleUsers...\n";
    $sendNotificationMethod = $reflection->getMethod('sendNotificationToAllNextRoleUsers');
    $sendNotificationMethod->setAccessible(true);

    // Dry run tanpa kirim actual WhatsApp
    echo "   - Target pemutus users:\n";
    $allPemutus = User::where('role', 'pemutus')->whereNotNull('nomor_wa')->get();
    foreach ($allPemutus as $pemutus) {
        echo "     * {$pemutus->name} ({$pemutus->nomor_wa})\n";
    }

    // Uncomment line di bawah untuk test actual WhatsApp notification
    // $result = $sendNotificationMethod->invoke($whatsappService, $pinjaman, $analis);
    // echo "   - Notification sent: " . ($result ? 'SUCCESS' : 'FAILED') . "\n";
}

// Test 2: Simulasi admin kredit advance ke analis
echo "\n2. Testing admin kredit advance to analis (sistem rebutan):\n";
$pinjaman->status = 'diperiksa'; // Change status for this test
$pinjaman->save();

$adminKredit = User::where('role', 'admin_kredit')->first();
if ($adminKredit) {
    echo "   - Current user: {$adminKredit->name} (admin_kredit)\n";
    echo "   - Pinjaman status changed to: {$pinjaman->status}\n";

    $message = $generateGroupMessageMethod->invoke($whatsappService, $pinjaman, $adminKredit, 'analis');
    echo "   - Message generated for all analis:\n";
    echo "   " . str_replace("\n", "\n   ", $message) . "\n\n";

    echo "   - Target analis users:\n";
    $allAnalis = User::where('role', 'analis')->whereNotNull('nomor_wa')->get();
    foreach ($allAnalis as $analis) {
        echo "     * {$analis->name} ({$analis->nomor_wa})\n";
    }
}

// Test 3: Test method sendNotificationToNextAdmin
echo "\n3. Testing main sendNotificationToNextAdmin method:\n";
$result = $whatsappService->sendNotificationToNextAdmin($pinjaman, $adminKredit, 'advance');
echo "   - sendNotificationToNextAdmin result: " . ($result ? 'SUCCESS' : 'FAILED') . "\n";

// Test 4: Test return notification (specific target)
echo "\n4. Testing return notification (specific target):\n";
$result = $whatsappService->sendNotificationToNextAdmin($pinjaman, $adminKredit, 'return');
echo "   - Return notification result: " . ($result ? 'SUCCESS' : 'FAILED') . "\n";

echo "\n=== TEST COMPLETED ===\n";
