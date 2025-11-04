'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTheme as useNextTheme } from 'next-themes';
import { Theme, themes, getTheme } from '@/lib/themes';

interface ThemeContextType {
  theme: Theme;
  setTheme: (themeId: string) => void;
  availableThemes: Theme[];
}

const CustomThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  const { setTheme: setNextTheme } = useNextTheme();
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[8]); // default-dark
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load theme from localStorage
    const savedThemeId = localStorage.getItem('custom-theme-preference');
    if (savedThemeId) {
      const theme = getTheme(savedThemeId);
      if (theme) {
        setCurrentTheme(theme);
        applyTheme(theme);
      }
    }
  }, []);

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    
    // Apply CSS variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--${cssKey}`, value);
    });

    // Apply font if specified (Minecraft theme)
    if (theme.font) {
      root.classList.add('font-minecraft');
    } else {
      root.classList.remove('font-minecraft');
    }

    // Sync with next-themes
    setNextTheme(theme.variant);

    // Store theme gradient for background components
    if (theme.gradients?.background) {
      root.style.setProperty('--theme-gradient', theme.gradients.background);
    }
  };

  const handleSetTheme = (themeId: string) => {
    const theme = getTheme(themeId);
    if (theme) {
      setCurrentTheme(theme);
      applyTheme(theme);
      localStorage.setItem('custom-theme-preference', themeId);
    }
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <CustomThemeContext.Provider
      value={{
        theme: currentTheme,
        setTheme: handleSetTheme,
        availableThemes: themes,
      }}
    >
      {children}
    </CustomThemeContext.Provider>
  );
}

export function useCustomTheme() {
  const context = useContext(CustomThemeContext);
  if (!context) {
    throw new Error('useCustomTheme must be used within a CustomThemeProvider');
  }
  return context;
}
