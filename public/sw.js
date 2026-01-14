
const CACHE_NAME = 'hpp-pro-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Menggunakan fetch manual untuk aset eksternal guna menghindari masalah CORS
      return Promise.all(
        ASSETS_TO_CACHE.map((url) => {
          const requestInit = url.startsWith('http')
            ? { mode: 'no-cors' }
            : {};
          return fetch(url, requestInit)
            .then((response) => cache.put(url, response))
            .catch((err) => console.warn(`Gagal caching: ${url}`, err));
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
