// Dati salvati nel browser (localStorage) e loro migrazioni.
// Chiavi e formati sono elencati in CLAUDE.md: non cambiarli senza una migrazione.
export const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  remove(k) { try { localStorage.removeItem(k); } catch {} },
};

// Migrazioni in ordine di versione. sott-versione ricorda l'ultima eseguita.
// Le migrazioni future si aggiungono qui, con versione crescente.
const MIGRAZIONI = [
  {
    versione: 1,
    // sott-tema: dal nome del tema («Storia») al suo id («storia»). Valori sconosciuti vengono rimossi.
    esegui({ temi }) {
      const v = store.get("sott-tema", null);
      if (v === null) return;
      const tema = temi.find(x => x.id === v) || temi.find(x => Object.values(x.nomi).includes(v));
      if (tema) store.set("sott-tema", tema.id); else store.remove("sott-tema");
    },
  },
];

// contesto: ciò che serve alle migrazioni (oggi la lista dei temi).
export function migra(contesto) {
  let versione = Number(store.get("sott-versione", 0)) || 0;
  for (const m of MIGRAZIONI) {
    if (m.versione <= versione) continue;
    m.esegui(contesto); versione = m.versione; store.set("sott-versione", versione);
  }
}
