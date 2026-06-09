export type GuestStatus = "pending" | "confirmed" | "declined";

export type Guest = {
  id: string;
  code: string;
  full_name: string;
  group_name: string;
  max_companions: number;
  status: GuestStatus;
  confirmed_count: number;
  food_restrictions: string;
  message: string;
  created_at: string;
  updated_at: string;
};

export type Settings = {
  wedding_date: string;
  rsvp_deadline: string;
  ceremony_place: string;
  ceremony_time: string;
  ceremony_address: string;
  party_place: string;
  party_time: string;
  party_address: string;
  google_maps_url: string;
  waze_url: string;
  spotify_playlist_url: string;
  main_song_url: string;
  bank_holder_name: string;
  bank_name: string;
  bank_account_type: string;
  bank_account_number: string;
  bank_rut: string;
  bank_email: string;
  mercadopago_enabled: boolean;
  mercadopago_public_url: string;
};
