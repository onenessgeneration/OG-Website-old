import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { ImagePlaceholder } from "@/components/Placeholder";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/get-involved")({
  head: () => ({
    meta: [
      { title: "Get Involved — Oneness Generation" },
      { name: "description", content: "Sign up to be part of the community and join your local OG club." },
    ],
  }),
  component: GetInvolvedPage,
});

const communities = [
  ["IG Announcements", "https://www.instagram.com/channel/AbbJshTc_0BAwnm8/"],
  ["Global OG Community", "https://chat.whatsapp.com/Hq26zSG59ODDLlColOIHgA"],
  ["India club (Gujarat)", "https://chat.whatsapp.com/EquZE5kSHqBFHhOhSkXq6n"],
  ["India club (Tamil Nadu)", "https://chat.whatsapp.com/Hu1o3rwMSzKAp9GVO6oKOE"],
  ["India club (Karnataka)", "https://chat.whatsapp.com/I67nAHwDsbv5J28dwEkBfb"],
  ["India club (Andhra Pradesh / Telangana)", "https://chat.whatsapp.com/KK3mVmaB7Ig7hh8ZdBTgbi"],
  ["India club (Maharashtra)", "https://chat.whatsapp.com/HjPwN97UyCS2dxgI1GwO36"],
  ["South America Club", "https://chat.whatsapp.com/Ik5rMqDuNIf6oAfhlFVhLw"],
  ["North America Club (USA / Canada)", "https://ig.me/j/AbZ5yNaoJGqg19CN/"],
  ["Europe Club", "https://chat.whatsapp.com/Bb1tc74bqB5ClxVMPgoHef"],
  ["Asia Club", "https://chat.whatsapp.com/Jbz9NmkGeujERnkSjaFgRH"],
  ["African Club", "https://chat.whatsapp.com/E4Zhutk6r5SJ70ojrGuZWj"],
] as const;

function GetInvolvedPage() {
  const [form, setForm] = useState({ name: "", email: "", country: "", agreed: false });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("newsletter_signups").insert(form);
    setSubmitting(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      toast.success("Welcome! You're now part of the OG community.");
      setForm({ name: "", email: "", country: "", agreed: false });
    }
  };

  return (
    <>
      <section className="bg-soft-gradient border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
              Sign up to be part of the community
            </h1>
            <p className="text-muted-foreground mb-6">
              Receive monthly updates and a free breathing room meditation.
            </p>
            <form onSubmit={submit} className="space-y-3 bg-card p-6 rounded-2xl border border-border shadow-card">
              <input required placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-md border border-input bg-background px-4 py-2.5" />
              <input required type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-md border border-input bg-background px-4 py-2.5" />
              <input required placeholder="Select Country *" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full rounded-md border border-input bg-background px-4 py-2.5" />
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={form.agreed} onChange={(e) => setForm({ ...form, agreed: e.target.checked })} required />
                I agree to receive a newsletter
              </label>
              <button disabled={submitting} className="w-full bg-primary text-primary-foreground rounded-full py-3 font-semibold hover:bg-primary-glow transition disabled:opacity-50">
                {submitting ? "Submitting…" : "Submit"}
              </button>
            </form>
          </div>
          <ImagePlaceholder label="Volunteer with us" aspect="4/3" />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-gradient">Join Your Local Community</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {communities.map(([name, url]) => (
            <a key={name} href={url} target="_blank" rel="noreferrer" className="bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-soft transition text-center">
              <ImagePlaceholder label={name} aspect="1/1" rounded="rounded-full" className="w-24 h-24 mx-auto mb-4" />
              <h3 className="font-bold text-sm mb-3">{name}</h3>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">Join</span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
