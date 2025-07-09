import { Head, Link } from '@inertiajs/react';
import {
  ArrowRight,
  Award,
  BarChart3,
  CheckCircle,
  Clock,
  Database,
  Eye,
  FileCheck,
  FileText,
  Mail,
  Menu,
  MessageSquare,
  Phone,
  Shield,
  Star,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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

export default function WelcomeModern({
  auth,
  canLogin,
  canRegister,
  laravelVersion,
  phpVersion,
}: WelcomeProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Update active section for navigation
      const sections = [
        'home',
        'stats',
        'features',
        'workflow',
        'tech-stack',
        'timeline',
        'pricing',
        'testimonials',
      ];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const sectionId = entry.target.id;
        if (entry.isIntersecting) {
          setIsVisible(prev => ({ ...prev, [sectionId]: true }));
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = [
      'home',
      'stats',
      'features',
      'workflow',
      'tech-stack',
      'timeline',
      'pricing',
      'testimonials',
    ];
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        sectionRefs.current[sectionId] = element;
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach(sectionId => {
        const element = sectionRefs.current[sectionId];
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'stats', label: 'Statistik' },
    { id: 'features', label: 'Fitur' },
    { id: 'workflow', label: 'Alur Kerja' },
    { id: 'tech-stack', label: 'Teknologi' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'pricing', label: 'Paket' },
    { id: 'testimonials', label: 'Testimoni' },
  ];

  return (
    <>
      <Head title="BerkasApp - Sistem Analisis Berkas Pinjaman Modern" />

      {/* Background with subtle animation */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-blue-900/10 to-purple-900/10"></div>
        </div>
      </div>

      <div className="relative min-h-screen text-white">
        {/* Navigation */}
        <nav className="fixed left-0 right-0 top-0 z-50 border-b border-slate-700/50 bg-slate-900/90 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-2">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent">
                  BerkasApp
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden items-center space-x-8 md:flex">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-sm font-medium transition-colors ${
                      activeSection === item.id
                        ? 'text-blue-400'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Auth Buttons */}
              <div className="hidden items-center space-x-4 md:flex">
                {auth?.user ? (
                  <Link
                    href="/dashboard"
                    className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 font-medium text-white transition-all hover:shadow-lg"
                  >
                    Dashboard
                  </Link>
                ) : (
                  canLogin && (
                    <Link
                      href="/login"
                      className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 font-medium text-white transition-all hover:shadow-lg"
                    >
                      Masuk
                    </Link>
                  )
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-slate-300 hover:text-white"
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="border-t border-slate-700/50 bg-slate-800/95 backdrop-blur-md md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white"
                  >
                    {item.label}
                  </button>
                ))}
                {auth?.user ? (
                  <Link
                    href="/dashboard"
                    className="block rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-2 text-base font-medium text-white"
                  >
                    Dashboard
                  </Link>
                ) : (
                  canLogin && (
                    <Link
                      href="/login"
                      className="block rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-2 text-base font-medium text-white"
                    >
                      Masuk
                    </Link>
                  )
                )}
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section
          id="home"
          className="relative flex min-h-screen items-center overflow-hidden pt-16"
        >
          {/* Parallax Background */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              transform: `translateY(${scrollY * 0.5}px)`,
            }}
          >
            {/* Floating shapes */}
            <div className="absolute left-10 top-20 h-64 w-64 animate-pulse rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 blur-3xl"></div>
            <div className="absolute right-20 top-40 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-purple-500/20 to-blue-600/20 blur-3xl delay-1000"></div>
            <div className="delay-2000 absolute bottom-20 left-1/3 h-80 w-80 animate-pulse rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 blur-3xl"></div>
          </div>

          {/* Animated Grid Background */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              transform: `translateY(${scrollY * 0.3}px)`,
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          ></div>

          <div
            className={`relative z-10 mx-auto max-w-7xl px-4 py-20 transition-all duration-1000 sm:px-6 lg:px-8 ${
              isVisible.home
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="text-center">
              <h1 className="animate-fade-in-up mb-6 text-4xl font-bold md:text-6xl lg:text-7xl">
                <span className="bg-300% animate-gradient bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Analisis Berkas
                </span>
                <br />
                <span className="text-white">Pinjaman Modern</span>
              </h1>
              <p className="animate-fade-in-up mx-auto mb-8 max-w-3xl text-xl text-slate-300 delay-300 md:text-2xl">
                Platform terdepan untuk analisis, verifikasi, dan manajemen
                berkas pinjaman dengan teknologi AI dan automasi cerdas.
              </p>
              <div className="animate-fade-in-up flex flex-col justify-center gap-4 delay-500 sm:flex-row">
                {auth?.user ? (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105 hover:shadow-xl"
                  >
                    Buka Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105 hover:shadow-xl"
                    >
                      Mulai Sekarang
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => scrollToSection('features')}
                      className="rounded-lg border border-slate-600 px-8 py-4 text-lg font-semibold text-slate-300 transition-all hover:scale-105 hover:border-slate-400 hover:text-white"
                    >
                      Pelajari Lebih Lanjut
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="bg-slate-800/50 py-20">
          <div
            className={`mx-auto max-w-7xl px-4 transition-all duration-1000 sm:px-6 lg:px-8 ${
              isVisible.stats
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                Dipercaya Oleh Ribuan Perusahaan
              </h2>
              <p className="text-xl text-slate-300">
                Data dan statistik yang membuktikan kehandalan platform kami
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="transform text-center transition-all duration-700 hover:scale-105">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div className="mb-2 text-3xl font-bold text-white md:text-4xl">
                  99.8%
                </div>
                <div className="text-slate-300">Akurasi Analisis</div>
              </div>
              <div className="transform text-center transition-all delay-100 duration-700 hover:scale-105">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <div className="mb-2 text-3xl font-bold text-white md:text-4xl">
                  75%
                </div>
                <div className="text-slate-300">Lebih Cepat</div>
              </div>
              <div className="transform text-center transition-all delay-200 duration-700 hover:scale-105">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="mb-2 text-3xl font-bold text-white md:text-4xl">
                  500+
                </div>
                <div className="text-slate-300">Perusahaan</div>
              </div>
              <div className="transform text-center transition-all delay-300 duration-700 hover:scale-105">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <div className="mb-2 text-3xl font-bold text-white md:text-4xl">
                  50M+
                </div>
                <div className="text-slate-300">Berkas Diproses</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div
            className={`mx-auto max-w-7xl px-4 transition-all duration-1000 sm:px-6 lg:px-8 ${
              isVisible.features
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                Fitur Unggulan
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-slate-300">
                Teknologi terdepan untuk memastikan analisis berkas pinjaman
                yang akurat dan efisien
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <Eye className="h-8 w-8" />,
                  title: 'Analisis AI Cerdas',
                  description:
                    'Teknologi AI canggih untuk analisis otomatis dokumen dengan akurasi tinggi',
                },
                {
                  icon: <Shield className="h-8 w-8" />,
                  title: 'Keamanan Terjamin',
                  description:
                    'Enkripsi end-to-end dan standar keamanan banking untuk melindungi data',
                },
                {
                  icon: <Zap className="h-8 w-8" />,
                  title: 'Proses Real-time',
                  description:
                    'Pemrosesan instan dengan notifikasi real-time untuk setiap tahap',
                },
                {
                  icon: <BarChart3 className="h-8 w-8" />,
                  title: 'Dashboard Analytics',
                  description:
                    'Visualisasi data komprehensif dengan insights dan reporting mendalam',
                },
                {
                  icon: <FileCheck className="h-8 w-8" />,
                  title: 'Verifikasi Otomatis',
                  description:
                    'Sistem verifikasi multi-layer untuk memastikan keakuratan data',
                },
                {
                  icon: <UserCheck className="h-8 w-8" />,
                  title: 'Workflow Management',
                  description:
                    'Manajemen alur kerja yang dapat dikustomisasi sesuai kebutuhan',
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`transform rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-blue-500/50 hover:bg-slate-800/70 ${
                    isVisible.features
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-6 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-slate-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="workflow" className="bg-slate-800/50 py-20">
          <div
            className={`mx-auto max-w-7xl px-4 transition-all duration-1000 sm:px-6 lg:px-8 ${
              isVisible.workflow
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                Alur Kerja Sederhana
              </h2>
              <p className="text-xl text-slate-300">
                Proses analisis berkas yang efisien dalam 4 langkah mudah
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: '01',
                  title: 'Upload Berkas',
                  description: 'Upload dokumen pinjaman dalam berbagai format',
                  icon: <FileText className="h-8 w-8" />,
                },
                {
                  step: '02',
                  title: 'Analisis AI',
                  description:
                    'AI menganalisis dan memverifikasi dokumen secara otomatis',
                  icon: <Eye className="h-8 w-8" />,
                },
                {
                  step: '03',
                  title: 'Validasi Data',
                  description:
                    'Validasi multi-layer untuk memastikan keakuratan data',
                  icon: <CheckCircle className="h-8 w-8" />,
                },
                {
                  step: '04',
                  title: 'Laporan Final',
                  description:
                    'Laporan komprehensif dengan rekomendasi keputusan',
                  icon: <Target className="h-8 w-8" />,
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className={`transform text-center transition-all duration-700 hover:scale-105 ${
                    isVisible.workflow
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="relative mb-6">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-shadow hover:shadow-xl">
                      {step.icon}
                    </div>
                    <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="text-slate-300">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section id="tech-stack" className="py-20">
          <div
            className={`mx-auto max-w-7xl px-4 transition-all duration-1000 sm:px-6 lg:px-8 ${
              isVisible['tech-stack']
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                Teknologi Terdepan
              </h2>
              <p className="text-xl text-slate-300">
                Dibangun dengan teknologi modern untuk performa dan keamanan
                optimal
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
              {[
                { name: 'Laravel', desc: 'Backend Framework' },
                { name: 'React', desc: 'Frontend Library' },
                { name: 'TypeScript', desc: 'Type Safety' },
                { name: 'Tailwind', desc: 'CSS Framework' },
                { name: 'MySQL', desc: 'Database' },
                { name: 'Redis', desc: 'Caching' },
              ].map((tech, index) => (
                <div key={index} className="text-center">
                  <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 transition-all hover:bg-slate-800/70">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                      <Database className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-1 font-semibold text-white">
                      {tech.name}
                    </h3>
                    <p className="text-sm text-slate-400">{tech.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section id="timeline" className="bg-slate-800/50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                Roadmap Pengembangan
              </h2>
              <p className="text-xl text-slate-300">
                Inovasi berkelanjutan untuk masa depan analisis berkas yang
                lebih baik
              </p>
            </div>
            <div className="space-y-8">
              {[
                {
                  quarter: 'Q1 2025',
                  title: 'AI Enhancement',
                  description:
                    'Peningkatan akurasi AI dengan machine learning terbaru',
                },
                {
                  quarter: 'Q2 2025',
                  title: 'Mobile App',
                  description:
                    'Peluncuran aplikasi mobile untuk Android dan iOS',
                },
                {
                  quarter: 'Q3 2025',
                  title: 'Blockchain Integration',
                  description:
                    'Integrasi blockchain untuk keamanan dan transparansi',
                },
                {
                  quarter: 'Q4 2025',
                  title: 'Global Expansion',
                  description: 'Ekspansi ke pasar regional Asia Tenggara',
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="mt-2 h-4 w-4 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center space-x-3">
                      <span className="rounded-full bg-blue-600/20 px-3 py-1 text-sm font-medium text-blue-400">
                        {item.quarter}
                      </span>
                      <h3 className="text-xl font-semibold text-white">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-slate-300">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                Paket Berlangganan
              </h2>
              <p className="text-xl text-slate-300">
                Pilih paket yang sesuai dengan kebutuhan bisnis Anda
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  name: 'Starter',
                  price: 'Rp 2.500.000',
                  period: '/bulan',
                  features: [
                    '100 berkas per bulan',
                    'Analisis dasar',
                    'Support email',
                    'Dashboard basic',
                  ],
                },
                {
                  name: 'Professional',
                  price: 'Rp 7.500.000',
                  period: '/bulan',
                  popular: true,
                  features: [
                    '500 berkas per bulan',
                    'Analisis AI advanced',
                    'Support prioritas',
                    'Analytics premium',
                    'API access',
                  ],
                },
                {
                  name: 'Enterprise',
                  price: 'Custom',
                  period: '',
                  features: [
                    'Unlimited berkas',
                    'White-label solution',
                    'Dedicated support',
                    'Custom integration',
                    'SLA guarantee',
                  ],
                },
              ].map((plan, index) => (
                <div
                  key={index}
                  className={`relative rounded-xl border bg-slate-800/50 p-8 ${plan.popular ? 'border-blue-500' : 'border-slate-700/50'}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                      <span className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1 text-sm font-medium text-white">
                        Paling Populer
                      </span>
                    </div>
                  )}
                  <div className="mb-8 text-center">
                    <h3 className="mb-2 text-2xl font-bold text-white">
                      {plan.name}
                    </h3>
                    <div className="text-3xl font-bold text-white">
                      {plan.price}
                      <span className="text-lg text-slate-400">
                        {plan.period}
                      </span>
                    </div>
                  </div>
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-slate-300"
                      >
                        <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-green-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full rounded-lg px-6 py-3 font-semibold transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                        : 'border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white'
                    }`}
                  >
                    Pilih Paket
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="bg-slate-800/50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                Testimoni Klien
              </h2>
              <p className="text-xl text-slate-300">
                Apa kata mereka yang telah mempercayai platform kami
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: 'Sarah Wijaya',
                  role: 'Risk Manager, Bank Mandiri',
                  content:
                    'BerkasApp mengubah cara kami menganalisis berkas pinjaman. Akurasi tinggi dan proses yang sangat cepat.',
                  rating: 5,
                },
                {
                  name: 'Ahmad Rizki',
                  role: 'CEO, Fintech Nusantara',
                  content:
                    'Platform yang luar biasa! Dashboard analytics memberikan insights yang sangat berharga untuk pengambilan keputusan.',
                  rating: 5,
                },
                {
                  name: 'Maya Sari',
                  role: 'Operations Head, KTA Digital',
                  content:
                    'Implementasi mudah, support yang responsif, dan hasil analisis yang dapat diandalkan. Highly recommended!',
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6"
                >
                  <div className="mb-4 flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-current text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="mb-6 italic text-slate-300">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                Siap Mengoptimalkan Analisis Berkas Anda?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-xl text-blue-100">
                Bergabunglah dengan ribuan perusahaan yang telah mempercayai
                BerkasApp untuk kebutuhan analisis berkas pinjaman mereka.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                {auth?.user ? (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-600 transition-all hover:bg-blue-50"
                  >
                    Buka Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-600 transition-all hover:bg-blue-50"
                  >
                    Mulai Uji Coba Gratis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                )}
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="rounded-lg border border-white px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white hover:text-blue-600"
                >
                  Lihat Harga
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-700/50 bg-slate-900 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="md:col-span-2">
                <div className="mb-4 flex items-center space-x-2">
                  <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-2">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent">
                    BerkasApp
                  </span>
                </div>
                <p className="mb-4 max-w-md text-slate-300">
                  Platform analisis berkas pinjaman terdepan dengan teknologi AI
                  untuk membantu perusahaan mengoptimalkan proses persetujuan
                  kredit.
                </p>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="text-slate-400 transition-colors hover:text-white"
                  >
                    <MessageSquare className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="text-slate-400 transition-colors hover:text-white"
                  >
                    <Phone className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="text-slate-400 transition-colors hover:text-white"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>
              <div>
                <h3 className="mb-4 font-semibold text-white">Produk</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 transition-colors hover:text-white"
                    >
                      Fitur
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 transition-colors hover:text-white"
                    >
                      Harga
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 transition-colors hover:text-white"
                    >
                      API
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 transition-colors hover:text-white"
                    >
                      Dokumentasi
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 font-semibold text-white">Perusahaan</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 transition-colors hover:text-white"
                    >
                      Tentang Kami
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 transition-colors hover:text-white"
                    >
                      Karir
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 transition-colors hover:text-white"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 transition-colors hover:text-white"
                    >
                      Kontak
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-12 border-t border-slate-700 pt-8 text-center text-slate-400">
              <p>&copy; 2025 BerkasApp. Semua hak dilindungi undang-undang.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
