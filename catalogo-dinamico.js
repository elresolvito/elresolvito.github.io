// catálogo-dinamico.js - VERSIÓN FINAL FUNCIONAL
const CatalogoDinamico = {
  // ✅ TU URL CORRECTA (ya está publicada)
  sheetURL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT2RBATNCTKwgP7EYeiG0Od16zAgR0mrnsxKBITDvaX62a47l0AyGF-isufaRs6Ayk5hXWI3j_jAHeu/pub?output=csv',
  
  productos: [],
  categorias: [],
  cargado: false,
  
  inicializar: function() {
    console.log('🔄 Inicializando catálogo dinámico...');
    
    // 1. Primero intentar con CORS proxy
    this.intentarConProxy()
      .then(success => {
        if (success) {
          console.log('✅ Catálogo cargado vía proxy');
          return;
        }
        
        // 2. Si falla, intentar directo (para desarrollo local)
        console.log('🔄 Intentando carga directa...');
        return this.cargarDesdeSheetsDirecto();
      })
      .then(success => {
        if (success) {
          console.log('✅ Catálogo cargado directamente');
          return;
        }
        
        // 3. Si todo falla, usar local
        console.log('⚠️ Usando catálogo local como respaldo');
        this.usarRespaldoLocal();
      })
      .catch(error => {
        console.error('❌ Error general:', error);
        this.usarRespaldoLocal();
      });
  },
  
  intentarConProxy: function() {
    return new Promise((resolve) => {
      const proxyURL = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(this.sheetURL + '&t=' + Date.now());
      
      console.log('📡 Usando proxy CORS:', proxyURL);
      
      fetch(proxyURL, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain',
        }
      })
      .then(response => {
        if (!response.ok) throw new Error('Proxy error: ' + response.status);
        return response.text();
      })
      .then(csvText => {
        if (csvText && csvText.trim() !== '') {
          this.procesarCSV(csvText);
          this.guardarEnCache();
          this.cargado = true;
          this.generarCategorias();
          this.despacharEventoCarga();
          this.iniciarAutoRefresco();
          resolve(true);
        } else {
          console.warn('⚠️ Proxy devolvió datos vacíos');
          resolve(false);
        }
      })
      .catch(error => {
        console.warn('⚠️ Error con proxy:', error.message);
        resolve(false);
      });
    });
  },
  
  cargarDesdeSheetsDirecto: function() {
    return new Promise((resolve) => {
      const urlDirecto = this.sheetURL + '&t=' + Date.now();
      console.log('📡 Intentando carga directa:', urlDirecto);
      
      fetch(urlDirecto)
        .then(response => {
          if (!response.ok) throw new Error('Direct error: ' + response.status);
          return response.text();
        })
        .then(csvText => {
          this.procesarCSV(csvText);
          this.guardarEnCache();
          this.cargado = true;
          this.generarCategorias();
          this.despacharEventoCarga();
          this.iniciarAutoRefresco();
          resolve(true);
        })
        .catch(error => {
          console.warn('⚠️ Error carga directa:', error.message);
          resolve(false);
        });
    });
  },
  
  procesarCSV: function(csvText) {
    this.productos = [];
    
    // Limpiar CSV
    const lineas = csvText.split('\n')
      .map(linea => linea.trim())
      .filter(linea => linea !== '');
    
    console.log(`📊 Líneas en CSV: ${lineas.length}`);
    
    if (lineas.length < 2) {
      throw new Error('CSV vacío');
    }
    
    // Encabezados (primer línea)
    const encabezados = lineas[0].split(',').map(h => h.trim().toLowerCase());
    console.log('📋 Encabezados detectados:', encabezados);
    
    // Índices de columnas
    const idx = {
      nombre: encabezados.findIndex(h => h.includes('nombre')),
      precio: encabezados.findIndex(h => h.includes('precio')),
      imagen: encabezados.findIndex(h => h.includes('imagen')),
      descripcion: encabezados.findIndex(h => h.includes('descripcion') || h.includes('descriptor')),
      categoria: encabezados.findIndex(h => h.includes('categoria') || h.includes('category')),
      stock: encabezados.findIndex(h => h.includes('stock')),
      activo: encabezados.findIndex(h => h.includes('activo'))
    };
    
    // Procesar productos
    for (let i = 1; i < lineas.length; i++) {
      const valores = lineas[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      
      // Validar datos mínimos
      if (valores.length < 3) continue;
      
      const nombre = idx.nombre >= 0 ? valores[idx.nombre] : valores[0];
      const precio = idx.precio >= 0 ? parseInt(valores[idx.precio]) : parseInt(valores[1]) || 0;
      
      if (!nombre || nombre === '' || precio <= 0) continue;
      
      const producto = {
        id: i,
        name: nombre,
        price: precio,
        image: idx.imagen >= 0 && valores[idx.imagen] ? valores[idx.imagen] : 'https://via.placeholder.com/300',
        description: idx.descripcion >= 0 && valores[idx.descripcion] ? valores[idx.descripcion] : 'Sin descripción',
        specificDetails: idx.descripcion >= 0 && valores[idx.descripcion] ? valores[idx.descripcion] : 'Sin detalles',
        category: idx.categoria >= 0 && valores[idx.categoria] ? valores[idx.categoria] : 'Sin categoría',
        department: 'mercado',
        status: 'available'
      };
      
      // Verificar stock y activo
      if (idx.stock >= 0 && idx.activo >= 0) {
        const stock = parseInt(valores[idx.stock]) || 0;
        const activo = valores[idx.activo].toUpperCase() === 'TRUE';
        producto.status = (activo && stock > 0) ? 'available' : 'unavailable';
      }
      
      this.productos.push(producto);
    }
    
    // Ordenar por categoría y nombre
    this.productos.sort((a, b) => {
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      return a.name.localeCompare(b.name);
    });
    
    console.log(`✅ ${this.productos.length} productos procesados`);
  },
  
  guardarEnCache: function() {
    try {
      const cacheData = {
        productos: this.productos,
        categorias: this.categorias,
        timestamp: Date.now()
      };
      localStorage.setItem('catalogoCache', JSON.stringify(cacheData));
    } catch (e) {
      console.warn('No se pudo guardar caché');
    }
  },
  
  cargarDesdeCache: function() {
    try {
      const cache = localStorage.getItem('catalogoCache');
      if (!cache) return false;
      
      const data = JSON.parse(cache);
      if (Date.now() - data.timestamp < 3600000) { // 1 hora
        this.productos = data.productos || [];
        this.categorias = data.categorias || [];
        return true;
      }
    } catch (e) {}
    return false;
  },
  
  usarRespaldoLocal: function() {
    if (window.catalogo && window.catalogo.productos) {
      this.productos = window.catalogo.productos;
      this.cargado = true;
      this.generarCategorias();
      this.despacharEventoCarga();
      console.log('✅ Catálogo local cargado:', this.productos.length, 'productos');
    } else {
      console.error('❌ No hay catálogo local');
      this.productos = [];
      this.cargado = true;
      this.despacharEventoCarga();
    }
  },
  
  generarCategorias: function() {
    const cats = new Set();
    this.productos.forEach(p => {
      if (p.category && p.category.trim() !== '') {
        cats.add(p.category);
      }
    });
    this.categorias = Array.from(cats).sort();
  },
  
  despacharEventoCarga: function() {
    const event = new CustomEvent('catalogoCargado', {
      detail: { 
        productos: this.productos,
        categorias: this.categorias
      }
    });
    window.dispatchEvent(event);
  },
  
  iniciarAutoRefresco: function() {
    // Refrescar cada 10 minutos
    setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.intentarConProxy().catch(() => {});
      }
    }, 600000);
  },
  
  // Métodos de consulta
  obtenerPorId: function(id) {
    return this.productos.find(p => p.id === id);
  },
  
  obtenerPorCategoria: function(categoria) {
    return this.productos.filter(p => p.category === categoria);
  },
  
  obtenerTodos: function() {
    return this.productos;
  },
  
  obtenerCategorias: function() {
    return this.categorias;
  }
};

// Inicializar
(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      CatalogoDinamico.inicializar();
    });
  } else {
    CatalogoDinamico.inicializar();
  }
})();

window.CatalogoDinamico = CatalogoDinamico;
