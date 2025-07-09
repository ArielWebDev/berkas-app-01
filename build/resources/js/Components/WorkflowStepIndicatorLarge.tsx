import { CheckCircle2, Circle, Clock, User } from 'lucide-react';
import React from 'react';
import { CheckCircle, Clock, User, FileText, Scale, CheckCircle2 } from 'lucide-react';

interface WorkflowStepIndicatorLargeProps {
  currentStatus: string;
  assignedUsers?: {
    staf_input?: { name: string };
    admin_kredit?: { name: string };
    analis?: { name: string };
    pemutus?: { name: string };
  };
}

const WorkflowStepIndicatorLarge: React.FC<WorkflowStepIndicatorLargeProps> = ({
  currentStatus,
  assignedUsers = {},
}) => {
  const steps = [
    {
      id: 'diajukan',
      label: 'Input Pengajuan',
      description: 'Staf input membuat pengajuan pinjaman',
      icon: FileText,
      user: assignedUsers.staf_input?.name,
    },
    {
      id: 'diperiksa',
      label: 'Review Admin Kredit',
      description: 'Admin kredit memeriksa dan melengkapi berkas',
      icon: User,
      user: assignedUsers.admin_kredit?.name,
    },
    {
      id: 'dianalisis',
      label: 'Analisis Lapangan',
      description: 'Analis melakukan survei dan analisis lapangan',
      icon: CheckCircle,
      user: assignedUsers.analis?.name,
    },
    {
      id: 'siap_diputuskan',
      label: 'Keputusan Akhir',
      description: 'Pemutus memberikan keputusan final',
      icon: Scale,
      user: assignedUsers.pemutus?.name,
    },
    {
      id: 'disetujui',
      label: 'Selesai',
      description: 'Pinjaman telah disetujui dan selesai',
      icon: CheckCircle2,
      user: null,
    },
  ];

  const getStepStatus = (stepId: string) => {
    const statusOrder = ['diajukan', 'diperiksa', 'dianalisis', 'siap_diputuskan', 'disetujui'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepId);

    if (currentStatus === 'ditolak') {
      // Jika ditolak, tampilkan hingga step terakhir yang diproses
      return stepIndex <= currentIndex ? 'completed' : 'pending';
    }

    if (currentStatus === 'dikembalikan') {
      // Jika dikembalikan, kembali ke step awal
      return stepIndex === 0 ? 'current' : 'pending';
    }

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const getStepClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          container: 'bg-green-50 border-green-200',
          icon: 'bg-green-500 text-white',
          title: 'text-green-800',
          description: 'text-green-600',
        };
      case 'current':
        return {
          container: 'bg-blue-50 border-blue-200',
          icon: 'bg-blue-500 text-white',
          title: 'text-blue-800',
          description: 'text-blue-600',
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200',
          icon: 'bg-gray-300 text-gray-500',
          title: 'text-gray-500',
          description: 'text-gray-400',
        };
    }
  };

  return (
    <div className="space-y-4">
      {currentStatus === 'dikembalikan' && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Berkas Dikembalikan</h4>
              <p className="text-sm text-red-600">Berkas perlu diperbaiki dan diajukan kembali</p>
            </div>
          </div>
        </div>
      )}

      {currentStatus === 'ditolak' && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <div className="flex items-center">
            <CheckCircle2 className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Pinjaman Ditolak</h4>
              <p className="text-sm text-red-600">Pengajuan pinjaman telah ditolak</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const classes = getStepClasses(status);
          const IconComponent = step.icon;

          return (
            <div key={step.id} className="relative">
              <div className={`rounded-lg border p-4 ${classes.container}`}>
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 rounded-full p-2 ${classes.icon}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-medium ${classes.title}`}>
                      {step.label}
                    </h3>
                    <p className={`text-xs mt-1 ${classes.description}`}>
                      {step.description}
                    </p>
                    {step.user && (
                      <p className={`text-xs mt-2 font-medium ${classes.title}`}>
                        👤 {step.user}
                      </p>
                    )}
                    {status === 'current' && !step.user && (
                      <p className="text-xs mt-2 text-orange-600 font-medium">
                        🕐 Menunggu diambil
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <div className={`w-8 h-0.5 ${
                    status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                  }`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowStepIndicatorLarge;
