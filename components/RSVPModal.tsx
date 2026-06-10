"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Heart, HeartOff, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { Guest } from "@/lib/types";
import { type RsvpFormInput, rsvpSchema } from "@/lib/validations";

type RSVPModalProps = {
  guest: Guest | null;
  isOpen: boolean;
  onClose: () => void;
};

function buildGreeting(displayName: string): string {
  const lower = displayName.toLowerCase();
  if (lower.includes("familia")) return `Querida ${displayName}`;
  if (lower.includes("señor") || lower.includes("don ")) return `Querido ${displayName}`;
  return `Hola, ${displayName} 💛`;
}

function buildCuposText(count: number): string {
  return count === 1
    ? "Tenemos reservado 1 cupo especialmente para ti."
    : `Tenemos reservados ${count} cupos especialmente para ustedes.`;
}

// ─── Inner form (only mounted when modal is open) ─────────────────────────────
function RSVPFormInner({ guest, onClose }: { guest: Guest; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [finalStatus, setFinalStatus] = useState<"confirmed" | "declined" | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [rsvpStatus, setRsvpStatus] = useState<"confirmed" | "declined">(
    guest.status === "declined" ? "declined" : "confirmed",
  );

  const form = useForm<RsvpFormInput>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      code: guest.code,
      status: rsvpStatus,
      confirmed_count: guest.confirmed_count || Math.min(1, guest.max_guests),
      food_restrictions: guest.food_restrictions ?? "",
      message: guest.message ?? "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, status: rsvpStatus }),
    });
    const payload = (await res.json()) as { message?: string; error?: string };
    if (!res.ok) {
      setServerError(payload.error ?? "No pudimos guardar tu confirmación.");
      return;
    }
    setFinalStatus(rsvpStatus);
    setSubmitted(true);
  });

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-4 text-center">
        <div
          className={`mb-5 grid h-16 w-16 place-items-center rounded-full ${
            finalStatus === "confirmed" ? "bg-[#154D35]/12" : "bg-[#837E5E]/10"
          }`}
        >
          {finalStatus === "confirmed" ? (
            <Check className="text-[#154D35]" size={30} strokeWidth={1.5} />
          ) : (
            <HeartOff className="text-[#837E5E]" size={28} strokeWidth={1.5} />
          )}
        </div>
        <p className="font-script text-4xl text-[#154D35]">{guest.display_name}</p>
        <div className="gold-line mx-auto my-5 w-24" />
        <p className="leading-8 text-[#15351f]">
          {finalStatus === "confirmed"
            ? "Gracias por confirmar. Nos alegra mucho saber que serán parte de este día tan especial."
            : "Gracias por avisarnos. Aunque nos habría encantado contar con ustedes, agradecemos mucho su cariño y buenos deseos."}
        </p>
        <p className="font-script mt-6 text-3xl text-[#154D35]">Con amor, Zequelly & Elio</p>
        <button
          className="mt-8 rounded-full border border-[#837E5E]/40 px-6 py-3 text-sm font-semibold text-[#15351f] transition hover:bg-[#154D35]/5"
          onClick={onClose}
          type="button"
        >
          Cerrar
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Encabezado personalizado */}
      <p className="font-script text-4xl leading-snug text-[#154D35]">
        {buildGreeting(guest.display_name)}
      </p>
      <p className="mt-2 text-sm leading-7 text-[#15351f]/70">{buildCuposText(guest.max_guests)}</p>
      <div className="gold-line mt-4 w-24" />

      {/* Opciones */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          className={`rounded-2xl border px-4 py-4 text-left transition ${
            rsvpStatus === "confirmed"
              ? "border-[#154D35] bg-[#154D35] text-[#F7F3EA]"
              : "border-[#837E5E]/30 bg-white/70 text-[#15351f] hover:border-[#154D35]/50"
          }`}
          onClick={() => {
            setRsvpStatus("confirmed");
            form.setValue("status", "confirmed");
          }}
          type="button"
        >
          <Check className="mb-2" size={18} />
          <p className="text-sm font-semibold">Sí, confirmamos asistencia</p>
          <p className="mt-0.5 text-xs opacity-70">Me alegra poder estar con ustedes</p>
        </button>
        <button
          className={`rounded-2xl border px-4 py-4 text-left transition ${
            rsvpStatus === "declined"
              ? "border-[#154D35] bg-[#154D35] text-[#F7F3EA]"
              : "border-[#837E5E]/30 bg-white/70 text-[#15351f] hover:border-[#154D35]/50"
          }`}
          onClick={() => {
            setRsvpStatus("declined");
            form.setValue("status", "declined");
            form.setValue("confirmed_count", 0);
          }}
          type="button"
        >
          <HeartOff className="mb-2" size={18} />
          <p className="text-sm font-semibold">No podremos asistir</p>
          <p className="mt-0.5 text-xs opacity-70">Les deseo todo lo mejor</p>
        </button>
      </div>

      {/* Cantidad */}
      <AnimatePresence>
        {rsvpStatus === "confirmed" && (
          <motion.div
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden"
            exit={{ opacity: 0, height: 0 }}
            initial={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
          >
            <label className="mt-5 block text-sm font-semibold text-[#15351f]">
              Personas que asistirán
              <select
                className="mt-2 w-full rounded-2xl border border-[#837E5E]/30 bg-white px-4 py-3 text-[#15351f] text-sm"
                {...form.register("confirmed_count", { valueAsNumber: true })}
              >
                {Array.from({ length: guest.max_guests }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "persona" : "personas"}
                  </option>
                ))}
              </select>
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Restricciones */}
      <label className="mt-4 block text-sm font-semibold text-[#15351f]">
        Restricciones alimentarias{" "}
        <span className="font-normal text-[#837E5E]">(opcional)</span>
        <input
          className="mt-2 w-full rounded-2xl border border-[#837E5E]/30 bg-white px-4 py-3 text-sm text-[#15351f]"
          placeholder="Vegetariano, alergias u otros detalles"
          {...form.register("food_restrictions")}
        />
      </label>

      {/* Mensaje */}
      <label className="mt-4 block text-sm font-semibold text-[#15351f]">
        Mensaje para los novios{" "}
        <span className="font-normal text-[#837E5E]">(opcional)</span>
        <textarea
          className="mt-2 min-h-24 w-full rounded-2xl border border-[#837E5E]/30 bg-white px-4 py-3 text-sm text-[#15351f]"
          placeholder="Con mucho amor…"
          {...form.register("message")}
        />
      </label>

      {serverError && (
        <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </p>
      )}

      <button
        className="mt-5 w-full rounded-full bg-[#154D35] px-6 py-4 text-sm font-semibold text-[#F7F3EA] transition hover:bg-[#0C1D0E] disabled:opacity-60"
        disabled={form.formState.isSubmitting}
        type="submit"
      >
        {form.formState.isSubmitting ? "Guardando con cariño…" : "Enviar confirmación"}
      </button>
    </form>
  );
}

// ─── Modal wrapper ─────────────────────────────────────────────────────────────
export function RSVPModal({ guest, isOpen, onClose }: RSVPModalProps) {
  // Bloquear scroll cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[60] bg-[#0C1D0E]/72 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
            transition={{ duration: 0.3 }}
          />

          {/* Modal card */}
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="fixed inset-x-3 bottom-0 top-[env(safe-area-inset-top,12px)] z-[61] mx-auto my-auto flex max-h-[calc(100dvh-24px)] w-full max-w-lg flex-col overflow-hidden rounded-[2rem] bg-[#F7F3EA] shadow-2xl sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:max-h-[90dvh] sm:-translate-x-1/2 sm:-translate-y-1/2"
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header verde */}
            <div className="relative flex-shrink-0 bg-[#154D35] px-6 py-5 sm:px-8 sm:py-6">
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-full border border-[#F7F3EA]/30">
                  <Heart className="text-[#F7F3EA]" size={15} strokeWidth={1.5} />
                </div>
                <h2 className="font-display text-xl text-[#F7F3EA] sm:text-2xl">
                  Confirma tu asistencia
                </h2>
              </div>
              <div className="gold-line mt-3 w-32" />
              {/* X close */}
              <button
                aria-label="Cerrar"
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-[#F7F3EA]/70 transition hover:bg-[#F7F3EA]/10 hover:text-[#F7F3EA] sm:right-5 sm:top-5"
                onClick={onClose}
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
              {guest ? (
                <>
                  <p className="mb-5 text-sm leading-7 text-[#15351f]/70">
                    Tu presencia significa muchísimo para nosotros. Para ayudarnos a preparar
                    cada detalle con cariño, por favor confirma tu asistencia.
                  </p>
                  <RSVPFormInner guest={guest} onClose={onClose} />
                </>
              ) : (
                /* Sin link personalizado */
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="mb-5 grid h-16 w-16 place-items-center rounded-full border border-[#837E5E]/30 bg-[#154D35]/6">
                    <Heart className="text-[#154D35]" size={28} strokeWidth={1.4} />
                  </div>
                  <p className="font-display text-xl text-[#154D35]">¡Nos alegra tu interés!</p>
                  <div className="gold-line mx-auto my-4 w-20" />
                  <p className="leading-7 text-[#15351f]">
                    Para confirmar asistencia, usá el{" "}
                    <strong>link personalizado</strong> que te enviamos por WhatsApp. Cada link
                    está preparado especialmente para vos.
                  </p>
                  <p className="mt-4 text-sm text-[#837E5E]">
                    ¿No lo encontrás? Escribinos y con gusto te lo reenviamos con todo el cariño.
                  </p>
                  <button
                    className="mt-7 rounded-full bg-[#154D35] px-6 py-3 text-sm font-semibold text-[#F7F3EA] transition hover:bg-[#0C1D0E]"
                    onClick={onClose}
                    type="button"
                  >
                    Entendido
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
