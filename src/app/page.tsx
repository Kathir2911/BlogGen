import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ApiEndpoints } from "@/components/api-endpoints";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow container mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tighter mb-4 font-headline">
            Welcome to <span className="text-primary">Nextgen-Blog API</span>
          </h1>
          <p className="text-muted-foreground text-xl mb-8 max-w-3xl mx-auto">
            A powerful, modern, and easy-to-use RESTful API for your blog. Explore the endpoints below.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link href="/blog">Explore the Blog UI</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>

        <ApiEndpoints />
        
      </main>
      <footer className="w-full py-6">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          <p>Built with Node.js, Next.js, and MongoDB. Styled for a modern, functional experience.</p>
        </div>
      </footer>
    </div>
  );
}
