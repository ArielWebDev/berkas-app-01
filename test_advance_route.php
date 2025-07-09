<?php

require_once 'vendor/autoload.php';

// Load Laravel environment
$app = require_once 'bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Http\Kernel');
$kernel->bootstrap();

echo "=== TESTING ADVANCE ROUTE ===\n";

// Test dengan HTTP Client
$client = new \GuzzleHttp\Client();

try {
    // Mendapatkan session untuk autentikasi
    $loginResponse = $client->post('http://localhost/berkas-app-02/public/login', [
        'form_params' => [
            'email' => 'admin@berkas.com',
            'password' => 'password123',
            '_token' => 'test-token'
        ],
        'cookies' => true
    ]);

    echo "Login response: " . $loginResponse->getStatusCode() . "\n";

    // Test advance route
    $response = $client->post('http://localhost/berkas-app-02/public/pinjaman/2/advance', [
        'json' => [
            'catatan' => 'Test advance dari script'
        ],
        'headers' => [
            'Content-Type' => 'application/json',
            'X-CSRF-TOKEN' => 'test-token'
        ],
        'cookies' => true
    ]);

    echo "Response status: " . $response->getStatusCode() . "\n";
    echo "Response body: " . $response->getBody()->getContents() . "\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

echo "=== TESTING COMPLETED ===\n";
