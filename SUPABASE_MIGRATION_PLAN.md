# Permahub: Supabase Integration & Cloud Migration Plan
**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/SUPABASE_MIGRATION_PLAN.md
**Description:** Comprehensive plan for integrating Supabase and migrating Permahub to cloud deployment
**Author:** Libor Ballaty <libor@arionetworks.com>
**Created:** 2025-11-11

---

## 📋 Executive Summary

Permahub is **95% ready** for Supabase integration and cloud deployment. This plan outlines the exact steps needed to activate the platform for live user testing. The critical path is **3-5 days** to full production readiness.

**Project Status:**
- ✅ Frontend: 100% complete (8 pages, 7,513 LOC)
- ✅ JavaScript modules: 100% complete (config, API client, i18n)
- ✅ Database schema: 100% defined (27 tables, 4,142 LOC SQL)
- ✅ Testing infrastructure: 100% ready (150+ tests)
- ⏳ Database tables: Ready to create
- ⏳ Real data connections: Ready to wire up
- ⏳ Cloud deployment: Ready to push

---

## 🎯 Project Goals

1. **Connect Supabase database** - Activate all 27 PostgreSQL tables
2. **Wire up real data** - Replace mocked data with live database queries
3. **Test live features** - Verify all CRUD operations work
4. **Deploy to cloud** - Make app accessible to users
5. **Monitor and support** - Track usage, fix issues, scale as needed

---

## 🗄️ Phase 1: Database Setup (Critical Path)

### Timeline: 30 minutes - 1 hour
### Impact: Enables ALL core features

### 1.1 Prerequisites Check

**Before starting migrations:**

1. Verify Supabase project exists
   - Project: `mcbxbaggjaxqfdvmrqsc`
   - URL: `https://mcbxbaggjaxqfdvmrqsc.supabase.co`
   - Status: Active ✅

2. Verify environment variables
   ```bash
   # Check .env file has these:
   VITE_SUPABASE_URL=https://mcbxbaggjaxqfdvmrqsc.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   VITE_SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   ```

3. Verify local dev environment
   ```bash
   cd /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub
   npm run dev
   # Should start successfully on http://localhost:3001
   ```

### 1.2 Migration Execution Order

**CRITICAL: Run migrations in this exact order**

#### Step 1: Core Schema (Migration 001)
**File:** `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/001_initial_schema.sql`

**What it creates:**
- 8 core tables: users, projects, resources, resource_categories, project_user_connections, favorites, tags, user_activity
- Indexes for location-based queries (PostGIS)
- RLS policies (Row-Level Security)
- Helper functions

**How to run:**
1. Go to: https://supabase.com/dashboard
2. Select project: mcbxbaggjaxqfdvmrqsc
3. Navigate: SQL Editor → New Query
4. Copy entire contents of `001_initial_schema.sql`
5. Paste into SQL editor
6. Click "Run"
7. Verify: No errors, table count increases from 0 to 8

**Expected Results:**
```
✅ Created table "users" (22 columns)
✅ Created table "projects" (21 columns)
✅ Created table "resources" (20 columns)
✅ Created table "resource_categories" (7 columns)
✅ Created table "project_user_connections" (6 columns)
✅ Created table "favorites" (5 columns)
✅ Created table "tags" (4 columns)
✅ Created table "user_activity" (8 columns)
✅ Created 20+ indexes
✅ Created 15+ RLS policies
✅ Created 10+ helper functions
```

**Time:** 2-3 minutes

---

#### Step 2: Analytics Schema (Migration 002)
**File:** `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/002_analytics.sql`

**What it creates:**
- 2 analytics tables: landing_page_analytics, user_dashboard_config
- Analytics views and helpers

**How to run:**
1. SQL Editor → New Query
2. Copy entire contents of `002_analytics.sql`
3. Paste and Run
4. Verify: No errors

**Time:** 1 minute

---

#### Step 3: Pub/Sub & Notifications (Migration 003)
**File:** `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/003_items_pubsub.sql`

**What it creates:**
- 5 tables: items, notifications, notification_preferences, item_followers, publication_subscriptions
- Real-time pub/sub infrastructure
- Notification system

**How to run:**
1. SQL Editor → New Query
2. Copy entire contents of `003_items_pubsub.sql`
3. Paste and Run
4. Verify: No errors

**Time:** 2-3 minutes

---

### 1.3 Verify Core Schema Created

**After running migrations 001-003:**

1. Go to: SQL Editor
2. Run verification query:
   ```sql
   SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
   ```
3. Should show 13 tables (8 from 001 + 2 from 002 + 5 from 003)

**Tables that should exist:**
- auth.users (created by Supabase Auth automatically)
- public.users ✅
- public.projects ✅
- public.resources ✅
- public.resource_categories ✅
- public.project_user_connections ✅
- public.favorites ✅
- public.tags ✅
- public.user_activity ✅
- public.landing_page_analytics ✅
- public.user_dashboard_config ✅
- public.items ✅
- public.notifications ✅
- public.notification_preferences ✅
- public.item_followers ✅
- public.publication_subscriptions ✅

**Total: 15 core tables**

---

### 1.4 Optional: Feature Enhancements (10-15 minutes)

**Highly recommended before launch - adds these features:**

#### Migration 004: Wiki Schema (427 LOC)
**File:** `/database/migrations/004_wiki_schema.sql`
- Enables Community Wiki platform
- 3 tables: wiki_pages, wiki_comments, wiki_page_links
- Edit history tracking

#### Migration 005: Wiki Multilingual (279 LOC)
**File:** `/database/migrations/005_wiki_multilingual_content.sql`
- Enables content in 11 languages
- Language-specific page versions

#### Eco-Themes & Features (20251107_*.sql)
Run these 8 migrations in order:
1. `20251107_eco_themes.sql` - Define 10 eco-themes
2. `20251107_theme_associations.sql` - Link projects/resources to themes
3. `20251107_landing_page_analytics.sql` - Track hero section engagement
4. `20251107_learning_resources.sql` - Learning content management
5. `20251107_events.sql` - Event system (workshops, meetups, tours)
6. `20251107_event_registrations.sql` - RSVP and attendance tracking
7. `20251107_discussions.sql` - Community discussions/Q&A
8. `20251107_discussion_comments.sql` - Threaded discussion replies
9. `20251107_reviews.sql` - Project and resource reviews

**Combined impact:**
- 8 additional feature tables
- 40+ additional indexes
- 50+ additional RLS policies
- Wiki system fully enabled
- Event management enabled
- Community discussions enabled
- Learning resources enabled
- Eco-themes fully integrated

**Total new tables: 23 total (15 core + 8 features)**

**Recommended:** Run all of them - they're fully integrated with the data model

---

### 1.5 Database Configuration

#### Enable Row-Level Security (RLS)

**Why:** Ensures users can only access their own data and public items

**Check RLS is enabled:**
1. Go to: Authentication → Policies (in Supabase dashboard)
2. Each table should show RLS is enabled
3. Policies should be listed (created by migrations)

**Key RLS Policies:**
- Users can read all public profiles
- Users can only edit their own profile
- Anyone can read active projects
- Only project creators can edit projects
- Only creators can delete items
- Favorites are private to user

---

#### Configure CORS (Already Done)

**Status:** Already configured for localhost

**If adding production domain:**
1. Settings → API
2. Add domain to CORS allow list
3. Format: `https://yourdomain.com`

---

#### Verify PostGIS Enabled

**Check extensions:**
1. SQL Editor → New Query
2. Run:
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   CREATE EXTENSION IF NOT EXISTS earthdistance CASCADE;
   ```
3. Verify: No error messages

---

## 🔌 Phase 2: Application Integration (1-2 hours)

### 2.1 Test Database Connection

**In your local dev environment:**

```bash
npm run dev
```

**Open browser console (F12 → Console):**

Test API client:
```javascript
// In browser console, test the Supabase client:
const client = window.supabaseClient;

// Test: Fetch all projects (should be empty first)
await client.getAll('projects')
// Result: { data: [], error: null }

// Test: Fetch all users
await client.getAll('users')
// Result: { data: [], error: null }

// Test: Check auth status
client.getCurrentUser()
// Result: null (not logged in yet)
```

**Expected Results:**
- No authentication errors
- Empty arrays (no data yet)
- Queries execute without errors

---

### 2.2 Test Authentication Flow

**Step 1: Signup**

1. Open: http://localhost:3001/src/pages/auth.html
2. Click "Sign up" tab
3. Enter:
   - Email: test@example.com
   - Password: TestPassword123!
   - Full Name: Test User
4. Click "Create Account"

**Expected:**
- Page shows success message
- User table receives new record (check in Supabase)
- localStorage has auth token

**Verify in Supabase:**
1. SQL Editor → Run:
   ```sql
   SELECT id, email, full_name FROM public.users ORDER BY created_at DESC LIMIT 1;
   ```
2. Should show your test user

---

**Step 2: Login**

1. Logout first (if still logged in)
2. Click "Log in" tab
3. Enter email and password
4. Click "Sign in"

**Expected:**
- Page shows success
- Redirects to dashboard
- User menu shows logged-in state
- localStorage persists token

---

**Step 3: Magic Link**

1. Logout
2. Click "Log in" tab
3. Scroll to "Login with Magic Link"
4. Enter email
5. Click "Send magic link"

**Expected:**
- Success message shows
- In Supabase, check `auth.users` table
- Magic link flow should be ready

---

**Step 4: Password Reset**

1. On login page, click "Forgot password?"
2. Enter email
3. Click "Send reset link"

**Expected:**
- Success message
- Password recovery triggered

---

### 2.3 Create Sample Data

**For testing dashboard, map, and resources:**

#### Option A: Manual via Supabase Console

1. Go to: Supabase Dashboard → Tables
2. Click `projects` table
3. Click "Insert row" button
4. Fill in:
   - name: "Community Garden Project"
   - description: "Urban permaculture garden"
   - project_type: "agricultural"
   - latitude: 32.7546
   - longitude: -17.0031
   - region: "Western Cape"
   - country: "South Africa"
   - created_by: (select your user ID)
   - status: "active"
5. Click "Save"

**Repeat 5-10 times** with different projects

#### Option B: SQL Insert

1. SQL Editor → New Query
2. Copy this script:
   ```sql
   -- Insert sample projects
   INSERT INTO public.projects (name, description, project_type, latitude, longitude, region, country, created_by, status, created_at)
   SELECT
     CASE (ROW_NUMBER() OVER ())
       WHEN 1 THEN 'Community Garden Project'
       WHEN 2 THEN 'Agroforestry Demonstration Site'
       WHEN 3 THEN 'Permaculture Homestead'
       WHEN 4 THEN 'Urban Polyculture Food Forest'
       WHEN 5 THEN 'Regenerative Pasture System'
       ELSE 'Test Project ' || ROW_NUMBER() OVER ()
     END,
     'Sample project for testing',
     CASE (ROW_NUMBER() OVER () % 3)
       WHEN 0 THEN 'agricultural'
       WHEN 1 THEN 'educational'
       ELSE 'research'
     END,
     32.7546 + (ROW_NUMBER() OVER () * 0.05),
     -17.0031 + (ROW_NUMBER() OVER () * 0.05),
     'Test Region',
     'South Africa',
     (SELECT id FROM auth.users LIMIT 1),
     'active',
     NOW()
   FROM generate_series(1, 10);
   ```
3. Run query
4. Verify: 10 projects inserted

---

### 2.4 Test Dashboard with Real Data

1. Open: http://localhost:3001/src/pages/dashboard.html
2. Should see project cards loaded from database
3. Try filters:
   - Search by name
   - Filter by type
   - Click project → see details

**Expected:**
- Project cards display with data from DB
- Search/filters work
- No console errors

---

### 2.5 Test Map with Real Data

1. Open: http://localhost:3001/src/pages/map.html
2. Should see markers for all projects
3. Click markers → show project popup
4. Sidebar shows project list
5. Distance calculations show correctly

**Expected:**
- Map displays with real coordinates
- Markers appear in correct locations
- No console errors
- Geospatial queries work

---

## 🖼️ Phase 3: File Uploads (1-2 hours)

### 3.1 Configure Supabase Storage

**Create storage bucket:**

1. Go to: Supabase Dashboard → Storage
2. Click "Create new bucket"
3. Name: `project-images`
4. Privacy: Public
5. Click "Create bucket"

**Repeat for:**
- `resource-images`
- `user-avatars`
- `wiki-content`

---

### 3.2 Update Supabase Client

**File:** `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/src/js/supabase-client.js`

**Add image upload methods:**

```javascript
// Add to SupabaseClient class

async uploadImage(bucket, file, folder = '') {
  try {
    const filename = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${file.name}`;
    const filePath = folder ? `${folder}/${filename}` : filename;

    const response = await fetch(
      `${this.supabaseUrl}/storage/v1/object/${bucket}/${filePath}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': file.type,
        },
        body: file,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    // Return public URL
    return `${this.supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`;
  } catch (error) {
    console.error('Image upload error:', error);
    return null;
  }
}

async deleteImage(bucket, filePath) {
  try {
    const response = await fetch(
      `${this.supabaseUrl}/storage/v1/object/${bucket}/${filePath}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Image delete error:', error);
    return false;
  }
}
```

---

### 3.3 Update Add-Item Form

**File:** `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/src/pages/add-item.html`

**Update form submission to upload images:**

```javascript
// In form submission handler
const fileInput = document.querySelector('input[type="file"]');
let imageUrl = null;

if (fileInput.files.length > 0) {
  imageUrl = await client.uploadImage('project-images', fileInput.files[0], 'projects');
}

// Create project with image URL
await client.insert('projects', {
  name: formData.name,
  description: formData.description,
  image_url: imageUrl,
  // ... other fields
});
```

---

## 🚀 Phase 4: Email Configuration (1 hour)

### 4.1 Configure Email Provider

**In Supabase Dashboard:**

1. Go to: Authentication → Email Templates
2. Sender email should be verified
3. Three options:
   - Supabase default (built-in)
   - SendGrid (recommended)
   - AWS SES

**For development:** Supabase default is fine

**For production:** Configure SendGrid:
1. Create SendGrid account: https://sendgrid.com/
2. Get API key
3. In Supabase: Authentication → SMTP Settings
4. Enter SendGrid credentials
5. Test email delivery

---

### 4.2 Configure Magic Link

**In Supabase Dashboard:**

1. Authentication → Email Templates
2. Find "Confirm email" template
3. Verify magic link is included
4. Test by requesting magic link

---

### 4.3 Configure Redirect URLs

**Why:** Users need to be redirected after email confirmation

**In Supabase Dashboard:**

1. Authentication → URL Configuration
2. Add Redirect URLs:
   - `http://localhost:3000/src/pages/dashboard.html` (dev)
   - `http://localhost:3001/src/pages/dashboard.html` (dev alt)
   - `https://yourdomain.com/src/pages/dashboard.html` (production)
3. Save

---

## 📊 Phase 5: Testing (2-3 hours)

### 5.1 Manual Testing Checklist

**Authentication:**
- [ ] Signup with email/password works
- [ ] Login with email/password works
- [ ] Magic link sent successfully
- [ ] Magic link opens app
- [ ] Password reset works
- [ ] Logout clears session
- [ ] Session persists on page reload

**Projects:**
- [ ] Create project form submits
- [ ] Project appears in dashboard
- [ ] Project appears on map
- [ ] Can edit own project
- [ ] Cannot edit others' projects
- [ ] Can delete own project
- [ ] Image uploads work
- [ ] Can favorite project

**Resources:**
- [ ] Create resource form submits
- [ ] Resource appears in marketplace
- [ ] Can filter resources
- [ ] Can favorite resource
- [ ] Image uploads work

**Map:**
- [ ] Map loads and displays
- [ ] Markers show for all projects
- [ ] Can click markers
- [ ] Can filter by distance
- [ ] Geolocation works (if enabled)

**i18n:**
- [ ] Language switching works
- [ ] All 3 core languages work (en, pt, es)
- [ ] Translation persists on reload
- [ ] UI updates when language changes

---

### 5.2 Automated Testing

**Run full test suite:**

```bash
npm run test:all
```

**Expected:**
- 150+ tests pass
- 85%+ code coverage
- No failing tests
- No warnings

**Fix any failures:**
```bash
npm run test:unit    # Run unit tests
npm run test:e2e     # Run E2E tests
npm run test:ui      # Interactive mode
```

---

### 5.3 Security Checklist

**Before production:**

```bash
# Run security audit
npm audit

# Fix critical vulnerabilities
npm audit fix
```

**Database Security:**
- [ ] RLS policies enabled on all tables
- [ ] Service Role Key not exposed
- [ ] Auth tokens secured in localStorage
- [ ] HTTPS enforced on production

**Code Security:**
- [ ] No hardcoded credentials
- [ ] No console.logs with sensitive data
- [ ] No SQL injection vulnerabilities
- [ ] CORS configured correctly

---

## ☁️ Phase 6: Cloud Deployment (1-2 hours)

### 6.1 Choose Hosting Platform

**Option A: Vercel (Recommended)**
- Perfect for Vite apps
- Automatic builds from GitHub
- Free tier generous
- Global CDN
- Environment variables UI

**Option B: Netlify**
- Git-based deployment
- Automatic builds
- Free tier available
- Great support

**Option C: GitHub Pages**
- Free, built-in to GitHub
- No build step required
- Static hosting only
- Good for documentation

**Recommended:** Vercel for best performance

---

### 6.2 Deploy to Vercel

**Prerequisites:**
1. GitHub account
2. GitHub has your Permahub repo
3. Vercel account (free)

**Steps:**

1. Go to: https://vercel.com
2. Click "Import Project"
3. Connect GitHub
4. Select Permahub repository
5. Configure:
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
6. Add Environment Variables:
   ```
   VITE_SUPABASE_URL=https://mcbxbaggjaxqfdvmrqsc.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   VITE_SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   ```
7. Click "Deploy"

**After deployment:**
1. Vercel shows your live URL
2. Add to Supabase redirect URLs:
   - Your Vercel URL + `/src/pages/dashboard.html`
3. Test all features on live app

---

### 6.3 Configure Production Domain

**If using custom domain:**

1. Go to Vercel → Project Settings
2. Domains section
3. Add custom domain
4. Update DNS records (instructions provided)
5. Wait for SSL certificate (5 minutes)

**Update Supabase:**
1. Add domain to redirect URLs
2. Verify email sender domain (if using custom email)
3. Update CORS allow list

---

## 📋 Implementation Checklist

### Phase 1: Database (30 minutes)
- [ ] Run migration 001 (initial schema)
- [ ] Run migration 002 (analytics)
- [ ] Run migration 003 (pub/sub)
- [ ] Verify 15 tables created
- [ ] Verify RLS policies enabled
- [ ] Optional: Run feature migrations (004-005, 20251107_*)

### Phase 2: Integration (1-2 hours)
- [ ] Test database connection from app
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Test magic link flow
- [ ] Create sample projects (10+)
- [ ] Test dashboard with real data
- [ ] Test map with real coordinates
- [ ] Verify all queries work without errors

### Phase 3: File Uploads (1-2 hours)
- [ ] Create 4 storage buckets
- [ ] Update supabase-client.js with upload methods
- [ ] Test image upload from add-item page
- [ ] Verify images display correctly
- [ ] Test image deletion

### Phase 4: Email (1 hour)
- [ ] Verify email provider configured
- [ ] Test magic link email delivery
- [ ] Test password reset email
- [ ] Configure redirect URLs
- [ ] Test email → app flow

### Phase 5: Testing (2-3 hours)
- [ ] Manual testing: All features
- [ ] Automated tests: `npm run test:all`
- [ ] Security audit: `npm audit`
- [ ] Fix vulnerabilities
- [ ] Cross-browser testing
- [ ] Mobile device testing

### Phase 6: Deployment (1-2 hours)
- [ ] Choose hosting (Vercel recommended)
- [ ] Create deployment account
- [ ] Push to production
- [ ] Configure environment variables
- [ ] Update Supabase redirect URLs
- [ ] Add to CORS allow list
- [ ] Test all features on live app

---

## 🎯 Critical Success Metrics

**After each phase, verify:**

### Phase 1: Database
- ✅ All 15+ tables created
- ✅ No errors in migration execution
- ✅ RLS policies active
- ✅ Can query tables from SQL editor

### Phase 2: Integration
- ✅ App connects to database
- ✅ Auth flows work end-to-end
- ✅ Sample data visible in UI
- ✅ No console errors
- ✅ All CRUD operations work

### Phase 3: Uploads
- ✅ Files upload successfully
- ✅ Public URLs work
- ✅ Images display in app
- ✅ Deletion works

### Phase 4: Email
- ✅ Emails sent successfully
- ✅ Magic links work
- ✅ Password resets work
- ✅ Redirect URLs work

### Phase 5: Testing
- ✅ 150+ tests pass
- ✅ 85%+ coverage
- ✅ No security vulnerabilities
- ✅ Works on mobile
- ✅ Works on all major browsers

### Phase 6: Deployment
- ✅ Live URL accessible
- ✅ All features work on production
- ✅ Performance acceptable (Lighthouse > 90)
- ✅ No errors in production logs
- ✅ Ready for user testing

---

## 🚨 Troubleshooting

### Database Issues

**"Relation does not exist"**
- Cause: Migration didn't run
- Fix: Run migration again, verify completion

**"Permission denied for schema public"**
- Cause: RLS policy blocking access
- Fix: Check RLS policies, ensure user owns the record

**"Invalid auth token"**
- Cause: Token expired or invalid
- Fix: Logout and login again, clear localStorage

---

### Email Issues

**"Email not received"**
- Cause: Wrong email provider or credentials
- Fix: Check Supabase email settings, resend

**"Magic link expired"**
- Cause: Link older than 24 hours
- Fix: Request new link

---

### Deployment Issues

**"Build failed"**
- Cause: Missing environment variables or dependencies
- Fix: Check build logs, add env vars, reinstall deps

**"App loads but shows blank page"**
- Cause: Incorrect Supabase URL or key
- Fix: Verify .env variables, reload page

**"Can't connect to Supabase"**
- Cause: CORS policy or network issue
- Fix: Check CORS settings, add domain to allow list

---

## 📚 Reference Files

### Key Documentation
- **SUPABASE_SETUP_GUIDE.md** - Detailed database setup
- **PROJECT_STATUS.md** - Comprehensive status report
- **DEVELOPMENT.md** - Developer quick reference

### Migration Files (All in `/database/migrations/`)
- `001_initial_schema.sql` - Core 8 tables
- `002_analytics.sql` - Analytics (2 tables)
- `003_items_pubsub.sql` - Notifications (5 tables)
- `004_wiki_schema.sql` - Wiki (3 tables)
- `005_wiki_multilingual_content.sql` - Translations
- `20251107_eco_themes.sql` - Themes (10 themes)
- `20251107_theme_associations.sql` - Theme links
- `20251107_landing_page_analytics.sql` - Hero analytics
- `20251107_learning_resources.sql` - Learning content
- `20251107_events.sql` - Event management
- `20251107_event_registrations.sql` - Event RSVP
- `20251107_discussions.sql` - Q&A discussions
- `20251107_discussion_comments.sql` - Comment threads
- `20251107_reviews.sql` - Reviews and ratings

### Code Files
- **supabase-client.js** - API client (ready for image methods)
- **config.js** - Environment configuration
- **i18n-translations.js** - Translation system

### Test Files
- **tests/unit/supabase-client.test.js** - API tests
- **tests/e2e/auth.spec.js** - Authentication tests

---

## ⏱️ Timeline Summary

| Phase | Task | Duration | Status |
|-------|------|----------|--------|
| 1 | Run migrations 001-003 | 30 min | ⏳ Ready |
| 1 | Verify schema | 5 min | ⏳ Ready |
| 1 | Optional: Run feature migrations | 15 min | ⏳ Ready |
| 2 | Test database connection | 5 min | ⏳ Ready |
| 2 | Test authentication flow | 20 min | ⏳ Ready |
| 2 | Create sample data | 10 min | ⏳ Ready |
| 2 | Test dashboard/map | 15 min | ⏳ Ready |
| 3 | Configure storage buckets | 5 min | ⏳ Ready |
| 3 | Update supabase-client.js | 20 min | ⏳ Ready |
| 3 | Test image uploads | 10 min | ⏳ Ready |
| 4 | Configure email provider | 15 min | ⏳ Ready |
| 4 | Test email flows | 10 min | ⏳ Ready |
| 5 | Manual testing (all features) | 90 min | ⏳ Ready |
| 5 | Run automated tests | 20 min | ⏳ Ready |
| 5 | Security audit | 10 min | ⏳ Ready |
| 6 | Deploy to Vercel | 15 min | ⏳ Ready |
| 6 | Configure production domain | 10 min | ⏳ Ready |
| 6 | Test live app | 15 min | ⏳ Ready |
| **TOTAL** | **Full migration** | **5-7 hours** | ⏳ Ready |

---

## 🎉 Success Criteria

**You'll know you're successful when:**

1. ✅ All database tables created and verified
2. ✅ App connects to real database (no errors)
3. ✅ Can create account and login
4. ✅ Can create projects/resources
5. ✅ Dashboard shows real data
6. ✅ Map displays projects with coordinates
7. ✅ Image uploads work
8. ✅ Emails send successfully
9. ✅ All tests pass (150+)
10. ✅ No security vulnerabilities
11. ✅ Live on Vercel/cloud platform
12. ✅ **Ready for live user testing**

---

## 📞 Questions?

Contact: libor@arionetworks.com

**Reference:** Permahub Supabase Migration Plan v1.0
**Created:** 2025-11-11
**Status:** Ready for Execution
