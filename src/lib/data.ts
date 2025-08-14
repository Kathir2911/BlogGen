// src/lib/data.ts
import { connectToDatabase } from './mongodb';
import type { Post } from '@/types';

/**
 * Fetches all posts from the database, sorted by creation date.
 * @returns A promise that resolves to an array of posts.
 */
export async function getPostsDB(): Promise<Post[]> {
  const { db } = await connectToDatabase();
  const posts = await db.collection('posts').find({}).sort({ createdAt: -1 }).toArray();
  return posts.map(p => {
    const { _id, ...re } = p;
    return { ...re, id: _id.toString() } as Post;
  });
}
