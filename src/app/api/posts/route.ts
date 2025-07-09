import { NextResponse, type NextRequest } from 'next/server';
import { data } from '@/lib/data';
import { authenticate } from '@/lib/auth';
import type { Post } from '@/types';

// GET all posts
export async function GET() {
  return NextResponse.json(data.posts);
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

    const newPost: Post = {
      id: (data.posts.length + 1).toString(),
      title,
      content,
      userId,
      createdAt: new Date().toISOString(),
    };

    data.posts.push(newPost);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }
}
