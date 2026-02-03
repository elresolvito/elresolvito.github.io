// catalogo-dinamico.js - Versión mejorada
document.addEventListener('DOMContentLoaded', function() {
    const contenedorCatalogo = document.getElementById('contenedor-catalogo');
    
    if (!contenedorCatalogo) {
        console.error('No se encontró el contenedor con id "contenedor-catalogo"');
        return;
    }

    // Cargar productos desde catalogo.js (ya está en window.catalogo)
    const productos = window.catalogo ? window.catalogo.productos : [];
    
    if (productos.length === 0) {
        console.error('No se encontraron productos en window.catalogo');
        contenedorCatalogo.innerHTML = '<p>Error: No hay productos disponibles</p>';
        return;
    }

    console.log('Productos cargados desde catalogo.js:', productos.length);
    renderizarProductos(productos);

    // Función para renderizar productos
    function renderizarProductos(productos) {
        // Limpiar contenedor
        contenedorCatalogo.innerHTML = '';
        
        // Filtrar solo productos disponibles del departamento "mercado"
        const productosMercado = productos.filter(p => 
            p.department === 'mercado' && 
            (p.status === 'available' || p.activo === true)
        );
        
        // Ordenar por orden si existe la propiedad
        productosMercado.sort((a, b) => (a.orden || 0) - (b.orden || 0));
        
        // Mostrar mensaje si no hay productos
        if (productosMercado.length === 0) {
            contenedorCatalogo.innerHTML = '<p class="sin-productos">No hay productos disponibles en este momento.</p>';
            return;
        }
        
        // Crear HTML para cada producto
        productosMercado.forEach(producto => {
            const productoHTML = crearCardProducto(producto);
            contenedorCatalogo.innerHTML += productoHTML;
        });
        
        // Actualizar contador
        actualizarContador(productosMercado.length);
    }

    // Función para crear tarjeta de producto (MEJORADA)
    function crearCardProducto(producto) {
        const precioFormateado = typeof producto.price === 'number' 
            ? `$${producto.price.toLocaleString()}` 
            : '$0';
        
        const stockInfo = producto.stock !== undefined 
            ? `<span class="producto-stock ${producto.stock < 5 ? 'stock-bajo' : ''}">
                 ${producto.stock} disponibles
               </span>`
            : '';
        
        const marcaInfo = producto.marca 
            ? `<p class="producto-marca">Marca: ${producto.marca}</p>`
            : '';
        
        const detalles = producto.specificDetails || producto.description;
        
        return `
        <div class="producto-card" data-id="${producto.id}" data-categoria="${producto.category}">
            <div class="producto-imagen">
                <img src="${producto.image}" 
                     alt="${producto.name}" 
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/300x300?text=Imagen+no+disponible'">
                ${producto.stock <= 3 ? '<span class="stock-bajo">¡Últimas unidades!</span>' : ''}
                ${producto.status === 'unavailable' ? '<span class="proximamente">PRÓXIMAMENTE</span>' : ''}
            </div>
            <div class="producto-info">
                <h3 class="producto-nombre">${producto.name}</h3>
                <p class="producto-categoria">${producto.category}</p>
                <p class="producto-descripcion">${producto.description}</p>
                <p class="producto-detalles">${detalles}</p>
                ${marcaInfo}
                <div class="producto-precio-stock">
                    <span class="producto-precio">${precioFormateado}</span>
                    ${stockInfo}
                </div>
                ${producto.status === 'available' 
                    ? `<button class="btn-agregar-carrito" onclick="agregarAlCarrito(${producto.id})">
                         🛒 Agregar al carrito
                       </button>`
                    : `<button class="btn-proximamente" disabled>
                         🔜 Próximamente
                       </button>`
                }
            </div>
        </div>
        `;
    }

    // Función para actualizar contador
    function actualizarContador(cantidad) {
        const contador = document.getElementById('contador-productos');
        if (contador) {
            contador.textContent = `Mostrando ${cantidad} productos`;
        }
    }

    // Función global para agregar al carrito
    window.agregarAlCarrito = function(idProducto) {
        const producto = window.catalogo.obtenerPorId(idProducto);
        if (producto) {
            alert(`✅ ${producto.name} agregado al carrito\nPrecio: $${producto.price.toLocaleString()}`);
            // Aquí integrarías con tu lógica real del carrito
        }
    };
});
