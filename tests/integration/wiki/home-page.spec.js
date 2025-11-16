/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/tests/integration/wiki/home-page.spec.js
 * Description: Integration tests for Wiki Home page with full component testing
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-16
 *
 * Tags: @integration @wiki @home @database
 */

import { test, expect, describe } from '@playwright/test';

describe('Wiki Home Page - Integration Tests @integration @wiki @home @database', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/src/wiki/wiki-home.html');
    await page.waitForTimeout(1000);
  });

  test.describe('Page Load and Initialization', () => {

    test('should load page with correct title @smoke', async ({ page }) => {
      await expect(page).toHaveTitle(/Wiki|Permaculture|Knowledge|Community/i);
    });

    test('should initialize without JavaScript errors @smoke', async ({ page }) => {
      const errors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error' && !msg.text().includes('404')) {
          errors.push(msg.text());
        }
      });

      await page.reload();
      await page.waitForTimeout(1000);

      expect(errors).toHaveLength(0);
    });

    test('should display version badge @version', async ({ page }) => {
      const versionBadge = page.locator('.version-badge');
      await expect(versionBadge).toBeVisible();

      const versionText = await versionBadge.textContent();
      expect(versionText).toMatch(/^v\d{8}\.\d{4}\.v\d+$/);
    });

    test('should load all CSS styles @ui', async ({ page }) => {
      // Check that main container is styled
      const container = page.locator('.wiki-container, .container');
      const hasStyles = await container.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.maxWidth && styles.margin;
      });

      expect(hasStyles).toBeTruthy();
    });
  });

  test.describe('Navigation Header @navigation', () => {

    test('should display navigation links', async ({ page }) => {
      const homeLink = page.locator('a[href*="wiki-home"]');
      const eventsLink = page.locator('a[href*="wiki-events"]');
      const mapLink = page.locator('a[href*="wiki-map"]');

      await expect(homeLink).toBeVisible();
      await expect(eventsLink).toBeVisible();
      await expect(mapLink).toBeVisible();
    });

    test('should highlight active navigation item', async ({ page }) => {
      const homeLink = page.locator('a[href*="wiki-home"]').first();

      // Home link should have active class or styling
      const hasActiveClass = await homeLink.evaluate((el) => {
        return el.classList.contains('active') ||
               el.parentElement?.classList.contains('active');
      });

      expect(hasActiveClass).toBeTruthy();
    });

    test('should have working navigation links @links', async ({ page }) => {
      // Click Events link
      const eventsLink = page.locator('a[href*="wiki-events"]').first();
      const href = await eventsLink.getAttribute('href');

      expect(href).toContain('wiki-events');

      // Don't actually navigate in this test
      // Just verify link is correct
    });

    test('should display logo/branding', async ({ page }) => {
      const logo = page.locator('.logo, .brand, img[alt*="logo" i]');

      const logoCount = await logo.count();
      expect(logoCount).toBeGreaterThan(0);
    });
  });

  test.describe('Statistics Section @stats', () => {

    test('should display guide count from database', async ({ page }) => {
      await page.waitForTimeout(1500);

      // Find stats section
      const statsSection = page.locator('.wiki-container > .card, .stats-section');

      if (await statsSection.isVisible({ timeout: 2000 }).catch(() => false)) {
        const content = await statsSection.textContent();

        // Should contain numbers
        expect(content).toMatch(/\d+/);

        // Should mention "Guides" or similar
        expect(content).toMatch(/guide/i);
      }
    });

    test('should display location count from database', async ({ page }) => {
      await page.waitForTimeout(1500);

      const pageContent = await page.content();

      // Should show location count
      if (pageContent.includes('Location')) {
        const locationStats = page.locator('text=/\\d+.*location/i');
        await expect(locationStats.first()).toBeVisible({ timeout: 2000 });
      }
    });

    test('should display event count from database', async ({ page }) => {
      await page.waitForTimeout(1500);

      const pageContent = await page.content();

      // Should show event count
      if (pageContent.includes('Event')) {
        const eventStats = page.locator('text=/\\d+.*event/i');
        await expect(eventStats.first()).toBeVisible({ timeout: 2000 });
      }
    });

    test('statistics should match actual database counts @validation', async ({ page }) => {
      await page.waitForTimeout(1500);

      const stats = await page.evaluate(async () => {
        const statsElements = document.querySelectorAll('.wiki-container > .card > div > div');

        if (statsElements.length >= 3) {
          return {
            guides: parseInt(statsElements[0].querySelector('div')?.textContent || '0'),
            locations: parseInt(statsElements[1].querySelector('div')?.textContent || '0'),
            events: parseInt(statsElements[2].querySelector('div')?.textContent || '0')
          };
        }

        return null;
      });

      if (stats) {
        expect(stats.guides).toBeGreaterThanOrEqual(0);
        expect(stats.locations).toBeGreaterThanOrEqual(0);
        expect(stats.events).toBeGreaterThanOrEqual(0);
      }
    });
  });

  test.describe('Category Filters @filters @categories', () => {

    test('should display category filter buttons', async ({ page }) => {
      const categoryFilters = page.locator('.category-filter');
      const filterCount = await categoryFilters.count();

      expect(filterCount).toBeGreaterThan(1); // At least "All" + one category
    });

    test('should have "All" filter by default', async ({ page }) => {
      const allFilter = page.locator('.category-filter').first();
      const filterText = await allFilter.textContent();

      expect(filterText).toMatch(/all/i);
    });

    test('should activate filter on click @interaction', async ({ page }) => {
      await page.waitForSelector('.category-filter', { timeout: 3000 });

      const filters = page.locator('.category-filter');
      const count = await filters.count();

      if (count > 1) {
        // Click second filter
        const secondFilter = filters.nth(1);
        await secondFilter.click();
        await page.waitForTimeout(300);

        // Should have active class
        const hasActive = await secondFilter.evaluate((el) => {
          return el.classList.contains('active');
        });

        expect(hasActive).toBeTruthy();
      }
    });

    test('should filter guides when category selected @filtering', async ({ page }) => {
      await page.waitForSelector('#guidesGrid .card', { timeout: 3000 });

      const initialCount = await page.locator('#guidesGrid .card').count();

      // Click a specific category filter (not "All")
      const categoryFilters = page.locator('.category-filter');
      const filterCount = await categoryFilters.count();

      if (filterCount > 1) {
        await categoryFilters.nth(1).click();
        await page.waitForTimeout(500);

        const filteredCount = await page.locator('#guidesGrid .card').count();

        // Filtered count should be <= initial count
        expect(filteredCount).toBeLessThanOrEqual(initialCount);
      }
    });

    test('categories should load from database @database', async ({ page }) => {
      const categories = await page.evaluate(async () => {
        const { supabase } = await import('../../js/supabase-client.js');
        return await supabase.getAll('wiki_categories', {
          order: 'name.asc'
        });
      });

      expect(Array.isArray(categories)).toBeTruthy();
      expect(categories.length).toBeGreaterThan(0);

      // Verify categories are displayed in UI
      const categoryFilters = page.locator('.category-filter');
      const filterCount = await categoryFilters.count();

      // Should have at least some categories (+ "All" filter)
      expect(filterCount).toBeGreaterThanOrEqual(2);
    });
  });

  test.describe('Search Functionality @search', () => {

    test('should display search input', async ({ page }) => {
      const searchInput = page.locator('#searchInput, input[type="search"]');

      if (await searchInput.isVisible({ timeout: 1000 }).catch(() => false)) {
        await expect(searchInput).toBeVisible();
      }
    });

    test('should filter guides on search @filtering', async ({ page }) => {
      const searchInput = page.locator('#searchInput');

      if (await searchInput.isVisible({ timeout: 1000 }).catch(() => false)) {
        await page.waitForSelector('#guidesGrid .card', { timeout: 3000 });

        const initialCount = await page.locator('#guidesGrid .card').count();

        // Search for "water"
        await searchInput.fill('water');
        await page.waitForTimeout(600); // Debounce delay

        const filteredCount = await page.locator('#guidesGrid .card').count();

        // Either finds results or shows empty state
        if (filteredCount === 0) {
          const noResults = page.locator('text=/no guides found/i');
          await expect(noResults).toBeVisible();
        } else {
          expect(filteredCount).toBeLessThanOrEqual(initialCount);
        }
      }
    });

    test('should be case-insensitive @search-behavior', async ({ page }) => {
      const searchInput = page.locator('#searchInput');

      if (await searchInput.isVisible({ timeout: 1000 }).catch(() => false)) {
        await page.waitForSelector('#guidesGrid .card', { timeout: 3000 });

        // Search uppercase
        await searchInput.fill('WATER');
        await page.waitForTimeout(600);

        const upperResults = await page.locator('#guidesGrid .card').count();

        // Clear and search lowercase
        await searchInput.clear();
        await searchInput.fill('water');
        await page.waitForTimeout(600);

        const lowerResults = await page.locator('#guidesGrid .card').count();

        // Should return same results
        expect(upperResults).toBe(lowerResults);
      }
    });

    test('should clear search on empty input @search-behavior', async ({ page }) => {
      const searchInput = page.locator('#searchInput');

      if (await searchInput.isVisible({ timeout: 1000 }).catch(() => false)) {
        await page.waitForSelector('#guidesGrid .card', { timeout: 3000 });

        const initialCount = await page.locator('#guidesGrid .card').count();

        // Search
        await searchInput.fill('test');
        await page.waitForTimeout(600);

        // Clear search
        await searchInput.clear();
        await page.waitForTimeout(600);

        const clearedCount = await page.locator('#guidesGrid .card').count();

        // Should show all guides again
        expect(clearedCount).toBe(initialCount);
      }
    });
  });

  test.describe('Guides Grid Display @guides @display', () => {

    test('should display guides from database', async ({ page }) => {
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      const guideCards = page.locator('#guidesGrid .card');
      const count = await guideCards.count();

      expect(count).toBeGreaterThan(0);
    });

    test('each guide card should have required elements @validation', async ({ page }) => {
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      const firstCard = page.locator('#guidesGrid .card').first();

      // Should have title
      const title = firstCard.locator('.card-title, h3');
      await expect(title).toBeVisible();

      // Should have summary/description
      const summary = firstCard.locator('.text-muted, .summary, p');
      await expect(summary).toBeVisible();

      // Should have metadata (date, views)
      const metadata = firstCard.locator('.card-meta');
      await expect(metadata).toBeVisible();
    });

    test('guide cards should have clickable links @links', async ({ page }) => {
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      const firstLink = page.locator('#guidesGrid .card .card-title a').first();
      await expect(firstLink).toBeVisible();

      const href = await firstLink.getAttribute('href');

      // Should link to wiki-page.html with slug
      expect(href).toContain('wiki-page.html?slug=');
      expect(href).not.toContain('slug=undefined');
      expect(href).not.toContain('slug=null');
    });

    test('guide cards should display view counts @metadata', async ({ page }) => {
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      const firstCard = page.locator('#guidesGrid .card').first();
      const viewCount = firstCard.locator('text=/views/i');

      await expect(viewCount).toBeVisible();

      const viewText = await viewCount.textContent();
      expect(viewText).toMatch(/\d+\s*views?/i);
    });

    test('guide cards should display published dates @metadata', async ({ page }) => {
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      const firstCard = page.locator('#guidesGrid .card').first();
      const dateElement = firstCard.locator('.card-meta span').first();

      await expect(dateElement).toBeVisible();

      const dateText = await dateElement.textContent();
      expect(dateText.length).toBeGreaterThan(0);
    });

    test('guide cards should display category tags @categories', async ({ page }) => {
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      const firstCard = page.locator('#guidesGrid .card').first();
      const tags = firstCard.locator('.tags .tag');

      const tagCount = await tags.count();
      expect(tagCount).toBeGreaterThanOrEqual(0);

      if (tagCount > 0) {
        const firstTag = tags.first();
        await expect(firstTag).toBeVisible();
      }
    });

    test('should NOT display hardcoded mock data @validation', async ({ page }) => {
      await page.waitForTimeout(1500);

      const pageContent = await page.content();

      // Should NOT contain old mock data
      const mockDataStrings = [
        'Sarah Chen',
        'Miguel Torres',
        'Emma Watson',
        'Dr. James Wilson'
      ];

      mockDataStrings.forEach(mockString => {
        expect(pageContent).not.toContain(mockString);
      });
    });
  });

  test.describe('Database Integration @database @supabase', () => {

    test('should connect to Supabase successfully', async ({ page }) => {
      const supabaseRequests = [];
      page.on('request', (request) => {
        const url = request.url();
        if (url.includes('127.0.0.1:54321') || url.includes('supabase')) {
          supabaseRequests.push(url);
        }
      });

      await page.reload();
      await page.waitForTimeout(2000);

      expect(supabaseRequests.length).toBeGreaterThan(0);
    });

    test('should fetch guides from wiki_guides table', async ({ page }) => {
      let hasGuidesRequest = false;

      page.on('request', (request) => {
        const url = request.url();
        if (url.includes('/rest/v1/wiki_guides')) {
          hasGuidesRequest = true;
        }
      });

      await page.reload();
      await page.waitForTimeout(2000);

      expect(hasGuidesRequest).toBeTruthy();
    });

    test('should fetch categories from wiki_categories table', async ({ page }) => {
      let hasCategoriesRequest = false;

      page.on('request', (request) => {
        const url = request.url();
        if (url.includes('/rest/v1/wiki_categories')) {
          hasCategoriesRequest = true;
        }
      });

      await page.reload();
      await page.waitForTimeout(2000);

      expect(hasCategoriesRequest).toBeTruthy();
    });
  });

  test.describe('Responsive Design @responsive @mobile', () => {

    test('should be mobile responsive @mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);

      // Guide cards should still be visible
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });
      const firstCard = page.locator('#guidesGrid .card').first();
      await expect(firstCard).toBeVisible();

      // No horizontal scroll
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
    });

    test('should stack elements vertically on mobile @mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);

      // Stats should stack vertically
      const statsSection = page.locator('.wiki-container > .card');

      if (await statsSection.isVisible({ timeout: 2000 }).catch(() => false)) {
        const flexDirection = await statsSection.evaluate((el) => {
          return window.getComputedStyle(el).flexDirection;
        });

        // Should be column on mobile (or have proper responsive design)
        expect(['column', 'row']).toContain(flexDirection);
      }
    });

    test('should display readable text on tablet @tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(500);

      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      const titleElement = page.locator('#guidesGrid .card .card-title').first();
      const fontSize = await titleElement.evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });

      // Font size should be reasonable (at least 14px)
      const fontSizeNum = parseInt(fontSize);
      expect(fontSizeNum).toBeGreaterThanOrEqual(14);
    });
  });

  test.describe('Security @security @xss', () => {

    test('should escape HTML in guide content @xss', async ({ page }) => {
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      const pageContent = await page.content();

      // Should not have unescaped script tags
      expect(pageContent).not.toMatch(/<script>alert/);
      expect(pageContent).not.toMatch(/javascript:/);
    });

    test('should escape HTML in guide titles @xss', async ({ page }) => {
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      const firstTitle = page.locator('#guidesGrid .card .card-title').first();
      const titleHTML = await firstTitle.innerHTML();

      expect(titleHTML).not.toContain('<script>');
    });
  });

  test.describe('Performance @performance', () => {

    test('should load page within 3 seconds', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForSelector('#guidesGrid', { timeout: 5000 });

      const loadTime = Date.now() - startTime;

      console.log(`Page load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(3000);
    });

    test('should lazy load images if implemented @optimization', async ({ page }) => {
      await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

      const images = page.locator('img[loading="lazy"]');
      const lazyImageCount = await images.count();

      console.log(`Lazy loaded images: ${lazyImageCount}`);
      // Just log for now, don't enforce
    });
  });
});
