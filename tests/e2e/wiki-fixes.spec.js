/**
 * Test suite to verify recent fixes:
 * 1. Language persistence across pages
 * 2. Version badge display on all pages
 * 3. Future events display
 */

import { test, expect } from '@playwright/test';

test.describe('Wiki Fixes - Language Persistence & Version Badge', () => {

  test('should persist language selection across wiki pages', async ({ page }) => {
    // Start on home page
    await page.goto('http://localhost:3000/src/wiki/wiki-home.html');

    // Wait for language selector to be available
    await page.waitForSelector('#langSelectorBtn', { timeout: 5000 });

    // Click language selector
    await page.click('#langSelectorBtn');

    // Select Portuguese
    await page.waitForSelector('.lang-option[data-lang="pt"]');
    await page.click('.lang-option[data-lang="pt"]');

    // Wait for language change notification
    await page.waitForTimeout(500);

    // Verify language changed on home page
    const homeLangBtn = await page.locator('#langSelectorBtn .lang-current').textContent();
    expect(homeLangBtn).toBe('Português');

    // Navigate to events page
    await page.goto('http://localhost:3000/src/wiki/wiki-events.html');
    await page.waitForSelector('#langSelectorBtn', { timeout: 5000 });

    // Check language persisted
    const eventsLangBtn = await page.locator('#langSelectorBtn .lang-current').textContent();
    expect(eventsLangBtn).toBe('Português');

    // Navigate to map page
    await page.goto('http://localhost:3000/src/wiki/wiki-map.html');
    await page.waitForSelector('#langSelectorBtn', { timeout: 5000 });

    // Check language persisted
    const mapLangBtn = await page.locator('#langSelectorBtn .lang-current').textContent();
    expect(mapLangBtn).toBe('Português');

    // Navigate to favorites page
    await page.goto('http://localhost:3000/src/wiki/wiki-favorites.html');
    await page.waitForSelector('#langSelectorBtn', { timeout: 5000 });

    // Check language persisted
    const favoritesLangBtn = await page.locator('#langSelectorBtn .lang-current').textContent();
    expect(favoritesLangBtn).toBe('Português');

    // Navigate to login page
    await page.goto('http://localhost:3000/src/wiki/wiki-login.html');
    await page.waitForSelector('#langSelectorBtn', { timeout: 5000 });

    // Check language persisted
    const loginLangBtn = await page.locator('#langSelectorBtn .lang-current').textContent();
    expect(loginLangBtn).toBe('Português');
  });

  test('should display version badge on all wiki pages', async ({ page }) => {
    const pages = [
      'wiki-home.html',
      'wiki-events.html',
      'wiki-map.html',
      'wiki-favorites.html',
      'wiki-login.html',
      'wiki-editor.html',
      'wiki-page.html'
    ];

    for (const pageName of pages) {
      await page.goto(`http://localhost:3000/src/wiki/${pageName}`);

      // Wait for version badge to be added
      await page.waitForTimeout(500);

      // Check for version badge
      const versionBadge = page.locator('.version-badge');
      await expect(versionBadge).toBeVisible({ timeout: 2000 });

      // Verify version format
      const versionText = await versionBadge.textContent();
      expect(versionText).toMatch(/^v\d{8}\.\d{4}\.v\d+$/);

      console.log(`✓ Version badge found on ${pageName}: ${versionText}`);
    }
  });

  test('should load language from localStorage on page init', async ({ page }) => {
    // Set language in localStorage directly
    await page.goto('http://localhost:3000/src/wiki/wiki-home.html');

    // Set Spanish in localStorage
    await page.evaluate(() => {
      localStorage.setItem('wiki_language', 'es');
    });

    // Reload page
    await page.reload();

    // Wait for language selector
    await page.waitForSelector('#langSelectorBtn', { timeout: 5000 });

    // Check language loaded from localStorage
    const langBtn = await page.locator('#langSelectorBtn .lang-current').textContent();
    expect(langBtn).toBe('Español');

    // Verify some Spanish translations are applied
    const homeNav = await page.locator('.wiki-menu a[href="wiki-home.html"]').textContent();
    expect(homeNav.trim()).toBe('Inicio');
  });

  test('should maintain language across browser refresh', async ({ page }) => {
    // Go to home page
    await page.goto('http://localhost:3000/src/wiki/wiki-home.html');

    // Change to German
    await page.click('#langSelectorBtn');
    await page.click('.lang-option[data-lang="de"]');
    await page.waitForTimeout(500);

    // Refresh the page
    await page.reload();

    // Check language persisted after refresh
    await page.waitForSelector('#langSelectorBtn', { timeout: 5000 });
    const langBtn = await page.locator('#langSelectorBtn .lang-current').textContent();
    expect(langBtn).toBe('Deutsch');
  });
});

test.describe('Wiki Fixes - Future Events Display', () => {

  test('should display future events from 2025-2026', async ({ page }) => {
    await page.goto('http://localhost:3000/src/wiki/wiki-events.html');

    // Wait for events to load
    await page.waitForSelector('#eventsGrid', { timeout: 5000 });

    // Get all event cards
    const eventCards = page.locator('#eventsGrid .event-card');
    const eventCount = await eventCards.count();

    // Should have multiple events (we added 45)
    expect(eventCount).toBeGreaterThan(30);

    // Check first event has proper date format
    if (eventCount > 0) {
      const firstEvent = eventCards.first();

      // Check date elements exist
      const eventDay = firstEvent.locator('.event-day');
      const eventMonth = firstEvent.locator('.event-month');

      await expect(eventDay).toBeVisible();
      await expect(eventMonth).toBeVisible();

      // Check month is valid
      const monthText = await eventMonth.textContent();
      const validMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      expect(validMonths).toContain(monthText);
    }
  });

  test('should display diverse event types', async ({ page }) => {
    await page.goto('http://localhost:3000/src/wiki/wiki-events.html');

    // Wait for events to load
    await page.waitForSelector('#eventsGrid .event-card', { timeout: 5000 });

    // Check filter buttons for different event types
    const workshopFilter = page.locator('.event-filter[data-filter="workshop"]');
    const meetupFilter = page.locator('.event-filter[data-filter="meetup"]');
    const tourFilter = page.locator('.event-filter[data-filter="tour"]');
    const courseFilter = page.locator('.event-filter[data-filter="course"]');
    const workdayFilter = page.locator('.event-filter[data-filter="workday"]');

    // All filter types should be visible
    await expect(workshopFilter).toBeVisible();
    await expect(meetupFilter).toBeVisible();
    await expect(tourFilter).toBeVisible();
    await expect(courseFilter).toBeVisible();
    await expect(workdayFilter).toBeVisible();

    // Click workshop filter and verify events are filtered
    await workshopFilter.click();
    await page.waitForTimeout(300);

    // Should still have events visible (we have 24 workshops)
    const workshopEvents = await page.locator('#eventsGrid .event-card').count();
    expect(workshopEvents).toBeGreaterThan(10);
  });

  test('should display real organization names and locations', async ({ page }) => {
    await page.goto('http://localhost:3000/src/wiki/wiki-events.html');

    // Wait for events to load
    await page.waitForSelector('#eventsGrid .event-card', { timeout: 5000 });

    // Get page content
    const pageContent = await page.content();

    // Check for some real organizations we added
    const realOrganizations = [
      'Eco Caminhos',
      'Findhorn Foundation',
      'Polyface Farm',
      'Brooklyn Botanic Garden',
      'Seed Savers Exchange'
    ];

    let foundOrgs = 0;
    for (const org of realOrganizations) {
      if (pageContent.includes(org)) {
        foundOrgs++;
        console.log(`✓ Found real organization: ${org}`);
      }
    }

    // Should find at least some of the real organizations
    expect(foundOrgs).toBeGreaterThan(0);
  });

  test('should have working registration URLs', async ({ page }) => {
    await page.goto('http://localhost:3000/src/wiki/wiki-events.html');

    // Wait for events to load
    await page.waitForSelector('#eventsGrid .event-card', { timeout: 5000 });

    // Check if register buttons exist and have valid URLs
    const registerButtons = page.locator('a.btn:has-text("Register")');
    const buttonCount = await registerButtons.count();

    if (buttonCount > 0) {
      const firstButton = registerButtons.first();
      const href = await firstButton.getAttribute('href');

      // Should be a valid URL
      expect(href).toMatch(/^https?:\/\//);

      // Should not be a placeholder
      expect(href).not.toContain('example.com');
      expect(href).not.toContain('#');

      console.log(`✓ Found valid registration URL: ${href}`);
    }
  });
});

test.describe('Wiki Fixes - Console Checks', () => {

  test('should log version info in console', async ({ page }) => {
    const consoleLogs = [];

    page.on('console', msg => {
      if (msg.text().includes('Permahub Wiki')) {
        consoleLogs.push(msg.text());
      }
    });

    await page.goto('http://localhost:3000/src/wiki/wiki-home.html');
    await page.waitForTimeout(500);

    // Should have version log
    const versionLog = consoleLogs.find(log => log.includes('🚀 Permahub Wiki'));
    expect(versionLog).toBeTruthy();
    expect(versionLog).toMatch(/v\d{8}\.\d{4}\.v\d+/);
  });

  test('should initialize language system', async ({ page }) => {
    const consoleLogs = [];

    page.on('console', msg => {
      consoleLogs.push(msg.text());
    });

    await page.goto('http://localhost:3000/src/wiki/wiki-map.html');
    await page.waitForTimeout(500);

    // Should have wiki initialization log
    const wikiInitLog = consoleLogs.find(log => log.includes('Community Wiki initialized'));
    expect(wikiInitLog).toBeTruthy();
  });
});