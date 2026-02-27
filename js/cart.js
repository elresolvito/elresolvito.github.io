// ============================================
// GESTIÓN DEL CARRITO DE COMPRAS
// ============================================
class CartManager {
    constructor() {
        this.cart = [];
        this.SHIPPING_COST = 200;
        this.FREE_SHIPPING_MIN = 5000;
        this.WHATSAPP_NUMBER = '5356382909';
        this.loadCart();
    }

    // Cargar carrito del localStorage
    loadCart() {
        const saved = localStorage.getItem('elResolvitoCart');
        if (saved) {
            this.cart = JSON.parse(saved);
        }
        this.updateUI();
    }

    // Guardar carrito en localStorage
    saveCart() {
        localStorage.setItem('elResolvitoCart', JSON.stringify(this.cart));
    }

    // Añadir producto al carrito
    addItem(product) {
        const existing = this.cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity++;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        this.saveCart();
        this.updateUI();
        this.showNotification(`${product.nombre} añadido al carrito`);
    }

    // Actualizar cantidad
    updateQuantity(id, delta) {
        const item = this.cart.find(i => i.id === id);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                this.removeItem(id);
            } else {
                this.saveCart();
                this.updateUI();
            }
        }
    }

    // Eliminar item
    removeItem(id) {
        this.cart = this.cart.filter(i => i.id !== id);
        this.saveCart();
        this.updateUI();
    }

    // Vaciar carrito
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateUI();
    }

    // Calcular totales
    getTotals() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
        const shipping = subtotal > this.FREE_SHIPPING_MIN ? 0 : this.SHIPPING_COST;
        const total = subtotal + shipping;
        return { subtotal, shipping, total };
    }

    // Obtener contador total de items
    getItemCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Actualizar UI del carrito
    updateUI() {
        // Actualizar badges
        const count = this.getItemCount();
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });

        // Actualizar contenido del carrito
        const cartItemsEl = document.getElementById('cart-items');
        const cartFooterEl = document.getElementById('cart-footer');
        
        if (!cartItemsEl) return;

        if (this.cart.length === 0) {
            cartItemsEl.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-shopping-cart text-4xl mb-3 opacity-30"></i>
                    <p>Tu carrito está vacío</p>
                </div>
            `;
            if (cartFooterEl) cartFooterEl.style.display = 'none';
            return;
        }

        // Renderizar items
        cartItemsEl.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.imagen}" alt="${item.nombre}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.nombre}</h4>
                    <p class="cart-item-price">$${item.precio}</p>
                    <div class="cart-item-actions">
                        <button onclick="cart.updateQuantity(${item.id}, -1)" class="cart-qty-btn">-</button>
                        <span class="cart-qty">${item.quantity}</span>
                        <button onclick="cart.updateQuantity(${item.id}, 1)" class="cart-qty-btn">+</button>
                        <button onclick="cart.removeItem(${item.id})" class="cart-remove">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Actualizar totales
        const { subtotal, shipping, total } = this.getTotals();
        
        document.getElementById('cart-subtotal').textContent = `$${subtotal}`;
        document.getElementById('cart-shipping').textContent = shipping === 0 ? 'Gratis' : `$${shipping}`;
        document.getElementById('cart-total').textContent = `$${total}`;
        
        if (cartFooterEl) cartFooterEl.style.display = 'block';
    }

    // Procesar checkout por WhatsApp
    checkout() {
        if (this.cart.length === 0) return;

        const { subtotal, shipping, total } = this.getTotals();
        
        let message = `*🛒 Pedido El Resolvito*\n\n`;
        this.cart.forEach(item => {
            message += `• ${item.nombre} x${item.quantity} = $${item.precio * item.quantity}\n`;
        });
        message += `\n📦 Subtotal: $${subtotal}`;
        message += `\n🚚 Envío: ${shipping === 0 ? 'Gratis' : '$' + shipping}`;
        message += `\n💰 *Total: $${total}*`;

        window.open(`https://wa.me/${this.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    }

    // Mostrar notificación
    showNotification(message) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        // Estilos inline para la notificación
        notification.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: ${getComputedStyle(document.documentElement).getPropertyValue('--cuban-green')};
            color: white;
            padding: 12px 24px;
            border-radius: 50px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 8px;
            animation: slideUp 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    }

    // Toggle carrito sidebar
    toggleCart() {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        
        if (sidebar) {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        }
    }
}

// Instancia global del carrito
const cart = new CartManager();
