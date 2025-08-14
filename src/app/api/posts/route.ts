import { NextResponse, type NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth';
import type { Post } from '@/types';
import { connectToDatabase } from '@/lib/mongodb';
import { getPostsDB } from '@/lib/data';

// GET all posts
export async function GET() {
  try {
    const posts = await getPostsDB();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new post
export async function POST(request: NextRequest) {
  const authResult = authenticate(request);
  if (!authResult.authenticated || !authResult.username) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content } = body;
    const userId = authResult.username;

    if (!title || !content || !userId) {
      return NextResponse.json({ message: 'Missing required fields: title, content' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    const newPost: Omit<Post, 'id' | '_id'> = {
      title,
      content,
      userId,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection('posts').insertOne(newPost);
    
    const createdPost = {
      ...newPost,
      _id: result.insertedId,
      id: result.insertedId.toString()
    }

    return NextResponse.json(createdPost, { status: 201 });
  } catch (error) {
    console.error('Failed to create post:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
