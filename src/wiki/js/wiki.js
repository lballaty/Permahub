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

// Export functions for use in other scripts
window.WikiUtils = {
  formatDate,
  showNotification,
  healthCheck
};
