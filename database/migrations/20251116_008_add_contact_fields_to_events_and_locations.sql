/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/20251116_008_add_contact_fields_to_events_and_locations.sql
 * Description: Add comprehensive contact information fields to wiki_events and wiki_locations tables
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-16
 *
 * Purpose: Enable users to directly contact event organizers and location owners
 * Impact: Improves accessibility and user engagement
 */

-- =====================================================
-- ADD CONTACT FIELDS TO wiki_events
-- =====================================================

-- Add organizer and contact information fields
ALTER TABLE wiki_events
  ADD COLUMN IF NOT EXISTS organizer_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS organizer_organization VARCHAR(255),
  ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255),
  ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50),
  ADD COLUMN IF NOT EXISTS contact_website VARCHAR(500);

-- Add comments for documentation
COMMENT ON COLUMN wiki_events.organizer_name IS 'Name of person organizing the event';
COMMENT ON COLUMN wiki_events.organizer_organization IS 'Organization or group hosting the event';
COMMENT ON COLUMN wiki_events.contact_email IS 'Email address for event inquiries';
COMMENT ON COLUMN wiki_events.contact_phone IS 'Phone number for event inquiries';
COMMENT ON COLUMN wiki_events.contact_website IS 'Event-specific website (if different from registration_url)';

-- =====================================================
-- ADD CONTACT FIELDS TO wiki_locations
-- =====================================================

-- Add additional contact fields
ALTER TABLE wiki_locations
  ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50),
  ADD COLUMN IF NOT EXISTS contact_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS contact_hours TEXT,
  ADD COLUMN IF NOT EXISTS social_media JSONB;

-- Add comments for documentation
COMMENT ON COLUMN wiki_locations.contact_phone IS 'Primary phone number for location';
COMMENT ON COLUMN wiki_locations.contact_name IS 'Name of primary contact person';
COMMENT ON COLUMN wiki_locations.contact_hours IS 'Operating hours or visiting hours';
COMMENT ON COLUMN wiki_locations.social_media IS 'JSON object with social media links (facebook, instagram, twitter, etc.)';

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Index for email searches (privacy-aware)
CREATE INDEX IF NOT EXISTS idx_wiki_events_contact_email ON wiki_events(contact_email) WHERE contact_email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_wiki_locations_contact_email ON wiki_locations(contact_email) WHERE contact_email IS NOT NULL;

-- =====================================================
-- UPDATE RLS POLICIES (if needed)
-- =====================================================

-- Note: Contact information is public data for published events/locations
-- Existing RLS policies should cover these new fields
-- No changes needed unless we want to restrict contact info visibility

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check new columns exist
DO $$
BEGIN
  -- Verify wiki_events columns
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wiki_events'
    AND column_name IN ('organizer_name', 'contact_email', 'contact_phone')
  ) THEN
    RAISE NOTICE '✅ wiki_events contact fields added successfully';
  ELSE
    RAISE EXCEPTION '❌ Failed to add contact fields to wiki_events';
  END IF;

  -- Verify wiki_locations columns
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wiki_locations'
    AND column_name IN ('contact_phone', 'contact_name', 'contact_hours')
  ) THEN
    RAISE NOTICE '✅ wiki_locations contact fields added successfully';
  ELSE
    RAISE EXCEPTION '❌ Failed to add contact fields to wiki_locations';
  END IF;
END $$;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Success message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Migration 008 Complete!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Added to wiki_events:';
  RAISE NOTICE '  - organizer_name';
  RAISE NOTICE '  - organizer_organization';
  RAISE NOTICE '  - contact_email';
  RAISE NOTICE '  - contact_phone';
  RAISE NOTICE '  - contact_website';
  RAISE NOTICE '';
  RAISE NOTICE 'Added to wiki_locations:';
  RAISE NOTICE '  - contact_phone';
  RAISE NOTICE '  - contact_name';
  RAISE NOTICE '  - contact_hours';
  RAISE NOTICE '  - social_media (JSONB)';
  RAISE NOTICE '';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '  1. Update seed files with contact information';
  RAISE NOTICE '  2. Run updated seed files';
  RAISE NOTICE '  3. Verify contact information displays correctly';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;
