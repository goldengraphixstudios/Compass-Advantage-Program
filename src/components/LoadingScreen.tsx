"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const logoStamp = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/logo-stamp.png`;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  fadeSpeed: number;
  hue: number; // 0 = white, 1 = cyan
}

export default function LoadingScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Particle system
  const initParticles = useCallback((w: number, h: number) => {
    const particles: Particle[] = [];
    const count = Math.floor((w * h) / 8000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        fadeSpeed: Math.random() * 0.008 + 0.002,
        hue: Math.random() > 0.65 ? 1 : 0,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (particlesRef.current.length === 0) initParticles(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    let time = 0;
    const animate = () => {
      time++;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.vx += (dx / dist) * force * 0.3;
          p.vy += (dy / dist) * force * 0.3;
        }

        // Drift
        p.x += p.vx;
        p.y += p.vy;

        // Damping
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Fade pulse
        p.opacity += p.fadeSpeed;
        if (p.opacity > 0.7 || p.opacity < 0.05) p.fadeSpeed *= -1;

        // Wrap
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Draw
        const color = p.hue === 1
          ? `rgba(0, 174, 239, ${p.opacity})`
          : `rgba(255, 255, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (d < 100) {
            const lineOpacity = (1 - d / 100) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 174, 239, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Floating sparkles
      for (let i = 0; i < 5; i++) {
        const sparkleX = w * (0.15 + 0.7 * ((Math.sin(time * 0.003 + i * 1.5) + 1) / 2));
        const sparkleY = h * (0.2 + 0.6 * ((Math.cos(time * 0.004 + i * 2.1) + 1) / 2));
        const sparkleOpacity = 0.15 + 0.15 * Math.sin(time * 0.02 + i);
        const sparkleSize = 3 + 2 * Math.sin(time * 0.015 + i);

        const gradient = ctx.createRadialGradient(sparkleX, sparkleY, 0, sparkleX, sparkleY, sparkleSize * 4);
        gradient.addColorStop(0, `rgba(0, 174, 239, ${sparkleOpacity})`);
        gradient.addColorStop(1, "rgba(0, 174, 239, 0)");
        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, sparkleSize * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, sparkleSize * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${sparkleOpacity * 1.5})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [initParticles]);

  // Progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) { clearInterval(timer); return 100; }
        const increment = prev < 60 ? 3 : prev < 85 ? 5 : 8;
        return Math.min(prev + increment, 100);
      });
    }, 50);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const exitTimer = setTimeout(() => setExiting(true), 400);
      const hideTimer = setTimeout(() => setHidden(true), 900);
      return () => { clearTimeout(exitTimer); clearTimeout(hideTimer); };
    }
  }, [progress]);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center ${exiting ? "animate-screen-exit" : ""}`}
      style={{ background: "linear-gradient(135deg, #0A112C 0%, #1B2A6B 40%, #152256 100%)" }}
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Radial glow behind logo */}
      <div className="absolute w-80 h-80 rounded-full opacity-25"
        style={{ background: "radial-gradient(circle, rgba(0,174,239,0.4) 0%, transparent 70%)" }} />

      {/* Logo Stamp */}
      <div className="relative z-10 mb-10 animate-fade-up" style={{ opacity: 0, animationDelay: "0.1s" }}>
        <img
          src={logoStamp}
          alt="Compass Advantage"
          className="w-52 h-52 sm:w-64 sm:h-64 object-contain drop-shadow-[0_0_30px_rgba(0,174,239,0.3)]"
          fetchPriority="high"
        />
      </div>

      {/* Progress bar */}
      <div className="w-52 z-10 animate-fade-up" style={{ animationDelay: "0.3s", opacity: 0 }}>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full rounded-full transition-all duration-200 ease-out"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #00AEEF, #4DCAF1, white)",
              boxShadow: "0 0 12px rgba(0,174,239,0.5)",
            }}
          />
        </div>
        <p className="text-center text-white/30 text-xs mt-3 tracking-widest font-light">
          {progress < 100 ? "Loading..." : "Welcome"}
        </p>
      </div>
    </div>
  );
}
