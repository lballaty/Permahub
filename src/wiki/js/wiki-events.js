/**
 * Wiki Events Page - Display Events from Database
 * Fetches real events from Supabase and displays them with filtering
 */

import { supabase } from '../../js/supabase-client.js';
import { displayVersionInHeader, VERSION_DISPLAY } from '../../js/version.js';

// wikiI18n is loaded globally via script tag in HTML
const wikiI18n = window.wikiI18n;

// State
let currentFilter = 'all';
let allEvents = [];
let currentView = 'list'; // 'list' or 'calendar'
let currentCalendarDate = new Date(); // Track current month in calendar view

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
    const events = await supabase.getAll('wiki_events', {
      where: 'status',
      operator: 'eq',
      value: 'published',
      order: 'event_date.asc'
    });

    console.log(`✅ Loaded ${events.length} events from database`);

    // Enrich events with author information
    console.log('👤 Fetching author information for events...');
    allEvents = await Promise.all(
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
    showError(wikiI18n.t('wiki.events.error_loading'));
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
        <h3 style="color: var(--wiki-text-muted);">${wikiI18n.t('wiki.events.no_events_found')}</h3>
        <p class="text-muted">${wikiI18n.t('wiki.events.try_different_filter')}</p>
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
          ${event.author_name ? `<span><i class="fas fa-user"></i> ${escapeHtml(event.author_name)}</span>` : ''}
          ${event.view_count !== undefined ? `<span><i class="fas fa-eye"></i> ${event.view_count} views</span>` : ''}
        </div>
        <p class="text-muted mt-1">
          ${escapeHtml(event.description || '')}
        </p>
        <div class="tags mt-1">
          <span class="tag">${formatEventType(event.event_type)}</span>
          ${event.cost ? `<span class="tag">${event.cost === 0 || event.cost === '0' ? wikiI18n.t('wiki.events.free') : '$' + event.cost}</span>` : ''}
          ${event.max_participants ? `<span class="tag"><i class="fas fa-users"></i> ${event.max_participants} spots</span>` : ''}
        </div>
        ${event.contact_email || event.contact_phone || event.organizer_organization ? `
        <div style="margin-top: 0.75rem; display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
          ${event.contact_email ? `
            <a href="mailto:${event.contact_email}"
               title="${escapeHtml(event.contact_email)}"
               style="color: var(--wiki-primary); text-decoration: none; font-size: 1.1em;">
              <i class="fas fa-envelope"></i>
            </a>
          ` : ''}
          ${event.contact_phone ? `
            <a href="tel:${event.contact_phone}"
               title="${escapeHtml(event.contact_phone)}"
               style="color: var(--wiki-primary); text-decoration: none; font-size: 1.1em;">
              <i class="fas fa-phone"></i>
            </a>
          ` : ''}
          ${event.organizer_organization ? `
            <span style="color: #666; font-size: 0.9em;">
              by ${escapeHtml(event.organizer_organization)}
            </span>
          ` : ''}
        </div>
        ` : ''}
        <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
          ${event.registration_url ?
            `<a href="${escapeHtml(event.registration_url)}" target="_blank" rel="noopener" class="btn btn-primary btn-small"><i class="fas fa-ticket-alt"></i> Register</a>` :
            `<button onclick="showNoRegistrationModal('${escapeHtml(event.title)}')" class="btn btn-outline btn-small"><i class="fas fa-info-circle"></i> No Registration Required</button>`
          }
          <button onclick="downloadEventICS('${event.id}')" class="btn btn-outline btn-small" title="Add to Google Calendar, Apple Calendar, etc.">
            <i class="fas fa-calendar-plus"></i> Export
          </button>
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
        <h3 style="color: var(--wiki-text-muted);">${wikiI18n.t('wiki.events.loading')}</h3>
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
        <h3 style="color: var(--wiki-text-muted);">${wikiI18n.t('wiki.common.error')}</h3>
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

      // Re-render based on current view
      if (currentView === 'calendar') {
        renderCalendar();
        // Hide selected day events when filter changes
        const selectedDayEventsDiv = document.getElementById('selectedDayEvents');
        if (selectedDayEventsDiv) {
          selectedDayEventsDiv.style.display = 'none';
        }
      } else {
        renderEvents();
      }
    });
  });
}

/**
 * Initialize view toggles (list vs calendar)
 */
function initializeViewToggles() {
  const listViewBtn = document.getElementById('listView');
  const calendarViewBtn = document.getElementById('calendarView');
  const listViewSection = document.getElementById('listViewSection');
  const calendarViewSection = document.getElementById('calendarViewSection');

  if (listViewBtn) {
    listViewBtn.addEventListener('click', function() {
      console.log('📋 Switched to list view');
      currentView = 'list';

      // Update button styles
      this.classList.add('btn-primary');
      this.classList.remove('btn-outline');
      if (calendarViewBtn) {
        calendarViewBtn.classList.remove('btn-primary');
        calendarViewBtn.classList.add('btn-outline');
      }

      // Show/hide sections
      if (listViewSection) listViewSection.style.display = 'block';
      if (calendarViewSection) calendarViewSection.style.display = 'none';
    });
  }

  if (calendarViewBtn) {
    calendarViewBtn.addEventListener('click', function() {
      console.log('📅 Switched to calendar view');
      currentView = 'calendar';

      // Update button styles
      this.classList.add('btn-primary');
      this.classList.remove('btn-outline');
      if (listViewBtn) {
        listViewBtn.classList.remove('btn-primary');
        listViewBtn.classList.add('btn-outline');
      }

      // Show/hide sections
      if (listViewSection) listViewSection.style.display = 'none';
      if (calendarViewSection) calendarViewSection.style.display = 'block';

      // Render calendar
      renderCalendar();
    });
  }

  // Initialize month navigation
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');

  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', function() {
      currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
      renderCalendar();
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', function() {
      currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
      renderCalendar();
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

        ${event.organizer_name || event.organizer_organization || event.contact_email || event.contact_phone || event.contact_website ? `
        <div style="margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 0.5rem;"><i class="fas fa-address-card"></i> Contact Information</h3>
          ${event.organizer_name ? `
            <p style="margin-bottom: 0.5rem;"><strong>Organizer:</strong> ${escapeHtml(event.organizer_name)}</p>
          ` : ''}
          ${event.organizer_organization ? `
            <p style="margin-bottom: 0.5rem;"><strong>Organization:</strong> ${escapeHtml(event.organizer_organization)}</p>
          ` : ''}
          ${event.contact_email ? `
            <p style="margin-bottom: 0.5rem;">
              <i class="fas fa-envelope" style="width: 20px; color: var(--wiki-primary);"></i>
              <a href="mailto:${event.contact_email}" style="color: var(--wiki-primary); text-decoration: none;">
                ${escapeHtml(event.contact_email)}
              </a>
            </p>
          ` : ''}
          ${event.contact_phone ? `
            <p style="margin-bottom: 0.5rem;">
              <i class="fas fa-phone" style="width: 20px; color: var(--wiki-primary);"></i>
              <a href="tel:${event.contact_phone}" style="color: var(--wiki-primary); text-decoration: none;">
                ${escapeHtml(event.contact_phone)}
              </a>
            </p>
          ` : ''}
          ${event.contact_website ? `
            <p style="margin-bottom: 0.5rem;">
              <i class="fas fa-globe" style="width: 20px; color: var(--wiki-primary);"></i>
              <a href="${event.contact_website}" target="_blank" rel="noopener" style="color: var(--wiki-primary); text-decoration: none;">
                Visit Website <i class="fas fa-external-link-alt" style="font-size: 0.8em;"></i>
              </a>
            </p>
          ` : ''}
        </div>
        ` : ''}

        <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          ${event.registration_url ? `
            <a href="${escapeHtml(event.registration_url)}" target="_blank" rel="noopener" class="btn btn-primary">
              <i class="fas fa-external-link-alt"></i> Register Now
            </a>
          ` : ''}
          <button onclick="downloadEventICS('${event.id}')" class="btn btn-primary">
            <i class="fas fa-calendar-plus"></i> Add to Calendar
          </button>
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

/**
 * Show "No Registration Required" modal
 */
window.showNoRegistrationModal = function(eventTitle) {
  const modalHTML = `
    <div id="noRegModal" class="modal" style="display: block; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 1000;">
      <div class="modal-content" style="
        position: relative;
        background: white;
        color: #333;
        margin: 15% auto;
        padding: 2rem;
        width: 90%;
        max-width: 500px;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        text-align: center;
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

/**
 * Render calendar view
 */
function renderCalendar() {
  const calendarGrid = document.getElementById('calendarGrid');
  const currentMonthHeader = document.getElementById('currentMonth');

  if (!calendarGrid || !currentMonthHeader) {
    console.warn('⚠️ Calendar elements not found');
    return;
  }

  // Update month header
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  currentMonthHeader.textContent = `${monthNames[currentCalendarDate.getMonth()]} ${currentCalendarDate.getFullYear()}`;

  // Get first and last day of the month
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Get the day of week for first day (0 = Sunday)
  const firstDayOfWeek = firstDay.getDay();

  // Get days in month
  const daysInMonth = lastDay.getDate();

  // Get days from previous month to show
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const prevMonthDays = firstDayOfWeek;

  // Calculate total cells needed
  const totalCells = Math.ceil((daysInMonth + prevMonthDays) / 7) * 7;
  const nextMonthDays = totalCells - daysInMonth - prevMonthDays;

  // Build calendar HTML
  let calendarHTML = '';

  // Day headers
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayHeaders.forEach(day => {
    calendarHTML += `<div class="calendar-day-header">${day}</div>`;
  });

  // Previous month days
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const date = new Date(year, month - 1, dayNum);
    calendarHTML += renderCalendarDay(date, true);
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    calendarHTML += renderCalendarDay(date, false);
  }

  // Next month days
  for (let i = 1; i <= nextMonthDays; i++) {
    const date = new Date(year, month + 1, i);
    calendarHTML += renderCalendarDay(date, true);
  }

  calendarGrid.innerHTML = calendarHTML;

  // Add click event listeners to calendar days
  const calendarDays = calendarGrid.querySelectorAll('.calendar-day');
  console.log(`📅 Adding click listeners to ${calendarDays.length} calendar days`);
  calendarDays.forEach(dayElement => {
    dayElement.addEventListener('click', function(e) {
      const dateStr = this.dataset.date;
      console.log(`🖱️ Calendar day clicked: ${dateStr}`);
      if (dateStr) {
        showDayEvents(dateStr);
      }
    });
  });
}

/**
 * Render a single calendar day cell
 */
function renderCalendarDay(date, isOtherMonth) {
  const today = new Date();
  const isToday = isSameDay(date, today);

  // Get events for this day
  const dayEvents = getEventsForDate(date);

  // Filter by current filter
  const filteredEvents = dayEvents.filter(event => {
    return currentFilter === 'all' || event.event_type === currentFilter;
  });

  const dayClasses = ['calendar-day'];
  if (isOtherMonth) dayClasses.push('other-month');
  if (isToday) dayClasses.push('today');

  const dateStr = date.toISOString().split('T')[0];

  let html = `<div class="${dayClasses.join(' ')}" data-date="${dateStr}" style="cursor: pointer;">`;
  html += `<div class="calendar-day-number">${date.getDate()}</div>`;

  if (filteredEvents.length > 0) {
    // Show first 2 events as dots, rest as count
    html += `<div class="calendar-events">`;

    const eventsToShow = filteredEvents.slice(0, 2);
    eventsToShow.forEach(event => {
      const eventIcon = getEventIcon(event.event_type);
      const truncatedTitle = event.title.length > 15 ? event.title.substring(0, 12) + '...' : event.title;
      html += `<div class="calendar-event-dot" title="${escapeHtml(event.title)}">
        <i class="${eventIcon}"></i> ${escapeHtml(truncatedTitle)}
      </div>`;
    });

    html += `</div>`;

    if (filteredEvents.length > 2) {
      html += `<div class="calendar-event-count">${filteredEvents.length}</div>`;
    }
  }

  html += `</div>`;
  return html;
}

/**
 * Get events for a specific date
 */
function getEventsForDate(date) {
  return allEvents.filter(event => {
    const eventDate = new Date(event.event_date);
    return isSameDay(eventDate, date);
  });
}

/**
 * Get icon for event type
 */
function getEventIcon(eventType) {
  const icons = {
    'workshop': 'fas fa-tools',
    'meetup': 'fas fa-users',
    'tour': 'fas fa-walking',
    'course': 'fas fa-graduation-cap',
    'workday': 'fas fa-hammer'
  };
  return icons[eventType] || 'fas fa-calendar';
}

/**
 * Show events for a selected day
 */
function showDayEvents(dateStr) {
  console.log(`📅 showDayEvents called with date: ${dateStr}`);
  const date = new Date(dateStr);
  const dayEvents = getEventsForDate(date);
  console.log(`📅 Found ${dayEvents.length} events for this day`);

  // Filter by current filter
  const filteredEvents = dayEvents.filter(event => {
    return currentFilter === 'all' || event.event_type === currentFilter;
  });
  console.log(`📅 After filtering: ${filteredEvents.length} events`);

  const selectedDayEventsDiv = document.getElementById('selectedDayEvents');
  const selectedDayTitle = document.getElementById('selectedDayTitle');
  const selectedEventsGrid = document.getElementById('selectedEventsGrid');

  if (!selectedDayEventsDiv || !selectedDayTitle || !selectedEventsGrid) {
    console.warn('⚠️ Selected day events elements not found');
    return;
  }

  if (filteredEvents.length === 0) {
    console.log('📅 No filtered events to display, hiding section');
    selectedDayEventsDiv.style.display = 'none';
    return;
  }

  // Format date for title
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  selectedDayTitle.innerHTML = `<i class="fas fa-calendar-day"></i> Events on ${formattedDate}`;

  // Render events in same format as list view
  selectedEventsGrid.innerHTML = filteredEvents.map(event => `
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
          ${event.author_name ? `<span><i class="fas fa-user"></i> ${escapeHtml(event.author_name)}</span>` : ''}
        </div>
        <p class="text-muted mt-1">
          ${escapeHtml(event.description || '')}
        </p>
        <div class="tags mt-1">
          <span class="tag">${formatEventType(event.event_type)}</span>
          ${event.cost ? `<span class="tag">${event.cost === 0 || event.cost === '0' ? wikiI18n.t('wiki.events.free') : '$' + event.cost}</span>` : ''}
        </div>
        <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
          ${event.registration_url ?
            `<a href="${escapeHtml(event.registration_url)}" target="_blank" rel="noopener" class="btn btn-primary btn-small"><i class="fas fa-ticket-alt"></i> Register</a>` :
            `<button onclick="showNoRegistrationModal('${escapeHtml(event.title)}')" class="btn btn-outline btn-small"><i class="fas fa-info-circle"></i> No Registration Required</button>`
          }
          <button onclick="downloadEventICS('${event.id}')" class="btn btn-outline btn-small" title="Add to Google Calendar, Apple Calendar, etc.">
            <i class="fas fa-calendar-plus"></i> Export
          </button>
          <button onclick="showEventDetails('${event.id}')" class="btn btn-outline btn-small">Details</button>
        </div>
      </div>
    </div>
  `).join('');

  selectedDayEventsDiv.style.display = 'block';

  // Scroll to events
  selectedDayEventsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Generate ICS (iCalendar) file content for an event
 */
function generateICS(event) {
  // Format dates for ICS (YYYYMMDDTHHMMSS format)
  const eventDate = new Date(event.event_date);

  // Parse start time if available
  let startDateTime = new Date(eventDate);
  if (event.start_time) {
    const [hours, minutes] = event.start_time.split(':');
    startDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
  }

  // Parse end time if available, default to 1 hour after start
  let endDateTime = new Date(startDateTime);
  if (event.end_time) {
    const [hours, minutes] = event.end_time.split(':');
    endDateTime = new Date(eventDate);
    endDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
  } else {
    endDateTime.setHours(startDateTime.getHours() + 1);
  }

  // Format to ICS date-time format (YYYYMMDDTHHMMSS)
  const formatICSDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
  };

  const start = formatICSDateTime(startDateTime);
  const end = formatICSDateTime(endDateTime);
  const now = formatICSDateTime(new Date());

  // Build description
  let description = event.description || '';
  if (event.organizer_name || event.organizer_organization) {
    description += `\\n\\nOrganizer: ${event.organizer_name || event.organizer_organization}`;
  }
  if (event.contact_email) {
    description += `\\n\\nContact: ${event.contact_email}`;
  }
  if (event.registration_url) {
    description += `\\n\\nRegistration: ${event.registration_url}`;
  }

  // Escape special characters for ICS format
  const escapeICS = (str) => {
    if (!str) return '';
    return str.replace(/\\/g, '\\\\')
              .replace(/;/g, '\\;')
              .replace(/,/g, '\\,')
              .replace(/\n/g, '\\n');
  };

  // Build location string
  let location = event.location_name || '';
  if (event.location_address) {
    location += location ? `, ${event.location_address}` : event.location_address;
  }

  // Generate ICS content
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Permahub//Community Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@permahub.community`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeICS(event.title)}`,
    `DESCRIPTION:${escapeICS(description)}`,
    location ? `LOCATION:${escapeICS(location)}` : '',
    event.organizer_organization ? `ORGANIZER;CN=${escapeICS(event.organizer_organization)}:MAILTO:${event.contact_email || 'noreply@permahub.community'}` : '',
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(line => line !== '').join('\r\n');

  return ics;
}

/**
 * Download ICS file for an event
 */
function downloadEventICS(eventId) {
  const event = allEvents.find(e => e.id === eventId);
  if (!event) {
    console.error(`Event not found: ${eventId}`);
    return;
  }

  const icsContent = generateICS(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  // Create download link
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log(`📅 Downloaded ICS file for event: ${event.title}`);
}

// Export function to window for use in HTML onclick
window.downloadEventICS = downloadEventICS;
