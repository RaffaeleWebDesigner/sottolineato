// Date e giorni. Un «giorno» è un numero intero: i giorni dal 1 gennaio 1970 secondo il calendario locale.
// Tutto il resto del codice passa da qui, così l'azzeramento a mezzanotte è in un punto solo.
import { LINGUA } from "./i18n.js";

const MS_GIORNO = 86400000;

export const giornoDi = (d = new Date()) => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / MS_GIORNO);
export const oggi = () => giornoDi();

// Data da mostrare per un giorno, nella lingua dell'app. Il giorno è già «locale»: si formatta in UTC.
export function formattaGiorno(n, opzioni = { day: "numeric", month: "long", year: "numeric" }) {
  return new Intl.DateTimeFormat(LINGUA, { ...opzioni, timeZone: "UTC" }).format(new Date(n * MS_GIORNO));
}

// Minuti che mancano alla prossima mezzanotte locale.
export function minutiAMezzanotte() {
  const ora = new Date(), domani = new Date(ora.getFullYear(), ora.getMonth(), ora.getDate() + 1);
  return Math.max(1, Math.ceil((domani - ora) / 60000));
}
