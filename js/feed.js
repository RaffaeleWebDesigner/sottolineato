// Il feed: lista delle schede a schermo intero, create a blocchi mentre si scorre.
import { el } from "./dom.js";
import { t } from "./i18n.js";
import { catalogo, semeDelGiorno, testoPronto } from "./dati.js";
import { ordina } from "./ordine.js";
import { cronologiaViste, registraVista } from "./cronologia.js";
import { interessi } from "./preferenze.js";
import { creaCard } from "./scheda.js";
import { filtra, filtroAttivo, filtroCorrente, descriviFiltro, azzeraFiltro, soloSalvate } from "./filtri.js";
import { vistaCorrente, vaiA } from "./nav.js";
import { oggi } from "./tempo.js";
import { movimentoRidotto } from "./effetti.js";
import { delGiorno } from "./giorno.js";
import { contatoriDiOggi, aggiornaContatori } from "./cronologia.js";
import { limiteAttivo, rimaste } from "./limiti.js";
import { creaSchermataLimite } from "./limiteui.js";
import { elencoSalvate } from "./salvataggi.js";
import { ordinaPerRipasso, daRipassare, registraRipasso } from "./ripasso.js";

const BLOCCO = 25;
const TEMPO_VISTA = 1500; // millisecondi a schermo perché una scheda conti come vista

let feed, pillola, contatore;
let seme = semeDelGiorno();
let observer, loader;
let listaInVista = [];
let firmaRender = null;
let giornoRender = oggi();
let riempi = null; // continua a creare le schede quando arrivano altri testi
const timer = new Map();   // slide → timer della «vista»
const inVista = new Set(); // slide a schermo
const infoSlide = new WeakMap(); // slide → { f, conta }
let sospeso = false;
let modo = "feed"; // «feed», oppure «ripasso»: il feed delle sole salvate

export function inizializzaFeed() {
  feed = document.getElementById("feed");
  pillola = document.getElementById("filtro-attivo");
  contatore = document.getElementById("rimaste");
  pillola.addEventListener("click", () => { if (modo === "ripasso") { vaiA("feed"); return; } azzeraFiltro(); aggiornaFeed(); });
  document.getElementById("mix").addEventListener("click", rimescola);
  // Se la pagina va in secondo piano i timer si fermano; al ritorno ripartono per le schede ancora a schermo.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { for (const x of timer.values()) clearTimeout(x); timer.clear(); }
    else { inVista.forEach(avviaTimer); controllaGiorno(); }
  });
  setInterval(controllaGiorno, 60000);
  document.addEventListener("keydown", e => {
    if (vistaCorrente() !== "feed" || e.target.closest("input, textarea, select, dialog")) return;
    if (e.key === "ArrowDown" || e.key === "j") { e.preventDefault(); feed.scrollBy({ top: feed.clientHeight, behavior: movimentoRidotto() ? "auto" : "smooth" }); }
    if (e.key === "ArrowUp" || e.key === "k") { e.preventDefault(); feed.scrollBy({ top: -feed.clientHeight, behavior: movimentoRidotto() ? "auto" : "smooth" }); }
  });
}

// Tipo della prima scheda in vista: i suoi testi vanno caricati per primi.
export const tipoInCima = () => listaInVista[0]?.tipo;

// Chiamata quando arriva un file di testi: crea le schede che lo aspettavano.
export function continuaFeed() { riempi?.(); }

// Nuovo ordine casuale per le stesse schede.
export function rimescola() { seme = Math.floor(Math.random() * 1e9); aggiornaFeed(); }

// A mezzanotte il giorno cambia: contatori e scheda del giorno ripartono.
function controllaGiorno() { if (oggi() !== giornoRender && vistaCorrente() === "feed") aggiornaFeed(); }

function slideMessaggio(titolo, testo) {
  const s = el("section", "slide"); const e = el("div", "card empty");
  e.append(el("strong", null, titolo), el("span", null, testo));
  s.appendChild(e); return s;
}

export function mostraErrore() {
  observer?.disconnect(); loader?.disconnect(); riempi = null;
  feed.replaceChildren(slideMessaggio(t("errori.caricamento_titolo"), t("errori.caricamento_testo")));
}

function aggiornaPillola() {
  const attivo = modo === "ripasso" || filtroAttivo();
  pillola.hidden = !attivo;
  document.getElementById("mix").hidden = modo === "ripasso";
  if (modo === "ripasso") {
    pillola.textContent = t("ripasso.titolo") + " ×";
    pillola.setAttribute("aria-label", t("ripasso.esci"));
  } else if (attivo) {
    const nome = descriviFiltro();
    pillola.textContent = nome + " ×";
    pillola.setAttribute("aria-label", t("feed.togli_filtro", { filtro: nome }));
  }
}

// Il contatore delle schede rimaste compare solo con il limite acceso.
function aggiornaContatore() {
  if (modo === "ripasso") { contatore.hidden = false; contatore.textContent = t("ripasso.da_rivedere", { n: daRipassare(listaInVista) }); return; }
  const mostra = limiteAttivo();
  contatore.hidden = !mostra;
  if (mostra) contatore.textContent = t("limite.rimaste", { n: rimaste() });
}

const firma = () => JSON.stringify([modo, filtroCorrente(), seme, catalogo.schede.length, oggi(), interessi(), modo === "ripasso" ? elencoSalvate() : 0]);

// Quando si torna al feed si ricostruisce solo se qualcosa è cambiato: così si resta dov'eri.
export function mostraFeed(richiesto = "feed") {
  modo = richiesto;
  if (!sospeso && firma() !== firmaRender) aggiornaFeed(); else { aggiornaPillola(); aggiornaContatore(); }
}

// Finché c'è l'onboarding il feed non si costruisce: nessuna scheda deve risultare vista da chi non l'ha vista.
export function sospendiFeed(si) { sospeso = si; }

export function aggiornaFeed() {
  firmaRender = firma(); giornoRender = oggi();
  aggiornaPillola();
  renderFeed(modo === "ripasso" ? catalogo.schede.filter(s => elencoSalvate().includes(s.id)) : filtra(catalogo.schede), modo === "ripasso" || soloSalvate());
  aggiornaContatore();
}

// La scheda resta a schermo: dopo 1,5 secondi si registra come vista.
function avviaTimer(slide) {
  if (timer.has(slide) || document.hidden) return;
  timer.set(slide, setTimeout(() => {
    timer.delete(slide);
    const { f, conta, giorno } = infoSlide.get(slide);
    registraVista(f.id, { conta: conta && modo === "feed" }); if (giorno) aggiornaContatori({ giornoVisto: true });
    if (modo === "ripasso") registraRipasso(f.id);
    aggiornaContatore();
  }, TEMPO_VISTA));
}
function fermaTimer(slide) { clearTimeout(timer.get(slide)); timer.delete(slide); }

function osservaVista(es) {
  for (const e of es) {
    const slide = e.target;
    if (e.intersectionRatio >= .6) { slide.querySelector(".card")?.classList.add("seen"); inVista.add(slide); avviaTimer(slide); }
    else { inVista.delete(slide); fermaTimer(slide); }
  }
}

// Con il limite acceso la lista si ferma prima della scheda nuova che non si può più vedere.
// La scheda del giorno non conta: si salta.
function tagliaAlLimite(lista, cronologia, giornoId) {
  let disponibili = rimaste();
  for (let i = 0; i < lista.length; i++) {
    if (lista[i].id in cronologia || lista[i].id === giornoId) continue;
    if (disponibili === 0) return { lista: lista.slice(0, i), finito: true };
    disponibili--;
  }
  return { lista, finito: false };
}

function renderFeed(listaFiltrata, vuotoSalvate) {
  const cronologia = cronologiaViste();
  // Alla prima apertura del giorno la scheda del giorno è la prima del feed (se passa il filtro).
  const dg = modo === "feed" ? delGiorno() : null, giornoId = dg?.id ?? null;
  const primaId = dg && !contatoriDiOggi().giornoVisto && listaFiltrata.includes(dg) ? giornoId : null;
  let lista = modo === "ripasso" ? ordinaPerRipasso(listaFiltrata)
    : ordina(listaFiltrata, { cronologia, categorie: interessi(), categoriaDiTema: catalogo.categoriaDiTema, seme, prima: primaId });
  let finito = false;
  if (modo === "feed" && limiteAttivo()) ({ lista, finito } = tagliaAlLimite(lista, cronologia, giornoId));
  listaInVista = lista;
  for (const x of timer.values()) clearTimeout(x); timer.clear(); inVista.clear();

  observer?.disconnect(); loader?.disconnect(); riempi = null;
  feed.replaceChildren(); feed.scrollTop = 0;
  const slideLimite = finito ? creaSchermataLimite(aggiornaFeed) : null;
  if (!lista.length) {
    feed.appendChild(slideLimite ?? (vuotoSalvate ? slideMessaggio(t("vuoto.salvate_titolo"), t("vuoto.salvate_testo")) : slideMessaggio(t("vuoto.titolo"), t("vuoto.testo"))));
    return;
  }
  // Le schede si creano a blocchi mentre si scorre, così la pagina resta leggera anche con migliaia di schede.
  // Una scheda si crea solo quando sono arrivati i suoi testi; fino ad allora il feed si ferma lì.
  observer = new IntersectionObserver(osservaVista, { root: feed, threshold: [0, .6] });
  let fatte = 0, richieste = 0;
  const sentinella = el("div", "sentinella");
  const attesa = slideMessaggio(t("caricamento.titolo"), t("caricamento.testo"));
  riempi = () => {
    for (; fatte < richieste && testoPronto(lista[fatte]); fatte++) {
      const slide = el("section", "slide");
      const f = lista[fatte], oggiLaDelGiorno = f.id === giornoId;
      infoSlide.set(slide, { f, conta: !oggiLaDelGiorno, giorno: oggiLaDelGiorno });
      slide.appendChild(creaCard(f, fatte, lista.length, { delGiorno: oggiLaDelGiorno, modo }));
      feed.insertBefore(slide, sentinella); observer.observe(slide);
      if (fatte === 0) { attesa.remove(); requestAnimationFrame(() => feed.querySelector(".card")?.classList.add("seen")); }
    }
    if (fatte >= lista.length) { loader.disconnect(); sentinella.remove(); riempi = null; if (slideLimite) feed.append(slideLimite); }
  };
  const prossimoBlocco = () => { richieste = Math.min(richieste + BLOCCO, lista.length); riempi(); };
  feed.append(attesa, sentinella);
  loader = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting) && fatte >= richieste) prossimoBlocco(); }, { root: feed, rootMargin: "300% 0px" });
  prossimoBlocco();
  if (fatte < lista.length) loader.observe(sentinella);
}
