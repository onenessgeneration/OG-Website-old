import { useRef, useState } from "react";
import { GoPlay } from "react-icons/go";

import { motion, useScroll, useTransform } from "framer-motion";
import { createFileRoute } from "@tanstack/react-router";
import { SiteImage, SiteVideo } from "@/components/SiteMedia";

export const Route = createFileRoute("/soul-sync")({
  head: () => ({
    meta: [
      { title: "Soul Sync — Oneness Generation" },
      {
        name: "description",
        content:
          "Soul Sync is a 9–12 minute meditation created by Sri Preethaji that shifts you from a beta to alpha brainwave state.",
      },
      { property: "og:title", content: "Soul Sync — Oneness Generation" },
      {
        property: "og:description",
        content: "From Beta to Alpha: Experience the Beautiful State.",
      },
    ],
  }),
  component: SoulSyncPage,
});

type Pillar = {
  title: string;
  subtitle: string;
  color: string;
  text: string;
};

const data: Pillar[] = [
  {
    title: "Mudra",
    subtitle: "Hand Pose",
    color: "#688557",
    text: "The different touches of our hand in soul sync while counting breaths. Performing them stimulates specific areas of the brain, leading to changes in our mood and consciousness.",
  },
  {
    title: "Mantra",
    subtitle: "Chant",
    color: "#283838",
    text: "Chants in meditation. Everything in the universe vibrates at a frequency. When we chant a mantra, we produce sound waves that can influence cellular processes, reduce stress, and enhance relaxation.",
  },
  {
    title: "Asana",
    subtitle: "Posture",
    color: "#b78036",
    text: "Just as mental state impacts physical state, physical state too impacts mental state. Asana refers to postures that can improve brain state. They reduce anxiety and stress, and enhance mindfulness and emotional well-being.",
  },
  {
    title: "Pranayama",
    subtitle: "Regulation of Breath",
    color: "#cdad85",
    text: "Pranayama is the art and practice of regulating the flow of oxygen and blood through your body. Breathing in the right ways can improve oxygenation of blood and clear out toxins.",
  },
  {
    title: "Dharana",
    subtitle: "Embody",
    color: "#605f4b",
    text: "Dharana refers to focused concentration on a single point or object. Benefits include enhanced mental clarity, improved focus, reduced stress, and fostered emotional balance.",
  },
  {
    title: "Bhavana",
    subtitle: "Visualization",
    color: "#a36627",
    text: "Bhavana, or visualization, uses mental imagery to shape thoughts and intentions. It boosts positive emotions, enhances focus, strengthens creativity, and helps manifest desires.",
  },
];

function SoulSyncHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [activated, setActivated] = useState(false);

  const handlePlay = () => {
    const v = videoRef.current;
    if (v) {
      v.muted = false;
      v.volume = 0.75;
      v.controls = true;
      void v.play();
    }
    setActivated(true);
  };

  return (
    <div className="relative w-full h-full">
      <SiteVideo
        ref={videoRef}
        path="soul-sync/hero.mp4"
        fallbackLabel="Soul Sync video"
        fallbackAspect="16/9"
        autoPlay
        muted
        loop
        controls={false}
        className="w-full h-full object-cover"
      />
      {!activated && (
        <>
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          <button
            onClick={handlePlay}
            aria-label="Play with sound"
            className="absolute inset-0 z-10 flex items-center justify-center text-white"
          >
            <span className="flex items-center gap-2 border border-white/80 rounded-full px-6 py-2 text-xl md:text-3xl backdrop-blur-sm transition-transform hover:scale-105 hover:bg-white hover:text-black">
              <span className="font-medium">Play</span>
              <GoPlay className="text-2xl md:text-3xl" />
            </span>
          </button>
        </>
      )}
    </div>
  );
}

function SoulSyncVideoAndCards() {

  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);

  // One useTransform per pillar — fixed length, hook-rules safe.
  const scale0 = useTransform(scrollYProgress, [0 * 0.25, 1], [1, 1 - (data.length - 0) * 0.05]);
  const scale1 = useTransform(scrollYProgress, [1 * 0.25, 1], [1, 1 - (data.length - 1) * 0.05]);
  const scale2 = useTransform(scrollYProgress, [2 * 0.25, 1], [1, 1 - (data.length - 2) * 0.05]);
  const scale3 = useTransform(scrollYProgress, [3 * 0.25, 1], [1, 1 - (data.length - 3) * 0.05]);
  const scale4 = useTransform(scrollYProgress, [4 * 0.25, 1], [1, 1 - (data.length - 4) * 0.05]);
  const scale5 = useTransform(scrollYProgress, [5 * 0.25, 1], [1, 1 - (data.length - 5) * 0.05]);
  const cardScales = [scale0, scale1, scale2, scale3, scale4, scale5];

  return (
    <div ref={container} className="relative">
      <motion.div
        style={{ scale, rotate }}
        className="w-full md:h-screen h-fit overflow-hidden sticky top-0"
      >
        <SoulSyncHero />
      </motion.div>


      <div className="relative min-h-screen bg-white md:pt-16 pt-8">
        <h1 className="md:text-5xl text-2xl font-bold text-center text-tanAccent mb-8 grid lg:flex lg:justify-center">
          Science and Ancient Wisdom of
          <span className="italic text-black ml-4">Soul Sync!</span>
        </h1>

        {/* Desktop: sticky-stacking cards that "collapse" as you scroll */}
        <div className="xl:grid place-content-center p-2 hidden">
          {data.map((item, index) => (
            <motion.div
              key={item.title}
              style={{
                scale: cardScales[index],
                top: `calc(10vh + ${index * 25}px)`,
                backgroundColor: item.color,
              }}
              className="border md:flex grid md:flex-col md:h-[500px] lg:w-[1000px] rounded-3xl md:p-12 p-4 sticky overflow-hidden"
            >
              <h2 className="text-3xl font-bold text-white">{item.title}</h2>
              <div className="md:flex h-full w-full md:mt-12 mt-6 md:gap-12 gap-2">
                <div className="relative md:w-1/2 md:top-[10%]">
                  <h3 className="text-lg font-semibold text-white">{item.subtitle}</h3>
                  <p className="text-tan mt-4">{item.text}</p>
                </div>
                <div className="relative md:w-1/2 h-full w-full rounded-3xl overflow-hidden">
                  <motion.div className="w-full h-full" style={{ scale: imageScale }}>
                    <SiteImage
                      path={`soul-sync/pillars/${item.title.toLowerCase()}.jpg`}
                      alt={item.title}
                      fallbackLabel={item.title}
                      fallbackAspect="auto"
                      fallbackRounded="rounded-3xl"
                      className="w-full h-full object-cover rounded-3xl"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tablet / mobile fallback grid */}
        <div className="grid md:grid-cols-2 xl:hidden px-4 gap-10">
          {data.map((item) => (
            <div
              key={item.title}
              style={{ backgroundColor: item.color }}
              className="rounded-3xl p-4 space-y-3"
            >
              <h2 className="text-2xl font-bold text-white">{item.title}</h2>
              <div>
                <h3 className="text-lg font-semibold text-white">{item.subtitle}</h3>
                <p className="text-tan mt-4">{item.text}</p>
              </div>
              <div className="mt-4">
                <SiteImage
                  path={`soul-sync/pillars/${item.title.toLowerCase()}.jpg`}
                  alt={item.title}
                  fallbackLabel={item.title}
                  fallbackAspect="4/3"
                  fallbackRounded="rounded-3xl"
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function Heading() {
  return (
    <div className="flex justify-center md:my-10 my-5">
      <p className="md:text-6xl text-3xl uppercase text-center md:max-w-[50vw] leading-none">
        Soul Sync
      </p>
    </div>
  );
}

function Intro() {
  return (
    <div className="md:h-screen h-fit overflow-hidden">
      <div className="relative md:h-full h-fit w-full">
        <SiteImage
          path="soul-sync/intro.jpg"
          alt="Soul Sync intro"
          fallbackLabel="Soul Sync intro"
          fallbackAspect="16/9"
          fallbackRounded="rounded-none"
          className="w-full md:h-full h-auto object-cover"
        />
      </div>
    </div>
  );
}

function Section() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div
      ref={container}
      className="relative flex items-center justify-center md:h-screen h-[60vh] overflow-hidden"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="relative z-10 flex flex-col justify-between w-full h-full p-5 text-white md:p-20">
        <p className="md:w-[50vw] w-[70vw] md:text-[2vw] self-end">
          Unlock inner peace and creativity with Soul Sync, a transformative meditation designed to
          calm your mind and open your consciousness in just minutes.
        </p>
        <p className="md:text-7xl text-3xl leading-tight text-start">
          From Beta to Alpha: Experience the Beautiful State
        </p>
      </div>
      <div className="fixed top-[-10vh] left-0 h-[120vh] w-full -z-0">
        <motion.div style={{ y }} className="relative w-full h-full">
          <SiteImage
            path="soul-sync/parallax.jpg"
            alt=""
            fallbackLabel=""
            fallbackAspect="auto"
            fallbackRounded="rounded-none"
            className="w-full h-full object-cover"
          />


        </motion.div>
      </div>
    </div>
  );
}

function Description() {
  return (
    <div className="container grid gap-5 p-2 px-5 mx-auto my-10 md:my-40">
      <div className="space-y-4">
        <h2 className="text-xl md:text-3xl font-medium text-brown">
          Ready to start your day from an Alpha brainwave state?
        </h2>
        <p className="text-sm md:text-xl leading-loose">
          Soul Sync, created by Sri Preethaji, is a 9–12 minute meditation designed to calm your
          mind, expand awareness, and manifest heartfelt intentions. This transformative practice
          blends ancient wisdom with modern neuroscience to create a powerful shift from mental
          chaos to clarity and purpose.
        </p>
        <p className="text-sm md:text-xl leading-loose">
          The six-step process aligns your breath, mind, and heart, guiding you from a restless
          beta state to a calm, creative alpha state.
        </p>
        <p className="text-sm md:text-xl leading-loose">
          Whether practiced solo or in a group, this meditation is a gateway to effortless living,
          connecting you deeply with life and setting you on a path of clarity, grace, and purpose.
          Embrace the beauty and power of Soul Sync to start your day in flow.
        </p>
      </div>
    </div>
  );
}

function SoulSyncPage() {
  return (
    <div>
      <SoulSyncVideoAndCards />
      <Heading />
      <Intro />
      <Section />
      <Description />
    </div>
  );
}
