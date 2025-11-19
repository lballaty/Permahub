# Version Management System

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/VERSION_MANAGEMENT.md

**Description:** Complete documentation for Permahub's automated version management system

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-01-18

---

## Overview

Permahub uses an **automated version management system** that:
- ✅ Auto-increments version with every commit
- ✅ Enforces FixRecord.md documentation
- ✅ Displays version badge on all pages
- ✅ Syncs version across entire platform
- ✅ Creates git tags automatically
- ✅ Smart badge positioning (non-obtrusive)

---

## Version Format

### Package Version (Semantic)
- Format: `MAJOR.MINOR.PATCH` (e.g., `1.0.23`)
- Stored in: [package.json](../package.json:3)
- Auto-incremented: `+1` to PATCH on every commit
- Single source of truth

### Display Version
- Format: `Permahub YYYY-MM-DD HH:mm #X`
- Example: `Permahub 2025-01-18 14:23 #23`
- Where:
  - `Permahub` = Project name
  - `YYYY-MM-DD HH:mm` = Build timestamp
  - `#X` = Patch number from semantic version

### Badge Display
- Format: `v1.0.23` (short semantic version)
- Location: Top-right corner (fixed position)
- Click badge to see full details

---

## How It Works

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Git Commit Workflow                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  1. Pre-commit Hook                                          │
│     - Checks FixRecord.md is staged                          │
│     - Auto-increments version in package.json                │
│     - Adds version section to FixRecord.md                   │
│     - Stages updated files                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Commit Created                                           │
│     - Git creates commit with changes                        │
│     - Commit hash generated                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Post-commit Hook                                         │
│     - Updates FixRecord.md with commit hash                  │
│     - Creates git tag (e.g., v1.0.23)                        │
│     - Amends commit with updated FixRecord.md                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Build Time (npm run dev / npm run build)                 │
│     - Vite reads version from package.json                   │
│     - Injects into environment variables                     │
│     - version-manager.js displays badge                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Making a Commit

### Step 1: Update FixRecord.md

**REQUIRED:** Every commit must include an entry in [FixRecord.md](../FixRecord.md)

Format:
```markdown
### 2025-01-18 - Brief description of change

**Issue:**
What problem did you solve?

**Root Cause:**
What caused the issue?

**Solution:**
How did you fix it?

**Files Changed:**
- path/to/file1.js
- path/to/file2.html

**Author:** Your Name <email>

---
```

### Step 2: Stage Your Changes

```bash
git add src/js/your-file.js
git add FixRecord.md
```

⚠️ **IMPORTANT:** You must stage FixRecord.md or the commit will be blocked!

### Step 3: Commit

```bash
git commit -m "fix: Your commit message here"
```

### What Happens Automatically

1. **Pre-commit hook runs:**
   - ✅ Checks FixRecord.md is staged
   - ✅ Bumps version: `1.0.23` → `1.0.24`
   - ✅ Adds version header to FixRecord.md:
     ```markdown
     ## Version 1.0.24 - 2025-01-18 14:23:00
     **Commit:** `PENDING`
     ```
   - ✅ Stages package.json and FixRecord.md

2. **Commit is created** with all your changes plus version bump

3. **Post-commit hook runs:**
   - ✅ Replaces `PENDING` with actual commit hash (e.g., `a3f5c2d`)
   - ✅ Creates git tag: `v1.0.24`
   - ✅ Amends commit with final FixRecord.md

4. **Done!** Your commit includes:
   - Your code changes
   - Updated version in package.json
   - FixRecord.md entry with version and commit hash
   - Git tag pointing to this version

---

## Version Badge Display

### Where It Appears
- **All 36 wiki pages** automatically
- **Location:** Top-right corner (fixed position)
- **Format:** `v1.0.23` (short version)

### Smart Positioning
The badge automatically avoids overlapping with:
- User menu buttons
- Language selector
- Navigation buttons
- Other header elements

Positioning logic:
```javascript
// Default position
top: 10px
right: 10px

// Automatically adjusts if elements detected in top-right
// Moves down to avoid overlaps
```

### Styling
```css
position: fixed;
top: 10px;
right: 10px;
z-index: 999;
background: rgba(45, 134, 89, 0.9);
color: white;
padding: 4px 10px;
border-radius: 12px;
font-size: 11px;
backdrop-filter: blur(5px);
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
```

### Interactions
- **Hover:** Badge becomes semi-transparent (60% opacity)
- **Click:** Shows alert with full version details:
  ```
  Permahub 2025-01-18 14:23 #23

  Version: 1.0.23
  Commit: a3f5c2d
  Build Time: 2025-01-18T14:23:45.123Z
  Environment: development
  ```

---

## File Structure

### Core Files

| File | Purpose |
|------|---------|
| [package.json](../package.json) | Single source of truth for version |
| [src/js/version-manager.js](../src/js/version-manager.js) | Version display logic and badge |
| [FixRecord.md](../FixRecord.md) | Changelog with version sections |
| [vite.config.js](../vite.config.js) | Injects version into build |

### Hook Scripts

| File | Purpose |
|------|---------|
| [scripts/hooks/version-bump-hook.sh](../scripts/hooks/version-bump-hook.sh) | Pre-commit: bump version |
| [scripts/hooks/post-commit-hook.sh](../scripts/hooks/post-commit-hook.sh) | Post-commit: add hash & tag |
| [scripts/install-version-hooks.sh](../scripts/install-version-hooks.sh) | Install hooks to .git/hooks |

### Git Hooks (Installed)

| File | Purpose |
|------|---------|
| `.git/hooks/pre-commit` | Enforces FixRecord.md and bumps version |
| `.git/hooks/post-commit` | Updates commit hash and creates git tag |

---

## Console Logging

When any page loads, you'll see:
```
🚀 Permahub 2025-01-18 14:23 #23
📦 Version: 1.0.23
📝 Commit: a3f5c2d
📅 Build: 2025-01-18T14:23:45.123Z
🔗 Environment: development
🌐 Supabase: https://mcbxbaggjaxqfdvmrqsc.supabase.co
────────────────────────────────────────────────────────────
```

---

## Troubleshooting

### Commit Blocked: "FixRecord.md must be updated"

**Problem:** Pre-commit hook blocks commit

**Solution:**
1. Add entry to FixRecord.md
2. Stage it: `git add FixRecord.md`
3. Try commit again

### Version Not Displaying on Page

**Problem:** Badge doesn't appear

**Check:**
1. Is `version-manager.js` imported in the page?
   ```javascript
   import '../js/version-manager.js';
   ```
2. Open browser console - any errors?
3. Is dev server running? (`npm run dev`)

### Wrong Version Number

**Problem:** Badge shows incorrect version

**Solution:**
1. Check [package.json](../package.json:3) - what version is listed?
2. Restart dev server: `./stopall.sh && ./start.sh`
3. Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

### Git Tag Already Exists

**Problem:** "Tag v1.0.23 already exists"

**Solution:**
This is normal if you amended a commit. The tag already points to the right version.

To remove duplicate tag:
```bash
git tag -d v1.0.23
```

---

## Environment Variables

Version is injected at build time via Vite:

```javascript
import.meta.env.VITE_APP_VERSION     // "1.0.23"
import.meta.env.VITE_BUILD_TIME      // "2025-01-18T14:23:45.123Z"
import.meta.env.VITE_COMMIT_HASH     // "a3f5c2d"
```

Configured in [vite.config.js](../vite.config.js:83-104)

---

## Testing

Test files updated to expect new format:

```javascript
// Old format (removed)
expect(versionText).toMatch(/^v\d{8}\.\d{4}\.v\d+$/);

// New format (current)
expect(versionText).toMatch(/^v\d+\.\d+\.\d+$/);
```

Run tests:
```bash
npm run test:smoke
npm run test:integration
```

---

## Best Practices

### ✅ DO
- Always update FixRecord.md with every commit
- Use clear, descriptive commit messages
- Let the hooks handle version bumping
- Keep FixRecord.md entries detailed

### ❌ DON'T
- Don't manually edit version in package.json
- Don't skip FixRecord.md updates
- Don't disable the hooks
- Don't force push without team approval

---

## Migrating from Old System

### Old System
- Manual version increment in `version.js`
- Format: `v20250114.1142.v23`
- Function: `displayVersionInHeader()`
- Only 16 pages had version

### New System
- Automatic version from `package.json`
- Format: `v1.0.23` (badge) / `Permahub 2025-01-18 14:23 #23` (console)
- Function: `displayVersionBadge()` (auto-called)
- All 36 pages have version

### Migration Complete
- ✅ All files updated to use `version-manager.js`
- ✅ All tests updated for new format
- ✅ Hooks installed and active
- ✅ FixRecord.md restructured with version sections

---

## Future Enhancements

Potential improvements:
- [ ] Auto-detect breaking changes for MAJOR bumps
- [ ] Auto-detect new features for MINOR bumps
- [ ] Generate CHANGELOG.md from FixRecord.md
- [ ] Version comparison tool
- [ ] Release notes generator

---

## Questions?

See:
- Main project docs: [README.md](../README.md)
- Development guide: [.claude/CLAUDE.md](../.claude/CLAUDE.md)
- Fix history: [FixRecord.md](../FixRecord.md)

---

**Last Updated:** 2025-01-18

**Status:** ✅ Active and Enforced
