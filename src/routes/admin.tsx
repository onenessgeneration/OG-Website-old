import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { ClientOnly } from "@/components/ClientOnly";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Oneness Generation" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="min-h-screen bg-tan/40">
      <div className="max-w-6xl mx-auto px-5 py-10">
        <ClientOnly fallback={<p className="text-darkGreyBrown/70">Loading…</p>}>
          <AdminGate />
        </ClientOnly>
      </div>
    </div>
  );
}

function AdminGate() {
  const { isAdmin, user, loading } = useIsAdmin();
  const location = useLocation();

  if (loading) return <p className="text-darkGreyBrown/70">Loading…</p>;

  if (!user) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-darkGreyBrown">Admin</h1>
        <p>You need to sign in to access admin.</p>
        <Link
          to="/login"
          className="inline-block px-6 py-2 uppercase text-sm bg-brown text-white rounded-full hover:bg-darkGreyBrown transition"
        >
          Login
        </Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold text-darkGreyBrown">Not authorized</h1>
        <p className="text-darkGreyBrown/80">Your account does not have admin access.</p>
      </div>
    );
  }

  const isRoot = location.pathname === "/admin" || location.pathname === "/admin/";

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-semibold text-darkGreyBrown">Admin</h1>
        <nav className="flex gap-2 text-sm flex-wrap">
          <Link
            to="/admin/events"
            className="px-4 py-2 rounded-full bg-brown text-white hover:bg-darkGreyBrown transition"
          >
            Events
          </Link>
          <Link
            to="/admin/blog"
            className="px-4 py-2 rounded-full bg-brown text-white hover:bg-darkGreyBrown transition"
          >
            Blog
          </Link>
          <Link
            to="/admin/testimonials"
            className="px-4 py-2 rounded-full bg-brown text-white hover:bg-darkGreyBrown transition"
          >
            Testimonials
          </Link>
          <Link
            to="/admin/trainers"
            className="px-4 py-2 rounded-full bg-brown text-white hover:bg-darkGreyBrown transition"
          >
            Trainers
          </Link>
          <Link
            to="/admin/gallery"
            className="px-4 py-2 rounded-full bg-brown text-white hover:bg-darkGreyBrown transition"
          >
            Gallery
          </Link>
          <Link
            to="/admin/site-media"
            className="px-4 py-2 rounded-full bg-brown text-white hover:bg-darkGreyBrown transition"
          >
            Site media
          </Link>
        </nav>
      </header>
      {isRoot ? <AdminHome /> : <Outlet />}
    </div>
  );
}

function AdminHome() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Link
        to="/admin/events"
        className="rounded-2xl border border-darkGreyBrown/20 bg-white p-6 hover:shadow-card transition"
      >
        <h2 className="text-xl font-semibold text-darkGreyBrown mb-1">Events</h2>
        <p className="text-sm text-darkGreyBrown/70">
          Create, edit, publish and remove SFZ events.
        </p>
      </Link>
      <Link
        to="/admin/blog"
        className="rounded-2xl border border-darkGreyBrown/20 bg-white p-6 hover:shadow-card transition"
      >
        <h2 className="text-xl font-semibold text-darkGreyBrown mb-1">Blog submissions</h2>
        <p className="text-sm text-darkGreyBrown/70">
          Review, approve, publish or reject community posts.
        </p>
      </Link>
      <Link
        to="/admin/testimonials"
        className="rounded-2xl border border-darkGreyBrown/20 bg-white p-6 hover:shadow-card transition"
      >
        <h2 className="text-xl font-semibold text-darkGreyBrown mb-1">Testimonials</h2>
        <p className="text-sm text-darkGreyBrown/70">
          Add, edit, hide/unhide and remove homepage testimonials.
        </p>
      </Link>
      <Link
        to="/admin/trainers"
        className="rounded-2xl border border-darkGreyBrown/20 bg-white p-6 hover:shadow-card transition"
      >
        <h2 className="text-xl font-semibold text-darkGreyBrown mb-1">Trainers</h2>
        <p className="text-sm text-darkGreyBrown/70">
          Add, edit, hide/unhide and remove SFZ team trainers.
        </p>
      </Link>
      <Link
        to="/admin/gallery"
        className="rounded-2xl border border-darkGreyBrown/20 bg-white p-6 hover:shadow-card transition"
      >
        <h2 className="text-xl font-semibold text-darkGreyBrown mb-1">Gallery</h2>
        <p className="text-sm text-darkGreyBrown/70">
          Upload, reorder, hide and remove photos on the public Gallery page.
        </p>
      </Link>
      <Link
        to="/admin/site-media"
        className="rounded-2xl border border-darkGreyBrown/20 bg-white p-6 hover:shadow-card transition"
      >
        <h2 className="text-xl font-semibold text-darkGreyBrown mb-1">Site media</h2>
        <p className="text-sm text-darkGreyBrown/70">
          Upload every image and video used on the public pages.
        </p>
      </Link>
    </div>
  );
}

