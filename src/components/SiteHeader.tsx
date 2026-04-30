import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import logoUrl from "@/assets/logo.png";

const resourceLinks = [
  { to: "/soul-sync", label: "Soul Sync" },
  { to: "/serene-mind", label: "Serene Mind" },
  { to: "/oneness-yoga", label: "Oneness Yoga" },
  { to: "/blog", label: "Blogs" },
  { to: "/gallery", label: "Gallery" },
  { to: "/wallpapers", label: "Wallpapers" },
] as const;

const programLinks = [
  { to: "/sfz", label: "Stress Free Zone" },
  { to: "/summer-camp", label: "Summer Camp Events" },
  { to: "/programs", label: "Events" },
] as const;

function BrandMark() {
  return (
    <img
      src={logoUrl}
      alt="Oneness Generation"
      width={180}
      height={64}
      className="h-14 w-auto object-contain"
    />
  );
}

function DesktopDropdown({
  label,
  items,
}: {
  label: string;
  items: readonly { to: string; label: string }[];
}) {
  return (
    <div className="group relative">
      <button className="flex items-center gap-2 text-[1rem] font-semibold text-primary transition hover:opacity-80">
        <span>{label}</span>
        <ChevronDown className="h-5 w-5 text-foreground" />
      </button>
      <div className="pointer-events-none absolute left-0 top-full pt-4 opacity-0 transition duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
        <div className="min-w-[340px] rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="space-y-5">
            {items.map((item) => (
              <Link key={item.to} to={item.to} className="block text-[1rem] font-semibold text-primary transition hover:opacity-80">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-secondary backdrop-blur-sm">
      <div className="container-shell flex h-26 items-center justify-between gap-6 px-4 sm:px-6">
        <Link to="/" className="shrink-0">
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-12 lg:flex">
          <Link to="/" activeOptions={{ exact: true }} className="text-[1rem] font-semibold text-primary transition hover:opacity-80">
            Home
          </Link>
          <Link to="/about-us" className="text-[1rem] font-semibold text-primary transition hover:opacity-80">
            About Us
          </Link>
          <DesktopDropdown label="Resources" items={resourceLinks} />
          <DesktopDropdown label="Programs" items={programLinks} />
          <Link to="/get-involved" className="text-[1rem] font-semibold text-primary transition hover:opacity-80">
            Get Involved
          </Link>
          <Link to="/contact-us" className="text-[1rem] font-semibold text-primary transition hover:opacity-80">
            Contact
          </Link>
        </nav>

        <div className="hidden lg:block">
          <Link to="/login" className="inline-flex min-w-[120px] items-center justify-center rounded-full bg-primary px-8 py-3.5 text-[0.95rem] font-bold uppercase tracking-[0.08em] text-primary-foreground shadow-soft transition hover:opacity-90">
            LOGIN
          </Link>
        </div>

        <button className="rounded-full border border-border p-2.5 lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle navigation">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="container-shell space-y-5 px-4 py-6 sm:px-6">
            <div className="space-y-3 text-base font-semibold text-primary">
              <Link to="/" onClick={() => setOpen(false)} className="block">Home</Link>
              <Link to="/about-us" onClick={() => setOpen(false)} className="block">About Us</Link>
              <Link to="/get-involved" onClick={() => setOpen(false)} className="block">Get Involved</Link>
              <Link to="/contact-us" onClick={() => setOpen(false)} className="block">Contact</Link>
            </div>

            <div>
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Resources</div>
              <div className="space-y-3 text-base font-semibold text-primary">
                {resourceLinks.map((item) => (
                  <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="block">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Programs</div>
              <div className="space-y-3 text-base font-semibold text-primary">
                {programLinks.map((item) => (
                  <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="block">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link to="/login" onClick={() => setOpen(false)} className="inline-flex min-w-[112px] items-center justify-center rounded-full bg-primary px-7 py-3 text-[0.95rem] font-semibold uppercase tracking-[0.02em] text-primary-foreground transition hover:opacity-90">
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
