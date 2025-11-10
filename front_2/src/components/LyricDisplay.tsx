import { useState, useEffect } from 'react';

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

export function LyricDisplay({ lyrics, currentTime, isPlaying, settings }: LyricDisplayProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const currentLine = lyrics.find((line, index) => {
      return currentTime >= line.startTime && currentTime <= line.endTime;
    });

    if (currentLine) {
      const lineIndex = lyrics.indexOf(currentLine);
      setCurrentLineIndex(lineIndex);

      // Word-by-word highlighting
      if (currentLine.words) {
        const currentWord = currentLine.words.find(word => 
          currentTime >= word.startTime && currentTime <= word.endTime
        );
        if (currentWord) {
          setCurrentWordIndex(currentLine.words.indexOf(currentWord));
        }
      }
    }
  }, [currentTime, lyrics]);

  // Enhanced word emphasis detection
  const isEmphasisWord = (text: string) => {
    const emphasisPatterns = [
      /^(boom|wow|yeah|hey|oh|ah|whoa|bang|pow|crash|slam|fire|lit|wild|crazy|sick|epic|blast|drop|beat|bass|drop|hit)$/i,
      /^.*(!)$/, // Words ending with exclamation
      /^(ooh|aah|mmm|hmm|ugh|shh|psst)$/i, // Vocal expressions
      /^(go|up|down|jump|dance|move|shake|drop|rise|fall|fly|run|break|smash)$/i, // Action words
      /^(love|hate|amazing|incredible|fantastic|awesome|terrible|beautiful|perfect|insane)$/i // Emotional words
    ];
    return emphasisPatterns.some(pattern => pattern.test(text.trim()));
  };

  const getWordStyle = (word: { text: string }, isCurrentWord: boolean, isPastWord: boolean) => {
    const isEmphasis = isEmphasisWord(word.text);
    const baseScale = isEmphasis ? 1.2 : 1;
    const currentScale = isCurrentWord ? (isEmphasis ? 1.5 : 1.1) : baseScale;
    
    return {
      transform: `scale(${currentScale})`,
      textShadow: isCurrentWord 
        ? `0 0 ${settings.glowIntensity * 0.3}px ${settings.highlightColor}, 0 0 ${settings.glowIntensity * 0.6}px ${settings.highlightColor}${isEmphasis ? `, 0 0 ${settings.glowIntensity}px ${settings.highlightColor}` : ''}`
        : isEmphasis && isPastWord 
        ? `0 0 ${settings.glowIntensity * 0.2}px ${settings.textColor}`
        : undefined,
      color: isCurrentWord ? settings.highlightColor : settings.textColor,
      fontWeight: isEmphasis ? '900' : undefined,
      display: 'inline-block',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      marginRight: '0.25em'
    };
  };

  const renderLine = (line: LyricLine, lineIndex: number) => {
    const isCurrentLine = lineIndex === currentLineIndex;
    const isPastLine = lineIndex < currentLineIndex;
    const isFutureLine = lineIndex > currentLineIndex;

    if (line.words) {
      return (
        <div
          key={lineIndex}
          className={`text-center mb-6 transition-all duration-500 ${
            isCurrentLine 
              ? 'opacity-100 scale-105' 
              : isPastLine
              ? 'opacity-60'
              : 'opacity-40'
          }`}
          style={{
            fontSize: `${(isCurrentLine ? 3.5 : 2) * (settings.fontSize / 100)}rem`,
            fontFamily: settings.fontFamily,
            fontWeight: isCurrentLine ? 'bold' : 'normal'
          }}
        >
          {line.words.map((word, wordIndex) => {
            const isCurrentWord = isCurrentLine && wordIndex === currentWordIndex;
            const isPastWord = isCurrentLine && wordIndex < currentWordIndex;
            const isEmphasis = isEmphasisWord(word.text);
            
            return (
              <span
                key={wordIndex}
                className={`${isCurrentWord && isEmphasis ? 'animate-bounce-gentle' : ''} inline-block mr-2`}
                style={getWordStyle(word, isCurrentWord, isPastWord)}
              >
                {word.text}
              </span>
            );
          })}
        </div>
      );
    }

    const lineText = line.text;
    const hasEmphasisWords = lineText.split(' ').some(word => isEmphasisWord(word));

    return (
      <div
        key={lineIndex}
        className={`text-center mb-6 transition-all duration-500 ${
          isCurrentLine 
            ? 'opacity-100 scale-105' 
            : isPastLine
            ? 'opacity-60'
            : 'opacity-40'
        } ${isCurrentLine && hasEmphasisWords ? 'animate-lyric-glow' : ''}`}
        style={{
          fontSize: `${(isCurrentLine ? 3.5 : 2) * (settings.fontSize / 100)}rem`,
          fontFamily: settings.fontFamily,
          fontWeight: isCurrentLine ? 'bold' : 'normal',
          color: isCurrentLine ? settings.highlightColor : settings.textColor,
          textShadow: isCurrentLine 
            ? `0 0 ${settings.glowIntensity * 0.3}px ${settings.highlightColor}, 0 0 ${settings.glowIntensity * 0.6}px ${settings.highlightColor}${hasEmphasisWords ? `, 0 0 ${settings.glowIntensity}px ${settings.highlightColor}` : ''}`
            : undefined
        }}
      >
        {lineText.split(' ').map((word, wordIndex) => {
          const isEmphasis = isEmphasisWord(word);
          return (
            <span
              key={wordIndex}
              className={`${isCurrentLine && isEmphasis ? 'animate-bounce-gentle' : ''} inline-block`}
              style={{
                marginRight: '0.5em',
                fontFamily: settings.fontFamily,
                transform: isCurrentLine && isEmphasis ? 'scale(1.2)' : 'scale(1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontWeight: isEmphasis ? 900 : 'inherit'
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
      <div 
        className="max-w-4xl mx-auto"
        style={{
          lineHeight: settings.lineSpacing || 1.5,
          letterSpacing: `${settings.letterSpacing || 0}px`,
          textShadow: settings.textShadow ? `0 0 ${settings.textShadow}px ${settings.textColor}40` : undefined,
          filter: settings.blurEffect ? `blur(${settings.blurEffect}px)` : undefined,
          animationDuration: `${(settings.animationSpeed || 1) * 1000}ms`
        }}
      >
        <div className="space-y-2">
          {lyrics.slice(Math.max(0, currentLineIndex - 2), currentLineIndex + 3).map((line, index) => {
            const actualIndex = Math.max(0, currentLineIndex - 2) + index;
            return renderLine(line, actualIndex);
          })}
        </div>
        
        {lyrics.length === 0 && (
          <div className="text-center">
            <div 
              className="font-bold text-muted-foreground opacity-50 animate-pulse-gentle"
              style={{
                fontSize: `${3 * (settings.fontSize / 100)}rem`,
                fontFamily: settings.fontFamily
              }}
            >
              Upload your song to see lyrics
            </div>
          </div>
        )}
      </div>
    </div>
  );
}