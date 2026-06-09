import { createSupabaseAdminClient } from "./supabase";
import type { Guest } from "./types";
import type { RsvpInput } from "./validations";

const now = new Date().toISOString();

export const demoGuests: Guest[] = [
  {
    id: "1",
    code: "familia-rojas",
    full_name: "Familia Rojas",
    group_name: "Familia",
    max_companions: 4,
    status: "pending",
    confirmed_count: 0,
    food_restrictions: "",
    message: "",
    created_at: now,
    updated_at: now,
  },
  {
    id: "2",
    code: "camila",
    full_name: "Camila Soto",
    group_name: "Amigos",
    max_companions: 2,
    status: "confirmed",
    confirmed_count: 2,
    food_restrictions: "Vegetariana",
    message: "Felices de acompañarlos.",
    created_at: now,
    updated_at: now,
  },
  {
    id: "3",
    code: "tio-mario",
    full_name: "Mario Fernández",
    group_name: "Familia",
    max_companions: 1,
    status: "declined",
    confirmed_count: 0,
    food_restrictions: "",
    message: "Les mando todo mi cariño.",
    created_at: now,
    updated_at: now,
  },
];

const memoryGuests = new Map(demoGuests.map((guest) => [guest.code, { ...guest }]));

export async function getGuestByCode(code: string) {
  const supabase = createSupabaseAdminClient();

  if (supabase) {
    const { data, error } = await supabase.from("guests").select("*").eq("code", code).single();
    if (!error && data) {
      return data as Guest;
    }
  }

  return memoryGuests.get(code) ?? null;
}

export async function listGuests() {
  const supabase = createSupabaseAdminClient();

  if (supabase) {
    const { data, error } = await supabase.from("guests").select("*").order("group_name");
    if (!error && data) {
      return data as Guest[];
    }
  }

  return Array.from(memoryGuests.values());
}

export async function updateGuestRsvp(input: RsvpInput) {
  const guest = await getGuestByCode(input.code);

  if (!guest) {
    throw new Error("No encontramos esta invitación.");
  }

  if (input.status === "confirmed" && input.confirmed_count < 1) {
    throw new Error("Indica cuántas personas asistirán.");
  }

  if (input.confirmed_count > guest.max_companions) {
    throw new Error("La cantidad supera los cupos reservados.");
  }

  const updated: Guest = {
    ...guest,
    status: input.status,
    confirmed_count: input.status === "declined" ? 0 : input.confirmed_count,
    food_restrictions: input.food_restrictions ?? "",
    message: input.message ?? "",
    updated_at: new Date().toISOString(),
  };

  const supabase = createSupabaseAdminClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("guests")
      .update({
        status: updated.status,
        confirmed_count: updated.confirmed_count,
        food_restrictions: updated.food_restrictions,
        message: updated.message,
        updated_at: updated.updated_at,
      })
      .eq("code", input.code)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Guest;
  }

  memoryGuests.set(input.code, updated);
  return updated;
}

export function getGuestSummary(guests: Guest[]) {
  return {
    total: guests.length,
    confirmed: guests.filter((guest) => guest.status === "confirmed").length,
    pending: guests.filter((guest) => guest.status === "pending").length,
    declined: guests.filter((guest) => guest.status === "declined").length,
    confirmedPeople: guests.reduce((sum, guest) => sum + guest.confirmed_count, 0),
  };
}
