/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/src/wiki/js/wiki-reset-password.js
 * Description: Password reset functionality for users who clicked reset link
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-16
 */

import { supabase as supabaseClient } from '../../js/supabase-client.js';

/**
 * Initialize reset password page functionality
 */
async function initResetPassword() {
  console.log('🚀 Initializing reset password page...');

  // Check for recovery token in URL hash
  const hash = window.location.hash;
  console.log('🔍 URL hash:', hash);

  if (!hash || !hash.includes('access_token')) {
    console.error('❌ No access token found in URL');
    showInvalidTokenState();
    return;
  }

  // Extract access token from hash
  const params = new URLSearchParams(hash.substring(1)); // Remove # and parse
  const accessToken = params.get('access_token');
  const type = params.get('type');

  console.log('🔑 Token type:', type);

  if (!accessToken || type !== 'recovery') {
    console.error('❌ Invalid or missing recovery token');
    showInvalidTokenState();
    return;
  }

  // Store the token temporarily
  localStorage.setItem('auth_token', accessToken);

  // Show the reset form
  showResetForm();

  // Get form elements
  const resetPasswordForm = document.getElementById('resetPasswordForm');
  const newPasswordInput = document.getElementById('newPassword');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const toggleNewPasswordBtn = document.getElementById('toggleNewPassword');

  // Setup event listeners
  setupPasswordStrengthIndicator(newPasswordInput);
  setupPasswordMatchValidation(newPasswordInput, confirmPasswordInput);
  setupPasswordToggle(toggleNewPasswordBtn, newPasswordInput);
  setupFormSubmission(resetPasswordForm);

  console.log('✅ Reset password page initialized');
}

/**
 * Show invalid token state
 */
function showInvalidTokenState() {
  document.getElementById('loadingState').style.display = 'none';
  document.getElementById('invalidTokenState').style.display = 'block';
  document.getElementById('resetPasswordForm').style.display = 'none';
}

/**
 * Show reset form
 */
function showResetForm() {
  document.getElementById('loadingState').style.display = 'none';
  document.getElementById('invalidTokenState').style.display = 'none';
  document.getElementById('resetPasswordForm').style.display = 'block';
}

/**
 * Setup password strength indicator
 */
function setupPasswordStrengthIndicator(passwordInput) {
  const strengthBars = [
    document.getElementById('strength1'),
    document.getElementById('strength2'),
    document.getElementById('strength3'),
    document.getElementById('strength4')
  ];
  const strengthText = document.getElementById('strengthText');

  passwordInput.addEventListener('input', (e) => {
    const password = e.target.value;
    const strength = calculatePasswordStrength(password);

    // Reset all bars
    strengthBars.forEach(bar => {
      bar.style.backgroundColor = 'transparent';
    });

    // Color bars based on strength
    const colors = {
      0: 'var(--wiki-danger)',
      1: 'var(--wiki-danger)',
      2: 'var(--wiki-warning)',
      3: '#2d8659', // Green
      4: '#1a5f3f'  // Dark green
    };

    for (let i = 0; i < strength.score; i++) {
      strengthBars[i].style.backgroundColor = colors[strength.score];
    }

    // Update text feedback
    if (!password) {
      strengthText.innerHTML = '';
    } else {
      strengthText.innerHTML = `<span style="color: ${colors[strength.score]};">${strength.message}</span>`;
    }
  });
}

/**
 * Calculate password strength score
 */
function calculatePasswordStrength(password) {
  if (!password) {
    return { score: 0, message: '' };
  }

  let score = 0;

  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Complexity checks
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score++;
  }
  if (/[0-9]/.test(password)) {
    score++;
  }
  if (/[^a-zA-Z0-9]/.test(password)) {
    score++;
  }

  // Cap at 4
  score = Math.min(score, 4);

  const messages = {
    0: 'Too weak',
    1: 'Weak password',
    2: 'Fair password',
    3: 'Strong password',
    4: 'Very strong password'
  };

  return {
    score,
    message: messages[score]
  };
}

/**
 * Setup password match validation
 */
function setupPasswordMatchValidation(passwordInput, confirmPasswordInput) {
  const passwordMatchFeedback = document.getElementById('passwordMatchFeedback');

  function checkPasswordMatch() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!confirmPassword) {
      passwordMatchFeedback.innerHTML = '';
      confirmPasswordInput.style.borderColor = '';
      return;
    }

    if (password === confirmPassword) {
      passwordMatchFeedback.innerHTML = '<span style="color: var(--wiki-success);">✅ Passwords match</span>';
      confirmPasswordInput.style.borderColor = 'var(--wiki-success)';
    } else {
      passwordMatchFeedback.innerHTML = '<span style="color: var(--wiki-danger);">❌ Passwords do not match</span>';
      confirmPasswordInput.style.borderColor = 'var(--wiki-danger)';
    }
  }

  passwordInput.addEventListener('input', checkPasswordMatch);
  confirmPasswordInput.addEventListener('input', checkPasswordMatch);
}

/**
 * Setup password visibility toggle
 */
function setupPasswordToggle(toggleBtn, passwordInput) {
  toggleBtn.addEventListener('click', () => {
    const icon = toggleBtn.querySelector('i');

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    } else {
      passwordInput.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  });
}

/**
 * Setup form submission
 */
function setupFormSubmission(resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const resetBtn = document.getElementById('resetBtn');
    const resetMessage = document.getElementById('resetMessage');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // Get form values
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validate passwords
    const validation = validatePasswords(newPassword, confirmPassword);

    if (!validation.valid) {
      showMessage(resetMessage, validation.message, 'error');
      return;
    }

    // Disable button and show loading
    resetBtn.disabled = true;
    resetBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resetting Password...';

    try {
      console.log('🔒 Attempting to reset password...');

      // Update password
      await supabaseClient.updatePassword(newPassword);

      console.log('✅ Password reset successful');

      // Show success message
      showMessage(
        resetMessage,
        `
          <strong>Password reset successful!</strong><br>
          Your password has been updated. You can now log in with your new password.
        `,
        'success'
      );

      // Clear form
      resetPasswordForm.reset();

      // Update button
      resetBtn.innerHTML = '<i class="fas fa-check"></i> Password Reset!';

      // Redirect to login after 3 seconds
      setTimeout(() => {
        window.location.href = 'wiki-login.html';
      }, 3000);

    } catch (error) {
      console.error('❌ Password reset error:', error);

      let errorMessage = 'Failed to reset password. Please try again.';

      if (error.message.includes('weak password')) {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (error.message.includes('expired')) {
        errorMessage = 'Reset link has expired. Please request a new password reset.';
      } else if (error.message.includes('invalid')) {
        errorMessage = 'Invalid reset link. Please request a new password reset.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      showMessage(resetMessage, errorMessage, 'error');

      // Re-enable button
      resetBtn.disabled = false;
      resetBtn.innerHTML = '<i class="fas fa-lock"></i> Reset Password';
    }
  });
}

/**
 * Validate passwords
 */
function validatePasswords(newPassword, confirmPassword) {
  // Password validation
  if (!newPassword) {
    return { valid: false, message: 'Password is required' };
  }
  if (newPassword.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }

  // Password match validation
  if (newPassword !== confirmPassword) {
    return { valid: false, message: 'Passwords do not match' };
  }

  return { valid: true };
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
  document.addEventListener('DOMContentLoaded', initResetPassword);
} else {
  initResetPassword();
}
