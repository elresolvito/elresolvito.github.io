// js/main.js
// ============================================
// INICIALIZACIÓN Y EVENTOS GLOBALES
// ============================================

// Función para inicializar todo DESPUÉS de cargar componentes
function initializeAfterComponents() {
    // Ahora sí podemos inicializar el modo noche
    initDayNight();
    
    // Actualizar carrito
    if (typeof updateCartUI === 'function') {
        updateCartUI();
    }
    
    // Inicializar funciones específicas de cada página
    if (typeof renderFeaturedProducts === 'function') {
        renderFeaturedProducts();
    }
    if (typeof initCarousel === 'function') {
        initCarousel();
    }
    if (typeof renderProducts === 'function') {
        renderProducts();
    }
}

// Modificar el DOMContentLoaded para esperar a los componentes
document.addEventListener('DOMContentLoaded', function() {
    // Quitar fade de entrada
    document.getElementById('pageFade').classList.add('opacity-0');
    
    // NOTA: ya no llamamos a initDayNight() aquí porque los componentes
    // aún no se han cargado. La llamada se hará después de cargar componentes.
});

// Cerrar modales con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeImageModal();
        if (document.getElementById('checkoutModal') && !document.getElementById('checkoutModal').classList.contains('hidden')) {
            closeCheckoutModal();
        } else if (document.getElementById('cartSidebar')?.classList.contains('cart-open')) {
            toggleCart();
        }
    }
});

// Transición suave entre páginas
document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    
    if (href && !href.startsWith('http') && !href.startsWith('#') && 
        !href.startsWith('mailto') && !href.startsWith('tel') && 
        href !== 'javascript:void(0)' && !href.includes('wa.me') && !href.includes('instagram')) {
        
        link.addEventListener('click', function(e) {
            if (e.ctrlKey || e.metaKey || e.button === 1) return;
            
            e.preventDefault();
            
            localStorage.setItem('nightMode', document.body.classList.contains('night-mode'));
            
            document.getElementById('pageFade').classList.remove('opacity-0');
            
            setTimeout(() => {
                window.location.href = href;
            }, 150);
        });
    }
});

window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        document.getElementById('pageFade').classList.add('opacity-0');
    }
});
