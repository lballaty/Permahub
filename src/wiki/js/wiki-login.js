/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/src/wiki/js/wiki-login.js
 * Description: Supabase authentication handling for wiki login page
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-16
 */

import { supabase } from '../../js/supabase-client.js';

/**
 * Initialize login page authentication
 *
 * Business Purpose: Enables users to authenticate and access protected wiki features
 */
async function initLoginPage() {
  console.log('🔐 Initializing wiki login page...');

  // Check if user is already logged in
  const session = await checkExistingSession();
  if (session) {
    console.log('✅ User already logged in, redirecting to home...');
    window.location.href = 'wiki-home.html';
    return;
  }

  // Prepopulate email from localStorage if remembered
  prepopulateRememberedEmail();

  // Set up form handlers
  setupEmailLoginForm();
  setupMagicLinkForm();
  setupTabSwitching();

  console.log('✅ Login page initialized');
}

/**
 * Check if user has existing session
 *
 * Business Purpose: Auto-redirect already authenticated users
 *
 * @returns {Promise<Object|null>} Current user or null
 */
async function checkExistingSession() {
  try {
    const user = await supabase.getCurrentUser();
    return user;
  } catch (error) {
    console.error('❌ Exception checking session:', error);
    return null;
  }
}

/**
 * Prepopulate email field with remembered email if exists
 *
 * Business Purpose: Improve UX by remembering user's email for faster login
 */
function prepopulateRememberedEmail() {
  const rememberedEmail = localStorage.getItem('remembered_email');

  if (rememberedEmail) {
    console.log('📧 Found remembered email, prepopulating fields');

    // Prepopulate email login form
    const emailInput = document.getElementById('email');
    if (emailInput) {
      emailInput.value = rememberedEmail;
    }

    // Prepopulate magic link form
    const magicEmailInput = document.getElementById('magicEmail');
    if (magicEmailInput) {
      magicEmailInput.value = rememberedEmail;
    }

    // Check the remember me checkbox
    const rememberCheckbox = document.querySelector('input[name="remember"]');
    if (rememberCheckbox) {
      rememberCheckbox.checked = true;
    }
  }
}

/**
 * Set up email/password login form
 *
 * Business Purpose: Handle traditional email/password authentication
 */
function setupEmailLoginForm() {
  const form = document.getElementById('emailLoginForm');
  if (!form) {
    console.error('❌ Email login form not found');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberCheckbox = document.querySelector('input[name="remember"]');
    const rememberMe = rememberCheckbox ? rememberCheckbox.checked : false;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Validate inputs
    if (!email || !password) {
      showError('Please enter both email and password');
      return;
    }

    try {
      // Disable button and show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';

      console.log(`🔐 Attempting email/password login for: ${email}`);

      // Sign in with Supabase
      const data = await supabase.signIn(email, password);

      console.log('✅ Login successful:', data);

      // Handle "Remember Me" functionality
      if (rememberMe) {
        console.log('💾 Saving email to localStorage (Remember Me checked)');
        localStorage.setItem('remembered_email', email);
      } else {
        console.log('🗑️ Removing saved email (Remember Me unchecked)');
        localStorage.removeItem('remembered_email');
      }

      // Show success message
      showSuccess('Login successful! Redirecting...');

      // Redirect to home page
      setTimeout(() => {
        window.location.href = 'wiki-home.html';
      }, 1000);

    } catch (error) {
      console.error('❌ Exception during login:', error);

      // User-friendly error messages
      let errorMessage = 'Login failed. Please check your credentials.';
      if (error.message && error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error.message && error.message.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email address before logging in.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      showError(errorMessage);
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

/**
 * Set up magic link form
 *
 * Business Purpose: Handle passwordless authentication via email magic link
 */
function setupMagicLinkForm() {
  const form = document.getElementById('magicLinkForm');
  if (!form) {
    console.error('❌ Magic link form not found');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('magicEmail').value.trim();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Validate input
    if (!email) {
      showError('Please enter your email address');
      return;
    }

    try {
      // Disable button and show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      console.log(`📧 Sending magic link to: ${email}`);

      // Send magic link with Supabase
      const data = await supabase.signInWithMagicLink(email);

      console.log('✅ Magic link sent:', data);

      // Show success message with instructions
      showMagicLinkSentModal(email);

      // Reset form
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

    } catch (error) {
      console.error('❌ Exception sending magic link:', error);
      showError('An unexpected error occurred. Please try again.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

/**
 * Set up tab switching between login methods
 *
 * Business Purpose: Allow users to switch between email/password and magic link
 */
function setupTabSwitching() {
  console.log('🔄 Setting up tab switching...');

  const emailTabBtn = document.getElementById('emailTabBtn');
  const magicLinkTabBtn = document.getElementById('magicLinkTabBtn');
  const emailLoginForm = document.getElementById('emailLoginForm');
  const magicLinkForm = document.getElementById('magicLinkForm');

  console.log('Tab elements found:', {
    emailTabBtn: !!emailTabBtn,
    magicLinkTabBtn: !!magicLinkTabBtn,
    emailLoginForm: !!emailLoginForm,
    magicLinkForm: !!magicLinkForm
  });

  if (!emailTabBtn || !magicLinkTabBtn || !emailLoginForm || !magicLinkForm) {
    console.error('❌ Tab switching elements not found');
    return;
  }

  emailTabBtn.addEventListener('click', function() {
    console.log('📧 Email tab clicked');
    emailTabBtn.style.borderBottomColor = 'var(--wiki-primary)';
    emailTabBtn.style.color = 'var(--wiki-primary)';
    magicLinkTabBtn.style.borderBottomColor = 'transparent';
    magicLinkTabBtn.style.color = 'var(--wiki-text-muted)';
    emailLoginForm.style.display = 'block';
    magicLinkForm.style.display = 'none';
  });

  magicLinkTabBtn.addEventListener('click', function() {
    console.log('✨ Magic link tab clicked');
    magicLinkTabBtn.style.borderBottomColor = 'var(--wiki-primary)';
    magicLinkTabBtn.style.color = 'var(--wiki-primary)';
    emailTabBtn.style.borderBottomColor = 'transparent';
    emailTabBtn.style.color = 'var(--wiki-text-muted)';
    magicLinkForm.style.display = 'block';
    emailLoginForm.style.display = 'none';
  });

  console.log('✅ Tab switching event listeners added');
}

/**
 * Show error message to user
 *
 * @param {string} message - Error message to display
 */
function showError(message) {
  // Remove any existing alerts
  const existingAlert = document.querySelector('.alert');
  if (existingAlert) {
    existingAlert.remove();
  }

  const alertHTML = `
    <div class="alert" style="background-color: #fee; border: 1px solid #fcc; color: #c33; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
      <i class="fas fa-exclamation-circle"></i>
      <span>${escapeHtml(message)}</span>
    </div>
  `;

  const form = document.querySelector('form:not([style*="display: none"])');
  if (form) {
    form.insertAdjacentHTML('afterbegin', alertHTML);
  }
}

/**
 * Show success message to user
 *
 * @param {string} message - Success message to display
 */
function showSuccess(message) {
  // Remove any existing alerts
  const existingAlert = document.querySelector('.alert');
  if (existingAlert) {
    existingAlert.remove();
  }

  const alertHTML = `
    <div class="alert" style="background-color: #efe; border: 1px solid #cfc; color: #3c3; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
      <i class="fas fa-check-circle"></i>
      <span>${escapeHtml(message)}</span>
    </div>
  `;

  const form = document.querySelector('form:not([style*="display: none"])');
  if (form) {
    form.insertAdjacentHTML('afterbegin', alertHTML);
  }
}

/**
 * Show modal confirming magic link was sent
 *
 * Business Purpose: Inform user to check their email for the magic link
 *
 * @param {string} email - Email address where magic link was sent
 */
function showMagicLinkSentModal(email) {
  const modalHTML = `
    <div id="magicLinkModal" style="display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10000; align-items: center; justify-content: center;">
      <div style="background: white; padding: 2rem; max-width: 500px; border-radius: 8px; text-align: center; margin: 1rem;">
        <div style="font-size: 4rem; color: var(--wiki-primary); margin-bottom: 1rem;">
          <i class="fas fa-envelope-open-text"></i>
        </div>
        <h2 style="margin-bottom: 1rem; color: var(--wiki-primary);">Check Your Email</h2>
        <p style="margin-bottom: 1rem; font-size: 1.1rem;">
          We've sent a magic link to:
        </p>
        <p style="margin-bottom: 2rem; font-weight: bold; color: var(--wiki-primary);">
          ${escapeHtml(email)}
        </p>
        <div style="background-color: var(--wiki-accent); padding: 1rem; border-radius: 6px; margin-bottom: 2rem; text-align: left;">
          <div style="display: flex; gap: 0.5rem; align-items: start;">
            <i class="fas fa-info-circle" style="color: var(--wiki-primary); margin-top: 0.25rem;"></i>
            <div style="font-size: 0.9rem;">
              <p style="margin-bottom: 0.5rem;"><strong>Next steps:</strong></p>
              <ol style="margin: 0; padding-left: 1.5rem;">
                <li>Check your inbox (and spam folder)</li>
                <li>Click the magic link in the email</li>
                <li>You'll be automatically logged in</li>
              </ol>
              <p style="margin-top: 0.5rem; color: var(--wiki-text-muted); font-size: 0.85rem;">
                The link will expire in 8 hours for security.
              </p>
            </div>
          </div>
        </div>
        <button onclick="closeMagicLinkModal()" class="btn btn-primary" style="width: 100%;">
          Got it
        </button>
        <p style="margin-top: 1rem; font-size: 0.9rem; color: var(--wiki-text-muted);">
          Testing locally? Check <a href="http://127.0.0.1:54324" target="_blank" style="color: var(--wiki-primary);">Mailpit</a>
        </p>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * Close magic link sent modal
 */
window.closeMagicLinkModal = function() {
  const modal = document.getElementById('magicLinkModal');
  if (modal) {
    modal.remove();
  }
};

/**
 * Escape HTML to prevent XSS
 *
 * @param {string} unsafe - Unsafe string that might contain HTML
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

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLoginPage);
} else {
  initLoginPage();
}

export { initLoginPage };
