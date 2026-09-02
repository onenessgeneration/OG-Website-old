import { createFileRoute, Link } from "@tanstack/react-router";
import { ClientOnly } from "@/components/ClientOnly";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { signOut } from "@/lib/auth";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — Oneness Generation" },
      { name: "description", content: "Manage your Oneness Generation account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  return (
    <div className="xl:px-[450px] sm:px-20 py-10">
      <div className="mx-auto max-w-xl px-5">
        <h1 className="text-3xl font-semibold text-darkGreyBrown mb-6">My Account</h1>
        <ClientOnly fallback={<p className="text-darkGreyBrown/70">Loading…</p>}>
          <AccountBody />
        </ClientOnly>
      </div>
    </div>
  );
}

function AccountBody() {
  const { user, isAdmin, loading } = useIsAdmin();

  if (loading) return <p className="text-darkGreyBrown/70">Loading…</p>;

  if (!user) {
    return (
      <div className="space-y-4">
        <p>You are not signed in.</p>
        <Link
          to="/login"
          className="inline-block px-6 py-2 uppercase text-sm bg-brown text-white rounded-full hover:bg-darkGreyBrown transition"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-darkGreyBrown/20 p-5">
        <p className="text-sm text-darkGreyBrown/70">Signed in as</p>
        <p className="text-lg font-medium break-all">{user.email}</p>
      </div>
      {isAdmin && (
        <Link
          to="/admin"
          className="inline-block px-6 py-2 uppercase text-sm bg-brown text-white rounded-full hover:bg-darkGreyBrown transition"
        >
          Open admin
        </Link>
      )}
      <button
        onClick={() => void signOut()}
        className="block px-6 py-2 uppercase text-sm bg-darkGreyBrown text-tan rounded-full hover:bg-brown transition"
      >
        Sign out
      </button>
    </div>
  );
}
