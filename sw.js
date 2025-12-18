// sw.js
const CACHE_NAME = 'el-resolvito-v5';
const urlsToCache = [
  '/',
  '/index.html',
  '/catalogo.js',
  '/catalogo-dinamico.js',
  '/manifest.json',
  // Agrega aquí otros recursos importantes
];

// Instalación y caching
self.addEventListener('install', event => {
  console.log('Service Worker instalándose...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Estrategia de cache: primero cache, luego red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve del cache si está disponible
        if (response) {
          return response;
        }
        
        // Si no está en cache, hace la petición
        return fetch(event.request)
          .then(response => {
            // No cacheamos respuestas que no sean exitosas
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonamos la respuesta para cachearla
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Si falla la red, podrías devolver una página offline personalizada
            return caches.match('/offline.html');
          });
      })
  );
});

// Limpieza de cache antiguo
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Tomar control inmediato de los clientes
  return self.clients.claim();
});

// ============================================
// NOTIFICACIONES PUSH
// ============================================

// Escuchar mensajes del cliente
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Manejar notificaciones push
self.addEventListener('push', event => {
  console.log('Evento push recibido:', event);
  
  let data = {
    title: '¡Nueva oferta!',
    body: 'Tenemos nuevas promociones para ti',
    icon: '/android-chrome-192x192.png',
    badge: '/favicon-32x32.png',
    tag: 'promo-notification',
    data: {
      url: 'https://elresolving.github.io/'
    }
  };
  
  // Intentar parsear los datos del push
  if (event.data) {
    try {
      const parsedData = event.data.json();
      data = { ...data, ...parsedData };
    } catch(e) {
      // Si no es JSON, usar como texto
      const text = event.data.text();
      if (text) {
        data.body = text;
      }
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || '/android-chrome-192x192.png',
      badge: data.badge || '/favicon-32x32.png',
      tag: data.tag || 'general-notification',
      data: data.data || { url: '/' },
      vibrate: [200, 100, 200],
      actions: [
        {
          action: 'open',
          title: 'Abrir tienda'
        },
        {
          action: 'close',
          title: 'Cerrar'
        }
      ]
    })
  );
});

// Manejar clics en notificaciones
self.addEventListener('notificationclick', event => {
  console.log('Notificación clickeada:', event.notification.tag);
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      }).then(windowClients => {
        // Buscar una ventana abierta
        for (let client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Si no hay ventana abierta, abrir una nueva
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

// Manejar cierre de notificaciones
self.addEventListener('notificationclose', event => {
  console.log('Notificación cerrada:', event.notification.tag);
});
