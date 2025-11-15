/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/seeds/003_expanded_wiki_categories.sql
 * Description: Adds expanded wiki categories to complement the new resource marketplace categories
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-14
 */

-- ================================================
-- EXPANDED WIKI CATEGORIES
-- ================================================
-- These categories complement the expanded resource marketplace categories
-- and provide knowledge base support for diverse sustainable living practices

INSERT INTO wiki_categories (name, slug, icon, description, color) VALUES
-- Animal Husbandry & Livestock
('Animal Husbandry', 'animal-husbandry', '🐓', 'Chickens, bees, rabbits, and small livestock management', '#8b7355'),
('Beekeeping', 'beekeeping', '🐝', 'Apiculture, hive management, and honey production', '#ffd700'),
('Poultry Keeping', 'poultry-keeping', '🐔', 'Raising chickens, ducks, and other fowl', '#cd853f'),

-- Food Preservation & Storage
('Food Preservation', 'food-preservation', '🫙', 'Canning, fermentation, drying, and long-term storage', '#b87333'),
('Fermentation', 'fermentation', '🥒', 'Lacto-fermentation, kombucha, and cultured foods', '#8b6914'),
('Root Cellaring', 'root-cellaring', '🥔', 'Cold storage and traditional preservation methods', '#704214'),

-- Mycology & Mushrooms
('Mycology', 'mycology', '🍄', 'Mushroom cultivation, identification, and uses', '#8b4513'),
('Mushroom Cultivation', 'mushroom-cultivation', '🪵', 'Growing edible and medicinal mushrooms', '#d2691e'),
('Mycoremediation', 'mycoremediation', '🦠', 'Using fungi for ecological restoration', '#5d4e37'),

-- Indigenous & Traditional Knowledge
('Indigenous Knowledge', 'indigenous-knowledge', '🪶', 'Traditional ecological knowledge and practices', '#8b6f47'),
('Ethnobotany', 'ethnobotany', '🌿', 'Traditional plant uses and cultural practices', '#556b2f'),
('Bioregionalism', 'bioregionalism', '🗺️', 'Place-based ecological wisdom', '#6b8e23'),

-- Fiber Arts & Textiles
('Fiber Arts', 'fiber-arts', '🧶', 'Natural fibers, spinning, weaving, and textiles', '#daa520'),
('Natural Dyeing', 'natural-dyeing', '🎨', 'Plant-based dyes and fabric coloring', '#b8860b'),
('Textile Production', 'textile-production', '🧵', 'Growing and processing fiber plants', '#d4a76a'),

-- Appropriate Technology
('Appropriate Technology', 'appropriate-technology', '⚙️', 'Low-tech solutions and DIY equipment', '#708090'),
('Solar Technology', 'solar-technology', '☀️', 'Solar panels, cookers, and passive systems', '#ffa500'),
('Bicycle Power', 'bicycle-power', '🚴', 'Pedal-powered machines and tools', '#4682b4'),

-- Herbal Medicine
('Herbal Medicine', 'herbal-medicine', '🌿', 'Medicinal plants and natural healing', '#228b22'),
('Plant Medicine Making', 'plant-medicine-making', '⚗️', 'Tinctures, salves, and herbal preparations', '#3cb371'),
('Medicinal Gardens', 'medicinal-gardens', '🏥', 'Growing and harvesting healing plants', '#2e8b57'),

-- Soil Science & Regeneration
('Soil Science', 'soil-science', '🔬', 'Soil biology, testing, and improvement', '#8b4513'),
('Regenerative Agriculture', 'regenerative-agriculture', '🌾', 'Building soil health and carbon sequestration', '#daa520'),
('Cover Cropping', 'cover-cropping', '🌱', 'Nitrogen fixation and soil protection', '#9acd32'),

-- Foraging & Wildcrafting
('Foraging', 'foraging', '🫐', 'Wild food identification and harvesting', '#4b0082'),
('Wild Edibles', 'wild-edibles', '🌰', 'Identifying and using wild foods', '#8b008b'),
('Ethical Wildcrafting', 'ethical-wildcrafting', '🌺', 'Sustainable wild harvesting practices', '#9370db'),

-- Aquaculture & Water Systems
('Aquaculture', 'aquaculture', '🐟', 'Fish farming and water-based food systems', '#4169e1'),
('Aquaponics', 'aquaponics', '🐠', 'Integrated fish and plant production', '#1e90ff'),
('Pond Management', 'pond-management', '🏞️', 'Natural swimming pools and wildlife ponds', '#00bfff'),

-- Ecosystem Restoration
('Bioremediation', 'bioremediation', '🌍', 'Ecological cleanup and restoration', '#2f4f4f'),
('Erosion Control', 'erosion-control', '⛰️', 'Slope stabilization and land repair', '#696969'),
('Pollinator Support', 'pollinator-support', '🦋', 'Creating habitat for beneficial insects', '#ff69b4'),

-- Community & Social Systems
('Social Permaculture', 'social-permaculture', '🤝', 'Community organizing and social design', '#9932cc'),
('Ecovillage Design', 'ecovillage-design', '🏘️', 'Sustainable community planning', '#8a2be2'),
('Consensus Decision Making', 'consensus-decision-making', '🗳️', 'Collaborative governance methods', '#6a5acd'),

-- Alternative Economics
('Alternative Economics', 'alternative-economics', '💱', 'Gift economy, timebanking, and local currencies', '#ff8c00'),
('Time Banking', 'time-banking', '⏰', 'Hour-based exchange systems', '#ff7f50'),
('Gift Economy', 'gift-economy', '🎁', 'Sharing and reciprocity systems', '#ff6347'),

-- Climate Resilience
('Climate Adaptation', 'climate-adaptation', '🌡️', 'Preparing for climate change impacts', '#dc143c'),
('Drought Strategies', 'drought-strategies', '🌵', 'Water-wise gardening and dry farming', '#b22222'),
('Fire-Smart Landscaping', 'fire-smart-landscaping', '🔥', 'Fire prevention and resistant design', '#ff4500'),

-- Family & Education
('Children''s Gardens', 'childrens-gardens', '👶', 'Garden education for kids and families', '#00ced1'),
('Nature Education', 'nature-education', '🔍', 'Teaching ecology and natural systems', '#48d1cc'),
('Family Homesteading', 'family-homesteading', '👨‍👩‍👧‍👦', 'Homesteading with children', '#40e0d0')
ON CONFLICT (slug) DO NOTHING;

-- ================================================
-- SAMPLE GUIDES FOR NEW CATEGORIES
-- ================================================

-- Guide for Backyard Chickens
INSERT INTO wiki_guides (
  title,
  slug,
  summary,
  content,
  status,
  view_count,
  published_at
) VALUES (
  'Starting Your First Backyard Flock',
  'starting-first-backyard-flock',
  'Everything you need to know about raising chickens in your backyard, from coop design to daily care routines.',
  E'# Starting Your First Backyard Flock\n\nRaising chickens in your backyard is one of the most rewarding steps toward food self-sufficiency. Fresh eggs, pest control, and fertilizer production are just a few of the benefits.\n\n## Choosing Your Breeds\n\nConsider these factors when selecting breeds:\n- **Climate adaptation** - Cold-hardy vs heat-tolerant\n- **Egg production** - Layers vs dual-purpose\n- **Temperament** - Family-friendly breeds\n- **Space requirements** - Bantams for small spaces\n\n## Coop Requirements\n\n### Space Guidelines\n- 4 sq ft per bird inside coop\n- 10 sq ft per bird in run\n- 1 nest box per 3-4 hens\n- 10 inches of roosting bar per bird\n\n### Essential Features\n- Secure predator-proof design\n- Good ventilation without drafts\n- Easy-clean surfaces\n- Convenient egg collection\n\n## Daily Care Routine\n\n### Morning Tasks\n1. Let chickens out to free-range\n2. Check water and refill\n3. Collect eggs\n4. Quick health check\n\n### Evening Tasks\n1. Secure chickens in coop\n2. Collect any remaining eggs\n3. Check feed levels\n\n## Feed and Nutrition\n\n- Layer feed (16% protein) for hens\n- Starter feed (20-24% protein) for chicks\n- Supplement with kitchen scraps\n- Provide grit and calcium\n\n## Health Management\n\n- Quarantine new birds for 30 days\n- Watch for signs of illness\n- Prevent parasites with dust baths\n- Regular coop cleaning\n\n## Legal Considerations\n\n- Check local ordinances\n- Understand setback requirements\n- Know rooster restrictions\n- Register if required',
  'published',
  0,
  NOW()
);

-- Link the chicken guide to Animal Husbandry category
DO $$
DECLARE
  guide_id UUID;
  category_id UUID;
BEGIN
  SELECT id INTO guide_id FROM wiki_guides WHERE slug = 'starting-first-backyard-flock';
  SELECT id INTO category_id FROM wiki_categories WHERE slug = 'animal-husbandry';

  IF guide_id IS NOT NULL AND category_id IS NOT NULL THEN
    INSERT INTO wiki_guide_categories (guide_id, category_id)
    VALUES (guide_id, category_id)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Guide for Lacto-Fermentation
INSERT INTO wiki_guides (
  title,
  slug,
  summary,
  content,
  status,
  view_count,
  published_at
) VALUES (
  'Lacto-Fermentation: Ancient Preservation Made Simple',
  'lacto-fermentation-ancient-preservation',
  'Master the art of lacto-fermentation to preserve vegetables, enhance nutrition, and develop complex flavors.',
  E'# Lacto-Fermentation: Ancient Preservation Made Simple\n\nLacto-fermentation is one of the oldest and safest methods of food preservation, requiring only vegetables, salt, and time.\n\n## Understanding the Process\n\nLactobacillus bacteria naturally present on vegetables convert sugars into lactic acid when submerged in a salt brine. This process:\n- Preserves food for months or years\n- Increases vitamin content\n- Creates beneficial probiotics\n- Develops complex, tangy flavors\n\n## Basic Sauerkraut Recipe\n\n### Ingredients\n- 5 lbs cabbage\n- 3 tablespoons sea salt (2% by weight)\n\n### Process\n1. Shred cabbage finely\n2. Mix with salt in large bowl\n3. Massage until liquid releases (10-15 minutes)\n4. Pack tightly into jar\n5. Ensure brine covers cabbage\n6. Weight down below brine\n7. Cover with loose lid\n8. Ferment 3-4 weeks at room temperature\n\n## Salt Ratios\n\n- **2% salt** - Most vegetables (by weight)\n- **3-5% brine** - Whole vegetables\n- **10% brine** - Longer storage\n\n## Troubleshooting\n\n### White film (kahm yeast)\n- Harmless but affects flavor\n- Skim off regularly\n- Increase salt slightly\n\n### Mushy texture\n- Too warm (ideal: 65-75°F)\n- Over-fermented\n- Too little salt\n\n### Not sour enough\n- Needs more time\n- Temperature too cool\n- Check pH (should be under 4.6)\n\n## Creative Ferments\n\n- **Kimchi** - Cabbage + gochugaru + garlic + ginger\n- **Curtido** - Cabbage + carrot + onion + oregano\n- **Beet kvass** - Beets + salt + water\n- **Fermented salsa** - Tomatoes + peppers + onions\n\n## Storage\n\n- Refrigerate when desired flavor reached\n- Keeps 6+ months refrigerated\n- Can water-bath can for shelf stability',
  'published',
  0,
  NOW()
);

-- Link the fermentation guide to Food Preservation category
DO $$
DECLARE
  guide_id UUID;
  category_id UUID;
BEGIN
  SELECT id INTO guide_id FROM wiki_guides WHERE slug = 'lacto-fermentation-ancient-preservation';
  SELECT id INTO category_id FROM wiki_categories WHERE slug = 'food-preservation';

  IF guide_id IS NOT NULL AND category_id IS NOT NULL THEN
    INSERT INTO wiki_guide_categories (guide_id, category_id)
    VALUES (guide_id, category_id)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- NOTE: Oyster mushroom guide removed to avoid duplication
-- A comprehensive version (1,300 words with sources) exists in:
-- supabase/seeds/004_real_verified_wiki_content.sql
-- Title: "Growing Oyster Mushrooms on Coffee Grounds: 2025 Complete Guide"
-- Slug: growing-oyster-mushrooms-coffee-grounds-2025

-- ================================================
-- Create cross-references between related categories
-- ================================================

-- This could be a separate table for category relationships
-- but for now, we'll document the relationships in comments

-- Animal Husbandry relates to: Composting (manure), Food Production (eggs/meat)
-- Food Preservation relates to: Food Production, Foraging, Herbal Medicine
-- Mycology relates to: Composting, Soil Science, Bioremediation
-- Indigenous Knowledge relates to: Foraging, Herbal Medicine, Bioregionalism
-- Fiber Arts relates to: Animal Husbandry (wool), Natural Dyeing
-- Soil Science relates to: Composting, Regenerative Agriculture, Cover Cropping
-- Aquaculture relates to: Water Management, Food Production
-- Climate Adaptation relates to: Water Management, Fire-Smart Landscaping, Drought Strategies

-- ================================================
-- Update view counts for better demo data distribution
-- ================================================

UPDATE wiki_categories SET view_count =
  CASE
    WHEN slug IN ('animal-husbandry', 'food-preservation', 'mycology') THEN floor(random() * 150 + 50)
    WHEN slug IN ('fermentation', 'beekeeping', 'herbal-medicine') THEN floor(random() * 100 + 30)
    ELSE floor(random() * 50 + 10)
  END
WHERE slug IN (
  'animal-husbandry', 'beekeeping', 'poultry-keeping', 'food-preservation',
  'fermentation', 'root-cellaring', 'mycology', 'mushroom-cultivation',
  'mycoremediation', 'indigenous-knowledge', 'ethnobotany', 'bioregionalism',
  'fiber-arts', 'natural-dyeing', 'textile-production', 'appropriate-technology',
  'solar-technology', 'bicycle-power', 'herbal-medicine', 'plant-medicine-making',
  'medicinal-gardens', 'soil-science', 'regenerative-agriculture', 'cover-cropping',
  'foraging', 'wild-edibles', 'ethical-wildcrafting', 'aquaculture', 'aquaponics',
  'pond-management', 'bioremediation', 'erosion-control', 'pollinator-support',
  'social-permaculture', 'ecovillage-design', 'consensus-decision-making',
  'alternative-economics', 'time-banking', 'gift-economy', 'climate-adaptation',
  'drought-strategies', 'fire-smart-landscaping', 'childrens-gardens',
  'nature-education', 'family-homesteading'
);