/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './App.tsx', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Seite ist durchgehend dunkel, abgeleitet vom Logo
        bg: '#040B1D',          // Seitengrund
        surface: '#0A1731',     // Flächen, Karten
        'surface-2': '#0F2044', // gehobene Flächen, Hover
        fg: '#E8F1F7',          // Fließtext hell
        'fg-muted': '#9AABC2',  // Nebentext
        'fg-subtle': '#72839C', // Hinweise, Labels
        cyan: '#00E5FF',        // einziger Akzent ("Layer" im Logo)
        'cyan-soft': '#8CF1FF',
        ink: '#001C47',         // Text auf Cyan
        navy: '#04112B',
        deep: '#08246F',
      },
      fontFamily: {
        sans: ['"Outfit Variable"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        mono: ['"Geist Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      // Radius-System: Flächen 24px, Medien/Innenelemente 16px, Bedienelemente als Pille
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
