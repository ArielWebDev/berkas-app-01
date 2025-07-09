import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';

export interface WorkflowStep {
  id: number;
  name: string;
  description?: string;
  status: 'completed' | 'active' | 'pending' | 'rejected';
  date?: string;
  user?: string;
  comment?: string;
  canEdit?: boolean;
}

export interface WorkflowAction {
  id: string;
  label: string;
  variant: 'primary' | 'success' | 'warning' | 'danger' | 'secondary';
  icon?: React.ReactNode;
}

interface WorkflowStepIndicatorModernProps {
  steps: WorkflowStep[];
  currentStep: number;
  variant?: 'horizontal' | 'vertical';
  showActions?: boolean;
  title?: string;
  actions?: WorkflowAction[];
  onAction?: (actionId: string, stepId: number) => void;
  className?: string;
}

const WorkflowStepIndicatorModern: React.FC<
  WorkflowStepIndicatorModernProps
> = ({
  steps,
  currentStep,
  variant = 'horizontal',
  showActions = false,
  title,
  actions = [],
  onAction,
  className,
}) => {
  const getStepStatusColor = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'active':
        return 'primary';
      case 'rejected':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getStepIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'rejected':
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'active':
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <span className="h-5 w-5 rounded-full border-2 border-current" />
        );
    }
  };

  if (variant === 'vertical') {
    return (
      <Card className={cn('p-6', className)}>
        <CardContent className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex gap-4"
            >
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full text-white',
                    step.status === 'completed' && 'bg-green-500',
                    step.status === 'active' && 'bg-blue-500',
                    step.status === 'rejected' && 'bg-red-500',
                    step.status === 'pending' && 'bg-gray-300'
                  )}
                >
                  {getStepIcon(step.status)}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'mt-2 h-8 w-0.5',
                      step.status === 'completed'
                        ? 'bg-green-300'
                        : 'bg-gray-200'
                    )}
                  />
                )}
              </div>

              {/* Step content */}
              <div className="flex-1 pb-8">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {step.name}
                  </h3>
                  <Badge variant={getStepStatusColor(step.status)} size="sm">
                    {step.status}
                  </Badge>
                </div>
                {step.description && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                )}
                {step.date && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    {step.date} {step.user && `• by ${step.user}`}
                  </p>
                )}
                {step.comment && (
                  <div className="mt-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {step.comment}
                    </p>
                  </div>
                )}
                {showActions &&
                  step.status === 'active' &&
                  actions.length > 0 && (
                    <div className="mt-3 flex gap-2">
                      {actions.map(action => (
                        <Button
                          key={action.id}
                          variant={action.variant}
                          size="sm"
                          icon={action.icon}
                          onClick={() => onAction?.(action.id, step.id)}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Horizontal variant
  return (
    <Card className={cn('p-6', className)}>
      <CardContent>
        {title && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
          </div>
        )}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              {/* Step indicator */}
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg',
                  step.status === 'completed' && 'bg-green-500',
                  step.status === 'active' && 'bg-blue-500',
                  step.status === 'rejected' && 'bg-red-500',
                  step.status === 'pending' && 'bg-gray-300'
                )}
              >
                {getStepIcon(step.status)}
              </div>

              {/* Step content */}
              <div className="mt-3">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {step.name}
                </h3>
                <Badge
                  variant={getStepStatusColor(step.status)}
                  size="sm"
                  className="mt-1"
                >
                  {step.status}
                </Badge>
                {step.date && (
                  <p className="mt-1 text-xs text-gray-500">{step.date}</p>
                )}
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'absolute mt-6 h-0.5 w-24',
                    step.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                  )}
                  style={{ left: '50%', transform: 'translateX(-50%)' }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Actions for current step */}
        {showActions && actions.length > 0 && (
          <div className="mt-6 flex justify-center gap-3">
            {actions.map(action => (
              <Button
                key={action.id}
                variant={action.variant}
                icon={action.icon}
                onClick={() => onAction?.(action.id, currentStep)}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkflowStepIndicatorModern;
