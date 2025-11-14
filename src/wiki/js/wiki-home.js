/**
 * Wiki Home Page - Display Guides from Database
 * Fetches real guides from Supabase and displays them with filtering
 */

import { supabase } from '../../js/supabase-client.js';
import { displayVersionInHeader, VERSION_DISPLAY } from '../../js/version.js';

// State
let currentCategory = 'all';
let currentSearchQuery = '';
let allGuides = [];
let allCategories = [];
let allLocations = [];
let allEvents = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
  console.log(`🚀 Wiki Home ${VERSION_DISPLAY}: DOMContentLoaded - Starting initialization`);
  console.log('📍 Supabase URL:', import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321');

  // Display version in header for testing
  displayVersionInHeader();

  await loadInitialData();
  initializeCategoryFilters();
  initializeSearch();

  console.log(`✅ Wiki Home ${VERSION_DISPLAY}: Initialization complete`);
});

/**
 * Load initial data from database
 */
async function loadInitialData() {
  try {
    console.log('📊 Loading initial data from database...');

    // Show loading state
    showLoading();

    // Fetch categories
    console.log('📂 Fetching categories from wiki_categories table...');
    allCategories = await supabase.getAll('wiki_categories', {
      order: 'name.asc'
    });
    console.log(`✅ Loaded ${allCategories.length} categories:`, allCategories.map(c => c.name));

    // Fetch guides with their categories
    console.log('📚 Fetching guides from wiki_guides table...');
    allGuides = await fetchGuidesWithCategories();
    console.log(`✅ Loaded ${allGuides.length} guides from database`);
    console.log('📄 Guide titles:', allGuides.map(g => g.title));

    // Fetch locations
    console.log('📍 Fetching locations from wiki_locations table...');
    allLocations = await supabase.getAll('wiki_locations', {
      where: 'status',
      operator: 'eq',
      value: 'published',
      order: 'name.asc'
    });
    console.log(`✅ Loaded ${allLocations.length} locations from database`);

    // Fetch events
    console.log('📅 Fetching events from wiki_events table...');
    allEvents = await supabase.getAll('wiki_events', {
      where: 'status',
      operator: 'eq',
      value: 'published',
      order: 'event_date.asc'
    });
    console.log(`✅ Loaded ${allEvents.length} events from database`);

    // Update stats
    console.log('📈 Updating statistics...');
    await updateStats();

    // Render guides
    console.log('🎨 Rendering guides to DOM...');
    renderGuides();

    console.log('✨ Initial data load complete!');
  } catch (error) {
    console.error('❌ Error loading data:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response
    });
    showError('Failed to load guides. Please refresh the page.');
  }
}

/**
 * Fetch guides with their category relationships
 */
async function fetchGuidesWithCategories() {
  try {
    console.log('🔍 Fetching published guides...');

    // Get all published guides
    const guides = await supabase.getAll('wiki_guides', {
      where: 'status',
      operator: 'eq',
      value: 'published',
      order: 'published_at.desc'
    });
    console.log(`📚 Found ${guides.length} published guides`);

    // For each guide, fetch its categories
    console.log('🔗 Fetching category relationships for each guide...');
    const guidesWithCategories = await Promise.all(
      guides.map(async (guide, index) => {
        console.log(`  Processing guide ${index + 1}/${guides.length}: "${guide.title}"`);

        // Fetch guide-category relationships
        const guideCategories = await supabase.getAll('wiki_guide_categories', {
          where: 'guide_id',
          operator: 'eq',
          value: guide.id
        });
        console.log(`    Found ${guideCategories.length} category relationships`);

        // Get full category details
        const categories = await Promise.all(
          guideCategories.map(async (gc) => {
            const cats = await supabase.getAll('wiki_categories', {
              where: 'id',
              operator: 'eq',
              value: gc.category_id
            });
            return cats[0];
          })
        );

        const validCategories = categories.filter(c => c);
        console.log(`    Categories: ${validCategories.map(c => c.name).join(', ')}`);

        return {
          ...guide,
          categories: validCategories
        };
      })
    );

    console.log('✅ Finished processing all guides with categories');
    return guidesWithCategories;
  } catch (error) {
    console.error('❌ Error fetching guides:', error);
    console.error('Error details:', error);
    return [];
  }
}

/**
 * Update statistics on the page
 */
async function updateStats() {
  try {
    // Count guides
    const guidesCount = await supabase.getAll('wiki_guides', {
      where: 'status',
      operator: 'eq',
      value: 'published'
    });

    // Count locations
    const locationsCount = await supabase.getAll('wiki_locations', {
      where: 'status',
      operator: 'eq',
      value: 'published'
    });

    // Count upcoming events
    const eventsCount = await supabase.getAll('wiki_events', {
      where: 'status',
      operator: 'eq',
      value: 'published'
    });

    // Update DOM
    const stats = document.querySelectorAll('.wiki-container > .card > div > div');
    if (stats.length >= 3) {
      stats[0].querySelector('div:first-child').textContent = guidesCount.length;
      stats[1].querySelector('div:first-child').textContent = locationsCount.length;
      stats[2].querySelector('div:first-child').textContent = eventsCount.length;
    }
  } catch (error) {
    console.error('Error updating stats:', error);
  }
}

/**
 * Render guides to the page (and search results from all types)
 */
function renderGuides() {
  const guidesGrid = document.getElementById('guidesGrid');
  const guideCount = document.getElementById('guideCount');

  if (!guidesGrid) return;

  // If there's a search query, search across all content types
  if (currentSearchQuery !== '') {
    renderSearchResults();
    return;
  }

  // Otherwise, filter guides based on current category
  const filteredGuides = allGuides.filter(guide => {
    // Category filter
    const matchesCategory = currentCategory === 'all' ||
                           guide.categories.some(cat => cat.slug === currentCategory);

    return matchesCategory;
  });

  // Update count
  if (guideCount) {
    if (currentCategory === 'all' && currentSearchQuery === '') {
      guideCount.textContent = `Showing all ${allGuides.length} guides`;
    } else {
      guideCount.textContent = `Showing ${filteredGuides.length} guide${filteredGuides.length !== 1 ? 's' : ''}`;
    }
  }

  // Render guides
  if (filteredGuides.length === 0) {
    guidesGrid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <i class="fas fa-search" style="font-size: 3rem; color: var(--wiki-text-muted); margin-bottom: 1rem;"></i>
        <h3 style="color: var(--wiki-text-muted);">No guides found</h3>
        <p class="text-muted">Try adjusting your filters or search query</p>
      </div>
    `;
    return;
  }

  guidesGrid.innerHTML = filteredGuides.map(guide => {
    // Debug: log each guide's slug
    console.log(`Rendering guide: "${guide.title}" with slug: "${guide.slug}"`);

    return `
    <div class="card">
      <div class="card-meta">
        <span><i class="fas fa-calendar"></i> ${formatDate(guide.published_at)}</span>
        <span><i class="fas fa-eye"></i> ${guide.view_count || 0} views</span>
      </div>
      <h3 class="card-title">
        <a href="wiki-page.html?slug=${escapeHtml(guide.slug || '')}" style="text-decoration: none; color: inherit;">
          ${escapeHtml(guide.title)}
        </a>
      </h3>
      <p class="text-muted">
        ${escapeHtml(guide.summary)}
      </p>
      <div class="tags">
        ${guide.categories.map(cat => `
          <span class="tag">${escapeHtml(cat.name)}</span>
        `).join('')}
      </div>
    </div>
  `;
  }).join('');
}

/**
 * Show loading state
 */
function showLoading() {
  const guidesGrid = document.getElementById('guidesGrid');
  if (guidesGrid) {
    guidesGrid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: var(--wiki-primary); margin-bottom: 1rem;"></i>
        <h3 style="color: var(--wiki-text-muted);">Loading guides...</h3>
      </div>
    `;
  }
}

/**
 * Show error message
 */
function showError(message) {
  const guidesGrid = document.getElementById('guidesGrid');
  if (guidesGrid) {
    guidesGrid.innerHTML = `
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
  if (!dateString) return 'Unknown date';

  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) !== 1 ? 's' : ''} ago`;

  return date.toLocaleDateString();
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

/**
 * Initialize category filters
 */
function initializeCategoryFilters() {
  const categoryFilters = document.querySelectorAll('.category-filter');

  categoryFilters.forEach(filter => {
    filter.addEventListener('click', function(e) {
      e.preventDefault();

      // Update active state
      categoryFilters.forEach(f => f.classList.remove('active'));
      this.classList.add('active');

      // Update current category
      currentCategory = this.dataset.category;

      // Re-render guides
      renderGuides();
    });
  });
}

/**
 * Initialize search functionality
 */
function initializeSearch() {
  const searchInput = document.getElementById('searchInput');

  if (!searchInput) return;

  // Add debouncing to avoid too many re-renders
  let searchTimeout;

  searchInput.addEventListener('input', function(e) {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
      currentSearchQuery = e.target.value.toLowerCase().trim();
      renderGuides();
    }, 300);
  });
}

/**
 * Render search results from all content types
 */
function renderSearchResults() {
  const guidesGrid = document.getElementById('guidesGrid');
  const guideCount = document.getElementById('guideCount');

  if (!guidesGrid) return;

  // Search guides
  const matchingGuides = allGuides.filter(guide =>
    guide.title.toLowerCase().includes(currentSearchQuery) ||
    guide.summary.toLowerCase().includes(currentSearchQuery)
  );

  // Search locations
  const matchingLocations = allLocations.filter(location =>
    location.name.toLowerCase().includes(currentSearchQuery) ||
    (location.description && location.description.toLowerCase().includes(currentSearchQuery))
  );

  // Search events
  const matchingEvents = allEvents.filter(event =>
    event.title.toLowerCase().includes(currentSearchQuery) ||
    (event.description && event.description.toLowerCase().includes(currentSearchQuery))
  );

  const totalResults = matchingGuides.length + matchingLocations.length + matchingEvents.length;

  // Update count
  if (guideCount) {
    guideCount.textContent = `Found ${totalResults} result${totalResults !== 1 ? 's' : ''} for "${currentSearchQuery}"`;
  }

  // No results
  if (totalResults === 0) {
    guidesGrid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <i class="fas fa-search" style="font-size: 3rem; color: var(--wiki-text-muted); margin-bottom: 1rem;"></i>
        <h3 style="color: var(--wiki-text-muted);">No results found</h3>
        <p class="text-muted">Try adjusting your search query</p>
      </div>
    `;
    return;
  }

  // Render mixed results
  let resultsHTML = '';

  // Add guides
  matchingGuides.forEach(guide => {
    console.log(`Search result - Guide: "${guide.title}" with slug: "${guide.slug}"`);
    resultsHTML += `
      <div class="card">
        <div class="card-meta">
          <span><i class="fas fa-book"></i> Guide</span>
          <span><i class="fas fa-eye"></i> ${guide.view_count || 0} views</span>
        </div>
        <h3 class="card-title">
          <a href="wiki-page.html?slug=${escapeHtml(guide.slug || '')}" style="text-decoration: none; color: inherit;">
            ${escapeHtml(guide.title)}
          </a>
        </h3>
        <p class="text-muted">${escapeHtml(guide.summary)}</p>
        <div class="tags">
          ${guide.categories.map(cat => `<span class="tag">${escapeHtml(cat.name)}</span>`).join('')}
        </div>
      </div>
    `;
  });

  // Add locations
  matchingLocations.forEach(location => {
    resultsHTML += `
      <div class="card">
        <div class="card-meta">
          <span><i class="fas fa-map-marker-alt"></i> Location</span>
          <span>${escapeHtml(location.location_type || 'Place')}</span>
        </div>
        <h3 class="card-title">
          <a href="wiki-map.html#location-${location.id}" style="text-decoration: none; color: inherit;">
            ${escapeHtml(location.name)}
          </a>
        </h3>
        <p class="text-muted">${escapeHtml(location.description || location.address || '')}</p>
        ${location.website ? `<a href="${escapeHtml(location.website)}" target="_blank" rel="noopener">Visit Website</a>` : ''}
      </div>
    `;
  });

  // Add events
  matchingEvents.forEach(event => {
    const eventDate = new Date(event.event_date);
    const dateStr = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    resultsHTML += `
      <div class="card">
        <div class="card-meta">
          <span><i class="fas fa-calendar"></i> Event - ${dateStr}</span>
          <span>${escapeHtml(event.event_type)}</span>
        </div>
        <h3 class="card-title">
          <a href="wiki-events.html#event-${event.id}" style="text-decoration: none; color: inherit;">
            ${escapeHtml(event.title)}
          </a>
        </h3>
        <p class="text-muted">${escapeHtml(event.description || '')}</p>
        <div style="margin-top: 0.5rem;">
          <small><i class="fas fa-map-marker-alt"></i> ${escapeHtml(event.location_name || '')}</small>
        </div>
      </div>
    `;
  });

  guidesGrid.innerHTML = resultsHTML;
}
