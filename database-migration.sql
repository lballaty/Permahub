-- ============================================================================
-- Permaculture Network Platform - SQL Migration
-- Database: PostgreSQL via Supabase
-- Version: 1.0
-- Created: January 2025
-- ============================================================================
-- Copy this entire file and paste into Supabase SQL Editor to create all tables
-- ============================================================================

-- ============================================================================
-- 1. ENABLE EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "earth" CASCADE;

-- ============================================================================
-- 2. USERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  country TEXT,
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  interests TEXT[] DEFAULT ARRAY[]::TEXT[],
  looking_for TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_public_profile BOOLEAN DEFAULT true,
  website TEXT,
  social_media JSONB DEFAULT '{}',
  profile_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster location-based queries
CREATE INDEX IF NOT EXISTS idx_users_location ON public.users USING GIST (ll_to_earth(latitude, longitude));
CREATE INDEX IF NOT EXISTS idx_users_public ON public.users(is_public_profile);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at DESC);

-- ============================================================================
-- 3. PROJECTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  project_type TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  region TEXT,
  country TEXT DEFAULT 'Portugal',
  plants_species TEXT[] DEFAULT ARRAY[]::TEXT[],
  techniques TEXT[] DEFAULT ARRAY[]::TEXT[],
  ecological_focus TEXT[] DEFAULT ARRAY[]::TEXT[],
  image_url TEXT,
  gallery_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  founded_year INTEGER,
  status TEXT DEFAULT 'active',
  contact_email TEXT,
  website TEXT,
  social_media JSONB DEFAULT '{}',
  open_to_visitors BOOLEAN DEFAULT true,
  visitor_info TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified BOOLEAN DEFAULT false
);

-- Create indexes for projects
CREATE INDEX IF NOT EXISTS idx_projects_location ON public.projects USING GIST (ll_to_earth(latitude, longitude));
CREATE INDEX IF NOT EXISTS idx_projects_type ON public.projects(project_type);
CREATE INDEX IF NOT EXISTS idx_projects_country ON public.projects(country);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON public.projects(created_by);

-- ============================================================================
-- 4. RESOURCE CATEGORIES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.resource_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category_type TEXT NOT NULL,
  parent_category_id UUID REFERENCES public.resource_categories(id) ON DELETE CASCADE,
  icon_emoji TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for category lookups
CREATE INDEX IF NOT EXISTS idx_resource_categories_type ON public.resource_categories(category_type);
CREATE INDEX IF NOT EXISTS idx_resource_categories_parent ON public.resource_categories(parent_category_id);

-- ============================================================================
-- 5. RESOURCES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL,
  category_id UUID REFERENCES public.resource_categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES public.resource_categories(id) ON DELETE SET NULL,
  price DECIMAL(10, 2),
  currency TEXT,
  provider_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  provider_name TEXT,
  provider_contact TEXT,
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  country TEXT,
  availability TEXT DEFAULT 'available',
  image_url TEXT,
  gallery_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  website TEXT,
  contact_email TEXT,
  phone_number TEXT,
  hours_of_operation TEXT,
  delivery_available BOOLEAN DEFAULT false,
  delivery_radius_km DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified BOOLEAN DEFAULT false
);

-- Create indexes for resources
CREATE INDEX IF NOT EXISTS idx_resources_type ON public.resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category_id);
CREATE INDEX IF NOT EXISTS idx_resources_subcategory ON public.resources(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_resources_location ON public.resources USING GIST (ll_to_earth(latitude, longitude));
CREATE INDEX IF NOT EXISTS idx_resources_availability ON public.resources(availability);
CREATE INDEX IF NOT EXISTS idx_resources_provider ON public.resources(provider_id);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON public.resources(created_at DESC);

-- ============================================================================
-- 6. PROJECT-USER CONNECTIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.project_user_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, user_id)
);

-- Create indexes for connections
CREATE INDEX IF NOT EXISTS idx_project_user_connections_project ON public.project_user_connections(project_id);
CREATE INDEX IF NOT EXISTS idx_project_user_connections_user ON public.project_user_connections(user_id);

-- ============================================================================
-- 7. FAVORITES/BOOKMARKS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (
    (project_id IS NOT NULL AND resource_id IS NULL) OR
    (project_id IS NULL AND resource_id IS NOT NULL)
  )
);

-- Create indexes for favorites
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_project ON public.favorites(project_id);
CREATE INDEX IF NOT EXISTS idx_favorites_resource ON public.favorites(resource_id);

-- ============================================================================
-- 8. TAGS/CATEGORIES REFERENCE TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_type TEXT NOT NULL,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for tags
CREATE INDEX IF NOT EXISTS idx_tags_category_type ON public.tags(category_type);

-- ============================================================================
-- 9. INSERT DEFAULT TAGS
-- ============================================================================

INSERT INTO public.tags (category_type, name, description, display_order) VALUES
-- Project Types
('project_type', 'Permaculture', 'Permanent agriculture and culture design', 1),
('project_type', 'Agroforestry', 'Integration of trees and crops', 2),
('project_type', 'Aquaponics', 'Fish and plant symbiotic systems', 3),
('project_type', 'Regenerative Agriculture', 'Soil-building farming practices', 4),
('project_type', 'Circular Economy', 'Zero-waste economic models', 5),
('project_type', 'Community Garden', 'Shared urban or peri-urban growing space', 6),

-- Techniques
('technique', 'Composting', 'Organic waste transformation', 1),
('technique', 'Mulching', 'Surface soil protection', 2),
('technique', 'Water Harvesting', 'Collection and storage of rainwater', 3),
('technique', 'Guild Planting', 'Companion plant communities', 4),
('technique', 'Seed Saving', 'Propagation and preservation', 5),
('technique', 'Crop Rotation', 'Systematic plant succession', 6),

-- Skills
('skill', 'Permaculture Design', 'Designing sustainable systems', 1),
('skill', 'Seed Saving', 'Collecting and preserving seeds', 2),
('skill', 'Composting', 'Organic matter management', 3),
('skill', 'Carpentry', 'Building and woodworking', 4),
('skill', 'Teaching/Facilitation', 'Educational leadership', 5),
('skill', 'Project Management', 'Organization and coordination', 6),

-- Ecological Focus
('focus', 'Soil Health', 'Building and maintaining fertile soil', 1),
('focus', 'Water Management', 'Efficient water use and storage', 2),
('focus', 'Biodiversity', 'Supporting diverse ecosystems', 3),
('focus', 'Carbon Sequestration', 'Climate action through soil', 4),
('focus', 'Native Species', 'Local flora and fauna support', 5),

-- Resource Categories
('resource_category', 'Seeds', 'Plant seeds and propagation materials', 1),
('resource_category', 'Tools', 'Hand and power tools', 2),
('resource_category', 'Materials', 'Building and composting materials', 3),
('resource_category', 'Services', 'Professional services and consulting', 4),
('resource_category', 'Information', 'Books, guides, and educational resources', 5),
('resource_category', 'Events', 'Workshops, courses, and gatherings', 6)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 10. INSERT DEFAULT RESOURCE CATEGORIES
-- ============================================================================

INSERT INTO public.resource_categories (name, description, category_type, icon_emoji, display_order) VALUES
-- Plant-related categories
('Native Seeds', 'Seeds from local plant species', 'plant', '🌱', 1),
('Heirloom Seeds', 'Traditional plant varieties', 'plant', '🌾', 2),
('Perennial Plants', 'Long-lived plant specimens', 'plant', '🌳', 3),
('Fruit & Nut Trees', 'Productive tree species', 'plant', '🌲', 4),
('Herb & Medicinal Plants', 'Culinary and medicinal varieties', 'plant', '🌿', 5),

-- Tool categories
('Hand Tools', 'Manual gardening implements', 'tool', '🛠️', 1),
('Power Tools', 'Motorized equipment', 'tool', '⚙️', 2),
('Water Systems', 'Irrigation and water management', 'tool', '💧', 3),
('Composting Equipment', 'Compost bins and systems', 'tool', '♻️', 4),

-- Material categories
('Soil Amendments', 'Compost, mulch, and fertilizers', 'material', '🪨', 1),
('Building Materials', 'Wood, stone, and construction supplies', 'material', '🏗️', 2),
('Mulch & Ground Cover', 'Surface protection materials', 'material', '🍃', 3),

-- Service categories
('Design Consulting', 'Professional design services', 'service', '📐', 1),
('Installation Services', 'Professional installation', 'service', '👷', 2),
('Maintenance Services', 'Ongoing project care', 'service', '🔧', 3),
('Educational Services', 'Training and workshops', 'service', '📚', 4),

-- Information categories
('Books & Guides', 'Printed and digital publications', 'information', '📖', 1),
('Online Courses', 'Digital learning resources', 'information', '💻', 2),
('Video Tutorials', 'Visual learning materials', 'information', '🎥', 3),
('Research Papers', 'Scientific and technical articles', 'information', '📄', 4),

-- Event categories
('Workshops', 'Hands-on learning events', 'event', '🎓', 1),
('Farm Visits', 'Tours and farm visitations', 'event', '👥', 2),
('Conferences', 'Large-scale gatherings', 'event', '📢', 3),
('Networking Events', 'Community connection events', 'event', '🤝', 4)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Users Table Policies
-- ============================================================================

-- Allow anyone to view public profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.users
  FOR SELECT
  USING (is_public_profile = true);

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow authenticated users to insert their profile
CREATE POLICY "Authenticated users can insert their profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- Projects Table Policies
-- ============================================================================

-- Allow everyone to view active projects
CREATE POLICY "Active projects are viewable by everyone"
  ON public.projects
  FOR SELECT
  USING (status = 'active');

-- Allow users to view their own projects
CREATE POLICY "Users can view their own projects"
  ON public.projects
  FOR SELECT
  USING (auth.uid() = created_by);

-- Allow authenticated users to create projects
CREATE POLICY "Authenticated users can create projects"
  ON public.projects
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Allow users to update their own projects
CREATE POLICY "Users can update their own projects"
  ON public.projects
  FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Allow users to delete their own projects
CREATE POLICY "Users can delete their own projects"
  ON public.projects
  FOR DELETE
  USING (auth.uid() = created_by);

-- ============================================================================
-- Resources Table Policies
-- ============================================================================

-- Allow everyone to view available resources
CREATE POLICY "Available resources are viewable by everyone"
  ON public.resources
  FOR SELECT
  USING (availability != 'archived');

-- Allow users to view their own resources
CREATE POLICY "Users can view their own resources"
  ON public.resources
  FOR SELECT
  USING (auth.uid() = created_by);

-- Allow authenticated users to create resources
CREATE POLICY "Authenticated users can create resources"
  ON public.resources
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Allow users to update their own resources
CREATE POLICY "Users can update their own resources"
  ON public.resources
  FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Allow users to delete their own resources
CREATE POLICY "Users can delete their own resources"
  ON public.resources
  FOR DELETE
  USING (auth.uid() = created_by);

-- ============================================================================
-- Project-User Connections Policies
-- ============================================================================

-- Everyone can view project connections
CREATE POLICY "Project connections are viewable by everyone"
  ON public.project_user_connections
  FOR SELECT
  USING (true);

-- Users can create project connections
CREATE POLICY "Users can create project connections"
  ON public.project_user_connections
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT created_by FROM public.projects WHERE id = project_id
    ) OR auth.uid() = user_id
  );

-- Users can delete their own project connections
CREATE POLICY "Users can delete own project connections"
  ON public.project_user_connections
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT created_by FROM public.projects WHERE id = project_id
    ) OR auth.uid() = user_id
  );

-- ============================================================================
-- Favorites Table Policies
-- ============================================================================

-- Users can only view their own favorites
CREATE POLICY "Users can view their own favorites"
  ON public.favorites
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own favorites
CREATE POLICY "Users can create their own favorites"
  ON public.favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete their own favorites"
  ON public.favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 12. HELPER FUNCTIONS
-- ============================================================================

-- Function to search projects by distance
CREATE OR REPLACE FUNCTION search_projects_nearby(
  user_lat DECIMAL,
  user_lon DECIMAL,
  distance_km DECIMAL DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  region TEXT,
  distance_km NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.region,
    ROUND((earth_distance(ll_to_earth(user_lat, user_lon), ll_to_earth(p.latitude, p.longitude)) / 1000)::NUMERIC, 2) as distance_km
  FROM public.projects p
  WHERE p.status = 'active'
    AND p.latitude IS NOT NULL
    AND p.longitude IS NOT NULL
    AND earth_distance(ll_to_earth(user_lat, user_lon), ll_to_earth(p.latitude, p.longitude)) < (distance_km * 1000)
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;

-- Function to search resources by distance
CREATE OR REPLACE FUNCTION search_resources_nearby(
  user_lat DECIMAL,
  user_lon DECIMAL,
  distance_km DECIMAL DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  location TEXT,
  distance_km NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.title,
    r.location,
    ROUND((earth_distance(ll_to_earth(user_lat, user_lon), ll_to_earth(r.latitude, r.longitude)) / 1000)::NUMERIC, 2) as distance_km
  FROM public.resources r
  WHERE r.availability != 'archived'
    AND r.latitude IS NOT NULL
    AND r.longitude IS NOT NULL
    AND earth_distance(ll_to_earth(user_lat, user_lon), ll_to_earth(r.latitude, r.longitude)) < (distance_km * 1000)
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 13. SAMPLE DATA (OPTIONAL - Comment out if you don't want this)
-- ============================================================================

-- Sample project (requires valid user ID - replace 'your-user-id' with actual UUID)
-- INSERT INTO public.projects (
--   name, description, project_type, latitude, longitude, region, country,
--   plants_species, techniques, ecological_focus, founded_year, status,
--   contact_email, open_to_visitors, created_by
-- ) VALUES (
--   'Example Permaculture Project',
--   'A demonstration permaculture site in Madeira',
--   'permaculture',
--   32.7546, -17.0031,
--   'Funchal', 'Portugal',
--   ARRAY['chestnut', 'banana', 'avocado'],
--   ARRAY['agroforestry', 'water-harvesting', 'composting'],
--   ARRAY['soil-health', 'biodiversity', 'water-management'],
--   2020,
--   'active',
--   'info@example.com',
--   true,
--   'your-user-id'::uuid
-- );

-- ============================================================================
-- 14. VIEWS (Optional - for easier data retrieval)
-- ============================================================================

-- Create view for active projects with creator info
CREATE OR REPLACE VIEW public.v_active_projects AS
SELECT 
  p.id,
  p.name,
  p.description,
  p.project_type,
  p.latitude,
  p.longitude,
  p.region,
  p.country,
  p.contact_email,
  p.website,
  p.open_to_visitors,
  u.full_name as creator_name,
  u.email as creator_email,
  p.created_at,
  ARRAY_LENGTH(p.techniques, 1) as technique_count,
  ARRAY_LENGTH(p.plants_species, 1) as plant_count
FROM public.projects p
LEFT JOIN public.users u ON p.created_by = u.id
WHERE p.status = 'active'
ORDER BY p.created_at DESC;

-- Create view for available resources with provider info
CREATE OR REPLACE VIEW public.v_available_resources AS
SELECT 
  r.id,
  r.title,
  r.description,
  r.resource_type,
  r.price,
  r.currency,
  r.location,
  r.latitude,
  r.longitude,
  r.availability,
  r.delivery_available,
  u.full_name as provider_name,
  u.email as provider_email,
  rc.name as category_name,
  r.created_at
FROM public.resources r
LEFT JOIN public.users u ON r.provider_id = u.id
LEFT JOIN public.resource_categories rc ON r.category_id = rc.id
WHERE r.availability != 'archived'
ORDER BY r.created_at DESC;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
-- All tables, indexes, RLS policies, and functions have been created
-- Your database is now ready for the Permaculture Network application
-- ============================================================================
