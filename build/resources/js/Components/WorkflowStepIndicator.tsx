import { CheckCircle2, Circle, Clock } from 'lucide-react';
import React from 'react';

interface WorkflowStepIndicatorProps {
  currentStatus: string;
  className?: string;
  showLabels?: boolean;
}

const WorkflowStepIndicator: React.FC<WorkflowStepIndicatorProps> = ({
  currentStatus,
  className = '',
  showLabels = false,
}) => {
  const steps = [
    { id: 'diajukan', label: 'Input', icon: '📝' },
    { id: 'diperiksa', label: 'Review', icon: '🔍' },
    { id: 'dianalisis', label: 'Analisis', icon: '📊' },
    { id: 'siap_diputuskan', label: 'Keputusan', icon: '⚖️' },
    { id: 'disetujui', label: 'Selesai', icon: '✅' },
  ];

  const getStepStatus = (stepId: string) => {
    const statusOrder = ['diajukan', 'diperiksa', 'dianalisis', 'siap_diputuskan', 'disetujui'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepId);

    if (currentStatus === 'ditolak' || currentStatus === 'dikembalikan') {
      return stepIndex === 0 ? 'current' : 'pending';
    }

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const getStepClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'current':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {steps.map((step, index) => {
        const status = getStepStatus(step.id);
        return (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium ${getStepClasses(
                status
              )}`}
              title={`${step.label} ${status === 'completed' ? '✓' : status === 'current' ? '→' : ''}`}
            >
              <span className="text-xs">{step.icon}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-3 ${
                  status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WorkflowStepIndicator;
