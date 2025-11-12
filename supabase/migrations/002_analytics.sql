-- ============================================================================
-- Permaculture Network - Analytics & Dashboard Configuration Tables
-- Add to existing database to enable landing page personalization
-- ============================================================================

-- ============================================================================
-- 1. USER ACTIVITY TRACKING TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  item_type TEXT,
  item_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_user_activity_user ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON public.user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_item ON public.user_activity(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created ON public.user_activity(created_at DESC);

-- ============================================================================
-- 2. USER DASHBOARD CONFIGURATION TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_dashboard_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  items JSONB DEFAULT '[]',
  item_count INTEGER DEFAULT 10,
  last_customized TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_personalized BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_dashboard_user ON public.user_dashboard_config(user_id);

-- ============================================================================
-- 3. GLOBAL POPULAR ITEMS VIEW
-- ============================================================================

CREATE OR REPLACE VIEW public.v_popular_projects AS
SELECT 
  p.id,
  p.name,
  p.description,
  p.project_type,
  p.region,
  'project' as item_type,
  COUNT(ua.id) as view_count,
  p.created_at,
  RANK() OVER (ORDER BY COUNT(ua.id) DESC) as popularity_rank
FROM public.projects p
LEFT JOIN public.user_activity ua ON p.id = ua.item_id AND ua.item_type = 'project' AND ua.activity_type = 'view'
WHERE p.status = 'active'
GROUP BY p.id, p.name, p.description, p.project_type, p.region, p.created_at
ORDER BY view_count DESC
LIMIT 20;

CREATE OR REPLACE VIEW public.v_popular_resources AS
SELECT 
  r.id,
  r.title as name,
  r.description,
  r.resource_type,
  r.location as region,
  'resource' as item_type,
  COUNT(ua.id) as view_count,
  r.created_at,
  RANK() OVER (ORDER BY COUNT(ua.id) DESC) as popularity_rank
FROM public.resources r
LEFT JOIN public.user_activity ua ON r.id = ua.item_id AND ua.item_type = 'resource' AND ua.activity_type = 'view'
WHERE r.availability != 'archived'
GROUP BY r.id, r.title, r.description, r.resource_type, r.location, r.created_at
ORDER BY view_count DESC
LIMIT 20;

-- ============================================================================
-- 4. USER PERSONALIZED ITEMS VIEW
-- ============================================================================

CREATE OR REPLACE VIEW public.v_user_top_items AS
SELECT 
  user_id,
  item_type,
  item_id,
  COUNT(*) as interaction_count,
  MAX(created_at) as last_interaction
FROM public.user_activity
WHERE activity_type IN ('view', 'click', 'save')
GROUP BY user_id, item_type, item_id
ORDER BY interaction_count DESC;

-- ============================================================================
-- 5. ROW LEVEL SECURITY FOR NEW TABLES
-- ============================================================================

ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_dashboard_config ENABLE ROW LEVEL SECURITY;

-- User activity: users can only view their own activity
CREATE POLICY "Users can view their own activity"
  ON public.user_activity
  FOR SELECT
  USING (auth.uid() = user_id);

-- User activity: allow insert for logged in users
CREATE POLICY "Authenticated users can log their activity"
  ON public.user_activity
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Dashboard config: users can only view their own
CREATE POLICY "Users can view their own dashboard config"
  ON public.user_dashboard_config
  FOR SELECT
  USING (auth.uid() = user_id);

-- Dashboard config: users can update their own
CREATE POLICY "Users can update their own dashboard config"
  ON public.user_dashboard_config
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Dashboard config: allow insert for logged in users
CREATE POLICY "Authenticated users can create dashboard config"
  ON public.user_dashboard_config
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 6. HELPER FUNCTION: LOG USER ACTIVITY
-- ============================================================================

CREATE OR REPLACE FUNCTION log_user_activity(
  p_user_id UUID,
  p_activity_type TEXT,
  p_item_type TEXT DEFAULT NULL,
  p_item_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.user_activity (
    user_id,
    activity_type,
    item_type,
    item_id,
    metadata
  ) VALUES (
    p_user_id,
    p_activity_type,
    p_item_type,
    p_item_id,
    COALESCE(p_metadata, '{}'::jsonb)
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 7. HELPER FUNCTION: GET USER TOP ITEMS
-- ============================================================================

CREATE OR REPLACE FUNCTION get_user_top_items(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  item_id UUID,
  item_type TEXT,
  interaction_count BIGINT,
  last_interaction TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    vui.item_id,
    vui.item_type,
    vui.interaction_count,
    vui.last_interaction
  FROM public.v_user_top_items vui
  WHERE vui.user_id = p_user_id
  ORDER BY vui.interaction_count DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 8. HELPER FUNCTION: UPDATE DASHBOARD PERSONALIZATION
-- ============================================================================

CREATE OR REPLACE FUNCTION update_dashboard_personalization(
  p_user_id UUID,
  p_items JSONB,
  p_item_count INTEGER DEFAULT 10
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.user_dashboard_config (
    user_id,
    items,
    item_count,
    is_personalized,
    last_customized
  ) VALUES (
    p_user_id,
    p_items,
    p_item_count,
    true,
    CURRENT_TIMESTAMP
  )
  ON CONFLICT (user_id) DO UPDATE SET
    items = p_items,
    item_count = p_item_count,
    is_personalized = true,
    last_customized = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 9. TRIGGER: UPDATE dashboard updated_at ON CHANGE
-- ============================================================================

CREATE OR REPLACE FUNCTION update_dashboard_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_dashboard_timestamp
BEFORE UPDATE ON public.user_dashboard_config
FOR EACH ROW
EXECUTE FUNCTION update_dashboard_timestamp();

-- ============================================================================
-- 10. ANALYTICS QUERY: MOST VIEWED ITEMS TODAY
-- ============================================================================

CREATE OR REPLACE VIEW public.v_trending_today AS
SELECT 
  ua.item_type,
  ua.item_id,
  COUNT(*) as view_count,
  DATE(ua.created_at) as view_date
FROM public.user_activity ua
WHERE ua.activity_type = 'view'
  AND ua.created_at >= CURRENT_DATE
  AND ua.created_at < CURRENT_DATE + INTERVAL '1 day'
GROUP BY ua.item_type, ua.item_id, DATE(ua.created_at)
ORDER BY view_count DESC;

-- ============================================================================
-- 11. ANALYTICS QUERY: USER ENGAGEMENT STATS
-- ============================================================================

CREATE OR REPLACE VIEW public.v_user_engagement AS
SELECT 
  ua.user_id,
  COUNT(DISTINCT DATE(ua.created_at)) as days_active,
  COUNT(*) as total_interactions,
  COUNT(DISTINCT CASE WHEN ua.activity_type = 'view' THEN ua.item_id END) as items_viewed,
  COUNT(DISTINCT CASE WHEN ua.activity_type = 'click' THEN ua.item_id END) as items_clicked,
  MAX(ua.created_at) as last_active
FROM public.user_activity ua
GROUP BY ua.user_id;

-- ============================================================================
-- SAMPLE QUERIES FOR LANDING PAGE
-- ============================================================================

-- Get global top 20 projects and resources combined
-- SELECT * FROM public.v_popular_projects UNION ALL SELECT * FROM public.v_popular_resources LIMIT 20;

-- Get user's top items
-- SELECT * FROM get_user_top_items('user-id-here', 20);

-- Get user's dashboard configuration
-- SELECT * FROM public.user_dashboard_config WHERE user_id = 'user-id-here';

-- Log user activity (call from frontend)
-- SELECT log_user_activity('user-id', 'view', 'project', 'project-id-here');

-- ============================================================================
-- END OF ANALYTICS MIGRATION
-- ============================================================================
