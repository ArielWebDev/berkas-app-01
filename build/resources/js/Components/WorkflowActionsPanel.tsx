import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Modal, ModalFooter } from '@/Components/ui/modal';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

export interface WorkflowActionItem {
  id: string;
  label: string;
  description?: string;
  variant: 'primary' | 'success' | 'warning' | 'danger' | 'secondary';
  icon?: React.ReactNode;
  requiresComment?: boolean;
  confirmMessage?: string;
}

interface WorkflowActionsPanelProps {
  actions: WorkflowActionItem[];
  onAction: (actionId: string, comment?: string) => void;
  loading?: boolean;
  disabled?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

const WorkflowActionsPanel: React.FC<WorkflowActionsPanelProps> = ({
  actions = [],
  onAction,
  loading = false,
  disabled = false,
  title = 'Available Actions',
  description,
  className,
}) => {
  const [selectedAction, setSelectedAction] =
    useState<WorkflowActionItem | null>(null);
  const [comment, setComment] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleActionClick = (action: WorkflowActionItem) => {
    if (action.requiresComment || action.confirmMessage) {
      setSelectedAction(action);
      setShowConfirm(true);
    } else {
      onAction(action.id);
    }
  };

  const handleConfirmAction = () => {
    if (selectedAction) {
      onAction(selectedAction.id, comment);
      setShowConfirm(false);
      setSelectedAction(null);
      setComment('');
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setSelectedAction(null);
    setComment('');
  };

  if (actions.length === 0) {
    return (
      <Card className={cn('', className)}>
        <CardContent className="py-8 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <svg
              className="mx-auto mb-4 h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm">No actions available at this time</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={cn('', className)}>
        <CardHeader>
          <CardTitle size="md">{title}</CardTitle>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {actions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant={action.variant}
                  size="lg"
                  fullWidth
                  icon={action.icon}
                  loading={loading}
                  disabled={disabled}
                  onClick={() => handleActionClick(action)}
                  className="justify-start"
                >
                  <div className="flex-1 text-left">
                    <div className="font-medium">{action.label}</div>
                    {action.description && (
                      <div className="text-xs opacity-80">
                        {action.description}
                      </div>
                    )}
                  </div>
                  {action.requiresComment && (
                    <Badge variant="outline" size="sm">
                      Comment Required
                    </Badge>
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirm}
        onClose={handleCancel}
        title={
          selectedAction?.confirmMessage ? 'Confirm Action' : 'Add Comment'
        }
        description={
          selectedAction?.confirmMessage ||
          `Please provide a comment for: ${selectedAction?.label}`
        }
        size="md"
      >
        <div className="space-y-4">
          {selectedAction?.confirmMessage && (
            <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {selectedAction.confirmMessage}
              </p>
            </div>
          )}

          {selectedAction?.requiresComment && (
            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Comment *
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Enter your comment..."
                required={selectedAction?.requiresComment}
              />
            </div>
          )}
        </div>

        <ModalFooter>
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant={selectedAction?.variant || 'primary'}
            onClick={handleConfirmAction}
            disabled={selectedAction?.requiresComment && !comment.trim()}
            icon={selectedAction?.icon}
          >
            {selectedAction?.label}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default WorkflowActionsPanel;
