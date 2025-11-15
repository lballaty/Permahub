# Permahub Development Guide

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/DEVELOPMENT.md

**Description:** Quick reference for local development and testing

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-07

**Last Updated:** 2025-11-07

---

## 🚀 Quick Start (3 Steps)

### 1. Environment is Ready ✅
- Dependencies installed: `npm install` ✓
- `.env` file created with Supabase credentials ✓
- Ready to run dev server

### 2. Database Setup (Manual - Go to Supabase)
See: `SUPABASE_SETUP_GUIDE.md`

Run these 3 SQL migrations in Supabase Console:
1. `/database/migrations/001_initial_schema.sql`
2. `/database/migrations/002_analytics.sql`
3. `/database/migrations/003_items_pubsub.sql`

### 3. Start Development Server
```bash
npm run dev
```

Opens: http://localhost:3000

---

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start dev server with Vite (port 3000)
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Check for linting errors
npm run lint:fix     # Fix linting errors
npm run format       # Format code with Prettier
npm run format:check # Check if code is formatted

# Testing (not yet implemented)
npm test             # Run tests (currently shows error)
```

---

## 🌍 Development Sites

### Local Development
- **Main:** http://localhost:3000/index.html
- **Auth:** http://localhost:3000/auth.html
- **Dashboard:** http://localhost:3000/dashboard.html
- **Project Detail:** http://localhost:3000/project.html
- **Map View:** http://localhost:3000/map.html
- **Resources:** http://localhost:3000/resources.html
- **Add Item:** http://localhost:3000/add-item.html
- **Legal:** http://localhost:3000/legal.html

---

## 🧪 Testing Checklist

### Manual Testing (After dev server starts)

**Authentication Flow**
- [ ] Landing page loads
- [ ] Click "Get Started" → goes to /auth.html
- [ ] See splash screen (3 seconds)
- [ ] See login/register tabs
- [ ] Test magic link email send
- [ ] Test email/password registration
- [ ] Test email/password login
- [ ] Check user appears in Supabase
- [ ] Session persists on page reload
- [ ] Logout works

**Project Discovery**
- [ ] /dashboard.html loads
- [ ] Projects display in list
- [ ] Filter by type works
- [ ] Filter by location works
- [ ] Search functionality works
- [ ] Click project → shows details

**Map View**
- [ ] /map.html loads
- [ ] Leaflet.js map displays
- [ ] Project markers appear on map
- [ ] Click marker → shows info
- [ ] Radius filter (5-500km) works

**Marketplace**
- [ ] /resources.html loads
- [ ] Resources display in list
- [ ] Filter by category works
- [ ] Filter by price works
- [ ] Search functionality works

**Add Item**
- [ ] /add-item.html loads
- [ ] Form validation works
- [ ] Can create project
- [ ] Can create resource
- [ ] Items appear in database

**Legal Pages**
- [ ] /legal.html loads
- [ ] Privacy Policy displays
- [ ] Terms of Service displays
- [ ] Cookie Policy displays
- [ ] Tabs work correctly
- [ ] Print functionality works

**Multi-language**
- [ ] Language switcher visible
- [ ] Can change to Portuguese
- [ ] Can change to Spanish
- [ ] Can change back to English
- [ ] Language persists on reload
- [ ] All text translates

---

## 🔍 Browser DevTools

### Checking for Errors

1. **Open DevTools:** Press `F12`
2. **Console Tab:** Look for red errors
3. **Network Tab:** Look for failed requests
4. **Application Tab:** Check localStorage/IndexedDB

### Common Issues

**Errors in Console:**
- Check `.env` file is correct
- Check Supabase tables are created
- Check RLS policies are enabled
- Check browser network tab for 403/404

**Network Errors:**
- 403 Forbidden: Check RLS policies
- 404 Not Found: Check Supabase URL is correct
- No response: Check Supabase project is active

---

## 📁 File Organization

### HTML Pages
All located in `/src/pages/`:
- `index.html` - Landing page (entry point)
- `auth.html` - Authentication flows
- `dashboard.html` - Project discovery
- `project.html` - Individual project view
- `map.html` - Interactive map
- `resources.html` - Marketplace
- `add-item.html` - Create projects/resources
- `legal.html` - Privacy/Terms/Cookies

### JavaScript Modules
Located in `/src/js/`:
- `config.js` - Environment configuration
- `supabase-client.js` - Supabase API wrapper
- `i18n-translations.js` - Multi-language system

### Styles
Currently embedded in HTML `<style>` tags.
**TODO:** Extract to separate CSS files in `/src/css/`

### Database
Located in `/database/migrations/`:
- `001_initial_schema.sql` - Core tables (8 tables)
- `002_analytics.sql` - Analytics & personalization
- `003_items_pubsub.sql` - Notifications & pub/sub

---

## 🔑 Environment Variables

Located in `.env` (DO NOT COMMIT):

```env
VITE_SUPABASE_URL=https://mcbxbaggjaxqfdvmrqsc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

**Never commit `.env` to Git** - already in `.gitignore`

---

## 🗄️ Database Tables

### Core Tables
- `users` - User profiles (22 columns)
- `projects` - Permaculture projects (21 columns)
- `resources` - Marketplace items (20 columns)
- `resource_categories` - Item categories (7 columns)
- `project_user_connections` - Users in projects
- `favorites` - User bookmarks
- `tags` - Predefined tags (21 default tags)

### Notification System
- `items` - Unified flexible items
- `notifications` - User notifications
- `notification_preferences` - User settings
- `item_followers` - Users following items
- `publication_subscriptions` - Follower tracking

### Analytics
- `user_activity` - Activity tracking
- `user_dashboard_config` - Dashboard settings

**Total:** 14 tables with 200+ SQL lines of indexes and RLS policies

---

## 🌍 i18n (Multi-language)

### Supported Languages
- ✅ English (en) - Complete
- ✅ Portuguese (pt) - Complete
- ✅ Spanish (es) - Complete
- 🔲 French (fr) - Template ready
- 🔲 German (de) - Template ready
- 🔲 Italian (it) - Template ready
- 🔲 Dutch (nl) - Template ready
- 🔲 Polish (pl) - Template ready
- 🔲 Japanese (ja) - Template ready
- 🔲 Chinese (zh) - Template ready
- 🔲 Korean (ko) - Template ready

### How to Use in HTML
```html
<h1 data-i18n="landing.title">Default text here</h1>
<p data-i18n="landing.description">Fallback text</p>
```

### How to Use in JavaScript
```javascript
const title = i18n.t('landing.title');
console.log(title);  // Returns translated text
```

### How to Change Language
```javascript
// From HTML button click
function changeLanguage(lang) {
  i18n.setLanguage(lang);  // 'en', 'pt', 'es'
}
```

---

## 🐛 Troubleshooting

### Dev server won't start
```bash
# Check Node version (need 18+)
node --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try again
npm run dev
```

### Can't connect to Supabase
1. Verify `.env` has correct URL and keys
2. Check Supabase project status: https://supabase.com/dashboard
3. Check browser console for errors (F12)
4. Verify API keys are correct (copy-paste carefully)

### RLS errors (403 Forbidden)
1. Verify RLS policies are enabled in Supabase
2. Check you're logged in (auth.uid() should return a value)
3. Check Supabase Auth logs for errors

### Map not showing
1. Check Leaflet.js is loaded (browser console)
2. Verify latitude/longitude are valid numbers
3. Check projects in database have valid coordinates

### Translations not working
1. Check language key exists in `i18n-translations.js`
2. Verify HTML has `data-i18n="key.path"`
3. Check browser console for i18n errors
4. Verify language is set: check localStorage `language` key

---

## 📊 Project Status

### ✅ Completed
- [x] All 8 HTML pages created
- [x] JavaScript modules created
- [x] Supabase configuration
- [x] Database schema (1,416 SQL lines)
- [x] Multi-language system (200+ keys, 3 languages)
- [x] Authentication UI
- [x] Project discovery UI
- [x] Map UI
- [x] Marketplace UI
- [x] Legal pages (Privacy, Terms, Cookies)
- [x] npm dependencies configured
- [x] Vite build configuration
- [x] ESLint configuration
- [x] Prettier formatting

### ⚠️ In Progress
- [ ] Supabase database migrations (MANUAL - Go to Supabase Console)
- [ ] Dev server testing
- [ ] Frontend-backend integration testing

### ❌ Todo
- [ ] Extract CSS to separate files
- [ ] Unit tests
- [ ] E2E tests
- [ ] Upgrade to official Supabase SDK (@supabase/supabase-js)
- [ ] Edge functions for complex operations
- [ ] Production deployment
- [ ] Translation of remaining 8 languages

---

## 🚀 Next Immediate Steps

1. **Run Supabase Migrations**
   - Go to: https://supabase.com/dashboard
   - Select project: mcbxbaggjaxqfdvmrqsc
   - Go to SQL Editor
   - Copy-paste and run each migration file

2. **Start Dev Server**
   ```bash
   npm run dev
   ```

3. **Manual Testing**
   - Test auth flow
   - Test project discovery
   - Test marketplace
   - Test map
   - Test multi-language
   - Check browser console for errors

4. **Fix Issues**
   - Review console errors
   - Fix any connectivity issues
   - Test with real Supabase data

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Start dev | `npm run dev` |
| Build | `npm run build` |
| Preview build | `npm run preview` |
| Lint | `npm run lint` |
| Fix lint | `npm run lint:fix` |
| Format | `npm run format` |
| Check format | `npm run format:check` |

---

## 🌱 Remember

This is a platform for the global permaculture community. Every feature should:
- Support sustainable living
- Protect user privacy
- Be accessible globally
- Support multiple languages
- Work on mobile devices
- Follow our security standards

---

**Happy developing! 🌱**

See `.claude/claude.md` for detailed development guidelines.
