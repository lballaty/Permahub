# Wiki Content Creation Guide for Permahub

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/WIKI_CONTENT_CREATION_GUIDE.md

**Description:** Comprehensive guide and templates for creating guides, events, and locations for the Permahub community wiki

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-14

**Intended Audience:** Human contributors and LLM agents creating structured content for the wiki database

---

## Table of Contents

1. [Overview](#overview)
2. [Database Schema Reference](#database-schema-reference)
3. [Available Categories](#available-categories)
4. [Creating Guides](#creating-guides)
5. [Creating Events](#creating-events)
6. [Creating Locations](#creating-locations)
7. [Quality Standards](#quality-standards)
8. [Examples by Category](#examples-by-category)

---

## Overview

The Permahub wiki consists of three primary content types:

1. **Guides** - Educational articles, how-tos, and knowledge resources
2. **Events** - Workshops, meetups, tours, courses, and community gatherings
3. **Locations** - Physical places (farms, gardens, businesses, education centers, communities)

All content must be:
- **Accurate** - Based on verified information or clearly marked as theoretical
- **Structured** - Following the templates exactly
- **Complete** - All required fields filled in
- **Relevant** - Aligned with permaculture, sustainable living, and regenerative practices
- **Geocoded** - Accurate latitude/longitude coordinates

---

## Important: Multilingual Support

**The wiki has full multilingual support!** All content can be translated into multiple languages.

### Translation Tables

- **wiki_guide_translations** - Translated guide content (title, summary, content)
- **wiki_event_translations** - Translated event details (title, description)
- **wiki_location_translations** - Translated location info (name, description)
- **wiki_category_translations** - Translated category names (name, description)

### Supported Languages

The system supports any language code (ISO 639-1), including:
- `en` - English (default/fallback)
- `pt` - Portuguese
- `es` - Spanish
- `fr` - French
- `de` - German
- `it` - Italian
- `nl` - Dutch
- `pl` - Polish
- `ja` - Japanese
- `zh` - Chinese
- `ko` - Korean
- `cs` - Czech

### How Translations Work

1. **Primary Content:** Stored in main tables (wiki_guides, wiki_events, wiki_locations)
2. **Translations:** Stored in translation tables with language_code
3. **Fallback:** If requested language not available, falls back to English, then primary content
4. **Helper Function:** `get_guide_with_translation(guide_id, language_code)` automatically handles fallback

### Adding Translations (Optional)

After creating primary content, you can add translations:

```sql
-- Translate a guide to Portuguese
INSERT INTO wiki_guide_translations (guide_id, language_code, title, summary, content)
VALUES (
  '[guide-uuid]',
  'pt',
  '[Título em Português]',
  '[Resumo em português]',
  '[Conteúdo completo em português]'
);

-- Translate a location to Czech
INSERT INTO wiki_location_translations (location_id, language_code, name, description)
VALUES (
  '[location-uuid]',
  'cs',
  '[Název v češtině]',
  '[Popis v češtině]'
);
```

**Note:** For this guide, focus on creating English content. Translations can be added later.

---

## Database Schema Reference

### wiki_guides Table

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | TEXT | Yes | Clear, descriptive title (50-100 chars) |
| slug | TEXT | Yes | URL-friendly identifier (lowercase, hyphens, unique) |
| summary | TEXT | Yes | 1-2 sentence overview (150-250 chars) |
| content | TEXT | Yes | Full markdown content (see structure below) |
| featured_image | TEXT | No | URL to header image |
| author_id | UUID | No | Reference to auth.users (set by system) |
| status | TEXT | Yes | 'draft' or 'published' or 'archived' |
| view_count | INTEGER | Auto | Starts at 0 |
| allow_comments | BOOLEAN | Default true | Enable comments |
| allow_edits | BOOLEAN | Default true | Enable community edits |
| notify_group | BOOLEAN | Default false | Notify community of new guide |
| published_at | TIMESTAMPTZ | Auto | Set when status = 'published' |

**Categories:** Guides can have multiple categories via wiki_guide_categories junction table

### wiki_events Table

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | TEXT | Yes | Event name (30-80 chars) |
| slug | TEXT | Yes | URL-friendly identifier (unique) |
| description | TEXT | Yes | Full event description (300-1000 chars) |
| event_date | DATE | Yes | Date in YYYY-MM-DD format |
| start_time | TIME | No | Start time (HH:MM:SS) |
| end_time | TIME | No | End time (HH:MM:SS) |
| location_name | TEXT | No | Venue or location name |
| location_address | TEXT | No | Full physical address |
| latitude | DOUBLE PRECISION | No | Decimal degrees (e.g., 50.0755) |
| longitude | DOUBLE PRECISION | No | Decimal degrees (e.g., 14.4378) |
| event_type | TEXT | No | 'workshop', 'meetup', 'tour', 'course', 'workday' |
| price | NUMERIC(10,2) | Default 0 | Price in currency (0.00 for free) |
| price_display | TEXT | No | Human-readable price (e.g., "Free", "€35", "$20") |
| registration_url | TEXT | No | Link to registration page |
| max_attendees | INTEGER | No | Maximum capacity |
| current_attendees | INTEGER | Default 0 | Current number registered |
| is_recurring | BOOLEAN | Default false | Is this a recurring event? |
| recurrence_rule | TEXT | No | RRULE format for recurring events |
| featured_image | TEXT | No | URL to event image |
| author_id | UUID | No | Reference to auth.users (set by system) |
| status | TEXT | Default 'published' | 'draft', 'published', 'cancelled', 'completed' |
| created_at | TIMESTAMPTZ | Auto | Timestamp of creation |
| updated_at | TIMESTAMPTZ | Auto | Timestamp of last update |

### wiki_locations Table

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | TEXT | Yes | Location name (30-100 chars) |
| slug | TEXT | Yes | URL-friendly identifier (unique) |
| description | TEXT | Yes | Full description (400-1500 chars) |
| address | TEXT | No | Complete physical address |
| latitude | DOUBLE PRECISION | Yes | Decimal degrees (required) |
| longitude | DOUBLE PRECISION | Yes | Decimal degrees (required) |
| location_type | TEXT | No | 'farm', 'garden', 'education', 'community', 'business' |
| website | TEXT | No | Official website URL |
| contact_email | TEXT | No | Public contact email |
| contact_phone | TEXT | No | Public phone number |
| featured_image | TEXT | No | URL to location image |
| opening_hours | JSONB | No | Structured hours (see format below) |
| tags | TEXT[] | No | Array of relevant tags (5-15 tags) |
| author_id | UUID | No | Reference to auth.users (set by system) |
| status | TEXT | Yes | 'draft', 'published', 'archived' (default: 'published') |
| created_at | TIMESTAMPTZ | Auto | Timestamp of creation |
| updated_at | TIMESTAMPTZ | Auto | Timestamp of last update |

**IMPORTANT NOTES:**
- **NO PostGIS:** Supabase does not support PostGIS extension
- **Distance Calculations:** Use application-level Haversine formula
- **Indexes:** Standard B-tree index on (latitude, longitude) for filtering

**Opening Hours Format:**
```json
{
  "monday": "9:00-17:00",
  "tuesday": "9:00-17:00",
  "wednesday": "9:00-17:00",
  "thursday": "9:00-17:00",
  "friday": "9:00-17:00",
  "saturday": "10:00-14:00",
  "sunday": "closed"
}
```

---

## Available Categories

### Foundational Permaculture Categories

- **Permaculture Design** (🌍) - Design principles, ethics, and patterns
- **Gardening** (🌱) - Vegetable gardens, flowers, and plant care
- **Water Management** (💧) - Swales, ponds, irrigation, rainwater harvesting
- **Composting** (♻️) - Hot composting, vermicomposting, waste management
- **Renewable Energy** (☀️) - Solar, wind, and sustainable energy
- **Food Production** (🥕) - Growing food and sustainable agriculture
- **Food Forests** (🌳) - Forest gardens and agroforestry

### Animal Husbandry & Livestock

- **Animal Husbandry** (🐓) - Chickens, bees, rabbits, small livestock
- **Beekeeping** (🐝) - Apiculture, hive management, honey production
- **Poultry Keeping** (🐔) - Raising chickens, ducks, other fowl

### Food Preservation & Storage

- **Food Preservation** (🫙) - Canning, fermentation, drying, storage
- **Fermentation** (🥒) - Lacto-fermentation, kombucha, cultured foods
- **Root Cellaring** (🥔) - Cold storage, traditional preservation

### Mycology & Mushrooms

- **Mycology** (🍄) - Mushroom cultivation, identification, uses
- **Mushroom Cultivation** (🪵) - Growing edible and medicinal mushrooms
- **Mycoremediation** (🦠) - Using fungi for ecological restoration

### Indigenous & Traditional Knowledge

- **Indigenous Knowledge** (🪶) - Traditional ecological knowledge
- **Ethnobotany** (🌿) - Traditional plant uses, cultural practices
- **Bioregionalism** (🗺️) - Place-based ecological wisdom

### Fiber Arts & Textiles

- **Fiber Arts** (🧶) - Natural fibers, spinning, weaving, textiles
- **Natural Dyeing** (🎨) - Plant-based dyes, fabric coloring
- **Textile Production** (🧵) - Growing and processing fiber plants

### Appropriate Technology

- **Appropriate Technology** (⚙️) - Low-tech solutions, DIY equipment
- **Solar Technology** (☀️) - Solar panels, cookers, passive systems
- **Bicycle Power** (🚴) - Pedal-powered machines and tools

### Herbal Medicine

- **Herbal Medicine** (🌿) - Medicinal plants, natural healing
- **Plant Medicine Making** (⚗️) - Tinctures, salves, herbal preparations
- **Medicinal Gardens** (🏥) - Growing and harvesting healing plants

### Soil Science & Regeneration

- **Soil Science** (🔬) - Soil biology, testing, improvement
- **Regenerative Agriculture** (🌾) - Building soil health, carbon sequestration
- **Cover Cropping** (🌱) - Nitrogen fixation, soil protection

### Foraging & Wildcrafting

- **Foraging** (🫐) - Wild food identification and harvesting
- **Wild Edibles** (🌰) - Identifying and using wild foods
- **Ethical Wildcrafting** (🌺) - Sustainable wild harvesting

### Aquaculture & Water Systems

- **Aquaculture** (🐟) - Fish farming, water-based food systems
- **Aquaponics** (🐠) - Integrated fish and plant production
- **Pond Management** (🏞️) - Natural swimming pools, wildlife ponds

### Ecosystem Restoration

- **Bioremediation** (🌍) - Ecological cleanup and restoration
- **Erosion Control** (⛰️) - Slope stabilization, land repair
- **Pollinator Support** (🦋) - Creating habitat for beneficial insects

### Community & Social Systems

- **Social Permaculture** (🤝) - Community organizing, social design
- **Ecovillage Design** (🏘️) - Sustainable community planning
- **Consensus Decision Making** (🗳️) - Collaborative governance

### Alternative Economics

- **Alternative Economics** (💱) - Gift economy, timebanking, local currencies
- **Time Banking** (⏰) - Hour-based exchange systems
- **Gift Economy** (🎁) - Sharing and reciprocity systems

### Climate Resilience

- **Climate Adaptation** (🌡️) - Preparing for climate change impacts
- **Drought Strategies** (🌵) - Water-wise gardening, dry farming
- **Fire-Smart Landscaping** (🔥) - Fire prevention, resistant design

### Family & Education

- **Children's Gardens** (👶) - Garden education for kids and families
- **Nature Education** (🔍) - Teaching ecology and natural systems
- **Family Homesteading** (👨‍👩‍👧‍👦) - Homesteading with children

### Climate-Specific Categories

- **Subtropical Gardening** (🌺) - Subtropical and tropical plants
- **Cold Climate** (❄️) - Cold-climate permaculture strategies

---

## Creating Guides

### Guide Content Structure

All guides should follow this markdown structure:

```markdown
# [Guide Title]

## Introduction

[2-3 paragraphs introducing the topic, its importance, and what readers will learn]

**Key Benefits:**
- Benefit 1
- Benefit 2
- Benefit 3
- Benefit 4

## Section 1: [Core Concept]

### Subsection 1.1

[Detailed content with specific information]

**Important Points:**
- Point 1
- Point 2
- Point 3

### Subsection 1.2

[More detailed content]

## Section 2: [Practical Application]

### Step-by-Step Instructions

1. First step with specific details
2. Second step with measurements/timing
3. Third step with troubleshooting notes
4. Fourth step with expected outcomes

## Section 3: [Common Challenges]

### Challenge 1: [Problem Name]

**Symptoms:**
- Observable sign 1
- Observable sign 2

**Solutions:**
- Solution approach 1
- Solution approach 2

### Challenge 2: [Problem Name]

[Similar structure]

## Section 4: [Advanced Topics]

[More advanced information for experienced practitioners]

## Resources & Further Learning

**Recommended Reading:**
- Resource 1
- Resource 2

**Tools & Supplies:**
- Item 1 - Where to find
- Item 2 - Where to find

**Related Guides:**
- [Link to related guide 1]
- [Link to related guide 2]

## Conclusion

[2-3 paragraphs summarizing key takeaways and encouraging next steps]
```

### Guide Template (SQL Insert Format)

```sql
INSERT INTO wiki_guides (
  title, slug, summary, content, status, view_count, published_at
) VALUES (
  '[Guide Title - 50-100 characters]',
  '[url-friendly-slug]',
  '[Clear 1-2 sentence summary explaining what readers will learn - 150-250 characters]',
  E'[Full markdown content following structure above - use E'' for PostgreSQL extended string with escaped quotes]',
  'published',
  0,
  NOW()
);

-- NOTE: author_id is NOT included - it will be NULL for seed/system content
-- When users create guides through the UI, author_id is set automatically via RLS policies

-- Link to categories
DO $$
DECLARE
  guide_id UUID;
  cat_ids UUID[];
  cat_id UUID;
BEGIN
  SELECT id INTO guide_id FROM wiki_guides WHERE slug = '[url-friendly-slug]';
  SELECT ARRAY_AGG(id) INTO cat_ids FROM wiki_categories WHERE slug IN ('[category-slug-1]', '[category-slug-2]', '[category-slug-3]');

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
```

### Guide Quality Checklist

- [ ] Title is clear, specific, and 50-100 characters
- [ ] Slug is lowercase, hyphen-separated, unique
- [ ] Summary is 1-2 sentences, 150-250 characters
- [ ] Content follows markdown structure template
- [ ] Introduction clearly states what readers will learn
- [ ] Sections are logically organized
- [ ] Practical steps include specific measurements, timing, quantities
- [ ] Common problems addressed with solutions
- [ ] Resources section includes relevant links
- [ ] Conclusion summarizes and encourages action
- [ ] Content is 1500-5000 words (minimum 1000)
- [ ] Linked to 2-4 relevant categories
- [ ] All facts verified or clearly marked as suggestions
- [ ] No harmful or dangerous practices without appropriate warnings

---

## Creating Events

### Event Types

**workshop** - Hands-on learning session (2-8 hours)
- Focus: Skill development, practical techniques
- Typical duration: Half-day or full-day
- Includes: Materials, instruction, hands-on practice

**meetup** - Community gathering or networking event
- Focus: Connection, sharing, celebration
- Typical duration: 2-6 hours
- Includes: Social time, potluck, sharing circle

**tour** - Guided visit to location(s)
- Focus: Observation, inspiration, questions
- Typical duration: 2-4 hours
- Includes: Walking tour, explanations, Q&A

**course** - Multi-day intensive education
- Focus: Comprehensive learning, certification
- Typical duration: 2-14 days
- Includes: Curriculum, materials, often meals/accommodation

**workday** - Community work party
- Focus: Accomplish physical tasks together
- Typical duration: 4-8 hours
- Includes: Work projects, often shared meal

### Event Template (SQL Insert Format)

```sql
INSERT INTO wiki_events (
  title, slug, description, event_date, start_time, end_time,
  location_name, location_address, latitude, longitude,
  event_type, price, price_display, registration_url, max_attendees, status
) VALUES (
  '[Event Title - 30-80 characters]',
  '[event-slug-with-date-yyyy-mm]',
  '[Full event description 300-1000 characters including: what participants will do, what they will learn, what is included, who should attend, what to bring]',
  'YYYY-MM-DD',
  'HH:MM:SS',
  'HH:MM:SS',
  '[Venue or Location Name]',
  '[Complete Address with City, Region, Country]',
  [latitude as decimal],
  [longitude as decimal],
  '[workshop|meetup|tour|course|workday]',
  [price as decimal, 0.00 for free],
  '[Human-readable price: "Free", "€35", "$20", "€180 (3 days)", etc.]',
  '[URL to registration page or NULL]',
  [maximum number of attendees or NULL],
  'published'
);
```

### Event Description Structure

```
[Opening sentence describing the event and its main focus]

[2-3 sentences detailing what participants will do/learn/experience]

**What's Included:**
- Item 1 (materials, meals, etc.)
- Item 2
- Item 3

**Who Should Attend:**
- Target audience description
- Skill level required
- Any prerequisites

**What to Bring:**
- Item 1
- Item 2
- Item 3

[Closing sentence with registration or attendance information]
```

### Event Quality Checklist

- [ ] Title is clear and engaging (30-80 characters)
- [ ] Slug includes event name and date (yyyy-mm format)
- [ ] Description is comprehensive (300-1000 characters)
- [ ] Description clearly states what participants will do/learn
- [ ] What's included is listed
- [ ] Target audience identified
- [ ] Date in future (or marked as example)
- [ ] Start/end times in 24-hour format
- [ ] Location name is accurate
- [ ] Full address provided
- [ ] Coordinates verified with Google Maps or similar
- [ ] Event type matches actual format
- [ ] Price is accurate and matches price_display
- [ ] Registration URL works (if provided)
- [ ] Max attendees realistic for venue
- [ ] Status is 'published' for active events

---

## Creating Locations

### Location Types

**farm** - Working farm or ranch
- Characteristics: Production-focused, may have animals, crops
- Examples: Permaculture farms, regenerative ranches, CSA farms

**garden** - Community or demonstration garden
- Characteristics: Educational, communal, smaller scale
- Examples: Community gardens, demonstration sites, urban plots

**education** - Learning center or institution
- Characteristics: Teaching-focused, workshops, courses
- Examples: Permaculture centers, universities, libraries

**community** - Intentional community or ecovillage
- Characteristics: Residential, shared values, cooperative
- Examples: Ecovillages, cohousing, intentional communities

**business** - Commercial enterprise with sustainable focus
- Characteristics: Products/services for sale, open to public
- Examples: Organic markets, nurseries, seed banks

### Location Description Structure

```
[Opening sentence stating what this location is and its primary purpose]

[2-4 sentences describing key features, practices, or offerings]

**Key Features:**
- Feature 1 with specific details
- Feature 2 with specific details
- Feature 3 with specific details

[1-2 sentences about educational opportunities, volunteer programs, or visitor access]

[1-2 sentences about the location's impact, achievements, or significance]
```

### Tag Guidelines

Choose 5-15 tags that accurately describe:
- Primary activities (e.g., 'organic-farming', 'food-forest', 'volunteers')
- Techniques used (e.g., 'natural-building', 'water-harvesting', 'composting')
- Special features (e.g., 'eco-village', 'seed-bank', 'csa')
- Climate/ecosystem (e.g., 'subtropical', 'cold-climate', 'mountain')
- Certification/status (e.g., 'organic-certified', 'unesco-heritage')

**Tag Format:**
- Lowercase
- Hyphen-separated
- Descriptive and searchable
- Commonly used terms

### Location Template (SQL Insert Format)

```sql
INSERT INTO wiki_locations (
  name, slug, description, address, latitude, longitude,
  location_type, website, contact_email, tags, status
) VALUES (
  '[Location Name - 30-100 characters]',
  '[location-slug-city-region]',
  '[Comprehensive description 400-1500 characters following structure above]',
  '[Complete Address: Street, City, Region, Country]',
  [latitude as decimal],
  [longitude as decimal],
  '[farm|garden|education|community|business]',
  '[https://website.com or NULL]',
  '[contact@email.com or NULL]',
  ARRAY['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6'],
  'published'
);
```

### Location Quality Checklist

- [ ] Name is official and accurate (30-100 characters)
- [ ] Slug identifies location and region
- [ ] Description is comprehensive (400-1500 characters)
- [ ] Description follows structure template
- [ ] Key features are specific and detailed
- [ ] Address is complete and accurate
- [ ] Coordinates verified with Google Maps (decimal degrees)
- [ ] Location type accurately represents primary function
- [ ] Website URL is current and working (if provided)
- [ ] Contact email is public and appropriate (if provided)
- [ ] 5-15 relevant tags selected
- [ ] Tags follow naming conventions
- [ ] All information is factual and verified
- [ ] Status is 'published' for active locations

---

## Quality Standards

### Accuracy Requirements

**Verified Information:**
- All facts must be verifiable through reputable sources
- Cite sources in comments for controversial or specific claims
- Mark theoretical or experimental approaches as such
- GPS coordinates must be accurate to location

**Source Citation Format (in SQL comments):**
```sql
-- Source: https://example.com/article
-- Verified: 2025-11-14
-- Research: Multiple sources confirm this practice
```

### Geographic Accuracy

**Coordinate Precision:**
- Use decimal degrees format (e.g., 50.0755, not degrees/minutes/seconds)
- Minimum 4 decimal places (50.0755, 14.4378)
- Verify using Google Maps, OpenStreetMap, or similar
- Ensure coordinates match the actual location address

**How to Find Coordinates:**
1. Open Google Maps (maps.google.com)
2. Search for the address
3. Right-click on the exact location
4. Select coordinates (first option)
5. Coordinates appear in "Latitude, Longitude" format
6. Copy decimal values

### Content Depth by Type

**Guides:**
- Minimum 1000 words (1500-5000 optimal)
- At least 4 major sections
- Practical steps with measurements/timing
- Troubleshooting section required
- Resources section required

**Events:**
- Minimum 300 characters (400-800 optimal)
- Clear description of activities
- What's included must be stated
- Target audience identified
- Logistics clearly explained

**Locations:**
- Minimum 400 characters (500-1200 optimal)
- Specific features described
- Access/visitor information included
- Historical context or significance noted
- 5-15 relevant tags required

### Writing Style

**Clarity:**
- Write in clear, accessible language
- Define technical terms on first use
- Use active voice
- Break complex ideas into steps

**Structure:**
- Use hierarchical headings (##, ###)
- Include bullet points for lists
- Bold important terms or warnings
- Use tables for comparisons

**Tone:**
- Professional but approachable
- Encouraging and empowering
- Inclusive language
- Practical focus

---

## Examples by Category

### Example 1: Soil Science Guide

```sql
INSERT INTO wiki_guides (
  title, slug, summary, content, status, view_count, published_at
) VALUES (
  'Understanding Soil Food Web: A Practical Guide',
  'understanding-soil-food-web-practical',
  'Learn how soil organisms work together to create healthy, living soil that grows nutrient-dense food without synthetic inputs.',
  E'# Understanding Soil Food Web: A Practical Guide

## Introduction

Soil is not simply "dirt" - it is a complex, living ecosystem teeming with billions of organisms working together to create the foundation of all terrestrial life. Understanding the soil food web transforms how we grow food, moving from a chemical input model to one that harnesses biology for healthier plants, better yields, and regenerated ecosystems.

This guide explains the key players in soil biology, how they interact, and practical methods to assess and improve your soil''s living community.

**Key Benefits of Healthy Soil Biology:**
- Nutrient cycling without synthetic fertilizers
- Disease suppression from beneficial organisms
- Improved soil structure and water retention
- Carbon sequestration and climate benefits
- Reduced need for pesticides and herbicides

## The Soil Food Web Players

### Bacteria

Bacteria are the smallest and most numerous soil organisms, numbering in the billions per teaspoon of healthy soil.

**Functions:**
- Decompose simple compounds (sugars, proteins)
- Cycle nitrogen through fixation
- Produce plant growth hormones
- Form biofilms protecting aggregates

**Bacterial-Dominated Soils:**
- Grasslands and prairies
- Annual vegetable gardens
- Agricultural fields
- Early succession systems

### Fungi

Fungal networks create the internet of the forest, connecting plants and moving nutrients vast distances.

**Functions:**
- Decompose complex compounds (lignin, cellulose)
- Form mycorrhizal partnerships with plant roots
- Create stable soil structure
- Store and transport nutrients

**Fungal-Dominated Soils:**
- Forests and woodlands
- Perennial systems
- Food forests
- Late succession ecosystems

### Protozoa

Single-celled organisms that graze on bacteria and fungi, releasing plant-available nutrients.

**Functions:**
- Release nitrogen by consuming bacteria
- Regulate bacterial populations
- Improve nutrient cycling
- Indicate soil health

### Nematodes

Microscopic roundworms with diverse feeding strategies - some beneficial, some harmful.

**Beneficial Nematodes:**
- Bacterial-feeders (release nitrogen)
- Fungal-feeders (regulate fungi)
- Predatory (control pest nematodes)

**Pest Nematodes:**
- Root-feeders (damage plants)

**Ratio indicator:** Healthy soil has 90% beneficial, 10% pest nematodes

### Microarthropods

Tiny soil animals including mites, springtails, and beetles that shred organic matter.

**Functions:**
- Physically break down organic matter
- Spread beneficial microbes
- Create pore spaces for water/air
- Indicate soil health

### Earthworms

The most visible soil workers, creating channels and processing organic matter.

**Functions:**
- Aerate soil through burrowing
- Mix organic matter throughout profile
- Produce nutrient-rich castings
- Improve water infiltration

**Earthworm density:** Healthy soil contains 50+ earthworms per square foot

## The Soil Food Web in Action

### Energy Flow

1. **Primary Producers:** Plants capture solar energy through photosynthesis
2. **Exudates:** Plants release 30-40% of photosynthesis as root exudates
3. **Bacterial/Fungal Growth:** Microbes feed on exudates and multiply
4. **Predation:** Protozoa and nematodes consume bacteria/fungi
5. **Nutrient Release:** Predators release excess nutrients in plant-available forms
6. **Plant Uptake:** Plants absorb nutrients, growing stronger
7. **Repeat:** Cycle continues, building soil fertility

### Nutrient Cycling

**Nitrogen Cycle:**
- Bacteria fix atmospheric N2 into plant-available forms
- Organic matter contains nitrogen in complex molecules
- Bacteria/fungi decompose organic matter
- Protozoa/nematodes eat microbes, releasing NH4+ (ammonium)
- Plants absorb ammonium directly
- Nitrifying bacteria convert some to NO3- (nitrate)

**Phosphorus Cycle:**
- Mycorrhizal fungi dissolve rock phosphate
- Fungi transport P to plant roots
- Plants trade carbon for phosphorus
- Decomposers release P from organic matter

**The Liquid Carbon Pathway:**
- Plants photosynthesize, creating sugars
- 30-40% sugars exuded to soil
- Microbes consume exudates, building biomass
- Carbon stored in microbial bodies and humus
- When microbes die, carbon remains in stable forms
- Process sequesters atmospheric CO2 in soil

## Assessing Your Soil Biology

### Visual Indicators

**Healthy Soil Signs:**
- Dark color (high organic matter)
- Friable, crumbly texture
- Pleasant earthy smell
- Visible fungal threads (white mycelium)
- Many earthworms present
- Diverse plants growing vigorously

**Unhealthy Soil Signs:**
- Light color (low organic matter)
- Compacted or dusty texture
- Sour or chemical smell
- No visible life
- Few or no earthworms
- Poor plant growth

### The Ribbon Test

Test soil structure to infer biology:

1. Take moist handful of soil
2. Squeeze and roll between palms
3. Attempt to form a ribbon

**Results:**
- Won''t hold together: Sandy, likely bacterial-dominated
- Forms short ribbon (1-2 inches): Loam, balanced
- Forms long ribbon (2+ inches): Clay, needs organic matter

### Microscopy

Direct observation of soil organisms using microscope (400x magnification):

**Process:**
1. Collect soil sample (top 4 inches)
2. Mix 1 part soil with 5 parts water
3. Let settle 30 seconds
4. Extract liquid from just above sediment
5. Place drop on microscope slide
6. Observe at 100x-400x magnification

**What to Count:**
- Active bacteria (1000-3000 per field of view)
- Fungal hyphae (several strands per view)
- Protozoa (5-20 per field of view)
- Nematodes (2-10 per several views)

### Soil Testing Services

Professional soil biology testing provides detailed analysis:

- **Basic Analysis:** Bacterial and fungal biomass, bacterial:fungal ratio
- **Advanced Analysis:** Species diversity, functional groups, predator:prey ratios
- **Interpretation:** Recommendations for improving biology

**Reputable Testing Services:**
- Soil Food Web School (Dr. Elaine Ingham)
- Local agricultural extension services
- Permaculture design consultants

## Building Healthy Soil Biology

### Feed the Microbes

**High-Quality Compost:**
- Made with diverse ingredients
- Properly aerated during process
- Finished (not hot, smells earthy)
- Applied as thin layer (1/4 - 1/2 inch)

**Compost Tea:**
- Actively aerated compost tea (AACT)
- Brewed 24-36 hours
- Applied to soil and foliage
- Inoculates plants and soil with beneficial organisms

**Mulch:**
- Diverse organic materials
- 2-4 inches depth
- Replenished as decomposed
- Feeds fungal populations

### Stop Harming Soil Life

**Avoid:**
- Tilling (disrupts fungal networks)
- Bare soil (causes erosion, loses biology)
- Synthetic fertilizers (feed plants, starve microbes)
- Biocides (pesticides, herbicides, fungicides kill beneficials)
- Compaction (crushes pore spaces and organisms)

### Plant for Biology

**Diverse Plantings:**
- Different root depths
- Various exudate chemistry
- Year-round living roots
- Include nitrogen-fixers

**Cover Crops:**
- Winter rye (bacterial food)
- Vetch (nitrogen-fixing)
- Radish (deep roots, breaks compaction)
- Multi-species mixes (best diversity)

### Match Biology to Plants

**For Vegetables (Bacterial-Dominated):**
- Bacterial compost (hot composted)
- Annual cover crops
- Green manures
- Regular disturbance (light cultivation)

**For Perennials and Trees (Fungal-Dominated):**
- Fungal compost (cool composted with wood chips)
- Wood chip mulch
- Mycorrhizal inoculant
- No-till management

## Troubleshooting Soil Biology Problems

### Problem: Poor Plant Growth Despite Fertilizer

**Likely Cause:** Dead or imbalanced soil biology

**Solutions:**
- Test soil biology with microscopy
- Add diverse compost
- Stop synthetic fertilizers
- Plant cover crops
- Reduce tillage

### Problem: Disease Pressure

**Likely Cause:** Missing beneficial organisms that suppress pathogens

**Solutions:**
- Apply compost tea to plants and soil
- Increase diversity of soil inputs
- Ensure good drainage
- Rotate crops
- Add disease-suppressive compost

### Problem: Compaction

**Likely Cause:** Lack of soil structure from low biology

**Solutions:**
- Avoid working wet soil
- Use deep-rooted cover crops (daikon radish)
- Add compost to improve aggregation
- Encourage earthworms with organic matter
- Consider broadfork instead of tiller

### Problem: Nutrients Leaching Away

**Likely Cause:** Insufficient biology to cycle and hold nutrients

**Solutions:**
- Build fungal biomass (wood chips, ramial chipped wood)
- Maintain living roots year-round
- Add compost regularly
- Use cover crops
- Stop bare fallowing

## Advanced Topics

### Bacterial:Fungal Ratio

Different ecosystems have different ideal ratios:

- **Vegetable Garden:** 1:1 (equal bacteria and fungi)
- **Row Crops:** 2:1 to 5:1 (bacterial-dominated)
- **Grassland:** 1:1 to 1:2
- **Deciduous Forest:** 1:5 to 1:10 (fungal-dominated)
- **Coniferous Forest:** 1:10 to 1:100 (highly fungal)

**Adjusting Ratios:**
- Increase bacteria: High-nitrogen inputs, tilling, bacterial compost
- Increase fungi: Wood chips, no-till, fungal compost, mycorrhizal inoculant

### Mycorrhizal Partnerships

Two main types of mycorrhizae partner with 90% of plant species:

**Endomycorrhizae (Arbuscular Mycorrhizae):**
- Partner with: Vegetables, grasses, herbs, some trees
- Function: Penetrate root cells, extend into soil
- Benefit: Phosphorus uptake, drought resistance

**Ectomycorrhizae:**
- Partner with: Most forest trees (oak, pine, birch)
- Function: Sheath around roots, extensive network
- Benefit: Nutrient transport, tree-to-tree communication

**Encouraging Mycorrhizae:**
- Avoid tilling
- Reduce phosphorus fertilizers (suppress formation)
- Use mycorrhizal inoculant when transplanting
- Maintain living roots year-round
- Diverse plant communities

### Liquid Carbon Pathway

Recent research highlights soil biology''s role in climate change mitigation:

1. Healthy soil biology sequesters 1-3 tons of carbon per acre per year
2. Carbon stored as stable humus compounds
3. Process improves soil fertility simultaneously
4. More effective than planting trees alone
5. Regenerative agriculture can reverse climate change

**Maximizing Carbon Sequestration:**
- Year-round photosynthesis (living roots)
- Minimal tillage (preserves fungal networks)
- High plant diversity (various exudates)
- Grazing management (stimulates growth)
- Integration of trees (deep carbon storage)

## Resources & Further Learning

**Recommended Reading:**
- "Teaming with Microbes" by Jeff Lowenfels and Wayne Lewis
- "The Soil Food Web" by Dr. Elaine Ingham
- "Mycelium Running" by Paul Stamets
- "The Hidden Half of Nature" by David Montgomery

**Online Courses:**
- Soil Food Web School (Dr. Elaine Ingham)
- Regenerative Agriculture courses
- Local extension service workshops

**Tools & Supplies:**
- Microscope (400x minimum) - $200-500
- Soil test kits - $20-100
- Compost tea brewer - $50-500 (or DIY)
- Quality compost - Local sources or make your own

**Related Guides:**
- Composting Methods for Different Soil Types
- Cover Cropping for Soil Health
- No-Till Gardening Techniques
- Building Humus-Rich Soil

## Conclusion

Understanding and working with the soil food web represents a paradigm shift from fighting nature to partnering with it. Rather than forcing plants to grow with chemical inputs, we create conditions for thriving soil biology that naturally provides everything plants need.

The soil food web is incredibly resilient - even damaged soils can regenerate relatively quickly with proper management. Every choice to feed biology rather than harm it compounds over time, building increasingly fertile, self-sustaining systems.

Start with one change: add compost, plant a cover crop, stop tilling a section. Observe the results. Let the soil organisms teach you what they need. In partnering with the life below ground, we create abundance above.',
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
  SELECT id INTO guide_id FROM wiki_guides WHERE slug = 'understanding-soil-food-web-practical';
  SELECT ARRAY_AGG(id) INTO cat_ids FROM wiki_categories WHERE slug IN ('soil-science', 'regenerative-agriculture', 'composting');

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
```

### Example 2: Workshop Event

```sql
INSERT INTO wiki_events (
  title, slug, description, event_date, start_time, end_time,
  location_name, location_address, latitude, longitude,
  event_type, price, price_display, registration_url, max_attendees, status
) VALUES (
  'Compost Tea Brewing Workshop',
  'compost-tea-brewing-workshop-may-2026',
  'Learn to brew actively aerated compost tea (AACT) to inoculate your garden with billions of beneficial microorganisms. This hands-on workshop covers the science behind compost tea, proper brewing techniques, application methods, and troubleshooting. Participants will brew a batch together and take home starter culture plus detailed instructions. Perfect for gardeners wanting to boost soil biology without chemical inputs. Includes all materials, microscope observation of finished tea, and light refreshments.',
  '2026-05-16',
  '10:00:00',
  '15:00:00',
  'Community Garden Kuchyňka',
  'Prague, Czech Republic',
  50.0880,
  14.4208,
  'workshop',
  25.00,
  '650 CZK',
  NULL,
  20,
  'published'
);
```

### Example 3: Educational Location

```sql
INSERT INTO wiki_locations (
  name, slug, description, address, latitude, longitude,
  location_type, website, contact_email, tags, status
) VALUES (
  'Regenerative Agriculture Training Center Brno',
  'regen-ag-training-brno-czech',
  'Educational facility dedicated to teaching regenerative agriculture and soil health principles in Central Europe. Established in 2023 on 5 hectares of former conventional farmland being transitioned to regenerative systems. Offers hands-on workshops in soil food web assessment, compost production, cover cropping, and holistic grazing management. Features demonstration plots comparing conventional, organic, and regenerative approaches with ongoing data collection. Research partnership with Mendel University studying carbon sequestration and soil biology restoration. Regular soil food web microscopy sessions open to public. Hosts international speakers and annual regenerative agriculture conference each October. On-site soil testing laboratory available to farmers and gardeners. Weekend workshops taught in Czech and English. Volunteer opportunities for students and aspiring farmers. Demonstration farm showcasing integration of annual crops, perennial systems, and livestock in regenerative framework.',
  'Brno, Moravia, Czech Republic',
  49.1951,
  16.6068,
  'education',
  'https://example-regen-ag-brno.cz',
  'education@example-regen.cz',
  ARRAY['regenerative-agriculture', 'soil-food-web', 'education', 'workshops', 'research', 'demonstration-farm', 'carbon-sequestration', 'cover-cropping', 'holistic-grazing', 'soil-testing', 'volunteers', 'brno', 'moravia'],
  'published'
);
```

---

## Final Checklist for All Content

Before submitting any content, verify:

- [ ] All required fields completed
- [ ] Coordinates verified with mapping service
- [ ] Slug is unique and follows naming conventions
- [ ] Content meets minimum length requirements
- [ ] Structure follows provided templates
- [ ] Grammar and spelling checked
- [ ] Technical terms defined or commonly understood
- [ ] Facts are accurate and verifiable
- [ ] Sources cited in comments where appropriate
- [ ] Categories/tags are relevant and accurate
- [ ] Formatting is clean (markdown for guides)
- [ ] Status set to 'published' for active content
- [ ] No sensitive or private information included
- [ ] Content aligns with permaculture ethics and principles

---

## Notes for LLM Agents

When creating content programmatically:

1. **Research First:** Gather factual information from reliable sources before writing
2. **Verify Geography:** Always confirm coordinates match the stated address
3. **Use Templates:** Follow the exact structure provided for consistency
4. **Category Alignment:** Select 2-4 categories that genuinely fit the content
5. **Be Specific:** Include measurements, timing, quantities, not vague descriptions
6. **Escape Quotes:** In SQL, use E'' format and escape single quotes as ''
7. **Check Uniqueness:** Ensure slugs are unique across all content
8. **Realistic Dates:** For events, use future dates appropriate to content creation time
9. **Tag Thoughtfully:** Choose tags users would actually search for
10. **Quality Over Quantity:** One excellent guide is better than three mediocre ones

---

**End of Guide**

For questions or clarifications about content creation standards, refer to the Permahub development team or open an issue in the project repository.
