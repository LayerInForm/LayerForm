/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './App.tsx', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Schwarz / Blau / Limette: vom Nutzer gewählte Palette.
        bg: '#030407',          // Seitengrund
        surface: '#0D1017',     // Flächen, Karten
        'surface-2': '#171C28', // gehobene Flächen, Hover
        fg: '#F2F4F8',          // Fließtext hell
        'fg-muted': '#B7BDCA',  // Nebentext
        'fg-subtle': '#9EA6B7', // Hinweise, Labels
        cyan: '#D4FF24',        // Legacy-Token: Limette für Aktionen und Highlights
        'cyan-soft': '#E2FF70',
        ink: '#030407',         // dunkler Text auf Limette
        blue: '#1558C9',       // blaue Flächen und visuelle Führung
        navy: '#0D172C',
        deep: '#1558C9',
      },
      fontFamily: {
        sans: ['"Outfit Variable"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        mono: ['"Geist Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      // Radius-System: Flächen 24px, Medien 16px, Bedienelemente 12px
      borderRadius: {
        panel: '1.5rem',
        media: '1rem',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.23, 1, 0.32, 1)',
        'in-out': 'cubic-bezier(0.77, 0, 0.175, 1)',
      },
      zIndex: {
        nav: '40',
        progress: '45',
        grain: '60',
      },
    },
  },
  plugins: [],
};
