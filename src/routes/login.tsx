import { createFileRoute } from "@tanstack/react-router";
import { SynapseLogo } from "@/components/SynapseLogo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Synapse — Sign In" },
      { name: "description", content: "Access your Synapse neural workspace." },
    ],
  }),
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      if (
        email.trim().toLowerCase() === "quadracoders@gmail.com" &&
        password === "123456"
      ) {
        window.location.href = "/dashboard";
      } else {
        setError("Invalid credentials. Try the demo account.");
        setIsLoading(false);
      }
    }, 600);
  }

  return (
    <div
      className="relative min-h-screen flex flex-col text-foreground"
      style={{ background: "var(--gradient-bg)" }}
    >
      {/* Ambient glows */}
      <div className="absolute top-[-8%] left-[-4%] w-[40vw] h-[40vw] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, oklch(0.55 0.22 305 / 0.15) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-8%] right-[-4%] w-[38vw] h-[38vw] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, oklch(0.65 0.2 200 / 0.18) 0%, transparent 70%)" }} />

      {/* Header */}
      <header
        className="absolute top-0 left-0 right-0 flex items-center justify-center pt-8 pb-4 z-10"
        style={{ animation: "var(--animate-fade-in-up)", animationDelay: "0ms" }}
      >
        <SynapseLogo size="md" />
      </header>

      {/* Centered form */}
      <main className="flex-1 flex items-center justify-center px-6 py-24 relative z-10">
        <div className="w-full max-w-md">
          <h1
            className="text-4xl font-semibold tracking-tight mb-2"
            style={{ animation: "var(--animate-fade-in-up)", animationDelay: "80ms" }}
          >
            Welcome back
          </h1>
          <p
            className="text-muted-foreground mb-8"
            style={{ animation: "var(--animate-fade-in-up)", animationDelay: "140ms" }}
          >
            Re-establish your neural link to continue.
          </p>

          <form
            className="space-y-5"
            onSubmit={handleSubmit}
            style={{ animation: "var(--animate-fade-in-up)", animationDelay: "200ms" }}
          >
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">
                Identifier
              </label>
              <Input
                type="email"
                placeholder="quadracoders@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-card/60 border-border focus:border-[oklch(0.82_0.15_200/0.7)] focus:shadow-[0_0_0_3px_oklch(0.82_0.15_200/0.12)] focus:bg-card/80"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">
                Encryption Key
              </label>
              <Input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-card/60 border-border focus:border-[oklch(0.82_0.15_200/0.7)] focus:shadow-[0_0_0_3px_oklch(0.82_0.15_200/0.12)] focus:bg-card/80"
              />
            </div>

            {error && (
              <p className="text-xs text-destructive" style={{ animation: "var(--animate-scale-in)" }}>
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base font-semibold text-background border-0 relative overflow-hidden"
              style={{
                backgroundImage: "var(--gradient-brand)",
                boxShadow: isLoading ? "none" : "var(--shadow-glow)",
              }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Authenticating…
                </span>
              ) : "Sign In"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Don't have an account?{" "}
              <a href="#" className="text-[oklch(0.82_0.15_200)] hover:underline hover:text-[oklch(0.88_0.15_200)] transition-colors duration-200">
                Create an account
              </a>
            </p>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                <span className="bg-background px-3 text-muted-foreground">or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-sm font-medium bg-card/60 border-border hover:bg-card/80 hover:border-border/80"
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </Button>
          </form>
        </div>
      </main>

      <footer
        className="flex justify-end gap-8 px-8 pb-6 text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70 relative z-10"
        style={{ animation: "var(--animate-fade-in)", animationDelay: "400ms" }}
      >
        <a href="#" className="hover:text-foreground transition-colors duration-200">Privacy Policy</a>
        <a href="#" className="hover:text-foreground transition-colors duration-200">Terms of Service</a>
        <a href="#" className="hover:text-foreground transition-colors duration-200">System Status</a>
      </footer>
    </div>
  );
}
