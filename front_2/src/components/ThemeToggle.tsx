import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light' | null>(null);

  // Load theme once (no flash)
  useEffect(() => {
    const saved =
      (typeof window !== 'undefined' &&
        (localStorage.getItem('theme') as 'dark' | 'light')) ||
      'dark';

    setTheme(saved);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(saved);
  }, []);

  const toggleTheme = () => {
    if (!theme) return;

    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);

    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(newTheme);

    localStorage.setItem('theme', newTheme);
  };

  // Hide button until initial theme is loaded (prevents flicker)
  if (theme === null) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="text-muted-foreground hover:text-foreground transition-colors duration-300"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
