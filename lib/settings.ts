import type { Settings } from "./types";

export const settings: Settings = {
  wedding_date: "2026-11-14T20:00:00-03:00",
  rsvp_deadline: "2026-10-20",
  ceremony_place: "Ceremonia",
  ceremony_time: "18:00 hrs",
  ceremony_address: "Av. José Miguel Carrera 3520, Paradero 6, San Miguel",
  party_place: "Celebración",
  party_time: "19:00 a 02:00 hrs",
  party_address: "Chacabuco 389, 9250000 Maipú, Región Metropolitana",
  google_maps_url:
    "https://www.google.com/maps/search/?api=1&query=Chacabuco%20389%2C%209250000%20Maip%C3%BA%2C%20Regi%C3%B3n%20Metropolitana",
  waze_url:
    "https://waze.com/ul?q=Chacabuco%20389%2C%209250000%20Maip%C3%BA%2C%20Regi%C3%B3n%20Metropolitana",
  spotify_playlist_url: "https://open.spotify.com/embed/playlist/37i9dQZF1DX50QitC6Oqtn",
  main_song_url: "",
  bank_holder_name: "Zequelly y Elio",
  bank_name: "Banco de los Sueños",
  bank_account_type: "Cuenta corriente",
  bank_account_number: "000000000",
  bank_rut: "00.000.000-0",
  bank_email: "zequelly.elio@example.com",
  mercadopago_enabled: process.env.NEXT_PUBLIC_MERCADOPAGO_ENABLED === "true",
  mercadopago_public_url: "",
};

export function formatWeddingDate(date = settings.wedding_date) {
  return new Intl.DateTimeFormat("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
