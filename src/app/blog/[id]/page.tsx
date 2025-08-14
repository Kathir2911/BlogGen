
import type { Post, Comment } from "@/types";
import { notFound } from 'next/navigation';
import { BlogPostClientPage } from './client-page';

async function getPost(id: string): Promise<Post | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/posts/${id}`, {
    cache: 'no-store'
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch post');
  }
  return res.json();
}

async function getComments(postId: string): Promise<Comment[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/posts/${postId}/comments`, {
    cache: 'no-store'
  });
  if (!res.ok) {
    throw new Error('Failed to fetch comments');
  }
  return res.json();
}

interface BlogPostPageProps {
  params: { id: string };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = params;
  const post = await getPost(id);
  
  if (!post) {
    notFound();
  }

  const comments = await getComments(id);

  return <BlogPostClientPage initialPost={post} initialComments={comments} />;
}
