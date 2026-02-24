
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Stellt sicher, dass Pfade auf der Hauptdomain layer-form.de korrekt aufgelöst werden
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
  }
});
