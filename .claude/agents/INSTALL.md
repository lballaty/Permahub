# Git Agent System - Installation Guide

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/.claude/agents/INSTALL.md
**Description:** Quick installation guide for adding Git Agents to any repository
**Author:** Libor Ballaty <libor@arionetworks.com>
**Created:** 2025-11-18

---

## Quick Install (5 Minutes)

This guide shows how to add the Git Agent system to **any repository**.

### Prerequisites

- ✅ Git repository
- ✅ Claude Code (VSCode extension or CLI)
- ✅ Bash 4.0+ (macOS/Linux)
- ⭐ jq (optional but recommended): `brew install jq` or `apt install jq`

---

## Step 1: Copy Files

From the Permahub repository (or wherever you have the agents):

```bash
# Set paths
SOURCE_REPO="/path/to/Permahub"
TARGET_REPO="/path/to/your-new-repo"

# Copy agent system
cp -r "$SOURCE_REPO/.claude/agents" "$TARGET_REPO/.claude/"

# Copy CLI script
mkdir -p "$TARGET_REPO/scripts"
cp "$SOURCE_REPO/scripts/git-agents.sh" "$TARGET_REPO/scripts/"

# Make executable
chmod +x "$TARGET_REPO/scripts/git-agents.sh"
chmod +x "$TARGET_REPO/.claude/agents/lib/"*.sh
chmod +x "$TARGET_REPO/.claude/agents/init-claude-session.sh"
```

---

## Step 2: Update Claude Code Settings

Create or edit `$TARGET_REPO/.claude/settings.local.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(git:*)",
      "Bash(./scripts/git-agents.sh:*)"
    ],
    "deny": [],
    "ask": []
  },
  "hooks": {
    "SessionStart": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "/ABSOLUTE/PATH/TO/your-new-repo/.claude/agents/init-claude-session.sh"
          }
        ]
      }
    ]
  }
}
```

**CRITICAL:** Replace `/ABSOLUTE/PATH/TO/your-new-repo` with the full absolute path to your repository.

**Get absolute path:**
```bash
cd /path/to/your-new-repo
pwd
# Copy the output and use it in the hook command
```

---

## Step 3: Test Installation

```bash
cd /path/to/your-new-repo

# Test CLI
./scripts/git-agents.sh help

# Initialize a session
./scripts/git-agents.sh init-session

# Check status
./scripts/git-agents.sh status
```

Expected output:
```
=== Initializing Git Agent Session ===

✓ Session initialized: abc123
  PID: 12345
  Start time: 2025-11-18 15:00:00
  Active sessions: 1

Agent Features:
  • Incremental commits - Automatically enforced (max 2 files)
  • Commit validation - Format and atomicity checks
  • Intelligent sync - Adaptive timing based on activity
  • Multi-session safe - Coordinates across Claude sessions
```

---

## Step 4: Customize Configuration (Optional)

Edit `.claude/agents/config.json`:

```bash
cd /path/to/your-new-repo
nano .claude/agents/config.json
```

**Common Customizations:**

### For Monorepos (Allow 3 files per commit):
```json
{
  "agents": {
    "commitQuality": {
      "maxFilesPerCommit": 3
    }
  }
}
```

### For Different Timezones:
```json
{
  "agents": {
    "syncIntelligence": {
      "workHoursStart": "08:00",
      "workHoursEnd": "17:00"
    }
  }
}
```

### For High-Activity Projects (More frequent sync):
```json
{
  "agents": {
    "syncIntelligence": {
      "minIntervalSeconds": 900,
      "maxIntervalSeconds": 3600
    }
  }
}
```

---

## Step 5: Commit the Agent System

```bash
cd /path/to/your-new-repo

# Add files
git add .claude/agents/
git add scripts/git-agents.sh
git add .claude/settings.local.json  # If you want to commit settings

# Commit
git commit -m "feat: Add Git Agent system for intelligent commit management

- Enforces incremental commits (max 2 files)
- Validates commit message format
- Intelligent GitHub sync timing
- Multi-session coordination
- See .claude/agents/README.md for details"

# Push
git push
```

---

## Step 6: Test Multi-Session (Optional)

Open two terminals:

**Terminal 1:**
```bash
cd /path/to/your-new-repo
# Open Claude Code or run:
./scripts/git-agents.sh init-session
```

**Terminal 2:**
```bash
cd /path/to/your-new-repo
# Open another Claude Code session or run:
./scripts/git-agents.sh init-session
```

**Check both sessions registered:**
```bash
./scripts/git-agents.sh status
```

You should see:
```
Active Sessions: 2

  abc123
    Last heartbeat: 2025-11-18 15:05:00

  def456
    Last heartbeat: 2025-11-18 15:05:15
```

---

## Verification Checklist

- [ ] `./scripts/git-agents.sh help` shows help menu
- [ ] `./scripts/git-agents.sh init-session` creates a session
- [ ] `./scripts/git-agents.sh status` shows active session
- [ ] `.claude/agents/state/active-sessions.json` contains session data
- [ ] Claude Code SessionStart hook runs automatically (check on next session)
- [ ] Commits are validated (test with >2 files, should fail)
- [ ] Configuration file exists at `.claude/agents/config.json`

---

## Troubleshooting

### "Command not found: git-agents.sh"

```bash
# Make script executable
chmod +x ./scripts/git-agents.sh

# Or use bash directly
bash ./scripts/git-agents.sh help
```

### "No such file or directory: active-sessions.json"

```bash
# Recreate state directory
mkdir -p .claude/agents/state
echo '[]' > .claude/agents/state/active-sessions.json
```

### SessionStart hook not running

1. Check absolute path in `.claude/settings.local.json`
2. Get correct path: `cd /path/to/repo && pwd`
3. Update hook command with full path
4. Restart Claude Code

### "Permission denied" errors

```bash
# Fix all permissions
chmod +x scripts/git-agents.sh
chmod +x .claude/agents/lib/*.sh
chmod +x .claude/agents/init-claude-session.sh
chmod -R 755 .claude/agents/
```

---

## Next Steps

1. **Read the full documentation:** `.claude/agents/README.md`
2. **Customize configuration:** `.claude/agents/config.json`
3. **Try the CLI:** `./scripts/git-agents.sh --help`
4. **Test with Claude Code:** Open a new session and watch it auto-initialize

---

## Team Sharing

To share with your team:

1. **Commit the agent system** (Step 5 above)
2. **Update team README.md:**
   ```markdown
   ## Git Agents

   This repo uses intelligent Git Agents for:
   - Automatic incremental commit enforcement
   - Commit message validation
   - Intelligent sync timing

   See `.claude/agents/README.md` for details.
   ```

3. **Onboard team members:**
   - They pull the repo
   - Claude Code auto-initializes agents
   - No manual setup needed!

---

## Uninstallation

To remove the agent system:

```bash
# Remove agents
rm -rf .claude/agents/

# Remove CLI
rm scripts/git-agents.sh

# Remove from settings
# Edit .claude/settings.local.json and remove hooks section

# Commit removal
git add .
git commit -m "chore: Remove Git Agent system"
```

---

## Multi-Repo & Multi-GitHub Setup

**Working across multiple repositories?** See the comprehensive guide:

📖 **[Multi-Repo Guide](MULTI_REPO_GUIDE.md)**

Covers:
- ✅ Multiple local repositories (personal + work)
- ✅ Multiple GitHub accounts (different credentials)
- ✅ Multiple organizations (different teams)
- ✅ Session isolation (repos don't interfere)
- ✅ Configuration management (shared vs. per-repo)
- ✅ Best practices for team consistency

**Quick Summary:**
- Each repository has **independent agent state**
- Sessions in different repos **don't coordinate**
- Agents respect Git's **per-repo credentials**
- You can work on **unlimited repos** simultaneously
- Each repo can have **different rules**

**Example:**
```bash
~/Projects/
├── Personal/Permahub/      # Max 2 files, relaxed
├── Work/CompanyApp/         # Max 1 file, strict
└── OSS/Library/             # Max 3 files, flexible
```

All three can run agents simultaneously with zero conflicts!

---

## Support

**Full Documentation:** `.claude/agents/README.md`
**Multi-Repo Guide:** `.claude/agents/MULTI_REPO_GUIDE.md`
**Issues:** https://github.com/lballaty/Permahub/issues
**Author:** Libor Ballaty <libor@arionetworks.com>

---

**Installation Time:** ~5 minutes
**Complexity:** Low
**Requirements:** Git + Claude Code + Bash
**Status:** Production Ready
