// catalogo-dinamico.js - Versión actualizada para tu CSV
const CatalogoDinamico = {
  // 🔴 REEMPLAZA ESTE ENLACE POR EL TUYO DE GOOGLE SHEETS
  sheetURL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTU0rzVf0v0v0v0v0v0v0v0v0v0v0v0v0v0v0v0v0v0v0v0v0v0v0v0/pub?output=csv',
  
  // O usar datos CSV directos si no tienes Google Sheets
  csvData: `id,nombre,categoria,precio,imagen,descripcion,stock,activo,orden
1,Atún ,Alimentos y conservas,540,https://i.postimg.cc/76xHK6zt/atun_precio_500.png,Lata estándar 200g,10,TRUE,1
2,Pasta de tomate,Alimentos y conservas,380,https://i.postimg.cc/gjjYPTNv/pasta_tomate_precio_350.png,400 g,10,TRUE,2
3,Aceitunas Verdes en Rodajas con Pimiento Fragata,Alimentos y conservas,750,https://i.postimg.cc/4yyJTSBj/pimiento_presio_750.png,142 g,10,TRUE,3
4,Café Dualis ,Alimentos y conservas,1450,https://i.postimg.cc/WbZBX2hN/cafe_dualis_250_g_precio_1450.png,Paquete 250 g,10,TRUE,4
5,Café Dufiltro ,Alimentos y conservas,1450,https://i.postimg.cc/hG26fv31/cafe_Dufiltro_250_g_precio_1450.png,Paquete 250 g,10,TRUE,5
6,pan rallado Enepa,Alimentos y conservas,450,https://i.postimg.cc/qvQwHpNJ/pan-rallado.webp,Paquete,10,TRUE,6
7,Cartón de huevo,Alimentos y conservas,3000,https://i.postimg.cc/sDWkwVvv/carton_de_huevo_30_u_precio_3100.png,Cartón,10,TRUE,7
8,Leche condensada,Alimentos y conservas,520,https://i.postimg.cc/tT2XwjtT/leche_condensada.png, 397 g,10,TRUE,8
9,Harina blanca,Alimentos y conservas,600,https://i.postimg.cc/3xc2NHFB/harina_blanca1_kg.png,Paquete 1 Kg,10,TRUE,9
10,Chicoticos Pelly ,Snacks y golosinas,400,https://i.postimg.cc/1zv2fXjZ/chicoticos_pelly_90_g_precio_400.png,Paquete 90 g,10,TRUE,10
11,Papitas Campesinas,Snacks y golosinas,690,https://i.postimg.cc/cLgrDtf9/papitas_campesinas_precio_690.png,Paquete,10,TRUE,11
12,Pelly de Jamón,Snacks y golosinas,580,https://i.postimg.cc/pdQV7frX/pelly_jamon_precio_580.png,Paquete,10,TRUE,12
13,Mayonesa Mediana,Salsas,850,https://i.postimg.cc/KzJZw2rR/mayonesa_precio_850.png,Frasco mediano,10,TRUE,13
14,Mayonesa Grande,Salsas,1100,https://i.postimg.cc/Px2t9jzz/mayonesa_precio1100.png,Frasco grande,10,TRUE,14
15,Cuchilla de Afeitar,Higiene personal,100,https://i.postimg.cc/8CdkdW7x/cuchilla_de_afeitar_precio_100.png,Unidad,10,TRUE,15
16,Jabón Marwa,Higiene personal,150,https://i.postimg.cc/3RK8tRpR/jabon_marwa_precio_150.png,Pastilla,10,TRUE,16
17,Papel Sanitario,Higiene personal,490,https://i.postimg.cc/bwW289qD/papel_sanitario_precio_490i.png,Paquete,10,TRUE,17
18,Toallas Sanitarias,Higiene personal,450,https://i.postimg.cc/KjjZyH0b/toallas_sanitarias_precio_450.png,Paquete,10,TRUE,18
19,Toallas Húmedas,Higiene personal,690,https://i.postimg.cc/W4ZSP3cw/toallas_humedas_precio_690.png,Paquete,10,TRUE,19
20,Jabón de Lavar,Aseo del hogar,250,https://i.postimg.cc/V6YfK6Mz/jabon_de_lavar_precio_250.png,Pastilla,10,TRUE,20
21,Perfume Candy,Perfumes y desodorantes,3100,https://i.postimg.cc/vTgJRyhp/perfume_candy_precio_3100.png,Frasco 50 ml,10,TRUE,21
22,Perfume genérico,Perfumes y desodorantes,3100,https://i.postimg.cc/ZKrT0PPG/perfume_precio_3100.png, 50 ml,10,TRUE,22
23,Perfume Q,Perfumes y desodorantes,3100,https://i.postimg.cc/CL03P3Dn/perfume_q_precio_3100.png, 50 ml,10,TRUE,23
24,Desodorante Obao,Perfumes y desodorantes,1100,https://i.postimg.cc/PxtXSxD2/desodorante_obao_precio_1100.png,Roll-on,10,TRUE,24
25,Desodorante Rush Blanco,Perfumes y desodorantes,1000,https://i.postimg.cc/FR9rTRS8/desodorante_rush_blanco_precio_1000.png,Roll-on,10,TRUE,25
26,Desodorante Rush,Perfumes y desodorantes,1000,https://i.postimg.cc/sXVjTXSF/desodorante_rush_precio_1000.png,Roll_on,10,TRUE,26
27,Colonia Niña,Perfumes y desodorantes,1100,https://i.postimg.cc/G3v04rsM/colonia_nina.png, 100 ml,10,TRUE,27
28,Macarrones,Pastas y fideos,300,https://i.postimg.cc/Hsmz1H69/macarrones_precio_300.png,460 g,10,TRUE,28
29,Sopas instantáneas,Pastas y fideos,160,https://i.postimg.cc/FzNTpQqK/sopas_instantaneas_precio_160.png,Paquete,10,TRUE,29
30,Licor de fresa,Bebidas ,2500,https://i.postimg.cc/59YT2x5p/licor_de_fresa_precio_2500.png,Botella,10,TRUE,30
31,Licor Cocobay,Bebidas ,2500,https://i.postimg.cc/7ZDW90Fz/locor_cocobay_precio_2500.png,Botella,10,TRUE,31
32,Whisky Spirit 200 ml,Bebidas ,320,https://i.postimg.cc/4N8W6q1t/tea_precio_320.png, 200 ml,10,TRUE,32
33,Whisky Sir Albin,Bebidas ,1350,https://i.postimg.cc/cLyrb4T0/whisky_1L_precio_1350.png,Botella 1 L,10,TRUE,33
34,Whisky Sir Albin,Bebidas,550,https://i.postimg.cc/y84kbYnC/whisky_sir_albin_precio_550.png,Botella pequeña,10,TRUE,34
35,Vino Pluvium,Bebidas ,1200,https://i.postimg.cc/XNLLWmmx/vino_pluvium_precio_1200.png,Botella,10,TRUE,35
36,Baterías Triple A,Electrónicos y accesorios,300,https://i.postimg.cc/DZ2vxZsT/Gemini_Generated_Image_824rio824rio824r.png,Pack de 4 unidades,10,TRUE,36`,
  
  // Catálogo en memoria
  productos: [],
  categorias: [],
  cargado: false,
  
  // ==================== INICIALIZACIÓN PRINCIPAL ====================
  inicializar: function() {
    console.log('🔄 Inicializando catálogo dinámico...');
    
    // 1. Primero intentar desde caché (si existe)
    if (this.cargarDesdeCache()) {
      console.log('✅ Catálogo cargado desde caché local');
      this.cargado = true;
      this.despacharEventoCarga();
      this.iniciarAutoRefresco();
      return;
    }
    
    // 2. Intentar cargar desde Google Sheets
    this.cargarDesdeSheets()
      .then(() => {
        console.log('✅ Catálogo cargado desde Google Sheets');
        this.guardarEnCache();
        this.cargado = true;
        this.despacharEventoCarga();
        this.iniciarAutoRefresco();
      })
      .catch((error) => {
        console.warn('⚠️ No se pudo cargar desde Sheets. Usando CSV local...', error);
        this.usarCSVLocal();
      });
  },
  
  // ==================== CARGAR DESDE GOOGLE SHEETS ====================
  cargarDesdeSheets: function() {
    return new Promise((resolve, reject) => {
      // Si no hay URL de Sheets, usar CSV local
      if (!this.sheetURL || this.sheetURL.includes('REEMPLAZA')) {
        reject(new Error('URL de Google Sheets no configurada'));
        return;
      }
      
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
  
  // ==================== USAR CSV LOCAL ====================
  usarCSVLocal: function() {
    try {
      this.procesarCSV(this.csvData);
      this.cargado = true;
      this.despacharEventoCarga();
      console.log('📄 Usando CSV local como fuente de datos');
    } catch (error) {
      console.error('❌ Error procesando CSV local:', error);
      this.usarRespaldoLocal();
    }
  },
  
  // ==================== PROCESAR CSV ====================
  procesarCSV: function(csvText) {
    this.productos = [];
    
    const lineas = csvText.split('\n').filter(linea => linea.trim() !== '');
    if (lineas.length < 2) throw new Error('CSV vacío o sin datos');
    
    const encabezados = lineas[0].split(',').map(h => h.trim().toLowerCase());
    
    const idxId = encabezados.indexOf('id');
    const idxNombre = encabezados.indexOf('nombre');
    const idxCategoria = encabezados.indexOf('categoria');
    const idxPrecio = encabezados.indexOf('precio');
    const idxImagen = encabezados.indexOf('imagen');
    const idxDescripcion = encabezados.indexOf('descripcion');
    const idxStock = encabezados.indexOf('stock');
    const idxActivo = encabezados.indexOf('activo');
    
    for (let i = 1; i < lineas.length; i++) {
      const valores = this.parsearLineaCSV(lineas[i]);
      if (valores.length < 5) continue;
      
      const producto = {
        id: parseInt(valores[idxId]) || i,
        name: (valores[idxNombre] || 'Sin nombre').trim(),
        price: parseInt(valores[idxPrecio]) || 0,
        image: valores[idxImagen] || 'https://via.placeholder.com/300',
        description: valores[idxDescripcion] || 'Descripción no disponible',
        specificDetails: valores[idxDescripcion] || 'Detalles no disponibles',
        category: valores[idxCategoria] || 'Sin categoría',
        department: 'mercado',
        status: (valores[idxActivo] === 'TRUE' && (parseInt(valores[idxStock]) > 0)) 
                ? 'available' : 'unavailable'
      };
      
      // Solo agregar productos activos
      if (producto.status === 'available') {
        this.productos.push(producto);
      }
    }
    
    this.generarCategorias();
    console.log(`📊 Procesados ${this.productos.length} productos activos`);
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
    
    valores.push(valorActual.trim());
    return valores;
  },
  
  // ==================== SISTEMA DE CACHÉ ====================
  guardarEnCache: function() {
    try {
      const cacheData = {
        productos: this.productos,
        categorias: this.categorias,
        timestamp: Date.now(),
        version: '1.0'
      };
      localStorage.setItem('catalogoCache_Bayona59', JSON.stringify(cacheData));
      console.log('💾 Catálogo guardado en caché local');
    } catch (e) {
      console.warn('No se pudo guardar en caché:', e);
    }
  },
  
  cargarDesdeCache: function() {
    try {
      const cache = localStorage.getItem('catalogoCache_Bayona59');
      if (!cache) return false;
      
      const data = JSON.parse(cache);
      // Usar caché solo si tiene menos de 2 horas (7200000 ms)
      if (Date.now() - data.timestamp < 7200000) {
        this.productos = data.productos || [];
        this.categorias = data.categorias || [];
        console.log('💿 Catálogo recuperado desde caché');
        return true;
      } else {
        console.log('⏰ Caché expirado, recargando...');
        localStorage.removeItem('catalogoCache_Bayona59');
      }
    } catch (e) {
      console.warn('Caché corrupto, eliminando...', e);
      localStorage.removeItem('catalogoCache_Bayona59');
    }
    return false;
  },
  
  // ==================== RESPALDO LOCAL ====================
  usarRespaldoLocal: function() {
    if (window.catalogo && window.catalogo.productos) {
      this.productos = window.catalogo.productos.filter(p => p.status === 'available');
      this.cargado = true;
      this.generarCategorias();
      this.despacharEventoCarga();
      console.log('🔄 Usando catálogo local como respaldo');
    } else {
      console.error('❌ No hay catálogo local disponible');
      // Crear productos mínimos
      this.productos = [{
        id: 1,
        name: 'Producto de ejemplo',
        price: 100,
        image: 'https://via.placeholder.com/300',
        description: 'Descripción de ejemplo',
        category: 'Ejemplo',
        department: 'mercado',
        status: 'available'
      }];
      this.cargado = true;
      this.despacharEventoCarga();
    }
  },
  
  // ==================== CATEGORÍAS ====================
  generarCategorias: function() {
    const cats = new Set();
    this.productos.forEach(p => {
      if (p.category && p.category.trim() !== '') {
        cats.add(p.category.trim());
      }
    });
    this.categorias = Array.from(cats).sort();
  },
  
  // ==================== AUTO-REFRESCO ====================
  iniciarAutoRefresco: function() {
    // Refrescar cada 10 minutos (600000 ms)
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
          .catch(err => console.log('No se pudo actualizar automáticamente:', err));
      }
    }, 600000);
  },
  
  // ==================== EVENTOS ====================
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
  
  // ==================== MÉTODOS DE CONSULTA ====================
  obtenerPorId: function(id) {
    return this.productos.find(p => p.id === id);
  },
  
  obtenerPorCategoria: function(categoria) {
    if (categoria === 'todos') return this.productos;
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
      (p.description && p.description.toLowerCase().includes(busqueda)) ||
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
