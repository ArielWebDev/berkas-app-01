import { useCallback, useEffect, useRef, useState } from 'react';

// Performance optimization hook
export function usePerformanceOptimization() {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  // Detect performance capability
  useEffect(() => {
    const detectPerformance = () => {
      // Check device memory (if available)
      const memory = (navigator as any).deviceMemory;
      if (memory && memory < 4) {
        setIsLowPerformance(true);
        return;
      }

      // Check hardware concurrency
      const cores = navigator.hardwareConcurrency;
      if (cores && cores < 4) {
        setIsLowPerformance(true);
        return;
      }

      // Performance timing test
      const start = performance.now();
      for (let i = 0; i < 100000; i++) {
        // Simple computation
        Math.random() * Math.random();
      }
      const duration = performance.now() - start;

      if (duration > 10) {
        // If it takes more than 10ms
        setIsLowPerformance(true);
      }
    };

    detectPerformance();
  }, []);

  // FPS monitoring
  useEffect(() => {
    let animationId: number;

    const monitorFPS = () => {
      const currentTime = performance.now();
      frameCountRef.current++;

      if (currentTime - lastTimeRef.current >= 1000) {
        const fps = frameCountRef.current;
        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;

        // If FPS is consistently low, reduce animations
        if (fps < 30) {
          setAnimationsEnabled(false);
        } else if (fps > 50) {
          setAnimationsEnabled(true);
        }
      }

      animationId = requestAnimationFrame(monitorFPS);
    };

    animationId = requestAnimationFrame(monitorFPS);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  // Throttled scroll handler
  const useThrottledScroll = useCallback(
    (
      callback: (scrollY: number) => void,
      throttleMs = 16 // ~60fps
    ) => {
      const lastCallRef = useRef(0);

      return useCallback(
        (scrollY: number) => {
          const now = performance.now();
          if (now - lastCallRef.current >= throttleMs) {
            callback(scrollY);
            lastCallRef.current = now;
          }
        },
        [callback, throttleMs]
      );
    },
    []
  );

  // Intersection Observer for lazy loading
  const useIntersectionObserver = useCallback(
    (options: IntersectionObserverInit = {}) => {
      const [isIntersecting, setIsIntersecting] = useState(false);
      const targetRef = useRef<HTMLElement>(null);

      useEffect(() => {
        const target = targetRef.current;
        if (!target) return;

        const observer = new IntersectionObserver(
          ([entry]) => {
            setIsIntersecting(entry.isIntersecting);
          },
          {
            threshold: 0.1,
            rootMargin: '50px',
            ...options,
          }
        );

        observer.observe(target);

        return () => {
          observer.unobserve(target);
        };
      }, [options]);

      return { targetRef, isIntersecting };
    },
    []
  );

  return {
    isLowPerformance,
    animationsEnabled,
    useThrottledScroll,
    useIntersectionObserver,
    setAnimationsEnabled,
  };
}

// CSS Animation control hook
export function useAnimationControl() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const getAnimationClass = useCallback(
    (normalClass: string, reducedClass?: string) => {
      if (prefersReducedMotion) {
        return reducedClass || '';
      }
      return normalClass;
    },
    [prefersReducedMotion]
  );

  const shouldAnimate = useCallback(() => {
    return !prefersReducedMotion;
  }, [prefersReducedMotion]);

  return {
    prefersReducedMotion,
    getAnimationClass,
    shouldAnimate,
  };
}

// Resource preloader hook
export function useResourcePreloader() {
  const [loadedResources, setLoadedResources] = useState<Set<string>>(
    new Set()
  );
  const [loadingResources, setLoadingResources] = useState<Set<string>>(
    new Set()
  );

  const preloadImage = useCallback(
    (src: string) => {
      if (loadedResources.has(src) || loadingResources.has(src)) {
        return Promise.resolve();
      }

      setLoadingResources(prev => new Set([...prev, src]));

      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          setLoadedResources(prev => new Set([...prev, src]));
          setLoadingResources(prev => {
            const newSet = new Set(prev);
            newSet.delete(src);
            return newSet;
          });
          resolve();
        };
        img.onerror = () => {
          setLoadingResources(prev => {
            const newSet = new Set(prev);
            newSet.delete(src);
            return newSet;
          });
          reject(new Error(`Failed to load image: ${src}`));
        };
        img.src = src;
      });
    },
    [loadedResources, loadingResources]
  );

  const preloadFont = useCallback(
    (fontFamily: string, fontUrl: string) => {
      if (loadedResources.has(fontUrl)) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve, reject) => {
        const font = new FontFace(fontFamily, `url(${fontUrl})`);
        font
          .load()
          .then(() => {
            document.fonts.add(font);
            setLoadedResources(prev => new Set([...prev, fontUrl]));
            resolve();
          })
          .catch(reject);
      });
    },
    [loadedResources]
  );

  return {
    preloadImage,
    preloadFont,
    loadedResources: Array.from(loadedResources),
    loadingResources: Array.from(loadingResources),
    isLoaded: (src: string) => loadedResources.has(src),
    isLoading: (src: string) => loadingResources.has(src),
  };
}
