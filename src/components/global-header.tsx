
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BackgroundSwitcher } from '@/components/background-switcher';
import type { User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User as UserIcon } from 'lucide-react';

export function GlobalHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast({ title: "Logged out", description: "You have successfully logged out." });
    router.push('/login');
  };
  
  if (!isMounted) {
    return (
      <header className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
         <Link href="/" className="font-headline text-2xl font-bold text-foreground">
            BlogGen
        </Link>
        <div className="flex items-center gap-2"></div>
      </header>
    );
  }

  return (
    <header className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
      <Link href="/" className="font-headline text-2xl font-bold text-foreground">
        BlogGen
      </Link>
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost">
          <Link href="/blog">Blog</Link>
        </Button>
        {user ? (
          <>
            <span className="text-sm font-medium flex items-center gap-2"><UserIcon className="h-4 w-4" /> {user.username}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </>
        ) : (
          <Button asChild variant="ghost">
            <Link href="/login">Login</Link>
          </Button>
        )}
        <BackgroundSwitcher />
      </div>
    </header>
  );
}
