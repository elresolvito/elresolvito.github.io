// ============================================
// BASE DE DATOS DE PRODUCTOS (36 productos)
// ============================================
const PRODUCTS = [
    { id: 1, nombre: "Atún en lata", categoria: "Alimentos y conservas", precio: 540, imagen: "https://i.postimg.cc/76xHK6zt/atun_precio_500.png", descripcion: "Lata 200g" },
    { id: 2, nombre: "Pasta de tomate", categoria: "Alimentos y conservas", precio: 350, imagen: "https://i.postimg.cc/gjjYPTNv/pasta_tomate_precio_350.png", descripcion: "Paquete" },
    { id: 3, nombre: "Pimiento fresco", categoria: "Alimentos y conservas", precio: 750, imagen: "https://i.postimg.cc/4yyJTSBj/pimiento_presio_750.png", descripcion: "Unidad" },
    { id: 4, nombre: "Café Dualis 250g", categoria: "Alimentos y conservas", precio: 1450, imagen: "https://i.postimg.cc/WbZBX2hN/cafe_dualis_250_g_precio_1450.png", descripcion: "Paquete 250g" },
    { id: 5, nombre: "Café Dufiltro 250g", categoria: "Alimentos y conservas", precio: 1450, imagen: "https://i.postimg.cc/hG26fv31/cafe_Dufiltro_250_g_precio_1450.png", descripcion: "Paquete 250g" },
    { id: 6, nombre: "Café Enepa", categoria: "Alimentos y conservas", precio: 470, imagen: "https://i.postimg.cc/nhY6f04N/cafe_enepa_precio_450.png", descripcion: "Paquete" },
    { id: 7, nombre: "Cartón de huevo 30u", categoria: "Alimentos y conservas", precio: 3000, imagen: "https://i.postimg.cc/sDWkwVvv/carton_de_huevo_30_u_precio_3000.png", descripcion: "Cartón" },
    { id: 8, nombre: "Leche condensada", categoria: "Alimentos y conservas", precio: 950, imagen: "https://i.postimg.cc/tT2XwjtT/leche_condensada.png", descripcion: "Lata 397g" },
    { id: 9, nombre: "Harina blanca 1Kg", categoria: "Alimentos y conservas", precio: 600, imagen: "https://i.postimg.cc/3xc2NHFB/harina_blanca1_kg.png", descripcion: "Paquete 1Kg" },
    { id: 10, nombre: "Chicoticos Pelly 90g", categoria: "Snacks y golosinas", precio: 400, imagen: "https://i.postimg.cc/1zv2fXjZ/chicoticos_pelly_90_g_precio_400.png", descripcion: "Paquete 90g" },
    { id: 11, nombre: "Papitas Campesinas", categoria: "Snacks y golosinas", precio: 690, imagen: "https://i.postimg.cc/cLgrDtf9/papitas_campesinas_precio_690.png", descripcion: "Paquete" },
    { id: 12, nombre: "Pelly Jamón", categoria: "Snacks y golosinas", precio: 580, imagen: "https://i.postimg.cc/pdQV7frX/pelly_jamon_precio_580.png", descripcion: "Paquete" },
    { id: 13, nombre: "Mayonesa Mediana", categoria: "Salsas", precio: 850, imagen: "https://i.postimg.cc/KzJZw2rR/mayonesa_precio_850.png", descripcion: "Frasco mediano" },
    { id: 14, nombre: "Mayonesa Grande", categoria: "Salsas", precio: 1100, imagen: "https://i.postimg.cc/Px2t9jzz/mayonesa_precio1100.png", descripcion: "Frasco grande" },
    { id: 15, nombre: "Cuchilla de Afeitar", categoria: "Higiene personal", precio: 100, imagen: "https://i.postimg.cc/8CdkdW7x/cuchilla_de_afeitar_precio_100.png", descripcion: "Unidad" },
    { id: 16, nombre: "Jabón Marwa", categoria: "Higiene personal", precio: 150, imagen: "https://i.postimg.cc/3RK8tRpR/jabon_marwa_precio_150.png", descripcion: "Pastilla" },
    { id: 17, nombre: "Papel Sanitario", categoria: "Higiene personal", precio: 490, imagen: "https://i.postimg.cc/bwW289qD/papel_sanitario_precio_490i.png", descripcion: "Paquete" },
    { id: 18, nombre: "Toallas Sanitarias", categoria: "Higiene personal", precio: 450, imagen: "https://i.postimg.cc/KjjZyH0b/toallas_sanitarias_precio_450.png", descripcion: "Paquete" },
    { id: 19, nombre: "Toallas Húmedas", categoria: "Higiene personal", precio: 690, imagen: "https://i.postimg.cc/W4ZSP3cw/toallas_humedas_precio_690.png", descripcion: "Paquete" },
    { id: 20, nombre: "Jabón de Lavar", categoria: "Aseo del hogar", precio: 250, imagen: "https://i.postimg.cc/V6YfK6Mz/jabon_de_lavar_precio_250.png", descripcion: "Pastilla" },
    { id: 21, nombre: "Perfume Candy", categoria: "Perfumes y desodorantes", precio: 3100, imagen: "https://i.postimg.cc/vTgJRyhp/perfume_candy_precio_3100.png", descripcion: "Frasco 50ml" },
    { id: 22, nombre: "Perfume genérico", categoria: "Perfumes y desodorantes", precio: 3100, imagen: "https://i.postimg.cc/ZKrT0PPG/perfume_precio_3100.png", descripcion: "Frasco 50ml" },
    { id: 23, nombre: "Perfume Q", categoria: "Perfumes y desodorantes", precio: 3100, imagen: "https://i.postimg.cc/CL03P3Dn/perfume_q_precio_3100.png", descripcion: "Frasco 50ml" },
    { id: 24, nombre: "Desodorante Obao", categoria: "Perfumes y desodorantes", precio: 1100, imagen: "https://i.postimg.cc/PxtXSxD2/desodorante_obao_precio_1100.png", descripcion: "Spray/Roll-on" },
    { id: 25, nombre: "Desodorante Rush Blanco", categoria: "Perfumes y desodorantes", precio: 1000, imagen: "https://i.postimg.cc/FR9rTRS8/desodorante_rush_blanco_precio_1000.png", descripcion: "Roll-on" },
    { id: 26, nombre: "Desodorante Rush", categoria: "Perfumes y desodorantes", precio: 1000, imagen: "https://i.postimg.cc/sXVjTXSF/desodorante_rush_precio_1000.png", descripcion: "Spray" },
    { id: 27, nombre: "Colonia Niña", categoria: "Perfumes y desodorantes", precio: 1100, imagen: "https://i.postimg.cc/G3v04rsM/colonia_nina.png", descripcion: "Botella 100ml" },
    { id: 28, nombre: "Macarrones", categoria: "Pastas y fideos", precio: 300, imagen: "https://i.postimg.cc/Hsmz1H69/macarrones_precio_300.png", descripcion: "Paquete" },
    { id: 29, nombre: "Sopas instantáneas", categoria: "Pastas y fideos", precio: 160, imagen: "https://i.postimg.cc/FzNTpQqK/sopas_instantaneas_precio_160.png", descripcion: "Paquete" },
    { id: 30, nombre: "Licor de fresa", categoria: "Bebidas alcohólicas y malta", precio: 2500, imagen: "https://i.postimg.cc/59YT2x5p/licor_de_fresa_precio_2500.png", descripcion: "Botella" },
    { id: 31, nombre: "Licor Cocobay", categoria: "Bebidas alcohólicas y malta", precio: 2500, imagen: "https://i.postimg.cc/7ZDW90Fz/locor_cocobay_precio_2500.png", descripcion: "Botella" },
    { id: 32, nombre: "Whisky Spirit 200ml", categoria: "Bebidas alcohólicas y malta", precio: 320, imagen: "https://i.postimg.cc/4N8W6q1t/tea_precio_320.png", descripcion: "Botella 200ml" },
    { id: 33, nombre: "Whisky 1L", categoria: "Bebidas alcohólicas y malta", precio: 1350, imagen: "https://i.postimg.cc/cLyrb4T0/whisky_1L_precio_1350.png", descripcion: "Botella 1L" },
    { id: 34, nombre: "Whisky Sir Albin", categoria: "Bebidas alcohólicas y malta", precio: 550, imagen: "https://i.postimg.cc/y84kbYnC/whisky_sir_albin_precio_550.png", descripcion: "Botella pequeña" },
    { id: 35, nombre: "Vino Pluvium", categoria: "Bebidas alcohólicas y malta", precio: 1200, imagen: "https://i.postimg.cc/XNLLWmmx/vino_pluvium_precio_1200.png", descripcion: "Botella" },
    { id: 36, nombre: "Baterías Triple A", categoria: "Electrónicos y accesorios", precio: 300, imagen: "https://i.postimg.cc/DZ2vxZsT/Gemini_Generated_Image_824rio824rio824r.png", descripcion: "Pack 4 unidades" }
];

// Productos destacados para el inicio
const FEATURED_PRODUCTS = [
    PRODUCTS.find(p => p.id === 4), // Café Dualis
    PRODUCTS.find(p => p.id === 7), // Huevos
    PRODUCTS.find(p => p.id === 1), // Atún
    PRODUCTS.find(p => p.id === 13), // Mayonesa
    PRODUCTS.find(p => p.id === 21), // Perfume Candy
    PRODUCTS.find(p => p.id === 30), // Licor fresa
    PRODUCTS.find(p => p.id === 17), // Papel
    PRODUCTS.find(p => p.id === 9)  // Harina
];

// Productos al por mayor
const WHOLESALE_PRODUCTS = [
    { nombre: "Café Dualis Caja 10u", precio: 13000, precioNormal: 14500, imagen: "https://i.postimg.cc/WbZBX2hN/cafe_dualis_250_g_precio_1450.png", desc: "Ahorra $1,500" },
    { nombre: "Huevos 3 cartones", precio: 8400, precioNormal: 9000, imagen: "https://i.postimg.cc/sDWkwVvv/carton_de_huevo_30_u_precio_3000.png", desc: "Ahorra $600" },
    { nombre: "Atún Pack 12u", precio: 6000, precioNormal: 6480, imagen: "https://i.postimg.cc/76xHK6zt/atun_precio_500.png", desc: "Ahorra $480" },
    { nombre: "Jabón Caja 24u", precio: 5400, precioNormal: 6000, imagen: "https://i.postimg.cc/V6YfK6Mz/jabon_de_lavar_precio_250.png", desc: "Ahorra $600" }
];
