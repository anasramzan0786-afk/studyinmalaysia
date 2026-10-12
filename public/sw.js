// Service Worker for Meezab Higher Education Portal PWA
const CACHE_NAME = 'meezab-pwa-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass-through network requests
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});

