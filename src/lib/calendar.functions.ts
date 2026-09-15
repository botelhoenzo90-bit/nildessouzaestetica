import { createServerFn } from "@tanstack/react-start";

export type CalendarBooking = {
  name: string;
  phone: string;
  email: string | null;
  birthdate: string | null;
  service_name: string;
  price_label: string;
  deposit_label: string;
  appointment_date: string;
  start_time: string;
  health: string | null;
  medication: string | null;
  allergies: string | null;
  pregnant: string | null;
  previous: string | null;
  notes: string | null;
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_calendar/calendar/v3";
const TIME_ZONE = "America/Bahia";

function addHour(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const end = new Date(2000, 0, 1, h ?? 0, m ?? 0);
  end.setHours(end.getHours() + 1);
  return `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`;
}

// Cria o agendamento direto na Google Agenda da clínica, em amarelo e com
// "PENDENTE" no título. Quando o comprovante do sinal chegar, ela edita o
// evento na própria agenda (título "PAGO" e cor verde).
export const createCalendarEvent = createServerFn({ method: "POST" })
  .inputValidator((data: CalendarBooking) => data)
  .handler(async ({ data }): Promise<{ ok: boolean; message?: string }> => {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const connectionKey = process.env["GOOGLE_CALENDAR_API_KEY"];
    if (!lovableKey || !connectionKey) {
      return { ok: false, message: "Google Agenda não está conectada." };
    }

    const description = [
      `Status: PENDENTE (aguardando comprovante do sinal)`,
      `Procedimento: ${data.service_name} — ${data.price_label}`,
      `Sinal: ${data.deposit_label}`,
      `Telefone: ${data.phone}`,
      data.email ? `E-mail: ${data.email}` : "",
      data.birthdate ? `Nascimento: ${data.birthdate}` : "",
      "",
      "Ficha de anamnese:",
      `Problemas de saúde: ${data.health || "Nenhum"}`,
      `Medicamentos: ${data.medication || "Nenhum"}`,
      `Alergias: ${data.allergies || "Nenhuma"}`,
      `Gestante ou amamentando: ${data.pregnant || "Não informado"}`,
      `Procedimentos recentes: ${data.previous || "Nenhum"}`,
      `Observações: ${data.notes || "Nenhuma"}`,
    ]
      .filter(Boolean)
      .join("\n");

    const body = {
      summary: `PENDENTE • ${data.name} — ${data.service_name}`,
      description,
      colorId: "5", // amarelo = ainda não pago
      start: { dateTime: `${data.appointment_date}T${data.start_time}:00`, timeZone: TIME_ZONE },
      end: { dateTime: `${data.appointment_date}T${addHour(data.start_time)}:00`, timeZone: TIME_ZONE },
    };

    const response = await fetch(`${GATEWAY_URL}/calendars/primary/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": connectionKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Google Calendar falhou [${response.status}]: ${errorBody}`);
      return { ok: false, message: `Google Calendar [${response.status}]: ${errorBody}` };
    }
    return { ok: true };
  });
