/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/src/js/preference-learning.js
 * Description: Machine learning-inspired preference learning algorithm for user personalization
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-14
 */

import { createClient } from '@supabase/supabase-js';

/**
 * PreferenceLearning class implements a collaborative filtering and
 * content-based recommendation system for Permahub users
 */
export class PreferenceLearning {
  constructor(supabase, userId) {
    this.supabase = supabase;
    this.userId = userId;

    // Learning parameters
    this.config = {
      // Decay factors for time-based relevance
      recencyDecayFactor: 0.95, // Daily decay rate
      maxRecencyDays: 30, // Consider activities within last 30 days

      // Activity weights for implicit feedback
      activityWeights: {
        create: 1.0,      // Highest signal - user created content
        favorite: 0.8,    // Explicit positive signal
        share: 0.7,       // Sharing indicates high interest
        comment: 0.6,     // Engagement signal
        download: 0.5,    // Resource consumption
        click: 0.3,       // Interest signal
        view: 0.2,        // Awareness signal
        search: 0.1       // Exploration signal
      },

      // Category similarity thresholds
      similarityThreshold: 0.3,

      // Minimum interactions for confidence
      minInteractions: 3,

      // Collaborative filtering parameters
      nearestNeighbors: 10,
      minCommonItems: 2
    };

    // Cache for performance
    this.cache = {
      userProfile: null,
      affinityScores: null,
      similarUsers: null,
      categoryEmbeddings: null,
      lastUpdated: null
    };
  }

  /**
   * Initialize the learning system with user data
   */
  async initialize() {
    await this.loadUserProfile();
    await this.loadAffinityScores();
    await this.buildCategoryEmbeddings();
    this.cache.lastUpdated = new Date();
  }

  /**
   * Load user profile and location data
   */
  async loadUserProfile() {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', this.userId)
      .single();

    if (error) throw error;
    this.cache.userProfile = data;
  }

  /**
   * Load user's affinity scores for categories
   */
  async loadAffinityScores() {
    const { data, error } = await this.supabase
      .from('user_affinity_scores')
      .select('*, resource_categories(*), wiki_categories(*)')
      .eq('user_id', this.userId)
      .order('overall_score', { ascending: false });

    if (error) throw error;
    this.cache.affinityScores = data || [];
  }

  /**
   * Build category embeddings based on co-occurrence patterns
   * This creates a simple vector space for category similarity
   */
  async buildCategoryEmbeddings() {
    // Get category co-occurrence from all users' activities
    const { data: coOccurrences, error } = await this.supabase
      .rpc('get_category_cooccurrences', { limit_users: 1000 });

    if (error) {
      console.error('Error building embeddings:', error);
      this.cache.categoryEmbeddings = new Map();
      return;
    }

    // Build similarity matrix
    const embeddings = new Map();

    for (const occurrence of coOccurrences || []) {
      if (!embeddings.has(occurrence.category1)) {
        embeddings.set(occurrence.category1, new Map());
      }
      embeddings.get(occurrence.category1).set(
        occurrence.category2,
        occurrence.correlation_score
      );
    }

    this.cache.categoryEmbeddings = embeddings;
  }

  /**
   * Learn from a new user interaction
   * Updates affinity scores in real-time
   */
  async learnFromInteraction(activity) {
    const { activity_type, content_type, category_id, duration_seconds } = activity;

    // Calculate interaction value
    const weight = this.config.activityWeights[activity_type] || 0.1;
    const durationBoost = duration_seconds ? Math.log(1 + duration_seconds / 60) * 0.1 : 0;
    const interactionValue = weight + durationBoost;

    // Update or create affinity score
    await this.updateAffinityScore(category_id, interactionValue, activity_type);

    // Propagate learning to similar categories
    await this.propagateLearning(category_id, interactionValue * 0.3);

    // Update cache
    await this.loadAffinityScores();
  }

  /**
   * Update affinity score for a specific category
   */
  async updateAffinityScore(categoryId, value, activityType) {
    if (!categoryId) return;

    const existingScore = this.cache.affinityScores.find(s => s.category_id === categoryId);

    if (existingScore) {
      // Update existing score with exponential moving average
      const alpha = 0.3; // Learning rate
      const newEngagementScore = Math.min(1.0,
        existingScore.engagement_score * (1 - alpha) + value * alpha
      );

      // Update frequency score
      const frequencyBoost = 0.05;
      const newFrequencyScore = Math.min(1.0,
        existingScore.frequency_score + frequencyBoost
      );

      await this.supabase
        .from('user_affinity_scores')
        .update({
          engagement_score: newEngagementScore,
          frequency_score: newFrequencyScore,
          recency_score: 1.0, // Reset recency
          last_interaction: new Date().toISOString(),
          [`${activityType}_count`]: existingScore[`${activityType}_count`] + 1
        })
        .eq('id', existingScore.id);
    } else {
      // Create new affinity score
      await this.supabase
        .from('user_affinity_scores')
        .insert({
          user_id: this.userId,
          category_id: categoryId,
          engagement_score: value,
          frequency_score: 0.1,
          recency_score: 1.0,
          [`${activityType}_count`]: 1,
          last_interaction: new Date().toISOString()
        });
    }
  }

  /**
   * Propagate learning to similar categories
   * This implements a simple spreading activation
   */
  async propagateLearning(sourceCategoryId, value) {
    if (!this.cache.categoryEmbeddings || value < 0.01) return;

    const similarities = this.cache.categoryEmbeddings.get(sourceCategoryId);
    if (!similarities) return;

    for (const [targetCategoryId, similarity] of similarities) {
      if (similarity > this.config.similarityThreshold) {
        const propagatedValue = value * similarity;
        await this.updateAffinityScore(targetCategoryId, propagatedValue, 'view');
      }
    }
  }

  /**
   * Get personalized recommendations using hybrid approach
   */
  async getRecommendations(count = 10) {
    const recommendations = [];

    // 1. Content-based recommendations (60% weight)
    const contentBased = await this.getContentBasedRecommendations(Math.ceil(count * 0.6));
    recommendations.push(...contentBased.map(r => ({ ...r, strategy: 'content' })));

    // 2. Collaborative filtering (30% weight)
    const collaborative = await this.getCollaborativeRecommendations(Math.ceil(count * 0.3));
    recommendations.push(...collaborative.map(r => ({ ...r, strategy: 'collaborative' })));

    // 3. Trending/Popular items (10% weight)
    const trending = await this.getTrendingRecommendations(Math.ceil(count * 0.1));
    recommendations.push(...trending.map(r => ({ ...r, strategy: 'trending' })));

    // Deduplicate and score
    const scored = this.scoreAndRankRecommendations(recommendations);

    return scored.slice(0, count);
  }

  /**
   * Content-based recommendations based on user's category preferences
   */
  async getContentBasedRecommendations(count) {
    if (this.cache.affinityScores.length === 0) {
      return [];
    }

    const topCategories = this.cache.affinityScores
      .slice(0, 5)
      .map(s => s.category_id)
      .filter(Boolean);

    if (topCategories.length === 0) return [];

    // Get items from top categories
    const { data: resources } = await this.supabase
      .from('resources')
      .select('*, resource_categories(*)')
      .in('category_id', topCategories)
      .eq('is_available', true)
      .order('created_at', { ascending: false })
      .limit(count * 2);

    const { data: projects } = await this.supabase
      .from('projects')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(count);

    // Combine and score based on category affinity
    const items = [
      ...(resources || []).map(r => ({
        type: 'resource',
        id: r.id,
        title: r.title,
        category_id: r.category_id,
        created_at: r.created_at,
        score: this.calculateContentScore(r)
      })),
      ...(projects || []).map(p => ({
        type: 'project',
        id: p.id,
        title: p.name,
        created_at: p.created_at,
        score: this.calculateContentScore(p)
      }))
    ];

    return items.sort((a, b) => b.score - a.score).slice(0, count);
  }

  /**
   * Collaborative filtering recommendations based on similar users
   */
  async getCollaborativeRecommendations(count) {
    // Find similar users based on category preferences
    const similarUsers = await this.findSimilarUsers();

    if (similarUsers.length === 0) return [];

    const userIds = similarUsers.map(u => u.user_id);

    // Get items liked by similar users but not by current user
    const { data: recommendations } = await this.supabase
      .rpc('get_collaborative_recommendations', {
        p_user_id: this.userId,
        p_similar_users: userIds,
        p_limit: count
      });

    return (recommendations || []).map(r => ({
      type: r.content_type,
      id: r.content_id,
      title: r.title,
      score: r.similarity_score
    }));
  }

  /**
   * Find users with similar preferences
   */
  async findSimilarUsers() {
    if (this.cache.similarUsers && this.isCacheValid()) {
      return this.cache.similarUsers;
    }

    const { data: similar } = await this.supabase
      .rpc('find_similar_users', {
        p_user_id: this.userId,
        p_limit: this.config.nearestNeighbors
      });

    this.cache.similarUsers = similar || [];
    return this.cache.similarUsers;
  }

  /**
   * Get trending recommendations based on recent platform activity
   */
  async getTrendingRecommendations(count) {
    const { data: trending } = await this.supabase
      .rpc('get_trending_content', {
        p_days: 7,
        p_limit: count
      });

    return (trending || []).map(t => ({
      type: t.content_type,
      id: t.content_id,
      title: t.title,
      score: t.trend_score
    }));
  }

  /**
   * Calculate content score based on user preferences
   */
  calculateContentScore(item) {
    let score = 0;

    // Category affinity score
    const categoryScore = this.cache.affinityScores.find(
      s => s.category_id === item.category_id
    );
    if (categoryScore) {
      score += categoryScore.overall_score * 0.5;
    }

    // Recency boost
    const daysSinceCreated = (Date.now() - new Date(item.created_at)) / (1000 * 60 * 60 * 24);
    const recencyScore = Math.exp(-daysSinceCreated / 30); // Exponential decay over 30 days
    score += recencyScore * 0.2;

    // Location proximity (if applicable)
    if (item.latitude && item.longitude && this.cache.userProfile?.latitude) {
      const distance = this.calculateDistance(
        this.cache.userProfile.latitude,
        this.cache.userProfile.longitude,
        item.latitude,
        item.longitude
      );
      const proximityScore = Math.max(0, 1 - distance / 100); // Score decreases over 100km
      score += proximityScore * 0.3;
    }

    return score;
  }

  /**
   * Score and rank final recommendations
   */
  scoreAndRankRecommendations(recommendations) {
    // Deduplicate by content id
    const unique = new Map();

    for (const rec of recommendations) {
      const key = `${rec.type}-${rec.id}`;
      if (!unique.has(key) || unique.get(key).score < rec.score) {
        unique.set(key, rec);
      }
    }

    // Apply strategy weights and diversity bonus
    const scored = Array.from(unique.values()).map(rec => {
      let finalScore = rec.score;

      // Strategy weight
      const strategyWeights = {
        content: 1.0,
        collaborative: 0.9,
        trending: 0.8
      };
      finalScore *= strategyWeights[rec.strategy] || 0.5;

      // Diversity bonus (prefer different types)
      const typeCount = {};
      for (const r of unique.values()) {
        typeCount[r.type] = (typeCount[r.type] || 0) + 1;
      }
      if (typeCount[rec.type] > 3) {
        finalScore *= 0.9; // Penalty for too many of same type
      }

      return { ...rec, finalScore };
    });

    return scored.sort((a, b) => b.finalScore - a.finalScore);
  }

  /**
   * Predict user interest in a specific item
   */
  async predictInterest(contentType, contentId) {
    // Get item details
    const table = contentType === 'project' ? 'projects' :
                  contentType === 'resource' ? 'resources' :
                  contentType === 'wiki_guide' ? 'wiki_guides' : null;

    if (!table) return 0;

    const { data: item } = await this.supabase
      .from(table)
      .select('*')
      .eq('id', contentId)
      .single();

    if (!item) return 0;

    // Calculate interest score
    return this.calculateContentScore(item);
  }

  /**
   * Update recency scores (should be called periodically)
   */
  async updateRecencyScores() {
    const now = Date.now();

    for (const score of this.cache.affinityScores) {
      const daysSinceInteraction = (now - new Date(score.last_interaction)) / (1000 * 60 * 60 * 24);

      if (daysSinceInteraction > 0) {
        const newRecencyScore = Math.max(0,
          score.recency_score * Math.pow(this.config.recencyDecayFactor, daysSinceInteraction)
        );

        await this.supabase
          .from('user_affinity_scores')
          .update({
            recency_score: newRecencyScore,
            updated_at: new Date().toISOString()
          })
          .eq('id', score.id);
      }
    }

    // Reload scores
    await this.loadAffinityScores();
  }

  /**
   * Get explanation for why an item was recommended
   */
  getRecommendationReason(item, strategy) {
    const reasons = {
      content: `Based on your interest in ${item.category_name || 'similar content'}`,
      collaborative: `Popular with users like you`,
      trending: `Trending in the community`,
      location: `Near your location`,
      recent: `Recently added`
    };

    return reasons[strategy] || 'Recommended for you';
  }

  /**
   * Calculate distance between two points (Haversine formula)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Check if cache is still valid
   */
  isCacheValid() {
    if (!this.cache.lastUpdated) return false;
    const cacheAge = Date.now() - this.cache.lastUpdated;
    return cacheAge < 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Export user preferences for analysis or backup
   */
  async exportPreferences() {
    await this.initialize();

    return {
      userId: this.userId,
      profile: this.cache.userProfile,
      affinityScores: this.cache.affinityScores,
      topCategories: this.cache.affinityScores
        .slice(0, 10)
        .map(s => ({
          category: s.resource_categories?.name || s.wiki_categories?.name,
          score: s.overall_score,
          interactions: s.view_count + s.click_count + s.create_count + s.favorite_count
        })),
      exported_at: new Date().toISOString()
    };
  }
}

// SQL functions needed in Supabase (add to migration)
const SQL_FUNCTIONS = `
-- Find users with similar category preferences
CREATE OR REPLACE FUNCTION find_similar_users(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 10
) RETURNS TABLE (
  user_id UUID,
  similarity_score DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH user_categories AS (
    SELECT category_id, overall_score
    FROM user_affinity_scores
    WHERE user_id = p_user_id
  ),
  other_users AS (
    SELECT
      uas.user_id,
      COUNT(*) as common_categories,
      AVG(ABS(uas.overall_score - uc.overall_score)) as score_diff
    FROM user_affinity_scores uas
    JOIN user_categories uc ON uas.category_id = uc.category_id
    WHERE uas.user_id != p_user_id
    GROUP BY uas.user_id
    HAVING COUNT(*) >= 2 -- Minimum common categories
  )
  SELECT
    user_id,
    (common_categories::DECIMAL / 10) * (1 - score_diff) as similarity_score
  FROM other_users
  ORDER BY similarity_score DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Get category co-occurrence patterns
CREATE OR REPLACE FUNCTION get_category_cooccurrences(
  limit_users INTEGER DEFAULT 1000
) RETURNS TABLE (
  category1 UUID,
  category2 UUID,
  correlation_score DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH user_pairs AS (
    SELECT
      a1.category_id as cat1,
      a2.category_id as cat2,
      COUNT(DISTINCT a1.user_id) as user_count
    FROM user_affinity_scores a1
    JOIN user_affinity_scores a2 ON a1.user_id = a2.user_id
    WHERE a1.category_id < a2.category_id
    GROUP BY a1.category_id, a2.category_id
    HAVING COUNT(DISTINCT a1.user_id) > 5
  )
  SELECT
    cat1 as category1,
    cat2 as category2,
    LEAST(1.0, user_count::DECIMAL / 100) as correlation_score
  FROM user_pairs
  ORDER BY correlation_score DESC;
END;
$$ LANGUAGE plpgsql;

-- Get collaborative recommendations
CREATE OR REPLACE FUNCTION get_collaborative_recommendations(
  p_user_id UUID,
  p_similar_users UUID[],
  p_limit INTEGER DEFAULT 10
) RETURNS TABLE (
  content_type TEXT,
  content_id UUID,
  title TEXT,
  similarity_score DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH user_items AS (
    -- Get items current user has interacted with
    SELECT DISTINCT content_id, content_type
    FROM user_activity
    WHERE user_id = p_user_id
      AND activity_type IN ('view', 'click', 'favorite', 'create')
  ),
  similar_user_items AS (
    -- Get items similar users liked
    SELECT
      ua.content_type,
      ua.content_id,
      COUNT(*) as like_count
    FROM user_activity ua
    WHERE ua.user_id = ANY(p_similar_users)
      AND ua.activity_type IN ('favorite', 'create', 'share')
      AND NOT EXISTS (
        SELECT 1 FROM user_items ui
        WHERE ui.content_id = ua.content_id
          AND ui.content_type = ua.content_type
      )
    GROUP BY ua.content_type, ua.content_id
  )
  SELECT
    sui.content_type,
    sui.content_id,
    CASE
      WHEN sui.content_type = 'project' THEN p.name
      WHEN sui.content_type = 'resource' THEN r.title
      WHEN sui.content_type = 'wiki_guide' THEN wg.title
    END as title,
    LEAST(1.0, sui.like_count::DECIMAL / 5) as similarity_score
  FROM similar_user_items sui
  LEFT JOIN projects p ON sui.content_type = 'project' AND sui.content_id = p.id
  LEFT JOIN resources r ON sui.content_type = 'resource' AND sui.content_id = r.id
  LEFT JOIN wiki_guides wg ON sui.content_type = 'wiki_guide' AND sui.content_id = wg.id
  WHERE (p.id IS NOT NULL OR r.id IS NOT NULL OR wg.id IS NOT NULL)
  ORDER BY similarity_score DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Get trending content
CREATE OR REPLACE FUNCTION get_trending_content(
  p_days INTEGER DEFAULT 7,
  p_limit INTEGER DEFAULT 10
) RETURNS TABLE (
  content_type TEXT,
  content_id UUID,
  title TEXT,
  trend_score DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH recent_activity AS (
    SELECT
      content_type,
      content_id,
      COUNT(*) as interaction_count,
      COUNT(DISTINCT user_id) as unique_users,
      AVG(CASE
        WHEN activity_type = 'create' THEN 1.0
        WHEN activity_type = 'favorite' THEN 0.8
        WHEN activity_type = 'share' THEN 0.7
        WHEN activity_type = 'click' THEN 0.3
        ELSE 0.2
      END) as avg_weight
    FROM user_activity
    WHERE created_at > CURRENT_TIMESTAMP - INTERVAL '1 day' * p_days
    GROUP BY content_type, content_id
    HAVING COUNT(DISTINCT user_id) > 2
  )
  SELECT
    ra.content_type,
    ra.content_id,
    CASE
      WHEN ra.content_type = 'project' THEN p.name
      WHEN ra.content_type = 'resource' THEN r.title
      WHEN ra.content_type = 'wiki_guide' THEN wg.title
    END as title,
    (ra.unique_users::DECIMAL / 10 + ra.avg_weight) as trend_score
  FROM recent_activity ra
  LEFT JOIN projects p ON ra.content_type = 'project' AND ra.content_id = p.id
  LEFT JOIN resources r ON ra.content_type = 'resource' AND ra.content_id = r.id
  LEFT JOIN wiki_guides wg ON ra.content_type = 'wiki_guide' AND ra.content_id = wg.id
  WHERE (p.id IS NOT NULL OR r.id IS NOT NULL OR wg.id IS NOT NULL)
  ORDER BY trend_score DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;
`;

export default PreferenceLearning;