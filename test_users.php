<?php

require_once 'vendor/autoload.php';

use App\Models\User;

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Available users for testing:\n\n";

$users = User::all();
foreach ($users as $user) {
    echo "Email: {$user->email}\n";
    echo "Role: {$user->role}\n";
    echo "Name: {$user->name}\n";
    echo "Login dengan: email={$user->email}, password=password\n";
    echo "--------------------\n";
}

echo "\nYou can login to the application at: http://127.0.0.1:8000/login\n";
echo "Test workflow with different users and roles.\n";
echo "\nWorkflow Test Scenario:\n";
echo "1. Login as 'admin_kredit' -> go to /pinjaman -> see available pinjaman -> click 'Ambil' button\n";
echo "2. Login as 'analis' -> go to /pinjaman -> see available pinjaman for analysis\n";
echo "3. Login as 'pemutus' -> go to /pinjaman -> see pinjaman ready for decision\n";
echo "4. Login as 'staf_input' -> go to /pinjaman -> see returned pinjaman that need action\n";
