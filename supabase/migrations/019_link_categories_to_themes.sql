/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/migrations/011_link_categories_to_themes.sql
 * Description: Add theme_id foreign key to wiki_categories table
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-17
 *
 * Purpose:
 * - Link categories to theme groups via foreign key relationship
 * - Enable dynamic theme-based category filtering
 * - Replace slug-based matching with proper database relationships
 */

-- Add theme_id column to wiki_categories table
ALTER TABLE public.wiki_categories
ADD COLUMN IF NOT EXISTS theme_id UUID REFERENCES public.wiki_theme_groups(id) ON DELETE SET NULL;

-- Add comment to new column
COMMENT ON COLUMN public.wiki_categories.theme_id IS 'Foreign key to wiki_theme_groups - organizes categories into themes';

-- Index for theme lookups (used in groupCategoriesByTheme function)
CREATE INDEX IF NOT EXISTS idx_wiki_categories_theme ON public.wiki_categories(theme_id);

-- Note: Existing categories will have NULL theme_id until seed data links them to themes
-- See seed file: 013_link_categories_to_themes.sql
