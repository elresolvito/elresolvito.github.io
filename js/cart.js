// ============================================
// CONSTANTES Y CONFIGURACIÓN DEL CARRITO
// ============================================
const SHIPPING_RANGES = [
    { max: 2000, fee: 200, discount: "0%" },        // Hasta $2,000
    { max: 5000, fee: 150, discount: "25%" },       // $2,001 - $5,000
    { max: Infinity, fee: 100, discount: "50%" }    // Más de $5,000
];

const SERVICE_FEE_PERCENTAGE = 0.08; // 8% de comisión
const MINIMUM_PROFIT = 300; // Utilidad mínima garantizada por pedido
const MIN_ORDER_THRESHOLD = 500;
const TRAMO_1_MAX = 3000;
const WEIGHT_SURCHARGE_PER_10KG = 100;
const WEIGHT_THRESHOLD_KG = 10;
const SERVICE_FEE = 50;

// ============================================
// VARIABLES GLOBALES DEL CARRITO
// ============================================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ============================================
// FUNCIONES DE CÁLCULO
// ============================================

// Función para determinar tarifa de envío según rango
function calculateShippingFee(subtotal) {
    for (const range of SHIPPING_RANGES) {
        if (subtotal <= range.max) {
            return {
                fee: range.fee,
                discount: range.discount,
                rangeText: range.max === Infinity ? 
                    `Más de $5,000` : 
                    subtotal <= 2000 ? 
                        `Hasta $2,000` : 
                        `$${SHIPPING_RANGES[0].max + 1} - $${range.max}`
            };
        }
    }
    // Por defecto
    return { fee: 200, discount: "0%", rangeText: "Hasta $2,000" };
}

// Función para calcular precio final según nueva política
function calculateFinalPrice(cartItems) {
    // 1. Calcular subtotal de productos
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // 2. Determinar tarifa de envío según rango
    const shippingInfo = calculateShippingFee(subtotal);
    const shippingFee = shippingInfo.fee;
    
    // 3. Calcular comisión del 8%
    const serviceFee = subtotal * SERVICE_FEE_PERCENTAGE;
    
    // 4. Aplicar regla del piso ($300 utilidad mínima)
    const currentProfit = serviceFee + shippingFee;
    let adjustment = 0;
    if (currentProfit < MINIMUM_PROFIT) {
        adjustment = MINIMUM_PROFIT - currentProfit;
    }
    
    // 5. Calcular total final
    const finalPrice = subtotal + shippingFee + adjustment;
    
    return {
        subtotal: subtotal,
        serviceFee: serviceFee,
        shippingFee: shippingFee,
        shippingDiscount: shippingInfo.discount,
        shippingRange: shippingInfo.rangeText,
        adjustment: adjustment,
        finalPrice: finalPrice,
        yourProfit: currentProfit + adjustment
    };
}

// Función para generar mensaje de WhatsApp
function generateWhatsAppMessage(cart, customerData, priceDetails) {
    const itemsText = cart.map(item => 
        `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');
    
    // Mensaje según el rango de descuento
    let shippingMessage = "";
    if (priceDetails.shippingDiscount === "25%") {
        shippingMessage = `⭐ *¡APROVECHASTE DESCUENTO EN ENVÍO!* 
Por compra mediana, solo $${priceDetails.shippingFee.toLocaleString()} (ahorras $50 vs. envío normal)`;
    } else if (priceDetails.shippingDiscount === "50%") {
        shippingMessage = `🎯 *¡ENVÍO A MEDIO PRECIO!*
Por tu compra mayor a $5,000, el envío es de solo $${priceDetails.shippingFee.toLocaleString()} (50% de descuento)`;
    } else {
        shippingMessage = `🚚 Envío estándar: $${priceDetails.shippingFee.toLocaleString()}`;
    }
    
    return `✅ *PEDIDO CONFIRMADO - EL RESOLVITO*

🛒 *TU COMPRA:*
${itemsText}

💰 *DESGLOSE:*
- Productos: $${priceDetails.subtotal.toLocaleString()} 
- ${shippingMessage}
${priceDetails.adjustment > 0 ? `- Ajuste servicio: $${priceDetails.adjustment.toLocaleString()}` : ''}
- *TOTAL A PAGAR: $${priceDetails.finalPrice.toLocaleString()}*

📍 *ENTREGA:* ${customerData.location === 'habana-vieja' ? 'Habana Vieja' : customerData.location}
📞 *CONTACTO:* ${customerData.phone}

*Todos los precios incluyen la entrega a domicilio.*`;
}

// Función para calcular peso total del pedido
function calculateTotalWeight(cart) {
    let totalWeight = 0;
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        if (item.weight !== undefined) {
            totalWeight += item.weight * item.quantity;
        }
    }
    return totalWeight;
}

// ============================================
// FUNCIONES PRINCIPALES DEL CARRITO
// ============================================

// Actualizar UI del carrito
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Actualizar contadores en todos lados
    document.querySelectorAll('#cartCount, #cartCountMobile, #headerCartCount, #floatingCartCount').forEach(el => {
        if (el) {
            el.textContent = totalItems;
            el.setAttribute('data-count', totalItems);
            el.classList.toggle('hidden', totalItems === 0);
            
            // Animación cuando cambia
            if (totalItems > 0) {
                el.classList.add('badge-pop');
                setTimeout(() => el.classList.remove('badge-pop'), 300);
            }
        }
    });
    
    // Actualizar total flotante
    const floatingTotal = document.getElementById('floatingCartTotal');
    if (floatingTotal) floatingTotal.textContent = '$' + totalPrice.toLocaleString();
    
    // Actualizar items del carrito en el modal
    const cartItems = document.getElementById('cartItems');
    const sendWhatsAppOrder = document.getElementById('sendWhatsAppOrder');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-gray-500 text-fixed-base">Tu carrito está vacío</p>';
        if (sendWhatsAppOrder) sendWhatsAppOrder.disabled = true;
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div class="flex-1">
                    <h5 class="text-fixed-base font-semibold text-gray-800">${item.name}</h5>
                    <p class="text-fixed-sm text-gray-500">$${item.price.toLocaleString()} c/u × ${item.quantity}</p>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="updateCartQuantity(${index}, ${item.quantity - 1})" class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-fixed-sm font-bold hover:bg-gray-300 transition-colors">-</button>
                    <span class="text-fixed-base font-semibold w-8 text-center">${item.quantity}</span>
                    <button onclick="updateCartQuantity(${index}, ${item.quantity + 1})" class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-fixed-sm font-bold hover:bg-gray-300 transition-colors">+</button>
                    <button onclick="removeFromCart(${index})" class="ml-2 text-red-500 hover:text-red-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>`).join('');
        
        if (sendWhatsAppOrder) sendWhatsAppOrder.disabled = false;
    }
    
    // Actualizar badge del carrito en el botón flotante
    updateCartBadge(totalItems);
}

// Actualizar badge del carrito
function updateCartBadge(count) {
    const badge = document.querySelector('.cart-badge, #cartCount');
    if (badge) {
        badge.textContent = count;
        badge.classList.toggle('hidden', count === 0);
    }
}

// Actualizar cantidad en el carrito
function updateCartQuantity(index, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(index);
        showCartToast('Producto eliminado del carrito');
        return;
    }
    cart[index].quantity = newQuantity;
    updateCartUI();
    localStorage.setItem('cart', JSON.stringify(cart));
    showCartToast('Carrito actualizado');
}

// Eliminar producto del carrito
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
    localStorage.setItem('cart', JSON.stringify(cart));
    showCartToast('Producto eliminado del carrito');
}

// Vaciar carrito completo
function clearCart() {
    cart = [];
    updateCartUI();
    localStorage.setItem('cart', JSON.stringify(cart));
    showCartToast('Carrito vaciado');
}

// Añadir producto al carrito (versión simplificada)
function addToCart(product) {
    if (!product || !product.id || !product.name || !product.price) {
        console.error('Producto inválido');
        return false;
    }

    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += product.quantity || 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: product.quantity || 1,
            weight: product.weight || 0
        });
    }

    updateCartUI();
    localStorage.setItem('cart', JSON.stringify(cart));
    showCartAnimation();
    showCartToast('Producto añadido al carrito');
    return true;
}

// ============================================
// FUNCIONES DE CHECKOUT
// ============================================

// Iniciar proceso de checkout
function iniciarCheckout() {
    if (cart.length === 0) {
        showCartToast('El carrito está vacío');
        return false;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (subtotal < MIN_ORDER_THRESHOLD) {
        showCartToast(`Mínimo de compra $${MIN_ORDER_THRESHOLD}`);
        return false;
    }
    
    // Aquí puedes abrir el modal de checkout
    return true;
}

// Confirmar pedido y enviar por WhatsApp
function confirmOrder(customerData) {
    if (cart.length === 0) {
        showCartToast('El carrito está vacío');
        return false;
    }
    
    // Validar datos del cliente
    if (!customerData || !customerData.name || !customerData.phone || !customerData.address) {
        showCartToast('Completa todos los datos');
        return false;
    }
    
    // Calcular precios
    const priceDetails = calculateFinalPrice(cart);
    
    // Generar mensaje
    const message = generateWhatsAppMessage(cart, customerData, priceDetails);
    
    // Abrir WhatsApp
    const whatsappNumber = '5356382909';
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    
    // Opcional: limpiar carrito después del pedido
    // clearCart();
    
    return true;
}

// ============================================
// FUNCIONES DE UI/UX
// ============================================

// Mostrar animación del carrito
function showCartAnimation() {
    const btn = document.getElementById('floatingCartBtn');
    if (btn) {
        btn.classList.add('shake');
        setTimeout(() => btn.classList.remove('shake'), 600);
    }
}

// Mostrar toast notification
function showCartToast(message) {
    const toast = document.getElementById('cartToast');
    const msg = document.getElementById('cartToastMessage');
    
    if (!toast || !msg) return;
    
    clearTimeout(window.toastTimeout);
    msg.textContent = message;
    toast.classList.add('show');
    
    window.toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

// Toggle carrito sidebar/modal
function toggleCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.toggle('show');
        document.body.style.overflow = modal.classList.contains('show') ? 'hidden' : '';
    }
}

// ============================================
// EXPORTAR FUNCIONES (si usas módulos)
// ============================================
// Si estás usando módulos, descomenta esto:
// export {
//     cart,
//     updateCartUI,
//     addToCart,
//     removeFromCart,
//     updateCartQuantity,
//     clearCart,
//     confirmOrder,
//     toggleCart,
//     showCartToast
// };
