import CreatePinjamanStepper, {
  CreateStepData,
} from '@/Components/CreatePinjamanStepper';
import TechStackBackground from '@/Components/TechStackBackground';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { FormFileInput, FormInput } from '@/Components/ui/form';
import TailLayout from '@/Layouts/TailLayout';
import { PageProps } from '@/types';
import {
  BanknotesIcon,
  DocumentIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface CreatePinjamanProps extends PageProps {
  nasabah: Array<{
    id: number;
    nama_lengkap: string;
    nomor_ktp: string;
    nik: string;
    alamat: string;
    nomor_wa: string;
    pinjaman_count: number;
  }>;
}

export default function CreatePinjaman({ auth, nasabah }: CreatePinjamanProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedNasabah, setSelectedNasabah] = useState<
    (typeof nasabah)[0] | null
  >(null);

  // Filter nasabah berdasarkan pencarian
  const filteredNasabah = nasabah.filter(
    item =>
      item.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nomor_wa.includes(searchTerm)
  );

  // Handle pemilihan nasabah
  const handleSelectNasabah = (nasabahItem: (typeof nasabah)[0]) => {
    setSelectedNasabah(nasabahItem);
    setData('nasabah_id', nasabahItem.id.toString());
    setShowSearchResults(false);
    setSearchTerm(nasabahItem.nama_lengkap);
  };

  // Reset pemilihan nasabah
  const handleClearSelection = () => {
    setSelectedNasabah(null);
    setData('nasabah_id', '');
    setSearchTerm('');
    setShowSearchResults(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, setData, post, processing, errors, progress } = useForm({
    nasabah_id: '',
    jumlah_pinjaman: '',
    tujuan_pinjaman: '',
    jangka_waktu: '',
    bunga: '',
    berkas: [] as File[],
  });

  // Role check - only staf_input can create
  if (auth.user.role !== 'staf_input') {
    return (
      <TailLayout>
        <Head title="Akses Ditolak" />
        <TechStackBackground />
        <div className="relative z-10 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Card className="mx-auto max-w-md">
              <CardContent className="p-6 text-center">
                <h2 className="mb-4 text-xl font-semibold text-red-600">
                  Akses Ditolak
                </h2>
                <p className="text-gray-600">
                  Anda tidak memiliki akses untuk membuat pengajuan pinjaman.
                  Hanya staf input yang dapat melakukan ini.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </TailLayout>
    );
  }

  // Steps for the stepper
  const steps: CreateStepData[] = [
    {
      id: 1,
      name: 'Data Nasabah',
      description: 'Pilih nasabah',
      status:
        currentStep > 1
          ? 'completed'
          : currentStep === 1
            ? 'active'
            : 'pending',
      icon: <UserIcon className="h-5 w-5" />,
    },
    {
      id: 2,
      name: 'Detail Pinjaman',
      description: 'Jumlah & tujuan',
      status:
        currentStep > 2
          ? 'completed'
          : currentStep === 2
            ? 'active'
            : 'pending',
      icon: <BanknotesIcon className="h-5 w-5" />,
    },
    {
      id: 3,
      name: 'Upload Berkas',
      description: 'Upload dokumen',
      status:
        currentStep > 3
          ? 'completed'
          : currentStep === 3
            ? 'active'
            : 'pending',
      icon: <DocumentIcon className="h-5 w-5" />,
    },
  ];

  const submit: FormEventHandler = e => {
    e.preventDefault();
    post(route('pinjaman.store.wizard'));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setData('berkas', [...data.berkas, ...fileArray]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = data.berkas.filter((_, i) => i !== index);
    setData('berkas', newFiles);
  };

  const getStepValidationMessage = () => {
    switch (currentStep) {
      case 1:
        if (!selectedNasabah) return 'Pilih nasabah terlebih dahulu';
        return '';
      case 2:
        if (!data.jumlah_pinjaman) return 'Masukkan jumlah pinjaman';
        if (parseFloat(data.jumlah_pinjaman) <= 0)
          return 'Jumlah pinjaman harus lebih dari 0';
        if (!data.tujuan_pinjaman) return 'Masukkan tujuan pinjaman';
        if (!data.jangka_waktu) return 'Masukkan jangka waktu';
        if (
          parseInt(data.jangka_waktu) <= 0 ||
          parseInt(data.jangka_waktu) > 60
        )
          return 'Jangka waktu harus antara 1-60 bulan';
        if (!data.bunga) return 'Masukkan tingkat bunga';
        if (parseFloat(data.bunga) < 0 || parseFloat(data.bunga) > 100)
          return 'Bunga harus antara 0-100%';
        return '';
      case 3:
        if (data.berkas.length === 0)
          return 'Upload minimal 1 berkas pendukung';
        return '';
      default:
        return '';
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return selectedNasabah !== null && data.nasabah_id !== '';
      case 2:
        return (
          data.jumlah_pinjaman !== '' &&
          data.tujuan_pinjaman !== '' &&
          data.jangka_waktu !== '' &&
          data.bunga !== '' &&
          parseFloat(data.jumlah_pinjaman) > 0 &&
          parseInt(data.jangka_waktu) > 0 &&
          parseInt(data.jangka_waktu) <= 60 &&
          parseFloat(data.bunga) >= 0 &&
          parseFloat(data.bunga) <= 100
        );
      case 3:
        return data.berkas.length > 0;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (canProceedToNext() && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Search Input untuk Nasabah */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cari Nasabah
                <span className="ml-1 text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => {
                    setSearchTerm(e.target.value);
                    setShowSearchResults(e.target.value.length > 0);
                  }}
                  placeholder="Ketik nama, NIK, atau nomor WhatsApp..."
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-10 text-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                {selectedNasabah && (
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Search Results */}
              {showSearchResults && !selectedNasabah && (
                <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                  {filteredNasabah.length > 0 ? (
                    <>
                      {filteredNasabah.map(item => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectNasabah(item)}
                          className="cursor-pointer border-b border-gray-100 p-4 last:border-b-0 hover:bg-gray-50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {item.nama_lengkap}
                              </h4>
                              <p className="text-sm text-gray-600">
                                NIK: {item.nik}
                              </p>
                              <p className="text-sm text-gray-600">
                                WhatsApp: {item.nomor_wa}
                              </p>
                              <p className="text-sm text-gray-500">
                                {item.alamat}
                              </p>
                            </div>
                            <div className="ml-4 text-right">
                              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                {item.pinjaman_count} Pinjaman
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Opsi Tambah Nasabah Baru */}
                      <Link
                        href={route('nasabah.create')}
                        className="flex items-center justify-center border-t-2 border-dashed border-gray-200 p-4 text-blue-600 hover:bg-blue-50"
                      >
                        <PlusIcon className="mr-2 h-5 w-5" />
                        Tidak menemukan nasabah? Tambah Nasabah Baru
                      </Link>
                    </>
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-gray-500">Nasabah tidak ditemukan</p>
                      <Link
                        href={route('nasabah.create')}
                        className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-700"
                      >
                        <PlusIcon className="mr-1 h-4 w-4" />
                        Tambah Nasabah Baru
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {errors.nasabah_id && (
                <p className="text-sm text-red-600">{errors.nasabah_id}</p>
              )}
            </div>

            {/* Tampilan Bio Data Nasabah yang Dipilih */}
            {selectedNasabah && (
              <Card className="border-2 border-blue-200 bg-blue-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <UserIcon className="h-5 w-5 text-blue-600" />
                    Data Nasabah Terpilih
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Nama Lengkap
                      </label>
                      <p className="font-medium text-gray-900">
                        {selectedNasabah.nama_lengkap}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        NIK
                      </label>
                      <p className="font-medium text-gray-900">
                        {selectedNasabah.nik}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Nomor WhatsApp
                      </label>
                      <p className="font-medium text-gray-900">
                        {selectedNasabah.nomor_wa}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Riwayat Pinjaman
                      </label>
                      <p className="font-medium text-gray-900">
                        {selectedNasabah.pinjaman_count} Kali
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Alamat
                    </label>
                    <p className="font-medium text-gray-900">
                      {selectedNasabah.alamat}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <FormInput
              label="Jumlah Pinjaman"
              type="number"
              value={data.jumlah_pinjaman}
              onChange={e => setData('jumlah_pinjaman', e.target.value)}
              error={errors.jumlah_pinjaman}
              required
              placeholder="Masukkan jumlah pinjaman"
              helpText="Masukkan jumlah pinjaman dalam Rupiah"
              icon={<BanknotesIcon />}
            />

            <FormInput
              label="Tujuan Pinjaman"
              value={data.tujuan_pinjaman}
              onChange={e => setData('tujuan_pinjaman', e.target.value)}
              error={errors.tujuan_pinjaman}
              required
              placeholder="Contoh: Modal usaha, renovasi rumah, pendidikan"
              helpText="Jelaskan tujuan penggunaan pinjaman"
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormInput
                label="Jangka Waktu (Bulan)"
                type="number"
                value={data.jangka_waktu}
                onChange={e => setData('jangka_waktu', e.target.value)}
                error={errors.jangka_waktu}
                required
                placeholder="12"
                helpText="Jangka waktu dalam bulan (maksimal 60)"
                min="1"
                max="60"
              />

              <FormInput
                label="Bunga (%)"
                type="number"
                step="0.1"
                value={data.bunga}
                onChange={e => setData('bunga', e.target.value)}
                error={errors.bunga}
                required
                placeholder="2.5"
                helpText="Tingkat bunga per bulan"
                min="0"
                max="100"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                Upload Berkas Pendukung
              </h3>

              <FormFileInput
                label="Pilih Berkas"
                onChange={e => handleFileUpload(e.target.files)}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                fileTypes="PDF, JPG, JPEG, PNG, DOC, DOCX"
                helpText="Upload dokumen pendukung (KTP, KK, Slip Gaji, dll)"
                multiple
              />

              {data.berkas.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Berkas yang telah dipilih:
                  </h4>
                  {data.berkas.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <DocumentIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        Hapus
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {errors.berkas && (
                <p className="mt-2 text-sm text-red-600">{errors.berkas}</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <TailLayout>
      <Head title="Buat Pengajuan Pinjaman" />

      {/* Tech Stack Background */}
      <TechStackBackground />

      <div className="relative z-10 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Buat Pengajuan Pinjaman Baru
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Ikuti langkah-langkah berikut untuk membuat pengajuan pinjaman
              baru
            </p>
          </div>

          {/* Stepper */}
          <CreatePinjamanStepper steps={steps} currentStep={currentStep} />

          {/* Form Content */}
          <form onSubmit={submit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {steps[currentStep - 1]?.icon}
                  {steps[currentStep - 1]?.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {renderStepContent()}
              </CardContent>
            </Card>

            {/* Progress Upload */}
            {progress && (
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress Upload</span>
                      <span>{progress.percentage}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Validation Message */}
              {!canProceedToNext() && (
                <div className="rounded-lg bg-yellow-50 p-4 text-center">
                  <p className="text-sm text-yellow-800">
                    {getStepValidationMessage()}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {currentStep > 1 && (
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Sebelumnya
                    </Button>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => window.history.back()}
                  >
                    Batal
                  </Button>

                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      variant="primary"
                      onClick={nextStep}
                      disabled={!canProceedToNext()}
                    >
                      Selanjutnya
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="success"
                      disabled={processing || !canProceedToNext()}
                      loading={processing}
                    >
                      {processing ? 'Menyimpan...' : 'Buat Pengajuan'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </TailLayout>
  );
}
