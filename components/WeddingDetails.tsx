import { CalendarHeart, MapPin, Sparkles } from "lucide-react";
import type { Settings } from "@/lib/types";

type WeddingDetailsProps = {
  settings: Settings;
};

const icons = {
  Ceremonia: CalendarHeart,
  Celebración: Sparkles,
  "Dress code": MapPin,
};

export function WeddingDetails({ settings }: WeddingDetailsProps) {
  const cards = [
    {
      title: "Ceremonia",
      lines: [settings.ceremony_place, settings.ceremony_time, settings.ceremony_address],
    },
    {
      title: "Celebración",
      lines: [settings.party_place, settings.party_time, settings.party_address],
    },
    {
      title: "Dress code",
      lines: ["Elegante formal", "Tonos sugeridos: verde, dorado, negro, nude o colores neutros."],
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = icons[card.title as keyof typeof icons];
        return (
          <article className="ivory-panel botanical rounded-2xl p-5 sm:p-6" key={card.title}>
            <Icon className="mb-6 text-[#837E5E]" size={28} strokeWidth={1.4} />
            <h3 className="font-display text-2xl text-[#154D35]">{card.title}</h3>
            <div className="mt-5 space-y-2 overflow-wrap-anywhere text-sm leading-6 text-[#15351f]">
              {card.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
