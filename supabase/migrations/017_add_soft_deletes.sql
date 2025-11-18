/*
 * Migration: Add Soft Delete Support
 *
 * Purpose: Implement soft deletes across wiki content tables to allow:
 * - Recovery of accidentally deleted content
 * - Audit trail of deletions
 * - Data preservation for analytics
 * - Compliance with data retention policies
 *
 * Tables Modified:
 * - wiki_guides
 * - wiki_events
 * - wiki_locations
 *
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-17
 */

-- ============================================================================
-- Add soft delete columns to wiki_guides
-- ============================================================================

ALTER TABLE wiki_guides
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id);

COMMENT ON COLUMN wiki_guides.deleted_at IS 'Timestamp when guide was soft-deleted. NULL means active.';
COMMENT ON COLUMN wiki_guides.deleted_by IS 'User ID who deleted this guide.';

-- ============================================================================
-- Add soft delete columns to wiki_events
-- ============================================================================

ALTER TABLE wiki_events
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id);

COMMENT ON COLUMN wiki_events.deleted_at IS 'Timestamp when event was soft-deleted. NULL means active.';
COMMENT ON COLUMN wiki_events.deleted_by IS 'User ID who deleted this event.';

-- ============================================================================
-- Add soft delete columns to wiki_locations
-- ============================================================================

ALTER TABLE wiki_locations
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id);

COMMENT ON COLUMN wiki_locations.deleted_at IS 'Timestamp when location was soft-deleted. NULL means active.';
COMMENT ON COLUMN wiki_locations.deleted_by IS 'User ID who deleted this location.';

-- ============================================================================
-- Create indexes for soft delete queries (performance optimization)
-- ============================================================================

-- Index for filtering out deleted guides
CREATE INDEX IF NOT EXISTS idx_wiki_guides_deleted_at
ON wiki_guides(deleted_at)
WHERE deleted_at IS NULL;

-- Index for filtering out deleted events
CREATE INDEX IF NOT EXISTS idx_wiki_events_deleted_at
ON wiki_events(deleted_at)
WHERE deleted_at IS NULL;

-- Index for filtering out deleted locations
CREATE INDEX IF NOT EXISTS idx_wiki_locations_deleted_at
ON wiki_locations(deleted_at)
WHERE deleted_at IS NULL;

-- Index for finding deleted content (for admin/restore features)
CREATE INDEX IF NOT EXISTS idx_wiki_guides_deleted_by
ON wiki_guides(deleted_by, deleted_at)
WHERE deleted_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_wiki_events_deleted_by
ON wiki_events(deleted_by, deleted_at)
WHERE deleted_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_wiki_locations_deleted_by
ON wiki_locations(deleted_by, deleted_at)
WHERE deleted_at IS NOT NULL;

-- ============================================================================
-- Helper function: Soft delete content
-- ============================================================================

CREATE OR REPLACE FUNCTION soft_delete_content(
  p_table_name TEXT,
  p_content_id UUID,
  p_user_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_sql TEXT;
BEGIN
  -- Validate table name to prevent SQL injection
  IF p_table_name NOT IN ('wiki_guides', 'wiki_events', 'wiki_locations') THEN
    RAISE EXCEPTION 'Invalid table name: %', p_table_name;
  END IF;

  -- Build dynamic SQL for soft delete
  v_sql := format(
    'UPDATE %I SET deleted_at = NOW(), deleted_by = $1, status = ''archived'' WHERE id = $2 AND deleted_at IS NULL',
    p_table_name
  );

  -- Execute soft delete
  EXECUTE v_sql USING p_user_id, p_content_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION soft_delete_content IS 'Soft delete content by setting deleted_at timestamp and changing status to archived';

-- ============================================================================
-- Helper function: Restore deleted content
-- ============================================================================

CREATE OR REPLACE FUNCTION restore_deleted_content(
  p_table_name TEXT,
  p_content_id UUID,
  p_user_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_sql TEXT;
  v_deleted_by UUID;
BEGIN
  -- Validate table name to prevent SQL injection
  IF p_table_name NOT IN ('wiki_guides', 'wiki_events', 'wiki_locations') THEN
    RAISE EXCEPTION 'Invalid table name: %', p_table_name;
  END IF;

  -- Check if user owns the deleted content
  v_sql := format('SELECT deleted_by FROM %I WHERE id = $1 AND deleted_at IS NOT NULL', p_table_name);
  EXECUTE v_sql INTO v_deleted_by USING p_content_id;

  -- Only allow restore if user is the one who deleted it (or is admin)
  IF v_deleted_by IS NULL THEN
    RAISE EXCEPTION 'Content not found or not deleted';
  END IF;

  IF v_deleted_by != p_user_id THEN
    -- TODO: Add admin role check here when roles are implemented
    RAISE EXCEPTION 'Only the user who deleted this content can restore it';
  END IF;

  -- Build dynamic SQL for restore
  v_sql := format(
    'UPDATE %I SET deleted_at = NULL, deleted_by = NULL, status = ''draft'' WHERE id = $1',
    p_table_name
  );

  -- Execute restore
  EXECUTE v_sql USING p_content_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION restore_deleted_content IS 'Restore soft-deleted content by clearing deleted_at timestamp';

-- ============================================================================
-- Helper function: Permanently delete old soft-deleted content (auto-purge)
-- ============================================================================

CREATE OR REPLACE FUNCTION purge_old_deleted_content(
  p_days_old INTEGER DEFAULT 30
) RETURNS TABLE (
  table_name TEXT,
  purged_count INTEGER
) AS $$
DECLARE
  v_cutoff_date TIMESTAMPTZ;
  v_guides_deleted INTEGER;
  v_events_deleted INTEGER;
  v_locations_deleted INTEGER;
BEGIN
  v_cutoff_date := NOW() - (p_days_old || ' days')::INTERVAL;

  -- Hard delete guides older than cutoff
  DELETE FROM wiki_guides
  WHERE deleted_at IS NOT NULL
    AND deleted_at < v_cutoff_date;
  GET DIAGNOSTICS v_guides_deleted = ROW_COUNT;

  -- Hard delete events older than cutoff
  DELETE FROM wiki_events
  WHERE deleted_at IS NOT NULL
    AND deleted_at < v_cutoff_date;
  GET DIAGNOSTICS v_events_deleted = ROW_COUNT;

  -- Hard delete locations older than cutoff
  DELETE FROM wiki_locations
  WHERE deleted_at IS NOT NULL
    AND deleted_at < v_cutoff_date;
  GET DIAGNOSTICS v_locations_deleted = ROW_COUNT;

  -- Return results
  RETURN QUERY
  SELECT 'wiki_guides'::TEXT, v_guides_deleted
  UNION ALL
  SELECT 'wiki_events'::TEXT, v_events_deleted
  UNION ALL
  SELECT 'wiki_locations'::TEXT, v_locations_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION purge_old_deleted_content IS 'Permanently delete soft-deleted content older than specified days (default 30)';

-- ============================================================================
-- Grant permissions
-- ============================================================================

-- Grant execute on helper functions to authenticated users
GRANT EXECUTE ON FUNCTION soft_delete_content TO authenticated;
GRANT EXECUTE ON FUNCTION restore_deleted_content TO authenticated;

-- Only admins should purge (grant to service_role for now)
-- TODO: Create admin role and grant to that role
-- GRANT EXECUTE ON FUNCTION purge_old_deleted_content TO admin_role;

-- ============================================================================
-- Migration Complete
-- ============================================================================

-- Log migration completion
DO $$
BEGIN
  RAISE NOTICE 'Migration 014_add_soft_deletes.sql completed successfully';
  RAISE NOTICE 'Added soft delete columns to wiki_guides, wiki_events, wiki_locations';
  RAISE NOTICE 'Created helper functions: soft_delete_content, restore_deleted_content, purge_old_deleted_content';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Update application code to use soft deletes';
  RAISE NOTICE '  2. Add deleted_at IS NULL filters to all content queries';
  RAISE NOTICE '  3. Implement restore UI for users';
  RAISE NOTICE '  4. (Optional) Schedule auto-purge job for old deleted content';
END $$;
