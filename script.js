// Variables globales
let carrito = [];
let totalCarrito = 0;

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarEventListeners();
    inicializarAnimacionesScroll();
    actualizarContadorCarrito();
    
    // Inicializar contadores animados
    inicializarContadores();
});

// Configurar todos los event listeners
function inicializarEventListeners() {
    // Menú móvil
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Cerrar menú al hacer clic en enlace
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
    
    // Botones de agregar al carrito
    document.querySelectorAll('.btn-agregar').forEach(btn => {
        btn.addEventListener('click', agregarAlCarrito);
    });
    
    // Carrito flotante
    const btnCarrito = document.querySelector('.btn-carrito');
    const carritoFlotante = document.getElementById('carritoFlotante');
    const cerrarCarrito = document.getElementById('cerrarCarrito');
    
    if (btnCarrito) {
        btnCarrito.addEventListener('click', function(e) {
            e.preventDefault();
            carritoFlotante.classList.add('active');
        });
    }
    
    if (cerrarCarrito) {
        cerrarCarrito.addEventListener('click', function() {
            carritoFlotante.classList.remove('active');
        });
    }
    
    // Checkout
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', procesarCheckout);
    }
    
    // Newsletter
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', suscribirNewsletter);
    }
    
    // Efecto hover en tarjetas de producto
    const productoCards = document.querySelectorAll('.producto-card');
    productoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Animaciones al hacer scroll
function inicializarAnimacionesScroll() {
    const elementosAnimar = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elementosAnimar.forEach(elemento => observer.observe(elemento));
}

// Funciones del carrito
function agregarAlCarrito(e) {
    const boton = e.currentTarget;
    const producto = boton.getAttribute('data-producto');
    const precio = parseFloat(boton.getAttribute('data-precio'));
    const nombre = boton.closest('.producto-info').querySelector('h3').textContent;
    
    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.find(item => item.producto === producto);
    
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            producto: producto,
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }
    
    // Actualizar interfaz
    actualizarCarrito();
    actualizarContadorCarrito();
    
    // Mostrar feedback visual
    boton.innerHTML = '<i class="fas fa-check"></i> Añadido';
    boton.style.backgroundColor = '#2d5a3b';
    
    setTimeout(() => {
        boton.innerHTML = '<i class="fas fa-plus"></i> Añadir al carrito';
        boton.style.backgroundColor = '';
    }, 1000);
    
    // Abrir carrito en móvil
    if (window.innerWidth <= 768) {
        document.getElementById('carritoFlotante').classList.add('active');
    }
}

function actualizarCarrito() {
    const carritoItems = document.getElementById('carritoItems');
    const carritoTotal = document.getElementById('carritoTotal');
    
    // Limpiar contenido
    carritoItems.innerHTML = '';
    
    if (carrito.length === 0) {
        carritoItems.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
        carritoTotal.textContent = '0.00';
        return;
    }
    
    // Calcular total
    totalCarrito = 0;
    
    // Generar items del carrito
    carrito.forEach(item => {
        totalCarrito += item.precio * item.cantidad;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'carrito-item';
        itemElement.innerHTML = `
            <div class="carrito-item-info">
                <h4>${item.nombre}</h4>
                <p>$${item.precio.toFixed(2)} x ${item.cantidad}</p>
            </div>
            <div class="carrito-item-actions">
                <button class="btn-cantidad menos" data-producto="${item.producto}">-</button>
                <span>${item.cantidad}</span>
                <button class="btn-cantidad mas" data-producto="${item.producto}">+</button>
                <button class="btn-eliminar" data-producto="${item.producto}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        carritoItems.appendChild(itemElement);
    });
    
    // Actualizar total
    carritoTotal.textContent = totalCarrito.toFixed(2);
    
    // Añadir event listeners a los botones del carrito
    document.querySelectorAll('.btn-cantidad.menos').forEach(btn => {
        btn.addEventListener('click', modificarCantidad);
    });
    
    document.querySelectorAll('.btn-cantidad.mas').forEach(btn => {
        btn.addEventListener('click', modificarCantidad);
    });
    
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', eliminarDelCarrito);
    });
}

function modificarCantidad(e) {
    const boton = e.currentTarget;
    const producto = boton.getAttribute('data-producto');
    const item = carrito.find(item => item.producto === producto);
    
    if (boton.classList.contains('menos')) {
        if (item.cantidad > 1) {
            item.cantidad--;
        } else {
            // Eliminar si la cantidad llega a 0
            carrito = carrito.filter(item => item.producto !== producto);
        }
    } else if (boton.classList.contains('mas')) {
        item.cantidad++;
    }
    
    actualizarCarrito();
    actualizarContadorCarrito();
}

function eliminarDelCarrito(e) {
    const boton = e.currentTarget;
    const producto = boton.getAttribute('data-producto');
    
    carrito = carrito.filter(item => item.producto !== producto);
    
    actualizarCarrito();
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const contador = document.querySelector('.carrito-count');
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    
    contador.textContent = totalItems;
    
    // Agregar animación
    if (totalItems > 0) {
        contador.style.transform = 'scale(1.2)';
        setTimeout(() => {
            contador.style.transform = 'scale(1)';
        }, 300);
    }
}

function procesarCheckout() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío. Añade productos antes de finalizar la compra.');
        return;
    }
    
    // En un entorno real, aquí se procesaría el pago
    const mensaje = `¡Gracias por tu compra en Bodegón Bayona 59!\n\nResumen de tu pedido:\n${carrito.map(item => `- ${item.nombre}: ${item.cantidad} x $${item.precio.toFixed(2)}`).join('\n')}\n\nTotal: $${totalCarrito.toFixed(2)}\n\n¿Deseas proceder con el pago?`;
    
    if (confirm(mensaje)) {
        // Redirigir a WhatsApp con el pedido (en La Habana es común)
        const telefono = '5398765432';
        const texto = `Hola, me gustaría hacer un pedido de:\n\n${carrito.map(item => `${item.cantidad} x ${item.nombre}`).join('\n')}\n\nTotal: $${totalCarrito.toFixed(2)}`;
        const urlWhatsApp = `https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`;
        
        window.open(urlWhatsApp, '_blank');
        
        // Vaciar carrito después del pedido
        carrito = [];
        actualizarCarrito();
        actualizarContadorCarrito();
        
        // Cerrar carrito
        document.getElementById('carritoFlotante').classList.remove('active');
    }
}

// Newsletter
function suscribirNewsletter(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Aquí normalmente se enviaría a un servidor
    // Simulación de éxito
    e.target.innerHTML = '<p style="color: #c5a572; font-weight: 600;">¡Gracias por suscribirte! Te hemos enviado un correo de confirmación.</p>';
    
    // Guardar en localStorage
    localStorage.setItem('newsletterSubscribed', 'true');
    
    // Enviar evento a Google Analytics (simulado)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'subscribe', {
            'event_category': 'engagement',
            'event_label': 'newsletter'
        });
    }
}

// Contadores animados
function inicializarContadores() {
    const contadores = document.querySelectorAll('.stat-num');
    
    if (!contadores.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const contador = entry.target;
                const valorFinal = parseInt(contador.getAttribute('data-count'));
                animarContador(contador, valorFinal);
                observer.unobserve(contador);
            }
        });
    }, { threshold: 0.5 });
    
    contadores.forEach(contador => observer.observe(contador));
}

function animarContador(elemento, valorFinal) {
    let valorActual = 0;
    const incremento = valorFinal / 100;
    const velocidad = valorFinal > 100 ? 20 : 30; // Más lento para números grandes
    
    const timer = setInterval(() => {
        valorActual += incremento;
        if (valorActual >= valorFinal) {
            elemento.textContent = valorFinal;
            clearInterval(timer);
        } else {
            elemento.textContent = Math.floor(valorActual);
        }
    }, velocidad);
}

// Optimización SEO - Cambiar título dinámico para pestañas inactivas
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        document.title = "¡Vuelve! - Bodegón Bayona 59";
    } else {
        document.title = "Bodegón Bayona 59 - Productos Gourmet | La Habana";
    }
});