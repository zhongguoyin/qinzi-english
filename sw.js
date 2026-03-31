// Service Worker v2.0 - Network First for HTML, Cache First for media
const CACHE_NAME = 'qinzi-v2.0';
const MEDIA_CACHE = 'qinzi-media-v2.0';

// 安装时跳过等待，立即激活
self.addEventListener('install', event => {
  self.skipWaiting();
});

// 激活时清除所有旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME && k !== MEDIA_CACHE)
            .map(k => {
              console.log('[SW] 删除旧缓存:', k);
              return caches.delete(k);
            })
      )
    ).then(() => clients.claim())
  );
});

// 请求拦截
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // index.html 和根路径：永远走网络，不缓存
  if (url.endsWith('/') || url.includes('index.html') || url.includes('qinzi-english/') && !url.includes('.')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // 音频/图片（CDN 资源）：Cache First
  if (url.includes('cdn.jsdelivr.net') || url.includes('.mp3') || url.includes('.jpg') || url.includes('.png')) {
    event.respondWith(
      caches.open(MEDIA_CACHE).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(resp => {
            if (resp.ok) cache.put(event.request, resp.clone());
            return resp;
          });
        })
      )
    );
    return;
  }

  // 其他：网络优先
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
