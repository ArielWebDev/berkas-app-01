import WorkflowStepIndicator from '@/Components/WorkflowStepIndicator';
import TailLayout from '@/Layouts/TailLayout';
import { PageProps } from '@/types';
import {
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { Head } from '@inertiajs/react';

interface WorkflowDashboardProps extends PageProps {
  stats: Record<string, number>;
  recentActivities: Array<{
    id: number;
    nasabah_nama: string;
    status: string;
    jumlah: number;
    last_activity?: {
      action: string;
      description: string;
      created_at: string;
      user: string;
    };
  }>;
  userRole: string;
}

const WorkflowDashboard: React.FC<WorkflowDashboardProps> = ({
  auth,
  stats,
  recentActivities,
  userRole,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      diajukan: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Diajukan' },
      diperiksa: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Diperiksa',
      },
      dikembalikan: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Dikembalikan',
      },
      dianalisis: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        label: 'Dianalisis',
      },
      siap_diputuskan: {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        label: 'Siap Diputuskan',
      },
      disetujui: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Disetujui',
      },
      ditolak: { bg: 'bg-red-100', text: 'text-red-800', label: 'Ditolak' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: status,
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getRoleTitle = (role: string) => {
    const titles = {
      staf_input: 'Staf Input',
      admin_kredit: 'Admin Kredit',
      analis: 'Analis',
      pemutus: 'Pemutus',
      admin: 'Administrator',
    };
    return titles[role as keyof typeof titles] || role;
  };

  const renderStatsCards = () => {
    switch (userRole) {
      case 'admin_kredit':
        return (
          <>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ExclamationCircleIcon
                      className="h-6 w-6 text-blue-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Berkas Tersedia
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.available || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon
                      className="h-6 w-6 text-yellow-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Sedang Dikerjakan
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.my_tasks || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon
                      className="h-6 w-6 text-green-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Selesai Hari Ini
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.completed_today || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'analis':
        return (
          <>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ExclamationCircleIcon
                      className="h-6 w-6 text-purple-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Siap Dianalisis
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.available || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon
                      className="h-6 w-6 text-yellow-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Sedang Dianalisis
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.my_tasks || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon
                      className="h-6 w-6 text-green-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Selesai Hari Ini
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.completed_today || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'pemutus':
        return (
          <>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ExclamationCircleIcon
                      className="h-6 w-6 text-orange-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Menunggu Keputusan
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.available || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon
                      className="h-6 w-6 text-yellow-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Sedang Diputuskan
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.my_tasks || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon
                      className="h-6 w-6 text-green-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Disetujui Hari Ini
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.approved_today || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <XCircleIcon
                      className="h-6 w-6 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Ditolak Hari Ini
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.rejected_today || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'staf_input':
        return (
          <>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DocumentTextIcon
                      className="h-6 w-6 text-blue-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Diajukan Hari Ini
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.submitted_today || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon
                      className="h-6 w-6 text-yellow-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Sedang Diproses
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.in_process || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon
                      className="h-6 w-6 text-green-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Disetujui
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.approved || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <XCircleIcon
                      className="h-6 w-6 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Ditolak
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.rejected || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      default: // Admin
        return (
          <>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DocumentTextIcon
                      className="h-6 w-6 text-blue-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Diajukan
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.total_diajukan || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon
                      className="h-6 w-6 text-yellow-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Diperiksa
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.total_diperiksa || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon
                      className="h-6 w-6 text-purple-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Dianalisis
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.total_dianalisis || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ExclamationCircleIcon
                      className="h-6 w-6 text-orange-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Siap Diputuskan
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.total_siap_diputuskan || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon
                      className="h-6 w-6 text-green-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Disetujui
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.total_disetujui || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <XCircleIcon
                      className="h-6 w-6 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Ditolak
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.total_ditolak || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <TailLayout>
      <Head title="Dashboard Workflow" />

      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard Workflow
            </h1>
            <p className="mt-2 text-gray-600">
              Selamat datang,{' '}
              <span className="font-semibold">{auth.user.name}</span> -{' '}
              {getRoleTitle(userRole)}
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {renderStatsCards()}
          </div>

          {/* Recent Activities */}
          {recentActivities.length > 0 && (
            <div className="rounded-lg bg-white shadow">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">
                  Aktivitas Terbaru
                </h3>
                <div className="overflow-hidden">
                  <div className="space-y-4">
                    {recentActivities.map(activity => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-4 rounded-lg bg-gray-50 p-4"
                      >
                        <div className="flex-shrink-0">
                          <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {activity.nasabah_nama}
                            </p>
                            <div className="ml-2 flex-shrink-0">
                              {getStatusBadge(activity.status)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(activity.jumlah)}
                          </p>
                          {activity.last_activity && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500">
                                {activity.last_activity.description} oleh{' '}
                                {activity.last_activity.user}
                              </p>
                              <p className="mt-1 text-xs text-gray-400">
                                {formatDate(activity.last_activity.created_at)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Workflow Steps Overview */}
          <div className="mt-8 rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">
                Alur Workflow Pinjaman
              </h3>
              <div className="mt-4">
                <WorkflowStepIndicator
                  currentStatus="diajukan"
                  className="justify-center"
                />
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 text-sm text-gray-600 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <div className="font-medium text-blue-600">1. Staf Input</div>
                  <div>Mengajukan berkas pinjaman</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-yellow-600">
                    2. Admin Kredit
                  </div>
                  <div>Memeriksa kelengkapan berkas</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-purple-600">3. Analis</div>
                  <div>Menganalisis kelayakan pinjaman</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-orange-600">4. Pemutus</div>
                  <div>Memutuskan approve/reject</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">
              Aksi Cepat
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <a
                href="/pinjaman"
                className="rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-blue-300 hover:shadow-md"
              >
                <h4 className="font-medium text-gray-900">
                  Lihat Semua Pinjaman
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  Kelola data pinjaman
                </p>
              </a>

              {(userRole === 'staf_input' || userRole === 'admin') && (
                <a
                  href="/pinjaman/create/wizard-new"
                  className="rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-green-300 hover:shadow-md"
                >
                  <h4 className="font-medium text-gray-900">
                    Tambah Pinjaman Baru
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Input pengajuan pinjaman
                  </p>
                </a>
              )}

              <a
                href="/nasabah"
                className="rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-purple-300 hover:shadow-md"
              >
                <h4 className="font-medium text-gray-900">Data Nasabah</h4>
                <p className="mt-1 text-sm text-gray-600">
                  Kelola data nasabah
                </p>
              </a>

              <a
                href="/reports"
                className="rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-indigo-300 hover:shadow-md"
              >
                <h4 className="font-medium text-gray-900">Laporan</h4>
                <p className="mt-1 text-sm text-gray-600">
                  Lihat laporan dan statistik
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </TailLayout>
  );
};

export default WorkflowDashboard;
