// ============================================
// PRODUCTOS (BASE DE DATOS)
// ============================================
var PRODUCTS = [
    { id: 1, nombre: "Atún en lata", categoria: "Alimentos y conservas", precio: 540, imagen: "https://i.postimg.cc/76xHK6zt/atun_precio_500.png", descripcion: "Lata 200g" },
    { id: 2, nombre: "Pasta de tomate", categoria: "Alimentos y conservas", precio: 350, imagen: "https://i.postimg.cc/gjjYPTNv/pasta_tomate_precio_350.png", descripcion: "Paquete" },
    { id: 3, nombre: "Pimiento fresco", categoria: "Alimentos y conservas", precio: 750, imagen: "https://i.postimg.cc/4yyJTSBj/pimiento_presio_750.png", descripcion: "Unidad" },
    { id: 4, nombre: "Café Dualis 250g", categoria: "Alimentos y conservas", precio: 1450, imagen: "https://i.postimg.cc/WbZBX2hN/cafe_dualis_250_g_precio_1450.png", descripcion: "Paquete 250g" },
    { id: 5, nombre: "Café Dufiltro 250g", categoria: "Alimentos y conservas", precio: 1450, imagen: "https://i.postimg.cc/hG26fv31/cafe_Dufiltro_250_g_precio_1450.png", descripcion: "Paquete 250g" },
    { id: 6, nombre: "Café Enepa", categoria: "Alimentos y conservas", precio: 470, imagen: "https://i.postimg.cc/nhY6f04N/cafe_enepa_precio_450.png", descripcion: "Paquete" },
    { id: 7, nombre: "Cartón de huevo 30u", categoria: "Alimentos y conservas", precio: 3000, imagen: "https://i.postimg.cc/sDWkwVvv/carton_de_huevo_30_u_precio_3000.png", descripcion: "Cartón" },
    { id: 8, nombre: "Leche condensada", categoria: "Alimentos y conservas", precio: 950, imagen: "https://i.postimg.cc/tT2XwjtT/leche_condensada.png", descripcion: "Lata 397g" },
    { id: 9, nombre: "Harina blanca 1Kg", categoria: "Alimentos y conservas", precio: 600, imagen: "https://i.postimg.cc/3xc2NHFB/harina_blanca1_kg.png", descripcion: "Paquete 1Kg" },
    { id: 10, nombre: "Chicoticos Pelly 90g", categoria: "Snacks y golosinas", precio: 400, imagen: "https://i.postimg.cc/1zv2fXjZ/chicoticos_pelly_90_g_precio_400.png", descripcion: "Paquete 90g" },
    { id: 11, nombre: "Papitas Campesinas", categoria: "Snacks y golosinas", precio: 690, imagen: "https://i.postimg.cc/cLgrDtf9/papitas_campesinas_precio_690.png", descripcion: "Paquete" },
    { id: 12, nombre: "Pelly Jamón", categoria: "Snacks y golosinas", precio: 580, imagen: "https://i.postimg.cc/pdQV7frX/pelly_jamon_precio_580.png", descripcion: "Paquete" },
    { id: 13, nombre: "Mayonesa Mediana", categoria: "Salsas", precio: 850, imagen: "https://i.postimg.cc/KzJZw2rR/mayonesa_precio_850.png", descripcion: "Frasco mediano" },
    { id: 14, nombre: "Mayonesa Grande", categoria: "Salsas", precio: 1100, imagen: "https://i.postimg.cc/Px2t9jzz/mayonesa_precio1100.png", descripcion: "Frasco grande" },
    { id: 15, nombre: "Cuchilla de Afeitar", categoria: "Higiene personal", precio: 100, imagen: "https://i.postimg.cc/8CdkdW7x/cuchilla_de_afeitar_precio_100.png", descripcion: "Unidad" },
    { id: 16, nombre: "Jabón Marwa", categoria: "Higiene personal", precio: 150, imagen: "https://i.postimg.cc/3RK8tRpR/jabon_marwa_precio_150.png", descripcion: "Pastilla" },
    { id: 17, nombre: "Papel Sanitario", categoria: "Higiene personal", precio: 490, imagen: "https://i.postimg.cc/bwW289qD/papel_sanitario_precio_490i.png", descripcion: "Paquete" },
    { id: 18, nombre: "Toallas Sanitarias", categoria: "Higiene personal", precio: 450, imagen: "https://i.postimg.cc/KjjZyH0b/toallas_sanitarias_precio_450.png", descripcion: "Paquete" },
    { id: 19, nombre: "Toallas Húmedas", categoria: "Higiene personal", precio: 690, imagen: "https://i.postimg.cc/W4ZSP3cw/toallas_humedas_precio_690.png", descripcion: "Paquete" },
    { id: 20, nombre: "Jabón de Lavar", categoria: "Aseo del hogar", precio: 250, imagen: "https://i.postimg.cc/V6YfK6Mz/jabon_de_lavar_precio_250.png", descripcion: "Pastilla" },
    { id: 21, nombre: "Perfume Candy", categoria: "Perfumes y desodorantes", precio: 3100, imagen: "https://i.postimg.cc/vTgJRyhp/perfume_candy_precio_3100.png", descripcion: "Frasco 50ml" },
    { id: 22, nombre: "Perfume genérico", categoria: "Perfumes y desodorantes", precio: 3100, imagen: "https://i.postimg.cc/ZKrT0PPG/perfume_precio_3100.png", descripcion: "Frasco 50ml" },
    { id: 23, nombre: "Perfume Q", categoria: "Perfumes y desodorantes", precio: 3100, imagen: "https://i.postimg.cc/CL03P3Dn/perfume_q_precio_3100.png", descripcion: "Frasco 50ml" },
    { id: 24, nombre: "Desodorante Obao", categoria: "Perfumes y desodorantes", precio: 1100, imagen: "https://i.postimg.cc/PxtXSxD2/desodorante_obao_precio_1100.png", descripcion: "Spray/Roll-on" },
    { id: 25, nombre: "Desodorante Rush Blanco", categoria: "Perfumes y desodorantes", precio: 1000, imagen: "https://i.postimg.cc/FR9rTRS8/desodorante_rush_blanco_precio_1000.png", descripcion: "Roll-on" },
    { id: 26, nombre: "Desodorante Rush", categoria: "Perfumes y desodorantes", precio: 1000, imagen: "https://i.postimg.cc/sXVjTXSF/desodorante_rush_precio_1000.png", descripcion: "Spray" },
    { id: 27, nombre: "Colonia Niña", categoria: "Perfumes y desodorantes", precio: 1100, imagen: "https://i.postimg.cc/G3v04rsM/colonia_nina.png", descripcion: "Botella 100ml" },
    { id: 28, nombre: "Macarrones", categoria: "Pastas y fideos", precio: 300, imagen: "https://i.postimg.cc/Hsmz1H69/macarrones_precio_300.png", descripcion: "Paquete" },
    { id: 29, nombre: "Sopas instantáneas", categoria: "Pastas y fideos", precio: 160, imagen: "https://i.postimg.cc/FzNTpQqK/sopas_instantaneas_precio_160.png", descripcion: "Paquete" },
    { id: 30, nombre: "Licor de fresa", categoria: "Bebidas alcohólicas y malta", precio: 2500, imagen: "https://i.postimg.cc/59YT2x5p/licor_de_fresa_precio_2500.png", descripcion: "Botella" },
    { id: 31, nombre: "Licor Cocobay", categoria: "Bebidas alcohólicas y malta", precio: 2500, imagen: "https://i.postimg.cc/7ZDW90Fz/locor_cocobay_precio_2500.png", descripcion: "Botella" },
    { id: 32, nombre: "Whisky Spirit 200ml", categoria: "Bebidas alcohólicas y malta", precio: 320, imagen: "https://i.postimg.cc/4N8W6q1t/tea_precio_320.png", descripcion: "Botella 200ml" },
    { id: 33, nombre: "Whisky 1L", categoria: "Bebidas alcohólicas y malta", precio: 1350, imagen: "https://i.postimg.cc/cLyrb4T0/whisky_1L_precio_1350.png", descripcion: "Botella 1L" },
    { id: 34, nombre: "Whisky Sir Albin", categoria: "Bebidas alcohólicas y malta", precio: 550, imagen: "https://i.postimg.cc/y84kbYnC/whisky_sir_albin_precio_550.png", descripcion: "Botella pequeña" },
    { id: 35, nombre: "Vino Pluvium", categoria: "Bebidas alcohólicas y malta", precio: 1200, imagen: "https://i.postimg.cc/XNLLWmmx/vino_pluvium_precio_1200.png", descripcion: "Botella" },
    { id: 36, nombre: "Baterías Triple A", categoria: "Electrónicos y accesorios", precio: 300, imagen: "https://i.postimg.cc/DZ2vxZsT/Gemini_Generated_Image_824rio824rio824r.png", descripcion: "Pack 4 unidades" }
];

var FEATURED_PRODUCTS = [
    PRODUCTS.find(p => p.id === 4),
    PRODUCTS.find(p => p.id === 7),
    PRODUCTS.find(p => p.id === 1),
    PRODUCTS.find(p => p.id === 13),
    PRODUCTS.find(p => p.id === 21),
    PRODUCTS.find(p => p.id === 30),
    PRODUCTS.find(p => p.id === 17),
    PRODUCTS.find(p => p.id === 9)
];

var WHOLESALE_PRODUCTS = [
    { nombre: "Café Dualis Caja 10u", precio: 13000, precioNormal: 14500, imagen: "https://i.postimg.cc/WbZBX2hN/cafe_dualis_250_g_precio_1450.png", desc: "Ahorra $1,500" },
    { nombre: "Huevos 3 cartones", precio: 8400, precioNormal: 9000, imagen: "https://i.postimg.cc/sDWkwVvv/carton_de_huevo_30_u_precio_3000.png", desc: "Ahorra $600" },
    { nombre: "Atún Pack 12u", precio: 6000, precioNormal: 6480, imagen: "https://i.postimg.cc/76xHK6zt/atun_precio_500.png", desc: "Ahorra $480" },
    { nombre: "Jabón Caja 24u", precio: 5400, precioNormal: 6000, imagen: "https://i.postimg.cc/V6YfK6Mz/jabon_de_lavar_precio_250.png", desc: "Ahorra $600" }
];

// ============================================
// CARRITO Y FUNCIONES PRINCIPALES
// ============================================
(function() {
    'use strict';
    
    let cart = JSON.parse(localStorage.getItem('elResolvitoCart')) || [];
    const WHATSAPP_NUMBER = '5356382909';
    const MINIMUM_PURCHASE = 500;
    const SHIPPING_COST_HABANA_VIEJA = 400;

    window.addToCart = function(product) {
        if (!product || !product.id || !product.nombre || !product.precio) {
            showToast('Error al añadir producto', 'error');
            return false;
        }

        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].cantidad += product.cantidad || 1;
            showToast(`✓ +1 ${product.nombre}`, 'success');
        } else {
            cart.push({
                id: product.id,
                nombre: product.nombre,
                imagen: product.imagen || 'https://placehold.co/300x300/2E7D32/white',
                precio: product.precio,
                cantidad: product.cantidad || 1
            });
            showToast(`✓ ${product.nombre} añadido al carrito`, 'success');
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
            removeFromCart(index);
            return;
        }
        if (cart[index]) {
            cart[index].cantidad = newQuantity;
            saveCart();
            window.updateCartUI();
        }
    };

    function removeFromCart(index) {
        if (cart[index]) {
            const nombre = cart[index].nombre;
            cart.splice(index, 1);
            saveCart();
            window.updateCartUI();
            showToast(`✓ ${nombre} eliminado`, 'success');
        }
    }

    window.removeFromCart = function(index) {
        removeFromCart(index);
    };

    window.updateCartUI = function() {
        const totalItems = cart.reduce((sum, item) => sum + (item.cantidad || 0), 0);
        const subtotal = cart.reduce((sum, item) => sum + (item.precio * (item.cantidad || 0)), 0);
        
        document.querySelectorAll('#cartCount, #floatingCartCount').forEach(el => {
            if (el) {
                el.textContent = totalItems;
                el.classList.toggle('hidden', totalItems === 0);
            }
        });
        
        const cartItemsContainer = document.getElementById('cartItems');
        if (cartItemsContainer) {
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<div class="text-center py-8 text-gray-500"><i class="fas fa-shopping-cart text-4xl mb-3 opacity-30"></i><p>Tu carrito está vacío</p><p class="text-xs mt-2">Agrega productos desde la tienda</p></div>';
            } else {
                cartItemsContainer.innerHTML = cart.map((item, index) => {
                    const imgSrc = item.imagen || 'https://placehold.co/80';
                    return `
                        <div class="flex gap-3 bg-gray-50 p-3 rounded-lg">
                            <img src="${imgSrc}" alt="${item.nombre}" class="w-16 h-16 object-contain bg-white rounded-lg" onerror="this.src='https://placehold.co/80'">
                            <div class="flex-1">
                                <h4 class="font-medium text-sm">${item.nombre}</h4>
                                <p class="text-cuban-green font-bold">$${(item.precio || 0).toLocaleString()}</p>
                                <div class="flex items-center gap-2 mt-1">
                                    <button onclick="window.updateCartQuantity(${index}, ${(item.cantidad || 1) - 1})" class="w-6 h-6 bg-white rounded shadow hover:bg-gray-100">-</button>
                                    <span class="text-sm font-medium">${item.cantidad || 1}</span>
                                    <button onclick="window.updateCartQuantity(${index}, ${(item.cantidad || 1) + 1})" class="w-6 h-6 bg-white rounded shadow hover:bg-gray-100">+</button>
                                    <button onclick="window.removeFromCart(${index})" class="ml-auto text-red-500 hover:text-red-700">🗑️</button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
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

        updateCheckoutSummary();
        
        if (typeof window.updateMinPurchaseWarning === 'function') {
            window.updateMinPurchaseWarning();
        }
    };

    window.openCheckoutModal = function() {
        if (cart.length === 0) {
            showToast('El carrito está vacío', 'warning');
            return;
        }
        
        const subtotal = cart.reduce((sum, item) => sum + (item.precio * (item.cantidad || 0)), 0);
        
        if (subtotal < MINIMUM_PURCHASE) {
            showToast(`Mínimo de compra: $${MINIMUM_PURCHASE}`, 'warning');
            return;
        }

        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        if (sidebar && sidebar.classList.contains('cart-open')) {
            sidebar.classList.remove('cart-open');
            overlay?.classList.add('hidden');
            document.body.style.overflow = '';
        }

        updateCheckoutSummary();
        
        const modal = document.getElementById('checkoutModal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeCheckoutModal = function() {
        const modal = document.getElementById('checkoutModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    };

    function updateCheckoutSummary() {
        const subtotal = cart.reduce((sum, item) => sum + (item.precio * (item.cantidad || 0)), 0);
        const summaryEl = document.getElementById('checkoutCartSummary');
        const totalEl = document.getElementById('checkoutTotal');
        
        if (summaryEl) {
            if (cart.length === 0) {
                summaryEl.innerHTML = '<p class="text-gray-500">Carrito vacío</p>';
            } else {
                summaryEl.innerHTML = cart.map(item => 
                    `<div class="flex justify-between text-xs"><span>${item.nombre} x${item.cantidad}</span><span>$${(item.precio * item.cantidad).toLocaleString()}</span></div>`
                ).join('');
            }
        }
        if (totalEl) {
            totalEl.textContent = `$${subtotal.toLocaleString()}`;
        }
    }

    window.sendCompleteOrder = function() {
        if (cart.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        const customerName = document.getElementById('customerName')?.value.trim();
        const customerAddress = document.getElementById('customerAddress')?.value.trim();
        const deliveryZone = document.querySelector('input[name="deliveryZone"]:checked')?.value;
        const customerPhone = document.getElementById('customerPhone')?.value.trim() || '';
        const notes = document.getElementById('customerNotes')?.value.trim() || '';

        if (!customerName || !customerAddress) {
            alert('Por favor, completa tu nombre y dirección');
            return;
        }

        const subtotal = cart.reduce((sum, item) => sum + (item.precio * (item.cantidad || 0)), 0);
        
        if (subtotal < MINIMUM_PURCHASE) {
            alert(`El pedido mínimo es de $${MINIMUM_PURCHASE}`);
            return;
        }

        let mensaje = "🛒 *NUEVO PEDIDO - EL RESOLVITO*\n\n";
        mensaje += "*Productos:*\n";
        cart.forEach(item => {
            mensaje += `• ${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString()}\n`;
        });

        mensaje += `\n*Subtotal:* $${subtotal.toLocaleString()}`;
        
        if (deliveryZone === 'habana-vieja') {
            mensaje += `\n*Envío:* $${SHIPPING_COST_HABANA_VIEJA} (La Habana Vieja)`;
            mensaje += `\n*Total:* $${(subtotal + SHIPPING_COST_HABANA_VIEJA).toLocaleString()}`;
        } else {
            mensaje += `\n*Envío:* A convenir (fuera de La Habana Vieja)`;
        }

        mensaje += `\n\n*DATOS DE ENTREGA:*`;
        mensaje += `\n👤 *Nombre:* ${customerName}`;
        mensaje += `\n📍 *Dirección:* ${customerAddress}`;
        
        if (customerPhone) {
            mensaje += `\n📱 *Teléfono:* ${customerPhone}`;
        }
        
        if (notes) {
            mensaje += `\n📝 *Notas:* ${notes}`;
        }

        mensaje += `\n\n💵 *Pago:* Contra entrega en efectivo`;
        mensaje += `\n_Te contactaremos para confirmar disponibilidad y coordinar la entrega._`;

        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`, '_blank');

        window.closeCheckoutModal();
        
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        if (sidebar && sidebar.classList.contains('cart-open')) {
            sidebar.classList.remove('cart-open');
            overlay?.classList.add('hidden');
            document.body.style.overflow = '';
        }

        cart = [];
        saveCart();
        window.updateCartUI();
        
        showToast('✓ Pedido enviado. Te contactaremos pronto.', 'success');
    };

    function showToast(message, type = 'success') {
        const toast = document.getElementById('cartToast');
        const toastMessage = document.getElementById('cartToastMessage');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.classList.remove('opacity-0', 'pointer-events-none');
            toast.classList.add('opacity-100');
            
            if (type === 'error') {
                toast.classList.add('bg-red-600');
                toast.classList.remove('bg-gray-800', 'bg-orange-500');
            } else if (type === 'warning') {
                toast.classList.add('bg-orange-500');
                toast.classList.remove('bg-gray-800', 'bg-red-600');
            } else {
                toast.classList.add('bg-gray-800');
                toast.classList.remove('bg-red-600', 'bg-orange-500');
            }
            
            setTimeout(() => {
                toast.classList.add('opacity-0', 'pointer-events-none');
                toast.classList.remove('opacity-100');
            }, 3000);
        }
    }

    window.toggleCart = function() {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        
        if (!sidebar || !overlay) {
            console.error('Elementos del carrito no encontrados');
            return;
        }
        
        sidebar.classList.toggle('cart-open');
        overlay.classList.toggle('hidden');
        document.body.style.overflow = sidebar.classList.contains('cart-open') ? 'hidden' : '';
        
        if (sidebar.classList.contains('cart-open')) {
            window.updateCartUI();
        }
    };

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
    // TUTORIAL FLOTANTE (solo una vez por sesión)
    // ============================================
    if (!localStorage.getItem('elresolvito_tutorial')) {
        setTimeout(() => {
            const tutorial = document.createElement('div');
            tutorial.id = 'tutorial-flotante';
            tutorial.innerHTML = `
                <div style="position: fixed; bottom: 100px; right: 20px; background: white; border-radius: 1rem; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2); width: 280px; z-index: 9999; border-left: 4px solid #2E7D32; animation: slideInRight 0.3s ease;">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; border-bottom: 1px solid #e5e7eb;">
                        <span style="font-weight: bold; color: #2E7D32;">🛒 ¿Cómo comprar?</span>
                        <button onclick="this.closest('#tutorial-flotante').remove()" style="background: none; border: none; font-size: 1.25rem; cursor: pointer; color: #9ca3af;">✕</button>
                    </div>
                    <div style="padding: 1rem;">
                        <p style="font-size: 0.875rem; margin-bottom: 0.5rem;">1️⃣ Agrega productos al <strong>carrito</strong></p>
                        <p style="font-size: 0.875rem; margin-bottom: 0.5rem;">2️⃣ Completa tus <strong>datos</strong> en el checkout</p>
                        <p style="font-size: 0.875rem; margin-bottom: 0.75rem;">3️⃣ Envía el pedido por <strong>WhatsApp</strong></p>
                        <p style="font-size: 0.7rem; color: #2E7D32; margin-top: 0.5rem;">💵 Pago contra entrega · Envíos en La Habana</p>
                        <a href="#como-comprar" style="display: block; margin-top: 0.75rem; font-size: 0.7rem; color: #2E7D32; text-align: center; text-decoration: underline;" onclick="document.getElementById('tutorial-flotante').remove()">Ver tutorial completo →</a>
                    </div>
                </div>
                <style>
                    @keyframes slideInRight {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                </style>
            `;
            document.body.appendChild(tutorial);
            
            setTimeout(() => {
                const el = document.getElementById('tutorial-flotante');
                if (el) el.remove();
            }, 12000);
            
            localStorage.setItem('elresolvito_tutorial', 'true');
        }, 1500);
    }

    // ============================================
    // OCULTAR LOADING SI EXISTE
    // ============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
                const overlay = document.getElementById('loadingOverlay');
                if (overlay && !overlay.classList.contains('hidden')) {
                    overlay.classList.add('hidden');
                    setTimeout(() => overlay.remove(), 500);
                }
                document.body.classList.add('loaded');
            }, 300);
        });
    } else {
        setTimeout(function() {
            const overlay = document.getElementById('loadingOverlay');
            if (overlay && !overlay.classList.contains('hidden')) {
                overlay.classList.add('hidden');
                setTimeout(() => overlay.remove(), 500);
            }
            document.body.classList.add('loaded');
        }, 300);
    }

    // ============================================
    // INICIALIZACIÓN
    // ============================================
    document.addEventListener('DOMContentLoaded', function() {
        const pageFade = document.getElementById('pageFade');
        if (pageFade) pageFade.classList.add('opacity-0');
        
        if (localStorage.getItem('nightMode') === 'true') {
            document.body.classList.add('night-mode');
            const themeIcon = document.getElementById('headerThemeIcon');
            if (themeIcon) themeIcon.textContent = '🌙';
        }
        
        window.updateCartUI();
        
        console.log('✅ El Resolvito JS inicializado correctamente');
    });

})();

window.debugCart = function() {
    console.log('=== DEBUG CARRITO ===');
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    console.log('sidebar existe:', !!sidebar);
    console.log('overlay existe:', !!overlay);
    
    if (sidebar) {
        console.log('sidebar clases:', sidebar.className);
        console.log('sidebar tiene cart-open:', sidebar.classList.contains('cart-open'));
        console.log('transform:', window.getComputedStyle(sidebar).transform);
    }
    
    if (overlay) {
        console.log('overlay clases:', overlay.className);
        console.log('overlay hidden:', overlay.classList.contains('hidden'));
    }
    
    const cart = JSON.parse(localStorage.getItem('elResolvitoCart')) || [];
    console.log('Carrito actual:', cart);
};
