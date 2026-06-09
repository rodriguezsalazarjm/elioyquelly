"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CalendarDays, Heart, MailCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Countdown } from "./Countdown";
import { Footer } from "./Footer";
import { GiftModal } from "./GiftModal";
import { InfoPopup } from "./InfoPopup";
import { IntroScreen } from "./IntroScreen";
import { MapButtons } from "./MapButtons";
import { MusicPlayer } from "./MusicPlayer";
import { Section } from "./Section";
import { SpotifyPlaylist } from "./SpotifyPlaylist";
import { WeddingDetails } from "./WeddingDetails";
import type { Settings } from "@/lib/types";

type HomeClientProps = {
  settings: Settings;
  dateLabel: string;
};

const heroSlides = [
  {
    image: "/hero1.webp",
    bgPosition: "center 38%",
    title: "Una historia que comienza para siempre",
    phrase: "Cada momento compartido nos trajo hasta este día.",
  },
  {
    image: "/hero2.webp",
    bgPosition: "center 30%",
    title: "Dos vidas que se hacen una sola",
    phrase: "Un amor que eligió quedarse, crecer y celebrar.",
  },
  {
    image: "/antepag.webp",
    bgPosition: "center 36%",
    title: "Celebra con nosotros",
    phrase: "Una noche para abrazar la alegría y guardar recuerdos.",
  },
];

export function HomeClient({ settings, dateLabel }: HomeClientProps) {
  const [entered, setEntered] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (!entered) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [entered]);

  const slide = heroSlides[activeSlide];

  return (
    <>
      <AnimatePresence>{!entered ? <IntroScreen dateLabel={dateLabel} onEnter={() => setEntered(true)} /> : null}</AnimatePresence>
      <MusicPlayer enabled={entered} src={settings.main_song_url} />

      <main>
        {entered ? (
          <button
            aria-label="Volver a la preinvitación"
            className="focus-ring fixed left-3 top-3 z-40 grid h-11 w-11 place-items-center rounded-full border border-[#F7F3EA]/24 bg-[#0C1D0E]/55 text-[#F7F3EA] shadow-2xl backdrop-blur-xl transition hover:bg-[#F7F3EA] hover:text-[#0C1D0E] sm:left-4 sm:top-4"
            onClick={() => setEntered(false)}
            type="button"
          >
            <ArrowLeft size={17} />
          </button>
        ) : null}

        <section className="hero-cinema-section relative overflow-hidden">
          <div className="hero-cinema">
            <div className="absolute inset-0 bg-black" />
            <AnimatePresence>
              <motion.div
                animate={{ opacity: 1, scale: 1.12 }}
                className="absolute inset-0 bg-cover"
                exit={{ opacity: 0, scale: 1.16 }}
                initial={{ opacity: 0, scale: 1 }}
                key={slide.image}
                style={{ backgroundImage: `url(${slide.image})`, backgroundPosition: slide.bgPosition }}
                transition={{
                  opacity: { duration: 1.35, ease: "easeInOut" },
                  scale: { duration: 7.8, ease: "easeOut" },
                }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-b from-black/28 via-transparent to-black/80" />
            <div className="hero-cinema-text">
              <AnimatePresence mode="wait">
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 18 }}
                  initial={{ opacity: 0, y: 18 }}
                  key={slide.title}
                  transition={{ duration: 1.1, ease: "easeOut" }}
                >
                  <p className="responsive-kicker mb-4 inline-flex items-center gap-2 rounded-full border border-[#F7F3EA]/28 bg-[#0C1D0E]/34 px-3 py-2 text-[0.68rem] font-semibold uppercase text-[#F7F3EA] backdrop-blur-xl sm:px-4 sm:text-xs">
                    <Sparkles size={15} />
                    Zequelly & Elio
                  </p>
                  <h1 className="text-balance font-display text-4xl leading-tight text-[#F7F3EA] sm:text-6xl lg:text-7xl">
                    {slide.title}
                  </h1>
                  <p className="text-pretty mt-5 max-w-xl font-display text-xl leading-8 text-[#E2E5E2] sm:text-2xl sm:leading-9">
                    {slide.phrase}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="absolute bottom-5 right-5 z-[3] flex gap-2">
              {heroSlides.map((item, index) => (
                <button
                  aria-label={`Ver imagen ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeSlide ? "w-9 bg-[#F7F3EA]" : "w-4 bg-[#F7F3EA]/40"
                  }`}
                  key={item.image}
                  onClick={() => setActiveSlide(index)}
                  type="button"
                />
              ))}
            </div>
          </div>
        </section>

        <section className="hero-message-band relative overflow-hidden py-14 sm:py-20">
          <div className="container-shell relative">
            {/* Ornamentos botánicos */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50">
              <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full border border-[#837E5E]/25" />
              <div className="absolute left-1/2 top-0 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/4 rounded-full border border-[#F7F3EA]/10" />
              <div className="absolute -left-24 top-1/3 h-64 w-64 rounded-full border border-[#837E5E]/18" />
              <div className="absolute -right-20 bottom-1/4 h-80 w-80 rounded-full border border-[#837E5E]/15" />
            </div>
            <motion.div
              animate={{ y: 0, opacity: 1 }}
              className="liquid-glass mobile-tight-glass mx-auto w-full max-w-4xl overflow-hidden rounded-[2rem]"
              initial={{ y: 28, opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-12">
                <p className="responsive-kicker text-center text-xs font-semibold uppercase text-[#A39F88]">
                  Zequelly & Elio
                </p>
                <div className="gold-line mx-auto mt-4 w-32" />
                <p className="hero-copy text-pretty mx-auto mt-8 max-w-2xl text-center leading-8 text-[#E2E5E2] sm:leading-9">
                  Después de tantos momentos compartidos, llegó el día de celebrar nuestro amor
                  junto a las personas que más queremos.
                </p>
                <p className="hero-copy text-pretty mx-auto mt-5 max-w-2xl text-center leading-8 text-[#E2E5E2] sm:leading-9">
                  Queremos que seas parte de esta noche especial, llena de alegría, música,
                  abrazos y recuerdos que guardaremos para siempre.
                </p>
                <div className="gold-line mx-auto mt-8 w-20" />
                <p className="font-script mt-6 text-center text-4xl text-[#F7F3EA] sm:text-5xl">
                  Con amor, Zequelly & Elio
                </p>
                <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <a
                    className="responsive-action focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-[#F7F3EA] px-5 py-4 font-semibold text-[#0C1D0E] sm:px-6"
                    href="#rsvp"
                  >
                    <MailCheck size={18} />
                    Confirma tu asistencia
                  </a>
                  <a
                    className="responsive-action focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-[#837E5E]/60 px-5 py-4 font-semibold text-[#F7F3EA] sm:px-6"
                    href="#detalles"
                  >
                    <CalendarDays size={18} />
                    Ver detalles
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Section eyebrow="Cuenta regresiva" title="Falta muy poco para nuestro gran día">
          <p className="mx-auto mb-8 max-w-2xl text-center leading-8 text-[#E2E5E2]">
            Cada día nos acerca más al momento en que diremos ‘sí’ y celebraremos junto a ustedes.
          </p>
          <Countdown target={settings.wedding_date} />
        </Section>

        <Section eyebrow="Celebra con nosotros" id="detalles" title="Detalles de la boda">
          <WeddingDetails settings={settings} />
          <p className="mx-auto mt-8 max-w-3xl text-center leading-8 text-[#E2E5E2]">
            Queremos que disfrutes la noche con nosotros de principio a fin. Te recomendamos llegar
            con unos minutos de anticipación.
          </p>
        </Section>

        <Section eyebrow="Nos encantaría contar contigo" id="rsvp" title="Confirma tu asistencia">
          <div className="glass-panel mx-auto max-w-3xl rounded-[1.5rem] p-5 text-center sm:p-7">
            <Heart className="mx-auto mb-5 text-[#A39F88]" size={30} strokeWidth={1.4} />
            <p className="leading-8 text-[#E2E5E2]">
              Tu presencia significa muchísimo para nosotros. Para ayudarnos a preparar cada detalle
              con cariño, por favor confirma tu asistencia antes del {settings.rsvp_deadline}.
            </p>
            <Link
              className="responsive-action focus-ring mt-7 inline-flex items-center justify-center rounded-full bg-[#F7F3EA] px-6 py-4 font-semibold text-[#0C1D0E] sm:px-7"
              href="/invitado/familia-rojas"
            >
              Confirmar asistencia
            </Link>
          </div>
        </Section>

        <Section eyebrow="Cómo llegar" title="Para llegar sin complicaciones">
          <p className="mx-auto mb-8 max-w-2xl text-center leading-8 text-[#E2E5E2]">
            Para que llegues sin complicaciones, te dejamos la ubicación exacta del lugar.
          </p>
          <MapButtons settings={settings} />
        </Section>

        <Section eyebrow="Detalles para disfrutar" title="Una noche especial">
          <div className="text-center">
            <InfoPopup />
          </div>
        </Section>

        <section className="gift-section-bg relative overflow-hidden py-20 sm:py-28" id="regalo">
          {/* Luz cenital suave */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_0%,rgba(247,243,234,0.16),transparent)]" />
          {/* Ornamentos botánicos */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
            <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#837E5E]/30" />
            <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#F7F3EA]/12" />
            <div className="absolute -left-16 top-1/4 h-56 w-56 rounded-full border border-[#837E5E]/20" />
            <div className="absolute -right-12 bottom-1/4 h-72 w-72 rounded-full border border-[#837E5E]/18" />
          </div>

          <div className="container-shell relative text-center">
            <p className="responsive-kicker text-xs font-semibold uppercase text-[#A39F88]">
              Tu presencia es nuestro mejor regalo
            </p>
            {/* Ícono corazón decorativo */}
            <div className="mx-auto mt-6 grid h-14 w-14 place-items-center rounded-full border border-[#837E5E]/40 bg-[#0C1D0E]/40 backdrop-blur-sm">
              <Heart className="text-[#A39F88]" size={24} strokeWidth={1.3} />
            </div>
            <h2 className="font-display mt-5 text-4xl text-[#F7F3EA] sm:text-5xl">
              Lluvia de amor
            </h2>
            <div className="gold-line mx-auto my-7 w-44" />
            <p className="mx-auto mb-10 max-w-lg leading-8 text-[#E2E5E2]">
              Tu presencia es lo que más nos importa. Pero si deseas tener un detalle especial
              con nosotros, aquí tienes cómo hacerlo.
            </p>
            <GiftModal settings={settings} />
          </div>
        </section>

        <Section eyebrow="Playlist" title="La música de nuestra historia">
          <p className="mx-auto mb-8 max-w-2xl text-center leading-8 text-[#E2E5E2]">
            Creamos una playlist especial para acompañar este momento. Puedes escucharla antes,
            durante o después de la boda y guardar un pedacito de esta celebración.
          </p>
          <SpotifyPlaylist url={settings.spotify_playlist_url} />
        </Section>

        <Footer />
      </main>
    </>
  );
}
