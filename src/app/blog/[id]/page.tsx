import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { ArrowLeft, MessageSquare, UserCircle } from "lucide-react";
import type { Post, Comment } from "@/types";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

async function getPost(id: string): Promise<Post> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9002'}/api/posts/${id}`, {
    cache: 'no-store'
  });
  if (!res.ok) {
    if (res.status === 404) notFound();
    throw new Error('Failed to fetch post');
  }
  return res.json();
}

async function getComments(postId: string): Promise<Comment[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9002'}/api/posts/${postId}/comments`, {
    cache: 'no-store'
  });
  if (!res.ok) {
    throw new Error('Failed to fetch comments');
  }
  return res.json();
}

import { notFound } from 'next/navigation';

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  const comments = await getComments(params.id);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/blog" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all posts
          </Link>
        </div>

        <article>
          <header className="mb-8">
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              {post.title}
            </h1>
            <p className="text-muted-foreground text-lg">
              Published on {format(new Date(post.createdAt), "MMMM d, yyyy")} by <span className="font-semibold text-foreground">{post.userId}</span>
            </p>
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            {post.content.split('\\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>

        <Separator className="my-12" />

        <section id="comments">
          <h2 className="text-3xl font-headline font-bold mb-6 flex items-center">
            <MessageSquare className="mr-3 h-7 w-7" />
            Comments ({comments.length})
          </h2>
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Card key={comment.id} className="bg-muted/50">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <UserCircle className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-base font-semibold">{comment.userId}</CardTitle>
                      <CardDescription className="text-xs">
                        {format(new Date(comment.createdAt), 'MMM d, yyyy, h:mm a')}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{comment.content}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">Be the first to leave a comment!</p>
            )}
          </div>
        </section>
      </main>
      <footer className="text-center p-6 text-muted-foreground text-sm">
        <p>A modern blog built with Next.js and MongoDB.</p>
      </footer>
    </div>
  );
}
