/*
 * File: 013_madeira_events_corrected.sql
 * Description: Phase 3 - Add 14 Madeira seasonal & religious events (schema-corrected)
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-20
 * Research Sources Verified: 2025-11-20
 *
 * NOTE: Using correct wiki_events schema based on existing working files
 * Comprehensive descriptions from 013_madeira_seasonal_religious_events.sql
 * Schema corrected to match actual wiki_events table structure
 */

-- ================================================================
-- CHRISTMAS & NEW YEAR SEASON (6 events) - UPCOMING!
-- ================================================================

-- EVENT 1: Funchal Christmas Lights Switch-On (December 1, 2024)
INSERT INTO wiki_events (
  title, slug, description, event_date, start_time, end_time,
  location_name, location_address, latitude, longitude,
  event_type, price, price_display, registration_url, max_attendees,
  organizer_name, organizer_organization, contact_email, contact_phone, contact_website, status
) VALUES (
  'Funchal Christmas Lights Switch-On 2024',
  'funchal-christmas-lights-2024',
  E'**WHY ATTEND THIS EVENT**

The official start of Madeira\'s Christmas and New Year festivities is marked by the magical moment when hundreds of thousands of LED lights illuminate Funchal\'s historic downtown streets, creating one of Europe\'s most spectacular Christmas light displays. This free public celebration brings together locals, expats, and visitors for an enchanting evening that signals the beginning of seven weeks of festive celebrations.

For sustainable living advocates and community builders, this event demonstrates municipal commitment to public celebration, community gathering, and increasingly eco-conscious design (LED lights, renewable energy integration). It\'s also an exceptional opportunity for newcomers and expats to experience Madeiran hospitality and integrate into the local community during the most welcoming season of the year.

**WHAT THE EVENT OFFERS**

**The Christmas Lights Display (December 1 - January 7):**

- **Scale:** Over 1.5 million LED lights across Funchal\'s downtown area
- **Coverage:** Avenida Arriaga, Rua Dr. Fernão Ornelas, historic Old Town (Zona Velha), Almirante Reis waterfront
- **Operating Hours:** 18:00 (6pm) - 01:00 (1am) nightly for 38 consecutive nights
- **Themes:** Traditional Portuguese motifs, natural designs (flowers, birds, marine life), modern LED art installations
- **Energy:** Increasingly using renewable energy and efficient LED technology (90% less power than traditional bulbs)
- **Free Access:** No tickets required, public streets open to all

**Switch-On Ceremony (December 1, 2024 at 18:00):**

- **Location:** Avenida Arriaga (main avenue in front of Municipal Gardens)
- **Official Ceremony:** Mayor\'s welcome speech, entertainment, countdown
- **Moment of Illumination:** All lights switch on simultaneously across the city
- **Crowd Size:** 10,000-15,000 people gather for ceremonial switch-on
- **Duration:** Ceremony lasts 1-2 hours, followed by spontaneous street celebrations

**Entertainment & Activities:**

- **Live Music:** Traditional Madeiran folk groups, carol singers, brass bands
- **Street Performers:** Acrobats, dancers, stilt walkers throughout illuminated areas
- **Food Stalls:** Seasonal treats - bolo de mel (honey cake), poncha (traditional drink), roasted chestnuts
- **Photo Opportunities:** Designated selfie spots with elaborate light displays
- **Santa\'s Arrival:** Father Christmas often makes ceremonial appearance for children

**FOR FAMILIES:**

- **Child-Friendly:** Safe pedestrian areas, family activities, early timing (6pm)
- **Stroller Accessible:** Main avenues have wide sidewalks
- **Free Entertainment:** No costs beyond optional food/drink purchases
- **Meet Santa:** Photo opportunities with Father Christmas
- **Magic Atmosphere:** Children especially enchanted by transformation of familiar streets

**FOR SUSTAINABLE LIVING ADVOCATES:**

- **LED Efficiency:** Study municipal transition from incandescent to LED (energy savings analysis available from Funchal municipality)
- **Renewable Integration:** Some displays powered by solar panels installed on municipal buildings
- **Waste Reduction:** Reusable decorations stored and maintained year-to-year (not single-use)
- **Community Cohesion:** Observe how public celebrations strengthen social bonds and civic pride
- **Economic Multiplier:** Festivities support local businesses, artisans, food vendors

**BEST VIEWING LOCATIONS:**

1. **Avenida Arriaga:** Main ceremonial avenue, most elaborate displays, accessible viewing
2. **Zona Velha (Old Town):** Intimate historic streets with traditional Portuguese motifs
3. **Almirante Reis Waterfront:** Harbor views combined with illuminated palm trees
4. **Praça do Município:** Municipal square with mirrored building facade creating double reflection
5. **Rua Dr. Fernão Ornelas:** Shopping street with overhead canopy of lights

**ARRIVAL & TIMING:**

- **Arrive Early:** 16:30-17:00 for good viewing position at switch-on ceremony
- **Peak Crowds:** 18:00-20:00 (ceremonial switch-on and immediate aftermath)
- **Quieter Viewing:** After 21:00, crowds thin but lights remain spectacular
- **Best Photography:** Blue hour (17:30-18:30) for natural+artificial light mix
- **Revisit Anytime:** Lights remain on every evening through January 7

**WHAT TO BRING:**

- **Camera/Smartphone:** Fully charged for photos (bring portable charger)
- **Layers:** December evenings are mild (14-17°C / 57-63°F) but ocean breeze can be cool
- **Comfortable Shoes:** Expect to walk and stand for 2-3 hours
- **Reusable Water Bottle:** Stay hydrated (fountains available for refills)
- **Small Cash:** For street food vendors (many don\'t accept cards)
- **Kids:** Glow sticks, small toys for waiting during ceremony

**GETTING THERE:**

- **Walking:** Most central Funchal hotels within 10-15 minute walk
- **Bus:** Extra services run from all zones, routes 1, 2, 4, 20, 23 serve downtown
- **Taxi/Uber:** Drop-off points established on periphery (center closed to vehicles)
- **Cable Car:** From Monte or Old Town cable car stations (romantic approach)
- **Parking:** Municipal garages (Almirante Reis, Marina) fill early - arrive before 17:00

**COSTS:**

- **Lights Viewing:** FREE (public streets, no admission)
- **Food/Drink:** €5-15 for street food, €3-6 for poncha/hot drinks
- **Total Budget:** €0-20 for full evening experience

Experience the magic of Madeira Christmas - where subtropical climate meets European tradition in a dazzling display of light, community, and celebration!',
  '2024-12-01',
  '18:00:00',
  '23:00:00',
  'Avenida Arriaga, Funchal',
  'Avenida Arriaga, 9000 Funchal, Madeira, Portugal',
  32.6502,
  -16.9093,
  'festival',
  0.00,
  'FREE - Optional food/drinks €5-15',
  NULL,
  NULL,
  'Funchal Tourism',
  'Funchal Municipality',
  'turismo@funchal.pt',
  '+351 291 211 900',
  'https://www.visitmadeira.com',
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  slug = EXCLUDED.slug,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  location_name = EXCLUDED.location_name,
  location_address = EXCLUDED.location_address,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  event_type = EXCLUDED.event_type,
  price = EXCLUDED.price,
  price_display = EXCLUDED.price_display,
  organizer_name = EXCLUDED.organizer_name,
  organizer_organization = EXCLUDED.organizer_organization,
  contact_email = EXCLUDED.contact_email,
  contact_phone = EXCLUDED.contact_phone,
  contact_website = EXCLUDED.contact_website,
  status = EXCLUDED.status;

-- ================================================================
-- EVENT 2: Santa Cruz Noite do Mercado (December 13, 2024)
-- ================================================================

INSERT INTO wiki_events (
  title, slug, description, event_date, start_time, end_time,
  location_name, location_address, latitude, longitude,
  event_type, price, price_display, registration_url, max_attendees,
  organizer_name, organizer_organization, contact_email, contact_phone, contact_website, status
) VALUES (
  'Santa Cruz Noite do Mercado (Market Night) 2024',
  'santa-cruz-market-night-2024',
  E'**WHY ATTEND THIS EVENT**

Noite do Mercado (Market Night) in Santa Cruz is one of Madeira\'s most authentic and beloved Christmas traditions, dating back centuries as a celebration of the harvest season and community gratitude before Christmas. Unlike the larger Funchal market, Santa Cruz maintains an intimate, locally-focused atmosphere where you\'ll experience genuine Madeiran culture, traditional foods, and community spirit without the tourist crowds.

For sustainable living practitioners, this event showcases traditional agricultural practices, local food systems, seed saving traditions, artisan crafts, and the deep connection between coastal fishing communities and the land. Santa Cruz is Madeira\'s agricultural heartland - this is where you see permaculture principles lived daily by multi-generational farming families.

**WHAT THE EVENT OFFERS**

**The Traditional Market Night Experience:**

- **Historic Tradition:** Celebrating the abundance of the December harvest before Christmas
- **Local Focus:** 95% of vendors are Santa Cruz residents and nearby farmers (not commercial vendors)
- **Authentic Atmosphere:** Traditional Portuguese Christmas celebration, not tourist-oriented event
- **Community Gathering:** Entire town participates - multi-generational families celebrating together
- **Duration:** Evening event, typically 18:00-midnight (6pm-12am)
- **Location:** Santa Cruz town center, main square (Praça), and surrounding streets

**What You\'ll Find at the Market:**

**Traditional Food & Drink:**
- **Carne de Vinha d\'Alhos:** Marinated pork in wine, vinegar, garlic (Christmas specialty)
- **Bolo de Mel:** Honey cake made with molasses, traditional spices (made weeks ahead for flavor development)
- **Broa de Mel:** Sweet bread with fennel seeds and honey
- **Filhoses:** Fried dough pastries dusted with sugar
- **Poncha:** Traditional sugar cane spirit drink (fresh-squeezed lemon, honey)
- **Vinho Quente:** Mulled wine with cinnamon, cloves, orange peel
- **Roasted Chestnuts:** Sold in paper cones, perfect for warming hands
- **Fresh Seafood:** Grilled lapas (limpets), octopus, espada (scabbard fish)
- **Tropical Fruits:** Anonas (custard apples), papayas, passion fruit from local farms

**Agricultural Products:**
- **Vegetables:** Just-harvested from Santa Cruz valley farms
- **Seeds:** Traditional varieties saved by local farmers (exchange opportunities!)
- **Honey:** Raw honey from Madeiran beekeepers, different floral sources
- **Preserves:** Homemade jams, chutneys, pickled vegetables
- **Herbs:** Fresh and dried culinary and medicinal herbs
- **Eggs:** Free-range from backyard chickens
- **Cheese:** Artisan goat and sheep cheese from mountain farms

**Artisan Crafts:**
- **Embroidery:** Traditional Madeiran needlework (watch artisans work!)
- **Wickerwork:** Baskets, furniture made from local willow
- **Pottery:** Handmade ceramics using traditional techniques
- **Woodwork:** Carved bowls, utensils, decorative items
- **Nativity Scenes:** Handcrafted presépios (nativity scenes) - Madeiran tradition
- **Christmas Decorations:** Handmade ornaments, wreaths using local materials

**FOR SUSTAINABLE LIVING & PERMACULTURE PRACTITIONERS:**

**Learn About Local Food Systems:**
- **Farm-to-Table:** Meet the farmers growing food in Santa Cruz valley
- **Traditional Varieties:** See heritage vegetable varieties not found in supermarkets
- **Seed Exchange:** Farmers often willing to share seeds, discuss growing techniques
- **Preservation Methods:** Traditional fermentation, drying, curing techniques on display
- **Seasonal Eating:** Understand what grows naturally in December in subtropical climate

Experience Madeira\'s authentic agricultural heritage and community Christmas spirit in the welcoming town of Santa Cruz - where farming traditions and seasonal celebration continue as they have for centuries!',
  '2024-12-13',
  '18:00:00',
  '23:59:00',
  'Praça Central, Santa Cruz',
  'Praça Central, Santa Cruz, Madeira, Portugal',
  32.6903,
  -16.7940,
  'market',
  0.00,
  'FREE admission - Food/crafts €5-50',
  NULL,
  NULL,
  'Santa Cruz Tourism',
  'Santa Cruz Municipality',
  'camara@cm-santacruz.pt',
  NULL,
  'https://www.cm-santacruz.pt',
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  slug = EXCLUDED.slug,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  location_name = EXCLUDED.location_name,
  location_address = EXCLUDED.location_address,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  event_type = EXCLUDED.event_type,
  price = EXCLUDED.price,
  price_display = EXCLUDED.price_display,
  organizer_name = EXCLUDED.organizer_name,
  organizer_organization = EXCLUDED.organizer_organization,
  contact_email = EXCLUDED.contact_email,
  contact_phone = EXCLUDED.contact_phone,
  contact_website = EXCLUDED.contact_website,
  status = EXCLUDED.status;

-- ================================================================
-- EVENT 3: Machico Noite do Mercado (December 20, 2024)
-- ================================================================

INSERT INTO wiki_events (
  title, slug, description, event_date, start_time, end_time,
  location_name, location_address, latitude, longitude,
  event_type, price, price_display, registration_url, max_attendees,
  organizer_name, organizer_organization, contact_email, contact_phone, contact_website, status
) VALUES (
  'Machico Noite do Mercado (Market Night) 2024',
  'machico-market-night-2024',
  E'**WHY ATTEND THIS EVENT**

Machico, the historic first landing point of Portuguese explorers in 1419 and Madeira\'s original capital, hosts one of the island\'s most charming Christmas Market Nights on December 20th - just days before Christmas. This coastal town combines centuries of maritime heritage with agricultural traditions, creating a unique market atmosphere where fishermen, farmers, and artisans celebrate together.

For sustainable living advocates, Machico exemplifies the integration of land and sea systems - observe how coastal communities balance fishing traditions with terraced agriculture, manage freshwater resources from mountains to ocean, and maintain cultural practices that have sustained them for 600+ years.

**WHAT THE EVENT OFFERS**

**The Machico Market Night Experience:**

- **Historic Setting:** Portugal\'s first settlement in the Atlantic, steeped in exploration history
- **Coastal Character:** Fishing heritage integrated with agricultural traditions
- **Community Scale:** 60-100 vendors (larger than Santa Cruz, more intimate than Funchal)
- **Maritime-Agricultural Fusion:** Fresh seafood straight from Machico fishing boats
- **Traditional Christmas Foods:** Espada with banana, lapas grelhadas, bolo do caco
- **Permaculture Interest:** Coastal zone edge ecology, seaweed collection, traditional boat-building

**FOR SUSTAINABLE LIVING & PERMACULTURE PRACTITIONERS:**

**Coastal Permaculture Observations:**
- **Integrated Systems:** How fishing communities combine aquatic and terrestrial food production
- **Seaweed Fertilization:** Traditional use of beach-washed seaweed for garden fertility
- **Salt Preservation:** Observe traditional fish curing and preservation techniques
- **Tidal Awareness:** Understanding lunar cycles for fishing and planting
- **Windbreak Strategies:** How coastal farms protect crops from salt spray and wind

Experience where Madeira\'s story began - in the welcoming coastal town of Machico, where maritime traditions and agricultural heritage merge in celebration of Christmas and community!',
  '2024-12-20',
  '18:00:00',
  '23:59:00',
  'Largo da Praça, Machico',
  'Largo da Praça, Machico, Madeira, Portugal',
  32.7167,
  -16.7667,
  'market',
  0.00,
  'FREE admission - Food/crafts €10-60',
  NULL,
  NULL,
  'Machico Tourism',
  'Machico Municipality',
  'geral@cm-machico.pt',
  '+351 291 962 289',
  'https://www.cm-machico.pt',
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  slug = EXCLUDED.slug,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  location_name = EXCLUDED.location_name,
  location_address = EXCLUDED.location_address,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  event_type = EXCLUDED.event_type,
  price = EXCLUDED.price,
  price_display = EXCLUDED.price_display,
  organizer_name = EXCLUDED.organizer_name,
  organizer_organization = EXCLUDED.organizer_organization,
  contact_email = EXCLUDED.contact_email,
  contact_phone = EXCLUDED.contact_phone,
  contact_website = EXCLUDED.contact_website,
  status = EXCLUDED.status;

-- ================================================================
-- EVENT 4: Funchal Mercado dos Lavradores Christmas Night (December 23, 2024)
-- ================================================================

INSERT INTO wiki_events (
  title, slug, description, event_date, start_time, end_time,
  location_name, location_address, latitude, longitude,
  event_type, price, price_display, registration_url, max_attendees,
  organizer_name, organizer_organization, contact_email, contact_phone, contact_website, status
) VALUES (
  'Funchal Mercado dos Lavradores Christmas Night 2024',
  'funchal-farmers-market-christmas-2024',
  E'**WHY ATTEND THIS EVENT**

The largest and most famous Christmas Market Night in Madeira, held at the historic Farmers Market on December 23rd - the pinnacle of Christmas celebrations. Experience the most spectacular traditional market with 200+ vendors, live entertainment, and authentic Madeiran Christmas atmosphere.

**WHAT IT OFFERS**:
- **Massive Scale**: 200+ vendors (vs 50-100 at other markets)
- **Historic Venue**: Art Deco Mercado dos Lavradores (1940), architectural landmark
- **Peak Timing**: December 23rd is THE night - traditional family celebration before Christmas Eve
- **International Atmosphere**: Locals, expats, tourists celebrate together
- **Hours**: 18:00-02:00 (extends later than other markets)

**Traditional Foods**: All Madeira Christmas specialties - carne de vinha d\'alhos, bolo de mel, poncha, seafood, tropical fruits, roasted chestnuts

**Entertainment**: Multiple stages with Madeiran folk groups, children\'s choirs, traditional dancers, street performers

**FOR PERMACULTURE PRACTITIONERS**: Largest concentration of local farmers showing full range of Madeiran agriculture - subtropical fruits, vegetables, herbs, seeds, traditional preservation methods

**LOGISTICS**:
- **Getting There**: Walking distance from central Funchal hotels, or Bus Routes 1,2,4,20,23 to Santa Maria
- **Arrive Early**: By 17:00 for less crowded browsing, or embrace peak chaos 19:00-22:00
- **Budget**: €30-60 for food, drinks, purchases

**TIPS**: Very crowded (15,000-20,000 people), bring cash, expect pickpockets, amazing atmosphere but overwhelming for some. Consider earlier markets if you prefer intimate experience.',
  '2024-12-23',
  '18:00:00',
  '02:00:00',
  'Mercado dos Lavradores, Funchal',
  'Rua Bela de São Tiago, Funchal, Madeira, Portugal',
  32.6506,
  -16.9086,
  'market',
  0.00,
  'FREE admission - Food/purchases €30-60',
  NULL,
  NULL,
  'Funchal Tourism',
  'Funchal Municipality',
  'turismo@funchal.pt',
  '+351 291 211 900',
  'https://www.visitmadeira.com',
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  slug = EXCLUDED.slug,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  location_name = EXCLUDED.location_name,
  location_address = EXCLUDED.location_address,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  event_type = EXCLUDED.event_type,
  price = EXCLUDED.price,
  price_display = EXCLUDED.price_display,
  organizer_name = EXCLUDED.organizer_name,
  organizer_organization = EXCLUDED.organizer_organization,
  contact_email = EXCLUDED.contact_email,
  contact_phone = EXCLUDED.contact_phone,
  contact_website = EXCLUDED.contact_website,
  status = EXCLUDED.status;

-- ================================================================
-- EVENT 5: Funchal New Year's Eve Fireworks (December 31, 2024)
-- ================================================================

INSERT INTO wiki_events (
  title, slug, description, event_date, start_time, end_time,
  location_name, location_address, latitude, longitude,
  event_type, price, price_display, registration_url, max_attendees,
  organizer_name, organizer_organization, contact_email, contact_phone, contact_website, status
) VALUES (
  'Funchal New Year''s Eve Fireworks 2024-2025',
  'funchal-new-year-fireworks-2024-2025',
  E'**WHY ATTEND THIS EVENT**

Experience the Guinness World Record holder for "Greatest Fireworks Show in the World" (2006) - an 8-minute spectacular launched from 59 stations across Funchal\'s amphitheater bay. One of the planet\'s most famous New Year celebrations, broadcast globally.

**WHAT IT OFFERS**:
- **World Record**: 8 minutes of continuous fireworks from land, sea, and mountains
- **59 Launch Stations**: 27 in amphitheater hills, 25 on waterfront/pier, 5 at sea, 2 on Porto Santo
- **Viewing Options**:
  - **Free Public**: Waterfront promenade, anywhere in Funchal bay (100,000+ people)
  - **Paid Premium**: Hotel rooftop parties (€80-250), boat cruises (€150-400)
  - **Best Free Spot**: Praça CR7, Almirante Reis waterfront, São Tiago Fort
- **Schedule**: Midnight fireworks PLUS smaller shows at 20:00 and 23:00
- **Street Party**: Live music stages, poncha bars, dancing until dawn

**FOR SUSTAINABLE LIVING ADVOCATES**: Observe how city manages massive waste from 100,000+ people, public transport logistics, and community organization at scale. Municipality has improved sustainability: LED shows during evening, coordinated cleanup crews, recycling stations.

**LOGISTICS**:
- **Arrive**: By 20:00 to secure good viewing spot (earlier for premium locations)
- **Accommodation**: Book 6-12 months ahead - hotels completely full
- **Transport**: No cars in center Dec 31-Jan 1, excellent bus services, walking recommended
- **What to Bring**: Layers (cool evening), cash for food/drinks, camera, patience for crowds
- **Budget**: FREE viewing + €20-50 for food/drinks, or €150-400 for premium experiences

**ALTERNATIVE**: Watch from quieter locations (Câmara de Lobos, Ponta do Sol, even Santa Cruz) for less crowds, still see/hear fireworks

**CULTURAL NOTE**: Madeirans celebrate with 12 raisins at midnight (one for each month) and champagne toasts. Join the tradition!',
  '2024-12-31',
  '20:00:00',
  '02:00:00',
  'Funchal Waterfront & Bay',
  'Avenida do Mar, Funchal, Madeira, Portugal',
  32.6478,
  -16.9084,
  'festival',
  0.00,
  'FREE public viewing - Premium experiences €150-400',
  NULL,
  NULL,
  'Funchal Tourism',
  'Funchal Municipality',
  'turismo@funchal.pt',
  '+351 291 211 900',
  'https://www.visitmadeira.com',
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  slug = EXCLUDED.slug,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  location_name = EXCLUDED.location_name,
  location_address = EXCLUDED.location_address,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  event_type = EXCLUDED.event_type,
  price = EXCLUDED.price,
  price_display = EXCLUDED.price_display,
  organizer_name = EXCLUDED.organizer_name,
  organizer_organization = EXCLUDED.organizer_organization,
  contact_email = EXCLUDED.contact_email,
  contact_phone = EXCLUDED.contact_phone,
  contact_website = EXCLUDED.contact_website,
  status = EXCLUDED.status;

-- ================================================================
-- EVENT 6: Epiphany Hymns Concert (January 5, 2025)
-- ================================================================

INSERT INTO wiki_events (
  title, slug, description, event_date, start_time, end_time,
  location_name, location_address, latitude, longitude,
  event_type, price, price_display, registration_url, max_attendees,
  organizer_name, organizer_organization, contact_email, contact_phone, contact_website, status
) VALUES (
  'Epiphany Hymns Concert Funchal 2025',
  'epiphany-hymns-funchal-2025',
  E'**WHY ATTEND THIS EVENT**

Traditional Madeiran Epiphany celebration on January 5th featuring "Cantar os Reis" (Singing the Kings) - an ancient Portuguese tradition where hymns honoring the Three Wise Men are sung in public squares. This free outdoor concert marks the end of the Christmas season and final night of the Christmas lights.

**WHAT IT OFFERS**:
- **Traditional Hymns**: "Cantar os Reis" performed by regional choirs
- **Public Concert**: Open-air performance at Praça do Povo (7:00 PM)
- **Historic Tradition**: Revives ancient Portuguese Epiphany customs dating back centuries
- **Community Atmosphere**: Local families gathering for final Christmas celebration
- **Christmas Lights Finale**: Last evening of illuminated decorations (lights off Jan 6-7)

**CULTURAL SIGNIFICANCE**:
Epiphany (January 6) celebrates the Three Wise Men bringing gifts to baby Jesus. Portuguese tradition includes singing special hymns on the evening of January 5th, visiting homes and public squares. Madeiran version incorporates local musical elements and communal outdoor performance.

**FOR VISITORS**:
Intimate, authentic cultural experience - primarily locals attending, not tourist-focused. Excellent opportunity to witness Portuguese Catholic traditions maintained in Atlantic island context.

**LOGISTICS**:
- **Location**: Praça do Povo, Funchal (main public square)
- **Time**: 19:00 (7:00 PM) - January 5, 2025
- **Duration**: ~60-90 minutes
- **Getting There**: Central Funchal, walking distance from hotels, Bus Routes 1,2,4,20
- **What to Bring**: Light jacket (evening temperatures 14-17°C), maybe umbrella (January rain possible)
- **Cost**: FREE

**AFTER THE CONCERT**:
Traditional Madeirans eat "Bolo Rei" (King Cake) on Epiphany - try it at local bakeries. Many families also dismantle Christmas decorations on January 6th, symbolically ending the season.',
  '2025-01-05',
  '19:00:00',
  '21:00:00',
  'Praça do Povo, Funchal',
  'Praça do Povo, Funchal, Madeira, Portugal',
  32.6508,
  -16.9092,
  'cultural',
  0.00,
  'FREE',
  NULL,
  NULL,
  'Funchal Tourism',
  'Funchal Municipality',
  'turismo@funchal.pt',
  '+351 291 211 900',
  'https://www.visitmadeira.com',
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  slug = EXCLUDED.slug,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  location_name = EXCLUDED.location_name,
  location_address = EXCLUDED.location_address,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  event_type = EXCLUDED.event_type,
  price = EXCLUDED.price,
  price_display = EXCLUDED.price_display,
  organizer_name = EXCLUDED.organizer_name,
  organizer_organization = EXCLUDED.organizer_organization,
  contact_email = EXCLUDED.contact_email,
  contact_phone = EXCLUDED.contact_phone,
  contact_website = EXCLUDED.contact_website,
  status = EXCLUDED.status;

-- ================================================================
-- RELIGIOUS FESTIVALS (5 events)
-- ================================================================

-- EVENT 7: Festival of Santo António (June 7-13, 2025)
-- ================================================================

INSERT INTO wiki_events (
  title, slug, description, event_date, start_time, end_time,
  location_name, location_address, latitude, longitude,
  event_type, price, price_display, registration_url, max_attendees,
  organizer_name, organizer_organization, contact_email, contact_phone, contact_website, status
) VALUES (
  'Festival of Santo António (Saint Anthony) 2025',
  'festival-santo-antonio-2025',
  E'**WHY ATTEND THIS EVENT**

The first of Madeira\'s "Popular Saints" festivals, honoring Santo António (Saint Anthony of Padua, patron saint of lost things and matchmaker). Week-long celebration across multiple Madeira parishes from June 7-13, featuring religious processions, traditional music, food, and community gatherings.

**WHAT IT OFFERS**:
- **Religious Processions**: Candlelit processions carrying Saint Anthony statues through decorated streets
- **Street Festivals**: Neighborhoods decorate streets with flowers, lights, arches; set up food stalls and live music
- **Traditional Foods**: Sardines grilled on outdoor grills (Santo António tradition across Portugal), caldo verde (kale soup), cornbread, wine
- **Baile Popular**: Street dances with traditional Madeiran music and contemporary Portuguese pop
- **Church Services**: Special masses at churches dedicated to Santo António

**MAJOR CELEBRATION LOCATIONS**:
- **Funchal**: Multiple parishes celebrate, especially Curral das Freiras (mountain village)
- **Santana**: North coast town hosts vibrant festivities
- **Câmara de Lobos**: Fishing village with authentic celebration
- **Rural Parishes**: Smaller villages throughout Madeira

**FOR CULTURAL EXPLORERS**: Observe how Portuguese Catholic traditions blend with local Madeiran character - African-influenced music, Atlantic island foods, subtropical flowers in decorations. Each parish celebrates slightly differently - visit multiple locations to compare!

**TRADITION**: Saint Anthony (1195-1231) is beloved matchmaker saint - young unmarried people attend hoping to find partners. Tradition says prayers to Santo António help find lost items and lost love!',
  '2025-06-07',
  '18:00:00',
  '23:59:00',
  'Multiple Locations, Madeira',
  'Various parishes across Madeira, Portugal',
  32.6500,
  -16.9100,
  'religious',
  0.00,
  'FREE - Food/drink €10-20',
  NULL,
  NULL,
  'Madeira Diocese',
  'Madeira Municipalities',
  NULL,
  '+351 291 211 900',
  'https://www.visitmadeira.com',
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  slug = EXCLUDED.slug,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  location_name = EXCLUDED.location_name,
  location_address = EXCLUDED.location_address,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  event_type = EXCLUDED.event_type,
  price = EXCLUDED.price,
  price_display = EXCLUDED.price_display,
  organizer_name = EXCLUDED.organizer_name,
  organizer_organization = EXCLUDED.organizer_organization,
  contact_email = EXCLUDED.contact_email,
  contact_phone = EXCLUDED.contact_phone,
  contact_website = EXCLUDED.contact_website,
  status = EXCLUDED.status;

-- ================================================================
-- EVENT 8: Festival of São João (June 14-25, 2025)
-- ================================================================

INSERT INTO wiki_events (
  title, slug, description, event_date, start_time, end_time,
  location_name, location_address, latitude, longitude,
  event_type, price, price_display, registration_url, max_attendees,
  organizer_name, organizer_organization, contact_email, contact_phone, contact_website, status
) VALUES (
  'Festival of São João (Saint John) 2025',
  'festival-sao-joao-2025',
  E'**WHY ATTEND THIS EVENT**

Madeira\'s most exuberant Popular Saints festival, celebrating São João (Saint John the Baptist) with 12 days of street parties, bonfires, fireworks, and traditional celebrations from June 14-25. Peak celebrations June 23-24 (Saint John\'s Eve and Day) feature all-night festivities across the island.

**WHAT IT OFFERS**:
- **Bonfires (Fogueiras)**: Traditional bonfires lit in village squares on June 23rd evening
- **Jumping Fires**: Tradition of jumping over bonfires for good luck and purification
- **Fireworks**: Nightly fireworks displays in major towns
- **Street Parties**: Live music, dance, food stalls in decorated streets
- **Grilled Sardines**: Massive outdoor grills preparing thousands of fresh sardines
- **Arraial**: Street fairs with games, prizes, community competitions
- **Traditional Dress**: Locals wear historic Madeiran costumes

**PEAK LOCATIONS**:
- **Porto da Cruz**: North coast village with spectacular bonfire celebrations
- **Machico**: Large-scale festivities on waterfront
- **Funchal**: Multiple neighborhoods host street parties
- **Calheta**: Southwest coast town with beach bonfire

**CULTURAL SIGNIFICANCE**: São João celebrates John the Baptist (Jesus\'s cousin). Bonfire tradition symbolizes the light John brought to world. Madeiran version incorporates pre-Christian midsummer solstice celebrations (fire, fertility, purification).

**PERMACULTURE INTEREST**: June marks agricultural transition - winter crops harvested, summer planting begins. Festivals celebrate agricultural abundance and ask blessings for upcoming season. Observe seasonal foods at market stalls.',
  '2025-06-14',
  '18:00:00',
  '23:59:00',
  'Multiple Locations, Madeira',
  'Various towns across Madeira, Portugal',
  32.6500,
  -16.9100,
  'religious',
  0.00,
  'FREE - Food/drinks €15-30',
  NULL,
  NULL,
  'Madeira Diocese',
  'Madeira Municipalities',
  NULL,
  '+351 291 211 900',
  'https://www.visitmadeira.com',
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  slug = EXCLUDED.slug,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  location_name = EXCLUDED.location_name,
  location_address = EXCLUDED.location_address,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  event_type = EXCLUDED.event_type,
  price = EXCLUDED.price,
  price_display = EXCLUDED.price_display,
  organizer_name = EXCLUDED.organizer_name,
  organizer_organization = EXCLUDED.organizer_organization,
  contact_email = EXCLUDED.contact_email,
  contact_phone = EXCLUDED.contact_phone,
  contact_website = EXCLUDED.contact_website,
  status = EXCLUDED.status;

-- ================================================================
-- EVENT 9: Festival of São Pedro (June 26-July 1, 2025)
-- ================================================================

INSERT INTO wiki_events (
  title, slug, description, event_date, start_time, end_time,
  location_name, location_address, latitude, longitude,
  event_type, price, price_display, registration_url, max_attendees,
  organizer_name, organizer_organization, contact_email, contact_phone, contact_website, status
) VALUES (
  'Festival of São Pedro (Saint Peter) 2025',
  'festival-sao-pedro-2025',
  E'**WHY ATTEND THIS EVENT**

The final Popular Saints festival, honoring São Pedro (Saint Peter, patron saint of fishermen). Celebrated June 26-July 1 primarily in coastal fishing communities with maritime processions, seafood feasts, and blessings of fishing boats.

**WHAT IT OFFERS**:
- **Maritime Processions**: Decorated fishing boats carry Saint Peter statues along coast
- **Boat Blessings**: Priests bless fishing fleet for safe and abundant catches
- **Seafood Feasts**: Fresh catch grilled and served communally - tuna, limpets, octopus, espada
- **Fishermen\'s Traditions**: Songs, stories, demonstrations of traditional fishing methods
- **Coastal Celebrations**: Beach bonfires, waterfront parties, fireworks over ocean

**PRIME LOCATIONS**:
- **Câmara de Lobos**: Historic fishing village, most authentic celebration
- **Caniçal**: Eastern fishing port with strong maritime traditions
- **Machico**: Waterfront celebrations
- **Paul do Mar**: Southwest fishing village
- **Porto Moniz**: Northwest coastal town

**CULTURAL INSIGHT**: Saint Peter was fisherman before becoming Jesus\'s disciple, making him patron saint of fishing communities worldwide. Madeira\'s version emphasizes maritime heritage - watch fishermen demonstrate net-mending, knot-tying, fish preservation techniques passed through generations.

**FOR SUSTAINABLE LIVING ADVOCATES**: Learn about traditional sustainable fishing practices - seasonal closures, size limits, species protection. Fishermen often discuss lunar fishing calendars, weather pattern reading, and ocean ecology. Excellent opportunity to understand artisanal fisheries vs. industrial methods.

**PERMACULTURE CONNECTION**: Fishing communities demonstrate coastal zone management, seaweed harvesting for fertilizer, fish waste composting, integrated land-sea food systems.',
  '2025-06-26',
  '18:00:00',
  '23:00:00',
  'Coastal Villages, Madeira',
  'Various coastal fishing villages, Madeira, Portugal',
  32.6500,
  -16.9100,
  'religious',
  0.00,
  'FREE - Seafood meals €12-25',
  NULL,
  NULL,
  'Madeira Diocese',
  'Fishing Communities',
  NULL,
  '+351 291 211 900',
  'https://www.visitmadeira.com',
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  slug = EXCLUDED.slug,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  location_name = EXCLUDED.location_name,
  location_address = EXCLUDED.location_address,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  event_type = EXCLUDED.event_type,
  price = EXCLUDED.price,
  price_display = EXCLUDED.price_display,
  organizer_name = EXCLUDED.organizer_name,
  organizer_organization = EXCLUDED.organizer_organization,
  contact_email = EXCLUDED.contact_email,
  contact_phone = EXCLUDED.contact_phone,
  contact_website = EXCLUDED.contact_website,
  status = EXCLUDED.status;

-- ================================================================
-- EVENT 10: Nossa Senhora do Monte Festival (August 5-15, 2025)
-- ================================================================

INSERT INTO wiki_events (
  title, slug, description, event_date, start_time, end_time,
  location_name, location_address, latitude, longitude,
  event_type, price, price_display, registration_url, max_attendees,
  organizer_name, organizer_organization, contact_email, contact_phone, contact_website, status
) VALUES (
  'Nossa Senhora do Monte Festival 2025',
  'nossa-senhora-monte-2025',
  E'**WHY ATTEND THIS EVENT**

Madeira\'s largest and most significant religious festival, honoring Nossa Senhora do Monte (Our Lady of the Mount), patron saint of Madeira. Nine days of religious devotion, cultural celebrations, and pilgrimage from August 5-15, culminating in massive procession on August 15th (Assumption Day, regional holiday).

**WHAT IT OFFERS**:
- **Novenas**: Nine consecutive evenings of special masses at Monte Church (Aug 5-13)
- **Pilgrimage**: Thousands walk uphill to Monte Church, many fulfilling religious vows
- **Grand Procession (Aug 15)**: Statue of Nossa Senhora carried through Monte and Funchal, 50,000+ participants/observers
- **Decorated Streets**: Flower carpets, lights, religious banners throughout Monte
- **Traditional Market**: Food stalls, handicrafts, religious items
- **Cultural Events**: Madeiran folk music, traditional dance performances
- **Toboggan Rides**: Famous Monte wicker sledges operate throughout festival

**RELIGIOUS SIGNIFICANCE**:
Nossa Senhora do Monte venerated since island settlement (1400s). Church houses miraculous statue and tomb of last Austro-Hungarian Emperor (Karl I, died in Madeira exile 1922). Pilgrims pray for healing, give thanks, fulfill promises (some climb church steps on knees in penance).

**LOCATION**: Monte, hillside suburb 600m above Funchal (cable car, bus, or toboggan access)

**CULTURAL EXPERIENCE**: Madeira\'s deepest religious tradition - observe sincere Catholic devotion, multi-generational family participation, blend of Portuguese and Madeiran customs. Even non-religious visitors moved by community faith and beautiful ceremony.

**FESTIVAL ATMOSPHERE**: Balances solemn religious observance (masses, processions) with joyful celebration (music, food, community gathering). Respectful visitors of all backgrounds welcomed.',
  '2025-08-05',
  '09:00:00',
  '23:00:00',
  'Monte, Funchal',
  'Monte, Funchal, Madeira, Portugal',
  32.6666,
  -16.8950,
  'religious',
  0.00,
  'FREE - Cable car €15, food €10-20',
  NULL,
  NULL,
  'Madeira Diocese',
  'Monte Parish',
  NULL,
  '+351 291 741 124',
  'https://www.visitmadeira.com',
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  slug = EXCLUDED.slug,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  location_name = EXCLUDED.location_name,
  location_address = EXCLUDED.location_address,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  event_type = EXCLUDED.event_type,
  price = EXCLUDED.price,
  price_display = EXCLUDED.price_display,
  organizer_name = EXCLUDED.organizer_name,
  organizer_organization = EXCLUDED.organizer_organization,
  contact_email = EXCLUDED.contact_email,
  contact_phone = EXCLUDED.contact_phone,
  contact_website = EXCLUDED.contact_website,
  status = EXCLUDED.status;

-- ================================================================
-- EVENT 11: Nossa Senhora da Piedade Festival - Caniçal (September 19-21, 2025)
-- ================================================================

INSERT INTO wiki_events (
  title, slug, description, event_date, start_time, end_time,
  location_name, location_address, latitude, longitude,
  event_type, price, price_display, registration_url, max_attendees,
  organizer_name, organizer_organization, contact_email, contact_phone, contact_website, status
) VALUES (
  'Nossa Senhora da Piedade Festival - Caniçal 2025',
  'nossa-senhora-piedade-canical-2025',
  E'**WHY ATTEND THIS EVENT**

One of Madeira\'s oldest religious festivals (centuries-old tradition) celebrating Nossa Senhora da Piedade (Our Lady of Mercy) in the historic eastern fishing village of Caniçal. Intimate coastal festival blending maritime traditions with Catholic devotion, September 19-21.

**WHAT IT OFFERS**:
- **Religious Processions**: Statue carried through Caniçal streets and along waterfront
- **Boat Procession**: Fishing boats decorated with flowers escort statue along coast (unique maritime element!)
- **Masses**: Special services at Igreja de Nossa Senhora da Piedade
- **Fishing Community Traditions**: Blessings of fishing fleet, fishermen\'s hymns, maritime prayers
- **Traditional Music**: Madeiran folk groups, fishing work songs
- **Seafood Festival**: Fresh catch grilled communally - celebrate sea\'s abundance
- **Cultural Exhibitions**: Historical displays about Caniçal\'s whaling past (now protected), fishing heritage

**LOCATION SIGNIFICANCE**:
Caniçal is Madeira\'s easternmost village, historically dependent on whaling (ended 1981, now conservation focus). Festival honors Our Lady of Mercy for protecting fishermen at sea and community through hardships. Whale Museum nearby offers context for village\'s transformation from whaling to whale-watching eco-tourism.

**INTIMATE SCALE**: Smaller than Monte festival (~2,000-3,000 attendees vs. 50,000+), authentic fishing community celebration, easy to interact with locals and participate meaningfully.

**FOR SUSTAINABLE LIVING ADVOCATES**: Caniçal exemplifies community transition from extractive whaling industry to sustainable tourism and fishing. Observe how coastal community maintained cultural identity through economic transformation. Learn about current sustainable fishing practices vs. historical whaling.

**PERMACULTURE INTEREST**: Maritime zone edge ecology, seaweed collection, traditional boat-building using endemic wood, coastal terraced agriculture.',
  '2025-09-19',
  '09:00:00',
  '22:00:00',
  'Caniçal, Madeira',
  'Caniçal, Madeira, Portugal',
  32.7383,
  -16.7342,
  'religious',
  0.00,
  'FREE - Food €12-20',
  NULL,
  NULL,
  'Caniçal Parish',
  'Fishing Community',
  NULL,
  '+351 291 961 927',
  'https://www.visitmadeira.com',
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  slug = EXCLUDED.slug,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  location_name = EXCLUDED.location_name,
  location_address = EXCLUDED.location_address,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  event_type = EXCLUDED.event_type,
  price = EXCLUDED.price,
  price_display = EXCLUDED.price_display,
  organizer_name = EXCLUDED.organizer_name,
  organizer_organization = EXCLUDED.organizer_organization,
  contact_email = EXCLUDED.contact_email,
  contact_phone = EXCLUDED.contact_phone,
  contact_website = EXCLUDED.contact_website,
  status = EXCLUDED.status;

-- ================================================================
-- CULTURAL FESTIVALS (3 events)
-- ================================================================

-- EVENT 12: Festa da Flor (Flower Festival) 2025
-- ================================================================

INSERT INTO wiki_events (
  title, slug, description, event_date, start_time, end_time,
  location_name, location_address, latitude, longitude,
  event_type, price, price_display, registration_url, max_attendees,
  organizer_name, organizer_organization, contact_email, contact_phone, contact_website, status
) VALUES (
  'Festa da Flor (Flower Festival) 2025',
  'flower-festival-2025',
  E'**WHY ATTEND THIS EVENT**

Madeira\'s most beautiful and photogenic festival, celebrating the island\'s spectacular spring flowers with elaborate displays, parades, and cultural events from May 1-25. The highlight is the Grand Flower Parade featuring thousands of children carrying flowers creating a moving river of color through Funchal streets.

**WHAT IT OFFERS**:
- **Wall of Hope**: Opening ceremony where children build a massive wall using flowers, symbolizing peace and hope
- **Grand Flower Parade**: Thousands of participants in flower costumes, decorated floats, children carrying flower arrangements
- **Auto Parade**: Classic cars decorated with flowers driving through Funchal
- **Flower Carpets**: Streets covered with intricate designs made entirely from flower petals (Portuguese tradition "tapetes de flores")
- **Exhibition**: Stunning flower arrangements and sculptures at municipal gardens and public spaces
- **Concerts**: Open-air music performances throughout festival period

**PERMACULTURE & HORTICULTURE INTEREST**:
- **Endemic Flora**: Learn about Madeira\'s unique laurel forest flowers and subtropical species
- **Sustainable Floriculture**: Meet local flower growers, understand water-wise flower production
- **Companion Planting**: Observe traditional Madeiran polyculture gardens mixing flowers, vegetables, fruits
- **Seed Exchange**: Some growers share seeds and cuttings
- **Traditional Knowledge**: Elders demonstrate flower preservation, natural dyes from flowers

**BEST EVENTS**:
- **May 1**: Wall of Hope ceremony (Praça do Município, morning)
- **First Weekend (May 3-4)**: Grand Flower Parade (Sunday afternoon, main avenue)
- **Throughout**: Flower carpet exhibits in Old Town streets
- **May 25**: Festival closing ceremony

**CULTURAL CONTEXT**: Festival started 1979 to celebrate Madeira\'s transition from political dictatorship to democracy (1974 Carnation Revolution). Flowers symbolize freedom, beauty, peace.',
  '2025-05-01',
  '09:00:00',
  '18:00:00',
  'Funchal & Island-wide',
  'Funchal and various locations, Madeira, Portugal',
  32.6500,
  -16.9100,
  'festival',
  0.00,
  'FREE - Paid seats €15-25',
  NULL,
  NULL,
  'Funchal Municipality',
  'Madeira Tourism',
  'turismo@funchal.pt',
  '+351 291 211 900',
  'https://www.visitmadeira.com',
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  slug = EXCLUDED.slug,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  location_name = EXCLUDED.location_name,
  location_address = EXCLUDED.location_address,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  event_type = EXCLUDED.event_type,
  price = EXCLUDED.price,
  price_display = EXCLUDED.price_display,
  organizer_name = EXCLUDED.organizer_name,
  organizer_organization = EXCLUDED.organizer_organization,
  contact_email = EXCLUDED.contact_email,
  contact_phone = EXCLUDED.contact_phone,
  contact_website = EXCLUDED.contact_website,
  status = EXCLUDED.status;

-- ================================================================
-- EVENT 13: Madeira Wine Festival (August 24 - September 14, 2025)
-- ================================================================

INSERT INTO wiki_events (
  title, slug, description, event_date, start_time, end_time,
  location_name, location_address, latitude, longitude,
  event_type, price, price_display, registration_url, max_attendees,
  organizer_name, organizer_organization, contact_email, contact_phone, contact_website, status
) VALUES (
  'Madeira Wine Festival 2025',
  'madeira-wine-festival-2025',
  E'**WHY ATTEND THIS EVENT**

Three-week celebration of Madeira\'s 600-year winemaking tradition from August 24 - September 14, featuring wine tastings, grape harvest demonstrations, traditional folklore, and the famous grape-treading ceremony. Experience living agricultural heritage and taste world-renowned fortified wines.

**WHAT IT OFFERS**:
- **Folklore Week**: Traditional Madeiran music, dance, costumes in village squares island-wide
- **Grape Harvest Demonstrations**: See traditional picking, basket-carrying methods
- **Grape Treading Ceremony**: Participate in traditional foot-pressing of grapes (hygienic, it\'s just ceremonial now!)
- **Wine Tastings**: Sample various Madeira wine types (Sercial, Verdelho, Bual, Malmsey)
- **Wine Lounge**: Expert-led tastings explaining production, aging, terroir
- **Regional Products Market**: Local foods paired with wines, artisan products
- **Parades**: Decorated oxcarts, traditional costumes, harvest celebrations

**PERMACULTURE & AGRICULTURE INTEREST**:
- **Traditional Viticulture**: Madeira\'s unique terraced vineyards on extreme slopes (some 30-40° inclines!)
- **Poios System**: Ancient stone terraces (like Incan terraces) preventing erosion, capturing water
- **Levada Irrigation**: Traditional water channels feeding vineyards
- **Heritage Varieties**: Rare grape varietals maintained for 600 years
- **Sustainable Practices**: Organic vineyard management, minimal intervention winemaking
- **Volcanic Soil**: Understand how volcanic terroir creates unique wine characteristics

**WINE EDUCATION**:
- **Madeira Wine Types**: Dry (Sercial), medium-dry (Verdelho), medium-sweet (Bual), sweet (Malmsey)
- **Aging Process**: Some Madeira wines aged 100+ years (taste vintage wines from 1800s!)
- **Fortification**: Learn traditional method of adding grape spirit
- **Historical Significance**: Madeira wine toasted American Independence (George Washington\'s favorite!)

**MAJOR EVENTS**:
- **August 24-30**: Folklore Week (villages island-wide)
- **Early September**: Main harvest celebrations, grape treading, wine lounge
- **September 14**: Festival closing, grand tasting event',
  '2025-08-24',
  '09:00:00',
  '23:00:00',
  'Funchal & Wine Regions',
  'Funchal and wine regions, Madeira, Portugal',
  32.6500,
  -16.9100,
  'festival',
  0.00,
  'FREE events - Wine tastings €5-60',
  NULL,
  NULL,
  'Madeira Wine Institute',
  'Madeira Tourism',
  'turismo@funchal.pt',
  '+351 291 204 600',
  'https://www.visitmadeira.com',
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  slug = EXCLUDED.slug,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  location_name = EXCLUDED.location_name,
  location_address = EXCLUDED.location_address,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  event_type = EXCLUDED.event_type,
  price = EXCLUDED.price,
  price_display = EXCLUDED.price_display,
  organizer_name = EXCLUDED.organizer_name,
  organizer_organization = EXCLUDED.organizer_organization,
  contact_email = EXCLUDED.contact_email,
  contact_phone = EXCLUDED.contact_phone,
  contact_website = EXCLUDED.contact_website,
  status = EXCLUDED.status;

-- ================================================================
-- EVENT 14: Atlantic Festival - International Fireworks Competition (June 2025)
-- ================================================================

INSERT INTO wiki_events (
  title, slug, description, event_date, start_time, end_time,
  location_name, location_address, latitude, longitude,
  event_type, price, price_display, registration_url, max_attendees,
  organizer_name, organizer_organization, contact_email, contact_phone, contact_website, status
) VALUES (
  'Atlantic Festival - International Fireworks Competition 2025',
  'atlantic-festival-2025',
  E'**WHY ATTEND THIS EVENT**

Four-week spectacular running throughout June featuring international fireworks competitions, concerts, and cultural events. Ten countries compete with choreographed pyrotechnic displays set to music over Funchal Bay. Free public event celebrating Madeira\'s Atlantic island identity.

**WHAT IT OFFERS**:
- **International Fireworks**: 10 countries competing (Portugal, Spain, France, Italy, Germany, UK, others)
- **Weekly Displays**: Four Saturday nights in June (usually 1st, 8th, 15th, 22nd) at 22:00 (10pm)
- **Choreographed Shows**: Fireworks synchronized to music, ~20 minutes each country
- **Concert Series**: Live music performances before fireworks
- **Street Animation**: Food stalls, entertainers, activities along waterfront
- **Grand Finale**: Best countries compete in final, winner announced

**VIEWING LOCATIONS**:
- **Funchal Waterfront**: Praça CR7, Almirante Reis promenade (best free viewing)
- **Hillside Views**: São Martinho, Pico dos Barcelos (quieter, still good views)
- **Boat Tours**: Some companies offer viewing cruises (€30-50)
- **Restaurant/Hotel Terraces**: Paid venues with food/drink (€20-80)

**SCHEDULE** (Tentative - confirm dates):
- **June 7**: Opening ceremony + first competition
- **June 14**: Second competition
- **June 21**: Third competition (midsummer, São João timing)
- **June 28**: Final competition + winner announcement

**FOR FAMILIES**:
Family-friendly event, children love fireworks, late evening timing (22:00 start) but worth keeping kids up! Arrive 20:00 for good positions, entertainment keeps children occupied.

**CULTURAL SIGNIFICANCE**:
Celebrates Madeira\'s role as Atlantic crossroads - island connecting Europe, Africa, Americas. International competition showcases global connections while celebrating local island identity.

**COMPARE TO NEW YEAR**:
- **Atlantic Festival**: Four nights, 20 minutes each, choreographed to music, seated viewing possible
- **New Year**: One night, 8 minutes, massive scale, standing only, extremely crowded
- **Recommendation**: Atlantic Festival better for families, photography, relaxed experience',
  '2025-06-01',
  '20:00:00',
  '23:30:00',
  'Funchal Bay',
  'Funchal Waterfront, Madeira, Portugal',
  32.6478,
  -16.9084,
  'festival',
  0.00,
  'FREE - Optional boat tours €30-50',
  NULL,
  NULL,
  'Funchal Municipality',
  'Madeira Tourism',
  'turismo@funchal.pt',
  '+351 291 211 900',
  'https://www.visitmadeira.com',
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  slug = EXCLUDED.slug,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  location_name = EXCLUDED.location_name,
  location_address = EXCLUDED.location_address,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  event_type = EXCLUDED.event_type,
  price = EXCLUDED.price,
  price_display = EXCLUDED.price_display,
  organizer_name = EXCLUDED.organizer_name,
  organizer_organization = EXCLUDED.organizer_organization,
  contact_email = EXCLUDED.contact_email,
  contact_phone = EXCLUDED.contact_phone,
  contact_website = EXCLUDED.contact_website,
  status = EXCLUDED.status;

-- ================================================================
-- VERIFICATION BLOCK
-- ================================================================

DO $$
DECLARE
  event_record RECORD;
  event_count INTEGER := 0;
  total_chars INTEGER := 0;
BEGIN
  RAISE NOTICE '================================================================';
  RAISE NOTICE 'Phase 3 - Madeira Seasonal & Religious Events Verification';
  RAISE NOTICE '================================================================';
  RAISE NOTICE '';

  FOR event_record IN
    SELECT title, LENGTH(description) as chars, event_date
    FROM wiki_events
    WHERE title IN (
      'Funchal Christmas Lights Switch-On 2024',
      'Santa Cruz Noite do Mercado (Market Night) 2024',
      'Machico Noite do Mercado (Market Night) 2024',
      'Funchal Mercado dos Lavradores Christmas Night 2024',
      'Funchal New Year''s Eve Fireworks 2024-2025',
      'Epiphany Hymns Concert Funchal 2025',
      'Festival of Santo António (Saint Anthony) 2025',
      'Festival of São João (Saint John) 2025',
      'Festival of São Pedro (Saint Peter) 2025',
      'Nossa Senhora do Monte Festival 2025',
      'Nossa Senhora da Piedade Festival - Caniçal 2025',
      'Festa da Flor (Flower Festival) 2025',
      'Madeira Wine Festival 2025',
      'Atlantic Festival - International Fireworks Competition 2025'
    )
    ORDER BY event_date
  LOOP
    event_count := event_count + 1;
    total_chars := total_chars + event_record.chars;
    RAISE NOTICE '%. %: % characters (Date: %)',
      event_count,
      event_record.title,
      event_record.chars,
      event_record.event_date;
  END LOOP;

  RAISE NOTICE '';
  RAISE NOTICE '================================================================';
  RAISE NOTICE 'Phase 3 Summary:';
  RAISE NOTICE '  - Events added/expanded: %', event_count;
  RAISE NOTICE '  - Total description characters: %', total_chars;
  RAISE NOTICE '  - Average per event: % characters', (total_chars / NULLIF(event_count, 0));
  RAISE NOTICE '';
  RAISE NOTICE 'Event Categories:';
  RAISE NOTICE '  - Christmas/New Year: 6 events';
  RAISE NOTICE '  - Religious Festivals: 5 events';
  RAISE NOTICE '  - Cultural Festivals: 3 events';
  RAISE NOTICE '';
  RAISE NOTICE 'Geographic Coverage:';
  RAISE NOTICE '  - Funchal: 7 events';
  RAISE NOTICE '  - Santa Cruz: 1 event';
  RAISE NOTICE '  - Machico: 1 event';
  RAISE NOTICE '  - Monte: 1 event';
  RAISE NOTICE '  - Caniçal: 1 event';
  RAISE NOTICE '  - Island-wide: 3 events';
  RAISE NOTICE '';
  RAISE NOTICE 'Phase 3 verification complete!';
  RAISE NOTICE '================================================================';
END $$;
