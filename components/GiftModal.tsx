"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Copy, Gift, X } from "lucide-react";
import { useState } from "react";
import type { Settings } from "@/lib/types";

type GiftModalProps = {
  settings: Settings;
};

export function GiftModal({ settings }: GiftModalProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const bankDetails = [
    ["Nombre", settings.bank_holder_name],
    ["Banco", settings.bank_name],
    ["Tipo de cuenta", settings.bank_account_type],
    ["Número de cuenta", settings.bank_account_number],
    ["RUT", settings.bank_rut],
    ["Correo", settings.bank_email],
  ];

  const copy = async () => {
    await navigator.clipboard.writeText(bankDetails.map(([label, value]) => `${label}: ${value}`).join("\n"));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <button
          className="responsive-action focus-ring rounded-full bg-[#F7F3EA] px-5 py-4 font-semibold text-[#0C1D0E] sm:px-6"
          onClick={() => setOpen(true)}
          type="button"
        >
          Ver datos de transferencia
        </button>
        <a
          className="responsive-action focus-ring rounded-full border border-[#837E5E]/60 px-5 py-4 text-center font-semibold text-[#F7F3EA] sm:px-6"
          href={settings.mercadopago_public_url || "#regalo"}
        >
          Regalar con MercadoPago
        </a>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/60 px-3 py-4 sm:px-4"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <motion.div
              animate={{ y: 0, opacity: 1 }}
              className="ivory-panel max-h-[calc(100dvh-32px)] w-full max-w-md overflow-y-auto rounded-[1.5rem] p-5 sm:p-7"
              exit={{ y: 20, opacity: 0 }}
              initial={{ y: 20, opacity: 0 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <Gift className="mb-4 text-[#837E5E]" size={28} />
                  <h3 className="font-display text-3xl text-[#154D35]">Lluvia de amor</h3>
                </div>
                <button
                  aria-label="Cerrar datos de transferencia"
                  className="grid h-10 w-10 place-items-center rounded-full border border-[#837E5E]/30"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="mt-6 divide-y divide-[#837E5E]/20">
                {bankDetails.map(([label, value]) => (
                  <div className="flex justify-between gap-4 py-3 text-sm" key={label}>
                    <span className="font-semibold text-[#837E5E]">{label}</span>
                    <span className="overflow-wrap-anywhere text-right text-[#15351f]">{value}</span>
                  </div>
                ))}
              </div>
              <button
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#154D35] px-5 py-3 font-semibold text-[#F7F3EA]"
                onClick={copy}
                type="button"
              >
                <Copy size={18} />
                {copied ? "Datos copiados" : "Copiar datos"}
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
