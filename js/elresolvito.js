// js/elresolvito.js
(function() {
   'use strict';
   
   // ============================================
   // VARIABLES GLOBALES
   // ============================================
   let cart = JSON.parse(localStorage.getItem('elResolvitoCart')) || [];
   const WHATSAPP_NUMBER = '5356382909';
   const MINIMUM_PURCHASE = 500;
   const SHIPPING_WITHIN_HABANA_VIEJA = 400;
   
   // ============================================
   // FUNCIONES DEL MENÚ Y UI
   // ============================================
   function toggleMenu() {
      console.log('toggleMenu ejecutado'); // Para debug
      const menu = document.getElementById('mobileMenu');
      if (!menu) {
         console.error('ERROR: #mobileMenu no encontrado');
         return;
      }
      menu.classList.toggle('hidden');
      document.body.style.overflow = menu.classList.contains('hidden') ? '' : 'hidden';
   }
   
   function toggleDayNight() {
      document.body.classList.toggle('night-mode');
      const isNight = document.body.classList.contains('night-mode');
      const themeIcon = document.getElementById('headerThemeIcon');
      if (themeIcon) themeIcon.textContent = isNight ? '🌙' : '☀️';
      localStorage.setItem('nightMode', isNight);
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
   
   // ============================================
   // FUNCIONES DEL CARRITO
   // ============================================
   function addToCart(product) {
      // ... tu código existente ...
   }
   
   function updateCartQuantity(index, newQuantity) {
      // ... tu código existente ...
   }
   
   function removeFromCart(index) {
      // ... tu código existente ...
   }
   
   // ============================================
   // FUNCIONES DE CHECKOUT
   // ============================================
   function openCheckoutModal() {
      // ... tu código existente ...
   }
   
   function closeCheckoutModal() {
      // ... tu código existente ...
   }
   
   function sendCompleteOrder() {
      // ... tu código existente ...
   }
   
   // ============================================
   // FUNCIONES DE COMENTARIOS
   // ============================================
   function enviarComentario(articuloId) {
      // ... tu código existente ...
   }
   
   function enviarReaccion(tipo, autor) {
      // ... tu código existente ...
   }
   
   // ============================================
   // FUNCIONES DE MODALES
   // ============================================
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
   
   // ============================================
   // EXPONER FUNCIONES AL GLOBAL (¡IMPORTANTÍSIMO!)
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
   
   // ============================================
   // INICIALIZACIÓN
   // ============================================
   async function initializeSite() {
      console.log('Inicializando sitio...');
      
      // Cargar componentes
      await loadComponent('header-container', 'components/header.html');
      await loadComponent('mobile-menu-container', 'components/mobile-menu.html');
      await loadComponent('floating-buttons-container', 'components/floating-buttons.html');
      await loadComponent('image-modal-container', 'components/image-modal.html');
      await loadComponent('cart-sidebar-container', 'components/cart-sidebar.html');
      await loadComponent('checkout-modal-container', 'components/checkout-modal.html');
      await loadComponent('footer-container', 'components/footer.html');
      
      // Inicializar UI
      initDayNight();
      updateCartUI();
      
      console.log('Sitio inicializado correctamente');
   }
   
   // Iniciar cuando el DOM esté listo
   if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeSite);
   } else {
      initializeSite();
   }
   
})();
