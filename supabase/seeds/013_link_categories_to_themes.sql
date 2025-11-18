/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/seeds/013_link_categories_to_themes.sql
 * Description: Link wiki_categories to wiki_theme_groups via foreign key
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-17
 *
 * Purpose:
 * - Link each category to its theme group using theme_id foreign key
 * - Replaces JavaScript slug-based matching with database relationships
 * - Based on hardcoded theme definitions from wiki-home.js lines 514-530
 */

-- Theme 1: Animal Husbandry & Livestock (slugs: animal-husbandry, beekeeping, poultry-keeping)
UPDATE public.wiki_categories
SET theme_id = (SELECT id FROM public.wiki_theme_groups WHERE slug = 'animal-husbandry-livestock')
WHERE slug IN ('animal-husbandry', 'beekeeping', 'poultry-keeping');

-- Theme 2: Food Preservation & Storage (slugs: food-preservation, fermentation, root-cellaring)
UPDATE public.wiki_categories
SET theme_id = (SELECT id FROM public.wiki_theme_groups WHERE slug = 'food-preservation-storage')
WHERE slug IN ('food-preservation', 'fermentation', 'root-cellaring');

-- Theme 3: Specialized Techniques - contains Mycology & Mushrooms (slugs: mycology, mushroom-cultivation, mycoremediation)
UPDATE public.wiki_categories
SET theme_id = (SELECT id FROM public.wiki_theme_groups WHERE slug = 'specialized-techniques')
WHERE slug IN ('mycology', 'mushroom-cultivation', 'mycoremediation');

-- Theme 4: Community & Education - contains Indigenous & Traditional Knowledge (slugs: indigenous-knowledge, ethnobotany, bioregionalism)
UPDATE public.wiki_categories
SET theme_id = (SELECT id FROM public.wiki_theme_groups WHERE slug = 'community-education')
WHERE slug IN ('indigenous-knowledge', 'ethnobotany', 'bioregionalism');

-- Theme 5: Specialized Techniques - contains Fiber Arts & Textiles (slugs: fiber-arts, natural-dyeing, textile-production)
UPDATE public.wiki_categories
SET theme_id = (SELECT id FROM public.wiki_theme_groups WHERE slug = 'specialized-techniques')
WHERE slug IN ('fiber-arts', 'natural-dyeing', 'textile-production');

-- Theme 6: Renewable Energy - contains Appropriate Technology (slugs: appropriate-technology, solar-technology, bicycle-power)
UPDATE public.wiki_categories
SET theme_id = (SELECT id FROM public.wiki_theme_groups WHERE slug = 'renewable-energy')
WHERE slug IN ('appropriate-technology', 'solar-technology', 'bicycle-power');

-- Theme 7: Specialized Techniques - contains Herbal Medicine (slugs: herbal-medicine, plant-medicine-making, medicinal-gardens)
UPDATE public.wiki_categories
SET theme_id = (SELECT id FROM public.wiki_theme_groups WHERE slug = 'specialized-techniques')
WHERE slug IN ('herbal-medicine', 'plant-medicine-making', 'medicinal-gardens');

-- Theme 8: Soil Regeneration - contains Soil Science & Regeneration (slugs: soil-science, regenerative-agriculture, cover-cropping)
UPDATE public.wiki_categories
SET theme_id = (SELECT id FROM public.wiki_theme_groups WHERE slug = 'soil-regeneration')
WHERE slug IN ('soil-science', 'regenerative-agriculture', 'cover-cropping');

-- Theme 9: Forest Gardening - contains Foraging & Wildcrafting (slugs: foraging, wild-edibles, ethical-wildcrafting)
UPDATE public.wiki_categories
SET theme_id = (SELECT id FROM public.wiki_theme_groups WHERE slug = 'forest-gardening')
WHERE slug IN ('foraging', 'wild-edibles', 'ethical-wildcrafting');

-- Theme 10: Water Management Systems - contains Aquaculture & Water Systems (slugs: aquaculture, aquaponics, pond-management)
UPDATE public.wiki_categories
SET theme_id = (SELECT id FROM public.wiki_theme_groups WHERE slug = 'water-management-systems')
WHERE slug IN ('aquaculture', 'aquaponics', 'pond-management');

-- Theme 11: Ecosystem Management - contains Ecosystem Restoration (slugs: bioremediation, erosion-control, pollinator-support)
UPDATE public.wiki_categories
SET theme_id = (SELECT id FROM public.wiki_theme_groups WHERE slug = 'ecosystem-management')
WHERE slug IN ('bioremediation', 'erosion-control', 'pollinator-support');

-- Theme 12: Community & Education - contains Community & Social Systems (slugs: social-permaculture, ecovillage-design, consensus-decision-making)
UPDATE public.wiki_categories
SET theme_id = (SELECT id FROM public.wiki_theme_groups WHERE slug = 'community-education')
WHERE slug IN ('social-permaculture', 'ecovillage-design', 'consensus-decision-making');

-- Theme 13: Specialized Techniques - contains Alternative Economics (slugs: alternative-economics, time-banking, gift-economy)
UPDATE public.wiki_categories
SET theme_id = (SELECT id FROM public.wiki_theme_groups WHERE slug = 'specialized-techniques')
WHERE slug IN ('alternative-economics', 'time-banking', 'gift-economy');

-- Theme 14: Specialized Techniques - contains Climate Resilience (slugs: climate-adaptation, drought-strategies, fire-smart-landscaping)
UPDATE public.wiki_categories
SET theme_id = (SELECT id FROM public.wiki_theme_groups WHERE slug = 'specialized-techniques')
WHERE slug IN ('climate-adaptation', 'drought-strategies', 'fire-smart-landscaping');

-- Theme 15: Community & Education - contains Family & Education (slugs: childrens-gardens, nature-education, family-homesteading)
UPDATE public.wiki_categories
SET theme_id = (SELECT id FROM public.wiki_theme_groups WHERE slug = 'community-education')
WHERE slug IN ('childrens-gardens', 'nature-education', 'family-homesteading');

-- Verify linkages were created
DO $$
DECLARE
  linked_count INTEGER;
  unlinked_count INTEGER;
BEGIN
  -- Count categories with theme_id
  SELECT COUNT(*) INTO linked_count
  FROM public.wiki_categories
  WHERE theme_id IS NOT NULL;

  -- Count categories without theme_id
  SELECT COUNT(*) INTO unlinked_count
  FROM public.wiki_categories
  WHERE theme_id IS NULL;

  RAISE NOTICE 'Successfully linked % categories to themes', linked_count;

  IF unlinked_count > 0 THEN
    RAISE WARNING '% categories remain unlinked to themes', unlinked_count;
  END IF;
END $$;
