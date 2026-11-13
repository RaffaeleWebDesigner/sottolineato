// Esplora: le 6 macro-categorie con i loro temi e le scorciatoie per tipo. Toccando categoria o tema si apre il feed filtrato.
import { el } from "./dom.js";
import { t } from "./i18n.js";
import { catalogo, testoPronto } from "./dati.js";
import { cerca, MAX_RISULTATI } from "./ricerca.js";
import { apriScheda } from "./aperta.js";
import { nomeTipo } from "./scheda.js";
import { TIPI_FILTRO, nomeTipoFiltro, impostaFiltro, inCategoria } from "./filtri.js";
import { MOSTRA_PREMIUM } from "./limiti.js";
import { registraVista, vaiA } from "./nav.js";

let categoriaAperta = null;

const nSchede = n => (n === 1 ? t("esplora.una_scheda") : t("esplora.n_schede", { n }));
// Il colore di una categoria è quello del suo primo tema in data/temi.json.
const coloreCategoria = id => catalogo.temi.find(x => x.categoria === id)?.id;

function apriFeed(filtro) { impostaFiltro(filtro); vaiA("feed"); }

function bottone(classe, testo) { const b = el("button", classe, testo); b.type = "button"; return b; }

function riquadro(c) {
  const n = catalogo.schede.filter(s => inCategoria(s, c.id)).length;
  const b = bottone("riquadro"); b.style.setProperty("--tint", `var(--t-${coloreCategoria(c.id)})`);
  b.append(el("strong", null, c.nome), el("span", null, nSchede(n)));
  if (MOSTRA_PREMIUM && c.premium) b.append(el("span", "pro", t("esplora.pro")));
  b.addEventListener("click", () => { categoriaAperta = c.id; render(); document.getElementById("titolo-esplora").focus({ preventScroll: true }); });
  return b;
}

function vistaCategorie() {
  const riquadri = el("div", "riquadri");
  riquadri.append(...catalogo.categorie.map(riquadro));
  const tipi = el("div", "chips wrap");
  for (const k of TIPI_FILTRO.filter(x => x !== "salvate")) {
    if (k === "tutto") continue;
    const b = bottone("chip", nomeTipoFiltro(k)); b.addEventListener("click", () => apriFeed({ tipo: k })); tipi.append(b);
  }
  const tutto = bottone("chip", nomeTipoFiltro("tutto")); tutto.addEventListener("click", () => apriFeed({})); tipi.prepend(tutto);
  return [el("h3", "sezione", t("esplora.categorie")), riquadri, el("h3", "sezione", t("esplora.per_tipo")), tipi];
}

function vistaCategoria(c) {
  const indietro = bottone("indietro", t("esplora.indietro"));
  indietro.addEventListener("click", () => { categoriaAperta = null; render(); });
  const tutta = bottone("grande", t("esplora.tutta_categoria", { nome: c.nome }));
  tutta.style.setProperty("--tint", `var(--t-${coloreCategoria(c.id)})`);
  tutta.addEventListener("click", () => apriFeed({ categoria: c.id }));
  const righe = el("ul", "righe");
  for (const x of catalogo.temi.filter(x => x.categoria === c.id)) {
    const n = catalogo.schede.filter(s => s.temi.includes(x.id)).length;
    const li = el("li"); const b = bottone("riga");
    b.style.setProperty("--tint", `var(--t-${x.id})`);
    b.append(el("span", "pallino"), el("span", "nome", x.nome), el("span", "n", nSchede(n)));
    b.addEventListener("click", () => apriFeed({ tema: x.id }));
    li.append(b); righe.append(li);
  }
  return [indietro, el("h3", "sezione", c.nome), tutta, el("h3", "sezione", t("esplora.temi")), righe];
}

// Ricerca: al posto delle categorie compare l'elenco dei risultati (al massimo 50).
function rigaRisultato(f) {
  const b = bottone("riga"); b.style.setProperty("--tint", `var(--t-${f.temaId})`);
  const testo = el("span", "nome");
  testo.append(el("small", "data", nomeTipo(f.tipo) + t("scheda.separatore") + f.tema), el("span", "riga-testo", f.testo.split("\n")[0]));
  const fonte = [f.autore, f.opera].filter(Boolean).join(t("scheda.separatore"));
  if (fonte) testo.append(el("span", "sub", fonte));
  b.append(el("span", "pallino"), testo);
  b.addEventListener("click", () => apriScheda(f));
  const li = el("li"); li.append(b); return li;
}

function aggiornaRicerca() {
  const campo = document.getElementById("cerca"), risultati = document.getElementById("esplora-risultati"), contenuto = document.getElementById("esplora-contenuto");
  const domanda = campo.value.trim();
  const attiva = domanda.length >= 2;
  risultati.hidden = !attiva; contenuto.hidden = attiva;
  if (!attiva) { risultati.replaceChildren(); return; }
  const trovate = cerca(catalogo.schede, domanda, MAX_RISULTATI + 1);
  const parziale = catalogo.schede.some(s => !testoPronto(s));
  const nodi = [];
  if (!trovate.length) nodi.push(el("p", "onb-testo", t("esplora.nessun_risultato", { domanda })));
  else {
    nodi.push(el("p", "limite-nota", trovate.length > MAX_RISULTATI ? t("esplora.primi_risultati", { n: MAX_RISULTATI }) : (trovate.length === 1 ? t("esplora.un_risultato") : t("esplora.n_risultati", { n: trovate.length }))));
    const lista = el("ul", "righe"); lista.append(...trovate.slice(0, MAX_RISULTATI).map(rigaRisultato)); nodi.push(lista);
  }
  if (parziale) nodi.push(el("p", "limite-nota", t("esplora.ancora_caricamento")));
  risultati.replaceChildren(...nodi);
}

function render() {
  const c = catalogo.categorie.find(x => x.id === categoriaAperta);
  if (!c) categoriaAperta = null;
  document.getElementById("esplora-contenuto").replaceChildren(...(c ? vistaCategoria(c) : vistaCategorie()));
}

export function inizializzaEsplora() {
  registraVista("esplora", { mostra: () => { render(); aggiornaRicerca(); }, nascondi: () => { categoriaAperta = null; } });
  let attesa;
  document.getElementById("cerca").addEventListener("input", () => { clearTimeout(attesa); attesa = setTimeout(aggiornaRicerca, 120); });
  document.addEventListener("sott:testi", () => { if (!document.getElementById("vista-esplora").hidden) aggiornaRicerca(); });
}
