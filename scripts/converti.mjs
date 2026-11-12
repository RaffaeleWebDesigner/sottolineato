// Conversione una tantum dai vecchi file .js ai JSON del nuovo schema.
// Uso: node scripts/converti.mjs   (dalla radice del progetto)
// Dopo la conversione questo script va cancellato.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";

const radice = process.cwd();
const TIPI = ["frase", "idea", "parola", "sapevi", "storica", "mondo", "mito", "brillante"];
const CAMPI_BASE = ["autore", "anno", "rif", "trad"];
const CAMPI_TESTO = ["testo", "hl", "nota", "def", "spunto", "opera"];

// 1. Carica i file nell'ordine di index.html, ricordando da quale file arriva ogni scheda.
const html = fs.readFileSync(path.join(radice, "index.html"), "utf8");
const files = [...html.matchAll(/<script src="([^"]+\.js)"><\/script>/g)].map(m => m[1]).filter(f => f !== "app.js");
const sandbox = { window: {} };
vm.createContext(sandbox);
const origine = new Map(); // id → file
for (const f of files) {
  const prima = sandbox.window.CONTENUTI ? sandbox.window.CONTENUTI.length : 0;
  vm.runInContext(fs.readFileSync(path.join(radice, f), "utf8"), sandbox, { filename: f });
  for (const c of sandbox.window.CONTENUTI.slice(prima)) origine.set(c.id, f);
}
const TEMI = sandbox.window.TEMI;
const SCHEDE = sandbox.window.CONTENUTI;

// 2. Data di aggiunta: commit che ha creato il file di provenienza.
const dataFile = new Map();
for (const f of files) {
  const out = execFileSync("git", ["log", "--diff-filter=A", "--format=%as", "--", f], { cwd: radice, encoding: "utf8" }).trim().split("\n");
  const data = out[out.length - 1];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) throw new Error(`Data di creazione non trovata per ${f}`);
  dataFile.set(f, data);
}

// 3. Temi con id stabile.
const idTema = nome => nome.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
const temi = TEMI.map(nome => ({ id: idTema(nome), nome: { it: nome, en: nome }, premium: false }));
const mappaTemi = new Map(TEMI.map(n => [n, idTema(n)]));
if (new Set(temi.map(t => t.id)).size !== temi.length) throw new Error("Due temi danno lo stesso id");

// 4. Schede: base e testi italiani, separati per tipo, nello stesso ordine di oggi.
const base = Object.fromEntries(TIPI.map(t => [t, []]));
const testi = Object.fromEntries(TIPI.map(t => [t, {}]));
const pieno = v => v !== undefined && v !== null && v !== "";
for (const c of SCHEDE) {
  if (!TIPI.includes(c.tipo)) throw new Error(`Tipo sconosciuto: ${c.tipo} (${c.id})`);
  if (!mappaTemi.has(c.tema)) throw new Error(`Tema sconosciuto: ${c.tema} (${c.id})`);
  const b = { id: c.id, tipo: c.tipo, temi: [mappaTemi.get(c.tema)] };
  if (c.tipo === "mondo" || c.tipo === "mito") b.vero = c.vero;
  if (c.tipo === "storica") b.verdetto = c.verdetto;
  for (const k of CAMPI_BASE) if (pieno(c[k])) b[k] = c[k];
  b.stato = "da_verificare";
  b.aggiunta = dataFile.get(origine.get(c.id));
  base[c.tipo].push(b);
  const t = {};
  for (const k of CAMPI_TESTO) if (pieno(c[k])) t[k] = c[k];
  testi[c.tipo][c.id] = t;
  // Campi non previsti: meglio fermarsi che perderli.
  const noti = new Set(["id", "tipo", "tema", "vero", "verdetto", ...CAMPI_BASE, ...CAMPI_TESTO]);
  for (const k of Object.keys(c)) if (!noti.has(k)) throw new Error(`Campo non previsto «${k}» in ${c.id}`);
}

// 5. Scrittura: una scheda per riga, per diff leggibili.
const scriviLista = (file, lista) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, "[\n" + lista.map(o => "  " + JSON.stringify(o)).join(",\n") + "\n]\n");
};
const scriviMappa = (file, mappa) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const righe = Object.entries(mappa).map(([id, o]) => "  " + JSON.stringify(id) + ": " + JSON.stringify(o));
  fs.writeFileSync(file, "{\n" + righe.join(",\n") + "\n}\n");
};
fs.mkdirSync(path.join(radice, "data"), { recursive: true });
fs.writeFileSync(path.join(radice, "data", "temi.json"), JSON.stringify(temi, null, 2) + "\n");
for (const t of TIPI) {
  scriviLista(path.join(radice, "data", "schede", t + ".json"), base[t]);
  scriviMappa(path.join(radice, "data", "testi", "it", t + ".json"), testi[t]);
}
console.log(`Convertite ${SCHEDE.length} schede da ${files.length} file, ${temi.length} temi.`);
for (const t of TIPI) console.log(`  ${t}: ${base[t].length}`);
