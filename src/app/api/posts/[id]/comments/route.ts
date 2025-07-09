import { NextResponse, type NextRequest } from 'next/server';
import { data } from '@/lib/data';
import { authenticate } from '@/lib/auth';
import type { Comment } from '@/types';

// GET all comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const postExists = data.posts.some((p) => p.id === params.id);
  if (!postExists) {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }

  const postComments = data.comments.filter((c) => c.postId === params.id);
  return NextResponse.json(postComments);
}

// POST a new comment to a post
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!authenticate(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  const postExists = data.posts.some((p) => p.id === params.id);
  if (!postExists) {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { content, userId } = body;

    if (!content || !userId) {
      return NextResponse.json({ message: 'Missing required fields: content, userId' }, { status: 400 });
    }

    const newComment: Comment = {
      id: `c${data.comments.length + 1}`,
      postId: params.id,
      content,
      userId,
      createdAt: new Date().toISOString(),
    };

    data.comments.push(newComment);
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }
}
