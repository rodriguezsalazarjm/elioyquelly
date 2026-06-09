"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, HeartOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Guest } from "@/lib/types";
import { type RsvpFormInput, rsvpSchema } from "@/lib/validations";

type RSVPFormProps = {
  guest: Guest;
};

export function RSVPForm({ guest }: RSVPFormProps) {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"confirmed" | "declined">(
    guest.status === "declined" ? "declined" : "confirmed",
  );

  const form = useForm<RsvpFormInput>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      code: guest.code,
      status,
      confirmed_count: guest.confirmed_count || Math.min(1, guest.max_companions),
      food_restrictions: guest.food_restrictions,
      message: guest.message,
    },
  });

  const submit = form.handleSubmit(async (values) => {
    setError(null);
    setResult(null);

    const response = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, status }),
    });
    const payload = (await response.json()) as { message?: string; error?: string };

    if (!response.ok) {
      setError(payload.error ?? "No pudimos guardar tu confirmación.");
      return;
    }

    setResult(payload.message ?? "Gracias por confirmar.");
  });

  return (
    <form className="ivory-panel mx-auto max-w-2xl rounded-[1.5rem] p-6 sm:p-8" onSubmit={submit}>
      <p className="font-script text-5xl text-[#154D35]">Hola, {guest.full_name}</p>
      <p className="mt-3 leading-7 text-[#15351f]">
        Tenemos reservado {guest.max_companions} cupo(s) para ti. Tu presencia significa
        muchísimo para nosotros.
      </p>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <button
          className={`rounded-2xl border px-5 py-4 text-left transition ${
            status === "confirmed"
              ? "border-[#154D35] bg-[#154D35] text-[#F7F3EA]"
              : "border-[#837E5E]/30 bg-white/60 text-[#15351f]"
          }`}
          onClick={() => {
            setStatus("confirmed");
            form.setValue("status", "confirmed");
          }}
          type="button"
        >
          <Check className="mb-3" size={22} />
          Confirmaré mi asistencia
        </button>
        <button
          className={`rounded-2xl border px-5 py-4 text-left transition ${
            status === "declined"
              ? "border-[#154D35] bg-[#154D35] text-[#F7F3EA]"
              : "border-[#837E5E]/30 bg-white/60 text-[#15351f]"
          }`}
          onClick={() => {
            setStatus("declined");
            form.setValue("status", "declined");
            form.setValue("confirmed_count", 0);
          }}
          type="button"
        >
          <HeartOff className="mb-3" size={22} />
          No podré asistir
        </button>
      </div>

      {status === "confirmed" ? (
        <label className="mt-6 block text-sm font-semibold text-[#15351f]">
          Personas que asistirán
          <select
            className="mt-2 w-full rounded-2xl border border-[#837E5E]/30 bg-white px-4 py-3"
            {...form.register("confirmed_count", { valueAsNumber: true })}
          >
            {Array.from({ length: guest.max_companions }, (_, index) => index + 1).map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <label className="mt-5 block text-sm font-semibold text-[#15351f]">
        Restricciones alimentarias
        <input
          className="mt-2 w-full rounded-2xl border border-[#837E5E]/30 bg-white px-4 py-3"
          placeholder="Vegetariano, alergias u otros detalles"
          {...form.register("food_restrictions")}
        />
      </label>

      <label className="mt-5 block text-sm font-semibold text-[#15351f]">
        Mensaje para los novios
        <textarea
          className="mt-2 min-h-28 w-full rounded-2xl border border-[#837E5E]/30 bg-white px-4 py-3"
          placeholder="Con mucho amor..."
          {...form.register("message")}
        />
      </label>

      {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {result ? (
        <p className="mt-4 rounded-2xl bg-[#154D35]/10 px-4 py-3 text-sm text-[#154D35]">
          {result}
        </p>
      ) : null}

      <button
        className="mt-6 w-full rounded-full bg-[#154D35] px-6 py-4 font-semibold text-[#F7F3EA] transition hover:bg-[#0C1D0E]"
        disabled={form.formState.isSubmitting}
        type="submit"
      >
        {form.formState.isSubmitting ? "Guardando con cariño..." : "Confirmar asistencia"}
      </button>
    </form>
  );
}
