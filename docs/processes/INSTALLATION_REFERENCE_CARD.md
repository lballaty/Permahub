# PWA Installation Reference Card

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/processes/INSTALLATION_REFERENCE_CARD.md

**Description:** Quick visual reference for iOS and macOS PWA installation

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-26

---

## 🔗 GitHub Pages URL

```
https://lballaty.github.io/Permahub/src/wiki/wiki-home.html
```

**Copy and paste this into Safari or Chrome address bar**

---

## 📱 iOS Installation (iPhone/iPad)

### Required:
- Safari browser (NOT Chrome or Firefox)
- iOS 11.3 or later
- HTTPS URL (GitHub Pages is HTTPS ✅)

### Steps: 4 Taps, 90 Seconds

```
1. OPEN SAFARI
   ↓
   Paste URL above, wait for page to load

2. TAP SHARE BUTTON
   ↓
   ⬆️ icon at bottom center (iPhone)
   ⬆️ icon at top right (iPad)

3. SCROLL DOWN & TAP "ADD TO HOME SCREEN"
   ↓
   Might need to scroll in the popup menu

4. CONFIRM & TAP "ADD"
   ↓
   Name: Permahub
   Icon: Green leaf (should show)
   URL: lballaty.github.io/Permahub/src/wiki/wiki-home.html
```

### Launch:
- Go to home screen
- Find Permahub icon with green leaf
- Tap to launch
- App opens **full-screen** (no Safari UI)

### Verify:
```
✅ No address bar visible
✅ Green Permahub header shows
✅ Guides grid visible
✅ Events grid visible
✅ Navigation menu works
✅ Data loads from database
```

### If "Add to Home Screen" is Missing:
1. Use **Safari** (not Chrome/Firefox)
2. URL must be **HTTPS** (GitHub Pages is ✅)
3. Page must **fully load** first
4. Try again

---

## 💻 macOS Installation

### Option 1: Safari (Simplest)

**Required:**
- Safari 13 or later
- macOS 10.14 or later

**Steps:**
```
1. OPEN SAFARI
   ↓
   Paste URL above

2. FILE MENU
   ↓
   Click "File" at top left

3. SHARE
   ↓
   Click "Share" option

4. ADD TO DOCK
   ↓
   Click "Add to Dock"
```

**Launch:**
- Find Permahub icon in Dock
- Click to launch
- App opens in **standalone window**

---

### Option 2: Chrome

**Required:**
- Chrome 80 or later

**Steps:**
```
1. OPEN CHROME
   ↓
   Paste URL above

2. LOOK FOR INSTALL ICON
   ↓
   ⊕ symbol in address bar (right side)
   OR
   ⋮ menu → "Install Permahub Wiki..."

3. CLICK INSTALL
   ↓
   Dialog appears

4. CONFIRM
   ↓
   App opens immediately in new window
```

**Launch:**
- App in Applications folder
- Or Chrome menu: chrome://apps

---

### Option 3: Edge

**Required:**
- Edge 79 or later

**Steps:**
```
1. OPEN EDGE
   ↓
   Paste URL above

2. LOOK FOR INSTALL ICON
   ↓
   Download icon in address bar (right side)
   OR
   ⋯ menu → "Install this site as an app"

3. CLICK INSTALL
   ↓
   Dialog appears

4. CONFIRM
   ↓
   App opens in new window
```

**Launch:**
- App in Applications folder
- Or Edge: edge://apps

---

## ✅ What You Should See

### Desktop (Before Installation)
```
🌐 Browser window with:
   - Permahub green header
   - Address bar showing: lballaty.github.io/Permahub/src/wiki/...
   - Guides grid with cards
   - Events grid with cards
   - Navigation menu
   - Browser tabs and controls visible
```

### Installed App (After Installation)
```
📱 Full-screen app window with:
   - NO address bar
   - NO browser tabs
   - NO browser controls
   - Permahub green header
   - Guides grid with cards
   - Events grid with cards
   - Navigation menu
   - Window title: "Permahub"
   - Mini window controls (minimize, close)
```

---

## 🔄 Offline Testing

### Turn On Offline Mode:
**Desktop:**
- DevTools (F12) → Network tab
- Checkbox: "Offline"

**iOS/macOS:**
- Settings → Airplane Mode → ON
- (WiFi will turn off)

### What Should Work Offline:
```
✅ Home page loads
✅ Guides still show (cached from first load)
✅ Events still show (cached from first load)
✅ Navigation works (between cached pages)
✅ Favorites work (cached from app)
```

### What Shows Offline Fallback:
```
📵 Pages you haven't visited yet
    ↓
Shows: "You're Offline" page
With helpful message about offline mode

Navigate back to cached pages to continue
```

### Turn Online Again:
- Desktop: Uncheck "Offline" in Network tab
- iOS/macOS: Turn off Airplane Mode
- Notification: "Connection restored" appears
- Data syncs automatically

---

## 🧪 Quick Test Checklist

After installing, verify:

### Load & Display (2 minutes)
- [ ] App loads in <2 seconds
- [ ] Guides display in grid (at least 7 guides)
- [ ] Events display in grid (at least some events)
- [ ] Locations visible on map
- [ ] Navigation menu accessible

### Functionality (3 minutes)
- [ ] Can navigate between guides
- [ ] Can navigate between events
- [ ] Can scroll and search
- [ ] Can favorite items (star icon)
- [ ] Can open detail pages

### PWA Features (5 minutes)
- [ ] App is full-screen (no browser UI)
- [ ] App icon correct (green leaf)
- [ ] No console errors (open DevTools)
- [ ] Update notifications work
- [ ] Offline mode works (if testing)

**Total Time:** ~10 minutes for complete verification

---

## 🎯 Key Points to Remember

| Point | Why It Matters |
|-------|----------------|
| **Must use Safari on iOS** | Only Safari supports "Add to Home Screen" |
| **Must be HTTPS** | Service Workers require secure context |
| **Page must fully load** | App metadata comes from loaded page |
| **Clear cache if stuck** | Safari cache can cause installation issues |
| **App launches full-screen** | That's how you know PWA is working |
| **No address bar = Success** | Standalone mode = Successful installation |

---

## 🆘 Troubleshooting Quick Fix

### "Add to Home Screen" Missing?
```
❌ Using Chrome/Firefox
   ✅ SOLUTION: Use Safari instead

❌ Not on HTTPS
   ✅ SOLUTION: GitHub Pages is HTTPS (use the URL above)

❌ Page didn't fully load
   ✅ SOLUTION: Wait 2-3 seconds, try again

❌ Still not showing?
   ✅ SOLUTION: Clear Safari cache
      Settings → Safari → Advanced → Website Data
      Find the site and delete it
      Reload page and try again
```

### App Opens in Browser, Not Standalone?
```
✅ Delete app from home screen
✅ Clear Safari cache completely
✅ Reload page
✅ Install again
```

### Data Doesn't Load?
```
✅ Check internet connection
✅ Open DevTools (F12)
✅ Look for error messages
✅ Check that you're on GitHub Pages URL
✅ Not on localhost
```

---

## 📊 Platform Compatibility

| Platform | Status | Installation Method |
|----------|--------|---------------------|
| **iPhone/iPad** | ✅ Full | Safari: Share → Add to Home Screen |
| **macOS Safari** | ✅ Full | File → Share → Add to Dock |
| **macOS Chrome** | ✅ Full | Click install icon in address bar |
| **macOS Edge** | ✅ Full | Click install icon in address bar |
| **Android Chrome** | ✅ Full | Three-dot menu → "Install app" |
| **Windows Chrome** | ✅ Full | Three-dot menu → "Install Permahub" |

---

## 💡 Pro Tips

### Best Installation Order:
1. **First:** Test on desktop browser (fastest feedback)
2. **Second:** Test offline mode (most important feature)
3. **Third:** Install on iPhone (if you have one)
4. **Fourth:** Install on Mac (if you have one)
5. **Fifth:** Run Lighthouse audit (technical verification)

### Time Saver:
- Copy the URL to bookmarks for quick access
- iPhone: Save URL to Reading List for easy testing
- Mac: Add to favorites bar for quick testing

### Offline Testing Tips:
- Visit main page FIRST (so it caches)
- Then enable offline mode
- Then navigate to verify caching
- Then disable offline to test reconnection

---

## 📝 Installation Log Template

```markdown
**Device:** [iPhone 13 / Mac / etc]
**Browser:** [Safari / Chrome / Edge]
**Date:** YYYY-MM-DD
**Time:** HH:MM

**Installation Steps:**
- [ ] Step 1: Opened browser
- [ ] Step 2: Loaded URL
- [ ] Step 3: Tapped Share/Menu
- [ ] Step 4: Found Install option
- [ ] Step 5: Confirmed installation
- [ ] Step 6: Launched app

**Verification:**
- [ ] App launched full-screen
- [ ] No address bar visible
- [ ] Content loaded
- [ ] Navigation works
- [ ] Icons display correctly

**Offline Test:**
- [ ] Enabled offline mode
- [ ] Cached content loaded
- [ ] New page showed offline fallback
- [ ] Disabled offline
- [ ] Connection notification appeared
- [ ] Data synced

**Issues Found:**
[List any problems encountered]

**Overall Result:** ✅ Success / ❌ Failed
```

---

## 🚀 You're All Set!

**GitHub Pages URL:**
```
https://lballaty.github.io/Permahub/src/wiki/wiki-home.html
```

**Installation Time:** 90 seconds

**Testing Time:** 10 minutes

**Questions?** See full guides:
- Installation: PWA_INSTALLATION_GUIDE.md
- Testing: GITHUB_PAGES_PWA_TESTING.md
- Quick Start: GITHUB_PAGES_INSTALLATION_QUICK_START.md

---

**Ready to test?** Pick your device and follow the steps above!

**Status:** ✅ Ready for Installation

