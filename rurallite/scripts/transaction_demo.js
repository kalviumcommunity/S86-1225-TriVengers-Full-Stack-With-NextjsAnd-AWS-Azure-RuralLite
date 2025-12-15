#!/usr/bin/env node
/**
 * Transaction demo script
 * - Creates an order and decrements product stock in a transaction
 * - Intentionally triggers a failing transaction and verifies rollback
 *
 * Usage:
 *  DEBUG="prisma:query" node scripts/transaction_demo.js
 */

import prisma from '../prismaClient.js'

async function successfulTransaction(productId, userId) {
  console.log('\n--- Running successful transaction ---')
  const [order, updatedProduct] = await prisma.$transaction([
    prisma.order.create({
      data: {
        userId,
        total: 199.99,
        status: 'COMPLETED',
        items: {
          create: [
            { productId, quantity: 1, price: 199.99 },
          ],
        },
      },
      include: { items: true },
    }),
    prisma.product.update({
      where: { id: productId },
      data: { stock: { decrement: 1 } },
    }),
  ])

  console.log('Transaction successful. Order id:', order.id)
  console.log('Remaining stock:', updatedProduct.stock)
}

async function failingTransaction(productId, userId) {
  console.log('\n--- Running failing transaction (should rollback) ---')
  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          total: 1000,
          status: 'PENDING',
          items: {
            create: [
              { productId, quantity: 1000, price: 1000 }, // intentionally too many
            ],
          },
        },
      })

      // Intentionally throw to trigger rollback
      throw new Error('Simulated failure after creating order')

      // This update would not run due to the error
      await tx.product.update({ where: { id: productId }, data: { stock: { decrement: 1000 } } })
    })
  } catch (err) {
    console.log('Transaction failed and was rolled back:', err.message)

    // Verify no partial writes
    const product = await prisma.product.findUnique({ where: { id: productId } })
    const orders = await prisma.order.findMany({ where: { userId } })
    console.log('Post-failure product stock:', product.stock)
    console.log('Orders for user after rollback:', orders.length)
  }
}

async function main() {
  // Ensure there is at least one user and one product
  const user = await prisma.user.findFirst() || await prisma.user.create({ data: { email: `tx-demo@rural.local`, name: 'TX Demo', role: 'STUDENT', password: 'x' } })
  let product = await prisma.product.findFirst()

  if (!product) {
    product = await prisma.product.create({ data: { name: 'Demo Product', sku: `DEMO-${Date.now()}`, price: 9.99, stock: 5 } })
  }

  console.log('Using user id:', user.id, 'product id:', product.id, 'starting stock:', product.stock)

  await successfulTransaction(product.id, user.id)
  await failingTransaction(product.id, user.id)

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
