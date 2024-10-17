// service-worker.js

const CACHE_NAME = 'v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/manifest.json',
];

// Устанавливаем Service Worker и кэшируем ресурсы
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Открыт кэш');
      return cache.addAll(urlsToCache);
    }),
  );
});

// Обрабатываем запросы, возвращая кэшированные данные при отсутствии сети
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // Возвращаем кэшированные ресурсы
      }
      return fetch(event.request); // Запрашиваем новые ресурсы с сети
    }),
  );
});

// Обновляем кэш, удаляя старые данные
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
