// Quiz dentro la scheda: domanda a scelta multipla.
// Prima della risposta nella scheda non c'è nulla che la riveli: la spiegazione si crea solo dopo (vedi scheda.js).
import { el } from "./dom.js";
import { t } from "./i18n.js";
import { LIBRI, shuffle } from "./dati.js";
import { impara } from "./salvataggi.js";
import { registraEsito } from "./cronologia.js";

// Risposte date in questa sessione: chi torna su un quiz già risposto lo trova aperto, senza effetti.
const sessione = new Map();
export const rispostaDiSessione = id => sessione.get(id);

// Crea la domanda con i pulsanti. alRisposta({ giusto, animato, bottone, dettaglio, quiz }) viene chiamata quando si risponde
// (animato = true) o con quiz.mostraRisposta(testo), se la risposta c'è già (animato = false).
export function creaQuiz({ id, domanda, opzioni, giusta, alRisposta }) {
  const quiz = el("div", "quiz");
  const opts = el("div", "opts");
  const dettaglio = el("div", "verdict");
  quiz.append(el("p", null, domanda), opts, dettaglio);
  const chiudi = (scelta, bottone, animato) => {
    opts.querySelectorAll(".opt").forEach(x => { x.disabled = true; if (x.dataset.valore === giusta) x.classList.add("right"); });
    const giusto = scelta === giusta;
    if (!giusto) bottone.classList.add("wrong");
    alRisposta({ giusto, animato, bottone, dettaglio, quiz });
  };
  for (const o of opzioni) {
    const b = el("button", "opt", o); b.type = "button"; b.dataset.valore = o;
    b.addEventListener("click", () => {
      sessione.set(id, o); registraEsito(id, o === giusta); if (o === giusta) impara(id);
      chiudi(o, b, true);
    });
    opts.appendChild(b);
  }
  // Per mostrare una risposta già data, dopo aver messo il quiz nella scheda.
  quiz.mostraRisposta = scelta => { const b = [...opts.children].find(x => x.dataset.valore === scelta); if (b) chiudi(scelta, b, false); };
  return quiz;
}

// Opere tra cui scegliere le risposte sbagliate del quiz sui libri.
let opereLibri = [];
export function preparaQuizLibri(schede) {
  opereLibri = [...new Set(schede.filter(x => LIBRI.has(x.tipo)).map(x => x.opera))];
}

// «Da quale libro?»: l'opera giusta e due sbagliate, in ordine casuale.
export function opzioniLibro(f) {
  return {
    domanda: f.tipo === "parola" ? t("quiz.domanda_parola") : t("quiz.domanda_libro"),
    opzioni: shuffle([f.opera, ...shuffle(opereLibri.filter(o => o !== f.opera)).slice(0, 2)]),
    giusta: f.opera,
  };
}
