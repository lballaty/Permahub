/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/migrations/004_expanded_categories.sql
 * Description: Adds expanded resource categories to broaden platform appeal to diverse sustainable living communities
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-14
 */

-- ============================================================================
-- EXPANDED RESOURCE CATEGORIES - TIER 1 (HIGH PRIORITY)
-- ============================================================================

-- Animal Husbandry & Small Livestock Category
INSERT INTO public.resource_categories (name, description, category_type, icon_emoji, display_order) VALUES
('Chickens & Poultry', 'Backyard chickens, ducks, geese, and fowl', 'animal', '🐓', 1),
('Beekeeping & Apiculture', 'Bee colonies, equipment, and honey production', 'animal', '🐝', 2),
('Rabbits & Small Mammals', 'Rabbits, guinea pigs, and small livestock', 'animal', '🐰', 3),
('Animal Feed & Supplies', 'Organic feed, supplements, and care products', 'animal', '🌾', 4),
('Coops, Hives & Housing', 'Animal shelters and housing systems', 'animal', '🏠', 5),
('Animal Healthcare', 'Natural veterinary care and health products', 'animal', '💊', 6)
ON CONFLICT (name) DO NOTHING;

-- Food Preservation & Storage Category
INSERT INTO public.resource_categories (name, description, category_type, icon_emoji, display_order) VALUES
('Fermentation & Culturing', 'Fermentation supplies, cultures, and equipment', 'preservation', '🫙', 1),
('Canning & Jarring', 'Canning equipment, jars, and preserving supplies', 'preservation', '🥫', 2),
('Dehydration & Drying', 'Dehydrators, drying racks, and solar dryers', 'preservation', '☀️', 3),
('Root Cellars & Cool Storage', 'Cold storage solutions and root cellar design', 'preservation', '🥔', 4),
('Vacuum Sealing & Freezing', 'Vacuum sealers and freezing equipment', 'preservation', '❄️', 5),
('Cheese & Dairy Making', 'Cheese cultures, equipment, and dairy processing', 'preservation', '🧀', 6)
ON CONFLICT (name) DO NOTHING;

-- Mycology & Mushroom Cultivation Category
INSERT INTO public.resource_categories (name, description, category_type, icon_emoji, display_order) VALUES
('Mushroom Spawn & Cultures', 'Spawn, plugs, and mushroom cultures', 'fungi', '🍄', 1),
('Growing Substrates', 'Straw, sawdust, and growing mediums', 'fungi', '🪵', 2),
('Cultivation Equipment', 'Sterilizers, grow bags, and cultivation tools', 'fungi', '🧪', 3),
('Foraging Tools & Guides', 'Mushroom knives, baskets, and field guides', 'fungi', '🗺️', 4),
('Medicinal Mushrooms', 'Reishi, turkey tail, and medicinal varieties', 'fungi', '💊', 5),
('Mycoremediation Systems', 'Fungal solutions for soil and water cleanup', 'fungi', '🌍', 6)
ON CONFLICT (name) DO NOTHING;

-- Indigenous Knowledge & Ethnobotany Category
INSERT INTO public.resource_categories (name, description, category_type, icon_emoji, display_order) VALUES
('Traditional Ethnobotany', 'Indigenous plant knowledge and uses', 'indigenous', '🪶', 1),
('Native Plant Medicine', 'Traditional medicinal plant practices', 'indigenous', '🌿', 2),
('Indigenous Food Systems', 'Traditional farming and food practices', 'indigenous', '🌽', 3),
('Cultural Land Practices', 'Traditional land management techniques', 'indigenous', '🏞️', 4),
('Sacred Plant Cultivation', 'Ceremonial and sacred plant growing', 'indigenous', '🕊️', 5),
('Bioregional Wisdom', 'Local ecological knowledge and practices', 'indigenous', '🗺️', 6)
ON CONFLICT (name) DO NOTHING;

-- Fiber Arts & Natural Textiles Category
INSERT INTO public.resource_categories (name, description, category_type, icon_emoji, display_order) VALUES
('Fiber Plants & Seeds', 'Flax, hemp, cotton, and fiber plant seeds', 'fiber', '🌾', 1),
('Natural Dyes & Pigments', 'Plant dyes, mordants, and coloring materials', 'fiber', '🎨', 2),
('Spinning & Weaving Tools', 'Spinning wheels, looms, and fiber tools', 'fiber', '🧶', 3),
('Knitting & Textile Crafts', 'Needles, patterns, and textile supplies', 'fiber', '🧵', 4),
('Sustainable Fashion', 'Eco-friendly clothing and fabric', 'fiber', '👕', 5),
('Basketry & Cordage', 'Basket weaving and rope making materials', 'fiber', '🧺', 6)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- EXPANDED RESOURCE CATEGORIES - TIER 2 (MEDIUM PRIORITY)
-- ============================================================================

-- Appropriate Technology & DIY Category
INSERT INTO public.resource_categories (name, description, category_type, icon_emoji, display_order) VALUES
('Solar Electronics', 'Solar panels, batteries, and off-grid power', 'technology', '☀️', 1),
('Bike-Powered Tools', 'Pedal-powered machines and generators', 'technology', '🚴', 2),
('DIY Equipment Plans', 'Open-source designs and blueprints', 'technology', '📐', 3),
('Low-Tech Solutions', 'Simple, maintainable technology', 'technology', '⚙️', 4),
('Maker Tools & Supplies', '3D printing, electronics, and fabrication', 'technology', '🔧', 5),
('Open-Source Tech', 'Community-developed solutions', 'technology', '💻', 6)
ON CONFLICT (name) DO NOTHING;

-- Herbal Medicine & Plant Healing Category
INSERT INTO public.resource_categories (name, description, category_type, icon_emoji, display_order) VALUES
('Medicinal Plant Seeds', 'Seeds for healing herbs and plants', 'herbal-medicine', '🌿', 1),
('Herbal Preparation Supplies', 'Tincture bottles, presses, and tools', 'herbal-medicine', '⚗️', 2),
('Tincture & Extract Making', 'Alcohol, glycerin, and extraction supplies', 'herbal-medicine', '💧', 3),
('Salve & Balm Making', 'Beeswax, oils, and topical preparations', 'herbal-medicine', '🍯', 4),
('Herbal Education', 'Books, courses, and learning resources', 'herbal-medicine', '📚', 5),
('Apothecary Supplies', 'Jars, labels, and storage solutions', 'herbal-medicine', '🏺', 6)
ON CONFLICT (name) DO NOTHING;

-- Soil Science & Regeneration Category
INSERT INTO public.resource_categories (name, description, category_type, icon_emoji, display_order) VALUES
('Soil Testing Equipment', 'pH meters, test kits, and analysis tools', 'soil', '🔬', 1),
('Microbial Inoculants', 'Beneficial bacteria and mycorrhizae', 'soil', '🦠', 2),
('Biochar & Carbon', 'Carbon sequestration and soil building', 'soil', '⚫', 3),
('Cover Crop Seeds', 'Nitrogen fixers and soil builders', 'soil', '🌱', 4),
('Composting Accelerators', 'Activators and decomposition aids', 'soil', '♻️', 5),
('Regenerative Resources', 'Books and courses on soil health', 'soil', '📖', 6)
ON CONFLICT (name) DO NOTHING;

-- Foraging & Wild Harvesting Category
INSERT INTO public.resource_categories (name, description, category_type, icon_emoji, display_order) VALUES
('Foraging Guides', 'Field guides and identification books', 'foraging', '📖', 1),
('Identification Tools', 'Magnifiers, presses, and field equipment', 'foraging', '🔍', 2),
('Wildcrafting Ethics', 'Sustainable harvesting education', 'foraging', '🌿', 3),
('Mushroom Foraging', 'Fungus identification and harvesting', 'foraging', '🍄', 4),
('Wild Medicinal Plants', 'Native healing plant identification', 'foraging', '🌺', 5),
('Foraging Baskets & Tools', 'Collection containers and harvesting tools', 'foraging', '🧺', 6)
ON CONFLICT (name) DO NOTHING;

-- Aquaculture & Water Food Systems Category
INSERT INTO public.resource_categories (name, description, category_type, icon_emoji, display_order) VALUES
('Aquaponics Systems', 'Integrated fish and plant systems', 'aquaculture', '🐟', 1),
('Fish Supplies', 'Fish food, fingerlings, and care products', 'aquaculture', '🐠', 2),
('Pond Equipment', 'Pumps, filters, and pond infrastructure', 'aquaculture', '💧', 3),
('Water Quality Testing', 'pH, ammonia, and water test kits', 'aquaculture', '🧪', 4),
('Aquatic Plants', 'Water plants for filtration and food', 'aquaculture', '🌊', 5),
('Fish Farming Resources', 'Books and courses on aquaculture', 'aquaculture', '📚', 6)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- EXPANDED RESOURCE CATEGORIES - TIER 3 (LONG-TERM EXPANSION)
-- ============================================================================

-- Bioremediation & Ecosystem Restoration Category
INSERT INTO public.resource_categories (name, description, category_type, icon_emoji, display_order) VALUES
('Phytoremediation Plants', 'Plants for pollution cleanup', 'bioremediation', '🌱', 1),
('Erosion Control', 'Slope stabilization and erosion prevention', 'bioremediation', '⛰️', 2),
('Wetland Restoration', 'Wetland plants and restoration supplies', 'bioremediation', '🏞️', 3),
('Pollinator Habitat', 'Native plants for beneficial insects', 'bioremediation', '🦋', 4),
('Wildlife Corridors', 'Habitat connectivity solutions', 'bioremediation', '🦌', 5),
('Restoration Resources', 'Ecological restoration education', 'bioremediation', '📚', 6)
ON CONFLICT (name) DO NOTHING;

-- Community Organizing & Social Permaculture Category
INSERT INTO public.resource_categories (name, description, category_type, icon_emoji, display_order) VALUES
('Community Building Tools', 'Facilitation and organizing resources', 'community-organizing', '🤝', 1),
('Ecovillage Design', 'Sustainable community planning', 'community-organizing', '🏘️', 2),
('Conflict Resolution', 'Mediation and communication tools', 'community-organizing', '⚖️', 3),
('Consensus Building', 'Decision-making processes and tools', 'community-organizing', '🗳️', 4),
('Social Justice Resources', 'Equity and inclusion materials', 'community-organizing', '✊', 5),
('Community Events', 'Gatherings and celebration resources', 'community-organizing', '🎉', 6)
ON CONFLICT (name) DO NOTHING;

-- Alternative Economics & Trading Systems Category
INSERT INTO public.resource_categories (name, description, category_type, icon_emoji, display_order) VALUES
('Time Banking', 'Hour exchange and time currency systems', 'alternative-economics', '⏰', 1),
('Local Currencies', 'Community money and exchange systems', 'alternative-economics', '💱', 2),
('Gift Economy Tools', 'Gift circles and sharing platforms', 'alternative-economics', '🎁', 3),
('Barter Networks', 'Trade and exchange systems', 'alternative-economics', '🔄', 4),
('Cooperative Resources', 'Co-op formation and management', 'alternative-economics', '🤲', 5),
('Commons Management', 'Shared resource governance', 'alternative-economics', '🌍', 6)
ON CONFLICT (name) DO NOTHING;

-- Climate Adaptation & Resilience Category
INSERT INTO public.resource_categories (name, description, category_type, icon_emoji, display_order) VALUES
('Drought-Resilient Plants', 'Water-wise and drought-tolerant species', 'climate-resilience', '🌵', 1),
('Flood Management', 'Water diversion and flood control', 'climate-resilience', '🌊', 2),
('Fire-Smart Landscaping', 'Fire prevention and resistant plants', 'climate-resilience', '🔥', 3),
('Season Extension', 'Greenhouses and cold frames', 'climate-resilience', '🏠', 4),
('Emergency Preparedness', 'Disaster readiness supplies', 'climate-resilience', '🚨', 5),
('Climate Resources', 'Adaptation guides and education', 'climate-resilience', '📚', 6)
ON CONFLICT (name) DO NOTHING;

-- Children's Education & Family Homesteading Category
INSERT INTO public.resource_categories (name, description, category_type, icon_emoji, display_order) VALUES
('Garden Education Kits', 'Kids gardening tools and supplies', 'family-education', '👶', 1),
('Nature Study Materials', 'Field guides and exploration tools', 'family-education', '🔍', 2),
('Family Project Plans', 'DIY projects for families', 'family-education', '👨‍👩‍👧‍👦', 3),
('Homeschool Resources', 'Nature-based curriculum materials', 'family-education', '📚', 4),
('Children''s Garden Seeds', 'Easy-grow varieties for kids', 'family-education', '🌻', 5),
('Story & Activity Books', 'Educational books about nature', 'family-education', '📖', 6)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- Update display order for existing categories to maintain organization
-- ============================================================================

-- Update plant category display orders to group them
UPDATE public.resource_categories
SET display_order = display_order + 100
WHERE category_type = 'plant';

-- Update tool category display orders
UPDATE public.resource_categories
SET display_order = display_order + 200
WHERE category_type = 'tool';

-- Update material category display orders
UPDATE public.resource_categories
SET display_order = display_order + 300
WHERE category_type = 'material';

-- Update service category display orders
UPDATE public.resource_categories
SET display_order = display_order + 400
WHERE category_type = 'service';

-- Update information category display orders
UPDATE public.resource_categories
SET display_order = display_order + 500
WHERE category_type = 'information';

-- Update event category display orders
UPDATE public.resource_categories
SET display_order = display_order + 600
WHERE category_type = 'event';

-- ============================================================================
-- Create a view for organized category display
-- ============================================================================

CREATE OR REPLACE VIEW public.resource_categories_organized AS
SELECT
  id,
  name,
  description,
  category_type,
  parent_category_id,
  icon_emoji,
  display_order,
  created_at,
  CASE category_type
    WHEN 'plant' THEN 1
    WHEN 'animal' THEN 2
    WHEN 'fungi' THEN 3
    WHEN 'preservation' THEN 4
    WHEN 'fiber' THEN 5
    WHEN 'tool' THEN 6
    WHEN 'technology' THEN 7
    WHEN 'material' THEN 8
    WHEN 'soil' THEN 9
    WHEN 'aquaculture' THEN 10
    WHEN 'service' THEN 11
    WHEN 'information' THEN 12
    WHEN 'herbal-medicine' THEN 13
    WHEN 'indigenous' THEN 14
    WHEN 'foraging' THEN 15
    WHEN 'event' THEN 16
    WHEN 'bioremediation' THEN 17
    WHEN 'community-organizing' THEN 18
    WHEN 'alternative-economics' THEN 19
    WHEN 'climate-resilience' THEN 20
    WHEN 'family-education' THEN 21
    ELSE 99
  END as category_group_order
FROM public.resource_categories
ORDER BY category_group_order, display_order;

-- Grant appropriate permissions on the view
GRANT SELECT ON public.resource_categories_organized TO authenticated;
GRANT SELECT ON public.resource_categories_organized TO anon;

-- ============================================================================
-- Add helpful comments for developers
-- ============================================================================

COMMENT ON TABLE public.resource_categories IS 'Expanded categories for marketplace resources covering sustainable living, permaculture, and regenerative practices';
COMMENT ON VIEW public.resource_categories_organized IS 'Organized view of resource categories grouped by type for easier display';
COMMENT ON COLUMN public.resource_categories.category_type IS 'Type of category: plant, animal, fungi, preservation, fiber, tool, technology, material, soil, aquaculture, service, information, herbal-medicine, indigenous, foraging, event, bioremediation, community-organizing, alternative-economics, climate-resilience, family-education';