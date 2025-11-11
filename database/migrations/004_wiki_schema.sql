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
