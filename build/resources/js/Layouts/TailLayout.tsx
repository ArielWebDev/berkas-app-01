import TechStackBackground from '@/Components/TechStackBackground';
import TechStackToast from '@/Components/TechStackToast';
import { PageProps as BasePageProps, User } from '@/types';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  ArrowRightOnRectangleIcon,
  BanknotesIcon,
  Bars3Icon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
  UserIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Link, router, usePage } from '@inertiajs/react';
import React, { Fragment, ReactNode, useState } from 'react';

interface PageProps extends BasePageProps {
  auth: {
    user: User;
  };
}

interface TailLayoutProps {
  children: ReactNode;
}

const TailLayout: React.FC<TailLayoutProps> = ({ children }) => {
  const { auth } = usePage<PageProps>().props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTechToast, setShowTechToast] = useState(true);
  const currentPath = window.location.pathname;

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      current: currentPath === '/dashboard' || currentPath === '/',
    },
    {
      name: 'Workflow',
      href: '/workflow',
      icon: ClipboardDocumentListIcon,
      current: currentPath === '/workflow',
    },
    {
      name: 'Pinjaman',
      href: '/pinjaman',
      icon: BanknotesIcon,
      current: currentPath.startsWith('/pinjaman'),
    },
    {
      name: 'Nasabah',
      href: '/nasabah',
      icon: UsersIcon,
      current: currentPath.startsWith('/nasabah'),
    },
    ...(auth.user.role === 'admin' || auth.user.role === 'pemutus'
      ? [
          {
            name: 'Users',
            href: '/users',
            icon: UserIcon,
            current: currentPath.startsWith('/users'),
          },
        ]
      : []),
    {
      name: 'Reports',
      href: '/reports',
      icon: ChartBarIcon,
      current: currentPath.startsWith('/reports'),
    },
  ];

  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <>
      {/* Tech Stack Background Animation */}
      <TechStackBackground className="tech-stack-bg" />

      <div className="relative z-10">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>

                  {/* Mobile sidebar */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-slate-50 to-white px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-sm font-bold text-white">
                          B
                        </div>
                        <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                          BerkasApp
                        </h1>
                      </div>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-2">
                            {navigation.map(item => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className={`group flex transform gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 transition-all duration-200 hover:scale-105 ${
                                    item.current
                                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600'
                                  }`}
                                >
                                  <item.icon
                                    className={`h-6 w-6 shrink-0 transition-colors duration-200 ${
                                      item.current
                                        ? 'text-white'
                                        : 'text-gray-400 group-hover:text-indigo-600'
                                    }`}
                                    aria-hidden="true"
                                  />
                                  <span className="relative">
                                    {item.name}
                                    {item.current && (
                                      <span className="absolute -right-2 -top-1 h-2 w-2 rounded-full bg-white opacity-75"></span>
                                    )}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-gradient-to-b from-slate-50 to-white px-6 pb-4 shadow-lg">
            <div className="flex h-16 shrink-0 items-center border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-sm font-bold text-white">
                  B
                </div>
                <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                  BerkasApp
                </h1>
              </div>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-2">
                    {navigation.map(item => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`group flex transform gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 transition-all duration-200 hover:scale-105 ${
                            item.current
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                              : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600'
                          }`}
                        >
                          <item.icon
                            className={`h-6 w-6 shrink-0 transition-colors duration-200 ${
                              item.current
                                ? 'text-white'
                                : 'text-gray-400 group-hover:text-indigo-600'
                            }`}
                            aria-hidden="true"
                          />
                          <span className="relative">
                            {item.name}
                            {item.current && (
                              <span className="absolute -right-2 -top-1 h-2 w-2 rounded-full bg-white opacity-75"></span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="mt-auto border-t border-gray-200 pt-4">
                  <button
                    onClick={handleLogout}
                    className="group -mx-2 flex w-full transform gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600"
                  >
                    <ArrowRightOnRectangleIcon
                      className="h-6 w-6 shrink-0 text-gray-400 transition-colors duration-200 group-hover:text-red-600"
                      aria-hidden="true"
                    />
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white/80 px-4 shadow-sm backdrop-blur-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 rounded-lg p-2.5 text-gray-700 transition-colors duration-200 hover:bg-gray-100 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div
              className="h-6 w-px bg-gray-900/10 lg:hidden"
              aria-hidden="true"
            />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="relative flex flex-1 items-center">
                <div className="text-sm text-gray-500">
                  Welcome back,{' '}
                  <span className="font-semibold text-gray-900">
                    {auth.user.name}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <div>
                    <Menu.Button className="flex items-center gap-x-4 rounded-full p-2 transition-colors duration-200 hover:bg-gray-50">
                      <div className="hidden lg:flex lg:flex-col lg:items-end">
                        <div className="text-sm font-medium text-gray-900">
                          {auth.user.name}
                        </div>
                        <div className="text-xs capitalize text-gray-500">
                          {auth.user.role}
                        </div>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
                        <span className="text-sm font-medium">
                          {auth.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-white py-2 shadow-xl ring-1 ring-gray-200 ring-opacity-100 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/profile"
                            className={`${
                              active ? 'bg-gray-50' : ''
                            } flex items-center px-4 py-3 text-sm text-gray-700 transition-colors duration-200`}
                          >
                            <UserIcon className="mr-3 h-5 w-5 text-gray-400" />
                            Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <div className="my-1 h-px bg-gray-200"></div>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${
                              active
                                ? 'bg-red-50 text-red-600'
                                : 'text-gray-700'
                            } flex w-full items-center px-4 py-3 text-left text-sm transition-colors duration-200`}
                          >
                            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400" />
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>

          {/* Simple Footer */}
          <footer className="mt-8 border-t border-gray-200 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  © 2025 Berkas App - Professional Loan Management System
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Tech Stack Toast Notification */}
      {showTechToast && (
        <TechStackToast onClose={() => setShowTechToast(false)} />
      )}
    </>
  );
};

export default TailLayout;
