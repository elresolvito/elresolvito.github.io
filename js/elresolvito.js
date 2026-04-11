// ============================================
// PRODUCTOS - CARGADOS DESDE GOOGLE SHEETS (CSV)
// ============================================

// 🔴 ENLACE CSV DE GOOGLE SHEETS (YA FUNCIONA)
const CSV_URL = 'https://docs.google.com/spreadsheets/d/1RpNc46-ok47bjRUlp0rQCK3hMH8xAi-b97wlBldxktk/export?format=csv&gid=0';

// Productos de respaldo (por si falla la conexión)
const PRODUCTOS_RESERVA = [
    { id: 1, nombre: "Atún en lata", precio: 540, imagen: "https://i.postimg.cc/76xHK6zt/atun_precio_500.png", categoria: "Alimentos y conservas", descripcion: "Lata 200g", destacado: "SI" },
    { id: 2, nombre: "Café Dualis 250g", precio: 1450, imagen: "https://i.postimg.cc/WbZBX2hN/cafe_dualis_250_g_precio_1450.png", categoria: "Alimentos y conservas", descripcion: "Paquete 250g", destacado: "SI" },
    { id: 3, nombre: "Cartón de huevo 30u", precio: 3000, imagen: "https://i.postimg.cc/sDWkwVvv/carton_de_huevo_30_u_precio_3000.png", categoria: "Alimentos y conservas", descripcion: "Cartón", destacado: "SI" }
];

let PRODUCTS = [];
let FEATURED_PRODUCTS = [];

// Función para cargar productos desde Google Sheets CSV
async function cargarProductosDesdeCSV() {
    try {
        console.log('🔄 Cargando productos desde Google Sheets...');
        const response = await fetch(CSV_URL);
        const csvText = await response.text();
        
        console.log('📄 CSV recibido, longitud:', csvText.length);
        
        // Parsear CSV correctamente
        const lines = csvText.split(/\r?\n/);
        if (lines.length < 2) {
            throw new Error('CSV vacío o con una sola línea');
        }
        
        // Obtener encabezados (primera línea)
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        console.log('📋 Encabezados encontrados:', headers);
        
        const productos = [];
        
        // Procesar cada línea de datos
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Parsear la línea respetando comillas
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
            
            // Crear objeto producto
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
            
            // Validar que el producto tenga nombre
            if (producto.nombre && producto.nombre !== 'nombre' && producto.nombre !== '') {
                productos.push(producto);
            }
        }
        
        if (productos.length > 0) {
            console.log(`✅ Cargados ${productos.length} productos desde Google Sheets`);
            PRODUCTS = productos;
            
            // Actualizar productos destacados
            FEATURED_PRODUCTS = PRODUCTS.filter(p => {
                const destacado = p.destacado ? p.destacado.toString().toUpperCase() : '';
                return destacado === 'SI' || destacado === 'SÍ';
            });
            
            console.log(`⭐ ${FEATURED_PRODUCTS.length} productos destacados`);
            
            // Actualizar variables globales
            window.PRODUCTS = PRODUCTS;
            window.FEATURED_PRODUCTS = FEATURED_PRODUCTS;
            
            return true;
        } else {
            throw new Error('No se encontraron productos en el CSV');
        }
    } catch (error) {
        console.error('❌ Error cargando desde CSV:', error);
        console.log('📦 Usando productos de respaldo');
        PRODUCTS = PRODUCTOS_RESERVA;
        FEATURED_PRODUCTS = PRODUCTOS_RESERVA.filter(p => p.destacado === 'SI');
        window.PRODUCTS = PRODUCTS;
        window.FEATURED_PRODUCTS = FEATURED_PRODUCTS;
        return false;
    }
}

// ============================================
// CARRITO Y FUNCIONES PRINCIPALES
// ============================================
(function() {
    'use strict';
    
    let cart = JSON.parse(localStorage.getItem('elResolvitoCart')) || [];
    const WHATSAPP_NUMBER = '5356382909';
    const MINIMUM_PURCHASE = 500;
    const SHIPPING_COST_HABANA_VIEJA = 400;

    // ============================================
    // FUNCIONES DEL CARRITO
    // ============================================
    window.addToCart = function(product) {
        if (!product || !product.id || !product.nombre || !product.precio) {
            showToast('Error al añadir producto', 'error');
            return false;
        }

        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].cantidad += product.cantidad || 1;
            showToast(`✓ +1 ${product.nombre}`);
        } else {
            cart.push({
                id: product.id,
                nombre: product.nombre,
                imagen: product.imagen || 'https://placehold.co/300x300/2E7D32/white',
                precio: product.precio,
                cantidad: product.cantidad || 1
            });
            showToast(`✓ "${product.nombre}" añadido al carrito`);
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
        
        // Actualizar contadores
        document.querySelectorAll('#cartCount, #floatingCartCount').forEach(el => {
            if (el) {
                el.textContent = totalItems;
                el.classList.toggle('hidden', totalItems === 0);
            }
        });
        
        // Renderizar items del carrito
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
        
        // Actualizar totales
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
    };

    // ============================================
    // FUNCIONES DEL CHECKOUT
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
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
        const weight = document.getElementById('approximateWeight')?.value || '';
        const notes = document.getElementById('customerNotes')?.value.trim() || '';

        if (!customerName || !customerAddress || !deliveryZone || !paymentMethod) {
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
            mensaje += `• ${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString()}\n`;
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
        mensaje += `\n👤 *Nombre:* ${customerName}`;
        mensaje += `\n📍 *Dirección:* ${customerAddress}`;

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

        mensaje += `\n💳 *Pago propuesto:* ${paymentMethod}`;

        if (notes) {
            mensaje += `\n📝 *Notas:* ${notes}`;
        }

        mensaje += `\n\n_Te contactaremos para confirmar disponibilidad y coordinar la entrega._`;

        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`, '_blank');

        window.closeCheckoutModal();
        if (document.getElementById('cartSidebar')?.classList.contains('cart-open')) {
            window.toggleCart();
        }
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
    document.addEventListener('DOMContentLoaded', async function() {
        const pageFade = document.getElementById('pageFade');
        if (pageFade) pageFade.classList.add('opacity-0');
        
        if (localStorage.getItem('nightMode') === 'true') {
            document.body.classList.add('night-mode');
            const themeIcon = document.getElementById('headerThemeIcon');
            if (themeIcon) themeIcon.textContent = '🌙';
        }
        
        // Cargar productos desde Google Sheets
        await cargarProductosDesdeCSV();
        
        window.updateCartUI();
        
        console.log('✅ El Resolvito JS inicializado correctamente');
        console.log(`📦 ${PRODUCTS.length} productos disponibles`);
        console.log(`⭐ ${FEATURED_PRODUCTS.length} productos destacados`);
    });

})();

// Exportar variables globales para que otros scripts las usen
window.PRODUCTS = PRODUCTS;
window.FEATURED_PRODUCTS = FEATURED_PRODUCTS;

window.debugCart = function() {
    console.log('=== DEBUG CARRITO ===');
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    console.log('sidebar existe:', !!sidebar);
    console.log('overlay existe:', !!overlay);
    
    if (sidebar) {
        console.log('sidebar clases:', sidebar.className);
        console.log('sidebar tiene cart-open:', sidebar.classList.contains('cart-open'));
    }
    
    if (overlay) {
        console.log('overlay hidden:', overlay.classList.contains('hidden'));
    }
    
    console.log('📦 Productos totales:', PRODUCTS.length);
    console.log('⭐ Productos destacados:', FEATURED_PRODUCTS.length);
};
