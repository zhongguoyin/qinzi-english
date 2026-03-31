// Service Worker - 亲子英语大冒险
// 更新内容时，修改 CACHE_VERSION 的值（会触发自动更新提示）
const CACHE_VERSION = 'v1.0.4';
const CACHE_NAME = 'qinzi-v1774962393' + CACHE_VERSION;

// 安装：立刻激活，跳过 waiting
self.addEventListener('install', event => {
  console.log('[SW] 安装版本:', CACHE_VERSION);
  self.skipWaiting();  // 新 SW 安装后立即接管，无需等用户关闭旧页面
});

// 激活时清理旧版本缓存，并立刻接管所有页面
self.addEventListener('activate', event => {
  console.log('[SW] 激活版本:', CACHE_VERSION);
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name.startsWith('qinzi-english-') && name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] 清理旧缓存:', name);
            return caches.delete(name);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// 拦截请求策略：
// - CDN 音频（mp3）：完全不拦截，直接走网络
// - HTML 主页面：完全不缓存，每次都从网络加载最新版
// - 其他静态资源（图标等）：缓存优先
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // CDN 音频：完全不拦截
  if (url.includes('cdn.jsdelivr.net') || url.includes('.mp3')) {
    return;
  }

  // HTML 主页面：完全不缓存，始终从网络加载
  if (url.includes('.html') || url.endsWith('/') || url.endsWith('/qinzi-english/')) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .catch(() => caches.match(event.request))  // 离线时才用缓存
    );
    return;
  }

  // 其他静态资源（图标/manifest等）：缓存优先，加快加载
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return networkResponse;
      });
    })
  );
});

// 收到主线程消息（兼容手动触发更新）
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});