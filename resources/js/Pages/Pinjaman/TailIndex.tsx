import TailLayout from '@/Layouts/TailLayout';
import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Search, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

interface Nasabah {
  id: number;
  nama_lengkap: string;
  nama?: string;
  nik?: string;
  nomor_ktp: string;
  nomor_wa: string;
  alamat: string;
}

interface Pinjaman {
  id: number;
  nasabah_id: number;
  nasabah: Nasabah;
  jumlah_pinjaman: number;
  tujuan_pinjaman?: string;
  jangka_waktu?: number;
  bunga?: number;
  status: string;
  staf_input?: { name: string };
  admin_kredit?: { name: string };
  analis?: { name: string };
  pemutus?: { name: string };
  created_at: string;
  updated_at: string;
}

interface PinjamanIndexProps extends PageProps {
  pinjaman: {
    data: Pinjaman[];
    links?: Array<{
      url?: string;
      label: string;
      active: boolean;
    }>;
    meta?: {
      current_page?: number;
      last_page?: number;
      per_page?: number;
      total?: number;
    };
  };
  filters: {
    search?: string;
    status?: string;
    available?: string;
    my_tasks?: string;
  };
  metadata?: {
    available_count?: number;
    my_tasks_count?: number;
    can_take_tasks?: boolean;
  };
}

const PinjamanIndex: React.FC<PinjamanIndexProps> = ({
  auth,
  pinjaman,
  filters,
  metadata,
}) => {
  const [search, setSearch] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null as number | null,
  });

  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'diajukan', label: 'Diajukan' },
    { value: 'diperiksa', label: 'Diperiksa' },
    { value: 'dikembalikan', label: 'Dikembalikan' },
    { value: 'dianalisis', label: 'Dianalisis' },
    { value: 'siap_diputuskan', label: 'Siap Diputuskan' },
    { value: 'disetujui', label: 'Disetujui' },
    { value: 'ditolak', label: 'Ditolak' },
  ];

  const handleSearch = (): void => {
    router.get(
      '/pinjaman',
      {
        search,
        status: statusFilter,
      },
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };

  const handleReset = (): void => {
    setSearch('');
    setStatusFilter('');
    router.get(
      '/pinjaman',
      {},
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };

  const handleView = (id: number) => {
    router.visit(`/pinjaman/${id}`);
  };

  const handleEdit = (id: number) => {
    router.visit(`/pinjaman/${id}/edit`);
  };

  const handleDelete = (id: number): void => {
    router.delete(`/pinjaman/${id}`, {
      onSuccess: () => {
        setDeleteDialog({ open: false, id: null });
      },
      onError: () => {
        setDeleteDialog({ open: false, id: null });
      },
    });
  };

  const handleApprove = (id: number) => {
    router.post(
      `/pinjaman/${id}/workflow-action`,
      { action: 'advance' },
      {
        onSuccess: () => {
          router.reload();
        },
      }
    );
  };

  const handleReject = (id: number) => {
    const reason = prompt('Alasan penolakan:');
    if (reason) {
      router.post(
        `/pinjaman/${id}/workflow-action`,
        { action: 'return', catatan: reason },
        {
          onSuccess: () => {
            router.reload();
          },
        }
      );
    }
  };

  const handleTakeTask = (id: number) => {
    router.post(
      `/pinjaman/${id}/workflow-action`,
      { action: 'take' },
      {
        onSuccess: () => {
          router.reload();
        },
      }
    );
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'create_pinjaman':
        router.visit('/pinjaman/create/wizard');
        break;
      case 'review_berkas':
        router.visit('/pinjaman?status=diajukan&available=true');
        break;
      case 'analisa_kredit':
        router.visit('/pinjaman?status=dianalisis&available=true');
        break;
      case 'keputusan_kredit':
        router.visit('/pinjaman?status=siap_diputuskan&available=true');
        break;
      case 'my_tasks':
        router.visit('/pinjaman?my_tasks=true');
        break;
      case 'available_tasks':
        router.visit('/pinjaman?available=true');
        break;
      default:
        router.visit('/pinjaman');
    }
  };

  const canCreatePinjaman = auth.user.role === 'staf_input';

  return (
    <TailLayout>
      <Head title="Daftar Pinjaman" />

      {/* Modern Background */}
      <TechStackBackground />

      {/* Main Content */}
      <div className="relative z-10 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Data Pinjaman
                </h1>
                <p className="mt-2 text-gray-600">
                  Kelola semua data pinjaman berdasarkan role Anda
                </p>
              </div>
              <div className="flex gap-3">
                <Badge variant="outline" className="text-sm">
                  Role: {auth.user.role.replace('_', ' ').toUpperCase()}
                </Badge>
                {canCreatePinjaman && (
                  <Button
                    onClick={() => router.visit('/pinjaman/create')}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Buat Pinjaman
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Sidebar with Quick Actions, Workflow Progress and Filters */}
            <div className="space-y-6 lg:col-span-1">
              {/* Quick Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Statistik
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-blue-50 p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {pinjaman.data.length}
                      </div>
                      <div className="text-xs text-gray-600">Total</div>
                    </div>
                    <div className="rounded-lg bg-green-50 p-3 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {metadata?.available_count ||
                          pinjaman.data.filter(p => p.status === 'disetujui')
                            .length}
                      </div>
                      <div className="text-xs text-gray-600">
                        {metadata?.can_take_tasks ? 'Tersedia' : 'Disetujui'}
                      </div>
                    </div>
                    <div className="rounded-lg bg-yellow-50 p-3 text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {metadata?.my_tasks_count ||
                          pinjaman.data.filter(p =>
                            [
                              'diajukan',
                              'diperiksa',
                              'dianalisis',
                              'siap_diputuskan',
                            ].includes(p.status)
                          ).length}
                      </div>
                      <div className="text-xs text-gray-600">
                        {metadata?.can_take_tasks ? 'Tugas Saya' : 'Proses'}
                      </div>
                    </div>
                    <div className="rounded-lg bg-red-50 p-3 text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {
                          pinjaman.data.filter(p => p.status === 'ditolak')
                            .length
                        }
                      </div>
                      <div className="text-xs text-gray-600">Ditolak</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <QuickActions
                userRole={auth.user.role}
                onAction={handleQuickAction}
              />

              {/* Sample Workflow Progress for Latest Pinjaman */}
              {pinjaman.data.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Progress Terbaru
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Workflow untuk pinjaman terbaru
                    </p>
                  </CardHeader>
                  <CardContent>
                    <WorkflowProgress
                      currentStatus={pinjaman.data[0].status}
                      assignedUsers={{
                        staf_input: pinjaman.data[0].staf_input,
                        admin_kredit: pinjaman.data[0].admin_kredit,
                        analis: pinjaman.data[0].analis,
                        pemutus: pinjaman.data[0].pemutus,
                      }}
                      userRole={auth.user.role}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Search & Filter */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Pencarian & Filter
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Cari Nasabah
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Nama nasabah..."
                        className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleSearch}
                      className="flex-1"
                      variant="primary"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Cari
                    </Button>
                    <Button onClick={handleReset} variant="secondary">
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Nasabah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Jumlah Pinjaman
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Tujuan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Jangka Waktu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {pinjaman?.data?.length > 0 ? (
                pinjaman.data.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      #{item.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.nasabah?.nama_lengkap ||
                          item.nasabah?.nama ||
                          'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        NIK:{' '}
                        {item.nasabah?.nik || item.nasabah?.nomor_ktp || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        WA: {item.nasabah?.nomor_wa || 'N/A'}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(item.jumlah_pinjaman)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {item.tujuan_pinjaman}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {item.jangka_waktu} bulan
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/pinjaman/${item.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/pinjaman/${item.id}/edit`}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() =>
                            setDeleteDialog({ open: true, id: item.id })
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    Tidak ada data pinjaman yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

              {/* Pagination */}
              {pinjaman.links && pinjaman.links.length > 3 && (
                <Card className="mt-6">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        {pinjaman?.meta ? (
                          <>
                            Menampilkan{' '}
                            <span className="font-medium">
                              {((pinjaman.meta.current_page ?? 1) - 1) *
                                (pinjaman.meta.per_page ?? 10) +
                                1}
                            </span>{' '}
                            sampai{' '}
                            <span className="font-medium">
                              {Math.min(
                                (pinjaman.meta.current_page ?? 1) *
                                  (pinjaman.meta.per_page ?? 10),
                                pinjaman.meta.total ?? 0
                              )}
                            </span>{' '}
                            dari{' '}
                            <span className="font-medium">
                              {pinjaman.meta.total ?? 0}
                            </span>{' '}
                            data
                          </>
                        ) : (
                          'Memuat data...'
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {pinjaman.links.map((link, index) => (
                          <button
                            key={index}
                            onClick={() => link.url && router.visit(link.url)}
                            disabled={!link.url}
                            className={`rounded-md px-3 py-2 text-sm transition-colors ${
                              link.active
                                ? 'bg-blue-600 text-white'
                                : link.url
                                  ? 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                                  : 'cursor-not-allowed text-gray-400'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteDialog.open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Konfirmasi Hapus
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Apakah Anda yakin ingin menghapus pinjaman ini? Tindakan
                        ini tidak dapat dibatalkan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <Button
                  onClick={() =>
                    deleteDialog.id && handleDelete(deleteDialog.id)
                  }
                  variant="danger"
                  className="w-full sm:ml-3 sm:w-auto"
                >
                  Hapus
                </Button>
                <Button
                  onClick={() => setDeleteDialog({ open: false, id: null })}
                  variant="secondary"
                  className="mt-3 w-full sm:mt-0 sm:w-auto"
                >
                  Batal
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </TailLayout>
  );
};

export default PinjamanIndex;
