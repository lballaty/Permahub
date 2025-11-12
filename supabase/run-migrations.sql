-- ================================================
-- RUN ALL MIGRATIONS FOR PERMAHUB WIKI
-- ================================================
-- Copy this entire file and run it in Supabase SQL Editor
-- This will create all necessary tables and functions
--
-- IMPORTANT: Run this in a NEW Supabase project
-- ================================================

-- Start transaction
BEGIN;

\echo '=== Running Migration 001: Initial Schema ==='
\i 001_initial_schema.sql

\echo '=== Running Migration 002: Analytics ==='
\i 002_analytics.sql

\echo '=== Running Migration 003: Items PubSub ==='
\i 003_items_pubsub.sql

\echo '=== Running Migration 004: Wiki Schema ==='
\i 004_wiki_schema.sql

\echo '=== Running Migration 005: Multilingual Content ==='
\i 005_wiki_multilingual_content.sql

-- Commit transaction
COMMIT;

\echo '=== ✅ All migrations completed successfully! ==='
\echo '=== Next step: Run seed data (optional) ==='
