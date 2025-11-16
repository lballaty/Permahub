/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/src/wiki/js/wiki-signup.js
 * Description: User registration/signup functionality with validation
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-16
 */

import { supabase as supabaseClient } from '../../js/supabase-client.js';

// State management
let usernameCheckTimeout = null;
let isUsernameAvailable = false;
let isFormValid = false;

/**
 * Initialize signup page functionality
 */
async function initSignup() {
  console.log('🚀 Initializing signup page...');

  // Get form elements
  const signupForm = document.getElementById('signupForm');
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const acceptTermsCheckbox = document.getElementById('acceptTerms');

  // Setup event listeners
  setupUsernameValidation(usernameInput);
  setupPasswordStrengthIndicator(passwordInput);
  setupPasswordMatchValidation(passwordInput, confirmPasswordInput);
  setupPasswordToggle(togglePasswordBtn, passwordInput);
  setupFormSubmission(signupForm);

  console.log('✅ Signup page initialized');
}

/**
 * Setup username validation with real-time availability checking
 */
function setupUsernameValidation(usernameInput) {
  const usernameStatus = document.getElementById('usernameStatus');
  const usernameFeedback = document.getElementById('usernameFeedback');

  usernameInput.addEventListener('input', async (e) => {
    const username = e.target.value.trim().toLowerCase();

    // Clear previous timeout
    if (usernameCheckTimeout) {
      clearTimeout(usernameCheckTimeout);
    }

    // Reset feedback
    usernameFeedback.innerHTML = '';
    isUsernameAvailable = false;

    // Validate format first
    if (!username) {
      return;
    }

    if (username.length < 3) {
      usernameFeedback.innerHTML = '<span style="color: var(--wiki-warning);">⚠️ Username must be at least 3 characters</span>';
      return;
    }

    if (username.length > 20) {
      usernameFeedback.innerHTML = '<span style="color: var(--wiki-danger);">❌ Username must be 20 characters or less</span>';
      return;
    }

    if (!/^[a-z0-9_-]+$/.test(username)) {
      usernameFeedback.innerHTML = '<span style="color: var(--wiki-danger);">❌ Username can only contain lowercase letters, numbers, dash, and underscore</span>';
      return;
    }

    // Show loading indicator
    usernameStatus.style.display = 'block';

    // Debounce the availability check
    usernameCheckTimeout = setTimeout(async () => {
      try {
        console.log('🔍 Checking username availability:', username);
        const available = await supabaseClient.checkUsernameAvailability(username);

        usernameStatus.style.display = 'none';

        if (available) {
          isUsernameAvailable = true;
          usernameFeedback.innerHTML = '<span style="color: var(--wiki-success);">✅ Username is available!</span>';
          usernameInput.style.borderColor = 'var(--wiki-success)';
        } else {
          isUsernameAvailable = false;
          usernameFeedback.innerHTML = '<span style="color: var(--wiki-danger);">❌ Username is already taken</span>';
          usernameInput.style.borderColor = 'var(--wiki-danger)';
        }
      } catch (error) {
        console.error('Username check error:', error);
        usernameStatus.style.display = 'none';
        usernameFeedback.innerHTML = '<span style="color: var(--wiki-danger);">❌ Error checking username availability</span>';
      }
    }, 500); // Wait 500ms after user stops typing
  });

  // Normalize to lowercase on blur
  usernameInput.addEventListener('blur', (e) => {
    e.target.value = e.target.value.trim().toLowerCase();
  });
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
  let feedback = [];

  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Complexity checks
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score++;
    feedback.push('mixed case');
  }
  if (/[0-9]/.test(password)) {
    score++;
    feedback.push('numbers');
  }
  if (/[^a-zA-Z0-9]/.test(password)) {
    score++;
    feedback.push('symbols');
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
 * Setup form submission with validation
 */
function setupFormSubmission(signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const signupBtn = document.getElementById('signupBtn');
    const signupMessage = document.getElementById('signupMessage');

    // Get form values
    const username = document.getElementById('username').value.trim().toLowerCase();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const fullName = document.getElementById('fullName').value.trim();
    const acceptTerms = document.getElementById('acceptTerms').checked;
    const newsletter = document.getElementById('newsletter').checked;

    // Validate form
    const validation = validateSignupForm({
      username,
      email,
      password,
      confirmPassword,
      acceptTerms
    });

    if (!validation.valid) {
      showMessage(signupMessage, validation.message, 'error');
      return;
    }

    // Check username availability one more time
    if (!isUsernameAvailable) {
      showMessage(signupMessage, 'Please choose an available username', 'error');
      return;
    }

    // Disable button and show loading
    signupBtn.disabled = true;
    signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';

    try {
      console.log('📝 Attempting to sign up user:', email);

      // Create user account
      const response = await supabaseClient.signUp(email, password, {
        username,
        full_name: fullName || username,
        newsletter_opt_in: newsletter
      });

      console.log('✅ Signup response:', response);

      // Show success message
      showMessage(
        signupMessage,
        'Account created successfully! Please check your email to confirm your account.',
        'success'
      );

      // Clear form
      signupForm.reset();

      // Redirect to login after 3 seconds
      setTimeout(() => {
        window.location.href = 'wiki-login.html';
      }, 3000);

    } catch (error) {
      console.error('❌ Signup error:', error);

      let errorMessage = 'Failed to create account. Please try again.';

      if (error.message.includes('already registered')) {
        errorMessage = 'This email is already registered. Please try logging in instead.';
      } else if (error.message.includes('invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.message.includes('weak password')) {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      showMessage(signupMessage, errorMessage, 'error');

      // Re-enable button
      signupBtn.disabled = false;
      signupBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
    }
  });
}

/**
 * Validate signup form data
 */
function validateSignupForm({ username, email, password, confirmPassword, acceptTerms }) {
  // Username validation
  if (!username) {
    return { valid: false, message: 'Username is required' };
  }
  if (username.length < 3 || username.length > 20) {
    return { valid: false, message: 'Username must be 3-20 characters' };
  }
  if (!/^[a-z0-9_-]+$/.test(username)) {
    return { valid: false, message: 'Username can only contain lowercase letters, numbers, dash, and underscore' };
  }

  // Email validation
  if (!email) {
    return { valid: false, message: 'Email is required' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }

  // Password validation
  if (!password) {
    return { valid: false, message: 'Password is required' };
  }
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }

  // Password match validation
  if (password !== confirmPassword) {
    return { valid: false, message: 'Passwords do not match' };
  }

  // Terms acceptance
  if (!acceptTerms) {
    return { valid: false, message: 'You must accept the Terms of Service and Privacy Policy' };
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
      <i class="fas ${style.icon}" style="margin-top: 0.25rem;"></i>
      <div>${message}</div>
    </div>
  `;

  // Scroll to message
  messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSignup);
} else {
  initSignup();
}
