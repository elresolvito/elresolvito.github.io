// catalogo-dinamico.js - Carga productos desde JSON y renderiza catálogo
document.addEventListener('DOMContentLoaded', function() {
    const contenedorCatalogo = document.getElementById('contenedor-catalogo');
    
    if (!contenedorCatalogo) {
        console.error('No se encontró el contenedor con id "contenedor-catalogo"');
        return;
    }

    // Cargar productos desde JSON
    fetch('./data/productos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar productos: ' + response.status);
            }
            return response.json();
        })
        .then(productos => {
            console.log('Productos cargados:', productos.length);
            renderizarProductos(productos);
        })
        .catch(error => {
            console.error('Error:', error);
            contenedorCatalogo.innerHTML = `
                <div class="error-carga">
                    <p>⚠️ Error al cargar los productos. Por favor, intenta nuevamente.</p>
                    <button onclick="location.reload()">Reintentar</button>
                </div>
            `;
        });

    // Función para renderizar productos
    function renderizarProductos(productos) {
        // Limpiar contenedor
        contenedorCatalogo.innerHTML = '';
        
        // Filtrar solo productos activos
        const productosActivos = productos.filter(p => p.activo === true);
        
        // Ordenar por orden si existe la propiedad
        productosActivos.sort((a, b) => (a.orden || 0) - (b.orden || 0));
        
        // Crear HTML para cada producto
        productosActivos.forEach(producto => {
            const productoHTML = crearCardProducto(producto);
            contenedorCatalogo.innerHTML += productoHTML;
        });
        
        // Actualizar contador
        actualizarContador(productosActivos.length);
    }

    // Función para crear tarjeta de producto
    function crearCardProducto(producto) {
        return `
        <div class="producto-card" data-id="${producto.id}" data-categoria="${producto.categoria}">
            <div class="producto-imagen">
                <img src="${producto.imagen}" 
                     alt="${producto.nombre}" 
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/300x300?text=Imagen+no+disponible'">
                ${producto.stock <= 3 ? '<span class="stock-bajo">¡Últimas unidades!</span>' : ''}
            </div>
            <div class="producto-info">
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <p class="producto-categoria">${producto.categoria}</p>
                <p class="producto-descripcion">${producto.descripcion}</p>
                ${producto.marca ? `<p class="producto-marca">Marca: ${producto.marca}</p>` : ''}
                <div class="producto-precio-stock">
                    <span class="producto-precio">$${producto.precio.toLocaleString()}</span>
                    <span class="producto-stock ${producto.stock < 5 ? 'stock-bajo' : ''}">
                        ${producto.stock} disponibles
                    </span>
                </div>
                <button class="btn-agregar-carrito" onclick="agregarAlCarrito(${producto.id})">
                    🛒 Agregar al carrito
                </button>
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

    // Función global para agregar al carrito (simulada)
    window.agregarAlCarrito = function(idProducto) {
        alert(`Producto ${idProducto} agregado al carrito (función simulada)`);
        // Aquí integrarías con tu lógica real del carrito
    };
});
