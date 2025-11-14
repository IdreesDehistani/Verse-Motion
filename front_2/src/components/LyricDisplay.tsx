import { useState, useEffect, useMemo } from 'react';

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

interface LyricSettings {
  fontSize: number;
  fontFamily: string;
    textColor: string;
    glowIntensity: number;
    highlightColor: string;
    lineSpacing?: number;
    letterSpacing?: number;
    textShadow?: number;
    animationSpeed?: number;
    blurEffect?: number;
}

interface LyricDisplayProps {
  lyrics: LyricLine[];
  currentTime: number;
  isPlaying: boolean;
  settings: LyricSettings;
}

export function LyricDisplay({ lyrics, currentTime, settings }: LyricDisplayProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // QUICK SCAN FOR CURRENT LINE (optimized)
  useEffect(() => {
    const index = lyrics.findIndex(
      line => currentTime >= line.startTime && currentTime <= line.endTime
    );
    if (index !== -1) setCurrentLineIndex(index);
  }, [currentTime, lyrics]);

  // FIND CURRENT WORD
  useEffect(() => {
    const line = lyrics[currentLineIndex];
    if (!line?.words) return;

    const wordIndex = line.words.findIndex(
      w => currentTime >= w.startTime && currentTime <= w.endTime
    );

    if (wordIndex !== -1) setCurrentWordIndex(wordIndex);
  }, [currentTime, currentLineIndex, lyrics]);

  // EMPHASIS WORD DETECTION
  const isEmphasisWord = (text: string) => {
    const patterns = [
      /^(boom|yeah|hey|oh|ah|whoa|fire|lit|wild|epic|drop|bass)$/i,
      /!$/,
      /^(ooh|aah|mmm|ugh|shh)$/i,
      /^(go|jump|dance|move|shake|rise|fall|fly)$/i,
      /^(love|hate|amazing|perfect|insane)$/i,
    ];
    return patterns.some(p => p.test(text.trim()));
  };

  // STYLE FOR EACH WORD (lighter animations)
  const getWordStyle = (word: { text: string }, isCurrentWord: boolean, isPastWord: boolean) => {
    const emphasis = isEmphasisWord(word.text);

    const glow = isCurrentWord
      ? `${settings.glowIntensity * 0.4}px ${settings.highlightColor}`
      : emphasis && isPastWord
      ? `${settings.glowIntensity * 0.2}px ${settings.textColor}`
      : undefined;

    return {
      transform: isCurrentWord ? (emphasis ? "scale(1.25)" : "scale(1.1)") : "scale(1)",
      color: isCurrentWord ? settings.highlightColor : settings.textColor,
      fontWeight: emphasis ? 800 : undefined,
      textShadow: glow ? `0 0 ${glow}` : undefined,
      transition: "transform 0.25s ease-out, color 0.25s ease-out",
      display: "inline-block",
      marginRight: "0.3em",
    };
  };

  // LIMIT DISPLAYED LINES FOR PERFORMANCE
  const visibleLines = useMemo(() => {
    const start = Math.max(0, currentLineIndex - 2);
    const end = currentLineIndex + 3;
    return lyrics.slice(start, end);
  }, [lyrics, currentLineIndex]);

  return (
    <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
      <div
        className="max-w-4xl mx-auto text-center"
        style={{
          lineHeight: settings.lineSpacing || 1.5,
          letterSpacing: `${settings.letterSpacing || 0}px`,
          fontFamily: settings.fontFamily,
          filter: settings.blurEffect ? `blur(${settings.blurEffect}px)` : undefined,
        }}
      >
        <div className="space-y-3">
          {visibleLines.map((line, i) => {
            const index = Math.max(0, currentLineIndex - 2) + i;
            const isCurrentLine = index === currentLineIndex;
            const isPast = index < currentLineIndex;

            return (
              <div
                key={index}
                className={`
                  mb-4 transition-all duration-400
                  ${isCurrentLine ? "opacity-100 scale-105" : isPast ? "opacity-60" : "opacity-40"}
                `}
                style={{
                  fontSize: `${(isCurrentLine ? 3 : 2) * (settings.fontSize / 100)}rem`,
                }}
              >
                {line.words
                  ? line.words.map((w, wi) => {
                      const isCurrentWord = isCurrentLine && wi === currentWordIndex;
                      const isPastWord = isCurrentLine && wi < currentWordIndex;

                      return (
                        <span
                          key={wi}
                          style={getWordStyle(w, isCurrentWord, isPastWord)}
                        >
                          {w.text}
                        </span>
                      );
                    })
                  : line.text.split(" ").map((word, wi) => {
                      const emphasis = isEmphasisWord(word);
                      return (
                        <span
                          key={wi}
                          style={{
                            marginRight: "0.35em",
                            fontWeight: emphasis ? 800 : "inherit",
                          }}
                        >
                          {word}
                        </span>
                      );
                    })}
              </div>
            );
          })}
        </div>

        {lyrics.length === 0 && (
          <div
            className="text-muted-foreground opacity-50 animate-pulse-gentle"
            style={{
              fontSize: `${3 * (settings.fontSize / 100)}rem`,
              fontFamily: settings.fontFamily,
            }}
          >
            Upload your song to see lyrics
          </div>
        )}
      </div>
    </div>
  );
}
