import Link from "next/link";
import { RSVPForm } from "@/components/RSVPForm";
import { getGuestByCode } from "@/lib/guests";

type GuestPageProps = {
  params: Promise<{ code: string }>;
};

export default async function GuestPage({ params }: GuestPageProps) {
  const { code } = await params;
  const guest = await getGuestByCode(code);

  if (!guest) {
    return (
      <main className="grid min-h-screen place-items-center px-4 py-12">
        <div className="ivory-panel max-w-lg rounded-[1.5rem] p-8 text-center">
          <h1 className="font-display text-4xl text-[#154D35]">No encontramos esta invitación</h1>
          <p className="mt-4 leading-7 text-[#15351f]">
            Revisa el enlace recibido o escríbenos directamente para ayudarte con mucho cariño.
          </p>
          <Link className="mt-6 inline-flex rounded-full bg-[#154D35] px-6 py-3 text-[#F7F3EA]" href="/">
            Volver a la invitación
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-4xl text-center">
        <Link className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A39F88]" href="/">
          Zequelly & Elio
        </Link>
        <h1 className="font-display mt-5 text-4xl text-[#F7F3EA] sm:text-6xl">
          Confirma tu asistencia
        </h1>
        <p className="mx-auto mb-8 mt-5 max-w-2xl leading-8 text-[#E2E5E2]">
          Gracias por ser parte de nuestra historia. Este espacio está preparado especialmente para
          ti.
        </p>
      </div>
      <RSVPForm guest={guest} />
    </main>
  );
}
