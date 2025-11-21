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
      .catch((error) => {
        console.error('[Service Worker] Precaching failed:', error);
      })
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
            }).catch(() => {
              // Ignore fetch errors when updating cache
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

console.log('[Service Worker] Loaded');
