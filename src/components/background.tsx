// src/components/background.tsx
'use client';

import { useBackground } from "@/hooks/use-background";
import { backgrounds } from "./background-switcher";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Background() {
  const { background, enabled } = useBackground();
  const { theme } = useTheme();
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const currentBg = backgrounds.find(b => b.slug === background);
    if (enabled && currentBg && currentBg.url) {
        setImageUrl(currentBg.url);
    } else {
        setImageUrl('');
    }
  }, [background, enabled]);
  
  // Determine if the current theme is dark
  const isDarkTheme = theme ? ['theme-inkdrop'].includes(theme) : false;
  
  // Render the background only if an image URL is set
  if (!imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 w-full h-full z-[-1] transition-opacity duration-500"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.8
      }}
    >
      {/* Apply a dark overlay only on dark themes */}
      {isDarkTheme && (
        <div className="absolute inset-0 w-full h-full bg-black/50"></div>
      )}
    </div>
  );
}
