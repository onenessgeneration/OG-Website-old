import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/app-client";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password — Oneness Generation" },
      { name: "description", content: "Reset your Oneness Generation account password." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const redirectTo =
      typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset email sent. Check your inbox.");
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-10 bg-gray-50">
      <div className="w-full max-w-md mb-6">
        <Link
          to="/login"
          className="inline-flex items-center text-gray-700 hover:text-darkGreyBrown"
          aria-label="Back to login"
        >
          <div className="bg-gray-200 p-2 rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </div>
        </Link>
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-center text-3xl font-semibold text-darkGreyBrown mb-6">
          Forgot Password
        </h2>

        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-darkGreyBrown lowercase"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-darkGreyBrown hover:bg-[#4c4b3a] text-white text-lg py-3 rounded-xl transition font-medium disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
