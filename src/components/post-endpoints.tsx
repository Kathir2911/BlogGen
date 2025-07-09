"use client";

import { EndpointCard } from "./endpoint-card";

export function PostEndpoints() {
  return (
    <div className="space-y-8">
      <EndpointCard
        method="GET"
        path="/posts"
        description="Retrieves a list of all blog posts. This endpoint is public and does not require authentication."
      />
      <EndpointCard
        method="GET"
        path="/posts/[id]"
        description="Retrieves a single blog post by its unique ID. This endpoint is public."
        pathParams={[{ name: 'id', description: 'The ID of the post to retrieve.' }]}
      />
      <EndpointCard
        method="POST"
        path="/posts"
        description="Creates a new blog post. Requires authentication."
        requiresAuth
        bodyFields={[
          { name: 'title', type: 'string', description: 'The title of the new post.', required: true },
          { name: 'content', type: 'text', description: 'The main content of the post in markdown or plain text.', required: true },
          { name: 'userId', type: 'string', description: 'The ID of the user creating the post.', required: true },
        ]}
      />
      <EndpointCard
        method="PUT"
        path="/posts/[id]"
        description="Updates an existing blog post. You can update the title, content, or both. Requires authentication."
        requiresAuth
        pathParams={[{ name: 'id', description: 'The ID of the post to update.' }]}
        bodyFields={[
          { name: 'title', type: 'string', description: 'The new title for the post.' },
          { name: 'content', type: 'text', description: 'The new content for the post.' },
        ]}
      />
      <EndpointCard
        method="DELETE"
        path="/posts/[id]"
        description="Deletes a blog post by its ID. This action is irreversible. Requires authentication."
        requiresAuth
        pathParams={[{ name: 'id', description: 'The ID of the post to delete.' }]}
      />
    </div>
  );
}
