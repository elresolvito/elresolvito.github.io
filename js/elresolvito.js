<!-- components/checkout-modal.html -->
<div id="checkoutModal" class="fixed inset-0 bg-black/50 z-[200] hidden flex items-center justify-center p-4" onclick="window.closeCheckoutModal()">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
        
        <!-- Cabecera -->
        <div class="p-6 bg-gradient-to-r from-cuban-green to-cuban-dark text-white rounded-t-2xl">
            <div class="flex justify-between items-center">
                <div>
                    <h3 class="text-2xl font-bold flex items-center gap-2">
                        <i class="fas fa-clipboard-list"></i> Finalizar pedido
                    </h3>
                    <p class="text-sm opacity-90 mt-1">Completa los datos y te contactamos</p>
                </div>
                <button onclick="window.closeCheckoutModal()" class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        
        <div class="p-6">
            <form id="checkoutForm" onsubmit="event.preventDefault(); window.sendCompleteOrder()">
                
                <!-- RESUMEN DEL CARRITO -->
                <div class="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p class="text-sm font-semibold mb-2 flex items-center gap-2">
                        <i class="fas fa-shopping-cart text-cuban-green"></i> Tu pedido:
                    </p>
                    <div id="checkoutCartSummary" class="text-sm text-gray-600 max-h-24 overflow-y-auto space-y-1"></div>
                    <div class="flex justify-between text-base font-bold mt-3 pt-3 border-t border-gray-200">
                        <span>Subtotal:</span>
                        <span id="checkoutTotal" class="text-cuban-green">$0</span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Compra mínima: $500</p>
                </div>

                <!-- DATOS DEL CLIENTE -->
                <div class="mb-6">
                    <h4 class="font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <i class="fas fa-user text-cuban-green"></i> ¿Quién recibe?
                    </h4>
                    
                    <div class="space-y-4">
                        <div>
                            <label for="customerName" class="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                            <input type="text" 
                                   id="customerName" 
                                   required 
                                   placeholder="Ej: María González Pérez"
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cuban-green focus:border-transparent">
                        </div>

                        <div>
                            <label for="customerAddress" class="block text-sm font-medium text-gray-700 mb-1">Dirección completa *</label>
                            <textarea id="customerAddress" 
                                      rows="2" 
                                      required 
                                      placeholder="Ej: Calle Obispo No. 123, entre Mercaderes y San Ignacio, La Habana Vieja"
                                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cuban-green focus:border-transparent"></textarea>
                        </div>
                    </div>
                </div>

                <!-- ZONA DE ENTREGA - ACTUALIZADA -->
                <div class="mb-6">
                    <h4 class="font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <i class="fas fa-map-marker-alt text-cuban-green"></i> ¿Dónde entregamos?
                    </h4>
                    
                    <div class="space-y-3">
                        <!-- La Habana Vieja -->
                        <label class="flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition hover:bg-gray-50 has-[:checked]:border-cuban-green has-[:checked]:bg-cuban-green/5">
                            <input type="radio" name="deliveryZone" value="habana-vieja" checked class="w-5 h-5 text-cuban-green mt-1" onchange="actualizarOpcionesEnvio()">
                            <div class="flex-1">
                                <div class="flex justify-between items-center">
                                    <span class="font-bold text-gray-800">La Habana Vieja</span>
                                    <span class="font-bold text-cuban-green">$300</span>
                                </div>
                                <p class="text-sm text-gray-600 mt-1">Tarifa fija para pedidos de hasta 8 kg. Si excede, se aplica cargo extra.</p>
                            </div>
                        </label>

                        <!-- Otro municipio -->
                        <label class="flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition hover:bg-gray-50 has-[:checked]:border-cuban-green has-[:checked]:bg-cuban-green/5">
                            <input type="radio" name="deliveryZone" value="otro" class="w-5 h-5 text-cuban-green mt-1" onchange="actualizarOpcionesEnvio()">
                            <div class="flex-1">
                                <div class="flex justify-between items-center">
                                    <span class="font-bold text-gray-800">Otro municipio de La Habana</span>
                                    <span class="font-bold text-amber-600">Por distancia</span>
                                </div>
                                <p class="text-sm text-gray-600 mt-1">El costo depende de la distancia. Selecciona abajo.</p>
                            </div>
                        </label>
                    </div>
                    
                    <!-- Selector de distancia (se muestra solo si se selecciona otro municipio) -->
                    <div id="distanceSelector" class="mt-4 hidden">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Distancia aproximada desde La Habana Vieja:</label>
                        <select id="distanceKm" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cuban-green">
                            <option value="0.5">Menos de 1 km - $300</option>
                            <option value="1.5">1 - 2 km - $400</option>
                            <option value="2.5">2 - 3 km - $450</option>
                            <option value="3.5">3 - 4 km - $500</option>
                            <option value="4.5">4 - 5 km - $550</option>
                            <option value="6">+5 km - $550 + $100/km adicional</option>
                        </select>
                    </div>
                </div>

                <!-- PESO APROXIMADO -->
                <div class="mb-6">
                    <h4 class="font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <i class="fas fa-weight-hanging text-cuban-green"></i> Peso aproximado del pedido
                    </h4>
                    <select id="approximateWeight" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cuban-green">
                        <option value="menos-1kg">Menos de 1 kg</option>
                        <option value="1-3kg">1 - 3 kg</option>
                        <option value="3-5kg">3 - 5 kg</option>
                        <option value="5-8kg">5 - 8 kg</option>
                        <option value="mas-8kg">Más de 8 kg (aplica cargo extra)</option>
                    </select>
                    <p class="text-xs text-gray-500 mt-1">* Para La Habana Vieja, tarifa fija de $300 hasta 8 kg.</p>
                </div>

                <!-- ENTREGA EXPRÉS (NUEVO) -->
                <div class="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <label class="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" id="expressDelivery" class="w-5 h-5 text-cuban-green rounded">
                        <div>
                            <span class="font-bold text-blue-800">🚀 Entrega exprés (+$50)</span>
                            <p class="text-xs text-blue-600">Recibe tu pedido en 15 minutos (sujeto a disponibilidad)</p>
                        </div>
                    </label>
                </div>

                <!-- MÉTODO DE PAGO -->
                <div class="mb-6">
                    <h4 class="font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <i class="fas fa-credit-card text-cuban-green"></i> ¿Cómo pagas?
                    </h4>
                    
                    <div class="grid grid-cols-2 gap-3">
                        <label class="flex flex-col items-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition hover:bg-gray-50 has-[:checked]:border-cuban-green has-[:checked]:bg-cuban-green/5">
                            <input type="radio" name="paymentMethod" value="Efectivo" checked class="w-5 h-5 text-cuban-green">
                            <span class="text-2xl">💵</span>
                            <span class="font-medium">Efectivo</span>
                            <span class="text-xs text-gray-500">Pagas al recibir</span>
                        </label>
                        
                        <label class="flex flex-col items-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition hover:bg-gray-50 has-[:checked]:border-cuban-green has-[:checked]:bg-cuban-green/5">
                            <input type="radio" name="paymentMethod" value="Transferencia" class="w-5 h-5 text-cuban-green">
                            <span class="text-2xl">📱</span>
                            <span class="font-medium">Transferencia</span>
                            <span class="text-xs text-gray-500">Sujeto a disponibilidad</span>
                        </label>
                    </div>
                </div>

                <!-- NOTAS ADICIONALES -->
                <div class="mb-6">
                    <label for="customerNotes" class="block text-sm font-medium text-gray-700 mb-1">¿Algo más que debamos saber?</label>
                    <textarea id="customerNotes" 
                              rows="2" 
                              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cuban-green focus:border-transparent"
                              placeholder="Ej: Prefiero que llamen antes de llegar, el edificio es el amarillo, etc."></textarea>
                </div>

                <!-- BOTONES -->
                <div class="flex gap-3 pt-4 border-t border-gray-200">
                    <button type="button" onclick="window.closeCheckoutModal()" class="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition">
                        Cancelar
                    </button>
                    <button type="submit" class="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2 shadow-md">
                        <i class="fab fa-whatsapp"></i> Enviar pedido
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    function actualizarOpcionesEnvio() {
        const otroMunicipio = document.querySelector('input[name="deliveryZone"]:checked')?.value === 'otro';
        const distanceSelector = document.getElementById('distanceSelector');
        if (distanceSelector) {
            distanceSelector.classList.toggle('hidden', !otroMunicipio);
        }
    }
    
    // Inicializar al cargar el modal
    document.addEventListener('DOMContentLoaded', function() {
        const modal = document.getElementById('checkoutModal');
        if (modal) {
            const observer = new MutationObserver(function() {
                if (!modal.classList.contains('hidden')) {
                    actualizarOpcionesEnvio();
                }
            });
            observer.observe(modal, { attributes: true });
        }
    });
</script>
