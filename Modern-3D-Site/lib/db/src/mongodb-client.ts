import { MongoClient, Db, Collection } from "mongodb";

if (!process.env.MONGODB_URL) {
  throw new Error("MONGODB_URL must be set. Did you forget to set it in .env?");
}

const client = new MongoClient(process.env.MONGODB_URL);
let db: Db | null = null;

export async function connectDB(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    await client.connect();
    db = client.db("festiva_planner");
    
    // Ensure collections exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    if (!collectionNames.includes("plans")) {
      await db.createCollection("plans");
      console.log("Created 'plans' collection");
    }
    
    // Create indexes
    const plansCollection = db.collection("plans");
    await plansCollection.createIndex({ createdAt: -1 });
    await plansCollection.createIndex({ city: 1 });
    await plansCollection.createIndex({ eventType: 1 });
    
    console.log("Connected to MongoDB successfully");
    return db;
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    throw err;
  }
}

export async function getPlansCollection(): Promise<Collection> {
  const database = await connectDB();
  return database.collection("plans");
}

export async function disconnectDB(): Promise<void> {
  if (client) {
    await client.close();
    db = null;
    console.log("Disconnected from MongoDB");
  }
}

// Export types for plans
export interface PlanDocument {
  _id?: string;
  eventType: string;
  eventTitle: string;
  city: string;
  budget: number;
  guests: number;
  plan: Record<string, unknown>;
  createdAt: Date;
}

export { db as mongoDb };
