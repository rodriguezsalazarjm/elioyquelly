"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SkipForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type VideoSplashProps = {
  src: string;
  onComplete: () => void;
};

export function VideoSplash({ src, onComplete }: VideoSplashProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showSkip, setShowSkip] = useState(false);
  const [exiting, setExiting] = useState(false);

  // Mostrar botón skip después de 3 segundos
  useEffect(() => {
    const t = window.setTimeout(() => setShowSkip(true), 3000);
    return () => window.clearTimeout(t);
  }, []);

  // Autoplay en cuanto el componente monta (el usuario ya hizo click = política satisfecha)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Si falla (edge case), ir directo a la experiencia
        handleEnd();
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnd = () => {
    if (exiting) return;
    setExiting(true);
    // Esperar el fade-out antes de llamar onComplete
    window.setTimeout(onComplete, 900);
  };

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Video */}
      <motion.video
        ref={videoRef}
        animate={{ opacity: exiting ? 0 : 1 }}
        className="h-full w-full object-cover"
        initial={{ opacity: 0 }}
        onEnded={handleEnd}
        playsInline
        preload="auto"
        transition={{ duration: 0.85, ease: "easeInOut" }}
      >
        <source src={src} type="video/mp4" />
      </motion.video>

      {/* Overlay muy suave en los bordes */}
      {!exiting && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.38)_100%)]" />
      )}

      {/* Botón skip */}
      <AnimatePresence>
        {showSkip && !exiting && (
          <motion.button
            animate={{ opacity: 1, y: 0 }}
            aria-label="Saltar intro"
            className="absolute bottom-8 right-6 flex items-center gap-2 rounded-full border border-white/25 bg-black/40 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-md transition hover:bg-white/15 hover:text-white sm:bottom-10 sm:right-8"
            exit={{ opacity: 0, y: 6 }}
            initial={{ opacity: 0, y: 10 }}
            onClick={handleEnd}
            transition={{ duration: 0.4 }}
            type="button"
          >
            <SkipForward size={14} />
            Saltar
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
