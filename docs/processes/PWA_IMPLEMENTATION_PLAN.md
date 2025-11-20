# PWA Implementation Plan

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/processes/PWA_IMPLEMENTATION_PLAN.md

**Description:** Comprehensive plan to convert Permahub Wiki into a Progressive Web App (PWA) with caching, offline support, and installability

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-01-20

**Last Updated:** 2025-01-20

**Last Updated By:** Libor Ballaty <libor@arionetworks.com>

---

## 🎯 Project Goal

Transform Permahub Wiki into a **Progressive Web App (PWA)** that users can:
- **Install** on any device (iOS, Android, macOS, Windows, Linux)
- **Use offline** with cached content
- **Launch** as a standalone app (no browser UI)
- **Update** automatically when new versions deploy

---

## 📋 What is a PWA?

A Progressive Web App is a web application that uses modern web capabilities to deliver an app-like experience:

- **Installable:** Add to home screen / desktop
- **Offline-capable:** Works without internet (cached content)
- **Fast:** Pre-cached resources load instantly
- **Engaging:** Standalone window, splash screen, app icon
- **Secure:** Requires HTTPS
- **Discoverable:** Still a website, indexable by search engines

---

## ✅ PWA Requirements Checklist

### Core Requirements
- [ ] **HTTPS:** App must be served over secure connection
- [ ] **Web App Manifest:** JSON file defining app metadata
- [ ] **Service Worker:** JavaScript file handling caching and offline functionality
- [ ] **App Icons:** PNG icons in multiple sizes (192px, 512px minimum)
- [ ] **Installability Criteria:** Manifest + Service Worker + Icons = Installable

### Optional Enhancements
- [ ] **Offline Fallback Page:** Show friendly message when offline and no cache
- [ ] **Background Sync:** Sync data when connection restored
- [ ] **Push Notifications:** Send updates to installed users
- [ ] **Add to Home Screen Prompt:** Custom install prompt

---

## 🏗️ Implementation Phases

---

## **PHASE 1: Web App Manifest**

### Task 1.1: Create manifest.json
**Status:** ⏳ Pending
**Time Estimate:** 30 minutes
**Dependencies:** None

**Objective:** Define PWA metadata and appearance

**File to Create:** `/src/manifest.json`

**Manifest Schema:**
```json
{
  "name": "Permahub Wiki",
  "short_name": "Permahub",
  "description": "Global permaculture community wiki - guides, events, locations, and resources for sustainable living",
  "start_url": "/src/wiki/wiki-home.html",
  "scope": "/src/wiki/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "theme_color": "#2d8659",
  "background_color": "#f5f5f0",
  "categories": ["education", "lifestyle", "sustainability"],
  "lang": "en",
  "dir": "ltr",
  "icons": [
    {
      "src": "/src/assets/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/src/assets/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/src/assets/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/src/assets/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/src/assets/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/src/assets/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/src/assets/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/src/assets/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "shortcuts": [
    {
      "name": "Browse Guides",
      "short_name": "Guides",
      "description": "Explore permaculture guides",
      "url": "/src/wiki/wiki-guides.html",
      "icons": [{ "src": "/src/assets/icons/shortcut-guides.png", "sizes": "96x96" }]
    },
    {
      "name": "View Events",
      "short_name": "Events",
      "description": "Discover upcoming events",
      "url": "/src/wiki/wiki-events.html",
      "icons": [{ "src": "/src/assets/icons/shortcut-events.png", "sizes": "96x96" }]
    },
    {
      "name": "Explore Map",
      "short_name": "Map",
      "description": "Find locations on map",
      "url": "/src/wiki/wiki-map.html",
      "icons": [{ "src": "/src/assets/icons/shortcut-map.png", "sizes": "96x96" }]
    }
  ],
  "screenshots": [
    {
      "src": "/src/assets/screenshots/desktop-home.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/src/assets/screenshots/mobile-home.png",
      "sizes": "750x1334",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ]
}
```

**Key Properties Explained:**

| Property | Purpose | Value for Permahub |
|----------|---------|-------------------|
| `name` | Full app name | "Permahub Wiki" |
| `short_name` | Home screen name (12 chars max) | "Permahub" |
| `start_url` | Initial page when launched | "/src/wiki/wiki-home.html" |
| `scope` | Navigation scope | "/src/wiki/" |
| `display` | Window mode | "standalone" (no browser UI) |
| `theme_color` | Toolbar color | "#2d8659" (green) |
| `background_color` | Splash screen background | "#f5f5f0" (cream) |
| `icons` | App icons | 8 sizes from 72px to 512px |

**Acceptance Criteria:**
- [ ] manifest.json created in `/src/`
- [ ] All required properties present
- [ ] start_url points to wiki-home.html
- [ ] theme_color matches Permahub green
- [ ] Icons array defined (will create images next)

**Files Created:**
- NEW: `/src/manifest.json`

---

### Task 1.2: Link Manifest in All HTML Pages
**Status:** ⏳ Pending
**Time Estimate:** 30 minutes
**Dependencies:** Task 1.1 complete

**Objective:** Add manifest reference to all 13 wiki HTML pages

**HTML Files to Update:**
1. wiki-home.html
2. wiki-guides.html
3. wiki-page.html
4. wiki-editor.html
5. wiki-events.html
6. wiki-map.html
7. wiki-favorites.html
8. wiki-login.html
9. wiki-signup.html
10. wiki-forgot-password.html
11. wiki-reset-password.html
12. wiki-admin.html
13. wiki-issues.html

**Code to Add in `<head>` Section:**
```html
<!-- PWA Manifest -->
<link rel="manifest" href="../manifest.json">

<!-- iOS-specific meta tags -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Permahub">
<link rel="apple-touch-icon" href="../assets/icons/icon-192x192.png">

<!-- Theme color for browser UI -->
<meta name="theme-color" content="#2d8659">

<!-- MS Tile icons (Windows) -->
<meta name="msapplication-TileColor" content="#2d8659">
<meta name="msapplication-TileImage" content="../assets/icons/icon-144x144.png">
```

**Why These Tags Matter:**

- **`rel="manifest"`**: Links to PWA manifest (required)
- **iOS tags**: iOS Safari doesn't fully support manifest, needs manual tags
- **`theme-color`**: Colors browser toolbar on Android/desktop
- **MS tags**: Windows tile appearance when pinned to Start Menu

**Acceptance Criteria:**
- [ ] All 13 HTML files updated
- [ ] Manifest link added to each `<head>`
- [ ] iOS meta tags added
- [ ] Theme color consistent across all pages
- [ ] Paths correct (relative to HTML file location)

**Files Modified:**
- MODIFIED: All 13 `/src/wiki/*.html` files

---

### Task 1.3: Create App Icon Assets
**Status:** ⏳ Pending
**Time Estimate:** 1-2 hours
**Dependencies:** None (can work in parallel)

**Objective:** Design and generate app icons for all platforms

**Icon Requirements:**

**Master Icon:**
- **Size:** 1024x1024px PNG
- **Design:** Simple, recognizable, Permahub-branded
- **Colors:** Green (#2d8659), earth tones
- **Theme:** Permaculture symbol, leaf, plant, earth
- **Background:** Solid color or subtle gradient (no transparency issues)

**Required Sizes:**
- 72x72 (Android small)
- 96x96 (Android medium, shortcuts)
- 128x128 (Android large)
- 144x144 (MS Tile)
- 152x152 (iOS small)
- 192x192 (Android standard, iOS)
- 384x384 (Android medium-large)
- 512x512 (Android large, splash screen)

**Maskable Icons:**
PWA icons should work with masks (circles, rounded squares) on Android:
- 192x192 maskable
- 512x512 maskable

**Design Tips:**
1. Keep design centered (80% safe zone for maskable)
2. High contrast for visibility
3. Simple shapes (complex details lost at small sizes)
4. No text (except maybe "P" monogram)
5. Test on light and dark backgrounds

**Tools:**
- **Figma/Sketch:** Vector design (recommended)
- **GIMP/Photoshop:** Raster design
- **PWA Asset Generator:** Automate size generation: https://github.com/elegantapp/pwa-asset-generator
- **Maskable.app:** Test maskable icon safety: https://maskable.app/

**Steps:**
1. Design master 1024x1024 icon
2. Generate all required sizes
3. Create maskable versions (with safe zone padding)
4. Save to `/src/assets/icons/`
5. Optimize PNGs (use ImageOptim, TinyPNG)

**Acceptance Criteria:**
- [ ] Master 1024x1024 icon designed
- [ ] All 8 required sizes generated
- [ ] Maskable variants created (192, 512)
- [ ] Icons saved to `/src/assets/icons/`
- [ ] Files optimized (compressed)
- [ ] Icons tested on different backgrounds

**Files Created:**
- NEW: `/src/assets/icons/icon-72x72.png`
- NEW: `/src/assets/icons/icon-96x96.png`
- NEW: `/src/assets/icons/icon-128x128.png`
- NEW: `/src/assets/icons/icon-144x144.png`
- NEW: `/src/assets/icons/icon-152x152.png`
- NEW: `/src/assets/icons/icon-192x192.png`
- NEW: `/src/assets/icons/icon-384x384.png`
- NEW: `/src/assets/icons/icon-512x512.png`
- NEW: `/src/assets/icons/icon-1024x1024.png` (master)

---

## **PHASE 2: Service Worker (Caching)**

### Task 2.1: Create Service Worker File
**Status:** ⏳ Pending
**Time Estimate:** 2 hours
**Dependencies:** Phase 1 complete

**Objective:** Create service worker to handle caching and offline functionality

**File to Create:** `/src/sw.js` (service worker)

**Service Worker Strategy:**

We'll use a **Stale-While-Revalidate** strategy with offline fallback:

1. **App Shell (Cache First):** HTML, CSS, JS cached aggressively
2. **API Data (Network First):** Supabase requests prefer fresh data
3. **Images (Cache First):** Static assets cached indefinitely
4. **CDN Assets (Cache First):** Font Awesome, Leaflet, Quill cached

**Service Worker Code:**

```javascript
/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/src/sw.js
 * Description: Service Worker for Permahub Wiki PWA - handles caching and offline functionality
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-01-20
 */

const CACHE_NAME = 'permahub-wiki-v1';
const OFFLINE_URL = '/src/wiki/offline.html';

// Files to cache on service worker install
const PRECACHE_URLS = [
  // Core HTML pages
  '/src/wiki/wiki-home.html',
  '/src/wiki/wiki-guides.html',
  '/src/wiki/wiki-page.html',
  '/src/wiki/wiki-editor.html',
  '/src/wiki/wiki-events.html',
  '/src/wiki/wiki-map.html',
  '/src/wiki/wiki-favorites.html',
  '/src/wiki/wiki-login.html',

  // Core JavaScript
  '/src/wiki/js/wiki-i18n.js',
  '/src/js/supabase-client.js',
  '/src/js/config.js',
  '/src/js/i18n-translations.js',

  // Core CSS
  '/src/wiki/css/wiki.css',

  // Manifest and icons
  '/src/manifest.json',
  '/src/assets/icons/icon-192x192.png',
  '/src/assets/icons/icon-512x512.png',

  // CDN Assets (if downloaded locally)
  // '/src/assets/fontawesome-6.4.0/css/all.min.css',
  // '/src/assets/leaflet-1.9.4/dist/leaflet.css',
  // '/src/assets/quill-1.3.7/quill.snow.css',

  // Offline fallback
  OFFLINE_URL
];

// Install event - cache core files
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Precaching app shell');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting()) // Activate immediately
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control immediately
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Strategy 1: Supabase API - Network First (fresh data priority)
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(request);
        })
    );
    return;
  }

  // Strategy 2: App Shell (HTML, CSS, JS) - Cache First
  if (request.destination === 'document' ||
      request.destination === 'script' ||
      request.destination === 'style') {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached version, update cache in background
            fetch(request).then((response) => {
              if (response && response.status === 200) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, response);
                });
              }
            });
            return cachedResponse;
          }

          // Not in cache, fetch from network
          return fetch(request).then((response) => {
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          }).catch(() => {
            // Offline and not cached - show offline page
            if (request.destination === 'document') {
              return caches.match(OFFLINE_URL);
            }
          });
        })
    );
    return;
  }

  // Strategy 3: Images and static assets - Cache First
  if (request.destination === 'image' ||
      request.destination === 'font') {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          return cachedResponse || fetch(request).then((response) => {
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          });
        })
    );
    return;
  }

  // Default: Network first, cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Message event - handle cache updates from app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        console.log('[Service Worker] Cache cleared');
      })
    );
  }
});
```

**Caching Strategies Explained:**

| Strategy | Use Case | Behavior |
|----------|----------|----------|
| **Cache First** | App shell (HTML, CSS, JS, images) | Check cache → If miss, fetch network → Cache response |
| **Network First** | Supabase API data | Fetch network → If fails, check cache |
| **Stale While Revalidate** | Documents | Return cache immediately, update cache in background |

**Acceptance Criteria:**
- [ ] sw.js created in `/src/`
- [ ] Install event caches core files
- [ ] Activate event cleans old caches
- [ ] Fetch event implements caching strategies
- [ ] Supabase requests use Network First
- [ ] HTML/CSS/JS use Cache First
- [ ] Offline fallback page served when offline

**Files Created:**
- NEW: `/src/sw.js`

---

### Task 2.2: Create Offline Fallback Page
**Status:** ⏳ Pending
**Time Estimate:** 45 minutes
**Dependencies:** None

**Objective:** Create friendly offline page shown when no cache available

**File to Create:** `/src/wiki/offline.html`

**Offline Page Design:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline - Permahub Wiki</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #2d8659 0%, #1a5f3f 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }

    .offline-container {
      text-align: center;
      max-width: 500px;
    }

    .offline-icon {
      font-size: 80px;
      margin-bottom: 20px;
      opacity: 0.9;
    }

    h1 {
      font-size: 32px;
      margin-bottom: 15px;
      font-weight: 600;
    }

    p {
      font-size: 18px;
      line-height: 1.6;
      margin-bottom: 30px;
      opacity: 0.95;
    }

    .retry-button {
      background: white;
      color: #2d8659;
      padding: 15px 40px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }

    .retry-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    }

    .retry-button:active {
      transform: translateY(0);
    }

    .tips {
      margin-top: 40px;
      padding-top: 30px;
      border-top: 1px solid rgba(255,255,255,0.3);
      text-align: left;
    }

    .tips h2 {
      font-size: 20px;
      margin-bottom: 15px;
    }

    .tips ul {
      list-style: none;
    }

    .tips li {
      padding: 8px 0;
      padding-left: 25px;
      position: relative;
    }

    .tips li:before {
      content: "✓";
      position: absolute;
      left: 0;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="offline-container">
    <div class="offline-icon">🌱</div>
    <h1>You're Offline</h1>
    <p>It looks like you've lost your internet connection. Permahub Wiki needs an active connection to load fresh content from the community.</p>

    <button class="retry-button" onclick="location.reload()">
      Try Again
    </button>

    <div class="tips">
      <h2>While You Wait:</h2>
      <ul>
        <li>Check your internet connection</li>
        <li>Try switching networks (WiFi ↔ mobile data)</li>
        <li>Previously viewed pages may still be available</li>
        <li>Your changes will sync when you're back online</li>
      </ul>
    </div>
  </div>

  <script>
    // Automatically retry when online
    window.addEventListener('online', () => {
      console.log('Connection restored, reloading...');
      setTimeout(() => {
        location.reload();
      }, 1000);
    });
  </script>
</body>
</html>
```

**Features:**
- Clean, friendly design in Permahub brand colors
- Clear messaging about offline state
- Retry button to attempt reload
- Helpful tips while offline
- Auto-reload when connection restored

**Acceptance Criteria:**
- [ ] offline.html created
- [ ] Matches Permahub branding
- [ ] Retry button works
- [ ] Auto-reload on connection restore
- [ ] Mobile-responsive

**Files Created:**
- NEW: `/src/wiki/offline.html`

---

### Task 2.3: Register Service Worker in App
**Status:** ⏳ Pending
**Time Estimate:** 45 minutes
**Dependencies:** Tasks 2.1 and 2.2 complete

**Objective:** Register service worker from wiki pages

**File to Create:** `/src/wiki/js/pwa-register.js`

**Service Worker Registration Code:**
```javascript
/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/src/wiki/js/pwa-register.js
 * Description: Register and manage service worker for PWA functionality
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-01-20
 */

/**
 * Register Service Worker for PWA functionality
 *
 * Business Purpose: Enables offline caching, faster loading, and installability
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/src/sw.js')
      .then((registration) => {
        console.log('[PWA] Service Worker registered:', registration.scope);

        // Check for updates every 60 seconds
        setInterval(() => {
          registration.update();
        }, 60000);

        // Listen for service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              console.log('[PWA] New version available');
              showUpdateNotification();
            }
          });
        });
      })
      .catch((error) => {
        console.error('[PWA] Service Worker registration failed:', error);
      });

    // Handle offline/online status
    window.addEventListener('online', () => {
      console.log('[PWA] Back online');
      showNotification('Connection restored', 'success');
    });

    window.addEventListener('offline', () => {
      console.log('[PWA] Gone offline');
      showNotification('You are offline - cached content available', 'warning');
    });
  });
}

/**
 * Show update notification to user
 */
function showUpdateNotification() {
  const updateBanner = document.createElement('div');
  updateBanner.id = 'pwa-update-banner';
  updateBanner.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #2d8659;
      color: white;
      padding: 15px 20px;
      text-align: center;
      z-index: 10000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    ">
      <strong>New version available!</strong>
      <button onclick="window.location.reload()" style="
        background: white;
        color: #2d8659;
        border: none;
        padding: 8px 20px;
        margin-left: 15px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 600;
      ">
        Update Now
      </button>
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: transparent;
        color: white;
        border: 1px solid white;
        padding: 8px 20px;
        margin-left: 10px;
        border-radius: 5px;
        cursor: pointer;
      ">
        Later
      </button>
    </div>
  `;
  document.body.appendChild(updateBanner);
}

/**
 * Show notification to user
 */
function showNotification(message, type = 'info') {
  const colors = {
    success: '#2d8659',
    warning: '#d4a574',
    info: '#556b6f',
    error: '#c0392b'
  };

  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: ${colors[type]};
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    z-index: 9999;
    animation: slideInRight 0.3s ease-out;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

/**
 * Check if app is running as installed PWA
 */
export function isInstalledPWA() {
  // Check if running in standalone mode
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIOSStandalone = window.navigator.standalone === true;

  return isStandalone || isIOSStandalone;
}

/**
 * Get installation status
 */
export function getInstallationStatus() {
  if (isInstalledPWA()) {
    return 'installed';
  }

  // Check if browser supports installation
  if ('BeforeInstallPromptEvent' in window) {
    return 'installable';
  }

  return 'not-supported';
}

console.log('[PWA] Registration script loaded');
```

**Add to All 13 HTML Files:**
```html
<!-- In <head> section, after other scripts -->
<script type="module" src="js/pwa-register.js"></script>
```

**Features:**
- Registers service worker on page load
- Checks for updates every 60 seconds
- Shows update notification when new version available
- Shows online/offline status notifications
- Provides helper functions to detect PWA installation

**Acceptance Criteria:**
- [ ] pwa-register.js created
- [ ] Service worker registers successfully
- [ ] Update detection works
- [ ] Online/offline notifications display
- [ ] Script linked in all 13 HTML files

**Files Created:**
- NEW: `/src/wiki/js/pwa-register.js`

**Files Modified:**
- MODIFIED: All 13 `/src/wiki/*.html` files

---

## **PHASE 3: Install Prompts & UX**

### Task 3.1: Create Install Button Component
**Status:** ⏳ Pending
**Time Estimate:** 1 hour
**Dependencies:** Phase 2 complete

**Objective:** Add "Install App" button for browsers that support PWA installation

**File to Create:** `/src/wiki/js/pwa-install.js`

**Install Prompt Code:**
```javascript
/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/src/wiki/js/pwa-install.js
 * Description: Handle PWA installation prompt and UI
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-01-20
 */

let deferredPrompt;
let installButton;

/**
 * Initialize PWA install prompt
 */
export function initInstallPrompt() {
  // Create install button (hidden by default)
  createInstallButton();

  // Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('[PWA] Install prompt available');

    // Prevent default prompt
    e.preventDefault();

    // Store event for later use
    deferredPrompt = e;

    // Show custom install button
    showInstallButton();
  });

  // Listen for app installed event
  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed successfully');
    hideInstallButton();
    deferredPrompt = null;

    // Show success message
    showNotification('Permahub Wiki installed! Look for the app icon on your device.', 'success');
  });
}

/**
 * Create install button element
 */
function createInstallButton() {
  installButton = document.createElement('button');
  installButton.id = 'pwa-install-button';
  installButton.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="margin-right: 8px;">
      <path d="M10 2V14M10 14L6 10M10 14L14 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M3 18H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
    Install App
  `;

  installButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #2d8659;
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(45, 134, 89, 0.4);
    display: none;
    align-items: center;
    z-index: 9998;
    transition: all 0.3s ease;
  `;

  installButton.addEventListener('mouseenter', () => {
    installButton.style.transform = 'translateX(-50%) translateY(-3px)';
    installButton.style.boxShadow = '0 6px 25px rgba(45, 134, 89, 0.5)';
  });

  installButton.addEventListener('mouseleave', () => {
    installButton.style.transform = 'translateX(-50%) translateY(0)';
    installButton.style.boxShadow = '0 4px 20px rgba(45, 134, 89, 0.4)';
  });

  installButton.addEventListener('click', handleInstallClick);

  document.body.appendChild(installButton);
}

/**
 * Show install button
 */
function showInstallButton() {
  if (installButton) {
    installButton.style.display = 'flex';

    // Animate in
    setTimeout(() => {
      installButton.style.animation = 'bounceIn 0.5s ease-out';
    }, 100);
  }
}

/**
 * Hide install button
 */
function hideInstallButton() {
  if (installButton) {
    installButton.style.display = 'none';
  }
}

/**
 * Handle install button click
 */
async function handleInstallClick() {
  if (!deferredPrompt) {
    console.log('[PWA] No install prompt available');
    return;
  }

  // Show native install prompt
  deferredPrompt.prompt();

  // Wait for user response
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`[PWA] User response: ${outcome}`);

  if (outcome === 'accepted') {
    console.log('[PWA] User accepted installation');
  } else {
    console.log('[PWA] User dismissed installation');
  }

  // Clear prompt
  deferredPrompt = null;
  hideInstallButton();
}

/**
 * Show iOS install instructions
 * (iOS Safari doesn't support beforeinstallprompt)
 */
function showIOSInstallInstructions() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = window.navigator.standalone;

  if (isIOS && !isStandalone) {
    const instructions = document.createElement('div');
    instructions.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        color: #333;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        max-width: 320px;
        z-index: 9998;
        text-align: center;
      ">
        <div style="font-size: 40px; margin-bottom: 10px;">📲</div>
        <div style="font-weight: 600; margin-bottom: 8px;">Install Permahub Wiki</div>
        <div style="font-size: 14px; line-height: 1.5; color: #666;">
          Tap <strong>Share</strong>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="vertical-align: middle; margin: 0 3px;">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" stroke-width="2"/>
          </svg>
          then <strong>"Add to Home Screen"</strong>
        </div>
        <button onclick="this.parentElement.remove()" style="
          margin-top: 15px;
          background: #2d8659;
          color: white;
          border: none;
          padding: 10px 25px;
          border-radius: 8px;
          cursor: pointer;
        ">
          Got it
        </button>
      </div>
    `;

    document.body.appendChild(instructions);

    // Auto-remove after 10 seconds
    setTimeout(() => instructions.remove(), 10000);
  }
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInstallPrompt);
} else {
  initInstallPrompt();
}

// Show iOS instructions after 3 seconds
setTimeout(showIOSInstallInstructions, 3000);

// Add bounce animation
const style = document.createElement('style');
style.textContent = `
  @keyframes bounceIn {
    0% {
      transform: translateX(-50%) scale(0.3);
      opacity: 0;
    }
    50% {
      transform: translateX(-50%) scale(1.05);
    }
    70% {
      transform: translateX(-50%) scale(0.9);
    }
    100% {
      transform: translateX(-50%) scale(1);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

console.log('[PWA] Install script loaded');
```

**Add to wiki-home.html Only:**
```html
<!-- In <head> section -->
<script type="module" src="js/pwa-install.js"></script>
```

**Why Only Home Page:**
- Install prompt should appear once (not on every page)
- Home page is most common entry point
- Avoids annoying users with repeated prompts

**Features:**
- Captures browser's install prompt
- Shows custom "Install App" button
- Handles installation flow
- Shows iOS-specific instructions (Safari doesn't support standard API)
- Auto-hides after installation

**Acceptance Criteria:**
- [ ] pwa-install.js created
- [ ] Install button appears when app is installable
- [ ] Clicking button triggers native install prompt
- [ ] iOS users see manual instructions
- [ ] Button hides after installation

**Files Created:**
- NEW: `/src/wiki/js/pwa-install.js`

**Files Modified:**
- MODIFIED: `/src/wiki/wiki-home.html`

---

## **PHASE 4: Testing & Validation**

### Task 4.1: Test PWA with Lighthouse
**Status:** ⏳ Pending
**Time Estimate:** 30 minutes
**Dependencies:** Phases 1-3 complete

**Objective:** Validate PWA meets all requirements using Chrome Lighthouse

**Steps:**

1. **Deploy to HTTPS server** (PWA requires HTTPS)
   - Use Vercel, Netlify, or GitHub Pages
   - Or use local HTTPS server for testing

2. **Run Lighthouse Audit:**
   - Open Chrome DevTools (F12)
   - Go to "Lighthouse" tab
   - Select "Progressive Web App" category
   - Click "Analyze page load"

3. **Check PWA Criteria:**
   - [ ] Page load is fast (< 2 seconds)
   - [ ] HTTPS secure connection
   - [ ] Responsive design (mobile-friendly)
   - [ ] Content sized correctly for viewport
   - [ ] Web app manifest present
   - [ ] Service worker registered
   - [ ] Installable (all criteria met)
   - [ ] Icons provided (192px, 512px)
   - [ ] Theme color set
   - [ ] Offline fallback page works

4. **Target Score: 90+** (out of 100)

**Common Issues & Fixes:**

| Issue | Fix |
|-------|-----|
| "No manifest" | Check manifest link in HTML |
| "Icons not found" | Verify icon paths in manifest |
| "Service worker not registered" | Check sw.js path in registration |
| "Not installable" | Ensure HTTPS + manifest + SW |
| "No offline support" | Verify SW fetch handler works |

**Acceptance Criteria:**
- [ ] Lighthouse PWA score 90+
- [ ] All PWA criteria passed
- [ ] No critical errors
- [ ] Installable badge shows in Chrome

**Documentation:**
- Take screenshot of Lighthouse report
- Save to `/docs/testing/lighthouse-pwa-report.png`

---

### Task 4.2: Test Installation on Desktop
**Status:** ⏳ Pending
**Time Estimate:** 30 minutes
**Dependencies:** Task 4.1 complete

**Objective:** Test PWA installation on desktop browsers

**Test Matrix:**

| Browser | Platform | Test |
|---------|----------|------|
| Chrome | macOS | Install, launch, offline |
| Chrome | Windows | Install, launch, offline |
| Edge | Windows | Install, launch, offline |
| Safari | macOS | Manual install, launch |

**Test Steps:**

1. **Chrome/Edge Installation:**
   - Visit wiki home page
   - Look for install icon in address bar (+ or download icon)
   - Click install button OR use custom install button
   - Confirm installation
   - Launch installed app
   - Verify standalone window (no browser UI)
   - Test offline mode (disconnect internet)
   - Close and relaunch

2. **Safari Installation (macOS):**
   - Visit wiki home page
   - File → Share → Add to Dock
   - Launch from Dock
   - Verify works as expected

**Acceptance Criteria:**
- [ ] Installs successfully on Chrome
- [ ] Installs successfully on Edge
- [ ] Launches in standalone window
- [ ] Icon appears correct
- [ ] Title shows "Permahub Wiki"
- [ ] Offline mode works
- [ ] Cached content loads

---

### Task 4.3: Test Installation on Mobile
**Status:** ⏳ Pending
**Time Estimate:** 1 hour
**Dependencies:** Task 4.1 complete

**Objective:** Test PWA installation on mobile devices

**Test Matrix:**

| Device | OS | Browser | Test |
|--------|----|---------| -----|
| iPhone | iOS 15+ | Safari | Add to Home Screen |
| iPad | iOS 15+ | Safari | Add to Home Screen |
| Android | 10+ | Chrome | Install prompt |

**iOS Installation Steps:**

1. Open Safari on iPhone/iPad
2. Navigate to wiki home page
3. Tap Share button (square with arrow)
4. Scroll down and tap "Add to Home Screen"
5. Edit name if desired (default: "Permahub")
6. Tap "Add"
7. Icon appears on home screen
8. Launch app
9. Verify standalone mode (no Safari UI)
10. Test offline (airplane mode)

**Android Installation Steps:**

1. Open Chrome on Android
2. Navigate to wiki home page
3. Tap banner "Add Permahub Wiki to Home screen"
   - OR tap menu → "Install app"
4. Confirm installation
5. Icon appears on home screen
6. Launch app
7. Verify standalone mode
8. Test offline (airplane mode)

**Acceptance Criteria:**
- [ ] iOS installation works
- [ ] Android installation works
- [ ] App launches in standalone mode
- [ ] Splash screen shows (Android)
- [ ] Icon looks good on home screen
- [ ] Offline mode works
- [ ] Supabase connection works when online

---

### Task 4.4: Test Offline Functionality
**Status:** ⏳ Pending
**Time Estimate:** 45 minutes
**Dependencies:** Phases 1-3 complete

**Objective:** Verify app works offline with cached content

**Test Scenarios:**

1. **First Visit (No Cache):**
   - Clear browser cache
   - Visit wiki home page
   - Disconnect internet immediately
   - Navigate to other pages
   - **Expected:** Offline page shows

2. **Second Visit (With Cache):**
   - Connect internet
   - Visit wiki home page
   - Navigate to 2-3 pages (builds cache)
   - Disconnect internet
   - Revisit cached pages
   - **Expected:** Cached pages load

3. **Supabase Data:**
   - Load wiki home (loads data from Supabase)
   - Disconnect internet
   - Refresh page
   - **Expected:** Cached data displays (may be stale)

4. **Images and Assets:**
   - Load pages with images
   - Disconnect internet
   - Revisit pages
   - **Expected:** Images display from cache

5. **Navigation:**
   - While offline
   - Click navigation links
   - **Expected:** Cached pages load, uncached show offline page

**Acceptance Criteria:**
- [ ] Offline page shows for uncached content
- [ ] Cached pages load offline
- [ ] Images display from cache
- [ ] Navigation works offline (for cached pages)
- [ ] Online status notification shows when reconnected
- [ ] Data refreshes when back online

---

## **PHASE 5: Optimization & Enhancement**

### Task 5.1: Add Cache Management UI
**Status:** ⏳ Pending (Optional)
**Time Estimate:** 1 hour
**Dependencies:** Phase 4 complete

**Objective:** Give users control over cached data

**Add to Settings/Profile:**
```html
<!-- Add to wiki-home.html or settings page -->
<section id="pwa-cache-settings">
  <h3>App Storage</h3>
  <p>Cached content: <span id="cache-size">Calculating...</span></p>
  <button id="clear-cache-btn" class="btn-secondary">Clear Cache</button>
  <button id="update-cache-btn" class="btn-primary">Check for Updates</button>
</section>
```

**JavaScript (add to pwa-register.js):**
```javascript
/**
 * Calculate cache size
 */
async function calculateCacheSize() {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    const usedMB = (estimate.usage / 1024 / 1024).toFixed(2);
    const quotaMB = (estimate.quota / 1024 / 1024).toFixed(2);
    return `${usedMB} MB / ${quotaMB} MB`;
  }
  return 'Unknown';
}

/**
 * Clear all caches
 */
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
  console.log('[PWA] All caches cleared');
  location.reload();
}

/**
 * Force update service worker
 */
async function forceUpdate() {
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration) {
    await registration.update();
    console.log('[PWA] Update check complete');
  }
}

// Wire up buttons
document.getElementById('clear-cache-btn')?.addEventListener('click', async () => {
  if (confirm('This will clear all cached content. Continue?')) {
    await clearAllCaches();
  }
});

document.getElementById('update-cache-btn')?.addEventListener('click', async () => {
  await forceUpdate();
  alert('Checked for updates. Refresh page if update available.');
});

// Display cache size
calculateCacheSize().then(size => {
  const elem = document.getElementById('cache-size');
  if (elem) elem.textContent = size;
});
```

**Acceptance Criteria:**
- [ ] Cache size displays
- [ ] Clear cache button works
- [ ] Update check button works
- [ ] User feedback provided

---

### Task 5.2: Add Screenshots to Manifest
**Status:** ⏳ Pending (Optional)
**Time Estimate:** 1 hour
**Dependencies:** None

**Objective:** Add app preview screenshots for app stores

**Screenshots Needed:**

1. **Desktop Wide (1280x720):**
   - Homepage with guides
   - Map view with locations
   - Editor view

2. **Mobile Narrow (750x1334):**
   - Homepage on mobile
   - Guide detail page
   - Map view on mobile

**Steps:**
1. Take screenshots in Chrome DevTools (device mode)
2. Save to `/src/assets/screenshots/`
3. Optimize PNGs
4. Reference in manifest.json (already added in Task 1.1)

**Acceptance Criteria:**
- [ ] 3+ desktop screenshots
- [ ] 3+ mobile screenshots
- [ ] Screenshots added to manifest
- [ ] Files optimized (<500KB each)

---

## 📊 PWA Features Summary

| Feature | Status | Impact |
|---------|--------|--------|
| **Installable** | ✅ Core | Users can install to home screen/desktop |
| **Offline Support** | ✅ Core | Cached pages work without internet |
| **Fast Loading** | ✅ Core | Pre-cached assets load instantly |
| **Standalone Mode** | ✅ Core | Launches without browser UI |
| **Update Notifications** | ✅ Core | Alerts users to new versions |
| **App Icons** | ✅ Core | Custom icons on all platforms |
| **Splash Screen** | ✅ Core | Professional launch experience |
| **Shortcuts** | ✅ Enhanced | Quick access to guides/events/map |
| **Screenshots** | ⚠️ Optional | App store preview |
| **Cache Management** | ⚠️ Optional | User control over storage |

---

## 🚀 Deployment Requirements

### HTTPS Required
PWAs **require HTTPS** to work. Service workers won't register on http://.

**Options:**
1. **Vercel** (recommended) - Free HTTPS, automatic deployment
2. **Netlify** - Free HTTPS, drag-and-drop deploy
3. **GitHub Pages** - Free HTTPS for public repos
4. **Local Testing** - Use `http://localhost` (HTTPS not required)

### Deployment Checklist
- [ ] Deploy to HTTPS hosting
- [ ] Verify manifest.json accessible
- [ ] Verify sw.js accessible
- [ ] Verify all icon paths work
- [ ] Test install on production URL
- [ ] Configure custom domain (optional)

---

## 📋 Progress Tracking

| Phase | Tasks | Est. Time | Status |
|-------|-------|-----------|--------|
| Phase 1: Manifest | 3 | 2-3 hours | ⏳ Pending |
| Phase 2: Service Worker | 3 | 3.5 hours | ⏳ Pending |
| Phase 3: Install UX | 1 | 1 hour | ⏳ Pending |
| Phase 4: Testing | 4 | 2.75 hours | ⏳ Pending |
| Phase 5: Optimization | 2 | 2 hours | ⚠️ Optional |
| **TOTAL** | **13** | **11.25 hours** | **0% Complete** |

---

## ✅ Success Criteria

Before considering PWA complete:

- [ ] Lighthouse PWA score 90+
- [ ] Installs on Chrome/Edge desktop
- [ ] Installs on iOS Safari
- [ ] Installs on Android Chrome
- [ ] Works offline with cached content
- [ ] Service worker updates automatically
- [ ] Icons display correctly
- [ ] Standalone mode works
- [ ] No console errors
- [ ] Deployed to HTTPS hosting

---

## 🔗 Resources

### Documentation
- [PWA Documentation (MDN)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web App Manifest Spec](https://www.w3.org/TR/appmanifest/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Workbox (Service Worker Library)](https://developers.google.com/web/tools/workbox)

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - PWA auditing
- [PWA Builder](https://www.pwabuilder.com/) - Generate PWA assets
- [Maskable.app](https://maskable.app/) - Test maskable icons
- [Real Favicon Generator](https://realfavicongenerator.net/) - Generate icons

### Testing
- [Chrome DevTools - Application Tab](https://developer.chrome.com/docs/devtools/progressive-web-apps/)
- [iOS Simulator](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device) - Test iOS installation
- [Android Emulator](https://developer.android.com/studio/run/emulator) - Test Android installation

---

## 🎯 Next Steps

**Ready to start?** Here's the recommended order:

1. **Start with Phase 1, Task 1.1** - Create manifest.json
2. **Then Task 1.3** - Create app icons (can use placeholder initially)
3. **Then Task 1.2** - Link manifest in HTML pages
4. **Then Phase 2** - Create service worker and offline page
5. **Deploy to HTTPS** - Can't test installation without HTTPS
6. **Then Phase 3-4** - Install prompts and testing

**Estimated Time to Working PWA:** 6-8 hours (core features only)

---

**Status:** 🚧 Ready to Begin

**Created:** 2025-01-20

**Next Task:** Create manifest.json (Phase 1, Task 1.1)
