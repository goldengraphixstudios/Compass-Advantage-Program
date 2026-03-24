"use client";

import { useEffect, useRef, useState, useCallback } from "react";

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

function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <div ref={ref}>
      <span>{count}</span>{suffix}
    </div>
  );
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const initParticles = useCallback((w: number, h: number) => {
    const count = Math.floor((w * h) / 12000);
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const types: ("dot" | "ring" | "diamond")[] = ["dot", "dot", "dot", "ring", "diamond"];
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.2 - 0.03,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.05,
        fadeDir: Math.random() > 0.5 ? 1 : -1,
        type: types[Math.floor(Math.random() * types.length)],
        hue: Math.random(),
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
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 1) {
          p.vx += (dx / dist) * 0.06;
          p.vy += (dy / dist) * 0.06;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.opacity += p.fadeDir * 0.003;
        if (p.opacity > 0.5) p.fadeDir = -1;
        if (p.opacity < 0.03) p.fadeDir = 1;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y > h + 10) p.y = -10;

        let color: string;
        if (p.hue < 0.4) color = `rgba(255, 255, 255, ${p.opacity})`;
        else if (p.hue < 0.7) color = `rgba(0, 174, 239, ${p.opacity})`;
        else color = `rgba(77, 202, 241, ${p.opacity})`;

        ctx.fillStyle = color;
        ctx.strokeStyle = color;

        if (p.type === "dot") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "ring") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2);
          ctx.lineWidth = 0.5;
          ctx.stroke();
        } else {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(time * 0.008 + i);
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

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (d < 80) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 174, 239, ${(1 - d / 80) * 0.06})`;
            ctx.lineWidth = 0.3;
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < 3; i++) {
        const ox = w * (0.1 + 0.8 * ((Math.sin(time * 0.002 + i * 1.8) + 1) / 2));
        const oy = h * (0.15 + 0.7 * ((Math.cos(time * 0.003 + i * 2.3) + 1) / 2));
        const oOpacity = 0.05 + 0.03 * Math.sin(time * 0.015 + i);
        const oSize = 50 + 25 * Math.sin(time * 0.01 + i);
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
      className="relative overflow-hidden min-h-screen flex items-center"
      style={{
        background: "linear-gradient(135deg, #0A112C 0%, #1B2A6B 30%, #152256 60%, #0098D1 100%)",
      }}
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Animated gradient blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-20 animate-blob"
        style={{ background: "radial-gradient(circle, rgba(0,174,239,0.4) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-15 animate-blob"
        style={{ background: "radial-gradient(circle, rgba(77,202,241,0.3) 0%, transparent 70%)", animationDelay: "-4s" }} />

      {/* Radial overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(ellipse at 30% 70%, rgba(0,174,239,0.1) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(0,174,239,0.08) 0%, transparent 45%)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-32 sm:pb-24 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 glass rounded-full px-5 py-2 mb-8 animate-fade-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
              </span>
              <span className="text-cyan-200 text-sm font-medium tracking-wide">Now Accepting Submissions</span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6 animate-fade-up"
              style={{ fontFamily: "var(--font-display)", animationDelay: "0.35s", opacity: 0 }}
            >
              Amplify Your<br />
              Listings with{" "}
              <span className="gradient-text">Compass</span>
            </h1>

            <p className="text-lg sm:text-xl text-blue-100/80 leading-relaxed mb-10 max-w-lg animate-fade-up" style={{ animationDelay: "0.5s", opacity: 0 }}>
              Submit your property details and get professionally crafted social media
              content across multiple platforms — completely free for agents.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-14 animate-fade-up" style={{ animationDelay: "0.65s", opacity: 0 }}>
              <a
                href="#form-section"
                className="group inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-white px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/25 cursor-pointer"
              >
                Submit Your Listing
                <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 glass hover:bg-white/15 text-white px-8 py-4 rounded-full text-base font-medium transition-all duration-300 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                </svg>
                See How It Works
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: "0.8s", opacity: 0 }}>
              <div className="glass rounded-2xl p-4 text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  <AnimatedCounter end={2} suffix="–3" />
                </div>
                <div className="text-xs sm:text-sm text-blue-200/60 font-medium">Business Days</div>
              </div>
              <div className="glass rounded-2xl p-4 text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  <AnimatedCounter end={3} suffix="+" />
                </div>
                <div className="text-xs sm:text-sm text-blue-200/60 font-medium">Social Platforms</div>
              </div>
              <div className="glass rounded-2xl p-4 text-center">
                <div className="text-3xl sm:text-4xl font-bold text-cyan-300 mb-1 font-semibold">Free</div>
                <div className="text-xs sm:text-sm text-blue-200/60 font-medium">For All Agents</div>
              </div>
            </div>
          </div>

          {/* Right visual */}
          <div className="hidden lg:flex items-center justify-center relative">
            {/* Floating property card */}
            <div className="relative animate-float-slow">
              {/* Main image card */}
              <div className="relative w-[400px] xl:w-[460px] rounded-3xl overflow-hidden shadow-2xl shadow-navy-900/40 animate-pulse-glow">
                <img
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"
                  alt="Beautiful luxury property"
                  className="w-full h-[320px] xl:h-[360px] object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-cyan-500/90 text-white text-xs font-semibold px-3 py-1 rounded-full">Featured</span>
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">New Listing</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg">123 Waterfront Drive</h3>
                  <p className="text-blue-200/80 text-sm">4 Bed &middot; 3 Bath &middot; 2,800 sqft</p>
                </div>
              </div>

              {/* Floating social notification card */}
              <div className="absolute -right-6 top-8 glass-dark rounded-2xl p-4 w-56 animate-float" style={{ animationDelay: "-1s" }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">Instagram</p>
                    <p className="text-blue-200/60 text-[10px]">Posted 2h ago</p>
                  </div>
                </div>
                <p className="text-blue-100/70 text-xs leading-relaxed">Your listing is now live and reaching potential buyers!</p>
              </div>

              {/* Floating engagement badge */}
              <div className="absolute -left-8 bottom-16 glass-dark rounded-2xl p-3 animate-float" style={{ animationDelay: "-2.5s" }}>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full bg-cyan-500 border-2 border-navy-800 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-blue-600 border-2 border-navy-800 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-blue-700 border-2 border-navy-800 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">Multi-Platform</p>
                    <p className="text-blue-200/60 text-[10px]">Reach thousands</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Logo Stamp */}
            <div className="absolute -right-12 -bottom-12 pointer-events-none opacity-15">
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/logo-stamp.png`}
                alt=""
                className="w-48 h-auto"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
