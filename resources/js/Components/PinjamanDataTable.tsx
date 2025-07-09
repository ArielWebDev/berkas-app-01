import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Eye, Edit, Trash2, Plus, Search, Lock, Unlock, UserCheck, Clock } from 'lucide-react';
import WorkflowStepIndicator from './WorkflowStepIndicator';

interface Nasabah {
  id: number;
  nama_lengkap: string;
  nik?: string;
  nomor_ktp?: string;
  nomor_wa: string;
  alamat: string;
}

interface User {
  id: number;
  name: string;
  role?: string;
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
  staf_input?: User;
  admin_kredit?: User;
  analis?: User;
  pemutus?: User;
  created_at: string;
  updated_at: string;
}

interface PinjamanDataTableProps {
  data: Pinjaman[];
  canCreate?: boolean;
  onDelete?: (id: number) => void;
  currentUserRole?: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      diajukan: 'bg-blue-100 text-blue-800',
      diperiksa: 'bg-yellow-100 text-yellow-800',
      dikembalikan: 'bg-red-100 text-red-800',
      dianalisis: 'bg-purple-100 text-purple-800',
      siap_diputuskan: 'bg-indigo-100 text-indigo-800',
      disetujui: 'bg-green-100 text-green-800',
      ditolak: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const statusTexts: Record<string, string> = {
      diajukan: 'Diajukan',
      diperiksa: 'Diperiksa',
      dikembalikan: 'Dikembalikan',
      dianalisis: 'Dianalisis',
      siap_diputuskan: 'Siap Diputuskan',
      disetujui: 'Disetujui',
      ditolak: 'Ditolak',
    };
    return statusTexts[status] || status.toUpperCase();
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(status)}`}
    >
      {getStatusText(status)}
    </span>
  );
};

const PinjamanDataTable: React.FC<PinjamanDataTableProps> = ({
  data,
  canCreate = false,
  onDelete,
  currentUserRole,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState<keyof Pinjaman>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Filter and sort data
  const filteredData = data
    .filter(item => {
      const matchesSearch = 
        item.nasabah?.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
        item.nasabah?.nik?.includes(search) ||
        item.nasabah?.nomor_ktp?.includes(search) ||
        item.id.toString().includes(search);
      
      const matchesStatus = statusFilter === '' || item.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'nasabah') {
        aValue = a.nasabah?.nama_lengkap || '';
        bValue = b.nasabah?.nama_lengkap || '';
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

  const handleSort = (field: keyof Pinjaman) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearch = () => {
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

  const handleReset = () => {
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

  const handleTakePinjaman = (pinjamanId: number) => {
    router.post(`/workflow/take/${pinjamanId}`, {
      catatan: 'Berkas diambil untuk diproses'
    }, {
      preserveState: false,
      preserveScroll: true,
      onSuccess: (page) => {
        // Force refresh the page to get updated data
        window.location.reload();
      },
      onError: (errors) => {
        console.error('Error taking pinjaman:', errors);
        alert('Gagal mengambil berkas: ' + (errors.message || 'Terjadi kesalahan'));
      }
    });
  };

  const getAvailabilityStatus = (item: Pinjaman) => {
    // Determine if pinjaman can be taken based on status and role
    if (!currentUserRole) return null;

    switch (item.status) {
      case 'diajukan':
        if (currentUserRole === 'admin_kredit') {
          return !item.admin_kredit ? 'available' : 'locked';
        }
        break;
      case 'diperiksa':
        if (currentUserRole === 'admin_kredit' && item.admin_kredit) {
          return 'working';
        }
        break;
      case 'dianalisis':
        if (currentUserRole === 'analis') {
          return !item.analis ? 'available' : 'locked';
        }
        break;
      case 'siap_diputuskan':
        if (currentUserRole === 'pemutus') {
          return !item.pemutus ? 'available' : 'locked';
        }
        break;
      case 'dikembalikan':
        if (currentUserRole === 'staf_input') {
          return 'need_action';
        }
        break;
    }
    return null;
  };

  const renderAvailabilityIndicator = (item: Pinjaman) => {
    const availability = getAvailabilityStatus(item);
    
    switch (availability) {
      case 'available':
        return (
          <div className="flex items-center">
            <Unlock className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-sm text-green-600 font-medium">Tersedia Diambil</span>
          </div>
        );
      case 'locked':
        const handler = item.admin_kredit || item.analis || item.pemutus;
        return (
          <div className="flex items-center">
            <Lock className="h-4 w-4 text-red-500 mr-2" />
            <div className="flex flex-col">
              <span className="text-sm text-red-600 font-medium">Dikerjakan</span>
              {handler && (
                <span className="text-xs text-gray-500">oleh {handler.name}</span>
              )}
            </div>
          </div>
        );
      case 'working':
        return (
          <div className="flex items-center">
            <UserCheck className="h-4 w-4 text-blue-500 mr-2" />
            <span className="text-sm text-blue-600 font-medium">Sedang Dikerjakan</span>
          </div>
        );
      case 'need_action':
        return (
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-orange-500 mr-2" />
            <span className="text-sm text-orange-600 font-medium">Perlu Tindakan</span>
          </div>
        );
      default:
        return (
          <span className="text-sm text-gray-500">-</span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Pinjaman</h1>
          <p className="text-gray-600">Kelola semua pengajuan pinjaman nasabah</p>
        </div>
        {canCreate && (
          <Link
            href="/pinjaman/create/wizard-new"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Buat Pengajuan Baru
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari nasabah, NIK, atau ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleSearch}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Search className="mr-2 h-4 w-4" />
              Cari
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                  onClick={() => handleSort('id')}
                >
                  ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                  onClick={() => handleSort('nasabah' as keyof Pinjaman)}
                >
                  Nasabah {sortField === 'nasabah' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                  onClick={() => handleSort('jumlah_pinjaman')}
                >
                  Jumlah {sortField === 'jumlah_pinjaman' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Tujuan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ketersediaan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Jangka Waktu
                </th>
                <th 
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                  onClick={() => handleSort('created_at')}
                >
                  Tanggal {sortField === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredData.length > 0 ? (
                filteredData.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      #{item.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.nasabah?.nama_lengkap || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        NIK: {item.nasabah?.nik || item.nasabah?.nomor_ktp || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        WA: {item.nasabah?.nomor_wa || 'N/A'}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(item.jumlah_pinjaman)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate">
                        {item.tujuan_pinjaman || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <WorkflowStepIndicator currentStatus={item.status} />
                    </td>
                    <td className="px-6 py-4">
                      {renderAvailabilityIndicator(item)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {item.jangka_waktu ? `${item.jangka_waktu} bulan` : 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {/* Take/Ambil Berkas Button */}
                        {getAvailabilityStatus(item) === 'available' && (
                          <button
                            onClick={() => handleTakePinjaman(item.id)}
                            className="inline-flex items-center px-3 py-1 border border-green-300 rounded-md text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                            title="Ambil Berkas"
                          >
                            <UserCheck className="h-3 w-3 mr-1" />
                            Ambil
                          </button>
                        )}
                        
                        {/* View Button */}
                        <Link
                          href={`/pinjaman/${item.id}`}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        
                        {/* Edit Button - only for certain roles and statuses */}
                        {(currentUserRole === 'staf_input' || currentUserRole === 'admin') && (
                          <Link
                            href={`/pinjaman/${item.id}/edit`}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                        )}
                        
                        {/* Delete Button - only for diajukan status and authorized roles */}
                        {item.status === 'diajukan' && (currentUserRole === 'staf_input' || currentUserRole === 'admin') && onDelete && (
                          <button
                            onClick={() => onDelete(item.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center">
                      <Search className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada data</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Tidak ada pinjaman yang sesuai dengan filter yang dipilih.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info */}
      <div className="text-sm text-gray-500">
        Menampilkan {filteredData.length} dari {data.length} pinjaman
      </div>
    </div>
  );
};

export default PinjamanDataTable;
