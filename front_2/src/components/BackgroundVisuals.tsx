import { useEffect, useRef } from "react";

interface BackgroundVisualsProps {
  isPlaying: boolean;
  currentTime: number;
  useDynamic?: boolean;
}

export function BackgroundVisuals({
  isPlaying,
  currentTime,
  useDynamic = true
}: BackgroundVisualsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const particlesRef = useRef<
    Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      vx: number;
      vy: number;
      color: string;
    }>
  >([]);

  const frameRef = useRef<number>();

  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctxRef.current = ctx;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Main animation loop
  useEffect(() => {
    const animate = () => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      const w = canvas.width;
      const h = canvas.height;

      // Clear screen
      ctx.clearRect(0, 0, w, h);

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, `hsla(var(--primary), ${useDynamic ? 0.35 : 0.15})`);
      gradient.addColorStop(1, `hsla(var(--accent), ${useDynamic ? 0.4 : 0.2})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Subtle wave motion
      ctx.fillStyle = `hsla(var(--primary), 0.15)`;
      const waveHeight = 40 + Math.sin(currentTime * 0.6) * 15;
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.quadraticCurveTo(w * 0.4, h - waveHeight, w, h);
      ctx.lineTo(w, h);
      ctx.fill();

      // Corner glow orbs
      const orbRadius = 280 + (isPlaying ? Math.sin(currentTime * 2) * 20 : 0);

      // top-left glow
      ctx.beginPath();
      ctx.fillStyle = `hsla(var(--primary), 0.25)`;
      ctx.arc(0, 0, orbRadius, 0, Math.PI * 2);
      ctx.fill();

      // bottom-right glow
      ctx.beginPath();
      ctx.fillStyle = `hsla(var(--accent), 0.25)`;
      ctx.arc(w, h, orbRadius, 0, Math.PI * 2);
      ctx.fill();

      // Particle generation (1–3 per frame)
      if (isPlaying && useDynamic && Math.random() < 0.3) {
        particlesRef.current.push({
          x: Math.random() * w,
          y: h + 20,
          size: 2 + Math.random() * 4,
          opacity: 0.5 + Math.random() * 0.4,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -0.6 - Math.random() * 0.6,
          color: `hsla(var(--accent), 0.5)`
        });

        // Limit to 80 particles
        if (particlesRef.current.length > 80) {
          particlesRef.current.splice(0, 20);
        }
      }

      // Update & draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.opacity *= 0.985;

        if (p.opacity < 0.05) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.fillStyle = p.color.replace("0.5", p.opacity.toString());
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current!);
  }, [isPlaying, currentTime, useDynamic]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
    ></canvas>
  );
}
