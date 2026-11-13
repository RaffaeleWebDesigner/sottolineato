// Controllo dei contenuti di Sottolineato. Nessuna dipendenza.
// Uso: node scripts/controlla.mjs   (dalla radice del progetto)
// Esce con codice 1 se trova errori. Gli avvisi non bloccano.
import fs from "node:fs";
import path from "node:path";

// Le schede aggiunte dopo questa data di tipo mondo, mito e storica devono avere una fonte.
const DATA_CONVERSIONE = "2026-11-12";
const MAX_TESTO = 220;
const LINGUA_BASE = "it";
const LINGUE_ATTESE = ["it", "en"];

const TIPI = ["frase", "idea", "parola", "sapevi", "storica", "mondo", "mito", "brillante"];
const STATI = ["bozza", "da_verificare", "verificata"];
const VERDETTI = ["vera", "attribuita", "mai"];
const CON_FONTE = new Set(["mondo", "mito", "storica"]);
const CAMPI_BASE = new Set(["id", "tipo", "temi", "vero", "verdetto", "autore", "anno", "rif", "trad", "stato", "verificata_il", "fonte", "aggiunta", "immagine"]);
const CAMPI_TESTO = new Set(["testo", "hl", "nota", "def", "spunto", "opera"]);
// Campi obbligatori per tipo, nel file base e nei testi.
const OBBLIGATORI_BASE = {
  frase: ["autore"], idea: ["autore"], parola: ["autore"], sapevi: ["autore"], storica: ["autore", "verdetto"],
  mondo: ["vero"], mito: ["vero"], brillante: [],
};
const OBBLIGATORI_TESTO = {
  frase: ["opera"], idea: ["opera"], parola: ["opera", "def"], sapevi: ["opera"], storica: [],
  mondo: [], mito: [], brillante: ["def", "spunto"],
};

const radice = process.cwd();
const dati = path.join(radice, "data");
const errori = [];
const avvisi = [];
const errore = (dove, msg) => errori.push(`${dove}: ${msg}`);
const avviso = msg => avvisi.push(msg);
const dataValida = s => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
const leggi = file => {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch (e) { errore(path.relative(radice, file), `JSON non leggibile (${e.message})`); return null; }
};

// ——— Categorie e temi ———
// data/temi.json: { categorie: [...], temi: [...] }. Ogni tema appartiene a una sola categoria.
const fileTemi = leggi(path.join(dati, "temi.json")) || {};
if (!fileTemi || Array.isArray(fileTemi) || typeof fileTemi !== "object") errore("data/temi.json", "deve essere un oggetto con «categorie» e «temi»");
const categorie = Array.isArray(fileTemi.categorie) ? fileTemi.categorie : [];
const temi = Array.isArray(fileTemi.temi) ? fileTemi.temi : [];
if (!Array.isArray(fileTemi.categorie)) errore("data/temi.json", "manca la lista «categorie»");
if (!Array.isArray(fileTemi.temi)) errore("data/temi.json", "manca la lista «temi»");
const controllaVoce = (t, dove, ids, cosa) => {
  if (typeof t.id !== "string" || !/^[a-z0-9-]+$/.test(t.id)) errore(dove, "id mancante o non valido (solo minuscole, cifre e trattini)");
  else if (ids.has(t.id)) errore(dove, `id ${cosa} duplicato`);
  else ids.add(t.id);
  if (!t.nome || typeof t.nome[LINGUA_BASE] !== "string" || !t.nome[LINGUA_BASE]) errore(dove, `manca il nome in ${LINGUA_BASE}`);
  if (typeof t.premium !== "boolean") errore(dove, "premium deve essere true o false");
  for (const l of LINGUE_ATTESE) if (l !== LINGUA_BASE && !(t.nome && t.nome[l])) avviso(`${cosa === "della categoria" ? "Categoria" : "Tema"} «${t.id}» senza nome ${l}`);
};
const idCategorie = new Set();
for (const c of categorie) controllaVoce(c, `data/temi.json categorie [${c.id ?? "?"}]`, idCategorie, "della categoria");
const idTemi = new Set();
const temiPerCategoria = new Map();
for (const t of temi) {
  const dove = `data/temi.json temi [${t.id ?? "?"}]`;
  controllaVoce(t, dove, idTemi, "del tema");
  if (!idCategorie.has(t.categoria)) errore(dove, `categoria mancante o inesistente «${t.categoria ?? ""}»`);
  else temiPerCategoria.set(t.categoria, (temiPerCategoria.get(t.categoria) || 0) + 1);
}
for (const c of idCategorie) if (!temiPerCategoria.has(c)) avviso(`Categoria «${c}» senza temi`);

// fonte: una o più voci separate da « | ». Ogni voce è un URL http(s) valido oppure un riferimento
// bibliografico (autore, titolo, editore o rivista, anno: almeno una virgola e un anno di 3-4 cifre).
function problemiFonte(fonte) {
  if (typeof fonte !== "string" || !fonte.trim()) return ["fonte vuota o non è una stringa"];
  const problemi = [];
  for (const voce of fonte.split(" | ").map(v => v.trim())) {
    if (/^https?:\/\//i.test(voce)) {
      let u; try { u = new URL(voce); } catch { u = null; }
      if (!u || !u.hostname.includes(".") || /\s/.test(voce)) problemi.push(`fonte: URL non valido «${voce}»`);
    } else if (!(voce.includes(",") && /\b\d{3,4}\b/.test(voce) && voce.length >= 15)) {
      problemi.push(`fonte: «${voce}» non è un URL né un riferimento bibliografico (autore, titolo, editore, anno)`);
    }
  }
  return problemi;
}

// ——— Schede (file base) ———
const schede = new Map(); // id → scheda base
for (const tipo of TIPI) {
  const file = path.join(dati, "schede", `${tipo}.json`);
  if (!fs.existsSync(file)) { errore(`data/schede/${tipo}.json`, "file mancante"); continue; }
  const lista = leggi(file);
  if (!Array.isArray(lista)) { if (lista) errore(`data/schede/${tipo}.json`, "deve essere una lista"); continue; }
  for (const s of lista) {
    const dove = `data/schede/${tipo}.json [${s.id ?? "?"}]`;
    if (typeof s.id !== "string" || !s.id) { errore(dove, "id mancante"); continue; }
    if (schede.has(s.id)) { errore(dove, `id duplicato (già in data/schede/${schede.get(s.id).tipo}.json)`); continue; }
    schede.set(s.id, s);
    for (const k of Object.keys(s)) if (!CAMPI_BASE.has(k)) errore(dove, `campo sconosciuto «${k}»`);
    if (s.tipo !== tipo) errore(dove, `tipo «${s.tipo}» diverso dal file`);
    if (!Array.isArray(s.temi) || s.temi.length === 0) errore(dove, "temi mancante o vuoto");
    else {
      for (const t of s.temi) if (!idTemi.has(t)) errore(dove, `tema inesistente «${t}»`);
      if (new Set(s.temi).size !== s.temi.length) errore(dove, "tema ripetuto in temi");
    }
    for (const k of OBBLIGATORI_BASE[tipo] || []) if (s[k] === undefined || s[k] === "") errore(dove, `manca «${k}»`);
    if ("vero" in s && typeof s.vero !== "boolean") errore(dove, "vero deve essere true o false");
    if ("vero" in s && tipo !== "mondo" && tipo !== "mito") errore(dove, "vero è ammesso solo per mondo e mito");
    if ("verdetto" in s && !VERDETTI.includes(s.verdetto)) errore(dove, `verdetto non valido «${s.verdetto}»`);
    if ("verdetto" in s && tipo !== "storica") errore(dove, "verdetto è ammesso solo per storica");
    if ("trad" in s && typeof s.trad !== "boolean") errore(dove, "trad deve essere true o false");
    if (!STATI.includes(s.stato)) errore(dove, `stato non valido «${s.stato}»`);
    if (s.stato === "verificata" && !dataValida(s.verificata_il)) errore(dove, "stato verificata senza verificata_il valida");
    if (s.stato !== "verificata" && "verificata_il" in s) errore(dove, "verificata_il presente ma stato non è verificata");
    if (!dataValida(s.aggiunta)) errore(dove, "aggiunta mancante o non è una data AAAA-MM-GG");
    else if (s.aggiunta > DATA_CONVERSIONE && CON_FONTE.has(tipo) && !s.fonte) errore(dove, `scheda nuova di tipo ${tipo} senza fonte`);
    if (s.stato === "verificata" && !s.fonte) errore(dove, "stato verificata senza fonte");
    if ("fonte" in s) for (const p of problemiFonte(s.fonte)) errore(dove, p);
  }
}

// ——— Testi per lingua ———
const dirTesti = path.join(dati, "testi");
const lingue = fs.existsSync(dirTesti) ? fs.readdirSync(dirTesti).filter(l => fs.statSync(path.join(dirTesti, l)).isDirectory()).sort() : [];
if (!lingue.includes(LINGUA_BASE)) errore("data/testi", `manca la cartella ${LINGUA_BASE}`);
const perLingua = {};
for (const lingua of lingue) {
  const presenti = new Set();
  for (const tipo of TIPI) {
    const file = path.join(dirTesti, lingua, `${tipo}.json`);
    if (!fs.existsSync(file)) { if (lingua === LINGUA_BASE) errore(`data/testi/${lingua}/${tipo}.json`, "file mancante"); continue; }
    const mappa = leggi(file);
    if (!mappa || typeof mappa !== "object" || Array.isArray(mappa)) { if (mappa) errore(`data/testi/${lingua}/${tipo}.json`, "deve essere un oggetto indicizzato per id"); continue; }
    for (const [id, t] of Object.entries(mappa)) {
      const dove = `data/testi/${lingua}/${tipo}.json [${id}]`;
      const s = schede.get(id);
      if (!s) { errore(dove, "testo senza scheda nel file base"); continue; }
      if (s.tipo !== tipo) errore(dove, `la scheda è di tipo ${s.tipo}, non ${tipo}`);
      presenti.add(id);
      for (const k of Object.keys(t)) if (!CAMPI_TESTO.has(k)) errore(dove, `campo sconosciuto «${k}»`);
      for (const k of ["testo", "hl", "nota", ...(OBBLIGATORI_TESTO[s.tipo] || [])]) if (typeof t[k] !== "string" || !t[k]) errore(dove, `manca «${k}»`);
      if (typeof t.testo === "string" && typeof t.hl === "string" && t.hl && !t.testo.includes(t.hl)) errore(dove, `hl «${t.hl}» non è contenuto esattamente in testo`);
      if (typeof t.testo === "string" && t.testo.length > MAX_TESTO) errore(dove, `testo di ${t.testo.length} caratteri (massimo ${MAX_TESTO})`);
    }
  }
  perLingua[lingua] = presenti;
  if (lingua === LINGUA_BASE) for (const id of schede.keys()) if (!presenti.has(id)) errore(`data/schede/${schede.get(id).tipo}.json [${id}]`, `manca il testo in ${LINGUA_BASE}`);
}
for (const l of LINGUE_ATTESE) {
  if (l === LINGUA_BASE) continue;
  const presenti = perLingua[l] || new Set();
  const mancanti = [...schede.keys()].filter(id => !presenti.has(id));
  if (mancanti.length) avviso(`${mancanti.length} schede senza testo ${l}${mancanti.length <= 5 ? ": " + mancanti.join(", ") : ` (per esempio ${mancanti.slice(0, 5).join(", ")})`}`);
}

// ——— Testi dell'interfaccia (i18n) ———
// Chiavi usate: chiamate t("chiave") nel codice JavaScript e attributi data-i18n / data-i18n-<attributo> in index.html.
const fileI18n = path.join(radice, "i18n", `${LINGUA_BASE}.json`);
const chiaviI18n = new Set();
if (!fs.existsSync(fileI18n)) errore(`i18n/${LINGUA_BASE}.json`, "file mancante");
else {
  const appiattisci = (o, prefisso = "") => {
    for (const [k, v] of Object.entries(o)) {
      const chiave = prefisso ? `${prefisso}.${k}` : k;
      if (v && typeof v === "object" && !Array.isArray(v)) appiattisci(v, chiave);
      else if (typeof v === "string") chiaviI18n.add(chiave);
      else errore(`i18n/${LINGUA_BASE}.json`, `«${chiave}» deve essere un testo o un gruppo di testi`);
    }
  };
  const radiceI18n = leggi(fileI18n);
  if (radiceI18n) appiattisci(radiceI18n);
}
const fileCodice = [];
const cerca = dir => { for (const n of fs.readdirSync(dir, { withFileTypes: true })) {
  const p = path.join(dir, n.name);
  if (n.isDirectory()) { if (!["node_modules", ".git", "data", "scripts", "i18n"].includes(n.name)) cerca(p); }
  else if (/\.(m?js|html)$/.test(n.name)) fileCodice.push(p);
} };
cerca(radice);
const usate = new Map(); // chiave → primo file in cui compare
for (const file of fileCodice) {
  const testo = fs.readFileSync(file, "utf8");
  const rel = path.relative(radice, file);
  const segna = chiave => { if (!usate.has(chiave)) usate.set(chiave, rel); };
  if (file.endsWith(".html")) {
    for (const m of testo.matchAll(/data-i18n(?:-[a-z-]+)?="([^"]+)"/g)) segna(m[1]);
  } else {
    for (const m of testo.matchAll(/\bt\(\s*(["'])([^"']+)\1/g)) segna(m[2]);
    for (const m of testo.matchAll(/\bt\(\s*`/g)) avviso(`${rel}: chiamata t(\`…\`) con chiave dinamica, non controllabile`);
  }
}
for (const [chiave, file] of usate) if (!chiaviI18n.has(chiave)) errore(file, `chiave di traduzione «${chiave}» assente in i18n/${LINGUA_BASE}.json`);
const nonUsate = [...chiaviI18n].filter(k => !usate.has(k));
if (nonUsate.length) avviso(`${nonUsate.length} chiavi in i18n/${LINGUA_BASE}.json mai usate: ${nonUsate.join(", ")}`);

// ——— Moduli precaricati ———
// Ogni modulo di js/ deve stare tra i modulepreload di index.html: senza, il browser lo scopre solo dopo aver letto chi lo importa
// e il primo avvio si allunga di un giro di rete (circa mezzo secondo su Slow 4G).
{
  const pagina = fs.readFileSync(path.join(radice, "index.html"), "utf8");
  const precaricati = new Set([...pagina.matchAll(/<link rel="modulepreload"[^>]*href="js\/([^"]+)"/g)].map(m => m[1]));
  const presenti = fs.readdirSync(path.join(radice, "js")).filter(n => n.endsWith(".js"));
  for (const n of presenti) if (!precaricati.has(n)) errore("index.html", `js/${n} non è tra i modulepreload`);
  for (const n of precaricati) if (!presenti.includes(n)) errore("index.html", `modulepreload di js/${n}, che non esiste`);
}

// ——— Riepilogo ———
const conta = (chiave) => { const c = {}; for (const s of schede.values()) { const k = chiave(s); c[k] = (c[k] || 0) + 1; } return c; };
const stampa = (titolo, oggetto) => {
  console.log(`\n${titolo}`);
  const righe = Object.entries(oggetto).sort((a, b) => b[1] - a[1]);
  const largo = Math.max(...righe.map(([k]) => k.length), 4);
  for (const [k, v] of righe) console.log(`  ${k.padEnd(largo)}  ${String(v).padStart(5)}`);
};
console.log(`Sottolineato: ${schede.size} schede, ${idCategorie.size} categorie, ${idTemi.size} temi, lingue: ${lingue.join(", ") || "nessuna"}`);
stampa("Per tipo", conta(s => s.tipo));
const categoriaDi = new Map(temi.map(t => [t.id, t.categoria]));
stampa("Per categoria (del tema principale)", conta(s => categoriaDi.get(Array.isArray(s.temi) && s.temi[0]) || "?"));
stampa("Per tema principale", conta(s => (Array.isArray(s.temi) && s.temi[0]) || "?"));
stampa("Per stato", conta(s => s.stato));
stampa("Per lingua", Object.fromEntries(LINGUE_ATTESE.map(l => [l, (perLingua[l] || new Set()).size])));

if (avvisi.length) { console.log(`\nAvvisi (${avvisi.length}):`); for (const a of avvisi) console.log(`  - ${a}`); }
if (errori.length) {
  console.log(`\nErrori (${errori.length}):`);
  for (const e of errori.slice(0, 200)) console.log(`  - ${e}`);
  if (errori.length > 200) console.log(`  … e altri ${errori.length - 200}`);
  console.log("\nControllo NON superato.");
  process.exit(1);
}
console.log("\nControllo superato: nessun errore.");
