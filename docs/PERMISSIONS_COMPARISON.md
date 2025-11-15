# Claude Permissions Configuration Comparison

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/PERMISSIONS_COMPARISON.md

**Description:** Comparison of current vs. strict permissions configuration

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-15

---

## Configuration Files

1. **Current Configuration:** `.claude/settings.local.json`
2. **Strict Configuration:** `.claude/settings.local.json.strict`

---

## Key Differences

### Current Configuration (Permissive)

**Philosophy:** Trust-based, allow broad patterns, rely on documentation

**Characteristics:**
- ✅ Allows `npx supabase:*` (all Supabase commands)
- ✅ Allows `psql:*` (all PostgreSQL commands)
- ✅ Allows `docker exec:*` (all Docker exec commands)
- ⚠️ No restrictions on destructive operations
- ⚠️ Relies on human/AI discipline

**Auto-Allowed Destructive Operations:**
```bash
npx supabase db reset --local          # ✅ Auto-allowed
psql -c "DROP TABLE users;"            # ✅ Auto-allowed
docker exec supabase_db dropdb         # ✅ Auto-allowed
PGPASSWORD=postgres psql -c "TRUNCATE" # ✅ Auto-allowed
```

### Strict Configuration (Secure)

**Philosophy:** Zero-trust, explicit approval required, technical enforcement

**Characteristics:**
- ✅ Only specific safe commands auto-allowed
- ⚠️ All destructive operations require approval
- ⚠️ All database modifications require approval
- ⚠️ All file modifications require approval
- ✅ Backup creation auto-allowed

**Auto-Allowed (Safe Operations Only):**
```bash
git status                             # ✅ Auto-allowed
ls -la                                 # ✅ Auto-allowed
npx supabase status                    # ✅ Auto-allowed
./scripts/db-backup.sh                 # ✅ Auto-allowed
cat somefile.sql                       # ✅ Auto-allowed
```

**Requires Approval:**
```bash
npx supabase db reset --local          # ⚠️ Requires approval
psql -c "DROP TABLE users;"            # ⚠️ Requires approval
docker exec supabase_db dropdb         # ⚠️ Requires approval
git commit                             # ⚠️ Requires approval
npm install                            # ⚠️ Requires approval
./scripts/db-restore.sh                # ⚠️ Requires approval
```

---

## Detailed Comparison Table

| Operation Category | Current | Strict | Recommendation |
|-------------------|---------|--------|----------------|
| **Database Reset** | ✅ Auto | ⚠️ Ask | **Use Strict** |
| **DROP/TRUNCATE** | ✅ Auto | ⚠️ Ask | **Use Strict** |
| **Backup Creation** | ✅ Auto | ✅ Auto | ✅ Same |
| **Database Restore** | ✅ Auto | ⚠️ Ask | **Use Strict** |
| **Git Read Operations** | ✅ Auto | ✅ Auto | ✅ Same |
| **Git Write Operations** | ✅ Auto | ⚠️ Ask | **Use Strict** |
| **npm install** | ✅ Auto | ⚠️ Ask | **Depends** |
| **File Read (cat/grep)** | ✅ Auto | ✅ Auto | ✅ Same |
| **File Delete (rm)** | ⚠️ Some | ⚠️ Ask | **Use Strict** |
| **Docker Exec** | ✅ Auto | ⚠️ Ask | **Use Strict** |
| **Migration Apply** | ✅ Auto | ⚠️ Ask | **Use Strict** |
| **Edit .env** | ✅ Auto | ⚠️ Ask | **Use Strict** |
| **Edit migrations/** | ✅ Auto | ⚠️ Ask | **Use Strict** |

---

## Risk Assessment

### Current Configuration

**Security Level:** ⚠️ Medium

**Risks:**
1. AI could accidentally run destructive command
2. User could approve without reading
3. No technical enforcement layer
4. Relies entirely on documentation compliance

**When to Use:**
- Solo developer who understands all risks
- Frequent database reset workflows
- Development environment only
- User carefully reviews every operation

### Strict Configuration

**Security Level:** ✅ High

**Benefits:**
1. ✅ Technical enforcement of safety procedures
2. ✅ User must explicitly approve destructive operations
3. ✅ Clear audit trail (every approval is visible)
4. ✅ Prevents accidental destructive commands
5. ✅ Protects against AI autonomous errors

**When to Use:**
- Production or staging environments
- Team collaboration
- High-value data
- Regulatory compliance requirements
- Learning/training environments

---

## Migration Guide

### Option 1: Immediate Switch (Recommended)

```bash
# Backup current configuration
cp .claude/settings.local.json .claude/settings.local.json.backup

# Switch to strict configuration
cp .claude/settings.local.json.strict .claude/settings.local.json

# Restart Claude Code (if needed)
```

### Option 2: Gradual Migration

1. **Week 1:** Add destructive operations to "ask" list
2. **Week 2:** Remove broad wildcards
3. **Week 3:** Move to explicit allow-list
4. **Week 4:** Full strict mode

### Option 3: Hybrid Approach

Create different configs for different scenarios:

```bash
.claude/settings.local.json.dev      # Development (current)
.claude/settings.local.json.strict   # Production (strict)
.claude/settings.local.json          # Symlink to active config
```

Switch as needed:
```bash
ln -sf settings.local.json.strict settings.local.json
```

---

## Testing Both Configurations

### Test Script

```bash
#!/bin/bash
# test-permissions.sh

echo "Testing Current Configuration..."
cp .claude/settings.local.json.backup .claude/settings.local.json

echo "Attempting destructive operation..."
npx supabase db reset --local --dry-run
# Should execute without prompt

echo ""
echo "Testing Strict Configuration..."
cp .claude/settings.local.json.strict .claude/settings.local.json

echo "Attempting same destructive operation..."
npx supabase db reset --local --dry-run
# Should prompt for approval

echo "Test complete. Restore your preferred configuration."
```

---

## Recommendations by Environment

### Local Development (Single Developer)

**Recommended:** Strict Configuration

**Rationale:**
- Prevents accidental data loss
- Good habits in development carry to production
- Minimal workflow disruption (just approve when needed)
- Safety net against typos and mistakes

### Local Development (Team)

**Recommended:** Strict Configuration

**Rationale:**
- Different team members have different experience levels
- Shared database states
- Need audit trail of who did what
- Prevents junior developers from accidental destruction

### Staging Environment

**Recommended:** Strict Configuration (Required)

**Rationale:**
- Staging should mirror production
- Contains test data that's valuable
- Multiple users may access
- Need approval workflow for all changes

### Production Environment

**Recommended:** Strict Configuration + Additional Safeguards

**Rationale:**
- Zero tolerance for accidental destruction
- Regulatory compliance
- Audit trail requirements
- Multiple approval layers needed

**Additional safeguards for production:**
```json
{
  "permissions": {
    "allow": [
      "Bash(git status:*)",
      "Bash(npx supabase status:*)"
    ],
    "ask": [
      "*"
    ],
    "deny": [
      "Bash(*DROP*)",
      "Bash(*TRUNCATE*)",
      "Bash(*reset*)",
      "Bash(rm -rf:*)"
    ]
  }
}
```

---

## Implementation Checklist

Before switching to strict configuration:

- [ ] Read [DESTRUCTIVE_OPERATIONS_CATALOG.md](DESTRUCTIVE_OPERATIONS_CATALOG.md)
- [ ] Create backup of current config
- [ ] Review all operations in "ask" list
- [ ] Test workflow with strict config
- [ ] Document any additional safe operations needed
- [ ] Train team on approval workflow (if applicable)
- [ ] Set up audit logging (optional)
- [ ] Schedule review in 1 week

---

## Workflow Changes with Strict Configuration

### Before (Current)

1. Ask AI to reset database
2. AI executes `npx supabase db reset`
3. Done

**Time:** 5 seconds
**Safety:** Low
**Approvals:** 0

### After (Strict)

1. Ask AI to reset database
2. AI attempts `npx supabase db reset`
3. **⚠️ Approval required prompt appears**
4. User reviews the command
5. User checks if backup exists
6. User approves (if safe) or denies
7. Command executes

**Time:** 30 seconds
**Safety:** High
**Approvals:** 1

---

## Common Approval Scenarios

### Scenario 1: Daily Development

**Operations requiring approval:**
- `git commit` (1-5 times/day)
- `npm install` (0-2 times/day)
- `git push` (1-3 times/day)

**Impact:** Minimal - these operations you want to review anyway

### Scenario 2: Database Work

**Operations requiring approval:**
- `npx supabase db reset` (0-1 times/day)
- `./scripts/db-restore.sh` (rare)
- Migration edits (0-1 times/day)

**Impact:** Moderate - but these are critical operations worth reviewing

### Scenario 3: Emergency Recovery

**Operations requiring approval:**
- `./scripts/db-restore.sh` (must approve)
- `psql` commands (must approve)

**Impact:** Acceptable - emergencies require careful review anyway

---

## User Feedback After Switching

Track these metrics after switching to strict mode:

1. **False positives:** Safe operations blocked unnecessarily
2. **Workflow friction:** Time added to common workflows
3. **Prevented errors:** Destructive operations caught before execution
4. **User satisfaction:** Team comfort with safety vs. speed tradeoff

Adjust configuration based on feedback after 1 week.

---

## Rollback Plan

If strict mode causes too much friction:

```bash
# Restore previous configuration
cp .claude/settings.local.json.backup .claude/settings.local.json
```

Then consider hybrid approach:
- Keep some broad wildcards
- Focus on most dangerous operations only
- Document why certain operations are allowed

---

## Conclusion

**Recommendation:** Switch to strict configuration immediately.

**Rationale:**
1. ✅ Prevents catastrophic data loss
2. ✅ Minimal workflow disruption (30 seconds per approval)
3. ✅ Improves safety habits
4. ✅ Provides audit trail
5. ✅ Can always rollback if needed

**Action:**
```bash
cp .claude/settings.local.json.strict .claude/settings.local.json
```

---

**Last Updated:** 2025-11-15

**Recommended Action:** Implement strict configuration now
