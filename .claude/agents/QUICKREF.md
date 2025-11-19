# Git Agent System - Quick Reference

**Version:** 1.0.0 | **Author:** Libor Ballaty | **Created:** 2025-11-18

---

## 🚀 Quick Start

```bash
# Initialize session (auto-runs when Claude Code starts)
./scripts/git-agents.sh init-session

# Check status
./scripts/git-agents.sh status

# Safe commit
./scripts/git-agents.sh commit "feat: Add feature" src/file.js

# Sync to GitHub
./scripts/git-agents.sh sync
```

---

## 📖 Commands

| Command | Description |
|---------|-------------|
| `init-session` | Start new agent session |
| `end-session <id>` | End specific session |
| `status` | Show all sessions & repo status |
| `commit <msg> <files>` | Safe validated commit |
| `sync` | Intelligent GitHub sync |
| `sync-check` | Check if sync needed |
| `activity` | View recent activity log |
| `config` | Show configuration |
| `cleanup` | Remove stale sessions |
| `help` | Full help menu |

---

## ⚙️ Configuration

**File:** `.claude/agents/config.json`

**Key Settings:**
- `maxFilesPerCommit`: 2 (max files per commit)
- `minIntervalSeconds`: 1800 (min sync interval - 30min)
- `workHoursStart/End`: "09:00" / "18:00"
- `staleSessionTimeout`: 300s (5min)

**Edit:** `./scripts/git-agents.sh config-edit`

---

## 🔒 What Agents Enforce

✅ **Max 2 files per commit** (incremental commits)
✅ **Conventional commit format** (feat:, fix:, etc.)
✅ **FixRecord.md for fixes** (prompts if missing)
✅ **Multi-session safety** (lock-based coordination)
✅ **Intelligent sync timing** (based on activity)

---

## 🚫 Troubleshooting

**Lock stuck:**
```bash
rm -rf .git/commit.lock
rm -rf .claude/agents/state/sync.lock
```

**Stale sessions:**
```bash
./scripts/git-agents.sh cleanup
```

**Reset state:**
```bash
echo '[]' > .claude/agents/state/active-sessions.json
```

---

## 📚 Documentation

- **Full Guide:** `.claude/agents/README.md` (comprehensive)
- **Installation:** `.claude/agents/INSTALL.md` (for new repos)
- **This Card:** `.claude/agents/QUICKREF.md` (quick reference)

---

## 🔧 Files & Paths

```
.claude/agents/
├── README.md              # Full documentation
├── INSTALL.md             # Installation guide
├── QUICKREF.md            # This file
├── config.json            # Configuration
├── init-claude-session.sh # Auto-init script
├── lib/
│   ├── session-coordinator.sh  # Session management
│   ├── commit-coordinator.sh   # Commit validation
│   └── sync-coordinator.sh     # Sync intelligence
└── state/
    ├── active-sessions.json    # Active sessions
    ├── commit-queue.json       # Commit coordination
    ├── sync-state.json         # Sync history
    └── activity.log            # Activity log

scripts/git-agents.sh      # Main CLI
```

---

## 💡 Tips

**View active sessions:**
```bash
cat .claude/agents/state/active-sessions.json | jq .
```

**View activity log:**
```bash
tail -f .claude/agents/state/activity.log
```

**Check for uncommitted changes:**
```bash
git status --short
```

**Manual commit (bypass agents):**
```bash
git commit --no-verify -m "message"
# ⚠️ Not recommended - defeats the purpose!
```

---

## 🌐 Multi-Session Behavior

**With 1 session:**
- Commits normally
- Syncs based on activity

**With 2+ sessions:**
- Commits serialize (one at a time via lock)
- Only one session syncs (others skip)
- Stale sessions auto-cleaned after 5min

---

## ⏱️ Sync Timing

| Activity Level | Sync Interval |
|----------------|---------------|
| High (5+ commits/hour) | 30 minutes |
| Moderate (2-5 commits/hour) | 1 hour |
| Low (<2 commits/hour) | 2-4 hours |
| Idle (no commits) | 4 hours |

**Triggers:**
- Idle detection (15 min no activity)
- End of work hours
- Manual: `./scripts/git-agents.sh sync`

---

## 🎯 Best Practices

1. **Let agents auto-initialize** (via SessionStart hook)
2. **Commit incrementally** (1-2 files per commit)
3. **Use conventional commits** (feat:, fix:, docs:, etc.)
4. **Update FixRecord.md** for bug fixes
5. **Let intelligent sync handle pushes** (don't manual push often)
6. **Check status periodically** (`./scripts/git-agents.sh status`)

---

## 🔗 Links

- **Repository:** https://github.com/lballaty/Permahub
- **Issues:** https://github.com/lballaty/Permahub/issues
- **Author:** libor@arionetworks.com

---

**Print this card:** `cat .claude/agents/QUICKREF.md`
