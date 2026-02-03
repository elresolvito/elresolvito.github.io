// assets/js/cart-system.js
import CONFIG from '../config/settings.js';

class CartSystem {
    constructor() {
        this.items = [];
        this.cartKey = 'mercadoBayona_cart';
        this.customerDataKey = 'mercadoBayona_customer';
        
        // Elementos del DOM
        this.cartModal = document.getElementById('cartModal');
        this.cartButton = document.getElementById('cartButton');
        this.cartCount = document.getElementById('cartCount');
        this.cartPreview = document.getElementById('cartPreview');
        this.cartPreviewTotal = document.getElementById('cartPreviewTotal');
        this.floatingCartTotal = document.getElementById('floatingCartTotal');
        
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.updateUI();
        
        // Escuchar eventos externos
        document.addEventListener('cart:addItem', (e) => this.addItem(e.detail));
        document.addEventListener('cart:openCheckout', () => this.openCheckout());
        document.addEventListener('cart:clear', () => this.clear());
    }

    // ==================== GESTIÓN DE ITEMS ====================
    addItem(item) {
        // Verificar si el item ya existe en el carrito
        const existingIndex = this.items.findIndex(i => i.id === item.id);
        
        if (existingIndex !== -1) {
            // Actualizar cantidad
            this.items[existingIndex].quantity += item.quantity;
            
            // Verificar que no exceda el stock
            if (this.items[existingIndex].maxStock && 
                this.items[existingIndex].quantity > this.items[existingIndex].maxStock) {
                this.items[existingIndex].quantity = this.items[existingIndex].maxStock;
                this.showToast('Cantidad máxima alcanzada', 'warning');
            }
        } else {
            // Agregar nuevo item
            this.items.push({
                ...item,
                addedAt: Date.now()
            });
        }
        
        this.saveToStorage();
        this.updateUI();
        this.showAddedAnimation(item);
        this.showToast('Producto añadido al carrito', 'success');
    }

    updateQuantity(itemId, newQuantity) {
        const itemIndex = this.items.findIndex(item => item.id === itemId);
        
        if (itemIndex === -1) return false;
        
        if (newQuantity <= 0) {
            // Eliminar item
            this.items.splice(itemIndex, 1);
            this.showToast('Producto eliminado', 'info');
        } else {
            // Actualizar cantidad
            const item = this.items[itemIndex];
            
            // Verificar stock máximo
            if (item.maxStock && newQuantity > item.maxStock) {
                newQuantity = item.maxStock;
                this.showToast('Cantidad máxima alcanzada', 'warning');
            }
            
            item.quantity = newQuantity;
        }
        
        this.saveToStorage();
        this.updateUI();
        return true;
    }

    removeItem(itemId) {
        const initialLength = this.items.length;
        this.items = this.items.filter(item => item.id !== itemId);
        
        if (this.items.length < initialLength) {
            this.saveToStorage();
            this.updateUI();
            this.showToast('Producto eliminado', 'info');
            return true;
        }
        
        return false;
    }

    clear() {
        this.items = [];
        this.saveToStorage();
        this.updateUI();
        this.showToast('Carrito vaciado', 'info');
    }

    // ==================== CÁLCULOS ====================
    getSubtotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getWeight() {
        return this.items.reduce((total, item) => {
            // Asumir 1kg por item si no tiene peso definido
            const weight = item.weight || 1;
            return total + (weight * item.quantity);
        }, 0);
    }

    // ==================== STORAGE ====================
    saveToStorage() {
        try {
            const cartData = {
                items: this.items,
                timestamp: Date.now(),
                version: '1.0'
            };
            localStorage.setItem(this.cartKey, JSON.stringify(cartData));
        } catch (error) {
            console.error('Error guardando carrito:', error);
        }
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem(this.cartKey);
            if (!saved) return;
            
            const data = JSON.parse(saved);
            
            // Verificar versión (para migraciones futuras)
            if (data.version === '1.0') {
                this.items = data.items || [];
            }
            
        } catch (error) {
            console.error('Error cargando carrito:', error);
            localStorage.removeItem(this.cartKey);
        }
    }

    saveCustomerData(data) {
        try {
            localStorage.setItem(this.customerDataKey, JSON.stringify(data));
        } catch (error) {
            console.error('Error guardando datos del cliente:', error);
        }
    }

    loadCustomerData() {
        try {
            const saved = localStorage.getItem(this.customerDataKey);
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Error cargando datos del cliente:', error);
            return null;
        }
    }

    // ==================== UI ====================
    updateUI() {
        const itemCount = this.getItemCount();
        const subtotal = this.getSubtotal();
        
        // Actualizar contador
        if (this.cartCount) {
            this.cartCount.textContent = itemCount;
            this.cartCount.classList.toggle('hidden', itemCount === 0);
        }
        
        // Actualizar preview del carrito
        if (this.cartPreview && this.cartPreviewTotal) {
            if (itemCount === 0) {
                this.cartPreview.textContent = 'Vacío';
                this.cartPreviewTotal.textContent = '$0';
            } else {
                const itemsText = this.items.slice(0, 2).map(item => 
                    `${item.quantity}x ${item.name.substring(0, 20)}${item.name.length > 20 ? '...' : ''}`
                ).join(', ');
                
                this.cartPreview.textContent = itemsText;
                this.cartPreviewTotal.textContent = `$${subtotal.toLocaleString()}`;
            }
        }
        
        // Actualizar total flotante
        if (this.floatingCartTotal) {
            this.floatingCartTotal.textContent = `$${subtotal.toLocaleString()}`;
        }
        
        // Actualizar botón del carrito
        if (this.cartButton) {
            if (itemCount === 0) {
                this.cartButton.classList.add('opacity-75');
            } else {
                this.cartButton.classList.remove('opacity-75');
            }
        }
        
        // Actualizar modal si está abierto
        if (this.cartModal && !this.cartModal.classList.contains('hidden')) {
            this.renderCartModal();
        }
        
        // Disparar evento de actualización
        this.dispatchCartUpdated();
    }

    renderCartModal() {
        if (!this.cartModal) return;
        
        const modalContent = this.cartModal.querySelector('.modal-content');
        if (!modalContent) return;
        
        const subtotal = this.getSubtotal();
        
        modalContent.innerHTML = `
            <div class="bg-white rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col">
                <!-- Header -->
                <div class="p-6 border-b flex justify-between items-center">
                    <h3 class="text-2xl font-bold text-gray-900">Tu Carrito</h3>
                    <button id="closeCartModal" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                
                <!-- Lista de items -->
                <div class="flex-1 overflow-y-auto p-6">
                    ${this.items.length === 0 ? `
                        <div class="text-center py-12">
                            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                            </svg>
                            <h4 class="text-lg font-semibold text-gray-700 mb-2">Tu carrito está vacío</h4>
                            <p class="text-gray-500">Agrega productos para comenzar</p>
                        </div>
                    ` : `
                        <div class="space-y-4">
                            ${this.items.map((item, index) => `
                                <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                    <!-- Imagen -->
                                    <div class="flex-shrink-0 w-16 h-16 bg-white rounded-lg border flex items-center justify-center">
                                        <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-contain">
                                    </div>
                                    
                                    <!-- Info -->
                                    <div class="flex-1">
                                        <h4 class="font-semibold text-gray-900 truncate">${item.name}</h4>
                                        <p class="text-sm text-gray-500">$${item.price.toLocaleString()} c/u</p>
                                    </div>
                                    
                                    <!-- Controles -->
                                    <div class="flex items-center space-x-3">
                                        <!-- Cantidad -->
                                        <div class="flex items-center space-x-2">
                                            <button class="cart-qty-btn minus" data-index="${index}" 
                                                    class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                                                </svg>
                                            </button>
                                            <span class="w-8 text-center font-semibold">${item.quantity}</span>
                                            <button class="cart-qty-btn plus" data-index="${index}"
                                                    class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                                </svg>
                                            </button>
                                        </div>
                                        
                                        <!-- Eliminar -->
                                        <button class="cart-remove-btn" data-index="${index}"
                                                class="text-red-500 hover:text-red-700">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
                
                <!-- Footer -->
                <div class="border-t p-6">
                    <!-- Resumen -->
                    <div class="space-y-3 mb-6">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Subtotal:</span>
                            <span class="font-semibold">$${subtotal.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Env�o:</span>
                            <span class="font-semibold" id="cartShippingEstimate">Calculando...</span>
                        </div>
                        <div class="border-t pt-3 flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span id="cartTotal" class="text-primary">$${subtotal.toLocaleString()}</span>
                        </div>
                    </div>
                    
                    <!-- Botones -->
                    <div class="space-y-3">
                        <button id="checkoutBtn" 
                                class="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                ${this.items.length === 0 ? 'disabled' : ''}>
                            Proceder al pago
                        </button>
                        
                        <button id="clearCartBtn" 
                                class="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-6 rounded-lg transition-colors"
                                ${this.items.length === 0 ? 'disabled' : ''}>
                            Vaciar carrito
                        </button>
                        
                        <button id="continueShoppingBtn" 
                                class="w-full text-primary hover:text-primary-dark font-medium py-3 px-6 rounded-lg transition-colors">
                            Seguir comprando
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Configurar event listeners dinámicos
        this.setupCartModalListeners();
        
        // Calcular envío
        this.updateShippingEstimate();
    }

    setupCartModalListeners() {
        // Cerrar modal
        document.getElementById('closeCartModal')?.addEventListener('click', () => {
            this.hideModal();
        });
        
        // Botones de cantidad
        document.querySelectorAll('.cart-qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                const item = this.items[index];
                if (item) {
                    this.updateQuantity(item.id, item.quantity - 1);
                }
            });
        });
        
        document.querySelectorAll('.cart-qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                const item = this.items[index];
                if (item) {
                    this.updateQuantity(item.id, item.quantity + 1);
                }
            });
        });
        
        // Botones eliminar
        document.querySelectorAll('.cart-remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                const item = this.items[index];
                if (item) {
                    this.removeItem(item.id);
                }
            });
        });
        
        // Botones principales
        document.getElementById('checkoutBtn')?.addEventListener('click', () => {
            this.openCheckout();
        });
        
        document.getElementById('clearCartBtn')?.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                this.clear();
            }
        });
        
        document.getElementById('continueShoppingBtn')?.addEventListener('click', () => {
            this.hideModal();
        });
    }

    // ==================== ENVÍO ====================
    calculateShipping() {
        const subtotal = this.getSubtotal();
        
        // Usar la misma política que El Resolvito
        let shippingFee = 200; // Por defecto
        
        if (subtotal > 5000) {
            shippingFee = 100; // 50% descuento
        } else if (subtotal > 2000) {
            shippingFee = 150; // 25% descuento
        }
        
        return {
            fee: shippingFee,
            range: subtotal <= 2000 ? 'Hasta $2,000' : 
                   subtotal <= 5000 ? '$2,001 - $5,000' : 'Más de $5,000',
            discount: subtotal <= 2000 ? '0%' : 
                      subtotal <= 5000 ? '25%' : '50%'
        };
    }

    updateShippingEstimate() {
        const shippingElement = document.getElementById('cartShippingEstimate');
        const totalElement = document.getElementById('cartTotal');
        
        if (!shippingElement || !totalElement) return;
        
        if (this.items.length === 0) {
            shippingElement.textContent = '$0';
            return;
        }
        
        const shipping = this.calculateShipping();
        const subtotal = this.getSubtotal();
        const total = subtotal + shipping.fee;
        
        shippingElement.textContent = `$${shipping.fee.toLocaleString()} (${shipping.discount} off)`;
        totalElement.textContent = `$${total.toLocaleString()}`;
    }

    // ==================== CHECKOUT ====================
    openCheckout() {
        if (this.items.length === 0) {
            this.showToast('Tu carrito está vacío', 'warning');
            return;
        }
        
        this.hideModal();
        
        // Disparar evento para que checkout-flow.js maneje la apertura
        const event = new CustomEvent('checkout:open', {
            detail: {
                items: this.items,
                subtotal: this.getSubtotal(),
                shipping: this.calculateShipping()
            }
        });
        
        document.dispatchEvent(event);
    }

    // ==================== MODAL ====================
    showModal() {
        if (!this.cartModal) return;
        
        this.renderCartModal();
        this.cartModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Animar entrada
        setTimeout(() => {
            this.cartModal.classList.add('modal-enter');
        }, 10);
    }

    hideModal() {
        if (!this.cartModal) return;
        
        this.cartModal.classList.remove('modal-enter');
        this.cartModal.classList.add('modal-exit');
        
        setTimeout(() => {
            this.cartModal.classList.add('hidden');
            this.cartModal.classList.remove('modal-exit');
            document.body.style.overflow = '';
        }, 300);
    }

    // ==================== EVENT LISTENERS ====================
    setupEventListeners() {
        // Botón del carrito
        this.cartButton?.addEventListener('click', () => {
            this.showModal();
        });
        
        // Cerrar modal al hacer clic fuera
        this.cartModal?.addEventListener('click', (e) => {
            if (e.target === this.cartModal) {
                this.hideModal();
            }
        });
        
        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.cartModal && !this.cartModal.classList.contains('hidden')) {
                this.hideModal();
            }
        });
    }

    // ==================== ANIMACIONES Y NOTIFICACIONES ====================
    showAddedAnimation(item) {
        // Animación en el botón del carrito
        if (this.cartButton) {
            this.cartButton.classList.add('cart-bump');
            setTimeout(() => {
                this.cartButton.classList.remove('cart-bump');
            }, 300);
        }
        
        // Efecto visual si hay un elemento de producto visible
        const productElement = document.querySelector(`[data-product-id="${item.productId}"]`);
        if (productElement) {
            productElement.classList.add('animate-add-to-cart');
            setTimeout(() => {
                productElement.classList.remove('animate-add-to-cart');
            }, 400);
        }
    }

    showToast(message, type = 'info') {
        // Crear toast si no existe
        let toast = document.getElementById('cartToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'cartToast';
            toast.className = 'toast hidden';
            document.body.appendChild(toast);
        }
        
        // Configurar tipo
        const typeClasses = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-gray-800'
        };
        
        toast.className = `toast ${typeClasses[type] || 'bg-gray-800'} text-white`;
        toast.innerHTML = `
            <div class="flex items-center gap-2">
                ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ️'}
                <span>${message}</span>
            </div>
        `;
        
        // Mostrar
        toast.classList.remove('hidden');
        toast.classList.add('notification-slide-in');
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            toast.classList.remove('notification-slide-in');
            toast.classList.add('notification-slide-out');
            
            setTimeout(() => {
                toast.classList.add('hidden');
                toast.classList.remove('notification-slide-out');
            }, 300);
        }, 3000);
    }

    // ==================== EVENTOS ====================
    dispatchCartUpdated() {
        const event = new CustomEvent('cart:updated', {
            detail: {
                items: this.items,
                count: this.getItemCount(),
                subtotal: this.getSubtotal(),
                weight: this.getWeight()
            }
        });
        
        window.dispatchEvent(event);
    }
}

// Exportar singleton
const cartSystem = new CartSystem();
export default cartSystem;
