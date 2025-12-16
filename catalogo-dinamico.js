// catálogo-dinamico.js - VERSIÓN CON URL CORRECTA
const CatalogoDinamico = {
  // ✅ USA ESTA URL EXACTA (la que me compartiste)
  sheetURL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT2RBATNCTKwgP7EYeiG0Od16zAgR0mrnsxKBITDvaX62a47l0AyGF-isufaRs6Ayk5hXWI3j_jAHeu/pub?gid=0&single=true&output=csv',
  
  productos: [],
  categorias: [],
  cargado: false,
  
  inicializar: function() {
    console.log('🔄 Inicializando catálogo dinámico...');
    
    // Primero intentar desde caché
    if (this.cargarDesdeCache()) {
      console.log('✅ Catálogo desde caché:', this.productos.length, 'productos');
      this.cargado = true;
      this.despacharEventoCarga();
      this.iniciarAutoRefresco();
      return;
    }
    
    // Luego cargar desde Sheets
    this.cargarDesdeSheets()
      .then(() => {
        console.log('✅ Catálogo desde Google Sheets:', this.productos.length, 'productos');
        this.guardarEnCache();
        this.cargado = true;
        this.generarCategorias();
        this.despacharEventoCarga();
        this.iniciarAutoRefresco();
      })
      .catch((error) => {
        console.warn('⚠️ Error cargando desde Sheets. Usando respaldo local...', error);
        this.usarRespaldoLocal();
      });
  },
  
  cargarDesdeSheets: function() {
    return new Promise((resolve, reject) => {
      // Agregar timestamp para evitar caché
      const urlConTimestamp = this.sheetURL + '&t=' + Date.now();
      console.log('📡 Cargando desde:', urlConTimestamp);
      
      fetch(urlConTimestamp)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
          }
          return response.text();
        })
        .then(csvText => {
          console.log('📄 CSV recibido, procesando...');
          this.procesarCSV(csvText);
          resolve();
        })
        .catch(error => {
          console.error('❌ Error en fetch:', error);
          reject(error);
        });
    });
  },
  
  procesarCSV: function(csvText) {
    this.productos = [];
    
    // Limpiar y dividir líneas
    const lineas = csvText.split('\n')
      .map(linea => linea.trim())
      .filter(linea => linea !== '');
    
    console.log(`📊 Total de líneas en CSV: ${lineas.length}`);
    
    if (lineas.length < 2) {
      console.warn('⚠️ CSV vacío o sin datos');
      return;
    }
    
    // Obtener encabezados
    const encabezados = this.parsearLineaCSV(lineas[0]);
    console.log('📋 Encabezados:', encabezados);
    
    // Mapear índices de columnas
    const idxNombre = encabezados.findIndex(h => 
      h.toLowerCase().includes('nombre') || h.toLowerCase().includes('name')
    );
    const idxPrecio = encabezados.findIndex(h => 
      h.toLowerCase().includes('precio') || h.toLowerCase().includes('price')
    );
    const idxImagen = encabezados.findIndex(h => 
      h.toLowerCase().includes('imagen') || h.toLowerCase().includes('image')
    );
    const idxDescripcion = encabezados.findIndex(h => 
      h.toLowerCase().includes('descripcion') || 
      h.toLowerCase().includes('description') ||
      h.toLowerCase().includes('descriptor')
    );
    const idxCategoria = encabezados.findIndex(h => 
      h.toLowerCase().includes('categoria') || 
      h.toLowerCase().includes('category')
    );
    const idxStock = encabezados.findIndex(h => 
      h.toLowerCase().includes('stock')
    );
    const idxActivo = encabezados.findIndex(h => 
      h.toLowerCase().includes('activo') || h.toLowerCase().includes('active')
    );
    const idxOrden = encabezados.findIndex(h => 
      h.toLowerCase().includes('orden') || h.toLowerCase().includes('order')
    );
    
    console.log('🔍 Índices encontrados:');
    console.log('- Nombre:', idxNombre);
    console.log('- Precio:', idxPrecio);
    console.log('- Imagen:', idxImagen);
    console.log('- Descripción:', idxDescripcion);
    console.log('- Categoría:', idxCategoria);
    
    // Procesar cada producto
    for (let i = 1; i < lineas.length; i++) {
      try {
        const valores = this.parsearLineaCSV(lineas[i]);
        
        // Validar que tenga los datos mínimos
        if (valores.length < 3 || idxNombre === -1 || idxPrecio === -1) {
          continue;
        }
        
        const nombre = valores[idxNombre] || '';
        const precio = parseInt(valores[idxPrecio]) || 0;
        
        if (!nombre || precio <= 0) {
          continue;
        }
        
        const producto = {
          id: i, // ID secuencial
          name: nombre,
          price: precio,
          image: idxImagen >= 0 && valores[idxImagen] ? 
                 valores[idxImagen] : 'https://via.placeholder.com/300',
          description: idxDescripcion >= 0 && valores[idxDescripcion] ? 
                      valores[idxDescripcion] : 'Descripción no disponible',
          specificDetails: idxDescripcion >= 0 && valores[idxDescripcion] ? 
                          valores[idxDescripcion] : 'Detalles no disponibles',
          category: idxCategoria >= 0 && valores[idxCategoria] ? 
                   valores[idxCategoria] : 'Sin categoría',
          department: 'mercado',
          status: 'available'
        };
        
        // Verificar stock y activo si existen
        if (idxStock >= 0 && idxActivo >= 0) {
          const stock = parseInt(valores[idxStock]) || 0;
          const activo = valores[idxActivo].toString().toUpperCase() === 'TRUE';
          producto.status = (activo && stock > 0) ? 'available' : 'unavailable';
        }
        
        // Agregar orden si existe
        if (idxOrden >= 0) {
          producto.orden = parseInt(valores[idxOrden]) || 0;
        }
        
        this.productos.push(producto);
        
      } catch (error) {
        console.warn(`⚠️ Error procesando línea ${i + 1}:`, error);
      }
    }
    
    // Ordenar productos
    this.ordenarProductos();
    
    console.log(`✅ Procesados ${this.productos.length} productos válidos`);
  },
  
  ordenarProductos: function() {
    // Ordenar por "orden" si existe, sino por categoría y nombre
    if (this.productos.length > 0 && this.productos[0].orden !== undefined) {
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
  },
  
  parsearLineaCSV: function(linea) {
    // Método robusto para parsear CSV
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
    
    // Limpiar comillas dobles
    return valores.map(v => v.replace(/^"|"$/g, ''));
  },
  
  guardarEnCache: function() {
    try {
      const cacheData = {
        productos: this.productos,
        categorias: this.categorias,
        timestamp: Date.now(),
        version: '1.2'
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
      
      // Caché válido por 1 hora (3600000 ms)
      if (Date.now() - data.timestamp < 3600000) {
        this.productos = data.productos || [];
        this.categorias = data.categorias || [];
        console.log('💿 Catálogo desde caché:', this.productos.length, 'productos');
        return true;
      } else {
        console.log('⏰ Caché expirado');
        localStorage.removeItem('catalogoCache_ElResolvito');
      }
    } catch (e) {
      console.warn('Caché corrupto:', e);
      localStorage.removeItem('catalogoCache_ElResolvito');
    }
    return false;
  },
  
  usarRespaldoLocal: function() {
    console.log('🔄 Intentando usar respaldo local...');
    
    if (window.catalogo && window.catalogo.productos && window.catalogo.productos.length > 0) {
      this.productos = window.catalogo.productos;
      this.cargado = true;
      this.generarCategorias();
      this.despacharEventoCarga();
      console.log('✅ Usando catálogo local:', this.productos.length, 'productos');
    } else {
      console.error('❌ No hay catálogo local disponible');
      // Crear array vacío para evitar errores
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
    console.log('🏷️ Categorías generadas:', this.categorias.length);
  },
  
  iniciarAutoRefresco: function() {
    // Refrescar cada 5 minutos (300000 ms)
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
            console.log('✅ Catálogo actualizado');
          })
          .catch(err => console.log('No se pudo actualizar:', err));
      }
    }, 300000);
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
    console.log('📢 Evento de catálogo cargado despachado');
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

// Inicializar automáticamente cuando se carga la página
(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      CatalogoDinamico.inicializar();
    });
  } else {
    CatalogoDinamico.inicializar();
  }
})();

// Hacer disponible globalmente
window.CatalogoDinamico = CatalogoDinamico;

