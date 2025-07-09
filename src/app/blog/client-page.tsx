// src/app/blog/client-page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from 'next/link';
import { ArrowRight, Newspaper, LogOut, User, Loader2 } from "lucide-react";
import type { Post, User as UserType } from "@/types";
import { format } from "date-fns";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface BlogClientPageProps {
    initialPosts: Post[];
}

export function BlogClientPage({ initialPosts }: BlogClientPageProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [user, setUser] = useState<UserType | null>(null);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // This runs only on the client
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast({ title: "Logged out", description: "You have successfully logged out." });
    router.push('/login');
  };
  
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast({ variant: "destructive", title: "Not Authenticated", description: "You must be logged in to post."});
        return;
    }
    setLoading(true);

    try {
        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // The API key is not needed for user-based actions, but we keep it for demo consistency
                'Authorization': 'Bearer my-secret-api-key' 
            },
            body: JSON.stringify({ title: newPostTitle, content: newPostContent, userId: user.username })
        });

        if (res.ok) {
            const newPost = await res.json();
            setPosts([newPost, ...posts]);
            setNewPostTitle('');
            setNewPostContent('');
            toast({ title: "Post created!", description: "Your new post is now live." });
        } else {
            const errorData = await res.json();
            toast({ variant: "destructive", title: "Failed to create post", description: errorData.message });
        }
    } catch (err) {
        toast({ variant: "destructive", title: "Error", description: "Could not connect to the server." });
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-10">
          <div className="text-left">
              <div className="inline-flex items-center justify-center bg-primary text-primary-foreground p-3 rounded-full mb-4">
                  <Newspaper className="h-8 w-8" />
              </div>
              <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
                  The Nextgen-Blog
              </h1>
              <p className="text-muted-foreground mt-3 text-lg max-w-2xl">
                  Welcome to our corner of the internet. Here are our latest thoughts and articles.
              </p>
          </div>
          <div className="flex items-center gap-4">
              {user ? (
                  <>
                      <span className="text-sm font-medium flex items-center gap-2"><User className="h-4 w-4" /> {user.username}</span>
                      <Button variant="ghost" size="icon" onClick={handleLogout}>
                          <LogOut className="h-5 w-5" />
                      </Button>
                  </>
              ) : (
                  <Button asChild>
                      <Link href="/login">Login</Link>
                  </Button>
              )}
          </div>
        </header>
        
        {user && (
            <Card className="mb-12">
                <CardHeader>
                    <CardTitle>Create a New Post</CardTitle>
                    <CardDescription>Share your thoughts with the world.</CardDescription>
                </CardHeader>
                <form onSubmit={handleCreatePost}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="post-title">Title</Label>
                            <Input id="post-title" value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} placeholder="Your post title" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="post-content">Content</Label>
                            <Textarea id="post-content" value={newPostContent} onChange={e => setNewPostContent(e.target.value)} placeholder="Write your post content here..." required />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={loading}>
                           {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                           Post
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        )}

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
            <p className="text-muted-foreground mt-2">Be the first one to create a post.</p>
          </div>
        )}
      </main>
      <footer className="text-center p-6 text-muted-foreground text-sm">
        <p>A modern blog built with Next.js and MongoDB.</p>
      </footer>
    </div>
  );
}
