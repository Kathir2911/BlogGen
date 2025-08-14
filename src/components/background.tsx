// src/components/background.tsx
'use client';

import { useBackground } from "@/hooks/use-background";
import { backgrounds } from "./background-switcher";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Background() {
  const { background, enabled } = useBackground();
  const { theme } = useTheme();
  const [imageUrl, setImageUrl] = useState('');
  const [prevImageUrl, setPrevImageUrl] = useState('');

  useEffect(() => {
    const currentBg = backgrounds.find(b => b.slug === background);
    const newUrl = (enabled && currentBg && currentBg.url) ? currentBg.url : '';
    
    if (newUrl !== imageUrl) {
        setPrevImageUrl(imageUrl);
        setImageUrl(newUrl);
    }
  }, [background, enabled, imageUrl]);
  
  const isDarkTheme = theme === 'dark';

  return (
    <>
      {prevImageUrl && (
         <div 
           key={prevImageUrl}
           className="fixed inset-0 w-full h-full z-[-1] bg-cover bg-center transition-opacity duration-1000 animate-fade-out"
           style={{
             backgroundImage: `url(${prevImageUrl})`,
           }}
         >
           {isDarkTheme && <div className="absolute inset-0 w-full h-full bg-black/50"></div>}
         </div>
      )}
      {imageUrl && (
        <div 
          key={imageUrl}
          className="fixed inset-0 w-full h-full z-[-1] bg-cover bg-center transition-opacity duration-1000 animate-fade-in"
          style={{
            backgroundImage: `url(${imageUrl})`,
          }}
        >
          {isDarkTheme && <div className="absolute inset-0 w-full h-full bg-black/50"></div>}
        </div>
      )}
    </>
  );
}
