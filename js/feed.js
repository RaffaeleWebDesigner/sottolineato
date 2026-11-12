// Il feed: costruzione delle schede e caricamento a blocchi mentre si scorre.
import { el, bottoneAzione } from "./dom.js";
import { t } from "./i18n.js";
import { LIBRI, mixVario, semeDelGiorno, testoPronto } from "./dati.js";
import { makeQuiz, quizLibro } from "./quiz.js";
import { salvata, alternaSalvata, impara } from "./salvataggi.js";

const BLOCCO = 25;
const ICONS = {
  save: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
  quiz: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/></svg>',
  copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
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

let feed;
let seme = semeDelGiorno();
let observer, loader;
let ultimaLista = [], ultimoVuotoSalvate = false;
let listaInVista = [];
let riempi = null; // continua a creare le schede quando arrivano altri testi

export function inizializzaFeed() {
  feed = document.getElementById("feed");
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowDown" || e.key === "j") { e.preventDefault(); feed.scrollBy({ top: feed.clientHeight, behavior: "smooth" }); }
    if (e.key === "ArrowUp" || e.key === "k") { e.preventDefault(); feed.scrollBy({ top: -feed.clientHeight, behavior: "smooth" }); }
  });
}

// Nuovo ordine casuale per le stesse schede.
export function rimescola() { seme = Math.floor(Math.random() * 1e9); renderFeed(ultimaLista, ultimoVuotoSalvate); }

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

function card(f, idx, tot) {
  const { tipi, verdetti } = testiFeed();
  const slide = el("section", "slide");
  const c = el("article", "card tipo-" + f.tipo);
  c.style.setProperty("--tint", `var(--t-${f.temaId})`);
  const head = el("div", "card-head");
  const label = el("span", "label");
  label.append(el("span", "kind", tipi[f.tipo]), document.createTextNode(t("scheda.separatore") + f.tema));
  head.append(label, el("span", "count", t("scheda.contatore", { n: idx + 1, tot })));

  const body = el("div", "body");
  body.appendChild(mainNode(f));
  let copyText;

  if (LIBRI.has(f.tipo)) {
    if (f.tipo === "parola") body.appendChild(el("p", "def", f.def));
    const extra = f.tipo === "frase" ? (f.trad ? t("scheda.traduzione_nostra") : "") : f.tipo === "idea" ? t("scheda.parole_nostre") : "";
    const src = sourceNode(f, extra); src.classList.add("reveal");
    body.append(src, el("p", "note reveal", f.nota));
    const valori = { testo: f.testo.replace(/\n/g, " "), def: f.def, autore: f.autore, opera: f.opera };
    copyText = f.tipo === "frase" ? t("copia.frase", valori) : f.tipo === "parola" ? t("copia.parola", valori) : t("copia.libro", { ...valori, testo: f.testo });
  } else if (f.tipo === "storica") {
    body.appendChild(sourceNode(f));
    const [vt, vk, vFrase] = verdetti[f.verdetto];
    const res = el("div", "reveal"); res.append(badge(vt, vk), el("p", "note", f.nota));
    body.appendChild(res);
    const scelte = [verdetti.vera[0], verdetti.attribuita[0], verdetti.mai[0]];
    body.appendChild(makeQuiz(c, t("quiz.domanda_storica"), scelte, vt, {
      onRight: () => impara(f.id), rightText: t("quiz.esatto"), wrongText: t("quiz.sbagliato_storica", { verdetto: vFrase }),
    }));
    c.classList.add("quizzing");
    copyText = t("copia.storica", { testo: f.testo, autore: f.autore, verdetto: vFrase, nota: f.nota });
  } else if (f.tipo === "mondo" || f.tipo === "mito") {
    const mito = f.tipo === "mito";
    const opzioni = mito ? [t("quiz.e_vero"), t("quiz.e_un_mito")] : [t("quiz.vero"), t("quiz.falso")];
    const giusta = f.vero ? opzioni[0] : opzioni[1];
    const etichetta = mito ? (f.vero ? t("quiz.confermato") : t("quiz.mito_sfatato")) : giusta;
    const sbagliato = mito ? (f.vero ? t("quiz.sbagliato_mito_vero") : t("quiz.sbagliato_mito_falso")) : (f.vero ? t("quiz.sbagliato_vero") : t("quiz.sbagliato_falso"));
    const res = el("div", "reveal"); res.append(badge(etichetta, f.vero ? "good" : "bad"), el("p", "note", f.nota));
    body.appendChild(res);
    body.appendChild(makeQuiz(c, mito ? t("quiz.domanda_mito") : t("quiz.domanda_mondo"), opzioni, giusta, {
      onRight: () => impara(f.id), rightText: t("quiz.esatto"), wrongText: sbagliato,
    }));
    c.classList.add("quizzing");
    copyText = t("copia.mondo", { testo: f.testo, risposta: etichetta, nota: f.nota });
  } else if (f.tipo === "brillante") {
    body.appendChild(el("p", "def", f.def));
    const sp = el("div", "spunto");
    sp.append(el("span", "spunto-label", t("scheda.come_tirarlo_fuori")), el("p", null, t("scheda.spunto", { spunto: f.spunto })));
    body.append(sp, el("p", "note", f.nota));
    if (f.autore) body.appendChild(sourceNode(f));
    copyText = f.spunto;
  }

  const actions = el("div", "actions");
  const bSave = bottoneAzione(ICONS.save, t("azioni.salva"));
  const syncSave = () => { const on = salvata(f.id); bSave.setAttribute("aria-pressed", String(on)); bSave.lastChild.textContent = on ? t("azioni.salvata") : t("azioni.salva"); };
  syncSave();
  bSave.addEventListener("click", () => { alternaSalvata(f.id); syncSave(); });
  actions.appendChild(bSave);

  if (LIBRI.has(f.tipo) && f.tipo !== "sapevi") {
    const bQuiz = bottoneAzione(ICONS.quiz, t("azioni.mettimi_alla_prova"));
    bQuiz.addEventListener("click", () => {
      body.querySelector(".quiz")?.remove();
      const quiz = quizLibro(c, f);
      body.appendChild(quiz); c.classList.add("quizzing");
      quiz.querySelector(".opt").focus({ preventScroll: true });
    });
    actions.appendChild(bQuiz);
  }

  const copyLabel = f.tipo === "brillante" ? t("azioni.copia_frase") : t("azioni.copia");
  const bCopy = bottoneAzione(ICONS.copy, copyLabel);
  bCopy.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(copyText); bCopy.lastChild.textContent = t("azioni.copiata"); }
    catch { const r = document.createRange(); r.selectNodeContents(body.querySelector(".q")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); bCopy.lastChild.textContent = t("azioni.testo_selezionato"); }
    setTimeout(() => { bCopy.lastChild.textContent = copyLabel; }, 1800);
  });
  actions.appendChild(bCopy);

  c.append(head, body, actions);
  slide.appendChild(c);
  return slide;
}

// Tipo della prima scheda in vista: i suoi testi vanno caricati per primi.
export const tipoInCima = () => listaInVista[0]?.tipo;

// Chiamata quando arriva un file di testi: crea le schede che lo aspettavano.
export function continuaFeed() { riempi?.(); }

function slideMessaggio(titolo, testo) {
  const s = el("section", "slide"); const e = el("div", "card empty");
  e.append(el("strong", null, titolo), el("span", null, testo));
  s.appendChild(e); return s;
}

export function mostraErrore() {
  observer?.disconnect(); loader?.disconnect(); riempi = null;
  feed.replaceChildren(slideMessaggio(t("errori.caricamento_titolo"), t("errori.caricamento_testo")));
}

// listaFiltrata: le schede già filtrate; vuotoSalvate: se la lista vuota va spiegata come «nessuna salvata».
export function renderFeed(listaFiltrata, vuotoSalvate) {
  ultimaLista = listaFiltrata; ultimoVuotoSalvate = vuotoSalvate;
  const lista = listaInVista = mixVario(listaFiltrata, seme);

  observer?.disconnect(); loader?.disconnect(); riempi = null;
  feed.replaceChildren(); feed.scrollTop = 0;
  if (!lista.length) {
    feed.appendChild(vuotoSalvate ? slideMessaggio(t("vuoto.salvate_titolo"), t("vuoto.salvate_testo")) : slideMessaggio(t("vuoto.titolo"), t("vuoto.testo")));
    return;
  }
  // Le schede si creano a blocchi mentre si scorre, così la pagina resta leggera anche con migliaia di schede.
  // Una scheda si crea solo quando sono arrivati i suoi testi; fino ad allora il feed si ferma lì.
  observer = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.querySelector(".card").classList.add("seen"); }), { root: feed, threshold: .6 });
  let fatte = 0, richieste = 0;
  const sentinella = el("div", "sentinella");
  const attesa = slideMessaggio(t("caricamento.titolo"), t("caricamento.testo"));
  riempi = () => {
    for (; fatte < richieste && testoPronto(lista[fatte]); fatte++) {
      const s = card(lista[fatte], fatte, lista.length); feed.insertBefore(s, sentinella); observer.observe(s);
      if (fatte === 0) { attesa.remove(); requestAnimationFrame(() => feed.querySelector(".card")?.classList.add("seen")); }
    }
    if (fatte >= lista.length) { loader.disconnect(); sentinella.remove(); riempi = null; }
  };
  const prossimoBlocco = () => { richieste = Math.min(richieste + BLOCCO, lista.length); riempi(); };
  feed.append(attesa, sentinella);
  loader = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting) && fatte >= richieste) prossimoBlocco(); }, { root: feed, rootMargin: "300% 0px" });
  prossimoBlocco();
  if (fatte < lista.length) loader.observe(sentinella);
}
