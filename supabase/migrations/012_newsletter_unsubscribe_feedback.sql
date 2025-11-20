-- ================================================
-- Newsletter Unsubscribe Feedback Table
-- ================================================
-- Records feedback from users when they unsubscribe from the newsletter
-- Helps understand why users leave and improve the service

CREATE TABLE IF NOT EXISTS wiki_newsletter_unsubscribe_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES wiki_newsletter_subscriptions(id) ON DELETE SET NULL,
  email TEXT NOT NULL, -- Store email in case subscription is deleted

  -- Feedback reasons (checkboxes)
  reason_too_frequent BOOLEAN DEFAULT false,
  reason_not_relevant BOOLEAN DEFAULT false,
  reason_never_signed_up BOOLEAN DEFAULT false,
  reason_no_longer_interested BOOLEAN DEFAULT false,
  reason_spam BOOLEAN DEFAULT false,
  reason_other BOOLEAN DEFAULT false,

  -- Additional feedback
  other_reason TEXT, -- Free text for "other" reason
  additional_comments TEXT, -- Optional additional comments

  -- Would they return?
  would_resubscribe_if TEXT, -- What would make them come back

  -- Metadata
  unsubscribed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_unsubscribe_feedback_email ON wiki_newsletter_unsubscribe_feedback(email);
CREATE INDEX idx_unsubscribe_feedback_subscription ON wiki_newsletter_unsubscribe_feedback(subscription_id);
CREATE INDEX idx_unsubscribe_feedback_created ON wiki_newsletter_unsubscribe_feedback(created_at);

-- ================================================
-- Row Level Security
-- ================================================

-- Enable RLS
ALTER TABLE wiki_newsletter_unsubscribe_feedback ENABLE ROW LEVEL SECURITY;

-- Anyone can insert feedback (anonymous unsubscribe)
CREATE POLICY "Anyone can submit unsubscribe feedback" ON wiki_newsletter_unsubscribe_feedback
  FOR INSERT
  WITH CHECK (true);

-- No SELECT policy for now - only direct database access can view feedback
-- This protects user privacy while allowing analysis by database admins

-- ================================================
-- Updated Unsubscribe Function
-- ================================================
-- Enhanced to optionally record feedback

CREATE OR REPLACE FUNCTION unsubscribe_from_newsletter_with_feedback(
  p_email TEXT,
  p_reason_too_frequent BOOLEAN DEFAULT false,
  p_reason_not_relevant BOOLEAN DEFAULT false,
  p_reason_never_signed_up BOOLEAN DEFAULT false,
  p_reason_no_longer_interested BOOLEAN DEFAULT false,
  p_reason_spam BOOLEAN DEFAULT false,
  p_reason_other BOOLEAN DEFAULT false,
  p_other_reason TEXT DEFAULT NULL,
  p_additional_comments TEXT DEFAULT NULL,
  p_would_resubscribe_if TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_subscription_id UUID;
  v_found BOOLEAN;
BEGIN
  -- Get subscription ID
  SELECT id INTO v_subscription_id
  FROM wiki_newsletter_subscriptions
  WHERE email = p_email AND status IN ('active', 'pending');

  -- Update subscription status
  UPDATE wiki_newsletter_subscriptions
  SET
    status = 'unsubscribed',
    unsubscribed_at = NOW(),
    updated_at = NOW()
  WHERE email = p_email AND status IN ('active', 'pending');

  v_found := FOUND;

  -- Insert feedback if subscription was found
  IF v_found THEN
    INSERT INTO wiki_newsletter_unsubscribe_feedback (
      subscription_id,
      email,
      reason_too_frequent,
      reason_not_relevant,
      reason_never_signed_up,
      reason_no_longer_interested,
      reason_spam,
      reason_other,
      other_reason,
      additional_comments,
      would_resubscribe_if
    ) VALUES (
      v_subscription_id,
      p_email,
      p_reason_too_frequent,
      p_reason_not_relevant,
      p_reason_never_signed_up,
      p_reason_no_longer_interested,
      p_reason_spam,
      p_reason_other,
      p_other_reason,
      p_additional_comments,
      p_would_resubscribe_if
    );
  END IF;

  RETURN v_found;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set search_path for security
ALTER FUNCTION unsubscribe_from_newsletter_with_feedback(TEXT, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, TEXT, TEXT, TEXT)
SET search_path = public;

-- Grant EXECUTE to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION unsubscribe_from_newsletter_with_feedback(TEXT, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION unsubscribe_from_newsletter_with_feedback(TEXT, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, TEXT, TEXT, TEXT) TO authenticated;
