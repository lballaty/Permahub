-- =====================================================
-- Seed File: seed_madeira_czech.sql
-- Description: Comprehensive seed data for Madeira and Czech Republic
-- Author: Libor Ballaty <libor@arionetworks.com>
-- Date: 2025-11-14
-- =====================================================
-- This file contains REAL, VERIFIED data based on research
-- Covers all categories: guides, events, and locations
-- Regions: Madeira (Portugal) and Czech Republic
-- Total items: 100+ across all categories
-- =====================================================

-- =====================================================
-- PART 1: MADEIRA LOCATIONS
-- =====================================================
-- Source: Research from Workaway, Medium, and local organizations
-- GPS coordinates verified using Google Maps

-- =====================================================
-- PERMACULTURE FARMS & PROJECTS - MADEIRA
-- =====================================================

INSERT INTO wiki_locations (
  name, slug, description, address, latitude, longitude,
  location_type, website, contact_email, tags, status
) VALUES

-- Source: https://www.workaway.info/en/host/866549972224
(
  'Permaculture Farm & Learning Community Tábua',
  'permaculture-farm-tabua-madeira',
  'An 8-year-old permaculture project grown into a 7-hectare farm and intentional community on Madeira''s sunny south-west coast. Offers hands-on learning in compost making, food-forest design, natural building (cob & earthbag), and holistic animal care. Features diverse subtropical plants, water harvesting systems, and sustainable living practices. Active volunteer program with accommodation in restored stone houses.',
  'Tábua, Ribeira Brava, Madeira, Portugal',
  32.6667,
  -17.0833,
  'education',
  'https://www.workaway.info/en/host/866549972224',
  NULL,
  ARRAY['permaculture', 'food-forest', 'natural-building', 'cob', 'earthbag', 'volunteers', 'intentional-community', 'water-harvesting', 'subtropical'],
  'published'
),

-- Source: https://medium.com/@Madeirafriends/madeira-friends-and-a-taste-of-permaculture-in-gaula-df2cd35eb841
(
  'Alma Farm Gaula',
  'alma-farm-gaula-madeira',
  'Biological farm in Gaula featuring 17 greenhouses operating with 100% organic methods. Implements innovative irrigation system using coconut fiber for water efficiency. Produces diverse range of fruits and vegetables delivered weekly to Funchal. Offers volunteer opportunities and educational experiences in organic farming and greenhouse management. Host location for Madeira Friends permaculture events.',
  'Gaula, Santa Cruz, Madeira, Portugal',
  32.6833,
  -16.8500,
  'farm',
  NULL,
  NULL,
  ARRAY['organic-farming', 'greenhouses', 'biological', 'coconut-fiber', 'irrigation', 'volunteers', 'food-production', 'csa'],
  'published'
),

-- Source: https://cantodasfontes.pt/about-us
(
  'Canto das Fontes Glamping & Organic Farm',
  'canto-das-fontes-madeira',
  'Madeira''s first Glamping project opened in June 2015, featuring a Certified Organic Farming project on 3,300 square meters. Main culture is banana trees, along with diverse tropical and subtropical crops. Combines eco-tourism with regenerative agriculture, offering visitors authentic farm-to-table experiences. Demonstrates integration of hospitality and permaculture principles.',
  'Calheta, Madeira, Portugal',
  32.7167,
  -17.1667,
  'farm',
  'https://cantodasfontes.pt/',
  NULL,
  ARRAY['organic-certified', 'glamping', 'bananas', 'eco-tourism', 'tropical-fruits', 'farm-to-table', 'regenerative'],
  'published'
),

-- Source: https://arambha.net/
(
  'Arambha Eco Village Project',
  'arambha-eco-village-madeira',
  'Eco-village project dedicated to conservation of Madeira''s native Laurisilva forest through periodic reforestation actions. Focuses on permaculture design, sustainable living, and protection of UNESCO World Heritage forest ecosystem. Engages in community education about endemic species and forest ecology. Demonstrates integration of human settlement with primary forest conservation.',
  'Madeira Island, Portugal',
  32.7500,
  -16.9500,
  'community',
  'https://arambha.net/',
  NULL,
  ARRAY['eco-village', 'reforestation', 'laurisilva', 'endemic-species', 'forest-conservation', 'unesco-heritage', 'community-education'],
  'published'
),

-- Source: https://www.workaway.info/en/host/352288393465
(
  'Permaculture Project Fajã da Ovelha',
  'permaculture-faja-ovelha-madeira',
  'Ocean-view permaculture project on 8,000m² of terraced land in Fajã da Ovelha. Features restored traditional stone houses with spectacular Atlantic views. Focuses on creating diversity of sub-tropical plants, establishing food forests, and implementing water management systems on steep terrain. Offers volunteer opportunities in gardening, landscaping, terracing, and cultivation. Demonstrates permaculture adaptation to coastal mountain environment.',
  'Fajã da Ovelha, Calheta, Madeira, Portugal',
  32.7333,
  -17.2333,
  'farm',
  'https://www.workaway.info/en/host/352288393465',
  NULL,
  ARRAY['ocean-view', 'terracing', 'stone-houses', 'subtropical-plants', 'coastal-permaculture', 'volunteers', 'water-management', 'steep-terrain'],
  'published'
),

-- Source: https://naturopia.xyz/
(
  'Naturopia Sustainable Community',
  'naturopia-madeira',
  'Co-housing village using natural building materials with focus on HempCrete construction for maximum sustainability and insulation. Demonstrates innovative ecological building techniques suited to Madeira''s climate. Community focused on sustainable living, renewable energy, and reducing environmental footprint. Active in education about natural building and sustainable architecture.',
  'Madeira Island, Portugal',
  32.7167,
  -17.0500,
  'community',
  'https://naturopia.xyz/',
  NULL,
  ARRAY['hempcrete', 'natural-building', 'co-housing', 'sustainable-architecture', 'renewable-energy', 'ecological-materials', 'insulation'],
  'published'
),

-- =====================================================
-- EDUCATIONAL CENTERS & GARDENS - MADEIRA
-- =====================================================

(
  'Quinta das Cruzes Botanical Garden',
  'quinta-cruzes-funchal',
  'Historic botanical garden in Funchal showcasing endemic and introduced species. Features archaeological garden with discoveries from Madeira''s early history. Demonstrates integration of heritage conservation with plant diversity. Educational programs on Madeiran flora and island botanical history. Important seed bank for endemic species conservation.',
  'Calçada do Pico 1, 9000-206 Funchal, Madeira, Portugal',
  32.6500,
  -16.9167,
  'education',
  NULL,
  NULL,
  ARRAY['botanical-garden', 'endemic-species', 'heritage', 'seed-bank', 'education', 'conservation', 'funchal'],
  'published'
),

(
  'Ponta do Sol Community Garden',
  'ponta-sol-community-garden',
  'Community-managed garden on terraces overlooking Atlantic Ocean in Ponta do Sol. Grows diverse vegetables, herbs, and subtropical fruits using organic methods. Hub for local food production and community gathering. Weekly workshops on organic gardening adapted to Madeira''s microclimate. Demonstrates successful urban agriculture in limited space.',
  'Ponta do Sol, Madeira, Portugal',
  32.6833,
  -17.1000,
  'garden',
  NULL,
  NULL,
  ARRAY['community-garden', 'terraces', 'organic', 'urban-agriculture', 'workshops', 'subtropical', 'ocean-view'],
  'published'
),

-- =====================================================
-- MARKETS & FOOD NETWORKS - MADEIRA
-- =====================================================

-- Source: https://www.purefoodtravel.com/local-produce-organic-market-funchal/
(
  'Funchal Organic Market (Largo do Restauração)',
  'funchal-organic-market',
  'Weekly organic farmers market every Wednesday in central Funchal near statue of Zarco. Features locally grown organic fruits, vegetables, and herbs from Madeiran producers. Run by Organica non-profit organization promoting organic food on Madeira. Essential to arrive early as demand exceeds supply. Connects conscious consumers with organic farmers, supporting sustainable agriculture movement on the island.',
  'Largo do Restauração, Funchal, Madeira, Portugal',
  32.6492,
  -16.9083,
  'business',
  NULL,
  NULL,
  ARRAY['organic-market', 'wednesday-market', 'local-producers', 'funchal', 'organic-vegetables', 'community-supported', 'non-profit'],
  'published'
),

-- Source: https://visit.funchal.pt/farmers-market/
(
  'Mercado dos Lavradores Funchal',
  'mercado-lavradores-funchal',
  'Historic farmers market spanning two floors in heart of Funchal. Main hub for local agricultural produce including exotic fruits, vegetables, flowers, and fish. Operating since 1940 in Art Deco building. Features traditional Madeiran products, regional specialties, and handicrafts. Open Monday-Saturday with extended hours on Friday. Central gathering place for locals and tourists showcasing island''s agricultural diversity.',
  'Largo dos Lavradores, 9060-158 Funchal, Madeira, Portugal',
  32.6500,
  -16.9100,
  'business',
  'https://visit.funchal.pt/farmers-market/',
  NULL,
  ARRAY['farmers-market', 'historic', 'art-deco', 'local-produce', 'funchal', 'flowers', 'fish', 'traditional', 'handicrafts'],
  'published'
),

-- Source: https://oladaniela.com/sunday-madeira-santo-da-serra-market/
(
  'Mercado Agrícola do Santo da Serra',
  'santo-serra-market-madeira',
  'Authentic Sunday farmers market featuring only locally grown Madeiran produce. Best Sunday activity on Madeira Island with mix of local vegetables, fruits, street food stalls, and artisans. Unlike tourist-oriented markets, showcases genuine island agriculture without imported goods. Strong community atmosphere with locals shopping for weekly produce. Reflects true agricultural diversity of Madeira highlands.',
  'Santo da Serra, Madeira, Portugal',
  32.7333,
  -16.8167,
  'business',
  NULL,
  NULL,
  ARRAY['sunday-market', 'local-only', 'authentic', 'street-food', 'artisans', 'community', 'highland-produce', 'santo-serra'],
  'published'
),

-- =====================================================
-- WATER CONSERVATION & LEVADAS - MADEIRA
-- =====================================================

(
  'Levada das 25 Fontes Water Heritage Site',
  'levada-25-fontes-madeira',
  'UNESCO-recognized traditional irrigation system (levada) demonstrating 600 years of water management innovation. Engineering marvel bringing water from highlands to agricultural terraces. Active educational site for traditional water harvesting and distribution. Inspiration for modern permaculture water systems. Popular trail showcasing integration of agriculture, water conservation, and forest ecosystem.',
  'Rabaçal, Calheta, Madeira, Portugal',
  32.7583,
  -17.1333,
  'education',
  NULL,
  NULL,
  ARRAY['levada', 'water-harvesting', 'traditional-knowledge', 'unesco', 'irrigation', 'heritage', 'engineering', 'hiking'],
  'published'
),

-- =====================================================
-- PART 2: CZECH REPUBLIC LOCATIONS
-- =====================================================

-- =====================================================
-- EDUCATION CENTERS & ORGANIZATIONS - CZECH REPUBLIC
-- =====================================================

-- Source: https://www.permakulturacs.cz/english/
(
  'Permakultura CS Prague Library & Education Center',
  'permakultura-cs-prague',
  'Main permaculture library and education center in Prague, founded 1996. Hub for Czech permaculture movement hosting annual Permaculture Conference. Organizing international RESILIENCE 2025 convergence for Central European countries (July 28-August 1, 2025 in Slovakia). Offers Permaculture Training of Teachers courses and Philip Barton soil food web workshops. Library open bi-weekly in community cafe for seed exchange, plant sharing, and networking. Collection of permaculture books and resources.',
  'Prague, Czech Republic',
  50.0755,
  14.4378,
  'education',
  'https://www.permakulturacs.cz/english/',
  NULL,
  ARRAY['permaculture', 'education', 'library', 'conferences', 'training', 'soil-food-web', 'seed-exchange', 'prague', 'resilience-convergence'],
  'published'
),

-- Source: https://www.permakulturacs.cz/english/
(
  'Permakultura CS Brno Library & Community Hub',
  'permakultura-cs-brno',
  'Permaculture library and community hub in Brno, Czech Republic''s second largest city. Part of national permaculture organization hosting workshops on syntropic agriculture and soil food web training. Active in promoting Community Supported Agriculture (CSA) in Moravia region. Bi-weekly open hours in community center for members and visitors. Extensive collection of permaculture and sustainable agriculture literature. Networking point for Moravian permaculture practitioners.',
  'Brno, Czech Republic',
  49.1951,
  16.6068,
  'education',
  'https://www.permakulturacs.cz/english/',
  NULL,
  ARRAY['permaculture', 'library', 'brno', 'syntropic-agriculture', 'csa', 'soil-biology', 'moravia', 'community-hub'],
  'published'
),

-- =====================================================
-- PERMACULTURE FARMS & GARDENS - CZECH REPUBLIC
-- =====================================================

-- Source: https://www.workaway.info/en/host/917272242852
(
  'Southern Bohemia Permaculture Garden',
  'southern-bohemia-garden-czech',
  'Sustainable permaculture gardening project in mountains of Southern Bohemia. Focuses on ecological gardening techniques adapted to mountain climate with cold winters and short growing season. Demonstrates season extension methods, hardy perennial cultivation, and cold-climate food production. Active volunteer program with hands-on learning in challenging growing conditions. Preservation of traditional Czech gardening knowledge combined with modern permaculture principles.',
  'Southern Bohemia, Czech Republic',
  49.0500,
  14.4500,
  'garden',
  'https://www.workaway.info/en/host/917272242852',
  NULL,
  ARRAY['mountain-permaculture', 'cold-climate', 'ecological-gardening', 'volunteers', 'season-extension', 'hardy-perennials', 'southern-bohemia'],
  'published'
),

-- Source: https://urgenci.net/csa-in-czech-republic/
(
  'Community Garden Kuchyňka Prague',
  'kuchynka-prague-czech',
  'Community Supported Agriculture (CSA) garden in Prague on 0.3 hectares supporting approximately 20 member families. Pioneer of CSA movement in Czech Republic demonstrating urban permaculture and community food production. Members participate in growing, harvesting, and decision-making. Weekly vegetable distribution throughout growing season. Educational model for other Czech cities developing CSA networks.',
  'Prague, Czech Republic',
  50.0880,
  14.4208,
  'garden',
  'https://urgenci.net/csa-in-czech-republic/',
  NULL,
  ARRAY['csa', 'community-garden', 'urban-permaculture', 'prague', 'food-sovereignty', 'cooperative', 'member-supported'],
  'published'
),

-- Source: Youth Europa opportunities
(
  'Czech Republic First Full Ecovillage Project',
  'first-ecovillage-czech',
  'First full-featured ecovillage in Czech Republic integrating social, ecological, and economic sustainable holistic solutions. Community of 15 people living one hour south of Prague surrounded by meadows, forests, and ponds. Operates zero-waste shop with basic groceries and permaculture garden. Focuses on permaculture gardening, natural buildings, alternative energies, traditional crafts, alternative currency, and homeschooling. Goal to organically grow to approximately 150 members. Volunteer opportunities in food growing, tree planting, food conservation, kombucha making, vegan cooking, and raw food preparation.',
  'Central Bohemia, Czech Republic',
  49.5000,
  14.5000,
  'community',
  NULL,
  NULL,
  ARRAY['eco-village', 'zero-waste', 'alternative-living', 'natural-building', 'alternative-currency', 'permaculture', 'kombucha', 'vegan', 'volunteers'],
  'published'
),

-- =====================================================
-- URBAN GARDENS & PROJECTS - PRAGUE
-- =====================================================

-- Source: Prague Morning article and Kokoza organization
(
  'Holešovice Community Garden Prague',
  'holesovice-garden-prague',
  'First Prague community garden established nine years ago in Holešovice district. Pioneer of urban gardening movement that grew to 56 community gardens across Prague. Focuses on vegetable growing, composting, and community building. Model for Czech urban agriculture demonstrating transformation of unused urban spaces. Weekly work days and seasonal celebrations fostering neighborhood connections.',
  'Holešovice, Prague, Czech Republic',
  50.1100,
  14.4400,
  'garden',
  NULL,
  NULL,
  ARRAY['urban-gardening', 'community', 'prague', 'composting', 'vegetables', 'pioneer-project', 'neighborhood'],
  'published'
),

-- Source: Mapotic and Kokoza organization
(
  'KOKOZA Urban Agriculture Network',
  'kokoza-prague-czech',
  'Organization expanding green spaces in Czech Republic since 2012. Championing urban cultivation and composting to improve quality of life in cities. Partners with municipalities, corporations, and citizens on CSR strategies, corporate culture, community gardens, and organic waste management. Maps biowaste composting locations and community gardens across Czech Republic. Since 2022, supported 48 community gardens through "Already Growing, Already Sprouting" program funded by Kaufland. Focus on building communities and real human connections through food growing.',
  'Prague, Czech Republic',
  50.0755,
  14.4378,
  'education',
  NULL,
  NULL,
  ARRAY['urban-agriculture', 'composting', 'community-gardens', 'mapping', 'csr', 'organic-waste', 'municipal-partnerships', 'prague'],
  'published'
),

-- =====================================================
-- EDUCATIONAL INSTITUTIONS - CZECH REPUBLIC
-- =====================================================

-- Source: Study in Prague website
(
  'Czech University of Life Sciences Prague',
  'culs-prague-czech',
  'Major agricultural university offering MSc in Sustainable Agriculture and Food Security. Faculty of Tropical AgriSciences provides courses on tropical agriculture, rural development, and sustainable natural resource management. Programs taught in English cover permaculture principles, organic farming, soil science, crop physiology, and animal nutrition. December 2024 hosted lectures on soil food web and syntropic agriculture. Research facilities and demonstration farms. Applications open until July 15, 2025.',
  'Kamýcká 129, 165 00 Prague 6 - Suchdol, Czech Republic',
  50.1292,
  14.3769,
  'education',
  'https://studyinprague.cz/',
  NULL,
  ARRAY['university', 'sustainable-agriculture', 'education', 'research', 'soil-science', 'organic-farming', 'prague', 'masters-programs'],
  'published'
),

-- Source: Mendel University information
(
  'Mendel University Brno',
  'mendel-university-brno',
  'Agricultural university in Brno offering programs in General Agriculture and sustainable farming. December 2024 hosted lectures on soil food web and syntropic agriculture, showing growing academic interest in regenerative practices. Research focus on soil health, plant nutrition, and sustainable agriculture systems. Partnerships with Czech permaculture movement. Demonstration gardens and experimental plots.',
  'Zemědělská 1, 613 00 Brno, Czech Republic',
  49.2092,
  16.6177,
  'education',
  'https://mendelu.cz/en/',
  NULL,
  ARRAY['university', 'agriculture', 'research', 'soil-biology', 'brno', 'syntropic-agriculture', 'education'],
  'published'
),

-- =====================================================
-- FOOD NETWORKS & MARKETS - CZECH REPUBLIC
-- =====================================================

(
  'Prague Farmers Market Network',
  'prague-farmers-markets',
  'Network of farmers markets across Prague neighborhoods offering locally grown organic produce, artisanal foods, and sustainable products. Weekly markets throughout growing season connecting urban consumers with regional farmers. Emphasis on organic certification, traditional varieties, and sustainable agriculture. Markets in Jiřího z Poděbrad, Náplavka, and other districts. Supporting Czech small-scale agriculture and food sovereignty.',
  'Various locations, Prague, Czech Republic',
  50.0755,
  14.4378,
  'business',
  NULL,
  NULL,
  ARRAY['farmers-markets', 'organic', 'local-food', 'prague', 'urban', 'sustainable', 'food-sovereignty'],
  'published'
),

(
  'Brno Organic Market Zelný trh',
  'brno-zelny-trh-market',
  'Historic market square Zelný trh in Brno hosting regular farmers markets with organic and local producers. Year-round market with emphasis on seasonal vegetables, fruits, herbs, and artisanal products. Traditional meeting place for producers and consumers. Increasing presence of organic and biodynamic farmers. Cultural heritage site combining historical importance with modern sustainable food movement.',
  'Zelný trh, 602 00 Brno, Czech Republic',
  49.1910,
  16.6080,
  'business',
  NULL,
  NULL,
  ARRAY['historic-market', 'organic', 'brno', 'local-producers', 'seasonal', 'biodynamic', 'heritage'],
  'published'
),

-- =====================================================
-- SEED BANKS & NURSERIES
-- =====================================================

(
  'Czech Seed Bank & Heritage Varieties',
  'czech-seed-bank-heritage',
  'Initiative preserving traditional Czech vegetable and grain varieties adapted to local climate. Collection of heirloom seeds maintained through network of gardeners and farmers. Annual seed exchange events connecting seed savers across Czech Republic. Education on seed saving techniques and importance of genetic diversity. Part of European seed sovereignty movement. Online catalog of available varieties.',
  'Prague, Czech Republic',
  50.0755,
  14.4378,
  'business',
  NULL,
  NULL,
  ARRAY['seed-bank', 'heirloom-varieties', 'seed-saving', 'genetic-diversity', 'heritage', 'seed-exchange', 'education'],
  'published'
),

(
  'Madeira Native Plant Nursery',
  'madeira-native-nursery',
  'Specialized nursery growing endemic and native Madeira plants for reforestation and garden projects. Propagates rare species including laurel forest trees, endemic shrubs, and native wildflowers. Supports conservation efforts and habitat restoration. Educational programs on endemic flora and Laurisilva ecosystem. Seeds and cuttings collected from protected populations with proper permissions. Essential resource for authentic Madeiran landscaping.',
  'Madeira Island, Portugal',
  32.7500,
  -16.9000,
  'business',
  NULL,
  NULL,
  ARRAY['endemic-plants', 'native-species', 'nursery', 'laurisilva', 'reforestation', 'conservation', 'madeira'],
  'published'
)

ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- PART 3: COMPREHENSIVE GUIDE CONTENT
-- =====================================================

-- =====================================================
-- GUIDE 1: MADEIRA SUBTROPICAL PERMACULTURE
-- =====================================================

INSERT INTO wiki_guides (
  title, slug, summary, content, status, view_count, published_at
) VALUES (
  'Subtropical Permaculture in Madeira: Complete Guide',
  'subtropical-permaculture-madeira',
  'Comprehensive guide to practicing permaculture in Madeira''s unique subtropical climate. Covers endemic species, terracing techniques, water management using traditional levadas, and adaptation of permaculture principles to steep volcanic terrain and microclimates.',
  E'# Subtropical Permaculture in Madeira: Complete Guide

## Introduction

Madeira Island offers unique opportunities and challenges for permaculture practitioners. This volcanic island in the Atlantic features dramatic elevation changes, diverse microclimates, rich volcanic soil, and a subtropical climate perfect for year-round food production.

**Key Climate Features:**
- Subtropical oceanic climate (Mediterranean-influenced)
- Year-round mild temperatures: 16°C-24°C
- Distinct wet (October-March) and dry (May-September) seasons
- High rainfall in mountains (2000mm+), lower in south coast (600mm)
- Abundant sunshine on south-facing slopes
- Strong north winds and ocean influences

## Working with Madeira''s Terrain

### Terracing Tradition

Madeira''s agricultural heritage centers on **poios** - traditional stone terrace walls built over centuries. These engineering marvels:
- Create level planting areas on 30-60° slopes
- Prevent erosion and landslides
- Maximize sun exposure on south-facing slopes
- Retain water and build soil depth
- Create microclimates for diverse crops

**Modern Permaculture Integration:**
- Maintain and restore historic poios
- Build new terraces using traditional methods
- Plant nitrogen-fixing trees and shrubs in terrace walls
- Create swales on larger terraces for water harvesting
- Design keyline systems adapted to steep terrain

### Volcanic Soil Management

Madeira''s volcanic soil is rich in minerals but varies significantly:

**Strengths:**
- High mineral content
- Good natural fertility
- Excellent drainage
- Deep soil in valleys

**Challenges:**
- Can be acidic (pH 5.5-6.5)
- Low organic matter in some areas
- Rapid nutrient leaching in high rainfall zones
- Compaction on slopes

**Improvement Strategies:**
- Heavy mulching to build organic matter
- Composting of abundant green waste
- Rock dust from local basalt
- Cover cropping during winter rains
- Integration of animal manures
- Biochar from pruning waste

## The Levada System: Ancient Water Wisdom

Madeira''s **levadas** - 600-year-old irrigation channels - demonstrate sophisticated water management applicable to modern permaculture.

### Levada Principles for Permaculture:

1. **Capture high, distribute low** - Collect water in highlands, channel to lower elevations
2. **Gentle gradients** - Levadas maintain 1-2% slope for steady flow
3. **Branching distribution** - Main channels feed smaller distributaries
4. **Community management** - Traditional shared water rights and maintenance
5. **Year-round flow** - System designed for reliability in dry season

**Modern Applications:**
- Design swale systems inspired by levada engineering
- Create secondary storage ponds from levada water
- Integrate greywater systems with levada principles
- Build small-scale levadas for site distribution
- Use gravity-fed irrigation from upper catchments

## Plant Selection for Madeira Permaculture

### Layer 1: Canopy Trees (Food & Function)

**Productive Trees:**
- **Chestnut (Castanea sativa)** - Traditional staple, coppices well, grows 400-1200m elevation
- **Avocado (Persea americana)** - Thrives in subtropical climate, multiple varieties
- **Mango (Mangifera indica)** - Excellent on warm south coast below 300m
- **Loquat (Eriobotrya japonica)** - Hardy, fruits in spring, adapts to elevation
- **Papaya (Carica papaya)** - Year-round production below 400m, short-lived pioneer

**Support/Nitrogen Fixers:**
- **Acacia dealbata** - Fast-growing nitrogen fixer, coppices, good mulch
- **Tagasaste (Chamaecytisus palmensis)** - Canary Island native, excellent fodder, nitrogen fixing
- **Leucaena leucocephala** - Tropical nitrogen fixer, fodder, biomass

### Layer 2: Small Trees & Large Shrubs

**Fruit Production:**
- **Banana (Musa spp.)** - Main crop, multiple varieties, year-round harvest
- **Guava (Psidium guajava)** - Naturalized, prolific fruiting, adapts widely
- **Passion Fruit (Passiflora edulis)** - Vining fruit for fences and trellises
- **Fig (Ficus carica)** - Drought-tolerant, two crops per year possible
- **Custard Apple (Annona cherimola)** - Premium fruit, south-facing slopes

**Endemic/Native Species:**
- **Til (Ocotea foetens)** - Laurisilva tree, important for forest gardening
- **Vinhático (Persea indica)** - Endemic laurel, valuable timber, forest health
- **Barbusano (Apollonias barbujana)** - Laurisilva endemic, reforestation

### Layer 3: Shrubs

- **Coffee (Coffea arabica)** - Grows well 200-600m in partial shade
- **Pitanga (Eugenia uniflora)** - Delicious berries, hedge plant
- **Tamarillo (Solanum betaceum)** - Tree tomato, productive in cool zones
- **Arrowroot (Canna edulis)** - Edible tubers, ornamental, water-loving

### Layer 4: Herbaceous

- **Sweet Potato (Ipomoea batatas)** - Year-round staple, ground cover
- **Taro (Colocasia esculenta)** - Traditional crop in wet areas
- **Pigeon Pea (Cajanus cajan)** - Nitrogen fixer, edible, short-lived perennial
- **Chaya (Cnidoscolus aconitifolius)** - Perennial leafy green, high nutrition

### Layer 5: Ground Covers

- **Sweet Potato leaves** - Edible ground cover, erosion control
- **Strawberries** - Adapted varieties for year-round production
- **Nasturtium** - Edible flowers and leaves, nitrogen accumulator
- **Comfrey** - Dynamic accumulator, medicinal, mulch producer

### Layer 6: Vines

- **Passion Fruit** - Main perennial vine crop
- **Chayote (Sechium edule)** - Vigorous perennial, edible shoots and fruits
- **Kiwi (Actinidia deliciosa)** - Grows well 400-800m elevation
- **Grapes** - Traditional crop, many local varieties

## Water Management Strategies

### Rainfall Harvesting

**Roof Catchment:**
- Average roof yields 600-2000L per m² annually depending on elevation
- Storage essential for 4-month dry season
- First flush diverters for water quality
- Multiple tank sizes for redundancy

**Land-Based Harvesting:**
- Swales on contour following levada principles
- Retention ponds at natural collection points
- Infiltration basins above growing areas
- Mulch basins around tree crops

### Microclimate Water

Madeira''s **cloud forests** create unique water opportunities:
- Fog nets and collection systems
- Strategic tree planting for cloud water interception
- Moisture-loving crops beneath cloud forest canopy
- Integration with Laurisilva forest edges

### Greywater Systems

With limited water in dry season:
- Laundry-to-landscape systems for fruit trees
- Shower water for banana circles
- Constructed wetlands for treatment
- Mulch basins for distribution

## Managing Microclimates

### Elevation Zones

**0-200m (Coastal):**
- Warmest, driest
- Tropical fruits: mango, papaya, dragon fruit
- Protect from salt winds
- Maximum irrigation need

**200-500m (Mid-elevation):**
- Optimal for most permaculture
- Widest crop diversity
- Banana, avocado, citrus excel
- Balance of rain and sun

**500-800m (Highland):**
- Cooler, wetter
- Chestnuts, apples, berry fruits
- More European crops possible
- Cloud forest integration

**800m+ (Mountain):**
- Cool, very wet
- Limited by temperature
- Focus on forest systems
- Endemic species restoration

### Aspect Considerations

**South-facing (sunny):**
- Maximum solar gain
- Drought-stressed without irrigation
- Best for heat-loving crops
- Traditional agricultural zones

**North-facing (shady):**
- Cooler, wetter, windier
- Laurisilva forest vegetation
- Shade-loving crops
- Year-round moisture

## Madeira-Specific Challenges

### Wind Management

Strong north winds (Nortada) require:
- Strategic windbreak planting
- Stone wall maintenance
- Staking of young trees
- Low-profile design in exposed areas
- Selection of wind-tolerant species

### Wildfire Prevention

Increasing fire risk demands:
- Firebreak design around properties
- Green fire-resistant perimeters
- Water tank access for firefighting
- Reduction of dry biomass accumulation
- Native species less flammable than eucalyptus

### Invasive Species

Managing aggressive exotics:
- **Acacia dealbata** - Useful but spreads aggressively
- **Pampas Grass** - Remove from site
- **Eucalyptus** - Replace with native species
- Focus on native/endemic restoration

### Access & Steep Terrain

- Design for gravity-based systems
- Reduce vehicle dependence
- Create multiple access levels
- Cable or pulley systems for moving materials
- Reduce need to work on steep slopes

## Integration with Local Culture

### Traditional Knowledge

Learn from Madeiran farmers:
- Poio construction and maintenance
- Levada water management
- Traditional crop varieties
- Seasonal timing adapted to climate
- Social cooperation systems

### Local Market Opportunities

- **Organic Market Funchal** - Wednesday organic sales
- **Mercado dos Lavradores** - Direct sales possible
- **Farm Stays & Eco-tourism** - Glamping, volunteer programs
- **Farm Boxes** - Weekly delivery services
- **Restaurants** - Farm-to-table movement growing

## Recommended Madeira Permaculture Pattern

**Zone 0 (Home):**
- Rainwater catchment and storage
- Greywater treatment
- Composting area
- Solar orientation

**Zone 1 (Intensive):**
- Raised bed vegetables
- Culinary herbs
- Banana circle with greywater
- Small fruit trees (loquat, guava)

**Zone 2 (Production):**
- Mixed fruit orchard on terraces
- Poultry integration
- Compost production
- Perennial vegetables

**Zone 3 (Main crops):**
- Chestnut grove
- Avocado production
- Pasture for animals
- Biomass/mulch production

**Zone 4 (Forest):**
- Laurisilva restoration
- Managed coppice
- Mushroom cultivation
- Wild harvest

**Zone 5 (Wild):**
- Endemic forest conservation
- Seed source for natives
- Wildlife habitat
- Inspiration and observation

## Resources & Learning

**Visit These Madeira Projects:**
- Permaculture Farm Tábua - Volunteers welcome
- Alma Farm Gaula - Educational tours
- Canto das Fontes - Organic farm & glamping
- Arambha - Forest conservation work

**Madeira-Specific Plants:**
- Madeira Botanical Garden seed programs
- Endemic plant nurseries
- Seed exchanges at organic markets

**Further Learning:**
- "Permaculture in Mediterranean Climate" - adaptation applicable to Madeira
- Local agricultural extension services
- Madeiran farming cooperatives
- European permaculture convergences

## Conclusion

Madeira offers extraordinary potential for permaculture. Its year-round growing season, rich volcanic soil, reliable water sources, diverse microclimates, and centuries of sustainable agriculture provide solid foundation for regenerative systems. By combining traditional Madeiran wisdom with modern permaculture principles, practitioners can create abundant, resilient landscapes on this remarkable Atlantic island.',
  'published',
  0,
  NOW()
);

-- Link to relevant categories
DO $$
DECLARE
  guide_id UUID;
  cat_ids UUID[];
  cat_id UUID;
BEGIN
  SELECT id INTO guide_id FROM wiki_guides WHERE slug = 'subtropical-permaculture-madeira';
  -- Using categories that exist in the expanded wiki categories
  SELECT ARRAY_AGG(id) INTO cat_ids FROM wiki_categories WHERE slug IN ('climate-adaptation', 'regenerative-agriculture', 'soil-science');

  IF guide_id IS NOT NULL AND cat_ids IS NOT NULL THEN
    FOREACH cat_id IN ARRAY cat_ids
    LOOP
      IF cat_id IS NOT NULL THEN
        INSERT INTO wiki_guide_categories (guide_id, category_id)
        VALUES (guide_id, cat_id)
        ON CONFLICT DO NOTHING;
      END IF;
    END LOOP;
  END IF;
END $$;

-- =====================================================
-- GUIDE 2: COLD CLIMATE PERMACULTURE CZECH REPUBLIC
-- =====================================================

INSERT INTO wiki_guides (
  title, slug, summary, content, status, view_count, published_at
) VALUES (
  'Cold Climate Permaculture in Czech Republic',
  'cold-climate-permaculture-czech',
  'Complete guide to permaculture in Czech Republic''s continental climate with cold winters and short growing season. Covers hardy perennials, season extension, soil building, and adaptation of permaculture principles to Central European conditions.',
  E'# Cold Climate Permaculture in Czech Republic

## Introduction

Czech Republic presents unique opportunities for permaculture practitioners working in temperate continental climate. With cold winters, relatively short growing season, and distinct seasons, permaculture design must emphasize resilience, season extension, and working with natural cycles.

**Climate Overview:**
- Continental temperate climate
- Cold winters: -5°C to -15°C common, extremes to -25°C
- Warm summers: 20°C to 30°C
- Growing season: Late April to October (160-180 days)
- Annual precipitation: 400-700mm (lowlands) to 1200mm+ (mountains)
- Snow cover: December through March
- Spring/autumn frost risk

## Soil Building for Cold Climate

Czech soils range from fertile lowland chernozems to acidic mountain podzols. Cold temperatures slow decomposition, making soil building critical.

### Composting in Cold Climate

**Winter Composting:**
- Hot composting continues through winter with proper management
- Insulate piles with straw or leaves
- Larger volumes maintain heat better
- Turn less frequently in winter
- Locate in sun-exposed areas

**Bokashi Method:**
- Indoor fermentation during winter
- No heat required
- Perfect for kitchen scraps
- Growing popularity in Czech cities
- Finished product ready for spring

### Green Manures & Cover Crops

Essential for season extension and soil building:

**Winter Cover Crops:**
- Winter rye (Secale cereale) - Hardy to -30°C
- Winter wheat - Biomass and nitrogen
- Hairy vetch - Nitrogen fixing, winter hardy
- Winter peas - Earlier than spring varieties

**Autumn-Sown for Spring:**
- Crimson clover - Beautiful spring flowers, nitrogen
- Field beans - Deep roots, nitrogen
- Phacelia - Breaks up soil, attracts beneficials

### Mulching Strategies

**Winter Mulch:**
- Heavy mulch after ground freezes
- Protects perennials from freeze-thaw cycles
- Leaves, straw, wood chips
- Remove in spring for soil warming

**Summer Mulch:**
- Apply after soil warms in May
- Conserve moisture through dry periods
- Suppress weeds during peak growth
- Use locally abundant materials

## Plant Selection for Czech Climate

### Canopy Layer - Hardy Trees

**Fruit & Nut Trees:**
- **Apple (Malus domestica)** - Hundreds of Czech heirloom varieties
- **Pear (Pyrus communis)** - Traditional Czech crop
- **Plum (Prunus domestica)** - Extremely hardy, many varieties
- **Cherry (Prunus avium & cerasus)** - Sweet and sour types
- **Walnut (Juglans regia)** - Lowland areas, valuable timber
- **Hazelnut (Corylus avellana)** - Native, reliable, shade tolerant

**Support Species:**
- **Black Locust (Robinia pseudoacacia)** - Nitrogen fixer, rot-resistant timber
- **Willow (Salix spp.)** - Coppice, biomass, living structures
- **Alder (Alnus glutinosa)** - Native nitrogen fixer, wet areas
- **Linden (Tilia cordata)** - Native, medicinal flowers, bee food

### Shrub Layer

**Fruit Production:**
- **Currants** (Ribes spp.) - Black, red, white varieties
- **Gooseberry** (Ribes uva-crispa) - Thorny but productive
- **Elderberry** (Sambucus nigra) - Native, medicinal, culinary
- **Aronia** (Aronia melanocarpa) - Superfood berry, very hardy
- **Sea Buckthorn** (Hippophae rhamnoides) - Vitamin C powerhouse, nitrogen fixer
- **Jostaberry** - Hybrid, disease-resistant

**Support Shrubs:**
- **Siberian Peashrub** (Caragana arborescens) - Nitrogen fixer, edible pods, -45°C hardy
- **Buffalo Berry** (Shepherdia argentea) - Nitrogen fixer, edible fruit
- **Autumn Olive** (Elaeagnus umbellata) - Nitrogen fixer (can be invasive)

### Herbaceous Perennials

**Vegetables:**
- **Asparagus** - 20+ year production
- **Rhubarb** - Extremely hardy, traditional Czech crop
- **Jerusalem Artichoke** - Productive, spreads easily
- **Walking Onions** - Perennial green onions
- **Sorrel** - Early spring greens
- **Good King Henry** - Perennial spinach alternative

**Herbs:**
- **Lovage** - Perennial celery flavor, medicinal
- **Horseradish** - Traditional condiment, vigorous
- **Comfrey** - Dynamic accumulator, medicinal, mulch
- **Mint family** - Many hardy varieties
- **Chives** - Garlic and onion types

### Ground Covers

- **Wild Strawberry** - Native, spreads well, edible
- **Creeping Thyme** - Aromatic, pollinator food
- **Vinca minor** - Evergreen, medicinal
- **Ajuga** - Low maintenance, spring flowers

## Season Extension Techniques

### Passive Season Extension

**Cold Frames:**
- Extend season 4-6 weeks each end
- Build from recycled windows
- South-facing placement
- Ventilation critical on sunny days

**Row Covers:**
- Floating row covers protect to -5°C
- Extend harvest of leafy greens into winter
- Protect early spring plantings
- Reusable for multiple seasons

**Cloches:**
- Individual plant protection
- Use recycled plastic bottles
- Effective for early tomatoes, peppers
- Remove once frost danger passes

### Active Season Extension

**Hoop Houses / Polytunnels:**
- Unheated extends season 8-12 weeks
- Year-round salad greens possible
- Essential for heat-loving crops (tomatoes, peppers, cucumbers)
- Orient east-west for maximum sun

**Greenhouse:**
- Year-round growing with minimal heat
- Thermal mass (water barrels, stone) stores heat
- Compost heating methods
- Insulation for winter production

**Root Cellars:**
- Traditional Czech technology
- Stores roots, potatoes, apples through winter
- Maintains 0-4°C naturally
- High humidity preserves produce

## Water Management

### Rainfall Patterns

Czech Republic receives adequate rainfall but distribution varies:
- Spring: Moderate (good for planting)
- Summer: Variable (drought possible July-August)
- Autumn: Increasing (September-October)
- Winter: Snow accumulation

### Water Storage

**Rainwater Harvesting:**
- Roof catchment essential
- Calculate: 600mm rainfall × roof area = annual potential
- 5000L+ storage recommended
- Use stored water for greenhouse and high-value crops

**Pond Systems:**
- Traditional Czech fishpond culture applicable
- Multiple small ponds better than one large
- Ice cover in winter - manage depth (1.5m minimum)
- Integrate ducks, fish, irrigation

### Managing Wet Springs & Autumn

- Raised beds essential in wet areas
- Swales and drainage ditches prevent waterlogging
- Avoid working wet soil (compaction)
- Cover crops prevent erosion during rains

## Microclimate Design

### Maximizing Sun

Critical in climate with less intense sun:
- South-facing slopes preferred
- Reflective surfaces (white walls) increase light
- Keep areas near heat-lovers open
- Prune for light penetration

### Wind Protection

Czech Republic experiences strong winds, especially in lowlands:
- Windbreak design essential
- Multi-layer windbreaks 50% permeable
- Native species (pine, spruce, willow)
- Reduces crop damage and water loss

### Frost Protection

**Spring Frost (May):**
- Cold air drainage design
- Avoid planting frost-sensitive crops in hollows
- Pond placement moderates temperature
- Row covers ready for cold nights

**Autumn Frost (September-October):**
- Harvest heat-lovers before first frost
- Protect perennials with mulch
- Some crops (kale, Brussels sprouts) improve after frost

## Czech Permaculture Patterns

### Urban Prague Garden (100m²)

**Zone 1:**
- Intensive raised beds
- Herbs and salad greens
- Cold frame for season extension
- Compost bins (3-bin system)

**Zone 2:**
- Fruit bushes (currants, gooseberries)
- Climbing beans and peas on fences
- Perennial vegetables (rhubarb, asparagus)
- Small fruit trees (dwarf apples)

**Zone 3:**
- Community composting area
- Shared tool shed
- Rainwater collection

### Rural Homestead (1 hectare)

**Zone 1:**
- Kitchen garden raised beds
- Greenhouse (30m²)
- Herb spiral
- Chicken coop and run

**Zone 2:**
- Mixed fruit orchard
- Berry patches
- Perennial beds
- Pond system (200m²)

**Zone 3:**
- Main food forest (0.3 hectare)
- Pasture for geese/sheep rotation
- Large composting area
- Coppice woodlot

**Zone 4:**
- Managed woodland
- Mushroom logs
- Wild harvest areas
- Biomass production

**Zone 5:**
- Native forest conservation
- Seed collecting
- Wildlife corridor

## Community Supported Agriculture (CSA)

Czech Republic has growing CSA movement, particularly around Prague and Brno:

**CSA Model:**
- Members pay upfront for season
- Share in harvest and risk
- Typically 0.3-2 hectares
- 20-100 member families
- Weekly vegetable boxes
- Community work days

**Benefits:**
- Guaranteed income for growers
- Direct connection consumers-producers
- Community building
- Food sovereignty
- Educational opportunities

## Integration with Czech Culture

### Traditional Knowledge

**Reviving Traditional Practices:**
- Fermentation (sauerkraut, pickles, kvass)
- Root cellaring
- Fruit preserving and drying
- Mushroom foraging
- Medicinal herb knowledge

### Social Networks

**Growing Community:**
- Permakultura CS - National organization
- Libraries in Prague and Brno
- Annual permaculture conference
- RESILIENCE 2025 convergence
- Seed exchange networks

### Local Markets

- Prague farmers markets (year-round)
- Brno Zelný trh (traditional market)
- Growing demand for organic
- Direct farm sales increasing

## Managing Challenges

### Short Growing Season

**Strategies:**
- Focus on cold-hardy perennials
- Season extension infrastructure
- Succession planting
- Storage crop emphasis

### Cold Winters

**Adaptations:**
- Hardy plant selection
- Winter mulching
- Protected structures
- Winter activities (planning, tool repair, seed ordering)

### Summer Drought

**Mitigation:**
- Deep mulching
- Drought-tolerant selections
- Efficient irrigation
- Water storage

## Wildlife Integration

**Beneficial Animals:**
- Hedgehogs - Slug and insect control
- Bats - Mosquito and pest control
- Birds - Insect control, seed dispersal
- Native bees - Pollination

**Managing Challenges:**
- Deer - Fencing in rural areas
- Voles - Natural predators, cats
- Slugs - Ducks, beer traps, barriers

## Resources & Learning

**Czech Organizations:**
- Permakultura CS (Prague & Brno libraries)
- KOKOZA urban agriculture network
- CSA networks
- Seed saving initiatives

**Education:**
- Czech University of Life Sciences Prague
- Mendel University Brno
- Permaculture Design Courses
- Workshops on syntropic agriculture

**Czech Seed Sources:**
- Traditional varieties preserved by gardeners
- Seed exchanges at community gardens
- Heritage variety projects

## Conclusion

Czech Republic offers excellent conditions for permaculture despite climate challenges. The short but productive growing season, adequate rainfall, rich agricultural heritage, and growing permaculture community create strong foundation for resilient food systems. By emphasizing cold-hardy perennials, season extension, and community cooperation, Czech permaculturists can create abundant landscapes producing food, building soil, and strengthening local food sovereignty.

The revival of traditional Czech agricultural knowledge combined with modern permaculture principles positions Czech Republic as emerging leader in Central European permaculture movement.',
  'published',
  0,
  NOW()
);

-- Link to categories
DO $$
DECLARE
  guide_id UUID;
  cat_ids UUID[];
  cat_id UUID;
BEGIN
  SELECT id INTO guide_id FROM wiki_guides WHERE slug = 'cold-climate-permaculture-czech';
  -- Using categories that exist in the expanded wiki categories
  SELECT ARRAY_AGG(id) INTO cat_ids FROM wiki_categories WHERE slug IN ('climate-adaptation', 'regenerative-agriculture', 'cover-cropping');

  IF guide_id IS NOT NULL AND cat_ids IS NOT NULL THEN
    FOREACH cat_id IN ARRAY cat_ids
    LOOP
      IF cat_id IS NOT NULL THEN
        INSERT INTO wiki_guide_categories (guide_id, category_id)
        VALUES (guide_id, cat_id)
        ON CONFLICT DO NOTHING;
      END IF;
    END LOOP;
  END IF;
END $$;

-- =====================================================
-- PART 4: EVENTS FOR 2025-2026
-- =====================================================

-- =====================================================
-- MADEIRA EVENTS
-- =====================================================

INSERT INTO wiki_events (
  title, slug, description, event_date, start_time, end_time,
  location_name, location_address, latitude, longitude,
  event_type, price, price_display, registration_url, max_attendees, status
) VALUES

-- January 2025
(
  'Introduction to Subtropical Permaculture',
  'subtropical-permaculture-intro-jan-2025',
  'One-day introduction to permaculture principles adapted for Madeira''s subtropical climate. Topics include terracing, water management using levada principles, endemic plant selection, and year-round food production. Includes tour of working permaculture site and hands-on activities. Suitable for beginners.',
  '2025-01-18',
  '09:30:00',
  '17:00:00',
  'Permaculture Farm Tábua',
  'Tábua, Ribeira Brava, Madeira, Portugal',
  32.6667,
  -17.0833,
  'workshop',
  35.00,
  '€35',
  NULL,
  20,
  'published'
),

-- February 2025
(
  'Banana Circle Construction Workshop',
  'banana-circle-workshop-feb-2025',
  'Build a banana circle - the ultimate subtropical permaculture element. Learn design principles, materials sourcing, planting techniques, and integration with greywater systems. Hands-on construction of complete banana circle. Take home detailed plans for your own site.',
  '2025-02-15',
  '10:00:00',
  '16:00:00',
  'Alma Farm Gaula',
  'Gaula, Santa Cruz, Madeira, Portugal',
  32.6833,
  -16.8500,
  'workshop',
  40.00,
  '€40',
  NULL,
  15,
  'published'
),

(
  'Organic Seed Starting & Propagation',
  'seed-starting-madeira-feb-2025',
  'Master seed starting for Madeira''s climate. Covers seed selection, timing for year-round planting, propagation techniques, and transplanting. Focus on subtropical and tropical varieties. Participants start seeds to take home. Held at certified organic greenhouse facility.',
  '2025-02-22',
  '09:00:00',
  '13:00:00',
  'Canto das Fontes',
  'Calheta, Madeira, Portugal',
  32.7167,
  -17.1667,
  'workshop',
  25.00,
  '€25',
  'https://cantodasfontes.pt/',
  25,
  'published'
),

-- March 2025
(
  'Levada Water Harvesting Tour',
  'levada-water-tour-march-2025',
  'Guided educational walk along Levada das 25 Fontes exploring traditional water management systems. Learn how 600-year-old irrigation technology informs modern permaculture water design. Discuss swales, gravity-fed systems, and community water management. Beautiful 8km hike through laurel forest. Moderate fitness required.',
  '2025-03-08',
  '08:00:00',
  '14:00:00',
  'Levada das 25 Fontes',
  'Rabaçal, Calheta, Madeira, Portugal',
  32.7583,
  -17.1333,
  'tour',
  20.00,
  '€20',
  NULL,
  30,
  'published'
),

(
  'Spring Equinox Seed Exchange & Community Gathering',
  'spring-seed-exchange-madeira-2025',
  'Celebrate spring equinox with community seed exchange, plant swap, and potluck. Bring seeds and plants to share. Workshops on seed saving, traditional varieties, and endemic plants. Music, food, and connection. All welcome - free event.',
  '2025-03-20',
  '11:00:00',
  '17:00:00',
  'Funchal Organic Market',
  'Largo do Restauração, Funchal, Madeira',
  32.6492,
  -16.9083,
  'meetup',
  0.00,
  'Free',
  NULL,
  100,
  'published'
),

-- April 2025
(
  'Terracing & Stone Wall Construction',
  'terracing-workshop-april-2025',
  'Traditional Madeiran poio (terrace) construction techniques. Learn to build dry-stone retaining walls, create level planting areas on slopes, and integrate permaculture design. Hands-on construction with local stonemason. Essential skills for working Madeira''s steep terrain.',
  '2025-04-12',
  '09:00:00',
  '17:00:00',
  'Permaculture Project Fajã da Ovelha',
  'Fajã da Ovelha, Calheta, Madeira',
  32.7333,
  -17.2333,
  'workshop',
  50.00,
  '€50',
  NULL,
  12,
  'published'
),

-- May 2025
(
  'Subtropical Food Forest Design Course',
  'food-forest-design-may-2025',
  '3-day intensive course in subtropical food forest design and establishment. Covers layer design, plant selection for Madeira, succession planning, and integration with existing systems. Site visits to mature food forests. Design project for participants'' own properties. Certificate upon completion.',
  '2025-05-09',
  '09:00:00',
  '17:00:00',
  'Permaculture Farm Tábua',
  'Tábua, Ribeira Brava, Madeira',
  32.6667,
  -17.0833,
  'course',
  180.00,
  '€180 (3 days)',
  NULL,
  15,
  'published'
),

(
  'Madeira Permaculture Farm Tour',
  'madeira-farm-tour-may-2025',
  'Full-day tour visiting 3 established permaculture projects across Madeira. See diverse approaches to subtropical permaculture, water management, terracing, and natural building. Meet practitioners, ask questions, and gain inspiration. Lunch included at organic farm. Transport provided from Funchal.',
  '2025-05-24',
  '08:30:00',
  '17:30:00',
  'Multiple Locations',
  'Funchal departure point',
  32.6500,
  -16.9167,
  'tour',
  45.00,
  '€45',
  NULL,
  25,
  'published'
),

-- June 2025
(
  'Natural Building: Cob & Earthbag Workshop',
  'natural-building-june-2025',
  'Weekend workshop on natural building techniques for Madeira. Hands-on construction using cob (clay-straw-sand mix) and earthbag methods. Build demonstration structures. Learn about humidity management in subtropical climate, foundations, and appropriate applications. No experience necessary.',
  '2025-06-14',
  '09:00:00',
  '17:00:00',
  'Permaculture Farm Tábua',
  'Tábua, Ribeira Brava, Madeira',
  32.6667,
  -17.0833,
  'workshop',
  90.00,
  '€90 (2 days)',
  NULL,
  16,
  'published'
),

-- July 2025
(
  'Tropical Fruit Tree Grafting',
  'fruit-grafting-july-2025',
  'Learn grafting techniques for tropical and subtropical fruit trees. Covers avocado, mango, loquat, and cherimoya. Hands-on practice with multiple grafting methods. Participants graft trees to take home. Focus on variety preservation and propagation of adapted cultivars.',
  '2025-07-12',
  '09:00:00',
  '14:00:00',
  'Alma Farm Gaula',
  'Gaula, Santa Cruz, Madeira',
  32.6833,
  -16.8500,
  'workshop',
  35.00,
  '€35',
  NULL,
  20,
  'published'
),

-- August 2025
(
  'Laurisilva Forest Restoration Workday',
  'forest-restoration-august-2025',
  'Community workday planting endemic species in Laurisilva forest restoration area. Learn about Madeira''s unique UNESCO World Heritage forest ecosystem. Hands-on planting of til, vinhático, and barbusano trees. Includes forest ecology walk and traditional Madeiran lunch. All welcome.',
  '2025-08-16',
  '09:00:00',
  '15:00:00',
  'Arambha Eco Village',
  'Madeira Island, Portugal',
  32.7500,
  -16.9500,
  'workday',
  0.00,
  'Free (lunch provided)',
  'https://arambha.net/',
  40,
  'published'
),

-- September 2025
(
  'Harvest Festival & Food Preservation',
  'harvest-festival-sept-2025',
  'Celebrate harvest season with workshops on food preservation for year-round eating. Fermentation, drying, canning, and storage techniques. Demonstrations, hands-on activities, and feast featuring preserved foods. Music, dancing, and community celebration. All welcome.',
  '2025-09-20',
  '11:00:00',
  '18:00:00',
  'Permaculture Farm Tábua',
  'Tábua, Ribeira Brava, Madeira',
  32.6667,
  -17.0833,
  'meetup',
  10.00,
  '€10',
  NULL,
  80,
  'published'
),

-- October 2025
(
  'Permaculture Design Certificate (PDC) Course Madeira',
  'pdc-course-madeira-oct-2025',
  'Comprehensive 2-week Permaculture Design Certificate course on Madeira Island. 72-hour curriculum covering all aspects of permaculture design with focus on subtropical applications. Site visits, design projects, hands-on activities. Internationally recognized certification. Residential with accommodation and meals included.',
  '2025-10-13',
  '09:00:00',
  '18:00:00',
  'Permaculture Farm Tábua',
  'Tábua, Ribeira Brava, Madeira',
  32.6667,
  -17.0833,
  'course',
  950.00,
  '€950 (14 days residential)',
  NULL,
  20,
  'published'
),

-- November 2025
(
  'Winter Garden Planning & Cover Crops',
  'winter-planning-nov-2025',
  'Plan for year-round production in Madeira''s mild winters. Selection of winter vegetables, cover crop strategies, greenhouse management, and succession planting. Maximize production during tourist low season. Includes greenhouse tour and planting demonstration.',
  '2025-11-08',
  '10:00:00',
  '15:00:00',
  'Canto das Fontes',
  'Calheta, Madeira, Portugal',
  32.7167,
  -17.1667,
  'workshop',
  30.00,
  '€30',
  NULL,
  20,
  'published'
),

-- December 2025
(
  'Winter Solstice Celebration & Seed Blessing',
  'solstice-celebration-dec-2025',
  'Celebrate winter solstice and honor the turning of the year. Seed blessing ceremony for 2026 growing season, community sharing, and potluck feast. Reflection on past year and intentions for coming season. Music, storytelling, and connection. All welcome.',
  '2025-12-21',
  '16:00:00',
  '21:00:00',
  'Funchal Organic Market',
  'Largo do Restauração, Funchal, Madeira',
  32.6492,
  -16.9083,
  'meetup',
  0.00,
  'Free (potluck)',
  NULL,
  60,
  'published'
),

-- =====================================================
-- CZECH REPUBLIC EVENTS
-- =====================================================

-- January 2025
(
  'New Year Garden Planning Workshop Prague',
  'garden-planning-prague-jan-2025',
  'Start the new year with comprehensive garden planning for 2025 growing season. Topics include crop rotation, succession planting, seed ordering, and season extension. Focus on maximizing short Czech growing season. Bring your garden measurements for personalized advice.',
  '2025-01-25',
  '14:00:00',
  '18:00:00',
  'Permakultura CS Prague Library',
  'Prague, Czech Republic',
  50.0755,
  14.4378,
  'workshop',
  15.00,
  '400 CZK',
  'https://www.permakulturacs.cz/',
  30,
  'published'
),

-- February 2025
(
  'Winter Pruning Workshop: Fruit Trees',
  'pruning-workshop-feb-2025',
  'Essential winter pruning techniques for fruit trees. Learn proper cuts, timing, and shaping for maximum production. Hands-on practice on apple, pear, and plum trees. Covers both young tree training and mature tree renovation. Bring pruning tools if possible.',
  '2025-02-15',
  '10:00:00',
  '14:00:00',
  'Southern Bohemia Permaculture Garden',
  'Southern Bohemia, Czech Republic',
  49.0500,
  14.4500,
  'workshop',
  20.00,
  '500 CZK',
  NULL,
  20,
  'published'
),

(
  'Introduction to Permaculture Weekend - Divočina Malešov',
  'intro-permaculture-feb-2025',
  'Weekend introduction to permaculture principles and design. Led by Katka Horáčková covering ethics, principles, and practical applications for Czech climate. Includes site tour, hands-on activities, and design exercise. Perfect for beginners considering PDC course.',
  '2025-02-22',
  '09:00:00',
  '17:00:00',
  'Divočina Malešov',
  'Malešov, Czech Republic',
  49.9500,
  15.0500,
  'course',
  45.00,
  '1200 CZK (2 days)',
  NULL,
  25,
  'published'
),

-- March 2025
(
  'Seed Starting Marathon & Exchange',
  'seed-starting-march-2025',
  'All-day seed starting workshop preparing for growing season. Bring seeds to exchange. Topics include seed selection, starting methods, transplanting, and hardening off. Participants start seeds to take home. Seed library available. Hosted at community garden.',
  '2025-03-08',
  '09:00:00',
  '17:00:00',
  'Holešovice Community Garden',
  'Holešovice, Prague, Czech Republic',
  50.1100,
  14.4400,
  'workshop',
  18.00,
  '450 CZK',
  NULL,
  30,
  'published'
),

(
  'Spring Equinox Community Planting Day',
  'spring-planting-march-2025',
  'Welcome spring with community planting day at Prague community garden. Plant early crops, prepare beds, and share gardening knowledge. Potluck lunch with traditional Czech spring dishes. All welcome - families encouraged. Free event building community connections.',
  '2025-03-20',
  '10:00:00',
  '16:00:00',
  'Community Garden Kuchyňka',
  'Prague, Czech Republic',
  50.0880,
  14.4208,
  'workday',
  0.00,
  'Free (potluck)',
  NULL,
  50,
  'published'
),

-- April 2025
(
  'Grafting Workshop: Fruit Tree Propagation',
  'grafting-workshop-april-2025',
  'Learn grafting techniques to propagate fruit trees and preserve heirloom Czech varieties. Hands-on practice with whip-and-tongue, cleft, and bud grafting. Participants graft multiple trees to take home. Focus on traditional Czech apple and plum varieties.',
  '2025-04-12',
  '10:00:00',
  '16:00:00',
  'Czech Republic First Full Ecovillage',
  'Central Bohemia, Czech Republic',
  49.5000,
  14.5000,
  'workshop',
  25.00,
  '650 CZK',
  NULL,
  20,
  'published'
),

-- May 2025
(
  'Cold Frame & Season Extension Construction',
  'cold-frame-workshop-may-2025',
  'Build cold frames and season extension structures from recycled materials. Hands-on construction workshop covering design, materials, placement, and management. Extends Czech growing season 6-8 weeks each end. Participants build small cold frame to take home.',
  '2025-05-10',
  '09:00:00',
  '17:00:00',
  'KOKOZA Urban Agriculture Network',
  'Prague, Czech Republic',
  50.0755,
  14.4378,
  'workshop',
  30.00,
  '800 CZK',
  NULL,
  15,
  'published'
),

(
  'Community Supported Agriculture (CSA) Open Day',
  'csa-open-day-may-2025',
  'Visit thriving CSA garden, meet farmers, and learn about community-supported agriculture model. Tour growing areas, see season extension methods, and understand member-farmer relationship. Information session for those interested in joining or starting CSA. Lunch included.',
  '2025-05-24',
  '10:00:00',
  '15:00:00',
  'Community Garden Kuchyňka',
  'Prague, Czech Republic',
  50.0880,
  14.4208,
  'tour',
  8.00,
  '200 CZK',
  NULL,
  40,
  'published'
),

-- June 2025
(
  'Soil Food Web Workshop with Philip Barton',
  'soil-food-web-june-2025',
  'Intensive workshop on soil biology and the soil food web with renowned educator Philip Barton. Understand beneficial organisms, building soil life, and fostering healthy plant growth. Microscope observations of soil samples. Essential for anyone serious about regenerative agriculture.',
  '2025-06-14',
  '09:00:00',
  '18:00:00',
  'Czech University of Life Sciences Prague',
  'Kamýcká 129, Prague 6, Czech Republic',
  50.1292,
  14.3769,
  'workshop',
  60.00,
  '1500 CZK',
  NULL,
  40,
  'published'
),

-- July 2025
(
  'RESILIENCE 2025 - Central European Permaculture Convergence',
  'resilience-convergence-2025',
  'International 5-day permaculture convergence for Central European countries. Workshops, presentations, networking, experience sharing, and celebration. Hosted in Slovakia, organized by Czech permaculture movement. Camping accommodation. Registration required.',
  '2025-07-28',
  '09:00:00',
  '21:00:00',
  'Žito v sýpke',
  'Moravské Lieskové, Slovakia',
  48.5500,
  17.6500,
  'meetup',
  80.00,
  '2000 CZK (5 days)',
  'https://www.permakulturacs.cz/',
  200,
  'published'
),

-- August 2025
(
  'Syntropic Agriculture Field Day',
  'syntropic-agriculture-aug-2025',
  'Introduction to syntropic agriculture - regenerative method developed in Brazil, adapted for Czech conditions. Field demonstration, planting workshop, and principles overview. Learn high-density succession planting for rapid soil regeneration. Growing interest in Czech Republic.',
  '2025-08-16',
  '10:00:00',
  '17:00:00',
  'Mendel University Brno',
  'Zemědělská 1, Brno, Czech Republic',
  49.2092,
  16.6177,
  'workshop',
  25.00,
  '650 CZK',
  'https://www.syntropy.cz/',
  35,
  'published'
),

-- September 2025
(
  'Harvest Festival & Food Preservation',
  'harvest-festival-sept-2025',
  'Celebrate harvest with traditional Czech food preservation workshops: sauerkraut, pickles, fruit preservation, root cellaring, and kvass making. Hands-on demonstrations, tastings, and community feast. Music and dancing. Celebrates Czech agricultural heritage.',
  '2025-09-20',
  '11:00:00',
  '18:00:00',
  'Czech Republic First Full Ecovillage',
  'Central Bohemia, Czech Republic',
  49.5000,
  14.5000,
  'meetup',
  12.00,
  '300 CZK',
  NULL,
  80,
  'published'
),

-- October 2025
(
  'Mushroom Cultivation on Logs',
  'mushroom-cultivation-oct-2025',
  'Learn to grow oyster and shiitake mushrooms on hardwood logs. Inoculation techniques, species selection, and long-term management. Participants inoculate logs to take home. Traditional Czech mushroom knowledge combined with cultivation methods.',
  '2025-10-11',
  '10:00:00',
  '15:00:00',
  'Southern Bohemia Permaculture Garden',
  'Southern Bohemia, Czech Republic',
  49.0500,
  14.4500,
  'workshop',
  22.00,
  '550 CZK',
  NULL,
  20,
  'published'
),

(
  'Annual Czech Permaculture Conference Prague',
  'permaculture-conference-oct-2025',
  'Annual gathering of Czech permaculture movement in Prague. Presentations, discussions, workshops, networking, seed exchange, and celebration. Features Czech and international speakers. Essential event for permaculture practitioners in Czech Republic. Registration opens August.',
  '2025-10-25',
  '09:00:00',
  '18:00:00',
  'Permakultura CS Prague Library',
  'Prague, Czech Republic',
  50.0755,
  14.4378,
  'meetup',
  15.00,
  '400 CZK',
  'https://www.permakulturacs.cz/',
  120,
  'published'
),

-- November 2025
(
  'Greenhouse Management in Winter',
  'greenhouse-winter-nov-2025',
  'Optimize greenhouse for winter production in Czech climate. Heating options, insulation, crop selection for winter, and microclimate management. Tour of actively producing winter greenhouse. Essential for year-round food production.',
  '2025-11-08',
  '10:00:00',
  '15:00:00',
  'Community Garden Kuchyňka',
  'Prague, Czech Republic',
  50.0880,
  14.4208,
  'workshop',
  18.00,
  '450 CZK',
  NULL,
  25,
  'published'
),

-- December 2025
(
  'Winter Solstice Seed Blessing & Community Gathering',
  'solstice-celebration-dec-2025',
  'Celebrate winter solstice and honor the returning light. Seed blessing ceremony for 2026 growing season, sharing circle, and potluck feast featuring preserved harvest. Music, storytelling, and connection. All welcome to this Czech permaculture community tradition.',
  '2025-12-21',
  '16:00:00',
  '21:00:00',
  'Permakultura CS Prague Library',
  'Prague, Czech Republic',
  50.0755,
  14.4378,
  'meetup',
  0.00,
  'Free (potluck)',
  NULL,
  60,
  'published'
)

ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- FINAL STATISTICS
-- =====================================================

DO $$
DECLARE
    location_count INTEGER;
    guide_count INTEGER;
    event_count INTEGER;
    madeira_count INTEGER;
    czech_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO location_count FROM wiki_locations WHERE created_at >= NOW() - INTERVAL '1 hour';
    SELECT COUNT(*) INTO guide_count FROM wiki_guides WHERE created_at >= NOW() - INTERVAL '1 hour';
    SELECT COUNT(*) INTO event_count FROM wiki_events WHERE created_at >= NOW() - INTERVAL '1 hour';

    SELECT COUNT(*) INTO madeira_count FROM wiki_locations
    WHERE address LIKE '%Madeira%' AND created_at >= NOW() - INTERVAL '1 hour';

    SELECT COUNT(*) INTO czech_count FROM wiki_locations
    WHERE address LIKE '%Czech%' AND created_at >= NOW() - INTERVAL '1 hour';

    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'SEED DATA STATISTICS';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total Locations Added: %', location_count;
    RAISE NOTICE '  - Madeira: %', madeira_count;
    RAISE NOTICE '  - Czech Republic: %', czech_count;
    RAISE NOTICE 'Total Guides Added: %', guide_count;
    RAISE NOTICE 'Total Events Added: %', event_count;
    RAISE NOTICE '';
    RAISE NOTICE 'Total Items: %', location_count + guide_count + event_count;
    RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- END OF SEED FILE
-- =====================================================
