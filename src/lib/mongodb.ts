import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable inside .env.local');
}

interface CachedConnection {
    client: MongoClient;
    db: Db;
}

let cached: CachedConnection | null = null;

export async function connectToDatabase(): Promise<CachedConnection> {
  if (cached) {
    return cached;
  }

  const mongoUri: string = MONGODB_URI!;
  const dbName: string = MONGODB_DB!;
  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db(dbName);

  cached = { client, db };
  return cached;
}
