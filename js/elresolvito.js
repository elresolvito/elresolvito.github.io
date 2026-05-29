// ============================================
// EL RESOLVITO - JS UNIFICADO v2.0
// ============================================

// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================
const CSV_URL = 'https://raw.githubusercontent.com/elresolvito/elresolvito.github.io/main/data/productos.csv';
const CACHE_KEY = 'elresolvito_productos_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 horas
const WHATSAPP_NUMBER = '5356382909';
const MINIMUM_PURCHASE = 500;
const SHIPPING_COST_HABANA_VIEJA = 400;

let PRODUCTS = [];
let FEATURED_PRODUCTS = [];
let cart = [];

// ============================================
// SANITIZACIÓN (seguridad)
// ============================================
function sanitizeText(str) {
    if (!str) return '';
    return str
        .replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        })
        .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
            return c;
        })
        .replace(/[^a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF\s\.\,\-\_\(\)]/g, '');
}

// ============================================
// CARGA DE PRODUCTOS DESDE CSV CON CACHE
// ============================================
async function cargarProductosDesdeCSV(forceRefresh = false) {
    try {
        // Intentar cargar desde caché
        if (!forceRefresh) {
            const cache = localStorage.getItem(CACHE_KEY);
            if (cache) {
                const { timestamp, data } = JSON.parse(cache);
                if (Date.now() - timestamp < CACHE_EXPIRY && data && data.length > 0) {
                    console.log('📦 Productos cargados desde caché:', data.length);
                    PRODUCTS = data;
                    actualizarProductosDestacados();
                    window.PRODUCTS = PRODUCTS;
                    window.FEATURED_PRODUCTS = FEATURED_PRODUCTS;
                    return true;
                }
            }
        }

        console.log('🔄 Cargando productos desde GitHub CSV...');
        const response = await fetch(CSV_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const csvText = await response.text();
        const lines = csvText.split(/\r?\n/);
        if (lines.length < 2) throw new Error('CSV vacío');

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const productos = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = [];
            let inQuotes = false;
            let currentValue = '';

            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    values.push(currentValue.trim());
                    currentValue = '';
                } else {
                    currentValue += char;
                }
            }
            values.push(currentValue.trim());

            const producto = {};
            headers.forEach((header, idx) => {
                if (idx < values.length) {
                    let value = values[idx].replace(/^"|"$/g, '');
                    if (header === 'precio') {
                        value = parseFloat(value) || 0;
                    } else if (header === 'id') {
                        value = parseInt(value) || i;
                    }
                    producto[header] = value;
                }
            });

            if (producto.nombre && producto.nombre !== 'nombre') {
                productos.push(producto);
            }
        }

        if (productos.length > 0) {
            PRODUCTS = productos;
            // Guardar en caché
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                timestamp: Date.now(),
                data: PRODUCTS
            }));
            console.log(`✅ Cargados ${PRODUCTS.length} productos desde CSV`);
            actualizarProductosDestacados();
            window.PRODUCTS = PRODUCTS;
            window.FEATURED_PRODUCTS = FEATURED_PRODUCTS;
            return true;
        }
        throw new Error('No se encontraron productos');
    } catch (error) {
        console.error('❌ Error cargando productos:', error);
        // Productos de respaldo
        PRODUCTS = [
            { id: 1, nombre: "Atún en lata", precio: 540, imagen: "https://i.postimg.cc/76xHK6zt/atun_precio_500.png", categoria: "Alimentos y conservas", descripcion: "Lata 200g", destacado: "SI" },
            { id: 2, nombre: "Café Dualis 250g", precio: 1450, imagen: "https://i.postimg.cc/WbZBX2hN/cafe_dualis_250_g_precio_1450.png", categoria: "Alimentos y conservas", descripcion: "Paquete 250g", destacado: "SI" },
            { id: 3, nombre: "Cartón de huevo 30u", precio: 3000, imagen: "https://i.postimg.cc/sDWkwVvv/carton_de_huevo_30_u_precio_3000.png", categoria: "Alimentos y conservas", descripcion: "Cartón", destacado: "SI" }
        ];
        actualizarProductosDestacados();
        window.PRODUCTS = PRODUCTS;
        window.FEATURED_PRODUCTS = FEATURED_PRODUCTS;
        return false;
    }
}

function actualizarProductosDestacados() {
    FEATURED_PRODUCTS = PRODUCTS.filter(p => {
        const destacado = p.destacado ? p.destacado.toString().toUpperCase() : '';
        return destacado === 'SI' || destacado === 'SÍ';
    });
    if (FEATURED_PRODUCTS.length === 0 && PRODUCTS.length > 0) {
        FEATURED_PRODUCTS = PRODUCTS.slice(0, 8);
    }
}

// ============================================
// CARRITO
// ============================================
function loadCart() {
    const savedCart = localStorage.getItem('elResolvitoCart');
    cart = savedCart ? JSON.parse(savedCart) : [];
}

function saveCart() {
    localStorage.setItem('elResolvitoCart', JSON.stringify(cart));
}

window.addToCart = function(product) {
    if (!product || !product.id || !product.nombre || !product.precio) {
        showToast('Error al añadir producto', 'error');
        return false;
    }

    const productName = sanitizeText(product.nombre);
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex !== -1) {
        cart[existingItemIndex].cantidad += product.cantidad || 1;
        showToast(`✓ +1 ${productName}`);
    } else {
        cart.push({
            id: product.id,
            nombre: productName,
            imagen: product.imagen || 'https://placehold.co/300x300/2E7D32/white',
            precio: product.precio,
            cantidad: product.cantidad || 1
        });
        showToast(`✓ "${productName}" añadido al carrito`);
    }

    saveCart();
    window.updateCartUI();
    return true;
};

window.updateCartQuantity = function(index, newQuantity) {
    if (newQuantity <= 0) {
        window.removeFromCart(index);
        return;
    }
    if (cart[index]) {
        cart[index].cantidad = newQuantity;
        saveCart();
        window.updateCartUI();
        showToast(`Cantidad actualizada: ${cart[index].nombre} x${newQuantity}`);
    }
};

window.removeFromCart = function(index) {
    if (cart[index]) {
        const nombre = cart[index].nombre;
        cart.splice(index, 1);
        saveCart();
        window.updateCartUI();
        showToast(`🗑️ "${nombre}" eliminado`);
    }
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
                        <img src="${imgSrc}" alt="${sanitizeText(item.nombre)}" class="w-16 h-16 object-contain bg-white rounded-lg" onerror="this.src='https://placehold.co/80'">
                        <div class="flex-1">
                            <h4 class="font-medium text-sm">${sanitizeText(item.nombre)}</h4>
                            <p class="text-cuban-green font-bold">$${(item.precio || 0).toLocaleString()}</p>
                            <div class="flex items-center gap-2 mt-1">
                                <button onclick="window.updateCartQuantity(${index}, ${(item.cantidad || 1) - 1})" class="w-6 h-6 bg-white rounded shadow hover:bg-gray-100">-</button>
                                <span class="text-sm font-medium w-8 text-center">${item.cantidad || 1}</span>
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
};

// ============================================
// CHECKOUT
// ============================================
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
                `<div class="flex justify-between text-xs"><span>${sanitizeText(item.nombre)} x${item.cantidad}</span><span>$${(item.precio * item.cantidad).toLocaleString()}</span></div>`
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
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
    const weight = document.getElementById('approximateWeight')?.value || '';
    const notes = document.getElementById('customerNotes')?.value.trim() || '';

    if (!customerName || customerName.length < 2) {
        alert('Por favor, ingresa un nombre válido.');
        return;
    }
    if (!customerAddress || customerAddress.length < 5) {
        alert('Por favor, ingresa una dirección completa.');
        return;
    }
    if (!deliveryZone || !paymentMethod) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.precio * (item.cantidad || 0)), 0);
    if (subtotal < MINIMUM_PURCHASE) {
        alert(`El pedido mínimo es de $${MINIMUM_PURCHASE}`);
        return;
    }

    let mensaje = "🛒 *NUEVO PEDIDO - EL RESOLVITO*\n\n";
    mensaje += "*PRODUCTOS:*\n";
    cart.forEach(item => {
        mensaje += `• ${sanitizeText(item.nombre)} x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString()}\n`;
    });

    mensaje += `\n*Subtotal:* $${subtotal.toLocaleString()}`;

    let envioTexto = '';
    if (deliveryZone === 'habana-vieja') {
        envioTexto = `$${SHIPPING_COST_HABANA_VIEJA} (La Habana Vieja)`;
        if (weight === 'mas-10kg') {
            envioTexto += ' - Peso superior a 10kg, el costo podría ajustarse.';
        }
    } else {
        envioTexto = 'A convenir (fuera de La Habana Vieja)';
    }
    mensaje += `\n*Envío:* ${envioTexto}`;

    if (deliveryZone === 'habana-vieja' && weight !== 'mas-10kg') {
        mensaje += `\n*Total estimado:* $${(subtotal + SHIPPING_COST_HABANA_VIEJA).toLocaleString()}`;
    } else {
        mensaje += `\n*Total:* A confirmar`;
    }

    mensaje += `\n\n*DATOS DEL CLIENTE*`;
    mensaje += `\n👤 *Nombre:* ${sanitizeText(customerName)}`;
    mensaje += `\n📍 *Dirección:* ${sanitizeText(customerAddress)}`;

    const pesoTexto = {
        'menos-1kg': 'Menos de 1 kg',
        '1-3kg': '1-3 kg',
        '3-5kg': '3-5 kg',
        '5-10kg': '5-10 kg',
        'mas-10kg': 'Más de 10 kg'
    };
    if (weight && pesoTexto[weight]) {
        mensaje += `\n⚖️ *Peso aproximado:* ${pesoTexto[weight]}`;
    }

    mensaje += `\n💳 *Pago propuesto:* ${paymentMethod === 'Efectivo' ? 'Efectivo' : 'Transferencia'}`;

    if (notes) {
        mensaje += `\n📝 *Notas:* ${sanitizeText(notes)}`;
    }

    mensaje += `\n\n_Te contactaremos para confirmar disponibilidad y coordinar la entrega._`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`, '_blank');

    window.closeCheckoutModal();
};

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================
function showToast(message, type = 'success') {
    const toast = document.getElementById('cartToast');
    const toastMessage = document.getElementById('cartToastMessage');

    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.remove('opacity-0', 'pointer-events-none');
        toast.classList.add('opacity-100');

        toast.classList.remove('bg-gray-800', 'bg-red-600', 'bg-orange-500', 'bg-green-600');
        if (type === 'error') {
            toast.classList.add('bg-red-600');
        } else if (type === 'warning') {
            toast.classList.add('bg-orange-500');
        } else if (type === 'success') {
            toast.classList.add('bg-green-600');
        } else {
            toast.classList.add('bg-gray-800');
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

// ============================================
// MODAL DE IMAGEN (CENTRALIZADO)
// ============================================
window.openImageModal = function(src, name) {
    const modal = document.getElementById('imageModal');
    const img = document.getElementById('modalImage');
    const nameEl = document.getElementById('modalImageName');
    if (modal && img && nameEl) {
        img.src = src || 'https://placehold.co/600x400/2E7D32/white?text=Imagen';
        nameEl.textContent = name ? sanitizeText(name) : 'Imagen';
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    } else {
        console.warn('Modal de imagen no encontrado, creando uno temporal...');
        const modalHtml = `
            <div id="tempImageModal" class="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4" onclick="this.remove()">
                <div class="relative max-w-3xl w-full" onclick="event.stopPropagation()">
                    <button onclick="document.getElementById('tempImageModal').remove()" class="absolute -top-12 right-0 text-white text-3xl hover:text-gray-300">
                        <i class="fas fa-times"></i>
                    </button>
                    <img src="${src}" alt="${name}" class="w-full max-h-[80vh] object-contain rounded-lg">
                    <p class="text-white text-center mt-4 text-xl font-bold">${name ? sanitizeText(name) : 'Imagen'}</p>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
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
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Inicializando El Resolvito...');

    const pageFade = document.getElementById('pageFade');
    if (pageFade) pageFade.classList.add('opacity-0');

    if (localStorage.getItem('nightMode') === 'true') {
        document.body.classList.add('night-mode');
        const themeIcon = document.getElementById('headerThemeIcon');
        if (themeIcon) themeIcon.textContent = '🌙';
    }

    loadCart();
    await cargarProductosDesdeCSV();
    window.updateCartUI();

    console.log(`✅ Inicialización completa: ${PRODUCTS.length} productos`);
});

// Exportar a window para uso global
window.PRODUCTS = PRODUCTS;
window.FEATURED_PRODUCTS = FEATURED_PRODUCTS;
window.cargarProductosDesdeCSV = cargarProductosDesdeCSV;
window.sanitizeText = sanitizeText;

// Debug
window.debugCart = function() {
    console.log('=== DEBUG CARRITO ===');
    console.log('Carrito:', cart);
    console.log('Productos totales:', PRODUCTS.length);
    console.log('Productos destacados:', FEATURED_PRODUCTS.length);
};
