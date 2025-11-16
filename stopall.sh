#!/bin/bash

#
# File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/stopall.sh
# Description: Comprehensive shutdown script for Permahub - stops all development services
# Author: Libor Ballaty <libor@arionetworks.com>
# Created: 2025-11-16
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
PLAYWRIGHT_PORT=3101
GRACEFUL_TIMEOUT=5
SUPABASE_TIMEOUT=10

# Parse command line arguments
FORCE_MODE=false
for arg in "$@"; do
    case $arg in
        --force|-f)
            FORCE_MODE=true
            shift
            ;;
        --help|-h)
            echo -e "${BOLD}${CYAN}Permahub Stop All Services${NC}"
            echo ""
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --force, -f    Force immediate shutdown (SIGKILL)"
            echo "  --help, -h     Show this help message"
            echo ""
            echo "Default behavior: Graceful shutdown with timeouts"
            exit 0
            ;;
        *)
            ;;
    esac
done

echo -e "${BOLD}${CYAN}"
echo "═══════════════════════════════════════════════════════════"
echo "   🛑 Permahub Shutdown Script"
echo "═══════════════════════════════════════════════════════════"
echo -e "${NC}"

if [ "$FORCE_MODE" = true ]; then
    echo -e "${YELLOW}⚠️  Force mode enabled - immediate shutdown${NC}\n"
else
    echo -e "${BLUE}ℹ️  Graceful shutdown mode (use --force for immediate)${NC}\n"
fi

# Track what was stopped
STOPPED_COUNT=0
NOT_RUNNING_COUNT=0
FAILED_COUNT=0

# Function to check if a port is in use
check_port() {
    local port=$1
    lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1
}

# Function to kill processes gracefully or forcefully
kill_process() {
    local pid=$1
    local name=$2

    if [ "$FORCE_MODE" = true ]; then
        kill -9 $pid 2>/dev/null
        return $?
    else
        # Try graceful shutdown first
        kill -TERM $pid 2>/dev/null

        # Wait for process to stop
        local waited=0
        while [ $waited -lt $GRACEFUL_TIMEOUT ]; do
            if ! ps -p $pid > /dev/null 2>&1; then
                return 0
            fi
            sleep 1
            waited=$((waited + 1))
        done

        # Force kill if still running
        if ps -p $pid > /dev/null 2>&1; then
            echo -e "   ${YELLOW}⚠️  $name didn't stop gracefully, force killing...${NC}"
            kill -9 $pid 2>/dev/null
            return $?
        fi
        return 0
    fi
}

# Function to stop dev server
stop_dev_server() {
    echo -e "${BOLD}${BLUE}🚀 Stopping Vite Dev Server...${NC}"

    local found=false
    local stopped=0

    # Check ports 3001-3010
    for port in {3001..3010}; do
        local pids=$(lsof -ti :$port 2>/dev/null)
        if [ -n "$pids" ]; then
            found=true
            echo -e "   ${YELLOW}Found process(es) on port ${port}${NC}"
            for pid in $pids; do
                local proc_name=$(ps -p $pid -o comm= 2>/dev/null)
                if kill_process $pid "$proc_name"; then
                    echo -e "   ${GREEN}✅ Stopped: $proc_name (PID: $pid)${NC}"
                    stopped=$((stopped + 1))
                else
                    echo -e "   ${RED}❌ Failed to stop: $proc_name (PID: $pid)${NC}"
                    FAILED_COUNT=$((FAILED_COUNT + 1))
                fi
            done
        fi
    done

    # Kill orphaned Vite processes
    local vite_pids=$(pgrep -f "vite.*${PWD}" 2>/dev/null)
    if [ -n "$vite_pids" ]; then
        found=true
        echo -e "   ${YELLOW}Found orphaned Vite processes${NC}"
        for pid in $vite_pids; do
            if kill_process $pid "vite"; then
                echo -e "   ${GREEN}✅ Stopped orphaned Vite process (PID: $pid)${NC}"
                stopped=$((stopped + 1))
            fi
        done
    fi

    # Kill orphaned npm processes from this project
    local npm_pids=$(ps aux | grep "npm.*run.*dev" | grep "$PWD" | grep -v grep | awk '{print $2}')
    if [ -n "$npm_pids" ]; then
        found=true
        echo -e "   ${YELLOW}Found orphaned npm processes${NC}"
        for pid in $npm_pids; do
            if kill_process $pid "npm"; then
                echo -e "   ${GREEN}✅ Stopped orphaned npm process (PID: $pid)${NC}"
                stopped=$((stopped + 1))
            fi
        done
    fi

    if [ "$found" = true ]; then
        STOPPED_COUNT=$((STOPPED_COUNT + stopped))
        echo -e "${GREEN}✅ Dev server stopped (${stopped} processes)${NC}\n"
    else
        NOT_RUNNING_COUNT=$((NOT_RUNNING_COUNT + 1))
        echo -e "${YELLOW}⚠️  Dev server was not running${NC}\n"
    fi
}

# Function to stop Supabase
stop_supabase() {
    echo -e "${BOLD}${BLUE}📦 Stopping Supabase...${NC}"

    # Check if Supabase is running
    if ! command -v supabase &> /dev/null; then
        echo -e "${RED}❌ Supabase CLI not installed${NC}\n"
        return 1
    fi

    if ! supabase status &> /dev/null 2>&1; then
        NOT_RUNNING_COUNT=$((NOT_RUNNING_COUNT + 1))
        echo -e "${YELLOW}⚠️  Supabase was not running${NC}\n"
        return 0
    fi

    # Count running containers
    local container_count=$(docker ps --filter "name=supabase" --format "{{.Names}}" | wc -l | tr -d ' ')
    echo -e "   ${BLUE}Found ${container_count} Supabase containers running${NC}"

    # Stop Supabase
    if [ "$FORCE_MODE" = true ]; then
        echo -e "   ${YELLOW}Force stopping Supabase...${NC}"
        supabase stop --no-backup > /dev/null 2>&1
    else
        echo -e "   ${BLUE}Gracefully stopping Supabase...${NC}"
        supabase stop > /dev/null 2>&1 &
        local supabase_pid=$!

        # Wait for Supabase to stop
        local waited=0
        while [ $waited -lt $SUPABASE_TIMEOUT ]; do
            if ! supabase status &> /dev/null 2>&1; then
                break
            fi
            sleep 1
            waited=$((waited + 1))
        done

        # Kill the supabase stop process if still running
        if ps -p $supabase_pid > /dev/null 2>&1; then
            kill $supabase_pid 2>/dev/null
        fi
    fi

    # Verify Supabase stopped
    if ! supabase status &> /dev/null 2>&1; then
        STOPPED_COUNT=$((STOPPED_COUNT + 1))
        echo -e "${GREEN}✅ Supabase stopped successfully${NC}\n"
    else
        FAILED_COUNT=$((FAILED_COUNT + 1))
        echo -e "${RED}❌ Failed to stop Supabase${NC}\n"
    fi
}

# Function to stop test processes
stop_test_processes() {
    echo -e "${BOLD}${BLUE}🧪 Stopping Test Processes...${NC}"

    local found=false
    local stopped=0

    # Stop Playwright test server
    if check_port $PLAYWRIGHT_PORT; then
        found=true
        local pids=$(lsof -ti :$PLAYWRIGHT_PORT 2>/dev/null)
        for pid in $pids; do
            if kill_process $pid "Playwright test server"; then
                echo -e "   ${GREEN}✅ Stopped Playwright test server (PID: $pid)${NC}"
                stopped=$((stopped + 1))
            fi
        done
    fi

    # Kill orphaned Playwright processes from this project
    local playwright_pids=$(ps aux | grep "playwright" | grep "$PWD" | grep -v grep | awk '{print $2}')
    if [ -n "$playwright_pids" ]; then
        found=true
        echo -e "   ${YELLOW}Found orphaned Playwright processes${NC}"
        for pid in $playwright_pids; do
            if kill_process $pid "playwright"; then
                echo -e "   ${GREEN}✅ Stopped orphaned Playwright process (PID: $pid)${NC}"
                stopped=$((stopped + 1))
            fi
        done
    fi

    # Kill orphaned npm test processes from this project
    local npm_test_pids=$(ps aux | grep "npm.*test\|npm.*playwright" | grep "$PWD" | grep -v grep | awk '{print $2}')
    if [ -n "$npm_test_pids" ]; then
        found=true
        echo -e "   ${YELLOW}Found orphaned npm test processes${NC}"
        for pid in $npm_test_pids; do
            if kill_process $pid "npm test"; then
                echo -e "   ${GREEN}✅ Stopped orphaned npm test process (PID: $pid)${NC}"
                stopped=$((stopped + 1))
            fi
        done
    fi

    if [ "$found" = true ]; then
        STOPPED_COUNT=$((STOPPED_COUNT + stopped))
        echo -e "${GREEN}✅ Test processes stopped (${stopped} processes)${NC}\n"
    else
        NOT_RUNNING_COUNT=$((NOT_RUNNING_COUNT + 1))
        echo -e "${YELLOW}⚠️  No test processes were running${NC}\n"
    fi
}

# Function to verify shutdown
verify_shutdown() {
    echo -e "${BOLD}${BLUE}🔍 Verifying Shutdown...${NC}"

    local all_clear=true

    # Check dev server
    if check_port $DEV_SERVER_PORT; then
        echo -e "   ${RED}❌ Dev server still running on port ${DEV_SERVER_PORT}${NC}"
        all_clear=false
    else
        echo -e "   ${GREEN}✅ Dev server stopped${NC}"
    fi

    # Check Supabase
    if command -v supabase &> /dev/null; then
        if supabase status &> /dev/null 2>&1; then
            echo -e "   ${RED}❌ Supabase still running${NC}"
            all_clear=false
        else
            echo -e "   ${GREEN}✅ Supabase stopped${NC}"
        fi
    fi

    # Check test server
    if check_port $PLAYWRIGHT_PORT; then
        echo -e "   ${RED}❌ Test server still running on port ${PLAYWRIGHT_PORT}${NC}"
        all_clear=false
    else
        echo -e "   ${GREEN}✅ Test server stopped${NC}"
    fi

    echo ""
    return $([ "$all_clear" = true ] && echo 0 || echo 1)
}

# Function to display summary
show_summary() {
    echo -e "${BOLD}${CYAN}📊 Shutdown Summary${NC}"
    echo "═══════════════════════════════════════════════════════════"
    echo -e "${GREEN}✅ Services stopped:     ${STOPPED_COUNT}${NC}"
    echo -e "${YELLOW}⚠️  Already stopped:      ${NOT_RUNNING_COUNT}${NC}"

    if [ $FAILED_COUNT -gt 0 ]; then
        echo -e "${RED}❌ Failed to stop:       ${FAILED_COUNT}${NC}"
    fi

    echo "═══════════════════════════════════════════════════════════"
}

# Main execution
main() {
    # Stop all services
    stop_dev_server
    stop_supabase
    stop_test_processes

    # Verify shutdown
    verify_shutdown
    local verify_result=$?

    # Show summary
    echo ""
    show_summary

    echo ""
    if [ $verify_result -eq 0 ] && [ $FAILED_COUNT -eq 0 ]; then
        echo -e "${BOLD}${GREEN}✅ All services stopped successfully!${NC}"
    elif [ $FAILED_COUNT -gt 0 ]; then
        echo -e "${BOLD}${RED}❌ Some services failed to stop. Try running with --force${NC}"
        exit 1
    else
        echo -e "${BOLD}${YELLOW}⚠️  Shutdown completed with warnings${NC}"
    fi
    echo ""
}

# Run main function
main
