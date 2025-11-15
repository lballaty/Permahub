/**
 * Wiki Map Page - Display Locations from Database
 * Fetches real locations from Supabase and displays them on an interactive map
 */

import { supabase } from '../../js/supabase-client.js';
import { displayVersionInHeader, VERSION_DISPLAY } from '../../js/version.js';

// State
let currentFilter = 'all';
let allLocations = [];
let map = null;
let markers = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
  console.log(`🚀 Wiki Map ${VERSION_DISPLAY}: DOMContentLoaded - Starting initialization`);

  // Display version in header
  displayVersionInHeader();

  // Initialize map first
  initializeMap();

  // Load locations from database
  await loadLocations();

  // Initialize filters
  initializeLocationFilters();

  // Initialize search
  initializeLocationSearch();

  // Check if we need to zoom to a specific location
  handleLocationHash();

  // Handle hash changes
  window.addEventListener('hashchange', handleLocationHash);

  console.log(`✅ Wiki Map ${VERSION_DISPLAY}: Initialization complete`);
});

/**
 * Initialize Leaflet map
 */
function initializeMap() {
  console.log('🗺️ Initializing Leaflet map...');

  // Initialize map centered on a default location
  map = L.map('map').setView([40.7128, -74.0060], 10);

  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);

  console.log('✅ Map initialized');
}

/**
 * Load locations from database
 */
async function loadLocations() {
  try {
    console.log('📍 Loading locations from database...');
    showLoading();

    // Fetch all published locations
    console.log('🔍 Fetching published locations from wiki_locations table...');
    allLocations = await supabase.getAll('wiki_locations', {
      where: 'status',
      operator: 'eq',
      value: 'published',
      order: 'name.asc'
    });

    console.log(`✅ Loaded ${allLocations.length} locations from database`);
    console.log('📋 Location names:', allLocations.map(l => l.name));

    // Render locations on map and list
    renderLocations();

    // Fit map to show all locations
    if (allLocations.length > 0) {
      fitMapToLocations();
    }

    console.log('✨ Locations load complete!');
  } catch (error) {
    console.error('❌ Error loading locations:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    showError('Failed to load locations. Please refresh the page.');
  }
}

/**
 * Render locations on map and in list
 */
function renderLocations() {
  // Clear existing markers
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  // Filter locations based on current filter
  const filteredLocations = allLocations.filter(location => {
    if (currentFilter === 'all') return true;
    return location.location_type === currentFilter;
  });

  console.log(`📊 Rendering ${filteredLocations.length} locations (filtered from ${allLocations.length} total)`);

  // Add markers to map
  filteredLocations.forEach(location => {
    if (location.latitude && location.longitude) {
      // Choose icon based on type
      const icon = getLocationIcon(location.location_type);

      // Create marker
      const marker = L.marker([location.latitude, location.longitude], {
        icon: L.divIcon({
          html: `<div style="font-size: 24px;">${icon}</div>`,
          className: 'custom-div-icon',
          iconSize: [30, 42],
          iconAnchor: [15, 42]
        })
      }).addTo(map);

      // Store location reference in marker for easier access
      marker.locationId = location.id;

      // Add popup
      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0;">${escapeHtml(location.name)}</h3>
          ${location.description ? `<p style="margin: 8px 0; color: #666;">${escapeHtml(location.description)}</p>` : ''}
          ${location.address ? `<p style="margin: 4px 0; font-size: 0.9em;"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(location.address)}</p>` : ''}
          ${location.website ? `<p style="margin: 4px 0;"><a href="${escapeHtml(location.website)}" target="_blank" rel="noopener">Visit Website</a></p>` : ''}
        </div>
      `);

      markers.push(marker);
    }
  });

  // Render location list
  renderLocationList(filteredLocations);

  // Update stats
  updateLocationStats(filteredLocations);
}

/**
 * Render location list for mobile view
 */
function renderLocationList(locations) {
  const locationList = document.getElementById('locationList');

  if (!locationList) {
    console.warn('⚠️ locationList element not found');
    return;
  }

  // Update location count in header
  const locationCountElement = document.getElementById('locationCount');
  if (locationCountElement) {
    locationCountElement.textContent = locations.length;
  }

  if (locations.length === 0) {
    locationList.innerHTML = `
      <div class="card" style="text-align: center; padding: 2rem;">
        <i class="fas fa-map-marker-alt" style="font-size: 3rem; color: var(--wiki-text-muted); margin-bottom: 1rem;"></i>
        <h3 style="color: var(--wiki-text-muted);">No locations found</h3>
        <p class="text-muted">Try selecting a different filter or check back later</p>
      </div>
    `;
    return;
  }

  locationList.innerHTML = locations.map(location => {
    const distance = calculateDistance(location.latitude, location.longitude);
    const icon = getLocationIcon(location.location_type);

    return `
      <div class="location-item" data-location-id="${location.id}" data-lat="${location.latitude}" data-lng="${location.longitude}">
        <div class="location-icon">${icon}</div>
        <div class="location-details">
          <h3>${escapeHtml(location.name)}</h3>
          <p>${location.description ? escapeHtml(location.description) : ''}</p>
          <div class="location-meta">
            <span><i class="fas fa-map-marker-alt"></i> ${distance}</span>
            ${location.website ? `<a href="${escapeHtml(location.website)}" target="_blank" rel="noopener">Website</a>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Add click handlers to location items
  document.querySelectorAll('.location-item').forEach(item => {
    item.addEventListener('click', function() {
      const locationId = this.dataset.locationId;
      const lat = parseFloat(this.dataset.lat);
      const lng = parseFloat(this.dataset.lng);

      // Zoom to location on map (higher zoom for better detail)
      map.setView([lat, lng], 16);

      // Find and open marker popup using locationId
      const marker = markers.find(m => m.locationId === locationId);

      if (marker) {
        marker.openPopup();
      }

      // Scroll to map on mobile
      if (window.innerWidth <= 768) {
        document.getElementById('map').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/**
 * Update location statistics
 */
function updateLocationStats(locations) {
  // Count by type
  const typeCounts = {};
  locations.forEach(loc => {
    const type = loc.location_type || 'other';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  // Update stat displays if elements exist
  const totalElement = document.querySelector('[data-stat="total"]');
  if (totalElement) {
    totalElement.textContent = locations.length;
  }

  // Update type-specific counts if displayed
  Object.keys(typeCounts).forEach(type => {
    const element = document.querySelector(`[data-stat="${type}"]`);
    if (element) {
      element.textContent = typeCounts[type];
    }
  });
}

/**
 * Fit map to show all locations
 */
function fitMapToLocations() {
  if (markers.length === 0) return;

  const group = new L.featureGroup(markers);
  map.fitBounds(group.getBounds().pad(0.1));
}

/**
 * Get icon for location type
 */
function getLocationIcon(type) {
  const icons = {
    'farm': '🌾',
    'garden': '🌻',
    'education': '🎓',
    'community': '🏘️',
    'business': '🏪',
    'market': '🛒',
    'nursery': '🌱',
    'ecovillage': '🏡'
  };

  return icons[type] || '📍';
}

/**
 * Calculate distance from user location or default (Funchal, Madeira)
 */
function calculateDistance(lat, lng) {
  // Default location: Funchal, Madeira
  const defaultLat = 32.6669;
  const defaultLng = -16.9241;

  // TODO: When auth is implemented, use user's configured location
  // For now, use Funchal as the default
  const userLat = defaultLat;
  const userLng = defaultLng;

  // Haversine formula to calculate distance between two points
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat - userLat);
  const dLng = toRadians(lng - userLng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(userLat)) * Math.cos(toRadians(lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Format distance
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m away`;
  } else if (distance < 10) {
    return `${distance.toFixed(1)} km from Funchal`;
  } else {
    return `${Math.round(distance)} km from Funchal`;
  }
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Initialize location type filters
 */
function initializeLocationFilters() {
  const filterButtons = document.querySelectorAll('[data-filter]');

  filterButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();

      // Update active state
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      // Update current filter
      currentFilter = this.dataset.filter;

      console.log(`🔍 Filter changed to: ${currentFilter}`);

      // Re-render locations
      renderLocations();
    });
  });
}

/**
 * Initialize location search
 */
function initializeLocationSearch() {
  const searchInput = document.getElementById('locationSearch');

  if (!searchInput) return;

  searchInput.addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();

    if (query.length === 0) {
      renderLocations();
      return;
    }

    // Filter locations by name or description
    const filtered = allLocations.filter(location => {
      const matchesFilter = currentFilter === 'all' || location.location_type === currentFilter;
      const matchesSearch =
        location.name.toLowerCase().includes(query) ||
        (location.description && location.description.toLowerCase().includes(query)) ||
        (location.address && location.address.toLowerCase().includes(query));

      return matchesFilter && matchesSearch;
    });

    console.log(`🔍 Search for "${query}" found ${filtered.length} results`);

    // Clear and re-add markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Add filtered markers
    filtered.forEach(location => {
      if (location.latitude && location.longitude) {
        const icon = getLocationIcon(location.type);
        const marker = L.marker([location.latitude, location.longitude], {
          icon: L.divIcon({
            html: `<div style="font-size: 24px;">${icon}</div>`,
            className: 'custom-div-icon',
            iconSize: [30, 42],
            iconAnchor: [15, 42]
          })
        }).addTo(map);

        marker.bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0;">${escapeHtml(location.name)}</h3>
            ${location.description ? `<p style="margin: 8px 0; color: #666;">${escapeHtml(location.description)}</p>` : ''}
            ${location.website ? `<p style="margin: 4px 0;"><a href="${escapeHtml(location.website)}" target="_blank" rel="noopener">Visit Website</a></p>` : ''}
          </div>
        `);

        markers.push(marker);
      }
    });

    // Update list
    renderLocationList(filtered);

    // Fit map if we have results
    if (filtered.length > 0) {
      fitMapToLocations();
    }
  });
}

/**
 * Show loading state
 */
function showLoading() {
  const locationList = document.getElementById('locationList');
  if (locationList) {
    locationList.innerHTML = `
      <div class="card" style="text-align: center; padding: 2rem;">
        <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: var(--wiki-primary); margin-bottom: 1rem;"></i>
        <h3 style="color: var(--wiki-text-muted);">Loading locations...</h3>
      </div>
    `;
  }
}

/**
 * Show error message
 */
function showError(message) {
  const locationList = document.getElementById('locationList');
  if (locationList) {
    locationList.innerHTML = `
      <div class="card" style="text-align: center; padding: 2rem;">
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

// Handle view toggle for mobile
const toggleMapBtn = document.getElementById('toggleMapView');
const toggleListBtn = document.getElementById('toggleListView');

if (toggleMapBtn) {
  toggleMapBtn.addEventListener('click', function() {
    document.querySelector('.map-container').style.display = 'block';
    document.getElementById('locationList').style.display = 'none';
    map.invalidateSize();
  });
}

if (toggleListBtn) {
  toggleListBtn.addEventListener('click', function() {
    document.querySelector('.map-container').style.display = 'none';
    document.getElementById('locationList').style.display = 'block';
  });
}

/**
 * Handle location hash in URL to zoom to specific location
 */
function handleLocationHash() {
  const hash = window.location.hash;

  if (hash && hash.startsWith('#location-')) {
    const locationId = hash.replace('#location-', '');
    console.log(`🎯 Zooming to location ID: ${locationId}`);

    // Find the location
    const location = allLocations.find(loc => loc.id === locationId);

    if (location && location.latitude && location.longitude) {
      console.log(`📍 Found location: ${location.name} at ${location.latitude}, ${location.longitude}`);

      // Wait a moment for map to be ready
      setTimeout(() => {
        // Zoom to the location
        map.setView([location.latitude, location.longitude], 16);

        // Find and open the marker popup
        const marker = markers.find(m => m.locationId === locationId);

        if (marker) {
          marker.openPopup();
          console.log(`✅ Opened popup for ${location.name}`);
        }

        // Highlight the location in the list and scroll to top
        const locationItem = document.querySelector(`[data-location-id="${locationId}"]`);
        if (locationItem) {
          // Scroll the location to the top of the list
          const locationList = document.getElementById('locationList');
          if (locationList) {
            // Move the clicked location to the top of the list visually
            const parent = locationItem.parentNode;
            parent.insertBefore(locationItem, parent.firstChild);

            // Scroll the list container to top
            locationList.scrollTop = 0;

            // Also scroll the page to show the map
            document.querySelector('.map-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }

          // Highlight with background color
          locationItem.style.backgroundColor = 'var(--wiki-primary-light, #e8f5e9)';
          locationItem.style.transition = 'background-color 0.5s ease';
          setTimeout(() => {
            locationItem.style.backgroundColor = '';
          }, 3000);
        }
      }, 500);
    } else {
      console.warn(`⚠️ Location not found or missing coordinates: ${locationId}`);
    }
  }
}