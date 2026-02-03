// config/settings.js
const CONFIG = {
    // Información del negocio
    business: {
        name: 'Mercado Bayona',
        tagline: 'Tu mercado familiar en La Habana',
        phone: '+5356382909',
        whatsapp: 'https://wa.me/5356382909',
        address: 'La Habana, Cuba',
        familySince: 2020
    },
    
    // Política de envíos (igual que El Resolvito)
    shipping: {
        ranges: [
            { max: 2000, fee: 200, discount: "0%" },
            { max: 5000, fee: 150, discount: "25%" },
            { max: Infinity, fee: 100, discount: "50%" }
        ],
        serviceFee: 0.08, // 8%
        minProfit: 300    // $300 utilidad mínima
    },
    
    // Configuración de la app
    app: {
        cacheDuration: 7200000, // 2 horas en ms
        autoRefresh: 600000,    // 10 minutos
        cartPersist: true,
        useGoogleSheets: true,
        sheetsURL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT2RBATNCTKwgP7EYeiG0Od16zAgR0mrnsxKBITDvaX62a47l0AyGF-isufaRs6Ayk5hXWI3j_jAHeu/pub?output=csv'
    },
    
    // Secciones disponibles
    sections: [
        { id: 'mercado', name: 'Mercado', icon: '🛒', categories: ['Alimentos', 'Aseo', 'Construcción', 'Ferretería'] },
        { id: 'servicios', name: 'Servicios', icon: '🔧', categories: ['Tapizado', 'Manicura', 'Reparaciones', 'Otros'] },
        { id: 'proximos', name: 'Próximamente', icon: '🚀', categories: ['Nuevos Productos'] }
    ],
    
    // URLs y APIs
    urls: {
        whatsappGroup: 'https://chat.whatsapp.com/H19dIofkINdHrVApA4jbvW',
        googleScript: 'https://script.google.com/macros/s/AKfycby9Sk3Fz2_WqRQsEXrezpwqKbpYhqW_-ialMJcYKPdvZkrBfNReWWFfQ-VnXTrkJY8W/exec'
    },
    
    // Modo accesibilidad
    accessibility: {
        largeText: false,
        highContrast: false,
        simpleMode: false
    }
};

export default CONFIG;
