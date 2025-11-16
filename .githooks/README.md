# Git Hooks

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/.githooks/README.md

**Description:** Git hooks for Permahub project quality control

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-16

---

## Overview

This directory contains git hooks that enforce project standards and documentation requirements.

## Available Hooks

### pre-commit

**Purpose:** Ensures that bug fixes and code corrections are properly documented in FixRecord.md

**What it checks:**
- Detects when code files (`.js`, `.ts`, `.html`, `.css`, `.sql`, etc.) are being committed
- Checks if the commit appears to be a fix (based on file patterns and commit message)
- Verifies that FixRecord.md has been updated
- Prompts user if FixRecord.md is missing from the commit

**Behavior:**
- ✅ Allows commit if FixRecord.md is included
- ⚠️ Warns if fix-related files are committed without FixRecord.md update
- ❓ Asks for confirmation to proceed without documentation
- ℹ️ Skips check for non-fix commits (docs, config, etc.)

**Bypass (not recommended):**
```bash
git commit --no-verify
```

## Installation

### Automatic Setup

Run the setup script to install all hooks:

```bash
bash .githooks/setup-hooks.sh
```

### Manual Setup

Copy hooks to `.git/hooks/` directory:

```bash
cp .githooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

## Testing

Test the pre-commit hook:

```bash
# Make a fix without updating FixRecord.md (should warn)
echo "// fix" >> src/js/test.js
git add src/js/test.js
git commit -m "fix: test fix"

# Make a fix WITH FixRecord.md (should pass)
echo "### 2025-11-16 - Test Fix" >> FixRecord.md
git add src/js/test.js FixRecord.md
git commit -m "fix: test fix with documentation"
```

## Maintenance

### Updating Hooks

1. Edit the hook file in `.githooks/`
2. Run the setup script to reinstall:
   ```bash
   bash .githooks/setup-hooks.sh
   ```

### Disabling Hooks

To temporarily disable all hooks:

```bash
git config core.hooksPath /dev/null
```

To re-enable:

```bash
git config --unset core.hooksPath
```

## Notes

- Git hooks in `.git/hooks/` cannot be committed to the repository
- This `.githooks/` directory contains shareable versions of the hooks
- New team members must run the setup script after cloning the repository
- Hooks are local to each developer's machine

---

**Questions?** Contact: Libor Ballaty <libor@arionetworks.com>
