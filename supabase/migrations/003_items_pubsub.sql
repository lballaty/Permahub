-- ============================================================================
-- Permaculture Network - Flexible Items & Pub/Sub Notification System
-- Allows users to add ANY type of item (projects, resources, events, etc.)
-- and enables pub/sub notifications for followers
-- ============================================================================

-- ============================================================================
-- 1. UNIFIED ITEMS TABLE (Flexible - accepts any type)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Item identification
  item_type TEXT NOT NULL,
  category TEXT NOT NULL,
  
  -- Basic info
  title TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Location
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Contact info
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  
  -- Availability & Pricing
  availability TEXT DEFAULT 'available',
  price DECIMAL(10, 2),
  currency TEXT,
  delivery_available BOOLEAN DEFAULT false,
  delivery_radius_km DECIMAL(5, 2),
  
  -- Metadata
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Status
  status TEXT DEFAULT 'active',
  verified BOOLEAN DEFAULT false,
  
  -- Provider info
  provider_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_items_type ON public.items(item_type);
CREATE INDEX IF NOT EXISTS idx_items_category ON public.items(category);
CREATE INDEX IF NOT EXISTS idx_items_latitude ON public.items(latitude) WHERE latitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_items_longitude ON public.items(longitude) WHERE longitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_items_status ON public.items(status);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON public.items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_items_created_by ON public.items(created_by);
CREATE INDEX IF NOT EXISTS idx_items_availability ON public.items(availability);

-- ============================================================================
-- 2. PUBLICATION SUBSCRIPTIONS TABLE (For Pub/Sub)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.publication_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Item reference
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  
  -- Publisher (item creator)
  publisher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Notification preferences
  notify_on_views BOOLEAN DEFAULT true,
  notify_on_interest BOOLEAN DEFAULT true,
  notify_on_updates BOOLEAN DEFAULT true,
  notify_on_comments BOOLEAN DEFAULT true,
  
  -- Item info for quick access
  item_type TEXT NOT NULL,
  item_title TEXT NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_publication_subs_item ON public.publication_subscriptions(item_id);
CREATE INDEX IF NOT EXISTS idx_publication_subs_publisher ON public.publication_subscriptions(publisher_id);
CREATE INDEX IF NOT EXISTS idx_publication_subs_created ON public.publication_subscriptions(created_at DESC);

-- ============================================================================
-- 3. ITEM FOLLOWERS TABLE (Users interested in an item)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.item_followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Item reference
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  
  -- Follower (interested user)
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Notification preferences for this follower
  receive_notifications BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(item_id, follower_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_item_followers_item ON public.item_followers(item_id);
CREATE INDEX IF NOT EXISTS idx_item_followers_follower ON public.item_followers(follower_id);

-- ============================================================================
-- 4. NOTIFICATIONS TABLE (Feed of notifications)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Notification recipient
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Item that triggered notification
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  
  -- Notification details
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  
  -- Additional context
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_name TEXT,
  
  -- Read status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_item ON public.notifications(item_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);

-- ============================================================================
-- 5. NOTIFICATION PREFERENCES TABLE (User-wide settings)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Global notification settings
  email_notifications BOOLEAN DEFAULT true,
  in_app_notifications BOOLEAN DEFAULT true,
  notify_on_item_views BOOLEAN DEFAULT true,
  notify_on_item_interest BOOLEAN DEFAULT true,
  notify_on_item_updates BOOLEAN DEFAULT true,
  notify_on_comments BOOLEAN DEFAULT true,
  notify_on_follows BOOLEAN DEFAULT true,
  
  -- Notification frequency
  notification_frequency TEXT DEFAULT 'immediate',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_notification_prefs_user ON public.notification_preferences(user_id);

-- ============================================================================
-- 6. ROW LEVEL SECURITY POLICIES
-- ============================================================================

ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publication_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Items: Anyone can view active items, creators can modify their own
CREATE POLICY "Active items are viewable by everyone"
  ON public.items
  FOR SELECT
  USING (status = 'active' OR auth.uid() = created_by);

CREATE POLICY "Users can create items"
  ON public.items
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own items"
  ON public.items
  FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own items"
  ON public.items
  FOR DELETE
  USING (auth.uid() = created_by);

-- Publication subscriptions: Creators can view their own
CREATE POLICY "Users can view their publication subscriptions"
  ON public.publication_subscriptions
  FOR SELECT
  USING (auth.uid() = publisher_id);

CREATE POLICY "Users can create publication subscriptions"
  ON public.publication_subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = publisher_id);

CREATE POLICY "Users can update their publication subscriptions"
  ON public.publication_subscriptions
  FOR UPDATE
  USING (auth.uid() = publisher_id);

-- Item followers: Users can manage their own followers list
CREATE POLICY "Users can view item followers"
  ON public.item_followers
  FOR SELECT
  USING (true);

CREATE POLICY "Users can follow items"
  ON public.item_followers
  FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow items"
  ON public.item_followers
  FOR DELETE
  USING (auth.uid() = follower_id);

-- Notifications: Users can only view their own
CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = recipient_id);

CREATE POLICY "Users can mark their notifications as read"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = recipient_id);

-- Notification preferences: Users can only manage their own
CREATE POLICY "Users can view their notification preferences"
  ON public.notification_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notification preferences"
  ON public.notification_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their notification preferences"
  ON public.notification_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 7. TRIGGER: Auto-create notification preferences for new users
-- ============================================================================

CREATE OR REPLACE FUNCTION create_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_notification_preferences
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_notification_preferences();

-- ============================================================================
-- 8. TRIGGER: Update item updated_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION update_item_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_item_timestamp
BEFORE UPDATE ON public.items
FOR EACH ROW
EXECUTE FUNCTION update_item_timestamp();

-- ============================================================================
-- 9. TRIGGER: Auto-create publication subscription when item is created
-- ============================================================================

CREATE OR REPLACE FUNCTION auto_create_publication_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.publication_subscriptions (
    item_id,
    publisher_id,
    item_type,
    item_title
  ) VALUES (
    NEW.id,
    NEW.created_by,
    NEW.item_type,
    NEW.title
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_create_publication_subscription
AFTER INSERT ON public.items
FOR EACH ROW
EXECUTE FUNCTION auto_create_publication_subscription();

-- ============================================================================
-- 10. HELPER FUNCTION: Notify followers of item update
-- ============================================================================

CREATE OR REPLACE FUNCTION notify_followers(
  p_item_id UUID,
  p_notification_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_actor_id UUID DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  v_followers RECORD;
  v_publisher_id UUID;
  v_notify BOOLEAN;
BEGIN
  -- Get publisher ID
  SELECT created_by INTO v_publisher_id FROM public.items WHERE id = p_item_id;
  
  -- Get all followers of this item
  FOR v_followers IN
    SELECT DISTINCT f.follower_id, f.receive_notifications
    FROM public.item_followers f
    WHERE f.item_id = p_item_id
      AND f.follower_id != v_publisher_id
  LOOP
    -- Check follower's notification preferences
    SELECT receive_notifications INTO v_notify 
    FROM public.item_followers 
    WHERE item_id = p_item_id AND follower_id = v_followers.follower_id;
    
    -- Create notification if enabled
    IF v_notify THEN
      INSERT INTO public.notifications (
        recipient_id,
        item_id,
        notification_type,
        title,
        message,
        actor_id
      ) VALUES (
        v_followers.follower_id,
        p_item_id,
        p_notification_type,
        p_title,
        p_message,
        p_actor_id
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 11. HELPER FUNCTION: Mark notification as read
-- ============================================================================

CREATE OR REPLACE FUNCTION mark_notification_read(p_notification_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.notifications
  SET is_read = true, read_at = CURRENT_TIMESTAMP
  WHERE id = p_notification_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 12. HELPER FUNCTION: Get user's feed (notifications)
-- ============================================================================

CREATE OR REPLACE FUNCTION get_user_feed(p_user_id UUID, p_limit INTEGER DEFAULT 50)
RETURNS TABLE (
  notification_id UUID,
  item_id UUID,
  item_title TEXT,
  notification_type TEXT,
  title TEXT,
  message TEXT,
  actor_name TEXT,
  is_read BOOLEAN,
  created_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    n.id,
    n.item_id,
    i.title,
    n.notification_type,
    n.title,
    n.message,
    n.actor_name,
    n.is_read,
    n.created_at
  FROM public.notifications n
  LEFT JOIN public.items i ON n.item_id = i.id
  WHERE n.recipient_id = p_user_id
  ORDER BY n.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 13. HELPER FUNCTION: Follow an item
-- ============================================================================

CREATE OR REPLACE FUNCTION follow_item(
  p_item_id UUID,
  p_follower_id UUID
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.item_followers (item_id, follower_id)
  VALUES (p_item_id, p_follower_id)
  ON CONFLICT (item_id, follower_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 14. HELPER FUNCTION: Unfollow an item
-- ============================================================================

CREATE OR REPLACE FUNCTION unfollow_item(
  p_item_id UUID,
  p_follower_id UUID
)
RETURNS void AS $$
BEGIN
  DELETE FROM public.item_followers
  WHERE item_id = p_item_id AND follower_id = p_follower_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 15. VIEW: User's unread notifications count
-- ============================================================================

CREATE OR REPLACE VIEW public.v_unread_notifications AS
SELECT 
  recipient_id,
  COUNT(*) as unread_count
FROM public.notifications
WHERE is_read = false
GROUP BY recipient_id;

-- ============================================================================
-- 16. VIEW: Items with follower count
-- ============================================================================

CREATE OR REPLACE VIEW public.v_items_with_stats AS
SELECT 
  i.id,
  i.title,
  i.item_type,
  i.category,
  i.status,
  COUNT(DISTINCT f.follower_id) as follower_count,
  i.created_at
FROM public.items i
LEFT JOIN public.item_followers f ON i.id = f.item_id
GROUP BY i.id, i.title, i.item_type, i.category, i.status, i.created_at;

-- ============================================================================
-- SAMPLE USAGE QUERIES
-- ============================================================================

-- Get all items of a specific type
-- SELECT * FROM public.items WHERE item_type = 'project' AND status = 'active';

-- Get user's unread notifications
-- SELECT * FROM get_user_feed('user-id') WHERE is_read = false;

-- Notify followers when item is updated
-- SELECT notify_followers('item-id', 'update', 'Item Updated', 'The item you follow was updated');

-- Follow an item
-- SELECT follow_item('item-id', 'follower-id');

-- Get unread notification count
-- SELECT unread_count FROM v_unread_notifications WHERE recipient_id = 'user-id';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
