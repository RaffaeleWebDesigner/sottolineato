// Navigazione con l'hash: #feed, #esplora, #salvate, #profilo, più #ripasso (feed delle sole salvate) e #pro.
// Ogni vista si registra con registraVista(nome, { mostra, nascondi }); la barra in basso evidenzia la sezione.
const SEZIONE = { feed: "feed", ripasso: "salvate", esplora: "esplora", salvate: "salvate", profilo: "profilo", pro: "profilo" };
// Più nomi possono mostrare la stessa vista (ripasso usa il feed).
const CONTENITORE = { ripasso: "feed" };

const viste = new Map();
let corrente = null;

export function registraVista(nome, ganci = {}) { viste.set(nome, ganci); }
export const vistaCorrente = () => corrente;

export function vaiA(nome) {
  if (location.hash === "#" + nome) mostraDaHash(); else location.hash = nome;
}

function nomeDaHash() {
  const n = location.hash.replace(/^#/, "");
  return viste.has(n) ? n : "feed";
}

function mostraDaHash(primaVolta = false) {
  const nome = nomeDaHash();
  const vecchia = corrente;
  corrente = nome;
  const contenitore = CONTENITORE[nome] || nome;
  for (const el of document.querySelectorAll(".vista")) el.hidden = el.id !== "vista-" + contenitore;
  for (const a of document.querySelectorAll(".tab")) {
    const attiva = a.dataset.sezione === SEZIONE[nome];
    attiva ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current");
  }
  if (vecchia && vecchia !== nome) viste.get(vecchia)?.nascondi?.(nome);
  viste.get(nome)?.mostra?.({ primaVolta, da: vecchia });
  if (!primaVolta) {
    const titolo = document.querySelector(`#vista-${contenitore} [data-fuoco]`) || document.getElementById("vista-" + contenitore);
    titolo?.focus({ preventScroll: true });
  }
}

// All'apertura si va sempre al feed, qualunque sia l'indirizzo.
export function avviaNav() {
  // Le scorciatoie dell'app installata aprono con ?apri=<vista>; l'indirizzo si ripulisce subito.
  const apri = new URLSearchParams(location.search).get("apri");
  const inizio = viste.has(apri) ? apri : "feed";
  if (location.hash !== "#" + inizio || location.search) history.replaceState(null, "", location.pathname + "#" + inizio);
  window.addEventListener("hashchange", () => mostraDaHash());
  mostraDaHash(true);
}
