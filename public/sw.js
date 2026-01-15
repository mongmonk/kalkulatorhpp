
const CACHE_NAME = 'hpp-pro-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './index.css',
  './manifest.json',
  // Resource eksternal akan dicoba di-cache dengan fallback
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Fallback cache untuk resource eksternal yang mungkin gagal
const FALLBACK_CACHE = 'hpp-pro-fallback-v1';

self.addEventListener('install', (event) => {
  console.log('Service Worker: Install event started');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Cache opened, starting to cache assets');
      
      // Pisahkan resource internal dan eksternal
      const internalAssets = ASSETS_TO_CACHE.filter(url => !url.startsWith('http'));
      const externalAssets = ASSETS_TO_CACHE.filter(url => url.startsWith('http'));
      
      // Cache internal assets terlebih dahulu
      return Promise.all(
        internalAssets.map((url) => {
          console.log(`Service Worker: Caching internal asset: ${url}`);
          return cache.add(url).catch(err => {
            console.error(`Service Worker: Failed to cache internal asset: ${url}`, err);
            return Promise.resolve();
          });
        })
      ).then(() => {
        // Coba cache external assets dengan error handling yang lebih baik
        return Promise.all(
          externalAssets.map((url) => {
            console.log(`Service Worker: Attempting to cache external asset: ${url}`);
            return fetch(url, { mode: 'no-cors' })
              .then(response => {
                // Untuk response no-cors, kita tidak bisa membaca status
                console.log(`Service Worker: External asset fetched: ${url}`);
                return cache.put(url, response);
              })
              .catch(err => {
                console.warn(`Service Worker: Failed to cache external asset: ${url}`, err);
                // Jangan gagal seluruh proses jika external asset gagal
                return Promise.resolve();
              });
          })
        );
      }).then(() => {
        console.log('Service Worker: All caching attempts completed');
        // Force activation
        return self.skipWaiting();
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate event');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== FALLBACK_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version if available
      if (response) {
        console.log(`Service Worker: Serving from cache: ${event.request.url}`);
        return response;
      }
      
      // Otherwise fetch from network
      console.log(`Service Worker: Fetching from network: ${event.request.url}`);
      return fetch(event.request).catch(err => {
        console.error(`Service Worker: Network fetch failed: ${event.request.url}`, err);
        
        // Untuk resource eksternal yang gagal, coba fallback
        if (event.request.url.startsWith('http')) {
          console.log(`Service Worker: Attempting fallback for external resource: ${event.request.url}`);
          return caches.match(event.request.url);
        }
        
        // Jika semua gagal, return error
        throw err;
      });
    })
  );
});
