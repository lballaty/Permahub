# GitHub Pages PWA Installation - Quick Start

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/processes/GITHUB_PAGES_INSTALLATION_QUICK_START.md

**Description:** Quick reference guide for installing Permahub PWA from GitHub Pages

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-26

---

## 🎯 Quick Links

**GitHub Pages URL:**
```
https://lballaty.github.io/Permahub/src/wiki/wiki-home.html
```

**Copy this URL and use it for all installation tests below**

---

## 📱 iPhone/iPad Installation (90 seconds)

### Step-by-Step:

1. **Open Safari** (NOT Chrome or Firefox)
   - Open Safari on your iPhone/iPad
   - Paste URL: `https://lballaty.github.io/Permahub/src/wiki/wiki-home.html`
   - Wait for page to fully load (should show guides, events, locations)

2. **Tap Share Button**
   - Tap the share icon (square with ⬆️ arrow)
   - Location: Bottom center (iPhone) or top right (iPad)

3. **Scroll Down and Tap "Add to Home Screen"**
   - You'll see action menu popup
   - Scroll down if needed
   - Tap "Add to Home Screen"

4. **Confirm App Details**
   - Name: "Permahub" (can edit if you want)
   - Icon: Green leaf icon (should show)
   - Tap "Add" button (top right)

5. **Launch App**
   - Go to home screen
   - Find Permahub icon with green leaf
   - Tap to launch
   - App opens full-screen (no Safari UI)

### Verify Success:
- ✅ Icon appears on home screen
- ✅ App launches without address bar
- ✅ Page shows guides, events, locations
- ✅ Navigation menu works
- ✅ Data loads from database

### If "Add to Home Screen" Missing:
1. Make sure you're using **Safari** (not Chrome)
2. Make sure you're on **HTTPS** URL (GitHub Pages is HTTPS ✅)
3. Page must fully load first
4. Try clearing Safari cache: Settings → Safari → Advanced → Website Data

---

## 💻 Mac Installation

### Option A: Safari (Recommended)

1. **Open Safari on Mac**
   - Launch Safari
   - Paste URL: `https://lballaty.github.io/Permahub/src/wiki/wiki-home.html`
   - Wait for full load

2. **Add to Dock**
   - Click **File** menu (top left)
   - Select **Share**
   - Click **"Add to Dock"**

3. **Launch from Dock**
   - Find Permahub icon in Dock
   - Click to launch
   - App opens in standalone window

### Option B: Chrome or Edge

1. **Open Chrome or Edge**
   - Paste URL: `https://lballaty.github.io/Permahub/src/wiki/wiki-home.html`

2. **Look for Install Icon**
   - Chrome: ⊕ icon in address bar
   - Edge: Download icon in address bar
   - OR click ⋮ menu → "Install Permahub Wiki..."

3. **Click Install**
   - Dialog appears
   - Click "Install" button

4. **Launch App**
   - App opens immediately
   - Or find in Applications folder
   - Or go to `chrome://apps`

### Verify Success:
- ✅ App icon in Dock or Applications
- ✅ Standalone window opens (no browser tabs)
- ✅ Title bar shows "Permahub"
- ✅ Content loads
- ✅ Navigation works

---

## 🔍 What You Should See After Installation

### On All Platforms:

**Home Page:**
- Green header with Permahub branding
- "Guides" grid with guide cards
- "Recent Locations" section
- "Upcoming Events" grid
- Navigation menu (hamburger or tabs)

**Database Connected:**
- Guides load (Permaculture guides from database)
- Events show upcoming workshops/events
- Locations show on map
- All data from Supabase (Cloud version)

**PWA Features:**
- App launches full-screen (no browser UI)
- App icon on home screen/dock
- Works offline for cached pages
- Update notification when new version available

---

## 🔧 Troubleshooting

### Issue: Can't find "Add to Home Screen"
**Solution:** Must use Safari on iOS (Chrome doesn't support this feature)

### Issue: App icon doesn't show
**Solution:** Clear Safari cache and reinstall
- Settings → Safari → Advanced → Website Data → Remove site data
- Reload page and add to home screen again

### Issue: Data doesn't load
**Solution:** Check database connection
- Open browser console (F12)
- Look for: `🌐 Database: Cloud` message
- If you see "Local" instead of "Cloud", environment detection failed

### Issue: Service Worker errors
**Solution:** Check DevTools → Application → Service Workers
- Should show "activated and running"
- If showing error, sw.js file not loading correctly
- Registration now tries multiple paths and logs failures before succeeding:
  - GitHub Pages: `/Permahub/sw.js`
  - Local dev: `/src/sw.js`, then `../../sw.js`, then `/sw.js`
  - First path may 404 locally; check console for the successful fallback message

---

## ✅ Testing Checklist

After installation, verify:

- [ ] App launches in full-screen mode
- [ ] No browser address bar visible
- [ ] App icon correct (green leaf)
- [ ] Home page loads within 2 seconds
- [ ] Guides display in grid
- [ ] Events display in grid
- [ ] Locations display on map
- [ ] Navigation between pages works
- [ ] Click on a guide opens detail page
- [ ] Click on an event opens detail page
- [ ] Map shows location markers
- [ ] Favorites feature works (star icon)
- [ ] Settings accessible
- [ ] No console errors (F12 → Console)

---

## 📊 What's Working Now

**PWA Features:**
- ✅ Service Worker installed and caching
- ✅ Manifest with app info and icons
- ✅ Offline support for cached pages
- ✅ App installation on iOS/macOS
- ✅ Auto-update notifications
- ✅ Connection status detection

**Database:**
- ✅ Cloud Supabase auto-detection
- ✅ Guides loading
- ✅ Events loading
- ✅ Locations loading
- ✅ Map functionality
- ✅ No CORS issues

**Performance:**
- ✅ Pages cache for instant loading
- ✅ Load time < 2 seconds
- ✅ Offline pages serve instantly from cache
- ✅ Network-first for API data (fresh content priority)

---

## 🎯 Next Steps

1. **Test on iPhone:**
   - Follow iOS installation steps above
   - Test offline mode (Airplane Mode)
   - Test Lighthouse PWA audit

2. **Test on Mac:**
   - Try Safari and Chrome versions
   - Compare installation UX
   - Test offline functionality

3. **Gather Feedback:**
   - App usability
   - Performance on actual devices
   - Any bugs or issues
   - Feature requests

4. **Document Results:**
   - See: `GITHUB_PAGES_PWA_TESTING.md` for detailed testing guide
   - Record issues in project tracker
   - Note any improvements needed

---

## 📞 Support

**GitHub Pages URL:** https://lballaty.github.io/Permahub/src/wiki/wiki-home.html

**For detailed testing:** See `GITHUB_PAGES_PWA_TESTING.md`

**For PWA installation guide:** See `PWA_INSTALLATION_GUIDE.md`

**For implementation details:** See `PWA_IMPLEMENTATION_PLAN.md`

---

**Status:** 🚀 Ready for installation testing

**Created:** 2025-11-26
