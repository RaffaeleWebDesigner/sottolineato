// Ripasso delle salvate: quando tornano le schede salvate. Le regole (1, 3, 7 e 30 giorni) sono in ordine.js.
// Chiave: sott-ripasso { id: [passi, ultimoGiorno] }
import { store } from "./store.js";
import { oggi } from "./tempo.js";
import { ordinaRipasso, ripassoDovuto, dopoRipasso } from "./ordine.js";

let voci = {};
export function inizializzaRipasso() { voci = store.get("sott-ripasso", {}) || {}; }

export const ordinaPerRipasso = schede => ordinaRipasso(schede, voci, oggi());
export const daRipassare = schede => schede.filter(s => ripassoDovuto(voci[s.id], oggi())).length;

// Una salvata è stata a schermo nel ripasso: se era da ripassare, il ripasso avanza.
export function registraRipasso(id) {
  const nuova = dopoRipasso(voci[id], oggi());
  if (nuova === voci[id]) return;
  voci[id] = nuova; store.set("sott-ripasso", voci);
}
