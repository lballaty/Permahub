/**
 * Supabase Configuration & Utilities
 * Permaculture Network Platform
 */

// ============ SUPABASE CONFIGURATION ============
const SUPABASE_CONFIG = {
  url: 'https://mcbxbaggjaxqfdvmrqsc.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYnhiYWdnamF4cWZkdm1ycXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MDE4NDYsImV4cCI6MjA3ODA3Nzg0Nn0.agjLGl7uW0S1tGgivGBVthHWAgw0YxHjJNLHkhsViO0',
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYnhiYWdnamF4cWZkdm1ycXNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUwMTg0NiwiZXhwIjoyMDc4MDc3ODQ2fQ.dTRFNjBrZHsLERsjzqSckpJ1oaQcCjIw98_UvgKyQJU'
};

// ============ SUPABASE CLIENT INITIALIZATION ============
class SupabaseClient {
  constructor(config) {
    this.url = config.url;
    this.anonKey = config.anonKey;
    this.authToken = null;
    this.user = null;
  }

  /**
   * Make authenticated API call to Supabase
   */
  async request(method, path, body = null, useServiceRole = false) {
    const token = useServiceRole ? SUPABASE_CONFIG.serviceRoleKey : (this.authToken || SUPABASE_CONFIG.anonKey);
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': `Bearer ${token}`
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${this.url}/rest/v1${path}`, options);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Supabase API Error:', error);
      throw error;
    }
  }

  /**
   * Get all records from a table
   */
  async getAll(table, options = {}) {
    let path = `/${table}`;
    
    if (options.select) {
      path += `?select=${encodeURIComponent(options.select)}`;
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
   * Delete record from table
   */
  async delete(table, id) {
    return this.request('DELETE', `/${table}?id=eq.${id}`);
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
      const response = await fetch(`${this.url}/auth/v1/magiclink`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_CONFIG.anonKey
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error_description || data.message || 'Magic link failed');
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
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');

    if (token && user) {
      this.authToken = token;
      this.user = JSON.parse(user);
      return this.user;
    }

    return null;
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
}

// ============ INITIALIZE GLOBAL CLIENT ============
const supabase = new SupabaseClient(SUPABASE_CONFIG);

// Auto-restore session on page load
window.addEventListener('DOMContentLoaded', async () => {
  await supabase.getCurrentUser();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { supabase, SupabaseClient, SUPABASE_CONFIG };
}
