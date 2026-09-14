import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
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
  Sparkles,
  Star,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Nildes Souza Estética | Beleza, Cuidado e Bem-Estar" },
      { name: "description", content: "Nildes Souza Estética no Imbuí, Salvador. Beleza, estética, autocuidado e bem-estar em um espaço acolhedor." },
      { property: "og:title", content: "Nildes Souza Estética" },
      { property: "og:description", content: "Tudo o que você precisa para realçar sua beleza." },
      { property: "og:type", content: "website" },
    ],
  }),
});

const wa = "https://wa.me/5571981294334?text=Ol%C3%A1!%20Quero%20agendar%20um%20hor%C3%A1rio%20na%20Nildes%20Souza%20Est%C3%A9tica.";
const mapUrl = "https://www.google.com/maps/search/?api=1&query=Rua+das+Gaivotas%2C+196%2C+Imbui+Center%2C+Sala+101%2C+Salvador%2C+BA";
const instagramUrl = "https://instagram.com/nildes.estetica";

const procedures = [
  { name: "Limpeza de Pele", tag: "Pele renovada", text: "Higienização e cuidado para uma pele mais limpa, leve e luminosa.", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1100&q=90" },
  { name: "Design de Sobrancelhas", tag: "Olhar em destaque", text: "Um design pensado para valorizar seus traços e harmonizar o olhar.", image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1100&q=90" },
  { name: "Massagem Relaxante", tag: "Pausa para você", text: "Um momento de relaxamento para desacelerar e aproveitar o seu tempo.", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1100&q=90" },
  { name: "Ventosaterapia", tag: "Cuidado corporal", text: "Uma experiência corporal complementar para sua rotina de bem-estar.", image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1100&q=90" },
  { name: "Peeling", tag: "Renovação da pele", text: "Cuidado estético para favorecer uma aparência mais uniforme e renovada.", image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b0?auto=format&fit=crop&w=1100&q=90" },
  { name: "Auriculoterapia", tag: "Equilíbrio e cuidado", text: "Uma prática complementar de atenção ao corpo e ao seu momento de cuidado.", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1100&q=90" },
] as const;

const reviews = [
  ["Mariana", "Um atendimento acolhedor e um espaço muito bonito. Saí me sentindo ainda melhor."],
  ["Camila", "Amei o cuidado em cada detalhe. Foi uma experiência leve, tranquila e especial."],
  ["Juliana", "O atendimento foi maravilhoso. Já quero voltar para conhecer outros procedimentos."],
  ["Patrícia", "Ambiente agradável, atendimento atencioso e muito carinho durante todo o procedimento."],
] as const;

const faqs = [
  ["Preciso agendar antes de ir?", "Sim. Recomendamos o agendamento para reservar seu horário e oferecer um atendimento tranquilo e personalizado."],
  ["Onde fica a Nildes Souza Estética?", "Rua das Gaivotas, 196, Imbuí Center, Sala 101, ao lado da Subway, em Salvador - BA."],
  ["Quais procedimentos estão disponíveis?", "Auriculoterapia, design de sobrancelhas, limpeza de pele, peeling, ventosaterapia e massagem relaxante."],
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
  return <div className="ns-brand" aria-label="Nildes Souza Estética"><div className="brand-symbol">NS</div><div><strong>NILDES SOUZA</strong><span>ESTÉTICA</span></div></div>;
}

function LoopCarousel({ children, duration = 34 }: { children: ReactNode; duration?: number }) {
  return <div className="ns-loop-wrap"><div className="ns-loop" style={{ "--loop-duration": `${duration}s` } as React.CSSProperties}><div className="ns-loop-track"><div className="ns-loop-set">{children}</div><div className="ns-loop-set" aria-hidden="true">{children}</div></div></div></div>;
}

function Index() {
  const [openFaq, setOpenFaq] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const phone = String(form.get("phone") || "");
    const treatment = String(form.get("treatment") || "");
    const date = String(form.get("date") || "");
    const time = String(form.get("time") || "");
    const notes = String(form.get("notes") || "");
    const message = `Olá! Quero solicitar um agendamento na Nildes Souza Estética.%0A%0ANome: ${encodeURIComponent(name)}%0ATelefone: ${encodeURIComponent(phone)}%0ATratamento: ${encodeURIComponent(treatment)}%0AData: ${encodeURIComponent(date)}%0AHorário: ${encodeURIComponent(time)}%0AObservações: ${encodeURIComponent(notes || "Nenhuma")}`;
    setSubmitted(true);
    window.open(`https://wa.me/5571981294334?text=${message}`, "_blank", "noopener,noreferrer");
  }

  return <div className="ns-page"><main>
    <section id="inicio" className="ns-hero"><div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" /><div className="ns-container hero-inner"><Brand /><span className="ns-eyebrow hero-eyebrow"><Sparkles size={14} /> Beleza • Cuidado • Bem-estar</span><h1>Realce sua beleza.<br /><em>Cuide de você.</em></h1><p>Um espaço pensado para transformar o autocuidado em uma experiência leve, acolhedora e especial.</p><div className="hero-actions"><Button href="#agendamento">Agendar meu horário</Button><Button href="#procedimentos" light>Conhecer procedimentos</Button></div><div className="hero-mini-points"><span><Check size={15} /> Atendimento personalizado</span><span><Check size={15} /> Ambiente acolhedor</span><span><Check size={15} /> Cuidado em cada detalhe</span></div></div></section>

    <section className="ns-value-strip" aria-label="Especialidades da Nildes Souza Estética"><LoopCarousel duration={24}>{["BELEZA", "CUIDADO", "BEM-ESTAR", "AUTOESTIMA", "AUTOCUIDADO", "MOMENTO PARA VOCÊ"].map((item) => <div className="value-item" key={item}><span>{item}</span><i>✦</i></div>)}</LoopCarousel></section>

    <section id="sobre" className="ns-section ns-how"><div className="ns-container"><SectionTitle eyebrow="Como funciona" title="Seu cuidado começa antes mesmo de chegar" sub="Um processo simples, pensado para deixar tudo mais leve: você escolhe, agenda e chega pronta para aproveitar seu momento." /><div className="how-grid"><article className="how-card"><span>01</span><div className="how-icon"><Sparkles /></div><h3>Escolha seu cuidado</h3><p>Conheça os procedimentos e encontre o cuidado que mais combina com o que você procura.</p><div className="how-line" /></article><article className="how-card featured"><span>02</span><div className="how-icon"><CalendarDays /></div><h3>Reserve seu horário</h3><p>Preencha o formulário com seus dados, escolha a data e indique o melhor horário.</p><div className="how-line" /></article><article className="how-card"><span>03</span><div className="how-icon"><Heart /></div><h3>Viva seu momento</h3><p>Você chega e encontra um atendimento próximo, delicado e preparado para receber você.</p><div className="how-line" /></article></div><div className="center-cta"><Button href="#agendamento">Quero agendar meu horário</Button></div></div></section>

    <section className="ns-section ns-about"><div className="ns-container about-grid"><div className="about-photo-wrap"><div className="about-photo-glow" /><img className="about-photo" src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=90" alt="Profissional de estética em ambiente de atendimento" loading="lazy" /><span className="about-badge"><Sparkles size={14} /> Nildes Souza Estética</span></div><div className="about-copy"><span className="ns-eyebrow"><Heart size={14} /> Quem está por trás do cuidado</span><h2>Prazer, eu sou <em>Nildes Souza.</em></h2><p>Meu propósito é criar um espaço onde beleza e bem-estar caminhem juntos, com atendimento próximo, delicadeza e atenção verdadeira a cada pessoa.</p><p>Na Nildes Souza Estética, cada procedimento é também um convite para desacelerar, cuidar de si e valorizar a sua autoestima.</p><div className="about-signature">Nildes Souza <small>Estética &amp; Cosmética</small></div><div className="about-actions"><Button href="#agendamento">Agendar com a Nildes</Button><Button href={instagramUrl} light>Conhecer no Instagram</Button></div></div></div></section>

    <section id="procedimentos" className="ns-section ns-procedures"><div className="ns-container"><SectionTitle eyebrow="Nossos cuidados" title="Procedimentos escolhidos para o seu momento" sub="Conheça cada cuidado de perto e escolha o que faz sentido para você hoje." /><LoopCarousel duration={38}>{procedures.map((item, i) => <article className="procedure-card" key={item.name}><div className="procedure-image"><img src={item.image} alt={item.name} loading="lazy" /><span className="procedure-number">0{i + 1}</span><span className="procedure-chip">{item.tag}</span></div><div className="procedure-body"><h3>{item.name}</h3><p>{item.text}</p><a href="#agendamento">Agendar este cuidado <ArrowRight size={15} /></a></div></article>)}</LoopCarousel><div className="carousel-note"><span /> Movimento contínuo <b>•</b> sem parar ao passar o mouse <span /></div><div className="center-cta"><Button href="#agendamento">Agendar meu procedimento</Button></div></div></section>

    <section className="ns-section ns-experience"><div className="ns-container experience-box"><div className="experience-copy"><span className="ns-eyebrow"><Sparkles size={14} /> Sua experiência</span><h2>Mais do que um procedimento.<br /><em>Um momento para você.</em></h2><p>Um atendimento pensado para unir beleza, conforto e bem-estar em uma experiência que começa no primeiro contato.</p><div className="experience-points"><div><span>01</span><p><b>Atendimento próximo</b><small>Escuta, atenção e cuidado em cada etapa.</small></p></div><div><span>02</span><p><b>Ambiente acolhedor</b><small>Uma atmosfera leve para você desacelerar.</small></p></div><div><span>03</span><p><b>Beleza com delicadeza</b><small>Procedimentos e cuidados escolhidos para valorizar você.</small></p></div></div><Button href="#agendamento">Reservar meu momento</Button></div><div className="experience-visual"><div className="experience-orbit" /><div className="experience-card"><Heart size={23} /><span>cuidado</span><strong>feito com<br /><em>delicadeza</em></strong><small>Nildes Souza Estética</small></div></div></div></section>

    <section className="ns-section ns-why"><div className="ns-container"><SectionTitle eyebrow="Por que escolher a Nildes" title="Cuidado que você percebe nos detalhes" sub="Uma experiência acolhedora, delicada e pensada para fazer você se sentir especial." /><div className="why-grid"><article><div className="why-icon"><Heart /></div><h3>Atendimento acolhedor</h3><p>Você é recebida com atenção, respeito e carinho em cada etapa.</p></article><article><div className="why-icon"><Sparkles /></div><h3>Experiência personalizada</h3><p>Seu momento merece atenção aos detalhes e ao que você procura.</p></article><article><div className="why-icon"><Check /></div><h3>Ambiente confortável</h3><p>Um espaço pensado para deixar sua experiência mais leve e agradável.</p></article><article><div className="why-icon"><Star /></div><h3>Cuidado com propósito</h3><p>Beleza e bem-estar caminhando juntos em uma experiência especial.</p></article></div><div className="center-cta"><Button href="#agendamento">Agendar meu horário</Button></div></div></section>

    <section className="ns-section ns-reviews"><div className="ns-container"><SectionTitle eyebrow="Experiências" title="Quem vive, recomenda" sub="Alguns sentimentos que queremos que façam parte de cada atendimento." /><LoopCarousel duration={34}>{reviews.map(([name, text]) => <article className="review-card" key={name}><div className="review-stars">{[1,2,3,4,5].map((star) => <Star key={star} size={15} fill="currentColor" />)}</div><p>“{text}”</p><div className="review-person"><span>{name.charAt(0)}</span><div><strong>{name}</strong><small>Cliente Nildes Souza Estética</small></div></div></article>)}</LoopCarousel><div className="center-cta"><Button href="#agendamento">Quero viver essa experiência</Button></div></div></section>

    <section className="ns-location"><div className="ns-container location-grid"><div className="location-copy"><span className="ns-eyebrow"><MapPin size={14} /> Onde estamos</span><h2>Seu próximo momento de cuidado fica <em>aqui.</em></h2><p>Rua das Gaivotas, 196 — Imbuí Center, Sala 101, ao lado da Subway, Salvador - BA.</p><div className="location-detail"><MapPin /><div><b>Imbuí Center</b><span>Sala 101 • ao lado da Subway</span></div></div><div className="location-actions"><Button href={mapUrl}>Abrir no Google Maps</Button><Button href="#agendamento" light>Agendar horário</Button></div></div><div className="map-frame"><iframe title="Localização da Nildes Souza Estética no Imbuí" src="https://www.google.com/maps?q=Rua+das+Gaivotas,+196,+Imbui+Center,+Sala+101,+Salvador,+BA&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><div className="map-label"><MapPin size={16} /><span>Nildes Souza Estética</span></div></div></div></section>

    <section id="duvidas" className="ns-section ns-faq"><div className="ns-container faq-grid"><div><SectionTitle eyebrow="Perguntas frequentes" title="Tudo mais simples antes do seu horário" sub="Confira as respostas para as dúvidas mais comuns." /><Button href="#agendamento">Ainda tenho dúvidas — agendar</Button></div><div className="faq-list">{faqs.map(([question, answer], index) => <div className={`faq-item ${openFaq === index ? "open" : ""}`} key={question}><button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}><span>{question}</span><ChevronDown size={19} /></button><div className="faq-answer"><p>{answer}</p></div></div>)}</div></div></section>

    <section id="agendamento" className="ns-section ns-booking"><div className="ns-container booking-shell"><div className="booking-heading"><span className="ns-eyebrow"><CalendarDays size={14} /> Agendamento online</span><h2>Reserve seu momento de <em>cuidado.</em></h2><p>Preencha os dados abaixo para solicitar seu horário. Escolha o tratamento, a data e o melhor horário para você.</p></div><form className="booking-form" onSubmit={handleSubmit}><div className="form-grid"><label><span>Nome completo</span><input name="name" required placeholder="Digite seu nome" /></label><label><span>Telefone</span><input name="phone" required type="tel" placeholder="(71) 99999-9999" /></label><label><span>Tratamento</span><select name="treatment" required defaultValue=""><option value="" disabled>Selecione um tratamento</option><option>Auriculoterapia</option><option>Design de Sobrancelhas</option><option>Limpeza de Pele</option><option>Peeling</option><option>Ventosaterapia</option><option>Massagem Relaxante</option></select></label><label><span>Data</span><input name="date" required type="date" /></label></div><div className="form-section-title"><Clock3 size={17} /> Horários disponíveis</div><div className="time-grid">{["15:00","16:00","17:00","18:00"].map((time) => <label key={time}><input type="radio" name="time" value={time} required /><span>{time}</span></label>)}</div><label className="full-field"><span>Observações <small>(opcional)</small></span><textarea name="notes" rows={4} placeholder="Conte algo que gostaria que soubéssemos..." /></label><button className="booking-submit" type="submit"><CalendarDays size={18} /> Solicitar agendamento <ArrowRight size={17} /></button>{submitted && <div className="booking-success"><Check size={19} /><div><b>Solicitação preparada!</b><span>O WhatsApp foi aberto com seus dados para confirmar o atendimento.</span></div></div>}<p className="booking-note">Seus dados serão usados para organizar seu atendimento. A confirmação do horário será feita pelo WhatsApp.</p></form></div></section>

    <section className="ns-final-cta"><div className="ns-container final-inner"><span className="ns-eyebrow"><Sparkles size={14} /> Nildes Souza Estética</span><h2>Seu momento de cuidado <em>começa aqui.</em></h2><p>Tudo o que você precisa para realçar sua beleza.</p><Button href="#agendamento">Agendar meu horário</Button></div></section>
  </main>

  <footer className="ns-footer"><div className="ns-container footer-grid"><div><Brand /><p>Beleza, cuidado e bem-estar em uma experiência feita para você.</p></div><div><strong>Atalhos</strong><a href="#inicio">Início</a><a href="#sobre">Como funciona</a><a href="#procedimentos">Procedimentos</a><a href="#agendamento">Agendamento</a></div><div><strong>Contato</strong><a href={mapUrl} target="_blank" rel="noreferrer"><MapPin size={15} /> Rua das Gaivotas, 196 — Imbuí Center</a><a href={wa} target="_blank" rel="noreferrer">WhatsApp • (71) 98129-4334</a><a href={instagramUrl} target="_blank" rel="noreferrer"><Instagram size={15} /> @nildes.estetica</a></div></div><div className="ns-container footer-bottom"><span>© {new Date().getFullYear()} Nildes Souza Estética. Todos os direitos reservados.</span><span>Salvador • BA</span></div></footer>

  <a className="floating-whatsapp" href={wa} target="_blank" rel="noreferrer" aria-label="Falar com a Nildes Souza Estética pelo WhatsApp"><img src="https://cdn.simpleicons.org/whatsapp/ffffff" alt="WhatsApp" /><span>Fale conosco</span></a>
  </div>;
}
