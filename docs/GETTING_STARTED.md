# Getting Started with Permahub

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/GETTING_STARTED.md

**Description:** Complete guide to setting up and running Permahub in 30 minutes

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-01-15

**Last Updated:** 2025-01-15

---

## 🌍 Welcome to Permahub!

Permahub is a **global permaculture community platform** that connects practitioners, projects, and sustainable living communities. This guide will help you get Permahub running locally or in the cloud in about 30 minutes.

---

## 🎯 What You'll Accomplish

By the end of this guide, you'll have:
- ✅ Permahub running locally on your machine
- ✅ Database connected to Supabase
- ✅ Sample data loaded for testing
- ✅ Understanding of the project structure
- ✅ Ready to develop or deploy

---

## 📋 Prerequisites

Before you begin, make sure you have:

### Required
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm 9+** - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)
- **Supabase account** - [Sign up free](https://supabase.com)

### Optional (for local development)
- **Docker Desktop** or **Colima** - For local Supabase instance
- **Code editor** - VS Code, Sublime, etc.

### Check Your Setup
```bash
# Verify Node.js (should be 18+)
node --version

# Verify npm (should be 9+)
npm --version

# Verify git
git --version
```

---

## 🚀 Quick Start (30 Minutes)

### Step 1: Clone the Repository (2 minutes)

```bash
# Clone the repository
git clone https://github.com/lballaty/Permahub.git

# Navigate to the project
cd Permahub

# Install dependencies
npm install
```

---

### Step 2: Set Up Supabase (10 minutes)

You have **two options**:

#### Option A: Cloud Supabase (Recommended - Easier)
Follow our [5-minute quickstart](database/quickstart.md):
- Create a free Supabase project
- Run the database migrations
- Copy your API keys

**Full guide:** [database/supabase-cloud-setup.md](database/supabase-cloud-setup.md)

#### Option B: Local Supabase (For offline development)
Follow our [local setup guide](database/supabase-local-setup.md):
- Install Docker/Colima
- Run Supabase locally
- No internet required for development

**Choose Option A if you're unsure** - it's faster and easier.

---

### Step 3: Configure Environment Variables (3 minutes)

1. **Copy the example environment file:**
   ```bash
   cp config/.env.example .env
   ```

2. **Edit `.env` and add your Supabase credentials:**
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

3. **Get these values from:**
   - Supabase Dashboard → Project Settings → API
   - Copy the "Project URL" and "anon public" key

---

### Step 4: Run Database Migrations (5 minutes)

**If using cloud Supabase:**
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **SQL Editor** → **New Query**
3. Run migrations in this order:
   - `database/migrations/001_initial_schema.sql` (copy & paste, then click Run)
   - `database/migrations/002_analytics.sql` (copy & paste, then click Run)
   - `database/migrations/003_items_pubsub.sql` (copy & paste, then click Run)

**Verification:** Go to **Database** → **Tables**. You should see 14+ tables.

**If using local Supabase:**
```bash
npx supabase db reset
```

**Full migration guide:** [database/migration-guide.md](database/migration-guide.md)

---

### Step 5: Load Sample Data (Optional - 2 minutes)

To test with sample projects and resources:

1. In Supabase SQL Editor, run:
   - `database/seeds/001_sample_users.sql`
   - `database/seeds/002_sample_projects.sql`
   - `database/seeds/003_sample_resources.sql`

This creates:
- 5 test users
- 10 sample permaculture projects
- 15 resource listings

---

### Step 6: Start the Development Server (1 minute)

```bash
# Start Vite dev server
npm run dev
```

Your app should now be running at: **http://localhost:3000**

Open your browser and visit the app!

---

### Step 7: Verify Everything Works (5 minutes)

**Check these pages:**

1. **Landing Page** - http://localhost:3000
   - Should show Permahub logo and hero section

2. **Dashboard** - http://localhost:3000/dashboard.html
   - Should show project cards (if you loaded sample data)

3. **Map** - http://localhost:3000/map.html
   - Should show interactive map with markers

4. **Resources** - http://localhost:3000/resources.html
   - Should show resource marketplace

5. **Browser Console** (F12 → Console)
   - Should see no major errors
   - Should see "Supabase connected" or similar

---

## ✅ Success! What's Next?

Congratulations! Permahub is now running. Here's what you can do:

### For Users
- **Explore the Platform** - Browse projects, resources, and the map
- **Create an Account** - Use the auth flow to sign up
- **Add Your Project** - Use the "Add Project" page
- **Customize Your Profile** - Set your location and interests

### For Developers
- **Read the Architecture** - [architecture/project-overview.md](architecture/project-overview.md)
- **Understand the Database** - [architecture/data-model.md](architecture/data-model.md)
- **Review Development Guide** - [development/quick-reference.md](development/quick-reference.md)
- **Learn About i18n** - [guides/i18n-implementation.md](guides/i18n-implementation.md)
- **Read Safety Procedures** - [operations/database-safety.md](operations/database-safety.md)

### For Contributors
- **Read Contributing Guidelines** - [../CONTRIBUTING.md](../CONTRIBUTING.md)
- **Check the Roadmap** - [../ROADMAP.md](../ROADMAP.md)
- **Review Coding Standards** - [../.claude/claude.md](../.claude/claude.md)
- **See Active Tasks** - [../IMPLEMENTATION_TODO.md](../IMPLEMENTATION_TODO.md)

---

## 🐛 Troubleshooting

### Development Server Won't Start

**Problem:** `npm run dev` fails

**Solutions:**
1. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```
2. Check Node.js version (must be 18+)
3. Check for port conflicts (port 3000 in use?)

---

### Can't Connect to Supabase

**Problem:** "Failed to connect to Supabase" or similar errors

**Solutions:**
1. Verify `.env` file exists in project root
2. Check `.env` has correct URL and keys (no trailing spaces)
3. Verify Supabase project is active (not paused)
4. Check browser console for specific error messages
5. Try visiting your Supabase project URL in a browser

---

### Database Migrations Failed

**Problem:** "Table already exists" or migration errors

**Solutions:**
1. Check which tables exist: Supabase Dashboard → Database → Tables
2. If tables exist, migrations may have already run
3. Safe to re-run migrations (they use `IF NOT EXISTS`)
4. See [database/troubleshooting.md](database/troubleshooting.md) for detailed help

---

### No Data Showing

**Problem:** Pages load but no projects/resources appear

**Solutions:**
1. Did you run the seed data scripts? (Step 5)
2. Check browser console for API errors
3. Verify RLS policies enabled in Supabase
4. Check you're logged in (if RLS requires auth)
5. Manually add data in Supabase Table Editor

---

### Authentication Not Working

**Problem:** Can't sign up or log in

**Solutions:**
1. Configure email provider in Supabase: Authentication → Providers
2. Add redirect URLs: Authentication → URL Configuration
   - Add `http://localhost:3000/auth`
   - Add `http://localhost:3000/dashboard`
3. Check email confirmation settings
4. See [guides/security.md](guides/security.md)

---

### Map Not Loading

**Problem:** Map shows blank or errors

**Solutions:**
1. Check internet connection (Leaflet loads from CDN)
2. Verify sample data has latitude/longitude values
3. Check browser console for specific errors
4. Ensure `earth` extension enabled in Supabase

---

### For More Help

**Check these resources:**
- [database/troubleshooting.md](database/troubleshooting.md) - Database issues
- [operations/safety-quick-reference.md](operations/safety-quick-reference.md) - Safety procedures
- [INDEX.md](INDEX.md) - Complete documentation index

**Still stuck?**
- Check GitHub Issues
- Review error messages carefully
- Contact: Libor Ballaty <libor@arionetworks.com>

---

## 🏗️ Project Structure Overview

```
/Permahub
├── src/                    # Source code
│   ├── pages/             # HTML pages (8 pages)
│   ├── js/                # JavaScript modules
│   ├── wiki/              # Wiki feature
│   └── assets/            # Images, fonts, etc.
│
├── database/              # Database schema & migrations
│   ├── migrations/        # SQL migration files
│   └── seeds/             # Sample data
│
├── docs/                  # Documentation (you are here!)
│   ├── INDEX.md           # Documentation map
│   ├── GETTING_STARTED.md # This file
│   ├── architecture/      # Architecture docs
│   ├── database/          # Database setup guides
│   ├── guides/            # Feature guides
│   ├── features/          # Feature documentation
│   ├── development/       # Development guides
│   ├── operations/        # Operations & safety
│   └── legal/             # Legal documents
│
├── tests/                 # Test suites
├── scripts/               # Utility scripts
├── .env                   # Environment variables (create this!)
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
└── README.md              # Project overview
```

---

## 📚 Key Technologies

- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Build Tool:** Vite (fast, modern)
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth (magic links + email/password)
- **Maps:** Leaflet.js + OpenStreetMap
- **Icons:** Font Awesome 6.4.0
- **i18n:** Custom system supporting 11 languages

---

## 🎓 Learning Path

**New to Permahub? Follow this path:**

1. **Read [../README.md](../README.md)** - Understand the vision (5 min)
2. **Follow this guide** - Get it running (30 min)
3. **Explore the app** - Click around, understand features (20 min)
4. **Read [architecture/project-overview.md](architecture/project-overview.md)** - Learn architecture (15 min)
5. **Review [architecture/data-model.md](architecture/data-model.md)** - Understand database (20 min)
6. **Check [development/quick-reference.md](development/quick-reference.md)** - Start developing (10 min)

**Total time investment:** ~2 hours to full understanding

---

## 🚀 Deployment to Production

**When you're ready to deploy:**

1. **Choose a hosting platform:**
   - Vercel (recommended - easy)
   - Netlify (also easy)
   - GitHub Pages (free, simple)

2. **Follow deployment guide:**
   - [guides/deployment.md](guides/deployment.md)

3. **Set up production Supabase:**
   - Use same cloud Supabase project OR
   - Create separate production project

4. **Configure environment variables:**
   - Set production Supabase URL and keys
   - Configure redirect URLs for your domain

**Estimated time:** 30-60 minutes for first deployment

---

## 📞 Getting Help

### Documentation
- **Complete index:** [INDEX.md](INDEX.md)
- **Troubleshooting:** [database/troubleshooting.md](database/troubleshooting.md)
- **Safety procedures:** [operations/safety-quick-reference.md](operations/safety-quick-reference.md)

### Support
- **Email:** libor@arionetworks.com
- **GitHub Issues:** [Report an issue](https://github.com/lballaty/Permahub/issues)

### Contributing
- **Guidelines:** [../CONTRIBUTING.md](../CONTRIBUTING.md)
- **Roadmap:** [../ROADMAP.md](../ROADMAP.md)
- **Standards:** [../.claude/claude.md](../.claude/claude.md)

---

## 🌟 Join the Community

Permahub is more than software - it's a movement toward sustainable living and permaculture education. By getting involved, you're helping connect a global community of practitioners.

**Ways to contribute:**
- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🌍 Add translations
- 💻 Contribute code
- 🌱 Spread the word

---

**Welcome to Permahub! Let's build a sustainable future together. 🌍🌱**

---

**Last Updated:** January 15, 2025

**Status:** Current and ready to use
