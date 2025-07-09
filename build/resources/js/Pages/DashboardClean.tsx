import ModernLayout from '@/Layouts/ModernLayout';
import { PageProps } from '@/types';
import {
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  PlusIcon,
  UserGroupIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface DashboardData extends PageProps {
  statistics: {
    total_pinjaman: number;
    total_nasabah: number;
    pinjaman_pending: number;
    pinjaman_approved: number;
    total_amount: number;
  };
  recent_pinjaman: Array<{
    id: number;
    status: string;
    nasabah: { nama_lengkap: string };
    jumlah_pinjaman: number;
    created_at: string;
  }>;
  workflow_overview: {
    all_status: Record<string, number>;
    staff_workload: Record<string, number>;
  };
  recent_activity: Array<{
    id: number;
    description: string;
    user: { name: string };
    created_at: string;
    type: string;
  }>;
}

// Mock data untuk charts yang lebih menarik
const mockMonthlyData = [
  { month: 'Jan', approved: 12, rejected: 3 },
  { month: 'Feb', approved: 18, rejected: 4 },
  { month: 'Mar', approved: 15, rejected: 3 },
  { month: 'Apr', approved: 20, rejected: 5 },
  { month: 'May', approved: 25, rejected: 5 },
  { month: 'Jun', approved: 23, rejected: 5 },
];

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function DashboardModern({
  auth,
  statistics,
  recent_pinjaman,
  workflow_overview,
  recent_activity,
}: DashboardData) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

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

  // Prepare chart data
  const pieData = Object.entries(workflow_overview.all_status).map(
    ([status, value]) => ({
      name: status.replace('_', ' ').toUpperCase(),
      value,
    })
  );

  const statsCards = [
    {
      title: 'Total Pinjaman',
      value: statistics.total_pinjaman,
      icon: DocumentTextIcon,
      color: 'from-purple-500 to-purple-600',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Total Nasabah',
      value: statistics.total_nasabah,
      icon: UsersIcon,
      color: 'from-blue-500 to-blue-600',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Pending Review',
      value: statistics.pinjaman_pending,
      icon: ClockIcon,
      color: 'from-yellow-500 to-yellow-600',
      trend: '-5%',
      trendUp: false,
    },
    {
      title: 'Disetujui',
      value: statistics.pinjaman_approved,
      icon: CheckCircleIcon,
      color: 'from-green-500 to-green-600',
      trend: '+15%',
      trendUp: true,
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; label: string }> = {
      diajukan: { bg: 'bg-blue-100 text-blue-800', label: 'Diajukan' },
      diperiksa: { bg: 'bg-yellow-100 text-yellow-800', label: 'Diperiksa' },
      dikembalikan: { bg: 'bg-red-100 text-red-800', label: 'Dikembalikan' },
      dianalisis: { bg: 'bg-purple-100 text-purple-800', label: 'Dianalisis' },
      siap_diputuskan: {
        bg: 'bg-indigo-100 text-indigo-800',
        label: 'Siap Diputuskan',
      },
      disetujui: { bg: 'bg-green-100 text-green-800', label: 'Disetujui' },
      ditolak: { bg: 'bg-red-100 text-red-800', label: 'Ditolak' },
    };
    const style = statusMap[status] || {
      bg: 'bg-gray-100 text-gray-800',
      label: status,
    };
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg}`}
      >
        {style.label}
      </span>
    );
  };

  return (
    <ModernLayout user={auth.user}>
      <Head title="Dashboard - Berkas App" />

      <div className="p-6">
        {/* Header */}
        <div
          className={`mb-8 transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <h1 className="mb-2 text-4xl font-bold text-white">Dashboard</h1>
          <p className="text-lg text-slate-300">
            Selamat datang kembali,{' '}
            <span className="font-semibold text-purple-400">
              {auth.user.name}
            </span>
            ! Kelola berkas pinjaman dengan mudah dan efisien.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((card, index) => (
            <div
              key={index}
              className={`group relative transition-all duration-500 ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-2xl">
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${card.color} opacity-10 transition-opacity duration-300 group-hover:opacity-20`}
                ></div>

                <div className="relative">
                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className={`rounded-xl bg-gradient-to-r p-3 ${card.color} shadow-lg`}
                    >
                      <card.icon className="h-6 w-6 text-white" />
                    </div>
                    <div
                      className={`flex items-center space-x-1 text-sm ${
                        card.trendUp ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      <ArrowTrendingUpIcon
                        className={`h-4 w-4 ${!card.trendUp && 'rotate-180'}`}
                      />
                      <span className="font-medium">{card.trend}</span>
                    </div>
                  </div>

                  <div>
                    <p className="mb-1 text-sm font-medium text-slate-400">
                      {card.title}
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {typeof card.value === 'number'
                        ? card.value.toLocaleString('id-ID')
                        : card.value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Charts Section */}
          <div className="space-y-8 lg:col-span-2">
            {/* Monthly Trends Chart */}
            <div
              className={`transition-all duration-700 ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-6">
                  <h3 className="mb-2 text-xl font-bold text-white">
                    Tren Pinjaman Bulanan
                  </h3>
                  <p className="text-slate-400">
                    Perbandingan pinjaman yang disetujui vs ditolak
                  </p>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockMonthlyData}>
                      <defs>
                        <linearGradient
                          id="colorApproved"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10b981"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorRejected"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#ef4444"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#ef4444"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          color: '#ffffff',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="approved"
                        stroke="#10b981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorApproved)"
                        name="Disetujui"
                      />
                      <Area
                        type="monotone"
                        dataKey="rejected"
                        stroke="#ef4444"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorRejected)"
                        name="Ditolak"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Status Distribution */}
            <div
              className={`transition-all duration-700 ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-6">
                  <h3 className="mb-2 text-xl font-bold text-white">
                    Distribusi Status Pinjaman
                  </h3>
                  <p className="text-slate-400">
                    Breakdown status pinjaman saat ini
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            color: '#ffffff',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-3">
                    {pieData.map((entry, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                        <span className="flex-1 text-sm text-slate-300">
                          {entry.name}
                        </span>
                        <span className="font-semibold text-white">
                          {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <div
                className={`transition-all duration-700 ${
                  isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: '500ms' }}
              >
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <h3 className="mb-6 text-xl font-bold text-white">
                    Quick Actions
                  </h3>

                  <div className="space-y-4">
                    {auth.user.role === 'staf_input' && (
                      <Link
                        href="/pinjaman/create/wizard"
                        className="group block w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:from-purple-700 hover:to-blue-700 hover:shadow-xl"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <PlusIcon className="h-5 w-5 text-white" />
                          <span className="font-semibold text-white">
                            Tambah Pinjaman Baru
                          </span>
                        </div>
                      </Link>
                    )}

                    <Link
                      href="/pinjaman"
                      className="group block w-full rounded-xl border border-white/20 bg-white/5 p-4 text-center transition-all duration-300 hover:border-white/30 hover:bg-white/10"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <DocumentTextIcon className="h-5 w-5 text-slate-300" />
                        <span className="font-medium text-slate-300">
                          Lihat Semua Pinjaman
                        </span>
                      </div>
                    </Link>

                    <Link
                      href="/nasabah"
                      className="group block w-full rounded-xl border border-white/20 bg-white/5 p-4 text-center transition-all duration-300 hover:border-white/30 hover:bg-white/10"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <UserGroupIcon className="h-5 w-5 text-slate-300" />
                        <span className="font-medium text-slate-300">
                          Kelola Nasabah
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Recent Applications */}
              <div
                className={`transition-all duration-700 ${
                  isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: '600ms' }}
              >
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <h3 className="mb-6 text-xl font-bold text-white">
                    Pinjaman Terbaru
                  </h3>

                  <div className="space-y-4">
                    {recent_pinjaman.slice(0, 5).map(pinjaman => (
                      <Link
                        key={pinjaman.id}
                        href={`/pinjaman/${pinjaman.id}`}
                        className="group block rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <h4 className="text-sm font-semibold text-white transition-colors group-hover:text-purple-300">
                            {pinjaman.nasabah.nama_lengkap}
                          </h4>
                          {getStatusBadge(pinjaman.status)}
                        </div>
                        <p className="mb-1 text-sm text-slate-300">
                          {formatCurrency(pinjaman.jumlah_pinjaman)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatDate(pinjaman.created_at)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div
                className={`transition-all duration-700 ${
                  isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: '700ms' }}
              >
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <h3 className="mb-6 text-xl font-bold text-white">
                    Aktivitas Terbaru
                  </h3>

                  <div className="space-y-4">
                    {recent_activity.slice(0, 5).map(activity => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-3"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-sm font-semibold text-white">
                          {activity.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-300">
                            {activity.description}
                          </p>
                          <p className="text-xs text-slate-500">
                            {activity.user.name} •{' '}
                            {formatDate(activity.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
}
