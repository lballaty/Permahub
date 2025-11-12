-- ================================================
-- Community Wiki Seed Data - MADEIRA ISLAND
-- ================================================
-- This file seeds the database with Madeira-specific content
-- Run this after 004_wiki_schema.sql
-- Based on real locations and projects in Madeira, Portugal

-- Clear existing data (optional - uncomment if resetting)
-- TRUNCATE wiki_guide_categories, wiki_guides, wiki_events, wiki_locations, wiki_categories CASCADE;

-- ================================================
-- SEED CATEGORIES
-- ================================================
INSERT INTO wiki_categories (name, slug, icon, description, color) VALUES
('Subtropical Gardening', 'subtropical-gardening', '🌺', 'Growing subtropical and tropical plants in Madeira''s unique climate', '#ff6b9d'),
('Water Management', 'water-management', '💧', 'Levadas, rainwater harvesting, and irrigation systems', '#0077b6'),
('Composting', 'composting', '♻️', 'Banana circles, hot composting, and organic waste management', '#8b4513'),
('Renewable Energy', 'renewable-energy', '☀️', 'Solar energy and sustainable power for island living', '#ffd60a'),
('Food Forests', 'food-forests', '🌳', 'Subtropical food forests and agroforestry systems', '#2d6a4f'),
('Terracing', 'terracing', '🏔️', 'Traditional Madeiran terrace agriculture and stonework', '#bc6c25'),
('Natural Building', 'natural-building', '🏡', 'HempCrete, cob, and sustainable construction', '#6a994e'),
('Circular Economy', 'circular-economy', '🔄', 'Zero waste and closed-loop systems', '#7209b7'),
('Native Species', 'native-species', '🌿', 'Laurisilva forest and endemic plant conservation', '#52b788'),
('Community', 'community', '👥', 'Eco-villages and community-supported agriculture', '#e63946')
ON CONFLICT (slug) DO NOTHING;

-- ================================================
-- SEED GUIDES - MADEIRA SPECIFIC
-- ================================================

-- Guide 1: Levada Systems
INSERT INTO wiki_guides (
  title,
  slug,
  summary,
  content,
  status,
  view_count,
  published_at
) VALUES (
  'Understanding Madeira''s Levada Irrigation System',
  'madeira-levada-irrigation-system',
  'Learn about Madeira''s historic levada water channels and how these traditional irrigation systems inspire modern permaculture water management on the island.',
  E'# Understanding Madeira''s Levada Irrigation System\n\nMadeira''s levadas are a network of irrigation channels built over 500 years ago to transport water from the rainy north to the drier south of the island.\n\n## Historical Context\n\nThe levada system dates back to the 15th century when Portuguese settlers needed to irrigate the southern and eastern parts of Madeira. Today, over 2,000 km of levadas traverse the island.\n\n## Permaculture Applications\n\n### Water Harvesting\nLevadas demonstrate key permaculture principles:\n- Gravity-fed water distribution\n- Contour-based design\n- Minimal energy input\n- Multi-functional systems (irrigation + walking paths)\n\n## Modern Adaptations\n\nContemporary permaculture projects in Madeira adapt levada principles:\n\n1. **Micro-levadas** - Small-scale channels for garden irrigation\n2. **Swale-Levada Hybrids** - Combining infiltration with transport\n3. **Rainwater Collection** - Integrating levadas with tank systems\n\n## Construction Techniques\n\n- Use local stone for channel walls\n- Maintain gentle gradient (1-2%)\n- Include overflow points\n- Plant stabilizing vegetation along edges\n\n## Maintenance\n\n- Clean channels seasonally\n- Repair stone walls promptly\n- Monitor water quality\n- Control invasive aquatic plants',
  'published',
  243,
  NOW()
);

DO $$
DECLARE
  guide_id UUID;
  water_cat_id UUID;
BEGIN
  SELECT id INTO guide_id FROM wiki_guides WHERE slug = 'madeira-levada-irrigation-system';
  SELECT id INTO water_cat_id FROM wiki_categories WHERE slug = 'water-management';

  INSERT INTO wiki_guide_categories (guide_id, category_id) VALUES (guide_id, water_cat_id);
END $$;

-- Guide 2: Banana Circles
INSERT INTO wiki_guides (
  title,
  slug,
  summary,
  content,
  status,
  view_count,
  published_at
) VALUES (
  'Banana Circles: Perfect Composting for Madeira''s Climate',
  'banana-circles-madeira-composting',
  'Banana circles are ideal for Madeira''s subtropical climate. Learn how to build this permaculture system that combines organic waste composting with banana and papaya production.',
  E'# Banana Circles for Madeira\n\nBanana circles are one of the most productive permaculture techniques for Madeira''s warm, humid climate. They turn organic waste into abundant fruit production.\n\n## What is a Banana Circle?\n\nA banana circle is a sunken pit filled with organic matter, planted with bananas around the perimeter. It functions as both a composting system and food production area.\n\n## Why Perfect for Madeira?\n\n- **Climate Match** - Bananas thrive in Madeira''s 16-24°C temperatures\n- **Water Efficiency** - The pit captures and holds moisture\n- **Waste Solution** - Composts abundant organic matter from lush gardens\n- **Space Efficient** - Vertical growing on terraces\n\n## Construction Steps\n\n### 1. Location\nChoose a spot that gets:\n- Full sun to partial shade\n- Protection from strong winds\n- Good drainage underneath\n\n### 2. Dig the Pit\n- Diameter: 2-3 meters\n- Depth: 1-1.5 meters\n- Slope sides inward slightly\n\n### 3. Fill with Organic Matter\nLayer:\n- Woody material at bottom\n- Green kitchen waste\n- Grass clippings\n- Animal manure (if available)\n- Finished compost\n\n### 4. Plant Bananas\n- 6-8 banana plants around the rim\n- Include papaya in the center\n- Add comfrey or sweet potato as groundcover\n\n## Varieties for Madeira\n\n**Bananas:**\n- Dwarf Cavendish\n- Lady Finger\n- Musa acuminata (local varieties)\n\n**Companions:**\n- Papaya\n- Passionfruit (on trellis)\n- Taro\n- Ginger\n\n## Maintenance\n\n- Add kitchen scraps regularly\n- Water during dry periods\n- Remove old banana leaves\n- Harvest bananas when fingers yellow\n- Divide and replant suckers annually',
  'published',
  189,
  NOW() - INTERVAL '3 days'
);

DO $$
DECLARE
  guide_id UUID;
  composting_cat_id UUID;
  subtropical_cat_id UUID;
BEGIN
  SELECT id INTO guide_id FROM wiki_guides WHERE slug = 'banana-circles-madeira-composting';
  SELECT id INTO composting_cat_id FROM wiki_categories WHERE slug = 'composting';
  SELECT id INTO subtropical_cat_id FROM wiki_categories WHERE slug = 'subtropical-gardening';

  INSERT INTO wiki_guide_categories (guide_id, category_id) VALUES
    (guide_id, composting_cat_id),
    (guide_id, subtropical_cat_id);
END $$;

-- Guide 3: Terracing
INSERT INTO wiki_guides (
  title,
  slug,
  summary,
  content,
  status,
  view_count,
  published_at
) VALUES (
  'Restoring Traditional Madeiran Agricultural Terraces',
  'restoring-madeiran-terraces',
  'Madeira''s iconic terraces (poios) are permaculture systems built into steep hillsides. Learn traditional stone-work and modern restoration techniques.',
  E'# Restoring Traditional Madeiran Terraces\n\nMadeira''s landscape is defined by terraced agriculture (poios) carved into mountainsides over centuries.\n\n## Historical Significance\n\nTerraces enabled:\n- Agriculture on 45°+ slopes\n- Erosion control\n- Water management\n- Microclimate creation\n\n## Permaculture Principles in Terraces\n\n1. **Slow and Store Water**\n2. **Each Element Serves Multiple Functions**\n3. **Stack Functions Vertically**\n4. **Work with Nature''s Patterns**\n\n## Restoration Process\n\n### Assessment\n- Document existing walls\n- Identify structural issues\n- Map water flow patterns\n- Test soil depth and quality\n\n### Stonework\nTraditional dry-stone walls:\n- Use local basalt rock\n- No mortar needed\n- Slight backward lean (10-15°)\n- Include drainage points\n\n### Soil Building\n- Import soil if depleted\n- Mix compost into top 30cm\n- Add biochar for water retention\n- Plant nitrogen-fixers\n\n## What to Grow\n\n**Traditional:**\n- Grapes (Madeira wine heritage)\n- Sweet potatoes\n- Wheat (historical)\n\n**Contemporary Permaculture:**\n- Subtropical fruit trees\n- Vegetables in keyhole beds\n- Medicinal herbs\n- Nitrogen-fixing trees',
  'published',
  156,
  NOW() - INTERVAL '1 week'
);

-- Guide 4: Subtropical Food Forest
INSERT INTO wiki_guides (
  title,
  slug,
  summary,
  content,
  status,
  view_count,
  published_at
) VALUES (
  'Designing a Subtropical Food Forest in Madeira',
  'subtropical-food-forest-madeira',
  'Create a productive food forest using subtropical and tropical species adapted to Madeira''s unique climate. Includes plant lists and guild design.',
  E'# Subtropical Food Forest Design for Madeira\n\nMadeira''s climate (subtropical/Mediterranean hybrid) allows for incredible food forest diversity.\n\n## Climate Zones\n\nMadeira has multiple microclimates:\n- **Coast (0-200m):** Tropical species thrive\n- **Mid-elevation (200-600m):** Subtropical paradise\n- **Highland (600m+):** Temperate fruits\n\n## Canopy Layer (5-10m)\n\n- Avocado (Mexican varieties)\n- Mango (requires warmest spots)\n- Cherimoya\n- Breadfruit\n- Loquat\n- Macadamia\n\n## Sub-Canopy (3-5m)\n\n- Papaya\n- Banana\n- Passionfruit (on support)\n- Guava\n- Surinam Cherry\n\n## Shrub Layer (1-3m)\n\n- Pineapple\n- Coffee (shade-grown)\n- Cardamom\n- Turmeric\n- Ginger\n\n## Herbaceous Layer\n\n- Sweet potato\n- Taro\n- Arrowroot\n- Comfrey\n- Lemongrass\n\n## Ground Cover\n\n- Strawberry\n- Mint species\n- Perennial peanut\n\n## Example Guild: Banana-Papaya-Taro\n\n**Banana:** Main crop, nitrogen accumulator\n**Papaya:** Quick fruit, disease-free\n**Taro:** Shade-tolerant ground cover\n**Comfrey:** Dynamic accumulator\n**Sweet Potato:** Nitrogen fixer, ground cover',
  'published',
  267,
  NOW() - INTERVAL '2 weeks'
);

-- ================================================
-- SEED EVENTS - MADEIRA SPECIFIC
-- ================================================

INSERT INTO wiki_events (
  title,
  slug,
  description,
  event_date,
  start_time,
  end_time,
  location_name,
  location_address,
  latitude,
  longitude,
  event_type,
  price,
  price_display,
  status
) VALUES
('Subtropical Permaculture Workshop', 'subtropical-permaculture-workshop-dec', 'Learn subtropical permaculture techniques specific to Madeira''s climate. Topics include banana circle design, passion fruit trellising, and subtropical food forests. Organic lunch included.', '2025-12-05', '10:00', '16:00', 'Naturopia Eco Village', 'Caniço, Funchal', 32.6500, -16.8500, 'workshop', 25.00, '€25', 'published'),

('Levada Walk & Native Plant Identification', 'levada-walk-native-plants-dec', 'Guided levada walk learning about Madeira''s endemic Laurisilva forest plants and the historical irrigation system. Discussion on water management in permaculture. Moderate difficulty. Bring water and snacks.', '2025-12-10', '09:00', '13:00', 'Rabaçal Levada Trail', 'Rabaçal, Paul da Serra', 32.7500, -17.1200, 'tour', 0, 'Free', 'published'),

('Seed Swap & Subtropical Varieties Exchange', 'seed-swap-madeira-dec', 'Exchange seeds of subtropical and tropical varieties adapted to Madeira. Focus on heirloom tomatoes, passion fruit, avocado seedlings, and endemic species. Bring seeds or cuttings to swap!', '2025-12-14', '10:00', '13:00', 'Quinta das Colmeias', 'Ponta do Sol', 32.6833, -17.1000, 'meetup', 0, 'Free', 'published'),

('Introduction to Permaculture Design - Madeira Edition', 'intro-permaculture-madeira-dec', 'Free introductory session on permaculture principles adapted for island living and Madeira''s unique terraced landscapes, microclimates, and endemic species. Beginner friendly.', '2025-12-17', '18:30', '21:00', 'Funchal Community Center', 'Zona Velha, Funchal', 32.6494, -16.9070, 'workshop', 0, 'Free', 'published'),

('Community Work Day: Terrace Restoration', 'terrace-restoration-workday-dec', 'Help restore traditional Madeiran agricultural terraces using permaculture principles. Learn traditional stonework and terracing techniques. Bring gloves, water, and lunch. Tools provided.', '2025-12-20', '08:30', '13:00', 'Arambha Eco Village', 'Ponta do Sol', 32.6750, -17.1050, 'work-day', 0, 'Free', 'published'),

('Banana Circle Construction Workshop', 'banana-circle-workshop-jan', 'Hands-on workshop building a banana circle system for organic waste composting and tropical fruit production. Perfect for Madeira''s climate. Materials included. Bring gloves and lunch.', '2026-01-10', '10:00', '15:00', 'Casas da Levada', 'Ponta do Pargo', 32.8167, -17.2500, 'workshop', 20.00, '€20', 'published'),

('Full Moon Harvest Festival & Seed Saving', 'full-moon-harvest-festival', 'Celebrate the full moon with a community harvest festival. Learn seed saving techniques for subtropical varieties. Traditional Madeiran music, food sharing, and bonfire. All welcome!', '2025-12-28', '17:00', '22:00', 'Naturopia Eco Village', 'Caniço, Funchal', 32.6500, -16.8500, 'social', 5.00, '€5', 'published'),

('PDC - Permaculture Design Course', 'permaculture-design-course-jan', '72-hour intensive Permaculture Design Certificate course taught by certified instructor. Focus on island permaculture, terracing, and subtropical systems. Accommodation available. Early bird €850.', '2026-01-20', '09:00', '17:00', 'Quinta das Colmeias', 'Ponta do Sol', 32.6833, -17.1000, 'course', 900.00, '€900', 'published');

-- ================================================
-- SEED LOCATIONS - MADEIRA REAL PLACES
-- ================================================

INSERT INTO wiki_locations (
  name,
  slug,
  description,
  address,
  latitude,
  longitude,
  location_type,
  website,
  tags,
  status
) VALUES
('Naturopia Eco Village', 'naturopia-eco-village', 'Co-housing community on 15,000 m² of forest near Funchal. Features natural building with HempCrete, permaculture gardens, and community spaces. Visitors welcome for workshops and tours.', 'Caniço, Funchal, Madeira', 32.6500, -16.8500, 'community', 'https://naturopia.xyz', ARRAY['eco-village', 'natural-building', 'community', 'hempcrete'], 'published'),

('Quinta das Colmeias', 'quinta-das-colmeias', 'Pioneer organic farm in Madeira, certified organic since 1998 by Ecocert. Produces organic fruit, vegetables, aromatic herbs, and raises free-range chickens. Offers workshops and farm visits.', 'Ponta do Sol, Madeira', 32.6833, -17.1000, 'farm', 'http://www.quinta-das-colmeias.com', ARRAY['organic-farm', 'certified-organic', 'farm-visits', 'education'], 'published'),

('Casas da Levada', 'casas-da-levada', 'Agritourism farm with B&B accommodation implementing permaculture practices. Features organic vegetable gardens, traditional levadas, access to trails, and Laurisilva forest. Animals and swimming pool on site.', 'Ponta do Pargo, Madeira', 32.8167, -17.2500, 'farm', 'https://casasdalevada.com', ARRAY['agritourism', 'permaculture', 'levadas', 'organic-gardens'], 'published'),

('Arambha Permaculture Project', 'arambha-permaculture', 'Community permaculture project focused on Laurisilva forest conservation through reforestation. Volunteers welcome for forest restoration, terracing, and sustainable agriculture work.', 'Lombo do Guiné, Ponta do Sol', 32.6750, -17.1050, 'education', 'https://arambha.net', ARRAY['permaculture', 'reforestation', 'native-species', 'volunteers'], 'published'),

('Socalco Nature Hotel Gardens', 'socalco-nature-hotel', 'Boutique hotel with focus on permaculture and sustainability. Features organic garden and orchard, rainwater collection, solar energy, and terraced gardens. Garden tours available for non-guests.', 'Arco de São Jorge, Santana', 32.7833, -16.8667, 'education', null, ARRAY['organic-garden', 'rainwater-harvesting', 'solar-energy', 'terracing'], 'published'),

('Funchal Farmers Market', 'mercado-agricultores-funchal', 'Weekly farmers market featuring local organic produce, seedlings, and traditional Madeiran products. Meet local farmers and exchange growing tips. Every Saturday morning.', 'Rua Lateral da Sé, Funchal', 32.6495, -16.9095, 'business', null, ARRAY['farmers-market', 'local-food', 'organic', 'seeds'], 'published'),

('Madeira Botanical Garden', 'jardim-botanico-madeira', 'Beautiful botanical garden showcasing Madeira''s flora and exotic species. Includes subtropical and tropical plant collections. Great for permaculture inspiration and plant identification.', 'Caminho do Meio, Funchal', 32.6583, -16.8889, 'education', 'https://jardimbotanicodamadeira.com', ARRAY['botanical-garden', 'education', 'native-species', 'subtropical'], 'published'),

('Fajã da Ovelha Permaculture Project', 'faja-ovelha-permaculture', 'Permaculture project on the sunny south coast creating diverse subtropical food forest. Volunteer opportunities available. Focus on terracing, water systems, and rare subtropical plants.', 'Fajã da Ovelha, Calheta', 32.7167, -17.2833, 'farm', null, ARRAY['permaculture', 'food-forest', 'volunteers', 'terracing'], 'published'),

('Laurisilva Forest Conservation Center', 'laurisilva-conservation', 'Educational center dedicated to preserving Madeira''s unique Laurisilva (UNESCO World Heritage). Offers guided walks, native plant nursery, and reforestation programs.', 'Serra do Faial, Santana', 32.7833, -16.9000, 'education', null, ARRAY['conservation', 'native-species', 'unesco', 'education'], 'published');

-- ================================================
-- UPDATE STATS
-- ================================================

UPDATE wiki_guides SET view_count = 243 WHERE slug = 'madeira-levada-irrigation-system';
UPDATE wiki_guides SET view_count = 189 WHERE slug = 'banana-circles-madeira-composting';
UPDATE wiki_guides SET view_count = 156 WHERE slug = 'restoring-madeiran-terraces';
UPDATE wiki_guides SET view_count = 267 WHERE slug = 'subtropical-food-forest-madeira';

-- ================================================
-- VERIFICATION QUERIES
-- ================================================

SELECT 'Madeira Wiki Data Seeded Successfully!' as message;
SELECT COUNT(*) as categories_count FROM wiki_categories;
SELECT COUNT(*) as guides_count FROM wiki_guides;
SELECT COUNT(*) as events_count FROM wiki_events;
SELECT COUNT(*) as locations_count FROM wiki_locations;
