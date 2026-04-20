// ============================================
// PRODUCTOS - CARGADOS DESDE CSV EN GITHUB
// ============================================

// 🔴 URL RAW DE TU CSV EN GITHUB (YA ESTÁ CORRECTA)
const CSV_URL = 'https://raw.githubusercontent.com/elresolvito/elresolvito.github.io/main/data/productos.csv';

// 🔴 URL DE TU GOOGLE APPS SCRIPT PARA REGISTRAR PEDIDOS
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyETRqV0jXEhnaMXHCJDtey01f1qCEvz72VbBK38jBXJC1h1zsiqQRAAwTaVUy7PrxR/exec';

// Productos de respaldo (por si falla la conexión)
const PRODUCTOS_RESERVA = [
    { id: 1, nombre: "Atún en lata", precio: 540, imagen: "https://i.postimg.cc/76xHK6zt/atun_precio_500.png", categoria: "Alimentos y conservas", descripcion: "Lata 200g", destacado: "SI" },
    { id: 2, nombre: "Café Dualis 250g", precio: 1450, imagen: "https://i.postimg.cc/WbZBX2hN/cafe_dualis_250_g_precio_1450.png", categoria: "Alimentos y conservas", descripcion: "Paquete 250g", destacado: "SI" },
    { id: 3, nombre: "Cartón de huevo 30u", precio: 3000, imagen: "https://i.postimg.cc/sDWkwVvv/carton_de_huevo_30_u_precio_3000.png", categoria: "Alimentos y conservas", descripcion: "Cartón", destacado: "SI" }
];

let PRODUCTS = [];
let FEATURED_PRODUCTS = [];

// Función para cargar productos desde CSV en GitHub
async function cargarProductosDesdeCSV() {
    try {
        console.log('🔄 Cargando productos desde GitHub CSV...');
        const response = await fetch(CSV_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const csvText = await response.text();
        console.log('📄 CSV recibido, longitud:', csvText.length);
        
        const lines = csvText.split(/\r?\n/);
        if (lines.length < 2) {
            throw new Error('CSV vacío o con una sola línea');
        }
        
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        console.log('📋 Encabezados encontrados:', headers);
        
        const productos = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Parsear CSV respetando comillas
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
                    } else if (header === 'precio_mayor') {
                        value = parseFloat(value) || 0;
                    } else if (header === 'cantidad_minima') {
                        value = parseInt(value) || 0;
                    }
                    producto[header] = value;
                }
            });
            
            if (producto.nombre && producto.nombre !== 'nombre' && producto.nombre !== '') {
                productos.push(producto);
            }
        }
        
        if (productos.length > 0) {
            console.log(`✅ Cargados ${productos.length} productos desde GitHub CSV`);
            PRODUCTS = productos;
            
            FEATURED_PRODUCTS = PRODUCTS.filter(p => {
                const destacado = p.destacado ? p.destacado.toString().toUpperCase() : '';
                return destacado === 'SI' || destacado === 'SÍ';
            });
            
            console.log(`⭐ ${FEATURED_PRODUCTS.length} productos destacados`);
            
            window.PRODUCTS = PRODUCTS;
            window.FEATURED_PRODUCTS = FEATURED_PRODUCTS;
            
            return true;
        } else {
            throw new Error('No se encontraron productos en el CSV');
        }
    } catch (error) {
        console.error('❌ Error cargando desde GitHub CSV:', error);
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
    const SHIPPING_COST_HABANA_VIEJA = 300; // ✅ ACTUALIZADO: 300 CUP (antes 400)

    // ============================================
    // FUNCIONES DEL CARRITO (CON PRECIOS MAYORISTAS)
    // ============================================
    window.addToCart = function(product) {
        if (!product || !product.id || !product.nombre || !product.precio) {
            showToast('Error al añadir producto', 'error');
            return false;
        }

        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            // Producto ya existe: actualizar cantidad
            let nuevaCantidad = cart[existingItemIndex].cantidad + (product.cantidad || 1);
            cart[existingItemIndex].cantidad = nuevaCantidad;
            
            // Verificar si aplica precio mayorista
            if (product.precio_mayor && product.cantidad_minima && nuevaCantidad >= product.cantidad_minima) {
                cart[existingItemIndex].precio = product.precio_mayor;
                showToast(`✓ ${product.nombre} x${nuevaCantidad} (precio mayor: $${product.precio_mayor} c/u)`);
            } else {
                // Si no alcanza la cantidad mínima, mantener precio normal
                if (cart[existingItemIndex].precio !== product.precio) {
                    cart[existingItemIndex].precio = product.precio;
                }
                showToast(`✓ +1 ${product.nombre}`);
            }
        } else {
            // Producto nuevo: agregar al carrito
            let precioInicial = product.precio;
            let cantidadInicial = product.cantidad || 1;
            
            // Verificar si desde la primera compra ya alcanza la cantidad mínima
            if (product.precio_mayor && product.cantidad_minima && cantidadInicial >= product.cantidad_minima) {
                precioInicial = product.precio_mayor;
            }
            
            cart.push({
                id: product.id,
                nombre: product.nombre,
                imagen: product.imagen || 'https://placehold.co/300x300/2E7D32/white',
                precio: precioInicial,
                cantidad: cantidadInicial,
                precio_normal: product.precio,           // Guardamos precio normal para futuras comparaciones
                precio_mayor: product.precio_mayor,
                cantidad_minima: product.cantidad_minima
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
            const item = cart[index];
            const cantidadAnterior = item.cantidad;
            item.cantidad = newQuantity;
            
            // Recalcular precio según nueva cantidad y umbral mayorista
            if (item.precio_mayor && item.cantidad_minima && newQuantity >= item.cantidad_minima) {
                item.precio = item.precio_mayor;
            } else {
                item.precio = item.precio_normal;
            }
            
            saveCart();
            window.updateCartUI();
            showToast(`Cantidad actualizada: ${item.nombre} x${newQuantity}`);
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
                    // Mostrar precio unitario y si es mayorista
                    const esMayor = (item.precio === item.precio_mayor && item.precio_mayor);
                    const badgeMayor = esMayor ? '<span class="text-xs bg-cuban-yellow text-cuban-dark px-1 rounded ml-1">Mayor</span>' : '';
                    return `
                        <div class="flex gap-3 bg-gray-50 p-3 rounded-lg">
                            <img src="${imgSrc}" alt="${item.nombre}" class="w-16 h-16 object-contain bg-white rounded-lg" onerror="this.src='https://placehold.co/80'">
                            <div class="flex-1">
                                <h4 class="font-medium text-sm">${item.nombre} ${badgeMayor}</h4>
                                <p class="text-cuban-green font-bold">$${(item.precio || 0).toLocaleString()} <span class="text-xs text-gray-500">c/u</span></p>
                                <div class="flex items-center gap-2 mt-1">
                                    <button onclick="window.updateCartQuantity(${index}, ${(item.cantidad || 1) - 1})" class="w-6 h-6 bg-white rounded shadow hover:bg-gray-100">-</button>
                                    <span class="text-sm font-medium w-8 text-center">${item.cantidad || 1}</span>
                                    <button onclick="window.updateCartQuantity(${index}, ${(item.cantidad || 1) + 1})" class="w-6 h-6 bg-white rounded shadow hover:bg-gray-100">+</button>
                                    <button onclick="window.removeFromCart(${index})" class="ml-auto text-red-500 hover:text-red-700">🗑️</button>
                                </div>
                                ${item.cantidad_minima && item.precio_mayor && item.cantidad < item.cantidad_minima ? `<p class="text-xs text-gray-400 mt-1">Faltan ${item.cantidad_minima - item.cantidad} para precio mayor ($${item.precio_mayor} c/u)</p>` : ''}
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

    // ============================================
    // ENVÍO DE PEDIDO A WHATSAPP Y GOOGLE SHEETS
    // ============================================
    window.sendCompleteOrder = function() {
        if (cart.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        const customerName = document.getElementById('customerName')?.value.trim();
        const customerAddress = document.getElementById('customerAddress')?.value.trim();
        const deliveryZone = document.querySelector('input[name="deliveryZone"]:checked')?.value;
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
        const customerPhone = document.getElementById('customerPhone')?.value.trim() || 'No especificado';
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

        // Calcular costo de envío
        let shippingCost = 0;
        let envioTexto = '';
        if (deliveryZone === 'habana-vieja') {
            shippingCost = SHIPPING_COST_HABANA_VIEJA;
            envioTexto = `$${shippingCost} (La Habana Vieja)`;
            if (weight === 'mas-10kg') {
                envioTexto += ' - Peso superior a 10kg, el costo podría ajustarse.';
            }
        } else {
            envioTexto = 'A convenir (fuera de La Habana Vieja)';
        }
        
        const totalAPagar = subtotal + shippingCost;
        
        // Mensaje para WhatsApp
        let mensaje = "🛒 *NUEVO PEDIDO - EL RESOLVITO*\n\n";
        mensaje += "*PRODUCTOS:*\n";
        cart.forEach(item => {
            mensaje += `• ${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString()}\n`;
        });
        mensaje += `\n*Subtotal:* $${subtotal.toLocaleString()}`;
        mensaje += `\n*Envío:* ${envioTexto}`;
        mensaje += `\n*Total:* $${totalAPagar.toLocaleString()}`;
        mensaje += `\n\n*DATOS DEL CLIENTE*`;
        mensaje += `\n👤 *Nombre:* ${customerName}`;
        mensaje += `\n📞 *Teléfono:* ${customerPhone}`;
        mensaje += `\n📍 *Dirección:* ${customerAddress}`;
        mensaje += `\n💳 *Pago:* ${paymentMethod}`;
        if (notes) mensaje += `\n📝 *Notas:* ${notes}`;
        mensaje += `\n\n_Te contactaremos para confirmar._`;
        
        // Abrir WhatsApp
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`, '_blank');
        
        // Enviar a Google Sheets
        const orderData = {
            'fecha y hora recibido': new Date().toISOString(),
            'id pedido': new Date().getTime(),
            'nombre': customerName,
            'telefono': customerPhone,
            'direccion completa': customerAddress,
            'total': totalAPagar,
            'metodo de pago': paymentMethod,
            'costo de mensajeria': shippingCost,
            'productos': cart.map(item => `${item.nombre} x${item.cantidad}`).join(', ')
        };
        
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        }).catch(err => console.error('Error enviando a Google Sheets:', err));
        
        // Cerrar modal y vaciar carrito (opcional)
        window.closeCheckoutModal();
        if (document.getElementById('cartSidebar')?.classList.contains('cart-open')) {
            window.toggleCart();
        }
        
        // Vaciar carrito después de enviar
        cart = [];
        saveCart();
        window.updateCartUI();
        showToast('✅ Pedido enviado. Te contactaremos pronto.');
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
            if (type === 'error') toast.classList.add('bg-red-600');
            else if (type === 'warning') toast.classList.add('bg-orange-500');
            else if (type === 'success') toast.classList.add('bg-green-600');
            else toast.classList.add('bg-gray-800');
            setTimeout(() => {
                toast.classList.add('opacity-0', 'pointer-events-none');
                toast.classList.remove('opacity-100');
            }, 3000);
        }
    }

    window.toggleCart = function() {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        if (!sidebar || !overlay) return;
        sidebar.classList.toggle('cart-open');
        overlay.classList.toggle('hidden');
        document.body.style.overflow = sidebar.classList.contains('cart-open') ? 'hidden' : '';
        if (sidebar.classList.contains('cart-open')) window.updateCartUI();
    };

    window.toggleDayNight = function() {
        document.body.classList.toggle('night-mode');
        const themeIcon = document.getElementById('headerThemeIcon');
        if (themeIcon) themeIcon.textContent = document.body.classList.contains('night-mode') ? '🌙' : '☀️';
        localStorage.setItem('nightMode', document.body.classList.contains('night-mode'));
    };

    window.toggleMenu = function() {
        const menu = document.getElementById('mobileMenu');
        if (menu) menu.classList.toggle('hidden');
        document.body.style.overflow = menu?.classList.contains('hidden') ? '' : 'hidden';
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
        
        await cargarProductosDesdeCSV();
        window.updateCartUI();
        
        console.log('✅ El Resolvito JS inicializado correctamente');
        console.log(`📦 ${PRODUCTS.length} productos disponibles`);
        console.log(`⭐ ${FEATURED_PRODUCTS.length} productos destacados`);
    });

})();

// Exportar variables globales
window.PRODUCTS = PRODUCTS;
window.FEATURED_PRODUCTS = FEATURED_PRODUCTS;

window.debugCart = function() {
    console.log('=== DEBUG CARRITO ===');
    console.log('Productos totales:', PRODUCTS.length);
    console.log('Destacados:', FEATURED_PRODUCTS.length);
};
