import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tighter mb-4">
          Welcome to <span className="text-primary">Nextgen-Blog</span>
        </h1>
        <p className="text-muted-foreground text-xl mb-8">
          The complete platform for sharing your ideas.
        </p>
        <div className="space-x-4">
          <Button asChild size="lg">
            <Link href="/blog">Explore the Blog</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      </div>
      <footer className="absolute bottom-0 p-6 text-muted-foreground text-sm">
        <p>Built with Node.js, Next.js, and ShadCN UI. Styled for a modern, functional experience.</p>
      </footer>
    </div>
  );
}
