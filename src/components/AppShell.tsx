import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
import { SynapseLogo } from "@/components/SynapseLogo";
import {
  Settings,
  LayoutGrid,
  Map,
  Code2,
  Database,
  Plus,
  LogOut,
  Search,
  Bell,
  Flame,
  BookOpen,
  Sun,
  Moon,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { getEnrolled } from "@/lib/courseStore";

type NavDef = {
  icon: typeof Settings;
  label: string;
  to: "/dashboard" | "/roadmaps" | "/settings" | "/add-skill";
};

const navItems: NavDef[] = [
  { icon: LayoutGrid, label: "Dashboard", to: "/dashboard" },
  { icon: Map, label: "My Roadmaps", to: "/roadmaps" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

// Built-in tracks always visible in sidebar
const builtInTemplates = [
  { icon: Code2, label: "Web Dev", to: "/templates/web-dev" },
  { icon: Database, label: "Data Science", to: "/templates/data-science" },
];

export function AppShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  // ── Theme toggle ──────────────────────────────────────────────
  const [isLight, setIsLight] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("synapse_theme") === "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isLight) {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem("synapse_theme", isLight ? "light" : "dark");
  }, [isLight]);

  function toggleTheme() {
    setIsLight((v) => !v);
  }

  // Dynamically enrolled courses — re-reads whenever a course is added
  const [enrolled, setEnrolled] = useState(getEnrolled);
  useEffect(() => {
    const refresh = () => setEnrolled(getEnrolled());
    window.addEventListener("synapse:enrollment-changed", refresh);
    return () => window.removeEventListener("synapse:enrollment-changed", refresh);
  }, []);

  return (
    <div
      className="min-h-screen flex text-foreground"
      style={{ background: "var(--bg-app)" }}
    >
      {/* Sidebar */}
      <aside
        className="hidden md:flex w-72 flex-col gap-5 p-5 border-r border-border/40"
        style={{ background: "var(--bg-sidebar)" }}
      >
        {/* Logo — entrance */}
        <div className="px-2 pt-1" style={{ animation: "var(--animate-fade-in-up)", animationDelay: "0ms" }}>
          <SynapseLogo size="lg" />
        </div>

        {/* Profile card — entrance */}
        <div
          className="rounded-2xl border border-border/50 bg-card/40 p-3 flex items-center gap-3 hover:bg-card/60 transition-all duration-300 hover:border-border/70 cursor-default"
          style={{ animation: "var(--animate-fade-in-up)", animationDelay: "60ms" }}
        >
          <div
            className="h-12 w-12 rounded-full flex items-center justify-center text-background font-semibold ring-2 transition-transform duration-300 hover:scale-105"
            style={{
              backgroundImage: "var(--gradient-brand)",
              boxShadow: "0 0 0 2px oklch(0.82 0.15 200 / 0.4)",
            }}
          >
            JK
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Jas Kerawala</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              Level 42 Architect
            </div>
          </div>
        </div>

        {/* Main nav */}
        <nav
          className="flex flex-col gap-1"
          style={{ animation: "var(--animate-fade-in-up)", animationDelay: "120ms" }}
        >
          {navItems.map((n) => (
            <NavLink key={n.to} {...n} active={path.startsWith(n.to)} />
          ))}
        </nav>

        <div
          className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground/70 mt-2 px-3"
          style={{ animation: "var(--animate-fade-in)", animationDelay: "180ms" }}
        >
          Templates
        </div>

        <nav
          className="flex flex-col gap-1"
          style={{ animation: "var(--animate-fade-in-up)", animationDelay: "220ms" }}
        >
          {/* Built-in tracks */}
          {builtInTemplates.map((t) => (
            <Link
              key={t.label}
              to={t.to}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-card/40 hover:translate-x-1 transition-all duration-250 data-[status=active]:text-[oklch(0.82_0.15_200)] data-[status=active]:bg-card/70"
              activeProps={{ className: "text-[oklch(0.82_0.15_200)] bg-card/70" }}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </Link>
          ))}

          {/* Enrolled courses — dynamically added */}
          {enrolled.map((course) => (
            <Link
              key={course.id}
              to="/templates/course/$id"
              params={{ id: course.id }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-card/40 hover:translate-x-1 transition-all duration-250"
              activeProps={{ className: "text-[oklch(0.82_0.15_200)] bg-card/70" }}
              style={{ animation: "var(--animate-fade-in-up)" }}
            >
              <BookOpen className="h-4 w-4 shrink-0" style={{ color: course.accent }} />
              <span className="truncate">{course.shortLabel}</span>
            </Link>
          ))}
        </nav>

        {/* Progress widget */}
        <div
          className="mt-2 rounded-2xl border border-border/40 bg-card/30 p-4 hover:bg-card/50 transition-all duration-300"
          style={{ animation: "var(--animate-fade-in-up)", animationDelay: "280ms" }}
        >
          <div className="flex justify-between text-xs mb-2">
            <span className="text-muted-foreground">Total Progress</span>
            <span className="font-semibold text-[oklch(0.82_0.15_200)]">84%</span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary/60 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: "84%",
                backgroundImage: "var(--gradient-brand)",
                animation: "var(--animate-pulse-glow)",
              }}
            />
          </div>
        </div>

        {/* Add Skill CTA */}
        <Link
          to="/add-skill"
          className="h-12 rounded-xl text-background font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.97]"
          style={{
            backgroundImage: "var(--gradient-brand)",
            boxShadow: "var(--shadow-glow)",
            animation: "var(--animate-fade-in-up)",
            animationDelay: "320ms",
          }}
        >
          <Plus className="h-5 w-5 transition-transform duration-200 hover:rotate-90" /> Add New Skill
        </Link>

        {/* Logout */}
        <Link
          to="/"
          className="mt-auto flex items-center gap-3 px-3 py-3 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-card/30 transition-all duration-250 hover:translate-x-1"
          style={{ animation: "var(--animate-fade-in)", animationDelay: "360ms" }}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Link>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="h-20 px-6 lg:px-10 flex items-center gap-4 border-b border-border/30"
          style={{ animation: "var(--animate-fade-in)", animationDelay: "0ms" }}
        >
          <h2
            className="text-xl font-semibold tracking-wide bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-brand)" }}
          >
            {title}
          </h2>

          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-md relative group">
              <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-[oklch(0.82_0.15_200)]" />
              <input
                placeholder="Search architecture..."
                className="w-full h-11 rounded-full bg-card/60 border border-border/40 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[oklch(0.82_0.15_200/0.6)] focus:bg-card/80 focus:shadow-[0_0_0_3px_oklch(0.82_0.15_200/0.12)]"
              />
            </div>
          </div>

          {/* Theme toggle — Sun/Moon */}
          <button
            onClick={toggleTheme}
            title={isLight ? "Switch to Dark" : "Switch to Light"}
            className="relative h-10 w-10 grid place-items-center rounded-full border border-border/40 bg-card/40 hover:bg-card/70 hover:border-border/70 transition-all duration-300 hover:scale-110 active:scale-95 shrink-0"
            style={{
              boxShadow: isLight
                ? "0 0 16px oklch(0.82 0.18 70 / 0.4)"
                : "0 0 16px oklch(0.65 0.22 280 / 0.4)",
            }}
          >
            <span
              className="transition-transform duration-500"
              style={{ transform: isLight ? "rotate(0deg)" : "rotate(180deg)" }}
            >
              {isLight ? (
                <Sun className="h-4.5 w-4.5" style={{ color: "oklch(0.82 0.18 70)" }} />
              ) : (
                <Moon className="h-4.5 w-4.5" style={{ color: "oklch(0.72 0.15 280)" }} />
              )}
            </span>
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Flame className="h-5 w-5 text-orange-400" />
              <span className="font-medium">12 Day Streak</span>
            </div>
            <div className="relative h-10 w-10 rounded-full grid place-items-center text-xs font-semibold border-2 border-[oklch(0.82_0.15_200)] text-[oklch(0.82_0.15_200)] hover:scale-105 transition-transform duration-200 cursor-default">
              84%
            </div>
            <button
              onClick={() => setNotifOpen(true)}
              className="relative h-10 w-10 grid place-items-center rounded-full hover:bg-card/60 transition-all duration-250 text-muted-foreground hover:text-foreground active:scale-90 hover:scale-105"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {/* Notification badge */}
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[oklch(0.82_0.15_200)]" />
            </button>
          </div>
        </header>

        {/* Page content with fade-in */}
        <main
          className="flex-1 overflow-auto"
          style={{ animation: "var(--animate-fade-in)", animationDelay: "80ms" }}
        >
          {children}
        </main>
      </div>

      <Sheet open={notifOpen} onOpenChange={setNotifOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md border-l border-border/40 p-0"
          style={{ background: "var(--bg-panel)" }}
        >
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/40">
            <SheetTitle
              className="text-xl bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              Notifications
            </SheetTitle>
          </SheetHeader>
          <div className="p-6 space-y-3 overflow-auto h-full">
            {[
              { t: "Module Completed", d: "Advanced Data Structures milestone reached.", c: "oklch(0.82 0.15 200)" },
              { t: "New Roadmap Available", d: "Neural Net Architecture is ready to begin.", c: "oklch(0.65 0.22 305)" },
              { t: "Streak Extended", d: "12 days of continuous learning. Keep it up!", c: "oklch(0.75 0.18 50)" },
              { t: "System Update", d: "Cognitive trajectory model v2.4 deployed.", c: "oklch(0.82 0.15 200)" },
              { t: "Review Phase Due", d: "18 hrs of review scheduled this epoch.", c: "oklch(0.65 0.22 305)" },
            ].map((n, i) => (
              <div
                key={i}
                className="rounded-xl border border-border/40 bg-card/40 p-4 flex gap-3 hover:bg-card/60 hover:border-border/70 transition-all duration-250 cursor-default hover:-translate-y-[1px]"
                style={{ animation: "var(--animate-fade-in-up)", animationDelay: `${i * 60}ms` }}
              >
                <div
                  className="h-2 w-2 mt-2 rounded-full shrink-0"
                  style={{ background: n.c, boxShadow: `0 0 8px ${n.c}` }}
                />
                <div>
                  <div className="font-semibold text-sm">{n.t}</div>
                  <div className="text-xs text-muted-foreground mt-1">{n.d}</div>
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function NavLink({
  icon: Icon,
  label,
  to,
  active,
}: NavDef & { active: boolean }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-250 hover:translate-x-1 ${
        active
          ? "bg-card/70 border border-[oklch(0.82_0.15_200/0.4)] text-[oklch(0.82_0.15_200)]"
          : "text-muted-foreground hover:text-foreground hover:bg-card/40"
      }`}
    >
      <Icon className={`h-4 w-4 transition-transform duration-200 ${active ? "scale-110" : ""}`} />
      {label}
    </Link>
  );
}