import { useRef, useState } from "react";
import { GoPlay } from "react-icons/go";
import bannerPoster from "@/assets/Home/Vision/visionimage.jpg";
import { SiteVideo } from "@/components/SiteMedia";
import { siteMediaUrl } from "@/lib/siteMedia";

// Banner poster + video are both CMS-managed via /admin/site-media
// (`home-banner-poster`, `home-banner-video`). Video autoplays muted with
// a play button overlay; clicking play unmutes to 75% and reveals native controls.
export default function Banner() {
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
    <div className="relative w-full min-h-[250px] md:h-[calc(100dvh-84px)] h-[200px] overflow-hidden">
      <SiteVideo
        ref={videoRef}
        path="home/banner-video.mp4"
        poster={siteMediaUrl("home/banner-poster.jpg")}
        defaultPoster={bannerPoster}
        autoPlay
        muted
        loop
        controls={false}
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {!activated && <div className="absolute inset-0 bg-black/50 pointer-events-none" />}

      {!activated && (
        <div className="relative grid place-content-center place-items-center md:gap-10 gap-2 px-4 md:px-16 h-full z-10 text-white text-center">
          <h1 className="text-2xl md:text-5xl font-medium leading-tight">
            What is Oneness Generation?
          </h1>
          <button
            onClick={handlePlay}
            className="flex items-center justify-center md:gap-2 gap-1 border-[0.5px] border-white px-4 py-1 md:px-6 text-white md:text-3xl text-lg rounded-full transition-transform hover:scale-105 hover:bg-white hover:text-black"
          >
            <p className="font-medium">Play</p>
            <GoPlay className="text-2xl md:text-3xl" />
          </button>
        </div>
      )}
    </div>
  );
}
