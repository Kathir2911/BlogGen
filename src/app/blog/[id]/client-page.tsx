// src/app/blog/[id]/client-page.tsx
"use client";

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquare, UserCircle, Loader2, Trash2 } from "lucide-react";
import type { Post, Comment, User } from "@/types";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface BlogPostClientPageProps {
  initialPost: Post;
  initialComments: Comment[];
}

export function BlogPostClientPage({ initialPost, initialComments }: BlogPostClientPageProps) {
  const [post] = useState<Post>(initialPost);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [user, setUser] = useState<User | null>(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handlePostDelete = async () => {
    setLoading(true);
    try {
        const res = await fetch(`/api/posts/${post.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer my-secret-api-key:${user?.username}`
            },
        });

        if (res.ok) {
            toast({ title: "Post deleted", description: "The post has been successfully removed." });
            router.push('/blog');
        } else {
            const errorData = await res.json();
            toast({ variant: "destructive", title: "Failed to delete post", description: errorData.message });
        }
    } catch (err) {
        toast({ variant: "destructive", title: "Error", description: "Could not connect to the server." });
    } finally {
        setLoading(false);
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    setLoading(true);
    try {
        const res = await fetch(`/api/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer my-secret-api-key:${user?.username}`
            },
        });
        if (res.ok) {
            setComments(comments.filter(c => c.id !== commentId));
            toast({ title: "Comment deleted", description: "Your comment has been removed." });
        } else {
            const errorData = await res.json();
            toast({ variant: "destructive", title: "Failed to delete comment", description: errorData.message });
        }
    } catch (err) {
        toast({ variant: "destructive", title: "Error", description: "Could not connect to the server." });
    } finally {
        setLoading(false);
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast({ variant: "destructive", title: "Not Authenticated", description: "You must be logged in to comment."});
        return;
    }
    setLoading(true);

    try {
        const res = await fetch(`/api/posts/${post.id}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer my-secret-api-key'
            },
            body: JSON.stringify({ content: newComment, userId: user.username })
        });

        if (res.ok) {
            const addedComment = await res.json();
            setComments([addedComment, ...comments]);
            setNewComment('');
            toast({ title: "Comment added!", description: "Your comment has been posted." });
        } else {
            const errorData = await res.json();
            toast({ variant: "destructive", title: "Failed to add comment", description: errorData.message });
        }
    } catch (err) {
        toast({ variant: "destructive", title: "Error", description: "Could not connect to the server." });
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="bg-transparent text-foreground rounded-lg">
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/blog" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all posts
          </Link>
        </div>

        <article>
          <header className="mb-8">
            <div className="flex justify-between items-start gap-4">
                <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter mb-4 flex-grow">
                  {post.title}
                </h1>
                {user && user.username === post.userId && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" disabled={loading}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your post and all its comments.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handlePostDelete}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
            <p className="text-muted-foreground text-lg">
              Published on {format(new Date(post.createdAt), "MMMM d, yyyy")} by <span className="font-semibold text-foreground">{post.userId}</span>
            </p>
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            {post.content.split('\n').map((paragraph, index) => (
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

          {user && (
            <Card className="mb-8 bg-card/80">
                <CardHeader>
                    <CardTitle>Leave a Comment</CardTitle>
                </CardHeader>
                <form onSubmit={handleAddComment}>
                    <CardContent>
                        <Label htmlFor="comment-content" className="sr-only">Comment</Label>
                        <Textarea id="comment-content" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Share your thoughts..." required />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Comment
                        </Button>
                    </CardFooter>
                </form>
            </Card>
          )}

          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Card key={comment.id} className="bg-muted/50">
                    <div className="flex justify-between items-start">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2 flex-grow">
                            <UserCircle className="h-8 w-8 text-muted-foreground" />
                            <div>
                            <CardTitle className="text-base font-semibold">{comment.userId}</CardTitle>
                            <CardDescription className="text-xs">
                                {format(new Date(comment.createdAt), 'MMM d, yyyy, h:mm a')}
                            </CardDescription>
                            </div>
                        </CardHeader>

                        {user && user.username === comment.userId && (
                             <div className="p-4">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" disabled={loading}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your comment.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleCommentDelete(comment.id)}>
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Delete"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        )}
                    </div>
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
      </div>
    </div>
  );
}
