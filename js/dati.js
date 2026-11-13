// Caricamento dei contenuti e regole sulle schede.
export const TIPI_DATI = ["frase", "idea", "parola", "sapevi", "storica", "mondo", "mito", "brillante"];
export const LIBRI = new Set(["frase", "idea", "parola", "sapevi"]);

// Versione dei contenuti: va aumentata a ogni modifica di data/ o i18n/, così il browser non usa copie vecchie.
export const VERSIONE_DATI = 8;

export const leggiJson = p => fetch(`${p}?v=${VERSIONE_DATI}`).then(r => { if (!r.ok) throw new Error(`${p}: ${r.status}`); return r.json(); });

let temiPremium = new Set();
const tipiConTesti = new Set();

// Il catalogo caricato: le schede visibili (niente bozze, solo con testo nella lingua), i temi, le categorie.
// Le viste lo leggono da qui; viene riempito da caricaIndice e ridotto da togliSchede.
export const catalogo = { schede: [], temi: [], categorie: [], perId: new Map(), categoriaDiTema: {} };

// Primo passo: temi e dati comuni di tutte le schede (file piccoli). Bastano per contare, filtrare e ordinare il feed.
// tema è il nome del tema principale, temi resta la lista completa di id. Le bozze non si mostrano.
export async function caricaIndice(lingua) {
  const [{ temi, categorie }, ...basi] = await Promise.all([
    leggiJson("data/temi.json"),
    ...TIPI_DATI.map(tipo => leggiJson(`data/schede/${tipo}.json`)),
  ]);
  const nomeTema = new Map(temi.map(x => [x.id, x.nome[lingua] || x.nome.it]));
  temiPremium = new Set(temi.filter(x => x.premium).map(x => x.id));
  const schede = basi.flat().filter(b => b.stato !== "bozza").map(b => ({ ...b, tema: nomeTema.get(b.temi[0]), temaId: b.temi[0] }));
  catalogo.schede = schede;
  catalogo.perId = new Map(schede.map(s => [s.id, s]));
  catalogo.temi = temi.map(x => ({ id: x.id, nome: nomeTema.get(x.id), nomi: x.nome, premium: x.premium, categoria: x.categoria }));
  catalogo.categorie = categorie.map(c => ({ id: c.id, nome: c.nome[lingua] || c.nome.it, premium: c.premium }));
  catalogo.categoriaDiTema = Object.fromEntries(temi.map(x => [x.id, x.categoria]));
  return catalogo;
}

// Toglie dal catalogo le schede senza testo nella lingua corrente.
export function togliSchede(ids) {
  const via = new Set(ids);
  catalogo.schede = catalogo.schede.filter(s => !via.has(s.id));
  catalogo.perId = new Map(catalogo.schede.map(s => [s.id, s]));
}

// La scheda ha già i suoi testi?
export const testoPronto = scheda => tipiConTesti.has(scheda.tipo);

// Secondo passo: i testi nella lingua scelta, un file per tipo. Prima il tipo indicato (quello della prima scheda
// in vista), da solo per non dividere la banda, poi tutti gli altri insieme. A ogni file arrivato chiama
// arrivato(tipo, senzaTesto): senzaTesto sono le schede di quel tipo che non hanno testo in questa lingua.
export async function caricaTesti(lingua, schede, primoTipo, arrivato) {
  const carica = async tipo => {
    const testi = await leggiJson(`data/testi/${lingua}/${tipo}.json`);
    const senzaTesto = [];
    for (const s of schede) if (s.tipo === tipo) { if (testi[s.id]) Object.assign(s, testi[s.id]); else senzaTesto.push(s.id); }
    tipiConTesti.add(tipo);
    arrivato(tipo, senzaTesto);
  };
  const resto = TIPI_DATI.filter(t => t !== primoTipo);
  if (primoTipo) await carica(primoTipo);
  await Promise.all(resto.map(carica));
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
