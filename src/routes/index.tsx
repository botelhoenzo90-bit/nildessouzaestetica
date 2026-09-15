import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { categoryLabels, defaultPaymentLink, defaultWeeklyHours, dayNames, formatPrice, getBookingConfig, type WeekdayHours } from "@/lib/schedule.functions";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  CreditCard,
  Heart,
  Instagram,
  MapPin,
  MessageCircle,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import massageAsset from "@/assets/cuidado-massagem.png.asset.json";
import cuppingAsset from "@/assets/cuidado-ventosaterapia.png.asset.json";
import skinCleansingAsset from "@/assets/cuidado-limpeza-pele.png.asset.json";
import auriculotherapyAsset from "@/assets/cuidado-auriculoterapia.png.asset.json";
import drenagemAsset from "@/assets/cuidado-drenagem-linfatica.png.asset.json";
import browLaminationAsset from "@/assets/cuidado-brow-lamination-nova.png.asset.json";
import logoAsset from "@/assets/logo-nildes-souza.png.asset.json";
import nildesAsset from "@/assets/nildes-souza-retrato.jpg.asset.json";
import peelingAsset from "@/assets/cuidado-peeling.png.asset.json";
import eyebrowDesignAsset from "@/assets/cuidado-design-sobrancelhas.png.asset.json";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Nildes Souza Estética | Beleza, Cuidado e Bem-Estar" },
      { name: "description", content: "Nildes Souza Estética no Imbuí, Salvador. Beleza, estética, autocuidado e bem-estar em um espaço acolhedor." },
      { property: "og:title", content: "Nildes Souza Estética" },
      { property: "og:description", content: "Tudo o que você precisa para realçar sua beleza." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const wa = "https://wa.me/5571981294334?text=Ol%C3%A1!%20Quero%20agendar%20um%20hor%C3%A1rio%20na%20Nildes%20Souza%20Est%C3%A9tica.";
const mapUrl = "https://www.google.com/maps/search/?api=1&query=Rua+das+Gaivotas%2C+196%2C+Imbui+Center%2C+Sala+101%2C+Salvador%2C+BA";
const instagramUrl = "https://instagram.com/nildes.estetica";

const procedures = [
  { name: "Limpeza de Pele", tag: "Pele renovada", text: "Higienização e cuidado para uma pele mais limpa, leve e luminosa.", image: skinCleansingAsset.url },
  { name: "Design de Sobrancelhas", tag: "Olhar em destaque", text: "Um design pensado para valorizar seus traços e harmonizar o olhar.", image: eyebrowDesignAsset.url },
  { name: "Massagem Relaxante", tag: "Pausa para você", text: "Um momento de relaxamento para desacelerar e aproveitar o seu tempo.", image: massageAsset.url },
  { name: "Ventosaterapia", tag: "Cuidado corporal", text: "Uma experiência corporal complementar para sua rotina de bem-estar.", image: cuppingAsset.url },
  { name: "Peeling", tag: "Renovação da pele", text: "Cuidado estético para favorecer uma aparência mais uniforme e renovada.", image: peelingAsset.url },
  { name: "Auriculoterapia", tag: "Equilíbrio e cuidado", text: "Uma prática complementar de atenção ao corpo e ao seu momento de cuidado.", image: auriculotherapyAsset.url },
  { name: "Drenagem Linfática", tag: "Leveza no corpo", text: "Movimentos suaves que ajudam a reduzir a sensação de inchaço e trazem leveza.", image: drenagemImage },
  { name: "Brow Lamination", tag: "Sobrancelhas alinhadas", text: "Fios alinhados e um efeito penteado que valoriza o formato natural da sobrancelha.", image: browLaminationImage },
] as const;

const fallbackSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"] as const;

function toMinutes(time: string) {
  const parts = time.split(":").map(Number);
  return parts[0]! * 60 + (parts[1] ?? 0);
}

function slotsFromHours(hours: WeekdayHours | undefined): string[] {
  if (!hours || hours.closed) return [];
  const slots: string[] = [];
  for (let m = toMinutes(hours.start); m + 60 <= toMinutes(hours.end); m += 60) {
    slots.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:00`);
  }
  return slots;
}

const reviews = [
  ["Mariana", "Um atendimento acolhedor e um espaço muito bonito. Saí me sentindo ainda melhor."],
  ["Camila", "Amei o cuidado em cada detalhe. Foi uma experiência leve, tranquila e especial."],
  ["Juliana", "O atendimento foi maravilhoso. Já quero voltar para conhecer outros procedimentos."],
  ["Patrícia", "Ambiente agradável, atendimento atencioso e muito carinho durante todo o procedimento."],
] as const;

const faqs = [
  ["Preciso agendar antes de ir?", "Sim. Recomendamos o agendamento para reservar seu horário e oferecer um atendimento tranquilo e personalizado."],
  ["Onde fica a Nildes Souza Estética?", "Rua das Gaivotas, 196, Imbuí Center, Sala 101, ao lado da Subway, em Salvador - BA."],
  ["Quais procedimentos estão disponíveis?", "Massagens relaxante, modeladora e golden, drenagem linfática, ventosaterapia, limpeza de pele, auriculoterapia, design de sobrancelhas, brow lamination e pacotes com desconto."],
  ["Como funciona o sinal de 40%?", "Ao agendar, o site mostra o valor do sinal de 40% do procedimento escolhido. O pagamento é feito pelo link do Mercado Pago e o comprovante é enviado no WhatsApp para a clínica confirmar o horário."],
  ["Como funciona o agendamento online?", "Você preenche seus dados, escolhe o tratamento, a data e o horário desejado. A confirmação final é feita pelo WhatsApp."],
  ["Posso agendar mais de um procedimento?", "Sim. Informe os procedimentos desejados nas observações para verificarmos a melhor organização do seu atendimento."],
  ["Como posso entrar em contato?", "Você pode falar conosco pelo WhatsApp ou acompanhar a Nildes Souza Estética no Instagram @nildes.estetica."],
] as const;

function Button({ children, href = "#agendamento", light = false }: { children: ReactNode; href?: string; light?: boolean }) {
  const external = href.startsWith("http");
  return <a className={`ns-btn ${light ? "ns-btn-light" : ""}`} href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>{children}<ArrowUpRight size={16} /></a>;
}

function SectionTitle({ eyebrow, title, sub, light = false }: { eyebrow: string; title: string; sub: string; light?: boolean }) {
  return <div className={`ns-section-title ${light ? "light" : ""}`}><span className="ns-eyebrow"><Sparkles size={14} /> {eyebrow}</span><h2>{title}</h2><p>{sub}</p></div>;
}

function Brand() {
  return <div className="ns-brand" aria-label="Nildes Souza Estética"><img src={logoAsset.url} alt="Nildes Souza Estética" /></div>;
}

function LoopCarousel({ children, duration = 34 }: { children: ReactNode; duration?: number }) {
  return <div className="ns-loop-wrap"><div className="ns-loop" style={{ "--loop-duration": `${duration}s` } as React.CSSProperties}><div className="ns-loop-track"><div className="ns-loop-set">{children}</div><div className="ns-loop-set" aria-hidden="true">{children}</div></div></div></div>;
}

function Index() {
  const [openFaq, setOpenFaq] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [confirmationUrl, setConfirmationUrl] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [depositValue, setDepositValue] = useState("");

  const fetchBookingConfig = useServerFn(getBookingConfig);
  const { data: bookingConfig } = useQuery({ queryKey: ["booking-config"], queryFn: () => fetchBookingConfig() });
  const weeklyHours = bookingConfig?.weeklyHours ?? defaultWeeklyHours;
  const services = bookingConfig?.services ?? [];
  const depositPercent = bookingConfig?.depositPercent ?? 40;
  const paymentLink = bookingConfig?.paymentLink || defaultPaymentLink;
  const selectedService = services.find((s) => s.id === selectedServiceId);
  const groupedServices = useMemo(() => {
    const groups: Record<string, typeof services> = {};
    for (const s of services) (groups[s.category] ??= []).push(s);
    return Object.entries(groups);
  }, [services]);
  const dayBlocks = useMemo(
    () => (bookingConfig?.blocks ?? []).filter((b) => b.block_date === selectedDate),
    [bookingConfig, selectedDate],
  );

  const availableSlots = useMemo(() => {
    if (!selectedDate) {
      const firstOpen = weeklyHours.find((h) => !h.closed);
      const slots = slotsFromHours(firstOpen);
      return slots.length ? slots : [...fallbackSlots];
    }
    const day = new Date(`${selectedDate}T12:00:00`).getDay();
    const slots = slotsFromHours(weeklyHours.find((h) => h.weekday === day));
    if (!slots.length) return [];
    if (dayBlocks.some((b) => b.full_day)) return [];
    let filtered = slots;
    for (const b of dayBlocks) {
      const bs = b.start_time;
      const be = b.end_time;
      if (bs && be) {
        filtered = filtered.filter((s) => toMinutes(s) + 60 <= toMinutes(bs) || toMinutes(s) >= toMinutes(be));
      }
    }
    return filtered;
  }, [selectedDate, weeklyHours, dayBlocks]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const phone = String(form.get("phone") || "");
    const treatment = selectedService?.name ?? "";
    const birthdate = String(form.get("birthdate") || "");
    const email = String(form.get("email") || "");
    const health = String(form.get("health") || "");
    const medication = String(form.get("medication") || "");
    const allergies = String(form.get("allergies") || "");
    const pregnant = String(form.get("pregnant") || "Não informado");
    const previous = String(form.get("previous") || "");
    const date = String(form.get("date") || "");
    const time = selectedTime;
    const notes = String(form.get("notes") || "");
    const selectedDateObj = new Date(`${date}T12:00:00`);
    const selectedDay = selectedDateObj.getDay();
    const dayHours = weeklyHours.find((h) => h.weekday === selectedDay);
    function fail(message: string) {
      setSubmitted(false);
      setConfirmationUrl("");
      setBookingError(message);
    }
    if (Number.isNaN(selectedDateObj.getTime()) || !dayHours || dayHours.closed) {
      fail(
        Number.isNaN(selectedDateObj.getTime())
          ? "Escolha uma data válida para o agendamento."
          : `Escolha outra data: ${dayNames[selectedDay]} não tem atendimento. Confira os horários de funcionamento.`,
      );
      return;
    }
    if (dayBlocks.some((b) => b.full_day)) {
      fail("Essa data está com os atendimentos fechados. Escolha outra data.");
      return;
    }
    if (!time || !availableSlots.includes(time)) {
      fail("Esse horário ficou indisponível nesta data. Escolha outro horário.");
      return;
    }
    if (!selectedService) {
      fail("Escolha o procedimento desejado.");
      return;
    }
    const deposit = Math.round((selectedService.price_cents * depositPercent) / 100);
    const lines = [
      "Olá! Quero solicitar um agendamento na Nildes Souza Estética.",
      "",
      `Nome: ${name}`,
      `Telefone: ${phone}`,
      email ? `E-mail: ${email}` : "",
      birthdate ? `Data de nascimento: ${birthdate}` : "",
      `Procedimento: ${selectedService.name} — ${formatPrice(selectedService.price_cents)}`,
      `Sinal (${depositPercent}%): ${formatPrice(deposit)}`,
      `Data: ${date}`,
      `Horário: ${time}`,
      "",
      "Ficha de anamnese:",
      `Problemas de saúde: ${health || "Nenhum"}`,
      `Medicamentos em uso: ${medication || "Nenhum"}`,
      `Alergias: ${allergies || "Nenhuma"}`,
      `Gestante ou amamentando: ${pregnant}`,
      `Procedimentos estéticos recentes: ${previous || "Nenhum"}`,
      `Observações: ${notes || "Nenhuma"}`,
      "",
      "Vou enviar o comprovante do sinal para confirmar o horário.",
    ].filter(Boolean);
    setBookingError("");
    setSubmitted(true);
    setDepositValue(formatPrice(deposit));
    setConfirmationUrl(`https://wa.me/5571981294334?text=${encodeURIComponent(lines.join("\n"))}`);
  }

  return <div className="ns-page"><main>
    <section id="inicio" className="ns-hero"><div className="ns-container hero-inner"><Brand /><span className="ns-eyebrow hero-eyebrow"><Sparkles size={14} /> Beleza • Cuidado • Bem-estar</span><h1>Realce sua beleza.<br /><em>Cuide de você.</em></h1><p>Um espaço pensado para transformar o autocuidado em uma experiência leve, acolhedora e especial.</p><div className="hero-actions"><Button href="#agendamento">Agendar meu horário</Button><Button href="#procedimentos" light>Conhecer procedimentos</Button></div><div className="hero-mini-points"><span><Check size={15} /> Atendimento personalizado</span><span><Check size={15} /> Ambiente acolhedor</span><span><Check size={15} /> Cuidado em cada detalhe</span></div></div></section>

    <section className="ns-value-strip" aria-label="Especialidades da Nildes Souza Estética"><LoopCarousel duration={24}>{["BELEZA", "CUIDADO", "BEM-ESTAR", "AUTOESTIMA", "AUTOCUIDADO", "MOMENTO PARA VOCÊ"].map((item) => <div className="value-item" key={item}><span>{item}</span><i>✦</i></div>)}</LoopCarousel></section>

    <section id="sobre" className="ns-section ns-how"><div className="ns-container"><SectionTitle eyebrow="Como funciona" title="Do primeiro clique ao seu momento de cuidado." sub="Tudo foi pensado para que sua experiência seja simples, tranquila e especial desde o primeiro contato." /><div className="how-steps"><article className="how-step"><div className="how-step-top"><span>01</span><div className="how-icon"><Sparkles /></div></div><h3>Escolha o seu cuidado</h3><p>Conheça os procedimentos e encontre o que combina com o seu momento.</p><div className="how-step-link">Conheça os cuidados <ArrowRight size={15} /></div></article><div className="how-connector" aria-hidden="true" /><article className="how-step"><div className="how-step-top"><span>02</span><div className="how-icon"><CalendarDays /></div></div><h3>Reserve seu horário</h3><p>Escolha o tratamento, a data e o melhor horário para você.</p><div className="how-step-link">Agendamento simples <ArrowRight size={15} /></div></article><div className="how-connector" aria-hidden="true" /><article className="how-step"><div className="how-step-top"><span>03</span><div className="how-icon"><Heart /></div></div><h3>Chegue e aproveite</h3><p>Você só precisa chegar. O resto é um momento feito para você.</p><div className="how-step-link">Viva sua experiência <ArrowRight size={15} /></div></article></div><div className="center-cta"><Button href="#agendamento">Quero agendar meu horário</Button></div></div></section>

    <section id="procedimentos" className="ns-section ns-procedures"><div className="ns-container"><SectionTitle eyebrow="Nossos cuidados" title="Procedimentos escolhidos para o seu momento" sub="Conheça cada cuidado de perto e escolha o que faz sentido para você hoje." /><LoopCarousel duration={42}>{procedures.map((item, i) => <article className="procedure-card" key={item.name}><div className="procedure-image"><img src={item.image} alt={item.name} loading="lazy" /><span className="procedure-number">0{i + 1}</span><span className="procedure-chip">{item.tag}</span></div><div className="procedure-body"><h3>{item.name}</h3><p>{item.text}</p><a href="#agendamento">Agendar este cuidado <ArrowRight size={15} /></a></div></article>)}</LoopCarousel><div className="center-cta"><Button href="#agendamento">Agendar meu procedimento</Button></div></div></section>

    <section className="ns-section ns-experience"><div className="ns-container experience-box"><div className="experience-copy"><span className="ns-eyebrow"><Sparkles size={14} /> Sua experiência</span><h2>Cuidar de você também é uma forma de <em>se escolher.</em></h2><p>Na Nildes Souza Estética, o cuidado vai além do procedimento. É sobre reservar um espaço na sua rotina para se sentir bem, acolhida e valorizada.</p><div className="experience-points"><div><span>01</span><p><b>Atendimento atencioso</b><small>Você é recebida com escuta, respeito e atenção aos detalhes.</small></p></div><div><span>02</span><p><b>Um ambiente para desacelerar</b><small>Uma atmosfera leve para deixar a correria do lado de fora.</small></p></div><div><span>03</span><p><b>Cuidado pensado para você</b><small>Cada escolha busca valorizar sua beleza e sua autoestima.</small></p></div></div><Button href="#agendamento">Quero reservar meu momento</Button></div></div></section>

    <section className="ns-section ns-why"><div className="ns-container"><SectionTitle eyebrow="Por que escolher a Nildes" title="Cuidado que você percebe nos detalhes" sub="Uma experiência acolhedora, delicada e pensada para fazer você se sentir especial." /><div className="why-grid"><article><div className="why-icon"><Heart /></div><h3>Atendimento acolhedor</h3><p>Você é recebida com atenção, respeito e carinho em cada etapa.</p></article><article><div className="why-icon"><Sparkles /></div><h3>Experiência personalizada</h3><p>Seu momento merece atenção aos detalhes e ao que você procura.</p></article><article><div className="why-icon"><Check /></div><h3>Ambiente confortável</h3><p>Um espaço pensado para deixar sua experiência mais leve e agradável.</p></article><article><div className="why-icon"><Star /></div><h3>Cuidado com propósito</h3><p>Beleza e bem-estar caminhando juntos em uma experiência especial.</p></article></div><div className="center-cta"><Button href="#agendamento">Agendar meu horário</Button></div></div></section>

    <section className="ns-section ns-about"><div className="ns-container about-layout"><div className="about-copy"><span className="ns-eyebrow"><Heart size={14} /> Nildes Souza</span><h2>Quem está por trás do <em>cuidado.</em></h2><div className="about-photo-wrap"><img className="about-photo" src={nildesAsset.url} alt="Nildes Souza, profissional de estética" loading="lazy" /></div><p>Meu propósito é criar um espaço onde beleza e bem-estar caminhem juntos, com atendimento próximo, delicadeza e atenção verdadeira a cada pessoa.</p><p>Na Nildes Souza Estética, cada procedimento é também um convite para desacelerar, cuidar de si e valorizar a sua autoestima.</p><div className="about-signature">Nildes Souza <small>Estética &amp; Cosmética</small></div><div className="about-actions"><Button href="#agendamento">Agendar com a Nildes</Button><Button href={instagramUrl} light>Conhecer no Instagram</Button></div></div></div></section>

    <section className="ns-section ns-reviews"><div className="ns-container"><SectionTitle eyebrow="Experiências" title="Quem vive, recomenda" sub="Alguns sentimentos que queremos que façam parte de cada atendimento." /><LoopCarousel duration={34}>{reviews.map(([name, text]) => <article className="review-card" key={name}><div className="review-stars">{[1,2,3,4,5].map((star) => <Star key={star} size={15} fill="currentColor" />)}</div><p>“{text}”</p><div className="review-person"><span>{name.charAt(0)}</span><div><strong>{name}</strong><small>Cliente Nildes Souza Estética</small></div></div></article>)}</LoopCarousel><div className="center-cta"><Button href="#agendamento">Quero viver essa experiência</Button></div></div></section>

    <section className="ns-location"><div className="ns-container location-grid"><div className="location-copy"><span className="ns-eyebrow"><MapPin size={14} /> Onde estamos</span><h2>Seu próximo momento de cuidado fica <em>aqui.</em></h2><p>Rua das Gaivotas, 196 — Imbuí Center, Sala 101, ao lado da Subway, Salvador - BA.</p><div className="location-detail"><MapPin /><div><b>Imbuí Center</b><span>Sala 101 • ao lado da Subway</span></div></div><div className="location-actions"><Button href={mapUrl}>Abrir no Google Maps</Button><Button href="#agendamento" light>Agendar horário</Button></div></div><div className="map-frame"><iframe title="Localização da Nildes Souza Estética no Imbuí" src="https://www.google.com/maps?q=Rua+das+Gaivotas,+196,+Imbui+Center,+Sala+101,+Salvador,+BA&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><div className="map-label"><MapPin size={16} /><span>Nildes Souza Estética</span></div></div></div></section>

    <section id="duvidas" className="ns-section ns-faq"><div className="ns-container faq-grid"><div><SectionTitle eyebrow="Perguntas frequentes" title="Tudo mais simples antes do seu horário" sub="Confira as respostas para as dúvidas mais comuns." /><Button href="#agendamento">Ainda tenho dúvidas — agendar</Button></div><div className="faq-list">{faqs.map(([question, answer], index) => <div className={`faq-item ${openFaq === index ? "open" : ""}`} key={question}><button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}><span>{question}</span><ChevronDown size={19} /></button><div className="faq-answer"><p>{answer}</p></div></div>)}</div></div></section>

    <section id="agendamento" className="ns-section ns-booking"><div className="ns-container booking-shell"><div className="booking-intro"><div className="booking-heading"><span className="ns-eyebrow"><CalendarDays size={14} /> Agendamento online</span><h2>Reserve seu momento de <em>cuidado.</em></h2><p>Preencha seus dados e a ficha de anamnese para solicitar seu horário. O horário é reservado após o pagamento do sinal de {depositPercent}% e a confirmação da clínica.</p></div><aside className="opening-hours" aria-label="Horário de atendimento"><div className="opening-hours-title"><Clock3 size={18} /><div><strong>Horário de atendimento</strong><span>Atualizado pela clínica</span></div></div><div className="opening-hours-list">{[...weeklyHours].sort((a, b) => a.weekday - b.weekday).map((h) => <div className={h.closed ? "closed" : ""} key={h.weekday}><span>{dayNames[h.weekday]}</span><b>{h.closed ? "Fechada" : `${h.start} – ${h.end}`}</b></div>)}</div></aside></div><form className="booking-form" onSubmit={handleSubmit}><div className="form-grid"><label><span>Nome completo</span><input name="name" required placeholder="Digite seu nome" /></label><label><span>Telefone</span><input name="phone" required type="tel" placeholder="(71) 99999-9999" /></label><label><span>E-mail <small>(opcional)</small></span><input name="email" type="email" placeholder="seuemail@email.com" /></label><label><span>Data de nascimento <small>(opcional)</small></span><input name="birthdate" type="date" /></label><label className="full-field"><span>Procedimento</span><select name="treatment" required value={selectedServiceId} onChange={(e) => { setSelectedServiceId(e.target.value); setBookingError(""); setSubmitted(false); }}><option value="" disabled>Selecione um procedimento</option>{groupedServices.map(([category, list]) => <optgroup label={categoryLabels[category] ?? category} key={category}>{list.map((s) => <option value={s.id} key={s.id}>{s.name} — {formatPrice(s.price_cents)}</option>)}</optgroup>)}</select></label><label><span>Data <small>(veja os dias disponíveis)</small></span><input name="date" required type="date" value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(""); setBookingError(""); setSubmitted(false); }} /></label></div>{selectedService && <div className="deposit-box"><div><strong>{selectedService.name}</strong><small>{selectedService.description || "Valor do procedimento"}</small></div><div className="deposit-values"><span>Valor: <b>{formatPrice(selectedService.price_cents)}</b></span><span className="deposit-highlight">Sinal ({depositPercent}%): <b>{formatPrice(Math.round((selectedService.price_cents * depositPercent) / 100))}</b></span></div></div>}<div className="form-section-title"><Clock3 size={17} /> Horários disponíveis</div><div className="time-grid">{availableSlots.length ? availableSlots.map((time) => <label key={time}><input type="radio" name="time" value={time} checked={selectedTime === time} onChange={() => setSelectedTime(time)} /><span>{time}</span></label>) : <p className="slots-empty">Não há horários disponíveis nesta data — escolha outra.</p>}</div><div className="form-section-title"><Heart size={17} /> Ficha de anamnese</div><div className="form-grid"><label><span>Tem algum problema de saúde?</span><input name="health" placeholder="Ex.: pressão alta, diabetes..." /></label><label><span>Usa algum medicamento?</span><input name="medication" placeholder="Ex.: anticoncepcional, anti-inflamatório..." /></label><label><span>Tem alergias?</span><input name="allergies" placeholder="Ex.: alergia a óleos, cosméticos..." /></label><label><span>Está gestante ou amamentando?</span><select name="pregnant" defaultValue="Não"><option>Não</option><option>Sim, gestante</option><option>Sim, amamentando</option></select></label><label className="full-field"><span>Fez algum procedimento estético recente?</span><input name="previous" placeholder="Ex.: peeling há 15 dias" /></label></div><label className="full-field"><span>Observações <small>(opcional)</small></span><textarea name="notes" rows={4} placeholder="Conte algo que gostaria que soubéssemos..." /></label>{bookingError && <div className="booking-error" role="alert"><CalendarDays size={18} /><span>{bookingError}</span></div>}<button className="booking-submit" type="submit"><CalendarDays size={18} /> Agendar agora <ArrowRight size={17} /></button><p className="booking-note">O horário só fica reservado após o pagamento do sinal de {depositPercent}% e a confirmação da clínica pelo WhatsApp.</p></form></div></section>

    <section className="ns-final-cta"><div className="ns-container final-inner"><span className="ns-eyebrow"><Sparkles size={14} /> Nildes Souza Estética</span><h2>Seu momento de cuidado <em>começa aqui.</em></h2><p>Tudo o que você precisa para realçar sua beleza.</p><Button href="#agendamento">Agendar meu horário</Button></div></section>
  </main>

  <footer className="ns-footer"><div className="ns-container footer-grid"><div><Brand /><p>Beleza, cuidado e bem-estar em uma experiência feita para você.</p></div><div><strong>Atalhos</strong><a href="#inicio">Início</a><a href="#sobre">Como funciona</a><a href="#procedimentos">Procedimentos</a><a href="#agendamento">Agendamento</a></div><div><strong>Contato</strong><a href={mapUrl} target="_blank" rel="noreferrer"><MapPin size={15} /> Rua das Gaivotas, 196 — Imbuí Center</a><a href={wa} target="_blank" rel="noreferrer">WhatsApp • (71) 98129-4334</a><a href={instagramUrl} target="_blank" rel="noreferrer"><Instagram size={15} /> @nildes.estetica</a></div></div><div className="ns-container footer-bottom"><span>© {new Date().getFullYear()} Nildes Souza Estética. Todos os direitos reservados.</span><span>Salvador • BA</span></div></footer>

  <a className="floating-whatsapp" href={wa} target="_blank" rel="noreferrer" aria-label="Falar com a Nildes Souza Estética pelo WhatsApp"><img src="https://cdn.simpleicons.org/whatsapp/ffffff" alt="WhatsApp" /><span>Fale conosco</span></a>
  {submitted && confirmationUrl && <div className="booking-modal-backdrop" role="presentation"><section className="booking-confirmation" role="dialog" aria-modal="true" aria-labelledby="booking-confirmation-title"><button className="booking-modal-close" type="button" onClick={() => setSubmitted(false)} aria-label="Fechar confirmação"><X size={20} /></button><div className="booking-confirmation-icon"><Check size={27} /></div><span className="ns-eyebrow">Última etapa</span><h2 id="booking-confirmation-title">Pague o sinal e confirme</h2><p>Para reservar seu horário, pague o sinal de <b>{depositValue}</b> ({depositPercent}% do procedimento) e envie o comprovante no WhatsApp com os dados já preenchidos.</p><div className="confirmation-steps"><a className="booking-pay-button" href={paymentLink} target="_blank" rel="noreferrer"><CreditCard size={20} /> 1. Pagar sinal de {depositValue}</a><a className="booking-whatsapp-button" href={confirmationUrl} target="_blank" rel="noreferrer" onClick={() => setSubmitted(false)}><MessageCircle size={20} /> 2. Enviar comprovante no WhatsApp</a></div><small className="confirmation-hint">No link de pagamento, digite o valor do sinal: {depositValue}. O horário é confirmado pela clínica após o comprovante.</small></section></div>}
  </div>;
}
