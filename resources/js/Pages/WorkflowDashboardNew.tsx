import StatisticsCardSimple from '@/Components/StatisticsCardSimple';
import WorkflowStepIndicator from '@/Components/WorkflowStepIndicator';
import TailLayout from '@/Layouts/TailLayout';
import { PageProps } from '@/types';
import { ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
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

  const getQuickActions = () => {
    const actions = [];

    // Role-specific quick actions
    switch (userRole) {
      case 'staf_input':
        actions.push({
          name: 'Buat Pengajuan Baru',
          href: '/pinjaman/create',
          color: 'green',
        });
        break;
      case 'admin_kredit':
        if (stats.available > 0) {
          actions.push({
            name: `Ambil Berkas Tersedia (${stats.available})`,
            href: '/pinjaman?available=true',
            color: 'red',
            urgent: true,
          });
        }
        if (stats.my_tasks > 0) {
          actions.push({
            name: `Tugas Saya (${stats.my_tasks})`,
            href: '/pinjaman?my_tasks=true',
            color: 'yellow',
          });
        }
        break;
      case 'analis':
        if (stats.available > 0) {
          actions.push({
            name: `Ambil Berkas Tersedia (${stats.available})`,
            href: '/pinjaman?available=true',
            color: 'red',
            urgent: true,
          });
        }
        if (stats.my_tasks > 0) {
          actions.push({
            name: `Tugas Saya (${stats.my_tasks})`,
            href: '/pinjaman?my_tasks=true',
            color: 'yellow',
          });
        }
        break;
      case 'pemutus':
        if (stats.available > 0) {
          actions.push({
            name: `Ambil Berkas Tersedia (${stats.available})`,
            href: '/pinjaman?available=true',
            color: 'red',
            urgent: true,
          });
        }
        if (stats.my_tasks > 0) {
          actions.push({
            name: `Tugas Saya (${stats.my_tasks})`,
            href: '/pinjaman?my_tasks=true',
            color: 'yellow',
          });
        }
        break;
    }

    // Common actions
    actions.push({
      name: 'Lihat Semua Pinjaman',
      href: '/pinjaman',
      color: 'blue',
    });

    return actions;
  };

  return (
    <TailLayout>
      <Head title="Workflow Dashboard" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  Dashboard Workflow
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Selamat datang, {auth.user.name} ({auth.user.role})
                </p>
              </div>

              {/* Statistics Cards */}
              <div className="mb-8">
                <StatisticsCardSimple statistics={stats} role={userRole} />
              </div>

              {/* Quick Actions */}
              <div className="mb-8">
                <h2 className="mb-4 text-lg font-medium text-gray-900">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {getQuickActions().map((action, index) => (
                    <a
                      key={index}
                      href={action.href}
                      className={`group relative rounded-lg p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 ${
                        action.urgent
                          ? 'border-2 border-red-200 bg-red-50 hover:bg-red-100'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-md ${
                              action.urgent
                                ? 'bg-red-500'
                                : action.color === 'green'
                                  ? 'bg-green-500'
                                  : action.color === 'yellow'
                                    ? 'bg-yellow-500'
                                    : 'bg-blue-500'
                            } text-white`}
                          >
                            <DocumentTextIcon className="h-6 w-6" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            {action.name}
                            {action.urgent && (
                              <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                Urgent
                              </span>
                            )}
                          </h3>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Recent Activities */}
              {recentActivities && recentActivities.length > 0 && (
                <div>
                  <h2 className="mb-4 text-lg font-medium text-gray-900">
                    Aktivitas Terbaru
                  </h2>
                  <div className="overflow-hidden bg-white shadow sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      {recentActivities.slice(0, 5).map(activity => (
                        <li key={activity.id}>
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="flex-shrink-0">
                                  <WorkflowStepIndicator
                                    currentStatus={activity.status}
                                    showLabels={false}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="flex items-center">
                                    <p className="truncate text-sm font-medium text-indigo-600">
                                      {activity.nasabah_nama}
                                    </p>
                                    <p className="ml-2 flex-shrink-0 text-sm text-gray-500">
                                      {formatCurrency(activity.jumlah)}
                                    </p>
                                  </div>
                                  {activity.last_activity && (
                                    <div className="mt-1">
                                      <p className="text-sm text-gray-900">
                                        {activity.last_activity.description}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        oleh {activity.last_activity.user} •{' '}
                                        <time>
                                          {formatDate(
                                            activity.last_activity.created_at
                                          )}
                                        </time>
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center">
                                <ClockIcon className="h-5 w-5 text-gray-400" />
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TailLayout>
  );
};

export default WorkflowDashboard;
