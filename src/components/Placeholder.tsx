import type { CSSProperties } from "react";

interface Props {
  label?: string;
  className?: string;
  aspect?: string;
  rounded?: string;
  style?: CSSProperties;
}

export function ImagePlaceholder({
  label = "Image",
  className = "",
  aspect = "4/3",
  rounded = "rounded-[28px]",
  style,
}: Props) {
  return (
    <div
      className={`relative overflow-hidden border border-border bg-secondary ${rounded} ${className}`}
      style={{ aspectRatio: aspect, ...style }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.6),rgba(208,185,140,0.16))]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 media-fade opacity-50" />
      {label ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full border border-border bg-background/90 px-4 py-1.5 text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
            {label}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function VideoPlaceholder({
  label = "Video",
  className = "",
  aspect = "16/9",
  rounded = "rounded-none",
  style,
}: Props) {
  return (
    <div
      className={`relative overflow-hidden border border-border bg-secondary ${rounded} ${className}`}
      style={{ aspectRatio: aspect, ...style }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(66,52,40,0.2),rgba(0,0,0,0.45))]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-4 rounded-full border border-background/70 bg-background/10 px-7 py-4 text-background backdrop-blur-sm">
          <span className="text-3xl font-semibold">Play</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-background/80">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
      </div>
      <div className="absolute left-6 top-6 rounded-full border border-background/60 bg-background/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-background/85 backdrop-blur-sm">
        {label}
      </div>
    </div>
  );
}
