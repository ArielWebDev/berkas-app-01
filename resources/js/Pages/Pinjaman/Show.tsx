import TechStackBackground from '@/Components/TechStackBackground';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import TailLayout from '@/Layouts/TailLayout';
import { PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileText,
  MapPin,
  Phone,
  Trash2,
  User,
  Users,
} from 'lucide-react';

interface ShowPinjamanProps extends PageProps {
  pinjaman: {
    id: number;
    status: string;
    jumlah_pinjaman: number;
    catatan: string | null;
    locked_at: string | null;
    created_at: string;
    nasabah: {
      nama_lengkap: string;
      nomor_ktp: string;
      alamat: string;
      nomor_wa: string;
    };
    staf_input: { name: string };
    admin_kredit?: { name: string };
    analis?: { name: string };
    pemutus?: { name: string };
    berkas_pinjaman: Array<{
      id: number;
      nama_berkas: string;
      path_file: string;
      diupload_oleh_role: string;
      created_at: string;
    }>;
    log_pinjaman: Array<{
      id: number;
      aksi: string;
      deskripsi: string;
      created_at: string;
      user: { name: string };
    }>;
  };
}

export default function ShowPinjaman({ pinjaman }: ShowPinjamanProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusVariant = (status: string) => {
    const variants = {
      diajukan: 'default' as const,
      diperiksa: 'secondary' as const,
      dikembalikan: 'danger' as const,
      dianalisis: 'secondary' as const,
      siap_diputuskan: 'secondary' as const,
      disetujui: 'success' as const,
      ditolak: 'danger' as const,
    };
    return variants[status as keyof typeof variants] || ('secondary' as const);
  };

  return (
    <TailLayout>
      <Head title={`Pinjaman #${pinjaman.id}`} />

      {/* Modern Background */}
      <TechStackBackground />

      {/* Main Content */}
      <div className="relative z-10 py-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Detail Pinjaman #{pinjaman.id}
                </h1>
                <p className="mt-2 text-gray-600">
                  Informasi lengkap pinjaman nasabah
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={getStatusVariant(pinjaman.status)}>
                  {pinjaman.status.toUpperCase()}
                </Badge>
                <Button
                  variant="outline"
                  onClick={() => router.visit('/pinjaman')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Main Information */}
            <div className="space-y-6 lg:col-span-2">
              {/* Workflow Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Progress Workflow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Status
                        </label>
                        <p className="text-lg font-semibold text-gray-900">
                          {pinjaman.status.toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Staf Input
                        </label>
                        <p className="text-gray-900">
                          {pinjaman.staf_input.name}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Admin Kredit
                        </label>
                        <p className="text-gray-900">
                          {pinjaman.admin_kredit?.name || 'Belum ditentukan'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Analis
                        </label>
                        <p className="text-gray-900">
                          {pinjaman.analis?.name || 'Belum ditentukan'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Pemutus
                        </label>
                        <p className="text-gray-900">
                          {pinjaman.pemutus?.name || 'Belum ditentukan'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informasi Nasabah */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informasi Nasabah
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Nama Lengkap
                        </label>
                        <p className="text-lg font-semibold text-gray-900">
                          {pinjaman.nasabah.nama_lengkap}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Nomor KTP
                        </label>
                        <p className="text-gray-900">
                          {pinjaman.nasabah.nomor_ktp}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                          <Phone className="h-4 w-4" />
                          Nomor WhatsApp
                        </label>
                        <p className="text-gray-900">
                          {pinjaman.nasabah.nomor_wa}
                        </p>
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                          <MapPin className="h-4 w-4" />
                          Alamat
                        </label>
                        <p className="text-gray-900">
                          {pinjaman.nasabah.alamat}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informasi Pinjaman */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Informasi Pinjaman
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="rounded-lg bg-green-50 p-4">
                        <label className="text-sm font-medium text-green-700">
                          Jumlah Pinjaman
                        </label>
                        <p className="text-2xl font-bold text-green-900">
                          {formatCurrency(pinjaman.jumlah_pinjaman)}
                        </p>
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                          <Calendar className="h-4 w-4" />
                          Tanggal Pengajuan
                        </label>
                        <p className="text-gray-900">
                          {new Date(pinjaman.created_at).toLocaleDateString(
                            'id-ID',
                            {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Staf Input
                        </label>
                        <p className="text-gray-900">
                          {pinjaman.staf_input.name}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Admin Kredit
                        </label>
                        <p className="text-gray-900">
                          {pinjaman.admin_kredit?.name || 'Belum ditentukan'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Analis
                        </label>
                        <p className="text-gray-900">
                          {pinjaman.analis?.name || 'Belum ditentukan'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Pemutus
                        </label>
                        <p className="text-gray-900">
                          {pinjaman.pemutus?.name || 'Belum ditentukan'}
                        </p>
                      </div>
                    </div>
                  </div>
                  {pinjaman.catatan && (
                    <div className="mt-6 rounded-lg bg-gray-50 p-4">
                      <label className="text-sm font-medium text-gray-500">
                        Catatan
                      </label>
                      <p className="mt-1 text-gray-900">{pinjaman.catatan}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Berkas Pinjaman */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Berkas Pinjaman
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pinjaman.berkas_pinjaman.length > 0 ? (
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Nama Berkas
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Diupload Oleh
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Tanggal Upload
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {pinjaman.berkas_pinjaman.map(berkas => (
                            <tr key={berkas.id} className="hover:bg-gray-50">
                              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                {berkas.nama_berkas}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                <Badge variant="outline">
                                  {berkas.diupload_oleh_role
                                    .replace('_', ' ')
                                    .toUpperCase()}
                                </Badge>
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                {new Date(berkas.created_at).toLocaleDateString(
                                  'id-ID'
                                )}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      window.open(
                                        `/pinjaman/berkas/${berkas.id}/view`,
                                        '_blank'
                                      )
                                    }
                                    className="flex items-center gap-1"
                                  >
                                    <Eye className="h-3 w-3" />
                                    View
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      window.open(
                                        `/pinjaman/berkas/${berkas.id}/download`
                                      )
                                    }
                                    className="flex items-center gap-1"
                                  >
                                    <Download className="h-3 w-3" />
                                    Download
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => {
                                      if (
                                        confirm(
                                          'Yakin ingin menghapus berkas ini?'
                                        )
                                      ) {
                                        router.delete(
                                          `/pinjaman/berkas/${berkas.id}`
                                        );
                                      }
                                    }}
                                    className="flex items-center gap-1"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-gray-500">
                      <FileText className="mx-auto mb-2 h-8 w-8" />
                      <p>Belum ada berkas yang diupload</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Log Activities */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Log Aktivitas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pinjaman.log_pinjaman.map((log, logIdx) => (
                      <div key={log.id} className="relative">
                        {logIdx !== pinjaman.log_pinjaman.length - 1 && (
                          <span
                            className="absolute left-4 top-8 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex items-start space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                            <span className="text-xs font-bold text-blue-600">
                              {logIdx + 1}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm">
                              <span className="font-medium text-gray-900">
                                {log.aksi}
                              </span>
                              <span className="text-gray-500"> oleh </span>
                              <span className="font-medium text-gray-900">
                                {log.user.name}
                              </span>
                            </div>
                            {log.deskripsi && (
                              <p className="mt-1 text-sm text-gray-500">
                                {log.deskripsi}
                              </p>
                            )}
                            <div className="mt-1 text-xs text-gray-400">
                              {new Date(log.created_at).toLocaleDateString(
                                'id-ID'
                              )}{' '}
                              {new Date(log.created_at).toLocaleTimeString(
                                'id-ID',
                                {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => router.visit('/dashboard')}
              variant="outline"
              className="min-w-[120px]"
            >
              Kembali ke Dashboard
            </Button>
          </div>
        </div>
      </div>
    </TailLayout>
  );
}
