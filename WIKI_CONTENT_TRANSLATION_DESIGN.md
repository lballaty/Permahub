# Wiki Content Translation System Design

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/WIKI_CONTENT_TRANSLATION_DESIGN.md
**Description:** Design for persistent database-backed translation system for wiki content
**Author:** Libor Ballaty <libor@arionetworks.com>
**Created:** 2025-11-12

---

## Overview

This document describes the architecture for a persistent, database-backed translation system for wiki content (Guides/Articles, Events, and Locations). Rather than generating translations on-the-fly, translations are stored in the database and reused across users.

## Architecture

### Key Principles

1. **Store translations in database** - First user's translation request triggers AI generation and storage
2. **Reuse for all users** - Subsequent requests retrieve stored translation instantly
3. **Multiple versions** - Each content piece can have translations in multiple languages
4. **Original content preserved** - Original language version always available
5. **Track origin** - Record which user requested/contributed each translation

## Database Schema

### Table: `wiki_content`

Stores the original wiki content (guides, events, locations).

```sql
CREATE TABLE public.wiki_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Content metadata
  content_type TEXT NOT NULL CHECK (content_type IN ('guide', 'event', 'location')),
  original_language TEXT NOT NULL DEFAULT 'en', -- Language content was created in

  -- Core content
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL, -- HTML or Markdown

  -- Featured image
  featured_image_url TEXT,
  featured_image_alt_text TEXT,

  -- Categorization
  categories TEXT[], -- Array of category IDs/slugs
  eco_theme_ids UUID[], -- Related eco-themes

  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),

  -- Event-specific fields
  event_date DATE,
  event_start_time TIME,
  event_end_time TIME,
  event_location TEXT,

  -- Location-specific fields
  location_address TEXT,
  location_latitude DECIMAL(10, 8),
  location_longitude DECIMAL(11, 8),

  -- Publishing settings
  allow_comments BOOLEAN DEFAULT true,
  allow_edit_suggestions BOOLEAN DEFAULT true,
  notify_community BOOLEAN DEFAULT false,

  -- Audit trail
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  view_count INTEGER DEFAULT 0,

  UNIQUE(slug, content_type),
  INDEX idx_content_type(content_type),
  INDEX idx_status(status),
  INDEX idx_language(original_language)
);
```

### Table: `wiki_content_translations`

Stores translated versions of wiki content.

```sql
CREATE TABLE public.wiki_content_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Reference to original content
  content_id UUID NOT NULL REFERENCES public.wiki_content(id) ON DELETE CASCADE,

  -- Language of this translation
  language_code TEXT NOT NULL, -- 'pt', 'es', 'fr', etc.

  -- Translated content
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL, -- Translated HTML or Markdown

  -- Event-specific translated fields (if applicable)
  event_location TEXT,

  -- Location-specific translated fields (if applicable)
  location_address TEXT,

  -- Translation metadata
  translation_source TEXT NOT NULL DEFAULT 'ai' CHECK (translation_source IN ('ai', 'user', 'editor')),
  translated_by UUID REFERENCES auth.users(id), -- User who contributed/approved

  -- Translation quality
  quality_score DECIMAL(3, 2), -- 1.00 to 5.00 for human ratings
  is_approved BOOLEAN DEFAULT false, -- Editor approval

  -- Performance optimization
  translation_hash TEXT, -- Hash of original content for change detection

  -- Audit trail
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Constraints and indexes
  UNIQUE(content_id, language_code),
  FOREIGN KEY (content_id) REFERENCES public.wiki_content(id) ON DELETE CASCADE,
  INDEX idx_language(language_code),
  INDEX idx_source(translation_source),
  INDEX idx_approved(is_approved)
);
```

### Table: `wiki_translation_requests`

Tracks translation requests for audit and analytics.

```sql
CREATE TABLE public.wiki_translation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Request details
  content_id UUID NOT NULL REFERENCES public.wiki_content(id) ON DELETE CASCADE,
  requested_language TEXT NOT NULL,

  -- Requester
  requested_by UUID REFERENCES auth.users(id), -- NULL if anonymous

  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),

  -- Translation result
  translation_id UUID REFERENCES public.wiki_content_translations(id),
  error_message TEXT,

  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,

  INDEX idx_status(status),
  INDEX idx_language(requested_language),
  INDEX idx_content(content_id)
);
```

### Table: `wiki_translation_credits`

Tracks user contributions to translations (for gamification/credits).

```sql
CREATE TABLE public.wiki_translation_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User who contributed
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Translation contributed
  translation_id UUID NOT NULL REFERENCES public.wiki_content_translations(id) ON DELETE CASCADE,

  -- Contribution type
  contribution_type TEXT NOT NULL CHECK (contribution_type IN ('created', 'reviewed', 'improved')),

  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Points for gamification
  points_awarded INTEGER DEFAULT 10,

  UNIQUE(user_id, translation_id, contribution_type),
  INDEX idx_user(user_id),
  INDEX idx_translation(translation_id)
);
```

## API Flow

### User Views Content in Different Language

```
1. User opens wiki-page.html viewing a Guide (e.g., "Building a Swale")
2. Page displays in English (original_language)
3. User changes language selector to Portuguese
4. JavaScript calls: GET /api/wiki/content/{content_id}/translation?language=pt

API Response:
- If translation exists in DB → Return from wiki_content_translations table
- If translation doesn't exist:
  - Check if request in progress (avoid duplicate AI calls)
  - If not in progress → Trigger async translation job
  - Return { translation: null, status: "pending", estimated_wait: 5000 }

5. If pending, UI shows:
   - "Translation being generated for Portuguese..."
   - Refresh button or polling every 3 seconds

6. Once translation completes:
   - Wiki page content replaces with translated version
   - Link at bottom: "View in: English | View Original"
   - Or keep both side-by-side if user prefers
```

### Translation Generation Flow

```
1. Edge Function: translate-wiki-content
   - Input: content_id, language_code
   - Fetch original content from wiki_content
   - Check if translation already exists (return if yes)
   - Generate AI translation using Claude API
   - Store in wiki_content_translations
   - Record in wiki_translation_requests
   - Return translation

2. Error Handling:
   - If AI translation fails → Mark request as failed
   - Retry logic (exponential backoff)
   - Fallback to original language if all retries exhausted

3. Performance:
   - Translation hashing to detect if content changed
   - If original changed significantly → Invalidate translation
   - Prompt users to re-request translation
```

## Frontend Integration

### UI Components Needed

1. **Translation Selector** (on wiki-page.html)
```
Current Language: [English ▼]
├─ English (Original)
├─ Português
├─ Español
├─ Français
└─ Generate Translation → (translates to other languages on demand)
```

2. **Translation Status Indicator**
```
🔄 Translating to Portuguese...
```

3. **Translation Attribution**
```
💬 This is an AI-generated translation
[View Original] [Report Issue] [Improve Translation]
```

## Implementation Phases

### Phase 1: Database & Schema
- [ ] Create migration for wiki_content table
- [ ] Create migration for wiki_content_translations table
- [ ] Create migration for wiki_translation_requests table
- [ ] Create migration for wiki_translation_credits table
- [ ] Add RLS policies

### Phase 2: Backend APIs
- [ ] Create edge function: get-wiki-translation
- [ ] Create edge function: translate-wiki-content (async)
- [ ] Create edge function: list-available-translations
- [ ] Implement caching logic

### Phase 3: Frontend UI
- [ ] Add translation selector to wiki-page.html
- [ ] Add translation status indicator
- [ ] Implement polling for pending translations
- [ ] Add translation attribution display

### Phase 4: Quality & Analytics
- [ ] Implement translation quality scoring
- [ ] Create user feedback system for translations
- [ ] Track translation usage analytics
- [ ] Create dashboard for translation stats

## Performance Considerations

### Caching Strategy
- Cache translations in browser localStorage for 30 days
- Cache in Supabase cache layer (1 hour)
- Hash-based invalidation if content changes > 10%

### Async Translation
- Use Supabase background jobs for translations
- Parallel translation requests allowed (different languages)
- Maximum 5 concurrent translations per content item

### Database Indexes
- Index on (content_id, language_code) for quick lookups
- Index on language_code for analytics
- Index on translation_source for filtering

## Example Usage

### User Story: Portuguese Speaker Reads Guide

1. User opens wiki-page.html for "Building a Swale System"
2. Content displays in English
3. Language selector shows: [English ▼]
4. User clicks and selects Portuguese
5. System checks: wiki_content_translations for (content_id, 'pt')
6. Translation not found → Triggers async AI translation
7. UI shows: "🔄 Translating to Portuguese..."
8. After ~5 seconds, Portuguese translation appears
9. Content now displays:
   - Translated title, summary, content
   - "💬 AI-Generated Translation | [View Original]"
10. Next user requests Portuguese → Retrieved instantly from DB

---

## Questions & Next Steps

Ready to implement Phase 1 (Database Schema)?
