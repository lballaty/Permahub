/**
 * Application Version Management
 * Permaculture Network Platform
 *
 * Version format: YYYYMMDD.HHmm.v#
 * Example: 20250114.1142.v1
 */

// Build version string from timestamp
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');

// Version number (increment this manually for each release)
const versionNumber = 9;

// Full version string
export const VERSION = `${year}${month}${day}.${hours}${minutes}.v${versionNumber}`;
export const VERSION_DATE = now.toISOString();
export const VERSION_DISPLAY = `v${VERSION}`;

// Log version on import
console.log(`%c🚀 Permahub Wiki ${VERSION_DISPLAY}`, 'color: #2ecc71; font-weight: bold; font-size: 16px;');
console.log(`📅 Build Date: ${VERSION_DATE}`);
console.log(`🔗 Environment: ${import.meta.env.MODE || 'development'}`);
console.log(`🌐 Supabase: ${import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321'}`);
console.log('─'.repeat(60));

/**
 * Display version in page header
 */
export function displayVersionInHeader() {
  // Find header element
  const header = document.querySelector('header') || document.querySelector('.wiki-nav');

  if (header) {
    // Check if badge already exists
    if (document.querySelector('.version-badge')) {
      console.log(`ℹ️ Version badge already exists`);
      return;
    }

    // Create version badge
    const versionBadge = document.createElement('span');
    versionBadge.className = 'version-badge';
    versionBadge.textContent = VERSION_DISPLAY;
    versionBadge.style.cssText = `
      background: #2ecc71;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: bold;
      margin-left: 10px;
      vertical-align: middle;
      position: absolute;
      top: 15px;
      right: 15px;
    `;

    // For wiki pages, add to the nav element
    const wikiNav = header.querySelector('.wiki-nav');
    if (wikiNav) {
      wikiNav.style.position = 'relative'; // Ensure relative positioning for absolute child
      wikiNav.appendChild(versionBadge);
    } else {
      // For other pages, try to find a title or add to header
      const title = header.querySelector('h1, .title');
      if (title) {
        versionBadge.style.position = 'static';
        title.appendChild(versionBadge);
      } else {
        header.style.position = 'relative';
        header.appendChild(versionBadge);
      }
    }

    console.log(`✅ Version badge displayed in header: ${VERSION_DISPLAY}`);
  } else {
    console.warn('⚠️ Could not find header element for version badge');
  }
}

/**
 * Check if cached assets are stale (for future use)
 */
export function checkCacheVersion() {
  const cachedVersion = localStorage.getItem('app_version');

  if (cachedVersion && cachedVersion !== VERSION) {
    console.warn(`⚠️ Version mismatch! Cached: ${cachedVersion}, Current: ${VERSION}`);
    console.log('🔄 Clearing cache...');

    // Clear old version from cache
    localStorage.setItem('app_version', VERSION);

    // Optionally reload to get fresh assets
    // window.location.reload(true);
  } else {
    localStorage.setItem('app_version', VERSION);
  }
}

// Auto-check cache version
checkCacheVersion();
