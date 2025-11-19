#!/bin/bash

#
# File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/start.sh
# Description: Comprehensive startup script for Permahub - checks services and launches UI
# Author: Libor Ballaty <libor@arionetworks.com>
# Created: 2025-11-15
#

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Configuration
DEV_SERVER_PORT=3001
SUPABASE_PORT=3000
MAILPIT_PORT=54324

# Database selection (default: auto-detect)
DB_MODE="auto"  # Can be: auto, cloud, local

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --cloud)
      DB_MODE="cloud"
      shift
      ;;
    --local)
      DB_MODE="local"
      shift
      ;;
    --help|-h)
      echo "Usage: ./start.sh [--cloud|--local]"
      echo ""
      echo "Options:"
      echo "  --cloud    Force cloud database (skips Supabase startup)"
      echo "  --local    Force local database (requires Supabase running)"
      echo "  (no flag)  Auto-detect based on hostname (default)"
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

echo -e "${BOLD}${CYAN}"
echo "═══════════════════════════════════════════════════════════"
echo "   🌱 Permahub Startup Script"
if [ "$DB_MODE" = "cloud" ]; then
  echo "   Database Mode: 🌐 Cloud (forced)"
elif [ "$DB_MODE" = "local" ]; then
  echo "   Database Mode: 💻 Local (forced)"
else
  echo "   Database Mode: 🔄 Auto-detect"
fi
echo "═══════════════════════════════════════════════════════════"
echo -e "${NC}"

# Function to check if a port is in use
check_port() {
    local port=$1
    lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1
}

# Function to check if Supabase is running
check_supabase() {
    echo -ne "${BLUE}📦 Checking Supabase status...${NC} "

    # Check using supabase CLI
    if command -v supabase &> /dev/null; then
        if supabase status &> /dev/null; then
            # Get the actual API port from supabase status
            local api_url=$(supabase status 2>/dev/null | grep "API URL" | awk '{print $NF}')
            local studio_url=$(supabase status 2>/dev/null | grep "Studio URL" | awk '{print $NF}')
            local db_url=$(supabase status 2>/dev/null | grep "Database URL" | awk '{print $NF}')

            # Verify database connectivity with a simple query
            if [ -n "$db_url" ]; then
                if psql "$db_url" -c "SELECT 1" &> /dev/null; then
                    echo -e "${GREEN}✅ Running (DB Connected)${NC}"
                else
                    echo -e "${YELLOW}⚠️  Running (DB Connection Issue)${NC}"
                fi
            else
                echo -e "${GREEN}✅ Running${NC}"
            fi

            if [ -n "$studio_url" ]; then
                echo -e "   ${CYAN}🔗 Supabase Studio: ${studio_url}${NC}"
            fi
            if [ -n "$api_url" ]; then
                echo -e "   ${CYAN}🔗 API: ${api_url}${NC}"
            fi
            return 0
        else
            echo -e "${YELLOW}⚠️  Not Running${NC}"
            echo -e "   ${YELLOW}To start: supabase start${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ Supabase CLI not installed${NC}"
        return 1
    fi
}

# Function to check if dev server is running
check_dev_server() {
    echo -ne "${BLUE}🚀 Checking Dev Server status...${NC} "

    if check_port $DEV_SERVER_PORT; then
        echo -e "${GREEN}✅ Running on port ${DEV_SERVER_PORT}${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Not Running${NC}"
        return 1
    fi
}

# Function to check Docker containers
check_docker() {
    echo -ne "${BLUE}🐳 Checking Docker status...${NC} "

    if ! command -v docker &> /dev/null; then
        echo -e "${YELLOW}⚠️  Docker not installed${NC}"
        return 1
    fi

    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        echo -e "${RED}❌ Docker daemon not running${NC}"
        return 1
    fi

    # Check for Supabase containers
    local supabase_containers=$(docker ps --filter "name=supabase" --format "{{.Names}}" | wc -l)

    if [ $supabase_containers -gt 0 ]; then
        echo -e "${GREEN}✅ Running (${supabase_containers} Supabase containers)${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  No Supabase containers running${NC}"
        return 1
    fi
}

# Function to check Mailpit
check_mailpit() {
    echo -ne "${BLUE}📧 Checking Mailpit status...${NC} "

    if check_port $MAILPIT_PORT; then
        echo -e "${GREEN}✅ Running${NC}"
        echo -e "   ${CYAN}🔗 Mailpit UI: http://localhost:${MAILPIT_PORT}${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Not Running${NC}"
        return 1
    fi
}

# Function to stop ALL dev server instances (including orphaned ones)
stop_dev_server() {
    echo -e "${BLUE}🛑 Stopping ALL existing dev server instances...${NC}"

    local killed=0

    # Check ports 3001-3010 (in case Vite picked a different port)
    for port in {3001..3010}; do
        local pids=$(lsof -ti :$port 2>/dev/null)
        if [ -n "$pids" ]; then
            echo -e "   ${YELLOW}Found process on port ${port}, killing...${NC}"
            echo "$pids" | xargs kill -9 2>/dev/null
            killed=$((killed + 1))
        fi
    done

    # Also kill any orphaned Vite processes by name
    local vite_pids=$(pgrep -f "vite" 2>/dev/null)
    if [ -n "$vite_pids" ]; then
        echo -e "   ${YELLOW}Found orphaned Vite processes, killing...${NC}"
        echo "$vite_pids" | xargs kill -9 2>/dev/null
        killed=$((killed + 1))
    fi

    if [ $killed -gt 0 ]; then
        sleep 2
        echo -e "${GREEN}✅ Stopped ${killed} instance(s)${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  No running instances found${NC}"
        return 1
    fi
}

# Function to start dev server
start_dev_server() {
    local restart=$1

    echo -e "\n${MAGENTA}🚀 Starting Development Server...${NC}"

    if check_port $DEV_SERVER_PORT; then
        if [ "$restart" = "true" ]; then
            echo -e "${YELLOW}Dev server already running - restarting fresh...${NC}"
            stop_dev_server
        else
            echo -e "${GREEN}✅ Dev server already running on port ${DEV_SERVER_PORT}${NC}"
            return 0
        fi
    fi

    # Set environment variable based on database mode
    local npm_command="npm run dev"
    if [ "$DB_MODE" = "cloud" ]; then
        echo -e "${CYAN}🌐 Forcing cloud database connection...${NC}"
        export VITE_USE_CLOUD_DB=true
        npm_command="npm run dev:cloud"
    elif [ "$DB_MODE" = "local" ]; then
        echo -e "${CYAN}💻 Forcing local database connection...${NC}"
        export VITE_USE_CLOUD_DB=false
        npm_command="npm run dev:local"
    else
        echo -e "${CYAN}🔄 Using auto-detect for database connection...${NC}"
    fi

    echo -e "${BLUE}Starting ${npm_command}...${NC}"
    $npm_command > /dev/null 2>&1 &

    # Wait for server to start
    echo -n "Waiting for server to start"
    for i in {1..15}; do
        sleep 1
        echo -n "."
        if check_port $DEV_SERVER_PORT; then
            echo -e " ${GREEN}✅ Started!${NC}"
            return 0
        fi
    done
    echo -e " ${RED}❌ Failed to start${NC}"
    return 1
}

# Function to find and list all wiki HTML files
list_wiki_pages() {
    echo -e "\n${BOLD}${CYAN}📄 Available Wiki Pages:${NC}"
    echo "═══════════════════════════════════════════════════════════"

    local base_url="http://localhost:${DEV_SERVER_PORT}"

    # Find all HTML files in src/wiki directory
    local wiki_files=$(find src/wiki -name "*.html" -not -name "*.bak*" -not -name "*.backup*" -not -name "*.archive*" | sort)

    if [ -z "$wiki_files" ]; then
        echo -e "${RED}❌ No wiki HTML files found${NC}"
        return 1
    fi

    local count=0
    while IFS= read -r file; do
        ((count++))
        local filename=$(basename "$file")
        local url="${base_url}/${file}"

        # Determine icon and description based on filename
        local icon="📄"
        local description=""

        case "$filename" in
            wiki-home.html)
                icon="🏠"
                description="Main landing page with guides and events"
                ;;
            wiki-editor.html)
                icon="✏️ "
                description="Content editor for creating guides, events, locations"
                ;;
            wiki-events.html)
                icon="📅"
                description="Browse and manage events"
                ;;
            wiki-map.html)
                icon="🗺️ "
                description="Interactive map of locations"
                ;;
            wiki-favorites.html)
                icon="⭐"
                description="Your saved favorites and collections"
                ;;
            wiki-issues.html)
                icon="🐛"
                description="Report and track issues"
                ;;
            wiki-admin.html)
                icon="⚙️ "
                description="Admin panel for managing categories"
                ;;
            wiki-login.html)
                icon="🔐"
                description="User authentication"
                ;;
            wiki-page.html)
                icon="📖"
                description="Individual page viewer"
                ;;
        esac

        echo -e "${BOLD}$count.${NC} ${icon} ${BOLD}${filename}${NC}"
        echo -e "   ${CYAN}${url}${NC}"
        if [ -n "$description" ]; then
            echo -e "   ${description}"
        fi
        echo ""
    done <<< "$wiki_files"

    echo "═══════════════════════════════════════════════════════════"
    echo -e "${GREEN}Total: ${count} wiki pages${NC}"
}

# Function to verify actual ports in use
verify_ports() {
    # Verify dev server port
    local actual_dev_port=""
    for port in {3001..3010}; do
        if check_port $port; then
            actual_dev_port=$port
            break
        fi
    done

    # Verify Supabase API port
    local actual_supabase_port=""
    for port in {3000..3010}; do
        if check_port $port; then
            actual_supabase_port=$port
            break
        fi
    done

    # Warn if ports don't match expected
    if [ -n "$actual_dev_port" ] && [ "$actual_dev_port" != "$DEV_SERVER_PORT" ]; then
        echo -e "${YELLOW}⚠️  WARNING: Dev server is on port ${actual_dev_port}, expected ${DEV_SERVER_PORT}${NC}"
        DEV_SERVER_PORT=$actual_dev_port
    fi

    if [ -n "$actual_supabase_port" ] && [ "$actual_supabase_port" != "$SUPABASE_PORT" ]; then
        echo -e "${YELLOW}⚠️  WARNING: Supabase API is on port ${actual_supabase_port}, expected ${SUPABASE_PORT}${NC}"
        SUPABASE_PORT=$actual_supabase_port
    fi
}

# Function to display service URLs
show_service_urls() {
    # Verify actual ports before displaying
    verify_ports

    echo -e "\n${BOLD}${CYAN}🔗 Service URLs:${NC}"
    echo "═══════════════════════════════════════════════════════════"
    echo -e "${BOLD}Development:${NC}"
    if check_port $DEV_SERVER_PORT; then
        echo -e "  🌱 Permahub UI:      ${GREEN}✅ http://localhost:${DEV_SERVER_PORT}/src/wiki/wiki-home.html${NC}"
    else
        echo -e "  🌱 Permahub UI:      ${RED}❌ http://localhost:${DEV_SERVER_PORT}/src/wiki/wiki-home.html (not running)${NC}"
    fi

    # Display active database connection
    if [ "$DB_MODE" = "cloud" ]; then
        echo -e "  🗄️  Database:         ${GREEN}🌐 Cloud (mcbxbaggjaxqfdvmrqsc)${NC}"
    elif [ "$DB_MODE" = "local" ]; then
        echo -e "  🗄️  Database:         ${GREEN}💻 Local (127.0.0.1:3000)${NC}"
    else
        echo -e "  🗄️  Database:         ${CYAN}🔄 Auto-detect (check browser console)${NC}"
    fi

    echo ""
    echo -e "${BOLD}Backend Services:${NC}"
    if check_port 54323; then
        echo -e "  🗄️  Supabase Studio:  ${GREEN}✅ http://localhost:54323${NC}"
    else
        echo -e "  🗄️  Supabase Studio:  ${RED}❌ http://localhost:54323 (not running)${NC}"
    fi
    if check_port $SUPABASE_PORT; then
        echo -e "  🔌 Supabase API:     ${GREEN}✅ http://localhost:${SUPABASE_PORT}${NC}"
    else
        echo -e "  🔌 Supabase API:     ${RED}❌ http://localhost:${SUPABASE_PORT} (not running)${NC}"
    fi
    if check_port $MAILPIT_PORT; then
        echo -e "  📧 Mailpit:          ${GREEN}✅ http://localhost:${MAILPIT_PORT}${NC}"
    else
        echo -e "  📧 Mailpit:          ${YELLOW}⚠️  http://localhost:${MAILPIT_PORT} (not running)${NC}"
    fi
    echo ""
    echo -e "${BOLD}Testing:${NC}"
    echo -e "  🧪 Test Suite:       ${CYAN}http://localhost:${DEV_SERVER_PORT}/test-ui-comprehensive.html${NC}"
    echo -e "  📊 Test Runner:      ${CYAN}node test-ui-quick.js${NC}"
    echo "═══════════════════════════════════════════════════════════"
}

# Function to run system checks
run_checks() {
    echo -e "\n${BOLD}${CYAN}🔍 System Health Check:${NC}"
    echo "═══════════════════════════════════════════════════════════"

    check_docker
    check_supabase
    check_mailpit
    check_dev_server

    echo "═══════════════════════════════════════════════════════════"
}

# Main execution
main() {
    # Run system checks
    run_checks

    # Handle Supabase based on database mode
    if [ "$DB_MODE" = "cloud" ]; then
        echo ""
        echo -e "${CYAN}🌐 Using cloud database - skipping local Supabase check${NC}"
    elif [ "$DB_MODE" = "local" ]; then
        # Local mode requires Supabase to be running
        if command -v supabase &> /dev/null; then
            if ! supabase status &> /dev/null; then
                echo ""
                echo -e "${RED}❌ Error: Local database mode requires Supabase to be running${NC}"
                read -p "$(echo -e ${YELLOW}Start Supabase now? [Y/n]: ${NC})" -n 1 -r
                echo
                if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
                    echo -e "${BLUE}Starting Supabase...${NC}"
                    supabase start
                else
                    echo -e "${RED}Cannot continue without Supabase. Exiting.${NC}"
                    exit 1
                fi
            else
                echo ""
                echo -e "${GREEN}✅ Supabase is running (required for local mode)${NC}"
            fi
        else
            echo -e "${RED}❌ Error: Supabase CLI not installed but local mode requested${NC}"
            exit 1
        fi
    else
        # Auto-detect mode (default behavior)
        if command -v supabase &> /dev/null; then
            if ! supabase status &> /dev/null; then
                echo ""
                read -p "$(echo -e ${YELLOW}Supabase not running. Start it now? [Y/n]: ${NC})" -n 1 -r
                echo
                if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
                    echo -e "${BLUE}Starting Supabase...${NC}"
                    supabase start
                fi
            fi
        fi
    fi

    # Handle dev server - always stop existing instances and restart fresh
    echo ""
    stop_dev_server

    echo ""
    read -p "$(echo -e ${YELLOW}Start development server? [Y/n]: ${NC})" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
        start_dev_server false
    fi

    # Show Supabase status details
    echo -e "\n${BOLD}${CYAN}📊 Supabase Status:${NC}"
    echo "═══════════════════════════════════════════════════════════"
    if command -v supabase &> /dev/null; then
        supabase status 2>/dev/null || echo -e "${YELLOW}⚠️  Supabase not started${NC}"
    else
        echo -e "${RED}❌ Supabase CLI not installed${NC}"
    fi
    echo "═══════════════════════════════════════════════════════════"

    # Show service URLs
    show_service_urls

    # List wiki pages
    if check_port $DEV_SERVER_PORT; then
        list_wiki_pages

        # Open browser
        echo ""
        read -p "$(echo -e ${YELLOW}Open Permahub in browser? [Y/n]: ${NC})" -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
            echo -e "${BLUE}🌐 Opening Permahub in browser...${NC}"
            open "http://localhost:${DEV_SERVER_PORT}/src/wiki/wiki-home.html"
        fi
    fi

    echo ""
    echo -e "${BOLD}${GREEN}✅ Startup complete!${NC}"
    echo -e "${CYAN}Press Ctrl+C to stop the dev server when you're done.${NC}"
    echo ""
}

# Run main function
main
