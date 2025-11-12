/**
 * Community Wiki - JavaScript
 *
 * This file contains shared JavaScript functionality for the Community Wiki.
 * In production, this will integrate with Supabase for backend operations.
 */

// Import i18n if available
let wikiI18n = null;
if (typeof window.wikiI18n !== 'undefined') {
  wikiI18n = window.wikiI18n;
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('Community Wiki initialized');

  // Initialize any common functionality here
  initializeSearch();
  initializeMobileMenu();
  initializeLanguageSelector();

  // Initialize i18n if available
  if (wikiI18n) {
    wikiI18n.init();
    updatePageLanguage();
  }
});

/**
 * Search functionality
 */
function initializeSearch() {
  const searchInputs = document.querySelectorAll('[id$="searchInput"], [id$="Search"]');

  searchInputs.forEach(input => {
    if (input) {
      input.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        // In production, this would query Supabase
        console.log('Search query:', query);
      });
    }
  });
}

/**
 * Mobile menu toggle
 */
function initializeMobileMenu() {
  // Add mobile menu toggle button if needed
  const nav = document.querySelector('.wiki-nav');
  if (nav && window.innerWidth < 768) {
    console.log('Mobile view detected');
    // Mobile menu implementation would go here
  }
}

/**
 * Health check function to ping backend
 * This will be called periodically to ensure Supabase connection is healthy
 */
async function healthCheck() {
  try {
    // In production, this would ping Supabase
    console.log('Health check: OK');
    return { status: 'ok', timestamp: new Date().toISOString() };
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'error', error: error.message };
  }
}

// Run health check every 5 minutes
setInterval(healthCheck, 5 * 60 * 1000);

/**
 * Format date for display
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Show notification to user
 */
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${type === 'error' ? 'var(--wiki-danger)' : 'var(--wiki-primary)'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
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
 * Initialize language selector dropdown
 */
function initializeLanguageSelector() {
  const langBtn = document.getElementById('langSelectorBtn');
  const langDropdown = document.getElementById('langDropdown');

  if (!langBtn || !langDropdown) {
    console.log('Language selector not found on this page');
    return;
  }

  // Toggle dropdown on button click
  langBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    langDropdown.classList.toggle('active');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!langDropdown.contains(e.target) && !langBtn.contains(e.target)) {
      langDropdown.classList.remove('active');
    }
  });

  // Handle language selection
  const langOptions = langDropdown.querySelectorAll('.lang-option');
  langOptions.forEach(option => {
    option.addEventListener('click', function(e) {
      e.preventDefault();
      const lang = this.dataset.lang;
      changeLanguage(lang);
      langDropdown.classList.remove('active');
    });
  });

  // Update active language in dropdown
  updateActiveLanguage();
}

/**
 * Change the current language
 */
function changeLanguage(lang) {
  if (!wikiI18n) {
    console.error('i18n not loaded');
    return;
  }

  wikiI18n.setLanguage(lang);
  updatePageLanguage();
  updateActiveLanguage();
  showNotification(wikiI18n.t('wiki.common.language_changed'), 'info');
}

/**
 * Update all text on the page based on current language
 */
function updatePageLanguage() {
  if (!wikiI18n) return;

  // Update all elements with data-i18n attribute
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.dataset.i18n;
    const translation = wikiI18n.t(key);

    // Update text content or placeholder
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      if (el.placeholder) {
        el.placeholder = translation;
      }
    } else {
      el.textContent = translation;
    }
  });

  // Update all elements with data-i18n-placeholder attribute
  const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
  placeholderElements.forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    const translation = wikiI18n.t(key);
    if (el.placeholder !== undefined) {
      el.placeholder = translation;
    }
  });

  // Update language selector button text
  const langBtn = document.getElementById('langSelectorBtn');
  if (langBtn) {
    const currentLang = wikiI18n.getLanguage();
    const langNames = {
      en: 'English',
      pt: 'Português',
      es: 'Español',
      fr: 'Français',
      de: 'Deutsch',
      it: 'Italiano',
      nl: 'Nederlands',
      pl: 'Polski',
      ja: '日本語',
      zh: '中文',
      ko: '한국어'
    };

    const langText = langBtn.querySelector('.lang-current');
    if (langText) {
      langText.textContent = langNames[currentLang] || 'English';
    }
  }
}

/**
 * Update active state in language dropdown
 */
function updateActiveLanguage() {
  if (!wikiI18n) return;

  const currentLang = wikiI18n.getLanguage();
  const langOptions = document.querySelectorAll('.lang-option');

  langOptions.forEach(option => {
    if (option.dataset.lang === currentLang) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
  });
}

// Export functions for use in other scripts
window.WikiUtils = {
  formatDate,
  showNotification,
  healthCheck,
  changeLanguage,
  updatePageLanguage
};
