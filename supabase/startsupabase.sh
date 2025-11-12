#!/bin/bash
# File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/xLLMArionComply/arioncomply-v1/supabase/startsupabase.sh
# Description: Comprehensive startup script for ArionComply development environment
# Author: Libor Ballaty <libor@arionetworks.com>
# Created: 2025-11-05
#
# Business Purpose: Ensures Python backend (port 8001) and all Supabase edge functions (port 54321)
# are running correctly before starting development work. Prevents wasted debugging time when
# services aren't running or are misconfigured.
#
# Usage:
#   ./supabase/startsupabase.sh           # Start all services
#   ./supabase/startsupabase.sh --status  # Check status only
#   ./supabase/startsupabase.sh --stop    # Stop all services

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/xLLMArionComply/arioncomply-v1"
PYTHON_BACKEND_DIR="${PROJECT_ROOT}/ai-backend/python-backend"
SUPABASE_DIR="${PROJECT_ROOT}/supabase"

BACKEND_PORT=8001
EDGE_FUNCTIONS_PORT=54321

# Log file locations
LOG_DIR="${PROJECT_ROOT}/logs"
BACKEND_LOG="${LOG_DIR}/python-backend.log"
EDGE_FUNCTIONS_LOG="${LOG_DIR}/edge-functions.log"

# PID file locations
PID_DIR="${PROJECT_ROOT}/.pids"
BACKEND_PID_FILE="${PID_DIR}/python-backend.pid"
EDGE_FUNCTIONS_PID_FILE="${PID_DIR}/edge-functions.pid"

# Create directories if they don't exist
mkdir -p "${LOG_DIR}"
mkdir -p "${PID_DIR}"

# Functions
print_header() {
    echo -e "${BLUE}================================================================================================${NC}"
    echo -e "${BLUE}  ArionComply Development Environment Startup${NC}"
    echo -e "${BLUE}================================================================================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Wait for Supabase containers to be healthy
wait_for_supabase_containers() {
    print_info "Waiting for Supabase containers to be healthy..."

    local max_wait=60  # Wait up to 60 seconds
    local count=0

    # Key containers that must be healthy for Edge Functions to work
    local required_containers="supabase_kong supabase_db supabase_auth"

    while [ $count -lt $max_wait ]; do
        local all_healthy=true

        for container_prefix in $required_containers; do
            # Check if container exists and is healthy
            local health=$(docker ps --filter "name=${container_prefix}" --format "{{.Status}}" 2>/dev/null | grep -i "healthy" || echo "")

            if [ -z "$health" ]; then
                all_healthy=false
                break
            fi
        done

        if [ "$all_healthy" = true ]; then
            print_success "Supabase containers are healthy"
            return 0
        fi

        sleep 2
        count=$((count + 2))
        echo -n "."
    done

    echo ""
    print_warning "Supabase containers not healthy after ${max_wait} seconds"
    print_info "Edge Functions may still work, continuing..."
    return 0  # Don't fail - Edge Functions might still work
}

# Check and start Docker/Colima if needed
ensure_docker_running() {
    print_info "Checking Docker daemon..."

    # Check if Docker is accessible
    if docker ps >/dev/null 2>&1; then
        print_success "Docker daemon is running"

        # Check if Supabase containers are running
        local supabase_containers=$(docker ps --filter "name=supabase" --format "{{.Names}}" 2>/dev/null | wc -l)
        if [ "$supabase_containers" -gt 0 ]; then
            print_success "Found ${supabase_containers} Supabase containers running"
            wait_for_supabase_containers
        else
            print_warning "No Supabase containers found - Edge Functions may not work"
            print_info "Run 'supabase start' to start Supabase services"
        fi

        return 0
    fi

    print_warning "Docker daemon not accessible"

    # Check if Colima is installed
    if ! command -v colima &> /dev/null; then
        print_error "Neither Docker nor Colima is available"
        print_info "Please install Docker Desktop or Colima to run Edge Functions"
        return 1
    fi

    # Check Colima status
    print_info "Checking Colima status..."
    if colima status 2>&1 | grep -q "colima is not running"; then
        print_info "Starting Colima (this may take 30-60 seconds)..."
        colima start

        # Wait for Docker to be accessible
        local count=0
        while [ $count -lt 30 ]; do
            if docker ps >/dev/null 2>&1; then
                print_success "Colima started and Docker daemon is ready"

                # Wait a bit for Supabase containers to start
                sleep 5
                wait_for_supabase_containers

                return 0
            fi
            sleep 2
            count=$((count + 1))
            echo -n "."
        done

        echo ""
        print_error "Colima started but Docker daemon not accessible after 60 seconds"
        return 1
    else
        print_success "Colima is running"

        # Check for Supabase containers
        local supabase_containers=$(docker ps --filter "name=supabase" --format "{{.Names}}" 2>/dev/null | wc -l)
        if [ "$supabase_containers" -gt 0 ]; then
            print_success "Found ${supabase_containers} Supabase containers running"
            wait_for_supabase_containers
        else
            print_warning "No Supabase containers found"
            print_info "Run 'supabase start' to start Supabase services"
        fi

        return 0
    fi
}

# Check if a port is in use
check_port() {
    local port=$1
    if lsof -i ":${port}" -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Check if Python backend is running
check_python_backend() {
    if check_port ${BACKEND_PORT}; then
        # Verify it's actually responding
        if curl -s -f "http://127.0.0.1:${BACKEND_PORT}/health" >/dev/null 2>&1; then
            return 0  # Running and healthy
        else
            print_warning "Port ${BACKEND_PORT} is in use but backend not responding to health check"
            return 1  # Port occupied but service not healthy
        fi
    else
        return 1  # Not running
    fi
}

# Check if edge functions are running (ROBUST CHECK)
check_edge_functions() {
    if check_port ${EDGE_FUNCTIONS_PORT}; then
        # Perform robust health check that verifies:
        # - Edge function can execute code
        # - Database connectivity works
        # - Python backend is reachable
        # - Shared modules load correctly
        local health_response=$(curl -s -f "http://localhost:${EDGE_FUNCTIONS_PORT}/functions/v1/edge-function-health" 2>&1)
        local health_status=$?

        if [ ${health_status} -eq 0 ]; then
            # Parse JSON response to check if healthy
            local is_healthy=$(echo "${health_response}" | grep -o '"healthy"[[:space:]]*:[[:space:]]*true' || echo "")

            if [ -n "${is_healthy}" ]; then
                return 0  # Running and fully healthy
            else
                print_warning "Port ${EDGE_FUNCTIONS_PORT} is responding but health check failed"
                echo "${health_response}" | head -20
                return 1
            fi
        else
            print_warning "Port ${EDGE_FUNCTIONS_PORT} is in use but edge-function-health not responding"
            return 1
        fi
    else
        return 1  # Not running
    fi
}

# Get process info for a port
get_port_process() {
    local port=$1
    lsof -i ":${port}" -sTCP:LISTEN -t 2>/dev/null || echo ""
}

# Stop Python backend
stop_python_backend() {
    print_info "Stopping Python backend (port ${BACKEND_PORT})..."

    # Try PID file first
    if [ -f "${BACKEND_PID_FILE}" ]; then
        local pid=$(cat "${BACKEND_PID_FILE}")
        if ps -p ${pid} > /dev/null 2>&1; then
            kill ${pid} 2>/dev/null || true
            sleep 2
        fi
        rm -f "${BACKEND_PID_FILE}"
    fi

    # Kill any remaining processes on port
    local pids=$(get_port_process ${BACKEND_PORT})
    if [ -n "${pids}" ]; then
        echo "${pids}" | xargs kill -9 2>/dev/null || true
        sleep 1
    fi

    if ! check_port ${BACKEND_PORT}; then
        print_success "Python backend stopped"
    else
        print_error "Failed to stop Python backend"
        return 1
    fi
}

# Stop edge functions
stop_edge_functions() {
    print_info "Stopping Supabase edge functions (port ${EDGE_FUNCTIONS_PORT})..."

    # Try PID file first
    if [ -f "${EDGE_FUNCTIONS_PID_FILE}" ]; then
        local pid=$(cat "${EDGE_FUNCTIONS_PID_FILE}")
        if ps -p ${pid} > /dev/null 2>&1; then
            kill ${pid} 2>/dev/null || true
            sleep 2
        fi
        rm -f "${EDGE_FUNCTIONS_PID_FILE}"
    fi

    # Kill any Supabase processes
    pkill -f "supabase functions serve" 2>/dev/null || true
    sleep 1

    # Kill any remaining processes on port
    local pids=$(get_port_process ${EDGE_FUNCTIONS_PORT})
    if [ -n "${pids}" ]; then
        echo "${pids}" | xargs kill -9 2>/dev/null || true
        sleep 1
    fi

    if ! check_port ${EDGE_FUNCTIONS_PORT}; then
        print_success "Edge functions stopped"
    else
        print_error "Failed to stop edge functions"
        return 1
    fi
}

# Start Python backend
start_python_backend() {
    print_info "Starting Python backend on port ${BACKEND_PORT}..."

    # Check if already running
    if check_python_backend; then
        print_success "Python backend already running on port ${BACKEND_PORT}"
        return 0
    fi

    # Check if port is occupied by something else
    if check_port ${BACKEND_PORT}; then
        print_error "Port ${BACKEND_PORT} is occupied by another process"
        print_info "Run with --stop first to kill existing processes"
        return 1
    fi

    # Start backend
    cd "${PYTHON_BACKEND_DIR}"

    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        print_warning "Virtual environment not found, creating..."
        python3 -m venv venv
    fi

    # Activate venv and start uvicorn in background
    source venv/bin/activate
    nohup python -m uvicorn app.main:app --host 127.0.0.1 --port ${BACKEND_PORT} --log-level info \
        > "${BACKEND_LOG}" 2>&1 &

    local backend_pid=$!
    echo ${backend_pid} > "${BACKEND_PID_FILE}"

    print_info "Waiting for Python backend to start..."
    local count=0
    while [ $count -lt 10 ]; do
        sleep 1
        if check_python_backend; then
            print_success "Python backend started successfully (PID: ${backend_pid})"
            print_info "Logs: ${BACKEND_LOG}"
            return 0
        fi
        count=$((count + 1))
        echo -n "."
    done

    echo ""
    print_error "Python backend failed to start within 10 seconds"
    print_info "Check logs: tail -f ${BACKEND_LOG}"
    return 1
}

# Start edge functions
start_edge_functions() {
    print_info "Starting Supabase edge functions runtime..."

    # Check if Edge Runtime container is already running
    if docker ps --filter "name=supabase_edge_runtime" --format "{{.Names}}" 2>/dev/null | grep -q "supabase_edge_runtime"; then
        print_success "Edge Runtime container already running"

        # Still verify health
        if check_edge_functions; then
            print_success "Edge functions are healthy"
            return 0
        else
            print_warning "Edge Runtime running but health check failed - may still be initializing"
            return 0
        fi
    fi

    # Start edge functions (creates Edge Runtime Docker container)
    cd "${SUPABASE_DIR}/.."

    nohup npx supabase functions serve --no-verify-jwt \
        > "${EDGE_FUNCTIONS_LOG}" 2>&1 &

    local edge_pid=$!
    echo ${edge_pid} > "${EDGE_FUNCTIONS_PID_FILE}"

    print_info "Waiting for edge functions to start..."
    local count=0
    while [ $count -lt 10 ]; do
        sleep 1
        if check_edge_functions; then
            print_success "Edge functions started successfully (PID: ${edge_pid})"
            print_info "Logs: ${EDGE_FUNCTIONS_LOG}"

            # Show which functions are available
            sleep 2  # Give it a moment to fully initialize
            echo ""
            print_info "Available edge functions:"
            grep -E "http://127.0.0.1:${EDGE_FUNCTIONS_PORT}/functions/v1/" "${EDGE_FUNCTIONS_LOG}" | \
                sed 's/^.*v1\//  - /' || true

            return 0
        fi
        count=$((count + 1))
        echo -n "."
    done

    echo ""
    print_error "Edge functions failed to start within 10 seconds"
    print_info "Check logs: tail -f ${EDGE_FUNCTIONS_LOG}"
    return 1
}

# Check status of all services
check_status() {
    print_header
    echo "Service Status:"
    echo ""

    # Check Python backend
    if check_python_backend; then
        local pid=$(get_port_process ${BACKEND_PORT})
        print_success "Python Backend: RUNNING (PID: ${pid}, Port: ${BACKEND_PORT})"

        # Test health endpoint
        local health=$(curl -s "http://127.0.0.1:${BACKEND_PORT}/health" 2>/dev/null || echo "ERROR")
        echo "           Health: ${health}"
    else
        print_error "Python Backend: NOT RUNNING (Port: ${BACKEND_PORT})"
    fi

    echo ""

    # Check edge functions
    if check_edge_functions; then
        local pid=$(get_port_process ${EDGE_FUNCTIONS_PORT})
        print_success "Edge Functions: RUNNING (PID: ${pid}, Port: ${EDGE_FUNCTIONS_PORT})"

        # Count available functions
        local func_count=$(curl -s "http://localhost:${EDGE_FUNCTIONS_PORT}/functions/v1/" 2>/dev/null | grep -o "http://127.0.0.1" | wc -l || echo "0")
        echo "           Functions Available: ~${func_count}"
    else
        print_error "Edge Functions: NOT RUNNING (Port: ${EDGE_FUNCTIONS_PORT})"
    fi

    echo ""
    print_info "Log files:"
    echo "  - Backend: ${BACKEND_LOG}"
    echo "  - Edge Functions: ${EDGE_FUNCTIONS_LOG}"
    echo ""
}

# Stop all services
stop_all() {
    print_header
    echo "Stopping all services..."
    echo ""

    stop_edge_functions
    stop_python_backend

    echo ""
    print_success "All services stopped"
}

# Start all services
start_all() {
    print_header

    # Ensure Docker/Colima is running (required for Edge Functions)
    if ! ensure_docker_running; then
        print_error "Cannot start Edge Functions without Docker/Colima"
        print_info "Python backend can still be started independently"
        exit 1
    fi

    echo ""

    # Start Python backend
    if ! start_python_backend; then
        print_error "Failed to start Python backend"
        exit 1
    fi

    echo ""

    # Start edge functions
    if ! start_edge_functions; then
        print_error "Failed to start edge functions"
        exit 1
    fi

    echo ""
    print_success "All services started successfully!"
    echo ""
    print_info "Development environment ready:"
    echo "  - Python Backend: http://127.0.0.1:${BACKEND_PORT}"
    echo "  - Edge Functions: http://localhost:${EDGE_FUNCTIONS_PORT}/functions/v1/"
    echo "  - Chat Interface: http://localhost:5500/chatInterface.html"
    echo ""
    print_info "To view logs in real-time:"
    echo "  - Backend: tail -f ${BACKEND_LOG}"
    echo "  - Edge Functions: tail -f ${EDGE_FUNCTIONS_LOG}"
    echo ""
    print_info "To stop services: $0 --stop"
    echo ""
}

# Main script
main() {
    case "${1:-}" in
        --status)
            check_status
            ;;
        --stop)
            stop_all
            ;;
        --restart)
            stop_all
            echo ""
            sleep 2
            start_all
            ;;
        --help)
            print_header
            echo "Usage: $0 [OPTION]"
            echo ""
            echo "Options:"
            echo "  (none)      Start all services"
            echo "  --status    Check status of services"
            echo "  --stop      Stop all services"
            echo "  --restart   Restart all services"
            echo "  --help      Show this help message"
            echo ""
            echo "Services managed:"
            echo "  - Python Backend (port ${BACKEND_PORT})"
            echo "  - Supabase Edge Functions (port ${EDGE_FUNCTIONS_PORT})"
            echo ""
            ;;
        *)
            start_all
            ;;
    esac
}

# Run main
main "$@"
