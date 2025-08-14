// src/components/background-switcher.tsx
"use client"

import * as React from "react"
import { Image as ImageIcon, Check, X } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useBackground } from "@/hooks/use-background"
import { cn } from "@/lib/utils"

export const backgrounds = [
  {
    name: 'Default',
    slug: 'default',
    url: '',
    hint: ''
  },
  {
    name: "Lake Wanaka",
    slug: "lake-wanaka",
    url: 'https://placehold.co/1920x1080.png',
    hint: 'wanaka tree'
  },
  {
    name: "Aurora Borealis",
    slug: "aurora",
    url: 'https://placehold.co/1920x1080.png',
    hint: 'aurora borealis'
  },
  {
    name: "Misty Lake",
    slug: "misty-lake",
    url: 'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?q=80&w=1920&auto=format&fit=crop',
    hint: 'misty lake'
  },
  {
    name: "Pastel Sky",
    slug: "pastel-sky",
    url: 'https://placehold.co/1920x1080.png',
    hint: 'pastel sky'
  },
  {
    name: "Abstract Blue",
    slug: "abstract-blue",
    url: 'https://placehold.co/1920x1080.png',
    hint: 'abstract blue'
  },
  {
    name: "City Harbor",
    slug: "city-harbor",
    url: 'https://placehold.co/1920x1080.png',
    hint: 'city harbor'
  },
  {
    name: "Desert Galaxy",
    slug: "desert-galaxy",
    url: 'https://placehold.co/1920x1080.png',
    hint: 'desert galaxy'
  },
  {
    name: "Mountain Lake",
    slug: "mountain-lake",
    url: 'https://placehold.co/1920x1080.png',
    hint: 'mountain lake'
  },
]

export function BackgroundSwitcher() {
  const { background, setBackground, enabled, setEnabled } = useBackground()

  const currentBg = React.useMemo(() => {
    return backgrounds.find(b => b.slug === background) || backgrounds[0];
  }, [background]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <ImageIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Customize Background</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[340px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Customize background</SheetTitle>
        </SheetHeader>
        <div className="py-6 space-y-6">

          {currentBg && currentBg.slug !== 'default' && (
             <div className="flex items-center space-x-4 rounded-lg border p-4">
                <div className="flex-shrink-0">
                    <Image 
                        data-ai-hint={currentBg.hint}
                        src={currentBg.url.replace('1920x1080', '150x100')}
                        alt={currentBg.name}
                        width={150}
                        height={100}
                        className="rounded-md"
                    />
                </div>
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{currentBg.name}</p>
                    <p className="text-sm text-muted-foreground">Image by AI</p>
                </div>
             </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="background-switch" className="text-base">Background</Label>
            <Switch
              id="background-switch"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {backgrounds.map((bg) => (
              <button
                key={bg.slug}
                onClick={() => setBackground(bg.slug)}
                className={cn(
                  "relative aspect-square w-full rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                )}
                disabled={!enabled}
              >
                {bg.slug === 'default' ? (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <X className="h-8 w-8 text-muted-foreground"/>
                  </div>
                ) : (
                    <Image
                      data-ai-hint={bg.hint}
                      src={bg.url.replace(/1920x1080|w=1920/, 'w=200')}
                      alt={bg.name}
                      fill
                      className="object-cover"
                    />
                )}
                {background === bg.slug && (
                  <div className="absolute inset-0 bg-primary/60 flex items-center justify-center">
                    <Check className="h-8 w-8 text-primary-foreground" />
                  </div>
                )}
                <span className="sr-only">{bg.name}</span>
              </button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
