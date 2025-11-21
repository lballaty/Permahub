# PWA Installation Guide - iOS & macOS

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/processes/PWA_INSTALLATION_GUIDE.md

**Description:** Step-by-step guide to install Permahub Wiki as a PWA on iOS and macOS

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-01-20

---

## ✅ Implementation Complete!

All PWA core features are now implemented:

- ✅ Web App Manifest created
- ✅ App icons generated (8 sizes)
- ✅ PWA meta tags added to all 20 wiki HTML files
- ✅ Service Worker created with caching strategies
- ✅ Offline fallback page created
- ✅ Service Worker registration added to all pages

---

## 🚀 Quick Start - Deploy and Test

### Step 1: Deploy to HTTPS Server

**PWAs require HTTPS!** Choose one option:

#### Option A: Deploy to Vercel (Recommended)

```bash
# From project root
npm install -g vercel
vercel --prod
```

This will give you an HTTPS URL like: `https://permahub-xxxxx.vercel.app`

#### Option B: Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Option C: Test Locally with Dev Server

```bash
# Start your dev server (runs on localhost:3001)
./start.sh
```

**Note:** Service Worker works on `http://localhost` without HTTPS

---

## 📱 iOS Installation (iPhone/iPad)

### Requirements
- iOS 11.3 or later
- Safari browser
- Deployed to HTTPS (or localhost for testing)

### Installation Steps

1. **Open Safari** on your iPhone/iPad
   - Open Safari (NOT Chrome or other browsers)
   - Navigate to your wiki URL: `https://your-domain.com/src/wiki/wiki-home.html`

2. **Tap the Share Button**
   - Look for the share icon in Safari (square with arrow pointing up)
   - It's at the bottom center of the screen (iPhone) or top right (iPad)

3. **Select "Add to Home Screen"**
   - Scroll down in the share menu
   - Tap "Add to Home Screen" option
   - You'll see the app icon and name

4. **Customize and Add**
   - App name shows as "Permahub" (you can edit it)
   - App icon shows your green leaf icon
   - Tap "Add" in the top right corner

5. **Launch the App**
   - Find the Permahub icon on your home screen
   - Tap to launch
   - App opens in standalone mode (no Safari UI)

### iOS Installation Screenshots

```
Step 1: Tap Share         Step 2: Scroll Down       Step 3: Tap Add
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   ⬆️ Share      │      │                 │      │  Permahub      │
│                 │      │  Add to         │      │  🌱             │
│  Actions:       │      │  Home Screen    │      │                 │
│  ✉️ Message      │  →   │                 │  →   │  [Permahub]    │
│  📋 Copy         │      │  Add Bookmark   │      │                 │
│  📱 AirDrop      │      │  Find on Page   │      │  [Add]         │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

### Verification

✅ **App installed successfully if:**
- Icon appears on home screen
- Tapping icon opens app without Safari UI
- No address bar or browser controls
- Splash screen shows briefly (green background)
- Status bar shows app title "Permahub"

---

## 💻 macOS Installation (Safari)

### Requirements
- macOS 10.14 (Mojave) or later
- Safari 13 or later
- Deployed to HTTPS (or localhost for testing)

### Installation Steps

1. **Open Safari**
   - Launch Safari on your Mac
   - Navigate to: `https://your-domain.com/src/wiki/wiki-home.html`

2. **Add to Dock**
   - Click **File** menu
   - Click **Share**
   - Select **Add to Dock**

3. **Launch the App**
   - Find Permahub icon in your Dock
   - Click to launch
   - App opens in standalone window

### Alternative: Add to Applications

1. **Using Safari**
   - Visit the wiki home page
   - File → Share → Add to Applications Folder

2. **Launch from Applications**
   - Open Finder → Applications
   - Find Permahub.app
   - Double-click to launch

### Verification

✅ **App installed successfully if:**
- Icon appears in Dock or Applications folder
- Launches as standalone app (no address bar)
- Window title shows "Permahub Wiki"
- Behaves like a native app

---

## 🖥️ macOS Installation (Chrome/Edge)

Chrome and Edge have better PWA support than Safari on macOS.

### Installation Steps

1. **Open Chrome or Edge**
   - Navigate to: `https://your-domain.com/src/wiki/wiki-home.html`

2. **Look for Install Icon**
   - Chrome: Look for ⊕ icon in address bar (right side)
   - Edge: Look for download icon in address bar
   - OR click the three-dot menu → "Install Permahub Wiki..."

3. **Click Install**
   - Dialog appears: "Install app?"
   - Click **Install** button

4. **Launch the App**
   - App opens immediately in new window
   - Find icon in Applications folder
   - Or launch from Chrome's Apps page: `chrome://apps`

### Verification

✅ **App installed successfully if:**
- Standalone window opens (no browser tabs)
- Window controls (minimize, maximize, close) present
- App icon in Applications folder
- Can launch independently of browser

---

## 🧪 Testing Checklist

### Basic Functionality
- [ ] PWA installs successfully
- [ ] App launches in standalone mode (no browser UI)
- [ ] App icon displays correctly
- [ ] Navigation between pages works
- [ ] Supabase data loads
- [ ] Login/signup works
- [ ] Content creation works

### Offline Functionality
- [ ] Service Worker registers (check console)
- [ ] Pages cache after first visit
- [ ] Cached pages load when offline
- [ ] Offline page shows for uncached content
- [ ] Online notification appears when reconnected

### Update Flow
- [ ] Update notification shows when new version deployed
- [ ] "Update Now" button refreshes app
- [ ] Cache clears on update

---

## 🔍 Troubleshooting

### iOS Issues

**Issue:** "Add to Home Screen" option missing
- **Fix:** Must use Safari browser (not Chrome/Firefox)
- **Fix:** Check that you're on HTTPS (or localhost)

**Issue:** App opens in Safari, not standalone
- **Fix:** Delete and reinstall from home screen
- **Fix:** Check manifest.json is accessible
- **Fix:** Verify display: "standalone" in manifest

**Issue:** Icon doesn't display
- **Fix:** Check icon paths in manifest.json
- **Fix:** Verify icon files exist at `/src/assets/icons/`
- **Fix:** Clear Safari cache and reinstall

**Issue:** Service Worker not registering
- **Fix:** iOS Safari has limited Service Worker support
- **Fix:** Check console for errors: Settings → Safari → Advanced → Web Inspector
- **Fix:** Verify sw.js is accessible at `/src/sw.js`

### macOS Safari Issues

**Issue:** "Add to Dock" option missing
- **Fix:** Update to Safari 13+
- **Fix:** Check that you're on HTTPS (or localhost)

**Issue:** App doesn't launch standalone
- **Fix:** Try Chrome or Edge instead (better PWA support)
- **Fix:** Check manifest.json display mode

**Issue:** Service Worker fails
- **Fix:** Check Safari → Develop → Show Web Inspector → Console
- **Fix:** Verify sw.js loads without errors

### macOS Chrome/Edge Issues

**Issue:** Install icon doesn't appear
- **Fix:** Refresh page and wait a few seconds
- **Fix:** Check Lighthouse audit (DevTools → Lighthouse → PWA)
- **Fix:** Verify manifest and Service Worker registered

**Issue:** Install button grayed out
- **Fix:** PWA requirements not met (run Lighthouse audit)
- **Fix:** Check console for errors
- **Fix:** Verify HTTPS enabled

---

## 🛠️ Developer Tools

### Check PWA Status in Chrome

1. **Open DevTools** (F12 or Cmd+Option+I)
2. **Go to Application Tab**
3. **Check sections:**
   - **Manifest**: Should show Permahub Wiki details
   - **Service Workers**: Should show "Activated and running"
   - **Cache Storage**: Should show cached files
   - **Storage**: Shows localStorage/sessionStorage

### Run Lighthouse Audit

1. **Open DevTools**
2. **Go to Lighthouse Tab**
3. **Select "Progressive Web App"**
4. **Click "Analyze page load"**
5. **Target Score: 90+**

### Common Lighthouse Issues

| Issue | Fix |
|-------|-----|
| "No manifest found" | Check `<link rel="manifest">` in HTML |
| "Service worker not registered" | Check console for SW errors |
| "Icons not found" | Verify paths in manifest.json |
| "Not installable" | Run PWA audit, check requirements |
| "No HTTPS" | Deploy to hosting with SSL |

---

## 📊 PWA Features Status

| Feature | iOS | macOS Safari | macOS Chrome/Edge |
|---------|-----|--------------|-------------------|
| Install to Home Screen | ✅ | ✅ | ✅ |
| Standalone Mode | ✅ | ✅ | ✅ |
| App Icon | ✅ | ✅ | ✅ |
| Splash Screen | ✅ | ❌ | ✅ |
| Service Worker | ⚠️ Limited | ⚠️ Limited | ✅ Full |
| Offline Support | ⚠️ Limited | ⚠️ Limited | ✅ Full |
| Background Sync | ❌ | ❌ | ✅ |
| Push Notifications | ❌ | ❌ | ✅ |
| Install Prompt | ❌ Manual | ❌ Manual | ✅ Automatic |

**Legend:**
- ✅ Full support
- ⚠️ Partial support
- ❌ Not supported

---

## 📝 Testing URLs

### Local Testing
```
http://localhost:3001/src/wiki/wiki-home.html
```

### Vercel Deployment
```
https://permahub-xxxxx.vercel.app/src/wiki/wiki-home.html
```

### Netlify Deployment
```
https://permahub-xxxxx.netlify.app/src/wiki/wiki-home.html
```

---

## 🎯 Next Steps

### After Successful Installation

1. **Test all wiki features**
   - Browse guides, events, locations
   - Create new content
   - Edit existing content
   - Use map
   - Test favorites

2. **Test offline mode**
   - Turn on Airplane Mode
   - Navigate to cached pages
   - Verify offline fallback shows for uncached pages
   - Turn off Airplane Mode
   - Verify data syncs

3. **Share with testers**
   - Send installation instructions
   - Collect feedback
   - Track any issues

### Optional Enhancements

- [ ] Create custom splash screen image
- [ ] Add app shortcuts (deep links to guides/events/map)
- [ ] Add screenshots to manifest for app stores
- [ ] Implement push notifications
- [ ] Add background sync for offline edits
- [ ] Submit to iOS App Store (with wrapper)
- [ ] Submit to Google Play Store (with wrapper)

---

## 📚 Resources

### PWA Documentation
- [Apple: Configuring Web Applications](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [Google: Progressive Web Apps](https://web.dev/progressive-web-apps/)
- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

### Testing Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [PWA Builder](https://www.pwabuilder.com/)
- [Maskable.app](https://maskable.app/) - Test icon safe zones

### Debugging
- [Safari Web Inspector](https://developer.apple.com/safari/tools/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [iOS Simulator](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device)

---

## ✅ Success Criteria

Your PWA is ready for iOS/macOS when:

- [x] Manifest.json created and accessible
- [x] All icons generated and referenced
- [x] PWA meta tags in all HTML files
- [x] Service Worker registered and caching
- [x] Offline page functional
- [ ] Deployed to HTTPS hosting
- [ ] Tested on iOS device
- [ ] Tested on macOS Safari
- [ ] Tested on macOS Chrome
- [ ] Lighthouse PWA score 90+

---

**Status:** 🎉 Core implementation complete - Ready to deploy and test!

**Created:** 2025-01-20

**Next Action:** Deploy to HTTPS and test installation on iOS/macOS
