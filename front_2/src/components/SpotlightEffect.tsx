import { useEffect, useRef } from 'react';

interface SpotlightEffectProps {
  children: React.ReactNode;
  className?: string;
}

export function SpotlightEffect({ children, className = '' }: SpotlightEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      let x = ((e.clientX - rect.left) / rect.width) * 100;
      let y = ((e.clientY - rect.top) / rect.height) * 100;

      // clamp to avoid jumpiness
      x = Math.min(100, Math.max(0, x));
      y = Math.min(100, Math.max(0, y));

      container.style.setProperty('--mouse-x', `${x}%`);
      container.style.setProperty('--mouse-y', `${y}%`);
    };

    // attach once
    container.addEventListener('mousemove', handleMouseMove);

    // reset spotlight when mouse leaves
    container.addEventListener('mouseleave', () => {
      container.style.setProperty('--mouse-x', `-9999px`);
      container.style.setProperty('--mouse-y', `-9999px`);
    });

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className={`group relative ${className}`}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none spotlight-bg" />
      {children}
    </div>
  );
}
