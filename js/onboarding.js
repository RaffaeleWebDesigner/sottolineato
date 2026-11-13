// Onboarding: tre schermate al primo avvio (benvenuto, interessi, come funziona). Si può sempre saltare.
// Chi ha già salvate, imparate o un filtro per tipo è un utente esistente: niente onboarding.
// Se un giorno ci sarà più di una lingua, la scelta della lingua compare da sola come primo passo.
import { el } from "./dom.js";
import { t, LINGUE } from "./i18n.js";
import { store } from "./store.js";
import { catalogo } from "./dati.js";
import { impostaInteressi } from "./preferenze.js";

const MIN_CATEGORIE = 2;
const CHIAVI_UTENTE_ESISTENTE = ["sott-salvate", "sott-imparate", "sott-tipo"];

export function serveOnboarding() {
  if (store.get("sott-onboarding", false)) return false;
  let esistente = false;
  try { esistente = CHIAVI_UTENTE_ESISTENTE.some(k => localStorage.getItem(k) !== null); } catch { /* niente storage: si mostra */ }
  if (esistente) { store.set("sott-onboarding", true); return false; }
  return true;
}

// I passi, in ordine. La lingua c'è solo se le lingue sono più d'una e non è già stata scelta.
export function passiOnboarding(numeroLingue = LINGUE.length, linguaScelta = store.get("sott-lingua", null) !== null) {
  return [...(numeroLingue > 1 && !linguaScelta ? ["lingua"] : []), "benvenuto", "interessi", "come"];
}

const ICONE = {
  scorri: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
  salva: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
  quiz: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/></svg>',
};

const nomiLingue = () => ({ it: t("lingue.it"), en: t("lingue.en") });
const passiCome = () => [["scorri", t("onboarding.come_scorri")], ["salva", t("onboarding.come_salva")], ["quiz", t("onboarding.come_quiz")]];
const coloreCategoria = id => catalogo.temi.find(x => x.categoria === id)?.id;

// finito() viene chiamata quando l'onboarding si chiude (completato o saltato).
export function avviaOnboarding(finito) {
  const passi = passiOnboarding();
  let indice = 0;
  const scelte = new Set();
  const dialogo = el("dialog", "schermo onboarding");
  dialogo.setAttribute("aria-labelledby", "onb-titolo");
  document.body.appendChild(dialogo);

  const chiudi = (completato) => {
    if (completato && scelte.size >= MIN_CATEGORIE) impostaInteressi([...scelte]);
    store.set("sott-onboarding", true);
    dialogo.close(); dialogo.remove(); finito?.();
  };
  dialogo.addEventListener("cancel", e => { e.preventDefault(); chiudi(false); }); // Esc = salta

  function schermataLingua() {
    const lista = el("div", "scelte");
    for (const l of LINGUE) {
      const b = el("button", "grande", nomiLingue()[l] ?? l); b.type = "button";
      b.addEventListener("click", () => { store.set("sott-lingua", l); location.reload(); });
      lista.append(b);
    }
    return [el("h2", "onb-titolo", t("onboarding.lingua_titolo")), lista];
  }
  function schermataBenvenuto() {
    const marchio = el("p", "onb-marchio"); marchio.append(el("span", null, t("app.nome")));
    return [marchio, el("h2", "onb-titolo", t("onboarding.benvenuto_titolo")), el("p", "onb-testo", t("onboarding.benvenuto_testo"))];
  }
  function schermataInteressi(avanti) {
    const griglia = el("div", "riquadri");
    for (const c of catalogo.categorie) {
      const b = el("button", "riquadro", null); b.type = "button";
      b.style.setProperty("--tint", `var(--t-${coloreCategoria(c.id)})`);
      b.append(el("strong", null, c.nome));
      b.setAttribute("aria-pressed", String(scelte.has(c.id)));
      b.addEventListener("click", () => { scelte.has(c.id) ? scelte.delete(c.id) : scelte.add(c.id); b.setAttribute("aria-pressed", String(scelte.has(c.id))); avanti(); });
      griglia.append(b);
    }
    return [el("h2", "onb-titolo", t("onboarding.interessi_titolo")), el("p", "onb-testo", t("onboarding.interessi_testo")), griglia];
  }
  function schermataCome() {
    const lista = el("ul", "come");
    for (const [k, testo] of passiCome()) {
      const li = el("li"); const ic = el("span", "icona"); ic.innerHTML = ICONE[k];
      li.append(ic, el("span", null, testo)); lista.append(li);
    }
    return [el("h2", "onb-titolo", t("onboarding.come_titolo")), lista];
  }

  function disegna() {
    const passo = passi[indice], ultimo = indice === passi.length - 1;
    const avanti = el("button", "onb-avanti", ultimo ? t("onboarding.inizia") : t("onboarding.avanti")); avanti.type = "button";
    const aggiornaAvanti = () => { avanti.disabled = passo === "interessi" && scelte.size < MIN_CATEGORIE; };
    const contenuto = el("div", "onb-contenuto");
    contenuto.append(...({ lingua: schermataLingua, benvenuto: schermataBenvenuto, interessi: () => schermataInteressi(aggiornaAvanti), come: schermataCome })[passo]());
    const titolo = contenuto.querySelector(".onb-titolo"); titolo.id = "onb-titolo"; titolo.tabIndex = -1;

    const testa = el("div", "onb-testa");
    testa.append(el("span", "onb-passo", t("onboarding.passo", { n: indice + 1, tot: passi.length })));
    const salta = el("button", "onb-salta", t("onboarding.salta")); salta.type = "button"; salta.addEventListener("click", () => chiudi(false));
    testa.append(salta);

    const piede = el("div", "onb-piede");
    if (indice > 0) { const indietro = el("button", "onb-indietro", t("onboarding.indietro")); indietro.type = "button"; indietro.addEventListener("click", () => { indice--; disegna(); }); piede.append(indietro); }
    if (passo !== "lingua") piede.append(avanti);
    avanti.addEventListener("click", () => { if (ultimo) chiudi(true); else { indice++; disegna(); } });
    aggiornaAvanti();

    dialogo.replaceChildren(testa, contenuto, piede);
    titolo.focus({ preventScroll: true });
  }
  disegna();
  dialogo.showModal();
}
