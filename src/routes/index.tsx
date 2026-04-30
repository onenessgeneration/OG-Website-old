import { createFileRoute } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { useRef, useState } from "react";
import { ImagePlaceholder } from "@/components/Placeholder";

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
    extra:
      "“I would really, ardently love to find each one of you, reading this, experience this liberation, this joy, this bliss, as I have found in me…”",
  },
  {
    name: "Jordan Tan",
    place: "Malaysia",
    quote:
      "A space for healing, transformation, and inner connection. I've learned to appreciate even the smallest things in life, and that has completely shifted my attitude toward life. The presence of the dasas, Sri Preethaji and Sri Krishnaji, the places...",
    extra:
      "“Oneness Generation brought healing and a new appreciation for life's simple joys. It's been a blessing to connect with dasas, Sri Preethaji and Sri Krishnaji, and their transformative teachings.”",
  },
  {
    name: "Aarav Sharma",
    place: "Bengaluru, India",
    quote:
      "Through this community I learned to slow down and breathe. The practices have given me a quiet centre I can return to whenever life gets loud. I am grateful for the friendships and the teachings that continue to shape me each day...",
    extra:
      "“A place that feels like home — gentle, expansive, and deeply transformative.”",
  },
  {
    name: "Mei Lin",
    place: "Singapore",
    quote:
      "Oneness Generation gave me tools to navigate stress with grace. The meditations are simple yet profound, and the community feels like family. I leave each session lighter and more present in my own life...",
    extra:
      "“A truly nourishing experience for the heart and mind.”",
  },
];

// Duplicate the list once so the marquee loops seamlessly.
const marqueeItems = [...testimonials, ...testimonials];

// Hand-drawn dashed wavy arrow that curves down then to the right and ends in an arrowhead.
function DashedArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 220"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="6 8"
      className={className}
      aria-hidden="true"
    >
      <path d="M60 4 C 30 40, 100 80, 50 120 C 10 150, 90 170, 60 200" />
      {/* Arrow head — solid (no dash) */}
      <path d="M48 192 L60 206 L72 192" strokeDasharray="0" />
    </svg>
  );
}

function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  return (
    <section className="relative bg-black">
      <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          poster=""
          playsInline
          controls={playing}
          preload="metadata"
        />
        {/* Soft dark overlay so the title/play button read on top of any frame */}
        {!playing && (
          <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
        )}

        {!playing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <h1 className="text-[clamp(1.75rem,4vw,3rem)] font-semibold text-white drop-shadow">
              What is Oneness Generation?
            </h1>
            <button
              type="button"
              onClick={handlePlay}
              className="mt-10 inline-flex items-center gap-4 rounded-full border border-white/80 bg-white/10 px-8 py-4 text-white backdrop-blur-sm transition hover:bg-white/20"
              aria-label="Play hero video"
            >
              <span className="text-xl font-medium">Play</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/80">
                <Play className="h-4 w-4 fill-white" />
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <HeroVideo />

      {/* VISION — olive panel */}
      <section className="bg-[var(--panel-olive)] py-20 md:py-28">
        <div className="container-shell grid items-start gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.95fr]">
          <div className="max-w-3xl text-white">
            <h2 className="mb-8 text-6xl font-semibold md:text-7xl">Vision</h2>
            <p className="mb-8 text-xl text-white/95 md:text-2xl">
              Empowering youth to break free of stress and find a calm, joyful state of mind
            </p>
            <div className="space-y-7 text-lg text-white/90 md:text-[1.1rem] leading-relaxed">
              <p>
                We&apos;re a community of young people with a vision to help ourselves and our fellow
                youth become free from the shackles of everyday stress and shift from a high-stress
                beta state of mind to a calm and centered alpha state.
              </p>
              <p>Our mission is to make stress-free living a reality for young people.</p>
            </div>
          </div>

          <div className="relative">
            <ImagePlaceholder label="Vision Group" aspect="16/11" rounded="rounded-[28px]" />
            {/* Dashed arrow tucked beneath/right of the image */}
            <DashedArrow className="pointer-events-none absolute -bottom-32 right-10 h-44 w-24 text-white/85" />
          </div>
        </div>
      </section>

      {/* IMAGE MOSAIC — pure pictures, varied widths/heights */}
      <section className="bg-background py-12 md:py-16">
        <div className="container-shell px-4 sm:px-6">
          {/* Top row: 4 columns, last two narrower */}
          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-3">
              <ImagePlaceholder label="" aspect="3/4" rounded="rounded-[18px]" />
            </div>
            <div className="md:col-span-4">
              <ImagePlaceholder label="" aspect="4/3" rounded="rounded-[18px]" />
            </div>
            <div className="md:col-span-3">
              <ImagePlaceholder label="" aspect="4/3" rounded="rounded-[18px]" />
            </div>
            <div className="md:col-span-2">
              <ImagePlaceholder label="" aspect="3/4" rounded="rounded-[18px]" />
            </div>
          </div>
          {/* Bottom row: wide left, large right */}
          <div className="mt-5 grid gap-5 md:grid-cols-12">
            <div className="md:col-span-7">
              <ImagePlaceholder label="" aspect="16/7" rounded="rounded-[18px]" />
            </div>
            <div className="md:col-span-5">
              <ImagePlaceholder label="" aspect="4/3" rounded="rounded-[18px]" />
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S NEW */}
      <section className="bg-background py-12 md:py-16">
        <div className="container-shell px-4 text-center sm:px-6">
          <h2 className="text-[clamp(2.25rem,4vw,3.25rem)] font-semibold text-[var(--panel-olive)]">
            What&apos;s new?
          </h2>
        </div>
        <div className="mt-10">
          <div className="relative">
            <ImagePlaceholder
              label="Featured"
              aspect="21/9"
              rounded="rounded-none"
              className="border-x-0"
            />
            {/* SFZ Training overlay card */}
            <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-6 sm:p-12">
              <div className="pointer-events-auto w-full max-w-md rounded-[20px] bg-gradient-to-br from-[oklch(0.94_0.05_70)] to-[oklch(0.88_0.08_55)] p-10 text-center shadow-card">
                <h3 className="text-3xl font-semibold text-foreground">SFZ Training</h3>
                <p className="mt-3 text-base text-foreground/80">Dates Will be Announced soon.</p>
                <button className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--panel-olive)] px-7 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-90">
                  Become an OG Trainer
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — auto-scrolling marquee */}
      <section className="bg-background py-20 md:py-24">
        <div className="container-shell mb-12 grid gap-6 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="space-y-7">
            <div className="inline-flex rounded-full border border-primary/40 px-5 py-2 text-base font-semibold text-primary">
              Testimonials
            </div>
            <h2 className="max-w-md text-4xl font-semibold leading-tight text-foreground md:text-5xl">
              What Our Awesome Participants Say
            </h2>
          </div>
        </div>

        <div className="marquee-mask overflow-hidden">
          <div className="flex w-max gap-8 animate-marquee px-6">
            {marqueeItems.map((item, i) => (
              <article
                key={`${item.name}-${i}`}
                className="w-[420px] shrink-0 rounded-[20px] border border-border bg-secondary px-8 py-9 shadow-card sm:w-[480px]"
              >
                <div className="mb-5 flex items-start gap-4">
                  <ImagePlaceholder
                    label=""
                    aspect="1/1"
                    rounded="rounded-full"
                    className="h-16 w-16 shrink-0"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {item.name}{" "}
                      <span className="font-normal text-foreground/70">({item.place})</span>
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">Testimonial</p>
                  </div>
                </div>
                <p className="text-[0.95rem] leading-7 text-muted-foreground">
                  {item.quote}{" "}
                  <span className="font-semibold text-primary">Read More</span>
                </p>
                <p className="mt-5 text-[0.95rem] leading-7 text-muted-foreground">{item.extra}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM POSTS (no contact form) */}
      <section className="bg-background py-16 md:py-20">
        <div className="container-shell px-4 text-center sm:px-6">
          <h2 className="text-[clamp(2.25rem,4vw,3.25rem)] font-semibold text-[var(--panel-olive)]">
            Instagram Posts
          </h2>
        </div>
      </section>
    </>
  );
}
