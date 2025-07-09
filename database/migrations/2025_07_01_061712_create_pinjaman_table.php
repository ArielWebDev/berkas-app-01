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
        Schema::create('pinjaman', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nasabah_id')->constrained('nasabah')->onDelete('cascade');
            $table->foreignId('staf_input_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('admin_kredit_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('analis_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('pemutus_id')->nullable()->constrained('users')->onDelete('set null');
            $table->decimal('jumlah_pinjaman', 15, 2);
            $table->enum('status', ['diajukan', 'diperiksa', 'dikembalikan', 'dianalisis', 'siap_diputuskan', 'disetujui', 'ditolak'])->default('diajukan');
            $table->text('catatan')->nullable()->comment('untuk feedback');
            $table->timestamp('locked_at')->nullable()->comment('untuk lock berkas');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pinjaman');
    }
};
