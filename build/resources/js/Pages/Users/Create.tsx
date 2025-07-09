import MaterialLayout from '@/Layouts/MaterialLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowBack, Save } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface Props {
  errors?: Record<string, string>;
}

export default function UsersCreate({ errors = {} }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    router.post('/users', formData, {
      onSuccess: () => {
        setSnackbar({
          open: true,
          message: 'User berhasil dibuat',
          severity: 'success',
        });
        router.visit('/users');
      },
      onError: () => {
        setSnackbar({
          open: true,
          message: 'Gagal membuat user',
          severity: 'error',
        });
        setIsSubmitting(false);
      },
      onFinish: () => {
        setIsSubmitting(false);
      },
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const goBack = () => {
    router.visit('/users');
  };

  return (
    <MaterialLayout>
      <Head title="Tambah User" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={goBack} variant="outlined">
            Kembali
          </Button>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Tambah User
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Buat pengguna baru untuk sistem
            </Typography>
          </Box>
        </Box>

        <Card>
          <CardContent>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ maxWidth: 600 }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Nama Lengkap"
                  required
                  fullWidth
                  value={formData.name}
                  onChange={e => handleChange('name', e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  disabled={isSubmitting}
                />

                <TextField
                  label="Email"
                  type="email"
                  required
                  fullWidth
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={isSubmitting}
                />

                <FormControl fullWidth required error={!!errors.role}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={formData.role}
                    label="Role"
                    onChange={e => handleChange('role', e.target.value)}
                    disabled={isSubmitting}
                  >
                    <MenuItem value="admin">Super Admin</MenuItem>
                    <MenuItem value="admin_kredit">Admin Kredit</MenuItem>
                    <MenuItem value="analis">Analis</MenuItem>
                    <MenuItem value="pemutus">Pemutus</MenuItem>
                  </Select>
                  {errors.role && (
                    <FormHelperText>{errors.role}</FormHelperText>
                  )}
                </FormControl>

                <TextField
                  label="Password"
                  type="password"
                  required
                  fullWidth
                  value={formData.password}
                  onChange={e => handleChange('password', e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password || 'Minimal 8 karakter'}
                  disabled={isSubmitting}
                />

                <TextField
                  label="Konfirmasi Password"
                  type="password"
                  required
                  fullWidth
                  value={formData.password_confirmation}
                  onChange={e =>
                    handleChange('password_confirmation', e.target.value)
                  }
                  error={!!errors.password_confirmation}
                  helperText={errors.password_confirmation}
                  disabled={isSubmitting}
                />

                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={isSubmitting}
                    size="large"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan User'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={goBack}
                    disabled={isSubmitting}
                    size="large"
                  >
                    Batal
                  </Button>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
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
}
