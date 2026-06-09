"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Banknote, Check, Copy, CreditCard, Heart, X } from "lucide-react";
import { useState } from "react";
import type { Settings } from "@/lib/types";

type GiftModalProps = {
  settings: Settings;
};

export function GiftModal({ settings }: GiftModalProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const bankDetails = [
    ["Titular", settings.bank_holder_name],
    ["Banco", settings.bank_name],
    ["Tipo de cuenta", settings.bank_account_type],
    ["N.° de cuenta", settings.bank_account_number],
    ["RUT", settings.bank_rut],
    ["Correo", settings.bank_email],
  ];

  const copy = async () => {
    await navigator.clipboard.writeText(
      bankDetails.map(([label, value]) => `${label}: ${value}`).join("\n"),
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2400);
  };

  return (
    <>
      <div className="gift-cards-grid">
        {/* Card: Transferencia */}
        <button className="gift-card group" onClick={() => setOpen(true)} type="button">
          <div className="gift-card-icon">
            <Banknote size={24} strokeWidth={1.4} />
          </div>
          <p className="gift-card-title">Transferencia</p>
          <p className="gift-card-desc">Datos bancarios listos para copiar en un tap</p>
          <span className="gift-card-cta">Ver datos →</span>
        </button>

        {/* Card: MercadoPago — solo si está habilitado */}
        {settings.mercadopago_enabled ? (
          <a
            className="gift-card group"
            href={settings.mercadopago_public_url}
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="gift-card-icon">
              <CreditCard size={24} strokeWidth={1.4} />
            </div>
            <p className="gift-card-title">MercadoPago</p>
            <p className="gift-card-desc">Pago rápido y seguro desde tu teléfono</p>
            <span className="gift-card-cta gift-card-cta--outline">Ir a MercadoPago →</span>
          </a>
        ) : null}
      </div>

      {/* Modal popup de transferencia */}
      <AnimatePresence>
        {open ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            transition={{ duration: 0.22 }}
          >
            <motion.div
              animate={{ y: 0, opacity: 1, scale: 1 }}
              className="w-full max-w-md overflow-hidden rounded-[1.75rem] shadow-2xl"
              exit={{ y: 20, opacity: 0, scale: 0.96 }}
              initial={{ y: 20, opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Header verde */}
              <div className="relative bg-[#154D35] px-7 pb-7 pt-8 text-center">
                <button
                  aria-label="Cerrar"
                  className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-[#F7F3EA]/20 text-[#F7F3EA]/50 transition hover:border-[#F7F3EA]/40 hover:text-[#F7F3EA]"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  <X size={15} />
                </button>
                <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full border border-[#A39F88]/40 bg-[#0C1D0E]/30">
                  <Heart className="text-[#A39F88]" size={22} strokeWidth={1.4} />
                </div>
                <h3 className="font-display text-2xl text-[#F7F3EA]">Lluvia de amor</h3>
                <p className="mt-1 text-sm text-[#A39F88]">Datos de transferencia</p>
                <div className="gold-line mx-auto mt-5 w-24" />
              </div>

              {/* Cuerpo marfil */}
              <div className="bg-[#F7F3EA] px-7 py-6">
                <div className="divide-y divide-[#837E5E]/18">
                  {bankDetails.map(([label, value]) => (
                    <div className="flex items-center justify-between gap-4 py-3.5" key={label}>
                      <span className="text-xs font-semibold uppercase tracking-wide text-[#837E5E]">
                        {label}
                      </span>
                      <span className="overflow-wrap-anywhere text-right text-sm font-medium text-[#15351f]">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Botón copiar */}
                <button
                  className="mt-6 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-[#154D35] px-5 py-3.5 font-semibold text-[#F7F3EA] transition active:scale-[0.98]"
                  onClick={copy}
                  type="button"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {copied ? (
                      <motion.span
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2"
                        exit={{ opacity: 0, y: -8 }}
                        initial={{ opacity: 0, y: 8 }}
                        key="copied"
                        transition={{ duration: 0.2 }}
                      >
                        <Check size={16} />
                        ¡Copiado con amor!
                      </motion.span>
                    ) : (
                      <motion.span
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2"
                        exit={{ opacity: 0, y: -8 }}
                        initial={{ opacity: 0, y: 8 }}
                        key="copy"
                        transition={{ duration: 0.2 }}
                      >
                        <Copy size={16} />
                        Copiar todos los datos
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                <p className="mt-4 text-center text-xs text-[#837E5E]">
                  También puedes cerrar tocando fuera de esta ventana
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
