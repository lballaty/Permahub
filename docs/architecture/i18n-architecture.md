# Internationalization (i18n) Architecture

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/architecture/i18n-architecture.md

**Description:** Complete documentation of Permahub's dual i18n translation system architecture

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-17

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Design Rationale](#design-rationale)
3. [File Structure](#file-structure)
4. [Usage Guidelines](#usage-guidelines)
5. [Translation Key Namespaces](#translation-key-namespaces)
6. [Adding New Translations](#adding-new-translations)
7. [Language Coverage](#language-coverage)
8. [Technical Details](#technical-details)
9. [Migration History](#migration-history)
10. [Best Practices](#best-practices)

---

## 1. System Overview

Permahub uses **TWO SEPARATE i18n SYSTEMS** that serve different purposes:

### System A: Main Platform i18n
- **File:** `src/js/i18n-translations.js`
- **Size:** 35KB, 833 lines
- **Global Object:** `i18n`
- **Languages:** 4 (en, pt, es, cs)
- **Keys:** ~200 translation keys
- **Purpose:** Core platform features (authentication, legal pages, main site UI)

### System B: Wiki-Specific i18n
- **File:** `src/wiki/js/wiki-i18n.js`
- **Size:** 303KB, 5,265 lines
- **Global Object:** `wikiI18n`
- **Languages:** 15 (en, pt, es, fr, de, it, nl, pl, ja, zh, ko, cs, sk, uk, ru)
- **Keys:** ~779 translation keys per language (total: 11,685 keys)
- **Purpose:** Community wiki (guides, events, locations, categories, themes)

###

 Why Two Systems?

This is **INTENTIONAL ARCHITECTURE**, not duplication:

1. **Separation of Concerns** - Platform vs. Wiki content
2. **Different Language Requirements** - Wiki needs more languages for global community
3. **Different Update Frequency** - Wiki translations change more often
4. **Performance** - Smaller main platform bundle size
5. **Team Ownership** - Different teams can manage different systems

---

## 2. Design Rationale

### Historical Context

**Before Database-Driven Themes (2025-11-16):**
- Themes were hardcoded in JavaScript files
- 15 theme groups defined as arrays in `wiki-home.js` and `wiki-guides.js`
- No proper translation support
- Difficult to add/modify themes

**After Database-Driven Themes (2025-11-17):**
- Themes stored in `wiki_theme_groups` database table
- Categories linked via `theme_id` foreign key
- Translation keys in `wiki-i18n.js` using slug-based pattern
- Admin-configurable without code changes

### Why Database-Driven?

1. **Scalability** - Easy to add new themes
2. **Maintainability** - No code changes for content updates
3. **i18n Support** - Proper translation infrastructure
4. **Admin Control** - Non-technical users can manage themes
5. **Consistency** - Single source of truth in database

---

## 3. File Structure

### Main Platform i18n

**File:** `src/js/i18n-translations.js`

```
/Permahub
└── src/
    └── js/
        └── i18n-translations.js (35KB)
            ├── English (en)
            ├── Portuguese (pt)
            ├── Spanish (es)
            └── Czech (cs)
```

**Used By:**
- `src/pages/index.html` (landing page)
- `src/pages/dashboard.html`
- `src/pages/project.html`
- `src/pages/resources.html`
- `src/pages/map.html`
- `src/pages/add-item.html`

**Loaded Via:**
```html
<script src="/src/js/i18n-translations.js"></script>
```

### Wiki i18n

**File:** `src/wiki/js/wiki-i18n.js`

```
/Permahub
└── src/
    └── wiki/
        └── js/
            └── wiki-i18n.js (303KB)
                ├── English (en)
                ├── Portuguese (pt)
                ├── Spanish (es)
                ├── French (fr)
                ├── German (de)
                ├── Italian (it)
                ├── Dutch (nl)
                ├── Polish (pl)
                ├── Japanese (ja)
                ├── Chinese (zh)
                ├── Korean (ko)
                ├── Czech (cs)
                ├── Slovak (sk)
                ├── Ukrainian (uk)
                └── Russian (ru)
```

**Used By (16 HTML files):**
- `src/wiki/wiki-home.html`
- `src/wiki/wiki-guides.html`
- `src/wiki/wiki-events.html`
- `src/wiki/wiki-page.html`
- `src/wiki/wiki-editor.html`
- `src/wiki/wiki-settings.html`
- `src/wiki/wiki-login.html`
- `src/wiki/wiki-signup.html`
- `src/wiki/wiki-favorites.html`
- `src/wiki/wiki-my-content.html`
- `src/wiki/wiki-map.html`
- `src/wiki/wiki-about.html`
- `src/wiki/wiki-terms.html`
- `src/wiki/wiki-privacy.html`
- `src/wiki/wiki-forgot-password.html`
- `src/wiki/wiki-reset-password.html`

**Loaded Via:**
```html
<script src="/src/wiki/js/wiki-i18n.js"></script>
```

---

## 4. Usage Guidelines

### When to Use Main Platform i18n (`i18n`)

Use `i18n` for:
- Authentication flows (login, register, password reset)
- Legal pages (privacy policy, terms of service, cookies)
- Main platform UI elements
- General alerts and validation messages
- User profile management
- Platform-wide buttons and labels

**Example:**
```javascript
// In main platform pages
const loginButton = i18n.t('btn.login');
const errorMsg = i18n.t('validation.email_invalid');
```

### When to Use Wiki i18n (`wikiI18n`)

Use `wikiI18n` for:
- Wiki guides and articles
- Events and locations
- Categories and themes
- Wiki navigation
- Wiki editor interface
- Wiki-specific settings
- Community features

**Example:**
```javascript
// In wiki pages
const themeName = wikiI18n.t('wiki.themes.animal-husbandry-livestock');
const categoryName = wikiI18n.t('wiki.categories.composting');
const timeAgo = wikiI18n.t('wiki.time.days_ago');
```

---

## 5. Translation Key Namespaces

### Main Platform i18n Namespaces

```
i18n.translations = {
  en: {
    'splash.*'         // Splash screen
    'auth.*'           // Authentication (login, register, reset, profile)
    'alert.*'          // Alert messages
    'validation.*'     // Form validation
    'btn.*'            // Button labels
    'legal.*'          // Legal documents
    'lang.*'           // Language selector
    'common.*'         // Reusable terms
    'a11y.*'           // Accessibility
  }
}
```

### Wiki i18n Namespaces

```
wikiI18n.translations = {
  en: {
    'wiki.nav.*'           // Navigation elements
    'wiki.home.*'          // Home page
    'wiki.article.*'       // Article/guide pages
    'wiki.page.*'          // Page-specific content
    'wiki.editor.*'        // Editor interface
    'wiki.events.*'        // Events page
    'wiki.locations.*'     // Locations/map page
    'wiki.guides.*'        // Guides listing page
    'wiki.themes.*'        // Theme names (15 themes)
    'wiki.categories.*'    // Category names (60+ categories)
    'wiki.settings.*'      // Settings page
    'wiki.time.*'          // Time-related strings
    'wiki.common.*'        // Common wiki terms
    'wiki.footer.*'        // Footer elements
  }
}
```

### Theme Translation Keys (15 Total)

All theme translation keys follow the pattern: `wiki.themes.{slug}`

```javascript
'wiki.themes.animal-husbandry-livestock'  // Sort order 1
'wiki.themes.food-preservation-storage'   // Sort order 2
'wiki.themes.water-management-systems'    // Sort order 3
'wiki.themes.soil-building-fertility'     // Sort order 4
'wiki.themes.agroforestry-trees'          // Sort order 5
'wiki.themes.garden-design-planning'      // Sort order 6
'wiki.themes.natural-building'            // Sort order 7
'wiki.themes.renewable-energy'            // Sort order 8
'wiki.themes.seed-saving-propagation'     // Sort order 9
'wiki.themes.forest-gardening'            // Sort order 10
'wiki.themes.ecosystem-management'        // Sort order 11
'wiki.themes.soil-regeneration'           // Sort order 12
'wiki.themes.community-education'         // Sort order 13
'wiki.themes.waste-resource-cycling'      // Sort order 14
'wiki.themes.specialized-techniques'      // Sort order 15
```

**Database Mapping:**
- Theme slug in database: `animal-husbandry-livestock`
- Translation key: `wiki.themes.animal-husbandry-livestock`
- JavaScript code: `wikiI18n.t('wiki.themes.animal-husbandry-livestock')`
- Fallback: Database `name` column if translation missing

---

## 6. Adding New Translations

### Adding to Main Platform i18n

**File to edit:** `src/js/i18n-translations.js`

**Steps:**
1. Find the appropriate namespace section
2. Add key in all 4 languages (en, pt, es, cs)
3. Follow existing naming conventions
4. Test in browser

**Example:**
```javascript
// Add to each language block
'btn.new_action': 'New Action',           // English
'btn.new_action': 'Nova Ação',            // Portuguese
'btn.new_action': 'Nueva Acción',         // Spanish
'btn.new_action': 'Nová Akce',            // Czech
```

### Adding to Wiki i18n

**File to edit:** `src/wiki/js/wiki-i18n.js`

**Steps:**
1. Find the appropriate namespace section (e.g., "// Themes", "// Categories")
2. Add key in ALL 15 languages
3. Use appropriate translations for each language
4. Maintain alphabetical or logical order within sections
5. Test language switching

**Example - Adding a New Theme:**
```javascript
// English (en)
'wiki.themes.new-theme-slug': 'New Theme Name',

// Portuguese (pt)
'wiki.themes.new-theme-slug': 'Novo Nome do Tema',

// Spanish (es)
'wiki.themes.new-theme-slug': 'Nuevo Nombre del Tema',

// ... continue for all 15 languages
```

**IMPORTANT:** If adding a new theme:
1. First add the theme to the database (`wiki_theme_groups` table)
2. Then add translation keys for all 15 languages
3. The `slug` column in database must match the suffix in the translation key
4. Example: Database slug `new-theme` → Translation key `wiki.themes.new-theme`

---

## 7. Language Coverage

### Comparison Table

| Language | Main Platform | Wiki | Native Name | ISO Code |
|----------|---------------|------|-------------|----------|
| English | ✅ | ✅ | English | en |
| Portuguese | ✅ | ✅ | Português | pt |
| Spanish | ✅ | ✅ | Español | es |
| Czech | ✅ | ✅ | Čeština | cs |
| French | ❌ | ✅ | Français | fr |
| German | ❌ | ✅ | Deutsch | de |
| Italian | ❌ | ✅ | Italiano | it |
| Dutch | ❌ | ✅ | Nederlands | nl |
| Polish | ❌ | ✅ | Polski | pl |
| Japanese | ❌ | ✅ | 日本語 | ja |
| Chinese | ❌ | ✅ | 中文 | zh |
| Korean | ❌ | ✅ | 한국어 | ko |
| Slovak | ❌ | ✅ | Slovenčina | sk |
| Ukrainian | ❌ | ✅ | Українська | uk |
| Russian | ❌ | ✅ | Русский | ru |

**Total Languages:**
- Main Platform: **4 languages**
- Wiki System: **15 languages**

### Why Different Coverage?

**Main Platform (4 languages):**
- Focus on markets where Permahub has active development
- Easier to maintain smaller set for core features
- Can expand as needed

**Wiki System (15 languages):**
- Global permaculture community needs broad language support
- Community-contributed content benefits from wide reach
- Educational content should be accessible worldwide
- Volunteer translators can help maintain

---

## 8. Technical Details

### Global Objects

**Main Platform:**
```javascript
window.i18n = {
  currentLanguage: 'en',
  translations: { /* ... */ },
  t: function(key) { /* ... */ },
  setLanguage: function(lang) { /* ... */ }
}
```

**Wiki:**
```javascript
window.wikiI18n = {
  currentLanguage: 'en',
  debugMode: true,
  translations: { /* ... */ },
  t: function(key) { /* ... */ },
  setLanguage: function(lang) { /* ... */ },
  updatePageText: function() { /* ... */ }
}
```

### Storage Keys

**Main Platform:**
```javascript
localStorage.setItem('permaculture_language', 'en');
```

**Wiki:**
```javascript
localStorage.setItem('wiki_language', 'en');
```

**Why Different Keys?**
- Allows independent language selection
- User might want platform in one language, wiki in another
- Prevents conflicts between systems

### Method Calls

**Translating a key:**
```javascript
// Main platform
const text = i18n.t('btn.login');

// Wiki
const text = wikiI18n.t('wiki.home.welcome');
```

**Setting language:**
```javascript
// Main platform
i18n.setLanguage('pt');

// Wiki
wikiI18n.setLanguage('es');
wikiI18n.updatePageText(); // Re-translate all elements with data-i18n attribute
```

### Debug Mode

Wiki i18n has debug mode for development:

```javascript
// In wiki-i18n.js
debugMode: true

// When enabled, logs:
// - Missing translation keys
// - Fallback usage
// - Language switching events
```

### Fallback Behavior

Both systems use English as fallback:

```javascript
t: function(key) {
  const translation = this.translations[this.currentLanguage]?.[key];
  if (!translation) {
    console.warn(`Missing translation for key: ${key} in language: ${this.currentLanguage}`);
    return this.translations['en']?.[key] || key; // Fallback to English or key itself
  }
  return translation;
}
```

**For theme translations:**
```javascript
// JavaScript code in wiki-guides.js
const translatedName = wikiI18n.t(`wiki.themes.${theme.slug}`) || theme.name;
```
- First tries: Translation from wiki-i18n.js
- If missing: Falls back to English
- If still missing: Uses database `name` column

---

## 9. Migration History

### Phase 1: Hardcoded Themes (Pre-2025-11-17)

**Implementation:**
```javascript
// In wiki-home.js and wiki-guides.js
const themeDefinitions = [
  { name: 'Animal Husbandry & Livestock', icon: '🐓', slugs: ['animal-husbandry', 'beekeeping'] },
  // ... 14 more hardcoded themes
];
```

**Problems:**
- No translation support
- Hardcoded English names
- Difficult to maintain
- Can't add themes without code changes

### Phase 2: Database-Driven Themes (2025-11-17)

**Database Migration:**
```sql
-- Created tables
CREATE TABLE wiki_theme_groups (
  id UUID PRIMARY KEY,
  name TEXT,
  slug TEXT UNIQUE,
  icon TEXT,
  description TEXT,
  sort_order INTEGER,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

ALTER TABLE wiki_categories
ADD COLUMN theme_id UUID REFERENCES wiki_theme_groups(id);
```

**JavaScript Update:**
```javascript
// Load themes from database
const allThemes = await supabase.getAll('wiki_theme_groups', {
  where: 'is_active',
  operator: 'eq',
  value: true,
  order: 'sort_order.asc'
});

// Group categories by theme using database relationship
const groups = allThemes.map(theme => ({
  id: theme.id,
  name: theme.name,
  slug: theme.slug,
  icon: theme.icon,
  categories: allCategories.filter(cat => cat.theme_id === theme.id)
}));
```

**i18n Integration:**
```javascript
// Translate theme name using slug-based key
const translatedName = wikiI18n.t(`wiki.themes.${theme.slug}`) || theme.name;
```

**Benefits:**
- ✅ Proper translation support (15 languages)
- ✅ Admin-configurable themes
- ✅ Scalable architecture
- ✅ Consistent with database model

---

## 10. Best Practices

### DO:

✅ **Use the correct system**
- Use `i18n` for platform features
- Use `wikiI18n` for wiki content

✅ **Add translations to ALL languages**
- Don't leave languages incomplete
- Use translation services if needed
- Ask native speakers to review

✅ **Follow naming conventions**
- Use descriptive key names
- Group related keys with dot notation
- Use lowercase with hyphens for slugs

✅ **Test language switching**
- Test all languages after adding keys
- Verify fallback behavior works
- Check dynamic content updates

✅ **Use slug-based patterns for database content**
- Pattern: `wiki.themes.{database-slug}`
- Pattern: `wiki.categories.{database-slug}`
- Keeps translation keys in sync with data

✅ **Provide fallbacks**
- Always provide English translation
- Use database values as last resort
- Log missing keys in debug mode

### DON'T:

❌ **Don't duplicate keys across systems**
- Each key should be in only one system
- Exception: truly shared content (rare)

❌ **Don't hardcode text in JavaScript**
- Always use translation keys
- Even for English-only deployments

❌ **Don't forget to update PageText on language change**
```javascript
// After changing language in wiki
wikiI18n.setLanguage('pt');
wikiI18n.updatePageText(); // ← Don't forget this!
```

❌ **Don't use complex nesting**
- Keep key structure flat where possible
- Maximum 3 levels: `wiki.themes.animal-husbandry-livestock`

❌ **Don't store translated content in database**
- Store only language-neutral data
- Use i18n keys for all user-facing text

---

## Related Documentation

- [Database-Driven Themes Implementation Plan](../plans/database-driven-themes-plan.md)
- [i18n Implementation Guide](../guides/i18n-implementation.md)
- [i18n Reference Guide](../guides/i18n-reference.md)
- [i18n Quick Reference](../i18n-quick-reference.md)

---

**Last Updated:** 2025-11-17

**Status:** Complete and Active
