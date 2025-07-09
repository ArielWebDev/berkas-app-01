import WorkflowActionsPanel, {
  type WorkflowActionItem,
} from '@/Components/WorkflowActionsPanel';
import WorkflowStepIndicatorModern, {
  type WorkflowStep,
} from '@/Components/WorkflowStepIndicatorModern';
import WorkflowTable, { type WorkflowItem } from '@/Components/WorkflowTable';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { cn } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

interface DashboardStats {
  total: number;
  pending: number;
  inReview: number;
  approved: number;
  rejected: number;
}

interface ModernWorkflowDashboardProps {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  };
  stats: DashboardStats;
  workflowItems: WorkflowItem[];
  userActions: WorkflowActionItem[];
  className?: string;
}

const ModernWorkflowDashboard: React.FC<ModernWorkflowDashboardProps> = ({
  auth,
  stats,
  workflowItems,
  userActions,
  className,
}) => {
  const [selectedItem, setSelectedItem] = useState<WorkflowItem | null>(null);

  const handleItemClick = (item: WorkflowItem) => {
    setSelectedItem(item);
  };

  const handleAction = (actionId: string, comment?: string) => {
    console.log(
      'Action:',
      actionId,
      'Comment:',
      comment,
      'Item:',
      selectedItem?.id
    );
    // Here you would typically make an API call to perform the action
  };

  const handleStatusChange = (itemId: number, newStatus: string) => {
    console.log('Status change:', itemId, newStatus);
    // Here you would typically make an API call to update the status
  };

  const getStatsCards = () => [
    {
      title: 'Total Items',
      value: stats.total,
      variant: 'default' as const,
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      title: 'Pending Review',
      value: stats.pending,
      variant: 'warning' as const,
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: 'In Review',
      value: stats.inReview,
      variant: 'info' as const,
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
    },
    {
      title: 'Approved',
      value: stats.approved,
      variant: 'success' as const,
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      variant: 'danger' as const,
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  // Mock workflow steps for demonstration
  const mockWorkflowSteps: WorkflowStep[] = [
    {
      id: 1,
      name: 'Application Submitted',
      description: 'Initial application received',
      status: 'completed',
      date: '2024-01-15 10:30',
      user: 'System',
    },
    {
      id: 2,
      name: 'Document Verification',
      description: 'Checking required documents',
      status: 'completed',
      date: '2024-01-16 14:20',
      user: 'Admin User',
    },
    {
      id: 3,
      name: 'Risk Assessment',
      description: 'Evaluating application risk',
      status: 'active',
      date: '2024-01-17 09:15',
      user: 'Risk Analyst',
    },
    {
      id: 4,
      name: 'Final Approval',
      description: 'Management approval',
      status: 'pending',
    },
  ];

  return (
    <>
      <Head title="Workflow Dashboard" />

      <div
        className={cn('min-h-screen bg-gray-50 dark:bg-gray-900', className)}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Workflow Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome back, {auth.user.name}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" size="sm">
                  {auth.user.role}
                </Badge>
                <Button variant="primary" size="sm">
                  New Application
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="p-6">
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5"
          >
            {getStatsCards().map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card variant="glass" hover>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div
                        className={cn(
                          'rounded-lg p-3',
                          stat.variant === 'success' &&
                            'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
                          stat.variant === 'warning' &&
                            'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
                          stat.variant === 'danger' &&
                            'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
                          stat.variant === 'info' &&
                            'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
                          stat.variant === 'default' &&
                            'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        )}
                      >
                        {stat.icon}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Workflow Table */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <WorkflowTable
                items={workflowItems}
                onItemClick={handleItemClick}
                onStatusChange={handleStatusChange}
                title="Recent Applications"
              />
            </motion.div>

            {/* Actions Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <WorkflowActionsPanel
                actions={userActions}
                onAction={handleAction}
                title={
                  selectedItem
                    ? `Actions for ${selectedItem.title}`
                    : 'Available Actions'
                }
                description={
                  selectedItem
                    ? `Manage ${selectedItem.applicant}'s application`
                    : 'Select an item to see available actions'
                }
              />
            </motion.div>
          </div>

          {/* Workflow Step Indicator */}
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <WorkflowStepIndicatorModern
                steps={mockWorkflowSteps}
                currentStep={3}
                variant="horizontal"
                title={`Workflow Progress: ${selectedItem.title}`}
              />
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default ModernWorkflowDashboard;
