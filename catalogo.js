// catalogo.js
const catalogo = {
  productos: [
    // --- MERCADO ---
    { id: 1, name: "Aceite", price: 970, image: "https://i.postimg.cc/bvfLRwLH/aceite.jpg", description: "Botella de aceite vegetal.", specificDetails: "1 Litro", category: "Mercado", department: "mercado", status: "available", hasBoxOption: false, weight: 1.0 },
    { id: 2, name: "Arroz", price: 650, image: "https://i.postimg.cc/ZRR352mX/arroz.jpg", description: "Arroz brasileño, precio de oferta.", specificDetails: "Paquete de 1 kg", category: "Mercado", department: "mercado", status: "available", hasBoxOption: false, weight: 1.0 },
    { id: 3, name: "Spaghetti", price: 350, image: "https://i.postimg.cc/rpBWC2DW/spaguetis.png", description: "Pasta de trigo.", specificDetails: "Paquete de 500g", category: "Mercado", department: "mercado", status: "available", hasBoxOption: false, weight: 0.5 },
    { id: 4, name: "Picadillo", price: 380, image: "https://i.postimg.cc/pdhzFLLR/picadillo-de-pollo.png", description: "Carne molida de ave.", specificDetails: "Paquete de 500g", category: "Cárnicos", department: "mercado", status: "available", hasBoxOption: false, weight: 0.5 },
    { id: 5, name: "Salchichas", price: 400, image: "https://i.postimg.cc/R0mKFv73/salchichas-1-paquete.png", description: "Salchichas de ave.", specificDetails: "1 paquete (10 unid)", category: "Cárnicos", department: "mercado", status: "available", hasBoxOption: false, weight: 0.5 },
    { id: 6, name: "Cerveza Presidente", price: 220, image: "https://i.postimg.cc/sXBWqMwz/cerveza-predidente-precio-220.png", description: "Cerveza pilsener ligera.", specificDetails: "Lata de 355 ml", category: "Líquidos", department: "mercado", status: "available", hasBoxOption: true, boxPrice: 5280, boxQuantity: 24, weight: 0.38 },
    { id: 7, name: "Malta Guajira", price: 250, image: "https://i.postimg.cc/HWv2h2BL/malta_guajira.jpg", description: "Bebida de malta refrescante.", specificDetails: "Botella de 355 ml", category: "Líquidos", department: "mercado", status: "available", hasBoxOption: false, weight: 0.38 },
    { id: 8, name: "Leche Condensada", price: 520, image: "https://i.postimg.cc/fRbxMK43/leche-condensada.jpg", description: "Dulce y cremosa.", specificDetails: "Lata de 397g", category: "Mercado", department: "mercado", status: "available", hasBoxOption: false, weight: 0.45 },
    { id: 9, name: "Jabón Ridel", price: 160, image: "https://i.postimg.cc/rm2qNxty/jabon-de-ba-o.jpg", description: "Suave para la piel.", specificDetails: "Pastilla de 100g", category: "Aseo Personal", department: "mercado", status: "available", hasBoxOption: false, weight: 0.1 },
    { id: 10, name: "Refresco Instant.", price: 40, image: "https://i.postimg.cc/MTzsbBM1/refresco-1.png", description: "Sobre de refresco en polvo.", specificDetails: "Para 1.5 Litros", category: "Líquidos", department: "mercado", status: "available", hasBoxOption: false, weight: 0.01 },
    { id: 11, name: "Hígado de Pollo", price: 850, image: "https://i.postimg.cc/Zn9vvrkb/higado.jpg", description: "Fresco y nutritivo.", specificDetails: "Paquete de 1 kg", category: "Cárnicos", department: "mercado", status: "available", hasBoxOption: false, weight: 1.0 },
    { id: 12, name: "Whisky Jolly", price: 400, image: "https://i.postimg.cc/mD2Ydz9M/whisky.png", description: "Bebida espirituosa.", specificDetails: "Botella de 200 ml", category: "Líquidos", department: "mercado", status: "available", hasBoxOption: false, weight: 0.25 },
    { id: 13, name: "Frijol Negro", price: 880, image: "https://i.postimg.cc/rFt14B4k/frijol_negro.jpg", description: "Legumbre esencial.", specificDetails: "Paquete de 1 kg", category: "Mercado", department: "mercado", status: "available", hasBoxOption: false, weight: 1.0 },
    { id: 14, name: "Galletas SaltiBloks", price: 890, image: "https://i.postimg.cc/c4qpfNz7/Galletas-7-tacos.png", description: "Crujientes y saladas.", specificDetails: "1 paquete (7 tacos)", category: "Confituras", department: "mercado", status: "available", hasBoxOption: false, weight: 0.3 },
    { id: 15, name: "Detergente Brillante", price: 350, image: "https://i.postimg.cc/sXwcy9zw/detergente.jpg", description: "Limpieza profunda.", specificDetails: "Bolsa de 400g", category: "Aseo Personal", department: "mercado", status: "available", hasBoxOption: false, weight: 0.4 },
    { id: 16, name: "Cerveza Unlaguer", price: 250, image: "https://i.postimg.cc/HLv56w03/cerveza-ulaguer-precio-300.png", description: "Ligera y refrescante.", specificDetails: "Lata de 355 ml", category: "Líquidos", department: "mercado", status: "available", hasBoxOption: true, boxPrice: 6000, boxQuantity: 24, weight: 0.38 },
    { id: 17, name: "Cerveza Cristal", price: 280, image: "https://i.postimg.cc/MZ5gbYw8/cristal.png", description: "Clásica cubana.", specificDetails: "Lata de 355 ml", category: "Líquidos", department: "mercado", status: "available", hasBoxOption: true, boxPrice: 6720, boxQuantity: 24, weight: 0.38 },
    { id: 18, name: "Azúcar Blanca", price: 600, image: "https://i.postimg.cc/c40RbWXB/azucar_blanca.jpg", description: "Endulza tus momentos.", specificDetails: "Paquete de 1 kg", category: "Mercado", department: "mercado", status: "available", hasBoxOption: false, weight: 1.0 },
    { id: 19, name: "Papel Sanitario", price: 530, image: "https://i.postimg.cc/K8BD4yFK/papel_sanitario.jpg", description: "Suave y resistente.", specificDetails: "Paquete de 4 rollos", category: "Aseo Personal", department: "mercado", status: "available", hasBoxOption: false, weight: 0.5 },
    { id: 20, name: "Malta Morena", price: 210, image: "https://i.postimg.cc/7YCV82Wn/malta_morena.jpg", description: "Sabor intenso.", specificDetails: "Lata de 8 oz", category: "Líquidos", department: "mercado", status: "available", hasBoxOption: false, weight: 0.25 },
    { id: 22, name: "Jabón Pemila", price: 160, image: "https://i.postimg.cc/X7qNdKr0/jabon_de_baño_pemila_.png", description: "Aroma fresco.", specificDetails: "Pastilla de 100g", category: "Aseo Personal", department: "mercado", status: "available", hasBoxOption: false, weight: 0.1 },
    { id: 23, name: "Pasta de Tomate", price: 120, image: "https://i.postimg.cc/k5CFbhXT/pasta_de_tomate.jpg", description: "Concentrado de tomate.", specificDetails: "Bolsa de 70g", category: "Mercado", department: "mercado", status: "available", hasBoxOption: false, weight: 0.07 },

    // --- ROPA ---
    // Cartera - Nueva Oferta
    { id: 103, name: "Cartera 1", price: 0, image: "https://i.postimg.cc/HL23TTq8/cartera_1.png", description: "Cartera de nueva oferta.", specificDetails: "Nueva Oferta", category: "Accesorios", department: "ropa", status: "new_offer", hasBoxOption: false, weight: 0.3 },
    { id: 104, name: "Cartera 2", price: 0, image: "https://i.postimg.cc/ZqcjJJGZ/cartera_2.png", description: "Cartera de nueva oferta.", specificDetails: "Nueva Oferta", category: "Accesorios", department: "ropa", status: "new_offer", hasBoxOption: false, weight: 0.3 },
    { id: 105, name: "Cartera 3", price: 0, image: "https://i.postimg.cc/s2cK33kF/cartera_3.png", description: "Cartera de nueva oferta.", specificDetails: "Nueva Oferta", category: "Accesorios", department: "ropa", status: "new_offer", hasBoxOption: false, weight: 0.3 },
    { id: 106, name: "Cartera 4", price: 0, image: "https://i.postimg.cc/jjKZVDFt/cartera_4.png", description: "Cartera de nueva oferta.", specificDetails: "Nueva Oferta", category: "Accesorios", department: "ropa", status: "new_offer", hasBoxOption: false, weight: 0.3 },
    { id: 107, name: "Cartera 5", price: 0, image: "https://i.postimg.cc/W4jXRdHL/cartera_5.png", description: "Cartera de nueva oferta.", specificDetails: "Nueva Oferta", category: "Accesorios", department: "ropa", status: "new_offer", hasBoxOption: false, weight: 0.3 },
    { id: 108, name: "Cartera 6", price: 0, image: "https://i.postimg.cc/wBH0K1bZ/cartera_6.png", description: "Cartera de nueva oferta.", specificDetails: "Nueva Oferta", category: "Accesorios", department: "ropa", status: "new_offer", hasBoxOption: false, weight: 0.3 },
    // Ropa - Nuevas Adiciones
    { id: 109, name: "Pantalón Pesquero", price: 4500, image: "https://i.postimg.cc/tRfkqSMh/pantalonpesqueroelastizadotalla_l7m7xl_4500pesos.png", description: "Pantalón pesquero elastizado.", specificDetails: "Tallas L, XL", category: "Hombre", department: "ropa", status: "available", hasBoxOption: false, weight: 0.4 },
    { id: 110, name: "Chaqueta de Mezclilla", price: 4800, image: "https://i.postimg.cc/DfD6vjMw/chhaqueta_de_mezclillaniña4800pesos.png", description: "Chaqueta de mezclilla para niña.", specificDetails: "Niña", category: "Niños", department: "ropa", status: "available", hasBoxOption: false, weight: 0.5 },
    { id: 111, name: "Prenda Casual 1", price: 0, image: "https://i.postimg.cc/QCBqg1HN/1765242140334.png", description: "Prenda de ropa casual, nueva oferta.", specificDetails: "Nueva Oferta", category: "Unisex", department: "ropa", status: "new_offer", hasBoxOption: false, weight: 0.3 },
    { id: 112, name: "Prenda Casual 2", price: 0, image: "https://i.postimg.cc/0QXfJc2r/1765242105732.png", description: "Prenda de ropa casual, nueva oferta.", specificDetails: "Nueva Oferta", category: "Unisex", department: "ropa", status: "new_offer", hasBoxOption: false, weight: 0.3 },
    { id: 113, name: "Prenda Casual 3", price: 0, image: "https://i.postimg.cc/QtdmtRD6/1765241930180.png", description: "Prenda de ropa casual, nueva oferta.", specificDetails: "Nueva Oferta", category: "Unisex", department: "ropa", status: "new_offer", hasBoxOption: false, weight: 0.3 },


    // --- ELECTRO ---
    // Electrodomésticos - Nuevas Adiciones (Sin precio)
    { id: 203, name: "Smart TV", price: 0, image: "https://i.postimg.cc/gkCgDSyr/smart_tv_32_pulgadas.png", description: "Smart TV en nueva oferta.", specificDetails: "32 pulgadas", category: "Electrónica", department: "electro", status: "new_offer", hasBoxOption: false, weight: 5.0 },
    { id: 204, name: "Smart TV", price: 0, image: "https://i.postimg.cc/xTw6RxGb/smart_tv_55_pulgadas.png", description: "Smart TV en nueva oferta.", specificDetails: "55 pulgadas", category: "Electrónica", department: "electro", status: "new_offer", hasBoxOption: false, weight: 15.0 },
    { id: 205, name: "Smart TV", price: 0, image: "https://i.postimg.cc/9XN84FrG/smart_tv_50_pulgadas.jpg", description: "Smart TV en nueva oferta.", specificDetails: "50 pulgadas", category: "Electrónica", department: "electro", status: "new_offer", hasBoxOption: false, weight: 12.0 },
    { id: 206, name: "Arrocera", price: 0, image: "https://i.postimg.cc/MKC9DP0n/arroceracapacidad1.8l.png", description: "Arrocera eléctrica en nueva oferta.", specificDetails: "Capacidad 1.8L", category: "Cocina", department: "electro", status: "new_offer", hasBoxOption: false, weight: 2.5 }
  ],

  // Función para obtener productos por departamento
  obtenerPorDepartamento: function(departamento) {
    return this.productos.filter(producto => producto.department === departamento);
  },

  // Función para obtener productos por categoría
  obtenerPorCategoria: function(departamento, categoria) {
    return this.productos.filter(producto => 
      producto.department === departamento && producto.category === categoria
    );
  },

  // Función para buscar productos
  buscar: function(termino) {
    const terminoLower = termino.toLowerCase();
    return this.productos.filter(producto => 
      producto.name.toLowerCase().includes(terminoLower) ||
      producto.description.toLowerCase().includes(terminoLower) ||
      producto.category.toLowerCase().includes(terminoLower)
    );
  },

  // Función para obtener producto por ID
  obtenerPorId: function(id) {
    return this.productos.find(producto => producto.id === id);
  }
};
