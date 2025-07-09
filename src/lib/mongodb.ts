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

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);

  cached = { client, db };
  return cached;
}
