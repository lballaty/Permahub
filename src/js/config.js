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
  url: getEnv('VITE_SUPABASE_URL', 'http://127.0.0.1:54321'),
  anonKey: getEnv(
    'VITE_SUPABASE_ANON_KEY',
    'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH'
  ),
  serviceRoleKey: getEnv(
    'VITE_SUPABASE_SERVICE_ROLE_KEY',
    'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz'
  )
};

// Warn if using fallback values in production
if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PROD) {
  if (!import.meta.env.VITE_SUPABASE_URL) {
    console.warn('⚠️ WARNING: Using fallback Supabase URL in production. Set VITE_SUPABASE_URL environment variable.');
  }
}
