import { CheckCircle2, Circle, Clock } from 'lucide-react';
import React from 'react';

interface Step {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'pending';
}

interface MiniStepperProps {
  steps: Step[];
  currentStep?: number;
  className?: string;
}

const MiniStepper: React.FC<MiniStepperProps> = ({
  steps = [],
  currentStep = 0,
  className = '',
}) => {
  if (!steps || steps.length === 0) {
    return null;
  }

  const getStepIcon = (step: Step, index: number) => {
    if (step.status === 'completed' || index < currentStep) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    } else if (step.status === 'current' || index === currentStep) {
      return <Clock className="h-4 w-4 text-blue-500" />;
    } else {
      return <Circle className="h-4 w-4 text-gray-300" />;
    }
  };

  const getStepColor = (step: Step, index: number) => {
    if (step.status === 'completed' || index < currentStep) {
      return 'text-green-600';
    } else if (step.status === 'current' || index === currentStep) {
      return 'text-blue-600';
    } else {
      return 'text-gray-400';
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex items-center space-x-1">
            {getStepIcon(step, index)}
            <span
              className={`text-xs font-medium ${getStepColor(step, index)}`}
            >
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="h-0.5 w-8 bg-gray-200" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default MiniStepper;
