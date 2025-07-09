import { NextResponse, type NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth';
import type { Post } from '@/types';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET a single post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: 'Invalid post ID' }, { status: 400 });
    }
    const { db } = await connectToDatabase();
    const post = await db.collection('posts').findOne({ _id: new ObjectId(params.id) });

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({...post, id: post._id.toString()});
  } catch (error) {
    console.error(`Failed to fetch post ${params.id}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) a post by ID
export async function PUT(
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
    const body = await request.json();
    const { title, content } = body;

    if (!title && !content) {
        return NextResponse.json({ message: 'No update fields provided' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const updateData: Partial<Post> = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;

    const result = await db.collection('posts').findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({...result, id: result._id.toString()});
  } catch (error) {
    console.error(`Failed to update post ${params.id}:`, error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a post by ID
export async function DELETE(
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
    // Also delete comments associated with the post
    await db.collection('comments').deleteMany({ postId: params.id });
    const result = await db.collection('posts').deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Failed to delete post ${params.id}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
