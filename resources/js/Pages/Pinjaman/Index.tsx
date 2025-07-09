import MaterialLayout from '@/Layouts/MaterialLayout';
import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Add, Delete, Edit, Search, Visibility } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from '@mui/x-data-grid';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

interface Nasabah {
  id: number;
  nama_lengkap: string;
  nik: string;
  nomor_hp: string;
}

interface Pinjaman {
  id: number;
  nasabah_id: number;
  nasabah: Nasabah;
  jumlah_pinjaman: number;
  tujuan_pinjaman: string;
  jangka_waktu: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface PinjamanIndexProps extends PageProps {
  pinjaman: {
    data: Pinjaman[];
    links: any[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
  filters: {
    search?: string;
    status?: string;
  };
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

const PinjamanIndex: React.FC<PinjamanIndexProps> = ({
  auth,
  pinjaman,
  filters,
}) => {
  const [search, setSearch] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null as number | null,
  });
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'diajukan', label: 'Diajukan' },
    { value: 'diperiksa', label: 'Diperiksa' },
    { value: 'dikembalikan', label: 'Dikembalikan' },
    { value: 'dianalisis', label: 'Dianalisis' },
    { value: 'siap_diputuskan', label: 'Siap Diputuskan' },
    { value: 'disetujui', label: 'Disetujui' },
    { value: 'ditolak', label: 'Ditolak' },
  ];

  const getStatusColor = (status: string) => {
    const statusColors: Record<
      string,
      | 'default'
      | 'primary'
      | 'secondary'
      | 'error'
      | 'info'
      | 'success'
      | 'warning'
    > = {
      diajukan: 'info',
      diperiksa: 'warning',
      dikembalikan: 'error',
      dianalisis: 'primary',
      siap_diputuskan: 'secondary',
      disetujui: 'success',
      ditolak: 'error',
    };
    return statusColors[status] || 'default';
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleSearch = (): void => {
    router.get(
      '/pinjaman',
      {
        search,
        status: statusFilter,
      },
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };

  const handleReset = (): void => {
    setSearch('');
    setStatusFilter('');
    router.get(
      '/pinjaman',
      {},
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };

  const handleDelete = (id: number): void => {
    router.delete(`/pinjaman/${id}`, {
      onSuccess: () => {
        setSnackbar({
          open: true,
          message: 'Pinjaman berhasil dihapus',
          severity: 'success',
        });
        setDeleteDialog({ open: false, id: null });
      },
      onError: () => {
        setSnackbar({
          open: true,
          message: 'Gagal menghapus pinjaman',
          severity: 'error',
        });
        setDeleteDialog({ open: false, id: null });
      },
    });
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
    },
    {
      field: 'nasabah.nama_lengkap',
      headerName: 'Nama Nasabah',
      width: 200,
      valueGetter: params => params.row.nasabah?.nama_lengkap || 'N/A',
    },
    {
      field: 'nasabah.nik',
      headerName: 'NIK',
      width: 150,
      valueGetter: params => params.row.nasabah?.nik || 'N/A',
    },
    {
      field: 'jumlah_pinjaman',
      headerName: 'Jumlah Pinjaman',
      width: 150,
      renderCell: params => formatCurrency(params.value),
    },
    {
      field: 'tujuan_pinjaman',
      headerName: 'Tujuan',
      width: 150,
    },
    {
      field: 'jangka_waktu',
      headerName: 'Jangka Waktu',
      width: 120,
      renderCell: params => `${params.value} bulan`,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: params => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'created_at',
      headerName: 'Tanggal Dibuat',
      width: 130,
      renderCell: params => formatDate(params.value),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Aksi',
      width: 120,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="view"
          icon={
            <Tooltip title="Lihat Detail">
              <Visibility />
            </Tooltip>
          }
          label="Lihat"
          onClick={() => router.get(`/pinjaman/${params.id}`)}
        />,
        <GridActionsCellItem
          key="edit"
          icon={
            <Tooltip title="Edit">
              <Edit />
            </Tooltip>
          }
          label="Edit"
          onClick={() => router.get(`/pinjaman/${params.id}/edit`)}
          showInMenu
        />,
        <GridActionsCellItem
          key="delete"
          icon={
            <Tooltip title="Hapus">
              <Delete />
            </Tooltip>
          }
          label="Hapus"
          onClick={() =>
            setDeleteDialog({ open: true, id: params.id as number })
          }
          showInMenu
        />,
      ],
    },
  ];

  const canCreatePinjaman = auth.user.role === 'staf_input';

  return (
    <MaterialLayout>
      <Head title="Daftar Pinjaman" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Daftar Pinjaman
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Kelola semua pengajuan pinjaman nasabah
          </Typography>
        </Box>

        {/* Filter Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <TextField
                label="Cari Nasabah"
                value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 200 }}
              />
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  {statusOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={handleSearch}
                startIcon={<Search />}
              >
                Cari
              </Button>
              <Button variant="outlined" onClick={handleReset}>
                Reset
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Data Grid */}
        <Card>
          <DataGrid
            rows={pinjaman.data}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            paginationMode="server"
            rowCount={pinjaman.meta.total}
            paginationModel={{
              page: pinjaman.meta.current_page - 1,
              pageSize: pinjaman.meta.per_page,
            }}
            onPaginationModelChange={model => {
              router.get(
                '/pinjaman',
                {
                  page: model.page + 1,
                  per_page: model.pageSize,
                  search,
                  status: statusFilter,
                },
                {
                  preserveState: true,
                  preserveScroll: true,
                }
              );
            }}
            disableRowSelectionOnClick
            autoHeight
            sx={{
              '& .MuiDataGrid-root': {
                border: 'none',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #f0f0f0',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#fafafa',
                borderBottom: '2px solid #e0e0e0',
              },
            }}
          />
        </Card>

        {/* Floating Action Button */}
        {canCreatePinjaman && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Fab
              color="primary"
              aria-label="Tambah Pinjaman"
              component={Link}
              href="/pinjaman/create/wizard"
              sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 1000,
              }}
            >
              <Add />
            </Fab>
          </motion.div>
        )}
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          <Typography>
            Apakah Anda yakin ingin menghapus pinjaman ini? Tindakan ini tidak
            dapat dibatalkan.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, id: null })}
            color="inherit"
          >
            Batal
          </Button>
          <Button
            onClick={() => deleteDialog.id && handleDelete(deleteDialog.id)}
            color="error"
            variant="contained"
            autoFocus
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MaterialLayout>
  );
};

export default PinjamanIndex;
