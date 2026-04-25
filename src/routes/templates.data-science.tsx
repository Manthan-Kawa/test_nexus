import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  GraduationCap,
  Code2,
  Table,
  Brain,
  GitBranch,
  Lock,
  Check,
  CheckCircle2,
  X,
  PlayCircle,
} from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/templates/data-science")({
  component: DataSciencePage,
  head: () => ({
    meta: [
      { title: "Synapse — Data Science Track" },
      { name: "description", content: "Specialization track for data manipulation, ML, and neural networks." },
    ],
  }),
});

type NodeStatus = "completed" | "progress" | "locked";

type DSNode = {
  icon: typeof Code2;
  label: string;
  fullTitle: string;
  desc: string;
  status: NodeStatus;
  pct?: number;
  currentLesson?: string;
  lessons?: { title: string; done: boolean }[];
};

const initialNodes: DSNode[] = [
  {
    icon: Code2,
    label: "Python Basics",
    fullTitle: "Python Basics",
    desc: "Core Python syntax, data types, control flow, functions, and OOP principles.",
    status: "completed",
    pct: 100,
  },
  {
    icon: Table,
    label: "Pandas & EDA",
    fullTitle: "Pandas & Exploratory Data Analysis",
    desc: "Learn to manipulate, clean, and analyze tabular data using Pandas DataFrames.",
    status: "progress",
    pct: 85,
    currentLesson: "Advanced GroupBy & Aggregations",
    lessons: [
      { title: "Series & DataFrames", done: true },
      { title: "Data Cleaning & Missing Values", done: true },
      { title: "Filtering & Indexing", done: true },
      { title: "Merge, Join & Concat", done: true },
      { title: "Advanced GroupBy & Aggregations", done: false },
      { title: "Visualization with Matplotlib", done: false },
    ],
  },
  {
    icon: Brain,
    label: "Machine Learning",
    fullTitle: "Machine Learning Fundamentals",
    desc: "Supervised and unsupervised learning, model evaluation, and scikit-learn pipelines.",
    status: "locked",
  },
  {
    icon: GitBranch,
    label: "Deep Learning",
    fullTitle: "Deep Learning & Neural Networks",
    desc: "Build and train neural networks using PyTorch, CNNs, RNNs, and transformers.",
    status: "locked",
  },
];

function palette(status: NodeStatus) {
  if (status === "completed")
    return { ring: "oklch(0.75 0.2 145)", glow: "0 0 35px oklch(0.75 0.2 145 / 0.5)" };
  if (status === "progress")
    return { ring: "oklch(0.82 0.18 90)", glow: "0 0 35px oklch(0.82 0.18 90 / 0.55)" };
  return { ring: "oklch(0.35 0.02 260)", glow: "none" };
}

function computeProgress(nodes: DSNode[]) {
  const completed = nodes.filter((n) => n.status === "completed").length;
  const inProgress = nodes.find((n) => n.status === "progress");
  const contrib = inProgress?.pct ? inProgress.pct / 100 : 0;
  return Math.round(((completed + contrib) / nodes.length) * 100);
}

function DataSciencePage() {
  const [nodes, setNodes] = useState<DSNode[]>(initialNodes);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [completing, setCompleting] = useState(false);
  const [showBar, setShowBar] = useState(true);

  const progressPct = computeProgress(nodes);
  const activeIdx = nodes.findIndex((n) => n.status === "progress");
  const activeNode = activeIdx >= 0 ? nodes[activeIdx] : null;

  // Auto-hide the bottom bar after 5 seconds
  useEffect(() => {
    if (!activeNode) return;
    setShowBar(true);
    const timer = setTimeout(() => setShowBar(false), 5000);
    return () => clearTimeout(timer);
  }, [activeIdx]);

  function handleBubbleClick(i: number) {
    if (nodes[i].status === "progress") {
      setExpandedIdx(expandedIdx === i ? null : i);
    }
  }

  function handleToggleLesson(nodeIdx: number, lessonIdx: number) {
    setNodes((prev) =>
      prev.map((n, ni) => {
        if (ni !== nodeIdx) return n;
        const updatedLessons = n.lessons!.map((l, li) =>
          li === lessonIdx ? { ...l, done: !l.done } : l
        );
        const donePct = Math.round(
          (updatedLessons.filter((l) => l.done).length / updatedLessons.length) * 100
        );
        const firstPending = updatedLessons.find((l) => !l.done);
        return {
          ...n,
          lessons: updatedLessons,
          pct: donePct,
          currentLesson: firstPending?.title ?? n.currentLesson,
        };
      })
    );
  }

  function handleMarkComplete() {
    if (activeIdx < 0) return;
    setCompleting(true);
    setTimeout(() => {
      setNodes((prev) =>
        prev.map((n, i) => {
          if (i === activeIdx) return { ...n, status: "completed" as NodeStatus, pct: 100 };
          if (i === activeIdx + 1 && n.status === "locked") {
            return {
              ...n,
              status: "progress" as NodeStatus,
              pct: 0,
              currentLesson: n.label === "Machine Learning" ? "Regression Fundamentals" : "Introduction to Neural Nets",
              lessons:
                n.label === "Machine Learning"
                  ? [
                      { title: "Regression Fundamentals", done: false },
                      { title: "Classification Algorithms", done: false },
                      { title: "Model Evaluation & Metrics", done: false },
                      { title: "Clustering & Dimensionality", done: false },
                      { title: "Scikit-learn Pipelines", done: false },
                    ]
                  : [
                      { title: "Introduction to Neural Nets", done: false },
                      { title: "Backpropagation", done: false },
                      { title: "CNNs & Computer Vision", done: false },
                      { title: "RNNs & Sequence Models", done: false },
                      { title: "Transformers & Attention", done: false },
                    ],
            };
          }
          return n;
        })
      );
      setExpandedIdx(null);
      setCompleting(false);
    }, 800);
  }

  return (
    <AppShell title="Data Science">
      <div className="px-6 lg:px-10 py-8 pb-36 max-w-6xl mx-auto relative">

        {/* ── Header ────────────────────────────────────────── */}
        <div
          className="mb-10"
          style={{ animation: "var(--animate-fade-in-up)", animationDelay: "0ms" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/50 bg-card/40 text-xs text-[oklch(0.82_0.15_200)] mb-5">
            <GraduationCap className="h-3.5 w-3.5" />
            SPECIALIZATION TRACK
          </div>
          <h1 className="text-5xl font-semibold tracking-tight">Data Science</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl text-base leading-relaxed">
            Master the foundations of data manipulation, machine learning, and neural networks
            to extract insights from complex datasets.
          </p>

          {/* Overall progress */}
          <div className="mt-8 max-w-lg">
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
        </div>

        {/* ── Node graph (bubble row) — header always stays above ── */}
        <div
          className="overflow-x-auto pb-6"
          style={{ animation: "var(--animate-fade-in-up)", animationDelay: "120ms" }}
        >
          <div className="flex items-center gap-0 min-w-max px-6 py-6">
            {nodes.map((n, i) => {
              const p = palette(n.status);
              const isExpanded = expandedIdx === i;
              return (
                <div key={n.label} className="flex items-center">
                  <NodeBubble
                    n={n}
                    p={p}
                    isExpanded={isExpanded}
                    onClick={() => handleBubbleClick(i)}
                  />
                  {/* Connector line */}
                  {i < nodes.length - 1 && (
                    <div
                      className="w-20 h-px shrink-0 transition-all duration-700"
                      style={{
                        background:
                          nodes[i].status === "completed"
                            ? "linear-gradient(90deg, oklch(0.75 0.2 145), oklch(0.82 0.15 200))"
                            : "oklch(0.3 0.02 260)",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Expanded detail panel — rendered BELOW the bubble row ── */}
        {expandedIdx !== null && (() => {
          const n = nodes[expandedIdx];
          const p = palette(n.status);
          return (
            <div
              className="mt-6 rounded-2xl border bg-card/70 backdrop-blur overflow-hidden"
              style={{
                borderColor: `${p.ring.replace(")", " / 0.4)")}`,
                boxShadow: `0 0 50px ${p.ring.replace(")", " / 0.15)")}`,
                animation: "var(--animate-fade-in-up)",
              }}
            >
              {/* Panel header */}
              <div
                className="px-6 py-4 flex items-center justify-between border-b"
                style={{ borderColor: `${p.ring.replace(")", " / 0.2)")}` }}
              >
                <div className="flex items-center gap-3">
                  <PlayCircle className="h-5 w-5" style={{ color: p.ring }} />
                  <span className="font-semibold text-base">{n.fullTitle} — Module Lessons</span>
                </div>
                <button
                  onClick={() => setExpandedIdx(null)}
                  className="h-8 w-8 rounded-full grid place-items-center text-muted-foreground hover:text-foreground hover:bg-card/60 transition-all duration-200 active:scale-90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Lessons grid — 3 cols on desktop */}
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {n.lessons?.map((lesson, li) => {
                  const isCurrentLesson =
                    !lesson.done &&
                    n.lessons?.filter((l) => !l.done)[0]?.title === lesson.title;
                  return (
                    <div
                      key={li}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card/40 hover:bg-card/70 transition-all duration-200"
                      style={{
                        animation: "var(--animate-fade-in-up)",
                        animationDelay: `${li * 40}ms`,
                        border: isCurrentLesson
                          ? `1px solid ${p.ring.replace(")", " / 0.35)")}`
                          : "1px solid transparent",
                      }}
                    >
                      <div
                        onClick={() => handleToggleLesson(expandedIdx, li)}
                        className="h-6 w-6 rounded-full grid place-items-center shrink-0 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200"
                        style={{
                          background: lesson.done
                            ? "color-mix(in oklab, oklch(0.75 0.2 145) 20%, transparent)"
                            : "color-mix(in oklab, oklch(0.35 0.02 260) 40%, transparent)",
                          border: lesson.done
                            ? "1.5px solid oklch(0.75 0.2 145)"
                            : `1.5px solid ${p.ring.replace(")", " / 0.6)")}`,
                        }}
                      >
                        {lesson.done && (
                          <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "oklch(0.75 0.2 145)" }} />
                        )}
                      </div>
                      <span
                        className={`text-sm flex-1 transition-colors duration-200 ${
                          lesson.done
                            ? "text-muted-foreground line-through"
                            : isCurrentLesson
                            ? "text-foreground font-medium"
                            : "text-muted-foreground/80"
                        }`}
                      >
                        {lesson.title}
                      </span>
                      {isCurrentLesson && (
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0"
                          style={{
                            background: `color-mix(in oklab, ${p.ring} 15%, transparent)`,
                            color: p.ring,
                          }}
                        >
                          Current
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div
                className="px-6 py-4 flex items-center justify-end border-t"
                style={{ borderColor: `${p.ring.replace(")", " / 0.15)")}` }}
              >
                <button
                  onClick={handleMarkComplete}
                  disabled={completing || n.lessons?.some((l) => !l.done)}
                  className="h-10 px-6 rounded-xl text-sm font-semibold text-background flex items-center gap-2 transition-all duration-300 hover:-translate-y-[1px] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "oklch(0.75 0.2 145)",
                    boxShadow: completing || n.lessons?.some((l) => !l.done)
                      ? "none"
                      : "0 0 24px oklch(0.75 0.2 145 / 0.45)",
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
          );
        })()}

        {/* ── Bottom bar — shows for 5s then hides, only when panel closed ── */}
        {activeNode && expandedIdx === null && showBar && (
          <div
            className="fixed bottom-6 left-6 right-6 lg:left-[20rem] lg:right-10 rounded-2xl border border-[oklch(0.82_0.15_200/0.4)] bg-card/80 backdrop-blur p-4 flex items-center gap-4"
            onMouseEnter={() => setShowBar(true)}
            style={{
              boxShadow: "0 0 30px oklch(0.82 0.15 200 / 0.25)",
              animation: "var(--animate-fade-in-up)",
            }}
          >
            <div
              className="h-12 w-12 rounded-lg grid place-items-center shrink-0"
              style={{ background: "color-mix(in oklab, oklch(0.82 0.15 200) 18%, transparent)" }}
            >
              <Table className="h-5 w-5 text-[oklch(0.82_0.15_200)]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] tracking-[0.25em] text-[oklch(0.82_0.15_200)] uppercase">
                Current Module
              </div>
              <div className="font-semibold mt-0.5">{activeNode.fullTitle}</div>
              <div className="text-xs text-muted-foreground truncate">
                Currently studying: {activeNode.currentLesson}
              </div>
            </div>
            <button
              onClick={() => setExpandedIdx(activeIdx)}
              className="h-10 px-4 rounded-lg text-sm font-semibold text-background flex items-center gap-2 transition-all duration-300 hover:-translate-y-[1px] active:scale-[0.97] shrink-0"
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

function NodeBubble({
  n,
  p,
  isExpanded,
  onClick,
}: {
  n: DSNode;
  p: { ring: string; glow: string };
  isExpanded: boolean;
  onClick: () => void;
}) {
  const isProgress = n.status === "progress";
  const isLocked = n.status === "locked";

  return (
    <div
      className={`flex flex-col items-center gap-3 transition-all duration-300 ${
        isProgress ? "cursor-pointer" : "cursor-default"
      }`}
      onClick={isProgress ? onClick : undefined}
    >
      <div className="relative">
        <div
          className={`h-32 w-32 rounded-2xl grid place-items-center border-2 transition-all duration-350 ${
            isLocked ? "opacity-55" : ""
          } ${isProgress ? "hover:-translate-y-1.5 hover:scale-105" : "hover:-translate-y-1 hover:scale-[1.03]"} ${
            isExpanded ? "-translate-y-1.5 scale-105" : ""
          }`}
          style={{
            borderColor: p.ring,
            background: isLocked
              ? "oklch(0.2 0.015 260)"
              : `color-mix(in oklab, ${p.ring} 14%, oklch(0.18 0.015 260))`,
            boxShadow: isExpanded
              ? `0 0 50px ${p.ring.replace(")", " / 0.7)")}, 0 16px 32px oklch(0 0 0 / 0.3)`
              : p.glow,
            transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
            animation: isProgress && !isExpanded ? "var(--animate-pulse-ring)" : undefined,
          }}
        >
          <n.icon className="h-12 w-12 transition-transform duration-200" style={{ color: p.ring }} />
        </div>

        {/* Completed checkmark badge */}
        {n.status === "completed" && (
          <div
            className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full grid place-items-center bg-card border-2 transition-transform duration-200 hover:scale-110"
            style={{ borderColor: p.ring }}
          >
            <Check className="h-3 w-3" style={{ color: p.ring }} />
          </div>
        )}

        {/* Locked badge */}
        {n.status === "locked" && (
          <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full grid place-items-center bg-card border border-border/60">
            <Lock className="h-3 w-3 text-muted-foreground" />
          </div>
        )}
      </div>

      <div
        className={`text-sm font-semibold transition-colors duration-200 ${
          n.status === "completed"
            ? "text-muted-foreground"
            : n.status === "progress"
            ? ""
            : "text-muted-foreground/60"
        }`}
        style={n.status === "progress" ? { color: p.ring } : {}}
      >
        {n.label}
      </div>

      <div className="text-[10px] tracking-widest uppercase text-muted-foreground/70">
        {n.status === "completed" ? "Completed" : n.status === "progress" ? "In Progress" : "Locked"}
      </div>
    </div>
  );
}