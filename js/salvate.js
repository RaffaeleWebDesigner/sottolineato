// Salvate: elenco delle schede salvate. (Prima versione: apre le salvate nel feed.)
import { el } from "./dom.js";
import { t } from "./i18n.js";
import { numeroSalvate } from "./salvataggi.js";
import { impostaFiltro } from "./filtri.js";
import { registraVista, vaiA } from "./nav.js";

function render() {
  const radice = document.getElementById("salvate-contenuto");
  const b = el("button", "chip", t("salvate.vedi_nel_feed", { n: numeroSalvate() })); b.type = "button";
  b.addEventListener("click", () => { impostaFiltro({ tipo: "salvate" }); vaiA("feed"); });
  radice.replaceChildren(b);
}

export function inizializzaSalvate() { registraVista("salvate", { mostra: render }); }
