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
        Schema::table('pinjaman', function (Blueprint $table) {
            $table->text('tujuan_pinjaman')->nullable()->after('jumlah_pinjaman');
            $table->integer('jangka_waktu')->default(12)->after('tujuan_pinjaman')->comment('Jangka waktu dalam bulan');
            $table->decimal('bunga', 5, 2)->default(2.5)->after('jangka_waktu')->comment('Bunga per bulan dalam persen');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pinjaman', function (Blueprint $table) {
            $table->dropColumn(['tujuan_pinjaman', 'jangka_waktu', 'bunga']);
        });
    }
};
