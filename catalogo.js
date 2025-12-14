// catálogo.js - versión navegador (sin ES6 modules)

const catalogo = {
  productos: [
    // ========== SECCIÓN MERCADO ==========
    // --- ALIMENTOS Y CONSERVAS ---
    { id: 1, name: 'Atún en lata', price: 540, image: "https://i.postimg.cc/76xHK6zt/atun_precio_500.png", description: 'Atún fresco en conserva, ideal para ensaladas y pastas.', specificDetails: 'Lata estándar', category: 'Alimentos y conservas', department: 'mercado', status: 'available' },
    { id: 2, name: 'Pasta de tomate', price: 380, image: "https://i.postimg.cc/gjjYPTNv/pasta_tomate_precio_350.png", description: 'Concentrado de tomate para salsas y guisos.', specificDetails: 'Paquete', category: 'Alimentos y conservas', department: 'mercado', status: 'available' },
    { id: 3, name: 'Pimiento fresco', price: 810, image: "https://i.postimg.cc/4yyJTSBj/pimiento_presio_750.png", description: 'Pimiento jugoso y lleno de sabor.', specificDetails: 'Unidad', category: 'Alimentos y conservas', department: 'mercado', status: 'available' },
    { id: 4, name: 'Café Dualis 250 g', price: 1560, image: "https://i.postimg.cc/WbZBX2hN/cafe_dualis_250_g_precio_1450.png", description: 'Café molido aromático y balanceado.', specificDetails: 'Paquete 250 g', category: 'Alimentos y conservas', department: 'mercado', status: 'available' },
    { id: 5, name: 'Café Dufiltro 250 g', price: 1560, image: "https://i.postimg.cc/hG26fv31/cafe_Dufiltro_250_g_precio_1450.png", description: 'Café extra fuerte para amantes del sabor intenso.', specificDetails: 'Paquete 250 g', category: 'Alimentos y conservas', department: 'mercado', status: 'available' },
    { id: 6, name: 'Café Enepa', price: 480, image: "https://i.postimg.cc/nhY6f04N/cafe_enepa_precio_450.png", description: 'Café molido de sabor intenso y duradero.', specificDetails: 'Paquete', category: 'Alimentos y conservas', department: 'mercado', status: 'available' },
    { id: 7, name: 'Cartón de huevo 30 u', price: 3240, image: "https://i.postimg.cc/sDWkwVvv/carton_de_huevo_30_u_precio_3000.png", description: 'Huevos frescos en cartón de 30 unidades.', specificDetails: 'Cartón', category: 'Alimentos y conservas', department: 'mercado', status: 'available' },
    { id: 8, name: 'Leche condensada', price: 500, image: "https://i.postimg.cc/tT2XwjtT/leche_condensada.png", description: 'Leche condensada cremosa, perfecta para postres.', specificDetails: 'Lata 397 g', category: 'Alimentos y conservas', department: 'mercado', status: 'available' },
    { id: 9, name: 'Harina blanca 1 Kg', price: 650, image: "https://i.postimg.cc/3xc2NHFB/harina_blanca1_kg.png", description: 'Harina refinada ideal para repostería y panadería.', specificDetails: 'Paquete 1 Kg', category: 'Alimentos y conservas', department: 'mercado', status: 'available' },

    // --- SNACKS Y GOLOSINAS ---
    { id: 10, name: 'Chicoticos Pelly 90 g', price: 430, image: "https://i.postimg.cc/1zv2fXjZ/chicoticos_pelly_90_g_precio_400.png", description: 'Snacks crujientes sabor ajo.', specificDetails: 'Paquete 90 g', category: 'Snacks y golosinas', department: 'mercado', status: 'available' },
    { id: 11, name: 'Papitas Campesinas', price: 745, image: "https://i.postimg.cc/cLgrDtf9/papitas_campesinas_precio_690.png", description: 'Papas fritas con sabor campesino.', specificDetails: 'Paquete', category: 'Snacks y golosinas', department: 'mercado', status: 'available' },
    { id: 12, name: 'Pelly Jamón', price: 620, image: "https://i.postimg.cc/pdQV7frX/pelly_jamon_precio_580.png", description: 'Snacks crujientes sabor jamón.', specificDetails: 'Paquete', category: 'Snacks y golosinas', department: 'mercado', status: 'available' },

    // --- SALSAS ---
    { id: 13, name: 'Mayonesa Mediana', price: 920, image: "https://i.postimg.cc/KzJZw2rR/mayonesa_precio_850.png", description: 'Mayonesa suave y cremosa.', specificDetails: 'Frasco mediano', category: 'Salsas', department: 'mercado', status: 'available' },
    { id: 14, name: 'Mayonesa Grande', price: 1190, image: "https://i.postimg.cc/Px2t9jzz/mayonesa_precio1100.png", description: 'Mayonesa cremosa en presentación grande.', specificDetails: 'Frasco grande', category: 'Salsas', department: 'mercado', status: 'available' },

    // --- HIGIENE PERSONAL ---
    { id: 15, name: 'Cuchilla de Afeitar', price: 110, image: "https://i.postimg.cc/8CdkdW7x/cuchilla_de_afeitar_precio_100.png", description: 'Cuchilla desechable para un afeitado cómodo.', specificDetails: 'Unidad', category: 'Higiene personal', department: 'mercado', status: 'available' },
    { id: 16, name: 'Jabón Marwa', price: 160, image: "https://i.postimg.cc/3RK8tRpR/jabon_marwa_precio_150.png", description: 'Jabón de tocador suave.', specificDetails: 'Pastilla', category: 'Higiene personal', department: 'mercado', status: 'available' },
    { id: 17, name: 'Papel Sanitario', price: 530, image: "https://i.postimg.cc/bwW289qD/papel_sanitario_precio_490i.png", description: 'Papel higiénico suave y resistente.', specificDetails: 'Paquete', category: 'Higiene personal', department: 'mercado', status: 'available' },
    { id: 18, name: 'Toallas Sanitarias', price: 480, image: "https://i.postimg.cc/KjjZyH0b/toallas_sanitarias_precio_450.png", description: 'Toallas sanitarias de alta absorción.', specificDetails: 'Paquete', category: 'Higiene personal', department: 'mercado', status: 'available' },
    { id: 19, name: 'Toallas Húmedas', price: 750, image: "https://i.postimg.cc/W4ZSP3cw/toallas_humedas_precio_690.png", description: 'Toallitas húmedas para cuidado diario.', specificDetails: 'Paquete', category: 'Higiene personal', department: 'mercado', status: 'available' },

    // --- ASEO DEL HOGAR ---
    { id: 20, name: 'Jabón de Lavar', price: 270, image: "https://i.postimg.cc/V6YfK6Mz/jabon_de_lavar_precio_250.png", description: 'Jabón de barra para ropa.', specificDetails: 'Pastilla', category: 'Aseo del hogar', department: 'mercado', status: 'available' },

    // --- PERFUMES Y DESODORANTES ---
    { id: 21, name: 'Perfume Candy', price: 3350, image: "https://i.postimg.cc/vTgJRyhp/perfume_candy_precio_3100.png", description: 'Perfume dulce y moderno con notas frutales.', specificDetails: 'Frasco 50 ml', category: 'Perfumes y desodorantes', department: 'mercado', status: 'available' },
    { id: 22, name: 'Perfume genérico', price: 3350, image: "https://i.postimg.cc/ZKrT0PPG/perfume_precio_3100.png", description: 'Perfume elegante de uso diario.', specificDetails: 'Frasco 50 ml', category: 'Perfumes y desodorantes', department: 'mercado', status: 'available' },
    { id: 23, name: 'Perfume Q', price: 3350, image: "https://i.postimg.cc/CL03P3Dn/perfume_q_precio_3100.png", description: 'Perfume sofisticado con notas florales.', specificDetails: 'Frasco 50 ml', category: 'Perfumes y desodorantes', department: 'mercado', status: 'available' },
    { id: 24, name: 'Desodorante Obao', price: 1190, image: "https://i.postimg.cc/PxtXSxD2/desodorante_obao_precio_1100.png", description: 'Desodorante de larga duración.', specificDetails: 'Spray/Roll-on', category: 'Perfumes y desodorantes', department: 'mercado', status: 'available' },
    { id: 25, name: 'Desodorante Rush Blanco', price: 1080, image: "https://i.postimg.cc/FR9rTRS8/desodorante_rush_blanco_precio_1000.png", description: 'Desodorante fresco y ligero.', specificDetails: 'Roll-on', category: 'Perfumes y desodorantes', department: 'mercado', status: 'available' },
    { id: 26, name: 'Desodorante Rush', price: 1080, image: "https://i.postimg.cc/sXVjTXSF/desodorante_rush_precio_1000.png", description: 'Desodorante clásico de aroma intenso.', specificDetails: 'Spray', category: 'Perfumes y desodorantes', department: 'mercado', status: 'available' },
    { id: 27, name: 'Colonia Niña', price: 1190, image: "https://i.postimg.cc/G3v04rsM/colonia_nina.png", description: 'Colonia infantil con fragancia suave.', specificDetails: 'Botella 100 ml', category: 'Perfumes y desodorantes', department: 'mercado', status: 'available' },

    // --- PASTAS Y FIDEOS ---
    { id: 28, name: 'Macarrones', price: 320, image: "https://i.postimg.cc/Hsmz1H69/macarrones_precio_300.png", description: 'Pasta corta ideal para gratinados.', specificDetails: 'Paquete estándar', category: 'Pastas y fideos', department: 'mercado', status: 'available' },
    { id: 29, name: 'Sopas instantáneas', price: 170, image: "https://i.postimg.cc/FzNTpQqK/sopas_instantaneas_precio_160.png", description: 'Fideos instantáneos listos en minutos.', specificDetails: 'Paquete', category: 'Pastas y fideos', department: 'mercado', status: 'available' },

    // --- BEBIDAS ALCOHÓLICAS Y MALTA ---
    { id: 30, name: 'Licor de fresa', price: 2700, image: "https://i.postimg.cc/59YT2x5p/licor_de_fresa_precio_2500.png", description: 'Licor dulce con sabor a fresa.', specificDetails: 'Botella', category: 'Bebidas alcohólicas y malta', department: 'mercado', status: 'available' },
    { id: 31, name: 'Licor Cocobay', price: 2700, image: "https://i.postimg.cc/7ZDW90Fz/locor_cocobay_precio_2500.png", description: 'Licor tropical sabor coco.', specificDetails: 'Botella', category: 'Bebidas alcohólicas y malta', department: 'mercado', status: 'available' },
    { id: 32, name: 'Whisky Spirit 200 ml', price: 350, image: "https://i.postimg.cc/4N8W6q1t/tea_precio_320.png", description: 'Whisky ligero en presentación pequeña.', specificDetails: 'Botella 200 ml', category: 'Bebidas alcohólicas y malta', department: 'mercado', status: 'available' },
    { id: 33, name: 'Whisky 1L', price: 1450, image: "https://i.postimg.cc/cLyrb4T0/whisky_1L_precio_1350.png", description: 'Whisky premium en botella de 1 litro.', specificDetails: 'Botella 1 L', category: 'Bebidas alcohólicas y malta', department: 'mercado', status: 'available' },
    { id: 34, name: 'Whisky Sir Albin', price: 590, image: "https://i.postimg.cc/y84kbYnC/whisky_sir_albin_precio_550.png", description: 'Whisky suave en presentación pequeña.', specificDetails: 'Botella pequeña', category: 'Bebidas alcohólicas y malta', department: 'mercado', status: 'available' },
    { id: 35, name: 'Vino Pluvium', price: 1290, image: "https://i.postimg.cc/XNLLWmmx/vino_pluvium_precio_1200.png", description: 'Vino de mesa con sabor afrutado.', specificDetails: 'Botella', category: 'Bebidas alcohólicas y malta', department: 'mercado', status: 'available' },

    // --- ELECTRÓNICOS Y ACCESORIOS (dentro de mercado) ---
    { id: 36, name: 'Baterías Triple A', price: 320, image: "https://i.postimg.cc/DZ2vxZsT/Gemini_Generated_Image_824rio824rio824r.png", description: 'Paquete de baterías AAA de larga duración.', specificDetails: 'Pack de 4 unidades', category: 'Electrónicos y accesorios', department: 'mercado', status: 'available' },

    // ========== SECCIÓN ROPA Y CALZADO ==========
    // NUEVAS OFERTAS - PRÓXIMAMENTE
    { id: 37, name: 'Mono Azul Casual', price: 0, image: "https://i.postimg.cc/cLqk1wHC/modelomonoazul.png", description: 'Mono azul de moda casual, perfecto para el día a día.', specificDetails: 'Tallas S-M-L | PRÓXIMAMENTE', category: 'Próximamente', department: 'ropa', status: 'unavailable' },
    { id: 38, name: 'Mono Negro Elegante', price: 0, image: "https://i.postimg.cc/T38N2gww/modelomononegro.png", description: 'Mono negro elegante para ocasiones especiales.', specificDetails: 'Tallas S-M-L | PRÓXIMAMENTE', category: 'Próximamente', department: 'ropa', status: 'unavailable' },
    { id: 39, name: 'Tenis Warrior Modelo', price: 0, image: "https://i.postimg.cc/Mpk3ZVTB/modelosteniswarior.png", description: 'Tenis deportivos Warrior, máximo confort y estilo.', specificDetails: 'Tallas 38-45 | PRÓXIMAMENTE', category: 'Próximamente', department: 'ropa', status: 'unavailable' },
    { id: 40, name: 'Vestido Amarillo Verano', price: 0, image: "https://i.postimg.cc/NjhCGmM9/modelovestidoa_arillo.png", description: 'Vestido amarillo fresco ideal para el verano.', specificDetails: 'Tallas XS-S-M | PRÓXIMAMENTE', category: 'Próximamente', department: 'ropa', status: 'unavailable' },
    { id: 41, name: 'Modelo Tenis Warrior', price: 0, image: "https://i.postimg.cc/rwSnDs0x/modseloteniswarior.png", description: 'Tenis Warrior en presentación de modelo.', specificDetails: 'Tallas 38-45 | PRÓXIMAMENTE', category: 'Próximamente', department: 'ropa', status: 'unavailable' },
    { id: 42, name: 'Chaqueta Capucha Morada', price: 0, image: "https://i.postimg.cc/P5m3CJpM/muchachacapuchamorada.png", description: 'Chaqueta con capucha morada, estilo urbano.', specificDetails: 'Tallas S-M-L | PRÓXIMAMENTE', category: 'Próximamente', department: 'ropa', status: 'unavailable' },
    { id: 43, name: 'Chaqueta Pescador', price: 0, image: "https://i.postimg.cc/wBgWLzL5/muchachapescador.png", description: 'Chaqueta estilo pescador, resistente y cómoda.', specificDetails: 'Tallas S-M-L | PRÓXIMAMENTE', category: 'Próximamente', department: 'ropa', status: 'unavailable' },
    { id: 44, name: 'Conjunto Tenis Warrior', price: 0, image: "https://i.postimg.cc/fbDHmsYM/muchachaplazateniswarior.png", description: 'Conjunto completo con Tenis Warrior.', specificDetails: 'Tallas S-M-L | PRÓXIMAMENTE', category: 'Próximamente', department: 'ropa', status: 'unavailable' },
    { id: 45, name: 'Short 4 Puertas Mujer', price: 0, image: "https://i.postimg.cc/Dz6xcNc7/muchachashort4puertas.png", description: 'Short deportivo mujer, marca 4 Puertas.', specificDetails: 'Tallas S-M-L | PRÓXIMAMENTE', category: 'Próximamente', department: 'ropa', status: 'unavailable' },
    { id: 46, name: 'Conjunto 4 Puertas Hombre', price: 0, image: "https://i.postimg.cc/9fbLBkBm/muchacho4puertas.png", description: 'Conjunto completo hombre, marca 4 Puertas.', specificDetails: 'Tallas S-M-L | PRÓXIMAMENTE', category: 'Próximamente', department: 'ropa', status: 'unavailable' },
    { id: 47, name: 'Tenis Warrior Hombre', price: 0, image: "https://i.postimg.cc/fbC8vPvJ/muchachoplazateniswarior.png", description: 'Tenis Warrior para hombre, máximo rendimiento.', specificDetails: 'Tallas 40-45 | PRÓXIMAMENTE', category: 'Próximamente', department: 'ropa', status: 'unavailable' },
    { id: 48, name: 'Conjunto 4 Puertas Mujer', price: 0, image: "https://i.postimg.cc/mDr8pSd9/muchavha4puertas.png", description: 'Conjunto completo mujer, marca 4 Puertas.', specificDetails: 'Tallas XS-S-M | PRÓXIMAMENTE', category: 'Próximamente', department: 'ropa', status: 'unavailable' },
    { id: 49, name: 'Pitusa Talla 34 - Acelan', price: 0, image: "https://i.postimg.cc/g0sgK7Kv/pitusa_marca_acelan_talla_34_precio.jpg", description: 'Pitusa marca Acelan, talla 34, calidad premium.', specificDetails: 'Talla 34 | PRÓXIMAMENTE', category: 'Próximamente', department: 'ropa', status: 'unavailable' },
    { id: 50, name: 'Tenis Warrior Original', price: 0, image: "https://i.postimg.cc/bJv3VR6k/tenis_warior.png", description: 'Tenis Warrior original, durabilidad garantizada.', specificDetails: 'Tallas 36-45 | PRÓXIMAMENTE', category: 'Próximamente', department: 'ropa', status: 'unavailable' },

    // ========== SECCIÓN ELECTRODOMÉSTICOS ==========
    // NUEVAS OFERTAS - PRÓXIMAMENTE
    { id: 51, name: 'Smart TV 32 Pulgadas', price: 0, image: "https://i.postimg.cc/gkCgDSyr/smart_tv_32_pulgadas.png", description: 'Smart TV 32" Full HD con conexión Wi-Fi y apps integradas.', specificDetails: '32" | Full HD | Smart TV | PRÓXIMAMENTE', category: 'Próximamente', department: 'electro', status: 'unavailable' },
    { id: 52, name: 'Smart TV 50 Pulgadas', price: 0, image: "https://i.postimg.cc/9XN84FrG/smart_tv_50_pulgadas.jpg", description: 'Smart TV 50" 4K UHD con HDR y sistema operativo avanzado.', specificDetails: '50" | 4K UHD | HDR | Smart TV | PRÓXIMAMENTE', category: 'Próximamente', department: 'electro', status: 'unavailable' },
    { id: 53, name: 'Smart TV 55 Pulgadas', price: 0, image: "https://i.postimg.cc/xTw6RxGb/smart_tv_55_pulgadas.png", description: 'Smart TV 55" 4K con Dolby Vision y sonido envolvente.', specificDetails: '55" | 4K | Dolby Vision | Smart TV | PRÓXIMAMENTE', category: 'Próximamente', department: 'electro', status: 'unavailable' }
  ],

  // Función auxiliar para obtener producto por ID
  obtenerPorId: function(id) {
    return this.productos.find(p => p.id === id);
  },

  // Función para obtener productos por departamento (sección HTML)
  obtenerPorDepartamento: function(departamento) {
    return this.productos.filter(p => p.department === departamento);
  },

  // Función para obtener productos DISPONIBLES por departamento (sección HTML)
  obtenerDisponiblesPorDepartamento: function(departamento) {
    return this.productos.filter(p => p.department === departamento && p.status === 'available');
  },

  // Función para obtener productos PRÓXIMAMENTE por departamento
  obtenerProximosPorDepartamento: function(departamento) {
    return this.productos.filter(p => p.department === departamento && p.status === 'unavailable');
  },

  // Función para obtener productos por categoría dentro de un departamento
  obtenerPorDepartamentoYCategoria: function(departamento, categoria) {
    return this.productos.filter(p => 
      p.department === departamento && 
      p.category === categoria
    );
  },

  // Función para obtener todas las categorías de un departamento
  obtenerCategoriasPorDepartamento: function(departamento) {
    const productosDepartamento = this.productos.filter(p => p.department === departamento);
    const categorias = productosDepartamento.map(p => p.category);
    return [...new Set(categorias)];
  }
};

// ✅ Hacer disponible globalmente para el HTML
window.catalogo = catalogo;
