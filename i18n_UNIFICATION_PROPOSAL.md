# i18n UNIFICATION PROPOSAL

**Date:** 2025-11-12
**Status:** ANALYSIS COMPLETE - AWAITING APPROVAL TO PROCEED

---

## EXECUTIVE SUMMARY

Permahub currently has **TWO SEPARATE i18n SYSTEMS** that are:
- ❌ Not communicating
- ❌ Not sharing language preferences
- ❌ Storing duplicate translations
- ❌ Creating inconsistent user experience

**This proposal outlines how to unify them into ONE system.**

---

## CURRENT STATE ANALYSIS

### System 1: Main App (`src/js/i18n-translations.js`)

| Metric | Value |
|--------|-------|
| File size | 27 KB |
| Total lines | 668 |
| Languages | 11 (EN, PT, ES, + 8 empty) |
| Translations | EN: ~160 keys, PT: ~160 keys, ES: ~160 keys |
| Translation status | English & Spanish ~100%, Portuguese incomplete |
| Key prefixes | `auth`, `landing`, `common`, `btn`, `alert`, `validation`, `legal`, `splash`, `lang`, `a11y` |
| Used by | 6 pages (index, auth, dashboard, resources, add-item, legal) |
| Loading method | `<script src="../js/i18n-translations.js"></script>` |
| Language selector | 1 main selector in header |

### System 2: Wiki (`src/wiki/js/wiki-i18n.js`)

| Metric | Value |
|--------|-------|
| File size | 21 KB |
| Total lines | 494 |
| Languages | 11 (EN, PT, ES, + 8 empty) |
| Translations | EN: ~355 keys, PT: ~121 keys (34%), ES: ~37 keys (10%) |
| Translation status | English complete, Portuguese/Spanish incomplete |
| Key prefixes | `wiki.` ONLY |
| Used by | 7 pages (wiki-home, wiki-editor, wiki-events, wiki-favorites, wiki-login, wiki-map, wiki-page) |
| Loading method | `<script src="js/wiki-i18n.js"></script>` |
| Language selector | Language dropdown built into each page |

---

## THE PROBLEMS

### 1. **No Shared Language Preference**
```
User navigates:
Main App (English) → Wiki (loses selection, defaults to English)
Wiki (Portuguese) → Main App (loses selection, defaults to English)

No localStorage sharing between systems
No communication between i18n instances
```

### 2. **Duplicate Translations**
```
Example: "Home" button

Main App System:
'common.home': 'Home' (if it exists)

Wiki System:
'wiki.nav.home': 'Home'

Same word translated twice, separately maintained
```

### 3. **Inconsistent Coverage**
```
Main App: ~160 keys per language
Wiki: ~355 keys per language

Different completeness levels:
- English: 100% (main) vs 100% (wiki) ✅
- Portuguese: 100% (main) vs 34% (wiki) ❌
- Spanish: 100% (main) vs 10% (wiki) ❌
```

### 4. **Separate Language Selectors**
```
Main App: Language selector in navbar
Wiki: Language selector in dropdown menu

Two different UI implementations
Two separate logic implementations
Not synchronized
```

### 5. **Maintenance Nightmare**
```
If you want to add French:
1. Add 160 keys to main app system
2. Add 355 keys to wiki system
3. Translate both independently
4. Maintain two separate files forever

Total: 515 keys × 2 systems = 1,030 keys to maintain
```

### 6. **Code Duplication**
```
Main App pages load:
- i18n-translations.js (668 lines)

Wiki pages load:
- wiki-i18n.js (494 lines)

Total: 1,162 lines of JavaScript
Opportunity: Could be 800 lines in unified system
```

---

## PROPOSED SOLUTION: UNIFIED SYSTEM

### Architecture

**Create ONE master file:** `src/js/i18n-master.js`

```
Structure:

src/
├── js/
│   ├── i18n-master.js          ← NEW: Master file with ALL translations
│   ├── i18n-translations.js    ← DELETE: No longer needed
│   └── i18n-utils.js           ← NEW: Shared utilities (optional)
│
├── pages/
│   ├── *.html                  ← Load i18n-master.js
│   └── (all use same system)
│
└── wiki/
    ├── *.html                  ← Load i18n-master.js
    ├── js/
    │   └── wiki-i18n.js        ← DELETE: No longer needed
    └── (all use same system)
```

### What Goes Into `i18n-master.js`

```javascript
const i18n = {
  supportedLanguages: {
    'en': {...}, 'pt': {...}, 'es': {...}, ...
  },

  currentLanguage: 'en',

  translations: {
    en: {
      // MAIN APP KEYS
      'auth.login': 'Login',
      'landing.title': 'Welcome to Permaculture Network',
      'common.home': 'Home',
      ...

      // WIKI KEYS
      'wiki.nav.home': 'Home',
      'wiki.nav.events': 'Events',
      'wiki.editor.title': 'Create New Guide',
      ...
    },

    pt: {
      // ALL PORTUGUESE TRANSLATIONS (shared)
      ...
    },

    es: {
      // ALL SPANISH TRANSLATIONS (shared)
      ...
    }
  },

  // Shared methods
  t(key) { ... },
  setLanguage(lang) { ... }
}
```

---

## IMPLEMENTATION APPROACH

### Phase 1: Preparation (30 minutes)
- [ ] Create `i18n-master.js`
- [ ] Copy all 160 keys from main app system
- [ ] Copy all 355 wiki keys into same file
- [ ] Verify all keys are unique (prefixes: `auth`, `landing`, `wiki`, etc.)
- [ ] Verify no key conflicts

### Phase 2: Update HTML Files (45 minutes)
- [ ] Update all 6 main app pages to load `i18n-master.js`
- [ ] Update all 7 wiki pages to load `i18n-master.js`
- [ ] Remove old script includes (`i18n-translations.js`, `wiki-i18n.js`)
- [ ] Verify pages still render

### Phase 3: Unified Language Switching (1 hour)
- [ ] Create single language selector component
- [ ] Use `localStorage` to persist choice across entire app
- [ ] Update both main app and wiki pages to use same selector
- [ ] Test language switching between sections

### Phase 4: Complete Portuguese & Spanish Translations (2-3 hours)
- [ ] Portuguese: Complete missing wiki keys (~234 missing)
- [ ] Spanish: Complete missing wiki keys (~318 missing)
- [ ] Verify all 3 languages have 100% coverage across all ~515 keys

### Phase 5: Testing & Cleanup (1 hour)
- [ ] Test on all pages (main app + wiki)
- [ ] Test language switching between sections
- [ ] Delete old files:
  - `src/js/i18n-translations.js` (DELETE)
  - `src/wiki/js/wiki-i18n.js` (DELETE)
- [ ] Commit unified system

---

## BEFORE vs. AFTER

### BEFORE (Current State)

```
Main App                          Wiki
├── i18n-translations.js          ├── wiki-i18n.js
│   ├── en: 160 keys             │   ├── en: 355 keys
│   ├── pt: 160 keys             │   ├── pt: 121 keys
│   └── es: 160 keys             │   └── es: 37 keys
│
├── Language preference isolated  ├── Language preference isolated
├── Two separate configs          ├── Two separate configs
└── No communication              └── No communication

User Experience:
❌ Switch from main to wiki → language resets
❌ Inconsistent UI
❌ Duplicate translations
```

### AFTER (Unified System)

```
UNIFIED MASTER FILE
└── i18n-master.js
    ├── en: 515 keys (auth, landing, common, wiki, btn, alert, etc.)
    ├── pt: 515 keys (complete translations)
    ├── es: 515 keys (complete translations)
    │
    ├── ONE language preference (shared localStorage)
    ├── ONE language selector (consistent UI)
    ├── ONE set of methods (t(), setLanguage(), etc.)
    └── ALL pages use this file

Used by:
✅ Main app pages (index, auth, dashboard, resources, add-item, legal)
✅ Wiki pages (wiki-home, wiki-editor, wiki-events, etc.)

User Experience:
✅ Switch from main to wiki → language persists
✅ Consistent UI everywhere
✅ Single source of truth
```

---

## BENEFITS

### 1. **Better User Experience**
- Language preference persists across entire app
- Consistent language selector design
- Seamless navigation between sections

### 2. **Easier Maintenance**
- ONE file instead of TWO
- ONE set of keys (no duplicates)
- ONE translation workflow
- Easier to add new languages

### 3. **Code Efficiency**
- ~1,162 lines → ~800 lines JavaScript
- 48% reduction in i18n code
- Smaller bundle size

### 4. **Translation Completeness**
- Easy to see what's missing (all in one file)
- One place to track translation status
- Coordinated multi-language support

### 5. **Team Collaboration**
- Single file to update
- No coordination needed between sections
- Clear namespace structure (auth.*, landing.*, wiki.*, etc.)

---

## RISKS & MITIGATION

### Risk 1: Breaking Pages During Merge
**Mitigation:**
- Test each page after updating script includes
- Use fallback to English if key missing
- Run unit tests to verify

### Risk 2: Lost Language Preference
**Mitigation:**
- Migrate localStorage on first load
- Check both old keys during transition period
- Test with real browsers

### Risk 3: Missing Translations
**Mitigation:**
- Audit all keys before merge
- Flag untranslated keys in code
- Don't delete old files until 100% verified

---

## EFFORT ESTIMATE

| Phase | Task | Time | Complexity |
|-------|------|------|-----------|
| 1 | Prepare master file | 30 min | Low |
| 2 | Update HTML pages | 45 min | Low |
| 3 | Unified language switching | 1 hr | Medium |
| 4 | Complete translations | 2-3 hrs | Medium |
| 5 | Testing & cleanup | 1 hr | Low |
| **TOTAL** | **Complete unification** | **5-6 hrs** | **Medium** |

---

## WHAT NEEDS YOUR DECISION

### Question 1: Architecture Preference
Do you want to:
- **Option A:** Unified master file (`i18n-master.js`) - Recommended
- **Option B:** Keep separate but sync with shared localStorage - Not recommended
- **Option C:** Something else?

### Question 2: Translation Completeness
Should we:
- **Option A:** Complete Portuguese & Spanish for all 515 keys upfront
- **Option B:** Leave wiki translations incomplete for now, complete later
- **Option C:** Use AI auto-translation for missing keys

### Question 3: Namespace Organization
How should keys be organized?
- **Option A:** By section (`auth.*`, `landing.*`, `wiki.*`)
- **Option B:** By domain (`user.*`, `content.*`, `navigation.*`)
- **Option C:** Flat namespace with consistent prefixes

### Question 4: Timing
When should this be done?
- **Option A:** Immediately (before any other development)
- **Option B:** After landing page eco-themes work is finished
- **Option C:** In a separate sprint

---

## RECOMMENDATION

**I recommend:**

1. **Option A** - Unified master file with all translations in one place
2. **Option A** - Complete Portuguese & Spanish translations upfront (highest quality, professional appearance)
3. **Option A** - Organize by section (auth.*, landing.*, wiki.*, common.*)
4. **Option A** - Do this immediately before proceeding with other features

**Why:**
- Takes 5-6 hours, saves countless hours of maintenance
- Multi-language support becomes fully functional immediately
- No risk of breaking current functionality (can be done in parallel with eco-themes work)
- Professional appearance for international users
- Sets foundation for all future development

---

## NEXT STEPS

Once you approve:

1. Let me know which options you prefer for each decision point
2. I'll create the unified `i18n-master.js` file
3. I'll update all 13 HTML files to use it
4. I'll complete the Portuguese & Spanish translations
5. I'll test everything works across all pages
6. I'll commit the unified system to git

---

**Ready to proceed once you approve the proposal.**

Questions? Clarifications needed? Let me know what you'd like to adjust.
