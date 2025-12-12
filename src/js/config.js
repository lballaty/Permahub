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
 * Determine which database to use based on environment variable and hostname
 * Priority order:
 * 1. VITE_USE_CLOUD_DB=true → Force cloud database
 * 2. VITE_USE_CLOUD_DB=false → Force local database
 * 3. Not set → Auto-detect based on hostname (current behavior)
 * 4. Production build → Always use cloud database
 */
function shouldUseCloudDatabase() {
  // In production builds, always use cloud database
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PROD) {
    return true;
  }

  // Check for explicit override via environment variable
  const forceCloud = getEnv('VITE_USE_CLOUD_DB', null);

  if (forceCloud === 'true') {
    return true;  // Explicitly requested cloud
  }

  if (forceCloud === 'false') {
    return false; // Explicitly requested local
  }

  // No override set - use auto-detection based on hostname
  return !isLocalEnvironment();
}

/**
 * Supabase Configuration
 * Environment-driven configuration for FOSS compliance
 *
 * Configuration strategy:
 * - CLOUD/PRODUCTION: MUST set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 * - LOCAL DEVELOPMENT: Auto-detected (uses local Supabase CLI instance)
 *
 * Can be overridden with VITE_USE_CLOUD_DB environment variable:
 * - VITE_USE_CLOUD_DB=true → Force cloud database (requires env vars)
 * - VITE_USE_CLOUD_DB=false → Force local database
 * - Not set → Auto-detect based on hostname
 *
 * NOTE: Anon key is safe to expose in frontend - it's meant to be public.
 * Service role key should NEVER be in frontend code - backend only!
 *
 * See .env.example for full configuration options.
 */
const useCloud = shouldUseCloudDatabase();

// Get configuration from environment variables
const cloudUrl = getEnv('VITE_SUPABASE_URL', '');
const cloudAnonKey = getEnv('VITE_SUPABASE_ANON_KEY', '');

// Local development defaults (used when running `supabase start`)
const LOCAL_SUPABASE_URL = 'http://127.0.0.1:3000';
const LOCAL_SUPABASE_ANON_KEY = getEnv('VITE_LOCAL_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0');

// Validate cloud configuration if cloud is being used
if (useCloud && (!cloudUrl || !cloudAnonKey)) {
  console.error('❌ ERROR: Cloud database requested but environment variables not set!');
  console.error('   Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  console.error('   See .env.example for configuration template.');
  console.error('   Falling back to local development mode...');
}

export const SUPABASE_CONFIG = {
  // Use cloud config if available and requested, otherwise use local
  url: (useCloud && cloudUrl) ? cloudUrl : LOCAL_SUPABASE_URL,
  anonKey: (useCloud && cloudAnonKey) ? cloudAnonKey : LOCAL_SUPABASE_ANON_KEY,

  // Export helper to check which database is being used
  isUsingCloud: useCloud && cloudUrl && cloudAnonKey
};

// Production safety check
if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PROD) {
  if (!cloudUrl || !cloudAnonKey) {
    console.error('❌ PRODUCTION ERROR: Supabase environment variables not configured!');
    console.error('   Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your deployment platform.');
    console.error('   Application may not function correctly.');
  }
}

// Development info logging
if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
  console.log(`🔧 Supabase Config: ${SUPABASE_CONFIG.isUsingCloud ? 'CLOUD' : 'LOCAL'}`);
  console.log(`   URL: ${SUPABASE_CONFIG.url}`);
  console.log(`   Anon Key: ${SUPABASE_CONFIG.anonKey.substring(0, 20)}...`);
}
