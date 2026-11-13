// Salvate: elenco compatto (tipo, prima riga, tema), filtro per categoria, apertura, rimozione e ripasso.
import { el } from "./dom.js";
import { t } from "./i18n.js";
import { catalogo, testoPronto } from "./dati.js";
import { elencoSalvate, alternaSalvata } from "./salvataggi.js";
import { inCategoria } from "./filtri.js";
import { nomeTipo } from "./scheda.js";
import { daRipassare } from "./ripasso.js";
import { apriScheda } from "./aperta.js";
import { registraVista, vaiA } from "./nav.js";

let categoria = null; // filtro per categoria, solo in questa vista

const visibile = () => !document.getElementById("vista-salvate").hidden;

function riga(f) {
  const li = el("li", "riga-salvata");
  const apri = el("button", "riga"); apri.type = "button"; apri.style.setProperty("--tint", `var(--t-${f.temaId})`);
  const prima = testoPronto(f) ? f.testo.split("\n")[0] : t("caricamento.titolo");
  const testo = el("span", "nome");
  testo.append(el("small", "data", nomeTipo(f.tipo) + t("scheda.separatore") + f.tema), el("span", "riga-testo", prima));
  apri.append(el("span", "pallino"), testo);
  apri.addEventListener("click", () => apriScheda(f));
  const togli = el("button", "togli", "×"); togli.type = "button";
  togli.setAttribute("aria-label", t("salvate.togli", { testo: prima })); togli.title = t("salvate.togli_breve");
  togli.addEventListener("click", () => { alternaSalvata(f.id); });
  li.append(apri, togli); return li;
}

function render() {
  const radice = document.getElementById("salvate-contenuto");
  const ids = new Set(elencoSalvate());
  // Le più recenti per prime; si tengono solo quelle ancora nel catalogo (una scheda tornata in bozza sparisce).
  const tutte = elencoSalvate().reverse().map(id => catalogo.perId.get(id)).filter(Boolean);
  if (!tutte.length) {
    radice.replaceChildren(el("p", "onb-testo", t("salvate.vuoto_testo")));
    return;
  }
  const ripassa = el("button", "limite-primario", t("salvate.ripassa")); ripassa.type = "button";
  ripassa.addEventListener("click", () => vaiA("ripasso"));
  const dovute = daRipassare(tutte);
  const nota = el("p", "limite-nota", dovute ? t("salvate.da_rivedere", { n: dovute }) : t("salvate.niente_da_rivedere"));

  const chip = el("div", "chips wrap");
  const voci = [[null, t("salvate.tutte")], ...catalogo.categorie.map(c => [c.id, c.nome])];
  for (const [id, nome] of voci) {
    if (id && !tutte.some(f => inCategoria(f, id))) continue;
    const b = el("button", "chip", nome); b.type = "button"; b.setAttribute("aria-pressed", String(categoria === id));
    b.addEventListener("click", () => { categoria = id; render(); }); chip.append(b);
  }
  if (categoria && !tutte.some(f => inCategoria(f, categoria))) categoria = null;
  const mostrate = categoria ? tutte.filter(f => inCategoria(f, categoria)) : tutte;
  const lista = el("ul", "righe"); lista.append(...mostrate.map(riga));
  radice.replaceChildren(ripassa, nota, chip, lista);
}

export function inizializzaSalvate() {
  registraVista("salvate", { mostra: render });
  document.addEventListener("sott:salvate", () => { if (visibile()) render(); });
  document.addEventListener("sott:testi", () => { if (visibile()) render(); });
}
