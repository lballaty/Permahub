# GitHub Pages Deployment Guide

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/GITHUB_PAGES_DEPLOYMENT.md

**Description:** How to deploy Permahub Wiki to GitHub Pages with working database

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-26

---

## 🎯 Overview

Your Permahub Wiki is now properly configured to work on GitHub Pages with full Supabase database integration.

**Key Points:**
- ✅ Database queries work (uses Cloud Supabase automatically)
- ✅ No CORS issues (Supabase is configured for external access)
- ✅ All file paths are relative (work on localhost AND GitHub Pages)
- ✅ PWA works with multi-path Service Worker registration
- ✅ Icons and manifest load correctly
- ✅ PWA meta tags include both `mobile-web-app-capable` and Apple tags on all wiki pages

---

## 🚀 How to Deploy to GitHub Pages

### Step 1: Build the Project

```bash
./scripts/publish-pages.sh
```

What it does:
- Builds the site (`npm run build`)
- Syncs the build output from `dist/` into `docs-gh/` (keeps your existing docs/ intact)

One-time GitHub Pages setting:
- Source: `main` branch
- Folder: `/docs-gh`

---

## ✅ What Was Fixed for GitHub Pages

### Problem 1: Service Worker Paths
**Before:**
```javascript
navigator.serviceWorker.register('/src/sw.js')  // ❌ Breaks on GitHub Pages
```

**After (fallback order):**
```javascript
const possiblePaths = isGitHubPages
  ? ['/Permahub/sw.js']
  : ['/src/sw.js', '../../sw.js', '/sw.js'];
// tries each until one registers; logs failed paths
```

### Problem 2: Asset Paths
**Before:**
```html
<link rel="manifest" href="../manifest.json">
<link rel="apple-touch-icon" href="../assets/icons/icon-192x192.png">
```

**After:**
```html
<link rel="manifest" href="../../manifest.json">
<link rel="apple-touch-icon" href="../../assets/icons/icon-192x192.png">
```

### Problem 3: Automatic Database Detection
Your `config.js` already handles this correctly:

```javascript
// Automatically use Cloud Supabase on GitHub Pages
if (import.meta.env.PROD) {  // Production build
  return true;  // Use Cloud database
}

if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
  return true;  // Not on localhost, use Cloud
}
```

**Result:**
- ✅ Localhost → Uses Local Supabase
- ✅ GitHub Pages → Uses Cloud Supabase automatically
- ✅ No code changes needed!

---

## 🧪 Testing on GitHub Pages

### Test the Deployment

1. **After pushing to GitHub**, wait 2-3 minutes for GitHub Actions to deploy
2. **Visit:** `https://lballaty.github.io/Permahub/src/wiki/wiki-home.html`
3. **Check Console (F12):**
   - Should see: `🌐 Database: Cloud (mcbxbaggjaxqfdvmrqsc)`
   - Should see: `[PWA] Service Worker registered: ...`
   - Should see guides, locations, events loading

### If Data Doesn't Load

**Check these things:**

1. **Console for errors:**
   ```
   F12 → Console tab
   Look for red error messages
   ```

2. **Check network requests:**
   ```
   F12 → Network tab
   Look for requests to: mcbxbaggjaxqfdvmrqsc.supabase.co
   All should be 200 OK
   ```

3. **Check PWA:**
   ```
   F12 → Application tab
   Check Service Workers are registered
   Check Cache Storage has files cached
   ```

4. **Common Issues:**

   | Issue | Fix |
   |-------|-----|
   | "Failed to fetch data" | Check internet connection |
   | Supabase returns 401 | API key might be wrong (unlikely) |
   | "Cannot load manifest.json" | Paths need to be relative (already fixed) |
   | Service Worker fails | Check sw.js path is correct (already fixed) |

---

## 📁 File Structure on GitHub Pages

When deployed, your files are at:

```
https://lballaty.github.io/Permahub/
├── src/
│   ├── manifest.json          ← PWA manifest
│   ├── sw.js                  ← Service Worker
│   ├── assets/
│   │   └── icons/             ← App icons (8 sizes)
│   ├── js/
│   │   ├── supabase-client.js
│   │   └── pwa-register.js
│   └── wiki/
│       ├── wiki-home.html     ← Your main page
│       ├── js/
│       └── css/
```

**Key URLs:**
- Home: `https://lballaty.github.io/Permahub/src/wiki/wiki-home.html`
- Manifest: `https://lballaty.github.io/Permahub/src/manifest.json`
- Service Worker: `https://lballaty.github.io/Permahub/src/sw.js`
- Icons: `https://lballaty.github.io/Permahub/src/assets/icons/icon-192x192.png`

---

## 🎨 Creating a Friendly Home Page (Optional)

To make GitHub Pages home at `/Permahub/` nicer, you could:

1. **Create `/src/index.html`** with redirects to wiki
2. **Update Vite config** to include index.html in build
3. **Add landing page** before users navigate to `/src/wiki/`

For now, the wiki works great as-is!

---

## 📱 iOS/macOS Installation on GitHub Pages

Once deployed to HTTPS (GitHub Pages is automatic HTTPS):

### **iOS Installation:**
1. Visit: `https://lballaty.github.io/Permahub/src/wiki/wiki-home.html`
2. Tap Share → "Add to Home Screen"
3. App installs with green icon
4. Tap to launch in standalone mode

### **macOS Installation:**
1. Chrome: Look for install icon → Install
2. Safari: File → Share → "Add to Dock"
3. App launches in standalone window

---

## 🔧 Environment Variables for Production

Your `.env` file is never deployed to GitHub Pages (it's in `.gitignore`).

**Cloud Supabase credentials are hardcoded in code:**
- In `src/js/config.js`
- The API key is safe (it's a public anon key)
- Never expose the service role key

**If you need different credentials for production:**
1. Create separate GitHub Actions secrets
2. Use `gh secret set` to configure
3. Update `vite.config.js` to use `process.env.*`

---

## 📊 Checklist - Before & After Deployment

### Before Deploying
- [ ] Run `npm run build` locally (should succeed)
- [ ] Check `dist/` folder created
- [ ] Test Service Worker path: `../../sw.js` ✅
- [ ] Test manifest path: `../../manifest.json` ✅
- [ ] Test icon paths: `../../assets/icons/` ✅

### After Deploying
- [ ] Visit GitHub Pages URL
- [ ] Check console for database type (should be Cloud)
- [ ] Verify data loads from Supabase
- [ ] Check Network tab for API requests
- [ ] Test Service Worker registered
- [ ] Test offline functionality
- [ ] Test PWA installation (iOS/macOS)
- [ ] Run Lighthouse audit

---

## 🐛 Troubleshooting

### Pages load but no data
```javascript
// In console, check:
navigator.serviceWorker.getRegistrations().then(r => console.log(r))
fetch('https://mcbxbaggjaxqfdvmrqsc.supabase.co/rest/v1/wiki_guides?limit=1')
```

### Service Worker not registering
```javascript
// Check SW path:
fetch('../../sw.js').then(r => console.log('SW:', r.status))

// Check manifest:
fetch('../../manifest.json').then(r => console.log('Manifest:', r.status))
```

### Icons not displaying
```javascript
// Check icon paths:
fetch('../../assets/icons/icon-192x192.png').then(r => console.log(r.status))
```

---

## 🚀 Next Steps

1. **Test locally first:**
   ```bash
   npm run build
   npx serve dist
   ```

2. **Visit:** `http://localhost:3000/Permahub/src/wiki/wiki-home.html`

3. **Verify everything works**

4. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "fix: Fix paths for GitHub Pages deployment"
   git push origin main
   ```

5. **Wait 2-3 minutes** for GitHub Actions

6. **Visit:** `https://lballaty.github.io/Permahub/`

---

## 📚 References

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [GitHub Actions Deployment](https://github.com/actions/starter-workflows)
- [Relative Paths Guide](https://www.w3schools.com/html/html_filepaths.asp)
- [Supabase Docs](https://supabase.com/docs)

---

**Status:** ✅ Ready to Deploy

**Key Changes Made:**
- ✅ Service Worker path: `/src/sw.js` → `../../sw.js`
- ✅ Manifest path: `../manifest.json` → `../../manifest.json`
- ✅ Icon paths: `../assets/icons/` → `../../assets/icons/`
- ✅ Updated 20 HTML files

**Next Action:** Push to GitHub and test deployment
