import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

interface Props {
  fallbackTo?: string;
  label?: string;
  className?: string;
}

export function BackButton({ fallbackTo = "/sfz", label = "Back", className = "" }: Props) {
  const router = useRouter();

  const handleClick = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: fallbackTo });
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label={label}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tan text-darkGreyBrown border border-tanAccent/40 hover:bg-tanAccent hover:text-white transition ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}
