import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

interface ThemeToggleProps {
  className?: string;
}

/** Sun/moon button that switches the site between light and dark mode. */
const ThemeToggle = ({ className = '' }: ThemeToggleProps) => {
  const { resolvedTheme, setTheme } = useTheme();
  // Avoid a wrong icon on first paint: the theme is only known after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={label}
      title={label}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`touch-manipulation p-2 transition-[color,background-color,transform] duration-150 ease-out motion-safe:hover:scale-105 motion-safe:active:scale-95 ${className}`}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  );
};

export default ThemeToggle;
