import TailLayout from '@/Layouts/TailLayout';
import { Nasabah, PageProps } from '@/types';
import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  DocumentIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface WizardCreateProps extends PageProps {
  nasabah_list: Nasabah[];
}

interface FormData {
  nasabah_id: string;
  jumlah_pinjaman: number;
  tujuan_pinjaman: string;
  jangka_waktu: number;
  bunga: number;
  berkas: File[];
  [key: string]: any; // Index signature untuk TypeScript
}

export default function WizardCreate({ nasabah_list }: WizardCreateProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm<FormData>({
    nasabah_id: '',
    jumlah_pinjaman: 0,
    tujuan_pinjaman: '',
    jangka_waktu: 12,
    bunga: 2.5,
    berkas: [],
  });

  const steps = [
    {
      id: 1,
      name: 'Pilih Nasabah',
      description: 'Pilih nasabah untuk pengajuan pinjaman',
      icon: UserIcon,
      fields: ['nasabah_id'],
    },
    {
      id: 2,
      name: 'Detail Pinjaman',
      description: 'Masukkan detail pinjaman',
      icon: CurrencyDollarIcon,
      fields: ['jumlah_pinjaman', 'tujuan_pinjaman', 'jangka_waktu', 'bunga'],
    },
    {
      id: 3,
      name: 'Upload Berkas',
      description: 'Upload dokumen pendukung',
      icon: DocumentIcon,
      fields: ['berkas'],
    },
    {
      id: 4,
      name: 'Review & Submit',
      description: 'Review data sebelum submit',
      icon: ClipboardDocumentListIcon,
      fields: [],
    },
  ];

  const currentStepConfig = steps.find(step => step.id === currentStep);
  const totalSteps = steps.length;

  const validateCurrentStep = (): boolean => {
    const stepFields = currentStepConfig?.fields || [];

    for (const field of stepFields) {
      if (field === 'nasabah_id' && !data.nasabah_id) return false;
      if (
        field === 'jumlah_pinjaman' &&
        (!data.jumlah_pinjaman || data.jumlah_pinjaman <= 0)
      )
        return false;
      if (field === 'tujuan_pinjaman' && !data.tujuan_pinjaman.trim())
        return false;
      if (field === 'berkas' && uploadedFiles.length === 0) return false;
    }

    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles([...uploadedFiles, ...files]);
      setData('berkas', [...uploadedFiles, ...files]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    setData('berkas', newFiles);
  };

  const submit: FormEventHandler = e => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('nasabah_id', data.nasabah_id);
    formData.append('jumlah_pinjaman', data.jumlah_pinjaman.toString());
    formData.append('tujuan_pinjaman', data.tujuan_pinjaman);
    formData.append('jangka_waktu', data.jangka_waktu.toString());
    formData.append('bunga', data.bunga.toString());

    uploadedFiles.forEach((file, index) => {
      formData.append(`berkas[${index}]`, file);
    });

    post(route('pinjaman.store.wizard'), {
      onSuccess: response => {
        setIsLoading(false);
        // Redirect ke halaman pinjaman dengan pesan sukses
        router.visit('/pinjaman', {
          method: 'get',
          data: {
            success:
              'Pinjaman berhasil dibuat dan sedang menunggu review dari Admin Kredit',
          },
        });
      },
      onError: () => {
        setIsLoading(false);
      },
    });
  };

  const getSelectedNasabah = () => {
    return nasabah_list.find(n => n.id.toString() === data.nasabah_id);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <TailLayout>
      <Head title="Wizard Pengajuan Pinjaman" />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Pengajuan Pinjaman
            </h1>
            <p className="mt-1 text-gray-600">
              Wizard untuk memudahkan pengajuan pinjaman baru
            </p>
          </div>
          <Link
            href={route('pinjaman.index')}
            className="flex items-center text-gray-600 transition-colors hover:text-gray-900"
          >
            <ChevronLeftIcon className="mr-2 h-5 w-5" />
            Kembali ke Daftar
          </Link>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, stepIdx) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  currentStep > step.id
                    ? 'scale-110 transform border-green-500 bg-green-500 text-white'
                    : currentStep === step.id
                      ? 'scale-110 transform border-blue-500 bg-blue-500 text-white shadow-lg'
                      : 'border-gray-300 bg-white text-gray-400'
                }`}
              >
                {currentStep > step.id ? (
                  <CheckCircleIcon className="h-6 w-6" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              {stepIdx < steps.length - 1 && (
                <div
                  className={`mx-2 h-1 w-20 transition-all duration-300 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between">
          {steps.map(step => (
            <div key={step.id} className="flex-1 text-center">
              <h3
                className={`text-sm font-medium transition-colors ${
                  currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {step.name}
              </h3>
              <p
                className={`mt-1 text-xs transition-colors ${
                  currentStep >= step.id ? 'text-gray-600' : 'text-gray-400'
                }`}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
        <form onSubmit={submit}>
          <div className="min-h-[500px] px-6 py-8">
            {/* Step 1: Pilih Nasabah */}
            {currentStep === 1 && (
              <div className="animate-slide-in-right">
                <h2 className="mb-6 text-xl font-semibold text-gray-900">
                  Pilih Nasabah
                </h2>
                <div className="space-y-4">
                  {nasabah_list.map(nasabah => (
                    <div
                      key={nasabah.id}
                      className={`cursor-pointer rounded-lg border p-4 transition-all duration-200 hover:shadow-md ${
                        data.nasabah_id === nasabah.id.toString()
                          ? 'scale-[1.02] transform border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() =>
                        setData('nasabah_id', nasabah.id.toString())
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {nasabah.nama_lengkap}
                          </h3>
                          <p className="text-sm text-gray-600">
                            NIK: {nasabah.nik || nasabah.nomor_ktp}
                          </p>
                          <p className="text-sm text-gray-600">
                            WA: {nasabah.nomor_wa}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-500">
                            Pinjaman Aktif
                          </span>
                          <p className="font-medium">
                            {nasabah.pinjaman_count || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.nasabah_id && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.nasabah_id}
                  </p>
                )}
              </div>
            )}

            {/* Step 2: Detail Pinjaman */}
            {currentStep === 2 && (
              <div className="animate-slide-in-right">
                <h2 className="mb-6 text-xl font-semibold text-gray-900">
                  Detail Pinjaman
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Jumlah Pinjaman <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">
                        Rp
                      </span>
                      <input
                        type="number"
                        value={data.jumlah_pinjaman}
                        onChange={e =>
                          setData('jumlah_pinjaman', Number(e.target.value))
                        }
                        className={`w-full rounded-lg border py-2 pl-10 pr-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                          errors.jumlah_pinjaman
                            ? 'border-red-300'
                            : 'border-gray-300'
                        }`}
                        placeholder="Masukkan jumlah pinjaman"
                      />
                    </div>
                    {errors.jumlah_pinjaman && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.jumlah_pinjaman}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Tujuan Pinjaman <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={data.tujuan_pinjaman}
                      onChange={e => setData('tujuan_pinjaman', e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                        errors.tujuan_pinjaman
                          ? 'border-red-300'
                          : 'border-gray-300'
                      }`}
                      placeholder="Jelaskan tujuan penggunaan pinjaman"
                    />
                    {errors.tujuan_pinjaman && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.tujuan_pinjaman}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Jangka Waktu (Bulan)
                      </label>
                      <select
                        value={data.jangka_waktu}
                        onChange={e =>
                          setData('jangka_waktu', Number(e.target.value))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={6}>6 Bulan</option>
                        <option value={12}>12 Bulan</option>
                        <option value={18}>18 Bulan</option>
                        <option value={24}>24 Bulan</option>
                        <option value={36}>36 Bulan</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Bunga (% per bulan)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={data.bunga}
                        onChange={e => setData('bunga', Number(e.target.value))}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Kalkulasi */}
                  {data.jumlah_pinjaman > 0 && (
                    <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <h3 className="mb-2 font-medium text-blue-900">
                        Simulasi Pembayaran
                      </h3>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700">
                            Cicilan per Bulan:
                          </span>
                          <p className="font-medium text-blue-900">
                            {formatCurrency(
                              (data.jumlah_pinjaman +
                                ((data.jumlah_pinjaman * data.bunga) / 100) *
                                  data.jangka_waktu) /
                                data.jangka_waktu
                            )}
                          </p>
                        </div>
                        <div>
                          <span className="text-blue-700">Total Bunga:</span>
                          <p className="font-medium text-blue-900">
                            {formatCurrency(
                              ((data.jumlah_pinjaman * data.bunga) / 100) *
                                data.jangka_waktu
                            )}
                          </p>
                        </div>
                        <div>
                          <span className="text-blue-700">Total Bayar:</span>
                          <p className="font-medium text-blue-900">
                            {formatCurrency(
                              data.jumlah_pinjaman +
                                ((data.jumlah_pinjaman * data.bunga) / 100) *
                                  data.jangka_waktu
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Upload Berkas */}
            {currentStep === 3 && (
              <div className="animate-slide-in-right">
                <h2 className="mb-6 text-xl font-semibold text-gray-900">
                  Upload Berkas
                </h2>
                <div className="space-y-6">
                  {/* Upload Area */}
                  <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-gray-400">
                    <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="text-base font-medium text-blue-600 hover:text-blue-500">
                          Klik untuk upload file
                        </span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={handleFileUpload}
                        />
                      </label>
                      <p className="mt-1 text-sm text-gray-500">
                        atau drag and drop
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      PDF, JPG, PNG, DOC sampai 10MB
                    </p>
                  </div>

                  {/* File List */}
                  {uploadedFiles.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-sm font-medium text-gray-900">
                        File Terupload:
                      </h3>
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                          >
                            <div className="flex items-center">
                              <DocumentIcon className="mr-3 h-5 w-5 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-600 transition-colors hover:text-red-800"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Required Documents Info */}
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                    <h3 className="mb-2 text-sm font-medium text-yellow-900">
                      Dokumen yang Diperlukan:
                    </h3>
                    <ul className="list-inside list-disc space-y-1 text-xs text-yellow-800">
                      <li>Fotocopy KTP Nasabah</li>
                      <li>Fotocopy Kartu Keluarga</li>
                      <li>Slip Gaji atau Surat Keterangan Penghasilan</li>
                      <li>Rekening Koran 3 bulan terakhir</li>
                      <li>Dokumen jaminan (jika ada)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="animate-slide-in-right">
                <h2 className="mb-6 text-xl font-semibold text-gray-900">
                  Review & Submit
                </h2>
                <div className="space-y-6">
                  {/* Nasabah Info */}
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-3 font-medium text-gray-900">
                      Informasi Nasabah
                    </h3>
                    {getSelectedNasabah() && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Nama:</span>
                          <p className="font-medium">
                            {getSelectedNasabah()?.nama_lengkap}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">NIK:</span>
                          <p className="font-medium">
                            {getSelectedNasabah()?.nik ||
                              getSelectedNasabah()?.nomor_ktp}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Alamat:</span>
                          <p className="font-medium">
                            {getSelectedNasabah()?.alamat}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">No. WA:</span>
                          <p className="font-medium">
                            {getSelectedNasabah()?.nomor_wa}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pinjaman Details */}
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-3 font-medium text-gray-900">
                      Detail Pinjaman
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Jumlah Pinjaman:</span>
                        <p className="font-medium">
                          {formatCurrency(data.jumlah_pinjaman)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Jangka Waktu:</span>
                        <p className="font-medium">{data.jangka_waktu} bulan</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Bunga:</span>
                        <p className="font-medium">{data.bunga}% per bulan</p>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          Cicilan per Bulan:
                        </span>
                        <p className="font-medium">
                          {formatCurrency(
                            (data.jumlah_pinjaman +
                              ((data.jumlah_pinjaman * data.bunga) / 100) *
                                data.jangka_waktu) /
                              data.jangka_waktu
                          )}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Tujuan Pinjaman:</span>
                        <p className="font-medium">{data.tujuan_pinjaman}</p>
                      </div>
                    </div>
                  </div>

                  {/* Files */}
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-3 font-medium text-gray-900">
                      Dokumen Terupload ({uploadedFiles.length})
                    </h3>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <DocumentIcon className="mr-2 h-4 w-4 text-gray-400" />
                          <span>{file.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeftIcon className="mr-2 h-4 w-4" />
              Previous
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Step {currentStep} of {totalSteps}
              </span>
            </div>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!validateCurrentStep()}
                className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <ChevronRightIcon className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={processing || isLoading || !validateCurrentStep()}
                className="flex items-center rounded-lg bg-green-600 px-6 py-2 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processing || isLoading ? (
                  <>
                    <svg
                      className="-ml-1 mr-3 h-4 w-4 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="mr-2 h-4 w-4" />
                    Submit Pengajuan
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Custom CSS untuk animasi */}
      <style>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.4s ease-out;
        }
      `}</style>
    </TailLayout>
  );
}
