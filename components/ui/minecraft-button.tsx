'use client';

import { ButtonHTMLAttributes, forwardRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useCustomTheme } from '@/contexts/ThemeContext';

export interface MinecraftButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive';
}

export const MinecraftButton = forwardRef<HTMLButtonElement, MinecraftButtonProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
      setMounted(true);
    }, []);

    // Default button for server-side rendering
    if (!mounted) {
      return (
        <button
          ref={ref}
          className={cn(
            'px-4 py-2 rounded-md font-medium transition-colors',
            'bg-primary text-primary-foreground hover:bg-primary/90',
            variant === 'destructive' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            className
          )}
          {...props}
        >
          {children}
        </button>
      );
    }

    return <MinecraftButtonContent ref={ref} className={className} variant={variant} {...props}>{children}</MinecraftButtonContent>;
  }
);

MinecraftButton.displayName = 'MinecraftButton';

const MinecraftButtonContent = forwardRef<HTMLButtonElement, MinecraftButtonProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const { theme } = useCustomTheme();
    const isMinecraftTheme = theme.id.startsWith('minecraft');

    if (!isMinecraftTheme) {
      // Fall back to regular button styling
      return (
        <button
          ref={ref}
          className={cn(
            'px-4 py-2 rounded-md font-medium transition-colors',
            'bg-primary text-primary-foreground hover:bg-primary/90',
            variant === 'destructive' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            className
          )}
          {...props}
        >
          {children}
        </button>
      );
    }

    // Minecraft button styling
    return (
      <button
        ref={ref}
        className={cn(
          'relative px-6 py-3 font-minecraft text-white font-bold tracking-wide',
          'transition-all duration-100',
          'bg-gradient-to-b',
          variant === 'default' && [
            'from-[#55ff55] to-[#00aa00]',
            'shadow-[inset_0_2px_0_0_rgba(255,255,255,0.4),inset_0_-2px_0_0_rgba(0,0,0,0.4)]',
            'border-2 border-[#00aa00]',
            'hover:from-[#7fff7f] hover:to-[#00cc00]',
            'active:from-[#00aa00] active:to-[#008800]',
          ],
          variant === 'destructive' && [
            'from-[#ff5555] to-[#aa0000]',
            'shadow-[inset_0_2px_0_0_rgba(255,255,255,0.4),inset_0_-2px_0_0_rgba(0,0,0,0.4)]',
            'border-2 border-[#aa0000]',
            'hover:from-[#ff7f7f] hover:to-[#cc0000]',
            'active:from-[#aa0000] active:to-[#880000]',
          ],
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      >
        <span className="relative z-10 drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]">
          {children}
        </span>
      </button>
    );
  }
);

MinecraftButtonContent.displayName = 'MinecraftButtonContent';
