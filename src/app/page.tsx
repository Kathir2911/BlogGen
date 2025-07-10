import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { BackgroundSwitcher } from "@/components/background-switcher";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        <Link href="/" className="font-headline text-2xl font-bold text-foreground">
          NodeBlogAPI
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/blog">Blog UI</Link>
          </Button>
          <Button asChild variant="ghost">
             <Link href="/api-explorer">API Explorer</Link>
          </Button>
          <BackgroundSwitcher />
          <ThemeSwitcher />
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 md:px-6 md:py-12 flex items-center justify-center">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 font-headline text-foreground">
            A Modern API for Your Blog
          </h1>
          <p className="text-muted-foreground text-xl mb-8 font-body">
            Create, manage, and deliver content with a powerful and easy-to-use RESTful API, complete with auto-generated documentation.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link href="/login">Get Started</Link>
            </Button>
             <Button asChild size="lg" variant="secondary">
              <Link href="/api-explorer">Explore the API</Link>
            </Button>
          </div>
        </div>
      </main>
      <footer className="w-full py-6">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          Built with Node.js, Next.js, and MongoDB.
        </div>
      </footer>
    </div>
  );
}
