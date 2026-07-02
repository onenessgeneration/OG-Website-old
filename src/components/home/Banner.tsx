import { useState } from "react";
import { GoPlay } from "react-icons/go";
import bannerPoster from "@/assets/Home/Vision/visionimage.jpg";

// Ported from oneness-frontend/src/Components/Home/Banner.jsx.
// The old code fetched a bannerVideoURL from a Render API that no
// longer exists; we render a poster image and keep the Play button
// visible for now. When a video asset is provided we can wire it in
// via the `videoSrc` prop.

interface Props {
  videoSrc?: string;
}

export default function Banner({ videoSrc }: Props) {
  const [isVideoPlaying, setVideoPlaying] = useState(false);

  const handlePlay = () => {
    if (!videoSrc) return;
    setVideoPlaying(true);
    setTimeout(() => {
      const v = document.getElementById("banner-video") as HTMLVideoElement | null;
      v?.play().catch(() => {});
    }, 100);
  };

  const handleClose = () => {
    setVideoPlaying(false);
    const v = document.getElementById("banner-video") as HTMLVideoElement | null;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <div className="relative w-full min-h-[250px] md:h-[calc(100dvh-84px)] h-[200px] overflow-hidden">
      {isVideoPlaying && videoSrc ? (
        <div className="relative w-full h-full">
          <video
            id="banner-video"
            className="absolute top-0 left-0 w-full h-full object-cover aspect-[16/9]"
            src={videoSrc}
            controls
            autoPlay
            muted
            playsInline
            preload="auto"
          />
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white bg-black/70 hover:bg-black/90 rounded-full p-3 md:p-4 z-20 transition-transform hover:scale-110"
            aria-label="Close video"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <img
          src={bannerPoster}
          alt=""
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      )}

      {!isVideoPlaying && <div className="absolute inset-0 bg-black/50" />}

      <div className="relative grid place-content-center place-items-center md:gap-10 gap-2 px-4 md:px-16 h-full z-10 text-white text-center">
        <h1 className="text-2xl md:text-5xl font-medium leading-tight">
          What is Oneness Generation?
        </h1>
        {!isVideoPlaying && (
          <button
            onClick={handlePlay}
            disabled={!videoSrc}
            className="flex items-center justify-center md:gap-2 gap-1 border-[0.5px] border-white px-4 py-1 md:px-6 text-white md:text-3xl text-lg rounded-full transition-transform hover:scale-105 hover:bg-white hover:text-black disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white disabled:hover:scale-100"
          >
            <p className="font-medium">Play</p>
            <GoPlay className="text-2xl md:text-3xl" />
          </button>
        )}
      </div>
    </div>
  );
}
