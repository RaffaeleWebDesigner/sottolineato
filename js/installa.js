// Installare il sito sul telefono. Android e Chrome: si intercetta l'invito del browser (beforeinstallprompt) e lo si
// offre noi, in Profilo e, discreto, nel feed dal terzo giorno d'uso. iPhone e iPad (Safari): l'invito non esiste,
// si spiega come fare. Una volta installato non si propone più niente.
import { el } from "./dom.js";
import { t } from "./i18n.js";
import { store } from "./store.js";
import { giorniDiUso } from "./cronologia.js";
import { vaiA } from "./nav.js";
import { creaCodice, leggiCodice, applicaCodice } from "./trasferimento.js";

const GIORNI_PRIMA_DELL_INVITO = 3;
let invitoBrowser = null; // l'evento beforeinstallprompt, tenuto da parte

// Subito all'importazione: l'evento può arrivare prima che l'interfaccia sia pronta.
window.addEventListener("beforeinstallprompt", evento => {
  evento.preventDefault(); // niente banner immediato del browser
  invitoBrowser = evento;
  document.dispatchEvent(new CustomEvent("sott:installabile"));
});
window.addEventListener("appinstalled", () => { invitoBrowser = null; document.dispatchEvent(new CustomEvent("sott:installabile")); });

export const installata = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;

// iPhone e iPad con Safari vero (non Chrome o Firefox per iOS, non i browser dentro altre app). iPadOS si presenta come Mac.
export function eSafariIOS() {
  const ua = navigator.userAgent;
  const ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return ios && /Safari\//.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA\//.test(ua);
}

// Si può proporre l'installazione adesso?
export const installabile = () => !installata() && (invitoBrowser !== null || eSafariIOS());

async function installa() {
  if (!invitoBrowser) return false;
  const evento = invitoBrowser; invitoBrowser = null;
  evento.prompt();
  const { outcome } = await evento.userChoice;
  document.dispatchEvent(new CustomEvent("sott:installabile"));
  return outcome === "accepted";
}

const ICONA_CONDIVIDI = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V3M8 7l4-4 4 4M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/></svg>';
const ICONA_AGGIUNGI = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/></svg>';

function passo(icona, testo) {
  const li = el("li", "passo-installa");
  const i = el("span", "passo-icona"); i.innerHTML = icona;
  li.append(i, el("span", null, testo)); return li;
}

// ——— Profilo: installazione e dati. ———
export function sezioneInstallazione() {
  if (!installabile()) return null;
  const sezione = el("section", "sezione-profilo");
  sezione.append(el("h3", "sezione", t("installa.titolo")), el("p", "limite-nota", t("installa.testo")));
  if (invitoBrowser) {
    const b = el("button", "chip", t("installa.bottone")); b.type = "button";
    b.addEventListener("click", async () => { await installa(); });
    sezione.append(b);
  } else if (eSafariIOS()) {
    const passi = el("ol", "passi-installa");
    passi.append(passo(ICONA_CONDIVIDI, t("installa.ios_condividi")), passo(ICONA_AGGIUNGI, t("installa.ios_aggiungi")));
    // Su iPhone il sito installato ha un archivio separato da Safari: i dati non lo seguono da soli.
    sezione.append(passi, el("p", "limite-nota", t("installa.ios_dati")));
  }
  return sezione;
}

export function sezioneDati() {
  const sezione = el("section", "sezione-profilo");
  const stato = el("p", "limite-nota stato-dati"); stato.setAttribute("role", "status");
  const messaggio = testo => { stato.textContent = testo; };
  sezione.append(el("h3", "sezione", t("dati.titolo")), el("p", "limite-nota", t("dati.testo")));

  // Esporta: codice da copiare (o da condividere) e file.
  const esporta = el("div", "chips wrap");
  const copia = el("button", "chip", t("dati.copia")); copia.type = "button";
  copia.addEventListener("click", async () => {
    const codice = creaCodice();
    try {
      if (navigator.share && !navigator.clipboard) await navigator.share({ text: codice });
      else await navigator.clipboard.writeText(codice);
      messaggio(t("dati.copiato"));
    } catch { messaggio(t("dati.copia_fallita")); campo.value = codice; campo.select(); }
  });
  const salva = el("button", "chip", t("dati.salva_file")); salva.type = "button";
  salva.addEventListener("click", () => {
    const url = URL.createObjectURL(new Blob([creaCodice()], { type: "text/plain" }));
    const a = el("a"); a.href = url; a.download = t("dati.nome_file"); document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    messaggio(t("dati.salvato"));
  });
  esporta.append(copia, salva);

  // Importa: incolla il codice o scegli il file; poi una conferma, perché sostituisce i dati di questo dispositivo.
  const campo = el("textarea", "campo-codice"); campo.rows = 2; campo.spellcheck = false; campo.autocomplete = "off";
  campo.placeholder = t("dati.incolla"); campo.setAttribute("aria-label", t("dati.incolla"));
  const importa = el("button", "chip", t("dati.importa")); importa.type = "button";
  const scegli = el("button", "chip", t("dati.importa_file")); scegli.type = "button";
  const file = el("input"); file.type = "file"; file.accept = ".txt,text/plain"; file.hidden = true;
  scegli.addEventListener("click", () => file.click());
  file.addEventListener("change", async () => { const f = file.files[0]; if (f) { campo.value = await f.text(); preparaImporta(); } file.value = ""; });

  let pronto = null;
  function preparaImporta() {
    const letto = leggiCodice(campo.value);
    if (!letto) { pronto = null; importa.textContent = t("dati.importa"); messaggio(t("dati.errore")); return; }
    pronto = letto; importa.textContent = t("dati.conferma", { salvate: letto.salvate, imparate: letto.imparate });
    messaggio(t("dati.sostituisce"));
  }
  importa.addEventListener("click", () => {
    if (!pronto) { preparaImporta(); return; }
    applicaCodice(pronto);
    location.reload();
  });
  campo.addEventListener("input", () => { pronto = null; importa.textContent = t("dati.importa"); messaggio(""); });

  const importaRiga = el("div", "chips wrap"); importaRiga.append(importa, scegli, file);
  sezione.append(esporta, campo, importaRiga, stato);
  return sezione;
}

// ——— Feed: invito discreto, dal terzo giorno d'uso, una volta sola. ———
const CHIAVE_INVITO = "sott-invito-installa";
let riga = null;

function aggiornaInvito() {
  const visibile = !store.get(CHIAVE_INVITO, false) && giorniDiUso() >= GIORNI_PRIMA_DELL_INVITO && installabile()
    && (location.hash === "#feed" || location.hash === "");
  if (!visibile) { riga?.remove(); riga = null; return; }
  if (riga) return;
  riga = el("div", "avviso-app avviso-invito");
  riga.append(el("span", null, t("installa.invito")));
  const azione = el("button", "avviso-bottone", invitoBrowser ? t("installa.bottone") : t("installa.come"));
  azione.type = "button";
  azione.addEventListener("click", async () => {
    if (invitoBrowser) { await installa(); store.set(CHIAVE_INVITO, true); aggiornaInvito(); }
    else vaiA("profilo");
  });
  const chiudi = el("button", "avviso-chiudi", "×"); chiudi.type = "button"; chiudi.setAttribute("aria-label", t("installa.non_ora"));
  chiudi.addEventListener("click", () => { store.set(CHIAVE_INVITO, true); aggiornaInvito(); });
  riga.append(azione, chiudi);
  document.getElementById("avvisi-app")?.append(riga);
}

export function avviaInvitoInstallazione() {
  window.addEventListener("hashchange", aggiornaInvito);
  document.addEventListener("sott:installabile", aggiornaInvito);
  aggiornaInvito();
}
