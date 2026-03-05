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
    // FUNCIONES DEL CARRITO - EXPUESTAS GLOBALMENTE
    // ============================================
    
    window.addToCart = function(product) {
        console.log('addToCart llamado con:', product);
        
        if (!product || !product.id || !product.nombre || !product.precio) {
            console.error('Producto inválido', product);
            window.showToast('Error al añadir producto');
            return false;
        }

        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].cantidad += product.cantidad || 1;
            window.showToast(`✓ ${product.nombre} (cantidad actualizada)`);
        } else {
            cart.push({
                id: product.id,
                nombre: product.nombre,
                imagen: product.imagen,
                precio: product.precio,
                cantidad: product.cantidad || 1
            });
            window.showToast(`✓ ${product.nombre} añadido al carrito`);
        }

        saveCart();
        window.updateCartUI();
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
        window.showToast('✓ Carrito actualizado');
    };

    window.removeFromCart = function(index) {
        const item = cart[index];
        cart.splice(index, 1);
        saveCart();
        window.updateCartUI();
        window.showToast(`✗ ${item.nombre} eliminado`);
    };

    window.clearCart = function() {
        cart = [];
        saveCart();
        window.updateCartUI();
        window.showToast('✓ Carrito vaciado');
    };

    window.updateCartUI = function() {
        console.log('Actualizando UI del carrito');
        const totalItems = cart.reduce((sum, item) => sum + (item.cantidad || 0), 0);
        const subtotal = cart.reduce((sum, item) => sum + (item.precio * (item.cantidad || 0)), 0);
        
        // Actualizar contadores
        document.querySelectorAll('#cartCount, #floatingCartCount').forEach(el => {
            if (el) {
                el.textContent = totalItems;
                if (totalItems > 0) {
                    el.classList.remove('hidden');
                    el.classList.add('badge-pop');
                    setTimeout(() => el.classList.remove('badge-pop'), 300);
                } else {
                    el.classList.add('hidden');
                }
            }
        });
        
        // Actualizar items del carrito
        const cartItemsContainer = document.getElementById('cartItems');
        if (cartItemsContainer) {
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<div class="text-center py-8 text-gray-500"><i class="fas fa-shopping-cart text-4xl mb-3 opacity-30"></i><p>Tu carrito está vacío</p></div>';
            } else {
                cartItemsContainer.innerHTML = cart.map((item, index) => `
                    <div class="flex gap-3 bg-gray-50 p-3 rounded-lg">
                        <img src="${item.imagen || 'https://placehold.co/80'}" class="w-16 h-16 object-contain bg-white rounded-lg" onerror="this.src='https://placehold.co/80'">
                        <div class="flex-1">
                            <h4 class="font-medium text-sm">${item.nombre}</h4>
                            <p class="text-cuban-green font-bold">$${item.precio?.toLocaleString()}</p>
                            <div class="flex items-center gap-2 mt-1">
                                <button onclick="window.updateCartQuantity(${index}, ${(item.cantidad || 1) - 1})" class="w-8 h-8 bg-white rounded-full shadow text-sm font-bold hover:bg-cuban-green hover:text-white transition">-</button>
                                <span class="text-base font-medium w-8 text-center">${item.cantidad || 1}</span>
                                <button onclick="window.updateCartQuantity(${index}, ${(item.cantidad || 1) + 1})" class="w-8 h-8 bg-white rounded-full shadow text-sm font-bold hover:bg-cuban-green hover:text-white transition">+</button>
                                <button onclick="window.removeFromCart(${index})" class="ml-2 text-red-500 hover:text-red-700 text-lg">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
        
        // Actualizar totales
        const subtotalEl = document.getElementById('cartSubtotal');
        const shippingEl = document.getElementById('cartShipping');
        const totalEl = document.getElementById('cartTotal');
        
        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString()}`;
        
        if (subtotal < MINIMUM_PURCHASE) {
            if (shippingEl) shippingEl.innerHTML = `<span class="text-orange-500 font-bold">Mínimo $${MINIMUM_PURCHASE}</span>`;
            if (totalEl) totalEl.textContent = `$${subtotal.toLocaleString()}`;
        } else {
            if (shippingEl) shippingEl.innerHTML = `<span class="text-gray-600">Seleccionar en checkout</span>`;
            if (totalEl) totalEl.textContent = `$${subtotal.toLocaleString()}`;
        }
    };

    window.showToast = function(message) {
        const toast = document.getElementById('cartToast');
        const msgEl = document.getElementById('cartToastMessage');
        if (!toast || !msgEl) return;

        msgEl.textContent = message;
        toast.classList.add('opacity-100');
        toast.classList.remove('opacity-0', 'pointer-events-none');

        clearTimeout(window.toastTimeout);
        window.toastTimeout = setTimeout(() => {
            toast.classList.remove('opacity-100');
            toast.classList.add('opacity-0', 'pointer-events-none');
        }, 2500);
    };

    window.toggleCart = function() {
        console.log('toggleCart llamado');
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        
        if (!sidebar || !overlay) {
            console.error('Elementos del carrito no encontrados');
            return;
        }
        
        sidebar.classList.toggle('cart-open');
        overlay.classList.toggle('hidden');
        document.body.style.overflow = sidebar.classList.contains('cart-open') ? 'hidden' : '';
    };

    // ============================================
    // CHECKOUT
    // ============================================
    
    window.openCheckoutModal = function() {
        if (cart.length === 0) {
            window.showToast('El carrito está vacío');
            return;
        }
        
        const subtotal = cart.reduce((sum, item) => sum + (item.precio * (item.cantidad || 0)), 0);
        if (subtotal < MINIMUM_PURCHASE) {
            window.showToast(`Compra mínima: $${MINIMUM_PURCHASE}`);
            return;
        }
        
        const modal = document.getElementById('checkoutModal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            const summaryEl = document.getElementById('checkoutCartSummary');
            const totalEl = document.getElementById('checkoutTotal');
            if (summaryEl) {
                summaryEl.innerHTML = cart.map(item => `
                    <div class="flex justify-between mb-1">
                        <span>${item.nombre} x${item.cantidad}</span>
                        <span>$${(item.precio * item.cantidad).toLocaleString()}</span>
                    </div>
                `).join('');
                if (totalEl) totalEl.textContent = `$${subtotal.toLocaleString()}`;
            }
        }
    };

    window.closeCheckoutModal = function() {
        const modal = document.getElementById('checkoutModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    };

    window.sendCompleteOrder = function() {
        if (cart.length === 0) {
            window.showToast('El carrito está vacío');
            window.closeCheckoutModal();
            return;
        }

        const customerName = document.getElementById('customerName')?.value.trim();
        const customerAddress = document.getElementById('customerAddress')?.value.trim();
        const deliveryZone = document.querySelector('input[name="deliveryZone"]:checked')?.value;
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
        const customerNotes = document.getElementById('customerNotes')?.value.trim();

        if (!customerName || !customerAddress || !deliveryZone || !paymentMethod) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }

        const subtotal = cart.reduce((sum, item) => sum + (item.precio * (item.cantidad || 0)), 0);
        if (subtotal < MINIMUM_PURCHASE) {
            alert(`El subtotal debe ser de al menos $${MINIMUM_PURCHASE}.`);
            return;
        }

        const shippingCost = deliveryZone === 'habana-vieja' ? SHIPPING_WITHIN_HABANA_VIEJA : 0;
        const shippingDescription = deliveryZone === 'habana-vieja' 
            ? `Envío dentro de La Habana Vieja: $${SHIPPING_WITHIN_HABANA_VIEJA}`
            : 'Envío fuera de La Habana Vieja: costo a consultar';
        const total = subtotal + shippingCost;

        let message = `*✅ PEDIDO CONFIRMADO - EL RESOLVITO*\n\n`;
        message += `👤 *DATOS DEL CLIENTE:*\n`;
        message += `• Nombre: ${customerName}\n`;
        message += `• Dirección: ${customerAddress}\n`;
        message += `• Zona: ${deliveryZone === 'habana-vieja' ? 'La Habana Vieja' : 'Fuera'}\n`;
        message += `• Pago: ${paymentMethod}\n`;
        if (customerNotes) message += `• Notas: ${customerNotes}\n`;
        
        message += `\n🛒 *DETALLE DEL PEDIDO:*\n`;
        cart.forEach(item => {
            message += `• ${item.nombre} x${item.cantidad} = $${(item.precio * item.cantidad).toLocaleString()}\n`;
        });
        
        message += `\n💰 *RESUMEN:*\n`;
        message += `- Subtotal: $${subtotal.toLocaleString()}\n`;
        message += `- ${shippingDescription}\n`;
        message += `- *TOTAL: $${total.toLocaleString()}*`;
        
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
        
        window.closeCheckoutModal();
        window.toggleCart();
        window.showToast('✓ Pedido enviado por WhatsApp');
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
    
    function initDayNight() {
        const hour = new Date().getHours();
        const isNight = hour < 6 || hour >= 18;
        const savedMode = localStorage.getItem('nightMode') === 'true';
        
        if (savedMode || (savedMode === null && isNight)) {
            document.body.classList.add('night-mode');
            const themeIcon = document.getElementById('headerThemeIcon');
            if (themeIcon) themeIcon.textContent = '🌙';
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        console.log('elresolvito.js iniciado');
        initDayNight();
        
        setTimeout(() => {
            window.updateCartUI();
        }, 200);
        
        const pageFade = document.getElementById('pageFade');
        if (pageFade) pageFade.classList.add('opacity-0');
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            window.closeImageModal();
            const checkoutModal = document.getElementById('checkoutModal');
            if (checkoutModal && !checkoutModal.classList.contains('hidden')) {
                window.closeCheckoutModal();
            }
        }
    });

})();
