/**
 * Wiki Favorites Page - Display User's Saved Content from Database
 * Fetches and displays saved guides, events, locations, and collections
 */

import { supabase } from '../../js/supabase-client.js';
import { displayVersionBadge, VERSION_DISPLAY } from "../js/version-manager.js"';

// State
let currentTab = 'all';
let currentSort = 'recently-added';
let userFavorites = [];
let userCollections = [];
let allGuides = [];
let allEvents = [];
let allLocations = [];
let currentUserId = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
  console.log(`🚀 Wiki Favorites ${VERSION_DISPLAY}: DOMContentLoaded - Starting initialization`);

  // Display version in header
  displayVersionBadge();

  // Check authentication
  const isAuthenticated = await checkAuthentication();
  if (!isAuthenticated) {
    showAuthenticationRequired();
    return;
  }

  // Load user's favorites and collections from database
  await loadUserFavorites();
  await loadUserCollections();

  // Initialize tabs
  initializeTabs();

  // Initialize sort
  initializeSort();

  // Initialize export
  initializeExport();

  // Render initial view
  renderFavorites();

  console.log(`✅ Wiki Favorites ${VERSION_DISPLAY}: Initialization complete`);
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
  const mainContent = document.querySelector('main.wiki-container');
  if (mainContent) {
    mainContent.innerHTML = `
      <div class="card" style="text-align: center; padding: 3rem; margin-top: 2rem;">
        <i class="fas fa-lock" style="font-size: 3rem; color: var(--wiki-text-muted); margin-bottom: 1rem;"></i>
        <h2 style="color: var(--wiki-text-muted); margin-bottom: 1rem;">Authentication Required</h2>
        <p class="text-muted" style="margin-bottom: 2rem;">
          You need to be logged in to view your favorites.
        </p>
        <a href="wiki-login.html" class="btn btn-primary">
          <i class="fas fa-sign-in-alt"></i> Log In
        </a>
      </div>
    `;
  }
}

/**
 * Load user's favorites from database
 */
async function loadUserFavorites() {
  try {
    console.log('⭐ Loading user favorites from database...');

    // Fetch user's favorites
    userFavorites = await supabase.getAll('wiki_favorites', {
      where: 'user_id',
      operator: 'eq',
      value: currentUserId,
      order: 'created_at.desc'
    });

    console.log(`✅ Loaded ${userFavorites.length} favorites from database`);

    // If no favorites, create some sample favorites for testing
    if (userFavorites.length === 0) {
      console.log('📌 No favorites found - creating sample favorites for testing...');
      await createSampleFavorites();
      // Reload favorites
      userFavorites = await supabase.getAll('wiki_favorites', {
        where: 'user_id',
        operator: 'eq',
        value: currentUserId,
        order: 'created_at.desc'
      });
    }

    // Load the actual content for each favorite
    await loadFavoriteContent();

  } catch (error) {
    console.error('❌ Error loading favorites:', error);
    showError('Failed to load your favorites. Please refresh the page.');
  }
}

/**
 * Create sample favorites for testing
 */
async function createSampleFavorites() {
  try {
    // Get some guides to favorite
    const guides = await supabase.getAll('wiki_guides', {
      where: 'status',
      operator: 'eq',
      value: 'published',
      order: 'published_at.desc'
    });

    // Get some events to favorite
    const events = await supabase.getAll('wiki_events', {
      where: 'status',
      operator: 'eq',
      value: 'published',
      order: 'date.asc'
    });

    // Get some locations to favorite
    const locations = await supabase.getAll('wiki_locations', {
      where: 'status',
      operator: 'eq',
      value: 'published',
      order: 'name.asc'
    });

    // Create sample favorites
    const sampleFavorites = [];

    // Add first 3 guides
    guides.slice(0, 3).forEach(guide => {
      sampleFavorites.push({
        user_id: currentUserId,
        content_type: 'guide',
        content_id: guide.id
      });
    });

    // Add first 2 events
    events.slice(0, 2).forEach(event => {
      sampleFavorites.push({
        user_id: currentUserId,
        content_type: 'event',
        content_id: event.id
      });
    });

    // Add first 2 locations
    locations.slice(0, 2).forEach(location => {
      sampleFavorites.push({
        user_id: currentUserId,
        content_type: 'location',
        content_id: location.id
      });
    });

    // Insert favorites
    for (const favorite of sampleFavorites) {
      await supabase.create('wiki_favorites', favorite);
    }

    console.log(`✅ Created ${sampleFavorites.length} sample favorites for testing`);

  } catch (error) {
    console.error('Error creating sample favorites:', error);
  }
}

/**
 * Load the actual content for each favorite
 */
async function loadFavoriteContent() {
  try {
    // Get unique content IDs for each type
    const guideIds = userFavorites.filter(f => f.content_type === 'guide').map(f => f.content_id);
    const eventIds = userFavorites.filter(f => f.content_type === 'event').map(f => f.content_id);
    const locationIds = userFavorites.filter(f => f.content_type === 'location').map(f => f.content_id);

    // Load guides
    if (guideIds.length > 0) {
      allGuides = await Promise.all(guideIds.map(async (id) => {
        const guides = await supabase.getAll('wiki_guides', {
          where: 'id',
          operator: 'eq',
          value: id
        });
        return guides[0];
      }));
      allGuides = allGuides.filter(g => g);
    }

    // Load events
    if (eventIds.length > 0) {
      allEvents = await Promise.all(eventIds.map(async (id) => {
        const events = await supabase.getAll('wiki_events', {
          where: 'id',
          operator: 'eq',
          value: id
        });
        return events[0];
      }));
      allEvents = allEvents.filter(e => e);
    }

    // Load locations
    if (locationIds.length > 0) {
      allLocations = await Promise.all(locationIds.map(async (id) => {
        const locations = await supabase.getAll('wiki_locations', {
          where: 'id',
          operator: 'eq',
          value: id
        });
        return locations[0];
      }));
      allLocations = allLocations.filter(l => l);
    }

    console.log(`📚 Loaded content: ${allGuides.length} guides, ${allEvents.length} events, ${allLocations.length} locations`);

  } catch (error) {
    console.error('Error loading favorite content:', error);
  }
}

/**
 * Load user's collections from database
 */
async function loadUserCollections() {
  try {
    console.log('📁 Loading user collections from database...');

    // Fetch user's collections
    userCollections = await supabase.getAll('wiki_collections', {
      where: 'user_id',
      operator: 'eq',
      value: currentUserId,
      order: 'created_at.desc'
    });

    console.log(`✅ Loaded ${userCollections.length} collections from database`);

    // If no collections, create some sample collections
    if (userCollections.length === 0) {
      console.log('📌 No collections found - creating sample collections...');
      await createSampleCollections();
      // Reload collections
      userCollections = await supabase.getAll('wiki_collections', {
        where: 'user_id',
        operator: 'eq',
        value: currentUserId,
        order: 'created_at.desc'
      });
    }

  } catch (error) {
    console.error('❌ Error loading collections:', error);
  }
}

/**
 * Create sample collections
 */
async function createSampleCollections() {
  try {
    const sampleCollections = [
      {
        user_id: currentUserId,
        name: 'Water Management',
        description: 'Everything about swales, ponds, and irrigation',
        icon: '💧'
      },
      {
        user_id: currentUserId,
        name: 'Garden Planning',
        description: 'Guides for planning my garden this season',
        icon: '🌱'
      }
    ];

    for (const collection of sampleCollections) {
      await supabase.create('wiki_collections', collection);
    }

    console.log(`✅ Created ${sampleCollections.length} sample collections`);

  } catch (error) {
    console.error('Error creating sample collections:', error);
  }
}

/**
 * Initialize tab switching
 */
function initializeTabs() {
  const tabs = document.querySelectorAll('.favorites-tab');

  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Update active state
      tabs.forEach(t => {
        t.classList.remove('active');
        t.style.borderBottomColor = 'transparent';
        t.style.color = 'var(--wiki-text-muted)';
      });
      this.classList.add('active');
      this.style.borderBottomColor = 'var(--wiki-primary)';
      this.style.color = 'var(--wiki-primary)';

      // Update current tab
      currentTab = this.dataset.tab;

      // Show/hide collections view
      const collectionsView = document.getElementById('collectionsView');
      const guidesView = document.getElementById('guidesView');

      if (currentTab === 'collections') {
        collectionsView.style.display = 'block';
        guidesView.style.display = 'none';
      } else {
        collectionsView.style.display = 'none';
        guidesView.style.display = 'block';
      }

      // Re-render content
      renderFavorites();
    });
  });
}

/**
 * Initialize sort functionality
 */
function initializeSort() {
  const sortBy = document.getElementById('sortBy');
  if (!sortBy) return;

  sortBy.addEventListener('change', function() {
    currentSort = this.value.toLowerCase().replace(' ', '-');
    renderFavorites();
  });
}

/**
 * Initialize export functionality
 */
function initializeExport() {
  const exportBtn = document.getElementById('exportBtn');
  if (!exportBtn) return;

  exportBtn.addEventListener('click', function() {
    exportFavorites();
  });
}

/**
 * Render favorites based on current tab and sort
 */
function renderFavorites() {
  const guidesView = document.getElementById('guidesView');
  if (!guidesView) return;

  // Filter content based on current tab
  let filteredGuides = allGuides;
  let filteredEvents = allEvents;
  let filteredLocations = allLocations;

  if (currentTab === 'guides') {
    filteredEvents = [];
    filteredLocations = [];
  } else if (currentTab === 'events') {
    filteredGuides = [];
    filteredLocations = [];
  } else if (currentTab === 'locations') {
    filteredGuides = [];
    filteredEvents = [];
  }

  // Update tab counts
  updateTabCounts();

  // Update stats
  updateStats();

  // Render content
  let html = '';

  // Render guides
  if (filteredGuides.length > 0) {
    html += `
      <div class="flex-between mb-2">
        <h2>Saved Guides</h2>
        <a href="#" class="text-muted" style="font-size: 0.9rem;">
          <i class="fas fa-filter"></i> Filter
        </a>
      </div>
      <div class="grid grid-2">
        ${filteredGuides.map(guide => renderGuideCard(guide)).join('')}
      </div>
    `;
  }

  // Render events
  if (filteredEvents.length > 0) {
    html += `
      <div class="flex-between mb-2" style="margin-top: 2rem;">
        <h2>Saved Events</h2>
      </div>
      <div class="grid grid-2">
        ${filteredEvents.map(event => renderEventCard(event)).join('')}
      </div>
    `;
  }

  // Render locations
  if (filteredLocations.length > 0) {
    html += `
      <div class="flex-between mb-2" style="margin-top: 2rem;">
        <h2>Saved Locations</h2>
      </div>
      <div class="grid grid-3">
        ${filteredLocations.map(location => renderLocationCard(location)).join('')}
      </div>
    `;
  }

  // Show empty state if no favorites
  if (filteredGuides.length === 0 && filteredEvents.length === 0 && filteredLocations.length === 0) {
    html = `
      <div class="card" style="text-align: center; padding: 3rem;">
        <i class="fas fa-star" style="font-size: 3rem; color: var(--wiki-text-muted); margin-bottom: 1rem;"></i>
        <h3 style="color: var(--wiki-text-muted);">No favorites yet</h3>
        <p class="text-muted">Start saving guides, events, and locations to see them here</p>
        <a href="wiki-home.html" class="btn btn-primary" style="margin-top: 1rem;">
          <i class="fas fa-compass"></i> Explore Content
        </a>
      </div>
    `;
  }

  guidesView.innerHTML = html;
}

/**
 * Render a guide card
 */
function renderGuideCard(guide) {
  const favorite = userFavorites.find(f => f.content_id === guide.id && f.content_type === 'guide');
  const savedDate = favorite ? new Date(favorite.created_at) : new Date();
  const daysAgo = Math.floor((new Date() - savedDate) / (1000 * 60 * 60 * 24));

  return `
    <div class="card" style="position: relative;">
      <button class="btn btn-outline btn-small" style="position: absolute; top: 1rem; right: 1rem; padding: 0.5rem; width: 40px; height: 40px;" onclick="removeFavorite('guide', '${guide.id}')">
        <i class="fas fa-star" style="color: #ffc107;"></i>
      </button>
      <div class="card-meta">
        <span><i class="fas fa-user"></i> Community</span>
        <span><i class="fas fa-calendar"></i> Saved ${daysAgo} days ago</span>
      </div>
      <h3 class="card-title">
        <a href="wiki-page.html?slug=${escapeHtml(guide.slug)}" style="text-decoration: none; color: inherit;">
          ${escapeHtml(guide.title)}
        </a>
      </h3>
      <p class="text-muted">
        ${escapeHtml(guide.summary)}
      </p>
    </div>
  `;
}

/**
 * Render an event card
 */
function renderEventCard(event) {
  const favorite = userFavorites.find(f => f.content_id === event.id && f.content_type === 'event');
  const savedDate = favorite ? new Date(favorite.created_at) : new Date();
  const daysAgo = Math.floor((new Date() - savedDate) / (1000 * 60 * 60 * 24));

  return `
    <div class="card" style="position: relative;">
      <button class="btn btn-outline btn-small" style="position: absolute; top: 1rem; right: 1rem; padding: 0.5rem; width: 40px; height: 40px;" onclick="removeFavorite('event', '${event.id}')">
        <i class="fas fa-star" style="color: #ffc107;"></i>
      </button>
      <div class="card-meta">
        <span><i class="fas fa-calendar"></i> ${formatDate(event.date)}</span>
        <span><i class="fas fa-clock"></i> ${event.time}</span>
      </div>
      <h3 class="card-title">${escapeHtml(event.title)}</h3>
      <p class="text-muted">${escapeHtml(event.description)}</p>
      <div class="tags">
        <span class="tag"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(event.location)}</span>
      </div>
    </div>
  `;
}

/**
 * Render a location card
 */
function renderLocationCard(location) {
  const favorite = userFavorites.find(f => f.content_id === location.id && f.content_type === 'location');
  const savedDate = favorite ? new Date(favorite.created_at) : new Date();
  const daysAgo = Math.floor((new Date() - savedDate) / (1000 * 60 * 60 * 24));

  return `
    <div class="card" style="position: relative;">
      <button class="btn btn-outline btn-small" style="position: absolute; top: 1rem; right: 1rem; padding: 0.5rem; width: 40px; height: 40px;" onclick="removeFavorite('location', '${location.id}')">
        <i class="fas fa-star" style="color: #ffc107;"></i>
      </button>
      <h3 style="margin-bottom: 0.5rem;">${escapeHtml(location.name)}</h3>
      <p class="text-muted" style="font-size: 0.9rem;">
        ${location.description ? escapeHtml(location.description) : 'No description available'}
      </p>
      ${location.address ? `
        <p style="font-size: 0.85rem; color: var(--wiki-text-muted); margin-top: 0.5rem;">
          <i class="fas fa-map-marker-alt"></i> ${escapeHtml(location.address)}
        </p>
      ` : ''}
      <a href="wiki-map.html#location-${location.id}" class="btn btn-outline btn-small" style="margin-top: 1rem;">
        <i class="fas fa-map"></i> View on Map
      </a>
    </div>
  `;
}

/**
 * Update tab counts
 */
function updateTabCounts() {
  const tabs = document.querySelectorAll('.favorites-tab');

  tabs.forEach(tab => {
    const type = tab.dataset.tab;
    let count = 0;
    let label = '';

    if (type === 'all') {
      count = allGuides.length + allEvents.length + allLocations.length;
      label = `All (${count})`;
    } else if (type === 'guides') {
      count = allGuides.length;
      label = `<i class="fas fa-book"></i> Guides (${count})`;
    } else if (type === 'events') {
      count = allEvents.length;
      label = `<i class="fas fa-calendar"></i> Events (${count})`;
    } else if (type === 'locations') {
      count = allLocations.length;
      label = `<i class="fas fa-map-marker-alt"></i> Locations (${count})`;
    } else if (type === 'collections') {
      count = userCollections.length;
      label = `<i class="fas fa-folder"></i> Collections (${count})`;
    }

    tab.innerHTML = label;
  });
}

/**
 * Update statistics
 */
function updateStats() {
  const statsContainer = document.querySelector('.card > div[style*="grid-template-columns"]');
  if (!statsContainer) return;

  statsContainer.innerHTML = `
    <div>
      <div style="font-size: 2rem; font-weight: bold; color: var(--wiki-primary);">${allGuides.length}</div>
      <div class="text-muted">Saved Guides</div>
    </div>
    <div>
      <div style="font-size: 2rem; font-weight: bold; color: var(--wiki-secondary);">${allLocations.length}</div>
      <div class="text-muted">Saved Locations</div>
    </div>
    <div>
      <div style="font-size: 2rem; font-weight: bold; color: var(--wiki-accent);">${allEvents.length}</div>
      <div class="text-muted">Upcoming Events</div>
    </div>
    <div>
      <div style="font-size: 2rem; font-weight: bold; color: var(--wiki-primary);">${userCollections.length}</div>
      <div class="text-muted">Collections</div>
    </div>
  `;
}

/**
 * Remove favorite
 */
window.removeFavorite = async function(contentType, contentId) {
  try {
    // Find the favorite
    const favorite = userFavorites.find(f => f.content_id === contentId && f.content_type === contentType);

    if (!favorite) {
      console.error('Favorite not found');
      return;
    }

    // Remove from database
    await supabase.delete('wiki_favorites', favorite.id);

    // Remove from local arrays
    userFavorites = userFavorites.filter(f => f.id !== favorite.id);

    if (contentType === 'guide') {
      allGuides = allGuides.filter(g => g.id !== contentId);
    } else if (contentType === 'event') {
      allEvents = allEvents.filter(e => e.id !== contentId);
    } else if (contentType === 'location') {
      allLocations = allLocations.filter(l => l.id !== contentId);
    }

    // Re-render
    renderFavorites();

    console.log(`✅ Removed ${contentType} from favorites`);

  } catch (error) {
    console.error('Error removing favorite:', error);
    alert('Failed to remove favorite. Please try again.');
  }
};

/**
 * Export favorites to JSON
 */
function exportFavorites() {
  const exportData = {
    exported_at: new Date().toISOString(),
    user_id: currentUserId,
    favorites: {
      guides: allGuides.map(g => ({
        title: g.title,
        slug: g.slug,
        summary: g.summary,
        url: `${window.location.origin}/wiki-page.html?slug=${g.slug}`
      })),
      events: allEvents.map(e => ({
        title: e.title,
        date: e.date,
        time: e.time,
        location: e.location,
        description: e.description
      })),
      locations: allLocations.map(l => ({
        name: l.name,
        description: l.description,
        address: l.address,
        latitude: l.latitude,
        longitude: l.longitude,
        website: l.website
      }))
    },
    collections: userCollections.map(c => ({
      name: c.name,
      description: c.description,
      icon: c.icon
    }))
  };

  // Convert to JSON
  const json = JSON.stringify(exportData, null, 2);

  // Create blob
  const blob = new Blob([json], { type: 'application/json' });

  // Create download link
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wiki-favorites-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log('✅ Favorites exported successfully');
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Show error message
 */
function showError(message) {
  const guidesView = document.getElementById('guidesView');
  if (guidesView) {
    guidesView.innerHTML = `
      <div class="card" style="text-align: center; padding: 3rem;">
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e63946; margin-bottom: 1rem;"></i>
        <h3 style="color: var(--wiki-text-muted);">Error</h3>
        <p class="text-muted">${escapeHtml(message)}</p>
      </div>
    `;
  }
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