// sw.js
const CACHE_NAME = 'el-resolvito-v7';

self.addEventListener('install', event => {
    console.log('Service Worker instalado');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('Service Worker activado');
    event.waitUntil(self.clients.claim());
});

self.addEventListener('push', event => {
    console.log('Push recibido');
    
    let options = {
        body: event.data ? event.data.text() : 'Nueva actualización disponible',
        icon: 'https://i.postimg.cc/s2FHrX2Y/logo_el_resolvito.jpg',
        badge: 'https://i.postimg.cc/s2FHrX2Y/logo_el_resolvito.jpg',
        vibrate: [100, 50, 100],
        data: {
            url: '/'
        }
    };
    
    event.waitUntil(
        self.registration.showNotification('El Resolvito', options)
    );
});

self.addEventListener('notificationclick', event => {
    console.log('Notificación clickeada');
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({type: 'window', includeUncontrolled: true})
        .then(windowClients => {
            for (let client of windowClients) {
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
