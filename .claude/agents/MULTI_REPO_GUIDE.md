# Git Agent System - Multi-Repo & Multi-GitHub Setup Guide

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/.claude/agents/MULTI_REPO_GUIDE.md
**Description:** Complete guide for using Git Agents across multiple repositories, GitHub accounts, and organizations
**Author:** Libor Ballaty <libor@arionetworks.com>
**Created:** 2025-11-18
**Version:** 1.0.0

---

## 📋 Table of Contents

- [Overview](#overview)
- [Scenario 1: Multiple Local Repositories](#scenario-1-multiple-local-repositories)
- [Scenario 2: Multiple GitHub Accounts](#scenario-2-multiple-github-accounts)
- [Scenario 3: Multiple Organizations](#scenario-3-multiple-organizations)
- [Scenario 4: Mixed Personal & Work Projects](#scenario-4-mixed-personal--work-projects)
- [Session Isolation](#session-isolation)
- [Configuration Management](#configuration-management)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Git Agent system is **repository-scoped** and works seamlessly across:
- ✅ Multiple local repositories
- ✅ Multiple GitHub accounts
- ✅ Multiple organizations
- ✅ Different project types (personal, work, open-source)

**Key Principle:** Each repository has its own independent agent system with separate state.

---

## Scenario 1: Multiple Local Repositories

### Setup: 3 Different Projects

**Your machine:**
```
~/Projects/
├── Permahub/               # Personal - Permaculture platform
├── CompanyApp/             # Work - Company project
└── OpenSourceLib/          # OSS - Contributing to library
```

### Installation

**Install in each repository separately:**

```bash
# Repo 1: Permahub
cd ~/Projects/Permahub
cp -r /path/to/source/.claude/agents .claude/
cp /path/to/source/scripts/git-agents.sh scripts/
chmod +x scripts/git-agents.sh .claude/agents/lib/*.sh .claude/agents/init-claude-session.sh

# Repo 2: CompanyApp
cd ~/Projects/CompanyApp
cp -r /path/to/source/.claude/agents .claude/
cp /path/to/source/scripts/git-agents.sh scripts/
chmod +x scripts/git-agents.sh .claude/agents/lib/*.sh .claude/agents/init-claude-session.sh

# Repo 3: OpenSourceLib
cd ~/Projects/OpenSourceLib
cp -r /path/to/source/.claude/agents .claude/
cp /path/to/source/scripts/git-agents.sh scripts/
chmod +x scripts/git-agents.sh .claude/agents/lib/*.sh .claude/agents/init-claude-session.sh
```

### Configuration Files

**Each repo has its own `.claude/settings.local.json`:**

**Permahub:**
```json
{
  "permissions": {
    "allow": ["Bash(git:*)", "Bash(./scripts/git-agents.sh:*)"]
  },
  "hooks": {
    "SessionStart": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "/Users/you/Projects/Permahub/.claude/agents/init-claude-session.sh"
      }]
    }]
  }
}
```

**CompanyApp:**
```json
{
  "permissions": {
    "allow": ["Bash(git:*)", "Bash(./scripts/git-agents.sh:*)"]
  },
  "hooks": {
    "SessionStart": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "/Users/you/Projects/CompanyApp/.claude/agents/init-claude-session.sh"
      }]
    }]
  }
}
```

**⚠️ Critical:** Each hook command has the **absolute path** to that specific repository.

### Session Isolation

**Sessions in different repos are completely independent:**

```bash
# Terminal 1: Permahub
cd ~/Projects/Permahub
# Open Claude Code
# Session ID: abc123
# State: ~/Projects/Permahub/.claude/agents/state/

# Terminal 2: CompanyApp
cd ~/Projects/CompanyApp
# Open Claude Code
# Session ID: def456
# State: ~/Projects/CompanyApp/.claude/agents/state/

# Terminal 3: OpenSourceLib
cd ~/Projects/OpenSourceLib
# Open Claude Code
# Session ID: ghi789
# State: ~/Projects/OpenSourceLib/.claude/agents/state/
```

**These sessions DO NOT coordinate** - they're in different repositories with separate state directories.

**You can:**
- Work on all 3 simultaneously
- Each has its own commit rules
- Each syncs independently
- No cross-repo conflicts

### Repository-Specific Configurations

**Customize each repo independently:**

**Permahub (personal, solo dev):**
```json
{
  "agents": {
    "commitQuality": {
      "maxFilesPerCommit": 2,
      "enforceConventionalCommits": true
    },
    "syncIntelligence": {
      "minIntervalSeconds": 1800,
      "workHoursStart": "09:00",
      "workHoursEnd": "18:00"
    }
  }
}
```

**CompanyApp (team project, strict rules):**
```json
{
  "agents": {
    "commitQuality": {
      "maxFilesPerCommit": 1,
      "enforceConventionalCommits": true,
      "requireFixRecord": true
    },
    "syncIntelligence": {
      "minIntervalSeconds": 900,
      "workHoursStart": "08:00",
      "workHoursEnd": "17:00"
    }
  }
}
```

**OpenSourceLib (more relaxed):**
```json
{
  "agents": {
    "commitQuality": {
      "maxFilesPerCommit": 3,
      "enforceConventionalCommits": false
    },
    "syncIntelligence": {
      "minIntervalSeconds": 3600,
      "workHoursStart": "00:00",
      "workHoursEnd": "23:59"
    }
  }
}
```

---

## Scenario 2: Multiple GitHub Accounts

### Setup: Personal + Work Accounts

**Your GitHub accounts:**
- `github.com/yourname` (personal)
- `github.com/yourcompany` (work)

### Git Configuration

**Use directory-based Git config:**

```bash
# ~/.gitconfig (global)
[includeIf "gitdir:~/Projects/Personal/"]
    path = ~/.gitconfig-personal

[includeIf "gitdir:~/Projects/Work/"]
    path = ~/.gitconfig-work
```

**~/.gitconfig-personal:**
```ini
[user]
    name = Your Name
    email = you@personal.com

[github]
    user = yourname
```

**~/.gitconfig-work:**
```ini
[user]
    name = Your Name
    email = you@company.com

[github]
    user = yourcompany
```

### Directory Structure

```
~/Projects/
├── Personal/
│   ├── Permahub/          # Uses yourname GitHub account
│   └── MyBlog/            # Uses yourname GitHub account
└── Work/
    ├── CompanyApp/        # Uses yourcompany GitHub account
    └── InternalTool/      # Uses yourcompany GitHub account
```

### Git Agent Configuration

**Same agents work for both accounts!**

The agents use standard `git push`, which respects your Git config:

```bash
# Personal repo - pushes to github.com/yourname/Permahub
cd ~/Projects/Personal/Permahub
./scripts/git-agents.sh sync
# Uses credentials for yourname

# Work repo - pushes to github.com/yourcompany/CompanyApp
cd ~/Projects/Work/CompanyApp
./scripts/git-agents.sh sync
# Uses credentials for yourcompany
```

### SSH Keys for Multiple Accounts

**~/.ssh/config:**
```
# Personal GitHub
Host github.com-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_personal

# Work GitHub
Host github.com-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_work
```

**Update remote URLs in each repo:**

```bash
# Personal repos
cd ~/Projects/Personal/Permahub
git remote set-url origin git@github.com-personal:yourname/Permahub.git

# Work repos
cd ~/Projects/Work/CompanyApp
git remote set-url origin git@github.com-work:yourcompany/CompanyApp.git
```

**Agents automatically use the correct SSH key** based on the remote URL.

---

## Scenario 3: Multiple Organizations

### Setup: Contributing to Multiple Orgs

**Your projects:**
- Personal: `github.com/yourname/MyProject`
- Company: `github.com/CompanyOrg/Product`
- Open Source: `github.com/OpenSourceOrg/Library`

### Installation Across Orgs

**Each repository gets independent agent setup:**

```bash
# Your personal project
cd ~/Projects/yourname/MyProject
[Install agents with personal settings]

# Company project
cd ~/Projects/CompanyOrg/Product
[Install agents with company settings]

# Open source project
cd ~/Projects/OpenSourceOrg/Library
[Install agents with OSS settings]
```

### Org-Specific Rules

**Personal project (relaxed):**
```json
{
  "agents": {
    "commitQuality": {
      "maxFilesPerCommit": 3,
      "enforceConventionalCommits": false
    }
  }
}
```

**Company project (strict):**
```json
{
  "agents": {
    "commitQuality": {
      "maxFilesPerCommit": 1,
      "enforceConventionalCommits": true,
      "blockBatchedCommits": true
    },
    "syncIntelligence": {
      "requireTests": true,
      "testCommand": "npm test"
    }
  }
}
```

**Open source project (community standards):**
```json
{
  "agents": {
    "commitQuality": {
      "maxFilesPerCommit": 2,
      "enforceConventionalCommits": true,
      "allowedPrefixes": ["feat", "fix", "docs", "test", "chore"]
    }
  }
}
```

---

## Scenario 4: Mixed Personal & Work Projects

### Real-World Example

**Your typical workday:**

```
Morning (9am-12pm):
├── Terminal 1: CompanyApp (work)
│   └── Claude Code Session A
├── Terminal 2: InternalTool (work)
│   └── Claude Code Session B
└── Terminal 3: Permahub (personal)
    └── Claude Code Session C (side project during breaks)
```

**All 3 sessions run simultaneously with:**
- Different GitHub accounts
- Different commit rules
- Different sync timing
- **No interference between them**

### Session View

```bash
# Check CompanyApp sessions
cd ~/Projects/Work/CompanyApp
./scripts/git-agents.sh status
# Active Sessions: 1 (Session A)

# Check InternalTool sessions
cd ~/Projects/Work/InternalTool
./scripts/git-agents.sh status
# Active Sessions: 1 (Session B)

# Check Permahub sessions
cd ~/Projects/Personal/Permahub
./scripts/git-agents.sh status
# Active Sessions: 1 (Session C)
```

**Total sessions:** 3 (one per repo)
**Conflicts:** None (isolated state)

---

## Session Isolation

### How State is Isolated

**Each repository has independent state:**

```
Permahub/.claude/agents/state/
├── active-sessions.json    # Only Permahub sessions
├── commit-queue.json       # Only Permahub commits
├── sync-state.json         # Only Permahub syncs
└── activity.log            # Only Permahub activity

CompanyApp/.claude/agents/state/
├── active-sessions.json    # Only CompanyApp sessions
├── commit-queue.json       # Only CompanyApp commits
├── sync-state.json         # Only CompanyApp syncs
└── activity.log            # Only CompanyApp activity
```

### No Cross-Repo Coordination

**By design, repos don't coordinate:**

❌ **Does NOT happen:**
- Permahub session sees CompanyApp sessions
- CompanyApp sync waits for Permahub sync
- Shared commit locks across repos

✅ **What DOES happen:**
- Each repo operates independently
- Sessions only know about their own repo
- Locks are repo-scoped

**Why?** Because you're working on completely different projects. There's no reason for them to coordinate.

---

## Configuration Management

### Strategy 1: Shared Base Config (Recommended)

**Keep a template repo with agent system:**

```
~/Projects/_agent-templates/
├── .claude/agents/         # Base agent system
│   ├── config.json         # Default settings
│   ├── lib/               # Core libraries
│   └── ...
└── scripts/git-agents.sh   # CLI
```

**When starting new project:**
```bash
cd ~/Projects/NewProject
cp -r ~/Projects/_agent-templates/.claude/agents .claude/
cp ~/Projects/_agent-templates/scripts/git-agents.sh scripts/

# Customize for this project
nano .claude/agents/config.json
nano .claude/settings.local.json  # Update absolute paths
```

### Strategy 2: Git Submodule (Advanced)

**Share agents via submodule:**

```bash
# Create agents-common repo
mkdir ~/Projects/git-agents-common
cd ~/Projects/git-agents-common
git init
cp -r .claude/agents/ .
git add .
git commit -m "Initial agent system"
git remote add origin git@github.com:yourname/git-agents-common.git
git push -u origin main

# Use in projects
cd ~/Projects/Permahub
git submodule add git@github.com:yourname/git-agents-common.git .claude/agents
git submodule init
git submodule update

# Updates automatically pulled with submodule updates
```

### Strategy 3: Symlinks (Local Only)

**Share agents across local repos:**

```bash
# Master copy
~/Projects/_shared/git-agents/

# Symlink in each repo
cd ~/Projects/Permahub
ln -s ~/Projects/_shared/git-agents .claude/agents

cd ~/Projects/CompanyApp
ln -s ~/Projects/_shared/git-agents .claude/agents
```

**⚠️ Warning:** Shared configs mean all repos have same rules. Not recommended for work vs. personal.

---

## Best Practices

### 1. Separate Work and Personal

```
~/Projects/
├── Work/
│   ├── config.json         # Strict rules (max 1 file, require tests)
│   └── ...
└── Personal/
    ├── config.json         # Relaxed rules (max 3 files, no tests)
    └── ...
```

### 2. Document Per-Repo Rules

**Add to each repo's README.md:**

```markdown
## Git Agent Configuration

This repo uses the Git Agent system with the following rules:
- Max 2 files per commit
- Conventional commits enforced
- Auto-sync every 30 minutes
- Work hours: 8am-5pm

See `.claude/agents/README.md` for details.
```

### 3. Team Consistency

**For team projects, commit the agent config:**

```bash
git add .claude/agents/config.json
git commit -m "docs: Add Git Agent configuration for team"
git push
```

**Team members get same rules automatically** when they clone.

### 4. Personal Overrides

**Team config (committed):** `.claude/agents/config.json`
**Personal overrides (gitignored):** `.claude/agents/config.local.json`

```bash
# .gitignore
.claude/agents/config.local.json
.claude/agents/state/
```

### 5. Monitoring Multiple Repos

**Shell script to check all repos:**

```bash
#!/bin/bash
# check-all-agents.sh

REPOS=(
  ~/Projects/Permahub
  ~/Projects/CompanyApp
  ~/Projects/OpenSourceLib
)

for repo in "${REPOS[@]}"; do
  echo "=== $repo ==="
  cd "$repo"
  ./scripts/git-agents.sh status
  echo ""
done
```

---

## Troubleshooting

### Issue 1: Wrong GitHub Account Used

**Problem:** Committed to work repo with personal email

**Solution:**
```bash
# Check Git config
git config user.email
# Should be work email

# If wrong, fix directory-based config
nano ~/.gitconfig
# Add includeIf sections (see Scenario 2)

# Amend last commit with correct author
git commit --amend --author="Your Name <work@company.com>"
```

### Issue 2: Sessions Not Showing in Repo

**Problem:** Opened Claude Code but session not registered

**Check:**
```bash
# Verify SessionStart hook path
cat .claude/settings.local.json

# Hook command should have ABSOLUTE path to THIS repo
# ✅ /Users/you/Projects/Permahub/.claude/agents/init-claude-session.sh
# ❌ /Users/you/Projects/OtherRepo/.claude/agents/init-claude-session.sh
```

### Issue 3: Agents Sync to Wrong Repo

**Problem:** Changes pushed to wrong GitHub repository

**Check remote:**
```bash
git remote -v
# Should show correct repo URL

# If wrong
git remote set-url origin git@github.com:correct/repo.git
```

### Issue 4: Config Changes Not Applied

**Problem:** Changed config but agents still use old rules

**Solution:**
```bash
# Verify config loaded
./scripts/git-agents.sh config

# If wrong file shown, check REPO_ROOT
cd /path/to/repo
pwd  # Should match repo root in agent scripts
```

---

## Summary Table

| Aspect | Behavior | Notes |
|--------|----------|-------|
| **Sessions** | Per-repo | Each repo has own sessions |
| **State** | Per-repo | Separate state directories |
| **Config** | Per-repo | Independent settings |
| **Coordination** | Within repo only | No cross-repo coordination |
| **GitHub accounts** | Respects Git config | Uses Git's credential system |
| **Multiple orgs** | Fully supported | Each repo can push to different org |
| **SSH keys** | Respects ~/.ssh/config | Per-remote authentication |
| **Simultaneous repos** | Unlimited | Work on as many as needed |

---

## Quick Reference

### Setup New Repo
```bash
cd /path/to/new-repo
cp -r /path/to/template/.claude/agents .claude/
cp /path/to/template/scripts/git-agents.sh scripts/
chmod +x scripts/git-agents.sh .claude/agents/lib/*.sh .claude/agents/init-claude-session.sh

# Update absolute path in settings
nano .claude/settings.local.json

# Test
./scripts/git-agents.sh init-session
./scripts/git-agents.sh status
```

### Check All Repos
```bash
for repo in ~/Projects/*/; do
  echo "=== $repo ==="
  cd "$repo"
  git remote -v | grep origin
  ./scripts/git-agents.sh status 2>/dev/null || echo "No agents"
  echo ""
done
```

---

**Version:** 1.0.0
**Author:** Libor Ballaty <libor@arionetworks.com>
**Last Updated:** 2025-11-18
