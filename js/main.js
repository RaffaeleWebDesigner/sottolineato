// Avvio: traduzioni e indice delle schede, migrazioni, filtri e feed; poi i testi delle schede, a partire
// da quelli che servono alla prima scheda in vista.
import { LINGUA, caricaTraduzioni, traduciPagina, t } from "./i18n.js";
import { leggiJson, caricaIndice, caricaTesti, testoPronto } from "./dati.js";
import { migra } from "./store.js";
import { inizializzaSalvataggi, renderStats } from "./salvataggi.js";
import { preparaQuizLibri } from "./quiz.js";
import { inizializzaFiltri, renderChips, filtra, soloSalvate } from "./filtri.js";
import { inizializzaFeed, renderFeed, rimescola, tipoInCima, continuaFeed, mostraErrore } from "./feed.js";

async function avvia() {
  let dati;
  try {
    [, dati] = await Promise.all([caricaTraduzioni(leggiJson), caricaIndice(LINGUA)]);
    traduciPagina();
  } catch (err) {
    console.error(err);
    document.getElementById("stato-caricamento").hidden = true;
    document.getElementById("stato-errore").hidden = false;
    return;
  }
  let { schede, temi } = dati;

  migra({ temi }); // prima di leggere i salvataggi
  inizializzaSalvataggi();
  inizializzaFeed();
  const aggiorna = () => renderFeed(filtra(schede), soloSalvate());
  inizializzaFiltri(temi, aggiorna);

  document.getElementById("mix").addEventListener("click", rimescola);
  const totale = () => { document.getElementById("totale").textContent = t("app.totale", { n: schede.length }); };
  totale(); renderChips(); aggiorna(); renderStats();

  try {
    await caricaTesti(LINGUA, schede, tipoInCima(), (tipo, senzaTesto) => {
      preparaQuizLibri(schede.filter(testoPronto));
      if (senzaTesto.length) {
        // Schede senza testo in questa lingua: non si mostrano, e conteggi e feed si ricalcolano.
        const via = new Set(senzaTesto);
        schede = schede.filter(s => !via.has(s.id));
        totale(); aggiorna();
      } else continuaFeed();
    });
  } catch (err) {
    console.error(err);
    mostraErrore();
  }
}

avvia();
