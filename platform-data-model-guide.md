# Permaculture & Circular Economy Platform
## Data Model & Setup Guide

---

## 1. Project Overview

**Project Name:** Global Permaculture & Circular Economy Network  
**Initial Scope:** Madeira, Portugal (expandable globally)  
**Tech Stack:**
- Frontend: Vanilla HTML/CSS/JavaScript
- Backend: Supabase (PostgreSQL)
- Database: Local Supabase (Docker) for development, cloud Supabase for production
- Maps: Leaflet.js for location visualization

**Primary Features:**
- Project discovery and filtering
- Community member profiles
- Resource marketplace/directory
- Geographic search
- Real-time data updates

---

## 2. Data Model & Database Schema

### 2.1 Projects Table

**Table Name:** `projects`

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  project_type TEXT, -- 'permaculture', 'aquaponics', 'agroforestry', 'circular-economy', 'regenerative-agriculture', etc.
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  region TEXT, -- 'Funchal', 'Santa Cruz', 'Machico', etc. (Madeira parishes)
  country TEXT DEFAULT 'Portugal',
  plants_species TEXT[] DEFAULT ARRAY[]::TEXT[], -- ['tomato', 'bean', 'native-fern', etc.]
  techniques TEXT[] DEFAULT ARRAY[]::TEXT[], -- ['guilds', 'mulching', 'composting', 'water-harvesting', etc.]
  ecological_focus TEXT[] DEFAULT ARRAY[]::TEXT[], -- ['soil-health', 'water-management', 'biodiversity', 'carbon-sequestration']
  image_url TEXT,
  gallery_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  founded_year INTEGER,
  status TEXT DEFAULT 'active', -- 'active', 'planned', 'archived'
  contact_email TEXT,
  website TEXT,
  social_media JSONB DEFAULT '{}', -- {instagram: 'handle', facebook: 'url', youtube: 'url'}
  open_to_visitors BOOLEAN DEFAULT true,
  visitor_info TEXT, -- Visiting guidelines, hours, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified BOOLEAN DEFAULT false
);

CREATE INDEX idx_projects_location ON projects USING GIST (ll_to_earth(latitude, longitude));
CREATE INDEX idx_projects_type ON projects(project_type);
CREATE INDEX idx_projects_country ON projects(country);
CREATE INDEX idx_projects_status ON projects(status);
```

---

### 2.2 Users Table

**Table Name:** `users`

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  location TEXT, -- City/region
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  country TEXT,
  skills TEXT[] DEFAULT ARRAY[]::TEXT[], -- ['permaculture-design', 'seed-saving', 'composting', 'carpentry', etc.]
  interests TEXT[] DEFAULT ARRAY[]::TEXT[], -- ['agroforestry', 'water-systems', 'community-building', etc.]
  looking_for TEXT[] DEFAULT ARRAY[]::TEXT[], -- ['collaboration', 'mentorship', 'employment', 'learning', etc.]
  is_public_profile BOOLEAN DEFAULT true,
  website TEXT,
  social_media JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_location ON users USING GIST (ll_to_earth(latitude, longitude));
CREATE INDEX idx_users_public ON users(is_public_profile);
```

---

### 2.3 Resources Table

**Table Name:** `resources`

```sql
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL, -- 'seeds', 'tools', 'service', 'knowledge', 'event'
  category TEXT, -- 'native-seeds', 'composting-tools', 'design-consulting', 'workshop', etc.
  price DECIMAL(10, 2), -- NULL for free resources
  currency TEXT, -- 'EUR', 'USD'
  provider_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider_name TEXT, -- For non-user providers
  provider_contact TEXT, -- Email or website for non-user providers
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  country TEXT,
  availability TEXT DEFAULT 'available', -- 'available', 'seasonal', 'on-demand', 'sold-out'
  image_url TEXT,
  gallery_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  tags TEXT[] DEFAULT ARRAY[]::TEXT[], -- ['permaculture', 'madeira', 'native-plants', 'seeds']
  website TEXT,
  contact_email TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified BOOLEAN DEFAULT false
);

CREATE INDEX idx_resources_type ON resources(resource_type);
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_location ON resources USING GIST (ll_to_earth(latitude, longitude));
```

---

### 2.4 Project-User Connections Table

**Table Name:** `project_user_connections`

```sql
CREATE TABLE project_user_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'founder', 'contributor', 'volunteer', 'mentor', 'partner'
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, user_id)
);

CREATE INDEX idx_project_user_connections_project ON project_user_connections(project_id);
CREATE INDEX idx_project_user_connections_user ON project_user_connections(user_id);
```

---

### 2.5 Tags/Categories Reference Table

**Table Name:** `tags`

```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_type TEXT NOT NULL, -- 'project_type', 'technique', 'skill', 'focus', 'resource_category'
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT, -- URL to an icon/emoji
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tags (category_type, name, description, display_order) VALUES
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
('resource_category', 'Native Seeds', 'Locally adapted seeds', 1),
('resource_category', 'Heirloom Seeds', 'Traditional plant varieties', 2),
('resource_category', 'Tools', 'Hand and power tools', 3),
('resource_category', 'Composting Materials', 'Carbon, nitrogen sources', 4),
('resource_category', 'Design Consulting', 'Professional design services', 5),
('resource_category', 'Workshops', 'Educational events', 6);
```

---

### 2.6 Favorites/Bookmarks Table (Optional)

**Table Name:** `favorites`

```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (
    (project_id IS NOT NULL AND resource_id IS NULL) OR
    (project_id IS NULL AND resource_id IS NOT NULL)
  )
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
```

---

## 3. Setting Up Local Supabase

### 3.1 Prerequisites

- Docker & Docker Compose installed
- Git
- Node.js (optional, but useful for Supabase CLI)

### 3.2 Installation Steps

**1. Install Supabase CLI**
```bash
npm install -g supabase
```

**2. Create project directory and initialize Supabase**
```bash
mkdir permaculture-platform
cd permaculture-platform
supabase init
```

**3. Start local Supabase stack**
```bash
supabase start
```

This will:
- Start PostgreSQL database
- Start Supabase Studio (web interface at http://localhost:3000)
- Generate anonymous and service role keys
- Create local configuration

**4. Access Supabase Studio**
- Open http://localhost:3000/
- Default email: supabase@example.com
- Default password: password

### 3.3 Creating Tables

**Option A: Using SQL Editor in Supabase Studio**
1. Go to SQL Editor in the left sidebar
2. Create a new query
3. Copy and paste the SQL schema from section 2 above
4. Run each table creation

**Option B: Using Supabase Migrations**
Create a migration file:
```bash
supabase migration new create_initial_schema
```

Edit the generated file in `supabase/migrations/` and add all the table creation SQL.

Then run:
```bash
supabase db push
```

### 3.4 Environment Configuration

Create a `.env.local` file in your project root:

```
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-anon-key-from-supabase-studio
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get these keys from Supabase Studio > Settings > API

---

## 4. Sample Data (Optional)

For testing, you can insert sample projects:

```sql
INSERT INTO projects (
  name, description, project_type, latitude, longitude, 
  region, country, plants_species, techniques, ecological_focus,
  founded_year, status, contact_email, open_to_visitors
) VALUES (
  'Monte Verde Permaculture',
  'A 5-hectare permaculture demonstration site focusing on agroforestry and water management.',
  'permaculture',
  32.7546,
  -17.0031,
  'Funchal',
  'Portugal',
  ARRAY['chestnut', 'banana', 'avocado', 'native-fern']::TEXT[],
  ARRAY['agroforestry', 'water-harvesting', 'composting']::TEXT[],
  ARRAY['soil-health', 'biodiversity', 'water-management']::TEXT[],
  2018,
  'active',
  'contact@monteverde.pt',
  true
);
```

---

## 5. Database Utilities & Functions (Optional)

### Geospatial Helper Function

For distance-based searches:

```sql
CREATE OR REPLACE FUNCTION nearby_projects(
  user_lat DECIMAL,
  user_lon DECIMAL,
  distance_km DECIMAL
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  distance_km DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    earth_distance(ll_to_earth(user_lat, user_lon), ll_to_earth(p.latitude, p.longitude)) / 1000 as distance_km
  FROM projects p
  WHERE earth_distance(ll_to_earth(user_lat, user_lon), ll_to_earth(p.latitude, p.longitude)) < (distance_km * 1000)
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;
```

---

## 6. Frontend Integration Points

### API Endpoints You'll Need

**Supabase will automatically generate REST endpoints:**

- `GET /rest/v1/projects` - List projects
- `GET /rest/v1/projects?select=*` - With filtering
- `GET /rest/v1/users?select=*` - List users
- `GET /rest/v1/resources?select=*` - List resources
- `POST /rest/v1/projects` - Create project
- `UPDATE /rest/v1/projects` - Update project
- `DELETE /rest/v1/projects` - Delete project

**Real-time subscriptions:**
- Listen to project changes with WebSockets
- Listen to resource updates
- User profile changes

---

## 7. Security Considerations

### Row Level Security (RLS) Policies

Enable RLS on all tables:

```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Example: Users can read all public profiles
CREATE POLICY "Users can read public profiles"
  ON users
  FOR SELECT
  USING (is_public_profile = true OR auth.uid() = id);

-- Example: Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

### Authentication

- Use Supabase Auth for user management
- Store user ID from auth.users in your users table
- Enforce RLS policies for data access

---

## 8. Next Steps

1. ✓ Confirm data model (modifications needed?)
2. ✓ Set up local Supabase
3. ✓ Create tables and initial schema
4. → Build frontend prototype
5. → Implement search/filtering
6. → Add authentication flow
7. → Deploy to Supabase cloud

---

## 9. Useful Resources

- **Supabase Docs:** https://supabase.com/docs
- **PostGIS Documentation:** https://postgis.net/docs/
- **Supabase CLI:** https://supabase.com/docs/guides/cli
- **Local Development:** https://supabase.com/docs/guides/local-development

