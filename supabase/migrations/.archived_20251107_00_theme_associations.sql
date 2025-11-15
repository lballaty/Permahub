-- ============================================================================
-- Theme Associations Migration
-- Permaculture Network Platform
-- Created: 2025-11-07
-- Purpose: Link existing tables to eco-themes system
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
-- 4. UPDATE ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Projects: Users can filter by eco_theme
-- (RLS policies already exist, this just adds the capability)
-- No new RLS policy needed - existing policies already allow viewing active projects

-- Resources: Users can filter by eco_theme
-- (RLS policies already exist, this just adds the capability)
-- No new RLS policy needed - existing policies already allow viewing active resources

-- ============================================================================
-- 5. HELPER FUNCTION: Get projects by eco_theme
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
-- 6. HELPER FUNCTION: Get resources by eco_theme
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
-- 7. HELPER FUNCTION: Get theme statistics
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
-- END OF THEME ASSOCIATIONS MIGRATION
-- ============================================================================
-- Projects, Resources, and Users tables are now linked to eco-themes
-- Helper functions are available for querying by theme
-- ============================================================================
