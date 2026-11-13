// Schede salvate e imparate (sott-salvate, sott-imparate).
import { store } from "./store.js";

let salvate = new Set();
let imparate = new Set();

export function inizializzaSalvataggi() {
  salvate = new Set(store.get("sott-salvate", []));
  imparate = new Set(store.get("sott-imparate", []));
}

export const salvata = id => salvate.has(id);
export const elencoSalvate = () => [...salvate];
export const numeroSalvate = () => salvate.size;
export const numeroImparate = () => imparate.size;

function avvisa() { document.dispatchEvent(new CustomEvent("sott:salvate")); }

export function alternaSalvata(id) {
  salvate.has(id) ? salvate.delete(id) : salvate.add(id);
  store.set("sott-salvate", [...salvate]); avvisa();
}

export function impara(id) { imparate.add(id); store.set("sott-imparate", [...imparate]); avvisa(); }
