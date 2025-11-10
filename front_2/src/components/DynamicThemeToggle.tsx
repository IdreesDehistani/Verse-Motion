import { Palette, PaletteIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';

export function DynamicThemeToggle() {
  const { isDynamic, toggleDynamic, dominantColors } = useDynamicTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleDynamic}
      className={`text-muted-foreground hover:text-foreground transition-all duration-300 relative overflow-hidden ${
        isDynamic ? 'bg-primary/10 text-primary' : ''
      }`}
      title={isDynamic ? 'Disable dynamic theme' : 'Enable dynamic theme'}
    >
      {isDynamic ? (
        <>
          <PaletteIcon className="h-5 w-5 animate-pulse-gentle" />
          {dominantColors.length > 0 && (
            <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-primary/20 to-accent/20 animate-gradient-shift" />
          )}
        </>
      ) : (
        <Palette className="h-5 w-5" />
      )}
    </Button>
  );
}