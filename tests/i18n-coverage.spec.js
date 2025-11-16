/**
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/tests/i18n-coverage.spec.js
 * Description: Comprehensive i18n coverage test - verifies all data-i18n attributes have translations
 * Author: Claude Code
 * Created: 2025-01-16
 */

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Pages to test
const WIKI_PAGES = [
  'wiki-home.html',
  'wiki-login.html',
  'wiki-signup.html',
  'wiki-forgot-password.html',
  'wiki-reset-password.html',
  'wiki-guides.html',
  'wiki-events.html',
  'wiki-map.html',
  'wiki-favorites.html',
  'wiki-page.html',
  'wiki-admin.html',
  'wiki-issues.html',
  'wiki-editor.html'
];

test.describe('i18n Translation Coverage', () => {

  test('should have all i18n keys defined in wiki-i18n.js', async ({ page }) => {
    const missingKeys = new Map(); // page -> [missing keys]
    const allKeys = new Set();

    for (const pageName of WIKI_PAGES) {
      console.log(`\n📄 Checking ${pageName}...`);

      await page.goto(`http://localhost:3000/src/wiki/${pageName}`);

      // Wait for i18n to load
      await page.waitForTimeout(500);

      // Get all elements with data-i18n or data-i18n-placeholder
      const elements = await page.$$('[data-i18n], [data-i18n-placeholder]');

      const pageKeys = [];

      for (const element of elements) {
        const i18nKey = await element.getAttribute('data-i18n');
        const placeholderKey = await element.getAttribute('data-i18n-placeholder');

        const key = i18nKey || placeholderKey;
        if (key) {
          pageKeys.push(key);
          allKeys.add(key);
        }
      }

      console.log(`   Found ${pageKeys.length} i18n attributes`);

      // Check if translations exist
      const missingOnPage = [];

      for (const key of pageKeys) {
        const hasTranslation = await page.evaluate((k) => {
          return window.wikiI18n && window.wikiI18n.t(k) !== k;
        }, key);

        if (!hasTranslation) {
          missingOnPage.push(key);
        }
      }

      if (missingOnPage.length > 0) {
        missingKeys.set(pageName, missingOnPage);
        console.log(`   ❌ Missing ${missingOnPage.length} translations:`);
        missingOnPage.forEach(k => console.log(`      - ${k}`));
      } else {
        console.log(`   ✅ All translations present`);
      }
    }

    // Generate report
    console.log('\n' + '='.repeat(80));
    console.log('📊 SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total unique i18n keys found: ${allKeys.size}`);
    console.log(`Pages with missing translations: ${missingKeys.size}`);

    if (missingKeys.size > 0) {
      console.log('\n❌ MISSING TRANSLATIONS BY PAGE:');
      for (const [page, keys] of missingKeys) {
        console.log(`\n${page}: ${keys.length} missing`);
        keys.forEach(k => console.log(`  - ${k}`));
      }
    }

    // Fail test if any translations are missing
    expect(missingKeys.size).toBe(0);
  });

  test('should translate content when language is switched', async ({ page }) => {
    console.log('\n🌐 Testing language switching...');

    await page.goto('http://localhost:3000/src/wiki/wiki-login.html');
    await page.waitForTimeout(500);

    // Get initial English text
    const englishTitle = await page.textContent('[data-i18n="wiki.auth.welcome_back"]');
    console.log(`English title: "${englishTitle}"`);

    // Switch to Portuguese
    await page.click('#langSelectorBtn');
    await page.click('[data-lang="pt"]');
    await page.waitForTimeout(300);

    // Get Portuguese text
    const portugueseTitle = await page.textContent('[data-i18n="wiki.auth.welcome_back"]');
    console.log(`Portuguese title: "${portugueseTitle}"`);

    // Verify it changed
    expect(portugueseTitle).not.toBe(englishTitle);
    expect(portugueseTitle).toBeTruthy();

    // Switch to Spanish
    await page.click('#langSelectorBtn');
    await page.click('[data-lang="es"]');
    await page.waitForTimeout(300);

    // Get Spanish text
    const spanishTitle = await page.textContent('[data-i18n="wiki.auth.welcome_back"]');
    console.log(`Spanish title: "${spanishTitle}"`);

    // Verify it changed
    expect(spanishTitle).not.toBe(englishTitle);
    expect(spanishTitle).not.toBe(portugueseTitle);
    expect(spanishTitle).toBeTruthy();

    console.log('✅ Language switching works correctly');
  });

  test('should export missing keys to file', async ({ page }) => {
    const allMissingKeys = {};

    for (const pageName of WIKI_PAGES) {
      await page.goto(`http://localhost:3000/src/wiki/${pageName}`);
      await page.waitForTimeout(500);

      const elements = await page.$$('[data-i18n], [data-i18n-placeholder]');
      const missingOnPage = [];

      for (const element of elements) {
        const i18nKey = await element.getAttribute('data-i18n');
        const placeholderKey = await element.getAttribute('data-i18n-placeholder');
        const key = i18nKey || placeholderKey;

        if (key) {
          const hasTranslation = await page.evaluate((k) => {
            return window.wikiI18n && window.wikiI18n.t(k) !== k;
          }, key);

          if (!hasTranslation) {
            const text = await element.textContent();
            const placeholder = await element.getAttribute('placeholder');
            missingOnPage.push({
              key,
              defaultText: text || placeholder || '',
              element: await element.evaluate(el => el.tagName)
            });
          }
        }
      }

      if (missingOnPage.length > 0) {
        allMissingKeys[pageName] = missingOnPage;
      }
    }

    // Write report
    const reportPath = path.join(process.cwd(), 'docs/i18n-missing-keys-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(allMissingKeys, null, 2));

    console.log(`\n📝 Missing keys report written to: ${reportPath}`);
    console.log(`Total pages with missing keys: ${Object.keys(allMissingKeys).length}`);
  });
});
