import { useEffect, useRef } from "react";

interface BeatReactiveBackgroundProps {
  isPlaying: boolean;
  audioElement: HTMLAudioElement | null;
}

export function BeatReactiveBackground({ isPlaying, audioElement }: BeatReactiveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  // Animation refs
  const animationFrameRef = useRef<number>();
  const lastBeatRef = useRef<number>(0);

  // Particles (stored OUTSIDE React)
  const particlesRef = useRef<any[]>([]);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  // Track mouse (throttled to 60hz)
  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

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

  // Setup audio analyser ONCE
  useEffect(() => {
    if (!audioElement) return;

    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaElementSource(audioElement);
    const analyser = audioCtx.createAnalyser();

    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.75;

    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    const data = new Uint8Array(analyser.frequencyBinCount);

    audioCtxRef.current = audioCtx;
    analyserRef.current = analyser;
    dataArrayRef.current = data;

    return () => {
      audioCtx.close();
    };
  }, [audioElement]);

  // Create particles on beat
  const spawnParticles = (intensity: number) => {
    const particles = particlesRef.current;

    for (let i = 0; i < intensity * 10; i++) {
      particles.push({
        x: mouseRef.current.x,
        y: mouseRef.current.y,
        size: 2 + Math.random() * 4 * intensity,
        opacity: 0.9,
        color: `hsl(${180 + Math.random() * 80}, 80%, 60%)`,
        vx: (Math.random() - 0.5) * 4 * intensity,
        vy: (Math.random() - 0.5) * 4 * intensity,
      });
    }

    if (particles.length > 300) particles.splice(0, 100);
  };

  // Main animation loop
  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      const analyser = analyserRef.current;
      const dataArray = dataArrayRef.current;

      if (!canvas || !ctx || !analyser || !dataArray) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      analyser.getByteFrequencyData(dataArray);

      // Compute beat + bass
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      const intensity = sum / (dataArray.length * 255);

      const bass = dataArray.slice(0, 8).reduce((a, b) => a + b, 0) / (8 * 255);

      // Detect beat
      if (intensity > 0.55 && Date.now() - lastBeatRef.current > 250) {
        lastBeatRef.current = Date.now();
        spawnParticles(intensity);
      }

      // Draw gradient background
      const grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grd.addColorStop(0, `hsla(var(--primary), ${0.4 + intensity * 0.3})`);
      grd.addColorStop(1, `hsla(var(--accent), ${0.4 + bass * 0.3})`);
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Glow around mouse
      ctx.beginPath();
      ctx.fillStyle = `hsla(var(--accent), ${0.2 + intensity * 0.4})`;
      ctx.arc(mouseRef.current.x, mouseRef.current.y, 250 + intensity * 100, 0, Math.PI * 2);
      ctx.fill();

      // Beat pulse ripple
      if (intensity > 0.6) {
        ctx.beginPath();
        ctx.strokeStyle = `hsla(var(--primary), 0.3)`;
        ctx.lineWidth = 4;
        ctx.arc(
          canvas.width / 2,
          canvas.height / 2,
          80 + intensity * 140,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      // Update & draw particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.opacity *= 0.96;
        p.size *= 0.97;

        if (p.opacity < 0.08) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.fillStyle = p.color.replace("60%)", `60% / ${p.opacity})`);
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameRef.current!);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}
