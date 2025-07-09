import { cn } from '@/lib/utils';
import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'outline';
  size?: 'sm' | 'md' | 'lg';
  pill?: boolean;
  glow?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      children,
      variant = 'default',
      size = 'md',
      pill = false,
      glow = false,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center font-medium transition-all duration-200';

    const variants = {
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      secondary:
        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      success:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      warning:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      info: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      outline:
        'border border-gray-300 bg-transparent text-gray-700 dark:border-gray-600 dark:text-gray-300',
    };

    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-2.5 py-1.5 text-sm',
      lg: 'px-3 py-2 text-base',
    };

    const roundedClasses = pill ? 'rounded-full' : 'rounded-lg';

    const glowClasses = glow
      ? {
          primary: 'shadow-lg shadow-blue-500/25',
          secondary: 'shadow-lg shadow-gray-500/25',
          success: 'shadow-lg shadow-green-500/25',
          warning: 'shadow-lg shadow-yellow-500/25',
          danger: 'shadow-lg shadow-red-500/25',
          info: 'shadow-lg shadow-cyan-500/25',
          default: 'shadow-lg shadow-gray-500/25',
          outline: '',
        }[variant]
      : '';

    return (
      <span
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          roundedClasses,
          glowClasses,
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
