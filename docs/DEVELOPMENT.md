# Permahub Local Development Setup

Complete guide for setting up and running Permahub locally with full FOSS compliance.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [Detailed Setup](#detailed-setup)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)
- [Testing](#testing)
- [Production Deployment](#production-deployment)

## Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Check version: `node --version`

2. **Docker Desktop** (or Docker Engine + Docker Compose)
   - Download: https://www.docker.com/get-started
   - Check version: `docker --version`
   - Must be running before starting Supabase

3. **Supabase CLI**
   - Install: `brew install supabase/tap/supabase` (macOS)
   - Install: `npm install -g supabase` (Cross-platform)
   - Check version: `supabase --version`
   - Docs: https://supabase.com/docs/guides/cli

4. **Make** (optional but recommended)
   - Pre-installed on macOS/Linux
   - Windows: Install via WSL or MinGW

### System Requirements

- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 5GB for Docker images and volumes
- **Ports Required**: 3000 (Supabase Studio), 5432 (PostgreSQL), 8025 (Mailpit), 1025 (SMTP)

## Quick Start

The fastest way to get started:

```bash
# 1. Clone the repository
git clone https://github.com/lballaty/Permahub.git
cd Permahub

# 2. Run automated setup
make setup

# 3. Configure environment (edit .env file)
# Set POSTGRES_PASSWORD, JWT_SECRET, etc.

# 4. Start all services
make start

# 5. Access the application
# - Wiki: http://localhost:3001/src/wiki/wiki-home.html
# - Supabase Studio: http://localhost:3000
# - Mailpit UI: http://localhost:8025
```

That's it! Your local development environment is ready.

## Architecture Overview

### Infrastructure Components

```
┌─────────────────────────────────────────────────────────────┐
│                    PERMAHUB ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────┐                                         │
│  │   Frontend    │  Vanilla HTML/CSS/JS + Vite            │
│  │   (Static)    │  PWA Support, i18n (15 languages)      │
│  └───────┬───────┘                                         │
│          │                                                  │
│          ↓                                                  │
│  ┌───────────────┐                                         │
│  │  Kong Gateway │  API Gateway (Port 8000)               │
│  │  (Docker)     │  Routing, CORS, Rate Limiting          │
│  └───────┬───────┘                                         │
│          │                                                  │
│          ├─────────┬─────────┬─────────┬─────────┐       │
│          ↓         ↓         ↓         ↓         ↓       │
│  ┌───────────┐ ┌─────────┐ ┌───────┐ ┌────────┐ ┌─────┐ │
│  │ PostgREST │ │ GoTrue  │ │ Rtme  │ │Storage │ │Meta │ │
│  │   (API)   │ │ (Auth)  │ │ (WS)  │ │ (S3)   │ │(PG) │ │
│  └─────┬─────┘ └────┬────┘ └───┬───┘ └───┬────┘ └──┬──┘ │
│        │            │          │          │          │    │
│        └────────────┴──────────┴──────────┴──────────┘    │
│                           ↓                                │
│                  ┌─────────────────┐                      │
│                  │   PostgreSQL    │  Database (Port 5432)│
│                  │   + PostGIS     │  RLS Policies        │
│                  └─────────────────┘                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐ │
│  │             Mailpit (Email Testing)                  │ │
│  │  SMTP: localhost:1025  |  UI: http://localhost:8025 │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Service Ports

| Service | Port | Purpose | Access |
|---------|------|---------|--------|
| **Supabase Studio** | 3000 | Admin UI | http://localhost:3000 |
| **PostgreSQL** | 5432 | Database | `psql postgresql://postgres:postgres@localhost:5432/postgres` |
| **PostgREST API** | 8000 | REST API | http://localhost:8000/rest/v1/ |
| **GoTrue Auth** | 8000 | Authentication | http://localhost:8000/auth/v1/ |
| **Realtime** | 8000 | WebSocket | ws://localhost:8000/realtime/v1/ |
| **Storage** | 8000 | File uploads | http://localhost:8000/storage/v1/ |
| **Mailpit Web UI** | 8025 | Email testing | http://localhost:8025 |
| **Mailpit SMTP** | 1025 | Email relay | localhost:1025 |

## Detailed Setup

### Step 1: Install Dependencies

#### macOS

```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install Docker Desktop
brew install --cask docker

# Install Supabase CLI
brew install supabase/tap/supabase

# Install PostgreSQL client (optional, for psql)
brew install postgresql@15
```

#### Linux (Ubuntu/Debian)

```bash
# Install Node.js (using NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Supabase CLI
npm install -g supabase

# Install PostgreSQL client
sudo apt-get install -y postgresql-client
```

#### Windows (WSL2 Recommended)

```powershell
# Install WSL2
wsl --install

# Install Docker Desktop for Windows
# Download from: https://www.docker.com/products/docker-desktop

# Inside WSL2:
# Follow Linux instructions above
```

### Step 2: Clone and Configure

```bash
# Clone repository
git clone https://github.com/lballaty/Permahub.git
cd Permahub

# Install npm dependencies
npm install

# Create environment configuration
cp .env.example .env
```

### Step 3: Configure Environment Variables

Edit `.env` and set the following:

```bash
# Local development configuration
VITE_USE_CLOUD_DB=false

# PostgreSQL password (change this!)
POSTGRES_PASSWORD=your-super-secret-password-here

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)

# Generate Realtime secret
REALTIME_SECRET_KEY_BASE=$(openssl rand -base64 32)

# Local development URLs
SITE_URL=http://localhost:3001/src/wiki/wiki-home.html
SUPABASE_PUBLIC_URL=http://localhost:8000

# Mailpit SMTP (for email testing)
SMTP_HOST=host.docker.internal
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
SMTP_ADMIN_EMAIL=noreply@permahub.local
SMTP_SENDER_NAME=Permahub Community
```

### Step 4: Start Services

```bash
# Start Mailpit (email testing)
docker-compose up -d

# Start Supabase (PostgreSQL + all services)
supabase start

# Verify services are running
make status
```

### Step 5: Access Services

Open your browser to:

1. **Supabase Studio**: http://localhost:3000
   - Username: (see `supabase status` output)
   - Password: (see `supabase status` output)

2. **Mailpit UI**: http://localhost:8025
   - View all emails sent by the application
   - Test magic links, password resets, etc.

3. **Frontend Application**: http://localhost:3001/src/wiki/wiki-home.html
   - Run `npm run dev` to start Vite dev server
   - Or open `src/wiki/wiki-home.html` directly

## Common Tasks

### Starting Development

```bash
# Full restart (recommended after pulling changes)
make restart

# Just start services (if already configured)
make start

# Check if services are healthy
make health
```

### Database Operations

```bash
# View current migration status
make db-status

# Apply new migrations
make db-migrate

# Seed database with test data
make db-seed

# Reset database (⚠️ destroys all data!)
make db-reset

# Dump schema to file
make db-dump

# Connect to database with psql
psql postgresql://postgres:postgres@127.0.0.1:5432/postgres
```

### Viewing Logs

```bash
# View all logs
make logs

# View Supabase logs only
make logs-supabase

# View Mailpit logs only
make logs-mailpit

# View specific service logs
supabase logs --service postgres
supabase logs --service postgrest
supabase logs --service gotrue
```

### Testing Email

1. Trigger an email action (e.g., sign up, password reset)
2. Open Mailpit UI: http://localhost:8025
3. View the email and test links

```bash
# Open Mailpit UI
make open-mailpit
```

### Working with Migrations

```bash
# Create new migration
supabase migration new my_migration_name

# Edit the migration file in supabase/migrations/

# Apply migration
supabase db push

# Revert last migration
supabase db reset
```

### Stopping Services

```bash
# Stop all services
make stop

# Stop only Supabase
supabase stop

# Stop only Docker Compose
docker-compose down
```

## Troubleshooting

### Port Already in Use

**Problem**: `Error: Port 5432 is already in use`

**Solution**:
```bash
# Find process using the port
lsof -i :5432

# Kill the process or stop existing PostgreSQL
brew services stop postgresql
# or
sudo systemctl stop postgresql
```

### Docker Not Running

**Problem**: `Cannot connect to the Docker daemon`

**Solution**:
- Start Docker Desktop application
- Wait for Docker to fully start (whale icon in system tray)
- Verify: `docker ps`

### Supabase Start Fails

**Problem**: `supabase start` command fails

**Solutions**:

1. **Check Docker is running**:
   ```bash
   docker ps
   ```

2. **Check for port conflicts**:
   ```bash
   supabase stop
   docker-compose down
   make start
   ```

3. **Clear Supabase volumes**:
   ```bash
   supabase stop
   supabase db reset
   supabase start
   ```

### Cannot Access Mailpit

**Problem**: `localhost:8025` not accessible

**Solution**:
```bash
# Restart Docker Compose
docker-compose restart mailpit

# Check if container is running
docker ps | grep mailpit

# View logs
docker-compose logs mailpit
```

### Database Connection Issues

**Problem**: `FATAL: password authentication failed`

**Solutions**:

1. **Check .env file**:
   - Ensure `POSTGRES_PASSWORD` matches `supabase/config.toml`

2. **Reset Supabase**:
   ```bash
   supabase stop
   supabase start
   ```

3. **Check connection string**:
   ```bash
   supabase status
   # Copy the DB URL and test with psql
   ```

### Email Not Sending

**Problem**: Magic links or confirmation emails not arriving

**Solutions**:

1. **Check Mailpit is running**:
   ```bash
   docker ps | grep mailpit
   curl http://localhost:8025/
   ```

2. **Check SMTP configuration**:
   - Verify `.env` has correct SMTP settings
   - Restart Supabase: `supabase stop && supabase start`

3. **View GoTrue logs**:
   ```bash
   supabase logs --service gotrue
   ```

### Frontend Can't Connect to API

**Problem**: `Failed to fetch` or CORS errors

**Solutions**:

1. **Check Supabase is running**:
   ```bash
   make status
   ```

2. **Verify configuration**:
   ```bash
   # Check SUPABASE_CONFIG in browser console
   # Should show: URL: http://127.0.0.1:3000
   ```

3. **Check browser console**:
   - F12 → Console tab
   - Look for CORS or network errors

## Testing

### Manual Testing

```bash
# 1. Start services
make start

# 2. Run dev server
npm run dev

# 3. Open browser
open http://localhost:3001/src/wiki/wiki-home.html

# 4. Test features:
# - Sign up (check Mailpit for confirmation email)
# - Login
# - Create guide
# - Upload image
# - Add location
# - Create event
```

### Automated Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- wiki-home

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Database Testing

```bash
# Seed test data
make db-seed

# Run query tests
psql postgresql://postgres:postgres@127.0.0.1:5432/postgres -f tests/queries.sql

# Test RLS policies
psql postgresql://postgres:postgres@127.0.0.1:5432/postgres -c "SET ROLE anon; SELECT * FROM wiki_guides;"
```

## Production Deployment

### Environment Variables

For production deployment, set these environment variables in your hosting platform:

```bash
# REQUIRED for production
VITE_USE_CLOUD_DB=true
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key

# SMTP (use real email service)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_ADMIN_EMAIL=noreply@yourdomain.com

# Site configuration
SITE_URL=https://yourdomain.com
SUPABASE_PUBLIC_URL=https://your-project.supabase.co
```

### Build for Production

```bash
# Build production bundle
npm run build

# Output will be in dist/
ls -la dist/

# Deploy dist/ to your hosting platform
# (Vercel, Netlify, GitHub Pages, etc.)
```

### Self-Hosted Supabase

For fully self-hosted deployment (FOSS compliance):

1. **Use official Supabase Docker Compose**:
   ```bash
   git clone --depth 1 https://github.com/supabase/supabase
   cd supabase/docker
   cp .env.example .env
   docker-compose up -d
   ```

2. **Configure Permahub to use self-hosted**:
   ```bash
   VITE_USE_CLOUD_DB=true
   VITE_SUPABASE_URL=https://your-server.com
   VITE_SUPABASE_ANON_KEY=your-self-hosted-anon-key
   ```

3. **Run migrations**:
   ```bash
   supabase db push --db-url postgresql://postgres:password@your-server:5432/postgres
   ```

See [GLLM_ANALYSIS_REPORT.md](./GLLM_ANALYSIS_REPORT.md) for full self-hosting strategy.

## Makefile Reference

Quick reference for all `make` commands:

| Command | Description |
|---------|-------------|
| `make help` | Show all available commands |
| `make setup` | Initial project setup |
| `make start` | Start all services |
| `make stop` | Stop all services |
| `make restart` | Restart all services |
| `make status` | Show service status |
| `make logs` | View all logs |
| `make db-reset` | Reset database (destructive!) |
| `make db-migrate` | Apply migrations |
| `make db-seed` | Seed test data |
| `make health` | Check service health |
| `make clean` | Clean up and stop |
| `make build` | Build production bundle |

## Additional Resources

- **Supabase CLI Docs**: https://supabase.com/docs/guides/cli
- **Supabase Self-Hosting**: https://supabase.com/docs/guides/self-hosting
- **Vite Documentation**: https://vitejs.dev/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **PostGIS Docs**: https://postgis.net/documentation/

## Getting Help

- **Project Issues**: https://github.com/lballaty/Permahub/issues
- **Supabase Discord**: https://discord.supabase.com/
- **Supabase Discussions**: https://github.com/supabase/supabase/discussions

---

**Questions?** Check [GLLM_ANALYSIS_REPORT.md](./GLLM_ANALYSIS_REPORT.md) for architectural decisions and book alignment.
