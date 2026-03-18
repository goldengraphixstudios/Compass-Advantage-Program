"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  fadeDir: number;
  type: "dot" | "ring" | "diamond";
  hue: number;
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const initParticles = useCallback((w: number, h: number) => {
    const count = Math.floor((w * h) / 10000);
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const types: ("dot" | "ring" | "diamond")[] = ["dot", "dot", "dot", "ring", "diamond"];
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.3 - 0.05, // gentle upward float
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.05,
        fadeDir: Math.random() > 0.5 ? 1 : -1,
        type: types[Math.floor(Math.random() * types.length)],
        hue: Math.random(), // 0-0.4 = white, 0.4-0.7 = cyan, 0.7-1 = light blue
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
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width;
      canvas.height = rect.height;
      if (particlesRef.current.length === 0) initParticles(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener("mousemove", handleMouse);

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

        // Mouse attraction (gentle pull)
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 1) {
          p.vx += (dx / dist) * 0.08;
          p.vy += (dy / dist) * 0.08;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Fade
        p.opacity += p.fadeDir * 0.004;
        if (p.opacity > 0.55) { p.fadeDir = -1; }
        if (p.opacity < 0.03) { p.fadeDir = 1; }

        // Wrap
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y > h + 10) p.y = -10;

        // Color
        let color: string;
        if (p.hue < 0.4) color = `rgba(255, 255, 255, ${p.opacity})`;
        else if (p.hue < 0.7) color = `rgba(0, 174, 239, ${p.opacity})`;
        else color = `rgba(77, 202, 241, ${p.opacity})`;

        // Draw shape
        ctx.fillStyle = color;
        ctx.strokeStyle = color;

        if (p.type === "dot") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "ring") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2);
          ctx.lineWidth = 0.6;
          ctx.stroke();
        } else {
          // Diamond
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(time * 0.01 + i);
          const s = p.size * 1.2;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.lineTo(s, 0);
          ctx.lineTo(0, s);
          ctx.lineTo(-s, 0);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

        // Connection lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (d < 90) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 174, 239, ${(1 - d / 90) * 0.08})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      // Floating orbs (ambient glow)
      for (let i = 0; i < 4; i++) {
        const ox = w * (0.1 + 0.8 * ((Math.sin(time * 0.002 + i * 1.8) + 1) / 2));
        const oy = h * (0.15 + 0.7 * ((Math.cos(time * 0.003 + i * 2.3) + 1) / 2));
        const oOpacity = 0.06 + 0.04 * Math.sin(time * 0.015 + i);
        const oSize = 40 + 20 * Math.sin(time * 0.01 + i);

        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, oSize);
        grad.addColorStop(0, `rgba(0, 174, 239, ${oOpacity})`);
        grad.addColorStop(1, "rgba(0, 174, 239, 0)");
        ctx.beginPath();
        ctx.arc(ox, oy, oSize, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
    };
  }, [initParticles]);

  return (
    <section
      className="relative overflow-hidden min-h-[600px] sm:min-h-[700px] flex items-center"
      style={{ background: "linear-gradient(135deg, #1B2A6B 0%, #2D4080 40%, #0098D1 100%)" }}
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Subtle radial glows */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(ellipse at 20% 80%, rgba(0,174,239,0.12) 0%, transparent 50%), radial-gradient(ellipse at 85% 15%, rgba(0,174,239,0.08) 0%, transparent 45%)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-36 sm:pb-24 relative z-10 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-200 text-sm font-medium">Now Accepting Submissions</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The Compass<br />
            <span className="text-cyan-300">Advantage</span> Program
          </h1>

          <p className="text-lg sm:text-xl text-blue-100/90 leading-relaxed mb-8 max-w-2xl">
            Promote your listings and open houses through Compass&rsquo; established marketing channels.
            Submit your details and reach more potential buyers within 2&ndash;3 business days.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#form-section"
              className="inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30 cursor-pointer"
            >
              Submit Your Listing
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-8 py-3.5 rounded-xl text-base font-medium transition-all cursor-pointer"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg">
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-white">2-3</div>
            <div className="text-sm text-blue-200/70 mt-1">Business Days</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-white">3+</div>
            <div className="text-sm text-blue-200/70 mt-1">Social Platforms</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-white">Free</div>
            <div className="text-sm text-blue-200/70 mt-1">For Agents</div>
          </div>
        </div>
      </div>

      {/* Decorative compass (large, faded) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] opacity-[0.05] hidden lg:block pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="90" stroke="white" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="70" stroke="white" strokeWidth="1" />
          <path d="M100 10 L105 95 L100 100 L95 95Z" fill="white" opacity="0.8" />
          <path d="M100 190 L105 105 L100 100 L95 105Z" fill="white" opacity="0.4" />
          <path d="M10 100 L95 95 L100 100 L95 105Z" fill="white" opacity="0.4" />
          <path d="M190 100 L105 95 L100 100 L105 105Z" fill="white" opacity="0.4" />
        </svg>
      </div>
    </section>
  );
}
