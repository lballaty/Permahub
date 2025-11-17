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
| id | UUID | Auto | Primary key (auto-generated) |
| title | TEXT | Yes | Clear, descriptive title (50-100 chars) |
| slug | TEXT | Yes | URL-friendly identifier (lowercase, hyphens, unique) |
| summary | TEXT | Yes | 1-2 sentence overview (150-250 chars) |
| content | TEXT | Yes | Full markdown content (see structure below) |
| featured_image | TEXT | No | URL to header image |
| author_id | UUID | No | Reference to auth.users (set by system) |
| status | TEXT | Default 'draft' | 'draft', 'published', or 'archived' |
| view_count | INTEGER | Auto | Page view counter (starts at 0) |
| allow_comments | BOOLEAN | Default true | Enable comments |
| allow_edits | BOOLEAN | Default true | Enable community edits |
| notify_group | BOOLEAN | Default false | Notify community of new guide |
| created_at | TIMESTAMPTZ | Auto | Timestamp of creation |
| updated_at | TIMESTAMPTZ | Auto | Timestamp of last update |
| published_at | TIMESTAMPTZ | Auto | Set when status = 'published' |

**Categories:** Guides can have multiple categories via wiki_guide_categories junction table

### wiki_events Table

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Auto | Primary key (auto-generated) |
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
| view_count | INTEGER | Auto | Page view counter (starts at 0) |

### wiki_locations Table

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Auto | Primary key (auto-generated) |
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
| status | TEXT | Default 'published' | 'draft', 'published', or 'archived' |
| created_at | TIMESTAMPTZ | Auto | Timestamp of creation |
| updated_at | TIMESTAMPTZ | Auto | Timestamp of last update |
| view_count | INTEGER | Auto | Page view counter (starts at 0) |

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
  title, slug, summary, content, status
) VALUES (
  '[Guide Title - 50-100 characters]',
  '[url-friendly-slug]',
  '[Clear 1-2 sentence summary explaining what readers will learn - 150-250 characters]',
  E'[Full markdown content following structure above - use E'' for PostgreSQL extended string with escaped quotes]',
  'published'
);

-- NOTE: Auto-generated fields NOT included in INSERT:
-- - id: Auto-generated UUID
-- - author_id: NULL for seed/system content (set by RLS for user-created content)
-- - view_count: Defaults to 0
-- - published_at: Will be set when status = 'published' (application logic)
-- - created_at, updated_at: Auto-set to NOW()

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

### Event Description Best Practices

**Length Guidelines:**
- **Target:** 200-400 characters for good card display
- **Include link** to organizer's website for full details
- **Focus:** Key information (what, when, where, who should attend)
- **Avoid:** Excessive details better suited for organizer's website

**Why Keep Events Concise:**
- Event cards display well at 300-400 characters
- Organizers maintain authoritative details on their own site
- Registration, updates, and changes happen on external platform
- Reduces duplicate information maintenance

**Example - Good Event Description:**
```
Full-day introduction to permaculture design principles. Learn zone planning,
water management, and food forest basics through hands-on activities. Includes
lunch, materials, and certificate. Beginners welcome. Register at
www.permaculturecenter.org/workshops
```

**Example - Too Detailed:**
```
This comprehensive workshop will take you through every aspect of permaculture
in great detail. We will start at 9am with coffee and introductions, then move
into a detailed lecture about the history of permaculture from Bill Mollison's
early work in Tasmania through to modern applications worldwide. After that we
will break for morning tea at 10:30am where you can enjoy organic snacks...
(continues for 800+ characters)
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

### Description Display & Truncation

**Important:** Location descriptions are displayed in multiple contexts with different space constraints:

| Display Context | Card Width | Truncation | Visible Length |
|----------------|------------|------------|----------------|
| **Home Featured Cards** | 250px min | 3 lines | ~60-80 characters |
| **Search Results** | 300px min | 4 lines | ~100-130 characters |
| **Map Sidebar List** | 400px fixed | 4 lines | ~130-160 characters |
| **Map Popups** | 200px min | 2 lines | ~40-60 characters |

**Writing Best Practices:**
- **Front-load key information** - Most important details in first 1-2 sentences
- **Keep descriptions concise** - 150-250 characters optimal for card display
- **Full details in first paragraph** - First 3-4 sentences show before truncation
- **Aim for 400-600 characters total** - Provides context without overwhelming
- **Avoid starting with filler** - No "This location is...", "Welcome to..."

**Example - Good Front-Loading:**
```
Organic permaculture farm specializing in Mediterranean food forests and
regenerative agriculture. Features over 500 fruit and nut trees, natural
spring water systems, and seed-saving library. Offers workshops, volunteer
programs, and seasonal farm tours.
```

**Example - Poor Front-Loading:**
```
Welcome to our beautiful location in the countryside. This is a very special
place that has been practicing sustainable agriculture for many years. We
believe in working with nature and creating harmony...
```

**Truncation Behavior:**
- Descriptions automatically truncate with ellipsis (...) when exceeding line limit
- Users can click "View on Map" or card itself to see full content
- Mobile devices: Even more limited space, prioritize first sentence

**Character Count Recommendations:**
- **Soft maximum:** 250 characters (displays well in most contexts)
- **Hard maximum:** 600 characters (full detail without excessive length)
- **Minimum:** 150 characters (provides sufficient context)

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

## Preventing Duplicate Content

**CRITICAL: Always check for existing content before creating new entries!**

### Pre-Creation Checklist

Before creating ANY content, verify it doesn't already exist:

1. **Check slug uniqueness** - Slugs must be globally unique per content type
2. **Search existing titles** - Avoid creating near-duplicate guides
3. **Review category coverage** - Check what topics already exist
4. **Verify locations** - Don't duplicate physical places

### SQL Queries to Check for Duplicates

**Check if slug exists (Guides):**
```sql
SELECT id, title, slug, status
FROM wiki_guides
WHERE slug = 'your-proposed-slug';
-- Should return 0 rows if slug is available
```

**Check if slug exists (Events):**
```sql
SELECT id, title, slug, event_date
FROM wiki_events
WHERE slug = 'your-proposed-slug';
-- Should return 0 rows if slug is available
```

**Check if slug exists (Locations):**
```sql
SELECT id, name, slug, latitude, longitude
FROM wiki_locations
WHERE slug = 'your-proposed-slug';
-- Should return 0 rows if slug is available
```

**Search for similar titles (Guides):**
```sql
SELECT id, title, slug
FROM wiki_guides
WHERE title ILIKE '%keyword%'
ORDER BY created_at DESC;
-- Check if similar guide already exists
```

**Full-text search in content (Guides):**
```sql
SELECT
  id,
  title,
  slug,
  LEFT(content, 200) as content_preview,
  ts_rank(
    to_tsvector('english', title || ' ' || summary || ' ' || content),
    plainto_tsquery('english', 'soil food web bacteria')
  ) as relevance
FROM wiki_guides
WHERE to_tsvector('english', title || ' ' || summary || ' ' || content)
  @@ plainto_tsquery('english', 'soil food web bacteria')
ORDER BY relevance DESC
LIMIT 10;
-- Searches actual content for topic overlap
-- Replace 'soil food web bacteria' with your topic keywords
```

**Check content similarity by word count (Advanced):**
```sql
-- Find guides with similar word count (±20%)
WITH target_guide AS (
  SELECT LENGTH(content) - LENGTH(REPLACE(content, ' ', '')) + 1 as word_count
  FROM wiki_guides
  WHERE slug = 'your-new-guide-slug'
)
SELECT
  g.id,
  g.title,
  g.slug,
  LENGTH(g.content) - LENGTH(REPLACE(g.content, ' ', '')) + 1 as word_count,
  LEFT(g.summary, 150) as summary_preview
FROM wiki_guides g, target_guide t
WHERE ABS((LENGTH(g.content) - LENGTH(REPLACE(g.content, ' ', '')) + 1) - t.word_count) < (t.word_count * 0.2)
  AND g.slug != 'your-new-guide-slug'
ORDER BY word_count DESC;
-- Finds content with similar length (potential duplicates)
```

**Check for common keywords (Advanced):**
```sql
-- Extract most common words from your proposed content
-- Compare with existing guides to find topic overlap
SELECT
  g.id,
  g.title,
  g.slug,
  ts_rank(
    to_tsvector('english', g.content),
    plainto_tsquery('english', 'composting worms bins vermicomposting')
  ) as keyword_overlap
FROM wiki_guides g
WHERE to_tsvector('english', g.content) @@ plainto_tsquery('english', 'composting worms bins vermicomposting')
ORDER BY keyword_overlap DESC
LIMIT 10;
-- Replace keywords with your main topic terms
-- High scores indicate significant content overlap
```

**Check location by coordinates:**
```sql
SELECT id, name, latitude, longitude
FROM wiki_locations
WHERE latitude BETWEEN [your_lat - 0.001] AND [your_lat + 0.001]
  AND longitude BETWEEN [your_lng - 0.001] AND [your_lng + 0.001];
-- Finds locations within ~100m radius
```

**List all existing guides by category:**
```sql
SELECT g.id, g.title, g.slug, c.name as category
FROM wiki_guides g
JOIN wiki_guide_categories gc ON g.id = gc.guide_id
JOIN wiki_categories c ON gc.category_id = c.id
WHERE c.slug = 'soil-science'
ORDER BY g.created_at DESC;
-- See what already exists in a category
```

### For LLM Agents: Automated Duplicate Prevention

When generating content programmatically:

1. **Extract key topics** - Identify 5-10 main keywords from your proposed content
2. **Search by keywords** - Use full-text search to find content about same topics
3. **Review matches** - Read summaries of high-ranking results
4. **Verify uniqueness** - Ensure your content adds new value, not duplicates existing
5. **Check slug availability** - Query database to verify slug uniqueness
6. **Generate unique slugs** - Include date, location, or unique identifiers if needed
7. **Log what you create** - Track generated content to avoid re-creation
8. **Use transactions** - Wrap check + insert in transaction for safety

**Example workflow:**
```sql
-- Step 1: Search for content overlap using your main topics
-- Example: Planning guide about "vermicomposting with red wiggler worms"
SELECT
  id,
  title,
  slug,
  LEFT(summary, 150) as summary_preview,
  ts_rank(
    to_tsvector('english', title || ' ' || summary || ' ' || content),
    plainto_tsquery('english', 'vermicomposting worms compost bins')
  ) as relevance
FROM wiki_guides
WHERE to_tsvector('english', title || ' ' || summary || ' ' || content)
  @@ plainto_tsquery('english', 'vermicomposting worms compost bins')
ORDER BY relevance DESC
LIMIT 5;

-- Review results:
-- - If high relevance scores (>0.1), read those guides
-- - Check if your content would duplicate them
-- - If similar content exists, consider:
--   a) Updating existing guide instead
--   b) Creating complementary content (different angle)
--   c) Not creating (content already covered)

-- Step 2: Check if slug exists
DO $$
DECLARE
  slug_exists BOOLEAN;
BEGIN
  SELECT EXISTS(SELECT 1 FROM wiki_guides WHERE slug = 'vermicomposting-beginners-guide') INTO slug_exists;

  IF slug_exists THEN
    RAISE EXCEPTION 'Slug already exists: vermicomposting-beginners-guide';
  END IF;
END $$;

-- Step 3: Only if checks pass AND content is unique, insert
INSERT INTO wiki_guides (title, slug, summary, content, status)
VALUES (
  'Vermicomposting: A Beginner''s Guide',
  'vermicomposting-beginners-guide',
  'Learn how to turn kitchen scraps into rich compost using red wiggler worms...',
  E'[Full unique content here]',
  'published'
);
```

### Helper Script for LLM Agents

A Node.js script is available to help with duplicate prevention and content generation:

**Location:** `/scripts/generate-wiki-content.js`
**Documentation:** `/scripts/README-WIKI-CONTENT-GENERATOR.md`

**Available commands:**

```bash
# 🔍 MOST IMPORTANT: Check for content overlap (do this FIRST!)
node scripts/generate-wiki-content.js search-content "composting worms vermicomposting"

# Check if slug is available
node scripts/generate-wiki-content.js check-slug guides "my-new-guide"

# List all guides in a category
node scripts/generate-wiki-content.js list-guides soil-science

# List all content of a type
node scripts/generate-wiki-content.js list-all guides

# Generate slug from title
node scripts/generate-wiki-content.js generate-slug "Understanding Composting"

# Search titles for similar content
node scripts/generate-wiki-content.js search guides "compost"

# Show statistics
node scripts/generate-wiki-content.js stats
```

**Workflow for LLM agents:**

1. **Before creating content (CRITICAL):**
   - Extract 5-10 main keywords from your proposed content
   - Run `search-content "<keywords>"` to find topic overlap
   - Review any guides with relevance > 0.1
   - Verify your content adds unique value

2. **Check existing coverage:**
   - Run `stats` to see total content counts
   - Run `list-guides <category>` to check category coverage
   - Run `search` to find similar titles

3. **Generate and verify slug:**
   - Run `generate-slug "Your Title"` to get suggested slug
   - Run `check-slug` to verify it's available

4. **Create content:**
   - Use SQL templates from this guide
   - Include all required fields
   - Ensure content is unique (not duplicate)

5. **Verify creation:**
   - Run `stats` again to confirm new content added
   - Run `search-content` with your keywords to see your new guide appear

---

## SQL Seed File Structure & Requirements

**CRITICAL:** When creating SQL seed files for wiki content, you must follow this exact structure for the seed file viewer and analysis tools to work correctly.

### File Location Standards

**Active Seed Files (Ready to Load):**
- Location: `/supabase/seeds/`
- Purpose: Seed files that are ready to be loaded into production database
- Naming: `00X_descriptive_name.sql` (numbered sequentially)
- Example: `003_expanded_wiki_categories.sql`

**Staged Seed Files (To Be Reviewed):**
- Location: `/supabase/to-be-seeded/`
- Purpose: Seed files awaiting review, testing, or approval
- Naming: `00X_descriptive_name.sql` or descriptive names
- Examples: `004_future_events_seed.sql`, `seed_madeira_czech.sql`

### File Header Format

Every seed file MUST start with this header:

```sql
/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/seeds/00X_filename.sql
 * Description: Clear description of what content this seed file adds
 * Author: Your Name <your.email@example.com>
 * Created: YYYY-MM-DD
 */
```

### INSERT Statement Format

#### Standard Multi-Line Format (REQUIRED)

The seed file parser expects this exact format:

```sql
INSERT INTO wiki_guides (
  title,
  slug,
  summary,
  content,
  status,
  view_count,
  published_at
) VALUES (
  'Guide Title Here',
  'guide-slug-here',
  'Summary text here',
  E'# Guide Content\n\nFull markdown content with escaped newlines',
  'published',
  0,
  NOW()
);
```

**Key Requirements:**

1. **Column List on Separate Lines:**
   ```sql
   INSERT INTO wiki_guides (
     title,
     slug,
     summary
   )
   ```
   - Opening `(` on same line as table name
   - Each column on its own line
   - Closing `)` on its own line

2. **VALUES Keyword:**
   ```sql
   ) VALUES (
   ```
   - `VALUES` on same line as closing `)` of column list
   - Opening `(` for values on same line

3. **Values on Separate Lines:**
   ```sql
   VALUES (
     'value1',
     'value2',
     'value3'
   );
   ```
   - Each value on its own line
   - Closing `);` on its own line

4. **End Statement:**
   - Must end with `);` or `) ON CONFLICT DO NOTHING;`
   - Semicolon is REQUIRED

#### String Formatting

**PostgreSQL Extended Strings (for content with newlines):**

Use `E'...'` format for strings containing escape sequences:

```sql
content = E'# Heading\n\nParagraph text.\n\n## Section\n\nMore text.'
```

**Escape Sequences:**
- `\n` - Newline
- `\t` - Tab
- `\\` - Backslash
- `\'` - Single quote (alternative to `''`)

**SQL Escaped Quotes:**

For strings without E prefix, escape single quotes by doubling them:

```sql
title = 'Farmer''s Guide to Composting'
-- NOT: title = 'Farmer's Guide to Composting'  (will cause error)
```

**Examples:**

```sql
-- CORRECT: Using E'...' with escape sequences
content = E'# Introduction\n\nThis is a paragraph.\n\n**Bold text** and *italic text*.'

-- CORRECT: Using regular quotes with doubled single quotes
title = 'Children''s Gardens: A Parent''s Guide'

-- INCORRECT: Unescaped quote
title = 'Children's Gardens'  -- ❌ WILL FAIL

-- INCORRECT: E without escape sequences (unnecessary)
title = E'Simple Title'  -- ⚠️ Works but unnecessary
```

### Field Value Types

**Text Values:**
```sql
'Simple text string'
E'Text with\nescaped\nnewlines'
'Text with doubled''quotes'
NULL  -- For empty/missing values
```

**Numeric Values:**
```sql
42          -- Integer
3.14159     -- Decimal
0           -- Zero
0.00        -- Decimal zero
```

**Boolean Values:**
```sql
TRUE
FALSE
```

**Date/Time Values:**
```sql
'2026-05-16'           -- Date (YYYY-MM-DD)
'10:00:00'             -- Time (HH:MM:SS)
'2025-11-15 14:30:00'  -- Timestamp
NOW()                  -- Current timestamp function
```

**Arrays:**
```sql
ARRAY['tag1', 'tag2', 'tag3']
ARRAY['permaculture', 'organic-farming', 'compost']
```

**JSONB:**
```sql
'{"monday": "9:00-17:00", "tuesday": "9:00-17:00"}'::jsonb
```

### Required vs Optional Fields

#### wiki_guides

**Required (must provide):**
- `title` (TEXT) - 50-100 characters
- `slug` (TEXT) - Unique, lowercase, hyphen-separated
- `summary` (TEXT) - 150-250 characters
- `content` (TEXT) - Full markdown content, minimum 1000 words

**Optional (provide if available):**
- `status` (TEXT) - Defaults to 'draft', use 'published' for live content
- `view_count` (INTEGER) - Defaults to 0, can specify
- `published_at` (TIMESTAMPTZ) - Use `NOW()` for immediate publishing

**Auto-Generated (DO NOT include in INSERT):**
- `id` (UUID) - Auto-generated primary key
- `author_id` (UUID) - Set by RLS or NULL for seed content
- `created_at` (TIMESTAMPTZ) - Auto-set to NOW()
- `updated_at` (TIMESTAMPTZ) - Auto-set to NOW()

#### wiki_events

**Required:**
- `title` (TEXT) - 30-80 characters
- `slug` (TEXT) - Unique slug, include date (e.g., `event-name-2026-05`)
- `description` (TEXT) - 300-1000 characters
- `event_date` (DATE) - Format: 'YYYY-MM-DD'

**Recommended:**
- `start_time` (TIME) - Format: 'HH:MM:SS'
- `end_time` (TIME) - Format: 'HH:MM:SS'
- `location_name` (TEXT)
- `location_address` (TEXT)
- `latitude` (DOUBLE PRECISION)
- `longitude` (DOUBLE PRECISION)
- `event_type` (TEXT) - 'workshop', 'meetup', 'tour', 'course', 'workday'
- `price` (NUMERIC) - Use 0.00 for free events
- `price_display` (TEXT) - Human-readable: "Free", "€35", "$20"

**Auto-Generated:**
- `id`, `author_id`, `created_at`, `updated_at`

#### wiki_locations

**Required:**
- `name` (TEXT) - 30-100 characters
- `slug` (TEXT) - Unique, descriptive
- `description` (TEXT) - 400-1500 characters
- `latitude` (DOUBLE PRECISION) - Decimal degrees (e.g., 50.0755)
- `longitude` (DOUBLE PRECISION) - Decimal degrees (e.g., 14.4378)

**Recommended:**
- `address` (TEXT) - Complete address
- `location_type` (TEXT) - 'farm', 'garden', 'education', 'community', 'business'
- `website` (TEXT) - Full URL or NULL
- `tags` (TEXT[]) - Array of 5-15 tags

**Auto-Generated:**
- `id`, `author_id`, `created_at`, `updated_at`

### Linking Content to Categories

After inserting guides, link them to categories using this DO block pattern:

```sql
DO $$
DECLARE
  guide_id UUID;
  category_id UUID;
BEGIN
  -- Get the guide ID by slug
  SELECT id INTO guide_id FROM wiki_guides WHERE slug = 'your-guide-slug';

  -- Get category ID by slug
  SELECT id INTO category_id FROM wiki_categories WHERE slug = 'category-slug';

  -- Insert link if both exist
  IF guide_id IS NOT NULL AND category_id IS NOT NULL THEN
    INSERT INTO wiki_guide_categories (guide_id, category_id)
    VALUES (guide_id, category_id)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
```

**For multiple categories:**

```sql
DO $$
DECLARE
  guide_id UUID;
  cat_ids UUID[];
  cat_id UUID;
BEGIN
  SELECT id INTO guide_id FROM wiki_guides WHERE slug = 'your-guide-slug';
  SELECT ARRAY_AGG(id) INTO cat_ids
  FROM wiki_categories
  WHERE slug IN ('category-1', 'category-2', 'category-3');

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

### Common Formatting Mistakes

❌ **WRONG - All on one line:**
```sql
INSERT INTO wiki_guides (title, slug, summary, content) VALUES ('Title', 'slug', 'summary', 'content');
```

❌ **WRONG - Missing E prefix for escaped strings:**
```sql
content = 'Line 1\nLine 2\nLine 3'  -- \n will be literal text
```

❌ **WRONG - Unescaped single quote:**
```sql
title = 'Farmer's Guide'  -- Will cause syntax error
```

❌ **WRONG - Mixing formats:**
```sql
INSERT INTO wiki_guides (title, slug) VALUES (
'Title', 'slug');  -- Inconsistent formatting
```

✅ **CORRECT:**
```sql
INSERT INTO wiki_guides (
  title,
  slug,
  summary,
  content,
  status
) VALUES (
  'Farmer''s Guide to Composting',
  'farmers-guide-composting',
  'Learn composting techniques that work on working farms.',
  E'# Farmer''s Guide to Composting\n\n## Introduction\n\nComposting on a farm...',
  'published'
);
```

### Complete Example Seed File

```sql
/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/seeds/005_example_content.sql
 * Description: Example seed file demonstrating proper formatting
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-15
 */

-- ================================================
-- WIKI GUIDES
-- ================================================

INSERT INTO wiki_guides (
  title,
  slug,
  summary,
  content,
  status,
  view_count,
  published_at
) VALUES (
  'Example Guide Title',
  'example-guide-title',
  'This is a concise summary explaining what readers will learn in 150-250 characters.',
  E'# Example Guide Title\n\n## Introduction\n\nFull markdown content here with proper escaping.\n\n**Key Points:**\n- Point 1\n- Point 2\n- Point 3\n\n## Section 2\n\nMore content...',
  'published',
  0,
  NOW()
);

-- Link guide to categories
DO $$
DECLARE
  guide_id UUID;
  cat_ids UUID[];
  cat_id UUID;
BEGIN
  SELECT id INTO guide_id FROM wiki_guides WHERE slug = 'example-guide-title';
  SELECT ARRAY_AGG(id) INTO cat_ids FROM wiki_categories WHERE slug IN ('permaculture-design', 'gardening');

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

-- ================================================
-- WIKI EVENTS
-- ================================================

INSERT INTO wiki_events (
  title,
  slug,
  description,
  event_date,
  start_time,
  end_time,
  location_name,
  location_address,
  latitude,
  longitude,
  event_type,
  price,
  price_display,
  registration_url,
  max_attendees,
  status
) VALUES (
  'Example Workshop Title',
  'example-workshop-2026-06',
  'Full description of the workshop including what participants will learn, what is included, who should attend, and what to bring. This should be 300-1000 characters.',
  '2026-06-15',
  '10:00:00',
  '16:00:00',
  'Example Permaculture Farm',
  'Complete Address, City, Region, Country',
  50.0755,
  14.4378,
  'workshop',
  35.00,
  '€35',
  'https://example.com/register',
  25,
  'published'
);

-- ================================================
-- WIKI LOCATIONS
-- ================================================

INSERT INTO wiki_locations (
  name,
  slug,
  description,
  address,
  latitude,
  longitude,
  location_type,
  website,
  contact_email,
  tags,
  status
) VALUES (
  'Example Permaculture Farm',
  'example-permaculture-farm-prague',
  'Comprehensive description of the location covering its purpose, key features, educational opportunities, and significance. This should be 400-1500 characters with specific details about what makes this location unique and valuable to the permaculture community.',
  'Street Address, Prague, Czech Republic',
  50.0755,
  14.4378,
  'farm',
  'https://example-farm.cz',
  'info@example-farm.cz',
  ARRAY['permaculture', 'education', 'food-forest', 'workshops', 'volunteers', 'organic', 'prague', 'czech-republic'],
  'published'
);
```

### Validation Tools

**Seed File Viewer (Browser-based):**
- Location: `/seed-file-viewer.html`
- Usage: Open in browser at `http://localhost:3000/seed-file-viewer.html`
- Purpose: Visually review and verify seed file content before loading

**Seed File Analyzer (Command-line):**
- Location: `/scripts/analyze-seed-files.js`
- Usage: `node scripts/analyze-seed-files.js [--verbose]`
- Purpose: Detect duplicates, overlaps, and formatting issues

**Run validation BEFORE loading seed files into database!**

### File Naming Conventions

**Seed files should be named:**
- `00X_descriptive_name.sql` for numbered sequence
- `descriptive_name.sql` for special content
- Use lowercase with underscores
- Include subject matter in name

**Good names:**
- `003_expanded_wiki_categories.sql`
- `004_future_events_seed.sql`
- `005_european_locations.sql`
- `seed_madeira_czech.sql`

**Bad names:**
- `new.sql` (not descriptive)
- `Test123.sql` (mixed case, unclear purpose)
- `wiki-content.sql` (use underscores not hyphens)

### Loading Seed Files

**Order of operations:**

1. **Create and validate seed file**
   - Write SQL following exact format above
   - Check for syntax errors
   - Test with seed-file-viewer.html

2. **Stage file:**
   - Place in `/supabase/to-be-seeded/` for review
   - Run analyzer to check for duplicates
   - Review in viewer

3. **Move to seeds:**
   - Once approved, move to `/supabase/seeds/`
   - Number sequentially

4. **Load into database:**
   - Run in Supabase SQL Editor
   - Or use Supabase CLI: `supabase db seed`

### Troubleshooting

**Parser can't find content:**
- Check that INSERT statements match exact format
- Verify column list is in parentheses
- Ensure VALUES keyword is present
- Check for closing `);` semicolon

**String parsing errors:**
- Use E'...' for content with newlines
- Escape single quotes by doubling: `''`
- Check for unmatched quotes
- Verify escape sequences are correct

**Category linking fails:**
- Verify guide/category slugs exist in database
- Check for typos in slug names
- Ensure ON CONFLICT DO NOTHING is included
- Run guide INSERT before category linking block

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
  title, slug, summary, content, status
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
  'published'
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

## Content Verification & Source Citation Requirements

**CRITICAL:** All guides must be verified for accuracy, relevance, and proper sourcing before publication.

### 1. Content Alignment Verification

Before publishing any guide, verify that all three core elements are aligned:

#### Title ↔ Summary Alignment
- Does the summary accurately reflect what the title promises?
- Does the summary describe the same topic as the title?
- Is the scope in the summary consistent with the title's scope?

**Example - GOOD:**
- Title: "Starting Your First Backyard Flock"
- Summary: "Everything you need to know about raising chickens in your backyard, from coop design to daily care routines."
- ✅ Aligned: Summary delivers on title's promise

**Example - BAD:**
- Title: "Starting Your First Backyard Flock"
- Summary: "Learn about sustainable animal husbandry practices including chickens, ducks, rabbits, and goats."
- ❌ Misaligned: Summary is broader than title suggests

#### Title ↔ Content Alignment
- Does the content deliver what the title promises?
- Are all major sections relevant to the title's topic?
- Does the content stay focused on the stated subject?

**Check for:**
- Off-topic sections that belong in different guides
- Content that's too broad or too narrow for the title
- Missing essential topics that the title implies

#### Summary ↔ Content Alignment
- Does the full content match what the summary describes?
- Are the key points mentioned in the summary actually covered in depth?
- Does the content provide what the summary promises?

**Red flags:**
- Summary promises specific information not in content
- Content covers topics not mentioned in summary
- Summary oversells what content delivers

### 2. Subject Matter Relevance Check

Every guide must demonstrate clear relevance to permaculture, sustainable living, or regenerative practices.

#### Permaculture/Sustainability Focus
Ask these questions:
- Does this topic relate to permaculture principles or ethics?
- Does it support sustainable living or regenerative practices?
- Is it relevant to the Permahub community's mission?

**Valid permaculture connections:**
- Food production and preservation
- Ecological design and systems thinking
- Resource cycling and waste reduction
- Community building and social permaculture
- Renewable energy and appropriate technology
- Biodiversity and ecosystem restoration
- Traditional and indigenous knowledge
- Climate adaptation and resilience

**Invalid topics (don't belong in Permahub):**
- Conventional industrial agriculture
- Synthetic chemical-dependent practices
- Unsustainable resource extraction
- Topics with no connection to sustainability

#### Topic Accuracy
- Is the guide actually about what it claims to be about?
- Does it accurately represent the topic without misleading readers?
- Are technical terms used correctly?

#### Practical Value Assessment
- Does the guide provide actionable, useful information?
- Can readers apply what they learn?
- Are there specific steps, measurements, or techniques?
- Does it go beyond surface-level information?

### 3. External Source Verification

**MANDATORY:** Every guide must be verified against authoritative external sources.

#### Step 1: Check for Wikipedia Article

Search Wikipedia for an article on the exact topic:

```
Search query: "[topic name] wikipedia"
Example: "vermicomposting wikipedia"
```

**If Wikipedia article exists:**
- Record the URL
- Verify the guide's main facts against Wikipedia
- Check that the guide's scope matches Wikipedia's treatment
- Note any discrepancies or errors
- Ensure information is current (check Wikipedia's last update)

**If NO Wikipedia article exists:**
- Document this fact: "No Wikipedia article found for [topic]"
- Proceed to Step 2 (alternative sources)

#### Step 2: Find Alternative Credible Sources (if no Wikipedia)

If no Wikipedia article exists, find at least **2 authoritative sources** that cover this topic.

**Acceptable source types:**
- University extension services (.edu domains)
- Government agricultural agencies (.gov domains)
- Established permaculture organizations
- Peer-reviewed publications
- Recognized subject matter experts with credentials
- Books by authorities in the field

**Unacceptable source types:**
- Personal blogs without credentials
- Commercial sites primarily selling products
- Social media posts
- AI-generated content farms
- Sites with no verifiable authorship

**Source relevance requirement:**
- Sources must be **tightly relevant** to the specific topic
- Not just tangentially related
- Must cover the main aspects discussed in the guide

**Example - GOOD sources for "Vermicomposting Guide":**
1. Oregon State University Extension: "Worm Composting" (https://extension.oregonstate.edu/...)
2. EPA Guide: "Vermicomposting" (https://www.epa.gov/...)
✅ Both directly about vermicomposting

**Example - BAD sources:**
1. "General Composting Methods" (too broad)
2. "Selling Worm Castings as a Business" (tangentially related)
❌ Not tightly focused on the topic

#### Step 3: Verify Content Accuracy

Compare the guide's content against external sources:

**Check for:**
- Factual accuracy (do facts match sources?)
- Completeness (does guide cover main aspects from sources?)
- Currency (is information up-to-date?)
- Contradictions (does guide contradict authoritative sources?)

**Document findings:**
```
Source Verification Results:
- Wikipedia: [URL or "Not found"]
- Source 1: [Name and URL]
- Source 2: [Name and URL]
- Accuracy: [Pass/Fail + notes on any discrepancies]
- Completeness: [Covers main topics / Missing key aspects]
- Last verified: [Date]
```

#### Step 4: Search for Better Sources (if needed)

If existing sources are insufficient:

**Perform thorough web research:**
```
Use search queries:
- "[topic] site:.edu"
- "[topic] site:.gov"
- "[topic] permaculture"
- "[topic] research study"
- "[topic] extension service"
```

**Find and evaluate sources:**
1. Check author credentials
2. Verify publication date (prefer recent)
3. Assess depth of coverage
4. Compare multiple sources for consensus
5. Select the 2-3 best authoritative sources

**Update guide if needed:**
- Correct any errors found
- Add missing essential information
- Cite sources in guide's "Resources & Further Learning" section

### 4. Source Citation Format

#### In Guide Content (Resources Section)

Every guide must include a "Resources & Further Learning" section with cited sources:

```markdown
## Resources & Further Learning

**Verified Sources:**
- [Wikipedia: Vermicomposting](https://en.wikipedia.org/wiki/Vermicomposting) - Comprehensive overview (verified 2025-11-15)
- [Oregon State Extension: Worm Composting](https://extension.oregonstate.edu/...) - Research-based guide
- [EPA: Vermicomposting Guide](https://www.epa.gov/...) - Government resource

**Recommended Reading:**
- "Worms Eat My Garbage" by Mary Appelhof
- "The Worm Farmer's Handbook" by Rhonda Sherman

**Related Guides:**
- [Composting Methods for Different Soil Types](#)
- [Building Soil Food Web](#)
```

#### In Verification Documentation (SQL Comments)

When creating guides, include verification notes in SQL comments:

```sql
-- VERIFICATION NOTES
-- Wikipedia: https://en.wikipedia.org/wiki/Vermicomposting (verified 2025-11-15)
-- Source 1: Oregon State Extension - Worm Composting
-- Source 2: EPA Vermicomposting Guide
-- Accuracy: VERIFIED - All facts checked against sources
-- Last verification: 2025-11-15

INSERT INTO wiki_guides (
  title, slug, summary, content, status
) VALUES (
  'Vermicomposting: A Complete Guide',
  'vermicomposting-complete-guide',
  '...',
  E'...',
  'published'
);
```

### 5. Verification Checklist for Reviewers

Use this checklist when verifying any guide:

**Content Alignment:**
- [ ] Title accurately reflects content scope
- [ ] Summary matches both title and content
- [ ] Content delivers on title's promise
- [ ] No off-topic sections or content drift
- [ ] All sections relevant to main topic

**Subject Matter Relevance:**
- [ ] Clear connection to permaculture/sustainability
- [ ] Topic accurately represented
- [ ] Practical, actionable information provided
- [ ] Appropriate depth for topic

**External Source Verification:**
- [ ] Wikipedia article checked (record URL or "not found")
- [ ] If no Wikipedia: 2+ credible sources identified
- [ ] Sources are tightly relevant (not tangential)
- [ ] Sources are authoritative (.edu, .gov, experts)
- [ ] Content facts verified against sources
- [ ] No contradictions with authoritative sources
- [ ] Information is current (check dates)
- [ ] Sources cited in guide's Resources section

**Source Quality:**
- [ ] Sources have verifiable authorship
- [ ] Authors have relevant credentials/expertise
- [ ] Publication dates are reasonably recent
- [ ] Sources cover main aspects of topic
- [ ] Multiple sources show consensus on key facts

**Accuracy:**
- [ ] All facts checkable against sources
- [ ] Measurements and quantities are accurate
- [ ] Technical terms used correctly
- [ ] No misleading or false information
- [ ] Claims are supported by evidence

**Completeness:**
- [ ] Guide covers main aspects defined by sources
- [ ] Essential topics not omitted
- [ ] Depth appropriate for guide length
- [ ] Resources section complete with citations

### 6. Special Cases

#### Topics Without Strong Online Sources

For traditional/indigenous knowledge or emerging practices:

1. **Document the limitation:**
   - "Limited academic sources available for this traditional practice"
   - "Emerging technique with limited peer-reviewed research"

2. **Alternative verification:**
   - Interview with practitioners (document credentials)
   - Multiple practitioner accounts showing consensus
   - Historical/anthropological sources
   - Traditional knowledge databases

3. **Transparency requirement:**
   - Clearly state: "Based on traditional practice" or "Experimental technique"
   - Include practitioner experience notes
   - Encourage readers to verify locally

#### Contradictory Sources

If sources contradict each other:

1. **Present both perspectives:**
   - "Some sources recommend X, while others suggest Y"
   - Explain the context for each approach

2. **Cite all perspectives:**
   - List sources for each viewpoint
   - Let readers evaluate

3. **Provide reasoning:**
   - Explain why guide takes specific approach
   - Based on context, climate, scale, etc.

### 7. LLM Agent Instructions for Verification

When verifying content programmatically:

**Step-by-step process:**

1. **Extract topic from title**
   ```
   Guide title: "Vermicomposting: A Complete Guide"
   Topic: "vermicomposting"
   ```

2. **Search Wikipedia**
   ```
   Use WebSearch tool: "vermicomposting wikipedia"
   Record: URL or "No Wikipedia article found"
   ```

3. **If no Wikipedia, search for authoritative sources**
   ```
   Search: "vermicomposting site:.edu"
   Search: "vermicomposting extension service"
   Search: "vermicomposting site:.gov"
   Identify: 2-3 best sources
   ```

4. **Verify content against sources**
   ```
   Compare guide's key facts to sources
   Check: measurements, techniques, timeframes
   Note: any discrepancies or errors
   ```

5. **Assess alignment**
   ```
   Title vs Summary: Do they match?
   Title vs Content: Content deliver on promise?
   Summary vs Content: Content match summary?
   ```

6. **Document verification**
   ```
   Record:
   - Wikipedia URL or "Not found"
   - Alternative source URLs (if applicable)
   - Verification date
   - Pass/fail accuracy check
   - Any issues found
   ```

7. **If sources insufficient, search for better ones**
   ```
   Use multiple search strategies
   Evaluate source quality
   Select best authoritative sources
   Update documentation
   ```

**Automation note:** When generating guides, automatically include verified sources in the Resources section and SQL comments.

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
