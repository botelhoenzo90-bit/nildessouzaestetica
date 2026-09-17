const details: Record<string, { intro: string; steps: string[]; note: string }> = {
  "Limpeza de Pele": {
    intro: "Um cuidado completo para higienizar, renovar e deixar a pele com uma sensação mais limpa, fresca e bem cuidada.",
    steps: ["A pele é higienizada e preparada para o atendimento.", "O profissional avalia a pele e realiza as etapas de limpeza adequadas ao seu momento.", "O cuidado é finalizado com produtos escolhidos para deixar a pele confortável e bem cuidada."],
    note: "As etapas podem variar de acordo com a avaliação da pele e com a necessidade de cada atendimento.",
  },
  "Design de Sobrancelhas": {
    intro: "Um design pensado para valorizar o formato natural das suas sobrancelhas e harmonizar o olhar.",
    steps: ["É feita uma avaliação do formato do rosto e das sobrancelhas.", "O desenho é definido respeitando os seus traços e o resultado desejado.", "Os fios são modelados e o acabamento é feito para deixar o olhar mais definido e equilibrado."],
    note: "O objetivo é valorizar seus próprios traços, sem perder a naturalidade do olhar.",
  },
  "Massagem Relaxante": {
    intro: "Um momento para desacelerar e aproveitar uma experiência corporal focada em conforto, relaxamento e bem-estar.",
    steps: ["O atendimento começa com uma conversa rápida para entender como você está se sentindo.", "São realizados movimentos manuais suaves e ritmados, adaptados ao seu conforto.", "O atendimento termina de forma tranquila, para que você aproveite a sensação de pausa e cuidado."],
    note: "A intensidade e as regiões trabalhadas podem ser ajustadas conforme o atendimento e o seu conforto.",
  },
  "Ventosaterapia": {
    intro: "Uma prática complementar que utiliza ventosas sobre a pele, criando uma sucção controlada durante o atendimento.",
    steps: ["A região é preparada e o profissional define os pontos de aplicação.", "As ventosas são posicionadas com uma sucção ajustada ao atendimento.", "Após a retirada das ventosas, a pele é observada e o cuidado é finalizado com tranquilidade."],
    note: "É comum que algumas pessoas apresentem marcas temporárias após a aplicação. A intensidade é sempre ajustada ao atendimento.",
  },
  "Peeling": {
    intro: "Um cuidado de renovação da pele realizado com um agente esfoliante escolhido de acordo com a avaliação e o objetivo do atendimento.",
    steps: ["A pele é higienizada e avaliada antes da aplicação.", "O produto é aplicado de maneira controlada, respeitando a pele e o protocolo escolhido.", "O atendimento é finalizado com os cuidados adequados e orientações para a rotina após o procedimento."],
    note: "O tipo de peeling e a forma de aplicação dependem da avaliação profissional e das características da pele.",
  },
  "Auriculoterapia": {
    intro: "Uma prática complementar que utiliza pontos específicos da orelha como parte de uma experiência de cuidado e equilíbrio.",
    steps: ["O atendimento começa com uma conversa para entender o seu momento e o objetivo do cuidado.", "Os pontos são avaliados e selecionados pelo profissional.", "A estimulação é realizada conforme a técnica escolhida, com atenção ao conforto durante todo o atendimento."],
    note: "A auriculoterapia é apresentada aqui como prática complementar de bem-estar e não substitui avaliação ou tratamento médico.",
  },
  "Drenagem Linfática": {
    intro: "Uma massagem com movimentos suaves e ritmados, pensada para proporcionar uma sensação de leveza e bem-estar corporal.",
    steps: ["O profissional conversa com você e identifica as regiões que serão trabalhadas.", "São realizados movimentos leves, lentos e direcionados ao longo do atendimento.", "A sessão termina de forma tranquila, valorizando a sensação de conforto e leveza."],
    note: "A técnica e as regiões trabalhadas são adaptadas ao atendimento e às condições apresentadas no momento da sessão.",
  },
  "Brow Lamination": {
    intro: "Um cuidado que alinha e direciona os fios das sobrancelhas, criando um efeito penteado e organizado que valoriza o formato natural.",
    steps: ["As sobrancelhas são preparadas e os fios são posicionados na direção desejada.", "É aplicado um protocolo específico para ajudar a manter os fios alinhados.", "O atendimento é finalizado com a organização dos fios e o acabamento da sobrancelha."],
    note: "O resultado varia conforme a estrutura dos fios e os cuidados após o procedimento.",
  },
  "Clareamento de Virilhas, Axilas e Face": {
    intro: "Um cuidado estético voltado para regiões que podem apresentar diferenças de tonalidade, com protocolo definido após avaliação da pele.",
    steps: ["A pele da região escolhida é avaliada para entender o estado atual e o cuidado mais adequado.", "O protocolo é realizado com produtos e etapas definidos de acordo com a avaliação profissional.", "São dadas orientações de cuidados para preservar a pele e acompanhar a evolução do tratamento."],
    note: "O protocolo e a frequência das sessões variam conforme a avaliação da pele. Resultados podem variar de pessoa para pessoa.",
  },
};

const escapeHtml = (value: string) => {
  const replacements: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '\"': "&quot;", "'": "&#039;" };
  return value.replace(/[&<>\"']/g, (char) => replacements[char] ?? char);
};

function openProcedureModal(name: string) {
  const item = details[name];
  if (!item || document.querySelector(".procedure-detail-backdrop")) return;

  const backdrop = document.createElement("div");
  backdrop.className = "procedure-detail-backdrop";
  backdrop.innerHTML = `
    <section class="procedure-detail-modal" role="dialog" aria-modal="true" aria-labelledby="procedure-detail-title">
      <button class="procedure-detail-close" type="button" aria-label="Fechar explicação">×</button>
      <div class="procedure-detail-topline"><span>Conheça este cuidado</span><i>✦</i></div>
      <span class="procedure-detail-tag">Nildes Souza Estética</span>
      <h2 id="procedure-detail-title">${escapeHtml(name)}</h2>
      <p class="procedure-detail-intro">${escapeHtml(item.intro)}</p>
      <div class="procedure-detail-section">
        <span class="procedure-detail-label">Como funciona</span>
        <div class="procedure-detail-steps">
          ${item.steps.map((step, index) => `<div class="procedure-detail-step"><span>0${index + 1}</span><p>${escapeHtml(step)}</p></div>`).join("")}
        </div>
      </div>
      <div class="procedure-detail-note"><span>✦</span><p>${escapeHtml(item.note)}</p></div>
      <a class="procedure-detail-cta" href="#agendamento">Quero agendar este cuidado <span>↗</span></a>
    </section>
  `;

  document.body.appendChild(backdrop);
  document.body.classList.add("procedure-modal-open");
  requestAnimationFrame(() => backdrop.classList.add("is-visible"));

  const close = () => {
    backdrop.classList.remove("is-visible");
    document.body.classList.remove("procedure-modal-open");
    window.setTimeout(() => backdrop.remove(), 220);
  };

  backdrop.querySelector(".procedure-detail-close")?.addEventListener("click", close);
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) close();
    if ((event.target as HTMLElement).closest(".procedure-detail-cta")) close();
  });
  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      close();
      document.removeEventListener("keydown", onKey);
    }
  };
  document.addEventListener("keydown", onKey);
}

function decorateCards() {
  document.querySelectorAll<HTMLElement>(".procedure-card").forEach((card) => {
    const title = card.querySelector("h3")?.textContent?.trim();
    if (!title || !details[title]) return;

    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Ver como funciona ${title}`);
    card.style.cursor = "pointer";

    card.onclick = (event) => {
      const target = event.target as HTMLElement;
      if (target.closest("a")) return;
      openProcedureModal(title);
    };

    card.onkeydown = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProcedureModal(title);
      }
    };
  });
}

function initProcedureDetails() {
  if (typeof document === "undefined") return;

  if (!document.getElementById("procedure-detail-styles")) {
    const style = document.createElement("style");
    style.id = "procedure-detail-styles";
    style.textContent = `
      .procedure-card{cursor:pointer}
      .procedure-card:focus-visible{outline:3px solid rgba(201,101,130,.55);outline-offset:4px}
      body.procedure-modal-open{overflow:hidden}
      .procedure-detail-backdrop{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:16px;background:rgba(53,37,43,.68);backdrop-filter:blur(9px);opacity:0;transition:opacity .22s ease}
      .procedure-detail-backdrop.is-visible{opacity:1}
      .procedure-detail-modal{position:relative;width:min(680px,100%);max-height:calc(100vh - 32px);overflow:hidden;padding:28px clamp(22px,4vw,42px) 24px;border:1px solid rgba(179,77,107,.18);border-radius:28px;background:linear-gradient(145deg,#fffdfc 0%,#fff6f8 100%);box-shadow:0 30px 80px rgba(45,20,30,.28);transform:translateY(14px) scale(.98);transition:transform .25s ease}
      .procedure-detail-backdrop.is-visible .procedure-detail-modal{transform:translateY(0) scale(1)}
      .procedure-detail-close{position:absolute;right:14px;top:13px;width:38px;height:38px;border:1px solid rgba(118,36,63,.12);border-radius:50%;background:rgba(255,255,255,.82);color:#76243f;font-size:25px;line-height:1;cursor:pointer;transition:.2s}
      .procedure-detail-close:hover{transform:rotate(8deg);background:#fff}
      .procedure-detail-topline{display:flex;align-items:center;gap:8px;color:#b34d6b;font-size:8px;font-weight:900;letter-spacing:2px;text-transform:uppercase}
      .procedure-detail-topline i{font-style:normal;color:#efb6c4}
      .procedure-detail-tag{display:inline-flex;margin-top:11px;padding:6px 10px;border-radius:999px;background:#fbedf0;color:#963653;font-size:8px;font-weight:900;letter-spacing:1px;text-transform:uppercase}
      .procedure-detail-modal h2{max-width:570px;margin-top:10px;color:#5d1d32;font:clamp(30px,4.3vw,45px)/.98 Georgia,"Times New Roman",serif;letter-spacing:-1px}
      .procedure-detail-intro{max-width:570px;margin-top:11px;color:#76666c;font-size:12.5px;line-height:1.52}
      .procedure-detail-section{margin-top:18px;padding-top:16px;border-top:1px solid #ead9de}
      .procedure-detail-label{color:#76243f;font-size:9px;font-weight:900;letter-spacing:1.8px;text-transform:uppercase}
      .procedure-detail-steps{display:grid;gap:0;margin-top:6px}
      .procedure-detail-step{display:grid;grid-template-columns:29px 1fr;gap:10px;align-items:start;padding:8px 0;border-bottom:1px solid rgba(234,217,222,.75)}
      .procedure-detail-step:last-child{border-bottom:0}
      .procedure-detail-step>span{width:25px;height:25px;display:grid;place-items:center;border-radius:50%;background:#f5d4dc;color:#76243f;font:10px Georgia,serif}
      .procedure-detail-step p{padding-top:3px;color:#5e4a51;font-size:11px;line-height:1.42}
      .procedure-detail-note{display:flex;gap:9px;margin-top:11px;padding:10px 12px;border:1px solid rgba(179,77,107,.13);border-radius:14px;background:rgba(255,255,255,.66)}
      .procedure-detail-note>span{color:#b34d6b;font-size:11px}
      .procedure-detail-note p{color:#806d73;font-size:9px;line-height:1.4}
      .procedure-detail-cta{display:flex;align-items:center;justify-content:center;gap:8px;height:45px;margin-top:13px;padding:0 18px;border-radius:999px;background:#963653;color:#fff;font-size:11px;font-weight:900;box-shadow:0 10px 22px rgba(150,54,83,.18);transition:.2s}
      .procedure-detail-cta:hover{background:#76243f;transform:translateY(-2px)}
      @media(max-width:600px){.procedure-detail-backdrop{padding:10px}.procedure-detail-modal{max-height:calc(100vh - 20px);padding:24px 18px 18px;border-radius:22px}.procedure-detail-close{right:10px;top:9px;width:34px;height:34px;font-size:23px}.procedure-detail-topline{font-size:7px}.procedure-detail-tag{margin-top:8px;padding:5px 8px;font-size:7px}.procedure-detail-modal h2{margin-top:8px;font-size:29px}.procedure-detail-intro{margin-top:8px;font-size:11px;line-height:1.45}.procedure-detail-section{margin-top:13px;padding-top:12px}.procedure-detail-step{grid-template-columns:25px 1fr;gap:8px;padding:6px 0}.procedure-detail-step>span{width:22px;height:22px;font-size:9px}.procedure-detail-step p{font-size:10px;line-height:1.35}.procedure-detail-note{margin-top:8px;padding:8px 10px}.procedure-detail-note p{font-size:8px}.procedure-detail-cta{height:42px;margin-top:10px;font-size:10px}}
    `;
    document.head.appendChild(style);
  }

  decorateCards();
  const observer = new MutationObserver(decorateCards);
  observer.observe(document.body, { childList: true, subtree: true });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initProcedureDetails, { once: true });
  else initProcedureDetails();
}
