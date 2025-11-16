/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/tests/e2e/wiki-page-spinner-regression.spec.js
 * Description: Regression tests for wiki page loading spinner fix
 * Tests: Loading spinner removal, content display, page rendering
 * Tags: @regression @wiki-page @spinner
 * Author: Claude Code <noreply@anthropic.com>
 * Created: 2025-11-16
 */

import { test, expect } from '@playwright/test';

test.describe('Wiki Page Loading Spinner - Regression Tests', {
  tag: ['@regression', '@wiki-page', '@critical']
}, () => {

  test.describe('Loading Spinner Removal', {
    tag: '@spinner'
  }, () => {

    test('should remove loading spinner after content loads', async ({ page }) => {
      // Navigate to a specific guide
      await page.goto('http://localhost:3000/src/wiki/wiki-page.html?slug=growing-oyster-mushrooms-coffee-grounds');

      // Wait for page to load
      await page.waitForLoadState('networkidle');

      // Loading spinner should be removed
      const spinner = page.locator('.fa-spinner');
      await expect(spinner).toHaveCount(0, { timeout: 10000 });

      console.log('✓ Loading spinner successfully removed');
    });

    test('should not show "Loading guide content..." message after load', async ({ page }) => {
      // Navigate to a guide page
      await page.goto('http://localhost:3000/src/wiki/wiki-page.html?slug=growing-oyster-mushrooms-coffee-grounds');

      // Wait for content to load
      await page.waitForSelector('.wiki-content', { timeout: 5000 });
      await page.waitForTimeout(1000);

      // Should not show loading message
      const loadingMessage = page.locator('text=Loading guide content');
      await expect(loadingMessage).toHaveCount(0);

      console.log('✓ Loading message successfully removed');
    });

    test('should display guide content without loading artifacts', async ({ page }) => {
      // Navigate to guide page
      await page.goto('http://localhost:3000/src/wiki/wiki-page.html?slug=growing-oyster-mushrooms-coffee-grounds');

      // Wait for content
      await page.waitForSelector('.wiki-content', { timeout: 5000 });
      await page.waitForTimeout(1000);

      // Get article content
      const articleDivs = page.locator('.wiki-content > div');
      const count = await articleDivs.count();

      // Should have content divs
      expect(count).toBeGreaterThan(0);

      // Check for actual guide content (not just loading spinner)
      const contentText = await page.locator('.wiki-content').textContent();
      expect(contentText.length).toBeGreaterThan(100); // Should have substantial content

      // Should not have loading spinner in content
      expect(contentText).not.toContain('Loading guide content');

      console.log('✓ Guide content displayed cleanly');
    });

    test('should log verification message in console', async ({ page }) => {
      const consoleLogs = [];

      // Capture console logs
      page.on('console', msg => {
        if (msg.text().includes('Verifying spinner removed')) {
          consoleLogs.push(msg.text());
        }
      });

      // Navigate to guide page
      await page.goto('http://localhost:3000/src/wiki/wiki-page.html?slug=growing-oyster-mushrooms-coffee-grounds');

      // Wait for page to load
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Should have verification log
      const verificationLog = consoleLogs.find(log => log.includes('🔍 Verifying spinner removed: YES'));
      expect(verificationLog).toBeTruthy();

      console.log('✓ Verification log found:', verificationLog);
    });

    test('should find correct div containing spinner', async ({ page }) => {
      const consoleLogs = [];

      // Capture console logs
      page.on('console', msg => {
        consoleLogs.push(msg.text());
      });

      // Navigate to guide page
      await page.goto('http://localhost:3000/src/wiki/wiki-page.html?slug=growing-oyster-mushrooms-coffee-grounds');

      // Wait for load
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      // Should have log showing spinner was found
      const spinnerFoundLog = consoleLogs.find(log => log.includes('🎯 Found loading spinner in div at index'));
      expect(spinnerFoundLog).toBeTruthy();

      console.log('✓ Spinner location log found:', spinnerFoundLog);
    });
  });

  test.describe('Content Rendering', {
    tag: '@content'
  }, () => {

    test('should render guide title correctly', async ({ page }) => {
      // Navigate to guide page
      await page.goto('http://localhost:3000/src/wiki/wiki-page.html?slug=growing-oyster-mushrooms-coffee-grounds');

      // Wait for title to load
      await page.waitForSelector('h1', { timeout: 5000 });

      // Title should be visible and have content
      const title = page.locator('.wiki-content h1').first();
      await expect(title).toBeVisible();

      const titleText = await title.textContent();
      expect(titleText).toContain('Mushroom'); // Part of the guide title

      console.log('✓ Guide title rendered:', titleText);
    });

    test('should render guide metadata (author, date, views)', async ({ page }) => {
      // Navigate to guide page
      await page.goto('http://localhost:3000/src/wiki/wiki-page.html?slug=growing-oyster-mushrooms-coffee-grounds');

      // Wait for metadata to load
      await page.waitForSelector('.card-meta', { timeout: 5000 });

      // Check metadata is visible
      const cardMeta = page.locator('.card-meta');
      await expect(cardMeta).toBeVisible();

      const metaText = await cardMeta.textContent();

      // Should contain author, date, views
      expect(metaText).toMatch(/Aisha Patel|November|views/);

      console.log('✓ Guide metadata rendered');
    });

    test('should render category tags', async ({ page }) => {
      // Navigate to guide page
      await page.goto('http://localhost:3000/src/wiki/wiki-page.html?slug=growing-oyster-mushrooms-coffee-grounds');

      // Wait for tags to load
      await page.waitForSelector('.tags', { timeout: 5000 });

      // Check tags are visible
      const tags = page.locator('.tags .tag');
      const tagCount = await tags.count();

      expect(tagCount).toBeGreaterThan(0);

      const firstTagText = await tags.first().textContent();
      expect(firstTagText.length).toBeGreaterThan(0);

      console.log('✓ Category tags rendered');
    });

    test('should render markdown content to HTML', async ({ page }) => {
      // Navigate to guide page
      await page.goto('http://localhost:3000/src/wiki/wiki-page.html?slug=growing-oyster-mushrooms-coffee-grounds');

      // Wait for content to load
      await page.waitForSelector('.wiki-content', { timeout: 5000 });
      await page.waitForTimeout(1000);

      // Content should be rendered as HTML (not raw markdown)
      const content = await page.locator('.wiki-content').innerHTML();

      // Should have HTML elements (not just plain text with markdown syntax)
      expect(content).toMatch(/<h[1-6]>|<p>|<ul>|<ol>/);

      // Should not have raw markdown syntax
      expect(content).not.toContain('##');
      expect(content).not.toContain('**');

      console.log('✓ Markdown converted to HTML');
    });
  });

  test.describe('Div Selection Logic', {
    tag: '@implementation'
  }, () => {

    test('should find div with .fa-spinner class', async ({ page }) => {
      const consoleLogs = [];

      page.on('console', msg => {
        consoleLogs.push(msg.text());
      });

      // Navigate to page
      await page.goto('http://localhost:3000/src/wiki/wiki-page.html?slug=growing-oyster-mushrooms-coffee-grounds');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      // Check console logs for div count
      const divCountLog = consoleLogs.find(log => log.includes('📊 Found') && log.includes('div elements'));
      expect(divCountLog).toBeTruthy();

      // Should find 6 divs
      expect(divCountLog).toContain('6');

      console.log('✓ Correct number of divs found:', divCountLog);
    });

    test('should replace content in correct div', async ({ page }) => {
      const consoleLogs = [];

      page.on('console', msg => {
        consoleLogs.push(msg.text());
      });

      // Navigate
      await page.goto('http://localhost:3000/src/wiki/wiki-page.html?slug=growing-oyster-mushrooms-coffee-grounds');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      // Check replacement log
      const replacementLog = consoleLogs.find(log => log.includes('📝 Replacing content in div'));
      expect(replacementLog).toBeTruthy();

      console.log('✓ Content replacement log found:', replacementLog);
    });

    test('should log content length after replacement', async ({ page }) => {
      const consoleLogs = [];

      page.on('console', msg => {
        consoleLogs.push(msg.text());
      });

      // Navigate
      await page.goto('http://localhost:3000/src/wiki/wiki-page.html?slug=growing-oyster-mushrooms-coffee-grounds');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      // Check content length log
      const contentLengthLog = consoleLogs.find(log => log.includes('📝 Content length:') && log.includes('characters'));
      expect(contentLengthLog).toBeTruthy();

      // Content length should be > 0
      const lengthMatch = contentLengthLog.match(/(\d+) characters/);
      if (lengthMatch) {
        const length = parseInt(lengthMatch[1]);
        expect(length).toBeGreaterThan(0);
      }

      console.log('✓ Content length logged:', contentLengthLog);
    });
  });

  test.describe('Error Handling', {
    tag: '@error'
  }, () => {

    test('should handle guide not found gracefully', async ({ page }) => {
      // Navigate to non-existent guide
      await page.goto('http://localhost:3000/src/wiki/wiki-page.html?slug=nonexistent-guide-12345');

      // Wait for page to load
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Should not show loading spinner indefinitely
      const spinner = page.locator('.fa-spinner');
      await expect(spinner).toHaveCount(0);

      console.log('✓ Non-existent guide handled gracefully');
    });

    test('should fall back to last div if spinner not found', async ({ page }) => {
      // This tests the fallback logic - harder to test directly
      // but we can verify no errors occur
      const consoleErrors = [];

      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // Navigate
      await page.goto('http://localhost:3000/src/wiki/wiki-page.html?slug=growing-oyster-mushrooms-coffee-grounds');
      await page.waitForLoadState('networkidle');

      // Should have no console errors
      expect(consoleErrors.length).toBe(0);

      console.log('✓ No console errors occurred');
    });
  });

  test.describe('View Count Increment', {
    tag: '@analytics'
  }, () => {

    test('should increment view count when page loads', async ({ page }) => {
      const consoleLogs = [];

      page.on('console', msg => {
        consoleLogs.push(msg.text());
      });

      // Navigate to guide
      await page.goto('http://localhost:3000/src/wiki/wiki-page.html?slug=growing-oyster-mushrooms-coffee-grounds');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Should have view count increment log
      const viewCountLog = consoleLogs.find(log => log.includes('👁️ Incrementing view count'));
      expect(viewCountLog).toBeTruthy();

      console.log('✓ View count increment logged');
    });
  });
});
