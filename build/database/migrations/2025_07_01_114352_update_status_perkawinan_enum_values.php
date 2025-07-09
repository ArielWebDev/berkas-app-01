<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE `nasabah` MODIFY COLUMN `status_perkawinan` ENUM('belum_menikah','menikah','cerai_hidup','cerai_mati') DEFAULT 'belum_menikah'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE `nasabah` MODIFY COLUMN `status_perkawinan` ENUM('belum_kawin','kawin','cerai') DEFAULT 'belum_kawin'");
    }
};
