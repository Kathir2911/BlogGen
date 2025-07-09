import type { Post, Comment } from '@/types';

// In-memory store
let posts: Post[] = [
  {
    id: '1',
    userId: 'user-123',
    title: 'Getting Started with Next.js',
    content: 'Next.js is a React framework for building full-stack web applications. It comes with a powerful set of features out of the box.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: 'user-456',
    title: 'Exploring Tailwind CSS',
    content: 'Tailwind CSS is a utility-first CSS framework that can be composed to build any design, directly in your markup.',
    createdAt: new Date().toISOString(),
  },
];

let comments: Comment[] = [
    {
        id: 'c1',
        postId: '1',
        userId: 'user-789',
        content: 'Great overview! I found this very helpful.',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'c2',
        postId: '1',
        userId: 'user-456',
        content: 'Thanks for sharing. Looking forward to more content.',
        createdAt: new Date().toISOString(),
    }
];

export const data = {
  posts,
  comments,
};
