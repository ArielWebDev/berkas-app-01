import TailLayout from '@/Layouts/TailLayout';
import { Nasabah, PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, RefreshCw, Save, User } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface EditProps extends PageProps {
  nasabah: Nasabah;
}

export default function Edit({ nasabah }: EditProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { data, setData, put, processing, errors, reset } = useForm({
    nik: nasabah.nik || '',
    nama_lengkap: nasabah.nama_lengkap || '',
    alamat: nasabah.alamat || '',
    nomor_ktp: nasabah.nomor_ktp || '',
    nomor_wa: nasabah.nomor_wa || '',
    tempat_lahir: nasabah.tempat_lahir || '',
    tanggal_lahir: nasabah.tanggal_lahir || '',
    jenis_kelamin: nasabah.jenis_kelamin || 'L',
    pekerjaan: nasabah.pekerjaan || '',
    penghasilan: nasabah.penghasilan || 0,
    status_perkawinan: nasabah.status_perkawinan || 'belum_kawin',
  });

  const submit: FormEventHandler = e => {
    e.preventDefault();
    setIsLoading(true);

    put(route('nasabah.update', nasabah.id), {
      onSuccess: () => {
        setIsLoading(false);
      },
      onError: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <TailLayout>
      <Head title={`Edit Nasabah - ${nasabah.nama_lengkap}`} />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href={route('nasabah.show', nasabah.id)}
              className="flex items-center text-gray-600 transition-colors hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Kembali
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Nasabah</h1>
              <p className="mt-1 text-gray-600">
                {' '}
                Perbarui data nasabah {nasabah.nama_lengkap}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <User className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Informasi Nasabah
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Lengkapi form di bawah untuk memperbarui data nasabah
            </p>
          </div>

          <form onSubmit={submit} className="space-y-6 p-6">
            {/* Identitas */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="nik"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  NIK <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nik"
                  value={data.nik}
                  onChange={e => setData('nik', e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                    errors.nik ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan NIK (16 digit)"
                />
                {errors.nik && (
                  <p className="mt-1 text-sm text-red-600">{errors.nik}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="nama"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nama_lengkap"
                  value={data.nama_lengkap}
                  onChange={e => setData('nama_lengkap', e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                    errors.nama_lengkap ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan nama lengkap"
                />
                {errors.nama_lengkap && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.nama_lengkap}
                  </p>
                )}
              </div>
            </div>

            {/* Alamat */}
            <div>
              <label
                htmlFor="alamat"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Alamat Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea
                id="alamat"
                rows={3}
                value={data.alamat}
                onChange={e => setData('alamat', e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                  errors.alamat ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Masukkan alamat lengkap"
              />
              {errors.alamat && (
                <p className="mt-1 text-sm text-red-600">{errors.alamat}</p>
              )}
            </div>

            {/* Kontak */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="nomor_ktp"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  No. KTP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nomor_ktp"
                  value={data.nomor_ktp}
                  onChange={e => setData('nomor_ktp', e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                    errors.nomor_ktp ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Contoh: 1234567890123456"
                />
                {errors.nomor_ktp && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.nomor_ktp}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="nomor_wa"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  No. WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="nomor_wa"
                  value={data.nomor_wa}
                  onChange={e => setData('nomor_wa', e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                    errors.nomor_wa ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Contoh: 081234567890"
                />
                {errors.nomor_wa && (
                  <p className="mt-1 text-sm text-red-600">{errors.nomor_wa}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="jenis_kelamin"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Jenis Kelamin <span className="text-red-500">*</span>
                </label>
                <select
                  id="jenis_kelamin"
                  value={data.jenis_kelamin}
                  onChange={e =>
                    setData('jenis_kelamin', e.target.value as 'L' | 'P')
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
            </div>

            {/* Tempat/Tanggal Lahir */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="tempat_lahir"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Tempat Lahir <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="tempat_lahir"
                  value={data.tempat_lahir}
                  onChange={e => setData('tempat_lahir', e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                    errors.tempat_lahir ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Contoh: Jakarta"
                />
                {errors.tempat_lahir && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.tempat_lahir}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="tanggal_lahir"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Tanggal Lahir <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="tanggal_lahir"
                  value={data.tanggal_lahir}
                  onChange={e => setData('tanggal_lahir', e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                    errors.tanggal_lahir ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.tanggal_lahir && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.tanggal_lahir}
                  </p>
                )}
              </div>
            </div>

            {/* Pekerjaan & Status */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="pekerjaan"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Pekerjaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="pekerjaan"
                  value={data.pekerjaan}
                  onChange={e => setData('pekerjaan', e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                    errors.pekerjaan ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Contoh: Wiraswasta"
                />
                {errors.pekerjaan && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.pekerjaan}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="status_perkawinan"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Status Perkawinan <span className="text-red-500">*</span>
                </label>
                <select
                  id="status_perkawinan"
                  value={data.status_perkawinan}
                  onChange={e =>
                    setData(
                      'status_perkawinan',
                      e.target.value as 'belum_kawin' | 'kawin' | 'cerai'
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="belum_kawin">Belum Kawin</option>
                  <option value="kawin">Kawin</option>
                  <option value="cerai">Cerai</option>
                </select>
              </div>
            </div>

            {/* Penghasilan */}
            <div>
              <label
                htmlFor="penghasilan"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Penghasilan per Bulan <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">Rp</span>
                <input
                  type="number"
                  id="penghasilan"
                  value={data.penghasilan}
                  onChange={e => setData('penghasilan', Number(e.target.value))}
                  className={`w-full rounded-lg border py-2 pl-10 pr-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                    errors.penghasilan ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Contoh: 5000000"
                />
              </div>
              {errors.penghasilan && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.penghasilan}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <button
                type="button"
                onClick={() => reset()}
                disabled={processing}
                className="flex items-center rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </button>

              <div className="flex items-center space-x-3">
                <Link
                  href={route('nasabah.show', nasabah.id)}
                  className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={processing || isLoading}
                  className="flex items-center rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  {processing || isLoading ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {processing || isLoading
                    ? 'Menyimpan...'
                    : 'Simpan Perubahan'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </TailLayout>
  );
}
