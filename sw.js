// BHCS GC Tour 2026 — Staff Hub Service Worker
// Cache-first with stale-while-revalidate: opens instantly offline,
// updates cache silently in background when connected.
const CACHE = 'staff-hub-v1';

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) {
      return c.add(self.registration.scope);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.open(CACHE).then(function(cache) {
      return cache.match(e.request).then(function(cached) {
        var fetchPromise = fetch(e.request).then(function(response) {
          cache.put(e.request, response.clone());
          return response;
        }).catch(function() { return cached; });
        return cached || fetchPromise;
      });
    })
  );
});
