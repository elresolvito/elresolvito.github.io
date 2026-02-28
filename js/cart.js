// js/cart.js
// ============================================
// LÓGICA DEL CARRITO
// ============================================

// Variable global del carrito
let cart = JSON.parse(localStorage.getItem('elResolvitoCart')) || [];

// Constantes
const WHATSAPP_NUMBER = '5356382909';
const FREE_SHIPPING_MIN = 5000;

const SHIPPING_RANGES = [
    { max: 2000, fee: 200, name: 'Estándar' },
    { max: 5000, fee: 150, name: 'Económico' },
    { max: Infinity, fee: 0, name: 'Gratis' }
];

// Funciones de cálculo
function calculateShipping(subtotal) {
    for (const range of SHIPPING_RANGES) {
        if (subtotal <= range.max) {
            return range.fee;
        }
    }
    return 200;
}

function getShippingRangeName(subtotal) {
    for (const range of SHIPPING_RANGES) {
        if (subtotal <= range.max) {
            return range.name;
        }
    }
    return 'Estándar';
}

// Funciones principales del carrito
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
    const shipping = calculateShipping(subtotal);
    const total = subtotal + shipping;
    
    // Actualizar todos los contadores
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

    // Actualizar totales
    const subtotalEl = document.getElementById('cartSubtotal');
    const shippingEl = document.getElementById('cartShipping');
    const totalEl = document.getElementById('cartTotal');
    const progressBar = document.getElementById('promoProgressBar');
    const progressText = document.getElementById('progressText');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString()}`;
    if (shippingEl) {
        if (shipping === 0) {
            shippingEl.innerHTML = '<span class="text-green-600 font-bold">¡GRATIS!</span>';
        } else {
            shippingEl.textContent = `$${shipping.toLocaleString()}`;
        }
    }
    if (totalEl) totalEl.textContent = `$${total.toLocaleString()}`;

    // Actualizar barra de progreso
    if (progressBar && progressText) {
        const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_MIN) * 100);
        progressBar.style.width = `${progressPercent}%`;
        
        if (subtotal >= FREE_SHIPPING_MIN) {
            progressText.innerHTML = '🎉 ¡Envío GRATIS aplicado!';
        } else {
            const remaining = FREE_SHIPPING_MIN - subtotal;
            const nextRange = subtotal < 2000 ? 'Estándar ($200)' : 'Económico ($150)';
            progressText.innerHTML = `🚚 Envío ${nextRange}. Faltan $${remaining.toLocaleString()} para envío GRATIS.`;
        }
    }
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
