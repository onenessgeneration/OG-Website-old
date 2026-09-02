import vision from "@/assets/Home/Vision/vision.jpg";
import visionImg from "@/assets/Home/Vision/visionimage.jpg";
import img2950 from "@/assets/Home/Vision/IMG_2950.jpg";
import dsc from "@/assets/Home/Vision/DSC05413.jpg";
import gallery1 from "@/assets/Gallery/DJI_00001.jpg";
import gallery2 from "@/assets/Gallery/DSC07912.jpg";
import { SiteImage } from "@/components/SiteMedia";

// Six-image collage under the Vision block on the home page. Each image is
// CMS-managed (slots `home-collage-1` … `home-collage-6`); the shipped
// assets act as defaults until an admin replaces them.
const slots: Array<{ path: string; defaultSrc: string }> = [
  { path: "home/collage/1.jpg", defaultSrc: vision },
  { path: "home/collage/2.jpg", defaultSrc: visionImg },
  { path: "home/collage/3.jpg", defaultSrc: img2950 },
  { path: "home/collage/4.jpg", defaultSrc: dsc },
  { path: "home/collage/5.jpg", defaultSrc: gallery1 },
  { path: "home/collage/6.jpg", defaultSrc: gallery2 },
];

export default function VisionImages() {
  return (
    <div className="md:mt-6 mt-2">
      <div className="container mx-auto px-5 py-2 flex items-center">
        <div className="-m-1 flex flex-row sm:flex-wrap md:-m-2">
          <div className="flex w-full sm:w-1/2 flex-wrap lg:flex-row flex-row-reverse">
            {slots.slice(0, 3).map((s, index) => (
              <div
                key={s.path}
                className={`${index === 2 ? "w-full" : "w-full lg:w-1/2"} p-1 md:p-2`}
              >
                <SiteImage
                  path={s.path}
                  defaultSrc={s.defaultSrc}
                  alt=""
                  fallbackAspect="1/1"
                  fallbackRounded="rounded-lg"
                  className="block h-full w-full rounded-lg 2xl:rounded-2xl object-cover object-center"
                />
              </div>
            ))}
          </div>
          <div className="flex w-full sm:w-1/2 flex-wrap">
            {slots.slice(3, 6).map((s, index) => (
              <div
                key={s.path}
                className={`${index < 2 ? "w-1/2" : "w-full"} p-1 md:p-2`}
              >
                <SiteImage
                  path={s.path}
                  defaultSrc={s.defaultSrc}
                  alt=""
                  fallbackAspect="1/1"
                  fallbackRounded="rounded-lg"
                  className="block h-full w-full rounded-lg 2xl:rounded-2xl object-cover object-center"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
