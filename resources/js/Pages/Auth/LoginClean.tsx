import LoadingOverlay from '@/Components/LoadingOverlay';
import {
  useFormTransition,
  usePageTransition,
} from '@/hooks/usePageTransition';
import { Head, Link, useForm } from '@inertiajs/react';
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  FileText,
  Lock,
  Mail,
} from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

export default function LoginModern({
  status,
  canResetPassword,
}: {
  status?: string;
  canResetPassword: boolean;
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false as boolean,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Page transition hooks
  const { navigateWithTransition, getTransitionClasses, isExiting } =
    usePageTransition({
      enterAnimation: 'pageSlideIn',
      exitAnimation: 'pageFadeOut',
      enterDuration: 400,
      exitDuration: 300,
    });

  const { submitWithTransition, isSubmitting } = useFormTransition();

  useEffect(() => {
    // Quick entrance animation - no heavy loading
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const submit: FormEventHandler = e => {
    e.preventDefault();

    submitWithTransition(() => {
      post(route('login'), {
        onSuccess: () => {
          // Navigate to dashboard with transition after successful login
          // Replace history to prevent back navigation to login
          setTimeout(() => {
            window.history.replaceState(null, '', '/dashboard');
            navigateWithTransition('/dashboard');
          }, 500);
        },
        onFinish: () => reset('password'),
      });
    });
  };

  return (
    <>
      <Head title="Login - Berkas App" />

      <div
        className={`page-container relative min-h-screen overflow-hidden ${getTransitionClasses()}`}
      >
        {/* Dark Modern Animated Background for Login */}
        <div
          className="animate-gradient-shift animate-color-wave absolute inset-0 bg-gradient-to-br from-black via-blue-950 via-gray-900 via-purple-950 to-black"
          style={{
            background: `
                 linear-gradient(45deg, 
                   rgba(0, 0, 0, 0.95) 0%, 
                   rgba(17, 24, 39, 0.9) 25%,
                   rgba(59, 7, 100, 0.85) 50%,
                   rgba(30, 58, 138, 0.9) 75%,
                   rgba(0, 0, 0, 0.95) 100%
                 )
               `,
            backgroundSize: '400% 400%',
          }}
        >
          {/* Dark overlay for login focus */}
          <div className="animate-color-wave absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-gray-900/50"></div>
          <div className="animate-aurora-flow absolute inset-0 bg-gradient-to-br from-transparent via-purple-950/40 to-transparent"></div>

          {/* Dark theme parallax elements for login */}
          <div className="parallax-layer-1 absolute inset-0">
            {/* Dark floating orbs for login ambiance */}
            <div className="animate-parallax-float-1 animate-morphing-orb animate-breathing-glow absolute left-1/4 top-1/4 h-64 w-64 bg-gradient-to-r from-purple-900/20 to-blue-900/20 blur-3xl"></div>
            <div className="from-blue-950/18 to-purple-950/18 animate-parallax-float-2 animate-morphing-orb absolute right-1/4 top-3/4 h-80 w-80 bg-gradient-to-r blur-3xl"></div>
            <div className="from-purple-950/22 to-blue-900/22 animate-parallax-float-3 animate-morphing-orb absolute bottom-1/3 left-1/2 h-72 w-72 bg-gradient-to-r blur-3xl"></div>

            {/* Dark accent lights for login */}
            <div className="animate-parallax-float-2 animate-breathing-glow absolute right-16 top-16 h-32 w-32 rounded-full bg-gradient-to-r from-purple-800/25 to-blue-800/25 blur-2xl"></div>
            <div className="animate-parallax-float-1 absolute bottom-20 left-16 h-24 w-24 rounded-full bg-gradient-to-r from-blue-900/30 to-purple-900/30 blur-xl"></div>
          </div>

          {/* Dark flowing light effects for login */}
          <div className="parallax-layer-3 absolute inset-0">
            <div className="via-purple-700/18 animate-flowing-light absolute left-0 top-1/4 h-px w-full bg-gradient-to-r from-transparent to-transparent"></div>
            <div
              className="animate-flowing-light absolute bottom-1/3 left-0 h-px w-full bg-gradient-to-r from-transparent via-blue-700/15 to-transparent"
              style={{ animationDelay: '4s' }}
            ></div>
          </div>
        </div>

        {/* Enhanced Header with Back Button */}
        <div className="navbar-enhanced absolute left-0 right-0 top-0 z-20">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Back to Welcome */}
            <button
              onClick={() => navigateWithTransition('/')}
              className="nav-link-transition btn-transition group inline-flex items-center space-x-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-lg"
            >
              <ArrowRight className="h-4 w-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Kembali ke Beranda</span>
            </button>

            {/* Logo/Branding */}
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 shadow-lg shadow-purple-500/25">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-white">Berkas App</h1>
                <p className="text-xs text-slate-300">Login Portal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div
            className={`w-full max-w-md transition-all duration-700 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            }`}
          >
            {/* Login Card */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
              {/* Header */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h1 className="mb-2 text-3xl font-bold text-white">
                  Selamat Datang
                </h1>
                <p className="text-slate-300">Masuk ke Berkas App</p>
              </div>

              {/* Status Message */}
              {status && (
                <div className="mb-6 rounded-xl border border-green-400/30 bg-green-500/20 p-4 text-center text-sm text-green-100">
                  {status}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={submit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-white">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={data.email}
                      onChange={e => setData('email', e.target.value)}
                      className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 backdrop-blur-sm transition-all focus:border-purple-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                      placeholder="Masukkan email Anda"
                      autoComplete="email"
                      required
                    />
                    {errors.email && (
                      <div className="mt-2 flex items-center text-sm text-red-400">
                        <AlertCircle className="mr-1 h-4 w-4" />
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-white">
                    <Lock className="mr-2 h-4 w-4" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={data.password}
                      onChange={e => setData('password', e.target.value)}
                      className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 pr-12 text-white placeholder-slate-400 backdrop-blur-sm transition-all focus:border-purple-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                      placeholder="Masukkan password Anda"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                    {errors.password && (
                      <div className="mt-2 flex items-center text-sm text-red-400">
                        <AlertCircle className="mr-1 h-4 w-4" />
                        {errors.password}
                      </div>
                    )}
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={data.remember}
                      onChange={e => setData('remember', e.target.checked)}
                      className="h-4 w-4 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-400 focus:ring-offset-0"
                    />
                    <span className="text-sm text-slate-300">Ingat saya</span>
                  </label>

                  {canResetPassword && (
                    <Link
                      href={route('password.request')}
                      className="text-sm text-purple-400 transition-colors hover:text-purple-300"
                    >
                      Lupa password?
                    </Link>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing || isSubmitting}
                  className={`btn-transition w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-medium text-white transition-all hover:from-purple-700 hover:to-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 ${isSubmitting ? 'animate-formSubmit' : ''}`}
                >
                  {processing || isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spinFade h-4 w-4 rounded-full border-2 border-white border-t-transparent"></div>
                      <span>
                        {isSubmitting ? 'Mengalihkan...' : 'Memproses...'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Masuk</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </button>
              </form>

              {/* Register Link */}
              <div className="mt-8 text-center">
                <p className="text-sm text-slate-300">
                  Belum punya akun?{' '}
                  <Link
                    href={route('register')}
                    className="font-medium text-purple-400 transition-colors hover:text-purple-300"
                  >
                    Daftar sekarang
                  </Link>
                </p>
              </div>
            </div>

            {/* Footer info */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                © 2024 Berkas App - Sistem Manajemen Pinjaman Modern
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay for Page Transitions */}
      <LoadingOverlay
        isVisible={isExiting || isSubmitting}
        message={isSubmitting ? 'Masuk ke dashboard...' : 'Memuat halaman...'}
      />
    </>
  );
}
