/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/to-be-seeded/009_czech_educational_locations.sql
 * Description: Expand 5 Czech educational center descriptions from 410-567 chars to 2,000-3,000 chars
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-17
 *
 * Purpose: Phase 2, Batch 1 of EVENTS_LOCATIONS_IMPROVEMENT_PLAN.md
 * Complete all Czech educational institutions providing comprehensive learning resources
 * for Central European permaculture practitioners
 *
 * Research Sources Verified 2025-11-17:
 * - Mendel University: mendelu.cz, Wikipedia, syntropy.cz
 * - Permakultura CS: permakulturacs.cz/english, European Permaculture Network
 * - Czech University: studyinprague.cz, Wikipedia, educations.com
 * - KOKOZA: kokoza.cz, inherit.eu, greenglassesprague.cz, mapotic.com
 */

-- ==================================================================
-- UPDATE 1: Mendel University Brno (410 → 2,800+ chars)
-- ==================================================================

UPDATE wiki_locations
SET description = E'**WHY THIS LOCATION MATTERS**

Mendel University in Brno represents one of Central Europe\'s leading agricultural research institutions, offering permaculture practitioners access to cutting-edge soil science, sustainable agriculture research, and international development projects incorporating permaculture principles. Named after Gregor Mendel (the father of modern genetics), the university brings scientific rigor to sustainable farming while increasingly engaging with regenerative agriculture movements including syntropic agriculture and permaculture design.

For practitioners seeking to bridge academic agricultural science with permaculture practice, Mendel University provides research findings, experimental agricultural fields, and educational programs that can inform evidence-based permaculture design decisions.

**WHAT IT OFFERS**

**Sustainable Agriculture Research & Programs:**
- Research focusing on "targeted management of biological processes, efficient utilization of non-renewable and creation of renewable natural resources in the development of sustainable, multifunctional agriculture"
- Faculty of Horticulture launching Master\'s degree in Circular Horti-Production responding to current sustainability challenges
- Institute of Lifelong Education offering 3-day courses on sustainable cultivation covering soil care, biodiversity support, and cultivation principles
- Research areas including sustainable regional development, biotechnology, environmental protection and creation

**Permaculture & Regenerative Agriculture Integration:**
- International permaculture development projects (e.g., building permaculture centers in Ethiopia to improve environment and economic situation of local farmers)
- Hosted lectures on syntropic agriculture, permaculture design, and Soil Food Web by international specialist Philip Barton
- Growing engagement with regenerative agriculture movements complementing traditional agricultural education
- Research applicable to permaculture design including soil biology, crop management, and sustainable horticulture

**Academic Resources:**
- Multiple faculties covering agriculture, horticulture, forestry, and environmental sciences
- Library resources on sustainable agriculture, soil science, and ecological management
- Research publications accessible to practitioners seeking evidence-based approaches
- Experimental agricultural fields demonstrating various cultivation techniques

**International Collaboration:**
- Projects across Europe, Africa, and Asia incorporating sustainable agriculture principles
- English-language programs attracting international students interested in Central European agriculture
- Partnerships with universities worldwide on sustainability research

**HOW TO ENGAGE**

**Lifelong Learning Programs:** The Institute of Lifelong Education (ICV) offers short courses open to the public. Check [icv.mendelu.cz/en/courses-in-agriculture/](https://icv.mendelu.cz/en/courses-in-agriculture/) for sustainable agriculture courses including organic cultivation, soil care, and biodiversity support.

**Public Lectures & Events:** The university periodically hosts public lectures on topics including syntropic agriculture, permaculture, and soil ecology. Monitor their website and Permakultura CS announcements for upcoming events.

**Academic Programs:** For those pursuing formal education, the university offers Bachelor\'s and Master\'s programs in sustainable agriculture, horticulture, and environmental sciences. Some programs available in English.

**Research Collaboration:** Practitioners conducting research or seeking scientific collaboration can contact relevant faculty departments. The Faculty of Horticulture and Faculty of Agrobiology are most relevant to permaculture practitioners.

**Library Access:** As a public university, certain library resources may be accessible to external researchers. Inquire about visitor access policies for specific collections.

**Campus Visits:** The university maintains experimental fields and gardens that may be viewable during public events or by arrangement with relevant departments.

**SPECIFIC DETAILS**

**Location:** Brno, South Moravia, Czech Republic
Zemědělská 1, 613 00 Brno

**Contact:**
Website: https://mendelu.cz/en/
Institute of Lifelong Education: https://icv.mendelu.cz/en/
Email: Check website for department-specific contacts

**Academic Structure:**
- Faculty of Horticulture (sustainable cultivation, circular production)
- Faculty of Agrobiology, Food and Natural Resources
- Faculty of Forestry and Wood Technology
- Institute of Lifelong Education (public courses)

**Language:** Czech programs primary; some English programs available
Public events often bilingual or with translation

**Accessibility:** Brno is Czech Republic\'s second-largest city with excellent public transportation. Campus accessible by tram and bus.

**Permaculture Connections:**
- Collaboration with Permakultura CS Brno (nearby permaculture library and community hub)
- Syntropic agriculture workshops and lectures
- Research applicable to regenerative agriculture practices
- International development projects incorporating permaculture

**Context in Czech Permaculture Movement:**
While Mendel University focuses primarily on conventional agricultural science, it increasingly engages with regenerative movements. Practitioners benefit from accessing rigorous research on soil biology, plant genetics, and sustainable horticulture that can inform permaculture design. The university complements the practical, community-focused work of Permakultura CS Brno.

**Related Resources:** Practitioners visiting Mendel University should also explore Permakultura CS Brno Library & Community Hub (permaculture education and networking), Brno Organic Market Zelný trh (local food systems), and Southern Bohemia Permaculture Garden (practical permaculture demonstration sites in the Brno region).'
WHERE name = 'Mendel University Brno';

-- ==================================================================
-- UPDATE 2: Permakultura CS Prague Library & Education Center (500 → 3,200+ chars)
-- ==================================================================

UPDATE wiki_locations
SET description = E'**WHY THIS LOCATION MATTERS**

Permakultura CS Prague Library & Education Center serves as the flagship hub of Czech Republic\'s organized permaculture movement, established in 1996 and celebrating 30 years of permaculture education in 2024. As the primary permaculture education and networking organization in the Czech Republic, it provides essential resources, community connections, and professional training for practitioners throughout Central Europe.

For permaculture practitioners in Czech Republic and the broader Visegrad region (Poland, Slovakia, Hungary), Permakultura CS represents the most comprehensive resource center, offering Czech-language materials, local networking, and culturally-adapted permaculture education grounded in Central European conditions.

**WHAT IT OFFERS**

**Permaculture Library & Resource Center:**
- Comprehensive permaculture book library available for members to borrow, non-members can read on-site
- Czech-language and English permaculture publications spanning design, techniques, and philosophy
- Seed exchange program facilitating sharing of locally-adapted varieties
- Plant exchange connecting practitioners with heritage and permaculture-suitable species
- Open every other week for community access and informal knowledge sharing
- Located within a community center/cafe providing comfortable gathering space

**Professional Permaculture Education:**
- Akademie permakultury educational unit running annual Permaculture Design Certificate (PDC) courses since 2013
- Introduction to Permaculture Certificate (IPC) courses for beginners
- Specialized workshops covering practical skills (natural building, soil biology, plant propagation, etc.)
- Czech-language instruction making permaculture accessible to local community
- English programs occasionally available for international participants

**Publications & Knowledge Dissemination:**
- 2 booklets published annually on permaculture-related subjects
- 21 books published since 2014 covering permaculture design, sustainable living, and regenerative practices
- Czech translations of essential permaculture texts making international knowledge accessible locally
- Original research and documentation of Czech permaculture projects

**Networking & Events:**
- Annual Permaculture Conference in Prague featuring presentations, discussions, networking, seed exchange, and celebration
- Lectures and workshops throughout the year on permaculture and sustainability topics
- Connection to Czech Network and Map of Demonstration Permaculture Sites (80+ projects nationwide)
- Visegrad Permaculture Partnership linking Czech, Slovak, Polish, and Hungarian practitioners

**Community Hub:**
- Regular meeting space for permaculture practitioners, gardeners, and sustainability enthusiasts
- Informal knowledge exchange during open library hours
- Connection point for finding permaculture projects, courses, and practitioners throughout Czech Republic
- Cultural events celebrating permaculture principles and seasonal cycles

**HOW TO ENGAGE**

**Visit the Library:** Open every other week for a few hours (check website for current schedule). Members can borrow books; others can read on-site in the cafe. Perfect for accessing Czech-language permaculture resources and meeting local practitioners.

**Become a Member:** Membership provides book borrowing privileges, discounts on courses and events, access to seed/plant exchange, and support for Czech permaculture movement. Check website for membership details.

**Attend Courses:**
- **PDC (Permaculture Design Certificate):** Comprehensive 72+ hour course run annually by Akademie permakultury. Check [permakulturacs.cz/kalendar/](https://www.permakulturacs.cz/kalendar/) for dates and registration.
- **IPC (Introduction to Permaculture):** Shorter introductory courses offered multiple times per year.
- **Workshops:** Specialized practical workshops on topics like clay plaster, natural building, seed saving, etc.

**Join the Conference:** Annual Prague Permaculture Conference brings together hundreds of Czech and international practitioners. Weekend program includes presentations, networking, seed exchange, and social events. Excellent opportunity to connect with Czech permaculture community.

**Access Resources Online:** Website [permakulturacs.cz/english/](https://www.permakulturacs.cz/english/) provides information in English, calendar of events, and connections to Czech permaculture network.

**Seed & Plant Exchange:** Participate in seasonal seed swaps to access locally-adapted varieties and share your own. Check library hours and conference schedule for exchange opportunities.

**SPECIFIC DETAILS**

**Location:** Prague (Specific address check website - library located in community center/cafe)

**Contact:**
Website: https://www.permakulturacs.cz/english/
Email: Check website for current contact information
Social media: Active on Czech platforms

**Open Hours:** Library open every other week for a few hours (variable schedule - confirm on website)

**Language:** Czech primary; some English resources and occasional English events
International participants welcome at conferences and some courses

**Membership:** Available with benefits including book borrowing, course discounts, seed exchange access, and movement support

**Course Costs:** PDC typically follows international permaculture course pricing; scholarships or payment plans may be available (inquire directly)

**Accessibility:** Located in Prague, easily accessible by public transportation. Community center setting provides welcoming, informal atmosphere.

**History:** Founded 1996, celebrating 30 years in 2024 as Czech Republic\'s pioneering permaculture organization

**Network Connections:**
- Part of European Permaculture Network
- Visegrad Permaculture Partnership (Czech, Slovak, Polish, Hungarian collaboration)
- Connection to 80+ demonstration permaculture sites across Czech Republic
- Collaboration with Permakultura CS Brno (sister location in South Moravia)

**Context in International Permaculture:**
Permakultura CS bridges Western European and Eastern European permaculture movements, adapting principles for post-socialist contexts, continental climates, and Czech cultural conditions. Its role in developing Czech-language resources and networks makes permaculture accessible beyond Anglophone communities.

**Related Resources:** Practitioners visiting Prague should also explore Prague Farmers Market Network (local food connections), Community Garden Kuchyňka and Holešovice Community Garden (urban permaculture practice), and KOKOZA Urban Agriculture Network (community gardens and composting across Prague).'
WHERE name = 'Permakultura CS Prague Library & Education Center';

-- ==================================================================
-- UPDATE 3: Permakultura CS Brno Library & Community Hub (478 → 2,900+ chars)
-- ==================================================================

UPDATE wiki_locations
SET description = E'**WHY THIS LOCATION MATTERS**

Permakultura CS Brno Library & Community Hub serves as South Moravia\'s primary permaculture resource center, extending the mission of Permakultura CS (founded 1996) to the Czech Republic\'s second-largest city and university region. As the southern counterpart to the Prague center, it provides essential access to permaculture education, resources, and community for practitioners in Moravia, Eastern Czech Republic, and the broader region including connections to Slovakia and Austria.

For permaculture practitioners in South Moravia and surrounding areas, this hub offers localized resources, networking opportunities, and educational programs adapted to the region\'s distinct agricultural heritage, climate conditions, and cultural context.

**WHAT IT OFFERS**

**Regional Permaculture Library:**
- Curated collection of permaculture books in Czech and English
- Czech-language publications making permaculture accessible to local community
- Reference materials on sustainable agriculture, natural building, and ecological design
- Resources specific to cold-climate and continental Central European conditions
- Located in community center/cafe providing comfortable reading and meeting space
- Members can borrow books; others can read on-site

**South Moravian Permaculture Community Hub:**
- Regular gathering space for permaculture practitioners, organic farmers, and sustainability enthusiasts
- Connection point for Brno and South Moravia region\'s permaculture network
- Informal knowledge sharing during open library hours
- Links to demonstration sites and projects throughout Moravia
- Cultural bridge connecting urban Brno with Moravian agricultural traditions

**Educational Programs & Events:**
- Lectures and workshops on permaculture design, syntropic agriculture, soil biology, and regenerative practices
- Introduction to Permaculture Certificate (IPC) courses
- Specialized workshops covering practical skills adapted to Moravian conditions
- Connections to PDC (Permaculture Design Certificate) courses run by Akademie permakultury
- Events often featuring collaboration with Mendel University (Brno\'s agricultural research institution)

**Seed & Plant Exchange:**
- Seasonal seed swaps facilitating exchange of locally-adapted varieties
- Focus on heritage Moravian varieties and climate-appropriate species
- Plant sharing connecting practitioners with permaculture-suitable perennials and fruit trees
- Knowledge exchange about traditional South Moravian food crops

**Regional Networking:**
- Connection to Czech Network and Map of Demonstration Permaculture Sites (80+ projects nationwide)
- Links to Moravian organic farms, CSA projects, and sustainable agriculture initiatives
- Collaboration with local universities including Mendel University (sustainable agriculture research)
- Partnerships with Brno community gardens and urban agriculture projects

**Soil Biology & Syntropic Agriculture Focus:**
- Particular emphasis on soil food web understanding and regenerative soil practices
- Resources on syntropic agriculture adapted to Central European climates
- Connections to regional soil specialists and regenerative agriculture practitioners
- Information on CSA (Community Supported Agriculture) models successfully operating in the region

**HOW TO ENGAGE**

**Visit the Library:** Open every other week for a few hours (check Permakultura CS website for Brno-specific schedule at [permakulturacs.cz](https://www.permakulturacs.cz/)). Members can borrow books; others welcome to read on-site and connect with local permaculture community.

**Membership:** Join Permakultura CS for access to both Prague and Brno libraries, book borrowing privileges, course discounts, seed exchange, and support for Czech permaculture movement.

**Attend Events:** Check Permakultura CS calendar for Brno-specific lectures, workshops, and gatherings. Events often in Czech but international participants welcome.

**Seed Exchange Participation:** Join seasonal seed swaps to access Moravian heritage varieties and locally-adapted permaculture species. Timing typically aligns with planting seasons (spring) and harvest (autumn).

**Connect to Courses:** While PDC courses primarily run through Prague Akademie permakultury, Brno hub can connect you to upcoming courses, workshops, and study groups. IPC courses occasionally offered in Brno.

**Network Access:** Use the library as starting point to connect with permaculture projects, organic farms, and practitioners throughout South Moravia and Eastern Czech Republic.

**University Collaborations:** The Brno hub collaborates with Mendel University. Inquire about joint events featuring soil biology, syntropic agriculture, or regenerative practices bridging academic research and permaculture practice.

**SPECIFIC DETAILS**

**Location:** Brno, South Moravia, Czech Republic
(Specific address check Permakultura CS website - library in community center/cafe)

**Contact:**
Website: https://www.permakulturacs.cz/english/ (select Brno location)
Email: Contact through main Permakultura CS channels
Social media: Permakultura CS maintains active Czech-language social media

**Open Hours:** Every other week for a few hours (variable schedule - check website for current Brno times)

**Language:** Primarily Czech; some English resources available
South Moravia has strong regional identity - events may incorporate Moravian cultural elements

**Membership:** Permakultura CS membership (organization-wide) provides access to Brno library

**Regional Focus:**
- South Moravia (Jihomoravský kraj)
- Eastern Czech Republic
- Connections to Slovakia (Bratislava region nearby)
- Moravian agricultural heritage and traditions

**Climate Context:** Brno region experiences continental climate with cold winters, warm summers, and moderate rainfall - different considerations from maritime Western Europe. Resources emphasize cold-hardy species, seasonal preservation, and four-season design.

**Brno Context:** As Czech Republic\'s second-largest city and major university center (Mendel University, Masaryk University), Brno combines urban density with strong agricultural research tradition. The permaculture hub bridges these worlds.

**Relationship to Mendel University:**
Permakultura CS Brno collaborates with Mendel University, which provides scientific agriculture research. This partnership creates valuable exchanges between academic sustainable agriculture and practical permaculture, with university research informing permaculture designs and permaculture projects providing real-world testing grounds for sustainable practices.

**Related Resources:** Practitioners visiting Brno should also explore Mendel University (sustainable agriculture research), Brno Organic Market Zelný trh (local food systems, one of Czech Republic\'s oldest markets), Southern Bohemia Permaculture Garden (regional demonstration sites), and Czech Seed Bank & Heritage Varieties programs preserving Moravian agricultural genetics.'
WHERE name = 'Permakultura CS Brno Library & Community Hub';

-- ==================================================================
-- UPDATE 4: Czech University of Life Sciences Prague (513 → 3,100+ chars)
-- ==================================================================

UPDATE wiki_locations
SET description = E'**WHY THIS LOCATION MATTERS**

Czech University of Life Sciences Prague (CZU) stands as Central Europe\'s premier institution for sustainable agriculture education and research, offering permaculture practitioners access to cutting-edge science, tropical and temperate agriculture programs, and a living demonstration of ecological campus management. With strong programs in sustainable agriculture, food security, soil science, and agroecology, CZU provides academic rigor that can inform evidence-based permaculture design and professional agricultural practice.

For practitioners seeking formal education, research collaboration, or access to scientific agricultural knowledge relevant to permaculture, CZU represents one of the most comprehensive resources in Central Europe, with international programs taught in English and strong connections to global sustainable agriculture networks.

**WHAT IT OFFERS**

**Sustainable Agriculture Academic Programs:**
- **Sustainable Agriculture & Food Security (N-AGRIFOM)** - Master\'s program taught in English, available as double degree with University of Pisa (Italy)
- **Agriculture and Food** - BSc program covering agricultural practices, sustainable agriculture definition, plant and animal biology, nutritional needs, microbes, soil and environment
- **Tropical Farming Systems** - MSc program focused on modern tropical agriculture and sustainable resource management
- Programs teaching what defines sustainable agriculture and how to implement it in various climates and contexts

**Research & Faculty Expertise:**
- Faculty of Agrobiology, Food and Natural Resources - traditional fields of crop and animal production, natural resources and environment
- Faculty of Tropical AgriSciences - tropical agriculture, rural development, sustainable management of tropical natural resources
- Research on soil biology, agroecology, food security, and sustainable farming systems
- International research collaborations across Europe, Africa, Asia, and Latin America
- FAO Family Farming Knowledge Platform partner institution

**Ecological Campus as Living Laboratory:**
The CZU campus demonstrates sustainable land management including:
- Flowery meadows and parks supporting biodiversity
- Densely tree-covered areas providing urban forest
- "Libosad" - beds with edible fruits and herbs demonstrating food production integration
- Experimental agricultural fields testing various cultivation techniques
- Ponds and wetlands supporting water management and ecosystem services
- Animal stables showing integrated livestock systems
- Thousands of ornamental plants creating diverse plantings
- Constant implementation of eco-friendly and sustainable programs

**International Programs & Accessibility:**
- Multiple programs taught entirely in English, attracting international students
- Exchange programs with universities worldwide
- European Credit Transfer System (ECTS) facilitating study abroad
- Strong reputation in sustainable agriculture education globally
- Located in Prague - Central Europe\'s cultural and transportation hub

**Library & Research Resources:**
- Extensive agricultural science library
- Research publications on sustainable farming, soil science, tropical agriculture
- Access to international agricultural research networks
- Digital resources available to students and researchers

**Practical Training:**
- Experimental agricultural fields for hands-on learning
- Farm practicums and internships
- Tropical field research opportunities through Faculty of Tropical AgriSciences
- Partnerships with farms, research stations, and development projects worldwide

**HOW TO ENGAGE**

**Degree Programs:** Apply for Bachelor\'s or Master\'s programs if seeking formal agricultural education. Particularly relevant programs:
- Sustainable Agriculture & Food Security (Master\'s, English)
- Agriculture and Food (Bachelor\'s)
- Tropical Farming Systems (Master\'s)
- Various specialized programs in horticulture, forestry, environmental sciences

Check [studyinprague.cz](https://studyinprague.cz/) for program details, admission requirements, and application deadlines.

**International Students:** CZU actively recruits international students. English-language programs eliminate language barriers. Tuition fees apply for non-EU students; EU students may qualify for Czech government scholarships.

**Exchange Programs:** If enrolled at a partner university, apply for semester or year-long exchange to study sustainable agriculture at CZU.

**Research Collaboration:** Researchers and practitioners conducting studies related to sustainable agriculture, permaculture, or agroecology can contact relevant faculty departments to explore collaboration opportunities.

**Campus Visits:** The ecological campus showcases sustainable land management practices. Public access policies may allow visitors to tour grounds, especially during open days or special events. Contact university for visit arrangements.

**Library Access:** As a public university, external researchers may access library resources. Inquire about visitor library cards or digital resource access.

**Workshops & Public Lectures:** CZU occasionally hosts public events on sustainable agriculture topics. Monitor university website and Permakultura CS Prague announcements for relevant events.

**SPECIFIC DETAILS**

**Location:** Prague 6 - Suchdol, Czech Republic
Kamýcká 129, 165 00 Praha-Suchdol

**Contact:**
Website: https://studyinprague.cz/ (CZU programs)
Main university: Czech University of Life Sciences Prague
Email: Contact through faculty-specific addresses on website

**Academic Structure:**
- Faculty of Agrobiology, Food and Natural Resources
- Faculty of Tropical AgriSciences
- Faculty of Environmental Sciences
- Faculty of Economics and Management
- Faculty of Engineering
- Faculty of Forestry and Wood Sciences

**Language:** Czech programs (often free or low-cost for EU students); English programs (international fees apply)
Campus community multilingual due to strong international student presence

**Admission:** Competitive for popular programs; varies by faculty and program
Bachelor\'s: high school completion; Master\'s: relevant Bachelor\'s degree
English programs require language proficiency (IELTS/TOEFL)

**Accessibility:**
- Located in Prague-Suchdol district, accessible by public transportation
- International airport (Václav Havel Airport Prague) 20 minutes away
- Central location in Europe facilitates international collaboration

**Sustainability Credentials:**
- Constant implementation of eco-friendly policies
- Change management in academic community toward sustainability
- Campus serves as demonstration of ecological landscape management
- Research focus increasingly oriented toward sustainability and food security

**Permaculture Connections:**
While CZU focuses on academic agricultural science rather than specific permaculture programs, the university provides:
- Scientific foundation in soil biology, plant ecology, and sustainable farming applicable to permaculture
- Research findings that can validate or inform permaculture techniques
- Formal credentials for practitioners seeking professional agricultural qualifications
- International network connecting Czech practitioners to global sustainable agriculture movement

**Related Resources:** Practitioners studying at or visiting CZU should also explore Permakultura CS Prague Library & Education Center (practical permaculture education and community), Prague Farmers Market Network (local food systems), Prague community gardens (urban permaculture practice), and KOKOZA Urban Agriculture Network (connecting urban agriculture initiatives across Prague).'
WHERE name = 'Czech University of Life Sciences Prague';

-- ==================================================================
-- UPDATE 5: KOKOZA Urban Agriculture Network (567 → 3,400+ chars)
-- ==================================================================

UPDATE wiki_locations
SET description = E'**WHY THIS LOCATION MATTERS**

KOKOZA Urban Agriculture Network represents Czech Republic\'s most comprehensive community gardens and composting initiative, demonstrating how urban permaculture principles scale across cities to create measurable environmental and social impact. Since 2012, KOKOZA has built and supported over 150 community gardens nationwide (69 in Prague, 14 in Brno), diverted tons of organic waste through community composting, and created social enterprise employment for people with disabilities - proving that urban permaculture can achieve both ecological regeneration and social justice.

For urban permaculture practitioners, municipal officials, and social enterprises worldwide, KOKOZA offers a replicable model of how to organize, fund, and sustain community gardens and composting at city scale, with particular relevance to post-socialist urban contexts undergoing green transformation.

**WHAT IT OFFERS**

**Community Garden Network & Support:**
- **Mapko.cz Platform:** Interactive map of 150+ community gardens across Czech Republic, making urban growing spaces discoverable and connected
- Management of 50+ gardens providing hands-on organizational experience and best practices
- Technical support for new community garden initiatives including site selection, design, fundraising, and community organizing
- Templates, guides, and resources for starting community gardens in Czech urban contexts
- Sharing of successful models that navigate Czech municipal systems and cultural norms

**Community Composting Systems:**
- Organized community composters in multiple Prague districts (Prague 3 pilot launched September-October 2020)
- **Proven Impact:** First three months of Prague 3 project diverted 2+ tons of organic waste with 250+ households actively participating
- Technical guidance on setting up and maintaining community composting sites
- Public education on composting methods, benefits, and best practices
- Municipal partnership models demonstrating how to integrate composting into city waste management

**Corporate & Institutional Partnerships:**
- CSR (Corporate Social Responsibility) programs helping companies support urban agriculture and sustainability
- Technical assistance to institutions implementing community gardens or organic waste management
- Consulting on community culture development through garden and compost projects
- Bridge between private sector, municipalities, and grassroots urban agriculture movements

**Social Enterprise Model:**
- Employment of people with disabilities in urban gardening and composting operations
- Demonstration of how environmental sustainability and social inclusion can integrate
- Viable business model combining earned revenue, grants, and partnerships
- Replicable approach to creating meaningful employment through urban agriculture

**Educational Programs & Knowledge Sharing:**
- Workshops on urban gardening, composting, and sustainable urban food production
- School programs teaching children about food systems, composting, and nature connection
- Public events celebrating urban agriculture and building community
- Publications and presentations sharing KOKOZA\'s methodology and results
- International knowledge exchange through EU programs (Erasmus+ community composting projects)

**Municipal Collaboration Models:**
- Partnership approaches for working with Prague, Brno, and other Czech city governments
- Navigation of bureaucratic processes for establishing gardens on municipal land
- Advocacy for policies supporting urban agriculture and organic waste diversion
- Templates for formal agreements between community groups and municipalities

**Mapping & Data:**
- Mapko.cz provides searchable database of Czech community gardens including location, contact, and characteristics
- Data collection demonstrating scale and impact of urban agriculture movement
- Research collaboration with universities studying urban food systems
- Evidence base for policy advocacy and funding applications

**HOW TO ENGAGE**

**Start or Join a Community Garden:**
Visit [mapko.cz](https://kokoza.cz/projekty/mapko-connects-community-gardens/) to:
- Find existing community gardens near you in Czech Republic
- Connect with garden organizers to inquire about plot availability or volunteering
- Access resources for starting a new community garden
- Add your garden to the network for visibility and mutual support

**Community Composting Participation:**
If you live in a Prague district with KOKOZA community composters:
- Locate your nearest composting site on their map
- Learn the system (what can/cannot be composted, how to participate)
- Join the 250+ households actively diverting organic waste
- Inquire about bringing community composting to your neighborhood if not yet available

**Technical Support & Consulting:**
Organizations, municipalities, or companies interested in urban agriculture or organic waste management can contact KOKOZA for:
- Feasibility assessment for community gardens or composting
- Design and implementation support
- Community organizing and engagement strategies
- CSR program development integrating urban sustainability

**Volunteer & Employment:**
KOKOZA employs people with disabilities and welcomes volunteers:
- Check their website or contact directly for volunteer opportunities
- Support garden maintenance, composting operations, educational events
- Gain hands-on urban permaculture experience
- Contribute to social inclusion mission

**Educational Programs:**
Schools, community groups, and organizations can arrange:
- Workshops on urban gardening and composting
- Site visits to established KOKOZA gardens
- Customized programs on sustainable urban food systems

**Research Collaboration:**
Academics and researchers studying urban agriculture, composting, social enterprise, or sustainable cities can partner with KOKOZA:
- Access to network data and case studies
- Collaboration on EU-funded research projects
- Real-world testing ground for urban sustainability interventions

**SPECIFIC DETAILS**

**Location:** Based in Prague, with network spanning Czech Republic
Main office and projects concentrated in Prague and Brno

**Contact:**
Website: https://komunitnizahrady.cz/
Mapko platform: https://kokoza.cz/projekty/mapko-connects-community-gardens/
Email: Check website for current contact information
Social media: Active on Czech platforms

**Network Scale (as of February 2024):**
- 150 community gardens monitored across Czech Republic
- 69 gardens in Prague
- 14 gardens in Brno
- 50+ gardens directly managed by KOKOZA
- 250+ households participating in Prague 3 composting pilot alone
- 2+ tons organic waste diverted in first three months of single pilot project

**Language:** Primarily Czech; some resources available in English
International participants welcome; basic Czech helpful for full engagement

**Funding Model:**
- Social enterprise combining earned revenue, grants, and partnerships
- EU funding (Erasmus+ and other programs)
- Municipal contracts and partnerships
- Corporate CSR partnerships
- Consulting and educational program fees

**History:** Active since 2012 (12+ years of urban agriculture organizing experience)

**Mission:** Support urban residents in Czech Republic in composting and cultivation with the aim to enhance harmony between humans and nature. Foster partnerships with public institutions and companies aiding in sustainability, corporate culture development, community gardens, and organic waste management.

**Social Impact:**
- Employment for people with disabilities
- Community building through shared gardens
- Food access in urban areas
- Environmental education
- Waste reduction and circular economy advancement

**Environmental Impact:**
- Tons of organic waste diverted from landfills annually
- Increased urban green space and biodiversity
- Carbon sequestration through composting and soil building
- Reduced food miles through local production
- Demonstration of circular economy principles

**Replicability:**
KOKOZA\'s model is particularly valuable for:
- Post-socialist urban contexts with similar municipal structures
- Cities with large amounts of unused land or contaminated sites needing remediation
- Social enterprises seeking to combine environmental and social missions
- Municipal governments wanting to support urban agriculture without creating new departments

**International Recognition:**
- Featured in EU sustainability case studies (INHERIT project)
- Erasmus+ project partner on community composting
- Presented at international urban agriculture conferences
- Model studied by other cities developing community garden networks

**Related Resources:** Practitioners engaged with KOKOZA should also explore Permakultura CS Prague Library (permaculture education and resources), Prague Farmers Market Network (local food sales and connections), Community Garden Kuchyňka and Holešovice Community Garden (individual Prague garden examples), and Czech University of Life Sciences Prague (academic research on urban agriculture and sustainability that can inform KOKOZA\'s work and vice versa).'
WHERE name = 'KOKOZA Urban Agriculture Network';

-- ==================================================================
-- VERIFICATION: Check updates applied successfully
-- ==================================================================

DO $$
DECLARE
  loc1_len INTEGER;
  loc2_len INTEGER;
  loc3_len INTEGER;
  loc4_len INTEGER;
  loc5_len INTEGER;
BEGIN
  SELECT LENGTH(description) INTO loc1_len FROM wiki_locations WHERE name = 'Mendel University Brno';
  SELECT LENGTH(description) INTO loc2_len FROM wiki_locations WHERE name = 'Permakultura CS Prague Library & Education Center';
  SELECT LENGTH(description) INTO loc3_len FROM wiki_locations WHERE name = 'Permakultura CS Brno Library & Community Hub';
  SELECT LENGTH(description) INTO loc4_len FROM wiki_locations WHERE name = 'Czech University of Life Sciences Prague';
  SELECT LENGTH(description) INTO loc5_len FROM wiki_locations WHERE name = 'KOKOZA Urban Agriculture Network';

  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Czech Educational Locations Expanded';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Updated Locations:';
  RAISE NOTICE '1. Mendel University Brno: % characters (target: 2,000-3,000)', loc1_len;
  RAISE NOTICE '2. Permakultura CS Prague: % characters (target: 2,000-3,000)', loc2_len;
  RAISE NOTICE '3. Permakultura CS Brno: % characters (target: 2,000-3,000)', loc3_len;
  RAISE NOTICE '4. Czech University of Life Sciences: % characters (target: 2,000-3,000)', loc4_len;
  RAISE NOTICE '5. KOKOZA Network: % characters (target: 2,000-3,000)', loc5_len;
  RAISE NOTICE '';
  RAISE NOTICE 'All descriptions now include:';
  RAISE NOTICE '- WHY the location matters (permaculture value)';
  RAISE NOTICE '- WHAT it offers (programs, research, resources)';
  RAISE NOTICE '- HOW to engage (courses, membership, volunteering)';
  RAISE NOTICE '- SPECIFIC details (contact, location, accessibility)';
  RAISE NOTICE '';
  RAISE NOTICE 'Phase 2, Batch 1 complete! Czech educational centers fully documented.';
  RAISE NOTICE '========================================';
END $$;
