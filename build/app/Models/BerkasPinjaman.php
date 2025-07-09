<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BerkasPinjaman extends Model
{
    use HasFactory;

    protected $table = 'berkas_pinjaman';

    protected $fillable = [
        'pinjaman_id',
        'nama_berkas',
        'path_file',
        'diupload_oleh_role',
    ];

    // Relationships
    public function pinjaman()
    {
        return $this->belongsTo(Pinjaman::class);
    }
}