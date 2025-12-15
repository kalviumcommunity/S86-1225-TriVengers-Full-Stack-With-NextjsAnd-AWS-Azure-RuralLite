#!/usr/bin/env node
/**
 * Run EXPLAIN ANALYZE on a Product.name query, drop the index, run again (before), recreate index, run again (after).
 * Saves outputs to ./benchmarks/real_before.txt and ./benchmarks/real_after.txt
 */

import prisma from '../prismaClient.js'
import fs from 'fs'

async function explainForName(name) {
  const query = `EXPLAIN ANALYZE SELECT * FROM "Product" WHERE "name" = $1;`
  const rows = await prisma.$queryRawUnsafe(query.replace('$1', `'${name.replace("'", "''")}'`))
  return rows.map(r => r['QUERY PLAN'] || r).join('\n')
}

async function main() {
  const product = await prisma.product.findFirst()
  if (!product) {
    console.error('No product found; seed the DB first.')
    process.exit(1)
  }
  const name = product.name
  console.log('Using product name:', name)

  // If not enough rows, bulk-insert many dummy products to make the index matter
  const total = await prisma.product.count()
  if (total < 5000) {
    console.log('Inserting dummy products to increase table size for meaningful EXPLAIN output...')
    const data = []
    for (let i = 0; i < 5000; i++) {
      data.push({ name: `Dummy Product ${i} ${Date.now()}`, sku: `DUMMY-${i}-${Date.now()}`, price: Math.random() * 100, stock: Math.floor(Math.random() * 100) })
    }
    await prisma.product.createMany({ data })
    console.log('Inserted 5000 dummy products')
  }

  // Ensure index exists
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "Product_name_idx" ON "Product"(name);')

  // Drop index to simulate BEFORE
  await prisma.$executeRawUnsafe('DROP INDEX IF EXISTS "Product_name_idx";')
  const before = await explainForName(name)
  fs.writeFileSync('benchmarks/real_before.txt', before)
  console.log('Wrote benchmarks/real_before.txt')

  // Recreate index and run AFTER
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "Product_name_idx" ON "Product"(name);')
  const after = await explainForName(name)
  fs.writeFileSync('benchmarks/real_after.txt', after)
  console.log('Wrote benchmarks/real_after.txt')

  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
