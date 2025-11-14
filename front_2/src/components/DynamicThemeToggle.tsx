import { Palette, PaletteIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useMemo } from 'react';

export function DynamicThemeToggle() {
  const { isDynamic, toggleDynamic, dominantColors } = useDynamicTheme();

  // Safely compute preview gradient only when dominant colors change
  const previewGradient = useMemo(() => {
    if (!dominantColors || dominantColors.length < 2) return null;

    return {
      background: `linear-gradient(135deg, ${dominantColors[0]}40, ${dominantColors[1]}40)`
    };
  }, [dominantColors]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleDynamic}
      aria-pressed={isDynamic}
      aria-label={isDynamic ? 'Disable dynamic theme' : 'Enable dynamic theme'}
      className={`
        text-muted-foreground hover:text-foreground transition-all duration-300 
        relative overflow-hidden 
        ${isDynamic ? 'bg-primary/10 text-primary shadow-inner' : ''}
      `}
    >
      {/* Icon */}
      {isDynamic ? (
        <PaletteIcon className="h-5 w-5 animate-pulse-gentle" />
      ) : (
        <Palette className="h-5 w-5" />
      )}

      {/* Gradient overlay if dynamic mode active */}
      {isDynamic && previewGradient && (
        <div
          className="absolute inset-0 opacity-25 animate-gradient-shift pointer-events-none"
          style={previewGradient}
        />
      )}
    </Button>
  );
}
