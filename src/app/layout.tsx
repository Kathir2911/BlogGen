import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider";
import { BackgroundProvider } from '@/hooks/use-background.tsx';
import { Background } from '@/components/background';

export const metadata: Metadata = {
  title: 'Nextgen-Blog',
  description: 'A modern blog platform built with Next.js and MongoDB',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body bg-background antialiased">
        <BackgroundProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="chronicle"
            enableSystem={false}
          >
            <Background />
            {children}
            <Toaster />
          </ThemeProvider>
        </BackgroundProvider>
      </body>
    </html>
  );
}
