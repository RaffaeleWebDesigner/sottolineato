// Testi dell'interfaccia. La lingua si decide qui, in un solo punto.
export const LINGUA = "it";

const SVILUPPO = ["localhost", "127.0.0.1", ""].includes(location.hostname);
let traduzioni = {};
const mancanti = new Set();

export async function caricaTraduzioni(leggiJson) {
  traduzioni = await leggiJson(`i18n/${LINGUA}.json`);
  document.documentElement.lang = LINGUA;
}

// t(chiave, valori): testo tradotto della chiave (es. gruppo.chiave), con i segnaposto {nome} sostituiti.
// Se la chiave manca mostra la chiave stessa e, in sviluppo, avvisa in console.
export function t(chiave, valori = {}) {
  const testo = chiave.split(".").reduce((o, k) => (o && typeof o === "object" ? o[k] : undefined), traduzioni);
  if (typeof testo !== "string") {
    if (SVILUPPO && !mancanti.has(chiave)) { mancanti.add(chiave); console.warn(`Traduzione mancante: ${chiave}`); }
    return chiave;
  }
  return testo.replace(/\{(\w+)\}/g, (m, k) => (k in valori ? String(valori[k]) : m));
}

// Riempie gli elementi statici di index.html: data-i18n per il testo, data-i18n-<attributo> per gli attributi.
export function traduciPagina() {
  for (const n of document.querySelectorAll("[data-i18n]")) n.textContent = t(n.dataset.i18n);
  for (const attr of ["aria-label", "title"]) {
    for (const n of document.querySelectorAll(`[data-i18n-${attr}]`)) n.setAttribute(attr, t(n.getAttribute(`data-i18n-${attr}`)));
  }
}
