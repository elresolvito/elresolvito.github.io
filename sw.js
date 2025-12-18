const CACHE_NAME = 'el-resolvito-cache-v2';
const DYNAMIC_CACHE = 'el-resolvito-dynamic-v1';
const CATALOGO_CACHE = 'el-resolvito-catalogo-v1';

// Archivos críticos para offline
const ARCHIVOS_CRITICOS = [
    '/',
    '/index.html',
    '/styles.css', // Si tienes un archivo CSS externo, inclúyelo
    '/script.js',  // Si tienes un archivo JS externo, inclúyelo
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png',
    '/favicon-32x32.png',
    '/favicon-16x16.png',
    '/catalogo.js', // Catálogo local de respaldo
    '/catalogo-dinamico.js', // Script del catálogo dinámico
    '/manifest.json?v=4',
    
    // Imágenes principales
    'https://i.postimg.cc/rsCKV7LZ/1755367982611.jpg',
    'https://i.postimg.cc/s2FHrX2Y/logo_el_resolvito.jpg',
    
    // Imágenes de productos críticas (las primeras 10)
    'https://i.postimg.cc/FFdbnBBS/aceite.jpg',
    'https://i.postimg.cc/ZRR352mX/arroz.jpg',
    'https://i.postimg.cc/rpBWC2DW/spaguetis.png',
    'https://i.postimg.cc/pdhzFLLR/picadillo-de-pollo.png',
    'https://i.postimg.cc/R0mKFv73/salchichas-1-paquete.png',
    'https://i.postimg.cc/sXBWqMwz/cerveza-predidente-precio-220.png',
    'https://i.postimg.cc/mD0wD6fZ/malta-guajira.jpg',
    'https://i.postimg.cc/fRbxMK43/leche-condensada.jpg',
    'https://i.postimg.cc/7LDd9DVz/Jab-n-Ridel-100g-r.png',
    'https://i.postimg.cc/MTzsbBM1/refresco-1.png'
];

// URLs de recursos dinámicos (no críticas para offline inmediato)
const RECURSOS_DINAMICOS = [
    // CSV del catálogo
    'https://raw.githubusercontent.com/eJresolvito/eJresolvito.github.io/main/Products.csv',
    
    // Más imágenes de productos
    'https://i.postimg.cc/hiogado_de_pollo.jpg',
    'https://i.postimg.cc/8zBPM9Yn/grok_image_xotf0za.jpg',
    'https://i.postimg.cc/rFt14B4k/frijol_negro.jpg',
    'https://i.postimg.cc/c4qpfNz7/Galletas-7-tacos.png',
    'https://i.postimg.cc/NfD6hnnq/detergente_brillante.jpg',
    'https://i.postimg.cc/HLv56w03/cerveza-ulaguer-precio-300.png',
    'https://i.postimg.cc/MZ5gbYw8/cristal.png',
    'https://i.postimg.cc/c40RbWXB/azucar_blanca.jpg',
    'https://i.postimg.cc/Znt5rmJ2/grok_image_xypezad.jpg',
    'https://i.postimg.cc/pLsccNs6/Malta-Morena-8-oz-Lata.jpg',
    'https://i.postimg.cc/GhqTCs0B/fritos.jpg',
    'https://i.postimg.cc/5t3GkG7R/jabon-de-ba-o-pemila.png',
    'https://i.postimg.cc/m2b1Jynf/pasta-de-tomate.jpg',
    'https://i.postimg.cc/Zq1yQkGV/pelly.jpg',
    'https://i.postimg.cc/QdC9xxsf/ron-capitan-cortez.jpg',
    'https://i.postimg.cc/Wb6CbTSq/sorbeto-renata.jpg',
    'https://i.postimg.cc/J4dFhC21/gel_de_ducha-precio_1200.png',
    'https://i.postimg.cc/nLKTBy09/locion_corporal_reafirmante_isanaQ___vitamina_c-precio_1500.png',
    'https://i.postimg.cc/mD8w6Qxb/mermelada-de-fresa-200-g-precio_600.png',
    'https://i.postimg.cc/T1NthnQk/locion_corporal_Garnier-precio_1500.png'
];

// INSTALAR Service Worker
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando versión v2...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Almacenando archivos críticos en caché');
                // Solo cachear archivos críticos (los esenciales)
                return cache.addAll(ARCHIVOS_CRITICOS);
            })
            .then(() => {
                console.log('[Service Worker] Instalación completada');
                return self.skipWaiting(); // Activar inmediatamente
            })
    );
});

// ACTIVAR Service Worker
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activando...');
    
    // Limpiar cachés antiguos
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Mantener solo los cachés actuales
                    if (cacheName !== CACHE_NAME && 
                        cacheName !== DYNAMIC_CACHE && 
                        cacheName !== CATALOGO_CACHE) {
                        console.log('[Service Worker] Eliminando caché antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[Service Worker] Activación completada');
            
            // Reclamar clientes inmediatamente
            return self.clients.claim();
        })
    );
});

// ESTRATEGIA DE CACHÉ INTELIGENTE
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    const isImage = url.pathname.match(/\.(jpg|png|gif|webp|jpeg)$/i);
    const isCsv = url.pathname.match(/\.(csv)$/i) || url.href.includes('Products.csv');
    const isApiCall = url.href.includes('api.countapi');
    
    // Para imágenes y CSV: Cache First, luego Network
    if (isImage || isCsv) {
        event.respondWith(
            caches.match(event.request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        console.log('[Service Worker] Sirviendo desde caché:', url.pathname);
                        return cachedResponse;
                    }
                    
                    // Si no está en caché, ir a la red
                    return fetch(event.request)
                        .then((networkResponse) => {
                            // Si la petición es exitosa, guardar en caché dinámico
                            if (networkResponse && networkResponse.status === 200) {
                                const responseClone = networkResponse.clone();
                                caches.open(DYNAMIC_CACHE)
                                    .then((cache) => {
                                        cache.put(event.request, responseClone);
                                        console.log('[Service Worker] Guardando en caché dinámico:', url.pathname);
                                    });
                            }
                            return networkResponse;
                        })
                        .catch(() => {
                            // Para imágenes: devolver placeholder
                            if (isImage) {
                                return caches.match('https://i.postimg.cc/s2FHrX2Y/logo_el_resolvito.jpg');
                            }
                            // Para CSV: devolver datos del catálogo local
                            if (isCsv) {
                                return new Response('', {
                                    headers: { 'Content-Type': 'text/csv' }
                                });
                            }
                            return new Response('Error de red', { status: 404 });
                        });
                })
        );
        return;
    }
    
    // Para API calls: Network First, luego Cache
    if (isApiCall) {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(DYNAMIC_CACHE)
                            .then((cache) => {
                                cache.put(event.request, responseClone);
                            });
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // Si falla la red, usar datos de localStorage
                    const fallbackData = JSON.stringify({
                        value: parseInt(localStorage.getItem('elResolvitoVisits') || '150'),
                        usingFallback: true
                    });
                    return new Response(fallbackData, {
                        headers: { 'Content-Type': 'application/json' }
                    });
                })
        );
        return;
    }
    
    // Para todo lo demás: Cache First, luego Network
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    console.log('[Service Worker] Sirviendo desde caché:', url.pathname);
                    return cachedResponse;
                }
                
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Solo guardar en caché si es una respuesta exitosa
                        if (networkResponse && networkResponse.status === 200) {
                            const responseClone = networkResponse.clone();
                            caches.open(DYNAMIC_CACHE)
                                .then((cache) => {
                                    cache.put(event.request, responseClone);
                                });
                        }
                        return networkResponse;
                    })
                    .catch(() => {
                        // Si estamos offline y es una navegación, mostrar página offline
                        if (event.request.mode === 'navigate') {
                            return caches.match('/')
                                .then((cachedPage) => {
                                    if (cachedPage) return cachedPage;
                                    // Si no tenemos la página, devolver una respuesta básica
                                    return new Response(
                                        '<h1>Estás offline</h1><p>La aplicación está disponible offline después de la primera visita.</p>',
                                        { headers: { 'Content-Type': 'text/html' } }
                                    );
                                });
                        }
                        
                        // Para otros recursos, devolver error
                        return new Response('Recurso no disponible offline', {
                            status: 408,
                            statusText: 'Offline'
                        });
                    });
            })
    );
});

// SINCRONIZACIÓN EN SEGUNDO PLANO
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-catalogo') {
        console.log('[Service Worker] Sincronizando catálogo en segundo plano');
        event.waitUntil(sincronizarCatalogo());
    }
});

async function sincronizarCatalogo() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/eJresolvito/eJresolvito.github.io/main/Products.csv');
        const csvData = await response.text();
        
        // Guardar en caché
        const cache = await caches.open(CATALOGO_CACHE);
        const cacheResponse = new Response(csvData, {
            headers: { 'Content-Type': 'text/csv' }
        });
        await cache.put('https://raw.githubusercontent.com/eJresolvito/eJresolvito.github.io/main/Products.csv', cacheResponse);
        
        console.log('[Service Worker] Catálogo sincronizado en segundo plano');
        
        // Notificar a los clientes que hay datos actualizados
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'catalogoActualizado',
                data: csvData
            });
        });
    } catch (error) {
        console.error('[Service Worker] Error sincronizando catálogo:', error);
    }
}

// MANEJAR MENSAJES
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
