import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

export interface WorkflowItem {
  id: number;
  title: string;
  applicant: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'in_review' | 'completed';
  currentStep: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  lockedBy?: string;
}

interface WorkflowTableProps {
  items: WorkflowItem[];
  onItemClick?: (item: WorkflowItem) => void;
  onStatusChange?: (itemId: number, newStatus: string) => void;
  loading?: boolean;
  className?: string;
  title?: string;
  showActions?: boolean;
}

const WorkflowTable: React.FC<WorkflowTableProps> = ({
  items,
  onItemClick,
  onStatusChange,
  loading = false,
  className,
  title = 'Workflow Items',
  showActions = true,
}) => {
  const [sortField, setSortField] = useState<keyof WorkflowItem>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const getStatusColor = (status: WorkflowItem['status']) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'in_review':
        return 'warning';
      case 'pending':
        return 'info';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: WorkflowItem['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'danger';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSort = (field: keyof WorkflowItem) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue == null || bValue == null) return 0;
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [items, sortField, sortDirection]);

  if (loading) {
    return (
      <Card className={cn('', className)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Loading workflow items...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card className={cn('', className)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
              No workflow items found
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a new workflow item.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Badge variant="outline" size="sm">
          {items.length} items
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                sortable
                sorted={sortField === 'title' ? sortDirection : null}
                onSort={() => handleSort('title')}
              >
                Title
              </TableHead>
              <TableHead
                sortable
                sorted={sortField === 'applicant' ? sortDirection : null}
                onSort={() => handleSort('applicant')}
              >
                Applicant
              </TableHead>
              <TableHead
                sortable
                sorted={sortField === 'amount' ? sortDirection : null}
                onSort={() => handleSort('amount')}
                variant="numeric"
              >
                Amount
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Current Step</TableHead>
              <TableHead
                sortable
                sorted={sortField === 'updatedAt' ? sortDirection : null}
                onSort={() => handleSort('updatedAt')}
              >
                Last Updated
              </TableHead>
              <TableHead>Assigned To</TableHead>
              {showActions && <TableHead variant="action">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800',
                  item.lockedBy && 'bg-yellow-50 dark:bg-yellow-900/10'
                )}
                onClick={() => onItemClick?.(item)}
              >
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {item.title}
                    </div>
                    {item.lockedBy && (
                      <div className="text-xs text-yellow-600 dark:text-yellow-400">
                        🔒 Locked by {item.lockedBy}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{item.applicant}</TableCell>
                <TableCell variant="numeric">
                  {formatAmount(item.amount)}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(item.status)} size="sm">
                    {item.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getPriorityColor(item.priority)} size="sm">
                    {item.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.currentStep}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(item.updatedAt)}
                  </span>
                </TableCell>
                <TableCell>
                  {item.assignedTo ? (
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {item.assignedTo}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">Unassigned</span>
                  )}
                </TableCell>
                {showActions && (
                  <TableCell variant="action">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          onItemClick?.(item);
                        }}
                      >
                        View
                      </Button>
                      {!item.lockedBy && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={e => {
                            e.stopPropagation();
                            onStatusChange?.(item.id, 'in_review');
                          }}
                        >
                          Review
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default WorkflowTable;
