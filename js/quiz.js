// Quiz dentro la scheda: domanda a scelta multipla.
import { el } from "./dom.js";
import { t } from "./i18n.js";
import { LIBRI, shuffle } from "./dati.js";
import { impara } from "./salvataggi.js";

// Mentre il quiz è aperto, gli elementi .reveal della scheda restano sfocati.
export function makeQuiz(card, domanda, opzioni, giusta, { onRight, rightText, wrongText }) {
  const quiz = el("div", "quiz");
  const opts = el("div", "opts");
  const verdict = el("div", "verdict"); verdict.setAttribute("aria-live", "polite");
  quiz.append(el("p", null, domanda), opts, verdict);
  opzioni.forEach(o => {
    const b = el("button", "opt", o); b.type = "button";
    b.addEventListener("click", () => {
      opts.querySelectorAll(".opt").forEach(x => { x.disabled = true; if (x.textContent === giusta) x.classList.add("right"); });
      if (o === giusta) { verdict.textContent = rightText; onRight(); }
      else { b.classList.add("wrong"); verdict.textContent = wrongText; }
      card.classList.remove("quizzing");
    });
    opts.appendChild(b);
  });
  return quiz;
}

// Opere tra cui scegliere le risposte sbagliate del quiz sui libri.
let opereLibri = [];
export function preparaQuizLibri(schede) {
  opereLibri = [...new Set(schede.filter(x => LIBRI.has(x.tipo)).map(x => x.opera))];
}

// «Da quale libro?»: l'opera giusta e due sbagliate, in ordine casuale.
export function quizLibro(card, f) {
  const scelte = shuffle([f.opera, ...shuffle(opereLibri.filter(o => o !== f.opera)).slice(0, 2)]);
  return makeQuiz(card, f.tipo === "parola" ? t("quiz.domanda_parola") : t("quiz.domanda_libro"), scelte, f.opera, {
    onRight: () => impara(f.id), rightText: t("quiz.esatto_imparata"), wrongText: t("quiz.sbagliato_libro", { opera: f.opera }),
  });
}
