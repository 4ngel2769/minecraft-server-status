'use client';

import { useState, useEffect } from 'react';
import { useCustomTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Palette, Check, Sun, Moon } from 'lucide-react';

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="relative">
        <Palette className="h-5 w-5" />
      </Button>
    );
  }

  return <ThemeSwitcherContent />;
}

function ThemeSwitcherContent() {
  const { theme, setTheme, availableThemes } = useCustomTheme();
  const [open, setOpen] = useState(false);

  // Group themes by name
  const themeGroups = availableThemes.reduce((acc, t) => {
    if (!acc[t.name]) {
      acc[t.name] = [];
    }
    acc[t.name].push(t);
    return acc;
  }, {} as Record<string, typeof availableThemes>);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Palette className="h-5 w-5" />
          <span className="sr-only">Change theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Choose Theme
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {Object.entries(themeGroups).map(([name, themes]) => (
          <div key={name} className="space-y-1">
            <div className="px-2 py-1.5">
              <p className="text-xs font-semibold text-muted-foreground">{name}</p>
            </div>
            {themes.map((t) => (
              <DropdownMenuItem
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setOpen(false);
                }}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {t.variant === 'dark' ? (
                    <Moon className="h-4 h-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                  <span className="capitalize">{t.variant}</span>
                </div>
                {theme.id === t.id && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
