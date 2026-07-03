import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import sfzVideoAsset from "@/assets/sfz/SFZ_Official_Video.mp4.asset.json";

export function SfzVideo({ className = "" }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    if (!next) {
      // ensure playback continues when user unmutes
      v.play().catch(() => {});
    }
    setMuted(next);
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <video
        ref={videoRef}
        src={sfzVideoAsset.url}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onClick={toggleMute}
        className="absolute inset-0 w-full h-full object-cover cursor-pointer"
      />
      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "Unmute video" : "Mute video"}
        className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition"
      >
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
