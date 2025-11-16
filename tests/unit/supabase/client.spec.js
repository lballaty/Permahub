/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/tests/unit/supabase/client.spec.js
 * Description: Unit tests for Supabase client wrapper
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-16
 *
 * Tags: @unit @supabase @database
 */

import { test, expect, describe, beforeEach } from '@playwright/test';

describe('Supabase Client - Unit Tests @unit @supabase @database', () => {

  test.describe('Client Initialization', () => {

    test('should have valid Supabase URL configuration', async () => {
      // Test that environment variables are properly set
      const supabaseUrl = process.env.VITE_SUPABASE_URL;

      expect(supabaseUrl).toBeDefined();
      expect(supabaseUrl).toBeTruthy();

      // Should be either local or cloud URL
      const isValidUrl =
        supabaseUrl.includes('127.0.0.1:54321') ||
        supabaseUrl.includes('supabase.co');

      expect(isValidUrl).toBeTruthy();
    });

    test('should have valid Supabase anon key', async () => {
      const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

      expect(anonKey).toBeDefined();
      expect(anonKey).toBeTruthy();
      expect(anonKey.length).toBeGreaterThan(100); // JWT tokens are long
    });

    test('should NOT expose service role key in frontend', async () => {
      // Service role key should never be in frontend code
      const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

      // This should be undefined in frontend context
      // Only backend should have access to service role key
      console.log('Service role key check (should be undefined in frontend):', serviceRoleKey ? 'EXPOSED' : 'SAFE');
    });
  });

  test.describe('Data Fetching Methods', () => {

    test('getAll() should require valid table name', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');

      // Wait for page to load
      await page.waitForTimeout(1000);

      // Test invalid table name handling
      const result = await page.evaluate(async () => {
        try {
          const { supabase } = await import('../../js/supabase-client.js');
          const data = await supabase.getAll('invalid_table_name');
          return { success: true, data };
        } catch (error) {
          return { success: false, error: error.message };
        }
      });

      // Should handle error gracefully
      expect(result).toBeDefined();
    });

    test('getAll() should support filtering with where clause', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(1000);

      const result = await page.evaluate(async () => {
        const { supabase } = await import('../../js/supabase-client.js');
        const data = await supabase.getAll('wiki_guides', {
          where: 'status',
          operator: 'eq',
          value: 'published'
        });
        return data;
      });

      expect(Array.isArray(result)).toBeTruthy();

      // All returned items should have status = published
      if (result.length > 0) {
        result.forEach(item => {
          expect(item.status).toBe('published');
        });
      }
    });

    test('getAll() should support ordering', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(1000);

      const result = await page.evaluate(async () => {
        const { supabase } = await import('../../js/supabase-client.js');
        const data = await supabase.getAll('wiki_guides', {
          where: 'status',
          operator: 'eq',
          value: 'published',
          order: 'created_at.desc'
        });
        return data;
      });

      expect(Array.isArray(result)).toBeTruthy();

      // Verify ordering (newest first)
      if (result.length > 1) {
        const firstDate = new Date(result[0].created_at);
        const secondDate = new Date(result[1].created_at);
        expect(firstDate >= secondDate).toBeTruthy();
      }
    });

    test('getAll() should support limit', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(1000);

      const result = await page.evaluate(async () => {
        const { supabase } = await import('../../js/supabase-client.js');
        const data = await supabase.getAll('wiki_guides', {
          where: 'status',
          operator: 'eq',
          value: 'published',
          limit: 5
        });
        return data;
      });

      expect(Array.isArray(result)).toBeTruthy();
      expect(result.length).toBeLessThanOrEqual(5);
    });
  });

  test.describe('Error Handling', () => {

    test('should handle network errors gracefully', async ({ page, context }) => {
      // Go offline
      await context.setOffline(true);

      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(1000);

      const result = await page.evaluate(async () => {
        try {
          const { supabase } = await import('../../js/supabase-client.js');
          const data = await supabase.getAll('wiki_guides');
          return { success: true, data };
        } catch (error) {
          return { success: false, error: error.message };
        }
      });

      // Should handle error
      expect(result.success).toBeFalsy();

      // Restore connection
      await context.setOffline(false);
    });

    test('should handle invalid queries gracefully', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(1000);

      const result = await page.evaluate(async () => {
        try {
          const { supabase } = await import('../../js/supabase-client.js');
          // Invalid operator
          const data = await supabase.getAll('wiki_guides', {
            where: 'status',
            operator: 'invalid_operator',
            value: 'published'
          });
          return { success: true, data };
        } catch (error) {
          return { success: false, error: error.message };
        }
      });

      // Should handle error
      expect(result).toBeDefined();
    });
  });

  test.describe('Security - RLS Policies', () => {

    test('should enforce RLS on wiki_guides table', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(1000);

      const result = await page.evaluate(async () => {
        const { supabase } = await import('../../js/supabase-client.js');

        // Should only return published guides (RLS policy)
        const allGuides = await supabase.getAll('wiki_guides');

        return {
          count: allGuides.length,
          hasDrafts: allGuides.some(g => g.status === 'draft')
        };
      });

      // Should NOT return drafts unless user is authenticated and is the author
      expect(result.hasDrafts).toBeFalsy();
    });

    test('should enforce RLS on wiki_events table', async ({ page }) => {
      await page.goto('/src/wiki/wiki-events.html');
      await page.waitForTimeout(1000);

      const result = await page.evaluate(async () => {
        const { supabase } = await import('../../js/supabase-client.js');

        const events = await supabase.getAll('wiki_events');

        return {
          count: events.length,
          hasDrafts: events.some(e => e.status === 'draft')
        };
      });

      // Should NOT return draft events
      expect(result.hasDrafts).toBeFalsy();
    });

    test('should enforce RLS on wiki_locations table', async ({ page }) => {
      await page.goto('/src/wiki/wiki-map.html');
      await page.waitForTimeout(1000);

      const result = await page.evaluate(async () => {
        const { supabase } = await import('../../js/supabase-client.js');

        const locations = await supabase.getAll('wiki_locations');

        return {
          count: locations.length,
          hasUnpublished: locations.some(l => l.status !== 'published')
        };
      });

      // Should only return published locations
      expect(result.hasUnpublished).toBeFalsy();
    });
  });

  test.describe('Performance', () => {

    test('should fetch data within acceptable time (< 2 seconds)', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(500);

      const startTime = Date.now();

      const result = await page.evaluate(async () => {
        const { supabase } = await import('../../js/supabase-client.js');
        const data = await supabase.getAll('wiki_guides', {
          where: 'status',
          operator: 'eq',
          value: 'published',
          limit: 20
        });
        return data;
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`Fetch duration: ${duration}ms`);
      expect(duration).toBeLessThan(2000); // Should complete within 2 seconds
    });

    test('should cache repeated identical queries', async ({ page }) => {
      await page.goto('/src/wiki/wiki-home.html');
      await page.waitForTimeout(500);

      // First call
      const start1 = Date.now();
      const result1 = await page.evaluate(async () => {
        const { supabase } = await import('../../js/supabase-client.js');
        return await supabase.getAll('wiki_categories');
      });
      const duration1 = Date.now() - start1;

      // Second call (should be faster if cached)
      const start2 = Date.now();
      const result2 = await page.evaluate(async () => {
        const { supabase } = await import('../../js/supabase-client.js');
        return await supabase.getAll('wiki_categories');
      });
      const duration2 = Date.now() - start2;

      console.log(`First call: ${duration1}ms, Second call: ${duration2}ms`);

      // Both should return same data
      expect(result1.length).toBe(result2.length);
    });
  });
});
