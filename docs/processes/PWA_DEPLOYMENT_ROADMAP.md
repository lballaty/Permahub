# PWA Deployment Roadmap

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/processes/PWA_DEPLOYMENT_ROADMAP.md

**Description:** Step-by-step plan for testing, deploying database, creating PWA, and releasing to testers

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-01-18

---

## 🎯 Goal

Deploy Permahub Wiki as a Progressive Web App (PWA) for tester distribution after comprehensive testing and database migration to cloud.

---

## 📋 Deployment Phases

### Phase 1: Comprehensive Regression Testing ⏳ CURRENT PHASE

**Objective:** Ensure all features work correctly on local database before cloud migration

**Status:** Not Started

**Tasks:**
- [ ] Run full test suite: `npm run test`
  - [ ] Smoke tests pass
  - [ ] Unit tests pass
  - [ ] Integration tests pass
- [ ] Manual testing of all wiki pages:
  - [ ] wiki-home.html - Landing page
  - [ ] wiki-page.html - Individual wiki pages
  - [ ] wiki-editor.html - Content creation/editing
  - [ ] wiki-guides.html - Guides listing
  - [ ] wiki-events.html - Events calendar
  - [ ] wiki-map.html - Location map
  - [ ] wiki-favorites.html - User favorites
  - [ ] Authentication flows (signup, login, magic link, password reset)
- [ ] Test all CRUD operations:
  - [ ] Create wiki pages
  - [ ] Read/view wiki pages
  - [ ] Update wiki pages
  - [ ] Delete wiki pages (soft delete)
  - [ ] Restore deleted pages
- [ ] Test all features:
  - [ ] Search functionality
  - [ ] Category filtering
  - [ ] Theme groups
  - [ ] Favorites system
  - [ ] Map interactions
  - [ ] Event creation/viewing
  - [ ] Guide creation/viewing
- [ ] Test database operations:
  - [ ] All migrations applied
  - [ ] RLS policies working
  - [ ] Triggers functioning
  - [ ] Indexes performing well
- [ ] Browser compatibility:
  - [ ] Chrome/Edge (Chromium)
  - [ ] Firefox
  - [ ] Safari (macOS/iOS)
- [ ] Mobile responsiveness:
  - [ ] iPhone (various sizes)
  - [ ] iPad
  - [ ] Android phones
  - [ ] Android tablets
- [ ] Performance testing:
  - [ ] Page load times
  - [ ] Database query performance
  - [ ] Image loading
  - [ ] Map rendering

**Acceptance Criteria:**
- ✅ All automated tests pass
- ✅ No console errors on any page
- ✅ All features work as expected
- ✅ No data loss or corruption
- ✅ Works on all target browsers
- ✅ Responsive on all device sizes

**Timeline:** 2-3 days

**Blockers:**
- Any failing tests must be fixed
- Any critical bugs must be resolved
- Performance issues must be addressed

---

### Phase 2: Deploy Local Database to Cloud ⏸️ PENDING

**Objective:** Migrate local Supabase database to cloud instance

**Status:** Waiting for Phase 1 completion

**Prerequisites:**
- ✅ Supabase cloud project created (mcbxbaggjaxqfdvmrqsc.supabase.co)
- ✅ Environment variables configured
- ⏸️ Local database fully tested

**Tasks:**
- [ ] Review migration files in `/supabase/migrations/`
  - [ ] Verify all migrations are present
  - [ ] Check migration order
  - [ ] Ensure no dependencies missing
- [ ] Review seed files in `/supabase/seeds/`
  - [ ] Verify all seed data is ready
  - [ ] Check for test/dummy data to exclude
- [ ] Backup local database (safety):
  ```bash
  supabase db dump -f backup_$(date +%Y%m%d).sql
  ```
- [ ] Deploy migrations to cloud:
  - [ ] Connect to cloud project
  - [ ] Run migrations in order
  - [ ] Verify each migration succeeds
  - [ ] Check for errors/warnings
- [ ] Deploy seed data:
  - [ ] Review seed data for production-readiness
  - [ ] Run seed files
  - [ ] Verify data integrity
- [ ] Test cloud database:
  - [ ] Connect app to cloud database
  - [ ] Test CRUD operations
  - [ ] Verify RLS policies work
  - [ ] Test authentication flows
  - [ ] Check performance
- [ ] Verify data migration:
  - [ ] All tables present
  - [ ] All columns correct
  - [ ] All indexes created
  - [ ] All triggers working
  - [ ] All functions deployed
  - [ ] Sample data verification

**Database Migration Checklist:**
- [ ] Tables: users, wiki_pages, wiki_categories, wiki_theme_groups, events, locations, favorites, notifications, items
- [ ] RLS Policies: All tables have correct policies
- [ ] Storage: Buckets configured for images/uploads
- [ ] Auth: Email provider configured
- [ ] Auth: Redirect URLs configured
- [ ] Functions: All database functions deployed
- [ ] Triggers: All triggers active

**Acceptance Criteria:**
- ✅ All migrations run successfully
- ✅ All data migrated correctly
- ✅ App connects to cloud database
- ✅ All features work on cloud database
- ✅ Performance acceptable
- ✅ No data loss

**Timeline:** 1-2 days

**Blockers:**
- Migration errors must be resolved
- Data integrity issues must be fixed
- Performance problems must be addressed

---

### Phase 3: Create PWA Configuration ⏸️ PENDING

**Objective:** Add PWA capabilities to make app installable

**Status:** Waiting for Phase 2 completion

**Prerequisites:**
- ⏸️ App tested and working on cloud database
- ⏸️ All features functioning correctly

**Tasks:**

#### 3.1: Create Web App Manifest
- [ ] Create `/public/manifest.json`:
  ```json
  {
    "name": "Permahub Wiki",
    "short_name": "Permahub",
    "description": "Global permaculture community platform",
    "start_url": "/wiki/wiki-home.html",
    "display": "standalone",
    "background_color": "#f5f5f0",
    "theme_color": "#2d8659",
    "orientation": "portrait-primary",
    "icons": [
      {
        "src": "/icons/icon-72.png",
        "sizes": "72x72",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/icons/icon-96.png",
        "sizes": "96x96",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/icons/icon-128.png",
        "sizes": "128x128",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/icons/icon-144.png",
        "sizes": "144x144",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/icons/icon-152.png",
        "sizes": "152x152",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/icons/icon-192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/icons/icon-384.png",
        "sizes": "384x384",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/icons/icon-512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any maskable"
      }
    ],
    "screenshots": [
      {
        "src": "/screenshots/home.png",
        "sizes": "540x720",
        "type": "image/png"
      }
    ]
  }
  ```

#### 3.2: Create App Icons
- [ ] Design app icon (Permahub logo)
- [ ] Generate icon sizes:
  - [ ] 72x72 (iOS)
  - [ ] 96x96 (Android)
  - [ ] 128x128 (Chrome)
  - [ ] 144x144 (Windows)
  - [ ] 152x152 (iOS)
  - [ ] 192x192 (Android, Chrome)
  - [ ] 384x384 (Chrome)
  - [ ] 512x512 (Chrome, iOS)
- [ ] Create maskable icons (for adaptive icons)
- [ ] Place in `/public/icons/` directory

#### 3.3: Create Service Worker
- [ ] Create `/public/service-worker.js`:
  ```javascript
  const CACHE_VERSION = 'v1.0.0';
  const CACHE_NAME = `permahub-wiki-${CACHE_VERSION}`;

  // Files to cache on install
  const STATIC_CACHE = [
    '/wiki/wiki-home.html',
    '/css/styles.css',
    '/js/app.js',
    '/icons/icon-192.png',
    '/icons/icon-512.png'
    // Add critical assets
  ];

  // Install event - cache static assets
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => cache.addAll(STATIC_CACHE))
        .then(() => self.skipWaiting())
    );
  });

  // Activate event - clean old caches
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys()
        .then(cacheNames => {
          return Promise.all(
            cacheNames
              .filter(name => name !== CACHE_NAME)
              .map(name => caches.delete(name))
          );
        })
        .then(() => self.clients.claim())
    );
  });

  // Fetch event - network first, fallback to cache
  self.addEventListener('fetch', (event) => {
    // Never cache Supabase requests (always fresh)
    if (event.request.url.includes('supabase')) {
      return event.respondWith(fetch(event.request));
    }

    // Network first for HTML pages
    if (event.request.destination === 'document') {
      event.respondWith(
        fetch(event.request)
          .then(response => {
            const clone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, clone));
            return response;
          })
          .catch(() => caches.match(event.request))
      );
    } else {
      // Cache first for assets
      event.respondWith(
        caches.match(event.request)
          .then(cached => cached || fetch(event.request))
      );
    }
  });
  ```

#### 3.4: Update HTML Files
- [ ] Add manifest link to all HTML pages:
  ```html
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#2d8659">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="Permahub">
  ```

#### 3.5: Register Service Worker
- [ ] Add to main JavaScript file:
  ```javascript
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('Service Worker registered:', reg))
        .catch(err => console.error('Service Worker registration failed:', err));
    });
  }
  ```

#### 3.6: Add Security Headers
- [ ] Configure Content Security Policy (CSP)
- [ ] Set up CORS headers
- [ ] Add security headers for hosting platform

**Acceptance Criteria:**
- ✅ Manifest.json validates (Chrome DevTools)
- ✅ All icon sizes present
- ✅ Service worker registers successfully
- ✅ PWA installable on Chrome
- ✅ PWA installable on Safari (iOS)
- ✅ Lighthouse PWA score > 90

**Timeline:** 3-5 hours

---

### Phase 4: Deploy to Hosting ⏸️ PENDING

**Objective:** Deploy app with PWA to production hosting

**Status:** Waiting for Phase 3 completion

**Prerequisites:**
- ⏸️ PWA configuration complete
- ⏸️ App working with cloud database

**Hosting Options:**

#### Option A: Vercel (Recommended)
**Pros:**
- ✅ Easy GitHub integration
- ✅ Automatic deployments
- ✅ Great performance
- ✅ Free tier sufficient
- ✅ Custom domains
- ✅ HTTPS automatic

**Setup:**
1. [ ] Create Vercel account
2. [ ] Connect GitHub repository
3. [ ] Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. [ ] Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. [ ] Deploy
6. [ ] Test deployed app
7. [ ] Configure custom domain (optional)

#### Option B: Netlify
**Pros:**
- ✅ Similar to Vercel
- ✅ Great documentation
- ✅ Form handling
- ✅ Split testing

**Setup:**
1. [ ] Create Netlify account
2. [ ] Connect GitHub repository
3. [ ] Configure build settings
4. [ ] Add environment variables
5. [ ] Deploy
6. [ ] Test deployed app

#### Option C: GitHub Pages
**Pros:**
- ✅ Free
- ✅ Simple
- ✅ Direct from repo

**Cons:**
- ❌ No environment variables (need workaround)
- ❌ Less features

**Tasks:**
- [ ] Choose hosting platform
- [ ] Set up account
- [ ] Configure deployment
- [ ] Add environment variables
- [ ] Deploy application
- [ ] Test deployment:
  - [ ] All pages load
  - [ ] Supabase connection works
  - [ ] Authentication works
  - [ ] All features functional
  - [ ] HTTPS enabled
  - [ ] PWA installable
- [ ] Set up custom domain (optional)
- [ ] Configure DNS (if custom domain)

**Acceptance Criteria:**
- ✅ App deployed successfully
- ✅ Accessible via URL
- ✅ HTTPS working
- ✅ All features work in production
- ✅ No console errors
- ✅ PWA installable from production URL

**Timeline:** 2-3 hours

---

### Phase 5: Test PWA Installation ⏸️ PENDING

**Objective:** Verify PWA installation works on all target platforms

**Status:** Waiting for Phase 4 completion

**Prerequisites:**
- ⏸️ App deployed to production
- ⏸️ HTTPS enabled

**Testing Platforms:**

#### iOS (Safari)
- [ ] iPhone (iOS Safari):
  - [ ] Visit production URL
  - [ ] Tap Share button
  - [ ] Select "Add to Home Screen"
  - [ ] Verify app icon appears
  - [ ] Launch from home screen
  - [ ] Verify standalone mode (no Safari UI)
  - [ ] Test all features
  - [ ] Check offline behavior
- [ ] iPad (iOS Safari):
  - [ ] Same tests as iPhone
  - [ ] Verify tablet layout

#### Android (Chrome)
- [ ] Android phone:
  - [ ] Visit production URL
  - [ ] Tap "Install app" prompt
  - [ ] Verify app appears in app drawer
  - [ ] Launch from app drawer
  - [ ] Test all features
  - [ ] Check offline behavior
- [ ] Android tablet:
  - [ ] Same tests as phone
  - [ ] Verify tablet layout

#### macOS (Safari/Chrome)
- [ ] Safari:
  - [ ] Visit production URL
  - [ ] File → Add to Dock
  - [ ] Launch from Dock
  - [ ] Test all features
- [ ] Chrome:
  - [ ] Visit production URL
  - [ ] Click install icon in address bar
  - [ ] Verify app in Applications
  - [ ] Launch from Applications
  - [ ] Test all features

#### Windows (Chrome/Edge)
- [ ] Chrome:
  - [ ] Install from browser
  - [ ] Test features
- [ ] Edge:
  - [ ] Install from browser
  - [ ] Test features

**Testing Checklist (Each Platform):**
- [ ] PWA installs successfully
- [ ] App icon displays correctly
- [ ] Launch screen works
- [ ] Splash screen (if configured)
- [ ] Theme color applies
- [ ] Standalone mode (no browser UI)
- [ ] All pages navigate correctly
- [ ] Authentication works
- [ ] Database operations work
- [ ] Images load
- [ ] Map functions
- [ ] Offline behavior (if configured)
- [ ] Service worker updates
- [ ] No console errors

**Acceptance Criteria:**
- ✅ Installs on iOS Safari
- ✅ Installs on Android Chrome
- ✅ Installs on macOS Safari/Chrome
- ✅ Installs on Windows Chrome/Edge
- ✅ All features work when installed
- ✅ Looks like native app
- ✅ No major bugs

**Timeline:** 1-2 days (testing multiple devices)

---

### Phase 6: Release to Testers ⏸️ PENDING

**Objective:** Share PWA with testers and gather feedback

**Status:** Waiting for Phase 5 completion

**Prerequisites:**
- ⏸️ PWA tested on all platforms
- ⏸️ All critical bugs fixed

**Tasks:**

#### 6.1: Prepare Tester Documentation
- [ ] Create tester guide:
  - [ ] How to access the app (URL)
  - [ ] How to install PWA (per platform)
  - [ ] What to test
  - [ ] How to report bugs
  - [ ] Expected features
- [ ] Create screenshots/demo video
- [ ] List known issues

#### 6.2: Set Up Feedback Collection
- [ ] Create feedback form (Google Forms/Typeform)
- [ ] Set up bug reporting system (GitHub Issues)
- [ ] Create tester communication channel (Discord/Slack)

#### 6.3: Invite Testers
- [ ] Identify tester group
- [ ] Send invitation emails
- [ ] Share installation instructions
- [ ] Provide access credentials (if needed)

#### 6.4: Monitor & Support
- [ ] Monitor for issues
- [ ] Respond to questions
- [ ] Fix critical bugs quickly
- [ ] Collect feedback
- [ ] Iterate based on feedback

**Tester Communication Template:**

```
Subject: Permahub Wiki - Beta Testing Invitation

Hi [Name],

You're invited to test Permahub Wiki, our new permaculture community platform!

🌱 What is Permahub?
A global platform connecting permaculture practitioners, projects, and sustainable living communities.

📱 How to Access:
1. Visit: [production-url]
2. Install as PWA (instructions below)
3. Create account and explore!

📲 Installation Instructions:

iOS (iPhone/iPad):
1. Open Safari and visit [url]
2. Tap Share button
3. Select "Add to Home Screen"
4. Tap "Add"

Android:
1. Open Chrome and visit [url]
2. Tap "Install app" when prompted
3. Or tap menu → "Install app"

Desktop (Mac/Windows):
1. Visit [url] in Chrome/Safari/Edge
2. Click install icon in address bar
3. Click "Install"

🧪 What to Test:
- Browse wiki pages
- Create content
- Search and filter
- View map
- Check events
- Report any bugs!

🐛 Report Issues:
[Link to bug reporting form/GitHub Issues]

💬 Questions?
Reply to this email or join our [Discord/Slack]

Thanks for helping make Permahub better!

Best,
[Your Name]
```

**Acceptance Criteria:**
- ✅ Testers receive clear instructions
- ✅ Testers can install PWA
- ✅ Testers can create accounts
- ✅ Feedback collected
- ✅ Bugs identified and tracked
- ✅ Communication channel active

**Timeline:** Ongoing (2-4 weeks testing period)

---

## 📊 Success Metrics

### Technical Metrics:
- [ ] 100% automated tests passing
- [ ] Zero critical bugs
- [ ] < 3 second page load time
- [ ] PWA Lighthouse score > 90
- [ ] Works on iOS Safari
- [ ] Works on Android Chrome
- [ ] Works on desktop browsers

### User Metrics:
- [ ] 80%+ testers can install PWA
- [ ] 80%+ testers report positive experience
- [ ] < 5 critical bugs reported
- [ ] 90%+ feature completion rate
- [ ] Positive feedback on usability

---

## 🚨 Risk Management

### Potential Risks:

1. **Database Migration Fails**
   - Mitigation: Thorough testing, backups, dry runs
   - Rollback: Restore from backup

2. **Cloud Database Performance Issues**
   - Mitigation: Load testing, query optimization
   - Fallback: Upgrade Supabase tier

3. **PWA Installation Problems**
   - Mitigation: Test on real devices, multiple browsers
   - Fallback: Use as web app without installation

4. **Authentication Issues on Cloud**
   - Mitigation: Test auth flows thoroughly
   - Fallback: Debug using Supabase logs

5. **Testers Can't Install PWA**
   - Mitigation: Clear instructions, troubleshooting guide
   - Fallback: Provide web app access

---

## 📅 Timeline Summary

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| 1. Regression Testing | 2-3 days | None |
| 2. Database Migration | 1-2 days | Phase 1 complete |
| 3. PWA Configuration | 3-5 hours | Phase 2 complete |
| 4. Deploy to Hosting | 2-3 hours | Phase 3 complete |
| 5. Test PWA | 1-2 days | Phase 4 complete |
| 6. Release to Testers | Ongoing | Phase 5 complete |

**Total Timeline:** ~1-2 weeks (excluding tester feedback period)

---

## ✅ Current Status

**Phase:** 1 - Comprehensive Regression Testing
**Status:** Not Started
**Next Action:** Begin regression testing checklist

---

## 📝 Notes

- PWA chosen over Electron due to macOS 15.5 Sequoia compatibility issues
- Database must be cloud-deployed before PWA to ensure testers have data access
- Security considerations documented in separate security guide
- Will use network-first caching strategy for dynamic content
- Supabase requests always fresh (never cached)

---

**Last Updated:** 2025-01-18
