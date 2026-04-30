import { createFileRoute } from "@tanstack/react-router";
import { ImagePlaceholder } from "@/components/Placeholder";

export const Route = createFileRoute("/about-us")({
  head: () => ({
    meta: [
      { title: "About Us — Oneness Generation" },
      {
        name: "description",
        content: "A movement, a generation of young people moving towards Oneness.",
      },
    ],
  }),
  component: AboutPage,
});

const sections = [
  {
    title: "Who We Are",
    eyebrow: "The Oneness Generation",
    body: "Oneness Generation is founded by Sri Preethaji and Sri Krishnaji, enlightened leaders, and co-creators of the Oneness Movement. Oneness Generation is a non-profit initiative of Oneness, driven by volunteers. We are a community of young people who share a common passion - to live a life of connection, joy, and wholeness. We’re a movement for anyone who’s ready to shift out of stress and live life deeply.",
    bgClass: "bg-band-cream",
    titleClass: "text-primary",
    subtitleClass: "text-primary",
    textClass: "text-foreground/90",
    imageFirst: false,
  },
  {
    title: "Vision",
    eyebrow: "Empowering Young Minds",
    body: "Empowering young people to break free of stress and find a calm, centered state of mind. We are a community of youth who work together to become free of the shackles of everyday stress and shift from a distressed beta state of mind (cause who likes that!) to a calm and centered alpha state. Our mission is to make stress-free living a reality for young people.....",
    bgClass: "bg-band-tan",
    titleClass: "text-foreground",
    subtitleClass: "text-foreground",
    textClass: "text-foreground/90",
    imageFirst: true,
  },
  {
    title: "The Magic Switch: Beta to Alpha",
    eyebrow: "Transform Your State of Mind",
    body: "The beta brain wave state is where most of us spend much of our time. In beta, the brain operates at a fast frequency—13 to 30 Hz—and the mind becomes like a ‘monkey mind’: anxious, constantly swinging from one thought to another, distracted by every worry, task, or notification. Just like a monkey leaping from branch to branch, the mind in beta doesn’t rest; it keeps moving, searching for somethi...",
    bgClass: "bg-band-cream",
    titleClass: "text-primary",
    subtitleClass: "text-primary",
    textClass: "text-foreground/90",
    imageFirst: false,
  },
  {
    title: "Oneness",
    eyebrow: "Guided by Wisdom",
    body: "To fulfil our vision, we seek guidance, spiritual wisdom, and insights from the Oneness movement. Oneness is a global movement in consciousness, founded by Sri Preethaji and Sri Krishnaji, with a presence in over 100 countries. This transformative spiritual movement has guided millions towards profound healing, a direct experience of their inner divinity, and the manifestation of awe-inspiring mir...",
    bgClass: "bg-band-tan",
    titleClass: "text-foreground",
    subtitleClass: "text-foreground",
    textClass: "text-foreground/90",
    imageFirst: true,
  },
] as const;

function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="h-[280px] w-full md:h-[360px]">
          <ImagePlaceholder
            label={undefined}
            aspect="auto"
            rounded="rounded-none"
            className="h-full w-full border-0"
          />
        </div>
        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-x-0 bottom-0 top-0 flex items-center">
          <div className="container-shell px-8 sm:px-12">
            <h1 className="max-w-[980px] text-[clamp(2.8rem,5.8vw,5rem)] font-normal uppercase leading-[0.95] text-white">
              A Movement, A Generation of Young People Moving Towards Oneness.
            </h1>
          </div>
        </div>
      </section>

      <section className="pb-0 pt-0">
        {sections.map((section) => (
          <div key={section.title} className={`${section.bgClass}`}>
            <div className="container-shell px-6 py-9 sm:px-8 md:px-10 md:py-10">
              <div
                className={`grid items-center gap-8 md:grid-cols-[0.96fr_0.94fr] md:gap-10 ${section.imageFirst ? "" : "md:[direction:rtl]"}`}
              >
                <div className="md:[direction:ltr]">
                  <div className="overflow-hidden rounded-[22px]">
                    <ImagePlaceholder
                      label={undefined}
                      aspect="16/11"
                      rounded="rounded-[22px]"
                      className="border-0"
                    />
                  </div>
                </div>

                <div className="md:[direction:ltr] px-4 md:px-0">
                  <h2
                    className={`text-[clamp(2.2rem,3.5vw,3.7rem)] font-semibold leading-[0.95] ${section.titleClass}`}
                  >
                    {section.title}
                  </h2>
                  <div
                    className={`mt-4 text-[clamp(1.35rem,2vw,1.9rem)] font-medium ${section.subtitleClass}`}
                  >
                    {section.eyebrow}
                  </div>
                  <p className={`mt-5 max-w-[38rem] text-[1.05rem] leading-9 ${section.textClass}`}>
                    {section.body}
                    <span className="text-primary underline underline-offset-2"> Read More</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
