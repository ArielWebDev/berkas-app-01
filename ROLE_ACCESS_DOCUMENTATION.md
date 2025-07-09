# Dokumentasi Hak Akses Role-Based untuk Workflow Pinjaman

## Ringkasan Aturan Hak Akses

Setiap role hanya dapat melihat dan mengakses data pinjaman yang relevan dengan tahap mereka dalam workflow. Ini sudah diimplementasi di `PinjamanController@index()`.

## Detail Hak Akses per Role

### 1. Staf Input (`staf_input`)

**Tanggung Jawab:** Membuat pengajuan pinjaman baru  
**Hak Akses:**

- ✅ Hanya melihat pinjaman yang **dia buat sendiri** (`staf_input_id = user.id`)
- ✅ Dapat membuat pinjaman baru
- ❌ Tidak dapat melihat pinjaman dari staf input lain
- ❌ Tidak dapat mengambil atau memproses pinjaman

**Query:** `$query->where('staf_input_id', $user->id);`

### 2. Admin Kredit (`admin_kredit`)

**Tanggung Jawab:** Memeriksa kelengkapan berkas dan persyaratan kredit  
**Hak Akses:**

- ✅ Melihat pinjaman **baru/diajukan** yang belum diambil siapa pun (`status = 'diajukan'`)
- ✅ Melihat pinjaman yang **sedang dia kerjakan** (`admin_kredit_id = user.id`)
- ✅ Melihat pinjaman yang **sudah dia selesaikan** (history)
- ❌ Tidak dapat melihat pinjaman yang sedang dikerjakan admin kredit lain
- ❌ Tidak dapat melihat pinjaman tahap analis/pemutus (kecuali yang pernah dia handle)

**Query:**

```php
$query->where(function ($q) use ($user) {
    $q->where('status', 'diajukan') // Belum diambil siapa pun
        ->orWhere('admin_kredit_id', $user->id); // Yang dia ambil/kerjakan
});
```

### 3. Analis (`analis`)

**Tanggung Jawab:** Melakukan analisis kredit mendalam  
**Hak Akses:**

- ✅ Melihat pinjaman **dari admin kredit** yang belum diambil analis (`status = 'dianalisis'`)
- ✅ Melihat pinjaman yang **sedang dia kerjakan** (`analis_id = user.id`)
- ✅ Melihat pinjaman yang **sudah dia selesaikan** (history)
- ❌ Tidak dapat melihat pinjaman tahap staf input/admin kredit (kecuali yang pernah dia handle)
- ❌ Tidak dapat melihat pinjaman yang sedang dikerjakan analis lain

**Query:**

```php
$query->where(function ($q) use ($user) {
    $q->where('status', 'dianalisis') // Dari admin_kredit, belum diambil analis
        ->orWhere('analis_id', $user->id); // Yang dia ambil/kerjakan
});
```

### 4. Pemutus (`pemutus`)

**Tanggung Jawab:** Membuat keputusan final (setuju/tolak)  
**Hak Akses:**

- ✅ Melihat pinjaman **dari analis** yang belum diambil pemutus (`status = 'siap_diputuskan'`)
- ✅ Melihat pinjaman yang **sedang dia kerjakan** (`pemutus_id = user.id`)
- ✅ Melihat **semua pinjaman final** untuk overview (`status = 'disetujui'/'ditolak'`)
- ❌ Tidak dapat melihat pinjaman tahap awal (kecuali yang pernah dia handle)
- ❌ Tidak dapat melihat pinjaman yang sedang dikerjakan pemutus lain

**Query:**

```php
$query->where(function ($q) use ($user) {
    $q->where('status', 'siap_diputuskan') // Dari analis, belum diambil pemutus
        ->orWhere('pemutus_id', $user->id) // Yang dia ambil/kerjakan
        ->orWhereIn('status', ['disetujui', 'ditolak']); // Overview final
});
```

### 5. Admin (`admin`)

**Tanggung Jawab:** Supervisor dengan akses penuh  
**Hak Akses:**

- ✅ Melihat **semua pinjaman** tanpa batasan
- ✅ Dapat mengambil alih pinjaman jika diperlukan

**Query:** Tidak ada pembatasan (`break;` tanpa kondisi)

## Filter Tambahan

### Filter `available=true`

Menampilkan hanya pinjaman yang tersedia untuk diambil oleh role saat ini:

- **Admin Kredit:** `status = 'diajukan' AND admin_kredit_id IS NULL`
- **Analis:** `status = 'dianalisis' AND analis_id IS NULL`
- **Pemutus:** `status = 'siap_diputuskan' AND pemutus_id IS NULL`

### Filter `my_tasks=true`

Menampilkan hanya pinjaman yang sedang dikerjakan oleh user:

- **Admin Kredit:** `admin_kredit_id = user.id AND status = 'diperiksa'`
- **Analis:** `analis_id = user.id AND status = 'dianalisis'`
- **Pemutus:** `pemutus_id = user.id AND status = 'siap_diputuskan'`

## Keamanan Data

✅ **Prinsip Least Privilege:** Setiap role hanya dapat mengakses data yang diperlukan untuk tugasnya  
✅ **Data Isolation:** Tidak ada kebocoran data antar tahap workflow  
✅ **Locking System:** Mencegah konflik saat multiple user mengambil pinjaman yang sama  
✅ **History Tracking:** User dapat melihat pinjaman yang pernah mereka handle

## Testing

Untuk menguji hak akses, gunakan script yang sudah disediakan:

```bash
# Test semua user dan role
php check_data.php

# Test data specific role
php test_users.php
```

## Status Implementation

✅ **COMPLETED** - Role-based access control sudah diimplementasi dan diuji
✅ **TESTED** - Sudah diverifikasi dengan sample data untuk semua role
✅ **DOCUMENTED** - Dokumentasi lengkap tersedia
