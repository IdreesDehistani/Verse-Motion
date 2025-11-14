import { useState, useRef } from 'react';
import { Upload, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LanguageSelector } from './LanguageSelector';
import { TextPressure } from './TextPressure';

// API functions – MUST EXIST in /src/lib/api.ts
import { uploadAudioToBackend, mapToLyricDisplay } from '@/lib/api';

interface SongUploaderProps {
  onSongLoad: (audioUrl: string, lyrics: any[], songInfo: any) => void;
}

export function SongUploader({ onSongLoad }: SongUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const audioInputRef = useRef<HTMLInputElement>(null);

  // ================================================================
  // HANDLE AUDIO UPLOAD
  // ================================================================
  const handleAudioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // -----------------------------------------
    // VALIDATE AUDIO FORMAT
    // -----------------------------------------
    const allowed = [
      'audio/mpeg',
      'audio/wav',
      'audio/x-wav',
      'audio/mp4',
      'audio/m4a',
      'audio/ogg'
    ];

    if (!allowed.includes(file.type)) {
      alert('Unsupported audio format.');
      return;
    }

    setIsLoading(true);

    // URL used for playback inside AudioPlayer
    const audioUrl = URL.createObjectURL(file);

    // -----------------------------------------
    // BASIC SONG INFO PARSED FROM FILE NAME
    // e.g. "Artist - Title.mp3"
    // -----------------------------------------
    const fileName = file.name.replace(/\.[^/.]+$/, '');
    const parts = fileName.split(' - ');

    const songInfo = {
      title: parts[1] || fileName,
      artist: parts[0] || 'Unknown Artist',
      album: 'Unknown Album',
    };

    try {
      // -----------------------------------------
      // BACKEND CALL (FastAPI Whisper)
      // -----------------------------------------
      const resp = await uploadAudioToBackend(file);

      // Backend must return: { lines: [...], duration: x }
      if (!resp || !resp.lines) {
        alert('Backend returned unexpected data.');
        return;
      }

      // -----------------------------------------
      // MAP BACKEND FORMAT → LyricDisplay format
      // -----------------------------------------
      const mapped = mapToLyricDisplay(resp.lines);

      onSongLoad(
        audioUrl,
        mapped,
        { 
          ...songInfo, 
          language: selectedLanguage, 
          duration: resp.duration 
        }
      );
    } catch (e) {
      console.error(e);
      alert('Transcription failed. Check backend logs.');
    } finally {
      setIsLoading(false);
    }
  };

  // ===================================================================
  // COMPONENT UI
  // ===================================================================
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div className="max-w-md w-full">

        {/* LANGUAGE SELECTOR */}
        <LanguageSelector 
          selectedLanguage={selectedLanguage}
          onLanguageSelect={setSelectedLanguage}
        />

        {/* CARD WRAPPER – disabled during loading */}
        <Card
          className={`p-8 w-full bg-card/80 backdrop-blur-xl border-border/50 shadow-card animate-fade-in 
            ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
        >
          <div className="text-center space-y-6">
            
            {/* ICON */}
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow">
              <Music className="h-10 w-10 text-white" />
            </div>

            {/* TITLE (TextPressure is OK for short titles) */}
            <div className="text-2xl font-bold mb-2">
              {"Welcome to VerseMotion".split('').map((char, index) => (
                <TextPressure
                  key={index}
                  text={char === ' ' ? '\u00A0' : char}
                  flex
                  weight
                  width
                  italic={false}
                  alpha={false}
                  stroke={false}
                  textColor="hsl(var(--foreground))"
                  minFontSize={20}
                  maxFontSize={28}
                  className="inline-block"
                  neighborEffect
                  neighborStrength={0.6}
                />
              ))}
            </div>

            {/* DESCRIPTION (smooth, no TextPressure → much cleaner & readable) */}
            <p className="text-muted-foreground text-base md:text-lg tracking-wide antialiased">
              Upload your audio file and watch lyrics automatically sync with your music.
            </p>

            {/* BUTTON */}
            <Button
              onClick={() => audioInputRef.current?.click()}
              disabled={isLoading}
              className="w-full bg-gradient-primary hover:opacity-90 text-white shadow-glow transition-all duration-300 hover:scale-105"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isLoading ? 'Loading...' : 'Upload Audio & Auto-Play Lyrics'}
            </Button>

            {/* SUPPORTED FORMATS */}
            <div className="text-xs text-muted-foreground">
              Supported formats: MP3, WAV, M4A, OGG
            </div>

          </div>
        </Card>

        {/* HIDDEN FILE INPUT */}
        <input
          ref={audioInputRef}
          type="file"
          accept="audio/*"
          onChange={handleAudioUpload}
          className="hidden"
        />

      </div>
    </div>
  );
}
