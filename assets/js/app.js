// assets/js/app.js
import catalogManager from './catalog-manager.js';
import productModal from './product-modal.js';
import cartSystem from './cart-system.js';
import checkoutFlow from './checkout-flow.js';
import CONFIG from '../config/settings.js';

class MercadoBayonaApp {
    constructor() {
        this.currentCategory = 'all';
        this.currentSearch = '';
        this.isLoading = false;
        this.isServicesView = false;
        
        // Elementos del DOM
        this.productGrid = document.getElementById('productGrid');
        this.servicesGrid = document.getElementById('servicesGrid');
        this.categoryFilters = document.getElementById('categoryFilters');
        this.productSearch = document.getElementById('productSearch');
        this.noResults = document.getElementById('noResults');
        
        this.init();
    }

    async init() {
        console.log('🚀 Iniciando Mercado Bayona App...');
        
        // 1. Configurar listeners básicos
        this.setupBasicEventListeners();
        
        // 2. Inicializar gestor de catálogo
        await catalogManager.initialize();
        
        // 3. Cargar productos iniciales
        this.loadInitialProducts();
        
        // 4. Cargar servicios
        this.loadServices();
        
        // 5. Configurar listeners de catálogo
        this.setupCatalogEventListeners();
        
        // 6. Configurar animaciones
        this.setupAnimations();
        
        // 7. Configurar accesibilidad
        this.setupAccessibility();
        
        // 8. Iniciar Service Worker (PWA)
        this.registerServiceWorker();
        
        console.log('✅ App inicializada correctamente');
    }

    // ==================== PRODUCTOS ====================
    async loadInitialProducts() {
        this.showLoadingState();
        
        try {
            const products = catalogManager.getProductsByCategory(this.currentCategory);
            await this.renderProducts(products);
            
        } catch (error) {
            console.error('Error cargando productos:', error);
            this.showErrorState();
        }
    }

    async renderProducts(products) {
        if (!this.productGrid) return;
        
        if (products.length === 0) {
            this.showNoResults();
            return;
        }
        
        // Agrupar por categoría
        const groupedProducts = products.reduce((acc, product) => {
            const category = product.category || 'General';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(product);
            return acc;
        }, {});
        
        let html = '';
        const categories = Object.keys(groupedProducts).sort();
        
        for (let i = 0; i < categories.length; i++) {
            const category = categories[i];
            const categoryProducts = groupedProducts[category];
            
            // Encabezado de categoría
            html += `
                <div class="fade-in-up mb-8" style="animation-delay: ${i * 100}ms">
                    <h3 class="text-2xl font-display font-bold text-primary mb-6 pb-2 border-b border-gray-200">
                        ${category}
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            `;
            
            // Productos de esta categoría
            categoryProducts.forEach((product, index) => {
                const isAvailable = product.status === 'available' && product.stock > 0;
                const delay = (i * 100) + (index * 50);
                
                html += this.createProductCard(product, isAvailable, delay);
            });
            
            html += `
                    </div>
                </div>
            `;
        }
        
        this.productGrid.innerHTML = html;
        this.setupProductCardListeners();
        this.hideLoadingState();
    }

    createProductCard(product, isAvailable, delay) {
        const categoryIcon = catalogManager.getCategoryIcon(product.category) || '📦';
        
        return `
            <div class="product-card fade-in-up" 
                 data-product-id="${product.id}"
                 style="animation-delay: ${delay}ms">
                
                <!-- Imagen -->
                <div class="product-image-container" onclick="showProductModal(${product.id})">
                    <img src="${product.image}" 
                         alt="${product.name}"
                         class="product-image"
                         loading="lazy"
                         onerror="this.src='https://via.placeholder.com/300?text=Producto'">
                    
                    <!-- Badge de estado -->
                    <div class="product-badge ${isAvailable ? 'badge-available' : 'badge-unavailable'}">
                        ${isAvailable ? 'Disponible' : 'Agotado'}
                    </div>
                    
                    <!-- Icono de categoría -->
                    <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center shadow-sm">
                        <span class="text-sm">${categoryIcon}</span>
                    </div>
                </div>
                
                <!-- Información -->
                <div class="p-4">
                    <!-- Nombre y precio -->
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="product-name font-semibold text-gray-900 text-lg line-clamp-1 flex-1">
                            ${product.name}
                        </h4>
                        <div class="text-right">
                            <div class="text-xl font-bold text-primary">
                                $${product.price.toLocaleString()}
                            </div>
                            <div class="text-xs text-gray-500">
                                ${product.unit || 'unidad'}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Descripción -->
                    <p class="text-sm text-gray-600 mb-3 line-clamp-2">
                        ${product.description}
                    </p>
                    
                    <!-- Stock -->
                    <div class="flex justify-between items-center mb-3">
                        <span class="text-xs ${product.stock > 10 ? 'text-green-600' : 
                                               product.stock > 0 ? 'text-yellow-600' : 
                                               'text-red-600'} font-medium">
                            ${product.stock > 10 ? '✓ En stock' : 
                              product.stock > 0 ? `⚠️ Últimas ${product.stock}` : 
                              '✗ Agotado'}
                        </span>
                        <span class="text-xs text-gray-500">
                            ${product.weight ? `${product.weight} ${product.unit === 'kg' ? 'kg' : ''}` : ''}
                        </span>
                    </div>
                    
                    <!-- Botón de acción -->
                    <button onclick="event.stopPropagation(); ${isAvailable ? `showProductModal(${product.id})` : ''}"
                            class="w-full ${isAvailable ? 
                                'bg-primary hover:bg-primary-dark text-white' : 
                                'bg-gray-200 text-gray-500 cursor-not-allowed'} 
                                font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                        ${isAvailable ? `
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                            Añadir al carrito
                        ` : 'No disponible'}
                    </button>
                </div>
            </div>
        `;
    }

    // ==================== SERVICIOS ====================
    async loadServices() {
        if (!this.servicesGrid) return;
        
        try {
            const services = catalogManager.services || [];
            const categories = catalogManager.serviceCategories || [];
            
            if (services.length === 0) {
                this.servicesGrid.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <p class="text-gray-500">Próximamente más servicios disponibles</p>
                    </div>
                `;
                return;
            }
            
            let html = '';
            
            services.forEach((service, index) => {
                html += this.createServiceCard(service, index);
            });
            
            this.servicesGrid.innerHTML = html;
            this.setupServiceCardListeners();
            
        } catch (error) {
            console.error('Error cargando servicios:', error);
        }
    }

    createServiceCard(service, index) {
        const delay = index * 100;
        
        return `
            <div class="fade-in-up" style="animation-delay: ${delay}ms">
                <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                    <!-- Imagen -->
                    <div class="relative h-48 overflow-hidden">
                        <img src="${service.image}" 
                             alt="${service.name}"
                             class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                             loading="lazy"
                             onerror="this.src='https://via.placeholder.com/400x300?text=Servicio'">
                        
                        <!-- Rating -->
                        <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                            <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                            <span class="font-bold text-gray-800">${service.rating}</span>
                            <span class="text-xs text-gray-500">(${service.reviews})</span>
                        </div>
                    </div>
                    
                    <!-- Información -->
                    <div class="p-6">
                        <!-- Categoría -->
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full">
                                ${service.category}
                            </span>
                            <span class="text-xs text-gray-500">• ${service.experience}</span>
                        </div>
                        
                        <!-- Nombre -->
                        <h4 class="text-lg font-bold text-gray-900 mb-2">${service.name}</h4>
                        
                        <!-- Descripción -->
                        <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                            ${service.description}
                        </p>
                        
                        <!-- Especialidades -->
                        <div class="mb-4">
                            <p class="text-xs text-gray-500 mb-1">Especializado en:</p>
                            <div class="flex flex-wrap gap-1">
                                ${service.specialties.slice(0, 3).map(spec => `
                                    <span class="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                        ${spec}
                                    </span>
                                `).join('')}
                                ${service.specialties.length > 3 ? `
                                    <span class="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                        +${service.specialties.length - 3}
                                    </span>
                                ` : ''}
                            </div>
                        </div>
                        
                        <!-- Ubicación y precio -->
                        <div class="flex justify-between items-center">
                            <div class="text-sm">
                                <span class="text-gray-500">📍</span>
                                <span class="text-gray-700">${service.location}</span>
                            </div>
                            <span class="font-semibold text-primary">${service.priceRange}</span>
                        </div>
                    </div>
                    
                    <!-- Botón de contacto -->
                    <div class="px-6 pb-6">
                        <a href="${service.whatsapp}" 
                           target="_blank"
                           class="block w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors text-center flex items-center justify-center gap-2">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.04 2C7.38 2 3.51 5.87 3.51 10.53C3.51 12.02 3.9 13.43 4.6 14.65L3.32 20.02L8.76 18.73C9.9 19.37 11.19 19.72 12.51 19.72H12.53C17.19 19.72 21.06 15.85 21.06 11.19C21.06 6.53 17.19 2.66 12.53 2.66H12.51Z"/>
                            </svg>
                            Contactar por WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    // ==================== FILTROS Y BÚSQUEDA ====================
    setupCategoryFilters() {
        if (!this.categoryFilters) return;
        
        const categories = catalogManager.getAllCategories();
        
        // Agregar "Todos" al inicio
        const allCategories = [
            { id: 'all', name: 'Todos', icon: '📦' },
            ...categories
        ];
        
        this.categoryFilters.innerHTML = allCategories.map(cat => `
            <button class="category-btn ${this.currentCategory === cat.id ? 'active' : ''}"
                    data-category="${cat.id}"
                    onclick="app.filterByCategory('${cat.id}')">
                <span class="mr-1">${cat.icon}</span>
                ${cat.name}
            </button>
        `).join('');
    }

    filterByCategory(categoryId) {
        this.currentCategory = categoryId;
        
        // Actualizar botón activo
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === categoryId);
        });
        
        // Filtrar productos
        let filteredProducts;
        
        if (categoryId === 'all') {
            filteredProducts = catalogManager.products;
        } else {
            const category = catalogManager.categories.find(c => c.id === categoryId);
            filteredProducts = catalogManager.getProductsByCategory(category?.name || '');
        }
        
        // Aplicar búsqueda si hay
        if (this.currentSearch) {
            filteredProducts = this.filterBySearch(filteredProducts, this.currentSearch);
        }
        
        this.renderProducts(filteredProducts);
        
        // Scroll suave a la sección
        const productSection = document.getElementById('mercado');
        if (productSection && window.scrollY > productSection.offsetTop) {
            productSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    filterBySearch(products, searchTerm) {
        if (!searchTerm.trim()) return products;
        
        const term = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        return products.filter(product => {
            const name = product.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const description = product.description.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const category = product.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            
            return name.includes(term) || 
                   description.includes(term) || 
                   category.includes(term);
        });
    }

    handleSearch(searchTerm) {
        this.currentSearch = searchTerm;
        
        let filteredProducts;
        
        if (this.currentCategory === 'all') {
            filteredProducts = catalogManager.products;
        } else {
            const category = catalogManager.categories.find(c => c.id === this.currentCategory);
            filteredProducts = catalogManager.getProductsByCategory(category?.name || '');
        }
        
        filteredProducts = this.filterBySearch(filteredProducts, searchTerm);
        this.renderProducts(filteredProducts);
    }

    // ==================== ESTADOS DE CARGA ====================
    showLoadingState() {
        if (!this.productGrid) return;
        
        this.isLoading = true;
        
        // Skeleton loading
        this.productGrid.innerHTML = `
            <div class="col-span-full">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    ${Array(8).fill().map((_, i) => `
                        <div class="skeleton-card">
                            <div class="skeleton h-48 rounded-t-lg"></div>
                            <div class="p-4">
                                <div class="skeleton-text h-6 mb-2"></div>
                                <div class="skeleton-text h-4 mb-1"></div>
                                <div class="skeleton-text h-4 mb-3 w-3/4"></div>
                                <div class="skeleton-text h-10 rounded"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    hideLoadingState() {
        this.isLoading = false;
        if (this.noResults) {
            this.noResults.classList.add('hidden');
        }
    }

    showNoResults() {
        if (this.productGrid) {
            this.productGrid.innerHTML = '';
        }
        
        if (this.noResults) {
            this.noResults.classList.remove('hidden');
        }
    }

    showErrorState() {
        if (!this.productGrid) return;
        
        this.productGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Error al cargar productos</h3>
                <p class="text-gray-600 mb-4">No pudimos cargar los productos. Por favor intenta nuevamente.</p>
                <button onclick="app.loadInitialProducts()" 
                        class="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-lg transition-colors">
                    Reintentar
                </button>
            </div>
        `;
    }

    // ==================== EVENT LISTENERS ====================
    setupBasicEventListeners() {
        // Búsqueda con debounce
        if (this.productSearch) {
            let searchTimeout;
            this.productSearch.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 300);
            });
        }
        
        // Menú móvil
        document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
            document.getElementById('mobileMenu').classList.remove('hidden');
        });
        
        document.getElementById('closeMobileMenu')?.addEventListener('click', () => {
            document.getElementById('mobileMenu').classList.add('hidden');
        });
        
        // Volver arriba
        document.getElementById('backToTop')?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        // Mostrar botón volver arriba al scroll
        window.addEventListener('scroll', () => {
            const backToTopBtn = document.getElementById('backToTop');
            if (backToTopBtn) {
                if (window.scrollY > 300) {
                    backToTopBtn.classList.remove('translate-y-10', 'opacity-0');
                    backToTopBtn.classList.add('translate-y-0', 'opacity-100');
                } else {
                    backToTopBtn.classList.add('translate-y-10', 'opacity-0');
                    backToTopBtn.classList.remove('translate-y-0', 'opacity-100');
                }
            }
        });
    }

    setupProductCardListeners() {
        // Los listeners específicos se configuran en createProductCard
        // para evitar delegación de eventos compleja
    }

    setupServiceCardListeners() {
        // Los enlaces de WhatsApp ya están configurados en el HTML
    }

    setupCatalogEventListeners() {
        // Cuando el catálogo se carga
        window.addEventListener('catalog:loaded', (e) => {
            console.log('📦 Catálogo cargado:', e.detail.products.length, 'productos');
            
            // Configurar filtros
            this.setupCategoryFilters();
            
            // Cargar productos
            this.loadInitialProducts();
        });
        
        // Cuando el catálogo se actualiza
        window.addEventListener('catalog:updated', (e) => {
            console.log('🔄 Catálogo actualizado');
            
            // Recargar productos si estamos en vista de productos
            if (!this.isServicesView) {
                this.loadInitialProducts();
            }
        });
    }

    // ==================== ANIMACIONES ====================
    setupAnimations() {
        // Intersection Observer para animaciones al scroll
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            }, { threshold: 0.1 });
            
            // Observar elementos con clases de animación
            document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(el => {
                observer.observe(el);
            });
        }
    }

    // ==================== ACCESIBILIDAD ====================
    setupAccessibility() {
        // Teclado navigation
        document.addEventListener('keydown', (e) => {
            // Enter en botones de categoría
            if (e.key === 'Enter' && e.target.classList.contains('category-btn')) {
                e.target.click();
            }
            
            // Escape cierra modales
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal:not(.hidden)');
                if (openModal) {
                    openModal.classList.add('hidden');
                }
            }
        });
        
        // Mejorar focus para navegación por teclado
        document.querySelectorAll('button, a, input, select').forEach(el => {
            el.addEventListener('focus', (e) => {
                e.target.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
            });
            
            el.addEventListener('blur', (e) => {
                e.target.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
            });
        });
        
        // Configurar modo alta visibilidad
        const accessibilityBtn = document.getElementById('accessibilityBtn');
        if (accessibilityBtn) {
            accessibilityBtn.addEventListener('click', () => {
                this.toggleHighContrastMode();
            });
        }
    }

    toggleHighContrastMode() {
        document.body.classList.toggle('high-contrast-mode');
        
        const isActive = document.body.classList.contains('high-contrast-mode');
        localStorage.setItem('highContrastMode', isActive);
        
        this.showToast(
            isActive ? 'Modo alto contraste activado' : 'Modo alto contraste desactivado',
            'info'
        );
    }

    // ==================== PWA - SERVICE WORKER ====================
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('✅ Service Worker registrado:', registration.scope);
                        
                        // Verificar actualizaciones periódicamente
                        setInterval(() => {
                            registration.update();
                        }, 60 * 60 * 1000); // Cada hora
                    })
                    .catch(error => {
                        console.log('⚠️ Service Worker no registrado:', error);
                    });
            });
        }
    }

    // ==================== UTILIDADES ====================
    showToast(message, type = 'info') {
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
}

// Inicializar aplicación
const app = new MercadoBayonaApp();

// Exportar para uso global (necesario para onclick en HTML)
window.app = app;
window.showProductModal = productModal.show.bind(productModal);

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Ya se inicializa en el constructor
    });
}
