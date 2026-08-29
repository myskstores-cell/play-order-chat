import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Staff Sign In | SK Sport Store" },
      {
        name: "description",
        content:
          "Sign in to the SK Sport Store staff area to manage the sports catalog.",
      },
      { property: "og:title", content: "Staff Sign In | SK Sport Store" },
      {
        property: "og:description",
        content: "Staff access to the SK Sport Store catalog manager.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        await navigate({ to: "/admin" });
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (signUpError) throw signUpError;
        if (data.session) await navigate({ to: "/admin" });
        else setNotice("Check your inbox to confirm the email address, then sign in.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16">
      <p className="eyebrow">Staff area</p>
      <h1 className="display-title mt-2 text-3xl">
        {mode === "signin" ? "Sign in" : "Create staff account"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This area is for SK Sport Store staff managing the catalog. Customers can keep
        shopping and order on WhatsApp.
      </p>

      <form onSubmit={onSubmit} className="surface-panel mt-6 space-y-4 rounded-sm p-5">
        <Input
          label="Email"
          type="email"
          value={email}
          autoComplete="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          required
          minLength={6}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        {notice && <p className="text-sm text-success">{notice}</p>}
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </Button>
        <button
          type="button"
          className="w-full text-xs text-muted-foreground underline"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setNotice(null);
          }}
        >
          {mode === "signin"
            ? "Need a staff account? Create one"
            : "Already have an account? Sign in"}
        </button>
      </form>

      <Link to="/" className="mt-6 text-center text-sm text-muted-foreground underline">
        Back to the store
      </Link>
    </div>
  );
}
