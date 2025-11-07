/**
 * Application Configuration
 * Permaculture Network Platform
 *
 * This file handles environment variable loading for both development and production.
 * Environment variables are loaded from .env files using Vite.
 */

/**
 * Get environment variable with fallback
 * In production with Vite build, use import.meta.env
 * In development without build, use window.ENV if available
 */
function getEnv(key, fallback = '') {
  // Try Vite environment variables (available after build)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || fallback;
  }

  // Try window.ENV object (can be set in HTML for development)
  if (typeof window !== 'undefined' && window.ENV && window.ENV[key]) {
    return window.ENV[key];
  }

  // Return fallback
  return fallback;
}

/**
 * Supabase Configuration
 * Load from environment variables or use defaults for development
 */
export const SUPABASE_CONFIG = {
  url: getEnv('VITE_SUPABASE_URL', 'https://mcbxbaggjaxqfdvmrqsc.supabase.co'),
  anonKey: getEnv(
    'VITE_SUPABASE_ANON_KEY',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYnhiYWdnamF4cWZkdm1ycXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MDE4NDYsImV4cCI6MjA3ODA3Nzg0Nn0.agjLGl7uW0S1tGgivGBVthHWAgw0YxHjJNLHkhsViO0'
  ),
  serviceRoleKey: getEnv(
    'VITE_SUPABASE_SERVICE_ROLE_KEY',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYnhiYWdnamF4cWZkdm1ycXNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUwMTg0NiwiZXhwIjoyMDc4MDc3ODQ2fQ.dTRFNjBrZHsLERsjzqSckpJ1oaQcCjIw98_UvgKyQJU'
  )
};

// Warn if using fallback values in production
if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PROD) {
  if (!import.meta.env.VITE_SUPABASE_URL) {
    console.warn('⚠️ WARNING: Using fallback Supabase URL in production. Set VITE_SUPABASE_URL environment variable.');
  }
}
