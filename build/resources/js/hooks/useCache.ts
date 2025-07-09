import { useCallback, useEffect, useState } from 'react';

// Cache interface
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry?: number;
}

// Cache manager class
class CacheManager {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_EXPIRY = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, expiry?: number): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiry: expiry || this.DEFAULT_EXPIRY,
    };
    this.cache.set(key, item);

    // Also store in localStorage for persistence
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  get<T>(key: string): T | null {
    // First check memory cache
    let item = this.cache.get(key);

    // If not in memory, try localStorage
    if (!item) {
      try {
        const stored = localStorage.getItem(`cache_${key}`);
        if (stored) {
          item = JSON.parse(stored);
          this.cache.set(key, item!);
        }
      } catch (error) {
        console.warn('Failed to read from localStorage:', error);
      }
    }

    if (!item) return null;

    // Check if expired
    const now = Date.now();
    if (item.expiry && now - item.timestamp > item.expiry) {
      this.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }

  clear(): void {
    this.cache.clear();
    // Clear all cache items from localStorage
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear localStorage cache:', error);
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

// Global cache instance
export const cacheManager = new CacheManager();

// React hook for caching
export function useCache<T>(
  key: string,
  fetchFunction: () => Promise<T> | T,
  options: {
    expiry?: number;
    forceRefresh?: boolean;
    enabled?: boolean;
  } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { expiry, forceRefresh = false, enabled = true } = options;

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Check cache first (unless forced refresh)
    if (!forceRefresh) {
      const cached = cacheManager.get<T>(key);
      if (cached !== null) {
        setData(cached);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await Promise.resolve(fetchFunction());
      setData(result);
      cacheManager.set(key, result, expiry);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);

      // Try to use stale cache data on error
      const staleData = cacheManager.get<T>(key);
      if (staleData !== null) {
        setData(staleData);
      }
    } finally {
      setLoading(false);
    }
  }, [key, fetchFunction, expiry, forceRefresh, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    cacheManager.delete(key);
    fetchData();
  }, [key, fetchData]);

  const clearCache = useCallback(() => {
    cacheManager.delete(key);
    setData(null);
  }, [key]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache,
    isCached: cacheManager.has(key),
  };
}

// Hook for component-level caching
export function useComponentCache() {
  const [cacheEnabled, setCacheEnabled] = useState(true);

  const getCachedComponent = useCallback(
    <T>(
      key: string,
      component: () => T,
      expiry = 10 * 60 * 1000 // 10 minutes default
    ): T => {
      if (!cacheEnabled) {
        return component();
      }

      const cached = cacheManager.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      const result = component();
      cacheManager.set(key, result, expiry);
      return result;
    },
    [cacheEnabled]
  );

  return {
    getCachedComponent,
    setCacheEnabled,
    cacheEnabled,
    clearAllCache: () => cacheManager.clear(),
  };
}

// Hook for preloading resources
export function usePreloader() {
  const [preloaded, setPreloaded] = useState<Set<string>>(new Set());

  const preloadCSS = useCallback(
    (href: string) => {
      if (preloaded.has(href)) return Promise.resolve();

      return new Promise<void>((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        link.onload = () => {
          setPreloaded(prev => new Set([...prev, href]));
          resolve();
        };
        link.onerror = reject;
        document.head.appendChild(link);
      });
    },
    [preloaded]
  );

  const preloadJS = useCallback(
    (src: string) => {
      if (preloaded.has(src)) return Promise.resolve();

      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
          setPreloaded(prev => new Set([...prev, src]));
          resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
      });
    },
    [preloaded]
  );

  return {
    preloadCSS,
    preloadJS,
    preloaded: Array.from(preloaded),
  };
}
