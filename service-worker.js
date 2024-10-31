// Service Worker Installation
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('softphone-cache').then(function(cache) {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json',
        './jssip-3.10.0.min.js',
        './icon-192x192.png',
        './icon-512x512.png'
      ]);
    })
  );
});

// Service Worker Activation
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName !== 'softphone-cache';
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Fetch Event Handling
self.addEventListener('fetch', function(event) {
  // Bypass WebSocket requests to avoid caching or interference
  if (event.request.url.startsWith('wss://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
