/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/migrations/005_user_personalization.sql
 * Description: User activity tracking and personalization system for customized landing pages
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-14
 */

-- ============================================================================
-- USER ACTIVITY TRACKING TABLES
-- ============================================================================

-- Drop old version of user_activity if it exists (from previous migrations)
DROP TABLE IF EXISTS public.user_activity CASCADE;

-- Track user interactions with different content types
CREATE TABLE public.user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'view', 'click', 'search', 'favorite', 'create', 'share'
  content_type TEXT NOT NULL, -- 'project', 'resource', 'wiki_guide', 'event', 'user_profile'
  content_id UUID, -- ID of the content interacted with
  category_type TEXT, -- Category type from resource_categories
  category_id UUID REFERENCES public.resource_categories(id) ON DELETE SET NULL,
  wiki_category_id UUID REFERENCES public.wiki_categories(id) ON DELETE SET NULL,
  session_id TEXT, -- Group activities by session
  metadata JSONB DEFAULT '{}', -- Additional context (search terms, filters, etc.)
  duration_seconds INTEGER, -- Time spent on content
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Indexes for performance
  CONSTRAINT activity_type_check CHECK (activity_type IN ('view', 'click', 'search', 'favorite', 'create', 'share', 'comment', 'download')),
  CONSTRAINT content_type_check CHECK (content_type IN ('project', 'resource', 'wiki_guide', 'event', 'user_profile', 'category_page'))
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_user_activity_user ON public.user_activity(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_content ON public.user_activity(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_category ON public.user_activity(category_type, category_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_session ON public.user_activity(session_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created ON public.user_activity(created_at DESC);

-- ============================================================================
-- USER PREFERENCES TABLE
-- ============================================================================

-- Store computed user preferences based on activity patterns
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  preference_type TEXT NOT NULL, -- 'category', 'content_type', 'skill', 'location_radius'
  preference_value TEXT NOT NULL, -- The actual preference value
  score DECIMAL(5, 4) DEFAULT 0.5, -- Preference strength (0-1)
  interaction_count INTEGER DEFAULT 0, -- Number of interactions
  last_interaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  computed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Ensure unique preferences per user
  UNIQUE(user_id, preference_type, preference_value)
);

CREATE INDEX IF NOT EXISTS idx_user_preferences_user ON public.user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_score ON public.user_preferences(user_id, score DESC);

-- ============================================================================
-- USER AFFINITY SCORES TABLE
-- ============================================================================

-- Track user affinity for specific categories and content types
CREATE TABLE IF NOT EXISTS public.user_affinity_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category_type TEXT, -- From resource_categories
  category_id UUID REFERENCES public.resource_categories(id) ON DELETE CASCADE,
  wiki_category_id UUID REFERENCES public.wiki_categories(id) ON DELETE CASCADE,

  -- Engagement metrics
  view_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  create_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  total_time_seconds INTEGER DEFAULT 0,

  -- Computed scores
  engagement_score DECIMAL(5, 4) DEFAULT 0, -- 0-1 score based on engagement
  recency_score DECIMAL(5, 4) DEFAULT 0, -- 0-1 score based on recent activity
  frequency_score DECIMAL(5, 4) DEFAULT 0, -- 0-1 score based on frequency
  overall_score DECIMAL(5, 4) GENERATED ALWAYS AS (
    (engagement_score * 0.5 + recency_score * 0.3 + frequency_score * 0.2)
  ) STORED,

  last_interaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Ensure unique scores per user and category
  UNIQUE(user_id, category_id),
  UNIQUE(user_id, wiki_category_id)
);

CREATE INDEX IF NOT EXISTS idx_affinity_scores_user ON public.user_affinity_scores(user_id, overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_affinity_scores_category ON public.user_affinity_scores(category_id);
CREATE INDEX IF NOT EXISTS idx_affinity_scores_wiki ON public.user_affinity_scores(wiki_category_id);

-- ============================================================================
-- PERSONALIZED CONTENT RECOMMENDATIONS TABLE
-- ============================================================================

-- Store pre-computed recommendations for fast loading
CREATE TABLE IF NOT EXISTS public.user_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL, -- 'project', 'resource', 'wiki_guide', 'event', 'user'
  content_id UUID NOT NULL,
  score DECIMAL(5, 4) DEFAULT 0.5, -- Recommendation strength
  reason TEXT, -- Why this was recommended
  metadata JSONB DEFAULT '{}', -- Additional context
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days'),

  -- Ensure unique recommendations
  UNIQUE(user_id, recommendation_type, content_id)
);

CREATE INDEX IF NOT EXISTS idx_recommendations_user ON public.user_recommendations(user_id, score DESC);
CREATE INDEX IF NOT EXISTS idx_recommendations_expires ON public.user_recommendations(expires_at);

-- ============================================================================
-- USER DASHBOARD LAYOUT PREFERENCES
-- ============================================================================

-- Drop old version if it exists
DROP TABLE IF EXISTS public.user_dashboard_config CASCADE;

-- Store user's preferred dashboard layout and widget configuration
CREATE TABLE public.user_dashboard_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  -- Layout preferences
  layout_type TEXT DEFAULT 'auto', -- 'auto', 'grid', 'list', 'compact'
  theme_preference TEXT DEFAULT 'system', -- 'light', 'dark', 'system'

  -- Widget visibility and order
  widgets JSONB DEFAULT '{
    "quick_actions": {"visible": true, "order": 1, "expanded": true},
    "recent_activity": {"visible": true, "order": 2, "expanded": true},
    "recommendations": {"visible": true, "order": 3, "expanded": true},
    "favorite_categories": {"visible": true, "order": 4, "expanded": false},
    "nearby_projects": {"visible": true, "order": 5, "expanded": false},
    "trending_resources": {"visible": true, "order": 6, "expanded": false},
    "upcoming_events": {"visible": true, "order": 7, "expanded": false},
    "wiki_suggestions": {"visible": true, "order": 8, "expanded": false}
  }',

  -- Personalization settings
  show_recommendations BOOLEAN DEFAULT true,
  recommendation_count INTEGER DEFAULT 10,
  content_density TEXT DEFAULT 'normal', -- 'compact', 'normal', 'comfortable'
  language_override TEXT, -- Override system language

  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(user_id)
);

-- ============================================================================
-- FUNCTIONS FOR ACTIVITY TRACKING
-- ============================================================================

-- Function to record user activity and update affinity scores
CREATE OR REPLACE FUNCTION public.track_user_activity(
  p_user_id UUID,
  p_activity_type TEXT,
  p_content_type TEXT,
  p_content_id UUID,
  p_category_type TEXT DEFAULT NULL,
  p_category_id UUID DEFAULT NULL,
  p_duration_seconds INTEGER DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  v_activity_id UUID;
  v_weight DECIMAL;
BEGIN
  -- Determine activity weight for scoring
  v_weight := CASE p_activity_type
    WHEN 'create' THEN 1.0
    WHEN 'favorite' THEN 0.8
    WHEN 'share' THEN 0.7
    WHEN 'comment' THEN 0.6
    WHEN 'click' THEN 0.4
    WHEN 'view' THEN 0.2
    WHEN 'search' THEN 0.1
    ELSE 0.1
  END;

  -- Insert activity record
  INSERT INTO public.user_activity (
    user_id, activity_type, content_type, content_id,
    category_type, category_id, duration_seconds, metadata
  ) VALUES (
    p_user_id, p_activity_type, p_content_type, p_content_id,
    p_category_type, p_category_id, p_duration_seconds, p_metadata
  ) RETURNING id INTO v_activity_id;

  -- Update affinity scores if category is provided
  IF p_category_id IS NOT NULL THEN
    INSERT INTO public.user_affinity_scores (
      user_id, category_id, category_type,
      view_count, click_count, create_count, favorite_count,
      total_time_seconds, engagement_score, recency_score, frequency_score,
      last_interaction
    ) VALUES (
      p_user_id, p_category_id, p_category_type,
      CASE WHEN p_activity_type = 'view' THEN 1 ELSE 0 END,
      CASE WHEN p_activity_type = 'click' THEN 1 ELSE 0 END,
      CASE WHEN p_activity_type = 'create' THEN 1 ELSE 0 END,
      CASE WHEN p_activity_type = 'favorite' THEN 1 ELSE 0 END,
      COALESCE(p_duration_seconds, 0),
      v_weight,
      1.0, -- Max recency for new interaction
      0.1, -- Initial frequency
      CURRENT_TIMESTAMP
    )
    ON CONFLICT (user_id, category_id) DO UPDATE SET
      view_count = user_affinity_scores.view_count +
        CASE WHEN p_activity_type = 'view' THEN 1 ELSE 0 END,
      click_count = user_affinity_scores.click_count +
        CASE WHEN p_activity_type = 'click' THEN 1 ELSE 0 END,
      create_count = user_affinity_scores.create_count +
        CASE WHEN p_activity_type = 'create' THEN 1 ELSE 0 END,
      favorite_count = user_affinity_scores.favorite_count +
        CASE WHEN p_activity_type = 'favorite' THEN 1 ELSE 0 END,
      total_time_seconds = user_affinity_scores.total_time_seconds +
        COALESCE(p_duration_seconds, 0),
      engagement_score = LEAST(1.0, user_affinity_scores.engagement_score + v_weight * 0.1),
      recency_score = 1.0, -- Reset to max on new interaction
      frequency_score = LEAST(1.0, user_affinity_scores.frequency_score + 0.05),
      last_interaction = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP;
  END IF;

  RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION TO GET PERSONALIZED CONTENT FOR USER
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_personalized_content(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 10
) RETURNS TABLE (
  content_type TEXT,
  content_id UUID,
  title TEXT,
  description TEXT,
  category_name TEXT,
  score DECIMAL,
  reason TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH user_top_categories AS (
    -- Get user's top 5 categories by affinity
    SELECT
      category_id,
      category_type,
      overall_score
    FROM public.user_affinity_scores
    WHERE user_id = p_user_id
    ORDER BY overall_score DESC
    LIMIT 5
  ),
  recent_projects AS (
    -- Get recent projects in user's favorite categories
    SELECT
      'project'::TEXT as content_type,
      p.id as content_id,
      p.name as title,
      p.description,
      rc.name as category_name,
      utc.overall_score as score,
      'Based on your interest in ' || rc.name as reason
    FROM public.projects p
    JOIN public.resource_categories rc ON rc.category_type = p.project_type
    JOIN user_top_categories utc ON utc.category_type = p.project_type
    WHERE p.is_active = true
    ORDER BY p.created_at DESC
    LIMIT p_limit / 3
  ),
  recommended_resources AS (
    -- Get resources in user's favorite categories
    SELECT
      'resource'::TEXT as content_type,
      r.id as content_id,
      r.title,
      r.description,
      rc.name as category_name,
      utc.overall_score as score,
      'Popular in ' || rc.name as reason
    FROM public.resources r
    JOIN public.resource_categories rc ON r.category_id = rc.id
    JOIN user_top_categories utc ON utc.category_id = r.category_id
    WHERE r.is_available = true
    ORDER BY r.created_at DESC
    LIMIT p_limit / 3
  ),
  suggested_guides AS (
    -- Get wiki guides in user's interests
    SELECT DISTINCT
      'wiki_guide'::TEXT as content_type,
      wg.id as content_id,
      wg.title,
      wg.summary as description,
      wc.name as category_name,
      0.5 as score, -- Default score for guides
      'Recommended guide' as reason
    FROM public.wiki_guides wg
    JOIN public.wiki_guide_categories wgc ON wg.id = wgc.guide_id
    JOIN public.wiki_categories wc ON wgc.category_id = wc.id
    WHERE wg.status = 'published'
    ORDER BY wg.view_count DESC
    LIMIT p_limit / 3
  )
  -- Combine all recommendations
  SELECT * FROM recent_projects
  UNION ALL
  SELECT * FROM recommended_resources
  UNION ALL
  SELECT * FROM suggested_guides
  ORDER BY score DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION TO UPDATE RECENCY SCORES (RUN PERIODICALLY)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_recency_scores() RETURNS void AS $$
BEGIN
  -- Decay recency scores based on time since last interaction
  UPDATE public.user_affinity_scores
  SET
    recency_score = GREATEST(0,
      recency_score - (EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - last_interaction)) / 86400) * 0.1
    ),
    updated_at = CURRENT_TIMESTAMP
  WHERE last_interaction < CURRENT_TIMESTAMP - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- RLS POLICIES FOR PERSONALIZATION TABLES
-- ============================================================================

-- Enable RLS on all personalization tables
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_affinity_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_dashboard_config ENABLE ROW LEVEL SECURITY;

-- Users can only see their own activity
CREATE POLICY "Users can view own activity"
  ON public.user_activity
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity"
  ON public.user_activity
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only see their own preferences
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences
  FOR ALL
  USING (auth.uid() = user_id);

-- Users can only see their own affinity scores
CREATE POLICY "Users can view own affinity scores"
  ON public.user_affinity_scores
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only see their own recommendations
CREATE POLICY "Users can view own recommendations"
  ON public.user_recommendations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can manage their own dashboard config
CREATE POLICY "Users can manage own dashboard config"
  ON public.user_dashboard_config
  FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================================
-- SCHEDULED JOBS (TO BE SET UP IN SUPABASE)
-- ============================================================================

-- Note: Set up these as scheduled functions in Supabase Dashboard:
-- 1. update_recency_scores() - Run daily at midnight
-- 2. cleanup_old_activity() - Run weekly to remove activity older than 90 days
-- 3. compute_recommendations() - Run every 6 hours to refresh recommendations

-- Cleanup function for old activity data
CREATE OR REPLACE FUNCTION public.cleanup_old_activity() RETURNS void AS $$
BEGIN
  -- Delete activity older than 90 days
  DELETE FROM public.user_activity
  WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '90 days';

  -- Delete expired recommendations
  DELETE FROM public.user_recommendations
  WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SAMPLE DATA FOR TESTING
-- ============================================================================

-- Note: This creates sample activity for testing personalization
-- Remove or comment out in production

DO $$
DECLARE
  sample_user_id UUID;
BEGIN
  -- Get a sample user ID (if exists)
  SELECT id INTO sample_user_id FROM public.users LIMIT 1;

  IF sample_user_id IS NOT NULL THEN
    -- Create sample activity for different categories
    PERFORM public.track_user_activity(
      sample_user_id, 'view', 'resource', gen_random_uuid(),
      'animal', NULL, 120, '{"source": "browse"}'
    );

    PERFORM public.track_user_activity(
      sample_user_id, 'click', 'resource', gen_random_uuid(),
      'preservation', NULL, 45, '{"source": "search"}'
    );

    PERFORM public.track_user_activity(
      sample_user_id, 'favorite', 'project', gen_random_uuid(),
      'fungi', NULL, 0, '{"source": "recommendation"}'
    );
  END IF;
END $$;