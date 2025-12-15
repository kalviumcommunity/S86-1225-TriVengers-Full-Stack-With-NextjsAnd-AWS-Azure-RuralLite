#!/usr/bin/env node
/**
 * Simple script to run EXPLAIN ANALYZE on a sample Product query
 * Usage:
 *  node scripts/bench_explain.js
 */

import prisma from '../prismaClient.js'

async function main() {
  let product = await prisma.product.findFirst()
  if (!product) {
    product = await prisma.product.create({ data: { name: 'Bench Product', sku: `BENCH-${Date.now()}`, price: 1.0, stock: 1000 } })
  }

  const query = `EXPLAIN ANALYZE SELECT * FROM \"Product\" WHERE \"name\" = $1;`
  const result = await prisma.$queryRawUnsafe(query.replace('$1', `'${product.name.replace("'", "''")}'`))

  console.log('\nEXPLAIN ANALYZE for Product by name:')
  console.log(result.map(r => r['QUERY PLAN'] || r).join('\n'))

  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
