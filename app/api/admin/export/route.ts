import { listGuests } from "@/lib/guests";

export async function GET() {
  const guests = await listGuests();
  const headers = [
    "full_name",
    "group_name",
    "status",
    "confirmed_count",
    "max_companions",
    "food_restrictions",
    "message",
    "updated_at",
  ];
  const rows = guests.map((guest) =>
    headers
      .map((header) => {
        const value = guest[header as keyof typeof guest];
        return `"${String(value ?? "").replaceAll('"', '""')}"`;
      })
      .join(","),
  );

  return new Response([headers.join(","), ...rows].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="confirmaciones-zequelly-elio.csv"',
    },
  });
}
