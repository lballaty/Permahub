# Database Troubleshooting Guide

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/database/troubleshooting.md

**Description:** Common database issues and solutions for Permahub

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-01-15

**Last Updated:** 2025-01-15

---

## 🔍 Quick Diagnosis

**Use this flowchart to find your issue:**

```
Can't connect to Supabase?
  → See "Connection Issues"

Migrations failing?
  → See "Migration Problems"

No data showing?
  → See "Data Display Issues"

RLS/Permission errors?
  → See "Row-Level Security Issues"

Map/geospatial not working?
  → See "PostGIS/Geospatial Issues"

Authentication problems?
  → See "Auth Issues"

Performance slow?
  → See "Performance Issues"
```

---

## 🔌 Connection Issues

### Problem: "Failed to connect to Supabase"

**Symptoms:**
- Browser console shows "Failed to fetch"
- Network errors in DevTools
- App loads but no data appears

**Solutions:**

1. **Verify Environment Variables**
   ```bash
   # Check .env file exists
   ls -la .env

   # Check it has the correct values
   cat .env
   ```

   **Should contain:**
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ... (long string)
   VITE_SUPABASE_SERVICE_ROLE_KEY=eyJ... (long string)
   ```

2. **Verify No Trailing Spaces**
   - Common issue: spaces after the URL or keys
   - Trim any whitespace in .env file

3. **Restart Development Server**
   ```bash
   # Kill the dev server (Ctrl+C)
   # Start it again
   npm run dev
   ```

   **Note:** Vite requires restart after .env changes

4. **Check Supabase Project Status**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Verify project is Active (not Paused)
   - Free tier projects pause after 1 week of inactivity

5. **Verify Project URL**
   - In Supabase Dashboard → Project Settings → API
   - Copy exact URL (including https://)
   - Should match format: `https://abcdefgh.supabase.co`

6. **Check Browser Console**
   - Open DevTools (F12) → Console tab
   - Look for specific error messages
   - Common: CORS errors, 401 Unauthorized, 403 Forbidden

---

### Problem: "CORS policy blocked"

**Symptoms:**
- Console shows "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solutions:**

1. **Check Supabase URL Configuration**
   - Dashboard → Authentication → URL Configuration
   - Add your dev server URL: `http://localhost:3000`
   - Add with trailing slash: `http://localhost:3000/`

2. **Verify Using Correct Port**
   - Check what port Vite is running on
   - Update URL configuration if using different port

---

## 🗄️ Migration Problems

### Problem: "Table already exists"

**Symptoms:**
- Migration fails with "ERROR: relation already exists"

**Solutions:**

1. **Check Existing Tables**
   - Supabase Dashboard → Database → Tables
   - See which tables already exist

2. **Safe to Re-run**
   - Migrations use `CREATE TABLE IF NOT EXISTS`
   - Safe to re-run entire migration
   - Will skip existing tables

3. **Run Remaining Parts**
   - If some tables exist, migration will continue
   - Only creates missing tables
   - Indexes and functions also use IF NOT EXISTS

---

### Problem: "Extension does not exist"

**Symptoms:**
- "ERROR: extension 'uuid-ossp' does not exist"
- "ERROR: extension 'earth' does not exist"

**Solutions:**

1. **Enable Required Extensions**
   - Supabase Dashboard → Database → Extensions
   - Search for and enable:
     - `uuid-ossp` (for UUID generation)
     - `earthdistance` + `cube` (for geospatial queries)

2. **Restart Migration**
   - After enabling extensions, re-run the migration
   - Extensions must be enabled before running schema

3. **Local Supabase**
   ```bash
   # Extensions should auto-enable with db reset
   npx supabase db reset
   ```

---

### Problem: "Permission denied for schema public"

**Symptoms:**
- Migrations fail with permission errors

**Solutions:**

1. **Use Correct SQL Editor**
   - Must use Supabase Dashboard SQL Editor
   - Do NOT run as regular postgres user

2. **Verify Project Ownership**
   - Ensure logged in as project owner
   - Check you're in correct Supabase project

3. **For Local Supabase:**
   ```bash
   # Use Supabase CLI instead
   npx supabase db reset
   ```

---

### Problem: "Syntax error near..."

**Symptoms:**
- Migration fails with SQL syntax error

**Solutions:**

1. **Copy Entire File**
   - Make sure you copied the ENTIRE migration file
   - Check for truncated SQL at the end

2. **Check for Special Characters**
   - Ensure no smart quotes or special characters
   - Use plain text editor to verify

3. **Run One Migration at a Time**
   - Run 001_initial_schema.sql first
   - Verify success before running 002
   - Then run 003

---

## 📊 Data Display Issues

### Problem: No data showing in the app

**Symptoms:**
- Pages load but show empty lists
- "No projects found" or similar messages

**Solutions:**

1. **Check if Seed Data Was Loaded**
   ```sql
   -- Run in SQL Editor to check for data
   SELECT COUNT(*) FROM projects;
   SELECT COUNT(*) FROM resources;
   SELECT COUNT(*) FROM users;
   ```

2. **Load Seed Data**
   - Run seed files in `database/seeds/` directory
   - Order: 001_sample_users.sql → 002_sample_projects.sql → 003_sample_resources.sql

3. **Manually Add Test Data**
   - Supabase Dashboard → Table Editor
   - Click "Insert" → "Insert row"
   - Add at least one test project

4. **Check RLS Policies**
   - Data might exist but be hidden by RLS
   - See "Row-Level Security Issues" below

---

### Problem: Data exists but doesn't appear

**Symptoms:**
- Table Editor shows data
- App shows empty

**Solutions:**

1. **Check RLS Policies**
   - Dashboard → Database → Tables → [table name] → Policies
   - Verify SELECT policy exists and allows read
   - Common issue: policies require authentication

2. **Verify User is Authenticated**
   - If RLS requires `auth.uid()`, user must be logged in
   - Check if user object exists in console
   - Log in if required

3. **Check API Query**
   - Open browser DevTools → Network tab
   - Filter for "supabase"
   - Check API response - might show RLS error

4. **Check Filters in Code**
   - App might be filtering data too strictly
   - Check JavaScript for WHERE clauses
   - Verify location/status filters

---

## 🔒 Row-Level Security Issues

### Problem: "new row violates row-level security policy"

**Symptoms:**
- Can't insert data
- Error when creating projects/resources
- 403 Forbidden errors

**Solutions:**

1. **Verify RLS is Enabled**
   - Dashboard → Database → Tables → [table name]
   - Check "Enable RLS" toggle
   - Should be enabled for all tables

2. **Check INSERT Policy Exists**
   - Dashboard → Tables → [table name] → Policies
   - Verify INSERT policy allows your operation
   - Common: policy requires `auth.uid() = created_by`

3. **Ensure User is Authenticated**
   ```javascript
   // Check in browser console
   const { data: { user } } = await supabase.auth.getUser()
   console.log(user) // Should show user object
   ```

4. **Match Policy Requirements**
   - If policy requires `created_by = auth.uid()`, set created_by field:
   ```javascript
   const { data, error } = await supabase
     .from('projects')
     .insert({
       ...projectData,
       created_by: user.id // Must match authenticated user
     })
   ```

---

### Problem: "permission denied for table"

**Symptoms:**
- Can't read or write to specific tables
- Works for some tables, not others

**Solutions:**

1. **Check Table-Specific Policies**
   - Each table needs its own policies
   - Verify policies exist for the specific table

2. **Common Policy Patterns:**
   ```sql
   -- Allow authenticated users to read public data
   CREATE POLICY "Public read access"
   ON projects FOR SELECT
   USING (is_active = true AND is_published = true);

   -- Allow users to create their own data
   CREATE POLICY "Users can insert their own"
   ON projects FOR INSERT
   WITH CHECK (auth.uid() = created_by);

   -- Allow users to update their own data
   CREATE POLICY "Users can update their own"
   ON projects FOR UPDATE
   USING (auth.uid() = created_by);
   ```

---

## 🗺️ PostGIS/Geospatial Issues

### Problem: Map queries not working

**Symptoms:**
- "function ll_to_earth does not exist"
- Location-based searches fail
- Map shows no markers

**Solutions:**

1. **Enable earth Extension**
   - Dashboard → Database → Extensions
   - Enable `earthdistance`
   - Also enable `cube` (required dependency)

2. **Restart After Enabling**
   - Restart dev server after enabling extensions
   - May need to reconnect to Supabase

3. **Verify Extension is Active**
   ```sql
   -- Run in SQL Editor
   SELECT * FROM pg_extension WHERE extname IN ('cube', 'earthdistance');
   ```

4. **Check Lat/Lng Values**
   - Verify data has valid latitude/longitude
   - Latitude: -90 to 90
   - Longitude: -180 to 180

---

### Problem: Invalid coordinates

**Symptoms:**
- Markers don't show on map
- Distance calculations fail

**Solutions:**

1. **Validate Coordinate Format**
   ```sql
   -- Check for invalid coordinates
   SELECT id, latitude, longitude
   FROM projects
   WHERE latitude NOT BETWEEN -90 AND 90
      OR longitude NOT BETWEEN -180 AND 180;
   ```

2. **Fix Invalid Data**
   - Update invalid coordinates
   - Use default location if unknown
   - Portuguese default: (39.3999, -8.2245)

---

## 🔐 Authentication Issues

### Problem: Can't sign up or log in

**Symptoms:**
- Email verification not sent
- Login attempts fail
- Redirect doesn't work

**Solutions:**

1. **Configure Email Provider**
   - Dashboard → Authentication → Providers
   - Enable Email provider
   - Configure SMTP (or use default SendGrid)

2. **Set Redirect URLs**
   - Dashboard → Authentication → URL Configuration
   - Add:
     - `http://localhost:3000/auth`
     - `http://localhost:3000/dashboard`
     - Your production domain

3. **Check Email Confirmation Settings**
   - Dashboard → Authentication → Email Templates
   - Verify "Confirm signup" is enabled
   - Check "Redirect URL" in template

4. **Test with Magic Link**
   - Try magic link authentication first
   - Simpler than password authentication
   - Good for testing

---

### Problem: "Invalid login credentials"

**Symptoms:**
- Correct password but login fails

**Solutions:**

1. **Check Email Confirmation**
   - User must confirm email before logging in
   - Check spam folder for confirmation email

2. **Verify User Exists**
   ```sql
   SELECT id, email, email_confirmed_at
   FROM auth.users
   WHERE email = 'user@example.com';
   ```

3. **Reset Password**
   - Use "Forgot Password" flow
   - Or manually reset in Dashboard → Authentication → Users

---

## ⚡ Performance Issues

### Problem: Queries are slow

**Symptoms:**
- Pages take long to load
- Lag when scrolling lists
- Database timeout errors

**Solutions:**

1. **Check Indexes**
   - Migrations create indexes automatically
   - Verify indexes exist for frequently queried columns
   ```sql
   -- Check indexes on a table
   SELECT indexname, indexdef
   FROM pg_indexes
   WHERE tablename = 'projects';
   ```

2. **Optimize Queries**
   - Use selective columns instead of `SELECT *`
   - Add WHERE clauses to limit results
   - Use pagination for large datasets

3. **Use Views**
   - Migrations create optimized views
   - Use `v_active_projects` instead of raw `projects` table
   - Views have pre-applied filters and joins

4. **Check Database Size**
   - Dashboard → Database → Database Size
   - Free tier limited to 500 MB
   - Upgrade if approaching limit

---

## 🛠️ Local Supabase Issues

### Problem: Local Supabase won't start

**Symptoms:**
- `npx supabase start` fails
- Docker errors

**Solutions:**

1. **Check Docker is Running**
   ```bash
   docker ps
   ```

   **If no response:**
   - Start Docker Desktop (Mac/Windows)
   - Or start Colima: `colima start`

2. **Verify Port Availability**
   ```bash
   # Check if ports are in use
   lsof -i :5432  # PostgreSQL
   lsof -i :54321 # Supabase Studio
   ```

3. **Reset Local Supabase**
   ```bash
   npx supabase stop
   npx supabase start
   ```

4. **Check Colima (Mac)**
   ```bash
   # If using Colima instead of Docker Desktop
   colima status
   colima start --cpu 2 --memory 4
   ```

---

## 📞 Getting More Help

### Check Logs

**Browser Console:**
- Press F12 → Console tab
- Look for errors in red
- Check Network tab for failed requests

**Supabase Logs:**
- Dashboard → Logs → Postgres Logs
- Shows database errors
- Filter by time/severity

**Dev Server Logs:**
- Check terminal where `npm run dev` is running
- Vite shows compilation errors here

---

### Useful SQL Queries

**Check table row counts:**
```sql
SELECT
  'users' as table_name, COUNT(*) FROM users
UNION ALL SELECT 'projects', COUNT(*) FROM projects
UNION ALL SELECT 'resources', COUNT(*) FROM resources
UNION ALL SELECT 'favorites', COUNT(*) FROM favorites;
```

**Check RLS policies:**
```sql
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

**Check extensions:**
```sql
SELECT extname, extversion
FROM pg_extension
WHERE extname IN ('uuid-ossp', 'earthdistance', 'cube');
```

---

### Still Stuck?

1. **Read Related Docs:**
   - [supabase-cloud-setup.md](supabase-cloud-setup.md) - Setup guide
   - [migration-guide.md](migration-guide.md) - Migration details
   - [../operations/database-safety.md](../operations/database-safety.md) - Safety procedures

2. **Check Supabase Docs:**
   - [Supabase Documentation](https://supabase.com/docs)
   - [Supabase Community](https://github.com/supabase/supabase/discussions)

3. **Contact Support:**
   - Email: libor@arionetworks.com
   - GitHub Issues: [Report an issue](https://github.com/lballaty/Permahub/issues)

---

**Last Updated:** January 15, 2025

**Status:** Current and actively maintained
