# Panduan Workflow BerkasApp yang Sudah Diperbaiki

## Fitur Baru yang Ditambahkan

### 1. **Form Upload Berkas Dinamis**

- **Admin Kredit** dapat mengupload dokumen OJK tambahan saat status `diperiksa` atau `dianalisis`
- **Analis** dapat mengupload dokumen lapangan tambahan saat status `dianalisis` atau `siap_diputuskan`
- Form akan muncul otomatis di halaman detail pinjaman sesuai role dan status

### 2. **Workflow Actions dengan Alert Notification**

- Sistem notifikasi real-time untuk setiap aksi workflow
- Alert berhasil/gagal dengan pesan yang jelas
- Auto-refresh halaman setelah aksi berhasil
- Validasi input minimal 10 karakter untuk catatan

### 3. **Upload Berkas Setelah Advance**

- Berkas otomatis **unlock** saat diteruskan ke tahap berikutnya
- Admin kredit masih bisa upload dokumen OJK bahkan setelah status berubah ke `dianalisis`
- Analis masih bisa upload dokumen lapangan bahkan setelah status berubah ke `siap_diputuskan`

## Cara Kerja Workflow

### **Untuk Admin Kredit:**

1. **Ambil Berkas** → Status: `diajukan` → `diperiksa`
2. **Upload Dokumen OJK** → Tambahkan berkas OJK, BI Checking, dll
3. **Teruskan ke Analis** → Status: `diperiksa` → `dianalisis` (berkas auto-unlock)
4. **Masih bisa upload** dokumen OJK tambahan bahkan setelah diteruskan

### **Untuk Analis:**

1. **Ambil Berkas** → Status: `dianalisis` (assign ke analis)
2. **Upload Dokumen Lapangan** → Tambahkan foto kunjungan, laporan survey, dll
3. **Teruskan ke Pemutus** → Status: `dianalisis` → `siap_diputuskan` (berkas auto-unlock)
4. **Masih bisa upload** dokumen lapangan tambahan bahkan setelah diteruskan

### **Untuk Pemutus:**

1. **Ambil Berkas** → Status: `siap_diputuskan` (assign ke pemutus)
2. **Buat Keputusan** → Status: `disetujui` atau `ditolak`

## Fitur Alert & Notifikasi

### **Jenis Alert:**

- ✅ **Success** (hijau): Aksi berhasil
- ❌ **Error** (merah): Aksi gagal
- ⚠️ **Warning** (kuning): Input tidak valid
- ℹ️ **Info** (biru): Informasi umum

### **Pesan Alert Contoh:**

- "Berkas berhasil diambil dan dikunci untuk Anda"
- "Berkas berhasil diteruskan ke tahap Analisis"
- "Catatan minimal 10 karakter diperlukan"
- "Gagal mengambil berkas. Mungkin sudah diambil oleh orang lain"

## Route API yang Tersedia

### **Workflow Actions:**

- `POST /workflow/{pinjaman}/take` - Ambil berkas
- `POST /workflow/{pinjaman}/release` - Lepas berkas
- `POST /workflow/{pinjaman}/advance` - Teruskan ke tahap berikutnya
- `POST /workflow/{pinjaman}/return` - Kembalikan ke tahap sebelumnya
- `POST /workflow/{pinjaman}/decide` - Keputusan akhir

### **Upload Berkas:**

- `POST /pinjaman/{pinjaman}/upload-ojk` - Upload dokumen OJK (Admin Kredit)
- `POST /pinjaman/{pinjaman}/upload-lapangan` - Upload dokumen lapangan (Analis)

## Validasi & Policy

### **Upload Berkas:**

- Admin kredit dapat upload jika: `admin_kredit_id === user.id` dan status `diperiksa` atau `dianalisis`
- Analis dapat upload jika: `analis_id === user.id` dan status `dianalisis` atau `siap_diputuskan`

### **Workflow Actions:**

- Hanya owner berkas yang bisa advance/return
- Catatan minimal 10 karakter wajib untuk semua aksi
- Berkas auto-unlock saat advance ke tahap berikutnya

## Perbaikan UI/UX

1. **Loading states** dengan feedback "Memproses..."
2. **Auto-refresh** setelah aksi berhasil (1.5 detik)
3. **Form validation** real-time
4. **Responsive design** untuk mobile
5. **Alert positioning** fixed top-right
6. **Auto-hide alert** setelah 5 detik

## Status Perbaikan

### ✅ **BERHASIL DIPERBAIKI**

- ✅ Form upload berkas dinamis sesuai role dan status
- ✅ Workflow actions dengan alert notification
- ✅ Auto-unlock berkas saat advance ke tahap berikutnya
- ✅ Upload berkas tambahan tetap fleksibel setelah advance
- ✅ **Route Ziggy Error** - Perbaikan route `pinjaman.upload-lapangan`
- ✅ **Upload OJK & Lapangan** - Kedua fitur upload sudah berfungsi
- ✅ **Frontend-Backend Sync** - Semua route sudah tersinkronisasi

### 🔧 **KOMPONEN YANG SUDAH DIPERBAIKI**

1. **ShowNew.tsx** - Form upload berkas dinamis + alert notification
2. **WorkflowActionsImproved.tsx** - Workflow actions dengan alert system
3. **routes/web.php** - Route upload-lapangan dipindah ke grup yang benar
4. **PinjamanController.php** - Logic upload dan unlock berkas
5. **Ziggy routes** - Regenerasi cache route untuk frontend

### 📋 **TESTING YANG SUDAH DILAKUKAN**

- ✅ Route `pinjaman.upload-lapangan` sudah tersedia
- ✅ Route `pinjaman.upload-ojk` sudah tersedia
- ✅ Ziggy route cache sudah diperbarui
- ✅ Frontend sudah dapat resolve kedua route upload
- ✅ TypeScript error pada form upload sudah diperbaiki

---

**Catatan:** Semua fitur sudah terintegrasi dengan sistem existing dan tidak memerlukan perubahan database tambahan.
