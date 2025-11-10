/*import { useState } from 'react';
import { Eye, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LyricLine {
  text: string;
  startTime: number;
  endTime: number;
  words?: {
    text: string;
    startTime: number;
    endTime: number;
  }[];
}

interface ProgressiveIndicatorProps {
  lyrics: LyricLine[];
  currentTime: number;
  isPlaying: boolean;
  onHighlightModeChange?: (mode: 'word' | 'line') => void;
}

export function ProgressiveIndicator({ 
  lyrics, 
  currentTime, 
  isPlaying,
  onHighlightModeChange 
}: ProgressiveIndicatorProps) {
  const [highlightMode, setHighlightMode] = useState<'word' | 'line'>('word');

  if (!lyrics.length) return null;

  // Calculate progress
  const totalDuration = lyrics[lyrics.length - 1]?.endTime || 0;
  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  // Find current line
  const currentLine = lyrics.find(line => 
    currentTime >= line.startTime && currentTime <= line.endTime
  );

  const currentLineIndex = currentLine ? lyrics.indexOf(currentLine) : 0;

  // Calculate word progress within current line
  let wordProgress = 0;
  if (currentLine?.words) {
    const currentWord = currentLine.words.find(word => 
      currentTime >= word.startTime && currentTime <= word.endTime
    );
    if (currentWord) {
      const wordIndex = currentLine.words.indexOf(currentWord);
      wordProgress = (wordIndex / currentLine.words.length) * 100;
    }
  }

  const handleModeToggle = () => {
    const newMode = highlightMode === 'word' ? 'line' : 'word';
    setHighlightMode(newMode);
    onHighlightModeChange?.(newMode);
  };

  return (
    <div className="w-full px-6 py-4 bg-card/40 backdrop-blur-md border-t border-border/40">
      {/* Mode Toggle */} 
      /*
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Highlighting:</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleModeToggle}
            className="h-6 px-2 text-xs bg-muted/50 hover:bg-muted transition-all duration-300 group"
          >
            {highlightMode === 'word' ? (
              <>
                <Eye className="h-3 w-3 mr-1 group-hover:scale-110 transition-transform duration-300" />
                Word
              </>
            ) : (
              <>
                <List className="h-3 w-3 mr-1 group-hover:scale-110 transition-transform duration-300" />
                Line
              </>
            )}
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          {currentLineIndex + 1} of {lyrics.length}
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative">
        {/* Main Progress Bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out relative"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          >
            {/* Animated Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-slide-shine" />
          </div>
        </div>

        {/* Word Progress Overlay (only show if in word mode and has word data) */}
        {highlightMode === 'word' && currentLine?.words && (
          <div className="absolute top-0 left-0 w-full h-2">
            <div className="relative w-full h-full">
              {/* Current line segment */}
              <div
                className="absolute h-full bg-accent/60 rounded-full"
                style={{
                  left: `${(currentLineIndex / lyrics.length) * 100}%`,
                  width: `${100 / lyrics.length}%`
                }}
              >
                {/* Word progress within current line */}
                <div
                  className="h-full bg-accent rounded-full transition-all duration-150 ease-out"
                  style={{ width: `${wordProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Beat Pulse Indicator */}
        {isPlaying && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg animate-pulse-beat"
            style={{
              left: `calc(${Math.max(0, Math.min(100, progress))}% - 6px)`,
              boxShadow: '0 0 8px hsl(var(--primary)), 0 0 16px hsl(var(--primary)/0.5)'
            }}
          />
        )}
      </div>

      {/* Current Line Preview */}
      {currentLine && (
        <div className="mt-3 text-center">
          <div className="text-xs text-muted-foreground truncate max-w-full">
            {currentLine.text}
          </div>
        </div>
      )}
    </div>
  );
}