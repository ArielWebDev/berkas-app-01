<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Nasabah;

class NasabahSeederNew extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $nasabah = [
            [
                'nama_lengkap' => 'Ahmad Budi Santoso',
                'nik' => '3201123456789012',
                'alamat' => 'Jl. Merdeka No. 123, RT 01/RW 02, Kelurahan Merdeka, Kecamatan Pusat, Jakarta Pusat',
                'nomor_wa' => '081234567890',
                'tempat_lahir' => 'Jakarta',
                'tanggal_lahir' => '1985-05-15',
                'jenis_kelamin' => 'L',
                'pekerjaan' => 'Karyawan Swasta',
                'penghasilan' => 8500000,
                'status_perkawinan' => 'menikah',
                'nama_ibu_kandung' => 'Siti Rahayu',
                'agama' => 'Islam',
            ],
            [
                'nama_lengkap' => 'Sari Dewi Lestari',
                'nik' => '3201234567890123',
                'alamat' => 'Jl. Sudirman No. 456, RT 03/RW 04, Kelurahan Sudirman, Kecamatan Selatan, Jakarta Selatan',
                'nomor_wa' => '081987654321',
                'tempat_lahir' => 'Bandung',
                'tanggal_lahir' => '1990-08-22',
                'jenis_kelamin' => 'P',
                'pekerjaan' => 'Guru',
                'penghasilan' => 6500000,
                'status_perkawinan' => 'belum_menikah',
                'nama_ibu_kandung' => 'Ida Bagus',
                'agama' => 'Hindu',
            ],
            [
                'nama_lengkap' => 'Budi Hartono',
                'nik' => '3201345678901234',
                'alamat' => 'Jl. Gatot Subroto No. 789, RT 05/RW 06, Kelurahan Gatot, Kecamatan Barat, Jakarta Barat',
                'nomor_wa' => '081112233445',
                'tempat_lahir' => 'Surabaya',
                'tanggal_lahir' => '1988-12-10',
                'jenis_kelamin' => 'L',
                'pekerjaan' => 'Wiraswasta',
                'penghasilan' => 12000000,
                'status_perkawinan' => 'menikah',
                'nama_ibu_kandung' => 'Maria Magdalena',
                'agama' => 'Kristen',
            ],
            [
                'nama_lengkap' => 'Diana Kusuma',
                'nik' => '3201456789012345',
                'alamat' => 'Jl. Thamrin No. 321, RT 07/RW 08, Kelurahan Thamrin, Kecamatan Utara, Jakarta Utara',
                'nomor_wa' => '081555666777',
                'tempat_lahir' => 'Medan',
                'tanggal_lahir' => '1992-03-18',
                'jenis_kelamin' => 'P',
                'pekerjaan' => 'Dokter',
                'penghasilan' => 15000000,
                'status_perkawinan' => 'belum_menikah',
                'nama_ibu_kandung' => 'Theresia',
                'agama' => 'Katolik',
            ],
            [
                'nama_lengkap' => 'Eko Prasetyo',
                'nik' => '3201567890123456',
                'alamat' => 'Jl. Kuningan No. 654, RT 09/RW 10, Kelurahan Kuningan, Kecamatan Timur, Jakarta Timur',
                'nomor_wa' => '081888999000',
                'tempat_lahir' => 'Yogyakarta',
                'tanggal_lahir' => '1987-07-25',
                'jenis_kelamin' => 'L',
                'pekerjaan' => 'PNS',
                'penghasilan' => 7500000,
                'status_perkawinan' => 'cerai_hidup',
                'nama_ibu_kandung' => 'Wijayanti',
                'agama' => 'Buddha',
            ],
        ];

        foreach ($nasabah as $item) {
            Nasabah::create($item);
        }
    }
}
