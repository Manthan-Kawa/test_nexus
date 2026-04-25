import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CheckCircle2, Zap, Lock, BookOpen, X, ExternalLink, PlayCircle, FileText } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/templates/web-dev")({
  component: WebDevPage,
  head: () => ({
    meta: [
      { title: "Synapse — Web Development Path" },
      { name: "description", content: "The core path for modern web development mastery." },
    ],
  }),
});

type Status = "mastered" | "progress" | "locked";

type Module = {
  side: "left" | "right";
  tag: string;
  title: string;
  desc: string;
  status: Status;
  pct?: number;
  currentLesson?: string;
  lessons?: { title: string; done: boolean }[];
};

const initialModules: Module[] = [
  {
    side: "right",
    tag: "HTML",
    title: "HTML5 Foundations",
    desc: "Semantic markup, accessibility standards, and document structure.",
    status: "mastered",
    pct: 100,
  },
  {
    side: "left",
    tag: "CSS",
    title: "CSS Architecture",
    desc: "Flexbox, Grid, responsive design, and CSS variables.",
    status: "mastered",
    pct: 100,
  },
  {
    side: "right",
    tag: "JS",
    title: "JavaScript Core",
    desc: "DOM manipulation, ES6+ syntax, asynchronous programming, and API integration.",
    status: "progress",
    pct: 65,
    currentLesson: "Asynchronous Async/Await",
    lessons: [
      { title: "Variables & Data Types", done: true },
      { title: "Functions & Closures", done: true },
      { title: "DOM Manipulation", done: true },
      { title: "ES6+ Syntax", done: true },
      { title: "Asynchronous Async/Await", done: false },
      { title: "API Integration", done: false },
    ],
  },
  {
    side: "left",
    tag: "</>",
    title: "React Ecosystem",
    desc: "Component lifecycle, hooks, state management, and routing.",
    status: "locked",
  },
];

function statusStyle(status: Status) {
  if (status === "mastered")
    return { ring: "oklch(0.75 0.2 145)", glow: "0 0 35px oklch(0.75 0.2 145 / 0.5)" };
  if (status === "progress")
    return { ring: "oklch(0.82 0.18 90)", glow: "0 0 35px oklch(0.82 0.18 90 / 0.55)" };
  return { ring: "oklch(0.35 0.02 260)", glow: "none" };
}

function computeProgress(mods: Module[]) {
  const mastered = mods.filter((m) => m.status === "mastered").length;
  const inProgress = mods.find((m) => m.status === "progress");
  const progressContrib = inProgress?.pct ? (inProgress.pct / 100) : 0;
  return Math.round(((mastered + progressContrib) / mods.length) * 100);
}

function WebDevPage() {
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [completing, setCompleting] = useState(false);
  const [showBar, setShowBar] = useState(true);

  const progressPct = computeProgress(modules);
  const activeIdx = modules.findIndex((m) => m.status === "progress");
  const activeModule = activeIdx >= 0 ? modules[activeIdx] : null;

  // Auto-hide the bottom bar after 5 seconds
  useEffect(() => {
    if (!activeModule) return;
    setShowBar(true);
    const timer = setTimeout(() => setShowBar(false), 5000);
    return () => clearTimeout(timer);
  }, [activeIdx]);

  function handleCardClick(i: number) {
    if (modules[i].status === "progress") {
      setExpandedIdx(expandedIdx === i ? null : i);
    }
  }

  function handleToggleLesson(moduleIdx: number, lessonIdx: number) {
    setModules((prev) =>
      prev.map((m, mi) => {
        if (mi !== moduleIdx) return m;
        const updatedLessons = m.lessons!.map((l, li) =>
          li === lessonIdx ? { ...l, done: !l.done } : l
        );
        const donePct = Math.round(
          (updatedLessons.filter((l) => l.done).length / updatedLessons.length) * 100
        );
        const firstPending = updatedLessons.find((l) => !l.done);
        return {
          ...m,
          lessons: updatedLessons,
          pct: donePct,
          currentLesson: firstPending?.title ?? m.currentLesson,
        };
      })
    );
  }

  function handleMarkComplete() {
    if (activeIdx < 0) return;
    setCompleting(true);

    setTimeout(() => {
      setModules((prev) => {
        const next = prev.map((m, i) => {
          if (i === activeIdx) {
            // Mark current as mastered
            return { ...m, status: "mastered" as Status, pct: 100 };
          }
          if (i === activeIdx + 1 && m.status === "locked") {
            // Unlock next module as in-progress
            return {
              ...m,
              status: "progress" as Status,
              pct: 0,
              currentLesson: m.lessons?.[0]?.title ?? "Introduction",
              lessons: [
                { title: "Components & JSX", done: false },
                { title: "Props & State", done: false },
                { title: "useEffect & Hooks", done: false },
                { title: "React Router", done: false },
                { title: "State Management", done: false },
              ],
            };
          }
          return m;
        });
        return next;
      });
      setExpandedIdx(null);
      setCompleting(false);
    }, 800);
  }

  return (
    <AppShell title="Web Development">
      <div className="px-6 lg:px-10 py-8 pb-36 max-w-5xl mx-auto relative">
        {/* Breadcrumb */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/50 bg-card/40 text-xs text-muted-foreground mb-4"
          style={{ animation: "var(--animate-fade-in-up)", animationDelay: "0ms" }}
        >
          <span className="text-[oklch(0.82_0.15_200)]">⌘</span> CORE PATH
        </div>
        <h1
          className="text-5xl font-semibold tracking-tight"
          style={{ animation: "var(--animate-fade-in-up)", animationDelay: "60ms" }}
        >
          Web Development
        </h1>

        {/* Progress bar */}
        <div
          className="mt-8 mb-12"
          style={{ animation: "var(--animate-fade-in-up)", animationDelay: "120ms" }}
        >
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="text-[oklch(0.82_0.15_200)] font-medium transition-all duration-700">{progressPct}%</span>
          </div>
          <div className="h-2 rounded-full bg-secondary/60 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPct}%`, backgroundImage: "var(--gradient-brand)" }}
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center spine */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: "linear-gradient(180deg, oklch(0.82 0.15 200 / 0.6), oklch(0.65 0.22 305 / 0.4))" }}
          />

          <div className="flex flex-col gap-16">
            {modules.map((m, i) => {
              const s = statusStyle(m.status);
              const isExpanded = expandedIdx === i;
              return (
                <div
                  key={i}
                  className="relative grid grid-cols-2 gap-8 items-center"
                  style={{ animation: "var(--animate-fade-in-up)", animationDelay: `${180 + i * 80}ms` }}
                >
                  {/* Node dot */}
                  <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full z-10 transition-all duration-500"
                    style={{
                      background: s.ring,
                      boxShadow: `0 0 12px ${s.ring}`,
                      transform: isExpanded
                        ? "translate(-50%, -50%) scale(1.5)"
                        : "translate(-50%, -50%) scale(1)",
                    }}
                  />

                  {m.side === "left" ? (
                    <>
                      <ModuleCard
                        m={m}
                        s={s}
                        isExpanded={isExpanded}
                        onClick={() => handleCardClick(i)}
                        onMarkComplete={handleMarkComplete}
                        completing={completing}
                        onToggleLesson={(li) => handleToggleLesson(i, li)}
                      />
                      <div />
                    </>
                  ) : (
                    <>
                      <div />
                      <ModuleCard
                        m={m}
                        s={s}
                        isExpanded={isExpanded}
                        onClick={() => handleCardClick(i)}
                        onMarkComplete={handleMarkComplete}
                        completing={completing}
                        onToggleLesson={(li) => handleToggleLesson(i, li)}
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom current module bar — shows for 5s then hides, only when NOT expanded */}
        {activeModule && expandedIdx === null && showBar && (
          <div
            className="fixed bottom-6 left-6 right-6 lg:left-[20rem] lg:right-10 rounded-2xl border border-[oklch(0.82_0.15_200/0.4)] bg-card/80 backdrop-blur p-4 flex items-center gap-4 transition-all duration-400"
            onMouseEnter={() => setShowBar(true)}
            style={{
              boxShadow: "0 0 30px oklch(0.82 0.15 200 / 0.25)",
              animation: "var(--animate-fade-in-up)",
            }}
          >
            <div
              className="h-12 w-12 rounded-full grid place-items-center shrink-0"
              style={{ background: "color-mix(in oklab, oklch(0.82 0.15 200) 18%, transparent)" }}
            >
              <BookOpen className="h-5 w-5 text-[oklch(0.82_0.15_200)]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold">{activeModule.title}</div>
              <div className="text-xs text-muted-foreground truncate">
                Currently studying: {activeModule.currentLesson}
              </div>
            </div>
            <button
              onClick={() => {
                const idx = modules.findIndex((m) => m.status === "progress");
                if (idx >= 0) setExpandedIdx(idx);
              }}
              className="h-10 px-4 rounded-lg text-sm font-semibold text-background flex items-center gap-2 transition-all duration-300 hover:-translate-y-[1px] active:scale-[0.97]"
              style={{ backgroundImage: "var(--gradient-brand)", boxShadow: "var(--shadow-glow)" }}
            >
              <CheckCircle2 className="h-4 w-4" /> Mark Complete
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function ModuleCard({
  m,
  s,
  isExpanded,
  onClick,
  onMarkComplete,
  completing,
  onToggleLesson,
}: {
  m: Module;
  s: { ring: string; glow: string };
  isExpanded: boolean;
  onClick: () => void;
  onMarkComplete: () => void;
  completing: boolean;
  onToggleLesson: (lessonIdx: number) => void;
}) {
  const isLocked = m.status === "locked";
  const isProgress = m.status === "progress";
  const isMastered = m.status === "mastered";

  return (
    <div className="flex flex-col gap-3">
      {/* Main card */}
      <div
        onClick={isProgress ? onClick : undefined}
        className={`rounded-2xl p-6 border transition-all duration-350 ${
          isLocked
            ? "opacity-60 cursor-default"
            : isProgress
            ? "cursor-pointer hover:-translate-y-1.5"
            : "cursor-default hover:-translate-y-1"
        } ${isExpanded ? "-translate-y-1.5" : ""}`}
        style={{
          borderColor: s.ring,
          background: isLocked
            ? "oklch(0.19 0.012 260)"
            : `color-mix(in oklab, ${s.ring} 10%, oklch(0.19 0.012 260))`,
          boxShadow: isExpanded
            ? `0 0 50px ${s.ring.replace(")", " / 0.65)")}, 0 20px 40px oklch(0 0 0 / 0.4)`
            : s.glow,
          transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
          animation: isProgress && !isExpanded ? "var(--animate-pulse-ring)" : undefined,
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div
            className="h-11 w-11 rounded-lg grid place-items-center text-xs font-bold transition-transform duration-200 hover:scale-105"
            style={{
              background: `color-mix(in oklab, ${s.ring} 18%, transparent)`,
              color: s.ring,
            }}
          >
            {m.tag}
          </div>
          {isMastered && (
            <span
              className="px-3 py-1 rounded-full text-xs flex items-center gap-1.5 border"
              style={{
                borderColor: "oklch(0.75 0.2 145 / 0.5)",
                color: "oklch(0.75 0.2 145)",
                background: "color-mix(in oklab, oklch(0.75 0.2 145) 10%, transparent)",
              }}
            >
              <CheckCircle2 className="h-3 w-3" /> Mastered
            </span>
          )}
          {isProgress && (
            <span
              className={`px-3 py-1 rounded-full text-xs flex items-center gap-1.5 border transition-all duration-200 ${isExpanded ? "scale-105" : ""}`}
              style={{
                borderColor: `${s.ring.replace(")", " / 0.5)")}`,
                color: s.ring,
                background: `color-mix(in oklab, ${s.ring} 10%, transparent)`,
              }}
            >
              <Zap className="h-3 w-3" /> In Progress
            </span>
          )}
          {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
        </div>
        <h3 className="text-xl font-semibold">{m.title}</h3>
        <p className="text-sm text-muted-foreground mt-2">{m.desc}</p>

        {isProgress && m.pct !== undefined && (
          <div className="mt-4">
            <div className="h-1 rounded-full bg-secondary/60 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${m.pct}%`, background: s.ring }}
              />
            </div>
            <div className="mt-2 text-right text-xs" style={{ color: s.ring }}>
              {m.pct}% Modules Complete
            </div>
          </div>
        )}


      </div>

      {/* Expanded detail panel — only renders when clicked */}
      {isExpanded && (
        <div
          className="rounded-2xl border bg-card/60 backdrop-blur overflow-hidden"
          style={{
            borderColor: `${s.ring.replace(")", " / 0.4)")}`,
            boxShadow: `0 0 40px ${s.ring.replace(")", " / 0.2)")}`,
            animation: "var(--animate-fade-in-up)",
          }}
        >
          {/* Panel header */}
          <div
            className="px-5 py-4 flex items-center justify-between border-b"
            style={{ borderColor: `${s.ring.replace(")", " / 0.2)")}` }}
          >
            <div className="flex items-center gap-2">
              <PlayCircle className="h-4 w-4" style={{ color: s.ring }} />
              <span className="font-semibold text-sm">Module Lessons</span>
            </div>
            <button
              onClick={onClick}
              className="h-7 w-7 rounded-full grid place-items-center text-muted-foreground hover:text-foreground hover:bg-card/60 transition-all duration-200 active:scale-90"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Lesson list */}
          <div className="p-4 space-y-2">
            {m.lessons?.map((lesson, li) => (
              <div
                key={li}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-card/80"
                style={{ animation: `var(--animate-fade-in-up)`, animationDelay: `${li * 50}ms` }}
              >
                <div
                  onClick={() => onToggleLesson(li)}
                  className="h-5 w-5 rounded-full grid place-items-center shrink-0 transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95"
                  style={{
                    background: lesson.done
                      ? "color-mix(in oklab, oklch(0.75 0.2 145) 20%, transparent)"
                      : "color-mix(in oklab, oklch(0.35 0.02 260) 40%, transparent)",
                    border: lesson.done
                      ? "1.5px solid oklch(0.75 0.2 145)"
                      : `1.5px solid ${s.ring.replace(")", " / 0.6)")}`,
                  }}
                >
                  {lesson.done && <CheckCircle2 className="h-3 w-3" style={{ color: "oklch(0.75 0.2 145)" }} />}
                </div>
                <span
                  className={`text-sm transition-colors duration-200 ${
                    lesson.done
                      ? "text-muted-foreground line-through"
                      : !lesson.done && m.lessons?.filter((l) => !l.done)[0]?.title === lesson.title
                      ? "text-foreground font-medium"
                      : "text-muted-foreground/70"
                  }`}
                >
                  {lesson.title}
                </span>
                {!lesson.done && m.lessons?.filter((l) => !l.done)[0]?.title === lesson.title && (
                  <span
                    className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: `color-mix(in oklab, ${s.ring} 15%, transparent)`,
                      color: s.ring,
                    }}
                  >
                    Current
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Resources + Mark Complete */}
          <div
            className="px-5 py-4 flex items-center justify-between gap-3 border-t"
            style={{ borderColor: `${s.ring.replace(")", " / 0.15)")}` }}
          >
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:gap-2.5">
              <FileText className="h-4 w-4" />
              Resources
              <ExternalLink className="h-3 w-3 opacity-60" />
            </button>

            <button
              onClick={onMarkComplete}
              disabled={completing || m.lessons?.some((l) => !l.done)}
              className="h-10 px-5 rounded-xl text-sm font-semibold text-background flex items-center gap-2 transition-all duration-300 hover:-translate-y-[1px] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "oklch(0.75 0.2 145)",
                boxShadow: completing || m.lessons?.some((l) => !l.done)
                  ? "none"
                  : "0 0 30px oklch(0.75 0.2 145 / 0.45)",
              }}
            >
              {completing ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Completing…
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Mark Complete
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}