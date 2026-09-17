type Detail = { intro: string; steps: string[]; note: string };

const details: Record<string, Detail> = {
  "Limpeza de Pele": { intro: "Um cuidado completo para higienizar, renovar e deixar a pele mais limpa, fresca e bem cuidada.", steps: ["A pele é higienizada e preparada para o atendimento.", "A pele é avaliada e são realizadas as etapas adequadas ao seu momento.", "O cuidado é finalizado com produtos escolhidos para deixar a pele confortável e bem cuidada."], note: "As etapas podem variar conforme a avaliação e a necessidade de cada atendimento." },
  "Design de Sobrancelhas": { intro: "Um design pensado para valorizar o formato natural das sobrancelhas e harmonizar o olhar.", steps: ["É feita uma avaliação do formato do rosto e das sobrancelhas.", "O desenho é definido respeitando seus traços e o resultado desejado.", "Os fios são modelados e o acabamento deixa o olhar mais definido e equilibrado."], note: "O objetivo é valorizar seus próprios traços sem perder a naturalidade." },
  "Massagem Relaxante": { intro: "Um momento para desacelerar e aproveitar uma experiência corporal focada em conforto, relaxamento e bem-estar.", steps: ["O atendimento começa com uma conversa rápida sobre como você está se sentindo.", "São realizados movimentos manuais suaves e ritmados, adaptados ao seu conforto.", "O atendimento termina de forma tranquila para você aproveitar a sensação de pausa e cuidado."], note: "A intensidade e as regiões trabalhadas podem ser ajustadas conforme o atendimento." },
  "Ventosaterapia": { intro: "Uma prática complementar que utiliza ventosas sobre a pele, criando uma sucção controlada durante o atendimento.", steps: ["A região é preparada e os pontos de aplicação são definidos.", "As ventosas são posicionadas com uma sucção ajustada ao atendimento.", "Após a retirada, a pele é observada e o cuidado é finalizado com tranquilidade."], note: "Algumas pessoas apresentam marcas temporárias após a aplicação. A intensidade é ajustada ao atendimento." },
  "Peeling": { intro: "Um cuidado de renovação da pele realizado com um agente esfoliante escolhido de acordo com a avaliação e o objetivo do atendimento.", steps: ["A pele é higienizada e avaliada antes da aplicação.", "O produto é aplicado de maneira controlada, respeitando a pele e o protocolo escolhido.", "O atendimento é finalizado com os cuidados e orientações adequados para depois do procedimento."], note: "O tipo de peeling e a aplicação dependem da avaliação profissional e das características da pele." },
  "Auriculoterapia": { intro: "Uma prática complementar que utiliza pontos específicos da orelha como parte de uma experiência de cuidado e equilíbrio.", steps: ["O atendimento começa com uma conversa sobre seu momento e objetivo.", "Os pontos são avaliados e selecionados pelo profissional.", "A estimulação é realizada conforme a técnica escolhida, com atenção ao conforto."], note: "É apresentada como prática complementar de bem-estar e não substitui avaliação ou tratamento médico." },
  "Drenagem Linfática": { intro: "Uma massagem com movimentos suaves e ritmados, pensada para proporcionar uma sensação de leveza e bem-estar corporal.", steps: ["O profissional identifica as regiões que serão trabalhadas.", "São realizados movimentos leves, lentos e direcionados ao longo do atendimento.", "A sessão termina de forma tranquila, valorizando a sensação de conforto e leveza."], note: "A técnica e as regiões trabalhadas são adaptadas ao atendimento." },
  "Brow Lamination": { intro: "Um cuidado que alinha e direciona os fios das sobrancelhas, criando um efeito penteado e organizado.", steps: ["As sobrancelhas são preparadas e os fios são posicionados.", "É aplicado um protocolo específico para ajudar a manter os fios alinhados.", "O atendimento termina com a organização dos fios e o acabamento da sobrancelha."], note: "O resultado varia conforme a estrutura dos fios e os cuidados após o procedimento." },
  "Clareamento de Virilhas, Axilas e Face": { intro: "Um cuidado estético voltado para regiões que podem apresentar diferenças de tonalidade, com protocolo definido após avaliação da pele.", steps: ["A região escolhida é avaliada para entender o estado atual da pele.", "O protocolo é realizado com produtos e etapas definidos conforme a avaliação.", "São dadas orientações de cuidados para preservar a pele e acompanhar a evolução."], note: "O protocolo e a frequência das sessões variam conforme a avaliação. Resultados podem variar." },
};

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
const escapeHtml = (value: string) => value.replace(/[&<>\"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '\"': "&quot;", "'": "&#039;" }[c] || c));

function procedureFromClick(target: Element): string | null {
  const names = Object.keys(details);
  let node: Element | null = target;
  for (let level = 0; node && level < 12; level++, node = node.parentElement) {
    const text = normalize((node as HTMLElement).innerText || node.textContent || "");
    const match = names.find(name => text.includes(normalize(name)));
    if (match) return match;
  }
  return null;
}

function openProcedure(name: string) {
  if (document.querySelector(".procedure-detail-backdrop")) return;
  const item = details[name];
  if (!item) return;

  const backdrop = document.createElement("div");
  backdrop.className = "procedure-detail-backdrop";
  backdrop.innerHTML = `<section class="procedure-detail-modal" role="dialog" aria-modal="true">
    <button class="procedure-detail-close" type="button" aria-label="Fechar">×</button>
    <div class="procedure-detail-topline">CONHEÇA ESTE CUIDADO <b>✦</b></div>
    <span class="procedure-detail-tag">Nildes Souza Estética</span>
    <h2>${escapeHtml(name)}</h2>
    <p class="procedure-detail-intro">${escapeHtml(item.intro)}</p>
    <div class="procedure-detail-section"><span class="procedure-detail-label">COMO FUNCIONA</span><div class="procedure-detail-steps">
      ${item.steps.map((step, i) => `<div class="procedure-detail-step"><strong>0${i + 1}</strong><p>${escapeHtml(step)}</p></div>`).join("")}
    </div></div>
    <div class="procedure-detail-note"><b>✦</b><p>${escapeHtml(item.note)}</p></div>
    <a class="procedure-detail-cta" href="#agendamento">Quero agendar este cuidado <span>↗</span></a>
  </section>`;

  document.body.appendChild(backdrop);
  document.body.classList.add("procedure-modal-open");
  requestAnimationFrame(() => backdrop.classList.add("is-visible"));

  const close = () => { backdrop.classList.remove("is-visible"); document.body.classList.remove("procedure-modal-open"); setTimeout(() => backdrop.remove(), 180); };
  backdrop.querySelector(".procedure-detail-close")?.addEventListener("click", close);
  backdrop.addEventListener("click", e => { if (e.target === backdrop) close(); });
  backdrop.querySelector(".procedure-detail-cta")?.addEventListener("click", close);
  const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { close(); document.removeEventListener("keydown", esc); } };
  document.addEventListener("keydown", esc);
}

function init() {
  if (typeof document === "undefined") return;

  if (!document.getElementById("procedure-detail-styles")) {
    const style = document.createElement("style");
    style.id = "procedure-detail-styles";
    style.textContent = `
      body.procedure-modal-open{overflow:hidden}
      .procedure-detail-backdrop{position:fixed;inset:0;z-index:999999;display:grid;place-items:center;padding:12px;background:rgba(53,37,43,.7);backdrop-filter:blur(8px);opacity:0;transition:opacity .18s ease}
      .procedure-detail-backdrop.is-visible{opacity:1}
      .procedure-detail-modal{position:relative;width:min(760px,calc(100vw - 24px));padding:28px 34px 24px;border-radius:26px;background:linear-gradient(145deg,#fffdfc,#fff4f7);box-shadow:0 30px 90px rgba(45,20,30,.32);transform:scale(.97);transition:transform .2s ease}
      .procedure-detail-backdrop.is-visible .procedure-detail-modal{transform:scale(1)}
      .procedure-detail-close{position:absolute;right:14px;top:13px;width:38px;height:38px;border:1px solid #ead9de;border-radius:50%;background:#fff;color:#76243f;font-size:26px;cursor:pointer}
      .procedure-detail-topline{font-size:9px;font-weight:900;letter-spacing:2px;color:#b34d6b}.procedure-detail-topline b{color:#efb6c4}
      .procedure-detail-tag{display:inline-block;margin-top:11px;padding:6px 10px;border-radius:999px;background:#fbedf0;color:#963653;font-size:8px;font-weight:900;letter-spacing:1px;text-transform:uppercase}
      .procedure-detail-modal h2{margin:10px 0 0;color:#5d1d32;font:clamp(30px,4vw,46px)/1.03 Georgia,serif;letter-spacing:-1px}
      .procedure-detail-intro{max-width:650px;margin:10px 0 0;color:#76666c;font-size:13px;line-height:1.55}
      .procedure-detail-section{margin-top:18px;padding-top:16px;border-top:1px solid #ead9de}.procedure-detail-label{font-size:9px;font-weight:900;letter-spacing:1.8px;color:#76243f}
      .procedure-detail-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:10px}
      .procedure-detail-step{padding:12px;border:1px solid #eedfe3;border-radius:15px;background:#fff9fa}.procedure-detail-step strong{display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:#f5d4dc;color:#76243f;font:11px Georgia,serif}.procedure-detail-step p{margin-top:8px;color:#5e4a51;font-size:11px;line-height:1.5}
      .procedure-detail-note{display:flex;gap:8px;margin-top:12px;padding:10px 12px;border:1px solid #eedfe3;border-radius:13px;background:#fff}.procedure-detail-note b{color:#b34d6b}.procedure-detail-note p{color:#806d73;font-size:9.5px;line-height:1.45}
      .procedure-detail-cta{display:flex;align-items:center;justify-content:center;gap:7px;margin-top:13px;min-height:45px;border-radius:999px;background:#963653;color:#fff;font-size:11px;font-weight:900}
      @media(max-width:650px){.procedure-detail-modal{padding:25px 17px 18px;max-height:calc(100vh - 20px);overflow:auto}.procedure-detail-steps{grid-template-columns:1fr}.procedure-detail-step{display:grid;grid-template-columns:28px 1fr;gap:8px}.procedure-detail-step p{margin:0}.procedure-detail-modal h2{font-size:30px}}
    `;
    document.head.appendChild(style);
  }

  // Capture phase is intentional: cards may be links and the carousel may replace their DOM nodes.
  document.addEventListener("click", event => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target || target.closest(".procedure-detail-backdrop")) return;
    const name = procedureFromClick(target);
    if (!name) return;
    event.preventDefault();
    event.stopPropagation();
    openProcedure(name);
  }, true);
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
}
