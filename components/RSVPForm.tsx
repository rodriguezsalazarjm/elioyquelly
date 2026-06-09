"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Check, HeartOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Guest } from "@/lib/types";
import { type RsvpFormInput, rsvpSchema } from "@/lib/validations";

type RSVPFormProps = { guest: Guest };

const greetings: Record<string, string> = {
  familia: "Querida",
  familia_novio: "Querida",
  familia_novia: "Querida",
};

function buildGreeting(displayName: string): string {
  const lower = displayName.toLowerCase();
  if (lower.includes("familia")) return `Querida ${displayName}`;
  if (lower.includes("señor") || lower.includes("don ")) return `Querido ${displayName}`;
  return `Hola, ${displayName}`;
}

function buildCuposText(count: number): string {
  return count === 1
    ? "Tenemos reservado 1 cupo especialmente para ti."
    : `Tenemos reservados ${count} cupos especialmente para ustedes.`;
}

export function RSVPForm({ guest }: RSVPFormProps) {
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
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="ivory-panel rounded-[1.75rem] p-8 text-center"
        initial={{ opacity: 0, y: 12 }}
      >
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-[#154D35]/10">
          {finalStatus === "confirmed" ? (
            <Check className="text-[#154D35]" size={30} strokeWidth={1.5} />
          ) : (
            <HeartOff className="text-[#837E5E]" size={28} strokeWidth={1.5} />
          )}
        </div>
        <p className="font-script text-5xl text-[#154D35]">{guest.display_name}</p>
        <p className="mt-5 leading-8 text-[#15351f]">
          {finalStatus === "confirmed"
            ? "Gracias por confirmar. Nos alegra mucho saber que serán parte de este día tan especial."
            : "Gracias por avisarnos. Aunque nos habría encantado contar con ustedes, agradecemos mucho su cariño y buenos deseos."}
        </p>
        <div className="gold-line mx-auto mt-7 w-24" />
        <p className="font-script mt-5 text-3xl text-[#154D35]">Con amor, Zequelly & Elio</p>
      </motion.div>
    );
  }

  return (
    <form
      className="ivory-panel rounded-[1.75rem] p-6 sm:p-9"
      onSubmit={handleSubmit}
    >
      {/* Encabezado personalizado */}
      <p className="font-script text-5xl text-[#154D35]">{buildGreeting(guest.display_name)}</p>
      <p className="mt-3 leading-7 text-[#15351f]">{buildCuposText(guest.max_guests)}</p>
      <div className="gold-line mt-5 w-28" />

      {/* Botones confirmar / declinar */}
      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <button
          className={`rounded-2xl border px-5 py-4 text-left transition ${
            rsvpStatus === "confirmed"
              ? "border-[#154D35] bg-[#154D35] text-[#F7F3EA]"
              : "border-[#837E5E]/30 bg-white/60 text-[#15351f] hover:border-[#154D35]/40"
          }`}
          onClick={() => {
            setRsvpStatus("confirmed");
            form.setValue("status", "confirmed");
          }}
          type="button"
        >
          <Check className="mb-2.5" size={20} />
          <p className="font-semibold">Confirmaré mi asistencia</p>
          <p className="mt-0.5 text-xs opacity-70">Me alegra poder estar con ustedes</p>
        </button>
        <button
          className={`rounded-2xl border px-5 py-4 text-left transition ${
            rsvpStatus === "declined"
              ? "border-[#154D35] bg-[#154D35] text-[#F7F3EA]"
              : "border-[#837E5E]/30 bg-white/60 text-[#15351f] hover:border-[#154D35]/40"
          }`}
          onClick={() => {
            setRsvpStatus("declined");
            form.setValue("status", "declined");
            form.setValue("confirmed_count", 0);
          }}
          type="button"
        >
          <HeartOff className="mb-2.5" size={20} />
          <p className="font-semibold">No podré asistir</p>
          <p className="mt-0.5 text-xs opacity-70">Les deseo todo lo mejor</p>
        </button>
      </div>

      {/* Cantidad de asistentes */}
      <AnimatePresence>
        {rsvpStatus === "confirmed" ? (
          <motion.div
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden"
            exit={{ opacity: 0, height: 0 }}
            initial={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
          >
            <label className="mt-6 block text-sm font-semibold text-[#15351f]">
              Personas que asistirán
              <select
                className="mt-2 w-full rounded-2xl border border-[#837E5E]/30 bg-white px-4 py-3 text-[#15351f]"
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
        ) : null}
      </AnimatePresence>

      {/* Restricciones alimentarias */}
      <label className="mt-5 block text-sm font-semibold text-[#15351f]">
        Restricciones alimentarias{" "}
        <span className="font-normal text-[#837E5E]">(opcional)</span>
        <input
          className="mt-2 w-full rounded-2xl border border-[#837E5E]/30 bg-white px-4 py-3 text-[#15351f]"
          placeholder="Vegetariano, alergias u otros detalles"
          {...form.register("food_restrictions")}
        />
      </label>

      {/* Mensaje */}
      <label className="mt-5 block text-sm font-semibold text-[#15351f]">
        Mensaje para los novios{" "}
        <span className="font-normal text-[#837E5E]">(opcional)</span>
        <textarea
          className="mt-2 min-h-28 w-full rounded-2xl border border-[#837E5E]/30 bg-white px-4 py-3 text-[#15351f]"
          placeholder="Con mucho amor…"
          {...form.register("message")}
        />
      </label>

      {serverError ? (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </p>
      ) : null}

      <button
        className="mt-6 w-full rounded-full bg-[#154D35] px-6 py-4 font-semibold text-[#F7F3EA] transition hover:bg-[#0C1D0E] disabled:opacity-60"
        disabled={form.formState.isSubmitting}
        type="submit"
      >
        {form.formState.isSubmitting ? "Guardando con cariño…" : "Confirmar asistencia"}
      </button>
    </form>
  );
}
