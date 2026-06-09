import { NextResponse } from "next/server";
import { updateGuestRsvp } from "@/lib/guests";
import { rsvpSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = rsvpSchema.parse(body);
    const guest = await updateGuestRsvp(input);

    return NextResponse.json({
      guest,
      message:
        guest.status === "declined"
          ? "Gracias por avisarnos. Aunque nos habría encantado verte, agradecemos mucho tu cariño y buenos deseos."
          : "Gracias por confirmar. Nos alegra mucho saber que serás parte de este día tan especial.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No pudimos guardar tu confirmación." },
      { status: 400 },
    );
  }
}
