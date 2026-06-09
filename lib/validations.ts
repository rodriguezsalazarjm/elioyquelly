import { z } from "zod";

export const rsvpSchema = z.object({
  code: z.string().min(2),
  status: z.enum(["confirmed", "declined"]),
  confirmed_count: z.number().int().min(0).max(20),
  food_restrictions: z.string().max(500).optional().default(""),
  message: z.string().max(1000).optional().default(""),
});

export type RsvpInput = z.output<typeof rsvpSchema>;
export type RsvpFormInput = z.input<typeof rsvpSchema>;
