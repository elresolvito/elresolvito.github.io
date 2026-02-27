// ============================================
// GESTIÓN DEL MODO DÍA/NOCHE
// ============================================
class ThemeManager {
    constructor() {
        this.init();
    }

    init() {
        // Cargar preferencia guardada
        const savedTheme = localStorage.getItem('nightMode');
        if (savedTheme === 'true') {
            document.body.classList.add('night-mode');
        }

        // Iniciar según hora del día si no hay preferencia
        if (savedTheme === null) {
            this.initByTime();
        }

        // Crear botón flotante
        this.createToggleButton();

        // Actualizar icono
        this.updateIcon();
    }

    initByTime() {
        const hour = new Date().getHours();
        const isNight = hour < 6 || hour >= 18;
        if (isNight) {
            document.body.classList.add('night-mode');
            localStorage.setItem('nightMode', 'true');
        }
    }

    createToggleButton() {
        const button = document.createElement('button');
        button.className = 'theme-toggle';
        button.id = 'theme-toggle';
        button.setAttribute('aria-label', 'Cambiar modo día/noche');
        button.onclick = () => this.toggle();
        
        document.body.appendChild(button);
        this.updateIcon();
    }

    toggle() {
        document.body.classList.toggle('night-mode');
        const isNight = document.body.classList.contains('night-mode');
        localStorage.setItem('nightMode', isNight ? 'true' : 'false');
        this.updateIcon();
    }

    updateIcon() {
        const button = document.getElementById('theme-toggle');
        if (button) {
            const isNight = document.body.classList.contains('night-mode');
            button.innerHTML = isNight ? '🌙' : '☀️';
        }
    }

    // Para usar en transiciones entre páginas
    preserveTheme() {
        return document.body.classList.contains('night-mode') ? 'true' : '
