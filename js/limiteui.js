// La schermata «Schede di oggi finite» e la pubblicità di prova. Si vedono solo con il limite acceso (?limite=1).
import { el } from "./dom.js";
import { t } from "./i18n.js";
import { CONFIG, pubblicitaRimaste, sbloccaConPubblicita } from "./limiti.js";
import { minutiAMezzanotte } from "./tempo.js";
import { vaiA } from "./nav.js";
import { numeroSalvate } from "./salvataggi.js";

export const DURATA_PUBBLICITA_PROVA = 2000; // ms

function testoMezzanotte() {
  const m = minutiAMezzanotte(), ore = Math.floor(m / 60), minuti = m % 60;
  return ore > 0 ? t("limite.tra_ore", { ore, minuti }) : t("limite.tra_minuti", { minuti });
}

// Oggi la pubblicità è finta: una finestra con un conto alla rovescia. Poi chiama finito().
function pubblicitaDiProva(finito) {
  const d = el("dialog", "pubblicita");
  d.setAttribute("aria-label", t("limite.pubblicita_titolo"));
  const sec = el("strong", "pubblicita-n"); const barra = el("div", "barra"); const pieno = el("div", "pieno"); barra.append(pieno);
  d.append(el("p", "pubblicita-etichetta", t("limite.pubblicita_titolo")), el("p", null, t("limite.pubblicita_testo")), sec, barra);
  document.body.appendChild(d); d.addEventListener("cancel", e => e.preventDefault()); d.showModal();
  const inizio = performance.now();
  const passo = () => {
    const e = performance.now() - inizio, resto = Math.max(0, Math.ceil((DURATA_PUBBLICITA_PROVA - e) / 1000));
    sec.textContent = String(resto); pieno.style.width = Math.min(100, (e / DURATA_PUBBLICITA_PROVA) * 100) + "%";
    if (e < DURATA_PUBBLICITA_PROVA) requestAnimationFrame(passo); else { d.close(); d.remove(); finito(); }
  };
  passo();
}

// La slide da mettere in fondo al feed. sbloccato() si chiama dopo ogni pubblicità guardata.
export function creaSchermataLimite(sbloccato) {
  const slide = el("section", "slide"); const c = el("div", "card limite");
  const tempo = el("p", "limite-tempo", testoMezzanotte());
  const aggiorna = setInterval(() => { if (!c.isConnected) { clearInterval(aggiorna); return; } tempo.textContent = testoMezzanotte(); }, 30000);
  const video = el("button", "limite-primario", t("limite.video", { n: CONFIG.perPubblicita })); video.type = "button";
  const rimaste = pubblicitaRimaste();
  video.disabled = rimaste === 0;
  video.addEventListener("click", () => pubblicitaDiProva(() => { if (sbloccaConPubblicita()) sbloccato(); }));
  const conto = el("p", "limite-nota", rimaste ? t("limite.video_rimasti", { n: rimaste, tot: CONFIG.pubblicitaMax }) : t("limite.video_finiti"));
  const pro = el("button", "limite-secondario", t("limite.pro")); pro.type = "button"; pro.addEventListener("click", () => vaiA("pro"));
  const ripassa = el("button", "limite-secondario", t("limite.ripassa")); ripassa.type = "button"; ripassa.disabled = numeroSalvate() === 0;
  ripassa.addEventListener("click", () => vaiA("ripasso"));
  c.append(el("h2", "limite-titolo", t("limite.titolo")), tempo, video, conto, pro, ripassa);
  slide.append(c); return slide;
}
