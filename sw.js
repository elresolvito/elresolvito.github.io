// sw.js - Service Worker con OneSignal
const CACHE_NAME = 'el-resolvito-cache-v4.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/android-chrome-512x512.png',
  '/catalogo.js',
  '/catalogo-dinamico.js'
];

// Importar el Service Worker de OneSignal
importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js');

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Excluir requests a OneSignal
  if (event.request.url.includes('onesignal.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        }).catch(() => {
          // Si falla la red y no está en cache
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Manejar mensajes push desde OneSignal
self.addEventListener('push', function(event) {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'Nuevo mensaje de El Resolvito',
    icon: '/android-chrome-512x512.png',
    badge: '/android-chrome-512x512.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir'
      },
      {
        action: 'close',
        title: 'Cerrar'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'El Resolvito', options)
  );
});

// Manejar clics en las notificaciones
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      for (let client of windowClients) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || '/');
      }
    })
  );
});

// Manejar mensajes desde la app principal
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CATALOGO_ACTUALIZADO') {
    console.log('🔄 Catalogo actualizado desde segundo plano');
    // Podrías mostrar una notificación aquí
  }
});
