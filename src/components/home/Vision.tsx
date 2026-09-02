import visionImage from "@/assets/Home/Vision/vision.jpg";
import arrowImage from "@/assets/Curvedarrowwithbrokenline.svg";
import { SiteImage } from "@/components/SiteMedia";

// Ported from oneness-frontend/src/Components/Home/Vision.jsx.
// The main vision photo is now CMS-managed (slot `home-vision-image`); the
// decorative arrow SVG stays as a shipped asset.
export default function Vision() {
  return (
    <div className="md:flex items-center bg-[#605f4b] md:h-[70vh] justify-center">
      <div className="flex h-full py-6 sm:py-8 lg:py-12 w-full container mx-auto px-5">
        <div className="w-full md:flex justify-between">
          <div className="text-white space-y-6 md:w-1/2">
            <h2 className="md:text-5xl text-3xl font-bold">Vision</h2>
            <div className="md:space-y-8 space-y-2 text-base md:leading-relaxed">
              <p className="!leading-normal md:text-xl text-lg">
                Empowering youth to break free of stress and find a calm, joyful state of mind
              </p>
              <p className="!leading-normal md:text-xl text-lg">
                We're a community of young people with a vision to help ourselves and our fellow
                youth become free from the shackles of everyday stress and shift from a high-stress
                beta state of mind to a calm and centered alpha state.
              </p>
              <p className="!leading-normal md:text-xl text-lg">
                Our mission is to make stress-free living a reality for young people.
              </p>
            </div>
          </div>

          <div className="relative flex justify-end items-start md:w-1/3 mt-6 md:mt-0">
            <SiteImage
              path="home/vision.jpg"
              alt="Vision"
              defaultSrc={visionImage}
              fallbackAspect="4/5"
              fallbackRounded="rounded-3xl"
              className="w-full md:h-[360px] shadow-lg object-cover rounded-3xl"
            />
            <img
              src={arrowImage}
              alt=""
              className="absolute md:w-[200px] w-[100px] md:-bottom-0 -bottom-10 md:-left-10 -left-2 rotate-[-20deg]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
