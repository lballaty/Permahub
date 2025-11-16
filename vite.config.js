import { defineConfig } from 'vite';
import { resolve } from 'path';

/**
 * Custom Vite plugin to log all transformations and requests
 * Makes Vite's behavior transparent and easier to debug
 */
function viteLogger() {
  return {
    name: 'vite-logger',

    configResolved(config) {
      console.log('\n🔧 Vite Configuration Loaded:');
      console.log(`  📂 Root: ${config.root}`);
      console.log(`  🌐 Server: http://localhost:${config.server.port}`);
      console.log(`  🔨 Mode: ${config.mode} (${config.command})`);
      console.log(`  📦 Build Dir: ${config.build.outDir}`);
      console.log('─'.repeat(60));
    },

    configureServer(server) {
      console.log('🚀 Vite Dev Server Starting...\n');

      // Handle root redirect for magic link callbacks
      server.middlewares.use((req, res, next) => {
        // Redirect root URL to index.html (for magic link callbacks)
        if (req.url === '/' || req.url.startsWith('/#')) {
          req.url = '/src/index.html' + (req.url.startsWith('/#') ? req.url.substring(1) : '');
        }
        next();
      });

      // Log every HTTP request
      server.middlewares.use((req, res, next) => {
        const start = Date.now();
        const url = req.url;

        // Only log interesting requests (not Vite internals)
        if (!url.includes('/@') && !url.includes('node_modules')) {
          res.on('finish', () => {
            const duration = Date.now() - start;
            const status = res.statusCode;
            const emoji = status === 200 ? '✅' : status === 304 ? '♻️' : '❌';
            console.log(`${emoji} [${status}] ${req.method} ${url} (${duration}ms)`);
          });
        }

        next();
      });
    },

    transform(code, id) {
      // Log file transformations (skip node_modules)
      if (!id.includes('node_modules') && !id.includes('/@vite')) {
        const fileName = id.split('/').pop();
        console.log(`🔄 Transform: ${fileName}`);
      }
      return null; // Don't modify the code
    },

    handleHotUpdate({ file, server }) {
      const fileName = file.split('/').pop();
      console.log(`🔥 Hot Update: ${fileName} changed - reloading...`);
    }
  };
}

export default defineConfig({
  root: '.',
  publicDir: 'src/assets',

  // Add custom logging plugin
  plugins: [viteLogger()],

  build: {
    outDir: 'dist',
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
    port: 3001,
    open: false,
    // Enable detailed logging
    hmr: {
      overlay: true // Show errors in browser overlay
    }
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@js': resolve(__dirname, 'src/js'),
      '@css': resolve(__dirname, 'src/css'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },

  // Make environment variables visible
  envPrefix: 'VITE_',

  // Enable detailed logging
  logLevel: 'info'
});
