// Profilo: progressi, preferenze e archivio delle schede del giorno.
import { el } from "./dom.js";
import { t } from "./i18n.js";
import { testoPronto } from "./dati.js";
import { numeroSalvate, numeroImparate } from "./salvataggi.js";
import { archivioGiorni } from "./giorno.js";
import { apriScheda } from "./aperta.js";
import { formattaGiorno } from "./tempo.js";
import { registraVista } from "./nav.js";

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

function render() {
  document.getElementById("profilo-contenuto").replaceChildren(
    el("p", "stats", t("intestazione.contatori", { imparate: numeroImparate(), salvate: numeroSalvate() })), sezioneArchivio());
}

export function inizializzaProfilo() {
  registraVista("profilo", { mostra: render });
  document.addEventListener("sott:testi", () => { if (!document.getElementById("vista-profilo").hidden) render(); });
}
