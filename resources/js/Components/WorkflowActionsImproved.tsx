import React, { useState } from 'react';

interface WorkflowActionsProps {
  pinjaman: any;
  user: any;
  onSuccess?: () => void;
}

interface Alert {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  show: boolean;
}

interface Modal {
  show: boolean;
  type: 'catatan' | 'reason' | 'decision' | null;
  title: string;
  placeholder: string;
  onConfirm: (value: string, decision?: string) => void;
}

const WorkflowActionsImproved: React.FC<WorkflowActionsProps> = ({
  pinjaman,
  user,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<Alert>({
    type: 'info',
    message: '',
    show: false,
  });
  const [modal, setModal] = useState<Modal>({
    show: false,
    type: null,
    title: '',
    placeholder: '',
    onConfirm: () => {},
  });
  const [inputValue, setInputValue] = useState('');
  const [decision, setDecision] = useState<string>('');

  const showAlert = (type: Alert['type'], message: string) => {
    setAlert({ type, message, show: true });
    setTimeout(() => {
      setAlert(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const showModal = (
    type: 'catatan' | 'reason' | 'decision',
    title: string,
    placeholder: string,
    onConfirm: (value: string, decision?: string) => void
  ) => {
    setModal({ show: true, type, title, placeholder, onConfirm });
    setInputValue('');
    setDecision('');
  };

  const closeModal = () => {
    setModal({
      show: false,
      type: null,
      title: '',
      placeholder: '',
      onConfirm: () => {},
    });
    setInputValue('');
    setDecision('');
  };

  const handleModalConfirm = () => {
    if (modal.type === 'decision') {
      if (!decision) {
        showAlert('error', 'Silakan pilih keputusan terlebih dahulu');
        return;
      }
      if (!inputValue || inputValue.length < 10) {
        showAlert('error', 'Catatan wajib diisi minimal 10 karakter');
        return;
      }
      modal.onConfirm(inputValue, decision);
    } else {
      if (!inputValue || inputValue.length < 10) {
        showAlert('error', 'Input wajib diisi minimal 10 karakter');
        return;
      }
      modal.onConfirm(inputValue);
    }
    closeModal();
  };

  const handleWorkflowAction = async (action: string, data: any = {}) => {
    setLoading(true);
    try {
      const response = await fetch(`/pinjaman/${pinjaman.id}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN':
            document
              .querySelector('meta[name="csrf-token"]')
              ?.getAttribute('content') || '',
        },
        body: JSON.stringify(data),
      });

      // Handle different response types
      let result;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        // Handle plain text or other response types
        const text = await response.text();
        result = { message: text };
      }

      if (response.ok && result.success !== false) {
        showAlert('success', result.message || `${action} berhasil`);
        if (onSuccess) onSuccess();
        // Auto refresh setelah 1 detik
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        // Handle error response
        const errorMessage =
          result.message || result.error || `${action} gagal`;
        showAlert('error', errorMessage);
        console.error('Workflow action error:', result);
      }
    } catch (error) {
      console.error('Network error:', error);
      showAlert('error', 'Terjadi kesalahan jaringan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const canTake = () => {
    // Sistem rebutan: user bisa take jika berkas tidak terkunci DAN statusnya sesuai
    if (pinjaman.locked_at) return false; // Berkas sudah dikunci

    switch (pinjaman.status) {
      case 'diajukan':
        // Semua admin_kredit bisa mengambil pinjaman yang belum di-lock
        return user.role === 'admin_kredit';
      case 'diperiksa':
        // Hanya admin_kredit yang assigned bisa mengambil berkas yang sudah diperiksa
        return (
          user.role === 'admin_kredit' && pinjaman.admin_kredit_id === user.id
        );
      case 'dianalisis':
        // Semua analis bisa mengambil berkas yang belum di-assign ATAU yang sudah di-assign ke mereka
        return (
          user.role === 'analis' &&
          (pinjaman.analis_id === null || pinjaman.analis_id === user.id)
        );
      case 'siap_diputuskan':
        // Semua pemutus bisa mengambil berkas yang belum di-assign ATAU yang sudah di-assign ke mereka
        return (
          user.role === 'pemutus' &&
          (pinjaman.pemutus_id === null || pinjaman.pemutus_id === user.id)
        );
      default:
        return false;
    }
  };

  const canRelease = () => {
    return pinjaman.locked_at && pinjaman.locked_by === user.id;
  };

  const canAdvance = () => {
    return (
      pinjaman.locked_at &&
      pinjaman.locked_by === user.id &&
      ((pinjaman.status === 'diperiksa' && user.role === 'admin_kredit') ||
        (pinjaman.status === 'dianalisis' && user.role === 'analis') ||
        (pinjaman.status === 'siap_diputuskan' && user.role === 'pemutus'))
    );
  };

  const canReturn = () => {
    return (
      pinjaman.locked_at &&
      pinjaman.locked_by === user.id &&
      (pinjaman.status === 'diperiksa' ||
        pinjaman.status === 'dianalisis' ||
        pinjaman.status === 'siap_diputuskan')
    );
  };

  const canDecide = () => {
    return (
      pinjaman.locked_at &&
      pinjaman.locked_by === user.id &&
      pinjaman.status === 'siap_diputuskan' &&
      user.role === 'pemutus'
    );
  };

  // Debug: Log status dan role untuk debugging
  const debugInfo = {
    status: pinjaman.status,
    role: user.role,
    locked_at: pinjaman.locked_at,
    locked_by: pinjaman.locked_by,
    user_id: user.id,
    canTake: canTake(),
    canRelease: canRelease(),
    canAdvance: canAdvance(),
    canReturn: canReturn(),
    canDecide: canDecide(),
  };

  console.log('DEBUG Workflow Actions:', debugInfo);

  // Debug: Analisis mengapa workflow tidak berfungsi
  const getWorkflowAnalysis = () => {
    const analysis = [];

    // Analisis untuk Take
    if (
      pinjaman.status === 'diajukan' &&
      user.role === 'admin_kredit' &&
      !pinjaman.locked_at
    ) {
      analysis.push('✅ Admin kredit bisa TAKE berkas baru (diajukan)');
    } else if (
      pinjaman.status === 'diperiksa' &&
      user.role === 'admin_kredit' &&
      pinjaman.admin_kredit_id === user.id &&
      !pinjaman.locked_at
    ) {
      analysis.push('✅ Admin kredit bisa TAKE berkas diperiksa (assigned)');
    } else if (
      pinjaman.status === 'dianalisis' &&
      user.role === 'analis' &&
      pinjaman.analis_id === user.id &&
      !pinjaman.locked_at
    ) {
      analysis.push('✅ Analis bisa TAKE berkas dianalisis (assigned)');
    } else if (
      pinjaman.status === 'siap_diputuskan' &&
      user.role === 'pemutus' &&
      pinjaman.pemutus_id === user.id &&
      !pinjaman.locked_at
    ) {
      analysis.push('✅ Pemutus bisa TAKE berkas siap_diputuskan (assigned)');
    } else {
      analysis.push(
        '❌ Tidak bisa TAKE berkas - cek status/role/assignment/lock'
      );
    }

    // Analisis untuk Advance/Return
    if (
      pinjaman.status === 'diperiksa' &&
      user.role === 'admin_kredit' &&
      pinjaman.locked_by === user.id
    ) {
      analysis.push('✅ Admin kredit bisa ADVANCE/RETURN berkas diperiksa');
    } else if (
      pinjaman.status === 'dianalisis' &&
      user.role === 'analis' &&
      pinjaman.locked_by === user.id
    ) {
      analysis.push('✅ Analis bisa ADVANCE/RETURN berkas dianalisis');
    } else if (
      pinjaman.status === 'siap_diputuskan' &&
      user.role === 'pemutus' &&
      pinjaman.locked_by === user.id
    ) {
      analysis.push('✅ Pemutus bisa DECIDE/RETURN berkas siap_diputuskan');
    } else {
      analysis.push(
        '❌ Tidak bisa ADVANCE/RETURN - berkas tidak dikunci oleh user ini'
      );
    }

    // Debug data
    analysis.push(
      `📋 Data: Status=${pinjaman.status}, Role=${user.role}, UserID=${user.id}`
    );
    analysis.push(
      `🔒 Lock: LockedBy=${pinjaman.locked_by}, LockedAt=${pinjaman.locked_at}`
    );
    analysis.push(
      `👥 Assignment: AdminKredit=${pinjaman.admin_kredit_id}, Analis=${pinjaman.analis_id}, Pemutus=${pinjaman.pemutus_id}`
    );

    return analysis;
  };

  console.log('DEBUG Workflow Analysis:', getWorkflowAnalysis());

  const AlertComponent = () => {
    if (!alert.show) return null;

    const alertClasses = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
    };

    return (
      <div className={`mb-4 rounded-lg border p-4 ${alertClasses[alert.type]}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {alert.type === 'success' && (
              <svg
                className="h-5 w-5 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {alert.type === 'error' && (
              <svg
                className="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {alert.type === 'warning' && (
              <svg
                className="h-5 w-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {alert.type === 'info' && (
              <svg
                className="h-5 w-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{alert.message}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <AlertComponent />

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          Aksi Workflow
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {/* Debug Info - akan dihapus nanti */}
          <div className="col-span-full mb-4 rounded-lg bg-gray-100 p-4 text-xs">
            <strong>DEBUG INFO:</strong>
            <br />
            Status: {pinjaman.status}
            <br />
            User Role: {user.role}
            <br />
            Locked At: {pinjaman.locked_at || 'null'}
            <br />
            Locked By: {pinjaman.locked_by || 'null'}
            <br />
            User ID: {user.id}
            <br />
            Can Take: {canTake() ? 'YES' : 'NO'}
            <br />
            Can Advance: {canAdvance() ? 'YES' : 'NO'}
            <br />
            Can Release: {canRelease() ? 'YES' : 'NO'}
            <br />
            Can Return: {canReturn() ? 'YES' : 'NO'}
            <br />
            Can Decide: {canDecide() ? 'YES' : 'NO'}
          </div>

          {canTake() && (
            <button
              onClick={() => handleWorkflowAction('take')}
              disabled={loading}
              className="flex items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Ambil Berkas'}
            </button>
          )}

          {canRelease() && (
            <button
              onClick={() => handleWorkflowAction('release')}
              disabled={loading}
              className="flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Lepas Berkas'}
            </button>
          )}

          {canAdvance() && (
            <button
              onClick={() => {
                showModal(
                  'catatan',
                  'Meneruskan Berkas',
                  'Masukkan catatan untuk meneruskan berkas...',
                  catatan => handleWorkflowAction('advance', { catatan })
                );
              }}
              disabled={loading}
              className="flex items-center justify-center rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Teruskan'}
            </button>
          )}

          {canReturn() && (
            <button
              onClick={() => {
                const reason = prompt('Alasan pengembalian:');
                if (reason) {
                  handleWorkflowAction('return', { reason });
                }
              }}
              disabled={loading}
              className="flex items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Kembalikan'}
            </button>
          )}

          {canDecide() && (
            <button
              onClick={() => {
                const decision = confirm('Setujui pinjaman ini?');
                const status = decision ? 'approved' : 'rejected';
                const reason = decision
                  ? 'Disetujui'
                  : prompt('Alasan penolakan:');
                if (reason) {
                  handleWorkflowAction('finalDecision', { status, reason });
                }
              }}
              disabled={loading}
              className="flex items-center justify-center rounded-lg bg-purple-500 px-4 py-2 text-white hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Putuskan'}
            </button>
          )}
        </div>

        {/* Info WhatsApp */}
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
          <div className="flex items-center">
            <svg
              className="mr-2 h-5 w-5 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-blue-800">
              <strong>Notifikasi WhatsApp:</strong> Setiap aksi workflow akan
              mengirim notifikasi otomatis ke admin/analis/pemutus di tahap
              berikutnya.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowActionsImproved;
