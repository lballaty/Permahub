# Supabase Configuration

**File:** `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/supabase/README.md`

**Description:** Supabase project structure and migration management for Permahub

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-12

---

## Overview

This directory contains the Supabase configuration and database migrations for the Permahub project.

**Project ID:** `mcbxbaggjaxqfdvmrqsc`

**Database:** PostgreSQL 15

**Region:** US East 1 (AWS)

---

## Directory Structure

```
supabase/
├── config.toml                 # Supabase project configuration
├── migrations/                 # Database migration files
│   ├── 00_bootstrap_execute_sql.sql
│   ├── 001_initial_schema.sql
│   ├── 002_analytics.sql
│   ├── 003_items_pubsub.sql
│   ├── 004_wiki_schema.sql
│   ├── 005_wiki_multilingual_content.sql
│   ├── 20251107_00_theme_associations.sql
│   └── 20251112_wiki_content_tables.sql
├── functions/                  # Edge Functions (for future use)
├── .gitignore
└── README.md
```

---

## Migration Execution Order

Migrations must be executed in the following order:

### Core Tables (Required First)
1. **00_bootstrap_execute_sql.sql** - Bootstrap RPC function for SQL execution
2. **001_initial_schema.sql** - Core tables (users, projects, resources, etc.)
3. **002_analytics.sql** - Analytics and dashboard tables
4. **003_items_pubsub.sql** - Flexible items and pub/sub notification system

### Feature Tables
5. **20251107_00_theme_associations.sql** - Link tables to eco-themes
6. **004_wiki_schema.sql** - Wiki system tables
7. **005_wiki_multilingual_content.sql** - Multilingual wiki content
8. **20251112_wiki_content_tables.sql** - Additional wiki content tables

### Row-Level Security (RLS)
9. **004_row_level_security_policies.sql** - All RLS policies (to be created)

---

## Running Migrations

### Option 1: Using Supabase SQL Editor (Recommended for now)

1. Go to https://supabase.com/dashboard
2. Select project: `mcbxbaggjaxqfdvmrqsc`
3. Go to SQL Editor
4. Copy and paste each migration file in order
5. Execute each one

### Option 2: Using Supabase CLI (After local setup)

```bash
# Initialize Supabase project
supabase init

# Link to remote project
supabase link --project-ref mcbxbaggjaxqfdvmrqsc

# Apply pending migrations
supabase db push

# View status
supabase migration list
```

### Option 3: Using psql directly

```bash
# Run individual migration
PGPASSWORD="YjFoN09mQkJIdzJxMTkxOA==" psql -h mcbxbaggjaxqfdvmrqsc.supabase.co \
  -U postgres -d postgres -f supabase/migrations/001_initial_schema.sql
```

---

## Configuration

### config.toml

The `config.toml` file contains all Supabase project settings:

- **API Configuration** - CORS, body size limits, auth settings
- **Database** - PostgreSQL version, port settings
- **Authentication** - Email/SMS, JWT expiry, signup settings
- **Realtime** - WebSocket configuration
- **Storage** - File size limits, S3 settings
- **Edge Functions** - Function settings and import maps
- **Observability** - Logging and monitoring

---

## Database Tables

### Core Tables
- `public.users` - User profiles
- `public.projects` - Permaculture projects
- `public.resources` - Marketplace resources
- `public.resource_categories` - Resource categorization
- `public.project_user_connections` - User-project relationships
- `public.favorites` - User bookmarks
- `public.tags` - Tag system

### Analytics Tables
- `public.user_activity` - User interaction tracking
- `public.user_dashboard_config` - Dashboard personalization

### Items & Notifications
- `public.items` - Flexible items system
- `public.notifications` - User notifications
- `public.notification_preferences` - Notification settings
- `public.item_followers` - Item subscription tracking
- `public.publication_subscriptions` - Publisher tracking

### Eco-Themes
- `public.eco_themes` - 8 sustainability focus areas

### Wiki System
- `public.wiki_pages` - Wiki content
- `public.wiki_content` - Multilingual content

---

## Row-Level Security (RLS)

All tables have RLS enabled with specific policies:

- **Users** - Can view public profiles; users see their own
- **Projects** - Can view active projects; users manage their own
- **Resources** - Can view available resources; users manage their own
- **Items** - Can view active items; creators manage their own
- **Notifications** - Users only see their own notifications

RLS policies are defined in `004_row_level_security_policies.sql` (to be created).

---

## Verification

After running migrations, verify all tables are created:

```sql
SELECT table_name, table_schema
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected: 20+ public tables

---

## Troubleshooting

### Connection Issues
```bash
# Test connection
PGPASSWORD="YjFoN09mQkJIdzJxMTkxOA==" psql -h mcbxbaggjaxqfdvmrqsc.supabase.co \
  -U postgres -d postgres -c "SELECT version();"
```

### View Migration Status
```bash
# In Supabase dashboard, go to:
# SQL Editor → sgd_migrations table to see applied migrations
```

### Rollback a Migration
```sql
-- Drop table and re-run migration
DROP TABLE IF EXISTS public.table_name CASCADE;
```

---

## Next Steps

1. Execute core migrations (00, 001, 002, 003)
2. Execute feature migrations (20251107_00, 004, 005, 20251112)
3. Create and execute 004_row_level_security_policies.sql
4. Test database connection
5. Create sample data for testing

---

## Resources

- **Supabase Docs:** https://supabase.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/15/
- **Project Dashboard:** https://supabase.com/dashboard/project/mcbxbaggjaxqfdvmrqsc

---

**Last Updated:** 2025-11-12

**Status:** Structure Created - Ready for Migrations
