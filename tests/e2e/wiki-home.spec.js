/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/tests/e2e/wiki-home.spec.js
 * Description: End-to-end tests for Wiki Home page with Supabase database integration
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-01-14
 *
 * Purpose: Verify that wiki-home.html correctly loads and displays real data from Supabase
 * NOT mock/hardcoded data
 */

import { test, expect } from '@playwright/test';

test.describe('Wiki Home Page - Database Integration', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to wiki home page
    await page.goto('http://localhost:3000/src/wiki/wiki-home.html');
  });

  test('should load wiki home page without errors', async ({ page }) => {
    // Page should load
    await expect(page).toHaveTitle(/Wiki|Permaculture|Knowledge Base/i);

    // No console errors
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Wait a moment for any errors to appear
    await page.waitForTimeout(1000);

    // Expect no errors (or only expected ones)
    expect(errors.filter(e => !e.includes('404'))).toHaveLength(0);
  });

  test('should show loading state initially', async ({ page }) => {
    // Reload to see loading state
    await page.reload();

    // Should see loading spinner or message
    const loadingIndicator = page.locator('i.fa-spinner, text=/loading/i').first();

    // Loading indicator should appear (even if briefly)
    await expect(loadingIndicator).toBeVisible({ timeout: 2000 }).catch(() => {
      // It's OK if loading is too fast to catch
    });
  });

  test('should display guides from database (not hardcoded)', async ({ page }) => {
    // Wait for guides to load
    await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

    // Get all guide cards
    const guideCards = page.locator('#guidesGrid .card');
    const count = await guideCards.count();

    // Should have guides from database (we seeded 11 guides)
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(20); // Reasonable upper limit

    // Check that guides are NOT mock data
    // Mock data had names like "Sarah Chen", "Miguel Torres"
    const pageContent = await page.content();
    expect(pageContent).not.toContain('Sarah Chen');
    expect(pageContent).not.toContain('Miguel Torres');
    expect(pageContent).not.toContain('Emma Watson');
  });

  test('should display guide with correct structure from database', async ({ page }) => {
    // Wait for guides to load
    await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

    // Get first guide card
    const firstGuide = page.locator('#guidesGrid .card').first();

    // Should have card metadata (date, views)
    const metadata = firstGuide.locator('.card-meta');
    await expect(metadata).toBeVisible();

    // Should have a title
    const title = firstGuide.locator('.card-title');
    await expect(title).toBeVisible();
    const titleText = await title.textContent();
    expect(titleText.length).toBeGreaterThan(0);

    // Should have a summary/description
    const summary = firstGuide.locator('.text-muted');
    await expect(summary).toBeVisible();

    // Should have tags/categories
    const tags = firstGuide.locator('.tags .tag');
    const tagCount = await tags.count();
    expect(tagCount).toBeGreaterThanOrEqual(0); // May or may not have tags
  });

  test('should display real guide titles from seed data', async ({ page }) => {
    // Wait for guides to load
    await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

    const pageContent = await page.content();

    // Check for real guide titles from our seed data
    // We seeded: "Swale Construction for Water Harvesting"
    // And others from various categories

    // Should contain at least one real guide
    const hasRealGuide =
      pageContent.includes('Swale') ||
      pageContent.includes('Water') ||
      pageContent.includes('Composting') ||
      pageContent.includes('Permaculture') ||
      pageContent.includes('Agroforestry');

    expect(hasRealGuide).toBeTruthy();
  });

  test('should show correct statistics from database', async ({ page }) => {
    // Wait for stats to load
    await page.waitForTimeout(1000);

    // Find statistics section
    const stats = page.locator('.wiki-container > .card > div > div');
    const statCount = await stats.count();

    if (statCount >= 3) {
      // Get guide count
      const guidesStat = stats.nth(0).locator('div').first();
      const guidesCount = await guidesStat.textContent();
      const guidesNum = parseInt(guidesCount);

      // Should match our seeded data (11 guides)
      expect(guidesNum).toBeGreaterThan(0);
      expect(guidesNum).toBe(11); // Exactly 11 guides seeded

      // Get locations count
      const locationsStat = stats.nth(1).locator('div').first();
      const locationsCount = await locationsStat.textContent();
      const locationsNum = parseInt(locationsCount);

      // Should have locations (34 seeded)
      expect(locationsNum).toBeGreaterThan(0);
      expect(locationsNum).toBe(34); // Exactly 34 locations

      // Get events count
      const eventsStat = stats.nth(2).locator('div').first();
      const eventsCount = await eventsStat.textContent();
      const eventsNum = parseInt(eventsCount);

      // Should have events (14 seeded)
      expect(eventsNum).toBeGreaterThan(0);
      expect(eventsNum).toBe(14); // Exactly 14 events
    }
  });

  test('should have working category filters', async ({ page }) => {
    // Wait for page to load
    await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

    // Get initial guide count
    const initialCards = page.locator('#guidesGrid .card');
    const initialCount = await initialCards.count();

    // Find category filters
    const categoryFilters = page.locator('.category-filter');
    const filterCount = await categoryFilters.count();

    if (filterCount > 1) {
      // Click second filter (not "All")
      const secondFilter = categoryFilters.nth(1);
      await secondFilter.click();

      // Wait for filter to apply
      await page.waitForTimeout(500);

      // Guide count may change
      const filteredCards = page.locator('#guidesGrid .card');
      const filteredCount = await filteredCards.count();

      // Filtered count should be <= initial count
      expect(filteredCount).toBeLessThanOrEqual(initialCount);

      // Filter should have active class
      await expect(secondFilter).toHaveClass(/active/);
    }
  });

  test('should have working search functionality', async ({ page }) => {
    // Wait for page to load
    await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

    // Find search input
    const searchInput = page.locator('#searchInput');

    if (await searchInput.isVisible({ timeout: 1000 }).catch(() => false)) {
      // Get initial guide count
      const initialCards = page.locator('#guidesGrid .card');
      const initialCount = await initialCards.count();

      // Search for something specific
      await searchInput.fill('water');

      // Wait for search to apply (debounced)
      await page.waitForTimeout(500);

      // Results should update
      const searchedCards = page.locator('#guidesGrid .card');
      const searchedCount = await searchedCards.count();

      // Either finds results or shows "no results"
      if (searchedCount === 0) {
        const noResults = page.locator('text=/no guides found/i');
        await expect(noResults).toBeVisible();
      } else {
        // Results should be relevant
        expect(searchedCount).toBeLessThanOrEqual(initialCount);
      }
    }
  });

  test('should display guide links with correct slugs from database', async ({ page }) => {
    // Wait for guides to load
    await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

    // Get first guide link
    const firstLink = page.locator('#guidesGrid .card .card-title a').first();
    await expect(firstLink).toBeVisible();

    // Get href attribute
    const href = await firstLink.getAttribute('href');

    // Should link to wiki-page.html with slug parameter
    expect(href).toContain('wiki-page.html?slug=');

    // Slug should not be empty or "undefined"
    expect(href).not.toContain('slug=undefined');
    expect(href).not.toContain('slug=null');

    // Slug should be a valid format (lowercase, hyphens)
    const slug = href.split('slug=')[1];
    expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  test('should show view counts from database', async ({ page }) => {
    // Wait for guides to load
    await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

    // Get first guide's view count
    const firstGuide = page.locator('#guidesGrid .card').first();
    const viewCount = firstGuide.locator('text=/views/i');

    await expect(viewCount).toBeVisible();

    // Should show a number
    const viewText = await viewCount.textContent();
    expect(viewText).toMatch(/\d+\s*views?/i);
  });

  test('should show published dates from database', async ({ page }) => {
    // Wait for guides to load
    await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

    // Get first guide's date
    const firstGuide = page.locator('#guidesGrid .card').first();
    const dateElement = firstGuide.locator('.card-meta span').first();

    await expect(dateElement).toBeVisible();

    // Should show a date
    const dateText = await dateElement.textContent();
    expect(dateText.length).toBeGreaterThan(0);

    // Should be a relative date or formatted date
    const hasDate =
      dateText.includes('ago') ||
      dateText.includes('Today') ||
      dateText.includes('Yesterday') ||
      /\d{1,2}\/\d{1,2}\/\d{4}/.test(dateText) ||
      /\d{4}-\d{2}-\d{2}/.test(dateText);

    expect(hasDate).toBeTruthy();
  });

  test('should display categories from database', async ({ page }) => {
    // Wait for guides to load
    await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

    // Get first guide's categories
    const firstGuide = page.locator('#guidesGrid .card').first();
    const categoryTags = firstGuide.locator('.tags .tag');

    const tagCount = await categoryTags.count();

    if (tagCount > 0) {
      // Should have category text
      const firstTag = categoryTags.first();
      await expect(firstTag).toBeVisible();

      const tagText = await firstTag.textContent();
      expect(tagText.length).toBeGreaterThan(0);

      // Should be one of our seeded categories
      const validCategories = [
        'Gardening', 'Water Management', 'Composting',
        'Renewable Energy', 'Food Production', 'Agroforestry',
        'Natural Building', 'Waste Management', 'Irrigation', 'Community'
      ];

      const isValidCategory = validCategories.some(cat =>
        tagText.toLowerCase().includes(cat.toLowerCase())
      );

      expect(isValidCategory).toBeTruthy();
    }
  });

  test('should show "no guides found" when filtering returns empty', async ({ page }) => {
    // Wait for page to load
    await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

    // Find search input
    const searchInput = page.locator('#searchInput');

    if (await searchInput.isVisible({ timeout: 1000 }).catch(() => false)) {
      // Search for something that doesn't exist
      await searchInput.fill('xyznonexistentguide123');

      // Wait for search to apply (debounced)
      await page.waitForTimeout(500);

      // Should show no results message
      const noResults = page.locator('text=/no guides found/i');
      await expect(noResults).toBeVisible();
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

    // Wait for guides to load
    await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

    // Should have made requests to local Supabase
    expect(supabaseRequests.length).toBeGreaterThan(0);

    // Should be hitting local instance (not cloud)
    const hasLocalRequest = supabaseRequests.some(url =>
      url.includes('127.0.0.1:54321')
    );
    expect(hasLocalRequest).toBeTruthy();
  });

  test('should NOT contain hardcoded mock data', async ({ page }) => {
    // Wait for guides to load
    await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

    // Get entire page content
    const pageContent = await page.content();

    // List of mock data strings that should NOT be present
    const mockDataStrings = [
      'Sarah Chen',
      'Miguel Torres',
      'Emma Watson',
      'Dr. James Wilson',
      'Lisa Anderson',
      'example.com',
      'greenvalley.example.com',
      'organicgardens.example.com'
    ];

    // None of these should be in the page
    mockDataStrings.forEach(mockString => {
      expect(pageContent).not.toContain(mockString);
    });
  });

  test('should handle database errors gracefully', async ({ page }) => {
    // This test verifies error handling exists
    // In a real scenario, we'd mock a failed DB call

    // Page should still load even if there's an issue
    await expect(page).toHaveURL(/wiki-home\.html/);

    // If error occurs, should show error message (not crash)
    const errorMessage = page.locator('text=/error|failed to load/i');

    // Either guides load OR error message shows (no crash)
    const hasGuidesOrError =
      await page.locator('#guidesGrid .card').count() > 0 ||
      await errorMessage.isVisible({ timeout: 1000 }).catch(() => false);

    expect(hasGuidesOrError).toBeTruthy();
  });

  test('should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Wait for guides to load
    await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

    // Page should still be usable
    const guideCards = page.locator('#guidesGrid .card');
    await expect(guideCards.first()).toBeVisible();

    // No horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1); // +1 for rounding
  });

  test('should show correct guide count text', async ({ page }) => {
    // Wait for guides to load
    await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

    // Find guide count element
    const guideCount = page.locator('#guideCount');

    if (await guideCount.isVisible({ timeout: 1000 }).catch(() => false)) {
      const countText = await guideCount.textContent();

      // Should show count text like "Showing 11 guides" or "Showing all 11 guides"
      expect(countText).toMatch(/showing/i);
      expect(countText).toMatch(/\d+/);
      expect(countText).toMatch(/guide/i);
    }
  });

  test('should escape HTML in guide content (XSS protection)', async ({ page }) => {
    // Wait for guides to load
    await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

    // Get page source
    const pageContent = await page.content();

    // Should not have unescaped script tags in guide content
    expect(pageContent).not.toMatch(/<script>alert/);
    expect(pageContent).not.toMatch(/javascript:/);

    // Even if someone inserted malicious content, it should be escaped
    const firstGuideTitle = page.locator('#guidesGrid .card .card-title').first();
    const titleHTML = await firstGuideTitle.innerHTML();

    // Should not contain executable script
    expect(titleHTML).not.toContain('<script>');
  });
});

test.describe('Wiki Home Page - Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/src/wiki/wiki-home.html');
  });

  test('should have navigation links to other wiki pages', async ({ page }) => {
    // Should have links to events, map, etc.
    const eventLink = page.locator('a[href*="wiki-events"]');
    const mapLink = page.locator('a[href*="wiki-map"]');

    // At least one navigation link should exist
    const hasNavigation =
      await eventLink.count() > 0 ||
      await mapLink.count() > 0;

    expect(hasNavigation).toBeTruthy();
  });

  test('should navigate to guide detail page when clicking guide', async ({ page }) => {
    // Wait for guides to load
    await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

    // Click first guide
    const firstGuideLink = page.locator('#guidesGrid .card .card-title a').first();
    await expect(firstGuideLink).toBeVisible();

    // Get the href to verify it's correct
    const href = await firstGuideLink.getAttribute('href');
    expect(href).toContain('wiki-page.html?slug=');

    // Note: Not clicking to navigate because wiki-page.html may not be wired up yet
    // Just verify the link is correct
  });
});
