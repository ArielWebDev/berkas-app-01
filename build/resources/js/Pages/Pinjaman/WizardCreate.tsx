import MaterialLayout from '@/Layouts/MaterialLayout';
import { PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
  Assignment,
  AttachMoney,
  CheckCircle,
  CloudUpload,
  Description,
  ExpandLess,
  ExpandMore,
  Person,
  Search,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

interface WizardCreateProps extends PageProps {
  nasabah: Array<{
    id: number;
    nama_lengkap: string;
    nomor_ktp: string;
  }>;
}

interface StepProps {
  activeStep: number;
  steps: any[];
  data: any;
  setData: any;
  errors: any;
}

const steps = [
  {
    label: 'Pilih Nasabah',
    description: 'Pilih nasabah yang akan mengajukan pinjaman',
    icon: <Person />,
  },
  {
    label: 'Detail Pinjaman',
    description: 'Masukkan detail pinjaman yang diajukan',
    icon: <AttachMoney />,
  },
  {
    label: 'Upload Berkas',
    description: 'Upload berkas-berkas yang diperlukan',
    icon: <CloudUpload />,
  },
  {
    label: 'Review & Submit',
    description: 'Review data dan submit pengajuan',
    icon: <CheckCircle />,
  },
];

function NasabahStep({ data, setData, errors, nasabah }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNasabah, setSelectedNasabah] = useState<any>(null);

  const filteredNasabah = nasabah.filter(
    (n: any) =>
      n.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.nomor_ktp.includes(searchQuery)
  );

  const handleSelectNasabah = (nasabahData: any) => {
    setSelectedNasabah(nasabahData);
    setData('nasabah_id', nasabahData.id);
  };

  return (
    <Box>
      <TextField
        fullWidth
        label="Cari Nasabah"
        variant="outlined"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
        }}
        sx={{ mb: 2 }}
      />

      <Paper sx={{ maxHeight: 400, overflow: 'auto' }}>
        <List>
          {filteredNasabah.map((nasabahItem: any) => (
            <motion.div
              key={nasabahItem.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ListItem
                button
                onClick={() => handleSelectNasabah(nasabahItem)}
                selected={selectedNasabah?.id === nasabahItem.id}
                sx={{
                  border: selectedNasabah?.id === nasabahItem.id ? 2 : 0,
                  borderColor: 'primary.main',
                  borderRadius: 1,
                  mb: 1,
                  mx: 1,
                }}
              >
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {nasabahItem.nama_lengkap.charAt(0)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={nasabahItem.nama_lengkap}
                  secondary={`KTP: ${nasabahItem.nomor_ktp}`}
                />
                {selectedNasabah?.id === nasabahItem.id && (
                  <CheckCircle color="primary" />
                )}
              </ListItem>
            </motion.div>
          ))}
        </List>
      </Paper>

      {errors.nasabah_id && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errors.nasabah_id}
        </Alert>
      )}
    </Box>
  );
}

function DetailPinjamanStep({ data, setData, errors }: any) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Jumlah Pinjaman (Rp)"
          type="number"
          variant="outlined"
          value={data.jumlah_pinjaman}
          onChange={e => setData('jumlah_pinjaman', e.target.value)}
          error={!!errors.jumlah_pinjaman}
          helperText={errors.jumlah_pinjaman}
          InputProps={{
            startAdornment: (
              <AttachMoney sx={{ mr: 1, color: 'text.secondary' }} />
            ),
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Tujuan Penggunaan"
          multiline
          rows={3}
          variant="outlined"
          value={data.tujuan_penggunaan || ''}
          onChange={e => setData('tujuan_penggunaan', e.target.value)}
          placeholder="Jelaskan tujuan penggunaan dana pinjaman..."
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Jangka Waktu (Bulan)"
          type="number"
          variant="outlined"
          value={data.jangka_waktu || ''}
          onChange={e => setData('jangka_waktu', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          select
          label="Jenis Agunan"
          variant="outlined"
          value={data.jenis_agunan || ''}
          onChange={e => setData('jenis_agunan', e.target.value)}
        >
          <MenuItem value="bpkb">BPKB Kendaraan</MenuItem>
          <MenuItem value="sertifikat">Sertifikat Tanah</MenuItem>
          <MenuItem value="deposito">Deposito</MenuItem>
          <MenuItem value="lainnya">Lainnya</MenuItem>
        </TextField>
      </Grid>
    </Grid>
  );
}

function UploadBerkasStep({ data, setData, errors }: any) {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    'wajib'
  );

  const handleAddBerkas = (section: string) => {
    const currentBerkas = data.berkas || [];
    setData('berkas', [
      ...currentBerkas,
      { nama_berkas: '', file: null, section, required: section === 'wajib' },
    ]);
  };

  const handleRemoveBerkas = (index: number) => {
    const newBerkas = data.berkas.filter((_: any, i: number) => i !== index);
    setData('berkas', newBerkas);
  };

  const updateBerkas = (index: number, field: string, value: any) => {
    const newBerkas = [...(data.berkas || [])];
    newBerkas[index] = { ...newBerkas[index], [field]: value };
    setData('berkas', newBerkas);
  };

  const berkasWajib =
    data.berkas?.filter((b: any) => b.section === 'wajib') || [];
  const berkasTambahan =
    data.berkas?.filter((b: any) => b.section === 'tambahan') || [];

  return (
    <Box>
      {/* Berkas Wajib */}
      <Card sx={{ mb: 2 }}>
        <ListItem
          button
          onClick={() =>
            setExpandedSection(expandedSection === 'wajib' ? null : 'wajib')
          }
        >
          <ListItemIcon>
            <Assignment color="error" />
          </ListItemIcon>
          <ListItemText
            primary="Berkas Wajib"
            secondary={`${berkasWajib.length} berkas`}
          />
          {expandedSection === 'wajib' ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={expandedSection === 'wajib'}>
          <CardContent>
            {berkasWajib.map((berkas: any, index: number) => (
              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nama Berkas"
                    value={berkas.nama_berkas}
                    onChange={e =>
                      updateBerkas(
                        data.berkas.indexOf(berkas),
                        'nama_berkas',
                        e.target.value
                      )
                    }
                    placeholder="contoh: KTP, KK, Slip Gaji"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<CloudUpload />}
                  >
                    {berkas.file ? berkas.file.name : 'Pilih File'}
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={e =>
                        updateBerkas(
                          data.berkas.indexOf(berkas),
                          'file',
                          e.target.files?.[0] || null
                        )
                      }
                    />
                  </Button>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={() =>
                      handleRemoveBerkas(data.berkas.indexOf(berkas))
                    }
                  >
                    Hapus
                  </Button>
                </Grid>
              </Grid>
            ))}
            <Button
              variant="outlined"
              startIcon={<Description />}
              onClick={() => handleAddBerkas('wajib')}
            >
              Tambah Berkas Wajib
            </Button>
          </CardContent>
        </Collapse>
      </Card>

      {/* Berkas Tambahan */}
      <Card>
        <ListItem
          button
          onClick={() =>
            setExpandedSection(
              expandedSection === 'tambahan' ? null : 'tambahan'
            )
          }
        >
          <ListItemIcon>
            <Description color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Berkas Tambahan (Opsional)"
            secondary={`${berkasTambahan.length} berkas`}
          />
          {expandedSection === 'tambahan' ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={expandedSection === 'tambahan'}>
          <CardContent>
            {berkasTambahan.map((berkas: any, index: number) => (
              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nama Berkas"
                    value={berkas.nama_berkas}
                    onChange={e =>
                      updateBerkas(
                        data.berkas.indexOf(berkas),
                        'nama_berkas',
                        e.target.value
                      )
                    }
                    placeholder="contoh: Riwayat Bank, Surat Keterangan Usaha"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<CloudUpload />}
                  >
                    {berkas.file ? berkas.file.name : 'Pilih File'}
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={e =>
                        updateBerkas(
                          data.berkas.indexOf(berkas),
                          'file',
                          e.target.files?.[0] || null
                        )
                      }
                    />
                  </Button>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={() =>
                      handleRemoveBerkas(data.berkas.indexOf(berkas))
                    }
                  >
                    Hapus
                  </Button>
                </Grid>
              </Grid>
            ))}
            <Button
              variant="outlined"
              startIcon={<Description />}
              onClick={() => handleAddBerkas('tambahan')}
            >
              Tambah Berkas Tambahan
            </Button>
          </CardContent>
        </Collapse>
      </Card>

      {errors.berkas && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errors.berkas}
        </Alert>
      )}
    </Box>
  );
}

function ReviewStep({ data, nasabah }: any) {
  const selectedNasabah = nasabah.find((n: any) => n.id == data.nasabah_id);

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Data Nasabah
              </Typography>
              <Typography>
                <strong>Nama:</strong> {selectedNasabah?.nama_lengkap}
              </Typography>
              <Typography>
                <strong>KTP:</strong> {selectedNasabah?.nomor_ktp}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detail Pinjaman
              </Typography>
              <Typography>
                <strong>Jumlah:</strong> Rp{' '}
                {parseInt(data.jumlah_pinjaman || 0).toLocaleString('id-ID')}
              </Typography>
              <Typography>
                <strong>Tujuan:</strong> {data.tujuan_penggunaan || '-'}
              </Typography>
              <Typography>
                <strong>Jangka Waktu:</strong> {data.jangka_waktu || '-'} bulan
              </Typography>
              <Typography>
                <strong>Agunan:</strong> {data.jenis_agunan || '-'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Berkas yang Diupload ({data.berkas?.length || 0})
              </Typography>
              <List dense>
                {data.berkas?.map((berkas: any, index: number) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Description />
                    </ListItemIcon>
                    <ListItemText
                      primary={berkas.nama_berkas}
                      secondary={berkas.file?.name}
                    />
                    <Chip
                      label={berkas.section === 'wajib' ? 'Wajib' : 'Tambahan'}
                      color={berkas.section === 'wajib' ? 'error' : 'primary'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function WizardCreate({ auth, nasabah }: WizardCreateProps) {
  const [activeStep, setActiveStep] = useState(0);
  const { data, setData, post, processing, errors, progress } = useForm({
    nasabah_id: '',
    jumlah_pinjaman: '',
    tujuan_penggunaan: '',
    jangka_waktu: '',
    jenis_agunan: '',
    berkas: [{ nama_berkas: '', file: null, section: 'wajib', required: true }],
  });

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    post(route('pinjaman.store'));
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return data.nasabah_id !== '';
      case 1:
        return data.jumlah_pinjaman !== '';
      case 2:
        return data.berkas && data.berkas.length > 0;
      default:
        return true;
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <NasabahStep
            data={data}
            setData={setData}
            errors={errors}
            nasabah={nasabah}
          />
        );
      case 1:
        return (
          <DetailPinjamanStep data={data} setData={setData} errors={errors} />
        );
      case 2:
        return (
          <UploadBerkasStep data={data} setData={setData} errors={errors} />
        );
      case 3:
        return <ReviewStep data={data} nasabah={nasabah} />;
      default:
        return null;
    }
  };

  return (
    <MaterialLayout title="Wizard Pengajuan Pinjaman">
      <Head title="Buat Pengajuan Pinjaman" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Wizard Pengajuan Pinjaman
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
              Ikuti langkah-langkah berikut untuk membuat pengajuan pinjaman
              baru
            </Typography>

            {/* Progress Indicator */}
            <Box sx={{ mb: 4 }}>
              <LinearProgress
                variant="determinate"
                value={(activeStep / (steps.length - 1)) * 100}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Langkah {activeStep + 1} dari {steps.length}
              </Typography>
            </Box>

            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    icon={
                      <Avatar
                        sx={{
                          bgcolor:
                            index <= activeStep ? 'primary.main' : 'grey.300',
                          width: 40,
                          height: 40,
                        }}
                      >
                        {step.icon}
                      </Avatar>
                    }
                  >
                    <Typography variant="h6" fontWeight="medium">
                      {step.label}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {step.description}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box sx={{ my: 3 }}>{getStepContent(index)}</Box>
                      <Box sx={{ mb: 2 }}>
                        <Button
                          variant="contained"
                          onClick={
                            index === steps.length - 1
                              ? handleSubmit
                              : handleNext
                          }
                          disabled={!isStepValid(index) || processing}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {index === steps.length - 1
                            ? 'Submit Pengajuan'
                            : 'Lanjutkan'}
                        </Button>
                        <Button
                          disabled={index === 0 || processing}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Kembali
                        </Button>
                      </Box>
                    </motion.div>
                  </StepContent>
                </Step>
              ))}
            </Stepper>

            {/* Upload Progress */}
            <AnimatePresence>
              {progress && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box sx={{ mt: 3 }}>
                    <Alert severity="info">
                      <Typography variant="body2">
                        Mengupload berkas... {progress.percentage}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={progress.percentage}
                        sx={{ mt: 1 }}
                      />
                    </Alert>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </MaterialLayout>
  );
}
