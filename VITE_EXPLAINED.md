# What is Vite Doing? 🔧

## Quick Answer
Vite is a **development server** that:
1. Serves your files via HTTP (browsers can't use `file://` for modules)
2. Transforms ES6 imports on-the-fly
3. Injects environment variables
4. Hot-reloads when you save files

## Visual Flow

```
Your Browser Request:
  http://localhost:3000/src/wiki/wiki-home.html
          ↓
  ┌─────────────────────────────┐
  │   Vite Dev Server :3000     │
  │  (Running in Terminal)      │
  └─────────────────────────────┘
          ↓
  1. Reads wiki-home.html
  2. Sees: <script type="module" src="js/wiki-home.js">
  3. Browser requests: /src/wiki/js/wiki-home.js
          ↓
  ┌─────────────────────────────┐
  │   Vite Transform Engine     │
  │  - Converts ES6 imports     │
  │  - Injects env vars         │
  │  - Adds HMR code            │
  └─────────────────────────────┘
          ↓
  Sees: import { supabase } from '../../js/supabase-client.js'
          ↓
  Transforms to: import { supabase } from '/src/js/supabase-client.js?v=abc123'
          ↓
  Browser receives transformed code
          ↓
  Browser requests: /src/js/supabase-client.js?v=abc123
          ↓
  Vite serves file (and transforms it too if needed)
          ↓
  All modules loaded → Your app runs!
```

## What You See in Terminal

```bash
🔧 Vite Configuration Loaded:
  📂 Root: /path/to/Permahub
  🌐 Server: http://localhost:3000
  🔨 Mode: development (serve)
  📦 Build Dir: dist

✅ [200] GET /src/wiki/wiki-home.html (5ms)
   # Vite served the HTML file

🔄 Transform: wiki-home.js
   # Vite converted ES6 module syntax

✅ [200] GET /src/wiki/js/wiki-home.js (23ms)
   # Browser received transformed JS

🔄 Transform: supabase-client.js
   # Vite transformed imported dependency

✅ [200] GET /src/js/supabase-client.js (12ms)
   # Browser received dependency

🔄 Transform: config.js
   # Vite injected environment variables

✅ [200] GET /src/js/config.js (8ms)
   # Browser received config with VITE_* vars
```

## Do We Need Vite?

### In Development: YES ✅
- **ES6 Modules**: Browsers need a server to resolve `import` statements
- **Environment Variables**: `.env.local` → `import.meta.env.VITE_SUPABASE_URL`
- **Hot Reload**: Save file → browser auto-refreshes
- **Fast**: Only transforms files you actually use

### In Production: NO ❌
Vite **builds** static files that work without Vite:

```bash
npm run build
# Creates /dist folder with plain HTML/JS/CSS
# Deploy to ANY static host (Netlify, Vercel, S3, etc.)
```

## Alternative: No Build Tool

You could skip Vite by:
1. Using import maps in HTML
2. Manually managing environment variables
3. Manually refreshing browser
4. Using full URLs for imports

**But it's painful!** Vite does all this automatically.

## Config Explained

[vite.config.js](vite.config.js:1-107):

```javascript
export default defineConfig({
  // Custom plugin to log everything Vite does
  plugins: [viteLogger()],

  server: {
    port: 3000,              // http://localhost:3000
    hmr: { overlay: true }   // Show errors in browser
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),        // import from '@/...'
      '@js': resolve(__dirname, 'src/js')    // import from '@js/...'
    }
  },

  envPrefix: 'VITE_',  // Only expose VITE_* env vars to browser

  logLevel: 'info'     // Show detailed logs
});
```

## Vite Logger Plugin

Our custom plugin (lines 8-57) logs:
- ✅ Every HTTP request with timing
- 🔄 Every file transformation
- 🔥 Every hot reload (when you save files)
- ♻️ Cached responses (304 status)

## When File Changes

```
1. You save wiki-home.js in VSCode
          ↓
2. Vite detects file change
          ↓
3. Vite logs: 🔥 Hot Update: wiki-home.js changed - reloading...
          ↓
4. Vite sends update to browser via WebSocket
          ↓
5. Browser receives update and reloads module
          ↓
6. Page updates WITHOUT full refresh!
```

## Environment Variables

Vite injects these at **transform time**:

```javascript
// In your code:
const url = import.meta.env.VITE_SUPABASE_URL;

// Vite transforms to:
const url = "http://127.0.0.1:54321";  // Actual value from .env.local
```

**Security**: Only `VITE_*` vars are exposed to browser. Other vars stay server-side.

## Summary

**Vite = Smart Development Server**
- 🚀 Serves files via HTTP
- 🔄 Transforms ES6 modules
- 💉 Injects environment variables
- 🔥 Hot reloads on file changes
- 📦 Builds for production

**Not a black box!** Check terminal for detailed logs of everything Vite does.

## Logs to Watch

### Terminal (Vite Server)
- HTTP requests: `✅ [200] GET /src/wiki/wiki-home.html (5ms)`
- Transformations: `🔄 Transform: wiki-home.js`
- Hot updates: `🔥 Hot Update: wiki-home.js changed`

### Browser Console (Your App)
- 🚀 Version info
- 🌐 Supabase API calls
- 📊 Data loading
- ✅ Success/error messages

Both logs combined = complete visibility into what's happening!
