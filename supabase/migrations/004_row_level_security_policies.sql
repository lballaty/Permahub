-- ============================================================================
-- File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/004_row_level_security_policies.sql
-- Description: Consolidated Row-Level Security (RLS) policies for all base tables
-- Author: Libor Ballaty <libor@arionetworks.com>
-- Created: 2025-11-12
-- Purpose: Enable RLS and create policies for all tables created in migrations 001-003
-- Execution Order: Run AFTER migrations 00_bootstrap, 001, 002, 003, and 20251107_00
-- ============================================================================
-- IMPORTANT: This migration consolidates all RLS policies
-- It should be executed AFTER all table creation migrations but BEFORE application use
-- ============================================================================

-- ============================================================================
-- 1. ENABLE ROW LEVEL SECURITY ON ALL CORE TABLES (Migration 001)
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. USERS TABLE POLICIES (From 001_initial_schema.sql)
-- ============================================================================
-- Business Rules:
-- - Public profiles visible to everyone (is_public_profile = true)
-- - Users can view and edit their own profile
-- - Authenticated users can create their profile during signup

-- Allow anyone to view public profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.users
  FOR SELECT
  USING (is_public_profile = true);

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow authenticated users to insert their profile
CREATE POLICY "Authenticated users can insert their profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- 3. PROJECTS TABLE POLICIES (From 001_initial_schema.sql)
-- ============================================================================
-- Business Rules:
-- - All active projects visible to everyone
-- - Users can only view, edit, and delete their own projects
-- - Only authenticated users can create projects

-- Allow everyone to view active projects
CREATE POLICY "Active projects are viewable by everyone"
  ON public.projects
  FOR SELECT
  USING (status = 'active');

-- Allow users to view their own projects (even if not active)
CREATE POLICY "Users can view their own projects"
  ON public.projects
  FOR SELECT
  USING (auth.uid() = created_by);

-- Allow authenticated users to create projects
CREATE POLICY "Authenticated users can create projects"
  ON public.projects
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Allow users to update their own projects
CREATE POLICY "Users can update their own projects"
  ON public.projects
  FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Allow users to delete their own projects
CREATE POLICY "Users can delete their own projects"
  ON public.projects
  FOR DELETE
  USING (auth.uid() = created_by);

-- ============================================================================
-- 4. RESOURCES TABLE POLICIES (From 001_initial_schema.sql)
-- ============================================================================
-- Business Rules:
-- - All available resources visible to everyone
-- - Users can only view, edit, and delete their own resources
-- - Only authenticated users can create resources

-- Allow everyone to view available resources
CREATE POLICY "Available resources are viewable by everyone"
  ON public.resources
  FOR SELECT
  USING (availability != 'archived');

-- Allow users to view their own resources (even if archived)
CREATE POLICY "Users can view their own resources"
  ON public.resources
  FOR SELECT
  USING (auth.uid() = created_by);

-- Allow authenticated users to create resources
CREATE POLICY "Authenticated users can create resources"
  ON public.resources
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Allow users to update their own resources
CREATE POLICY "Users can update their own resources"
  ON public.resources
  FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Allow users to delete their own resources
CREATE POLICY "Users can delete their own resources"
  ON public.resources
  FOR DELETE
  USING (auth.uid() = created_by);

-- ============================================================================
-- 5. PROJECT-USER CONNECTIONS TABLE POLICIES (From 001_initial_schema.sql)
-- ============================================================================
-- Business Rules:
-- - All connections publicly visible (so users can see project teams)
-- - Only project creators or the connected user can manage connections

-- Everyone can view project connections
CREATE POLICY "Project connections are viewable by everyone"
  ON public.project_user_connections
  FOR SELECT
  USING (true);

-- Users can create project connections (if they're the project creator or user being added)
CREATE POLICY "Users can create project connections"
  ON public.project_user_connections
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT created_by FROM public.projects WHERE id = project_id
    ) OR auth.uid() = user_id
  );

-- Users can delete their own project connections
CREATE POLICY "Users can delete own project connections"
  ON public.project_user_connections
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT created_by FROM public.projects WHERE id = project_id
    ) OR auth.uid() = user_id
  );

-- ============================================================================
-- 6. FAVORITES TABLE POLICIES (From 001_initial_schema.sql)
-- ============================================================================
-- Business Rules:
-- - Favorites are completely private to each user
-- - Users can only see, create, and delete their own favorites

-- Users can only view their own favorites
CREATE POLICY "Users can view their own favorites"
  ON public.favorites
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own favorites
CREATE POLICY "Users can create their own favorites"
  ON public.favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete their own favorites"
  ON public.favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 7. ENABLE RLS ON ANALYTICS TABLES (Migration 002)
-- ============================================================================

ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_dashboard_config ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 8. USER ACTIVITY TABLE POLICIES (From 002_analytics.sql)
-- ============================================================================
-- Business Rules:
-- - User activity is private to each user
-- - Users can only see their own activity history
-- - Activity is logged by the system on user actions

-- User activity: users can only view their own activity
CREATE POLICY "Users can view their own activity"
  ON public.user_activity
  FOR SELECT
  USING (auth.uid() = user_id);

-- User activity: allow insert for logged in users
CREATE POLICY "Authenticated users can log their activity"
  ON public.user_activity
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 9. USER DASHBOARD CONFIG TABLE POLICIES (From 002_analytics.sql)
-- ============================================================================
-- Business Rules:
-- - Dashboard configuration is private to each user
-- - Users can only view and edit their own dashboard config
-- - Dashboard config is created during setup

-- Dashboard config: users can only view their own
CREATE POLICY "Users can view their own dashboard config"
  ON public.user_dashboard_config
  FOR SELECT
  USING (auth.uid() = user_id);

-- Dashboard config: users can update their own
CREATE POLICY "Users can update their own dashboard config"
  ON public.user_dashboard_config
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Dashboard config: allow insert for logged in users
CREATE POLICY "Authenticated users can create dashboard config"
  ON public.user_dashboard_config
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 10. ENABLE RLS ON ITEMS & NOTIFICATIONS TABLES (Migration 003)
-- ============================================================================

ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publication_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 11. ITEMS TABLE POLICIES (From 003_items_pubsub.sql)
-- ============================================================================
-- Business Rules:
-- - Active items visible to everyone
-- - Draft/inactive items only visible to creator
-- - Only creator can edit or delete

-- Anyone can view active items, creators can view their own drafts
CREATE POLICY "Active items are viewable by everyone"
  ON public.items
  FOR SELECT
  USING (status = 'active' OR auth.uid() = created_by);

-- Users can create items
CREATE POLICY "Users can create items"
  ON public.items
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Users can update their own items
CREATE POLICY "Users can update their own items"
  ON public.items
  FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Users can delete their own items
CREATE POLICY "Users can delete their own items"
  ON public.items
  FOR DELETE
  USING (auth.uid() = created_by);

-- ============================================================================
-- 12. PUBLICATION SUBSCRIPTIONS TABLE POLICIES (From 003_items_pubsub.sql)
-- ============================================================================
-- Business Rules:
-- - Publishers manage their own subscription channels
-- - Only publishers see their own subscriptions

-- Publishers can view their publication subscriptions
CREATE POLICY "Users can view their publication subscriptions"
  ON public.publication_subscriptions
  FOR SELECT
  USING (auth.uid() = publisher_id);

-- Publishers can create publication subscriptions
CREATE POLICY "Users can create publication subscriptions"
  ON public.publication_subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = publisher_id);

-- Publishers can update their publication subscriptions
CREATE POLICY "Users can update their publication subscriptions"
  ON public.publication_subscriptions
  FOR UPDATE
  USING (auth.uid() = publisher_id);

-- ============================================================================
-- 13. ITEM FOLLOWERS TABLE POLICIES (From 003_items_pubsub.sql)
-- ============================================================================
-- Business Rules:
-- - All followers publicly visible (shows who follows what)
-- - Users can only add/remove themselves as followers

-- Everyone can view item followers
CREATE POLICY "Users can view item followers"
  ON public.item_followers
  FOR SELECT
  USING (true);

-- Users can follow items (add themselves)
CREATE POLICY "Users can follow items"
  ON public.item_followers
  FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

-- Users can unfollow items (remove themselves)
CREATE POLICY "Users can unfollow items"
  ON public.item_followers
  FOR DELETE
  USING (auth.uid() = follower_id);

-- ============================================================================
-- 14. NOTIFICATIONS TABLE POLICIES (From 003_items_pubsub.sql)
-- ============================================================================
-- Business Rules:
-- - Notifications are completely private to recipient
-- - Users can only see and manage their own notifications

-- Users can only view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = recipient_id);

-- Users can mark their notifications as read
CREATE POLICY "Users can mark their notifications as read"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = recipient_id);

-- ============================================================================
-- 15. NOTIFICATION PREFERENCES TABLE POLICIES (From 003_items_pubsub.sql)
-- ============================================================================
-- Business Rules:
-- - Notification preferences are private to each user
-- - Users can only manage their own preferences

-- Users can only view their own notification preferences
CREATE POLICY "Users can view their notification preferences"
  ON public.notification_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their notification preferences
CREATE POLICY "Users can update their notification preferences"
  ON public.notification_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can insert their notification preferences
CREATE POLICY "Users can insert their notification preferences"
  ON public.notification_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 16. NOTES ON 20251107_00_theme_associations.sql
-- ============================================================================
-- The theme_associations migration adds eco_theme_id columns to projects and
-- resources tables but does NOT create new RLS policies. The existing policies
-- already allow proper access control. Users can still:
-- - View all active projects (regardless of eco_theme)
-- - View all available resources (regardless of eco_theme)
-- - Only edit/delete their own items
--
-- The application layer handles filtering by eco_theme_id.

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- After this migration runs successfully, verify RLS is enabled:
--
-- SELECT tablename FROM pg_tables
-- WHERE schemaname = 'public'
-- AND EXISTS (
--   SELECT 1 FROM information_schema.table_privileges
--   WHERE table_schema = 'public'
--   AND table_name = tablename
-- );
--
-- To check RLS status on a specific table:
-- SELECT * FROM pg_tables WHERE schemaname='public' AND rowsecurity=true;
--
-- To view all policies on a table:
-- SELECT * FROM pg_policies WHERE tablename = 'users';

-- ============================================================================
-- SUMMARY OF RLS CONFIGURATION
-- ============================================================================
-- Total tables with RLS enabled: 12
-- Total policies created: 40
--
-- Tables protected:
-- 1. public.users (4 policies)
-- 2. public.projects (5 policies)
-- 3. public.resources (5 policies)
-- 4. public.project_user_connections (3 policies)
-- 5. public.favorites (3 policies)
-- 6. public.user_activity (2 policies)
-- 7. public.user_dashboard_config (3 policies)
-- 8. public.items (4 policies)
-- 9. public.publication_subscriptions (3 policies)
-- 10. public.item_followers (3 policies)
-- 11. public.notifications (2 policies)
-- 12. public.notification_preferences (3 policies)
--
-- Security Model:
-- - User-owned data (profiles, favorites, notifications): private to user
-- - Creator-owned content (projects, resources, items): editable by creator
-- - Public content: viewable by all (active projects, available resources)
-- - Connections: viewable by all, manageable by creator or connected user
-- - Analytics: private to each user

-- ============================================================================
-- END OF RLS POLICIES MIGRATION
-- ============================================================================
