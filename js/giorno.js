// La scheda del giorno: una al giorno, uguale per tutti, scelta tra le schede verificate. La scelta è in ordine.js.
// Chiave: sott-del-giorno { giorno: id } ricorda le schede già mostrate, così l'archivio non cambia quando
// l'elenco delle verificate cresce.
import { store } from "./store.js";
import { catalogo } from "./dati.js";
import { schedaDelGiorno } from "./ordine.js";
import { oggi } from "./tempo.js";
import { giornoInstallazione } from "./cronologia.js";

const MAX_MEMORIA = 400; // giorni ricordati

const verificate = () => catalogo.schede.filter(s => s.stato === "verificata").map(s => s.id).sort();

// La scheda di quel giorno (oggi, se non si dice altro), o null se non ci sono verificate.
export function delGiorno(giorno = oggi()) {
  const memoria = store.get("sott-del-giorno", {}) || {};
  if (memoria[giorno] && catalogo.perId.has(memoria[giorno])) return catalogo.perId.get(memoria[giorno]);
  const id = schedaDelGiorno(verificate(), giorno);
  if (!id) return null;
  memoria[giorno] = id;
  for (const g of Object.keys(memoria).map(Number).sort((a, b) => a - b).slice(0, -MAX_MEMORIA)) delete memoria[g];
  store.set("sott-del-giorno", memoria);
  return catalogo.perId.get(id);
}

// Le schede dei giorni passati, dalla più recente, a partire dal giorno di installazione.
export function archivioGiorni() {
  const da = Math.max(giornoInstallazione(), oggi() - MAX_MEMORIA), fuori = [];
  for (let g = oggi() - 1; g >= da; g--) { const scheda = delGiorno(g); if (scheda) fuori.push({ giorno: g, scheda }); }
  return fuori;
}
