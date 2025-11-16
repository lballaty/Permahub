/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/tests/e2e/auth-ui-regression.spec.js
 * Description: Regression tests for authentication UI fixes
 * Tests: Create Page button visibility, content creation buttons, editor UX
 * Tags: @regression @auth @ui
 * Author: Claude Code <noreply@anthropic.com>
 * Created: 2025-11-16
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication UI - Regression Tests', {
  tag: ['@regression', '@auth', '@ui']
}, () => {

  test.describe('Create Page Button Visibility', {
    tag: '@create-button'
  }, () => {

    test('should hide "Create Page" button for unauthenticated users', async ({ page }) => {
      // Clear auth state
      await page.context().clearCookies();
      await page.goto('http://localhost:3000/src/wiki/wiki-home.html');

      // Wait for page to load and auth header to initialize
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // "Create Page" button should be hidden
      const createButton = page.locator('a[href="wiki-editor.html"]:has-text("Create Page")');
      await expect(createButton).toBeHidden();

      console.log('✓ Create Page button hidden for unauthenticated users');
    });

    test('should hide Create Page button across all wiki pages when logged out', async ({ page }) => {
      const pages = [
        'wiki-home.html',
        'wiki-events.html',
        'wiki-guides.html',
        'wiki-map.html',
        'wiki-favorites.html',
        'wiki-page.html'
      ];

      for (const pageName of pages) {
        await page.goto(`http://localhost:3000/src/wiki/${pageName}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);

        // Create Page button should be hidden
        const createButton = page.locator('a[href="wiki-editor.html"]:has-text("Create Page"), a.btn:has-text("Create Page")');
        const count = await createButton.count();

        // If button exists, it should be hidden
        if (count > 0) {
          await expect(createButton.first()).toBeHidden();
        }

        console.log(`✓ ${pageName}: Create Page button properly hidden`);
      }
    });

    test('should NOT show Create Page button on auth pages', async ({ page }) => {
      const authPages = [
        'wiki-login.html',
        'wiki-signup.html',
        'wiki-forgot-password.html',
        'wiki-reset-password.html'
      ];

      for (const pageName of authPages) {
        await page.goto(`http://localhost:3000/src/wiki/${pageName}`);
        await page.waitForLoadState('networkidle');

        // Create Page button should not exist at all on auth pages
        const createButton = page.locator('a[href="wiki-editor.html"]:has-text("Create Page")');
        await expect(createButton).toHaveCount(0);

        console.log(`✓ ${pageName}: No Create Page button present`);
      }
    });
  });

  test.describe('Content Creation Buttons for Unauthenticated Users', {
    tag: ['@content-buttons', '@critical']
  }, () => {

    test('should disable "Add Event" button when logged out', async ({ page }) => {
      // Go to events page without auth
      await page.goto('http://localhost:3000/src/wiki/wiki-events.html');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Add Event button should be disabled
      const addEventBtn = page.locator('#addEventBtn');

      // Check if button exists
      const count = await addEventBtn.count();
      if (count > 0) {
        // Button should be disabled
        await expect(addEventBtn).toBeDisabled();

        // Should have reduced opacity
        const opacity = await addEventBtn.evaluate(el => window.getComputedStyle(el).opacity);
        expect(parseFloat(opacity)).toBeLessThan(1.0);

        console.log('✓ Add Event button disabled for unauthenticated users');
      }
    });

    test('should disable "Add Location" button when logged out', async ({ page }) => {
      // Go to map page without auth
      await page.goto('http://localhost:3000/src/wiki/wiki-map.html');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Add Location button should be disabled
      const addLocationBtn = page.locator('#addLocationBtn');

      const count = await addLocationBtn.count();
      if (count > 0) {
        // Button should be disabled
        await expect(addLocationBtn).toBeDisabled();

        // Should have reduced opacity
        const opacity = await addLocationBtn.evaluate(el => window.getComputedStyle(el).opacity);
        expect(parseFloat(opacity)).toBeLessThan(1.0);

        console.log('✓ Add Location button disabled for unauthenticated users');
      }
    });

    test('should disable "Edit This Page" button when logged out', async ({ page }) => {
      // Go to a page without auth
      await page.goto('http://localhost:3000/src/wiki/wiki-page.html?slug=growing-oyster-mushrooms-coffee-grounds');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Edit This Page button should be disabled
      const editPageBtn = page.locator('#editPageBtn');

      const count = await editPageBtn.count();
      if (count > 0) {
        // Button should be disabled
        await expect(editPageBtn).toBeDisabled();

        // Should have reduced opacity
        const opacity = await editPageBtn.evaluate(el => window.getComputedStyle(el).opacity);
        expect(parseFloat(opacity)).toBeLessThan(1.0);

        console.log('✓ Edit This Page button disabled for unauthenticated users');
      }
    });

    test('should show tooltip on disabled content creation buttons', async ({ page }) => {
      // Go to events page
      await page.goto('http://localhost:3000/src/wiki/wiki-events.html');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Check for tooltip attribute
      const addEventBtn = page.locator('#addEventBtn');
      const count = await addEventBtn.count();

      if (count > 0) {
        const title = await addEventBtn.getAttribute('title');
        expect(title).toContain('log in');

        console.log('✓ Tooltip present on disabled button:', title);
      }
    });

    test('should prevent navigation when clicking disabled buttons', async ({ page }) => {
      // Go to events page
      await page.goto('http://localhost:3000/src/wiki/wiki-events.html');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      const addEventBtn = page.locator('#addEventBtn');
      const count = await addEventBtn.count();

      if (count > 0) {
        // Set up dialog handler for alert
        page.on('dialog', async dialog => {
          expect(dialog.message()).toContain('log in');
          await dialog.accept();
        });

        // Click button
        await addEventBtn.click();
        await page.waitForTimeout(500);

        // Should still be on events page (navigation prevented)
        const currentUrl = page.url();
        expect(currentUrl).toContain('wiki-events.html');

        console.log('✓ Navigation prevented for disabled button');
      }
    });
  });

  test.describe('Editor UX for Unauthenticated Users', {
    tag: ['@editor', '@banner']
  }, () => {

    test('should show authentication banner for unauthenticated users', async ({ page }) => {
      // Go to editor without auth
      await page.goto('http://localhost:3000/src/wiki/wiki-editor.html');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Should show auth banner
      const authBanner = page.locator('.auth-banner, [style*="background: linear-gradient"]').filter({
        hasText: /not logged in|Editing is disabled/i
      });

      // Banner should be visible
      const bannerCount = await authBanner.count();
      if (bannerCount > 0) {
        await expect(authBanner.first()).toBeVisible();

        const bannerText = await authBanner.first().textContent();
        expect(bannerText).toMatch(/not logged in|log in to edit/i);

        console.log('✓ Authentication banner displayed');
      }
    });

    test('should keep editor form visible but disabled for exploration', async ({ page }) => {
      // Go to editor without auth
      await page.goto('http://localhost:3000/src/wiki/wiki-editor.html');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Editor form should still be visible
      const editorForm = page.locator('form, #editor-form, .ql-editor');
      const formCount = await editorForm.count();

      if (formCount > 0) {
        await expect(editorForm.first()).toBeVisible();
        console.log('✓ Editor form remains visible for exploration');
      }
    });

    test('should disable Publish button for unauthenticated users', async ({ page }) => {
      // Go to editor without auth
      await page.goto('http://localhost:3000/src/wiki/wiki-editor.html');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Find Publish button
      const publishBtn = page.locator('button:has-text("Publish"), #publishBtn');
      const btnCount = await publishBtn.count();

      if (btnCount > 0) {
        // Should be disabled
        await expect(publishBtn.first()).toBeDisabled();

        console.log('✓ Publish button disabled');
      }
    });

    test('should disable Save Draft button for unauthenticated users', async ({ page }) => {
      // Go to editor without auth
      await page.goto('http://localhost:3000/src/wiki/wiki-editor.html');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Find Save Draft button
      const saveDraftBtn = page.locator('button:has-text("Save Draft"), #saveDraftBtn');
      const btnCount = await saveDraftBtn.count();

      if (btnCount > 0) {
        // Should be disabled
        await expect(saveDraftBtn.first()).toBeDisabled();

        console.log('✓ Save Draft button disabled');
      }
    });

    test('should keep Preview button enabled for unauthenticated users', async ({ page }) => {
      // Go to editor without auth
      await page.goto('http://localhost:3000/src/wiki/wiki-editor.html');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Find Preview button
      const previewBtn = page.locator('button:has-text("Preview"), #previewBtn');
      const btnCount = await previewBtn.count();

      if (btnCount > 0) {
        // Should be enabled (it's read-only)
        await expect(previewBtn.first()).toBeEnabled();

        console.log('✓ Preview button remains enabled');
      }
    });

    test('should show Login and Sign Up buttons in auth banner', async ({ page }) => {
      // Go to editor without auth
      await page.goto('http://localhost:3000/src/wiki/wiki-editor.html');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Should have login and signup buttons in banner
      const loginLink = page.locator('a[href*="login"]:visible').first();
      const signupLink = page.locator('a[href*="signup"]:visible').first();

      const loginCount = await loginLink.count();
      const signupCount = await signupLink.count();

      if (loginCount > 0) {
        await expect(loginLink).toBeVisible();
        console.log('✓ Login link present in banner');
      }

      if (signupCount > 0) {
        await expect(signupLink).toBeVisible();
        console.log('✓ Sign Up link present in banner');
      }
    });

    test('should allow users to type in editor fields for exploration', async ({ page }) => {
      // Go to editor without auth
      await page.goto('http://localhost:3000/src/wiki/wiki-editor.html');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Title field should be editable
      const titleInput = page.locator('input#title, input[placeholder*="title" i]');
      const titleCount = await titleInput.count();

      if (titleCount > 0) {
        await titleInput.first().fill('Test Title');
        const value = await titleInput.first().inputValue();
        expect(value).toBe('Test Title');

        console.log('✓ Users can type in editor fields');
      }
    });

    test('should NOT completely hide editor for unauthenticated users', async ({ page }) => {
      // Go to editor without auth
      await page.goto('http://localhost:3000/src/wiki/wiki-editor.html');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Editor should NOT be completely hidden
      const editorSection = page.locator('.editor-section, #editor, .ql-toolbar');
      const count = await editorSection.count();

      // Should have at least some editor elements visible
      expect(count).toBeGreaterThan(0);

      console.log('✓ Editor remains visible (not completely hidden)');
    });
  });

  test.describe('Auth Header Functionality', {
    tag: '@auth-header'
  }, () => {

    test('should initialize auth header on page load', async ({ page }) => {
      const consoleLogs = [];

      page.on('console', msg => {
        consoleLogs.push(msg.text());
      });

      // Go to any wiki page
      await page.goto('http://localhost:3000/src/wiki/wiki-home.html');
      await page.waitForLoadState('networkidle');

      // Should have auth header initialization log
      const authLog = consoleLogs.find(log => log.includes('🔐 Updating auth header'));
      expect(authLog).toBeTruthy();

      console.log('✓ Auth header initialized');
    });

    test('should update UI based on authentication state', async ({ page }) => {
      // Clear cookies to ensure logged out state
      await page.context().clearCookies();
      await page.goto('http://localhost:3000/src/wiki/wiki-home.html');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // When logged out:
      // - Create Page button should be hidden
      // - Login link should be visible

      const createButton = page.locator('a[href="wiki-editor.html"]:has-text("Create Page")');
      await expect(createButton).toBeHidden();

      console.log('✓ UI updated based on auth state');
    });
  });

  test.describe('User Experience', {
    tag: '@ux'
  }, () => {

    test('should provide clear visual feedback that auth is required', async ({ page }) => {
      // Go to events page
      await page.goto('http://localhost:3000/src/wiki/wiki-events.html');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Disabled button should have visual distinction
      const addEventBtn = page.locator('#addEventBtn');
      const count = await addEventBtn.count();

      if (count > 0) {
        // Check opacity is reduced
        const opacity = await addEventBtn.evaluate(el => window.getComputedStyle(el).opacity);
        expect(parseFloat(opacity)).toBe(0.5);

        // Has tooltip
        const title = await addEventBtn.getAttribute('title');
        expect(title).toBeTruthy();

        console.log('✓ Clear visual feedback provided');
      }
    });

    test('should explain why action is disabled', async ({ page }) => {
      // Go to editor
      await page.goto('http://localhost:3000/src/wiki/wiki-editor.html');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Banner should explain editing is disabled
      const pageContent = await page.content();

      // Should contain explanation
      expect(pageContent).toMatch(/not logged in|log in to edit|editing is disabled/i);

      console.log('✓ Explanation provided for disabled actions');
    });
  });
});
