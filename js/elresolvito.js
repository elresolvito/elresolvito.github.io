// ============================================
// PRODUCTOS (BASE DE DATOS)
// ============================================
var PRODUCTS = [
    { id: 1, nombre: "Atún en lata", categoria: "Alimentos y conservas", precio: 540, imagen: "https://i.postimg.cc/76xHK6zt/atun_precio_500.png", descripcion: "Lata 200g" },
    { id: 2, nombre: "Pasta de tomate", categoria: "Alimentos y conservas", precio: 350, imagen: "https://i.postimg.cc/gjjYPTNv/pasta_tomate_precio_350.png", descripcion: "Paquete" },
    { id: 3, nombre: "Pimiento fresco", categoria: "Alimentos y conservas", precio: 750, imagen: "https://i.postimg.cc/4yyJTSBj/pimiento_presio_750.png", descripcion: "Unidad" },
    { id: 4, nombre: "Café Dualis 250g", categoria: "Alimentos y conservas", precio: 1450, imagen: "https://i.postimg.cc/WbZBX2hN/cafe_dualis_250_g_precio_1450.png", descripcion: "Paquete 250g" },
    { id: 5, nombre: "Café Dufiltro 250g", categoria: "Alimentos y conservas", precio: 1450, imagen: "https://i.postimg.cc/hG26fv31/cafe_Dufiltro_250_g_precio_1450.png", descripcion: "Paquete 250g" },
    { id: 6, nombre: "Café Enepa", categoria: "Alimentos y conservas", precio: 470, imagen: "https://i.postimg.cc/nhY6f04N/cafe_enepa_precio_450.png", descripcion: "Paquete" },
    { id: 7, nombre: "Cartón de huevo 30u", categoria: "Alimentos y conservas", precio: 3000, imagen: "https://i.postimg.cc/sDWkwVvv/carton_de_huevo_30_u_precio_3000.png", descripcion: "Cartón" },
    { id: 8, nombre: "Leche condensada", categoria: "Alimentos y conservas", precio: 950, imagen: "https://i.postimg.cc/tT2XwjtT/leche_condensada.png", descripcion: "Lata 397g" },
    { id: 9, nombre: "Harina blanca 1Kg", categoria: "Alimentos y conservas", precio: 600, imagen: "https://i.postimg.cc/3xc2NHFB/harina_blanca1_kg.png", descripcion: "Paquete 1Kg" },
    { id: 10, nombre: "Chicoticos Pelly 90g", categoria: "Snacks y golosinas", precio: 400, imagen: "https://i.postimg.cc/1zv2fXjZ/chicoticos_pelly_90_g_precio_400.png", descripcion: "Paquete 90g" },
    { id: 11, nombre: "Papitas Campesinas", categoria: "Snacks y golosinas", precio: 690, imagen: "https://i.postimg.cc/cLgrDtf9/papitas_campesinas_precio_690.png", descripcion: "Paquete" },
    { id: 12, nombre: "Pelly Jamón", categoria: "Snacks y golosinas", precio: 580, imagen: "https://i.postimg.cc/pdQV7frX/pelly_jamon_precio_580.png", descripcion: "Paquete" },
    { id: 13, nombre: "Mayonesa Mediana", categoria: "Salsas", precio: 850, imagen: "https://i.postimg.cc/KzJZw2rR/mayonesa_precio_850.png", descripcion: "Frasco mediano" },
    { id: 14, nombre: "Mayonesa Grande", categoria: "Salsas", precio: 1100, imagen: "https://i.postimg.cc/Px2t9jzz/mayonesa_precio1100.png", descripcion: "Frasco grande" },
    { id: 15, nombre: "Cuchilla de Afeitar", categoria: "Higiene personal", precio: 100, imagen: "https://i.postimg.cc/8CdkdW7x/cuchilla_de_afeitar_precio_100.png", descripcion: "Unidad" },
    { id: 16, nombre: "Jabón Marwa", categoria: "Higiene personal", precio: 150, imagen: "https://i.postimg.cc/3RK8tRpR/jabon_marwa_precio_150.png", descripcion: "Pastilla" },
    { id: 17, nombre: "Papel Sanitario", categoria: "Higiene personal", precio: 490, imagen: "https://i.postimg.cc/bwW289qD/papel_sanitario_precio_490i.png", descripcion: "Paquete" },
    { id: 18, nombre: "Toallas Sanitarias", categoria: "Higiene personal", precio: 450, imagen: "https://i.postimg.cc/KjjZyH0b/toallas_sanitarias_precio_450.png", descripcion: "Paquete" },
    { id: 19, nombre: "Toallas Húmedas", categoria: "Higiene personal", precio: 690, imagen: "https://i.postimg.cc/W4ZSP3cw/toallas_humedas_precio_690.png", descripcion: "Paquete" },
    { id: 20, nombre: "Jabón de Lavar", categoria: "Aseo del hogar", precio: 250, imagen: "https://i.postimg.cc/V6YfK6Mz/jabon_de_lavar_precio_250.png", descripcion: "Pastilla" },
    { id: 21, nombre: "Perfume Candy", categoria: "Perfumes y desodorantes", precio: 3100, imagen: "https://i.postimg.cc/vTgJRyhp/perfume_candy_precio_3100.png", descripcion: "Frasco 50ml" },
    { id: 22, nombre: "Perfume genérico", categoria: "Perfumes y desodorantes", precio: 3100, imagen: "https://i.postimg.cc/ZKrT0PPG/perfume_precio_3100.png", descripcion: "Frasco 50ml" },
    { id: 23, nombre: "Perfume Q", categoria: "Perfumes y desodorantes", precio: 3100, imagen: "https://i.postimg.cc/CL03P3Dn/perfume_q_precio_3100.png", descripcion: "Frasco 50ml" },
    { id: 24, nombre: "Desodorante Obao", categoria: "Perfumes y desodorantes", precio: 1100, imagen: "https://i.postimg.cc/PxtXSxD2/desodorante_obao_precio_1100.png", descripcion: "Spray/Roll-on" },
    { id: 25, nombre: "Desodorante Rush Blanco", categoria: "Perfumes y desodorantes", precio: 1000, imagen: "https://i.postimg.cc/FR9rTRS8/desodorante_rush_blanco_precio_1000.png", descripcion: "Roll-on" },
    { id: 26, nombre: "Desodorante Rush", categoria: "Perfumes y desodorantes", precio: 1000, imagen: "https://i.postimg.cc/sXVjTXSF/desodorante_rush_precio_1000.png", descripcion: "Spray" },
    { id: 27, nombre: "Colonia Niña", categoria: "Perfumes y desodorantes", precio: 1100, imagen: "https://i.postimg.cc/G3v04rsM/colonia_nina.png", descripcion: "Botella 100ml" },
    { id: 28, nombre: "Macarrones", categoria: "Pastas y fideos", precio: 300, imagen: "https://i.postimg.cc/Hsmz1H69/macarrones_precio_300.png", descripcion: "Paquete" },
    { id: 29, nombre: "Sopas instantáneas", categoria: "Pastas y fideos", precio: 160, imagen: "https://i.postimg.cc/FzNTpQqK/sopas_instantaneas_precio_160.png", descripcion: "Paquete" },
    { id: 30, nombre: "Licor de fresa", categoria: "Bebidas alcohólicas y malta", precio: 2500, imagen: "https://i.postimg.cc/59YT2x5p/licor_de_fresa_precio_2500.png", descripcion: "Botella" },
    { id: 31, nombre: "Licor Cocobay", categoria: "Bebidas alcohólicas y malta", precio: 2500, imagen: "https://i.postimg.cc/7ZDW90Fz/locor_cocobay_precio_2500.png", descripcion: "Botella" },
    { id: 32, nombre: "Whisky Spirit 200ml", categoria: "Bebidas alcohólicas y malta", precio: 320, imagen: "https://i.postimg.cc/4N8W6q1t/tea_precio_320.png", descripcion: "Botella 200ml" },
    { id: 33, nombre: "Whisky 1L", categoria: "Bebidas alcohólicas y malta", precio: 1350, imagen: "https://i.postimg.cc/cLyrb4T0/whisky_1L_precio_1350.png", descripcion: "Botella 1L" },
    { id: 34, nombre: "Whisky Sir Albin", categoria: "Bebidas alcohólicas y malta", precio: 550, imagen: "https://i.postimg.cc/y84kbYnC/whisky_sir_albin_precio_550.png", descripcion: "Botella pequeña" },
    { id: 35, nombre: "Vino Pluvium", categoria: "Bebidas alcohólicas y malta", precio: 1200, imagen: "https://i.postimg.cc/XNLLWmmx/vino_pluvium_precio_1200.png", descripcion: "Botella" },
    { id: 36, nombre: "Baterías Triple A", categoria: "Electrónicos y accesorios", precio: 300, imagen: "https://i.postimg.cc/DZ2vxZsT/Gemini_Generated_Image_824rio824rio824r.png", descripcion: "Pack 4 unidades" }
];

var FEATURED_PRODUCTS = [
    PRODUCTS.find(p => p.id === 4),
    PRODUCTS.find(p => p.id === 7),
    PRODUCTS.find(p => p.id === 1),
    PRODUCTS.find(p => p.id === 13),
    PRODUCTS.find(p => p.id === 21),
    PRODUCTS.find(p => p.id === 30),
    PRODUCTS.find(p => p.id === 17),
    PRODUCTS.find(p => p.id === 9)
];

// ============================================
// CONFIGURACIÓN DE MENSAJERÍA
// ============================================
const MENSAJERIA_CONFIG = {
    // Tarifa fija para La Habana Vieja (solo si peso <= 8kg)
    HABANA_VIEJA_TARIFA: 300,
    PESO_MAXIMO_HABANA_VIEJA: 8, // kg
    
    // Tarifas por distancia (para otros municipios)
    TARIFAS_DISTANCIA: [
        { maxKm: 1, precio: 300 },
        { maxKm: 2, precio: 400 },
        { maxKm: 3, precio: 450 },
        { maxKm: 4, precio: 500 },
        { maxKm: 5, precio: 550 }
    ],
    PRECIO_POR_KM_ADICIONAL: 100,
    
    // Extras
    EXPRES_EXTRA: 50, // Pedido exprés en 15 min
    CARGO_PESO_EXCEDIDO: 100 // por kg adicional sobre 8kg
};

function calcularTarifaMensajeria(distanciaKm, pesoKg, esExpres = false, esHabanaVieja = false) {
    let precioBase = 0;
    
    if (esHabanaVieja) {
        // Tarifa especial para La Habana Vieja
        if (pesoKg <= MENSAJERIA_CONFIG.PESO_MAXIMO_HABANA_VIEJA) {
            precioBase = MENSAJERIA_CONFIG.HABANA_VIEJA_TARIFA;
        } else {
            // Si excede el peso, se calcula por distancia normal + cargo extra
            precioBase = calcularTarifaPorDistancia(distanciaKm);
            const excesoPeso = pesoKg - MENSAJERIA_CONFIG.PESO_MAXIMO_HABANA_VIEJA;
            precioBase += excesoPeso * MENSAJERIA_CONFIG.CARGO_PESO_EXCEDIDO;
        }
    } else {
        precioBase = calcularTarifaPorDistancia(distanciaKm);
    }
    
    if (esExpres) {
        precioBase += MENSAJERIA_CONFIG.EXPRES_EXTRA;
    }
    
    return precioBase;
}

function calcularTarifaPorDistancia(distanciaKm) {
    for (const tramo of MENSAJERIA_CONFIG.TARIFAS_DISTANCIA) {
        if (distanciaKm <= tramo.maxKm) {
            return tramo.precio;
        }
    }
    // Para distancias mayores a 5km
    const extra = Math.ceil(distanciaKm - 5);
    return MENSAJERIA_CONFIG.TARIFAS_DISTANCIA[MENSAJERIA_CONFIG.TARIFAS_DISTANCIA.length - 1].precio + 
           (extra * MENSAJERIA_CONFIG.PRECIO_POR_KM_ADICIONAL);
}

// ============================================
// CARRITO Y FUNCIONES PRINCIPALES
// ============================================
(function() {
    'use strict';
    
    let cart = JSON.parse(localStorage.getItem('elResolvitoCart')) || [];
    const WHATSAPP_NUMBER = '5356382909';
    const MINIMUM_PURCHASE = 500;
    const SHIPPING_COST_HABANA_VIEJA = 300; // Actualizado a 300

    // ... (resto de funciones anteriores se mantienen igual)

    // Actualizar la función sendCompleteOrder con las nuevas tarifas
    window.sendCompleteOrder = function() {
        if (cart.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        const customerName = document.getElementById('customerName')?.value.trim();
        const customerAddress = document.getElementById('customerAddress')?.value.trim();
        const deliveryZone = document.querySelector('input[name="deliveryZone"]:checked')?.value;
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
        const pesoSeleccionado = document.getElementById('approximateWeight')?.value || '';
        const esExpres = document.getElementById('expressDelivery')?.checked || false;
        const notes = document.getElementById('customerNotes')?.value.trim() || '';

        if (!customerName || !customerAddress || !deliveryZone || !paymentMethod) {
            showToast('⚠️ Completa todos los campos obligatorios', 'warning');
            return;
        }

        const subtotal = cart.reduce((sum, item) => sum + (item.precio * (item.cantidad || 0)), 0);
        if (subtotal < MINIMUM_PURCHASE) {
            showToast(`⚠️ Mínimo de compra: $${MINIMUM_PURCHASE}`, 'warning');
            return;
        }

        // Calcular peso total aproximado del carrito
        const pesoTotal = calcularPesoCarrito();
        const esHabanaVieja = deliveryZone === 'habana-vieja';
        
        let costoEnvio = 0;
        let mensajeEnvio = '';

        if (esHabanaVieja && pesoTotal <= MENSAJERIA_CONFIG.PESO_MAXIMO_HABANA_VIEJA) {
            costoEnvio = MENSAJERIA_CONFIG.HABANA_VIEJA_TARIFA;
            mensajeEnvio = `$${costoEnvio} (La Habana Vieja - peso ${pesoTotal}kg ≤ ${MENSAJERIA_CONFIG.PESO_MAXIMO_HABANA_VIEJA}kg)`;
        } else if (esHabanaVieja && pesoTotal > MENSAJERIA_CONFIG.PESO_MAXIMO_HABANA_VIEJA) {
            // Calcular por distancia (asumimos 0-1km dentro de Habana Vieja)
            costoEnvio = calcularTarifaPorDistancia(1);
            const exceso = pesoTotal - MENSAJERIA_CONFIG.PESO_MAXIMO_HABANA_VIEJA;
            costoEnvio += exceso * MENSAJERIA_CONFIG.CARGO_PESO_EXCEDIDO;
            mensajeEnvio = `$${costoEnvio} (La Habana Vieja - peso excede ${MENSAJERIA_CONFIG.PESO_MAXIMO_HABANA_VIEJA}kg, +$${MENSAJERIA_CONFIG.CARGO_PESO_EXCEDIDO}/kg extra)`;
        } else {
            // Para otros municipios, usar el selector de distancia
            const distancia = document.getElementById('distanceKm')?.value;
            if (distancia) {
                costoEnvio = calcularTarifaPorDistancia(parseFloat(distancia));
                mensajeEnvio = `$${costoEnvio} (${distancia} km)`;
            } else {
                mensajeEnvio = 'A convenir (fuera de La Habana Vieja)';
            }
        }

        if (esExpres) {
            costoEnvio += MENSAJERIA_CONFIG.EXPRES_EXTRA;
            mensajeEnvio += ' + $50 (Entrega exprés 15min)';
        }

        let mensaje = "🛒 *NUEVO PEDIDO - EL RESOLVITO*\n\n";
        mensaje += "*PRODUCTOS:*\n";
        cart.forEach(item => {
            mensaje += `• ${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString()}\n`;
        });

        mensaje += `\n📦 *Peso estimado:* ${pesoTotal} kg`;
        mensaje += `\n*Subtotal:* $${subtotal.toLocaleString()}`;
        mensaje += `\n*Envío:* ${mensajeEnvio}`;
        mensaje += `\n*Total:* $${(subtotal + costoEnvio).toLocaleString()}`;

        mensaje += `\n\n*DATOS DEL CLIENTE*`;
        mensaje += `\n👤 *Nombre:* ${customerName}`;
        mensaje += `\n📍 *Dirección:* ${customerAddress}`;
        mensaje += `\n💳 *Pago propuesto:* ${paymentMethod}`;
        mensaje += `\n🚀 *Entrega exprés:* ${esExpres ? 'Sí (+$50)' : 'No'}`;

        if (notes) {
            mensaje += `\n📝 *Notas:* ${notes}`;
        }

        mensaje += `\n\n_Te contactaremos para confirmar disponibilidad y coordinar la entrega._`;

        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`, '_blank');

        window.closeCheckoutModal();
        if (document.getElementById('cartSidebar')?.classList.contains('cart-open')) {
            window.toggleCart();
        }
        
        showToast('✅ Pedido enviado por WhatsApp. Te contactaremos pronto.', 'success');
    };

    function calcularPesoCarrito() {
        // Estimación básica de peso por producto
        let pesoTotal = 0;
        cart.forEach(item => {
            // Asignar peso estimado según el tipo de producto
            if (item.nombre.includes('Leche') || item.nombre.includes('Huevo') || item.nombre.includes('Café')) {
                pesoTotal += 0.5 * item.cantidad;
            } else if (item.nombre.includes('Ropa') || item.nombre.includes('Cartera') || item.nombre.includes('Chancla')) {
                pesoTotal += 0.3 * item.cantidad;
            } else {
                pesoTotal += 0.2 * item.cantidad;
            }
        });
        return Math.round(pesoTotal * 10) / 10;
    }

    // ... (resto de funciones se mantienen igual)
})();
