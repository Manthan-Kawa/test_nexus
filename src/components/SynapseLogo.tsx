import { Sparkles } from "lucide-react";

export function SynapseLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const text = size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-xl";
  const icon = size === "lg" ? "h-7 w-7" : size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <div className="flex items-center gap-2 font-semibold tracking-tight">
      <Sparkles className={`${icon} text-[oklch(0.82_0.15_200)]`} strokeWidth={2.2} />
      <span
        className={`${text} bg-clip-text text-transparent`}
        style={{ backgroundImage: "var(--gradient-brand)" }}
      >
        Synapse
      </span>
    </div>
  );
}