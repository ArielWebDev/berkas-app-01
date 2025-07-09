import { Head, Link, useForm } from '@inertiajs/react';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  FileText,
  Lock,
  Mail,
  Shield,
  User,
  Zap,
} from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

export default function Login({
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const submit: FormEventHandler = e => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <>
      <Head title="Masuk - BerkasApp" />

      {/* Modern Background */}
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background Elements */}
        <div className="absolute inset-0">
          {/* Animated Gradient Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20"
            style={{
              backgroundSize: '400% 400%',
              animation: 'gradient 15s ease infinite',
            }}
          ></div>

          {/* Floating Orbs */}
          <div className="absolute left-10 top-20 h-64 w-64 animate-pulse rounded-full bg-gradient-to-br from-blue-500/30 to-purple-600/30 blur-3xl"></div>
          <div
            className="absolute right-20 top-40 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-purple-500/20 to-blue-600/20 blur-3xl"
            style={{ animationDelay: '2s' }}
          ></div>
          <div
            className="absolute bottom-20 left-1/3 h-80 w-80 animate-pulse rounded-full bg-gradient-to-br from-blue-400/25 to-purple-500/25 blur-3xl"
            style={{ animationDelay: '4s' }}
          ></div>

          {/* Particle System */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute h-1 w-1 animate-pulse rounded-full bg-blue-400/40"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Content Container */}
        <div className="relative flex min-h-screen">
          {/* Left Side - Branding */}
          <div className="hidden items-center justify-center p-12 lg:flex lg:w-1/2">
            <div
              className={`max-w-lg text-center transition-all duration-1000 ${
                isVisible
                  ? 'translate-x-0 opacity-100'
                  : '-translate-x-10 opacity-0'
              }`}
            >
              {/* Logo */}
              <div className="mb-8 flex items-center justify-center space-x-3">
                <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-4 shadow-2xl">
                  <FileText className="h-12 w-12 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent">
                  BerkasApp
                </span>
              </div>

              {/* Tagline */}
              <h1 className="mb-6 text-5xl font-bold leading-tight text-white">
                Sistem Analisis
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Berkas Modern
                </span>
              </h1>

              <p className="mb-8 text-xl leading-relaxed text-slate-300">
                Platform terdepan untuk analisis, verifikasi, dan manajemen
                berkas pinjaman dengan teknologi AI dan automasi cerdas.
              </p>

              {/* Features */}
              <div className="space-y-4">
                {[
                  {
                    icon: <Shield className="h-5 w-5" />,
                    text: 'Keamanan Bank-grade',
                  },
                  {
                    icon: <Zap className="h-5 w-5" />,
                    text: 'Proses Real-time',
                  },
                  {
                    icon: <User className="h-5 w-5" />,
                    text: '99.8% Akurasi AI',
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center space-x-3 text-slate-300"
                  >
                    <div className="rounded-lg bg-blue-500/20 p-2 text-blue-400">
                      {feature.icon}
                    </div>
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex w-full items-center justify-center p-6 lg:w-1/2 lg:p-12">
            <div
              className={`w-full max-w-md transition-all duration-1000 ${
                isVisible
                  ? 'translate-x-0 opacity-100'
                  : 'translate-x-10 opacity-0'
              }`}
            >
              {/* Mobile Logo */}
              <div className="mb-8 text-center lg:hidden">
                <div className="mb-4 flex items-center justify-center space-x-3">
                  <div className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 p-3">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-2xl font-bold text-transparent">
                    BerkasApp
                  </span>
                </div>
              </div>

              {/* Login Card */}
              <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 shadow-2xl backdrop-blur-xl">
                {/* Header */}
                <div className="mb-8 text-center">
                  <h2 className="mb-2 text-3xl font-bold text-white">
                    Selamat Datang Kembali
                  </h2>
                  <p className="text-slate-300">Masuk ke akun BerkasApp Anda</p>
                </div>

                {/* Status Message */}
                {status && (
                  <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-center text-sm text-green-400">
                    {status}
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={submit} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        className="w-full rounded-xl border border-slate-600 bg-slate-900/50 px-4 py-3 pl-12 text-white placeholder-slate-400 transition-all duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan email Anda"
                        autoComplete="username"
                        autoFocus
                      />
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-400" />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-400">{errors.email}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        className="w-full rounded-xl border border-slate-600 bg-slate-900/50 px-4 py-3 pl-12 pr-12 text-white placeholder-slate-400 transition-all duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan password Anda"
                        autoComplete="current-password"
                      />
                      <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 transform text-slate-400 transition-colors duration-200 hover:text-white"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-400">{errors.password}</p>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm text-slate-300">
                      <input
                        type="checkbox"
                        name="remember"
                        checked={data.remember}
                        onChange={e => setData('remember', e.target.checked)}
                        className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="ml-2">Ingat saya</span>
                    </label>

                    {canResetPassword && (
                      <Link
                        href={route('password.request')}
                        className="text-sm text-blue-400 transition-colors duration-200 hover:text-blue-300"
                      >
                        Lupa password?
                      </Link>
                    )}
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={processing}
                    className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {processing ? (
                        <>
                          <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Sedang masuk...
                        </>
                      ) : (
                        <>
                          Masuk ke Dashboard
                          <ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </button>
                </form>

                {/* Back to Home */}
                <div className="mt-8 text-center">
                  <Link
                    href="/"
                    className="inline-flex items-center text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Beranda
                  </Link>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-400">
                  Sistem Analisis Berkas Pinjaman Modern
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
