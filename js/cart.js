// js/cart.js
// ============================================
// LÓGICA DEL CARRITO
// ============================================

// Variable global del carrito
let cart = JSON.parse(localStorage.getItem('elResolvitoCart')) || [];

// Constantes
const WHATSAPP_NUMBER = '5356382909';
const MINIMUM_PURCHASE = 500; // NUEVA: Compra mínima
const SHIPPING_WITHIN_HABANA_VIEJA = 400; // NUEVA: Tarifa fija para LHV

// NOTA: Ya no usamos SHIPPING_RANGES ni FREE_SHIPPING_MIN de la misma manera.

// Funciones de cálculo (ACTUALIZADAS)
function calculateShipping(subtotal, location = 'habana-vieja') {
    // Primero, verificar compra mínima (esto se hará en el checkout)
    if (subtotal < MINIMUM_PURCHASE) {
        return { fee: 0, isEligible: false, message: `Mínimo $${MINIMUM_PURCHASE}` };
    }

    if (location === 'habana-vieja') {
        return { fee: SHIPPING_WITHIN_HABANA_VIEJA, isEligible: true, message: '' };
    } else {
        // Fuera de La Habana Vieja: el precio se consulta
        return { fee: 0, isEligible: true, message: 'A consultar (peso/distancia)' };
    }
}

// Función auxiliar para obtener texto descriptivo del envío
function getShippingDescription(location = 'habana-vieja', subtotal) {
     if (subtotal < MINIMUM_PURCHASE) {
        return `Mínimo de compra: $${MINIMUM_PURCHASE}`;
    }
    if (location === 'habana-vieja') {
        return `Envío dentro de La Habana Vieja: $${SHIPPING_WITHIN_HABANA_VIEJA}`;
    } else {
        return 'Envío fuera de La Habana Vieja: a consultar (por peso/distancia)';
    }
}

// Funciones principales del carrito (addToCart, saveCart, etc. se mantienen igual)
function addToCart(product) {
    if (!product || !product.id || !product.nombre || !product.precio) {
        console.error('Producto inválido', product);
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
    updateCartUI();
    showCartToast('Producto añadido al carrito');
    return true;
}

function saveCart() {
    localStorage.setItem('elResolvitoCart', JSON.stringify(cart));
}

function updateCartQuantity(index, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(index);
        return;
    }
    cart[index].cantidad = newQuantity;
    saveCart();
    updateCartUI();
    showCartToast('Carrito actualizado');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
    showCartToast('Producto eliminado');
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
    showCartToast('Carrito vaciado');
}

function updateCartUI() {
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
                    <img src="${item.imagen || 'https://via.placeholder.com/80'}" class="w-16 h-16 object-contain bg-white rounded-lg" onerror="this.src='https://via.placeholder.com/80'">
                    <div class="flex-1">
                        <h4 class="font-medium text-sm">${item.nombre}</h4>
                        <p class="text-cuban-green font-bold">$${item.precio?.toLocaleString()}</p>
                        <div class="flex items-center gap-2 mt-1">
                            <button onclick="updateCartQuantity(${index}, ${(item.cantidad || 1) - 1})" class="w-6 h-6 bg-white rounded shadow text-xs hover:bg-cuban-green hover:text-white transition">-</button>
                            <span class="text-sm font-medium">${item.cantidad || 1}</span>
                            <button onclick="updateCartQuantity(${index}, ${(item.cantidad || 1) + 1})" class="w-6 h-6 bg-white rounded shadow text-xs hover:bg-cuban-green hover:text-white transition">+</button>
                            <button onclick="removeFromCart(${index})" class="ml-auto text-red-500 hover:text-red-700 transition">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    // --- NUEVA LÓGICA DE TOTALES (sin barra de progreso) ---
    const subtotalEl = document.getElementById('cartSubtotal');
    const shippingEl = document.getElementById('cartShipping');
    const totalEl = document.getElementById('cartTotal');
    const progressBar = document.getElementById('promoProgressContainer'); // Ocultaremos esto
    const progressText = document.getElementById('progressText');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString()}`;
    
    // Mostrar mensaje de compra mínima si aplica
    if (subtotal < MINIMUM_PURCHASE) {
        if (shippingEl) {
            shippingEl.innerHTML = `<span class="text-orange-500 font-bold">Mínimo $${MINIMUM_PURCHASE}</span>`;
        }
        if (totalEl) totalEl.textContent = `$${subtotal.toLocaleString()}`; // Total = subtotal, no se puede enviar
    } else {
        // Por ahora, mostramos un placeholder. La selección real se hará en el checkout modal.
        if (shippingEl) {
            shippingEl.innerHTML = `<span class="text-gray-600">Seleccionar en checkout</span>`;
        }
        if (totalEl) totalEl.textContent = `$${subtotal.toLocaleString()}`; // Total temporal
    }

    // Ocultar la barra de progreso y su texto (ya no aplica)
    if (progressBar) progressBar.style.display = 'none';
    if (progressText) progressText.style.display = 'none';
}

function showCartToast(message) {
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
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar && overlay) {
        sidebar.classList.toggle('cart-open');
        overlay.classList.toggle('hidden');
        document.body.style.overflow = sidebar.classList.contains('cart-open') ? 'hidden' : '';
    }
}
