-- ============================================================================
-- Migration: Add User Home Location Fields
-- File: supabase/migrations/021_add_user_home_location.sql
-- Description: Adds a per-user settings table to store home location
--              (My Location) for maps and events features.
-- Author: Libor Ballaty <libor@arionetworks.com>
-- Created: 2025-11-20
-- ============================================================================

-- ============================================================================
-- USER SETTINGS TABLE
-- ============================================================================

-- Store per-user settings, including home location used for
-- "Events near me" and map centering.
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  home_label TEXT,                 -- Free-text label e.g. "Home garden – Prague"
  home_lat   DOUBLE PRECISION,     -- Latitude of user's primary location
  home_lng   DOUBLE PRECISION,     -- Longitude of user's primary location
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.user_settings IS
  'Per-user settings for the wiki, including home location used for nearby events and maps.';

COMMENT ON COLUMN public.user_settings.home_label IS
  'Human-readable label for the user''s primary location (e.g., "Home garden – Lisbon").';

COMMENT ON COLUMN public.user_settings.home_lat IS
  'Latitude of the user''s primary location, used for distance calculations.';

COMMENT ON COLUMN public.user_settings.home_lng IS
  'Longitude of the user''s primary location, used for distance calculations.';

-- Simple trigger to keep updated_at in sync
CREATE OR REPLACE FUNCTION public.set_user_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_user_settings_set_updated_at ON public.user_settings;

CREATE TRIGGER trg_user_settings_set_updated_at
BEFORE UPDATE ON public.user_settings
FOR EACH ROW
EXECUTE FUNCTION public.set_user_settings_updated_at();

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name   = 'user_settings'
  ) THEN
    RAISE NOTICE '✅ user_settings table created successfully';
  ELSE
    RAISE EXCEPTION '❌ Failed to create user_settings table';
  END IF;
END $$;

