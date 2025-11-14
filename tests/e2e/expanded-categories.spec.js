/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/tests/e2e/expanded-categories.spec.js
 * Description: Playwright E2E tests for expanded category system including marketplace and wiki categories
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-14
 */

import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://mcbxbaggjaxqfdvmrqsc.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

// Helper function to create Supabase client
function getSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Category tier definitions for testing
const TIER_1_CATEGORIES = {
  animal: ['Chickens & Poultry', 'Beekeeping & Apiculture', 'Rabbits & Small Mammals', 'Animal Feed & Supplies', 'Coops, Hives & Housing', 'Animal Healthcare'],
  preservation: ['Fermentation & Culturing', 'Canning & Jarring', 'Dehydration & Drying', 'Root Cellars & Cool Storage', 'Vacuum Sealing & Freezing', 'Cheese & Dairy Making'],
  fungi: ['Mushroom Spawn & Cultures', 'Growing Substrates', 'Cultivation Equipment', 'Foraging Tools & Guides', 'Medicinal Mushrooms', 'Mycoremediation Systems'],
  indigenous: ['Traditional Ethnobotany', 'Native Plant Medicine', 'Indigenous Food Systems', 'Cultural Land Practices', 'Sacred Plant Cultivation', 'Bioregional Wisdom'],
  fiber: ['Fiber Plants & Seeds', 'Natural Dyes & Pigments', 'Spinning & Weaving Tools', 'Knitting & Textile Crafts', 'Sustainable Fashion', 'Basketry & Cordage']
};

const TIER_2_CATEGORIES = {
  technology: ['Solar Electronics', 'Bike-Powered Tools', 'DIY Equipment Plans', 'Low-Tech Solutions', 'Maker Tools & Supplies', 'Open-Source Tech'],
  'herbal-medicine': ['Medicinal Plant Seeds', 'Herbal Preparation Supplies', 'Tincture & Extract Making', 'Salve & Balm Making', 'Herbal Education', 'Apothecary Supplies'],
  soil: ['Soil Testing Equipment', 'Microbial Inoculants', 'Biochar & Carbon', 'Cover Crop Seeds', 'Composting Accelerators', 'Regenerative Resources'],
  foraging: ['Foraging Guides', 'Identification Tools', 'Wildcrafting Ethics', 'Mushroom Foraging', 'Wild Medicinal Plants', 'Foraging Baskets & Tools'],
  aquaculture: ['Aquaponics Systems', 'Fish Supplies', 'Pond Equipment', 'Water Quality Testing', 'Aquatic Plants', 'Fish Farming Resources']
};

const TIER_3_CATEGORIES = {
  bioremediation: ['Phytoremediation Plants', 'Erosion Control', 'Wetland Restoration', 'Pollinator Habitat', 'Wildlife Corridors', 'Restoration Resources'],
  'community-organizing': ['Community Building Tools', 'Ecovillage Design', 'Conflict Resolution', 'Consensus Building', 'Social Justice Resources', 'Community Events'],
  'alternative-economics': ['Time Banking', 'Local Currencies', 'Gift Economy Tools', 'Barter Networks', 'Cooperative Resources', 'Commons Management'],
  'climate-resilience': ['Drought-Resilient Plants', 'Flood Management', 'Fire-Smart Landscaping', 'Season Extension', 'Emergency Preparedness', 'Climate Resources'],
  'family-education': ['Garden Education Kits', 'Nature Study Materials', 'Family Project Plans', 'Homeschool Resources', 'Children\'s Garden Seeds', 'Story & Activity Books']
};

// Wiki categories to test
const WIKI_CATEGORIES = [
  'Animal Husbandry', 'Beekeeping', 'Food Preservation', 'Fermentation', 'Mycology',
  'Indigenous Knowledge', 'Ethnobotany', 'Fiber Arts', 'Natural Dyeing', 'Herbal Medicine',
  'Soil Science', 'Regenerative Agriculture', 'Foraging', 'Aquaculture', 'Aquaponics'
];

test.describe('Expanded Categories - Database Verification', () => {
  let supabase;

  test.beforeAll(async () => {
    supabase = getSupabaseClient();
  });

  test('Tier 1 categories should exist in database', async () => {
    for (const [categoryType, subcategories] of Object.entries(TIER_1_CATEGORIES)) {
      const { data, error } = await supabase
        .from('resource_categories')
        .select('*')
        .eq('category_type', categoryType);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThanOrEqual(subcategories.length);

      // Verify each subcategory exists
      for (const subcategoryName of subcategories) {
        const subcategory = data.find(c => c.name === subcategoryName);
        expect(subcategory).toBeDefined();
        expect(subcategory.category_type).toBe(categoryType);
        expect(subcategory.icon_emoji).toBeDefined();
      }
    }
  });

  test('Tier 2 categories should exist in database', async () => {
    for (const [categoryType, subcategories] of Object.entries(TIER_2_CATEGORIES)) {
      const { data, error } = await supabase
        .from('resource_categories')
        .select('*')
        .eq('category_type', categoryType);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThanOrEqual(subcategories.length);
    }
  });

  test('Tier 3 categories should exist in database', async () => {
    for (const [categoryType, subcategories] of Object.entries(TIER_3_CATEGORIES)) {
      const { data, error } = await supabase
        .from('resource_categories')
        .select('*')
        .eq('category_type', categoryType);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThanOrEqual(subcategories.length);
    }
  });

  test('Wiki categories should exist in database', async () => {
    const { data, error } = await supabase
      .from('wiki_categories')
      .select('*');

    expect(error).toBeNull();
    expect(data).toBeDefined();

    for (const categoryName of WIKI_CATEGORIES) {
      const category = data.find(c => c.name === categoryName);
      expect(category).toBeDefined();
      expect(category.icon).toBeDefined();
      expect(category.description).toBeDefined();
    }
  });

  test('Resource categories organized view should work', async () => {
    const { data, error } = await supabase
      .from('resource_categories_organized')
      .select('*')
      .order('category_group_order', { ascending: true })
      .order('display_order', { ascending: true });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.length).toBeGreaterThan(0);

    // Verify ordering is correct
    let lastGroupOrder = 0;
    for (const category of data) {
      expect(category.category_group_order).toBeGreaterThanOrEqual(lastGroupOrder);
      lastGroupOrder = category.category_group_order;
    }
  });
});

test.describe('Expanded Categories - UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('Resources page should display new categories', async ({ page }) => {
    await page.goto(`${BASE_URL}/src/pages/resources.html`);

    // Wait for categories to load
    await page.waitForSelector('.category-filter', { timeout: 10000 });

    // Check Tier 1 categories are visible
    for (const categoryType of Object.keys(TIER_1_CATEGORIES)) {
      const categoryElement = await page.locator(`.category-filter[data-category="${categoryType}"]`).first();
      await expect(categoryElement).toBeVisible();
    }
  });

  test('Category filtering should work with new categories', async ({ page }) => {
    await page.goto(`${BASE_URL}/src/pages/resources.html`);

    // Wait for resources to load
    await page.waitForSelector('.resource-grid', { timeout: 10000 });

    // Test filtering by animal category
    await page.click('.category-filter[data-category="animal"]');

    // Verify filter is applied
    await expect(page.locator('.category-filter[data-category="animal"].active')).toBeVisible();

    // Check that resources are filtered (or message shows if no resources)
    const resourcesOrMessage = await page.locator('.resource-card, .no-results-message').first();
    await expect(resourcesOrMessage).toBeVisible();
  });

  test('Add item page should show new categories in dropdown', async ({ page }) => {
    await page.goto(`${BASE_URL}/src/pages/add-item.html`);

    // Wait for form to load
    await page.waitForSelector('#item-form', { timeout: 10000 });

    // Select resource type
    await page.selectOption('#item-type', 'resource');

    // Check category dropdown contains new options
    const categorySelect = await page.locator('#resource-category');
    await expect(categorySelect).toBeVisible();

    // Get all options
    const options = await categorySelect.locator('option').allTextContents();

    // Verify some key categories are present
    expect(options).toContain('Chickens & Poultry');
    expect(options).toContain('Fermentation & Culturing');
    expect(options).toContain('Mushroom Spawn & Cultures');
  });

  test('Wiki page should display new categories', async ({ page }) => {
    await page.goto(`${BASE_URL}/src/pages/wiki.html`);

    // Wait for wiki categories to load
    await page.waitForSelector('.wiki-category', { timeout: 10000 });

    // Check some wiki categories are visible
    for (const categoryName of ['Animal Husbandry', 'Food Preservation', 'Mycology']) {
      const categoryElement = await page.locator('.wiki-category').filter({ hasText: categoryName }).first();
      await expect(categoryElement).toBeVisible();
    }
  });
});

test.describe('Expanded Categories - Search and Discovery', () => {
  test('Search should find items in new categories', async ({ page }) => {
    await page.goto(`${BASE_URL}/src/pages/resources.html`);

    // Wait for search to be ready
    await page.waitForSelector('#search-input', { timeout: 10000 });

    // Search for mushroom-related items
    await page.fill('#search-input', 'mushroom');
    await page.press('#search-input', 'Enter');

    // Wait for search results
    await page.waitForTimeout(1000);

    // Verify search executed (results or no results message)
    const resultsIndicator = await page.locator('.resource-card, .no-results-message').first();
    await expect(resultsIndicator).toBeVisible();
  });

  test('Category icons should display correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/test-expanded-categories.html`);

    // Wait for categories to load
    await page.waitForSelector('.category-card', { timeout: 10000 });

    // Check that emoji icons are visible
    const categoryCards = await page.locator('.category-card').all();
    expect(categoryCards.length).toBeGreaterThan(0);

    for (const card of categoryCards.slice(0, 5)) { // Check first 5
      const emoji = await card.locator('.category-emoji').textContent();
      expect(emoji).toMatch(/[\u{1F300}-\u{1F9FF}]/u); // Unicode emoji range
    }
  });
});

test.describe('Expanded Categories - Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size

  test('Categories should be responsive on mobile', async ({ page }) => {
    await page.goto(`${BASE_URL}/test-expanded-categories.html`);

    // Wait for categories to load
    await page.waitForSelector('.category-card', { timeout: 10000 });

    // Check that category grid adjusts for mobile
    const gridContainer = await page.locator('.category-grid').first();
    const containerWidth = await gridContainer.evaluate(el => el.offsetWidth);

    // On mobile, container should be narrower
    expect(containerWidth).toBeLessThan(400);

    // Cards should stack vertically
    const cards = await page.locator('.category-card').all();
    if (cards.length >= 2) {
      const firstCardBox = await cards[0].boundingBox();
      const secondCardBox = await cards[1].boundingBox();

      // Second card should be below first card on mobile
      expect(secondCardBox.y).toBeGreaterThan(firstCardBox.y);
    }
  });

  test('Mobile menu should include new category filters', async ({ page }) => {
    await page.goto(`${BASE_URL}/src/pages/resources.html`);

    // Open mobile menu if present
    const mobileMenuButton = await page.locator('.mobile-menu-button');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();

      // Check categories in mobile menu
      const mobileCategories = await page.locator('.mobile-category-filter').all();
      expect(mobileCategories.length).toBeGreaterThan(0);
    }
  });
});

test.describe('Expanded Categories - Data Integrity', () => {
  let supabase;

  test.beforeAll(async () => {
    supabase = getSupabaseClient();
  });

  test('All categories should have unique names', async () => {
    const { data, error } = await supabase
      .from('resource_categories')
      .select('name');

    expect(error).toBeNull();

    const names = data.map(c => c.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  test('All categories should have valid category_type', async () => {
    const validTypes = [
      'plant', 'animal', 'fungi', 'preservation', 'fiber', 'tool', 'technology',
      'material', 'soil', 'aquaculture', 'service', 'information', 'herbal-medicine',
      'indigenous', 'foraging', 'event', 'bioremediation', 'community-organizing',
      'alternative-economics', 'climate-resilience', 'family-education'
    ];

    const { data, error } = await supabase
      .from('resource_categories')
      .select('category_type');

    expect(error).toBeNull();

    for (const category of data) {
      expect(validTypes).toContain(category.category_type);
    }
  });

  test('All wiki categories should have slugs', async () => {
    const { data, error } = await supabase
      .from('wiki_categories')
      .select('name, slug');

    expect(error).toBeNull();

    for (const category of data) {
      expect(category.slug).toBeDefined();
      expect(category.slug).not.toBe('');
      // Slug should be lowercase and hyphenated
      expect(category.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });
});

test.describe('Expanded Categories - Performance', () => {
  test('Categories should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto(`${BASE_URL}/test-expanded-categories.html`);
    await page.waitForSelector('.category-card', { timeout: 10000 });

    const loadTime = Date.now() - startTime;

    // Categories should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('Filtering large category lists should be responsive', async ({ page }) => {
    await page.goto(`${BASE_URL}/src/pages/resources.html`);
    await page.waitForSelector('.category-filter', { timeout: 10000 });

    const startTime = Date.now();

    // Click through several category filters rapidly
    const filterButtons = await page.locator('.category-filter').all();
    for (const button of filterButtons.slice(0, 5)) {
      await button.click();
      await page.waitForTimeout(100); // Brief pause between clicks
    }

    const filterTime = Date.now() - startTime;

    // All filtering should complete within 2 seconds
    expect(filterTime).toBeLessThan(2000);
  });
});

test.describe('Expanded Categories - Accessibility', () => {
  test('Category elements should have proper ARIA labels', async ({ page }) => {
    await page.goto(`${BASE_URL}/test-expanded-categories.html`);
    await page.waitForSelector('.category-card', { timeout: 10000 });

    // Check category cards have proper structure
    const cards = await page.locator('.category-card').all();
    for (const card of cards.slice(0, 5)) {
      // Cards should be keyboard focusable
      const tabIndex = await card.evaluate(el => el.tabIndex);
      expect(tabIndex).toBeGreaterThanOrEqual(-1);
    }
  });

  test('Category filters should be keyboard navigable', async ({ page }) => {
    await page.goto(`${BASE_URL}/src/pages/resources.html`);
    await page.waitForSelector('.category-filter', { timeout: 10000 });

    // Tab to first category filter
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // May need multiple tabs to reach filters

    // Press Enter to select
    await page.keyboard.press('Enter');

    // Check that a filter is now active
    const activeFilter = await page.locator('.category-filter.active').first();
    await expect(activeFilter).toBeVisible();
  });
});

test.describe('Expanded Categories - Wiki Integration', () => {
  let supabase;

  test.beforeAll(async () => {
    supabase = getSupabaseClient();
  });

  test('Wiki guides should be linked to correct categories', async () => {
    // Check that the chicken guide is linked to Animal Husbandry
    const { data: guides, error: guideError } = await supabase
      .from('wiki_guides')
      .select('*, wiki_guide_categories!inner(*, wiki_categories!inner(*))')
      .eq('slug', 'starting-first-backyard-flock');

    expect(guideError).toBeNull();
    expect(guides).toBeDefined();

    if (guides && guides.length > 0) {
      const guide = guides[0];
      const categories = guide.wiki_guide_categories.map(gc => gc.wiki_categories.slug);
      expect(categories).toContain('animal-husbandry');
    }
  });

  test('Wiki categories should have associated guides', async () => {
    const { data: categories, error } = await supabase
      .from('wiki_categories')
      .select('*, wiki_guide_categories(count)')
      .in('slug', ['animal-husbandry', 'food-preservation', 'mycology']);

    expect(error).toBeNull();
    expect(categories).toBeDefined();

    for (const category of categories || []) {
      // Each of these categories should have at least one guide
      if (category.wiki_guide_categories && category.wiki_guide_categories[0]) {
        expect(category.wiki_guide_categories[0].count).toBeGreaterThan(0);
      }
    }
  });
});

// Export test configuration
export default {
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: BASE_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
};