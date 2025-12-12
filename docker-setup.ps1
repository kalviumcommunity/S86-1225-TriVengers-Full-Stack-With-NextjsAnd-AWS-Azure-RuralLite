# Docker Setup Script for RuralLite (PowerShell Version)
# This script helps set up and manage the Docker environment on Windows

param(
    [string]$Command = "help",
    [string]$Service = ""
)

# Color functions
function Write-Header {
    param([string]$Message)
    Write-Host "`n=== $Message ===" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

# Check prerequisites
function Check-Prerequisites {
    Write-Header "Checking Prerequisites"
    
    # Check Docker
    try {
        $dockerVersion = docker --version
        Write-Success "Docker is installed: $dockerVersion"
    }
    catch {
        Write-Error "Docker is not installed or not in PATH"
        Write-Host "Please download Docker Desktop: https://www.docker.com/products/docker-desktop"
        exit 1
    }
    
    # Check Docker Compose
    try {
        $composeVersion = docker-compose --version
        Write-Success "Docker Compose is installed: $composeVersion"
    }
    catch {
        Write-Error "Docker Compose is not installed or not in PATH"
        exit 1
    }
    
    # Check Docker daemon
    try {
        docker info | Out-Null
        Write-Success "Docker daemon is running"
    }
    catch {
        Write-Error "Docker daemon is not running"
        Write-Host "Please start Docker Desktop"
        exit 1
    }
}

# Create .env files
function Setup-EnvFiles {
    Write-Header "Setting Up Environment Files"
    
    # Root .env file
    if (-not (Test-Path ".env")) {
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env"
            Write-Success "Created .env from .env.example"
        }
        else {
            Write-Warning "No .env.example file found"
        }
    }
    else {
        Write-Success ".env file already exists"
    }
    
    # RuralLite .env.local file
    if (-not (Test-Path "rurallite\.env.local")) {
        if (Test-Path "rurallite\.env.local.example") {
            Copy-Item "rurallite\.env.local.example" "rurallite\.env.local"
            Write-Success "Created rurallite/.env.local from .env.local.example"
        }
        else {
            Write-Warning "No rurallite/.env.local.example file found"
        }
    }
    else {
        Write-Success "rurallite/.env.local file already exists"
    }
}

# Build and start services
function Build-AndStart {
    Write-Header "Building and Starting Services"
    Write-Host "Building Docker images and starting services..."
    docker-compose up --build
}

# Start services
function Start-Services {
    Write-Header "Starting Services"
    Write-Host "Starting services (without rebuild)..."
    docker-compose up
}

# Stop services
function Stop-Services {
    Write-Header "Stopping Services"
    docker-compose stop
    Write-Success "Services stopped"
}

# View logs
function View-Logs {
    param([string]$ServiceName = "")
    
    Write-Header "Service Logs"
    
    if ($ServiceName -eq "app" -or $ServiceName -eq "db" -or $ServiceName -eq "redis") {
        docker-compose logs -f $ServiceName
    }
    else {
        docker-compose logs -f
    }
}

# Verify services
function Verify-Services {
    Write-Header "Verifying Services"
    
    Write-Host "Checking running containers..."
    docker-compose ps
    
    Write-Host "`nService Status:" -ForegroundColor Cyan
    
    # Check app
    try {
        $null = docker-compose exec app curl -f http://localhost:3000 2>$null
        Write-Success "Next.js app is accessible at http://localhost:3000"
    }
    catch {
        Write-Warning "Next.js app may not be ready yet"
    }
    
    # Check database
    try {
        $null = docker-compose exec db pg_isready -U postgres 2>$null
        Write-Success "PostgreSQL database is ready on port 5432"
    }
    catch {
        Write-Warning "PostgreSQL database is not ready"
    }
    
    # Check redis
    try {
        $null = docker-compose exec redis redis-cli ping 2>$null
        Write-Success "Redis cache is ready on port 6379"
    }
    catch {
        Write-Warning "Redis cache is not ready"
    }
}

# Cleanup
function Cleanup-Services {
    Write-Header "Cleaning Up"
    
    $response = Read-Host "Stop containers? (y/n)"
    if ($response -eq "y" -or $response -eq "Y") {
        $volumeResponse = Read-Host "Remove volumes as well? (y/n)"
        if ($volumeResponse -eq "y" -or $volumeResponse -eq "Y") {
            docker-compose down -v
            Write-Success "Services stopped and volumes removed"
        }
        else {
            docker-compose down
            Write-Success "Services stopped (volumes preserved)"
        }
    }
}

# Reset database
function Reset-Database {
    Write-Header "Resetting Database"
    
    Write-Warning "This will delete all database data!"
    $response = Read-Host "Are you sure? (y/n)"
    
    if ($response -eq "y" -or $response -eq "Y") {
        docker-compose down -v
        docker-compose up -d db
        Start-Sleep -Seconds 5
        Write-Success "Database has been reset"
    }
}

# Show help
function Show-Help {
    $help = @"
RuralLite Docker Setup Script (PowerShell)

Usage: ./docker-setup.ps1 -Command [command] [-Service service_name]

Commands:
    check       Check Docker prerequisites
    setup       Create .env files
    build       Build and start all services
    start       Start services (without rebuilding)
    stop        Stop all services
    logs        View service logs (add -Service app/db/redis for specific service)
    verify      Verify all services are running
    clean       Stop and remove containers
    reset       Reset database (deletes data)
    help        Show this help message

Examples:
    ./docker-setup.ps1 -Command check              # Verify Docker is installed
    ./docker-setup.ps1 -Command setup              # Create .env files
    ./docker-setup.ps1 -Command build              # Build and start services
    ./docker-setup.ps1 -Command logs -Service app  # View app logs
    ./docker-setup.ps1 -Command verify             # Check service status

Quick Start:
    1. ./docker-setup.ps1 -Command check
    2. ./docker-setup.ps1 -Command setup
    3. ./docker-setup.ps1 -Command build

For more details, see DOCKER_SETUP.md
"@
    Write-Host $help
}

# Main script logic
Write-Host "RuralLite Docker Setup Tool" -ForegroundColor Cyan

switch ($Command.ToLower()) {
    "check" {
        Check-Prerequisites
    }
    "setup" {
        Setup-EnvFiles
    }
    "build" {
        Check-Prerequisites
        Setup-EnvFiles
        Build-AndStart
    }
    "start" {
        Start-Services
    }
    "stop" {
        Stop-Services
    }
    "logs" {
        View-Logs -ServiceName $Service
    }
    "verify" {
        Verify-Services
    }
    "clean" {
        Cleanup-Services
    }
    "reset" {
        Reset-Database
    }
    "help" {
        Show-Help
    }
    default {
        Write-Error "Unknown command: $Command"
        Show-Help
        exit 1
    }
}
