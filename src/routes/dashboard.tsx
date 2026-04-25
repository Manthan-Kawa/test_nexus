import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Calendar, CircleDashed, Gauge, Hourglass, Code2, BrainCircuit, BarChart3 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Synapse — System Status" },
      { name: "description", content: "Neural pathway formation optimization active." },
    ],
  }),
});

/* ── Utility: animated counter hook ──────────────────────── */
function useCountUp(target: number, duration = 1400, delay = 0, decimals = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const timeout = setTimeout(() => {
      const step = (ts: number) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(parseFloat((eased * target).toFixed(decimals)));
        if (progress < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
  }, [target, duration, delay, decimals]);
  return value;
}

/* ── Utility: triggered-fill progress bar ──────────────────  */
function AnimatedBar({ pct, color, delay = 0 }: { pct: number; color: string; delay?: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay + 100);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div className="h-1.5 rounded-full bg-secondary/60 overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{
          width: `${width}%`,
          background: color,
          transition: `width 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
          boxShadow: `0 0 8px ${color.replace(")", " / 0.5)")}`,
        }}
      />
    </div>
  );
}

/* ── Utility: animated circle ring ─────────────────────────  */
function AnimatedRing({ pct, delay = 0 }: { pct: number; delay?: number }) {
  const [dash, setDash] = useState(0);
  const circumference = 2 * Math.PI * 44; // r=44
  useEffect(() => {
    const t = setTimeout(() => setDash((pct / 100) * circumference), delay + 100);
    return () => clearTimeout(t);
  }, [pct, delay, circumference]);
  return (
    <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="44" fill="none" stroke="oklch(0.26 0.02 260)" strokeWidth="7" />
      <circle
        cx="50" cy="50" r="44" fill="none"
        stroke="oklch(0.82 0.15 200)" strokeWidth="7" strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
        strokeDashoffset="0"
        style={{
          filter: "drop-shadow(0 0 8px oklch(0.82 0.15 200 / 0.7))",
          transition: `stroke-dasharray 1.4s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        }}
      />
    </svg>
  );
}

function Dashboard() {
  return (
    <AppShell title="Skill Architecture">
      <div className="px-6 lg:px-10 py-8 space-y-6">
        {/* Header row */}
        <div
          className="flex items-start justify-between gap-4 flex-wrap"
          style={{ animation: "var(--animate-fade-in-up)", animationDelay: "0ms" }}
        >
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">System Status</h1>
            <p className="text-muted-foreground mt-2">Neural pathway formation optimization active.</p>
          </div>
          <button className="h-11 px-4 rounded-xl border border-border/50 bg-card/40 hover:bg-card/70 hover:-translate-y-[1px] active:scale-[0.97] transition-all duration-250 flex items-center gap-2 text-sm cursor-pointer">
            <Calendar className="h-4 w-4" /> Last 30 Days
          </button>
        </div>

        {/* Cognitive Trajectory */}
        <section
          className="rounded-2xl border border-border/40 bg-card/30 p-6 lg:p-8 hover:border-border/60 hover:bg-card/40 transition-all duration-400"
          style={{ animation: "var(--animate-fade-in-up)", animationDelay: "80ms" }}
        >
          <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Cognitive Trajectory</h2>
              <p className="text-[oklch(0.82_0.15_200)] text-sm mt-1">
                Real-time skill acquisition vs expected baseline
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.82_0.15_200)]" />
                Actual
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.65_0.22_305)]" />
                Expected
              </span>
            </div>
          </div>
          <TrajectoryChart />
        </section>

        {/* Metrics row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Completion Rate */}
          <MetricCard title="Completion Rate" Icon={CircleDashed} delay={160}>
            <CompletionRateContent />
          </MetricCard>

          {/* Learning Velocity */}
          <MetricCard title="Learning Velocity" Icon={Gauge} delay={240}>
            <LearningVelocityContent />
          </MetricCard>

          {/* Time Efficiency */}
          <MetricCard title="Time Efficiency" Icon={Hourglass} delay={320}>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Deep Work</span>
                  <span className="font-semibold">42 hrs</span>
                </div>
                <AnimatedBar pct={70} color="oklch(0.82 0.15 200)" delay={500} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Review Phase</span>
                  <span className="font-semibold">18 hrs</span>
                </div>
                <AnimatedBar pct={35} color="oklch(0.65 0.22 305)" delay={700} />
              </div>
            </div>
          </MetricCard>
        </section>

        {/* Bottom row */}
        <section
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          style={{ animation: "var(--animate-fade-in-up)", animationDelay: "400ms" }}
        >
          {/* Active Directives */}
          <div className="rounded-2xl border border-border/40 bg-card/30 p-6 hover:border-border/60 hover:bg-card/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-semibold">Active Directives</h3>
              <a className="text-sm text-[oklch(0.82_0.15_200)] hover:underline cursor-pointer hover:text-[oklch(0.88_0.15_200)] transition-colors duration-200">View All ›</a>
            </div>
            <div className="space-y-4">
              <DirectiveCard
                Icon={Code2}
                title="Advanced Data Structures"
                sub="Module 4 • In Progress"
                pct={65}
                color="oklch(0.82 0.15 200)"
                delay={500}
              />
              <DirectiveCard
                Icon={BrainCircuit}
                title="Neural Net Architecture"
                sub="Module 2 • Scheduled"
                pct={12}
                color="oklch(0.65 0.22 305)"
                delay={650}
              />
            </div>
          </div>

          {/* Complexity Distribution */}
          <div className="rounded-2xl border border-border/40 bg-card/30 p-6 hover:border-border/60 hover:bg-card/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-semibold">Complexity Distribution</h3>
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </div>
            <ComplexityDistribution />
          </div>
        </section>
      </div>
    </AppShell>
  );
}

/* ── Completion Rate card content ─────────────────────────── */
function CompletionRateContent() {
  const count = useCountUp(78, 1400, 300);
  return (
    <div className="flex items-center gap-6">
      <div className="relative h-28 w-28 grid place-items-center shrink-0">
        <AnimatedRing pct={78} delay={300} />
        <div className="text-2xl font-semibold tabular-nums">
          {count}<span className="text-sm text-muted-foreground">%</span>
        </div>
      </div>
      <div>
        <div className="text-[oklch(0.82_0.15_200)] text-sm font-medium">↑ +12%</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
          vs Previous Epoch
        </div>
      </div>
    </div>
  );
}

/* ── Learning Velocity card content ───────────────────────── */
function LearningVelocityContent() {
  const count = useCountUp(2.4, 1200, 350, 1);
  const [bars, setBars] = useState([0, 0, 0, 0, 0, 0]);
  const targets = [30, 45, 55, 40, 70, 90];
  useEffect(() => {
    const timers = targets.map((h, i) =>
      setTimeout(() => setBars((prev) => {
        const next = [...prev];
        next[i] = h;
        return next;
      }), 400 + i * 90)
    );
    return () => timers.forEach(clearTimeout);
  }, []);
  return (
    <>
      <div className="flex items-end gap-1 mb-4">
        <div className="text-4xl font-semibold tabular-nums">{count}</div>
        <div className="text-sm text-muted-foreground mb-1.5">nodes / hr</div>
      </div>
      <div className="flex items-end gap-1.5 h-16">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-md"
            style={{
              height: `${h}%`,
              background: i >= 3 ? "oklch(0.65 0.22 305)" : "oklch(0.26 0.02 260)",
              boxShadow: i >= 3 ? `0 0 10px oklch(0.65 0.22 305 / 0.55)` : "none",
              transition: `height 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${i * 80}ms`,
            }}
          />
        ))}
      </div>
    </>
  );
}

/* ── Directive card with animated progress bar ────────────── */
function DirectiveCard({
  Icon, title, sub, pct, color, delay,
}: {
  Icon: typeof Code2; title: string; sub: string; pct: number; color: string; delay: number;
}) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay + 100);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div className="rounded-xl border border-border/40 bg-card/30 p-4 hover:bg-card/50 hover:-translate-y-[1px] hover:border-border/60 transition-all duration-250 cursor-default">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="h-10 w-10 rounded-xl grid place-items-center shrink-0"
          style={{ background: `color-mix(in oklab, ${color} 15%, transparent)` }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">{title}</div>
          <div className="text-xs text-muted-foreground">{sub}</div>
        </div>
        <div
          className="px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 tabular-nums"
          style={{
            background: `color-mix(in oklab, ${color} 15%, transparent)`,
            color,
          }}
        >
          {pct}%
        </div>
      </div>
      <div className="h-1 rounded-full bg-secondary/60 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            background: color,
            boxShadow: `0 0 8px ${color.replace(")", " / 0.5)")}`,
            transition: `width 1.3s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

/* ── Complexity Distribution with staggered reveal ─────────  */
function ComplexityDistribution() {
  const segments = [
    { label: "Foundational", pct: 20, color: "oklch(0.82 0.15 200)" },
    { label: "Intermediate", pct: 45, color: "oklch(0.7 0.08 200)" },
    { label: "Advanced",     pct: 25, color: "oklch(0.65 0.18 305)" },
    { label: "Expert",       pct: 10, color: "oklch(0.65 0.15 30)" },
  ];
  const [widths, setWidths] = useState(segments.map(() => 0));
  useEffect(() => {
    const t = setTimeout(() => setWidths(segments.map((s) => s.pct)), 600);
    return () => clearTimeout(t);
  }, []);
  return (
    <>
      <div className="flex h-4 rounded-full overflow-hidden gap-px">
        {segments.map((seg, i) => (
          <div
            key={i}
            className="rounded-full first:rounded-l-full last:rounded-r-full hover:brightness-110 transition-all duration-300"
            style={{
              width: `${widths[i]}%`,
              background: seg.color,
              transition: `width 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${i * 80 + 600}ms`,
              boxShadow: `0 0 6px ${seg.color.replace(")", " / 0.4)")}`,
            }}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 mt-5 text-xs">
        {segments.map((seg, i) => (
          <div
            key={seg.label}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200 cursor-default"
            style={{ animation: "var(--animate-fade-in-up)", animationDelay: `${600 + i * 70}ms` }}
          >
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ background: seg.color, boxShadow: `0 0 5px ${seg.color.replace(")", " / 0.5)")}` }}
            />
            <div>
              <div className="font-medium">{seg.label}</div>
              <div className="text-muted-foreground">({seg.pct}%)</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ── MetricCard wrapper ─────────────────────────────────────  */
function MetricCard({
  title, Icon, children, delay = 0,
}: {
  title: string; Icon: typeof Gauge; children: React.ReactNode; delay?: number;
}) {
  return (
    <div
      className="rounded-2xl border border-border/40 bg-card/30 p-6 hover:-translate-y-1 hover:border-[oklch(0.82_0.15_200/0.35)] hover:shadow-[0_8px_30px_oklch(0.82_0.15_200/0.12)] transition-all duration-350 cursor-default"
      style={{ animation: "var(--animate-fade-in-up)", animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      {children}
    </div>
  );
}

/* ── Animated SVG trajectory chart ─────────────────────────  */
function TrajectoryChart() {
  const actualPath = "M 0 210 C 80 200, 140 170, 220 150 S 360 70, 460 50 S 560 30, 600 25";
  const expectedPath = "M 0 200 C 100 195, 180 180, 260 150 S 460 90, 600 80";
  const areaPath = "M 0 210 C 80 200, 140 170, 220 150 S 360 70, 460 50 S 560 30, 600 25 L 600 240 L 0 240 Z";

  const actualRef = useRef<SVGPathElement>(null);
  const [actualLen, setActualLen] = useState(0);
  const [drawn, setDrawn] = useState(0);
  const [areaOpacity, setAreaOpacity] = useState(0);
  const [dotsVisible, setDotsVisible] = useState(false);

  // Pulsing dot state
  const [pulse, setPulse] = useState(1);
  useEffect(() => {
    if (!dotsVisible) return;
    const interval = setInterval(() => {
      setPulse((p) => (p === 1 ? 1.6 : 1));
    }, 900);
    return () => clearInterval(interval);
  }, [dotsVisible]);

  useEffect(() => {
    if (actualRef.current) {
      const len = actualRef.current.getTotalLength();
      setActualLen(len);
      // Start animation chain
      setTimeout(() => {
        setDrawn(len);
        setAreaOpacity(0.22);
      }, 300);
      setTimeout(() => setDotsVisible(true), 1400);
    }
  }, []);

  const dataPoints: [number, number][] = [[220, 150], [460, 50], [600, 25]];
  const labels = ["Week 2", "Week 4", "Week 6"];

  return (
    <div className="relative w-full" style={{ height: 260 }}>
      <svg viewBox="0 0 600 240" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.82 0.15 200)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="oklch(0.82 0.15 200)" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {[40, 100, 160, 220].map((y) => (
          <line key={y} x1="0" y1={y} x2="600" y2={y}
            stroke="oklch(0.28 0.015 260)" strokeDasharray="3 8" strokeWidth="0.8" />
        ))}

        {/* Y-axis labels */}
        {[
          [40, "High"],
          [130, "Med"],
          [220, "Low"],
        ].map(([y, lbl]) => (
          <text key={lbl as string} x="4" y={Number(y) - 4}
            fill="oklch(0.5 0.015 260)" fontSize="9" fontFamily="system-ui">
            {lbl as string}
          </text>
        ))}

        {/* Area fill */}
        <path
          d={areaPath}
          fill="url(#areaGrad)"
          style={{ opacity: areaOpacity, transition: "opacity 0.8s ease 0.6s" }}
        />

        {/* Expected dashed line */}
        <path
          d={expectedPath}
          fill="none"
          stroke="oklch(0.65 0.22 305)"
          strokeWidth="1.8"
          strokeDasharray="6 6"
          opacity="0.7"
        />

        {/* Actual animated line */}
        <path
          ref={actualRef}
          d={actualPath}
          fill="none"
          stroke="oklch(0.82 0.15 200)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#glow)"
          strokeDasharray={actualLen || 1200}
          strokeDashoffset={actualLen > 0 ? actualLen - drawn : 1200}
          style={{ transition: `stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.3s` }}
        />

        {/* Data points with pulsing rings */}
        {dotsVisible && dataPoints.map(([cx, cy], i) => (
          <g key={i}>
            {/* Outer pulse ring */}
            <circle cx={cx} cy={cy} r={8 * pulse} fill="none"
              stroke="oklch(0.82 0.15 200)" strokeWidth="0.8" opacity="0.35"
              style={{ transition: "r 0.8s ease" }} />
            {/* Inner dot */}
            <circle cx={cx} cy={cy} r="4.5"
              fill="oklch(0.14 0.012 260)"
              stroke="oklch(0.82 0.15 200)" strokeWidth="2"
              filter="url(#glow)"
              style={{ animation: `var(--animate-scale-in)`, animationDelay: `${i * 150}ms` }} />
            {/* Label */}
            <text x={cx} y={cy - 14} textAnchor="middle"
              fill="oklch(0.82 0.15 200)" fontSize="9" fontFamily="system-ui">
              {labels[i]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}