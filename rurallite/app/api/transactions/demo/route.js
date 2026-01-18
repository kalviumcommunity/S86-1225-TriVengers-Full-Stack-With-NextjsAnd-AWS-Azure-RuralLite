import { getDatabase } from "../../../../lib/mongodb";
import { sendSuccess, sendError } from "../../../../lib/responseHandler";
import { ERROR_CODES } from "../../../../lib/errorCodes";

export async function GET() {
    try {
        const db = await getDatabase();

        // Create demo user if missing
        const usersCollection = db.collection("users");
        let user = await usersCollection.findOne({ email: "api-tx@rural.local" });

        if (!user) {
            const newUser = {
                email: "api-tx@rural.local",
                name: "API TX",
                role: "STUDENT",
                password: "x",
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const result = await usersCollection.insertOne(newUser);
            user = { ...newUser, _id: result.insertedId };
        }

        // Create demo product if missing
        const productsCollection = db.collection("products");
        let product = await productsCollection.findOne({});

        if (!product) {
            const newProduct = {
                name: "API Demo Product",
                sku: `API-DEMO-${Date.now()}`,
                price: 29.99,
                stock: 3,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const result = await productsCollection.insertOne(newProduct);
            product = { ...newProduct, _id: result.insertedId };
        }

        // MongoDB transaction: create order and decrement stock
        const session = db.client.startSession();

        try {
            await session.withTransaction(async () => {
                const ordersCollection = db.collection("orders");
                const orderItemsCollection = db.collection("orderItems");

                // Create order
                const newOrder = {
                    userId: user._id,
                    total: 29.99,
                    status: "COMPLETED",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                const orderResult = await ordersCollection.insertOne(newOrder, { session });

                // Create order item
                const newOrderItem = {
                    orderId: orderResult.insertedId,
                    productId: product._id,
                    quantity: 1,
                    price: 29.99,
                    createdAt: new Date(),
                };
                await orderItemsCollection.insertOne(newOrderItem, { session });

                // Decrement product stock
                const updateResult = await productsCollection.findOneAndUpdate(
                    { _id: product._id },
                    { $inc: { stock: -1 }, $set: { updatedAt: new Date() } },
                    { returnDocument: "after", session }
                );

                product = updateResult;
            });

            return sendSuccess(
                { orderId: "transaction-completed" },
                "Transaction completed",
                200,
                { remainingStock: product.stock }
            );
        } finally {
            await session.endSession();
        }
    } catch (err) {
        return sendError(
            "Transaction failed",
            ERROR_CODES.INTERNAL_ERROR,
            500,
            err?.message ?? err
        );
    }
} 