// Limite giornaliero, piani e segno «Pro». Tutta la configurazione sta qui.
// Oggi il limite è spento: si accende solo con ?limite=1 nell'indirizzo, per provarlo. Non c'è ancora nessun pagamento.
import { contatoriDiOggi, aggiornaContatori } from "./cronologia.js";

export const CONFIG = {
  gratis: 10,         // schede nuove al giorno senza pagare
  perPubblicita: 5,   // schede in più per ogni pubblicità con premio
  pubblicitaMax: 3,   // pubblicità al giorno
  piani: { base: 50, pro: 140 }, // schede al giorno per piano (mensile)
};
export const LIMITE_ATTIVO = false;

// Con true le categorie premium (data/temi.json) mostrano un segno «Pro» in Esplora. Sul sito resta false.
// Non blocca nulla: accessibile() in dati.js risponde sempre true.
export const MOSTRA_PREMIUM = false;

export const limiteAttivo = () => LIMITE_ATTIVO || new URLSearchParams(location.search).get("limite") === "1";

// Il piano dell'utente: «gratis», «base» o «pro». Oggi tutti sono «gratis»; la fase 7 lo collegherà agli acquisti.
export const pianoCorrente = () => "gratis";

// Quante schede nuove può vedere oggi: quelle del piano più quelle sbloccate con le pubblicità.
export function consentite() {
  const piano = pianoCorrente();
  return (piano === "gratis" ? CONFIG.gratis : CONFIG.piani[piano]) + contatoriDiOggi().extra;
}
export const viste = () => contatoriDiOggi().nuove;
export const rimaste = () => Math.max(0, consentite() - viste());

// Pubblicità con premio ancora disponibili oggi (e solo per chi non ha un piano).
export const pubblicitaRimaste = () => (pianoCorrente() === "gratis" ? Math.max(0, CONFIG.pubblicitaMax - contatoriDiOggi().video) : 0);
export function sbloccaConPubblicita() {
  if (!pubblicitaRimaste()) return false;
  const c = contatoriDiOggi();
  aggiornaContatori({ video: c.video + 1, extra: c.extra + CONFIG.perPubblicita });
  return true;
}
