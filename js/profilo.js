// Profilo: progressi e preferenze. (Prima versione: i contatori.)
import { el } from "./dom.js";
import { t } from "./i18n.js";
import { numeroSalvate, numeroImparate } from "./salvataggi.js";
import { registraVista } from "./nav.js";

function render() {
  document.getElementById("profilo-contenuto").replaceChildren(
    el("p", "stats", t("intestazione.contatori", { imparate: numeroImparate(), salvate: numeroSalvate() })));
}

export function inizializzaProfilo() { registraVista("profilo", { mostra: render }); }
