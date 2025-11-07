# Landing Page Implementation Guide

**Version:** 1.0  
**Status:** Complete  
**Last Updated:** January 2025

---

## 📋 Overview

The landing page provides:

1. **Global View** - Shows 20 most used projects and resources worldwide
2. **Personal View** - Shows personalized items based on user activity
3. **Customization** - Users can add/remove specific items
4. **Analytics** - Tracks user interactions for personalization

---

## 🚀 Quick Start

### Step 1: Add Files

Copy these files to your project:
- `landing.html` - Main landing page
- `landing-page-analytics.sql` - Database schema

### Step 2: Update Database

Run the SQL migration to add analytics tables:

```bash
# In Supabase SQL Editor:
# Copy and paste contents of landing-page-analytics.sql
# Click Run
```

This creates:
- `user_activity` table
- `user_dashboard_config` table
- Popular items views
- Helper functions

### Step 3: Update Supabase Client

Add these methods to `supabase-client.js`:

```javascript
/**
 * Log user activity
 */
async logActivity(userId, activityType, itemType, itemId, metadata = {}) {
  try {
    await this.insert('user_activity', {
      user_id: userId,
      activity_type: activityType,
      item_type: itemType,
      item_id: itemId,
      metadata: metadata
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

/**
 * Get user dashboard configuration
 */
async getUserDashboardConfig(userId) {
  try {
    const result = await this.getAll('user_dashboard_config', {
      select: '*',
      where: 'user_id',
      operator: 'eq',
      value: userId
    });
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error fetching dashboard config:', error);
    return null;
  }
}

/**
 * Update dashboard configuration
 */
async updateDashboardConfig(userId, items, itemCount = 10) {
  try {
    return await this.insert('user_dashboard_config', {
      user_id: userId,
      items: items,
      item_count: itemCount,
      is_personalized: true,
      last_customized: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating dashboard config:', error);
    throw error;
  }
}

/**
 * Get popular items globally
 */
async getPopularItems(limit = 20) {
  try {
    const projects = await this.getAll('projects', {
      select: '*',
      where: 'status',
      operator: 'eq',
      value: 'active',
      limit: Math.ceil(limit / 2)
    });

    const resources = await this.getAll('resources', {
      select: '*',
      where: 'availability',
      operator: 'neq',
      value: 'archived',
      limit: Math.ceil(limit / 2)
    });

    return [
      ...projects.map(p => ({
        id: p.id,
        type: 'project',
        name: p.name,
        description: p.description,
        region: p.region,
        icon: '🌱'
      })),
      ...resources.map(r => ({
        id: r.id,
        type: 'resource',
        name: r.title,
        description: r.description,
        region: r.location,
        icon: '📦'
      }))
    ].slice(0, limit);
  } catch (error) {
    console.error('Error fetching popular items:', error);
    return [];
  }
}
```

### Step 4: Add Landing Page to Navigation

Update header to link to landing page:

```html
<a href="/landing.html" class="logo">🌱</a>
```

### Step 5: Update Router/Navigation

If using a router, add route:

```javascript
{
  path: '/',
  component: 'landing.html'
}
```

---

## 🎯 How It Works

### For Anonymous Users

1. User visits landing page
2. No user authentication
3. **Global Section** displays:
   - 20 most popular projects globally
   - 20 most popular resources globally
   - "View" and "Add" buttons
4. Navigation links to projects, resources, and map
5. Sign up/login prompt in hero section

### For Authenticated Users

1. User visits landing page after login
2. **Personal Section** displays:
   - User's dashboard items (customized)
   - Initially uses global popular items
   - Updates based on user activity
3. **Customize Button** allows:
   - Adding specific projects/resources
   - Removing items
   - Changing number displayed
   - Searching for items
4. Settings allow:
   - Reset to default
   - Save customization

### Personalization Flow

**Initial Login:**
```
User logs in
  → Dashboard config created (empty)
  → Personal section shows global popular items
  → Items = global top 20 projects + resources
```

**Using the Platform:**
```
User clicks/views items
  → Activity logged to user_activity table
  → System tracks interaction
  → Dashboard still shows global popular initially
```

**Customization:**
```
User clicks "Customize"
  → Search for projects/resources
  → Select specific items
  → Save customization
  → Personal section updates with selected items
```

**After Regular Use:**
```
User views/clicks items
  → Activity tracked
  → System can calculate user's top items
  → Future: Dashboard evolves based on user behavior
```

---

## 📊 Database Schema

### user_activity Table

```sql
id              UUID         -- Unique ID
user_id         UUID         -- User who performed action
activity_type   TEXT         -- 'view', 'click', 'save', etc.
item_type       TEXT         -- 'project' or 'resource'
item_id         UUID         -- The project/resource ID
metadata        JSONB        -- Additional data
created_at      TIMESTAMP    -- When activity occurred
```

**Tracked Activities:**
- `view` - User viewed an item
- `click` - User clicked on an item
- `save` - User saved/bookmarked item
- `add_to_dashboard` - User added to landing page
- `remove_from_dashboard` - User removed from landing page

### user_dashboard_config Table

```sql
id               UUID         -- Unique ID
user_id          UUID         -- User (unique)
items            JSONB        -- Array of items on dashboard
item_count       INTEGER      -- How many items to show
is_personalized  BOOLEAN      -- Is it customized?
last_customized  TIMESTAMP    -- When last updated
created_at       TIMESTAMP    -- Creation time
updated_at       TIMESTAMP    -- Last update
```

**Example items JSON:**
```json
[
  {
    "id": "project-uuid-1",
    "type": "project",
    "name": "Forest Garden Project",
    "description": "A permaculture forest garden...",
    "region": "Funchal",
    "icon": "🌱"
  },
  {
    "id": "resource-uuid-2",
    "type": "resource",
    "name": "Heirloom Seeds",
    "description": "Traditional plant varieties...",
    "region": "Madeira",
    "icon": "📦"
  }
]
```

---

## 🔧 Frontend Implementation

### Activity Logging

When users interact with items, log it:

```javascript
// When user views a project
async function viewProject(projectId) {
  const user = await supabase.getCurrentUser();
  if (user) {
    await supabase.logActivity(
      user.id,
      'view',
      'project',
      projectId,
      { source: 'landing_page' }
    );
  }
  window.location.href = `/project?id=${projectId}`;
}
```

### Load User Dashboard

```javascript
async function loadUserDashboard(userId) {
  // Get user's config
  const config = await supabase.getUserDashboardConfig(userId);
  
  if (config && config.is_personalized) {
    // Show customized items
    renderPersonalCards(config.items);
  } else {
    // Show global popular items
    const popular = await supabase.getPopularItems(20);
    renderGlobalCards(popular);
  }
}
```

### Save Customization

```javascript
async function saveDashboard(userId, selectedItems) {
  await supabase.updateDashboardConfig(
    userId,
    selectedItems,
    selectedItems.length
  );
  
  // Reload dashboard
  renderPersonalCards(selectedItems);
}
```

---

## 🎨 Card Types

### Project Cards

```
┌─────────────────────────────┐
│ 🌱                  Trending│
│ (Green gradient bg)         │
├─────────────────────────────┤
│ Project Name                │
│ Short description...        │
│ 📍 Region | 📌 Project      │
├─────────────────────────────┤
│ [View] [Add to Dashboard]   │
└─────────────────────────────┘
```

### Resource Cards

```
┌─────────────────────────────┐
│ 📦                   Popular │
│ (Brown gradient bg)         │
├─────────────────────────────┤
│ Resource Name               │
│ Short description...        │
│ 📍 Location | 📌 Resource   │
├─────────────────────────────┤
│ [View] [Add to Dashboard]   │
└─────────────────────────────┘
```

---

## 📱 Mobile Design

- Single column card layout
- Touch-optimized buttons
- Full-width search
- Bottom navigation
- Horizontal scrolling for filters

---

## 🔐 Security

### Row Level Security

```sql
-- Users can only view their own activity
CREATE POLICY "Users can view their own activity"
  ON public.user_activity
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only update their own dashboard
CREATE POLICY "Users can update their own dashboard"
  ON public.user_dashboard_config
  FOR UPDATE
  USING (auth.uid() = user_id);
```

### Frontend Security

- Validate all user input
- Escape HTML output
- Check authentication
- Verify user owns data

---

## 📈 Analytics & Insights

### Available Metrics

**Via Views:**

1. **v_popular_projects** - Top 20 projects globally
2. **v_popular_resources** - Top 20 resources globally
3. **v_trending_today** - Items viewed today
4. **v_user_engagement** - Per-user engagement stats

**Via Functions:**

```javascript
// Get user's top items
const topItems = await supabase.request(
  'GET',
  '/rpc/get_user_top_items?p_user_id=user-id&p_limit=20'
);

// Get trending items today
const trending = await supabase.getAll('v_trending_today');

// Get user engagement
const engagement = await supabase.getAll('v_user_engagement', {
  where: 'user_id',
  operator: 'eq',
  value: userId
});
```

---

## 🚀 Future Enhancements

### Phase 2

- [ ] Machine learning recommendation engine
- [ ] "Because you viewed..." suggestions
- [ ] Trending items section
- [ ] User interests-based personalization
- [ ] Saved searches
- [ ] Following users/projects

### Phase 3

- [ ] Predictive personalization
- [ ] Community-based recommendations
- [ ] Smart collections
- [ ] Admin dashboard for analytics
- [ ] A/B testing support

---

## 🐛 Troubleshooting

### Landing page shows only global items

**Problem:** Dashboard config not loading
**Solution:** 
1. Check user_dashboard_config table exists
2. Check RLS policies allow user to read/write
3. Check localStorage for debugging

### Cards not clickable

**Problem:** Event listeners not attached
**Solution:**
1. Check supabase client loaded
2. Check i18n loaded
3. Check no JavaScript errors (F12)

### Activity not logging

**Problem:** logActivity function not working
**Solution:**
1. Check user_activity table exists
2. Check RLS policies allow insert
3. Check Supabase credentials

---

## 📞 Implementation Checklist

- [ ] Copy landing.html to project
- [ ] Copy landing-page-analytics.sql to db folder
- [ ] Run SQL migration in Supabase
- [ ] Update supabase-client.js with new methods
- [ ] Add landing page link to header
- [ ] Test global dashboard (not logged in)
- [ ] Test personal dashboard (logged in)
- [ ] Test customization panel
- [ ] Test activity logging
- [ ] Test on mobile
- [ ] Deploy to production

---

## 📚 Files Included

1. **landing.html** (35 KB)
   - Complete landing page with all features
   - Responsive design
   - Customization panel
   - Real-time search

2. **landing-page-analytics.sql** (8 KB)
   - Analytics tables
   - Views for popular items
   - Helper functions
   - RLS policies

---

## 🌱 Summary

The landing page provides:

✅ Global view of popular items  
✅ Personalized view for users  
✅ Full customization capability  
✅ Activity tracking  
✅ Analytics foundation  
✅ Mobile responsive  
✅ Secure with RLS  

Ready to personalize your platform! 🚀

