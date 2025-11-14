import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface AudioPlayerProps {
  audioUrl?: string;
  onTimeUpdate: (currentTime: number) => void;
  onPlayStateChange: (isPlaying: boolean) => void;
  onAudioElementChange?: (audio: HTMLAudioElement | null) => void;
}

export function AudioPlayer({
  audioUrl,
  onTimeUpdate,
  onPlayStateChange,
  onAudioElementChange
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  // Notify parent of audio reference
  useEffect(() => {
    onAudioElementChange?.(audioRef.current);
  }, []);

  // Load new audio source
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    audio.src = audioUrl;
    audio.load();

    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
    };

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
      onTimeUpdate(audio.currentTime);
    };

    audio.onended = () => {
      setIsPlaying(false);
      onPlayStateChange(false);
    };

    return () => {
      audio.onloadedmetadata = null;
      audio.ontimeupdate = null;
      audio.onended = null;
    };
  }, [audioUrl]);

  // Keep volume synced
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Toggle play/pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
      onPlayStateChange(true);
    } else {
      audio.pause();
      setIsPlaying(false);
      onPlayStateChange(false);
    }
  };

  // Seek bar drag
  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = value[0];
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    onTimeUpdate(newTime);
  };

  // Volume slider
  const handleVolume = (value: number[]) => {
    const v = value[0];
    setVolume(v);
    if (v > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const skip = (sec: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.max(0, Math.min(audio.currentTime + sec, audio.duration || duration));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    onTimeUpdate(newTime);
  };

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-gradient-player backdrop-blur-xl border-t border-border/50 p-4 shadow-player">
      <audio ref={audioRef} preload="metadata" />

      <div className="max-w-6xl mx-auto">
        {/* Timeline */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            max={duration}
            step={0.1}
            onValueChange={handleSeek}
            className="w-full cursor-pointer"
            disabled={!audioUrl}
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => skip(-10)} disabled={!audioUrl}>
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              disabled={!audioUrl}
              className="bg-primary text-primary-foreground w-12 h-12 rounded-full shadow-glow"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
            </Button>

            <Button variant="ghost" size="icon" onClick={() => skip(10)} disabled={!audioUrl}>
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          {/* Volume */}
          <div className="flex items-center space-x-2 w-32">
            <Button variant="ghost" size="icon" onClick={toggleMute}>
              {isMuted || volume === 0 ? <VolumeX /> : <Volume2 />}
            </Button>

            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolume}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
