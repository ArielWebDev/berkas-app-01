import { LabelHTMLAttributes } from 'react';

interface InputLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  value?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function InputLabel({
  value,
  className = '',
  children,
  ...props
}: InputLabelProps) {
  return (
    <label
      {...props}
      className={`block text-sm font-medium text-gray-700 ${className}`}
    >
      {value ? value : children}
    </label>
  );
}
