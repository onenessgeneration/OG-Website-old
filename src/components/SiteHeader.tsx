import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const resourceLinks = [
  { to: "/soul-sync", label: "Soul Sync" },
  { to: "/serene-mind", label: "Serene Mind" },
  { to: "/oneness-yoga", label: "Oneness Yoga" },
  { to: "/blog", label: "Blog" },
  { to: "/gallery", label: "Gallery" },
  { to: "/wallpapers", label: "Wallpapers" },
] as const;

const programLinks = [
  { to: "/sfz", label: "SFZ" },
  { to: "/summer-camp", label: "Summer Camp" },
  { to: "/programs", label: "All Programs" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
          <span className="w-8 h-8 rounded-full bg-hero-gradient flex items-center justify-center text-primary-foreground text-sm">
            ॐ
          </span>
          Oneness Generation
        </Link>

        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }} className="hover:text-primary transition">Home</Link>
          <Link to="/about-us" activeProps={{ className: "text-primary" }} className="hover:text-primary transition">About Us</Link>

          <div className="relative group">
            <button className="hover:text-primary transition">Resources ▾</button>
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
              <div className="bg-card shadow-soft rounded-lg p-2 min-w-44 border border-border">
                {resourceLinks.map((l) => (
                  <Link key={l.to} to={l.to} className="block px-3 py-2 rounded hover:bg-secondary text-foreground">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="relative group">
            <button className="hover:text-primary transition">Programs ▾</button>
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
              <div className="bg-card shadow-soft rounded-lg p-2 min-w-44 border border-border">
                {programLinks.map((l) => (
                  <Link key={l.to} to={l.to} className="block px-3 py-2 rounded hover:bg-secondary text-foreground">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link to="/get-involved" activeProps={{ className: "text-primary" }} className="hover:text-primary transition">Get Involved</Link>
          <Link to="/contact-us" activeProps={{ className: "text-primary" }} className="hover:text-primary transition">Contact</Link>

          <Link to="/login" className="px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary-glow transition">
            Login
          </Link>
        </nav>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="px-4 py-4 flex flex-col gap-1 text-sm">
            <Link to="/" onClick={() => setOpen(false)} className="py-2">Home</Link>
            <Link to="/about-us" onClick={() => setOpen(false)} className="py-2">About Us</Link>
            <div className="py-2 font-semibold text-muted-foreground text-xs uppercase">Resources</div>
            {resourceLinks.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-2 pl-3">{l.label}</Link>
            ))}
            <div className="py-2 font-semibold text-muted-foreground text-xs uppercase">Programs</div>
            {programLinks.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-2 pl-3">{l.label}</Link>
            ))}
            <Link to="/get-involved" onClick={() => setOpen(false)} className="py-2">Get Involved</Link>
            <Link to="/contact-us" onClick={() => setOpen(false)} className="py-2">Contact</Link>
            <Link to="/login" onClick={() => setOpen(false)} className="py-2 mt-2 text-center bg-primary text-primary-foreground rounded-full">Login</Link>
          </div>
        </div>
      )}
    </header>
  );
}
