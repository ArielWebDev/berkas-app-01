# Dokumentasi Workflow Sistem Pinjaman BerkasApp

## Overview

Sistem workflow pinjaman menggunakan multi-role, step-based process dengan sistem locking untuk memastikan hanya satu user yang dapat mengerjakan satu pinjaman pada satu waktu.

## Alur Workflow

### 1. Tahap Input (Staf Input)

- **Role**: `staf_input`
- **Status**: `diajukan`
- **Aksi**:
  - Membuat pengajuan pinjaman baru
  - Upload dokumen awal (KTP, slip gaji, dll)
  - Submit pengajuan

**Setelah submit:**

- Status berubah ke `diajukan`
- Notifikasi WhatsApp dikirim ke semua Admin Kredit
- Notifikasi konfirmasi dikirim ke nasabah

### 2. Tahap Review (Admin Kredit)

- **Role**: `admin_kredit`
- **Status**: `diperiksa`
- **Aksi**:
  - Mengambil (lock) berkas pinjaman
  - Memeriksa kelengkapan dokumen
  - Upload dokumen internal (hasil OJK, dll)
  - Menentukan keputusan: lanjutkan atau kembalikan

**Workflow Actions:**

- `Take`: Mengambil berkas (assign admin_kredit_id, set locked_at)
- `Release`: Melepas berkas (reset admin_kredit_id, reset locked_at)
- `Advance`: Teruskan ke tahap analisis
- `Return`: Kembalikan ke staf input dengan alasan

**Setelah advance:**

- Status berubah ke `dianalisis`
- Notifikasi WhatsApp dikirim ke semua Analis
- Notifikasi update dikirim ke nasabah

### 3. Tahap Analisis (Analis)

- **Role**: `analis`
- **Status**: `dianalisis`
- **Aksi**:
  - Mengambil (lock) berkas untuk analisis
  - Melakukan verifikasi lapangan jika diperlukan
  - Upload dokumen analisis (foto, laporan kunjungan)
  - Menyelesaikan analisis

**Workflow Actions:**

- `Take`: Mengambil berkas (assign analis_id, set locked_at)
- `Release`: Melepas berkas
- `Advance`: Teruskan ke tahap keputusan
- `Return`: Kembalikan ke admin kredit

**Setelah advance:**

- Status berubah ke `siap_diputuskan`
- Notifikasi WhatsApp dikirim ke Pemutus
- Notifikasi update dikirim ke nasabah

### 4. Tahap Keputusan (Pemutus)

- **Role**: `pemutus`
- **Status**: `siap_diputuskan`
- **Aksi**:
  - Mengambil (lock) berkas untuk keputusan
  - Review semua dokumen dan analisis
  - Membuat keputusan final: Approve atau Reject

**Workflow Actions:**

- `Take`: Mengambil berkas (assign pemutus_id, set locked_at)
- `Release`: Melepas berkas
- `Decide`: Membuat keputusan final (approve/reject)
- `Return`: Kembalikan ke analis

**Setelah decide:**

- Status berubah ke `disetujui` atau `ditolak`
- locked_at direset (berkas tidak lagi terkunci)
- Notifikasi WhatsApp final dikirim ke nasabah

## Sistem Locking

### Konsep Dasar

- Setiap pinjaman hanya bisa dikerjakan oleh satu user pada satu waktu
- Locking menggunakan field `locked_at` dan assignment ID per role
- User yang mengambil berkas bertanggung jawab untuk menyelesaikan atau melepasnya

### Metode Locking (di Model Pinjaman)

#### `canBeTakenByUser(User $user): bool`

Cek apakah user bisa mengambil berkas berdasarkan:

- Status pinjaman sesuai dengan role user
- Berkas belum dikunci oleh user lain

#### `isOwnedByUser(User $user): bool`

Cek apakah berkas sedang dikerjakan oleh user tersebut

#### `lockForUser(User $user): bool`

Mengunci berkas untuk user:

- Set `{role}_id` dengan user ID
- Set `locked_at` dengan timestamp sekarang
- Log aktivitas

#### `unlockFromUser(User $user): bool`

Melepas berkas dari user:

- Reset `{role}_id` ke null
- Reset `locked_at` ke null
- Log aktivitas

## Controller Workflow

### WorkflowController

Menangani semua aksi workflow:

#### Aksi Utama:

1. **takePinjaman**: Mengambil berkas untuk dikerjakan
2. **releasePinjaman**: Melepas berkas
3. **advancePinjaman**: Teruskan ke tahap berikutnya
4. **returnPinjaman**: Kembalikan ke tahap sebelumnya
5. **finalDecision**: Keputusan akhir approve/reject
6. **dashboard**: Dashboard statistik per role

#### Route Workflow:

```php
Route::post('/{pinjaman}/take', [WorkflowController::class, 'takePinjaman']);
Route::post('/{pinjaman}/release', [WorkflowController::class, 'releasePinjaman']);
Route::post('/{pinjaman}/advance', [WorkflowController::class, 'advancePinjaman']);
Route::post('/{pinjaman}/return', [WorkflowController::class, 'returnPinjaman']);
Route::post('/{pinjaman}/decide', [WorkflowController::class, 'finalDecision']);
```

## UI Components

### WorkflowStepIndicator

- Menampilkan progress workflow visual dengan stepper
- Menunjukkan tahap saat ini dan yang sudah selesai
- Support untuk status error (ditolak/dikembalikan)

### WorkflowActions

- Tombol-tombol aksi workflow berdasarkan role dan status
- Form untuk input catatan dan alasan
- Validasi UI untuk aksi yang tersedia

### WorkflowDashboard

- Dashboard khusus workflow dengan statistik per role
- Menampilkan berkas yang tersedia, sedang dikerjakan, selesai
- Aktivitas terbaru user
- Quick actions

## Database Schema

### Tabel `pinjaman`

```sql
- staf_input_id (nullable) - ID user staf input
- admin_kredit_id (nullable) - ID user admin kredit yang mengerjakan
- analis_id (nullable) - ID user analis yang mengerjakan
- pemutus_id (nullable) - ID user pemutus yang mengerjakan
- status (enum) - Status workflow saat ini
- locked_at (timestamp nullable) - Kapan berkas dikunci
- catatan (text nullable) - Catatan terakhir
```

### Tabel `log_pinjaman`

```sql
- pinjaman_id - ID pinjaman
- user_id - ID user yang melakukan aksi
- aksi - Jenis aksi (lock, unlock, advance, return, approve, reject)
- deskripsi - Deskripsi aksi
- created_at - Waktu aksi
```

## Notifikasi WhatsApp

### Timing Notifikasi:

1. **Pengajuan Baru**: Ke semua Admin Kredit + konfirmasi ke nasabah
2. **Dokumen Lengkap**: Ke semua Analis + update ke nasabah
3. **Analisis Selesai**: Ke Pemutus + update ke nasabah
4. **Keputusan Final**: Ke nasabah (approve/reject)
5. **Pengembalian**: Ke nasabah dengan alasan

### Template Notifikasi:

- Role-specific untuk internal user
- Status update untuk nasabah
- Include informasi berkas dan tahap

## File Terimplementasi

### Backend:

- `app/Models/Pinjaman.php` - Model dengan workflow dan locking methods
- `app/Http/Controllers/WorkflowController.php` - Controller untuk semua aksi workflow
- `routes/web.php` - Route definitions untuk workflow

### Frontend:

- `resources/js/Pages/WorkflowDashboard.tsx` - Dashboard workflow per role
- `resources/js/Pages/Pinjaman/ShowNew.tsx` - Detail pinjaman dengan workflow actions
- `resources/js/Components/WorkflowStepIndicator.tsx` - Visual stepper progress
- `resources/js/Components/WorkflowActions.tsx` - Tombol dan form workflow actions
- `resources/js/Components/PinjamanDataTable.tsx` - Tabel dengan workflow indicator

## Testing & Deployment

### Langkah Testing:

1. Akses `/workflow` untuk dashboard workflow
2. Login dengan user role berbeda untuk test workflow
3. Test semua aksi: take, release, advance, return, decide
4. Verifikasi locking mechanism bekerja dengan benar
5. Test notifikasi WhatsApp (jika sudah diimplementasi)

### Development Notes:

- Middleware role-based access sementara dinonaktifkan untuk development
- WhatsApp notification method sudah disiapkan namun belum diimplementasi
- Error handling dan user feedback sudah terintegrasi
- UI responsive dan modern dengan TailwindCSS

## Next Steps:

1. Implementasi WhatsApp API integration
2. Re-enable dan test middleware role-based access
3. Add file upload functionality untuk dokumen workflow
4. Performance optimization dan caching
5. Comprehensive testing dan bug fixes

- Review kelengkapan dokumen
- Upload dokumen tambahan (laporan OJK)
- Approve atau return ke Staf Input

**Akses:**

- View pinjaman dengan status 'diajukan'
- Lock berkas untuk pemeriksaan
- Upload dokumen OJK
- Approve untuk tahap analisis atau return ke Staf

### 3. Analis

**Tanggung Jawab:**

- Melakukan analisis mendalam
- Kunjungan lapangan dan verifikasi
- Upload dokumen lapangan

**Akses:**

- View pinjaman dengan status 'diperiksa'
- Upload dokumen hasil analisis lapangan
- Complete analysis untuk diteruskan ke Pemutus

### 4. Pemutus

**Tanggung Jawab:**

- Review hasil analisis
- Membuat keputusan akhir
- Notifikasi ke nasabah

**Akses:**

- View pinjaman dengan status 'siap_diputuskan'
- Approve atau reject pinjaman
- View semua pinjaman untuk overview

### 5. Admin/Super Admin

**Tanggung Jawab:**

- Manajemen sistem
- Override permissions untuk development
- Manage users dan reports

**Akses:**

- Full access ke semua fitur
- User management
- System reports

## Workflow Alur Kerja

### Tahap 1: Pengajuan oleh Staf Input

1. **Pilih/Daftarkan Nasabah**: Staf Input memilih nasabah yang sudah ada atau mendaftarkan nasabah baru
2. **Input Data Pinjaman**:
   - Jumlah pinjaman
   - Tujuan pinjaman
   - Jangka waktu
   - Bunga
3. **Upload Berkas Awal**: Upload dokumen seperti KTP, KK, slip gaji, dll.
4. **Submit Pengajuan**: Status menjadi 'diajukan'
5. **Notifikasi**: Sistem mengirim notifikasi WhatsApp ke semua Admin Kredit

### Tahap 2: Pemeriksaan oleh Admin Kredit

1. **Lock Berkas**: Admin Kredit pertama yang merespons akan lock berkas
2. **Review Dokumen**: Periksa kelengkapan dan validitas dokumen
3. **Upload Dokumen OJK**: Tambahkan laporan pengecekan OJK jika diperlukan
4. **Keputusan**:
   - **Lengkap**: Status menjadi 'diperiksa', notifikasi ke Analis
   - **Tidak Lengkap**: Status menjadi 'dikembalikan', notifikasi ke Staf Input

### Tahap 3: Analisis oleh Analis

1. **Take Assignment**: Analis mengambil berkas untuk dianalisis
2. **Analisis Mendalam**: Review semua dokumen dan data
3. **Kunjungan Lapangan**: Verifikasi data di lapangan (opsional)
4. **Upload Dokumen Lapangan**: Upload foto, laporan verifikasi, dll.
5. **Complete Analysis**: Status menjadi 'siap_diputuskan', notifikasi ke Pemutus

### Tahap 4: Keputusan oleh Pemutus

1. **Final Review**: Review semua dokumen dan hasil analisis
2. **Keputusan Akhir**:
   - **Setujui**: Status menjadi 'disetujui'
   - **Tolak**: Status menjadi 'ditolak'
3. **Notifikasi**: Sistem mengirim notifikasi WhatsApp ke nasabah

## Fitur Utama

### Dashboard Workflow

- **Role-based Dashboard**: Setiap role melihat task yang relevan
- **Real-time Statistics**: Jumlah pinjaman per status
- **Quick Actions**: Akses cepat ke fungsi utama
- **Notification Badges**: Indikator task yang membutuhkan perhatian

### Data Table dengan Workflow Actions

- **Advanced Filtering**: Filter berdasarkan status, tanggal, nasabah
- **Sorting**: Sort berdasarkan kolom apapun
- **Expandable Rows**: Detail workflow dalam tabel
- **Role-based Actions**: Tombol aksi sesuai role dan status
- **Real-time Updates**: Data ter-update otomatis

### Wizard Create Pinjaman

- **Multi-step Form**: Wizard 4 langkah yang user-friendly
- **File Upload**: Drag & drop dengan preview
- **Validation**: Real-time validation per step
- **Progress Indicator**: Visual progress step
- **Auto-save**: Data tersimpan otomatis

### File Management

- **Upload Multiple Files**: Support berbagai format
- **File Preview**: Preview langsung untuk image/PDF
- **Download**: Download file original
- **Role-based Upload**: Setiap role bisa upload file sesuai tahapnya
- **File History**: Track siapa upload file apa dan kapan

## Struktur File

### Backend (Laravel)

```
app/
├── Http/Controllers/
│   ├── DashboardController.php - Dashboard workflow
│   ├── PinjamanController.php - CRUD pinjaman + workflow
│   ├── NasabahController.php - CRUD nasabah
│   └── UserController.php - User management
├── Models/
│   ├── Pinjaman.php - Model pinjaman dengan relationships
│   ├── Nasabah.php - Model nasabah
│   ├── BerkasPinjaman.php - Model file upload
│   ├── LogPinjaman.php - Model audit trail
│   └── User.php - Model user dengan roles
└── database/
    ├── migrations/ - Schema database
    └── seeders/ - Data dummy untuk testing
```

### Frontend (React)

```
resources/js/
├── Pages/
│   ├── WorkflowDashboard.tsx - Dashboard workflow
│   ├── Pinjaman/
│   │   ├── TailIndexNew.tsx - List pinjaman dengan workflow
│   │   ├── WizardCreateNew.tsx - Wizard create pinjaman
│   │   ├── Show.tsx - Detail pinjaman
│   │   └── Edit.tsx - Edit pinjaman
│   └── Nasabah/ - CRUD nasabah
├── Components/
│   ├── PinjamanDataTable.tsx - Table dengan workflow actions
│   ├── WorkflowStatusCard.tsx - Card status untuk dashboard
│   └── NotificationBadge.tsx - Badge notifikasi
├── Layouts/
│   └── TailLayout.tsx - Layout utama dengan navigation
└── types/ - TypeScript definitions
```

## API Endpoints

### Workflow Actions

- `POST /pinjaman/{id}/workflow-action` - Execute workflow action
- `POST /pinjaman/{id}/lock` - Lock berkas untuk review
- `POST /pinjaman/{id}/upload-ojk` - Upload dokumen OJK
- `POST /pinjaman/{id}/upload-lapangan` - Upload dokumen lapangan

### CRUD Operations

- `GET /pinjaman` - List pinjaman (filtered by role)
- `POST /pinjaman` - Create pinjaman baru
- `GET /pinjaman/{id}` - Detail pinjaman
- `PUT /pinjaman/{id}` - Update pinjaman
- `DELETE /pinjaman/{id}` - Delete pinjaman

### Dashboard

- `GET /dashboard` - Dashboard utama
- `GET /workflow` - Dashboard workflow dengan statistik

## Setup & Installation

### Prerequisites

- PHP 8.1+
- Composer
- Node.js 16+
- MySQL/SQLite

### Installation Steps

1. Clone repository
2. `composer install`
3. `npm install`
4. Copy `.env.example` to `.env`
5. Configure database di `.env`
6. `php artisan key:generate`
7. `php artisan migrate`
8. `php artisan db:seed`
9. `npm run build` atau `npm run dev`
10. `php artisan serve`

### Default Users (setelah seeding)

- Admin: admin@berkas.com / password
- Staf Input: staf@berkas.com / password
- Admin Kredit: kredit@berkas.com / password
- Analis: analis@berkas.com / password
- Pemutus: pemutus@berkas.com / password

## Testing Workflow

### Scenario Testing

1. **Login sebagai Staf Input**
   - Buat pinjaman baru via wizard
   - Upload dokumen awal
   - Submit pengajuan

2. **Login sebagai Admin Kredit**
   - Review pinjaman dengan status 'diajukan'
   - Lock berkas dan upload dokumen OJK
   - Approve untuk analisis

3. **Login sebagai Analis**
   - Ambil pinjaman dengan status 'diperiksa'
   - Upload dokumen lapangan
   - Complete analysis

4. **Login sebagai Pemutus**
   - Review pinjaman dengan status 'siap_diputuskan'
   - Buat keputusan akhir (approve/reject)

## Future Enhancements

### Planned Features

1. **WhatsApp Integration**: Real-time notifications
2. **Email Notifications**: Backup notification system
3. **Document OCR**: Auto-extract data dari dokumen
4. **E-signature**: Digital signature untuk approval
5. **Reporting**: Advanced analytics dan reports
6. **Mobile App**: React Native untuk mobile access
7. **API Integration**: Integration dengan sistem eksternal (BI Checking, dll)
8. **Workflow Customization**: Admin bisa customize workflow steps

### Performance Optimization

1. **Caching**: Redis untuk data yang sering diakses
2. **Queue System**: Background jobs untuk notifikasi
3. **File Optimization**: Compress dan optimize uploaded files
4. **Database Indexing**: Optimize query performance

## Security Features

### Implemented

- **Role-based Access Control**: Setiap endpoint protected by role
- **CSRF Protection**: Laravel built-in CSRF
- **SQL Injection Prevention**: Eloquent ORM
- **File Upload Security**: Type dan size validation
- **Authentication**: Laravel Sanctum

### Recommended

- **SSL/HTTPS**: Enable di production
- **Rate Limiting**: API rate limiting
- **Audit Logging**: Comprehensive audit trail
- **Data Encryption**: Sensitive data encryption
- **Regular Backups**: Automated database backups

## Maintenance & Monitoring

### Daily Tasks

- Monitor application performance
- Check error logs
- Verify file uploads dan storage
- Monitor database performance

### Weekly Tasks

- Database backup verification
- Security updates check
- Performance metrics review
- User feedback collection

### Monthly Tasks

- Full system backup
- Security audit
- Performance optimization
- Feature usage analytics
