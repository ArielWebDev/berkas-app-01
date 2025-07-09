import { Head, Link } from '@inertiajs/react';
import {
  ArrowRight,
  Award,
  BarChart3,
  FileText,
  Globe,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  SiLaravel,
  SiMysql,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVite,
} from 'react-icons/si';

interface WelcomeProps {
  canLogin: boolean;
  canRegister: boolean;
  laravelVersion: string;
  phpVersion: string;
  auth?: {
    user?: {
      name: string;
      email: string;
    };
  };
}

// Static data - no lazy loading
const features = [
  {
    icon: FileText,
    title: 'Input & Validasi Berkas',
    description:
      'Upload dan validasi otomatis berkas pinjaman dengan pengecekan kelengkapan dokumen.',
  },
  {
    icon: Shield,
    title: 'Verifikasi Keamanan',
    description:
      'Sistem verifikasi berlapis untuk memastikan autentisitas dokumen dan data.',
  },
  {
    icon: Users,
    title: 'Analisis Kelayakan',
    description:
      'Analisis mendalam kelayakan kredit dan kemampuan bayar nasabah.',
  },
  {
    icon: BarChart3,
    title: 'Dashboard Analytics',
    description:
      'Monitor real-time status berkas dan analytics performa analisis.',
  },
  {
    icon: Globe,
    title: 'Workflow Management',
    description:
      'Pengelolaan alur kerja dari input hingga keputusan persetujuan.',
  },
  {
    icon: Zap,
    title: 'Keputusan Cepat',
    description:
      'Proses pengambilan keputusan yang efisien dengan dukungan sistem.',
  },
];

const stats = [
  { icon: Users, number: '500+', label: 'Nasabah Aktif' },
  { icon: FileText, number: '2K+', label: 'Berkas Diproses' },
  { icon: Award, number: '98%', label: 'Akurasi Analisis' },
  { icon: TrendingUp, number: '85%', label: 'Tingkat Persetujuan' },
];

const workflowSteps = [
  {
    icon: FileText,
    title: 'Input Berkas',
    description: 'Nasabah mengupload berkas pinjaman dan data pendukung',
  },
  {
    icon: Shield,
    title: 'Validasi & Verifikasi',
    description: 'Sistem melakukan validasi otomatis dan verifikasi dokumen',
  },
  {
    icon: Users,
    title: 'Analisis Kelayakan',
    description: 'Tim analis mengevaluasi kelayakan dan kemampuan bayar',
  },
  {
    icon: BarChart3,
    title: 'Keputusan',
    description: 'Pemutus memberikan keputusan final persetujuan pinjaman',
  },
];

const techStack = [
  { icon: SiLaravel, name: 'Laravel', color: 'text-red-500' },
  { icon: SiReact, name: 'React', color: 'text-blue-500' },
  { icon: SiTypescript, name: 'TypeScript', color: 'text-blue-600' },
  { icon: SiTailwindcss, name: 'Tailwind', color: 'text-cyan-500' },
  { icon: SiVite, name: 'Vite', color: 'text-purple-500' },
  { icon: SiMysql, name: 'MySQL', color: 'text-orange-500' },
];

export default function WelcomeNew({
  canLogin,
  canRegister,
  laravelVersion,
  phpVersion,
  auth,
}: WelcomeProps) {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Simplified scroll handler - throttled for performance
  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    let ticking = false;

    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [handleScroll]);

  // Intersection Observer for animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Register elements for animation
  const registerRef = useCallback((element: HTMLElement | null) => {
    if (element && observerRef.current) {
      observerRef.current.observe(element);
    }
  }, []);

  return (
    <>
      <Head title="Welcome to BerkasApp" />

      {/* Clean Dark Background */}
      <div className="fixed inset-0 bg-gray-900">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />

        {/* Minimal accent elements */}
        <div className="absolute left-10 top-20 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />
        <div className="absolute bottom-20 right-10 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl" />
      </div>

      <div className="relative min-h-screen text-gray-100">
        {/* Navbar */}
        <nav className="animate-slide-in-up fixed left-0 right-0 top-0 z-50 border-b border-gray-200/20 bg-white/80 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="animate-bounce-in flex items-center space-x-2">
                <div className="relative">
                  <FileText className="h-8 w-8 text-blue-600 transition-transform duration-300 hover:scale-110" />
                </div>
                <span className="text-gradient-ultra text-xl font-bold">
                  BerkasApp
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {auth?.user ? (
                  // User is logged in
                  <div className="flex items-center space-x-4">
                    <span className="animate-slide-in-right text-gray-600">
                      Selamat datang, {auth.user.name}
                    </span>
                    <Link
                      href="/dashboard"
                      className="animate-slide-in-right animate-shimmer rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-white transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700"
                    >
                      Dashboard
                    </Link>
                  </div>
                ) : (
                  // User is not logged in - only show login
                  <Link
                    href="/login"
                    className="animate-slide-in-right animate-shimmer rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-white transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700"
                  >
                    Masuk ke Sistem
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden pb-20 pt-16">
          <div className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
            <div className="text-center">
              <div
                className="animate-bounce-in"
                style={{
                  transform: `translateY(${scrollY * 0.1}px)`,
                  transition: 'transform 0.1s ease-out',
                }}
              >
                <h1 className="animate-fade-in-scale mb-6 text-5xl font-bold md:text-7xl">
                  <span className="text-gradient-ultra mb-4 block">
                    Sistem Analisis
                  </span>
                  <span
                    className="animate-slide-in-up text-gray-800"
                    style={{ animationDelay: '0.5s' }}
                  >
                    Berkas Pinjaman
                  </span>
                </h1>

                <p
                  className="animate-slide-in-up mx-auto mb-8 max-w-3xl text-xl text-gray-600 md:text-2xl"
                  style={{ animationDelay: '0.7s' }}
                >
                  Platform digital untuk validasi, verifikasi, dan analisis
                  kelayakan berkas pinjaman secara komprehensif.
                  <br />
                  <span className="text-gradient-ultra">
                    Efisien, Akurat, dan Terpercaya.
                  </span>
                </p>

                <div
                  className="animate-slide-in-up flex flex-col justify-center gap-4 sm:flex-row"
                  style={{ animationDelay: '0.9s' }}
                >
                  {auth?.user ? (
                    // User is logged in
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                      <Link
                        href="/dashboard"
                        className="animate-pulse-glow transform animate-shimmer rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
                      >
                        Masuk Dashboard
                        <ArrowRight className="animate-ultra-float ml-2 inline h-5 w-5" />
                      </Link>
                      <Link
                        href="/documents"
                        className="rounded-xl border-2 border-gray-300 px-8 py-4 text-lg font-semibold text-gray-700 transition-all duration-300 hover:scale-105 hover:border-blue-400 hover:bg-gray-50 hover:text-blue-600"
                      >
                        Kelola Dokumen
                      </Link>
                    </div>
                  ) : (
                    // User is not logged in
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                      <Link
                        href="/login"
                        className="animate-pulse-glow transform animate-shimmer rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
                      >
                        Mulai Sekarang
                        <ArrowRight className="animate-ultra-float ml-2 inline h-5 w-5" />
                      </Link>
                      <button className="rounded-xl border-2 border-gray-300 px-8 py-4 text-lg font-semibold text-gray-700 transition-all duration-300 hover:scale-105 hover:border-blue-400 hover:bg-gray-50 hover:text-blue-600">
                        Pelajari Lebih Lanjut
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Hero Visual Elements */}
              <div className="relative mt-16">
                <div className="relative mx-auto max-w-4xl">
                  <div className="animate-pulse-glow absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl" />
                  <div className="relative animate-shimmer rounded-3xl border border-white/20 bg-white/80 p-8 backdrop-blur-sm">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      {[
                        {
                          icon: FileText,
                          title: 'Input Berkas',
                          color: 'text-blue-500',
                        },
                        {
                          icon: Shield,
                          title: 'Verifikasi Aman',
                          color: 'text-purple-500',
                        },
                        {
                          icon: Zap,
                          title: 'Keputusan Cepat',
                          color: 'text-pink-500',
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="animate-bounce-in text-center"
                          style={{ animationDelay: `${1.2 + i * 0.2}s` }}
                        >
                          <item.icon
                            className={`tech-icon-ultra mx-auto mb-4 h-12 w-12 ${item.color}`}
                          />
                          <h3 className="font-semibold text-gray-800">
                            {item.title}
                          </h3>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section
          id="stats"
          ref={registerRef}
          className={`bg-white/50 py-20 backdrop-blur-sm transition-all duration-1000 ${
            isVisible.stats ? 'animate-slide-in-up' : 'translate-y-20 opacity-0'
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`group text-center transition-all duration-500 ${
                    isVisible.stats ? 'animate-bounce-in' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="animate-pulse-glow mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 transition-all duration-300 group-hover:scale-110">
                    <stat.icon className="tech-icon-ultra h-8 w-8 text-white" />
                  </div>
                  <div className="text-gradient-ultra mb-2 text-3xl font-bold">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          ref={registerRef}
          className={`py-20 transition-all duration-1000 ${
            isVisible.features ? 'animate-fade-in-scale' : 'scale-95 opacity-0'
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="text-gradient-ultra mb-6 animate-shimmer text-4xl font-bold md:text-5xl">
                Fitur Unggulan Sistem
              </h2>
              <p className="mx-auto max-w-2xl text-xl text-gray-600">
                Dilengkapi dengan teknologi canggih untuk analisis berkas
                pinjaman yang komprehensif
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`feature-card-ultra group relative rounded-2xl p-8 transition-all duration-500 hover:scale-105 ${
                    isVisible.features ? 'animate-bounce-in' : ''
                  }`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    transform: `translateY(${scrollY * 0.05}px)`,
                  }}
                >
                  <div className="animate-pulse-glow mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 transition-transform duration-300 group-hover:rotate-12">
                    <feature.icon className="tech-icon-ultra h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-4 text-xl font-semibold text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed text-gray-600">
                    {feature.description}
                  </p>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section
          id="workflow"
          ref={registerRef}
          className={`bg-gradient-to-br from-blue-50/50 to-purple-50/50 py-20 backdrop-blur-sm transition-all duration-1000 ${
            isVisible.workflow
              ? 'animate-slide-in-left'
              : '-translate-x-20 opacity-0'
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="text-gradient-ultra mb-6 animate-shimmer text-4xl font-bold md:text-5xl">
                Alur Proses Berkas Pinjaman
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-gray-600">
                Proses yang sistematis dan terstruktur dari input berkas hingga
                keputusan persetujuan
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {workflowSteps.map((step, index) => (
                <div
                  key={index}
                  className={`group relative text-center ${
                    isVisible.workflow ? 'animate-bounce-in' : ''
                  }`}
                  style={{
                    animationDelay: `${index * 0.2}s`,
                    transform: `translateY(${scrollY * 0.03}px)`,
                  }}
                >
                  {/* Connection Line */}
                  {index < workflowSteps.length - 1 && (
                    <div className="absolute left-full top-8 z-0 hidden h-0.5 w-full animate-shimmer bg-gradient-to-r from-blue-400 to-purple-400 lg:block">
                      <div className="animate-pulse-glow absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 transform rounded-full bg-purple-400" />
                    </div>
                  )}

                  <div className="relative z-10">
                    <div className="animate-pulse-glow mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 transition-all duration-300 group-hover:scale-110">
                      <step.icon className="tech-icon-ultra h-8 w-8 text-white" />
                    </div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-800">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section
          id="tech"
          ref={registerRef}
          className={`py-20 transition-all duration-1000 ${
            isVisible.tech
              ? 'animate-slide-in-right'
              : 'translate-x-20 opacity-0'
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="text-gradient-ultra mb-6 animate-shimmer text-4xl font-bold md:text-5xl">
                Teknologi Terdepan
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-gray-600">
                Dibangun dengan stack teknologi modern dan terpercaya untuk
                performa optimal
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
              {techStack.map((tech, index) => (
                <div
                  key={index}
                  className={`feature-card-ultra group rounded-2xl p-6 text-center transition-all duration-500 hover:scale-110 ${
                    isVisible.tech ? 'animate-bounce-in' : ''
                  }`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    transform: `translateY(${scrollY * 0.02}px) rotate(${Math.sin(scrollY * 0.01 + index) * 2}deg)`,
                  }}
                >
                  <tech.icon
                    className={`animate-ultra-float tech-icon-ultra mx-auto mb-4 h-12 w-12 ${tech.color}`}
                  />
                  <h3 className="font-semibold text-gray-800 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent">
                    {tech.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section
          id="timeline"
          ref={registerRef}
          className={`bg-gradient-to-br from-gray-50/50 to-blue-50/50 py-20 backdrop-blur-sm transition-all duration-1000 ${
            isVisible.timeline ? 'animate-fade-in-scale' : 'scale-95 opacity-0'
          }`}
        >
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="text-gradient-ultra mb-6 animate-shimmer text-4xl font-bold md:text-5xl">
                Evolusi Sistem Berkas Pinjaman
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-gray-600">
                Perjalanan transformasi dari sistem manual menuju digitalisasi
                lengkap
              </p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="timeline-line-ultra absolute left-1/2 h-full w-1 -translate-x-1/2 transform bg-gradient-to-b from-blue-400 via-purple-500 to-pink-500 opacity-30" />

              {[
                {
                  year: '2024',
                  title: 'Sistem Digital Penuh',
                  desc: 'Implementasi sistem digital terintegrasi untuk semua proses',
                },
                {
                  year: '2023',
                  title: 'Analisis Otomatis',
                  desc: 'Pengembangan fitur analisis otomatis dan AI scoring',
                },
                {
                  year: '2022',
                  title: 'Workflow Management',
                  desc: 'Implementasi sistem workflow dan tracking berkas',
                },
                {
                  year: '2021',
                  title: 'Digitalisasi Berkas',
                  desc: 'Migrasi dari sistem manual ke digital platform',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`relative mb-12 flex items-center ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  } ${isVisible.timeline ? 'animate-slide-in-' + (index % 2 === 0 ? 'left' : 'right') : ''}`}
                  style={{ animationDelay: `${index * 0.3}s` }}
                >
                  {/* Timeline Dot */}
                  <div className="timeline-dot-ultra absolute left-1/2 z-10 h-6 w-6 -translate-x-1/2 transform rounded-full" />

                  {/* Content Card */}
                  <div
                    className={`feature-card-ultra max-w-md rounded-xl p-6 ${
                      index % 2 === 0 ? 'mr-auto pr-16' : 'ml-auto pl-16'
                    }`}
                  >
                    <div className="text-gradient-ultra mb-2 text-2xl font-bold">
                      {item.year}
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section
          id="pricing"
          ref={registerRef}
          className={`py-20 transition-all duration-1000 ${
            isVisible.pricing
              ? 'animate-slide-in-up'
              : 'translate-y-20 opacity-0'
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="text-gradient-ultra mb-6 animate-shimmer text-4xl font-bold md:text-5xl">
                Paket Layanan
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-gray-600">
                Pilih paket yang sesuai dengan kebutuhan organisasi Anda. Semua
                paket dilengkapi dengan keamanan tingkat enterprise.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  name: 'Starter',
                  price: 'Gratis',
                  period: 'Selamanya',
                  description: 'Untuk tim kecil yang baru memulai',
                  features: [
                    'Hingga 5 pengguna',
                    '1 GB penyimpanan',
                    'Fitur dasar manajemen dokumen',
                    'Support email',
                    'SSL encryption',
                  ],
                  popular: false,
                  color: 'from-gray-500 to-gray-600',
                },
                {
                  name: 'Professional',
                  price: 'Rp 99.000',
                  period: 'per bulan',
                  description: 'Untuk tim yang berkembang',
                  features: [
                    'Hingga 25 pengguna',
                    '100 GB penyimpanan',
                    'Semua fitur Starter',
                    'Advanced analytics',
                    'Priority support',
                    'Custom workflows',
                    'API access',
                  ],
                  popular: true,
                  color: 'from-blue-600 to-purple-600',
                },
                {
                  name: 'Enterprise',
                  price: 'Custom',
                  period: 'Hubungi kami',
                  description: 'Untuk organisasi besar',
                  features: [
                    'Unlimited pengguna',
                    'Unlimited penyimpanan',
                    'Semua fitur Professional',
                    'Dedicated support',
                    'Custom integrations',
                    'On-premise deployment',
                    'SLA guarantee',
                  ],
                  popular: false,
                  color: 'from-purple-600 to-pink-600',
                },
              ].map((plan, index) => (
                <div
                  key={index}
                  className={`feature-card-ultra group relative rounded-2xl p-8 transition-all duration-500 hover:scale-105 ${
                    plan.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                  } ${isVisible.pricing ? 'animate-bounce-in' : ''}`}
                  style={{
                    animationDelay: `${index * 0.2}s`,
                    transform: `translateY(${scrollY * 0.03}px)`,
                  }}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                      <div className="animate-pulse-glow rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1 text-sm font-semibold text-white">
                        Paling Populer
                      </div>
                    </div>
                  )}

                  <div className="mb-8 text-center">
                    <h3 className="mb-2 text-2xl font-bold text-gray-800">
                      {plan.name}
                    </h3>
                    <p className="mb-4 text-gray-600">{plan.description}</p>
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-gray-800">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="ml-2 text-gray-500">
                          /{plan.period}
                        </span>
                      )}
                    </div>
                  </div>

                  <ul className="mb-8 space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-600">
                        <div className="mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full rounded-xl py-3 font-semibold transition-all duration-300 hover:scale-105 ${
                      plan.popular
                        ? 'animate-shimmer bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:shadow-blue-500/25'
                        : 'border-2 border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                  >
                    {plan.name === 'Enterprise'
                      ? 'Hubungi Sales'
                      : 'Pilih Paket'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          ref={registerRef}
          className={`bg-gradient-to-br from-purple-50/50 to-pink-50/50 py-20 backdrop-blur-sm transition-all duration-1000 ${
            isVisible.testimonials
              ? 'animate-fade-in-scale'
              : 'scale-95 opacity-0'
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="text-gradient-ultra mb-6 animate-shimmer text-4xl font-bold md:text-5xl">
                Kata Mereka
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-gray-600">
                Kepercayaan dari ribuan pengguna yang telah merasakan manfaat
                BerkasApp
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  name: 'Ahmad Syahid',
                  role: 'Kepala Kredit',
                  company: 'Bank Mandiri Cabang Jakarta',
                  image: '�‍💼',
                  rating: 5,
                  quote:
                    'Sistem ini sangat membantu dalam proses analisis berkas. Waktu pemrosesan berkurang drastis dari 3 hari menjadi hanya beberapa jam.',
                },
                {
                  name: 'Sri Wahyuni',
                  role: 'Senior Analyst',
                  company: 'Koperasi Sejahtera',
                  image: '�‍💻',
                  rating: 5,
                  quote:
                    'Interface yang user-friendly dan fitur analisis yang comprehensive membuat pekerjaan kami jauh lebih efisien dan akurat.',
                },
                {
                  name: 'Budi Santoso',
                  role: 'Branch Manager',
                  company: 'Credit Union Indonesia',
                  image: '�‍💻',
                  rating: 5,
                  quote:
                    'Dengan sistem ini, kami dapat melayani nasabah dengan lebih cepat tanpa mengurangi kualitas analisis kelayakan kredit.',
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className={`feature-card-ultra group rounded-2xl p-8 text-center transition-all duration-500 hover:scale-105 ${
                    isVisible.testimonials ? 'animate-bounce-in' : ''
                  }`}
                  style={{
                    animationDelay: `${index * 0.2}s`,
                    transform: `translateY(${scrollY * 0.02}px)`,
                  }}
                >
                  <div className="mb-4 text-6xl transition-transform duration-300 group-hover:scale-110">
                    {testimonial.image}
                  </div>

                  <div className="mb-4 flex justify-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="animate-pulse-glow h-5 w-5 fill-current text-yellow-400"
                      />
                    ))}
                  </div>

                  <p className="mb-6 italic leading-relaxed text-gray-600">
                    "{testimonial.quote}"
                  </p>

                  <div>
                    <h4 className="mb-1 font-semibold text-gray-800">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    <p className="text-sm font-medium text-blue-600">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          id="cta"
          ref={registerRef}
          className={`relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-20 text-white transition-all duration-1000 ${
            isVisible.cta ? 'animate-slide-in-up' : 'translate-y-20 opacity-0'
          }`}
        >
          {/* Background Effects */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="animate-pulse-glow absolute left-0 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div
              className="animate-pulse-glow absolute bottom-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl"
              style={{ animationDelay: '2s' }}
            />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="animate-bounce-in mb-6 text-4xl font-bold md:text-6xl">
              Siap Mengoptimalkan Proses Berkas Pinjaman?
            </h2>
            <p
              className="animate-slide-in-up mb-12 text-xl opacity-90 md:text-2xl"
              style={{ animationDelay: '0.3s' }}
            >
              Bergabunglah dengan lembaga keuangan terpercaya yang telah
              menggunakan sistem analisis berkas digital
            </p>

            <div
              className="animate-slide-in-up flex flex-col justify-center gap-6 sm:flex-row"
              style={{ animationDelay: '0.5s' }}
            >
              {auth?.user ? (
                <Link
                  href="/dashboard"
                  className="transform animate-shimmer rounded-xl bg-white px-10 py-4 text-lg font-bold text-blue-600 transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:shadow-xl"
                >
                  Lanjutkan ke Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="transform animate-shimmer rounded-xl bg-white px-10 py-4 text-lg font-bold text-blue-600 transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:shadow-xl"
                >
                  Mulai Gratis Sekarang
                </Link>
              )}
              <button className="rounded-xl border-2 border-white px-10 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-blue-600">
                Konsultasi Gratis
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          id="footer"
          ref={registerRef}
          className={`relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-16 text-white transition-all duration-1000 ${
            isVisible.footer
              ? 'animate-slide-in-up'
              : 'translate-y-20 opacity-0'
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-bounce-in mb-6 flex items-center justify-center space-x-2">
                <div className="relative">
                  <FileText className="animate-pulse-glow h-8 w-8 text-blue-400" />
                  <div className="animate-ultra-float absolute inset-0" />
                </div>
                <span className="text-gradient-ultra text-2xl font-bold">
                  BerkasApp
                </span>
              </div>

              <p
                className="animate-slide-in-up mx-auto mb-8 max-w-2xl text-gray-300"
                style={{ animationDelay: '0.3s' }}
              >
                Solusi digital terdepan untuk analisis berkas pinjaman yang
                mengutamakan akurasi, efisiensi, dan keamanan data.
              </p>

              <div
                className="animate-slide-in-up mb-8 flex flex-wrap justify-center gap-6"
                style={{ animationDelay: '0.5s' }}
              >
                {[
                  { text: 'Tentang Kami', href: '#' },
                  { text: 'Fitur', href: '#features' },
                  { text: 'Kontak', href: '#' },
                  { text: 'Blog', href: '#' },
                ].map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="tech-icon-ultra text-gray-300 transition-colors duration-300 hover:scale-105 hover:text-white"
                  >
                    {link.text}
                  </a>
                ))}
              </div>

              <div
                className="animate-slide-in-up border-t border-gray-700 pt-8"
                style={{ animationDelay: '0.7s' }}
              >
                <div className="flex flex-col items-center justify-between md:flex-row">
                  <p className="mb-4 text-sm text-gray-400 md:mb-0">
                    © 2024 BerkasApp. All rights reserved.
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>Laravel v{laravelVersion}</span>
                    <span>•</span>
                    <span>PHP v{phpVersion}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="animate-pulse-glow absolute bottom-0 left-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
            <div
              className="animate-pulse-glow absolute bottom-0 right-0 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl"
              style={{ animationDelay: '2s' }}
            />
          </div>
        </footer>
      </div>
    </>
  );
}
