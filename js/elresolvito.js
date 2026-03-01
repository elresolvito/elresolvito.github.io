// js/elresolvito.js
(function() {
   'use strict';
   
   // ============================================
   // MANEJAR FAVICON FALTANTE
   // ============================================
   (function() {
      const favicon = document.querySelector('link[rel="icon"]');
      if (!favicon) {
         const link = document.createElement('link');
         link.rel = 'icon';
         link.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🏪</text></svg>';
         document.head.appendChild(link);
      }
   })();
   
   // ============================================
   // VARIABLES GLOBALES
   // ============================================
   let cart = JSON.parse(localStorage.getItem('elResolvitoCart')) || [];
   const WHATSAPP_NUMBER = '5356382909';
   const MINIMUM_PURCHASE = 500;
   const SHIPPING_WITHIN_HABANA_VIEJA = 400;
   
   // ============================================
   // FUNCIONES DE CARGA DE COMPONENTES
   // ============================================
   async function loadComponent(elementId, componentPath) {
      try {
         const element = document.getElementById(elementId);
         if (!element) {
            console.log(`Elemento ${elementId} no encontrado, saltando carga de ${componentPath}`);
            return;
         }
         const response = await fetch(componentPath);
         const html = await response.text();
         element.innerHTML = html;
         if (elementId === 'header-container') updateActiveNav();
         if (elementId === 'footer-container') fixFooterColor();
      } catch (error) {
         console.error(`Error cargando ${componentPath}:`, error);
      }
   }
   
   function updateActiveNav() {
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      const navLinks = document.querySelectorAll('#mainNav a');
      navLinks.forEach(link => {
         const href = link.getAttribute('href');
         link.classList.toggle('text-cuban-green', href === currentPage);
         link.classList.toggle('font-medium', href === currentPage);
         link.classList.toggle('border-b-2', href === currentPage);
         link.classList.toggle('border-cuban-green', href === currentPage);
      });
   }
   
   function fixFooterColor() {
      const footer = document.querySelector('footer');
      if (footer) {
         footer.classList.add('bg-cuban-dark');
         footer.style.backgroundColor = '#1B5E20';
      }
   }
   
   // ============================================
   // FUNCIONES DE UI
   // ============================================
   function initDayNight() {
      console.log('initDayNight ejecutado');
      const hour = new Date().getHours();
      const isNight = hour < 6 || hour >= 18;
      const savedMode = localStorage.getItem('nightMode');
      const themeIcon = document.getElementById('headerThemeIcon');
      
      if (savedMode === 'true' || (savedMode === null && isNight)) {
         document.body.classList.add('night-mode');
         if (themeIcon) themeIcon.textContent = '🌙';
      } else {
         if (themeIcon) themeIcon.textContent = '☀️';
      }
   }
   
   function toggleDayNight() {
      document.body.classList.toggle('night-mode');
      const isNight = document.body.classList.contains('night-mode');
      const themeIcon = document.getElementById('headerThemeIcon');
      if (themeIcon) themeIcon.textContent = isNight ? '🌙' : '☀️';
      localStorage.setItem('nightMode', isNight);
   }
   
   function toggleMenu() {
      console.log('toggleMenu ejecutado');
      const menu = document.getElementById('mobileMenu');
      if (!menu) {
         console.error('ERROR: #mobileMenu no encontrado');
         return;
      }
      menu.classList.toggle('hidden');
      document.body.style.overflow = menu.classList.contains('hidden') ? '' : 'hidden';
   }
   
   function toggleCart() {
      const sidebar = document.getElementById('cartSidebar');
      const overlay = document.getElementById('cartOverlay');
      if (sidebar && overlay) {
         sidebar.classList.toggle('cart-open');
         overlay.classList.toggle('hidden');
         document.body.style.overflow = sidebar.classList.contains('cart-open') ? 'hidden' : '';
      }
   }
   
   function openImageModal(src, name) {
      const modal = document.getElementById('imageModal');
      const img = document.getElementById('modalImage');
      const nameEl = document.getElementById('modalImageName');
      if (modal && img && nameEl) {
         img.src = src;
         nameEl.textContent = name || 'Imagen';
         modal.classList.remove('hidden');
         document.body.style.overflow = 'hidden';
      }
   }
   
   function closeImageModal() {
      const modal = document.getElementById('imageModal');
      if (modal) {
         modal.classList.add('hidden');
         document.body.style.overflow = '';
      }
   }
   
   function showToast(message) {
      const toast = document.getElementById('cartToast');
      const msgEl = document.getElementById('cartToastMessage');
      if (!toast || !msgEl) return;
      msgEl.textContent = message;
      toast.classList.add('opacity-100');
      toast.classList.remove('opacity-0', 'pointer-events-none');
      clearTimeout(window.toastTimeout);
      window.toastTimeout = setTimeout(() => {
         toast.classList.remove('opacity-100');
         toast.classList.add('opacity-0', 'pointer-events-none');
      }, 3000);
   }
   
   // ============================================
   // FUNCIONES DEL CARRITO
   // ============================================
   function calculateShipping(subtotal, location = 'habana-vieja') {
      if (subtotal < MINIMUM_PURCHASE) {
         return { fee: 0, isEligible: false, message: `Mínimo $${MINIMUM_PURCHASE}` };
      }
      if (location === 'habana-vieja') {
         return { fee: SHIPPING_WITHIN_HABANA_VIEJA, isEligible: true, message: '' };
      }
      return { fee: 0, isEligible: true, message: 'A consultar (peso/distancia)' };
   }
   
   function addToCart(product) {
      if (!product?.id || !product?.nombre || !product?.precio) {
         console.error('Producto inválido', product);
         return false;
      }
      const existingItemIndex = cart.findIndex(item => item.id === product.id);
      if (existingItemIndex !== -1) {
         cart[existingItemIndex].cantidad += product.cantidad || 1;
      } else {
         cart.push({
            id: product.id,
            nombre: product.nombre,
            imagen: product.imagen,
            precio: product.precio,
            cantidad: product.cantidad || 1
         });
      }
      saveCart();
      updateCartUI();
      showToast('Producto añadido al carrito');
      return true;
   }
   
   function saveCart() {
      localStorage.setItem('elResolvitoCart', JSON.stringify(cart));
   }
   
   function updateCartQuantity(index, newQuantity) {
      if (newQuantity <= 0) {
         removeFromCart(index);
         return;
      }
      cart[index].cantidad = newQuantity;
      saveCart();
      updateCartUI();
      showToast('Carrito actualizado');
   }
   
   function removeFromCart(index) {
      cart.splice(index, 1);
      saveCart();
      updateCartUI();
      showToast('Producto eliminado');
   }
   
   function updateCartUI() {
      const totalItems = cart.reduce((sum, item) => sum + (item.cantidad || 0), 0);
      const subtotal = cart.reduce((sum, item) => sum + (item.precio * (item.cantidad || 0)), 0);
      
      document.querySelectorAll('#cartCount, #floatingCartCount').forEach(el => {
         if (el) {
            el.textContent = totalItems;
            el.classList.toggle('hidden', totalItems === 0);
            if (totalItems > 0) {
               el.classList.add('badge-pop');
               setTimeout(() => el.classList.remove('badge-pop'), 300);
            }
         }
      });
      
      const cartItemsContainer = document.getElementById('cartItems');
      if (cartItemsContainer) {
         if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="text-center py-8 text-gray-500"><i class="fas fa-shopping-cart text-4xl mb-3 opacity-30"></i><p>Tu carrito está vacío</p></div>';
         } else {
            cartItemsContainer.innerHTML = cart.map((item, index) => `
               <div class="flex gap-3 bg-gray-50 p-3 rounded-lg">
                  <img src="${item.imagen || 'https://via.placeholder.com/80'}" class="w-16 h-16 object-contain bg-white rounded-lg" loading="lazy" onerror="this.src='https://via.placeholder.com/80'">
                  <div class="flex-1">
                     <h4 class="font-medium text-sm">${item.nombre}</h4>
                     <p class="text-cuban-green font-bold">$${item.precio?.toLocaleString()}</p>
                     <div class="flex items-center gap-2 mt-1">
                        <button onclick="updateCartQuantity(${index}, ${(item.cantidad || 1) - 1})" class="w-6 h-6 bg-white rounded shadow text-xs hover:bg-cuban-green hover:text-white transition">-</button>
                        <span class="text-sm font-medium">${item.cantidad || 1}</span>
                        <button onclick="updateCartQuantity(${index}, ${(item.cantidad || 1) + 1})" class="w-6 h-6 bg-white rounded shadow text-xs hover:bg-cuban-green hover:text-white transition">+</button>
                        <button onclick="removeFromCart(${index})" class="ml-auto text-red-500 hover:text-red-700 transition"><i class="fas fa-trash"></i></button>
                     </div>
                  </div>
               </div>
            `).join('');
         }
      }
      
      const subtotalEl = document.getElementById('cartSubtotal');
      const shippingEl = document.getElementById('cartShipping');
      const totalEl = document.getElementById('cartTotal');
      
      if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString()}`;
      if (subtotal < MINIMUM_PURCHASE) {
         if (shippingEl) shippingEl.innerHTML = `<span class="text-orange-500 font-bold">Mínimo $${MINIMUM_PURCHASE}</span>`;
         if (totalEl) totalEl.textContent = `$${subtotal.toLocaleString()}`;
      } else {
         if (shippingEl) shippingEl.innerHTML = `<span class="text-gray-600">Seleccionar en checkout</span>`;
         if (totalEl) totalEl.textContent = `$${subtotal.toLocaleString()}`;
      }
   }
   
   // ============================================
   // FUNCIONES DE CHECKOUT
   // ============================================
   function openCheckoutModal() {
      if (cart.length === 0) {
         showToast('El carrito está vacío');
         return;
      }
      const subtotal = cart.reduce((sum, item) => sum + (item.precio * (item.cantidad || 0)), 0);
      if (subtotal < MINIMUM_PURCHASE) {
         showToast(`Compra mínima: $${MINIMUM_PURCHASE}`);
         return;
      }
      const summaryEl = document.getElementById('checkoutCartSummary');
      const totalEl = document.getElementById('checkoutTotal');
      if (summaryEl) {
         summaryEl.innerHTML = cart.map(item => 
            `<div class="flex justify-between mb-1"><span>${item.nombre} x${item.cantidad}</span><span>$${(item.precio * item.cantidad).toLocaleString()}</span></div>`
         ).join('');
         if (totalEl) totalEl.textContent = `$${subtotal.toLocaleString()}`;
      }
      const modal = document.getElementById('checkoutModal');
      if (modal) {
         modal.classList.remove('hidden');
         document.body.style.overflow = 'hidden';
      }
   }
   
   function closeCheckoutModal() {
      const modal = document.getElementById('checkoutModal');
      if (modal) {
         modal.classList.add('hidden');
         document.body.style.overflow = '';
      }
   }
   
   function sendCompleteOrder() {
      if (cart.length === 0) {
         showToast('El carrito está vacío');
         closeCheckoutModal();
         return;
      }
      const customerName = document.getElementById('customerName')?.value.trim();
      const customerAddress = document.getElementById('customerAddress')?.value.trim();
      const deliveryZone = document.querySelector('input[name="deliveryZone"]:checked')?.value;
      const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
      const customerNotes = document.getElementById('customerNotes')?.value.trim();
      
      if (!customerName || !customerAddress || !deliveryZone || !paymentMethod) {
         alert('Por favor, completa todos los campos obligatorios.');
         return;
      }
      
      const subtotal = cart.reduce((sum, item) => sum + (item.precio * (item.cantidad || 0)), 0);
      if (subtotal < MINIMUM_PURCHASE) {
         alert(`El subtotal debe ser de al menos $${MINIMUM_PURCHASE}.`);
         return;
      }
      
      let shippingDescription = deliveryZone === 'habana-vieja' 
         ? `Envío dentro de La Habana Vieja: $${SHIPPING_WITHIN_HABANA_VIEJA}`
         : 'Envío fuera de La Habana Vieja: costo a consultar (por peso y distancia)';
      
      const totalToShow = deliveryZone === 'habana-vieja' ? subtotal + SHIPPING_WITHIN_HABANA_VIEJA : subtotal;
      
      let message = `*✅ PEDIDO CONFIRMADO - EL RESOLVITO*\n\n`;
      message += `👤 *DATOS DEL CLIENTE:*\n• Nombre: ${customerName}\n• Dirección: ${customerAddress}\n• Zona: ${deliveryZone === 'habana-vieja' ? 'La Habana Vieja' : 'Fuera de La Habana Vieja'}\n• Pago: ${paymentMethod}\n`;
      if (customerNotes) message += `• Notas: ${customerNotes}\n`;
      message += `\n🛒 *DETALLE DEL PEDIDO:*\n`;
      cart.forEach(item => message += `• ${item.nombre} x${item.cantidad} = $${(item.precio * item.cantidad).toLocaleString()}\n`);
      message += `\n💰 *RESUMEN:*\n- Subtotal: $${subtotal.toLocaleString()}\n- ${shippingDescription}\n- *TOTAL A PAGAR: $${totalToShow.toLocaleString()}*`;
      if (deliveryZone !== 'habana-vieja') message += ` (más envío a consultar)`;
      message += `\n\n_Recibirás un mensaje de confirmación._`;
      
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
      closeCheckoutModal();
      toggleCart();
      showToast('¡Pedido enviado! Revisa WhatsApp');
   }
   
   // ============================================
   // FUNCIONES DE COMENTARIOS DEL BLOG
   // ============================================
   function enviarComentario(articuloId) {
      const nombre = document.getElementById(`comentario-nombre-${articuloId}`)?.value.trim();
      const comentario = document.getElementById(`comentario-texto-${articuloId}`)?.value.trim();
      if (!nombre || !comentario) {
         alert('Por favor, completa todos los campos.');
         return;
      }
      const tituloArticulo = document.querySelector('h1')?.textContent || 'Artículo';
      const mensaje = `*📝 NUEVO COMENTARIO EN EL BLOG*\n\n📌 *Artículo:* ${tituloArticulo}\n👤 *Nombre:* ${nombre}\n💬 *Comentario:* ${comentario}\n\n_Responde a este mensaje para publicar el comentario._`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`, '_blank');
      document.getElementById(`comentario-nombre-${articuloId}`).value = '';
      document.getElementById(`comentario-texto-${articuloId}`).value = '';
      showToast('¡Comentario enviado!');
   }
   
   function enviarReaccion(tipo, autor) {
      const tituloArticulo = document.querySelector('h1')?.textContent || 'Artículo';
      const mensaje = tipo === 'me-gusta' 
         ? `❤️ *Me gusta*\n\nLe di "me gusta" al comentario de *${autor}* en "${tituloArticulo}".`
         : `💬 *Respuesta*\n\nQuiero responder a *${autor}* en "${tituloArticulo}".\n\nMi respuesta: `;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`, '_blank');
   }
   
   // ============================================
   // FUNCIONES DE PRODUCTOS (¡NUEVAS O VERIFICADAS!)
   // ============================================
   function renderFeaturedProducts() {
      console.log('renderFeaturedProducts ejecutado');
      const container = document.getElementById('featuredProducts');
      if (!container) {
         console.log('No hay #featuredProducts en esta página');
         return;
      }
      
      if (typeof FEATURED_PRODUCTS === 'undefined') {
         console.error('ERROR: FEATURED_PRODUCTS no está definido. ¿products.js se cargó?');
         return;
      }
      
      container.innerHTML = FEATURED_PRODUCTS.map(p => `
         <div class="product-card bg-white rounded-xl shadow-md overflow-hidden cursor-pointer">
            <div class="product-image-container h-40 bg-gray-100 flex items-center justify-center p-2" onclick="openImageModal('${p.imagen}', '${p.nombre}')">
               <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" class="max-h-full max-w-full object-contain" onerror="this.src='https://via.placeholder.com/150?text=Producto'">
            </div>
            <div class="p-3">
               <p class="text-xs text-cuban-green font-medium">${p.categoria || 'Producto'}</p>
               <h3 class="font-bold text-sm mb-1 line-clamp-2">${p.nombre}</h3>
               <div class="flex items-center justify-between">
                  <span class="text-lg font-bold text-cuban-green">$${p.precio?.toLocaleString() || '0'}</span>
                  <button onclick="addToCart({id:${p.id}, nombre:'${p.nombre.replace(/'/g, "\\'")}', precio:${p.precio}, imagen:'${p.imagen}', cantidad:1})" class="w-8 h-8 bg-cuban-green text-white rounded-full flex items-center justify-center hover:bg-cuban-dark transition">
                     <i class="fas fa-plus"></i>
                  </button>
               </div>
            </div>
         </div>
      `).join('');
      
      console.log(`✅ ${FEATURED_PRODUCTS.length} productos destacados renderizados`);
   }
   
   function renderProducts() {
      console.log('renderProducts ejecutado');
      const container = document.getElementById('productsGrid');
      if (!container) {
         console.log('No hay #productsGrid en esta página');
         return;
      }
      
      if (typeof PRODUCTS === 'undefined') {
         console.error('ERROR: PRODUCTS no está definido. ¿products.js se cargó?');
         return;
      }
      
      container.innerHTML = PRODUCTS.map(p => `
         <div class="product-card bg-white rounded-xl shadow-md overflow-hidden cursor-pointer">
            <div class="product-image-container h-40 bg-gray-100 flex items-center justify-center p-2" onclick="openImageModal('${p.imagen}', '${p.nombre}')">
               <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" class="max-h-full max-w-full object-contain" onerror="this.src='https://via.placeholder.com/150?text=Producto'">
            </div>
            <div class="p-3">
               <p class="text-xs text-cuban-green font-medium">${p.categoria}</p>
               <h3 class="font-bold text-sm mb-1 line-clamp-2">${p.nombre}</h3>
               <p class="text-xs text-gray-500 mb-2">${p.descripcion || ''}</p>
               <div class="flex items-center justify-between">
                  <span class="text-lg font-bold text-cuban-green">$${p.precio.toLocaleString()}</span>
                  <button onclick="addToCart({id:${p.id}, nombre:'${p.nombre.replace(/'/g, "\\'")}', precio:${p.precio}, imagen:'${p.imagen}', cantidad:1})" class="w-8 h-8 bg-cuban-green text-white rounded-full flex items-center justify-center hover:bg-cuban-dark transition">
                     <i class="fas fa-plus"></i>
                  </button>
               </div>
            </div>
         </div>
      `).join('');
      
      console.log(`✅ ${PRODUCTS.length} productos renderizados en catálogo`);
   }
   
   // ============================================
   // FUNCIONES DE INICIALIZACIÓN (CORREGIDA)
   // ============================================
   async function initializeSite() {
      console.log('Inicializando sitio...');
      
      // Cargar componentes si existen los contenedores
      const needsHeader = document.getElementById('header-container');
      if (needsHeader) await loadComponent('header-container', 'components/header.html');
      
      const needsMobileMenu = document.getElementById('mobile-menu-container');
      if (needsMobileMenu) await loadComponent('mobile-menu-container', 'components/mobile-menu.html');
      
      const needsFloating = document.getElementById('floating-buttons-container');
      if (needsFloating) await loadComponent('floating-buttons-container', 'components/floating-buttons.html');
      
      const needsImageModal = document.getElementById('image-modal-container');
      if (needsImageModal) await loadComponent('image-modal-container', 'components/image-modal.html');
      
      const needsCartSidebar = document.getElementById('cart-sidebar-container');
      if (needsCartSidebar) await loadComponent('cart-sidebar-container', 'components/cart-sidebar.html');
      
      const needsCheckoutModal = document.getElementById('checkout-modal-container');
      if (needsCheckoutModal) await loadComponent('checkout-modal-container', 'components/checkout-modal.html');
      
      const needsFooter = document.getElementById('footer-container');
      if (needsFooter) await loadComponent('footer-container', 'components/footer.html');
      
      // Inicializar UI
      initDayNight();
      updateCartUI();
      
      // ============================================
      // RENDERIZAR PRODUCTOS (¡ESTAS LÍNEAS SON CLAVE!)
      // ============================================
      // Pequeño retraso para asegurar que el DOM está listo
      setTimeout(() => {
         // Productos destacados (para index.html)
         if (document.getElementById('featuredProducts')) {
            console.log('Renderizando productos destacados...');
            renderFeaturedProducts();
         }
         
         // Catálogo completo (para tienda.html)
         if (document.getElementById('productsGrid')) {
            console.log('Renderizando catálogo de tienda...');
            renderProducts();
         }
      }, 100);
      
      console.log('Sitio inicializado correctamente');
   }
   
   // ============================================
   // EXPONER FUNCIONES AL GLOBAL
   // ============================================
   window.toggleMenu = toggleMenu;
   window.toggleDayNight = toggleDayNight;
   window.toggleCart = toggleCart;
   window.addToCart = addToCart;
   window.updateCartQuantity = updateCartQuantity;
   window.removeFromCart = removeFromCart;
   window.openCheckoutModal = openCheckoutModal;
   window.closeCheckoutModal = closeCheckoutModal;
   window.sendCompleteOrder = sendCompleteOrder;
   window.enviarComentario = enviarComentario;
   window.enviarReaccion = enviarReaccion;
   window.openImageModal = openImageModal;
   window.closeImageModal = closeImageModal;
   window.renderFeaturedProducts = renderFeaturedProducts;
   window.renderProducts = renderProducts;
   
   // ============================================
   // INICIAR TODO
   // ============================================
   if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeSite);
   } else {
      initializeSite();
   }
   
})();
