import { Head, Link } from '@inertiajs/react';
import {
  ArrowRight,
  Award,
  BarChart3,
  CheckCircle,
  Clock,
  Eye,
  FileCheck,
  FileText,
  Globe,
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
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
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
        <nav className="fixed left-0 right-0 top-0 z-50 border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-lg transition-all duration-300">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:h-18 flex h-16 items-center justify-between">
              {/* Logo */}
              <div className="flex flex-shrink-0 items-center space-x-3">
                <div className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 p-2 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25">
                  <FileText className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </div>
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-base font-bold text-transparent sm:text-lg lg:text-xl">
                  BerkasApp
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden items-center space-x-1 lg:flex">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`group relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 xl:px-4 ${
                      activeSection === item.id
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                    }`}
                  >
                    {item.label}
                    <div
                      className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 transform bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${
                        activeSection === item.id
                          ? 'w-full'
                          : 'w-0 group-hover:w-full'
                      }`}
                    ></div>
                  </button>
                ))}
              </div>

              {/* Auth Section - Desktop */}
              <div className="hidden items-center space-x-3 md:flex">
                {auth?.user ? (
                  <div className="flex items-center space-x-3">
                    {/* User Avatar & Info */}
                    <div className="flex items-center space-x-2 rounded-lg border border-slate-700/50 bg-slate-800/50 px-3 py-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-xs font-bold text-white">
                        {auth.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-white">
                          {auth.user.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {auth.user.email}
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 lg:px-6"
                    >
                      <span className="relative z-10">Dashboard</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    </Link>
                  </div>
                ) : (
                  canLogin && (
                    <div className="flex items-center space-x-2 lg:space-x-3">
                      <button
                        onClick={() => scrollToSection('features')}
                        className="hidden px-3 py-2 text-sm font-medium text-slate-300 transition-colors duration-300 hover:text-white lg:block"
                      >
                        Fitur
                      </button>
                      <Link
                        href="/login"
                        className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 lg:px-6"
                      >
                        <span className="relative z-10">Masuk</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                      </Link>
                      {canRegister && (
                        <Link
                          href="/register"
                          className="hidden rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-300 transition-all duration-300 hover:border-slate-400 hover:text-white lg:inline-flex"
                        >
                          Daftar
                        </Link>
                      )}
                    </div>
                  )
                )}
              </div>

              {/* Mobile Section */}
              <div className="flex items-center space-x-2 md:hidden">
                {auth?.user && (
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-xs font-bold text-white">
                      {auth.user.name.charAt(0).toUpperCase()}
                    </div>
                    <Link
                      href="/dashboard"
                      className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1.5 text-sm font-medium text-white"
                    >
                      Dashboard
                    </Link>
                  </div>
                )}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="rounded-lg p-2 text-slate-300 transition-all duration-300 hover:bg-slate-800/50 hover:text-white"
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
            <div className="bg-slate-900/98 absolute left-0 right-0 top-full border-b border-slate-700/50 shadow-2xl backdrop-blur-lg md:hidden">
              <div className="max-h-[80vh] space-y-1 overflow-y-auto px-4 py-6">
                {/* Mobile Navigation Items */}
                <div className="space-y-2">
                  {navItems.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full transform rounded-xl px-4 py-3 text-left text-base font-medium transition-all duration-300 ${
                        activeSection === item.id
                          ? 'border border-blue-500/20 bg-blue-500/10 text-blue-400'
                          : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                      }`}
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animation: isMenuOpen
                          ? 'slideInFromTop 0.3s ease-out forwards'
                          : 'none',
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`h-2 w-2 rounded-full transition-all duration-300 ${
                            activeSection === item.id
                              ? 'bg-blue-400'
                              : 'bg-slate-600'
                          }`}
                        ></div>
                        <span>{item.label}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Mobile Auth Section */}
                <div className="mt-6 border-t border-slate-700/50 pt-6">
                  {auth?.user ? (
                    <div className="space-y-4">
                      <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-sm font-bold text-white">
                            {auth.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="truncate font-medium text-white">
                              {auth.user.name}
                            </div>
                            <div className="truncate text-sm text-slate-400">
                              {auth.user.email}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Link
                        href="/dashboard"
                        className="block w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-center font-semibold text-white transition-all duration-300 hover:shadow-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Buka Dashboard
                      </Link>
                    </div>
                  ) : (
                    canLogin && (
                      <div className="space-y-3">
                        <Link
                          href="/login"
                          className="block w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-center font-semibold text-white transition-all duration-300 hover:shadow-lg"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Masuk ke Akun
                        </Link>
                        {canRegister && (
                          <Link
                            href="/register"
                            className="block w-full rounded-xl border border-slate-600 px-4 py-3 text-center font-medium text-slate-300 transition-all duration-300 hover:border-slate-400 hover:text-white"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Daftar Sekarang
                          </Link>
                        )}
                      </div>
                    )
                  )}
                </div>

                {/* Mobile Footer Info */}
                <div className="mt-6 border-t border-slate-700/50 pt-6">
                  <div className="text-center">
                    <div className="mb-3 flex items-center justify-center space-x-2">
                      <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-2">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-lg font-bold text-transparent">
                        BerkasApp
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">
                      Platform analisis berkas pinjaman modern
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section
          id="home"
          className="relative flex min-h-screen items-center overflow-hidden pt-16"
        >
          {/* Dynamic Parallax Background */}
          <div className="absolute inset-0">
            {/* Animated Gradient Overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20"
              style={{
                backgroundSize: '400% 400%',
                animation: 'gradient 15s ease infinite',
              }}
            ></div>

            {/* Floating Orbs with Parallax */}
            <div
              className="absolute left-10 top-20 h-64 w-64 animate-pulse rounded-full bg-gradient-to-br from-blue-500/30 to-purple-600/30 blur-3xl"
              style={{
                transform: `translateY(${scrollY * 0.5}px) translateX(${scrollY * 0.2}px) scale(${1 + scrollY * 0.0003})`,
                filter: 'blur(40px)',
              }}
            ></div>
            <div
              className="absolute right-20 top-40 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-purple-500/20 to-blue-600/20 blur-3xl"
              style={{
                transform: `translateY(${scrollY * 0.3}px) translateX(${scrollY * -0.1}px) scale(${1 + scrollY * 0.0002})`,
                animationDelay: '2s',
                filter: 'blur(60px)',
              }}
            ></div>
            <div
              className="absolute bottom-20 left-1/3 h-80 w-80 animate-pulse rounded-full bg-gradient-to-br from-blue-400/25 to-purple-500/25 blur-3xl"
              style={{
                transform: `translateY(${scrollY * 0.4}px) rotate(${scrollY * 0.05}deg)`,
                animationDelay: '4s',
                filter: 'blur(50px)',
              }}
            ></div>

            {/* Particle System */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute h-1 w-1 animate-pulse rounded-full bg-blue-400/40"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                    transform: `translateY(${scrollY * (0.1 + Math.random() * 0.2)}px)`,
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Animated Grid Background */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              transform: `translateY(${scrollY * 0.3}px)`,
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              maskImage:
                'radial-gradient(circle at center, black 30%, transparent 70%)',
            }}
          ></div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Main Headline with Staggered Animation */}
              <div className="mb-8">
                <h1
                  className={`duration-1200 text-5xl font-bold leading-tight transition-all md:text-7xl lg:text-8xl ${
                    isVisible.home
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-12 opacity-0'
                  }`}
                >
                  <span className="mb-2 block">
                    <span className="bg-300% animate-gradient-flow inline-block transform bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent transition-transform duration-300 hover:scale-105">
                      Analisis Berkas
                    </span>
                  </span>
                  <span
                    className={`duration-1200 block text-white transition-all ${
                      isVisible.home
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-8 opacity-0'
                    }`}
                    style={{ transitionDelay: '300ms' }}
                  >
                    <span className="relative">
                      Pinjaman Modern
                      <div className="absolute -bottom-2 left-0 h-1 w-full origin-left scale-x-0 transform animate-pulse bg-gradient-to-r from-blue-500 to-purple-500 delay-1000"></div>
                    </span>
                  </span>
                </h1>
              </div>

              {/* Subtitle with Fade Animation */}
              <p
                className={`mx-auto mb-12 max-w-4xl text-xl leading-relaxed text-slate-300 transition-all duration-1000 md:text-2xl lg:text-3xl ${
                  isVisible.home
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-6 opacity-0'
                }`}
                style={{ transitionDelay: '600ms' }}
              >
                Platform{' '}
                <span className="font-semibold text-blue-400">terdepan</span>{' '}
                untuk analisis, verifikasi, dan manajemen berkas pinjaman dengan
                teknologi{' '}
                <span className="font-semibold text-purple-400">AI</span> dan
                automasi cerdas.
              </p>

              {/* Action Buttons with Enhanced Styling */}
              <div
                className={`flex flex-col items-center justify-center gap-6 transition-all duration-1000 sm:flex-row ${
                  isVisible.home
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: '900ms' }}
              >
                {auth?.user ? (
                  <Link
                    href="/dashboard"
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-5 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
                  >
                    <span className="relative z-10">Buka Dashboard</span>
                    <ArrowRight className="relative z-10 ml-3 h-6 w-6 transform transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-5 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
                    >
                      <span className="relative z-10">Mulai Sekarang</span>
                      <ArrowRight className="relative z-10 ml-3 h-6 w-6 transform transition-transform group-hover:translate-x-1" />
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    </Link>
                    <button
                      onClick={() => scrollToSection('features')}
                      className="group relative overflow-hidden rounded-2xl border-2 border-slate-600 px-10 py-5 text-lg font-semibold text-slate-300 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-blue-400 hover:bg-blue-500/10 hover:text-white"
                    >
                      <span className="relative z-10">
                        Pelajari Lebih Lanjut
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    </button>
                  </>
                )}
              </div>

              {/* Stats Preview */}
              <div
                className={`mt-16 grid grid-cols-2 gap-8 transition-all duration-1000 md:grid-cols-4 ${
                  isVisible.home
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-6 opacity-0'
                }`}
                style={{ transitionDelay: '1200ms' }}
              >
                {[
                  { value: '99.8%', label: 'Akurasi' },
                  { value: '500+', label: 'Perusahaan' },
                  { value: '75%', label: 'Lebih Cepat' },
                  { value: '50M+', label: 'Berkas' },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="group text-center transition-transform duration-300 hover:scale-105"
                  >
                    <div className="text-2xl font-bold text-white transition-colors group-hover:text-blue-400 md:text-3xl">
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-400 md:text-base">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div
            className={`absolute bottom-8 left-1/2 -translate-x-1/2 transform transition-all duration-1000 ${
              isVisible.home
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: '1500ms' }}
          >
            <div
              className="flex cursor-pointer flex-col items-center text-slate-400 transition-colors hover:text-white"
              onClick={() => scrollToSection('stats')}
            >
              <span className="mb-2 text-sm">Scroll untuk melihat lebih</span>
              <div className="flex h-10 w-6 justify-center rounded-full border-2 border-slate-400">
                <div className="mt-2 h-3 w-1 animate-bounce rounded-full bg-slate-400"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section
          id="stats"
          className="relative overflow-hidden bg-slate-800/50 py-20"
        >
          {/* Parallax Background Elements */}
          <div
            className="absolute -left-20 top-10 h-40 w-40 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"
            style={{ transform: `translateX(${scrollY * 0.2}px)` }}
          ></div>
          <div
            className="absolute -right-20 bottom-10 h-60 w-60 rounded-full bg-gradient-to-l from-purple-500/10 to-blue-500/10 blur-3xl"
            style={{ transform: `translateX(${scrollY * -0.3}px)` }}
          ></div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              className={`mb-16 text-center transition-all duration-1000 ${
                isVisible.stats
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }`}
            >
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                Dipercaya Oleh Ribuan Perusahaan
              </h2>
              <p className="text-xl text-slate-300">
                Data dan statistik yang membuktikan kehandalan platform kami
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {/* Masuk dari kiri */}
              <div
                className={`transform text-center transition-all duration-700 hover:scale-105 ${
                  isVisible.stats
                    ? 'translate-x-0 opacity-100'
                    : '-translate-x-16 opacity-0'
                }`}
                style={{ transitionDelay: '100ms' }}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div className="mb-2 text-3xl font-bold text-white md:text-4xl">
                  99.8%
                </div>
                <div className="text-slate-300">Akurasi Analisis</div>
              </div>

              {/* Masuk dari atas */}
              <div
                className={`transform text-center transition-all duration-700 hover:scale-105 ${
                  isVisible.stats
                    ? 'translate-y-0 opacity-100'
                    : '-translate-y-16 opacity-0'
                }`}
                style={{ transitionDelay: '200ms' }}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <div className="mb-2 text-3xl font-bold text-white md:text-4xl">
                  75%
                </div>
                <div className="text-slate-300">Lebih Cepat</div>
              </div>

              {/* Masuk dari bawah */}
              <div
                className={`transform text-center transition-all duration-700 hover:scale-105 ${
                  isVisible.stats
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-16 opacity-0'
                }`}
                style={{ transitionDelay: '300ms' }}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="mb-2 text-3xl font-bold text-white md:text-4xl">
                  500+
                </div>
                <div className="text-slate-300">Perusahaan</div>
              </div>

              {/* Masuk dari kanan */}
              <div
                className={`transform text-center transition-all duration-700 hover:scale-105 ${
                  isVisible.stats
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-16 opacity-0'
                }`}
                style={{ transitionDelay: '400ms' }}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25">
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
        <section id="features" className="relative overflow-hidden py-20">
          {/* Parallax Background Elements */}
          <div
            className="absolute -right-32 top-20 h-72 w-72 rounded-full bg-gradient-to-l from-blue-500/5 to-purple-500/5 blur-3xl"
            style={{
              transform: `translateX(${scrollY * -0.4}px) rotate(${scrollY * 0.1}deg)`,
            }}
          ></div>
          <div
            className="absolute -left-32 bottom-20 h-96 w-96 rounded-full bg-gradient-to-r from-purple-500/5 to-blue-500/5 blur-3xl"
            style={{
              transform: `translateX(${scrollY * 0.3}px) rotate(${scrollY * -0.1}deg)`,
            }}
          ></div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              className={`mb-16 text-center transition-all duration-1000 ${
                isVisible.features
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }`}
            >
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
                  direction: 'left',
                },
                {
                  icon: <Shield className="h-8 w-8" />,
                  title: 'Keamanan Terjamin',
                  description:
                    'Enkripsi end-to-end dan standar keamanan banking untuk melindungi data',
                  direction: 'up',
                },
                {
                  icon: <Zap className="h-8 w-8" />,
                  title: 'Proses Real-time',
                  description:
                    'Pemrosesan instan dengan notifikasi real-time untuk setiap tahap',
                  direction: 'right',
                },
                {
                  icon: <BarChart3 className="h-8 w-8" />,
                  title: 'Dashboard Analytics',
                  description:
                    'Visualisasi data komprehensif dengan insights dan reporting mendalam',
                  direction: 'right',
                },
                {
                  icon: <FileCheck className="h-8 w-8" />,
                  title: 'Verifikasi Otomatis',
                  description:
                    'Sistem verifikasi multi-layer untuk memastikan keakuratan data',
                  direction: 'up',
                },
                {
                  icon: <UserCheck className="h-8 w-8" />,
                  title: 'Workflow Management',
                  description:
                    'Manajemen alur kerja yang dapat dikustomisasi sesuai kebutuhan',
                  direction: 'left',
                },
              ].map((feature, index) => {
                const getAnimationClass = () => {
                  if (!isVisible.features) {
                    switch (feature.direction) {
                      case 'left':
                        return 'opacity-0 -translate-x-12';
                      case 'right':
                        return 'opacity-0 translate-x-12';
                      case 'up':
                        return 'opacity-0 translate-y-12';
                      default:
                        return 'opacity-0 translate-y-6';
                    }
                  }
                  return 'opacity-100 translate-x-0 translate-y-0';
                };

                return (
                  <div
                    key={index}
                    className={`transform rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-sm transition-all duration-700 hover:scale-105 hover:border-blue-500/50 hover:bg-slate-800/70 ${getAnimationClass()}`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25">
                      {feature.icon}
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-slate-300">{feature.description}</p>
                  </div>
                );
              })}
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
        <section id="tech-stack" className="relative overflow-hidden py-20">
          {/* Parallax Background */}
          <div
            className="absolute right-0 top-0 h-96 w-96 rounded-full bg-gradient-to-bl from-purple-500/10 to-blue-500/10 blur-3xl"
            style={{
              transform: `translateX(${scrollY * 0.1}px) translateY(${scrollY * 0.2}px)`,
            }}
          ></div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              className={`mb-16 text-center transition-all duration-1000 ${
                isVisible['tech-stack']
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }`}
            >
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                Teknologi Terdepan
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-slate-300">
                Dibangun dengan teknologi modern untuk performa dan keamanan
                optimal
              </p>
            </div>

            {/* Tech Stack Grid with Staggered Animation */}
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
              {[
                {
                  name: 'Laravel',
                  desc: 'Backend Framework',
                  icon: '🚀',
                  color: 'from-red-500 to-orange-500',
                  delay: 100,
                },
                {
                  name: 'React',
                  desc: 'Frontend Library',
                  icon: '⚛️',
                  color: 'from-blue-500 to-cyan-500',
                  delay: 300,
                },
                {
                  name: 'TypeScript',
                  desc: 'Type Safety',
                  icon: '📝',
                  color: 'from-blue-600 to-indigo-600',
                  delay: 150,
                },
                {
                  name: 'Tailwind',
                  desc: 'CSS Framework',
                  icon: '🎨',
                  color: 'from-cyan-500 to-blue-500',
                  delay: 400,
                },
                {
                  name: 'MySQL',
                  desc: 'Database',
                  icon: '🗄️',
                  color: 'from-orange-500 to-yellow-500',
                  delay: 200,
                },
                {
                  name: 'Redis',
                  desc: 'Caching',
                  icon: '⚡',
                  color: 'from-red-500 to-pink-500',
                  delay: 350,
                },
              ].map((tech, index) => {
                const randomDirection = Math.random() > 0.5 ? 1 : -1;
                const randomOffset = Math.random() * 20 + 10;

                return (
                  <div key={index} className="group text-center">
                    <div
                      className={`transform rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 transition-all duration-500 hover:rotate-1 hover:scale-110 hover:bg-slate-800/70 ${
                        isVisible['tech-stack']
                          ? 'translate-x-0 translate-y-0 rotate-0 opacity-100'
                          : `translate-y-8 opacity-0 ${randomDirection > 0 ? 'translate-x-4' : '-translate-x-4'} rotate-3`
                      }`}
                      style={{
                        transitionDelay: `${tech.delay}ms`,
                        transformOrigin: 'center center',
                      }}
                    >
                      {/* Icon with Gradient Background */}
                      <div
                        className={`bg-gradient-to-r ${tech.color} mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/25`}
                      >
                        <span className="drop-shadow-sm filter">
                          {tech.icon}
                        </span>
                      </div>

                      {/* Tech Name */}
                      <h3 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-blue-400">
                        {tech.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-slate-400 transition-colors group-hover:text-slate-300">
                        {tech.desc}
                      </p>

                      {/* Hover Line Effect */}
                      <div
                        className={`mt-3 h-0.5 bg-gradient-to-r ${tech.color} origin-center scale-x-0 rounded-full transition-transform duration-300 group-hover:scale-x-100`}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional Tech Info */}
            <div
              className={`mt-16 text-center transition-all duration-1000 ${
                isVisible['tech-stack']
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-6 opacity-0'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <p className="mx-auto max-w-2xl text-lg text-slate-400">
                Setiap teknologi dipilih dengan cermat untuk memberikan
                pengalaman terbaik dan performa optimal dalam analisis berkas
                pinjaman.
              </p>

              {/* Performance Indicators */}
              <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
                {[
                  { label: 'Uptime', value: '99.9%', icon: '⚡' },
                  { label: 'Response Time', value: '<100ms', icon: '🚀' },
                  { label: 'Security', value: 'Bank Grade', icon: '🔒' },
                  { label: 'Scalability', value: 'Auto Scale', icon: '📈' },
                ].map((metric, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-700 hover:scale-105 ${
                      isVisible['tech-stack']
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-4 opacity-0'
                    }`}
                    style={{ transitionDelay: `${800 + index * 100}ms` }}
                  >
                    <div className="mb-2 text-2xl">{metric.icon}</div>
                    <div className="text-lg font-bold text-white">
                      {metric.value}
                    </div>
                    <div className="text-sm text-slate-400">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section
          id="timeline"
          className="relative overflow-hidden bg-slate-800/50 py-20"
        >
          {/* Parallax Background */}
          <div
            className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl"
            style={{
              transform: `translateY(${scrollY * 0.2}px) scale(${1 + scrollY * 0.0005})`,
            }}
          ></div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              className={`mb-16 text-center transition-all duration-1000 ${
                isVisible.timeline
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }`}
            >
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                Roadmap Pengembangan
              </h2>
              <p className="mx-auto max-w-2xl text-xl text-slate-300">
                Inovasi berkelanjutan untuk masa depan analisis berkas yang
                lebih baik
              </p>
            </div>

            {/* Timeline Container */}
            <div className="relative">
              {/* Main Timeline Line */}
              <div className="absolute left-8 top-0 h-full w-0.5 transform bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-50 md:left-1/2 md:-translate-x-0.5"></div>

              {/* Progress Line */}
              <div
                className={`duration-2000 absolute left-8 top-0 w-0.5 transform bg-gradient-to-b from-blue-500 via-purple-500 to-blue-500 transition-all md:left-1/2 md:-translate-x-0.5 ${
                  isVisible.timeline ? 'h-full opacity-100' : 'h-0 opacity-0'
                }`}
                style={{ transitionDelay: '500ms' }}
              ></div>

              <div className="space-y-12 md:space-y-16">
                {[
                  {
                    quarter: 'Q1 2025',
                    title: 'AI Enhancement',
                    description:
                      'Peningkatan akurasi AI dengan machine learning terbaru untuk analisis dokumen yang lebih presisi dan cepat.',
                    icon: <Target className="h-6 w-6" />,
                    side: 'left',
                  },
                  {
                    quarter: 'Q2 2025',
                    title: 'Mobile App',
                    description:
                      'Peluncuran aplikasi mobile untuk Android dan iOS dengan fitur lengkap untuk akses di mana saja.',
                    icon: <Globe className="h-6 w-6" />,
                    side: 'right',
                  },
                  {
                    quarter: 'Q3 2025',
                    title: 'Blockchain Integration',
                    description:
                      'Integrasi blockchain untuk keamanan dan transparansi maksimal dalam setiap transaksi data.',
                    icon: <Shield className="h-6 w-6" />,
                    side: 'left',
                  },
                  {
                    quarter: 'Q4 2025',
                    title: 'Global Expansion',
                    description:
                      'Ekspansi ke pasar regional Asia Tenggara dengan dukungan multi-bahasa dan mata uang.',
                    icon: <TrendingUp className="h-6 w-6" />,
                    side: 'right',
                  },
                ].map((item, index) => {
                  const isLeft = item.side === 'left';
                  const animationClass = !isVisible.timeline
                    ? `opacity-0 ${isLeft ? '-translate-x-12' : 'translate-x-12'} md:${isLeft ? '-translate-x-12' : 'translate-x-12'}`
                    : 'opacity-100 translate-x-0';

                  return (
                    <div key={index} className="relative">
                      {/* Timeline Node */}
                      <div
                        className={`absolute left-6 z-10 h-4 w-4 transform rounded-full border-4 border-slate-800 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 md:left-1/2 md:-translate-x-2 ${
                          isVisible.timeline
                            ? 'scale-100 opacity-100'
                            : 'scale-0 opacity-0'
                        }`}
                        style={{ transitionDelay: `${(index + 1) * 300}ms` }}
                      >
                        <div className="absolute -inset-2 animate-pulse rounded-full bg-blue-500/20"></div>
                      </div>

                      {/* Content Card */}
                      <div
                        className={`ml-16 md:ml-0 md:w-5/12 ${isLeft ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'} transition-all duration-1000 ${animationClass}`}
                        style={{ transitionDelay: `${(index + 1) * 200}ms` }}
                      >
                        <div className="group rounded-xl border border-slate-700/50 bg-slate-800/70 p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:bg-slate-800/90">
                          {/* Quarter Badge */}
                          <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-all group-hover:shadow-lg group-hover:shadow-blue-500/25">
                              {item.icon}
                            </div>
                            <span className="rounded-full border border-blue-500/30 bg-blue-600/20 px-3 py-1 text-sm font-medium text-blue-400">
                              {item.quarter}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-blue-400 md:text-2xl">
                            {item.title}
                          </h3>

                          {/* Description */}
                          <p className="leading-relaxed text-slate-300">
                            {item.description}
                          </p>

                          {/* Hover Effect Line */}
                          <div className="mt-4 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-transform duration-300 group-hover:scale-x-100"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
        <section
          id="testimonials"
          className="relative overflow-hidden bg-slate-800/50 py-20"
        >
          {/* Parallax Background */}
          <div
            className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-gradient-to-r from-purple-500/5 to-blue-500/5 blur-3xl"
            style={{
              transform: `translateX(${scrollY * 0.3}px) rotate(${scrollY * -0.05}deg)`,
            }}
          ></div>
          <div
            className="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-gradient-to-l from-blue-500/5 to-purple-500/5 blur-3xl"
            style={{
              transform: `translateX(${scrollY * -0.2}px) rotate(${scrollY * 0.05}deg)`,
            }}
          ></div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              className={`mb-16 text-center transition-all duration-1000 ${
                isVisible.testimonials
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }`}
            >
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                Testimoni Klien
              </h2>
              <p className="text-xl text-slate-300">
                Apa kata mereka yang telah mempercayai platform kami
              </p>
            </div>

            {/* Carousel Container */}
            <div
              className={`relative mx-auto max-w-4xl transition-all duration-1000 ${
                isVisible.testimonials
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              {/* Testimonials Data */}
              {(() => {
                const testimonials = [
                  {
                    name: 'Sarah Wijaya',
                    role: 'Risk Manager, Bank Mandiri',
                    content:
                      'BerkasApp mengubah cara kami menganalisis berkas pinjaman. Akurasi tinggi dan proses yang sangat cepat membuat produktivitas tim meningkat drastis.',
                    rating: 5,
                    avatar: 'SW',
                  },
                  {
                    name: 'Ahmad Rizki',
                    role: 'CEO, Fintech Nusantara',
                    content:
                      'Platform yang luar biasa! Dashboard analytics memberikan insights yang sangat berharga untuk pengambilan keputusan bisnis yang lebih tepat.',
                    rating: 5,
                    avatar: 'AR',
                  },
                  {
                    name: 'Maya Sari',
                    role: 'Operations Head, KTA Digital',
                    content:
                      'Implementasi mudah, support yang responsif, dan hasil analisis yang dapat diandalkan. Tim kami sangat terbantu dengan fitur-fitur canggihnya.',
                    rating: 5,
                    avatar: 'MS',
                  },
                  {
                    name: 'Budi Santoso',
                    role: 'Credit Analyst, BRI',
                    content:
                      'Automasi yang disediakan BerkasApp memungkinkan kami memproses lebih banyak aplikasi dengan tingkat akurasi yang konsisten tinggi.',
                    rating: 5,
                    avatar: 'BS',
                  },
                  {
                    name: 'Rina Dewi',
                    role: 'Head of Risk, Akulaku',
                    content:
                      'ROI yang kami dapatkan dari BerkasApp sangat mengesankan. Waktu pemrosesan berkurang 75% dengan akurasi yang lebih baik.',
                    rating: 5,
                    avatar: 'RD',
                  },
                ];

                // Auto rotate testimonials
                useEffect(() => {
                  const interval = setInterval(() => {
                    if (isVisible.testimonials) {
                      setCurrentTestimonial(
                        prev => (prev + 1) % testimonials.length
                      );
                    }
                  }, 4000);
                  return () => clearInterval(interval);
                }, [isVisible.testimonials]);

                return (
                  <>
                    {/* Main Testimonial Display */}
                    <div className="relative flex min-h-[300px] items-center">
                      {testimonials.map((testimonial, index) => (
                        <div
                          key={index}
                          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                            index === currentTestimonial
                              ? 'translate-x-0 scale-100 opacity-100'
                              : index < currentTestimonial
                                ? '-translate-x-full scale-95 opacity-0'
                                : 'translate-x-full scale-95 opacity-0'
                          }`}
                        >
                          <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-8 text-center shadow-2xl backdrop-blur-sm md:p-12">
                            {/* Rating Stars */}
                            <div className="mb-6 flex justify-center">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="mx-1 h-6 w-6 fill-current text-yellow-400"
                                />
                              ))}
                            </div>

                            {/* Quote */}
                            <blockquote className="mb-8 text-lg italic leading-relaxed text-slate-300 md:text-xl">
                              "{testimonial.content}"
                            </blockquote>

                            {/* Author Info */}
                            <div className="flex items-center justify-center space-x-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-lg font-bold text-white">
                                {testimonial.avatar}
                              </div>
                              <div className="text-left">
                                <div className="text-lg font-semibold text-white">
                                  {testimonial.name}
                                </div>
                                <div className="text-slate-400">
                                  {testimonial.role}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Navigation Dots */}
                    <div className="mt-8 flex justify-center space-x-3">
                      {testimonials.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentTestimonial(index)}
                          className={`h-3 w-3 rounded-full transition-all duration-300 ${
                            index === currentTestimonial
                              ? 'scale-125 bg-gradient-to-r from-blue-500 to-purple-500'
                              : 'bg-slate-600 hover:bg-slate-500'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Navigation Arrows */}
                    <div className="hidden md:block">
                      <button
                        onClick={() =>
                          setCurrentTestimonial(prev =>
                            prev === 0 ? testimonials.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 transform items-center justify-center rounded-full border border-slate-600 bg-slate-800/80 text-white transition-all duration-300 hover:scale-110 hover:bg-slate-700/80 hover:text-blue-400"
                      >
                        <ArrowRight className="h-5 w-5 rotate-180" />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentTestimonial(
                            prev => (prev + 1) % testimonials.length
                          )
                        }
                        className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 transform items-center justify-center rounded-full border border-slate-600 bg-slate-800/80 text-white transition-all duration-300 hover:scale-110 hover:bg-slate-700/80 hover:text-blue-400"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </div>
                  </>
                );
              })()}
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
