// assets/js/product-modal.js
import catalogManager from './catalog-manager.js';

class ProductModal {
    constructor() {
        this.modal = document.getElementById('productModal');
        this.modalContent = this.modal?.querySelector('.modal-content');
        this.currentProduct = null;
        this.currentQuantity = 1;
        this.currentUnit = 'individual';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Cerrar modal al hacer clic fuera
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.hide();
            }
        });
    }

    // ==================== MOSTRAR MODAL ====================
    async show(productId) {
        try {
            // Esperar a que el catálogo esté cargado
            await catalogManager.waitForLoad();
            
            // Obtener producto
            const product = catalogManager.getProductById(productId);
            if (!product) {
                console.error('Producto no encontrado:', productId);
                return;
            }

            this.currentProduct = { ...product };
            this.currentQuantity = 1;
            this.currentUnit = 'individual';

            // Renderizar contenido
            this.render();

            // Mostrar modal
            this.modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';

            // Animar entrada
            setTimeout(() => {
                this.modal.classList.add('modal-enter');
            }, 10);

            // Enfocar primer elemento interactivo
            setTimeout(() => {
                const firstButton = this.modal.querySelector('button');
                if (firstButton) firstButton.focus();
            }, 100);

        } catch (error) {
            console.error('Error mostrando modal:', error);
            this.showError();
        }
    }

    // ==================== RENDERIZAR CONTENIDO ====================
    render() {
        if (!this.modalContent || !this.currentProduct) return;

        const product = this.currentProduct;
        const hasBoxOption = product.hasBoxOption || false;
        const boxPrice = product.boxPrice || product.price * 24;
        const boxQuantity = product.boxQuantity || 24;

        // Calcular precios
        const unitPrice = this.currentUnit === 'box' ? boxPrice : product.price;
        const totalPrice = unitPrice * this.currentQuantity;

        // Generar HTML
        this.modalContent.innerHTML = `
            <div class="bg-white rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <!-- Header -->
                <div class="flex justify-between items-center p-6 border-b">
                    <div class="flex-1">
                        <h2 class="text-2xl font-bold text-gray-900 truncate">${product.name}</h2>
                        <p class="text-sm text-gray-500">${product.category}</p>
                    </div>
                    <button id="closeModalBtn" class="ml-4 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Cerrar">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <!-- Contenido desplazable -->
                <div class="flex-1 overflow-y-auto">
                    <!-- Imagen -->
                    <div class="relative h-64 bg-gray-100">
                        <img src="${product.image}" 
                             alt="${product.name}" 
                             class="w-full h-full object-contain p-4"
                             loading="lazy"
                             onerror="this.src='https://via.placeholder.com/300'">
                        
                        <!-- Badge de disponibilidad -->
                        <div class="absolute top-4 right-4">
                            <span class="px-3 py-1 rounded-full text-xs font-bold ${product.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                ${product.status === 'available' ? 'Disponible' : 'Agotado'}
                            </span>
                        </div>
                    </div>

                    <!-- Información -->
                    <div class="p-6 space-y-4">
                        <!-- Descripción -->
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
                            <p class="text-gray-600">${product.description}</p>
                        </div>

                        <!-- Detalles específicos -->
                        ${product.specificDetails ? `
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 mb-2">Detalles</h3>
                                <p class="text-gray-600">${product.specificDetails}</p>
                            </div>
                        ` : ''}

                        <!-- Stock -->
                        <div class="flex items-center justify-between py-3 border-y">
                            <span class="text-gray-600">Disponibilidad:</span>
                            <span class="font-semibold ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}">
                                ${product.stock > 10 ? 'En stock' : product.stock > 0 ? `Últimas ${product.stock} unidades` : 'Agotado'}
                            </span>
                        </div>

                        <!-- Opciones de unidad (si aplica) -->
                        ${hasBoxOption ? `
                            <div class="space-y-3">
                                <h3 class="text-lg font-semibold text-gray-900">Tipo de compra:</h3>
                                <div class="grid grid-cols-2 gap-2">
                                    <button id="unitIndividual" 
                                            class="p-3 border-2 rounded-lg text-center transition-all ${this.currentUnit === 'individual' ? 'border-primary bg-primary-light bg-opacity-10' : 'border-gray-200 hover:border-primary'}">
                                        <div class="font-semibold">Individual</div>
                                        <div class="text-sm text-gray-500">$${product.price.toLocaleString()} c/u</div>
                                    </button>
                                    <button id="unitBox" 
                                            class="p-3 border-2 rounded-lg text-center transition-all ${this.currentUnit === 'box' ? 'border-primary bg-primary-light bg-opacity-10' : 'border-gray-200 hover:border-primary'}">
                                        <div class="font-semibold">Caja (x${boxQuantity})</div>
                                        <div class="text-sm text-gray-500">$${boxPrice.toLocaleString()} total</div>
                                        <div class="text-xs text-green-600 font-semibold mt-1">Ahorra $${(product.price * boxQuantity - boxPrice).toLocaleString()}</div>
                                    </button>
                                </div>
                            </div>
                        ` : ''}

                        <!-- Cantidad -->
                        <div class="space-y-3">
                            <h3 class="text-lg font-semibold text-gray-900">Cantidad:</h3>
                            <div class="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                                <button id="decreaseQuantity" 
                                        class="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-xl font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        ${this.currentQuantity <= 1 ? 'disabled' : ''}>
                                    -
                                </button>
                                
                                <div class="text-center">
                                    <div id="quantityDisplay" class="text-3xl font-bold text-gray-900">${this.currentQuantity}</div>
                                    <div class="text-sm text-gray-500">${this.currentUnit === 'box' ? `Cajas (${this.currentQuantity * boxQuantity} unidades)` : 'Unidades'}</div>
                                </div>
                                
                                <button id="increaseQuantity" 
                                        class="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-xl font-bold text-gray-600 hover:bg-gray-100 ${product.stock > 0 && (this.currentUnit === 'box' ? this.currentQuantity * boxQuantity < product.stock : this.currentQuantity < product.stock) ? '' : 'disabled:opacity-50 disabled:cursor-not-allowed'}"
                                        ${product.stock > 0 && (this.currentUnit === 'box' ? this.currentQuantity * boxQuantity < product.stock : this.currentQuantity < product.stock) ? '' : 'disabled'}>
                                    +
                                </button>
                            </div>
                            
                            ${product.stock > 0 ? `
                                <p class="text-sm text-gray-500 text-center">
                                    ${this.currentUnit === 'box' ? 
                                        `Máximo: ${Math.floor(product.stock / boxQuantity)} cajas (${product.stock} unidades)` : 
                                        `Máximo: ${product.stock} unidades`
                                    }
                                </p>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <!-- Footer con precio y botón -->
                <div class="border-t p-6 bg-gray-50">
                    <!-- Resumen de precio -->
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            <div class="text-sm text-gray-500">Precio unitario:</div>
                            <div class="text-lg font-bold text-primary">$${unitPrice.toLocaleString()}</div>
                        </div>
                        <div class="text-right">
                            <div class="text-sm text-gray-500">Total:</div>
                            <div id="modalTotalPrice" class="text-2xl font-bold text-primary">$${totalPrice.toLocaleString()}</div>
                        </div>
                    </div>

                    <!-- Botones de acción -->
                    <div class="flex gap-3">
                        <button id="addToCartBtn"
                                class="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                ${product.status === 'available' && product.stock > 0 ? '' : 'disabled'}>
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                            Añadir al carrito
                        </button>
                        
                        <button id="buyNowBtn"
                                class="flex-1 bg-secondary hover:bg-secondary-dark text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                ${product.status === 'available' && product.stock > 0 ? '' : 'disabled'}>
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                            </svg>
                            Comprar ahora
                        </button>
                    </div>
                    
                    ${product.status !== 'available' || product.stock <= 0 ? `
                        <div class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p class="text-sm text-red-700 text-center">
                                ${product.status !== 'available' ? 'Producto no disponible actualmente' : 'Producto agotado'}
                            </p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        // Configurar event listeners dinámicos
        this.setupDynamicEventListeners(hasBoxOption, boxPrice, boxQuantity);
    }

    // ==================== CONFIGURAR EVENT LISTENERS DINÁMICOS ====================
    setupDynamicEventListeners(hasBoxOption, boxPrice, boxQuantity) {
        // Botón cerrar
        document.getElementById('closeModalBtn')?.addEventListener('click', () => this.hide());

        // Cambiar tipo de unidad
        if (hasBoxOption) {
            document.getElementById('unitIndividual')?.addEventListener('click', () => {
                this.currentUnit = 'individual';
                this.updatePricing();
                this.updateUnitButtons();
                this.updateQuantityButtons(boxQuantity);
            });

            document.getElementById('unitBox')?.addEventListener('click', () => {
                this.currentUnit = 'box';
                this.updatePricing();
                this.updateUnitButtons();
                this.updateQuantityButtons(boxQuantity);
            });
        }

        // Cambiar cantidad
        document.getElementById('decreaseQuantity')?.addEventListener('click', () => {
            if (this.currentQuantity > 1) {
                this.currentQuantity--;
                this.updatePricing();
                this.updateQuantityDisplay();
                this.updateQuantityButtons(boxQuantity);
            }
        });

        document.getElementById('increaseQuantity')?.addEventListener('click', () => {
            if (this.currentProduct.stock > 0) {
                const maxQuantity = this.currentUnit === 'box' ? 
                    Math.floor(this.currentProduct.stock / boxQuantity) : 
                    this.currentProduct.stock;
                
                if (this.currentQuantity < maxQuantity) {
                    this.currentQuantity++;
                    this.updatePricing();
                    this.updateQuantityDisplay();
                    this.updateQuantityButtons(boxQuantity);
                }
            }
        });

        // Botón añadir al carrito
        document.getElementById('addToCartBtn')?.addEventListener('click', () => {
            this.addToCart();
        });

        // Botón comprar ahora
        document.getElementById('buyNowBtn')?.addEventListener('click', () => {
            this.buyNow();
        });
    }

    // ==================== ACTUALIZACIONES DINÁMICAS ====================
    updatePricing() {
        if (!this.currentProduct) return;
        
        const product = this.currentProduct;
        const hasBoxOption = product.hasBoxOption || false;
        const boxPrice = product.boxPrice || product.price * 24;
        
        const unitPrice = this.currentUnit === 'box' && hasBoxOption ? boxPrice : product.price;
        const totalPrice = unitPrice * this.currentQuantity;
        
        // Actualizar precio total
        const totalElement = document.getElementById('modalTotalPrice');
        if (totalElement) {
            totalElement.textContent = `$${totalPrice.toLocaleString()}`;
        }
    }

    updateUnitButtons() {
        const individualBtn = document.getElementById('unitIndividual');
        const boxBtn = document.getElementById('unitBox');
        
        if (individualBtn && boxBtn) {
            if (this.currentUnit === 'individual') {
                individualBtn.classList.add('border-primary', 'bg-primary-light', 'bg-opacity-10');
                individualBtn.classList.remove('border-gray-200');
                boxBtn.classList.remove('border-primary', 'bg-primary-light', 'bg-opacity-10');
                boxBtn.classList.add('border-gray-200');
            } else {
                boxBtn.classList.add('border-primary', 'bg-primary-light', 'bg-opacity-10');
                boxBtn.classList.remove('border-gray-200');
                individualBtn.classList.remove('border-primary', 'bg-primary-light', 'bg-opacity-10');
                individualBtn.classList.add('border-gray-200');
            }
        }
    }

    updateQuantityDisplay() {
        const quantityElement = document.getElementById('quantityDisplay');
        if (quantityElement) {
            quantityElement.textContent = this.currentQuantity;
        }
    }

    updateQuantityButtons(boxQuantity) {
        const product = this.currentProduct;
        const decreaseBtn = document.getElementById('decreaseQuantity');
        const increaseBtn = document.getElementById('increaseQuantity');
        
        if (!decreaseBtn || !increaseBtn) return;
        
        // Botón disminuir
        if (this.currentQuantity <= 1) {
            decreaseBtn.disabled = true;
            decreaseBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            decreaseBtn.disabled = false;
            decreaseBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        
        // Botón aumentar
        if (product.stock > 0) {
            const maxQuantity = this.currentUnit === 'box' ? 
                Math.floor(product.stock / boxQuantity) : 
                product.stock;
            
            if (this.currentQuantity >= maxQuantity) {
                increaseBtn.disabled = true;
                increaseBtn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                increaseBtn.disabled = false;
                increaseBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        } else {
            increaseBtn.disabled = true;
            increaseBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }

    // ==================== ACCIONES ====================
    addToCart() {
        if (!this.currentProduct || this.currentProduct.status !== 'available') return;
        
        // Preparar item para el carrito
        const cartItem = {
            id: this.currentProduct.id + (this.currentUnit === 'box' ? '_box' : ''),
            productId: this.currentProduct.id,
            name: this.currentProduct.name,
            price: this.currentUnit === 'box' ? (this.currentProduct.boxPrice || this.currentProduct.price * 24) : this.currentProduct.price,
            quantity: this.currentQuantity,
            unit: this.currentUnit,
            image: this.currentProduct.image,
            maxStock: this.currentProduct.stock
        };
        
        if (this.currentUnit === 'box') {
            cartItem.name += ` (Caja x${this.currentProduct.boxQuantity || 24})`;
            cartItem.boxQuantity = this.currentProduct.boxQuantity || 24;
        }
        
        // Disparar evento para que el carrito maneje la adición
        const event = new CustomEvent('cart:addItem', {
            detail: cartItem,
            bubbles: true
        });
        
        document.dispatchEvent(event);
        
        // Mostrar confirmación
        this.showAddedToCartConfirmation();
        
        // Cerrar modal después de un breve delay
        setTimeout(() => {
            this.hide();
        }, 1000);
    }

    buyNow() {
        // Primero añadir al carrito
        this.addToCart();
        
        // Luego abrir directamente el checkout
        setTimeout(() => {
            const checkoutEvent = new Event('cart:openCheckout');
            document.dispatchEvent(checkoutEvent);
        }, 1100);
    }

    // ==================== CONFIRMACIÓN VISUAL ====================
    showAddedToCartConfirmation() {
        const addBtn = document.getElementById('addToCartBtn');
        if (!addBtn) return;
        
        // Guardar estado original
        const originalText = addBtn.innerHTML;
        const originalBg = addBtn.classList.toString();
        
        // Mostrar confirmación
        addBtn.innerHTML = `
            <svg class="w-5 h-5 animate-spin-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            ¡Añadido!
        `;
        addBtn.classList.remove('bg-primary', 'hover:bg-primary-dark');
        addBtn.classList.add('bg-green-500', 'hover:bg-green-600');
        
        // Restaurar después de 1.5 segundos
        setTimeout(() => {
            addBtn.innerHTML = originalText;
            addBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
            addBtn.classList.add('bg-primary', 'hover:bg-primary-dark');
        }, 1500);
    }

    // ==================== ERROR ====================
    showError() {
        if (!this.modalContent) return;
        
        this.modalContent.innerHTML = `
            <div class="bg-white rounded-2xl p-8 text-center">
                <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Error al cargar el producto</h3>
                <p class="text-gray-600 mb-6">Lo sentimos, no pudimos cargar la información del producto.</p>
                <button id="closeErrorBtn" class="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-colors">
                    Cerrar
                </button>
            </div>
        `;
        
        document.getElementById('closeErrorBtn')?.addEventListener('click', () => this.hide());
    }

    // ==================== OCULTAR MODAL ====================
    hide() {
        this.modal.classList.remove('modal-enter');
        this.modal.classList.add('modal-exit');
        
        setTimeout(() => {
            this.modal.classList.add('hidden');
            this.modal.classList.remove('modal-exit');
            document.body.style.overflow = '';
            this.currentProduct = null;
            this.currentQuantity = 1;
            this.currentUnit = 'individual';
        }, 300);
    }
}

// Exportar singleton
const productModal = new ProductModal();
export default productModal;

// Función global para abrir modal desde HTML
window.showProductModal = function(productId) {
    productModal.show(productId);
};
