import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="absolute top-0 right-0 p-4">
        <ThemeSwitcher />
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 md:px-6 md:py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-4 font-headline">
            Welcome to <span className="text-primary">Nextgen-Blog</span>
          </h1>
          <p className="text-muted-foreground text-xl mb-8 max-w-3xl mx-auto font-body">
            Stories, thoughts, and ideas from the curious minds.
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
      </main>
      <footer className="w-full py-6">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          <p>Built with Node.js, Next.js, and MongoDB.</p>
        </div>
      </footer>
    </div>
  );
}
