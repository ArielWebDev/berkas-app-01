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
            $table->string('nik', 16)->nullable()->after('nomor_ktp');
            $table->string('nama')->nullable()->after('nik');
            $table->string('no_telepon', 20)->nullable()->after('nomor_wa');
            $table->string('tempat_lahir', 100)->nullable()->after('no_telepon');
            $table->date('tanggal_lahir')->nullable()->after('tempat_lahir');
            $table->enum('jenis_kelamin', ['L', 'P'])->nullable()->after('tanggal_lahir');
            $table->string('pekerjaan', 100)->nullable()->after('jenis_kelamin');
            $table->decimal('penghasilan', 15, 2)->default(0)->after('pekerjaan');
            $table->enum('status_perkawinan', ['belum_kawin', 'kawin', 'cerai'])->default('belum_kawin')->after('penghasilan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('nasabah', function (Blueprint $table) {
            $table->dropColumn([
                'nik',
                'nama',
                'no_telepon',
                'tempat_lahir',
                'tanggal_lahir',
                'jenis_kelamin',
                'pekerjaan',
                'penghasilan',
                'status_perkawinan'
            ]);
        });
    }
};
