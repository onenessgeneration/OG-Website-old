import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import { ImagePlaceholder } from "@/components/Placeholder";

export type SfzEvent = {
  id: string;
  event_name: string;
  event_short_description: string | null;
  cover_url: string | null;
  location: string | null;
  location_type: string | null;
  start_at: string;
  end_at: string | null;
};

function formatTime(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatMonthDay(iso: string) {
  const d = new Date(iso);
  return {
    month: d.toLocaleString([], { month: "short" }),
    day: d.getDate().toString().padStart(2, "0"),
  };
}

export function EventCard({ e }: { e: SfzEvent }) {
  const { month, day } = formatMonthDay(e.start_at);
  return (
    <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden flex flex-col">
      <div className="relative">
        {e.cover_url ? (
          <img src={e.cover_url} alt={e.event_name} className="w-full h-56 object-cover" />
        ) : (
          <ImagePlaceholder label="Event" aspect="16/9" rounded="rounded-none" className="w-full" />
        )}
        <div className="absolute top-3 right-3 bg-white rounded-lg shadow-md px-3 py-1 text-center">
          <div className="text-xs font-semibold text-brown uppercase tracking-wide">{month}</div>
          <div className="text-lg font-bold text-darkGreyBrown leading-none">{day}</div>
        </div>
      </div>
      <div className="p-5 flex flex-col gap-3 flex-grow">
        <h3 className="md:text-lg font-bold text-gray-800 line-clamp-2">{e.event_name}</h3>
        {e.event_short_description && (
          <p className="text-gray-600 text-sm line-clamp-3 flex-grow">
            {e.event_short_description}
          </p>
        )}
        <div className="flex items-center justify-between text-sm text-gray-600 gap-3 flex-wrap">
          <p className="flex gap-2 items-center">
            <MapPin className="text-brown w-4 h-4" />
            {e.location || e.location_type || "TBD"}
          </p>
          <p className="flex gap-2 items-center">
            <Clock className="text-brown w-4 h-4" />
            {formatTime(e.start_at)}
            {e.end_at ? ` - ${formatTime(e.end_at)}` : ""}
          </p>
        </div>
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-brown text-white px-6 py-2 rounded-full text-sm hover:bg-yellow-800 transition"
          >
            View <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
