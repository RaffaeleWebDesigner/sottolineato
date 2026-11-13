// Il feed: lista delle schede a schermo intero, create a blocchi mentre si scorre.
import { el } from "./dom.js";
import { t } from "./i18n.js";
import { catalogo, semeDelGiorno, testoPronto } from "./dati.js";
import { ordina } from "./ordine.js";
import { cronologiaViste, registraVista } from "./cronologia.js";
import { interessi } from "./preferenze.js";
import { creaCard } from "./scheda.js";
import { filtra, filtroAttivo, filtroCorrente, descriviFiltro, azzeraFiltro, soloSalvate } from "./filtri.js";
import { vistaCorrente } from "./nav.js";

const BLOCCO = 25;
const TEMPO_VISTA = 1500; // millisecondi a schermo perché una scheda conti come vista

let feed, pillola;
let seme = semeDelGiorno();
let observer, loader;
let listaInVista = [];
let firmaRender = null;
let riempi = null; // continua a creare le schede quando arrivano altri testi
const timer = new Map();  // slide → timer della «vista»
const inVista = new Set(); // slide oggi a schermo
const schedaDi = new WeakMap();

export function inizializzaFeed() {
  feed = document.getElementById("feed");
  pillola = document.getElementById("filtro-attivo");
  pillola.addEventListener("click", () => { azzeraFiltro(); aggiornaFeed(); });
  document.getElementById("mix").addEventListener("click", rimescola);
  // Se la pagina va in secondo piano i timer si fermano; al ritorno ripartono per le schede ancora a schermo.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { for (const x of timer.values()) clearTimeout(x); timer.clear(); }
    else inVista.forEach(avviaTimer);
  });
  document.addEventListener("keydown", e => {
    if (vistaCorrente() !== "feed" || e.target.closest("input, textarea, select, dialog")) return;
    if (e.key === "ArrowDown" || e.key === "j") { e.preventDefault(); feed.scrollBy({ top: feed.clientHeight, behavior: "smooth" }); }
    if (e.key === "ArrowUp" || e.key === "k") { e.preventDefault(); feed.scrollBy({ top: -feed.clientHeight, behavior: "smooth" }); }
  });
}

// Tipo della prima scheda in vista: i suoi testi vanno caricati per primi.
export const tipoInCima = () => listaInVista[0]?.tipo;

// Chiamata quando arriva un file di testi: crea le schede che lo aspettavano.
export function continuaFeed() { riempi?.(); }

// Nuovo ordine casuale per le stesse schede.
export function rimescola() { seme = Math.floor(Math.random() * 1e9); aggiornaFeed(); }

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
  const attivo = filtroAttivo();
  pillola.hidden = !attivo;
  if (attivo) {
    const nome = descriviFiltro();
    pillola.textContent = nome + " ×";
    pillola.setAttribute("aria-label", t("feed.togli_filtro", { filtro: nome }));
  }
}

const firma = () => JSON.stringify([filtroCorrente(), seme, catalogo.schede.length]);

// Quando si torna al feed si ricostruisce solo se qualcosa è cambiato: così si resta dov'eri.
export function mostraFeed() { if (firma() !== firmaRender) aggiornaFeed(); }

export function aggiornaFeed() {
  firmaRender = firma();
  aggiornaPillola();
  renderFeed(filtra(catalogo.schede), soloSalvate());
}

// La scheda resta a schermo: dopo 1,5 secondi si registra come vista.
function avviaTimer(slide) {
  if (timer.has(slide) || document.hidden) return;
  timer.set(slide, setTimeout(() => { timer.delete(slide); registraVista(schedaDi.get(slide).id, { conta: true }); }, TEMPO_VISTA));
}
function fermaTimer(slide) { clearTimeout(timer.get(slide)); timer.delete(slide); }

function osservaVista(es) {
  for (const e of es) {
    const slide = e.target;
    if (e.intersectionRatio >= .6) { e.target.querySelector(".card")?.classList.add("seen"); inVista.add(slide); avviaTimer(slide); }
    else { inVista.delete(slide); fermaTimer(slide); }
  }
}

function renderFeed(listaFiltrata, vuotoSalvate) {
  const lista = listaInVista = ordina(listaFiltrata, {
    cronologia: cronologiaViste(), categorie: interessi(), categoriaDiTema: catalogo.categoriaDiTema, seme,
  });
  for (const x of timer.values()) clearTimeout(x); timer.clear(); inVista.clear();

  observer?.disconnect(); loader?.disconnect(); riempi = null;
  feed.replaceChildren(); feed.scrollTop = 0;
  if (!lista.length) {
    feed.appendChild(vuotoSalvate ? slideMessaggio(t("vuoto.salvate_titolo"), t("vuoto.salvate_testo")) : slideMessaggio(t("vuoto.titolo"), t("vuoto.testo")));
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
      schedaDi.set(slide, lista[fatte]);
      slide.appendChild(creaCard(lista[fatte], fatte, lista.length));
      feed.insertBefore(slide, sentinella); observer.observe(slide);
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
