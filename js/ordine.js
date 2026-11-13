// Ordine del feed. Funzione pura: niente browser, niente localStorage, niente rete. Si prova con scripts/prova-ordine.mjs.
//
// Regole, in quest'ordine di importanza:
//  1. prima le schede mai viste, poi quelle viste da più tempo: nessuna ripetizione finché ci sono schede nuove;
//  2. mai più di 2 schede dello stesso tipo né 3 dello stesso tema di fila, se possibile;
//  3. le categorie preferite pesano di più, ma circa il 30% delle schede viene da fuori;
//  4. a parità di condizioni, prima le schede verificate.
export const MAX_STESSO_TIPO = 2;
export const MAX_STESSO_TEMA = 3;
export const QUOTA_FUORI = 0.3;

function generatore(seme) {
  let s = seme >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return (s % 100000) / 100000; };
}

function mescola(lista, r) {
  const b = lista.slice();
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
  return b;
}

const verificata = s => (s.stato === "verificata" ? 1 : 0);
const temaPrincipale = s => s.temi[0];

// Si può mettere la scheda dopo quelle già scelte? livello 0: tutte le regole; 1: solo il tipo; 2: qualunque.
function adatta(s, uscita, livello) {
  if (livello >= 2) return true;
  const n = uscita.length;
  if (n >= MAX_STESSO_TIPO && uscita.slice(n - MAX_STESSO_TIPO).every(x => x.tipo === s.tipo)) return false;
  if (livello >= 1) return true;
  return !(n >= MAX_STESSO_TEMA && uscita.slice(n - MAX_STESSO_TEMA).every(x => temaPrincipale(x) === temaPrincipale(s)));
}

// schede: le schede già filtrate ({ id, tipo, temi, stato }).
// cronologia: { id: giorno } con l'ultimo giorno in cui la scheda è stata vista (assente = mai vista).
// categorie: id delle categorie preferite; categoriaDiTema: { temaId: categoriaId }.
// seme: numero che fissa la parte casuale; prima: id di una scheda da mettere per prima (la scheda del giorno).
// Restituisce un nuovo array con le stesse schede.
export function ordina(schede, { cronologia = {}, categorie = [], categoriaDiTema = {}, seme = 1, prima = null } = {}) {
  const r = generatore(seme);
  const preferite = new Set(categorie);
  const conPreferenze = preferite.size > 0;
  const dentro = s => s.temi.some(m => preferite.has(categoriaDiTema[m]));

  const primaScheda = prima ? schede.find(s => s.id === prima) : null;
  const resto = mescola(schede.filter(s => s !== primaScheda), r);
  const nuove = resto.filter(s => !(s.id in cronologia)).sort((a, b) => verificata(b) - verificata(a));
  const viste = resto.filter(s => s.id in cronologia).sort((a, b) => cronologia[a.id] - cronologia[b.id] || verificata(b) - verificata(a));

  const uscita = primaScheda ? [primaScheda] : [];
  for (const gruppo of [nuove, viste]) {
    // Due code, nell'ordine di priorità: dentro e fuori dalle preferenze. Senza preferenze ce n'è una sola.
    const code = conPreferenze ? [gruppo.filter(dentro), gruppo.filter(s => !dentro(s))] : [gruppo, []];
    while (code[0].length + code[1].length) {
      const voglioFuori = code[1].length > 0 && (code[0].length === 0 || r() < QUOTA_FUORI);
      const ordineCode = voglioFuori ? [1, 0] : [0, 1];
      let scelta = null;
      for (let livello = 0; livello <= 2 && !scelta; livello++) {
        for (const k of ordineCode) {
          const i = code[k].findIndex(s => adatta(s, uscita, livello));
          if (i >= 0) { scelta = code[k].splice(i, 1)[0]; break; }
        }
      }
      uscita.push(scelta);
    }
  }
  return uscita;
}
