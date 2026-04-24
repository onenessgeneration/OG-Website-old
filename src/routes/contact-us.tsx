import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ImagePlaceholder } from "@/components/Placeholder";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/contact-us")({
  head: () => ({
    meta: [
      { title: "Contact Us — Oneness Generation" },
      { name: "description", content: "Let's connect — reach out to the Oneness Generation team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert(form);
    setSubmitting(false);
    if (error) toast.error("Could not send message. Please try again.");
    else {
      toast.success("Thanks for reaching out — we'll be in touch soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <>
      <section className="relative">
        <ImagePlaceholder label="Contact Us" aspect="21/9" rounded="rounded-none" />
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-6">Let's Connect</h1>
          <p className="text-muted-foreground mb-3">OG WhatsApp Number: <a href="tel:+917095001991" className="text-primary font-semibold">+91 70950 01991</a></p>
          <p className="text-muted-foreground mb-8">OG Email: <a href="mailto:hello@onenessgeneration.org" className="text-primary font-semibold">hello@onenessgeneration.org</a></p>
          <ImagePlaceholder label="Our Community" aspect="4/3" />
        </div>

        <form onSubmit={submit} className="bg-card p-8 rounded-2xl border border-border shadow-card space-y-4">
          <h2 className="text-2xl font-bold mb-2">Contact</h2>
          <input required placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-md border border-input bg-background px-4 py-2.5" />
          <input required type="email" placeholder="Your Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-md border border-input bg-background px-4 py-2.5" />
          <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full rounded-md border border-input bg-background px-4 py-2.5" />
          <textarea required rows={5} placeholder="Your Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full rounded-md border border-input bg-background px-4 py-2.5" />
          <button disabled={submitting} className="w-full bg-primary text-primary-foreground rounded-full py-3 font-semibold hover:bg-primary-glow transition disabled:opacity-50">
            {submitting ? "Submitting…" : "Submit"}
          </button>
        </form>
      </section>
    </>
  );
}
