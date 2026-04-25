import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  User, Lock, Link2, Accessibility, SlidersHorizontal, Users, Leaf, ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Synapse — System Configurations" },
      { name: "description", content: "Manage neural link preferences and security protocols." },
    ],
  }),
});

const cards = [
  { title: "Profile Update", desc: "Modify your public identity, avatar, and core biometric identifiers.", Icon: User },
  { title: "Change Password", desc: "Update your encryption keys and multi-factor authentication protocols.", Icon: Lock },
  { title: "Link Accounts", desc: "Manage connections to external neural networks and third-party APIs.", Icon: Link2 },
  { title: "Accessibilities", desc: "Adjust interface scaling, color contrast, and cognitive load limits.", Icon: Accessibility, span: "lg:col-span-2" },
  { title: "General Settings", desc: "Configure telemetry, regional data nodes, and system-wide notifications.", Icon: SlidersHorizontal },
  { title: "Parental Controls", desc: "Restrict content access, monitor sub-node activity, and set bandwidth limits.", Icon: Users },
  { title: "Digital Wellbeing", desc: "Review synaptic load metrics and schedule focus modes.", Icon: Leaf, span: "lg:col-span-2" },
];

function SettingsPage() {
  return (
    <AppShell title="System Configurations">
      <div className="px-6 lg:px-10 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-semibold tracking-tight">System Configurations</h1>
          <p className="text-muted-foreground mt-2">
            Manage your neural link preferences, security protocols, and interface accessibilities.
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
          {cards.map((c) => (
            <button
              key={c.title}
              className={`group text-left rounded-2xl border border-border/40 bg-card/30 p-6 hover:bg-card/60 hover:border-[oklch(0.82_0.15_200/0.5)] transition-all flex flex-col ${c.span ?? ""}`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="h-11 w-11 rounded-xl bg-secondary/60 flex items-center justify-center shrink-0">
                  <c.Icon className="h-5 w-5 text-[oklch(0.82_0.15_200)]" />
                </div>
                <h3 className="text-xl font-semibold pt-1.5">{c.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              <div className="mt-auto pt-6 flex justify-end">
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-[oklch(0.82_0.15_200)] group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}