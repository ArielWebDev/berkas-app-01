<?php

require_once 'vendor/autoload.php';

use App\Services\WhatsAppService;
use App\Models\Pinjaman;
use App\Models\User;

// Load Laravel environment
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Http\Kernel')->bootstrap();

echo "=== TESTING WHATSAPP SERVICE ===\n";

$whatsappService = new WhatsAppService();

// Test 1: Single target
echo "\n1. Testing single target...\n";
$result1 = $whatsappService->testSendWhatsApp('081234567890', 'Test pesan single target dari BerkasApp');
echo "Result: " . ($result1 ? 'SUCCESS' : 'FAILED') . "\n";

// Test 2: Multiple targets
echo "\n2. Testing multiple targets...\n";
$phoneNumbers = ['081234567890', '081234567891', '081234567892'];
$result2 = $whatsappService->sendMultipleNotifications($phoneNumbers, 'Test pesan multiple targets dari BerkasApp');
echo "Result: " . ($result2 ? 'SUCCESS' : 'FAILED') . "\n";

// Test 3: Notification to next admin
echo "\n3. Testing notification to next admin...\n";
$pinjaman = Pinjaman::with('nasabah')->first();
$currentUser = User::where('role', 'admin_kredit')->first();

if ($pinjaman && $currentUser) {
    $result3 = $whatsappService->sendNotificationToNextAdmin($pinjaman, $currentUser, 'advance');
    echo "Result: " . ($result3 ? 'SUCCESS' : 'FAILED') . "\n";
    echo "Pinjaman: #{$pinjaman->id} - {$pinjaman->nasabah->nama_lengkap}\n";
    echo "Current User: {$currentUser->name} ({$currentUser->role})\n";
} else {
    echo "No pinjaman or current user found\n";
}

// Test 4: Notification to nasabah
echo "\n4. Testing notification to nasabah...\n";
if ($pinjaman && $currentUser) {
    $result4 = $whatsappService->sendNotificationToNasabah($pinjaman, 'taken', $currentUser);
    echo "Result: " . ($result4 ? 'SUCCESS' : 'FAILED') . "\n";
    echo "Nasabah: {$pinjaman->nasabah->nama_lengkap} - {$pinjaman->nasabah->nomor_wa}\n";
} else {
    echo "No pinjaman found\n";
}

echo "\n=== TESTING COMPLETED ===\n";

// Show current config
echo "\nCurrent WhatsApp Config:\n";
echo "API URL: " . config('services.whatsapp.api_url') . "\n";
echo "Token: " . substr(config('services.whatsapp.token'), 0, 10) . "...\n";
echo "Sender: " . config('services.whatsapp.sender') . "\n";

echo "\nDone!\n";
