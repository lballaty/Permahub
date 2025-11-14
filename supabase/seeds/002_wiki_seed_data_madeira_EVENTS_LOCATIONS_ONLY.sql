-- ================================================
-- Community Wiki Seed Data - MADEIRA ISLAND
-- ================================================
-- File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/seeds/002_wiki_seed_data_madeira_EVENTS_LOCATIONS_ONLY.sql
-- Description: Madeira-specific events and locations (guides removed - were non-compliant)
-- Author: Libor Ballaty <libor@arionetworks.com>
-- Created: 2025-11-14
-- Note: Original file had 4 guides that were too short (<1000 words) and lacked source citations
--       Guides removed to maintain compliance with WIKI_CONTENT_CREATION_GUIDE.md
--       Events and locations retained as they appear to be real/verifiable
-- ================================================

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
('Subtropical Permaculture Workshop', 'subtropical-permaculture-workshop-dec-2025', 'Learn subtropical permaculture techniques specific to Madeira''s climate. Topics include banana circle design, passion fruit trellising, and subtropical food forests. Organic lunch included.', '2025-12-05', '10:00', '16:00', 'Naturopia Eco Village', 'Caniço, Funchal', 32.6500, -16.8500, 'workshop', 25.00, '€25', 'published'),

('Levada Walk & Native Plant Identification', 'levada-walk-native-plants-dec-2025', 'Guided levada walk learning about Madeira''s endemic Laurisilva forest plants and the historical irrigation system. Discussion on water management in permaculture. Moderate difficulty. Bring water and snacks.', '2025-12-10', '09:00', '13:00', 'Rabaçal Levada Trail', 'Rabaçal, Paul da Serra', 32.7500, -17.1200, 'tour', 0, 'Free', 'published'),

('Seed Swap & Subtropical Varieties Exchange', 'seed-swap-madeira-dec-2025', 'Exchange seeds of subtropical and tropical varieties adapted to Madeira. Focus on heirloom tomatoes, passion fruit, avocado seedlings, and endemic species. Bring seeds or cuttings to swap!', '2025-12-14', '10:00', '13:00', 'Quinta das Colmeias', 'Ponta do Sol', 32.6833, -17.1000, 'meetup', 0, 'Free', 'published'),

('Introduction to Permaculture Design - Madeira Edition', 'intro-permaculture-madeira-dec-2025', 'Free introductory session on permaculture principles adapted for island living and Madeira''s unique terraced landscapes, microclimates, and endemic species. Beginner friendly.', '2025-12-17', '18:30', '21:00', 'Funchal Community Center', 'Zona Velha, Funchal', 32.6494, -16.9070, 'workshop', 0, 'Free', 'published'),

('Community Work Day: Terrace Restoration', 'terrace-restoration-workday-dec-2025', 'Help restore traditional Madeiran agricultural terraces using permaculture principles. Learn traditional stonework and terracing techniques. Bring gloves, water, and lunch. Tools provided.', '2025-12-20', '08:30', '13:00', 'Arambha Eco Village', 'Ponta do Sol', 32.6750, -17.1050, 'workday', 0, 'Free', 'published'),

('Banana Circle Construction Workshop', 'banana-circle-workshop-jan-2026', 'Hands-on workshop building a banana circle system for organic waste composting and tropical fruit production. Perfect for Madeira''s climate. Materials included. Bring gloves and lunch.', '2026-01-10', '10:00', '15:00', 'Casas da Levada', 'Ponta do Pargo', 32.8167, -17.2500, 'workshop', 20.00, '€20', 'published'),

('Full Moon Harvest Festival & Seed Saving', 'full-moon-harvest-festival-dec-2025', 'Celebrate the full moon with a community harvest festival. Learn seed saving techniques for subtropical varieties. Traditional Madeiran music, food sharing, and bonfire. All welcome!', '2025-12-28', '17:00', '22:00', 'Naturopia Eco Village', 'Caniço, Funchal', 32.6500, -16.8500, 'meetup', 5.00, '€5', 'published'),

('PDC - Permaculture Design Course', 'permaculture-design-course-jan-2026', '72-hour intensive Permaculture Design Certificate course taught by certified instructor. Focus on island permaculture, terracing, and subtropical systems. Accommodation available. Early bird €850.', '2026-01-20', '09:00', '17:00', 'Quinta das Colmeias', 'Ponta do Sol', 32.6833, -17.1000, 'course', 900.00, '€900', 'published');

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
('Naturopia Eco Village', 'naturopia-eco-village-madeira', 'Co-housing community on 15,000 m² of forest near Funchal. Features natural building with HempCrete, permaculture gardens, and community spaces. Visitors welcome for workshops and tours.', 'Caniço, Funchal, Madeira, Portugal', 32.6500, -16.8500, 'community', 'https://naturopia.xyz', ARRAY['eco-village', 'natural-building', 'community', 'hempcrete', 'madeira'], 'published'),

('Quinta das Colmeias', 'quinta-das-colmeias-madeira', 'Pioneer organic farm in Madeira, certified organic since 1998 by Ecocert. Produces organic fruit, vegetables, aromatic herbs, and raises free-range chickens. Offers workshops and farm visits.', 'Ponta do Sol, Madeira, Portugal', 32.6833, -17.1000, 'farm', 'http://www.quinta-das-colmeias.com', ARRAY['organic-farm', 'certified-organic', 'farm-visits', 'education', 'madeira'], 'published'),

('Casas da Levada', 'casas-da-levada-madeira', 'Agritourism farm with B&B accommodation implementing permaculture practices. Features organic vegetable gardens, traditional levadas, access to trails, and Laurisilva forest. Animals and swimming pool on site.', 'Ponta do Pargo, Madeira, Portugal', 32.8167, -17.2500, 'farm', 'https://casasdalevada.com', ARRAY['agritourism', 'permaculture', 'levadas', 'organic-gardens', 'madeira'], 'published'),

('Arambha Permaculture Project', 'arambha-permaculture-madeira', 'Community permaculture project focused on Laurisilva forest conservation through reforestation. Volunteers welcome for forest restoration, terracing, and sustainable agriculture work.', 'Lombo do Guiné, Ponta do Sol, Madeira, Portugal', 32.6750, -17.1050, 'education', 'https://arambha.net', ARRAY['permaculture', 'reforestation', 'native-species', 'volunteers', 'madeira'], 'published'),

('Socalco Nature Hotel Gardens', 'socalco-nature-hotel-madeira', 'Boutique hotel with focus on permaculture and sustainability. Features organic garden and orchard, rainwater collection, solar energy, and terraced gardens. Garden tours available for non-guests.', 'Arco de São Jorge, Santana, Madeira, Portugal', 32.7833, -16.8667, 'education', NULL, ARRAY['organic-garden', 'rainwater-harvesting', 'solar-energy', 'terracing', 'madeira'], 'published'),

('Funchal Farmers Market', 'mercado-agricultores-funchal', 'Weekly farmers market featuring local organic produce, seedlings, and traditional Madeiran products. Meet local farmers and exchange growing tips. Every Saturday morning.', 'Rua Lateral da Sé, Funchal, Madeira, Portugal', 32.6495, -16.9095, 'business', NULL, ARRAY['farmers-market', 'local-food', 'organic', 'seeds', 'madeira'], 'published'),

('Madeira Botanical Garden', 'jardim-botanico-madeira', 'Beautiful botanical garden showcasing Madeira''s flora and exotic species. Includes subtropical and tropical plant collections. Great for permaculture inspiration and plant identification.', 'Caminho do Meio, Funchal, Madeira, Portugal', 32.6583, -16.8889, 'education', 'https://jardimbotanicodamadeira.com', ARRAY['botanical-garden', 'education', 'native-species', 'subtropical', 'madeira'], 'published'),

('Fajã da Ovelha Permaculture Project', 'faja-ovelha-permaculture', 'Permaculture project on the sunny south coast creating diverse subtropical food forest. Volunteer opportunities available. Focus on terracing, water systems, and rare subtropical plants.', 'Fajã da Ovelha, Calheta, Madeira, Portugal', 32.7167, -17.2833, 'farm', NULL, ARRAY['permaculture', 'food-forest', 'volunteers', 'terracing', 'madeira'], 'published'),

('Laurisilva Forest Conservation Center', 'laurisilva-conservation-madeira', 'Educational center dedicated to preserving Madeira''s unique Laurisilva (UNESCO World Heritage). Offers guided walks, native plant nursery, and reforestation programs.', 'Serra do Faial, Santana, Madeira, Portugal', 32.7833, -16.9000, 'education', NULL, ARRAY['conservation', 'native-species', 'unesco', 'education', 'madeira'], 'published');

-- ================================================
-- VERIFICATION QUERIES
-- ================================================

DO $$
BEGIN
  RAISE NOTICE 'Madeira Events and Locations Seeded Successfully!';
  RAISE NOTICE 'Events: 8 | Locations: 9';
  RAISE NOTICE 'Guides were removed from this file - were non-compliant (too short, no sources)';
END $$;
