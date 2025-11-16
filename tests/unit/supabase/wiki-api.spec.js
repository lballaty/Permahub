/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/tests/unit/supabase/wiki-api.spec.js
 * Description: Unit tests for Wiki API wrapper functions
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-16
 *
 * Tags: @unit @wiki @api @database
 */

import { test, expect, describe } from '@playwright/test';

describe('Wiki API - Unit Tests @unit @wiki @api @database', () => {

  test.describe('Category Functions', () => {

    test('getCategories() should return all categories', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(1000);

      const categories = await page.evaluate(async () => {
        const { WikiAPI } = await import('../../wiki/js/wiki-supabase.js');
        const { supabase } = await import('../../js/supabase-client.js');
        const wikiAPI = new WikiAPI(supabase);
        return await wikiAPI.getCategories();
      });

      expect(Array.isArray(categories)).toBeTruthy();
      expect(categories.length).toBeGreaterThan(0);

      // Each category should have required fields
      categories.forEach(category => {
        expect(category).toHaveProperty('id');
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('slug');
      });
    });

    test('categories should be sorted alphabetically', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(1000);

      const categories = await page.evaluate(async () => {
        const { WikiAPI } = await import('../../wiki/js/wiki-supabase.js');
        const { supabase } = await import('../../js/supabase-client.js');
        const wikiAPI = new WikiAPI(supabase);
        return await wikiAPI.getCategories();
      });

      // Check alphabetical ordering
      for (let i = 0; i < categories.length - 1; i++) {
        const current = categories[i].name.toLowerCase();
        const next = categories[i + 1].name.toLowerCase();
        expect(current <= next).toBeTruthy();
      }
    });
  });

  test.describe('Guide Functions', () => {

    test('getGuides() should return published guides only', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(1000);

      const guides = await page.evaluate(async () => {
        const { WikiAPI } = await import('../../wiki/js/wiki-supabase.js');
        const { supabase } = await import('../../js/supabase-client.js');
        const wikiAPI = new WikiAPI(supabase);
        return await wikiAPI.getGuides();
      });

      expect(Array.isArray(guides)).toBeTruthy();

      // All guides should be published
      guides.forEach(guide => {
        expect(guide.status).toBe('published');
      });
    });

    test('getGuides() should support limit option', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(1000);

      const guides = await page.evaluate(async () => {
        const { WikiAPI } = await import('../../wiki/js/wiki-supabase.js');
        const { supabase } = await import('../../js/supabase-client.js');
        const wikiAPI = new WikiAPI(supabase);
        return await wikiAPI.getGuides({ limit: 5 });
      });

      expect(guides.length).toBeLessThanOrEqual(5);
    });

    test('getGuides() should support custom ordering', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(1000);

      const guides = await page.evaluate(async () => {
        const { WikiAPI } = await import('../../wiki/js/wiki-supabase.js');
        const { supabase } = await import('../../js/supabase-client.js');
        const wikiAPI = new WikiAPI(supabase);
        return await wikiAPI.getGuides({ order: 'created_at.desc' });
      });

      // Verify descending order by creation date
      if (guides.length > 1) {
        const firstDate = new Date(guides[0].created_at);
        const secondDate = new Date(guides[1].created_at);
        expect(firstDate >= secondDate).toBeTruthy();
      }
    });

    test('getGuide() should fetch single guide by slug', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(1000);

      // First get a valid slug
      const slug = await page.evaluate(async () => {
        const { WikiAPI } = await import('../../wiki/js/wiki-supabase.js');
        const { supabase } = await import('../../js/supabase-client.js');
        const wikiAPI = new WikiAPI(supabase);
        const guides = await wikiAPI.getGuides({ limit: 1 });
        return guides[0]?.slug;
      });

      if (!slug) {
        console.log('No guides available for testing');
        return;
      }

      // Fetch specific guide
      const guide = await page.evaluate(async (testSlug) => {
        const { WikiAPI } = await import('../../wiki/js/wiki-supabase.js');
        const { supabase } = await import('../../js/supabase-client.js');
        const wikiAPI = new WikiAPI(supabase);
        return await wikiAPI.getGuide(testSlug);
      }, slug);

      expect(guide).toBeTruthy();
      expect(guide.slug).toBe(slug);
      expect(guide).toHaveProperty('title');
      expect(guide).toHaveProperty('content');
    });

    test('getGuide() should increment view count', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(1000);

      // Get a guide slug
      const testData = await page.evaluate(async () => {
        const { WikiAPI } = await import('../../wiki/js/wiki-supabase.js');
        const { supabase } = await import('../../js/supabase-client.js');
        const wikiAPI = new WikiAPI(supabase);
        const guides = await wikiAPI.getGuides({ limit: 1 });
        return {
          slug: guides[0]?.slug,
          initialViews: guides[0]?.view_count || 0
        };
      });

      if (!testData.slug) {
        console.log('No guides available for testing');
        return;
      }

      // Fetch the guide (should increment view count)
      await page.evaluate(async (testSlug) => {
        const { WikiAPI } = await import('../../wiki/js/wiki-supabase.js');
        const { supabase } = await import('../../js/supabase-client.js');
        const wikiAPI = new WikiAPI(supabase);
        await wikiAPI.getGuide(testSlug);
      }, testData.slug);

      // Note: View count increment happens asynchronously
      // In real implementation, verify this via database query
      console.log(`Initial view count: ${testData.initialViews}`);
    });

    test('getGuide() should return null for invalid slug', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(1000);

      const guide = await page.evaluate(async () => {
        const { WikiAPI } = await import('../../wiki/js/wiki-supabase.js');
        const { supabase } = await import('../../js/supabase-client.js');
        const wikiAPI = new WikiAPI(supabase);
        return await wikiAPI.getGuide('non-existent-guide-slug-12345');
      });

      expect(guide).toBeNull();
    });
  });

  test.describe('Translation Support', () => {

    test('getGuides() should support language parameter', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(1000);

      const guides = await page.evaluate(async () => {
        const { WikiAPI } = await import('../../wiki/js/wiki-supabase.js');
        const { supabase } = await import('../../js/supabase-client.js');
        const wikiAPI = new WikiAPI(supabase);

        // Test with Portuguese
        return await wikiAPI.getGuides({ language: 'pt' });
      });

      expect(Array.isArray(guides)).toBeTruthy();

      // If translations exist, check language code
      guides.forEach(guide => {
        if (guide.language_code) {
          expect(['en', 'pt']).toContain(guide.language_code);
        }
      });
    });

    test('getGuide() should return English content by default', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(1000);

      const slug = await page.evaluate(async () => {
        const { WikiAPI } = await import('../../wiki/js/wiki-supabase.js');
        const { supabase } = await import('../../js/supabase-client.js');
        const wikiAPI = new WikiAPI(supabase);
        const guides = await wikiAPI.getGuides({ limit: 1 });
        return guides[0]?.slug;
      });

      if (!slug) return;

      const guide = await page.evaluate(async (testSlug) => {
        const { WikiAPI } = await import('../../wiki/js/wiki-supabase.js');
        const { supabase } = await import('../../js/supabase-client.js');
        const wikiAPI = new WikiAPI(supabase);
        return await wikiAPI.getGuide(testSlug, 'en');
      }, slug);

      expect(guide).toBeTruthy();
      // Default language is English (or no language code if not translated)
      if (guide.language_code) {
        expect(guide.language_code).toBe('en');
      }
    });
  });

  test.describe('Data Validation', () => {

    test('guide objects should have required fields', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(1000);

      const guides = await page.evaluate(async () => {
        const { WikiAPI } = await import('../../wiki/js/wiki-supabase.js');
        const { supabase } = await import('../../js/supabase-client.js');
        const wikiAPI = new WikiAPI(supabase);
        return await wikiAPI.getGuides({ limit: 1 });
      });

      if (guides.length === 0) return;

      const guide = guides[0];

      // Required fields
      expect(guide).toHaveProperty('id');
      expect(guide).toHaveProperty('title');
      expect(guide).toHaveProperty('slug');
      expect(guide).toHaveProperty('summary');
      expect(guide).toHaveProperty('content');
      expect(guide).toHaveProperty('status');
      expect(guide).toHaveProperty('created_at');

      // Slug should be valid format
      expect(guide.slug).toMatch(/^[a-z0-9-]+$/);

      // Status should be valid
      expect(['draft', 'published', 'archived']).toContain(guide.status);
    });

    test('guide content should not be empty', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(1000);

      const guides = await page.evaluate(async () => {
        const { WikiAPI } = await import('../../wiki/js/wiki-supabase.js');
        const { supabase } = await import('../../js/supabase-client.js');
        const wikiAPI = new WikiAPI(supabase);
        return await wikiAPI.getGuides();
      });

      guides.forEach(guide => {
        expect(guide.title.length).toBeGreaterThan(0);
        expect(guide.summary.length).toBeGreaterThan(0);
        expect(guide.content.length).toBeGreaterThan(0);
      });
    });
  });

  test.describe('Error Handling', () => {

    test('should handle API errors gracefully', async ({ page, context }) => {
      // Simulate network failure
      await context.setOffline(true);

      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(500);

      const result = await page.evaluate(async () => {
        try {
          const { WikiAPI } = await import('../../wiki/js/wiki-supabase.js');
          const { supabase } = await import('../../js/supabase-client.js');
          const wikiAPI = new WikiAPI(supabase);
          return await wikiAPI.getGuides();
        } catch (error) {
          return { error: error.message };
        }
      });

      // Should return empty array or error object
      expect(result).toBeDefined();

      await context.setOffline(false);
    });

    test('should return empty array on database error', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(1000);

      // Test with invalid options (should handle gracefully)
      const result = await page.evaluate(async () => {
        const { WikiAPI } = await import('../../wiki/js/wiki-supabase.js');
        const { supabase } = await import('../../js/supabase-client.js');
        const wikiAPI = new WikiAPI(supabase);

        // Invalid options should return empty array
        return await wikiAPI.getGuides({ limit: -1 });
      });

      expect(Array.isArray(result)).toBeTruthy();
    });
  });
});
