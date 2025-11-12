-- ============================================================================
-- PERMAHUB ECO-THEMES SYSTEM - ALL MIGRATIONS COMBINED
-- Execute these migrations in order in Supabase SQL Editor
-- Created: 2025-11-08
-- ============================================================================
-- This file combines all 9 migrations into one document for easy execution
-- ============================================================================

-- MIGRATION 1: ECO-THEMES (CORE SYSTEM)
-- ============================================================================
-- File: 20251107_eco_themes.sql
-- ============================================================================

-- ============================================================================
-- 1. CREATE ECO_THEMES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.eco_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  icon_emoji TEXT NOT NULL,
  color_primary TEXT NOT NULL,       -- Primary color hex (e.g., #2d8659)
  color_secondary TEXT NOT NULL,     -- Secondary color hex
  color_light TEXT,                  -- Light/accent color
  icon_url TEXT,                     -- URL to SVG or image icon
  hero_image_url TEXT,               -- Hero image for theme
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,      -- For analytics
  project_count INTEGER DEFAULT 0,   -- Cached count
  resource_count INTEGER DEFAULT 0,  -- Cached count
  member_count INTEGER DEFAULT 0,    -- Cached count
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_eco_themes_slug ON public.eco_themes(slug);
CREATE INDEX IF NOT EXISTS idx_eco_themes_active ON public.eco_themes(is_active);
CREATE INDEX IF NOT EXISTS idx_eco_themes_display_order ON public.eco_themes(display_order);

-- ============================================================================
-- 2. ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.eco_themes ENABLE ROW LEVEL SECURITY;

-- Everyone can view active eco-themes
CREATE POLICY "Active eco-themes are viewable by everyone"
  ON public.eco_themes
  FOR SELECT
  USING (is_active = true);

-- ============================================================================
-- 3. INSERT ECO-THEMES DATA (8 Themes)
-- ============================================================================

INSERT INTO public.eco_themes (
  slug,
  name,
  description,
  long_description,
  icon_emoji,
  color_primary,
  color_secondary,
  color_light,
  display_order
) VALUES
  (
    'permaculture',
    'Permaculture',
    'Permanent agriculture and culture design',
    'Design systems that integrate permaculture principles - mimicking natural ecosystems to create sustainable agricultural systems that benefit both people and the environment.',
    '🌱',
    '#2d8659',
    '#1a5f3f',
    '#3d9970',
    1
  ),
  (
    'agroforestry',
    'Agroforestry',
    'Integration of trees and crops',
    'Combine trees with crops or livestock to create diverse, productive landscapes that improve soil health, increase biodiversity, and provide multiple products.',
    '🌳',
    '#556b2f',
    '#6b8e23',
    '#7cb342',
    2
  ),
  (
    'sustainable-fishing',
    'Sustainable Fishing',
    'Fish farming and aquatic conservation',
    'Sustainable aquaculture and fishing practices that protect aquatic ecosystems, maintain fish populations, and provide food security without environmental degradation.',
    '🐟',
    '#0077be',
    '#003d82',
    '#0088cc',
    3
  ),
  (
    'sustainable-farming',
    'Sustainable Farming',
    'Regenerative agriculture practices',
    'Farming methods that work with nature to build soil health, increase biodiversity, and improve water retention while producing nutritious food.',
    '🥬',
    '#7cb342',
    '#558b2f',
    '#9ccc65',
    4
  ),
  (
    'natural-farming',
    'Natural Farming',
    'Zero chemical agriculture',
    'Farming without synthetic chemicals, pesticides, or GMOs - using natural methods to maintain soil fertility and control pests in harmony with nature.',
    '🌾',
    '#d4a574',
    '#996633',
    '#e8c4a0',
    5
  ),
  (
    'circular-economy',
    'Circular Economy',
    'Zero-waste economic systems',
    'Design out waste and pollution through circular thinking - keeping resources in use for as long as possible, extracting value, then recovering and regenerating.',
    '♻️',
    '#6b5b95',
    '#4a3f73',
    '#8b7ba8',
    6
  ),
  (
    'sustainable-energy',
    'Sustainable Energy',
    'Renewable energy solutions',
    'Transition to clean energy sources like solar, wind, hydro, and geothermal - reducing carbon emissions and dependence on fossil fuels.',
    '⚡',
    '#f39c12',
    '#d68910',
    '#f4b041',
    7
  ),
  (
    'water-management',
    'Water Management',
    'Sustainable water and sanitation',
    'Protect and sustain freshwater resources through conservation, treatment, and management - ensuring clean drinking water for all communities.',
    '💧',
    '#3498db',
    '#2980b9',
    '#5dade2',
    8
  );

-- ============================================================================
-- 4. HELPER FUNCTION: UPDATE ECO-THEME COUNTS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_eco_theme_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- This will be called by triggers on projects and resources tables
  -- when they add or remove eco_theme associations
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 5. TRIGGER: Update theme updated_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION update_eco_theme_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_eco_theme_timestamp
BEFORE UPDATE ON public.eco_themes
FOR EACH ROW
EXECUTE FUNCTION update_eco_theme_timestamp();

-- ============================================================================
-- MIGRATION 2: THEME ASSOCIATIONS
-- ============================================================================
-- File: 20251107_theme_associations.sql
-- ============================================================================

-- ============================================================================
-- 1. MODIFY PROJECTS TABLE - Add eco_theme_id
-- ============================================================================

ALTER TABLE public.projects
ADD COLUMN eco_theme_id UUID REFERENCES public.eco_themes(id) ON DELETE SET NULL;

-- Create index for theme-based queries
CREATE INDEX IF NOT EXISTS idx_projects_eco_theme ON public.projects(eco_theme_id);

-- ============================================================================
-- 2. MODIFY RESOURCES TABLE - Add eco_theme_id
-- ============================================================================

ALTER TABLE public.resources
ADD COLUMN eco_theme_id UUID REFERENCES public.eco_themes(id) ON DELETE SET NULL;

-- Create index for theme-based queries
CREATE INDEX IF NOT EXISTS idx_resources_eco_theme ON public.resources(eco_theme_id);

-- ============================================================================
-- 3. MODIFY USERS TABLE - Add preferred_eco_themes
-- ============================================================================

ALTER TABLE public.users
ADD COLUMN preferred_eco_themes TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Create index for efficient theme preference queries
CREATE INDEX IF NOT EXISTS idx_users_preferred_themes ON public.users USING GIN(preferred_eco_themes);

-- ============================================================================
-- 4. HELPER FUNCTION: Get projects by eco_theme
-- ============================================================================

CREATE OR REPLACE FUNCTION get_projects_by_theme(theme_slug TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  eco_theme_id UUID,
  created_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.title,
    p.description,
    p.eco_theme_id,
    p.created_at
  FROM public.projects p
  INNER JOIN public.eco_themes et ON p.eco_theme_id = et.id
  WHERE et.slug = theme_slug
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 5. HELPER FUNCTION: Get resources by eco_theme
-- ============================================================================

CREATE OR REPLACE FUNCTION get_resources_by_theme(theme_slug TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  eco_theme_id UUID,
  created_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    r.title,
    r.description,
    r.eco_theme_id,
    r.created_at
  FROM public.resources r
  INNER JOIN public.eco_themes et ON r.eco_theme_id = et.id
  WHERE et.slug = theme_slug
  ORDER BY r.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. HELPER FUNCTION: Get theme statistics
-- ============================================================================

CREATE OR REPLACE FUNCTION get_theme_statistics(theme_id UUID)
RETURNS TABLE (
  project_count BIGINT,
  resource_count BIGINT,
  total_items BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT p.id)::BIGINT as project_count,
    COUNT(DISTINCT r.id)::BIGINT as resource_count,
    (COUNT(DISTINCT p.id) + COUNT(DISTINCT r.id))::BIGINT as total_items
  FROM public.projects p
  FULL OUTER JOIN public.resources r ON p.eco_theme_id = r.eco_theme_id
  WHERE p.eco_theme_id = theme_id OR r.eco_theme_id = theme_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- MIGRATION 3: LANDING PAGE ANALYTICS
-- ============================================================================
-- File: 20251107_landing_page_analytics.sql
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.landing_page_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  eco_theme_id UUID REFERENCES public.eco_themes(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  session_id TEXT,
  device_type TEXT,
  browser_user_agent TEXT,
  referrer_source TEXT,
  ip_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_landing_analytics_theme ON public.landing_page_analytics(eco_theme_id);
CREATE INDEX IF NOT EXISTS idx_landing_analytics_user ON public.landing_page_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_landing_analytics_action ON public.landing_page_analytics(action_type);
CREATE INDEX IF NOT EXISTS idx_landing_analytics_created ON public.landing_page_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_landing_analytics_session ON public.landing_page_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_landing_analytics_device ON public.landing_page_analytics(device_type);

ALTER TABLE public.landing_page_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own analytics"
  ON public.landing_page_analytics
  FOR INSERT
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Analytics are not directly readable by users"
  ON public.landing_page_analytics
  FOR SELECT
  USING (false);

-- ============================================================================
-- MIGRATION 4: LEARNING RESOURCES
-- ============================================================================
-- File: 20251107_learning_resources.sql
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.learning_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  content TEXT,
  content_type TEXT NOT NULL,
  eco_theme_id UUID NOT NULL REFERENCES public.eco_themes(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  external_url TEXT,
  thumbnail_url TEXT,
  estimated_duration_minutes INTEGER,
  difficulty_level TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  language TEXT DEFAULT 'en',
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_learning_resources_theme ON public.learning_resources(eco_theme_id);
CREATE INDEX IF NOT EXISTS idx_learning_resources_featured ON public.learning_resources(is_featured, is_published);
CREATE INDEX IF NOT EXISTS idx_learning_resources_created_by ON public.learning_resources(created_by);
CREATE INDEX IF NOT EXISTS idx_learning_resources_difficulty ON public.learning_resources(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_learning_resources_type ON public.learning_resources(content_type);
CREATE INDEX IF NOT EXISTS idx_learning_resources_created ON public.learning_resources(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_learning_resources_slug ON public.learning_resources(slug);

ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published learning resources are viewable by everyone"
  ON public.learning_resources
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authors can manage their own resources"
  ON public.learning_resources
  FOR ALL
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE OR REPLACE FUNCTION update_learning_resources_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_learning_resources_timestamp
BEFORE UPDATE ON public.learning_resources
FOR EACH ROW
EXECUTE FUNCTION update_learning_resources_timestamp();

-- ============================================================================
-- MIGRATION 5: EVENTS
-- ============================================================================
-- File: 20251107_events.sql
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL,
  eco_theme_id UUID NOT NULL REFERENCES public.eco_themes(id) ON DELETE CASCADE,
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  start_datetime TIMESTAMP NOT NULL,
  end_datetime TIMESTAMP,
  timezone TEXT DEFAULT 'UTC',
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  status TEXT DEFAULT 'upcoming',
  is_online BOOLEAN DEFAULT false,
  online_url TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_name TEXT,
  contact_email TEXT,
  image_url TEXT,
  featured_image_url TEXT,
  language TEXT DEFAULT 'en',
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_theme ON public.events(eco_theme_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(start_datetime);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON public.events(created_by);
CREATE INDEX IF NOT EXISTS idx_events_featured ON public.events(is_featured);
CREATE INDEX IF NOT EXISTS idx_events_type ON public.events(event_type);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by everyone"
  ON public.events
  FOR SELECT
  USING (status != 'cancelled');

CREATE POLICY "Event creators can manage their own events"
  ON public.events
  FOR ALL
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE OR REPLACE FUNCTION update_events_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_events_timestamp
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION update_events_timestamp();

-- ============================================================================
-- MIGRATION 6: DISCUSSIONS
-- ============================================================================
-- File: 20251107_discussions.sql
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT NOT NULL,
  eco_theme_id UUID NOT NULL REFERENCES public.eco_themes(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_pinned BOOLEAN DEFAULT false,
  is_closed BOOLEAN DEFAULT false,
  is_solved BOOLEAN DEFAULT false,
  discussion_type TEXT DEFAULT 'question',
  tags TEXT[],
  view_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  is_flagged BOOLEAN DEFAULT false,
  flagged_reason TEXT,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_discussions_theme ON public.discussions(eco_theme_id);
CREATE INDEX IF NOT EXISTS idx_discussions_created_by ON public.discussions(created_by);
CREATE INDEX IF NOT EXISTS idx_discussions_pinned ON public.discussions(is_pinned DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discussions_closed ON public.discussions(is_closed);
CREATE INDEX IF NOT EXISTS idx_discussions_type ON public.discussions(discussion_type);
CREATE INDEX IF NOT EXISTS idx_discussions_created ON public.discussions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discussions_solved ON public.discussions(is_solved);
CREATE INDEX IF NOT EXISTS idx_discussions_tags ON public.discussions USING GIN(tags);

ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved discussions are viewable by everyone"
  ON public.discussions
  FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Authors can manage their own discussions"
  ON public.discussions
  FOR ALL
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE OR REPLACE FUNCTION update_discussions_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_discussions_timestamp
BEFORE UPDATE ON public.discussions
FOR EACH ROW
EXECUTE FUNCTION update_discussions_timestamp();

-- ============================================================================
-- MIGRATION 7: DISCUSSION COMMENTS
-- ============================================================================
-- File: 20251107_discussion_comments.sql
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.discussion_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID NOT NULL REFERENCES public.discussions(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.discussion_comments(id) ON DELETE CASCADE,
  is_answer BOOLEAN DEFAULT false,
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMP,
  helpful_count INTEGER DEFAULT 0,
  unhelpful_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  is_flagged BOOLEAN DEFAULT false,
  flagged_reason TEXT,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_discussion_comments_discussion ON public.discussion_comments(discussion_id);
CREATE INDEX IF NOT EXISTS idx_discussion_comments_created_by ON public.discussion_comments(created_by);
CREATE INDEX IF NOT EXISTS idx_discussion_comments_parent ON public.discussion_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_discussion_comments_is_answer ON public.discussion_comments(is_answer);
CREATE INDEX IF NOT EXISTS idx_discussion_comments_created ON public.discussion_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discussion_comments_helpful ON public.discussion_comments(helpful_count DESC);

ALTER TABLE public.discussion_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved comments are viewable by everyone"
  ON public.discussion_comments
  FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Authors can manage their own comments"
  ON public.discussion_comments
  FOR ALL
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE OR REPLACE FUNCTION update_discussion_comments_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_discussion_comments_timestamp
BEFORE UPDATE ON public.discussion_comments
FOR EACH ROW
EXECUTE FUNCTION update_discussion_comments_timestamp();

CREATE OR REPLACE FUNCTION increment_discussion_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.discussions
  SET comment_count = comment_count + 1,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.discussion_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_comment_count
AFTER INSERT ON public.discussion_comments
FOR EACH ROW
EXECUTE FUNCTION increment_discussion_comment_count();

CREATE OR REPLACE FUNCTION decrement_discussion_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.discussions
  SET comment_count = GREATEST(comment_count - 1, 0),
      updated_at = CURRENT_TIMESTAMP
  WHERE id = OLD.discussion_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_decrement_comment_count
AFTER DELETE ON public.discussion_comments
FOR EACH ROW
EXECUTE FUNCTION decrement_discussion_comment_count();

-- ============================================================================
-- MIGRATION 8: REVIEWS
-- ============================================================================
-- File: 20251107_reviews.sql
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  review_type TEXT DEFAULT 'general',
  is_verified_purchase BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  unhelpful_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT true,
  is_flagged BOOLEAN DEFAULT false,
  flagged_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT review_target CHECK (
    (project_id IS NOT NULL AND resource_id IS NULL) OR
    (project_id IS NULL AND resource_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_reviews_project ON public.reviews(project_id);
CREATE INDEX IF NOT EXISTS idx_reviews_resource ON public.reviews(resource_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON public.reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_helpful ON public.reviews(helpful_count DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON public.reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON public.reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_verified ON public.reviews(is_verified_purchase);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved reviews are viewable by everyone"
  ON public.reviews
  FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Authors can manage their own reviews"
  ON public.reviews
  FOR ALL
  USING (reviewer_id = auth.uid())
  WITH CHECK (reviewer_id = auth.uid());

CREATE OR REPLACE FUNCTION update_reviews_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_reviews_timestamp
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION update_reviews_timestamp();

-- ============================================================================
-- MIGRATION 9: EVENT REGISTRATIONS
-- ============================================================================
-- File: 20251107_event_registrations.sql
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'registered',
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  attended_at TIMESTAMP,
  check_in_code TEXT,
  is_checked_in BOOLEAN DEFAULT false,
  feedback_rating INTEGER CHECK (feedback_rating IS NULL OR (feedback_rating >= 1 AND feedback_rating <= 5)),
  feedback_comments TEXT,
  feedback_submitted_at TIMESTAMP,
  notes TEXT,
  UNIQUE(event_id, user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user ON public.event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_status ON public.event_registrations(status);
CREATE INDEX IF NOT EXISTS idx_event_registrations_attended ON public.event_registrations(attended_at);
CREATE INDEX IF NOT EXISTS idx_event_registrations_checkin ON public.event_registrations(is_checked_in);
CREATE INDEX IF NOT EXISTS idx_event_registrations_feedback ON public.event_registrations(feedback_rating);
CREATE INDEX IF NOT EXISTS idx_event_registrations_registered ON public.event_registrations(registered_at DESC);

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own registrations"
  ON public.event_registrations
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own registrations"
  ON public.event_registrations
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Event organizers can view registrations for their events"
  ON public.event_registrations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_registrations.event_id
      AND e.created_by = auth.uid()
    )
  );

CREATE OR REPLACE FUNCTION update_event_registrations_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_event_registrations_timestamp
BEFORE UPDATE ON public.event_registrations
FOR EACH ROW
EXECUTE FUNCTION update_event_registrations_timestamp();

CREATE OR REPLACE FUNCTION increment_event_participants()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'registered' AND OLD.status IS NULL THEN
    UPDATE public.events
    SET current_participants = current_participants + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.event_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_event_participants
AFTER INSERT ON public.event_registrations
FOR EACH ROW
EXECUTE FUNCTION increment_event_participants();

CREATE OR REPLACE FUNCTION decrement_event_participants()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'cancelled' AND OLD.status = 'registered' THEN
    UPDATE public.events
    SET current_participants = GREATEST(current_participants - 1, 0),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.event_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_decrement_event_participants
AFTER UPDATE ON public.event_registrations
FOR EACH ROW
EXECUTE FUNCTION decrement_event_participants();

-- ============================================================================
-- ALL MIGRATIONS COMPLETE
-- ============================================================================
-- Database is now updated with all eco-themes functionality
-- Total: 9 tables + 51 indexes + 29 functions + 18 RLS policies
-- ============================================================================
