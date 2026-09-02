import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/app-client";
import { toast } from "sonner";
import { SiteImage } from "@/components/SiteMedia";

export const Route = createFileRoute("/get-involved")({
  head: () => ({
    meta: [
      { title: "Get Involved — Oneness Generation" },
      { name: "description", content: "Sign up to be part of the community and join your local OG club." },
      { property: "og:title", content: "Get Involved — Oneness Generation" },
      { property: "og:description", content: "Sign up to be part of the community and join your local OG club." },
    ],
  }),
  component: GetInvolvedPage,
});

const VOLUNTEER_DEFAULT =
  "https://res.cloudinary.com/drxwnjtcn/image/upload/v1749203630/Oneness-Generation/Summer%20Camp%20Events/_DSC9402_hj84tx.jpg";

const communities: Array<{ name: string; url: string }> = [
  { name: "IG Announcements", url: "https://www.instagram.com/channel/AbbJshTc_0BAwnm8/" },
  { name: "Global OG Community", url: "https://chat.whatsapp.com/Hq26zSG59ODDLlColOIHgA" },
  { name: "India club (Gujarat)", url: "https://chat.whatsapp.com/EquZE5kSHqBFHhOhSkXq6n" },
  { name: "India club (Tamil Nadu)", url: "https://chat.whatsapp.com/Hu1o3rwMSzKAp9GVO6oKOE" },
  { name: "India club (Karnataka)", url: "https://chat.whatsapp.com/I67nAHwDsbv5J28dwEkBfb" },
  { name: "India club (Andhra Pradesh / Telangana)", url: "https://chat.whatsapp.com/KK3mVmaB7Ig7hh8ZdBTgbi" },
  { name: "India club (Maharashtra)", url: "https://chat.whatsapp.com/HjPwN97UyCS2dxgI1GwO36" },
  { name: "South America Club", url: "https://chat.whatsapp.com/Ik5rMqDuNIf6oAfhlFVhLw" },
  { name: "North America Club (USA / Canada)", url: "https://ig.me/j/AbZ5yNaoJGqg19CN/" },
  { name: "Europe Club", url: "https://chat.whatsapp.com/Bb1tc74bqB5ClxVMPgoHef" },
  { name: "Asia Club", url: "https://chat.whatsapp.com/Jbz9NmkGeujERnkSjaFgRH" },
  { name: "African Club", url: "https://chat.whatsapp.com/E4Zhutk6r5SJ70ojrGuZWj" },
];

function GetInvolvedPage() {
  const [form, setForm] = useState({ name: "", email: "", mobile: "", country: "", agreed: false });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("newsletter_signups").insert({
      name: form.name,
      email: form.email,
      country: form.country,
      agreed: form.agreed,
    });
    setSubmitting(false);
    if (error) toast.error("Something went wrong. Please try again.");
    else {
      toast.success("Welcome to the community");
      setForm({ name: "", email: "", mobile: "", country: "", agreed: false });
    }
  };

  return (
    <>
      {/* Register / Volunteer */}
      <div className="mx-auto px-5 container md:py-10 py-5">
        <h2 className="text-2xl font-bold text-darkGreyBrown lg:text-3xl text-center md:mb-10 mb-5">
          Sign up to be a part of the community, receive monthly updates, and receive a free breathing room meditation.
        </h2>
        <div className="md:flex justify-center items-center gap-10 md:space-y-0 space-y-5">
          <div className="md:w-1/2">
            <SiteImage
              path="get-involved/hero.jpg"
              defaultSrc={VOLUNTEER_DEFAULT}
              alt="Volunteer"
              fallbackAspect="4/3"
              fallbackRounded="rounded-xl"
              className="w-full h-auto max-h-[450px] object-cover rounded-xl shadow-lg"
            />
          </div>
          <div className="md:w-1/2">
            <form
              onSubmit={submit}
              className="space-y-5 grid w-full rounded-xl shadow-xl border bg-white border-gray-200 md:p-7 p-3"
            >
              <input
                required
                type="text"
                placeholder="Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-2 border-b-2 focus:outline-none"
              />
              <input
                required
                type="email"
                placeholder="Email *"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-2 border-b-2 focus:outline-none"
              />
              <input
                required
                type="tel"
                placeholder="Mobile Number *"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                maxLength={10}
                className="w-full p-2 border-b-2 focus:outline-none"
              />
              <input
                required
                type="text"
                placeholder="Select Country *"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full p-2 border-b-2 focus:outline-none"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.agreed}
                  onChange={(e) => setForm({ ...form, agreed: e.target.checked })}
                />
                <span>I agree to receive a newsletter</span>
              </label>
              <motion.button
                type="submit"
                disabled={submitting}
                className={`bg-brown hover:bg-tanAccent text-white justify-self-center py-3 w-fit px-5 rounded-lg font-semibold mt-4 ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {submitting ? "Submitting..." : "Submit"}
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Local community */}
      <div className="mx-auto px-5 container md:py-10 py-5">
        <h1 className="text-2xl font-bold text-darkGreyBrown lg:text-3xl text-center md:mb-10 mb-5">
          Join Your Local Community
        </h1>
        <div className="grid md:grid-cols-3 grid-cols-2 md:gap-10 gap-5">
          {communities.map((c) => (
            <div
              key={c.name}
              className="bg-tan p-4 grid place-content-center place-items-center rounded-xl space-y-3 text-center"
            >
              <h2 className="text-tanAccent font-semibold md:text-xl text-lg">{c.name}</h2>
              <a
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2 bg-brown text-white rounded-full hover:bg-darkGreyBrown transition duration-300"
              >
                Join
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
