// catalogo-dinamico.js - Versión optimizada para GitHub CSV
// Carga MUCHO más rápido desde GitHub Pages que desde Google Sheets

const CatalogoDinamico = {
  // 🔗 URL de tu CSV en GitHub - CAMBIA ESTO POR TU URL
  // Sube tu archivo CSV a GitHub y pon aquí la URL
  csvURL: 'https://elresolving.github.io/productos.csv',
  
  // ⚙️ Configuración
  config: {
    cacheHoras: 24,           // Cache válido por 24 horas
    timeout: 8000,            // 8 segundos máximo de espera
    autoRefresh: 30,          // Actualizar cada 30 minutos
    version: '2.0'
  },
  
  // 📦 Datos en memoria
  productos: [],
  categorias: [],
  cargado: false,
  fuente: 'none',            // 'github', 'cache', 'local', 'emergencia'
  
  // ==================== INICIALIZACIÓN PRINCIPAL ====================
  inicializar: function() {
    console.log('⚡ Inicializando catálogo dinámico (GitHub CSV)...');
    console.log('📡 URL configurada:', this.csvURL);
    
    // 1. Intentar desde caché (rápido)
    if (this.cargarDesdeCache()) {
      console.log('💾 Catálogo cargado desde caché (', this.productos.length, 'productos)');
      this.fuente = 'cache';
      this.finalizarCarga();
      this.iniciarAutoRefresco(); // Actualizar en segundo plano
      return;
    }
    
    // 2. Cargar desde GitHub CSV (con timeout)
    console.log('🌐 Intentando cargar desde GitHub CSV...');
    this.cargarDesdeGitHub()
      .then(() => {
        console.log('✅ CSV cargado desde GitHub:', this.productos.length, 'productos');
        this.fuente = 'github';
        this.guardarEnCache(); // Guardar para próxima vez
        this.finalizarCarga();
        this.iniciarAutoRefresco();
      })
      .catch((error) => {
        console.warn('⚠️ Error cargando desde GitHub:', error.message);
        this.usarRespaldoLocal();
      });
  },
  
  // ==================== CARGAR DESDE GITHUB CSV ====================
  cargarDesdeGitHub: function() {
    return new Promise((resolve, reject) => {
      // Agregar timestamp para evitar caché del navegador
      const urlConTimestamp = this.csvURL + '?t=' + Date.now();
      
      // Configurar timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        reject(new Error('Timeout: El servidor tardó demasiado'));
      }, this.config.timeout);
      
      fetch(urlConTimestamp, { signal: controller.signal })
        .then(response => {
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new Error('Error HTTP ' + response.status + ': ' + response.statusText);
          }
          
          return response.text();
        })
        .then(csvText => {
          // Verificar que no esté vacío
          if (!csvText || csvText.trim().length === 0) {
            throw new Error('CSV vacío recibido');
          }
          
          console.log('📄 CSV recibido (' + csvText.length + ' caracteres)');
          this.procesarCSV(csvText);
          resolve();
        })
        .catch(error => {
          clearTimeout(timeoutId);
          console.error('❌ Fetch error:', error);
          reject(error);
        });
    });
  },
  
  // ==================== PROCESAR CSV ====================
  procesarCSV: function(csvText) {
    // Limpiar arrays existentes
    this.productos = [];
    
    // Mostrar preview del CSV (solo en desarrollo)
    if (csvText.length > 0) {
      const preview = csvText.substring(0, 200).replace(/\n/g, ' ');
      console.log('👁️ Preview CSV:', preview + '...');
    }
    
    // Dividir líneas y filtrar vacías
    const lineas = csvText.split('\n').filter(linea => linea.trim() !== '');
    
    if (lineas.length < 2) {
      console.error('❌ CSV tiene menos de 2 líneas');
      throw new Error('CSV vacío o sin datos');
    }
    
    console.log('📊 Líneas en CSV:', lineas.length);
    
    // Encabezados (primera línea)
    const encabezados = lineas[0].split(',').map(h => {
      // Limpiar y normalizar nombres de columnas
      return h.trim()
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Quitar acentos
        .replace(/[^a-z0-9\s]/g, '') // Solo letras, números y espacios
        .replace(/\s+/g, '_'); // Espacios a guiones bajos
    });
    
    console.log('🏷️ Encabezados detectados:', encabezados);
    
    // Buscar índices de columnas (flexible)
    const idxId = this.obtenerIndice(encabezados, ['id', 'codigo', 'numero']);
    const idxNombre = this.obtenerIndice(encabezados, ['nombre', 'name', 'producto', 'descripcion']);
    const idxCategoria = this.obtenerIndice(encabezados, ['categoria', 'category', 'tipo', 'grupo']);
    const idxPrecio = this.obtenerIndice(encabezados, ['precio', 'price', 'costo', 'valor']);
    const idxImagen = this.obtenerIndice(encabezados, ['imagen', 'image', 'foto', 'url', 'link']);
    const idxDescripcion = this.obtenerIndice(encabezados, ['descripcion', 'description', 'detalles', 'info']);
    const idxStock = this.obtenerIndice(encabezados, ['stock', 'cantidad', 'inventario', 'disponible']);
    const idxActivo = this.obtenerIndice(encabezados, ['activo', 'active', 'disponible', 'habilitado']);
    
    console.log('📍 Índices encontrados:', {
      id: idxId, nombre: idxNombre, categoria: idxCategoria,
      precio: idxPrecio, imagen: idxImagen, descripcion: idxDescripcion,
      stock: idxStock, activo: idxActivo
    });
    
    // Procesar cada línea de producto
    let productosProcesados = 0;
    let productosError = 0;
    let productosInactivos = 0;
    
    for (let i = 1; i < lineas.length; i++) {
      try {
        const valores = this.parsearLineaCSV(lineas[i]);
        
        // Si no hay suficientes valores, saltar
        const minColumnas = Math.max(idxId, idxNombre, idxPrecio, idxImagen, 0) + 1;
        if (valores.length < minColumnas) {
          console.warn(`⚠️ Línea ${i+1} ignorada - pocas columnas (${valores.length} < ${minColumnas})`);
          productosError++;
          continue;
        }
        
        // Obtener valores (con defaults seguros)
        const idVal = valores[idxId] || (i).toString();
        const nombreVal = valores[idxNombre] || 'Producto ' + i;
        const categoriaVal = valores[idxCategoria] || 'General';
        const precioVal = valores[idxPrecio] || '0';
        const imagenVal = valores[idxImagen] || 'https://via.placeholder.com/300x300/cccccc/969696?text=Producto';
        const descripcionVal = valores[idxDescripcion] || '';
        const stockVal = valores[idxStock] || '1';
        const activoVal = valores[idxActivo] || 'true';
        
        // Limpiar y convertir valores
        const id = parseInt(idVal) || i;
        const nombre = this.limpiarTexto(nombreVal);
        const categoria = this.limpiarTexto(categoriaVal);
        const precio = parseInt(precioVal.replace(/\D/g, '')) || 0;
        const imagen = this.limpiarURL(imagenVal);
        const descripcion = this.limpiarTexto(descripcionVal);
        const stock = parseInt(stockVal) || 0;
        
        // Determinar si está activo
        const estaActivo = this.esActivo(activoVal);
        const tieneStock = stock > 0;
        const disponible = estaActivo && tieneStock;
        
        // Crear objeto producto
        const producto = {
          id: id,
          name: nombre,
          price: precio,
          image: imagen,
          description: descripcion,
          specificDetails: descripcion,
          category: categoria,
          department: 'mercado',
          stock: stock,
          status: disponible ? 'available' : 'unavailable'
        };
        
        // Solo agregar productos con nombre y precio válido
        if (producto.name && producto.name !== 'Producto ' + i && producto.price > 0) {
          this.productos.push(producto);
          productosProcesados++;
          
          if (!disponible) {
            productosInactivos++;
          }
        } else {
          productosError++;
        }
        
      } catch (error) {
        console.error(`❌ Error procesando línea ${i+1}:`, error.message);
        productosError++;
      }
    }
    
    console.log(`📈 Resultado: ${productosProcesados} productos OK, ${productosError} errores, ${productosInactivos} inactivos`);
    
    // Si no se procesó nada, lanzar error
    if (this.productos.length === 0) {
      throw new Error('No se pudo procesar ningún producto del CSV');
    }
  },
  
  // ==================== PARSER CSV AVANZADO ====================
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
  
  // ==================== FUNCIONES AUXILIARES ====================
  obtenerIndice: function(encabezados, nombresPosibles) {
    for (const nombre of nombresPosibles) {
      const idx = encabezados.indexOf(nombre);
      if (idx !== -1) return idx;
    }
    // Si no encuentra, buscar parcialmente
    for (const nombre of nombresPosibles) {
      for (let i = 0; i < encabezados.length; i++) {
        if (encabezados[i].includes(nombre) || nombre.includes(encabezados[i])) {
          return i;
        }
      }
    }
    return -1; // No encontrado
  },
  
  limpiarTexto: function(texto) {
    if (!texto || texto === 'null' || texto === 'undefined') return '';
    
    // Decodificar caracteres UTF-8 mal interpretados
    let textoLimpio = texto.toString();
    
    // Reemplazar secuencias UTF-8 comunes mal interpretadas
    const reemplazos = {
      'Ã¡': 'á', 'Ã©': 'é', 'Ã­': 'í', 'Ã³': 'ó', 'Ãº': 'ú',
      'Ã±': 'ñ', 'Ã¼': 'ü', 'Ã': 'Á', 'Ã‰': 'É', 'Ã': 'Í',
      'Ã“': 'Ó', 'Ãš': 'Ú', 'Ã‘': 'Ñ', 'Ãœ': 'Ü',
      'Â¿': '¿', 'Â¡': '¡', 'Âª': 'ª', 'Âº': 'º',
      'Ã§': 'ç', 'Ã£': 'ã', 'Ãµ': 'õ'
    };
    
    for (const [mal, bien] of Object.entries(reemplazos)) {
      textoLimpio = textoLimpio.replace(new RegExp(mal, 'g'), bien);
    }
    
    // También intentar decodificación URI
    try {
      textoLimpio = decodeURIComponent(escape(textoLimpio));
    } catch (e) {
      // Si falla, continuar con el texto limpio
    }
    
    return textoLimpio.trim();
  },
  
  limpiarURL: function(url) {
    if (!url || url === 'null' || url === 'undefined') {
      return 'https://via.placeholder.com/300x300/cccccc/969696?text=Imagen+no+disponible';
    }
    
    let urlLimpia = url.toString().trim();
    
    // Asegurar que empiece con http/https
    if (!urlLimpia.startsWith('http://') && !urlLimpia.startsWith('https://')) {
      urlLimpia = 'https://' + urlLimpia;
    }
    
    // Limpiar caracteres problemáticos
    urlLimpia = urlLimpia
      .replace(/Ã¡/g, 'á').replace(/Ã©/g, 'é').replace(/Ã­/g, 'í')
      .replace(/Ã³/g, 'ó').replace(/Ãº/g, 'ú').replace(/Ã±/g, 'ñ');
    
    return urlLimpia;
  },
  
  esActivo: function(valor) {
    if (!valor) return true;
    
    const valorStr = valor.toString().toLowerCase().trim();
    const activos = ['true', 't', 'yes', 'y', 'si', 'sí', '1', 'verdadero', 'activado', 'on'];
    const inactivos = ['false', 'f', 'no', 'n', '0', 'falso', 'desactivado', 'off'];
    
    if (activos.includes(valorStr)) return true;
    if (inactivos.includes(valorStr)) return false;
    
    // Por defecto, activo
    return true;
  },
  
  // ==================== SISTEMA DE CACHÉ ====================
  cargarDesdeCache: function() {
    try {
      const cacheKey = 'catalogoCache_ElResolvito';
      const cache = localStorage.getItem(cacheKey);
      
      if (!cache) {
        console.log('💭 No hay caché previo');
        return false;
      }
      
      const data = JSON.parse(cache);
      
      // Verificar versión
      if (data.version !== this.config.version) {
        console.log('🔄 Versión de caché diferente, ignorando');
        localStorage.removeItem(cacheKey);
        return false;
      }
      
      // Cache válido por X horas
      const horasCache = this.config.cacheHoras;
      const msCache = horasCache * 60 * 60 * 1000;
      const cacheValido = Date.now() - data.timestamp < msCache;
      
      if (cacheValido && data.productos && data.productos.length > 0) {
        this.productos = data.productos;
        this.categorias = data.categorias || [];
        this.fuente = 'cache';
        return true;
      } else {
        console.log('⏰ Caché expirado o inválido');
        localStorage.removeItem(cacheKey);
      }
    } catch (e) {
      console.warn('⚠️ Error leyendo caché:', e.message);
      try {
        localStorage.removeItem('catalogoCache_ElResolvito');
      } catch (e2) {
        // Ignorar
      }
    }
    return false;
  },
  
  guardarEnCache: function() {
    try {
      const cacheData = {
        productos: this.productos,
        categorias: this.categorias,
        timestamp: Date.now(),
        version: this.config.version,
        fuente: this.fuente
      };
      
      localStorage.setItem('catalogoCache_ElResolvito', JSON.stringify(cacheData));
      console.log('💾 Catálogo guardado en caché (válido por ' + this.config.cacheHoras + ' horas)');
    } catch (e) {
      console.warn('No se pudo guardar en caché (localStorage puede estar lleno)');
    }
  },
  
  // ==================== RESPALDO LOCAL ====================
  usarRespaldoLocal: function() {
    console.log('🔄 Intentando cargar respaldo local...');
    
    // Intentar desde catalogo.js (si existe)
    if (typeof window.catalogo !== 'undefined' && window.catalogo.productos) {
      this.productos = window.catalogo.productos;
      this.fuente = 'local';
      this.finalizarCarga();
      console.log('🛡️ Catálogo cargado desde respaldo local');
      return;
    }
    
    // Si no hay respaldo, crear uno de emergencia
    this.crearCatalogoEmergencia();
  },
  
  crearCatalogoEmergencia: function() {
    console.log('🚨 Creando catálogo de emergencia...');
    
    this.productos = [
      {
        id: 1,
        name: "Aceite Vegetal",
        price: 500,
        image: "https://i.postimg.cc/FFdbnBBS/aceite.jpg",
        description: "Aceite para cocinar 1L",
        specificDetails: "Aceite vegetal de calidad",
        category: "Alimentos",
        department: "mercado",
        stock: 10,
        status: "available"
      },
      {
        id: 2,
        name: "Arroz Blanco",
        price: 350,
        image: "https://i.postimg.cc/ZRR352mX/arroz.jpg",
        description: "Arroz de grano largo 1Kg",
        specificDetails: "Arroz premium",
        category: "Alimentos",
        department: "mercado",
        stock: 15,
        status: "available"
      },
      {
        id: 3,
        name: "Spaghetti",
        price: 300,
        image: "https://i.postimg.cc/rpBWC2DW/spaguetis.png",
        description: "Pasta spaghetti 500g",
        specificDetails: "Pasta de trigo",
        category: "Alimentos",
        department: "mercado",
        stock: 20,
        status: "available"
      }
    ];
    
    this.fuente = 'emergencia';
    this.finalizarCarga();
    console.log('🆘 Catálogo de emergencia creado (3 productos)');
  },
  
  // ==================== FINALIZAR CARGA ====================
  finalizarCarga: function() {
    this.cargado = true;
    this.generarCategorias();
    this.despacharEventoCarga();
    
    console.log('🎉 Catálogo ' + this.fuente + ' listo:', this.productos.length, 'productos');
    
    // Mostrar fuente
    const fuenteDisplay = {
      'github': '🌐 GitHub CSV',
      'cache': '💾 Caché Local',
      'local': '🛡️ Respaldo Local',
      'emergencia': '🚨 Emergencia',
      'none': '❓ Desconocida'
    };
    
    console.log('📊 Fuente:', fuenteDisplay[this.fuente] || this.fuente);
  },
  
  // ==================== CATEGORÍAS ====================
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
  
  // ==================== AUTO-REFRESCO ====================
  iniciarAutoRefresco: function() {
    // Solo refrescar si viene de GitHub
    if (this.fuente !== 'github') return;
    
    // Refrescar cada X minutos (config.autoRefresh)
    const minutos = this.config.autoRefresh;
    const msRefresh = minutos * 60 * 1000;
    
    console.log('🔄 Auto-refresco configurado cada ' + minutos + ' minutos');
    
    setInterval(() => {
      if (document.visibilityState === 'visible') {
        console.log('🔄 Actualizando catálogo en segundo plano...');
        this.cargarDesdeGitHub()
          .then(() => {
            this.guardarEnCache();
            this.generarCategorias();
            
            // Notificar a la página que hay nuevos datos
            window.dispatchEvent(new CustomEvent('catalogoActualizado', {
              detail: {
                productos: this.productos,
                categorias: this.categorias,
                fuente: this.fuente,
                timestamp: Date.now()
              }
            }));
            
            console.log('✅ Catálogo actualizado desde GitHub (segundo plano)');
          })
          .catch(err => {
            console.log('⚠️ No se pudo actualizar en segundo plano:', err.message);
          });
      }
    }, msRefresh);
  },
  
  // ==================== EVENTOS ====================
  despacharEventoCarga: function() {
    const event = new CustomEvent('catalogoCargado', {
      detail: {
        productos: this.productos,
        categorias: this.categorias,
        fuente: this.fuente,
        timestamp: Date.now(),
        totalProductos: this.productos.length
      }
    });
    window.dispatchEvent(event);
  },
  
  // ==================== MÉTODOS DE CONSULTA ====================
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
    if (!termino || termino.trim() === '') return this.productos;
    
    const busqueda = this.limpiarTexto(termino).toLowerCase();
    return this.productos.filter(p =>
      this.limpiarTexto(p.name).toLowerCase().includes(busqueda) ||
      this.limpiarTexto(p.description).toLowerCase().includes(busqueda) ||
      this.limpiarTexto(p.category).toLowerCase().includes(busqueda)
    );
  },
  
  // ==================== INFORMACIÓN DEL SISTEMA ====================
  getInfo: function() {
    return {
      version: this.config.version,
      cargado: this.cargado,
      fuente: this.fuente,
      totalProductos: this.productos.length,
      totalCategorias: this.categorias.length,
      urlCSV: this.csvURL,
      cacheHoras: this.config.cacheHoras
    };
  },
  
  // ==================== FORZAR RECARGA ====================
  forzarRecarga: function() {
    console.log('🔄 Forzando recarga del catálogo...');
    this.cargado = false;
    this.productos = [];
    this.categorias = [];
    
    // Limpiar caché
    try {
      localStorage.removeItem('catalogoCache_ElResolvito');
    } catch (e) {
      // Ignorar
    }
    
    // Recargar
    this.inicializar();
    return true;
  }
};

// ==================== INICIALIZACIÓN AUTOMÁTICA ====================
(function() {
  // Esperar a que el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      console.log('📄 DOM listo - Iniciando catálogo...');
      CatalogoDinamico.inicializar();
    });
  } else {
    // DOM ya está listo
    console.log('📄 DOM ya listo - Iniciando catálogo...');
    CatalogoDinamico.inicializar();
  }
  
  // También exponer un método manual por si acaso
  window.iniciarCatalogo = function() {
    console.log('🔄 Iniciando catálogo manualmente...');
    CatalogoDinamico.inicializar();
  };
})();

// ==================== HACER DISPONIBLE GLOBALMENTE ====================
window.CatalogoDinamico = CatalogoDinamico;

// ==================== SISTEMA DE FALBACK ULTRA-RÁPIDO ====================
// Si después de 10 segundos no cargó, mostrar algo
setTimeout(function() {
  if (!CatalogoDinamico.cargado || CatalogoDinamico.productos.length === 0) {
    console.log('⏱️  Timeout: Catálogo no cargó en 10 segundos');
    
    // Crear productos mínimos si no hay nada
    if (CatalogoDinamico.productos.length === 0) {
      CatalogoDinamico.crearCatalogoEmergencia();
    }
  }
}, 10000);

console.log('✅ catalogo-dinamico.js cargado y listo');
