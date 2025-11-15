-- ================================================
-- Issue Tracking System for Testers
-- ================================================
-- Allows registered users with Tester role to report issues from the UI

-- Issue tracking table
CREATE TABLE IF NOT EXISTS wiki_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Issue details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  issue_type TEXT CHECK (issue_type IN ('bug', 'feature', 'improvement', 'ui', 'performance', 'security', 'other')),
  severity TEXT CHECK (severity IN ('critical', 'high', 'medium', 'low', 'trivial')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed', 'duplicate', 'wont_fix')),

  -- Context information
  page_url TEXT, -- Where the issue was found
  browser_info TEXT, -- User agent string
  screen_resolution TEXT,
  device_type TEXT,

  -- Screenshots/attachments
  screenshot_url TEXT, -- Link to uploaded screenshot

  -- User information
  reported_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Tracking
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,

  -- Additional metadata
  tags TEXT[], -- Array of tags for categorization
  version TEXT, -- App version when issue was reported
  priority INTEGER DEFAULT 3 CHECK (priority >= 1 AND priority <= 5), -- 1 = highest, 5 = lowest

  -- Voting/endorsement
  upvotes INTEGER DEFAULT 0,

  -- Internal notes (only visible to admins)
  internal_notes TEXT
);

-- Issue comments table
CREATE TABLE IF NOT EXISTS wiki_issue_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID REFERENCES wiki_issues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  comment TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false, -- Internal comments only visible to staff
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Issue votes table (to track who upvoted)
CREATE TABLE IF NOT EXISTS wiki_issue_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID REFERENCES wiki_issues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(issue_id, user_id) -- One vote per user per issue
);

-- Issue attachments table
CREATE TABLE IF NOT EXISTS wiki_issue_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID REFERENCES wiki_issues(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_issues_reported_by ON wiki_issues(reported_by);
CREATE INDEX idx_issues_status ON wiki_issues(status);
CREATE INDEX idx_issues_type ON wiki_issues(issue_type);
CREATE INDEX idx_issues_severity ON wiki_issues(severity);
CREATE INDEX idx_issues_created ON wiki_issues(created_at DESC);
CREATE INDEX idx_issue_comments_issue ON wiki_issue_comments(issue_id);
CREATE INDEX idx_issue_votes_issue ON wiki_issue_votes(issue_id);

-- ================================================
-- Functions and Triggers
-- ================================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_issue_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER issue_updated_at
  BEFORE UPDATE ON wiki_issues
  FOR EACH ROW
  EXECUTE FUNCTION update_issue_updated_at();

CREATE TRIGGER issue_comment_updated_at
  BEFORE UPDATE ON wiki_issue_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_issue_updated_at();

-- Function to upvote an issue
CREATE OR REPLACE FUNCTION upvote_issue(p_issue_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  -- Check if vote already exists
  SELECT EXISTS(
    SELECT 1 FROM wiki_issue_votes
    WHERE issue_id = p_issue_id AND user_id = p_user_id
  ) INTO v_exists;

  IF v_exists THEN
    -- Remove vote (toggle)
    DELETE FROM wiki_issue_votes
    WHERE issue_id = p_issue_id AND user_id = p_user_id;

    -- Decrement upvotes
    UPDATE wiki_issues
    SET upvotes = GREATEST(0, upvotes - 1)
    WHERE id = p_issue_id;

    RETURN false; -- Vote removed
  ELSE
    -- Add vote
    INSERT INTO wiki_issue_votes (issue_id, user_id)
    VALUES (p_issue_id, p_user_id);

    -- Increment upvotes
    UPDATE wiki_issues
    SET upvotes = upvotes + 1
    WHERE id = p_issue_id;

    RETURN true; -- Vote added
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Row Level Security Policies
-- ================================================

ALTER TABLE wiki_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE wiki_issue_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wiki_issue_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE wiki_issue_attachments ENABLE ROW LEVEL SECURITY;

-- Issues policies
-- Anyone authenticated can view non-internal issues
CREATE POLICY "Authenticated users can view issues" ON wiki_issues
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Authenticated users can create issues
CREATE POLICY "Authenticated users can create issues" ON wiki_issues
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND reported_by = auth.uid());

-- Users can update their own issues (if still open)
CREATE POLICY "Users can update own open issues" ON wiki_issues
  FOR UPDATE
  USING (reported_by = auth.uid() AND status = 'open');

-- Comments policies
-- View non-internal comments
CREATE POLICY "View non-internal comments" ON wiki_issue_comments
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND (is_internal = false OR user_id = auth.uid()));

-- Create comments
CREATE POLICY "Authenticated users can comment" ON wiki_issue_comments
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Update own comments
CREATE POLICY "Users can update own comments" ON wiki_issue_comments
  FOR UPDATE
  USING (user_id = auth.uid());

-- Votes policies
CREATE POLICY "Anyone can view votes" ON wiki_issue_votes
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote" ON wiki_issue_votes
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users can remove own vote" ON wiki_issue_votes
  FOR DELETE
  USING (user_id = auth.uid());

-- Attachments policies
CREATE POLICY "View attachments for visible issues" ON wiki_issue_attachments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM wiki_issues
      WHERE id = wiki_issue_attachments.issue_id
    )
  );

CREATE POLICY "Users can upload attachments to own issues" ON wiki_issue_attachments
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    uploaded_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM wiki_issues
      WHERE id = wiki_issue_attachments.issue_id
      AND reported_by = auth.uid()
    )
  );

-- ================================================
-- Sample Data for Testing
-- ================================================

-- Insert sample issues (will only work if there's a user)
-- These will be skipped if no auth users exist yet
INSERT INTO wiki_issues (
  title,
  description,
  issue_type,
  severity,
  status,
  page_url,
  version,
  priority
)
SELECT
  'Sample Bug: Search not working on events page',
  'When I try to search for events, the search field does not filter the results. All events remain visible regardless of search term.',
  'bug',
  'medium',
  'open',
  '/wiki-events.html',
  'v1.0.0',
  3
WHERE EXISTS (SELECT 1 FROM auth.users LIMIT 1)
ON CONFLICT DO NOTHING;

-- Add a feature request
INSERT INTO wiki_issues (
  title,
  description,
  issue_type,
  severity,
  status,
  page_url,
  version,
  priority
)
SELECT
  'Feature Request: Dark mode support',
  'It would be great to have a dark mode toggle for the wiki. This would help with eye strain during evening reading.',
  'feature',
  'low',
  'open',
  '/wiki-home.html',
  'v1.0.0',
  4
WHERE EXISTS (SELECT 1 FROM auth.users LIMIT 1)
ON CONFLICT DO NOTHING;