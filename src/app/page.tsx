import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostEndpoints } from "@/components/post-endpoints"
import { CommentEndpoints } from "@/components/comment-endpoints"
import { Documentation } from "@/components/documentation"
import { Terminal } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-primary text-primary-foreground p-3 rounded-full mb-4">
            <Terminal className="h-8 w-8" />
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
            <span className="text-primary">Nextgen-Blog</span> API Explorer
          </h1>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
            An interactive interface for creating, editing, and retrieving blog posts and comments on the Nextgen-Blog platform.
          </p>
        </header>

        <Tabs defaultValue="posts" className="w-full max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="posts">Post Endpoints</TabsTrigger>
            <TabsTrigger value="comments">Comment Endpoints</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="mt-6">
            <PostEndpoints />
          </TabsContent>
          <TabsContent value="comments" className="mt-6">
            <CommentEndpoints />
          </TabsContent>
          <TabsContent value="documentation" className="mt-6">
            <Documentation />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="text-center p-6 text-muted-foreground text-sm">
        <p>Built with Node.js, Next.js, and ShadCN UI. Styled for a modern, functional experience.</p>
      </footer>
    </div>
  );
}
