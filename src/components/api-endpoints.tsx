// src/components/api-endpoints.tsx
"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { PostEndpoints } from "@/components/post-endpoints";
import { CommentEndpoints } from "@/components/comment-endpoints";
import { Documentation } from "@/components/documentation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function ApiEndpoints() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <Tabs defaultValue="posts" className="w-full">
        <ScrollArea className="w-full">
          <div className="flex items-center px-4 py-2">
            <TabsList>
              <TabsTrigger value="posts">Post Endpoints</TabsTrigger>
              <TabsTrigger value="comments">Comment Endpoints</TabsTrigger>
              <TabsTrigger value="docs">Docs</TabsTrigger>
            </TabsList>
          </div>
        </ScrollArea>
        <Separator />
        <TabsContent value="posts" className="p-6">
          <PostEndpoints />
        </TabsContent>
        <TabsContent value="comments" className="p-6">
          <CommentEndpoints />
        </TabsContent>
        <TabsContent value="docs" className="p-6">
          <Documentation />
        </TabsContent>
      </Tabs>
    </div>
  );
}