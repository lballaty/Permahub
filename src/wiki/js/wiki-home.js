/**
 * Wiki Home Page - Display Guides from Database
 * Fetches real guides from Supabase and displays them with filtering
 */

import { supabase } from '../../js/supabase-client.js';
import { displayVersionInHeader, VERSION_DISPLAY } from '../../js/version.js';

// wikiI18n is loaded globally via script tag in HTML
const wikiI18n = window.wikiI18n;

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
  renderCategoryFilters(); // Render categories dynamically
  initializeCategoryFilters();
  initializeSearch();
  renderUpcomingEvents(); // Render upcoming events section
  renderFeaturedLocations(); // Render featured locations section

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

    // Fetch locations with author information
    console.log('📍 Fetching locations from wiki_locations table...');
    allLocations = await fetchLocationsWithAuthors();
    console.log(`✅ Loaded ${allLocations.length} locations from database`);

    // Fetch events with author information
    console.log('📅 Fetching events from wiki_events table...');
    allEvents = await fetchEventsWithAuthors();
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

        // Fetch author information if author_id exists
        let authorName = null;
        if (guide.author_id) {
          const authors = await supabase.getAll('users', {
            where: 'id',
            operator: 'eq',
            value: guide.author_id
          });
          if (authors.length > 0) {
            authorName = authors[0].full_name;
            console.log(`    Author: ${authorName}`);
          }
        }

        return {
          ...guide,
          categories: validCategories,
          author_name: authorName
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
 * Fetch events with author information
 */
async function fetchEventsWithAuthors() {
  try {
    // Fetch published events
    const events = await supabase.getAll('wiki_events', {
      where: 'status',
      operator: 'eq',
      value: 'published',
      order: 'event_date.asc'
    });

    // Enrich each event with author name
    const eventsWithAuthors = await Promise.all(
      events.map(async (event) => {
        let authorName = null;
        if (event.author_id) {
          const authors = await supabase.getAll('users', {
            where: 'id',
            operator: 'eq',
            value: event.author_id
          });
          if (authors.length > 0) {
            authorName = authors[0].full_name;
          }
        }
        return {
          ...event,
          author_name: authorName
        };
      })
    );

    return eventsWithAuthors;
  } catch (error) {
    console.error('❌ Error fetching events:', error);
    return [];
  }
}

/**
 * Fetch locations with author information
 */
async function fetchLocationsWithAuthors() {
  try {
    // Fetch published locations
    const locations = await supabase.getAll('wiki_locations', {
      where: 'status',
      operator: 'eq',
      value: 'published',
      order: 'name.asc'
    });

    // Enrich each location with author name
    const locationsWithAuthors = await Promise.all(
      locations.map(async (location) => {
        let authorName = null;
        if (location.author_id) {
          const authors = await supabase.getAll('users', {
            where: 'id',
            operator: 'eq',
            value: location.author_id
          });
          if (authors.length > 0) {
            authorName = authors[0].full_name;
          }
        }
        return {
          ...location,
          author_name: authorName
        };
      })
    );

    return locationsWithAuthors;
  } catch (error) {
    console.error('❌ Error fetching locations:', error);
    return [];
  }
}

/**
 * Update statistics on the page
 */
async function updateStats() {
  try {
    console.log('📊 Updating statistics from database...');

    // Count guides
    const guidesCount = await supabase.getAll('wiki_guides', {
      where: 'status',
      operator: 'eq',
      value: 'published'
    });
    console.log(`  📚 Guides: ${guidesCount.length}`);

    // Count locations
    const locationsCount = await supabase.getAll('wiki_locations', {
      where: 'status',
      operator: 'eq',
      value: 'published'
    });
    console.log(`  📍 Locations: ${locationsCount.length}`);

    // Count upcoming events (future events only)
    const now = new Date().toISOString();
    const allEventsPublished = await supabase.getAll('wiki_events', {
      where: 'status',
      operator: 'eq',
      value: 'published'
    });
    // Filter to only future events
    const upcomingEvents = allEventsPublished.filter(event => {
      const eventDate = new Date(event.event_date);
      return eventDate >= new Date();
    });
    console.log(`  📅 Upcoming Events: ${upcomingEvents.length}`);

    // Update DOM with specific IDs
    const guidesElement = document.getElementById('stat-guides');
    const locationsElement = document.getElementById('stat-locations');
    const eventsElement = document.getElementById('stat-events');

    if (guidesElement) {
      guidesElement.textContent = guidesCount.length;
      console.log('  ✅ Updated guides stat');
    } else {
      console.warn('  ⚠️ Could not find #stat-guides element');
    }

    if (locationsElement) {
      locationsElement.textContent = locationsCount.length;
      console.log('  ✅ Updated locations stat');
    } else {
      console.warn('  ⚠️ Could not find #stat-locations element');
    }

    if (eventsElement) {
      eventsElement.textContent = upcomingEvents.length;
      console.log('  ✅ Updated events stat');
    } else {
      console.warn('  ⚠️ Could not find #stat-events element');
    }

    console.log('✅ Statistics updated successfully');
  } catch (error) {
    console.error('❌ Error updating stats:', error);
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
        ${guide.author_name ? `<span><i class="fas fa-user"></i> ${escapeHtml(guide.author_name)}</span>` : ''}
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
        ${guide.categories.map(cat => {
          const translatedName = wikiI18n.t(`wiki.categories.${cat.slug}`) || escapeHtml(cat.name);
          return `<span class="tag">${translatedName}</span>`;
        }).join('')}
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
 * Render category filters from database
 */
function renderCategoryFilters() {
  const categoryFiltersContainer = document.getElementById('categoryFilters');
  if (!categoryFiltersContainer) return;

  // Keep the "All" button
  let html = '<a href="javascript:void(0)" class="tag category-filter active" data-category="all"><i class="fas fa-th"></i> <span data-i18n="wiki.home.all_categories">All</span></a>';

  // Add categories from database
  allCategories.forEach(category => {
    // Use icon from database or default icon
    const icon = category.icon || '<i class="fas fa-tag"></i>';
    // Use translated category name if available, otherwise fall back to database name
    const translatedName = wikiI18n.t(`wiki.categories.${category.slug}`) || escapeHtml(category.name);
    html += `<a href="javascript:void(0)" class="tag category-filter" data-category="${category.slug}">
      ${icon} <span>${translatedName}</span>
    </a>`;
  });

  // Update the container
  categoryFiltersContainer.innerHTML = html;

  console.log(`✅ Rendered ${allCategories.length} category filters`);
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
          ${guide.author_name ? `<span><i class="fas fa-user"></i> ${escapeHtml(guide.author_name)}</span>` : ''}
          <span><i class="fas fa-eye"></i> ${guide.view_count || 0} views</span>
        </div>
        <h3 class="card-title">
          <a href="wiki-page.html?slug=${escapeHtml(guide.slug || '')}" style="text-decoration: none; color: inherit;">
            ${escapeHtml(guide.title)}
          </a>
        </h3>
        <p class="text-muted">${escapeHtml(guide.summary)}</p>
        <div class="tags">
          ${guide.categories.map(cat => {
            const translatedName = wikiI18n.t(`wiki.categories.${cat.slug}`) || escapeHtml(cat.name);
            return `<span class="tag">${translatedName}</span>`;
          }).join('')}
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
          ${location.author_name ? `<span><i class="fas fa-user"></i> ${escapeHtml(location.author_name)}</span>` : ''}
          <span><i class="fas fa-eye"></i> ${location.view_count || 0} views</span>
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
          ${event.author_name ? `<span><i class="fas fa-user"></i> ${escapeHtml(event.author_name)}</span>` : ''}
          <span><i class="fas fa-eye"></i> ${event.view_count || 0} views</span>
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
        <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
          <button onclick="showEventDetails('${event.id}')" class="btn btn-outline btn-small">
            <i class="fas fa-info-circle"></i> Details
          </button>
          ${event.registration_link ? `
            <a href="${escapeHtml(event.registration_link)}" target="_blank" class="btn btn-primary btn-small">
              <i class="fas fa-ticket-alt"></i> Register
            </a>
          ` : `
            <button onclick="registerForEvent('${event.id}')" class="btn btn-primary btn-small">
              <i class="fas fa-user-plus"></i> Register
            </button>
          `}
        </div>
      </div>
    `;
  });

  guidesGrid.innerHTML = resultsHTML;
}

/**
 * Render upcoming events section with dynamic data
 */
function renderUpcomingEvents() {
  const eventsGrid = document.getElementById('upcomingEventsGrid');
  if (!eventsGrid) return;

  // Filter to get only upcoming events (not past)
  const now = new Date();
  const upcomingEvents = allEvents.filter(event => {
    const eventDate = new Date(event.event_date);
    return eventDate >= now;
  }).slice(0, 6); // Show only first 6 events

  // If no upcoming events
  if (upcomingEvents.length === 0) {
    eventsGrid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
        <i class="fas fa-calendar-times" style="font-size: 2rem; color: var(--wiki-text-muted); margin-bottom: 0.5rem;"></i>
        <h3 style="color: var(--wiki-text-muted);">No upcoming events</h3>
        <p class="text-muted">Check back later or <a href="wiki-editor.html?type=event">create an event</a></p>
      </div>
    `;
    return;
  }

  // Render events
  eventsGrid.innerHTML = upcomingEvents.map(event => {
    const eventDate = new Date(event.event_date);
    const day = eventDate.getDate();
    const month = eventDate.toLocaleDateString('en-US', { month: 'short' });

    // Format time
    let timeStr = '';
    if (event.start_time) {
      timeStr = event.start_time;
      if (event.end_time) {
        timeStr += ` - ${event.end_time}`;
      }
    }

    return `
      <div class="event-card">
        <div class="event-date">
          <div class="event-day">${day}</div>
          <div class="event-month">${month}</div>
        </div>
        <div class="event-details">
          <h3 class="event-title">${escapeHtml(event.title)}</h3>
          <div class="event-info">
            ${timeStr ? `<span><i class="fas fa-clock"></i> ${escapeHtml(timeStr)}</span>` : ''}
            <span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(event.location_name || 'TBD')}</span>
            ${event.author_name ? `<span><i class="fas fa-user"></i> ${escapeHtml(event.author_name)}</span>` : ''}
            <span><i class="fas fa-eye"></i> ${event.view_count || 0} views</span>
          </div>
          <p class="text-muted mt-1">
            ${escapeHtml(event.description || '')}
          </p>
          <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
            <button onclick="showEventDetails('${event.id}')" class="btn btn-outline btn-small">
              <i class="fas fa-info-circle"></i> Details
            </button>
            ${event.registration_url ?
              `<a href="${escapeHtml(event.registration_url)}" target="_blank" rel="noopener" class="btn btn-primary btn-small">
                <i class="fas fa-ticket-alt"></i> Register
              </a>` :
              `<button onclick="showNoRegistrationModal('${escapeHtml(event.title)}')" class="btn btn-outline btn-small">
                <i class="fas fa-info-circle"></i> No Registration Required
              </button>`
            }
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Show event details in a modal
 */
window.showEventDetails = function(eventId) {
  // Find the event
  const event = allEvents.find(e => e.id === eventId);
  if (!event) {
    console.error('Event not found:', eventId);
    return;
  }

  // Create modal HTML
  const eventDate = new Date(event.event_date);
  const dateStr = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Format time
  let timeStr = '';
  if (event.start_time) {
    timeStr = event.start_time;
    if (event.end_time) {
      timeStr += ` - ${event.end_time}`;
    }
  }

  // Create modal container if it doesn't exist
  let modalContainer = document.getElementById('eventModal');
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'eventModal';
    modalContainer.style.cssText = `
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 9999;
      align-items: center;
      justify-content: center;
    `;
    document.body.appendChild(modalContainer);
  }

  // Set modal content
  modalContainer.innerHTML = `
    <div style="
      background: white;
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      border-radius: 12px;
      padding: 2rem;
      position: relative;
    ">
      <button onclick="closeEventModal()" style="
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
      ">&times;</button>

      <h2 style="color: var(--wiki-primary); margin-bottom: 1rem;">${escapeHtml(event.title)}</h2>

      <div style="margin-bottom: 1.5rem; color: #666;">
        <div style="margin-bottom: 0.5rem;">
          <i class="fas fa-calendar"></i> <strong>${dateStr}</strong>
        </div>
        ${timeStr ? `<div style="margin-bottom: 0.5rem;">
          <i class="fas fa-clock"></i> ${escapeHtml(timeStr)}
        </div>` : ''}
        <div style="margin-bottom: 0.5rem;">
          <i class="fas fa-map-marker-alt"></i> ${escapeHtml(event.location_name || 'Location TBD')}
        </div>
        ${event.location_address ? `<div style="margin-bottom: 0.5rem; padding-left: 1.5rem; color: #888;">
          ${escapeHtml(event.location_address)}
        </div>` : ''}
        ${event.price_display ? `<div style="margin-bottom: 0.5rem;">
          <i class="fas fa-tag"></i> ${escapeHtml(event.price_display)}
        </div>` : ''}
        ${event.max_attendees ? `<div style="margin-bottom: 0.5rem;">
          <i class="fas fa-users"></i> Max ${event.max_attendees} attendees
        </div>` : ''}
      </div>

      <div style="margin-bottom: 2rem; line-height: 1.6;">
        ${escapeHtml(event.description || 'No description available.')}
      </div>

      <div style="display: flex; gap: 1rem;">
        ${event.registration_url ? `
          <a href="${escapeHtml(event.registration_url)}" target="_blank" rel="noopener" class="btn btn-primary" style="flex: 1;">
            <i class="fas fa-ticket-alt"></i> Register
          </a>
        ` : `
          <button onclick="registerForEvent('${event.id}')" class="btn btn-primary" style="flex: 1;">
            <i class="fas fa-user-plus"></i> Register
          </button>
        `}
        <button onclick="closeEventModal()" class="btn btn-outline" style="flex: 1;">
          Close
        </button>
      </div>
    </div>
  `;

  // Show modal
  modalContainer.style.display = 'flex';
};

/**
 * Close event modal
 */
window.closeEventModal = function() {
  const modal = document.getElementById('eventModal');
  if (modal) {
    modal.style.display = 'none';
  }
};

/**
 * Handle event registration
 */
window.registerForEvent = async function(eventId) {
  try {
    // Find the event
    const event = allEvents.find(e => e.id === eventId);
    if (!event) {
      alert('Event not found');
      return;
    }

    // If event has a registration URL, redirect to it
    if (event.registration_url) {
      window.open(event.registration_url, '_blank', 'noopener');
      return;
    }

    // Otherwise, show a registration form modal
    const registrationModal = document.createElement('div');
    registrationModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    registrationModal.innerHTML = `
      <div style="
        background: white;
        max-width: 500px;
        width: 90%;
        border-radius: 12px;
        padding: 2rem;
        position: relative;
      ">
        <h3 style="color: var(--wiki-primary); margin-bottom: 1rem;">Register for Event</h3>
        <p style="margin-bottom: 1.5rem; color: #666;">${escapeHtml(event.title)}</p>

        <form id="eventRegistrationForm">
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.25rem; font-weight: 600;">Name *</label>
            <input type="text" id="regName" required style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
          </div>

          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.25rem; font-weight: 600;">Email *</label>
            <input type="email" id="regEmail" required style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; margin-bottom: 0.25rem; font-weight: 600;">Message (optional)</label>
            <textarea id="regMessage" rows="3" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;"></textarea>
          </div>

          <div style="display: flex; gap: 1rem;">
            <button type="submit" class="btn btn-primary" style="flex: 1;">Submit Registration</button>
            <button type="button" onclick="this.closest('[style*=\\"position: fixed\\"]').remove()" class="btn btn-outline" style="flex: 1;">Cancel</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(registrationModal);

    // Handle form submission
    document.getElementById('eventRegistrationForm').onsubmit = async (e) => {
      e.preventDefault();

      const name = document.getElementById('regName').value;
      const email = document.getElementById('regEmail').value;
      const message = document.getElementById('regMessage').value;

      // Validate email
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        alert('Please enter a valid email address');
        return;
      }

      // Save registration to database
      try {
        console.log('Registering for event:', {
          event_id: eventId,
          event_title: event.title,
          user_email: email,
          registered_at: new Date().toISOString()
        });

        // Call the registration function via RPC
        const { data, error } = await supabase.client
          .rpc('register_for_event', {
            p_event_id: eventId,
            p_user_email: email,
            p_user_id: null, // Will be replaced with actual auth when implemented
            p_user_name: null
          });

        if (error) {
          throw error;
        }

        // Check result
        if (data && data.success) {
          if (data.status === 'waitlisted') {
            alert(`Added to waitlist for "${event.title}"!\n\nYou will be notified via email at ${email} if a spot becomes available.`);
          } else {
            alert(`Successfully registered for "${event.title}"!\n\nA confirmation email will be sent to ${email}.`);
          }
        } else {
          alert(data?.message || 'Registration failed. Please try again.');
        }

        // Close the modal
        registrationModal.remove();
      } catch (error) {
        console.error('Error during registration:', error);
        alert('Failed to register. Please try again.');
      }
    }; // End of form onsubmit handler

  } catch (error) {
    console.error('Error registering for event:', error);
    alert('Failed to register for event. Please try again.');
  }
};

/**
 * Get icon for location type
 */
function getLocationIcon(locationType) {
  const icons = {
    'farm': '🌳',
    'garden': '🌱',
    'education': '🎓',
    'community': '🏘️',
    'business': '🏪',
    'homestead': '🏡',
    'seed_library': '🌻',
    'natural_building': '🏗️',
    'other': '📍'
  };
  return icons[locationType] || icons.other;
}

/**
 * Render featured locations section with dynamic data
 */
function renderFeaturedLocations() {
  const featuredGrid = document.getElementById('featuredLocationsGrid');
  if (!featuredGrid) {
    console.log('ℹ️ Featured locations grid not found, skipping render');
    return;
  }

  console.log('🏘️ Rendering featured locations...');

  // Take first 6 locations, or use is_featured flag if available
  const featuredLocations = allLocations.slice(0, 6);

  // If no locations
  if (featuredLocations.length === 0) {
    featuredGrid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
        <i class="fas fa-map-marker-alt" style="font-size: 2rem; color: var(--wiki-text-muted); margin-bottom: 0.5rem;"></i>
        <h3 style="color: var(--wiki-text-muted);">No locations yet</h3>
        <p class="text-muted">Check back later or <a href="wiki-editor.html?type=location">add a location</a></p>
      </div>
    `;
    return;
  }

  // Render location cards
  featuredGrid.innerHTML = featuredLocations.map(location => {
    const icon = getLocationIcon(location.location_type);
    const description = location.description || 'No description available';

    return `
      <div class="card">
        <h3 style="margin-bottom: 0.5rem;">${icon} ${escapeHtml(location.name)}</h3>
        <p class="text-muted" style="font-size: 0.9rem; margin-bottom: 0.5rem;">
          ${escapeHtml(description)}
        </p>
        <div style="font-size: 0.85rem; color: var(--wiki-text-muted);">
          <i class="fas fa-map-marker-alt"></i> ${escapeHtml(location.location_type || 'Location')}
        </div>
        <a href="wiki-map.html#location-${location.id}" class="btn btn-outline btn-small mt-2" style="width: 100%;">View on Map</a>
      </div>
    `;
  }).join('');

  console.log(`✅ Rendered ${featuredLocations.length} featured locations`);
}

/**
 * Show "No Registration Required" modal
 */
window.showNoRegistrationModal = function(eventTitle) {
  const modalHTML = `
    <div id="noRegModal" style="
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      z-index: 10000;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        background: white;
        color: #333;
        padding: 2rem;
        width: 90%;
        max-width: 500px;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        text-align: center;
        position: relative;
      ">
        <button onclick="closeNoRegModal()" style="
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
        ">&times;</button>

        <div style="font-size: 3rem; color: var(--wiki-primary); margin-bottom: 1rem;">
          <i class="fas fa-info-circle"></i>
        </div>

        <h2 style="margin-bottom: 1rem;">No Registration Required</h2>

        <p style="color: #666; margin-bottom: 1.5rem; line-height: 1.6;">
          <strong>${escapeHtml(eventTitle)}</strong> is a free event that doesn't require advance registration.
          Simply show up at the scheduled time!
        </p>

        <button onclick="closeNoRegModal()" class="btn btn-primary">
          Got it
        </button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Close modal on background click
  document.getElementById('noRegModal').addEventListener('click', function(e) {
    if (e.target.id === 'noRegModal') {
      closeNoRegModal();
    }
  });
};

/**
 * Close no registration modal
 */
window.closeNoRegModal = function() {
  const modal = document.getElementById('noRegModal');
  if (modal) {
    modal.remove();
  }
};
