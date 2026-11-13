// Avvio: traduzioni e indice delle schede, migrazioni, salvataggi, filtri, viste; poi i testi delle schede,
// a partire da quelli che servono alla prima scheda in vista.
import { LINGUA, caricaTraduzioni, traduciPagina, t } from "./i18n.js";
import { leggiJson, caricaIndice, caricaTesti, testoPronto, togliSchede, catalogo } from "./dati.js";
import { migra } from "./store.js";
import { inizializzaSalvataggi } from "./salvataggi.js";
import { inizializzaCronologia } from "./cronologia.js";
import { inizializzaRipasso } from "./ripasso.js";
import { preparaQuizLibri } from "./quiz.js";
import { inizializzaFiltri } from "./filtri.js";
import { inizializzaFeed, aggiornaFeed, mostraFeed, sospendiFeed, tipoInCima, continuaFeed, mostraErrore } from "./feed.js";
import { inizializzaEsplora } from "./esplora.js";
import { inizializzaSalvate } from "./salvate.js";
import { inizializzaProfilo } from "./profilo.js";
import { inizializzaPro } from "./pro.js";
import { applicaAspetto, applicaDimensione } from "./preferenze.js";
import { registraVista, avviaNav } from "./nav.js";
import { serveOnboarding, avviaOnboarding } from "./onboarding.js";

async function avvia() {
  try {
    await Promise.all([caricaTraduzioni(leggiJson), caricaIndice(LINGUA)]);
    traduciPagina();
  } catch (err) {
    console.error(err);
    document.getElementById("stato-caricamento").hidden = true;
    document.getElementById("stato-errore").hidden = false;
    return;
  }

  applicaAspetto(); applicaDimensione();
  const primoAvvio = serveOnboarding(); // prima di qualunque scrittura nel localStorage
  migra({ temi: catalogo.temi }); // prima di leggere i salvataggi
  inizializzaSalvataggi();
  inizializzaCronologia(); inizializzaRipasso();
  inizializzaFiltri();
  inizializzaFeed();
  inizializzaEsplora(); inizializzaSalvate(); inizializzaProfilo(); inizializzaPro();
  registraVista("feed", { mostra: () => mostraFeed("feed") });
  registraVista("ripasso", { mostra: () => mostraFeed("ripasso") });
  document.getElementById("stato-caricamento")?.remove();
  document.getElementById("stato-errore")?.remove();
  // Con l'onboarding il feed si costruisce alla fine, con le preferenze scelte.
  if (primoAvvio) sospendiFeed(true);
  avviaNav();
  if (primoAvvio) avviaOnboarding(() => { sospendiFeed(false); aggiornaFeed(); }); else aggiornaFeed();

  try {
    await caricaTesti(LINGUA, catalogo.schede, tipoInCima(), (tipo, senzaTesto) => {
      preparaQuizLibri(catalogo.schede.filter(testoPronto));
      if (senzaTesto.length) {
        // Schede senza testo in questa lingua: non si mostrano, e conteggi e feed si ricalcolano.
        togliSchede(senzaTesto); aggiornaFeed();
      } else continuaFeed();
      document.dispatchEvent(new CustomEvent("sott:testi", { detail: { tipo } }));
    });
  } catch (err) {
    console.error(err);
    mostraErrore();
  }
}

avvia();
