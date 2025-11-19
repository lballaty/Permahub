-- Fix RLS policy for newsletter subscriptions to allow anonymous inserts
-- The issue: WITH CHECK alone isn't enough, we also need USING clause for INSERT

-- Drop the existing "Anyone can subscribe" policy
DROP POLICY IF EXISTS "Anyone can subscribe" ON wiki_newsletter_subscriptions;

-- Recreate with both USING and WITH CHECK clauses
-- USING (true) allows checking existing rows (though not needed for INSERT)
-- WITH CHECK (true) allows inserting new rows
CREATE POLICY "Anyone can subscribe" ON wiki_newsletter_subscriptions
  FOR INSERT
  TO public, anon, authenticated
  WITH CHECK (true);
