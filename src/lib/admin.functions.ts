import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { WeekdayHours, ScheduleBlock, Service } from "./schedule.functions";

type AdminContext = { supabase: import("@supabase/supabase-js").SupabaseClient; userId: string };

async function isAdmin(context: AdminContext): Promise<boolean> {
  const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  return Boolean(data);
}

const timeRe = /^([01]\d|2[0-3]):[0-5]\d$/;
const dateRe = /^\d{4}-\d{2}-\d{2}$/;

type AdminSchedule = {
  allowed: true;
  weeklyHours: WeekdayHours[];
  blocks: ScheduleBlock[];
  services: Service[];
  depositPercent: number;
  paymentLink: string;
};

export const adminGetSchedule = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ allowed: false } | AdminSchedule> => {
    if (!(await isAdmin(context))) return { allowed: false };
    const today = new Date().toISOString().slice(0, 10);
    const [settingsRes, blocksRes, servicesRes] = await Promise.all([
      context.supabase.from("business_settings").select("weekly_hours, deposit_percent, payment_link").eq("id", 1).maybeSingle(),
      context.supabase
        .from("schedule_blocks")
        .select("id, block_date, full_day, start_time, end_time, note")
        .gte("block_date", today)
        .order("block_date", { ascending: true }),
      context.supabase
        .from("services")
        .select("id, category, name, description, price_cents, sort_order, active")
        .order("category", { ascending: true })
        .order("sort_order", { ascending: true }),
    ]);
    return {
      allowed: true,
      weeklyHours: (settingsRes.data?.weekly_hours as WeekdayHours[] | null) ?? [],
      blocks: (blocksRes.data ?? []) as ScheduleBlock[],
      services: (servicesRes.data ?? []) as Service[],
      depositPercent: settingsRes.data?.deposit_percent ?? 40,
      paymentLink: settingsRes.data?.payment_link ?? "",
    };
  });

export const adminSaveServices = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { services: Service[] }) => data)
  .handler(async ({ data, context }): Promise<{ ok: boolean; message?: string }> => {
    if (!(await isAdmin(context))) return { ok: false, message: "Você não tem permissão para isso." };
    for (const s of data.services) {
      if (!s.name.trim()) return { ok: false, message: "Todo procedimento precisa de um nome." };
      if (!Number.isFinite(s.price_cents) || s.price_cents < 0) return { ok: false, message: `Valor inválido em ${s.name}.` };
      const { error } = await context.supabase
        .from("services")
        .update({
          name: s.name.trim(),
          category: s.category,
          description: s.description?.trim() ? s.description.trim() : null,
          price_cents: Math.round(s.price_cents),
          active: s.active,
        })
        .eq("id", s.id);
      if (error) return { ok: false, message: "Não foi possível salvar os procedimentos." };
    }
    return { ok: true };
  });

export const adminAddService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { name: string; category: string; description: string | null; price_cents: number }) => data)
  .handler(async ({ data, context }): Promise<{ ok: boolean; message?: string }> => {
    if (!(await isAdmin(context))) return { ok: false, message: "Você não tem permissão para isso." };
    if (!data.name.trim()) return { ok: false, message: "Informe o nome do procedimento." };
    const { error } = await context.supabase.from("services").insert({
      name: data.name.trim(),
      category: data.category,
      description: data.description?.trim() ? data.description.trim() : null,
      price_cents: Math.max(0, Math.round(data.price_cents)),
      sort_order: 999,
    });
    if (error) return { ok: false, message: "Não foi possível adicionar o procedimento." };
    return { ok: true };
  });

export const adminDeleteService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }): Promise<{ ok: boolean; message?: string }> => {
    if (!(await isAdmin(context))) return { ok: false, message: "Você não tem permissão para isso." };
    const { error } = await context.supabase.from("services").delete().eq("id", data.id);
    if (error) return { ok: false, message: "Não foi possível remover o procedimento." };
    return { ok: true };
  });

export const adminSavePayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { depositPercent: number; paymentLink: string }) => data)
  .handler(async ({ data, context }): Promise<{ ok: boolean; message?: string }> => {
    if (!(await isAdmin(context))) return { ok: false, message: "Você não tem permissão para isso." };
    const pct = Math.round(data.depositPercent);
    if (!Number.isFinite(pct) || pct < 0 || pct > 100) return { ok: false, message: "A porcentagem precisa ficar entre 0 e 100." };
    const link = data.paymentLink.trim();
    if (link && !/^https?:\/\//.test(link)) return { ok: false, message: "O link de pagamento precisa começar com https://" };
    const { error } = await context.supabase
      .from("business_settings")
      .update({ deposit_percent: pct, payment_link: link, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (error) return { ok: false, message: "Não foi possível salvar o pagamento." };
    return { ok: true };
  });

export const adminSaveHours = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { weeklyHours: WeekdayHours[] }) => data)
  .handler(async ({ data, context }): Promise<{ ok: boolean; message?: string }> => {
    if (!(await isAdmin(context))) return { ok: false, message: "Você não tem permissão para isso." };
    const hours = [...data.weeklyHours].sort((a, b) => a.weekday - b.weekday);
    if (hours.length !== 7) return { ok: false, message: "Configuração incompleta dos dias." };
    for (const h of hours) {
      if (!timeRe.test(h.start) || !timeRe.test(h.end)) return { ok: false, message: "Horário inválido em um dos dias." };
      if (!h.closed && h.start >= h.end) return { ok: false, message: `Em ${h.weekday}, o horário de início deve ser antes do fim.` };
    }
    const { error } = await context.supabase
      .from("business_settings")
      .update({ weekly_hours: hours, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (error) return { ok: false, message: "Não foi possível salvar. Tente novamente." };
    return { ok: true };
  });

export const adminAddBlock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { block_date: string; full_day: boolean; start_time: string | null; end_time: string | null; note: string | null }) => data)
  .handler(async ({ data, context }): Promise<{ ok: boolean; message?: string }> => {
    if (!(await isAdmin(context))) return { ok: false, message: "Você não tem permissão para isso." };
    if (!dateRe.test(data.block_date)) return { ok: false, message: "Escolha uma data válida." };
    if (!data.full_day) {
      if (!data.start_time || !data.end_time || !timeRe.test(data.start_time) || !timeRe.test(data.end_time))
        return { ok: false, message: "Preencha os horários do bloqueio parcial." };
      if (data.start_time >= data.end_time) return { ok: false, message: "O início deve ser antes do fim." };
    }
    const { error } = await context.supabase.from("schedule_blocks").insert({
      block_date: data.block_date,
      full_day: data.full_day,
      start_time: data.full_day ? null : data.start_time,
      end_time: data.full_day ? null : data.end_time,
      note: data.note?.trim() ? data.note.trim() : null,
    });
    if (error) return { ok: false, message: "Não foi possível criar o bloqueio. Tente novamente." };
    return { ok: true };
  });

export const adminDeleteBlock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }): Promise<{ ok: boolean; message?: string }> => {
    if (!(await isAdmin(context))) return { ok: false, message: "Você não tem permissão para isso." };
    const { error } = await context.supabase.from("schedule_blocks").delete().eq("id", data.id);
    if (error) return { ok: false, message: "Não foi possível remover o bloqueio." };
    return { ok: true };
  });
