import { AdminDashboard } from "@/components/AdminDashboard";
import { listGuests } from "@/lib/guests";

export default async function AdminPage() {
  const guests = await listGuests();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  return <AdminDashboard guests={guests} siteUrl={siteUrl} />;
}
