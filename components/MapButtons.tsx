import { Map, Navigation } from "lucide-react";
import type { Settings } from "@/lib/types";

type MapButtonsProps = {
  settings: Settings;
};

export function MapButtons({ settings }: MapButtonsProps) {
  return (
    <div className="flex flex-col justify-center gap-3 sm:flex-row">
      <a
        className="responsive-action focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-[#F7F3EA] px-5 py-4 font-semibold text-[#0C1D0E] sm:px-6"
        href={settings.google_maps_url}
        rel="noreferrer"
        target="_blank"
      >
        <Map size={18} />
        Abrir en Google Maps
      </a>
      <a
        className="responsive-action focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-[#837E5E]/60 px-5 py-4 font-semibold text-[#F7F3EA] sm:px-6"
        href={settings.waze_url}
        rel="noreferrer"
        target="_blank"
      >
        <Navigation size={18} />
        Abrir en Waze
      </a>
    </div>
  );
}
