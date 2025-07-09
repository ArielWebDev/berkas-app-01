# WORKFLOW PINJAMAN - STATUS DAN TRANSITIONS

## Flow Workflow Lengkap:

### 1. PENGAJUAN (Staf Input)

- **Status awal**: `diajukan`
- **Action**: Staf input membuat pengajuan baru
- **Notification**: WhatsApp ke semua Admin Kredit

### 2. ADMIN KREDIT AMBIL BERKAS

- **Pre-condition**: Status = `diajukan`, admin_kredit_id = null
- **Action**: Admin Kredit klik "Ambil Berkas" + isi catatan
- **Result**:
  - Status berubah: `diajukan` → `diperiksa`
  - admin_kredit_id = user.id
  - locked_at = now()
- **Notification**: WhatsApp ke nasabah

### 3. ADMIN KREDIT PILIHAN:

#### A. TERUSKAN KE ANALIS

- **Pre-condition**: Status = `diperiksa`, isOwner = true
- **Action**: Admin Kredit klik "Teruskan" + isi catatan
- **Result**:
  - Status berubah: `diperiksa` → `dianalisis`
  - locked_at = null (berkas bisa diambil analis lain)
  - admin_kredit_id tetap ada (untuk tracking)
- **Notification**: WhatsApp ke semua Analis

#### B. KEMBALIKAN KE STAF INPUT

- **Pre-condition**: Status = `diperiksa`, isOwner = true
- **Action**: Admin Kredit klik "Kembalikan" + isi alasan
- **Result**:
  - Status berubah: `diperiksa` → `diajukan`
  - admin_kredit_id = null
  - locked_at = null
- **Notification**: WhatsApp ke nasabah + staf input

### 4. ANALIS AMBIL BERKAS

- **Pre-condition**: Status = `dianalisis`, analis_id = null
- **Action**: Analis klik "Ambil Berkas" + isi catatan
- **Result**:
  - Status tetap: `dianalisis`
  - analis_id = user.id
  - locked_at = now()
- **Notification**: WhatsApp ke nasabah

### 5. ANALIS PILIHAN:

#### A. TERUSKAN KE PEMUTUS

- **Pre-condition**: Status = `dianalisis`, isOwner = true
- **Action**: Analis klik "Teruskan" + isi catatan
- **Result**:
  - Status berubah: `dianalisis` → `siap_diputuskan`
  - locked_at = null (berkas bisa diambil pemutus lain)
  - analis_id tetap ada (untuk tracking)
- **Notification**: WhatsApp ke semua Pemutus

#### B. KEMBALIKAN KE ADMIN KREDIT

- **Pre-condition**: Status = `dianalisis`, isOwner = true
- **Action**: Analis klik "Kembalikan" + isi alasan
- **Result**:
  - Status berubah: `dianalisis` → `diperiksa`
  - analis_id = null
  - locked_at = null
  - admin_kredit_id tetap ada (kembali ke admin yang sama)
- **Notification**: WhatsApp ke admin kredit + nasabah

### 6. PEMUTUS AMBIL BERKAS

- **Pre-condition**: Status = `siap_diputuskan`, pemutus_id = null
- **Action**: Pemutus klik "Ambil Berkas" + isi catatan
- **Result**:
  - Status tetap: `siap_diputuskan`
  - pemutus_id = user.id
  - locked_at = now()
- **Notification**: WhatsApp ke nasabah

### 7. PEMUTUS KEPUTUSAN FINAL:

#### A. SETUJUI

- **Pre-condition**: Status = `siap_diputuskan`, isOwner = true
- **Action**: Pemutus klik "Setujui" + isi catatan
- **Result**:
  - Status berubah: `siap_diputuskan` → `disetujui`
  - locked_at = null
- **Notification**: WhatsApp ke nasabah (APPROVED)

#### B. TOLAK

- **Pre-condition**: Status = `siap_diputuskan`, isOwner = true
- **Action**: Pemutus klik "Tolak" + isi catatan
- **Result**:
  - Status berubah: `siap_diputuskan` → `ditolak`
  - locked_at = null
- **Notification**: WhatsApp ke nasabah (REJECTED)

#### C. KEMBALIKAN KE ANALIS

- **Pre-condition**: Status = `siap_diputuskan`, isOwner = true
- **Action**: Pemutus klik "Kembalikan" + isi alasan
- **Result**:
  - Status berubah: `siap_diputuskan` → `dianalisis`
  - pemutus_id = null
  - locked_at = null
  - analis_id tetap ada (kembali ke analis yang sama)
- **Notification**: WhatsApp ke analis + nasabah

---

## STATUS DEFINITIONS:

- `diajukan`: Baru dibuat, belum ada yang mengambil
- `diperiksa`: Sedang diperiksa oleh Admin Kredit tertentu
- `dianalisis`: Siap dianalisis atau sedang dianalisis oleh Analis
- `siap_diputuskan`: Siap diputuskan atau sedang diputuskan oleh Pemutus
- `disetujui`: Final - Approved
- `ditolak`: Final - Rejected

## LOCKING SYSTEM:

- Berkas yang sudah diambil (`locked_at` != null) tidak bisa diambil orang lain
- Hanya pemilik berkas yang bisa melakukan action (advance/return)
- Release berkas mengembalikan ke status yang bisa diambil orang lain
- Assignment ID tetap ada untuk tracking meski berkas di-advance

## NOTIFICATION TRIGGERS:

1. **New submission** → Notify all Admin Kredit
2. **Advance to analysis** → Notify all Analis
3. **Advance to decision** → Notify all Pemutus
4. **Take berkas** → Notify Nasabah
5. **Return berkas** → Notify Nasabah + previous stage users
6. **Final decision** → Notify Nasabah
