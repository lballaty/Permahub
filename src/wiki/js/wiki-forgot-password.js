/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/src/wiki/js/wiki-forgot-password.js
 * Description: Password reset request functionality
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-16
 */

import { supabase as supabaseClient } from '../../js/supabase-client.js';

/**
 * Initialize forgot password page functionality
 */
async function initForgotPassword() {
  console.log('🚀 Initializing forgot password page...');

  // Get form elements
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');

  // Setup form submission
  setupFormSubmission(forgotPasswordForm);

  console.log('✅ Forgot password page initialized');
}

/**
 * Setup form submission
 */
function setupFormSubmission(forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const resetBtn = document.getElementById('resetBtn');
    const resetMessage = document.getElementById('resetMessage');
    const emailInput = document.getElementById('email');

    // Get email value
    const email = emailInput.value.trim();

    // Validate email
    if (!email) {
      showMessage(resetMessage, 'Please enter your email address', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMessage(resetMessage, 'Please enter a valid email address', 'error');
      return;
    }

    // Disable button and show loading
    resetBtn.disabled = true;
    resetBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
      console.log('🔑 Sending password reset email to:', email);

      // Request password reset
      await supabaseClient.resetPasswordForEmail(email);

      console.log('✅ Password reset email sent');

      // Show success message (always show success for security)
      showMessage(
        resetMessage,
        `
          <strong>Check your email!</strong><br>
          If an account exists for ${email}, you'll receive password reset instructions shortly.<br>
          <br>
          <small>The link will expire in 1 hour for security reasons.</small>
        `,
        'success'
      );

      // Clear form
      forgotPasswordForm.reset();

      // Update button text
      resetBtn.innerHTML = '<i class="fas fa-check"></i> Email Sent!';

      // Re-enable button after 5 seconds
      setTimeout(() => {
        resetBtn.disabled = false;
        resetBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Reset Link';
      }, 5000);

    } catch (error) {
      console.error('❌ Password reset error:', error);

      // For security, we still show success message
      // This prevents email enumeration attacks
      showMessage(
        resetMessage,
        `
          <strong>Check your email!</strong><br>
          If an account exists for ${email}, you'll receive password reset instructions shortly.<br>
          <br>
          <small>The link will expire in 1 hour for security reasons.</small>
        `,
        'success'
      );

      // Clear form
      forgotPasswordForm.reset();

      // Update button text
      resetBtn.innerHTML = '<i class="fas fa-check"></i> Email Sent!';

      // Re-enable button after 5 seconds
      setTimeout(() => {
        resetBtn.disabled = false;
        resetBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Reset Link';
      }, 5000);
    }
  });
}

/**
 * Show message to user
 */
function showMessage(messageElement, message, type) {
  const styles = {
    success: {
      background: 'var(--wiki-accent)',
      color: 'var(--wiki-primary)',
      icon: 'fa-check-circle'
    },
    error: {
      background: '#fee',
      color: 'var(--wiki-danger)',
      icon: 'fa-exclamation-circle'
    },
    info: {
      background: '#e3f2fd',
      color: '#1976d2',
      icon: 'fa-info-circle'
    }
  };

  const style = styles[type] || styles.info;

  messageElement.style.display = 'block';
  messageElement.style.background = style.background;
  messageElement.style.color = style.color;
  messageElement.innerHTML = `
    <div style="display: flex; gap: 0.5rem; align-items: start;">
      <i class="fas ${style.icon}" style="margin-top: 0.25rem; font-size: 1.2rem;"></i>
      <div>${message}</div>
    </div>
  `;

  // Scroll to message
  messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initForgotPassword);
} else {
  initForgotPassword();
}
