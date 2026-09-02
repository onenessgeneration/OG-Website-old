import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/app-client";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Sign Up — Oneness Generation" },
      { name: "description", content: "Create your Oneness Generation account." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        data: { full_name: name },
      },
    });
    setLoading(false);
    if (error) {
      setErrorMessage(error.message);
      toast.error(error.message);
    } else {
      toast.success("Account created! Check your inbox to confirm.");
      navigate({ to: "/login" });
    }
  };

  return (
    <div className="flex items-center xl:px-[450px] sm:px-20 py-10">
      <div className="flex items-center justify-center mx-auto container px-5 max-w-xl">
        <div className="w-full lg:mt-3 md:p-6 p-3 lg:rounded-xl md:space-y-5 space-y-2">
          <div className="grid mb-4 place-content-center place-items-center">
            <h2 className="text-darkGreyBrown text-3xl font-semibold">Sign Up</h2>
            <p className="flex items-center gap-3">
              You already have an account?
              <Link to="/login" className="font-semibold text-brown underline underline-offset-4">
                Login
              </Link>
            </p>
          </div>

          <form onSubmit={submit} className="grid grid-cols-1 space-y-4">
            <div className="grid space-y-1">
              <label className="px-1">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border border-[#605f5f] sm:py-3 p-2 px-3 w-full"
              />
            </div>

            <div className="grid space-y-1">
              <label className="px-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl lowercase border border-[#605f5f] sm:py-3 p-2 px-3 w-full"
              />
            </div>

            <div className="grid space-y-1">
              <label className="px-1">Password</label>
              <div className="relative w-full">
                <input
                  type={show ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl border border-[#605f5f] sm:py-3 p-2 px-3 w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute text-xl top-1/2 -translate-y-1/2 right-3 text-darkGreyBrown"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {errorMessage && <small className="text-red-500">{errorMessage}</small>}

            <button
              type="submit"
              disabled={loading}
              className="p-2 px-4 font-medium bg-darkGreyBrown text-tan rounded-xl text-xl disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
