<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BerkasPinjaman;
use App\Models\Pinjaman;
use Illuminate\Support\Facades\Storage;

class SampleBerkasSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Buat sample file berkas
        $sampleContent = "PDF\n%PDF-1.4\nSample document for testing purposes.\n%%EOF";

        // Buat direktori jika belum ada
        Storage::disk('public')->makeDirectory('berkas_pinjaman');

        // Ambil beberapa pinjaman untuk ditambahkan berkas
        $pinjamanList = Pinjaman::take(3)->get();

        foreach ($pinjamanList as $pinjaman) {
            // Buat beberapa sample berkas untuk setiap pinjaman
            $berkasList = [
                'KTP_' . $pinjaman->nasabah->nama_lengkap . '.pdf',
                'Slip_Gaji_' . $pinjaman->nasabah->nama_lengkap . '.pdf',
                'Kartu_Keluarga_' . $pinjaman->nasabah->nama_lengkap . '.pdf',
            ];

            foreach ($berkasList as $index => $namaFile) {
                $fileName = time() . '_' . $pinjaman->id . '_' . $index . '_' . $namaFile;
                $path = 'berkas_pinjaman/' . $fileName;

                // Simpan sample file
                Storage::disk('public')->put($path, $sampleContent);

                // Buat record di database
                BerkasPinjaman::create([
                    'pinjaman_id' => $pinjaman->id,
                    'nama_berkas' => $namaFile,
                    'path_file' => $path,
                    'diupload_oleh_role' => 'staf_input'
                ]);
            }
        }

        echo "Sample berkas berhasil dibuat untuk " . $pinjamanList->count() . " pinjaman\n";
    }
}
