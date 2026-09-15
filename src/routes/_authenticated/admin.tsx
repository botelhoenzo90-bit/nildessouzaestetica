import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type FormEvent } from "react";
import { CalendarDays, CheckCircle2, Clock3, CreditCard, ExternalLink, LogOut, Tag, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  adminGetSchedule,
  adminAddBlock,
  adminDeleteBlock,
  adminSaveHours,
  adminSaveServices,
  adminAddService,
  adminDeleteService,
  adminSavePayment,
  adminListAppointments,
  adminSetAppointmentPaid,
  adminDeleteAppointment,
} from "@/lib/admin.functions";
import { categoryLabels, dayNames, formatPrice, type Appointment, type Service, type WeekdayHours } from "@/lib/schedule.functions";
import logoAsset from "@/assets/logo-nildes-souza.png.asset.json";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel de horários | Nildes Souza Estética" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const getSchedule = useServerFn(adminGetSchedule);
  const saveHoursFn = useServerFn(adminSaveHours);
  const addBlockFn = useServerFn(adminAddBlock);
  const deleteBlockFn = useServerFn(adminDeleteBlock);
  const saveServicesFn = useServerFn(adminSaveServices);
  const addServiceFn = useServerFn(adminAddService);
  const deleteServiceFn = useServerFn(adminDeleteService);
  const savePaymentFn = useServerFn(adminSavePayment);
  const listAppointmentsFn = useServerFn(adminListAppointments);
  const setAppointmentPaidFn = useServerFn(adminSetAppointmentPaid);
  const deleteAppointmentFn = useServerFn(adminDeleteAppointment);

  const { data, isLoading } = useQuery({ queryKey: ["admin-schedule"], queryFn: () => getSchedule() });
  const { data: apptData } = useQuery({ queryKey: ["admin-appointments"], queryFn: () => listAppointmentsFn() });
  const appointments: Appointment[] = apptData?.allowed ? apptData.appointments : [];

  const [hours, setHours] = useState<WeekdayHours[]>([]);
  const [saveMsg, setSaveMsg] = useState("");
  const [saveError, setSaveError] = useState("");
  const [blockError, setBlockError] = useState("");
  const [blockDate, setBlockDate] = useState("");
  const [fullDay, setFullDay] = useState(true);
  const [blockStart, setBlockStart] = useState("");
  const [blockEnd, setBlockEnd] = useState("");
  const [blockNote, setBlockNote] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [servicesMsg, setServicesMsg] = useState("");
  const [servicesError, setServicesError] = useState("");
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("corporal");
  const [newPrice, setNewPrice] = useState("");
  const [depositPercent, setDepositPercent] = useState(40);
  const [paymentLink, setPaymentLink] = useState("");
  const [paymentMsg, setPaymentMsg] = useState("");
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    if (data?.allowed && data.weeklyHours.length) {
      setHours([...data.weeklyHours].sort((a, b) => a.weekday - b.weekday));
    } else if (data?.allowed) {
      setHours(
        dayNames.map((_, weekday) => ({ weekday, closed: weekday < 2, start: "09:00", end: "18:00" })),
      );
    }
    if (data?.allowed) {
      setServices(data.services);
      setDepositPercent(data.depositPercent);
      setPaymentLink(data.paymentLink);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="admin-page">
        <div className="ns-container admin-loading">Carregando painel...</div>
      </div>
    );
  }

  if (!data?.allowed) {
    return (
      <div className="admin-page">
        <div className="ns-container admin-denied">
          <span className="ns-eyebrow">Área da clínica</span>
          <h1>Acesso não autorizado</h1>
          <p>Esta conta não tem permissão para gerenciar os horários.</p>
          <a className="ns-btn" href="/">Voltar ao site</a>
        </div>
      </div>
    );
  }

  function updateDay(weekday: number, patch: Partial<WeekdayHours>) {
    setHours((prev) => prev.map((h) => (h.weekday === weekday ? { ...h, ...patch } : h)));
  }

  async function handleSaveHours() {
    setSaveError("");
    setSaveMsg("");
    const result = await saveHoursFn({ data: { weeklyHours: hours } });
    if (result.ok) {
      setSaveMsg("Horários salvos! O site já mostra a versão nova.");
      await queryClient.invalidateQueries({ queryKey: ["admin-schedule"] });
      queryClient.invalidateQueries({ queryKey: ["booking-config"] });
      setTimeout(() => setSaveMsg(""), 5000);
    } else {
      setSaveError(result.message ?? "Não foi possível salvar.");
    }
  }

  async function handleAddBlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBlockError("");
    const result = await addBlockFn({
      data: {
        block_date: blockDate,
        full_day: fullDay,
        start_time: fullDay ? null : blockStart,
        end_time: fullDay ? null : blockEnd,
        note: blockNote || null,
      },
    });
    if (result.ok) {
      setBlockDate("");
      setBlockStart("");
      setBlockEnd("");
      setBlockNote("");
      setFullDay(true);
      await queryClient.invalidateQueries({ queryKey: ["admin-schedule"] });
      queryClient.invalidateQueries({ queryKey: ["booking-config"] });
    } else {
      setBlockError(result.message ?? "Não foi possível criar o bloqueio.");
    }
  }

  async function handleDeleteBlock(id: string) {
    await deleteBlockFn({ data: { id } });
    await queryClient.invalidateQueries({ queryKey: ["admin-schedule"] });
    queryClient.invalidateQueries({ queryKey: ["booking-config"] });
  }

  function updateService(id: string, patch: Partial<Service>) {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  async function refreshAll() {
    await queryClient.invalidateQueries({ queryKey: ["admin-schedule"] });
    queryClient.invalidateQueries({ queryKey: ["booking-config"] });
  }

  async function handleSaveServices() {
    setServicesError("");
    setServicesMsg("");
    const result = await saveServicesFn({ data: { services } });
    if (result.ok) {
      setServicesMsg("Procedimentos e valores salvos!");
      await refreshAll();
      setTimeout(() => setServicesMsg(""), 5000);
    } else {
      setServicesError(result.message ?? "Não foi possível salvar.");
    }
  }

  async function handleAddService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServicesError("");
    const cents = Math.round(Number(newPrice.replace(",", ".")) * 100);
    const result = await addServiceFn({
      data: { name: newName, category: newCategory, description: null, price_cents: Number.isFinite(cents) ? cents : 0 },
    });
    if (result.ok) {
      setNewName("");
      setNewPrice("");
      await refreshAll();
    } else {
      setServicesError(result.message ?? "Não foi possível adicionar.");
    }
  }

  async function handleDeleteService(id: string) {
    await deleteServiceFn({ data: { id } });
    await refreshAll();
  }

  async function handleToggleAppointmentPaid(id: string, paid: boolean) {
    await setAppointmentPaidFn({ data: { id, paid } });
    await queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
  }

  async function handleDeleteAppointment(id: string) {
    await deleteAppointmentFn({ data: { id } });
    await queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
  }

  async function handleSavePayment() {
    setPaymentError("");
    setPaymentMsg("");
    const result = await savePaymentFn({ data: { depositPercent, paymentLink } });
    if (result.ok) {
      setPaymentMsg("Pagamento atualizado!");
      await refreshAll();
      setTimeout(() => setPaymentMsg(""), 5000);
    } else {
      setPaymentError(result.message ?? "Não foi possível salvar.");
    }
  }

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/auth", replace: true });
  }

  const openDays = [...hours].filter((h) => !h.closed);

  return (
    <div className="admin-page">
      <div className="ns-container">
        <div className="admin-top">
          <div className="admin-top-brand">
            <img src={logoAsset.url} alt="Nildes Souza Estética" />
            <div>
              <span className="ns-eyebrow">Painel da clínica</span>
              <h1>Horários de atendimento</h1>
            </div>
          </div>
          <div className="admin-top-actions">
            <a className="ns-btn ns-btn-light" href="/" target="_blank" rel="noreferrer">
              Ver site <ExternalLink size={15} />
            </a>
            <button className="ns-btn ns-btn-light" type="button" onClick={handleSignOut}>
              Sair <LogOut size={15} />
            </button>
          </div>
        </div>

        <div className="admin-grid">
          <section className="admin-card admin-card-wide">
            <h2><CheckCircle2 size={18} /> Agendamentos e pagamentos</h2>
            <p>Cada agendamento feito no site aparece aqui como "pendente". Quando o comprovante do sinal chegar no WhatsApp, clique em "Marcar pago" para confirmar o horário.</p>
            <div className="appointments-list">
              {appointments.length === 0 && (
                <p className="blocks-empty">Nenhum agendamento solicitado ainda. Eles aparecem aqui automaticamente quando alguém agenda pelo site.</p>
              )}
              {appointments.map((a) => {
                const dateLabel = new Date(`${a.appointment_date}T12:00:00`).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
                return (
                  <div className={`appointment-row ${a.status === "pago" ? "paid" : ""}`} key={a.id}>
                    <div className="appointment-main">
                      <div className="appointment-head">
                        <b>{a.name}</b>
                        <span className={`status-badge ${a.status === "pago" ? "paid" : "pending"}`}>{a.status === "pago" ? "Pago" : "Pendente"}</span>
                      </div>
                      <small>
                        {dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)} às {a.start_time} • {a.service_name} ({formatPrice(a.price_cents)}) • Sinal {formatPrice(a.deposit_cents)}
                        {a.phone ? <> • <a className="appointment-phone" href={`https://wa.me/55${a.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">{a.phone}</a></> : null}
                      </small>
                    </div>
                    <div className="appointment-actions">
                      <button
                        className={a.status === "pago" ? "ns-btn ns-btn-light" : "ns-btn"}
                        type="button"
                        onClick={() => handleToggleAppointmentPaid(a.id, a.status !== "pago")}
                      >
                        {a.status === "pago" ? "Marcar pendente" : "Marcar pago"}
                      </button>
                      <button className="block-remove" type="button" aria-label={`Remover agendamento de ${a.name}`} onClick={() => handleDeleteAppointment(a.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="admin-card">
            <h2><Clock3 size={18} /> Horários da semana</h2>
            <p>Marque os dias de atendimento e defina a hora de início e de fim. Ao salvar, o agendamento do site se ajusta na hora.</p>
            <div>
              {[...hours].sort((a, b) => a.weekday - b.weekday).map((h) => (
                <div className={`hours-row ${h.closed ? "closed-row" : ""}`} key={h.weekday}>
                  <label className="day">
                    <input
                      type="checkbox"
                      checked={!h.closed}
                      onChange={(e) => updateDay(h.weekday, { closed: !e.target.checked })}
                    />
                    {dayNames[h.weekday]}
                  </label>
                  <input
                    type="time"
                    aria-label={`Início em ${dayNames[h.weekday]}`}
                    value={h.start}
                    disabled={h.closed}
                    onChange={(e) => updateDay(h.weekday, { start: e.target.value })}
                  />
                  <span className="hours-sep">até</span>
                  <input
                    type="time"
                    aria-label={`Fim em ${dayNames[h.weekday]}`}
                    value={h.end}
                    disabled={h.closed}
                    onChange={(e) => updateDay(h.weekday, { end: e.target.value })}
                  />
                </div>
              ))}
            </div>
            <button className="ns-btn admin-save" type="button" onClick={handleSaveHours}>
              Salvar horários
            </button>
            {saveMsg && <div className="admin-msg" role="status">{saveMsg}</div>}
            {saveError && <div className="auth-error" role="alert">{saveError}</div>}
          </section>

          <section className="admin-card">
            <h2><CalendarDays size={18} /> Fechamentos e bloqueios</h2>
            <p>Precisa fechar um dia específico ou parte dele? Crie um bloqueio e os horários desaparecem do agendamento.</p>
            <form className="block-form" onSubmit={handleAddBlock}>
              <div className="row">
                <label>
                  <span>Data</span>
                  <input type="date" required value={blockDate} onChange={(e) => setBlockDate(e.target.value)} />
                </label>
                <label className="block-check">
                  <input type="checkbox" checked={fullDay} onChange={(e) => setFullDay(e.target.checked)} />
                  Fechar o dia inteiro
                </label>
              </div>
              {!fullDay && (
                <div className="row">
                  <label>
                    <span>Fechar a partir de</span>
                    <input type="time" required value={blockStart} onChange={(e) => setBlockStart(e.target.value)} />
                  </label>
                  <label>
                    <span>Até</span>
                    <input type="time" required value={blockEnd} onChange={(e) => setBlockEnd(e.target.value)} />
                  </label>
                </div>
              )}
              <label>
                <span>Motivo (opcional)</span>
                <input type="text" placeholder="Ex.: compromisso pessoal" value={blockNote} onChange={(e) => setBlockNote(e.target.value)} />
              </label>
              {blockError && <div className="auth-error" role="alert">{blockError}</div>}
              <button className="ns-btn" type="submit">
                Bloquear período
              </button>
            </form>

            <div className="blocks-list">
              {data.blocks.length === 0 && <p className="blocks-empty">Nenhum bloqueio criado. Os dias fechados da semana são os desmarcados acima.</p>}
              {data.blocks.map((b) => {
                const date = new Date(`${b.block_date}T12:00:00`);
                const label = date.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
                return (
                  <div className="block-item" key={b.id}>
                    <div>
                      <b>{label.charAt(0).toUpperCase() + label.slice(1)}</b>
                      <small>
                        {b.full_day ? "Dia inteiro fechado" : `Fechado das ${b.start_time} às ${b.end_time}`}
                        {b.note ? ` • ${b.note}` : ""}
                      </small>
                    </div>
                    <button className="block-remove" type="button" aria-label="Remover bloqueio" onClick={() => handleDeleteBlock(b.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="admin-card admin-card-wide">
            <h2><Tag size={18} /> Procedimentos e valores</h2>
            <p>Edite o nome, a categoria e o valor de cada procedimento. Desmarque "Ativo" para esconder do agendamento sem apagar.</p>
            <div className="services-list">
              {services.map((s) => (
                <div className="service-row" key={s.id}>
                  <input
                    className="service-name"
                    type="text"
                    aria-label="Nome do procedimento"
                    value={s.name}
                    onChange={(e) => updateService(s.id, { name: e.target.value })}
                  />
                  <select
                    aria-label="Categoria"
                    value={s.category}
                    onChange={(e) => updateService(s.id, { category: e.target.value })}
                  >
                    <option value="corporal">{categoryLabels["corporal"]}</option>
                    <option value="facial">{categoryLabels["facial"]}</option>
                    <option value="pacote">{categoryLabels["pacote"]}</option>
                  </select>
                  <div className="service-price">
                    <span>R$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      aria-label={`Valor de ${s.name}`}
                      value={(s.price_cents / 100).toFixed(2)}
                      onChange={(e) => updateService(s.id, { price_cents: Math.round(Number(e.target.value) * 100) })}
                    />
                  </div>
                  <label className="service-active">
                    <input type="checkbox" checked={s.active} onChange={(e) => updateService(s.id, { active: e.target.checked })} />
                    Ativo
                  </label>
                  <button className="block-remove" type="button" aria-label={`Remover ${s.name}`} onClick={() => handleDeleteService(s.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button className="ns-btn admin-save" type="button" onClick={handleSaveServices}>
              Salvar procedimentos
            </button>
            {servicesMsg && <div className="admin-msg" role="status">{servicesMsg}</div>}
            {servicesError && <div className="auth-error" role="alert">{servicesError}</div>}

            <form className="block-form new-service" onSubmit={handleAddService}>
              <div className="row">
                <label>
                  <span>Novo procedimento</span>
                  <input type="text" required placeholder="Ex.: Massagem com pedras" value={newName} onChange={(e) => setNewName(e.target.value)} />
                </label>
                <label>
                  <span>Categoria</span>
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                    <option value="corporal">{categoryLabels["corporal"]}</option>
                    <option value="facial">{categoryLabels["facial"]}</option>
                    <option value="pacote">{categoryLabels["pacote"]}</option>
                  </select>
                </label>
                <label>
                  <span>Valor (R$)</span>
                  <input type="number" min="0" step="0.01" required value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
                </label>
              </div>
              <button className="ns-btn" type="submit">Adicionar procedimento</button>
            </form>
          </section>

          <section className="admin-card admin-card-wide">
            <h2><CreditCard size={18} /> Sinal e pagamento</h2>
            <p>Defina quanto a cliente paga antecipado e o link onde ela faz o pagamento. O site calcula o valor do sinal automaticamente.</p>
            <div className="row">
              <label>
                <span>Sinal (%)</span>
                <input type="number" min="0" max="100" value={depositPercent} onChange={(e) => setDepositPercent(Number(e.target.value))} />
              </label>
              <label className="full-field">
                <span>Link de pagamento</span>
                <input type="url" value={paymentLink} onChange={(e) => setPaymentLink(e.target.value)} placeholder="https://link.mercadopago.com.br/..." />
              </label>
            </div>
            <p className="payment-preview">
              Exemplo: um procedimento de {formatPrice(20000)} pede um sinal de {formatPrice(Math.round((20000 * depositPercent) / 100))}.
            </p>
            <button className="ns-btn admin-save" type="button" onClick={handleSavePayment}>
              Salvar pagamento
            </button>
            {paymentMsg && <div className="admin-msg" role="status">{paymentMsg}</div>}
            {paymentError && <div className="auth-error" role="alert">{paymentError}</div>}
          </section>
        </div>
      </div>
    </div>
  );
}
