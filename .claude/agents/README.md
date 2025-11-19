# Git Agent System - Intelligent Multi-Session Commit & Sync Management

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/.claude/agents/README.md
**Description:** Complete documentation for the Git Agent system - reusable across repositories
**Author:** Libor Ballaty <libor@arionetworks.com>
**Created:** 2025-11-18
**Version:** 1.0.0

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Multi-Session Coordination](#multi-session-coordination)
- [Agents](#agents)
- [Troubleshooting](#troubleshooting)
- [Porting to Other Repositories](#porting-to-other-repositories)

---

## Overview

The Git Agent System is an intelligent, multi-session aware automation framework that:

1. **Enforces incremental commits** - Automatically prevents batched commits (max 2 files per commit)
2. **Validates commit quality** - Checks conventional commit format and atomicity
3. **Coordinates across sessions** - Multiple Claude Code sessions work together safely
4. **Intelligent GitHub sync** - Adaptive sync timing based on activity patterns
5. **Conflict prevention** - Lock-based coordination prevents race conditions

**Problem Solved:**
You no longer need to remind Claude (or yourself) about incremental commits or when to sync. The agents handle everything automatically.

**Design Philosophy:**
- **Zero Mental Overhead** - The system enforces best practices automatically
- **Multi-Session Safe** - Works with multiple Claude Code sessions simultaneously
- **Session-Scoped** - Only runs when Claude Code is active in this repo
- **No Background Daemons** - No processes running when you're not working

---

## Key Features

### 1. Incremental Commit Enforcement
- **Automatic validation** - Blocks commits with >2 files
- **Conventional commits** - Encourages `feat:`, `fix:`, etc. format
- **FixRecord integration** - Prompts for documentation on bug fixes
- **Lock-based safety** - Prevents concurrent commit conflicts

### 2. Intelligent Sync Timing
- **Activity-aware** - Syncs more frequently during active development
- **Idle detection** - Syncs when you take breaks
- **Work hours recognition** - Learns your patterns (9am-6pm default)
- **Conflict detection** - Warns before diverged branches

### 3. Multi-Session Coordination
- **Session registry** - Tracks all active Claude Code sessions
- **Heartbeat system** - Detects and cleans up stale sessions
- **Shared locks** - Prevents race conditions on commits/syncs
- **Activity logging** - Unified log across all sessions

### 4. Claude Code Integration
- **Auto-initialization** - Sessions start automatically when you open Claude Code
- **Permission-based** - Uses Claude Code's permission system
- **Hook-driven** - Integrates via SessionStart hooks
- **Zero setup** - Works immediately after installation

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 Claude Code Sessions                     │
│  (Multiple sessions can run simultaneously)              │
└────────────────┬────────────────────────────────────────┘
                 │
    ┌────────────┼────────────┬──────────────┐
    ▼            ▼            ▼              ▼
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│Session 1│  │Session 2│  │Session 3│  │Session N│
└────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘
     │            │            │            │
     └────────────┴────────────┴────────────┘
                  │
     ┌────────────┴─────────────────────────┐
     ▼                                      ▼
┌──────────────────┐            ┌──────────────────┐
│  Shared State    │            │  Coordination    │
│  (.claude/       │            │  Libraries       │
│   agents/state/) │            │  (lib/*.sh)      │
└──────────────────┘            └──────────────────┘
     │                                      │
     ├─ active-sessions.json                ├─ session-coordinator.sh
     ├─ commit-queue.json                   ├─ commit-coordinator.sh
     ├─ sync-state.json                     └─ sync-coordinator.sh
     ├─ activity.log
     └─ session-*.heartbeat
```

### Components

1. **Session Coordinator** - Registers/unregisters sessions, heartbeat management
2. **Commit Coordinator** - Validates commits, manages commit locks
3. **Sync Coordinator** - Intelligent sync timing, conflict detection
4. **CLI (git-agents.sh)** - Main command interface
5. **Init Hook** - Auto-initializes sessions when Claude Code starts

---

## Installation

### Prerequisites

- **Git repository** - Must be a Git repo
- **Claude Code** - VSCode extension or CLI
- **Bash 4.0+** - (macOS/Linux)
- **jq** (optional) - For better JSON handling: `brew install jq` (macOS) or `apt install jq` (Linux)

### Quick Setup

```bash
# 1. Copy the agent system to your repo
cp -r /path/to/Permahub/.claude/agents /path/to/your-repo/.claude/

# 2. Copy the git-agents.sh CLI script
cp /path/to/Permahub/scripts/git-agents.sh /path/to/your-repo/scripts/

# 3. Make scripts executable
chmod +x /path/to/your-repo/scripts/git-agents.sh
chmod +x /path/to/your-repo/.claude/agents/lib/*.sh
chmod +x /path/to/your-repo/.claude/agents/init-claude-session.sh

# 4. Update your .claude/settings.local.json
```

Add to `.claude/settings.local.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(git:*)",
      "Bash(./scripts/git-agents.sh:*)"
    ]
  },
  "hooks": {
    "SessionStart": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "/absolute/path/to/your-repo/.claude/agents/init-claude-session.sh"
          }
        ]
      }
    ]
  }
}
```

**Important:** Update the absolute path in the SessionStart hook to match your repository location.

### Verification

```bash
# Test the CLI
./scripts/git-agents.sh help

# Initialize a session manually
./scripts/git-agents.sh init-session

# Check status
./scripts/git-agents.sh status
```

---

## Usage

### Automatic Usage (Recommended)

Once installed, the agents work automatically:

1. **Open Claude Code** in your repository
2. **Agents auto-initialize** (you'll see a message)
3. **Make changes** and ask Claude to commit
4. **Claude uses the agents** automatically to:
   - Validate commit atomicity
   - Check commit message format
   - Coordinate with other sessions
   - Sync at appropriate times

**You don't need to do anything!** The agents enforce best practices automatically.

### Manual Commands

```bash
# Session Management
./scripts/git-agents.sh init-session        # Start a new session
./scripts/git-agents.sh end-session <id>    # End a session
./scripts/git-agents.sh status              # View all sessions and status
./scripts/git-agents.sh cleanup             # Remove stale sessions

# Commits (with validation)
./scripts/git-agents.sh commit "feat: Add feature" src/file1.js src/file2.js

# Sync
./scripts/git-agents.sh sync                # Intelligent sync to GitHub
./scripts/git-agents.sh sync-check          # Check if sync needed (non-blocking)

# Monitoring
./scripts/git-agents.sh activity            # View recent activity log
./scripts/git-agents.sh config              # Show current configuration
```

### Example Workflow

**Scenario: Working in Two Claude Code Sessions**

**Terminal 1 (Session A):**
```
You: "Claude, add a new wiki feature"
Claude: [Initializes session automatically]
Claude: [Modifies wiki-guides.js]
Claude: [Validates: 1 file, passes]
Claude: [Acquires commit lock]
Claude: [Commits: "feat: Add wiki guides functionality"]
Claude: [Releases lock]
```

**Terminal 2 (Session B):**
```
You: "Claude, fix the editor bug"
Claude: [Initializes session - sees Session A active]
Claude: [Modifies wiki-editor.js]
Claude: [Validates: 1 file, passes]
Claude: [Waits for commit lock... Session A is committing]
Claude: [Lock acquired]
Claude: [Commits: "fix: Resolve editor loading issue"]
Claude: [Releases lock]
```

**Later (Either session):**
```
Claude: [Detects idle period - 15 minutes no activity]
Claude: [Checks: 2 active sessions, both idle]
Claude: [Acquires sync lock]
Claude: [Syncs 2 commits to GitHub]
Claude: [Other session sees sync completed, skips]
```

---

## Configuration

### Configuration File

Location: `.claude/agents/config.json`

```json
{
  "version": "1.0.0",
  "agents": {
    "smartWatch": {
      "enabled": true,
      "quietPeriodSeconds": 180,
      "maxFilesPerCommit": 2,
      "excludePaths": ["node_modules", "dist", ".env"]
    },
    "commitQuality": {
      "enabled": true,
      "enforceConventionalCommits": true,
      "maxFilesPerCommit": 2,
      "requireAtomicity": true,
      "allowedPrefixes": ["feat", "fix", "docs", "refactor", "test", "chore"]
    },
    "syncIntelligence": {
      "enabled": true,
      "adaptiveInterval": true,
      "minIntervalSeconds": 1800,
      "maxIntervalSeconds": 14400,
      "workHoursStart": "09:00",
      "workHoursEnd": "18:00"
    }
  },
  "sessionCoordination": {
    "heartbeatIntervalSeconds": 60,
    "staleSessionTimeoutSeconds": 300,
    "commitLockTimeoutSeconds": 30,
    "syncLockTimeoutSeconds": 120
  }
}
```

### Key Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `maxFilesPerCommit` | 2 | Maximum files per commit (enforces incremental) |
| `quietPeriodSeconds` | 180 | Wait time before suggesting commit (3 min) |
| `minIntervalSeconds` | 1800 | Minimum sync interval (30 min) |
| `maxIntervalSeconds` | 14400 | Maximum sync interval (4 hours) |
| `workHoursStart` | "09:00" | Start of typical work day |
| `workHoursEnd` | "18:00" | End of typical work day |
| `staleSessionTimeoutSeconds` | 300 | When to consider session dead (5 min) |

### Editing Configuration

```bash
# View current config
./scripts/git-agents.sh config

# Edit config
./scripts/git-agents.sh config-edit

# Or manually edit
nano .claude/agents/config.json
```

---

## Multi-Session Coordination

### How It Works

1. **Session Registration**
   - Each Claude Code session gets a unique ID
   - Registered in `active-sessions.json`
   - Heartbeat updated every 60 seconds

2. **Commit Coordination**
   - Before committing, session acquires `.git/commit.lock`
   - Other sessions wait gracefully
   - Lock auto-expires after 30 seconds (prevents deadlock)

3. **Sync Coordination**
   - Before syncing, session acquires `.claude/agents/state/sync.lock`
   - Other sessions see sync in progress, skip
   - Only one session syncs at a time

4. **Stale Session Cleanup**
   - If heartbeat older than 5 minutes, session marked stale
   - Automatically removed from active list
   - Locks released if held

### Session States

```json
{
  "id": "abc123",
  "pid": 12345,
  "startTime": "2025-11-18 14:30:00",
  "lastHeartbeat": "2025-11-18 14:45:00",
  "status": "active"
}
```

### Viewing Active Sessions

```bash
./scripts/git-agents.sh status
```

Output:
```
=== Git Agent System Status ===

Active Sessions: 2

  abc123
    Last heartbeat: 2025-11-18 14:45:00

  def456
    Last heartbeat: 2025-11-18 14:44:30

Repository Status:
  Branch: main
  Uncommitted changes: None
  Unpushed commits: 3

Sync Status:
  Last sync: 2025-11-18 14:30:00
  Total syncs: 15
```

---

## Agents

### 1. Session Coordinator
**File:** `.claude/agents/lib/session-coordinator.sh`

**Functions:**
- `register_session()` - Register new session
- `unregister_session()` - Clean up session
- `update_heartbeat()` - Update session liveness
- `cleanup_stale_sessions()` - Remove dead sessions
- `get_active_session_count()` - Count active sessions

### 2. Commit Coordinator
**File:** `.claude/agents/lib/commit-coordinator.sh`

**Functions:**
- `acquire_commit_lock()` - Get exclusive commit access
- `release_commit_lock()` - Release commit lock
- `validate_commit_atomicity()` - Check file count ≤ 2
- `validate_commit_message()` - Check conventional format
- `check_fixrecord_requirement()` - Ensure FixRecord.md for fixes
- `safe_commit()` - Perform validated commit

### 3. Sync Coordinator
**File:** `.claude/agents/lib/sync-coordinator.sh`

**Functions:**
- `acquire_sync_lock()` - Get exclusive sync access
- `release_sync_lock()` - Release sync lock
- `should_sync()` - Check if sync needed
- `calculate_sync_interval()` - Adaptive interval based on activity
- `is_work_hours()` - Check if in work hours
- `is_system_idle()` - Detect idle state
- `intelligent_sync()` - Perform smart sync

---

## Troubleshooting

### Session won't initialize

**Problem:** `./scripts/git-agents.sh init-session` fails

**Solutions:**
```bash
# Check if state directory exists
ls -la .claude/agents/state/

# Recreate if missing
mkdir -p .claude/agents/state
echo '[]' > .claude/agents/state/active-sessions.json

# Check permissions
chmod -R 755 .claude/agents/
```

### Commit lock stuck

**Problem:** Can't commit, lock held indefinitely

**Solution:**
```bash
# Force release lock
rm -rf .git/commit.lock

# Or use cleanup
./scripts/git-agents.sh cleanup
```

### Sync lock stuck

**Problem:** Sync always says "in progress"

**Solution:**
```bash
# Force release sync lock
rm -rf .claude/agents/state/sync.lock
```

### Multiple stale sessions

**Problem:** Old sessions lingering

**Solution:**
```bash
# Clean up all stale sessions
./scripts/git-agents.sh cleanup

# Or manually
echo '[]' > .claude/agents/state/active-sessions.json
rm -f .claude/agents/state/session-*.heartbeat
```

### Agents not auto-initializing

**Problem:** SessionStart hook not running

**Check:**
1. Verify `.claude/settings.local.json` has SessionStart hook
2. Check absolute path is correct in hook command
3. Ensure init script is executable: `chmod +x .claude/agents/init-claude-session.sh`
4. Check Claude Code permissions allow the hook to run

---

## Porting to Other Repositories

### Step-by-Step Guide

1. **Copy Agent System**
   ```bash
   # From Permahub to new repo
   cp -r /path/to/Permahub/.claude/agents /path/to/new-repo/.claude/
   cp /path/to/Permahub/scripts/git-agents.sh /path/to/new-repo/scripts/
   ```

2. **Update Paths**

   Edit `/path/to/new-repo/.claude/settings.local.json`:
   ```json
   {
     "hooks": {
       "SessionStart": [
         {
           "matcher": "*",
           "hooks": [
             {
               "type": "command",
               "command": "/ABSOLUTE/PATH/TO/new-repo/.claude/agents/init-claude-session.sh"
             }
           ]
         }
       ]
     }
   }
   ```

   **Critical:** Replace `/ABSOLUTE/PATH/TO/new-repo` with actual path.

3. **Customize Configuration**

   Edit `.claude/agents/config.json`:
   - Adjust `maxFilesPerCommit` if needed
   - Update `workHoursStart`/`workHoursEnd` for your timezone
   - Modify `excludePaths` for your project structure

4. **Test Installation**
   ```bash
   cd /path/to/new-repo
   ./scripts/git-agents.sh help
   ./scripts/git-agents.sh init-session
   ./scripts/git-agents.sh status
   ```

5. **Commit the Agent System**
   ```bash
   git add .claude/agents/ scripts/git-agents.sh .claude/settings.local.json
   git commit -m "feat: Add Git Agent system for intelligent commit management"
   git push
   ```

### Repository-Specific Customizations

**For monorepos:**
```json
{
  "agents": {
    "commitQuality": {
      "maxFilesPerCommit": 3
    }
  }
}
```

**For teams with different work hours:**
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

**For high-activity projects:**
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

## Advanced Topics

### Extending the Agents

**Add a new agent:**

1. Create `.claude/agents/lib/my-agent.sh`
2. Source session-coordinator.sh
3. Implement your logic
4. Source it in `scripts/git-agents.sh`
5. Add commands to CLI

**Example structure:**
```bash
#!/bin/bash
source "$(dirname "${BASH_SOURCE[0]}")/session-coordinator.sh"

my_agent_function() {
    local session_id="$1"
    log_activity "$session_id" "MY_ACTION" "Details"
    # Your logic here
}

export -f my_agent_function
```

### Integration with CI/CD

The agents are designed for local development, but you can use the CLI in CI:

```yaml
# .github/workflows/check-commits.yml
- name: Validate commit atomicity
  run: |
    for commit in $(git log origin/main..HEAD --format=%H); do
      git show --name-only --format= $commit | \
        ./scripts/git-agents.sh validate || exit 1
    done
```

---

## FAQ

**Q: Do agents run 24/7?**
A: No. Agents only run when Claude Code sessions are active. They stop when you close VSCode/Claude Code.

**Q: What if I need to bypass validation?**
A: Use git directly: `git commit --no-verify -m "message"`. But this defeats the purpose.

**Q: Can I use this without Claude Code?**
A: Yes! Use the CLI manually: `./scripts/git-agents.sh commit "message" file.js`

**Q: Does this work on Windows?**
A: Currently macOS/Linux only. Windows support would require PowerShell port.

**Q: How much overhead does this add?**
A: Minimal. ~0.5-1 second per commit for validation. Sync is asynchronous.

---

## License

MIT License - Free to use, modify, and distribute.

---

## Support

**Issues:** https://github.com/lballaty/Permahub/issues
**Author:** Libor Ballaty <libor@arionetworks.com>
**Version:** 1.0.0
**Last Updated:** 2025-11-18
