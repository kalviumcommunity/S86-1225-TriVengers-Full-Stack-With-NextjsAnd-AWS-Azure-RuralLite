#!/bin/bash
# Docker Setup Script for RuralLite
# This script helps set up and manage the Docker environment

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "\n${BLUE}=== $1 ===${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        echo "Please download Docker Desktop: https://www.docker.com/products/docker-desktop"
        exit 1
    fi
    print_success "Docker is installed: $(docker --version)"
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    print_success "Docker Compose is installed: $(docker-compose --version)"
    
    # Check Docker daemon
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running"
        echo "Please start Docker Desktop"
        exit 1
    fi
    print_success "Docker daemon is running"
}

# Create .env files if they don't exist
setup_env_files() {
    print_header "Setting Up Environment Files"
    
    # Root .env file
    if [ ! -f .env ]; then
        print_warning ".env file not found in root"
        if [ -f .env.example ]; then
            cp .env.example .env
            print_success "Created .env from .env.example"
        else
            print_warning "No .env.example file found"
        fi
    else
        print_success ".env file already exists"
    fi
    
    # RuralLite .env.local file
    if [ ! -f rurallite/.env.local ]; then
        print_warning ".env.local file not found in rurallite/"
        if [ -f rurallite/.env.local.example ]; then
            cp rurallite/.env.local.example rurallite/.env.local
            print_success "Created rurallite/.env.local from .env.local.example"
        else
            print_warning "No rurallite/.env.local.example file found"
        fi
    else
        print_success "rurallite/.env.local file already exists"
    fi
}

# Build and start services
build_and_start() {
    print_header "Building and Starting Services"
    
    echo "Building Docker images and starting services..."
    docker-compose up --build
}

# Start services (without rebuild)
start_services() {
    print_header "Starting Services"
    
    echo "Starting services..."
    docker-compose up
}

# Stop services
stop_services() {
    print_header "Stopping Services"
    
    docker-compose stop
    print_success "Services stopped"
}

# View logs
view_logs() {
    print_header "Service Logs"
    
    if [ "$1" == "app" ] || [ "$1" == "db" ] || [ "$1" == "redis" ]; then
        docker-compose logs -f "$1"
    else
        docker-compose logs -f
    fi
}

# Verify services
verify_services() {
    print_header "Verifying Services"
    
    echo "Checking running containers..."
    docker-compose ps
    
    echo -e "\n${BLUE}Service Status:${NC}"
    
    # Check app
    if docker-compose exec -T app curl -f http://localhost:3000 &> /dev/null; then
        print_success "Next.js app is accessible at http://localhost:3000"
    else
        print_warning "Next.js app may not be ready yet"
    fi
    
    # Check database
    if docker-compose exec -T db pg_isready -U postgres &> /dev/null; then
        print_success "PostgreSQL database is ready on port 5432"
    else
        print_warning "PostgreSQL database is not ready"
    fi
    
    # Check redis
    if docker-compose exec -T redis redis-cli ping &> /dev/null; then
        print_success "Redis cache is ready on port 6379"
    else
        print_warning "Redis cache is not ready"
    fi
}

# Clean up
cleanup() {
    print_header "Cleaning Up"
    
    echo "This will stop and remove all containers"
    read -p "Do you want to remove volumes as well? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v
        print_success "Services stopped and volumes removed"
    else
        docker-compose down
        print_success "Services stopped"
    fi
}

# Reset database
reset_database() {
    print_header "Resetting Database"
    
    print_warning "This will delete all database data"
    read -p "Are you sure? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v
        docker-compose up -d db
        sleep 5
        print_success "Database has been reset"
    fi
}

# Help message
show_help() {
    cat << EOF
${BLUE}RuralLite Docker Setup Script${NC}

Usage: ./docker-setup.sh [command]

Commands:
    check       Check Docker prerequisites
    setup       Create .env files
    build       Build and start all services
    start       Start services (without rebuilding)
    stop        Stop all services
    logs        View service logs (pass 'app', 'db', or 'redis' for specific service)
    verify      Verify all services are running
    clean       Stop and remove containers
    reset       Reset database (deletes data)
    help        Show this help message

Examples:
    ./docker-setup.sh check              # Verify Docker is installed
    ./docker-setup.sh setup              # Create .env files
    ./docker-setup.sh build              # Build and start services
    ./docker-setup.sh logs app           # View app logs
    ./docker-setup.sh verify             # Check service status
    
Quick Start:
    1. ./docker-setup.sh check
    2. ./docker-setup.sh setup
    3. ./docker-setup.sh build

${YELLOW}For more details, see DOCKER_SETUP.md${NC}
EOF
}

# Main script logic
case "${1:-help}" in
    check)
        check_prerequisites
        ;;
    setup)
        setup_env_files
        ;;
    build)
        check_prerequisites
        setup_env_files
        build_and_start
        ;;
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    logs)
        view_logs "$2"
        ;;
    verify)
        verify_services
        ;;
    clean)
        cleanup
        ;;
    reset)
        reset_database
        ;;
    help)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
