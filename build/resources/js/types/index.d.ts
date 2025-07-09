export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  role: 'staf_input' | 'admin_kredit' | 'analis' | 'pemutus' | 'admin';
  nomor_wa?: string;
}

export interface Nasabah {
  id: number;
  nama_lengkap: string;
  nik: string;
  alamat: string;
  nomor_wa: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  jenis_kelamin?: 'L' | 'P';
  pekerjaan?: string;
  penghasilan?: number;
  status_perkawinan?:
    | 'belum_menikah'
    | 'menikah'
    | 'cerai_hidup'
    | 'cerai_mati';
  nama_ibu_kandung?: string;
  agama?: 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu';
  created_at: string;
  updated_at: string;
  pinjaman_count?: number;
  pinjaman?: Pinjaman[];
}

export interface Pinjaman {
  id: number;
  nasabah_id: number;
  nasabah?: Nasabah;
  staf_input_id: number;
  staf_input?: User;
  admin_kredit_id?: number;
  admin_kredit?: User;
  analis_id?: number;
  analis?: User;
  pemutus_id?: number;
  pemutus?: User;
  jumlah_pinjaman: number;
  tujuan_pinjaman: string;
  jangka_waktu: number;
  bunga: number;
  status:
    | 'diajukan'
    | 'diperiksa'
    | 'dikembalikan'
    | 'dianalisis'
    | 'siap_diputuskan'
    | 'disetujui'
    | 'ditolak';
  catatan?: string;
  locked_at?: string;
  created_at: string;
  updated_at: string;
  berkas?: BerkasPinjaman[];
  log_pinjaman?: LogPinjaman[];
}

export interface BerkasPinjaman {
  id: number;
  pinjaman_id: number;
  nama_berkas: string;
  path_berkas: string;
  diupload_oleh_role: 'staf_input' | 'admin_kredit' | 'analis';
  created_at: string;
  updated_at: string;
}

export interface LogPinjaman {
  id: number;
  pinjaman_id: number;
  user_id: number;
  user?: User;
  aksi: string;
  status_sebelum?: string;
  status_sesudah?: string;
  catatan?: string;
  created_at: string;
  updated_at: string;
}

export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  auth: {
    user: User;
  };
};
