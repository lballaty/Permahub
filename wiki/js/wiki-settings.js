/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/src/wiki/js/wiki-settings.js
 * Description: User settings and privacy controls management
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-16
 */

import { supabase as supabaseClient } from '../../js/supabase-client.js';

/**
 * Initialize settings page
 */
async function initSettings() {
  console.log('⚙️ Initializing settings page...');

  // Check authentication
  const user = await supabaseClient.getCurrentUser();
  if (!user) {
    console.log('❌ User not authenticated, redirecting to login');
    window.location.href = 'wiki-login.html';
    return;
  }

  console.log('✅ User authenticated:', user.email);

  // Setup UI interactions
  setupMasterToggle();
  setupSaveButton();

  // Load user settings (profile + home location)
  await loadUserSettings(user.id);

  console.log('✅ Settings page initialized');
}

/**
 * Setup master public profile toggle
 */
function setupMasterToggle() {
  const isPublicProfileCheckbox = document.getElementById('isPublicProfile');
  const contactVisibilitySettings = document.getElementById('contactVisibilitySettings');

  isPublicProfileCheckbox.addEventListener('change', (e) => {
    const isPublic = e.target.checked;

    if (isPublic) {
      // Enable granular controls
      contactVisibilitySettings.style.opacity = '1';
      contactVisibilitySettings.style.pointerEvents = 'auto';
    } else {
      // Disable granular controls
      contactVisibilitySettings.style.opacity = '0.5';
      contactVisibilitySettings.style.pointerEvents = 'none';
    }
  });
}

/**
 * Setup save button
 */
function setupSaveButton() {
  const saveBtn = document.getElementById('saveSettingsBtn');
  saveBtn.addEventListener('click', saveSettings);
}

/**
 * Load user settings from database
 */
async function loadUserSettings(userId) {
  try {
    console.log('📥 Loading user settings for:', userId);

    // Show loading state
    const saveBtn = document.getElementById('saveSettingsBtn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';

    // Fetch user profile data
    const response = await supabaseClient.request('GET', `/users?id=eq.${userId}&select=*`);

    if (!response || response.length === 0) {
      throw new Error('User profile not found');
    }

    const userData = response[0];
    console.log('✅ User data loaded:', userData);

    // Fetch user home location settings (if any)
    let userSettings = null;
    try {
      const settingsResponse = await supabaseClient.request(
        'GET',
        `/user_settings?user_id=eq.${userId}&select=*`
      );
      if (settingsResponse && settingsResponse.length > 0) {
        userSettings = settingsResponse[0];
      }
      console.log('✅ User settings loaded:', userSettings);
    } catch (settingsError) {
      console.warn('⚠️ Unable to load user_settings (home location). This is expected if not yet configured.', settingsError);
    }

    // Populate form fields
    populateFormFields(userData, userSettings);

    // Reset button state
    saveBtn.disabled = false;
    saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Settings';

  } catch (error) {
    console.error('❌ Error loading user settings:', error);
    showError('Failed to load settings. Please refresh the page.');

    // Reset button state
    const saveBtn = document.getElementById('saveSettingsBtn');
    saveBtn.disabled = false;
    saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Settings';
  }
}

/**
 * Populate form fields with user data
 */
function populateFormFields(userData, userSettings = null) {
  // Basic profile information
  document.getElementById('fullName').value = userData.full_name || '';
  document.getElementById('username').value = userData.username || '';
  document.getElementById('email').value = userData.email || '';
  document.getElementById('contactPhone').value = userData.contact_phone || '';
  document.getElementById('website').value = userData.website || '';

  // Master privacy toggle
  const isPublic = userData.is_public_profile || false;
  document.getElementById('isPublicProfile').checked = isPublic;

  // Parse contact preferences (JSONB field)
  const preferences = userData.contact_preferences || {};

  // Email visibility
  document.getElementById('emailVisible').checked = preferences.email_visible || false;

  // Phone visibility
  document.getElementById('phoneVisible').checked = preferences.phone_visible || false;

  // Website visibility
  document.getElementById('websiteVisible').checked = preferences.website_visible !== false; // Default true

  // Social media visibility
  document.getElementById('socialMediaVisible').checked = preferences.social_media_visible !== false; // Default true

  // Location precision
  const locationPrecision = preferences.location_precision || 'city';
  const locationRadio = document.querySelector(`input[name="locationPrecision"][value="${locationPrecision}"]`);
  if (locationRadio) {
    locationRadio.checked = true;
  }

  // Show contact button
  document.getElementById('showContactButton').checked = preferences.show_contact_button !== false; // Default true

  // Home location (My Location)
  const homeLabelInput = document.getElementById('homeLocationLabel');
  const homeLatInput = document.getElementById('homeLocationLat');
  const homeLngInput = document.getElementById('homeLocationLng');

  if (homeLabelInput && homeLatInput && homeLngInput) {
    homeLabelInput.value = (userSettings && userSettings.home_label) ? userSettings.home_label : '';
    homeLatInput.value = (userSettings && userSettings.home_lat != null) ? String(userSettings.home_lat) : '';
    homeLngInput.value = (userSettings && userSettings.home_lng != null) ? String(userSettings.home_lng) : '';

    // Mirror into localStorage for quick access on other pages (optional cache)
    if (userSettings && (userSettings.home_label || userSettings.home_lat != null || userSettings.home_lng != null)) {
      const cachedLocation = {
        label: userSettings.home_label || '',
        lat: userSettings.home_lat ?? null,
        lng: userSettings.home_lng ?? null
      };
      localStorage.setItem('myLocation', JSON.stringify(cachedLocation));
    }
  }

  // Trigger master toggle to set initial UI state
  const contactVisibilitySettings = document.getElementById('contactVisibilitySettings');
  if (isPublic) {
    contactVisibilitySettings.style.opacity = '1';
    contactVisibilitySettings.style.pointerEvents = 'auto';
  } else {
    contactVisibilitySettings.style.opacity = '0.5';
    contactVisibilitySettings.style.pointerEvents = 'none';
  }
}

/**
 * Save settings to database
 */
async function saveSettings() {
  try {
    console.log('💾 Saving user settings...');

    // Get current user
    const user = await supabaseClient.getCurrentUser();
    if (!user) {
      showError('You must be logged in to save settings');
      return;
    }

    // Show loading state
    const saveBtn = document.getElementById('saveSettingsBtn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    // Collect form data
    const { profileUpdate, homeLocation } = collectFormData();

    console.log('📤 Sending profile update:', profileUpdate);

    // Update user profile
    const response = await supabaseClient.request('PATCH', `/users?id=eq.${user.id}`, profileUpdate);

    console.log('✅ Profile settings saved successfully:', response);

    // Save home location in user_settings table
    await saveUserHomeLocation(user.id, homeLocation);

    // Show success message
    showSuccess('Settings saved successfully!');

    // Reset button state
    saveBtn.disabled = false;
    saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Settings';

  } catch (error) {
    console.error('❌ Error saving settings:', error);
    showError('Failed to save settings. Please try again.');

    // Reset button state
    const saveBtn = document.getElementById('saveSettingsBtn');
    saveBtn.disabled = false;
    saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Settings';
  }
}

/**
 * Collect form data for saving
 */
function collectFormData() {
  // Basic profile info
  const fullName = document.getElementById('fullName').value.trim();
  const contactPhone = document.getElementById('contactPhone').value.trim();
  const website = document.getElementById('website').value.trim();

  // Master privacy toggle
  const isPublicProfile = document.getElementById('isPublicProfile').checked;

  // Contact preferences
  const emailVisible = document.getElementById('emailVisible').checked;
  const phoneVisible = document.getElementById('phoneVisible').checked;
  const websiteVisible = document.getElementById('websiteVisible').checked;
  const socialMediaVisible = document.getElementById('socialMediaVisible').checked;
  const showContactButton = document.getElementById('showContactButton').checked;

  // Location precision
  const locationPrecisionRadio = document.querySelector('input[name="locationPrecision"]:checked');
  const locationPrecision = locationPrecisionRadio ? locationPrecisionRadio.value : 'city';

  // Build contact_preferences JSONB object
  const contactPreferences = {
    email_visible: emailVisible,
    phone_visible: phoneVisible,
    website_visible: websiteVisible,
    social_media_visible: socialMediaVisible,
    location_precision: locationPrecision,
    show_contact_button: showContactButton
  };

  // Home location (My Location) settings
  const homeLabelInput = document.getElementById('homeLocationLabel');
  const homeLatInput = document.getElementById('homeLocationLat');
  const homeLngInput = document.getElementById('homeLocationLng');

  const homeLabel = homeLabelInput ? homeLabelInput.value.trim() : '';
  const homeLatRaw = homeLatInput ? homeLatInput.value.trim() : '';
  const homeLngRaw = homeLngInput ? homeLngInput.value.trim() : '';

  const parsedLat = homeLatRaw ? parseFloat(homeLatRaw) : null;
  const parsedLng = homeLngRaw ? parseFloat(homeLngRaw) : null;

  const homeLat = Number.isFinite(parsedLat) ? parsedLat : null;
  const homeLng = Number.isFinite(parsedLng) ? parsedLng : null;

  const profileUpdate = {
    full_name: fullName,
    contact_phone: contactPhone,
    website: website,
    is_public_profile: isPublicProfile,
    contact_preferences: contactPreferences,
    updated_at: new Date().toISOString()
  };

  const homeLocation = {
    home_label: homeLabel || null,
    home_lat: homeLat,
    home_lng: homeLng
  };

  // Cache My Location in localStorage for quick access from other pages
  if (homeLocation.home_label || homeLocation.home_lat != null || homeLocation.home_lng != null) {
    const cachedLocation = {
      label: homeLocation.home_label || '',
      lat: homeLocation.home_lat,
      lng: homeLocation.home_lng
    };
    localStorage.setItem('myLocation', JSON.stringify(cachedLocation));
  } else {
    localStorage.removeItem('myLocation');
  }

  // Return both profile update and home location payloads
  return {
    profileUpdate,
    homeLocation
  };
}

/**
 * Save user's home location in user_settings table
 */
async function saveUserHomeLocation(userId, homeLocation) {
  try {
    console.log('💾 Saving user home location...', { userId, homeLocation });

    // If all fields are empty/nullable, clear settings if they exist and stop
    const hasAnyValue =
      (homeLocation.home_label && homeLocation.home_label.length > 0) ||
      homeLocation.home_lat != null ||
      homeLocation.home_lng != null;

    const existing = await supabaseClient.request(
      'GET',
      `/user_settings?user_id=eq.${userId}&select=*`
    );

    if (!hasAnyValue) {
      if (existing && existing.length > 0) {
        console.log('🧹 Clearing existing home location for user', userId);
        await supabaseClient.request(
          'PATCH',
          `/user_settings?user_id=eq.${userId}`,
          {
            home_label: null,
            home_lat: null,
            home_lng: null,
            updated_at: new Date().toISOString()
          }
        );
      }

      return;
    }

    if (existing && existing.length > 0) {
      console.log('🔄 Updating existing user_settings row for user', userId);
      await supabaseClient.request(
        'PATCH',
        `/user_settings?user_id=eq.${userId}`,
        {
          ...homeLocation,
          updated_at: new Date().toISOString()
        }
      );
    } else {
      console.log('🆕 Creating user_settings row for user', userId);
      await supabaseClient.request(
        'POST',
        '/user_settings',
        {
          user_id: userId,
          ...homeLocation
        }
      );
    }
  } catch (error) {
    console.error('❌ Error saving user home location:', error);
    // Do not block overall settings save if home location fails
  }
}

/**
 * Show success message
 */
function showSuccess(message) {
  const successMessage = document.getElementById('successMessage');
  const successText = document.getElementById('successText');
  const errorMessage = document.getElementById('errorMessage');

  errorMessage.style.display = 'none';
  successText.textContent = message;
  successMessage.style.display = 'flex';

  // Scroll to message
  successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Hide after 5 seconds
  setTimeout(() => {
    successMessage.style.display = 'none';
  }, 5000);
}

/**
 * Show error message
 */
function showError(message) {
  const errorMessage = document.getElementById('errorMessage');
  const errorText = document.getElementById('errorText');
  const successMessage = document.getElementById('successMessage');

  successMessage.style.display = 'none';
  errorText.textContent = message;
  errorMessage.style.display = 'flex';

  // Scroll to message
  errorMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSettings);
} else {
  initSettings();
}
