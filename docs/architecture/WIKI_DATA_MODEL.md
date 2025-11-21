# Wiki Data Model Architecture

**File:** `/docs/architecture/WIKI_DATA_MODEL.md`

**Description:** Database schema, entity relationships, and data flow diagrams for the Permahub Wiki

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-21

---

## Overview

This document contains detailed entity-relationship diagrams and data flow specifications for the wiki database layer, showing:
- Entity relationships and cardinality
- Core content tables and structure
- Multi-language translation support
- User interaction features (favorites, collections)
- Data integrity constraints

---

## Diagram 1: Entity-Relationship Model - Core Content

```mermaid
erDiagram
    USERS ||--o{ GUIDES : creates
    USERS ||--o{ EVENTS : creates
    USERS ||--o{ LOCATIONS : creates
    USERS ||--o{ FAVORITES : adds
    USERS ||--o{ COLLECTIONS : creates

    GUIDES ||--o{ GUIDE_CATEGORIES : "belongs to"
    GUIDES ||--o{ GUIDE_TRANSLATIONS : "has"
    GUIDES ||--o{ FAVORITES : "is in"
    GUIDES ||--o{ COLLECTION_ITEMS : "can be in"

    EVENTS ||--o{ EVENT_TRANSLATIONS : "has"
    EVENTS ||--o{ FAVORITES : "is in"
    EVENTS ||--o{ COLLECTION_ITEMS : "can be in"

    LOCATIONS ||--o{ LOCATION_TRANSLATIONS : "has"
    LOCATIONS ||--o{ FAVORITES : "is in"
    LOCATIONS ||--o{ COLLECTION_ITEMS : "can be in"

    CATEGORIES ||--o{ GUIDE_CATEGORIES : "has"
    CATEGORIES ||--o{ CATEGORY_TRANSLATIONS : "has"

    COLLECTIONS ||--o{ COLLECTION_ITEMS : "contains"

    USERS {
        uuid id PK
        string email
        string full_name
        text bio
        string avatar_url
        float latitude
        float longitude
        string location
        boolean is_public_profile
        timestamp created_at
    }

    GUIDES {
        uuid id PK
        string title
        string slug
        text summary
        text content
        uuid author_id FK
        string status
        int view_count
        boolean allow_comments
        timestamp created_at
        timestamp published_at
    }

    EVENTS {
        uuid id PK
        string title
        string slug
        text description
        timestamp event_date
        time start_time
        time end_time
        uuid author_id FK
        string event_type
        float latitude
        float longitude
        string status
        timestamp created_at
    }

    LOCATIONS {
        uuid id PK
        string name
        string slug
        text description
        string address
        float latitude
        float longitude
        string location_type
        string website
        uuid author_id FK
        string status
        timestamp created_at
    }

    CATEGORIES {
        uuid id PK
        string name
        string slug
        string icon
        string color
        timestamp created_at
    }

    FAVORITES {
        uuid id PK
        uuid user_id FK
        string content_type
        uuid content_id
        timestamp created_at
    }

    COLLECTIONS {
        uuid id PK
        uuid user_id FK
        string name
        text description
        string icon
        boolean is_public
        timestamp created_at
    }

    GUIDE_CATEGORIES {
        uuid guide_id FK
        uuid category_id FK
    }

    COLLECTION_ITEMS {
        uuid id PK
        uuid collection_id FK
        string content_type
        uuid content_id
        timestamp added_at
    }

    GUIDE_TRANSLATIONS {
        uuid guide_id FK
        string language_code
        string title
        text summary
        text content
        timestamp created_at
    }

    EVENT_TRANSLATIONS {
        uuid event_id FK
        string language_code
        string title
        text description
        timestamp created_at
    }

    LOCATION_TRANSLATIONS {
        uuid location_id FK
        string language_code
        string name
        text description
        timestamp created_at
    }

    CATEGORY_TRANSLATIONS {
        uuid category_id FK
        string language_code
        string name
        text description
        timestamp created_at
    }
```

---

## Diagram 2: Content Type Hierarchy

```mermaid
graph TD
    Content["Content<br/>(Base Concept)"]

    Guide["Guide<br/>📚<br/>- Article<br/>- How-to<br/>- Tutorial"]

    Event["Event<br/>📅<br/>- Workshop<br/>- Meetup<br/>- Course"]

    Location["Location<br/>📍<br/>- Farm<br/>- Garden<br/>- Business"]

    Content --> Guide
    Content --> Event
    Content --> Location

    Guide -->|"has many"| Category["Categories"]
    Guide -->|"has many"| Comment["Comments<br/>(future)"]
    Guide -->|"can be"| Favorite["Favorited"]
    Guide -->|"can be in"| Collection["Collection"]

    Event -->|"has"| Date["event_date"]
    Event -->|"has"| Time["start_time,<br/>end_time"]
    Event -->|"has"| Contact["contact_email,<br/>contact_phone"]
    Event -->|"can be"| Favorite
    Event -->|"can be in"| Collection

    Location -->|"has"| Geo["latitude,<br/>longitude"]
    Location -->|"has"| Hours["opening_hours<br/>(JSONB)"]
    Location -->|"has"| Contact
    Location -->|"can be"| Favorite
    Location -->|"can be in"| Collection

    Favorite -->|"belongs to"| User["User"]
    Collection -->|"belongs to"| User

    style Content fill:#fff3e0
    style Guide fill:#e1f5ff
    style Event fill:#e8f5e9
    style Location fill:#fce4ec
    style User fill:#fff9c4
```

---

## Diagram 3: Multi-Language Content Structure

```mermaid
graph TB
    subgraph Original["Original Content"]
        Guide["wiki_guides<br/>- title (default)<br/>- slug<br/>- content (default)<br/>- author_id<br/>- created_at"]
    end

    subgraph Translations["Translation Tables"]
        GuideTransPT["wiki_guide_translations<br/>language_code='pt'<br/>- title (português)<br/>- content (português)"]
        GuideTransES["wiki_guide_translations<br/>language_code='es'<br/>- title (español)<br/>- content (español)"]
        GuideTransDE["wiki_guide_translations<br/>language_code='de'<br/>- title (deutsch)<br/>- content (deutsch)"]
    end

    subgraph Categories["Category Translations"]
        CatTransPT["wiki_category_translations<br/>language_code='pt'<br/>- name"]
        CatTransES["wiki_category_translations<br/>language_code='es'<br/>- name"]
    end

    subgraph Fallback["Language Fallback"]
        Req["User requests<br/>language='ja'"]
        Check["Translation exists<br/>for 'ja'?"]
        NoJA["❌ No"]
        FallbackEN["✓ Use 'en'<br/>or original"]
    end

    Guide --> GuideTransPT
    Guide --> GuideTransES
    Guide --> GuideTransDE

    Guide -->|"Related"| Categories
    Categories --> CatTransPT
    Categories --> CatTransES

    Req --> Check
    Check --> NoJA
    NoJA --> FallbackEN

    style Original fill:#e1f5ff
    style Translations fill:#fff3e0
    style Categories fill:#e8f5e9
    style Fallback fill:#f3e5f5
```

---

## Diagram 4: Data Flow - Guide Creation to Display

```mermaid
graph TD
    Step1["Step 1:<br/>User creates guide<br/>wiki-editor.html"]
    Step2["Step 2:<br/>Form data collected<br/>(title, content, category)"]
    Step3["Step 3:<br/>POST /wiki_guides"]
    Step4["Step 4:<br/>Server validates<br/>& RLS check"]
    Step5["Step 5:<br/>INSERT into<br/>wiki_guides table"]
    Step6["Step 6:<br/>INSERT into<br/>wiki_guide_categories"]
    Step7["Step 7:<br/>Return guide_id"]

    Step8["Step 8:<br/>User publishes<br/>PATCH status='published'"]
    Step9["Step 9:<br/>Guide visible on<br/>wiki-home.html"]

    Step10["Step 10:<br/>User views guide<br/>wiki-page.html?slug=..."]
    Step11["Step 11:<br/>Query /wiki_guides?slug=eq.slug"]
    Step12["Step 12:<br/>Load translations<br/>for user language"]
    Step13["Step 13:<br/>Load category<br/>relationships"]
    Step14["Step 14:<br/>Load author<br/>profile"]
    Step15["Step 15:<br/>JOIN all data<br/>in JavaScript"]
    Step16["Step 16:<br/>Render complete<br/>guide page"]

    Step1 --> Step2
    Step2 --> Step3
    Step3 --> Step4
    Step4 --> Step5
    Step5 --> Step6
    Step6 --> Step7
    Step7 --> Step8
    Step8 --> Step9
    Step9 --> Step10
    Step10 --> Step11
    Step11 --> Step12
    Step12 --> Step13
    Step13 --> Step14
    Step14 --> Step15
    Step15 --> Step16

    style Step1 fill:#fff3e0
    style Step5 fill:#fce4ec
    style Step8 fill:#c8e6c9
    style Step10 fill:#e1f5ff
    style Step16 fill:#bbdefb
```

---

## Diagram 5: Favorites & Collections Structure

```mermaid
graph TB
    User["User<br/>user_id: 123"]

    Favorites["wiki_favorites<br/>User bookmarks"]
    Guide1["Guide: 'Soil Building'<br/>guide_id: abc"]
    Guide2["Guide: 'Composting'<br/>guide_id: def"]
    Event1["Event: 'Workshop'<br/>event_id: ghi"]

    Collections["wiki_collections<br/>User collections"]
    Coll1["'My Soil Knowledge'<br/>collection_id: x1"]
    Coll2["'Upcoming Events'<br/>collection_id: x2"]

    CollItems1["wiki_collection_items"]
    CollItems2["wiki_collection_items"]

    Item1["'Soil Building'<br/>content_type: guide"]
    Item2["'Composting'<br/>content_type: guide"]
    Item3["'Workshop'<br/>content_type: event"]

    User --> Favorites
    User --> Collections

    Favorites --> Guide1
    Favorites --> Guide2
    Favorites --> Event1

    Collections --> Coll1
    Collections --> Coll2

    Coll1 --> CollItems1
    Coll2 --> CollItems2

    CollItems1 --> Item1
    CollItems1 --> Item2
    CollItems2 --> Item3

    style User fill:#fff9c4
    style Favorites fill:#c8e6c9
    style Collections fill:#bbdefb
    style Coll1 fill:#e1f5ff
    style Coll2 fill:#e1f5ff
```

---

## Diagram 6: Geographic Data & PostGIS

```mermaid
graph LR
    Location["wiki_locations<br/>Table"]
    Lat["latitude<br/>float"]
    Lng["longitude<br/>float"]
    Geo["location<br/>geography"]

    Location -->|"Stores as"| Lat
    Location -->|"Stores as"| Lng
    Location -->|"Computed from"| Geo

    subgraph Queries["Spatial Queries"]
        NearbyQuery["Find locations<br/>within 50km<br/>of point"]
        WithinBox["Find within<br/>bounding box"]
    end

    Geo -->|"Enables fast"| NearbyQuery
    Geo -->|"Enables fast"| WithinBox

    subgraph UI["UI Components"]
        Map["Leaflet Map<br/>wiki-map.html"]
        Markers["Location Markers"]
        Distance["Calculate distance<br/>haversine.js"]
    end

    NearbyQuery -->|"Results"| Map
    Map -->|"Render"| Markers
    Distance -->|"Alternative"| Markers

    style Location fill:#fce4ec
    style Geo fill:#fff3e0
    style Queries fill:#e8f5e9
    style UI fill:#e1f5ff
```

---

## Diagram 7: Database Constraints & Integrity

```mermaid
graph TD
    Table["All Tables<br/>RLS: ENABLED"]

    PK["Primary Keys<br/>uuid id<br/>NOT NULL<br/>UNIQUE"]

    FK["Foreign Keys<br/>author_id -> users(id)<br/>user_id -> users(id)<br/>category_id -> categories(id)"]

    RLS["Row-Level<br/>Security<br/>Policies"]

    Unique["Unique<br/>Constraints<br/>- guides.slug<br/>- favorites<br/>(user_id,<br/>content_type,<br/>content_id)"]

    Cascade["Cascade<br/>Behavior<br/>- ON DELETE CASCADE<br/>- ON UPDATE CASCADE"]

    Indexes["Indexes<br/>- status<br/>- author_id<br/>- category_id<br/>- geography<br/>(PostGIS)"]

    Triggers["Triggers<br/>- Update geography<br/>from lat/lng<br/>- Update timestamps"]

    Table --> PK
    Table --> FK
    Table --> RLS
    Table --> Unique
    Table --> Cascade
    Table --> Indexes
    Table --> Triggers

    style Table fill:#fff9c4
    style RLS fill:#ffcdd2
    style PK fill:#c8e6c9
    style FK fill:#bbdefb
    style Cascade fill:#fff3e0
    style Indexes fill:#f3e5f5
    style Triggers fill:#e8f5e9
```

---

## Diagram 8: Status Flow - Content Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Published
    Draft --> Deleted
    Published --> Archived
    Published --> Deleted
    Archived --> Published
    Archived --> Deleted
    Deleted --> [*]

    note right of Draft
        Only visible to owner
        Can edit/delete freely
        Not in public views
    end note

    note right of Published
        Visible to everyone
        Shows in home/search
        Can comment (if enabled)
        Can bookmark
    end note

    note right of Archived
        Hidden from home/search
        Still visible if direct link
        Accessible to owner
        Can revert to published
    end note

    note right of Deleted
        Not recoverable
        Moved to deleted_content view
        Can view history
    end note
```

---

## Key Table Specifications

### wiki_guides
**Purpose:** Store educational articles, how-tos, and guides

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | uuid | PK | auto-generated |
| `title` | text | NOT NULL | primary language |
| `slug` | text | UNIQUE | URL-friendly name |
| `summary` | text | | preview text |
| `content` | text | | Quill.js HTML |
| `author_id` | uuid | FK users | who created |
| `status` | enum | draft\|published\|archived | visibility |
| `view_count` | integer | DEFAULT 0 | analytics |
| `allow_comments` | boolean | DEFAULT false | future feature |
| `allow_edits` | boolean | DEFAULT false | community edits |
| `featured_image` | text | | URL to image |
| `created_at` | timestamp | DEFAULT now() | creation time |
| `updated_at` | timestamp | DEFAULT now() | last edit |
| `published_at` | timestamp | | when published |

### wiki_locations
**Purpose:** Store physical locations (farms, gardens, businesses, communities)

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | uuid | PK | auto-generated |
| `name` | text | NOT NULL | location name |
| `slug` | text | UNIQUE | URL-friendly |
| `address` | text | | street address |
| `latitude` | float | | for mapping |
| `longitude` | float | | for mapping |
| `location` | geography | | PostGIS point |
| `location_type` | enum | farm\|garden\|business\|education\|community | category |
| `website` | text | | contact URL |
| `contact_email` | text | | new field |
| `contact_phone` | text | | new field |
| `opening_hours` | jsonb | | { "mon": "9-5", ... } |
| `tags` | text[] | | searchable tags |
| `author_id` | uuid | FK users | who created |
| `status` | enum | draft\|published\|archived | visibility |
| `created_at` | timestamp | DEFAULT now() | |

### wiki_favorites
**Purpose:** User bookmarks for any content type

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | uuid | PK | auto-generated |
| `user_id` | uuid | FK users | who favorited |
| `content_type` | enum | guide\|event\|location | what type |
| `content_id` | uuid | | ID of content |
| `created_at` | timestamp | DEFAULT now() | when added |
| - | - | UNIQUE(user_id, content_type, content_id) | prevent duplicates |

### wiki_collections
**Purpose:** User-created collections of content

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | uuid | PK | auto-generated |
| `user_id` | uuid | FK users | owner |
| `name` | text | NOT NULL | collection name |
| `description` | text | | what's it about |
| `icon` | text | | font awesome icon |
| `is_public` | boolean | DEFAULT false | shareable |
| `created_at` | timestamp | DEFAULT now() | |
| `updated_at` | timestamp | DEFAULT now() | |

---

## Translation Tables Pattern

All content tables have corresponding translation tables:
- `wiki_guides` ↔ `wiki_guide_translations`
- `wiki_events` ↔ `wiki_event_translations`
- `wiki_locations` ↔ `wiki_location_translations`
- `wiki_categories` ↔ `wiki_category_translations`

**Pattern:**
```sql
CREATE TABLE wiki_guide_translations (
    guide_id UUID NOT NULL REFERENCES wiki_guides(id) ON DELETE CASCADE,
    language_code VARCHAR(5) NOT NULL,
    title TEXT,
    summary TEXT,
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (guide_id, language_code)
);
```

This allows content to be stored in multiple languages while maintaining referential integrity.

---

## Row-Level Security Policies

All tables enforce RLS with these policy patterns:

**Public Read:**
```sql
CREATE POLICY "public_read" ON wiki_guides
  FOR SELECT USING (status = 'published' OR auth.uid() = author_id);
```

**Owner Write:**
```sql
CREATE POLICY "owner_write" ON wiki_guides
  FOR UPDATE USING (auth.uid() = author_id);
```

**Prevent Delete:**
```sql
CREATE POLICY "prevent_delete" ON wiki_guides
  FOR DELETE USING (FALSE);  -- Use status='deleted' instead
```

---

## Performance Considerations

**Indexes Created:**
```sql
-- Fast lookups by status and author
CREATE INDEX guides_status_idx ON wiki_guides(status);
CREATE INDEX guides_author_idx ON wiki_guides(author_id);

-- Fast geography queries
CREATE INDEX locations_geo_idx ON wiki_locations USING GIST (location);

-- Fast slug lookups
CREATE UNIQUE INDEX guides_slug_idx ON wiki_guides(slug);

-- Fast favorite lookups
CREATE UNIQUE INDEX favorites_unique_idx
  ON wiki_favorites(user_id, content_type, content_id);
```

**Query Optimization:**
- Use select=slug,title,summary for list views (smaller payload)
- Filter on server side (WHERE clauses) not client side
- Use limit and offset for pagination
- Join translations in JavaScript for flexibility

---

## Related Documents

- [WIKI_SYSTEM_ARCHITECTURE.md](./WIKI_SYSTEM_ARCHITECTURE.md) - System integration
- [WIKI_COMPONENT_ARCHITECTURE.md](./WIKI_COMPONENT_ARCHITECTURE.md) - How frontend accesses data
- [SUPABASE_SETUP_GUIDE.md](../../SUPABASE_SETUP_GUIDE.md) - Schema setup instructions

---

**Status:** Complete

**Last Review:** 2025-11-21
