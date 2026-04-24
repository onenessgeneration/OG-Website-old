import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — Oneness Generation" },
      { name: "description", content: "Create your Oneness Generation account." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined },
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Account created! Check your inbox to confirm.");
      navigate({ to: "/login" });
    }
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-soft-gradient px-4 py-16">
      <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-soft border border-border">
        <h1 className="text-3xl font-bold text-gradient mb-2 text-center">Join the Movement</h1>
        <p className="text-muted-foreground text-sm text-center mb-6">Create your Oneness Generation account.</p>
        <form onSubmit={submit} className="space-y-4">
          <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-input bg-background px-4 py-2.5" />
          <input required type="password" placeholder="Password (min 6 characters)" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border border-input bg-background px-4 py-2.5" />
          <button disabled={loading} className="w-full bg-primary text-primary-foreground rounded-full py-3 font-semibold hover:bg-primary-glow transition disabled:opacity-50">
            {loading ? "Creating account…" : "Register"}
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log In</Link>
        </p>
      </div>
    </section>
  );
}
