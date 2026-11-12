// Schede salvate e imparate (sott-salvate, sott-imparate) e contatore in alto.
import { store } from "./store.js";
import { t } from "./i18n.js";

let salvate = new Set();
let imparate = new Set();
let stats;

export function inizializzaSalvataggi() {
  salvate = new Set(store.get("sott-salvate", []));
  imparate = new Set(store.get("sott-imparate", []));
  stats = document.getElementById("stats");
}

export function renderStats() { stats.textContent = t("intestazione.contatori", { imparate: imparate.size, salvate: salvate.size }); }

export const salvata = id => salvate.has(id);

export function alternaSalvata(id) {
  salvate.has(id) ? salvate.delete(id) : salvate.add(id);
  store.set("sott-salvate", [...salvate]); renderStats();
}

export function impara(id) { imparate.add(id); store.set("sott-imparate", [...imparate]); renderStats(); }
