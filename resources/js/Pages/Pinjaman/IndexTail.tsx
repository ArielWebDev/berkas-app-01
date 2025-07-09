import TailLayout from '@/Layouts/TailLayout';
import {
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Pinjaman {
  id: number;
  nasabah: {
    nama_lengkap: string;
    nik: string;
  };
  jumlah_pinjaman: number;
  status: string;
  staf_input?: {
    name: string;
  };
  admin_kredit?: {
    name: string;
  };
  analis?: {
    name: string;
  };
  pemutus?: {
    name: string;
  };
  created_at: string;
  catatan?: string;
}

interface Props {
  pinjaman: {
    data: Pinjaman[];
    links: any[];
    meta: {
      current_page: number;
      last_page: number;
      total: number;
      per_page: number;
    };
  };
  search?: string;
  status?: string;
  auth: {
    user: {
      id: number;
      name: string;
      role: string;
    };
  };
}

export default function PinjamanIndex({
  pinjaman,
  search = '',
  status = '',
  auth,
}: Props) {
  const [searchTerm, setSearchTerm] = useState(search);
  const [statusFilter, setStatusFilter] = useState(status);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPinjaman, setSelectedPinjaman] = useState<Pinjaman | null>(
    null
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(
      '/pinjaman',
      { search: searchTerm, status: statusFilter },
      { preserveState: true }
    );
  };

  const handleStatusFilter = (newStatus: string) => {
    setStatusFilter(newStatus);
    router.get(
      '/pinjaman',
      { search: searchTerm, status: newStatus },
      { preserveState: true }
    );
  };

  const handleDelete = (pinjamanItem: Pinjaman) => {
    setSelectedPinjaman(pinjamanItem);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedPinjaman) {
      router.delete(`/pinjaman/${selectedPinjaman.id}`, {
        onSuccess: () => {
          setShowDeleteModal(false);
          setSelectedPinjaman(null);
        },
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      diajukan: 'bg-blue-100 text-blue-800',
      diperiksa: 'bg-yellow-100 text-yellow-800',
      dikembalikan: 'bg-red-100 text-red-800',
      dianalisis: 'bg-purple-100 text-purple-800',
      siap_diputuskan: 'bg-indigo-100 text-indigo-800',
      disetujui: 'bg-green-100 text-green-800',
      ditolak: 'bg-red-100 text-red-800',
    };

    const statusLabels = {
      diajukan: 'Diajukan',
      diperiksa: 'Diperiksa',
      dikembalikan: 'Dikembalikan',
      dianalisis: 'Dianalisis',
      siap_diputuskan: 'Siap Diputuskan',
      disetujui: 'Disetujui',
      ditolak: 'Ditolak',
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          statusClasses[status as keyof typeof statusClasses] ||
          'bg-gray-100 text-gray-800'
        }`}
      >
        {statusLabels[status as keyof typeof statusLabels] || status}
      </span>
    );
  };

  const getStatusStats = () => {
    const stats = {
      total: pinjaman?.meta?.total || 0,
      diajukan: 0,
      disetujui: 0,
      ditolak: 0,
      proses: 0,
    };

    pinjaman?.data?.forEach(item => {
      if (item.status === 'diajukan') stats.diajukan++;
      else if (item.status === 'disetujui') stats.disetujui++;
      else if (item.status === 'ditolak') stats.ditolak++;
      else stats.proses++;
    });

    return stats;
  };

  const stats = getStatusStats();

  const canEdit = (pinjamanItem: Pinjaman) => {
    const userRole = auth.user.role;
    const status = pinjamanItem.status;

    if (userRole === 'admin') return true;
    if (userRole === 'staf_input' && status === 'diajukan') return true;
    if (userRole === 'admin_kredit' && status === 'diperiksa') return true;
    if (userRole === 'analis' && status === 'dianalisis') return true;
    if (userRole === 'pemutus' && status === 'siap_diputuskan') return true;

    return false;
  };

  return (
    <TailLayout>
      <Head title="Data Pinjaman" />

      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Pinjaman</h1>
            <p className="mt-2 text-gray-600">
              Kelola pinjaman nasabah berdasarkan workflow
            </p>
          </div>
          {auth.user.role === 'staf_input' && (
            <Link
              href="/pinjaman/create"
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              Tambah Pinjaman
            </Link>
          )}
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Pinjaman
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Diajukan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.diajukan}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Disetujui</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.disetujui}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Ditolak</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.ditolak}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <form onSubmit={handleSearch} className="flex w-full max-w-md gap-2">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Cari nama nasabah, NIK..."
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              Cari
            </button>
          </form>

          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusFilter('')}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                statusFilter === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => handleStatusFilter('diajukan')}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                statusFilter === 'diajukan'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Diajukan
            </button>
            <button
              onClick={() => handleStatusFilter('disetujui')}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                statusFilter === 'disetujui'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Disetujui
            </button>
            <button
              onClick={() => handleStatusFilter('ditolak')}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                statusFilter === 'ditolak'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Ditolak
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Nasabah
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Jumlah Pinjaman
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Penanggung Jawab
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tanggal Pengajuan
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {pinjaman?.data && pinjaman.data.length > 0 ? (
                  pinjaman.data.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.nasabah?.nama_lengkap || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          NIK: {item.nasabah?.nik || 'N/A'}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {formatCurrency(item.jumlah_pinjaman)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {item.staf_input?.name ||
                          item.admin_kredit?.name ||
                          item.analis?.name ||
                          item.pemutus?.name ||
                          '-'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/pinjaman/${item.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </Link>
                          {canEdit(item) && (
                            <Link
                              href={`/pinjaman/${item.id}/edit`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </Link>
                          )}
                          {(auth.user.role === 'admin' ||
                            auth.user.role === 'staf_input') && (
                            <button
                              onClick={() => handleDelete(item)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Belum ada data pinjaman
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pinjaman?.meta?.last_page > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Menampilkan{' '}
              {(pinjaman.meta.current_page - 1) * pinjaman.meta.per_page + 1} -{' '}
              {Math.min(
                pinjaman.meta.current_page * pinjaman.meta.per_page,
                pinjaman.meta.total
              )}{' '}
              dari {pinjaman.meta.total} data
            </div>
            <div className="flex space-x-1">
              {pinjaman.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url || '#'}
                  className={`px-3 py-2 text-sm ${
                    link.active
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-500 hover:bg-gray-100'
                  } border border-gray-300 ${
                    index === 0 ? 'rounded-l-lg' : ''
                  } ${
                    index === pinjaman.links.length - 1 ? 'rounded-r-lg' : ''
                  }`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="text-lg font-medium text-gray-900">
              Hapus Pinjaman
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Apakah Anda yakin ingin menghapus pinjaman untuk nasabah{' '}
              <strong>{selectedPinjaman?.nasabah?.nama_lengkap}</strong>?
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </TailLayout>
  );
}
