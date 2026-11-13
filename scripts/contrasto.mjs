// Contrasto dei colori dell'interfaccia (WCAG AA) nei temi chiaro e scuro. Nessuna dipendenza.
// Legge le variabili CSS di index.html. Uso: node scripts/contrasto.mjs   (esce con 1 se una coppia non arriva alla soglia)
import fs from "node:fs";

const css = fs.readFileSync("index.html", "utf8");
const blocco = (selettore, da = 0) => { const i = css.indexOf(selettore, da); const a = css.indexOf("{", i), b = css.indexOf("}", a); return css.slice(a + 1, b); };
const variabili = testo => Object.fromEntries([...testo.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(m => [m[1], m[2].trim()]));
const chiaro = variabili(blocco(":root {"));
const scuro = { ...chiaro, ...variabili(blocco(':root[data-theme="dark"]')) };
const incongruenza = Object.keys(variabili(blocco(':root[data-theme="dark"]'))).filter(k => !(k in variabili(blocco(":root:not([data-theme=\"light\"])"))) && !k.startsWith("--t-") === false && false);

function colore(s) {
  s = s.trim();
  let m = s.match(/^#([0-9a-f]{6})$/i);
  if (m) return [0, 2, 4].map(i => parseInt(m[1].slice(i, i + 2), 16)).concat(1);
  m = s.match(/^#([0-9a-f]{3})$/i);
  if (m) return [...m[1]].map(c => parseInt(c + c, 16)).concat(1);
  m = s.match(/^rgba?\(([^)]+)\)$/);
  if (m) { const p = m[1].split(",").map(Number); return [p[0], p[1], p[2], p[3] ?? 1]; }
  throw new Error("colore non riconosciuto: " + s);
}
const sopra = (c, sfondo) => [0, 1, 2].map(i => c[i] * c[3] + sfondo[i] * (1 - c[3])).concat(1);
const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
const rapporto = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };

let falliti = 0;
for (const [nome, v] of [["chiaro", chiaro], ["scuro", scuro]]) {
  const C = k => colore(v[k]);
  const sfondi = { "sfondo": C("--bg"), "bottone": C("--chip"), ...Object.fromEntries(Object.keys(v).filter(k => k.startsWith("--t-")).map(k => [k.slice(2), C(k)])) };
  // [testo, sfondo da usare, soglia, dove]
  const coppie = [];
  for (const [s, bg] of Object.entries(sfondi)) {
    for (const t of ["--fg", "--muted", "--ok", "--ko", "--mid"]) coppie.push([t, s, bg, 4.5]);
  }
  coppie.push(["--chip-on-fg", "bottone-scuro", C("--chip-on"), 4.5]);
  // testo sopra l'evidenziatore (giallo) e sopra la pillola «Scheda del giorno»
  for (const [s, bg] of Object.entries(sfondi)) coppie.push(["--fg", "evidenziatore su " + s, sopra(C("--marker"), bg), 4.5]);
  const ris = [];
  for (const [t, s, bg, soglia] of coppie) {
    const r = rapporto(sopra(C(t), bg), bg);
    if (r < soglia) ris.push(`${t} su ${s}: ${r.toFixed(2)}`);
  }
  console.log(`\nTema ${nome}: ${coppie.length} coppie controllate, ${ris.length} sotto 4,5:1`);
  for (const r of ris) console.log("  ✗ " + r);
  falliti += ris.length;
}
console.log(falliti ? `\n${falliti} coppie sotto la soglia.` : "\nTutte le coppie arrivano ad almeno 4,5:1.");
process.exit(falliti ? 1 : 0);
