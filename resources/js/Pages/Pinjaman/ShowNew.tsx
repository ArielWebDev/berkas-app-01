import WorkflowActionsImproved from '@/Components/WorkflowActionsImproved';
import WorkflowStepIndicator from '@/Components/WorkflowStepIndicator';
import TailLayout from '@/Layouts/TailLayout';
import { PageProps } from '@/types';
import {
  ArrowLeftIcon,
  CloudArrowUpIcon,
  DocumentIcon,
  EyeIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface ShowPinjamanProps extends PageProps {
  pinjaman: {
    id: number;
    status: string;
    jumlah_pinjaman: number;
    tujuan_pinjaman?: string;
    jangka_waktu?: number;
    bunga?: number;
    catatan?: string | null;
    created_at: string;
    nasabah: {
      nama_lengkap: string;
      nik?: string;
      nomor_ktp?: string;
      alamat: string;
      nomor_wa: string;
    };
    staf_input?: { name: string };
    admin_kredit?: { name: string };
    analis?: { name: string };
    pemutus?: { name: string };
    berkas_pinjaman?: Array<{
      id: number;
      nama_berkas: string;
      path_file: string;
      diupload_oleh_role: string;
      created_at: string;
    }>;
    log_pinjaman?: Array<{
      id: number;
      aksi: string;
      deskripsi: string;
      created_at: string;
      user: { name: string };
    }>;
  };
}

export default function ShowPinjaman({ auth, pinjaman }: ShowPinjamanProps) {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ id: number; name: string; url: string }>
  >([]);

  const { data, setData, post, processing, errors, reset } = useForm({
    nama_berkas: '',
    file: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files).map(file => ({
        id: Date.now() + Math.random(), // Generate a unique id for each file
        name: file.name,
        url: URL.createObjectURL(file),
      }));
      setUploadedFiles(prev => [...prev, ...fileArray]);
      // Set the first file for form submission
      setData('file', files[0]);
    }
  };

  const handleRemoveFile = (id: number) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/pinjaman/${pinjaman.id}/upload-berkas`, {
      onSuccess: () => {
        // Handle success, e.g., show a success message or update the UI
      },
      onError: () => {
        // Handle error, e.g., show an error message
      },
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      diajukan: 'bg-blue-100 text-blue-800',
      diperiksa: 'bg-yellow-100 text-yellow-800',
      dikembalikan: 'bg-red-100 text-red-800',
      dianalisis: 'bg-purple-100 text-purple-800',
      siap_diputuskan: 'bg-indigo-100 text-indigo-800',
      disetujui: 'bg-green-100 text-green-800',
      ditolak: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Function to check if user can upload berkas
  const canUploadBerkas = () => {
    const userRole = auth.user.role;
    const status = pinjaman.status;

    // Admin kredit can upload OJK docs when status is 'diperiksa' and they own the pinjaman
    if (
      userRole === 'admin_kredit' &&
      status === 'diperiksa' &&
      pinjaman.admin_kredit?.name === auth.user.name
    ) {
      return true;
    }

    // Analis can upload lapangan docs when status is 'dianalisis' and they own the pinjaman
    if (
      userRole === 'analis' &&
      status === 'dianalisis' &&
      pinjaman.analis?.name === auth.user.name
    ) {
      return true;
    }

    return false;
  };

  // Function to get upload route based on role
  const getUploadRoute = () => {
    if (auth.user.role === 'admin_kredit') {
      return route('pinjaman.upload-ojk', pinjaman.id);
    } else if (auth.user.role === 'analis') {
      return route('pinjaman.upload-lapangan', pinjaman.id);
    }
    return '';
  };

  // Function to get upload title based on role
  const getUploadTitle = () => {
    if (auth.user.role === 'admin_kredit') {
      return 'Upload Dokumen OJK';
    } else if (auth.user.role === 'analis') {
      return 'Upload Dokumen Lapangan';
    }
    return 'Upload Dokumen';
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nama_berkas', data.nama_berkas);
    if (data.file) {
      formData.append('file', data.file);
    }

    post(getUploadRoute(), {
      _method: 'POST',
      nama_berkas: data.nama_berkas,
      file: data.file,
      onSuccess: () => {
        reset();
        setShowUploadForm(false);
      },
    });
  };

  return (
    <TailLayout>
      <Head title={`Pinjaman #${pinjaman.id}`} />

      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/pinjaman"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="mr-1 h-5 w-5" />
              Kembali
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Detail Pinjaman #{pinjaman.id}
            </h1>
          </div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
              pinjaman.status
            )}`}
          >
            {pinjaman.status.toUpperCase()}
          </span>
        </div>

        {/* Workflow Progress */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Progress Workflow
          </h3>
          <WorkflowStepIndicator currentStatus={pinjaman.status} />

          {/* Assigned Users */}
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div>
              <span className="font-medium text-gray-700">Staf Input:</span>
              <p className="text-gray-600">
                {pinjaman.staf_input?.name || 'Belum ditentukan'}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Admin Kredit:</span>
              <p className="text-gray-600">
                {pinjaman.admin_kredit?.name || 'Belum ditentukan'}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Analis:</span>
              <p className="text-gray-600">
                {pinjaman.analis?.name || 'Belum ditentukan'}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Pemutus:</span>
              <p className="text-gray-600">
                {pinjaman.pemutus?.name || 'Belum ditentukan'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Informasi Nasabah */}
          <div className="rounded-lg bg-white shadow-sm">
            <div className="p-6">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Informasi Nasabah
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Nama Lengkap
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {pinjaman.nasabah.nama_lengkap}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    NIK/Nomor KTP
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {pinjaman.nasabah.nik ||
                      pinjaman.nasabah.nomor_ktp ||
                      'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Alamat
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {pinjaman.nasabah.alamat}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Nomor WhatsApp
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {pinjaman.nasabah.nomor_wa}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Informasi Pinjaman */}
          <div className="rounded-lg bg-white shadow-sm">
            <div className="p-6">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Informasi Pinjaman
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Jumlah Pinjaman
                  </label>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {formatCurrency(pinjaman.jumlah_pinjaman)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Tujuan Pinjaman
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {pinjaman.tujuan_pinjaman || 'Tidak ditentukan'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Jangka Waktu
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {pinjaman.jangka_waktu
                      ? `${pinjaman.jangka_waktu} bulan`
                      : 'Tidak ditentukan'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Bunga
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {pinjaman.bunga ? `${pinjaman.bunga}%` : 'Tidak ditentukan'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Tanggal Pengajuan
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(pinjaman.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Berkas Pinjaman */}
        {pinjaman.berkas_pinjaman && pinjaman.berkas_pinjaman.length > 0 && (
          <div className="mt-6 rounded-lg bg-white shadow-sm">
            <div className="p-6">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Berkas Pinjaman
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pinjaman.berkas_pinjaman.map(berkas => (
                  <div
                    key={berkas.id}
                    className="rounded-lg border p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <DocumentIcon className="h-8 w-8 flex-shrink-0 text-blue-500" />
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-medium text-gray-900">
                          {berkas.nama_berkas}
                        </h4>
                        <p className="mt-1 text-xs text-gray-500">
                          Diupload oleh: {berkas.diupload_oleh_role}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(berkas.created_at)}
                        </p>
                        <a
                          href={`/storage/${berkas.path_file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
                        >
                          <EyeIcon className="mr-1 h-3 w-3" />
                          Lihat File
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Log Aktivitas */}
        {pinjaman.log_pinjaman && pinjaman.log_pinjaman.length > 0 && (
          <div className="mt-6 rounded-lg bg-white shadow-sm">
            <div className="p-6">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Log Aktivitas
              </h3>
              <div className="space-y-4">
                {pinjaman.log_pinjaman.map(log => (
                  <div
                    key={log.id}
                    className="border-l-4 border-blue-500 py-2 pl-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        {log.aksi}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {formatDate(log.created_at)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {log.deskripsi}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Oleh: {log.user.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Catatan */}
        {pinjaman.catatan && (
          <div className="mt-6 rounded-lg bg-white shadow-sm">
            <div className="p-6">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Catatan
              </h3>
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <p className="text-sm text-gray-900">{pinjaman.catatan}</p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Berkas Form */}
        {canUploadBerkas() && (
          <div className="mt-6 rounded-lg bg-white shadow-sm">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {getUploadTitle()}
                </h3>
                <button
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4" />
                  {showUploadForm ? 'Tutup Form' : 'Tambah Berkas'}
                </button>
              </div>

              {showUploadForm && (
                <form onSubmit={handleUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nama Dokumen
                    </label>
                    <input
                      type="text"
                      value={data.nama_berkas}
                      onChange={e => setData('nama_berkas', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={
                        auth.user.role === 'admin_kredit'
                          ? 'Contoh: Hasil Pengecekan OJK'
                          : 'Contoh: Laporan Kunjungan Lapangan'
                      }
                      required
                    />
                    {errors.nama_berkas && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.nama_berkas}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      File Dokumen
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={e =>
                        setData('file', e.target.files?.[0] || null)
                      }
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                      required
                    />
                    {errors.file && (
                      <p className="mt-2 text-sm text-red-600">{errors.file}</p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={processing}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      <CloudArrowUpIcon className="h-4 w-4" />
                      {processing ? 'Mengupload...' : 'Upload Berkas'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUploadForm(false)}
                      className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Workflow Actions */}
        <WorkflowActionsImproved pinjaman={pinjaman} user={auth.user} />

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <Link
            href={`/pinjaman/${pinjaman.id}/edit`}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Edit Pinjaman
          </Link>
          <Link
            href="/pinjaman"
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Kembali ke Daftar
          </Link>
        </div>
      </div>
    </TailLayout>
  );
}
