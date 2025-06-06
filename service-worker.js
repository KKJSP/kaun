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

// Install: cache the essential files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(OFFLINE_URLS);
    })
  );
});

// Activate: cleanup old caches (optional for future updates)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// Fetch: serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});
