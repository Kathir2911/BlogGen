import { NextResponse, type NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth';
import type { Post } from '@/types';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET all posts
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const posts = await db.collection('posts').find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(posts.map(p => ({...p, id: p._id.toString()})));
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new post
export async function POST(request: NextRequest) {
  if (!authenticate(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content, userId } = body;

    if (!title || !content || !userId) {
      return NextResponse.json({ message: 'Missing required fields: title, content, userId' }, { status: 400 });
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
