import type { Post } from "@/types";
import { BlogClientPage } from "./client-page";

async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9002'}/api/posts`, {
    cache: 'no-store'
  });
  if (!res.ok) {
    console.error('Failed to fetch posts:', await res.text());
    throw new Error('Failed to fetch posts');
  }
  return res.json();
}

export default async function BlogPage() {
  const posts = await getPosts();

  return <BlogClientPage initialPosts={posts} />;
}
