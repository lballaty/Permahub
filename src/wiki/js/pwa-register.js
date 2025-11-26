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
  window.addEventListener('load', async () => {
    const isGitHubPages = window.location.hostname.includes('github.io');
    const possiblePaths = isGitHubPages
      ? ['/Permahub/sw.js']
      : [
          // Common dev/server paths
          '../../sw.js',
          '/src/sw.js',
          '/sw.js'
        ];

    let registration = null;
    for (const swPath of possiblePaths) {
      try {
        registration = await navigator.serviceWorker.register(swPath);
        console.log('[PWA] Service Worker registered:', registration.scope, 'path:', swPath);
        break;
      } catch (err) {
        console.warn(`[PWA] Service Worker registration failed for ${swPath}:`, err);
      }
    }

    if (!registration) {
      console.error('[PWA] Service Worker registration failed for all known paths');
      return;
    }

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
  // Check if banner already exists
  if (document.getElementById('pwa-update-banner')) {
    return;
  }

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
      animation: slideDown 0.3s ease-out;
    ">
      <strong>🎉 New version available!</strong>
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

// Add CSS animations (guard to avoid duplicates)
if (!document.getElementById('pwa-animations-style')) {
  const style = document.createElement('style');
  style.id = 'pwa-animations-style';
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

    @keyframes slideDown {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Check if app is running as installed PWA
 */
function isInstalledPWA() {
  // Check if running in standalone mode
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIOSStandalone = window.navigator.standalone === true;

  return isStandalone || isIOSStandalone;
}

/**
 * Get installation status
 */
function getInstallationStatus() {
  if (isInstalledPWA()) {
    return 'installed';
  }

  // Check if browser supports installation
  if ('BeforeInstallPromptEvent' in window) {
    return 'installable';
  }

  return 'not-supported';
}

// Expose helpers for non-module usage
window.PWA = {
  isInstalledPWA,
  getInstallationStatus
};

console.log('[PWA] Registration script loaded');
