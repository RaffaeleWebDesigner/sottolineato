// Ricerca nelle schede: testo, nota, autore e opera. Non distingue maiuscole e accenti («perche» trova «perché»).
// Funzioni pure: si provano con scripts/prova-ordine.mjs.
export const MAX_RISULTATI = 50;

export const normalizza = s => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const cache = new WeakMap();
function campi(s) {
  let c = cache.get(s);
  if (!c) { c = { testo: normalizza(s.testo), nota: normalizza(s.nota), autore: normalizza(s.autore), opera: normalizza(s.opera) }; cache.set(s, c); }
  return c;
}
const PESI = { testo: 4, autore: 3, opera: 3, nota: 1 };

// Le schede che contengono tutte le parole cercate, le più pertinenti per prime (al massimo `max`).
export function cerca(schede, domanda, max = MAX_RISULTATI) {
  const parole = normalizza(domanda).split(/\s+/).filter(Boolean);
  if (!parole.length) return [];
  const frase = parole.join(" ");
  const trovate = [];
  for (const s of schede) {
    if (s.testo === undefined) continue; // testi non ancora arrivati
    const c = campi(s);
    let punti = 0, tutte = true;
    for (const p of parole) {
      let migliore = 0;
      for (const [k, peso] of Object.entries(PESI)) if (c[k].includes(p)) migliore = Math.max(migliore, peso);
      if (!migliore) { tutte = false; break; }
      punti += migliore;
    }
    if (!tutte) continue;
    if (parole.length > 1 && c.testo.includes(frase)) punti += 5;
    if (s.stato === "verificata") punti += .5;
    trovate.push({ s, punti });
  }
  return trovate.sort((a, b) => b.punti - a.punti).slice(0, max).map(x => x.s);
}
