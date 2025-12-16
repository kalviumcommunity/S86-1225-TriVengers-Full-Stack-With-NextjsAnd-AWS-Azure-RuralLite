import prisma from '../../../../prismaClient'
import { sendSuccess, sendError } from "../../../../lib/responseHandler";
import { ERROR_CODES } from "../../../../lib/errorCodes";

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

    return sendSuccess({ orderId: order.id }, "Transaction completed", 200, { remainingStock: updatedProduct.stock })
  } catch (err) {
    return sendError("Transaction failed", ERROR_CODES.INTERNAL_ERROR, 500, err?.message ?? err)
  }
}
