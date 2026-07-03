import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import sfzVideoAsset from "@/assets/sfz/SFZ_Official_Video.mp4.asset.json";
import Slider from "react-slick";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  GraduationCap,
  Heart,
  MapPin,
  Target,
  TrendingUp,
  Waves,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { ImagePlaceholder } from "@/components/Placeholder";
import { getSfzEvents } from "@/lib/sfz.functions";

export const Route = createFileRoute("/sfz")({
  head: () => ({
    meta: [
      { title: "Stress Free Zone (SFZ) — Oneness Generation" },
      { name: "description", content: "Master your state, master your life with the SFZ program." },
      { property: "og:title", content: "Stress Free Zone (SFZ) — Oneness Generation" },
      { property: "og:description", content: "Master your state, master your life with the SFZ program." },
    ],
  }),
  component: SfzPage,
});

function SFZBanner() {
  return (
    <div className="max-w-7xl mx-auto container px-5 py-10 text-center">
      <h2 className="md:text-4xl text-xl font-bold text-tanAccent mb-6">
        The Stress Free Zone - Master Your State, Master Your Life
      </h2>
      <div className="relative flex items-end justify-center mb-8">
        <div className="hidden sm:block w-[130px] h-[200px] bg-[#605F4B] rounded-l-lg" />
        <ImagePlaceholder
          label="SFZ Program"
          aspect="16/9"
          rounded="rounded-t-lg"
          className="shadow-lg w-full md:h-[500px] h-[250px]"
        />
        <div className="hidden sm:block w-[130px] h-[200px] bg-[#605F4B] rounded-r-lg" />
      </div>
      <div className="md:space-y-4 space-y-2 text-gray-700 text-base px-5">
        <p className="text-start md:text-lg">
          Why do you think stress persists? It's because somewhere in our brains we hold the belief
          that it's necessary or helpful to us. Otherwise, wouldn't you interrupt your stressful
          thoughts?
        </p>
        <p className="text-start md:text-lg">
          The Stress Free Zone (SFZ) program teaches participants to identify and challenge these
          beliefs, revealing the unnecessary and counterproductive nature of stress. Paired with a
          simple 10-minute meditation practice, it equips individuals to shift into a calm,
          beautiful state with tremendous focus, clarity and capacity to enjoy life - at will!
        </p>
      </div>
    </div>
  );
}

const whychoose: Array<{ id: number; name: string; desc: string; Icon: LucideIcon }> = [
  {
    id: 1,
    name: "Long-term solution for unwanted emotions",
    desc: "Learn how to use awareness to dissolve unwanted emotions, instead of running away from them or hyping yourself up.",
    Icon: Waves,
  },
  {
    id: 2,
    name: "Self-love",
    desc: "Build a deep, lasting relationship with yourself rooted in awareness and acceptance.",
    Icon: Heart,
  },
  {
    id: 3,
    name: "Uncover the secrets of focus",
    desc: "In a truly stress-free state there's focus. Focus brings you productivity. Master your state, master your life.",
    Icon: Target,
  },
];

function WhyChooseSFZ() {
  return (
    <div className="bg-white md:py-10 py-5 max-w-7xl px-5 mx-auto container">
      <h2 className="text-2xl md:text-4xl font-bold text-tanAccent mb-6 pb-4 text-center">
        Why Choose SFZ?
      </h2>
      <div className="grid md:grid-cols-3 gap-8 mb-10">
        {whychoose.map(({ id, name, desc, Icon }) => (
          <div key={id} className="flex flex-col items-start md:p-4 p-2 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-brown flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-800 text-base md:text-lg leading-snug">
                {name}
              </h3>
            </div>
            <div className="mt-3 flex-1">
              <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
      <h2 className="text-2xl md:text-4xl text-center font-bold text-tanAccent mb-4 pt-6">
        Who can benefit?
      </h2>
      <p className="text-gray-600 text-lg">
        SFZ would benefit absolutely everyone, but it's specifically helpful for people who actually
        want to work on themselves and their inner conflicts. If you have a hard time being your
        authentic self around others, loving yourself, or stress about work, this course is for you.
      </p>
    </div>
  );
}

const modules = [
  {
    id: 1,
    name: "Nurturing a Healthy Brain",
    desc: "In today's fast-paced world, achieving more in less time requires a brain that operates on intelligence, creativity, and efficiency. Explore the 5 distinct states of the brain. Practice techniques to shift brain functions and transform life experiences.",
    subtitle: "Oneness Yoga Discussions Soul Sync Meditation",
  },
  {
    id: 2,
    name: "An Attentive Mind",
    desc: "Gain deep insight into the mind and learn how to cultivate attention and focus. Understand the two core states of human experience. Learn to live from a beautiful state and respond to life with clarity.",
    subtitle: "Oneness Yoga Interactions and Challenge Soul Sync Meditation",
  },
  {
    id: 3,
    name: "Being Yourself",
    desc: "Discover how internal freedom empowers you to express your true self. Build the confidence to make informed decisions and choices. Learn to distinguish between right and wrong with clarity.",
    subtitle: "Oneness Yoga Interactions and experiences Special Meditation",
  },
  {
    id: 4,
    name: "Power over Anger",
    desc: "Explore the nature of anger and its three distinct forms. Learn how anger affects the mind and body. Discover the pathway to liberate yourself from the hold of anger.",
    subtitle: "Oneness Yoga Group Exercise Soul Sync Meditation",
  },
  {
    id: 5,
    name: "Relieving Anxiety",
    desc: "Gain the wisdom to not just survive but thrive, free from stress and anxiety. Learn the key differences between problems and suffering. Discover how to overcome stress and anxiety.",
    subtitle: "Oneness Yoga Reflection Practice Serene Mind Meditation",
  },
  {
    id: 6,
    name: "Calming Stress",
    desc: "Dive deep into the nature of stress and its pre, post, and re-immersion phases. Connect with the universe's greater intelligence to detoxify stress.",
    subtitle: "Oneness Yoga Interactions Reflective Meditation",
  },
];

function Structure() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) {
          const index = Number((visible.target as HTMLElement).dataset.index);
          setActiveIndex(index);
        }
      },
      { threshold: 0.6 },
    );
    sectionRefs.current.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 lg:px-0">
      <h2 className="lg:text-3xl text-xl font-bold text-[#605F4B] mb-4 text-center">
        Program Structure: SFZ contains six 50-minute modules
      </h2>

      <div className="hidden lg:flex gap-10">
        <div className="w-1/2 space-y-10">
          {modules.map((section, index) => (
            <div
              key={section.id}
              ref={(el) => {
                sectionRefs.current[index] = el;
              }}
              data-index={index}
              className="min-h-[80vh] flex flex-col justify-center"
            >
              <h2
                className={`font-bold text-2xl mb-4 ${
                  activeIndex === index ? "text-yellow-600" : "text-gray-800"
                }`}
              >
                {index + 1}. {section.name}
              </h2>
              <p
                className={`text-gray-600 text-lg ${
                  activeIndex === index ? "opacity-100" : "opacity-60"
                }`}
              >
                {section.desc}
              </p>
              {activeIndex === index && (
                <span className="text-[#605F4B] font-medium text-sm mt-3 text-end">
                  — {section.subtitle}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="w-1/2 sticky top-0 h-screen flex items-center justify-center">
          <div className="relative w-[400px] h-[600px] rounded-xl overflow-hidden shadow-2xl border border-gray-200">
            <video src={sfzVideoAsset.url} controls playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:hidden">
        <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg border border-gray-200">
          <video src={sfzVideoAsset.url} controls playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        {modules.map((section, index) => (
          <div key={section.id} className="flex flex-col gap-4">
            <h2 className="font-bold text-xl text-yellow-600">
              {index + 1}. {section.name}
            </h2>
            <p className="text-gray-700 text-base leading-relaxed">{section.desc}</p>
            <span className="text-[#605F4B] font-medium text-end text-sm">
              — {section.subtitle}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const tools: Array<{ id: number; name: string; desc: string; Icon: LucideIcon }> = [
  {
    id: 1,
    name: "Tools Used",
    desc: "Breathing and meditation practices, wisdom bites, guided reflections, light yoga, group discussions.",
    Icon: Wrench,
  },
  {
    id: 2,
    name: "What Are The Outcomes?",
    desc: "By the end, you will easily recognize stress and be able to shift into a state of calm and focus. Remember: when you master your state, you master your life.",
    Icon: TrendingUp,
  },
  {
    id: 3,
    name: "Your Teacher",
    desc: "SFZ is taught by Oneness Generation, a group of young life-lovers with the goal of helping people reduce stress and enjoy life. The program was created with help from monks at 'Oneness' - a global spiritual movement that teaches ordinary people enlightenment.",
    Icon: GraduationCap,
  },
];

function Tools() {
  const offsets = ["md:mt-0", "md:mt-10", "md:mt-20"];
  return (
    <section className="bg-white">
      <div className="container mx-auto max-w-7xl px-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 py-8">
          {tools.map(({ id, name, desc, Icon }, i) => (
            <div key={id} className={`flex items-start gap-4 ${offsets[i] || ""}`}>
              <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-amber-50 text-brown flex items-center justify-center shadow-sm">
                <Icon className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-yellow-700">{name}</h3>
                <p className="mt-1 text-[13px] md:text-sm leading-relaxed text-gray-600">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const trainerPlaceholders = [
  { name: "Aditi Rao", location: "Mumbai, IN" },
  { name: "Rahul Menon", location: "Bengaluru, IN" },
  { name: "Sara Iyer", location: "Delhi, IN" },
  { name: "Kabir Shah", location: "Pune, IN" },
  { name: "Meera Nair", location: "Chennai, IN" },
  { name: "Arjun Verma", location: "Hyderabad, IN" },
];

function NextArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Next"
      className="absolute top-1/2 right-0 z-10 -translate-y-1/2 bg-brown text-white p-3 rounded-full shadow-lg hover:bg-yellow-800 transition"
    >
      <ChevronRight className="w-4 h-4" />
    </button>
  );
}
function PrevArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Previous"
      className="absolute top-1/2 left-0 z-10 -translate-y-1/2 bg-brown text-white p-3 rounded-full shadow-lg hover:bg-yellow-800 transition"
    >
      <ChevronLeft className="w-4 h-4" />
    </button>
  );
}

function OurTeam() {
  const settings = {
    infinite: trainerPlaceholders.length > 4,
    speed: 500,
    dots: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="py-10 bg-white container mx-auto px-5 max-w-7xl">
      <div className="flex items-center justify-between py-10">
        <div className="w-1" />
        <h2 className="text-center md:text-4xl text-2xl font-bold text-tanAccent">Our Team</h2>
        <a
          href="/trainer"
          className="bg-brown text-white md:px-6 px-3 py-2 rounded-full hover:bg-yellow-800"
        >
          See All
        </a>
      </div>

      <div className="mt-6 relative">
        <Slider {...settings}>
          {trainerPlaceholders.map((trainer, idx) => (
            <div key={trainer.name} className="px-4">
              <div
                className={`flex flex-col items-center text-center transition-all duration-300 ${
                  idx % 2 === 0 ? "mt-12" : "mb-12"
                }`}
              >
                <div className="w-48 h-48 rounded-full overflow-hidden shadow-md bg-secondary">
                  <ImagePlaceholder
                    label=""
                    aspect="1/1"
                    rounded="rounded-full"
                    className="w-full h-full"
                  />
                </div>
                <h3 className="mt-4 font-semibold">{trainer.name}</h3>
                <p className="text-gray-500 flex items-center justify-center text-sm mt-1">
                  <MapPin className="mr-1 w-4 h-4 text-gray-400" />
                  {trainer.location}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <div className="text-center mt-24 space-y-5">
        <h2 className="mb-4 md:text-3xl text-2xl font-semibold text-gray-400">
          Now you can request an SFZ Session
        </h2>
        <Link
          to="/request-sfz"
          className="w-fit inline-flex items-center gap-2 bg-brown text-white font-medium px-8 py-3 rounded-2xl hover:bg-yellow-800 transition-colors duration-200 mx-auto"
        >
          Request an SFZ Session <ArrowUpRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

function Partnership() {
  return (
    <div className="bg-band-tan md:py-14 py-8 px-3 lg:px-20">
      <div className="mx-auto px-5 container md:flex items-center gap-10 md:space-y-0 space-y-6 max-w-7xl">
        <div className="md:w-1/2 md:space-y-5 space-y-2">
          <h2 className="text-3xl font-bold text-tanAccent">Partnership</h2>
          <p className="md:leading-relaxed text-darkGreyBrown">
            VoiceUp is proud to partner with Oneness Generation in turning a shared vision into
            reality. Together, we are dedicated to empowering the next generation, equipping them
            with the skills, confidence, and opportunities they need to thrive in a rapidly changing
            world.
          </p>
          <p className="md:leading-relaxed text-darkGreyBrown">
            Through collaborative programs, engaging workshops, and impactful outreach, we strive to
            inspire young minds and create a community where every voice is heard, valued, and
            amplified. Our partnership is more than a collaboration — it's a commitment to shaping a
            future where unity, creativity, and innovation lead the way.
          </p>
        </div>
        <div className="md:w-1/2 w-full grid grid-cols-2 gap-4">
          <div className="aspect-square rounded-2xl bg-white shadow-card border border-border flex items-center justify-center p-6">
            <span className="text-brown font-display font-bold text-xl md:text-2xl tracking-wide text-center">
              VoiceUp
            </span>
          </div>
          <div className="aspect-square rounded-2xl bg-white shadow-card border border-border flex items-center justify-center p-6">
            <span className="text-brown font-display font-bold text-base md:text-lg tracking-wide text-center leading-tight">
              Oneness
              <br />
              Generation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

type SfzEvent = {
  id: string;
  event_name: string;
  event_short_description: string | null;
  cover_url: string | null;
  location: string | null;
  location_type: string | null;
  start_at: string;
  end_at: string | null;
};

function formatTime(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

function EventCard({ e }: { e: SfzEvent }) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden flex flex-col">
      {e.cover_url ? (
        <img src={e.cover_url} alt={e.event_name} className="w-full h-48 object-cover" />
      ) : (
        <ImagePlaceholder label="Event" aspect="16/9" rounded="rounded-none" className="w-full" />
      )}
      <div className="p-5 flex flex-col gap-3 flex-grow">
        <h3 className="md:text-lg font-bold text-gray-800 line-clamp-2">{e.event_name}</h3>
        {e.event_short_description && (
          <p className="text-gray-600 text-sm line-clamp-3 flex-grow">{e.event_short_description}</p>
        )}
        <div className="flex items-center justify-between text-sm text-gray-600 gap-3 flex-wrap">
          <p className="flex gap-2 items-center">
            <MapPin className="text-brown w-4 h-4" />
            {e.location || e.location_type || "TBD"}
          </p>
          <p className="flex gap-2 items-center">
            <Clock className="text-brown w-4 h-4" />
            {formatTime(e.start_at)}
            {e.end_at ? ` – ${formatTime(e.end_at)}` : ""}
          </p>
        </div>
        <div className="mt-auto pt-2">
          <span className="inline-flex items-center gap-2 bg-brown text-white px-4 py-2 rounded-full text-sm">
            View <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
}

function EventsSection({ title, type, band }: { title: string; type: "upcoming" | "past"; band: string }) {
  const [events, setEvents] = useState<SfzEvent[]>([]);
  useEffect(() => {
    let alive = true;
    getSfzEvents({ data: { type } })
      .then((rows) => { if (alive) setEvents(rows as SfzEvent[]); })
      .catch(() => { if (alive) setEvents([]); });
    return () => { alive = false; };
  }, [type]);


  return (
    <section className={`${band} py-14`}>
      <div className="container mx-auto max-w-7xl px-5">
        <h2 className="text-center md:text-4xl text-2xl font-bold text-tanAccent mb-10">{title}</h2>
        {events.length === 0 ? (
          <p className="text-center text-gray-500">No {type} events at the moment. Check back soon.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(events as SfzEvent[]).map((e) => (
              <EventCard key={e.id} e={e} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SfzPage() {
  return (
    <>
      <SFZBanner />
      <WhyChooseSFZ />
      <Structure />
      <Tools />
      <OurTeam />
      <Partnership />
      <EventsSection title="SFZ Upcoming Events" type="upcoming" band="bg-band-cream" />
      <EventsSection title="SFZ Past Events" type="past" band="bg-white" />
    </>
  );
}
