import { Download } from "lucide-react";
import { getGuestSummary } from "@/lib/guests";
import type { Guest } from "@/lib/types";

type AdminDashboardProps = {
  guests: Guest[];
};

export function AdminDashboard({ guests }: AdminDashboardProps) {
  const summary = getGuestSummary(guests);
  const stats = [
    ["Invitados", summary.total],
    ["Confirmados", summary.confirmed],
    ["Pendientes", summary.pending],
    ["No asistirán", summary.declined],
    ["Asistentes", summary.confirmedPeople],
  ];

  return (
    <main className="min-h-screen bg-[#F7F3EA] px-4 py-10 text-[#15351f]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#837E5E]">
              Panel privado
            </p>
            <h1 className="font-display mt-2 text-4xl text-[#154D35]">Confirmaciones</h1>
          </div>
          <a
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#154D35] px-5 py-3 font-semibold text-[#F7F3EA]"
            href="/api/admin/export"
          >
            <Download size={18} />
            Exportar CSV
          </a>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map(([label, value]) => (
            <div className="rounded-2xl border border-[#837E5E]/20 bg-white p-5" key={label}>
              <p className="text-sm text-[#837E5E]">{label}</p>
              <p className="font-display mt-2 text-4xl text-[#154D35]">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-[#837E5E]/20 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="bg-[#154D35] text-[#F7F3EA]">
                <tr>
                  {["Invitado", "Grupo", "Estado", "Cupos", "Restricciones", "Mensaje"].map((head) => (
                    <th className="px-5 py-4 font-semibold" key={head}>
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#837E5E]/15">
                {guests.map((guest) => (
                  <tr key={guest.id}>
                    <td className="px-5 py-4 font-semibold">{guest.full_name}</td>
                    <td className="px-5 py-4">{guest.group_name}</td>
                    <td className="px-5 py-4">{guest.status}</td>
                    <td className="px-5 py-4">
                      {guest.confirmed_count}/{guest.max_companions}
                    </td>
                    <td className="px-5 py-4">{guest.food_restrictions || "-"}</td>
                    <td className="px-5 py-4">{guest.message || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
