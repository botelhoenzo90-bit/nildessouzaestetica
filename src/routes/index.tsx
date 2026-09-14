import { createFileRoute } from "@tanstack/react-router";
import { Children, useState, type ReactNode } from "react";
import {
  Activity, Baby, CalendarDays, ChevronDown, ClipboardList, Clock3, Cross,
  Droplets, FileText, Heart, HeartPulse, Instagram, MapPin, Menu, Microscope,
  Navigation, Phone, ShieldCheck, Stethoscope, Users, X, Sparkles,
  CheckCircle2, ArrowUpRight
} from "lucide-react";

import logoAsset from "@/assets/logo-prosaude.png.asset.json";
import waIcon from "@/assets/wa-icon.png.asset.json";
import heroImg from "@/assets/hero.jpg";
import childImg from "@/assets/child.jpg";
import clinicImg from "@/assets/clinic.jpg";

import espCardio from "@/assets/esp-cardiologia.jpg";
import espGineco from "@/assets/esp-ginecologia.jpg";
import espUro from "@/assets/esp-urologia.jpg";
import espOrto from "@/assets/esp-ortopedia.jpg";
import espNeuro from "@/assets/esp-neurologia.jpg";
import espNutri from "@/assets/esp-nutricao.jpg";
import espClinico from "@/assets/esp-clinico.jpg";

import exLab from "@/assets/ex-laboratorio.jpg";
import exUltra from "@/assets/ex-ultrassom.jpg";
import exEcg from "@/assets/ex-ecg.jpg";
import exMapa from "@/assets/ex-mapa.jpg";
import exHolter from "@/assets/ex-holter.jpg";
import exEspiro from "@/assets/ex-espirometria.jpg";
import exErgo from "@/assets/ex-ergometrico.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Clínica Médica Pró-Saúde | Consultas e Exames em Macururé - BA" },
      {
        name: "description",
        content:
          "Consultas, exames e coleta laboratorial em Macururé - BA. Cardiologia, ginecologia, pediatria e mais, com atendimento humanizado para toda a família.",
      },
      { property: "og:title", content: "Clínica Médica Pró-Saúde | Macururé - BA" },
      {
        property: "og:description",
        content: "Consultas, exames e coleta laboratorial em um só lugar, com atendimento humanizado.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const wa =
  "https://wa.me/557597018423?text=Ol%C3%A1!%20Quero%20agendar%20um%20atendimento%20na%20Cl%C3%ADnica%20M%C3%A9dica%20Pr%C3%B3-Sa%C3%BAde.";
const mapUrl = "https://www.google.com/maps/search/?api=1&query=Clinica+Medica+Pro-Saude+Macurure+BA";

const navLinks: [string, string][] = [
  ["Início", "#inicio"],
  ["A Clínica", "#a-clinica"],
  ["Especialidades", "#especialidades"],
  ["Exames", "#exames"],
  ["Atendimento Infantil", "#atendimento-infantil"],
  ["Dúvidas", "#duvidas"],
  ["Contato", "#contato"],
];

const specialties = [
  [HeartPulse, "Cardiologia", "Cuidado cardiovascular, prevenção e acompanhamento para manter seu coração saudável.", espCardio],
  [Baby, "Ginecologia", "Saúde feminina com acolhimento e acompanhamento em todas as fases da vida.", espGineco],
  [Activity, "Urologia", "Prevenção, diagnóstico e cuidado completo para a saúde urinária e masculina.", espUro],
  [Cross, "Ortopedia", "Mais movimento e qualidade de vida com avaliação e cuidado especializado.", espOrto],
  [Microscope, "Neurologia", "Atenção à saúde do cérebro, memória, equilíbrio e sistema nervoso.", espNeuro],
  [Droplets, "Nutrição", "Orientação alimentar individualizada para mais saúde, energia e bem-estar.", espNutri],
  [Stethoscope, "Clínico Geral", "Atendimento completo para prevenção, avaliação e cuidado em todas as idades.", espClinico],
] as const;

const exams = [
  [FileText, "Exames Laboratoriais", "Coleta segura e prática para diferentes tipos de exames.", exLab],
  [Microscope, "Ultrassonografia", "Imagens precisas para auxiliar na investigação e no diagnóstico.", exUltra],
  [Activity, "Eletrocardiograma", "Avaliação da atividade elétrica e do ritmo do coração.", exEcg],
  [Navigation, "MAPA", "Monitoramento da pressão arterial durante 24 horas.", exMapa],
  [Clock3, "Holter", "Acompanhamento contínuo do ritmo cardíaco ao longo do dia.", exHolter],
  [Droplets, "Espirometria", "Avaliação da capacidade e função respiratória.", exEspiro],
  [Activity, "Teste Ergométrico", "Avaliação cardiovascular durante esforço físico controlado.", exErgo],
] as const;

const reviews = [
  ["Mariana Silva", "Atendimento excelente! Profissionais muito atenciosos, ambiente acolhedor e tudo muito organizado."],
  ["Carlos Mendes", "Realizei meus exames e fui muito bem atendido. Equipe preparada e resultado com muita agilidade."],
  ["Ana Paula", "Levei minha filha e fiquei encantada com o cuidado de toda a equipe. Atendimento humano de verdade!"],
  ["João Oliveira", "Clínica muito bem estruturada. Desde a recepção até o atendimento médico, tudo excelente."],
  ["Fernanda Alves", "Profissionais educados, ambiente confortável e atendimento que transmite confiança."],
] as const;

const faqs = [
  "Precisa estar em jejum para fazer exames laboratoriais?",
  "Qual o prazo para entrega dos resultados?",
  "Crianças também podem realizar exames?",
  "Como posso agendar uma consulta?",
  "Quais formas de pagamento são aceitas?",
];

function Button({
  children = "Agendar pelo WhatsApp",
  href = wa,
  light = false,
  icon = true,
}: {
  children?: ReactNode;
  href?: string;
  light?: boolean;
  icon?: boolean;
}) {
  const external = href.startsWith("http");
  return (
    <a
      className={`ps-btn ${light ? "ps-btn-light" : ""}`}
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {icon && external && <Phone size={16} />}
      {children}
      {!external && <ArrowUpRight size={16} />}
    </a>
  );
}

function SectionTitle({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div className="ps-section-title">
      <span className="section-eyebrow">
        <Sparkles size={13} />
        {eyebrow}
      </span>
      <h2>{title}</h2>
      <p>{sub}</p>
    </div>
  );
}

function Logo({ small = false }: { small?: boolean }) {
  return (
    <div className={`ps-logo ${small ? "small" : ""}`}>
      <img className="logo-img" src={logoAsset.url} alt="Logo da Clínica Médica Pró-Saúde" />
      <div>
        <strong>PRÓ-SAÚDE</strong>
        <small>CLÍNICA MÉDICA</small>
      </div>
    </div>
  );
}

/** Carrossel automático estilo esteira (loop contínuo, pausa ao passar o mouse). */
function Marquee({
  children,
  label,
  duration = 44,
}: {
  children: ReactNode;
  label: string;
  duration?: number;
}) {
  const items = Children.toArray(children);
  return (
    <div className="marquee" role="group" aria-label={label}>
      <div
        className="marquee-track"
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {items}
        {items.map((item, i) => (
          <div key={`clone-${i}`} aria-hidden="true" style={{ display: "contents" }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function Index() {
  const [menu, setMenu] = useState(false);
  const [faq, setFaq] = useState<number | null>(0);

  return (
    <div className="ps-page">
      <header className="ps-header">
        <a href="#inicio" aria-label="Início">
          <Logo small />
        </a>
        <nav>
          {navLinks.map(([label, href]) => (
            <a key={label} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a className="header-wa" href={wa} target="_blank" rel="noreferrer">
          <span className="header-wa-icon">
            <Phone size={16} />
          </span>
          <span>
            Agende pelo WhatsApp
            <br />
            <b>(75) 9701-8423</b>
          </span>
        </a>
        <button className="menu-btn" onClick={() => setMenu(!menu)} aria-label="Abrir menu">
          {menu ? <X /> : <Menu />}
        </button>
      </header>

      {menu && (
        <div className="mobile-menu">
          {navLinks.map(([label, href]) => (
            <a key={label} href={href} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
          <Button />
        </div>
      )}

      <main>
        <section id="inicio" className="ps-hero">
          <div className="hero-bg" aria-hidden="true">
            <img src={heroImg} alt="" />
          </div>
          <div className="hero-copy">
            <span className="mini-label">Clínica Médica Pró-Saúde · Macururé - BA</span>
            <h1>
              Um lugar para <em>cuidar de você</em> e de quem você ama.
            </h1>
            <p>
              Consultas, exames e coleta laboratorial em um só lugar, com profissionais especializados e
              atendimento humanizado para toda a família.
            </p>
            <div className="hero-actions">
              <Button />
              <Button light href="#especialidades">
                Ver especialidades
              </Button>
            </div>
            <div className="hero-trust">
              <span>
                <CheckCircle2 /> Atendimento humanizado
              </span>
              <span>
                <CheckCircle2 /> Adultos e crianças
              </span>
              <span>
                <CheckCircle2 /> Consultas e exames
              </span>
            </div>
          </div>
        </section>

        <section id="especialidades" className="ps-section">
          <SectionTitle
            eyebrow="Nossas especialidades"
            title="Especialidades para cuidar de você"
            sub="Uma equipe preparada para acompanhar diferentes necessidades, com atenção, precisão e acolhimento."
          />
          <Marquee label="Especialidades" duration={30}>
            {specialties.map(([Icon, name, text, img], i) => (
              <article className="specialty-card" key={name}>
                <div className="specialty-visual">
                  <img src={img} alt={`Atendimento de ${name}`} loading="lazy" width={800} height={600} />
                  <span className="card-number">0{i + 1}</span>
                  <div className="card-icon">
                    <Icon />
                  </div>
                </div>
                <div className="specialty-body">
                  <h3>{name}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </Marquee>
          <div className="section-cta">
            <Button>Agendar minha consulta</Button>
          </div>
        </section>

        <section id="exames" className="ps-exams">
          <div className="exam-head">
            <div>
              <span className="section-eyebrow">
                <ClipboardList size={13} /> Exames e serviços
              </span>
              <h2>Precisão para cuidar melhor da sua saúde.</h2>
              <p>Exames selecionados para facilitar sua rotina e apoiar um diagnóstico mais completo.</p>
            </div>
            <Button light>Falar com a equipe</Button>
          </div>
          <Marquee label="Exames e serviços" duration={27}>
            {exams.map(([Icon, name, text, img]) => (
              <article className="exam-card" key={name}>
                <div className="exam-visual">
                  <img src={img} alt={name} loading="lazy" width={800} height={600} />
                </div>
                <div className="exam-card-body">
                  <div className="exam-icon-badge">
                    <Icon />
                  </div>
                  <span>EXAME</span>
                  <h3>{name}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </Marquee>
          <div className="lab-banner">
            <div className="lab-badge">
              <Microscope />
            </div>
            <div>
              <b>COLETA LABORATORIAL</b>
              <span>Praticidade, segurança e acolhimento em cada etapa.</span>
            </div>
          </div>
          <div className="section-cta">
            <Button>Agendar meu exame</Button>
          </div>
        </section>

        <section id="atendimento-infantil" className="ps-three">
          <article className="child-card">
            <img src={childImg} alt="Pediatra atendendo crianças" loading="lazy" width={1000} height={1200} />
            <div className="child-content">
              <span className="mini-label light-label">Atendimento infantil</span>
              <h2>Cuidado especial para os pequenos.</h2>
              <p>Um ambiente acolhedor para que crianças e famílias se sintam seguras em cada atendimento.</p>
              <Button>Saiba mais</Button>
            </div>
          </article>

          <article className="why-card">
            <span className="section-eyebrow">
              <Heart size={13} /> Por que a Pró-Saúde?
            </span>
            <h2>Cuidado que começa no atendimento.</h2>
            <p className="why-lead">
              Da recepção ao acompanhamento, cada detalhe foi pensado para tornar sua experiência mais tranquila.
            </p>
            <div className="why-list">
              {[
                "Atendimento humanizado",
                "Diversas especialidades",
                "Adultos e crianças",
                "Coleta laboratorial",
                "Ambiente organizado",
                "Fácil agendamento",
                "Resultados confiáveis",
                "Localização acessível",
              ].map((x) => (
                <p key={x}>
                  <CheckCircle2 />
                  {x}
                </p>
              ))}
            </div>
          </article>
        </section>

        <section className="ps-strip">
          <div>
            <span>Precisa de atendimento?</span>
            <h2>Sua saúde não pode esperar.</h2>
          </div>
          <a className="strip-wa" href={wa} target="_blank" rel="noreferrer">
            <Phone />
            <span>
              Falar pelo WhatsApp
              <br />
              <b>(75) 9701-8423</b>
            </span>
          </a>
          <div className="strip-feature">
            <CalendarDays />
            <span>
              Agendamento
              <br />
              <b>rápido</b>
            </span>
          </div>
          <div className="strip-feature">
            <ShieldCheck />
            <span>
              Atendimento
              <br />
              <b>seguro</b>
            </span>
          </div>
          <div className="strip-feature">
            <Heart />
            <span>
              Cuidado de
              <br />
              <b>verdade</b>
            </span>
          </div>
        </section>

        <section id="a-clinica" className="ps-about">
          <div className="about-photo">
            <img src={clinicImg} alt="Recepção da Clínica Médica Pró-Saúde" loading="lazy" width={1200} height={1000} />
          </div>
          <div className="about-copy">
            <span className="section-eyebrow">A Clínica Médica Pró-Saúde</span>
            <h2>Saúde com proximidade, confiança e cuidado.</h2>
            <p>
              A Clínica Médica Pró-Saúde está em Macururé - BA para oferecer atendimento de qualidade, com
              profissionais especializados, exames modernos e um cuidado humanizado para toda a família.
            </p>
            <div className="values">
              <div>
                <Heart />
                <b>Nossa missão</b>
                <small>Cuidar de você e da sua família com respeito, ética e acolhimento.</small>
              </div>
              <div>
                <ShieldCheck />
                <b>Nossa visão</b>
                <small>Ser referência em saúde na nossa região.</small>
              </div>
              <div>
                <Users />
                <b>Nossos valores</b>
                <small>Humanização, qualidade, segurança e confiança.</small>
              </div>
            </div>
            <Button>Conheça a clínica</Button>
          </div>
        </section>

        <section className="ps-reviews">
          <SectionTitle
            eyebrow="O que nossos pacientes dizem"
            title="Confiança de quem já escolheu a Pró-Saúde"
            sub="Experiências reais de pacientes que encontraram acolhimento, organização e cuidado."
          />
          <Marquee label="Avaliações de pacientes" duration={32}>
            {reviews.map(([name, text]) => (
              <article className="review-card" key={name}>
                <div className="review-top">
                  <div className="avatar">
                    {name
                      .split(" ")
                      .map((x) => x[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <b>{name}</b>
                    <div className="stars">★★★★★</div>
                  </div>
                  <span className="quote-mark">“</span>
                </div>
                <p>“{text}”</p>
                <div className="review-foot">
                  <CheckCircle2 size={14} /> Paciente da Pró-Saúde
                </div>
              </article>
            ))}
          </Marquee>
          <div className="section-cta">
            <Button>Agendar pelo WhatsApp</Button>
          </div>
          <div className="review-note">
            <CheckCircle2 size={15} /> Atendimento que deixa uma boa impressão do começo ao fim.
          </div>
        </section>

        <section id="contato" className="ps-contact">
          <div className="contact-copy">
            <span className="section-eyebrow">Onde estamos · Fale com a Pró-Saúde</span>
            <Logo />
            <h2>Estamos prontos para acolher você e sua família.</h2>
            <p>Agende sua consulta, tire suas dúvidas ou venha nos visitar em Macururé - BA.</p>
            <Button>Agendar atendimento</Button>
            <div className="contact-details">
              <span>
                <Phone /> (75) 9701-8423
              </span>
              <span>
                <MapPin /> Macururé - BA
              </span>
            </div>
            <div className="contact-place">
              <b>Nosso endereço</b>
              <p>
                <MapPin /> Macururé - BA — Em frente ao Hospital Municipal
              </p>
              <p>
                <Clock3 /> Atendimento de segunda a sexta, com agendamento pelo WhatsApp
              </p>
              <a href={mapUrl} target="_blank" rel="noreferrer">
                Como chegar <Navigation size={14} />
              </a>
            </div>
          </div>
          <div className="contact-map">
            <iframe
              title="Mapa da Clínica Médica Pró-Saúde em Macururé - BA"
              src="https://www.google.com/maps?q=Clinica%20Medica%20Pro-Saude%20Macurure%20BA&output=embed"
              loading="lazy"
            />
          </div>
        </section>

        <section id="duvidas" className="ps-faq">
          <div className="faq-intro">
            <span className="section-eyebrow">Dúvidas frequentes</span>
            <h2>Tem alguma dúvida?</h2>
            <p>
              Reunimos respostas rápidas para facilitar seu atendimento. Se precisar, fale diretamente com nossa
              equipe.
            </p>
            <Button>Tirar minha dúvida</Button>
          </div>
          <div className="faq-list">
            {faqs.map((q, i) => (
              <div className={`faq-item ${faq === i ? "open" : ""}`} key={q}>
                <button onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i}>
                  <span>0{i + 1}</span>
                  <b>{q}</b>
                  <ChevronDown />
                </button>
                {faq === i && (
                  <p>
                    Fale com nossa equipe pelo WhatsApp para receber todas as orientações de acordo com o seu
                    atendimento.
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-top">
          <div>
            <Logo />
            <p>Saúde, confiança e acolhimento para Macururé e toda a família.</p>
          </div>
          <div>
            <h3>Links rápidos</h3>
            {navLinks.slice(0, 5).map(([label, href]) => (
              <a key={label} href={href}>
                {label}
              </a>
            ))}
          </div>
          <div>
            <h3>Contato</h3>
            <a href={wa} target="_blank" rel="noreferrer">
              <Phone /> (75) 9701-8423
            </a>
            <span>
              <MapPin /> Macururé - BA — Em frente ao Hospital Municipal
            </span>
            <a href="https://instagram.com/prosaude.macurure" target="_blank" rel="noreferrer">
              <Instagram /> @prosaude.macurure
            </a>
          </div>
          <div>
            <h3>Nossa missão</h3>
            <p>“Cuidar de você e da sua família com respeito, ética e acolhimento, em todas as fases da vida.”</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Clínica Médica Pró-Saúde. Todos os direitos reservados.</span>
          <span>Política de Privacidade | Termos de Uso</span>
        </div>
      </footer>

      <a
        className="floating-wa"
        href={wa}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar com a Pró-Saúde pelo WhatsApp"
      >
        <img src={waIcon.url} alt="WhatsApp" />
      </a>
    </div>
  );
}
