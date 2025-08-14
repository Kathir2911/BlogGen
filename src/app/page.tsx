// src/app/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/blog?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/blog');
    }
  };

  return (
    <div className="flex flex-col min-h-full flex-grow">
      <div className="flex-grow container mx-auto px-4 py-8 md:px-6 md:py-12 flex items-center justify-center">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 font-headline text-foreground">
            Your Voice. Your Platform.
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Create, share, and discover amazing blog posts on our modern, fast, and beautiful platform. The stage is yours.
          </p>
          <form onSubmit={handleSearch} className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for blog posts..."
                className="w-full pl-10 pr-20 h-12 text-lg rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 h-9 rounded-full">
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
