# GitHub Pages PWA Testing Guide

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/testing/GITHUB_PAGES_PWA_TESTING.md

**Description:** Step-by-step testing guide for PWA functionality on GitHub Pages

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-26

**Last Updated:** 2025-11-26

---

## 🎯 Overview

This guide covers testing the Progressive Web App (PWA) implementation on GitHub Pages, including:
- Service Worker functionality
- Offline capability
- App installation on iOS and macOS
- Database connectivity
- Cache behavior

**GitHub Pages URL:** https://lballaty.github.io/Permahub/src/wiki/wiki-home.html

---

## ✅ Phase 1: Basic Functionality Test

### Test 1.1: Page Loads

**Steps:**
1. Open GitHub Pages URL: `https://lballaty.github.io/Permahub/src/wiki/wiki-home.html`
2. Check page loads without errors
3. Verify all content displays (guides, locations, events grid)
4. Check for console errors (F12 → Console tab)

**Expected Results:**
- ✅ Page loads in <2 seconds
- ✅ Guides, locations, events display
- ✅ Navigation menu visible
- ✅ No console errors
- ✅ Console shows: `[PWA] Registration script loaded`

**Issues to Watch:**
- ❌ 404 errors on icons or manifest
- ❌ CORS errors from Supabase
- ❌ Service Worker registration failures
- ❌ Blank page or missing content

---

### Test 1.2: Database Connectivity

**Steps:**
1. Open browser console (F12)
2. Check console logs for database status
3. Look for messages like `🌐 Database: Cloud` or `📊 Loading guides...`
4. Verify data populates in UI

**Expected Results:**
- ✅ Console shows: `🌐 Database: Cloud` (not localhost)
- ✅ Guides loaded from Supabase
- ✅ Events loaded from Supabase
- ✅ Locations loaded from Supabase
- ✅ Map initializes with location data
- ✅ No CORS errors

**Console Commands to Run:**
```javascript
// Check which database is being used
console.log(document.body.textContent.includes('Cloud') ? 'Cloud DB ✅' : 'Local DB')

// Check Supabase configuration
fetch('../../src/js/config.js').then(r => r.text()).then(t => {
  const useCloud = t.includes('isUsingCloud: true');
  console.log('Cloud Database:', useCloud ? '✅' : '❌');
});
```

---

### Test 1.3: PWA Manifest Validation

**Steps:**
1. Open DevTools (F12)
2. Go to Application tab
3. Click "Manifest" in left sidebar
4. Verify all properties load correctly

**Expected Results:**
- ✅ Manifest loads without errors
- ✅ App name: "Permahub Wiki"
- ✅ Short name: "Permahub"
- ✅ Start URL: `/Permahub/src/wiki/wiki-home.html`
- ✅ Display: "standalone"
- ✅ Theme color: #2d8659
- ✅ 8 icons listed

**Issues to Watch:**
- ❌ Manifest 404 error
- ❌ Invalid JSON in manifest
- ❌ Missing icons
- ❌ Incorrect paths

---

### Test 1.4: Service Worker Registration

**Steps:**
1. DevTools → Application tab
2. Click "Service Workers" in left sidebar
3. Verify Service Worker is registered and running

**Console Command:**
```javascript
navigator.serviceWorker.getRegistrations().then(r => {
  console.log('📋 Service Worker Registrations:', r.length);
  r.forEach(reg => console.log('  ✅ Registered:', reg.scope));
});
```

**Expected Results:**
- ✅ Service Worker shows "activated and running"
- ✅ Scope includes `/Permahub/src/wiki/`
- ✅ sw.js file loads without errors

**Issues to Watch:**
- ❌ Service Worker shows "waiting to activate"
- ❌ 404 error on sw.js
- ❌ Registration script errors in console

---

### Test 1.5: Cache Storage

**Steps:**
1. DevTools → Application tab
2. Click "Cache Storage" in left sidebar
3. Expand cache entry
4. Verify files are cached

**Console Command:**
```javascript
caches.keys().then(names => {
  console.log('📦 Cache Names:', names);
  names.forEach(name => {
    caches.open(name).then(cache => {
      cache.keys().then(requests => {
        console.log(`  💾 "${name}": ${requests.length} files cached`);
        requests.slice(0, 5).forEach(r => console.log('     -', r.url.split('/').pop()));
      });
    });
  });
});
```

**Expected Results:**
- ✅ Cache named `permahub-wiki-v1` exists
- ✅ Cache contains 10+ files:
  - offline.html
  - wiki-home.html
  - wiki-events.html
  - wiki-map.html
  - Images and CSS
  - Icons

**Issues to Watch:**
- ❌ No caches listed
- ❌ Cache is empty
- ❌ Old cache versions not cleaned up

---

## ✅ Phase 2: Offline Functionality Test

### Test 2.1: Offline Mode (Cached Content)

**Steps:**
1. DevTools → Network tab
2. Check "Offline" checkbox (top left)
3. The wiki should still work
4. Navigate between pages you've already visited

**Expected Results:**
- ✅ Wiki home page still displays
- ✅ Data is cached from first load
- ✅ Guides, events, locations visible
- ✅ Navigation works
- ✅ No network errors

**Issues to Watch:**
- ❌ Page shows "Page offline"
- ❌ Content disappears
- ❌ Navigation fails

---

### Test 2.2: Offline Mode (Uncached Content)

**Steps:**
1. Still in Offline mode
2. Try to navigate to a page you haven't visited yet
3. E.g., click on a specific guide or event you haven't viewed

**Expected Results:**
- ✅ Offline fallback page displays
- ✅ Shows friendly message: "You're Offline"
- ✅ Explains that page wasn't cached
- ✅ Suggests going back or caching first

---

### Test 2.3: Online Notification

**Steps:**
1. While offline, turn off "Offline" checkbox in Network tab
2. Watch for notification in bottom-right corner

**Expected Results:**
- ✅ Notification appears: "Connection restored"
- ✅ Green background (success color)
- ✅ Auto-disappears after 5 seconds
- ✅ Page auto-reloads if needed

---

## ✅ Phase 3: PWA Installation Test - iOS

### Prerequisites
- iPhone or iPad with iOS 11.3+
- Safari browser
- Same WiFi network as Mac (or just use the HTTPS URL)

### Test 3.1: iOS Installation via Home Screen

**Steps:**

1. **Open Safari on iPhone**
   - Launch Safari
   - Go to: `https://lballaty.github.io/Permahub/src/wiki/wiki-home.html`
   - Wait for page to fully load

2. **Tap Share Button**
   - Look for share icon (square with arrow pointing up)
   - Location: Bottom center of screen (iPhone) or top right (iPad)
   - Tap it

3. **Find "Add to Home Screen"**
   - Look through the action menu
   - May need to scroll down
   - Tap "Add to Home Screen" option

4. **Confirm App Details**
   - Name shows as "Permahub"
   - Icon shows the green leaf icon
   - URL shows: `lballaty.github.io/Permahub/src/wiki/wiki-home.html`
   - Tap "Add" button

5. **Launch App**
   - Go to home screen
   - Look for new Permahub icon
   - Tap to launch
   - Should open in full-screen mode (no Safari UI)

**Expected Results:**
- ✅ "Add to Home Screen" option appears
- ✅ App installs with Permahub icon
- ✅ App launches in standalone mode
- ✅ No browser address bar or tabs visible
- ✅ Page loads within 2 seconds
- ✅ All wiki content visible
- ✅ Navigation works

**Verification Checklist:**
- [ ] App name is "Permahub"
- [ ] Icon is green with leaf design
- [ ] App launches full-screen
- [ ] No Safari UI visible
- [ ] Guides grid loads
- [ ] Events grid loads
- [ ] Map displays
- [ ] Navigation menu works
- [ ] Data loads from Supabase

**Issues to Watch:**
- ❌ "Add to Home Screen" missing → Use Safari (not Chrome)
- ❌ App opens in Safari, not standalone → Check manifest.json
- ❌ Icon doesn't display → Check icon paths
- ❌ Service Worker errors → Check console in DevTools

### Test 3.2: Offline Mode on Installed App

**Steps:**

1. **Enable Airplane Mode**
   - Settings → Airplane Mode → On
   - WiFi will turn off

2. **Launch Permahub App**
   - Tap the Permahub icon
   - App should still launch and show cached content

3. **Verify Cached Content**
   - Check that wiki home page displays
   - Guides, events, locations visible
   - Navigation works between cached pages

4. **Disable Airplane Mode**
   - Settings → Airplane Mode → Off
   - Connection restored notification should appear
   - Data should sync from Supabase

**Expected Results:**
- ✅ App launches in airplane mode
- ✅ Cached content displays
- ✅ "You're Offline" fallback for uncached pages
- ✅ Connection restored notification when online
- ✅ Data syncs when connection restored

---

## ✅ Phase 4: PWA Installation Test - macOS

### Prerequisites
- Mac with Safari 13+ or Chrome/Edge
- HTTPS connection (GitHub Pages URL works)

### Test 4.1: macOS Safari Installation

**Steps:**

1. **Open Safari**
   - Launch Safari
   - Navigate to: `https://lballaty.github.io/Permahub/src/wiki/wiki-home.html`
   - Wait for full load

2. **Add to Dock**
   - Click File menu (top)
   - Select Share
   - Click "Add to Dock"

3. **Verify Installation**
   - Check Dock for Permahub icon
   - Should have green leaf icon

4. **Launch App**
   - Click Permahub icon in Dock
   - App should open in standalone window
   - No address bar or browser UI

**Expected Results:**
- ✅ "Add to Dock" option appears in File menu
- ✅ Icon appears in Dock
- ✅ App launches in standalone window
- ✅ Title bar shows "Permahub"
- ✅ No browser tabs or address bar
- ✅ All content loads and displays

**Verification Checklist:**
- [ ] Icon appears in Dock
- [ ] App window has correct title
- [ ] No Safari browser UI
- [ ] Content fully loads
- [ ] Navigation works
- [ ] Database connected (Cloud Supabase)

### Test 4.2: Alternative - Add to Applications

**Steps:**

1. **Safari → File → Share**
2. **Select "Add to Applications Folder"**
3. **Access from Applications**
   - Open Finder
   - Applications folder
   - Find Permahub.app
   - Double-click to launch

---

### Test 4.3: macOS Chrome/Edge Installation

**Steps:**

1. **Open Chrome or Edge**
   - Navigate to: `https://lballaty.github.io/Permahub/src/wiki/wiki-home.html`

2. **Look for Install Icon**
   - Chrome: ⊕ icon in address bar (right side)
   - Edge: Download icon in address bar
   - Or click three-dot menu and select "Install Permahub Wiki..."

3. **Click Install**
   - Dialog appears asking to confirm
   - Click Install button

4. **Launch App**
   - App opens immediately in new window
   - Or access from Applications folder
   - Or from browser's apps page (chrome://apps)

**Expected Results:**
- ✅ Install icon/option appears
- ✅ App installs successfully
- ✅ Standalone window opens
- ✅ Content loads and displays
- ✅ All features work

---

## ✅ Phase 5: PWA Installation Verification

### Test 5.1: Check Installation Status (After Installing)

**In browser console, run:**
```javascript
console.log('📱 PWA Status:');
console.log('  Is Installed:', window.PWA?.isInstalledPWA?.() ?? 'N/A');
console.log('  Status:', window.PWA?.getInstallationStatus?.() ?? 'N/A');
console.log('  Display Mode:', window.matchMedia('(display-mode: standalone)').matches);
```

**Expected Results for Installed App:**
- Is Installed: `true`
- Status: `installed`
- Display Mode: `true`

**Expected Results for Browser:**
- Is Installed: `false`
- Status: `installable`
- Display Mode: `false`

---

## 🧪 Phase 6: Lighthouse PWA Audit

### Steps:

1. **Open DevTools** (F12 or Cmd+Option+I)
2. **Go to Lighthouse tab** (or use menu → More tools → Lighthouse)
3. **Select "Progressive Web App"**
4. **Click "Analyze page load"**
5. **Wait for audit** (~30 seconds)

**Expected Score: 90+**

### Key Items to Check:
- ✅ Installable
- ✅ Uses HTTPS (GitHub Pages does)
- ✅ Service Worker registered
- ✅ Web app manifest
- ✅ Icons/Screenshots present
- ✅ Viewport configured
- ✅ Mobile-friendly

---

## 📋 Complete Testing Checklist

### Core PWA Features
- [ ] Service Worker registers successfully
- [ ] Manifest loads with correct properties
- [ ] 8 icons present in manifest
- [ ] Theme color: #2d8659
- [ ] Display mode: "standalone"
- [ ] Cache Storage contains files
- [ ] Offline fallback page works

### Database Functionality
- [ ] Page loads from GitHub Pages URL
- [ ] Database auto-detects Cloud Supabase
- [ ] Guides load from database
- [ ] Events load from database
- [ ] Locations load from database
- [ ] Map displays location markers
- [ ] No CORS errors in console
- [ ] No database connection errors

### Offline Functionality
- [ ] Offline mode works with cached content
- [ ] Offline fallback displays for uncached pages
- [ ] Connection restored notification shows
- [ ] Page reloads when connection restored

### iOS Installation
- [ ] Add to Home Screen works
- [ ] App launches in standalone mode
- [ ] Icon displays correctly
- [ ] Content loads on iOS
- [ ] Navigation works
- [ ] Offline mode works
- [ ] Lighthouse PWA score 90+

### macOS Installation
- [ ] Safari: Add to Dock works
- [ ] Chrome/Edge: Install option appears
- [ ] App launches in standalone window
- [ ] Content fully loads
- [ ] All features work
- [ ] Navigation functional
- [ ] Database connected

---

## 🚨 Troubleshooting

### Issue: Service Worker Not Registering

**Debug Steps:**
1. Check DevTools → Application → Service Workers
2. Look for errors in console (F12)
3. Check that sw.js is accessible:
   ```javascript
   fetch('/Permahub/src/sw.js').then(r => console.log('SW status:', r.status));
   ```
4. Check manifest paths in HTML files

**Common Causes:**
- Service Worker file doesn't exist at /Permahub/src/sw.js
- Incorrect script paths in HTML files
- HTTPS required (GitHub Pages is HTTPS ✅)

---

### Issue: Icons Not Displaying

**Debug Steps:**
1. Check DevTools → Application → Manifest
2. Verify each icon URL is correct
3. Test icon path:
   ```javascript
   fetch('/Permahub/icons/icon-192x192.png').then(r => console.log('Icon status:', r.status));
   ```

**Common Causes:**
- Icon paths don't include `/Permahub/` prefix
- Icon files not in dist/icons/
- Incorrect file names

---

### Issue: Database Not Loading

**Debug Steps:**
1. Check console for network errors
2. Look for database auto-detection message
3. Check Supabase configuration:
   ```javascript
   import('../../src/js/config.js').then(m => {
     console.log('Using Cloud:', m.SUPABASE_CONFIG.isUsingCloud);
   });
   ```

**Common Causes:**
- Cloud Supabase URL not accessible
- Incorrect anon key
- CORS configuration (Supabase is configured for external access ✅)

---

### Issue: "Add to Home Screen" Missing on iOS

**Solutions:**
1. Must use Safari browser (not Chrome/Firefox)
2. Must be on HTTPS or localhost
3. Service Worker must be registered
4. Manifest must be valid
5. Clear Safari cache and try again:
   - Settings → Safari → Advanced → Website Data
   - Find the site and delete data
   - Reload page and try again

---

### Issue: App Opens in Browser, Not Standalone

**Solutions:**
1. Delete app from home screen
2. Clear Safari cache completely
3. Check manifest.json has `display: "standalone"`
4. Reinstall app

---

## 📝 Testing Notes

**Date:** 2025-11-26
**Tester:** [Your name]
**Device/Browser:** [Your setup]

### Test Results:

**Phase 1 - Basic Functionality:**
- [ ] All tests passed
- [ ] Issues found: [List any issues]

**Phase 2 - Offline Functionality:**
- [ ] All tests passed
- [ ] Issues found: [List any issues]

**Phase 3 - iOS Installation:**
- [ ] All tests passed
- [ ] Issues found: [List any issues]

**Phase 4 - macOS Installation:**
- [ ] All tests passed
- [ ] Issues found: [List any issues]

**Phase 5 - Installation Verification:**
- [ ] All tests passed
- [ ] Issues found: [List any issues]

**Phase 6 - Lighthouse Audit:**
- [ ] Score: __ / 100
- [ ] All critical items passed
- [ ] Issues found: [List any issues]

---

## 🎯 Success Criteria

PWA implementation is successful when:

- [x] Committed to GitHub
- [x] All files in production build
- [ ] Service Worker registers on GitHub Pages
- [ ] Database connects and loads data
- [ ] Offline mode works
- [ ] iOS installation works
- [ ] macOS installation works
- [ ] Lighthouse PWA score 90+
- [ ] All checklist items completed

---

**Status:** Ready for Testing

**Next Steps:** Run through all test phases above and document results

