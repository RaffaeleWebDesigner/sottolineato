// Pagina segnaposto dei piani. Nessun pagamento: i piani arrivano con la fase 7.
import { el } from "./dom.js";
import { t } from "./i18n.js";
import { CONFIG } from "./limiti.js";
import { registraVista } from "./nav.js";

function render() {
  const piani = el("div", "piani");
  for (const [chiave, prezzo] of [["base", t("pro.prezzo_base")], ["pro", t("pro.prezzo_pro")]]) {
    const c = el("div", "piano");
    c.append(el("h3", null, chiave === "base" ? t("pro.nome_base") : t("pro.nome_pro")), el("p", "prezzo", prezzo),
      el("p", null, t("pro.schede_al_giorno", { n: CONFIG.piani[chiave] })));
    const b = el("button", "chip", t("pro.presto")); b.type = "button"; b.disabled = true; c.append(b);
    piani.append(c);
  }
  document.getElementById("pro-contenuto").replaceChildren(el("p", "onb-testo", t("pro.intro")), piani, el("p", "limite-nota", t("pro.nota")));
}

export function inizializzaPro() { registraVista("pro", { mostra: render }); }
