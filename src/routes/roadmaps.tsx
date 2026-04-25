import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Map, CheckCircle2, Circle, Clock } from "lucide-react";

export const Route = createFileRoute("/roadmaps")({
  component: RoadmapsPage,
  head: () => ({
    meta: [
      { title: "Synapse — My Roadmaps" },
      { name: "description", content: "Track and orchestrate your learning roadmaps." },
    ],
  }),
});

const roadmaps = [
  {
    title: "Frontend Architect",
    desc: "Master React, TanStack, and modern UI systems.",
    progress: 72,
    modules: 12,
    eta: "3 weeks",
    accent: "oklch(0.82 0.15 200)",
  },
  {
    title: "Neural Net Engineer",
    desc: "Deep learning, transformers, and inference optimization.",
    progress: 34,
    modules: 18,
    eta: "9 weeks",
    accent: "oklch(0.65 0.22 305)",
  },
  {
    title: "Distributed Systems",
    desc: "Consensus, sharding, and fault-tolerant pipelines.",
    progress: 56,
    modules: 14,
    eta: "5 weeks",
    accent: "oklch(0.75 0.18 50)",
  },
  {
    title: "Design Synthesis",
    desc: "From principles to production-grade design systems.",
    progress: 88,
    modules: 9,
    eta: "1 week",
    accent: "oklch(0.82 0.15 200)",
  },
];

function RoadmapsPage() {
  return (
    <AppShell title="Skill Architecture">
      <div className="px-6 lg:px-10 py-8 space-y-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">My Roadmaps</h1>
          <p className="text-muted-foreground mt-2">
            Curated learning trajectories powering your skill graph.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {roadmaps.map((r) => (
            <div
              key={r.title}
              className="rounded-2xl border border-border/40 bg-card/30 p-6 hover:bg-card/50 transition group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="h-12 w-12 rounded-xl grid place-items-center"
                  style={{ background: `color-mix(in oklab, ${r.accent} 18%, transparent)` }}
                >
                  <Map className="h-5 w-5" style={{ color: r.accent }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{r.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{r.desc}</p>
                </div>
                <div
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: `color-mix(in oklab, ${r.accent} 18%, transparent)`,
                    color: r.accent,
                  }}
                >
                  {r.progress}%
                </div>
              </div>

              <div className="h-1.5 rounded-full bg-secondary/60 overflow-hidden mb-4">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${r.progress}%`, background: r.accent, boxShadow: `0 0 10px ${r.accent}` }}
                />
              </div>

              <div className="flex items-center gap-5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {Math.round((r.progress / 100) * r.modules)}/{r.modules} modules
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  ETA {r.eta}
                </span>
                <span className="flex items-center gap-1.5">
                  <Circle className="h-3.5 w-3.5" />
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}