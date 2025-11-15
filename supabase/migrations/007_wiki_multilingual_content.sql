-- Migration: Add multilingual content support for Community Wiki
-- Description: Creates translation tables to store wiki content in multiple languages
-- Author: Claude
-- Date: 2025-11-11

-- ============================================================================
-- wiki_guide_translations: Store guide content in multiple languages
-- ============================================================================
CREATE TABLE IF NOT EXISTS wiki_guide_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL REFERENCES wiki_guides(id) ON DELETE CASCADE,
  language_code VARCHAR(5) NOT NULL, -- e.g., 'en', 'pt', 'es', 'fr', etc.
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one translation per language per guide
  UNIQUE(guide_id, language_code)
);

-- Index for fast language-based queries
CREATE INDEX idx_guide_translations_lang ON wiki_guide_translations(language_code);
CREATE INDEX idx_guide_translations_guide ON wiki_guide_translations(guide_id);

-- ============================================================================
-- wiki_event_translations: Store event content in multiple languages
-- ============================================================================
CREATE TABLE IF NOT EXISTS wiki_event_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES wiki_events(id) ON DELETE CASCADE,
  language_code VARCHAR(5) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(event_id, language_code)
);

CREATE INDEX idx_event_translations_lang ON wiki_event_translations(language_code);
CREATE INDEX idx_event_translations_event ON wiki_event_translations(event_id);

-- ============================================================================
-- wiki_location_translations: Store location content in multiple languages
-- ============================================================================
CREATE TABLE IF NOT EXISTS wiki_location_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES wiki_locations(id) ON DELETE CASCADE,
  language_code VARCHAR(5) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(location_id, language_code)
);

CREATE INDEX idx_location_translations_lang ON wiki_location_translations(language_code);
CREATE INDEX idx_location_translations_location ON wiki_location_translations(location_id);

-- ============================================================================
-- wiki_category_translations: Store category names in multiple languages
-- ============================================================================
CREATE TABLE IF NOT EXISTS wiki_category_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES wiki_categories(id) ON DELETE CASCADE,
  language_code VARCHAR(5) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(category_id, language_code)
);

CREATE INDEX idx_category_translations_lang ON wiki_category_translations(language_code);
CREATE INDEX idx_category_translations_category ON wiki_category_translations(category_id);

-- ============================================================================
-- RLS Policies: Translations follow same permissions as parent content
-- ============================================================================

-- Guide translations (public read, author can update)
ALTER TABLE wiki_guide_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guide translations are viewable by everyone"
  ON wiki_guide_translations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM wiki_guides
      WHERE wiki_guides.id = wiki_guide_translations.guide_id
      AND wiki_guides.status = 'published'
    )
  );

CREATE POLICY "Guide authors can insert translations"
  ON wiki_guide_translations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM wiki_guides
      WHERE wiki_guides.id = wiki_guide_translations.guide_id
      AND wiki_guides.author_id = auth.uid()
    )
  );

CREATE POLICY "Guide authors can update their translations"
  ON wiki_guide_translations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM wiki_guides
      WHERE wiki_guides.id = wiki_guide_translations.guide_id
      AND wiki_guides.author_id = auth.uid()
    )
  );

CREATE POLICY "Guide authors can delete their translations"
  ON wiki_guide_translations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM wiki_guides
      WHERE wiki_guides.id = wiki_guide_translations.guide_id
      AND wiki_guides.author_id = auth.uid()
    )
  );

-- Event translations (public read, owner can update)
ALTER TABLE wiki_event_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event translations are viewable by everyone"
  ON wiki_event_translations FOR SELECT
  USING (true);

CREATE POLICY "Event owners can manage translations"
  ON wiki_event_translations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM wiki_events
      WHERE wiki_events.id = wiki_event_translations.event_id
      AND wiki_events.author_id = auth.uid()
    )
  );

-- Location translations (public read, owner can update)
ALTER TABLE wiki_location_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Location translations are viewable by everyone"
  ON wiki_location_translations FOR SELECT
  USING (true);

CREATE POLICY "Location owners can manage translations"
  ON wiki_location_translations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM wiki_locations
      WHERE wiki_locations.id = wiki_location_translations.location_id
      AND wiki_locations.author_id = auth.uid()
    )
  );

-- Category translations (public read, admin only write)
ALTER TABLE wiki_category_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Category translations are viewable by everyone"
  ON wiki_category_translations FOR SELECT
  USING (true);

-- Admin management of category translations would go here
-- For now, managed via service role

-- ============================================================================
-- Helper Functions: Get content in specific language with fallback
-- ============================================================================

-- Get guide with translation in specified language (falls back to English)
CREATE OR REPLACE FUNCTION get_guide_with_translation(
  p_guide_id UUID,
  p_language_code VARCHAR(5) DEFAULT 'en'
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  author_id UUID,
  status TEXT,
  view_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  title TEXT,
  summary TEXT,
  content TEXT,
  language_code VARCHAR(5)
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    g.id,
    g.slug,
    g.author_id,
    g.status,
    g.view_count,
    g.created_at,
    g.updated_at,
    COALESCE(
      (SELECT t.title FROM wiki_guide_translations t
       WHERE t.guide_id = g.id AND t.language_code = p_language_code),
      (SELECT t.title FROM wiki_guide_translations t
       WHERE t.guide_id = g.id AND t.language_code = 'en' LIMIT 1),
      g.title
    ) as title,
    COALESCE(
      (SELECT t.summary FROM wiki_guide_translations t
       WHERE t.guide_id = g.id AND t.language_code = p_language_code),
      (SELECT t.summary FROM wiki_guide_translations t
       WHERE t.guide_id = g.id AND t.language_code = 'en' LIMIT 1),
      g.summary
    ) as summary,
    COALESCE(
      (SELECT t.content FROM wiki_guide_translations t
       WHERE t.guide_id = g.id AND t.language_code = p_language_code),
      (SELECT t.content FROM wiki_guide_translations t
       WHERE t.guide_id = g.id AND t.language_code = 'en' LIMIT 1),
      g.content
    ) as content,
    COALESCE(
      (SELECT t.language_code FROM wiki_guide_translations t
       WHERE t.guide_id = g.id AND t.language_code = p_language_code),
      (SELECT t.language_code FROM wiki_guide_translations t
       WHERE t.guide_id = g.id AND t.language_code = 'en' LIMIT 1),
      'en'
    ) as language_code
  FROM wiki_guides g
  WHERE g.id = p_guide_id;
END;
$$;

-- ============================================================================
-- Updated Triggers: Auto-update timestamps
-- ============================================================================

CREATE OR REPLACE FUNCTION update_translation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_guide_translation_updated_at
  BEFORE UPDATE ON wiki_guide_translations
  FOR EACH ROW
  EXECUTE FUNCTION update_translation_updated_at();

CREATE TRIGGER update_event_translation_updated_at
  BEFORE UPDATE ON wiki_event_translations
  FOR EACH ROW
  EXECUTE FUNCTION update_translation_updated_at();

CREATE TRIGGER update_location_translation_updated_at
  BEFORE UPDATE ON wiki_location_translations
  FOR EACH ROW
  EXECUTE FUNCTION update_translation_updated_at();

CREATE TRIGGER update_category_translation_updated_at
  BEFORE UPDATE ON wiki_category_translations
  FOR EACH ROW
  EXECUTE FUNCTION update_translation_updated_at();

-- ============================================================================
-- Comments for documentation
-- ============================================================================

COMMENT ON TABLE wiki_guide_translations IS 'Stores guide content in multiple languages. Falls back to English if requested language not available.';
COMMENT ON TABLE wiki_event_translations IS 'Stores event details in multiple languages.';
COMMENT ON TABLE wiki_location_translations IS 'Stores location information in multiple languages.';
COMMENT ON TABLE wiki_category_translations IS 'Stores category names and descriptions in multiple languages.';
COMMENT ON FUNCTION get_guide_with_translation IS 'Helper function to retrieve guide content in specified language with English fallback.';
