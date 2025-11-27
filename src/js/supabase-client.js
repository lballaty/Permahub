/**
 * Supabase Configuration & Utilities
 * Permaculture Network Platform
 */

// ============ SUPABASE CONFIGURATION ============
// Import configuration from config.js (handles environment variables)
import { SUPABASE_CONFIG } from './config.js';

// ============ SUPABASE CLIENT INITIALIZATION ============
class SupabaseClient {
  constructor(config) {
    this.url = config.url;
    this.anonKey = config.anonKey;
    this.authToken = null;
    this.user = null;

    // Log database connection in development mode
    this.logConnection();
  }

  /**
   * Log which database is being used (development mode only)
   */
  logConnection() {
    // Only log in development mode
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
      const isCloud = SUPABASE_CONFIG.isUsingCloud;
      const dbName = isCloud ? 'Cloud (mcbxbaggjaxqfdvmrqsc)' : 'Local (127.0.0.1:3000)';
      const icon = isCloud ? '🌐' : '💻';

      console.log(`${icon} Database: ${dbName}`);
      console.log(`   URL: ${this.url}`);
    }
  }

  /**
   * Check if the current auth token is expired
   * @returns {boolean} True if token is expired or missing expiry data
   */
  isTokenExpired() {
    const expiry = localStorage.getItem('token_expiry');
    if (!expiry) return true;
    return Date.now() >= parseInt(expiry);
  }

  /**
   * Refresh the authentication token using the refresh token
   * @returns {Promise<boolean>} True if refresh succeeded, false otherwise
   */
  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      console.log('⚠️ No refresh token available');
      return false;
    }

    try {
      console.log('🔄 Attempting to refresh expired token...');
      const response = await fetch(`${this.url}/auth/v1/token?grant_type=refresh_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_CONFIG.anonKey
        },
        body: JSON.stringify({ refresh_token: refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        this.authToken = data.access_token;
        localStorage.setItem('auth_token', data.access_token);

        // Calculate and store token expiry time
        const expiry = Date.now() + (data.expires_in * 1000);
        localStorage.setItem('token_expiry', expiry.toString());

        // Update refresh token if provided
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token);
        }

        console.log('✅ Token refreshed successfully');
        return true;
      } else {
        console.log('❌ Token refresh failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      return false;
    }
  }

  /**
   * Make authenticated API call to Supabase
   * Uses either the user's auth token (if logged in) or the anonymous key (if not logged in)
   * NEVER uses service role key - that should only be used server-side
   * Automatically handles token expiry with refresh and fallback to anonymous access
   */
  async request(method, path, body = null) {
    // Check if token is expired and attempt refresh
    let token = this.authToken;
    if (token && this.isTokenExpired()) {
      console.log('⚠️ Token expired, attempting refresh...');
      const refreshed = await this.refreshToken();
      if (!refreshed) {
        console.log('⚠️ Token refresh failed, falling back to anonymous access');
        token = null;
        this.authToken = null;
      } else {
        token = this.authToken;
      }
    }

    // Use valid token or fall back to anonymous key
    token = token || SUPABASE_CONFIG.anonKey;
    const fullUrl = `${this.url}/rest/v1${path}`;

    // Log request details
    console.log(`🌐 [Supabase ${method}] ${fullUrl}`);
    console.log(`  Headers:`, {
      'Content-Type': 'application/json',
      'apikey': `${SUPABASE_CONFIG.anonKey.substring(0, 20)}...`,
      'Authorization': `Bearer ${token.substring(0, 20)}...`
    });
    if (body) {
      console.log(`  Body:`, body);
    }

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': `Bearer ${token}`
      }
    };

    // Add Prefer header for POST/PATCH to return created/updated data
    if (method === 'POST' || method === 'PATCH') {
      options.headers['Prefer'] = 'return=representation';
    }

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const startTime = performance.now();
      const response = await fetch(fullUrl, options);
      const duration = (performance.now() - startTime).toFixed(2);

      console.log(`  ✅ Response: ${response.status} ${response.statusText} (${duration}ms)`);
      console.log(`  CORS Headers:`, {
        'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
        'Content-Type': response.headers.get('Content-Type')
      });

      if (!response.ok) {
        const error = await response.json();
        console.error(`  ❌ Error response:`, error);
        throw new Error(error.message || `API Error: ${response.status}`);
      }

      // 204 No Content responses don't have a body
      if (response.status === 204) {
        console.log(`  ✅ No content returned (successful update/delete)`);
        return null;
      }

      // Check if response has content
      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        console.log(`  ✅ No JSON content returned (successful operation)`);
        return null;
      }

      const data = await response.json();
      console.log(`  📦 Data received:`, Array.isArray(data) ? `${data.length} records` : 'single record');

      return data;
    } catch (error) {
      console.error('❌ Supabase API Error:', error);
      console.error('  URL:', fullUrl);
      console.error('  Method:', method);
      throw error;
    }
  }

  /**
   * Get all records from a table
   *
   * Automatically excludes soft-deleted records unless includeDeleted=true
   *
   * @param {string} table - Table name
   * @param {Object} options - Query options
   * @param {string} options.select - Columns to select
   * @param {string} options.where - Filter column
   * @param {string} options.operator - Filter operator (eq, neq, gt, lt, etc.)
   * @param {*} options.value - Filter value
   * @param {number} options.limit - Max results
   * @param {string} options.order - Sort order (column.asc or column.desc)
   * @param {boolean} options.includeDeleted - Include soft-deleted records (default false)
   * @returns {Promise<Array>} Query results
   */
  async getAll(table, options = {}) {
    let path = `/${table}`;

    if (options.select) {
      path += `?select=${encodeURIComponent(options.select)}`;
    }

    // Automatically exclude soft-deleted records unless explicitly requested
    const isSoftDeleteTable = ['wiki_guides', 'wiki_events', 'wiki_locations'].includes(table);
    if (isSoftDeleteTable && !options.includeDeleted) {
      const connector = path.includes('?') ? '&' : '?';
      path += `${connector}deleted_at=is.null`;
    }

    if (options.where) {
      const operator = options.operator || 'eq';
      const connector = path.includes('?') ? '&' : '?';
      path += `${connector}${options.where}=${operator}.${options.value}`;
    }

    if (options.limit) {
      const connector = path.includes('?') ? '&' : '?';
      path += `${connector}limit=${options.limit}`;
    }

    if (options.order) {
      const connector = path.includes('?') ? '&' : '?';
      path += `${connector}order=${options.order}`;
    }

    return this.request('GET', path);
  }

  /**
   * Get single record from table
   */
  async getOne(table, id) {
    return this.request('GET', `/${table}?id=eq.${id}`);
  }

  /**
   * Insert record into table
   */
  async insert(table, data) {
    return this.request('POST', `/${table}`, data);
  }

  /**
   * Update record in table
   */
  async update(table, id, data) {
    return this.request('PATCH', `/${table}?id=eq.${id}`, data);
  }

  /**
   * Delete record from table (HARD DELETE - USE WITH CAUTION)
   *
   * ⚠️ WARNING: This permanently deletes data. Consider using softDelete() instead.
   *
   * @param {string} table - Table name
   * @param {string} id - Record ID
   * @returns {Promise} Delete response
   */
  async delete(table, id) {
    return this.request('DELETE', `/${table}?id=eq.${id}`);
  }

  /**
   * Soft delete record (recommended for content)
   *
   * Sets deleted_at timestamp and deleted_by user ID, allowing recovery.
   * Also changes status to 'archived' for visibility control.
   *
   * @param {string} table - Table name (wiki_guides, wiki_events, wiki_locations)
   * @param {string} id - Record ID
   * @param {string} userId - ID of user performing the delete
   * @returns {Promise} Update response
   */
  async softDelete(table, id, userId) {
    console.log(`🗑️ Soft deleting ${table} record ${id} by user ${userId}`);

    return this.update(table, id, {
      deleted_at: new Date().toISOString(),
      deleted_by: userId,
      status: 'archived'
    });
  }

  /**
   * Restore soft-deleted record
   *
   * Clears deleted_at and deleted_by, restoring the record to draft status.
   * Only the user who deleted the content (or admins) can restore it.
   *
   * @param {string} table - Table name (wiki_guides, wiki_events, wiki_locations)
   * @param {string} id - Record ID
   * @param {string} userId - ID of user performing the restore
   * @returns {Promise} Update response
   */
  async restore(table, id, userId) {
    console.log(`♻️ Restoring ${table} record ${id} by user ${userId}`);

    // First check if user has permission to restore (is the one who deleted it)
    const record = await this.getOne(table, id);

    if (!record || record.length === 0) {
      throw new Error('Record not found');
    }

    const content = record[0];

    if (!content.deleted_at) {
      throw new Error('Record is not deleted');
    }

    if (content.deleted_by !== userId) {
      // TODO: Check if user is admin when roles are implemented
      throw new Error('Only the user who deleted this content can restore it');
    }

    return this.update(table, id, {
      deleted_at: null,
      deleted_by: null,
      status: 'draft'
    });
  }

  /**
   * Get deleted content for a user (for trash/recycle bin UI)
   *
   * @param {string} table - Table name
   * @param {string} userId - User ID
   * @param {number} limit - Maximum number of results (default 50)
   * @returns {Promise<Array>} Deleted content
   */
  async getDeletedContent(table, userId, limit = 50) {
    console.log(`🗑️ Fetching deleted content from ${table} for user ${userId}`);

    return this.getAll(table, {
      where: 'deleted_by',
      operator: 'eq',
      value: userId,
      order: 'deleted_at.desc',
      limit: limit
    });
  }

  /**
   * Sign up with email and password
   */
  async signUp(email, password) {
    try {
      const response = await fetch(`${this.url}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_CONFIG.anonKey
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error_description || data.message || 'Sign up failed');
      }

      if (data.session) {
        this.authToken = data.session.access_token;
        this.user = data.user;
        localStorage.setItem('auth_token', this.authToken);
        localStorage.setItem('user', JSON.stringify(this.user));

        // Store refresh token and expiry for automatic token refresh
        if (data.session.refresh_token) {
          localStorage.setItem('refresh_token', data.session.refresh_token);
        }
        if (data.session.expires_in) {
          const expiry = Date.now() + (data.session.expires_in * 1000);
          localStorage.setItem('token_expiry', expiry.toString());
        }
      }

      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email, password) {
    try {
      const response = await fetch(`${this.url}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_CONFIG.anonKey
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error_description || data.message || 'Sign in failed');
      }

      if (data.access_token) {
        this.authToken = data.access_token;
        this.user = data.user;
        localStorage.setItem('auth_token', this.authToken);
        localStorage.setItem('user', JSON.stringify(this.user));

        // Store refresh token and expiry for automatic token refresh
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token);
        }
        if (data.expires_in) {
          const expiry = Date.now() + (data.expires_in * 1000);
          localStorage.setItem('token_expiry', expiry.toString());
        }
      }

      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  /**
   * Send magic link to email
   */
  async signInWithMagicLink(email) {
    try {
      console.log('📧 Sending magic link request to:', `${this.url}/auth/v1/otp`);
      console.log('📧 Request body:', {
        email: email,
        options: {
          email_redirect_to: window.location.origin + '/src/wiki/wiki-home.html'
        }
      });

      const response = await fetch(`${this.url}/auth/v1/otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_CONFIG.anonKey
        },
        body: JSON.stringify({
          email: email,
          options: {
            email_redirect_to: window.location.origin + '/src/wiki/wiki-home.html'
          }
        })
      });

      const data = await response.json();

      console.log('📧 Magic link response status:', response.status);
      console.log('📧 Magic link response data:', data);

      if (!response.ok) {
        const errorMsg = data.error_description || data.error || data.message || data.msg || 'Magic link failed';
        console.error('❌ Magic link failed with error:', errorMsg);
        throw new Error(errorMsg);
      }

      return data;
    } catch (error) {
      console.error('Magic link error:', error);
      throw error;
    }
  }

  /**
   * Sign out current user
   */
  async signOut() {
    this.authToken = null;
    this.user = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expiry');
  }

  /**
   * Get current authenticated user
   * Validates token expiry and clears invalid tokens
   */
  async getCurrentUser() {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');

    if (token && user) {
      // Check if token is expired
      if (this.isTokenExpired()) {
        console.log('⚠️ Stored token is expired, attempting refresh...');
        this.authToken = token; // Set temporarily for refresh
        const refreshed = await this.refreshToken();

        if (!refreshed) {
          console.log('⚠️ Token refresh failed, clearing invalid session');
          // Clear invalid session data
          this.authToken = null;
          this.user = null;
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          localStorage.removeItem('token_expiry');
          localStorage.removeItem('refresh_token');
          return null;
        }
      } else {
        // Token is still valid
        this.authToken = token;
      }

      this.user = JSON.parse(user);
      return this.user;
    }

    return null;
  }

  /**
   * Sign up a new user with email and password
   *
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @param {Object} metadata - Additional user data (username, full_name)
   * @returns {Promise<Object>} Signup response data
   */
  async signUp(email, password, metadata = {}) {
    try {
      console.log('📝 Signing up new user:', email);
      console.log('📝 Metadata:', metadata);

      const response = await fetch(`${this.url}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_CONFIG.anonKey
        },
        body: JSON.stringify({
          email: email,
          password: password,
          data: {
            username: metadata.username,
            full_name: metadata.full_name
          }
        })
      });

      const data = await response.json();

      console.log('📝 Signup response status:', response.status);
      console.log('📝 Signup response data:', data);

      if (!response.ok) {
        const errorMsg = data.error_description || data.error || data.message || data.msg || 'Signup failed';
        console.error('❌ Signup failed with error:', errorMsg);
        throw new Error(errorMsg);
      }

      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  /**
   * Check if a username is available
   *
   * @param {string} username - Username to check
   * @returns {Promise<boolean>} True if available, false if taken
   */
  async checkUsernameAvailability(username) {
    try {
      console.log('🔍 Checking username availability:', username);

      const users = await this.getAll('users', {
        select: 'username',
        where: 'username',
        operator: 'eq',
        value: username
      });

      const isAvailable = users.length === 0;
      console.log(`🔍 Username "${username}" is ${isAvailable ? 'available' : 'taken'}`);

      return isAvailable;
    } catch (error) {
      console.error('Username check error:', error);
      // On error, assume not available to be safe
      return false;
    }
  }

  /**
   * Send password reset email
   *
   * @param {string} email - User's email address
   * @returns {Promise<Object>} Reset email response
   */
  async resetPasswordForEmail(email) {
    try {
      console.log('🔑 Sending password reset email to:', email);

      const response = await fetch(`${this.url}/auth/v1/recover`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_CONFIG.anonKey
        },
        body: JSON.stringify({
          email: email,
          options: {
            redirect_to: window.location.origin + '/src/wiki/wiki-reset-password.html'
          }
        })
      });

      const data = await response.json();

      console.log('🔑 Password reset response status:', response.status);
      console.log('🔑 Password reset response data:', data);

      if (!response.ok) {
        const errorMsg = data.error_description || data.error || data.message || data.msg || 'Password reset failed';
        console.error('❌ Password reset failed with error:', errorMsg);
        throw new Error(errorMsg);
      }

      return data;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  /**
   * Update user's password
   *
   * @param {string} newPassword - New password to set
   * @returns {Promise<Object>} Update response
   */
  async updatePassword(newPassword) {
    try {
      console.log('🔒 Updating password...');

      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No active session. Please log in first.');
      }

      const response = await fetch(`${this.url}/auth/v1/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_CONFIG.anonKey,
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          password: newPassword
        })
      });

      const data = await response.json();

      console.log('🔒 Password update response status:', response.status);
      console.log('🔒 Password update response data:', data);

      if (!response.ok) {
        const errorMsg = data.error_description || data.error || data.message || data.msg || 'Password update failed';
        console.error('❌ Password update failed with error:', errorMsg);
        throw new Error(errorMsg);
      }

      return data;
    } catch (error) {
      console.error('Password update error:', error);
      throw error;
    }
  }

  /**
   * Create user profile after signup
   */
  async createUserProfile(userId, profileData) {
    return this.insert('users', {
      id: userId,
      email: profileData.email,
      full_name: profileData.fullName,
      location: profileData.location,
      bio: profileData.bio,
      skills: profileData.skills || [],
      interests: profileData.interests || [],
      looking_for: profileData.lookingFor || [],
      is_public_profile: profileData.isPublicProfile !== false,
      profile_completed: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  /**
   * Get nearby projects by location
   */
  async getProjectsByLocation(latitude, longitude, distanceKm = 50) {
    // This would use the PostGIS function if available
    // For now, fetch all and filter in JavaScript
    try {
      const projects = await this.getAll('projects', {
        select: '*',
        where: 'status',
        operator: 'eq',
        value: 'active'
      });

      return projects.filter(project => {
        if (!project.latitude || !project.longitude) return false;
        
        const distance = this.calculateDistance(
          latitude, 
          longitude, 
          project.latitude, 
          project.longitude
        );
        
        return distance <= distanceKm;
      });
    } catch (error) {
      console.error('Error fetching projects by location:', error);
      return [];
    }
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Search projects by keyword
   */
  async searchProjects(query) {
    try {
      const projects = await this.getAll('projects', {
        select: '*',
        where: 'status',
        operator: 'eq',
        value: 'active'
      });

      const lowerQuery = query.toLowerCase();
      return projects.filter(project => 
        project.name.toLowerCase().includes(lowerQuery) ||
        project.description.toLowerCase().includes(lowerQuery) ||
        (project.techniques && project.techniques.some(t => t.toLowerCase().includes(lowerQuery)))
      );
    } catch (error) {
      console.error('Error searching projects:', error);
      return [];
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId) {
    try {
      const result = await this.getAll('users', {
        select: '*',
        where: 'id',
        operator: 'eq',
        value: userId
      });
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId, profileData) {
    return this.update('users', userId, {
      ...profileData,
      updated_at: new Date().toISOString()
    });
  }

  /**
   * Get resources
   */
  async getResources(options = {}) {
    return this.getAll('resources', {
      select: '*',
      where: 'availability',
      operator: 'eq',
      value: options.availability || 'available',
      limit: options.limit || 50,
      order: options.order || 'created_at.desc'
    });
  }

  /**
   * Search resources
   */
  async searchResources(query) {
    try {
      const resources = await this.getAll('resources', {
        select: '*',
        where: 'availability',
        operator: 'neq',
        value: 'archived'
      });

      const lowerQuery = query.toLowerCase();
      return resources.filter(resource =>
        resource.title.toLowerCase().includes(lowerQuery) ||
        resource.description.toLowerCase().includes(lowerQuery) ||
        (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
      );
    } catch (error) {
      console.error('Error searching resources:', error);
      return [];
    }
  }

  /**
   * Call a Supabase RPC function
   * @param {string} functionName - Name of the PostgreSQL function
   * @param {object} params - Parameters to pass to the function
   * @returns {Promise<{data: any, error: any}>} Result with data or error
   */
  async rpc(functionName, params = {}) {
    try {
      const response = await fetch(`${this.url}/rest/v1/rpc/${functionName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.anonKey,
          'Authorization': `Bearer ${this.authToken || this.anonKey}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(params)
      });

      const data = await response.json();

      if (!response.ok) {
        return { data: null, error: data };
      }

      return { data, error: null };
    } catch (error) {
      console.error(`Error calling RPC function ${functionName}:`, error);
      return { data: null, error };
    }
  }
}

// ============ INITIALIZE GLOBAL CLIENT ============
const appVersion = (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_APP_VERSION) || 'unknown';
console.log(
  `🔧 Initializing Supabase Client: ${SUPABASE_CONFIG.isUsingCloud ? 'cloud' : 'local'} db | version ${appVersion}`
);
const supabase = new SupabaseClient(SUPABASE_CONFIG);

// Auto-restore session on page load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', async () => {
    await supabase.getCurrentUser();
  });
}

// Export for use in other modules
export { supabase, SupabaseClient };
