// Avvio: traduzioni, dati, migrazioni, poi filtri e feed.
import { LINGUA, caricaTraduzioni, traduciPagina, t } from "./i18n.js";
import { leggiJson, caricaDati } from "./dati.js";
import { migra } from "./store.js";
import { inizializzaSalvataggi, renderStats } from "./salvataggi.js";
import { preparaQuizLibri } from "./quiz.js";
import { inizializzaFiltri, renderChips, filtra, soloSalvate } from "./filtri.js";
import { inizializzaFeed, renderFeed, rimescola } from "./feed.js";

async function avvia() {
  let dati;
  try {
    await caricaTraduzioni(leggiJson);
    traduciPagina();
    dati = await caricaDati(LINGUA);
  } catch (err) {
    console.error(err);
    document.getElementById("stato-caricamento").hidden = true;
    document.getElementById("stato-errore").hidden = false;
    return;
  }
  const { schede, temi } = dati;

  migra({ temi }); // prima di leggere i salvataggi
  inizializzaSalvataggi();
  preparaQuizLibri(schede);
  inizializzaFeed();
  const aggiorna = () => renderFeed(filtra(schede), soloSalvate());
  inizializzaFiltri(temi, aggiorna);

  document.getElementById("mix").addEventListener("click", rimescola);
  document.getElementById("totale").textContent = t("app.totale", { n: schede.length });
  renderChips(); aggiorna(); renderStats();
}

avvia();
