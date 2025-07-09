<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Pinjaman;
use App\Models\LogPinjaman;
use App\Models\User;
use App\Models\Nasabah;

class SamplePinjamanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stafInput = User::where('role', 'staf_input')->first();
        $adminKredit = User::where('role', 'admin_kredit')->first();
        $analis = User::where('role', 'analis')->first();
        $pemutus = User::where('role', 'pemutus')->first();

        $nasabah = Nasabah::all();

        // Pinjaman 1: Status diajukan (baru dibuat)
        $pinjaman1 = Pinjaman::create([
            'nasabah_id' => $nasabah[0]->id,
            'staf_input_id' => $stafInput->id,
            'jumlah_pinjaman' => 50000000,
            'tujuan_pinjaman' => 'Modal Usaha',
            'jangka_waktu' => 24,
            'bunga' => 2.5,
            'status' => 'diajukan'
        ]);

        LogPinjaman::create([
            'pinjaman_id' => $pinjaman1->id,
            'user_id' => $stafInput->id,
            'aksi' => 'Pengajuan Dibuat',
            'deskripsi' => 'Pengajuan pinjaman sebesar Rp 50.000.000 telah dibuat'
        ]);

        // Pinjaman 2: Status diperiksa (dikunci oleh admin kredit)
        $pinjaman2 = Pinjaman::create([
            'nasabah_id' => $nasabah[1]->id,
            'staf_input_id' => $stafInput->id,
            'admin_kredit_id' => $adminKredit->id,
            'jumlah_pinjaman' => 75000000,
            'tujuan_pinjaman' => 'Renovasi Rumah',
            'jangka_waktu' => 36,
            'bunga' => 3.0,
            'status' => 'diperiksa',
            'locked_at' => now()->subHours(2)
        ]);

        LogPinjaman::create([
            'pinjaman_id' => $pinjaman2->id,
            'user_id' => $stafInput->id,
            'aksi' => 'Pengajuan Dibuat',
            'deskripsi' => 'Pengajuan pinjaman sebesar Rp 75.000.000 telah dibuat'
        ]);

        LogPinjaman::create([
            'pinjaman_id' => $pinjaman2->id,
            'user_id' => $adminKredit->id,
            'aksi' => 'Berkas Dikunci',
            'deskripsi' => 'Berkas dikunci oleh Admin Kredit untuk pemeriksaan'
        ]);

        // Pinjaman 3: Status dianalisis (sudah diambil analis)
        $pinjaman3 = Pinjaman::create([
            'nasabah_id' => $nasabah[2]->id,
            'staf_input_id' => $stafInput->id,
            'admin_kredit_id' => $adminKredit->id,
            'analis_id' => $analis->id,
            'jumlah_pinjaman' => 100000000,
            'tujuan_pinjaman' => 'Ekspansi Bisnis',
            'jangka_waktu' => 48,
            'bunga' => 2.8,
            'status' => 'dianalisis',
            'locked_at' => now()->subDays(1)
        ]);

        LogPinjaman::create([
            'pinjaman_id' => $pinjaman3->id,
            'user_id' => $stafInput->id,
            'aksi' => 'Pengajuan Dibuat',
            'deskripsi' => 'Pengajuan pinjaman sebesar Rp 100.000.000 telah dibuat'
        ]);

        LogPinjaman::create([
            'pinjaman_id' => $pinjaman3->id,
            'user_id' => $adminKredit->id,
            'aksi' => 'Diteruskan ke Analis',
            'deskripsi' => 'Berkas diteruskan ke Analis untuk dianalisis'
        ]);

        LogPinjaman::create([
            'pinjaman_id' => $pinjaman3->id,
            'user_id' => $analis->id,
            'aksi' => 'Berkas Diambil Analis',
            'deskripsi' => 'Berkas diambil oleh Analis untuk dianalisis'
        ]);

        // Pinjaman 4: Status siap_diputuskan
        $pinjaman4 = Pinjaman::create([
            'nasabah_id' => $nasabah[3]->id,
            'staf_input_id' => $stafInput->id,
            'admin_kredit_id' => $adminKredit->id,
            'analis_id' => $analis->id,
            'jumlah_pinjaman' => 80000000,
            'tujuan_pinjaman' => 'Pembelian Kendaraan',
            'jangka_waktu' => 60,
            'bunga' => 3.2,
            'status' => 'siap_diputuskan',
            'catatan' => 'Hasil analisis menunjukkan kelayakan nasabah baik',
            'locked_at' => now()->subDays(2)
        ]);

        LogPinjaman::create([
            'pinjaman_id' => $pinjaman4->id,
            'user_id' => $analis->id,
            'aksi' => 'Analisis Selesai',
            'deskripsi' => 'Analisis selesai, berkas siap untuk diputuskan. Hasil analisis menunjukkan kelayakan nasabah baik'
        ]);

        // Pinjaman 5: Status disetujui
        $pinjaman5 = Pinjaman::create([
            'nasabah_id' => $nasabah[4]->id,
            'staf_input_id' => $stafInput->id,
            'admin_kredit_id' => $adminKredit->id,
            'analis_id' => $analis->id,
            'pemutus_id' => $pemutus->id,
            'jumlah_pinjaman' => 60000000,
            'tujuan_pinjaman' => 'Pendidikan Anak',
            'jangka_waktu' => 12,
            'bunga' => 2.0,
            'status' => 'disetujui',
            'catatan' => 'Pinjaman disetujui berdasarkan hasil analisis yang baik',
            'locked_at' => now()->subDays(3)
        ]);

        LogPinjaman::create([
            'pinjaman_id' => $pinjaman5->id,
            'user_id' => $pemutus->id,
            'aksi' => 'Keputusan Final',
            'deskripsi' => 'Pinjaman disetujui: Pinjaman disetujui berdasarkan hasil analisis yang baik'
        ]);
    }
}
