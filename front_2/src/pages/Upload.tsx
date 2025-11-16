import { useState, useEffect } from 'react';
import { LyricDisplay } from '@/components/LyricDisplay';
import { AudioPlayer } from '@/components/AudioPlayer';
import { SongInfo } from '@/components/SongInfo';
import { SongUploader } from '@/components/SongUploader';
import { BeatReactiveBackground } from '@/components/BeatReactiveBackground';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LyricCustomizer } from '@/components/LyricCustomizer';
import { TextPressure } from '@/components/TextPressure';
import { GuidedHints } from '@/components/GuidedHints';
import { DynamicThemeProvider, useDynamicTheme } from '@/components/DynamicThemeProvider';
import { DynamicThemeToggle } from '@/components/DynamicThemeToggle';
import { useNavigate } from 'react-router-dom';
import { BackgroundVisuals } from '@/components/BackgroundVisuals';

interface SongData {
  audioUrl: string;
  lyrics: any[];
  songInfo: {
    title: string;
    artist: string;
    album?: string;
    albumCover?: string;
    language?: string;
    duration?: number;
  };
}

const UploadContent = () => {
  const navigate = useNavigate();

  // Access local dynamic theme data (colors are only stored, not applied globally)
  const { dominantColors, isDynamic, setAlbumCover } = useDynamicTheme();

  const [songData, setSongData] = useState<SongData | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const [lyricSettings, setLyricSettings] = useState({
    fontSize: 100,
    fontFamily: 'Space Grotesk',
    textColor: 'hsl(var(--foreground))',
    glowIntensity: 30,
    highlightColor: 'hsl(var(--lyric-highlight))',
    lineSpacing: 1.5,
    letterSpacing: 0,
    textShadow: 0,
    animationSpeed: 1,
    blurEffect: 0,
  });

  const handleLyricSettingsChange = (newSettings: any) => {
    setLyricSettings(prev => ({ ...prev, ...newSettings }));
  };

  // When FastAPI returns audio + lyrics
  const handleSongLoad = (audioUrl: string, lyrics: any[], songInfo: any) => {
    setSongData({ audioUrl, lyrics, songInfo });
  };

  // When album cover changes → extract colors (LOCAL ONLY)
  useEffect(() => {
    if (songData?.songInfo?.albumCover) {
      setAlbumCover(songData.songInfo.albumCover);
    }
  }, [songData?.songInfo?.albumCover, setAlbumCover]);

  // Album cover change function (no global styles)
  const handleAlbumCoverChange = (newCover: string) => {
    if (!songData) return;

    const updatedSong = {
      ...songData,
      songInfo: { ...songData.songInfo, albumCover: newCover },
    };

    setSongData(updatedSong);

    // Send cover to dynamic theme provider so it extracts colors
    setAlbumCover(newCover);
  };

  const handleSongInfoChange = (field: 'title' | 'artist' | 'album', value: string) => {
    if (songData) {
      setSongData({
        ...songData,
        songInfo: { ...songData.songInfo, [field]: value },
      });
    }
  };

  const handleTimeUpdate = (sec: number) => setCurrentTime(sec);
  const handlePlayStateChange = (p: boolean) => setIsPlaying(p);
  const handleAudioElementChange = (el: HTMLAudioElement | null) => setAudioElement(el);

  // Build local theme variables to apply ONLY inside this page
  const localThemeVars = isDynamic
    ? {
        '--primary': dominantColors[0],
        '--accent': dominantColors[1],
        '--secondary': dominantColors[2],
        '--gradient-background': `linear-gradient(135deg,
          hsl(${dominantColors[0]}),
          hsl(${dominantColors[1]}),
          hsl(${dominantColors[2]})
        )`,
      }
    : {};

  return (
    <div
      className="min-h-screen font-sans relative overflow-hidden"
      /* Local theme applied here, NOT global */
      style={localThemeVars as React.CSSProperties}
    >
      {/* ONLY this page uses local theme */}
      <BackgroundVisuals
        isPlaying={isPlaying}
        currentTime={currentTime}
        useDynamic={isDynamic}
      />

      <BeatReactiveBackground
        isPlaying={isPlaying}
        audioElement={audioElement}
      />

      {/* Header */}
      <header className="relative z-10 p-4 flex justify-between items-center">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-300 group"
        >
          <div className="w-8 h-8 bg-gradient-primary rounded-lg shadow-glow group-hover:scale-105 transition-all duration-300" />
          <div className="font-display font-extrabold group-hover:text-primary transition-colors duration-300">
            {"VerseMotion".split('').map((char, index) => (
              <TextPressure
                key={index}
                text={char}
                flex
                weight
                width
                italic={false}
                alpha={false}
                stroke={false}
                textColor="hsl(var(--foreground))"
                minFontSize={18}
                maxFontSize={26}
                className="inline-block"
                neighborEffect
                neighborStrength={0.8}
              />
            ))}
          </div>
        </button>

        <div className="flex items-center space-x-2">
          <DynamicThemeToggle />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col min-h-[calc(100vh-80px)]">
        {songData ? (
          <>
            {/* Song Info */}
            <div className="p-6 flex justify-center">
              <SongInfo
                {...songData.songInfo}
                onAlbumCoverChange={handleAlbumCoverChange}
                onSongInfoChange={handleSongInfoChange}
              />
            </div>

            <LyricCustomizer
              settings={lyricSettings}
              onSettingsChange={handleLyricSettingsChange}
            />

            <LyricDisplay
              lyrics={songData.lyrics}
              currentTime={currentTime}
              isPlaying={isPlaying}
              settings={lyricSettings}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <SongUploader onSongLoad={handleSongLoad} />
          </div>
        )}

        {/* Audio Player */}
        <div className="mt-auto">
          <AudioPlayer
            audioUrl={songData?.audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onPlayStateChange={handlePlayStateChange}
            onAudioElementChange={handleAudioElementChange}
          />
        </div>

        <GuidedHints onComplete={() => {}} currentPage="upload" />
      </main>
    </div>
  );
};

const Upload = () => (
  <DynamicThemeProvider>
    <UploadContent />
  </DynamicThemeProvider>
);

export default Upload;
