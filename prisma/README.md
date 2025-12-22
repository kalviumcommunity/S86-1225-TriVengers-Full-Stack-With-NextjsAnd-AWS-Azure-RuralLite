chw**PostgreSQL Schema (Prisma)**

ER Diagram (simplified):

User --< Project (owner)
User --< Task (assignee)
Project --< Task
Project --< ProjectMember >-- User
Team --< Project
Team --< TeamMember >-- User
Task --< TaskTag >-- Tag



- **Files**: `prisma/schema.prisma`, `prisma/seed.js`
- **Models**: `User`, `Team`, `Project`, `Task`, `Comment`, `Tag`, `TaskTag`, `ProjectMember`, `TeamMember`

Keys & constraints:
- Primary keys: `id` (auto-increment Int) for all main models
- Unique constraints on `User.email`, `Team.name`, `Project.slug`, `Tag.name`
- Foreign keys: e.g. `Task.projectId` references `Project.id` with `ON DELETE CASCADE` to keep referential integrity
- Join tables: `ProjectMember`, `TeamMember`, `TaskTag` model many-to-many relationships and include `@@unique` to prevent duplicates

Normalization:
- Design follows 3NF: no repeating groups, each non-key attribute depends on the key and nothing but the key, and tables split to avoid redundancy (tags and task-tag mapping separated, users and memberships separated).

Indexes:
- `Task` is indexed by `projectId` and `assigneeId` for fast lookups by project and assignee

Common queries supported:
- Get all tasks for a project (indexed by `projectId`) — used on project dashboards
- Get tasks assigned to a user (indexed by `assigneeId`) — used for personal task lists
- Get projects for a team or user by join tables (`ProjectMember`, `TeamMember`)

Run locally with Docker Compose (Postgres included):

1. Start Postgres: `docker-compose up -d db`
2. Install deps (inside `rurallite` folder): `npm install`
3. Generate client: `npm run prisma:generate`
4. Apply migrations: `npm run prisma:migrate`
5. Seed data: `npm run prisma:seed`
6. Open Prisma Studio: `npm run prisma:studio`

Reflection:
- This schema avoids redundant storage of values (e.g., tags are normalized into a `Tag` table and linked via `TaskTag`).
- Using join tables for memberships allows flexible permission models and supports scalable queries for large teams/projects.
