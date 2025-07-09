import TailLayout from '@/Layouts/TailLayout';
import {
  ArrowTrendingUpIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PlusIcon,
  UserGroupIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

interface DashboardProps {
  auth: {
    user: {
      id: number;
      name: string;
      role: string;
    };
  };
  statistics: {
    total_nasabah: number;
    total_pinjaman: number;
    pinjaman_pending: number;
    pinjaman_disetujui: number;
    total_nominal: number;
    monthly_growth: number;
  };
  recent_pinjaman: Array<{
    id: number;
    nasabah: {
      nama_lengkap: string;
    };
    jumlah_pinjaman: number;
    status: string;
    created_at: string;
  }>;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getStatusInfo = (status: string) => {
  const statusMap: Record<string, { label: string; color: string; icon: any }> =
    {
      diajukan: {
        label: 'Diajukan',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: ClockIcon,
      },
      diperiksa: {
        label: 'Diperiksa',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: EyeIcon,
      },
      dikembalikan: {
        label: 'Dikembalikan',
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: ExclamationTriangleIcon,
      },
      dianalisis: {
        label: 'Dianalisis',
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: DocumentCheckIcon,
      },
      siap_diputuskan: {
        label: 'Siap Diputuskan',
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        icon: CheckCircleIcon,
      },
      disetujui: {
        label: 'Disetujui',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircleIcon,
      },
      ditolak: {
        label: 'Ditolak',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircleIcon,
      },
    };

  return (
    statusMap[status] || {
      label: status,
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: ClockIcon,
    }
  );
};

const StatCard = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
  delay = 0,
}: {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: any;
  color: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all duration-300 hover:shadow-lg"
  >
    <div className="flex items-center">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="ml-4 flex-1">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {change && (
          <div className="mt-1 flex items-center">
            <ArrowTrendingUpIcon
              className={`h-4 w-4 ${
                changeType === 'increase'
                  ? 'text-green-500'
                  : changeType === 'decrease'
                    ? 'text-red-500'
                    : 'text-gray-500'
              }`}
            />
            <span
              className={`ml-1 text-sm ${
                changeType === 'increase'
                  ? 'text-green-600'
                  : changeType === 'decrease'
                    ? 'text-red-600'
                    : 'text-gray-600'
              }`}
            >
              {change}
            </span>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

export default function Dashboard({
  auth,
  statistics,
  recent_pinjaman,
}: DashboardProps) {
  const getRoleBasedWelcome = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: 'Administrator',
      staf_input: 'Staf Input',
      admin_kredit: 'Admin Kredit',
      analis: 'Analis Kredit',
      pemutus: 'Pemutus Kredit',
    };
    return roleMap[role] || 'User';
  };

  const getQuickActions = (role: string) => {
    const baseActions = [
      {
        title: 'Tambah Pinjaman Baru',
        description: 'Buat pengajuan pinjaman baru',
        href: '/pinjaman/create',
        icon: PlusIcon,
        color: 'bg-blue-600 hover:bg-blue-700',
        roles: ['staf_input', 'admin'],
      },
      {
        title: 'Tambah Nasabah Baru',
        description: 'Daftarkan nasabah baru',
        href: '/nasabah/create',
        icon: UserGroupIcon,
        color: 'bg-green-600 hover:bg-green-700',
        roles: ['staf_input', 'admin'],
      },
      {
        title: 'Lihat Semua Pinjaman',
        description: 'Review dan kelola pinjaman',
        href: '/pinjaman',
        icon: BanknotesIcon,
        color: 'bg-purple-600 hover:bg-purple-700',
        roles: ['admin_kredit', 'analis', 'pemutus', 'admin'],
      },
      {
        title: 'Laporan Keuangan',
        description: 'Analisis dan laporan',
        href: '/reports',
        icon: ArrowTrendingUpIcon,
        color: 'bg-indigo-600 hover:bg-indigo-700',
        roles: ['analis', 'pemutus', 'admin'],
      },
    ];

    return baseActions.filter(
      action => action.roles.includes(role) || role === 'admin'
    );
  };

  const quickActions = getQuickActions(auth.user.role);

  return (
    <TailLayout>
      <Head title="Dashboard" />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="p-6">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Dashboard Keuangan
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                  Selamat datang,{' '}
                  <span className="font-semibold text-blue-600">
                    {auth.user.name}
                  </span>{' '}
                  ({getRoleBasedWelcome(auth.user.role)})
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
                  <span>Sistem Aktif</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Statistics Cards */}
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Nasabah"
              value={statistics.total_nasabah}
              change="+12% dari bulan lalu"
              changeType="increase"
              icon={UserGroupIcon}
              color="bg-blue-600"
              delay={0.1}
            />
            <StatCard
              title="Total Pinjaman"
              value={statistics.total_pinjaman}
              change="+8% dari bulan lalu"
              changeType="increase"
              icon={BanknotesIcon}
              color="bg-green-600"
              delay={0.2}
            />
            <StatCard
              title="Pinjaman Pending"
              value={statistics.pinjaman_pending}
              change="+5% dari bulan lalu"
              changeType="increase"
              icon={ClockIcon}
              color="bg-yellow-600"
              delay={0.3}
            />
            <StatCard
              title="Pinjaman Disetujui"
              value={statistics.pinjaman_disetujui}
              change="+15% dari bulan lalu"
              changeType="increase"
              icon={CheckCircleIcon}
              color="bg-purple-600"
              delay={0.4}
            />
          </div>

          {/* Total Nominal Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8"
          >
            <div className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Nominal Pinjaman</p>
                  <p className="text-3xl font-bold">
                    {formatCurrency(statistics.total_nominal)}
                  </p>
                  <p className="mt-2 text-blue-100">
                    <span className="text-green-300">
                      ↗ +{statistics.monthly_growth}%
                    </span>{' '}
                    pertumbuhan bulan ini
                  </p>
                </div>
                <div className="rounded-full bg-white/20 p-3">
                  <ArrowTrendingUpIcon className="h-8 w-8" />
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Recent Pinjaman */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5">
                <div className="border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Pinjaman Terbaru
                    </h3>
                    <Link
                      href="/pinjaman"
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      Lihat semua
                    </Link>
                  </div>
                </div>
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          ID PINJAMAN
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          NASABAH
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          JUMLAH
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          STATUS
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          TANGGAL
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {recent_pinjaman?.slice(0, 5).map((pinjaman, index) => {
                        const statusInfo = getStatusInfo(pinjaman.status);
                        return (
                          <motion.tr
                            key={pinjaman.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: 0.7 + index * 0.1,
                            }}
                            className="transition-colors duration-200 hover:bg-gray-50"
                          >
                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                #{pinjaman.id}
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {pinjaman.nasabah.nama_lengkap}
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="text-sm font-semibold text-gray-900">
                                {formatCurrency(pinjaman.jumlah_pinjaman)}
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <span
                                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusInfo.color}`}
                              >
                                <statusInfo.icon className="mr-1 h-3 w-3" />
                                {statusInfo.label}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                              {formatDate(pinjaman.created_at)}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {(!recent_pinjaman || recent_pinjaman.length === 0) && (
                    <div className="py-12 text-center">
                      <p className="text-gray-500">Belum ada data pinjaman</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Quick Actions & Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="space-y-6"
            >
              {/* Quick Actions */}
              <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                    >
                      <Link
                        href={action.href}
                        className={`flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-white transition-all duration-200 ${action.color} transform hover:scale-105 hover:shadow-lg`}
                      >
                        <action.icon className="mr-3 h-5 w-5" />
                        <div className="text-left">
                          <div className="font-medium">{action.title}</div>
                          <div className="text-xs opacity-90">
                            {action.description}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Activity Feed */}
              <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Aktivitas Hari Ini
                </h3>
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.9 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                      <CheckCircleIcon className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        2 Pinjaman Disetujui
                      </p>
                      <p className="text-xs text-gray-500">
                        30 menit yang lalu
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 1.0 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <UserGroupIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        1 Nasabah Baru
                      </p>
                      <p className="text-xs text-gray-500">2 jam yang lalu</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 1.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                      <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        3 Pinjaman Mendekat Jatuh Tempo
                      </p>
                      <p className="text-xs text-gray-500">Dalam 3 hari</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </TailLayout>
  );
}
