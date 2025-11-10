import { useState, useRef } from 'react';
import { Upload, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LanguageSelector } from './LanguageSelector';
import { TextPressure } from './TextPressure';
// NEW: API client + mapper
import { uploadAudioToBackend, mapToLyricDisplay } from '@/lib/api';

interface SongUploaderProps {
  onSongLoad: (audioUrl: string, lyrics: any[], songInfo: any) => void;
}

export function SongUploader({ onSongLoad }: SongUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const audioInputRef = useRef<HTMLInputElement>(null);

  // CHANGED: async + call backend, remove demo lyrics
  const handleAudioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const audioUrl = URL.createObjectURL(file);

    // Extract basic song info from filename
    const fileName = file.name.replace(/\.[^/.]+$/, "");
    const parts = fileName.split(' - ');
    const songInfo = {
      title: parts[1] || fileName,
      artist: parts[0] || 'Unknown Artist',
      album: 'Unknown Album'
    };

    try {
      // Send to FastAPI and map payload to LyricDisplay format
      const resp = await uploadAudioToBackend(file);
      const mapped = mapToLyricDisplay(resp.lines);

      onSongLoad(
        audioUrl,
        mapped,
        { ...songInfo, language: selectedLanguage, duration: resp.duration }
      );
    } catch (e) {
      console.error(e);
      alert('Transcription failed. Check backend logs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div className="max-w-md w-full">
        <LanguageSelector 
          selectedLanguage={selectedLanguage}
          onLanguageSelect={setSelectedLanguage}
        />
        
        <Card className="p-8 w-full bg-card/80 backdrop-blur-xl border-border/50 shadow-card animate-fade-in">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow">
            <Music className="h-10 w-10 text-white" />
          </div>
          
          <div>
            <div className="text-2xl font-bold mb-2">
              {"Welcome to VerseMotion".split('').map((char, index) => (
                <TextPressure
                  key={index}
                  text={char === ' ' ? '\u00A0' : char}
                  flex={true}
                  weight={true}
                  width={true}
                  italic={false}
                  alpha={false}
                  stroke={false}
                  textColor="hsl(var(--foreground))"
                  minFontSize={20}
                  maxFontSize={28}
                  className="inline-block"
                  neighborEffect={true}
                  neighborStrength={0.6}
                />
              ))}
            </div>
            <div className="text-muted-foreground">
              {"Upload your audio file and watch lyrics automatically sync with your music".split('').map((char, index) => (
                <TextPressure
                  key={index}
                  text={char === ' ' ? '\u00A0' : char}
                  flex={true}
                  weight={false}
                  width={true}
                  italic={false}
                  alpha={true}
                  stroke={false}
                  textColor="hsl(var(--muted-foreground))"
                  minFontSize={14}
                  maxFontSize={18}
                  className="inline-block"
                  neighborEffect={true}
                  neighborStrength={0.5}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => audioInputRef.current?.click()}
              disabled={isLoading}
              className="w-full bg-gradient-primary hover:opacity-90 text-white shadow-glow transition-all duration-300 hover:scale-105"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isLoading ? 'Loading...' : 'Upload Audio & Auto-Play Lyrics'}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            Supported formats: MP3, WAV, M4A, OGG
          </div>
        </div>
        </Card>

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
