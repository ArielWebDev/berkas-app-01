import TailLayout from '@/Layouts/TailLayout';
import { Nasabah } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Props {
  nasabah: Nasabah;
}

export default function Edit({ nasabah }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const { data, setData, put, processing, errors } = useForm({
    nama_lengkap: nasabah.nama_lengkap || '',
    nik: nasabah.nik || '',
    alamat: nasabah.alamat || '',
    nomor_wa: nasabah.nomor_wa || '',
    tempat_lahir: nasabah.tempat_lahir || '',
    tanggal_lahir: nasabah.tanggal_lahir || '',
    jenis_kelamin: (nasabah.jenis_kelamin || 'L') as 'L' | 'P',
    pekerjaan: nasabah.pekerjaan || '',
    penghasilan: nasabah.penghasilan
      ? nasabah.penghasilan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      : '',
    status_perkawinan: (nasabah.status_perkawinan || 'belum_menikah') as
      | 'belum_menikah'
      | 'menikah'
      | 'cerai_hidup'
      | 'cerai_mati',
    nama_ibu_kandung: nasabah.nama_ibu_kandung || '',
    agama: (nasabah.agama || '') as
      | ''
      | 'Islam'
      | 'Kristen'
      | 'Katolik'
      | 'Hindu'
      | 'Buddha'
      | 'Konghucu',
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

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handlePenghasilanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setData('penghasilan', formatted);
  };

  return (
    <TailLayout>
      <Head title={`Edit Nasabah - ${nasabah.nama_lengkap}`} />

      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href={route('nasabah.show', nasabah.id)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Nasabah</h1>
              <p className="text-sm text-gray-600">
                Edit data nasabah {nasabah.nama_lengkap}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-lg bg-white shadow">
          <form onSubmit={submit} className="space-y-6 p-6">
            {/* Data Pribadi */}
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Data Pribadi
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="nama_lengkap"
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
                    placeholder="Contoh: 1234567890123456"
                    maxLength={16}
                  />
                  {errors.nik && (
                    <p className="mt-1 text-sm text-red-600">{errors.nik}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Alamat & Kontak */}
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Alamat & Kontak
              </h3>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="alamat"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Alamat <span className="text-red-500">*</span>
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

                <div>
                  <label
                    htmlFor="nomor_wa"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Nomor WhatsApp <span className="text-red-500">*</span>
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
                    <p className="mt-1 text-sm text-red-600">
                      {errors.nomor_wa}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Info Personal */}
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Informasi Personal
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="tempat_lahir"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    id="tempat_lahir"
                    value={data.tempat_lahir}
                    onChange={e => setData('tempat_lahir', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan tempat lahir"
                  />
                </div>

                <div>
                  <label
                    htmlFor="tanggal_lahir"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    id="tanggal_lahir"
                    value={data.tanggal_lahir}
                    onChange={e => setData('tanggal_lahir', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="jenis_kelamin"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Jenis Kelamin
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

                <div>
                  <label
                    htmlFor="status_perkawinan"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Status Perkawinan
                  </label>
                  <select
                    id="status_perkawinan"
                    value={data.status_perkawinan}
                    onChange={e =>
                      setData('status_perkawinan', e.target.value as any)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="belum_menikah">Belum Menikah</option>
                    <option value="menikah">Menikah</option>
                    <option value="cerai_hidup">Cerai Hidup</option>
                    <option value="cerai_mati">Cerai Mati</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="nama_ibu_kandung"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Nama Ibu Kandung
                  </label>
                  <input
                    type="text"
                    id="nama_ibu_kandung"
                    value={data.nama_ibu_kandung}
                    onChange={e => setData('nama_ibu_kandung', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nama ibu kandung"
                  />
                </div>

                <div>
                  <label
                    htmlFor="agama"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Agama
                  </label>
                  <select
                    id="agama"
                    value={data.agama}
                    onChange={e => setData('agama', e.target.value as any)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Agama</option>
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Info Pekerjaan */}
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Informasi Pekerjaan
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="pekerjaan"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Pekerjaan
                  </label>
                  <input
                    type="text"
                    id="pekerjaan"
                    value={data.pekerjaan}
                    onChange={e => setData('pekerjaan', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: Karyawan, Wiraswasta, PNS"
                  />
                </div>

                <div>
                  <label
                    htmlFor="penghasilan"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Penghasilan Bulanan (Rp)
                  </label>
                  <input
                    type="text"
                    id="penghasilan"
                    value={data.penghasilan}
                    onChange={handlePenghasilanChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: 5.000.000"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <Link
                href={route('nasabah.show', nasabah.id)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={processing || isLoading}
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {processing || isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </TailLayout>
  );
}
