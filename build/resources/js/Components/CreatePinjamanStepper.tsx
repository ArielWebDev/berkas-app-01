import { Badge } from '@/Components/ui/badge';
import { Card, CardContent } from '@/Components/ui/card';
import { cn } from '@/lib/utils';
import { CheckIcon } from '@heroicons/react/24/solid';
import React from 'react';

export interface CreateStepData {
  id: number;
  name: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
  icon?: React.ReactNode;
}

interface CreatePinjamanStepperProps {
  steps: CreateStepData[];
  currentStep: number;
  className?: string;
}

const CreatePinjamanStepper: React.FC<CreatePinjamanStepperProps> = ({
  steps,
  currentStep,
  className,
}) => {
  const getStepStatusColor = (status: CreateStepData['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'active':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'pending':
        return 'text-gray-400 bg-gray-100 border-gray-200';
      default:
        return 'text-gray-400 bg-gray-100 border-gray-200';
    }
  };

  const getConnectorColor = (index: number) => {
    if (index < currentStep - 1) {
      return 'bg-green-300';
    } else if (index === currentStep - 1) {
      return 'bg-blue-300';
    } else {
      return 'bg-gray-200';
    }
  };

  return (
    <Card className={cn('mb-6 w-full', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center space-y-2">
                {/* Step Circle */}
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200',
                    getStepStatusColor(step.status)
                  )}
                >
                  {step.status === 'completed' ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>

                {/* Step Info */}
                <div className="max-w-24 text-center">
                  <div
                    className={cn(
                      'text-sm font-medium',
                      step.status === 'active'
                        ? 'text-blue-600'
                        : step.status === 'completed'
                          ? 'text-green-600'
                          : 'text-gray-500'
                    )}
                  >
                    {step.name}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {step.description}
                  </div>
                </div>

                {/* Status Badge */}
                <Badge
                  variant={
                    step.status === 'completed'
                      ? 'success'
                      : step.status === 'active'
                        ? 'primary'
                        : 'secondary'
                  }
                  className="text-xs"
                >
                  {step.status === 'completed'
                    ? 'Selesai'
                    : step.status === 'active'
                      ? 'Aktif'
                      : 'Menunggu'}
                </Badge>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="mx-4 flex-1">
                  <div
                    className={cn(
                      'h-0.5 w-full transition-all duration-300',
                      getConnectorColor(index)
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePinjamanStepper;
