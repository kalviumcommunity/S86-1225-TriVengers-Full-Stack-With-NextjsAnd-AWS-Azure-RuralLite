Assignment: PostgreSQL Schema Design (Prisma)

Deliverables included in this repository:

- Normalized PostgreSQL schema (Prisma): `prisma/schema.prisma`
- Migration SQL: `prisma/migrations/0001_init/migration.sql` (DDL example)
- Seed script to insert sample data: `prisma/seed.js`
- Migration & seed instructions: `prisma/MIGRATION_NOTES.md`
- Documentation of keys, constraints, and normalization: `prisma/README.md`
- Example Prisma client queries: `prisma/SAMPLE_QUERIES.md`

How to verify locally (short):

1. Start DB: `docker-compose up -d db`
2. Install deps: `cd rurallite && npm install`
3. Generate client: `npm run prisma:generate`
4. Apply migrations: `npm run prisma:migrate`
5. Seed: `npm run prisma:seed`
6. Verify records: `npm run prisma:studio`

Reflection:
- The schema uses join tables for membership and many-to-many relationships to avoid redundancy.
- Indexes on `Task.projectId` and `Task.assigneeId` support expected frequent queries (project dashboards, user task lists), helping scalability.
