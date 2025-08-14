
import type { Post } from "@/types";
import { BlogClientPage } from "./client-page";
import { getPostsDB } from "@/lib/data";

async function getPosts(): Promise<Post[]> {
  try {
    // Fetch data directly from the database function
    const posts = await getPostsDB();
    return posts;
  } catch (error) {
    console.error('Failed to fetch posts directly:', error);
    // Return an empty array or handle the error as appropriate
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return <BlogClientPage initialPosts={posts} />;
}
