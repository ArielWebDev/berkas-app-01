import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { AlertTriangle, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import React from 'react';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending' | 'rejected';
  user?: string;
  date?: string;
  role: string;
}

interface WorkflowProgressProps {
  currentStatus: string;
  assignedUsers?: {
    staf_input?: { name: string };
    admin_kredit?: { name: string };
    analis?: { name: string };
    pemutus?: { name: string };
  };
  userRole?: string;
  onStepAction?: (stepId: string, action: string) => void;
}

const WorkflowProgress: React.FC<WorkflowProgressProps> = ({
  currentStatus,
  assignedUsers,
  userRole,
  onStepAction,
}) => {
  const getStepStatus = (
    stepRole: string
  ): 'completed' | 'current' | 'pending' | 'rejected' => {
    const statusMap: Record<string, string[]> = {
      draft: [],
      input: ['staf_input'],
      berkas_review: ['staf_input'],
      berkas_approved: ['staf_input', 'admin_kredit'],
      analisa: ['staf_input', 'admin_kredit'],
      analisa_completed: ['staf_input', 'admin_kredit', 'analis'],
      keputusan: ['staf_input', 'admin_kredit', 'analis'],
      approved: ['staf_input', 'admin_kredit', 'analis', 'pemutus'],
      rejected: ['rejected'],
    };

    const completedRoles = statusMap[currentStatus] || [];

    if (currentStatus === 'rejected') {
      return 'rejected';
    }

    if (completedRoles.includes(stepRole)) {
      return 'completed';
    }

    // Tentukan step yang sedang aktif
    if (currentStatus === 'input' && stepRole === 'staf_input')
      return 'current';
    if (currentStatus === 'berkas_review' && stepRole === 'admin_kredit')
      return 'current';
    if (currentStatus === 'analisa' && stepRole === 'analis') return 'current';
    if (currentStatus === 'keputusan' && stepRole === 'pemutus')
      return 'current';

    return 'pending';
  };

  const steps: WorkflowStep[] = [
    {
      id: 'input',
      title: 'Input Berkas',
      description: 'Staff input memasukkan data dan berkas pinjaman nasabah',
      status: getStepStatus('staf_input'),
      role: 'staf_input',
      user: assignedUsers?.staf_input?.name,
    },
    {
      id: 'berkas_review',
      title: 'Review Berkas',
      description: 'Admin kredit memeriksa kelengkapan dan keabsahan berkas',
      status: getStepStatus('admin_kredit'),
      role: 'admin_kredit',
      user: assignedUsers?.admin_kredit?.name,
    },
    {
      id: 'analisa',
      title: 'Analisa Kredit',
      description: 'Analis melakukan analisa kelayakan dan risiko kredit',
      status: getStepStatus('analis'),
      role: 'analis',
      user: assignedUsers?.analis?.name,
    },
    {
      id: 'keputusan',
      title: 'Keputusan Akhir',
      description: 'Pemutus kredit memberikan keputusan final approve/reject',
      status: getStepStatus('pemutus'),
      role: 'pemutus',
      user: assignedUsers?.pemutus?.name,
    },
  ];

  const getStepIcon = (step: WorkflowStep) => {
    const iconProps = { className: 'h-5 w-5' };

    switch (step.status) {
      case 'completed':
        return (
          <CheckCircle {...iconProps} className="h-5 w-5 text-green-600" />
        );
      case 'current':
        return <Clock {...iconProps} className="h-5 w-5 text-blue-600" />;
      case 'rejected':
        return (
          <AlertTriangle {...iconProps} className="h-5 w-5 text-red-600" />
        );
      default:
        return <Clock {...iconProps} className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStepBadge = (step: WorkflowStep) => {
    switch (step.status) {
      case 'completed':
        return <Badge variant="success">Selesai</Badge>;
      case 'current':
        return <Badge variant="primary">Sedang Proses</Badge>;
      case 'rejected':
        return <Badge variant="danger">Ditolak</Badge>;
      default:
        return <Badge variant="secondary">Menunggu</Badge>;
    }
  };

  const canUserActOnStep = (step: WorkflowStep): boolean => {
    return userRole === step.role && step.status === 'current';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Alur Proses Berkas Pinjaman
        </h3>
        <Badge variant="outline" className="text-sm">
          Status: {currentStatus.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute bottom-12 left-8 top-12 w-0.5 bg-gray-200"></div>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.id} className="relative flex items-start space-x-4">
              {/* Step Icon */}
              <div
                className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 ${step.status === 'completed' ? 'border-green-200 bg-green-50' : ''} ${step.status === 'current' ? 'border-blue-200 bg-blue-50' : ''} ${step.status === 'rejected' ? 'border-red-200 bg-red-50' : ''} ${step.status === 'pending' ? 'border-gray-200 bg-gray-50' : ''} `}
              >
                {getStepIcon(step)}
              </div>

              {/* Step Content */}
              <div className="min-w-0 flex-1">
                <Card
                  className={` ${step.status === 'current' ? 'shadow-md ring-2 ring-blue-200' : ''} ${canUserActOnStep(step) ? 'border-blue-300' : ''} `}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">
                        {step.title}
                      </CardTitle>
                      {getStepBadge(step)}
                    </div>
                    {step.user && (
                      <p className="text-sm text-gray-600">
                        Ditangani oleh:{' '}
                        <span className="font-medium">{step.user}</span>
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3 text-sm text-gray-600">
                      {step.description}
                    </p>

                    {canUserActOnStep(step) && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => onStepAction?.(step.id, 'approve')}
                          className="rounded-md bg-green-100 px-3 py-1 text-xs font-medium text-green-700 transition-colors hover:bg-green-200"
                        >
                          Setujui
                        </button>
                        <button
                          onClick={() => onStepAction?.(step.id, 'reject')}
                          className="rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-200"
                        >
                          Tolak
                        </button>
                        <button
                          onClick={() => onStepAction?.(step.id, 'edit')}
                          className="rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-200"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-20 z-0">
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkflowProgress;
