/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './App.tsx', './components/**/*.{ts,tsx}', './data/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#04112B',        // dunkler Grund
        'navy-2': '#0A1F4A',
        deep: '#08246F',        // tiefes Blau aus dem Würfel
        ink: '#001C47',         // "Form" im Schriftzug
        cyan: '#00E5FF',        // "Layer" / Würfel-Oberseite
        'cyan-mid': '#19B2D9',
        'cyan-text': '#0079A0', // Cyan für Text auf Weiß
        ice: '#F0F8FB',
        line: '#DCE8EE',
        muted: '#51607A',
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
