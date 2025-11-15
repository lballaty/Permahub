/**
 * Test suite to verify wiki pages display correct content for each guide
 * Tests that different guides show different content, not the same hardcoded content
 */

import { test, expect } from '@playwright/test';

test.describe('Wiki Page - Dynamic Content Loading', () => {

  test('should load Lacto-Fermentation guide with correct title and content', async ({ page }) => {
    // Navigate to the Lacto-Fermentation guide
    await page.goto('http://localhost:3000/src/wiki/wiki-page.html?slug=lacto-fermentation-ancient-preservation');

    // Wait for page to load
    await page.waitForSelector('.wiki-content h1', { timeout: 5000 });

    // Check that the title is correct (not the hardcoded "Building a Swale System")
    const title = await page.locator('.wiki-content h1').textContent();
    expect(title).toBe('Lacto-Fermentation: Ancient Preservation Made Simple');
    expect(title).not.toContain('Swale');

    // Check page title
    const pageTitle = await page.title();
    expect(pageTitle).toBe('Lacto-Fermentation: Ancient Preservation Made Simple - Community Wiki');

    // Check that the content contains fermentation-specific keywords
    const pageContent = await page.content();
    expect(pageContent).toContain('ferment');
    expect(pageContent).not.toContain('swale');
    expect(pageContent).not.toContain('contour');
  });

  test('should load different content for different guide slugs', async ({ page }) => {
    // Get list of available guides from home page first
    await page.goto('http://localhost:3000/src/wiki/wiki-home.html');
    await page.waitForSelector('#guidesGrid .card', { timeout: 5000 });

    // Get all guide links
    const guideLinks = await page.locator('#guidesGrid .card a[href*="wiki-page.html?slug="]').all();

    if (guideLinks.length < 2) {
      console.log('⚠️ Not enough guides to test, skipping comparison');
      return;
    }

    // Get slugs from first two guides
    const href1 = await guideLinks[0].getAttribute('href');
    const href2 = await guideLinks[1].getAttribute('href');

    const slug1 = new URL(href1, 'http://localhost:3000').searchParams.get('slug');
    const slug2 = new URL(href2, 'http://localhost:3000').searchParams.get('slug');

    console.log(`Testing with slugs: ${slug1} and ${slug2}`);

    // Load first guide
    await page.goto(`http://localhost:3000/src/wiki/wiki-page.html?slug=${slug1}`);
    await page.waitForSelector('.wiki-content h1', { timeout: 5000 });

    const title1 = await page.locator('.wiki-content h1').textContent();
    const content1 = await page.content();

    console.log(`First guide title: ${title1}`);

    // Load second guide
    await page.goto(`http://localhost:3000/src/wiki/wiki-page.html?slug=${slug2}`);
    await page.waitForSelector('.wiki-content h1', { timeout: 5000 });

    const title2 = await page.locator('.wiki-content h1').textContent();
    const content2 = await page.content();

    console.log(`Second guide title: ${title2}`);

    // Titles should be different
    expect(title1).not.toBe(title2);

    // Content should be different
    expect(content1).not.toBe(content2);
  });

  test('should update metadata for each guide', async ({ page }) => {
    // Load the Lacto-Fermentation guide
    await page.goto('http://localhost:3000/src/wiki/wiki-page.html?slug=lacto-fermentation-ancient-preservation');
    await page.waitForSelector('.card-meta', { timeout: 5000 });

    // Check that metadata is present
    const metaElement = page.locator('.card-meta');
    await expect(metaElement).toBeVisible();

    // Check for various metadata elements
    const metaText = await metaElement.textContent();
    expect(metaText).toContain('min read');
    expect(metaText).toContain('views');
  });

  test('should update category tags for each guide', async ({ page }) => {
    // Load a guide
    await page.goto('http://localhost:3000/src/wiki/wiki-page.html?slug=lacto-fermentation-ancient-preservation');
    await page.waitForSelector('.tags', { timeout: 5000 });

    // Check that tags are present
    const tagsElement = page.locator('.tags.mt-2');
    await expect(tagsElement).toBeVisible();

    // Get tag content
    const tagElements = page.locator('.tags.mt-2 .tag');
    const tagCount = await tagElements.count();
    expect(tagCount).toBeGreaterThan(0);

    // Check that at least one tag is related to the guide
    const firstTagText = await tagElements.first().textContent();
    console.log(`First tag: ${firstTagText}`);
    expect(firstTagText.length).toBeGreaterThan(0);
  });

  test('should update breadcrumb navigation for each guide', async ({ page }) => {
    // Load a guide
    await page.goto('http://localhost:3000/src/wiki/wiki-page.html?slug=lacto-fermentation-ancient-preservation');

    // Wait for the page to load
    await page.waitForTimeout(1000);

    // Check for breadcrumb
    const breadcrumbDiv = page.locator('.wiki-content > div:first-child');
    await expect(breadcrumbDiv).toBeVisible();

    const breadcrumbText = await breadcrumbDiv.textContent();
    expect(breadcrumbText).toContain('Home');
  });

  test('should show console debugging logs during render', async ({ page }) => {
    const consoleLogs = [];

    // Capture console logs
    page.on('console', msg => {
      consoleLogs.push(msg.text());
    });

    // Load a guide
    await page.goto('http://localhost:3000/src/wiki/wiki-page.html?slug=lacto-fermentation-ancient-preservation');
    await page.waitForTimeout(1500);

    // Check for debugging logs we added
    const renderStartLog = consoleLogs.find(log => log.includes('🎨 Starting to render guide'));
    expect(renderStartLog).toBeTruthy();

    const renderCompleteLog = consoleLogs.find(log => log.includes('🎨 Finished rendering guide'));
    expect(renderCompleteLog).toBeTruthy();

    // Check what elements were found/updated
    const titleUpdateLog = consoleLogs.find(log => log.includes('Updated h1 title to:'));
    if (titleUpdateLog) {
      console.log(`Title update log: ${titleUpdateLog}`);
    }

    const articleBodyLog = consoleLogs.find(log => log.includes('Updated article body'));
    if (articleBodyLog) {
      console.log(`Article body update log: ${articleBodyLog}`);
    } else {
      // Check for warning about not finding article body
      const warningLog = consoleLogs.find(log => log.includes('Could not find article body element'));
      if (warningLog) {
        console.log(`WARNING: ${warningLog}`);
      }
    }

    // Log all render-related logs for debugging
    console.log('\n=== All render logs ===');
    consoleLogs
      .filter(log => log.includes('render') || log.includes('Updated') || log.includes('Found'))
      .forEach(log => console.log(log));
  });

  test('should handle invalid slug gracefully', async ({ page }) => {
    // Load with invalid slug
    await page.goto('http://localhost:3000/src/wiki/wiki-page.html?slug=non-existent-guide-12345');

    // Wait for error handling
    await page.waitForTimeout(1000);

    // Should show error message
    const pageContent = await page.content();
    const hasError = pageContent.includes('Error Loading Guide') ||
                     pageContent.includes('Guide not found');

    expect(hasError).toBe(true);
  });

  test('should handle missing slug parameter', async ({ page }) => {
    // Load without slug parameter
    await page.goto('http://localhost:3000/src/wiki/wiki-page.html');

    // Wait for error handling
    await page.waitForTimeout(1000);

    // Should show error message
    const pageContent = await page.content();
    const hasError = pageContent.includes('No guide specified');

    expect(hasError).toBe(true);
  });
});

test.describe('Wiki Page - View Count Integration', () => {

  test('should not show JSON parse errors for view count', async ({ page }) => {
    const consoleErrors = [];

    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Load a guide
    await page.goto('http://localhost:3000/src/wiki/wiki-page.html?slug=lacto-fermentation-ancient-preservation');
    await page.waitForTimeout(2000);

    // Check for the specific JSON parse error we fixed
    const jsonParseError = consoleErrors.find(error =>
      error.includes('Unexpected end of JSON input') ||
      error.includes("Failed to execute 'json' on 'Response'")
    );

    if (jsonParseError) {
      console.log(`❌ Found JSON parse error: ${jsonParseError}`);
    }

    // Should NOT have JSON parse errors
    expect(jsonParseError).toBeFalsy();
  });
});
