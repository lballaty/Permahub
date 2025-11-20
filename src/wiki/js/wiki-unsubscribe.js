/**
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/src/wiki/js/wiki-unsubscribe.js
 * Description: Newsletter unsubscribe page with feedback collection
 * Author: Claude Code <noreply@anthropic.com>
 * Created: 2025-11-20
 */

import { supabase } from '../../js/supabase-client.js';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('📭 Unsubscribe page initialized');

  // Show/hide "Other reason" text field
  const reasonOtherCheckbox = document.getElementById('reasonOther');
  const otherReasonContainer = document.getElementById('otherReasonContainer');

  if (reasonOtherCheckbox && otherReasonContainer) {
    reasonOtherCheckbox.addEventListener('change', function() {
      otherReasonContainer.style.display = this.checked ? 'block' : 'none';
    });
  }

  // Handle unsubscribe button click
  const unsubscribeBtn = document.getElementById('unsubscribeBtn');
  if (unsubscribeBtn) {
    unsubscribeBtn.addEventListener('click', handleUnsubscribe);
  }

  // Check for email in URL query parameter (for email links)
  const urlParams = new URLSearchParams(window.location.search);
  const emailParam = urlParams.get('email');
  if (emailParam) {
    const emailInput = document.getElementById('unsubscribeEmail');
    if (emailInput) {
      emailInput.value = decodeURIComponent(emailParam);
    }
  }
});

/**
 * Handle unsubscribe form submission
 */
async function handleUnsubscribe() {
  const email = document.getElementById('unsubscribeEmail').value.trim();

  // Validate email
  if (!email) {
    alert('Please enter your email address');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address');
    return;
  }

  // Collect feedback
  const feedback = {
    p_email: email,
    p_reason_too_frequent: document.getElementById('reasonTooFrequent')?.checked || false,
    p_reason_not_relevant: document.getElementById('reasonNotRelevant')?.checked || false,
    p_reason_never_signed_up: document.getElementById('reasonNeverSignedUp')?.checked || false,
    p_reason_no_longer_interested: document.getElementById('reasonNoLongerInterested')?.checked || false,
    p_reason_spam: document.getElementById('reasonSpam')?.checked || false,
    p_reason_other: document.getElementById('reasonOther')?.checked || false,
    p_other_reason: document.getElementById('otherReasonText')?.value.trim() || null,
    p_additional_comments: document.getElementById('additionalComments')?.value.trim() || null,
    p_would_resubscribe_if: document.getElementById('wouldResubscribe')?.value.trim() || null
  };

  // Store original button HTML
  const unsubscribeBtn = document.getElementById('unsubscribeBtn');
  const originalHTML = unsubscribeBtn.innerHTML;

  try {
    // Disable button and show loading state
    unsubscribeBtn.disabled = true;
    unsubscribeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    console.log('📭 Unsubscribing email:', email);
    console.log('📝 Feedback:', feedback);

    // Call the Supabase function to unsubscribe with feedback
    const { data, error } = await supabase.rpc('unsubscribe_from_newsletter_with_feedback', feedback);

    if (error) {
      console.error('❌ Unsubscribe error:', error);
      throw error;
    }

    console.log('✅ Unsubscribe successful:', data);

    // Check if subscription was found
    if (!data) {
      alert('Email address not found in our subscription list.\n\nYou may have already unsubscribed, or this email was never subscribed.');
      unsubscribeBtn.innerHTML = originalHTML;
      unsubscribeBtn.disabled = false;
      return;
    }

    // Show success message
    document.getElementById('unsubscribeForm').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (error) {
    console.error('❌ Error unsubscribing:', error);

    // Show error message
    let errorMessage = 'Failed to unsubscribe. ';
    if (error.message) {
      errorMessage += error.message;
    } else {
      errorMessage += 'Please try again later or contact support.';
    }
    alert(errorMessage);

    // Restore button
    unsubscribeBtn.innerHTML = originalHTML;
    unsubscribeBtn.disabled = false;
  }
}
