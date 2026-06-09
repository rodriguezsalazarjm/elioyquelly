"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

const details = [
  "Llegar 15 minutos antes de la hora indicada.",
  "Confirmar asistencia antes de la fecha límite.",
  "Respetar el dress code sugerido.",
  "Evitar publicar fotos o videos antes de que los novios compartan los suyos, si así lo desean.",
  "Ante cualquier duda, puedes escribirnos directamente.",
];

export function InfoPopup() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="focus-ring rounded-full border border-[#837E5E]/60 px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#F7F3EA] transition hover:bg-[#F7F3EA] hover:text-[#0C1D0E]"
        onClick={() => setOpen(true)}
        type="button"
      >
        Información importante
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <motion.div
              animate={{ y: 0, opacity: 1 }}
              className="ivory-panel botanical w-full max-w-lg rounded-[1.6rem] p-7"
              exit={{ y: 20, opacity: 0 }}
              initial={{ y: 20, opacity: 0 }}
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#837E5E]">
                    Con mucho cariño
                  </p>
                  <h3 className="font-display mt-2 text-3xl text-[#154D35]">
                    Antes de acompañarnos
                  </h3>
                </div>
                <button
                  aria-label="Cerrar información"
                  className="grid h-10 w-10 place-items-center rounded-full border border-[#837E5E]/30"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="mt-5 leading-7 text-[#15351f]">
                Con mucho cariño queremos compartir algunos detalles para que todos podamos
                disfrutar de una noche especial:
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-6">
                {details.map((detail) => (
                  <li className="flex gap-3" key={detail}>
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#837E5E]" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
              <button
                className="mt-7 w-full rounded-full bg-[#154D35] px-5 py-3 font-semibold text-[#F7F3EA]"
                onClick={() => setOpen(false)}
                type="button"
              >
                Entendido
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
