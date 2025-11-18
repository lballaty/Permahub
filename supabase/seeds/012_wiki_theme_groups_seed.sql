/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/seeds/012_wiki_theme_groups_seed.sql
 * Description: Seed data for 15 wiki theme groups (replaces hardcoded JavaScript definitions)
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-17
 *
 * Purpose:
 * - Populate wiki_theme_groups with 15 theme definitions
 * - These themes were previously hardcoded in wiki-home.js and wiki-guides.js
 * - Theme names are in English; translations happen via i18n keys: wiki.themes.{slug}
 */

-- Insert 15 theme groups
INSERT INTO public.wiki_theme_groups (name, slug, icon, description, sort_order, is_active) VALUES
  (
    'Animal Husbandry & Livestock',
    'animal-husbandry-livestock',
    '🐓',
    'Raising animals and beekeeping for sustainable food production',
    1,
    true
  ),
  (
    'Food Preservation & Storage',
    'food-preservation-storage',
    '🫙',
    'Preserving and storing food for year-round nutrition',
    2,
    true
  ),
  (
    'Water Management Systems',
    'water-management-systems',
    '💧',
    'Water harvesting, storage, and sustainable management',
    3,
    true
  ),
  (
    'Soil Building & Fertility',
    'soil-building-fertility',
    '🌱',
    'Composting, vermicomposting, and soil health practices',
    4,
    true
  ),
  (
    'Agroforestry & Trees',
    'agroforestry-trees',
    '🌳',
    'Food forests, tree guilds, and perennial polycultures',
    5,
    true
  ),
  (
    'Garden Design & Planning',
    'garden-design-planning',
    '📐',
    'Garden layout, zone planning, and design principles',
    6,
    true
  ),
  (
    'Natural Building',
    'natural-building',
    '🏘️',
    'Cob, straw bale, earthbag, and sustainable construction',
    7,
    true
  ),
  (
    'Renewable Energy',
    'renewable-energy',
    '⚡',
    'Solar power, biogas, micro-hydro, and energy systems',
    8,
    true
  ),
  (
    'Seed Saving & Propagation',
    'seed-saving-propagation',
    '🌾',
    'Seed saving, plant propagation, and biodiversity',
    9,
    true
  ),
  (
    'Forest Gardening',
    'forest-gardening',
    '🌲',
    'Forest gardens, edible landscaping, and perennial systems',
    10,
    true
  ),
  (
    'Ecosystem Management',
    'ecosystem-management',
    '🦋',
    'Beneficial insects, habitat creation, and ecosystem health',
    11,
    true
  ),
  (
    'Soil Regeneration',
    'soil-regeneration',
    '🌿',
    'Cover crops, green manures, and regenerative agriculture',
    12,
    true
  ),
  (
    'Community & Education',
    'community-education',
    '👥',
    'Community gardens, teaching, and knowledge sharing',
    13,
    true
  ),
  (
    'Waste & Resource Cycling',
    'waste-resource-cycling',
    '♻️',
    'Greywater systems, humanure, and resource cycling',
    14,
    true
  ),
  (
    'Specialized Techniques',
    'specialized-techniques',
    '🔬',
    'Mushrooms, aquaponics, mycoremediation, and advanced methods',
    15,
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- Verify themes were inserted
DO $$
DECLARE
  theme_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO theme_count FROM public.wiki_theme_groups;
  RAISE NOTICE 'Successfully seeded % theme groups', theme_count;
END $$;
