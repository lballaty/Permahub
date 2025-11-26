/**
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/src/wiki/js/subscribe-newsletter.js
 * Description: Shared newsletter subscription functionality for all wiki pages
 * Author: Claude Code <noreply@anthropic.com>
 * Created: 2025-11-19
 */

import { supabase } from '../../js/supabase-client.js';

/**
 * Initialize subscribe button functionality
 *
 * @param {string} category - Subscription category (e.g., 'events', 'guides', 'general')
 * @param {string} source - Source page identifier (e.g., 'event-page', 'home-page')
 * @param {string} emailInputId - ID of email input element (default: 'subscribeEmail')
 * @param {string} buttonId - ID of subscribe button element (default: 'subscribeBtn')
 */
export function initializeSubscribeButton(category = 'general', source = 'wiki', emailInputId = 'subscribeEmail', buttonId = 'subscribeBtn') {
  const subscribeBtn = document.getElementById(buttonId);
  const subscribeEmail = document.getElementById(emailInputId);

  if (!subscribeBtn || !subscribeEmail) {
    console.warn(`⚠️ Subscribe button (${buttonId}) or email input (${emailInputId}) not found`);
    return;
  }

  console.log(`📧 Initializing subscribe button for category: ${category}, source: ${source}`);

  subscribeBtn.addEventListener('click', async function() {
    const email = subscribeEmail.value.trim();

    // Validate email
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Store original HTML before try block so it's accessible in catch
    const originalHTML = subscribeBtn.innerHTML;

    try {
      // Disable button and show loading state
      subscribeBtn.disabled = true;
      subscribeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';

      console.log(`📧 Subscribing email: ${email} to category: ${category}`);

      // Call the Supabase function to subscribe
      const { data, error } = await supabase.rpc('subscribe_to_newsletter', {
        p_email: email,
        p_name: null, // We don't collect name in this form
        p_categories: [category], // Subscribe to specified category
        p_source: source
      });

      if (error) {
        console.error('❌ Subscription error:', error);
        throw error;
      }

      console.log('✅ Subscription successful:', data);

      // Show success message
      alert('🎉 Thank you for subscribing!\n\nYou will receive email notifications about updates from the Permahub community.');

      // Clear email input
      subscribeEmail.value = '';

      // Restore button
      subscribeBtn.innerHTML = originalHTML;
      subscribeBtn.disabled = false;

    } catch (error) {
      console.error('❌ Error subscribing:', error);

      // Show error message
      let errorMessage = 'Failed to subscribe. ';
      if (error.message.includes('duplicate') || error.message.includes('already exists')) {
        errorMessage += 'This email is already subscribed to our newsletter.';
      } else {
        errorMessage += 'Please try again later.';
      }
      alert(errorMessage);

      // Restore button
      subscribeBtn.innerHTML = originalHTML;
      subscribeBtn.disabled = false;
    }
  });

  // Also allow Enter key to submit
  subscribeEmail.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      subscribeBtn.click();
    }
  });
}
