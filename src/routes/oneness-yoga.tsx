import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import bgAsset from "@/assets/oneness-yoga/onenessyoga.jpg.asset.json";
import one from "@/assets/oneness-yoga/corpse.png.asset.json";
import two from "@/assets/oneness-yoga/exercise.png.asset.json";
import three from "@/assets/oneness-yoga/meditation.png.asset.json";
import four from "@/assets/oneness-yoga/yoga-pose.png.asset.json";
import five from "@/assets/oneness-yoga/yoga-pose2.png.asset.json";
import six from "@/assets/oneness-yoga/yoga-position.png.asset.json";

export const Route = createFileRoute("/oneness-yoga")({
  head: () => ({
    meta: [
      { title: "Oneness Yoga — Oneness Generation" },
      { name: "description", content: "Awaken to body bliss with Oneness Yoga — a harmonious blend of movement and mindfulness." },
      { property: "og:title", content: "Oneness Yoga — Oneness Generation" },
      { property: "og:description", content: "Awaken to body bliss with Oneness Yoga." },
      { property: "og:image", content: bgAsset.url },
    ],
  }),
  component: OnenessYogaPage,
});

function Heading() {
  return (
    <div className="flex justify-center md:my-10 my-5">
      <p className="md:text-6xl text-3xl uppercase text-center md:max-w-[60vw] leading-none font-display text-darkGreyBrown">
        Oneness Yoga
      </p>
    </div>
  );
}

function Intro() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "80dvh"]);
  return (
    <div ref={container} className="md:h-screen h-fit overflow-hidden">
      <motion.div style={{ y }} className="relative md:h-full h-fit w-full">
        <img src={bgAsset.url} alt="Oneness Yoga" className="top-0 left-0 w-full md:h-full h-fit object-cover" />
      </motion.div>
    </div>
  );
}

function Section() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  return (
    <div
      ref={container}
      className="relative flex items-center justify-center md:h-screen h-[60vh] overflow-hidden"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="relative z-10 flex flex-col justify-between w-full h-full p-5 text-white md:p-20">
        <p className="md:w-[50vw] w-[70vw] md:text-[2vw] self-end">
          Awaken to body bliss with Oneness Yoga—a harmonious blend of movement and mindfulness, perfect for cultivating strength, energy, and inner calm.
        </p>
        <p className="md:text-7xl text-3xl font-display">Unlock your body bliss with Oneness Yoga.</p>
      </div>
      <div className="fixed top-[-10vh] left-0 h-[120vh] w-full">
        <motion.div style={{ y }} className="relative w-full h-full">
          <img src={bgAsset.url} alt="" style={{ objectFit: "cover" }} className="w-full h-full" />
        </motion.div>
      </div>
    </div>
  );
}

const items: { icon: string; text: string }[] = [
  { icon: one.url, text: "Build strength & stability: Feel more grounded on your mat and in life." },
  { icon: two.url, text: "Boost energy: Bring vitality into every move and every day." },
  { icon: three.url, text: "Release stress: Melt away tension and invite relaxation." },
  { icon: four.url, text: "Embrace love & care: Cultivate love and care for your body." },
  { icon: five.url, text: "Stay mindful: Experience awareness through movement and stillness." },
  { icon: six.url, text: "Live in oneness: Connect deeply with your body, consciousness, and everything around you." },
];

function Description() {
  return (
    <div className="container grid gap-5 p-2 mx-auto px-5 my-10 md:my-40">
      <div className="space-y-4">
        <h2 className="text-xl md:text-3xl font-medium text-brown font-display">Discover Oneness Yoga: Unlock Your Body Bliss</h2>
        <p className="md:text-xl text-sm leading-loose">
          Oneness Yoga is more than just a practice—it's a journey into the mystique of your body and consciousness. Created by Sri Preethaji, inspired by the ancient Himalayan Yogis' quest for enlightenment, Oneness Yoga blends the timeless wisdom of yoga with a modern approach to vitality and connection.
        </p>
        <p className="md:text-xl text-sm leading-loose">
          This unique experience helps you awaken to the magic of your body, cultivating balance, energy, and a deep sense of inner peace. Whether you're seeking health, relaxation, or simply a way to feel more present, Oneness Yoga guides you toward a state of harmony between body and mind.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl md:text-3xl font-medium text-brown font-display">What makes it even more exciting?</h2>
        <p className="md:text-xl text-sm leading-loose">
          Oneness Yoga can be practiced anywhere! Join in from the comfort of your home or as part of a community, making it accessible to individuals, families, and groups—whether in schools, workspaces, or organizations.
        </p>
      </div>
      <div className="space-y-2">
        <p className="text-xl md:text-3xl font-medium text-brown font-display">Why Oneness Yoga?</p>
        <ul className="space-y-2 pt-4">
          {items.map((it, i) => (
            <li key={i} className="flex items-center gap-5 border md:w-1/2 w-full p-2">
              <img src={it.icon} alt="" className="size-24 border p-2" />
              <span className="md:text-xl text-sm leading-loose">{it.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="md:text-xl text-sm">
        Oneness Yoga is for everyone, whether you're an experienced yogi, a seasonal enthusiast, or a complete beginner. Ready to unlock your body bliss?
      </p>
    </div>
  );
}

function OnenessYogaPage() {
  return (
    <>
      <Heading />
      <Intro />
      <Section />
      <Description />
    </>
  );
}
