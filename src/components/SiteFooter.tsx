import { Link } from "@tanstack/react-router";

const menu = [
  ["Home", "/"], ["About Us", "/about-us"], ["Programs", "/programs"], ["Blog", "/blog"],
  ["Soul Sync", "/soul-sync"], ["Serene Mind", "/serene-mind"], ["Oneness Yoga", "/oneness-yoga"],
  ["Gallery", "/gallery"], ["Wallpapers", "/wallpapers"], ["Get Involved", "/get-involved"],
  ["Contact", "/contact-us"], ["Login", "/login"],
] as const;

const social = [
  ["WhatsApp", "https://chat.whatsapp.com/GZjYKf34xfwLWVkP5Ss0IJ"],
  ["Instagram", "https://www.instagram.com/onenessgeneration/"],
  ["Twitch", "https://www.twitch.tv/onenessgeneration"],
  ["Snapchat", "https://www.snapchat.com/add/one.gen"],
  ["Facebook", "https://www.facebook.com/onenessgeneration"],
  ["LinkedIn", "https://www.linkedin.com/company/onenessgeneration/"],
  ["TikTok", "https://www.tiktok.com/@oneness.generation"],
  ["YouTube", "https://www.youtube.com/@OnenessGeneration"],
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="font-display text-2xl font-bold mb-3">Oneness Generation</div>
          <p className="text-sm opacity-80">A movement, a generation of young people moving towards Oneness.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-accent">Menu</h4>
          <ul className="space-y-2 text-sm opacity-90">
            {menu.map(([label, to]) => (
              <li key={to}><Link to={to} className="hover:text-accent transition">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-accent">Follow Us</h4>
          <ul className="space-y-2 text-sm opacity-90">
            {social.map(([label, url]) => (
              <li key={url}><a href={url} target="_blank" rel="noreferrer" className="hover:text-accent transition">{label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-accent">Contact</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li><a href="mailto:hello@onenessgeneration.org" className="hover:text-accent">hello@onenessgeneration.org</a></li>
            <li><a href="tel:+917095001991" className="hover:text-accent">+91 70950 01991</a></li>
          </ul>
          <h4 className="font-semibold mt-6 mb-3 text-accent">Policies</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li>Terms &amp; Conditions</li>
            <li>Privacy Policy</li>
            <li>Cookie Policy</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 py-5 text-center text-xs opacity-70">
        © 2026 Oneness Generation. All rights reserved.
      </div>
    </footer>
  );
}
