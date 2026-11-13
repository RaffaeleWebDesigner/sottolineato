// Una scheda aperta a tutto schermo sopra la vista corrente (da Esplora, Salvate, archivio del giorno).
import { el } from "./dom.js";
import { t } from "./i18n.js";
import { testoPronto } from "./dati.js";
import { creaCard } from "./scheda.js";

export function apriScheda(f, { modo = "aperta", delGiorno = false } = {}) {
  const dialogo = el("dialog", "schermo aperta");
  dialogo.setAttribute("aria-label", t("aperta.titolo"));
  const chiudi = el("button", "aperta-chiudi", "×"); chiudi.type = "button"; chiudi.setAttribute("aria-label", t("aperta.chiudi"));
  chiudi.addEventListener("click", () => dialogo.close());
  const corpo = el("div", "aperta-corpo");
  const prima = document.activeElement;
  dialogo.append(chiudi, corpo);
  document.body.appendChild(dialogo); dialogo.showModal();
  dialogo.addEventListener("close", () => { document.removeEventListener("sott:testi", riprova); dialogo.remove(); prima?.focus?.({ preventScroll: true }); });
  // Se i testi di questo tipo non sono ancora arrivati, si aspetta.
  function riprova() {
    if (!testoPronto(f)) return;
    document.removeEventListener("sott:testi", riprova);
    const c = creaCard(f, 0, 0, { modo, delGiorno }); c.classList.add("seen");
    corpo.replaceChildren(c);
  }
  corpo.append(el("p", "limite-nota", t("caricamento.titolo")));
  if (testoPronto(f)) riprova(); else document.addEventListener("sott:testi", riprova);
  chiudi.focus({ preventScroll: true });
}
