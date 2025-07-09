import MaterialLayout from '@/Layouts/MaterialLayout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
  Add as AddIcon,
  Assignment,
  CheckCircle,
  People,
  Schedule,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';

interface DashboardData extends PageProps {
  statistics: {
    total_pinjaman: number;
    total_nasabah: number;
    pinjaman_pending: number;
    pinjaman_approved: number;
    total_amount: number;
  };
  recent_pinjaman: Array<{
    id: number;
    status: string;
    nasabah: { nama_lengkap: string };
    jumlah_pinjaman: number;
    created_at: string;
  }>;
  workflow_overview: {
    all_status: Record<string, number>;
    staff_workload: Record<string, number>;
  };
  recent_activity: Array<{
    id: number;
    description: string;
    user: { name: string };
    created_at: string;
    type: string;
  }>;
}

const StatusChip = ({ status }: { status: string }) => {
  const getStatusProps = (status: string) => {
    const statusMap = {
      diajukan: { color: 'info' as const, label: 'Diajukan' },
      diperiksa: { color: 'warning' as const, label: 'Diperiksa' },
      dikembalikan: { color: 'error' as const, label: 'Dikembalikan' },
      dianalisis: { color: 'primary' as const, label: 'Dianalisis' },
      siap_diputuskan: {
        color: 'secondary' as const,
        label: 'Siap Diputuskan',
      },
      disetujui: { color: 'success' as const, label: 'Disetujui' },
      ditolak: { color: 'error' as const, label: 'Ditolak' },
    };
    return (
      statusMap[status as keyof typeof statusMap] || {
        color: 'default' as const,
        label: status,
      }
    );
  };

  const { color, label } = getStatusProps(status);
  return <Chip label={label} color={color} size="small" />;
};

const StatCard = ({
  title,
  value,
  icon,
  color,
  trend,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={{ scale: 1.02 }}
  >
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {typeof value === 'number'
                ? value.toLocaleString('id-ID')
                : value}
            </Typography>
            {trend && (
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                {trend}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>{icon}</Avatar>
        </Box>
      </CardContent>
    </Card>
  </motion.div>
);

const WorkflowProgress = ({ data }: { data: Record<string, number> }) => {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Workflow Overview
        </Typography>
        <Box sx={{ mt: 2 }}>
          {Object.entries(data).map(([status, count]) => (
            <Box key={status} sx={{ mb: 2 }}>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography variant="body2" color="textSecondary">
                  {status.replace('_', ' ').toUpperCase()}
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {count}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={total > 0 ? (count / total) * 100 : 0}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default function Dashboard({
  auth,
  statistics,
  recent_pinjaman,
  workflow_overview,
  recent_activity,
}: DashboardData) {
  const { user } = auth;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const canCreatePinjaman = user.role === 'staf_input';
  const canViewUsers = user.role === 'admin';

  return (
    <MaterialLayout>
      <Head title="Dashboard" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Selamat datang, {user.name}! Kelola berkas pinjaman dengan mudah.
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Pinjaman"
              value={statistics.total_pinjaman}
              icon={<Assignment />}
              color="#1976d2"
              trend="+12% dari bulan lalu"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Nasabah"
              value={statistics.total_nasabah}
              icon={<People />}
              color="#2e7d32"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending Review"
              value={statistics.pinjaman_pending}
              icon={<Schedule />}
              color="#ed6c02"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Disetujui"
              value={statistics.pinjaman_approved}
              icon={<CheckCircle />}
              color="#2e7d32"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mt: 2,
                  }}
                >
                  {canCreatePinjaman && (
                    <Button
                      component={Link}
                      href="/pinjaman/create/wizard"
                      variant="contained"
                      startIcon={<AddIcon />}
                      fullWidth
                      size="large"
                    >
                      Buat Pengajuan Baru
                    </Button>
                  )}
                  <Button
                    component={Link}
                    href="/pinjaman"
                    variant="outlined"
                    startIcon={<ViewIcon />}
                    fullWidth
                  >
                    Lihat Semua Pinjaman
                  </Button>
                  {canViewUsers && (
                    <Button
                      component={Link}
                      href="/users"
                      variant="outlined"
                      startIcon={<People />}
                      fullWidth
                    >
                      Kelola Users
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Workflow Overview */}
          <Grid item xs={12} md={4}>
            <WorkflowProgress data={workflow_overview.all_status} />
          </Grid>

          {/* Recent Pinjaman */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pinjaman Terbaru
                </Typography>
                <List sx={{ pt: 0 }}>
                  {recent_pinjaman.slice(0, 5).map(pinjaman => (
                    <ListItem
                      key={pinjaman.id}
                      component={Link}
                      href={`/pinjaman/${pinjaman.id}`}
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Typography variant="body2" fontWeight="medium">
                              {pinjaman.nasabah.nama_lengkap}
                            </Typography>
                            <StatusChip status={pinjaman.status} />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="caption" color="textSecondary">
                              {formatCurrency(pinjaman.jumlah_pinjaman)}
                            </Typography>
                            <br />
                            <Typography variant="caption" color="textSecondary">
                              {formatDate(pinjaman.created_at)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Aktivitas Terbaru
                </Typography>
                <List>
                  {recent_activity.slice(0, 8).map((activity, index) => (
                    <ListItem
                      key={activity.id}
                      divider={index < recent_activity.length - 1}
                    >
                      <ListItemIcon>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {activity.user.name.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.description}
                        secondary={`${activity.user.name} • ${formatDate(activity.created_at)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>
    </MaterialLayout>
  );
}
