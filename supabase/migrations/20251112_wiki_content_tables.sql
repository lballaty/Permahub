-- Migration: Wiki Content and Translation Tables
-- Date: 2025-11-12
-- Description: Creates tables for storing wiki content (guides, events, locations) and their translations
-- Author: Libor Ballaty <libor@arionetworks.com>

-- Table: wiki_content
-- Stores original wiki content (guides, events, locations)
CREATE TABLE IF NOT EXISTS public.wiki_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Content metadata
  content_type TEXT NOT NULL CHECK (content_type IN ('guide', 'event', 'location')),
  original_language TEXT NOT NULL DEFAULT 'en',

  -- Core content
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,

  -- Featured image
  featured_image_url TEXT,
  featured_image_alt_text TEXT,

  -- Categorization
  categories TEXT[],
  eco_theme_ids UUID[],

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
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  view_count INTEGER DEFAULT 0,

  UNIQUE(slug, content_type)
);

-- Create indexes for wiki_content
CREATE INDEX IF NOT EXISTS idx_wiki_content_type ON public.wiki_content(content_type);
CREATE INDEX IF NOT EXISTS idx_wiki_content_status ON public.wiki_content(status);
CREATE INDEX IF NOT EXISTS idx_wiki_content_language ON public.wiki_content(original_language);
CREATE INDEX IF NOT EXISTS idx_wiki_content_slug ON public.wiki_content(slug);

-- Enable RLS on wiki_content
ALTER TABLE public.wiki_content ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view published content
CREATE POLICY "Anyone can view published wiki content" ON public.wiki_content
  FOR SELECT USING (status = 'published');

-- RLS Policy: Users can view their own drafts
CREATE POLICY "Users can view own draft content" ON public.wiki_content
  FOR SELECT USING (status = 'draft' AND auth.uid() = created_by);

-- RLS Policy: Authenticated users can create content
CREATE POLICY "Authenticated users can create wiki content" ON public.wiki_content
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- RLS Policy: Users can update their own content
CREATE POLICY "Users can update own wiki content" ON public.wiki_content
  FOR UPDATE USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = updated_by);

---

-- Table: wiki_content_translations
-- Stores translated versions of wiki content
CREATE TABLE IF NOT EXISTS public.wiki_content_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Reference to original content
  content_id UUID NOT NULL REFERENCES public.wiki_content(id) ON DELETE CASCADE,

  -- Language of this translation
  language_code TEXT NOT NULL,

  -- Translated content
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,

  -- Event-specific translated fields
  event_location TEXT,

  -- Location-specific translated fields
  location_address TEXT,

  -- Translation metadata
  translation_source TEXT NOT NULL DEFAULT 'ai' CHECK (translation_source IN ('ai', 'user', 'editor')),
  translated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Translation quality
  quality_score DECIMAL(3, 2),
  is_approved BOOLEAN DEFAULT false,

  -- Performance optimization
  translation_hash TEXT,

  -- Audit trail
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Constraints
  UNIQUE(content_id, language_code),
  FOREIGN KEY (content_id) REFERENCES public.wiki_content(id) ON DELETE CASCADE
);

-- Create indexes for wiki_content_translations
CREATE INDEX IF NOT EXISTS idx_wiki_translations_language ON public.wiki_content_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_wiki_translations_source ON public.wiki_content_translations(translation_source);
CREATE INDEX IF NOT EXISTS idx_wiki_translations_approved ON public.wiki_content_translations(is_approved);
CREATE INDEX IF NOT EXISTS idx_wiki_translations_content_id ON public.wiki_content_translations(content_id);

-- Enable RLS on wiki_content_translations
ALTER TABLE public.wiki_content_translations ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view translations for published content
CREATE POLICY "Anyone can view translations for published content" ON public.wiki_content_translations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.wiki_content w
      WHERE w.id = wiki_content_translations.content_id
      AND w.status = 'published'
    )
  );

-- RLS Policy: Users can view translations of their own drafts
CREATE POLICY "Users can view translations of own drafts" ON public.wiki_content_translations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.wiki_content w
      WHERE w.id = wiki_content_translations.content_id
      AND w.status = 'draft'
      AND auth.uid() = w.created_by
    )
  );

-- RLS Policy: Translation system can insert translations
CREATE POLICY "Translation service can insert translations" ON public.wiki_content_translations
  FOR INSERT WITH CHECK (true);

-- RLS Policy: Users can update their own translations
CREATE POLICY "Users can update own translations" ON public.wiki_content_translations
  FOR UPDATE USING (auth.uid() = translated_by)
  WITH CHECK (auth.uid() = translated_by);

---

-- Table: wiki_translation_requests
-- Tracks translation requests for audit and analytics
CREATE TABLE IF NOT EXISTS public.wiki_translation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Request details
  content_id UUID NOT NULL REFERENCES public.wiki_content(id) ON DELETE CASCADE,
  requested_language TEXT NOT NULL,

  -- Requester
  requested_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),

  -- Translation result
  translation_id UUID REFERENCES public.wiki_content_translations(id) ON DELETE SET NULL,
  error_message TEXT,

  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,

  INDEX idx_status(status),
  INDEX idx_language(requested_language),
  INDEX idx_content(content_id),
  INDEX idx_created(created_at)
);

-- Enable RLS on wiki_translation_requests
ALTER TABLE public.wiki_translation_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own translation requests
CREATE POLICY "Users can view own translation requests" ON public.wiki_translation_requests
  FOR SELECT USING (auth.uid() = requested_by);

-- RLS Policy: Translation service can insert requests
CREATE POLICY "Translation service can insert requests" ON public.wiki_translation_requests
  FOR INSERT WITH CHECK (true);

-- RLS Policy: Translation service can update request status
CREATE POLICY "Translation service can update request status" ON public.wiki_translation_requests
  FOR UPDATE USING (true)
  WITH CHECK (true);

---

-- Table: wiki_translation_credits
-- Tracks user contributions to translations (for gamification)
CREATE TABLE IF NOT EXISTS public.wiki_translation_credits (
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

  -- Constraints
  UNIQUE(user_id, translation_id, contribution_type)
);

-- Create indexes for wiki_translation_credits
CREATE INDEX IF NOT EXISTS idx_wiki_credits_user ON public.wiki_translation_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_wiki_credits_translation ON public.wiki_translation_credits(translation_id);

-- Enable RLS on wiki_translation_credits
ALTER TABLE public.wiki_translation_credits ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view translation credits
CREATE POLICY "Anyone can view translation credits" ON public.wiki_translation_credits
  FOR SELECT USING (true);

-- RLS Policy: System can insert credits
CREATE POLICY "System can insert translation credits" ON public.wiki_translation_credits
  FOR INSERT WITH CHECK (true);
