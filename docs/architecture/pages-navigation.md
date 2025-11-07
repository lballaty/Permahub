# Permaculture Network - Complete Page & Navigation Guide

**Last Updated:** January 2025

---

## 📱 Platform Architecture Overview

The Permaculture Network platform consists of multiple integrated pages that work together to provide a complete sustainable living community experience.

---

## 🗺️ Site Map & Routes

### **Authentication Flow**
```
/auth                    → Main authentication page (login/register)
├── /auth?mode=login     → Login interface
├── /auth?mode=register  → Registration interface
├── /auth?mode=reset     → Password reset
└── /auth?token=xxx      → Magic link callback
```

### **Main Application**
```
/dashboard               → Main dashboard & project discovery
├── ?filter=type        → Filter by project type
├── ?search=query       → Search projects
└── ?sort=distance      → Sort by distance

/project                 → Project detail pages
├── /project?id=xxx     → Individual project view
├── /project/new        → Create new project (future)
└── /project/edit?id=xxx → Edit project (future)

/profile                 → User profiles
├── /profile/:userId    → View user profile
├── /profile/me         → My profile (current user)
└── /profile/edit       → Edit my profile (future)

/resources              → Resource marketplace
├── /resources?type=xxx → Filter by resource type
└── /resources/new      → Add new resource (future)

/community              → Community features (future)
├── /community/members  → Find community members
├── /community/events   → Events & workshops
└── /community/forums   → Discussion forums

/legal                  → Legal documents
├── /legal/privacy      → Privacy policy
├── /legal/terms        → Terms of service
└── /legal/cookies      → Cookie policy

/settings               → User settings (future)
├── /settings/account   → Account settings
├── /settings/privacy   → Privacy settings
└── /settings/language  → Language preferences
```

---

## 📄 Pages Created (with Files)

### **Phase 1: Core Pages** ✅ Complete

| Page | File | Purpose | Status |
|------|------|---------|--------|
| Authentication | `auth-pages.html` | Login, register, password reset, profile setup | ✅ Complete |
| Dashboard | `dashboard.html` | Main project discovery & browsing | ✅ Complete |
| Project Detail | `project-detail.html` | View individual project details | ✅ Complete |
| Legal Pages | `legal-pages.html` | Privacy, Terms, Cookies viewer | ✅ Complete |

### **Phase 2: User Pages** (Ready to build)

| Page | File | Purpose | Status |
|------|------|---------|--------|
| User Profile | `user-profile.html` | View/edit user profile | 🔨 Next |
| Settings | `settings.html` | User preferences & account | 🔨 Planned |
| Resources | `resources.html` | Marketplace/directory | 🔨 Planned |

### **Phase 3: Community Pages** (Future)

| Page | File | Purpose | Status |
|------|------|---------|--------|
| Members Discovery | `members.html` | Find & connect with users | ⏳ Future |
| Events | `events.html` | Workshops & gatherings | ⏳ Future |
| Forums | `forums.html` | Discussion & knowledge sharing | ⏳ Future |

---

## 🔧 Technical Stack per Page

### **All Pages Include:**
- ✅ i18n translation system (multi-language ready)
- ✅ Supabase integration for data
- ✅ Responsive mobile-first design
- ✅ Eco-themed color palette
- ✅ Accessibility features
- ✅ Form validation
- ✅ Error handling

### **Page-Specific Technologies:**

**Dashboard (`dashboard.html`)**
- Supabase REST API for projects
- Real-time filtering & search
- Card-based layout
- Infinite scroll capability (future)

**Project Detail (`project-detail.html`)**
- Supabase query for single project
- Leaflet.js for map display
- Related projects (future)
- Comments & discussions (future)

**User Profile (`user-profile.html`)** - To be created
- Supabase user data
- Avatar/image upload (future)
- User's projects & resources
- Skills & interests display
- Connection/follow functionality (future)

---

## 📊 Data Models Mapped to Pages

### **Projects Table**
```
Used on:
- Dashboard (list all)
- Project Detail (single view)
- Profile page (user's projects)
- Search/filter
```

### **Users Table**
```
Used on:
- User Profile pages
- Community member search
- Project creator info
- Connection/collaboration features
```

### **Resources Table**
```
Used on:
- Resources marketplace
- User profile (user's resources)
- Search results
```

### **Project-User Connections**
```
Used on:
- Project detail (team members)
- User profile (collaborations)
- Community discovery
```

---

## 🔐 Authentication & Access Control

### **Public Pages** (No login required)
- `/legal/*` - All legal documents

### **Semi-Public Pages** (Login required to edit)
- `/dashboard` - View projects (no login needed, but better with)
- `/project` - View project details (no login needed)
- `/profile/:userId` - View other users (no login needed)

### **Protected Pages** (Login required)
- `/profile/me` - Own profile
- `/profile/edit` - Edit profile
- `/settings` - User settings
- `/project/new` - Create project
- `/resources/new` - Add resource

---

## 🎯 Navigation Flows

### **New User Flow**
```
1. Visit /auth
2. Create account (email + password)
3. Confirm email (magic link optional)
4. Complete profile (/auth?step=profile)
5. Redirected to /dashboard
6. Browse projects
```

### **Existing User Flow**
```
1. Visit / or /dashboard
2. Already logged in? Show dashboard
3. Not logged in? Redirect to /auth
4. Browse projects
5. Click project → /project?id=xxx
6. View details, contact creator, save/share
```

### **Profile Visit Flow**
```
1. Click user avatar/profile link
2. Goes to /profile/userId
3. View user's skills, projects, resources
4. Option to connect (future)
5. View user's contributions
```

### **Settings Flow** (Future)
```
1. Click Settings in user menu
2. /settings page
3. Choose section:
   - Account: email, password
   - Privacy: profile visibility, data sharing
   - Language: UI language
   - Notifications: email preferences
```

---

## 🔗 Internal Links & Navigation

### **From Auth Page**
```
- Logo → /dashboard (after login)
- "Create one" link → Registration form
- "Sign in" link → Login form
- "Forgot password?" → Reset form
- Privacy/Terms links → /legal/privacy, /legal/terms
```

### **From Dashboard**
```
- Logo → /dashboard (refresh)
- Search input → Filter & search projects
- Project card → /project?id=xxx
- New Project btn → /project/new
- User avatar → Profile dropdown
  - My Profile → /profile/me
  - My Projects → /dashboard?filter=my-projects
  - Settings → /settings
  - Log Out → /auth (logout & redirect)
```

### **From Project Detail**
```
- Back button → /dashboard
- Logo → /dashboard
- Creator name → /profile/creatorId
- Contact email → mailto: link
- Map → Full screen map (future)
- Save → Add to favorites
- Share → Web Share API or copy link
```

### **From Profile**
```
- Logo → /dashboard
- Back button → /dashboard or referrer
- Edit button → /profile/edit (if own profile)
- Project cards → /project?id=xxx
- Message btn → Direct message (future)
- Connect btn → Add connection (future)
```

---

## 📲 Mobile Navigation Patterns

### **Header Navigation**
```
Desktop:
Logo | Search Bar | Action Buttons | User Avatar

Mobile:
Logo | Search Icon | User Avatar (with hamburger menu)
```

### **Menu Items (Mobile)**
```
When user clicks menu:
- Home → /dashboard
- My Profile → /profile/me
- My Projects → /dashboard?filter=my
- Resources → /resources
- Settings → /settings
- Language → Language selector
- Logout → /auth
```

### **Card Layout**
```
Desktop: 3-4 columns with details
Mobile: 1 column, simplified view
Tablet: 2 columns
```

---

## 🌐 URL Parameters Reference

### **Dashboard Parameters**
```
?type=permaculture   → Filter by project type
?search=composting   → Search projects
?sort=distance       → Sort by distance
?region=Funchal      → Filter by region
?limit=20            → Items per page
?page=2              → Pagination
```

### **Project Parameters**
```
?id=project-uuid     → Show specific project
?map=fullscreen      → Open map fullscreen
?tab=techniques      → Open specific tab
```

### **Profile Parameters**
```
/:userId             → View specific user
/me                  → View own profile
?tab=projects        → Show projects tab
?tab=resources       → Show resources tab
```

### **Resource Parameters**
```
?type=seeds          → Filter by type
?search=tomato       → Search resources
?available=true      → Only available items
```

---

## 🔄 Data Flow Between Pages

### **Authentication → Dashboard**
```
1. User signs up/logs in on /auth
2. Supabase creates user & auth token
3. Token stored in localStorage
4. User redirected to /dashboard
5. Dashboard checks localStorage for token
6. If valid, loads projects
```

### **Dashboard → Project Detail**
```
1. User clicks project card on /dashboard
2. projectId passed in URL: /project?id=xxx
3. project-detail.html queries Supabase
4. Fetches full project data
5. Renders all project information
```

### **Dashboard → Profile**
```
1. User clicks project creator name
2. Navigates to /profile/creatorId
3. Profile page fetches user data
4. Shows user's profile & projects
5. Links back to /dashboard
```

---

## 🔍 Search & Filter Implementation

### **Dashboard Search**
```
Input: Any search term
Returns: Projects matching name/description/tags
Real-time: Updates as user types
```

### **Filter Tabs**
```
Tabs: All | Permaculture | Agroforestry | Resources
Action: Filter projects by type
```

### **Distance Filter**
```
Options: 5km, 10km, 25km, 50km, 100km
Requires: User location (from profile)
Uses: Haversine formula for distance calc
```

### **Type Filter**
```
Options: All Types, Permaculture, Agroforestry, Aquaponics, etc.
Action: Filters project_type field
```

---

## 📊 Page Analytics Tracking Points

Each page should track:

```javascript
// Page Views
- pageview: /dashboard
- pageview: /project
- pageview: /profile

// User Actions
- click: project_card
- click: favorite_project
- click: share_project
- submit: search_query
- change: filter_type

// Engagement
- scroll: dashboard (50%, 75%, 100%)
- time_on_page: project_detail
- share_method: web_share, copy_link, email
```

---

## 🛠️ Page Development Checklist

### **For Each New Page**

- [ ] Create HTML file with proper structure
- [ ] Include i18n translations for all text
- [ ] Add Supabase integration (if needed)
- [ ] Implement responsive design
- [ ] Add error handling
- [ ] Include loading states
- [ ] Validate all forms
- [ ] Test on mobile
- [ ] Add accessibility features (aria labels, etc.)
- [ ] Implement error boundaries
- [ ] Add analytics tracking

---

## 🌍 Language & Localization

### **Pages with i18n Implemented**
- ✅ `/auth` - All auth pages
- ✅ `/legal` - Legal documents
- ✅ `/dashboard` - Dashboard
- ✅ `/project` - Project detail (partial)

### **Pages Needing i18n** (Future pages)
- [ ] `/profile` - User profile
- [ ] `/settings` - Settings
- [ ] `/resources` - Resource marketplace
- [ ] `/community/*` - Community pages

---

## 🚀 Deployment Structure

### **Production URLs**
```
https://permaculturenetwork.org/
├── /auth
├── /dashboard
├── /project
├── /profile
├── /resources
├── /community
└── /legal
```

### **Development URLs**
```
http://localhost:3000/
└── (same routes as above)
```

### **Static Files**
```
/js/
├── i18n-translations.js
├── supabase-client.js
└── (page-specific scripts)

/css/
├── global-styles.css
├── variables.css
└── (page-specific styles)

/images/
├── logos/
├── icons/
└── placeholder-images/
```

---

## 📞 Support & Help

### **Help Documentation Pages** (Future)
```
/help/
├── /help/getting-started
├── /help/how-to-create-project
├── /help/faq
└── /help/contact
```

### **Error Pages** (Future)
```
/404 - Page not found
/500 - Server error
/offline - Offline mode
```

---

## 🔄 Next Pages to Build

### **Immediate** (Next sprint)
1. **User Profile Page** (`user-profile.html`)
   - Display user information
   - Show user's projects & resources
   - Skills, interests, connections
   
2. **Settings Page** (`settings.html`)
   - Account settings
   - Privacy controls
   - Language selection
   - Notification preferences

### **Short-term** (Following sprints)
3. **Resource Marketplace** (`resources.html`)
4. **Create Project** (`project-create.html`)
5. **Member Discovery** (`members.html`)

### **Long-term** (Future)
6. Community forums
7. Events & workshops
8. Direct messaging
9. Notifications
10. Advanced search

---

## 📝 Summary

**Current Status:**
- ✅ 4 pages complete and functional
- ✅ Multi-language support ready
- ✅ Authentication system working
- ✅ Database integration active
- 🔨 8+ pages planned for development

**Technology Stack:**
- Frontend: HTML5, CSS3, Vanilla JavaScript
- Backend: Supabase (PostgreSQL)
- Maps: Leaflet.js
- i18n: Custom translation system
- Auth: Supabase Auth (magic links + password)

**Key Features Implemented:**
- User authentication (magic links + passwords)
- Project discovery & browsing
- Project detail views with maps
- Multi-language interface
- Responsive mobile design
- Privacy-first data handling

**Next Milestone:**
Complete user profile and settings pages to enable full user management!

