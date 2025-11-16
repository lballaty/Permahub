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
 * Detect environment based on hostname
 * Returns true if running on localhost/127.0.0.1
 */
function isLocalEnvironment() {
  if (typeof window === 'undefined') return true; // Server-side/build time
  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '';
}

/**
 * Supabase Configuration
 * Automatically detects environment and uses appropriate credentials
 *
 * LOCAL (localhost): Uses local Supabase instance
 * CLOUD (GitHub Pages): Uses cloud Supabase instance
 *
 * NOTE: Anon key is safe to expose in frontend - it's meant to be public.
 * Service role key has been REMOVED for security - it should never be in frontend code.
 */
export const SUPABASE_CONFIG = {
  url: isLocalEnvironment()
    ? 'http://127.0.0.1:3000'  // Local Supabase API port (from supabase/config.toml)
    : 'https://mcbxbaggjaxqfdvmrqsc.supabase.co',

  anonKey: isLocalEnvironment()
    ? 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH'  // Local dev anon key (from supabase status)
    : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYnhiYWdnamF4cWZkdm1ycXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MDE4NDYsImV4cCI6MjA3ODA3Nzg0Nn0.agjLGl7uW0S1tGgivGBVthHWAgw0YxHjJNLHkhsViO0'  // Cloud anon key (safe to expose)
};

// Warn if using fallback values in production
if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PROD) {
  if (!import.meta.env.VITE_SUPABASE_URL) {
    console.warn('⚠️ WARNING: Using fallback Supabase URL in production. Set VITE_SUPABASE_URL environment variable.');
  }
}
