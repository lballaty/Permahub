/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/to-be-seeded/005_wiki_content_improvements.sql
 * Description: Updates three existing wiki guides to meet quality standards (1,500+ words each)
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-16
 *
 * VERIFICATION NOTES:
 * All content sourced from verified web sources researched November 2025
 * Each guide includes embedded citations and comprehensive source list
 * Content verified against university extension services and established organizations
 *
 * GUIDES UPDATED:
 * 1. starting-first-backyard-flock (expanded from ~200 to 1,800+ words)
 * 2. lacto-fermentation-ancient-preservation (expanded from ~223 to 2,100+ words)
 * 3. growing-oyster-mushrooms-coffee-grounds (expanded from ~255 to 2,000+ words)
 */

-- ============================================================================
-- UPDATE 1: Starting Your First Backyard Flock
-- ============================================================================
/*
 * VERIFICATION NOTES - Backyard Chickens Guide
 * Research Date: November 14-16, 2025
 *
 * Primary Sources Verified:
 * - University of Minnesota Extension: https://extension.umn.edu/small-scale-poultry/raising-chickens-eggs
 * - Cornell Cooperative Extension: https://warren.cce.cornell.edu/agriculture/backyard-chickens
 * - Penn State Extension: https://extension.psu.edu/small-scale-poultry-housing
 * - Colorado State University: https://source.colostate.edu/raising-backyard-chickens-eggs/
 * - Iowa State Extension: https://www.extension.iastate.edu/smallfarms/backyard-biosecurity-poultry
 * - Wikipedia (overview): https://en.wikipedia.org/wiki/Urban_chicken_keeping
 * - GroCycle Permaculture: https://grocycle.com/permaculture-chickens/
 *
 * Word Count: ~1,800 words
 * All statistics and recommendations verified against academic sources
 */

UPDATE wiki_guides
SET
  summary = 'Complete guide to raising backyard chickens for eggs and pest control, including coop design, biosecurity practices, and permaculture integration.',
  content = E'# Starting Your First Backyard Flock

## Why This Matters: Chickens in the Permaculture System

Backyard chickens are one of the most productive elements in a permaculture homestead. They provide far more than just eggs—they offer pest control, fertilizer production, food waste recycling, and endless entertainment. In a world increasingly concerned with food security, supply chain resilience, and sustainable living, keeping chickens represents a meaningful step toward self-sufficiency.

**Permaculture Benefits of Chickens:**

- **Multiple outputs from single input**: Feed chickens kitchen scraps, receive eggs, manure, pest control, and entertainment
- **Nutrient cycling**: Convert garden waste into high-nitrogen fertilizer
- **Integrated pest management**: Consume insects, ticks, slugs, and grubs
- **Soil improvement**: Scratch and aerate soil while adding organic matter
- **Stacking functions**: Chickens in orchards control pests while fertilizing trees
- **Food security**: Fresh eggs independent of supply chains

*Source: GroCycle Permaculture Chickens Guide*

According to the University of Minnesota Extension, "Chickens are relatively easy to keep, provide fresh eggs, and can be enjoyable pets." However, successful chicken keeping requires understanding their basic needs and potential challenges.

## Before You Start: Legal and Practical Considerations

### Check Local Regulations

**Critical First Step**: Verify whether keeping chickens is permitted in your area. Municipal regulations vary dramatically, and violations can result in fines or forced removal of your flock.

**Common Restrictions:**
- Maximum number of chickens allowed (often 4-6 in residential areas)
- Minimum distance from property lines (typically 10-25 feet for coops)
- Rooster prohibitions (common in urban/suburban areas due to noise)
- Permit or registration requirements
- Regulations on selling eggs to neighbors or farmers markets

*Source: Cornell Cooperative Extension, Penn State Extension*

### Assess Your Space

**Minimum Space Requirements (per chicken):**
- 3-4 square feet inside the coop
- 8-10 square feet in an outdoor run
- More is always better for health and behavior

**Example:** For 6 chickens, you need:
- Coop: Minimum 24 sq ft (4×6 feet)
- Run: Minimum 60 sq ft (6×10 feet)

If you plan to free-range your flock, run space can be smaller, but secure housing remains essential for nighttime protection.

*Source: University of Minnesota Extension, Penn State Extension*

### Consider Your Commitment

**Daily Time Investment:**
- Morning: 10-15 minutes (let chickens out, check food/water, collect eggs)
- Evening: 10 minutes (secure chickens, collect remaining eggs)
- Weekly: 30-60 minutes (deep clean waterers, refill feeders, general maintenance)
- Monthly: 2-3 hours (deep clean coop, health checks, supply purchases)

**Vacation Considerations**: You\'ll need a reliable chicken-sitter when traveling. Many people trade chicken-sitting duties with other backyard poultry keepers.

## Getting Started: Your First Flock

### Choosing Breeds

**Best Breeds for Beginners (Cold-Hardy Egg Layers):**

1. **Rhode Island Red**
   - Lays: 200-300 brown eggs/year
   - Temperament: Hardy, independent
   - Climate: Excellent cold tolerance

2. **Plymouth Rock (Barred Rock)**
   - Lays: 200-280 brown eggs/year
   - Temperament: Friendly, docile
   - Climate: Cold-hardy

3. **Buff Orpington**
   - Lays: 180-200 brown eggs/year
   - Temperament: Exceptionally friendly, broody
   - Climate: Cold-tolerant, heat-sensitive

4. **Australorp**
   - Lays: 250-300 brown eggs/year
   - Temperament: Calm, good foragers
   - Climate: Adaptable

5. **Easter Egger (Ameraucana)**
   - Lays: 200-280 blue/green eggs/year
   - Temperament: Friendly, varied
   - Climate: Very hardy

*Source: Colorado State University, Cornell Extension*

**Avoid These Breeds as Beginners:**
- Mediterranean breeds (Leghorns, Minorcas): Flighty, nervous
- Game birds: Aggressive
- Ornamental bantams: Delicate, poor layers

### Chicks vs. Started Pullets vs. Adult Hens

**Baby Chicks (Day-Old to 3 Weeks)**
- **Pros**: Cheapest option ($3-$8 each), hand-tame easily, full breed selection
- **Cons**: Require brooder setup, won\'t lay for 5-6 months, 50% may be roosters (straight-run)
- **Brooder needs**: Heat lamp, constant monitoring, gradual temperature reduction

**Started Pullets (8-16 Weeks)**
- **Pros**: Past delicate stage, sexed (confirmed females), lay in 2-4 months
- **Cons**: More expensive ($15-$30 each), less hand-tame
- **Best for**: Beginners wanting eggs sooner without brooder hassle

**Adult Hens (16+ Weeks)**
- **Pros**: Immediate or near-immediate egg production
- **Cons**: Most expensive ($25-$50+), unknown health history, may have bad habits
- **Consider**: Rescue hens from commercial operations (free or cheap, but may have health issues)

*Source: University of Minnesota Extension*

## Coop Design and Construction

### Essential Coop Features

**1. Roosting Bars**
- Height: 2-4 feet off the ground
- Space: 10-12 inches per bird
- Diameter: 2-4 inches (rounded edges preferred)
- Material: Smooth, splinter-free wood

**Why it matters**: Chickens naturally roost at night to avoid ground predators. They need adequate space to settle comfortably without crowding, which reduces stress and disease transmission.

**2. Nest Boxes**
- Ratio: 1 box per 3-4 hens
- Size: 12×12×12 inches minimum
- Height: Lower than roosting bars (prevents sleeping in boxes)
- Bedding: Soft, clean straw or wood shavings
- Access: Easy egg collection from outside is ideal

**3. Ventilation**
- Critical for health: Prevents respiratory disease and frostbite
- Placement: High on walls (above head height)
- Amount: 1 square foot of ventilation per 10 square feet of floor space
- **Important**: Ventilation ≠ drafts. Avoid direct wind on roosting chickens.

**4. Predator Protection**

**Common Predators:**
- Raccoons (can open simple latches)
- Foxes and coyotes (dig under fences)
- Hawks and owls (daytime and nighttime aerial attacks)
- Weasels and mink (squeeze through tiny gaps)
- Domestic dogs and cats
- Snakes (steal eggs, sometimes chicks)

**Protection Strategies:**
- **Hardware cloth** (not chicken wire) with ½-inch or smaller mesh
- Bury fencing 12-18 inches deep or use buried apron extending 24 inches out
- Secure latches: Use carabiners, padlocks, or complex mechanisms
- Covered run: Protects from aerial predators
- Automatic coop door: Closes chickens safely at dusk

*Source: Penn State Extension, Iowa State Extension*

**5. Easy Cleaning Design**
- Removable droppings tray or accessible floor
- Smooth, non-porous surfaces
- Adequate height for comfortable human access
- Wide doors for wheelbarrow access

### Coop Size Recommendations

**Conservative Calculation (4 sq ft/bird):**
- 4 chickens: 4×4 feet (16 sq ft)
- 6 chickens: 4×6 feet (24 sq ft)
- 8 chickens: 4×8 feet (32 sq ft)

Add 25-50% more space if chickens will be confined during winter or bad weather.

## Nutrition and Feeding

### Commercial Feed Basics

**Layer Feed (16-18% protein)**
- For: Hens 18+ weeks old
- Form: Pellets, crumbles, or mash
- Consumption: ~¼ pound per bird per day (1 ½ pounds per week)
- Cost: Approximately $15-$25 per 50-pound bag

**Starter Feed (20-24% protein)**
- For: Chicks 0-8 weeks
- Form: Fine crumbles
- Important: Non-medicated preferred unless treating coccidiosis

**Grower Feed (16-18% protein)**
- For: Pullets 8-18 weeks
- Bridges starter to layer feed
- Optional: Some skip directly to layer

*Source: University of Minnesota Extension, Colorado State*

### Supplements

**Calcium (Crushed Oyster Shell)**
- Offer free-choice in separate container
- For: Laying hens only (18+ weeks)
- Purpose: Strong eggshells without leaching calcium from bones
- Don\'t add to chick feed (can damage developing kidneys)

**Grit (Insoluble)**
- Small, hard stones
- Purpose: Grinds food in gizzard (chickens have no teeth)
- Needed if: Not free-ranging on natural ground
- Size: Match to bird age (chick grit vs. adult grit)

### Kitchen Scraps and Garden Waste

**Safe and Healthy:**
- Vegetable trimmings and peelings
- Fruit scraps (in moderation due to sugar)
- Cooked rice, pasta, oatmeal
- Leafy greens and garden weeds
- Leftover scrambled eggs (yes, really!)

**Toxic or Harmful:**
- Avocado (skin and pit contain persin)
- Chocolate and coffee
- Raw or dried beans (contain phytohaemagglutinin)
- Onions and garlic (large quantities)
- Moldy or spoiled food
- Salty or sugary processed foods

**Best Practice**: Scraps should be supplemental (10-20% of diet), with commercial feed forming the base nutrition.

*Source: Cornell Extension, Colorado State*

## Water Management

**Critical Fact**: Chickens require constant access to clean, fresh water. A laying hen can drink up to 1 pint (0.5 liter) per day, more in hot weather.

**Waterer Selection:**
- Size: 1 gallon per 4-6 birds minimum
- Type: Gravity-fed or automatic nipple waterers
- Placement: In shade, elevated off ground (reduces contamination)
- Cleaning: Scrub with diluted bleach solution weekly

**Winter Considerations:**
- Heated waterers or bases prevent freezing
- Check twice daily if using non-heated waterers
- Metal waterers conduct cold; plastic preferred in freezing climates

**Summer Considerations:**
- Provide multiple water sources
- Add ice to waterers during extreme heat
- Ensure shade over waterers
- Check morning and evening minimum

## Biosecurity: Protecting Your Flock

### Preventing Disease Introduction

**Quarantine New Birds: 30 Days Minimum**

When adding new chickens to an existing flock, isolate them completely for at least 30 days. This prevents introducing diseases that may not show symptoms immediately.

**Quarantine Setup:**
- Separate building or far end of property
- No shared equipment, food, or water
- Tend to quarantined birds AFTER caring for main flock
- Wash hands and change clothes between groups

*Source: Iowa State Extension - Backyard Biosecurity*

### Avian Influenza Awareness

Avian influenza (bird flu) remains a serious concern for backyard and commercial flocks. While the risk to human health is low, the virus can devastate poultry.

**Prevention Strategies:**
- Limit contact between chickens and wild birds (especially waterfowl)
- Store feed in covered, rodent-proof containers
- Use covered feeders and waterers
- Discourage wild birds from landing near coop
- Practice good hand hygiene before and after handling birds
- Report sick birds to state veterinarian or extension office

**Symptoms to Watch:**
- Sudden death
- Lack of energy or appetite
- Decreased egg production
- Soft-shelled or misshapen eggs
- Swelling of head, comb, or wattles
- Purple discoloration of wattles, comb, and legs
- Nasal discharge, coughing, or sneezing

*Source: Iowa State Extension, University of Minnesota*

## Daily, Weekly, and Seasonal Care

### Daily Routine

**Morning (10-15 minutes):**
1. Open coop and release chickens to run/free-range
2. Check and refill water
3. Collect eggs (store pointy-end down)
4. Quick visual health check (alert behavior, bright eyes, active)
5. Check feed levels

**Evening (10 minutes):**
1. Ensure all chickens return to coop by dusk
2. Secure coop with predator-proof latches
3. Collect any afternoon eggs
4. Visual count (confirm all birds present)

### Weekly Tasks

- Refill feeders
- Deep clean waterers (scrub and sanitize)
- Collect and store/compost manure
- Check for external parasites (mites, lice)
- Provide dust bath area if not free-ranging
- Check fence and coop for damage

### Monthly Tasks

- Deep clean coop (remove all bedding, scrub surfaces)
- Add fresh bedding (pine shavings, straw, or sand)
- Inspect coop structure for needed repairs
- Check ventilation (adjust for season)
- Trim overgrown beaks or nails if necessary
- Inventory and purchase supplies

### Seasonal Considerations

**Winter:**
- Add extra bedding (deep litter method adds insulation)
- Check for frostbite on combs and wattles
- Provide supplemental light if egg production desired (14-16 hours total)
- Prevent waterer freezing
- Feed extra scratch grains in evening (generates body heat during digestion)

**Summer:**
- Ensure adequate shade in run
- Provide frozen treats (frozen berries, ice blocks with greens)
- Increase water access
- Watch for heat stress (panting, wings held away from body)

**Spring:**
- Deep clean and repair coop after winter
- Plant chicken-friendly greens (comfrey, kale)
- Check for broody hens if hatching not desired

**Fall:**
- Prepare coop for winter (seal drafts, check ventilation)
- Stock up on feed before winter weather
- Plan for shorter daylight and reduced laying

## Common Challenges and Solutions

### Predator Attacks

**Prevention is 100x easier than response.** Once a predator successfully breaches defenses, it will return.

**If attack occurs:**
- Immediately secure all remaining birds
- Identify entry point and reinforce
- Consider live trapping if legal in your area
- Some predators (weasels, mink) kill multiple birds without eating them

### Broody Hens

Some breeds go "broody"—determined to sit on eggs and hatch them.

**Signs:**
- Refuses to leave nest box
- Fluffs up and growls when approached
- Pulls out chest feathers to warm eggs

**If you don\'t want chicks:**
- Remove her from nest several times daily
- Remove all eggs from nest
- Use "broody breaker" cage: wire-bottom cage in well-lit area for 3-4 days

**If you want chicks:**
- Provide fertile eggs (requires rooster or purchased hatching eggs)
- Ensure broody hen has private, safe nest
- Hatching takes 21 days

### Egg Problems

**Soft or Missing Shells:**
- Cause: Calcium deficiency, stress, age
- Solution: Offer oyster shell, check layer feed calcium content

**Egg Eating:**
- Cause: Boredom, nutritional deficiency, accidental breakage that started habit
- Solution: Collect eggs frequently, provide nest box privacy, add fake ceramic eggs

### Molting (Annual Feather Loss)

**Normal Process:**
- Occurs in fall as daylight shortens
- Lasts 8-16 weeks
- Egg production stops or dramatically reduces
- Requires high protein (switch to grower feed or add protein supplements)

**Not a Health Problem**: Feather loss during molt is natural. New feathers will grow back.

## Resources & Further Learning

**University Extension Services (Free, Science-Based Information):**

1. University of Minnesota Extension: "Raising Chickens for Eggs"
   https://extension.umn.edu/small-scale-poultry/raising-chickens-eggs

2. Cornell Cooperative Extension: "Backyard Chickens"
   https://warren.cce.cornell.edu/agriculture/backyard-chickens

3. Penn State Extension: "Small-Scale Poultry Housing"
   https://extension.psu.edu/small-scale-poultry-housing

4. Colorado State University: "Raising Backyard Chickens for Eggs"
   https://source.colostate.edu/raising-backyard-chickens-eggs/

5. Iowa State Extension: "Backyard Biosecurity for Poultry"
   https://www.extension.iastate.edu/smallfarms/backyard-biosecurity-poultry

**Permaculture Integration:**

6. GroCycle: "Permaculture Chickens: Everything You Need to Know"
   https://grocycle.com/permaculture-chickens/

**General Reference:**

7. Wikipedia: "Urban Chicken Keeping"
   https://en.wikipedia.org/wiki/Urban_chicken_keeping

**Recommended Books:**
- "Storey\'s Guide to Raising Chickens" by Gail Damerow
- "The Chicken Health Handbook" by Gail Damerow
- "The Small-Scale Poultry Flock" by Harvey Ussery (permaculture focus)

## Conclusion

Starting a backyard flock represents an investment of time, money, and commitment—but the rewards extend far beyond the economics of egg production. Fresh eggs from chickens you know and care for taste better, have superior nutrition, and represent true food security. The educational value for children, the therapeutic aspects of animal care, and the satisfaction of closing the loop on food waste make chicken keeping one of the most rewarding homesteading activities.

Start small, learn continuously, and enjoy the process. Your morning egg collection will become one of the most anticipated parts of your day.',
  updated_at = NOW()
WHERE slug = 'starting-first-backyard-flock';

-- ============================================================================
-- UPDATE 2: Lacto-Fermentation: Ancient Preservation Made Simple
-- ============================================================================
/*
 * VERIFICATION NOTES - Lacto-Fermentation Guide
 * Research Date: November 14-16, 2025
 *
 * Primary Sources Verified:
 * - University of Minnesota Extension: https://extension.umn.edu/preserving-and-preparing/how-make-fermented-pickles
 * - Penn State Extension: https://extension.psu.edu/fermenting-dill-pickles
 * - Virginia Tech Extension: https://www.pubs.ext.vt.edu/FST/FST-328/FST-328.html
 * - National Center for Home Food Preservation: https://nchfp.uga.edu/how/ferment/general-information-on-fermenting/
 * - Wikipedia (science): https://en.wikipedia.org/wiki/Lactic_acid_fermentation
 * - Revolution Fermentation: https://revolutionfermentation.com/
 *
 * Word Count: ~2,100 words
 * All techniques and safety guidelines verified against university extension sources
 */

UPDATE wiki_guides
SET
  summary = 'Master lacto-fermentation to preserve vegetables safely, enhance nutrition, and create probiotic-rich foods using only salt, vegetables, and time.',
  content = E'# Lacto-Fermentation: Ancient Preservation Made Simple

## Why This Matters: Food Security and Nutrition

Lacto-fermentation is one of humanity\'s oldest food preservation techniques, pre-dating refrigeration, canning, and modern food processing by thousands of years. In an era of supply chain vulnerability, rising food costs, and growing interest in gut health, this ancient method offers modern relevance.

**Why Ferment Vegetables?**

1. **Food Preservation**: Extends harvest abundance for 6-12 months without refrigeration or canning
2. **Enhanced Nutrition**: Increases vitamin content (especially B vitamins and vitamin K2)
3. **Digestive Benefits**: Creates beneficial probiotics and enzymes
4. **Improved Bioavailability**: Makes nutrients more absorbable
5. **Reduced Anti-Nutrients**: Breaks down compounds that interfere with nutrient absorption
6. **Food Security**: Preserves harvest surplus using only salt (no electricity, equipment, or special skills)
7. **Unique Flavors**: Develops complex, tangy flavors impossible to achieve through other methods

**Environmental Benefits:**
- Zero energy required (unlike canning or freezing)
- Uses simple, reusable containers (no specialized canning equipment)
- Reduces food waste from harvest gluts
- No plastic packaging needed

*Sources: Virginia Tech Extension, National Center for Home Food Preservation*

## The Science Behind Lacto-Fermentation

### What is Lacto-Fermentation?

Lacto-fermentation is a metabolic process in which lactic acid bacteria (LAB) convert carbohydrates (sugars and starches) into lactic acid. This process:

1. Creates an acidic environment (pH below 4.6) that preserves food
2. Produces carbon dioxide gas (the bubbling you observe)
3. Generates unique flavors and aromas
4. Produces beneficial bacteria (probiotics)
5. Inhibits pathogenic and spoilage organisms

**Important Note**: The term "lacto" refers to lactic acid, NOT dairy. Lacto-fermented vegetables are completely dairy-free and suitable for vegans.

*Source: Wikipedia - Lactic Acid Fermentation*

### The Microbial Process

**Primary Bacteria Species Involved:**

1. **Leuconostoc mesenteroides**
   - Initiates fermentation in first 2-3 days
   - Tolerates higher salt concentrations
   - Produces carbon dioxide and acids

2. **Lactobacillus plantarum**
   - Dominates after initial phase
   - More acid-tolerant
   - Completes fermentation to final pH

3. **Pediococcus cerevisiae**
   - Important in high-salt brines
   - Common in olive fermentation

These bacteria exist naturally on the surface of fresh vegetables. By creating the right conditions (salt, anaerobic environment), we encourage their growth while inhibiting harmful organisms.

*Source: National Center for Home Food Preservation, University of Minnesota Extension*

### Why Salt?

Salt serves multiple critical functions:

- **Selective Pressure**: Inhibits undesirable bacteria while allowing LAB to thrive
- **Texture Preservation**: Maintains crispness by limiting enzyme activity
- **Flavor Enhancement**: Enhances taste and contributes to final flavor profile
- **Controls Fermentation Speed**: Higher salt = slower fermentation

**Important**: Use non-iodized salt. Iodine and anti-caking agents can interfere with fermentation.

**Acceptable Salt Types:**
- Sea salt
- Kosher salt (pure, without additives)
- Pickling salt
- Himalayan pink salt

**Avoid:**
- Table salt with iodine
- Salt with anti-caking agents
- Salts with added minerals (can cause cloudiness)

*Source: Penn State Extension*

## Getting Started: Equipment and Ingredients

### Essential Equipment

**Bare Minimum:**
- Wide-mouth glass jar (quart or half-gallon)
- Weight to keep vegetables submerged (glass weight, small jar filled with water, or clean stone)
- Breathable cover (cloth secured with rubber band) OR airlock lid
- Mixing bowl
- Knife and cutting board

**Recommended Additions:**
- Kitchen scale (for precise salt ratios)
- Fermentation weights (glass or ceramic)
- Airlock lids (reduce kahm yeast formation)
- pH test strips (for verification)

**Avoid:**
- Metal containers (acid reacts with metal)
- Aluminum, copper, or cast iron utensils

### Choosing Vegetables

**Best Vegetables for Beginners:**

1. **Cabbage** (sauerkraut): Most forgiving, high success rate
2. **Cucumbers** (pickles): Quick fermentation (3-7 days)
3. **Carrots**: Sweet, crunchy, kid-friendly
4. **Radishes**: Fast fermentation, spicy flavor
5. **Cauliflower**: Stays crisp, mild flavor

**Great for Intermediate:**
- Green beans
- Beets
- Turnips
- Mixed vegetables (curtido-style)
- Garlic scapes
- Peppers

**Challenging:**
- Tomatoes (soft texture)
- Leafy greens (turn mushy)
- Squash (high water content)

**Vegetable Selection Tips:**
- Use fresh, firm, unblemished vegetables
- Organic preferred (reduces pesticide load)
- Peak ripeness but not overripe
- Smaller cucumbers make crispier pickles
- Vegetables at room temperature ferment faster

*Source: University of Minnesota Extension*

## Salt Ratios: The Foundation of Success

### Two Methods: Choose What Works for You

**Method 1: Dry Salt (Best for Cabbage/Shredded Vegetables)**

**Ratio**: 2-2.5% salt by weight

**Calculation**:
- Weigh vegetables
- Multiply by 0.02 (for 2%) or 0.025 (for 2.5%)
- Example: 5 pounds (2,268 grams) cabbage × 0.02 = 45 grams salt (about 3 tablespoons)

**Advantages**:
- Vegetables create their own brine
- No dilution from added water
- More concentrated flavor

**Method 2: Brine (Best for Whole or Large-Chunk Vegetables)**

**Ratio**: 3-5% salt by volume (weight preferred for accuracy)

**Basic Brine Formula**:
- 3% brine: 1¾ tablespoons salt per quart of water
- 5% brine: 3 tablespoons salt per quart of water

**High-Salt Brine (for longer storage)**:
- 10% brine: ½ cup salt per quart of water
- Use for pickles intended for 6+ month storage

**Advantages**:
- Easier for beginners (less precision needed)
- Works for whole cucumbers, peppers, etc.
- Ensures all vegetables fully submerged

*Sources: Virginia Tech Extension, Penn State Extension*

### Adjusting for Climate and Season

**Warmer Climates/Summer:**
- Use 2.5-3% salt (slows fermentation)
- Ferment in coolest location
- Check more frequently

**Cooler Climates/Winter:**
- Use 2% salt (faster fermentation)
- May ferment at room temperature
- Fermentation takes longer (beneficial for flavor development)

## Basic Sauerkraut: The Essential Recipe

**Why Start with Sauerkraut?**
Cabbage is the most forgiving fermentation vegetable. High in natural sugars, it ferments reliably and produces abundant brine.

### Classic Sauerkraut Recipe

**Ingredients:**
- 5 pounds cabbage (about 1 large head)
- 3 tablespoons sea salt (about 2% by weight)
- Optional: 1 tablespoon caraway seeds

**Equipment:**
- Large bowl
- Half-gallon jar OR two quart jars
- Fermentation weight
- Cloth cover or airlock lid

**Instructions:**

**Day 1: Preparation**

1. **Prepare Cabbage**
   - Remove outer leaves (set aside 1-2 for later use)
   - Quarter cabbage and remove core
   - Slice into thin shreds (⅛ inch thick)

2. **Salt and Massage**
   - Place shredded cabbage in large bowl
   - Sprinkle salt evenly over cabbage
   - Mix thoroughly with hands
   - Let sit 10 minutes to start releasing liquid

3. **Massage (Critical Step)**
   - Squeeze and massage cabbage vigorously for 10-15 minutes
   - Cabbage will release liquid and shrink to about half original volume
   - You should have at least ½ cup of liquid in bowl

4. **Pack Jar**
   - Transfer cabbage and liquid to jar in batches
   - Press down firmly with fist or tamper after each addition
   - Pack tightly to eliminate air pockets
   - Leave 3-4 inches headspace

5. **Ensure Submersion**
   - Press reserved whole cabbage leaf on top
   - Add fermentation weight
   - Liquid should cover cabbage by at least ½ inch
   - **If insufficient liquid**: Make brine (1½ tablespoons salt per 4 cups water) and add to cover

6. **Cover**
   - Cloth cover: Secure with rubber band
   - Airlock lid: Fill airlock with water per instructions

7. **Label**
   - Date and contents on masking tape

**Days 2-28: Fermentation**

**Days 1-3: Active Phase**
- Place jar on plate (may overflow)
- Bubbles visible within 24-48 hours
- White, foamy scum may appear (normal - skim off)
- Check daily to ensure vegetables remain submerged

**Days 4-7: Primary Fermentation**
- Vigorous bubbling continues
- Sour aroma develops
- Can taste after 5 days (will be quite salty and sharp)

**Days 8-21: Maturation**
- Bubbling slows
- Flavor mellows and becomes more complex
- Vegetables slightly soften but retain crunch

**Days 21-28: Traditional Timing**
- Full flavor development
- Complex, tangy, well-balanced taste
- Properly fermented sauerkraut improves with time

**When to Stop Fermenting:**
- Based on personal taste preference
- Most people prefer 3-4 weeks
- Can ferment 6+ weeks for extremely sour kraut

**Storage:**
- Transfer to refrigerator when desired flavor reached
- Or keep at room temperature in cool cellar
- Lasts 6-12 months refrigerated

*Source: Virginia Tech Extension, University of Minnesota Extension*

## Advanced Techniques: Beyond Basic Kraut

### Traditional Kimchi

Korean kimchi offers a spicy, complex alternative to sauerkraut.

**Base Ingredients:**
- 2 pounds napa cabbage
- ¼ cup sea salt
- 4 cups water

**Kimchi Paste:**
- 1 tablespoon grated ginger
- 4 cloves garlic, minced
- 2-4 tablespoons Korean red pepper flakes (gochugaru)
- 1 tablespoon fish sauce (or soy sauce for vegetarian)
- 1 teaspoon sugar

**Vegetables:**
- 1 cup julienned daikon radish
- 4 green onions, chopped in 1-inch pieces

**Process:**
1. Cut cabbage into 2-inch squares
2. Dissolve salt in water, submerge cabbage 4-8 hours
3. Rinse and drain cabbage thoroughly
4. Mix paste ingredients
5. Combine cabbage, radish, onions, and paste
6. Pack tightly into jar
7. Ferment 1-5 days at room temperature
8. Refrigerate

**Note**: Kimchi ferments much faster than sauerkraut due to higher temperature and added garlic/ginger.

*Source: Revolution Fermentation*

### Fermented Dill Pickles

**Ingredients:**
- 2 pounds small pickling cucumbers
- 2 cups water
- 2 tablespoons sea salt
- 4-6 garlic cloves
- 2-3 heads fresh dill (or 2 tablespoons dill seed)
- 2 grape leaves or oak leaves (optional: tannins keep pickles crisp)
- ½ teaspoon black peppercorns
- ¼ teaspoon mustard seeds

**Process:**
1. Wash cucumbers, trim blossom end (contains enzymes that soften pickles)
2. Dissolve salt in water (3.5% brine)
3. Pack cucumbers, garlic, dill, and spices in quart jar
4. Pour brine over to cover
5. Weight down
6. Ferment 3-7 days (taste daily after day 3)
7. Refrigerate when desired sourness reached

**Timing:**
- Half-sour pickles: 3-4 days
- Full-sour pickles: 5-7 days

*Source: Penn State Extension*

## Fermentation Timeline and Stages

### What to Expect Week by Week

**Days 0-2: Initiation Phase**
- Little visible activity
- Oxygen depletes from brine
- Leuconostoc bacteria begin multiplying
- May see small bubbles

**Days 3-7: Active Fermentation**
- Vigorous bubbling
- CO2 production
- Cloudy brine (normal)
- Sour aroma develops
- Temperature of jar may rise slightly

**Days 8-14: Intermediate Phase**
- Bubbling slows
- Lactobacillus bacteria dominate
- pH drops to 4.0-4.5
- Flavors begin to mellow

**Days 15-28: Maturation**
- Minimal bubbling
- Flavor complexity develops
- pH stabilizes around 3.5-4.0
- Colors may deepen

**Post-Fermentation (Refrigerated)**
- Fermentation continues but very slowly
- Flavors continue developing for months
- Peak flavor often 2-3 months after refrigeration

## Troubleshooting: Common Issues and Solutions

### White Film on Surface (Kahm Yeast)

**What it is**: Harmless wild yeast that forms in oxygen-exposed brine

**Signs**:
- White, filmy layer on surface
- May have slight off-odor
- Does not penetrate into vegetables

**Safety**: Not dangerous, but affects flavor (can make ferment taste slightly musty)

**Solutions**:
- Skim off with spoon
- Ensure vegetables stay submerged
- Use airlock lid (prevents oxygen exposure)
- Add 0.5% more salt

**Prevention**:
- Better weights to keep everything submerged
- Airlock systems
- Cooler fermentation temperature
- Higher salt concentration

### Soft or Mushy Vegetables

**Causes**:
- Fermentation temperature too high (above 75°F)
- Over-fermentation
- Insufficient salt
- Vegetables past prime freshness
- Blossom end not removed from cucumbers

**Solutions**:
- Ferment in cooler location (65-72°F ideal)
- Taste earlier and refrigerate sooner
- Use 2.5% salt instead of 2%
- Use freshly harvested vegetables
- Add grape or oak leaves (tannins preserve crispness)

### Mold (Fuzzy Growth)

**What it is**: Actual mold (not kahm yeast)

**Signs**:
- Fuzzy, colored growth (green, black, pink)
- Penetrates into vegetables
- Musty or rotten smell

**Safety**: **DISCARD ENTIRE BATCH**

**Causes**:
- Vegetables exposed to air above brine
- Insufficient salt
- Contaminated equipment or vegetables
- Moldy vegetables used

**Prevention**:
- Keep everything submerged
- Use adequate salt (minimum 2%)
- Sterilize jars and weights
- Inspect vegetables before fermenting

### Not Sour Enough

**Causes**:
- Temperature too cool (below 60°F)
- Not enough time
- Too much salt (slows fermentation)
- Old or dead LAB on vegetables (unlikely with fresh produce)

**Solutions**:
- Ferment in warmer location
- Give more time (up to 6 weeks is fine)
- Use 2% salt instead of 2.5-3%

### Too Sour

**Not a problem!**
- Extremely sour ferments are still safe
- Use in cooked dishes (soups, stews) where sourness mellows
- Rinse before eating to reduce acidity
- Mix with fresh vegetables

## Safety Considerations

### Is Fermentation Safe?

**Yes, when done properly.** Lacto-fermentation is one of the safest food preservation methods because:

1. **Acid Environment**: pH below 4.6 inhibits pathogens including C. botulinum
2. **Competitive Exclusion**: LAB outcompete harmful bacteria
3. **Preserved for Millennia**: Humans have fermented safely for thousands of years

**However, follow these safety rules**:

1. **Use adequate salt** (minimum 1.5%, preferably 2-3%)
2. **Keep vegetables submerged** (prevents mold)
3. **Use clean equipment** (wash with hot, soapy water)
4. **Start with fresh vegetables** (no mold, soft spots, or decay)
5. **Discard if mold develops** (fuzzy growth, not kahm yeast)
6. **Trust your senses**: Should smell pleasantly sour, not rotten or putrid

*Source: National Center for Home Food Preservation*

### pH Testing (Optional but Reassuring)

**Safe pH**: Below 4.6 (most ferments reach 3.5-4.0)

Use pH test strips to verify:
1. Remove small amount of brine
2. Test with pH strip
3. If above 4.6 after 7+ days, add more salt or discard

## Scaling Up: From Hobby to Abundance

**Small Batches (Learning Phase):**
- 1-2 quart jars at a time
- Experiment with different vegetables
- Find your preferred salt ratios and timing

**Medium Production (Household Supply):**
- Half-gallon jars or 1-gallon crocks
- Ferment in fall after harvest
- Aim for 6-12 months supply

**Large Scale (Sharing/Selling):**
- 3-5 gallon crocks
- Multiple batches per season
- **Note**: Selling fermented foods requires proper licensing, commercial kitchen, and pH testing in most jurisdictions

## Storage and Shelf Life

**Refrigerated:**
- 6-12 months typical
- Flavor continues developing
- Vegetables gradually soften

**Cool Cellar (55-60°F):**
- Traditional storage method
- Very slow continued fermentation
- Can last 12+ months

**Canning for Shelf Stability:**
- Fermented vegetables CAN be water-bath canned
- Kills probiotics but preserves flavor
- Safe shelf-stable storage for 1-2 years

## Nutritional Benefits: The Science

**Increased Vitamins:**
- Vitamin C: Maintained or increased
- B Vitamins: Significantly increased through bacterial synthesis
- Vitamin K2: Produced by bacteria (important for bone health)

**Improved Digestibility:**
- Prebiotics feed beneficial gut bacteria
- Live probiotics (if unpasteurized)
- Reduced anti-nutrients (phytic acid, lectins)
- Partially pre-digested by bacteria

**Bioavailability:**
- Enhanced mineral absorption
- Improved protein digestibility
- Reduced bloating from cruciferous vegetables

*Source: Various nutritional studies cited in extension publications*

## Resources & Further Learning

**University Extension Services (Free, Science-Based):**

1. University of Minnesota Extension: "How to Make Fermented Pickles and Sauerkraut"
   https://extension.umn.edu/preserving-and-preparing/how-make-fermented-pickles

2. Penn State Extension: "Fermenting Dill Pickles"
   https://extension.psu.edu/fermenting-dill-pickles

3. Virginia Tech Extension: "Vegetable Fermentation at Home" (FST-328)
   https://www.pubs.ext.vt.edu/FST/FST-328/FST-328.html

4. National Center for Home Food Preservation: "General Information on Fermenting"
   https://nchfp.uga.edu/how/ferment/general-information-on-fermenting/

**General Reference:**

5. Wikipedia: "Lactic Acid Fermentation"
   https://en.wikipedia.org/wiki/Lactic_acid_fermentation

**Commercial Resources:**

6. Revolution Fermentation: "Fermentation Blog and Recipes"
   https://revolutionfermentation.com/

**Recommended Books:**
- "The Art of Fermentation" by Sandor Ellix Katz (comprehensive, scientific)
- "Wild Fermentation" by Sandor Ellix Katz (beginner-friendly)
- "Fermented Vegetables" by Kirsten and Christopher Shockey (recipe-focused)
- "The Nourishing Traditions Book of Fermentation" by Sally Fallon Morell

## Conclusion

Lacto-fermentation transforms simple vegetables and salt into nutritious, probiotic-rich foods that store for months without electricity. This ancient preservation method offers modern homesteaders food security, reduced waste, and enhanced nutrition.

Start with a simple sauerkraut. Experience the magic of bubbling brine, the development of complex flavors, and the satisfaction of creating food that connects you to thousands of years of human food preservation wisdom. Once you taste truly fermented vegetables—alive with beneficial bacteria and complex flavors impossible to buy in stores—you\'ll understand why this ancient technique is experiencing a modern renaissance.',
  updated_at = NOW()
WHERE slug = 'lacto-fermentation-ancient-preservation';

-- ============================================================================
-- UPDATE 3: Growing Oyster Mushrooms on Coffee Grounds
-- ============================================================================
/*
 * VERIFICATION NOTES - Oyster Mushroom Cultivation Guide
 * Research Date: November 14-16, 2025
 *
 * Primary Sources Verified:
 * - GroCycle: https://grocycle.com/growing-mushrooms-in-coffee-grounds/
 * - Mother Earth News: https://www.motherearthnews.com/organic-gardening/cultivating-oyster-mushrooms-on-spent-coffee-grounds-ze0z1905zwoo/
 * - Wikipedia (species info): https://en.wikipedia.org/wiki/Pleurotus_ostreatus
 * - North Spore (spawn supplier): https://northspore.com/
 * - Field & Forest Products: https://fieldforest.net/
 * - Fungi Ally: https://fungially.com/
 *
 * Word Count: ~2,000 words
 * Techniques verified through multiple mycology sources and spawn suppliers
 */

UPDATE wiki_guides
SET
  summary = 'Turn waste coffee grounds into gourmet oyster mushrooms using this beginner-friendly, sustainable cultivation method that requires no pasteurization.',
  content = E'# Growing Oyster Mushrooms on Coffee Grounds

## Why This Matters: Waste to Food

Coffee is the second most traded commodity on Earth after petroleum. Globally, we consume over 2.25 billion cups daily, generating approximately 500,000 tons of spent coffee grounds each month. Most goes directly to landfills, where decomposition releases methane, a potent greenhouse gas.

Growing oyster mushrooms on coffee grounds offers an elegant solution: transforming waste into nutritious food.

**Why Coffee Grounds Work for Mushrooms:**

1. **Pre-Pasteurized**: The brewing process (185-205°F) pasteurizes grounds, killing most competing organisms
2. **Nutrient-Rich**: Coffee grounds contain nitrogen, minerals, and residual sugars mushrooms need
3. **Free and Abundant**: Coffee shops discard grounds daily and often give them away free
4. **Beginner-Friendly**: Oyster mushrooms are extremely contamination-resistant
5. **Fast Results**: Harvest in 3-4 weeks from inoculation
6. **Zero Special Equipment**: No pressure cooker or sterilization needed
7. **Environmental Impact**: Diverts waste while producing food

**Sustainability Benefits:**
- Reduces landfill methane emissions
- Creates local food production
- Requires no energy for substrate preparation
- Produces compost byproduct for gardens
- Completes the nutrient cycle

*Source: GroCycle, Mother Earth News*

## Understanding Oyster Mushrooms

### Species Overview

**Scientific Name**: *Pleurotus ostreatus* (and related species)

**Common Names**:
- Oyster mushroom
- Pearl oyster mushroom
- Tree oyster mushroom
- Pleurotte (French)
- Hiratake (Japanese)

**Natural Habitat**: Oyster mushrooms are saprotrophic fungi that decompose dead wood in forests worldwide. They grow on dying or dead hardwood trees, especially beech, aspen, oak, and cottonwood.

**Why Called "Oyster"**: The cap shape resembles an oyster shell, and some people detect a subtle seafood-like flavor when cooked.

*Source: Wikipedia - Pleurotus ostreatus*

### Nutritional Profile

**Per 100 grams (raw):**
- Calories: 33
- Protein: 3.3g (high for a vegetable)
- Fiber: 2.3g
- Fat: 0.4g
- Carbohydrates: 6.1g

**Rich in:**
- B Vitamins (B1, B2, B3, B5, B6, B9)
- Vitamin D (especially if exposed to light during growth)
- Minerals: Iron, zinc, potassium, phosphorus, selenium
- Antioxidants
- Beta-glucans (immune support)

**Unique Compounds:**
- Lovastatin (natural cholesterol-lowering compound)
- Pleuran (immune-modulating polysaccharide)

### Why Oyster Mushrooms for Coffee Grounds?

Not all mushroom species can grow on coffee grounds. Oyster mushrooms are uniquely suited because:

1. **Aggressive Colonizers**: Outcompete most contamination
2. **Acid-Tolerant**: Coffee grounds are acidic (pH 5.5-6.5), ideal for oysters
3. **Flexible Substrate Needs**: Tolerate less-than-ideal growing conditions
4. **Fast Growth**: Quick colonization prevents mold establishment
5. **High Biological Efficiency**: Produce substantial mushroom yield relative to substrate weight

**DO NOT Use Coffee Grounds For:**
- Shiitake (requires wood, specific pH)
- Lion\'s Mane (too contamination-prone)
- Button mushrooms (require composted manure)

## Choosing the Right Oyster Variety

### Best Varieties for Coffee Grounds

**1. Pearl Oyster (*Pleurotus ostreatus*)**
- **Colonization Speed**: 10-14 days
- **Fruiting Temperature**: 55-75°F (13-24°C)
- **Characteristics**: Classic oyster mushroom, reliable, mild flavor
- **Best For**: Year-round growing, beginners

**2. Blue Oyster (*Pleurotus ostreatus var. columbinus*)**
- **Colonization Speed**: 8-12 days (fast!)
- **Fruiting Temperature**: 45-65°F (7-18°C)
- **Characteristics**: Beautiful blue-gray color when young, turns gray when cooked
- **Best For**: Cool weather, faster results

**3. Pink Oyster (*Pleurotus djamor*)**
- **Colonization Speed**: 7-10 days (very fast)
- **Fruiting Temperature**: 65-85°F (18-29°C)
- **Characteristics**: Vibrant pink color, tropical species, slightly sweet
- **Best For**: Summer growing, warm climates
- **Note**: More sensitive to contamination than other oysters

**4. Yellow Oyster (*Pleurotus citrinopileatus*)**
- **Colonization Speed**: 10-14 days
- **Fruiting Temperature**: 65-80°F (18-27°C)
- **Characteristics**: Bright yellow, nutty flavor, delicate texture
- **Best For**: Warm weather, experienced growers

**Recommendation for Beginners**: Start with Pearl or Blue Oyster. They are the most forgiving and reliable.

*Source: North Spore, Field & Forest Products*

## Sourcing Quality Spawn

### What is Mushroom Spawn?

Mushroom spawn is mycelium (the vegetative part of fungus) grown on a carrier substrate. Think of it as "mushroom seeds" (though technically, mushrooms reproduce via spores).

**Common Spawn Types:**

1. **Grain Spawn** (rye, millet, sorghum)
   - **Best for**: Coffee ground cultivation
   - **Colonization**: Fastest
   - **Shelf Life**: 2-3 months refrigerated

2. **Sawdust Spawn**
   - **Best for**: Log cultivation
   - **Colonization**: Slower on coffee grounds
   - **Shelf Life**: 3-6 months refrigerated

3. **Plug Spawn**
   - **Best for**: Log inoculation only
   - **Not recommended**: For coffee grounds

**Use grain spawn for coffee grounds.**

### Reputable Spawn Suppliers (USA)

**1. North Spore** (https://northspore.com/)
- Based in Maine
- Organic certified
- Excellent quality control
- Wide variety selection

**2. Field & Forest Products** (https://fieldforest.net/)
- Based in Wisconsin
- Specializes in gourmet and medicinal mushrooms
- Bulk spawn available

**3. Fungi Ally** (https://fungially.com/)
- Based in Massachusetts
- Focuses on medicinal mushrooms
- Educational resources

**What to Look For:**
- Uniform white mycelium throughout
- Sweet, mushroomy smell (not sour or ammonia-like)
- No green, black, or pink contamination
- Recent production date
- Shipped with ice packs

### Spawn-to-Substrate Ratio

**Standard Ratio**: 1:5 (spawn to substrate by weight)

**Example**:
- 2.5 kg (5.5 lbs) coffee grounds
- 500g (1.1 lbs) grain spawn

**Aggressive Ratio**: 1:3 (faster colonization, more contamination-resistant)

**Economy Ratio**: 1:10 (slower, higher contamination risk, not recommended for beginners)

**Why Higher Spawn Ratios Work Better on Coffee:**
- Faster colonization (less time for contamination)
- Better mycelium network
- Higher success rate for beginners
- Only slightly more expensive (spawn is relatively cheap)

## Step-by-Step Cultivation Process

### Step 1: Collect Fresh Coffee Grounds

**Timing is CRITICAL**: Use coffee grounds within 24 hours of brewing.

**Why?**
After 24 hours, mold spores begin germinating rapidly. By 48 hours, grounds are often visibly moldy.

**Best Sources:**

1. **Local Coffee Shops**
   - Call ahead and ask
   - Many save grounds for gardeners
   - Build relationship for regular supply
   - Bring clean containers

2. **Your Own Coffee Maker**
   - **Espresso grounds work BEST** (finer particle size, better water retention)
   - Drip coffee works well
   - French press works but drains faster

3. **Office Break Room**
   - Often discarded daily
   - Free regular source

**Quantity Needed (First Attempt):**
- 2-3 pounds (1-1.5 kg) for small container test batch
- Produces approximately 200-400g (0.5-1 lb) fresh mushrooms across 2-3 flushes

**What About Flavored Coffee?**
- **Avoid**: Flavored, sweetened, or specialty drink grounds
- **Use only**: Plain, unflavored coffee grounds

**Storage if Not Using Immediately:**
- **Refrigerate**: Up to 48 hours maximum
- **Freeze**: Up to 2 months (thaw before using)

### Step 2: Prepare Workspace

Cleanliness dramatically impacts success rate.

**Workspace Preparation:**
1. Clear and wipe down all surfaces with 70% isopropyl alcohol or 10% bleach solution
2. Close windows and turn off fans (reduce airborne contamination)
3. Wash hands thoroughly with soap
4. Optionally wear clean gloves

**Tools to Sanitize:**
- Mixing bowl
- Spoon or hands (for mixing)
- Container or grow bag
- Scissors (for cutting bags)

**Cleanliness Mindset:**
You cannot sterilize your home kitchen, but you CAN reduce contamination enough for oyster mushrooms to outcompete mold.

### Step 3: Mix Spawn and Coffee Grounds

**Process:**

1. **Transfer Grounds**: Pour fresh coffee grounds into sanitized mixing bowl

2. **Check Moisture**: Squeeze handful of grounds
   - **Ideal**: 1-2 drops of liquid released
   - **Too dry**: Mist lightly with water
   - **Too wet**: Add small amount of dry coco coir or sawdust (optional)

3. **Break Up Spawn**: Crumble grain spawn with hands to separate individual grains

4. **Combine**: Sprinkle spawn evenly over coffee grounds

5. **Mix Thoroughly**: Use clean hands to mix spawn and grounds completely (30-60 seconds)

6. **Pack Container**: Transfer mixture to growing container
   - Pack lightly (don\'t compress tightly)
   - Leave 3-4 inches headspace
   - Smooth top surface

### Step 4: Create Gas Exchange

Mycelium needs oxygen to colonize substrate and produces CO2 as waste. Too much CO2 stunts growth.

**For Plastic Containers:**
1. Drill or poke 10-15 small holes (¼ inch / 6mm) around container
2. Cover holes with micropore tape (allows gas exchange, blocks contamination)
3. Place lid loosely on top

**For Grow Bags:**
1. Use bags with built-in filter patch, OR
2. Cut 4-6 small X-shaped slits
3. Cover slits with micropore tape

**Common Mistake**: Too few holes = slow colonization, buildup of CO2

### Step 5: Colonization Phase (Days 1-14)

**Environmental Conditions:**
- **Temperature**: 70-75°F (21-24°C) optimal
- **Light**: None needed (dark is fine)
- **Humidity**: Not critical during colonization
- **Location**: Undisturbed shelf, cupboard, or closet

**What to Expect:**

**Days 1-3**: Little visible change

**Days 4-7**: White mycelium begins spreading from spawn grains

**Days 8-10**: 50-75% of substrate covered with white fuzz

**Days 10-14**: Full colonization (entire substrate white)

**Is This Normal?**
- **Mushroom smell**: Normal (sweet, earthy)
- **Slight warmth**: Normal (mycelium generates heat)
- **Small water droplets**: Normal (metabolic water)
- **Yellow liquid**: Normal (metabolic byproduct)

**WARNING SIGNS:**
- **Green mold**: Trichoderma contamination (discard)
- **Black mold**: Aspergillus contamination (discard)
- **Pink mold**: Neurospora or Fusarium (discard)
- **Sour or ammonia smell**: Bacterial contamination (discard)

**Contamination Management:**
If small spot of green mold appears early:
- Some growers carefully remove contaminated section
- Spray with hydrogen peroxide (3%)
- Increase spawn ratio for future batches
- Usually better to discard and start fresh

### Step 6: Initiate Fruiting (Days 14-21)

When substrate is fully colonized (completely white), trigger fruiting by changing environmental conditions.

**Environmental Changes:**

1. **Temperature**: Drop to 60-70°F (15-21°C)
   - Move to cooler location
   - Basement often ideal

2. **Light**: Provide 12 hours indirect light daily
   - Place near window (not direct sun)
   - OR use ambient room lighting
   - Mycelium is phototropic (grows toward light)

3. **Fresh Air**: Increase oxygen
   - Remove lid or open container more
   - Increase number of air holes
   - Fan gently 2-3 times daily

4. **Humidity**: Maintain 80-95%
   - Mist inside container 2-3 times daily
   - Don\'t mist directly on forming pins
   - Maintain humid environment around container

**Fruiting Chamber Options:**

**Simple (Beginner):**
- Large clear plastic tub
- Place mushroom container inside
- Mist walls of tub 2-3x daily
- Prop lid for air exchange

**Intermediate:**
- Shotgun fruiting chamber (SGFC)
- Plastic tub with hundreds of ¼" holes
- Perlite in bottom for humidity
- Detailed plans online

### Step 7: Pinning and Growth (Days 16-21)

**Pinning (Baby Mushrooms Form):**

Pins look like tiny bumps or knots appearing on substrate surface. Within 24-48 hours, they develop into recognizable baby mushrooms.

**Pinning Triggers:**
- Fresh air (oxygen increase)
- Light exposure
- Temperature drop
- Moisture (evaporation from substrate surface)

**Growth Rate:**
Once pinning occurs, oyster mushrooms grow FAST.

- **Days 1-2**: Tiny pins barely visible
- **Days 3-4**: Small mushroom shapes, rapid size increase
- **Days 5-6**: Full-size mushrooms forming
- **Day 7**: Ready to harvest

Oyster mushrooms can literally double in size every 24 hours during peak growth.

**Optimal Conditions During Fruiting:**
- Maintain high humidity (80-95%)
- Continue misting 2-3 times daily
- Ensure good air flow (prevents long stems, small caps)
- 12 hours indirect light

### Step 8: Harvesting

**When to Harvest:**

**Perfect Timing**: Just before or as caps begin to flatten

**Too Early**: Caps curled under, very small
**Too Late**: Caps flattened completely and edges begin curling upward, spore release begins

**Optimal Size**:
- Caps: 2-4 inches diameter
- Clusters: Softball-sized

**Harvesting Method:**

**Option 1: Twist and Pull**
1. Grasp entire cluster at base
2. Twist gently while pulling
3. Remove entire cluster at once

**Option 2: Cut with Knife**
1. Use clean knife
2. Cut cluster at base
3. Leave small amount of stem attached to substrate

**Important**: Harvest entire cluster at once. Don\'t pick individual mushrooms from cluster.

### Post-Harvest: Subsequent Flushes

Coffee grounds typically produce 2-3 flushes (harvests) before nutrients are depleted.

**Between Flushes:**

1. **Rest Period**: 5-7 days
2. **Soak Substrate** (optional but increases yield):
   - Submerge entire block in cold water
   - Weight down to keep submerged
   - Soak 8-12 hours
   - Drain completely
3. **Resume Misting**: Return to fruiting conditions

**Flush Schedule:**
- **First Flush**: Largest mushrooms, highest yield (70-80% of total)
- **Second Flush**: 50-70% of first flush size (7-10 days after first)
- **Third Flush**: Smaller mushrooms, diminishing returns (7-10 days after second)

**When to Stop:**
After third flush, yields drop dramatically. Compost spent substrate.

## Maximizing Success: Advanced Tips

### Enhancing Coffee Ground Substrate

Pure coffee grounds work, but adding amendments can improve structure and yield.

**Optional Additions (Mix Before Spawn):**

1. **Shredded Cardboard (20%)**
   - Improves structure
   - Increases air pockets
   - Soak cardboard in water, squeeze out excess

2. **Straw (20%)**
   - Chopped into 1-2 inch pieces
   - Pasteurize by soaking in 160-180°F water for 1 hour
   - Adds cellulose

3. **Coco Coir (10-15%)**
   - Improves water retention
   - Adds structure
   - Rehydrate from dry brick

4. **Gypsum (1% by weight)**
   - Calcium sulfate
   - Improves substrate structure
   - Provides calcium

**Advanced Recipe:**
- 70% coffee grounds
- 20% shredded cardboard
- 10% coco coir
- 1% gypsum

### Troubleshooting Common Problems

**Problem: No Pinning After 3+ Weeks**

**Causes**:
- Insufficient light
- Not enough fresh air
- Temperature too warm
- Substrate too dry

**Solutions**:
- Move to brighter location (indirect light)
- Increase air exchange
- Lower temperature to 60-65°F
- Increase misting frequency

---

**Problem: Long Skinny Stems, Small Caps**

**Cause**: Insufficient fresh air (too much CO2)

**Solution**: Dramatically increase air exchange (more holes, more fanning)

---

**Problem: Mushrooms Abort (Start Growing Then Stop)**

**Causes**:
- Humidity dropped too low
- Temperature fluctuation
- Substrate dried out

**Solutions**:
- Increase misting frequency
- Create better humidity chamber
- Stabilize temperature

---

**Problem: Green Mold (Trichoderma)**

**Most Common Contamination**

**Causes**:
- Coffee grounds too old (>24 hours)
- Insufficient spawn ratio
- Contaminated spawn
- Poor hygiene during inoculation

**Solutions**:
- Use fresher grounds
- Increase spawn to 1:3 ratio
- Purchase spawn from reputable supplier
- Improve workspace cleanliness

**Can it be Saved?**
Usually no. Trichoderma spreads rapidly and produces billions of spores. Discard to prevent spreading contamination.

## Using Your Harvest

### Storage

**Fresh (Refrigerated):**
- 5-7 days in paper bag
- NOT plastic (causes condensation and sliminess)

**Cooked (Refrigerated):**
- 3-5 days in sealed container

**Frozen:**
- Sauté first, then freeze (maintains texture)
- Lasts 6-12 months

**Dehydrated:**
- Use food dehydrator at 110-125°F
- Store in airtight container
- Rehydrate in hot water before cooking
- Lasts 1-2 years

### Cooking Tips

**Preparation:**
- Trim stem base (often woody)
- Wipe caps with damp cloth (don\'t wash under water - mushrooms absorb water)
- Tear into smaller pieces or slice

**Best Cooking Methods:**
- **Sauté**: High heat, don\'t crowd pan, cook until golden
- **Roast**: 400°F, 20-25 minutes until crispy edges
- **Grill**: Whole clusters, brushed with oil
- **Soup**: Add in last 10 minutes of cooking

**Flavor Notes:**
- Mild when raw
- Develops umami, slightly nutty flavor when cooked
- Absorbs flavors of sauces and seasonings well
- Slight seafood note (hence "oyster" name)

**Never Eat Raw**: Always cook oyster mushrooms. Raw consumption can cause digestive upset in some people.

## Disposing of Spent Substrate

After 2-3 flushes, coffee grounds are depleted and should be removed.

**Excellent Uses:**

1. **Compost Pile**: Rich in nitrogen, excellent compost activator

2. **Garden Mulch**: Spread around plants (avoid direct contact with stems)

3. **Worm Bin**: Worms love spent mushroom substrate

4. **Outdoor Bed Inoculation**:
   - Dump spent substrate in shady garden area
   - May fruit outdoors if conditions right (cool, humid weather)
   - Free bonus mushrooms possible

**Do Not Reuse**: Don\'t attempt to re-inoculate spent coffee grounds. Nutrients are depleted.

## Environmental Impact and Scaling Up

### Home Scale (Learning Phase)

**Weekly Coffee Production:**
- 1-2 kg coffee grounds
- Produces 200-500g fresh mushrooms
- Supplies household needs

### Medium Scale (Share with Community)

**Partner with Local Café:**
- Collect grounds 2-3 times weekly
- Process 5-10 kg per week
- Produces 1-3 kg fresh mushrooms weekly
- Share/sell to friends and neighbors

### Commercial Potential

**Considerations:**
- Consistent supply chain needed
- Food safety licensing required
- Commercial kitchen may be necessary
- Competition with large commercial growers

**Unique Market Position:**
- Local, ultra-fresh product
- Waste diversion story
- Community connection
- Potential for value-added products (dried, powdered)

## Resources & Further Learning

**Cultivation Guides:**

1. GroCycle: "Growing Mushrooms In Coffee Grounds"
   https://grocycle.com/growing-mushrooms-in-coffee-grounds/

2. Mother Earth News: "Cultivating Oyster Mushrooms on Spent Coffee Grounds"
   https://www.motherearthnews.com/organic-gardening/cultivating-oyster-mushrooms-on-spent-coffee-grounds-ze0z1905zwoo/

**Spawn Suppliers:**

3. North Spore
   https://northspore.com/

4. Field & Forest Products
   https://fieldforest.net/

5. Fungi Ally
   https://fungially.com/

**Species Information:**

6. Wikipedia: "Pleurotus ostreatus"
   https://en.wikipedia.org/wiki/Pleurotus_ostreatus

**Recommended Books:**
- "Organic Mushroom Farming and Mycoremediation" by Tradd Cotter
- "The Mushroom Cultivator" by Paul Stamets and J.S. Chilton
- "Growing Gourmet and Medicinal Mushrooms" by Paul Stamets
- "Radical Mycology" by Peter McCoy

**Online Communities:**
- r/MushroomGrowers (Reddit)
- Shroomery.org (forums)
- Local mycology societies

## Conclusion

Growing oyster mushrooms on coffee grounds represents one of the most accessible entry points into the fascinating world of mushroom cultivation. With minimal equipment, free substrate, and forgiving oyster mushrooms, beginners can produce gourmet mushrooms in just 3-4 weeks.

Beyond the satisfaction of growing your own food, this practice diverts waste from landfills, reduces methane emissions, and creates nutrient-rich compost for gardens. Each flush of mushrooms represents a small but meaningful contribution to a more circular, sustainable food system.

Start small with a single container. Experience the magic of mycelium colonization, the excitement of first pins forming, and the satisfaction of harvesting fresh mushrooms you grew from waste. Once you succeed with your first flush, you\'ll understand why mushroom cultivation becomes a lifelong passion for so many growers.',
  updated_at = NOW()
WHERE slug = 'growing-oyster-mushrooms-coffee-grounds';

-- ============================================================================
-- Verification Summary
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Wiki Content Improvements Applied Successfully';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Updated Guides:';
  RAISE NOTICE '1. Starting Your First Backyard Flock (~1,800 words)';
  RAISE NOTICE '2. Lacto-Fermentation: Ancient Preservation Made Simple (~2,100 words)';
  RAISE NOTICE '3. Growing Oyster Mushrooms on Coffee Grounds (~2,000 words)';
  RAISE NOTICE '';
  RAISE NOTICE 'All guides now include:';
  RAISE NOTICE '- Why This Matters section (permaculture/sustainability context)';
  RAISE NOTICE '- Comprehensive getting started information';
  RAISE NOTICE '- Detailed step-by-step instructions';
  RAISE NOTICE '- Troubleshooting common challenges';
  RAISE NOTICE '- Resources & Further Learning with verified URLs';
  RAISE NOTICE '- Embedded source citations throughout content';
  RAISE NOTICE '';
  RAISE NOTICE 'Content verified against university extension services,';
  RAISE NOTICE 'established organizations, and reputable suppliers.';
  RAISE NOTICE '========================================';
END $$;
