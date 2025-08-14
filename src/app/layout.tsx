
import type {Metadata} from 'next';
import { Inter, Space_Grotesk, Source_Code_Pro } from 'next/font/google'
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider";
import { BackgroundProvider } from '@/hooks/use-background.tsx';
import { Background } from '@/components/background';
import { GlobalHeader } from '@/components/global-header';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })
const sourceCodePro = Source_Code_Pro({ subsets: ['latin'], variable: '--font-source-code-pro' })

export const metadata: Metadata = {
  title: 'BlogGen',
  description: 'A modern blog platform built with Next.js and MongoDB',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${sourceCodePro.variable} font-body bg-transparent antialiased`}>
        <BackgroundProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
          >
            <div className="relative z-10 flex flex-col min-h-screen">
               <GlobalHeader />
              <main className="flex-grow">
                {children}
              </main>
               <footer className="w-full py-6">
                <div className="container mx-auto text-center text-muted-foreground text-sm">
                </div>
              </footer>
            </div>
            <Background />
            <Toaster />
          </ThemeProvider>
        </BackgroundProvider>
      </body>
    </html>
  );
}
