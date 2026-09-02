import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import hero from "@/assets/serene-mind/hero.jpg.asset.json";
import { SiteImage } from "@/components/SiteMedia";

const SLOT_PATH = "serene-mind/hero.jpg";

export const Route = createFileRoute("/serene-mind")({
  head: () => ({
    meta: [
      { title: "Serene Mind — Oneness Generation" },
      { name: "description", content: "A three-minute meditation to release stress and foster inner harmony." },
      { property: "og:title", content: "Serene Mind — Oneness Generation" },
      { property: "og:description", content: "Find peace in the moment from anywhere." },
      { property: "og:image", content: hero.url },
    ],
  }),
  component: SereneMindPage,
});

function Heading() {
  return (
    <div className="flex justify-center md:my-10 my-5">
      <p className="md:text-6xl text-3xl uppercase text-center md:max-w-[50vw] leading-none font-display text-darkGreyBrown">
        Serene Mind
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
        <SiteImage
          path={SLOT_PATH}
          defaultSrc={hero.url}
          alt="Serene Mind"
          fallbackAspect="3/4"
          className="top-0 left-0 w-full md:h-full h-fit object-cover"
        />
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
          Achieve instant peace and clarity with the Serene Mind Practice—a three-minute meditation to release stress and foster inner harmony.
        </p>
        <p className="md:text-7xl text-3xl font-display">Find peace in the moment from anywhere</p>
      </div>
      <div className="fixed top-[-10vh] left-0 h-[120vh] w-full">
        <motion.div style={{ y }} className="relative w-full h-full">
          <SiteImage
            path={SLOT_PATH}
            defaultSrc={hero.url}
            alt=""
            fallbackAspect="3/4"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </div>
  );
}

function Description() {
  return (
    <div className="container grid gap-5 p-2 mx-auto px-5 my-10 md:my-40">
      <div className="space-y-4">
        <h2 className="text-xl md:text-3xl font-medium text-brown font-display">
          The Serene Mind Practice: A Path to Cultivate Peace Within
        </h2>
        <p className="md:text-xl text-sm md:max-w-[70vw] leading-loose">
          The Serene Mind Practice is a transformative meditation designed by Sri Preethaji, co-founder of The Oneness Movement, to help individuals shift from inner disturbance to a state of peace and clarity. This simple yet powerful practice offers a profound way to step out of mental chaos and suffering in just three minutes, bringing you back to balance and harmony.
        </p>
        <p className="md:text-xl text-sm md:max-w-[70vw] leading-loose">
          When individuals are trapped in disturbed states, they spread that suffering into their families, workplaces, and communities. These inner disturbances are often at the root of the world's problems. The Serene Mind Practice is a solution—to step out of this cycle of suffering and stress.
        </p>
        <p className="md:text-xl text-sm md:max-w-[70vw] leading-loose">
          When regularly practiced, the Serene Mind empowers you to make conscious decisions with clarity, rather than being driven by emotional turmoil or stress. It cultivates a sense of calm and focus, allowing one to emerge stronger, more self-aware, and capable of navigating challenges with greater wisdom and confidence.
        </p>
        <p className="md:text-xl text-sm md:max-w-[70vw] leading-loose">
          The practice is quick, but its effects are lasting, making it an essential tool for anyone seeking personal peace and collective transformation.
        </p>
      </div>
    </div>
  );
}

function SereneMindPage() {
  return (
    <>
      <Heading />
      <Intro />
      <Section />
      <Description />
    </>
  );
}
