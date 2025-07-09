import TailLayout from '@/Layouts/TailLayout';
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  TrashIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Nasabah {
  id: number;
  nama_lengkap: string;
  nik: string;
  nomor_ktp: string;
  nomor_wa: string;
  alamat: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  pekerjaan: string;
  penghasilan: number;
  status_perkawinan: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  nasabah: Nasabah;
  auth: {
    user: {
      id: number;
      name: string;
      role: string;
    };
  };
}

export default function NasabahShow({ nasabah, auth }: Props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    router.delete(`/nasabah/${nasabah.id}`, {
      onSuccess: () => {
        router.visit('/nasabah');
      },
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <TailLayout>
      <Head title={`Detail Nasabah - ${nasabah.nama_lengkap}`} />

      <div className="min-h-screen bg-gray-50 py-6">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/nasabah"
                  className="flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Kembali
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Detail Nasabah
                  </h1>
                  <p className="mt-2 text-gray-600">
                    Informasi lengkap nasabah {nasabah.nama_lengkap}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Link
                  href={`/nasabah/${nasabah.id}/edit`}
                  className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <PencilIcon className="mr-2 h-4 w-4" />
                  Edit
                </Link>
                {auth.user.role === 'admin' && (
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Hapus
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="rounded-lg bg-white shadow">
                <div className="p-6">
                  <div className="text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
                      <UserIcon className="h-12 w-12 text-blue-600" />
                    </div>
                    <h2 className="mt-4 text-xl font-bold text-gray-900">
                      {nasabah.nama_lengkap}
                    </h2>
                    <p className="text-gray-600">NIK: {nasabah.nik}</p>

                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                        <PhoneIcon className="h-4 w-4" />
                        <span>{nasabah.nomor_wa}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                        <BriefcaseIcon className="h-4 w-4" />
                        <span>{nasabah.pekerjaan}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 rounded-lg bg-white shadow">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Informasi Singkat
                  </h3>
                </div>
                <div className="p-6">
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Usia
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {calculateAge(nasabah.tanggal_lahir)} tahun
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Jenis Kelamin
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {nasabah.jenis_kelamin === 'L'
                          ? 'Laki-laki'
                          : 'Perempuan'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Status Perkawinan
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {nasabah.status_perkawinan}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Penghasilan
                      </dt>
                      <dd className="mt-1 text-sm font-bold text-green-600">
                        {formatCurrency(nasabah.penghasilan)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {/* Detail Information */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Data Pribadi */}
                <div className="rounded-lg bg-white shadow">
                  <div className="border-b border-gray-200 px-6 py-4">
                    <h3 className="flex items-center text-lg font-semibold text-gray-900">
                      <UserIcon className="mr-2 h-5 w-5 text-blue-600" />
                      Data Pribadi
                    </h3>
                  </div>
                  <div className="p-6">
                    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Nama Lengkap
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {nasabah.nama_lengkap}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          NIK
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {nasabah.nik}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Tempat Lahir
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {nasabah.tempat_lahir}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Tanggal Lahir
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {formatDate(nasabah.tanggal_lahir)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Kontak & Alamat */}
                <div className="rounded-lg bg-white shadow">
                  <div className="border-b border-gray-200 px-6 py-4">
                    <h3 className="flex items-center text-lg font-semibold text-gray-900">
                      <MapPinIcon className="mr-2 h-5 w-5 text-blue-600" />
                      Kontak & Alamat
                    </h3>
                  </div>
                  <div className="p-6">
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Nomor WhatsApp
                        </dt>
                        <dd className="mt-1">
                          <a
                            href={`https://wa.me/${nasabah.nomor_wa}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-green-600 hover:text-green-700"
                          >
                            <PhoneIcon className="mr-1 h-4 w-4" />
                            {nasabah.nomor_wa}
                          </a>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Alamat Lengkap
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {nasabah.alamat}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Pekerjaan & Keuangan */}
                <div className="rounded-lg bg-white shadow">
                  <div className="border-b border-gray-200 px-6 py-4">
                    <h3 className="flex items-center text-lg font-semibold text-gray-900">
                      <CurrencyDollarIcon className="mr-2 h-5 w-5 text-blue-600" />
                      Pekerjaan & Keuangan
                    </h3>
                  </div>
                  <div className="p-6">
                    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Pekerjaan
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {nasabah.pekerjaan}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Penghasilan Bulanan
                        </dt>
                        <dd className="mt-1 text-sm font-bold text-green-600">
                          {formatCurrency(nasabah.penghasilan)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Metadata */}
                <div className="rounded-lg bg-white shadow">
                  <div className="border-b border-gray-200 px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Informasi Sistem
                    </h3>
                  </div>
                  <div className="p-6">
                    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Tanggal Pendaftaran
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {formatDate(nasabah.created_at)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Terakhir Diperbarui
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {formatDate(nasabah.updated_at)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="text-lg font-medium text-gray-900">Hapus Nasabah</h3>
            <p className="mt-2 text-sm text-gray-500">
              Apakah Anda yakin ingin menghapus nasabah{' '}
              <strong>{nasabah.nama_lengkap}</strong>? Tindakan ini tidak dapat
              dibatalkan dan akan menghapus semua data terkait.
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Hapus Nasabah
              </button>
            </div>
          </div>
        </div>
      )}
    </TailLayout>
  );
}
