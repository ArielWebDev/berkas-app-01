<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LogPinjaman extends Model
{
    use HasFactory;

    protected $table = 'log_pinjaman';

    protected $fillable = [
        'pinjaman_id',
        'user_id',
        'action',
        'status_before',
        'status_after',
        'notes',
        'aksi',          // Keep for backward compatibility
        'deskripsi',     // Keep for backward compatibility
    ];

    // Relationships
    public function pinjaman()
    {
        return $this->belongsTo(Pinjaman::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
