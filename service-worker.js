const CACHE_NAME = 'kaun-cache';
const OFFLINE_URLS = [
  'index.html',
  'logos/favicon-16.png',
  'logos/favicon-32.png',
  'logos/favicon-android-192.png',
  'logos/favicon-android-512.png',
  'logos/favicon-apple-touch.png',
  'logos/kaun-logo.png',
  'manifest.json',
];

// On install, cache all files
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting(); // Activate new SW immediately
});

// On activate, clean old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim(); // Control pages immediately
});

// Serve from cache or fetch from network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() =>
          caches.match('/index.html') // fallback for offline
        )
      );
    })
  );
});