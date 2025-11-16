/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/src/wiki/js/auth-callback.js
 * Description: Handle authentication callbacks from magic links and OAuth
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-16
 */

/**
 * Handle authentication callback from URL hash
 *
 * Business Purpose: Process magic link tokens and complete authentication
 *
 * @returns {Promise<boolean>} True if callback was handled
 */
async function handleAuthCallback() {
  // Check if there's a hash in the URL (from magic link or OAuth)
  const hash = window.location.hash;

  if (!hash || hash.length <= 1) {
    return false;
  }

  console.log('🔐 Auth callback detected in URL hash');

  // Parse the hash parameters
  const params = new URLSearchParams(hash.substring(1)); // Remove the '#'

  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  const tokenType = params.get('token_type');
  const expiresIn = params.get('expires_in');
  const type = params.get('type');

  if (!accessToken) {
    console.log('No access token found in hash');
    return false;
  }

  console.log('✅ Auth tokens found:', {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    tokenType,
    expiresIn,
    type
  });

  // Store the tokens in localStorage
  localStorage.setItem('auth_token', accessToken);

  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }

  // Calculate expiry time
  if (expiresIn) {
    const expiryTime = Date.now() + (parseInt(expiresIn) * 1000);
    localStorage.setItem('token_expiry', expiryTime.toString());
  }

  console.log('✅ Auth tokens stored in localStorage');

  // Fetch user data using the access token
  try {
    const response = await fetch('http://127.0.0.1:3000/auth/v1/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH' // Should use config
      }
    });

    if (response.ok) {
      const user = await response.json();
      localStorage.setItem('user', JSON.stringify(user));
      console.log('✅ User data fetched and stored:', user.email);
    }
  } catch (error) {
    console.error('❌ Error fetching user data:', error);
  }

  // Clean up the URL by removing the hash
  window.history.replaceState(null, '', window.location.pathname + window.location.search);

  console.log('✅ Authentication callback handled successfully');

  // Show a success message
  showAuthSuccessMessage(type);

  return true;
}

/**
 * Show authentication success message
 *
 * @param {string} type - Type of authentication (signup, magiclink, etc.)
 */
function showAuthSuccessMessage(type) {
  const messageText = type === 'signup'
    ? 'Welcome! Your account has been created.'
    : 'Successfully logged in!';

  const messageHTML = `
    <div id="authSuccessMessage" style="position: fixed; top: 20px; right: 20px; background: #2d8659; color: white; padding: 1rem 1.5rem; border-radius: 6px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 10000; display: flex; align-items: center; gap: 0.5rem; animation: slideIn 0.3s ease-out;">
      <i class="fas fa-check-circle"></i>
      <span>${messageText}</span>
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

  // Remove the message after 3 seconds
  setTimeout(() => {
    const message = document.getElementById('authSuccessMessage');
    if (message) {
      message.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => message.remove(), 300);
    }
  }, 3000);
}

// Auto-run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleAuthCallback);
} else {
  handleAuthCallback();
}

export { handleAuthCallback };
