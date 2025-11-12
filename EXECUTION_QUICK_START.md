# Permahub: Execution Quick Start Guide
**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/EXECUTION_QUICK_START.md
**Description:** Step-by-step quick reference for executing the Supabase migration plan
**Author:** Libor Ballaty <libor@arionetworks.com>
**Created:** 2025-11-11

---

## 🚀 Today's Action Plan

You have a fully built Permahub platform that's **95% ready**. Below is exactly what to do today to get it live.

---

## ⏰ Timeline: 5-7 Hours Total

| Step | Task | Time | Status |
|------|------|------|--------|
| 1 | Run 3 database migrations | 30 min | ⏳ Next |
| 2 | Test database connection | 30 min | Pending |
| 3 | Create sample data | 30 min | Pending |
| 4 | Run tests and verify | 1 hour | Pending |
| 5 | Configure storage buckets | 30 min | Pending |
| 6 | Configure email | 30 min | Pending |
| 7 | Deploy to cloud | 1 hour | Pending |
| **TOTAL** | **Full launch ready** | **5-7 hours** | ⏳ Ready |

---

## 🗄️ STEP 1: Database Migrations (30 minutes)

### Critical: Run These in Order

#### 1.1 Migration 001 (Core Schema)
```
File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/001_initial_schema.sql

Steps:
1. Go to: https://supabase.com/dashboard
2. Project: mcbxbaggjaxqfdvmrqsc
3. SQL Editor → New Query
4. Copy-paste ENTIRE file contents
5. Click "Run"
6. Verify: No errors, success message appears

Time: 2-3 minutes
```

#### 1.2 Migration 002 (Analytics)
```
File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/002_analytics.sql

Steps:
1. SQL Editor → New Query
2. Copy-paste ENTIRE file contents
3. Click "Run"
4. Verify: No errors

Time: 1 minute
```

#### 1.3 Migration 003 (Notifications)
```
File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/003_items_pubsub.sql

Steps:
1. SQL Editor → New Query
2. Copy-paste ENTIRE file contents
3. Click "Run"
4. Verify: No errors

Time: 2-3 minutes
```

### ✅ Verification (5 minutes)

Run this query in SQL Editor to verify all tables created:

```sql
SELECT COUNT(*) as table_count
FROM information_schema.tables
WHERE table_schema = 'public';
```

**Should show: 15 tables**

If not 15, check for error messages and re-run failed migration.

---

## (Optional) Feature Migrations (15 minutes)

**Highly recommended** - Adds wiki, events, discussions, learning resources

```bash
# All files in /database/migrations/ starting with 004 or 20251107_*

In order:
1. 004_wiki_schema.sql
2. 005_wiki_multilingual_content.sql
3. 20251107_eco_themes.sql
4. 20251107_theme_associations.sql
5. 20251107_landing_page_analytics.sql
6. 20251107_learning_resources.sql
7. 20251107_events.sql
8. 20251107_event_registrations.sql
9. 20251107_discussions.sql
10. 20251107_discussion_comments.sql
11. 20251107_reviews.sql

Same process: SQL Editor → New Query → Paste → Run
```

---

## 🔌 STEP 2: Test Database Connection (30 minutes)

### 2.1 Start Dev Server

```bash
cd /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub
npm run dev
```

Expected output:
```
  VITE v5.0.0  ready in 234 ms

  ➜  Local:   http://localhost:3001/
  ➜  press h to show help
```

Open: http://localhost:3001/

---

### 2.2 Test Auth Page

1. Open: http://localhost:3001/src/pages/auth.html
2. Click "Sign up" tab
3. Enter:
   - Email: `test1@example.com`
   - Password: `Test@123456`
   - Full Name: `Test User 1`
4. Click "Create Account"

**Expected:**
- Success message appears
- Page redirects or shows confirmation

**Verify in Supabase:**
1. Go to: https://supabase.com/dashboard → Tables
2. Click `users` table
3. Should see your test user in the list

---

### 2.3 Test Login

1. Go back to auth page
2. Click "Log in" tab
3. Enter email and password
4. Click "Sign in"

**Expected:**
- Login succeeds
- Page shows logged-in state

---

### 2.4 Test Browser Console

1. Open browser F12 → Console tab
2. Paste:
   ```javascript
   const result = await window.supabaseClient.getAll('users');
   console.log(result);
   ```
3. Press Enter

**Expected:**
- Returns array with your test user
- No error messages

---

## 📊 STEP 3: Create Sample Data (30 minutes)

### 3.1 Add Projects for Testing

Run this SQL in Supabase SQL Editor:

```sql
INSERT INTO public.projects (name, description, project_type, latitude, longitude, region, country, created_by, status, created_at)
VALUES
  ('Community Garden Project', 'Urban permaculture garden', 'agricultural', 32.7546, -17.0031, 'Western Cape', 'South Africa', (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1), 'active', NOW()),
  ('Agroforestry Demo Site', 'Multi-story food production system', 'agricultural', 32.7596, -17.0081, 'Western Cape', 'South Africa', (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1), 'active', NOW()),
  ('Urban Food Forest', 'Polyculture system in suburb', 'educational', 32.7496, -17.0081, 'Western Cape', 'South Africa', (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1), 'active', NOW()),
  ('Permaculture Homestead', 'Self-sufficient property', 'research', 32.7646, -16.9981, 'Western Cape', 'South Africa', (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1), 'active', NOW()),
  ('Water Harvesting Project', 'Rainwater collection system', 'agricultural', 32.7546, -17.0131, 'Western Cape', 'South Africa', (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1), 'active', NOW()),
  ('Regenerative Pasture', 'Rotational grazing system', 'agricultural', 32.7696, -17.0031, 'Western Cape', 'South Africa', (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1), 'active', NOW()),
  ('Biodiversity Sanctuary', 'Protected conservation area', 'educational', 32.7446, -17.0031, 'Western Cape', 'South Africa', (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1), 'active', NOW()),
  ('Composting Facility', 'Community nutrient cycling', 'research', 32.7546, -16.9931, 'Western Cape', 'South Africa', (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1), 'active', NOW()),
  ('Herb & Medicinal Garden', 'Therapeutic plant cultivation', 'educational', 32.7596, -16.9931, 'Western Cape', 'South Africa', (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1), 'active', NOW()),
  ('Beekeeping Project', 'Honey and pollination services', 'agricultural', 32.7446, -17.0081, 'Western Cape', 'South Africa', (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1), 'active', NOW());
```

**Expected:** 10 projects inserted

### 3.2 Add Resources for Testing

```sql
INSERT INTO public.resources (title, category_id, description, price, currency, availability_status, provider_id, created_by, created_at)
SELECT
  name,
  (SELECT id FROM resource_categories LIMIT 1),
  'High-quality ' || name,
  FLOOR(RANDOM() * 100)::decimal(10,2) + 5.00,
  'USD',
  CASE (RANDOM() * 2)::int WHEN 0 THEN 'in_stock' ELSE 'out_of_stock' END,
  (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1),
  (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1),
  NOW()
FROM (VALUES
  ('Permaculture Seeds Pack'),
  ('Organic Fertilizer (10kg)'),
  ('Composting Bin Kit'),
  ('Garden Tools Set'),
  ('Mulch (50kg bag)'),
  ('Heirloom Vegetable Seeds'),
  ('Native Plant Seedlings'),
  ('Beekeeping Starter Kit'),
  ('Water Tank (1000L)'),
  ('Drip Irrigation System')
) AS resources(name);
```

**Expected:** 10 resources inserted

---

## ✅ STEP 4: Run Tests (1 hour)

### 4.1 Run Full Test Suite

```bash
cd /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub
npm run test:all
```

**Expected:**
- 150+ tests run
- All pass (green ✅)
- No failures or errors
- Coverage report shows (aim for 85%+)

**If tests fail:**
```bash
npm run test:unit   # Just unit tests
npm run test:e2e    # Just E2E tests
npm run test:ui     # Interactive test UI
```

---

### 4.2 Check for Security Issues

```bash
npm audit
```

**Expected:**
- 0 critical vulnerabilities
- 0 high vulnerabilities
- (Low/moderate ok for now)

**If vulnerabilities found:**
```bash
npm audit fix
```

---

### 4.3 Verify Dashboard with Real Data

1. Open: http://localhost:3001/src/pages/dashboard.html
2. Should see 10 project cards from database
3. Try filters:
   - Search by name → results appear
   - Filter by type → projects filtered
   - Click project → project details page loads

**Expected:**
- Real data displays
- No errors in browser console
- Filters work correctly

---

### 4.4 Verify Map with Real Data

1. Open: http://localhost:3001/src/pages/map.html
2. Should see 10 markers on map
3. Click markers → popup shows project name
4. Sidebar shows project list
5. All locations in Western Cape area

**Expected:**
- Markers displayed correctly
- Coordinates match data
- No console errors

---

## 🖼️ STEP 5: Configure Storage (30 minutes)

### 5.1 Create Storage Buckets

In Supabase Dashboard:

1. Go to: Storage → Buckets
2. Click "Create new bucket"
3. Create 4 buckets (one at a time):

**Bucket 1:**
- Name: `project-images`
- Privacy: Public
- Click "Create"

**Bucket 2:**
- Name: `resource-images`
- Privacy: Public
- Click "Create"

**Bucket 3:**
- Name: `user-avatars`
- Privacy: Public
- Click "Create"

**Bucket 4:**
- Name: `wiki-content`
- Privacy: Public
- Click "Create"

**Expected:** 4 buckets listed in Storage

---

### 5.2 Test Image Upload

1. Go to: http://localhost:3001/src/pages/add-item.html
2. Click "New Project" tab
3. Fill in basic info
4. Upload an image
5. Submit form

**Expected:**
- Image uploads successfully
- Project created with image URL
- Image appears in dashboard

---

## 📧 STEP 6: Configure Email (30 minutes)

### 6.1 Email Provider Setup

**For Development (use default):**
- Supabase provides default email sending
- Emails go to console (preview mode)
- Good for testing

**For Production (configure provider):**

Option A: SendGrid (recommended)
1. Create account: https://sendgrid.com/
2. Get API key
3. In Supabase Dashboard:
   - Settings → Email Templates
   - Enter SendGrid API key
   - Configure sender email

Option B: Custom SMTP
1. In Supabase Dashboard:
   - Settings → Email Templates
   - Enter SMTP server details
   - Test connection

### 6.2 Configure Redirect URLs

In Supabase Dashboard:

1. Authentication → URL Configuration
2. Add these URLs under "Redirect URLs":
   ```
   http://localhost:3000/src/pages/dashboard.html
   http://localhost:3001/src/pages/dashboard.html
   ```
3. Click "Save"

**After deployment, add:**
```
https://yourdomain.com/src/pages/dashboard.html
https://your-vercel-project.vercel.app/src/pages/dashboard.html
```

---

### 6.3 Test Email Flows

**Test Magic Link:**
1. Go to: http://localhost:3001/src/pages/auth.html
2. Click "Log in" → scroll to "Login with Magic Link"
3. Enter test email
4. Check email (console or mailbox)
5. Click link → should log in

**Test Password Reset:**
1. Click "Forgot password?"
2. Enter email
3. Check email
4. Click link → should open reset form

---

## 🚀 STEP 7: Deploy to Cloud (1 hour)

### 7.1 Choose Platform

**Recommended: Vercel**
- Best for Vite apps
- Automatic GitHub integration
- Free tier includes 100GB bandwidth
- Global CDN

**Alternative: Netlify**
- Similar features
- Also great option

### 7.2 Deploy to Vercel

**Prerequisites:**
- GitHub account with Permahub repo
- Vercel account (free: https://vercel.com)

**Steps:**

1. Go to: https://vercel.com
2. Click "Create new project" or "Import"
3. Select "Import Git Repository"
4. Find Permahub repo, click "Import"
5. Configure:
   - Framework: Vite (auto-detected)
   - Build command: `npm run build` (default)
   - Output directory: `dist` (default)
6. **Add Environment Variables:**
   ```
   VITE_SUPABASE_URL = https://mcbxbaggjaxqfdvmrqsc.supabase.co
   VITE_SUPABASE_ANON_KEY = <your-anon-key>
   VITE_SUPABASE_SERVICE_ROLE_KEY = <your-service-role-key>
   ```
7. Click "Deploy"

**Wait:** 2-5 minutes for deployment

**Result:**
- Vercel shows live URL
- Example: `https://permahub-abc123.vercel.app`

---

### 7.3 Update Supabase Configuration

In Supabase Dashboard:

1. Authentication → URL Configuration
2. Add your Vercel URL:
   ```
   https://permahub-abc123.vercel.app/src/pages/dashboard.html
   ```
3. Click "Save"

---

### 7.4 Test Live App

1. Open your Vercel URL in browser
2. Test each feature:
   - [ ] Landing page loads
   - [ ] Auth flows work
   - [ ] Dashboard shows projects
   - [ ] Map displays correctly
   - [ ] Resources marketplace works
   - [ ] Image uploads work
   - [ ] Language switching works
   - [ ] No console errors

---

## 🎉 Success! You're Live

### Verify Everything Works:

- ✅ Database: 15+ tables created
- ✅ Auth: Signup/login/magic link work
- ✅ Projects: Create, read, update, delete work
- ✅ Dashboard: Shows real data
- ✅ Map: Displays with coordinates
- ✅ Resources: Marketplace functional
- ✅ Images: Upload and display
- ✅ Tests: 150+ passing
- ✅ Cloud: Live on Vercel
- ✅ Ready: For user testing

---

## 📋 Complete Checklist

### Phase 1: Database ✅
- [ ] Run migration 001
- [ ] Run migration 002
- [ ] Run migration 003
- [ ] Verify 15 tables created
- [ ] (Optional) Run feature migrations

### Phase 2: Integration ✅
- [ ] Test database connection
- [ ] Test signup/login
- [ ] Create sample projects
- [ ] Create sample resources
- [ ] Test dashboard with data
- [ ] Test map with data

### Phase 3: Storage ✅
- [ ] Create 4 storage buckets
- [ ] Test image upload

### Phase 4: Email ✅
- [ ] Configure email provider
- [ ] Test magic link
- [ ] Test password reset

### Phase 5: Testing ✅
- [ ] Run all tests
- [ ] Check security audit
- [ ] Test all features manually

### Phase 6: Deployment ✅
- [ ] Deploy to Vercel
- [ ] Configure environment variables
- [ ] Update redirect URLs
- [ ] Test live app

### Ready for Launch! 🚀
- [ ] All checklist items complete
- [ ] Live URL accessible
- [ ] Features tested on production
- [ ] Ready to invite users

---

## 🆘 Quick Troubleshooting

**"Relation projects does not exist"**
- Run migration 001 again
- Verify it completed successfully

**"Auth token invalid"**
- Logout and login again
- Clear localStorage (F12 → Application → Clear)

**"Image upload fails"**
- Verify storage buckets created
- Check bucket privacy settings (should be Public)

**"Email not received"**
- Check Supabase email provider settings
- Try resending
- Check spam folder

**"Deploy fails"**
- Check environment variables in Vercel
- Check build logs for errors
- Verify package.json exists

---

## 📞 Need Help?

See: `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/SUPABASE_MIGRATION_PLAN.md`

This is the detailed reference guide with complete explanations.

---

**Status:** Ready to Execute
**Last Updated:** 2025-11-11
**Estimated Time:** 5-7 hours to full launch
