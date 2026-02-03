// assets/js/catalog-manager.js
import CONFIG from '../config/settings.js';

class CatalogManager {
    constructor() {
        this.products = [];
        this.services = [];
        this.categories = [];
        this.serviceCategories = [];
        this.loaded = false;
        this.loading = false;
        this.cacheKey = 'mercadoBayona_catalog_cache';
        this.cacheDuration = CONFIG.app.cacheDuration;
    }

    // ==================== INICIALIZACIÓN ====================
    async initialize() {
        console.log('🔄 Inicializando gestor de catálogo...');
        
        if (this.loaded) return true;
        if (this.loading) return this.waitForLoad();
        
        this.loading = true;
        
        try {
            // 1. Intentar cargar desde caché
            if (await this.loadFromCache()) {
                console.log('✅ Catálogo cargado desde caché');
                this.loaded = true;
                this.loading = false;
                this.dispatchCatalogLoaded();
                return true;
            }
            
            // 2. Intentar cargar desde Google Sheets (si está configurado)
            if (CONFIG.app.useGoogleSheets) {
                try {
                    await this.loadFromGoogleSheets();
                    console.log('✅ Catálogo cargado desde Google Sheets');
                } catch (sheetError) {
                    console.warn('⚠️ Error cargando desde Sheets, usando backup local:', sheetError);
                    await this.loadFromLocalBackup();
                }
            } else {
                // 3. Cargar desde backup local
                await this.loadFromLocalBackup();
            }
            
            // 4. Guardar en caché
            await this.saveToCache();
            
            this.loaded = true;
            this.loading = false;
            this.dispatchCatalogLoaded();
            
            // 5. Iniciar auto-refresco
            this.startAutoRefresh();
            
            return true;
            
        } catch (error) {
            console.error('❌ Error inicializando catálogo:', error);
            this.loading = false;
            
            // Último recurso: cargar datos básicos embebidos
            this.loadEmbeddedData();
            this.loaded = true;
            this.dispatchCatalogLoaded();
            
            return false;
        }
    }

    // ==================== CARGA DESDE GOOGLE SHEETS ====================
    async loadFromGoogleSheets() {
        return new Promise((resolve, reject) => {
            if (!CONFIG.app.sheetsURL) {
                reject(new Error('No hay URL de Google Sheets configurada'));
                return;
            }
            
            const url = `${CONFIG.app.sheetsURL}&t=${Date.now()}`;
            
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }
                    return response.text();
                })
                .then(csvText => {
                    this.parseCSVData(csvText);
                    resolve();
                })
                .catch(error => {
                    console.error('❌ Error cargando desde Google Sheets:', error);
                    reject(error);
                });
        });
    }

    parseCSVData(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) {
            throw new Error('CSV vacío o sin datos');
        }
        
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        // Índices esperados (ajustar según tu CSV)
        const idxId = headers.indexOf('id');
        const idxName = headers.indexOf('nombre');
        const idxPrice = headers.indexOf('precio');
        const idxImage = headers.indexOf('imagen');
        const idxDescription = headers.indexOf('descripcion');
        const idxCategory = headers.indexOf('categoria');
        const idxStock = headers.indexOf('stock');
        const idxStatus = headers.indexOf('estado');
        const idxWeight = headers.indexOf('peso');
        const idxUnit = headers.indexOf('unidad');
        
        this.products = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            
            const product = {
                id: parseInt(values[idxId]) || i,
                name: values[idxName]?.trim() || 'Producto sin nombre',
                price: parseInt(values[idxPrice]) || 0,
                image: values[idxImage]?.trim() || 'https://via.placeholder.com/300',
                description: values[idxDescription]?.trim() || 'Descripción no disponible',
                category: values[idxCategory]?.trim() || 'General',
                stock: parseInt(values[idxStock]) || 0,
                status: values[idxStatus]?.toLowerCase() === 'activo' ? 'available' : 'unavailable',
                weight: parseFloat(values[idxWeight]) || 0,
                unit: values[idxUnit]?.trim() || 'unidad'
            };
            
            // Solo agregar productos disponibles
            if (product.status === 'available' && product.price > 0) {
                this.products.push(product);
            }
        }
        
        // Generar categorías únicas
        this.generateCategories();
        
        console.log(`📊 Procesados ${this.products.length} productos desde CSV`);
    }

    parseCSVLine(line) {
        const values = [];
        let inQuotes = false;
        let currentValue = '';
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(currentValue);
                currentValue = '';
            } else {
                currentValue += char;
            }
        }
        
        values.push(currentValue);
        return values.map(v => v.trim().replace(/^"|"$/g, ''));
    }

    // ==================== CARGA DESDE BACKUP LOCAL ====================
    async loadFromLocalBackup() {
        try {
            const response = await fetch('./data/catalog.json');
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Cargar productos
            this.products = data.products || [];
            
            // Cargar categorías desde el JSON o generarlas
            this.categories = data.categories || this.generateCategories();
            
            // Cargar servicios
            const servicesResponse = await fetch('./data/services.json');
            if (servicesResponse.ok) {
                const servicesData = await servicesResponse.json();
                this.services = servicesData.services || [];
                this.serviceCategories = servicesData.serviceCategories || [];
            }
            
            console.log(`✅ Cargados ${this.products.length} productos y ${this.services.length} servicios desde backup local`);
            
        } catch (error) {
            console.error('❌ Error cargando backup local:', error);
            
            // Datos embebidos como último recurso
            this.loadEmbeddedData();
            throw error;
        }
    }

    loadEmbeddedData() {
        // Datos mínimos embebidos para funcionamiento básico
        this.products = [
            {
                id: 1,
                name: 'Producto de Ejemplo',
                price: 100,
                image: 'https://via.placeholder.com/300',
                description: 'Este es un producto de ejemplo',
                category: 'General',
                stock: 10,
                status: 'available',
                weight: 1,
                unit: 'unidad'
            }
        ];
        
        this.categories = [
            {
                id: 'general',
                name: 'General',
                icon: '🛒',
                description: 'Productos generales'
            }
        ];
        
        this.services = [];
        this.serviceCategories = [];
        
        console.log('⚠️ Usando datos embebidos mínimos');
    }

    // ==================== SISTEMA DE CACHÉ ====================
    async saveToCache() {
        try {
            const cacheData = {
                products: this.products,
                services: this.services,
                categories: this.categories,
                serviceCategories: this.serviceCategories,
                timestamp: Date.now(),
                version: '1.0'
            };
            
            localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
            console.log('💾 Catálogo guardado en caché local');
            
        } catch (error) {
            console.warn('⚠️ No se pudo guardar en caché:', error);
        }
    }

    async loadFromCache() {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            if (!cached) return false;
            
            const data = JSON.parse(cached);
            
            // Verificar que la caché no haya expirado
            const cacheAge = Date.now() - data.timestamp;
            if (cacheAge > this.cacheDuration) {
                console.log('⏰ Caché expirada, recargando...');
                localStorage.removeItem(this.cacheKey);
                return false;
            }
            
            // Cargar datos desde caché
            this.products = data.products || [];
            this.services = data.services || [];
            this.categories = data.categories || [];
            this.serviceCategories = data.serviceCategories || [];
            
            return true;
            
        } catch (error) {
            console.warn('⚠️ Error cargando caché:', error);
            localStorage.removeItem(this.cacheKey);
            return false;
        }
    }

    // ==================== GENERACIÓN DE CATEGORÍAS ====================
    generateCategories() {
        const categorySet = new Set();
        
        this.products.forEach(product => {
            if (product.category && product.category.trim() !== '') {
                categorySet.add(product.category);
            }
        });
        
        // Convertir a array de objetos
        this.categories = Array.from(categorySet).map((cat, index) => ({
            id: `cat-${index}`,
            name: cat,
            icon: this.getCategoryIcon(cat),
            description: `Productos de ${cat}`
        }));
        
        return this.categories;
    }

    getCategoryIcon(categoryName) {
        const iconMap = {
            'Alimentos': '🛒',
            'Aseo': '🧼',
            'Construcción': '🏗️',
            'Ferretería': '🔧',
            'General': '📦'
        };
        
        return iconMap[categoryName] || '📦';
    }

    // ==================== AUTO-REFRESCO ====================
    startAutoRefresh() {
        if (CONFIG.app.autoRefresh <= 0) return;
        
        setInterval(async () => {
            // Solo refrescar si la página está visible
            if (document.visibilityState === 'visible') {
                console.log('🔄 Actualizando catálogo automáticamente...');
                
                try {
                    if (CONFIG.app.useGoogleSheets) {
                        await this.loadFromGoogleSheets();
                        await this.saveToCache();
                        this.dispatchCatalogUpdated();
                        console.log('✅ Catálogo actualizado desde Sheets');
                    }
                } catch (error) {
                    console.log('⚠️ No se pudo actualizar automáticamente:', error);
                }
            }
        }, CONFIG.app.autoRefresh);
    }

    // ==================== EVENTOS ====================
    dispatchCatalogLoaded() {
        const event = new CustomEvent('catalog:loaded', {
            detail: {
                products: this.products,
                services: this.services,
                categories: this.categories,
                serviceCategories: this.serviceCategories,
                timestamp: Date.now()
            }
        });
        
        window.dispatchEvent(event);
    }

    dispatchCatalogUpdated() {
        const event = new CustomEvent('catalog:updated', {
            detail: {
                products: this.products,
                services: this.services,
                categories: this.categories,
                serviceCategories: this.serviceCategories,
                timestamp: Date.now()
            }
        });
        
        window.dispatchEvent(event);
    }

    // ==================== MÉTODOS DE CONSULTA ====================
    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    getProductsByCategory(category) {
        if (!category || category === 'all') {
            return this.products;
        }
        return this.products.filter(product => product.category === category);
    }

    getProductsBySearch(query) {
        if (!query) return this.products;
        
        const searchTerm = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        return this.products.filter(product => {
            const name = product.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const description = product.description.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const category = product.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            
            return name.includes(searchTerm) || 
                   description.includes(searchTerm) || 
                   category.includes(searchTerm);
        });
    }

    getServiceById(id) {
        return this.services.find(service => service.id === id);
    }

    getServicesByCategory(category) {
        if (!category || category === 'all') {
            return this.services;
        }
        return this.services.filter(service => service.category === category);
    }

    getAllCategories() {
        return this.categories;
    }

    getAllServiceCategories() {
        return this.serviceCategories;
    }

    // ==================== UTILIDADES ====================
    waitForLoad() {
        return new Promise((resolve) => {
            const checkLoaded = () => {
                if (this.loaded) {
                    resolve(true);
                } else {
                    setTimeout(checkLoaded, 100);
                }
            };
            checkLoaded();
        });
    }

    clearCache() {
        localStorage.removeItem(this.cacheKey);
        console.log('🗑️ Caché limpiada');
    }

    // ==================== ESTADÍSTICAS ====================
    getStats() {
        return {
            totalProducts: this.products.length,
            totalServices: this.services.length,
            availableProducts: this.products.filter(p => p.status === 'available').length,
            categoriesCount: this.categories.length,
            serviceCategoriesCount: this.serviceCategories.length,
            averagePrice: this.products.length > 0 ? 
                this.products.reduce((sum, p) => sum + p.price, 0) / this.products.length : 0
        };
    }
}

// Exportar singleton
const catalogManager = new CatalogManager();
export default catalogManager;
