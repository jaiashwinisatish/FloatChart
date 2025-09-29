"use client";

import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme();

  const handleToggle = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleToggle}
      className="relative overflow-hidden transition-all duration-300 hover:scale-105"
    >
      <div className="relative flex items-center">
        {actualTheme === 'dark' ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
        <span className="ml-2 hidden sm:inline">
          {actualTheme === 'dark' ? 'Dark' : 'Light'}
        </span>
      </div>
    </Button>
  );
}
