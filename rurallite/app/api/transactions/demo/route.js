import prisma from '../../../../prismaClient'
import { NextResponse } from 'next/server'

export async function GET() {
  // Create demo user/product if missing
  const user = (await prisma.user.findFirst()) || (await prisma.user.create({ data: { email: `api-tx@rural.local`, name: 'API TX', role: 'STUDENT', password: 'x' } }))
  let product = await prisma.product.findFirst()

  if (!product) {
    product = await prisma.product.create({ data: { name: 'API Demo Product', sku: `API-DEMO-${Date.now()}`, price: 29.99, stock: 3 } })
  }

  // Run a transaction: create order and decrement stock
  try {
    const [order, updatedProduct] = await prisma.$transaction([
      prisma.order.create({ data: { userId: user.id, total: 29.99, status: 'COMPLETED', items: { create: [{ productId: product.id, quantity: 1, price: 29.99 }] } }, include: { items: true } }),
      prisma.product.update({ where: { id: product.id }, data: { stock: { decrement: 1 } } }),
    ])

    return NextResponse.json({ success: true, orderId: order.id, remainingStock: updatedProduct.stock })
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
