import { createFileRoute } from "@tanstack/react-router";
import { ImagePlaceholder, VideoPlaceholder } from "@/components/Placeholder";

export const Route = createFileRoute("/soul-sync")({
  head: () => ({
    meta: [
      { title: "Soul Sync — Oneness Generation" },
      {
        name: "description",
        content:
          "The science and ancient wisdom of Soul Sync — a transformative meditation.",
      },
    ],
  }),
  component: SoulSyncPage,
});

const pillars = [
  {
    title: "Mudra",
    subtitle: "Hand Pose",
    body: "The different touches of our hand in soul sync while counting breaths. Performing them stimulates specific areas of the brain, leading to changes in our mood and consciousness.",
    tone: "bg-panel-olive",
    tilt: "translate-y-0",
    imageLabel: "Mudra",
  },
  {
    title: "Mantra",
    subtitle: "Chant",
    body: "Chants in meditation. Everything in the universe vibrates at a frequency. When we chant a mantra, we produce sound waves that can influence cellular processes, reduce stress, and enhance relaxation.",
    tone: "bg-panel-deep",
    tilt: "-mt-10 md:-mt-14",
    imageLabel: "Mantra",
  },
  {
    title: "Asana",
    subtitle: "Posture",
    body: "Just as mental state impacts physical state, physical state too impacts mental state. Asana refers to postures that can improve brain state. They reduce anxiety and stress, and enhance mindfulness and emotional well-being.",
    tone: "bg-panel-gold",
    tilt: "-mt-10 md:-mt-14",
    imageLabel: "Asana",
  },
  {
    title: "Pranayama",
    subtitle: "Regulation of Breath",
    body: "Pranayama is the art and practice of regulating the flow of oxygen and blood through your body. Breathing in the right ways can improve oxygenation of blood and clear out toxins.",
    tone: "bg-panel-sand",
    tilt: "-mt-10 md:-mt-14",
    imageLabel: "Pranayama",
  },
  {
    title: "Dharana",
    subtitle: "Embody",
    body: "Dharana refers to focused concentration on a single point or object. Benefits include enhanced mental clarity, improved focus, reduced stress, and fostered emotional balance.",
    tone: "bg-panel-moss",
    tilt: "-mt-10 md:-mt-14",
    imageLabel: "Dharana",
  },
  {
    title: "Bhavana",
    subtitle: "Visualization",
    body: "Bhavana, or visualization, uses mental imagery to shape thoughts and intentions. It boosts positive emotions, enhances focus, strengthens creativity, and helps manifest desires.",
    tone: "bg-[oklch(0.57_0.12_65)]",
    tilt: "-mt-10 md:-mt-14",
    imageLabel: "Bhavana",
  },
] as const;

function SoulSyncPage() {
  return (
    <>
      <section className="bg-background pt-2">
        <div className="container-shell px-4 sm:px-6">
          <VideoPlaceholder label="Soul Sync Video" aspect="16/9" rounded="rounded-none" className="border-0" />
        </div>
      </section>

      <section className="bg-background py-12 md:py-16">
        <div className="container-shell px-4 sm:px-6 text-center">
          <h1 className="text-[clamp(2.6rem,5vw,4.4rem)] font-semibold leading-none">
            <span className="text-primary">Science and Ancient Wisdom of </span>
            <span className="text-foreground italic">Soul Sync!</span>
          </h1>
        </div>
      </section>

      <section className="bg-background pb-14 md:pb-24">
        <div className="container-shell px-4 sm:px-6">
          <div className="mx-auto max-w-[1180px]">
            {pillars.map((pillar, index) => (
              <article
                key={pillar.title}
                className={`relative rounded-[28px] px-8 py-10 shadow-card md:px-14 md:py-14 ${pillar.tone} ${pillar.tilt}`}
                style={{ zIndex: pillars.length - index }}
              >
                <div className="grid items-center gap-8 md:grid-cols-[1fr_0.9fr]">
                  <div className="max-w-xl">
                    <h2 className="mb-12 text-4xl font-semibold">{pillar.title}</h2>
                    <div className="mb-7 text-2xl font-semibold">{pillar.subtitle}</div>
                    <p className="text-xl leading-10 text-current/95">{pillar.body}</p>
                  </div>
                  <ImagePlaceholder
                    label={pillar.imageLabel}
                    aspect="16/10"
                    rounded="rounded-[26px]"
                    className="w-full justify-self-end border-white/10 bg-background/10"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-8 md:py-10">
        <div className="container-shell px-4 text-center sm:px-6">
          <h2 className="text-[clamp(2.8rem,5vw,4.4rem)] font-normal uppercase tracking-[0.01em] text-foreground">
            Soul Sync
          </h2>
        </div>
      </section>

      <section className="bg-background pb-16">
        <div className="container-shell px-4 sm:px-6">
          <ImagePlaceholder label="Soul Sync Crowd" aspect="21/8" rounded="rounded-none" className="border-0" />
        </div>
      </section>

      <section className="bg-background pb-20">
        <div className="container-shell overflow-hidden px-4 sm:px-6">
          <div className="overflow-hidden rounded-[28px]">
            <ImagePlaceholder label="Beta to Alpha" aspect="21/8" rounded="rounded-[28px]" />
          </div>
          <div className="bg-background px-6 py-12 md:px-10 md:py-14">
            <h3 className="mb-6 text-[clamp(2.2rem,4vw,3.4rem)] font-semibold text-primary">
              Ready to start your day from an Alpha brainwave state?
            </h3>
            <div className="space-y-7 text-[1.1rem] leading-10 text-foreground md:text-[1.18rem]">
              <p>
                Soul Sync, created by Sri Preethaji, is a 9–12 minute meditation designed to calm your
                mind, expand awareness, and manifest heartfelt intentions. This transformative practice
                blends ancient wisdom with modern neuroscience to create a powerful shift from mental chaos
                to clarity and purpose.
              </p>
              <p>
                The six-step process aligns your breath, mind, and heart, guiding you from a restless beta
                state to a calm, creative alpha state.
              </p>
              <p>
                Whether practiced solo or in a group, this meditation is a gateway to effortless living,
                connecting you deeply with life and setting you on a path of clarity, grace, and purpose.
                Embrace the beauty and power of Soul Sync to start your day in flow.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
