interface BerkasListProps {
    berkas: Array<{
        id: number;
        nama_berkas: string;
        path_file: string;
        diupload_oleh_role: string;
        created_at: string;
    }>;
    title?: string;
}

export default function BerkasList({ berkas, title = 'Daftar Berkas' }: BerkasListProps) {
    const getRoleLabel = (role: string) => {
        const roles = {
            staf_input: 'Staf Input',
            admin_kredit: 'Admin Kredit',
            analis: 'Analis',
        };
        return roles[role as keyof typeof roles] || role;
    };

    const getRoleColor = (role: string) => {
        const colors = {
            staf_input: 'bg-blue-100 text-blue-800',
            admin_kredit: 'bg-yellow-100 text-yellow-800',
            analis: 'bg-purple-100 text-purple-800',
        };
        return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-6">
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                    {title}
                </h3>
                {berkas.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Belum ada berkas yang diupload
                    </p>
                ) : (
                    <div className="space-y-4">
                        {berkas.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between rounded-md border border-gray-200 p-4 dark:border-gray-600"
                            >
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                        {item.nama_berkas}
                                    </h4>
                                    <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span
                                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getRoleColor(
                                                item.diupload_oleh_role,
                                            )}`}
                                        >
                                            {getRoleLabel(item.diupload_oleh_role)}
                                        </span>
                                        <span>•</span>
                                        <span>
                                            {new Date(item.created_at).toLocaleDateString(
                                                'id-ID',
                                                {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                },
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <a
                                        href={`/storage/${item.path_file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                    >
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
