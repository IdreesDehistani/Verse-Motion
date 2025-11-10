import { useEffect, useState } from 'react';

interface BackgroundVisualsProps {
  isPlaying: boolean;
  currentTime: number;
  useDynamic?: boolean;
}

export function BackgroundVisuals({ isPlaying, currentTime, useDynamic = true }: BackgroundVisualsProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; opacity: number; size: number }>>([]);

  useEffect(() => {
    if (!isPlaying || !useDynamic) return;

    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticles = [...prev];
        
        // Add new particle
        if (Math.random() > 0.7) {
          newParticles.push({
            id: Date.now() + Math.random(),
            x: Math.random() * 100,
            y: Math.random() * 100,
            opacity: Math.random() * 0.6 + 0.2,
            size: Math.random() * 4 + 2
          });
        }

        // Remove old particles and update positions
        return newParticles
          .filter(particle => particle.opacity > 0.1)
          .map(particle => ({
            ...particle,
            y: particle.y - 0.5,
            opacity: particle.opacity * 0.98
          }))
          .slice(-50); // Keep only last 50 particles
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying, useDynamic]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `var(--background-gradient, linear-gradient(to bottom right, hsl(var(--primary)), hsl(var(--accent))))`,
          transform: isPlaying ? 'scale(1.1)' : 'scale(1)',
          filter: isPlaying ? 'brightness(1.1)' : 'brightness(1)',
          opacity: useDynamic ? 1 : 0.5,
        }}
      />

      
      {/* Floating particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-accent/30 animate-pulse-gentle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            transition: 'all 0.2s ease-out'
          }}
        />
      ))}

      {/* Subtle wave animation */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
        <div 
          className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"
          style={{
            transform: `translateY(${Math.sin(currentTime) * 10}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
      </div>

      {/* Corner glow effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-gentle" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-gentle" style={{ animationDelay: '1s' }} />
    </div>
  );
}