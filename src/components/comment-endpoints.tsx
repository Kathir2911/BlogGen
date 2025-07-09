"use client";

import { EndpointCard } from "./endpoint-card";

export function CommentEndpoints() {
  return (
    <div className="space-y-8">
      <EndpointCard
        method="GET"
        path="/posts/[postId]/comments"
        description="Retrieves all comments for a specific blog post. This endpoint is public."
        pathParams={[{ name: 'postId', description: 'The ID of the post to get comments for.' }]}
      />
      <EndpointCard
        method="POST"
        path="/posts/[postId]/comments"
        description="Adds a new comment to a specific blog post. Requires authentication."
        requiresAuth
        pathParams={[{ name: 'postId', description: 'The ID of the post to comment on.' }]}
        bodyFields={[
          { name: 'content', type: 'text', description: 'The content of the comment.', required: true },
          { name: 'userId', type: 'string', description: 'The ID of the user posting the comment.', required: true },
        ]}
      />
    </div>
  );
}
