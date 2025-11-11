-- ================================================
-- Community Wiki Seed Data
-- ================================================
-- This file seeds the database with sample wiki content
-- Run this after 004_wiki_schema.sql

-- ================================================
-- SEED CATEGORIES
-- ================================================
INSERT INTO wiki_categories (name, slug, icon, description, color) VALUES
('Gardening', 'gardening', '🌱', 'Vegetable gardens, flowers, and plant care', '#52b788'),
('Water Management', 'water-management', '💧', 'Swales, ponds, irrigation, and rainwater harvesting', '#0077b6'),
('Composting', 'composting', '♻️', 'Hot composting, vermicomposting, and waste management', '#8b4513'),
('Renewable Energy', 'renewable-energy', '☀️', 'Solar, wind, and sustainable energy systems', '#ffd60a'),
('Food Production', 'food-production', '🥕', 'Growing food and sustainable agriculture', '#d62828'),
('Agroforestry', 'agroforestry', '🌳', 'Food forests and tree-based agriculture', '#2d6a4f'),
('Natural Building', 'natural-building', '🏡', 'Cob, straw bale, and earth building techniques', '#bc6c25'),
('Waste Management', 'waste-management', '♻️', 'Zero waste, recycling, and circular economy', '#6a994e'),
('Irrigation', 'irrigation', '💦', 'Drip systems, greywater, and water distribution', '#0077b6'),
('Community', 'community', '👥', 'Community organizing and social permaculture', '#7209b7')
ON CONFLICT (slug) DO NOTHING;

-- ================================================
-- SEED GUIDES
-- ================================================

-- Guide 1: Swale Building
INSERT INTO wiki_guides (
  title,
  slug,
  summary,
  content,
  status,
  view_count,
  published_at
) VALUES (
  'Building a Swale System for Water Retention',
  'building-swale-system-water-retention',
  'Learn how to design and construct swales to capture and distribute rainwater across your property. This comprehensive guide covers site assessment, design principles, and construction techniques.',
  E'# Building a Swale System for Water Retention\n\nSwales are one of the most powerful water harvesting techniques in permaculture. These on-contour ditches with berms capture, slow, and infiltrate runoff water into the landscape, recharging groundwater and supporting deep-rooted vegetation.\n\n## What is a Swale?\n\nA swale is a level ditch dug on contour (following the land\'s natural level lines) with a raised berm on the downhill side. Unlike ditches designed to move water away, swales are designed to slow water down and allow it to infiltrate into the soil.\n\n## Site Assessment\n\nBefore building any swales, you need to understand your landscape:\n\n1. **Contour Mapping** - Use an A-frame level to map contour lines\n2. **Water Flow Patterns** - Observe where water flows during rain\n3. **Soil Type** - Perform percolation tests\n\n## Design Principles\n\nSize your swales based on rainfall, slope, and catchment area:\n- Width: 1-3 meters at the top\n- Depth: 0.5-1 meter\n- Berm height: 0.3-0.6 meters\n- Spacing: 10-30 meters apart vertically\n\n## Construction Steps\n\n1. Mark your contour lines\n2. Excavate the ditch\n3. Build the berm\n4. Plant the system\n\n## Maintenance\n\n- Check for erosion after rain\n- Remove sediment buildup annually\n- Repair breaches immediately',
  'published',
  127,
  NOW()
);

-- Get the guide ID for category linking
DO $$
DECLARE
  guide_id UUID;
  water_cat_id UUID;
  earthworks_cat_id UUID;
BEGIN
  SELECT id INTO guide_id FROM wiki_guides WHERE slug = 'building-swale-system-water-retention';
  SELECT id INTO water_cat_id FROM wiki_categories WHERE slug = 'water-management';

  INSERT INTO wiki_guide_categories (guide_id, category_id) VALUES
    (guide_id, water_cat_id);
END $$;

-- Guide 2: Companion Planting
INSERT INTO wiki_guides (
  title,
  slug,
  summary,
  content,
  status,
  view_count,
  published_at
) VALUES (
  'Companion Planting Guide for Vegetable Gardens',
  'companion-planting-vegetable-gardens',
  'Discover which vegetables grow best together and why. This guide includes detailed companion planting charts and explains the science behind beneficial plant relationships.',
  E'# Companion Planting Guide\n\nCompanion planting is the practice of growing different plants together for mutual benefit. Some plants help each other grow better, repel pests, or improve flavor.\n\n## Classic Combinations\n\n### The Three Sisters\n- Corn provides structure for beans to climb\n- Beans fix nitrogen for corn\n- Squash provides ground cover and pest deterrent\n\n### Tomatoes and Basil\n- Basil repels aphids and whiteflies\n- May improve tomato flavor\n- Similar water and nutrient needs\n\n## Plants to Avoid Together\n\n- Tomatoes and brassicas\n- Onions and beans\n- Fennel with most vegetables',
  'published',
  89,
  NOW() - INTERVAL '2 days'
);

-- Link guide 2 to categories
DO $$
DECLARE
  guide_id UUID;
  gardening_cat_id UUID;
  food_cat_id UUID;
BEGIN
  SELECT id INTO guide_id FROM wiki_guides WHERE slug = 'companion-planting-vegetable-gardens';
  SELECT id INTO gardening_cat_id FROM wiki_categories WHERE slug = 'gardening';
  SELECT id INTO food_cat_id FROM wiki_categories WHERE slug = 'food-production';

  INSERT INTO wiki_guide_categories (guide_id, category_id) VALUES
    (guide_id, gardening_cat_id),
    (guide_id, food_cat_id);
END $$;

-- Guide 3: Hot Composting
INSERT INTO wiki_guides (
  title,
  slug,
  summary,
  content,
  status,
  view_count,
  published_at
) VALUES (
  'Hot Composting: A Step-by-Step Guide',
  'hot-composting-step-by-step',
  'Master the art of hot composting to turn kitchen scraps and yard waste into rich, dark compost in just 18 days. Includes troubleshooting tips and material ratios.',
  E'# Hot Composting: A Step-by-Step Guide\n\nHot composting produces finished compost in just 18-21 days through thermophilic bacterial action.\n\n## The Recipe\n\n### Carbon to Nitrogen Ratio: 30:1\n\n**Browns (Carbon):**\n- Dry leaves\n- Straw\n- Cardboard\n- Wood chips\n\n**Greens (Nitrogen):**\n- Kitchen scraps\n- Fresh grass clippings\n- Coffee grounds\n- Manure\n\n## Building Your Pile\n\n1. Start with 1 cubic meter minimum\n2. Layer browns and greens\n3. Add water to "wrung-out sponge" moisture\n4. Mix thoroughly\n\n## Temperature Management\n\n- Target: 130-160°F (55-70°C)\n- Turn when temp drops below 100°F\n- Turn every 2-3 days\n- Should heat up within 24 hours',
  'published',
  203,
  NOW() - INTERVAL '1 week'
);

DO $$
DECLARE
  guide_id UUID;
  composting_cat_id UUID;
BEGIN
  SELECT id INTO guide_id FROM wiki_guides WHERE slug = 'hot-composting-step-by-step';
  SELECT id INTO composting_cat_id FROM wiki_categories WHERE slug = 'composting';

  INSERT INTO wiki_guide_categories (guide_id, category_id) VALUES
    (guide_id, composting_cat_id);
END $$;

-- Add more guides...
INSERT INTO wiki_guides (title, slug, summary, content, status, view_count, published_at) VALUES
('Installing Drip Irrigation for Food Gardens', 'drip-irrigation-food-gardens', 'Save water and time with an efficient drip irrigation system. This practical guide covers materials, layout design, and maintenance for home garden installations.', E'# Drip Irrigation Systems\n\nDrip irrigation delivers water directly to plant roots, reducing water waste by up to 50% compared to overhead watering.', 'published', 156, NOW() - INTERVAL '1 week'),
('Starting a Community Seed Library', 'community-seed-library', 'Learn how to organize and run a community seed library to preserve heirloom varieties and promote seed sovereignty. Includes organizational tips and catalog systems.', E'# Community Seed Libraries\n\nSeed libraries democratize seed access and preserve genetic diversity.', 'published', 178, NOW() - INTERVAL '2 weeks'),
('Building with Cob: Natural Building Basics', 'cob-building-basics', 'Introduction to cob building techniques using clay, sand, and straw. Learn about material preparation, wall construction, and finishing techniques for this sustainable building method.', E'# Cob Building\n\nCob is a natural building material made from clay, sand, and straw.', 'published', 92, NOW() - INTERVAL '2 weeks');

-- ================================================
-- SEED EVENTS
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
('Community Composting Workshop', 'community-composting-workshop-nov', 'Hands-on workshop on building and maintaining hot compost systems. Bring gloves and water bottle. Lunch provided.', '2025-11-15', '10:00', '14:00', 'Green Valley Farm', '123 Valley Road', 40.7128, -74.0060, 'workshop', 15.00, '$15', 'published'),
('Seed Swap & Exchange', 'seed-swap-exchange-nov', 'Bring seeds to trade and connect with local gardeners. We will have heirloom varieties, seed saving tips, and free seed packets for newcomers!', '2025-11-22', '09:00', '12:00', 'Community Seed Bank', '456 Library St', 40.7306, -73.9352, 'meetup', 0, 'Free', 'published'),
('Food Forest Design Tour', 'food-forest-tour-nov', 'Tour a mature 3-acre food forest and learn design principles. See polycultures, guild plantings, and layered systems in action.', '2025-11-28', '14:00', '17:00', 'Sunset Permaculture', '789 Farm Lane', 40.6782, -73.9442, 'tour', 10.00, '$10', 'published'),
('Introduction to Permaculture Design', 'intro-permaculture-nov', 'Free introductory session covering the principles and ethics of permaculture. Perfect for beginners interested in sustainable design.', '2025-11-12', '18:00', '20:30', 'Community Center', '321 Main St', 40.7411, -73.9897, 'workshop', 0, 'Free', 'published'),
('Monthly Community Workday', 'community-workday-nov', 'Join us for our monthly community workday! This month: building raised beds and planting fall crops. All skill levels welcome.', '2025-11-18', '08:00', '12:00', 'Urban Homestead Hub', '234 City Ave', 40.7580, -73.9855, 'work-day', 0, 'Free', 'published'),
('Natural Building Demonstration', 'natural-building-demo-nov', 'Watch and learn as we demonstrate cob mixing and wall building techniques. Q&A session included. Great for aspiring natural builders.', '2025-11-25', '13:00', '16:00', 'Natural Building Collective', '567 Workshop Rd', 40.7589, -73.9851, 'demonstration', 0, 'Free', 'published');

-- ================================================
-- SEED LOCATIONS
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
('Green Valley Farm', 'green-valley-farm', '15-acre permaculture demonstration site with food forest, market garden, and natural building examples.', '123 Valley Road, Greenville', 40.7128, -74.0060, 'farm', 'https://greenvalley.example.com', ARRAY['food-forest', 'education', 'farm-tours'], 'published'),
('Urban Homestead Hub', 'urban-homestead-hub', 'Small-scale urban permaculture with aquaponics, rooftop garden, and rainwater harvesting systems.', '234 City Ave, Metropolitan', 40.7580, -73.9855, 'garden', null, ARRAY['urban', 'aquaponics', 'rooftop'], 'published'),
('Sunset Permaculture', 'sunset-permaculture', 'Educational center offering PDC courses, workshops, and farm stays on 50 acres of regenerative farmland.', '789 Farm Lane, Countryside', 40.6782, -73.9442, 'education', 'https://sunset-perma.example.com', ARRAY['education', 'pdc', 'farm-stay'], 'published'),
('River Bend Gardens', 'river-bend-gardens', 'Specialty in water management techniques including swales, ponds, and greywater systems.', '456 River Rd, Waterside', 40.7489, -73.9680, 'farm', null, ARRAY['water-systems', 'swales', 'ponds'], 'published'),
('Community Seed Bank', 'community-seed-bank', 'Free seed library at the local library. Borrow seeds, grow them, save seeds, and return.', '456 Library St, Downtown', 40.7306, -73.9352, 'community', null, ARRAY['seeds', 'free', 'library'], 'published'),
('Natural Building Collective', 'natural-building-collective', 'Workshop space showcasing cob, straw bale, and earthbag building techniques. Open days monthly.', '567 Workshop Rd, Artisan District', 40.7589, -73.9851, 'education', null, ARRAY['natural-building', 'cob', 'workshops'], 'published'),
('The Seedling Shop', 'seedling-shop', 'Local nursery specializing in heirloom vegetables, native plants, and permaculture staples.', '321 Garden St, Market District', 40.7411, -73.9897, 'business', 'https://seedlingshop.example.com', ARRAY['nursery', 'heirloom', 'plants'], 'published'),
('Rooftop Eden', 'rooftop-eden', 'Innovative rooftop garden demonstrating intensive vertical growing and green roof systems.', '890 High St, City Center', 40.7282, -74.0776, 'garden', null, ARRAY['rooftop', 'urban', 'vertical'], 'published');

-- ================================================
-- UPDATE GUIDE VIEW COUNTS
-- ================================================

-- This sets realistic view counts for the guides
UPDATE wiki_guides SET view_count = 127 WHERE slug = 'building-swale-system-water-retention';
UPDATE wiki_guides SET view_count = 89 WHERE slug = 'companion-planting-vegetable-gardens';
UPDATE wiki_guides SET view_count = 203 WHERE slug = 'hot-composting-step-by-step';
UPDATE wiki_guides SET view_count = 156 WHERE slug = 'drip-irrigation-food-gardens';
UPDATE wiki_guides SET view_count = 178 WHERE slug = 'community-seed-library';
UPDATE wiki_guides SET view_count = 92 WHERE slug = 'cob-building-basics';

-- ================================================
-- VERIFICATION QUERIES
-- ================================================

-- Uncomment these to verify the seed data after running

-- SELECT COUNT(*) as categories_count FROM wiki_categories;
-- SELECT COUNT(*) as guides_count FROM wiki_guides;
-- SELECT COUNT(*) as events_count FROM wiki_events;
-- SELECT COUNT(*) as locations_count FROM wiki_locations;

-- SELECT
--   g.title,
--   array_agg(c.name) as categories
-- FROM wiki_guides g
-- LEFT JOIN wiki_guide_categories gc ON g.id = gc.guide_id
-- LEFT JOIN wiki_categories c ON gc.category_id = c.id
-- GROUP BY g.id, g.title;
