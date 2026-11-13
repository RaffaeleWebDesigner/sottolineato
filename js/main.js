// Avvio. Il caricamento dei dati parte subito, senza aspettare il resto del codice: gli altri moduli sono già in
// arrivo in parallelo grazie ai modulepreload di index.html (app.js li importa tutti). Così la prima scheda
// non aspetta che l'ultimo modulo sia scaricato.
import { LINGUA, caricaTraduzioni } from "./i18n.js";
import { leggiJson, caricaIndice } from "./dati.js";

const dati = Promise.all([caricaTraduzioni(leggiJson), caricaIndice(LINGUA)]);
dati.catch(() => {}); // l'errore lo mostra app.js

import("./app.js")
  .then(app => app.avvia(dati))
  .catch(err => {
    console.error(err);
    document.getElementById("stato-caricamento").hidden = true;
    document.getElementById("stato-errore").hidden = false;
  });
