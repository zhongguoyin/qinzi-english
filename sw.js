// Service Worker v3.0
const CACHE_NAME = 'qinzi-v3.0';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then(clients => {
        clients.forEach(c => c.postMessage({ type: 'SW_UPDATED' }));
      })
  );
});

self.addEventListener('fetch', event => {
  const url = event.request.url;
  if (url.includes('cdn.jsdelivr.net') || url.includes('.mp3')) return;
  if (url.includes('.html') || url.endsWith('/') || url.includes('/qinzi-english/')) {
    event.respondWith(fetch(event.request, { cache: 'no-store' }).catch(() => caches.match(event.request)));
    return;
  }
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
