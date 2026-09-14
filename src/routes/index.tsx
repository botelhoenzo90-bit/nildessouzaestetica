import { createFileRoute } from "@tanstack/react-router";
import { Children, useState, type ReactNode } from "react";
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
  Menu,
  MessageCircle,
  Sparkles,
  Star,
  X,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Nildes Souza Estética | Beleza, Cuidado e Bem-Estar" },
      {
        name: "description",
        content:
          "Nildes Souza Estética: auriculoterapia, design de sobrancelhas, limpeza de pele, peeling, ventosaterapia e massagem relaxante no Imbuí, Salvador - BA.",
      },
      { property: "og:title", content: "Nildes Souza Estética | Beleza, Cuidado e Bem-Estar" },
      {
        property: "og:description",
        content: "Tudo o que você precisa para realçar sua beleza, cuidar de você e viver momentos de bem-estar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const wa =
  "https://wa.me/5571981294334?text=Ol%C3%A1!%20Quero%20agendar%20um%20hor%C3%A1rio%20na%20Nildes%20Souza%20Est%C3%A9tica.";
const mapUrl =
  "https://www.google.com/maps/search/?api=1&query=Rua+das+Gaivotas+196+Imbui+Center+Sala+101+Salvador+BA";
const instagramUrl = "https://instagram.com/nildes.estetica";

const navLinks: [string, string][] = [
  ["Início", "#inicio"],
  ["Sobre", "#sobre"],
  ["Procedimentos", "#procedimentos"],
  ["Experiência", "#experiencia"],
  ["Dúvidas", "#duvidas"],
  ["Agendamento", "#agendamento"],
];

const procedures = [
  {
    name: "Limpeza de Pele",
    eyebrow: "Pele renovada",
    text: "Um cuidado completo para deixar a pele mais limpa, leve e com aparência saudável.",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=88",
  },
  {
    name: "Design de Sobrancelhas",
    eyebrow: "Olhar em destaque",
    text: "Valorize seus traços com um design pensado para harmonizar o seu olhar.",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1000&q=88",
  },
  {
    name: "Massagem Relaxante",
    eyebrow: "Pausa para você",
    text: "Um momento de relaxamento para desacelerar, aliviar tensões e cuidar do bem-estar.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1000&q=88",
  },
  {
    name: "Ventosaterapia",
    eyebrow: "Cuidado corporal",
    text: "Uma experiência de cuidado que complementa sua rotina de bem-estar e relaxamento.",
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1000&q=88",
  },
  {
    name: "Peeling",
    eyebrow: "Renovação da pele",
    text: "Cuidado estético para promover renovação e deixar a pele com aspecto mais uniforme.",
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b0?auto=format&fit=crop&w=1000&q=88",
  },
  {
    name: "Auriculoterapia",
    eyebrow: "Equilíbrio e cuidado",
    text: "Uma prática de cuidado complementar para quem busca uma pausa de atenção ao corpo e à mente.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=88",
  },
] as const;

const reviews = [
  ["Mariana", "Um atendimento acolhedor e um espaço muito bonito. Saí me sentindo ainda melhor."],
  ["Camila", "Amei o cuidado em cada detalhe. Foi uma experiência leve, tranquila e especial."],
  ["Juliana", "O atendimento foi maravilhoso. Já quero voltar para conhecer outros procedimentos."],
  ["Patrícia", "Ambiente agradável, atendimento atencioso e muito carinho durante todo o procedimento."],
] as const;

const faqs = [
  "Preciso agendar antes de ir?",
  "Onde fica a Nildes Souza Estética?",
  "Quais procedimentos estão disponíveis?",
  "Como funciona o agendamento online?",
  "Posso agendar mais de um procedimento?",
  "Como entro em contato pelo WhatsApp?",
];

function Button({
  children = "Agendar meu horário",
  href = "#agendamento",
  light = false,
  whatsapp = false,
}: {
  children?: ReactNode;
  href?: string;
  light?: boolean;
  whatsapp?: boolean;
}) {
  const external = href.startsWith("http");
  return (
    <a
      className={`ns-btn ${light ? "ns-btn-light" : ""}`}
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {whatsapp && <MessageCircle size={17} />}
      {children}
      {!whatsapp && <ArrowUpRight size={16} />}
    </a>
  );
}

function SectionTitle({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div className="ns-section-title">
      <span className="ns-eyebrow"><Sparkles size={14} /> {eyebrow}</span>
      <h2>{title}</h2>
      <p>{sub}</p>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`ns-brand ${compact ? "compact" : ""}`} aria-label="Nildes Souza Estética">
      <div className="brand-symbol">NS</div>
      <div className="brand-name">
        <strong>NILDES SOUZA</strong>
        <span>ESTÉTICA</span>
      </div>
    </div>
  );
}

function Marquee({ children, label, duration = 34 }: { children: ReactNode; label: string; duration?: number }) {
  const items = Children.toArray(children);
  return (
    <div className="ns-marquee" role="group" aria-label={label}>
      <div className="ns-marquee-track" style={{ ["--marquee-duration" as string]: `${duration}s` }}>
        {items}
        {items.map((item, i) => (
          <div key={`clone-${i}`} aria-hidden="true" style={{ display: "contents" }}>{item}</div>
        ))}
      </div>
    </div>
  );
}

function Index() {
  const [menu, setMenu] = useState(false);
  const [faq, setFaq] = useState<number | null>(0);

  return (
    <div className="ns-page">
      <header className="ns-header">
        <a href="#inicio" aria-label="Nildes Souza Estética">
          <Brand compact />
        </a>
        <nav>
          {navLinks.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
        </nav>
        <Button href="#agendamento">Agendar horário</Button>
        <button className="ns-menu-btn" onClick={() => setMenu(!menu)} aria-label={menu ? "Fechar menu" : "Abrir menu"}>
          {menu ? <X /> : <Menu />}
        </button>
      </header>

      {menu && (
        <div className="ns-mobile-menu">
          {navLinks.map(([label, href]) => (
            <a key={label} href={href} onClick={() => setMenu(false)}>{label}</a>
          ))}
          <Button href="#agendamento">Agendar meu horário</Button>
        </div>
      )}

      <main>
        <section id="inicio" className="ns-hero">
          <div className="hero-decoration hero-decoration-one" />
          <div className="hero-decoration hero-decoration-two" />
          <div className="ns-container hero-grid">
            <div className="hero-copy">
              <span className="ns-eyebrow"><Sparkles size={14} /> Nildes Souza Estética</span>
              <h1>Realce sua beleza.<br /><em>Cuide de você.</em></h1>
              <p>Um espaço para transformar o autocuidado em uma experiência de beleza, leveza e bem-estar.</p>
              <div className="hero-actions">
                <Button href="#agendamento">Agendar meu horário</Button>
                <Button href="#procedimentos" light>Conhecer procedimentos</Button>
              </div>
              <div className="hero-trust">
                <span><Check size={15} /> Atendimento personalizado</span>
                <span><Check size={15} /> Ambiente acolhedor</span>
                <span><Check size={15} /> Momento de autocuidado</span>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-photo-main">
                <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=90" alt="Cuidado facial em clínica de estética" />
              </div>
              <div className="hero-photo-small">
                <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=700&q=88" alt="Momento de relaxamento" />
              </div>
              <div className="hero-note"><Heart size={17} fill="currentColor" /><span>Seu momento<br /><b>começa aqui</b></span></div>
            </div>
          </div>
        </section>

        <section className="ns-intro-strip">
          <div className="ns-container intro-inner">
            <span>BELEZA</span><i /> <span>CUIDADO</span><i /> <span>BEM-ESTAR</span><i /> <span>AUTOESTIMA</span>
          </div>
        </section>

        <section id="sobre" className="ns-section ns-about">
          <div className="ns-container about-grid">
            <div className="about-visual">
              <div className="about-image-main">
                <img src="https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=1100&q=90" alt="Ambiente de estética e autocuidado" loading="lazy" />
              </div>
              <div className="about-badge"><span>NS</span><small>Estética</small></div>
              <div className="about-flower">✦</div>
            </div>
            <div className="about-copy">
              <span className="ns-eyebrow"><Sparkles size={14} /> Um espaço para você</span>
              <h2>Cuidar de você é a nossa <em>essência.</em></h2>
              <p>Na Nildes Souza Estética, cada atendimento é um convite para desacelerar e reservar um tempo para si. Unimos cuidado, beleza e bem-estar em uma experiência acolhedora e personalizada.</p>
              <p>Do primeiro contato ao final do atendimento, queremos que você se sinta confortável, valorizada e especial.</p>
              <div className="about-points">
                <div><span><Heart /></span><b>Cuidado com carinho</b><small>Um atendimento próximo e acolhedor.</small></div>
                <div><span><Sparkles /></span><b>Beleza em cada detalhe</b><small>Procedimentos pensados para você.</small></div>
              </div>
              <Button href="#agendamento">Quero viver essa experiência</Button>
            </div>
          </div>
        </section>

        <section id="procedimentos" className="ns-section ns-procedures">
          <div className="ns-container">
            <SectionTitle eyebrow="Nossos cuidados" title="Tudo o que você precisa para realçar sua beleza" sub="Escolha seu momento de cuidado e encontre o procedimento que combina com você." />
            <Marquee label="Procedimentos estéticos" duration={36}>
              {procedures.map((item, i) => (
                <article className="procedure-card" key={item.name}>
                  <div className="procedure-image">
                    <img src={item.image} alt={item.name} loading="lazy" />
                    <span>0{i + 1}</span>
                    <button className="procedure-heart" aria-label={`Agendar ${item.name}`} onClick={() => document.getElementById("agendamento")?.scrollIntoView({ behavior: "smooth" })}><Heart size={18} /></button>
                  </div>
                  <div className="procedure-body">
                    <span className="procedure-eyebrow">{item.eyebrow}</span>
                    <h3>{item.name}</h3>
                    <p>{item.text}</p>
                    <a href="#agendamento">Agendar <ArrowRight size={15} /></a>
                  </div>
                </article>
              ))}
            </Marquee>
            <div className="carousel-hint"><span /> Arraste ou passe o mouse para explorar <span /></div>
          </div>
        </section>

        <section id="experiencia" className="ns-experience">
          <div className="ns-container experience-grid">
            <div className="experience-copy">
              <span className="ns-eyebrow light"><Sparkles size={14} /> Sua experiência</span>
              <h2>Mais do que um procedimento.<br /><em>Um momento para você.</em></h2>
              <p>Porque autocuidado não precisa ser corrido. Aqui, cada detalhe foi pensado para que você possa respirar, relaxar e sair se sentindo ainda melhor.</p>
              <div className="experience-list">
                <div><span>01</span><p><b>Atendimento personalizado</b><small>Olhar atento às suas necessidades e ao que faz sentido para você.</small></p></div>
                <div><span>02</span><p><b>Ambiente acolhedor</b><small>Um espaço agradável para transformar seu atendimento em uma pausa especial.</small></p></div>
                <div><span>03</span><p><b>Cuidado do início ao fim</b><small>Uma experiência pensada nos pequenos detalhes.</small></p></div>
              </div>
              <Button href="#agendamento" light>Reservar meu momento</Button>
            </div>
            <div className="experience-visual">
              <div className="experience-photo large"><img src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1000&q=90" alt="Mulher em momento de autocuidado" loading="lazy" /></div>
              <div className="experience-photo small"><img src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b0?auto=format&fit=crop&w=700&q=88" alt="Cuidado de pele" loading="lazy" /></div>
              <div className="experience-stamp"><Star size={15} fill="currentColor" /><span>Seu cuidado<br /><b>merece atenção</b></span></div>
            </div>
          </div>
        </section>

        <section className="ns-benefits ns-section">
          <div className="ns-container">
            <SectionTitle eyebrow="Por que escolher a Nildes" title="Um cuidado pensado nos detalhes" sub="Tudo para você se sentir bem, acolhida e confiante em cada visita." />
            <div className="benefit-grid">
              <article><span><Heart /></span><h3>Atendimento acolhedor</h3><p>Um olhar cuidadoso para tornar cada visita mais leve e especial.</p></article>
              <article><span><Sparkles /></span><h3>Experiência personalizada</h3><p>Procedimentos e cuidados escolhidos para valorizar o que você busca.</p></article>
              <article><span><Check /></span><h3>Profissionalismo</h3><p>Organização, atenção e cuidado em todos os detalhes do atendimento.</p></article>
              <article><span><Star /></span><h3>Momento de autocuidado</h3><p>Uma pausa na rotina para cuidar da beleza e do bem-estar.</p></article>
            </div>
          </div>
        </section>

        <section className="ns-quote">
          <div className="ns-container quote-inner">
            <span className="quote-mark">“</span>
            <h2>Presenteie-se com saúde,<br /><em>relaxamento e autoestima.</em></h2>
            <p>Seu tempo também importa.</p>
            <div className="quote-line" />
          </div>
        </section>

        <section className="ns-reviews ns-section">
          <div className="ns-container">
            <SectionTitle eyebrow="Experiências" title="Quem vive, sente a diferença" sub="Algumas palavras de quem já reservou um momento para si." />
            <Marquee label="Depoimentos" duration={31}>
              {reviews.map(([name, text]) => (
                <article className="review-card" key={name}>
                  <div className="review-stars">★★★★★</div>
                  <p>“{text}”</p>
                  <div className="review-person"><span>{name.charAt(0)}</span><b>{name}</b><small>Cliente</small></div>
                </article>
              ))}
            </Marquee>
          </div>
        </section>

        <section id="agendamento" className="ns-booking">
          <div className="ns-container booking-card">
            <div className="booking-copy">
              <span className="ns-eyebrow"><CalendarDays size={14} /> Agendamento</span>
              <h2>Seu momento começa com um <em>horário reservado.</em></h2>
              <p>Escolha seu procedimento e reserve seu atendimento de forma simples. Esta área está preparada para receber a integração com o Google Agenda.</p>
              <div className="booking-info"><span><Clock3 size={17} /> Agendamento online</span><span><Check size={17} /> Atendimento personalizado</span></div>
            </div>
            <div className="booking-action">
              <div className="calendar-icon"><CalendarDays /></div>
              <h3>Agende seu horário</h3>
              <p>Em breve, você poderá escolher a data e o horário diretamente por aqui.</p>
              <Button href={wa} whatsapp>Agendar pelo WhatsApp</Button>
              <small>Enquanto a agenda online é configurada, fale conosco pelo WhatsApp.</small>
            </div>
          </div>
        </section>

        <section id="duvidas" className="ns-faq ns-section">
          <div className="ns-container faq-grid">
            <div className="faq-intro">
              <span className="ns-eyebrow"><Sparkles size={14} /> Dúvidas frequentes</span>
              <h2>Tudo mais simples para você.</h2>
              <p>Confira algumas respostas rápidas. Se ainda tiver alguma dúvida, nossa equipe está à disposição.</p>
              <Button href={wa} whatsapp>Falar no WhatsApp</Button>
            </div>
            <div className="faq-list">
              {faqs.map((q, i) => (
                <div className={`faq-item ${faq === i ? "open" : ""}`} key={q}>
                  <button onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i}>
                    <span>0{i + 1}</span><b>{q}</b><ChevronDown />
                  </button>
                  {faq === i && <p>Fale com nossa equipe pelo WhatsApp para receber as orientações e informações sobre seu atendimento.</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contato" className="ns-contact">
          <div className="ns-container contact-grid">
            <div className="contact-copy">
              <span className="ns-eyebrow"><MapPin size={14} /> Visite a Nildes Souza Estética</span>
              <Brand />
              <h2>Seu próximo momento de cuidado está aqui.</h2>
              <p>Tudo o que você precisa para realçar sua beleza, em um espaço acolhedor no Imbuí.</p>
              <div className="contact-details">
                <a href={mapUrl} target="_blank" rel="noreferrer"><MapPin /> <span><b>Rua das Gaivotas, 196</b><small>Imbuí Center, Sala 101 · Ao lado da Subway</small></span></a>
                <a href={wa} target="_blank" rel="noreferrer"><MessageCircle /> <span><b>(71) 98129-4334</b><small>Fale conosco pelo WhatsApp</small></span></a>
                <a href={instagramUrl} target="_blank" rel="noreferrer"><Instagram /> <span><b>@nildes.estetica</b><small>Acompanhe no Instagram</small></span></a>
              </div>
              <Button href={mapUrl}>Como chegar</Button>
            </div>
            <div className="contact-map">
              <div className="map-card">
                <div className="map-pattern" />
                <div className="map-pin"><MapPin size={26} /></div>
                <div className="map-label"><b>Imbuí Center</b><span>Rua das Gaivotas, 196 · Sala 101</span></div>
                <a href={mapUrl} target="_blank" rel="noreferrer">Abrir no Google Maps <ArrowUpRight size={15} /></a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="ns-footer">
        <div className="ns-container footer-top">
          <div className="footer-brand"><Brand /><p>Tudo o que você precisa para realçar sua beleza.</p></div>
          <div><h3>Navegação</h3>{navLinks.slice(0, 5).map(([label, href]) => <a key={label} href={href}>{label}</a>)}</div>
          <div><h3>Procedimentos</h3>{procedures.slice(0, 5).map((p) => <a key={p.name} href="#procedimentos">{p.name}</a>)}</div>
          <div><h3>Contato</h3><a href={wa} target="_blank" rel="noreferrer"><MessageCircle /> (71) 98129-4334</a><a href={instagramUrl} target="_blank" rel="noreferrer"><Instagram /> @nildes.estetica</a><span><MapPin /> Imbuí Center · Sala 101</span></div>
        </div>
        <div className="ns-container footer-bottom"><span>© 2026 Nildes Souza Estética. Todos os direitos reservados.</span><span>Beleza · Cuidado · Bem-estar</span></div>
      </footer>

      <a className="floating-wa" href={wa} target="_blank" rel="noreferrer" aria-label="Falar com a Nildes Souza Estética pelo WhatsApp">
        <MessageCircle size={29} />
        <span>Fale conosco</span>
      </a>
    </div>
  );
}
