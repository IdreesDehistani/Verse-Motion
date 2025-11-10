import { useState, useEffect } from 'react';
import { LyricDisplay } from '@/components/LyricDisplay';
import { AudioPlayer } from '@/components/AudioPlayer';
import { SongInfo } from '@/components/SongInfo';
import { SongUploader } from '@/components/SongUploader';
import { BeatReactiveBackground } from '@/components/BeatReactiveBackground';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LyricCustomizer } from '@/components/LyricCustomizer';
import { TextPressure } from '@/components/TextPressure';
//import { ProgressiveIndicator } from '@/components/ProgressiveIndicator';
import { GuidedHints } from '@/components/GuidedHints';
import { DynamicThemeProvider, useDynamicTheme } from '@/components/DynamicThemeProvider';
import { DynamicThemeToggle } from '@/components/DynamicThemeToggle';
import { useNavigate } from 'react-router-dom';
import ColorThief from 'color-thief-browser';
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
    duration?: number; // NEW: provided by backend
  };
}

const UploadContent = () => {
  const navigate = useNavigate();
  const { setAlbumCover } = useDynamicTheme();
  const [songData, setSongData] = useState<SongData | null>(null);
  const [highlightMode, setHighlightMode] = useState<'word' | 'line'>('word');
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
    blurEffect: 0
  });

  const handleLyricSettingsChange = (newSettings: any) => {
    setLyricSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  const handleSongLoad = (audioUrl: string, lyrics: any[], songInfo: any) => {
    setSongData({ audioUrl, lyrics, songInfo });
  };

  // Update dynamic theme when album cover changes
  useEffect(() => {
    if (songData?.songInfo?.albumCover) {
      setAlbumCover(songData.songInfo.albumCover);
    }
  }, [songData?.songInfo?.albumCover, setAlbumCover]);

  const [useDynamicBackground, setUseDynamicBackground] = useState(true);

const handleAlbumCoverChange = (newCover: string) => {
  if (!songData) return;

  const updatedSong = {
    ...songData,
    songInfo: { ...songData.songInfo, albumCover: newCover },
  };
  setSongData(updatedSong);
  setAlbumCover(newCover);

  // Only proceed if it's an actual uploaded image
  if (!newCover.startsWith('data:image')) return;

  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = newCover;

  img.onload = () => {
    const colorThief = new ColorThief();
    const palette = colorThief.getPalette(img, 4);
    if (!palette) return;

    const [c1, c2, c3] = palette;
    const gradient = `linear-gradient(135deg, rgb(${c1.join(',')}), rgb(${c2.join(',')}), rgb(${c3.join(',')}))`;
    document.documentElement.style.setProperty('--background-gradient', gradient);

    const avgBrightness = (c1[0] + c1[1] + c1[2]) / 3;
    const newTextColor = avgBrightness > 130 ? 'hsl(0 0% 15%)' : 'hsl(0 0% 90%)';
    document.documentElement.style.setProperty('--foreground', newTextColor);

    const newFont = avgBrightness > 130 ? 'Poppins' : 'Playfair Display';
    setLyricSettings(prev => ({ ...prev, fontFamily: newFont }));
  };
};


  const handleSongInfoChange = (field: 'title' | 'artist' | 'album', value: string) => {
    if (songData) {
      setSongData({
        ...songData,
        songInfo: { ...songData.songInfo, [field]: value }
      });
    }
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handlePlayStateChange = (playing: boolean) => {
    setIsPlaying(playing);
  };

  const handleAudioElementChange = (element: HTMLAudioElement | null) => {
    setAudioElement(element);
  };

  return (
    <div className="min-h-screen bg-gradient-background font-sans">
      <BackgroundVisuals
        isPlaying={isPlaying}
        currentTime={currentTime}
        useDynamic={useDynamicBackground}
      />
      <BeatReactiveBackground
        isPlaying={isPlaying} 
        currentTime={currentTime} 
        audioElement={audioElement}
      />
      
      {/* Header */}
      <header className="relative z-10 p-4 flex justify-between items-center">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-300 group"
        >
          <div className="w-8 h-8 bg-gradient-primary rounded-lg shadow-glow group-hover:shadow-lg group-hover:scale-105 transition-all duration-300" />
          <div className="font-display font-extrabold group-hover:text-primary transition-colors duration-300">
            {"VerseMotion".split('').map((char, index) => (
              <TextPressure
                key={index}
                text={char}
                flex={true}
                weight={true}
                width={true}
                italic={false}
                alpha={false}
                stroke={false}
                textColor="hsl(var(--foreground))"
                minFontSize={18}
                maxFontSize={26}
                className="inline-block"
                neighborEffect={true}
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

            {/* Lyric Customizer */}
            <LyricCustomizer 
              settings={lyricSettings}
              onSettingsChange={handleLyricSettingsChange}
            />

            {/* Lyrics Display */}
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
            duration={songData?.songInfo?.duration ?? 0}
            onTimeUpdate={handleTimeUpdate}
            onPlayStateChange={handlePlayStateChange}
            onAudioElementChange={handleAudioElementChange}
          />
        </div>

        {/* Guided Hints */}
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