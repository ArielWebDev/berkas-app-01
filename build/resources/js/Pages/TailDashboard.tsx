import TailLayout from '@/Layouts/TailLayout';
import {
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PlusIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { Head } from '@inertiajs/react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Props {
  auth: {
    user: User;
  };
  statistics: {
    total_pinjaman: number;
    total_nasabah: number;
    pinjaman_pending: number;
    pinjaman_disetujui: number;
    total_nominal: number;
    monthly_growth: number;
  };
  recent_pinjaman: Array<{
    id: number;
    nasabah: {
      nama: string;
    };
    jumlah_pinjaman: number;
    status: string;
    created_at: string;
  }>;
  workflow_overview: {
    all_status: {
      diajukan: number;
      diperiksa: number;
      dikembalikan: number;
      dianalisis: number;
      siap_diputuskan: number;
      disetujui: number;
      ditolak: number;
    };
    staff_workload: {
      admin_kredit: number;
      analis: number;
      pemutus: number;
    };
  };
  recent_activity: Array<{
    id: number;
    description: string;
    user: {
      name: string;
    };
    created_at: string;
    type: string;
  }>;
}

export default function TailDashboard({
  auth,
  statistics,
  recent_pinjaman,
  workflow_overview,
  recent_activity,
}: Props) {
  const statCards = [
    {
      title: 'Total Nasabah',
      value: statistics?.total_nasabah || 0,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase',
    },
    {
      title: 'Total Pinjaman',
      value: statistics?.total_pinjaman || 0,
      icon: DocumentTextIcon,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'increase',
    },
    {
      title: 'Pinjaman Pending',
      value: statistics?.pinjaman_pending || 0,
      icon: ClockIcon,
      color: 'bg-yellow-500',
      change: '+5%',
      changeType: 'increase',
    },
    {
      title: 'Pinjaman Disetujui',
      value: statistics?.pinjaman_disetujui || 0,
      icon: CheckCircleIcon,
      color: 'bg-purple-500',
      change: '+15%',
      changeType: 'increase',
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      aktif: 'bg-yellow-100 text-yellow-800',
      selesai: 'bg-green-100 text-green-800',
      tertunggak: 'bg-red-100 text-red-800',
      pending: 'bg-gray-100 text-gray-800',
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses[status as keyof typeof statusClasses] || statusClasses.pending}`}
      >
        {status}
      </span>
    );
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

  return (
    <TailLayout>
      <Head title="Dashboard" />

      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Selamat datang, {auth.user.name}!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-green-600">
                    <span className="font-medium">{stat.change}</span> dari
                    bulan lalu
                  </p>
                </div>
                <div className={`${stat.color} rounded-lg p-3`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Pinjaman */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Pinjaman Terbaru
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        ID Pinjaman
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Nasabah
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Jumlah
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Tanggal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {recent_pinjaman && recent_pinjaman.length > 0 ? (
                      recent_pinjaman.slice(0, 5).map(pinjaman => (
                        <tr key={pinjaman.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                            #{pinjaman.id}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                            {pinjaman.nasabah?.nama || 'N/A'}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                            {formatCurrency(pinjaman.jumlah_pinjaman)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {getStatusBadge(pinjaman.status)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {formatDate(pinjaman.created_at)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
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
          </div>

          {/* Quick Actions & Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <a
                  href="/pinjaman/create"
                  className="flex w-full items-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <PlusIcon className="mr-3 h-5 w-5" />
                  Tambah Pinjaman Baru
                </a>
                <a
                  href="/nasabah/create"
                  className="flex w-full items-center rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  <UserGroupIcon className="mr-3 h-5 w-5" />
                  Tambah Nasabah Baru
                </a>
                <a
                  href="/pinjaman"
                  className="flex w-full items-center rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  <EyeIcon className="mr-3 h-5 w-5" />
                  Lihat Semua Pinjaman
                </a>
              </div>
            </div>

            {/* Activity Summary */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Aktivitas Terbaru
              </h3>
              <div className="space-y-4">
                {recent_activity && recent_activity.length > 0 ? (
                  recent_activity.slice(0, 5).map((activity, index) => (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-3"
                    >
                      <div className="flex-shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                          <span className="text-xs font-medium text-blue-600">
                            {activity.user.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(activity.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center">
                    <ExclamationTriangleIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Belum ada aktivitas
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Overview */}
        {workflow_overview && (
          <div className="mt-8">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Status Pinjaman Overview
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
                {Object.entries(workflow_overview.all_status).map(
                  ([status, count]) => (
                    <div key={status} className="text-center">
                      <div className="rounded-lg bg-gray-100 px-3 py-2">
                        <div className="text-2xl font-bold text-gray-900">
                          {count}
                        </div>
                        <div className="text-xs font-medium capitalize text-gray-600">
                          {status.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </TailLayout>
  );
}
