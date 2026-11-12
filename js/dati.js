// Caricamento dei contenuti e regole sulle schede.
export const TIPI_DATI = ["frase", "idea", "parola", "sapevi", "storica", "mondo", "mito", "brillante"];
export const LIBRI = new Set(["frase", "idea", "parola", "sapevi"]);

export const leggiJson = p => fetch(p).then(r => { if (!r.ok) throw new Error(`${p}: ${r.status}`); return r.json(); });

let temiPremium = new Set();

// Carica temi, schede (dati comuni) e testi nella lingua scelta, e ricompone ogni scheda:
// tema è il nome del tema principale, temi resta la lista completa di id.
export async function caricaDati(lingua) {
  const [temi, ...parti] = await Promise.all([
    leggiJson("data/temi.json"),
    ...TIPI_DATI.map(tipo => Promise.all([leggiJson(`data/schede/${tipo}.json`), leggiJson(`data/testi/${lingua}/${tipo}.json`)])),
  ]);
  const nomeTema = new Map(temi.map(x => [x.id, x.nome[lingua] || x.nome.it]));
  temiPremium = new Set(temi.filter(x => x.premium).map(x => x.id));
  const schede = [];
  for (const [base, testi] of parti) {
    for (const b of base) {
      if (b.stato === "bozza" || !testi[b.id]) continue; // bozze e schede senza testo in questa lingua non si mostrano
      schede.push({ ...b, ...testi[b.id], tema: nomeTema.get(b.temi[0]), temaId: b.temi[0] });
    }
  }
  return { schede, temi: temi.map(x => ({ id: x.id, nome: nomeTema.get(x.id), nomi: x.nome, premium: x.premium })) };
}

// Una scheda è riservata ai piani a pagamento solo se TUTTI i suoi temi sono premium:
// basta un tema gratuito perché resti gratuita.
export function riservata(scheda) {
  return scheda.temi.every(id => temiPremium.has(id));
}

// Può chi ha questo piano vedere la scheda? Per ora tutto è gratuito: risponde sempre true.
// Non è ancora usata. Con i pagamenti diventerà: piano !== "gratis" || !riservata(scheda).
export function accessibile(scheda, piano) {
  return true;
}

// Ordine del feed: casuale ma uguale per tutto il giorno, finché non si rimescola.
export function semeDelGiorno() { const d = new Date(); return d.getFullYear() * 1000 + d.getMonth() * 40 + d.getDate(); }
function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; }; }
export function shuffle(a, r = Math.random) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
// Mescola evitando due schede dello stesso tipo (o tema) di fila, quando possibile.
export function mixVario(lista, seed) {
  const r = rng(seed); const pool = shuffle(lista, r); const out = [];
  while (pool.length) {
    const last = out[out.length - 1];
    let i = pool.findIndex(x => !last || (x.tipo !== last.tipo && x.tema !== last.tema));
    if (i < 0) i = pool.findIndex(x => !last || x.tipo !== last.tipo);
    if (i < 0) i = 0;
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}
