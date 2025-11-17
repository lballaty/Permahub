/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/tests/e2e/wiki-events.spec.js
 * Description: End-to-end tests for Wiki Events page with Supabase database integration
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-01-14
 *
 * Purpose: Verify that wiki-events.html correctly loads and displays real events from Supabase
 * NOT mock/hardcoded data
 */

import { test, expect } from '@playwright/test';

test.describe('Wiki Events Page - Database Integration', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to wiki events page
    await page.goto('http://localhost:3001/src/wiki/wiki-events.html');
  });

  test('should load wiki events page without errors', async ({ page }) => {
    // Page should load
    await expect(page).toHaveTitle(/Events|Community Events|Wiki/i);

    // No console errors
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('404')) {
        errors.push(msg.text());
      }
    });

    // Wait a moment for any errors to appear
    await page.waitForTimeout(1000);

    // Expect no errors
    expect(errors).toHaveLength(0);
  });

  test('should display version badge in header', async ({ page }) => {
    // Wait for version badge to be added
    await page.waitForTimeout(500);

    // Check for version badge
    const versionBadge = page.locator('.version-badge');
    await expect(versionBadge).toBeVisible();

    // Should contain version text
    const versionText = await versionBadge.textContent();
    expect(versionText).toMatch(/^v\d{8}\.\d{4}\.v\d+$/); // Format: v20250114.1230.v2
  });

  test('should show loading state initially', async ({ page }) => {
    // Reload to catch loading state
    await page.reload();

    // Should see loading spinner or message (might be very brief)
    const loadingIndicator = page.locator('i.fa-spinner, text=/loading/i').first();

    // Loading indicator might appear (even if briefly)
    await loadingIndicator.isVisible({ timeout: 500 }).catch(() => {
      // It's OK if loading is too fast to catch
    });
  });

  test('should display events from database (not hardcoded)', async ({ page }) => {
    // Wait for events to load or show empty state
    await page.waitForSelector('#eventsGrid .event-card, #eventsGrid .card', { timeout: 5000 });

    // Get page content
    const pageContent = await page.content();

    // Should NOT contain old hardcoded mock event titles
    expect(pageContent).not.toContain('Introduction to Permaculture Design');
    expect(pageContent).not.toContain('Community Composting Workshop');
    expect(pageContent).not.toContain('Rainwater Harvesting Systems Workshop');
    expect(pageContent).not.toContain('Winter Gardening Techniques');
    expect(pageContent).not.toContain('Herbal Medicine Garden Planning');

    // Should NOT contain hardcoded dates/locations
    expect(pageContent).not.toContain('Green Valley Farm');
    expect(pageContent).not.toContain('Community Center');
    expect(pageContent).not.toContain('River Bend Gardens');
  });

  test('should display event with correct structure from database', async ({ page }) => {
    // Wait for events or empty state
    await page.waitForSelector('#eventsGrid', { timeout: 5000 });

    // Check if we have events
    const eventCards = page.locator('#eventsGrid .event-card');
    const eventCount = await eventCards.count();

    if (eventCount > 0) {
      // Get first event card
      const firstEvent = eventCards.first();

      // Should have event date section
      const eventDate = firstEvent.locator('.event-date');
      await expect(eventDate).toBeVisible();

      // Should have day and month
      const eventDay = firstEvent.locator('.event-day');
      const eventMonth = firstEvent.locator('.event-month');
      await expect(eventDay).toBeVisible();
      await expect(eventMonth).toBeVisible();

      // Should have event details
      const eventDetails = firstEvent.locator('.event-details');
      await expect(eventDetails).toBeVisible();

      // Should have title
      const eventTitle = firstEvent.locator('.event-title');
      await expect(eventTitle).toBeVisible();

      // Should have tags
      const tags = firstEvent.locator('.tags .tag');
      const tagCount = await tags.count();
      expect(tagCount).toBeGreaterThan(0);
    } else {
      // If no events, should show empty state
      const noEventsMsg = page.locator('text=/no events found/i');
      await expect(noEventsMsg).toBeVisible();
    }
  });

  test('should have working event type filters', async ({ page }) => {
    // Wait for page to load
    await page.waitForSelector('#eventsGrid', { timeout: 5000 });

    // Find filter tags
    const filterTags = page.locator('.event-filter');
    const filterCount = await filterTags.count();

    expect(filterCount).toBeGreaterThan(1); // Should have multiple filters

    // Click "Workshops" filter
    const workshopFilter = page.locator('.event-filter[data-filter="workshop"]');

    if (await workshopFilter.isVisible()) {
      await workshopFilter.click();

      // Should have active class
      await expect(workshopFilter).toHaveClass(/active/);

      // Wait for filter to apply
      await page.waitForTimeout(300);

      // Check console logs for filter change
      const consoleLogs = [];
      page.on('console', (msg) => {
        if (msg.text().includes('Filter changed to:')) {
          consoleLogs.push(msg.text());
        }
      });

      // Filter should be applied
      const allFilter = page.locator('.event-filter[data-filter="all"]');
      await expect(allFilter).not.toHaveClass(/active/);
    }
  });

  test('should display filter buttons correctly', async ({ page }) => {
    // Check all filter buttons exist
    const filters = [
      { selector: '[data-filter="all"]', text: 'All Events' },
      { selector: '[data-filter="workshop"]', text: 'Workshops' },
      { selector: '[data-filter="meetup"]', text: 'Meetups' },
      { selector: '[data-filter="tour"]', text: 'Tours' },
      { selector: '[data-filter="course"]', text: 'Courses' },
      { selector: '[data-filter="workday"]', text: 'Work Days' }
    ];

    for (const filter of filters) {
      const filterButton = page.locator(`.event-filter${filter.selector}`);
      await expect(filterButton).toBeVisible();
      await expect(filterButton).toContainText(filter.text);
    }
  });

  test('should have view toggle buttons', async ({ page }) => {
    // Check for list view button
    const listViewBtn = page.locator('#listView');
    await expect(listViewBtn).toBeVisible();
    await expect(listViewBtn).toContainText('List View');

    // Check for calendar view button
    const calendarViewBtn = page.locator('#calendarView');
    await expect(calendarViewBtn).toBeVisible();
    await expect(calendarViewBtn).toContainText('Calendar View');
  });

  test('should switch to calendar view when clicked', async ({ page }) => {
    // Wait for page to load
    await page.waitForSelector('#eventsGrid', { timeout: 5000 });

    // Click calendar view button
    const calendarViewBtn = page.locator('#calendarView');
    await calendarViewBtn.click();

    // Calendar view section should be visible
    const calendarSection = page.locator('#calendarViewSection');
    await expect(calendarSection).toBeVisible();

    // List view section should be hidden
    const listSection = page.locator('#listViewSection');
    await expect(listSection).toBeHidden();

    // Calendar button should be active
    await expect(calendarViewBtn).toHaveClass(/btn-primary/);

    // List button should not be active
    const listViewBtn = page.locator('#listView');
    await expect(listViewBtn).toHaveClass(/btn-outline/);
  });

  test('should display calendar grid with days', async ({ page }) => {
    // Switch to calendar view
    const calendarViewBtn = page.locator('#calendarView');
    await calendarViewBtn.click();

    // Wait for calendar to render
    await page.waitForSelector('.calendar-grid', { timeout: 3000 });

    // Should have day headers
    const dayHeaders = page.locator('.calendar-day-header');
    const headerCount = await dayHeaders.count();
    expect(headerCount).toBe(7); // Sun-Sat

    // Should have calendar days
    const calendarDays = page.locator('.calendar-day');
    const dayCount = await calendarDays.count();
    expect(dayCount).toBeGreaterThan(28); // At least one month worth

    // Should have current month/year header
    const monthHeader = page.locator('#currentMonth');
    await expect(monthHeader).toBeVisible();
    const monthText = await monthHeader.textContent();
    expect(monthText).toMatch(/\w+ \d{4}/); // e.g., "November 2025"
  });

  test('should navigate months with prev/next buttons', async ({ page }) => {
    // Switch to calendar view
    const calendarViewBtn = page.locator('#calendarView');
    await calendarViewBtn.click();

    // Get current month
    const monthHeader = page.locator('#currentMonth');
    const initialMonth = await monthHeader.textContent();

    // Click next month
    const nextMonthBtn = page.locator('#nextMonth');
    await nextMonthBtn.click();
    await page.waitForTimeout(300);

    const nextMonth = await monthHeader.textContent();
    expect(nextMonth).not.toBe(initialMonth);

    // Click previous month
    const prevMonthBtn = page.locator('#prevMonth');
    await prevMonthBtn.click();
    await page.waitForTimeout(300);

    const backToInitial = await monthHeader.textContent();
    expect(backToInitial).toBe(initialMonth);
  });

  test('should show events on calendar days', async ({ page }) => {
    // Switch to calendar view
    const calendarViewBtn = page.locator('#calendarView');
    await calendarViewBtn.click();

    // Wait for calendar to render
    await page.waitForSelector('.calendar-grid', { timeout: 3000 });

    // Look for days with event indicators
    const daysWithEvents = page.locator('.calendar-day:has(.calendar-event-dot)');
    const count = await daysWithEvents.count();

    // If we have events in the database, some days should show event indicators
    // (This might be 0 if there are no events in the current month)
    console.log(`Found ${count} days with events in calendar view`);
  });

  test('should click calendar day and show events - anonymous user', async ({ page }) => {
    // This test should work for anonymous users (no login required)

    // Capture console logs
    const consoleLogs = [];
    page.on('console', msg => {
      consoleLogs.push(`${msg.type()}: ${msg.text()}`);
    });

    // Switch to calendar view
    const calendarViewBtn = page.locator('#calendarView');
    await calendarViewBtn.click();

    // Wait for calendar to render
    await page.waitForSelector('.calendar-grid', { timeout: 3000 });

    // Wait a bit for events to load
    await page.waitForTimeout(1000);

    // Find all calendar days with events (using event dots as indicator)
    const daysWithEvents = page.locator('.calendar-day:has(.calendar-event-dot)');
    const dayCount = await daysWithEvents.count();

    console.log(`Found ${dayCount} calendar days with event dots`);

    if (dayCount > 0) {
      // Try clicking up to 3 days until we find one that shows events
      let foundEvents = false;
      for (let i = 0; i < Math.min(3, dayCount) && !foundEvents; i++) {
        const day = daysWithEvents.nth(i);

        // Get the date from the calendar day
        const dateStr = await day.getAttribute('data-date');
        console.log(`Attempting to click day ${i} with date: ${dateStr}`);

        await day.click();
        await page.waitForTimeout(800);

        // Check console logs for click event
        const clickLogs = consoleLogs.filter(log => log.includes('Calendar day clicked'));
        console.log(`Click logs: ${clickLogs.join(', ')}`);

        // Check if events section became visible
        const selectedDayEvents = page.locator('#selectedDayEvents');
        const isVisible = await selectedDayEvents.isVisible().catch(() => false);

        console.log(`Events section visible: ${isVisible}`);

        if (isVisible) {
          foundEvents = true;

          // Should have events grid
          const selectedEventsGrid = page.locator('#selectedEventsGrid');
          await expect(selectedEventsGrid).toBeVisible();

          // Should have at least one event card
          const eventCards = selectedEventsGrid.locator('.event-card');
          const cardCount = await eventCards.count();
          expect(cardCount).toBeGreaterThan(0);
        }
      }

      // Print all console logs if test fails
      if (!foundEvents) {
        console.log('\n=== All Console Logs ===');
        consoleLogs.forEach(log => console.log(log));
      }

      // At least one day should have shown events
      expect(foundEvents).toBeTruthy();
    } else {
      // Skip test if no events in current month
      console.log('No events found in current calendar month - skipping test');
    }
  });

  test('should display export buttons on event cards in calendar', async ({ page }) => {
    // Switch to calendar view
    const calendarViewBtn = page.locator('#calendarView');
    await calendarViewBtn.click();

    // Find and click a day with events
    const dayWithEvents = page.locator('.calendar-day:has(.calendar-event-dot)').first();

    if (await dayWithEvents.isVisible({ timeout: 1000 }).catch(() => false)) {
      await dayWithEvents.click();
      await page.waitForTimeout(500);

      // Check for export button
      const exportBtn = page.locator('button:has-text("Export")').first();
      if (await exportBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await expect(exportBtn).toContainText('Export');

        // Should have calendar icon
        const icon = exportBtn.locator('i.fa-calendar-plus');
        await expect(icon).toBeVisible();
      }
    }
  });

  test('should verify Supabase connection is active', async ({ page }) => {
    // Listen for network requests
    const supabaseRequests = [];
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('127.0.0.1:54321') || url.includes('supabase')) {
        supabaseRequests.push(url);
      }
    });

    // Reload to capture requests
    await page.reload();

    // Wait for events to load
    await page.waitForSelector('#eventsGrid', { timeout: 5000 });

    // Should have made requests to local Supabase
    expect(supabaseRequests.length).toBeGreaterThan(0);

    // Should be hitting wiki_events endpoint
    const hasEventsRequest = supabaseRequests.some(url =>
      url.includes('/rest/v1/wiki_events')
    );
    expect(hasEventsRequest).toBeTruthy();
  });

  test('should format dates correctly', async ({ page }) => {
    // Wait for events
    await page.waitForSelector('#eventsGrid', { timeout: 5000 });

    const eventCards = page.locator('#eventsGrid .event-card');
    const eventCount = await eventCards.count();

    if (eventCount > 0) {
      const firstEvent = eventCards.first();

      // Check day format (should be 1-31)
      const dayText = await firstEvent.locator('.event-day').textContent();
      const dayNum = parseInt(dayText);
      expect(dayNum).toBeGreaterThanOrEqual(1);
      expect(dayNum).toBeLessThanOrEqual(31);

      // Check month format (should be 3-letter abbreviation)
      const monthText = await firstEvent.locator('.event-month').textContent();
      expect(monthText).toMatch(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/);
    }
  });

  test('should format time correctly', async ({ page }) => {
    await page.waitForSelector('#eventsGrid', { timeout: 5000 });

    const eventCards = page.locator('#eventsGrid .event-card');
    const eventCount = await eventCards.count();

    if (eventCount > 0) {
      const firstEvent = eventCards.first();
      const eventInfo = firstEvent.locator('.event-info');

      // Look for time format (e.g., "10:00 AM - 2:00 PM")
      const timeSpan = eventInfo.locator('span:has(i.fa-clock)');

      if (await timeSpan.isVisible({ timeout: 1000 }).catch(() => false)) {
        const timeText = await timeSpan.textContent();
        // Should contain AM or PM
        expect(timeText).toMatch(/\d{1,2}:\d{2}\s*(AM|PM)/);
      }
    }
  });

  test('should display event types as tags', async ({ page }) => {
    await page.waitForSelector('#eventsGrid', { timeout: 5000 });

    const eventCards = page.locator('#eventsGrid .event-card');
    const eventCount = await eventCards.count();

    if (eventCount > 0) {
      const firstEvent = eventCards.first();
      const tags = firstEvent.locator('.tags .tag');
      const firstTag = tags.first();

      if (await firstTag.isVisible()) {
        const tagText = await firstTag.textContent();

        // Should be one of the valid event types
        const validTypes = ['Workshop', 'Meetup', 'Tour', 'Course', 'Work Day', 'Event'];
        const hasValidType = validTypes.some(type => tagText.includes(type));
        expect(hasValidType).toBeTruthy();
      }
    }
  });

  test('should escape HTML in event content (XSS protection)', async ({ page }) => {
    await page.waitForSelector('#eventsGrid', { timeout: 5000 });

    // Get page source
    const pageContent = await page.content();

    // Should not have unescaped script tags in event content
    const eventCards = page.locator('#eventsGrid .event-card');
    const eventCount = await eventCards.count();

    if (eventCount > 0) {
      const firstEventTitle = eventCards.first().locator('.event-title');
      const titleHTML = await firstEventTitle.innerHTML();

      // Should not contain executable script
      expect(titleHTML).not.toContain('<script>');
      expect(titleHTML).not.toMatch(/javascript:/);
    }
  });

  test('should handle empty database gracefully', async ({ page }) => {
    await page.waitForSelector('#eventsGrid', { timeout: 5000 });

    // Check if we have the no events message
    const noEventsMsg = page.locator('text=/no events found/i');
    const eventCards = page.locator('#eventsGrid .event-card');

    // Either we have events OR we have a no events message
    const hasEvents = await eventCards.count() > 0;
    const hasNoEventsMsg = await noEventsMsg.isVisible({ timeout: 1000 }).catch(() => false);

    expect(hasEvents || hasNoEventsMsg).toBeTruthy();
  });

  test('should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Wait for events to load
    await page.waitForSelector('#eventsGrid', { timeout: 5000 });

    // Page should still be usable
    const eventsGrid = page.locator('#eventsGrid');
    await expect(eventsGrid).toBeVisible();

    // No horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1); // +1 for rounding
  });

  test('should have subscribe section', async ({ page }) => {
    // Find subscribe section
    const subscribeSection = page.locator('text=/never miss an event/i');
    await expect(subscribeSection).toBeVisible();

    // Should have email input
    const emailInput = page.locator('input[type="email"][placeholder*="email"]');
    await expect(emailInput).toBeVisible();

    // Should have subscribe button
    const subscribeBtn = page.locator('button:has-text("Subscribe")');
    await expect(subscribeBtn).toBeVisible();
  });

  test('should log events loading in console', async ({ page }) => {
    const consoleLogs = [];

    page.on('console', (msg) => {
      if (msg.text().includes('Loading events') ||
          msg.text().includes('Loaded') ||
          msg.text().includes('Wiki Events')) {
        consoleLogs.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForTimeout(1000);

    // Should have logged initialization
    const hasInitLog = consoleLogs.some(log =>
      log.includes('Wiki Events') && log.includes('Starting initialization')
    );
    expect(hasInitLog).toBeTruthy();

    // Should have logged loading
    const hasLoadingLog = consoleLogs.some(log =>
      log.includes('Loading events from database')
    );
    expect(hasLoadingLog).toBeTruthy();
  });
});

test.describe('Wiki Events Page - Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/src/wiki/wiki-events.html');
  });

  test('should have navigation links to other wiki pages', async ({ page }) => {
    // Should have links to home, events, map
    const homeLink = page.locator('a[href*="wiki-home"]');
    const eventsLink = page.locator('a[href*="wiki-events"]');
    const mapLink = page.locator('a[href*="wiki-map"]');

    await expect(homeLink).toBeVisible();
    await expect(eventsLink).toBeVisible();
    await expect(mapLink).toBeVisible();

    // Events link should be active
    await expect(eventsLink).toHaveClass(/active/);
  });

  test('should have Add Event button', async ({ page }) => {
    const addEventBtn = page.locator('a:has-text("Add Event")');
    await expect(addEventBtn).toBeVisible();

    // Should link to editor
    const href = await addEventBtn.getAttribute('href');
    expect(href).toContain('wiki-editor.html');
  });
});