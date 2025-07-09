<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Super Admin
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@berkas.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'nomor_wa' => '081234567800',
        ]);

        // Staf Input
        User::create([
            'name' => 'Staf Input 1',
            'email' => 'staf1@berkas.com',
            'password' => Hash::make('password'),
            'role' => 'staf_input',
            'nomor_wa' => '081234567801',
        ]);

        User::create([
            'name' => 'Staf Input 2',
            'email' => 'staf2@berkas.com',
            'password' => Hash::make('password'),
            'role' => 'staf_input',
            'nomor_wa' => '081234567802',
        ]);

        // Admin Kredit
        User::create([
            'name' => 'Admin Kredit 1',
            'email' => 'admin1@berkas.com',
            'password' => Hash::make('password'),
            'role' => 'admin_kredit',
            'nomor_wa' => '081234567803',
        ]);

        User::create([
            'name' => 'Admin Kredit 2',
            'email' => 'admin2@berkas.com',
            'password' => Hash::make('password'),
            'role' => 'admin_kredit',
            'nomor_wa' => '081234567804',
        ]);

        // Analis
        User::create([
            'name' => 'Analis 1',
            'email' => 'analis1@berkas.com',
            'password' => Hash::make('password'),
            'role' => 'analis',
            'nomor_wa' => '081234567805',
        ]);

        User::create([
            'name' => 'Analis 2',
            'email' => 'analis2@berkas.com',
            'password' => Hash::make('password'),
            'role' => 'analis',
            'nomor_wa' => '081234567806',
        ]);

        // Pemutus
        User::create([
            'name' => 'Pemutus 1',
            'email' => 'pemutus1@berkas.com',
            'password' => Hash::make('password'),
            'role' => 'pemutus',
            'nomor_wa' => '081234567807',
        ]);

        User::create([
            'name' => 'Pemutus 2',
            'email' => 'pemutus2@berkas.com',
            'password' => Hash::make('password'),
            'role' => 'pemutus',
            'nomor_wa' => '081234567808',
        ]);
    }
}