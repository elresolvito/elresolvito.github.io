// js/checkout.js
// ============================================
// LÓGICA DEL CHECKOUT
// ============================================

function openCheckoutModal() {
    if (cart.length === 0) {
        showCartToast('El carrito está vacío');
        return;
    }

    // Actualizar resumen del carrito en el modal
    const summaryEl = document.getElementById('checkoutCartSummary');
    const totalEl = document.getElementById('checkoutTotal');
    
    if (summaryEl) {
        const subtotal = cart.reduce((sum, item) => sum + (item.precio * (item.cantidad || 0)), 0);
        const shipping = calculateShipping(subtotal);
        const total = subtotal + shipping;
        
        summaryEl.innerHTML = cart.map(item => 
            `<div class="flex justify-between mb-1">
                <span>${item.nombre} x${item.cantidad}</span>
                <span>$${(item.precio * item.cantidad).toLocaleString()}</span>
            </div>`
        ).join('');
        
        if (totalEl) totalEl.textContent = `$${total.toLocaleString()}`;
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

function sendCompleteOrder() {
    // Validar que el carrito no esté vacío
    if (cart.length === 0) {
        showCartToast('El carrito está vacío');
        closeCheckoutModal();
        return;
    }

    // Obtener datos del formulario
    const customerName = document.getElementById('customerName')?.value.trim();
    const customerAddress = document.getElementById('customerAddress')?.value.trim();
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
    if (!paymentMethod) {
        alert('Por favor, selecciona un método de pago.');
        return;
    }

    // Calcular totales
    const subtotal = cart.reduce((sum, item) => sum + (item.precio * (item.cantidad || 0)), 0);
    const shipping = calculateShipping(subtotal);
    const total = subtotal + shipping;

    // Construir mensaje
    let message = `*✅ PEDIDO CONFIRMADO - EL RESOLVITO*\n\n`;
    message += `👤 *DATOS DEL CLIENTE:*\n`;
    message += `• Nombre: ${customerName}\n`;
    message += `• Dirección: ${customerAddress}\n`;
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
    message += `- Envío (${getShippingRangeName(subtotal)}): ${shipping === 0 ? 'GRATIS' : '$' + shipping.toLocaleString()}\n`;
    message += `- *TOTAL A PAGAR: $${total.toLocaleString()}*\n\n`;
    message += `_Gracias por tu compra. En breve te contactaremos._`;

    // Enviar por WhatsApp
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');

    // Limpiar carrito (opcional - puedes comentar si no quieres vaciarlo)
    clearCart();
    
    // Cerrar modales
    closeCheckoutModal();
    toggleCart(); // Cierra el carrito si está abierto
    
    // Mostrar mensaje de éxito
    showCartToast('¡Pedido enviado! Revisa WhatsApp');
}
