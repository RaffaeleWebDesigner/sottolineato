// Rigenera le icone PNG in icone/ a partire dal disegno di favicon.svg.
// Strumento di servizio, non fa parte del sito: richiede Playwright installato (npm i -g playwright).
// Uso: node scripts/icone.mjs
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const radice = join(dirname(fileURLToPath(import.meta.url)), "..");
const font = readFileSync(join(radice, "fonts/Newsreader-normal-latin.woff2")).toString("base64");

// sfondo: "arrotondato" (angoli come favicon) oppure "pieno" (a tutto campo, per maschera e iOS)
// scala: quanto del lato occupa il disegno (la maschera Android ritaglia il 10% per lato)
function svg(dim, sfondo, scala) {
  const r = sfondo === "arrotondato" ? 14 : 0;
  const s = scala;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${dim}" height="${dim}" viewBox="0 0 64 64">
  <style>@font-face{font-family:N;font-weight:500;src:url(data:font/woff2;base64,${font}) format("woff2")}</style>
  <rect width="64" height="64" rx="${r}" fill="#17202b"/>
  <g transform="translate(32 32) scale(${s}) translate(-32 -32)">
    <rect x="10" y="36" width="44" height="12" rx="3" fill="#ffce1a" opacity=".9"/>
    <text x="32" y="45" text-anchor="middle" font-family="N, Georgia, serif" font-size="42" font-weight="500" fill="#ffffff">S</text>
  </g>
</svg>`;
}
const icone = [
  ["icon-192.png", 192, "arrotondato", 1],
  ["icon-512.png", 512, "arrotondato", 1],
  ["icon-maskable-512.png", 512, "pieno", 0.74],
  ["apple-touch-icon.png", 180, "pieno", 0.9],
];
const browser = await chromium.launch();
for (const [nome, dim, sfondo, scala] of icone) {
  const pagina = await browser.newPage({ viewport: { width: dim, height: dim }, deviceScaleFactor: 1 });
  await pagina.setContent(`<body style="margin:0;background:transparent">${svg(dim, sfondo, scala)}</body>`);
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.waitForTimeout(200);
  await pagina.screenshot({ path: join(radice, "icone", nome), omitBackground: sfondo === "arrotondato" });
  await pagina.close();
  console.log("scritta", nome);
}
await browser.close();
