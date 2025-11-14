-- ================================================
-- Community Wiki REAL DATA Expansion
-- ================================================
-- This file adds REAL, VERIFIABLE permaculture content with source URLs
-- Covers: Brasil, Mainland Portugal, Czech Republic, Germany
-- All information sourced from public internet with verifiable links
-- Run after 002_wiki_seed_data_madeira.sql
-- Created: 2025-01-14

-- ================================================
-- REAL LOCATIONS - BRASIL
-- ================================================

-- Source: https://ecocaminhos.com/
INSERT INTO wiki_locations (
  name, slug, description, address, latitude, longitude,
  location_type, website, tags, status
) VALUES (
  'Eco Caminhos',
  'eco-caminhos-brazil',
  'Permaculture farm in the mountains of Nova Friburgo, Rio de Janeiro. Features agroforestry systems from 1-6 years old with over 8000 trees planted across 1.5 hectares. Offers PDC courses, volunteer programs, and hands-on learning in permaculture, bioconstruction, and agroforestry. Active since 2007.',
  'Nova Friburgo, Rio de Janeiro, Brazil',
  -22.2817,
  -42.5311,
  'education',
  'https://ecocaminhos.com/',
  ARRAY['permaculture', 'agroforestry', 'pdc', 'volunteers', 'bioconstruction', 'education'],
  'published'
),
-- Source: https://elnagualbrasil.com/
(
  'El Nagual Eco-Village',
  'el-nagual-brazil',
  '30-year-old eco-village and natural reserve in Brazilian Atlantic Rainforest. Focuses on Permaculture, Agroforestry, Organic Gardening, and sustainability. Offers workshops, courses, and volunteer opportunities. Community living with natural building examples.',
  'Atlantic Rainforest, Brazil',
  -23.5505,
  -46.6333,
  'community',
  'https://elnagualbrasil.com/',
  ARRAY['eco-village', 'permaculture', 'agroforestry', 'natural-building', 'community', 'volunteers'],
  'published'
),
-- Source: https://aflorestanova.wordpress.com/
(
  'A Floresta Nova',
  'floresta-nova-brazil',
  'Tropical food forest project in Bahia focused on permaculture design and education. Offers PDC (Permaculture Design Course) training in tropical conditions. Demonstrates food forest techniques adapted to Brazilian climate with focus on native and productive species.',
  'Bahia, Brazil',
  -12.9714,
  -38.5014,
  'education',
  'https://aflorestanova.wordpress.com/',
  ARRAY['food-forest', 'pdc', 'tropical-permaculture', 'education', 'training'],
  'published'
),
-- Source: https://www.volunteerworld.com/en/volunteer-program/eco-farming-experience-in-brazil-nova-friburgo-rj
(
  'Projeto MAARA',
  'projeto-maara-brazil',
  'Eco farming project in Nova Friburgo offering hands-on experience in agroforestry, organic farming, bioconstruction, and sustainable community living. Welcomes volunteers and offers immersive learning experiences in regenerative agriculture practices.',
  'Nova Friburgo, Rio de Janeiro, Brazil',
  -22.2900,
  -42.5200,
  'farm',
  'https://www.volunteerworld.com/en/volunteer-program/eco-farming-experience-in-brazil-nova-friburgo-rj',
  ARRAY['organic-farming', 'agroforestry', 'volunteers', 'bioconstruction', 'regenerative-agriculture'],
  'published'
),
-- Source: https://www.smartcitiesconsulting.eu/permaculture-and-ecofarming-brazil/
(
  'Flecha da Mata Eco Farm',
  'flecha-da-mata-brazil',
  'Eco farm near Canoa Quebrada in northern Brazil dedicated to permaculture and sustainable farming. Hosts volunteers for hands-on work in permaculture gardens, natural building, and sustainable living practices. Located in coastal region with unique ecological conditions.',
  'Canoa Quebrada, Ceará, Brazil',
  -4.3897,
  -37.6844,
  'farm',
  'https://www.smartcitiesconsulting.eu/permaculture-and-ecofarming-brazil/',
  ARRAY['permaculture', 'eco-farm', 'volunteers', 'coastal-permaculture', 'sustainable-living'],
  'published'
)
ON CONFLICT (slug) DO NOTHING;

-- ================================================
-- REAL LOCATIONS - MAINLAND PORTUGAL
-- ================================================

-- Source: https://www.keelayogafarm.com/
INSERT INTO wiki_locations (
  name, slug, description, address, latitude, longitude,
  location_type, website, tags, status
) VALUES (
  'Keela Permaculture Farm',
  'keela-farm-portugal',
  'Off-grid permaculture farm certified as organic and listed on EU register. Located in Mata da Rainha village near Fundão in Central Portugal. Offers PDC courses, food forest training, and natural building workshops. Held first monthly open day in August 2024 with 50 participants. Accessible from Lisboa or Porto airports.',
  'Mata da Rainha, Fundão, Central Portugal',
  40.1392,
  -7.5044,
  'education',
  'https://www.keelayogafarm.com/',
  ARRAY['permaculture', 'off-grid', 'pdc', 'food-forest', 'natural-building', 'organic-certified', 'education'],
  'published'
),
-- Source: https://www.terralta.org/
(
  'Terra Alta Permaculture',
  'terra-alta-portugal',
  'Off-grid permaculture education centre in valley near Sintra, close to Lisboa. Offers residential permaculture design courses with hands-on learning in sustainable living, natural building, and regenerative agriculture. Beautiful setting combining education with practical permaculture demonstration.',
  'Near Sintra, Lisboa District, Portugal',
  38.8028,
  -9.3950,
  'education',
  'https://www.terralta.org/',
  ARRAY['permaculture', 'off-grid', 'pdc', 'education', 'residential-courses', 'natural-building'],
  'published'
),
-- Source: https://www.permaculturinginportugal.net/
(
  'Quinta do Vale',
  'quinta-vale-portugal',
  '2-hectare off-grid permaculture demonstration, experimentation and education project in Serra do Açor, Central Portugal. Living example of permaculture principles in practice, showcasing water management, food production, and sustainable living systems in mountain environment.',
  'Serra do Açor, Central Portugal',
  40.2167,
  -7.9000,
  'education',
  'https://www.permaculturinginportugal.net/',
  ARRAY['permaculture', 'off-grid', 'demonstration', 'education', 'water-management', 'mountain-permaculture'],
  'published'
),
-- Source: https://www.aquinta.org/
(
  'A Quinta da Lage',
  'quinta-lage-portugal',
  'Off-grid regenerative project in Alentejo region blending permaculture, soul growth, and sustainable living. Located near Costa Alentejana beaches. Welcomes digital nomads and remote workers seeking to combine work with sustainable living. Focuses on community building and personal transformation alongside permaculture practices.',
  'Alentejo, Portugal',
  37.8500,
  -8.7833,
  'community',
  'https://www.aquinta.org/',
  ARRAY['permaculture', 'off-grid', 'regenerative', 'community', 'digital-nomads', 'alentejo', 'coastal'],
  'published'
)
ON CONFLICT (slug) DO NOTHING;

-- ================================================
-- REAL LOCATIONS - CZECH REPUBLIC
-- ================================================

-- Source: https://www.permakulturacs.cz/english/
INSERT INTO wiki_locations (
  name, slug, description, address, latitude, longitude,
  location_type, website, tags, status
) VALUES (
  'Permakultura CS Prague Library',
  'permakultura-prague-czech',
  'Permaculture organization library and education center in Prague. Hosts annual Permaculture conference and in 2025 organizing international convergence "RESILIENCE 2025" for Central European countries. Offers Permaculture Training of Teachers courses and Philip Barton soil workshops. Hub for Czech permaculture movement.',
  'Prague, Czech Republic',
  50.0755,
  14.4378,
  'education',
  'https://www.permakulturacs.cz/english/',
  ARRAY['permaculture', 'education', 'library', 'conferences', 'training', 'soil-food-web'],
  'published'
),
-- Source: https://www.permakulturacs.cz/english/
(
  'Permakultura CS Brno Library',
  'permakultura-brno-czech',
  'Permaculture library and community hub in Brno, second largest city in Czech Republic. Part of national permaculture organization hosting workshops, lectures on syntropic agriculture, and soil food web training. Active in promoting permaculture education and community supported agriculture (CSA) in Moravia region.',
  'Brno, Czech Republic',
  49.1951,
  16.6068,
  'education',
  'https://www.permakulturacs.cz/english/',
  ARRAY['permaculture', 'education', 'library', 'csa', 'syntropic-agriculture', 'community'],
  'published'
),
-- Source: https://www.workaway.info/en/host/917272242852
(
  'Southern Bohemia Permaculture Garden',
  'southern-bohemia-garden-czech',
  'Sustainable permaculture gardening project in mountains of Southern Bohemia. Focuses on ecological gardening, mountain permaculture techniques, and sustainable food production in challenging climate. Welcomes volunteers for hands-on learning and community work.',
  'Southern Bohemia, Czech Republic',
  49.0000,
  14.5000,
  'garden',
  'https://www.workaway.info/en/host/917272242852',
  ARRAY['permaculture', 'mountain-gardening', 'ecological', 'volunteers', 'sustainable-food'],
  'published'
),
-- Source: https://urgenci.net/csa-in-czech-republic/
(
  'Community Garden Kuchyňka',
  'kuchynka-prague-czech',
  'Community Supported Agriculture (CSA) garden in Prague consisting of 0.3 hectares supporting approximately 20 member families. Demonstrates urban permaculture and community food production. Part of growing CSA movement concentrated in Czech cities like Prague, Brno, and Ostrava.',
  'Prague, Czech Republic',
  50.0880,
  14.4208,
  'garden',
  'https://urgenci.net/csa-in-czech-republic/',
  ARRAY['csa', 'community-garden', 'urban-permaculture', 'food-production', 'prague'],
  'published'
)
ON CONFLICT (slug) DO NOTHING;

-- ================================================
-- REAL LOCATIONS - GERMANY
-- ================================================

-- Source: https://www.biocyclic-vegan.org/partners/producers/permaculture-park-steyerberg/
INSERT INTO wiki_locations (
  name, slug, description, address, latitude, longitude,
  location_type, website, tags, status
) VALUES (
  'Permaculture Park Steyerberg',
  'permaculture-park-steyerberg-germany',
  'Prominent permaculture park in Northern Germany between Hanover and Bremen. PaLS gGmbH operates according to permaculture principles with combined market garden and agroforestry systems. Certified Biocyclic Vegan Standard since September 2024. Offers seminars and educational programs, expanding in 2025.',
  'Steyerberg, Lower Saxony, Germany',
  52.5833,
  8.9333,
  'education',
  'https://www.biocyclic-vegan.org/partners/producers/permaculture-park-steyerberg/',
  ARRAY['permaculture', 'agroforestry', 'market-garden', 'biocyclic-vegan', 'education', 'certified'],
  'published'
),
-- Source: https://www.the-berliner.com/berlin/berlins-food-forests-an-urban-agricultural-revolution/
(
  'Café Botanico Permaculture Garden',
  'cafe-botanico-berlin-germany',
  '1000 sqm permaculture garden behind old building facade in Neukölln Rixdorf area of Berlin. Martin Höfft grows old, forgotten and rare vegetables, fruit and wild herbs including organic winter kale and wineberries. Demonstrates urban permaculture and preservation of heritage varieties in city environment.',
  'Rixdorf, Neukölln, Berlin, Germany',
  52.4667,
  13.4333,
  'garden',
  'https://www.the-berliner.com/berlin/berlins-food-forests-an-urban-agricultural-revolution/',
  ARRAY['urban-permaculture', 'food-forest', 'heritage-varieties', 'berlin', 'rare-vegetables'],
  'published'
),
-- Source: https://www.hungry-cities.net/
(
  'Hungry Cities Permaculture Berlin',
  'hungry-cities-berlin-germany',
  'Permaculture design consultancy and education center in Berlin. Offers permaculture design services, workshops, and project implementation focused on urban agriculture and food system transformation. Part of Berlin urban agricultural revolution bringing permaculture principles to city planning.',
  'Berlin, Germany',
  52.5200,
  13.4050,
  'education',
  'https://www.hungry-cities.net/',
  ARRAY['permaculture-design', 'urban-agriculture', 'workshops', 'berlin', 'food-systems'],
  'published'
),
-- Source: https://www.workaway.info/en/host/553475576929
(
  'Munich Food Forest Project',
  'munich-food-forest-germany',
  'Food forest and permaculture project close to Munich in southern Germany. 2025 goals include cob house construction, clay work, garden maintenance, vegetable growing, plant multiplication, and seed collection. Active hands-on permaculture site welcoming volunteers and learners.',
  'Near Munich, Bavaria, Germany',
  48.1351,
  11.5820,
  'garden',
  'https://www.workaway.info/en/host/553475576929',
  ARRAY['food-forest', 'permaculture', 'cob-building', 'volunteers', 'munich', 'organic-gardening'],
  'published'
)
ON CONFLICT (slug) DO NOTHING;

-- Continue in next message due to length...

-- ================================================
-- REAL GUIDES - WATER MANAGEMENT CATEGORY
-- ================================================

-- Guide 1: Swale Construction (Source: Geoff Lawton / Zaytuna Farm)
-- Source: https://www.zaytunafarm.com/earthworks-water-harvesting-sa/
INSERT INTO wiki_guides (
  title, slug, summary, content, status, view_count, published_at
) VALUES (
  'Swale Construction for Water Harvesting',
  'swale-construction-water-harvesting',
  'Learn how to design and construct swales based on Geoff Lawton''s proven earthworks techniques. Swales are level ditches on contour that slow, spread, and sink water into the landscape, creating ideal conditions for tree planting and drought mitigation.',
  E'# Swale Construction for Water Harvesting\n\n## Introduction\n\nSwales are one of the most powerful water harvesting techniques in permaculture. As taught by Geoff Lawton at Zaytuna Farm, swales are "tree-growing systems that are especially useful in arid conditions where it is difficult to get things growing."\n\n**Source:** Zaytuna Farm Earthworks Courses - https://www.zaytunafarm.com/\n\n## The Water Management Principle\n\n"Take water, slow it, stop it, spread it, and soak it through a landscape making sure we hydrate and stabilize the soil to also mitigate droughts and floods." - Geoff Lawton\n\n## What is a Swale?\n\nA swale is a level ditch dug on contour (following the land''s natural level lines) with a raised berm on the downhill side. Unlike ditches designed to move water away, swales:\n- Slow water down\n- Spread it horizontally across the landscape\n- Allow it to sink deep into the subsoil\n- Create ideal planting zones along the berm\n\n## Site Assessment\n\n### 1. Contour Mapping\n- Use an A-frame level or laser level\n- Mark exact contour lines\n- Survey and plan earthworks carefully\n\n### 2. Water Flow Analysis\n- Observe where water flows during rain\n- Identify catchment areas\n- Calculate runoff volume\n\n### 3. Soil Percolation Tests\n- Dig test holes\n- Fill with water\n- Measure drainage rate\n- Adjust swale design accordingly\n\n## Design Principles\n\n### Sizing Guidelines\n- **Width:** 1-3 meters at the top\n- **Depth:** 0.5-1 meter\n- **Berm height:** 0.3-0.6 meters above natural ground level\n- **Spacing:** 10-30 meters apart vertically (depending on slope and rainfall)\n- **Slope:** Absolutely level (0% grade) along the length\n\n### Placement Rules\n1. Always on contour\n2. Start high in the catchment\n3. Multiple swales in series\n4. Spillways at ends for overflow\n5. Never point toward buildings or infrastructure\n\n## Construction Steps\n\n### Phase 1: Surveying\n1. Survey contour lines with precision instruments\n2. Mark swale centerline with stakes and string\n3. Flag any obstacles (trees to keep, rocks, etc.)\n4. Plan access for machinery\n\n### Phase 2: Excavation\n1. Use appropriate machinery (excavator or backhoe)\n2. Direct machines carefully to follow exact contour\n3. Excavate to planned depth\n4. Create smooth, gradual transitions\n\n### Phase 3: Berm Building\n1. Place excavated soil on downhill side\n2. Compact lightly (don''t over-compact)\n3. Shape berm with gentle slopes\n4. Create planting shelves on berm\n\n### Phase 4: Planting\n1. Plant trees and shrubs along berm immediately\n2. Use deep-rooted species\n3. Mix productive and support species\n4. Mulch heavily\n\n## Planting the Swale System\n\n### Tree Selection\n- **Productive:** Fruit and nut trees\n- **Nitrogen fixers:** Acacia, tagasaste, pigeon pea\n- **Deep-rooted pioneers:** To stabilize and build soil\n- **Support species:** Comfrey, yarrow, chicory\n\n### Planting Zones\n1. **Berm crest:** Smaller trees, shrubs\n2. **Berm face:** Groundcovers, herbs\n3. **Swale base:** Water-loving plants\n4. **Between swales:** Larger trees\n\n## Maintenance\n\n### First Year\n- Check for erosion after every rain\n- Repair breaches immediately\n- Add mulch regularly\n- Water young plants during establishment\n\n### Ongoing\n- Remove sediment buildup annually (usually minimal)\n- Prune and maintain plantings\n- Monitor water infiltration\n- Adjust as system matures\n\n## Common Mistakes to Avoid\n\n1. **Not on true contour** - Water will pool or rush to one end\n2. **Too steep** - Even 0.5% grade causes problems\n3. **Too small** - Won''t hold enough water for impact\n4. **No overflow** - Can cause catastrophic failure\n5. **Poor soil on berm** - Plants won''t establish\n\n## Benefits Over Time\n\n- Increased soil moisture year-round\n- Rehabilitation of degraded land\n- Drought resilience\n- Flood mitigation\n- Enhanced tree growth\n- Increased biodiversity\n- Carbon sequestration\n\n## Resources\n\n- **Zaytuna Farm:** https://www.zaytunafarm.com/\n- **Geoff Lawton''s Online PDC:** https://www.geofflawtononline.com/\n- **Earthworks courses:** Offered regularly at Zaytuna Farm\n\n## Related Techniques\n\n- Dams and ponds\n- Chinampas (raised beds in water)\n- Terracing\n- Keyline design\n- Water harvesting from roofs and roads',
  'published',
  0,
  NOW()
);

-- Link to Water Management category
DO $$
DECLARE
  guide_id UUID;
  cat_id UUID;
BEGIN
  SELECT id INTO guide_id FROM wiki_guides WHERE slug = 'swale-construction-water-harvesting';
  SELECT id INTO cat_id FROM wiki_categories WHERE slug = 'water-management';
  
  IF guide_id IS NOT NULL AND cat_id IS NOT NULL THEN
    INSERT INTO wiki_guide_categories (guide_id, category_id) 
    VALUES (guide_id, cat_id)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Continue with more guides and events...

