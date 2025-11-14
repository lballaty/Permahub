/**
 * Wiki Events Page - Display Events from Database
 * Fetches real events from Supabase and displays them with filtering
 */

import { supabase } from '../../js/supabase-client.js';
import { displayVersionInHeader, VERSION_DISPLAY } from '../../js/version.js';

// State
let currentFilter = 'all';
let allEvents = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
  console.log(`🚀 Wiki Events ${VERSION_DISPLAY}: DOMContentLoaded - Starting initialization`);

  // Display version in header for testing
  displayVersionInHeader();

  await loadEvents();
  initializeEventFilters();
  initializeViewToggles();

  console.log(`✅ Wiki Events ${VERSION_DISPLAY}: Initialization complete`);
});

/**
 * Load events from database
 */
async function loadEvents() {
  try {
    console.log('📅 Loading events from database...');
    showLoading();

    // Fetch all published events
    console.log('🔍 Fetching published events from wiki_events table...');
    allEvents = await supabase.getAll('wiki_events', {
      where: 'status',
      operator: 'eq',
      value: 'published',
      order: 'event_date.asc'
    });

    console.log(`✅ Loaded ${allEvents.length} events from database`);
    console.log('📋 Event titles:', allEvents.map(e => e.title));

    // Render events
    console.log('🎨 Rendering events to DOM...');
    renderEvents();

    console.log('✨ Events load complete!');
  } catch (error) {
    console.error('❌ Error loading events:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    showError('Failed to load events. Please refresh the page.');
  }
}

/**
 * Render events to the page
 */
function renderEvents() {
  const eventsGrid = document.getElementById('eventsGrid');

  if (!eventsGrid) {
    console.warn('⚠️ eventsGrid element not found');
    return;
  }

  // Filter events based on current filter and future dates
  const now = new Date();
  const filteredEvents = allEvents.filter(event => {
    // Only show future events (or events from today)
    const eventDate = new Date(event.event_date);
    const isUpcoming = eventDate >= now || isSameDay(eventDate, now);

    // Type filter
    const matchesFilter = currentFilter === 'all' || event.event_type === currentFilter;

    return isUpcoming && matchesFilter;
  });

  console.log(`📊 Rendering ${filteredEvents.length} events (filtered from ${allEvents.length} total)`);

  // Render events
  if (filteredEvents.length === 0) {
    eventsGrid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <i class="fas fa-calendar-times" style="font-size: 3rem; color: var(--wiki-text-muted); margin-bottom: 1rem;"></i>
        <h3 style="color: var(--wiki-text-muted);">No events found</h3>
        <p class="text-muted">Try selecting a different filter or check back later</p>
      </div>
    `;
    return;
  }

  eventsGrid.innerHTML = filteredEvents.map(event => `
    <div class="event-card" data-event-type="${event.event_type || 'meetup'}">
      <div class="event-date">
        <div class="event-day">${formatDay(event.event_date)}</div>
        <div class="event-month">${formatMonth(event.event_date)}</div>
      </div>
      <div class="event-details">
        <h3 class="event-title">${escapeHtml(event.title)}</h3>
        <div class="event-info">
          ${event.start_time ? `<span><i class="fas fa-clock"></i> ${formatTime(event.start_time)}${event.end_time ? ' - ' + formatTime(event.end_time) : ''}</span>` : ''}
          ${event.location_name ? `<span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(event.location_name)}</span>` : ''}
        </div>
        <p class="text-muted mt-1">
          ${escapeHtml(event.description || '')}
        </p>
        <div class="tags mt-1">
          <span class="tag">${formatEventType(event.event_type)}</span>
          ${event.cost ? `<span class="tag">${event.cost === 0 || event.cost === '0' ? 'Free' : '$' + event.cost}</span>` : ''}
          ${event.max_participants ? `<span class="tag"><i class="fas fa-users"></i> ${event.max_participants} spots</span>` : ''}
        </div>
        <div style="margin-top: 1rem;">
          ${event.registration_url ? `<a href="${escapeHtml(event.registration_url)}" target="_blank" rel="noopener" class="btn btn-primary btn-small">Register</a>` : ''}
          ${event.slug ? `<a href="wiki-page.html?slug=${event.slug}" class="btn btn-outline btn-small">Details</a>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Show loading state
 */
function showLoading() {
  const eventsGrid = document.getElementById('eventsGrid');
  if (eventsGrid) {
    eventsGrid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: var(--wiki-primary); margin-bottom: 1rem;"></i>
        <h3 style="color: var(--wiki-text-muted);">Loading events...</h3>
      </div>
    `;
  }
}

/**
 * Show error message
 */
function showError(message) {
  const eventsGrid = document.getElementById('eventsGrid');
  if (eventsGrid) {
    eventsGrid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e63946; margin-bottom: 1rem;"></i>
        <h3 style="color: var(--wiki-text-muted);">Error</h3>
        <p class="text-muted">${escapeHtml(message)}</p>
      </div>
    `;
  }
}

/**
 * Initialize event filters
 */
function initializeEventFilters() {
  const filterTags = document.querySelectorAll('.event-filter');

  filterTags.forEach(tag => {
    tag.addEventListener('click', function(e) {
      e.preventDefault();

      // Update active state
      filterTags.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      // Update current filter
      currentFilter = this.dataset.filter;

      console.log(`🔍 Filter changed to: ${currentFilter}`);

      // Re-render events
      renderEvents();
    });
  });
}

/**
 * Initialize view toggles (list vs calendar)
 */
function initializeViewToggles() {
  const listViewBtn = document.getElementById('listView');
  const calendarViewBtn = document.getElementById('calendarView');

  if (listViewBtn) {
    listViewBtn.addEventListener('click', function() {
      console.log('📋 Switched to list view');
      // List view is default - just update button styles
      this.classList.add('btn-primary');
      this.classList.remove('btn-outline');
      if (calendarViewBtn) {
        calendarViewBtn.classList.remove('btn-primary');
        calendarViewBtn.classList.add('btn-outline');
      }
    });
  }

  if (calendarViewBtn) {
    calendarViewBtn.addEventListener('click', function() {
      console.log('📅 Calendar view not yet implemented');
      alert('Calendar view coming soon!');
    });
  }
}

/**
 * Format day from date
 */
function formatDay(dateString) {
  if (!dateString) return '--';
  const date = new Date(dateString);
  return date.getDate();
}

/**
 * Format month from date
 */
function formatMonth(dateString) {
  if (!dateString) return '---';
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[date.getMonth()];
}

/**
 * Format time
 */
function formatTime(timeString) {
  if (!timeString) return '';

  // Handle both time and datetime strings
  let time = timeString;
  if (timeString.includes('T')) {
    time = timeString.split('T')[1].split('.')[0];
  }

  // Parse HH:MM:SS
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;

  return `${hour12}:${minutes} ${ampm}`;
}

/**
 * Format event type for display
 */
function formatEventType(type) {
  if (!type) return 'Event';

  const types = {
    'workshop': 'Workshop',
    'meetup': 'Meetup',
    'tour': 'Tour',
    'course': 'Course',
    'workday': 'Work Day'
  };

  return types[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

/**
 * Check if two dates are the same day
 */
function isSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
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
