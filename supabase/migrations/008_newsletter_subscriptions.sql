-- ================================================
-- Newsletter Subscriptions Table
-- ================================================
-- Stores email addresses of users who subscribe to newsletter updates
-- Includes subscription status, preferences, and tracking

CREATE TABLE IF NOT EXISTS wiki_newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT, -- Optional name
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Link to user if registered
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced', 'pending')),

  -- Subscription preferences
  frequency TEXT DEFAULT 'weekly' CHECK (frequency IN ('daily', 'weekly', 'monthly', 'instant')),
  categories TEXT[], -- Array of category slugs they're interested in
  content_types TEXT[] DEFAULT ARRAY['guides', 'events', 'locations'], -- What content to include

  -- Verification
  verified BOOLEAN DEFAULT false,
  verification_token TEXT,
  verified_at TIMESTAMPTZ,

  -- Tracking
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  last_email_sent_at TIMESTAMPTZ,
  email_count INTEGER DEFAULT 0,

  -- Source tracking
  source TEXT, -- Where they subscribed from (e.g., 'homepage', 'event-page', 'guide-footer')
  referrer TEXT, -- HTTP referrer if available

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_newsletter_email ON wiki_newsletter_subscriptions(email);
CREATE INDEX idx_newsletter_status ON wiki_newsletter_subscriptions(status);
CREATE INDEX idx_newsletter_user ON wiki_newsletter_subscriptions(user_id);

-- ================================================
-- Newsletter Email Log Table
-- ================================================
-- Track all emails sent to subscribers

CREATE TABLE IF NOT EXISTS wiki_newsletter_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES wiki_newsletter_subscriptions(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL, -- 'welcome', 'weekly-digest', 'event-reminder', etc.
  subject TEXT NOT NULL,
  content_summary TEXT, -- Brief summary of what was included

  -- Status tracking
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'bounced', 'opened', 'clicked', 'unsubscribed')),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_newsletter_emails_subscription ON wiki_newsletter_emails(subscription_id);
CREATE INDEX idx_newsletter_emails_sent ON wiki_newsletter_emails(sent_at);

-- ================================================
-- Functions and Triggers
-- ================================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_newsletter_subscription_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER newsletter_subscription_updated_at
  BEFORE UPDATE ON wiki_newsletter_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_newsletter_subscription_updated_at();

-- Function to subscribe email
-- Uses SECURITY DEFINER to bypass RLS policies (allows anonymous subscriptions)
CREATE OR REPLACE FUNCTION subscribe_to_newsletter(
  p_email TEXT,
  p_name TEXT DEFAULT NULL,
  p_source TEXT DEFAULT NULL,
  p_categories TEXT[] DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_subscription_id UUID;
BEGIN
  INSERT INTO wiki_newsletter_subscriptions (
    email,
    name,
    source,
    categories,
    status,
    verified
  ) VALUES (
    p_email,
    p_name,
    p_source,
    p_categories,
    'pending',
    false
  )
  ON CONFLICT (email) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, wiki_newsletter_subscriptions.name),
    categories = COALESCE(EXCLUDED.categories, wiki_newsletter_subscriptions.categories),
    status = CASE
      WHEN wiki_newsletter_subscriptions.status = 'unsubscribed' THEN 'active'
      ELSE wiki_newsletter_subscriptions.status
    END,
    updated_at = NOW()
  RETURNING id INTO v_subscription_id;

  RETURN v_subscription_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to unsubscribe
-- Uses SECURITY DEFINER to bypass RLS policies (allows unsubscribe via email link)
CREATE OR REPLACE FUNCTION unsubscribe_from_newsletter(p_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE wiki_newsletter_subscriptions
  SET
    status = 'unsubscribed',
    unsubscribed_at = NOW(),
    updated_at = NOW()
  WHERE email = p_email AND status = 'active';

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- Row Level Security Policies
-- ================================================

-- Enable RLS
ALTER TABLE wiki_newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wiki_newsletter_emails ENABLE ROW LEVEL SECURITY;

-- Subscriptions policies
-- Users can view their own subscription
CREATE POLICY "Users can view own subscription" ON wiki_newsletter_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id OR auth.email() = email);

-- Anyone can create a subscription (for newsletter signup)
CREATE POLICY "Anyone can subscribe" ON wiki_newsletter_subscriptions
  FOR INSERT
  WITH CHECK (true);

-- Users can update their own subscription
CREATE POLICY "Users can update own subscription" ON wiki_newsletter_subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id OR auth.email() = email);

-- Email log policies (read-only for users)
CREATE POLICY "Users can view own email history" ON wiki_newsletter_emails
  FOR SELECT
  USING (
    subscription_id IN (
      SELECT id FROM wiki_newsletter_subscriptions
      WHERE auth.uid() = user_id OR auth.email() = email
    )
  );

-- ================================================
-- Sample Data (for testing)
-- ================================================

-- Insert sample subscriptions
INSERT INTO wiki_newsletter_subscriptions (email, name, status, verified, categories, source) VALUES
('test@example.com', 'Test User', 'active', true, ARRAY['gardening', 'composting'], 'homepage'),
('subscriber@example.com', 'Active Subscriber', 'active', true, ARRAY['water-management'], 'event-page')
ON CONFLICT (email) DO NOTHING;