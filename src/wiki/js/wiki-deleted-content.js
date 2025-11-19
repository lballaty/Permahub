/**
 * Wiki Deleted Content Page - View and Restore Deleted Content
 * Allows users to restore content they've deleted within 30 days
 */

import { supabase } from '../../js/supabase-client.js';
import { displayVersionBadge, VERSION_DISPLAY } from "../../js/version-manager.js"';

// wikiI18n is loaded globally via script tag in HTML
const wikiI18n = window.wikiI18n;

// State
let currentFilter = 'all';
let allDeletedContent = [];
let currentUser = null;

// TODO: Replace with actual authenticated user ID when auth is implemented
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
  console.log(`🚀 Wiki Deleted Content ${VERSION_DISPLAY}: DOMContentLoaded - Starting initialization`);

  // Display version in header
  displayVersionBadge();

  // Get current user
  currentUser = await supabase.getCurrentUser();

  if (!currentUser) {
    showAuthRequired();
    return;
  }

  // Load deleted content
  await loadDeletedContent();

  // Initialize filters
  initializeFilters();

  console.log(`✅ Wiki Deleted Content ${VERSION_DISPLAY}: Initialization complete`);
});

/**
 * Show authentication required message
 */
function showAuthRequired() {
  const listContainer = document.getElementById('deletedContentList');
  listContainer.innerHTML = `
    <div class="card" style="text-align: center; padding: 3rem;">
      <i class="fas fa-lock" style="font-size: 3rem; color: var(--wiki-text-muted); margin-bottom: 1rem;"></i>
      <h3 style="color: var(--wiki-text-muted);">Authentication Required</h3>
      <p class="text-muted">Please log in to view your deleted content.</p>
      <a href="wiki-login.html" class="btn btn-primary" style="margin-top: 1rem;">
        <i class="fas fa-sign-in-alt"></i> Log In
      </a>
    </div>
  `;
}

/**
 * Load deleted content from all tables
 */
async function loadDeletedContent() {
  try {
    console.log('🗑️ Loading deleted content...');
    showLoading();

    const userId = currentUser?.id || MOCK_USER_ID;

    // Fetch deleted content from all tables in parallel
    const [guides, events, locations] = await Promise.all([
      supabase.getDeletedContent('wiki_guides', userId),
      supabase.getDeletedContent('wiki_events', userId),
      supabase.getDeletedContent('wiki_locations', userId)
    ]);

    // Combine and tag with content type
    allDeletedContent = [
      ...guides.map(g => ({ ...g, contentType: 'guide' })),
      ...events.map(e => ({ ...e, contentType: 'event' })),
      ...locations.map(l => ({ ...l, contentType: 'location' }))
    ];

    // Sort by deleted date (most recent first)
    allDeletedContent.sort((a, b) => new Date(b.deleted_at) - new Date(a.deleted_at));

    console.log(`✅ Loaded ${allDeletedContent.length} deleted items`);

    // Update counts
    updateCounts();

    // Render content
    renderDeletedContent();

  } catch (error) {
    console.error('❌ Error loading deleted content:', error);
    showError('Failed to load deleted content. Please try again.');
  }
}

/**
 * Update filter counts
 */
function updateCounts() {
  const guides = allDeletedContent.filter(c => c.contentType === 'guide').length;
  const events = allDeletedContent.filter(c => c.contentType === 'event').length;
  const locations = allDeletedContent.filter(c => c.contentType === 'location').length;

  document.getElementById('countAll').textContent = allDeletedContent.length;
  document.getElementById('countGuides').textContent = guides;
  document.getElementById('countEvents').textContent = events;
  document.getElementById('countLocations').textContent = locations;
}

/**
 * Initialize content type filters
 */
function initializeFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      // Update current filter
      currentFilter = this.dataset.type;

      console.log(`🔍 Filter changed to: ${currentFilter}`);

      // Re-render
      renderDeletedContent();
    });
  });
}

/**
 * Render deleted content
 */
function renderDeletedContent() {
  const listContainer = document.getElementById('deletedContentList');

  // Filter content
  const filteredContent = currentFilter === 'all'
    ? allDeletedContent
    : allDeletedContent.filter(c => c.contentType === currentFilter);

  console.log(`📊 Rendering ${filteredContent.length} deleted items (filtered from ${allDeletedContent.length} total)`);

  // Empty state
  if (filteredContent.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-trash">
        <div class="empty-trash-icon">
          <i class="fas fa-trash-alt"></i>
        </div>
        <h3>No Deleted Content</h3>
        <p class="text-muted">
          ${currentFilter === 'all'
            ? "You haven't deleted any content yet."
            : `You haven't deleted any ${currentFilter}s yet.`
          }
        </p>
      </div>
    `;
    return;
  }

  // Render items
  listContainer.innerHTML = filteredContent.map(item => renderDeletedItem(item)).join('');
}

/**
 * Render individual deleted item
 */
function renderDeletedItem(item) {
  const title = item.title || item.name || 'Untitled';
  const deletedDate = new Date(item.deleted_at);
  const daysAgo = Math.floor((Date.now() - deletedDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = 30 - daysAgo;

  // Content type info
  const typeInfo = {
    guide: { icon: 'fa-book', label: 'Guide', color: '#2d8659' },
    event: { icon: 'fa-calendar', label: 'Event', color: '#1976d2' },
    location: { icon: 'fa-map-marker-alt', label: 'Location', color: '#f57c00' }
  };

  const type = typeInfo[item.contentType] || typeInfo.guide;

  return `
    <div class="deleted-item" data-id="${item.id}" data-type="${item.contentType}">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
        <div>
          <span class="content-type-badge" style="background-color: ${type.color}20; color: ${type.color};">
            <i class="fas ${type.icon}"></i> ${type.label}
          </span>
          <span class="deleted-badge">
            <i class="fas fa-trash"></i> Deleted ${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago
          </span>
        </div>
        <div style="text-align: right;">
          ${daysRemaining > 0
            ? `<span class="text-muted" style="font-size: 0.85rem;">
                <i class="fas fa-clock"></i> ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} until permanent deletion
              </span>`
            : `<span style="color: #d32f2f; font-size: 0.85rem; font-weight: 600;">
                <i class="fas fa-exclamation-triangle"></i> Will be purged soon
              </span>`
          }
        </div>
      </div>

      <h3 style="margin: 0 0 0.5rem 0; color: var(--wiki-primary);">
        ${escapeHtml(title)}
      </h3>

      <p class="text-muted" style="margin: 0.5rem 0; font-size: 0.9rem;">
        ${escapeHtml(item.summary || item.description || 'No description available')}
      </p>

      <div style="display: flex; gap: 1rem; font-size: 0.85rem; color: #999; margin-top: 0.5rem;">
        <span><i class="fas fa-calendar"></i> Created: ${formatDate(item.created_at)}</span>
        ${item.published_at ? `<span><i class="fas fa-check-circle"></i> Published: ${formatDate(item.published_at)}</span>` : ''}
        ${item.view_count ? `<span><i class="fas fa-eye"></i> ${item.view_count} views</span>` : ''}
      </div>

      <div class="restore-actions">
        <button class="btn btn-primary btn-small" onclick="restoreContent('${item.id}', '${item.contentType}')">
          <i class="fas fa-undo"></i> Restore
        </button>
        <button class="btn btn-outline btn-small" onclick="previewDeleted('${item.id}', '${item.contentType}')">
          <i class="fas fa-eye"></i> Preview
        </button>
        <button class="btn btn-danger btn-small" onclick="permanentlyDelete('${item.id}', '${item.contentType}')">
          <i class="fas fa-trash-alt"></i> Delete Permanently
        </button>
      </div>
    </div>
  `;
}

/**
 * Restore deleted content
 */
window.restoreContent = async function(id, contentType) {
  try {
    const confirmed = confirm(
      `Are you sure you want to restore this ${contentType}?\n\n` +
      `It will be restored as a draft and you can edit and republish it.`
    );

    if (!confirmed) return;

    console.log(`♻️ Restoring ${contentType} with ID: ${id}`);

    const tableName = contentType === 'guide' ? 'wiki_guides' :
                     contentType === 'event' ? 'wiki_events' :
                     'wiki_locations';

    const userId = currentUser?.id || MOCK_USER_ID;

    await supabase.restore(tableName, id, userId);

    alert(`✅ ${capitalizeFirst(contentType)} restored successfully!\n\nIt has been restored as a draft. You can now edit and republish it.`);

    // Reload deleted content
    await loadDeletedContent();

  } catch (error) {
    console.error('❌ Error restoring content:', error);
    alert(`Failed to restore ${contentType}: ${error.message}`);
  }
};

/**
 * Preview deleted content
 */
window.previewDeleted = function(id, contentType) {
  // Find the item in our list
  const item = allDeletedContent.find(c => c.id === id);
  if (!item) return;

  const title = item.title || item.name || 'Untitled';
  const content = item.content || item.description || item.summary || 'No content available';

  // Open preview in new window
  const previewWindow = window.open('', 'preview', 'width=900,height=700');
  previewWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Preview: ${escapeHtml(title)} (Deleted)</title>
      <link rel="stylesheet" href="css/wiki.css">
      <style>
        body {
          background: #f5f5f5;
          padding: 2rem;
        }
        .preview-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .deleted-banner {
          background: #fff3e0;
          border-left: 4px solid #f57c00;
          padding: 1rem;
          margin-bottom: 2rem;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="preview-container">
        <div class="deleted-banner">
          <strong><i class="fas fa-exclamation-triangle"></i> This content is deleted</strong>
          <p style="margin: 0.5rem 0 0 0; color: #666;">
            This is a preview of deleted content. Close this window and click "Restore" to recover it.
          </p>
        </div>
        <h1>${escapeHtml(title)}</h1>
        ${item.featured_image ? `<img src="${item.featured_image}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 8px; margin-bottom: 2rem;">` : ''}
        <div style="line-height: 1.8;">${content}</div>
      </div>
    </body>
    </html>
  `);
};

/**
 * Permanently delete content (hard delete)
 */
window.permanentlyDelete = async function(id, contentType) {
  try {
    const confirmed = confirm(
      `⚠️ PERMANENT DELETION WARNING ⚠️\n\n` +
      `Are you sure you want to PERMANENTLY delete this ${contentType}?\n\n` +
      `This action CANNOT be undone. All data will be lost forever.`
    );

    if (!confirmed) return;

    // Second confirmation
    const doubleConfirm = prompt(
      `To confirm permanent deletion, type DELETE in capital letters:`
    );

    if (doubleConfirm !== 'DELETE') {
      alert('Permanent deletion cancelled. You must type DELETE exactly to confirm.');
      return;
    }

    console.log(`🗑️ Permanently deleting ${contentType} with ID: ${id}`);

    const tableName = contentType === 'guide' ? 'wiki_guides' :
                     contentType === 'event' ? 'wiki_events' :
                     'wiki_locations';

    // Hard delete
    await supabase.delete(tableName, id);

    alert(`${capitalizeFirst(contentType)} permanently deleted.`);

    // Reload deleted content
    await loadDeletedContent();

  } catch (error) {
    console.error('❌ Error permanently deleting content:', error);
    alert(`Failed to delete ${contentType}: ${error.message}`);
  }
};

/**
 * Show loading state
 */
function showLoading() {
  const listContainer = document.getElementById('deletedContentList');
  listContainer.innerHTML = `
    <div style="text-align: center; padding: 3rem;">
      <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: var(--wiki-primary);"></i>
      <p class="text-muted" style="margin-top: 1rem;">Loading deleted content...</p>
    </div>
  `;
}

/**
 * Show error message
 */
function showError(message) {
  const listContainer = document.getElementById('deletedContentList');
  listContainer.innerHTML = `
    <div class="card" style="text-align: center; padding: 3rem;">
      <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e63946; margin-bottom: 1rem;"></i>
      <h3 style="color: var(--wiki-text-muted);">Error</h3>
      <p class="text-muted">${escapeHtml(message)}</p>
      <button class="btn btn-primary" onclick="location.reload()" style="margin-top: 1rem;">
        <i class="fas fa-redo"></i> Try Again
      </button>
    </div>
  `;
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
