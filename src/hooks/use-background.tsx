// src/hooks/use-background.tsx
"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface BackgroundContextType {
  background: string;
  setBackground: (background: string) => void;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [background, setBackgroundState] = useState('default');
  const [enabled, setEnabledState] = useState(true);

  useEffect(() => {
    const storedBackground = localStorage.getItem('background-slug');
    const storedEnabled = localStorage.getItem('background-enabled');
    if (storedBackground) {
      setBackgroundState(storedBackground);
    }
    if (storedEnabled) {
      setEnabledState(JSON.parse(storedEnabled));
    }
  }, []);

  const setBackground = (slug: string) => {
    localStorage.setItem('background-slug', slug);
    setBackgroundState(slug);
  };

  const setEnabled = (isEnabled: boolean) => {
    localStorage.setItem('background-enabled', JSON.stringify(isEnabled));
    setEnabledState(isEnabled);
  }

  return (
    <BackgroundContext.Provider value={{ background, setBackground, enabled, setEnabled }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
}
