import QuickActions from '@/Components/QuickActions';
import RoleBasedPinjamanTable from '@/Components/RoleBasedPinjamanTable';
import TechStackBackground from '@/Components/TechStackBackground';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import WorkflowProgress from '@/Components/WorkflowProgress';
import TailLayout from '@/Layouts/TailLayout';
import { Head } from '@inertiajs/react';
import {
  Activity,
  BarChart3,
  CheckCircle,
  Clock,
  FileText,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';

interface User {
  id: number;
  name: string;
  role: string;
}

interface Pinjaman {
  id: number;
  nasabah: {
    nama_lengkap: string;
    nik: string;
  };
  jumlah_pinjaman: number;
  tujuan_pinjaman: string;
  status: string;
  tanggal_pengajuan: string;
  assigned_to?: {
    staf_input?: { name: string };
    admin_kredit?: { name: string };
    analis?: { name: string };
    pemutus?: { name: string };
  };
}

interface DashboardWorkflowProps {
  user: User;
  statistics: {
    total_pinjaman: number;
    pending_review: number;
    dalam_analisa: number;
    menunggu_keputusan: number;
    disetujui: number;
    ditolak: number;
  };
  recent_pinjaman: Pinjaman[];
  user_workload?: {
    assigned_count: number;
    completed_today: number;
    pending_action: number;
  };
}

const DashboardWorkflow: React.FC<DashboardWorkflowProps> = ({
  user,
  statistics,
  recent_pinjaman,
  user_workload,
}) => {
  const [selectedPinjaman, setSelectedPinjaman] = useState<Pinjaman | null>(
    null
  );

  const handleQuickAction = (action: string) => {
    console.log('Quick action:', action);
    // Handle navigation berdasarkan action
    switch (action) {
      case 'create_pinjaman':
        window.location.href = '/pinjaman/create';
        break;
      case 'review_berkas':
        window.location.href = '/pinjaman?status=berkas_review';
        break;
      case 'analisa_kredit':
        window.location.href = '/pinjaman?status=analisa';
        break;
      case 'keputusan_kredit':
        window.location.href = '/pinjaman?status=keputusan';
        break;
      default:
        window.location.href = '/pinjaman';
    }
  };

  const handlePinjamanView = (id: number) => {
    window.location.href = `/pinjaman/${id}`;
  };

  const handlePinjamanEdit = (id: number) => {
    window.location.href = `/pinjaman/${id}/edit`;
  };

  const handlePinjamanApprove = (id: number) => {
    // Logic untuk approve
    console.log('Approve pinjaman:', id);
  };

  const handlePinjamanReject = (id: number) => {
    // Logic untuk reject
    console.log('Reject pinjaman:', id);
  };

  const getStatsCards = () => {
    const baseStats = [
      {
        title: 'Total Pinjaman',
        value: statistics.total_pinjaman,
        icon: <FileText className="h-5 w-5" />,
        color: 'bg-blue-500',
        textColor: 'text-blue-600',
      },
      {
        title: 'Pending Review',
        value: statistics.pending_review,
        icon: <Clock className="h-5 w-5" />,
        color: 'bg-yellow-500',
        textColor: 'text-yellow-600',
      },
      {
        title: 'Dalam Analisa',
        value: statistics.dalam_analisa,
        icon: <BarChart3 className="h-5 w-5" />,
        color: 'bg-purple-500',
        textColor: 'text-purple-600',
      },
      {
        title: 'Disetujui',
        value: statistics.disetujui,
        icon: <CheckCircle className="h-5 w-5" />,
        color: 'bg-green-500',
        textColor: 'text-green-600',
      },
    ];

    // Role-specific additional stats
    if (user_workload) {
      return [
        ...baseStats,
        {
          title: 'Tugas Saya',
          value: user_workload.assigned_count,
          icon: <Users className="h-5 w-5" />,
          color: 'bg-indigo-500',
          textColor: 'text-indigo-600',
        },
        {
          title: 'Selesai Hari Ini',
          value: user_workload.completed_today,
          icon: <Activity className="h-5 w-5" />,
          color: 'bg-emerald-500',
          textColor: 'text-emerald-600',
        },
      ];
    }

    return baseStats;
  };

  const statsCards = getStatsCards();

  return (
    <TailLayout>
      <Head title="Dashboard Workflow" />

      {/* Tech Stack Background */}
      <TechStackBackground />

      <div className="relative z-10 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Dashboard Workflow Berkas
                </h1>
                <p className="mt-1 text-gray-600">
                  Selamat datang, {user.name} (
                  {user.role.replace('_', ' ').toUpperCase()})
                </p>
              </div>
              <Badge variant="outline" className="text-sm">
                Role: {user.role.replace('_', ' ')}
              </Badge>
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

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Quick Actions */}
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
                    userRole={user.role}
                    onAction={handleQuickAction}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sample Workflow Progress */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Contoh Alur Workflow</CardTitle>
                  <p className="text-sm text-gray-600">
                    Alur proses berkas dari input hingga keputusan
                  </p>
                </CardHeader>
                <CardContent>
                  <WorkflowProgress
                    currentStatus="analisa"
                    assignedUsers={{
                      staf_input: { name: 'Ahmad Budi' },
                      admin_kredit: { name: 'Sari Dewi' },
                      analis: { name: 'Joko Susilo' },
                      pemutus: { name: 'Dr. Wati' },
                    }}
                    userRole={user.role}
                    onStepAction={(stepId, action) => {
                      console.log('Step action:', stepId, action);
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Pinjaman Table */}
          <div className="mt-8">
            <RoleBasedPinjamanTable
              data={recent_pinjaman}
              userRole={user.role}
              onView={handlePinjamanView}
              onEdit={handlePinjamanEdit}
              onApprove={handlePinjamanApprove}
              onReject={handlePinjamanReject}
            />
          </div>

          {/* Additional Info Based on Role */}
          {user_workload && (
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Workload Anda</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-lg bg-blue-50 p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {user_workload.assigned_count}
                      </div>
                      <div className="text-sm text-gray-600">Ditugaskan</div>
                    </div>
                    <div className="rounded-lg bg-green-50 p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {user_workload.completed_today}
                      </div>
                      <div className="text-sm text-gray-600">
                        Selesai Hari Ini
                      </div>
                    </div>
                    <div className="rounded-lg bg-orange-50 p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {user_workload.pending_action}
                      </div>
                      <div className="text-sm text-gray-600">Menunggu Aksi</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </TailLayout>
  );
};

export default DashboardWorkflow;
