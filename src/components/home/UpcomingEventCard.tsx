import event from "@/assets/Home/Vision/DSC05413.jpg";
import { siteMediaUrl } from "@/lib/siteMedia";
import { SiteImage } from "@/components/SiteMedia";

// Background photo for the "What's new?" strip. CMS-managed via slot
// `home-upcoming-event-bg`; falls back to the shipped asset.
const CMS_BG_URL = siteMediaUrl("home/upcoming-event-bg.jpg");

export default function UpcomingEventCard() {
  return (
    <section className="md:mt-12 mt-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-darkGreyBrown">What's new?</h2>
      </div>

      {/* Desktop */}
      <div
        className="md:flex hidden items-center bg-tan xl:h-[70vh] lg:h-[50vh] h-[50vh] justify-center bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${CMS_BG_URL}), url(${event})` }}
      >
        <div className="flex xl:justify-end justify-center w-full container mx-auto px-5 p-5 md:p-0">
          <div className="w-[500px] p-4 h-[400px] grid place-content-center content-center bg-gradient-to-t from-[#f5cf9d] to-tan rounded-tl-[80px] rounded-br-[80px]">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-gray-900 text-center capitalize">
                SFZ training
              </h3>
              <p className="text-xl text-gray-900 text-center">
                Dates Will be Announced soon.
              </p>
              <div className="flex justify-center mt-6">
                <button
                  disabled
                  className="bg-[#9c9e80] text-white px-5 py-3 rounded-full text-lg font-medium shadow-md cursor-not-allowed opacity-80"
                >
                  Become an OG Trainer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden bg-gradient-to-t from-[#f5cf9d] to-tan">
        <div className="flex justify-center w-full container mx-auto">
          <div className="p-4 h-[270px] grid place-content-center content-center">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900 text-center capitalize">
                SFZ training
              </h3>
              <p className="text-xl text-gray-900 text-center">
                Dates Will be Announced soon.
              </p>
              <div className="flex justify-center mt-6">
                <p className="bg-[#9c9e80] text-white px-5 py-3 rounded-full text-lg font-medium shadow-md cursor-not-allowed opacity-80">
                  Become an OG Trainer
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:hidden">
          <SiteImage
            path="home/upcoming-event-bg.jpg"
            defaultSrc={event}
            alt="Event"
            fallbackAspect="16/9"
            className="w-full h-[300px] object-cover"
          />
        </div>
      </div>
    </section>
  );
}
