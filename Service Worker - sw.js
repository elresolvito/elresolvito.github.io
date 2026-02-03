// sw.js - Service Worker para PWA y caché offline

const CACHE_NAME = 'mercado-bayona-v1';
const OFFLINE_URL = '/offline.html';

// Archivos críticos para caché inmediata
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/assets/css/styles.css',
    '/assets/css/animations.css',
    '/assets/js/app.js',
    '/assets/js/catalog-manager.js',
    '/assets/js/product-modal.js',
    '/assets/js/cart-system.js',
    '/assets/js/checkout-flow.js',
    '/config/settings.js',
    '/config/colors.js',
    '/data/catalog.json',
    '/data/services.json',
    
    // Imágenes esenciales
    '/assets/images/logos/icon-192.png',
    '/assets/images/logos/icon-512.png',
    
    // Fuentes
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Comfortaa:wght@400;500;600&display=swap'
];

// Instalar Service Worker
self.addEventListener('install', event => {
    console.log('🛠️ Service Worker instalando...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Precachando recursos críticos');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => {
                console.log('✅ Pre-caché completado');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Error en pre-caché:', error);
            })
    );
});

// Activar Service Worker
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker activado');
    
    // Limpiar caches antiguos
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Eliminando cache antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker listo para controlar clientes');
            return self.clients.claim();
        })
    );
});

// Estrategia: Cache First con fallback a network
self.addEventListener('fetch', event => {
    // Solo manejar solicitudes GET
    if (event.request.method !== 'GET') return;
    
    // Evitar extensiones del navegador y solicitudes externas no confiables
    const url = new URL(event.request.url);
    const isExternal = !url.origin.startsWith(self.location.origin);
    
    // Si es una solicitud a Google Sheets o APIs externas, usar network only
    if (isExternal && (url.href.includes('google.com') || url.href.includes('googleapis.com'))) {
        event.respondWith(networkOnly(event.request));
        return;
    }
    
    // Para recursos estáticos (CSS, JS, imágenes), usar Cache First
    if (isStaticAsset(event.request)) {
        event.respondWith(cacheFirst(event.request));
        return;
    }
    
    // Para documentos HTML, usar Network First
    if (event.request.headers.get('Accept').includes('text/html')) {
        event.respondWith(networkFirst(event.request));
        return;
    }
    
    // Para datos JSON (catálogo), usar Stale While Revalidate
    if (url.pathname.endsWith('.json')) {
        event.respondWith(staleWhileRevalidate(event.request));
        return;
    }
    
    // Por defecto: Network First
    event.respondWith(networkFirst(event.request));
});

// ==================== ESTRATEGIAS DE CACHÉ ====================

// Cache First: Ideal para recursos estáticos
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        // Cachear respuesta para futuras solicitudes
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Si falla la red y no hay en caché, mostrar página offline
        if (request.headers.get('Accept').includes('text/html')) {
            return caches.match(OFFLINE_URL);
        }
        
        throw error;
    }
}

// Network First: Ideal para HTML
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Cachear respuesta
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Fallback a caché
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Si es HTML y no hay en caché, mostrar offline
        if (request.headers.get('Accept').includes('text/html')) {
            return caches.match(OFFLINE_URL);
        }
        
        throw error;
    }
}

// Stale While Revalidate: Ideal para datos que pueden cambiar
async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    // Iniciar fetch en segundo plano para actualizar caché
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => {
        // Ignorar errores de red para el refresh
    });
    
    // Devolver de caché inmediatamente, luego actualizar
    return cachedResponse || fetchPromise;
}

// Network Only: Para APIs y recursos que no deben cachearse
async function networkOnly(request) {
    return fetch(request);
}

// ==================== UTILIDADES ====================

// Verificar si es un recurso estático
function isStaticAsset(request) {
    const url = new URL(request.url);
    const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf', '.ico'];
    
    return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

// Manejar mensajes del cliente
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Manejar push notifications (para futuras implementaciones)
self.addEventListener('push', event => {
    if (!event.data) return;
    
    const data = event.data.json();
    const options = {
        body: data.body || 'Nuevo mensaje de Mercado Bayona',
        icon: '/assets/images/logos/icon-192.png',
        badge: '/assets/images/logos/icon-96.png',
        vibrate: [200, 100, 200],
        data: {
            url: data.url || '/'
        }
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'Mercado Bayona', options)
    );
});

// Manejar clic en notificaciones
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            // Buscar ventana abierta
            for (const client of windowClients) {
                if (client.url === event.notification.data.url && 'focus' in client) {
                    return client.focus();
                }
            }
            
            // Abrir nueva ventana si no hay una abierta
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data.url);
            }
        })
    );
});
