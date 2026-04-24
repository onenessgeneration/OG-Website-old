import type { CSSProperties } from "react";

interface Props {
  label?: string;
  className?: string;
  aspect?: string; // e.g. "16/9", "1/1", "4/5"
  rounded?: string;
  style?: CSSProperties;
}

export function ImagePlaceholder({ label = "Image", className = "", aspect = "4/3", rounded = "rounded-xl", style }: Props) {
  return (
    <div
      className={`relative overflow-hidden bg-soft-gradient border border-border ${rounded} ${className}`}
      style={{ aspectRatio: aspect, ...style }}
    >
      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm font-medium">
        <div className="flex flex-col items-center gap-2 opacity-70">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <span>{label}</span>
        </div>
      </div>
    </div>
  );
}

export function VideoPlaceholder({ label = "Video", className = "", aspect = "16/9" }: Props) {
  return (
    <div
      className={`relative overflow-hidden bg-primary/10 border border-border rounded-xl ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-soft">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </div>
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
      </div>
    </div>
  );
}
