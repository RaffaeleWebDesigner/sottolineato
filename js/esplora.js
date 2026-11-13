// Esplora: scelta di tipo e tema per il feed. (Prima versione: elenchi semplici; categorie e ricerca arrivano dopo.)
import { el } from "./dom.js";
import { t } from "./i18n.js";
import { catalogo } from "./dati.js";
import { TIPI_FILTRO, nomeTipoFiltro, impostaFiltro } from "./filtri.js";
import { registraVista, vaiA } from "./nav.js";

function bottone(testo, onClick) {
  const b = el("button", "chip", testo); b.type = "button"; b.addEventListener("click", onClick); return b;
}

function render() {
  const radice = document.getElementById("esplora-contenuto");
  const tipi = el("div", "chips wrap"), temi = el("div", "chips wrap");
  for (const k of TIPI_FILTRO.filter(x => x !== "salvate")) tipi.append(bottone(nomeTipoFiltro(k), () => { impostaFiltro({ tipo: k }); vaiA("feed"); }));
  for (const x of catalogo.temi) temi.append(bottone(x.nome, () => { impostaFiltro({ tema: x.id }); vaiA("feed"); }));
  radice.replaceChildren(tipi, temi);
}

export function inizializzaEsplora() {
  registraVista("esplora", { mostra: render });
}
