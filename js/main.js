// js/main.js
// ============================================
// INICIALIZACIÓN Y EVENTOS GLOBALES
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar UI común
    initDayNight();
    updateCartUI();
    
    // Quitar fade de entrada
    document.getElementById('pageFade').classList.add('opacity-0');
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
