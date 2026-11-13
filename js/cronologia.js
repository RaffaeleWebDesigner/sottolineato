// Cosa ha visto l'utente: cronologia delle schede, giorni di uso, contatori di oggi e risultati dei quiz.
// Si salvano solo id e numeri, mai i testi. Chiavi (elencate in CLAUDE.md):
//   sott-vista   { id: giorno }   l'ultimo giorno in cui la scheda è stata vista
//   sott-giorni  [giorno, …]      i giorni in cui è stata vista almeno una scheda
//   sott-oggi    { g, nuove, extra, video, giornoVisto }   contatori del giorno corrente
//   sott-quiz    { id: 1 | 0 }    l'ultimo esito del quiz della scheda (1 giusto, 0 sbagliato)
import { store } from "./store.js";
import { oggi } from "./tempo.js";

// La cronologia deve restare sotto i 100 KB: oltre questa soglia si dimenticano le schede viste da più tempo.
const MAX_CARATTERI = 90000;
const MAX_GIORNI = 400;

let vista = {};
let giorni = [];
let esiti = {};
let contatori = null;

export function inizializzaCronologia() {
  vista = store.get("sott-vista", {}) || {};
  giorni = store.get("sott-giorni", []) || [];
  esiti = store.get("sott-quiz", {}) || {};
  contatori = null;
  if (store.get("sott-installata", null) === null) store.set("sott-installata", oggi());
}

export const cronologiaViste = () => vista;
export const schedeViste = () => Object.keys(vista).length;
export const giornoInstallazione = () => store.get("sott-installata", oggi());

function salvaVista() {
  let json = JSON.stringify(vista);
  if (json.length > MAX_CARATTERI) {
    const ordine = Object.entries(vista).sort((a, b) => a[1] - b[1]);
    for (const [id] of ordine.slice(0, Math.ceil(ordine.length * 0.1))) delete vista[id];
    json = JSON.stringify(vista);
  }
  try { localStorage.setItem("sott-vista", json); } catch {}
}
export const dimensioneCronologia = () => JSON.stringify(vista).length;

// I contatori di oggi: se è cambiato il giorno ripartono da zero.
export function contatoriDiOggi() {
  const g = oggi();
  if (!contatori) contatori = store.get("sott-oggi", null);
  if (!contatori || contatori.g !== g) { contatori = { g, nuove: 0, extra: 0, video: 0, giornoVisto: false }; store.set("sott-oggi", contatori); }
  return contatori;
}
export function aggiornaContatori(modifiche) { Object.assign(contatoriDiOggi(), modifiche); store.set("sott-oggi", contatori); }

// Una scheda è stata a schermo almeno 1,5 secondi. Con conta = true, se è la prima volta che la si vede,
// entra tra le «nuove» del giorno (quelle del limite giornaliero). Restituisce true se era nuova.
export function registraVista(id, { conta = false } = {}) {
  const nuova = !(id in vista);
  const g = oggi();
  vista[id] = g;
  if (giorni[giorni.length - 1] !== g) { giorni = [...giorni.filter(x => x !== g), g].slice(-MAX_GIORNI); store.set("sott-giorni", giorni); }
  if (nuova && conta) aggiornaContatori({ nuove: contatoriDiOggi().nuove + 1 });
  salvaVista();
  return nuova;
}

// Giorni consecutivi con almeno una scheda vista. Se oggi non ne ha ancora viste, la serie arriva a ieri.
export function giorniConsecutivi() {
  const insieme = new Set(giorni);
  let g = oggi();
  if (!insieme.has(g)) g -= 1;
  let n = 0;
  while (insieme.has(g)) { n++; g--; }
  return n;
}

export function registraEsito(id, giusto) { esiti[id] = giusto ? 1 : 0; store.set("sott-quiz", esiti); }
export function statisticheQuiz() {
  const valori = Object.values(esiti);
  return { totale: valori.length, giusti: valori.filter(Boolean).length };
}
