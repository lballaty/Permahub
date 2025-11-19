/**
 * Wiki My Content Page - User's Content Management Dashboard
 * Displays all content (guides, events, locations) created by the logged-in user
 * with advanced filtering, sorting, and search capabilities
 */

import { supabase } from '../../js/supabase-client.js';
import { displayVersionBadge, VERSION_DISPLAY } from "../../js/version-manager.js"';

// wikiI18n is loaded globally via script tag in HTML
const wikiI18n = window.wikiI18n;

// State
let allContent = []; // All content items from all tables
let allCategories = [];
let currentFilters = {
  status: 'all',
  type: 'all',
  category: 'all',
  dateRange: 'all',
  search: ''
};
let currentSort = 'newest';
let currentUserId = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
  console.log(`🚀 Wiki My Content ${VERSION_DISPLAY}: DOMContentLoaded - Starting initialization`);

  // Display version in header for testing
  displayVersionBadge();

  // Check authentication
  const isAuthenticated = await checkAuthentication();
  if (!isAuthenticated) {
    showAuthenticationRequired();
    return;
  }

  // Load categories for filters
  await loadCategories();

  // Load user's content
  await loadMyContent();

  // Initialize filters
  initializeFilters();

  // Initialize search
  initializeSearch();

  // Initialize sorting
  initializeSorting();

  console.log(`✅ Wiki My Content ${VERSION_DISPLAY}: Initialization complete`);
});

/**
 * Check if user is authenticated
 */
async function checkAuthentication() {
  try {
    const user = await supabase.getCurrentUser();
    const authToken = localStorage.getItem('auth_token');
    const userId = localStorage.getItem('user_id');

    if (!user && !authToken && !userId) {
      console.log('⚠️  User not authenticated');
      return false;
    }

    currentUserId = user?.id || userId;
    console.log(`✅ User authenticated: ${currentUserId}`);
    return true;

  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}

/**
 * Show authentication required message
 */
function showAuthenticationRequired() {
  const contentGrid = document.getElementById('contentGrid');
  if (contentGrid) {
    contentGrid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <i class="fas fa-lock" style="font-size: 3rem; color: var(--wiki-text-muted); margin-bottom: 1rem;"></i>
        <h2 style="color: var(--wiki-text-muted); margin-bottom: 1rem;">Authentication Required</h2>
        <p class="text-muted" style="margin-bottom: 2rem;">
          You need to be logged in to view your content.
        </p>
        <a href="wiki-login.html" class="btn btn-primary">
          <i class="fas fa-sign-in-alt"></i> Log In
        </a>
      </div>
    `;
  }
}

/**
 * Load categories from database
 */
async function loadCategories() {
  try {
    console.log('📂 Loading categories from database...');

    const categories = await supabase.getAll('wiki_categories', {
      order: 'name.asc'
    });

    allCategories = categories;
    console.log(`✅ Loaded ${categories.length} categories`);

    // Render category filters
    renderCategoryFilters();

  } catch (error) {
    console.error('❌ Error loading categories:', error);
  }
}

/**
 * Render category filters
 */
function renderCategoryFilters() {
  const categoryFilters = document.getElementById('categoryFilters');
  if (!categoryFilters) return;

  // Add categories after "All Categories"
  const categoryHTML = allCategories.map(cat => {
    const translatedName = wikiI18n.t(`wiki.categories.${cat.slug}`) || escapeHtml(cat.name);
    return `
      <a href="javascript:void(0)" class="tag category-filter" data-filter="${cat.id}">
        ${translatedName}
      </a>
    `;
  }).join('');

  // Add category filters after "All Categories"
  const allFilter = categoryFilters.querySelector('[data-filter="all"]');
  if (allFilter) {
    allFilter.insertAdjacentHTML('afterend', categoryHTML);
  }
}

/**
 * Load all content created by the current user
 */
async function loadMyContent() {
  try {
    console.log('📚 Loading user content from database...');
    showLoading();

    // Fetch guides, events, and locations in parallel
    console.log('🔍 Fetching all content types...');

    const [guides, events, locations] = await Promise.all([
      // Guides
      supabase.getAll('wiki_guides', {
        where: 'author_id',
        operator: 'eq',
        value: currentUserId,
        order: 'created_at.desc'
      }),
      // Events
      supabase.getAll('wiki_events', {
        where: 'organizer_id',
        operator: 'eq',
        value: currentUserId,
        order: 'created_at.desc'
      }),
      // Locations
      supabase.getAll('wiki_locations', {
        where: 'created_by',
        operator: 'eq',
        value: currentUserId,
        order: 'created_at.desc'
      })
    ]);

    console.log(`✅ Loaded ${guides.length} guides, ${events.length} events, ${locations.length} locations`);

    // Normalize all content to a unified format and add type
    const normalizedGuides = guides.map(g => ({
      ...g,
      type: 'guide',
      icon: 'fa-book',
      color: '#2d8659'
    }));

    const normalizedEvents = events.map(e => ({
      ...e,
      type: 'event',
      icon: 'fa-calendar',
      color: '#e63946',
      summary: e.description, // Events use 'description' field
      slug: e.slug || e.id // Events might not have slug
    }));

    const normalizedLocations = locations.map(l => ({
      ...l,
      type: 'location',
      icon: 'fa-map-marker-alt',
      color: '#3d9970',
      summary: l.description, // Locations use 'description' field
      slug: l.slug || l.id // Locations might not have slug
    }));

    // Combine all content
    allContent = [...normalizedGuides, ...normalizedEvents, ...normalizedLocations];

    // Enrich with category information
    console.log('🏷️  Enriching content with categories...');
    allContent = await Promise.all(
      allContent.map(async (item) => {
        // Fetch categories based on type
        let categoryAssociations = [];
        if (item.type === 'guide') {
          categoryAssociations = await supabase.getAll('wiki_guide_categories', {
            where: 'guide_id',
            operator: 'eq',
            value: item.id
          });
        } else if (item.type === 'event') {
          categoryAssociations = await supabase.getAll('wiki_event_categories', {
            where: 'event_id',
            operator: 'eq',
            value: item.id
          });
        } else if (item.type === 'location') {
          categoryAssociations = await supabase.getAll('wiki_location_categories', {
            where: 'location_id',
            operator: 'eq',
            value: item.id
          });
        }

        // Get category details
        const categoryDetails = await Promise.all(
          categoryAssociations.map(async (assoc) => {
            const cats = await supabase.getAll('wiki_categories', {
              where: 'id',
              operator: 'eq',
              value: assoc.category_id
            });
            return cats[0];
          })
        );

        return {
          ...item,
          categories: categoryDetails.filter(c => c) // Remove nulls
        };
      })
    );

    console.log(`✅ Total content items: ${allContent.length}`);

    // Update total count
    const totalCount = document.getElementById('totalCount');
    if (totalCount) {
      totalCount.textContent = allContent.length;
    }

    // Render content
    renderContent();

    console.log('✨ Content load complete!');

  } catch (error) {
    console.error('❌ Error loading content:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    showError('Failed to load content. Please try again.');
  }
}

/**
 * Render content to the page
 */
function renderContent() {
  const contentGrid = document.getElementById('contentGrid');

  if (!contentGrid) {
    console.warn('⚠️ contentGrid element not found');
    return;
  }

  // Apply all filters
  let filteredContent = allContent;

  // Status filter
  if (currentFilters.status !== 'all') {
    filteredContent = filteredContent.filter(item => item.status === currentFilters.status);
  }

  // Type filter
  if (currentFilters.type !== 'all') {
    filteredContent = filteredContent.filter(item => item.type === currentFilters.type);
  }

  // Category filter
  if (currentFilters.category !== 'all') {
    filteredContent = filteredContent.filter(item => {
      return item.categories && item.categories.some(cat => cat.id === currentFilters.category);
    });
  }

  // Date range filter
  if (currentFilters.dateRange !== 'all') {
    const daysAgo = parseInt(currentFilters.dateRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

    filteredContent = filteredContent.filter(item => {
      const createdDate = new Date(item.created_at);
      return createdDate >= cutoffDate;
    });
  }

  // Search filter
  if (currentFilters.search) {
    const searchLower = currentFilters.search.toLowerCase();
    filteredContent = filteredContent.filter(item => {
      return (
        item.title?.toLowerCase().includes(searchLower) ||
        item.summary?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      );
    });
  }

  // Apply sorting
  filteredContent = sortContent(filteredContent, currentSort);

  console.log(`📊 Rendering ${filteredContent.length} items (filtered from ${allContent.length} total)`);

  // Update result count
  const resultCount = document.getElementById('resultCount');
  if (resultCount) {
    resultCount.textContent = filteredContent.length;
  }

  // Update active filters display
  updateActiveFilters();

  // Render content
  if (filteredContent.length === 0) {
    contentGrid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <i class="fas fa-inbox" style="font-size: 3rem; color: var(--wiki-text-muted); margin-bottom: 1rem;"></i>
        <h3 style="color: var(--wiki-text-muted);">No Content Found</h3>
        <p class="text-muted" style="margin-bottom: 1.5rem;">
          ${allContent.length === 0
            ? "You haven't created any content yet. Start by creating your first guide, event, or location!"
            : "No content matches your current filters. Try adjusting or clearing the filters."
          }
        </p>
        <a href="wiki-editor.html" class="btn btn-primary">
          <i class="fas fa-plus"></i> Create New Content
        </a>
      </div>
    `;
    return;
  }

  contentGrid.innerHTML = filteredContent.map(item => renderContentCard(item)).join('');
}

/**
 * Render a single content card
 */
function renderContentCard(item) {
  const statusBadge = `<span class="badge badge-${item.status}">${capitalizeFirst(item.status)}</span>`;
  const typeBadge = `<span class="tag" style="background-color: ${item.color}; color: white;"><i class="fas ${item.icon}"></i> ${capitalizeFirst(item.type)}</span>`;

  // Build edit URL
  let editUrl = `wiki-editor.html?type=${item.type}&slug=${encodeURIComponent(item.slug || item.id)}`;

  return `
    <div class="card">
      <div class="card-meta" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
          ${typeBadge}
          ${statusBadge}
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <a href="${editUrl}" class="btn btn-outline btn-small" title="Edit">
            <i class="fas fa-edit"></i>
          </a>
          <button onclick="deleteItem('${item.id}', '${item.type}', '${escapeHtml(item.title).replace(/'/g, "\\'")})" class="btn btn-danger btn-small" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>

      <h3 class="card-title">
        ${escapeHtml(item.title)}
      </h3>

      <p class="text-muted" style="margin: 0.75rem 0;">
        ${escapeHtml(item.summary || item.description || 'No description provided.').substring(0, 150)}${(item.summary || item.description || '').length > 150 ? '...' : ''}
      </p>

      ${item.categories && item.categories.length > 0 ? `
        <div class="tags" style="margin: 0.75rem 0;">
          ${item.categories.map(cat => {
            const translatedName = wikiI18n.t(`wiki.categories.${cat.slug}`) || escapeHtml(cat.name);
            return `<span class="tag">${translatedName}</span>`;
          }).join('')}
        </div>
      ` : ''}

      <div class="card-meta" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--wiki-border);">
        <span><i class="fas fa-calendar"></i> Created ${formatDate(item.created_at)}</span>
        ${item.updated_at ? `<span><i class="fas fa-clock"></i> Updated ${formatDate(item.updated_at)}</span>` : ''}
        ${item.view_count !== undefined && item.view_count !== null ? `<span><i class="fas fa-eye"></i> ${item.view_count} views</span>` : ''}
      </div>
    </div>
  `;
}

/**
 * Delete item with double confirmation
 */
window.deleteItem = async function(itemId, itemType, itemTitle) {
  try {
    // First confirmation
    const confirmed = confirm(
      `Are you sure you want to delete "${itemTitle}"?\n\n` +
      `This action cannot be undone. All data including categories, ` +
      `comments, and associations will be permanently removed.`
    );

    if (!confirmed) {
      console.log('❌ Delete cancelled by user (first confirmation)');
      return;
    }

    // Second confirmation - type "DELETE"
    const deleteConfirmation = prompt(
      `To confirm deletion, please type DELETE in capital letters:`
    );

    if (deleteConfirmation !== 'DELETE') {
      alert('Deletion cancelled. You must type DELETE exactly to confirm.');
      console.log('❌ Delete cancelled - confirmation text did not match');
      return;
    }

    console.log(`🗑️ Deleting ${itemType} with ID: ${itemId}`);

    // Determine table name
    const tableName = itemType === 'guide' ? 'wiki_guides' :
                     itemType === 'event' ? 'wiki_events' :
                     'wiki_locations';

    // Delete the item
    await supabase.delete(tableName, itemId);

    alert(`✅ ${capitalizeFirst(itemType)} deleted successfully!`);

    // Reload content
    await loadMyContent();

  } catch (error) {
    console.error('Error deleting item:', error);
    alert(`Failed to delete ${itemType}. ${error.message || 'Please try again.'}`);
  }
};

/**
 * Sort content based on selected sort option
 */
function sortContent(content, sortOption) {
  const sorted = [...content];

  switch (sortOption) {
    case 'newest':
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      break;
    case 'oldest':
      sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      break;
    case 'a-z':
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'z-a':
      sorted.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case 'views':
      sorted.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
      break;
    case 'edited':
      sorted.sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at);
        const dateB = new Date(b.updated_at || b.created_at);
        return dateB - dateA;
      });
      break;
  }

  return sorted;
}

/**
 * Initialize all filters
 */
function initializeFilters() {
  // Status filters
  const statusFilters = document.querySelectorAll('.status-filter');
  statusFilters.forEach(filter => {
    filter.addEventListener('click', function(e) {
      e.preventDefault();
      statusFilters.forEach(f => f.classList.remove('active'));
      this.classList.add('active');
      currentFilters.status = this.dataset.filter;
      renderContent();
    });
  });

  // Type filters
  const typeFilters = document.querySelectorAll('.type-filter');
  typeFilters.forEach(filter => {
    filter.addEventListener('click', function(e) {
      e.preventDefault();
      typeFilters.forEach(f => f.classList.remove('active'));
      this.classList.add('active');
      currentFilters.type = this.dataset.filter;
      renderContent();
    });
  });

  // Date range filters
  const dateFilters = document.querySelectorAll('.date-filter');
  dateFilters.forEach(filter => {
    filter.addEventListener('click', function(e) {
      e.preventDefault();
      dateFilters.forEach(f => f.classList.remove('active'));
      this.classList.add('active');
      currentFilters.dateRange = this.dataset.filter;
      renderContent();
    });
  });

  // Category filters (initialized after categories load)
  setTimeout(() => {
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(filter => {
      filter.addEventListener('click', function(e) {
        e.preventDefault();
        categoryFilters.forEach(f => f.classList.remove('active'));
        this.classList.add('active');
        currentFilters.category = this.dataset.filter;
        renderContent();
      });
    });
  }, 500);

  // Clear all filters
  const clearFiltersBtn = document.getElementById('clearFilters');
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', function() {
      // Reset all filters
      currentFilters = {
        status: 'all',
        type: 'all',
        category: 'all',
        dateRange: 'all',
        search: ''
      };

      // Reset UI
      document.querySelectorAll('.status-filter, .type-filter, .date-filter, .category-filter').forEach(f => {
        f.classList.remove('active');
      });
      document.querySelectorAll('[data-filter="all"]').forEach(f => {
        f.classList.add('active');
      });

      // Clear search
      const searchInput = document.getElementById('contentSearch');
      if (searchInput) searchInput.value = '';

      // Re-render
      renderContent();
    });
  }
}

/**
 * Initialize search
 */
function initializeSearch() {
  const searchInput = document.getElementById('contentSearch');

  if (searchInput) {
    searchInput.addEventListener('input', function() {
      currentFilters.search = this.value;
      renderContent();
    });
  }
}

/**
 * Initialize sorting buttons
 */
function initializeSorting() {
  const sortNewest = document.getElementById('sortNewest');
  const sortOldest = document.getElementById('sortOldest');
  const sortAlphaAZ = document.getElementById('sortAlphaAZ');
  const sortAlphaZA = document.getElementById('sortAlphaZA');
  const sortViews = document.getElementById('sortViews');
  const sortEdited = document.getElementById('sortEdited');

  const sortButtons = [sortNewest, sortOldest, sortAlphaAZ, sortAlphaZA, sortViews, sortEdited];

  if (sortNewest) {
    sortNewest.addEventListener('click', function() {
      currentSort = 'newest';
      updateSortButtons(sortButtons, this);
      renderContent();
    });
  }

  if (sortOldest) {
    sortOldest.addEventListener('click', function() {
      currentSort = 'oldest';
      updateSortButtons(sortButtons, this);
      renderContent();
    });
  }

  if (sortAlphaAZ) {
    sortAlphaAZ.addEventListener('click', function() {
      currentSort = 'a-z';
      updateSortButtons(sortButtons, this);
      renderContent();
    });
  }

  if (sortAlphaZA) {
    sortAlphaZA.addEventListener('click', function() {
      currentSort = 'z-a';
      updateSortButtons(sortButtons, this);
      renderContent();
    });
  }

  if (sortViews) {
    sortViews.addEventListener('click', function() {
      currentSort = 'views';
      updateSortButtons(sortButtons, this);
      renderContent();
    });
  }

  if (sortEdited) {
    sortEdited.addEventListener('click', function() {
      currentSort = 'edited';
      updateSortButtons(sortButtons, this);
      renderContent();
    });
  }

  // Set initial active state
  updateSortButtons(sortButtons, sortNewest);
}

/**
 * Update sort button states
 */
function updateSortButtons(buttons, activeButton) {
  buttons.forEach(btn => {
    if (btn) {
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-outline');
    }
  });

  if (activeButton) {
    activeButton.classList.remove('btn-outline');
    activeButton.classList.add('btn-primary');
  }
}

/**
 * Update active filters summary
 */
function updateActiveFilters() {
  const activeFiltersDiv = document.getElementById('activeFilters');
  const filterTagsDiv = document.getElementById('filterTags');

  if (!activeFiltersDiv || !filterTagsDiv) return;

  const activeTags = [];

  if (currentFilters.status !== 'all') {
    activeTags.push(`Status: ${capitalizeFirst(currentFilters.status)}`);
  }

  if (currentFilters.type !== 'all') {
    activeTags.push(`Type: ${capitalizeFirst(currentFilters.type)}`);
  }

  if (currentFilters.category !== 'all') {
    const category = allCategories.find(c => c.id === currentFilters.category);
    if (category) {
      const translatedName = wikiI18n.t(`wiki.categories.${category.slug}`) || category.name;
      activeTags.push(`Category: ${translatedName}`);
    }
  }

  if (currentFilters.dateRange !== 'all') {
    activeTags.push(`Last ${currentFilters.dateRange} days`);
  }

  if (currentFilters.search) {
    activeTags.push(`Search: "${currentFilters.search}"`);
  }

  if (activeTags.length > 0) {
    filterTagsDiv.innerHTML = activeTags.map(tag => `
      <span class="badge badge-published" style="background-color: var(--wiki-primary);">
        ${escapeHtml(tag)}
      </span>
    `).join('');
    activeFiltersDiv.style.display = 'block';
  } else {
    activeFiltersDiv.style.display = 'none';
  }
}

/**
 * Show loading state
 */
function showLoading() {
  const contentGrid = document.getElementById('contentGrid');
  if (contentGrid) {
    contentGrid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: var(--wiki-primary); margin-bottom: 1rem;"></i>
        <h3 style="color: var(--wiki-text-muted);">Loading your content...</h3>
      </div>
    `;
  }
}

/**
 * Show error message
 */
function showError(message) {
  const contentGrid = document.getElementById('contentGrid');
  if (contentGrid) {
    contentGrid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e63946; margin-bottom: 1rem;"></i>
        <h3 style="color: var(--wiki-text-muted);">Error</h3>
        <p class="text-muted">${escapeHtml(message)}</p>
      </div>
    `;
  }
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  if (!dateString) return 'Unknown';

  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  }

  return date.toLocaleDateString();
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str) {
  if (!str) return '';
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
