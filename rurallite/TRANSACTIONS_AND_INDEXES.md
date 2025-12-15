# Transactions & Query Optimization (Prisma)

This document explains the transaction demos, rollback verification, indexes added, and how to benchmark query performance in this project.

**What I added**
- New models in `prisma/schema.prisma`: `Product`, `Order`, `OrderItem` (with appropriate `@@index` directives).
- Seed changes in `prisma/seed.js` to add sample products.
- Transaction demo script: `scripts/transaction_demo.js` (successful and failing transactions).
- API route: `app/api/transactions/demo/route.js` to trigger a transaction via HTTP.
- Benchmark script: `scripts/bench_explain.js` to run `EXPLAIN ANALYZE` on a sample query.

**Transaction Scenarios**
- Successful transaction: creates an `Order` and decrements `Product.stock` in a single atomic operation using `prisma.$transaction([...])`.
- Failing transaction: simulates an error after creating an `Order` to verify that the transaction rolls back and product stock is unchanged.

**Rollback Logic**
- The failing scenario throws an error inside a transactional callback. Prisma rolls back automatically; the script then verifies no partial writes occurred.

**Indexes added** (in `prisma/schema.prisma`):
- `Product`: `@@index([name])`
- `Order`: `@@index([userId])`, `@@index([status])`
- `OrderItem`: `@@index([orderId])`, `@@index([productId])`

These indexes optimize queries that filter products by name and orders by user or status.

**How to run locally**
1. Create or connect your Postgres DB and set `DATABASE_URL`.
2. Generate and apply migration with Prisma:

   npx prisma migrate dev --name add_product_order_indexes

3. Seed the DB:

   node prisma/seed.js

4. Run the transaction demo (with Prisma query logs):

   DEBUG="prisma:query" node scripts/transaction_demo.js

   - The success case shows the created order and decremented stock.
   - The failing case shows the rollback and that the product stock remains unchanged.

5. Run the benchmark EXPLAIN ANALYZE for a sample query:

   node scripts/bench_explain.js

   - Run this before and after applying indexes (or before/after applying migration) to compare planner output and timing.

**Sample verification steps**
- Execute the API endpoint (once dev server is running):
  - GET `/api/transactions/demo` — runs a transaction and returns JSON with `orderId` and `remainingStock`.

**Notes on benchmarking**
- For meaningful benchmarks, ensure you have realistic data volume (many rows) and run `EXPLAIN ANALYZE` for repeated samples.
- Use `pg_stat_statements`, PgHero, or RDS Performance Insights for production-grade analysis.

**Anti-patterns avoided**
- Avoided N+1 queries by performing batched creates and using relation `create` in a single call inside transactions.
- Over-fetching avoided in demo scripts — only necessary fields are used.

**Reflection**
- Use transactions when multiple writes must be consistent (e.g., order placement and inventory changes).
- Add indexes on columns used frequently in WHERE clauses or ORDER BY to reduce full table scans.

If you'd like, I can also:
- Add a small test that runs the scripts automatically against a test DB.
- Add a migration SQL file in `prisma/migrations` (requires running `npx prisma migrate dev`).

---
Files changed/added:
- `prisma/schema.prisma`
- `prisma/seed.js`
- `scripts/transaction_demo.js`
- `scripts/bench_explain.js`
- `app/api/transactions/demo/route.js`
- `TRANSACTIONS_AND_INDEXES.md`
