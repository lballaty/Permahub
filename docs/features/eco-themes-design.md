# Landing Page Eco-Themes Design Specification

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/LANDING_PAGE_ECO_THEMES_DESIGN.md

**Description:** Complete design specification for eco-themed landing page

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-07

---

## 🎯 LANDING PAGE VISION

**Simple. Beautiful. Eco-Focused. Inclusive.**

The landing page is the first interaction for new users. It should:
- 🌍 Immediately communicate the sustainability mission
- 🎨 Showcase eco-themes with beautiful visuals
- 👥 Make it easy to choose their sustainability path
- 📱 Work perfectly on mobile devices
- 🌐 Be fully translated (no hardcoded text)

---

## 🎨 DESIGN SECTIONS

### Section 1: Hero with Theme Selection

**Purpose:** Let users immediately choose their eco-theme

```html
<section class="hero-theme-selector">
  <div class="hero-content">
    <h1 data-i18n="landing.hero.title">
      <!-- "Sustainable Solutions for a Better Earth" -->
    </h1>

    <p data-i18n="landing.hero.subtitle">
      <!-- "Connect with practitioners in your field" -->
    </p>

    <p data-i18n="landing.hero.instruction">
      <!-- "Choose your sustainability focus:" -->
    </p>
  </div>

  <div class="theme-grid">
    <!-- 8 Interactive Theme Cards (see below) -->
  </div>
</section>
```

**Styling:**
- Full viewport height (100vh)
- Gradient background (light green to light blue)
- Centered text with clear hierarchy
- Responsive grid (4 columns desktop, 2 columns tablet, 1 column mobile)

---

### Section 2: Theme Cards Grid

**8 Interactive Cards** - Each with:
- Emoji icon (large, 3rem)
- Theme name (data-i18n)
- Brief description (data-i18n)
- Color-coded design
- Hover effects
- Click to explore

```html
<div class="theme-card" data-theme="permaculture" style="--theme-color: #2d8659">
  <div class="theme-icon">🌱</div>
  <h3 data-i18n="themes.permaculture.name">Permaculture</h3>
  <p data-i18n="themes.permaculture.description">
    <!-- Permanent agriculture design -->
  </p>
  <button data-i18n="landing.btn.explore">Explore</button>
</div>

<!-- Repeat for: Agroforestry, Sustainable Fishing, Sustainable Farming,
     Natural Farming, Circular Economy, Sustainable Energy, Water Management -->
```

**Theme Cards CSS:**
```css
.theme-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 5px solid var(--theme-color);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.theme-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  border-left-width: 8px;
}

.theme-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.theme-card h3 {
  color: var(--theme-color);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.theme-card p {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.theme-card button {
  background: linear-gradient(135deg, var(--theme-color),
              color-darken(var(--theme-color), 20%));
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.theme-card button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(45, 134, 89, 0.3);
}
```

---

### Section 3: Dynamic Content by Theme

**After selecting a theme, show:**

```html
<section class="theme-content" id="themeContent" style="display: none;">
  <!-- Hero Image specific to theme -->
  <div class="theme-hero-image">
    <img id="themeImage" src="" alt="">
  </div>

  <!-- Theme Statistics -->
  <div class="theme-stats">
    <div class="stat">
      <h3 id="projectCount">0</h3>
      <p data-i18n="landing.stats.active_projects">Active Projects</p>
    </div>
    <div class="stat">
      <h3 id="resourceCount">0</h3>
      <p data-i18n="landing.stats.resources">Resources Available</p>
    </div>
    <div class="stat">
      <h3 id="memberCount">0</h3>
      <p data-i18n="landing.stats.members">Community Members</p>
    </div>
  </div>

  <!-- Featured Projects -->
  <div class="featured-section">
    <h2 data-i18n="landing.sections.featured_projects">Featured Projects</h2>
    <div class="project-cards" id="featuredProjects">
      <!-- Dynamically loaded -->
    </div>
  </div>

  <!-- Learning Resources -->
  <div class="learning-section">
    <h2 data-i18n="landing.sections.learn">Learn About This Theme</h2>
    <div class="resource-cards" id="learningResources">
      <!-- Dynamically loaded -->
    </div>
  </div>

  <!-- Call-to-Action -->
  <div class="cta-buttons">
    <button class="btn-primary" onclick="goToDashboard()">
      <span data-i18n="landing.btn.explore_all">Explore All</span>
    </button>
    <button class="btn-secondary" onclick="goToAuth()">
      <span data-i18n="landing.btn.get_started">Get Started</span>
    </button>
  </div>
</section>
```

---

### Section 4: Featured Content

**Show most popular and newest content for selected theme:**

```html
<div class="featured-projects">
  <div class="project-card">
    <img src="project-image.jpg" alt="">
    <h4>Project Name</h4>
    <p class="location">📍 Location</p>
    <p class="description">Brief description...</p>
    <div class="project-meta">
      <span class="members">👥 12 members</span>
      <span class="status">🟢 Active</span>
    </div>
  </div>
  <!-- Repeat for other projects -->
</div>
```

---

### Section 5: Social Proof

**Show community impact:**

```html
<section class="social-proof">
  <h2 data-i18n="landing.sections.community">Join a Growing Community</h2>

  <div class="impact-stats">
    <div class="impact-card">
      <h3>2,847</h3>
      <p data-i18n="landing.impact.global_projects">Projects Worldwide</p>
    </div>
    <div class="impact-card">
      <h3>45,632</h3>
      <p data-i18n="landing.impact.community_members">Community Members</p>
    </div>
    <div class="impact-card">
      <h3>89</h3>
      <p data-i18n="landing.impact.countries">Countries Connected</p>
    </div>
  </div>

  <!-- Community testimonials or recent activity -->
</section>
```

---

### Section 6: Call-to-Action Section

**Clear next steps:**

```html
<section class="cta-final">
  <h2 data-i18n="landing.cta.title">Ready to Join?</h2>

  <div class="cta-actions">
    <button class="btn-primary-large" onclick="goToAuth()">
      <span data-i18n="landing.btn.sign_up_free">Sign Up Free</span>
    </button>

    <button class="btn-secondary-large" onclick="scrollToThemes()">
      <span data-i18n="landing.btn.explore_more">Explore More Themes</span>
    </button>
  </div>

  <p data-i18n="landing.cta.description">
    <!-- "No credit card required. Join now and connect with your community." -->
  </p>
</section>
```

---

## 📱 RESPONSIVE DESIGN

### Desktop (1200px+)
- 4-column theme grid
- Full hero image
- Sidebar with theme info
- All features visible

### Tablet (768px - 1199px)
- 2-column theme grid
- Reduced padding
- Stacked sections
- Touch-friendly buttons

### Mobile (< 768px)
- 1-column theme grid
- Full-width cards
- Vertically stacked content
- Larger touch targets (44px min)
- Optimized images

---

## 🎨 COLOR SCHEME

### Base Colors (Permaculture theme default)
```css
:root {
  --primary-green: #2d8659;      /* Primary action */
  --dark-green: #1a5f3f;         /* Darker accents */
  --light-green: #3d9970;        /* Hover states */
  --cream: #f5f5f0;              /* Background */
  --gray: #556b6f;               /* Text */
}
```

### Theme-Specific Colors (dynamic)
Each theme inherits its own color palette defined in database.

```css
/* Theme 1: Permaculture */
--theme-primary: #2d8659;
--theme-secondary: #1a5f3f;

/* Theme 2: Agroforestry */
--theme-primary: #556b2f;
--theme-secondary: #6b8e23;

/* Theme 3: Sustainable Fishing */
--theme-primary: #0077be;
--theme-secondary: #003d82;

/* ...etc for all 8 themes */
```

---

## 🌐 TRANSLATION KEYS NEEDED

All text must be in `/src/js/i18n-translations.js`:

```javascript
landing: {
  hero: {
    title: "Sustainable Solutions for a Better Earth",
    subtitle: "Connect with practitioners worldwide",
    instruction: "Choose your sustainability focus:"
  },

  themes: {
    permaculture: { name: "Permaculture", description: "..." },
    agroforestry: { name: "Agroforestry", description: "..." },
    // ... 6 more themes
  },

  buttons: {
    explore: "Explore",
    get_started: "Get Started",
    explore_all: "Explore All",
    sign_up_free: "Sign Up Free",
    explore_more: "Explore More Themes"
  },

  stats: {
    active_projects: "Active Projects",
    resources: "Resources Available",
    members: "Community Members"
  },

  sections: {
    featured_projects: "Featured Projects",
    learn: "Learn About This Theme",
    community: "Join a Growing Community"
  },

  impact: {
    global_projects: "Projects Worldwide",
    community_members: "Community Members",
    countries: "Countries Connected"
  },

  cta: {
    title: "Ready to Join?",
    description: "No credit card required. Join now and connect with your community."
  }
}
```

**For all 3 languages: English, Portuguese, Spanish**

---

## 💻 JAVASCRIPT FUNCTIONALITY

### Theme Selection Handler
```javascript
function selectTheme(themeSlug) {
  // Store selected theme
  localStorage.setItem('selectedTheme', themeSlug);

  // Update hero section
  updateThemeContent(themeSlug);

  // Scroll to content
  document.getElementById('themeContent').style.display = 'block';
  document.getElementById('themeContent').scrollIntoView({ behavior: 'smooth' });

  // Analytics
  trackThemeSelection(themeSlug);
}

function updateThemeContent(themeSlug) {
  // Fetch theme data from database
  fetch(`/api/themes/${themeSlug}`)
    .then(response => response.json())
    .then(theme => {
      // Update colors
      applyThemeColors(theme);

      // Load statistics
      loadThemeStatistics(theme.id);

      // Load featured projects
      loadFeaturedProjects(theme.id);

      // Load learning resources
      loadLearningResources(theme.id);
    });
}

function applyThemeColors(theme) {
  document.documentElement.style.setProperty('--theme-color', theme.color_primary);
  document.documentElement.style.setProperty('--theme-color-secondary', theme.color_secondary);
}
```

### Analytics Tracking
```javascript
function trackThemeSelection(themeSlug) {
  // Log to landing_page_analytics table
  fetch('/api/analytics/landing', {
    method: 'POST',
    body: JSON.stringify({
      action_type: 'theme_selected',
      eco_theme_slug: themeSlug,
      device_type: getDeviceType()
    })
  });
}
```

---

## 🎯 USER JOURNEY

### New User Flow
1. ✅ Land on page
2. ✅ See 8 eco-themes
3. ✅ Click theme they're interested in
4. ✅ See content specific to that theme
5. ✅ Click "Explore" or "Get Started"
6. ✅ Sign up / log in
7. ✅ Redirected to filtered dashboard

### Returning User Flow
1. ✅ Land on page
2. ✅ Last theme is pre-selected (from localStorage)
3. ✅ Show their preferred theme content immediately
4. ✅ Quick access to their projects/resources

---

## 🚀 IMPLEMENTATION CHECKLIST

### Phase 1: Database (Week 1)
- [ ] Create `eco_themes` table migration
- [ ] Add theme colors and emojis
- [ ] Create `landing_page_analytics` table
- [ ] Run migrations in Supabase

### Phase 2: Frontend HTML (Week 2)
- [ ] Create new landing page structure
- [ ] Add 8 theme card HTML
- [ ] Update all text to use i18n
- [ ] Add responsive CSS grid

### Phase 3: Styling (Week 2)
- [ ] Create theme-specific color variables
- [ ] Build responsive layout
- [ ] Add hover effects
- [ ] Mobile optimization

### Phase 4: JavaScript (Week 2)
- [ ] Add theme selection handler
- [ ] Add analytics tracking
- [ ] Add dynamic content loading
- [ ] Add localStorage for theme preference

### Phase 5: Integration (Week 3)
- [ ] Connect to API for theme data
- [ ] Load statistics dynamically
- [ ] Load featured projects
- [ ] Load learning resources

### Phase 6: Testing & Polish (Week 3)
- [ ] Cross-browser testing
- [ ] Mobile testing on actual devices
- [ ] Accessibility audit (WCAG)
- [ ] Performance optimization

---

## 📊 ANALYTICS TRACKING

**Track:**
- Theme selections
- View duration per theme
- Click-through rates
- Device types
- Conversion to signup

**Purpose:**
- Understand user preferences
- Optimize theme ordering
- Identify popular themes
- Improve UX

---

## ♿ ACCESSIBILITY Requirements

- ✅ ARIA labels on all buttons
- ✅ Keyboard navigation (Tab, Enter)
- ✅ Sufficient color contrast (WCAG AA)
- ✅ Alt text on all images
- ✅ Screen reader friendly structure
- ✅ Focus indicators visible
- ✅ Mobile touch targets 44px+

---

## 🎯 SUCCESS METRICS

After launch, measure:
- **Engagement:** % of users who select a theme
- **Conversion:** % who sign up after selecting theme
- **Retention:** % who return and explore content
- **Theme distribution:** Which themes are most popular
- **Device split:** Desktop vs mobile vs tablet

---

**Status:** Design Ready for Implementation
**Next Step:** Create eco_themes migration file
**Target:** Complete by end of Week 3
