
import type { Post, Comment } from "@/types";
import { notFound } from 'next/navigation';
import { BlogPostClientPage } from './client-page';
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

async function getPost(id: string): Promise<Post | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  try {
    const { db } = await connectToDatabase();
    const post = await db.collection('posts').findOne({ _id: new ObjectId(id) });

    if (!post) {
      return null;
    }
    
    const { _id, ...rest } = post;
    return { ...rest, id: _id.toString() } as Post;
  } catch (error) {
    console.error('Failed to fetch post directly:', error);
    return null;
  }
}

async function getComments(postId: string): Promise<Comment[]> {
  if (!ObjectId.isValid(postId)) {
    return [];
  }
  try {
    const { db } = await connectToDatabase();
    const comments = await db.collection('comments').find({ postId: postId }).sort({ createdAt: -1 }).toArray();
    return comments.map(c => {
        const { _id, ...re } = c;
        return { ...re, id: _id.toString() } as Comment;
    });
  } catch (error) {
    console.error('Failed to fetch comments directly:', error);
    return [];
  }
}

interface BlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  const post = await getPost(id);
  
  if (!post) {
    notFound();
  }

  const comments = await getComments(id);

  return <BlogPostClientPage initialPost={post} initialComments={comments} />;
}
