// Filtri per tipo (sott-tipo) e per tema (sott-tema, id del tema).
import { el } from "./dom.js";
import { t } from "./i18n.js";
import { store } from "./store.js";
import { LIBRI } from "./dati.js";
import { salvata } from "./salvataggi.js";

// Valori interni dei filtri per tipo: non dipendono dalla lingua.
const TIPI_FILTRO = ["tutto", "libri", "storica", "mondo", "mito", "brillante", "salvate"];
const etichette = () => ({
  tutto: t("filtri.tutto"), libri: t("filtri.libri"), storica: t("filtri.storica"), mondo: t("filtri.mondo"),
  mito: t("filtri.mito"), brillante: t("filtri.brillante"), salvate: t("filtri.salvate"),
});

let temi = [];
let filtroTipo = "tutto";
let filtroTema = null;
let quandoCambia = () => {};
let chipsTipo, chipsTema;

// temi: [{ id, nome }]; cambia: funzione da chiamare quando l'utente cambia un filtro.
export function inizializzaFiltri(listaTemi, cambia) {
  temi = listaTemi; quandoCambia = cambia;
  chipsTipo = document.getElementById("chips-tipo");
  chipsTema = document.getElementById("chips-tema");
  filtroTipo = store.get("sott-tipo", "tutto");
  if (!TIPI_FILTRO.includes(filtroTipo)) filtroTipo = "tutto";
  filtroTema = store.get("sott-tema", null);
  if (filtroTema && !temi.some(x => x.id === filtroTema)) filtroTema = null;
}

export const soloSalvate = () => filtroTipo === "salvate";

export function filtra(schede) {
  let lista = schede;
  if (filtroTipo === "salvate") lista = lista.filter(f => salvata(f.id));
  else if (filtroTipo === "libri") lista = lista.filter(f => LIBRI.has(f.tipo));
  else if (filtroTipo !== "tutto") lista = lista.filter(f => f.tipo === filtroTipo);
  if (filtroTema) lista = lista.filter(f => f.temi.includes(filtroTema)); // qualsiasi posizione in temi
  return lista;
}

function chip(label, pressed, onClick, id) {
  const b = el("button", "chip", label); b.type = "button"; b.id = id;
  b.setAttribute("aria-pressed", String(pressed)); b.addEventListener("click", onClick); return b;
}

export function renderChips() {
  const nomi = etichette();
  chipsTipo.replaceChildren(...TIPI_FILTRO.map(k =>
    chip(nomi[k], filtroTipo === k, () => { filtroTipo = k; store.set("sott-tipo", k); renderChips(); quandoCambia(); }, "tipo-" + k)));
  chipsTema.replaceChildren(...temi.map(x =>
    chip(x.nome, filtroTema === x.id, () => { filtroTema = filtroTema === x.id ? null : x.id; store.set("sott-tema", filtroTema); renderChips(); quandoCambia(); }, "tema-" + x.id)));
}
