# 📘 RuralLite Learning Platform

### Offline-First Educational Web App for Low-Bandwidth Rural Schools

Built with Next.js, **AWS/Azure Cloud Services**, and **Progressive Web App (PWA)** technologies.

---

## 📌 Problem Statement

Rural and low-connectivity schools struggle to access quality educational resources due to poor internet infrastructure. Students often miss out on digital learning opportunities, multimedia content, and interactive assessments that urban schools enjoy. RuralLite addresses this gap by providing an offline-first learning platform that works seamlessly without internet, while syncing progress when connectivity is available.

---

## 🎯 Overview

RuralLite is a lightweight, offline-first learning platform designed for rural or low-connectivity schools.

The application allows students to access lessons, quizzes, and multimedia resources fully offline, using a PWA architecture with smart caching, local storage, and background synchronization. Cloud services (AWS or Azure) are used only for authentication, content publishing, and occasional data sync.

---

## 🎯 Key Features

- Offline-first PWA (works without internet)
- Local caching of lessons, quizzes, notes, and media
- Lightweight content bundles optimized for weak networks
- Background sync for student progress & new content
- Teacher-friendly CMS (cloud-hosted)
- Low-end device compatible
- Secure user authentication (Cognito / Azure AD B2C)

---

## 🏗 System Architecture

┌──────────────────────────┐
│ Next.js PWA Frontend │
│ (Service Worker, SWR) │
│ │
│ • IndexedDB (offline) │
│ • LocalForage caching │
│ • Background Sync │
└──────────────┬───────────┘
│ occasional sync
┌──────────────▼─────────────┐
│ Cloud Backend (API) │
│ AWS Lambda / Azure Func. │
│ │
│ • Content APIs │
│ • Sync endpoints │
│ • Authentication │
└──────────────┬─────────────┘
│
┌──────────────▼─────────────┐
│ Content Storage + CDN │
│ S3/Blob + CloudFront/CDN │
│ │
│ • Lesson bundles │
│ • Multimedia assets │
└─────────────────────────────┘

---

## 🧰 Tech Stack

> NOTE: A Prisma + PostgreSQL schema is included in `prisma/` for normalized relational data modelling (User/Team/Project/Task). See `prisma/README.md` for migration and seed steps.

## 🧰 Tech Stack

- **Frontend**: Next.js (React Framework)
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Cloud Services**: AWS (Lambda, S3, Cognito)
- **Styling**: Tailwind CSS
- **Deployment**: AWS / Vercel

---

## 📁 Project Structure

```
S86-1225-TriVengers-Full-Stack-With-NextjsAnd-AWS-Azure-RuralLite/
├── rurallite/                      # Main Next.js application
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 # Authentication routes (login, register)
│   │   ├── dashboard/              # Student/Teacher dashboard pages
│   │   ├── lessons/                # Lesson listing and detail pages
│   │   │   └── [id]/               # Dynamic route for individual lessons
│   │   ├── quizzes/                # Quiz pages and quiz results
│   │   │   └── [id]/               # Dynamic route for individual quizzes
│   │   ├── notes/                  # Student notes section
│   │   ├── api/                    # Backend API routes
│   │   │   ├── auth/               # Authentication endpoints
│   │   │   ├── lessons/            # Lesson CRUD operations
│   │   │   ├── quizzes/            # Quiz endpoints
│   │   │   └── sync/               # Background sync endpoints
│   │   ├── globals.css             # Global styles
│   │   ├── layout.js               # Root layout component
│   │   └── page.js                 # Homepage (Hero section)
│   ├── components/                 # Reusable React components
│   │   ├── ui/                     # UI components (Button, Card, Navigation)
│   │   ├── lessons/                # Lesson-specific components
│   │   └── offline/                # Offline indicator & sync status
│   ├── lib/                        # Utility libraries and helpers
│   │   ├── db/                     # IndexedDB configuration and operations
│   │   ├── pwa/                    # Service Worker and sync manager
│   │   └── utils/                  # Helper functions and utilities
│   ├── public/                     # Static assets
│   │   ├── icons/                  # App icons for PWA
│   │   ├── manifest.json           # PWA manifest file
│   │   └── sw.js                   # Service Worker script
│   ├── styles/                     # Additional stylesheets
│   ├── config/                     # Configuration files
│   ├── package.json                # Dependencies and scripts
│   ├── next.config.mjs             # Next.js configuration
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   ├── postcss.config.mjs          # PostCSS configuration
│   └── eslint.config.mjs           # ESLint configuration
├── .gitignore                      # Git ignore rules
└── README.md                       # Project documentation (this file)
```

### 📂 Folder Purpose Explanation

| Folder/File     | Purpose                                                              |
| --------------- | -------------------------------------------------------------------- |
| **app/**        | Contains all pages and routing logic using Next.js App Router        |
| **app/(auth)/** | Groups authentication-related pages (login, register)                |
| **app/api/**    | Backend API endpoints for authentication, lessons, quizzes, and sync |
| **components/** | Reusable UI components to maintain DRY principle                     |
| **lib/**        | Business logic, database operations, PWA utilities                   |
| **lib/db/**     | IndexedDB wrapper for offline data storage                           |
| **lib/pwa/**    | Service Worker registration and background sync logic                |
| **public/**     | Static assets served directly (icons, manifest, service worker)      |
| **config/**     | Application configuration files (API keys, constants)                |

### 🏗️ Naming Conventions

- **Files**: kebab-case (e.g., `lesson-card.js`, `auth-provider.js`)
- **Components**: PascalCase (e.g., `LessonCard`, `OfflineIndicator`)
- **API Routes**: RESTful naming (e.g., `/api/lessons`, `/api/quizzes/[id]`)
- **Folders**: lowercase with hyphens for multi-word names

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/kalviumcommunity/S86-1225-TriVengers-Full-Stack-With-NextjsAnd-AWS-Azure-RuralLite.git
   cd S86-1225-TriVengers-Full-Stack-With-NextjsAnd-AWS-Azure-RuralLite/rurallite
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the `rurallite/` directory:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_API_URL=http://localhost:3000
   AWS_ACCESS_KEY_ID=your_aws_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

---

## 📸 Local Development Screenshot

![RuralLite Homepage Running Locally](./screenshots/local-dev-screenshot.png)

_Screenshot showing the RuralLite homepage running on localhost:3000_

---

## 💡 Why This Structure?

### Scalability

- **Modular Design**: Components, API routes, and utilities are separated for easy maintenance
- **Feature-Based Organization**: Related features (lessons, quizzes) are grouped together
- **Reusable Components**: UI components can be shared across different pages
- **API Separation**: Backend logic is isolated in `app/api/` for easy testing and scaling

### Clarity

- **Clear Separation of Concerns**: Frontend (components), Backend (API), and utilities (lib) are distinct
- **Intuitive Navigation**: Folder names clearly indicate their purpose
- **Grouped Routes**: Using `(auth)` groups keeps authentication logic together without affecting URLs

### Team Collaboration

- **Easy Onboarding**: New team members can quickly understand the project structure
- **Parallel Development**: Multiple developers can work on different features without conflicts
- **Consistent Patterns**: Naming conventions ensure uniformity across the codebase

### Future Sprints

- **PWA Support**: `lib/pwa/` folder is ready for service worker and offline capabilities
- **Database Flexibility**: `lib/db/` can be extended for different database solutions
- **Component Library**: `components/ui/` can evolve into a full design system
- **API Versioning**: API routes can be versioned (`api/v1/`, `api/v2/`) as needed

---
---
## 🗄️ Prisma ORM Setup

### Why Prisma?

Prisma is our chosen ORM for RuralLite because it provides:
- **Type Safety**: Auto-generated TypeScript types prevent runtime errors
- **PostgreSQL Support**: Robust relational database for complex queries and data integrity
- **Developer Experience**: Intuitive API and excellent tooling
- **Query Optimization**: Efficient queries crucial for low-bandwidth environments
- **Migration Management**: Version control for database schema changes

### Database Models

Our schema is designed specifically for offline-first rural education:

#### Core Models:
- **User**: Students, Teachers, and Admins with role-based access
- **Lesson**: Educational content with offline caching metadata (download size, media URLs)
- **Quiz**: Assessments with time limits and configurable passing scores
- **Question**: Individual quiz questions with multiple choice options
- **QuizResult**: Student attempts with sync tracking for offline-to-online transition
- **Answer**: Individual answer records linked to quiz results
- **Progress**: Lesson completion tracking with percentage and sync status
- **Note**: Student notes with tag support and offline sync capability

#### Key Design Decisions:
- **PostgreSQL**: Relational integrity, ACID compliance, and powerful querying
- **Separate Tables**: Question and Answer are separate tables (not embedded) for flexibility
- **Sync Tracking**: `syncedAt` fields track offline-to-cloud synchronization
- **Cascade Deletes**: Maintains data integrity when users/lessons are removed
- **Indexes**: Optimized queries on foreign keys and frequently searched fields
- **Unique Constraints**: Prevents duplicate progress entries per user-lesson

### Schema Snippet

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Lesson {
  id          Int       @id @default(autoincrement())
  title       String
  subject     String
  grade       Int
  difficulty  Difficulty @default(BEGINNER)
  isOffline   Boolean   @default(true)
  downloadSize Int?     // KB for offline planning
  
  quizzes     Quiz[]
  progress    Progress[]
}

model Progress {
  id          Int       @id @default(autoincrement())
  userId      Int
  lessonId    Int
  completed   Boolean   @default(false)
  progress    Int       @default(0)
  syncedAt    DateTime? // Tracks cloud sync
  
  user        User      @relation(fields: [userId], references: [id])
  lesson      Lesson    @relation(fields: [lessonId], references: [id])
  
  @@unique([userId, lessonId])
  @@index([userId])
}
```

### Setup Steps

1. **Install Prisma**
   ```bash
   cd rurallite
   npm install prisma @prisma/client --save-dev
   npx prisma init
   ```

2. **Configure Database**
   - Update `DATABASE_URL` in `.env.local` with MongoDB connection string
   - Use `.env.example` as reference

3. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

4. **Push Schema to Database**
   ```bash
   npx prisma db push
   ```

5. **Test Connection**
   ```typescript
   import { prisma } from '@/lib/prisma';
   const users = await prisma.user.findMany();
   ```

### Client Initialization

Created singleton Prisma client at `lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') 
  globalForPrisma.prisma = prisma;
```

**Why Singleton?** Prevents multiple Prisma instances during development hot-reloading, avoiding database connection exhaustion.

### Testing & Verification

Test queries available in `lib/db/test-connection.ts`:
- Connection verification
- Sample lesson creation
- Query examples for all models

### How Prisma Improves Our Project

**Type Safety**: Auto-completion for all database queries eliminates typos and wrong field names
**Productivity**: No manual SQL writing—focus on features, not queries  
**Data Integrity**: PostgreSQL's relational constraints ensure consistent data relationships  
**Team Collaboration**: Shared schema file ensures everyone uses same data structure  
**Reliability**: Built-in connection pooling and query optimization crucial for low-resource environments
**Migrations**: Version-controlled database changes make team collaboration seamless

### Environment Variables

```env
# PostgreSQL Connection (Local)
DATABASE_URL="postgresql://postgres:password@localhost:5432/rurallite"

# PostgreSQL Connection (Production - example)
DATABASE_URL="postgresql://user:password@host.com:5432/rurallite?schema=public"
```

See `.env.example` for complete configuration.

---
## � Git Workflow & Collaboration

### Branch Naming Conventions

Our team follows a consistent branching strategy for clarity and traceability:

| Branch Type       | Pattern                  | Example                     |
| ----------------- | ------------------------ | --------------------------- |
| **Feature**       | `feature/<feature-name>` | `feature/login-auth`        |
| **Bug Fix**       | `fix/<bug-name>`         | `fix/navbar-alignment`      |
| **Chore**         | `chore/<task-name>`      | `chore/update-dependencies` |
| **Documentation** | `docs/<update-name>`     | `docs/update-readme`        |

### Pull Request Template

We use a standardized PR template located at `.github/pull_request_template.md` that includes:

- Summary of changes
- List of key updates
- Screenshots/evidence
- Type of change (feature/fix/chore/docs)
- Comprehensive checklist
- Related issue links

### Code Review Checklist

Every PR must pass this checklist before merging:

- [ ] **Code Quality**: Follows naming conventions and project structure
- [ ] **Functionality**: Verified locally and tested
- [ ] **Build Status**: Code builds successfully without errors
- [ ] **Linting**: ESLint + Prettier checks pass
- [ ] **Console**: No console errors or warnings
- [ ] **Documentation**: Comments and docs are meaningful
- [ ] **Security**: No sensitive data exposed (.env files excluded)
- [ ] **Tests**: All tests pass (when applicable)
- [ ] **Review**: Reviewed by at least one teammate
- [ ] **Issue Link**: Linked to corresponding issue

### Branch Protection Rules

Our `main` branch is protected with:

- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass (lint/test workflows)
- ✅ Disallow direct pushes to main
- ✅ Require branches to be up to date before merging

### Why This Workflow?

**Code Quality**: Automated checks catch issues before they reach production  
**Collaboration**: Clear templates and checklists improve communication  
**Velocity**: Parallel development without merge conflicts  
**Trust**: Every change is reviewed, tested, and documented  
**Traceability**: Branch naming and PR links create clear history

---

## �🔄 Offline Sync Logic

### When offline:

- Lessons load from indexedDB
- Quiz results stored locally
- Notes saved to local database

### When reconnected:

- Syncs quiz results → cloud
- Downloads new lessons → cache
- Updates service worker assets

---

## 🤝 Contributing

PRs are welcome!
Please open an issue to discuss major changes before submitting a pull request.

---

## 📜 License

MIT License © 2024–2025 RuralLite Project

---

## 👥 Team TriVengers

Built with ❤️ for improving rural education accessibility

---

## 📝 Day 1 - Project Initialization Checklist

- [x] Set up Next.js project with Tailwind CSS
- [x] Create folder structure following best practices
- [x] Add .gitignore for node_modules, .env, .next
- [x] Design and implement homepage hero section
- [x] Document project structure in README
- [x] Add setup instructions and naming conventions
- [x] Run app locally and capture screenshot
- [x] Write reflection on structure and scalability

---

## 📝 Day 2 - Team Workflow & Git Setup

- [x] Defined branch naming conventions (feature/fix/chore/docs)
- [x] Created PR template in `.github/pull_request_template.md`
- [x] Documented code review checklist
- [x] Configured branch protection rules on main
- [x] Added Git workflow section to README
- [x] Enabled TypeScript strict mode in `tsconfig.json`
- [x] Configured ESLint + Prettier for consistent formatting
- [x] Set up Husky pre-commit hook with `lint-staged`
- [x] Created `.env.example` for environment variable management
- [x] Updated `.gitignore` to exclude sensitive `.env` files

---

## 📝 Day 3 - Prisma ORM & Database Setup

- [x] Installed Prisma and initialized project
- [x] Designed MongoDB schema for RuralLite (User, Lesson, Quiz, Progress, Note models)
- [x] Added offline-first features (syncedAt, downloadSize, isOffline fields)
- [x] Generated Prisma Client with TypeScript types
- [x] Created singleton Prisma client in `lib/prisma.ts`
- [x] Added test connection file with sample queries
- [x] Updated `.env.example` with DATABASE_URL
- [x] Documented Prisma setup, schema design, and benefits in README

---

## 📝 Day 3 - Prisma & PostgreSQL

- Added a normalized Prisma schema (`prisma/schema.prisma`) with models: User, Team, Project, Task, Comment, Tag, and related join tables.
- Created migration files and an initial SQL migration, and added a seed script (`prisma/seed.js`) that inserts example users, teams, projects, tasks, tags, and comments.
- Implemented a Prisma client helper (`rurallite/prismaClient.js`) and a simple API route (`/api/testdb`) to verify DB connectivity and seeded counts.
- Updated `rurallite/package.json` with Prisma scripts (`prisma:generate`, `prisma:migrate`, `prisma:studio`, `prisma:seed`) and added `.env` examples for local development.

---

## 📝 Day 4 — Transactions & Query Optimization

- [x] Implement transaction demo and rollback verification (`rurallite/scripts/transaction_demo.js`, API at `app/api/transactions/demo/route.js`)
- [x] Add `Product`, `Order`, and `OrderItem` models with indexes in `rurallite/prisma/schema.prisma`
- [x] Seeded sample products in `rurallite/prisma/seed.js`
- [x] Added benchmark script (`rurallite/scripts/bench_index_flip.js`) and captured real `EXPLAIN ANALYZE` outputs (`rurallite/benchmarks/real_before.txt`, `rurallite/benchmarks/real_after.txt`)
- [x] Documented workflow and findings in `rurallite/TRANSACTIONS_AND_INDEXES.md`


## 🐳 Docker & Docker Compose Setup

### Overview

This section covers containerizing the RuralLite application stack for consistent local development and deployment. The Docker setup includes:

- **Next.js Application** (Node.js 20-Alpine)
- **PostgreSQL Database** (v15-Alpine) for data persistence
- **Redis Cache** (v7-Alpine) for session management and caching

Using Docker and Docker Compose ensures that every team member runs the exact same environment, eliminating the classic "it works on my machine" problem.

### Project Files

#### 1. **Dockerfile** (Next.js Application)

```dockerfile
# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rurallite subdirectory contents
COPY rurallite ./rurallite

# Set working directory to rurallite app
WORKDIR /app/rurallite

# Install app dependencies
RUN npm install

# Build the Next.js app
RUN npm run build

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
```

**Why Alpine?** Alpine Linux is lightweight (~5MB) compared to standard Node images, resulting in faster builds and smaller image sizes.

#### 2. **docker-compose.yml** (Service Orchestration)

The `docker-compose.yml` file orchestrates three services:

**App Service (Next.js)**

- Builds from the Dockerfile
- Exposes port 3000
- Environment variables for database and Redis connections
- Depends on PostgreSQL and Redis with health checks
- Auto-restart policy for reliability

**Database Service (PostgreSQL)**

- Uses Alpine image for efficiency
- Persistent storage with named volume `db_data`
- Exposed on port 5432
- Health check to ensure readiness before app starts
- Credentials: `postgres` / `password` (change in production!)

**Redis Service (Redis)**

- Cache layer for sessions and temporary data
- Exposed on port 6379
- Health check via `redis-cli ping`
- Auto-restart enabled

**Network & Volumes**

- **localnet**: Custom bridge network for inter-service communication
- **db_data**: Named volume for PostgreSQL data persistence

### Quick Start

#### Prerequisites

- **Docker**: [Download & Install](https://www.docker.com/products/docker-desktop)
- **Docker Compose**: Included with Docker Desktop

#### Starting the Stack

```bash
# From the project root directory
docker-compose up --build
```

This command:

1. Builds the Next.js app image
2. Pulls PostgreSQL and Redis images
3. Creates the network and volumes
4. Starts all three services

**Expected Output:**

```
Creating network "localnet" with driver "bridge"
Creating volume "db_data" with default driver
Building app
[...]
trivengers_nextjs_app is running on port 3000
trivengers_postgres_db is running on port 5432
trivengers_redis_cache is running on port 6379
```

#### Verifying All Services

```bash
# Check running containers
docker ps

# Expected output:
# CONTAINER ID   IMAGE        PORTS                    NAMES
# abc123...      node:20...   0.0.0.0:3000->3000/tcp   trivengers_nextjs_app
# def456...      postgres:15  0.0.0.0:5432->5432/tcp   trivengers_postgres_db
# ghi789...      redis:7      0.0.0.0:6379->6379/tcp   trivengers_redis_cache
```

#### Access Services

- **Next.js App**: http://localhost:3000
- **PostgreSQL**: `localhost:5432` (use connection string in app)
- **Redis**: `localhost:6379` (use connection string in app)

### Environment Variables

The `docker-compose.yml` sets the following environment variables in the Next.js container:

```yaml
DATABASE_URL=postgresql://postgres:password@db:5432/trivengers_db
REDIS_URL=redis://redis:6379
NODE_ENV=production
```

**Important:** Change the default PostgreSQL password in production. Update both `docker-compose.yml` and your `.env.local` file.

### Common Commands

#### View Container Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f db
docker-compose logs -f redis
```

#### Stop All Services

```bash
docker-compose down
```

#### Stop and Remove Data

```bash
# Warning: This deletes the database!
docker-compose down -v
```

#### Restart Services

```bash
docker-compose restart
```

#### Execute Commands in Container

```bash
# Access Next.js app container
docker-compose exec app sh

# Access PostgreSQL container
docker-compose exec db psql -U postgres -d trivengers_db

# Access Redis container
docker-compose exec redis redis-cli
```

### Troubleshooting

#### Issue: Port Already in Use

**Problem**: "Port 3000 is already allocated"

**Solution**: Change ports in `docker-compose.yml`:

```yaml
app:
  ports:
    - "3001:3000" # Use 3001 instead
```

#### Issue: Database Connection Error

**Problem**: "Cannot connect to postgres database"

**Solution**:

1. Ensure `db` service is running: `docker ps`
2. Check database logs: `docker-compose logs db`
3. Wait for health check to pass (takes ~10 seconds)

#### Issue: Slow Docker Builds

**Problem**: First build takes several minutes

**Solutions**:

- Ensure stable internet (downloading images)
- Use `.dockerignore` to exclude unnecessary files
- Add build cache: `docker builder prune --all`

#### Issue: Permission Errors

**Problem**: "Permission denied" on Windows with WSL2

**Solution**:

```bash
# Run Docker Desktop with WSL2 backend
# Settings > Resources > WSL integration
```

#### Issue: Redis Connection Failed

**Problem**: "Cannot connect to redis://redis:6379"

**Solution**:

1. Check Redis health: `docker-compose logs redis`
2. Verify network: `docker network inspect localnet`
3. Restart Redis: `docker-compose restart redis`

### Production Considerations

#### Security

- **Change Credentials**: Don't use `password` in production
- **Use Secrets**: Store sensitive values in `.env` files (never committed)
- **Network Policies**: Restrict service access with firewall rules
- **SSL/TLS**: Enable encrypted connections to PostgreSQL

#### Performance

- **Multi-stage Builds**: Reduce image size with multi-stage Dockerfile
- **Resource Limits**: Set memory and CPU limits for containers
- **Caching Strategy**: Implement layer caching for faster builds

#### Example Production Compose (Snippet)

```yaml
db:
  image: postgres:15-alpine
  restart: always
  environment:
    POSTGRES_USER: ${DB_USER}
    POSTGRES_PASSWORD: ${DB_PASSWORD} # From .env, never hardcoded
  volumes:
    - db_data:/var/lib/postgresql/data
  networks:
    - localnet
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
```

### Health Checks

All services include health checks that automatically restart failed containers:

- **App**: HTTP GET to `localhost:3000` every 30 seconds
- **Database**: PostgreSQL ready check every 10 seconds
- **Redis**: `redis-cli ping` every 10 seconds

This ensures high availability during local development.

### Reflection & Lessons Learned

#### Challenges Faced

1. **Image Size Optimization**
   - Initially used `node:20` (900MB+), switched to `node:20-alpine` (150MB)
   - Result: 6x smaller images and faster downloads

2. **Service Dependencies**
   - Race condition where app started before PostgreSQL was ready
   - **Solution**: Added `healthcheck` to ensure database is ready before app connects

3. **Network Configuration**
   - Container-to-container communication requires proper networking
   - Used custom bridge network (`localnet`) for service discovery

4. **Volume Management**
   - Data was lost when containers were removed
   - **Solution**: Named volume `db_data` persists PostgreSQL data across restarts

5. **Environment Variables**
   - Hardcoded credentials posed security risks
   - Implemented environment-based configuration for flexibility

#### Key Takeaways

✅ **Docker ensures consistency** across development, testing, and production environments  
✅ **Docker Compose simplifies** multi-service orchestration and team collaboration  
✅ **Health checks prevent** service dependency issues and race conditions  
✅ **Volumes enable** data persistence between container restarts  
✅ **Named containers** make logs and debugging easier to track

#### Next Steps

- Implement CI/CD pipeline (GitHub Actions) to build and push images
- Add database migration scripts to initialize schema
- Configure environment-specific compose files (`docker-compose.dev.yml`, `docker-compose.prod.yml`)
- Document deployment to cloud services (AWS ECS, Azure Container Instances)

---
