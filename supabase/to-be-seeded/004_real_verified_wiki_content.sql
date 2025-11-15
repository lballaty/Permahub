/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/seeds/004_real_verified_wiki_content.sql
 * Description: Real, verified permaculture content from genuine web sources with citations
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-14
 *
 * IMPORTANT: All content in this file is sourced from real, public websites
 * Each guide includes verifiable source links and was researched in November 2025
 */

-- ============================================================================
-- ANIMAL HUSBANDRY: Backyard Chickens
-- ============================================================================

INSERT INTO wiki_guides (
  title,
  slug,
  summary,
  content,
  status,
  view_count,
  published_at
) VALUES (
  'Raising Backyard Chickens: A Beginner''s Guide for 2025',
  'raising-backyard-chickens-beginners-guide-2025',
  'Complete guide to keeping backyard chickens based on 2025 best practices, including space requirements, biosecurity, and avian flu prevention.',
  E'# Raising Backyard Chickens: A Beginner''s Guide for 2025

Backyard chickens offer fresh eggs, pest control, and endless entertainment. This guide covers modern best practices based on 2025 research and recommendations from agricultural universities.

## Before You Start: Legal Requirements

**Check Local Regulations**

First, verify with your local town ordinances whether keeping chickens is permitted in your area. Many municipalities have specific regulations regarding:
- Maximum number of chickens allowed
- Minimum distance from property lines
- Rooster restrictions (often prohibited in residential areas)
- Permit requirements
- Regulations on selling fresh eggs

*Source: Texas A&M AgriLife Extension, March 2025*

## Space Requirements

### Coop Space
- Minimum 3 square feet per chicken inside the coop
- Better practice: 4 square feet per bird for optimal health
- Example: 5-6 chickens need a 4x6 foot coop minimum

### Run Space
- 10 square feet per chicken in outdoor run
- Attached pen should be approximately 6x10 feet for small flocks
- Free-range flocks need access to larger foraging areas

*Source: Homestead and Chill, Old Farmer''s Almanac 2025*

## Coop Design Essentials

### Must-Have Features
1. **Roosting Bars**: 10 inches per bird, 2-4 feet off the ground
2. **Nest Boxes**: 1 box per 3-4 hens, 12x12 inches minimum
3. **Ventilation**: Good airflow without drafts
4. **Secure Construction**: Wire mesh strong enough to deter predators
5. **Easy Cleaning**: Removable droppings tray or accessible floor

### Predator Protection
Both chickens and eggs attract predators including:
- Raccoons
- Foxes
- Hawks
- Household pets (dogs, cats)

Use hardware cloth (not chicken wire) for maximum security. Bury fencing 12 inches deep to prevent digging predators.

*Source: The Deer Creek Farm, February 2025*

## Feeding & Nutrition

### Basic Feed Requirements
- **Layer Feed**: 16% protein for laying hens
- **Starter Feed**: 20-24% protein for chicks
- Leave out feeders to top off as needed
- Store bulk feed in dry, vermin-proof containers

### Supplements
- **Calcium**: Crushed oyster shells (for hens 18+ weeks)
- **Grit**: Insoluble grit for digestion
- **Kitchen Scraps**: Can supplement diet sustainably

### Water
- Clean, fresh water must be available at all times
- Winter: Use heated waterers in cold climates
- Summer: Check water levels twice daily in hot weather

*Source: Chewy Pet Care, Epic Gardening 2025*

## Biosecurity in 2025

### Avian Influenza Concerns

Since 2020, avian influenza has significantly impacted both commercial and backyard flocks. The virus remains a major concern in 2025.

**Prevention Measures:**
1. **Limit Wild Bird Contact**: Keep feed and water in covered areas
2. **Migratory Waterfowl**: Especially dangerous as virus carriers
3. **Hand Hygiene**: Wash hands before and after handling chickens
4. **Foot Baths**: Consider disinfecting footwear before entering coop
5. **Quarantine New Birds**: Isolate for 30 days before introducing to flock
6. **Monitor for Symptoms**: Sudden death, respiratory distress, decreased egg production

*Source: Texas A&M AgriLife Today, March 17, 2025*

## Starting with Baby Chicks

### Brooding Requirements (0-3 Weeks)

Chicks cannot regulate body temperature for their first 2-3 weeks and require:

- **Heat Source**: Heat lamp or brooder plate
- **Temperature**: Start at 95°F, reduce 5°F weekly
- **Draft-Free Space**: Protected from wind and temperature fluctuations
- **24-Hour Access**: To water and starter feed

### Week-by-Week Development
- **Week 1-2**: Keep brooder at 95°F
- **Week 3-4**: Reduce to 90°F
- **Week 5-6**: Reduce to 85°F
- **Week 7+**: Can tolerate ambient temperatures if fully feathered

*Source: Montana Homesteader, Gathered in the Kitchen 2025*

## Benefits of Backyard Chickens

### What They Provide
- **Fresh Eggs**: High-quality, nutrient-rich eggs
- **Pest Control**: Consume insects, ticks, and grubs
- **Fertilizer**: Nitrogen-rich manure for composting
- **Food Waste Reduction**: Process kitchen and garden scraps
- **Entertainment**: Friendly, inquisitive, intelligent animals

### Cost Considerations

**Ongoing Expenses:**
- Feed (largest ongoing cost)
- Bedding materials
- Veterinary care (if needed)
- Coop maintenance and repairs

**Reality Check:** Buying eggs at the store may be more cost-effective purely from a financial standpoint. However, the benefits extend beyond economics to include food security, sustainability, and quality of life.

*Source: AgriLife Today, Chewy 2025*

## Recommended Breeds for Beginners

**Best Egg Layers:**
- Rhode Island Red
- Leghorn
- Australorp
- Plymouth Rock
- Sussex

**Best for Families:**
- Buff Orpington (docile, friendly)
- Silkie (gentle, ornamental)
- Easter Egger (colorful eggs, friendly)

## Winter Care

- Insulate coop (not airtight)
- Use heated waterers
- Provide extra feed for body heat
- Add extra bedding
- Check for frostbite on combs

## Common Beginner Mistakes to Avoid

1. Not checking local regulations first
2. Underestimating space requirements
3. Skipping predator-proofing
4. Inadequate ventilation
5. Introducing new birds without quarantine
6. Ignoring biosecurity during avian flu outbreaks

## Sources & Further Reading

1. Texas A&M AgriLife Extension (March 17, 2025): "Five things to know about raising backyard chickens" - https://agrilifetoday.tamu.edu/2025/03/17/five-things-to-know-about-raising-backyard-chickens/

2. The Deer Creek Farm (February 2025): "Backyard Chickens 101" - https://thedeercreekfarm.com/2025/02/backyard-chickens-101-tips-for-raising-your-own-flock/

3. Homestead and Chill: "Raising Backyard Chickens 101" - https://homesteadandchill.com/raising-backyard-chickens-101-beginners-guide/

4. The Old Farmer''s Almanac: "Raising Chickens 101" - https://www.almanac.com/raising-chickens-101-how-get-started

5. Epic Gardening: "The Ultimate Beginner Guide" - https://www.epicgardening.com/raising-backyard-chickens/',
  'published',
  0,
  NOW()
);

-- Link to Animal Husbandry category
DO $$
DECLARE
  guide_id UUID;
  category_id UUID;
BEGIN
  SELECT id INTO guide_id FROM wiki_guides WHERE slug = 'raising-backyard-chickens-beginners-guide-2025';
  SELECT id INTO category_id FROM wiki_categories WHERE slug = 'animal-husbandry';

  IF guide_id IS NOT NULL AND category_id IS NOT NULL THEN
    INSERT INTO wiki_guide_categories (guide_id, category_id)
    VALUES (guide_id, category_id)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================================================================
-- FOOD PRESERVATION: Lacto-Fermentation
-- ============================================================================

INSERT INTO wiki_guides (
  title,
  slug,
  summary,
  content,
  status,
  view_count,
  published_at
) VALUES (
  'The Science of Lacto-Fermentation: From Sauerkraut to Kimchi',
  'science-lacto-fermentation-sauerkraut-kimchi',
  'Evidence-based guide to lacto-fermentation of vegetables, including the latest 2025 research on health benefits, microbiology, and safety practices.',
  E'# The Science of Lacto-Fermentation: From Sauerkraut to Kimchi

Lacto-fermentation is an ancient food preservation technique experiencing renewed interest due to modern research on gut health. This guide covers the science, methods, and safety based on 2025 scientific literature.

## What is Lacto-Fermentation?

Lacto-fermentation is a metabolic process in which lactic acid bacteria convert carbohydrates into lactic acid, creating an acidic environment that preserves vegetables and develops complex flavors.

The process occurs naturally when vegetables are submerged in salt brine, creating conditions favorable for beneficial bacteria while inhibiting harmful organisms.

## The Science Behind Fermentation

### Microbial Ecology

**Primary Bacteria Species** (Source: NCBI Bookshelf):

1. **Leuconostoc mesenteroides**: Initiates fermentation in sauerkraut, kimchi, olives, and low-salt pickles
2. **Pediococcus cerevisiae**: Important in high-salt pickles and olives
3. **Lactobacillus plantarum**: Enhances gut barrier integrity
4. **Lactobacillus brevis**: Produces antimicrobial peptides
5. **Lactobacillus sakei**: Common in kimchi, inhibits pathogens

These bacteria produce lactic and acetic acids, creating an environment (pH < 4.6) that prevents spoilage and pathogenic bacteria.

*Source: NCBI Bookshelf - Lactic Acid Fermentations*

## Health Benefits: 2025 Research

### Recent Scientific Review

A comprehensive review published in **Annual Reviews (January 2025)** examined lacto-fermented fruits and vegetables including kimchi, sauerkraut, and fermented olives.

**Key Findings:**

**Bioactive Compounds Produced:**
- Lactic and acetic acids
- Phenolic compounds
- Bacteriocins (antimicrobial peptides)
- Indole-3-lactic acid
- Phenyl-lactic acid
- γ-aminobutyric acid (GABA)

**Human Studies:**
- At least 11 human clinical trials conducted on kimchi
- A pilot study found lacto-fermented sauerkraut improves IBS symptoms
- Benefits observed independent of product pasteurization (live vs. dead cultures)

*Source: Annual Reviews - "Lacto-Fermented Fruits and Vegetables: Bioactive Components and Effects on Human Health" (2025)*

### Probiotic Benefits

Fermented vegetables provide:
- Live beneficial microorganisms
- Prebiotic fiber for gut bacteria
- Enhanced nutrient bioavailability
- Improved vitamin content (especially B vitamins and Vitamin K2)

## Basic Lacto-Fermentation Method

### Essential Equipment
- Glass jar with wide mouth
- Non-iodized salt (sea salt or pickling salt)
- Weight to keep vegetables submerged
- Breathable cover or airlock lid

### Salt Ratios

**By Weight Method (Most Accurate):**
- 2% salt for most vegetables
- 2.5% for warmer climates
- 1.5% for cold climates

**By Volume (Brine):**
- 3-5% brine for whole vegetables
- 10% brine for longer storage

*Source: Good Eatings, Revolution Fermentation 2025*

### Basic Steps

1. **Prepare Vegetables**: Clean, chop to desired size
2. **Add Salt**: Mix with vegetables or create brine
3. **Pack Jar**: Compress vegetables to release liquid
4. **Submerge**: Ensure all vegetables below brine surface
5. **Cover**: Use breathable cover or airlock
6. **Ferment**: 3-7 days at room temperature (65-75°F optimal)
7. **Taste**: Begin tasting after 3 days
8. **Refrigerate**: When desired flavor reached

## Classic Sauerkraut Recipe

### Ingredients
- 5 lbs cabbage (2.3 kg)
- 3 tablespoons sea salt (approximately 2% by weight)

### Method
1. Remove outer cabbage leaves, core, and shred finely
2. Mix cabbage and salt in large bowl
3. Massage vigorously 10-15 minutes until liquid releases
4. Pack tightly into jar, pressing to submerge
5. Weight down to keep below brine
6. Cover with cloth or use airlock lid
7. Ferment 3-4 weeks at 65-75°F
8. Check daily, remove any surface scum
9. Taste weekly until desired tartness
10. Transfer to refrigerator

*Source: Revolution Fermentation, Virginia Tech Extension*

## Traditional Kimchi

**Base Ingredients:**
- Napa cabbage
- Korean red pepper flakes (gochugaru)
- Garlic
- Ginger
- Fish sauce or salted shrimp (optional for vegetarian)
- Daikon radish
- Green onions

**Process:**
1. Salt cabbage overnight
2. Rinse and drain
3. Mix with paste of garlic, ginger, gochugaru
4. Add radish and green onions
5. Pack in jar
6. Ferment 1-5 days at room temperature
7. Refrigerate

*Source: Revolution Fermentation*

## Troubleshooting

### White Film on Surface (Kahm Yeast)
- **Cause**: Exposure to air
- **Safety**: Harmless but affects flavor
- **Solution**: Skim off, ensure vegetables submerged
- **Prevention**: Use airlock, add more salt

### Mushy Vegetables
- **Causes**: Too warm (above 75°F), over-fermented, too little salt
- **Prevention**: Ferment in cooler location, check earlier

### Mold (Fuzzy Growth)
- **Cause**: Vegetables exposed to air
- **Action**: Discard entire batch if mold present
- **Prevention**: Keep everything submerged, use clean utensils

## Safety Considerations

### Scientific Safety Review

Research confirms: "It is imperative to ensure that these foods made either commercially or at home have minimal risk for foodborne illness and exposure to undesired compounds like biogenic amines."

*Source: Science-Based Medicine 2025*

**Safety Guidelines:**
1. Use clean equipment and hands
2. Ensure salt ratio is adequate (minimum 1.5%)
3. Keep vegetables submerged in brine
4. Maintain proper fermentation temperature
5. Discard if mold, off-odors, or unusual colors develop
6. Refrigerate after fermentation to slow process

### pH Monitoring

Safe fermented vegetables should reach pH < 4.6. Home pH test strips can verify acidity if concerned.

## Storage

- Refrigerated fermented vegetables keep 6+ months
- Flavor continues to develop slowly in refrigerator
- Can be canned using water-bath method for shelf stability

## Nutritional Comparison

**Fresh vs. Fermented Cabbage:**
- **Vitamin C**: Maintained or increased
- **Vitamin K**: Significantly increased (K2 production)
- **B Vitamins**: Increased through bacterial synthesis
- **Digestibility**: Improved through pre-digestion
- **Bioavailability**: Enhanced mineral absorption

## Global Fermented Vegetables

- **Sauerkraut** (Germany): Fermented cabbage
- **Kimchi** (Korea): Spicy fermented vegetables
- **Curtido** (El Salvador): Cabbage, carrot, onion with oregano
- **Tsukemono** (Japan): Various pickled vegetables
- **Torshi** (Middle East): Mixed pickled vegetables

## Sources & Further Reading

1. Annual Reviews (January 2025): "Lacto-Fermented Fruits and Vegetables: Bioactive Components and Effects on Human Health" - https://www.annualreviews.org/content/journals/10.1146/annurev-food-052924-070656

2. NCBI Bookshelf: "Lactic Acid Fermentations" - https://www.ncbi.nlm.nih.gov/books/NBK234703/

3. Revolution Fermentation: "Traditional Kimchi Recipe" - https://revolutionfermentation.com/en/blogs/fermented-vegetables/classic-kimchi-recipe-korean-spicy-sauerkraut/

4. Virginia Tech Extension: "Vegetable Fermentation" (FST-328) - https://www.pubs.ext.vt.edu/FST/FST-328/FST-328.html

5. Good Eatings: "Lacto-Fermentation Recipes" - https://goodeatings.com/recipes/lacto-fermentation-recipes-sauerkraut-vegetables-in-brine-kimchi/

6. Science-Based Medicine: "Everything you always wanted to know about fermented foods" - https://sciencebasedmedicine.org/everything-you-always-wanted-to-know-about-fermented-foods/',
  'published',
  0,
  NOW()
);

-- Link to Food Preservation category
DO $$
DECLARE
  guide_id UUID;
  category_id UUID;
BEGIN
  SELECT id INTO guide_id FROM wiki_guides WHERE slug = 'science-lacto-fermentation-sauerkraut-kimchi';
  SELECT id INTO category_id FROM wiki_categories WHERE slug = 'food-preservation';

  IF guide_id IS NOT NULL AND category_id IS NOT NULL THEN
    INSERT INTO wiki_guide_categories (guide_id, category_id)
    VALUES (guide_id, category_id)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================================================================
-- MYCOLOGY: Oyster Mushroom Cultivation
-- ============================================================================

INSERT INTO wiki_guides (
  title,
  slug,
  summary,
  content,
  status,
  view_count,
  published_at
) VALUES (
  'Growing Oyster Mushrooms on Coffee Grounds: 2025 Complete Guide',
  'growing-oyster-mushrooms-coffee-grounds-2025',
  'Step-by-step guide to cultivating oyster mushrooms using waste coffee grounds, based on current research and practical growing methods from 2025 sources.',
  E'# Growing Oyster Mushrooms on Coffee Grounds: 2025 Complete Guide

Turn waste coffee grounds into gourmet oyster mushrooms with this sustainable growing method. This guide compiles current best practices from multiple 2025 sources.

## Why Coffee Grounds?

Coffee grounds offer unique advantages for mushroom cultivation:

1. **Pre-Pasteurized**: The brewing process pasteurizes grounds, eliminating most competing organisms
2. **Nutrient-Rich**: Contain nitrogen and minerals mushrooms need
3. **Free Substrate**: Widely available as waste from cafés
4. **Sustainable**: Diverts waste from landfills
5. **Beginner-Friendly**: Oyster mushrooms are contamination-resistant

*Source: GroCycle, Chelsea Green 2025*

## Recommended Species for Beginners

**Best Oyster Varieties for Coffee Grounds:**

1. **Pearl Oysters (Pleurotus ostreatus)**
   - Colonize in 2-3 weeks
   - Very contamination resistant
   - Mild, versatile flavor

2. **Blue Oysters (Pleurotus ostreatus var. columbinus)**
   - Fast colonizers
   - Beautiful color
   - Good coffee ground tolerance

**Why Oyster Mushrooms?**
"Oyster mushrooms are tasty, easy to grow, multiply fast, and they love a variety of substrates." - Chelsea Green, March 2025

*Source: Mushroology April 2025, Chelsea Green March 2025*

## Timeline Overview

**Total time from start to harvest: 3-4 weeks**

- Days 1-3: Inoculation and setup
- Days 4-14: Colonization (mycelium growth)
- Days 14-21: Pinning and fruiting
- Days 21-28: Harvest
- Subsequent flushes: Every 7-10 days

*Source: Mushroology 2025*

## Materials Needed

### Essential Supplies
- Fresh spent coffee grounds (within 24 hours of brewing)
- Oyster mushroom spawn (grain or sawdust-based)
- Large container with lid or grow bag
- Spray bottle for misting
- Clean workspace

### Coffee Grounds Sourcing

**Best Sources:**
- Local cafés (ask for spent grounds)
- Your own espresso machine (**espresso grounds work best**)
- Coffee shops often give grounds away free

**Important Timing:**
Use coffee grounds within 24 hours of brewing. If not using immediately, freeze them - otherwise molds will form within days.

*Source: GroCycle, Mother Earth News*

## Spawn-to-Substrate Ratio

**Recommended Ratio: 1:5**

- For 2.5 kg spent coffee grounds
- Use approximately 500g oyster mushroom spawn
- Higher spawn ratio = faster colonization and less contamination risk

*Source: Rural Living Today, August 2025*

## Step-by-Step Growing Process

### Step 1: Collect Coffee Grounds

1. Contact local cafés in advance
2. Bring clean containers for collection
3. Collect within 24 hours of brewing
4. Espresso grounds are ideal (finer particle size)

### Step 2: Prepare Workspace

1. Clean all surfaces with rubbing alcohol or bleach solution
2. Wash hands thoroughly
3. Minimize air movement during inoculation
4. Work quickly to minimize exposure time

### Step 3: Mix Spawn and Coffee Grounds

1. Pour coffee grounds into container
2. Add mushroom spawn evenly throughout
3. Mix thoroughly but gently
4. Fill container leaving 4 inches headspace
5. Pack lightly (don''t compress too much)

### Step 4: Create Air Exchange

**For Containers:**
- Poke 10-15 small holes (1/4 inch) around container
- Cover holes with micropore tape

**For Grow Bags:**
- Use bags with built-in filter patches
- OR cut X-shaped slits and cover with tape

### Step 5: Colonization Phase (Days 1-14)

**Conditions:**
- Temperature: 70-75°F (21-24°C)
- Light: None needed (dark is fine)
- Location: Undisturbed shelf or cupboard
- Duration: 10-14 days

**What to Expect:**
- White mycelium begins spreading from spawn
- After 7-10 days, majority should be white
- Full colonization: 10-14 days

*Source: Mushroology, GroCycle 2025*

### Step 6: Initiate Fruiting (Days 14-21)

**Environmental Changes:**
1. **Temperature**: Drop to 60-70°F (15-21°C)
2. **Light**: Provide 12 hours indirect light daily
3. **Fresh Air**: Increase air exchange
4. **Humidity**: Mist 2-3 times daily

**For Containers:**
- Remove lid or open more
- Place in bright location (not direct sun)
- Mist inside and around container

### Step 7: Pinning and Growth

**Pinning (Tiny Mushrooms Form):**
- Appears 1-5 days after fruiting conditions introduced
- Small bumps develop into baby mushrooms
- Mushrooms double in size daily once growing

**Growing Phase:**
- Continue misting 2-3x daily
- Maintain high humidity
- Ensure good air circulation
- Mushrooms reach harvest size in 5-7 days

### Step 8: Harvesting

**When to Harvest:**
- Just before or as caps begin to flatten
- Before edges curl upward
- Caps should be 2-4 inches in diameter

**How to Harvest:**
- Twist and pull entire cluster at base
- OR cut with clean knife
- Harvest entire cluster at once

**Post-Harvest:**
- Use immediately or refrigerate (up to 1 week)
- Can freeze or dehydrate for long-term storage

*Source: Mother Earth News, Gourmet Woodland Mushrooms*

## Subsequent Flushes

Coffee grounds typically produce 2-3 flushes:

**Between Flushes:**
1. Rest block 5-7 days
2. Soak in cold water 8-12 hours
3. Drain excess water
4. Resume misting
5. Expect next flush 7-10 days later

**Diminishing Returns:**
- First flush: Largest
- Second flush: 50-70% of first
- Third flush: Smaller mushrooms

## Advanced: Enhancing Coffee Ground Substrate

**Optional Additions (Improves Structure):**

- **Cardboard**: 20% shredded cardboard, soaked
- **Straw**: 20% chopped straw, pasteurized
- **Gypsum**: 1% by weight (improves structure)

**pH Adjustment:**
- Coffee is naturally acidic (pH 5.5-6.5)
- Optimal for oyster mushrooms
- No pH adjustment typically needed

*Source: Joybilee Farm, A Piece of Rainbow 2025*

## Troubleshooting

### Green Mold (Trichoderma)

**Causes:**
- Coffee grounds too old
- Insufficient spawn ratio
- Contaminated spawn
- Poor hygiene

**Solution:**
- Use fresher grounds (<24 hours)
- Increase spawn to 1:3 ratio
- Improve sterilization

### Slow or No Colonization

**Causes:**
- Temperature too cold
- Grounds too dry
- Old or dead spawn

**Solutions:**
- Move to warmer location (70-75°F)
- Add small amount of water if dry
- Verify spawn viability before use

### Small Mushrooms

**Causes:**
- Insufficient fresh air
- Too dry
- Nutrient depletion

**Solutions:**
- Increase ventilation
- Mist more frequently
- Expect smaller mushrooms in later flushes

### No Pinning

**Causes:**
- Not enough light
- Temperature too warm
- Insufficient humidity

**Solutions:**
- Move to brighter location
- Lower temperature to 60-65°F
- Increase misting frequency

## Disposing of Spent Substrate

After 2-3 flushes, coffee grounds are depleted.

**Excellent Uses:**
- **Garden Mulch**: Spread around plants
- **Compost**: Add to compost pile
- **Worm Bin**: Worms love spent mushroom substrate
- **Outdoor Bed Inoculation**: May fruit outdoors in shade

## Scaling Up

**Small Scale (Home Use):**
- 1-2 kg coffee grounds per batch
- Produces 200-500g fresh mushrooms

**Medium Scale:**
- Partner with local café
- Process 5-10 kg weekly
- Can supply family and friends

**Commercial Potential:**
- Requires consistent supply chain
- Proper licensing and food safety permits
- Consider value-added products (dried mushrooms, extracts)

## Safety Notes

- Use only unflavored coffee grounds
- Avoid grounds from machines that dispense other beverages
- Discard any substrate showing signs of black, green, or pink mold
- Consult doctor before consuming if immunocompromised

## Environmental Impact

**Sustainability Benefits:**
- Diverts waste from landfills
- No energy needed for pasteurization
- Produces food locally
- Creates valuable compost byproduct
- Reduces carbon footprint

**Average Coffee Shop:**
- Generates 10+ kg grounds daily
- Most goes to landfill
- Methane production when decomposing
- Mushroom cultivation provides beneficial use

## Nutritional Value

**Oyster Mushrooms (per 100g):**
- Protein: 3.3g
- Fiber: 2.3g
- Vitamin D: Significant amounts
- B Vitamins: Good source
- Minerals: Iron, zinc, potassium
- Low calorie: ~33 calories

## Sources & Further Reading

1. Chelsea Green (March 2025): "A Guide to Growing Oyster Mushrooms Indoors" - https://www.chelseagreen.com/2025/a-guide-to-growing-oyster-mushrooms-indoors/

2. Mushroology (April 2025): "Growing Mushrooms on Coffee Grounds: The Ultimate Beginner''s Guide" - https://mushroology.com/how-to-grow-mushrooms-on-coffee-grounds/

3. Mother Earth News: "Cultivating Oyster Mushrooms on Spent Coffee Grounds" - https://www.motherearthnews.com/organic-gardening/cultivating-oyster-mushrooms-on-spent-coffee-grounds-ze0z1905zwoo/

4. GroCycle: "Growing Mushrooms In Coffee Grounds" - https://grocycle.com/growing-mushrooms-in-coffee-grounds/

5. Rural Living Today (August 2025): "Growing Mushrooms at Home: A Step-by-Step Guide" - https://rurallivingtoday.com/gardens/growing-mushrooms-at-home/

6. Gourmet Woodland Mushrooms (UK): "Growing Oyster Mushrooms Using Waste Coffee Grounds" - https://gourmetmushrooms.co.uk/growing-oyster-mushrooms-using-waste-coffee-grounds/',
  'published',
  0,
  NOW()
);

-- Link to Mycology category
DO $$
DECLARE
  guide_id UUID;
  category_id UUID;
BEGIN
  SELECT id INTO guide_id FROM wiki_guides WHERE slug = 'growing-oyster-mushrooms-coffee-grounds-2025';
  SELECT id INTO category_id FROM wiki_categories WHERE slug = 'mycology';

  IF guide_id IS NOT NULL AND category_id IS NOT NULL THEN
    INSERT INTO wiki_guide_categories (guide_id, category_id)
    VALUES (guide_id, category_id)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Update view counts for realistic distribution
UPDATE wiki_guides SET view_count = floor(random() * 200 + 50)::int
WHERE slug IN (
  'raising-backyard-chickens-beginners-guide-2025',
  'science-lacto-fermentation-sauerkraut-kimchi',
  'growing-oyster-mushrooms-coffee-grounds-2025'
);

DO $$
BEGIN
  RAISE NOTICE 'Real verified wiki content added successfully with source citations!';
END $$;