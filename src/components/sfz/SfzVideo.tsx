import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { SiteVideo } from "@/components/SiteMedia";
import sfzOfficialVideo from "@/assets/sfz/SFZ_Official_Video.mp4.asset.json";

/**
 * The SFZ program video. Reads from the `sfz/program.mp4` CMS slot; falls
 * back to the shipped SFZ Official Video asset when the slot is empty so the
 * site still shows something during the transition to CMS control.
 *
 * Historically this reused `soul-sync/hero.mp4`, which meant editing the
 * Soul Sync video also changed the SFZ video (and vice versa). They now have
 * separate slots.
 */
export function SfzVideo({ className = "" }: { className?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    const v = wrapperRef.current?.querySelector("video");
    if (!v) return;
    const next = !muted;
    v.muted = next;
    if (!next) v.play().catch(() => {});
    setMuted(next);
  };

  return (
    <div ref={wrapperRef} className={`relative w-full h-full ${className}`}>
      <SiteVideo
        path="sfz/program.mp4"
        defaultSrc={sfzOfficialVideo.url}
        fallbackAspect="9/16"
        fallbackRounded="rounded-none"
        className="absolute inset-0 w-full h-full object-cover cursor-pointer"
      />
      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "Unmute video" : "Mute video"}
        className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition z-10"
      >
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
