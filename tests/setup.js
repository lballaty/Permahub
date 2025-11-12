/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/tests/setup.js
 * Description: Global test setup and configuration
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-07
 */

import { vi } from 'vitest';

// Mock fetch globally
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
global.localStorage = localStorageMock;

// Mock window.ENV
global.window = {
  ENV: {
    VITE_SUPABASE_URL: 'https://mcbxbaggjaxqfdvmrqsc.supabase.co',
    VITE_SUPABASE_ANON_KEY: 'test-key'
  }
};

// Mock import.meta.env
global.import = {
  meta: {
    env: {
      VITE_SUPABASE_URL: 'https://mcbxbaggjaxqfdvmrqsc.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'test-key',
      MODE: 'test'
    }
  }
};

// Setup common test utilities
export const testUser = {
  id: 'test-user-id-123',
  email: 'test@example.com',
  fullName: 'Test User'
};

export const testProject = {
  id: 'test-project-id-123',
  name: 'Test Permaculture Project',
  description: 'A test project for Permahub',
  type: 'permaculture',
  latitude: 32.7546,
  longitude: -17.0031
};

export const testResource = {
  id: 'test-resource-id-123',
  title: 'Test Heirloom Seeds',
  description: 'Test seeds for planting',
  category: 'plant',
  price: 10.00,
  currency: 'EUR'
};
