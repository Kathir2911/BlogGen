// src/components/theme-switcher.tsx
"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Palette } from "lucide-react"

export function ThemeSwitcher() {
  const { setTheme } = useTheme()

  const themes = [
    { name: "Chronicle", value: "theme-chronicle" },
    { name: "Typograph", value: "theme-typograph" },
    { name: "InkDrop (Dark)", value: "theme-inkdrop" },
    { name: "Writerly", value: "theme-writerly" },
    { name: "Blogify", value: "theme-blogify" },
    { name: "Buzzline", value: "theme-buzzline" },
    { name: "DailyPost", value: "theme-dailypost" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((theme) => (
            <DropdownMenuItem key={theme.value} onClick={() => setTheme(theme.value)}>
                {theme.name}
            </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
