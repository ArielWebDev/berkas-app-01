import TailLayout from '@/Layouts/TailLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface Nasabah {
  id: number;
  nama_lengkap: string;
  nik?: string;
  nomor_ktp?: string;
  nomor_wa: string;
  alamat: string;
}

interface Pinjaman {
  id: number;
  nasabah_id: number;
  nasabah: Nasabah;
  jumlah_pinjaman: number;
  tujuan_pinjaman: string;
  jangka_waktu: number;
  bunga: number;
  status: string;
  created_at: string;
}

interface EditProps extends PageProps {
  pinjaman: Pinjaman;
  nasabah_list: Nasabah[];
}

export default function Edit({ pinjaman, nasabah_list }: EditProps) {
  const { data, setData, put, processing, errors } = useForm({
    nasabah_id: pinjaman.nasabah_id.toString(),
    jumlah_pinjaman: pinjaman.jumlah_pinjaman,
    tujuan_pinjaman: pinjaman.tujuan_pinjaman,
    jangka_waktu: pinjaman.jangka_waktu,
    bunga: pinjaman.bunga,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('pinjaman.update', pinjaman.id));
  };

  return (
    <TailLayout>
      <Head title={`Edit Pinjaman #${pinjaman.id}`} />

      {/* Modern Background */}
      <TechStackBackground />

      {/* Main Content */}
      <div className="relative z-10 py-6">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Edit Pinjaman #{pinjaman.id}
                </h1>
                <p className="mt-2 text-gray-600">Ubah data pinjaman nasabah</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    pinjaman.status === 'diajukan'
                      ? 'default'
                      : pinjaman.status === 'disetujui'
                        ? 'success'
                        : pinjaman.status === 'ditolak'
                          ? 'danger'
                          : 'secondary'
                  }
                >
                  {pinjaman.status.toUpperCase()}
                </Badge>
                <Link
                  href={route('pinjaman.index')}
                  className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali
                </Link>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-6">
            {/* Status Warning */}
            {pinjaman.status !== 'diajukan' && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-800">
                        Pinjaman Tidak Dapat Diubah
                      </p>
                      <p className="text-sm text-yellow-700">
                        Pinjaman dengan status "{pinjaman.status}" tidak dapat
                        diedit. Hanya pinjaman dengan status "diajukan" yang
                        dapat diubah.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Nasabah Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informasi Nasabah
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Nasabah <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={data.nasabah_id}
                    onChange={e => setData('nasabah_id', e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                      errors.nasabah_id ? 'border-red-300' : 'border-gray-300'
                    }`}
                    disabled={pinjaman.status !== 'diajukan'}
                  >
                    <option value="">Pilih Nasabah</option>
                    {nasabah_list.map(nasabah => (
                      <option key={nasabah.id} value={nasabah.id.toString()}>
                        {nasabah.nama_lengkap} -{' '}
                        {nasabah.nik || nasabah.nomor_ktp}
                      </option>
                    ))}
                  </select>
                  {errors.nasabah_id && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.nasabah_id}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Loan Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Detail Pinjaman
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Jumlah Pinjaman */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Jumlah Pinjaman <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      value={data.jumlah_pinjaman}
                      onChange={e =>
                        setData('jumlah_pinjaman', Number(e.target.value))
                      }
                      className={`w-full rounded-lg border py-2.5 pl-10 pr-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                        errors.jumlah_pinjaman
                          ? 'border-red-300'
                          : 'border-gray-300'
                      }`}
                      placeholder="Masukkan jumlah pinjaman"
                      disabled={pinjaman.status !== 'diajukan'}
                    />
                  </div>
                  {errors.jumlah_pinjaman && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.jumlah_pinjaman}
                    </p>
                  )}
                </div>

                {/* Tujuan Pinjaman */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Tujuan Pinjaman <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <textarea
                      rows={4}
                      value={data.tujuan_pinjaman}
                      onChange={e => setData('tujuan_pinjaman', e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2.5 pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                        errors.tujuan_pinjaman
                          ? 'border-red-300'
                          : 'border-gray-300'
                      }`}
                      placeholder="Jelaskan tujuan penggunaan pinjaman"
                      disabled={pinjaman.status !== 'diajukan'}
                    />
                  </div>
                  {errors.tujuan_pinjaman && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.tujuan_pinjaman}
                    </p>
                  )}
                </div>

                {/* Jangka Waktu dan Bunga */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Jangka Waktu (Bulan)
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <select
                        value={data.jangka_waktu}
                        onChange={e =>
                          setData('jangka_waktu', Number(e.target.value))
                        }
                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        disabled={pinjaman.status !== 'diajukan'}
                      >
                        <option value={6}>6 Bulan</option>
                        <option value={12}>12 Bulan</option>
                        <option value={18}>18 Bulan</option>
                        <option value={24}>24 Bulan</option>
                        <option value={36}>36 Bulan</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Bunga (% per bulan)
                    </label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        step="0.1"
                        value={data.bunga}
                        onChange={e => setData('bunga', Number(e.target.value))}
                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        disabled={pinjaman.status !== 'diajukan'}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Simulasi Pembayaran */}
            {data.jumlah_pinjaman > 0 && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Calculator className="h-5 w-5" />
                    Simulasi Pembayaran
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg bg-white p-4">
                      <div className="text-sm text-blue-700">
                        Cicilan per Bulan
                      </div>
                      <div className="text-lg font-bold text-blue-900">
                        {formatCurrency(
                          (data.jumlah_pinjaman +
                            ((data.jumlah_pinjaman * data.bunga) / 100) *
                              data.jangka_waktu) /
                            data.jangka_waktu
                        )}
                      </div>
                    </div>
                    <div className="rounded-lg bg-white p-4">
                      <div className="text-sm text-blue-700">Total Bunga</div>
                      <div className="text-lg font-bold text-blue-900">
                        {formatCurrency(
                          ((data.jumlah_pinjaman * data.bunga) / 100) *
                            data.jangka_waktu
                        )}
                      </div>
                    </div>
                    <div className="rounded-lg bg-white p-4">
                      <div className="text-sm text-blue-700">Total Bayar</div>
                      <div className="text-lg font-bold text-blue-900">
                        {formatCurrency(
                          data.jumlah_pinjaman +
                            ((data.jumlah_pinjaman * data.bunga) / 100) *
                              data.jangka_waktu
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <Link
                    href={route('pinjaman.show', pinjaman.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Lihat Detail Lengkap
                  </Link>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.visit(route('pinjaman.index'))}
                    >
                      Batal
                    </Button>
                    {pinjaman.status === 'diajukan' && (
                      <Button
                        type="submit"
                        disabled={processing}
                        className="min-w-[120px]"
                      >
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </TailLayout>
  );
}
