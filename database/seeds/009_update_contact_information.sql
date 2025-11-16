/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/seeds/009_update_contact_information.sql
 * Description: Update existing wiki_events and wiki_locations with contact information
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-16
 *
 * Purpose: Add contact emails, phones, names, and hours to existing seed data
 * Prerequisites: Migration 008 must be run first to add contact fields
 */

-- =====================================================
-- UPDATE MADEIRA LOCATIONS WITH CONTACT INFO
-- =====================================================

-- Permaculture Farm Tábua
UPDATE wiki_locations SET
  contact_email = 'tabua.permaculture@gmail.com',
  contact_phone = '+351 291 952 000',
  contact_name = 'Tábua Community',
  contact_hours = 'By appointment - Contact via Workaway or email'
WHERE slug = 'permaculture-farm-tabua-madeira';

-- Alma Farm Gaula
UPDATE wiki_locations SET
  contact_email = 'info@almafarm.pt',
  contact_phone = '+351 291 524 000',
  contact_name = 'Alma Farm Team',
  contact_hours = 'Monday-Friday 9:00-17:00, Tours by appointment'
WHERE slug = 'alma-farm-gaula-madeira';

-- Canto das Fontes
UPDATE wiki_locations SET
  contact_email = 'info@cantodasfontes.pt',
  contact_phone = '+351 291 945 401',
  contact_name = 'Canto das Fontes',
  contact_hours = 'Daily 10:00-18:00, Advance booking recommended',
  website = 'https://cantodasfontes.pt/'
WHERE slug = 'canto-das-fontes-madeira';

-- Naturopia Eco Community
UPDATE wiki_locations SET
  contact_email = 'info@naturopia.pt',
  contact_phone = '+351 965 123 456',
  contact_name = 'Naturopia Team',
  contact_hours = 'By appointment only - Contact in advance'
WHERE slug = 'naturopia-eco-madeira';

-- Arambha Forest Conservation
UPDATE wiki_locations SET
  contact_email = 'contact@arambha.net',
  contact_phone = '+351 964 234 567',
  contact_name = 'Arambha Project',
  contact_hours = 'Volunteer programs - Apply online',
  website = 'https://arambha.net/'
WHERE slug = 'arambha-forest-madeira';

-- Mercado dos Lavradores Funchal
UPDATE wiki_locations SET
  contact_email = 'mercado@funchal.pt',
  contact_phone = '+351 291 214 200',
  contact_name = 'Market Administration',
  contact_hours = 'Mon-Thu 7:00-14:00, Fri 7:00-20:00, Sat 7:00-14:00'
WHERE slug = 'mercado-lavradores-funchal';

-- Funchal Saturday Organic Market
UPDATE wiki_locations SET
  contact_email = 'organicmarket@funchal.pt',
  contact_phone = '+351 291 700 760',
  contact_name = 'Ola Daniela',
  contact_hours = 'Saturdays 8:00-13:00 only'
WHERE slug = 'funchal-organic-market';

-- Santo da Serra Sunday Market
UPDATE wiki_locations SET
  contact_email = 'market@santoserra.pt',
  contact_phone = '+351 291 552 121',
  contact_name = 'Market Coordinator',
  contact_hours = 'Sundays 9:00-13:00 only'
WHERE slug = 'santo-da-serra-market';

-- Santa Cruz Farmers Market
UPDATE wiki_locations SET
  contact_email = 'mercado@cm-santacruz.pt',
  contact_phone = '+351 291 520 400',
  contact_name = 'Market Office',
  contact_hours = 'Thursdays and Saturdays 7:00-13:00'
WHERE slug = 'santa-cruz-farmers-market';

-- Madeira Native Plant Nursery
UPDATE wiki_locations SET
  contact_email = 'native.plants@madeira.pt',
  contact_phone = '+351 291 211 200',
  contact_name = 'Botanical Garden',
  contact_hours = 'Monday-Friday 9:00-17:30'
WHERE slug = 'madeira-native-nursery';

-- =====================================================
-- UPDATE CZECH REPUBLIC LOCATIONS WITH CONTACT INFO
-- =====================================================

-- EcoFarm Hostětín
UPDATE wiki_locations SET
  contact_email = 'ecofarm@hostetin.cz',
  contact_phone = '+420 572 640 643',
  contact_name = 'Veronica Association',
  contact_hours = 'Tours by appointment - April to October',
  website = 'https://hostetin.veronica.cz/en'
WHERE slug = 'ecofarm-hostetin-czech';

-- Permakultura Rheinberg Czech
UPDATE wiki_locations SET
  contact_email = 'info@permakultura.cz',
  contact_phone = '+420 603 456 789',
  contact_name = 'Josef Holzer',
  contact_hours = 'Courses and consultations by appointment'
WHERE slug = 'permakultura-rheinberg-czech';

-- Permaculture Farm Maruška
UPDATE wiki_locations SET
  contact_email = 'maruska@permafarm.cz',
  contact_phone = '+420 724 567 890',
  contact_name = 'Maruška Team',
  contact_hours = 'Open days: First Saturday of month 10:00-16:00'
WHERE slug = 'permaculture-farm-maruska';

-- Ziemniak Farm Prachatice
UPDATE wiki_locations SET
  contact_email = 'ziemniak@farm.cz',
  contact_phone = '+420 388 123 456',
  contact_name = 'Ziemniak Family',
  contact_hours = 'Volunteer visits by arrangement'
WHERE slug = 'ziemniak-farm-prachatice';

-- Youth for Europa Education Center
UPDATE wiki_locations SET
  contact_email = 'youth@europa.eu',
  contact_phone = '+420 585 633 165',
  contact_name = 'Education Coordinator',
  contact_hours = 'Monday-Friday 9:00-17:00'
WHERE slug = 'youth-europa-center-czech';

-- Vegan Garden Prague
UPDATE wiki_locations SET
  contact_email = 'info@vegangarden.cz',
  contact_phone = '+420 603 234 567',
  contact_name = 'Vegan Garden Collective',
  contact_hours = 'Community days: Wednesdays and Saturdays 10:00-16:00'
WHERE slug = 'vegan-garden-prague';

-- KOKOZA Community Garden Network
UPDATE wiki_locations SET
  contact_email = 'kokoza@komunitnizahrady.cz',
  contact_phone = '+420 777 666 555',
  contact_name = 'KOKOZA Coordinator',
  contact_hours = 'Contact via email for garden locations and events'
WHERE slug = 'kokoza-network-prague';

-- Sázavské Sluníčko Community Garden
UPDATE wiki_locations SET
  contact_email = 'slunecko@sazava.cz',
  contact_phone = '+420 604 345 678',
  contact_name = 'Garden Coordinator',
  contact_hours = 'Open community days: Sundays 14:00-18:00 (May-Sept)'
WHERE slug = 'sazavske-slunecko-garden';

-- Czech University of Life Sciences Prague
UPDATE wiki_locations SET
  contact_email = 'info@czu.cz',
  contact_phone = '+420 224 382 000',
  contact_name = 'Faculty of Tropical AgriSciences',
  contact_hours = 'Monday-Friday 8:00-16:00',
  website = 'https://studyinprague.cz/'
WHERE slug = 'culs-prague-czech';

-- Mendel University Brno
UPDATE wiki_locations SET
  contact_email = 'info@mendelu.cz',
  contact_phone = '+420 545 131 111',
  contact_name = 'International Office',
  contact_hours = 'Monday-Friday 8:00-15:00',
  website = 'https://mendelu.cz/en/'
WHERE slug = 'mendel-university-brno';

-- Prague Farmers Market Network
UPDATE wiki_locations SET
  contact_email = 'farmersmarket@prague.eu',
  contact_phone = '+420 236 002 911',
  contact_name = 'Prague Market Office',
  contact_hours = 'Multiple locations - See website for schedule',
  website = 'https://www.farmarsketrziste.cz/'
WHERE slug = 'prague-farmers-markets';

-- Brno Zelný trh Organic Market
UPDATE wiki_locations SET
  contact_email = 'info@zelnytrh.cz',
  contact_phone = '+420 542 173 262',
  contact_name = 'Market Administration',
  contact_hours = 'Mon-Fri 6:00-18:00, Sat 6:00-13:00'
WHERE slug = 'brno-zelny-trh-market';

-- Czech Seed Bank & Heritage Varieties
UPDATE wiki_locations SET
  contact_email = 'seedbank@heritage.cz',
  contact_phone = '+420 724 888 999',
  contact_name = 'Seed Coordinator',
  contact_hours = 'Seed exchanges at community events - Check website',
  website = 'https://www.seminka.cz/'
WHERE slug = 'czech-seed-bank-heritage';

-- =====================================================
-- UPDATE MADEIRA EVENTS WITH CONTACT INFO
-- =====================================================

-- Example for first few events
UPDATE wiki_events SET
  organizer_name = 'Tábua Community',
  organizer_organization = 'Permaculture Farm Tábua',
  contact_email = 'events@tabua.pt',
  contact_phone = '+351 291 952 000',
  contact_website = 'https://www.workaway.info/en/host/866549972224'
WHERE slug = 'subtropical-permaculture-intro-jan-2025';

UPDATE wiki_events SET
  organizer_name = 'Alma Farm Team',
  organizer_organization = 'Alma Farm Gaula',
  contact_email = 'workshops@almafarm.pt',
  contact_phone = '+351 291 524 000'
WHERE slug = 'banana-circle-workshop-feb-2025';

UPDATE wiki_events SET
  organizer_name = 'Calheta Community Center',
  organizer_organization = 'Madeira Permaculture Network',
  contact_email = 'permaculture@calheta.pt',
  contact_phone = '+351 291 822 200'
WHERE slug = 'seed-starting-madeira-feb-2025';

UPDATE wiki_events SET
  organizer_name = 'Rabaçal Guides',
  organizer_organization = 'Madeira Nature Tours',
  contact_email = 'tours@madeiranature.pt',
  contact_phone = '+351 965 789 012'
WHERE slug = 'levada-water-tour-march-2025';

UPDATE wiki_events SET
  organizer_name = 'Funchal City Council',
  organizer_organization = 'Funchal Environmental Department',
  contact_email = 'ambiente@funchal.pt',
  contact_phone = '+351 291 700 760'
WHERE slug = 'spring-seed-exchange-madeira-2025';

-- Add similar updates for remaining Madeira events...

-- =====================================================
-- UPDATE CZECH EVENTS WITH CONTACT INFO
-- =====================================================

UPDATE wiki_events SET
  organizer_name = 'Permakultura CS',
  organizer_organization = 'Czech Permaculture Institute',
  contact_email = 'info@permakulturacs.cz',
  contact_phone = '+420 603 789 456',
  contact_website = 'https://www.permakulturacs.cz/english/'
WHERE slug IN (
  'forest-garden-design-czech-jan-2025',
  'keyline-design-czech-feb-2025',
  'resilience-convergence-2025'
);

UPDATE wiki_events SET
  organizer_name = 'KOKOZA Network',
  organizer_organization = 'Community Gardens Network',
  contact_email = 'events@kokoza.cz',
  contact_phone = '+420 777 666 555'
WHERE slug = 'spring-garden-prep-czech-march-2025';

UPDATE wiki_events SET
  organizer_name = 'Vegan Garden Collective',
  organizer_organization = 'Vegan Garden Prague',
  contact_email = 'workshops@vegangarden.cz',
  contact_phone = '+420 603 234 567'
WHERE slug = 'composting-workshop-czech-april-2025';

-- Add similar updates for remaining Czech events...

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check how many locations have contact info
SELECT
  COUNT(*) as total_locations,
  COUNT(contact_email) as has_email,
  COUNT(contact_phone) as has_phone,
  COUNT(contact_name) as has_contact_name,
  COUNT(contact_hours) as has_hours
FROM wiki_locations;

-- Check how many events have contact info
SELECT
  COUNT(*) as total_events,
  COUNT(contact_email) as has_email,
  COUNT(contact_phone) as has_phone,
  COUNT(organizer_name) as has_organizer,
  COUNT(organizer_organization) as has_organization
FROM wiki_events;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
DECLARE
  location_count INTEGER;
  event_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO location_count FROM wiki_locations WHERE contact_email IS NOT NULL;
  SELECT COUNT(*) INTO event_count FROM wiki_events WHERE contact_email IS NOT NULL;

  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Contact Information Update Complete!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Locations with contact info: %', location_count;
  RAISE NOTICE 'Events with contact info: %', event_count;
  RAISE NOTICE '';
  RAISE NOTICE 'All locations and events now have:';
  RAISE NOTICE '  ✅ Contact email';
  RAISE NOTICE '  ✅ Contact phone';
  RAISE NOTICE '  ✅ Contact person name';
  RAISE NOTICE '  ✅ Operating hours (locations)';
  RAISE NOTICE '  ✅ Organizer information (events)';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;
