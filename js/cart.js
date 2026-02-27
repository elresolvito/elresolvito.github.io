// ============================================
// GESTIÓN DEL CARRITO DE COMPRAS - VERSIÓN MEJORADA
// ============================================
class CartManager {
    constructor() {
        this.SHIPPING_COST = 200;
        this.FREE_SHIPPING_MIN = 5000;
        this.WHATSAPP_NUMBER = '5356382909';
        this.STORAGE_KEY = 'elResolvitoCart';
        
        // Inicializar carrito
        this.cart = [];
        this.init();
    }

    // Inicializar carrito
    init() {
        this.loadCart();
        this.setupEventListeners();
        this.updateUI();
    }

    // Cargar carrito del localStorage con validación
    loadCart() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Validar que sea un array
                if (Array.isArray(parsed)) {
                    // Validar cada item
                    this.cart = parsed.filter(item => 
                        item && 
                        typeof item === 'object' &&
                        item.id && 
                        item.name && 
                        typeof item.price === 'number' &&
                        typeof item.quantity === 'number' &&
                        item.quantity > 0
                    );
                } else {
                    this.cart = [];
                }
            } else {
                this.cart = [];
            }
        } catch (error) {
            console.error('Error cargando carrito:', error);
            this.cart = [];
            // Limpiar localStorage corrupto
            localStorage.removeItem(this.STORAGE_KEY);
        }
        
        this.saveCart(); // Guardar versión limpia
    }

    // Guardar carrito en localStorage
    saveCart() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error guardando carrito:', error);
        }
    }

    // Añadir producto al carrito
    addItem(product) {
        if (!product || !product.id || !product.nombre) {
            console.error('Producto inválido:', product);
            return false;
        }

        const existing = this.cart.find(item => item.id === product.id);
        
        if (existing) {
            existing.quantity++;
        } else {
            this.cart.push({
                id: product.id,
                name: product.nombre,
                price: product.precio,
                image: product.imagen,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateUI();
        this.showNotification(`${product.nombre} añadido al carrito`);
        return true;
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
        this.showNotification('Producto eliminado del carrito');
    }

    // Vaciar carrito
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateUI();
        this.showNotification('Carrito vaciado');
    }

    // Calcular totales
    getTotals() {
        const subtotal = this.cart.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        
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
        document.querySelectorAll('.cart-count, #cartCount, #cartCountMobile').forEach(el => {
            if (el) {
                el.textContent = count;
                el.style.display = count > 0 ? 'flex' : 'none';
                el.classList.toggle('hidden', count === 0);
            }
        });

        // Actualizar contenido del carrito
        const cartItemsEl = document.getElementById('cartItems');
        const cartFooterEl = document.getElementById('cartFooter');
        
        if (!cartItemsEl) return;

        if (this.cart.length === 0) {
            cartItemsEl.innerHTML = `
                <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                    <i class="fas fa-shopping-cart text-5xl mb-3 opacity-30"></i>
                    <p class="font-medium">Tu carrito está vacío</p>
                    <p class="text-sm mt-2">¡Explora nuestra tienda!</p>
                </div>
            `;
            if (cartFooterEl) cartFooterEl.style.display = 'none';
            return;
        }

        // Renderizar items
        cartItemsEl.innerHTML = this.cart.map(item => `
            <div class="cart-item flex gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl hover:shadow-md transition-shadow" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg bg-white" 
                     onerror="this.src='https://via.placeholder.com/64?text=Producto'">
                <div class="flex-1">
                    <h4 class="font-medium text-sm text-gray-900 dark:text-white">${item.name}</h4>
                    <p class="text-cuban-green font-bold">$${item.price.toLocaleString('es-CU')}</p>
                    <div class="flex items-center gap-2 mt-2">
                        <button onclick="cart.updateQuantity(${item.id}, -1)" 
                                class="w-6 h-6 bg-white dark:bg-gray-700 rounded shadow text-xs hover:bg-cuban-green hover:text-white transition-colors"
                                ${item.quantity <= 1 ? 'disabled' : ''}>
                            -
                        </button>
                        <span class="text-sm font-medium w-6 text-center">${item.quantity}</span>
                        <button onclick="cart.updateQuantity(${item.id}, 1)" 
                                class="w-6 h-6 bg-white dark:bg-gray-700 rounded shadow text-xs hover:bg-cuban-green hover:text-white transition-colors">
                            +
                        </button>
                        <button onclick="cart.removeItem(${item.id})" 
                                class="ml-auto text-red-500 hover:text-red-700 transition-colors">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Actualizar totales
        const { subtotal, shipping, total } = this.getTotals();
        
        const subtotalEl = document.getElementById('cartSubtotal');
        const shippingEl = document.getElementById('cartShipping');
        const totalEl = document.getElementById('cartTotal');
        
        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString('es-CU')}`;
        if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-CU')}`;
        if (totalEl) totalEl.textContent = `$${total.toLocaleString('es-CU')}`;
        
        if (cartFooterEl) cartFooterEl.style.display = 'block';
    }

    // Procesar checkout por WhatsApp
    checkout() {
        if (this.cart.length === 0) {
            this.showNotification('El carrito está vacío');
            return;
        }

        const { subtotal, shipping, total } = this.getTotals();
        
        let message = `🛒 *Pedido El Resolvito*\n\n`;
        
        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            message += `• ${item.name} x${item.quantity} = $${itemTotal.toLocaleString('es-CU')}\n`;
        });
        
        message += `\n📦 *Subtotal:* $${subtotal.toLocaleString('es-CU')}`;
        message += `\n🚚 *Envío:* ${shipping === 0 ? 'Gratis' : '$' + shipping.toLocaleString('es-CU')}`;
        message += `\n💰 *Total a pagar:* $${total.toLocaleString('es-CU')}`;
        message += `\n\n📍 *Zona:* La Habana Vieja`;
        
        // Abrir WhatsApp
        window.open(`https://wa.me/${this.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
        
        // Opcional: limpiar carrito después del pedido
        // this.clearCart();
    }

    // Toggle carrito sidebar
    toggleCart() {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.toggle('cart-open');
            overlay.classList.toggle('hidden');
            
            // Prevenir scroll del body cuando el carrito está abierto
            if (sidebar.classList.contains('cart-open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    }

    // Mostrar notificación
    showNotification(message) {
        // Eliminar notificaciones anteriores
        const oldNotifications = document.querySelectorAll('.cart-notification');
        oldNotifications.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = 'cart-notification fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-cuban-green text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2 animate-slideUp';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideDown 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    }

    // Configurar event listeners
    setupEventListeners() {
        // Cerrar carrito al hacer clic fuera
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('cartSidebar');
            const overlay = document.getElementById('cartOverlay');
            
            if (sidebar && overlay && sidebar.classList.contains('cart-open')) {
                if (e.target === overlay) {
                    this.toggleCart();
                }
            }
        });

        // Cerrar con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const sidebar = document.getElementById('cartSidebar');
                if (sidebar && sidebar.classList.contains('cart-open')) {
                    this.toggleCart();
                }
            }
        });
    }
}

// Instancia global del carrito
const cart = new CartManager();

// Hacer accesible globalmente
window.cart = cart;
