/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/src/js/version-manager.js
 * Description: Centralized version management with automatic badge display and smart positioning
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-01-18
 */

/**
 * Version Management System
 *
 * Automatically reads version from package.json (via Vite env variables)
 * Format: "Permahub YYYY-MM-DD HH:mm #X"
 * Example: "Permahub 2025-01-18 14:23 #1"
 */

// Safely get config and handle missing import.meta.env
let SUPABASE_CONFIG = null;
try {
  const configModule = require('./config.js');
  SUPABASE_CONFIG = configModule.SUPABASE_CONFIG || { isUsingCloud: true };
} catch (e) {
  // If import fails, use defaults
  SUPABASE_CONFIG = { isUsingCloud: true, url: 'https://mcbxbaggjaxqfdvmrqsc.supabase.co' };
}

// Get version from package.json (injected by Vite)
// Handle both module and non-module contexts
const PACKAGE_VERSION = (() => {
  try {
    return (typeof import !== 'undefined' && import.meta?.env?.VITE_APP_VERSION) || '1.0.68';
  } catch (e) {
    return '1.0.68';
  }
})();

const BUILD_TIME = (() => {
  try {
    return (typeof import !== 'undefined' && import.meta?.env?.VITE_BUILD_TIME) || new Date().toISOString();
  } catch (e) {
    return new Date().toISOString();
  }
})();

const COMMIT_HASH = (() => {
  try {
    return (typeof import !== 'undefined' && import.meta?.env?.VITE_COMMIT_HASH) || 'dev';
  } catch (e) {
    return 'dev';
  }
})();

// Parse semantic version to get patch number
const [major, minor, patch] = PACKAGE_VERSION.split('.').map(Number);

// Format build time for display
const buildDate = new Date(BUILD_TIME);
const year = buildDate.getFullYear();
const month = String(buildDate.getMonth() + 1).padStart(2, '0');
const day = String(buildDate.getDate()).padStart(2, '0');
const hours = String(buildDate.getHours()).padStart(2, '0');
const minutes = String(buildDate.getMinutes()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;
const formattedTime = `${hours}:${minutes}`;

// Build version display string
export const VERSION = PACKAGE_VERSION;
export const VERSION_NUMBER = patch;
export const VERSION_DISPLAY = `Permahub ${formattedDate} ${formattedTime} #${patch}`;
export const VERSION_SHORT = `v${PACKAGE_VERSION}`;
export const VERSION_COMMIT = COMMIT_HASH;

// Log version on import
console.log(`%c🚀 ${VERSION_DISPLAY}`, 'color: #2ecc71; font-weight: bold; font-size: 16px;');
console.log(`📦 Version: ${VERSION}`);
console.log(`📝 Commit: ${COMMIT_HASH}`);
console.log(`📅 Build: ${BUILD_TIME}`);
try {
  const mode = typeof import !== 'undefined' && import.meta?.env?.MODE ? import.meta.env.MODE : 'production';
  const supabaseUrl = typeof import !== 'undefined' && import.meta?.env?.VITE_SUPABASE_URL ? import.meta.env.VITE_SUPABASE_URL : 'https://mcbxbaggjaxqfdvmrqsc.supabase.co';
  console.log(`🔗 Environment: ${mode}`);
  console.log(`🌐 Supabase: ${supabaseUrl}`);
} catch (e) {
  console.log(`🔗 Environment: production`);
  console.log(`🌐 Supabase: https://mcbxbaggjaxqfdvmrqsc.supabase.co`);
}
console.log('─'.repeat(60));

/**
 * Smart positioning logic to avoid overlapping UI elements
 * Returns CSS properties for positioning the badge
 */
function getSmartBadgePosition() {
  const style = {
    position: 'fixed',
    top: '10px',
    right: '10px',
    zIndex: '999'
  };

  // Check for common header elements that might be in top-right
  const userMenu = document.querySelector('.user-menu, .profile-menu, [class*="user"], [class*="profile"]');
  const langSelector = document.querySelector('.language-selector, [class*="lang"], [class*="language"]');
  const navButtons = document.querySelectorAll('nav button, .nav-buttons, header button');

  // If there are elements in top-right, adjust positioning
  let topOffset = 10;
  let rightOffset = 10;

  if (userMenu) {
    const rect = userMenu.getBoundingClientRect();
    if (rect.right > window.innerWidth - 100) {
      // User menu is in top-right, move badge down
      topOffset = Math.max(rect.bottom + 5, 45);
    }
  }

  if (langSelector) {
    const rect = langSelector.getBoundingClientRect();
    if (rect.right > window.innerWidth - 100) {
      // Language selector is in top-right, adjust position
      topOffset = Math.max(topOffset, rect.bottom + 5);
    }
  }

  // Check if there are many buttons in header (likely in top-right)
  if (navButtons.length > 2) {
    topOffset = Math.max(topOffset, 45); // Move down to avoid button clusters
  }

  style.top = `${topOffset}px`;
  style.right = `${rightOffset}px`;

  return style;
}

/**
 * Display version badge in page header with smart positioning
 * Automatically called on module import if DOM is ready
 */
export function displayVersionBadge() {
  // Check if badge already exists
  if (document.querySelector('.version-badge')) {
    console.log(`ℹ️ Version badge already exists`);
    return;
  }

  // Create version badge container
  const badgeContainer = document.createElement('div');
  badgeContainer.className = 'version-badge-container';

  // Create version badge
  const versionBadge = document.createElement('div');
  versionBadge.className = 'version-badge';
  versionBadge.textContent = VERSION_SHORT;
  versionBadge.title = `${VERSION_DISPLAY}\nCommit: ${COMMIT_HASH}\nClick for details`;

  // Create environment badge
  const envBadge = document.createElement('div');
  envBadge.className = 'env-badge';
  const isCloud = SUPABASE_CONFIG?.isUsingCloud;
  envBadge.textContent = isCloud ? 'Cloud DB' : 'Local DB';
  envBadge.title = isCloud
    ? `Using CLOUD Supabase database\nURL: ${SUPABASE_CONFIG.url}`
    : `Using LOCAL Supabase database\nURL: ${SUPABASE_CONFIG.url}`;

  // Get smart positioning
  const position = getSmartBadgePosition();

  // Apply styles with smart positioning
  badgeContainer.style.cssText = `
    position: ${position.position};
    top: ${position.top};
    right: ${position.right};
    z-index: ${position.zIndex};
    display: flex;
    gap: 6px;
    align-items: center;
    font-size: 11px;
  `;

  versionBadge.style.cssText = `
    background: rgba(45, 134, 89, 0.9);
    color: white;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  `;

  envBadge.style.cssText = `
    background: ${isCloud ? 'rgba(59, 130, 246, 0.9)' : 'rgba(234, 179, 8, 0.9)'};
    color: white;
    padding: 3px 8px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    backdrop-filter: blur(5px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  `;

  // Add hover effect
  versionBadge.addEventListener('mouseenter', () => {
    versionBadge.style.background = 'rgba(45, 134, 89, 0.6)';
    versionBadge.style.transform = 'scale(1.05)';
  });

  versionBadge.addEventListener('mouseleave', () => {
    versionBadge.style.background = 'rgba(45, 134, 89, 0.9)';
    versionBadge.style.transform = 'scale(1)';
  });

  // Click to show details
  versionBadge.addEventListener('click', () => {
    let env = 'development';
    try {
      env = (typeof import !== 'undefined' && import.meta?.env?.MODE) || 'development';
    } catch (e) {
      // Fallback to development if import.meta not available
    }
    alert(`${VERSION_DISPLAY}\n\nVersion: ${VERSION}\nCommit: ${COMMIT_HASH}\nBuild Time: ${BUILD_TIME}\nEnvironment: ${env}`);
  });

  // Assemble container
  badgeContainer.appendChild(envBadge);
  badgeContainer.appendChild(versionBadge);

  // Append to body (fixed positioning, so doesn't matter where in DOM)
  document.body.appendChild(badgeContainer);

  console.log(`✅ Version badge displayed: ${VERSION_SHORT}`);
}

/**
 * Check if cached assets are stale
 * Clears cache if version has changed
 */
export function checkCacheVersion() {
  const cachedVersion = localStorage.getItem('app_version');

  if (cachedVersion && cachedVersion !== VERSION) {
    console.warn(`⚠️ Version mismatch! Cached: ${cachedVersion}, Current: ${VERSION}`);
    console.log('🔄 Clearing cache...');

    // Clear old version from cache
    localStorage.setItem('app_version', VERSION);

    // Optionally reload to get fresh assets (uncomment if needed)
    // window.location.reload(true);
  } else {
    localStorage.setItem('app_version', VERSION);
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    checkCacheVersion();
    displayVersionBadge();
  });
} else {
  // DOM already loaded
  checkCacheVersion();
  displayVersionBadge();
}

// Export for manual usage if needed
export default {
  VERSION,
  VERSION_NUMBER,
  VERSION_DISPLAY,
  VERSION_SHORT,
  VERSION_COMMIT,
  displayVersionBadge,
  checkCacheVersion
};
