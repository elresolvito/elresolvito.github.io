const CACHE_NAME = 'el-resolvito-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css', // Si tienes un archivo CSS externo, inclúyelo
    '/script.js',  // Si tienes un archivo JS externo, inclúyelo
    '/android-chrome-192x192.png', // Tus íconos
    '/android-chrome-512x512.png',
    '/favicon-32x32.png',
    '/favicon-16x16.png',
    // Puedes incluir URLs de las imágenes principales aquí si deseas que estén offline
    'https://i.postimg.cc/rsCKV7LZ/1755367982611.jpg', // Imagen del hero-banner
    'https://i.postimg.cc/s2FHrX2Y/logo_el_resolvito.jpg' // Logo
    // Y todas las imágenes de productos (puedes automatizar esto en un entorno de build, o listar las más críticas)
    // Ejemplo de algunas imágenes de productos:
    'https://i.postimg.cc/FFdbnBBS/aceite.jpg',
    'https://i.postimg.cc/ZRR352mX/arroz.jpg',
    'https://i.postimg.cc/rpBWC2DW/spaguetis.png',
    'https://i.postimg.cc/pdhzFLLR/picadillo-de-pollo.png',
    'https://i.postimg.cc/R0mKFv73/salchichas-1-paquete.png',
    'https://i.postimg.cc/sXBWqMwz/cerveza-predidente-precio-220.png',
    'https://i.postimg.cc/mD0wD6fZ/malta-guajira.jpg',
    'https://i.postimg.cc/fRbxMK43/leche-condensada.jpg',
    'https://i.postimg.cc/7LDd9DVz/Jab-n-Ridel-100g-r.png', // Imagen de Jabón de Baño actualizada
    'https://i.postimg.cc/MTzsbBM1/refresco-1.png',
    'https://i.postimg.cc/52k8yC1s/hiogado_de_pollo.jpg',
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
    'https://i.postimg.cc/5t3GkG7R/jabon-de-ba-o-pemila.png', // Imagen de Jabón de Baño Pemila actualizada
    'https://i.postimg.cc/m2b1Jynf/pasta-de-tomate.jpg',
    'https://i.postimg.cc/Zq1yQkGV/pelly.jpg',
    'https://i.postimg.cc/QdC9xxsf/ron-capitan-cortez.jpg',
    'https://i.postimg.cc/Wb6CbTSq/sorbeto-renata.jpg',
    'https://i.postimg.cc/J4dFhC21/gel_de_ducha-precio_1200.png',
    'https://i.postimg.cc/nLKTBy09/locion_corporal_reafirmante_isanaQ___vitamina_c-precio_1500.png',
    'https://i.postimg.cc/mD8w6Qxb/mermelada-de-fresa-200-g-precio_600.png',
    'https://i.postimg.cc/T1NthnQk/locion_corporal_Garnier-precio_1500.png',
    // ... más URLs de imágenes de productos si las quieres offline
];

// Instala el Service Worker y cachea los archivos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Intercepta las solicitudes de red
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Si el archivo está en caché, lo devuelve
                if (response) {
                    return response;
                }
                // Si no, intenta obtenerlo de la red
                return fetch(event.request);
            })
    );
});

// Activa el Service Worker y limpia cachés antiguos
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName); // Elimina cachés que no están en la lista blanca
                    }
                })
            );
        })
    );
});
