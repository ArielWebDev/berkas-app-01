import TailLayout from '@/Layouts/TailLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  FileText,
  Filter,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';

interface ReportsProps extends PageProps {
  statistics: {
    total_pinjaman: number;
    total_nasabah: number;
    total_nilai_pinjaman: number;
    pinjaman_disetujui: number;
    pinjaman_ditolak: number;
    pinjaman_pending: number;
  };
  monthly_data: Array<{
    month: string;
    pinjaman_count: number;
    total_nilai: number;
  }>;
  status_breakdown: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  recent_activities: Array<{
    date: string;
    activity: string;
    count: number;
  }>;
}

export default function Reports({
  statistics,
  monthly_data,
  status_breakdown,
  recent_activities,
}: ReportsProps) {
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });
  const [selectedReport, setSelectedReport] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      alert('Report berhasil digenerate! File akan didownload.');
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disetujui':
        return 'text-green-600 bg-green-100';
      case 'ditolak':
        return 'text-red-600 bg-red-100';
      case 'diajukan':
        return 'text-blue-600 bg-blue-100';
      case 'diperiksa':
        return 'text-yellow-600 bg-yellow-100';
      case 'dianalisis':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <TailLayout>
      <Head title="Reports & Analytics" />

      {/* Header dengan animasi */}
      <div className="animate-fade-in mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center text-3xl font-bold text-gray-900">
              <BarChart3 className="mr-3 h-8 w-8 text-blue-600" />
              Reports & Analytics
            </h1>
            <p className="mt-1 text-gray-600">
              Laporan dan analisis data pinjaman
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="flex transform items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards dengan animasi */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="animate-slide-up transform rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white transition-all duration-200 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100">Total Pinjaman</p>
              <p className="text-2xl font-bold">{statistics.total_pinjaman}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-200" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="mr-1 h-4 w-4" />
            <span className="text-sm">+12% dari bulan lalu</span>
          </div>
        </div>

        <div
          className="animate-slide-up transform rounded-xl bg-gradient-to-r from-green-500 to-green-600 p-6 text-white transition-all duration-200 hover:scale-105"
          style={{ animationDelay: '100ms' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100">Total Nasabah</p>
              <p className="text-2xl font-bold">{statistics.total_nasabah}</p>
            </div>
            <Users className="h-8 w-8 text-green-200" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="mr-1 h-4 w-4" />
            <span className="text-sm">+8% dari bulan lalu</span>
          </div>
        </div>

        <div
          className="animate-slide-up transform rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white transition-all duration-200 hover:scale-105"
          style={{ animationDelay: '200ms' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-100">Total Nilai</p>
              <p className="text-2xl font-bold">
                {formatCurrency(statistics.total_nilai_pinjaman)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-200" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="mr-1 h-4 w-4" />
            <span className="text-sm">+15% dari bulan lalu</span>
          </div>
        </div>

        <div
          className="animate-slide-up transform rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white transition-all duration-200 hover:scale-105"
          style={{ animationDelay: '300ms' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-100">Approval Rate</p>
              <p className="text-2xl font-bold">
                {statistics.total_pinjaman > 0
                  ? Math.round(
                      (statistics.pinjaman_disetujui /
                        statistics.total_pinjaman) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-orange-200" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="mr-1 h-4 w-4" />
            <span className="text-sm">+3% dari bulan lalu</span>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="animate-fade-in mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center text-lg font-semibold text-gray-900">
            <Filter className="mr-2 h-5 w-5" />
            Filter Reports
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tipe Report
            </label>
            <select
              value={selectedReport}
              onChange={e => setSelectedReport(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="overview">Overview</option>
              <option value="monthly">Monthly Trends</option>
              <option value="status">Status Analysis</option>
              <option value="performance">Performance</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Dari Tanggal
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={e =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Sampai Tanggal
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={e =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Status Breakdown Chart */}
        <div className="animate-slide-up rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 flex items-center text-lg font-semibold text-gray-900">
            <BarChart3 className="mr-2 h-5 w-5" />
            Status Breakdown
          </h3>

          <div className="space-y-4">
            {status_breakdown.map((item, index) => (
              <div
                key={item.status}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <div
                    className={`mr-3 h-3 w-3 rounded-full ${getStatusColor(item.status).split(' ')[1]}`}
                  ></div>
                  <span className="font-medium capitalize">
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900">
                    {item.count}
                  </span>
                  <div className="text-sm text-gray-600">
                    {item.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends */}
        <div
          className="animate-slide-up rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          style={{ animationDelay: '200ms' }}
        >
          <h3 className="mb-6 flex items-center text-lg font-semibold text-gray-900">
            <Calendar className="mr-2 h-5 w-5" />
            Monthly Trends
          </h3>

          <div className="space-y-4">
            {monthly_data.map((item, index) => (
              <div
                key={item.month}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
              >
                <div>
                  <span className="font-medium">{item.month}</span>
                  <div className="text-sm text-gray-600">
                    {item.pinjaman_count} pinjaman
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(item.total_nilai)}
                  </span>
                  <div className="mt-1 h-2 w-20 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-blue-600 transition-all duration-500"
                      style={{
                        width: `${Math.min((item.total_nilai / Math.max(...monthly_data.map(d => d.total_nilai))) * 100, 100)}%`,
                        animationDelay: `${index * 100}ms`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div
          className="animate-slide-up rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          style={{ animationDelay: '400ms' }}
        >
          <h3 className="mb-6 flex items-center text-lg font-semibold text-gray-900">
            <AlertCircle className="mr-2 h-5 w-5" />
            Recent Activities
          </h3>

          <div className="space-y-3">
            {recent_activities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-r-lg border-l-4 border-blue-500 bg-blue-50 p-3"
              >
                <div>
                  <span className="font-medium">{activity.activity}</span>
                  <div className="text-sm text-gray-600">{activity.date}</div>
                </div>
                <span className="rounded-full bg-blue-600 px-2 py-1 text-sm font-medium text-white">
                  {activity.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div
          className="animate-slide-up rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          style={{ animationDelay: '600ms' }}
        >
          <h3 className="mb-6 text-lg font-semibold text-gray-900">
            Quick Actions
          </h3>

          <div className="space-y-3">
            <button className="group flex w-full items-center rounded-lg border border-gray-200 px-4 py-3 text-left transition-colors hover:bg-gray-50">
              <Download className="mr-3 h-5 w-5 text-blue-600 transition-transform group-hover:scale-110" />
              <div>
                <div className="font-medium">Export Detailed Report</div>
                <div className="text-sm text-gray-600">
                  Download comprehensive Excel report
                </div>
              </div>
            </button>

            <button className="group flex w-full items-center rounded-lg border border-gray-200 px-4 py-3 text-left transition-colors hover:bg-gray-50">
              <BarChart3 className="mr-3 h-5 w-5 text-green-600 transition-transform group-hover:scale-110" />
              <div>
                <div className="font-medium">Performance Analysis</div>
                <div className="text-sm text-gray-600">
                  Detailed performance metrics
                </div>
              </div>
            </button>

            <button className="group flex w-full items-center rounded-lg border border-gray-200 px-4 py-3 text-left transition-colors hover:bg-gray-50">
              <Users className="mr-3 h-5 w-5 text-purple-600 transition-transform group-hover:scale-110" />
              <div>
                <div className="font-medium">Customer Insights</div>
                <div className="text-sm text-gray-600">
                  Customer behavior analysis
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Custom CSS untuk animasi */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .hover\\:scale-105:hover {
          transform: scale(1.05);
        }
        
        .transition-all {
          transition: all 0.3s ease;
        }
      `}</style>
    </TailLayout>
  );
}
