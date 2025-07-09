import { NextResponse, type NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth';
import type { Comment } from '@/types';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET all comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: 'Invalid post ID' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const postExists = await db.collection('posts').findOne({ _id: new ObjectId(params.id) });
    if (!postExists) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const comments = await db.collection('comments').find({ postId: params.id }).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(comments.map(c => ({...c, id: c._id.toString()})));
  } catch (error) {
    console.error(`Failed to fetch comments for post ${params.id}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new comment to a post
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!authenticate(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  if (!ObjectId.isValid(params.id)) {
    return NextResponse.json({ message: 'Invalid post ID' }, { status: 400 });
  }

  try {
    const { db } = await connectToDatabase();
    const postExists = await db.collection('posts').findOne({ _id: new ObjectId(params.id) });
    if (!postExists) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const body = await request.json();
    const { content, userId } = body;

    if (!content || !userId) {
      return NextResponse.json({ message: 'Missing required fields: content, userId' }, { status: 400 });
    }

    const newComment: Omit<Comment, 'id' | '_id'> = {
      postId: params.id,
      content,
      userId,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection('comments').insertOne(newComment);
    
    const createdComment = {
      ...newComment,
      _id: result.insertedId,
      id: result.insertedId.toString()
    }

    return NextResponse.json(createdComment, { status: 201 });
  } catch (error) {
    console.error(`Failed to create comment for post ${params.id}:`, error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
