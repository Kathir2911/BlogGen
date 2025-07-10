import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApiEndpoints } from "@/components/api-endpoints";

export default function ApiExplorerPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter mb-2">
            API Explorer
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Interact with the BlogGen API endpoints directly from your browser. Test out creating, reading, updating, and deleting posts and comments.
          </p>
        </header>
        <ApiEndpoints />
      </main>
    </div>
  );
}
