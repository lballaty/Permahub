# Electron App Implementation Plan

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/processes/ELECTRON_APP_IMPLEMENTATION_PLAN.md

**Description:** Comprehensive plan for converting Permahub Wiki to Electron desktop application

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-01-16

**Last Updated:** 2025-01-16

**Last Updated By:** Libor Ballaty <libor@arionetworks.com>

---

## 🎯 Project Goal

Create an Electron desktop application version of Permahub Wiki that:
- Works on Windows and macOS (desktop/laptop)
- Connects to existing Supabase database over internet (same as web version)
- Allows distribution to testers without requiring web hosting
- Maintains feature parity with web version
- Tracks version alignment between Electron and Web releases

---

## 📋 Project Scope

### In Scope (This Plan)
- ✅ Electron app for Windows desktop
- ✅ Electron app for macOS desktop
- ✅ Version tracking system
- ✅ Development testing workflow
- ✅ Production build and packaging
- ✅ Tester distribution documentation

### Out of Scope (Future Projects)
- ❌ iOS mobile app (requires different technology - Capacitor/React Native)
- ❌ Android mobile app (requires different technology - Capacitor/React Native)
- ❌ Linux desktop app (can be added later if needed)
- ❌ Offline functionality (app requires internet like web version)

---

## 🏗️ Technical Architecture

### Current Web Architecture
```
User Browser → HTML/CSS/JS → Supabase API → PostgreSQL Database
                    ↑
              Hosted on Vercel/Netlify
```

### Electron Architecture
```
Electron App (Desktop Window) → HTML/CSS/JS → Supabase API → PostgreSQL Database
                    ↑
              Bundled in .exe/.dmg file
```

**Key Point:** Same codebase, same database, same internet requirement. Only difference is delivery mechanism.

---

## 📦 Technology Stack

### Existing (Keep)
- Vanilla JavaScript (ES6+)
- HTML5 + CSS3
- Vite (build tool)
- Supabase (backend)
- Leaflet.js (maps)
- Quill (rich text editor)
- Font Awesome (icons)

### New (Add)
- **Electron** - Desktop app framework
- **electron-builder** - Packaging and installer creation
- **Capacitor** (future) - Mobile app framework (iOS/Android)

---

## 🗂️ Project Structure (After Implementation)

```
/Permahub
├── electron/
│   ├── main.js                    # Electron main process
│   ├── preload.js                 # Security bridge (if needed)
│   └── icon.png                   # Application icon
├── src/
│   ├── wiki/                      # Existing wiki files
│   │   ├── *.html (13 files)
│   │   ├── js/*.js
│   │   └── css/wiki.css
│   ├── assets/                    # Local dependencies
│   │   ├── fontawesome/           # Font Awesome (downloaded)
│   │   ├── leaflet/               # Leaflet (downloaded)
│   │   └── quill/                 # Quill (downloaded)
│   └── version.json               # Version tracking file
├── package.json                   # Updated with Electron scripts
├── vite.config.electron.js        # Electron-specific build config
└── docs/
    └── processes/
        ├── ELECTRON_APP_IMPLEMENTATION_PLAN.md (this file)
        └── ELECTRON_TESTER_GUIDE.md (to be created)
```

---

## ✅ Implementation Phases

---

## **PHASE 1: Version Tracking & Setup**

### Task 1.1: Create Version Tracking System
**Status:** ⏳ Pending
**Time Estimate:** 30 minutes
**Dependencies:** None

**Objective:** Establish version tracking to keep Electron and Web releases aligned

**Steps:**
1. Create `/src/version.json` file with schema:
   ```json
   {
     "app": "Permahub Wiki",
     "version": "1.0.0",
     "platform": "electron",
     "webVersion": "1.0.0",
     "releaseDate": "2025-01-16",
     "buildDate": "",
     "changelog": [
       "Initial Electron release"
     ]
   }
   ```

2. Create version display component in wiki footer:
   - Show version number
   - Show last sync date with web version
   - Add "About" modal with full version info

3. Document version update process in this file (see Appendix A)

**Acceptance Criteria:**
- [ ] version.json file created
- [ ] Version displays in wiki footer
- [ ] Version update process documented

**Files Modified:**
- NEW: `/src/version.json`
- MODIFIED: `/src/wiki/wiki-home.html` (add version display)
- MODIFIED: `/src/wiki/js/wiki.js` (load and display version)

---

### Task 1.2: Research Electron Compatibility
**Status:** ⏳ Pending
**Time Estimate:** 1 hour
**Dependencies:** None

**Objective:** Verify current codebase works with Electron with minimal changes

**Research Areas:**
1. **Supabase Client Compatibility:**
   - Test if current `/src/js/supabase-client.js` works in Electron
   - Verify fetch() API works in Electron renderer process
   - Check CORS policies for Supabase API

2. **CDN Dependencies:**
   - Test if CDN links work in Electron (may require local bundling)
   - Font Awesome, Leaflet, Quill compatibility

3. **File Protocol Issues:**
   - Test if `file://` protocol works with current routing
   - Check localStorage/sessionStorage compatibility
   - Verify external links open in system browser

4. **Security Policies:**
   - Research Content Security Policy (CSP) requirements
   - Check if current code needs nodeIntegration or contextIsolation

**Deliverable:** Research document with findings and required changes

**Acceptance Criteria:**
- [ ] Supabase client compatibility verified
- [ ] CDN dependency strategy decided
- [ ] File protocol issues identified
- [ ] Security configuration documented

---

### Task 1.3: Install Electron Dependencies
**Status:** ⏳ Pending
**Time Estimate:** 15 minutes
**Dependencies:** Task 1.2 complete

**Objective:** Add Electron to project dependencies

**Steps:**
1. Install Electron:
   ```bash
   npm install --save-dev electron
   ```

2. Install electron-builder for packaging:
   ```bash
   npm install --save-dev electron-builder
   ```

3. Verify installation:
   ```bash
   npx electron --version
   ```

**Acceptance Criteria:**
- [ ] Electron installed (check package.json)
- [ ] electron-builder installed
- [ ] Version command runs successfully

**Files Modified:**
- MODIFIED: `package.json` (devDependencies added)
- MODIFIED: `package-lock.json` (auto-generated)

---

### Task 1.4: Create Electron Main Process File
**Status:** ⏳ Pending
**Time Estimate:** 1 hour
**Dependencies:** Task 1.3 complete

**Objective:** Create the main Electron process that launches the wiki

**Steps:**
1. Create `/electron/main.js` with:
   - Window creation function
   - Load wiki-home.html on startup
   - Handle window events (close, minimize, etc.)
   - Configure security settings

2. Basic main.js template:
   ```javascript
   const { app, BrowserWindow } = require('electron');
   const path = require('path');

   function createWindow() {
     const mainWindow = new BrowserWindow({
       width: 1280,
       height: 800,
       webPreferences: {
         nodeIntegration: false,
         contextIsolation: true,
         preload: path.join(__dirname, 'preload.js')
       }
     });

     // Load the wiki home page
     mainWindow.loadFile('src/wiki/wiki-home.html');

     // Open DevTools in development
     if (process.env.NODE_ENV === 'development') {
       mainWindow.webContents.openDevTools();
     }
   }

   app.whenReady().then(() => {
     createWindow();

     app.on('activate', function () {
       if (BrowserWindow.getAllWindows().length === 0) createWindow();
     });
   });

   app.on('window-all-closed', function () {
     if (process.platform !== 'darwin') app.quit();
   });
   ```

3. Create `/electron/preload.js` (security bridge if needed)

**Acceptance Criteria:**
- [ ] main.js file created
- [ ] Window opens with correct dimensions
- [ ] Security settings configured
- [ ] Development mode shows DevTools

**Files Created:**
- NEW: `/electron/main.js`
- NEW: `/electron/preload.js`

---

### Task 1.5: Configure Electron Window Settings
**Status:** ⏳ Pending
**Time Estimate:** 30 minutes
**Dependencies:** Task 1.4 complete

**Objective:** Customize window appearance and behavior

**Settings to Configure:**
1. **Window Properties:**
   - Title: "Permahub Wiki"
   - Minimum size: 1024x768
   - Default size: 1280x800
   - Resizable: true
   - Fullscreen capable: true

2. **Menu Bar:**
   - macOS: Keep default menu with "About" info
   - Windows: Custom menu with File, Edit, View, Help
   - Add "Check for Updates" menu item (future feature)

3. **Icon:**
   - macOS: .icns file
   - Windows: .ico file
   - Linux: .png file (future)

4. **External Links:**
   - Configure to open in system browser (not in Electron)
   - Prevent navigation away from wiki pages

**Acceptance Criteria:**
- [ ] Window title shows "Permahub Wiki"
- [ ] Minimum size enforced
- [ ] Menu bar configured for both platforms
- [ ] External links open in browser

**Files Modified:**
- MODIFIED: `/electron/main.js`

---

### Task 1.6: Update package.json with Electron Scripts
**Status:** ⏳ Pending
**Time Estimate:** 30 minutes
**Dependencies:** Task 1.4 complete

**Objective:** Add npm scripts for running and building Electron app

**Scripts to Add:**
```json
{
  "scripts": {
    "electron:dev": "NODE_ENV=development electron .",
    "electron:build": "electron-builder",
    "electron:build:mac": "electron-builder --mac",
    "electron:build:win": "electron-builder --win",
    "electron:build:all": "electron-builder --mac --win"
  }
}
```

**electron-builder Configuration:**
```json
{
  "build": {
    "appId": "com.permahub.wiki",
    "productName": "Permahub Wiki",
    "directories": {
      "output": "dist-electron"
    },
    "files": [
      "src/**/*",
      "electron/**/*",
      "package.json"
    ],
    "mac": {
      "category": "public.app-category.education",
      "icon": "electron/icon.icns",
      "target": ["dmg", "zip"]
    },
    "win": {
      "icon": "electron/icon.ico",
      "target": ["nsis", "portable"]
    }
  }
}
```

**Acceptance Criteria:**
- [ ] Scripts added to package.json
- [ ] electron-builder config added
- [ ] Main entry point specified

**Files Modified:**
- MODIFIED: `package.json`

---

## **PHASE 2: Local Dependencies**

### Task 2.1: Download CDN Dependencies Locally
**Status:** ⏳ Pending
**Time Estimate:** 1 hour
**Dependencies:** Task 1.2 complete (know if needed)

**Objective:** Bundle external libraries locally instead of CDN

**Dependencies to Download:**

1. **Font Awesome 6.4.0**
   - Download from: https://fontawesome.com/download
   - Extract to: `/src/assets/fontawesome-6.4.0/`
   - Size: ~30MB

2. **Leaflet 1.9.4**
   - Download from: https://leafletjs.com/download.html
   - Extract to: `/src/assets/leaflet-1.9.4/`
   - Size: ~1MB

3. **Quill 1.3.7**
   - Download from: https://github.com/quilljs/quill/releases
   - Extract to: `/src/assets/quill-1.3.7/`
   - Size: ~500KB

**Steps:**
1. Create `/src/assets/` directory structure
2. Download each library
3. Extract to respective folders
4. Verify all required files present (CSS + JS)

**Acceptance Criteria:**
- [ ] All three libraries downloaded
- [ ] Files organized in /src/assets/
- [ ] Version numbers in folder names
- [ ] .gitignore updated (if needed)

**Files Created:**
- NEW: `/src/assets/fontawesome-6.4.0/`
- NEW: `/src/assets/leaflet-1.9.4/`
- NEW: `/src/assets/quill-1.3.7/`

---

### Task 2.2: Update HTML Files to Use Local Dependencies
**Status:** ⏳ Pending
**Time Estimate:** 2 hours
**Dependencies:** Task 2.1 complete

**Objective:** Change all CDN references to local file paths

**Files to Update (13 HTML files):**
1. wiki-home.html
2. wiki-guides.html
3. wiki-page.html
4. wiki-editor.html
5. wiki-events.html
6. wiki-map.html
7. wiki-favorites.html
8. wiki-login.html
9. wiki-signup.html
10. wiki-forgot-password.html
11. wiki-reset-password.html
12. wiki-admin.html
13. wiki-issues.html

**Changes Per File:**

**Before (CDN):**
```html
<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<!-- Leaflet (wiki-map.html only) -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<!-- Quill (wiki-editor.html only) -->
<link href="https://cdn.quilljs.com/1.3.7/quill.snow.css" rel="stylesheet">
<script src="https://cdn.quilljs.com/1.3.7/quill.min.js"></script>
```

**After (Local):**
```html
<!-- Font Awesome -->
<link rel="stylesheet" href="../assets/fontawesome-6.4.0/css/all.min.css">

<!-- Leaflet (wiki-map.html only) -->
<link rel="stylesheet" href="../assets/leaflet-1.9.4/dist/leaflet.css" />
<script src="../assets/leaflet-1.9.4/dist/leaflet.js"></script>

<!-- Quill (wiki-editor.html only) -->
<link href="../assets/quill-1.3.7/quill.snow.css" rel="stylesheet">
<script src="../assets/quill-1.3.7/quill.min.js"></script>
```

**Acceptance Criteria:**
- [ ] All 13 HTML files updated
- [ ] Font Awesome loads from local in all files
- [ ] Leaflet loads from local in wiki-map.html
- [ ] Quill loads from local in wiki-editor.html
- [ ] No CDN references remain

**Files Modified:**
- MODIFIED: All 13 `/src/wiki/*.html` files

---

### Task 2.3: Create Vite Build Configuration for Electron
**Status:** ⏳ Pending
**Time Estimate:** 1 hour
**Dependencies:** Task 2.2 complete

**Objective:** Configure Vite to bundle wiki pages for Electron

**Steps:**
1. Create `/vite.config.electron.js`:
   ```javascript
   import { defineConfig } from 'vite';
   import { resolve } from 'path';

   export default defineConfig({
     root: './src/wiki',
     base: './',
     publicDir: '../assets',

     build: {
       outDir: '../../dist-electron/wiki',
       emptyOutDir: true,
       rollupOptions: {
         input: {
           'wiki-home': resolve(__dirname, 'src/wiki/wiki-home.html'),
           'wiki-guides': resolve(__dirname, 'src/wiki/wiki-guides.html'),
           'wiki-page': resolve(__dirname, 'src/wiki/wiki-page.html'),
           'wiki-editor': resolve(__dirname, 'src/wiki/wiki-editor.html'),
           'wiki-events': resolve(__dirname, 'src/wiki/wiki-events.html'),
           'wiki-map': resolve(__dirname, 'src/wiki/wiki-map.html'),
           'wiki-favorites': resolve(__dirname, 'src/wiki/wiki-favorites.html'),
           'wiki-login': resolve(__dirname, 'src/wiki/wiki-login.html'),
           'wiki-signup': resolve(__dirname, 'src/wiki/wiki-signup.html'),
           'wiki-forgot-password': resolve(__dirname, 'src/wiki/wiki-forgot-password.html'),
           'wiki-reset-password': resolve(__dirname, 'src/wiki/wiki-reset-password.html'),
           'wiki-admin': resolve(__dirname, 'src/wiki/wiki-admin.html'),
           'wiki-issues': resolve(__dirname, 'src/wiki/wiki-issues.html')
         }
       }
     },

     server: {
       port: 3002
     }
   });
   ```

2. Add build script to package.json:
   ```json
   {
     "scripts": {
       "build:electron": "vite build --config vite.config.electron.js"
     }
   }
   ```

3. Update Electron main.js to load from dist-electron

**Acceptance Criteria:**
- [ ] vite.config.electron.js created
- [ ] All 13 HTML pages in input config
- [ ] Build script works without errors
- [ ] Output in dist-electron/wiki folder

**Files Created:**
- NEW: `/vite.config.electron.js`

**Files Modified:**
- MODIFIED: `package.json`
- MODIFIED: `/electron/main.js`

---

## **PHASE 3: Development Testing**

### Task 3.1: Test Electron App in Development Mode
**Status:** ⏳ Pending
**Time Estimate:** 30 minutes
**Dependencies:** All Phase 1 & 2 tasks complete

**Objective:** Launch Electron app and verify it opens

**Steps:**
1. Run development command:
   ```bash
   npm run electron:dev
   ```

2. Verify:
   - Window opens with wiki-home.html
   - DevTools open automatically
   - No console errors
   - Window is resizable
   - Title shows "Permahub Wiki"

3. Test basic navigation:
   - Click navigation links
   - Verify pages load
   - Check back button works

**Acceptance Criteria:**
- [ ] App launches without errors
- [ ] wiki-home.html displays correctly
- [ ] Navigation works between pages
- [ ] DevTools accessible

**Issues to Document:**
- Any errors in console
- Broken links or missing resources
- Layout issues

---

### Task 3.2: Verify Supabase Connection
**Status:** ⏳ Pending
**Time Estimate:** 30 minutes
**Dependencies:** Task 3.1 complete

**Objective:** Confirm Electron can connect to Supabase database

**Test Cases:**

1. **Environment Variables:**
   - Check .env file loaded correctly
   - Verify VITE_SUPABASE_URL accessible
   - Verify VITE_SUPABASE_ANON_KEY accessible

2. **API Connection:**
   - Open DevTools Network tab
   - Load wiki-home.html
   - Check for requests to `https://mcbxbaggjaxqfdvmrqsc.supabase.co/rest/v1/`
   - Verify responses return data (not 401/403 errors)

3. **Data Loading:**
   - Check if guides load on home page
   - Check if events load
   - Check if locations load
   - Verify categories display

**Acceptance Criteria:**
- [ ] No CORS errors in console
- [ ] Supabase API requests succeed
- [ ] Data displays on wiki-home.html
- [ ] Environment variables loaded

**Common Issues:**
- CORS blocked: Configure Supabase allowed origins
- 401 Unauthorized: Check API key correct
- Network error: Check internet connection

---

### Task 3.3: Test All Wiki Pages Load
**Status:** ⏳ Pending
**Time Estimate:** 1 hour
**Dependencies:** Task 3.2 complete

**Objective:** Verify all 13 pages render correctly in Electron

**Pages to Test:**

| Page | URL Parameter | Test Criteria |
|------|---------------|---------------|
| Home | wiki-home.html | Guides, events, locations display |
| Guides | wiki-guides.html | Guide list loads |
| Page | wiki-page.html?slug=test | Individual guide displays |
| Editor | wiki-editor.html | Quill editor loads |
| Events | wiki-events.html | Events list loads |
| Map | wiki-map.html | Leaflet map renders |
| Favorites | wiki-favorites.html | User favorites load |
| Login | wiki-login.html | Form displays |
| Signup | wiki-signup.html | Form displays |
| Forgot Password | wiki-forgot-password.html | Form displays |
| Reset Password | wiki-reset-password.html | Form displays |
| Admin | wiki-admin.html | Categories load |
| Issues | wiki-issues.html | Issue form displays |

**For Each Page:**
- [ ] Page loads without errors
- [ ] CSS styling correct
- [ ] JavaScript executes
- [ ] Icons display (Font Awesome)
- [ ] Navigation works
- [ ] Mobile menu works

**Acceptance Criteria:**
- [ ] All 13 pages tested
- [ ] No console errors on any page
- [ ] All external libraries work (Leaflet, Quill)
- [ ] Styling identical to web version

---

### Task 3.4: Test Authentication Flow
**Status:** ⏳ Pending
**Time Estimate:** 1 hour
**Dependencies:** Task 3.3 complete

**Objective:** Verify Supabase Auth works in Electron

**Test Scenarios:**

1. **Signup Flow:**
   - Navigate to wiki-signup.html
   - Enter email and password
   - Submit form
   - Check for success message or error
   - Verify user created in Supabase dashboard

2. **Login Flow:**
   - Navigate to wiki-login.html
   - Enter credentials
   - Submit form
   - Check localStorage for session token
   - Verify redirected to home page
   - Check user name displays in header

3. **Logout Flow:**
   - Click logout button
   - Verify redirected to login page
   - Check localStorage cleared
   - Try accessing protected page (should redirect)

4. **Password Reset:**
   - Navigate to wiki-forgot-password.html
   - Enter email
   - Check for email sent confirmation
   - (Email testing may not work - document limitation)

**Acceptance Criteria:**
- [ ] Signup creates user successfully
- [ ] Login authenticates and stores token
- [ ] Logout clears session
- [ ] Protected pages require auth

**Known Limitations:**
- Magic link may not work (requires email client)
- Password reset emails require internet
- Document any auth issues for testers

---

### Task 3.5: Test Content Creation
**Status:** ⏳ Pending
**Time Estimate:** 1.5 hours
**Dependencies:** Task 3.4 complete

**Objective:** Verify users can create/edit guides, events, and locations

**Test Cases:**

1. **Create New Guide:**
   - Login as authenticated user
   - Navigate to wiki-editor.html
   - Select content type: Guide
   - Enter title, content, select categories
   - Upload image (test base64 encoding)
   - Click Publish
   - Verify guide appears in database
   - Verify guide displays on wiki-home.html

2. **Edit Existing Guide:**
   - Navigate to wiki-page.html?slug=test-guide
   - Click "Edit" button
   - Modify content in Quill editor
   - Save changes
   - Verify changes persist in database

3. **Create Event:**
   - Navigate to wiki-editor.html
   - Select content type: Event
   - Enter event details (title, date, location)
   - Add latitude/longitude
   - Publish
   - Verify event shows on wiki-events.html

4. **Create Location:**
   - Navigate to wiki-editor.html
   - Select content type: Location
   - Enter location details
   - Set coordinates
   - Publish
   - Verify location shows on wiki-map.html

**Acceptance Criteria:**
- [ ] Can create new guides
- [ ] Can edit existing guides
- [ ] Can create events
- [ ] Can create locations
- [ ] Quill editor works (rich text formatting)
- [ ] Image upload works (base64)
- [ ] Data saves to Supabase
- [ ] Content displays after creation

---

### Task 3.6: Test Map Functionality
**Status:** ⏳ Pending
**Time Estimate:** 45 minutes
**Dependencies:** Task 3.3 complete

**Objective:** Verify Leaflet map and OpenStreetMap tiles work

**Test Cases:**

1. **Map Loads:**
   - Navigate to wiki-map.html
   - Verify map renders
   - Check OpenStreetMap tiles load from internet
   - Zoom in/out works
   - Pan works

2. **Markers Display:**
   - Verify location markers appear on map
   - Click marker to see popup
   - Check popup shows location name and details
   - Verify click opens location details

3. **Filters:**
   - Test location type filters
   - Verify markers update when filtered
   - Test search by name

4. **Geolocation:**
   - Test "My Location" button
   - Verify asks for location permission
   - Check map centers on user location

**Acceptance Criteria:**
- [ ] Map tiles load from internet
- [ ] Markers display for all locations
- [ ] Popups show correct information
- [ ] Filters work correctly
- [ ] Geolocation works (if permitted)

**Known Requirement:**
- Internet connection required for map tiles
- Document this requirement for testers

---

## **PHASE 4: Production Build & Packaging**

### Task 4.1: Configure electron-builder for macOS and Windows
**Status:** ⏳ Pending
**Time Estimate:** 1 hour
**Dependencies:** All Phase 3 tests passing

**Objective:** Configure packaging for both platforms

**Configuration in package.json:**
```json
{
  "build": {
    "appId": "com.permahub.wiki",
    "productName": "Permahub Wiki",
    "copyright": "Copyright © 2025 Permahub",
    "directories": {
      "output": "dist-electron",
      "buildResources": "electron"
    },
    "files": [
      "src/**/*",
      "electron/**/*",
      "package.json",
      "!**/*.map",
      "!**/node_modules/**/*"
    ],
    "mac": {
      "category": "public.app-category.education",
      "icon": "electron/icon.icns",
      "target": [
        {
          "target": "dmg",
          "arch": ["x64", "arm64"]
        },
        {
          "target": "zip",
          "arch": ["x64", "arm64"]
        }
      ],
      "hardenedRuntime": true,
      "gatekeeperAssess": false,
      "entitlements": "electron/entitlements.mac.plist",
      "entitlementsInherit": "electron/entitlements.mac.plist"
    },
    "win": {
      "icon": "electron/icon.ico",
      "target": [
        {
          "target": "nsis",
          "arch": ["x64"]
        },
        {
          "target": "portable",
          "arch": ["x64"]
        }
      ]
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    }
  }
}
```

**macOS-specific:**
- Create `electron/entitlements.mac.plist` for code signing
- Support both Intel (x64) and Apple Silicon (arm64)

**Windows-specific:**
- NSIS installer with custom install directory
- Portable .exe version (no installation required)

**Acceptance Criteria:**
- [ ] electron-builder configuration complete
- [ ] Platform-specific settings added
- [ ] File inclusion/exclusion rules set
- [ ] Installer options configured

**Files Modified:**
- MODIFIED: `package.json`
- NEW: `electron/entitlements.mac.plist`

---

### Task 4.2: Research Mobile App Options (Capacitor)
**Status:** ⏳ Pending
**Time Estimate:** 2 hours
**Dependencies:** None (parallel research)

**Objective:** Determine feasibility of iOS/Android versions

**Research Questions:**

1. **Capacitor vs React Native vs Ionic:**
   - Which best fits current vanilla JS codebase?
   - Can we reuse existing wiki code?
   - What needs to be rewritten?

2. **Supabase Compatibility:**
   - Does Supabase SDK work on mobile?
   - Any mobile-specific API limitations?
   - Authentication on mobile (magic links, OAuth)

3. **UI/UX Considerations:**
   - Touch-friendly interface needed?
   - Responsive CSS sufficient or need mobile redesign?
   - Native navigation vs web navigation

4. **Distribution:**
   - App Store approval requirements
   - Google Play requirements
   - Beta testing options (TestFlight, Play Console)

5. **Development Environment:**
   - Need macOS for iOS development
   - Android Studio for Android
   - Capacitor CLI requirements

**Deliverable:** Research document with recommendation

**Acceptance Criteria:**
- [ ] Technology comparison complete
- [ ] Compatibility verified
- [ ] Development requirements documented
- [ ] Recommendation made (go/no-go)

**Output:**
- NEW: `/docs/processes/MOBILE_APP_RESEARCH.md`

---

### Task 4.3: Create Application Icon
**Status:** ⏳ Pending
**Time Estimate:** 2 hours
**Dependencies:** None

**Objective:** Design and prepare app icons for all platforms

**Icon Requirements:**

**macOS (.icns):**
- 1024x1024px master icon
- Generate .icns with sizes: 16, 32, 64, 128, 256, 512, 1024
- Tool: `iconutil` (macOS command-line) or online converter

**Windows (.ico):**
- 256x256px master icon
- Generate .ico with sizes: 16, 32, 48, 64, 128, 256
- Tool: GIMP, Photoshop, or online converter

**Design Guidelines:**
- Represent Permahub brand (green, nature theme)
- Simple and recognizable at small sizes
- Square with rounded corners
- No transparency issues
- High contrast for visibility

**Steps:**
1. Create master 1024x1024px PNG icon
2. Convert to .icns for macOS
3. Convert to .ico for Windows
4. Save to `/electron/` directory
5. Test in packaged app

**Acceptance Criteria:**
- [ ] Master icon designed (1024x1024)
- [ ] .icns file created
- [ ] .ico file created
- [ ] Icons display correctly in app

**Files Created:**
- NEW: `/electron/icon.png` (master)
- NEW: `/electron/icon.icns` (macOS)
- NEW: `/electron/icon.ico` (Windows)

---

### Task 4.4: Build Production Electron Installer
**Status:** ⏳ Pending
**Time Estimate:** 1 hour
**Dependencies:** Tasks 4.1 and 4.3 complete

**Objective:** Create distributable installers for macOS and Windows

**Build Commands:**

1. **Build for macOS (on macOS only):**
   ```bash
   npm run electron:build:mac
   ```
   Outputs:
   - `dist-electron/Permahub Wiki-1.0.0.dmg` (installer)
   - `dist-electron/Permahub Wiki-1.0.0-mac.zip` (portable)

2. **Build for Windows (cross-platform):**
   ```bash
   npm run electron:build:win
   ```
   Outputs:
   - `dist-electron/Permahub Wiki Setup 1.0.0.exe` (NSIS installer)
   - `dist-electron/Permahub Wiki 1.0.0.exe` (portable)

3. **Build for both platforms:**
   ```bash
   npm run electron:build:all
   ```

**Build Process:**
1. Clean previous builds: `rm -rf dist-electron`
2. Run Vite build: `npm run build:electron`
3. Run electron-builder: `npm run electron:build`
4. Verify output files created
5. Check file sizes (should be 50-150MB)

**Acceptance Criteria:**
- [ ] Build completes without errors
- [ ] macOS .dmg file created
- [ ] Windows .exe installers created
- [ ] File sizes reasonable (<200MB)
- [ ] Version number correct in filenames

**Output Files:**
- `/dist-electron/Permahub Wiki-1.0.0.dmg`
- `/dist-electron/Permahub Wiki Setup 1.0.0.exe`
- `/dist-electron/Permahub Wiki 1.0.0.exe` (portable)

---

## **PHASE 5: Final Testing & Distribution**

### Task 5.1: Test Production Installer on macOS
**Status:** ⏳ Pending
**Time Estimate:** 1 hour
**Dependencies:** Task 4.4 complete

**Objective:** Verify macOS installer works correctly

**Test Steps:**

1. **Install from DMG:**
   - Open `Permahub Wiki-1.0.0.dmg`
   - Drag app to Applications folder
   - Eject DMG
   - Launch app from Applications

2. **Security Checks:**
   - macOS Gatekeeper warning expected (unsigned app)
   - Right-click → Open to bypass
   - Document Gatekeeper workaround for testers

3. **Functionality Tests:**
   - Run all Phase 3 tests again
   - Verify Supabase connection
   - Test authentication
   - Test content creation
   - Test map loads

4. **Uninstall:**
   - Drag app to Trash
   - Verify no leftover files

**Acceptance Criteria:**
- [ ] DMG mounts successfully
- [ ] App installs to Applications
- [ ] App launches after install
- [ ] All features work as in dev mode
- [ ] No crashes or errors

**Issues to Document:**
- Gatekeeper warnings (expected for unsigned app)
- Any permission dialogs
- Any features not working

---

### Task 5.2: Test Production Installer on Windows
**Status:** ⏳ Pending
**Time Estimate:** 1 hour
**Dependencies:** Task 4.4 complete

**Objective:** Verify Windows installer works correctly

**Test Steps:**

1. **Install from NSIS Installer:**
   - Run `Permahub Wiki Setup 1.0.0.exe`
   - Choose installation directory
   - Complete installation wizard
   - Launch app from Start Menu

2. **Test Portable Version:**
   - Run `Permahub Wiki 1.0.0.exe` directly
   - Verify no installation required
   - Check app works immediately

3. **Security Checks:**
   - Windows SmartScreen warning expected (unsigned)
   - Click "More info" → "Run anyway"
   - Document SmartScreen workaround for testers

4. **Functionality Tests:**
   - Run all Phase 3 tests again
   - Verify Supabase connection
   - Test authentication
   - Test content creation
   - Test map loads

5. **Uninstall:**
   - Use Windows "Add or Remove Programs"
   - Verify clean uninstall

**Acceptance Criteria:**
- [ ] Installer runs successfully
- [ ] App installs to Program Files
- [ ] Desktop shortcut created
- [ ] App launches after install
- [ ] All features work as in dev mode
- [ ] Portable version works

**Testing Environment:**
- Windows 10 or 11
- Test on VM if macOS user

**Issues to Document:**
- SmartScreen warnings (expected)
- Any antivirus false positives
- Any features not working

---

### Task 5.3: Create Tester Documentation
**Status:** ⏳ Pending
**Time Estimate:** 2 hours
**Dependencies:** Tasks 5.1 and 5.2 complete

**Objective:** Write clear instructions for testers

**Document to Create:** `/docs/processes/ELECTRON_TESTER_GUIDE.md`

**Contents:**

1. **Welcome & Overview**
   - What is Permahub Wiki Electron app
   - Differences from web version
   - System requirements

2. **Installation Instructions**
   - macOS installation (with Gatekeeper workaround)
   - Windows installation (with SmartScreen workaround)
   - Screenshots for each step

3. **First Launch**
   - Internet connection required
   - Create account or login
   - Navigate the interface

4. **Features to Test**
   - Browse guides, events, locations
   - Create new content
   - Edit existing content
   - Use map
   - Add favorites
   - Test different languages

5. **Known Limitations**
   - Requires internet (not offline)
   - Map tiles need internet
   - Email features (magic link, password reset)
   - Unsigned app warnings

6. **Troubleshooting**
   - App won't open (security warnings)
   - Can't connect to database (check internet)
   - Map not loading (check internet)
   - Login issues (check credentials)

7. **Providing Feedback**
   - What to report
   - How to report bugs
   - Where to send feedback

**Acceptance Criteria:**
- [ ] Guide covers installation for both platforms
- [ ] Screenshots included
- [ ] Security workarounds clearly explained
- [ ] Known issues documented
- [ ] Feedback instructions clear

**Files Created:**
- NEW: `/docs/processes/ELECTRON_TESTER_GUIDE.md`

---

## 📊 Progress Tracking

### Phase Summary

| Phase | Tasks | Status | Est. Time |
|-------|-------|--------|-----------|
| Phase 1: Setup | 6 | ⏳ Pending | 4.5 hours |
| Phase 2: Dependencies | 3 | ⏳ Pending | 4 hours |
| Phase 3: Testing | 6 | ⏳ Pending | 5.75 hours |
| Phase 4: Build | 4 | ⏳ Pending | 6 hours |
| Phase 5: Distribution | 3 | ⏳ Pending | 4 hours |
| **TOTAL** | **22** | **0% Complete** | **24.25 hours** |

### Task Status Legend
- ⏳ Pending - Not started
- 🚧 In Progress - Currently working on
- ✅ Complete - Finished and tested
- ⚠️ Blocked - Waiting on dependency or external factor
- ❌ Failed - Attempted but encountered blocker

---

## 🔄 Version Update Process

When updating the Electron app to match a new web release:

1. **Update version.json:**
   ```json
   {
     "version": "1.1.0",
     "webVersion": "1.1.0",
     "releaseDate": "2025-02-01",
     "changelog": [
       "Added new feature X",
       "Fixed bug Y",
       "Updated to match web v1.1.0"
     ]
   }
   ```

2. **Sync code changes from web:**
   - Copy updated HTML files
   - Copy updated JavaScript files
   - Copy updated CSS files
   - Update dependencies if needed

3. **Test in dev mode:**
   - Run all Phase 3 tests again
   - Verify new features work
   - Check for regressions

4. **Update package.json version:**
   ```json
   {
     "version": "1.1.0"
   }
   ```

5. **Rebuild installers:**
   ```bash
   npm run electron:build:all
   ```

6. **Distribute new version to testers**

---

## 📋 Appendix A: File Checklist

### Files to Create

- [ ] `/src/version.json`
- [ ] `/electron/main.js`
- [ ] `/electron/preload.js`
- [ ] `/electron/icon.png`
- [ ] `/electron/icon.icns`
- [ ] `/electron/icon.ico`
- [ ] `/electron/entitlements.mac.plist`
- [ ] `/vite.config.electron.js`
- [ ] `/src/assets/fontawesome-6.4.0/` (directory + files)
- [ ] `/src/assets/leaflet-1.9.4/` (directory + files)
- [ ] `/src/assets/quill-1.3.7/` (directory + files)
- [ ] `/docs/processes/ELECTRON_TESTER_GUIDE.md`
- [ ] `/docs/processes/MOBILE_APP_RESEARCH.md`

### Files to Modify

- [ ] `package.json` (scripts, build config, version)
- [ ] All 13 `/src/wiki/*.html` files (local dependencies)
- [ ] `/src/wiki/js/wiki.js` (version display)
- [ ] `.gitignore` (if needed for assets)

---

## 📋 Appendix B: Command Reference

### Development Commands
```bash
# Install dependencies
npm install

# Run Electron in dev mode
npm run electron:dev

# Build wiki pages
npm run build:electron
```

### Build Commands
```bash
# Build for current platform
npm run electron:build

# Build for macOS only (macOS required)
npm run electron:build:mac

# Build for Windows only
npm run electron:build:win

# Build for both platforms
npm run electron:build:all
```

### Utility Commands
```bash
# Check Electron version
npx electron --version

# Clean build artifacts
rm -rf dist-electron

# Check package.json configuration
cat package.json | grep -A 30 "build"
```

---

## 📋 Appendix C: Troubleshooting Guide

### Common Build Issues

**Issue:** `electron-builder` fails with "Cannot find module"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Issue:** macOS build fails with code signing error
**Solution:** Add `"identity": null` to mac config (disables signing)

**Issue:** Windows build fails on macOS
**Solution:** Install Wine for cross-compilation:
```bash
brew install wine-stable
```

**Issue:** App crashes on launch
**Solution:** Check DevTools console for errors:
- Add `mainWindow.webContents.openDevTools()` to main.js
- Look for missing files or API errors

---

## 📋 Appendix D: Resources

### Documentation
- [Electron Documentation](https://www.electronjs.org/docs)
- [electron-builder Documentation](https://www.electron.build/)
- [Vite Documentation](https://vitejs.dev/)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)

### Tools
- [Icon Converter](https://cloudconvert.com/png-to-icns)
- [Electron Forge](https://www.electronforge.io/) (alternative to electron-builder)
- [Capacitor Documentation](https://capacitorjs.com/) (for future mobile)

---

## ✅ Sign-Off Checklist

Before considering the Electron app complete:

- [ ] All 22 tasks completed
- [ ] All Phase 3 tests passing
- [ ] macOS installer tested
- [ ] Windows installer tested
- [ ] Tester documentation complete
- [ ] Version tracking implemented
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] File sizes reasonable
- [ ] Ready for tester distribution

---

**Project Status:** 🚧 Not Started

**Last Updated:** 2025-01-16

**Next Step:** Begin Task 1.1 - Create Version Tracking System
