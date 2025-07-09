<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Nasabah;

class NasabahSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Nasabah::create([
            'nama_lengkap' => 'Ahmad Suhendra',
            'nomor_ktp' => '3201234567890001',
            'nik' => '3201234567890001',
            'alamat' => 'Jl. Merdeka No. 123, Jakarta Selatan',
            'nomor_wa' => '081234567890',
            'no_telepon' => '021-7654321',
            'tempat_lahir' => 'Jakarta',
            'tanggal_lahir' => '1985-03-15',
            'jenis_kelamin' => 'L',
            'pekerjaan' => 'Wiraswasta',
            'penghasilan' => 15000000,
            'status_perkawinan' => 'kawin',
        ]);

        Nasabah::create([
            'nama_lengkap' => 'Siti Rahayu',
            'nomor_ktp' => '3201234567890002',
            'nik' => '3201234567890002',
            'alamat' => 'Jl. Sudirman No. 456, Jakarta Pusat',
            'nomor_wa' => '081234567891',
            'no_telepon' => '021-7654322',
            'tempat_lahir' => 'Bandung',
            'tanggal_lahir' => '1990-07-22',
            'jenis_kelamin' => 'P',
            'pekerjaan' => 'Guru',
            'penghasilan' => 8000000,
            'status_perkawinan' => 'kawin',
        ]);

        Nasabah::create([
            'nama_lengkap' => 'Budi Santoso',
            'nomor_ktp' => '3201234567890003',
            'nik' => '3201234567890003',
            'alamat' => 'Jl. Thamrin No. 789, Jakarta Barat',
            'nomor_wa' => '081234567892',
            'no_telepon' => '021-7654323',
            'tempat_lahir' => 'Surabaya',
            'tanggal_lahir' => '1982-11-08',
            'jenis_kelamin' => 'L',
            'pekerjaan' => 'Karyawan Swasta',
            'penghasilan' => 12000000,
            'status_perkawinan' => 'kawin',
        ]);

        Nasabah::create([
            'nama_lengkap' => 'Dewi Lestari',
            'nomor_ktp' => '3201234567890004',
            'nik' => '3201234567890004',
            'alamat' => 'Jl. Gatot Subroto No. 321, Jakarta Timur',
            'nomor_wa' => '081234567893',
            'no_telepon' => '021-7654324',
            'tempat_lahir' => 'Yogyakarta',
            'tanggal_lahir' => '1988-05-13',
            'jenis_kelamin' => 'P',
            'pekerjaan' => 'Dokter',
            'penghasilan' => 25000000,
            'status_perkawinan' => 'belum_kawin',
        ]);

        Nasabah::create([
            'nama_lengkap' => 'Rizki Pratama',
            'nomor_ktp' => '3201234567890005',
            'nik' => '3201234567890005',
            'alamat' => 'Jl. Kuningan No. 654, Jakarta Utara',
            'nomor_wa' => '081234567894',
            'no_telepon' => '021-7654325',
            'tempat_lahir' => 'Medan',
            'tanggal_lahir' => '1992-09-28',
            'jenis_kelamin' => 'L',
            'pekerjaan' => 'Programmer',
            'penghasilan' => 18000000,
            'status_perkawinan' => 'belum_kawin',
        ]);

        // Add more nasabah for testing
        Nasabah::create([
            'nama_lengkap' => 'Maya Sari',
            'nomor_ktp' => '3201234567890006',
            'nik' => '3201234567890006',
            'alamat' => 'Jl. HR Rasuna Said No. 100, Jakarta Selatan',
            'nomor_wa' => '081234567895',
            'no_telepon' => '021-7654326',
            'tempat_lahir' => 'Palembang',
            'tanggal_lahir' => '1987-12-05',
            'jenis_kelamin' => 'P',
            'pekerjaan' => 'Akuntan',
            'penghasilan' => 14000000,
            'status_perkawinan' => 'kawin',
        ]);

        Nasabah::create([
            'nama_lengkap' => 'Andi Wijaya',
            'nomor_ktp' => '3201234567890007',
            'nik' => '3201234567890007',
            'alamat' => 'Jl. MT Haryono No. 250, Jakarta Timur',
            'nomor_wa' => '081234567896',
            'no_telepon' => '021-7654327',
            'tempat_lahir' => 'Makassar',
            'tanggal_lahir' => '1984-04-18',
            'jenis_kelamin' => 'L',
            'pekerjaan' => 'Manager',
            'penghasilan' => 22000000,
            'status_perkawinan' => 'kawin',
        ]);
    }
}
