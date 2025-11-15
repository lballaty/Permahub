-- ================================================
-- Add Wikipedia References to Guides
-- ================================================
-- Adds fields for Wikipedia links and verification status

-- Add Wikipedia reference fields to wiki_guides
ALTER TABLE wiki_guides
ADD COLUMN IF NOT EXISTS wikipedia_url TEXT,
ADD COLUMN IF NOT EXISTS wikipedia_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS wikipedia_verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS wikipedia_verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS wikipedia_summary TEXT;

-- Add constraint to ensure Wikipedia URL is valid
ALTER TABLE wiki_guides
ADD CONSTRAINT check_wikipedia_url
CHECK (
  wikipedia_url IS NULL OR
  wikipedia_url LIKE 'https://en.wikipedia.org/wiki/%' OR
  wikipedia_url LIKE 'https://%.wikipedia.org/wiki/%'
);

-- Comments for documentation
COMMENT ON COLUMN wiki_guides.wikipedia_url IS 'Link to relevant Wikipedia article for fact-checking';
COMMENT ON COLUMN wiki_guides.wikipedia_verified IS 'Whether the Wikipedia link has been verified as accurate';
COMMENT ON COLUMN wiki_guides.wikipedia_verified_at IS 'When the Wikipedia link was last verified';
COMMENT ON COLUMN wiki_guides.wikipedia_verified_by IS 'User who verified the Wikipedia link';
COMMENT ON COLUMN wiki_guides.wikipedia_summary IS 'Brief summary or excerpt from Wikipedia article';

-- Create index for finding unverified Wikipedia links
CREATE INDEX IF NOT EXISTS idx_wiki_guides_unverified_wikipedia
ON wiki_guides(wikipedia_verified)
WHERE wikipedia_url IS NOT NULL AND wikipedia_verified = false;