import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import SliderModule from "react-slick";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

import sfzImg from "@/assets/programs/events/sfz.jpg";
import breakthroughImg from "@/assets/programs/events/breakthrough.jpg";
import skyImg from "@/assets/programs/sky/Sky1.png";
import youthImg from "@/assets/Home/Vision/IMG_2950.jpg";
import { ClientOnly } from "@/components/ClientOnly";
import { SiteImage } from "@/components/SiteMedia";

const Slider = ((SliderModule as unknown) as { default?: typeof SliderModule }).default ?? SliderModule;

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs & Events — Oneness Generation" },
      { name: "description", content: "Explore transformative programs and events from Oneness Generation — SFZ, SKY, Breakthrough, and the Oneness Youth Festival." },
      { property: "og:title", content: "Programs & Events — Oneness Generation" },
      { property: "og:description", content: "Explore transformative programs and events from Oneness Generation." },
    ],
  }),
  component: ProgramsPage,
});

type Card = { slotPath: string; defaultSrc: string; title: string; description: string; to: string };

const cards: Card[] = [
  {
    slotPath: "programs/sfz.jpg",
    defaultSrc: sfzImg,
    to: "/sfz",
    title: "Get trained in SFZ",
    description: "Become a beacon of calm and joy—lead the way to a stress-free life as an SFZ Trainer.",
  },
  {
    slotPath: "programs/sky.jpg",
    defaultSrc: skyImg,
    to: "/programs",
    title: "SKY (monthly)",
    description: "Learn the wisdom from Sri Krishnaji to transform every area of your life.",
  },
  {
    slotPath: "programs/breakthrough.jpg",
    defaultSrc: breakthroughImg,
    to: "/programs",
    title: "Breakthrough",
    description: "Breakthrough the Limits - unlock your true potential and step into a life of limitless possibilities.",
  },
  {
    slotPath: "programs/youth.jpg",
    defaultSrc: youthImg,
    to: "/programs",
    title: "Oneness Youth Festival",
    description: "Unlock your Super Brain, Super Body, and Super Heart and experience a brand new state of being.",
  },
];

function EventsSlider() {
  const sliderRef = useRef<any>(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear" as const,
    pauseOnHover: false,
  };

  return (
    <div className="relative w-full">
      <ClientOnly fallback={<div className="w-full md:h-[60vh] h-[40vh]" />}>
        <Slider ref={(s) => { sliderRef.current = s; }} {...settings} className="px-6 py-6">
          {cards.map((c, i) => (
            <Link key={i} to={c.to} className="relative cursor-pointer rounded-xl block">
              <SiteImage
                path={c.slotPath}
                defaultSrc={c.defaultSrc}
                alt={c.title}
                fallbackAspect="16/9"
                fallbackRounded="rounded-2xl"
                className="w-full md:h-[60vh] h-[40vh] object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-2xl" />
              <div className="absolute md:bottom-[10%] bottom-0 md:left-[30%] left-0 w-full p-6">
                <h2 className="text-white text-xl md:text-3xl font-bold">{c.title}</h2>
                <p className="text-white text-sm md:text-lg">{c.description}</p>
              </div>
            </Link>
          ))}
        </Slider>
      </ClientOnly>
      <div className="flex justify-between w-full absolute top-[40%] text-lg md:text-2xl px-6 pointer-events-none">
        <button
          type="button"
          onClick={() => sliderRef.current?.slickPrev()}
          className="p-2 bg-white rounded-full bg-opacity-70 shadow-md hover:bg-opacity-100 transition pointer-events-auto"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => sliderRef.current?.slickNext()}
          className="p-2 bg-white rounded-full bg-opacity-70 shadow-md hover:bg-opacity-100 transition pointer-events-auto"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function EventsSection({ title, exploreTo, emptyMessage }: { title: string; exploreTo: string; emptyMessage: string }) {
  return (
    <div className="relative w-full overflow-hidden md:py-12 py-6 px-4 md:px-6">
      <div className="flex items-center justify-between md:px-14 px-6 pb-5">
        <h2 className="md:text-3xl text-lg font-bold text-darkGreyBrown">{title}</h2>
        <Link
          to={exploreTo}
          className="flex items-center md:gap-3 gap-1 bg-brown text-white px-3 py-2 rounded-full md:text-lg w-fit"
        >
          Explore All
          <ArrowUpRight className="w-5 h-5" />
        </Link>
      </div>
      <h2 className="text-brown text-center text-lg">{emptyMessage}</h2>
    </div>
  );
}

function ProgramsPage() {
  return (
    <>
      <EventsSlider />
      <EventsSection
        title="Upcoming Events"
        exploreTo="/allUpcoming-sfz-events"
        emptyMessage="Currently No Upcoming Events"
      />
      <EventsSection
        title="Past Events"
        exploreTo="/allPast-sfz-events"
        emptyMessage="Currently No Past Events"
      />
    </>
  );
}
