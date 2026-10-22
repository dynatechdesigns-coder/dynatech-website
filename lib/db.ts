import { MongoClient, type Db } from "mongodb";

// Re-use one client across hot reloads (dev) and warm serverless invocations (Vercel).
const globalForMongo = globalThis as unknown as { _mongoClient?: Promise<MongoClient> };

export function hasDatabase(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (!globalForMongo._mongoClient) {
    globalForMongo._mongoClient = new MongoClient(uri).connect();
  }
  const client = await globalForMongo._mongoClient;
  return client.db(process.env.MONGODB_DB || "dynatech");
}
