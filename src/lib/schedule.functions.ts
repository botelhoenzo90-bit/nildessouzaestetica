import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type WeekdayHours = { weekday: number; closed: boolean; start: string; end: string };
export type ScheduleBlock = {
  id: string;
  block_date: string;
  full_day: boolean;
  start_time: string | null;
  end_time: string | null;
  note: string | null;
};
export type Service = {
  id: string;
  category: string;
  name: string;
  description: string | null;
  price_cents: number;
  sort_order: number;
  active: boolean;
};
export type BookingConfig = {
  weeklyHours: WeekdayHours[];
  blocks: ScheduleBlock[];
  services: Service[];
  depositPercent: number;
  paymentLink: string;
};

export const defaultPaymentLink = "https://link.mercadopago.com.br/nildesestetica";

export const categoryLabels: Record<string, string> = {
  corporal: "Corporal",
  facial: "Facial",
  pacote: "Pacotes (20% de desconto)",
};

export function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export const defaultWeeklyHours: WeekdayHours[] = [
  { weekday: 0, closed: true, start: "09:00", end: "18:00" },
  { weekday: 1, closed: true, start: "09:00", end: "18:00" },
  { weekday: 2, closed: false, start: "09:00", end: "18:00" },
  { weekday: 3, closed: false, start: "09:00", end: "18:00" },
  { weekday: 4, closed: false, start: "09:00", end: "18:00" },
  { weekday: 5, closed: false, start: "09:00", end: "18:00" },
  { weekday: 6, closed: false, start: "09:00", end: "18:00" },
];

export const dayNames = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
] as const;

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const getBookingConfig = createServerFn({ method: "GET" }).handler(async (): Promise<BookingConfig> => {
  try {
    const supabase = publicClient();
    const today = new Date().toISOString().slice(0, 10);
    const [settingsRes, blocksRes, servicesRes] = await Promise.all([
      supabase.from("business_settings").select("weekly_hours, deposit_percent, payment_link").eq("id", 1).maybeSingle(),
      supabase
        .from("schedule_blocks")
        .select("id, block_date, full_day, start_time, end_time, note")
        .gte("block_date", today)
        .order("block_date", { ascending: true }),
      supabase
        .from("services")
        .select("id, category, name, description, price_cents, sort_order, active")
        .eq("active", true)
        .order("category", { ascending: true })
        .order("sort_order", { ascending: true }),
    ]);
    const weeklyHours = (settingsRes.data?.weekly_hours as WeekdayHours[] | null) ?? defaultWeeklyHours;
    const blocks = (blocksRes.data ?? []) as ScheduleBlock[];
    return {
      weeklyHours,
      blocks,
      services: (servicesRes.data ?? []) as Service[],
      depositPercent: settingsRes.data?.deposit_percent ?? 40,
      paymentLink: settingsRes.data?.payment_link ?? defaultPaymentLink,
    };
  } catch {
    return { weeklyHours: defaultWeeklyHours, blocks: [], services: [], depositPercent: 40, paymentLink: defaultPaymentLink };
  }
});
