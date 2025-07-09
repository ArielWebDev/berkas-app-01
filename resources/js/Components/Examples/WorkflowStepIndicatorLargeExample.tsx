import {
  CheckCircle2,
  Clock,
  Download,
  Edit,
  Eye,
  FileText,
  MessageCircle,
  Send,
  ThumbsUp,
  X,
} from 'lucide-react';
import React, { useState } from 'react';

import WorkflowStepIndicatorLarge from '../WorkflowStepIndicatorLarge';

interface WorkflowStepLarge {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
  user?: string;
  duration?: string;
  notes?: string;
  actions?: Array<{
    id: string;
    label: string;
    type: 'primary' | 'secondary' | 'danger' | 'success';
    icon?: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }>;
}

const WorkflowStepIndicatorLargeExample: React.FC = () => {
  const [workflowSteps, setWorkflowSteps] = useState([
    {
      id: 'step-1',
      title: 'Pengajuan Berkas',
      description:
        'Nasabah mengajukan berkas pinjaman dengan melengkapi semua dokumen yang diperlukan.',
      status: 'completed' as const,
      date: '2024-01-15 09:30',
      user: 'Ahmad Fauzi',
      duration: '30 menit',
      notes: 'Semua dokumen telah diterima dan sesuai persyaratan.',
      actions: [
        {
          id: 'view-documents',
          label: 'Lihat Dokumen',
          type: 'secondary' as const,
          icon: <Eye />,
          onClick: () => alert('Membuka dokumen...'),
        },
        {
          id: 'download-docs',
          label: 'Unduh',
          type: 'secondary' as const,
          icon: <Download />,
          onClick: () => alert('Mengunduh dokumen...'),
        },
      ],
    },
    {
      id: 'step-2',
      title: 'Verifikasi Data',
      description:
        'Tim verifikasi melakukan pengecekan kelengkapan dan kebenaran data.',
      status: 'completed' as const,
      date: '2024-01-16 14:15',
      user: 'Siti Nurhaliza',
      duration: '45 menit',
      notes: 'Verifikasi selesai, data lengkap dan valid.',
      actions: [
        {
          id: 'view-verification',
          label: 'Lihat Hasil Verifikasi',
          type: 'secondary' as const,
          icon: <FileText />,
          onClick: () => alert('Membuka hasil verifikasi...'),
        },
      ],
    },
    {
      id: 'step-3',
      title: 'Review dan Analisis',
      description:
        'Tim analis melakukan review mendalam terhadap profil risiko dan kelayakan nasabah.',
      status: 'current' as const,
      date: '2024-01-17 10:00',
      user: 'Budi Santoso',
      notes: 'Sedang dalam proses analisis kelayakan kredit.',
      actions: [
        {
          id: 'approve-step',
          label: 'Setujui',
          type: 'success' as const,
          icon: <ThumbsUp />,
          onClick: () => {
            alert('Menyetujui step ini...');
            // Simulasi update status
            setWorkflowSteps(prev =>
              prev.map(step =>
                step.id === 'step-3'
                  ? {
                      ...step,
                      status: 'completed' as const,
                      duration: '1 hari',
                    }
                  : step.id === 'step-4'
                    ? {
                        ...step,
                        status: 'current' as const,
                        date: new Date().toISOString().split('T')[0],
                        user: 'Current User',
                      }
                    : step
              )
            );
          },
        },
        {
          id: 'reject-step',
          label: 'Tolak',
          type: 'danger' as const,
          icon: <X />,
          onClick: () =>
            alert('Menolak dan mengembalikan ke step sebelumnya...'),
        },
        {
          id: 'add-note',
          label: 'Tambah Catatan',
          type: 'secondary' as const,
          icon: <MessageCircle />,
          onClick: () => {
            const note = prompt('Masukkan catatan:');
            if (note) {
              setWorkflowSteps(prev =>
                prev.map(step =>
                  step.id === 'step-3'
                    ? {
                        ...step,
                        notes: `${step.notes}\n\nCatatan tambahan: ${note}`,
                      }
                    : step
                )
              );
            }
          },
        },
        {
          id: 'edit-analysis',
          label: 'Edit Analisis',
          type: 'primary' as const,
          icon: <Edit />,
          onClick: () => alert('Membuka form edit analisis...'),
        },
      ],
    },
    {
      id: 'step-4',
      title: 'Persetujuan Manager',
      description:
        'Manager cabang memberikan persetujuan final untuk pencairan pinjaman.',
      status: 'pending' as const,
      actions: [
        {
          id: 'request-approval',
          label: 'Minta Persetujuan',
          type: 'primary' as const,
          icon: <Send />,
          onClick: () => alert('Mengirim permintaan persetujuan ke manager...'),
        },
        {
          id: 'schedule-meeting',
          label: 'Jadwalkan Meeting',
          type: 'secondary' as const,
          icon: <Clock />,
          onClick: () => alert('Membuka kalender untuk jadwal meeting...'),
        },
      ],
    },
    {
      id: 'step-5',
      title: 'Pencairan Dana',
      description:
        'Proses pencairan dana ke rekening nasabah setelah semua persetujuan diperoleh.',
      status: 'pending' as const,
      actions: [
        {
          id: 'process-disbursement',
          label: 'Proses Pencairan',
          type: 'success' as const,
          icon: <CheckCircle2 />,
          disabled: true,
          onClick: () => alert('Memproses pencairan dana...'),
        },
      ],
    },
  ]);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Workflow Step Indicator Large - Example
        </h1>
        <p className="text-gray-600">
          Contoh penggunaan komponen WorkflowStepIndicatorLarge dengan fitur
          aksi interaktif.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            Proses Pengajuan Pinjaman #PJM-2024-001
          </h2>
          <p className="text-sm text-gray-600">
            Diajukan oleh: Ahmad Fauzi • Tanggal: 15 Januari 2024 • Status:
            Dalam Proses
          </p>
        </div>

        <WorkflowStepIndicatorLarge steps={workflowSteps} />

        <div className="mt-8 rounded-lg bg-gray-50 p-4">
          <h3 className="mb-2 font-medium text-gray-800">
            Catatan Penggunaan:
          </h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>
              • Setiap step dapat memiliki berbagai aksi sesuai dengan statusnya
            </li>
            <li>
              • Tombol aksi dapat diaktifkan/dinonaktifkan berdasarkan kondisi
            </li>
            <li>
              • Warna tombol menyesuaikan dengan jenis aksi (primary, secondary,
              danger, success)
            </li>
            <li>
              • Setiap aksi dapat memiliki ikon untuk memperjelas fungsinya
            </li>
            <li>• Step yang sedang aktif menampilkan progress indicator</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkflowStepIndicatorLargeExample;
