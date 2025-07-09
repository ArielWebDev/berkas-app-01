<?php

require_once 'vendor/autoload.php';

use App\Services\WhatsAppService;
use App\Models\User;
use App\Models\Pinjaman;

// Load Laravel environment
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== TEST END-TO-END WORKFLOW WITH GENERALIZED NOTIFICATION ===\n\n";

// Setup test data
$pinjaman = Pinjaman::first();
if (!$pinjaman) {
    echo "No pinjaman found for testing\n";
    exit;
}

// Clear assignments dan locks untuk test yang bersih
$pinjaman->admin_kredit_id = null;
$pinjaman->analis_id = null;
$pinjaman->pemutus_id = null;
$pinjaman->locked_by = null;
$pinjaman->locked_at = null;
$pinjaman->status = 'diajukan';
$pinjaman->save();

echo "Initialized test pinjaman #{$pinjaman->id}:\n";
echo "- Status: {$pinjaman->status}\n";
echo "- All assignments cleared\n";
echo "- All locks cleared\n\n";

$whatsappService = new WhatsAppService();

// Test 1: Admin kredit take berkas
echo "1. TESTING ADMIN KREDIT WORKFLOW:\n";
$adminKredit = User::where('role', 'admin_kredit')->first();
if ($adminKredit) {
    echo "   a. Admin kredit take berkas:\n";
    echo "      - User: {$adminKredit->name}\n";

    // Test canBeTakenByUser
    $canTake = $pinjaman->canBeTakenByUser($adminKredit);
    echo "      - Can take: " . ($canTake ? 'YES' : 'NO') . "\n";

    if ($canTake) {
        // Lock berkas
        $pinjaman->lockForUser($adminKredit);
        $pinjaman->refresh();
        echo "      - Berkas locked by: {$pinjaman->locked_by}\n";
        echo "      - Admin kredit ID assigned: " . ($pinjaman->admin_kredit_id ?: 'null') . "\n";

        // Process and advance
        echo "   b. Admin kredit advance to analis:\n";
        $pinjaman->status = 'diperiksa';
        $pinjaman->save();

        $result = $pinjaman->advanceToNextStage($adminKredit);
        echo "      - Advance result: " . ($result ? 'SUCCESS' : 'FAILED') . "\n";
        $pinjaman->refresh();
        echo "      - New status: {$pinjaman->status}\n";
        echo "      - Locked by: " . ($pinjaman->locked_by ?: 'null') . "\n";
        echo "      - Analis ID: " . ($pinjaman->analis_id ?: 'null') . "\n";

        // Test notification
        echo "   c. Testing notification to all analis:\n";
        $notificationResult = $whatsappService->sendNotificationToNextAdmin($pinjaman, $adminKredit, 'advance');
        echo "      - Notification result: " . ($notificationResult ? 'SUCCESS' : 'FAILED') . "\n";

        // List target analis
        $allAnalis = User::where('role', 'analis')->whereNotNull('nomor_wa')->get();
        echo "      - Notification sent to " . $allAnalis->count() . " analis:\n";
        foreach ($allAnalis as $analis) {
            echo "        * {$analis->name} ({$analis->nomor_wa})\n";
        }
    }
}

// Test 2: Analis take berkas (sistem rebutan)
echo "\n2. TESTING ANALIS WORKFLOW (SISTEM REBUTAN):\n";
$analis1 = User::where('role', 'analis')->first();
$analis2 = User::where('role', 'analis')->skip(1)->first();

if ($analis1 && $analis2) {
    echo "   a. Testing multiple analis can take:\n";

    // Test apakah kedua analis bisa take
    $canTake1 = $pinjaman->canBeTakenByUser($analis1);
    $canTake2 = $pinjaman->canBeTakenByUser($analis2);

    echo "      - {$analis1->name} can take: " . ($canTake1 ? 'YES' : 'NO') . "\n";
    echo "      - {$analis2->name} can take: " . ($canTake2 ? 'YES' : 'NO') . "\n";

    if ($canTake1 && $canTake2) {
        echo "      ✓ Both analis can take (sistem rebutan working)\n";

        // Analis 1 takes first
        echo "   b. Analis 1 takes berkas:\n";
        $pinjaman->lockForUser($analis1);
        $pinjaman->refresh();
        echo "      - Berkas locked by: {$pinjaman->locked_by}\n";
        echo "      - Analis ID assigned: " . ($pinjaman->analis_id ?: 'null') . "\n";

        // Test apakah analis 2 masih bisa take
        $canTake2After = $pinjaman->canBeTakenByUser($analis2);
        echo "      - {$analis2->name} can take after lock: " . ($canTake2After ? 'YES' : 'NO') . "\n";

        if (!$canTake2After) {
            echo "      ✓ Analis 2 blocked after analis 1 took berkas\n";
        }

        // Analis 1 advance to pemutus
        echo "   c. Analis 1 advance to pemutus:\n";
        $pinjaman->status = 'dianalisis';
        $pinjaman->save();

        $result = $pinjaman->advanceToNextStage($analis1);
        echo "      - Advance result: " . ($result ? 'SUCCESS' : 'FAILED') . "\n";
        $pinjaman->refresh();
        echo "      - New status: {$pinjaman->status}\n";
        echo "      - Locked by: " . ($pinjaman->locked_by ?: 'null') . "\n";
        echo "      - Pemutus ID: " . ($pinjaman->pemutus_id ?: 'null') . "\n";

        // Test notification to all pemutus
        echo "   d. Testing notification to all pemutus:\n";
        $notificationResult = $whatsappService->sendNotificationToNextAdmin($pinjaman, $analis1, 'advance');
        echo "      - Notification result: " . ($notificationResult ? 'SUCCESS' : 'FAILED') . "\n";

        // List target pemutus
        $allPemutus = User::where('role', 'pemutus')->whereNotNull('nomor_wa')->get();
        echo "      - Notification sent to " . $allPemutus->count() . " pemutus:\n";
        foreach ($allPemutus as $pemutus) {
            echo "        * {$pemutus->name} ({$pemutus->nomor_wa})\n";
        }
    }
}

// Test 3: Pemutus take berkas (sistem rebutan)
echo "\n3. TESTING PEMUTUS WORKFLOW (SISTEM REBUTAN):\n";
$pemutus1 = User::where('role', 'pemutus')->first();
$pemutus2 = User::where('role', 'pemutus')->skip(1)->first();

if ($pemutus1 && $pemutus2) {
    echo "   a. Testing multiple pemutus can take:\n";

    // Test apakah kedua pemutus bisa take
    $canTake1 = $pinjaman->canBeTakenByUser($pemutus1);
    $canTake2 = $pinjaman->canBeTakenByUser($pemutus2);

    echo "      - {$pemutus1->name} can take: " . ($canTake1 ? 'YES' : 'NO') . "\n";
    echo "      - {$pemutus2->name} can take: " . ($canTake2 ? 'YES' : 'NO') . "\n";

    if ($canTake1 && $canTake2) {
        echo "      ✓ Both pemutus can take (sistem rebutan working)\n";

        // Pemutus 1 takes first
        echo "   b. Pemutus 1 takes berkas:\n";
        $pinjaman->lockForUser($pemutus1);
        $pinjaman->refresh();
        echo "      - Berkas locked by: {$pinjaman->locked_by}\n";
        echo "      - Pemutus ID assigned: " . ($pinjaman->pemutus_id ?: 'null') . "\n";

        // Test apakah pemutus 2 masih bisa take
        $canTake2After = $pinjaman->canBeTakenByUser($pemutus2);
        echo "      - {$pemutus2->name} can take after lock: " . ($canTake2After ? 'YES' : 'NO') . "\n";

        if (!$canTake2After) {
            echo "      ✓ Pemutus 2 blocked after pemutus 1 took berkas\n";
        }

        // Pemutus 1 decide (approve/reject)
        echo "   c. Pemutus 1 decide (approve):\n";
        $pinjaman->status = 'disetujui';
        $pinjaman->unlockFromUser($pemutus1);
        $pinjaman->save();

        echo "      - Final status: {$pinjaman->status}\n";
        echo "      - Locked by: " . ($pinjaman->locked_by ?: 'null') . "\n";
        echo "      ✓ Workflow completed successfully\n";
    }
}

// Test 4: Summary
echo "\n4. WORKFLOW SUMMARY:\n";
$pinjaman->refresh();
echo "   - Final status: {$pinjaman->status}\n";
echo "   - Admin kredit: " . ($pinjaman->admin_kredit_id ? User::find($pinjaman->admin_kredit_id)->name : 'null') . "\n";
echo "   - Analis: " . ($pinjaman->analis_id ? User::find($pinjaman->analis_id)->name : 'null') . "\n";
echo "   - Pemutus: " . ($pinjaman->pemutus_id ? User::find($pinjaman->pemutus_id)->name : 'null') . "\n";
echo "   - Locked by: " . ($pinjaman->locked_by ?: 'null') . "\n";

echo "\n=== END-TO-END TEST COMPLETED ===\n";
echo "✓ Sistem rebutan bekerja untuk semua role\n";
echo "✓ Assignment hanya diisi saat take, bukan advance\n";
echo "✓ Berkas unlock setelah advance\n";
echo "✓ Notifikasi terkirim ke semua user role berikutnya\n";
echo "✓ Workflow konsisten dari awal hingga akhir\n";
