# Permahub Development Guidelines

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/.claude/claude.md

**Description:** Development standards and workflows for Permahub project

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-07

---

## 🎯 Project Overview

**Permahub** is a global permaculture community platform connecting practitioners, projects, and sustainable living communities. Built with vanilla JavaScript and Supabase backend.

**Key Features:**
- Interactive map discovery (Leaflet.js)
- Project showcase and browsing
- Resource marketplace
- User profiles with skills/interests
- Multi-language support (11 languages)
- Real-time notifications
- Secure authentication (magic links + email/password)

---

## 🔧 Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Build Tool:** Vite
- **Database:** PostgreSQL (Supabase)
- **Authentication:** Supabase Auth
- **Hosting:** Vercel/Netlify/GitHub Pages
- **Maps:** Leaflet.js + OpenStreetMap
- **Icons:** Font Awesome 6.4.0

---

## 📁 Project Structure

```
/Permahub
├── .env                          # Supabase credentials (DO NOT COMMIT)
├── .env.example                  # Template for .env
├── SUPABASE_SETUP_GUIDE.md      # Database setup instructions
├── src/
│   ├── pages/                   # HTML pages (8 pages)
│   │   ├── index.html           # Landing page
│   │   ├── auth.html            # Authentication flow
│   │   ├── dashboard.html       # Project discovery
│   │   ├── project.html         # Project details
│   │   ├── map.html             # Interactive map
│   │   ├── resources.html       # Marketplace
│   │   ├── add-item.html        # Create projects/resources
│   │   └── legal.html           # Privacy/Terms/Cookies
│   ├── js/                      # JavaScript modules
│   │   ├── config.js            # Environment configuration
│   │   ├── supabase-client.js   # Supabase API wrapper
│   │   └── i18n-translations.js # Multi-language system
│   ├── css/                     # Stylesheets (to be created)
│   └── assets/                  # Images and static files
├── database/
│   └── migrations/              # SQL migration files
│       ├── 001_initial_schema.sql
│       ├── 002_analytics.sql
│       └── 003_items_pubsub.sql
├── docs/                        # Documentation
├── config/
│   └── .env.example
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Development Workflow

### 1. Setting Up Development Environment

```bash
# Install dependencies
npm install

# Create .env file (already done)
cp config/.env.example .env
```

### **CRITICAL: Always Use Start/Stop Scripts**

**❌ NEVER run services directly:**
- `npm run dev` ❌
- `supabase start` ❌
- `vite` ❌

**✅ ALWAYS use the provided scripts:**

```bash
# Start ALL services (Supabase + Dev Server)
./start.sh

# Stop ALL services (clean shutdown)
./stopall.sh

# Force stop (if graceful shutdown fails)
./stopall.sh --force
```

**Why these scripts are required:**

1. **Port Management**: Scripts ensure correct ports (3001 for dev, 3000 for Supabase)
2. **Process Cleanup**: Prevents orphaned processes on odd ports (3002, 3003, etc.)
3. **Service Health Checks**: Verifies all services are running correctly
4. **Graceful Shutdown**: Properly closes connections and saves state
5. **Browser Integration**: Opens correct URLs automatically

**What `start.sh` does:**
- Checks Supabase status and starts if needed
- Stops any existing dev server instances (prevents port conflicts)
- Starts fresh Vite dev server on port 3001
- Lists all available wiki pages with URLs
- Optionally opens browser to home page

**What `stopall.sh` does:**
- Gracefully stops Vite dev server
- Stops Supabase (with backup)
- Kills any orphaned npm/vite/playwright processes
- Verifies all services stopped
- Shows summary of stopped services

Dev server runs on: **http://localhost:3001** (when using start.sh)

### 1.1. Fix Record Documentation

**CRITICAL REQUIREMENT:** Every fix, bug resolution, or issue correction MUST be documented in `/FixRecord.md`

**When to document:**
- After fixing any bug or error
- After resolving any console warning
- After correcting any incorrect behavior
- After any troubleshooting session

**How to document:**
1. Open `/FixRecord.md`
2. Add a new entry at the bottom using this format:

```markdown
### YYYY-MM-DD - Issue Title

**Commit:** `<commit-hash>` (if committed, or "pending")

**Issue:**
Brief description of the problem

**Root Cause:**
What caused the issue

**Solution:**
How it was fixed

**Files Changed:**
- path/to/file1.ext
- path/to/file2.ext

**Author:** Your Name <email>

---
```

3. Save the file
4. Include FixRecord.md in the same commit as the fix

**Example:**
See existing entries in FixRecord.md for proper formatting and level of detail.

**Pre-commit Hook:**
A git pre-commit hook automatically checks if FixRecord.md has been updated when committing fix-related code. If the hook detects a fix without FixRecord.md updates, it will:
- ⚠️ Warn you that documentation is missing
- ❓ Ask if you want to proceed anyway
- ✅ Allow the commit if FixRecord.md is included

To install the hook (if not already installed):
```bash
bash .githooks/setup-hooks.sh
```

### 2. Running Supabase Migrations

**Status:** Migrations created, ready to run in Supabase Console

Steps:
1. Go to https://supabase.com/dashboard
2. Select project: mcbxbaggjaxqfdvmrqsc
3. Go to SQL Editor
4. Run each migration file in order:
   - `/database/migrations/001_initial_schema.sql`
   - `/database/migrations/002_analytics.sql`
   - `/database/migrations/003_items_pubsub.sql`

See: `SUPABASE_SETUP_GUIDE.md` for detailed instructions

### 3. Making Code Changes

**IMPORTANT: Conservative Development Philosophy**

Before making ANY code change that affects:
- More than 2 files at once
- Function signatures
- Database schemas
- Dependencies
- Existing working code

**STOP and ask the user for approval first**

### 4. Git Workflow

**CRITICAL: Incremental Commits Required**

Commits MUST be incremental, one logical change per commit. This allows for:
- Easy review of individual changes
- Precise rollback of specific features
- Clear commit history
- Matching code changes to FixRecord.md entries

**Rules:**
1. **One change = One commit**: Each distinct fix, feature, or refactor gets its own commit
2. **Commit immediately after each change**: Don't batch multiple changes together
3. **Match FixRecord.md to code**: Each FixRecord.md entry should correspond to exactly one commit
4. **Update FixRecord.md BEFORE committing**: Add the FixRecord entry, then commit both the code change and the FixRecord update together

**Workflow:**

1. Check current branch: `git branch`
2. If on main: Ask user before proceeding
3. Create feature branch if needed: `git checkout -b feature/descriptive-name`
4. Make ONE logical change (fix one bug, add one feature, etc.)
5. Update FixRecord.md with entry for this change
6. Commit the change AND FixRecord.md together:
   ```bash
   git add path/to/changed/file.js FixRecord.md
   git commit -m "feat: Clear description of change"
   ```
7. Repeat steps 4-6 for each additional change
8. **DO NOT PUSH** - let user handle pushes

**Example - CORRECT (incremental):**
```bash
# Change 1: Create new file
git add src/wiki/js/wiki-guides.js FixRecord.md
git commit -m "feat: Create wiki-guides.js to load guides from database"

# Change 2: Fix different file
git add src/wiki/js/wiki-page.js FixRecord.md
git commit -m "fix: Remove persistent loading spinner on wiki page"
```

**Example - WRONG (batched):**
```bash
# DON'T DO THIS - multiple changes in one commit
git add src/wiki/js/wiki-guides.js src/wiki/js/wiki-page.js FixRecord.md
git commit -m "feat: Add guides page and fix spinner"
```

### 5. Automated GitHub Sync

**Status:** Active - Auto-sync runs every 2 hours

**What it does:**
- Automatically pushes all local branches with commits to GitHub
- Runs every 2 hours (7200 seconds)
- Only syncs committed changes (doesn't touch uncommitted files)
- Detects and notifies on merge conflicts
- Logs all activity to `/tmp/permahub-autosync.log`

**Management Commands:**

```bash
# Check sync status and view recent activity
./scripts/sync-status.sh

# Stop auto-sync service
./scripts/sync-stop.sh

# Start auto-sync service
./scripts/sync-start.sh
```

**How it works:**
1. Every 2 hours, `launchd` triggers the sync script
2. Script fetches latest from GitHub
3. For each local branch, checks if it has new commits
4. Pushes branches that are ahead of remote
5. If conflict detected, sends macOS notification and logs error
6. Continues running in background automatically

**Log files:**
- Main log: `/tmp/permahub-autosync.log`
- Stdout: `/tmp/permahub-autosync-stdout.log`
- Stderr: `/tmp/permahub-autosync-stderr.log`

**Service configuration:**
- Plist file: `~/Library/LaunchAgents/com.permahub.autosync.plist`
- Main script: `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/auto-sync-github.sh`

**Conflict handling:**
If a branch has diverged from remote (both local and remote have different commits):
- Sync script stops processing that branch
- Sends macOS notification: "Conflict detected on branch 'X'. Manual resolution required."
- Logs warning in log file
- Continues processing other branches
- You must manually resolve the conflict using `git pull --rebase` or `git pull`

**Note:** The auto-sync is completely independent of commits. You continue to commit incrementally as before, and the sync happens automatically in the background.

---

## 📝 Coding Standards

### File Headers

**Markdown files (.md):**
```markdown
# Document Title
**File:** /complete/absolute/path/to/filename.md
**Description:** Clear business purpose
**Author:** Libor Ballaty <libor@arionetworks.com>
**Created:** YYYY-MM-DD
**Last Updated:** YYYY-MM-DD
**Last Updated By:** Libor Ballaty <libor@arionetworks.com>
```

**Code files (.js, .html, .css, .sql):**
```javascript
/*
 * File: /complete/absolute/path/to/filename.js
 * Description: Clear business purpose
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: YYYY-MM-DD
 */
```

### Naming Conventions

**Functions:** Clear, business-friendly names
- ✅ `fetchProjectsNearby(latitude, longitude, radiusKm)`
- ❌ `getProjsNear(lat, lng, rad)`

**Variables:** Explicit names explaining purpose
- ✅ `user_organization_id`
- ❌ `org_id`

**Classes/Components:** PascalCase with full names
- ✅ `class ProjectDiscoveryMap`
- ❌ `class ProjMap`

**Files:** kebab-case or descriptive names
- ✅ `supabase-client.js`
- ❌ `sb.js`

### Documentation

Every function needs JSDoc-style documentation:

```javascript
/**
 * Search for projects within a specified radius
 *
 * Business Purpose: Enables location-based project discovery
 *
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @param {number} radiusKm - Search radius in kilometers (5-500)
 * @returns {Promise<Array>} Array of nearby projects
 *
 * @example
 * const projects = await searchProjectsNearby(32.7546, -17.0031, 50);
 * console.log(projects);  // Returns array of projects within 50km
 */
async function searchProjectsNearby(latitude, longitude, radiusKm) {
  // Implementation
}
```

---

## 🗄️ Database Standards

### Before ANY Database Work

1. **Read schema files:**
   - `/database/migrations/001_initial_schema.sql` (main schema)
   - `/docs/architecture/data-model.md` (documentation)

2. **Verify exact table/column names** - Never guess

3. **Use absolute paths** in all references
   - ✅ `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/001_initial_schema.sql`
   - ❌ `database/migrations/schema.sql`

### Key Tables

| Table | Purpose | Primary Key | Key Columns |
|-------|---------|-------------|------------|
| `public.users` | User profiles | `id (UUID)` | email, full_name, location, latitude, longitude |
| `public.projects` | Permaculture projects | `id (UUID)` | name, project_type, latitude, longitude, created_by |
| `public.resources` | Marketplace items | `id (UUID)` | title, resource_type, category_id, provider_id |
| `public.favorites` | User bookmarks | `id (UUID)` | user_id, project_id, resource_id |
| `public.items` | Unified flexible items | `id (UUID)` | item_type, category, title, created_by |
| `public.notifications` | User notifications | `id (UUID)` | recipient_id, item_id, is_read |

### Row-Level Security (RLS)

**All tables have RLS enabled.**

Key policies:
- Public profiles visible to all: `is_public_profile = true`
- Users can only modify their own data: `auth.uid() = id`
- Active projects/resources visible to all
- Users can create/edit/delete their own items

**Never disable RLS** without explicit user approval.

---

## 🔐 Environment Variables

**Required in .env:**
```env
VITE_SUPABASE_URL=https://mcbxbaggjaxqfdvmrqsc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

**Security rules:**
- ❌ NEVER commit `.env` to version control
- ❌ NEVER log credentials
- ❌ NEVER expose service role key in frontend
- ✅ Keep .env in .gitignore
- ✅ Use environment variables for config
- ✅ Use .env.example as template

---

## 🧪 Testing Standards

### Current Testing Status
- ❌ No unit tests yet
- ❌ No E2E tests yet
- ✅ Manual testing ready after dev server starts

### When We Add Tests

1. **Unit Tests:** Test individual functions
   - Tool: Vitest
   - Location: `/tests/unit/`
   - Run: `npm run test:unit`

2. **E2E Tests:** Test full user flows
   - Tool: Playwright
   - Location: `/tests/e2e/`
   - Run: `npm run test:e2e`

3. **Manual Testing:** Before any release
   - Test auth flows (magic link, password)
   - Test project discovery and filtering
   - Test resource marketplace
   - Test on mobile devices
   - Test cross-browser compatibility

---

## 🚀 Deployment

### Current Status
- ❌ Not deployed yet
- ✅ Ready for deployment (after testing)

### Deployment Checklist

Before deploying to production:

- [ ] All migrations run successfully in Supabase
- [ ] Auth email provider configured
- [ ] Environment variables set on host
- [ ] Redirect URLs configured
- [ ] `npm run build` succeeds without errors
- [ ] Local testing complete
- [ ] Security audit passed (`npm audit`)
- [ ] CSS extracted to separate files
- [ ] All console errors resolved
- [ ] RLS policies verified
- [ ] Analytics working

### Deployment Options

1. **Vercel** (Recommended)
   ```bash
   npm install -g vercel
   vercel --prod
   ```

2. **Netlify**
   ```bash
   netlify deploy --prod
   ```

3. **GitHub Pages**
   - Enable in repository settings
   - Runs from `/dist` after build

---

## 🎨 UI/UX Guidelines

### Design System

**Colors:**
- Primary Green: `#2d8659` (permaculture theme)
- Dark Green: `#1a5f3f` (accents)
- Light Green: `#3d9970` (hover states)
- Brown: `#556b6f` (complementary)
- Terracotta: `#d4a574` (accents)
- Cream: `#f5f5f0` (backgrounds)

**Typography:**
- Sans-serif: Segoe UI, Tahoma, Geneva, Verdana
- Serif: Georgia (headings, warmth)
- Mono: Courier New (code)

**Responsive Breakpoints:**
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

**Mobile-first approach:** Start with mobile styles, add desktop enhancements

---

## 🌍 Internationalization (i18n)

**System:** Custom translation system in `/src/js/i18n-translations.js`

**Supported Languages:**
- ✅ English (en) - Complete
- ✅ Portuguese (pt) - Complete
- ✅ Spanish (es) - Complete
- 🔲 French, German, Italian, Dutch, Polish, Japanese, Chinese, Korean (templates ready)

**How to use:**
```javascript
// In HTML
<h1 data-i18n="landing.title">Default Text</h1>

// In JavaScript
i18n.t('landing.title')  // Returns translated text
```

**How to add translation:**
```javascript
// In i18n-translations.js
translations.en.landing.title = "Welcome to Permahub"
translations.pt.landing.title = "Bem-vindo ao Permahub"
```

---

## 📞 Getting Help

### Common Issues

**Dev server won't start:**
1. Check Node version: `node --version` (need 18+)
2. Check npm installed: `npm --version` (need 9+)
3. Delete node_modules: `rm -rf node_modules`
4. Reinstall: `npm install`

**Can't connect to Supabase:**
1. Check .env file exists and has correct URL/key
2. Check Supabase project is active
3. Check network connection
4. Check browser console for errors

**CSS not loading:**
1. Currently CSS is in HTML `<style>` tags
2. Check browser DevTools: Inspect → Styles tab
3. Verify no network errors (F12 → Network tab)

**Auth not working:**
1. Check browser console for errors
2. Verify Supabase project has auth enabled
3. Check redirect URLs configured in Supabase
4. Check .env has correct anon key

### When Stuck

1. Check browser console: F12 → Console tab
2. Check browser network tab: F12 → Network tab
3. Review error messages carefully
4. Search Supabase docs: https://supabase.com/docs
5. Ask user for guidance - don't guess

---

## ✅ Pre-Launch Checklist

Before considering Permahub "ready for testing":

- [ ] All npm dependencies installed
- [ ] .env file created with Supabase credentials
- [ ] All 3 database migrations run in Supabase
- [ ] Tables verified in Supabase console
- [ ] RLS policies enabled on all tables
- [ ] Dev server starts: `npm run dev`
- [ ] All 8 pages load without errors
- [ ] Supabase connection verified
- [ ] Auth flow works end-to-end
- [ ] Project discovery works
- [ ] Resource marketplace works
- [ ] Map displays correctly
- [ ] i18n switching works
- [ ] No console errors in browser
- [ ] Responsive design works on mobile

---

## 🌱 Project Mission

> "Create a comprehensive, user-friendly platform that connects the global permaculture and sustainable living community, facilitating knowledge sharing, community discovery, and resource exchange while maintaining strong privacy protections."

Every feature should support this mission.

---

## 📚 Quick Links

- **Supabase Setup:** `SUPABASE_SETUP_GUIDE.md`
- **Data Model:** `/docs/architecture/data-model.md`
- **Project Overview:** `/docs/architecture/project-overview.md`
- **i18n System:** `/src/js/i18n-translations.js`
- **Repository:** https://github.com/lballaty/Permahub

---

**Last Updated:** 2025-11-07

**Status:** Development Ready - Awaiting Supabase Migration & Testing
