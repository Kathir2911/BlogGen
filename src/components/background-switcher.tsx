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
import { ScrollArea } from "./ui/scroll-area"

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
    url: 'https://images.unsplash.com/photo-1516938747262-9e336203a3fa?q=80&w=1920&auto=format&fit=crop',
    hint: 'wanaka tree'
  },
  {
    name: "Aurora Borealis",
    slug: "aurora",
    url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1920&auto=format&fit=crop',
    hint: 'aurora borealis'
  },
  {
    name: "Misty Lake",
    slug: "misty-lake",
    url: 'https://plus.unsplash.com/premium_photo-1673603719788-5142a261a148?q=80&w=1920&auto=format&fit=crop',
    hint: 'misty lake'
  },
  {
    name: "Pastel Sky",
    slug: "pastel-sky",
    url: 'https://images.unsplash.com/photo-1518066000714-58c45f7e8c4b?q=80&w=1920&auto=format&fit=crop',
    hint: 'pastel sky'
  },
  {
    name: "Abstract Blue",
    slug: "abstract-blue",
    url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1920&auto=format&fit=crop',
    hint: 'abstract blue'
  },
  {
    name: "City Harbor",
    slug: "city-harbor",
    url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1920&auto=format&fit=crop',
    hint: 'city harbor'
  },
  {
    name: "Desert Galaxy",
    slug: "desert-galaxy",
    url: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=1920&auto=format&fit=crop',
    hint: 'desert galaxy'
  },
  {
    name: "Mountain Lake",
    slug: "mountain-lake",
    url: 'https://images.unsplash.com/photo-1476610182240-c089bb3ac245?q=80&w=1920&auto=format&fit=crop',
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
      <SheetContent className="w-[340px] sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Customize background</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-grow">
            <div className="py-6 space-y-6 pr-6">

            {currentBg && currentBg.slug !== 'default' && (
                <div className="flex items-center space-x-4 rounded-lg border p-4">
                    <div className="flex-shrink-0">
                        <Image 
                            data-ai-hint={currentBg.hint}
                            src={currentBg.url.replace('w=1920', 'w=150')}
                            alt={currentBg.name}
                            width={150}
                            height={100}
                            className="rounded-md"
                        />
                    </div>
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{currentBg.name}</p>
                        <p className="text-sm text-muted-foreground">Image by Unsplash</p>
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
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
