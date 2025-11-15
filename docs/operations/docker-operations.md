# Docker Destructive Operations - Comprehensive Catalog

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/DOCKER_DESTRUCTIVE_OPERATIONS.md

**Description:** Complete list of all destructive database operations that can be run through Docker

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-15

---

## Overview

Docker provides multiple ways to execute destructive database operations, bypassing traditional command-line restrictions. This document catalogs ALL possible Docker-based destructive operations.

---

## Category 1: docker exec - Direct SQL Execution

### PostgreSQL Commands via docker exec

```bash
# DROP commands
docker exec supabase_db_permahub psql -U postgres -c "DROP TABLE users CASCADE;"
docker exec supabase-db psql -U postgres -c "DROP DATABASE postgres;"
docker exec -it supabase_db psql -U postgres -c "DROP SCHEMA public CASCADE;"

# TRUNCATE commands
docker exec supabase_db psql -U postgres -c "TRUNCATE TABLE users CASCADE;"
docker exec supabase_db psql -U postgres -c "TRUNCATE TABLE users, projects, resources;"

# DELETE commands
docker exec supabase_db psql -U postgres -c "DELETE FROM users;"
docker exec supabase_db psql -U postgres -c "DELETE FROM users WHERE true;"

# UPDATE commands (bulk)
docker exec supabase_db psql -U postgres -c "UPDATE users SET email='deleted';"

# ALTER commands (destructive)
docker exec supabase_db psql -U postgres -c "ALTER TABLE users DROP COLUMN email;"
```

### Interactive Shell Access

```bash
# Opens interactive psql - can run any SQL
docker exec -it supabase_db psql -U postgres
docker exec -it supabase_db psql -U postgres -d postgres
docker exec -it supabase_db bash  # Then run psql or other commands

# Opens shell with full access
docker exec -it supabase_db /bin/bash
docker exec -it supabase_db sh
```

### Database Drop via docker exec

```bash
# Drop entire database
docker exec supabase_db dropdb postgres
docker exec supabase_db dropdb -f postgres  # Force drop
docker exec supabase_db dropdb --if-exists postgres

# Create/recreate database (destructive)
docker exec supabase_db dropdb postgres && docker exec supabase_db createdb postgres
```

---

## Category 2: docker run - New Container Operations

### Running destructive commands in new containers

```bash
# Run psql in new container connected to network
docker run --rm --network supabase_network postgres:15 psql -h supabase_db -U postgres -c "DROP TABLE users;"

# Run pg_dump with --clean (generates DROP statements)
docker run --rm --network supabase_network postgres:15 pg_dump -h supabase_db -U postgres --clean

# Run dropdb from new container
docker run --rm --network supabase_network postgres:15 dropdb -h supabase_db -U postgres postgres
```

---

## Category 3: docker-compose - Orchestration Commands

### Destructive docker-compose operations

```bash
# Stop and remove containers + volumes (DATA LOSS)
docker-compose down -v
docker-compose down --volumes
docker-compose down --remove-orphans -v

# Remove and recreate (destructive)
docker-compose down && docker-compose up

# Force recreate
docker-compose up --force-recreate
docker-compose up --renew-anon-volumes

# Stop specific service and remove volume
docker-compose stop db && docker volume rm permahub_db_data
```

### Supabase-specific docker-compose

```bash
# Supabase reset via compose
npx supabase stop --no-backup
npx supabase db reset  # Uses docker-compose under the hood

# Manual compose commands
docker-compose -f ~/.supabase/docker-compose.yml down -v
```

---

## Category 4: docker rm - Container Removal

### Remove database containers

```bash
# Remove container (may lose data if no volume)
docker rm supabase_db
docker rm -f supabase_db  # Force remove (kills running container)
docker rm -fv supabase_db  # Force remove + volumes

# Remove all containers
docker rm -f $(docker ps -aq)

# Remove Supabase containers
docker rm -f supabase_db_permahub
docker rm -f $(docker ps -aq --filter "name=supabase")
```

---

## Category 5: docker volume - Data Deletion

### Delete database volumes (PERMANENT DATA LOSS)

```bash
# Remove specific volume
docker volume rm supabase_db_data
docker volume rm permahub_db_data
docker volume rm supabase_db_permahub_data

# Remove all volumes
docker volume rm $(docker volume ls -q)

# Prune unused volumes
docker volume prune
docker volume prune -f  # Force prune without confirmation

# Remove volume even if in use
docker volume rm -f supabase_db_data
```

---

## Category 6: docker cp - File Manipulation

### Modify database files directly

```bash
# Copy malicious SQL into container
docker cp malicious.sql supabase_db:/tmp/
docker exec supabase_db psql -U postgres -f /tmp/malicious.sql

# Replace PostgreSQL config (could disable security)
docker cp postgresql.conf supabase_db:/var/lib/postgresql/data/

# Delete data directory (if container runs as root)
docker exec supabase_db rm -rf /var/lib/postgresql/data
```

---

## Category 7: docker commit - Create Modified Images

### Create compromised database images

```bash
# Modify running container, commit changes
docker exec supabase_db psql -c "DROP TABLE users;"
docker commit supabase_db compromised_db:latest
docker run compromised_db:latest
```

---

## Category 8: docker network - Isolation Bypass

### Network manipulation (security risk)

```bash
# Disconnect database from network (denial of service)
docker network disconnect supabase_network supabase_db

# Connect unauthorized containers to DB network
docker run -it --network supabase_network postgres:15 psql -h supabase_db -U postgres
```

---

## Category 9: docker inspect - Credential Extraction

### Extract credentials to use elsewhere

```bash
# Extract environment variables (passwords, keys)
docker inspect supabase_db | grep -i password
docker inspect supabase_db | grep -i postgres_password

# Use extracted credentials for destructive operations
PGPASSWORD=$(docker inspect supabase_db -f '{{.Config.Env}}' | grep POSTGRES_PASSWORD)
psql -h localhost -U postgres -c "DROP DATABASE postgres;"
```

---

## Category 10: docker logs manipulation

### Delete logs (destroys audit trail)

```bash
# Truncate container logs
truncate -s 0 $(docker inspect --format='{{.LogPath}}' supabase_db)

# Remove log files
docker exec supabase_db rm -rf /var/log/postgresql/*
```

---

## Category 11: docker system - Nuclear Options

### System-wide destructive commands

```bash
# Remove everything (containers, volumes, networks, images)
docker system prune -a --volumes -f

# Stop all containers
docker stop $(docker ps -aq)

# Kill all containers
docker kill $(docker ps -q)
```

---

## Category 12: docker build - Dockerfile-based Operations

### Malicious Dockerfiles

```dockerfile
# Dockerfile that destroys data
FROM postgres:15
RUN dropdb postgres
```

```bash
docker build -t malicious .
docker run malicious
```

---

## Category 13: docker save/load - Image Manipulation

### Replace database image with compromised version

```bash
# Save image, modify, reload
docker save postgres:15 > postgres.tar
# Modify tar file to include destructive scripts
docker load < postgres.tar
```

---

## Category 14: Supabase CLI using Docker

### Supabase commands that use Docker internally

```bash
# These all use Docker under the hood
npx supabase db reset  # Destroys and recreates containers
npx supabase stop --no-backup  # Stops containers, optionally removes volumes
npx supabase db push --destructive  # Applies destructive migrations via Docker
```

---

## Detection Patterns

### All Docker commands that need approval:

```bash
# Pattern 1: docker exec with database access
docker exec * psql *
docker exec * dropdb *
docker exec * pg_dump *
docker exec * pg_restore *
docker exec * bash
docker exec * sh
docker exec * /bin/bash
docker exec * /bin/sh

# Pattern 2: docker exec with destructive SQL patterns
docker exec * DROP *
docker exec * TRUNCATE *
docker exec * DELETE *
docker exec * ALTER * DROP *

# Pattern 3: Container removal
docker rm *
docker container rm *

# Pattern 4: Volume operations
docker volume rm *
docker volume prune *

# Pattern 5: docker-compose destructive operations
docker-compose down *
docker-compose * -v
docker-compose * --volumes

# Pattern 6: System-wide operations
docker system prune *
docker stop $(docker ps *)
docker rm $(docker ps *)
docker volume rm $(docker volume *)

# Pattern 7: Interactive access
docker exec -it *
docker exec --interactive *

# Pattern 8: docker run with network access
docker run * --network * postgres *

# Pattern 9: File copying
docker cp * *.sql *
docker cp * /var/lib/postgresql *

# Pattern 10: Credential inspection
docker inspect * | grep *
```

---

## Recommended Permissions Configuration

### Strict Docker Permissions

```json
{
  "permissions": {
    "allow": [
      "Bash(docker ps:*)",
      "Bash(docker ps -a:*)",
      "Bash(docker images:*)",
      "Bash(docker version:*)",
      "Bash(docker info:*)",
      "Bash(docker logs:* --tail *)",
      "Bash(docker inspect:* --format *)",
      "Bash(docker-compose ps:*)",
      "Bash(docker-compose logs:*)"
    ],
    "ask": [
      "Bash(docker exec:*)",
      "Bash(docker run:*)",
      "Bash(docker rm:*)",
      "Bash(docker container rm:*)",
      "Bash(docker volume rm:*)",
      "Bash(docker volume prune:*)",
      "Bash(docker-compose down:*)",
      "Bash(docker-compose up:*)",
      "Bash(docker-compose restart:*)",
      "Bash(docker stop:*)",
      "Bash(docker kill:*)",
      "Bash(docker system prune:*)",
      "Bash(docker cp:*)",
      "Bash(docker commit:*)",
      "Bash(docker build:*)",
      "Bash(docker network disconnect:*)",
      "Bash(docker network connect:*)",
      "Bash(docker inspect:* | grep:*)",
      "Bash(docker inspect:* | jq:*)"
    ]
  }
}
```

---

## Testing Docker Safety

### Test Script

```bash
#!/bin/bash
# test-docker-safety.sh

echo "Testing Docker safety hooks..."

# These should require approval:
echo "Test 1: docker exec psql"
docker exec supabase_db psql -U postgres -c "SELECT 1;" 2>&1 | grep -q "approval" && echo "✅ BLOCKED" || echo "❌ ALLOWED"

echo "Test 2: docker exec bash"
docker exec -it supabase_db bash 2>&1 | grep -q "approval" && echo "✅ BLOCKED" || echo "❌ ALLOWED"

echo "Test 3: docker volume rm"
docker volume rm test_volume 2>&1 | grep -q "approval" && echo "✅ BLOCKED" || echo "❌ ALLOWED"

echo "Test 4: docker-compose down -v"
docker-compose down -v 2>&1 | grep -q "approval" && echo "✅ BLOCKED" || echo "❌ ALLOWED"

# These should be allowed:
echo "Test 5: docker ps (safe)"
docker ps >/dev/null 2>&1 && echo "✅ ALLOWED" || echo "❌ BLOCKED"

echo "Test 6: docker logs (safe)"
docker logs supabase_db --tail 10 >/dev/null 2>&1 && echo "✅ ALLOWED" || echo "❌ BLOCKED"
```

---

## Real-World Attack Scenarios

### Scenario 1: Accidental Container Removal

```bash
# Developer thinks they're cleaning up test containers
docker rm -f supabase_db

# Result: Production database container removed
# Data may be lost if volumes not properly configured
```

**Prevention:** Require approval for `docker rm`

### Scenario 2: Volume Prune After Migration

```bash
# Developer cleans up after testing
docker volume prune -f

# Result: Database volume deleted, all data lost
```

**Prevention:** Require approval for `docker volume prune`

### Scenario 3: docker-compose Restart with -v

```bash
# Developer attempts to restart services
docker-compose down -v && docker-compose up

# Result: -v flag deletes volumes, all data lost
```

**Prevention:** Require approval for `docker-compose down -v`

### Scenario 4: Direct SQL via docker exec

```bash
# AI attempts to "clean up test data"
docker exec supabase_db psql -U postgres -c "DELETE FROM users WHERE created_at < '2024-01-01';"

# Result: Production users deleted
```

**Prevention:** Require approval for `docker exec * psql`

---

## Enhanced Strict Configuration

### Updated .claude/settings.local.json.strict

All these Docker patterns should be in the "ask" list:

```json
"Bash(docker exec:*)",
"Bash(docker run:* psql:*)",
"Bash(docker run:* dropdb:*)",
"Bash(docker run:* pg_dump:*)",
"Bash(docker run:* pg_restore:*)",
"Bash(docker rm:*)",
"Bash(docker container rm:*)",
"Bash(docker volume rm:*)",
"Bash(docker volume prune:*)",
"Bash(docker-compose down:*)",
"Bash(docker-compose:* -v:*)",
"Bash(docker-compose:* --volumes:*)",
"Bash(docker stop:*)",
"Bash(docker kill:*)",
"Bash(docker system prune:*)",
"Bash(docker cp:* *.sql:*)",
"Bash(docker commit:*)",
"Bash(docker build:*)",
"Bash(docker network disconnect:*)",
"Bash(docker save:*)",
"Bash(docker load:*)"
```

---

## Summary

**Docker provides 14+ categories of destructive database operations.**

**Key risks:**
1. Direct SQL execution via `docker exec psql`
2. Container removal losing data
3. Volume deletion (permanent data loss)
4. Interactive shell access
5. docker-compose operations with volume flags

**Protection strategy:**
- ✅ Allow read-only Docker commands (ps, logs, images)
- ⚠️ Require approval for ALL docker exec commands
- ⚠️ Require approval for container/volume removal
- ⚠️ Require approval for docker-compose operations

**Next step:** Update strict configuration to include all Docker patterns.

---

**Last Updated:** 2025-11-15

**Status:** Comprehensive Docker destructive operations cataloged
