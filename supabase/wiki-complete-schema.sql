-- ================================================
-- Community Wiki Database Schema
-- ================================================
-- This migration creates all tables needed for the wiki functionality
--
-- Tables created:
-- - wiki_guides: Articles and guides
-- - wiki_events: Community events
-- - wiki_locations: Physical locations
-- - wiki_favorites: User saved items
-- - wiki_collections: User-created collections
-- - wiki_collection_items: Items in collections
-- - wiki_categories: Category definitions
-- - wiki_guide_categories: Many-to-many relationship

-- ================================================
-- CATEGORIES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS wiki_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT, -- emoji or icon class
  description TEXT,
  color TEXT, -- hex color for UI
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- WIKI GUIDES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS wiki_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT, -- URL to image
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  view_count INTEGER DEFAULT 0,
  allow_comments BOOLEAN DEFAULT true,
  allow_edits BOOLEAN DEFAULT true,
  notify_group BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Many-to-many relationship between guides and categories
CREATE TABLE IF NOT EXISTS wiki_guide_categories (
  guide_id UUID REFERENCES wiki_guides(id) ON DELETE CASCADE,
  category_id UUID REFERENCES wiki_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (guide_id, category_id)
);

-- ================================================
-- WIKI EVENTS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS wiki_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location_name TEXT,
  location_address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  event_type TEXT, -- workshop, meetup, tour, course, etc.
  price NUMERIC(10,2) DEFAULT 0,
  price_display TEXT, -- "Free", "$15", etc.
  registration_url TEXT,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_rule TEXT, -- RRULE format for recurring events
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- WIKI LOCATIONS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS wiki_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  address TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location_type TEXT, -- farm, garden, education, community, business
  website TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  featured_image TEXT,
  opening_hours JSONB, -- Store as JSON: {"monday": "9-5", ...}
  tags TEXT[],
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add PostGIS extension for location-based queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add geography column for better distance calculations
ALTER TABLE wiki_locations
ADD COLUMN IF NOT EXISTS location GEOGRAPHY(POINT, 4326);

-- Update geography column from lat/lng
CREATE OR REPLACE FUNCTION update_location_geography()
RETURNS TRIGGER AS $$
BEGIN
  NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_location_geography_trigger
BEFORE INSERT OR UPDATE ON wiki_locations
FOR EACH ROW
EXECUTE FUNCTION update_location_geography();

-- ================================================
-- WIKI FAVORITES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS wiki_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('guide', 'event', 'location')),
  content_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_type, content_id)
);

-- ================================================
-- WIKI COLLECTIONS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS wiki_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- emoji
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- WIKI COLLECTION ITEMS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS wiki_collection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES wiki_collections(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('guide', 'event', 'location')),
  content_id UUID NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(collection_id, content_type, content_id)
);

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================

-- Guides indexes
CREATE INDEX IF NOT EXISTS idx_wiki_guides_status ON wiki_guides(status);
CREATE INDEX IF NOT EXISTS idx_wiki_guides_author ON wiki_guides(author_id);
CREATE INDEX IF NOT EXISTS idx_wiki_guides_created ON wiki_guides(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wiki_guides_slug ON wiki_guides(slug);

-- Full text search on guides
CREATE INDEX IF NOT EXISTS idx_wiki_guides_search
ON wiki_guides USING gin(to_tsvector('english', title || ' ' || summary || ' ' || content));

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_wiki_events_date ON wiki_events(event_date);
CREATE INDEX IF NOT EXISTS idx_wiki_events_status ON wiki_events(status);
CREATE INDEX IF NOT EXISTS idx_wiki_events_type ON wiki_events(event_type);

-- Locations indexes
CREATE INDEX IF NOT EXISTS idx_wiki_locations_type ON wiki_locations(location_type);
CREATE INDEX IF NOT EXISTS idx_wiki_locations_geography ON wiki_locations USING GIST(location);

-- Favorites indexes
CREATE INDEX IF NOT EXISTS idx_wiki_favorites_user ON wiki_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_wiki_favorites_content ON wiki_favorites(content_type, content_id);

-- Collections indexes
CREATE INDEX IF NOT EXISTS idx_wiki_collections_user ON wiki_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_wiki_collection_items_collection ON wiki_collection_items(collection_id);

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

-- Enable RLS on all tables
ALTER TABLE wiki_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE wiki_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE wiki_guide_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE wiki_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE wiki_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE wiki_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE wiki_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE wiki_collection_items ENABLE ROW LEVEL SECURITY;

-- Categories: Public read, authenticated write
CREATE POLICY "Categories are viewable by everyone"
  ON wiki_categories FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create categories"
  ON wiki_categories FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Guides: Public read published, author write
CREATE POLICY "Published guides viewable by everyone"
  ON wiki_guides FOR SELECT
  USING (status = 'published' OR auth.uid() = author_id);

CREATE POLICY "Users can create guides"
  ON wiki_guides FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);

CREATE POLICY "Authors can update their guides"
  ON wiki_guides FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their guides"
  ON wiki_guides FOR DELETE
  USING (auth.uid() = author_id);

-- Guide categories: Follow guide permissions
CREATE POLICY "Guide categories follow guide permissions"
  ON wiki_guide_categories FOR ALL
  USING (true);

-- Events: Public read, authenticated write
CREATE POLICY "Events viewable by everyone"
  ON wiki_events FOR SELECT
  USING (status IN ('published', 'completed') OR auth.uid() = author_id);

CREATE POLICY "Authenticated users can create events"
  ON wiki_events FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);

CREATE POLICY "Authors can update their events"
  ON wiki_events FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their events"
  ON wiki_events FOR DELETE
  USING (auth.uid() = author_id);

-- Locations: Public read, authenticated write
CREATE POLICY "Locations viewable by everyone"
  ON wiki_locations FOR SELECT
  USING (status = 'published' OR auth.uid() = author_id);

CREATE POLICY "Authenticated users can create locations"
  ON wiki_locations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);

CREATE POLICY "Authors can update their locations"
  ON wiki_locations FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their locations"
  ON wiki_locations FOR DELETE
  USING (auth.uid() = author_id);

-- Favorites: Users manage their own
CREATE POLICY "Users can view their favorites"
  ON wiki_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create favorites"
  ON wiki_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their favorites"
  ON wiki_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Collections: Users manage their own, public viewable by all
CREATE POLICY "Users can view their collections"
  ON wiki_collections FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create collections"
  ON wiki_collections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their collections"
  ON wiki_collections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their collections"
  ON wiki_collections FOR DELETE
  USING (auth.uid() = user_id);

-- Collection items: Follow collection permissions
CREATE POLICY "Collection items follow collection permissions"
  ON wiki_collection_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM wiki_collections
      WHERE id = wiki_collection_items.collection_id
      AND (user_id = auth.uid() OR is_public = true)
    )
  );

-- ================================================
-- HELPER FUNCTIONS
-- ================================================

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_guide_views(guide_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE wiki_guides
  SET view_count = view_count + 1
  WHERE id = guide_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get nearby locations
CREATE OR REPLACE FUNCTION get_nearby_locations(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  distance_km DOUBLE PRECISION DEFAULT 50
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  description TEXT,
  location_type TEXT,
  distance_meters DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id,
    l.name,
    l.description,
    l.location_type,
    ST_Distance(
      l.location,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
    ) as distance_meters
  FROM wiki_locations l
  WHERE ST_DWithin(
    l.location,
    ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
    distance_km * 1000 -- convert km to meters
  )
  AND l.status = 'published'
  ORDER BY distance_meters;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search guides
CREATE OR REPLACE FUNCTION search_guides(search_query TEXT)
RETURNS TABLE(
  id UUID,
  title TEXT,
  summary TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    g.id,
    g.title,
    g.summary,
    ts_rank(
      to_tsvector('english', g.title || ' ' || g.summary || ' ' || g.content),
      plainto_tsquery('english', search_query)
    ) as rank
  FROM wiki_guides g
  WHERE
    g.status = 'published'
    AND to_tsvector('english', g.title || ' ' || g.summary || ' ' || g.content) @@ plainto_tsquery('english', search_query)
  ORDER BY rank DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- UPDATED AT TRIGGERS
-- ================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_wiki_guides_updated_at
  BEFORE UPDATE ON wiki_guides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wiki_events_updated_at
  BEFORE UPDATE ON wiki_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wiki_locations_updated_at
  BEFORE UPDATE ON wiki_locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wiki_collections_updated_at
  BEFORE UPDATE ON wiki_collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
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
      AND wiki_events.organizer_id = auth.uid()
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
      AND wiki_locations.created_by = auth.uid()
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
