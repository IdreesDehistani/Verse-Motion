import { useEffect, useState, useRef } from 'react';

interface BeatReactiveBackgroundProps {
  isPlaying: boolean;
  currentTime: number;
  audioElement?: HTMLAudioElement | null;
}

interface MousePosition {
  x: number;
  y: number;
}

interface BeatData {
  timestamp: number;
  intensity: number;
}

export function BeatReactiveBackground({ isPlaying, currentTime, audioElement }: BeatReactiveBackgroundProps) {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);
  const [beatIntensity, setBeatIntensity] = useState(0);
  const [bassLevel, setBassLevel] = useState(0);
  const [particles, setParticles] = useState<Array<{ 
    id: number; 
    x: number; 
    y: number; 
    opacity: number; 
    size: number; 
    velocity: { x: number; y: number };
    color: string;
    pulseSize: number;
  }>>([]);
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 50, y: 50 });
  
  const animationRef = useRef<number>();
  const lastBeatRef = useRef<number>(0);
  const beatThreshold = 0.8;

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initialize Web Audio API
  useEffect(() => {
    if (!audioElement || !isPlaying) return;

    const initAudio = async () => {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = context.createMediaElementSource(audioElement);
        const analyserNode = context.createAnalyser();
        
        analyserNode.fftSize = 256;
        analyserNode.smoothingTimeConstant = 0.8;
        
        source.connect(analyserNode);
        analyserNode.connect(context.destination);
        
        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        setAudioContext(context);
        setAnalyser(analyserNode);
        setDataArray(dataArray);
      } catch (error) {
        console.log('Audio analysis not available:', error);
      }
    };

    initAudio();

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [audioElement, isPlaying]);

  // Audio analysis loop
  useEffect(() => {
    if (!analyser || !dataArray || !isPlaying) return;

    const analyzeAudio = () => {
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate bass (low frequencies) and overall intensity
      const bassEnd = Math.floor(dataArray.length * 0.1);
      const bassSum = Array.from(dataArray.slice(0, bassEnd)).reduce((a, b) => a + b, 0);
      const bassAvg = bassSum / bassEnd / 255;
      
      const overallSum = Array.from(dataArray).reduce((a, b) => a + b, 0);
      const overallAvg = overallSum / dataArray.length / 255;
      
      setBassLevel(bassAvg);
      setBeatIntensity(overallAvg);
      
      // Beat detection
      if (overallAvg > beatThreshold && Date.now() - lastBeatRef.current > 200) {
        lastBeatRef.current = Date.now();
        createBeatParticles(overallAvg);
      }
      
      animationRef.current = requestAnimationFrame(analyzeAudio);
    };

    analyzeAudio();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, dataArray, isPlaying]);

  const createBeatParticles = (intensity: number) => {
    const newParticles = Array.from({ length: Math.floor(intensity * 15) }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: 0.8 + intensity * 0.2,
      size: 3 + intensity * 8,
      velocity: {
        x: (Math.random() - 0.5) * intensity * 4,
        y: (Math.random() - 0.5) * intensity * 4
      },
      color: `hsl(${Math.random() > 0.5 ? 0 + Math.random() * 30 : 174 + Math.random() * 30}, ${70 + intensity * 30}%, ${50 + intensity * 30}%)`,
      pulseSize: 1 + intensity * 2
    }));

    setParticles(prev => [...prev, ...newParticles].slice(-100));
  };

  // Update particles
  useEffect(() => {
    if (!isPlaying) return;

    const updateInterval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.velocity.x,
            y: particle.y + particle.velocity.y,
            opacity: particle.opacity * 0.95,
            size: particle.size * 0.98,
            pulseSize: particle.pulseSize * 0.96
          }))
          .filter(particle => particle.opacity > 0.1)
      );
    }, 50);

    return () => clearInterval(updateInterval);
  }, [isPlaying]);

  const backgroundScale = 1 + beatIntensity * 0.1;
  const backgroundBrightness = 1 + beatIntensity * 0.3;
  const bassGlow = bassLevel * 0.5;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated gradient background that reacts to music */}
      <div 
        className="absolute inset-0 bg-gradient-background transition-all duration-200 ease-out"
        style={{
          transform: `scale(${backgroundScale})`,
          filter: `brightness(${backgroundBrightness}) saturate(${1 + beatIntensity * 0.5})`,
        }}
      />

      {/* Mouse-reactive glow */}
      <div 
        className="absolute w-96 h-96 bg-accent/20 rounded-full blur-3xl transition-all duration-300 pointer-events-none"
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: `translate(-50%, -50%) scale(${1 + beatIntensity * 0.5})`,
          opacity: 0.4 + beatIntensity * 0.6
        }}
      />

      {/* Mouse trail particles */}
      <div 
        className="absolute w-4 h-4 bg-primary/30 rounded-full blur-sm transition-all duration-500 pointer-events-none"
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: 'translate(-50%, -50%)',
          boxShadow: `0 0 ${20 + beatIntensity * 30}px hsl(var(--primary))`
        }}
      />
      
      {/* Beat-reactive particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-pulse-gentle"
          style={{
            left: `${Math.max(0, Math.min(100, particle.x))}%`,
            top: `${Math.max(0, Math.min(100, particle.y))}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.pulseSize * 10}px ${particle.color}`,
            transition: 'all 0.1s ease-out'
          }}
        />
      ))}

      {/* Bass-reactive corner effects */}
      <div 
        className="absolute top-0 left-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl transition-all duration-300"
        style={{
          transform: `scale(${1 + bassGlow})`,
          opacity: 0.3 + bassGlow * 0.7
        }}
      />
      <div 
        className="absolute bottom-0 right-0 w-96 h-96 bg-accent/30 rounded-full blur-3xl transition-all duration-300"
        style={{
          transform: `scale(${1 + bassGlow})`,
          opacity: 0.3 + bassGlow * 0.7,
          animationDelay: '1s'
        }}
      />

      {/* Beat pulse rings */}
      {beatIntensity > 0.6 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-32 h-32 border-2 border-accent/50 rounded-full animate-ping"
            style={{
              animationDuration: '1s',
              transform: `scale(${beatIntensity * 3})`
            }}
          />
          <div 
            className="absolute w-48 h-48 border border-primary/30 rounded-full animate-ping"
            style={{
              animationDuration: '1.5s',
              transform: `scale(${beatIntensity * 2})`
            }}
          />
        </div>
      )}

      {/* Frequency bars visualization */}
      {dataArray && isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-center space-x-1 opacity-20">
          {Array.from({ length: 32 }, (_, i) => {
            const dataIndex = Math.floor((i / 32) * dataArray.length);
            const height = (dataArray[dataIndex] / 255) * 100;
            return (
              <div
                key={i}
                className="bg-gradient-to-t from-accent via-primary to-accent-glow rounded-t-sm"
                style={{
                  width: '3px',
                  height: `${height}%`,
                  minHeight: '2px',
                  transition: 'height 0.1s ease-out'
                }}
              />
            );
          })}
        </div>
      )}

      {/* Enhanced dynamic wave patterns */}
      <div className="absolute inset-0 opacity-15">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d={`M0,50 Q25,${40 + beatIntensity * 20} 50,${45 + bassLevel * 15} T100,50 V100 H0 Z`}
            fill="url(#waveGradient)"
            className="transition-all duration-300"
          />
          <path
            d={`M0,60 Q35,${50 + beatIntensity * 15} 70,${55 + bassLevel * 10} T100,60 V100 H0 Z`}
            fill="url(#waveGradient2)"
            className="transition-all duration-500"
            style={{ opacity: 0.6 }}
          />
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="50%" stopColor="hsl(var(--accent))" />
              <stop offset="100%" stopColor="hsl(var(--primary))" />
            </linearGradient>
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--accent))" />
              <stop offset="50%" stopColor="hsl(var(--primary-glow))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Flowing particle streams */}
      <div className="absolute inset-0 overflow-hidden">
        {beatIntensity > 0.4 && (
          <>
            <div 
              className="absolute w-1 h-1 bg-accent rounded-full animate-wave-flow"
              style={{
                top: `${20 + beatIntensity * 30}%`,
                left: '-5%',
                boxShadow: `0 0 ${10 + beatIntensity * 20}px hsl(var(--accent))`,
                animationDuration: `${3 - beatIntensity * 2}s`
              }}
            />
            <div 
              className="absolute w-1 h-1 bg-primary rounded-full animate-wave-flow"
              style={{
                top: `${60 + bassLevel * 20}%`,
                left: '-5%',
                boxShadow: `0 0 ${10 + bassLevel * 25}px hsl(var(--primary))`,
                animationDuration: `${4 - beatIntensity * 2}s`,
                animationDelay: '1s'
              }}
            />
          </>
        )}
      </div>

      {/* Ambient floating orbs - always visible */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-sm animate-pulse-gentle"
            style={{
              left: `${15 + (i * 15)}%`,
              top: `${20 + Math.sin((Date.now() / 1000) + i) * 30}%`,
              transform: `scale(${1 + beatIntensity * 0.5})`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}