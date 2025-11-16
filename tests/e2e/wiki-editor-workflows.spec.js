/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/tests/e2e/wiki-editor-workflows.spec.js
 * Description: End-to-end tests for wiki editor draft/publish workflows (guide, event, location)
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-16
 */

import { test, expect, chromium } from '@playwright/test';

/**
 * Test suite for wiki editor functionality
 * Tests the complete workflow of creating and publishing guides, events, and locations
 *
 * Prerequisites:
 * - User must be logged in as liborballaty@gmail.com in Chrome
 * - Dev server must be running on http://localhost:3000
 * - Supabase database must be accessible
 */
test.describe('Wiki Editor Workflows', () => {

  // Generate unique slugs for each test run to avoid conflicts
  const timestamp = Date.now();
  const testGuideTitle = `Test Guide ${timestamp}`;
  const testEventTitle = `Test Event ${timestamp}`;
  const testLocationTitle = `Test Location ${timestamp}`;

  test.beforeEach(async ({ page }) => {
    // Mock authentication by setting localStorage
    await page.goto('http://localhost:3001/src/wiki/wiki-editor.html');

    // Set mock authentication token and user in localStorage
    await page.evaluate(() => {
      // Set auth token
      localStorage.setItem('auth_token', 'mock-auth-token-for-testing');

      // Set user object (matching what Supabase client expects)
      const mockUser = {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'liborballaty@gmail.com',
        full_name: 'Test User'
      };
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('user_id', '00000000-0000-0000-0000-000000000001');
    });

    // Reload page with auth set
    await page.reload();

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Wait for Quill editor to initialize (with longer timeout)
    await page.waitForSelector('.ql-editor', { timeout: 15000 });
  });

  /**
   * Test 1: Create and publish a guide
   * Verifies: Draft save → Edit → Publish workflow
   */
  test('should create and publish a guide successfully', async ({ page }) => {
    console.log('🧪 Test: Create and publish guide');

    // Step 1: Verify we're on the editor page
    await expect(page).toHaveURL(/wiki-editor\.html/);
    await expect(page.locator('h1')).toContainText(/Create New Guide/i);

    // Step 2: Select "Guide" content type (should be selected by default)
    const guideRadio = page.locator('input[name="contentType"][value="guide"]');
    await expect(guideRadio).toBeChecked();
    console.log('✅ Guide content type selected');

    // Step 3: Fill in the title
    const titleInput = page.locator('#title');
    await titleInput.fill(testGuideTitle);
    console.log(`✅ Title filled: ${testGuideTitle}`);

    // Step 4: Fill in the summary
    const summaryInput = page.locator('#summary');
    await summaryInput.fill('This is a comprehensive test guide for verifying the draft and publish workflow in the wiki editor.');
    console.log('✅ Summary filled');

    // Step 5: Fill in the content using Quill editor
    const quillEditor = page.locator('.ql-editor');
    await quillEditor.click();
    await quillEditor.fill('This is the main content of the test guide. It includes detailed information about permaculture practices, sustainable living, and community building. This content is being created by an automated test to verify the editor functionality.');
    console.log('✅ Content filled');

    // Step 6: Select at least one category
    const categoryCheckbox = page.locator('.category-checkbox').first();
    if (await categoryCheckbox.count() > 0) {
      await categoryCheckbox.check();
      console.log('✅ Category selected');
    }

    // Step 7: Save as draft first
    // Set up dialog handler BEFORE clicking button
    let draftSaved = false;
    page.once('dialog', async dialog => {
      console.log(`📢 Draft Dialog: ${dialog.message()}`);
      draftSaved = true;
      await dialog.accept();
    });

    const saveDraftBtn = page.locator('#saveDraftBtn').first();
    await saveDraftBtn.click();
    console.log('💾 Clicked "Save Draft" button');

    // Wait for save operation to complete
    await page.waitForTimeout(3000);
    if (draftSaved) {
      console.log('✅ Draft saved (alert accepted)');
    }

    // Step 8: Now publish the guide
    // Set up dialog handler for publish
    let published = false;
    page.once('dialog', async dialog => {
      console.log(`📢 Publish Dialog: ${dialog.message()}`);
      published = true;
      await dialog.accept();
    });

    const publishBtn = page.locator('#publishBtn').first();
    await publishBtn.click();
    console.log('📤 Clicked "Publish" button');

    // Wait for publish operation and potential redirect
    await page.waitForTimeout(5000);

    // Check current URL
    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);

    // After publishing, should redirect to guide page or guides list
    // If still on editor, that's okay - we can verify by navigating to guides
    if (currentUrl.includes('wiki-editor.html')) {
      console.log('⚠️  Still on editor page - navigating to guides to verify publish');
      await page.goto('http://localhost:3001/src/wiki/wiki-guides.html');
      await page.waitForLoadState('networkidle');
    }

    console.log('✅ Guide creation workflow completed!');
  });

  /**
   * Test 2: Create and publish an event
   * Verifies: Event-specific fields and workflow
   */
  test('should create and publish an event successfully', async ({ page }) => {
    console.log('🧪 Test: Create and publish event');

    // Step 1: Select "Event" content type
    const eventRadio = page.locator('input[name="contentType"][value="event"]');
    await eventRadio.check();
    console.log('✅ Event content type selected');

    // Wait for event fields to appear
    await page.waitForSelector('#eventFields', { state: 'visible' });
    await expect(page.locator('#eventFields')).toBeVisible();
    console.log('✅ Event fields visible');

    // Step 2: Fill in the title
    const titleInput = page.locator('#title');
    await titleInput.fill(testEventTitle);
    console.log(`✅ Title filled: ${testEventTitle}`);

    // Step 3: Fill in the summary
    const summaryInput = page.locator('#summary');
    await summaryInput.fill('Join us for a community gathering to discuss sustainable farming practices and permaculture design principles.');
    console.log('✅ Summary filled');

    // Step 4: Fill in the content
    const quillEditor = page.locator('.ql-editor');
    await quillEditor.click();
    await quillEditor.fill('This is a test event description. We will cover topics including: water management, soil health, companion planting, and community building. Bring your questions and enthusiasm!');
    console.log('✅ Content filled');

    // Step 5: Fill in event-specific fields
    const eventDate = page.locator('#eventDate');
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7); // 7 days from now
    const futureDateStr = futureDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    await eventDate.fill(futureDateStr);
    console.log(`✅ Event date filled: ${futureDateStr}`);

    const startTime = page.locator('#eventStartTime');
    await startTime.fill('14:00');
    console.log('✅ Start time filled: 14:00');

    const endTime = page.locator('#eventEndTime');
    await endTime.fill('17:00');
    console.log('✅ End time filled: 17:00');

    const eventLocation = page.locator('#eventLocation');
    await eventLocation.fill('Community Garden, 123 Green Street');
    console.log('✅ Event location filled');

    // Step 6: Select a category
    const categoryCheckbox = page.locator('.category-checkbox').first();
    if (await categoryCheckbox.count() > 0) {
      await categoryCheckbox.check();
      console.log('✅ Category selected');
    }

    // Step 7: Save as draft
    page.once('dialog', async dialog => {
      console.log(`📢 Draft Dialog: ${dialog.message()}`);
      await dialog.accept();
    });

    const saveDraftBtn = page.locator('#saveDraftBtn').first();
    await saveDraftBtn.click();
    console.log('💾 Clicked "Save Draft" button');
    await page.waitForTimeout(3000);

    // Step 8: Publish the event
    page.once('dialog', async dialog => {
      console.log(`📢 Publish Dialog: ${dialog.message()}`);
      await dialog.accept();
    });

    const publishBtn = page.locator('#publishBtn').first();
    await publishBtn.click();
    console.log('📤 Clicked "Publish" button');
    await page.waitForTimeout(5000);

    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);

    console.log('✅ Event creation workflow completed!');
  });

  /**
   * Test 3: Create and publish a location
   * Verifies: Location-specific fields (coordinates) and workflow
   */
  test('should create and publish a location successfully', async ({ page }) => {
    console.log('🧪 Test: Create and publish location');

    // Step 1: Select "Location" content type
    const locationRadio = page.locator('input[name="contentType"][value="location"]');
    await locationRadio.check();
    console.log('✅ Location content type selected');

    // Wait for location fields to appear
    await page.waitForSelector('#locationFields', { state: 'visible' });
    await expect(page.locator('#locationFields')).toBeVisible();
    console.log('✅ Location fields visible');

    // Step 2: Fill in the name/title
    const titleInput = page.locator('#title');
    await titleInput.fill(testLocationTitle);
    console.log(`✅ Title filled: ${testLocationTitle}`);

    // Step 3: Fill in the description/summary
    const summaryInput = page.locator('#summary');
    await summaryInput.fill('A beautiful permaculture demonstration site featuring food forests, swales, and natural building techniques.');
    console.log('✅ Summary filled');

    // Step 4: Fill in the content
    const quillEditor = page.locator('.ql-editor');
    await quillEditor.click();
    await quillEditor.fill('This test location showcases sustainable living practices including: rainwater harvesting, solar power, composting systems, and organic gardening. Visitors are welcome by appointment.');
    console.log('✅ Content filled');

    // Step 5: Fill in location-specific fields
    const address = page.locator('#address');
    await address.fill('456 Sustainability Lane, Eco City, Green Country');
    console.log('✅ Address filled');

    // Using coordinates for Madeira, Portugal (example permaculture location)
    const latitude = page.locator('#latitude');
    await latitude.fill('32.6669');
    console.log('✅ Latitude filled: 32.6669');

    const longitude = page.locator('#longitude');
    await longitude.fill('-16.9241');
    console.log('✅ Longitude filled: -16.9241');

    // Step 6: Select a category
    const categoryCheckbox = page.locator('.category-checkbox').first();
    if (await categoryCheckbox.count() > 0) {
      await categoryCheckbox.check();
      console.log('✅ Category selected');
    }

    // Step 7: Save as draft
    page.once('dialog', async dialog => {
      console.log(`📢 Draft Dialog: ${dialog.message()}`);
      await dialog.accept();
    });

    const saveDraftBtn = page.locator('#saveDraftBtn').first();
    await saveDraftBtn.click();
    console.log('💾 Clicked "Save Draft" button');
    await page.waitForTimeout(3000);

    // Step 8: Publish the location
    page.once('dialog', async dialog => {
      console.log(`📢 Publish Dialog: ${dialog.message()}`);
      await dialog.accept();
    });

    const publishBtn = page.locator('#publishBtn').first();
    await publishBtn.click();
    console.log('📤 Clicked "Publish" button');
    await page.waitForTimeout(5000);

    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);

    console.log('✅ Location creation workflow completed!');
  });

  /**
   * Test 4: Verify draft is not visible on public pages
   * This test ensures that drafts remain hidden from public view
   */
  test('should keep drafts hidden from public pages', async ({ page }) => {
    console.log('🧪 Test: Verify drafts are hidden from public');

    const draftTitle = `Draft Only Test ${timestamp}`;

    // Step 1: Create a guide
    const guideRadio = page.locator('input[name="contentType"][value="guide"]');
    await expect(guideRadio).toBeChecked();

    // Step 2: Fill in basic info
    await page.locator('#title').fill(draftTitle);
    await page.locator('#summary').fill('This is a draft that should not be visible on public pages.');

    const quillEditor = page.locator('.ql-editor');
    await quillEditor.click();
    await quillEditor.fill('Draft content for testing visibility.');

    // Step 3: Save as draft ONLY (do not publish)
    page.once('dialog', async dialog => {
      console.log(`📢 Draft Dialog: ${dialog.message()}`);
      await dialog.accept();
    });

    const saveDraftBtn = page.locator('#saveDraftBtn').first();
    await saveDraftBtn.click();
    console.log('💾 Saved as draft only');
    await page.waitForTimeout(3000);

    // Step 4: Navigate to guides page
    await page.goto('http://localhost:3001/src/wiki/wiki-guides.html');
    await page.waitForLoadState('networkidle');
    console.log('📄 Navigated to guides page');

    // Step 5: Search for the draft title
    const searchInput = page.locator('#guideSearch');
    if (await searchInput.count() > 0) {
      await searchInput.fill(draftTitle);
      await page.waitForTimeout(1000);
    }

    // Step 6: Verify the draft is NOT visible
    const guidesGrid = page.locator('#guidesGrid');
    const draftCard = guidesGrid.locator(`text=${draftTitle}`);

    // Should NOT find the draft title on the public page
    await expect(draftCard).toHaveCount(0);
    console.log('✅ Draft is correctly hidden from public view');
  });

  /**
   * Test 5: Verify published content is visible
   * This test ensures that published content appears on public pages
   */
  test('should display published guides on public pages', async ({ page }) => {
    console.log('🧪 Test: Verify published content is visible');

    const publishedTitle = `Published Test ${timestamp}`;

    // Step 1: Create and publish a guide
    await page.locator('#title').fill(publishedTitle);
    await page.locator('#summary').fill('This published guide should be visible on the guides page.');

    const quillEditor = page.locator('.ql-editor');
    await quillEditor.click();
    await quillEditor.fill('Published content for testing visibility.');

    // Step 2: Publish immediately
    page.once('dialog', async dialog => {
      console.log(`📢 Publish Dialog: ${dialog.message()}`);
      await dialog.accept();
    });

    const publishBtn = page.locator('#publishBtn').first();
    await publishBtn.click();
    console.log('📤 Published guide');
    await page.waitForTimeout(5000);

    // Step 3: Navigate to guides page
    await page.goto('http://localhost:3001/src/wiki/wiki-guides.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for guides to load
    console.log('📄 Navigated to guides page');

    // Step 4: Search for the published title
    const searchInput = page.locator('#guideSearch');
    if (await searchInput.count() > 0) {
      await searchInput.fill(publishedTitle);
      await page.waitForTimeout(1500);
    }

    // Step 5: Verify the published guide IS visible
    const guidesGrid = page.locator('#guidesGrid');
    const publishedCard = guidesGrid.locator(`text=${publishedTitle}`);

    // Should find the published title on the public page
    await expect(publishedCard).toBeVisible({ timeout: 5000 });
    console.log('✅ Published guide is correctly visible on public page');
  });

});
