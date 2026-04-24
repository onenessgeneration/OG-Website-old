import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Oneness Generation" },
      { name: "description", content: "Log in to your Oneness Generation account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Welcome back!");
      navigate({ to: "/" });
    }
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-soft-gradient px-4 py-16">
      <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-soft border border-border">
        <h1 className="text-3xl font-bold text-gradient mb-2 text-center">Welcome Back</h1>
        <p className="text-muted-foreground text-sm text-center mb-6">Log in to your Oneness Generation account.</p>
        <form onSubmit={submit} className="space-y-4">
          <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-input bg-background px-4 py-2.5" />
          <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border border-input bg-background px-4 py-2.5" />
          <button disabled={loading} className="w-full bg-primary text-primary-foreground rounded-full py-3 font-semibold hover:bg-primary-glow transition disabled:opacity-50">
            {loading ? "Logging in…" : "Log In"}
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-muted-foreground">
          Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Register</Link>
        </p>
      </div>
    </section>
  );
}
