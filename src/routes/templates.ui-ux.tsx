import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Check, PenTool, Lock, Link2, Hand, Clock, FileText, CheckCircle2, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/templates/ui-ux")({
  component: UiUxPage,
  head: () => ({
    meta: [
      { title: "Synapse — UI/UX Design Track" },
      { name: "description", content: "Master interface and experience design fundamentals." },
    ],
  }),
});

const steps = [
  {
    icon: Check,
    label: "Design Principles",
    fullTitle: "Foundations of Design",
    desc: "Learn color theory, typography, layout grids, and the core principles of visual hierarchy.",
    status: "completed" as const,
    ring: "oklch(0.75 0.2 145)",
  },
  {
    icon: PenTool,
    label: "Figma Mastery",
    fullTitle: "Figma Mastery",
    desc: "Advanced component architecture, auto-layout paradigms, and design system integration within Figma.",
    status: "progress" as const,
    ring: "oklch(0.82 0.18 90)",
    pct: 55,
  },
  {
    icon: Hand,
    label: "Interaction Design",
    fullTitle: "Interaction Design",
    desc: "Craft meaningful micro-interactions, gesture patterns, and motion design for digital products.",
    status: "locked" as const,
    ring: "oklch(0.35 0.02 260)",
  },
  {
    icon: Link2,
    label: "Prototyping",
    fullTitle: "Rapid Prototyping",
    desc: "Build high-fidelity interactive prototypes and run usability tests to validate your designs.",
    status: "locked" as const,
    ring: "oklch(0.35 0.02 260)",
  },
];

function computeProgress() {
  const completed = steps.filter((s) => s.status === "completed").length;
  const inProgress = steps.find((s) => s.status === "progress");
  const contrib = inProgress?.pct ? inProgress.pct / 100 : 0;
  return Math.round(((completed + contrib) / steps.length) * 100);
}

function UiUxPage() {
  const progressPct = computeProgress();

  return (
    <AppShell title="UI/UX Design">
      <div className="px-6 lg:px-10 py-8 pb-36 max-w-6xl mx-auto relative">

        {/* ── Header — matches Data Science layout ── */}
        <div
          className="mb-10"
          style={{ animation: "var(--animate-fade-in-up)", animationDelay: "0ms" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/50 bg-card/40 text-xs text-[oklch(0.82_0.15_200)] mb-5">
            <GraduationCap className="h-3.5 w-3.5" />
            DESIGN TRACK
          </div>
          <h1 className="text-5xl font-semibold tracking-tight">UI/UX Design</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl text-base leading-relaxed">
            Master the principles of user interface and user experience design to build
            intuitive, engaging, and accessible digital products.
          </p>

          {/* Overall progress bar */}
          <div className="mt-8 max-w-lg">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="text-[oklch(0.82_0.15_200)] font-medium">{progressPct}%</span>
            </div>
            <div className="h-2 rounded-full bg-secondary/60 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPct}%`, backgroundImage: "var(--gradient-brand)" }}
              />
            </div>
          </div>
        </div>

        {/* ── Step grid ── */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-5"
          style={{ animation: "var(--animate-fade-in-up)", animationDelay: "120ms" }}
        >
          {steps.map((s, i) => (
            <StepCard key={s.label} step={s} delay={i * 60} />
          ))}
        </div>

        {/* ── Bottom info bar (static — no auto-hide on this page) ── */}
        <div
          className="fixed bottom-6 left-6 right-6 lg:left-[20rem] lg:right-10 rounded-2xl border border-[oklch(0.82_0.18_90/0.4)] bg-card/80 backdrop-blur p-5 flex flex-wrap items-center gap-5"
          style={{ boxShadow: "0 0 30px oklch(0.82 0.18 90 / 0.2)", animation: "var(--animate-fade-in-up)" }}
        >
          <div className="flex-1 min-w-[16rem]">
            <div className="font-semibold text-lg">Figma Mastery</div>
            <div className="text-sm text-muted-foreground mt-1">
              Learn advanced component architecture, auto-layout paradigms, and design system
              integration within Figma to streamline your workflow.
            </div>
            <div className="flex gap-5 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> 12 Hours Est.
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" /> 5 Exercises
              </span>
            </div>
          </div>
          <button
            className="h-11 px-6 rounded-lg text-sm font-semibold text-background flex items-center gap-2 shrink-0 transition-all duration-300 hover:-translate-y-[1px] active:scale-[0.97]"
            style={{ backgroundImage: "var(--gradient-brand)", boxShadow: "var(--shadow-glow)" }}
          >
            <CheckCircle2 className="h-4 w-4" /> MARK COMPLETE
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function StepCard({
  step,
  delay,
}: {
  step: typeof steps[number];
  delay: number;
}) {
  const isLocked = step.status === "locked";
  const isProgress = step.status === "progress";
  const isCompleted = step.status === "completed";

  return (
    <div
      className={`relative rounded-2xl border-2 p-6 flex flex-col items-center justify-center text-center transition-all duration-350 hover:-translate-y-1.5 ${
        isLocked ? "opacity-65 cursor-default" : "cursor-default"
      }`}
      style={{
        borderColor: step.ring,
        background: isLocked
          ? "oklch(0.19 0.012 260)"
          : `color-mix(in oklab, ${step.ring} 10%, oklch(0.19 0.012 260))`,
        boxShadow: isProgress
          ? undefined
          : `0 0 28px color-mix(in oklab, ${step.ring} 30%, transparent)`,
        animation: isProgress
          ? "var(--animate-pulse-ring)"
          : `var(--animate-fade-in-up)`,
        animationDelay: `${delay}ms`,
        minHeight: "220px",
      }}
    >
      {/* Icon circle */}
      <div
        className="h-20 w-20 rounded-full grid place-items-center mb-5 border-2 transition-transform duration-200 hover:scale-105"
        style={{
          borderColor: step.ring,
          background: `color-mix(in oklab, ${step.ring} 14%, transparent)`,
        }}
      >
        <step.icon className="h-8 w-8" style={{ color: step.ring }} />
      </div>

      {/* Label */}
      <div
        className="font-semibold text-lg mb-1"
        style={isProgress ? { color: step.ring } : {}}
      >
        {step.label}
      </div>

      {/* Desc */}
      <p className="text-xs text-muted-foreground/70 leading-relaxed line-clamp-2 mb-3 px-1">
        {step.desc}
      </p>

      {/* Status badge / progress bar */}
      {isCompleted && (
        <span
          className="text-[10px] tracking-[0.25em] px-3 py-1 rounded-full border"
          style={{
            borderColor: `${step.ring}60`,
            color: step.ring,
            background: `color-mix(in oklab, ${step.ring} 10%, transparent)`,
          }}
        >
          COMPLETED
        </span>
      )}
      {isProgress && (
        <div className="w-full px-1">
          <div className="text-[10px] tracking-[0.2em] mb-2 px-3 py-1 rounded-full border inline-block" style={{ borderColor: `${step.ring}60`, color: step.ring }}>
            IN PROGRESS
          </div>
          <div className="h-1.5 rounded-full bg-secondary/60 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${step.pct ?? 0}%`,
                background: step.ring,
                boxShadow: `0 0 6px ${step.ring}`,
              }}
            />
          </div>
        </div>
      )}
      {isLocked && (
        <span className="text-[10px] tracking-[0.25em] text-muted-foreground/60 flex items-center gap-1.5">
          <Lock className="h-3 w-3" /> LOCKED
        </span>
      )}
    </div>
  );
}