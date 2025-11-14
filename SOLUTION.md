# Supabase Local Development - WORKING SOLUTION ✅

**Date:** November 13, 2025
**System:** Intel Mac (x86_64) with Colima 0.8.4, Supabase CLI 2.58.5

---

## THE PROBLEM

Supabase CLI was failing with:
```
failed to start docker container: Error response from daemon:
error while creating mount source path '/Users/liborballaty/.colima/default/docker.sock':
mkdir /Users/liborballaty/.colima/default/docker.sock: operation not supported
```

## THE ROOT CAUSE

The **analytics service** (formerly Logflare) in Supabase tries to mount the Docker socket file directly, which is **not supported** by Colima's VZ framework on macOS (both Intel and ARM).

## THE SOLUTION

**Disable analytics in `supabase/config.toml`:**

```toml
[analytics]
enabled = false  # ← Change this from true to false
port = 54327
backend = "postgres"
```

That's it! After this change, `supabase start` works perfectly.

---

## Complete Setup Instructions

### 1. Initial Setup (One Time)

```bash
# 1. Start Colima if not running
colima start

# 2. Initialize Supabase in your project (if not done)
supabase init

# 3. Disable analytics in config.toml
# Edit supabase/config.toml and set: enabled = false under [analytics]

# 4. Start Supabase
supabase start
```

### 2. Daily Usage

```bash
# Morning: Start Supabase
supabase start

# Evening: Stop Supabase (optional, saves RAM)
supabase stop

# Check status anytime
supabase status
```

---

## Current Status

**8 Containers Running:**
- ✅ supabase_db_Permahub (PostgreSQL 17.6.1)
- ✅ supabase_kong_Permahub (API Gateway)
- ✅ supabase_auth_Permahub (GoTrue Auth)
- ✅ supabase_realtime_Permahub (Realtime server)
- ✅ supabase_storage_Permahub (Storage API)
- ✅ supabase_rest_Permahub (PostgREST)
- ✅ supabase_inbucket_Permahub (Email testing)
- ✅ supabase_edge_runtime_Permahub (Edge Functions runtime)

**Stopped (Not Needed):**
- supabase_analytics_Permahub (disabled to avoid socket mounting issue)
- supabase_studio_Permahub (can be enabled if needed)
- supabase_imgproxy_Permahub (image optimization, optional)
- supabase_vector_Permahub (vector embeddings, optional)
- supabase_pg_meta_Permahub (metadata, optional)
- supabase_pooler_Permahub (connection pooling, optional)

**Service URLs:**
```
API:      http://127.0.0.1:54321
Database: postgresql://postgres:postgres@127.0.0.1:54322/postgres
Mailpit:  http://127.0.0.1:54324

Publishable Key: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
Secret Key:      sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz
```

---

## Why This Works

**Architecture:**
1. Colima creates a Linux VM that runs Docker daemon
2. VM has Docker socket at `/var/run/docker.sock` (standard location)
3. Supabase containers access Docker daemon via normal Docker API
4. **Problem:** Analytics service tried to MOUNT the socket file as a volume
5. **Solution:** Disable analytics → no socket mounting needed

**Trade-offs:**
- ✅ All core features work (Database, Auth, Storage, Realtime)
- ✅ Edge Functions runtime available
- ❌ Local analytics not available (not critical for development)
- ℹ️ Studio can be enabled separately if web UI is needed

---

## Comparison: Intel Mac vs ARM Mac

Both systems use the same solution (disable analytics), the issue affects both architectures equally when using Colima VZ framework.

| Component | Intel Mac | ARM Mac |
|-----------|-----------|---------|
| **Colima Version** | 0.8.4 | 0.8.4 |
| **Supabase CLI** | 2.58.5 | 2.58.5 |
| **Docker Images** | x86_64 | arm64 |
| **Analytics Issue** | Yes | Yes |
| **Solution** | Disable analytics | Disable analytics |
| **Performance** | Good | Excellent (native) |

---

## startsupabase.sh Script Status

For Permahub, a complex startup script is **NOT needed** because:
- No Python backend to manage
- No Edge Functions to deploy/serve
- Just need `supabase start` (which now works)

**Recommendation:** Use simple shell aliases instead:

```bash
# Add to ~/.zshrc:
alias sup='supabase start'
alias sdown='supabase stop'
alias sstat='supabase status'
alias slogs='supabase logs'
```

---

## Next Steps for Development

### 1. Apply Database Schema

```bash
# Option A: Via psql
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres \
  -f database/wiki-complete-schema.sql

# Option B: Via Supabase migrations
cp database/wiki-complete-schema.sql supabase/migrations/20251113000000_wiki_schema.sql
supabase db reset
```

### 2. Configure Frontend

```bash
# Create .env.local
cat > .env.local << 'EOF'
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
EOF
```

### 3. Start Development

```bash
# Terminal 1: Supabase (already running)
supabase status

# Terminal 2: Frontend
npm run dev
```

### 4. Test Connection

Open http://localhost:3000 and test in browser console:
```javascript
// Check wikiAPI loaded
console.log('wikiAPI:', typeof window.wikiAPI);

// Test database connection
const guides = await wikiAPI.guides.getAll();
console.log('Guides:', guides);
```

---

## Files Modified

1. **supabase/config.toml**
   - Changed: `[analytics] enabled = false`
   - Why: Prevents Docker socket mounting issue

2. **~/.zshrc** (reverted)
   - Removed: `export DOCKER_HOST="unix://${HOME}/.colima/default/docker.sock"`
   - Why: This was causing the problem, not solving it

---

## Troubleshooting

### If socket error returns:
```bash
# Verify analytics is disabled
grep "enabled = false" supabase/config.toml

# Clean restart
supabase stop
docker volume prune
supabase start
```

### If ports are occupied:
```bash
# Check what's using ports
lsof -i :54321 -i :54322

# Stop cleanly
supabase stop

# Force kill if needed
docker ps --filter "name=supabase" -q | xargs docker kill
```

### If Docker not accessible:
```bash
# Check Colima
colima status

# Restart if needed
colima stop && colima start

# Verify Docker connection
docker ps
```

---

## Summary

✅ **Problem Identified:** Analytics service mounting Docker socket
✅ **Solution Applied:** Disabled analytics in config.toml
✅ **Result:** Supabase running successfully with all core features
✅ **Verification:** 8 containers healthy, all ports accessible
✅ **Next:** Apply schema, configure frontend, start developing

**Time to Solution:** ~3 hours of debugging
**Complexity:** Simple one-line config change
**Impact:** Zero loss of functionality for development use case

---

**Status: RESOLVED** 🎉
