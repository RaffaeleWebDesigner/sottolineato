// Profilo: progressi, preferenze e archivio delle schede del giorno.
import { el } from "./dom.js";
import { t } from "./i18n.js";
import { catalogo, testoPronto } from "./dati.js";
import { numeroSalvate, numeroImparate } from "./salvataggi.js";
import { cronologiaViste, schedeViste, giorniConsecutivi, statisticheQuiz } from "./cronologia.js";
import { interessi, impostaInteressi } from "./preferenze.js";
import { archivioGiorni } from "./giorno.js";
import { apriScheda } from "./aperta.js";
import { formattaGiorno } from "./tempo.js";
import { registraVista, vaiA } from "./nav.js";

// L'archivio delle schede del giorno passate, dalla data di installazione.
function sezioneArchivio() {
  const giorni = archivioGiorni();
  const sezione = el("section", "sezione-profilo");
  sezione.append(el("h3", "sezione", t("profilo.archivio")));
  if (!giorni.length) { sezione.append(el("p", "limite-nota", t("profilo.archivio_vuoto"))); return sezione; }
  const lista = el("ul", "righe");
  for (const { giorno, scheda } of giorni) {
    const b = el("button", "riga"); b.type = "button";
    b.style.setProperty("--tint", `var(--t-${scheda.temaId})`);
    const prima = testoPronto(scheda) ? scheda.testo.split("\n")[0] : t("caricamento.titolo");
    const testo = el("span", "nome"); testo.append(el("small", "data", formattaGiorno(giorno)), el("span", "riga-testo", prima));
    b.append(el("span", "pallino"), testo);
    b.addEventListener("click", () => apriScheda(scheda, { delGiorno: true }));
    const li = el("li"); li.append(b); lista.append(li);
  }
  sezione.append(lista); return sezione;
}

function numero(valore, etichetta, dettaglio) {
  const d = el("div", "numero");
  d.append(el("strong", null, valore), el("span", null, etichetta));
  if (dettaglio) d.append(el("small", null, dettaglio));
  return d;
}

// Giorni consecutivi, schede viste, quiz indovinati, schede per macro-categoria. Niente medaglie.
function sezioneProgressi() {
  const sezione = el("section", "sezione-profilo");
  const q = statisticheQuiz();
  const numeri = el("div", "numeri");
  numeri.append(
    numero(String(giorniConsecutivi()), t("profilo.giorni_consecutivi")),
    numero(String(schedeViste()), t("profilo.schede_viste")),
    numero(q.totale ? Math.round((q.giusti / q.totale) * 100) + "%" : "–", t("profilo.quiz_indovinati"), q.totale ? t("profilo.quiz_dettaglio", { giusti: q.giusti, tot: q.totale }) : t("profilo.quiz_nessuno")),
    numero(String(numeroImparate()), t("profilo.imparate"), t("profilo.salvate_n", { n: numeroSalvate() })));
  // Schede viste per categoria del tema principale.
  const conta = new Map(catalogo.categorie.map(c => [c.id, 0]));
  for (const id of Object.keys(cronologiaViste())) {
    const f = catalogo.perId.get(id); const c = f && catalogo.categoriaDiTema[f.temi[0]];
    if (c) conta.set(c, conta.get(c) + 1);
  }
  const massimo = Math.max(1, ...conta.values());
  const barre = el("ul", "barre");
  for (const c of catalogo.categorie) {
    const li = el("li"); const riga = el("div", "barra-riga");
    riga.append(el("span", null, c.nome), el("span", "n", String(conta.get(c.id))));
    const pista = el("div", "pista"); const riempi = el("div", "riempi"); riempi.style.width = (conta.get(c.id) / massimo) * 100 + "%";
    const primoTema = catalogo.temi.find(x => x.categoria === c.id)?.id; riempi.style.background = `var(--t-${primoTema})`;
    pista.append(riempi); li.append(riga, pista); barre.append(li);
  }
  sezione.append(el("h3", "sezione", t("profilo.progressi")), numeri, el("h3", "sezione", t("profilo.per_categoria")), barre);
  return sezione;
}

// Le categorie dell'onboarding, modificabili: pesano di più nel feed.
function sezionePreferenze() {
  const sezione = el("section", "sezione-profilo");
  const scelte = new Set(interessi());
  const chip = el("div", "chips wrap");
  for (const c of catalogo.categorie) {
    const b = el("button", "chip", c.nome); b.type = "button"; b.setAttribute("aria-pressed", String(scelte.has(c.id)));
    b.addEventListener("click", () => { scelte.has(c.id) ? scelte.delete(c.id) : scelte.add(c.id); b.setAttribute("aria-pressed", String(scelte.has(c.id))); impostaInteressi([...scelte]); });
    chip.append(b);
  }
  sezione.append(el("h3", "sezione", t("profilo.preferenze")), el("p", "limite-nota", t("profilo.categorie_testo")), chip);
  return sezione;
}

function render() {
  const piani = el("button", "chip", t("profilo.piani")); piani.type = "button"; piani.addEventListener("click", () => vaiA("pro"));
  document.getElementById("profilo-contenuto").replaceChildren(sezioneProgressi(), sezionePreferenze(), sezioneArchivio(), piani);
}

export function inizializzaProfilo() {
  registraVista("profilo", { mostra: render });
  document.addEventListener("sott:testi", () => { if (!document.getElementById("vista-profilo").hidden) render(); });
}
