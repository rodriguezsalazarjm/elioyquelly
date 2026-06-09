import { AdminDashboard } from "@/components/AdminDashboard";
import { listGuests } from "@/lib/guests";

export default async function AdminPage() {
  const guests = await listGuests();
  return <AdminDashboard guests={guests} />;
}
