# 🚀 GitHub Actions CI/CD Setup Guide

## Overview

This guide explains the complete GitHub Actions CI/CD pipeline implementation for the RuralLite project. The pipeline includes automated linting, testing, building, security scanning, and deployment.

## Workflow Files

### 1. Main CI Pipeline (`.github/workflows/ci.yml`)

**Purpose:** Complete CI/CD pipeline with 4 core stages

**Stages:**
1. **Lint** - Code style and quality validation
2. **Test** - Unit tests with coverage
3. **Build** - Next.js application build
4. **Security** - Dependency vulnerability scanning
5. **Deploy** - Environment-based deployments

**Key Features:**
- Parallel job execution for performance
- PostgreSQL and Redis services for realistic testing
- Build artifact caching
- Environment-specific deployments (staging/production)
- Automatic dependency installation and caching

### 2. Integration Testing (`.github/workflows/integration-tests.yml`)

**Purpose:** End-to-end API testing with real services

**Features:**
- Full application startup simulation
- Database seeding and migration
- API route testing using existing scripts
- Security headers validation
- PR comment automation with test results
- Daily scheduled runs for monitoring

### 3. Docker Automation (`.github/workflows/docker.yml`)

**Purpose:** Container building and deployment

**Features:**
- Multi-platform Docker builds (AMD64/ARM64)
- GitHub Container Registry publishing
- Container security scanning with Trivy
- Automated deployment triggers
- Build caching for performance

## Workflow Triggers

### Push Triggers
```yaml
on:
  push:
    branches: [main, develop]
```

### Pull Request Triggers
```yaml
on:
  pull_request:
    branches: [main, develop]
```

### Manual Triggers
```yaml
on:
  workflow_dispatch: # Enable manual runs
```

### Scheduled Triggers
```yaml
on:
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM UTC
```

## Environment Configuration

### Required Secrets

Add these secrets in **GitHub Settings → Secrets and Variables → Actions:**

```
AWS_ACCESS_KEY_ID          # AWS deployment credentials
AWS_SECRET_ACCESS_KEY      # AWS deployment credentials
AZURE_WEBAPP_PUBLISH_PROFILE # Azure deployment profile
GITHUB_TOKEN               # Automatically provided
```

### Environment Variables

```yaml
env:
  NODE_ENV: test
  DATABASE_URL: postgresql://test:test@localhost:5432/rurallite_test
  REDIS_URL: redis://localhost:6379
  JWT_SECRET: test_jwt_secret
  NEXTAUTH_SECRET: test_nextauth_secret
```

## Pipeline Stages Explained

### 1. Lint Stage

**Purpose:** Code quality and style consistency

**Actions:**
- ESLint execution on root and RuralLite directories
- Code style validation
- Import/export validation

**Commands:**
```bash
npm run lint  # Root directory
cd rurallite && npm run lint  # RuralLite directory
```

### 2. Test Stage

**Purpose:** Unit test validation with coverage

**Setup:**
- PostgreSQL 15 database service
- Redis 7 cache service
- Prisma client generation
- Database migrations

**Actions:**
- Vitest test runner with coverage
- Test result artifact upload
- Coverage report to Codecov

**Commands:**
```bash
npm test -- --coverage --run
```

### 3. Build Stage

**Purpose:** Application compilation verification

**Actions:**
- Next.js production build
- Build artifact upload
- Static analysis

**Commands:**
```bash
npm run build
```

### 4. Security Stage

**Purpose:** Vulnerability detection

**Actions:**
- NPM audit execution
- Dependency security scan
- High/moderate vulnerability detection

**Commands:**
```bash
npm audit --audit-level=high
npm audit --audit-level=moderate
```

### 5. Deploy Stage

**Purpose:** Environment-specific deployments

**Environments:**
- **Staging:** Deploys from `develop` branch
- **Production:** Deploys from `main` branch

**Actions:**
- Build artifact download
- Environment-specific deployment
- Health check verification

## Performance Optimizations

### 1. Concurrency Control

```yaml
concurrency:
  group: ${{ github.ref }}
  cancel-in-progress: true
```

**Benefits:**
- Prevents overlapping runs
- Saves compute resources
- Faster feedback loops

### 2. Build Caching

```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
```

**Benefits:**
- Faster dependency installation
- Reduced network usage
- Improved CI performance

### 3. Parallel Jobs

```yaml
jobs:
  lint:     # Runs independently
  test:     # Depends on lint
  build:    # Depends on lint and test
  security: # Depends on lint
```

**Benefits:**
- Reduced total pipeline time
- Earlier failure detection
- Resource optimization

## Monitoring & Reporting

### 1. Test Coverage

- **Tool:** Codecov integration
- **Reports:** Coverage percentage and trends
- **Location:** Uploaded to external service

### 2. Security Scanning

- **Tool:** Trivy container scanning
- **Reports:** SARIF format to GitHub Security tab
- **Scope:** Container vulnerabilities

### 3. Build Artifacts

- **Retention:** 1-7 days depending on artifact type
- **Contents:** Build files, test reports, coverage data
- **Access:** Download from GitHub Actions UI

### 4. PR Comments

Automated test result comments include:
- Test execution status
- Coverage metrics
- Integration test results
- Deployment status

## Deployment Strategy

### Staging Deployment
- **Branch:** `develop`
- **Trigger:** Automatic on push
- **Purpose:** Testing and validation
- **Environment:** `staging`

### Production Deployment
- **Branch:** `main`
- **Trigger:** Automatic on push
- **Purpose:** Live application
- **Environment:** `production`

## Local Development Integration

### Running CI Commands Locally

```bash
# Lint (matches CI)
npm run lint
cd rurallite && npm run lint

# Test (matches CI)
cd rurallite && npm test -- --coverage

# Build (matches CI)
cd rurallite && npm run build

# Security audit (matches CI)
cd rurallite && npm audit
```

### Pre-commit Hooks

The project uses Husky for pre-commit hooks:
```bash
npm run prepare  # Install Husky hooks
```

## Troubleshooting

### Common Issues

1. **Test Failures**
   - Check database connection
   - Verify environment variables
   - Review test logs in Actions tab

2. **Build Failures**
   - Check Next.js configuration
   - Verify dependencies
   - Review build logs

3. **Deployment Failures**
   - Verify secrets configuration
   - Check deployment environment status
   - Review deployment logs

### Debug Commands

```bash
# Check workflow status
gh workflow list

# View workflow runs
gh run list --workflow=ci.yml

# View specific run logs
gh run view [RUN_ID] --log
```

## Best Practices

### 1. Workflow Maintenance
- Keep actions up to date (`@v4` vs `@v3`)
- Use specific version tags for stability
- Test workflow changes in feature branches

### 2. Secret Management
- Rotate secrets regularly
- Use least-privilege access
- Never expose secrets in logs

### 3. Performance
- Use caching for dependencies
- Minimize artifact sizes
- Optimize parallel job usage

### 4. Security
- Scan containers for vulnerabilities
- Audit dependencies regularly
- Use signed commits when possible

## Verification Steps

### 1. Successful Pipeline Run

1. Push code to `develop` or `main` branch
2. Navigate to **Actions** tab in GitHub
3. Verify all stages pass (green checkmarks)
4. Check artifact uploads
5. Verify deployment success

### 2. Pull Request Validation

1. Create pull request to `main`
2. Check CI status checks
3. Review automated comments
4. Verify test coverage reports

### 3. Security Validation

1. Check **Security** tab for vulnerability reports
2. Review Trivy scan results
3. Validate dependency audit results

## Screenshots to Include

For assignment completion, capture:

1. **GitHub Actions Workflows**
   - Actions tab showing all three workflows
   - Successful run with all green checkmarks

2. **Workflow Configuration**
   - `.github/workflows/ci.yml` file content
   - Key stages and configurations

3. **Test Results**
   - Coverage reports
   - Test execution logs
   - Security scan results

4. **Deployment Status**
   - Staging environment deployment
   - Production deployment (if applicable)
   - Health check validation

## Assignment Deliverables Checklist

- ✅ `.github/workflows/ci.yml` - Main CI pipeline
- ✅ `.github/workflows/integration-tests.yml` - Integration testing
- ✅ `.github/workflows/docker.yml` - Docker automation
- ✅ Updated README.md with CI/CD documentation
- ✅ Successful pipeline runs (screenshots)
- ✅ All stages passing (Lint → Test → Build → Deploy)
- ✅ Security scanning enabled
- ✅ Environment-based deployments configured

This comprehensive CI/CD setup ensures code quality, automated testing, security scanning, and reliable deployments for the RuralLite project.