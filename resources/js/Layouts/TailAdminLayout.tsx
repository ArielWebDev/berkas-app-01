import { User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
  Bell,
  ChevronDown,
  FileText,
  Home,
  LogOut,
  Menu,
  Search,
  Settings,
  Users,
  X,
} from 'lucide-react';
import React, { useState } from 'react';

interface TailAdminLayoutProps {
  children: React.ReactNode;
  user?: User;
  title?: string;
}

const TailAdminLayout: React.FC<TailAdminLayoutProps> = ({
  children,
  user,
  title = 'Dashboard',
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      current: window.location.pathname === '/dashboard',
    },
    {
      name: 'Pinjaman',
      href: '/pinjaman',
      icon: FileText,
      current: window.location.pathname.startsWith('/pinjaman'),
    },
    {
      name: 'Nasabah',
      href: '/nasabah',
      icon: Users,
      current: window.location.pathname.startsWith('/nasabah'),
    },
  ];

  // Add Users menu only for admin
  if (user?.role === 'admin') {
    navigation.push({
      name: 'Users',
      href: '/users',
      icon: Settings,
      current: window.location.pathname.startsWith('/users'),
    });
  }

  return (
    <>
      <Head title={title} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile sidebar */}
        <div
          className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}
        >
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white dark:bg-gray-800">
            <div className="absolute right-0 top-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="h-0 flex-1 overflow-y-auto pb-4 pt-5">
              <div className="flex flex-shrink-0 items-center px-4">
                <img
                  className="h-8 w-auto"
                  src="/images/logo.png"
                  alt="Berkas App"
                />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                  Berkas App
                </span>
              </div>
              <nav className="mt-5 space-y-1 px-2">
                {navigation.map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      item.current
                        ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                    } group flex items-center rounded-md px-2 py-2 text-base font-medium`}
                  >
                    <item.icon
                      className={`${
                        item.current
                          ? 'text-blue-500 dark:text-blue-300'
                          : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                      } mr-4 h-6 w-6 flex-shrink-0`}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
              <div className="flex flex-shrink-0 items-center px-4">
                <img
                  className="h-8 w-auto"
                  src="/images/logo.png"
                  alt="Berkas App"
                />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                  Berkas App
                </span>
              </div>
              <nav className="mt-5 flex-1 space-y-1 bg-white px-2 dark:bg-gray-800">
                {navigation.map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      item.current
                        ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                    } group flex items-center rounded-md px-2 py-2 text-sm font-medium`}
                  >
                    <item.icon
                      className={`${
                        item.current
                          ? 'text-blue-500 dark:text-blue-300'
                          : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                      } mr-3 h-6 w-6 flex-shrink-0`}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="md:pl-64">
          {/* Top navigation */}
          <div className="sticky top-0 z-10 bg-white shadow dark:bg-gray-800">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <button
                  type="button"
                  className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:border-gray-700 md:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div className="flex flex-1 justify-between px-4">
                  <div className="flex flex-1">
                    <form
                      className="flex w-full md:ml-0"
                      action="#"
                      method="GET"
                    >
                      <label htmlFor="search-field" className="sr-only">
                        Search
                      </label>
                      <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                          <Search className="h-5 w-5" />
                        </div>
                        <input
                          id="search-field"
                          className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 dark:bg-gray-800 dark:text-white sm:text-sm"
                          placeholder="Search"
                          type="search"
                          name="search"
                        />
                      </div>
                    </form>
                  </div>
                  <div className="ml-4 flex items-center md:ml-6">
                    {/* Notifications */}
                    <button
                      type="button"
                      className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-800"
                    >
                      <Bell className="h-6 w-6" />
                    </button>

                    {/* Profile dropdown */}
                    <div className="relative ml-3">
                      <div>
                        <button
                          type="button"
                          className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-800"
                          onClick={() =>
                            setProfileDropdownOpen(!profileDropdownOpen)
                          }
                        >
                          <img
                            className="h-8 w-8 rounded-full"
                            src={`https://ui-avatars.com/api/?name=${user?.name}&background=3b82f6&color=fff`}
                            alt={user?.name}
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                            {user?.name}
                          </span>
                          <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                      {profileDropdownOpen && (
                        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700">
                          <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                            <div className="font-medium">{user?.name}</div>
                            <div className="text-gray-500 dark:text-gray-400">
                              {user?.email}
                            </div>
                          </div>
                          <hr className="border-gray-100 dark:border-gray-600" />
                          <Link
                            href="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                          >
                            Profile
                          </Link>
                          <Link
                            href="/logout"
                            method="post"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default TailAdminLayout;
