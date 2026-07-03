import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setServerError("Invalid Credentials");
      toast.error(error.message);
    } else {
      toast.success("Login successfully");
      navigate({ to: "/" });
    }
  };

  return (
    <div className="xl:px-[450px] sm:px-20 py-10">
      <div className="flex items-center justify-center mx-auto container px-5 max-w-xl">
        <div className="md:flex md:justify-center md:items-center w-full">
          <div className="w-full md:p-3 p-2 lg:rounded-xl md:space-y-5 space-y-2">
            <div className="grid place-content-center place-items-center mb-4">
              <h2 className="text-darkGreyBrown text-3xl font-semibold">Login</h2>
              <p className="flex items-center gap-3">
                Don't have an account?
                <Link to="/register" className="font-semibold text-brown underline underline-offset-4">
                  Register
                </Link>
              </p>
            </div>

            <form onSubmit={submit} className="grid grid-cols-1 space-y-4">
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

              {serverError && <small className="text-red-500">{serverError}</small>}

              <div className="text-right -mt-2">
                <Link
                  to="/forgot-password"
                  className="text-sm text-brown font-medium underline underline-offset-4 hover:text-darkGreyBrown"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="p-2 px-4 font-medium bg-darkGreyBrown text-tan rounded-xl text-xl disabled:opacity-50"
              >
                {loading ? "Logging..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
