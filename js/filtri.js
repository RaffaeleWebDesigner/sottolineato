// Filtri del feed: per tipo (sott-tipo), per tema (sott-tema, id del tema) e per categoria (sott-categoria, id).
// Si scelgono in Esplora; qui c'è solo lo stato, il salvataggio e il filtro vero e proprio.
import { t } from "./i18n.js";
import { store } from "./store.js";
import { LIBRI, catalogo } from "./dati.js";
import { salvata } from "./salvataggi.js";

// Valori interni dei filtri per tipo: non dipendono dalla lingua.
export const TIPI_FILTRO = ["tutto", "libri", "storica", "mondo", "mito", "brillante", "salvate"];
export const nomeTipoFiltro = k => ({
  tutto: t("filtri.tutto"), libri: t("filtri.libri"), storica: t("filtri.storica"), mondo: t("filtri.mondo"),
  mito: t("filtri.mito"), brillante: t("filtri.brillante"), salvate: t("filtri.salvate"),
})[k];

let tipo = "tutto";
let tema = null;
let categoria = null;

export function inizializzaFiltri() {
  tipo = store.get("sott-tipo", "tutto");
  if (!TIPI_FILTRO.includes(tipo)) tipo = "tutto";
  tema = store.get("sott-tema", null);
  if (tema && !catalogo.temi.some(x => x.id === tema)) tema = null;
  categoria = store.get("sott-categoria", null);
  if (categoria && !catalogo.categorie.some(x => x.id === categoria)) categoria = null;
}

export const filtroCorrente = () => ({ tipo, tema, categoria });
export const filtroAttivo = () => tipo !== "tutto" || tema !== null || categoria !== null;
export const soloSalvate = () => tipo === "salvate";

// Sostituisce l'intero filtro: quello che non si indica torna al valore di partenza.
export function impostaFiltro({ tipo: t1 = "tutto", tema: t2 = null, categoria: t3 = null } = {}) {
  tipo = TIPI_FILTRO.includes(t1) ? t1 : "tutto"; tema = t2; categoria = t3;
  store.set("sott-tipo", tipo); store.set("sott-tema", tema); store.set("sott-categoria", categoria);
}
export const azzeraFiltro = () => impostaFiltro();

// Il testo che dice che filtro è attivo, per esempio «Vero o falso · Storia».
export function descriviFiltro() {
  const parti = [];
  if (tipo !== "tutto") parti.push(nomeTipoFiltro(tipo));
  if (tema) parti.push(catalogo.temi.find(x => x.id === tema)?.nome);
  if (categoria) parti.push(catalogo.categorie.find(x => x.id === categoria)?.nome);
  return parti.filter(Boolean).join(t("scheda.separatore"));
}

export const inCategoria = (scheda, id) => scheda.temi.some(m => catalogo.categoriaDiTema[m] === id);

export function filtra(schede) {
  let lista = schede;
  if (tipo === "salvate") lista = lista.filter(f => salvata(f.id));
  else if (tipo === "libri") lista = lista.filter(f => LIBRI.has(f.tipo));
  else if (tipo !== "tutto") lista = lista.filter(f => f.tipo === tipo);
  if (tema) lista = lista.filter(f => f.temi.includes(tema)); // qualsiasi posizione in temi
  if (categoria) lista = lista.filter(f => inCategoria(f, categoria));
  return lista;
}
