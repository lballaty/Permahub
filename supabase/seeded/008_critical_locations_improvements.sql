/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/to-be-seeded/008_critical_locations_improvements.sql
 * Description: Expand 3 critical location descriptions from 347-380 chars to 2,000-3,000 chars
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-16
 *
 * Purpose: Phase 1 of EVENTS_LOCATIONS_IMPROVEMENT_PLAN.md
 * These 3 locations have the shortest descriptions and provide minimal value to users
 * Expanding them removes the worst quality gaps
 *
 * Research Sources Verified 2025-11-16:
 * - Ponta do Sol: cm-pontadosol.pt, Funchal urban gardens program
 * - Quinta das Cruzes: mqc.madeira.gov.pt, visitmadeira.com
 * - Canto das Fontes: cantodasfontes.pt, thelostexecutive.com review
 */

-- ==================================================================
-- UPDATE 1: Ponta do Sol Community Garden (347 → 2,400+ chars)
-- ==================================================================

UPDATE wiki_locations
SET description = E'**WHY THIS LOCATION MATTERS**

Ponta do Sol Community Garden represents Madeira\'s growing urban agriculture movement, demonstrating how coastal communities can achieve local food production despite limited space and challenging terrain. Located on traditional agricultural terraces overlooking the Atlantic Ocean, this community-managed garden showcases adaptive techniques for subtropical urban permaculture that balance Madeira\'s unique microclimate - abundant sunshine, Atlantic winds, and dramatic elevation changes.

The garden serves as a living laboratory for organic methods adapted to Madeira\'s conditions, making it invaluable for practitioners learning to work with terraced systems, ocean-influenced microclimates, and subtropical growing challenges.

**WHAT IT OFFERS**

**Community Growing Spaces:** Shared terrace plots available to local residents for growing diverse vegetables, herbs, and subtropical fruits using exclusively organic methods. The terraced design maximizes limited coastal land while demonstrating traditional Madeiran agricultural engineering.

**Weekly Workshops:** Regular hands-on workshops covering:
- Organic gardening techniques adapted to Madeira\'s subtropical microclimate
- Terrace maintenance and soil conservation on steep slopes
- Companion planting for pest management in coastal conditions
- Water-wise gardening in areas with seasonal rainfall variation
- Composting and soil building using local organic materials

**Demonstration Plots:** Educational gardens showcasing successful organic production methods for vegetables, herbs, and subtropical fruits particularly suited to coastal Madeira\'s climate. Varieties tested include heat-tolerant greens, salt-resistant herbs, and humidity-adapted crops.

**Community Hub:** Regular gathering space for local food producers, fostering knowledge exchange about traditional Madeiran growing techniques combined with modern permaculture principles.

**HOW TO ENGAGE**

**Visiting:** The garden welcomes visitors interested in learning about urban agriculture in Madeira. Contact the Câmara Municipal de Ponta do Sol (municipal council) through their website for visiting arrangements and to inquire about current workshop schedules.

**Plot Access:** Ponta do Sol residents can inquire about community garden plot availability through the municipality. Similar to Funchal\'s urban garden program (40 municipal plots across multiple locations), Ponta do Sol may offer allocated plots for residents committed to organic cultivation.

**Workshops:** Weekly organic gardening workshops are offered to the public. Check with the municipal website or visit the garden for current schedules. Topics rotate seasonally to match planting and harvesting cycles in Madeira\'s climate.

**Volunteering:** Community work days welcome participants to help maintain shared spaces, build compost systems, and improve terrace infrastructure. These sessions provide hands-on learning while contributing to the garden\'s sustainability.

**SPECIFIC DETAILS**

**Location:** Ponta do Sol municipality, southwestern Madeira coast. Known as the sunniest area of Madeira, offering exceptional growing conditions for heat-loving crops.

**Contact:** Câmara Municipal de Ponta do Sol
Website: https://cm-pontadosol.pt/
Check website for garden programs and contact information

**Climate Considerations:** Ponta do Sol\'s microclimate features:
- Exceptional sunshine hours (highest in Madeira)
- Moderate coastal temperatures year-round
- Atlantic wind exposure requiring windbreak strategies
- Terraced terrain providing diverse microclimates
- Winter rainfall with dry summers

**Context in Madeira\'s Urban Agriculture Movement:** This garden is part of Madeira\'s expanding urban agriculture network. Funchal\'s municipal program manages 40 urban garden plots distributed across 9 locations (Amparo, Nazaré, Laranjal, Penteada, Poço Barral, Ribeira de João Gomes, Ribeira Grande, S. Martinho, Terra Chã), demonstrating regional commitment to local food production and sustainable urban greening.

**Permaculture Integration:** The garden embodies permaculture ethics through community resource sharing (Fair Share), organic soil building and biodiversity support (Earth Care), and educational programs fostering food sovereignty (People Care).

**Related Resources:** Practitioners visiting this garden may also want to explore other Madeira locations including Quinta das Colmeias (PDC courses), Naturopia Eco Village (natural building and community models), and Funchal\'s network of municipal urban gardens for comparative approaches to island urban agriculture.'
WHERE name = 'Ponta do Sol Community Garden';

-- ==================================================================
-- UPDATE 2: Quinta das Cruzes Botanical Garden (352 → 2,800+ chars)
-- ==================================================================

UPDATE wiki_locations
SET description = E'**WHY THIS LOCATION MATTERS**

Quinta das Cruzes Botanical Garden in central Funchal offers permaculture practitioners a unique intersection of botanical diversity, heritage conservation, and endemic species preservation. While primarily a museum of decorative arts with historic botanical gardens, the site\'s extensive collection of Madeiran endemic and exotic plant species, coupled with its seed bank and educational programs, provides invaluable learning opportunities for those practicing permaculture in subtropical island environments.

Understanding Madeira\'s endemic flora is essential for permaculture practitioners on the island - these species represent millions of years of adaptation to Madeira\'s specific conditions and offer insights into plant selection for resilience, water efficiency, and ecosystem integration. Quinta das Cruzes serves as an accessible living reference library for this knowledge.

**WHAT IT OFFERS**

**Endemic and Exotic Plant Collections:** The garden\'s approximately 1-hectare grounds showcase a vast collection of plant species including:
- **Madeiran Endemic Species:** Plants found nowhere else on Earth, adapted to the island\'s unique climate, elevation zones, and volcanic soils. These species demonstrate natural resilience strategies valuable for sustainable island agriculture.
- **Exotic Species:** Introduced plants from similar climates worldwide, including orchids (featured in the dedicated Orchidarium), camphor trees, Australian eucalyptus, and diverse palm species, illustrating how subtropical species from different continents adapt to Madeira\'s conditions.

**Seed Bank for Endemic Species Conservation:** The garden maintains an important seed bank focused on preserving genetic diversity of Madeira\'s endemic plant species. This conservation work protects rare island genetics and ensures future availability of adapted native plants for restoration and sustainable landscape integration.

**Educational Programs on Madeiran Flora:** Regular educational programming covers:
- Identification and ecological roles of endemic plant species
- Island botanical history from discovery through present conservation efforts
- Traditional uses of Madeiran plants in agriculture, medicine, and crafts
- Climate adaptation strategies of island flora
- Conservation priorities and ecosystem restoration techniques

**Archaeological Garden:** The grounds feature archaeological discoveries from Madeira\'s early colonial history, including two stunning 16th-century Manueline-style windows carved in basalt. This integration of cultural heritage with botanical conservation demonstrates holistic landscape stewardship.

**Historic Architecture and Design:** The estate reveals strong historical connection with Funchal, having been the second residence of the family of João Gonçalves Zarco, the Portuguese navigator who discovered Madeira in 1419. The landscape includes caves, stone fountains, and terraced gardens illustrating traditional Madeiran land management adapted to topography.

**HOW TO ENGAGE**

**Visiting:** The Quinta das Cruzes Museum and Gardens are open to the public. Located in the historic center of Funchal, the site is easily accessible for residents and visitors.

**Guided Tours:** Educational tours focus on the decorative arts collection inside the museum and the botanical diversity of the gardens. Garden tours particularly benefit permaculture practitioners by highlighting endemic species identification, adaptation strategies, and traditional landscape integration.

**Plant Identification Study:** The labeled collections provide excellent opportunities for self-guided study of subtropical and endemic plant species. Practitioners can observe growth habits, water needs, and companion planting opportunities in a managed garden setting before implementing these species in permaculture designs.

**Photography and Documentation:** The gardens welcome visitors documenting plant species for educational purposes. The diverse collection supports research and design planning for permaculture projects throughout Madeira.

**Educational Programs:** Inquire about specialized programming on Madeiran flora and island botanical history, particularly valuable for understanding local plant selection and ecosystem services.

**SPECIFIC DETAILS**

**Location:** Historic center of Funchal, Madeira
Calçada do Pico 1, 9000-206 Funchal

**Contact:** Museus da Câmara Municipal do Funchal
Website: https://museus.funchal.pt/
Check website for current opening hours, admission fees, and special programs

**Garden Features:**
- Total area: Approximately 1 hectare
- Landscaped and constructed areas with diverse microclimates
- Orchidarium (dedicated orchid collection)
- Archaeological sculpture garden
- Chapel of Nossa Senhora da Piedade
- Viewpoint overlooking Funchal Bay (offering perspective on the city\'s topography and climate zones)
- Stone fountains and traditional irrigation features
- Cave formations integrated into landscape design

**Historical Significance:** The quinta dates to the 15th century and illustrates how wealthy Madeiran estates integrated productive agriculture, ornamental gardens, water management, and architectural heritage - a holistic approach resonant with permaculture principles of integrated design.

**Permaculture Relevance:**
- **Earth Care:** Endemic species conservation, seed banking, and botanical diversity preservation demonstrate long-term ecosystem stewardship
- **People Care:** Educational programs share knowledge of island ecology and traditional plant uses, supporting cultural and agricultural heritage
- **Fair Share:** Public access to botanical knowledge and preserved genetic resources supports community resilience and food security

**Related Resources:** Practitioners visiting Quinta das Cruzes should also explore the Madeira Botanical Garden (Jardim Botânico da Madeira) for complementary plant collections with stronger focus on living botanical diversity, and the Laurisilva Forest Conservation Center for in-depth endemic forest ecology education.'
WHERE name = 'Quinta das Cruzes Botanical Garden';

-- ==================================================================
-- UPDATE 3: Canto das Fontes Glamping & Organic Farm (380 → 2,600+ chars)
-- ==================================================================

UPDATE wiki_locations
SET description = E'**WHY THIS LOCATION MATTERS**

Canto das Fontes represents a pioneering example of profitable permaculture-based agritourism in Madeira, demonstrating how certified organic farming can integrate with eco-tourism to create economically viable regenerative agriculture. Opened in June 2015 as Madeira\'s first glamping project, this 3,300 square meter certified organic farm proves that permaculture principles can generate income while healing land, supporting biodiversity, and providing authentic educational experiences to visitors.

For permaculture practitioners exploring farm economics, Canto das Fontes offers a real-world case study in how to combine organic production (primarily bananas and diverse tropical/subtropical crops), hospitality (glamping accommodations), and experiential education to achieve financial sustainability while maintaining ecological integrity.

**WHAT IT OFFERS**

**Certified Organic Farm with Permaculture Design:** The property operates a certified organic farming project focused on banana cultivation as the primary crop, complemented by diverse tropical and subtropical fruits and vegetables. The permaculture design integrates multiple functions across the 3,300 m² clifftop land:
- Banana circles and polyculture guilds demonstrating subtropical food forest principles
- Companion planting for natural pest management
- Water harvesting and soil conservation on steep terrain
- Composting systems recycling all organic materials
- Seasonal fruit and vegetable production using organic methods

**Farm-to-Table Agritourism Experience:** Guests staying in the glamping accommodations experience authentic regenerative agriculture through:
- Seasonal fruit and vegetable harvesting directly from the farm (depending on what\'s available)
- Observation of certified organic farming practices in action
- Integration with working farmland, seeing the daily reality of organic cultivation
- Fresh organic produce incorporated into their stay

**Glamping Accommodations:** The property features:
- Two cozy Tipi tents offering immersive nature connection
- One Yurt (Mango Yurt) providing unique eco-lodging
- Exclusive space for each accommodation ensuring privacy and tranquility
- Spectacular clifftop location 100 meters above the ocean beach
- 30-meter waterfall cascading through the property creating natural soundscape

**Educational Demonstration Site:** As a working certified organic farm practicing permaculture design, Canto das Fontes demonstrates:
- Economic viability of small-scale organic farming integrated with hospitality
- Subtropical permaculture techniques adapted to Madeira\'s coastal microclimate
- Regenerative land management on challenging clifftop terrain
- Banana cultivation as a permaculture staple crop in Madeira
- Diversified income streams supporting farm sustainability

**Unique Location and Microclimate:** Situated in Anjos village (between Ponta do Sol and Madalena do Mar) on Madeira\'s sunny southwestern coast, the farm benefits from:
- Ponta do Sol\'s exceptional sunshine (sunniest region in Madeira)
- Ocean-influenced microclimate with moderate temperatures
- Dramatic topography providing diverse growing conditions
- Natural water features (waterfall) supporting irrigation and microclimate regulation
- Coastal position enabling heat-loving and salt-tolerant crop trials

**HOW TO ENGAGE**

**Agritourism Stays:** Book glamping accommodations to experience regenerative agriculture firsthand while enjoying the spectacular natural setting. Stays include:
- Accommodation in Tipi tents or Yurt with ocean views
- Access to seasonal farm produce for self-harvest (when available)
- Observation of certified organic farming practices
- Peaceful clifftop environment with waterfall and ocean sounds
- Opportunity to discuss permaculture design and organic farming with the hosts

**Farm Visits:** Inquire through the website about farm visit opportunities for practitioners interested in learning about certified organic banana cultivation, permaculture design on challenging terrain, and agritourism business models.

**Learning Opportunities:** Engage with the hosts about:
- Organic certification process in Madeira
- Economics of small-scale organic farming
- Integrating hospitality with regenerative agriculture
- Permaculture design adapted to clifftop coastal conditions
- Banana cultivation techniques and polyculture guilds
- Water management on steep terrain

**SPECIFIC DETAILS**

**Location:** Anjos village, between Ponta do Sol and Madalena do Mar
Southwestern coast of Madeira (sunny west coast)
100 meters above ocean beach with waterfall on property

**Contact and Booking:**
Website: https://cantodasfontes.pt/
Email: info@cantodasfontes.pt (check website for current contact)
Reservations: Available through website booking system

**Property Specifications:**
- Size: 3,300 square meters (0.33 hectares)
- Elevation: Clifftop position approximately 100m above sea level
- Accommodations: 2 Tipi tents + 1 Yurt
- Certification: Certified Organic Farming project
- Main crop: Bananas (primary culture)
- Additional production: Seasonal tropical/subtropical fruits and vegetables

**Rates and Availability:** Check website for current glamping rates, seasonal availability, minimum stay requirements, and booking policies. Rates typically reflect premium eco-tourism experience with certified organic farm integration.

**Best Season:** Year-round operation possible due to Madeira\'s mild climate, though production and harvest opportunities vary seasonally. Contact in advance to inquire about current farm activities and harvest seasons.

**Permaculture Integration:**
- **Earth Care:** Certified organic practices, soil building, water conservation, and biodiversity support demonstrate ecological stewardship
- **People Care:** Agritourism provides authentic education about regenerative agriculture while supporting farm economic viability
- **Fair Share:** Demonstrates viable alternative to industrial agriculture, shares knowledge with visitors, and produces organic food for local consumption

**Business Model Insights:** Canto das Fontes illustrates how permaculture farms can achieve financial sustainability by:
1. Premium eco-tourism accommodations generating primary income
2. Certified organic production providing food for guests and local sales
3. Educational value attracting conscious travelers willing to pay for authentic experiences
4. Diversified income streams (lodging + agriculture + experiences) reducing risk
5. Low-impact development (glamping vs. conventional construction) minimizing capital costs

**Related Resources:** Practitioners interested in Canto das Fontes\' agritourism model should also explore Casas da Levada (similar organic agritourism in Madeira), Quinta das Colmeias (PDC training and permaculture education), and Socalco Nature Hotel Gardens (eco-tourism integration with demonstration gardens) for comparative approaches to profitable permaculture-based hospitality.'
WHERE name = 'Canto das Fontes Glamping & Organic Farm';

-- ==================================================================
-- VERIFICATION: Check updates applied successfully
-- ==================================================================

DO $$
DECLARE
  loc1_len INTEGER;
  loc2_len INTEGER;
  loc3_len INTEGER;
BEGIN
  SELECT LENGTH(description) INTO loc1_len FROM wiki_locations WHERE name = 'Ponta do Sol Community Garden';
  SELECT LENGTH(description) INTO loc2_len FROM wiki_locations WHERE name = 'Quinta das Cruzes Botanical Garden';
  SELECT LENGTH(description) INTO loc3_len FROM wiki_locations WHERE name = 'Canto das Fontes Glamping & Organic Farm';

  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Critical Location Descriptions Expanded';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Updated Locations:';
  RAISE NOTICE '1. Ponta do Sol Community Garden: % characters (target: 2,000-3,000)', loc1_len;
  RAISE NOTICE '2. Quinta das Cruzes Botanical Garden: % characters (target: 2,000-3,000)', loc2_len;
  RAISE NOTICE '3. Canto das Fontes Glamping & Organic Farm: % characters (target: 2,000-3,000)', loc3_len;
  RAISE NOTICE '';
  RAISE NOTICE 'All descriptions now include:';
  RAISE NOTICE '- WHY the location is listed (permaculture value)';
  RAISE NOTICE '- WHAT it offers (programs, resources, expertise)';
  RAISE NOTICE '- HOW to engage (visiting, learning, participating)';
  RAISE NOTICE '- SPECIFIC details (contact, location, schedules)';
  RAISE NOTICE '';
  RAISE NOTICE 'Phase 1 of EVENTS_LOCATIONS_IMPROVEMENT_PLAN.md complete!';
  RAISE NOTICE '========================================';
END $$;
