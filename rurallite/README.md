This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## API Route Structure & Naming

### Route Hierarchy

- **Users**
  - `/api/users` — GET (paginated list), POST (create)
  - `/api/users/[id]` — GET (by id), PUT (update), DELETE (remove)
- **Lessons** — `/api/lessons`
- **Quizzes** — `/api/quizzes`, `/api/quiz-results`
- **Progress** — `/api/progress`
- **Notes** — `/api/notes`
- **Test DB** — `/api/testdb`

### Conventions

- **Nouns, plural, lowercase:** e.g., `/api/users`, not `/api/getUsers`
- **Pagination params:** `page`, `limit` on list endpoints (defaults: `page=1`, `limit=10`, max limit `100`)
- **Status codes:** 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 409 Conflict, 500 Internal Server Error

### Sample Requests

List users (paginated):

```bash
curl -s "http://localhost:3000/api/users?page=1&limit=10"
```

Create user:

```bash
curl -s -X POST "http://localhost:3000/api/users" \
   -H "Content-Type: application/json" \
   -d '{"name":"Charlie","email":"charlie@example.com","role":"STUDENT"}'
```

Get user by id:

```bash
curl -s "http://localhost:3000/api/users/1"
```

Update user:

```bash
curl -s -X PUT "http://localhost:3000/api/users/1" \
   -H "Content-Type: application/json" \
   -d '{"name":"Charlie Updated"}'
```

Delete user:

```bash
curl -s -X DELETE "http://localhost:3000/api/users/1"
```

### Error Semantics

- Missing or invalid fields → `400`
- Resource not found → `404`
- Duplicate resource (e.g., email exists) → `409`
- Unexpected server error → `500`

### API Response Envelope (Unified format) 🔧

All API endpoints return a consistent response envelope to simplify client-side handling and observability.

Envelope shape:

```json
{
  "success": boolean,
  "message": string,
  "data"?: any,
  "error"?: { "code": string, "details"?: string },
  "meta"?: object,
  "timestamp": "2025-10-30T10:00:00Z"
}
```

Examples:

Success

```json
{
  "success": true,
  "message": "User created successfully",
  "data": { "id": 12, "name": "Charlie" },
  "timestamp": "2025-10-30T10:00:00Z"
}
```

Error

```json
{
  "success": false,
  "message": "Missing required field: name",
  "error": { "code": "VALIDATION_ERROR" },
  "timestamp": "2025-10-30T10:00:00Z"
}
```

Defined error codes (see `rurallite/lib/errorCodes.ts`):

- `VALIDATION_ERROR` — E001
- `NOT_FOUND` — E002
- `DATABASE_FAILURE` — E003
- `CONFLICT` — E409
- `INTERNAL_ERROR` — E500

Usage (example snippet in a route):

```js
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body.name) return sendError("Missing required field: name", ERROR_CODES.VALIDATION_ERROR, 400);
    return sendSuccess({ id: 1, name: body.name }, "Created", 201);
  } catch (err) {
    return sendError("Internal Server Error", ERROR_CODES.INTERNAL_ERROR, 500, err);
  }
}
```

Why this helps:

- Consistent client handling: frontend code can assume the same shape for errors and successes.
- Observability: `error.code` + `timestamp` helps link logs/monitoring systems to specific failures.
- Developer experience: new contributors find fewer surprises when adding or calling endpoints.

### Reflection

Consistent, noun-based, pluralized routes make APIs predictable. Predictability reduces onboarding time, avoids client-side surprises, and allows automated tooling (docs, tests) to operate uniformly across endpoints. Pagination and clear error semantics ensure scalability and robust integrations.

### Prisma & PostgreSQL (local development)

The repository includes a `docker-compose.yml` that spins up a `db` (Postgres) and `redis` service. Use the Prisma schema in `prisma/schema.prisma` to manage migrations and the Prisma Client.

1. Start Postgres: `docker-compose up -d db`
2. In the `rurallite` folder install dependencies: `npm install`
3. Generate Prisma client: `npm run prisma:generate`
4. Apply migrations: `npm run prisma:migrate`
5. Seed database: `npm run prisma:seed`
6. Visit Prisma Studio: `npm run prisma:studio`

If you don't use Docker, set `DATABASE_URL` in `rurallite/.env.local` to point at your Postgres instance.

## Database Migrations & Seed Scripts

### Migration Workflow

This project uses Prisma Migrate to manage database schema changes. All migrations are versioned and stored in `prisma/migrations/`.

#### Creating a New Migration

When you modify the `schema.prisma` file, create a migration:

```bash
npx prisma migrate dev --name descriptive_migration_name
```

Example:

```bash
npx prisma migrate dev --name add_project_table
```

This command will:

- Generate SQL migration files in `prisma/migrations/`
- Apply the migration to your database
- Regenerate Prisma Client
- Optionally run seed scripts if configured

#### Applying Migrations

To apply pending migrations:

```bash
npx prisma migrate deploy
```

This is typically used in production environments.

#### Viewing Migration History

All migrations are stored in the `prisma/migrations/` folder:

- `0001_init/` - Initial schema setup
- `20251212102546_init_schema/` - Base schema migration
- `20251215080337_learning_platform_schema/` - Complete learning platform schema

Each migration folder contains:

- `migration.sql` - The SQL commands executed
- Timestamp and descriptive name for tracking

### Rollback & Reset Strategies

#### Reset Database (Development Only)

To completely reset your database and reapply all migrations:

```bash
npx prisma migrate reset
```

This will:

1. Drop the database
2. Create a new database
3. Apply all migrations from scratch
4. Run seed scripts automatically

**⚠️ WARNING: This deletes ALL data!**

#### Safe Rollback Process

Prisma doesn't support automatic rollback, but you can manually revert:

1. **Option 1: Reset and Reapply**

   ```bash
   npx prisma migrate reset
   ```

2. **Option 2: Manual Rollback**
   - Identify the migration to rollback
   - Manually write and execute the inverse SQL
   - Update `_prisma_migrations` table

3. **Option 3: Create Reverting Migration**
   - Modify schema to previous state
   - Run `npx prisma migrate dev --name revert_feature_x`

#### Custom Reset Script

The project includes a custom reset script:

```bash
npm run db:reset
```

This script:

- Stops and removes Docker containers
- Restarts PostgreSQL
- Resets database with migrations
- Runs seed scripts

### Seed Scripts

#### Running the Seed Script

```bash
npm run prisma:seed
```

Or directly:

```bash
npx prisma db seed
```

#### Seed Script Configuration

In `package.json`:

```json
"scripts": {
  "prisma:seed": "node prisma/seed.js"
}
```

#### Seed Data Overview

The seed script (`prisma/seed.js`) creates:

**Users:**

- 2 Students (Raj Kumar, Priya Singh)
- 1 Teacher (Mrs. Sharma)

**Lessons:**

- Introduction to Mathematics (Grade 5, Beginner)
- English Grammar Basics (Grade 5, Beginner)

**Quizzes:**

- Math Basics Quiz (2 questions, 70% passing score)

**Additional Data:**

- Progress records
- Quiz results
- Student notes

#### Idempotency

The seed script is **idempotent** - it can be run multiple times safely:

```javascript
// Clear existing data first
await prisma.quizResult.deleteMany();
await prisma.question.deleteMany();
await prisma.quiz.deleteMany();
await prisma.progress.deleteMany();
await prisma.note.deleteMany();
await prisma.lesson.deleteMany();
await prisma.user.deleteMany();
```

This ensures:

- No duplicate entries
- Consistent starting state
- Safe for development resets

### Verifying Database State

#### Using Prisma Studio

View and edit your database in a GUI:

```bash
npm run prisma:studio
```

or

```bash
npx prisma studio
```

Access at: http://localhost:5555

#### Sample Queries

Check seeded data using Prisma Client:

```javascript
const users = await prisma.user.findMany();
const lessons = await prisma.lesson.findMany({
  include: { quizzes: true },
});
```

### Production Data Protection

#### Best Practices

1. **Never run `migrate reset` in production** - This destroys all data!

2. **Backup Before Migration**

   ```bash
   pg_dump -U postgres -d trivengers_db > backup_$(date +%Y%m%d).sql
   ```

3. **Use Staging Environment**
   - Test migrations on staging first
   - Verify data integrity
   - Monitor for issues

4. **Migration Testing Workflow**

   ```
   Local Dev → Test Migration
       ↓
   Staging → Apply & Verify
       ↓
   Production → Apply with Backup
   ```

5. **Rollback Plan**
   - Always have database backup
   - Document rollback SQL
   - Test rollback procedure

6. **Seed Script Safety**
   - Never seed production databases
   - Use environment checks:
     ```javascript
     if (process.env.NODE_ENV === "production") {
       throw new Error("Cannot seed production database!");
     }
     ```

#### Migration Logs

Example successful migration output:

```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "trivengers_db"

Applying migration `20251215080337_learning_platform_schema`

The following migration(s) have been applied:

migrations/
  └─ 20251215080337_learning_platform_schema/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client
```

Example successful seed output:

```
> rurallite@0.1.0 prisma:seed
> node prisma/seed.js

Seed data created successfully.
```

### Troubleshooting

#### Migration Conflicts

If migrations conflict:

```bash
npx prisma migrate reset
```

#### Database Connection Issues

Check your `DATABASE_URL`:

```bash
$env:DATABASE_URL="postgresql://postgres:password@localhost:5432/trivengers_db"
```

#### Schema Out of Sync

Regenerate Prisma Client:

```bash
npx prisma generate
```

### Reflection

Database migrations are the backbone of production-ready applications. Key learnings:

1. **Version Control for Schema** - Every schema change is tracked, reviewed, and reproducible
2. **Team Collaboration** - All developers work with identical database structures
3. **Safe Deployments** - Migrations enable zero-downtime deployments with proper planning
4. **Data Integrity** - Proper migrations prevent data loss and maintain referential integrity
5. **Rollback Capability** - Always maintain backups and rollback plans
6. **Environment Separation** - Never test migrations on production first

By treating schema changes as versioned code, we ensure consistency across development, staging, and production environments. The seed script provides a reliable baseline for testing and development, while proper migration practices protect production data.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
