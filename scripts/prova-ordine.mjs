// Prova di js/ordine.js senza browser: simula il feed e controlla le regole. Nessuna dipendenza.
// Uso: node scripts/prova-ordine.mjs   (esce con codice 1 se una regola non regge)
import { ordina, schedaDelGiorno, ordinaRipasso, ripassoDovuto, dopoRipasso, intervalloDopo, MAX_STESSO_TIPO, MAX_STESSO_TEMA } from "../js/ordine.js";

// Un catalogo finto con più o meno la forma di quello vero.
const TIPI = { mondo: 900, storica: 280, mito: 375, brillante: 140, frase: 60, idea: 50, parola: 70, sapevi: 94 };
const CATEGORIE = { "scienza-natura": ["scienza", "natura", "spazio", "corpo"], "storia-societa": ["storia", "societa", "potere", "economia"], "italia-parole": ["italia", "parole"], "arte-spettacolo": ["arte", "musica", "cinema", "fantasia"], "mente-vita": ["mente", "vita", "amore", "tempo", "coraggio", "lavoro"], "mondo-quotidiano": ["geografia", "cibo", "tecnologia", "sport"] };
const categoriaDiTema = {}; for (const [c, ts] of Object.entries(CATEGORIE)) for (const t of ts) categoriaDiTema[t] = c;
const temiTutti = Object.keys(categoriaDiTema);
let n = 0, caso = 12345;
const rnd = () => { caso = (caso * 1103515245 + 12345) & 0x7fffffff; return caso / 0x7fffffff; };
const catalogo = [];
for (const [tipo, quante] of Object.entries(TIPI)) for (let i = 0; i < quante; i++) {
  const temi = [temiTutti[Math.floor(rnd() * temiTutti.length)]];
  if (rnd() < 0.3) temi.push(temiTutti[Math.floor(rnd() * temiTutti.length)]);
  catalogo.push({ id: `${tipo}-${n++}`, tipo, temi, stato: rnd() < 0.25 ? "verificata" : "da_verificare" });
}

let errori = 0;
const controlla = (ok, msg) => { if (!ok) { errori++; console.log("  ✗ " + msg); } else console.log("  ✓ " + msg); };
const preferite = ["scienza-natura", "mente-vita"];
const opzioni = { categorie: preferite, categoriaDiTema, seme: 42 };
const dentro = s => s.temi.some(t => preferite.includes(categoriaDiTema[t]));

console.log(`Catalogo finto: ${catalogo.length} schede, ${catalogo.filter(s => s.stato === "verificata").length} verificate`);

console.log("\nUn feed da 200 schede, utente nuovo con due categorie preferite");
const feed = ordina(catalogo, opzioni).slice(0, 200);
controlla(feed.length === 200 && new Set(feed.map(s => s.id)).size === 200, "nessuna scheda ripetuta");
controlla(ordina(catalogo, opzioni).length === catalogo.length, "restituisce tutte le schede, una volta sola");
let viola = 0;
for (let i = 0; i < feed.length; i++) {
  if (i >= MAX_STESSO_TIPO && feed.slice(i - MAX_STESSO_TIPO, i + 1).every(x => x.tipo === feed[i].tipo)) viola++;
  if (i >= MAX_STESSO_TEMA && feed.slice(i - MAX_STESSO_TEMA, i + 1).every(x => x.temi[0] === feed[i].temi[0])) viola++;
}
controlla(viola === 0, `mai più di ${MAX_STESSO_TIPO} dello stesso tipo né ${MAX_STESSO_TEMA} dello stesso tema di fila (violazioni: ${viola})`);
const fuori = feed.filter(s => !dentro(s)).length / feed.length;
controlla(fuori > 0.22 && fuori < 0.38, `circa il 30% fuori dalle preferenze (${Math.round(fuori * 100)}%)`);
// A parità di condizioni (nuove, dentro le preferenze) le verificate vengono prima.
const classe = feed.filter(dentro);
const verificateInClasse = catalogo.filter(s => dentro(s) && s.stato === "verificata").length;
const testa = classe.slice(0, Math.min(60, verificateInClasse));
const quoteVerificate = testa.filter(s => s.stato === "verificata").length / testa.length;
controlla(quoteVerificate >= 0.9, `a parità di condizioni prima le verificate (${Math.round(quoteVerificate * 100)}% nelle prime ${testa.length})`);
const uguale = JSON.stringify(ordina(catalogo, opzioni).slice(0, 50).map(s => s.id)) === JSON.stringify(feed.slice(0, 50).map(s => s.id));
controlla(uguale, "stesso seme, stesso ordine");
controlla(JSON.stringify(ordina(catalogo, { ...opzioni, seme: 43 }).slice(0, 20).map(s => s.id)) !== JSON.stringify(feed.slice(0, 20).map(s => s.id)), "seme diverso, ordine diverso");

console.log("\nSenza preferenze");
const libero = ordina(catalogo, { seme: 7 }).slice(0, 200);
controlla(new Set(libero.map(s => s.id)).size === 200, "nessuna scheda ripetuta");
const verLibero = libero.slice(0, 60).filter(s => s.stato === "verificata").length / 60;
controlla(verLibero >= 0.9, `le verificate vengono prima (${Math.round(verLibero * 100)}% nelle prime 60)`);

console.log("\nSei sessioni da 50 schede, con la cronologia che cresce");
const cron = {}; const viste = new Set(); let giorno = 20000;
let ripetuteConNuove = 0, vistaPrimaDelleNuove = 0;
for (let sess = 0; sess < 6; sess++, giorno++) {
  const lista = ordina(catalogo, { ...opzioni, cronologia: cron, seme: sess + 1 });
  const nuoveInLista = lista.filter(s => !(s.id in cron)).length;
  const prime = lista.slice(0, 50);
  const nuovePrime = prime.filter(s => !(s.id in cron)).length;
  if (nuoveInLista >= 50 && nuovePrime < 50) ripetuteConNuove++;
  // tutte le nuove vengono prima di tutte le viste
  const primaVista = lista.findIndex(s => s.id in cron);
  if (primaVista >= 0 && lista.slice(primaVista).some(s => !(s.id in cron))) vistaPrimaDelleNuove++;
  for (const s of prime) { cron[s.id] = giorno; viste.add(s.id); }
}
controlla(ripetuteConNuove === 0, "nessuna ripetizione finché ci sono schede nuove");
controlla(vistaPrimaDelleNuove === 0, "le nuove vengono sempre prima di quelle già viste");
controlla(viste.size === 300, `300 schede diverse in 6 sessioni (${viste.size})`);

console.log("\nQuando le nuove finiscono: prima quelle viste da più tempo");
const tutte = Object.fromEntries(catalogo.map((s, i) => [s.id, 100 + (i % 10)]));
const giri = ordina(catalogo, { cronologia: tutte, seme: 3 });
// L'ordine per giorno può cedere solo per rispettare la regola dei tipi (2 di fila): mai più di un giorno di scarto.
let massimoVisto = 0, scarto = 0;
for (const s of giri) { massimoVisto = Math.max(massimoVisto, tutte[s.id]); scarto = Math.max(scarto, massimoVisto - tutte[s.id]); }
controlla(scarto <= 1 && giri.length === catalogo.length, `le viste vengono in ordine di giorno, le più vecchie prima (scarto massimo: ${scarto} giorno)`);

console.log("\nCasi stretti");
const soloMondo = catalogo.filter(s => s.tipo === "mondo");
controlla(ordina(soloMondo, { seme: 1 }).length === soloMondo.length, "un solo tipo: la regola dei tipi non regge ma restano tutte");
controlla(ordina([], {}).length === 0, "lista vuota");
const primo = catalogo[500].id;
controlla(ordina(catalogo, { ...opzioni, prima: primo })[0].id === primo, "la scheda indicata va per prima");
controlla(ordina(catalogo, { ...opzioni, prima: "non-esiste" }).length === catalogo.length, "una scheda «prima» che non c'è si ignora");

console.log("\nScheda del giorno");
for (const n of [278, 400, 2001]) {
  const ids = Array.from({ length: n }, (_, i) => "s" + i);
  const g0 = 20770; const sequenza = Array.from({ length: Math.min(n, 800) }, (_, i) => schedaDelGiorno(ids, g0 + i));
  const distinte = new Set(sequenza.slice(0, Math.min(n, 365))).size;
  controlla(distinte === Math.min(n, 365), `con ${n} schede, nessuna ripetizione nei primi ${Math.min(n, 365)} giorni`);
  controlla(schedaDelGiorno(ids, g0) === schedaDelGiorno(ids.slice(), g0), `con ${n} schede, stesso giorno stessa scheda`);
}
controlla(schedaDelGiorno([], 5) === null, "senza schede verificate non c'è scheda del giorno");
controlla(schedaDelGiorno(["solo"], 5) === "solo" && ["a", "b"].includes(schedaDelGiorno(["a", "b"], 7)), "con una o due schede risponde comunque");
const consecutive = Array.from({ length: 30 }, (_, i) => schedaDelGiorno(Array.from({ length: 500 }, (_, k) => "s" + k), 20000 + i));
controlla(new Set(consecutive).size === 30, "30 giorni di fila, 30 schede diverse");

console.log("\nRipasso delle salvate");
controlla([1, 2, 3, 4, 5, 9].map(intervalloDopo).join() === "1,3,7,30,30,30", "intervalli dopo 1, 2, 3 e 4 ripassi: 1, 3, 7 e 30 giorni");
let voce = null, g = 100;
const calendario = [];
for (let k = 0; k < 6; k++) { while (!ripassoDovuto(voce, g)) g++; calendario.push(g); voce = dopoRipasso(voce, g); }
controlla(calendario.slice(1).map((x, i) => x - calendario[i]).join() === "1,3,7,30,30", `giorni tra un ripasso e l'altro: ${calendario.slice(1).map((x, i) => x - calendario[i]).join(", ")}`);
controlla(JSON.stringify(dopoRipasso([2, 100], 101)) === "[2,100]", "ripassare in anticipo non fa avanzare");
const sav = ["a", "b", "c", "d", "e"].map(id => ({ id }));
const ripasso = { a: [1, 100], b: [2, 90], c: [3, 99], d: [1, 95] };
const ord = ordinaRipasso(sav, ripasso, 101).map(x => x.id).join("");
controlla(ord === "ebdac", `prima le mai ripassate, poi le più in ritardo, in fondo le non ancora dovute (${ord})`);

console.log(errori ? `\n${errori} controlli falliti.` : "\nTutti i controlli superati.");
process.exit(errori ? 1 : 0);
