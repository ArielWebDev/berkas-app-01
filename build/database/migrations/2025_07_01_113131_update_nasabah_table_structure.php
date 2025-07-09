<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('nasabah', function (Blueprint $table) {
            // Drop columns yang tidak diperlukan
            if (Schema::hasColumn('nasabah', 'nomor_ktp')) {
                $table->dropColumn('nomor_ktp');
            }
            if (Schema::hasColumn('nasabah', 'no_telepon')) {
                $table->dropColumn('no_telepon');
            }

            // Tambah field baru
            $table->string('nama_ibu_kandung')->nullable()->after('status_perkawinan');
            $table->enum('agama', ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'])->nullable()->after('nama_ibu_kandung');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('nasabah', function (Blueprint $table) {
            // Restore columns
            $table->string('nomor_ktp')->unique()->after('nama_lengkap');
            $table->string('no_telepon')->nullable()->after('nomor_wa');

            // Drop new columns
            $table->dropColumn(['nama_ibu_kandung', 'agama']);
        });
    }
};
