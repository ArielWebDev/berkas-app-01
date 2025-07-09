import QuickActions from '@/Components/QuickActions';
import RoleBasedPinjamanTable from '@/Components/RoleBasedPinjamanTable';
import TechStackBackground from '@/Components/TechStackBackground';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import TailLayout from '@/Layouts/TailLayout';
import { PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { BarChart3, FileText, Plus, Search, Users } from 'lucide-react';
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
  nasabah: {
    nama_lengkap: string;
    nik: string;
  };
  jumlah_pinjaman: number;
  tujuan_pinjaman: string;
  jangka_waktu?: number;
  bunga?: number;
  status: string;
  staf_input?: { name: string };
  admin_kredit?: { name: string };
  analis?: { name: string };
  pemutus?: { name: string };
  created_at: string;
  updated_at: string;
  tanggal_pengajuan: string;
  assigned_to?: {
    staf_input?: { name: string };
    admin_kredit?: { name: string };
    analis?: { name: string };
    pemutus?: { name: string };
  };
}

interface PinjamanIndexModernProps extends PageProps {
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
  };
  statistics?: {
    total: number;
    pending_review: number;
    in_progress: number;
    completed: number;
  };
}

const TailIndexModern: React.FC<PinjamanIndexModernProps> = ({
  auth,
  pinjaman,
  filters,
  statistics,
}) => {
  const [search, setSearch] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'create_pinjaman':
        router.visit('/pinjaman/create');
        break;
      case 'review_berkas':
        router.visit('/pinjaman?status=berkas_review');
        break;
      case 'analisa_kredit':
        router.visit('/pinjaman?status=analisa');
        break;
      case 'keputusan_kredit':
        router.visit('/pinjaman?status=keputusan');
        break;
      default:
        router.visit('/pinjaman');
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

  const handleView = (id: number) => {
    router.visit(`/pinjaman/${id}`);
  };

  const handleEdit = (id: number) => {
    router.visit(`/pinjaman/${id}/edit`);
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus pinjaman ini?')) {
      router.delete(`/pinjaman/${id}`);
    }
  };

  const handleApprove = (id: number) => {
    router.post(
      `/workflow/approve/${id}`,
      {},
      {
        onSuccess: () => {
          // Refresh data or show success message
        },
      }
    );
  };

  const handleReject = (id: number) => {
    const reason = prompt('Alasan penolakan:');
    if (reason) {
      router.post(
        `/workflow/reject/${id}`,
        { reason },
        {
          onSuccess: () => {
            // Refresh data or show success message
          },
        }
      );
    }
  };

  const getStatsCards = () => {
    const baseStats = [
      {
        title: 'Total Pinjaman',
        value: statistics?.total || pinjaman.meta?.total || 0,
        icon: <FileText className="h-5 w-5" />,
        color: 'bg-blue-500',
        textColor: 'text-blue-600',
      },
      {
        title: 'Pending Review',
        value: statistics?.pending_review || 0,
        icon: <BarChart3 className="h-5 w-5" />,
        color: 'bg-yellow-500',
        textColor: 'text-yellow-600',
      },
      {
        title: 'Sedang Proses',
        value: statistics?.in_progress || 0,
        icon: <Users className="h-5 w-5" />,
        color: 'bg-purple-500',
        textColor: 'text-purple-600',
      },
      {
        title: 'Selesai',
        value: statistics?.completed || 0,
        icon: <FileText className="h-5 w-5" />,
        color: 'bg-green-500',
        textColor: 'text-green-600',
      },
    ];

    return baseStats;
  };

  const statsCards = getStatsCards();

  return (
    <TailLayout>
      <Head title="Data Pinjaman" />

      {/* Tech Stack Background */}
      <TechStackBackground />

      <div className="relative z-10 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Data Pinjaman
                </h1>
                <p className="mt-1 text-gray-600">
                  Kelola semua data pinjaman berdasarkan role Anda
                </p>
              </div>
              <div className="flex gap-3">
                <Badge variant="outline" className="text-sm">
                  Role: {auth.user.role.replace('_', ' ').toUpperCase()}
                </Badge>
                {auth.user.role === 'staf_input' && (
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

          {/* Statistics Cards */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statsCards.map((stat, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div
                      className={`rounded-lg p-2 ${stat.color} bg-opacity-10`}
                    >
                      <div className={stat.textColor}>{stat.icon}</div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Quick Actions Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Aksi Cepat</CardTitle>
                  <p className="text-sm text-gray-600">
                    Aksi berdasarkan role Anda
                  </p>
                </CardHeader>
                <CardContent>
                  <QuickActions
                    userRole={auth.user.role}
                    onAction={handleQuickAction}
                  />
                </CardContent>
              </Card>

              {/* Search & Filter */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Pencarian
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Cari Nasabah / NIK
                    </label>
                    <input
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Nama nasabah atau NIK..."
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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
                      <option value="">Semua Status</option>
                      <option value="draft">Draft</option>
                      <option value="input">Input</option>
                      <option value="berkas_review">Review Berkas</option>
                      <option value="berkas_approved">Berkas Disetujui</option>
                      <option value="analisa">Analisa</option>
                      <option value="analisa_completed">Analisa Selesai</option>
                      <option value="keputusan">Menunggu Keputusan</option>
                      <option value="approved">Disetujui</option>
                      <option value="rejected">Ditolak</option>
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

            {/* Main Table */}
            <div className="lg:col-span-3">
              <RoleBasedPinjamanTable
                data={pinjaman.data}
                userRole={auth.user.role}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onApprove={handleApprove}
                onReject={handleReject}
              />

              {/* Pagination */}
              {pinjaman.links && pinjaman.links.length > 3 && (
                <Card className="mt-6">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Menampilkan {pinjaman.data.length} dari{' '}
                        {pinjaman.meta?.total || 0} data
                      </div>
                      <div className="flex items-center gap-2">
                        {pinjaman.links.map((link, index) => (
                          <button
                            key={index}
                            onClick={() => link.url && router.visit(link.url)}
                            disabled={!link.url}
                            className={`rounded-md px-3 py-2 text-sm ${
                              link.active
                                ? 'bg-blue-600 text-white'
                                : link.url
                                  ? 'text-gray-700 hover:bg-gray-100'
                                  : 'cursor-not-allowed text-gray-400'
                            } `}
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
    </TailLayout>
  );
};

export default TailIndexModern;
