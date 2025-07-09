import { cn } from '@/lib/utils';
import React from 'react';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
  variant?: 'default' | 'bordered' | 'striped';
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, children, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'border-collapse border-spacing-0',
      bordered: 'border-collapse border border-gray-200 dark:border-gray-700',
      striped: 'border-collapse border-spacing-0',
    };

    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <table
          ref={ref}
          className={cn('w-full', variants[variant], className)}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';

interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn('bg-gray-50 dark:bg-gray-800', className)}
      {...props}
    >
      {children}
    </thead>
  )
);

TableHeader.displayName = 'TableHeader';

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, children, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn('divide-y divide-gray-200 dark:divide-gray-700', className)}
      {...props}
    >
      {children}
    </tbody>
  )
);

TableBody.displayName = 'TableBody';

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  hover?: boolean;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, hover = true, ...props }, ref) => {
    const hoverClasses = hover
      ? 'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150'
      : '';

    return (
      <tr
        ref={ref}
        className={cn(hoverClasses, 'transition-all duration-300', className)}
        {...props}
      >
        {children}
      </tr>
    );
  }
);

TableRow.displayName = 'TableRow';

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  sortable?: boolean;
  sorted?: 'asc' | 'desc' | null;
  onSort?: () => void;
  variant?: 'default' | 'numeric' | 'action';
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  (
    {
      className,
      children,
      sortable,
      sorted,
      onSort,
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const sortIcon = sorted === 'asc' ? '↑' : sorted === 'desc' ? '↓' : '↕';

    const variants = {
      default:
        'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400',
      numeric:
        'px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400',
      action:
        'px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400',
    };

    return (
      <th
        ref={ref}
        className={cn(
          variants[variant],
          sortable &&
            'cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-300',
          className
        )}
        onClick={sortable ? onSort : undefined}
        {...props}
      >
        <div className="flex items-center gap-2">
          {children}
          {sortable && <span className="text-gray-400">{sortIcon}</span>}
        </div>
      </th>
    );
  }
);

TableHead.displayName = 'TableHead';

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  variant?: 'default' | 'numeric' | 'action';
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, children, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'px-6 py-4 text-sm text-gray-900 dark:text-gray-100',
      numeric:
        'px-6 py-4 text-sm text-gray-900 dark:text-gray-100 text-right font-mono',
      action: 'px-6 py-4 text-sm text-right',
    };

    return (
      <td ref={ref} className={cn(variants[variant], className)} {...props}>
        {children}
      </td>
    );
  }
);

TableCell.displayName = 'TableCell';

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow };
