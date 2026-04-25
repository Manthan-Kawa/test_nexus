import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SynapseLogo } from "@/components/SynapseLogo";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Zap, Brain, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "Synapse — Neural Learning Platform" },
      { name: "description", content: "The world's most advanced adaptive learning system." },
    ],
  }),
});

const FEATURES = [
  { icon: Brain, label: "AI-Powered Paths", desc: "Adaptive curriculum that evolves with your pace" },
  { icon: Zap, label: "Real-time Progress", desc: "Live tracking across every skill node" },
  { icon: TrendingUp, label: "Streak Analytics", desc: "Cognitive metrics to keep you in flow" },
];

const WORDS = ["Engineer.", "Designer.", "Data Scientist.", "Architect.", "Creator."];

function LandingPage() {
  const navigate = useNavigate();
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mount animation trigger
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Typewriter effect
  useEffect(() => {
    const word = WORDS[wordIdx];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % WORDS.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIdx]);

  // Animated particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number; hue: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        hue: Math.random() > 0.5 ? 200 : 305,
      });
    }

    let animId: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `oklch(0.7 0.15 ${particles[i].hue} / ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(0.78 0.18 ${p.hue} / ${p.alpha})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden" style={{ background: "oklch(0.09 0.01 260)" }}>

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />

      {/* Ambient glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[55vw] h-[55vw] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, oklch(0.55 0.22 305 / 0.18) 0%, transparent 70%)", zIndex: 0 }} />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, oklch(0.65 0.2 200 / 0.20) 0%, transparent 70%)", zIndex: 0 }} />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[30vw] h-[30vw] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, oklch(0.5 0.18 240 / 0.10) 0%, transparent 70%)", zIndex: 0 }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 lg:px-16 pt-7"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(-16px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
        <SynapseLogo size="md" />
        <nav className="flex items-center gap-6">
          <a href="#features" className="text-sm text-[oklch(0.72_0.01_260)] hover:text-white transition-colors duration-200">Features</a>
          <a href="#about" className="text-sm text-[oklch(0.72_0.01_260)] hover:text-white transition-colors duration-200">About</a>
          <button
            onClick={() => navigate({ to: "/login" })}
            className="text-sm px-5 h-9 rounded-full border border-[oklch(0.82_0.15_200/0.4)] text-[oklch(0.82_0.15_200)] hover:bg-[oklch(0.82_0.15_200/0.08)] transition-all duration-200 hover:scale-105"
          >
            Sign in
          </button>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center pt-8 pb-24">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[oklch(0.82_0.15_200/0.3)] bg-[oklch(0.82_0.15_200/0.06)] text-[oklch(0.82_0.15_200)] text-xs tracking-widest mb-8"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(20px)", transition: "opacity 0.7s 0.1s ease, transform 0.7s 0.1s ease" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.82_0.15_200)] inline-block" style={{ animation: "pulse-glow 2s infinite" }} />
          NEURAL LEARNING OS — V2.0
        </div>

        {/* Main headline */}
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-semibold tracking-tight text-white leading-[1.08] max-w-5xl"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(30px)", transition: "opacity 0.8s 0.2s ease, transform 0.8s 0.2s ease" }}
        >
          Become a Better
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-brand)" }}
          >
            {displayed}
            <span className="inline-block w-[3px] h-[0.85em] ml-1 align-middle rounded-sm"
              style={{ background: "oklch(0.82 0.15 200)", animation: "pulse-glow 1s ease-in-out infinite" }} />
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="mt-7 text-lg text-[oklch(0.65_0.02_260)] max-w-xl leading-relaxed"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(24px)", transition: "opacity 0.8s 0.35s ease, transform 0.8s 0.35s ease" }}
        >
          Synapse maps your learning DNA and builds an adaptive, AI-driven curriculum
          that evolves with every node you master.
        </p>

        {/* CTA buttons */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(20px)", transition: "opacity 0.8s 0.48s ease, transform 0.8s 0.48s ease" }}
        >
          <button
            onClick={() => navigate({ to: "/login" })}
            className="group relative h-14 px-10 rounded-2xl text-base font-semibold text-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-[0.97]"
            style={{ backgroundImage: "var(--gradient-brand)", boxShadow: "0 0 50px oklch(0.65 0.22 240 / 0.45), 0 8px 32px oklch(0 0 0 / 0.4)" }}
          >
            <span className="relative z-10 flex items-center gap-2.5">
              Get Started
              <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
            {/* Shimmer overlay */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          </button>

          <button
            onClick={() => navigate({ to: "/login" })}
            className="h-14 px-8 rounded-2xl text-base font-semibold text-[oklch(0.82_0.02_260)] border border-[oklch(0.35_0.02_260)] hover:border-[oklch(0.5_0.02_260)] hover:bg-[oklch(0.18_0.01_260)] transition-all duration-300 hover:-translate-y-1"
          >
            Watch Demo
          </button>
        </div>

        {/* Social proof */}
        <div
          className="mt-14 flex items-center gap-6 text-[oklch(0.55_0.02_260)] text-sm"
          style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.8s 0.65s ease" }}
        >
          <span className="flex items-center gap-2">
            <span className="font-semibold text-white">12,400+</span> learners
          </span>
          <span className="w-px h-4 bg-[oklch(0.3_0.01_260)]" />
          <span className="flex items-center gap-2">
            <span className="font-semibold text-white">50+</span> skill tracks
          </span>
          <span className="w-px h-4 bg-[oklch(0.3_0.01_260)]" />
          <span className="flex items-center gap-2">
            <span className="font-semibold text-white">4.9★</span> rating
          </span>
        </div>

        {/* Feature cards */}
        <div
          id="features"
          className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl w-full"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(30px)", transition: "opacity 0.9s 0.75s ease, transform 0.9s 0.75s ease" }}
        >
          {FEATURES.map((f, i) => (
            <div
              key={f.label}
              className="rounded-2xl border border-[oklch(0.25_0.02_260)] bg-[oklch(0.14_0.01_260)/0.6] backdrop-blur p-6 text-left hover:border-[oklch(0.82_0.15_200/0.3)] hover:-translate-y-1 transition-all duration-300 group"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="h-10 w-10 rounded-xl grid place-items-center mb-4"
                style={{ background: "linear-gradient(135deg, oklch(0.82 0.15 200 / 0.15), oklch(0.65 0.22 305 / 0.15))", border: "1px solid oklch(0.82 0.15 200 / 0.2)" }}>
                <f.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" style={{ color: "oklch(0.82 0.15 200)" }} />
              </div>
              <div className="font-semibold text-white mb-1">{f.label}</div>
              <div className="text-sm text-[oklch(0.60_0.02_260)] leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex justify-center gap-8 px-8 pb-7 text-[11px] uppercase tracking-[0.2em] text-[oklch(0.4_0.01_260)]"
        style={{ opacity: mounted ? 1 : 0, transition: "opacity 1s 1s ease" }}>
        <a href="#" className="hover:text-[oklch(0.65_0.01_260)] transition-colors duration-200">Privacy</a>
        <a href="#" className="hover:text-[oklch(0.65_0.01_260)] transition-colors duration-200">Terms</a>
        <a href="#" className="hover:text-[oklch(0.65_0.01_260)] transition-colors duration-200">Status</a>
        <a href="#" className="hover:text-[oklch(0.65_0.01_260)] transition-colors duration-200">Contact</a>
      </footer>
    </div>
  );
}
