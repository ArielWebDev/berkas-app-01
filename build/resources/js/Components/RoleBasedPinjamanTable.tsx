import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';
import {
  Calendar,
  CheckCircle,
  DollarSign,
  Edit,
  Eye,
  FileText,
  Trash2,
  User,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';

interface Pinjaman {
  id: number;
  nasabah: {
    nama_lengkap: string;
    nik: string;
  };
  jumlah_pinjaman: number;
  tujuan_pinjaman: string;
  status: string;
  tanggal_pengajuan: string;
  assigned_to?: {
    staf_input?: { name: string };
    admin_kredit?: { name: string };
    analis?: { name: string };
    pemutus?: { name: string };
  };
}

interface RoleBasedPinjamanTableProps {
  data: Pinjaman[];
  userRole: string;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  onTake?: (id: number) => void;
}

const RoleBasedPinjamanTable: React.FC<RoleBasedPinjamanTableProps> = ({
  data,
  userRole,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onTake,
}) => {
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: { variant: 'secondary' as const, label: 'Draft' },
      input: { variant: 'warning' as const, label: 'Input' },
      berkas_review: { variant: 'warning' as const, label: 'Review Berkas' },
      berkas_approved: { variant: 'primary' as const, label: 'Berkas OK' },
      analisa: { variant: 'primary' as const, label: 'Analisa' },
      analisa_completed: {
        variant: 'success' as const,
        label: 'Analisa Selesai',
      },
      keputusan: { variant: 'warning' as const, label: 'Menunggu Keputusan' },
      approved: { variant: 'success' as const, label: 'Disetujui' },
      rejected: { variant: 'danger' as const, label: 'Ditolak' },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || {
      variant: 'secondary' as const,
      label: status,
    };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const canUserEdit = (pinjaman: Pinjaman): boolean => {
    // Logika permission berdasarkan role dan status
    switch (userRole) {
      case 'staf_input':
        return ['draft', 'input'].includes(pinjaman.status);
      case 'admin_kredit':
        return ['berkas_review'].includes(pinjaman.status);
      case 'analis':
        return ['analisa'].includes(pinjaman.status);
      case 'pemutus':
        return ['keputusan'].includes(pinjaman.status);
      default:
        return false;
    }
  };

  const canUserApprove = (pinjaman: Pinjaman): boolean => {
    switch (userRole) {
      case 'admin_kredit':
        return pinjaman.status === 'berkas_review';
      case 'analis':
        return pinjaman.status === 'analisa';
      case 'pemutus':
        return pinjaman.status === 'keputusan';
      default:
        return false;
    }
  };

  const canUserDelete = (pinjaman: Pinjaman): boolean => {
    return (
      userRole === 'staf_input' && ['draft', 'input'].includes(pinjaman.status)
    );
  };

  const getActionButtons = (pinjaman: Pinjaman) => {
    const buttons = [];

    // View button - semua role bisa lihat
    buttons.push(
      <button
        key="view"
        onClick={() => onView?.(pinjaman.id)}
        className="rounded p-1 text-blue-600 hover:bg-blue-100 hover:text-blue-800"
        title="Lihat Detail"
      >
        <Eye className="h-4 w-4" />
      </button>
    );

    // Edit button - berdasarkan permission
    if (canUserEdit(pinjaman)) {
      buttons.push(
        <button
          key="edit"
          onClick={() => onEdit?.(pinjaman.id)}
          className="rounded p-1 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-800"
          title="Edit"
        >
          <Edit className="h-4 w-4" />
        </button>
      );
    }

    // Approve/Reject buttons
    if (canUserApprove(pinjaman)) {
      buttons.push(
        <button
          key="approve"
          onClick={() => onApprove?.(pinjaman.id)}
          className="rounded p-1 text-green-600 hover:bg-green-100 hover:text-green-800"
          title="Setujui"
        >
          <CheckCircle className="h-4 w-4" />
        </button>
      );
      buttons.push(
        <button
          key="reject"
          onClick={() => onReject?.(pinjaman.id)}
          className="rounded p-1 text-red-600 hover:bg-red-100 hover:text-red-800"
          title="Tolak"
        >
          <XCircle className="h-4 w-4" />
        </button>
      );
    }

    // Delete button
    if (canUserDelete(pinjaman)) {
      buttons.push(
        <button
          key="delete"
          onClick={() => onDelete?.(pinjaman.id)}
          className="rounded p-1 text-red-600 hover:bg-red-100 hover:text-red-800"
          title="Hapus"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      );
    }

    return buttons;
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let aValue: any = a;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let bValue: any = b;

      // Handle nested properties
      if (sortField.includes('.')) {
        const fields = sortField.split('.');
        fields.forEach(field => {
          aValue = aValue?.[field];
          bValue = bValue?.[field];
        });
      } else {
        aValue = a[sortField as keyof Pinjaman];
        bValue = b[sortField as keyof Pinjaman];
      }

      if (aValue == null || bValue == null) return 0;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);

  const getSortIcon = (field: string) => {
    if (sortField !== field) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Data Pinjaman ({userRole.replace('_', ' ').toUpperCase()})
        </CardTitle>
        <p className="text-sm text-gray-600">
          Total: {data.length} pinjaman | Role: {userRole.replace('_', ' ')}
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('nasabah.nama_lengkap')}
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nasabah {getSortIcon('nasabah.nama_lengkap')}
                  </div>
                </TableHead>
                <TableHead>NIK</TableHead>
                <TableHead
                  variant="numeric"
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('jumlah_pinjaman')}
                >
                  <div className="flex items-center justify-end gap-2">
                    <DollarSign className="h-4 w-4" />
                    Jumlah {getSortIcon('jumlah_pinjaman')}
                  </div>
                </TableHead>
                <TableHead>Tujuan</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('status')}
                >
                  Status {getSortIcon('status')}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('tanggal_pengajuan')}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Tanggal {getSortIcon('tanggal_pengajuan')}
                  </div>
                </TableHead>
                <TableHead variant="action">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map(pinjaman => (
                <TableRow key={pinjaman.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {pinjaman.nasabah.nama_lengkap}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {pinjaman.nasabah.nik}
                  </TableCell>
                  <TableCell variant="numeric" className="font-semibold">
                    {formatCurrency(pinjaman.jumlah_pinjaman)}
                  </TableCell>
                  <TableCell>
                    <span
                      className="block max-w-xs truncate"
                      title={pinjaman.tujuan_pinjaman}
                    >
                      {pinjaman.tujuan_pinjaman}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(pinjaman.status)}</TableCell>
                  <TableCell>
                    {formatDate(pinjaman.tanggal_pengajuan)}
                  </TableCell>
                  <TableCell variant="action">
                    <div className="flex items-center gap-1">
                      {getActionButtons(pinjaman)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {sortedData.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-8 w-8 text-gray-400" />
                      <p>Tidak ada data pinjaman</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleBasedPinjamanTable;
