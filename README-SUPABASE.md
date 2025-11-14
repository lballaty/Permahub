# Supabase Local Development - Quick Reference

**Status:** ✅ WORKING
**Last Updated:** November 13, 2025

---

## Quick Start

```bash
# Start Supabase
supabase start

# Check status
supabase status

# Stop when done
supabase stop
```

## Service URLs

Once running, access these URLs:

- **API:** http://127.0.0.1:54321
- **Database:** `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
- **Studio (Web UI):** http://127.0.0.1:54323
- **Email Testing:** http://127.0.0.1:54324

## Keys

```
Publishable: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
Secret:      sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz
```

---

## Important: Analytics Disabled

**Why?** The analytics service has a known incompatibility with Colima on macOS (Docker socket mounting issue).

**Config:** `supabase/config.toml` has `[analytics] enabled = false`

**Impact:** None for development. All core features work perfectly.

---

## Common Tasks

### Apply Schema
```bash
# Via psql
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres \
  -f database/wiki-complete-schema.sql

# OR via Studio
# Open http://127.0.0.1:54323
# Go to SQL Editor, paste schema, run
```

### Reset Database
```bash
supabase db reset
```

### View Logs
```bash
supabase logs
```

### Stop All Containers
```bash
supabase stop
```

---

## Frontend Configuration

Create `.env.local`:
```bash
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
```

Then start dev server:
```bash
npm run dev
```

---

## Troubleshooting

### Colima not running
```bash
colima start
```

### Port conflicts
```bash
lsof -i :54321 :54322 :54323
```

### Clean restart
```bash
supabase stop
docker volume prune -f
supabase start
```

---

## More Information

- [SOLUTION.md](SOLUTION.md) - Detailed explanation of the socket mounting fix
- [LOCAL_SUPABASE_SETUP.md](LOCAL_SUPABASE_SETUP.md) - Complete setup guide
- [Supabase Docs](https://supabase.com/docs/guides/cli/local-development)

---

**Note:** Analytics is intentionally disabled due to Colima compatibility. This doesn't affect any development features.
