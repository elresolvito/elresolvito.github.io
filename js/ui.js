// js/ui.js
// ============================================
// FUNCIONES DE INTERFAZ DE USUARIO
// ============================================

function initDayNight() {
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour >= 18;
    const savedMode = localStorage.getItem('nightMode');
    
    // Verificar que el elemento existe antes de usarlo
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
    if (themeIcon) {
        themeIcon.textContent = isNight ? '🌙' : '☀️';
    }
    
    localStorage.setItem('nightMode', isNight);
}

function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.classList.toggle('hidden');
        document.body.style.overflow = menu.classList.contains('hidden') ? '' : 'hidden';
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
