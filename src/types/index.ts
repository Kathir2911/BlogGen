export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
}
