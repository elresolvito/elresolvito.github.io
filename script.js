// Inicialización del slider
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Página cargada - Bodegón Bayona 59');
    
    // Inicializar Swiper si existe
    let swiper = null;
    const swiperElement = document.querySelector('.swiper');
    if (swiperElement) {
        swiper = new Swiper('.swiper', {
            direction: 'horizontal',
            loop: true,
            speed: 800,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
        });
    } else {
        console.log('⚠️ Swiper no encontrado');
    }

    // Menú móvil
    const menuBtn = document.getElementById('menuBtn');
    const header = document.querySelector('.header');
    
    if (menuBtn && header) {
        menuBtn.addEventListener('click', function() {
            header.classList.toggle('active');
        });
    }

    // Carrito flotante
    const cartBtn = document.getElementById('cartBtn');
    const closeCart = document.getElementById('closeCart');
    const cartSidebar = document.getElementById('cartSidebar');
    
    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', function() {
            cartSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeCart && cartSidebar) {
        closeCart.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Cerrar carrito al hacer clic fuera
    document.addEventListener('click', function(event) {
        if (cartSidebar && cartBtn && 
            !cartSidebar.contains(event.target) && 
            !cartBtn.contains(event.target)) {
            cartSidebar.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Filtros de categorías
    const categoryBtns = document.querySelectorAll('.category-btn');
    if (categoryBtns.length > 0) {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                categoryBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                console.log('Filtrando por:', this.textContent);
            });
        });
    }

    // Botones de agregar al carrito
    const addButtons = document.querySelectorAll('.btn-combo, .btn-add, .btn-buy');
    addButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Agregando producto al carrito');
            createNotification('Producto agregado al carrito!', 'success');
            updateCartCount(1);
            
            this.classList.add('added');
            setTimeout(() => {
                this.classList.remove('added');
            }, 1000);
        });
    });

    // Formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Enviando formulario de contacto');
            
            const inputs = this.querySelectorAll('input, textarea');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = 'var(--secondary)';
                    isValid = false;
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (isValid) {
                const submitBtn = this.querySelector('.btn-submit');
                if (submitBtn) {
                    const originalText = submitBtn.innerHTML;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                    submitBtn.disabled = true;
                    
                    setTimeout(() => {
                        createNotification('Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        contactForm.reset();
                    }, 1500);
                }
            } else {
                createNotification('Por favor completa todos los campos', 'error');
            }
        });
    }

    // Scroll suave para enlaces
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                if (header) header.classList.remove('active');
            }
        });
    });

    // Animación de elementos al hacer scroll
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observar elementos para animación
    document.querySelectorAll('.combo-card, .product-card, .price-card').forEach(el => {
        observer.observe(el);
    });

    // Estilos para notificaciones
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(135deg, #2E86AB 0%, #118AB2 100%);
                color: white;
                padding: 15px 20px;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                gap: 15px;
                z-index: 9999;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                max-width: 400px;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification.error {
                background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
            }
            
            .notification i {
                font-size: 1.2rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                margin-left: auto;
            }
            
            .pulse {
                animation: pulse 0.5s ease;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.3); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
});

// FUNCIONES AUXILIARES CORREGIDAS

function createNotification(message, type) {
    try {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto-eliminar después de 5 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
        
        // Botón para cerrar
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            });
        }
    } catch (error) {
        console.error('Error creando notificación:', error);
    }
}

function updateCartCount(increment) {
    try {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            let currentCount = parseInt(cartCount.textContent) || 0;
            currentCount += increment;
            cartCount.textContent = currentCount;
            
            // Animación
            cartCount.classList.add('pulse');
            setTimeout(() => {
                cartCount.classList.remove('pulse');
            }, 500);
        } else {
            console.log('⚠️ Elemento .cart-count no encontrado');
        }
    } catch (error) {
        console.error('Error actualizando carrito:', error);
    }
}

// Función para cargar más productos
function loadMoreProducts() {
    try {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) {
            console.log('⚠️ .products-grid no encontrado');
            return;
        }
        
        const products = [
            { name: 'Arroz 1kg', desc: 'Tipo especial', price: '$2.50', icon: 'fas fa-utensils' },
            { name: 'Frijoles 500g', desc: 'Negros premium', price: '$3.00', icon: 'fas fa-seedling' },
            { name: 'Azúcar 1kg', desc: 'Blanca refinada', price: '$1.80', icon: 'fas fa-cube' },
            { name: 'Café 250g', desc: 'Molido tradicional', price: '$5.00', icon: 'fas fa-coffee' }
        ];
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-img">
                    <i class="${product.icon}"></i>
                </div>
                <h3>${product.name}</h3>
                <p class="product-desc">${product.desc}</p>
                <div class="product-price">
                    <span class="price">${product.price}</span>
                    <button class="btn-add"><i class="fas fa-plus"></i></button>
                </div>
            `;
            
            const addBtn = productCard.querySelector('.btn-add');
            if (addBtn) {
                addBtn.addEventListener('click', function() {
                    createNotification(`${product.name} agregado al carrito!`, 'success');
                    updateCartCount(1);
                });
            }
            
            productsGrid.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error cargando productos:', error);
    }
}

// Configurar botón "Ver todos"
document.addEventListener('DOMContentLoaded', function() {
    const viewAllBtn = document.querySelector('.btn-view-all');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loadMoreProducts();
            this.style.display = 'none';
        });
    }
    
    // Hacer funciones globales
    window.createNotification = createNotification;
    window.updateCartCount = updateCartCount;
    window.loadMoreProducts = loadMoreProducts;
    
    console.log('✅ Todas las funciones JavaScript cargadas correctamente');
});
