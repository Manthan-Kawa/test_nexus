import { createFileRoute, useParams } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  GraduationCap, CheckCircle2, Lock, Check, X, PlayCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getEnrolled, saveEnrolled, type EnrolledCourse, type CourseModule } from "@/lib/courseStore";

export const Route = createFileRoute("/templates/course/$id")({
  component: CoursePage,
  head: () => ({
    meta: [{ title: "Synapse — Course" }],
  }),
});

// ── Status helpers ────────────────────────────────────────────────
type Status = CourseModule["status"];

function palette(status: Status) {
  if (status === "completed")
    return { ring: "oklch(0.75 0.2 145)", glow: "0 0 35px oklch(0.75 0.2 145 / 0.5)" };
  if (status === "progress")
    return { ring: "oklch(0.82 0.18 90)", glow: "0 0 35px oklch(0.82 0.18 90 / 0.55)" };
  return { ring: "oklch(0.35 0.02 260)", glow: "none" };
}

function computeProgress(modules: CourseModule[]) {
  const completed = modules.filter((m) => m.status === "completed").length;
  const inProgress = modules.find((m) => m.status === "progress");
  const contrib = inProgress?.pct ? inProgress.pct / 100 : 0;
  return Math.round(((completed + contrib) / modules.length) * 100);
}

// ── Page ─────────────────────────────────────────────────────────
function CoursePage() {
  const { id } = useParams({ from: "/templates/course/$id" });
  const [course, setCourse] = useState<EnrolledCourse | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [completing, setCompleting] = useState(false);
  const [showBar, setShowBar] = useState(true);

  useEffect(() => {
    const found = getEnrolled().find((c) => c.id === id) ?? null;
    setCourse(found);
  }, [id]);

  // Auto-hide bottom bar
  const activeIdx = course?.modules.findIndex((m) => m.status === "progress") ?? -1;
  useEffect(() => {
    if (!course || activeIdx < 0) return;
    setShowBar(true);
    const t = setTimeout(() => setShowBar(false), 5000);
    return () => clearTimeout(t);
  }, [activeIdx, id]);

  if (!course) {
    return (
      <AppShell title="Course">
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Course not found. Enrol from the Add Skill page.
        </div>
      </AppShell>
    );
  }

  const modules = course.modules;
  const progressPct = computeProgress(modules);
  const activeModule = activeIdx >= 0 ? modules[activeIdx] : null;

  // ── Persist helper ──────────────────────────────────────────
  function persist(updated: CourseModule[]) {
    const all = getEnrolled().map((c) =>
      c.id === course.id ? { ...c, modules: updated } : c
    );
    saveEnrolled(all);
    setCourse((prev) => prev ? { ...prev, modules: updated } : prev);
  }

  function handleToggleLesson(modIdx: number, lessonIdx: number) {
    const updated = modules.map((m, mi) => {
      if (mi !== modIdx) return m;
      const lessons = m.lessons.map((l, li) =>
        li === lessonIdx ? { ...l, done: !l.done } : l
      );
      const pct = Math.round(lessons.filter((l) => l.done).length / lessons.length * 100);
      const firstPending = lessons.find((l) => !l.done);
      return { ...m, lessons, pct, currentLesson: firstPending?.title ?? m.currentLesson };
    });
    persist(updated);
  }

  function handleMarkComplete() {
    if (activeIdx < 0) return;
    setCompleting(true);
    setTimeout(() => {
      const updated = modules.map((m, i) => {
        if (i === activeIdx) return { ...m, status: "completed" as Status, pct: 100 };
        if (i === activeIdx + 1 && m.status === "locked")
          return { ...m, status: "progress" as Status, pct: 0, currentLesson: m.lessons[0]?.title ?? "" };
        return m;
      });
      persist(updated);
      setExpandedIdx(null);
      setCompleting(false);
    }, 800);
  }

  return (
    <AppShell title={course.shortLabel}>
      <div className="px-6 lg:px-10 py-8 pb-36 max-w-6xl mx-auto relative">

        {/* Header */}
        <div className="mb-10" style={{ animation: "var(--animate-fade-in-up)" }}>
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/50 bg-card/40 text-xs mb-5"
            style={{ color: course.accent }}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            {course.tag}
          </div>
          <h1 className="text-5xl font-semibold tracking-tight">{course.title}</h1>
          <div className="mt-8 max-w-lg">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium" style={{ color: course.accent }}>{progressPct}%</span>
            </div>
            <div className="h-2 rounded-full bg-secondary/60 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPct}%`, backgroundImage: "var(--gradient-brand)" }}
              />
            </div>
          </div>
        </div>

        {/* Module bubble row */}
        <div className="overflow-x-auto pb-6" style={{ animation: "var(--animate-fade-in-up)", animationDelay: "120ms" }}>
          <div className="flex items-center gap-0 min-w-max px-6 py-6">
            {modules.map((m, i) => {
              const p = palette(m.status);
              const isExpanded = expandedIdx === i;
              return (
                <div key={i} className="flex items-center">
                  {/* Bubble */}
                  <div
                    className={`flex flex-col items-center gap-3 transition-all duration-300 ${m.status === "progress" ? "cursor-pointer" : "cursor-default"}`}
                    onClick={() => m.status === "progress" && setExpandedIdx(isExpanded ? null : i)}
                  >
                    <div className="relative">
                      <div
                        className={`h-32 w-32 rounded-2xl grid place-items-center border-2 transition-all duration-350 ${
                          m.status === "locked" ? "opacity-55" : ""
                        } ${m.status === "progress" ? "hover:-translate-y-1.5 hover:scale-105" : "hover:-translate-y-1 hover:scale-[1.03]"} ${isExpanded ? "-translate-y-1.5 scale-105" : ""}`}
                        style={{
                          borderColor: p.ring,
                          background: m.status === "locked"
                            ? "oklch(0.2 0.015 260)"
                            : `color-mix(in oklab, ${p.ring} 14%, oklch(0.18 0.015 260))`,
                          boxShadow: isExpanded ? `0 0 50px ${p.ring.replace(")", " / 0.7)")}, 0 16px 32px oklch(0 0 0 / 0.3)` : p.glow,
                          transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                          animation: m.status === "progress" && !isExpanded ? "var(--animate-pulse-ring)" : undefined,
                        }}
                      >
                        <span className="text-2xl font-bold" style={{ color: p.ring }}>
                          {i + 1}
                        </span>
                      </div>
                      {m.status === "completed" && (
                        <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full grid place-items-center bg-card border-2" style={{ borderColor: p.ring }}>
                          <Check className="h-3 w-3" style={{ color: p.ring }} />
                        </div>
                      )}
                      {m.status === "locked" && (
                        <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full grid place-items-center bg-card border border-border/60">
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-center max-w-[9rem] leading-tight" style={m.status === "progress" ? { color: p.ring } : {}}>
                      {m.label}
                    </div>
                    <div className="text-[10px] tracking-widest uppercase text-muted-foreground/70">
                      {m.status === "completed" ? "Completed" : m.status === "progress" ? "In Progress" : "Locked"}
                    </div>
                  </div>

                  {/* Connector */}
                  {i < modules.length - 1 && (
                    <div className="w-20 h-px shrink-0 transition-all duration-700"
                      style={{ background: modules[i].status === "completed" ? "linear-gradient(90deg, oklch(0.75 0.2 145), oklch(0.82 0.15 200))" : "oklch(0.3 0.02 260)" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Expanded panel — below bubble row */}
        {expandedIdx !== null && (() => {
          const m = modules[expandedIdx];
          const p = palette(m.status);
          return (
            <div className="mt-6 rounded-2xl border bg-card/70 backdrop-blur overflow-hidden"
              style={{ borderColor: `${p.ring.replace(")", " / 0.4)")}`, boxShadow: `0 0 50px ${p.ring.replace(")", " / 0.15)")}`, animation: "var(--animate-fade-in-up)" }}>
              <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: `${p.ring.replace(")", " / 0.2)")}` }}>
                <div className="flex items-center gap-3">
                  <PlayCircle className="h-5 w-5" style={{ color: p.ring }} />
                  <span className="font-semibold text-base">{m.label} — Lessons</span>
                </div>
                <button onClick={() => setExpandedIdx(null)} className="h-8 w-8 rounded-full grid place-items-center text-muted-foreground hover:text-foreground hover:bg-card/60 transition-all duration-200 active:scale-90">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {m.lessons.map((lesson, li) => {
                  const isCurrent = !lesson.done && m.lessons.filter((l) => !l.done)[0]?.title === lesson.title;
                  return (
                    <div key={li} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card/40 hover:bg-card/70 transition-all duration-200"
                      style={{ animation: "var(--animate-fade-in-up)", animationDelay: `${li * 40}ms`, border: isCurrent ? `1px solid ${p.ring.replace(")", " / 0.35)")}` : "1px solid transparent" }}>
                      <div
                        onClick={() => handleToggleLesson(expandedIdx, li)}
                        className="h-6 w-6 rounded-full grid place-items-center shrink-0 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200"
                        style={{ background: lesson.done ? "color-mix(in oklab, oklch(0.75 0.2 145) 20%, transparent)" : "color-mix(in oklab, oklch(0.35 0.02 260) 40%, transparent)", border: lesson.done ? "1.5px solid oklch(0.75 0.2 145)" : `1.5px solid ${p.ring.replace(")", " / 0.6)")}` }}
                      >
                        {lesson.done && <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "oklch(0.75 0.2 145)" }} />}
                      </div>
                      <span className={`text-sm flex-1 transition-colors duration-200 ${lesson.done ? "text-muted-foreground line-through" : isCurrent ? "text-foreground font-medium" : "text-muted-foreground/80"}`}>
                        {lesson.title}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0" style={{ background: `color-mix(in oklab, ${p.ring} 15%, transparent)`, color: p.ring }}>
                          Current
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="px-6 py-4 flex items-center justify-end border-t" style={{ borderColor: `${p.ring.replace(")", " / 0.15)")}` }}>
                <button
                  onClick={handleMarkComplete}
                  disabled={completing || m.lessons.some((l) => !l.done)}
                  className="h-10 px-6 rounded-xl text-sm font-semibold text-background flex items-center gap-2 transition-all duration-300 hover:-translate-y-[1px] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "oklch(0.75 0.2 145)", boxShadow: completing || m.lessons.some((l) => !l.done) ? "none" : "0 0 24px oklch(0.75 0.2 145 / 0.45)" }}
                >
                  {completing ? (
                    <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Completing…</>
                  ) : (
                    <><CheckCircle2 className="h-4 w-4" /> Mark Complete</>
                  )}
                </button>
              </div>
            </div>
          );
        })()}

        {/* Auto-hide bottom bar */}
        {activeModule && expandedIdx === null && showBar && (
          <div className="fixed bottom-6 left-6 right-6 lg:left-[20rem] lg:right-10 rounded-2xl border bg-card/80 backdrop-blur p-4 flex items-center gap-4"
            onMouseEnter={() => setShowBar(true)}
            style={{ borderColor: `${course.accent.replace(")", " / 0.4)")}`, boxShadow: `0 0 30px ${course.accent.replace(")", " / 0.2)")}`, animation: "var(--animate-fade-in-up)" }}>
            <div className="h-12 w-12 rounded-lg grid place-items-center shrink-0" style={{ background: `color-mix(in oklab, ${course.accent} 18%, transparent)` }}>
              <GraduationCap className="h-5 w-5" style={{ color: course.accent }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] tracking-[0.25em] uppercase" style={{ color: course.accent }}>Current Module</div>
              <div className="font-semibold mt-0.5">{activeModule.label}</div>
              <div className="text-xs text-muted-foreground truncate">Currently studying: {activeModule.currentLesson}</div>
            </div>
            <button onClick={() => setExpandedIdx(activeIdx)} className="h-10 px-4 rounded-lg text-sm font-semibold text-background flex items-center gap-2 transition-all duration-300 hover:-translate-y-[1px] active:scale-[0.97] shrink-0"
              style={{ backgroundImage: "var(--gradient-brand)", boxShadow: "var(--shadow-glow)" }}>
              <CheckCircle2 className="h-4 w-4" /> Mark Complete
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
