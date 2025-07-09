import { PageProps } from '@/types';
import {
  Bars3Icon,
  BellIcon,
  ChartBarIcon,
  CreditCardIcon,
  DocumentTextIcon,
  HomeIcon,
  UserGroupIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Link, router } from '@inertiajs/react';
import { ReactNode, useState } from 'react';

interface LayoutProps {
  children: ReactNode;
  user?: PageProps['auth']['user'];
}

interface NavigationItem {
  name: string;
  href: string;
  icon: typeof HomeIcon;
  current?: boolean;
}

export default function ModernLayout({ children, user }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Workflow', href: '/workflow', icon: ChartBarIcon },
    { name: 'Pinjaman', href: '/pinjaman', icon: CreditCardIcon },
    { name: 'Nasabah', href: '/nasabah', icon: UserGroupIcon },
    { name: 'Reports', href: '/reports', icon: DocumentTextIcon },
  ];

  // Get current path to determine active navigation
  const currentPath = window.location.pathname;
  const updatedNavigation = navigation.map(item => ({
    ...item,
    current: currentPath.startsWith(item.href),
  }));

  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10"></div>
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '60px 60px',
            }}
          ></div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`relative z-50 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        ></div>

        <div className="fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-slate-900/95 backdrop-blur-xl">
          <div className="flex h-16 shrink-0 items-center px-6">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600">
                <DocumentTextIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Berkas App</h1>
            </div>
            <button
              className="ml-auto text-white hover:text-slate-300"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <nav className="mt-8 px-3">
            <ul className="space-y-1">
              {updatedNavigation.map(item => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      item.current
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="border-r border-white/10 bg-slate-900/50 backdrop-blur-xl">
          <div className="flex h-16 shrink-0 items-center px-6">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600">
                <DocumentTextIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Berkas App</h1>
            </div>
          </div>

          <nav className="mt-8 px-3">
            <ul className="space-y-1">
              {updatedNavigation.map(item => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      item.current
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User profile section */}
          {user && (
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-sm font-semibold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {user.name}
                    </p>
                    <p className="text-xs capitalize text-slate-400">
                      {user.role.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-xs text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-40 border-b border-white/10 bg-slate-900/50 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-x-4 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-slate-300 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-white/10 lg:hidden" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                {/* Add any top bar content here */}
              </div>

              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-300"
                >
                  <BellIcon className="h-6 w-6" />
                </button>

                {/* Mobile user menu */}
                {user && (
                  <div className="lg:hidden">
                    <button
                      onClick={handleLogout}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-sm font-semibold text-white"
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="relative">{children}</main>
      </div>
    </div>
  );
}
