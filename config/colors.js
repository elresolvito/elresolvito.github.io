// config/colors.js
const COLORS = {
    primary: {
        main: '#1E6B52',      // Verde bosque
        light: '#2D8A6A',
        dark: '#14503C'
    },
    secondary: {
        main: '#FF7A45',      // Naranja tropical
        light: '#FF976D',
        dark: '#E55A2E'
    },
    accent: {
        main: '#3A8BB8',      // Azul caribe
        light: '#5CA3D4',
        dark: '#2A6C91'
    },
    neutral: {
        white: '#FFFFFF',
        cream: '#F8F4E9',     // Fondo crema
        lightGray: '#E8E4D9',
        mediumGray: '#A8A294',
        darkGray: '#5C574D',
        black: '#2C2416'      // Texto principal
    },
    status: {
        success: '#38A169',   // Verde
        warning: '#D69E2E',   // Amarillo
        error: '#E53E3E',     // Rojo
        info: '#3182CE'       // Azul información
    }
};

// Para usar en CSS como variables
const CSS_COLORS = `
:root {
    /* Primary - Verde */
    --color-primary: ${COLORS.primary.main};
    --color-primary-light: ${COLORS.primary.light};
    --color-primary-dark: ${COLORS.primary.dark};
    
    /* Secondary - Naranja */
    --color-secondary: ${COLORS.secondary.main};
    --color-secondary-light: ${COLORS.secondary.light};
    --color-secondary-dark: ${COLORS.secondary.dark};
    
    /* Accent - Azul */
    --color-accent: ${COLORS.accent.main};
    --color-accent-light: ${COLORS.accent.light};
    --color-accent-dark: ${COLORS.accent.dark};
    
    /* Neutral */
    --color-white: ${COLORS.neutral.white};
    --color-cream: ${COLORS.neutral.cream};
    --color-light-gray: ${COLORS.neutral.lightGray};
    --color-medium-gray: ${COLORS.neutral.mediumGray};
    --color-dark-gray: ${COLORS.neutral.darkGray};
    --color-black: ${COLORS.neutral.black};
    
    /* Status */
    --color-success: ${COLORS.status.success};
    --color-warning: ${COLORS.status.warning};
    --color-error: ${COLORS.status.error};
    --color-info: ${COLORS.status.info};
}
`;

export { COLORS, CSS_COLORS };
