import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useState, useMemo } from "react";
import {
  Search, Flame, Star, Terminal, Palette, Braces, Plus,
  Code2, Compass, Database, Wand2, Cpu, ArrowRight, CheckCircle2,
  Globe, Shield, Layers, GitBranch, Box, Zap, BookOpen,
  BarChart2, Cloud, Lock, Activity, Server, Wifi, FileCode,
} from "lucide-react";
import { enrollCourse, isEnrolled, type EnrolledCourse } from "@/lib/courseStore";

export const Route = createFileRoute("/add-skill")({
  component: AddSkillPage,
  head: () => ({
    meta: [
      { title: "Synapse — Add New Skill" },
      { name: "description", content: "Search the global skill repository and enrol in a new learning path." },
    ],
  }),
});

const FILTERS = ["All", "Trending", "Engineering", "Data Science", "Design", "AI/ML", "DevOps", "Security"];

const SKILLS = [
  { id:"advanced-react", icon:Code2, tag:"CORE", cat:"Engineering", title:"Advanced React Patterns", desc:"Master compound components, custom hooks, render-props, and state reducer patterns.", nodes:45, hrs:120, accent:"oklch(0.82 0.15 200)" },
  { id:"microservices", icon:Compass, tag:"SYSTEMS", cat:"Engineering", title:"Microservices Architecture", desc:"Design scalable, resilient distributed systems using modern containerisation.", nodes:62, hrs:200, accent:"oklch(0.65 0.22 305)" },
  { id:"postgres", icon:Database, tag:"DATA", cat:"Data Science", title:"PostgreSQL Optimisation", desc:"Query profiling, indexing strategies, and connection pooling techniques.", nodes:28, hrs:80, accent:"oklch(0.82 0.15 200)" },
  { id:"design-systems", icon:Wand2, tag:"UI/UX", cat:"Design", title:"Design System Engineering", desc:"Build robust, accessible token-based design systems bridging design and code.", nodes:35, hrs:110, accent:"oklch(0.65 0.22 305)" },
  { id:"llm-integration", icon:Cpu, tag:"AI", cat:"AI/ML", title:"LLM Integration", desc:"Prompt engineering, RAG pipelines, and fine-tuning models for production.", nodes:50, hrs:160, accent:"oklch(0.82 0.15 200)" },
  { id:"typescript-advanced", icon:FileCode, tag:"CORE", cat:"Engineering", title:"TypeScript Mastery", desc:"Advanced types, utility types, decorators, and compiler API internals.", nodes:38, hrs:95, accent:"oklch(0.75 0.2 240)" },
  { id:"nextjs-fullstack", icon:Globe, tag:"WEB", cat:"Engineering", title:"Next.js Full-Stack", desc:"App router, server components, streaming, and edge runtime patterns.", nodes:52, hrs:140, accent:"oklch(0.72 0.18 160)" },
  { id:"machine-learning", icon:Activity, tag:"ML", cat:"AI/ML", title:"Machine Learning Fundamentals", desc:"Supervised, unsupervised learning, model evaluation, and scikit-learn pipelines.", nodes:60, hrs:180, accent:"oklch(0.78 0.2 45)" },
  { id:"deep-learning", icon:Cpu, tag:"AI", cat:"AI/ML", title:"Deep Learning & Neural Nets", desc:"CNNs, RNNs, transformers, and backpropagation with PyTorch.", nodes:55, hrs:200, accent:"oklch(0.65 0.22 305)" },
  { id:"kubernetes", icon:Cloud, tag:"DEVOPS", cat:"DevOps", title:"Kubernetes & Container Orchestration", desc:"Pod scheduling, Helm charts, service meshes, and production deployments.", nodes:48, hrs:155, accent:"oklch(0.62 0.2 220)" },
  { id:"graphql", icon:Layers, tag:"API", cat:"Engineering", title:"GraphQL & Apollo", desc:"Schema design, resolvers, subscriptions, and client caching strategies.", nodes:32, hrs:90, accent:"oklch(0.72 0.22 340)" },
  { id:"rust-systems", icon:Shield, tag:"SYSTEMS", cat:"Engineering", title:"Rust Systems Programming", desc:"Ownership model, lifetimes, async runtimes, and safe concurrency.", nodes:70, hrs:220, accent:"oklch(0.75 0.18 30)" },
  { id:"data-engineering", icon:Server, tag:"DATA", cat:"Data Science", title:"Data Engineering Pipelines", desc:"Apache Spark, Kafka, Airflow, and building reliable ETL workflows.", nodes:44, hrs:135, accent:"oklch(0.82 0.15 200)" },
  { id:"security-fundamentals", icon:Lock, tag:"SEC", cat:"Security", title:"Cybersecurity Fundamentals", desc:"OWASP top-10, penetration testing basics, and threat modelling.", nodes:40, hrs:120, accent:"oklch(0.68 0.2 15)" },
  { id:"go-backend", icon:Zap, tag:"CORE", cat:"Engineering", title:"Go Backend Engineering", desc:"Concurrency patterns, HTTP servers, gRPC, and building production-grade APIs.", nodes:42, hrs:130, accent:"oklch(0.72 0.18 160)" },
  { id:"vue-ecosystem", icon:Code2, tag:"WEB", cat:"Engineering", title:"Vue.js Ecosystem", desc:"Composition API, Pinia, Nuxt 3, and building scalable SPAs.", nodes:36, hrs:100, accent:"oklch(0.7 0.2 145)" },
  { id:"figma-advanced", icon:Palette, tag:"DESIGN", cat:"Design", title:"Figma Advanced Workflows", desc:"Auto-layout mastery, component variants, plugins, and design tokens.", nodes:30, hrs:75, accent:"oklch(0.78 0.2 320)" },
  { id:"aws-architect", icon:Cloud, tag:"CLOUD", cat:"DevOps", title:"AWS Solutions Architect", desc:"VPC, EC2, Lambda, RDS, S3, and designing high-availability cloud architectures.", nodes:65, hrs:190, accent:"oklch(0.75 0.18 50)" },
  { id:"docker-devops", icon:Box, tag:"DEVOPS", cat:"DevOps", title:"Docker & DevOps Essentials", desc:"Dockerfile best practices, multi-stage builds, CI/CD pipelines, and monitoring.", nodes:38, hrs:110, accent:"oklch(0.62 0.2 220)" },
  { id:"sql-analytics", icon:BarChart2, tag:"DATA", cat:"Data Science", title:"SQL for Analytics", desc:"Window functions, CTEs, query optimisation, and data warehousing patterns.", nodes:25, hrs:60, accent:"oklch(0.82 0.15 200)" },
  { id:"python-automation", icon:FileCode, tag:"SCRIPTING", cat:"Engineering", title:"Python Automation & Scripting", desc:"Task automation, web scraping, CLI tools, and scheduled jobs.", nodes:28, hrs:70, accent:"oklch(0.75 0.2 240)" },
  { id:"react-native", icon:Wifi, tag:"MOBILE", cat:"Engineering", title:"React Native", desc:"Cross-platform mobile apps, navigation, native APIs, and Expo workflow.", nodes:40, hrs:120, accent:"oklch(0.82 0.15 200)" },
  { id:"tailwind-advanced", icon:Wand2, tag:"UI/UX", cat:"Design", title:"Tailwind CSS Mastery", desc:"Custom design systems, plugins, dark mode, and responsive patterns.", nodes:22, hrs:50, accent:"oklch(0.65 0.22 305)" },
  { id:"redis-caching", icon:Server, tag:"INFRA", cat:"Engineering", title:"Redis & Caching Strategies", desc:"Cache invalidation, pub/sub, sorted sets, and session management.", nodes:24, hrs:65, accent:"oklch(0.68 0.2 15)" },
  { id:"ethical-hacking", icon:Shield, tag:"SEC", cat:"Security", title:"Ethical Hacking & Pen Testing", desc:"Kali Linux, network scanning, exploitation, and responsible disclosure.", nodes:50, hrs:160, accent:"oklch(0.68 0.2 15)" },
  { id:"nlp-transformers", icon:BookOpen, tag:"AI", cat:"AI/ML", title:"NLP & Transformers", desc:"BERT, GPT fine-tuning, tokenisation, and building NLP pipelines.", nodes:48, hrs:155, accent:"oklch(0.65 0.22 305)" },
  { id:"terraform-iac", icon:Cloud, tag:"DEVOPS", cat:"DevOps", title:"Terraform & Infrastructure as Code", desc:"State management, modules, workspaces, and multi-cloud provisioning.", nodes:35, hrs:100, accent:"oklch(0.62 0.2 220)" },
  { id:"svelte", icon:Code2, tag:"WEB", cat:"Engineering", title:"SvelteKit", desc:"Reactivity model, stores, server-side rendering, and adapter deployments.", nodes:30, hrs:80, accent:"oklch(0.78 0.2 30)" },
  { id:"mongodb", icon:Database, tag:"DATA", cat:"Data Science", title:"MongoDB & NoSQL Design", desc:"Document modelling, aggregation pipeline, indexing, and Atlas deployments.", nodes:26, hrs:70, accent:"oklch(0.72 0.18 160)" },
  { id:"web-security", icon:Lock, tag:"SEC", cat:"Security", title:"Web Application Security", desc:"XSS, CSRF, SQL injection, CSP headers, and secure coding practices.", nodes:35, hrs:95, accent:"oklch(0.68 0.2 15)" },
  { id:"flutter", icon:Box, tag:"MOBILE", cat:"Engineering", title:"Flutter & Dart", desc:"Widget tree, state management, animations, and publishing to stores.", nodes:42, hrs:130, accent:"oklch(0.65 0.22 305)" },
  { id:"computer-vision", icon:Activity, tag:"AI", cat:"AI/ML", title:"Computer Vision with OpenCV", desc:"Image processing, object detection, segmentation, and YOLO models.", nodes:45, hrs:145, accent:"oklch(0.78 0.2 45)" },
  { id:"kafka-streaming", icon:Zap, tag:"SYSTEMS", cat:"Engineering", title:"Apache Kafka & Event Streaming", desc:"Topics, partitions, consumer groups, and building real-time event pipelines.", nodes:38, hrs:115, accent:"oklch(0.82 0.15 200)" },
  { id:"ci-cd", icon:GitBranch, tag:"DEVOPS", cat:"DevOps", title:"CI/CD with GitHub Actions", desc:"Workflow syntax, matrix builds, secrets management, and deployment automation.", nodes:28, hrs:75, accent:"oklch(0.62 0.2 220)" },
  { id:"dsa", icon:Code2, tag:"CORE", cat:"Engineering", title:"Data Structures & Algorithms", desc:"Arrays, trees, graphs, dynamic programming, and interview preparation.", nodes:80, hrs:250, accent:"oklch(0.75 0.2 240)" },
  { id:"ux-research", icon:Palette, tag:"DESIGN", cat:"Design", title:"UX Research Methods", desc:"User interviews, usability testing, affinity mapping, and research synthesis.", nodes:25, hrs:60, accent:"oklch(0.78 0.2 320)" },
  { id:"blockchain", icon:Layers, tag:"WEB3", cat:"Engineering", title:"Blockchain & Smart Contracts", desc:"Solidity, EVM, DeFi protocols, and deploying dApps on Ethereum.", nodes:55, hrs:170, accent:"oklch(0.72 0.22 340)" },
  { id:"dotnet", icon:Server, tag:"CORE", cat:"Engineering", title:".NET & C# Backend", desc:"ASP.NET Core, Entity Framework, CQRS pattern, and Azure deployments.", nodes:48, hrs:145, accent:"oklch(0.65 0.22 305)" },
  { id:"generative-ai", icon:Cpu, tag:"AI", cat:"AI/ML", title:"Generative AI Engineering", desc:"Diffusion models, GANs, image generation, and building AI-powered products.", nodes:40, hrs:130, accent:"oklch(0.72 0.22 340)" },
  { id:"linux-admin", icon:Terminal, tag:"SYSTEMS", cat:"DevOps", title:"Linux System Administration", desc:"Shell scripting, process management, networking, and server hardening.", nodes:35, hrs:100, accent:"oklch(0.68 0.2 15)" },
  { id:"swift-ios", icon:Box, tag:"MOBILE", cat:"Engineering", title:"iOS Development with Swift", desc:"SwiftUI, UIKit, Core Data, and publishing to the App Store.", nodes:48, hrs:150, accent:"oklch(0.75 0.18 30)" },
  { id:"animation-design", icon:Wand2, tag:"DESIGN", cat:"Design", title:"Motion Design & Animation", desc:"Lottie, GSAP, CSS animations, and designing delightful micro-interactions.", nodes:28, hrs:75, accent:"oklch(0.78 0.2 320)" },
  { id:"spark-bigdata", icon:BarChart2, tag:"DATA", cat:"Data Science", title:"Apache Spark & Big Data", desc:"RDDs, DataFrames, Spark SQL, MLlib, and cluster computing workflows.", nodes:45, hrs:140, accent:"oklch(0.82 0.15 200)" },
  { id:"grpc-protobuf", icon:Wifi, tag:"API", cat:"Engineering", title:"gRPC & Protocol Buffers", desc:"Service definitions, streaming, interceptors, and polyglot service communication.", nodes:22, hrs:55, accent:"oklch(0.62 0.2 220)" },
  { id:"pytorch-dl", icon:Cpu, tag:"AI", cat:"AI/ML", title:"PyTorch Deep Learning", desc:"Tensors, autograd, custom datasets, training loops, and model deployment.", nodes:52, hrs:165, accent:"oklch(0.65 0.22 305)" },
  { id:"accessibility", icon:Globe, tag:"UI/UX", cat:"Design", title:"Web Accessibility (A11y)", desc:"WCAG 2.2, ARIA patterns, screen-reader testing, and inclusive design.", nodes:20, hrs:50, accent:"oklch(0.72 0.18 160)" },
  { id:"observability", icon:Activity, tag:"DEVOPS", cat:"DevOps", title:"Observability & Monitoring", desc:"Prometheus, Grafana, distributed tracing with Jaeger, and SLO design.", nodes:30, hrs:85, accent:"oklch(0.62 0.2 220)" },
  { id:"elixir", icon:Zap, tag:"SYSTEMS", cat:"Engineering", title:"Elixir & Phoenix", desc:"Functional programming, OTP, LiveView, and building fault-tolerant systems.", nodes:38, hrs:115, accent:"oklch(0.72 0.22 340)" },
  { id:"product-design", icon:Palette, tag:"DESIGN", cat:"Design", title:"Product Design Process", desc:"Double diamond, journey mapping, wireframing, and stakeholder alignment.", nodes:24, hrs:65, accent:"oklch(0.78 0.2 320)" },
  { id:"reinforcement-learning", icon:Activity, tag:"AI", cat:"AI/ML", title:"Reinforcement Learning", desc:"MDPs, Q-learning, policy gradients, and training agents with OpenAI Gym.", nodes:45, hrs:155, accent:"oklch(0.78 0.2 45)" },
];

/** Auto-generate 5 learning modules for any enrolled course */
function generateModules(skill: typeof SKILLS[number]): import("@/lib/courseStore").CourseModule[] {
  const topics: Record<string, string[][]> = {
    "Engineering": [
      ["Fundamentals & Setup", ["Environment Setup", "Core Concepts", "First Project", "CLI Tools"]],
      ["Core Patterns", ["Pattern 1", "Pattern 2", "Pattern 3", "Best Practices"]],
      ["Advanced Topics", ["Performance", "Scalability", "Testing", "Debugging"]],
      ["Real-world Projects", ["Project Setup", "Feature Implementation", "Code Review", "Deployment"]],
      ["Mastery & Certification", ["Portfolio Project", "Edge Cases", "Optimisation", "Final Review"]],
    ],
    "AI/ML": [
      ["Mathematics & Foundations", ["Linear Algebra", "Statistics", "Probability", "Calculus Basics"]],
      ["Data Preparation", ["Data Cleaning", "Feature Engineering", "EDA", "Normalisation"]],
      ["Model Training", ["Model Selection", "Training Loop", "Hyperparameter Tuning", "Validation"]],
      ["Deployment", ["Serialisation", "REST API", "Containerisation", "Monitoring"]],
      ["Advanced Research", ["State of the Art", "Paper Review", "Custom Architectures", "Fine-tuning"]],
    ],
    "Data Science": [
      ["Data Collection", ["Sources & APIs", "Web Scraping", "SQL Basics", "Data Types"]],
      ["Analysis & EDA", ["Descriptive Stats", "Visualisation", "Correlation", "Outlier Detection"]],
      ["Modelling", ["Regression", "Classification", "Clustering", "Evaluation Metrics"]],
      ["Data Pipelines", ["ETL Design", "Scheduling", "Error Handling", "Monitoring"]],
      ["Insights & Reporting", ["Dashboard Design", "Storytelling", "Stakeholder Comms", "Automation"]],
    ],
    "Design": [
      ["Design Foundations", ["Color Theory", "Typography", "Grid Systems", "Visual Hierarchy"]],
      ["User Research", ["Interviews", "Surveys", "Personas", "Journey Maps"]],
      ["Wireframing", ["Lo-fi Sketches", "Mid-fi Wireframes", "Information Architecture", "Flow Diagrams"]],
      ["Hi-fi Prototyping", ["Component Library", "Interaction Design", "Prototyping", "Handoff"]],
      ["Design Systems", ["Token Design", "Documentation", "Governance", "Versioning"]],
    ],
    "DevOps": [
      ["Linux & Scripting", ["Shell Basics", "File Permissions", "Cron Jobs", "Networking"]],
      ["Containers", ["Docker Basics", "Docker Compose", "Registry", "Security Scanning"]],
      ["Orchestration", ["Cluster Setup", "Deployments", "Services", "Ingress"]],
      ["CI/CD Pipelines", ["Source Control", "Build Automation", "Test Gates", "Release Strategy"]],
      ["Monitoring & SRE", ["Metrics", "Alerts", "Runbooks", "SLOs & Error Budgets"]],
    ],
    "Security": [
      ["Threat Landscape", ["OWASP Top-10", "Attack Vectors", "CIA Triad", "Risk Assessment"]],
      ["Network Security", ["Firewalls", "VPNs", "TLS/SSL", "Network Scanning"]],
      ["Web Application Security", ["Auth & AuthZ", "Injection Attacks", "XSS & CSRF", "Secure Headers"]],
      ["Penetration Testing", ["Reconnaissance", "Exploitation", "Post-Exploitation", "Reporting"]],
      ["Security Operations", ["SIEM", "Incident Response", "Threat Hunting", "Compliance"]],
    ],
  };

  const catTopics = topics[skill.cat] ?? topics["Engineering"];
  return catTopics.map((row, i) => ({
    label: row[0] as string,
    status: i === 0 ? "progress" : "locked",
    pct: i === 0 ? 0 : 0,
    currentLesson: (row[1] as string[])[0],
    lessons: (row[1] as string[]).map((t) => ({ title: t, done: false })),
  }));
}

function AddSkillPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [enrolled, setEnrolled] = useState<Set<string>>(() => {
    try {
      const data = JSON.parse(localStorage.getItem("synapse_enrolled_courses") ?? "[]");
      return new Set(data.map((c: { id: string }) => c.id));
    } catch { return new Set(); }
  });

  const visible = useMemo(() => {
    return SKILLS.filter((s) => {
      const matchesFilter =
        activeFilter === "All" ||
        activeFilter === "Trending" ||
        s.cat === activeFilter;
      const matchesSearch =
        !query ||
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.desc.toLowerCase().includes(query.toLowerCase()) ||
        s.tag.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [query, activeFilter]);

  function handleEnroll(s: typeof SKILLS[number]) {
    if (enrolled.has(s.id)) return;
    const course: EnrolledCourse = {
      id: s.id,
      title: s.title,
      shortLabel: s.title.length > 14 ? s.title.slice(0, 13) + "…" : s.title,
      tag: s.tag,
      accent: s.accent,
      modules: generateModules(s),
    };
    enrollCourse(course);
    setEnrolled((prev) => new Set([...prev, s.id]));
  }

  return (
    <AppShell title="Add New Skill">
      <div className="px-6 lg:px-10 py-8 space-y-8 max-w-7xl">
        {/* Header */}
        <div style={{ animation: "var(--animate-fade-in-up)", animationDelay: "0ms" }}>
          <h1 className="text-4xl font-semibold tracking-tight">Initiate New Sequence</h1>
          <p className="text-muted-foreground mt-2">
            Search the global repository and click <ArrowRight className="inline h-3.5 w-3.5" /> to add a course to your sidebar.
          </p>
        </div>

        {/* Search bar */}
        <div
          className="relative rounded-2xl border border-border/50 bg-card/40 p-2 flex items-center gap-2"
          style={{ boxShadow: "0 0 30px oklch(0.7 0.18 220 / 0.15)", animation: "var(--animate-fade-in-up)", animationDelay: "60ms" }}
        >
          <Search className="h-5 w-5 text-muted-foreground ml-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills, languages, tools…"
            className="flex-1 h-12 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-xs text-muted-foreground hover:text-foreground px-3">
              Clear
            </button>
          )}
          <div className="h-12 px-6 rounded-xl text-sm font-semibold text-background flex items-center" style={{ backgroundImage: "var(--gradient-brand)" }}>
            {visible.length} results
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-3" style={{ animation: "var(--animate-fade-in-up)", animationDelay: "100ms" }}>
          {FILTERS.map((f) => {
            const isActive = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 h-10 rounded-full text-sm border transition-all duration-200 hover:-translate-y-[1px] ${
                  isActive
                    ? "border-[oklch(0.82_0.15_200/0.6)] text-[oklch(0.82_0.15_200)] bg-[oklch(0.82_0.15_200/0.1)]"
                    : "border-border/40 text-muted-foreground hover:text-foreground bg-card/30"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Skill grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Custom node card */}
          <button className="rounded-2xl border-2 border-dashed border-border/60 p-8 flex flex-col items-center justify-center text-center hover:border-[oklch(0.82_0.15_200/0.5)] transition group min-h-[240px]">
            <div className="h-14 w-14 rounded-full border border-border/60 grid place-items-center mb-4 group-hover:border-[oklch(0.82_0.15_200/0.6)] transition">
              <Plus className="h-6 w-6 text-muted-foreground group-hover:text-[oklch(0.82_0.15_200)] transition" />
            </div>
            <div className="text-xl font-semibold">Custom Node</div>
            <div className="text-sm text-muted-foreground mt-1">Define a proprietary skill track</div>
          </button>

          {visible.map((s, i) => {
            const done = enrolled.has(s.id);
            return (
              <div
                key={s.id}
                className="relative rounded-2xl border border-border/40 bg-card/30 p-6 hover:bg-card/50 transition-all duration-300 group overflow-hidden hover:-translate-y-1"
                style={{ animation: "var(--animate-fade-in-up)", animationDelay: `${80 + i * 30}ms` }}
              >
                {/* Glow blob */}
                <div
                  className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full opacity-25 blur-3xl pointer-events-none transition-opacity duration-300 group-hover:opacity-40"
                  style={{ background: s.accent }}
                />
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="h-11 w-11 rounded-lg grid place-items-center"
                    style={{ background: `color-mix(in oklab, ${s.accent} 18%, transparent)` }}
                  >
                    <s.icon className="h-5 w-5" style={{ color: s.accent }} />
                  </div>
                  <span className="text-[10px] tracking-[0.25em] text-muted-foreground/80">{s.tag}</span>
                </div>
                <h3 className="text-lg font-semibold leading-snug">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2">{s.desc}</p>
                <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{s.nodes} Nodes • {s.hrs} hrs</span>
                  {done ? (
                    <span className="flex items-center gap-1 text-[oklch(0.75_0.2_145)] font-medium">
                      <CheckCircle2 className="h-4 w-4" /> Added
                    </span>
                  ) : (
                    <button
                      onClick={() => handleEnroll(s)}
                      className="flex items-center gap-1 text-muted-foreground hover:text-[oklch(0.82_0.15_200)] transition-all duration-200 hover:gap-2 group/btn"
                      title="Add to my templates"
                    >
                      Add
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {visible.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-lg">No courses match "<span className="text-foreground">{query}</span>"</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}