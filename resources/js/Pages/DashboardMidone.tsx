import TailLayout from '@/Layouts/TailLayout';
import { PageProps } from '@/types';
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
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

export default function DashboardMidone({
  auth,
  statistics,
  recent_pinjaman,
  workflow_overview,
  recent_activity,
}: DashboardData) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
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

  // Sample data for charts
  const monthlyData = [
    { month: 'Jan', approved: 12, rejected: 3 },
    { month: 'Feb', approved: 19, rejected: 2 },
    { month: 'Mar', approved: 15, rejected: 4 },
    { month: 'Apr', approved: 22, rejected: 1 },
    { month: 'May', approved: 18, rejected: 3 },
    { month: 'Jun', approved: 25, rejected: 2 },
  ];

  const pieData = Object.entries(workflow_overview.all_status || {}).map(
    ([key, value]) => ({
      name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: value,
    })
  );

  const COLORS = [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#06B6D4',
  ];

  const statsCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(statistics.total_amount || 0),
      change: '+12%',
      trend: 'up',
      icon: CurrencyDollarIcon,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Pinjaman',
      value: statistics.total_pinjaman.toString(),
      change: '+8%',
      trend: 'up',
      icon: DocumentTextIcon,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Total Nasabah',
      value: statistics.total_nasabah.toString(),
      change: '+15%',
      trend: 'up',
      icon: UsersIcon,
      color: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Pending Review',
      value: statistics.pinjaman_pending.toString(),
      change: '-5%',
      trend: 'down',
      icon: ClockIcon,
      color: 'bg-gradient-to-br from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
  ];

  return (
    <TailLayout>
      <Head title="Dashboard - Berkas App" />

      {/* Main Content */}
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">General Report</h2>
          <p className="mt-1 text-gray-600">
            Selamat datang kembali,{' '}
            <span className="font-medium text-blue-600">{auth.user.name}</span>!
            Kelola berkas pinjaman dengan mudah dan efisien.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-4 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className={`h-12 w-12 ${card.bgColor} flex items-center justify-center rounded-lg`}
                    >
                      <IconComponent className={`h-6 w-6 ${card.textColor}`} />
                    </div>
                    <div
                      className={`flex items-center space-x-1 text-sm ${
                        card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {card.trend === 'up' ? (
                        <ArrowTrendingUpIcon className="h-4 w-4" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-4 w-4" />
                      )}
                      <span className="font-medium">{card.change}</span>
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-2xl font-bold text-gray-900">
                      {card.value}
                    </p>
                    <p className="text-sm text-gray-600">{card.title}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Sales Report Chart */}
          <div className="lg:col-span-2">
            <div
              className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-700 ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sales Report
                  </h3>
                  <p className="text-sm text-gray-600">
                    4 Jul, 2025 - 4 Aug, 2025
                  </p>
                </div>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  Show More
                </button>
              </div>

              <div className="mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      $24,100,21
                    </p>
                    <p className="text-sm text-gray-600">Current Period</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-400">
                      $21,023,01
                    </p>
                    <p className="text-sm text-gray-600">Previous Period</p>
                  </div>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
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
                          stopColor="#3B82F6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3B82F6"
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
                          stopColor="#F59E0B"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#F59E0B"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="approved"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorApproved)"
                      name="Approved"
                    />
                    <Area
                      type="monotone"
                      dataKey="rejected"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRejected)"
                      name="Rejected"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Weekly Top Seller */}
          <div>
            <div
              className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-700 ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Weekly Top Seller
                </h3>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  Show More
                </button>
              </div>

              <div className="space-y-4">
                {pieData.slice(0, 4).map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="flex-1 text-sm text-gray-600">
                      {item.name}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
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
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Sales Report List */}
          <div
            className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-700 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: '500ms' }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Sales Report
              </h3>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Show More
              </button>
            </div>

            <div className="space-y-4">
              {recent_pinjaman.slice(0, 5).map(pinjaman => (
                <Link
                  key={pinjaman.id}
                  href={`/pinjaman/${pinjaman.id}`}
                  className="group block rounded-lg p-3 transition-colors duration-200 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 transition-colors group-hover:text-blue-600">
                        {pinjaman.nasabah.nama_lengkap}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatDate(pinjaman.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(pinjaman.jumlah_pinjaman)}
                      </p>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          pinjaman.status === 'disetujui'
                            ? 'bg-green-100 text-green-800'
                            : pinjaman.status === 'ditolak'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {pinjaman.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Transactions */}
          <div
            className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-700 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Transactions
              </h3>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                View More
              </button>
            </div>

            <div className="space-y-4">
              {recent_activity.slice(0, 5).map(activity => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <span className="text-xs font-semibold text-blue-600">
                      {activity.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {activity.user.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs text-gray-500">
                      {formatDate(activity.created_at)}
                    </p>
                    <p className="text-sm font-semibold text-green-600">+$75</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div
            className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-700 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: '700ms' }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activities
              </h3>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Show More
              </button>
            </div>

            <div className="space-y-4">
              {recent_activity.slice(0, 5).map(activity => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                    <span className="text-xs font-semibold text-white">
                      {activity.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      {activity.description}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {activity.user.name} • {formatDate(activity.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TailLayout>
  );
}
