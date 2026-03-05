// js/elresolvito.js
(function() {
    'use strict';
    
    // ============================================
    // VARIABLES GLOBALES
    // ============================================
    let cart = JSON.parse(localStorage.getItem('elResolvitoCart')) || [];
    const WHATSAPP_NUMBER = '5356382909';
    const MINIMUM_PURCHASE = 500;
    const SHIPPING_WITHIN_HABANA_VIEJA = 400;
    
    // ============================================
    // FUNCIONES DEL CARRITO
    // ============================================
    
    window.addToCart = function(product) {
        if (!product || !product.id || !product.nombre || !product.precio) {
            alert('Error al añadir producto');
            return false;
        }

        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].cantidad += product.cantidad || 1;
        } else {
            cart.push({
                id: product.id,
                nombre: product.nombre,
                imagen: product.imagen,
                precio: product.precio,
                cantidad: product.cantidad || 1
            });
        }

        saveCart();
        window.updateCartUI();
        alert('✓ Producto añadido al carrito');
        return true;
    };

    function saveCart() {
        localStorage.setItem('elResolvitoCart', JSON.stringify(cart));
    }

    window.updateCartQuantity = function(index, newQuantity) {
        if (newQuantity <= 0) {
            window.removeFromCart(index);
            return;
        }
        cart[index].cantidad = newQuantity;
        saveCart();
        window.updateCartUI();
    };

    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        saveCart();
        window.updateCartUI();
    };

    window.updateCartUI = function() {
        const totalItems = cart.reduce((sum, item) => sum + (item.cantidad || 0), 0);
        const subtotal = cart.reduce((sum, item) => sum + (item.precio * (item.cantidad || 0)), 0);
        
        document.querySelectorAll('#cartCount, #floatingCartCount').forEach(el => {
            if (el) {
                el.textContent = totalItems;
                if (totalItems > 0) {
                    el.classList.remove('hidden');
                } else {
                    el.classList.add('hidden');
                }
            }
        });
        
        const cartItemsContainer = document.getElementById('cartItems');
        if (cartItemsContainer) {
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<div class="text-center py-8 text-gray-500"><i class="fas fa-shopping-cart text-4xl mb-3 opacity-30"></i><p>Tu carrito está vacío</p></div>';
            } else {
                cartItemsContainer.innerHTML = cart.map((item, index) => `
                    <div class="flex gap-3 bg-gray-50 p-3 rounded-lg">
                        <img src="${item.imagen || 'https://placehold.co/80'}" class="w-16 h-16 object-contain bg-white rounded-lg">
                        <div class="flex-1">
                            <h4 class="font-medium text-sm">${item.nombre}</h4>
                            <p class="text-cuban-green font-bold">$${item.precio?.toLocaleString()}</p>
                            <div class="flex items-center gap-2 mt-1">
                                <button onclick="window.updateCartQuantity(${index}, ${(item.cantidad || 1) - 1})" class="w-6 h-6 bg-white rounded shadow">-</button>
                                <span class="text-sm font-medium">${item.cantidad || 1}</span>
                                <button onclick="window.updateCartQuantity(${index}, ${(item.cantidad || 1) + 1})" class="w-6 h-6 bg-white rounded shadow">+</button>
                                <button onclick="window.removeFromCart(${index})" class="ml-auto text-red-500">🗑️</button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
        
        const subtotalEl = document.getElementById('cartSubtotal');
        const shippingEl = document.getElementById('cartShipping');
        const totalEl = document.getElementById('cartTotal');
        
        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString()}`;
        
        if (subtotal < MINIMUM_PURCHASE) {
            if (shippingEl) shippingEl.innerHTML = `<span class="text-orange-500">Mínimo $${MINIMUM_PURCHASE}</span>`;
            if (totalEl) totalEl.textContent = `$${subtotal.toLocaleString()}`;
        } else {
            if (shippingEl) shippingEl.innerHTML = `<span class="text-gray-600">Seleccionar en checkout</span>`;
            if (totalEl) totalEl.textContent = `$${subtotal.toLocaleString()}`;
        }
    };

    window.toggleCart = function() {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        
        if (!sidebar || !overlay) {
            alert('Error: Elementos del carrito no encontrados');
            return;
        }
        
        sidebar.classList.toggle('cart-open');
        overlay.classList.toggle('hidden');
        document.body.style.overflow = sidebar.classList.contains('cart-open') ? 'hidden' : '';
    };

    // ============================================
    // FUNCIONES DE UI
    // ============================================
    
    window.toggleDayNight = function() {
        document.body.classList.toggle('night-mode');
        const themeIcon = document.getElementById('headerThemeIcon');
        if (themeIcon) {
            themeIcon.textContent = document.body.classList.contains('night-mode') ? '🌙' : '☀️';
        }
        localStorage.setItem('nightMode', document.body.classList.contains('night-mode'));
    };

    window.toggleMenu = function() {
        const menu = document.getElementById('mobileMenu');
        if (menu) {
            menu.classList.toggle('hidden');
            document.body.style.overflow = menu.classList.contains('hidden') ? '' : 'hidden';
        }
    };

    window.openImageModal = function(src, name) {
        const modal = document.getElementById('imageModal');
        const img = document.getElementById('modalImage');
        const nameEl = document.getElementById('modalImageName');
        if (modal && img && nameEl) {
            img.src = src;
            nameEl.textContent = name || 'Imagen';
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeImageModal = function() {
        const modal = document.getElementById('imageModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    };

    // ============================================
    // INICIALIZACIÓN
    // ============================================
    
    document.addEventListener('DOMContentLoaded', function() {
        // Quitar fade
        const pageFade = document.getElementById('pageFade');
        if (pageFade) pageFade.classList.add('opacity-0');
        
        // Actualizar carrito
        window.updateCartUI();
    });

})();
