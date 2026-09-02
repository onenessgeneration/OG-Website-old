import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/app-client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — Oneness Generation" },
      { name: "description", content: "Set a new password for your Oneness Generation account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Supabase's recovery flow sets a temporary session when the user
    // clicks the email link. We simply wait for it to hydrate.
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      setReady(!!data.session);
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!passwordPattern.test(newPassword)) {
      setError("Password must include uppercase, lowercase, number, and special character (min 8).");
      return;
    }
    if (newPassword !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (err) {
      toast.error(err.message);
      setError(err.message);
    } else {
      toast.success("Password has been changed successfully");
      navigate({ to: "/login" });
    }
  };

  return (
    <div className="xl:px-[450px] sm:px-20 py-10">
      <div className="flex items-center justify-center mx-auto container px-5 max-w-xl">
        <div className="md:flex md:justify-center md:items-center w-full">
          <div className="w-full md:p-3 p-2 lg:rounded-xl md:space-y-5 space-y-2">
            <div className="grid place-content-center place-items-center mb-4">
              <h2 className="text-darkGreyBrown text-3xl font-semibold">Reset Password</h2>
            </div>

            {!ready && (
              <p className="text-center text-sm text-darkGreyBrown/70">
                Waiting for reset link session… If nothing happens, request a new reset email.
              </p>
            )}

            <form onSubmit={submit} className="grid grid-cols-1 space-y-4">
              <div className="grid space-y-1">
                <label className="px-1">New Password</label>
                <div className="relative w-full">
                  <input
                    type={showNew ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="rounded-xl border border-[#605f5f] sm:py-3 p-2 px-3 w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((s) => !s)}
                    className="absolute top-1/2 -translate-y-1/2 right-3 text-darkGreyBrown"
                    aria-label={showNew ? "Hide password" : "Show password"}
                  >
                    {showNew ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="grid space-y-1">
                <label className="px-1">Confirm Password</label>
                <div className="relative w-full">
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="rounded-xl border border-[#605f5f] sm:py-3 p-2 px-3 w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute top-1/2 -translate-y-1/2 right-3 text-darkGreyBrown"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && <small className="text-red-600">{error}</small>}

              <button
                type="submit"
                disabled={loading || !ready}
                className="p-2 px-4 font-medium bg-darkGreyBrown text-tan rounded-xl text-xl disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
