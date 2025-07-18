import PinjamanDataTable from '@/Components/PinjamanDataTable';
import TailLayout from '@/Layouts/TailLayout';
import { PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react';

interface Nasabah {
  id: number;
  nama_lengkap: string;
  nama?: string;
  nik?: string;
  nomor_ktp: string;
  nomor_wa: string;
  alamat: string;
}

interface User {
  id: number;
  name: string;
}

interface Pinjaman {
  id: number;
  nasabah_id: number;
  nasabah: Nasabah;
  jumlah_pinjaman: number;
  tujuan_pinjaman?: string;
  jangka_waktu?: number;
  bunga?: number;
  status: string;
  staf_input?: User;
  admin_kredit?: User;
  analis?: User;
  pemutus?: User;
  created_at: string;
  updated_at: string;
}

interface PinjamanIndexProps extends PageProps {
  pinjaman: {
    data: Pinjaman[];
    links?: Array<{
      url?: string;
      label: string;
      active: boolean;
    }>;
    meta?: {
      current_page?: number;
      last_page?: number;
      per_page?: number;
      total?: number;
    };
  };
  filters: {
    search?: string;
    status?: string;
  };
  metadata?: {
    available_count: number;
    my_tasks_count: number;
    can_take_tasks: boolean;
  };
  currentUserRole?: string;
}

const PinjamanIndex: React.FC<PinjamanIndexProps> = ({
  auth,
  pinjaman,
  filters,
  metadata,
  currentUserRole,
}) => {
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null as number | null,
  });

  const [workflowDialog, setWorkflowDialog] = useState({
    open: false,
    id: null as number | null,
    action: '',
    title: '',
    message: '',
  });

  const handleDelete = (id: number): void => {
    setDeleteDialog({ open: true, id });
  };

  const handleWorkflowAction = (id: number, action: string): void => {
    let title = '';
    let message = '';

    switch (action) {
      case 'approve_review':
        title = 'Setujui untuk Analisis';
        message =
          'Apakah Anda yakin ingin menyetujui pengajuan ini untuk dilanjutkan ke tahap analisis?';
        break;
      case 'return_to_staff':
        title = 'Kembalikan ke Staf';
        message =
          'Apakah Anda yakin ingin mengembalikan pengajuan ini ke staf input?';
        break;
      case 'analyze_complete':
        title = 'Selesaikan Analisis';
        message =
          'Apakah Anda yakin analisis sudah selesai dan siap untuk diputuskan?';
        break;
      case 'return_to_admin':
        title = 'Kembalikan ke Admin Kredit';
        message = 'Apakah Anda yakin ingin mengembalikan ke admin kredit?';
        break;
      case 'approve_final':
        title = 'Setujui Pinjaman';
        message = 'Apakah Anda yakin ingin menyetujui pinjaman ini?';
        break;
      case 'reject_final':
        title = 'Tolak Pinjaman';
        message = 'Apakah Anda yakin ingin menolak pinjaman ini?';
        break;
    }

    setWorkflowDialog({ open: true, id, action, title, message });
  };

  const confirmDelete = (): void => {
    if (deleteDialog.id) {
      router.delete(`/pinjaman/${deleteDialog.id}`, {
        onSuccess: () => {
          setDeleteDialog({ open: false, id: null });
        },
        onError: () => {
          setDeleteDialog({ open: false, id: null });
        },
      });
    }
  };

  const confirmWorkflowAction = (): void => {
    if (workflowDialog.id && workflowDialog.action) {
      router.post(
        `/pinjaman/${workflowDialog.id}/workflow-action`,
        {
          action: workflowDialog.action,
        },
        {
          onSuccess: () => {
            setWorkflowDialog({
              open: false,
              id: null,
              action: '',
              title: '',
              message: '',
            });
          },
          onError: () => {
            setWorkflowDialog({
              open: false,
              id: null,
              action: '',
              title: '',
              message: '',
            });
          },
        }
      );
    }
  };

  const canCreatePinjaman =
    auth.user.role === 'staf_input' || auth.user.role === 'admin';

  return (
    <TailLayout>
      <Head title="Daftar Pinjaman" />

      <div className="p-6">
        <PinjamanDataTable
          data={pinjaman?.data || []}
          canCreate={canCreatePinjaman}
          onDelete={handleDelete}
          currentUserRole={currentUserRole}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {deleteDialog.open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Konfirmasi Hapus
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Apakah Anda yakin ingin menghapus pinjaman ini? Tindakan
                        ini tidak dapat dibatalkan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Hapus
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteDialog({ open: false, id: null })}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Action Confirmation Modal */}
      {workflowDialog.open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {workflowDialog.title}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {workflowDialog.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={confirmWorkflowAction}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Konfirmasi
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setWorkflowDialog({
                      open: false,
                      id: null,
                      action: '',
                      title: '',
                      message: '',
                    })
                  }
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </TailLayout>
  );
};

export default PinjamanIndex;
