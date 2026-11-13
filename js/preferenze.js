// Preferenze dell'utente: categorie scelte nell'onboarding (sott-interessi), tema (sott-aspetto) e dimensione del testo (sott-testo).
// Tema e dimensione si applicano subito all'avvio dallo script in <head> di index.html, per evitare il lampo del tema sbagliato.
import { store } from "./store.js";

export const interessi = () => store.get("sott-interessi", []) || [];
export function impostaInteressi(ids) { store.set("sott-interessi", [...new Set(ids)]); }

// Tema: «sistema» segue il telefono, «chiaro» e «scuro» lo forzano.
export const ASPETTI = ["sistema", "chiaro", "scuro"];
export const aspetto = () => { const a = store.get("sott-aspetto", "sistema"); return ASPETTI.includes(a) ? a : "sistema"; };
const COLORE_BARRA = { chiaro: "#eef1f4", scuro: "#0e1217" };
const coloriBarraOriginali = new Map();

export function applicaAspetto() {
  const a = aspetto(), radice = document.documentElement;
  if (a === "sistema") radice.removeAttribute("data-theme"); else radice.dataset.theme = a === "chiaro" ? "light" : "dark";
  for (const m of document.querySelectorAll('meta[name="theme-color"]')) {
    if (!coloriBarraOriginali.has(m)) coloriBarraOriginali.set(m, m.content);
    m.content = a === "sistema" ? coloriBarraOriginali.get(m) : COLORE_BARRA[a];
  }
}
export function impostaAspetto(a) { store.set("sott-aspetto", a); applicaAspetto(); }

// Dimensione del testo: 1 normale, 2 grande, 3 molto grande.
export const DIMENSIONI = [1, 2, 3];
export const dimensione = () => { const d = Number(store.get("sott-testo", 1)); return DIMENSIONI.includes(d) ? d : 1; };
export function applicaDimensione() { const d = dimensione(); if (d === 1) delete document.documentElement.dataset.testo; else document.documentElement.dataset.testo = String(d); }
export function impostaDimensione(d) { store.set("sott-testo", d); applicaDimensione(); }
