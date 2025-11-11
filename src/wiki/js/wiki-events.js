/**
 * Wiki Events Page - Filter Functionality
 */

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  addEventTypestoCards();
  initializeEventFilters();
});

/**
 * Add event types to cards based on their tag content
 */
function addEventTypestoCards() {
  const eventCards = document.querySelectorAll('.event-card');

  eventCards.forEach(card => {
    // Skip if already has data-event-type
    if (card.dataset.eventType) return;

    // Get the tag content
    const tags = card.querySelectorAll('.tag');
    let eventType = 'meetup'; // default

    tags.forEach(tag => {
      const tagText = tag.textContent.trim().toLowerCase();
      if (tagText.includes('workshop')) {
        eventType = 'workshop';
      } else if (tagText.includes('meetup')) {
        eventType = 'meetup';
      } else if (tagText.includes('tour')) {
        eventType = 'tour';
      } else if (tagText.includes('course')) {
        eventType = 'course';
      } else if (tagText.includes('work day') || tagText.includes('workday')) {
        eventType = 'workday';
      }
    });

    card.dataset.eventType = eventType;
  });
}

/**
 * Initialize event filters
 */
function initializeEventFilters() {
  const filterTags = document.querySelectorAll('.event-filter');
  const eventsGrid = document.getElementById('eventsGrid');

  if (!eventsGrid) return;

  filterTags.forEach(tag => {
    tag.addEventListener('click', function(e) {
      e.preventDefault();

      // Update active state
      filterTags.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      // Get filter value
      const filter = this.dataset.filter;

      // Filter events
      const eventCards = eventsGrid.querySelectorAll('.event-card');
      let visibleCount = 0;

      eventCards.forEach(card => {
        const eventType = card.dataset.eventType;

        if (filter === 'all' || eventType === filter) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Show message if no events match
      let noEventsMsg = eventsGrid.querySelector('.no-events-message');

      if (visibleCount === 0) {
        if (!noEventsMsg) {
          noEventsMsg = document.createElement('div');
          noEventsMsg.className = 'no-events-message card';
          noEventsMsg.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 3rem;';
          noEventsMsg.innerHTML = `
            <i class="fas fa-calendar-times" style="font-size: 3rem; color: var(--wiki-text-muted); margin-bottom: 1rem;"></i>
            <h3 style="color: var(--wiki-text-muted);">No events found</h3>
            <p class="text-muted">Try selecting a different filter</p>
          `;
          eventsGrid.appendChild(noEventsMsg);
        }
        noEventsMsg.style.display = '';
      } else {
        if (noEventsMsg) {
          noEventsMsg.style.display = 'none';
        }
      }
    });
  });
}
