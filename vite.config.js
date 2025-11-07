import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src/pages',
  publicDir: resolve(__dirname, 'src/assets'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/pages/index.html'),
        auth: resolve(__dirname, 'src/pages/auth.html'),
        dashboard: resolve(__dirname, 'src/pages/dashboard.html'),
        project: resolve(__dirname, 'src/pages/project.html'),
        map: resolve(__dirname, 'src/pages/map.html'),
        resources: resolve(__dirname, 'src/pages/resources.html'),
        'add-item': resolve(__dirname, 'src/pages/add-item.html'),
        legal: resolve(__dirname, 'src/pages/legal.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@js': resolve(__dirname, 'src/js'),
      '@css': resolve(__dirname, 'src/css'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  }
});
