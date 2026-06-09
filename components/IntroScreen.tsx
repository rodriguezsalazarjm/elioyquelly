"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

type IntroScreenProps = {
  dateLabel: string;
  onEnter: () => void;
};

export function IntroScreen({ dateLabel, onEnter }: IntroScreenProps) {
  return (
    <motion.div
      className="intro-photo-bg fixed inset-0 z-50 grid place-items-center bg-[#0C1D0E] px-3 py-3 text-center sm:px-6"
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(247,243,234,0.08),transparent_26rem)]" />
      <div className="botanical liquid-glass intro-card w-full max-w-lg rounded-[2rem] px-5 py-9 sm:px-12 sm:py-12">
        <div className="mx-auto mb-6 grid h-12 w-12 place-items-center rounded-full border border-[#837E5E]/40 text-[#F7F3EA] sm:mb-8 sm:h-14 sm:w-14">
          <Heart size={22} strokeWidth={1.4} />
        </div>
        <p className="responsive-kicker text-xs font-semibold uppercase text-[#A39F88]">
          Nos casamos
        </p>
        <h1 className="intro-title font-script my-5 leading-none text-[#F7F3EA]">
          Zequelly & Elio
        </h1>
        <div className="gold-line mx-auto mb-7 w-40" />
        <p className="text-pretty mx-auto max-w-sm text-sm leading-7 text-[#E2E5E2] sm:text-base sm:leading-8">
          Con mucha alegría queremos invitarte a celebrar el inicio de nuestra nueva
          historia juntos.
        </p>
        <p className="mt-7 font-display text-lg capitalize text-[#F7F3EA] sm:text-xl">
          {dateLabel}
        </p>
        <button
          className="liquid-button responsive-action focus-ring mt-8 rounded-full px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#0C1D0E] transition hover:scale-[1.02] sm:mt-10 sm:px-7"
          onClick={onEnter}
          type="button"
        >
          Entrar a la invitación
        </button>
      </div>
    </motion.div>
  );
}
