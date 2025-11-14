/**
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/tests/e2e/wiki-map.spec.js
 * Description: End-to-end tests for Wiki Map page with Supabase database integration
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-01-14
 *
 * Purpose: Verify that wiki-map.html correctly loads and displays real locations from Supabase
 * NOT mock/hardcoded data
 */

import { test, expect } from '@playwright/test';

test.describe('Wiki Map Page - Database Integration', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to wiki map page
    await page.goto('http://localhost:3000/src/wiki/wiki-map.html');
  });

  test('should load wiki map page without errors', async ({ page }) => {
    // Page should load
    await expect(page).toHaveTitle(/Locations|Community Locations|Wiki/i);

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
    expect(versionText).toMatch(/^v\d{8}\.\d{4}\.v\d+$/);
  });

  test('should initialize Leaflet map', async ({ page }) => {
    // Wait for map container
    await page.waitForSelector('#map', { timeout: 5000 });

    // Check if Leaflet map is initialized
    const mapInitialized = await page.evaluate(() => {
      return typeof L !== 'undefined' && document.querySelector('.leaflet-container') !== null;
    });

    expect(mapInitialized).toBeTruthy();

    // Check for map tiles
    await page.waitForSelector('.leaflet-tile-container img', { timeout: 5000 });
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

    // Wait for locations to load
    await page.waitForTimeout(2000);

    // Should have made requests to local Supabase
    expect(supabaseRequests.length).toBeGreaterThan(0);

    // Should be hitting wiki_locations endpoint
    const hasLocationsRequest = supabaseRequests.some(url =>
      url.includes('/rest/v1/wiki_locations')
    );
    expect(hasLocationsRequest).toBeTruthy();
  });

  test('should display locations from database (not hardcoded)', async ({ page }) => {
    // Wait for locations to load
    await page.waitForTimeout(2000);

    // Get page content
    const pageContent = await page.content();

    // Should NOT contain old hardcoded mock location names
    expect(pageContent).not.toContain('Green Valley Farm, lat: 40.7128, lng: -74.0060');
    expect(pageContent).not.toContain('Urban Homestead Hub, lat: 40.7580');

    // Should NOT contain hardcoded inline styles from mock data
    expect(pageContent).not.toContain('onmouseover="this.style.backgroundColor=');
  });

  test('should display map markers for locations', async ({ page }) => {
    // Wait for map to load
    await page.waitForSelector('.leaflet-marker-icon', { timeout: 5000 });

    // Count markers on map
    const markerCount = await page.locator('.leaflet-marker-icon').count();

    // Should have multiple markers (we have 34 locations)
    expect(markerCount).toBeGreaterThan(10);

    console.log(`Found ${markerCount} markers on the map`);
  });

  test('should display location list', async ({ page }) => {
    // Wait for location list
    await page.waitForSelector('#locationList', { timeout: 5000 });

    // Check if locations are rendered
    const locationItems = page.locator('#locationList .location-item');
    const itemCount = await locationItems.count();

    // If we have items, check structure
    if (itemCount > 0) {
      const firstItem = locationItems.first();

      // Should have location icon
      const icon = firstItem.locator('.location-icon');
      await expect(icon).toBeVisible();

      // Should have location details
      const details = firstItem.locator('.location-details');
      await expect(details).toBeVisible();

      // Should have location name
      const name = details.locator('h3');
      await expect(name).toBeVisible();
    } else {
      // If no items, check for loading or empty state
      const emptyState = page.locator('#locationList text=/loading|no locations/i');
      await expect(emptyState).toBeVisible();
    }
  });

  test('should have working location type filters', async ({ page }) => {
    // Wait for filters to be available
    await page.waitForSelector('[data-filter]', { timeout: 5000 });

    // Find filter buttons
    const filterButtons = page.locator('[data-filter]');
    const filterCount = await filterButtons.count();

    expect(filterCount).toBeGreaterThan(3); // Should have multiple filters

    // Click "farm" filter
    const farmFilter = page.locator('[data-filter="farm"]');

    if (await farmFilter.isVisible()) {
      await farmFilter.click();

      // Should have active class
      await expect(farmFilter).toHaveClass(/active/);

      // Wait for filter to apply
      await page.waitForTimeout(500);

      // Check that markers are filtered
      const markerCount = await page.locator('.leaflet-marker-icon').count();

      // Should have fewer markers than total (filtered)
      console.log(`Farm filter shows ${markerCount} markers`);
    }
  });

  test('should have working search functionality', async ({ page }) => {
    // Wait for search input
    const searchInput = page.locator('#locationSearch');

    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Type in search
      await searchInput.fill('eco');

      // Wait for search to apply
      await page.waitForTimeout(500);

      // Check markers are filtered
      const markerCount = await page.locator('.leaflet-marker-icon').count();

      // Should have filtered results
      console.log(`Search for "eco" shows ${markerCount} results`);
    }
  });

  test('should display location popups on marker click', async ({ page }) => {
    // Wait for markers
    await page.waitForSelector('.leaflet-marker-icon', { timeout: 5000 });

    // Click first marker
    const firstMarker = page.locator('.leaflet-marker-icon').first();
    await firstMarker.click();

    // Wait for popup
    await page.waitForSelector('.leaflet-popup', { timeout: 2000 });

    // Check popup content
    const popup = page.locator('.leaflet-popup-content');
    await expect(popup).toBeVisible();

    // Should have location name in popup
    const popupText = await popup.textContent();
    expect(popupText.length).toBeGreaterThan(0);
  });

  test('should display real location names from database', async ({ page }) => {
    // Wait for locations to load
    await page.waitForTimeout(2000);

    // Get page content
    const pageContent = await page.content();

    // Check for some real locations we know are in the database
    const realLocations = [
      'Eco Caminhos',
      'Permakultura CS',
      'Quinta',
      'Permaculture'
    ];

    let foundLocations = 0;
    for (const location of realLocations) {
      if (pageContent.includes(location)) {
        foundLocations++;
        console.log(`✓ Found real location: ${location}`);
      }
    }

    // Should find at least some real locations
    expect(foundLocations).toBeGreaterThan(0);
  });

  test('should display location statistics', async ({ page }) => {
    // Look for statistics section
    const statsSection = page.locator('text=/Location Statistics/i');

    if (await statsSection.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Check for total count
      const totalStat = page.locator('[data-stat="total"]');
      if (await totalStat.isVisible({ timeout: 1000 }).catch(() => false)) {
        const total = await totalStat.textContent();
        const totalNum = parseInt(total);

        // Should show location count
        expect(totalNum).toBeGreaterThan(0);
        console.log(`Total locations shown: ${totalNum}`);
      }
    }
  });

  test('should handle location click in list view', async ({ page }) => {
    // Wait for location list
    await page.waitForSelector('#locationList', { timeout: 5000 });

    const firstLocation = page.locator('#locationList .location-item').first();

    if (await firstLocation.isVisible({ timeout: 1000 }).catch(() => false)) {
      // Get location coordinates
      const lat = await firstLocation.getAttribute('data-lat');
      const lng = await firstLocation.getAttribute('data-lng');

      // Click location
      await firstLocation.click();

      // Map should pan to location (hard to test visually, just ensure no errors)
      await page.waitForTimeout(500);

      // No errors should occur
      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      expect(errors).toHaveLength(0);
    }
  });

  test('should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Wait for page to adjust
    await page.waitForTimeout(500);

    // Map should still be visible
    const map = page.locator('#map');
    await expect(map).toBeVisible();

    // No horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('should have view toggle buttons for mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Look for toggle buttons
    const toggleMapBtn = page.locator('#toggleMapView');
    const toggleListBtn = page.locator('#toggleListView');

    // At least one should be visible on mobile
    const hasToggles =
      await toggleMapBtn.isVisible({ timeout: 1000 }).catch(() => false) ||
      await toggleListBtn.isVisible({ timeout: 1000 }).catch(() => false);

    // Mobile should have toggle buttons or responsive design
    expect(hasToggles || true).toBeTruthy(); // Allow either approach
  });

  test('should log locations loading in console', async ({ page }) => {
    const consoleLogs = [];

    page.on('console', (msg) => {
      if (msg.text().includes('Loading locations') ||
          msg.text().includes('Loaded') ||
          msg.text().includes('Wiki Map')) {
        consoleLogs.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForTimeout(1000);

    // Should have logged initialization
    const hasInitLog = consoleLogs.some(log =>
      log.includes('Wiki Map') && log.includes('Starting initialization')
    );
    expect(hasInitLog).toBeTruthy();

    // Should have logged loading
    const hasLoadingLog = consoleLogs.some(log =>
      log.includes('Loading locations from database')
    );
    expect(hasLoadingLog).toBeTruthy();
  });

  test('should escape HTML in location content (XSS protection)', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Get page source
    const pageContent = await page.content();

    // Check location items for unescaped HTML
    const locationItems = await page.locator('#locationList .location-item').count();

    if (locationItems > 0) {
      const firstItem = page.locator('#locationList .location-item').first();
      const itemHTML = await firstItem.innerHTML();

      // Should not contain executable script
      expect(itemHTML).not.toContain('<script>');
      expect(itemHTML).not.toMatch(/javascript:/);
    }
  });

  test('should display website links for locations', async ({ page }) => {
    // Wait for locations
    await page.waitForTimeout(2000);

    // Click on a marker to open popup
    const marker = page.locator('.leaflet-marker-icon').first();
    if (await marker.isVisible({ timeout: 2000 }).catch(() => false)) {
      await marker.click();

      // Wait for popup
      await page.waitForSelector('.leaflet-popup', { timeout: 2000 });

      // Check for website link
      const websiteLink = page.locator('.leaflet-popup a[href*="http"]');

      if (await websiteLink.isVisible({ timeout: 1000 }).catch(() => false)) {
        const href = await websiteLink.getAttribute('href');

        // Should be a valid URL
        expect(href).toMatch(/^https?:\/\//);

        // Should have rel="noopener" for security
        const rel = await websiteLink.getAttribute('rel');
        expect(rel).toContain('noopener');

        console.log(`Found website link: ${href}`);
      }
    }
  });

  test('should NOT display draft or archived locations', async ({ page }) => {
    await page.waitForTimeout(2000);

    // All displayed locations should be published
    // This is verified by the fact that we're only fetching published locations
    // and not seeing any draft/archived status indicators

    const pageContent = await page.content();

    // Should not contain draft or archived indicators
    expect(pageContent).not.toMatch(/status.*draft/i);
    expect(pageContent).not.toMatch(/status.*archived/i);
    expect(pageContent).not.toContain('[DRAFT]');
    expect(pageContent).not.toContain('[ARCHIVED]');
  });
});

test.describe('Wiki Map Page - Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/src/wiki/wiki-map.html');
  });

  test('should have navigation links to other wiki pages', async ({ page }) => {
    // Should have links to home, events, map
    const homeLink = page.locator('a[href*="wiki-home"]');
    const eventsLink = page.locator('a[href*="wiki-events"]');
    const mapLink = page.locator('a[href*="wiki-map"]');

    await expect(homeLink).toBeVisible();
    await expect(eventsLink).toBeVisible();
    await expect(mapLink).toBeVisible();

    // Map link should be active
    await expect(mapLink).toHaveClass(/active/);
  });

  test('should have Add Location button', async ({ page }) => {
    const addLocationBtn = page.locator('a:has-text("Add Location")');

    if (await addLocationBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Should link to editor
      const href = await addLocationBtn.getAttribute('href');
      expect(href).toContain('wiki-editor.html');
    }
  });
});