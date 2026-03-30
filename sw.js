// Service Worker - 亲子英语大冒险
// 更新内容时，修改 CACHE_VERSION 的值（会触发自动更新提示）
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = 'qinzi-english-' + CACHE_VERSION;

// 需要缓存的本地资源（音频走CDN，不缓存）
const CACHE_URLS = [
  './',
  './亲子英语学习中心_CDN版.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
];

// 安装时缓存核心文件
self.addEventListener('install', event => {
  console.log('[SW] 安装版本:', CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] 缓存核心文件...');
        return cache.addAll(CACHE_URLS.map(url => {
          return new Request(url, {cache: 'reload'});
        })).catch(err => {
          console.warn('[SW] 部分文件缓存失败（正常）:', err);
        });
      })
  );
  // 收到跳过消息时立即激活
  self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });
});

// 激活时清理旧版本缓存
self.addEventListener('activate', event => {
  console.log('[SW] 激活版本:', CACHE_VERSION);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name.startsWith('qinzi-english-') && name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] 清理旧缓存:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// 拦截请求：本地资源走缓存，CDN音频走网络（不缓存）
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // CDN 音频：直接走网络，不缓存
  if (url.includes('cdn.jsdelivr.net') || url.includes('.mp3')) {
    return;
  }

  // 本地资源：缓存优先，失败走网络
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          // 后台同时更新缓存（stale-while-revalidate）
          const fetchPromise = fetch(event.request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          }).catch(() => {});
          return response;
        }
        // 没有缓存，走网络
        return fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        });
      })
  );
});

// 收到主线程消息
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
