# Internationalization (i18n) Architecture

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/i18n-architecture.md

**Description:** Documentation of the dual i18n system architecture, accidental creation, and consolidation strategy

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-01-19

**Last Updated:** 2025-01-19

---

## 📋 Executive Summary

Permahub currently has **two separate i18n (internationalization) systems** that were created accidentally:

1. **Main Platform i18n** ([src/js/i18n-translations.js](../src/js/i18n-translations.js)) - Only English, uncertain future
2. **Wiki Platform i18n** ([src/wiki/js/wiki-i18n.js](../src/wiki/js/wiki-i18n.js)) - Production system with 4,500+ translations

**Current Status:** Keeping both systems temporarily until main platform's future is determined.

---

## 🎯 The Accidental Architecture

### How This Happened

During early development, the original Permahub platform was built with a comprehensive i18n system (`i18n-translations.js`). When the wiki feature was added later, an AI agent created a separate i18n system (`wiki-i18n.js`) without recognizing that an i18n infrastructure already existed.

**Key Timeline:**
- **Early 2024:** Main platform created with `i18n-translations.js`
- **Mid 2024:** Wiki added, `wiki-i18n.js` created as "duplicate"
- **Late 2024 - Jan 2025:** Extensive wiki translation work (PT/ES/CS/DE at 100% coverage)
- **Jan 2025:** Discovery of accidental duplication

### Why It Persisted

The wiki i18n system became the de facto production system because:
1. Significant investment in translations (4,500+ keys across 5 languages)
2. Main platform's future became uncertain
3. Wiki pages became primary user-facing interface
4. No technical issues from having two systems

---

## 📊 System Comparison

| Aspect | Main Platform i18n | Wiki Platform i18n |
|--------|-------------------|-------------------|
| **File** | `src/js/i18n-translations.js` | `src/wiki/js/wiki-i18n.js` |
| **Size** | 833 lines, 36KB | 5,696 lines, 332KB |
| **Languages Declared** | 12 | 11 |
| **Languages Translated** | 1 (EN only) | 5 (EN/PT/ES/CS/DE) |
| **Total Keys** | ~140 (EN only) | 782 (EN baseline) + 122 extras |
| **Total Translations** | ~140 | ~4,500 |
| **Translation Coverage** | 0% (no multi-lang) | 100% for 4 languages |
| **Pages Using** | 6 pages | 17+ pages |
| **Status** | Experimental/Uncertain | Production |
| **Key Prefix** | None (e.g., `auth.login`) | `wiki.*` (e.g., `wiki.nav.home`) |

### Main Platform Pages (6)
- [src/pages/index.html](../src/pages/index.html) - Landing page
- [src/pages/dashboard.html](../src/pages/dashboard.html) - Project discovery
- [src/pages/map.html](../src/pages/map.html) - Interactive map
- [src/pages/project.html](../src/pages/project.html) - Project details
- [src/pages/resources.html](../src/pages/resources.html) - Marketplace
- [src/pages/add-item.html](../src/pages/add-item.html) - Create projects/resources

### Wiki Platform Pages (17+)
- [src/wiki/wiki-home.html](../src/wiki/wiki-home.html) - Wiki homepage
- [src/wiki/wiki-guides.html](../src/wiki/wiki-guides.html) - Guide listings
- [src/wiki/wiki-page.html](../src/wiki/wiki-page.html) - Content display
- [src/wiki/wiki-editor.html](../src/wiki/wiki-editor.html) - Content creation/editing
- [src/wiki/wiki-events.html](../src/wiki/wiki-events.html) - Event calendar
- [src/wiki/wiki-map.html](../src/wiki/wiki-map.html) - Location map
- [src/wiki/wiki-favorites.html](../src/wiki/wiki-favorites.html) - User bookmarks
- [src/wiki/wiki-settings.html](../src/wiki/wiki-settings.html) - User preferences
- [src/wiki/wiki-login.html](../src/wiki/wiki-login.html) - Authentication
- [src/wiki/wiki-signup.html](../src/wiki/wiki-signup.html) - Registration
- [src/wiki/wiki-forgot-password.html](../src/wiki/wiki-forgot-password.html) - Password recovery
- [src/wiki/wiki-reset-password.html](../src/wiki/wiki-reset-password.html) - Password reset
- [src/wiki/wiki-my-content.html](../src/wiki/wiki-my-content.html) - User's content
- [src/wiki/wiki-deleted-content.html](../src/wiki/wiki-deleted-content.html) - Trash
- [src/wiki/wiki-about.html](../src/wiki/wiki-about.html) - About page
- [src/wiki/wiki-privacy.html](../src/wiki/wiki-privacy.html) - Privacy policy
- [src/wiki/wiki-terms.html](../src/wiki/wiki-terms.html) - Terms of service

---

## 🗣️ Supported Languages

### Main Platform i18n
**Declared (12):** EN, PT, ES, CS, FR, DE, IT, NL, PL, JA, ZH, KO

**Actually Translated (1):**
- 🇬🇧 English (en) - 100% (baseline: ~140 keys)

**Empty Language Objects (11):**
- 🇵🇹 Portuguese (pt) - 0 keys
- 🇪🇸 Spanish (es) - 0 keys
- 🇨🇿 Czech (cs) - 0 keys
- 🇫🇷 French (fr) - 0 keys
- 🇩🇪 German (de) - 0 keys
- 🇮🇹 Italian (it) - 0 keys
- 🇳🇱 Dutch (nl) - 0 keys
- 🇵🇱 Polish (pl) - 0 keys
- 🇯🇵 Japanese (ja) - 0 keys
- 🇨🇳 Chinese (zh) - 0 keys
- 🇰🇷 Korean (ko) - 0 keys

### Wiki Platform i18n
**Declared (11):** EN, PT, ES, CS, DE, FR, IT, NL, PL, JA, ZH

**Actually Translated (5):**
- 🇬🇧 English (en) - 100% (baseline: 782 keys)
- 🇵🇹 Portuguese (pt) - 100% (904 keys = 782 + 122 extras)
- 🇪🇸 Spanish (es) - 100% (904 keys = 782 + 122 extras)
- 🇨🇿 Czech (cs) - 100% (904 keys = 782 + 122 extras)
- 🇩🇪 German (de) - 100% (904 keys = 782 + 122 extras)

**Template Language Objects (6):**
- 🇫🇷 French (fr) - Template only
- 🇮🇹 Italian (it) - Template only
- 🇳🇱 Dutch (nl) - Template only
- 🇵🇱 Polish (pl) - Template only
- 🇯🇵 Japanese (ja) - Template only
- 🇨🇳 Chinese (zh) - Template only

### What Are the "122 Extra Keys"?

Portuguese, Spanish, Czech, and German have **122 additional translation keys** beyond the English baseline:

**Breakdown:**
- **67 Extended Category Keys** - Additional permaculture categories not in current database
  - Examples: `wiki.categories.agroforestry-systems`, `wiki.categories.companion-planting`, etc.
- **53 Common UI Elements** - Additional interface strings
  - Examples: `wiki.common.submit`, `wiki.common.view`, `wiki.common.delete`, etc.
- **2 Other Keys** - Editor and settings-specific
  - `wiki.editor.location_website_hint`
  - `wiki.settings.location_hidden_desc`

**Important:** All 122 extras are actively used in the UI - they are NOT dead code.

---

## 🤔 Why Not Consolidate Now?

### Arguments FOR Consolidation
1. ✅ Reduces confusion for future developers
2. ✅ Single source of truth for translations
3. ✅ Cleaner architecture
4. ✅ Eliminates technical debt

### Arguments AGAINST Consolidation (Current Position)
1. ⚠️ **Main platform's future is uncertain** - May never be actively used
2. ⚠️ **High refactoring risk** - Could break working wiki system (17 pages, 4,500 translations)
3. ⚠️ **No functional benefit** - Both systems work fine independently
4. ⚠️ **Premature optimization** - YAGNI principle (You Aren't Gonna Need It)
5. ⚠️ **Significant effort** - Would need to:
   - Migrate 6 main platform pages to use `wiki.*` prefixes OR
   - Copy wiki translations to main system OR
   - Create unified system with both prefixes
   - Update all HTML `data-i18n` attributes
   - Update all JavaScript `i18n.t()` / `wikiI18n.t()` calls
   - Extensive testing across 23+ pages

### The YAGNI Principle

**You Aren't Gonna Need It** - A core software development principle stating:
> "Don't implement something until it is actually needed."

**Applied here:**
- We don't yet know if main platform will be used
- We don't yet know if consolidation will provide value
- We DO know consolidation carries risk and effort
- **Therefore:** Wait until the need is clear

---

## 🎯 Decision Framework

### Scenario 1: Main Platform Dies (Most Likely?)
**Action:** Delete `src/js/i18n-translations.js`

**Effort:** Minimal (1 hour)

**Steps:**
1. Remove file: `rm src/js/i18n-translations.js`
2. Update 6 main platform pages to use wiki i18n OR mark them as English-only
3. Update documentation
4. Celebrate having one clean system

**Risk:** None (assuming main platform truly isn't used)

### Scenario 2: Main Platform Lives (Less Likely?)
**Action:** Consolidate to single i18n system

**Effort:** Significant (2-3 days)

**Option A - Migrate Main to Wiki i18n:**
```javascript
// Before (main platform page)
<h1 data-i18n="auth.login_welcome">Welcome Back</h1>
i18n.t('auth.login_welcome')

// After (unified in wiki i18n)
<h1 data-i18n="wiki.auth.login_welcome">Welcome Back</h1>
wikiI18n.t('wiki.auth.login_welcome')
```

**Steps:**
1. Add main platform translations to wiki-i18n.js with `wiki.*` prefix
2. Update all 6 main platform HTML pages
3. Update all main platform JS files
4. Translate new keys to PT/ES/CS/DE
5. Test all 23+ pages
6. Delete i18n-translations.js

**Risk:** Medium (many files to update, potential for breaking changes)

**Option B - Merge Wiki into Main i18n:**
```javascript
// Before (wiki page)
<h1 data-i18n="wiki.nav.home">Home</h1>
wikiI18n.t('wiki.nav.home')

// After (unified in main i18n)
<h1 data-i18n="wiki.nav.home">Home</h1>
i18n.t('wiki.nav.home')
```

**Steps:**
1. Copy all wiki translations to i18n-translations.js
2. Update all 17+ wiki JS files to use `i18n` instead of `wikiI18n`
3. Test all pages
4. Delete wiki-i18n.js

**Risk:** High (more files to update, larger production system at risk)

### Scenario 3: Both Systems Coexist (Current)
**Action:** Nothing (Strategic Do-Nothing)

**Effort:** None

**Benefits:**
- No risk
- No effort
- Both systems work fine
- Can make decision later when need is clear

**Drawbacks:**
- Confusing for new developers (but documented)
- Technical debt (but manageable)
- Duplicate language declarations (but harmless)

---

## 🚀 Current Strategy: Strategic Do-Nothing

**Decision Made:** January 19, 2025

**Rationale:**
- Main platform's future is uncertain
- Wiki system is working perfectly
- Risk outweighs benefit
- YAGNI principle applies

**Actions Taken:**
1. ✅ Added status warnings to both i18n files
2. ✅ Created this architecture documentation
3. ✅ Marked i18n-translations.js as "EXPERIMENTAL / UNCERTAIN FUTURE"
4. ✅ Marked wiki-i18n.js as "PRODUCTION SYSTEM"
5. ✅ Documented decision framework for future

**Next Steps:**
- Wait for product direction on main platform
- Revisit consolidation decision when need becomes clear
- For now: Use wiki-i18n.js for all new pages

---

## 🛠️ Implementation Details

### How Main Platform i18n Works

**File:** [src/js/i18n-translations.js](../src/js/i18n-translations.js)

**Structure:**
```javascript
const i18n = {
  supportedLanguages: {
    'en': { name: 'English', nativeName: 'English', flag: '🇬🇧' },
    // ... 11 more declared
  },

  translations: {
    en: {
      'splash.title': 'Permaculture Network',
      'auth.login_welcome': 'Welcome Back',
      // ... ~140 keys
    }
    // Other languages: empty objects
  },

  t: function(key, lang = this.currentLanguage) {
    return this.translations[lang]?.[key] || key;
  }
}
```

**Usage in HTML:**
```html
<h1 data-i18n="auth.login_welcome">Welcome Back</h1>
```

**Usage in JavaScript:**
```javascript
const welcomeText = i18n.t('auth.login_welcome'); // Returns "Welcome Back"
```

### How Wiki Platform i18n Works

**File:** [src/wiki/js/wiki-i18n.js](../src/wiki/js/wiki-i18n.js)

**Structure:**
```javascript
const wikiI18n = {
  translations: {
    en: {
      'wiki.nav.home': 'Home',
      'wiki.nav.guides': 'Guides',
      // ... 782 base keys + sections for extras
    },
    pt: {
      'wiki.nav.home': 'Início',
      'wiki.nav.guides': 'Guias',
      // ... 904 keys (782 base + 122 extras)
    },
    // es, cs, de: same structure as pt
  },

  t: function(key) {
    const lang = this.getCurrentLanguage();
    return this.translations[lang]?.[key] || this.translations['en']?.[key] || key;
  }
}
```

**Usage in HTML:**
```html
<h1 data-i18n="wiki.nav.home">Home</h1>
```

**Usage in JavaScript:**
```javascript
const homeText = wikiI18n.t('wiki.nav.home'); // Returns "Home" or "Início" based on language
```

### Key Differences

| Feature | Main Platform i18n | Wiki Platform i18n |
|---------|-------------------|-------------------|
| **Variable Name** | `i18n` | `wikiI18n` |
| **Key Prefix** | None | `wiki.*` required |
| **Fallback** | Returns key if missing | Returns EN, then key if missing |
| **Language Declaration** | supportedLanguages object | Direct in translations |
| **Current Language** | Property + localStorage | Function-based |

---

## 📚 Translation Management

### Adding New Wiki Translations

**Current Process:**
1. Add English key to `wiki-i18n.js` (en section)
2. Add to PT/ES/CS/DE sections (100% coverage requirement)
3. Test in UI with language switcher
4. Verify with `node scripts/verify-translations-complete.js`

**Example:**
```javascript
// In wiki-i18n.js

// English section
en: {
  'wiki.new.feature_name': 'New Feature',
}

// Portuguese section
pt: {
  'wiki.new.feature_name': 'Nova Funcionalidade',
}

// Spanish section
es: {
  'wiki.new.feature_name': 'Nueva Funcionalidad',
}

// Czech section
cs: {
  'wiki.new.feature_name': 'Nová Funkce',
}

// German section
de: {
  'wiki.new.feature_name': 'Neue Funktion',
}
```

### Adding Languages to Wiki

**To add a new language (e.g., French):**

1. **Add language declaration** (if not already present)
2. **Create translation object** with all 904 keys
3. **Translate all keys** (recommend professional translator for permaculture terminology)
4. **Add to language switcher UI** in wiki pages
5. **Test thoroughly** across all 17+ pages

**Estimated Effort:**
- Professional translation: 40-60 hours
- AI-assisted translation: 10-20 hours (requires human review)
- Testing: 4-6 hours

---

## 🔍 Verification Scripts

### verify-translations-complete.js
**Location:** [scripts/verify-translations-complete.js](../scripts/verify-translations-complete.js)

**Purpose:** Check translation coverage across languages

**Usage:**
```bash
node scripts/verify-translations-complete.js
```

**Output:**
```
📊 English (en): 782 keys found
📊 Portuguese (pt): 904 keys found
📊 Spanish (es): 904 keys found
📊 Czech (cs): 904 keys found
📊 German (de): 904 keys found

✅ Portuguese: 100.00% complete - 0 missing, 122 extra
✅ Spanish: 100.00% complete - 0 missing, 122 extra
✅ Czech: 100.00% complete - 0 missing, 122 extra
✅ German: 100.00% complete - 0 missing, 122 extra
```

### analyze-i18n-complete.js
**Location:** [scripts/analyze-i18n-complete.js](../scripts/analyze-i18n-complete.js)

**Purpose:** Comprehensive analysis of BOTH i18n systems

**Usage:**
```bash
node scripts/analyze-i18n-complete.js
```

**Output:** Detailed comparison of main vs wiki i18n systems

### analyze-pt-extras.js
**Location:** [scripts/analyze-pt-extras.js](../scripts/analyze-pt-extras.js)

**Purpose:** Analyze the 122 extra Portuguese keys and their UI usage

**Usage:**
```bash
node scripts/analyze-pt-extras.js
```

**Output:** Breakdown of extras by category and UI usage verification

---

## 📖 Reference Documentation

### Related Files
- [CLAUDE.md](../.claude/CLAUDE.md) - Development guidelines
- [scripts/verify-translations-complete.js](../scripts/verify-translations-complete.js) - Coverage verification
- [scripts/analyze-i18n-complete.js](../scripts/analyze-i18n-complete.js) - System comparison
- [scripts/analyze-pt-extras.js](../scripts/analyze-pt-extras.js) - Extra keys analysis

### Git History
See git commits for translation evolution:
```bash
git log --all --oneline --grep="i18n\|translation\|lang" --since="2024-01-01"
```

---

## 🤝 Contributing

### For Developers

**If you need to add a new translated string:**

1. **For wiki pages:** Use `wiki-i18n.js` (production system)
2. **For main platform pages:** Use `i18n-translations.js` (but note: uncertain future)

**If you're unsure which system to use:**
- Use `wiki-i18n.js` - it's the production system
- Consult this document
- Ask the project maintainer

**Never:** Create a third i18n system 😄

---

## 📅 Review Schedule

**Next Review:** When main platform's future is determined

**Triggers for Review:**
- Main platform gets active development
- Main platform is officially deprecated
- New pages are added to either platform
- User requests consolidation
- 6 months pass (July 2025)

---

## 📞 Questions?

Contact: Libor Ballaty <libor@arionetworks.com>

**Last Updated:** 2025-01-19
