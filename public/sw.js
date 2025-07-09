// Service Worker untuk caching assets dan CSS
const CACHE_NAME = 'berkas-app-v1';
const STATIC_CACHE = 'berkas-static-v1';
const DYNAMIC_CACHE = 'berkas-dynamic-v1';

// Assets yang akan di-cache
const STATIC_ASSETS = [
  '/build/manifest.json',
  '/build/assets/app.css',
  '/build/assets/app.js',
  '/favicon.ico',
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch(error => {
        console.log('Service Worker: Cache failed', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache first, then network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached version if available
      if (response) {
        console.log('Service Worker: Serving from cache', event.request.url);
        return response;
      }

      // Otherwise fetch from network
      return fetch(event.request)
        .then(fetchResponse => {
          // Don't cache if not a valid response
          if (
            !fetchResponse ||
            fetchResponse.status !== 200 ||
            fetchResponse.type !== 'basic'
          ) {
            return fetchResponse;
          }

          // Clone the response
          const responseToCache = fetchResponse.clone();

          // Determine which cache to use
          let cacheName = DYNAMIC_CACHE;
          if (STATIC_ASSETS.some(asset => event.request.url.includes(asset))) {
            cacheName = STATIC_CACHE;
          }

          // Cache CSS files and assets aggressively
          if (
            event.request.url.includes('.css') ||
            event.request.url.includes('.js') ||
            event.request.url.includes('/build/')
          ) {
            caches.open(cacheName).then(cache => {
              console.log(
                'Service Worker: Caching new resource',
                event.request.url
              );
              cache.put(event.request, responseToCache);
            });
          }

          return fetchResponse;
        })
        .catch(() => {
          // Network failed, try to serve from cache
          return caches.match('/offline.html') || new Response('Offline');
        });
    })
  );
});

// Message event - manual cache refresh
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'REFRESH_CACHE') {
    event.waitUntil(
      caches
        .keys()
        .then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => {
              return caches.delete(cacheName);
            })
          );
        })
        .then(() => {
          return caches.open(STATIC_CACHE);
        })
        .then(cache => {
          return cache.addAll(STATIC_ASSETS);
        })
    );
  }
});
