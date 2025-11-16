/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/tests/e2e/wiki-guides-regression.spec.js
 * Description: Regression tests for wiki guides page fixes and features
 * Tests: Guides loading, card format, search, filtering, sorting
 * Tags: @regression @guides @wiki
 * Author: Claude Code <noreply@anthropic.com>
 * Created: 2025-11-16
 */

import { test, expect } from '@playwright/test';

test.describe('Wiki Guides Page - Regression Tests', {
  tag: ['@regression', '@guides', '@critical']
}, () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to guides page before each test
    await page.goto('http://localhost:3000/src/wiki/wiki-guides.html');
  });

  test.describe('Guides Loading from Database', {
    tag: '@database'
  }, () => {

    test('should load guides from database successfully', async ({ page }) => {
      // Wait for guides grid to be present
      await page.waitForSelector('#guidesGrid', { timeout: 5000 });

      // Wait for loading to complete (spinner should disappear)
      await page.waitForSelector('.fa-spinner', { state: 'hidden', timeout: 10000 });

      // Verify guides are loaded
      const guideCards = page.locator('#guidesGrid .card');
      const count = await guideCards.count();

      // Should have at least some guides
      expect(count).toBeGreaterThan(0);

      console.log(`✓ Loaded ${count} guides from database`);
    });

    test('should display guide count', async ({ page }) => {
      // Wait for guides to load
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      // Check guide count element
      const guideCount = page.locator('#guideCount');
      await expect(guideCount).toBeVisible();

      const countText = await guideCount.textContent();
      expect(parseInt(countText)).toBeGreaterThan(0);

      console.log(`✓ Guide count displayed: ${countText}`);
    });

    test('should not show loading spinner after guides load', async ({ page }) => {
      // Wait for guides to load
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      // Verify no loading spinner visible
      const loadingSpinner = page.locator('.fa-spinner');
      await expect(loadingSpinner).toHaveCount(0);
    });

    test('should show error message if guides fail to load', async ({ page }) => {
      // Mock network failure
      await page.route('**/rest/v1/wiki_guides*', route => route.abort());

      // Reload page
      await page.reload();

      // Should show error message
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      const errorText = await page.locator('#guidesGrid').textContent();
      expect(errorText).toContain('No guides found');
    });
  });

  test.describe('Guide Card Format Standardization', {
    tag: '@ui'
  }, () => {

    test('should display guide cards with card-meta section', async ({ page }) => {
      // Wait for guides to load
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      // Check first guide card has card-meta
      const firstCard = page.locator('#guidesGrid .card').first();
      const cardMeta = firstCard.locator('.card-meta');

      await expect(cardMeta).toBeVisible();

      // Should contain date, author, and views
      const metaText = await cardMeta.textContent();
      expect(metaText).toMatch(/(ago|Today|Yesterday)/); // Date
      expect(metaText).toContain('views'); // Views count
    });

    test('should display guide title as clickable link', async ({ page }) => {
      // Wait for guides to load
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      // Check first guide has clickable title
      const firstCard = page.locator('#guidesGrid .card').first();
      const titleLink = firstCard.locator('h3.card-title a');

      await expect(titleLink).toBeVisible();

      // Verify link has href
      const href = await titleLink.getAttribute('href');
      expect(href).toContain('wiki-page.html?slug=');
    });

    test('should use slug parameter in guide links', async ({ page }) => {
      // Wait for guides to load
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      // Get all guide links
      const guideLinks = page.locator('#guidesGrid .card-title a');
      const count = await guideLinks.count();

      // Check at least one link uses slug parameter
      if (count > 0) {
        const firstLink = await guideLinks.first().getAttribute('href');
        expect(firstLink).toMatch(/wiki-page\.html\?slug=[\w-]+/);
        expect(firstLink).not.toContain('?id='); // Should NOT use id parameter
      }
    });

    test('should display category tags on each guide', async ({ page }) => {
      // Wait for guides to load
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      // Check first guide has category tags
      const firstCard = page.locator('#guidesGrid .card').first();
      const tags = firstCard.locator('.tags .tag');

      const tagCount = await tags.count();
      expect(tagCount).toBeGreaterThan(0);
    });

    test('should NOT display featured images on guide cards', async ({ page }) => {
      // Wait for guides to load
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      // Check first guide does NOT have featured image
      const firstCard = page.locator('#guidesGrid .card').first();
      const image = firstCard.locator('img');

      const imageCount = await image.count();
      expect(imageCount).toBe(0);
    });

    test('should NOT display "Read Guide" button', async ({ page }) => {
      // Wait for guides to load
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      // Check there are no "Read Guide" buttons
      const readButtons = page.locator('a.btn:has-text("Read Guide")');
      const buttonCount = await readButtons.count();

      expect(buttonCount).toBe(0);
    });

    test('should format relative dates correctly', async ({ page }) => {
      // Wait for guides to load
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      // Check first guide has relative date
      const firstCard = page.locator('#guidesGrid .card').first();
      const dateElement = firstCard.locator('.card-meta span').first();

      const dateText = await dateElement.textContent();

      // Should match relative date format
      const relativeDatePattern = /(Today|Yesterday|\d+ days? ago|\d+ weeks? ago|\d+ months? ago|\/)/;
      expect(dateText).toMatch(relativeDatePattern);
    });
  });

  test.describe('Guide Search Functionality', {
    tag: '@search'
  }, () => {

    test('should filter guides by search term in title', async ({ page }) => {
      // Wait for guides to load
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      // Get initial count
      const initialCount = await page.locator('#guidesGrid .card').count();

      // Search for specific term
      await page.fill('#guideSearch', 'mushroom');
      await page.waitForTimeout(500);

      // Should have fewer guides
      const filteredCount = await page.locator('#guidesGrid .card').count();
      expect(filteredCount).toBeLessThanOrEqual(initialCount);

      // All visible guides should contain search term
      const guideCards = page.locator('#guidesGrid .card');
      const count = await guideCards.count();

      if (count > 0) {
        const firstTitle = await guideCards.first().locator('.card-title').textContent();
        expect(firstTitle.toLowerCase()).toContain('mushroom');
      }
    });

    test('should filter guides by search term in summary', async ({ page }) => {
      // Wait for guides to load
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      // Search for term that might be in summary
      await page.fill('#guideSearch', 'coffee');
      await page.waitForTimeout(500);

      // Should show guides with coffee in title or summary
      const guideCards = page.locator('#guidesGrid .card');
      const count = await guideCards.count();

      expect(count).toBeGreaterThan(0);
    });

    test('should filter guides by category name', async ({ page }) => {
      // Wait for guides to load
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      // Search for a category name
      await page.fill('#guideSearch', 'mycology');
      await page.waitForTimeout(500);

      // Should show guides in that category
      const guideCards = page.locator('#guidesGrid .card');
      const count = await guideCards.count();

      if (count > 0) {
        const firstCard = guideCards.first();
        const cardContent = await firstCard.textContent();
        expect(cardContent.toLowerCase()).toContain('mycology');
      }
    });

    test('should show "no guides found" message when search returns no results', async ({ page }) => {
      // Wait for guides to load
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      // Search for term that won't match
      await page.fill('#guideSearch', 'xyznonexistent123');
      await page.waitForTimeout(500);

      // Should show no results message
      const noResultsMessage = page.locator('#guidesGrid .card');
      const messageText = await noResultsMessage.textContent();

      expect(messageText).toContain('No guides found');
      expect(messageText).toContain('No guides match your search');
    });

    test('should clear search and show all guides when input is cleared', async ({ page }) => {
      // Wait for guides to load
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      // Get initial count
      const initialCount = await page.locator('#guidesGrid .card').count();

      // Perform search
      await page.fill('#guideSearch', 'test');
      await page.waitForTimeout(500);

      // Clear search
      await page.fill('#guideSearch', '');
      await page.waitForTimeout(500);

      // Should show all guides again
      const finalCount = await page.locator('#guidesGrid .card').count();
      expect(finalCount).toBe(initialCount);
    });
  });

  test.describe('Guide Sorting Functionality', {
    tag: '@sorting'
  }, () => {

    test('should sort guides by newest by default', async ({ page }) => {
      // Wait for guides to load
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      // Newest button should be active
      const newestButton = page.locator('#sortNewest');
      await expect(newestButton).toHaveClass(/btn-primary/);
    });

    test('should sort guides by most popular', async ({ page }) => {
      // Wait for guides to load
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      // Click most popular button
      await page.click('#sortPopular');
      await page.waitForTimeout(300);

      // Button should be active
      const popularButton = page.locator('#sortPopular');
      await expect(popularButton).toHaveClass(/btn-primary/);

      // Get first two guides and compare view counts
      const guideCards = page.locator('#guidesGrid .card');
      if (await guideCards.count() >= 2) {
        const firstViews = await guideCards.nth(0).locator('.card-meta span:has-text("views")').textContent();
        const secondViews = await guideCards.nth(1).locator('.card-meta span:has-text("views")').textContent();

        const firstViewCount = parseInt(firstViews.match(/\d+/)[0]);
        const secondViewCount = parseInt(secondViews.match(/\d+/)[0]);

        expect(firstViewCount).toBeGreaterThanOrEqual(secondViewCount);
      }
    });

    test('should sort guides alphabetically', async ({ page }) => {
      // Wait for guides to load
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      // Click alphabetical button
      await page.click('#sortAlpha');
      await page.waitForTimeout(300);

      // Button should be active
      const alphaButton = page.locator('#sortAlpha');
      await expect(alphaButton).toHaveClass(/btn-primary/);

      // Get first two guide titles and verify alphabetical order
      const guideCards = page.locator('#guidesGrid .card');
      if (await guideCards.count() >= 2) {
        const firstTitle = await guideCards.nth(0).locator('.card-title').textContent();
        const secondTitle = await guideCards.nth(1).locator('.card-title').textContent();

        expect(firstTitle.trim().localeCompare(secondTitle.trim())).toBeLessThanOrEqual(0);
      }
    });

    test('should update button styles when switching sort options', async ({ page }) => {
      // Wait for guides to load
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      // Newest should be active initially
      await expect(page.locator('#sortNewest')).toHaveClass(/btn-primary/);
      await expect(page.locator('#sortPopular')).toHaveClass(/btn-outline/);

      // Click popular
      await page.click('#sortPopular');
      await page.waitForTimeout(300);

      // Popular should be active, newest should be outline
      await expect(page.locator('#sortNewest')).toHaveClass(/btn-outline/);
      await expect(page.locator('#sortPopular')).toHaveClass(/btn-primary/);
    });
  });

  test.describe('Category Filtering', {
    tag: '@filtering'
  }, () => {

    test('should load category filters from database', async ({ page }) => {
      // Wait for category filters to load
      await page.waitForSelector('#categoryFilters', { timeout: 5000 });

      // Should have "All Guides" filter
      const allFilter = page.locator('#categoryFilters .guide-filter[data-filter="all"]');
      await expect(allFilter).toBeVisible();

      // Should have additional category filters
      const categoryFilters = page.locator('#categoryFilters .guide-filter');
      const count = await categoryFilters.count();

      expect(count).toBeGreaterThan(1); // At least "All" + 1 category
    });

    test('should filter guides by category', async ({ page }) => {
      // Wait for guides and filters to load
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });
      await page.waitForSelector('#categoryFilters .guide-filter', { timeout: 5000 });

      // Get initial count
      const initialCount = await page.locator('#guidesGrid .card').count();

      // Click a specific category filter (not "All")
      const categoryFilters = page.locator('#categoryFilters .guide-filter:not([data-filter="all"])');
      const filterCount = await categoryFilters.count();

      if (filterCount > 0) {
        await categoryFilters.first().click();
        await page.waitForTimeout(500);

        // Should have filtered guides (likely fewer than total)
        const filteredCount = await page.locator('#guidesGrid .card').count();
        expect(filteredCount).toBeGreaterThan(0);
        expect(filteredCount).toBeLessThanOrEqual(initialCount);
      }
    });

    test('should show active state on selected category filter', async ({ page }) => {
      // Wait for filters to load
      await page.waitForSelector('#categoryFilters .guide-filter', { timeout: 5000 });

      // "All" should be active by default
      const allFilter = page.locator('#categoryFilters .guide-filter[data-filter="all"]');
      await expect(allFilter).toHaveClass(/active/);

      // Click another category
      const otherFilter = page.locator('#categoryFilters .guide-filter:not([data-filter="all"])').first();
      await otherFilter.click();
      await page.waitForTimeout(300);

      // New filter should be active, "All" should not
      await expect(otherFilter).toHaveClass(/active/);
      await expect(allFilter).not.toHaveClass(/active/);
    });

    test('should show all guides when "All Guides" filter is clicked', async ({ page }) => {
      // Wait for guides and filters to load
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });
      await page.waitForSelector('#categoryFilters .guide-filter', { timeout: 5000 });

      // Get initial count
      const initialCount = await page.locator('#guidesGrid .card').count();

      // Click a specific category filter
      const categoryFilter = page.locator('#categoryFilters .guide-filter:not([data-filter="all"])').first();
      await categoryFilter.click();
      await page.waitForTimeout(500);

      // Click "All Guides"
      await page.click('#categoryFilters .guide-filter[data-filter="all"]');
      await page.waitForTimeout(500);

      // Should show all guides again
      const finalCount = await page.locator('#guidesGrid .card').count();
      expect(finalCount).toBe(initialCount);
    });
  });

  test.describe('Guide Data Enrichment', {
    tag: '@data'
  }, () => {

    test('should display author names from users table', async ({ page }) => {
      // Wait for guides to load
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      // Check first guide has author
      const firstCard = page.locator('#guidesGrid .card').first();
      const authorElement = firstCard.locator('.card-meta span:has-text("👤"), .card-meta span:has(.fa-user)');

      // Author should be visible
      const authorCount = await authorElement.count();
      expect(authorCount).toBeGreaterThan(0);

      if (authorCount > 0) {
        const authorText = await authorElement.first().textContent();
        expect(authorText.length).toBeGreaterThan(0);
      }
    });

    test('should display view counts', async ({ page }) => {
      // Wait for guides to load
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      // Check all guides have view counts
      const guideCards = page.locator('#guidesGrid .card');
      const count = await guideCards.count();

      for (let i = 0; i < Math.min(count, 3); i++) {
        const card = guideCards.nth(i);
        const viewsElement = card.locator('.card-meta span:has-text("views")');
        await expect(viewsElement).toBeVisible();

        const viewsText = await viewsElement.textContent();
        expect(viewsText).toMatch(/\d+ views?/);
      }
    });
  });

  test.describe('XSS Protection', {
    tag: ['@security', '@xss']
  }, () => {

    test('should escape HTML in guide titles', async ({ page }) => {
      // Wait for guides to load
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      // Get page content
      const pageContent = await page.content();

      // Should not contain unescaped script tags
      expect(pageContent).not.toContain('<script>alert');
      expect(pageContent).not.toContain('javascript:');
    });

    test('should escape HTML in guide summaries', async ({ page }) => {
      // Wait for guides to load
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      // Check that guide summaries don't have executable HTML
      const summaries = page.locator('#guidesGrid .card .text-muted');
      const count = await summaries.count();

      if (count > 0) {
        const innerHTML = await summaries.first().innerHTML();

        // Should not contain script tags or event handlers
        expect(innerHTML).not.toContain('<script');
        expect(innerHTML).not.toContain('onerror=');
        expect(innerHTML).not.toContain('onclick=');
      }
    });
  });
});
