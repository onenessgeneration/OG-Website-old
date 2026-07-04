import { Link } from "@tanstack/react-router";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { ClientOnly } from "./ClientOnly";
import { useAuthUser } from "@/hooks/useAuthUser";
import { signOut } from "@/lib/auth";


// Simplified port of OG_Website oneness-frontend/src/Common/MobileMenu.jsx.
// Keeps the same link set and cream palette; uses a lightweight slide-in panel.

type Item = { to: string; label: string };

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  resourceLinks: readonly Item[];
  programLinks: readonly Item[];
}

export function MobileMenu({ open, onOpenChange, resourceLinks, programLinks }: Props) {
  const [resOpen, setResOpen] = useState(false);
  const [progOpen, setProgOpen] = useState(false);

  const close = () => onOpenChange(false);

  return (
    <>
      <button
        onClick={() => onOpenChange(!open)}
        aria-label="Toggle menu"
        className="text-brown p-1"
      >
        {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[999]" onClick={close} />
          <div className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-tan text-brown z-[1001] shadow-2xl overflow-y-auto">
            <div className="flex justify-end p-4">
              <button onClick={close} aria-label="Close">
                <X className="w-7 h-7 text-brown" />
              </button>
            </div>
            <nav className="px-6 pb-8 space-y-5 font-semibold">
              <Link to="/" onClick={close} className="block text-lg">
                Home
              </Link>
              <Link to="/about-us" onClick={close} className="block text-lg">
                About Us
              </Link>

              <div>
                <button
                  onClick={() => setResOpen((v) => !v)}
                  className="flex items-center gap-2 text-lg w-full"
                >
                  Resources
                  <ChevronDown className={`w-5 h-5 transition ${resOpen ? "rotate-180" : ""}`} />
                </button>
                {resOpen && (
                  <ul className="mt-3 ml-3 space-y-3 text-base font-medium">
                    {resourceLinks.map((item) => (
                      <li key={item.to}>
                        <Link to={item.to} onClick={close} className="block">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <button
                  onClick={() => setProgOpen((v) => !v)}
                  className="flex items-center gap-2 text-lg w-full"
                >
                  Programs
                  <ChevronDown className={`w-5 h-5 transition ${progOpen ? "rotate-180" : ""}`} />
                </button>
                {progOpen && (
                  <ul className="mt-3 ml-3 space-y-3 text-base font-medium">
                    {programLinks.map((item) => (
                      <li key={item.to}>
                        <Link to={item.to} onClick={close} className="block">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <Link to="/get-involved" onClick={close} className="block text-lg">
                Get Involved
              </Link>
              <Link to="/contact-us" onClick={close} className="block text-lg">
                Contact
              </Link>

              <ClientOnly>
                <MobileAuthAffordance onNavigate={close} />
              </ClientOnly>
            </nav>
          </div>
        </>
      )}
    </>
  );
}

function MobileAuthAffordance({ onNavigate }: { onNavigate: () => void }) {
  const { user, loading } = useAuthUser();
  if (loading) return null;
  if (!user) {
    return (
      <Link
        to="/login"
        onClick={onNavigate}
        className="inline-block mt-4 px-6 py-2 uppercase text-sm bg-brown text-white rounded-full hover:bg-darkGreyBrown transition"
      >
        Login
      </Link>
    );
  }
  return (
    <div className="mt-4 space-y-3">
      <p className="text-sm text-darkGreyBrown/80 break-all">{user.email}</p>
      <Link
        to="/account"
        onClick={onNavigate}
        className="block text-lg"
      >
        My Account
      </Link>
      <button
        onClick={() => {
          onNavigate();
          void signOut();
        }}
        className="inline-block px-6 py-2 uppercase text-sm bg-darkGreyBrown text-tan rounded-full hover:bg-brown transition"
      >
        Sign out
      </button>
    </div>
  );
}
