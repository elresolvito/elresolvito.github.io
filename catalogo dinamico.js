// catálogo-dinamico.js - VERSIÓN CON COLUMNA "orden"
const CatalogoDinamico = {
  sheetURL: 'https://docs.google.com/spreadsheets/d/1RpNc46-ok47bjRUlp0rQCK3hMH8xAi-b97wlBldxktk/export?format=csv',
  
  productos: [],
  categorias: [],
  cargado: false,
  
  inicializar: function() {
    console.log('🔄 Inicializando catálogo dinámico...');
    
    if (this.cargarDesdeCache()) {
      console.log('✅ Catálogo desde caché:', this.productos.length, 'productos');
      this.cargado = true;
      this.despacharEventoCarga();
      this.iniciarAutoRefresco();
      return;
    }
    
    this.cargarDesdeSheets()
      .then(() => {
        console.log('✅ Catálogo desde Sheets:', this.productos.length, 'productos');
        this.guardarEnCache();
        this.cargado = true;
        this.generarCategorias();
        this.despacharEventoCarga();
        this.iniciarAutoRefresco();
      })
      .catch((error) => {
        console.warn('⚠️ Error Sheets. Usando local...', error);
        this.usarRespaldoLocal();
      });
  },
  
  cargarDesdeSheets: function() {
    return new Promise((resolve, reject) => {
      const urlConTimestamp = this.sheetURL + '&t=' + Date.now();
      
      fetch(urlConTimestamp)
        .then(response => {
          if (!response.ok) throw new Error('Error HTTP: ' + response.status);
          return response.text();
        })
        .then(csvText => {
          this.procesarCSV(csvText);
          resolve();
        })
        .catch(error => {
          console.error('❌ Error cargando desde Sheets:', error);
          reject(error);
        });
    });
  },
  
  procesarCSV: function(csvText) {
    this.productos = [];
    const lineas = csvText.split('\n').filter(linea => linea.trim() !== '');
    
    if (lineas.length < 2) {
      console.warn('⚠️ CSV vacío o sin datos');
      return;
    }
    
    // Obtener encabezados reales del CSV
    const encabezadosCSV = this.parsearLineaCSV(lineas[0]);
    console.log('📋 Encabezados detectados:', encabezadosCSV);
    
    // Mapear índices según los encabezados
    const idxId = encabezadosCSV.findIndex(h => h.toLowerCase() === 'id');
    const idxNombre = encabezadosCSV.findIndex(h => h.toLowerCase().includes('nombre'));
    const idxPrecio = encabezadosCSV.findIndex(h => h.toLowerCase().includes('precio'));
    const idxImagen = encabezadosCSV.findIndex(h => h.toLowerCase().includes('imagen'));
    const idxDescripcion = encabezadosCSV.findIndex(h => h.toLowerCase().includes('descripcion') || h.toLowerCase().includes('descriptor'));
    const idxCategoria = encabezadosCSV.findIndex(h => h.toLowerCase().includes('categoria'));
    const idxStock = encabezadosCSV.findIndex(h => h.toLowerCase().includes('stock'));
    const idxActivo = encabezadosCSV.findIndex(h => h.toLowerCase().includes('activo'));
    const idxOrden = encabezadosCSV.findIndex(h => h.toLowerCase().includes('orden'));
    
    // Procesar cada línea de producto
    for (let i = 1; i < lineas.length; i++) {
      const valores = this.parsearLineaCSV(lineas[i]);
      
      // Si no hay suficientes valores, saltar
      if (valores.length < 3) continue;
      
      // Crear objeto producto
      const producto = {
        id: idxId >= 0 ? parseInt(valores[idxId]) || i : i,
        name: idxNombre >= 0 ? valores[idxNombre] || 'Sin nombre' : 'Sin nombre',
        price: idxPrecio >= 0 ? parseInt(valores[idxPrecio]) || 0 : 0,
        image: idxImagen >= 0 ? valores[idxImagen] || 'https://via.placeholder.com/300' : 'https://via.placeholder.com/300',
        description: idxDescripcion >= 0 ? valores[idxDescripcion] || 'Descripción no disponible' : 'Descripción no disponible',
        specificDetails: idxDescripcion >= 0 ? valores[idxDescripcion] || 'Detalles no disponibles' : 'Detalles no disponibles',
        category: idxCategoria >= 0 ? valores[idxCategoria] || 'Sin categoría' : 'Sin categoría',
        department: 'mercado',
        status: 'available'
      };
      
      // Determinar si está activo
      if (idxActivo >= 0) {
        const activo = valores[idxActivo].toUpperCase() === 'TRUE';
        const stock = idxStock >= 0 ? parseInt(valores[idxStock]) || 0 : 0;
        producto.status = (activo && stock > 0) ? 'available' : 'unavailable';
      }
      
      // Orden personalizado si existe
      if (idxOrden >= 0) {
        producto.orden = parseInt(valores[idxOrden]) || 0;
      }
      
      // Solo agregar productos válidos
      if (producto.name !== 'Sin nombre' && producto.price > 0) {
        this.productos.push(producto);
      }
    }
    
    // Ordenar por "orden" si existe, sino por categoría y nombre
    if (this.productos[0] && this.productos[0].orden !== undefined) {
      this.productos.sort((a, b) => {
        if (a.orden !== b.orden) return a.orden - b.orden;
        if (a.category !== b.category) return a.category.localeCompare(b.category);
        return a.name.localeCompare(b.name);
      });
    } else {
      this.productos.sort((a, b) => {
        if (a.category !== b.category) return a.category.localeCompare(b.category);
        return a.name.localeCompare(b.name);
      });
    }
    
    console.log(`📊 Procesados ${this.productos.length} productos`);
  },
  
  parsearLineaCSV: function(linea) {
    const valores = [];
    let dentroDeComillas = false;
    let valorActual = '';
    
    for (let i = 0; i < linea.length; i++) {
      const char = linea[i];
      
      if (char === '"') {
        dentroDeComillas = !dentroDeComillas;
      } else if (char === ',' && !dentroDeComillas) {
        valores.push(valorActual.trim());
        valorActual = '';
      } else {
        valorActual += char;
      }
    }
    
    // Último valor
    valores.push(valorActual.trim());
    return valores;
  },
  
  guardarEnCache: function() {
    try {
      const cacheData = {
        productos: this.productos,
        categorias: this.categorias,
        timestamp: Date.now(),
        version: '1.1'
      };
      localStorage.setItem('catalogoCache_ElResolvito', JSON.stringify(cacheData));
      console.log('💾 Catálogo guardado en caché');
    } catch (e) {
      console.warn('No se pudo guardar en caché:', e);
    }
  },
  
  cargarDesdeCache: function() {
    try {
      const cache = localStorage.getItem('catalogoCache_ElResolvito');
      if (!cache) return false;
      
      const data = JSON.parse(cache);
      // Usar caché solo si tiene menos de 2 horas y es versión compatible
      if (Date.now() - data.timestamp < 7200000 && data.version === '1.1') {
        this.productos = data.productos || [];
        this.categorias = data.categorias || [];
        console.log('💿 Catálogo recuperado desde caché');
        return true;
      } else {
        console.log('⏰ Caché expirado o versión incompatible');
        localStorage.removeItem('catalogoCache_ElResolvito');
      }
    } catch (e) {
      console.warn('Caché corrupto:', e);
      localStorage.removeItem('catalogoCache_ElResolvito');
    }
    return false;
  },
  
  usarRespaldoLocal: function() {
    if (window.catalogo && window.catalogo.productos) {
      this.productos = window.catalogo.productos;
      this.cargado = true;
      this.generarCategorias();
      this.despacharEventoCarga();
      console.log('🔄 Usando catálogo local como respaldo');
    } else {
      console.error('❌ No hay catálogo local disponible');
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
  
  iniciarAutoRefresco: function() {
    // Refrescar cada 10 minutos
    setInterval(() => {
      if (document.visibilityState === 'visible') {
        console.log('🔄 Actualizando catálogo automáticamente...');
        this.cargarDesdeSheets()
          .then(() => {
            this.guardarEnCache();
            this.generarCategorias();
            window.dispatchEvent(new CustomEvent('catalogoActualizado', {
              detail: { productos: this.productos, categorias: this.categorias }
            }));
            console.log('✅ Catálogo actualizado desde Sheets');
          })
          .catch(err => console.log('No se pudo actualizar:', err));
      }
    }, 600000);
  },
  
  despacharEventoCarga: function() {
    const event = new CustomEvent('catalogoCargado', {
      detail: { 
        productos: this.productos,
        categorias: this.categorias,
        timestamp: Date.now()
      }
    });
    window.dispatchEvent(event);
  },
  
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
  },
  
  buscarProductos: function(termino) {
    const busqueda = termino.toLowerCase();
    return this.productos.filter(p => 
      p.name.toLowerCase().includes(busqueda) || 
      p.description.toLowerCase().includes(busqueda) ||
      p.category.toLowerCase().includes(busqueda)
    );
  }
};

// Inicializar automáticamente
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
