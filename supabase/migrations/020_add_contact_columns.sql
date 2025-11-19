-- ============================================================================
-- Migration: Add Contact Information Columns
-- File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/migrations/020_add_contact_columns.sql
-- Description: Adds contact and organizer information columns to wiki_events and wiki_locations tables
-- Author: Libor Ballaty <libor@arionetworks.com>
-- Created: 2025-11-19
-- ============================================================================

-- ============================================================================
-- WIKI EVENTS: Add organizer and contact columns
-- ============================================================================

-- Add organizer and contact columns to wiki_events
ALTER TABLE public.wiki_events
  ADD COLUMN IF NOT EXISTS organizer_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS organizer_organization VARCHAR(255),
  ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255),
  ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50),
  ADD COLUMN IF NOT EXISTS contact_website VARCHAR(500);

-- Add index for contact email lookups
CREATE INDEX IF NOT EXISTS idx_wiki_events_contact_email
  ON public.wiki_events(contact_email)
  WHERE contact_email IS NOT NULL;

-- Add comments
COMMENT ON COLUMN public.wiki_events.organizer_name IS 'Name of the event organizer';
COMMENT ON COLUMN public.wiki_events.organizer_organization IS 'Organization hosting the event';
COMMENT ON COLUMN public.wiki_events.contact_email IS 'Contact email for event inquiries';
COMMENT ON COLUMN public.wiki_events.contact_phone IS 'Contact phone number for event inquiries';
COMMENT ON COLUMN public.wiki_events.contact_website IS 'Website URL for more event information';

-- ============================================================================
-- WIKI LOCATIONS: Add contact columns
-- ============================================================================

-- Add contact columns to wiki_locations
ALTER TABLE public.wiki_locations
  ADD COLUMN IF NOT EXISTS contact_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS contact_hours TEXT,
  ADD COLUMN IF NOT EXISTS social_media JSONB;

-- Add index for contact email lookups
CREATE INDEX IF NOT EXISTS idx_wiki_locations_contact_email
  ON public.wiki_locations(contact_email)
  WHERE contact_email IS NOT NULL;

-- Add comments
COMMENT ON COLUMN public.wiki_locations.contact_name IS 'Primary contact person name';
COMMENT ON COLUMN public.wiki_locations.contact_hours IS 'Hours when contact is available (free text)';
COMMENT ON COLUMN public.wiki_locations.social_media IS 'Social media links in JSON format (e.g., {"facebook": "url", "instagram": "url"})';

-- ============================================================================
-- Verification
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Migration 020: Contact Columns Added';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'wiki_events: Added 5 columns';
  RAISE NOTICE '  - organizer_name (VARCHAR 255)';
  RAISE NOTICE '  - organizer_organization (VARCHAR 255)';
  RAISE NOTICE '  - contact_email (VARCHAR 255)';
  RAISE NOTICE '  - contact_phone (VARCHAR 50)';
  RAISE NOTICE '  - contact_website (VARCHAR 500)';
  RAISE NOTICE '';
  RAISE NOTICE 'wiki_locations: Added 3 columns';
  RAISE NOTICE '  - contact_name (VARCHAR 255)';
  RAISE NOTICE '  - contact_hours (TEXT)';
  RAISE NOTICE '  - social_media (JSONB)';
  RAISE NOTICE '';
  RAISE NOTICE 'Indexes created for contact_email on both tables';
  RAISE NOTICE '========================================';
END $$;
