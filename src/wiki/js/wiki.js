/**
 * Community Wiki - JavaScript
 *
 * This file contains shared JavaScript functionality for the Community Wiki.
 * In production, this will integrate with Supabase for backend operations.
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('Community Wiki initialized');

  // Initialize any common functionality here
  initializeSearch();
  initializeMobileMenu();
  initializeLanguageSelector();
  setActiveNavigationState();

  // Initialize i18n if available
  if (window.wikiI18n) {
    window.wikiI18n.init();

    // Set HTML lang attribute to match current language
    const currentLang = window.wikiI18n.getLanguage();
    document.documentElement.lang = currentLang;

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
  const nav = document.querySelector('.wiki-nav');
  const menu = document.querySelector('.wiki-menu');

  if (!nav || !menu) return;

  // Create mobile menu toggle button
  let toggleBtn = document.querySelector('.mobile-menu-toggle');
  if (!toggleBtn) {
    toggleBtn = document.createElement('button');
    toggleBtn.className = 'mobile-menu-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle menu');
    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    nav.appendChild(toggleBtn);
  }

  // Create overlay for mobile menu
  let overlay = document.querySelector('.mobile-menu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);
  }

  // Toggle menu on button click
  toggleBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    const isActive = menu.classList.contains('active');

    if (isActive) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when clicking overlay
  overlay.addEventListener('click', closeMenu);

  // Close menu when clicking menu links (except language selector)
  const menuLinks = menu.querySelectorAll('a:not(.lang-selector-btn)');
  menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Only close on mobile
      if (window.innerWidth <= 768) {
        closeMenu();
      }
    });
  });

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // Close menu if switching to desktop view
      if (window.innerWidth > 768 && menu.classList.contains('active')) {
        closeMenu();
      }
    }, 250);
  });

  // Update toggle button icon
  function updateToggleIcon() {
    const icon = toggleBtn.querySelector('i');
    if (menu.classList.contains('active')) {
      icon.className = 'fas fa-times';
    } else {
      icon.className = 'fas fa-bars';
    }
  }

  // Open menu
  function openMenu() {
    menu.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scroll
    updateToggleIcon();
  }

  // Close menu
  function closeMenu() {
    menu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
    updateToggleIcon();
  }

  // Initialize icon
  updateToggleIcon();

  // Make functions available globally for other scripts
  window.WikiMobileMenu = {
    open: openMenu,
    close: closeMenu
  };
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
  if (!window.wikiI18n) {
    console.error('i18n not loaded');
    return;
  }

  window.wikiI18n.setLanguage(lang);

  // Update HTML lang attribute
  document.documentElement.lang = lang;

  updatePageLanguage();
  updateActiveLanguage();
  showNotification(window.wikiI18n.t('wiki.common.language_changed'), 'info');
}

/**
 * Update all text on the page based on current language
 */
function updatePageLanguage() {
  if (!window.wikiI18n) return;

  // Update all elements with data-i18n attribute
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.dataset.i18n;
    const translation = window.wikiI18n.t(key);

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
    const translation = window.wikiI18n.t(key);
    if (el.placeholder !== undefined) {
      el.placeholder = translation;
    }
  });

  // Update language selector button text
  const langBtn = document.getElementById('langSelectorBtn');
  if (langBtn) {
    const currentLang = window.wikiI18n.getLanguage();
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
      ko: '한국어',
      cs: 'Čeština',
      sk: 'Slovenčina',
      uk: 'Українська',
      ru: 'Русский'
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
  if (!window.wikiI18n) return;

  const currentLang = window.wikiI18n.getLanguage();
  const langOptions = document.querySelectorAll('.lang-option');

  langOptions.forEach(option => {
    if (option.dataset.lang === currentLang) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
  });
}

/**
 * Set active state on navigation based on current page
 */
function setActiveNavigationState() {
  const currentPage = window.location.pathname.split('/').pop() || 'wiki-home.html';
  const navLinks = document.querySelectorAll('.wiki-menu a[href]');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');

    // Remove existing active class
    link.classList.remove('active');

    // Add active class if href matches current page
    if (href === currentPage ||
        (currentPage === '' && href === 'wiki-home.html') ||
        (currentPage === 'index.html' && href === 'wiki-home.html')) {
      link.classList.add('active');
    }
  });
}

// Export functions for use in other scripts
window.WikiUtils = {
  formatDate,
  showNotification,
  healthCheck,
  changeLanguage,
  updatePageLanguage,
  setActiveNavigationState
};
