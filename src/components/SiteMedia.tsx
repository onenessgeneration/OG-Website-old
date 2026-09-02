import { useState } from "react";
import { siteMediaUrl, SITE_MEDIA_SLOTS } from "@/lib/siteMedia";

/**
 * Look up a slot by its bucket path. Used to render a helpful "missing" label
 * on the live site — when a CMS slot hasn't been filled in yet AND there's
 * no built-in default, we show the slot id/label so an admin visiting the
 * page can immediately locate the media in /admin/site-media.
 */
function findSlot(path: string) {
  return SITE_MEDIA_SLOTS.find((s) => s.path === path);
}

function MissingSlotOverlay({
  path,
  className,
  fallbackAspect,
  fallbackRounded,
}: {
  path: string;
  className?: string;
  fallbackAspect?: string;
  fallbackRounded?: string;
}) {
  const slot = findSlot(path);
  return (
    <div
      className={`bg-tan/60 border border-dashed border-brown/50 text-brown/80 flex items-center justify-center ${fallbackRounded ?? ""} ${className ?? ""}`}
      style={{ aspectRatio: fallbackAspect ?? "16/9" }}
    >
      <div className="text-center px-3 py-2 text-[11px] leading-tight">
        <div className="font-semibold uppercase tracking-wide">Media slot</div>
        <div className="mt-0.5 font-mono text-[10px] break-all">{slot?.id ?? path}</div>
        <div className="mt-1 opacity-80">{slot?.label ?? "Upload from /admin/site-media"}</div>
      </div>
    </div>
  );
}

type ImgProps = {
  path: string;
  alt: string;
  className?: string;
  /**
   * Baked-in fallback used when the CMS slot has nothing uploaded yet. Prevents
   * the site from looking broken during the transition to full CMS control.
   */
  defaultSrc?: string;
  fallbackLabel?: string;
  fallbackAspect?: string;
  fallbackRounded?: string;
};

export function SiteImage({
  path,
  alt,
  className = "",
  defaultSrc,
  fallbackAspect = "16/9",
  fallbackRounded = "rounded-none",
}: ImgProps) {
  const [remoteFailed, setRemoteFailed] = useState(false);
  const [defaultFailed, setDefaultFailed] = useState(false);

  if (remoteFailed) {
    if (defaultSrc && !defaultFailed) {
      return (
        <img
          src={defaultSrc}
          alt={alt}
          onError={() => setDefaultFailed(true)}
          className={className}
        />
      );
    }
    return (
      <MissingSlotOverlay
        path={path}
        className={className}
        fallbackAspect={fallbackAspect}
        fallbackRounded={fallbackRounded}
      />
    );
  }

  return (
    <img
      src={siteMediaUrl(path)}
      alt={alt}
      onError={() => setRemoteFailed(true)}
      className={className}
    />
  );
}

type VidProps = {
  path: string;
  className?: string;
  defaultSrc?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  poster?: string;
  defaultPoster?: string;
  fallbackLabel?: string;
  fallbackAspect?: string;
  fallbackRounded?: string;
  ref?: React.Ref<HTMLVideoElement>;
};

export function SiteVideo({
  path,
  className = "",
  defaultSrc,
  autoPlay = true,
  muted = true,
  loop = true,
  controls = false,
  playsInline = true,
  poster,
  defaultPoster,
  fallbackAspect = "16/9",
  fallbackRounded = "rounded-none",
  ref,
}: VidProps) {
  const [remoteFailed, setRemoteFailed] = useState(false);
  const [defaultFailed, setDefaultFailed] = useState(false);

  if (remoteFailed) {
    if (defaultSrc && !defaultFailed) {
      return (
        <video
          ref={ref}
          src={defaultSrc}
          poster={defaultPoster ?? poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          controls={controls}
          playsInline={playsInline}
          preload="metadata"
          onError={() => setDefaultFailed(true)}
          className={className}
        />
      );
    }
    return (
      <MissingSlotOverlay
        path={path}
        className={className}
        fallbackAspect={fallbackAspect}
        fallbackRounded={fallbackRounded}
      />
    );
  }

  return (
    <video
      ref={ref}
      src={siteMediaUrl(path)}
      poster={poster}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      controls={controls}
      playsInline={playsInline}
      preload="metadata"
      onError={() => setRemoteFailed(true)}
      className={className}
    />
  );
}

