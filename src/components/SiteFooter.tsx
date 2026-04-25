import { Link } from "@tanstack/react-router";
import {
  CircleFadingArrowUp,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  Music2,
  Send,
  Twitch,
  Youtube,
} from "lucide-react";

const menu = [
  ["Home", "/"],
  ["About Us", "/about-us"],
  ["Programs", "/programs"],
  ["Blogs", "/blog"],
  ["Trainers", "/sfz"],
  ["Soul Sync", "/soul-sync"],
  ["Serene Mind", "/serene-mind"],
  ["Oneness Yoga", "/oneness-yoga"],
  ["Gallery", "/gallery"],
  ["Wallpapers", "/wallpapers"],
  ["Get Involved", "/get-involved"],
  ["Contact", "/contact-us"],
  ["Login", "/login"],
] as const;

const social = [
  ["WhatsApp", "https://chat.whatsapp.com/GZjYKf34xfwLWVkP5Ss0IJ", MessageCircle],
  ["Instagram", "https://www.instagram.com/onenessgeneration/", Instagram],
  ["Twitch", "https://www.twitch.tv/onenessgeneration", Twitch],
  ["Snapchat", "https://www.snapchat.com/add/one.gen", CircleFadingArrowUp],
  ["Facebook", "https://www.facebook.com/onenessgeneration", Facebook],
  ["LinkedIn", "https://www.linkedin.com/company/onenessgeneration/", Linkedin],
  ["TikTok", "https://www.tiktok.com/@oneness.generation", Music2],
  ["YouTube", "https://www.youtube.com/@OnenessGeneration", Youtube],
] as const;

const policies = ["Terms & Conditions", "Privacy Policy", "Cookie Policy"] as const;

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-secondary">
      <div className="container-shell px-4 sm:px-6">
        <div className="border-t border-border py-10">
          <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr] lg:grid-cols-[1.2fr_1fr_1.1fr]">
            <div className="grid gap-3 text-[1.05rem] text-primary">
              <h3 className="text-[1.05rem] font-semibold">Menu</h3>
              <div className="grid gap-3 text-[0.97rem]">
                {menu.map(([label, to]) => (
                  <Link key={to} to={to} className="transition hover:opacity-75">
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-8 text-primary">
              <div>
                <h3 className="mb-3 text-[1.05rem] font-semibold">Follow Us</h3>
                <div className="grid gap-3 text-[0.97rem]">
                  {social.map(([label, url, Icon]) => (
                    <a key={url} href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 transition hover:opacity-75">
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-[1.05rem] font-semibold">Policies</h3>
                <div className="grid gap-3 text-[0.97rem]">
                  {policies.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-primary">
              <h3 className="mb-3 text-[1.05rem] font-semibold">Contact Us</h3>
              <div className="grid gap-3 text-[0.97rem]">
                <a href="mailto:hello@onenessgeneration.org" className="transition hover:opacity-75">
                  Email: hello@onenessgeneration.org
                </a>
                <a href="tel:+917095001991" className="transition hover:opacity-75">
                  Phone: +91 70950 01991
                </a>
              </div>
            </div>
          </div>

          <div className="pt-12 text-center text-[clamp(2rem,5vw,4rem)] font-medium leading-none text-muted-foreground/70">
            © 2026 Oneness Generation. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
