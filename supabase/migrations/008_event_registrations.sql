-- ================================================
-- Event Registrations System
-- ================================================
-- Allows users to register for events and tracks attendance

-- Event registrations table
CREATE TABLE IF NOT EXISTS wiki_event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Event and user references
  event_id UUID REFERENCES wiki_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Registration details
  user_email TEXT NOT NULL,
  user_name TEXT,
  phone_number TEXT,

  -- Status tracking
  registration_status TEXT DEFAULT 'registered' CHECK (registration_status IN (
    'registered',    -- Successfully registered
    'confirmed',     -- Registration confirmed via email
    'waitlisted',    -- On waitlist if event is full
    'cancelled',     -- Registration cancelled
    'attended',      -- Actually attended the event
    'no_show'       -- Did not attend
  )),

  -- Additional info
  dietary_requirements TEXT,
  accessibility_needs TEXT,
  notes TEXT,

  -- For waitlist management
  waitlist_position INTEGER,

  -- Tracking
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,

  -- Prevent duplicate registrations
  UNIQUE(event_id, user_email)
);

-- Create indexes for performance
CREATE INDEX idx_event_registrations_event ON wiki_event_registrations(event_id);
CREATE INDEX idx_event_registrations_user ON wiki_event_registrations(user_id);
CREATE INDEX idx_event_registrations_email ON wiki_event_registrations(user_email);
CREATE INDEX idx_event_registrations_status ON wiki_event_registrations(registration_status);

-- ================================================
-- Functions
-- ================================================

-- Function to get registration count for an event
CREATE OR REPLACE FUNCTION get_event_registration_count(p_event_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM wiki_event_registrations
    WHERE event_id = p_event_id
    AND registration_status IN ('registered', 'confirmed', 'attended')
  );
END;
$$ LANGUAGE plpgsql;

-- Function to check if an event is full
CREATE OR REPLACE FUNCTION is_event_full(p_event_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_max_attendees INTEGER;
  v_current_count INTEGER;
BEGIN
  -- Get max attendees for the event
  SELECT max_attendees INTO v_max_attendees
  FROM wiki_events
  WHERE id = p_event_id;

  -- If no limit, event is never full
  IF v_max_attendees IS NULL OR v_max_attendees = 0 THEN
    RETURN FALSE;
  END IF;

  -- Get current registration count
  v_current_count := get_event_registration_count(p_event_id);

  RETURN v_current_count >= v_max_attendees;
END;
$$ LANGUAGE plpgsql;

-- Function to register for an event
CREATE OR REPLACE FUNCTION register_for_event(
  p_event_id UUID,
  p_user_email TEXT,
  p_user_id UUID DEFAULT NULL,
  p_user_name TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
  v_is_full BOOLEAN;
  v_registration_id UUID;
  v_status TEXT;
BEGIN
  -- Check if event is full
  v_is_full := is_event_full(p_event_id);

  IF v_is_full THEN
    v_status := 'waitlisted';
  ELSE
    v_status := 'registered';
  END IF;

  -- Check if already registered
  IF EXISTS (
    SELECT 1 FROM wiki_event_registrations
    WHERE event_id = p_event_id AND user_email = p_user_email
  ) THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Already registered for this event'
    );
  END IF;

  -- Create registration
  INSERT INTO wiki_event_registrations (
    event_id,
    user_id,
    user_email,
    user_name,
    registration_status
  ) VALUES (
    p_event_id,
    p_user_id,
    p_user_email,
    p_user_name,
    v_status
  ) RETURNING id INTO v_registration_id;

  -- Return success response
  RETURN jsonb_build_object(
    'success', true,
    'registration_id', v_registration_id,
    'status', v_status,
    'message', CASE
      WHEN v_status = 'waitlisted' THEN 'Added to waitlist'
      ELSE 'Successfully registered'
    END
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Registration failed: ' || SQLERRM
    );
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Row Level Security Policies
-- ================================================

ALTER TABLE wiki_event_registrations ENABLE ROW LEVEL SECURITY;

-- Anyone can view registrations for public events
CREATE POLICY "View public event registrations" ON wiki_event_registrations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM wiki_events
      WHERE id = wiki_event_registrations.event_id
      AND status = 'published'
    )
  );

-- Users can create their own registrations
CREATE POLICY "Users can register for events" ON wiki_event_registrations
  FOR INSERT
  WITH CHECK (
    -- Either authenticated user registering themselves
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    -- Or anonymous registration with email only
    (user_id IS NULL AND user_email IS NOT NULL)
  );

-- Users can update their own registrations
CREATE POLICY "Users can update own registrations" ON wiki_event_registrations
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND user_id = auth.uid()
  );

-- Users can cancel their own registrations
CREATE POLICY "Users can cancel own registrations" ON wiki_event_registrations
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND user_id = auth.uid()
  );

-- ================================================
-- Sample Data (Optional - for testing)
-- ================================================

-- Add some sample registrations if there are events and users
INSERT INTO wiki_event_registrations (
  event_id,
  user_email,
  user_name,
  registration_status
)
SELECT
  e.id,
  'test.user@example.com',
  'Test User',
  'registered'
FROM wiki_events e
WHERE e.status = 'published'
LIMIT 1
ON CONFLICT DO NOTHING;