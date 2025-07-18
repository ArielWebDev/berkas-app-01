import { Badge } from '@/Components/ui/badge';
import React from 'react';

interface StatusBadgeProps {
  status:
    | 'diajukan'
    | 'diproses'
    | 'disetujui'
    | 'ditolak'
    | 'dibayar'
    | 'lunas'
    | string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = '',
}) => {
  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'diajukan':
        return 'warning';
      case 'diproses':
        return 'info';
      case 'disetujui':
        return 'success';
      case 'ditolak':
        return 'danger';
      case 'dibayar':
        return 'primary';
      case 'lunas':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'diajukan':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'diproses':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'disetujui':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ditolak':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'dibayar':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'lunas':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Badge
      variant={getStatusVariant(status)}
      className={`${getStatusStyle(status)} ${className}`}
    >
      {status}
    </Badge>
  );
};

export default StatusBadge;
