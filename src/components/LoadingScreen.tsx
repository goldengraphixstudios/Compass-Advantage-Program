"use client";

import { useEffect, useRef, useState, useCallback } from "react";

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
    const count = Math.floor((w * h) / 8000); // density based on screen
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

      // Floating sparkles (larger, slower, glowing)
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

      {/* Radial glow behind compass */}
      <div className="absolute w-64 h-64 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, rgba(0,174,239,0.4) 0%, transparent 70%)" }} />

      {/* Pulse rings */}
      <div className="absolute w-36 h-36 rounded-full border border-cyan-400/20 animate-pulse-ring" />
      <div className="absolute w-52 h-52 rounded-full border border-white/5 animate-pulse-ring" style={{ animationDelay: "0.8s" }} />

      {/* Compass icon */}
      <div className="relative w-28 h-28 mb-8 z-10">
        {/* Outer ring - spins */}
        <svg className="w-full h-full animate-compass-spin" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="46" stroke="url(#ringGrad)" strokeWidth="1.5" opacity="0.5" />
          <circle cx="50" cy="50" r="38" stroke="white" strokeWidth="0.5" opacity="0.15" />
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#00AEEF" />
              <stop offset="100%" stopColor="white" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line key={deg} x1="50" y1="6" x2="50" y2={deg % 90 === 0 ? "14" : "10"}
              stroke={deg % 90 === 0 ? "#00AEEF" : "white"}
              strokeWidth={deg % 90 === 0 ? "2" : "1"}
              opacity={deg % 90 === 0 ? "0.8" : "0.25"}
              transform={`rotate(${deg} 50 50)`} />
          ))}
        </svg>

        {/* Needle */}
        <svg className="absolute inset-0 w-full h-full animate-compass-needle" viewBox="0 0 100 100" fill="none">
          <path d="M50 16 L44 47 L50 50 L56 47 Z" fill="#00AEEF" opacity="0.9" />
          <path d="M50 84 L44 53 L50 50 L56 53 Z" fill="white" opacity="0.25" />
          <circle cx="50" cy="50" r="4" fill="white" opacity="0.9" />
          <circle cx="50" cy="50" r="2" fill="#00AEEF" />
        </svg>

        {/* Glow behind needle tip */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-cyan-400/30 blur-md animate-pulse" />
      </div>

      {/* Text */}
      <div className="text-center z-10 animate-fade-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-wider mb-1.5"
          style={{ fontFamily: "var(--font-display)" }}>
          COMPASS
        </h1>
        <p className="text-cyan-300/80 text-sm tracking-[0.25em] uppercase font-medium">
          Advantage Program
        </p>
      </div>

      {/* Progress bar */}
      <div className="mt-10 w-52 z-10 animate-fade-up" style={{ animationDelay: "0.4s", opacity: 0 }}>
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
