// MongoDB Client Singleton for Next.js API routes
// Direct MongoDB connection (no Prisma)

import { MongoClient } from "mongodb";

if (!process.env.DATABASE_URL) {
    throw new Error("Please define the DATABASE_URL environment variable");
}

const uri = process.env.DATABASE_URL;
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
    // In development, use a global variable to preserve the client across hot reloads
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In production, create a new client
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

// Helper function to get database
export async function getDatabase() {
    const client = await clientPromise;
    return client.db("rurallite");
}

// Helper function to get a collection
export async function getCollection(collectionName) {
    const db = await getDatabase();
    return db.collection(collectionName);
}

export default clientPromise;
