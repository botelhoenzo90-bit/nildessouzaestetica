import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { WeekdayHours, ScheduleBlock } from "./schedule.functions";

type AdminContext = { supabase: import("@supabase/supabase-js").SupabaseClient; userId: string };

async function isAdmin(context: AdminContext): Promise<boolean> {
  const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  return Boolean(data);
}

const timeRe = /^([01]\d|2[0-3]):[0-5]\d$/;
const dateRe = /^\d{4}-\d{2}-\d{2}$/;

export const adminGetSchedule = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ allowed: false } | { allowed: true; weeklyHours: WeekdayHours[]; blocks: ScheduleBlock[] }> => {
    if (!(await isAdmin(context))) return { allowed: false };
    const today = new Date().toISOString().slice(0, 10);
    const [settingsRes, blocksRes] = await Promise.all([
      context.supabase.from("business_settings").select("weekly_hours").eq("id", 1).maybeSingle(),
      context.supabase
        .from("schedule_blocks")
        .select("id, block_date, full_day, start_time, end_time, note")
        .gte("block_date", today)
        .order("block_date", { ascending: true }),
    ]);
    return {
      allowed: true,
      weeklyHours: (settingsRes.data?.weekly_hours as WeekdayHours[] | null) ?? [],
      blocks: (blocksRes.data ?? []) as ScheduleBlock[],
    };
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
