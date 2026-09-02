import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/app-client";
import { toast } from "sonner";
import { SiteImage } from "@/components/SiteMedia";

export const Route = createFileRoute("/contact-us")({
  head: () => ({
    meta: [
      { title: "Contact Us — Oneness Generation" },
      { name: "description", content: "Let's connect — reach out to the Oneness Generation team." },
      { property: "og:title", content: "Contact Us — Oneness Generation" },
      { property: "og:description", content: "Let's connect — reach out to the Oneness Generation team." },
    ],
  }),
  component: ContactPage,
});

const CONTACT_DEFAULT =
  "https://res.cloudinary.com/drxwnjtcn/image/upload/v1749203630/Oneness-Generation/Summer%20Camp%20Events/_DSC9402_hj84tx.jpg";

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name,
      email: form.email,
      message: form.message,
    });
    setSubmitting(false);
    if (error) toast.error("Failed to send the message.");
    else {
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    }
  };

  const Overlay = (
    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl md:text-center flex flex-col justify-center items-center p-6">
      <h1 className="md:text-2xl font-bold text-white uppercase md:mb-5">Let's Connect</h1>
      <div className="w-fit text-white space-y-1 md:space-y-2">
        <p className="text-[13px] md:text-lg font-semibold">OG WhatsApp Number: +91 70950 01991</p>
        <p className="text-[13px] md:text-lg font-semibold">OG Email: hello@onenessgeneration.org</p>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center md:px-12 px-4 bg-gray-100 md:py-16 py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid w-full gap-6 p-2 md:p-8 md:gap-10"
      >
        <div className="lg:flex items-center lg:gap-10 lg:space-y-0 space-y-5">
          <div className="relative w-full lg:w-1/2 h-96 md:h-[410px] lg:block hidden">
            <SiteImage path="contact/hero.jpg" defaultSrc={CONTACT_DEFAULT} alt="Contact Us" fallbackAspect="3/4" fallbackRounded="rounded-xl" className="w-full h-full object-cover rounded-xl" />
            {Overlay}
          </div>

          <form
            onSubmit={submit}
            className="space-y-5 grid lg:w-1/2 w-full rounded-xl shadow-md border bg-white border-gray-200 md:p-7 p-3"
          >
            <h2 className="font-bold md:text-2xl uppercase">Contact</h2>
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
            <textarea
              required
              rows={3}
              placeholder="Message *"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              maxLength={250}
              className="w-full p-2 border-b-2 resize-none focus:outline-none"
            />
            <motion.button
              type="submit"
              disabled={submitting}
              className={`bg-brown hover:bg-tanAccent text-white justify-self-center py-3 w-fit px-5 rounded-lg font-semibold mt-4 ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {submitting ? "Submitting..." : "Submit"}
            </motion.button>
          </form>

          <div className="relative w-full lg:w-1/2 h-96 lg:hidden block">
            <SiteImage path="contact/hero.jpg" defaultSrc={CONTACT_DEFAULT} alt="Contact Us" fallbackAspect="3/4" fallbackRounded="rounded-xl" className="w-full h-full object-cover rounded-xl" />
            {Overlay}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
