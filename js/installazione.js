// Sito installabile e offline: registra il service worker (sw.js), avvisa quando c'è una versione nuova,
// mostra l'indicatore «Offline». Niente di tutto questo serve a far partire il feed: si avvia dopo.
import { t, LINGUA } from "./i18n.js";
import { VERSIONE_DATI, TIPI_DATI } from "./dati.js";
import { el } from "./dom.js";

const contenitore = () => document.getElementById("avvisi-app");

// ——— Indicatore «Offline»: piccolo, solo finché manca la rete. ———
export function avviaIndicatoreOffline() {
  const contenitoreAvvisi = contenitore();
  if (!contenitoreAvvisi) return;
  const riga = el("div", "avviso-app avviso-offline", t("installazione.offline"));
  riga.id = "avviso-offline";
  const aggiorna = () => {
    if (navigator.onLine) riga.remove(); else contenitoreAvvisi.prepend(riga);
  };
  window.addEventListener("online", aggiorna);
  window.addEventListener("offline", aggiorna);
  aggiorna();
}

// ——— Avviso «Nuova versione disponibile»: mai un ricaricamento senza che l'utente lo chieda. ———
let avvisoMostrato = false;
let aggiornamentoRichiesto = false;

function mostraAvvisoAggiornamento(attesa) {
  if (avvisoMostrato) return;
  avvisoMostrato = true;
  const riga = el("div", "avviso-app avviso-aggiornamento");
  riga.append(el("span", null, t("installazione.nuova_versione")));
  const b = el("button", "avviso-bottone", t("installazione.aggiorna"));
  b.type = "button";
  b.addEventListener("click", () => {
    aggiornamentoRichiesto = true;
    b.disabled = true;
    attesa.postMessage({ tipo: "attiva" });
  });
  riga.append(b);
  contenitore()?.append(riga);
}

// Gli indirizzi esatti dei dati di questa versione (stessi di dati.js: con ?v=VERSIONE_DATI).
function indirizziDati() {
  const v = `?v=${VERSIONE_DATI}`;
  return {
    essenziali: [`i18n/${LINGUA}.json${v}`, `data/temi.json${v}`, ...TIPI_DATI.map(tipo => `data/schede/${tipo}.json${v}`)],
    testi: TIPI_DATI.map(tipo => `data/testi/${LINGUA}/${tipo}.json${v}`),
  };
}

// Da chiamare quando la prima scheda è già in vista (e i testi sono arrivati): non toglie banda all'avvio.
export async function registraServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  try {
    const registrazione = await navigator.serviceWorker.register("sw.js", { updateViaCache: "none" });

    // Una versione nuova pronta e in attesa (solo se c'è già una versione che controlla la pagina).
    const controlla = () => { if (registrazione.waiting && navigator.serviceWorker.controller) mostraAvvisoAggiornamento(registrazione.waiting); };
    controlla();
    registrazione.addEventListener("updatefound", () => {
      const nuovo = registrazione.installing;
      nuovo?.addEventListener("statechange", () => { if (nuovo.state === "installed") controlla(); });
    });
    // Solo dopo che l'utente ha toccato «Aggiorna» la nuova versione prende il controllo e la pagina si ricarica.
    navigator.serviceWorker.addEventListener("controllerchange", () => { if (aggiornamentoRichiesto) location.reload(); });

    // Se il sito resta aperto a lungo, ogni tanto si controlla se c'è una versione nuova (al massimo una volta all'ora).
    let ultimo = Date.now();
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && Date.now() - ultimo > 3600e3) { ultimo = Date.now(); registrazione.update().catch(() => {}); }
    });

    // Dati e traduzioni: il service worker scarica quelli che mancano e toglie le copie vecchie.
    const pronto = await navigator.serviceWorker.ready;
    const attivo = pronto.active;
    if (attivo) {
      const { essenziali, testi } = indirizziDati();
      const risparmioDati = navigator.connection?.saveData === true;
      attivo.postMessage({ tipo: "dati", essenziali, testi, scaricaTesti: !risparmioDati });
    }
  } catch (err) {
    console.warn("Service worker non attivo:", err);
  }
}
