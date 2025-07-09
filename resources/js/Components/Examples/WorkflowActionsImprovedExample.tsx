import { CheckCircle2, MessageSquare, X } from 'lucide-react';
import React from 'react';

import WorkflowActionsImproved from '../WorkflowActionsImproved';

const WorkflowActionsImprovedExample: React.FC = () => {
  const customActions = [
    {
      id: 'approve_custom',
      label: 'Setuju & Lanjutkan',
      type: 'approve' as const,
      color: 'bg-green-600 hover:bg-green-700',
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
    {
      id: 'reject_custom',
      label: 'Tolak Pengajuan',
      type: 'reject' as const,
      color: 'bg-red-600 hover:bg-red-700',
      icon: <X className="h-4 w-4" />,
      requiresNote: true,
    },
    {
      id: 'revision',
      label: 'Butuh Revisi',
      type: 'request_info' as const,
      color: 'bg-orange-600 hover:bg-orange-700',
      icon: <MessageSquare className="h-4 w-4" />,
      requiresNote: true,
    },
  ];

  const handleAction = (actionId: string, note?: string) => {
    console.log('Action taken:', actionId, note ? 'with note:' : '', note);
    alert(`Action: ${actionId}${note ? `\nNote: ${note}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          WorkflowActionsImproved Examples
        </h1>

        <div className="space-y-8">
          {/* Example 1: With Custom Actions */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              With Custom Actions
            </h2>
            <WorkflowActionsImproved
              actions={customActions}
              onAction={handleAction}
            />
          </div>

          {/* Example 2: With Default Actions (empty array) */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              With Default Actions (Empty Array)
            </h2>
            <WorkflowActionsImproved actions={[]} onAction={handleAction} />
          </div>

          {/* Example 3: Without Actions Prop (undefined) */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Without Actions Prop (Default Actions)
            </h2>
            <WorkflowActionsImproved onAction={handleAction} />
          </div>

          {/* Example 4: Disabled State */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Disabled State
            </h2>
            <WorkflowActionsImproved
              actions={customActions}
              onAction={handleAction}
              disabled={true}
            />
          </div>

          {/* Example 5: Loading State */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Loading State
            </h2>
            <WorkflowActionsImproved
              actions={customActions}
              onAction={handleAction}
              loading={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowActionsImprovedExample;
