import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  FolderPlus,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react';
import React from 'react';

interface QuickActionsProps {
  userRole: string;
  onAction?: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ userRole, onAction }) => {
  const getActionsForRole = () => {
    switch (userRole) {
      case 'staf_input':
        return [
          {
            id: 'create_pinjaman',
            title: 'Buat Pinjaman Baru',
            description: 'Input data pinjaman nasabah',
            icon: <FolderPlus className="h-5 w-5" />,
            variant: 'primary' as const,
            badge: 'Input',
          },
          {
            id: 'draft_pinjaman',
            title: 'Draft Pinjaman',
            description: 'Lanjutkan pinjaman yang belum selesai',
            icon: <FileText className="h-5 w-5" />,
            variant: 'secondary' as const,
            badge: 'Draft',
          },
        ];

      case 'admin_kredit':
        return [
          {
            id: 'review_berkas',
            title: 'Berkas Tersedia',
            description: 'Berkas baru yang siap direview',
            icon: <CheckCircle className="h-5 w-5" />,
            variant: 'primary' as const,
            badge: 'Available',
          },
          {
            id: 'my_tasks',
            title: 'Tugas Saya',
            description: 'Berkas yang sedang saya kerjakan',
            icon: <Clock className="h-5 w-5" />,
            variant: 'warning' as const,
            badge: 'My Tasks',
          },
        ];

      case 'analis':
        return [
          {
            id: 'analisa_kredit',
            title: 'Siap Analisa',
            description: 'Berkas yang siap untuk dianalisa',
            icon: <TrendingUp className="h-5 w-5" />,
            variant: 'primary' as const,
            badge: 'Available',
          },
          {
            id: 'my_tasks',
            title: 'Tugas Saya',
            description: 'Berkas yang sedang saya analisa',
            icon: <AlertCircle className="h-5 w-5" />,
            variant: 'warning' as const,
            badge: 'My Tasks',
          },
        ];

      case 'pemutus':
        return [
          {
            id: 'keputusan_kredit',
            title: 'Siap Diputuskan',
            description: 'Berkas yang siap untuk diputuskan',
            icon: <CheckCircle className="h-5 w-5" />,
            variant: 'primary' as const,
            badge: 'Available',
          },
          {
            id: 'my_tasks',
            title: 'Tugas Saya',
            description: 'Berkas yang sedang saya putuskan',
            icon: <XCircle className="h-5 w-5" />,
            variant: 'warning' as const,
            badge: 'My Tasks',
          },
        ];

      default:
        return [
          {
            id: 'view_pinjaman',
            title: 'Lihat Pinjaman',
            description: 'Daftar semua pinjaman',
            icon: <FileText className="h-5 w-5" />,
            variant: 'secondary' as const,
            badge: 'View',
          },
        ];
    }
  };

  const actions = getActionsForRole();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {actions.map(action => (
        <Card
          key={action.id}
          className="group cursor-pointer transition-all duration-300 hover:shadow-lg"
          onClick={() => onAction?.(action.id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-lg p-2 ${
                    action.variant === 'primary'
                      ? 'bg-blue-100 text-blue-600'
                      : action.variant === 'secondary'
                        ? 'bg-gray-100 text-gray-600'
                        : action.variant === 'warning'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {action.icon}
                </div>
                <CardTitle className="text-lg transition-colors group-hover:text-blue-600">
                  {action.title}
                </CardTitle>
              </div>
              <Badge variant={action.variant}>{action.badge}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{action.description}</p>
          </CardContent>
        </Card>
      ))}

      {/* Tambahan Quick Stats */}
      <Card className="col-span-full border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Role Aktif: {userRole.replace('_', ' ').toUpperCase()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Anda memiliki akses sesuai dengan role sebagai{' '}
            {userRole.replace('_', ' ')} dalam sistem workflow berkas pinjaman.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActions;
