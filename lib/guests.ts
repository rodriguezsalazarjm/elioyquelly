import { createSupabaseAdminClient } from "./supabase";
import type { Guest } from "./types";
import { generateCode } from "./utils";
import type { CreateGuestInput, RsvpInput, UpdateGuestInput } from "./validations";

function ts() {
  return new Date().toISOString();
}

export const demoGuests: Guest[] = [
  {
    id: "1",
    code: "familia-rojas-ABC123",
    display_name: "Familia Rojas",
    phone: "+56912345678",
    email: null,
    group_name: "Familia novia",
    max_guests: 4,
    status: "pending",
    confirmed_count: 0,
    food_restrictions: "",
    message: "",
    has_opened_invitation: false,
    opened_at: null,
    confirmed_at: null,
    created_at: ts(),
    updated_at: ts(),
  },
  {
    id: "2",
    code: "camila-soto-DEF456",
    display_name: "Camila Soto",
    phone: null,
    email: "camila@example.com",
    group_name: "Amigos",
    max_guests: 2,
    status: "confirmed",
    confirmed_count: 2,
    food_restrictions: "Vegetariana",
    message: "Felices de acompañarlos.",
    has_opened_invitation: true,
    opened_at: ts(),
    confirmed_at: ts(),
    created_at: ts(),
    updated_at: ts(),
  },
  {
    id: "3",
    code: "mario-fernandez-GHI789",
    display_name: "Mario Fernández",
    phone: null,
    email: null,
    group_name: "Familia novio",
    max_guests: 1,
    status: "declined",
    confirmed_count: 0,
    food_restrictions: "",
    message: "Les mando todo mi cariño.",
    has_opened_invitation: true,
    opened_at: ts(),
    confirmed_at: null,
    created_at: ts(),
    updated_at: ts(),
  },
];

const memoryGuests = new Map(demoGuests.map((g) => [g.code, { ...g }]));

// ─── Queries ─────────────────────────────────────────────────────────────────

export async function getGuestByCode(code: string): Promise<Guest | null> {
  const supabase = createSupabaseAdminClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .eq("code", code)
      .single();
    if (!error && data) return data as Guest;
  }
  return memoryGuests.get(code) ?? null;
}

export async function listGuests(): Promise<Guest[]> {
  const supabase = createSupabaseAdminClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .order("group_name")
      .order("display_name");
    if (!error && data) return data as Guest[];
  }
  return Array.from(memoryGuests.values()).sort((a, b) =>
    a.group_name.localeCompare(b.group_name),
  );
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export async function createGuest(input: CreateGuestInput): Promise<Guest> {
  const code = generateCode(input.display_name);
  const now = ts();
  const payload = {
    code,
    display_name: input.display_name,
    phone: input.phone || null,
    email: input.email || null,
    group_name: input.group_name,
    max_guests: input.max_guests,
    status: "pending" as const,
    confirmed_count: 0,
    food_restrictions: "",
    message: "",
    has_opened_invitation: false,
    opened_at: null,
    confirmed_at: null,
    created_at: now,
    updated_at: now,
  };

  const supabase = createSupabaseAdminClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("guests")
      .insert(payload)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return data as Guest;
  }

  const guest: Guest = { ...payload, id: crypto.randomUUID() };
  memoryGuests.set(code, guest);
  return guest;
}

export async function updateGuest(
  id: string,
  input: UpdateGuestInput,
): Promise<Guest> {
  const patch = { ...input, updated_at: ts() };
  const supabase = createSupabaseAdminClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("guests")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return data as Guest;
  }

  for (const [code, guest] of memoryGuests.entries()) {
    if (guest.id === id) {
      const updated = { ...guest, ...patch };
      memoryGuests.set(code, updated);
      return updated;
    }
  }
  throw new Error("Invitado no encontrado.");
}

export async function deleteGuest(id: string): Promise<void> {
  const supabase = createSupabaseAdminClient();
  if (supabase) {
    const { error } = await supabase.from("guests").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  for (const [code, guest] of memoryGuests.entries()) {
    if (guest.id === id) {
      memoryGuests.delete(code);
      return;
    }
  }
}

export async function markGuestOpened(code: string): Promise<void> {
  const guest = await getGuestByCode(code);
  if (!guest || guest.has_opened_invitation) return;

  const now = ts();
  const supabase = createSupabaseAdminClient();
  if (supabase) {
    await supabase
      .from("guests")
      .update({ has_opened_invitation: true, opened_at: now, updated_at: now })
      .eq("code", code);
    return;
  }
  memoryGuests.set(code, {
    ...guest,
    has_opened_invitation: true,
    opened_at: now,
    updated_at: now,
  });
}

export async function updateGuestRsvp(input: RsvpInput): Promise<Guest> {
  const guest = await getGuestByCode(input.code);
  if (!guest) throw new Error("No encontramos esta invitación.");

  if (input.status === "confirmed" && input.confirmed_count < 1)
    throw new Error("Indica cuántas personas asistirán.");
  if (input.confirmed_count > guest.max_guests)
    throw new Error("La cantidad supera los cupos reservados.");

  const now = ts();
  const patch = {
    status: input.status,
    confirmed_count: input.status === "declined" ? 0 : input.confirmed_count,
    food_restrictions: input.food_restrictions ?? "",
    message: input.message ?? "",
    confirmed_at: input.status === "confirmed" ? now : null,
    updated_at: now,
  };

  const supabase = createSupabaseAdminClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("guests")
      .update(patch)
      .eq("code", input.code)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return data as Guest;
  }

  const updated = { ...guest, ...patch };
  memoryGuests.set(input.code, updated);
  return updated;
}

export async function importGuests(
  rows: CreateGuestInput[],
): Promise<{ created: number; errors: string[] }> {
  const errors: string[] = [];
  let created = 0;
  for (const row of rows) {
    try {
      await createGuest(row);
      created++;
    } catch (e) {
      errors.push(
        `${row.display_name}: ${e instanceof Error ? e.message : "Error"}`,
      );
    }
  }
  return { created, errors };
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export function getGuestSummary(guests: Guest[]) {
  return {
    total: guests.length,
    totalCupos: guests.reduce((s, g) => s + g.max_guests, 0),
    confirmed: guests.filter((g) => g.status === "confirmed").length,
    pending: guests.filter((g) => g.status === "pending").length,
    declined: guests.filter((g) => g.status === "declined").length,
    confirmedPeople: guests.reduce((s, g) => s + g.confirmed_count, 0),
    opened: guests.filter((g) => g.has_opened_invitation).length,
  };
}
