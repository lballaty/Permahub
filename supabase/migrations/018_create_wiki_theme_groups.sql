/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/migrations/010_create_wiki_theme_groups.sql
 * Description: Create wiki_theme_groups table to replace hardcoded theme definitions
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-17
 *
 * Purpose:
 * - Move theme groupings from JavaScript to database
 * - Enable admin configuration of themes without code changes
 * - Support proper i18n translation of theme names
 * - Make theme system scalable and maintainable
 */

-- Create wiki_theme_groups table
CREATE TABLE IF NOT EXISTS public.wiki_theme_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment to table
COMMENT ON TABLE public.wiki_theme_groups IS 'Theme groups for organizing wiki categories (replaces hardcoded JavaScript definitions)';

-- Add comments to columns
COMMENT ON COLUMN public.wiki_theme_groups.name IS 'Theme name (English default, translations via i18n)';
COMMENT ON COLUMN public.wiki_theme_groups.slug IS 'URL-safe identifier used for i18n keys (e.g., "animal-husbandry-livestock")';
COMMENT ON COLUMN public.wiki_theme_groups.icon IS 'Emoji or icon for visual representation';
COMMENT ON COLUMN public.wiki_theme_groups.description IS 'Optional description of theme';
COMMENT ON COLUMN public.wiki_theme_groups.sort_order IS 'Display order in dropdowns (lower = first)';
COMMENT ON COLUMN public.wiki_theme_groups.is_active IS 'Whether theme is visible to users';

-- Index for sorting themes
CREATE INDEX idx_wiki_theme_groups_sort ON public.wiki_theme_groups(sort_order);

-- Index for active themes lookup
CREATE INDEX idx_wiki_theme_groups_active ON public.wiki_theme_groups(is_active) WHERE is_active = true;

-- Index for slug lookup (for i18n key generation)
CREATE INDEX idx_wiki_theme_groups_slug ON public.wiki_theme_groups(slug);

-- Enable Row Level Security
ALTER TABLE public.wiki_theme_groups ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active theme groups (no authentication required)
CREATE POLICY "Anyone can view active theme groups"
  ON public.wiki_theme_groups
  FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated users can view all themes (including inactive, for admin)
CREATE POLICY "Authenticated users can view all theme groups"
  ON public.wiki_theme_groups
  FOR SELECT
  TO authenticated
  USING (true);

-- Note: Admin write policies will be added later when admin role system is implemented
-- For now, only service role (Supabase backend) can insert/update/delete themes

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to automatically update updated_at timestamp
CREATE TRIGGER update_wiki_theme_groups_updated_at
  BEFORE UPDATE ON public.wiki_theme_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
