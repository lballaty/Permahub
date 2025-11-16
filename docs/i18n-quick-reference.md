# i18n Quick Reference Guide

**Last Updated:** 2025-11-16

---

## 🎯 Status at a Glance

✅ **COMPLETE**: All 13 wiki pages have full i18n infrastructure
✅ **VERIFIED**: 529 attributes, 549 keys, 0 missing translations
✅ **READY**: English production-ready, framework ready for 15+ languages

---

## 🚀 Quick Commands

```bash
# Verify i18n coverage (should show 0 missing)
node scripts/verify-i18n-simple.js

# Start dev server to test language switching
npm run dev
# Then visit: http://localhost:3003/src/wiki/wiki-home.html

# Test language switching
# 1. Click language selector (top right)
# 2. Choose Portuguese/Spanish/Czech
# 3. Verify page content translates
```

---

## 📁 Key Files

| File | Purpose | Lines | Keys |
|------|---------|-------|------|
| [wiki-i18n.js](../src/wiki/js/wiki-i18n.js) | Translation keys | ~1200 | 549 EN |
| [verify-i18n-simple.js](../scripts/verify-i18n-simple.js) | Verification script | 70 | - |
| [i18n-implementation-complete.md](./i18n-implementation-complete.md) | Full documentation | - | - |

---

## 📄 Page Coverage

All 13 wiki pages ready:

- ✅ wiki-admin.html (44 attributes)
- ✅ wiki-editor.html (45 attributes)
- ✅ wiki-events.html (33 attributes)
- ✅ wiki-favorites.html (63 attributes)
- ✅ wiki-forgot-password.html (31 attributes)
- ✅ wiki-guides.html (27 attributes)
- ✅ wiki-home.html (25 attributes)
- ✅ wiki-issues.html (78 attributes)
- ✅ wiki-login.html (44 attributes)
- ✅ wiki-map.html (32 attributes)
- ✅ wiki-page.html (30 attributes)
- ✅ wiki-reset-password.html (31 attributes)
- ✅ wiki-signup.html (46 attributes)

---

## 🌍 Language Status

| Language | Code | Keys | Status |
|----------|------|------|--------|
| English | en | 549/549 | ✅ Complete |
| Portuguese | pt | ~280/549 | ⚠️ Partial (51%) |
| Spanish | es | ~119/549 | ⚠️ Partial (22%) |
| Czech | cs | ~52/549 | ⚠️ Partial (9%) |
| German | de | 1/549 | ❌ Not started |
| Italian | it | 1/549 | ❌ Not started |
| French | fr | 1/549 | ❌ Not started |
| Others | - | 1/549 | ❌ Not started |

---

## 🛠️ Developer Guide

### Add New Translatable Text

**1. Add to HTML:**
```html
<button data-i18n="wiki.section.new_button">Click Me</button>
```

**2. Add to wiki-i18n.js:**
```javascript
translations.en = {
  // ... existing keys
  'wiki.section.new_button': 'Click Me',
};
```

**3. Verify:**
```bash
node scripts/verify-i18n-simple.js
```

### Add Dynamic JavaScript Message

**Before:**
```javascript
statusDiv.textContent = "Loading...";
```

**After:**
```javascript
statusDiv.textContent = wikiI18n.t('wiki.section.loading');
```

Then add key to wiki-i18n.js:
```javascript
'wiki.section.loading': 'Loading...',
```

---

## 🧪 Testing

### Manual Test (2 minutes)

1. Start dev server: `npm run dev`
2. Open: http://localhost:3003/src/wiki/wiki-home.html
3. Click language selector → Choose Portuguese
4. Verify: Page content changes to Portuguese
5. Navigate to wiki-events.html
6. Verify: Language persists across pages
7. Check localStorage: Key `wiki_language` should be `pt`

### Expected Behavior

✅ Navigation menu translates
✅ Page titles translate
✅ Button labels translate
✅ Input placeholders translate
✅ Loading messages translate
✅ Error messages translate
✅ Language persists across page navigation
✅ Language saved in localStorage

---

## 🐛 Troubleshooting

### Issue: Text not translating

**Check:**
1. HTML has `data-i18n` attribute?
2. Translation key exists in wiki-i18n.js?
3. Browser console shows errors?
4. Run: `node scripts/verify-i18n-simple.js`

### Issue: Language doesn't persist

**Check:**
1. localStorage enabled in browser?
2. Key `wiki_language` exists?
3. wiki.js loaded on page?

### Issue: New key not working

**Fix:**
1. Check key name exactly matches between HTML and wiki-i18n.js
2. Refresh page (Cmd/Ctrl + Shift + R)
3. Check browser console for "Missing translation" warnings

---

## 📊 Statistics

```
Implementation Date:     2025-11-16
Total Pages:            13
Total Attributes:       529
Total Keys:             549
Languages Supported:    16
Complete Languages:     1 (English)
Verification:           Automated script
Coverage:               100%
Status:                 Production Ready (English)
```

---

## 🎯 What's Next?

### To Complete Other Languages

**Portuguese** (51% done):
- Add 269 missing keys
- Estimated: 4-6 hours

**Spanish** (22% done):
- Add 430 missing keys
- Estimated: 8-10 hours

**Czech** (9% done):
- Add 497 missing keys
- Estimated: 10-12 hours

**German/Italian/French** (0% done):
- Add ~548 keys each
- Estimated: 10-12 hours per language

### Optional Enhancements

- Database persistence (save language to user profile)
- RTL language support (Arabic, Hebrew)
- Date/time localization
- Playwright automated tests
- Translation management tool integration (Crowdin, Lokalise)

---

## 📞 Support

**Documentation:**
- Full report: [i18n-implementation-complete.md](./i18n-implementation-complete.md)
- Translation file: [wiki-i18n.js](../src/wiki/js/wiki-i18n.js)
- Verification: [verify-i18n-simple.js](../scripts/verify-i18n-simple.js)

**Questions?**
- Check wiki-i18n.js for key naming patterns
- Run verification script to find issues
- Review implementation report for details

---

**Status:** ✅ Production Ready (English) | ⚠️ Partial (Other Languages)
