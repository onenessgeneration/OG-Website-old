import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Clock } from "lucide-react";
import { SiteImage } from "@/components/SiteMedia";

export const Route = createFileRoute("/summer-camp")({
  head: () => ({
    meta: [
      { title: "Summer Camp Events — Oneness Generation" },
      { name: "description", content: "A transformative 10-day spiritual summer camp for young minds aged 12 to 24." },
      { property: "og:title", content: "Summer Camp Events — Oneness Generation" },
      { property: "og:description", content: "A transformative 10-day spiritual summer camp for young minds aged 12 to 24." },
    ],
  }),
  component: SummerCampPage,
});

const BANNER_DEFAULT =
  "https://res.cloudinary.com/drxwnjtcn/image/upload/v1749203630/Oneness-Generation/Summer%20Camp%20Events/_DSC9402_hj84tx.jpg";

function SummerCampPage() {
  const events: Array<{ eventName: string; date: string; time: string }> = [];

  return (
    <>
      {/* Camp banner */}
      <div className="relative w-full h-[40vh] sm:h-[70vh] md:h-[83vh]">
        <SiteImage
          path="summer-camp/banner.jpg"
          defaultSrc={BANNER_DEFAULT}
          alt="Summer Camp Banner"
          fallbackAspect="16/9"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            Summer Camp Events
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto px-5 container md:py-10 py-5">
        <div className="md:p-8 p-3">
          <h2 className="text-3xl sm:text-4xl font-semibold text-darkGreyBrown mb-4">
            Oneness Generation Summer Camp
          </h2>
          <p className="text-gray-700 mb-4 text-lg">Winners do not happen; they are cultivated.</p>
          <p className="font-semibold mb-6">Age Group: 12 to 24 years</p>

          <div className="space-y-5 text-gray-700 text-[17px]">
            <p>Oneness Generation presents a transformative 10-day spiritual summer camp tailored for young minds.</p>
            <p>OG summer camp sparks growth, fosters connection, and nurtures the mind, heart, and spirit.</p>

            <h3 className="text-xl font-medium text-darkGreyBrown">This immersive experience weaves together:</h3>
            <ol className="list-decimal list-inside pl-4 space-y-1">
              <li>Yoga and meditation to calm the mind and awaken the heart</li>
              <li>Spiritual lessons to inspire self-discovery and inner wisdom</li>
              <li>Outdoor activities with Mother Nature and local tribes to foster connection and appreciation</li>
            </ol>

            <h3 className="text-xl font-medium text-darkGreyBrown mt-6">
              Through this holistic journey, young participants will:
            </h3>
            <ol className="list-decimal list-inside pl-4 space-y-1">
              <li>Open their minds and hearts to new perspectives and experiences</li>
              <li>Nurture emotional intelligence and resilience through meditation and mindfulness</li>
              <li>Exercise their brains with engaging activities and challenges</li>
              <li>Cultivate deeper connections with peers and local communities</li>
            </ol>

            <p className="mt-6 font-medium text-gray-800">
              Join the Oneness Generation community for an unforgettable summer of growth, connection, and inspiration.
            </p>
          </div>

          {events.length === 0 ? (
            <h2 className="text-lg font-semibold my-8 text-center text-darkGreyBrown">
              Currently no Summer Camp Events
            </h2>
          ) : (
            events.map((v, i) => (
              <div key={i} className="mx-auto mt-10 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-darkGreyBrown mb-4">{v.eventName}</h3>
                <div className="flex items-center gap-3 mb-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-darkGreyBrown" />
                  <span>Date: {v.date}</span>
                </div>
                <div className="flex items-center gap-3 mb-2 text-gray-700">
                  <Clock className="w-4 h-4 text-darkGreyBrown" />
                  <span>Time: {v.time} IST</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
