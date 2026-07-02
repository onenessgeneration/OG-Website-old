import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaSnapchatGhost,
  FaTiktok,
  FaTwitch,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { Link } from "@tanstack/react-router";

// Ported from OG_Website oneness-frontend/src/Common/Footer.jsx.

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <div className="bg-tan">
      <div className="bg-tan text-brown py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 md:gap-8 gap-4 w-full">
            {/* Main Menu */}
            <div>
              <h2 className="md:text-lg text-sm font-semibold md:mb-4 mb-2">Menu</h2>
              <ul className="md:space-y-4 space-y-2">
                <li><Link to="/" className="hover:underline">Home</Link></li>
                <li><Link to="/about-us" className="hover:underline">About Us</Link></li>
                <li><Link to="/programs" className="hover:underline">Programs</Link></li>
                <li><Link to="/blog" className="hover:underline">Blogs</Link></li>
                <li><a href="/trainer" className="hover:underline">Trainers</a></li>
                <li><Link to="/soul-sync" className="hover:underline">Soul Sync</Link></li>
                <li><Link to="/serene-mind" className="hover:underline">Serene Mind</Link></li>
                <li><Link to="/oneness-yoga" className="hover:underline">Oneness Yoga</Link></li>
                <li><Link to="/gallery" className="hover:underline">Gallery</Link></li>
                <li><Link to="/wallpapers" className="hover:underline">Wallpapers</Link></li>
                <li><Link to="/get-involved" className="hover:underline">Get Involved</Link></li>
                <li><Link to="/contact-us" className="hover:underline">Contact</Link></li>
                <li><Link to="/login" className="hover:underline">Login</Link></li>
              </ul>
            </div>

            {/* Social + Policies */}
            <div className="space-y-6">
              <div>
                <h2 className="md:text-lg text-sm font-semibold md:mb-4 mb-2">Follow Us</h2>
                <ul className="md:space-y-4 space-y-3">
                  <li className="flex items-center space-x-2">
                    <FaWhatsapp />
                    <a href="https://chat.whatsapp.com/GZjYKf34xfwLWVkP5Ss0IJ" target="_blank" rel="noopener noreferrer" className="hover:underline">WhatsApp</a>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FaInstagram />
                    <a href="https://www.instagram.com/onenessgeneration/" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FaTwitch />
                    <a href="https://www.twitch.tv/onenessgeneration" target="_blank" rel="noopener noreferrer" className="hover:underline">Twitch</a>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FaSnapchatGhost />
                    <a href="https://www.snapchat.com/add/one.gen?share_id=HwJDX3a2uIU&locale=en-US" target="_blank" rel="noopener noreferrer" className="hover:underline">Snapchat</a>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FaFacebook />
                    <a href="https://www.facebook.com/onenessgeneration" target="_blank" rel="noopener noreferrer" className="hover:underline">Facebook</a>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FaLinkedin />
                    <a href="https://www.linkedin.com/company/onenessgeneration/" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FaTiktok />
                    <a href="https://www.tiktok.com/@oneness.generation?_t=ZM-8uwsF9hQ7cs&_r=1" target="_blank" rel="noopener noreferrer" className="hover:underline">Tiktok</a>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FaYoutube />
                    <a href="https://www.youtube.com/@OnenessGeneration" target="_blank" rel="noopener noreferrer" className="hover:underline">Youtube</a>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="md:text-lg text-sm font-semibold md:mb-4 mb-2">Policies</h2>
                <ul className="md:space-y-4 space-y-3">
                  <li><a href="/terms&conditions" className="hover:underline">Terms &amp; Conditions</a></li>
                  <li><a href="/privacy-Policy" className="hover:underline">Privacy Policy</a></li>
                  <li><a href="/cookie-Policy" className="hover:underline">Cookie Policy</a></li>
                </ul>
              </div>
            </div>

            {/* Contact Info */}
            <div className="col-span-2 md:col-span-1">
              <h2 className="md:text-lg text-sm font-semibold md:mb-4 mb-2 w-full">Contact Us</h2>
              <div className="flex md:grid gap-2">
                <a href="mailto:hello@onenessgeneration.org" className="md:text-sm text-[10px]">
                  Email: <span className="hover:underline underline-offset-4">hello@onenessgeneration.org</span>
                </a>
                <a className="md:text-sm text-[10px]" href="tel:+917095001991">
                  Phone: <span className="hover:underline underline-offset-4">+91 70950 01991</span>
                </a>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="mt-8 text-center md:text-4xl text-sm text-gray-400 capitalize">
            © {year} Oneness Generation. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
