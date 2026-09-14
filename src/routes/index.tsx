import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { defaultWeeklyHours, dayNames, getBookingConfig, type WeekdayHours } from "@/lib/schedule.functions";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
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
import brighteningAsset from "@/assets/cuidado-clareamento.png.asset.json";
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
  { name: "Clareamento de Virilhas, Axilas e Face", tag: "Tom mais uniforme", text: "Cuidado estético para ajudar a uniformizar a aparência da pele e valorizar sua autoestima.", image: brighteningAsset.url },
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
  ["Quais procedimentos estão disponíveis?", "Auriculoterapia, design de sobrancelhas, limpeza de pele, peeling, ventosaterapia, massagem relaxante e clareamento de virilhas, axilas e face."],
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

  const fetchBookingConfig = useServerFn(getBookingConfig);
  const { data: bookingConfig } = useQuery({ queryKey: ["booking-config"], queryFn: () => fetchBookingConfig() });
  const weeklyHours = bookingConfig?.weeklyHours ?? defaultWeeklyHours;
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
    const treatment = String(form.get("treatment") || "");
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
    const message = `Olá! Quero solicitar um agendamento na Nildes Souza Estética.%0A%0ANome: ${encodeURIComponent(name)}%0ATelefone: ${encodeURIComponent(phone)}%0ATratamento: ${encodeURIComponent(treatment)}%0AData: ${encodeURIComponent(date)}%0AHorário: ${encodeURIComponent(time)}%0AObservações: ${encodeURIComponent(notes || "Nenhuma")}`;
    setBookingError("");
    setSubmitted(true);
    setConfirmationUrl(`https://wa.me/5571981294334?text=${message}`);
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

    <section id="agendamento" className="ns-section ns-booking"><div className="ns-container booking-shell"><div className="booking-intro"><div className="booking-heading"><span className="ns-eyebrow"><CalendarDays size={14} /> Agendamento online</span><h2>Reserve seu momento de <em>cuidado.</em></h2><p>Preencha os dados para solicitar seu horário. Ao finalizar, enviaremos a solicitação pelo WhatsApp para a clínica confirmar.</p></div><aside className="opening-hours" aria-label="Horário de atendimento"><div className="opening-hours-title"><Clock3 size={18} /><div><strong>Horário de atendimento</strong><span>Atualizado pela clínica</span></div></div><div className="opening-hours-list">{[...weeklyHours].sort((a, b) => a.weekday - b.weekday).map((h) => <div className={h.closed ? "closed" : ""} key={h.weekday}><span>{dayNames[h.weekday]}</span><b>{h.closed ? "Fechada" : `${h.start} – ${h.end}`}</b></div>)}</div></aside></div><form className="booking-form" onSubmit={handleSubmit}><div className="form-grid"><label><span>Nome completo</span><input name="name" required placeholder="Digite seu nome" /></label><label><span>Telefone</span><input name="phone" required type="tel" placeholder="(71) 99999-9999" /></label><label><span>Tratamento</span><select name="treatment" required defaultValue=""><option value="" disabled>Selecione um tratamento</option><option>Auriculoterapia</option><option>Design de Sobrancelhas</option><option>Limpeza de Pele</option><option>Peeling</option><option>Ventosaterapia</option><option>Massagem Relaxante</option><option>Clareamento de Virilhas, Axilas e Face</option></select></label><label><span>Data <small>(veja os dias disponíveis)</small></span><input name="date" required type="date" value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(""); setBookingError(""); setSubmitted(false); }} /></label></div><div className="form-section-title"><Clock3 size={17} /> Horários disponíveis</div><div className="time-grid">{availableSlots.length ? availableSlots.map((time) => <label key={time}><input type="radio" name="time" value={time} checked={selectedTime === time} onChange={() => setSelectedTime(time)} /><span>{time}</span></label>) : <p className="slots-empty">Não há horários disponíveis nesta data — escolha outra.</p>}</div><label className="full-field"><span>Observações <small>(opcional)</small></span><textarea name="notes" rows={4} placeholder="Conte algo que gostaria que soubéssemos..." /></label>{bookingError && <div className="booking-error" role="alert"><CalendarDays size={18} /><span>{bookingError}</span></div>}<button className="booking-submit" type="submit"><CalendarDays size={18} /> Agendar agora <ArrowRight size={17} /></button><p className="booking-note">O horário só estará reservado após a confirmação da clínica pelo WhatsApp.</p></form></div></section>

    <section className="ns-final-cta"><div className="ns-container final-inner"><span className="ns-eyebrow"><Sparkles size={14} /> Nildes Souza Estética</span><h2>Seu momento de cuidado <em>começa aqui.</em></h2><p>Tudo o que você precisa para realçar sua beleza.</p><Button href="#agendamento">Agendar meu horário</Button></div></section>
  </main>

  <footer className="ns-footer"><div className="ns-container footer-grid"><div><Brand /><p>Beleza, cuidado e bem-estar em uma experiência feita para você.</p></div><div><strong>Atalhos</strong><a href="#inicio">Início</a><a href="#sobre">Como funciona</a><a href="#procedimentos">Procedimentos</a><a href="#agendamento">Agendamento</a></div><div><strong>Contato</strong><a href={mapUrl} target="_blank" rel="noreferrer"><MapPin size={15} /> Rua das Gaivotas, 196 — Imbuí Center</a><a href={wa} target="_blank" rel="noreferrer">WhatsApp • (71) 98129-4334</a><a href={instagramUrl} target="_blank" rel="noreferrer"><Instagram size={15} /> @nildes.estetica</a></div></div><div className="ns-container footer-bottom"><span>© {new Date().getFullYear()} Nildes Souza Estética. Todos os direitos reservados.</span><span>Salvador • BA</span></div></footer>

  <a className="floating-whatsapp" href={wa} target="_blank" rel="noreferrer" aria-label="Falar com a Nildes Souza Estética pelo WhatsApp"><img src="https://cdn.simpleicons.org/whatsapp/ffffff" alt="WhatsApp" /><span>Fale conosco</span></a>
  {submitted && confirmationUrl && <div className="booking-modal-backdrop" role="presentation"><section className="booking-confirmation" role="dialog" aria-modal="true" aria-labelledby="booking-confirmation-title"><button className="booking-modal-close" type="button" onClick={() => setSubmitted(false)} aria-label="Fechar confirmação"><X size={20} /></button><div className="booking-confirmation-icon"><Check size={27} /></div><span className="ns-eyebrow">Última etapa</span><h2 id="booking-confirmation-title">Confirme seu agendamento</h2><p>Seu horário ainda precisa ser confirmado pela clínica. Clique abaixo para enviar os dados já preenchidos.</p><a className="booking-whatsapp-button" href={confirmationUrl} target="_blank" rel="noreferrer" onClick={() => setSubmitted(false)}><MessageCircle size={20} /> Confirmar no WhatsApp</a></section></div>}
  </div>;
}
