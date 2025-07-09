import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { ArrowRight, Newspaper } from "lucide-react";
import type { Post } from "@/types";
import { format } from "date-fns";

async function getPosts() {
  // This fetch call is server-side and will not expose the direct API URL to the client.
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9002'}/api/posts`, {
    cache: 'no-store' // Fetch fresh data on each request
  });
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch posts');
  }
  return res.json();
}

export default async function BlogPage() {
  const posts: Post[] = await getPosts();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-primary text-primary-foreground p-3 rounded-full mb-4">
            <Newspaper className="h-8 w-8" />
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
            The Nextgen-Blog
          </h1>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
            Welcome to our corner of the internet. Here are our latest thoughts and articles.
          </p>
        </header>

        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.id} className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold hover:text-primary">
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </CardTitle>
                  <CardDescription>
                    Posted on {format(new Date(post.createdAt), 'MMMM d, yyyy')} by {post.userId}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="line-clamp-3 text-muted-foreground">{post.content}</p>
                </CardContent>
                <CardFooter>
                  <Link href={`/blog/${post.id}`} className="flex items-center font-semibold text-primary hover:underline">
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold">No posts yet!</h2>
            <p className="text-muted-foreground mt-2">Check back later for new articles.</p>
          </div>
        )}
      </main>
      <footer className="text-center p-6 text-muted-foreground text-sm">
        <p>A modern blog built with Next.js and MongoDB.</p>
      </footer>
    </div>
  );
}
