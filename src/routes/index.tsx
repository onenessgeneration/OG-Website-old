import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImagePlaceholder, VideoPlaceholder } from "@/components/Placeholder";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Oneness Generation — What is Oneness Generation?" },
      {
        name: "description",
        content:
          "Empowering youth to break free of stress and find a calm, joyful state of mind.",
      },
    ],
  }),
  component: HomePage,
});

const testimonials = [
  {
    name: "Nidhi Dev",
    place: "Pune, Maharastra",
    quote:
      "It was when I truly saw myself as who I truly am, as a whole, not just what I pretend to be, in the external, did I become a better individual. Oneness Helped me actually See myself. When I can now see myself in face value, I can also see others and...",
  },
  {
    name: "Jordan Tan",
    place: "Malaysia",
    quote:
      "A space for healing, transformation, and inner connection. I've learned to appreciate even the smallest things in life, and that has completely shifted my attitude toward life. The presence of the dasas, Sri Preethaji and Sri Krishnaji, the places...",
  },
];

const galleryLabels = ["Vision", "Community", "Retreat", "Meditation"] as const;

function HomePage() {
  return (
    <>
      <section className="bg-background">
        <VideoPlaceholder
          label="Homepage Hero"
          aspect="16/9"
          rounded="rounded-b-[18px]"
          className="border-0"
        />
      </section>

      <section className="bg-panel-moss py-16 md:py-24">
        <div className="container-shell grid items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-3xl text-background">
            <h1 className="mb-8 text-5xl font-semibold md:text-6xl">Vision</h1>
            <p className="mb-10 text-xl text-background/95 md:text-2xl">
              Empowering youth to break free of stress and find a calm, joyful state of mind
            </p>
            <div className="space-y-8 text-lg text-background/92 md:text-[1.12rem]">
              <p>
                We&apos;re a community of young people with a vision to help ourselves and our fellow
                youth become free from the shackles of everyday stress and shift from a high-stress
                beta state of mind to a calm and centered alpha state.
              </p>
              <p>Our mission is to make stress-free living a reality for young people.</p>
            </div>
          </div>

          <div className="space-y-8">
            <ImagePlaceholder label="Vision Group" aspect="4/3" rounded="rounded-[34px]" />
            <div className="flex justify-center lg:justify-start">
              <div className="text-6xl text-background/70">↘</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-10">
        <div className="container-shell grid gap-5 px-4 sm:px-6 md:grid-cols-4">
          {galleryLabels.map((label) => (
            <ImagePlaceholder key={label} label={label} aspect="4/5" rounded="rounded-[24px]" />
          ))}
        </div>
      </section>

      <section className="bg-background py-20 md:py-24">
        <div className="container-shell grid gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-8 pt-4">
            <div className="inline-flex rounded-full border border-primary/40 px-5 py-2 text-xl font-semibold text-primary/65">
              Testimonials
            </div>
            <h2 className="max-w-sm text-4xl font-semibold leading-tight text-foreground">
              What Our Awesome Participants Say
            </h2>
            <div className="flex gap-5 text-primary/55">
              <button className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-secondary">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-secondary">
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-2">
            {testimonials.map((item) => (
              <article key={item.name} className="rounded-[20px] border border-border bg-secondary px-10 py-12 shadow-card">
                <div className="mb-6 flex items-start gap-5">
                  <ImagePlaceholder
                    label={item.name}
                    aspect="1/1"
                    rounded="rounded-full"
                    className="h-24 w-24 shrink-0"
                  />
                  <div>
                    <h3 className="text-[2rem] font-semibold text-foreground">{item.name}</h3>
                    <p className="mt-1 text-xl text-foreground/80">({item.place})</p>
                    <p className="mt-6 text-base text-muted-foreground">Testimonial</p>
                  </div>
                </div>
                <p className="text-lg leading-9 text-muted-foreground">
                  {item.quote} <span className="font-semibold text-primary">Read More</span>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-12 md:py-16">
        <div className="container-shell px-4 text-center sm:px-6">
          <h2 className="text-[clamp(2.75rem,4vw,4rem)] font-semibold text-panel-moss">
            Instagram Posts
          </h2>
        </div>
      </section>

      <section className="bg-background pb-12">
        <div className="container-shell px-4 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="overflow-hidden rounded-[26px]">
              <ImagePlaceholder label="Let&apos;s Connect" aspect="16/9" rounded="rounded-[26px]" />
            </div>
            <div className="rounded-[26px] border border-border bg-card px-9 py-9 shadow-card md:px-10 md:py-10">
              <h3 className="mb-8 text-4xl font-semibold uppercase text-foreground">Contact</h3>
              <div className="space-y-9">
                <input
                  placeholder="Name *"
                  className="w-full border-b border-border bg-transparent pb-4 text-xl text-foreground outline-none placeholder:text-muted-foreground"
                />
                <input
                  placeholder="Email *"
                  className="w-full border-b border-border bg-transparent pb-4 text-xl text-foreground outline-none placeholder:text-muted-foreground"
                />
                <textarea
                  rows={4}
                  placeholder="Message *"
                  className="w-full border-b border-border bg-transparent pb-4 text-xl text-foreground outline-none placeholder:text-muted-foreground"
                />
                <div className="pt-2 text-center">
                  <Link
                    to="/contact-us"
                    className="inline-flex rounded-[14px] bg-primary px-7 py-3 text-xl font-semibold text-primary-foreground"
                  >
                    Submit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
