// assets/js/checkout-flow.js
import CONFIG from '../config/settings.js';

class CheckoutFlow {
    constructor() {
        this.modal = document.getElementById('checkoutModal');
        this.currentStep = 1;
        this.customerData = {};
        this.paymentMethod = '';
        this.cashAmount = '';
        this.shippingLocation = '';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    // ==================== MOSTRAR CHECKOUT ====================
    async show(items, subtotal, shipping) {
        if (!items || items.length === 0) {
            this.showToast('Tu carrito está vacío', 'warning');
            return;
        }

        this.items = items;
        this.subtotal = subtotal;
        this.shipping = shipping;

        // Cargar datos guardados del cliente
        this.loadSavedCustomerData();

        // Renderizar modal
        this.render();

        // Mostrar modal
        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Animar entrada
        setTimeout(() => {
            this.modal.classList.add('modal-enter');
        }, 10);

        // Enfocar primer campo
        setTimeout(() => {
            const firstInput = this.modal.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    // ==================== RENDERIZAR MODAL ====================
    render() {
        if (!this.modal) return;

        const total = this.subtotal + (this.shipping?.fee || 0);

        this.modal.innerHTML = `
            <div class="modal-content bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                <!-- Header -->
                <div class="p-6 border-b flex justify-between items-center">
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900">Finalizar Pedido</h3>
                        <p class="text-sm text-gray-500">Completa los pasos para confirmar tu compra</p>
                    </div>
                    <button id="closeCheckoutModal" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <!-- Progreso -->
                <div class="px-6 py-4 border-b">
                    <div class="flex items-center justify-between">
                        ${[1, 2, 3, 4].map(step => `
                            <div class="flex items-center ${step > 1 ? 'flex-1' : ''}">
                                ${step > 1 ? `
                                    <div class="flex-1 h-1 ${this.currentStep >= step ? 'bg-primary' : 'bg-gray-200'}"></div>
                                ` : ''}
                                <div class="flex flex-col items-center">
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                                        ${this.currentStep >= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}">
                                        ${step}
                                    </div>
                                    <span class="text-xs mt-1 ${this.currentStep >= step ? 'text-primary font-semibold' : 'text-gray-500'}">
                                        ${step === 1 ? 'Resumen' : 
                                          step === 2 ? 'Datos' : 
                                          step === 3 ? 'Pago' : 'Confirmar'}
                                    </span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Contenido por paso -->
                <div class="flex-1 overflow-y-auto">
                    <!-- Paso 1: Resumen -->
                    <div id="step1" class="p-6 ${this.currentStep !== 1 ? 'hidden' : ''}">
                        <h4 class="text-lg font-bold text-gray-900 mb-4">Resumen del Pedido</h4>
                        
                        <!-- Items -->
                        <div class="space-y-3 mb-6">
                            ${this.items.map(item => `
                                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div class="flex-1">
                                        <h5 class="font-semibold text-gray-900">${item.name}</h5>
                                        <p class="text-sm text-gray-500">$${item.price.toLocaleString()} × ${item.quantity}</p>
                                    </div>
                                    <div class="font-semibold">$${(item.price * item.quantity).toLocaleString()}</div>
                                </div>
                            `).join('')}
                        </div>

                        <!-- Totales -->
                        <div class="bg-gray-50 p-4 rounded-lg space-y-2">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Subtotal:</span>
                                <span class="font-semibold">$${this.subtotal.toLocaleString()}</span>
                            </div>
                            
                            <!-- Información de envío -->
                            <div class="flex justify-between">
                                <span class="text-gray-600">Envío (${this.shipping?.range || 'Habana Vieja'}):</span>
                                <span class="font-semibold">
                                    $${this.shipping?.fee?.toLocaleString() || '0'}
                                    ${this.shipping?.discount && this.shipping.discount !== '0%' ? 
                                        `<span class="text-sm text-green-600"> (${this.shipping.discount} off)</span>` : ''}
                                </span>
                            </div>

                            <!-- Ajuste por utilidad mínima -->
                            ${this.calculateMinimumProfitAdjustment() > 0 ? `
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Ajuste de servicio:</span>
                                    <span class="font-semibold">$${this.calculateMinimumProfitAdjustment().toLocaleString()}</span>
                                </div>
                            ` : ''}

                            <hr class="my-2">
                            
                            <div class="flex justify-between text-lg font-bold text-primary">
                                <span>Total a pagar:</span>
                                <span>$${this.calculateFinalPrice().toLocaleString()}</span>
                            </div>
                        </div>

                        <!-- Política de envíos -->
                        <div class="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                            <h5 class="font-semibold text-blue-800 mb-2">📦 Política de Envíos</h5>
                            <ul class="text-sm text-blue-700 space-y-1">
                                <li>• Hasta $2,000: $200 de envío</li>
                                <li>• $2,001 - $5,000: $150 de envío (25% off)</li>
                                <li>• Más de $5,000: $100 de envío (50% off)</li>
                                <li>• Incluye 8% de comisión de servicio</li>
                                <li>• Utilidad mínima garantizada: $300 por pedido</li>
                            </ul>
                        </div>

                        <!-- Botón siguiente -->
                        <button id="nextToStep2" class="w-full mt-6 bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-lg transition-colors">
                            Continuar con mis datos
                        </button>
                    </div>

                    <!-- Paso 2: Datos del cliente -->
                    <div id="step2" class="p-6 ${this.currentStep !== 2 ? 'hidden' : ''}">
                        <h4 class="text-lg font-bold text-gray-900 mb-4">Tus Datos</h4>
                        <p class="text-gray-600 mb-6">Completa tus datos para la entrega</p>

                        <div class="space-y-4">
                            <!-- Nombre -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">
                                    Nombre completo *
                                </label>
                                <input type="text" 
                                       id="customerName" 
                                       value="${this.customerData.name || ''}"
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                       placeholder="Ej: Juan Pérez"
                                       required>
                                <p class="text-xs text-gray-500 mt-1">Nombre y apellidos</p>
                            </div>

                            <!-- Teléfono -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">
                                    Teléfono *
                                </label>
                                <input type="tel" 
                                       id="customerPhone" 
                                       value="${this.customerData.phone || ''}"
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                       placeholder="Ej: 56382909"
                                       required>
                                <p class="text-xs text-gray-500 mt-1">Nos contactaremos por este número</p>
                            </div>

                            <!-- Ubicación -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">
                                    Zona de entrega *
                                </label>
                                <select id="deliveryLocation" 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        required>
                                    <option value="">Selecciona tu zona</option>
                                    <option value="habana-vieja" ${this.customerData.location === 'habana-vieja' ? 'selected' : ''}>
                                        La Habana Vieja (Entrega incluida)
                                    </option>
                                    <option value="centro-habana" ${this.customerData.location === 'centro-habana' ? 'selected' : ''}>
                                        Centro Habana (Tarifa especial)
                                    </option>
                                    <option value="vedado" ${this.customerData.location === 'vedado' ? 'selected' : ''}>
                                        Vedado (Tarifa especial)
                                    </option>
                                    <option value="otros" ${this.customerData.location === 'otros' ? 'selected' : ''}>
                                        Otros municipios (A convenir)
                                    </option>
                                </select>
                                <p class="text-xs text-gray-500 mt-1">Selecciona tu municipio</p>
                            </div>

                            <!-- Dirección -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">
                                    Dirección exacta *
                                </label>
                                <input type="text" 
                                       id="customerAddress" 
                                       value="${this.customerData.address || ''}"
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                       placeholder="Ej: Calle #123 entre A y B"
                                       required>
                                <p class="text-xs text-gray-500 mt-1">Calle, número, entre calles</p>
                            </div>

                            <!-- Referencias -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">
                                    Referencias adicionales
                                </label>
                                <textarea id="customerReferences" 
                                          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                          rows="3"
                                          placeholder="Ej: Edificio azul, puerta roja, timbre #2">${this.customerData.references || ''}</textarea>
                                <p class="text-xs text-gray-500 mt-1">Información útil para el repartidor</p>
                            </div>

                            <!-- Notas especiales -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">
                                    Notas para tu pedido
                                </label>
                                <textarea id="orderNotes" 
                                          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                          rows="2"
                                          placeholder="Ej: Llamar antes de llegar, entregar en portería..."></textarea>
                            </div>
                        </div>

                        <!-- Botones -->
                        <div class="flex gap-3 mt-8">
                            <button id="backToStep1" class="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-6 rounded-lg transition-colors">
                                ← Volver
                            </button>
                            <button id="nextToStep3" class="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors">
                                Continuar al pago
                            </button>
                        </div>
                    </div>

                    <!-- Paso 3: Método de pago -->
                    <div id="step3" class="p-6 ${this.currentStep !== 3 ? 'hidden' : ''}">
                        <h4 class="text-lg font-bold text-gray-900 mb-4">Método de Pago</h4>
                        <p class="text-gray-600 mb-6">Selecciona cómo prefieres pagar</p>

                        <div class="space-y-6">
                            <!-- Opciones de pago -->
                            <div class="space-y-3">
                                <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors">
                                    <input type="radio" 
                                           name="paymentMethod" 
                                           value="efectivo" 
                                           class="h-5 w-5 text-primary"
                                           ${this.paymentMethod === 'efectivo' ? 'checked' : ''}>
                                    <div class="ml-3">
                                        <span class="font-semibold text-gray-900">Efectivo</span>
                                        <p class="text-sm text-gray-500">Paga al recibir tu pedido</p>
                                    </div>
                                </label>

                                <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors">
                                    <input type="radio" 
                                           name="paymentMethod" 
                                           value="transferencia" 
                                           class="h-5 w-5 text-primary"
                                           ${this.paymentMethod === 'transferencia' ? 'checked' : ''}>
                                    <div class="ml-3">
                                        <span class="font-semibold text-gray-900">Transferencia</span>
                                        <p class="text-sm text-gray-500">Banco Metropolitano o Transfermóvil</p>
                                    </div>
                                </label>
                            </div>

                            <!-- Campo para efectivo (se muestra dinámicamente) -->
                            <div id="cashPaymentSection" class="${this.paymentMethod === 'efectivo' ? '' : 'hidden'}">
                                <label class="block text-sm font-semibold text-gray-700 mb-3">
                                    ¿Con cuánto pagarás?
                                </label>
                                <div class="grid grid-cols-3 gap-2">
                                    ${[20, 50, 100, 200, 500, 1000].map(amount => `
                                        <button type="button" 
                                                class="cash-amount-btn p-3 border rounded-lg text-center transition-colors
                                                       ${this.cashAmount === amount.toString() ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:border-primary'}">
                                            $${amount}
                                        </button>
                                    `).join('')}
                                    <button type="button" 
                                            class="cash-amount-btn p-3 border rounded-lg text-center transition-colors col-span-3
                                                   ${this.cashAmount === 'otro' ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:border-primary'}">
                                        Otro monto
                                    </button>
                                </div>
                                
                                <!-- Campo para otro monto -->
                                <div id="otherAmountSection" class="${this.cashAmount === 'otro' ? '' : 'hidden'} mt-3">
                                    <input type="number" 
                                           id="otherCashAmount" 
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                           placeholder="Monto en CUP"
                                           min="1">
                                </div>
                            </div>

                            <!-- Instrucciones para transferencia -->
                            <div id="transferInstructions" class="${this.paymentMethod === 'transferencia' ? '' : 'hidden'} p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <h5 class="font-semibold text-blue-800 mb-2">Instrucciones para transferencia:</h5>
                                <ul class="text-sm text-blue-700 space-y-1">
                                    <li>1. Realiza la transferencia por el monto total</li>
                                    <li>2. Guarda el comprobante</li>
                                    <li>3. Envíanos el comprobante por WhatsApp</li>
                                    <li>4. Te confirmaremos el pago en minutos</li>
                                </ul>
                                <div class="mt-3 text-sm">
                                    <p class="font-semibold">Banco: <span class="font-normal">Metropolitano</span></p>
                                    <p class="font-semibold">Tarjeta: <span class="font-normal">9205 1234 5678 9012</span></p>
                                    <p class="font-semibold">Nombre: <span class="font-normal">Mercado Bayona</span></p>
                                </div>
                            </div>

                            <!-- Resumen final -->
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <h5 class="font-semibold text-gray-900 mb-3">Resumen de tu pedido</h5>
                                <div class="space-y-2">
                                    <div class="flex justify-between text-sm">
                                        <span>Productos:</span>
                                        <span>$${this.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span>Envío:</span>
                                        <span>$${this.shipping?.fee?.toLocaleString() || '0'}</span>
                                    </div>
                                    ${this.calculateMinimumProfitAdjustment() > 0 ? `
                                        <div class="flex justify-between text-sm">
                                            <span>Ajuste de servicio:</span>
                                            <span>$${this.calculateMinimumProfitAdjustment().toLocaleString()}</span>
                                        </div>
                                    ` : ''}
                                    <hr class="my-2">
                                    <div class="flex justify-between font-bold text-primary">
                                        <span>Total:</span>
                                        <span>$${this.calculateFinalPrice().toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Botones -->
                        <div class="flex gap-3 mt-8">
                            <button id="backToStep2" class="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-6 rounded-lg transition-colors">
                                ← Volver
                            </button>
                            <button id="confirmOrderBtn" class="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors">
                                Confirmar pedido
                            </button>
                        </div>
                    </div>

                    <!-- Paso 4: Confirmación (se muestra después de enviar) -->
                    <div id="step4" class="p-6 text-center hidden">
                        <div class="mb-6">
                            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                            </div>
                            <h4 class="text-2xl font-bold text-gray-900 mb-2">¡Pedido Confirmado!</h4>
                            <p class="text-gray-600">Tu pedido ha sido enviado correctamente</p>
                        </div>

                        <div class="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                            <h5 class="font-semibold text-gray-900 mb-3">Detalles del pedido:</h5>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span>Número de pedido:</span>
                                    <span class="font-mono font-bold">#${Date.now().toString().slice(-6)}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Total:</span>
                                    <span class="font-bold">$${this.calculateFinalPrice().toLocaleString()}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Método:</span>
                                    <span>${this.paymentMethod === 'efectivo' ? 'Efectivo' : 'Transferencia'}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Entrega:</span>
                                    <span>${this.getLocationText(this.shippingLocation)}</span>
                                </div>
                            </div>
                        </div>

                        <p class="text-gray-600 mb-6">
                            Te contactaremos por WhatsApp en los próximos minutos para coordinar la entrega.
                        </p>

                        <div class="space-y-3">
                            <a id="whatsappContactBtn" 
                               class="block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                                Abrir WhatsApp ahora
                            </a>
                            <button id="closeCheckoutSuccess" class="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-6 rounded-lg transition-colors">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Configurar event listeners
        this.setupEventListeners();
    }

    // ==================== CÁLCULOS ====================
    calculateMinimumProfitAdjustment() {
        const subtotal = this.subtotal;
        const shippingFee = this.shipping?.fee || 0;
        const serviceFee = subtotal * CONFIG.shipping.serviceFee;
        
        const currentProfit = serviceFee + shippingFee;
        const minimumProfit = CONFIG.shipping.minProfit;
        
        if (currentProfit < minimumProfit) {
            return minimumProfit - currentProfit;
        }
        
        return 0;
    }

    calculateFinalPrice() {
        const subtotal = this.subtotal;
        const shippingFee = this.shipping?.fee || 0;
        const adjustment = this.calculateMinimumProfitAdjustment();
        
        return subtotal + shippingFee + adjustment;
    }

    getLocationText(location) {
        const locations = {
            'habana-vieja': 'La Habana Vieja (Entrega incluida)',
            'centro-habana': 'Centro Habana (Tarifa especial)',
            'vedado': 'Vedado (Tarifa especial)',
            'otros': 'Otros municipios (A convenir)'
        };
        
        return locations[location] || 'Por definir';
    }

    // ==================== DATOS DEL CLIENTE ====================
    loadSavedCustomerData() {
        try {
            const saved = localStorage.getItem('mercadoBayona_customer');
            if (saved) {
                this.customerData = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error cargando datos del cliente:', error);
        }
    }

    saveCustomerData() {
        try {
            const data = {
                name: document.getElementById('customerName')?.value || '',
                phone: document.getElementById('customerPhone')?.value || '',
                address: document.getElementById('customerAddress')?.value || '',
                references: document.getElementById('customerReferences')?.value || '',
                location: document.getElementById('deliveryLocation')?.value || '',
                lastUpdated: Date.now()
            };
            
            localStorage.setItem('mercadoBayona_customer', JSON.stringify(data));
            this.customerData = data;
            
        } catch (error) {
            console.error('Error guardando datos del cliente:', error);
        }
    }

    // ==================== VALIDACIÓN ====================
    validateStep2() {
        const requiredFields = [
            'customerName',
            'customerPhone',
            'deliveryLocation',
            'customerAddress'
        ];
        
        let isValid = true;
        let firstErrorField = null;
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field) return;
            
            const value = field.value.trim();
            const isFieldValid = value !== '';
            
            // Actualizar estilo del campo
            field.classList.toggle('border-red-500', !isFieldValid);
            field.classList.toggle('focus:ring-red-500', !isFieldValid);
            
            if (!isFieldValid && !firstErrorField) {
                firstErrorField = field;
                isValid = false;
            }
        });
        
        if (!isValid && firstErrorField) {
            firstErrorField.focus();
            this.showToast('Por favor completa todos los campos obligatorios', 'warning');
        }
        
        return isValid;
    }

    validateStep3() {
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
        
        if (!paymentMethod) {
            this.showToast('Por favor selecciona un método de pago', 'warning');
            return false;
        }
        
        this.paymentMethod = paymentMethod.value;
        
        if (this.paymentMethod === 'efectivo') {
            if (!this.cashAmount || this.cashAmount === '') {
                this.showToast('Por favor selecciona el monto con el que pagarás', 'warning');
                return false;
            }
            
            if (this.cashAmount === 'otro') {
                const otherAmount = document.getElementById('otherCashAmount')?.value;
                if (!otherAmount || parseFloat(otherAmount) <= 0) {
                    this.showToast('Por favor ingresa un monto válido', 'warning');
                    return false;
                }
                this.cashAmount = otherAmount;
            }
        }
        
        return true;
    }

    // ==================== EVENT LISTENERS ====================
    setupEventListeners() {
        // Cerrar modal
        document.addEventListener('click', (e) => {
            if (e.target.id === 'closeCheckoutModal') {
                this.hide();
            }
            
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
        
        // Event listeners dinámicos se configuran en render()
    }

    setupDynamicEventListeners() {
        // Navegación entre pasos
        document.getElementById('nextToStep2')?.addEventListener('click', () => {
            this.goToStep(2);
        });
        
        document.getElementById('backToStep1')?.addEventListener('click', () => {
            this.goToStep(1);
        });
        
        document.getElementById('nextToStep3')?.addEventListener('click', () => {
            if (this.validateStep2()) {
                this.saveCustomerData();
                this.goToStep(3);
            }
        });
        
        document.getElementById('backToStep2')?.addEventListener('click', () => {
            this.goToStep(2);
        });
        
        // Método de pago
        document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.paymentMethod = e.target.value;
                
                // Mostrar/ocultar secciones según método
                const cashSection = document.getElementById('cashPaymentSection');
                const transferSection = document.getElementById('transferInstructions');
                
                if (cashSection && transferSection) {
                    if (this.paymentMethod === 'efectivo') {
                        cashSection.classList.remove('hidden');
                        transferSection.classList.add('hidden');
                    } else if (this.paymentMethod === 'transferencia') {
                        cashSection.classList.add('hidden');
                        transferSection.classList.remove('hidden');
                    }
                }
            });
        });
        
        // Botones de monto en efectivo
        document.querySelectorAll('.cash-amount-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const amount = e.target.textContent.trim();
                
                // Quitar selección previa
                document.querySelectorAll('.cash-amount-btn').forEach(b => {
                    b.classList.remove('bg-primary', 'text-white', 'border-primary');
                    b.classList.add('border-gray-300');
                });
                
                // Seleccionar nuevo
                e.target.classList.remove('border-gray-300');
                e.target.classList.add('bg-primary', 'text-white', 'border-primary');
                
                // Manejar "otro monto"
                if (amount === 'Otro monto') {
                    this.cashAmount = 'otro';
                    document.getElementById('otherAmountSection')?.classList.remove('hidden');
                } else {
                    this.cashAmount = amount.replace('$', '');
                    document.getElementById('otherAmountSection')?.classList.add('hidden');
                }
            });
        });
        
        // Confirmar pedido
        document.getElementById('confirmOrderBtn')?.addEventListener('click', () => {
            if (this.validateStep3()) {
                this.confirmOrder();
            }
        });
        
        // WhatsApp después de confirmar
        document.getElementById('whatsappContactBtn')?.addEventListener('click', () => {
            this.openWhatsApp();
        });
        
        // Cerrar después de éxito
        document.getElementById('closeCheckoutSuccess')?.addEventListener('click', () => {
            this.hide();
            window.location.reload(); // Recargar para limpiar carrito
        });
    }

    // ==================== NAVEGACIÓN ====================
    goToStep(step) {
        this.currentStep = step;
        this.render();
    }

    // ==================== CONFIRMAR PEDIDO ====================
    async confirmOrder() {
        try {
            // Mostrar loading
            const confirmBtn = document.getElementById('confirmOrderBtn');
            if (confirmBtn) {
                const originalText = confirmBtn.innerHTML;
                confirmBtn.innerHTML = `
                    <svg class="animate-spin-medium w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    Procesando...
                `;
                confirmBtn.disabled = true;
            }
            
            // Recolectar datos
            const orderData = {
                orderId: `MB-${Date.now().toString().slice(-8)}`,
                timestamp: new Date().toISOString(),
                customer: {
                    name: document.getElementById('customerName')?.value || '',
                    phone: document.getElementById('customerPhone')?.value || '',
                    address: document.getElementById('customerAddress')?.value || '',
                    references: document.getElementById('customerReferences')?.value || '',
                    location: document.getElementById('deliveryLocation')?.value || '',
                    notes: document.getElementById('orderNotes')?.value || ''
                },
                items: this.items,
                totals: {
                    subtotal: this.subtotal,
                    shipping: this.shipping?.fee || 0,
                    adjustment: this.calculateMinimumProfitAdjustment(),
                    total: this.calculateFinalPrice()
                },
                payment: {
                    method: this.paymentMethod,
                    cashAmount: this.paymentMethod === 'efectivo' ? this.cashAmount : null
                },
                shipping: this.shipping
            };
            
            // 1. Guardar en Google Sheets (si está configurado)
            await this.saveToGoogleSheets(orderData);
            
            // 2. Preparar mensaje para WhatsApp
            const whatsappMessage = this.generateWhatsAppMessage(orderData);
            
            // 3. Mostrar paso de confirmación
            this.goToStep(4);
            
            // 4. Configurar botón de WhatsApp
            const whatsappBtn = document.getElementById('whatsappContactBtn');
            if (whatsappBtn) {
                whatsappBtn.href = `https://wa.me/${CONFIG.business.phone}?text=${encodeURIComponent(whatsappMessage)}`;
                whatsappBtn.target = '_blank';
            }
            
            // 5. Limpiar carrito después de 5 segundos
            setTimeout(() => {
                document.dispatchEvent(new Event('cart:clear'));
            }, 5000);
            
            // 6. Mostrar notificación
            this.showToast('Pedido confirmado exitosamente', 'success');
            
        } catch (error) {
            console.error('Error confirmando pedido:', error);
            this.showToast('Error al confirmar el pedido. Por favor intenta nuevamente.', 'error');
            
            // Restaurar botón
            const confirmBtn = document.getElementById('confirmOrderBtn');
            if (confirmBtn) {
                confirmBtn.innerHTML = 'Confirmar pedido';
                confirmBtn.disabled = false;
            }
        }
    }

    // ==================== GOOGLE SHEETS ====================
    async saveToGoogleSheets(orderData) {
        if (!CONFIG.urls.googleScript) {
            console.log('No hay URL de Google Script configurada');
            return;
        }
        
        try {
            const formData = new FormData();
            
            // Convertir datos a formato plano para Google Sheets
            const flatData = {
                id_pedido: orderData.orderId,
                fecha: new Date().toLocaleString('es-CU'),
                cliente: orderData.customer.name,
                telefono: orderData.customer.phone,
                direccion: `${orderData.customer.address} ${orderData.customer.references}`,
                zona: this.getLocationText(orderData.customer.location),
                productos: orderData.items.map(item => `${item.quantity}x ${item.name}`).join(', '),
                subtotal: orderData.totals.subtotal,
                envio: orderData.totals.shipping,
                ajuste: orderData.totals.adjustment,
                total: orderData.totals.total,
                metodo_pago: orderData.payment.method === 'efectivo' ? 'Efectivo' : 'Transferencia',
                monto_efectivo: orderData.payment.cashAmount || '',
                notas: orderData.customer.notes || ''
            };
            
            // Agregar campos al FormData
            Object.entries(flatData).forEach(([key, value]) => {
                formData.append(key, value);
            });
            
            // Enviar a Google Apps Script
            const response = await fetch(CONFIG.urls.googleScript, {
                method: 'POST',
                mode: 'no-cors', // Google Apps Script requiere no-cors
                body: formData
            });
            
            console.log('Pedido guardado en Google Sheets');
            
        } catch (error) {
            console.error('Error guardando en Google Sheets:', error);
            // Continuar aunque falle Google Sheets
        }
    }

    // ==================== MENSAJE WHATSAPP ====================
    generateWhatsAppMessage(orderData) {
        const itemsText = orderData.items.map(item => 
            `• ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toLocaleString()}`
        ).join('\n');
        
        const locationText = this.getLocationText(orderData.customer.location);
        const paymentText = orderData.payment.method === 'efectivo' 
            ? `Efectivo (pagaré con $${orderData.payment.cashAmount})`
            : 'Transferencia';
        
        // Mensaje según rango de envío
        let shippingMessage = "";
        if (orderData.shipping.discount === "25%") {
            shippingMessage = `⭐ *¡DESCUENTO EN ENVÍO!* Solo $${orderData.shipping.fee} (ahorras $50)`;
        } else if (orderData.shipping.discount === "50%") {
            shippingMessage = `🎯 *¡ENVÍO A MEDIO PRECIO!* Solo $${orderData.shipping.fee} (50% off)`;
        } else {
            shippingMessage = `🚚 Envío: $${orderData.shipping.fee}`;
        }
        
        return `✅ *PEDIDO CONFIRMADO - MERCADO BAYONA*

🆔 *Número de pedido:* ${orderData.orderId}
📅 *Fecha:* ${new Date().toLocaleString('es-CU')}

👤 *CLIENTE:*
• Nombre: ${orderData.customer.name}
• Teléfono: ${orderData.customer.phone}
• Dirección: ${orderData.customer.address}
${orderData.customer.references ? `• Referencias: ${orderData.customer.references}\n` : ''}

🛒 *PRODUCTOS:*
${itemsText}

💰 *TOTALES:*
• Subtotal: $${orderData.totals.subtotal.toLocaleString()}
• ${shippingMessage}
${orderData.totals.adjustment > 0 ? `• Ajuste servicio: $${orderData.totals.adjustment.toLocaleString()}\n` : ''}
• *TOTAL A PAGAR: $${orderData.totals.total.toLocaleString()}*

💳 *PAGO:* ${paymentText}
📍 *ENTREGA:* ${locationText}
${orderData.customer.notes ? `📝 *NOTAS:* ${orderData.customer.notes}\n` : ''}

*Este pedido fue generado automáticamente desde la web de Mercado Bayona.*`;
    }

    // ==================== WHATSAPP ====================
    openWhatsApp() {
        const phone = CONFIG.business.phone.replace('+', '');
        const message = `Hola, acabo de hacer un pedido en Mercado Bayona. ¿Podrían confirmar?`;
        
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    }

    // ==================== UTILIDADES ====================
    showToast(message, type = 'info') {
        // Similar al toast de cart-system.js
        const toast = document.createElement('div');
        toast.className = `fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 transition-all transform translate-y-0
                          ${type === 'success' ? 'bg-green-500 text-white' : 
                            type === 'error' ? 'bg-red-500 text-white' : 
                            'bg-gray-800 text-white'}`;
        toast.innerHTML = `
            <div class="flex items-center gap-2">
                ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ️'}
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('translate-y-10', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ==================== OCULTAR MODAL ====================
    hide() {
        this.modal.classList.remove('modal-enter');
        this.modal.classList.add('modal-exit');
        
        setTimeout(() => {
            this.modal.classList.add('hidden');
            this.modal.classList.remove('modal-exit');
            document.body.style.overflow = '';
            
            // Resetear estado
            this.currentStep = 1;
            this.customerData = {};
            this.paymentMethod = '';
            this.cashAmount = '';
            this.shippingLocation = '';
        }, 300);
    }
}

// Exportar singleton
const checkoutFlow = new CheckoutFlow();
export default checkoutFlow;

// Escuchar evento para abrir checkout
document.addEventListener('checkout:open', (e) => {
    checkoutFlow.show(e.detail.items, e.detail.subtotal, e.detail.shipping);
});
