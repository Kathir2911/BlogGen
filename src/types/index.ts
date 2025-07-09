import type { ObjectId } from 'mongodb';

export interface Post {
  _id?: ObjectId;
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface Comment {
  _id?: ObjectId;
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
}
