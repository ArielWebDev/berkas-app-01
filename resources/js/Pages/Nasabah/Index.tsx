import TailLayout from '@/Layouts/TailLayout';
import { Nasabah } from '@/types';
import {
  EyeIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
  nasabah: {
    data: Nasabah[];
    links: any[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
  search?: string;
}

export default function Index({ nasabah, search }: Props) {
  const [searchQuery, setSearchQuery] = useState(search || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/nasabah', { search: searchQuery }, { preserveState: true });
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus data nasabah ini?')) {
      router.delete(`/nasabah/${id}`);
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

  const getGenderText = (gender?: string) => {
    return gender === 'L' ? 'Laki-laki' : gender === 'P' ? 'Perempuan' : '-';
  };

  const getStatusPerkawinanText = (status?: string) => {
    switch (status) {
      case 'belum_menikah':
        return 'Belum Menikah';
      case 'menikah':
        return 'Menikah';
      case 'cerai_hidup':
        return 'Cerai Hidup';
      case 'cerai_mati':
        return 'Cerai Mati';
      default:
        return '-';
    }
  };

  return (
    <TailLayout>
      <Head title="Data Nasabah" />

      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Data Nasabah</h1>
            <p className="mt-1 text-sm text-gray-600">
              Kelola data nasabah dan informasi pribadi
            </p>
          </div>
          <Link
            href="/nasabah/create"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Tambah Nasabah
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="max-w-md">
            <div className="flex rounded-lg shadow-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari nama, NIK, alamat, atau nomor WA..."
                className="block w-full rounded-l-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <button
                type="submit"
                className="inline-flex items-center rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                Cari
              </button>
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Nasabah
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    NIK
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Kontak
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Info Personal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Pinjaman
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {nasabah.data.length > 0 ? (
                  nasabah.data.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                            <UserIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.nama_lengkap}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.pekerjaan || 'Pekerjaan tidak diisi'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{item.nik}</div>
                        <div className="text-sm text-gray-500">
                          {getGenderText(item.jenis_kelamin)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {item.nomor_wa}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.alamat.length > 30
                            ? `${item.alamat.substring(0, 30)}...`
                            : item.alamat}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {getStatusPerkawinanText(item.status_perkawinan)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.agama || '-'}
                        </div>
                        {item.penghasilan && (
                          <div className="text-sm text-gray-500">
                            {formatCurrency(item.penghasilan)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          {item.pinjaman_count || 0} pinjaman
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Link
                            href={`/nasabah/${item.id}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Lihat Detail"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/nasabah/${item.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Hapus"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
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
                      Belum ada data nasabah
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        {nasabah.data.length > 0 && (
          <div className="mt-4 text-sm text-gray-700">
            Menampilkan {nasabah.data.length} dari {nasabah.meta.total} data
            nasabah
          </div>
        )}
      </div>
    </TailLayout>
  );
}
