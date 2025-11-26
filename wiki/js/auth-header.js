/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/src/wiki/js/auth-header.js
 * Description: Dynamic authentication header for wiki pages
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-16
 */

import { supabase } from '../../js/supabase-client.js';

/**
 * Update header navigation based on authentication status
 *
 * Business Purpose: Show appropriate login/logout button and user info
 */
async function updateAuthHeader() {
  console.log('🔐 Updating auth header...');

  // Check if user is logged in
  const user = await supabase.getCurrentUser();
  const authToken = localStorage.getItem('auth_token');

  const loginLink = document.querySelector('a[href="wiki-login.html"]');
  if (!loginLink) {
    console.log('⚠️ Login link not found in header');
    return;
  }

  const loginListItem = loginLink.parentElement;

  // Get the "Create Page" button
  const createPageLink = document.querySelector('a[href="wiki-editor.html"]');
  const createPageListItem = createPageLink?.parentElement;

  // Get the "Add Event", "Add Location", and "Edit Page" buttons
  const addEventBtn = document.getElementById('addEventBtn');
  const addLocationBtn = document.getElementById('addLocationBtn');
  const editPageBtn = document.getElementById('editPageBtn');

  if (user || authToken) {
    console.log('✅ User is logged in');

    // Show the "Create Page" button if it exists
    if (createPageListItem) {
      createPageListItem.style.display = '';
    }

    // Enable the "Add Event" button if it exists
    if (addEventBtn) {
      addEventBtn.classList.remove('btn-disabled');
      addEventBtn.style.pointerEvents = '';
      addEventBtn.style.opacity = '';
      addEventBtn.removeAttribute('title');
    }

    // Enable the "Add Location" button if it exists
    if (addLocationBtn) {
      addLocationBtn.classList.remove('btn-disabled');
      addLocationBtn.style.pointerEvents = '';
      addLocationBtn.style.opacity = '';
      addLocationBtn.removeAttribute('title');
    }

    // Enable the "Edit Page" button if it exists
    if (editPageBtn) {
      editPageBtn.classList.remove('btn-disabled');
      editPageBtn.style.pointerEvents = '';
      editPageBtn.style.opacity = '';
      editPageBtn.removeAttribute('title');
    }

    // Get user email
    const userEmail = user?.email || JSON.parse(localStorage.getItem('user') || '{}').email || 'User';

    // Fetch user profile to get username
    let userName = userEmail.split('@')[0]; // Fallback to email prefix
    let fullName = null;

    try {
      const userId = user?.id || JSON.parse(localStorage.getItem('user') || '{}').id;
      if (userId) {
        const userProfileData = await supabase.getOne('users', userId);
        if (userProfileData && userProfileData.length > 0) {
          const userProfile = userProfileData[0];
          userName = userProfile.username || userName;
          fullName = userProfile.full_name;
          console.log('👤 User profile loaded:', { username: userName, fullName });
        }
      }
    } catch (error) {
      console.error('⚠️ Error fetching user profile:', error);
      // Continue with fallback username
    }

    // Use full name if available, otherwise username
    const displayName = fullName || userName;

    loginListItem.innerHTML = `
      <div class="user-menu" style="position: relative;">
        <button class="user-menu-btn" id="userMenuBtn" style="background: none; border: none; cursor: pointer; padding: 0.5rem 1rem; display: flex; align-items: center; gap: 0.5rem; color: var(--wiki-text); font-size: 1rem;">
          <i class="fas fa-user-circle" style="font-size: 1.2rem;"></i>
          <span>${escapeHtml(displayName)}</span>
          <i class="fas fa-chevron-down" style="font-size: 0.8rem;"></i>
        </button>
        <div class="user-dropdown" id="userDropdown" style="display: none; position: absolute; right: 0; top: 100%; background: white; border: 1px solid var(--wiki-border); border-radius: 6px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); min-width: 200px; z-index: 1000; margin-top: 0.5rem;">
          <div style="padding: 1rem; border-bottom: 1px solid var(--wiki-border);">
            <div style="font-weight: 500; margin-bottom: 0.25rem;">${escapeHtml(displayName)}</div>
            <div style="font-size: 0.85rem; color: var(--wiki-text-muted);">@${escapeHtml(userName)}</div>
          </div>
          <a href="wiki-editor.html" style="display: block; padding: 0.75rem 1rem; color: var(--wiki-text); text-decoration: none; border-bottom: 1px solid var(--wiki-border);">
            <i class="fas fa-edit"></i> Create Content
          </a>
          <a href="wiki-favorites.html" style="display: block; padding: 0.75rem 1rem; color: var(--wiki-text); text-decoration: none; border-bottom: 1px solid var(--wiki-border);">
            <i class="fas fa-heart"></i> My Favorites
          </a>
          <a href="wiki-settings.html" style="display: block; padding: 0.75rem 1rem; color: var(--wiki-text); text-decoration: none; border-bottom: 1px solid var(--wiki-border);">
            <i class="fas fa-cog"></i> Settings
          </a>
          <button id="logoutBtn" style="display: block; width: 100%; padding: 0.75rem 1rem; text-align: left; background: none; border: none; color: #c33; cursor: pointer; font-size: 1rem;">
            <i class="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>
    `;

    // Set up user menu toggle
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');

    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      if (userDropdown) {
        userDropdown.style.display = 'none';
      }
    });

    // Set up logout button
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', async () => {
      await handleLogout();
    });

  } else {
    console.log('ℹ️ User is not logged in');

    // Hide the "Create Page" button if it exists
    if (createPageListItem) {
      createPageListItem.style.display = 'none';
    }

    // Disable the "Add Event" button if it exists
    if (addEventBtn) {
      addEventBtn.classList.add('btn-disabled');
      addEventBtn.style.pointerEvents = 'none';
      addEventBtn.style.opacity = '0.5';
      addEventBtn.setAttribute('title', 'Please log in to add events');
      addEventBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Please log in to add events');
      });
    }

    // Disable the "Add Location" button if it exists
    if (addLocationBtn) {
      addLocationBtn.classList.add('btn-disabled');
      addLocationBtn.style.pointerEvents = 'none';
      addLocationBtn.style.opacity = '0.5';
      addLocationBtn.setAttribute('title', 'Please log in to add locations');
      addLocationBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Please log in to add locations');
      });
    }

    // Disable the "Edit Page" button if it exists
    if (editPageBtn) {
      editPageBtn.classList.add('btn-disabled');
      editPageBtn.style.pointerEvents = 'none';
      editPageBtn.style.opacity = '0.5';
      editPageBtn.setAttribute('title', 'Please log in to edit pages');
      editPageBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Please log in to edit this page');
      });
    }

    // Keep the login link as is
  }
}

/**
 * Handle user logout
 *
 * Business Purpose: Clear authentication and redirect to home
 */
async function handleLogout() {
  console.log('🔐 Logging out user...');

  try {
    // Clear authentication localStorage items
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expiry');
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');

    // Note: We intentionally DO NOT clear 'remembered_email'
    // This allows users to quickly log back in with their saved email
    // They can manually uncheck "Remember Me" on next login if desired

    // Call Supabase signOut
    await supabase.signOut();

    console.log('✅ User logged out successfully');

    // Show success message
    showLogoutMessage();

    // Redirect to home after a short delay
    setTimeout(() => {
      window.location.href = 'wiki-home.html';
    }, 1500);

  } catch (error) {
    console.error('❌ Error during logout:', error);
    // Still redirect even if there's an error
    window.location.href = 'wiki-home.html';
  }
}

/**
 * Show logout success message
 */
function showLogoutMessage() {
  const messageHTML = `
    <div id="logoutMessage" style="position: fixed; top: 20px; right: 20px; background: #2d8659; color: white; padding: 1rem 1.5rem; border-radius: 6px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 10000; display: flex; align-items: center; gap: 0.5rem; animation: slideIn 0.3s ease-out;">
      <i class="fas fa-check-circle"></i>
      <span>Successfully logged out!</span>
    </div>
    <style>
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    </style>
  `;

  document.body.insertAdjacentHTML('beforeend', messageHTML);

  // Remove the message after it's shown
  setTimeout(() => {
    const message = document.getElementById('logoutMessage');
    if (message) {
      message.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => message.remove(), 300);
    }
  }, 1500);
}

/**
 * Escape HTML to prevent XSS
 *
 * @param {string} unsafe - Unsafe string
 * @returns {string} Safe escaped string
 */
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Auto-run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateAuthHeader);
} else {
  updateAuthHeader();
}

export { updateAuthHeader, handleLogout };
