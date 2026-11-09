/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './App.tsx', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Gelber Grund, dunkle Schrift, lila Bedienelemente: Nutzerpalette.
        bg: '#FFF21A',          // Seitengrund
        surface: '#FFF8AD',     // Flächen, Karten
        'surface-2': '#F4E969', // gehobene Flächen, Hover
        fg: '#171717',          // dunkle Schrift
        'fg-muted': '#3D3929',  // Nebentext
        'fg-subtle': '#5B543A', // Hinweise, Labels
        cyan: '#A66BFF',        // Legacy-Token: Lila für Bedienelemente
        'cyan-soft': '#BB8CFF',
        ink: '#171717',         // dunkler Text auf Lila
        blue: '#A66BFF',       // Legacy-Token: Lila für Akzentflächen
        navy: '#D8BDFF',
        deep: '#A66BFF',
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
