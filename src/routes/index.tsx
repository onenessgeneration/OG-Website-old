import { createFileRoute, Link } from "@tanstack/react-router";
import { ImagePlaceholder, VideoPlaceholder } from "@/components/Placeholder";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Oneness Generation — What is Oneness Generation?" },
      { name: "description", content: "Empowering youth to break free of stress and find a calm, joyful state of mind." },
    ],
  }),
  component: HomePage,
});

const testimonials = [
  { name: "Yuvisti", place: "South Africa", quote: "Oneness Generation transformed my academic life; through yoga and meditation, I found clarity and calm to balance studies with a clearer mind and reduced stress." },
  { name: "Lisa", place: "Germany", quote: "Oneness Generation feels like family—a place where we're united by a shared goal to make a meaningful, positive impact that I truly appreciate and support." },
  { name: "Sanjay", place: "Zurich, Switzerland", quote: "Guided by Sri Krishnaji and Sri Preethaji, Oneness has been my journey into awakening — dissolving old patterns, opening my heart, and living in a state of connection and grace." },
  { name: "Nidhi Dev", place: "Pune, Maharashtra", quote: "I would really, ardently love to find each one of you, reading this, experience this liberation, this joy, this bliss, as I have found in me…" },
  { name: "Jordan Tan", place: "Malaysia", quote: "Oneness Generation brought healing and a new appreciation for life's simple joys. It's been a blessing to connect with dasas, Sri Preethaji and Sri Krishnaji, and their transformative teachings." },
  { name: "Vaishnavi", place: "Belgaum, India", quote: "From my first session, I felt a relief from stress; yoga and meditation practices have grounded me and brought balance to even my busiest days." },
  { name: "Shubham", place: "Mumbai, India", quote: "Joining Oneness Generation from the start has been transformative. Teaching Soul Sync and sharing peace with others brings fulfillment and inspires me to keep spreading joy." },
  { name: "Leon", place: "Germany", quote: "The Oneness Generation unites people of the same age worldwide, creating a supportive community focused on meditation, yoga, and growth in a peaceful, non-judgmental space." },
  { name: "Jagan", place: "South Africa", quote: "The teachings and meditations have empowered me to live in the present and face life's challenges alongside compassionate, like-minded people sharing the same values." },
];

function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-soft-gradient overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-sm uppercase tracking-widest text-accent font-semibold mb-4">Vision</div>
            <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-6">
              What is Oneness Generation?
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Empowering youth to break free of stress and find a calm, joyful state of mind.
            </p>
            <p className="text-base text-muted-foreground mb-8">
              We're a community of young people with a vision to help ourselves and our fellow youth become free from the shackles of everyday stress and shift from a high-stress beta state of mind to a calm and centered alpha state. Our mission is to make stress-free living a reality for young people.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/about-us" className="px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary-glow transition shadow-soft">
                Learn More
              </Link>
              <Link to="/get-involved" className="px-6 py-3 rounded-full bg-background border border-primary text-primary hover:bg-secondary transition">
                Join the Movement
              </Link>
            </div>
          </div>
          <VideoPlaceholder label="Vision Video" aspect="16/9" />
        </div>
      </section>

      {/* Vision gallery */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ImagePlaceholder key={i} label={`Gallery ${i + 1}`} aspect="4/5" />
          ))}
        </div>
      </section>

      {/* What's new */}
      <section className="py-16 bg-secondary/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-gradient">What's New?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-card border border-border">
                <ImagePlaceholder label={`Event ${i}`} aspect="16/9" rounded="rounded-none" />
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">SFZ Training</h3>
                  <p className="text-muted-foreground mb-4">Dates will be announced soon.</p>
                  <Link to="/sfz" className="text-primary font-semibold hover:text-primary-glow">
                    Become an OG Trainer →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="text-sm uppercase tracking-widest text-accent font-semibold mb-2">Testimonials</div>
          <h2 className="text-3xl md:text-5xl font-bold text-gradient">What Our Awesome Participants Say</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-card rounded-2xl p-6 shadow-card border border-border">
              <ImagePlaceholder label={`${t.name}'s Photo`} aspect="1/1" className="w-20 h-20 mb-4" rounded="rounded-full" />
              <h3 className="font-bold text-lg">{t.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">({t.place})</p>
              <p className="text-sm text-foreground/80 italic">&ldquo;{t.quote}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram posts */}
      <section className="py-16 bg-secondary/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-10 text-gradient">Instagram Posts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ImagePlaceholder key={i} label={`Instagram ${i + 1}`} aspect="1/1" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
