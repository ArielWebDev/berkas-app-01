<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Nasabah extends Model
{
    use HasFactory;

    protected $table = 'nasabah';

    protected $fillable = [
        'nama_lengkap',
        'nik',
        'alamat',
        'nomor_wa',
        'tempat_lahir',
        'tanggal_lahir',
        'jenis_kelamin',
        'pekerjaan',
        'penghasilan',
        'status_perkawinan',
        'nama_ibu_kandung',
        'agama',
    ];

    // Relationships
    public function pinjaman()
    {
        return $this->hasMany(Pinjaman::class);
    }
}
