// Esporta e importa i dati dell'utente (salvate, imparate, progressi, preferenze) senza server:
// un codice di testo da copiare o un file. Serve soprattutto su iPhone, dove il sito installato
// ha un archivio separato da Safari, ma vale su ogni dispositivo.
const PREFISSO = "SOTT1:";
const ESCLUSE = new Set(["sott-invito-installa"]); // preferenze legate al dispositivo, non all'utente

const aBase64 = testo => { const byte = new TextEncoder().encode(testo); let s = ""; for (const b of byte) s += String.fromCharCode(b); return btoa(s); };
const daBase64 = b64 => Uint8Array.from(atob(b64), c => c.charCodeAt(0));

// Tutte le chiavi sott-* come testo JSON, così come sono nel localStorage.
export function creaCodice() {
  const dati = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.startsWith("sott-") && !ESCLUSE.has(k)) dati[k] = localStorage.getItem(k);
    }
  } catch { /* niente storage */ }
  return PREFISSO + aBase64(JSON.stringify(dati));
}

// Legge un codice (anche con spazi o a capo) e restituisce { dati, salvate, imparate } oppure null se non è valido.
export function leggiCodice(testo) {
  try {
    const pulito = String(testo).replace(/\s+/g, "");
    if (!pulito.startsWith(PREFISSO)) return null;
    const dati = JSON.parse(new TextDecoder().decode(daBase64(pulito.slice(PREFISSO.length))));
    if (!dati || typeof dati !== "object" || Array.isArray(dati)) return null;
    for (const [k, v] of Object.entries(dati)) {
      if (!k.startsWith("sott-") || ESCLUSE.has(k) || typeof v !== "string") return null;
      JSON.parse(v); // ogni valore deve essere JSON valido, come lo scrive store.js
    }
    const quante = k => { try { return JSON.parse(dati[k] ?? "[]").length; } catch { return 0; } };
    return { dati, salvate: quante("sott-salvate"), imparate: quante("sott-imparate") };
  } catch { return null; }
}

// Sostituisce i dati di questo dispositivo con quelli del codice. Poi il chiamante ricarica la pagina:
// le migrazioni all'avvio (sott-versione) aggiornano i dati di una versione più vecchia.
export function applicaCodice({ dati }) {
  const via = [];
  for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith("sott-") && !ESCLUSE.has(k)) via.push(k); }
  for (const k of via) localStorage.removeItem(k);
  for (const [k, v] of Object.entries(dati)) localStorage.setItem(k, v);
}
