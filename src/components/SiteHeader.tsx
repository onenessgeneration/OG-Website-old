import { Link } from "@tanstack/react-router";
import { useState } from "react";
const logoUrl = "/logo.png";
import { MobileMenu } from "./MobileMenu";
import { ClientOnly } from "./ClientOnly";
import { useAuthUser } from "@/hooks/useAuthUser";
import { signOut } from "@/lib/auth";


// Ported from OG_Website oneness-frontend/src/Common/Header.jsx.
// Preserves the original bg-tan / text-brown palette, chevron dropdowns,
// and Login pill button.

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

function ChevronDownSvg() {
  return (
    <svg className="w-5 h-5 text-brown" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
    </svg>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-tan text-brown shadow-lg sticky top-0 z-[1000]">
      <div className="container mx-auto px-5 flex items-center justify-between py-3 md:py-4 space-x-5">
        <a href="/" className="shrink-0">
          <img src={logoUrl} alt="Logo" className="md:w-24 w-20" />
        </a>

        <div className="w-full flex justify-end items-center gap-5 text-brown">
          <div className="lg:flex items-center gap-8 font-semibold hidden">
            <Link to="/" className="menu-item xl:text-lg text-[13px]">
              Home
            </Link>
            <Link to="/about-us" className="menu-item xl:text-lg text-[13px] whitespace-nowrap">
              About Us
            </Link>

            {/* Resources dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-gray-800">
                <span className="xl:text-lg text-sm font-semibold text-brown">Resources</span>
                <ChevronDownSvg />
              </button>
              <ul className="absolute z-50 left-0 xl:text-lg text-sm bg-white rounded-md shadow-lg text-brown hidden group-hover:block w-48">
                {resourceLinks.map((item, i) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={
                        "block px-4 py-2 w-full text-left" +
                        (i === 0 ? " rounded-t-md" : "") +
                        (i === resourceLinks.length - 1 ? " rounded-b-md" : "")
                      }
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Programs dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-gray-800">
                <span className="xl:text-lg text-sm font-semibold text-brown">Programs</span>
                <ChevronDownSvg />
              </button>
              <ul className="absolute z-50 left-0 xl:text-lg text-sm bg-white rounded-md shadow-lg text-brown hidden group-hover:block w-48">
                {programLinks.map((item, i) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={
                        "block px-4 py-2 w-full text-left" +
                        (i === 0 ? " rounded-t-md" : "") +
                        (i === programLinks.length - 1 ? " rounded-b-md" : "")
                      }
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <Link to="/get-involved" className="menu-item xl:text-lg text-[13px] whitespace-nowrap">
              Get Involved
            </Link>
            <Link to="/contact-us" className="menu-item xl:text-lg text-[13px] whitespace-nowrap">
              Contact
            </Link>
            <ClientOnly fallback={<span className="md:px-6 px-4 md:py-[6px] py-[4px] invisible">Login</span>}>
              <AuthAffordance />
            </ClientOnly>
          </div>


          <div className="lg:hidden block md:mt-0 mt-1">
            <MobileMenu
              open={mobileOpen}
              onOpenChange={setMobileOpen}
              resourceLinks={resourceLinks}
              programLinks={programLinks}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function AuthAffordance() {
  const { user, loading } = useAuthUser();

  if (loading) {
    return <span className="md:px-6 px-4 md:py-[6px] py-[4px] invisible">Login</span>;
  }

  if (!user) {
    return (
      <Link
        to="/login"
        className="md:px-6 px-4 uppercase text-[14px] relative md:py-[6px] py-[4px] bg-brown text-white rounded-full hover:bg-darkGreyBrown transition duration-300"
      >
        Login
      </Link>
    );
  }

  const label = user.email ?? "Account";

  return (
    <div className="relative group">
      <button className="md:px-6 px-4 uppercase text-[14px] md:py-[6px] py-[4px] bg-brown text-white rounded-full hover:bg-darkGreyBrown transition duration-300 max-w-[180px] truncate">
        {label}
      </button>
      <ul className="absolute right-0 z-50 top-full xl:text-lg text-sm bg-white rounded-md shadow-lg text-brown hidden group-hover:block w-48">
        <li>
          <Link to="/account" className="block px-4 py-2 rounded-t-md">
            My Account
          </Link>
        </li>
        <li>
          <button
            onClick={() => void signOut()}
            className="block w-full text-left px-4 py-2 rounded-b-md"
          >
            Sign out
          </button>
        </li>
      </ul>
    </div>
  );
}

