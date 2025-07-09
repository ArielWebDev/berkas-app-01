<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'nomor_wa',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relationships
    public function pinjamanSebagaiStafInput()
    {
        return $this->hasMany(Pinjaman::class, 'staf_input_id');
    }

    public function pinjamanSebagaiAdminKredit()
    {
        return $this->hasMany(Pinjaman::class, 'admin_kredit_id');
    }

    public function pinjamanSebagaiAnalis()
    {
        return $this->hasMany(Pinjaman::class, 'analis_id');
    }

    public function pinjamanSebagaiPemutus()
    {
        return $this->hasMany(Pinjaman::class, 'pemutus_id');
    }

    public function logPinjaman()
    {
        return $this->hasMany(LogPinjaman::class);
    }
}
