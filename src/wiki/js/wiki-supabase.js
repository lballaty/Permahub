/**
 * Wiki Supabase Integration
 * Extends the main Supabase client with wiki-specific methods
 */

import { supabase } from '../../js/supabase-client.js';

class WikiAPI {
  constructor(client) {
    this.client = client;
  }

  // ============ CATEGORIES ============

  async getCategories() {
    try {
      return await this.client.getAll('wiki_categories', {
        order: 'name.asc'
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // ============ GUIDES ============

  async getGuides(options = {}) {
    try {
      const language = options.language || 'en';
      const queryOptions = {
        select: '*',
        where: 'status',
        operator: 'eq',
        value: 'published',
        limit: options.limit || 50,
        order: options.order || 'created_at.desc'
      };

      const guides = await this.client.getAll('wiki_guides', queryOptions);

      // Fetch translations for each guide if language is not default
      if (language !== 'en' && guides.length > 0) {
        return await this._attachGuideTranslations(guides, language);
      }

      return guides;
    } catch (error) {
      console.error('Error fetching guides:', error);
      return [];
    }
  }

  async getGuide(slugOrId, language = 'en') {
    try {
      const field = slugOrId.includes('-') ? 'slug' : 'id';
      const result = await this.client.getAll('wiki_guides', {
        where: field,
        operator: 'eq',
        value: slugOrId
      });

      if (result && result.length > 0) {
        // Increment view count
        await this.incrementGuideViews(result[0].id);

        // Fetch translation if language is not English
        if (language !== 'en') {
          const translated = await this._attachGuideTranslations([result[0]], language);
          return translated[0];
        }

        return result[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching guide:', error);
      return null;
    }
  }

  async _attachGuideTranslations(guides, language) {
    try {
      const guideIds = guides.map(g => g.id);
      const { data: translations } = await this.client.supabase
        .from('wiki_guide_translations')
        .select('*')
        .in('guide_id', guideIds)
        .eq('language_code', language);

      return guides.map(guide => {
        const translation = translations?.find(t => t.guide_id === guide.id);
        if (translation) {
          return {
            ...guide,
            title: translation.title,
            summary: translation.summary,
            content: translation.content,
            language_code: translation.language_code
          };
        }
        return { ...guide, language_code: 'en' };
      });
    } catch (error) {
      console.error('Error fetching guide translations:', error);
      return guides.map(g => ({ ...g, language_code: 'en' }));
    }
  }

  async getGuideCategories(guideId) {
    try {
      const result = await this.client.request('GET',
        `/wiki_guide_categories?guide_id=eq.${guideId}&select=category:wiki_categories(*)`
      );
      return result.map(r => r.category);
    } catch (error) {
      console.error('Error fetching guide categories:', error);
      return [];
    }
  }

  async searchGuides(query) {
    try {
      // Use the search_guides PostgreSQL function
      const result = await this.client.request('POST', '/rpc/search_guides', {
        search_query: query
      });
      return result;
    } catch (error) {
      console.error('Error searching guides:', error);
      // Fallback to client-side search
      const guides = await this.getGuides();
      const lowerQuery = query.toLowerCase();
      return guides.filter(g =>
        g.title.toLowerCase().includes(lowerQuery) ||
        g.summary.toLowerCase().includes(lowerQuery)
      );
    }
  }

  async createGuide(guideData) {
    try {
      const guide = await this.client.insert('wiki_guides', {
        ...guideData,
        author_id: this.client.user?.id,
        status: guideData.status || 'draft',
        published_at: guideData.status === 'published' ? new Date().toISOString() : null
      });

      // Add categories if provided
      if (guideData.categoryIds && guideData.categoryIds.length > 0) {
        for (const categoryId of guideData.categoryIds) {
          await this.client.insert('wiki_guide_categories', {
            guide_id: guide[0].id,
            category_id: categoryId
          });
        }
      }

      return guide[0];
    } catch (error) {
      console.error('Error creating guide:', error);
      throw error;
    }
  }

  async updateGuide(guideId, guideData) {
    try {
      return await this.client.update('wiki_guides', guideId, guideData);
    } catch (error) {
      console.error('Error updating guide:', error);
      throw error;
    }
  }

  async incrementGuideViews(guideId) {
    try {
      await this.client.request('POST', '/rpc/increment_guide_views', {
        guide_id: guideId
      });
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  }

  // ============ EVENTS ============

  async getEvents(options = {}) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const queryOptions = {
        select: '*',
        where: 'event_date',
        operator: options.includePast ? 'gte' : 'gte',
        value: options.includePast ? '1900-01-01' : today,
        limit: options.limit || 50,
        order: 'event_date.asc'
      };

      return await this.client.getAll('wiki_events', queryOptions);
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  async getEvent(slugOrId) {
    try {
      const field = slugOrId.includes('-') ? 'slug' : 'id';
      const result = await this.client.getAll('wiki_events', {
        where: field,
        operator: 'eq',
        value: slugOrId
      });

      return result && result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    }
  }

  async createEvent(eventData) {
    try {
      return await this.client.insert('wiki_events', {
        ...eventData,
        author_id: this.client.user?.id,
        status: eventData.status || 'published'
      });
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  async updateEvent(eventId, eventData) {
    try {
      return await this.client.update('wiki_events', eventId, eventData);
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  // ============ LOCATIONS ============

  async getLocations(options = {}) {
    try {
      return await this.client.getAll('wiki_locations', {
        select: '*',
        where: 'status',
        operator: 'eq',
        value: 'published',
        limit: options.limit || 100
      });
    } catch (error) {
      console.error('Error fetching locations:', error);
      return [];
    }
  }

  async getLocation(slugOrId) {
    try {
      const field = slugOrId.includes('-') ? 'slug' : 'id';
      const result = await this.client.getAll('wiki_locations', {
        where: field,
        operator: 'eq',
        value: slugOrId
      });

      return result && result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error fetching location:', error);
      return null;
    }
  }

  async getNearbyLocations(latitude, longitude, distanceKm = 50) {
    try {
      const result = await this.client.request('POST', '/rpc/get_nearby_locations', {
        user_lat: latitude,
        user_lng: longitude,
        distance_km: distanceKm
      });
      return result;
    } catch (error) {
      console.error('Error fetching nearby locations:', error);
      // Fallback to all locations
      return await this.getLocations();
    }
  }

  async createLocation(locationData) {
    try {
      return await this.client.insert('wiki_locations', {
        ...locationData,
        author_id: this.client.user?.id,
        status: locationData.status || 'published'
      });
    } catch (error) {
      console.error('Error creating location:', error);
      throw error;
    }
  }

  async updateLocation(locationId, locationData) {
    try {
      return await this.client.update('wiki_locations', locationId, locationData);
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  }

  // ============ FAVORITES ============

  async getFavorites(userId) {
    try {
      if (!userId) userId = this.client.user?.id;
      if (!userId) return [];

      return await this.client.getAll('wiki_favorites', {
        where: 'user_id',
        operator: 'eq',
        value: userId,
        order: 'created_at.desc'
      });
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  }

  async isFavorite(contentType, contentId, userId) {
    try {
      if (!userId) userId = this.client.user?.id;
      if (!userId) return false;

      const result = await this.client.request('GET',
        `/wiki_favorites?user_id=eq.${userId}&content_type=eq.${contentType}&content_id=eq.${contentId}`
      );
      return result && result.length > 0;
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  }

  async addFavorite(contentType, contentId, userId) {
    try {
      if (!userId) userId = this.client.user?.id;
      if (!userId) throw new Error('Must be logged in');

      return await this.client.insert('wiki_favorites', {
        user_id: userId,
        content_type: contentType,
        content_id: contentId
      });
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  }

  async removeFavorite(contentType, contentId, userId) {
    try {
      if (!userId) userId = this.client.user?.id;
      if (!userId) throw new Error('Must be logged in');

      await this.client.request('DELETE',
        `/wiki_favorites?user_id=eq.${userId}&content_type=eq.${contentType}&content_id=eq.${contentId}`
      );
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  }

  async toggleFavorite(contentType, contentId, userId) {
    const isFav = await this.isFavorite(contentType, contentId, userId);
    if (isFav) {
      await this.removeFavorite(contentType, contentId, userId);
      return false;
    } else {
      await this.addFavorite(contentType, contentId, userId);
      return true;
    }
  }

  // ============ COLLECTIONS ============

  async getCollections(userId) {
    try {
      if (!userId) userId = this.client.user?.id;
      if (!userId) return [];

      return await this.client.getAll('wiki_collections', {
        where: 'user_id',
        operator: 'eq',
        value: userId,
        order: 'created_at.desc'
      });
    } catch (error) {
      console.error('Error fetching collections:', error);
      return [];
    }
  }

  async createCollection(collectionData, userId) {
    try {
      if (!userId) userId = this.client.user?.id;
      if (!userId) throw new Error('Must be logged in');

      return await this.client.insert('wiki_collections', {
        ...collectionData,
        user_id: userId
      });
    } catch (error) {
      console.error('Error creating collection:', error);
      throw error;
    }
  }

  async getCollectionItems(collectionId) {
    try {
      return await this.client.getAll('wiki_collection_items', {
        where: 'collection_id',
        operator: 'eq',
        value: collectionId,
        order: 'added_at.desc'
      });
    } catch (error) {
      console.error('Error fetching collection items:', error);
      return [];
    }
  }

  async addToCollection(collectionId, contentType, contentId) {
    try {
      return await this.client.insert('wiki_collection_items', {
        collection_id: collectionId,
        content_type: contentType,
        content_id: contentId
      });
    } catch (error) {
      console.error('Error adding to collection:', error);
      throw error;
    }
  }

  async removeFromCollection(collectionId, contentType, contentId) {
    try {
      await this.client.request('DELETE',
        `/wiki_collection_items?collection_id=eq.${collectionId}&content_type=eq.${contentType}&content_id=eq.${contentId}`
      );
    } catch (error) {
      console.error('Error removing from collection:', error);
      throw error;
    }
  }

  // ============ STATS ============

  async getStats() {
    try {
      const [guides, events, locations] = await Promise.all([
        this.client.request('GET', '/wiki_guides?select=count'),
        this.client.request('GET', '/wiki_events?select=count'),
        this.client.request('GET', '/wiki_locations?select=count')
      ]);

      return {
        guides: guides[0]?.count || 0,
        events: events[0]?.count || 0,
        locations: locations[0]?.count || 0
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return { guides: 0, events: 0, locations: 0 };
    }
  }
}

// Create and export wiki API instance
const wikiAPI = new WikiAPI(supabase);

export { wikiAPI, WikiAPI };
