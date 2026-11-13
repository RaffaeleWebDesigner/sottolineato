// Una scheda: costruzione dell'articolo con testo, quiz, spiegazione e azioni.
//
// Nei quiz (Vero o falso, Miti, Citazioni storiche, «Mettimi alla prova» sui libri) prima della risposta il DOM contiene
// solo tipo, frase principale, domanda e pulsanti. Nota, bollino e fonte vengono creati dopo la risposta:
// non esistono né sfocati né nascosti, quindi nessun indizio per lettori di schermo, selezione del testo o «Copia».
import { el, bottoneAzione } from "./dom.js";
import { t } from "./i18n.js";
import { LIBRI } from "./dati.js";
import { creaQuiz, opzioniLibro, rispostaDiSessione } from "./quiz.js";
import { salvata, alternaSalvata } from "./salvataggi.js";
import { effettoRisposta, movimentoRidotto } from "./effetti.js";
import { condividi } from "./condividi.js";

const ICONS = {
  save: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
  quiz: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/></svg>',
  copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
  share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V3M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>',
};

// Testi che dipendono dalla lingua: si leggono solo dopo aver caricato le traduzioni.
let testi;
function testiFeed() {
  return testi ??= {
    tipi: {
      frase: t("tipi.frase"), idea: t("tipi.idea"), parola: t("tipi.parola"), sapevi: t("tipi.sapevi"),
      storica: t("tipi.storica"), mondo: t("tipi.mondo"), mito: t("tipi.mito"), brillante: t("tipi.brillante"),
    },
    // [nome sul badge, colore, forma nella frase «No: …»]
    verdetti: {
      vera: [t("verdetti.vera"), "good", t("verdetti_frase.vera")],
      attribuita: [t("verdetti.attribuita"), "mid", t("verdetti_frase.attribuita")],
      mai: [t("verdetti.mai"), "bad", t("verdetti_frase.mai")],
    },
  };
}

function mainNode(f) {
  const cls = {
    frase: "q", storica: "q", idea: "q idea", brillante: "q idea", parola: "q parola", sapevi: "q sapevi", mondo: "q sapevi", mito: "q sapevi",
  }[f.tipo];
  const q = el(f.tipo === "frase" || f.tipo === "storica" ? "blockquote" : "p", cls);
  if (f.tipo !== "parola" && f.testo.length > 110) q.classList.add("long");
  const i = f.testo.indexOf(f.hl);
  const parts = i < 0 ? [[f.testo, false]] : [[f.testo.slice(0, i), false], [f.hl, true], [f.testo.slice(i + f.hl.length), false]];
  for (const [txt, hl] of parts) {
    const host = hl ? el("mark") : document.createDocumentFragment();
    txt.split("\n").forEach((line, k) => { if (k) host.appendChild(document.createElement("br")); host.appendChild(document.createTextNode(line)); });
    q.appendChild(host);
  }
  return q;
}

function sourceNode(f, extra) {
  const sep = t("scheda.separatore");
  const src = el("p", "src");
  src.append(el("b", null, f.autore));
  if (f.opera) src.append(document.createTextNode(sep), el(LIBRI.has(f.tipo) ? "i" : "span", null, f.opera));
  const meta = [f.rif, f.anno, extra].filter(Boolean).join(sep);
  if (meta) src.append(el("small", null, meta));
  return src;
}

function badge(text, kind) { return el("span", "badge " + kind, text); }

// La spiegazione entra dal basso (300 ms); con movimento ridotto compare e basta.
function mostraSpiegazione(body, spiega, prima, animato) {
  body.insertBefore(spiega, prima);
  if (!animato) return;
  if (!movimentoRidotto()) { spiega.classList.add("entra"); spiega.addEventListener("animationend", () => spiega.classList.remove("entra"), { once: true }); }
  requestAnimationFrame(() => { if (body.scrollHeight > body.clientHeight) body.scrollTo({ top: body.scrollHeight, behavior: movimentoRidotto() ? "auto" : "smooth" }); });
}

// La scritta grande in cima: «Esatto!» con un leggero rimbalzo, «Sbagliato» in rosso.
function scrittaEsito(giusto, animato) {
  const s = el("strong", "esito-testo " + (giusto ? "giusto" : "sbagliato"), giusto ? t("quiz.esatto") : t("quiz.sbagliato"));
  // La classe si toglie a fine animazione, così non riparte quando la vista torna a mostrarsi.
  if (animato && giusto && !movimentoRidotto()) { s.classList.add("rimbalza"); s.addEventListener("animationend", () => s.classList.remove("rimbalza"), { once: true }); }
  return s;
}

// opzioni.modo: "feed", "ripasso" o "aperta". Nel ripasso le domande tornano sempre senza risposta.
export function creaCard(f, idx, tot, { modo = "feed", delGiorno = false } = {}) {
  const { tipi, verdetti } = testiFeed();
  const c = el("article", "card tipo-" + f.tipo);
  c.style.setProperty("--tint", `var(--t-${f.temaId})`);
  const head = el("div", "card-head");
  const label = el("span", "label");
  label.append(el("span", "kind", tipi[f.tipo]), document.createTextNode(t("scheda.separatore") + f.tema));
  const destra = el("span", "destra");
  if (delGiorno) destra.append(el("span", "del-giorno", t("scheda.del_giorno")));
  if (tot) destra.append(el("span", "count", t("scheda.contatore", { n: idx + 1, tot })));
  head.append(label, destra);

  const body = el("div", "body");
  const esitoEl = el("div", "esito"); esitoEl.setAttribute("aria-live", "polite");
  body.append(esitoEl, mainNode(f));
  // Cosa si copia: prima della risposta non c'è la risposta.
  let risposta = false;
  let copia = () => "";
  const precedente = modo === "ripasso" ? undefined : rispostaDiSessione(f.id);

  if (LIBRI.has(f.tipo)) {
    if (f.tipo === "parola") body.appendChild(el("p", "def", f.def));
    const extra = f.tipo === "frase" ? (f.trad ? t("scheda.traduzione_nostra") : "") : f.tipo === "idea" ? t("scheda.parole_nostre") : "";
    const src = sourceNode(f, extra), nota = el("p", "note", f.nota);
    body.append(src, nota);
    const valori = { testo: f.testo.replace(/\n/g, " "), def: f.def, autore: f.autore, opera: f.opera };
    const completo = f.tipo === "frase" ? t("copia.frase", valori) : f.tipo === "parola" ? t("copia.parola", valori) : t("copia.libro", { ...valori, testo: f.testo });
    const parziale = f.tipo === "frase" ? t("copia.frase_quiz", valori) : f.tipo === "parola" ? t("copia.parola_quiz", valori) : t("copia.libro_quiz", { testo: f.testo });
    let inQuiz = false;
    copia = () => (inQuiz && !risposta ? parziale : completo);
    c._avviaQuiz = () => {
      body.querySelector(".quiz")?.remove(); body.querySelector(".spiega")?.remove(); esitoEl.replaceChildren();
      src.remove(); nota.remove(); inQuiz = true; risposta = false;
      const quiz = creaQuiz({
        id: f.id, ...opzioniLibro(f),
        alRisposta({ giusto, animato, bottone, dettaglio }) {
          risposta = true;
          esitoEl.replaceChildren(scrittaEsito(giusto, animato));
          dettaglio.textContent = giusto ? t("quiz.imparata") : t("quiz.sbagliato_libro", { opera: f.opera });
          const spiega = el("div", "spiega"); spiega.append(src, nota);
          mostraSpiegazione(body, spiega, quiz, animato);
          if (animato) effettoRisposta(c, giusto, bottone);
        },
      });
      body.appendChild(quiz);
      quiz.querySelector(".opt").focus({ preventScroll: true });
    };
  } else if (f.tipo === "storica" || f.tipo === "mondo" || f.tipo === "mito") {
    let cfg, spiegazione, parziale, completo;
    if (f.tipo === "storica") {
      const [vt, vk, vFrase] = verdetti[f.verdetto];
      cfg = {
        domanda: t("quiz.domanda_storica", { autore: f.autore }), opzioni: [verdetti.vera[0], verdetti.attribuita[0], verdetti.mai[0]], giusta: vt,
        dettaglio: t("quiz.sbagliato_storica", { verdetto: vFrase }),
      };
      spiegazione = () => { const d = el("div", "spiega"); d.append(badge(vt, vk), el("p", "note", f.nota), sourceNode(f)); return d; };
      parziale = t("copia.storica_quiz", { testo: f.testo, autore: f.autore });
      completo = t("copia.storica", { testo: f.testo, autore: f.autore, verdetto: vFrase, nota: f.nota });
    } else {
      const mito = f.tipo === "mito";
      const opzioni = mito ? [t("quiz.e_vero"), t("quiz.e_un_mito")] : [t("quiz.vero"), t("quiz.falso")];
      const giusta = f.vero ? opzioni[0] : opzioni[1];
      const etichetta = mito ? (f.vero ? t("quiz.confermato") : t("quiz.mito_sfatato")) : giusta;
      const domanda = mito ? t("quiz.domanda_mito") : t("quiz.domanda_mondo");
      cfg = {
        domanda, opzioni, giusta,
        dettaglio: mito ? (f.vero ? t("quiz.sbagliato_mito_vero") : t("quiz.sbagliato_mito_falso")) : (f.vero ? t("quiz.sbagliato_vero") : t("quiz.sbagliato_falso")),
      };
      spiegazione = () => { const d = el("div", "spiega"); d.append(badge(etichetta, f.vero ? "good" : "bad"), el("p", "note", f.nota)); return d; };
      parziale = t("copia.domanda", { testo: f.testo, domanda });
      completo = t("copia.mondo", { testo: f.testo, risposta: etichetta, nota: f.nota });
    }
    copia = () => (risposta ? completo : parziale);
    const quiz = creaQuiz({
      id: f.id, domanda: cfg.domanda, opzioni: cfg.opzioni, giusta: cfg.giusta,
      alRisposta({ giusto, animato, bottone, dettaglio }) {
        risposta = true;
        esitoEl.replaceChildren(scrittaEsito(giusto, animato));
        dettaglio.textContent = giusto ? "" : cfg.dettaglio;
        mostraSpiegazione(body, spiegazione(), quiz, animato);
        if (animato) effettoRisposta(c, giusto, bottone);
      },
    });
    body.appendChild(quiz);
    if (precedente != null) quiz.mostraRisposta(precedente); // già risposto in questa sessione: aperto, senza effetti
  } else if (f.tipo === "brillante") {
    body.appendChild(el("p", "def", f.def));
    const sp = el("div", "spunto");
    sp.append(el("span", "spunto-label", t("scheda.come_tirarlo_fuori")), el("p", null, t("scheda.spunto", { spunto: f.spunto })));
    body.append(sp, el("p", "note", f.nota));
    if (f.autore) body.appendChild(sourceNode(f));
    copia = () => f.spunto;
  }

  const actions = el("div", "actions");
  const bSave = bottoneAzione(ICONS.save, t("azioni.salva"));
  const syncSave = () => { const on = salvata(f.id); bSave.setAttribute("aria-pressed", String(on)); bSave.lastChild.textContent = on ? t("azioni.salvata") : t("azioni.salva"); };
  syncSave();
  bSave.addEventListener("click", () => { alternaSalvata(f.id); syncSave(); });
  actions.appendChild(bSave);

  if (c._avviaQuiz) {
    const bQuiz = bottoneAzione(ICONS.quiz, t("azioni.mettimi_alla_prova"));
    bQuiz.addEventListener("click", c._avviaQuiz);
    actions.appendChild(bQuiz);
  }

  const copyLabel = f.tipo === "brillante" ? t("azioni.copia_frase") : t("azioni.copia");
  const bCopy = bottoneAzione(ICONS.copy, copyLabel);
  bCopy.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(copia()); bCopy.lastChild.textContent = t("azioni.copiata"); }
    catch { const r = document.createRange(); r.selectNodeContents(body.querySelector(".q")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); bCopy.lastChild.textContent = t("azioni.testo_selezionato"); }
    setTimeout(() => { bCopy.lastChild.textContent = copyLabel; }, 1800);
  });
  actions.appendChild(bCopy);

  const bShare = bottoneAzione(ICONS.share, t("azioni.condividi"));
  bShare.addEventListener("click", () => condividi(f));
  actions.appendChild(bShare);

  c.append(head, body, actions);
  return c;
}
