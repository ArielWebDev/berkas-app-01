import TailLayout from '@/Layouts/TailLayout';
import {
  ArrowLeftIcon,
  CheckIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

interface Props {
  errors?: Record<string, string>;
}

export default function NasabahCreate({ errors = {} }: Props) {
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    nomor_ktp: '',
    nik: '',
    alamat: '',
    nomor_wa: '',
    no_telepon: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    jenis_kelamin: 'L',
    pekerjaan: '',
    penghasilan: 0,
    status_perkawinan: 'belum_kawin',
    nama_ibu_kandung: '',
    agama: '',
    penghasilan_bulanan: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    router.post('/nasabah', formData, {
      onSuccess: () => {
        setShowSuccess(true);
        setTimeout(() => {
          router.visit('/nasabah');
        }, 2000);
      },
      onError: () => {
        setIsSubmitting(false);
      },
      onFinish: () => {
        setIsSubmitting(false);
      },
    });
  };

  const handlePenghasilanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numericValue = parseFloat(value.replace(/[^\d]/g, '')) || 0;
    setFormData(prev => ({
      ...prev,
      penghasilan_bulanan: numericValue,
    }));
  };

  return (
    <TailLayout>
      <Head title="Tambah Nasabah Baru" />

      <div className="min-h-screen bg-gray-50 py-6">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
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
                  Tambah Nasabah Baru
                </h1>
                <p className="mt-2 text-gray-600">
                  Lengkapi data nasabah untuk mengajukan pinjaman
                </p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 rounded-lg bg-green-50 p-4 ring-1 ring-green-200">
              <div className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-600" />
                <span className="ml-2 text-sm font-medium text-green-800">
                  Data nasabah berhasil disimpan! Mengalihkan ke halaman
                  nasabah...
                </span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Data Pribadi */}
            <div className="rounded-lg bg-white shadow">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="flex items-center text-lg font-semibold text-gray-900">
                  <UserIcon className="mr-2 h-5 w-5 text-blue-600" />
                  Data Pribadi
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Nama Lengkap */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="nama_lengkap"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      id="nama_lengkap"
                      name="nama_lengkap"
                      value={formData.nama_lengkap}
                      onChange={handleChange}
                      required
                      className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
                        errors.nama_lengkap
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                      placeholder="Masukkan nama lengkap"
                    />
                    {errors.nama_lengkap && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.nama_lengkap}
                      </p>
                    )}
                  </div>

                  {/* NIK */}
                  <div>
                    <label
                      htmlFor="nik"
                      className="block text-sm font-medium text-gray-700"
                    >
                      NIK *
                    </label>
                    <input
                      type="text"
                      id="nik"
                      name="nik"
                      value={formData.nik}
                      onChange={handleChange}
                      required
                      maxLength={16}
                      className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
                        errors.nik
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                      placeholder="Nomor Induk Kependudukan"
                    />
                    {errors.nik && (
                      <p className="mt-1 text-sm text-red-600">{errors.nik}</p>
                    )}
                  </div>

                  {/* Jenis Kelamin */}
                  <div>
                    <label
                      htmlFor="jenis_kelamin"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Jenis Kelamin *
                    </label>
                    <select
                      id="jenis_kelamin"
                      name="jenis_kelamin"
                      value={formData.jenis_kelamin}
                      onChange={handleChange}
                      required
                      className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
                        errors.jenis_kelamin
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    >
                      <option value="">Pilih jenis kelamin</option>
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                    {errors.jenis_kelamin && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.jenis_kelamin}
                      </p>
                    )}
                  </div>

                  {/* Tempat Lahir */}
                  <div>
                    <label
                      htmlFor="tempat_lahir"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Tempat Lahir *
                    </label>
                    <input
                      type="text"
                      id="tempat_lahir"
                      name="tempat_lahir"
                      value={formData.tempat_lahir}
                      onChange={handleChange}
                      required
                      className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
                        errors.tempat_lahir
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                      placeholder="Kota tempat lahir"
                    />
                    {errors.tempat_lahir && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.tempat_lahir}
                      </p>
                    )}
                  </div>

                  {/* Tanggal Lahir */}
                  <div>
                    <label
                      htmlFor="tanggal_lahir"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Tanggal Lahir *
                    </label>
                    <input
                      type="date"
                      id="tanggal_lahir"
                      name="tanggal_lahir"
                      value={formData.tanggal_lahir}
                      onChange={handleChange}
                      required
                      className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
                        errors.tanggal_lahir
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    />
                    {errors.tanggal_lahir && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.tanggal_lahir}
                      </p>
                    )}
                  </div>

                  {/* Nama Ibu Kandung */}
                  <div>
                    <label
                      htmlFor="nama_ibu_kandung"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nama Ibu Kandung *
                    </label>
                    <input
                      type="text"
                      id="nama_ibu_kandung"
                      name="nama_ibu_kandung"
                      value={formData.nama_ibu_kandung}
                      onChange={handleChange}
                      required
                      className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
                        errors.nama_ibu_kandung
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                      placeholder="Nama ibu kandung"
                    />
                    {errors.nama_ibu_kandung && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.nama_ibu_kandung}
                      </p>
                    )}
                  </div>

                  {/* Agama */}
                  <div>
                    <label
                      htmlFor="agama"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Agama *
                    </label>
                    <select
                      id="agama"
                      name="agama"
                      value={formData.agama}
                      onChange={handleChange}
                      required
                      className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
                        errors.agama
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    >
                      <option value="">Pilih agama</option>
                      <option value="Islam">Islam</option>
                      <option value="Kristen">Kristen</option>
                      <option value="Katolik">Katolik</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Buddha">Buddha</option>
                      <option value="Konghucu">Konghucu</option>
                    </select>
                    {errors.agama && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.agama}
                      </p>
                    )}
                  </div>

                  {/* Status Perkawinan */}
                  <div>
                    <label
                      htmlFor="status_perkawinan"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Status Perkawinan *
                    </label>
                    <select
                      id="status_perkawinan"
                      name="status_perkawinan"
                      value={formData.status_perkawinan}
                      onChange={handleChange}
                      required
                      className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
                        errors.status_perkawinan
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    >
                      <option value="">Pilih status perkawinan</option>
                      <option value="belum_kawin">Belum Kawin</option>
                      <option value="kawin">Kawin</option>
                      <option value="cerai">Cerai Hidup</option>
                      <option value="cerai">Cerai Mati</option>
                    </select>
                    {errors.status_perkawinan && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.status_perkawinan}
                      </p>
                    )}
                  </div>

                  {/* Alamat */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="alamat"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Alamat Lengkap *
                    </label>
                    <textarea
                      id="alamat"
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleChange}
                      required
                      rows={3}
                      className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
                        errors.alamat
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                      placeholder="Alamat lengkap sesuai KTP"
                    />
                    {errors.alamat && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.alamat}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Kontak & Pekerjaan */}
            <div className="rounded-lg bg-white shadow">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Kontak & Pekerjaan
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Nomor KTP */}
                  <div>
                    <label
                      htmlFor="nomor_ktp"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nomor KTP *
                    </label>
                    <input
                      type="text"
                      id="nomor_ktp"
                      name="nomor_ktp"
                      value={formData.nomor_ktp}
                      onChange={handleChange}
                      required
                      maxLength={20}
                      className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
                        errors.nomor_ktp
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                      placeholder="Nomor Kartu Tanda Penduduk"
                    />
                    {errors.nomor_ktp && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.nomor_ktp}
                      </p>
                    )}
                  </div>

                  {/* Nomor WhatsApp */}
                  <div>
                    <label
                      htmlFor="nomor_wa"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nomor WhatsApp *
                    </label>
                    <input
                      type="tel"
                      id="nomor_wa"
                      name="nomor_wa"
                      value={formData.nomor_wa}
                      onChange={handleChange}
                      required
                      className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
                        errors.nomor_wa
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                      placeholder="08xxxxxxxxxx"
                    />
                    {errors.nomor_wa && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.nomor_wa}
                      </p>
                    )}
                  </div>

                  {/* Pekerjaan */}
                  <div>
                    <label
                      htmlFor="pekerjaan"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Pekerjaan *
                    </label>
                    <input
                      type="text"
                      id="pekerjaan"
                      name="pekerjaan"
                      value={formData.pekerjaan}
                      onChange={handleChange}
                      required
                      className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
                        errors.pekerjaan
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                      placeholder="Jenis pekerjaan"
                    />
                    {errors.pekerjaan && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.pekerjaan}
                      </p>
                    )}
                  </div>

                  {/* Penghasilan Bulanan */}
                  <div>
                    <label
                      htmlFor="penghasilan_bulanan"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Penghasilan Bulanan *
                    </label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-2 text-gray-500">
                        Rp
                      </span>
                      <input
                        type="text"
                        id="penghasilan_bulanan"
                        name="penghasilan_bulanan"
                        value={formData.penghasilan_bulanan}
                        onChange={handlePenghasilanChange}
                        required
                        className={`block w-full rounded-lg border px-3 py-2 pl-10 shadow-sm focus:outline-none focus:ring-2 ${
                          errors.penghasilan_bulanan
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        }`}
                        placeholder="5,000,000"
                      />
                    </div>
                    {errors.penghasilan_bulanan && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.penghasilan_bulanan}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/nasabah"
                className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center rounded-lg px-6 py-2 text-sm font-medium text-white shadow-sm ${
                  isSubmitting
                    ? 'cursor-not-allowed bg-gray-400'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <CheckIcon className="mr-2 h-4 w-4" />
                    Simpan Nasabah
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
