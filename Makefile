# Permahub Infrastructure Makefile
# Orchestrates local development environment with Supabase CLI + Docker Compose
# For FOSS compliance and Infrastructure-as-Code principles

.PHONY: help setup start stop restart status logs db-reset db-migrate db-seed clean test build deploy health check-deps

# Default target: show help
help:
	@echo "🌱 Permahub Infrastructure Commands"
	@echo ""
	@echo "📦 Setup & Installation:"
	@echo "  make setup          - Initial project setup (install deps, create .env)"
	@echo "  make check-deps     - Check if required dependencies are installed"
	@echo ""
	@echo "🚀 Development Server:"
	@echo "  make start          - Start all services (Supabase + Mailpit + Dev server)"
	@echo "  make stop           - Stop all services"
	@echo "  make restart        - Restart all services"
	@echo "  make status         - Show status of all services"
	@echo ""
	@echo "📊 Logs & Monitoring:"
	@echo "  make logs           - Show logs from all services"
	@echo "  make logs-supabase  - Show Supabase logs only"
	@echo "  make logs-mailpit   - Show Mailpit logs only"
	@echo ""
	@echo "🗄️  Database Operations:"
	@echo "  make db-reset       - Reset database (⚠️  destroys all data!)"
	@echo "  make db-migrate     - Run database migrations"
	@echo "  make db-seed        - Seed database with test data"
	@echo "  make db-status      - Show database migration status"
	@echo "  make db-dump        - Dump database schema to file"
	@echo ""
	@echo "🧹 Cleanup:"
	@echo "  make clean          - Remove generated files and stop services"
	@echo "  make clean-volumes  - Remove Docker volumes (⚠️  destroys all data!)"
	@echo ""
	@echo "🏗️  Build & Deploy:"
	@echo "  make build          - Build production bundle"
	@echo "  make test           - Run tests"
	@echo ""
	@echo "🏥 Health & Diagnostics:"
	@echo "  make health         - Check health of all services"
	@echo "  make open-studio    - Open Supabase Studio in browser"
	@echo "  make open-mailpit   - Open Mailpit UI in browser"

# Check if required dependencies are installed
check-deps:
	@echo "🔍 Checking dependencies..."
	@command -v node >/dev/null 2>&1 || { echo "❌ Node.js is not installed. Visit: https://nodejs.org/"; exit 1; }
	@command -v npm >/dev/null 2>&1 || { echo "❌ npm is not installed. Visit: https://nodejs.org/"; exit 1; }
	@command -v docker >/dev/null 2>&1 || { echo "❌ Docker is not installed. Visit: https://www.docker.com/get-started"; exit 1; }
	@command -v supabase >/dev/null 2>&1 || { echo "❌ Supabase CLI is not installed. Run: brew install supabase/tap/supabase"; exit 1; }
	@echo "✅ All dependencies are installed!"

# Initial project setup
setup: check-deps
	@echo "🌱 Setting up Permahub development environment..."
	@if [ ! -f .env ]; then \
		echo "📝 Creating .env file from .env.example..."; \
		cp .env.example .env; \
		echo "⚠️  Please edit .env and set your configuration values!"; \
	else \
		echo "✅ .env file already exists"; \
	fi
	@echo "📦 Installing npm dependencies..."
	npm install
	@echo "🐳 Starting Docker services (Mailpit)..."
	docker-compose up -d
	@echo "🗄️  Starting Supabase..."
	supabase start
	@echo ""
	@echo "✅ Setup complete! Run 'make status' to verify all services are running."
	@echo "🌐 Access points:"
	@echo "   - Supabase Studio: http://localhost:3000"
	@echo "   - Mailpit UI: http://localhost:8025"

# Start all services
start:
	@echo "🚀 Starting all services..."
	@echo "🐳 Starting Docker Compose services (Mailpit)..."
	docker-compose up -d
	@echo "🗄️  Starting Supabase..."
	supabase start
	@echo "✅ All services started!"
	@make status

# Stop all services
stop:
	@echo "🛑 Stopping all services..."
	@echo "🗄️  Stopping Supabase..."
	supabase stop
	@echo "🐳 Stopping Docker Compose services..."
	docker-compose down
	@echo "✅ All services stopped!"

# Restart all services
restart: stop start

# Show status of all services
status:
	@echo "📊 Service Status:"
	@echo ""
	@echo "🗄️  Supabase Status:"
	@supabase status 2>/dev/null || echo "❌ Supabase is not running. Run 'make start' to start it."
	@echo ""
	@echo "🐳 Docker Compose Status:"
	@docker-compose ps 2>/dev/null || echo "❌ Docker Compose services not running."

# Show logs from all services
logs:
	@echo "📋 Showing logs from all services..."
	@echo "Press Ctrl+C to stop"
	@docker-compose logs -f &
	@supabase logs --follow

# Show Supabase logs only
logs-supabase:
	@echo "📋 Showing Supabase logs..."
	@supabase logs --follow

# Show Mailpit logs only
logs-mailpit:
	@echo "📋 Showing Mailpit logs..."
	@docker-compose logs -f mailpit

# Reset database (destructive!)
db-reset:
	@echo "⚠️  WARNING: This will destroy all data in your local database!"
	@read -p "Are you sure? Type 'yes' to continue: " confirm; \
	if [ "$$confirm" = "yes" ]; then \
		echo "🗑️  Resetting database..."; \
		supabase db reset; \
		echo "✅ Database reset complete!"; \
	else \
		echo "❌ Aborted."; \
	fi

# Run database migrations
db-migrate:
	@echo "🔄 Running database migrations..."
	@supabase db push
	@echo "✅ Migrations applied!"

# Seed database with test data
db-seed:
	@echo "🌱 Seeding database with test data..."
	@if [ -f supabase/seed.sql ]; then \
		supabase db reset --db-url postgresql://postgres:postgres@127.0.0.1:5432/postgres; \
		echo "✅ Database seeded!"; \
	else \
		echo "⚠️  No seed.sql file found in supabase/ directory"; \
	fi

# Show database migration status
db-status:
	@echo "📊 Database Migration Status:"
	@supabase migration list

# Dump database schema
db-dump:
	@echo "💾 Dumping database schema..."
	@supabase db dump -f supabase/schema_dump_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ Schema dumped to supabase/schema_dump_*.sql"

# Clean up generated files and stop services
clean: stop
	@echo "🧹 Cleaning up..."
	@echo "🗑️  Removing node_modules..."
	@rm -rf node_modules
	@echo "🗑️  Removing build artifacts..."
	@rm -rf dist
	@echo "✅ Cleanup complete!"

# Remove Docker volumes (destructive!)
clean-volumes: stop
	@echo "⚠️  WARNING: This will delete all Docker volumes and data!"
	@read -p "Are you sure? Type 'yes' to continue: " confirm; \
	if [ "$$confirm" = "yes" ]; then \
		echo "🗑️  Removing Docker volumes..."; \
		docker-compose down -v; \
		echo "✅ Volumes removed!"; \
	else \
		echo "❌ Aborted."; \
	fi

# Build production bundle
build:
	@echo "🏗️  Building production bundle..."
	@npm run build
	@echo "✅ Build complete! Output in dist/"

# Run tests
test:
	@echo "🧪 Running tests..."
	@npm test

# Health check for all services
health:
	@echo "🏥 Checking service health..."
	@echo ""
	@echo "🗄️  PostgreSQL:"
	@psql postgresql://postgres:postgres@127.0.0.1:5432/postgres -c "SELECT version();" 2>/dev/null && echo "✅ PostgreSQL is healthy" || echo "❌ PostgreSQL is not responding"
	@echo ""
	@echo "🌐 PostgREST API:"
	@curl -s http://127.0.0.1:3000/rest/v1/ >/dev/null && echo "✅ PostgREST is healthy" || echo "❌ PostgREST is not responding"
	@echo ""
	@echo "🔐 GoTrue Auth:"
	@curl -s http://127.0.0.1:3000/auth/v1/health >/dev/null && echo "✅ GoTrue is healthy" || echo "❌ GoTrue is not responding"
	@echo ""
	@echo "📧 Mailpit:"
	@curl -s http://localhost:8025/ >/dev/null && echo "✅ Mailpit is healthy" || echo "❌ Mailpit is not responding"

# Open Supabase Studio in browser
open-studio:
	@echo "🌐 Opening Supabase Studio..."
	@open http://localhost:3000 || xdg-open http://localhost:3000 || echo "Please visit: http://localhost:3000"

# Open Mailpit UI in browser
open-mailpit:
	@echo "📧 Opening Mailpit UI..."
	@open http://localhost:8025 || xdg-open http://localhost:8025 || echo "Please visit: http://localhost:8025"
