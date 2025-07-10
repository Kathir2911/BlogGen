// src/app/blog/client-page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from 'next/link';
import { ArrowRight, Newspaper, LogOut, User, Loader2, Search, X } from "lucide-react";
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
  const [posts] = useState<Post[]>(initialPosts);
  const [user, setUser] = useState<UserType | null>(null);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    // This runs only on the client
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.userId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [posts, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    const newParams = new URLSearchParams(searchParams.toString());
    if (query) {
      newParams.set('q', query);
    } else {
      newParams.delete('q');
    }
    // Update URL without navigation to keep state
    window.history.replaceState(null, '', `/blog?${newParams.toString()}`);
  }
  
  const clearSearch = () => {
    setSearchQuery('');
    window.history.replaceState(null, '', `/blog`);
  };

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
            // Since we're not reloading, we can just refetch or redirect.
            // For simplicity, let's just reload to see the new post.
            toast({ title: "Post created!", description: "Your new post is now live." });
            router.refresh(); 
            setNewPostTitle('');
            setNewPostContent('');
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
        <header className="flex justify-between items-start mb-10 gap-4">
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
          <div className="flex items-center gap-4 flex-shrink-0">
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

        <div className="mb-12">
            <div className="relative max-w-2xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Filter posts by title, content, or author..."
                    className="w-full pl-10 pr-10"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                {searchQuery && (
                  <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={clearSearch}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear search</span>
                  </Button>
                )}
            </div>
        </div>
        
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

        {filteredPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
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
            <h2 className="text-2xl font-semibold">No posts found</h2>
            <p className="text-muted-foreground mt-2">
              {searchQuery ? `Your search for "${searchQuery}" did not return any results.` : "Be the first one to create a post."}
            </p>
            {searchQuery && (
              <Button variant="outline" className="mt-4" onClick={clearSearch}>
                Clear Search
              </Button>
            )}
          </div>
        )}
      </main>
      <footer className="text-center p-6 text-muted-foreground text-sm">
        <p>A modern blog built with Next.js and MongoDB.</p>
      </footer>
    </div>
  );
}
