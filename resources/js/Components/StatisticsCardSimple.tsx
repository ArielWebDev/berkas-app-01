interface StatisticsCardProps {
  statistics: Record<string, number>;
  role: string;
}

export default function StatisticsCard({
  statistics,
  role,
}: StatisticsCardProps) {
  const getStatCards = () => {
    switch (role) {
      case 'staf_input':
        return [
          {
            label: 'Total Pengajuan',
            value: statistics.total_pengajuan || 0,
            color: 'blue',
          },
          {
            label: 'Sedang Proses',
            value: statistics.sedang_proses || 0,
            color: 'yellow',
          },
          {
            label: 'Disetujui',
            value: statistics.disetujui || 0,
            color: 'green',
          },
          {
            label: 'Ditolak',
            value: statistics.ditolak || 0,
            color: 'red',
          },
        ];
      case 'admin_kredit':
        return [
          {
            label: 'Tersedia Diambil',
            value: statistics.available || 0,
            color: 'blue',
          },
          {
            label: 'Tugas Saya',
            value: statistics.my_tasks || 0,
            color: 'yellow',
          },
          {
            label: 'Selesai Hari Ini',
            value: statistics.completed_today || 0,
            color: 'green',
          },
          {
            label: 'Total Diproses',
            value: statistics.total_diproses || 0,
            color: 'purple',
          },
        ];
      case 'analis':
        return [
          {
            label: 'Tersedia Diambil',
            value: statistics.available || 0,
            color: 'blue',
          },
          {
            label: 'Tugas Saya',
            value: statistics.my_tasks || 0,
            color: 'yellow',
          },
          {
            label: 'Selesai Hari Ini',
            value: statistics.completed_today || 0,
            color: 'green',
          },
          {
            label: 'Total Dianalisis',
            value: statistics.total_dianalisis || 0,
            color: 'purple',
          },
        ];
      case 'pemutus':
        return [
          {
            label: 'Tersedia Diambil',
            value: statistics.available || 0,
            color: 'blue',
          },
          {
            label: 'Tugas Saya',
            value: statistics.my_tasks || 0,
            color: 'yellow',
          },
          {
            label: 'Disetujui Hari Ini',
            value: statistics.approved_today || 0,
            color: 'green',
          },
          {
            label: 'Ditolak Hari Ini',
            value: statistics.rejected_today || 0,
            color: 'red',
          },
        ];
      default:
        // Admin role - overview semua
        return [
          {
            label: 'Diajukan',
            value: statistics.total_diajukan || 0,
            color: 'blue',
          },
          {
            label: 'Diproses',
            value:
              (statistics.total_diperiksa || 0) +
              (statistics.total_dianalisis || 0) +
              (statistics.total_siap_diputuskan || 0),
            color: 'yellow',
          },
          {
            label: 'Disetujui',
            value: statistics.total_disetujui || 0,
            color: 'green',
          },
          {
            label: 'Ditolak',
            value: statistics.total_ditolak || 0,
            color: 'red',
          },
        ];
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500';
  };

  const statCards = getStatCards();

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-md ${getColorClasses(stat.color)} text-white`}
                >
                  <span className="text-lg font-bold">{stat.value}</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {stat.value} item
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
