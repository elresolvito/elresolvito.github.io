// js/checkout.js
// ============================================
// LÓGICA DEL CHECKOUT (ACTUALIZADA)
// ============================================

function openCheckoutModal() {
    if (cart.length === 0) {
        showCartToast('El carrito está vacío');
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.precio * (item.cantidad || 0)), 0);

    // Validar compra mínima
    if (subtotal < MINIMUM_PURCHASE) {
        showCartToast(`Compra mínima: $${MINIMUM_PURCHASE}`);
        return;
    }

    // Actualizar resumen del carrito en el modal
    const summaryEl = document.getElementById('checkoutCartSummary');
    const totalEl = document.getElementById('checkoutTotal');
    
    if (summaryEl) {
        summaryEl.innerHTML = cart.map(item => 
            `<div class="flex justify-between mb-1">
                <span>${item.nombre} x${item.cantidad}</span>
                <span>$${(item.precio * item.cantidad).toLocaleString()}</span>
            </div>`
        ).join('');
        
        if (totalEl) totalEl.textContent = `$${subtotal.toLocaleString()}`;
    }

    // Abrir modal
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function calculateFinalTotal(subtotal, location) {
    if (location === 'habana-vieja') {
        return subtotal + SHIPPING_WITHIN_HABANA_VIEJA;
    } else {
        // Fuera de LHV: el total se determina después por WhatsApp
        return subtotal; // El costo de envío se añade en el mensaje
    }
}

function sendCompleteOrder() {
    // Validar carrito
    if (cart.length === 0) {
        showCartToast('El carrito está vacío');
        closeCheckoutModal();
        return;
    }

    // Obtener datos del formulario
    const customerName = document.getElementById('customerName')?.value.trim();
    const customerAddress = document.getElementById('customerAddress')?.value.trim();
    const deliveryZone = document.querySelector('input[name="deliveryZone"]:checked')?.value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
    const customerNotes = document.getElementById('customerNotes')?.value.trim();

    // Validaciones básicas
    if (!customerName) {
        alert('Por favor, ingresa tu nombre completo.');
        return;
    }
    if (!customerAddress) {
        alert('Por favor, ingresa tu dirección de entrega.');
        return;
    }
    if (!deliveryZone) {
        alert('Por favor, selecciona la zona de entrega.');
        return;
    }
    if (!paymentMethod) {
        alert('Por favor, selecciona un método de pago.');
        return;
    }

    // Calcular totales
    const subtotal = cart.reduce((sum, item) => sum + (item.precio * (item.cantidad || 0)), 0);
    
    if (subtotal < MINIMUM_PURCHASE) {
        alert(`El subtotal debe ser de al menos $${MINIMUM_PURCHASE}.`);
        return;
    }

    let shippingCost = 0;
    let shippingDescription = '';

    if (deliveryZone === 'habana-vieja') {
        shippingCost = SHIPPING_WITHIN_HABANA_VIEJA;
        shippingDescription = `Envío dentro de La Habana Vieja: $${SHIPPING_WITHIN_HABANA_VIEJA}`;
    } else {
        shippingDescription = 'Envío fuera de La Habana Vieja: costo a consultar (por peso y distancia)';
    }

    const totalToShow = (deliveryZone === 'habana-vieja') ? subtotal + shippingCost : subtotal;

    // Construir mensaje
    let message = `*✅ PEDIDO CONFIRMADO - EL RESOLVITO*\n\n`;
    message += `👤 *DATOS DEL CLIENTE:*\n`;
    message += `• Nombre: ${customerName}\n`;
    message += `• Dirección: ${customerAddress}\n`;
    message += `• Zona: ${deliveryZone === 'habana-vieja' ? 'La Habana Vieja' : 'Fuera de La Habana Vieja'}\n`;
    message += `• Pago: ${paymentMethod}\n`;
    if (customerNotes) {
        message += `• Notas: ${customerNotes}\n`;
    }
    
    message += `\n🛒 *DETALLE DEL PEDIDO:*\n`;
    cart.forEach(item => {
        message += `• ${item.nombre} x${item.cantidad} = $${(item.precio * item.cantidad).toLocaleString()}\n`;
    });
    
    message += `\n💰 *RESUMEN:*\n`;
    message += `- Subtotal: $${subtotal.toLocaleString()}\n`;
    message += `- ${shippingDescription}\n`;
    message += `- *TOTAL A PAGAR: $${totalToShow.toLocaleString()}*`;
    
    if (deliveryZone !== 'habana-vieja') {
        message += ` (más envío a consultar)`;
    }
    
    message += `\n\n_Recibirás un mensaje de confirmación con el costo final de envío (si aplica)._`;

    // Enviar por WhatsApp
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');

    // Opcional: limpiar carrito después del envío
    // clearCart();
    
    // Cerrar modales
    closeCheckoutModal();
    toggleCart(); // Cierra el carrito si está abierto
    
    // Mostrar mensaje de éxito
    showCartToast('¡Pedido enviado! Revisa WhatsApp');
}
