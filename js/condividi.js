// Condividere una scheda come immagine (canvas): storia 1080×1920 o post 1080×1350.
// Nei quiz l'immagine mostra solo la domanda, mai la risposta: chi la vede deve aprire l'app per scoprirla.
import { el } from "./dom.js";
import { t } from "./i18n.js";
import { LIBRI } from "./dati.js";

const FORMATI = { storia: [1080, 1920], post: [1080, 1350] };
const MARGINE = 96;
const FONT_QUOTE = '"Newsreader", "Iowan Old Style", Georgia, serif';
const FONT_UI = '"Instrument Sans", system-ui, -apple-system, "Segoe UI", sans-serif';

// Cosa va nell'immagine, in base alla scheda. Per i quiz: tipo, frase e domanda; niente nota, verdetto o fonte.
export function contenutoCondivisione(f) {
  const base = { tipo: "", tema: f.tema, testo: f.testo, hl: f.hl, stile: "ui", extra: [], cta: "" };
  base.tipo = ({ frase: t("tipi.frase"), idea: t("tipi.idea"), parola: t("tipi.parola"), sapevi: t("tipi.sapevi"), storica: t("tipi.storica"), mondo: t("tipi.mondo"), mito: t("tipi.mito"), brillante: t("tipi.brillante") })[f.tipo];
  if (f.tipo === "frase" || f.tipo === "storica") base.stile = "quote";
  if (f.tipo === "parola") base.stile = "parola";
  if (f.tipo === "idea" || f.tipo === "brillante") base.stile = "idea";
  if (f.tipo === "storica") { base.extra.push(t("quiz.domanda_storica", { autore: f.autore })); base.cta = t("condividi.cta_quiz"); }
  else if (f.tipo === "mondo") { base.extra.push(t("quiz.domanda_mondo")); base.cta = t("condividi.cta_quiz"); }
  else if (f.tipo === "mito") { base.extra.push(t("quiz.domanda_mito")); base.cta = t("condividi.cta_quiz"); }
  else if (LIBRI.has(f.tipo)) {
    if (f.tipo === "parola" && f.def) base.extra.push(f.def);
    base.extra.push([f.autore, f.opera].filter(Boolean).join(t("scheda.separatore")));
  } else if (f.tipo === "brillante") { base.extra.push(f.def); if (f.autore) base.extra.push(f.autore); }
  return base;
}

const indirizzoSito = () => (document.querySelector('link[rel="canonical"]')?.href || location.origin + location.pathname).replace(/^https?:\/\//, "").replace(/\/$/, "");
const colore = nome => getComputedStyle(document.documentElement).getPropertyValue(nome).trim();

// Aspetta che i caratteri dell'app siano pronti, ma non più di 3 secondi.
async function aspettaFont() {
  const carica = Promise.all([
    '400 40px "Newsreader"', 'italic 500 40px "Newsreader"', '500 40px "Newsreader"', '500 40px "Instrument Sans"', '600 40px "Instrument Sans"', '700 40px "Instrument Sans"',
  ].map(f => document.fonts.load(f)));
  await Promise.race([carica.then(() => document.fonts.ready), new Promise(r => setTimeout(r, 3000))]);
}

// Va a capo il testo in righe che stanno nella larghezza data; indica quali parole sono evidenziate.
function impagina(g, testo, hl, larghezza) {
  const inizioHl = hl ? testo.indexOf(hl) : -1, fineHl = inizioHl < 0 ? -1 : inizioHl + hl.length;
  const spazio = g.measureText(" ").width;
  const righe = []; let riga = { parole: [], larghezza: 0 }; let cursore = 0;
  const vai = () => { righe.push(riga); riga = { parole: [], larghezza: 0 }; };
  for (const paragrafo of testo.split("\n")) {
    for (const m of paragrafo.matchAll(/\S+/g)) {
      const inizio = cursore + m.index, fine = inizio + m[0].length;
      const w = g.measureText(m[0]).width, evid = inizioHl >= 0 && inizio < fineHl && fine > inizioHl;
      if (riga.parole.length && riga.larghezza + spazio + w > larghezza) vai();
      riga.parole.push({ testo: m[0], x: riga.parole.length ? riga.larghezza + spazio : 0, w, evid });
      riga.larghezza = (riga.parole.length > 1 ? riga.larghezza + spazio : 0) + w;
    }
    cursore += paragrafo.length + 1;
    if (riga.parole.length) vai();
  }
  return righe;
}

const FONT_TESTO = {
  quote: (px) => `400 ${px}px ${FONT_QUOTE}`,
  parola: (px) => `italic 500 ${px}px ${FONT_QUOTE}`,
  idea: (px) => `600 ${px}px ${FONT_UI}`,
  ui: (px) => `500 ${px}px ${FONT_UI}`,
};
const DIMENSIONI = { quote: [96, 44], parola: [200, 90], idea: [88, 44], ui: [84, 42] };

// Disegna la scheda nel canvas.
export async function disegna(canvas, f, formato) {
  const [W, H] = FORMATI[formato];
  canvas.width = W; canvas.height = H;
  await aspettaFont();
  const g = canvas.getContext("2d");
  const c = contenutoCondivisione(f);
  const sfondo = colore(`--t-${f.temaId}`) || colore("--bg"), fg = colore("--fg"), muted = colore("--muted"), marker = colore("--marker");
  g.fillStyle = sfondo; g.fillRect(0, 0, W, H);
  g.textBaseline = "alphabetic";

  // Intestazione: tipo e tema.
  g.fillStyle = muted; g.font = `600 32px ${FONT_UI}`;
  g.fillText((c.tipo + t("scheda.separatore") + c.tema).toUpperCase(), MARGINE, MARGINE + 32);
  // A piè di pagina: nome dell'app (sottolineato a evidenziatore) e indirizzo.
  g.font = `500 56px ${FONT_QUOTE}`; const nome = t("app.nome"), wNome = g.measureText(nome).width;
  const yNome = H - MARGINE - 44;
  g.fillStyle = marker; g.fillRect(MARGINE - 6, yNome - 22, wNome + 12, 24);
  g.fillStyle = fg; g.fillText(nome, MARGINE, yNome);
  g.fillStyle = muted; g.font = `500 30px ${FONT_UI}`; g.fillText(indirizzoSito(), MARGINE, H - MARGINE + 8);

  // Corpo: il testo più grande possibile che sta, con le righe extra sotto, centrato nello spazio libero.
  const larghezza = W - 2 * MARGINE, sopra = MARGINE + 90, sotto = H - MARGINE - 140;
  const spazioCorpo = sotto - sopra;
  const [massimo, minimo] = DIMENSIONI[c.stile];
  const extra = [...c.extra, ...(c.cta ? [c.cta] : [])];
  let px = massimo, righe, extraRighe, altezza;
  const pxExtra = 42, interlinea = 1.22;
  const misura = () => {
    g.font = FONT_TESTO[c.stile](px); righe = impagina(g, c.testo, c.hl, larghezza);
    g.font = `500 ${pxExtra}px ${FONT_UI}`;
    extraRighe = extra.map(e => impagina(g, e, null, larghezza));
    const hExtra = extraRighe.reduce((a, r) => a + r.length * pxExtra * 1.35 + 22, 0);
    altezza = righe.length * px * interlinea + (extra.length ? 52 : 0) + hExtra;
  };
  for (misura(); altezza > spazioCorpo && px > minimo; px -= 4) misura();
  misura();
  let y = sopra + Math.max(0, (spazioCorpo - altezza) / 2);
  g.font = FONT_TESTO[c.stile](px);
  for (const r of righe) {
    const base = y + px * 0.92;
    // evidenziatore: una barra continua dietro le parole consecutive evidenziate
    let i = 0;
    while (i < r.parole.length) {
      if (!r.parole[i].evid) { i++; continue; }
      let j = i; while (j + 1 < r.parole.length && r.parole[j + 1].evid) j++;
      g.fillStyle = marker; g.fillRect(MARGINE + r.parole[i].x - 4, base - px * 0.32, r.parole[j].x + r.parole[j].w - r.parole[i].x + 8, px * 0.4);
      i = j + 1;
    }
    g.fillStyle = fg;
    for (const w of r.parole) g.fillText(w.testo, MARGINE + w.x, base);
    y += px * interlinea;
  }
  y += 52;
  extra.forEach((e, k) => {
    const ultima = c.cta && k === extra.length - 1;
    g.font = `${ultima ? "italic " : ""}500 ${pxExtra}px ${ultima ? FONT_QUOTE : FONT_UI}`;
    g.fillStyle = ultima ? fg : muted;
    for (const r of extraRighe[k]) { y += pxExtra * 1.35; g.fillText(r.parole.map(w => w.testo).join(" "), MARGINE, y - pxExtra * 0.3); }
    y += 22;
  });
  return canvas;
}

const nomeFile = f => `${t("app.nome").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${f.id}.png`;

// La finestra di condivisione: sceglie il formato, mostra l'anteprima e condivide o scarica.
export function condividi(f) {
  const dialogo = el("dialog", "schermo condividi");
  dialogo.setAttribute("aria-label", t("condividi.titolo"));
  let formato = "storia";
  const canvas = el("canvas", "anteprima");
  const chiudi = el("button", "aperta-chiudi", "×"); chiudi.type = "button"; chiudi.setAttribute("aria-label", t("aperta.chiudi")); chiudi.addEventListener("click", () => dialogo.close());
  const formatiEl = el("div", "chips");
  const bottoniFormato = Object.keys(FORMATI).map(k => {
    const b = el("button", "chip", k === "storia" ? t("condividi.storia") : t("condividi.post")); b.type = "button";
    b.addEventListener("click", () => { formato = k; sincronizza(); ridisegna(); });
    formatiEl.append(b); return [k, b];
  });
  const sincronizza = () => bottoniFormato.forEach(([k, b]) => b.setAttribute("aria-pressed", String(k === formato)));
  const stato = el("p", "limite-nota"); stato.setAttribute("aria-live", "polite");
  const azione = el("button", "onb-avanti condividi-azione"); azione.type = "button";
  const prova = new File([""], "x.png", { type: "image/png" });
  const nativa = typeof navigator.canShare === "function" && navigator.canShare({ files: [prova] });
  azione.textContent = nativa ? t("condividi.condividi") : t("condividi.scarica");

  let pronto = false;
  async function ridisegna() {
    pronto = false; azione.disabled = true; stato.textContent = t("condividi.preparo");
    await disegna(canvas, f, formato); pronto = true; azione.disabled = false; stato.textContent = "";
  }
  azione.addEventListener("click", async () => {
    if (!pronto) return;
    const blob = await new Promise(r => canvas.toBlob(r, "image/png"));
    const file = new File([blob], nomeFile(f), { type: "image/png" });
    if (nativa && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: t("app.nome") }); return; }
      catch (e) { if (e.name === "AbortError") return; /* altro errore: si scarica */ }
    }
    const url = URL.createObjectURL(blob); const a = el("a"); a.href = url; a.download = file.name; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000); stato.textContent = t("condividi.scaricata");
  });
  const corpo = el("div", "condividi-corpo");
  corpo.append(el("h2", "titolo-vista", t("condividi.titolo")), formatiEl, canvas, stato, azione);
  const prima = document.activeElement;
  dialogo.append(chiudi, corpo);
  document.body.appendChild(dialogo); dialogo.showModal();
  dialogo.addEventListener("close", () => { dialogo.remove(); prima?.focus?.({ preventScroll: true }); });
  sincronizza(); ridisegna(); chiudi.focus({ preventScroll: true });
}
