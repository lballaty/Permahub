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
          <button onclick="showEventDetails('${event.id}')" class="btn btn-outline btn-small">Details</button>
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

/**
 * Show event details in a modal
 */
window.showEventDetails = function(eventId) {
  const event = allEvents.find(e => e.id === eventId);
  if (!event) {
    console.error(`Event not found: ${eventId}`);
    return;
  }

  // Create modal HTML
  const modalHTML = `
    <div id="eventModal" class="modal" style="display: block; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 1000;">
      <div class="modal-content" style="
        position: relative;
        background: white;
        color: #333;
        margin: 5% auto;
        padding: 2rem;
        width: 90%;
        max-width: 600px;
        border-radius: 8px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2), 0 6px 10px rgba(0, 0, 0, 0.15);
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
          transition: color 0.2s;
        " onmouseover="this.style.color='#333'" onmouseout="this.style.color='#666'">&times;</button>

        <div style="display: flex; align-items: flex-start; gap: 1.5rem; margin-bottom: 1.5rem;">
          <div class="event-date" style="flex-shrink: 0;">
            <div class="event-day">${formatDay(event.event_date)}</div>
            <div class="event-month">${formatMonth(event.event_date)}</div>
          </div>
          <div>
            <h2 style="margin: 0 0 0.5rem 0;">${escapeHtml(event.title)}</h2>
            <div class="tags">
              <span class="tag">${formatEventType(event.event_type)}</span>
              ${event.price_display ? `<span class="tag">${escapeHtml(event.price_display)}</span>` : ''}
            </div>
          </div>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 0.5rem;"><i class="fas fa-info-circle"></i> About This Event</h3>
          <p style="line-height: 1.6;">${escapeHtml(event.description || 'No description available.')}</p>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 0.5rem;"><i class="fas fa-calendar-alt"></i> When</h3>
          <p>
            ${new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            ${event.start_time ? `<br>${formatTime(event.start_time)}${event.end_time ? ' - ' + formatTime(event.end_time) : ''}` : ''}
          </p>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 0.5rem;"><i class="fas fa-map-marker-alt"></i> Where</h3>
          <p>
            <strong>${escapeHtml(event.location_name || 'TBD')}</strong>
            ${event.location_address ? `<br>${escapeHtml(event.location_address)}` : ''}
            ${event.latitude && event.longitude ? `
              <br><a href="https://maps.google.com/?q=${event.latitude},${event.longitude}" target="_blank" rel="noopener" style="color: var(--wiki-primary);">
                View on Map <i class="fas fa-external-link-alt"></i>
              </a>
            ` : ''}
          </p>
        </div>

        ${event.max_attendees ? `
        <div style="margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 0.5rem;"><i class="fas fa-users"></i> Capacity</h3>
          <p>
            ${event.current_attendees || 0} / ${event.max_attendees} attendees
            ${event.max_attendees - (event.current_attendees || 0) > 0 ?
              `<span style="color: var(--wiki-success); margin-left: 1rem;">
                <i class="fas fa-check-circle"></i> ${event.max_attendees - (event.current_attendees || 0)} spots available
              </span>` :
              `<span style="color: var(--wiki-danger); margin-left: 1rem;">
                <i class="fas fa-times-circle"></i> Sold out
              </span>`
            }
          </p>
        </div>
        ` : ''}

        ${event.price || event.price_display ? `
        <div style="margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 0.5rem;"><i class="fas fa-ticket-alt"></i> Price</h3>
          <p>${event.price_display || (event.price === 0 ? 'Free' : `$${event.price}`)}</p>
        </div>
        ` : ''}

        <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;">
          ${event.registration_url ? `
            <a href="${escapeHtml(event.registration_url)}" target="_blank" rel="noopener" class="btn btn-primary">
              <i class="fas fa-external-link-alt"></i> Register Now
            </a>
          ` : ''}
          <button onclick="closeEventModal()" class="btn btn-outline">Close</button>
        </div>
      </div>
    </div>
  `;

  // Add modal to page
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Close modal on background click
  document.getElementById('eventModal').addEventListener('click', function(e) {
    if (e.target.id === 'eventModal') {
      closeEventModal();
    }
  });
};

/**
 * Close event modal
 */
window.closeEventModal = function() {
  const modal = document.getElementById('eventModal');
  if (modal) {
    modal.remove();
  }
};
