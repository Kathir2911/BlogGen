import { NextResponse, type NextRequest } from 'next/server';
import { data } from '@/lib/data';
import { authenticate } from '@/lib/auth';
import type { Post } from '@/types';

// GET a single post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = data.posts.find((p) => p.id === params.id);
  if (!post) {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }
  return NextResponse.json(post);
}

// PUT (update) a post by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!authenticate(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const postIndex = data.posts.findIndex((p) => p.id === params.id);
  if (postIndex === -1) {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { title, content } = body;

    const originalPost = data.posts[postIndex];
    const updatedPost: Post = {
      ...originalPost,
      title: title ?? originalPost.title,
      content: content ?? originalPost.content,
    };

    data.posts[postIndex] = updatedPost;
    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
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

  const postIndex = data.posts.findIndex((p) => p.id === params.id);
  if (postIndex === -1) {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }

  data.posts.splice(postIndex, 1);
  return new NextResponse(null, { status: 204 });
}
