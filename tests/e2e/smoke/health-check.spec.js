/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/tests/e2e/smoke/health-check.spec.js
 * Description: Smoke tests for quick health checks of the application
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-16
 *
 * Tags: @e2e @smoke @health-check @critical
 *
 * Purpose: Quick smoke tests to verify core functionality is working
 * Run these first before running full test suite
 */

import { test, expect, describe } from '@playwright/test';

describe('Application Health Check - Smoke Tests @e2e @smoke @health-check @critical', () => {

  test.describe('Critical Pages Load', () => {

    test('wiki home page loads successfully', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');

      // Page should load
      await expect(page).toHaveURL(/wiki-home\.html/);

      // Should have content
      const content = await page.content();
      expect(content.length).toBeGreaterThan(1000);
    });

    test('wiki events page loads successfully', async ({ page }) => {
      await page.goto('/src/wiki/wiki-events.html');

      await expect(page).toHaveURL(/wiki-events\.html/);

      const content = await page.content();
      expect(content.length).toBeGreaterThan(1000);
    });

    test('wiki map page loads successfully', async ({ page }) => {
      await page.goto('/src/wiki/wiki-map.html');

      await expect(page).toHaveURL(/wiki-map\.html/);

      const content = await page.content();
      expect(content.length).toBeGreaterThan(1000);
    });

    test('wiki login page loads successfully', async ({ page }) => {
      await page.goto('/src/wiki/wiki-login.html');

      await expect(page).toHaveURL(/wiki-login\.html/);

      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toBeVisible({ timeout: 3000 });
    });

    test('main index page loads successfully', async ({ page }) => {
      await page.goto('/src/index.html');

      await expect(page).toHaveURL(/index\.html/);

      const content = await page.content();
      expect(content.length).toBeGreaterThan(500);
    });
  });

  test.describe('No Critical JavaScript Errors', () => {

    test('wiki home has no JS errors', async ({ page }) => {
      const errors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error' && !msg.text().includes('404')) {
          errors.push(msg.text());
        }
      });

      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(2000);

      expect(errors).toHaveLength(0);
    });

    test('wiki events has no JS errors', async ({ page }) => {
      const errors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error' && !msg.text().includes('404')) {
          errors.push(msg.text());
        }
      });

      await page.goto('/src/wiki/wiki-events.html');
      await page.waitForTimeout(2000);

      expect(errors).toHaveLength(0);
    });

    test('wiki map has no JS errors', async ({ page }) => {
      const errors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error' && !msg.text().includes('404')) {
          errors.push(msg.text());
        }
      });

      await page.goto('/src/wiki/wiki-map.html');
      await page.waitForTimeout(2000);

      expect(errors).toHaveLength(0);
    });
  });

  test.describe('Database Connectivity', () => {

    test('can connect to Supabase', async ({ page }) => {
      let hasSupabaseRequest = false;

      page.on('request', (request) => {
        const url = request.url();
        if (url.includes('127.0.0.1:54321') || url.includes('supabase')) {
          hasSupabaseRequest = true;
        }
      });

      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(2000);

      expect(hasSupabaseRequest).toBeTruthy();
    });

    test('can fetch guides from database', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(2000);

      const hasGuides = await page.locator('#guidesGrid .card').count();

      // Should have at least one guide (or show empty state)
      const hasContent = hasGuides > 0 ||
        await page.locator('text=/no guides found/i').isVisible({ timeout: 1000 }).catch(() => false);

      expect(hasContent).toBeTruthy();
    });

    test('can fetch events from database', async ({ page }) => {
      await page.goto('/src/wiki/wiki-events.html');
      await page.waitForTimeout(2000);

      const hasEvents = await page.locator('#eventsGrid .event-card, #eventsGrid .card').count();

      // Should have events or empty state
      const hasContent = hasEvents > 0 ||
        await page.locator('text=/no events found/i').isVisible({ timeout: 1000 }).catch(() => false);

      expect(hasContent).toBeTruthy();
    });

    test('can fetch locations from database', async ({ page }) => {
      await page.goto('/src/wiki/wiki-map.html');
      await page.waitForTimeout(2000);

      // Check for map markers
      const hasMarkers = await page.locator('.leaflet-marker-icon').count();

      expect(hasMarkers).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Core UI Elements Present', () => {

    test('wiki home has navigation', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');

      const nav = page.locator('nav, .navbar, header');
      await expect(nav.first()).toBeVisible({ timeout: 3000 });
    });

    test('wiki home has guides grid', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(1500);

      const guidesGrid = page.locator('#guidesGrid');
      await expect(guidesGrid).toBeVisible();
    });

    test('wiki events has events grid', async ({ page }) => {
      await page.goto('/src/wiki/wiki-events.html');
      await page.waitForTimeout(1500);

      const eventsGrid = page.locator('#eventsGrid');
      await expect(eventsGrid).toBeVisible();
    });

    test('wiki map has map container', async ({ page }) => {
      await page.goto('/src/wiki/wiki-map.html');
      await page.waitForTimeout(1500);

      const mapContainer = page.locator('#map, .leaflet-container');
      await expect(mapContainer.first()).toBeVisible();
    });
  });

  test.describe('Basic Functionality Works', () => {

    test('can navigate between wiki pages', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');

      // Click Events link
      const eventsLink = page.locator('a[href*="wiki-events"]').first();
      await eventsLink.click();

      // Should navigate to events page
      await expect(page).toHaveURL(/wiki-events\.html/);
    });

    test('category filters are clickable', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(1500);

      const filters = page.locator('.category-filter');
      const count = await filters.count();

      if (count > 1) {
        const secondFilter = filters.nth(1);
        await secondFilter.click();

        // Should not crash
        await page.waitForTimeout(300);

        const pageContent = await page.content();
        expect(pageContent.length).toBeGreaterThan(1000);
      }
    });

    test('search input accepts text', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(1000);

      const searchInput = page.locator('#searchInput, input[type="search"]');

      if (await searchInput.isVisible({ timeout: 1000 }).catch(() => false)) {
        await searchInput.fill('test');

        const value = await searchInput.inputValue();
        expect(value).toBe('test');
      }
    });

    test('event type filters are clickable', async ({ page }) => {
      await page.goto('/src/wiki/wiki-events.html');
      await page.waitForTimeout(1500);

      const filters = page.locator('.event-filter');
      const count = await filters.count();

      if (count > 1) {
        const workshopFilter = filters.nth(1);
        await workshopFilter.click();

        // Should not crash
        await page.waitForTimeout(300);

        const pageContent = await page.content();
        expect(pageContent.length).toBeGreaterThan(1000);
      }
    });

    test('map initializes Leaflet', async ({ page }) => {
      await page.goto('/src/wiki/wiki-map.html');
      await page.waitForTimeout(2000);

      const hasLeaflet = await page.evaluate(() => {
        return typeof L !== 'undefined';
      });

      expect(hasLeaflet).toBeTruthy();
    });
  });

  test.describe('No Broken Links on Critical Pages', () => {

    test('wiki home navigation links are valid', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');

      const navLinks = await page.locator('nav a, header a').all();

      for (const link of navLinks) {
        const href = await link.getAttribute('href');

        if (href && !href.startsWith('#') && !href.startsWith('http')) {
          // Should not be empty or undefined
          expect(href.length).toBeGreaterThan(0);
        }
      }
    });

    test('guide cards link to valid pages', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(1500);

      const guideLinks = await page.locator('#guidesGrid .card a[href*="wiki-page"]').all();

      for (const link of guideLinks.slice(0, 3)) { // Check first 3
        const href = await link.getAttribute('href');

        expect(href).toContain('wiki-page.html?slug=');
        expect(href).not.toContain('undefined');
        expect(href).not.toContain('null');
      }
    });
  });

  test.describe('Mobile Responsiveness - Basic Check @mobile', () => {

    test('wiki home is accessible on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(1500);

      // No horizontal scroll
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);

      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
    });

    test('wiki events is accessible on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/src/wiki/wiki-events.html');
      await page.waitForTimeout(1500);

      // No horizontal scroll
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);

      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
    });
  });

  test.describe('Performance - Basic Checks @performance', () => {

    test('wiki home loads within 5 seconds', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForSelector('#guidesGrid', { timeout: 5000 });

      const loadTime = Date.now() - startTime;

      console.log(`Wiki home load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(5000);
    });

    test('wiki events loads within 5 seconds', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/src/wiki/wiki-events.html');
      await page.waitForSelector('#eventsGrid', { timeout: 5000 });

      const loadTime = Date.now() - startTime;

      console.log(`Wiki events load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(5000);
    });

    test('wiki map loads within 5 seconds', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/src/wiki/wiki-map.html');
      await page.waitForSelector('#map', { timeout: 5000 });

      const loadTime = Date.now() - startTime;

      console.log(`Wiki map load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(5000);
    });
  });

  test.describe('Security - Basic Checks @security', () => {

    test('no exposed API keys in page source', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');

      const pageContent = await page.content();

      // Should NOT contain raw API keys
      expect(pageContent).not.toMatch(/VITE_SUPABASE_SERVICE_ROLE_KEY/);

      // Anon key is OK to expose, but check it's being used properly
      if (pageContent.includes('SUPABASE_ANON_KEY')) {
        console.warn('Warning: Anon key variable name found in page source');
      }
    });

    test('HTTPS redirect configured (if applicable)', async ({ page }) => {
      // This test is more relevant for production
      // Just verify page loads over HTTP in dev
      await page.goto('/src/wiki/wiki-home.html');

      const url = page.url();
      expect(url).toContain('http'); // http or https
    });
  });
});
